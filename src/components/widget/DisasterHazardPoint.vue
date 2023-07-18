<script setup>
import { reactive, onBeforeMount } from 'vue'
import { disPoint_getDisasterSiteData } from '@/api/disPoint'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept

const disasterHazardPoint = reactive([])
const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.code)

const getDisasterSiteData = async () => {
  const getDisasterSiteDataRes = await disPoint_getDisasterSiteData({
    projectId,
    areaId: region.id,
    areaType: region.level
  })
  // console.log(getDisasterSiteDataRes)
  if (getDisasterSiteDataRes.state === 0) {
    window.WPD.set('disasterHazardPoint', getDisasterSiteDataRes.data)

    disasterHazardPoint.push(
      ...[
        {
          name: '高陡边坡',
          id: 'HighSteepSlope',
          value: getDisasterSiteDataRes.data.HighSteepSlopeCount
        },
        {
          name: '滑坡',
          id: 'LandSlide',
          value: getDisasterSiteDataRes.data.LandSlideCount
        },
        {
          name: '泥石流',
          id: 'DebrisFlow',
          value: getDisasterSiteDataRes.data.DebrisFlowCount
        },
        {
          name: '崩塌',
          id: 'Collapse',
          value: getDisasterSiteDataRes.data.CollapseCount
        },
        {
          name: '地面塌陷',
          id: 'GroundCollapse',
          value: getDisasterSiteDataRes.data.GroundCollapseCount
        }
      ]
    )
  }
}

onBeforeMount(() => {
  getDisasterSiteData()
})
</script>

<template>
  <div class="disaster-hazard-point">
    <el-card class="disaster-hazard-point-item" v-for="item in disasterHazardPoint" :key="item.id">
      <div class="disaster-hazard-point-item-name">{{ item.name }}</div>
      <div class="disaster-hazard-point-item-value">{{ item.value }}</div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.disaster-hazard-point {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .disaster-hazard-point-item {
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
</style>
