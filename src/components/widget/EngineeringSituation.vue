<script setup>
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import 'echarts-liquidfill'
import { reactive, computed, watch, onBeforeMount, onMounted } from 'vue'
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
const getWPDData = wpdStore.getWPDData

const dataSourceStore = useDataSourceStore()
const waterEngineeringSituation = dataSourceStore.waterEngineeringSituation
const setWaterEngineeringSituation = dataSourceStore.setWaterEngineeringSituation

const areaId = selectedDept.code
const type = window.WPD.get('WPAdministrativeArea').get(areaId).level
let WPStationRR = window.WPD.get('WPStationRR')
const WPStationRROption = reactive([])

const engineeringStation = reactive([
  { title: '超正常高', color: 'red', value: 0 },
  { title: '超汛限', color: 'orange', value: 0 }
])
const currentStation = reactive({})
let chart = null
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

const getCurrentStationData = async () => {
  const getImportInfoByIdRes = await curveLookup_getImportInfoById({
    projectId,
    nodeId: currentStation.id,
    nodeType: currentStation.type,
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: refreshTime.value
  })
  if (getImportInfoByIdRes.state === 0) {
    currentStation.currentZ = getImportInfoByIdRes.data.currentZ.value
    currentStation.standardZ1 = getImportInfoByIdRes.data.standardZ1.value
    currentStation.standardZ2 = getImportInfoByIdRes.data.standardZ2.value
    const storageCapa = getImportInfoByIdRes.data.storageCapa

    if (storageCapa) {
      for (let i = 0; i < storageCapa.data.length; i++) {
        // FLD_RR_VFld_Remain 剩余防洪库容
        if (storageCapa.data[i].key === 'FLD_RR_VFld_Remain') {
          currentStation.remainStorage = storageCapa.data[i].value
          currentStation.storageSymbol = storageCapa.data[i].storageSymbol
        }
        // FLD_RR_VFld_Used 已用防洪库容
        if (storageCapa.data[i].key === 'FLD_RR_VFld_Used') {
          currentStation.usedStorage = storageCapa.data[i].value
          currentStation.storageSymbol = storageCapa.data[i].storageSymbol
        }
      }

      initChart()
    } else {
      chart?.dispose()
    }
  }
}

const initChart = () => {
  let liquidFillValue = 0
  if (currentStation.remainStorage || currentStation.usedStorage) {
    liquidFillValue = +(
      (currentStation.remainStorage / (currentStation.remainStorage + currentStation.usedStorage)) *
      100
    ).toFixed(2)
  }

  // console.log(liquidFillValue, '===============')
  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(document.querySelector('.chart-container'), 'dark')
  const option = {
    title: {
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
        outline: {
          show: false
        },
        label: {
          show: true,
          fontSize: 20,
          color: '#fff',
          formatter: (param) => param.value + '%'
        },
        itemStyle: {
          color: '#00BFFF'
        }
      }
    ]
  }
  chart.setOption(option)
  chart.resize()
}

const changeStation = (val) => {
  const station = WPStationRR.get(val)
  currentStation.name = station.name
  currentStation.id = station.id
  currentStation.type = 'WPStationRR'
  currentStation.currentZ = null
  currentStation.standardZ1 = null
  currentStation.standardZ2 = null
  currentStation.remainStorage = null
  currentStation.usedStorage = null
  currentStation.storageSymbol = null
  getCurrentStationData()
}

const getWPStationOption = async () => {
  if (!WPStationRR) {
    await getWPDData(['WPStationRR'])
    WPStationRR = window.WPD.get('WPStationRR')
  }
  WPStationRR.forEach((item) => {
    WPStationRROption.push({
      id: item.id,
      name: item.name,
      type: 'WPStationRR'
    })
  })

  changeStation('70900550')
}

onBeforeMount(() => {
  getWPStationOption()
  if (!waterEngineeringSituation.WPStationRR) {
    getEngineeringStation()
  } else {
    getCacheEngineeringStation()
  }
})

onMounted(() => {
  getCurrentStationData()
})

watch(
  () => refreshTime.value,
  () => {
    getEngineeringStation()
    getCurrentStationData()
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
    <div class="engineering-select-station">
      <el-select filterable v-model="currentStation.id" @change="changeStation">
        <el-option
          v-for="item in WPStationRROption"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <div class="engineering-content">
      <div class="chart-container"></div>
      <div class="statistic-container">
        <el-descriptions border :column="1">
          <el-descriptions-item label="当前水位">
            {{ currentStation.currentZ ? currentStation.currentZ + ' m' : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="动用防洪库容">
            {{ currentStation.usedStorage }} {{ currentStation.storageSymbol }}
          </el-descriptions-item>
          <el-descriptions-item label="剩余防洪库容">
            {{ currentStation.remainStorage }} {{ currentStation.storageSymbol }}
          </el-descriptions-item>
          <el-descriptions-item label="汛限水位">
            {{ currentStation.standardZ1 ? currentStation.standardZ1 + ' m' : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="正常高水位">
            {{ currentStation.standardZ2 ? currentStation.standardZ2 + ' m' : '' }}
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
  .engineering-select-station {
    width: 100%;
    :deep(.el-select) {
      width: 100%;
      margin-top: 10px;
    }
  }
  .engineering-content {
    width: 100%;
    height: calc(100% - 100px);
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
