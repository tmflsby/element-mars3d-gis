<script setup>
import dayjs from 'dayjs'
import lodash from 'lodash'
import * as echarts from 'echarts'
import { reactive, computed, watch, onBeforeMount } from 'vue'
import { regimen_regimenQuery, regimen_regimenAllQuery } from '@/api/regimen'
import { data_getMonitorData } from '@/api/data'
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
const waterEngineeringStation = dataSourceStore.waterEngineeringStation
const setWaterEngineeringSituation = dataSourceStore.setWaterEngineeringSituation
const setWaterEngineeringStation = dataSourceStore.setWaterEngineeringStation

const areaId = selectedDept.code
const type = window.WPD.get('WPAdministrativeArea').get(areaId).level
let WPStationZQ = window.WPD.get('WPStationZQ')
let WPStationZZ = window.WPD.get('WPStationZZ')
const WPStationZQZZOption = reactive([])

const waterStation = reactive([
  { title: '超保证', color: 'red', value: 0 },
  { title: '超警戒', color: 'orange', value: 0 }
])
const currentStation = reactive({})
let chart = null

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

const getAllWaterStation = async () => {
  const regimenAllQueryRes = await regimen_regimenAllQuery({
    areaId,
    roleType: type,
    projectId,
    stationType: ['WPStationZQ', 'WPStationZZ'],
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm:ss')
  })
  if (regimenAllQueryRes.state === 0) {
    setWaterEngineeringStation('WPStationZQ', regimenAllQueryRes.data.WPStationZQ)
    setWaterEngineeringStation('WPStationZZ', regimenAllQueryRes.data.WPStationZZ)
  }
}

const getCurrentStationData = async () => {
  const getMonitorDataRes = await data_getMonitorData({
    projectId,
    nodeType: currentStation.type,
    nodeId: currentStation.id,
    begin: dayjs(refreshTime.value).subtract(12, 'hour').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm:ss')
  })
  if (getMonitorDataRes.state === 0) {
    // console.log(getMonitorDataRes.data)
    const q = getMonitorDataRes.data?.q?.map((item) => ({
      time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
      q: item.value
    }))
    const z = getMonitorDataRes.data?.z?.map((item) => ({
      time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'),
      z: item.value
    }))

    initChart(z, q)
  } else {
    chart?.dispose()
  }
}

const initChart = (z, q) => {
  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(document.querySelector('.water-chart'), 'dark')

  // 根据time 合并数据
  const data = lodash.merge(z, q)
  const legendData = []
  const series = []
  if (z) {
    legendData.push('水位')
    series.push({
      name: '水位',
      type: 'line',
      data: z.map((item) => [item.time, item.z]),
      yAxisIndex: 0
    })
  }
  if (q) {
    legendData.push('流量')
    series.push({
      name: '流量',
      type: 'line',
      yAxisIndex: 1,
      data: q.map((item) => [item.time, item.q])
    })
  }
  if (currentStation.alarmZ && currentStation.alarmZ !== '') {
    legendData.push('警戒水位')
    series.push({
      name: '警戒水位',
      type: 'line',
      data: data.map((item) => [item.time, currentStation.alarmZ]),
      yAxisIndex: 0
    })
  }
  if (currentStation.alarmQ && currentStation.alarmQ !== '') {
    legendData.push('警戒流量')
    series.push({
      name: '警戒流量',
      type: 'line',
      data: data.map((item) => [item.time, currentStation.alarmQ]),
      yAxisIndex: 1
    })
  }
  if (currentStation.guarantyZ && currentStation.guarantyZ !== '') {
    legendData.push('保证水位')
    series.push({
      name: '保证水位',
      type: 'line',
      data: data.map((item) => [item.time, currentStation.guarantyZ]),
      yAxisIndex: 0
    })
  }
  if (currentStation.guarantyQ && currentStation.guarantyQ !== '') {
    legendData.push('保证流量')
    series.push({
      name: '保证流量',
      type: 'line',
      data: data.map((item) => [item.time, currentStation.guarantyQ]),
      yAxisIndex: 1
    })
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: 50,
      right: 50,
      bottom: 25
    },
    legend: {
      data: legendData
    },
    xAxis: [
      {
        type: 'time',
        boundaryGap: false,
        splitNumber: 4
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '水位(m)',
        min: (value) => value.min - 0.5,
        max: (value) => value.max + 0.5,
        yAxisIndex: 0
      },
      {
        type: 'value',
        name: '流量(m³/s)',
        min: (value) => value.min - 0.5,
        max: (value) => value.max + 0.5,
        yAxisIndex: 1
      }
    ],
    series
  }
  // console.log(option)
  chart.setOption(option, true)
  chart.resize()
}

const changeStation = (val) => {
  const stationType = val.split('#')[0]
  const stationId = val.split('#')[1]
  let station
  switch (stationType) {
    case 'WPStationZQ':
      station = WPStationZQ.get(stationId)
      break
    case 'WPStationZZ':
      station = WPStationZZ.get(stationId)
      break
    default:
      break
  }
  currentStation.mixin = val
  currentStation.name = station.name
  currentStation.id = station.id
  currentStation.type = stationType
  currentStation.alarmZ = station.alarmZ
  currentStation.alarmQ = station.alarmQ
  currentStation.guarantyZ = station.guarantyZ
  currentStation.guarantyQ = station.guarantyQ

  getCurrentStationData()
}

const getWPStationOption = async () => {
  if (!WPStationZQ) {
    await getWPDData(['WPStationZQ'])
    WPStationZQ = window.WPD.get('WPStationZQ')
  }
  if (!WPStationZZ) {
    await getWPDData(['WPStationZZ'])
    WPStationZZ = window.WPD.get('WPStationZZ')
  }

  WPStationZQ.forEach((item) => {
    WPStationZQZZOption.push({
      id: item.id,
      name: item.name,
      type: 'WPStationZQ',
      mixin: `WPStationZQ#${item.id}`
    })
  })
  WPStationZZ.forEach((item) => {
    WPStationZQZZOption.push({
      id: item.id,
      name: item.name,
      type: 'WPStationZZ',
      mixin: `WPStationZZ#${item.id}`
    })
  })

  changeStation('WPStationZQ#70900900')
}

onBeforeMount(() => {
  getWPStationOption()
  if (!waterEngineeringSituation.WPStationZZ || !waterEngineeringSituation.WPStationZQ) {
    getWaterStation()
  } else {
    getCacheWaterStation()
  }
  if (!waterEngineeringStation.WPStationZZ || !waterEngineeringStation.WPStationZQ) {
    getAllWaterStation()
  }
})

watch(
  () => refreshTime.value,
  () => {
    getWaterStation()
    getAllWaterStation()
    getCurrentStationData()
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
    <div class="water-select-station">
      <el-select filterable v-model="currentStation.mixin" @change="changeStation">
        <el-option
          v-for="item in WPStationZQZZOption"
          :key="item.mixin"
          :label="item.name"
          :value="item.mixin"
        />
      </el-select>
    </div>
    <div class="water-chart"></div>
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
  .water-select-station {
    width: 100%;
    :deep(.el-select) {
      width: 100%;
      margin-top: 10px;
    }
  }
  .water-chart {
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 100px);
  }
}
</style>
