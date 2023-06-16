<script setup>
import { ref, reactive, onBeforeMount, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const layerTreeData = reactive([])
const defaultCheckedKeys = reactive([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
const randomLayerTreeKey = ref(`${Math.random()}`)
const treeNodeClickCount = ref(0)
const router = useRouter()

onBeforeMount(() => {
  initLayerTreeData()
})

// 监听路由变化，刷新图层树
watch(
  () => router.currentRoute.value,
  () => {
    updateLayerTreeData(layerTreeData)
    // 为啥未响应式更改 只能强制刷新图层树
    randomLayerTreeKey.value = `${Math.random()}`
  }
)

const updateLayerTreeData = (layerTreeData) => {
  for (let i = 0; i < layerTreeData.length; i++) {
    const layer = window.map.getLayer(layerTreeData[i].id)
    // console.log('layer', layer.show)
    layerTreeData[i].show = layer.show
    if (layer.options.type === 'group') {
      updateLayerTreeData(layerTreeData[i].children)
    }
  }
}

const initLayerTreeData = () => {
  // console.log('initLayerTreeData', window.map.options)
  for (let i = 0; i < window.map.options.layers.length; i++) {
    const layer = window.map.getLayer(window.map.options.layers[i].id)
    // console.log('layer', layer)
    if (layer.isAdded && layer.show) {
      defaultCheckedKeys.push(layer.options.id)
    }
    if (layer.options.type === 'group') {
      layerTreeData.push({
        ...layer.options,
        children: []
      })
    } else {
      const group = layerTreeData.find((item) => item.id === layer.options.pid)
      if (group) {
        group.children.push(layer.options)
      }
    }
  }
  // console.log('layerTreeData', layerTreeData, defaultCheckedKeys)
}

const handleCheckTreeNode = (node) => {
  // console.log('node', node)
  const layer = window.map.getLayer(node.id)
  // console.log('layer', layer)
  if (!layer.isAdded) {
    window.map.addLayer(layer)
  }
  node.show = !layer.show
  layer.show = !layer.show
}

const handleClickTreeNode = (node) => {
  treeNodeClickCount.value++
  if (treeNodeClickCount.value >= 2) {
    treeNodeClickCount.value = 0
    const layer = window.map.getLayer(node.id)
    // console.log('layer', layer)
    layer.flyTo()
  }
}

const handleChangeLayerOpacity = (node) => {
  const layer = window.map.getLayer(node.id)
  layer.opacity = node.opacity
}
</script>

<template>
  <el-card class="manage-layers">
    <el-tree
      show-checkbox
      node-key="id"
      :key="randomLayerTreeKey"
      :data="layerTreeData"
      :props="defaultProps"
      :default-checked-keys="defaultCheckedKeys"
      :render-after-expand="false"
      :default-expand-all="true"
      @check="handleCheckTreeNode"
      @node-click="handleClickTreeNode"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <el-slider
            class="slider"
            v-show="data.type !== 'group' && data.show"
            v-model="data.opacity"
            :max="1"
            :step="0.1"
            @change="handleChangeLayerOpacity(data)"
          />
        </span>
      </template>
    </el-tree>
  </el-card>
</template>

<style scoped>
.manage-layers {
  position: absolute;
  top: 100px;
  left: 0;
  width: 350px;
  height: 500px;
  overflow: auto;
  z-index: 1;

  .custom-tree-node {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .slider {
      width: 100px;
      margin-left: 20px;
    }
  }
}
</style>
