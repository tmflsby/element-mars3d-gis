import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { project_queryobjects } from '@/api/project'
import videoMonitorUrl from '@/assets/videoMonitorUrl.json'

export const useWPDStore = defineStore('wpd', () => {
  const projectId = ref('3bc0fb05339a46d7966a7abac9fc3516')
  const userProjectId = ref('e3cc3a226021fdc238bb32550647d767')
  const WPDTOPOID = reactive({
    WPStationRR: 'WPStationRR:a8ac88b322ba4751a9bdec01903ae3f5',
    WPStationZQ: 'WPStationZQ:ad2a00ca60a54b07a0ad2ec3bfb88a2e',
    WPStationZZ: 'WPStationZZ:9de24abefa1a4f68a9cc451d54cd1252',
    WPStationPP: 'WPStationPP:1f5ee4f1674f44909f57c7d52227f504',
    WPStationHP: 'WPStationHP:922b7f8f381e4f0882ab09eca44b4f08',
    WPMonitoringPoints: 'WPMonitoringPoints:6b122969-b905-40c2-bd6c-04f51dd7c5bf',
    WPSluice: 'WPSluice:7a64c814-9286-436c-857b-6e811bb5ec3b',
    WPembankment: 'WPembankment:3688de78-dd01-4fa4-a909-49484f5693f7',
    WPStationPump: 'WPStationPump:9d36ff55-aa08-4e61-aff6-62f590c628f9',
    EasilyFloodedArea: 'EasilyFloodedArea:488677d5-b40c-49e2-aecc-eb0ca1b53c5d',
    WPAdministrativeArea: 'WPAdministrativeArea:feb3d377-5054-4892-85ac-3d1fdc363f68',
    WPEmergencyTeam: 'WPEmergencyTeam:c84eb62c-dc11-4f2f-bc5d-b1432283e7fa',
    WPMaterialInventory: 'WPMaterialInventory:a5995238-1154-4269-bf62-102b4e6b535d',
    WPRiver: 'WPRiver:fe932a4ee56a45b881cbfb9178d5c4a7'
  })
  const WPDInitComplete = ref(false)

  const getWPDData = async (WPDObjectArr) => {
    for (let i = 0; i < WPDObjectArr.length; i++) {
      if (window.WPD.has(WPDObjectArr[i])) return
      const getStationRes = await project_queryobjects({
        projectId: projectId.value,
        topoId: WPDTOPOID[WPDObjectArr[i]]
      })
      if (getStationRes.state === 0) {
        for (let j = 0; j < getStationRes?.data?.data.length; j++) {
          saveWPDData({
            type: WPDObjectArr[i],
            data: getStationRes?.data?.data[j]
          })
        }
        saveWPDData({
          type: WPDObjectArr[i],
          field: true,
          data: getStationRes?.data?.field
        })
      }
    }
  }

  const saveWPDData = ({ type, data, field }) => {
    let stationId
    if (type === 'WPMonitoringPoints') {
      stationId = data.NAME
      data.URL = videoMonitorUrl[data.ORDER_INDEX]
    } else if (type === 'EasilyFloodedArea') {
      stationId = data.deviceAddr
    } else {
      stationId = data.id
    }
    if (window.WPD.has(type)) {
      if (field) {
        window.WPD.get(type).set('field', data)
      } else {
        window.WPD.get(type).set(stationId, data)
      }
    } else {
      window.WPD.set(type, new Map())
      if (field) {
        window.WPD.get(type).set('field', data)
      } else {
        window.WPD.get(type).set(stationId, data)
      }
    }
  }

  const changeWPDInitComplete = (status) => {
    WPDInitComplete.value = status
  }

  return {
    projectId,
    userProjectId,
    WPDInitComplete,
    getWPDData,
    changeWPDInitComplete
  }
})
