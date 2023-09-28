<script setup>
import dayjs from 'dayjs'
import { ref, computed, watch, onBeforeMount } from 'vue'
import { AlarmSingal_GetProcessList, AlarmSingal_GetDefenseGuide } from '@/api/weather'
import { useDataSourceStore } from '@/stores/dataSource'

let MeteorologicalDefenseGuide = window.WPD.get('MeteorologicalDefenseGuide')

const dataSourceStore = useDataSourceStore()
const meteorologicalWarning = computed(() => dataSourceStore.meteorologicalWarning)

const signalTypeOptions = [
  '全部',
  '冰雹',
  '台风',
  '大雾',
  '大风',
  '寒潮',
  '干旱',
  '暴雨',
  '暴雪',
  '雷电',
  '霜冻',
  '高温'
]
const selectedSignalType = ref('全部')
const signalLevelOptions = ['全部', '红色', '橙色', '黄色', '蓝色']
const selectedSignalLevel = ref('全部')
const statusOptions = ['全部', '生效中']
const selectedStatus = ref('全部')
const filterMeteorologicalWarning = computed(() =>
  meteorologicalWarning.value.filter(
    (item) =>
      (selectedSignalType.value === '全部' || item.signalType === selectedSignalType.value) &&
      (selectedSignalLevel.value === '全部' || item.signalLevel === selectedSignalLevel.value) &&
      (selectedStatus.value === '全部' ||
        ['发布', '继续发布'].includes(item.changeStr) === (selectedStatus.value === '生效中'))
  )
)

const activeName = ref('')
const activeContent = ref([])

const dialogVisible = ref(false)
const dialogDefenseGuide = ref('')
const dialogSignal = ref(null)

const GetDefenseGuide = async () => {
  window.WPD.set('MeteorologicalDefenseGuide', new Map())
  const GetDefenseGuideRes = await AlarmSingal_GetDefenseGuide()
  // console.log(GetDefenseGuideRes)
  if (GetDefenseGuideRes.code === 200 && GetDefenseGuideRes.success) {
    for (let i = 0; i < GetDefenseGuideRes.data.length; i++) {
      const item = GetDefenseGuideRes.data[i]
      if (window.WPD.get('MeteorologicalDefenseGuide').has(item.type)) {
        window.WPD.get('MeteorologicalDefenseGuide').get(item.type).set(item.level, item)
      } else {
        window.WPD.get('MeteorologicalDefenseGuide').set(item.type, new Map())
        window.WPD.get('MeteorologicalDefenseGuide').get(item.type).set(item.level, item)
      }
    }

    MeteorologicalDefenseGuide = window.WPD.get('MeteorologicalDefenseGuide')
  }
}

onBeforeMount(() => {
  if (MeteorologicalDefenseGuide == null) {
    GetDefenseGuide()
  }
})

const GetProcessList = async (currentSingal) => {
  const GetProcessListRes = await AlarmSingal_GetProcessList({
    pid: currentSingal.pid
  })
  // console.log(GetProcessListRes)
  if (GetProcessListRes.code === 200 && GetProcessListRes.success) {
    activeContent.value = GetProcessListRes.data
  } else {
    activeContent.value = []
  }
}

watch(
  () => activeName.value,
  () => {
    // console.log(activeName.value)
    if (activeName.value !== '') {
      const currentSingal = filterMeteorologicalWarning.value.find(
        (item) => item.alertId === activeName.value
      )
      GetProcessList(currentSingal)
    }
  }
)

const openDefenseGuideDialog = (signal) => {
  dialogVisible.value = true
  dialogSignal.value = signal
  dialogDefenseGuide.value = MeteorologicalDefenseGuide.get(signal.signalType)
    .get(signal.signalLevel)
    .guide.split('；')
}
</script>

