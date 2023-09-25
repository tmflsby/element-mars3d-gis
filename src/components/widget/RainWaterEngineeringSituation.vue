<script setup>
import dayjs from 'dayjs'
import { reactive, computed, watch, onBeforeMount } from 'vue'
import { magnitudeRain_getAllRain } from '@/api/magnitudeRain'
import { regimen_regimenQuery, regimen_regimenAllQuery } from '@/api/regimen'
import { useSystemStore } from '@/stores/system'
import { useWPDStore } from '@/stores/wpd'
import { useDataSourceStore } from '@/stores/dataSource'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const selectedDept = systemStore.selectedDept

const wpdStore = useWPDStore()
const projectId = wpdStore.projectId

const dataSourceStore = useDataSourceStore()
const rainSituation = dataSourceStore.rainSituation
const waterEngineeringSituation = dataSourceStore.waterEngineeringSituation
const waterEngineeringStation = dataSourceStore.waterEngineeringStation
const setRainSituation = dataSourceStore.setRainSituation
const setWaterEngineeringSituation = dataSourceStore.setWaterEngineeringSituation
const setWaterEngineeringStation = dataSourceStore.setWaterEngineeringStation

const areaId = selectedDept.code
const type = window.WPD.get('WPAdministrativeArea').get(areaId).level

const rainStation = reactive([
  { title: '特大暴雨', color: '#ff0000', value: 0 },
  { title: '大暴雨', color: '#fa00fa', value: 0 },
  { title: '暴雨', color: '#1d5de7', value: 0 },
  { title: '大雨', color: '#61b8ff', value: 0 },
  { title: '中雨', color: '#3db93d', value: 0 },
  { title: '小雨', color: '#b3f8a6', value: 0 }
])
const waterStation = reactive([
  { title: '超保证', color: 'red', value: 0 },
  { title: '超警戒', color: 'orange', value: 0 }
])
const engineeringStation = reactive([
  { title: '超正常高 (大中型)', color: 'red', value: 0 },
  { title: '超正常高 (小型)', color: 'red', value: 0 },
  { title: '超汛限 (大中型)', color: 'orange', value: 0 },
  { title: '超汛限 (小型)', color: 'orange', value: 0 }
])

const getRainStation = async () => {
  // 重置value
  for (let i = 0; i < rainStation.length; i++) {
    rainStation[i].value = 0
  }
  const getAllRainRes = await magnitudeRain_getAllRain({
    projectId,
    areaId,
    type,
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm:ss')
  })
  if (getAllRainRes.state === 0) {
    const allRain = getAllRainRes.data
    for (let i = 0; i < allRain.length; i++) {
      switch (allRain[i].level) {
        case '1':
          rainStation[5].value++
          allRain[i].color = '#b3f8a6'
          break
        case '2':
          rainStation[4].value++
          allRain[i].color = '#3db93d'
          break
        case '3':
          rainStation[3].value++
          allRain[i].color = '#61b8ff'
          break
        case '4':
          rainStation[2].value++
          allRain[i].color = '#126ce1'
          break
        case '5':
          rainStation[1].value++
          allRain[i].color = '#fa00fa'
          break
        case '6':
          rainStation[0].value++
          allRain[i].color = '#ff0000'
          break
        default:
          break
      }
    }

    setRainSituation(allRain)
  }
}
const getCacheRainStation = () => {
  for (let i = 0; i < rainSituation.length; i++) {
    switch (rainSituation[i].level) {
      case '1':
        rainStation[5].value++
        break
      case '2':
        rainStation[4].value++
        break
      case '3':
        rainStation[3].value++
        break
      case '4':
        rainStation[2].value++
        break
      case '5':
        rainStation[1].value++
        break
      case '6':
        rainStation[0].value++
        break
      default:
        break
    }
  }
}

