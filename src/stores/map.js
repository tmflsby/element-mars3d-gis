import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useMapStore = defineStore('map', () => {
  const mapInitComplete = ref(false)
  const changeMapInitComplete = (status) => {
    mapInitComplete.value = status
  }

  return { mapInitComplete, changeMapInitComplete }
})
