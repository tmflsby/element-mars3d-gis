<script setup>
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { reactive, computed, watch, onBeforeMount } from 'vue'
import { regimen_regimenQuery } from '@/api/regimen'
import { curveLookup_getImportInfoById } from '@/api/curveLookup'
import { tool_storage_getStorageByLevel } from '@/api/tool'
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

const engineeringStation = reactive([
  { title: '超正常高', color: 'red', value: 0 },
  { title: '超汛限', color: 'orange', value: 0 }
])
const anShaStation = reactive({
  name: '安砂水库',
  id: '70900550',
  type: 'WPStationRR'
})

const getEngineeringStation = async () => {
  // 重置value
  for (let i = 0; i < engineeringStation.length; i++) {
    engineeringStation[i].value = 0
  }
  const regimenQueryRes = await regimen_regimenQuery({
    areaId,
    roleType: type,
    projectId,
    stationType: ['WPStationZQ', 'WPStationZZ', 'WPStationRR'],
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm:ss')
  })
  if (regimenQueryRes.state === 0) {
    engineeringStation[0].value = regimenQueryRes.data.WPStationRR.outRRFhControlsCount
    engineeringStation[1].value = regimenQueryRes.data.WPStationRR.outRRXhsCount

    setWaterEngineeringSituation('WPStationRR', regimenQueryRes.data.WPStationRR)
  }
}
const getCacheEngineeringStation = () => {
  engineeringStation[0].value = waterEngineeringSituation.WPStationRR.outRRFhControlsCount
  engineeringStation[1].value = waterEngineeringSituation.WPStationRR.outRRXhsCount
}

const getAnShaStationData = async () => {
  const getImportInfoByIdRes = await curveLookup_getImportInfoById({
    projectId,
    nodeId: anShaStation.id,
    nodeType: anShaStation.type,
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: refreshTime.value
  })
  if (getImportInfoByIdRes.state === 0) {
    anShaStation.currentZ = getImportInfoByIdRes.data.currentZ.value
    anShaStation.standardZ1 = getImportInfoByIdRes.data.standardZ1.value
    anShaStation.standardZ2 = getImportInfoByIdRes.data.standardZ2.value

    const getStorageByLevelRes = await tool_storage_getStorageByLevel(
      {
        projectId,
        funcId: ''
      },
      [
        {
          level: anShaStation.currentZ,
          nodeId: anShaStation.id
        }
      ]
    )

    if (getStorageByLevelRes.state === 0) {
      const storage = getStorageByLevelRes.data[0].storage.data
      for (let i = 0; i < storage.length; i++) {
        // FLD_RR_VFld_Remain 剩余防洪库容
        if (storage[i].key === 'FLD_RR_VFld_Remain') {
          anShaStation.remainStorage = storage[i].value
          anShaStation.unitSymbol = storage[i].unitSymbol
        }
        // FLD_RR_VFld_Used 已用防洪库容
        if (storage[i].key === 'FLD_RR_VFld_Used') {
          anShaStation.usedStorage = storage[i].value
          anShaStation.unitSymbol = storage[i].unitSymbol
        }
      }

      initChart()
    }
  }
}

let chart = null
const initChart = () => {
  const liquidFillValue = +(
    anShaStation.remainStorage /
    (anShaStation.remainStorage + anShaStation.usedStorage)
  ).toFixed(4)

  // console.log(liquidFillValue, '===============')
  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(document.querySelector('.chart-container'), 'dark')
  const option = {
    title: {
      text: anShaStation.name,
      left: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 20
      }
    },
    series: [
      {
        type: 'liquidFill',
        data: [liquidFillValue, liquidFillValue, liquidFillValue],
        radius: '80%',
        center: ['50%', '60%'],
        outline: {
          show: false
        },
        label: {
          show: true,
          fontSize: 20,
          color: '#fff',
          formatter: function (param) {
            return param.value * 100 + '%'
          }
        },
        itemStyle: {
          color: '#00BFFF'
        }
      }
    ]
  }
  chart.setOption(option)
}

onBeforeMount(() => {
  if (!waterEngineeringSituation.WPStationRR) {
    getEngineeringStation()
  } else {
    getCacheEngineeringStation()
  }
  getAnShaStationData()
})

watch(
  () => refreshTime.value,
  () => {
    getEngineeringStation()
    getAnShaStationData()
  }
)
</script>

<template>
  <div class="engineering-situation">
    <div class="engineering-statistic">
      <div class="name">水库</div>
      <div class="content">
        <el-card v-for="item in engineeringStation" :key="item.title">
          <span class="title">{{ item.title }}</span>
          <span class="value" :style="{ color: item.color }">{{ item.value }}</span>
        </el-card>
      </div>
    </div>
    <div class="engineering-content">
      <div class="chart-container"></div>
      <div class="statistic-container">
        <el-descriptions border :column="1">
          <el-descriptions-item label="当前水位">
            {{ anShaStation.currentZ }} m
          </el-descriptions-item>
          <el-descriptions-item label="动用防洪库容">
            {{ anShaStation.usedStorage }} {{ anShaStation.unitSymbol }}
          </el-descriptions-item>
          <el-descriptions-item label="剩余防洪库容">
            {{ anShaStation.remainStorage }} {{ anShaStation.unitSymbol }}
          </el-descriptions-item>
          <el-descriptions-item label="汛限水位">
            {{ anShaStation.standardZ1 }} m
          </el-descriptions-item>
          <el-descriptions-item label="正常高水位">
            {{ anShaStation.standardZ2 }} m
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.engineering-situation {
  width: 100%;
  height: 100%;
  .engineering-statistic {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    .name {
      width: 35%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
    }
    .content {
      width: 65%;
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
  .engineering-content {
    width: 100%;
    height: calc(100% - 50px);
    margin-top: 10px;
    display: flex;
    .chart-container {
      width: 35%;
      height: 100%;
    }
    .statistic-container {
      width: 65%;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