<template>
  <div class="meteorological-warning-list">
    <div class="select-control">
      <el-select v-model="selectedSignalType">
        <el-option v-for="item in signalTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="selectedSignalLevel">
        <el-option v-for="item in signalLevelOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="selectedStatus">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <el-collapse class="collapse-content" accordion v-model="activeName">
      <el-collapse-item
        v-for="warningItem in filterMeteorologicalWarning"
        :key="warningItem.alertId"
        :name="warningItem.alertId"
      >
        <template #title>
          <div class="title">
            <el-image
              :src="`img/meteorological/${warningItem.signalType}${warningItem.signalLevel}.svg`"
              alt=""
            />
            <div class="title-des">
              <div class="signal">
                {{ warningItem.signalType }}{{ warningItem.signalLevel }}预警
                <el-tag
                  :type="
                    warningItem.changeStr === '解除'
                      ? 'info'
                      : warningItem.changeStr === '发布'
                      ? ''
                      : 'warning'
                  "
                >
                  {{ warningItem.changeStr }}
                </el-tag>
              </div>
              <div class="time">{{ dayjs(warningItem.cTime).format('MM月DD日 HH时mm分') }}发布</div>
            </div>
          </div>
        </template>

        <div class="active-content" v-if="activeContent.length > 0">
          <div
            class="content-item"
            v-for="item in activeContent"
            :key="item.alertId"
            @click="openDefenseGuideDialog(item)"
          >
            <el-tag
              :type="
                item.changeStr === '解除' ? 'info' : item.changeStr === '发布' ? '' : 'warning'
              "
            >
              {{ item.changeStr }}
            </el-tag>
            <div class="content">{{ item.content }}</div>
            <div class="time">{{ dayjs(item.cTime).format('MM月DD日 HH时mm分') }}</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog width="500" v-model="dialogVisible">
      <div class="dialog-title">
        <el-image
          :src="`img/meteorological/${dialogSignal.signalType}${dialogSignal.signalLevel}.svg`"
          alt=""
        />
        <div class="title-des">
          <div class="name">{{ dialogSignal.signalType }}{{ dialogSignal.signalLevel }}预警</div>
          <div class="publish">
            {{ dialogSignal.department }}
            {{ dayjs(dialogSignal.cTime).format('MM月DD日 HH时mm分') }}发布
          </div>
        </div>
      </div>
      <div class="dialog-content">{{ dialogSignal.content }}</div>
      <div class="dialog-defense-guide">
        <div class="title">防御指南：</div>
        <div class="content">
          <div class="item" v-for="(item, index) in dialogDefenseGuide" :key="item">
            {{ item }}{{ index === dialogDefenseGuide.length - 1 ? '' : '；' }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.meteorological-warning-list {
  width: 100%;
  height: 100%;
  .select-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .collapse-content {
    width: 100%;
    height: calc(100% - 50px);
    overflow: auto;
    :deep(.el-collapse-item__content) {
      padding: 0;
    }
    :deep(.el-collapse-item__header) {
      width: 100%;
      height: 80px;
    }
    .title {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      .el-image {
        height: 100%;
      }
      .title-des {
        width: calc(100% - 60px);
        height: 100%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        .signal {
          flex: 1;
          width: 100%;
          height: 50%;
          font-size: 18px;
          font-weight: bold;
          .el-tag {
            margin-left: 10px;
          }
        }
        .time {
          flex: 1;
          width: 100%;
          height: 50%;
        }
      }
    }
    .active-content {
      width: 100%;
      .content-item {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
        .el-tag,
        .time {
          width: 15%;
        }
        .content {
          width: 60%;
          // 省略号
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  :deep(.el-dialog__body) {
    display: flex;
    flex-direction: column;
    .dialog-title {
      width: 100%;
      height: 80px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-around;
      .el-image {
        height: 100%;
      }
      .title-des {
        width: calc(100% - 60px);
        height: 100%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        .name {
          display: flex;
          align-items: center;
          flex: 1;
          width: 100%;
          height: 50%;
          font-size: 18px;
          font-weight: bold;
        }
        .publish {
          display: flex;
          align-items: center;
          flex: 1;
          width: 100%;
          height: 50%;
        }
      }
    }
    .dialog-content {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .dialog-defense-guide {
      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .content {
        display: flex;
        flex-wrap: wrap;
        .item {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
