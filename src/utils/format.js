export const formatStation = (stationType) => {
  switch (stationType) {
    case 'WPStationRR':
      return '水库站'
    case 'WPStationZQ':
      return '水文站'
    case 'WPStationZZ':
      return '水位站'
    case 'WPStationPP':
      return '雨量站'
    case 'WPStationHP':
      return '水电站'
    case 'WPMonitoringPoints':
      return '监控点'
    case 'WPSluice':
      return '水闸'
    case 'WPembankment':
      return '堤防'
    case 'WPStationPump':
      return '泵站'
    case 'EasilyFloodedArea':
      return '易淹区水位计'
    case 'WPAdministrativeArea':
      return '行政区划'
    case 'WPEmergencyTeam':
      return '应急队伍'
    case 'WPMaterialInventory':
      return '应急物资'
    case 'WPRiver':
      return '河道'
    default:
      return '-'
  }
}

export const formatWaterLevel = (waterLevel) => {
  if (waterLevel) {
    return waterLevel.toFixed(2)
  } else {
    return '-'
  }
}
