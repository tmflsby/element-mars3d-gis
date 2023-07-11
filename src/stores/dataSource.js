import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDataSourceStore = defineStore('dataSource', () => {
  const meteorologicalWarning = ref([])
  const rainSituation = ref(null)
  const waterEngineeringSituation = ref({
    WPStationRR: null,
    WPStationZQ: null,
    WPStationZZ: null
  })

  const setMeteorologicalWarning = (data) => {
    meteorologicalWarning.value = data
  }
  const setRainSituation = (data) => {
    rainSituation.value = data
  }
  const setWaterEngineeringSituation = (type, data) => {
    waterEngineeringSituation.value[type] = data
  }

  return {
    meteorologicalWarning,
    rainSituation,
    waterEngineeringSituation,
    setMeteorologicalWarning,
    setRainSituation,
    setWaterEngineeringSituation
  }
})
