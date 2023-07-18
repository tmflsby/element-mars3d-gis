<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { siteInfo_getRRTypeCount } from '@/api/siteInfo'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept

const infoText = ref('')
const infoStatistic = reactive([])
const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.code)

const getInfoText = async () => {
  const getRRTypeCountRes = await siteInfo_getRRTypeCount({
    projectId,
    areaId: region.id,
    type: region.level
  })
  if (getRRTypeCountRes.state === 0) {
    const { smallCount, mediumCount, largeCount } = getRRTypeCountRes.data
    infoText.value = `${region.name}共有水库${
      largeCount + mediumCount + smallCount
    }座，其中大型水库${largeCount}座，中型水库${mediumCount}座，小型水库${smallCount}座。`
  }
}
const getInfoStatistic = () => {
  infoStatistic.push(
    ...[
      { name: '水库', id: 'stationRRNum', value: region.stationRRNum },
      { name: '水文站', id: 'stationZQNum', value: region.stationZQNum },
      { name: '水位站', id: 'stationZZNum', value: region.stationZZNum },
      { name: '雨量站', id: 'stationPPNum', value: region.stationPPNum },
      { name: '水电站', id: 'stationHPNum', value: region.stationHPNum },
      { name: '水闸', id: 'stationPumpNum', value: region.stationPumpNum },
      { name: '堤防', id: 'bankmentNum', value: region.bankmentNum },
      { name: '泵站', id: 'stationPumpNum', value: region.stationPumpNum }
    ]
  )
}

onBeforeMount(() => {
  getInfoText()
  getInfoStatistic()
})
</script>

<template>
  <div class="water-project-info">
    <div class="text-content">
      <el-input type="textarea" resize="none" v-model="infoText" />
    </div>
    <div class="statistic-content">
      <el-card class="statistic-content-item" v-for="item in infoStatistic" :key="item.id">
        <div class="statistic-content-item-name">{{ item.name }}</div>
        <div class="statistic-content-item-value">{{ item.value }}</div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.water-project-info {
  width: 100%;
  height: 100%;
  .text-content {
    width: 100%;
    height: calc(100% - 150px);
    :deep(.el-textarea) {
      width: 100%;
      height: 100%;
      .el-textarea__inner {
        height: 100%;
      }
    }
  }
  .statistic-content {
    width: 100%;
    height: 140px;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .statistic-content-item {
      width: 45%;
      height: 30px;
      :deep(.el-card__body) {
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
</style>
