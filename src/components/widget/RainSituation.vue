<script setup>
import dayjs from 'dayjs'
import { reactive, onBeforeMount, computed, watch } from 'vue'
import { magnitudeRain_getAllRain } from '@/api/magnitudeRain'
import { useSystemStore } from '@/stores/system'
import { useWPDStore } from '@/stores/wpd'
import { useDataSourceStore } from '@/stores/dataSource'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const selectedDept = systemStore.selectedDept

const wpdStore = useWPDStore()
const projectId = wpdStore.projectId

const dataSourceStore = useDataSourceStore()
let rainSituation = dataSourceStore.rainSituation
const setRainSituation = dataSourceStore.setRainSituation

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
const tableColumn = reactive([
  { title: '类型', field: 'stationType' },
  { title: '名称', field: 'stnm' },
  { title: '级别', field: 'magnitude' },
  { title: '降雨量', field: 'drp' }
])
const tableData = reactive([])

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

    await setRainSituation(allRain)

    rainSituation = dataSourceStore.rainSituation

    filterRainStation()
  }
}
const filterRainStation = () => {
  for (let i = 0; i < rainSituation.length; i++) {
    switch (rainSituation[i].magnitude) {
      case '小雨':
        rainStation[5].value++
        rainSituation[i].color = '#b3f8a6'
        break
      case '中雨':
        rainStation[4].value++
        rainSituation[i].color = '#3db93d'
        break
      case '大雨':
        rainStation[3].value++
        rainSituation[i].color = '#61b8ff'
        break
      case '暴雨':
        rainStation[2].value++
        rainSituation[i].color = '#1d5de7'
        break
      case '大暴雨':
        rainStation[1].value++
        rainSituation[i].color = '#fa00fa'
        break
      case '特大暴雨':
        rainStation[0].value++
        rainSituation[i].color = '#ff0000'
        break
      default:
        break
    }
    switch (rainSituation[i].sttp) {
      case 'WPStationRR':
        rainSituation[i].stationType = '水库'
        break
      case 'WPStationZQ':
        rainSituation[i].stationType = '水文站'
        break
      case 'WPStationZZ':
        rainSituation[i].stationType = '水位站'
        break
      case 'WPStationPP':
        rainSituation[i].stationType = '雨量站'
        break
      default:
        break
    }
  }
  tableData.push(...rainSituation.sort((a, b) => b.drp - a.drp))
}

onBeforeMount(() => {
  if (!rainSituation) {
    getRainStation()
  } else {
    filterRainStation()
  }
})

watch(
  () => refreshTime.value,
  () => {
    getRainStation()
  }
)

const rowClassName = ({ row }) => {
  let raniLevel = ''
  switch (row.magnitude) {
    case '小雨':
      raniLevel = 'rain-level-1'
      break
    case '中雨':
      raniLevel = 'rain-level-2'
      break
    case '大雨':
      raniLevel = 'rain-level-3'
      break
    case '暴雨':
      raniLevel = 'rain-level-4'
      break
    case '大暴雨':
      raniLevel = 'rain-level-5'
      break
    case '特大暴雨':
      raniLevel = 'rain-level-6'
      break
    default:
      break
  }
  return raniLevel
}
</script>

<template>
  <div class="rain-situation">
    <div class="rain-level">
      <el-card v-for="item in rainStation" :key="item.title">
        <div class="rain-level-item">
          <div class="rain-level-item-title">{{ item.title }}</div>
          <div class="rain-level-item-value" :style="{ color: item.color }">{{ item.value }}</div>
        </div>
      </el-card>
    </div>
    <div class="water-table">
      <el-table height="100%" style="width: 100%" :data="tableData" :row-class-name="rowClassName">
        <el-table-column
          v-for="item in tableColumn"
          sortable
          :key="item.field"
          :prop="item.field"
          :label="item.title"
        />
      </el-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.rain-situation {
  width: 100%;
  height: 100%;
  .rain-level {
    width: 100%;
    height: 80px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    :deep(.el-card) {
      width: 30%;
      height: 30px;
      .el-card__body {
        width: 100%;
        height: 100%;
        .rain-level-item {
          width: 100%;
          height: 100%;
          padding: 0 5px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
  .water-table {
    margin-top: 10px;
    width: 100%;
    height: calc(100% - 80px);
    :deep(.el-table) {
      .rain-level-1 {
        color: #b3f8a6;
      }
      .rain-level-2 {
        color: #3db93d;
      }
      .rain-level-3 {
        color: #61b8ff;
      }
      .rain-level-4 {
        color: #1d5de7;
      }
      .rain-level-5 {
        color: #fa00fa;
      }
      .rain-level-6 {
        color: #ff0000;
      }
    }
  }
}
</style>
