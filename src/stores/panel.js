import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePanelStore = defineStore('panel', () => {
  const panelVisible = ref({})

  const setPanelVisible = (key, status) => {
    panelVisible.value[key] = status
  }

  return {
    panelVisible,
    setPanelVisible
  }
})
