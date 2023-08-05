<script setup>
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePanelStore } from '@/stores/panel'

defineProps({
  props: {
    type: Object,
    default: () => ({})
  }
})

const layerTreeData = reactive([])
const defaultCheckedKeys = reactive([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
const randomLayerTreeKey = ref(`${Math.random()}`)
const treeNodeClickCount = ref(0)
const router = useRouter()
const panelStore = usePanelStore()
const setPanelVisible = panelStore.setPanelVisible

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
    // 蒙蔽
    if (layer.id === 3001) {
      window.maskLayer.show = layer.show
    }
    if (layer.options.type === 'group') {
      updateLayerTreeData(layerTreeData[i].children)
    }
  }
}

const initLayerTreeData = () => {
  // console.log('initLayerTreeData', window.map.options)
  for (let i = 0; i < window.map.options.layers.length; i++) {
    const layer = window.map.getLayer(window.map.options.layers[i].id)
    window.map.addLayer(layer)
    // console.log('layer', layer)
    if (layer.show) {
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

  node.show = !layer.show
  layer.show = !layer.show

  // 蒙蔽
  if (node.id === 200301) {
    window.maskLayer.show = layer.show
  }
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

const closeLayerTreePanel = () => {
  setPanelVisible('LayerTreePanelVisible', false)
}
</script>

<template>
  <div class="layer-tree-panel" :style="props.style">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>图层管理</span>
          <i class="fa fa-close" aria-hidden="true" @click="closeLayerTreePanel" />
        </div>
      </template>
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
        <template #default="{ data }">
          <span class="custom-tree-node">
            <span>{{ data.name }}</span>
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
  </div>
</template>

<style scoped lang="scss">
.layer-tree-panel {
  width: 100%;
  height: 100%;
  .el-card {
    width: 100%;
    height: 100%;
    :deep(.el-card__header) {
      width: 100%;
      height: 50px;
      .card-header {
        .fa-close {
          float: right;
          cursor: pointer;
        }
      }
    }
    :deep(.el-card__body) {
      width: 100%;
      height: calc(100% - 50px);
      overflow: auto;
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
  }
}
</style>
