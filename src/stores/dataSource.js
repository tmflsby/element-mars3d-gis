import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDataSourceStore = defineStore('dataSource', () => {
  const meteorologicalWarning = ref([])

  const setMeteorologicalWarning = (data) => {
    meteorologicalWarning.value = data
  }

  return { meteorologicalWarning, setMeteorologicalWarning }
})
