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
const rainSituation = dataSourceStore.rainSituation
const setRainSituation = dataSourceStore.setRainSituation

const areaId = selectedDept.code
const type = window.WPD.get('WPAdministrativeArea').get(areaId).level

const rainStation = reactive([
  { title: '特大暴雨', color: '#ff0000', value: 0 },
  { title: '大暴雨', color: '#fa00fa', value: 0 },
  { title: '暴雨', color: '#0000ff', value: 0 },
  { title: '大雨', color: '#61b8ff', value: 0 },
  { title: '中雨', color: '#3db93d', value: 0 },
  { title: '小雨', color: '#b3f8a6', value: 0 }
])
const sortAllRain = reactive([])

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
          allRain[i].color = '#0000ff'
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
    // 根据drp从大到小排序
    sortAllRain.push(...allRain.sort((a, b) => b.drp - a.drp))
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
  sortAllRain.push(...rainSituation.sort((a, b) => b.drp - a.drp))
}

onBeforeMount(() => {
  if (!rainSituation) {
    getRainStation()
  } else {
    getCacheRainStation()
  }
})

watch(
  () => refreshTime.value,
  () => {
    getRainStation()
  }
)
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
    <div class="rain-station">
      <el-descriptions border :column="3">
        <template v-for="item in sortAllRain" :key="item.stcd">
          <el-descriptions-item>
            <span :style="{ color: item.color }">{{ item.magnitude }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <span :style="{ color: item.color }">{{ item.stnm }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <span :style="{ color: item.color }">{{ item.drp }}</span>
          </el-descriptions-item>
        </template>
      </el-descriptions>
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
  .rain-station {
    width: 100%;
    height: calc(100% - 80px);
    overflow: auto;
    :deep(.el-descriptions__label) {
      display: none;
    }
  }
}
</style>
