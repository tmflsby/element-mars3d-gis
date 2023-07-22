<script setup>
import * as echarts from 'echarts'
import { ref, reactive, watch, onMounted } from 'vue'
import { enterpConting_goodsMaterials } from '@/api/enterpConting'

let emergencyMaterial = window.WPD.get('EmergencyMaterial')
const materialCategories = reactive({})
const selectedMaterialCategories = ref('食品加工')
let chart = null

const getEmergencyMaterial = async () => {
  const goodsMaterialsRes = await enterpConting_goodsMaterials()
  if (goodsMaterialsRes.state === 0) {
    window.WPD.set('EmergencyMaterial', new Map())
    for (let i = 0; i < goodsMaterialsRes.data.data.length; i++) {
      if (
        window.WPD.get('EmergencyMaterial').get(goodsMaterialsRes.data.data[i].materialType) == null
      ) {
        window.WPD.get('EmergencyMaterial').set(
          goodsMaterialsRes.data.data[i].materialType,
          new Map()
        )
      }
      for (let j = 0; j < goodsMaterialsRes.data.data[i].materialDetails.length; j++) {
        window.WPD.get('EmergencyMaterial')
          .get(goodsMaterialsRes.data.data[i].materialType)
          .set(
            goodsMaterialsRes.data.data[i].materialDetails[j].id,
            goodsMaterialsRes.data.data[i].materialDetails[j]
          )
      }
    }
    emergencyMaterial = window.WPD.get('EmergencyMaterial')
    filterEmergencyMaterial()
  }
}

const filterEmergencyMaterial = () => {
  emergencyMaterial.forEach((value, key) => {
    materialCategories[key] = {}
    value.forEach((v) => {
      // 根据institutionName分类
      if (materialCategories[key][v.institutionName] == null) {
        materialCategories[key][v.institutionName] = []
      }
      materialCategories[key][v.institutionName].push(v)
    })
  })
  initChart()
}

const initChart = () => {
  if (chart) {
    chart.dispose()
  }

  // console.log(materialCategories[selectedMaterialCategories.value])
  chart = echarts.init(document.querySelector('.emergency-material-chart'), 'dark')
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 10,
      data: Object.keys(materialCategories[selectedMaterialCategories.value])
    },
    series: [
      {
        name: '应急物资',
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['75%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: Object.keys(materialCategories[selectedMaterialCategories.value]).map((item) => ({
          name: item,
          value: materialCategories[selectedMaterialCategories.value][item].length
        }))
      }
    ]
  }
  // console.log(option)
  chart.setOption(option)
  chart.resize()
}

onMounted(() => {
  if (emergencyMaterial == null) {
    getEmergencyMaterial()
  } else {
    filterEmergencyMaterial()
  }
})

watch(selectedMaterialCategories, () => {
  initChart()
})
</script>

<template>
  <div class="emergency-material">
    <el-select filterable v-model="selectedMaterialCategories">
      <el-option
        v-for="(item, index) in materialCategories"
        :key="index"
        :label="index"
        :value="index"
      />
    </el-select>
    <div class="emergency-material-chart"></div>
  </div>
</template>

<style scoped lang="scss">
.emergency-material {
  width: 100%;
  height: 100%;
  :deep(.el-select) {
    width: 100%;
    margin-bottom: 10px;
  }
  .emergency-material-chart {
    width: 100%;
    height: calc(100% - 50px);
  }
}
</style>
