<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'

const layerTreeData = reactive([])

onMounted(() => {
  console.log('ManageLayers mounted', window)
})
</script>

<template>
  <div class="manage-layers">
    <el-tree
      node-key="id"
      :data="layerTreeData"
      :props="defaultProps"
      :render-after-expand="false"
      :default-expand-all="true"
    />
  </div>
</template>

<style scoped>
.manage-layers {
  position: absolute;
  top: 75px;
  left: 0;
  width: 450px;
  height: 800px;
  overflow: auto;
  z-index: 1;
  background: gray;
}
</style>
