import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useDataSourceStore = defineStore('dataSource', () => {
  const meteorologicalWarning = ref([])
  const rainSituation = ref(null)
  const waterEngineeringSituation = ref({
    WPStationRR: null,
    WPStationZQ: null,
    WPStationZZ: null
  })
  const waterEngineeringStation = ref({
    WPStationRR: null,
    WPStationZQ: null,
    WPStationZZ: null
  })
  const importantStationList = ref(null)
  const updateImportantStation = ref(uuidv4())

  const setMeteorologicalWarning = (data) => {
    meteorologicalWarning.value = data
  }
  const setRainSituation = (data) => {
    rainSituation.value = data
  }
  const setWaterEngineeringSituation = (type, data) => {
    waterEngineeringSituation.value[type] = data
  }

  const setWaterEngineeringStation = (type, data) => {
    waterEngineeringStation.value[type] = data
  }

  const setImportantStationList = (data) => {
    importantStationList.value = data
  }

  const setUpdateImportantStation = () => {
    updateImportantStation.value = uuidv4()
  }

  return {
    meteorologicalWarning,
    rainSituation,
    waterEngineeringSituation,
    waterEngineeringStation,
    importantStationList,
    updateImportantStation,
    setMeteorologicalWarning,
    setRainSituation,
    setWaterEngineeringSituation,
    setWaterEngineeringStation,
    setImportantStationList,
    setUpdateImportantStation
  }
})
