<script setup>
import dayjs from 'dayjs'
import { ref, onMounted, watch, computed } from 'vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const systemTime = computed(() => systemStore.systemTime)
const changeSystemTime = systemStore.changeSystemTime

setInterval(() => {
  changeSystemTime(dayjs().format('YYYY-MM-DD HH:mm:ss'))
}, 1000)
</script>

<template>
  <div class="app-header">
    <div class="app-header-left">{{ systemTime }}</div>
    <div class="app-header-content">防汛应急综合指挥平台</div>
    <div class="app-header-right"></div>
  </div>
</template>

<style scoped>
.app-header {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.85);
  .app-header-content {
    font-size: 30px;
  }
}
</style>
