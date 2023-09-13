<script setup>
import dayjs from 'dayjs'
import lodash from 'lodash'
import { ElMessage } from 'element-plus'
import { ref, reactive, computed, onBeforeMount } from 'vue'
import { CirclePlus, Remove } from '@element-plus/icons-vue'
import {
  user_custom_storage_getAllByUserAndDate,
  user_custom_storage_updateCustomStorage
} from '@/api/user'
import { useSystemStore } from '@/stores/system'
import { useDataSourceStore } from '@/stores/dataSource'

const systemStore = useSystemStore()
const userInfo = systemStore.userInfo

const dataSourceStore = useDataSourceStore()
const importantStationList = computed(() => dataSourceStore.importantStationList)
const setImportantStationList = dataSourceStore.setImportantStationList
const setUpdateImportantStation = dataSourceStore.setUpdateImportantStation

const WPStationRR = window.WPD.get('WPStationRR')
const WPStationZQ = window.WPD.get('WPStationZQ')
const WPStationZZ = window.WPD.get('WPStationZZ')

const WPStationList = reactive([])
const allWPStation = reactive([])
const searchValue = ref('')
let copyWPStationList = null

const getImportantStationList = async () => {
  if (importantStationList.value) {
    for (let i = 0; i < importantStationList.value.length; i++) {
      const station = importantStationList.value[i]
      window.WPD.get(station.type).get(station.id).importantStation = true
    }
  } else {
    const getAllByUserAndDateRes = await user_custom_storage_getAllByUserAndDate({
      createBy: userInfo.id
    })
    if (getAllByUserAndDateRes.state === 0) {
      // console.log(getAllByUserAndDateRes.data)
      const stations = JSON.parse(
        getAllByUserAndDateRes.data.content[0]?.cities == null
          ? '[]'
          : getAllByUserAndDateRes.data.content[0].cities
      )
      setImportantStationList(stations)
      for (let i = 0; i < stations.length; i++) {
        const station = stations[i]
        window.WPD.get(station.type).get(station.id).importantStation = true
      }
    }
  }
}

const initWPStationList = () => {
  const WPStationRRList = {
    title: '水库站',
    list: []
  }
  WPStationRR.forEach((item) => {
    item.value = item.name
    item.importantStation = false
    WPStationRRList.list.push(item)
    allWPStation.push(item)
  })
  WPStationList.push(WPStationRRList)

  const WPStationZQList = {
    title: '水文站',
    list: []
  }
  WPStationZQ.forEach((item) => {
    item.value = item.name
    item.importantStation = false
    WPStationZQList.list.push(item)
    allWPStation.push(item)
  })
  WPStationList.push(WPStationZQList)

  const WPStationZZList = {
    title: '水位站',
    list: []
  }
  WPStationZZ.forEach((item) => {
    item.value = item.name
    item.importantStation = false
    WPStationZZList.list.push(item)
    allWPStation.push(item)
  })
  WPStationList.push(WPStationZZList)

  copyWPStationList = lodash.cloneDeep(WPStationList)
}

onBeforeMount(async () => {
  await initWPStationList()
  await getImportantStationList()
})

const changeImportantStation = (row) => {
  row.importantStation = !row.importantStation
  updateImportantStation(row)
}

const updateImportantStation = async (row) => {
  let stations = []
  if (row.importantStation) {
    stations = [
      ...importantStationList.value,
      {
        name: row.name,
        type: row.idx_tempName,
        id: row.id,
        infoType: row.idx_tempName === 'WPStationRR' ? '防洪限制水位' : '警戒水位',
        infoData: '-',
        flowData: '-',
        flowType: row.idx_tempName === 'WPStationRR' ? '坝上水位' : '水位'
      }
    ]
  } else {
    stations = importantStationList.value.filter((item) => item.id !== row.id)
  }

  const addCustomStorageRes = await user_custom_storage_updateCustomStorage(
    {},
    {
      id: '',
      createBy: userInfo.id,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      cities: JSON.stringify(lodash.uniqBy(stations, 'id'))
    }
  )
  // console.log(addCustomStorageRes)
  if (addCustomStorageRes.state === 0) {
    ElMessage.success('重点站更新成功')
    setImportantStationList(stations)
    setUpdateImportantStation()
  }
}

const querySearch = (queryString, cb) => {
  const results = queryString
    ? allWPStation.filter((item) => {
        return item.value?.toLowerCase().indexOf(queryString.toLowerCase()) > -1
      })
    : allWPStation
  cb(results)
}

const selectStation = (item) => {
  WPStationList.splice(0, WPStationList.length)
  WPStationList.push({
    title:
      item.idx_tempName === 'WPStationRR'
        ? '水库站'
        : item.idx_tempName === 'WPStationZQ'
        ? '水文站'
        : '水位站',
    list: [item]
  })
}

const clearSelectedStation = () => {
  WPStationList.splice(0, WPStationList.length, ...copyWPStationList)
}
</script>

<template>
  <div class="important-station-watch-list">
    <el-autocomplete
      placeholder="请输入内容"
      clearable
      v-model="searchValue"
      :fetch-suggestions="querySearch"
      @select="selectStation"
      @clear="clearSelectedStation"
    />
    <div class="content">
      <el-collapse class="collapse-content">
        <el-collapse-item
          v-for="stations in WPStationList"
          :key="stations.title"
          :title="stations.title"
        >
          <el-table max-height="300" :data="stations.list">
            <el-table-column prop="name" label="名称" align="center" />
            <el-table-column prop="importStation" label="" align="center" width="100">
              <template #default="scope">
                <el-icon
                  class="plus"
                  v-if="!scope.row.importantStation"
                  @click="changeImportantStation(scope.row)"
                >
                  <CirclePlus />
                </el-icon>
                <el-icon class="remove" v-else @click="changeImportantStation(scope.row)">
                  <Remove />
                </el-icon>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
.important-station-watch-list {
  width: 100%;
  height: 100%;
  :deep(.el-autocomplete) {
    margin: 10px 0;
    width: 100%;
  }
  :deep(.el-table__header-wrapper) {
    display: none;
  }
  .content {
    width: 100%;
    height: 100%;
    .collapse-content {
      width: 100%;
      height: 100%;
      overflow: auto;
      :deep(.el-collapse-item__content) {
        padding: 0;
      }
      .plus,
      .remove {
        font-size: 20px;
        cursor: pointer;
      }
      .remove {
        color: red;
      }
    }
  }
}
</style>
