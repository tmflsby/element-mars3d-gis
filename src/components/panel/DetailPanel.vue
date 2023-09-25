<script setup>
import { ref } from 'vue'
import { usePanelStore } from '@/stores/panel'

const detailPanelProps = defineProps({
  props: {
    type: Object,
    default: () => ({})
  }
})

const panelStore = usePanelStore()
const setPanelVisible = panelStore.setPanelVisible

const widgetComponent = {}
const files = import.meta.globEager('../widget/*.vue')
for (const key in files) {
  const filename = key.replace(/(\..\/widget\/|\.(vue))/g, '')
  widgetComponent[filename] = files[key].default || files[key]
}

const handleClickBackBtn = (component) => {
  setPanelVisible(`${component}Visible`, false)
}

const checkedTab = ref(detailPanelProps.props.tabs[0])

const handleClickTabBtn = (tab) => {
  checkedTab.value = tab
}
</script>

<template>
  <div class="detail-panel" :style="detailPanelProps.props.style">
    <el-card class="detail-container">
      <template #header>
        <div class="title">
          <span>{{ detailPanelProps.props.title }}</span>
          <i
            class="fa fa-mail-reply"
            aria-hidden="true"
            @click="handleClickBackBtn(detailPanelProps.props.component)"
          />
        </div>
      </template>
      <div class="content">
        <div class="tabs-btn" v-if="detailPanelProps.props.tabs.length > 1">
          <el-button
            round
            v-for="(tab, tabIndex) in detailPanelProps.props.tabs"
            :key="tab + tabIndex"
            :type="checkedTab.title === tab.title ? 'primary' : 'default'"
            @click="handleClickTabBtn(tab)"
          >
            {{ tab.title }}
          </el-button>
        </div>
        <div
          :class="[
            'sub-tabs',
            checkedTab.subTabs.length > 1 ? 'has-tabs' : 'no-tabs',
            detailPanelProps.props.tabs.length > 1 ? 'has-tab-btn' : 'no-tab-btn'
          ]"
        >
          <el-tabs type="border-card" v-if="checkedTab.subTabs.length > 1">
            <el-tab-pane
              v-for="(subTab, subTabIndex) in checkedTab.subTabs"
              :key="subTab + subTabIndex"
              :label="subTab.title"
            >
              <component :is="widgetComponent[subTab.component]"></component>
            </el-tab-pane>
          </el-tabs>
          <component v-else :is="widgetComponent[checkedTab.subTabs[0].component]"></component>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.detail-panel {
  width: 100%;
  height: 100%;
  .detail-container {
    width: 100%;
    height: 100%;
    :deep(.el-card__header) {
      width: 100%;
      height: 50px;
      padding: 0;
    }
    :deep(.el-card__body) {
      width: 100%;
      height: calc(100% - 50px);
      padding: 0;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      .fa-mail-reply {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .content {
      width: 100%;
      height: 100%;
      padding: 10px;
      box-sizing: border-box;
      .tabs-btn {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        .el-button {
          flex: 1;
        }
      }
      .sub-tabs {
        width: 100%;
        height: 100%;
        :deep(.el-tabs) {
          width: 100%;
          height: 100%;
          .el-tabs__content {
            width: 100%;
            height: calc(100% - 40px);
            box-sizing: border-box;
            .el-tab-pane {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .sub-tabs.no-tab-btn.has-tabs,
      .sub-tabs.has-tab-btn.no-tabs,
      .sub-tabs.has-tab-btn.has-tabs {
        width: 100%;
        height: calc(100% - 50px);
      }
      .sub-tabs.no-tab-btn.no-tabs {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