const getWaterEngineeringStation = async () => {
  // 重置value
  for (let i = 0; i < waterStation.length; i++) {
    waterStation[i].value = 0
  }
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
    waterStation[0].value =
      regimenQueryRes.data.WPStationZQ.outZQGuarantysCount +
      regimenQueryRes.data.WPStationZZ.outZZGuarantysCount
    waterStation[1].value =
      regimenQueryRes.data.WPStationZQ.outZQAlarmsCount +
      regimenQueryRes.data.WPStationZZ.outZZAlarmsCount

    engineeringStation[0].value = regimenQueryRes.data.WPStationRR.outRRFhControlsLargeToMediumCount
    engineeringStation[1].value = regimenQueryRes.data.WPStationRR.outRRFhControlsSmallCount
    engineeringStation[2].value = regimenQueryRes.data.WPStationRR.outRRXHsLargeToMediumCount
    engineeringStation[3].value = regimenQueryRes.data.WPStationRR.outRRXHsSmallCount

    setWaterEngineeringSituation('WPStationZQ', regimenQueryRes.data.WPStationZQ)
    setWaterEngineeringSituation('WPStationZZ', regimenQueryRes.data.WPStationZZ)
    setWaterEngineeringSituation('WPStationRR', regimenQueryRes.data.WPStationRR)
  }
}
const getCacheWaterEngineeringStation = () => {
  waterStation[0].value =
    waterEngineeringSituation.WPStationZQ.outZQGuarantysCount +
    waterEngineeringSituation.WPStationZZ.outZZGuarantysCount
  waterStation[1].value =
    waterEngineeringSituation.WPStationZQ.outZQAlarmsCount +
    waterEngineeringSituation.WPStationZZ.outZZAlarmsCount

  engineeringStation[0].value =
    waterEngineeringSituation.WPStationRR.outRRFhControlsLargeToMediumCount
  engineeringStation[1].value = waterEngineeringSituation.WPStationRR.outRRFhControlsSmallCount
  engineeringStation[2].value = waterEngineeringSituation.WPStationRR.outRRXHsLargeToMediumCount
  engineeringStation[3].value = waterEngineeringSituation.WPStationRR.outRRXHsSmallCount
}

const getAllWaterEngineeringStation = async () => {
  const regimenAllQueryRes = await regimen_regimenAllQuery({
    areaId,
    roleType: type,
    projectId,
    stationType: ['WPStationZQ', 'WPStationZZ', 'WPStationRR'],
    begin: dayjs(refreshTime.value).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime.value).format('YYYY-MM-DD HH:mm:ss')
  })
  if (regimenAllQueryRes.state === 0) {
    setWaterEngineeringStation('WPStationZQ', regimenAllQueryRes.data.WPStationZQ)
    setWaterEngineeringStation('WPStationZZ', regimenAllQueryRes.data.WPStationZZ)
    setWaterEngineeringStation('WPStationRR', regimenAllQueryRes.data.WPStationRR)
  }
}

onBeforeMount(() => {
  if (!rainSituation) {
    getRainStation()
  } else {
    getCacheRainStation()
  }
  if (
    !waterEngineeringSituation.WPStationZZ ||
    !waterEngineeringSituation.WPStationZQ ||
    !waterEngineeringSituation.WPStationRR
  ) {
    getWaterEngineeringStation()
  } else {
    getCacheWaterEngineeringStation()
  }
  if (
    !waterEngineeringStation.WPStationZZ ||
    !waterEngineeringStation.WPStationZQ ||
    !waterEngineeringStation.WPStationRR
  ) {
    getAllWaterEngineeringStation()
  }
})

watch(
  () => refreshTime.value,
  () => {
    getRainStation()
    getWaterEngineeringStation()
    getAllWaterEngineeringStation()
  }
)
</script>

<template>
  <div class="rain-water-engineering-situation">
    <el-card class="rain">
      <div class="name">雨量站</div>
      <div class="content">
        <el-card v-for="item in rainStation" :key="item.title">
          <span class="title">{{ item.title }}</span>
          <span class="value" :style="{ color: item.color }">{{ item.value }}</span>
        </el-card>
      </div>
    </el-card>
    <el-card class="water">
      <div class="name">
        水文站
        <br />
        水位站
      </div>
      <div class="content">
        <el-card v-for="item in waterStation" :key="item.title">
          <span class="title">{{ item.title }}</span>
          <span class="value" :style="{ color: item.color }">{{ item.value }}</span>
        </el-card>
      </div>
    </el-card>
    <el-card class="engineering">
      <div class="name">水库站</div>
      <div class="content">
        <el-card v-for="item in engineeringStation" :key="item.title">
          <span class="title">
            {{ item.title.split(' ')[0] }}
            <br />
            {{ item.title.split(' ')[1] }}
          </span>
          <span class="value" :style="{ color: item.color }">{{ item.value }}</span>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.rain-water-engineering-situation {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .rain {
    height: 48.75%;
  }
  .water {
    height: 16.25%;
  }
  .engineering {
    height: 32.5%;
  }
  .rain,
  .water,
  .engineering {
    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .name {
        width: 25%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
      }
      .content {
        width: 75%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        .el-card {
          width: 48%;
          height: 40px;
          .el-card__body {
            padding: 0 5px;
            display: flex;
            justify-content: space-between;
            .value {
              font-weight: bold;
            }
          }
        }
      }
    }
  }
}
</style>
