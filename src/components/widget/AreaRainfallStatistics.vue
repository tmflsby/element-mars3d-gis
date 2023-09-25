<script setup>
import dayjs from 'dayjs'
import { ref, onBeforeMount, watch } from 'vue'
import { magnitudeRain_getMagnitudeRainAreaByType } from '@/api/magnitudeRain'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept
const refreshTime = systemStore.refreshTime

const WPAdministrativeArea = window.WPD.get('WPAdministrativeArea')
const selectedRegion = WPAdministrativeArea.get(selectedDept.code)

const areaRainfallStatisticsData = ref(null)

const getMagnitudeRainAreaByType = async () => {
  const getMagnitudeRainAreaByTypeRes = await magnitudeRain_getMagnitudeRainAreaByType({
    projectId,
    areaId: selectedRegion.id,
    type: selectedRegion.level,
    begin: dayjs(refreshTime).subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(refreshTime).format('YYYY-MM-DD HH:mm:ss')
  })
  if (getMagnitudeRainAreaByTypeRes.state === 0) {
    // console.log('getMagnitudeRainAreaByTypeRes', getMagnitudeRainAreaByTypeRes)
    areaRainfallStatisticsData.value = getMagnitudeRainAreaByTypeRes.data.data
  }
}

onBeforeMount(() => {
  getMagnitudeRainAreaByType()
})

watch(
  () => refreshTime,
  () => {
    getMagnitudeRainAreaByType()
  }
)
</script>

<template>
  <div class="area-rainfall-statistics">
    <div class="title">
      <div class="name">行政区划</div>
      <div class="drop">累计降雨量（mm）</div>
    </div>
    <el-collapse class="collapse-content">
      <template v-for="level in areaRainfallStatisticsData" :key="level.magnitude">
        <el-collapse-item v-if="level.countyCount > 0">
          <template #title>
            <div class="level">
              <div class="magnitude">{{ level.magnitude }}</div>
              <div class="countyCount">{{ level.countyCount }}个区县市</div>
              <div class="townCount">{{ level.townCount }}个乡镇</div>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item v-for="county in level.lstCounty" :key="county.countyAdcd">
              <template #title>
                <div class="county">
                  <div class="name">{{ county.countyAdnm }}</div>
                  <div class="drop">{{ county.drp }}</div>
                </div>
              </template>

              <el-descriptions :column="1" border>
                <el-descriptions-item
                  label-align="center"
                  align="center"
                  v-for="town in county.lstTown"
                  :key="town.townAdcd"
                  :label="town.townAdnm"
                >
                  {{ town.drp }}
                </el-descriptions-item>
              </el-descriptions>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.area-rainfall-statistics {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: 50px;
    display: flex;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .collapse-content {
    width: 100%;
    height: 100%;
    overflow: auto;
    :deep(.el-collapse-item__content) {
      padding: 0;
    }
  }
  .level,
  .county {
    width: 100%;
    display: flex;
  }
  .name,
  .drop,
  .magnitude,
  .countyCount,
  .townCount {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep(.el-descriptions__table) {
    tr {
      display: flex;
      td {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
