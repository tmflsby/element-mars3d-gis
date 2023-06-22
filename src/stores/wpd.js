import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useWPDStore = defineStore('wpd', () => {
  const projectId = ref('3bc0fb05339a46d7966a7abac9fc3516')
  const userProjectId = ref('e3cc3a226021fdc238bb32550647d767')
  const WPStationRR_topoId = ref('WPStationRR:a8ac88b322ba4751a9bdec01903ae3f5')
  const WPStationZQ_topoId = ref('WPStationZQ:ad2a00ca60a54b07a0ad2ec3bfb88a2e')
  const WPStationZZ_topoId = ref('WPStationZZ:9de24abefa1a4f68a9cc451d54cd1252')
  const WPStationPP_topoId = ref('WPStationPP:1f5ee4f1674f44909f57c7d52227f504')
  const WPStationHP_topoId = ref('WPStationHP:922b7f8f381e4f0882ab09eca44b4f08')
  const WPMonitoringPoints_topoId = ref('WPMonitoringPoints:6b122969-b905-40c2-bd6c-04f51dd7c5bf')
  const WPSluice_topoId = ref('WPSluice:7a64c814-9286-436c-857b-6e811bb5ec3b')
  const WPembankment_topoId = ref('WPembankment:3688de78-dd01-4fa4-a909-49484f5693f7')
  const WPStationPump_topoId = ref('WPStationPump:9d36ff55-aa08-4e61-aff6-62f590c628f9')
  const EasilyFloodedArea_topoId = ref('EasilyFloodedArea:488677d5-b40c-49e2-aecc-eb0ca1b53c5d')
  const WPAdministrativeArea_topoId = ref(
    'WPAdministrativeArea:feb3d377-5054-4892-85ac-3d1fdc363f68'
  )

  return {
    projectId,
    userProjectId,
    WPStationRR_topoId,
    WPStationZQ_topoId,
    WPStationZZ_topoId,
    WPStationPP_topoId,
    WPStationHP_topoId,
    WPMonitoringPoints_topoId,
    WPSluice_topoId,
    WPembankment_topoId,
    WPStationPump_topoId,
    EasilyFloodedArea_topoId,
    WPAdministrativeArea_topoId
  }
})
