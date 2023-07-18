<script setup>
import { reactive, onBeforeMount } from 'vue'
import { disPoint_getDisasterOtherObjects } from '@/api/disPoint'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId

const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept

const emergencyTransferType = reactive([])
const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.code)

const getEmergencyTransfer = async () => {
  const getEmergencyTransferRes = await disPoint_getDisasterOtherObjects({
    projectId,
    areaId: region.id,
    type: region.level
  })
  if (getEmergencyTransferRes.state === 0) {
    window.WPD.set('emergencyTransfer', getEmergencyTransferRes.data)

    emergencyTransferType.push(
      ...[
        {
          name: '安置点',
          id: 'WPResettlementSite',
          value: getEmergencyTransferRes.data.WPResettlementSite.length
        },
        {
          name: '转移路线',
          id: 'WPTransferRoute',
          value: getEmergencyTransferRes.data.WPTransferRoute.length
        },
        {
          name: '危险区',
          id: 'WPCautionarea',
          value: getEmergencyTransferRes.data.WPCautionarea.length
        }
      ]
    )
  }
}

onBeforeMount(() => {
  getEmergencyTransfer()
})
</script>

<template>
  <div class="emergency-transfer">
    <el-card class="emergency-transfer-item" v-for="item in emergencyTransferType" :key="item.id">
      <div class="emergency-transfer-item-name">{{ item.name }}</div>
      <div class="emergency-transfer-item-value">{{ item.value }}</div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.emergency-transfer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .emergency-transfer-item {
    width: 30%;
    height: 100%;
    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>
