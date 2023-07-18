<script setup>
import dayjs from 'dayjs'
import { reactive, computed, watch, onBeforeMount } from 'vue'
import { regimen_regimenQuery } from '@/api/regimen'
import { curveLookup_getImportInfoById } from '@/api/curveLookup'
import { useSystemStore } from '@/stores/system'
import { useWPDStore } from '@/stores/wpd'
import { useDataSourceStore } from '@/stores/dataSource'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const selectedDept = systemStore.selectedDept

const wpdStore = useWPDStore()
const projectId = wpdStore.projectId

const dataSourceStore = useDataSourceStore()
const waterEngineeringSituation = dataSourceStore.waterEngineeringSituation
const setWaterEngineeringSituation = dataSourceStore.setWaterEngineeringSituation

const areaId = selectedDept.code
const type = window.WPD.get('WPAdministrativeArea').get(areaId).level

const waterStation = reactive([
  { title: '超保证', color: 'red', value: 0 },
  { title: '超警戒', color: 'orange', value: 0 }
])
const tableColumn = reactive([
  { title: '名称', field: 'name' },
  { title: '水位', field: 'currentZ' },
  { title: '警戒水位', field: 'standardZ1' },
  { title: '保证水位', field: 'standardZ2' }
])
const tableData = reactive([
  { type: 'WPStationZQ', id: '70900900', name: '沙县' },
  { type: 'WPStationZQ', id: '70900601', name: '永安' },
  { type: 'WPStationZQ', id: '70900800', name: '梅列' }
])

const getWaterStation = async () => {
  // 重置value
  for (let i = 0; i < waterStation.length; i++) {
    waterStation[i].value = 0
  }
  const regimenQueryRes = await regimen_regimenQuery({
    areaId,
    roleType: type,
    projectId,
    stationType: ['WPStationZQ', 'WPStationZZ'],
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm:ss')
  })
  if (regimenQueryRes.state === 0) {
    waterStation[0].value =
      regimenQueryRes.data.WPStationZQ.outZQGuarantysCount +
      regimenQueryRes.data.WPStationZZ.outZZGuarantysCount
    waterStation[1].value =
      regimenQueryRes.data.WPStationZQ.outZQAlarmsCount +
      regimenQueryRes.data.WPStationZZ.outZZAlarmsCount

    setWaterEngineeringSituation('WPStationZQ', regimenQueryRes.data.WPStationZQ)
    setWaterEngineeringSituation('WPStationZZ', regimenQueryRes.data.WPStationZZ)
  }
}
const getCacheWaterStation = () => {
  waterStation[0].value =
    waterEngineeringSituation.WPStationZQ.outZQGuarantysCount +
    waterEngineeringSituation.WPStationZZ.outZZGuarantysCount
  waterStation[1].value =
    waterEngineeringSituation.WPStationZQ.outZQAlarmsCount +
    waterEngineeringSituation.WPStationZZ.outZZAlarmsCount
}

const getTableDataData = async () => {
  for (let i = 0; i < tableData.length; i++) {
    const getImportInfoByIdRes = await curveLookup_getImportInfoById({
      projectId,
      nodeId: tableData[i].id,
      nodeType: tableData[i].type,
      begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      end: refreshTime.value
    })
    if (getImportInfoByIdRes.state === 0) {
      tableData[i].currentZ = getImportInfoByIdRes.data.currentZ.value
      tableData[i].standardZ1 = getImportInfoByIdRes.data.standardZ1.value
      tableData[i].standardZ2 = getImportInfoByIdRes.data.standardZ2.value
    }
  }
}

onBeforeMount(() => {
  if (!waterEngineeringSituation.WPStationZZ || !waterEngineeringSituation.WPStationZQ) {
    getWaterStation()
  } else {
    getCacheWaterStation()
  }
  getTableDataData()
})

watch(
  () => refreshTime.value,
  () => {
    getWaterStation()
    getTableDataData()
  }
)
</script>

<template>
  <div class="water-situation">
    <div class="water-statistic">
      <div class="name">水文站/水位站</div>
      <div class="content">
        <el-card v-for="item in waterStation" :key="item.title">
          <span class="title">{{ item.title }}</span>
          <span class="value" :style="{ color: item.color }">{{ item.value }}</span>
        </el-card>
      </div>
    </div>

    <div class="water-table">
      <el-table :data="tableData" height="100%" style="width: 100%">
        <el-table-column
          v-for="item in tableColumn"
          :key="item.field"
          :prop="item.field"
          :label="item.title"
        />
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.water-situation {
  width: 100%;
  height: 100%;
  .water-statistic {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    .name {
      width: 40%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
    }
    .content {
      width: 60%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: space-between;
      :deep(.el-card) {
        width: 48%;
        height: 40px;
        .el-card__body {
          width: 100%;
          height: 100%;
          padding: 0 5px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .value {
            font-weight: bold;
          }
        }
      }
    }
  }
  .water-table {
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
