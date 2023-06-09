import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useStationStore = defineStore('station', () => {
  const allStationMap = reactive(new Map())
  const addStationToMap = ({ type, station }) => {
    let stationId = ''
    if (type === 'WPMonitoringPoints') {
      stationId = station.ORDER_INDEX
    } else if (type === 'EasilyFloodedArea') {
      stationId = station.deviceAddr
    } else {
      stationId = station.id
    }
    if (allStationMap.has(type)) {
      allStationMap.get(type).set(stationId, station)
    } else {
      allStationMap.set(type, new Map())
      allStationMap.get(type).set(stationId, station)
    }
  }

  return { allStationMap, addStationToMap }
})
