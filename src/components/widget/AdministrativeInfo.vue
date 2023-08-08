<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { cantonManage_queryObjectTreeInfo } from '@/api/cantonManage'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const wpdStore = useWPDStore()
const projectId = wpdStore.projectId

const systemStore = useSystemStore()
const selectedDept = computed(() => systemStore.selectedDept)

const administrativeTreeInfo = ref(window.WPD.get('administrativeTreeInfo'))

const getObjectTreeInfo = async () => {
  const getObjectTreeInfoRes = await cantonManage_queryObjectTreeInfo({
    projectId,
    cantonId: selectedDept.value.code
  })
  if (getObjectTreeInfoRes.state === 0) {
    administrativeTreeInfo.value = getObjectTreeInfoRes.data
    window.WPD.set('administrativeTreeInfo', getObjectTreeInfoRes.data)
  }
}

onBeforeMount(() => {
  if (administrativeTreeInfo.value == null) {
    getObjectTreeInfo()
  }
})
</script>

<template>
  <div class="administrative-info">
    <div class="title">
      <div class="name">行政名称</div>
      <div class="landArea">土地面积</div>
      <div class="township">乡镇</div>
      <div class="village">村</div>
    </div>
    <div class="content" v-if="administrativeTreeInfo">
      <el-collapse class="collapse-content">
        <el-collapse-item>
          <template #title>
            <div class="city-info">
              <div class="name">{{ administrativeTreeInfo.name }}</div>
              <div class="landArea">{{ administrativeTreeInfo.landArea }}</div>
              <div class="township">{{ administrativeTreeInfo.townshipNum }}</div>
              <div class="village">{{ administrativeTreeInfo.villageNum }}</div>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item
              v-for="county in administrativeTreeInfo.children"
              :key="county.idx_mark"
            >
              <template #title>
                <div class="county-info">
                  <div class="name">{{ county.name }}</div>
                  <div class="landArea">{{ county.landArea }}</div>
                  <div class="township">{{ county.townshipNum }}</div>
                  <div class="village">{{ county.villageNum }}</div>
                </div>
              </template>

              <el-collapse>
                <el-collapse-item v-for="township in county.children" :key="township.idx_mark">
                  <template #title>
                    <div class="township-info">
                      <div class="name">{{ township.name }}</div>
                      <div class="landArea">{{ township.landArea }}</div>
                      <div class="township">{{ township.townshipNum }}</div>
                      <div class="village">{{ township.villageNum }}</div>
                    </div>
                  </template>

                  <div
                    class="village-info"
                    v-for="village in township.children"
                    :key="village.idx_mark"
                  >
                    <div class="name">{{ village.name }}</div>
                    <div class="landArea">{{ village.landArea }}</div>
                    <div class="township">{{ village.townshipNum }}</div>
                    <div class="village">{{ village.villageNum }}</div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
.administrative-info {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: 50px;
    display: flex;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .content {
    width: 100%;
    height: calc(100% - 50px);
    .collapse-content {
      width: 100%;
      height: 100%;
      overflow: auto;
      :deep(.el-collapse-item__content) {
        padding: 0;
      }
    }
    .city-info,
    .county-info,
    .township-info,
    .village-info {
      width: 100%;
      display: flex;
    }
    .village-info {
      height: 50px;
      border-top: 1px solid var(--el-collapse-border-color);
      //border-bottom: 1px solid var(--el-collapse-border-color);
      cursor: pointer;
    }
  }
  .name,
  .landArea {
    flex: 1.5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .township,
  .village {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
