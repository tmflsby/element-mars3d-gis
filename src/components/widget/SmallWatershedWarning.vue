<script setup>
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { smallWatershed_getAreaQList } from '@/api/smallWatershed'
import { useSystemStore } from '@/stores/system'
import dayjs from 'dayjs'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)

const warningList = reactive([
  { name: '陈大子流域', id: 'sm_cd', runoffVolume: 0 },
  { name: '渔潭子流域', id: 'sm_yt', runoffVolume: 0 },
  { name: '新桥子流域', id: 'sm_xq', runoffVolume: 0 }
])
const warningTime = ref('')
const warningStatus = ref(true)

const getAreaQList = async () => {
  const getAreaQListRes = await smallWatershed_getAreaQList({
    runTime: dayjs(refreshTime.value).format('YYYY-MM-DD HH:00:00')
  })
  if (getAreaQListRes.code === 200) {
    for (let i = 0; i < warningList.length; i++) {
      if (getAreaQListRes.data[warningList[i].id]) {
        warningStatus.value = true
        // 取查询时间后一小时的数据
        warningList[i].runoffVolume = getAreaQListRes.data[warningList[i].id][1].q
        warningTime.value = getAreaQListRes.data[warningList[i].id][1].time
      } else {
        warningStatus.value = false
      }
    }
  }
}

onBeforeMount(() => {
  getAreaQList()
})

watch(
  () => refreshTime.value,
  () => {
    getAreaQList()
  }
)
</script>

<template>
  <div class="small-watershed-warning">
    <el-descriptions border v-if="warningStatus" :column="1" :title="warningTime">
      <el-descriptions-item
        label-align="center"
        align="center"
        v-for="item in warningList"
        :key="item.id"
        :label="item.name"
      >
        {{ item.runoffVolume }} m³/s
      </el-descriptions-item>
    </el-descriptions>
    <el-empty v-else :image-size="50"></el-empty>
  </div>
</template>

<style scoped lang="scss">
.small-watershed-warning {
  height: 100%;
  width: 100%;
  overflow: auto;
  .el-empty {
    width: 100%;
    height: 100%;
  }
}
</style>
