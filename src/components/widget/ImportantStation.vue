<script setup>
import dayjs from 'dayjs'
import { reactive, computed, watch, onBeforeMount } from 'vue'
import {
  user_custom_storage_getAllByUserAndDate,
  user_custom_storage_addCustomStorage
} from '@/api/user'
import { curveLookup_getImportInfoById } from '@/api/curveLookup'
import { useSystemStore } from '@/stores/system'
import { useWPDStore } from '@/stores/wpd'
import { useDataSourceStore } from '@/stores/dataSource'

const systemStore = useSystemStore()
const userInfo = systemStore.userInfo
const refreshTime = computed(() => systemStore.refreshTime)

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const dataSourceStore = useDataSourceStore()
const updateImportantStation = computed(() => dataSourceStore.updateImportantStation)
const setImportantStationList = dataSourceStore.setImportantStationList

const tableData = reactive([])
const tableColumn = reactive([
  { title: '类型', field: 'type' },
  { title: '名称', field: 'name' },
  { title: '水位', field: 'waterLevel' },
  { title: '距水位', field: 'distanceWaterLevel' }
])

const defaultWatchStation = [
  {
    name: '安砂',
    type: 'WPStationRR',
    id: '70900550',
    infoType: '汛限水位',
    infoData: '-',
    flowData: '-',
    flowType: '坝上水位'
  },
  {
    name: '永安',
    type: 'WPStationZQ',
    id: '70900601',
    infoType: '警戒水位',
    infoData: '-',
    flowData: '-',
    flowType: '水位'
  },
  {
    name: '梅列',
    type: 'WPStationZQ',
    id: '70900800',
    infoType: '警戒水位',
    infoData: '-',
    flowData: '-',
    flowType: '水位'
  },
  {
    name: '沙县',
    type: 'WPStationZQ',
    id: '70900900',
    infoType: '警戒水位',
    infoData: '-',
    flowData: '-',
    flowType: '水位'
  }
]
const getImportantStation = async () => {
  // 清空表格数据
  tableData.splice(0, tableData.length)

  const getImportantStationRes = await user_custom_storage_getAllByUserAndDate({
    createBy: userInfo.id
  })
  if (getImportantStationRes.state === 0) {
    const station = JSON.parse(
      getImportantStationRes.data.content[0]?.cities == null
        ? '[]'
        : getImportantStationRes.data.content[0].cities
    )

    if (station.length > 0) {
      setImportantStationList(station)
      for (let i = 0; i < station.length; i++) {
        const getImportInfoByIdRes = await curveLookup_getImportInfoById({
          projectId,
          nodeId: station[i].id,
          nodeType: station[i].type,
          begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          end: refreshTime.value
        })
        // console.log(getImportInfoByIdRes, station[i])
        if (getImportInfoByIdRes.state === 0) {
          let type = ''
          switch (station[i].type) {
            case 'WPStationRR':
              type = '水库'
              break
            case 'WPStationZQ':
              type = '水文站'
              break
            case 'WPStationZZ':
              type = '水位站'
              break
            default:
              break
          }
          tableData.push({
            type,
            name: station[i].name,
            waterLevel: getImportInfoByIdRes.data.currentZ.value,
            distanceWaterLevel: getImportInfoByIdRes.data.deltaZ1.value
          })
        }
      }
    } else {
      const addCustomStorageRes = await user_custom_storage_addCustomStorage(
        {},
        {
          id: '',
          createBy: userInfo.id,
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          cities: JSON.stringify(defaultWatchStation)
        }
      )
      if (addCustomStorageRes.state === 0) {
        console.log('新增成功')
        await getImportantStation()
      } else {
        console.log('新增失败')
      }
    }
  }
}

onBeforeMount(() => {
  getImportantStation()
})

watch(
  () => updateImportantStation.value,
  () => {
    getImportantStation()
  }
)
</script>

<template>
  <div class="important-station">
    <el-table :data="tableData" height="100%" style="width: 100%">
      <el-table-column
        v-for="item in tableColumn"
        :key="item.field"
        :prop="item.field"
        :label="item.title"
      />
    </el-table>
  </div>
</template>

<style scoped>
.important-station {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
