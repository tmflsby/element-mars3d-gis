<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStore } from '@/stores/map'
import CommonPanel from '@/components/CommonPanel.vue'
import OverviewPanel from '@/components/OverviewPanel.vue'

const router = useRouter()
const routerPanel = computed(() => router.currentRoute.value.meta.panel)

const mapStore = useMapStore()
const mapInitComplete = computed(() => mapStore.mapInitComplete)

const renderComponent = (component) => {
  switch (component) {
    case 'OverviewPanel':
      return OverviewPanel
    default:
      return null
  }
}
</script>

<template>
  <div class="common-view" v-if="mapInitComplete">
    <template v-for="(panel, panelKey) in routerPanel" :key="panelKey">
      <CommonPanel :visible="panel.visible" :style="panel.style">
        <component :is="renderComponent(panel.component)" :props="panel.props"></component>
      </CommonPanel>
    </template>
  </div>
</template>

<style scoped></style>
