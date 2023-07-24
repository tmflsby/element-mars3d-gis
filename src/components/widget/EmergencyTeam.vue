<script setup>
import * as echarts from 'echarts'
import { ref, reactive, watch, onMounted } from 'vue'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const getWPDData = WPDStore.getWPDData

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept

// WPEmergencyTeam
let WPEmergencyTeam = window.WPD.get('WPEmergencyTeam')
const sectorCategories = reactive({})
const selectedSectorCategories = ref('水利设施')
let chart = null

const getEmergencyTeam = async () => {
  await getWPDData(['WPEmergencyTeam'])
  WPEmergencyTeam = window.WPD.get('WPEmergencyTeam')
  filterEmergencyTeam()
}

const filterEmergencyTeam = () => {
  // console.log(WPEmergencyTeam, selectedDept.code)
  WPEmergencyTeam.forEach((item) => {
    // 根据 deptCode 过滤
    if (item.teamLocationCode !== selectedDept.code && selectedDept.code !== '350400000000') return
    // 根据 sectorCategories 分类
    item.sectorCategories = item.sectorCategories.trim()
    if (sectorCategories[item.sectorCategories] == null) {
      sectorCategories[item.sectorCategories] = []
    }
    sectorCategories[item.sectorCategories].push(item)
  })
  // console.log(sectorCategories)
  initChart()
}

const initChart = () => {
  const teamType = {}
  for (let i = 0; i < sectorCategories[selectedSectorCategories.value].length; i++) {
    if (teamType[sectorCategories[selectedSectorCategories.value][i].teamType] == null) {
      teamType[sectorCategories[selectedSectorCategories.value][i].teamType] = []
    }
    teamType[sectorCategories[selectedSectorCategories.value][i].teamType].push(
      sectorCategories[selectedSectorCategories.value][i]
    )
  }
  // console.log(teamType)

  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(document.querySelector('.emergency-team-chart'), 'dark')
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: Object.keys(teamType)
    },
    series: [
      {
        name: '应急队伍',
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['75%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: Object.keys(teamType).map((item) => ({
          value: teamType[item].length,
          name: item
        }))
      }
    ]
  }
  chart.setOption(option)
  setTimeout(() => {
    chart.resize()
  }, 500)
}

onMounted(() => {
  if (WPEmergencyTeam == null) {
    getEmergencyTeam()
  } else {
    filterEmergencyTeam()
  }
})

watch(selectedSectorCategories, () => {
  initChart()
})
</script>

<template>
  <div class="emergency-team">
    <el-select filterable v-model="selectedSectorCategories">
      <el-option
        v-for="(item, index) in sectorCategories"
        :key="item"
        :label="index"
        :value="index"
      />
    </el-select>
    <div class="emergency-team-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.emergency-team {
  width: 100%;
  height: 100%;
  :deep(.el-select) {
    width: 100%;
    margin-bottom: 10px;
  }
  .emergency-team-chart {
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
