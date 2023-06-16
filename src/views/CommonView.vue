<script setup>
import { useMapStore } from '@/stores/map'
import ManageLayers from '@/components/ManageLayers.vue'
import { computed } from 'vue'

const mapStore = useMapStore()
const mapInitComplete = computed(() => mapStore.mapInitComplete)
</script>

<template>
  <div class="common-view">
    <ManageLayers v-if="mapInitComplete" />
  </div>
</template>

<style scoped></style>
