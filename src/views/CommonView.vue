<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMapStore } from '@/stores/map'
const panelComponent = {}
const files = import.meta.globEager('../components/panel/*.vue')

for (const key in files) {
  const filename = key.replace(/(\..\/components\/panel\/|\.(vue))/g, '')
  panelComponent[filename] = files[key].default || files[key]
}

const router = useRouter()
const routerPanel = computed(() => router.currentRoute.value.meta.panel)

const mapStore = useMapStore()
const mapInitComplete = computed(() => mapStore.mapInitComplete)
</script>

<template>
  <div class="common-view" v-if="mapInitComplete">
    <template v-for="(panel, panelKey) in routerPanel" :key="panelKey">
      <component :is="panelComponent['CommonPanel']" :visible="panel.visible" :style="panel.style">
        <component :is="panelComponent[panel.component]" :props="panel.props"></component>
      </component>
    </template>
  </div>
</template>

<style scoped></style>
