<script setup>
import dayjs from 'dayjs'
import { reactive, computed, onBeforeMount, watch } from 'vue'
import { sift_disposeDzObj } from '@/api/sift'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const refreshTime = computed(() => systemStore.refreshTime)
const userInfo = systemStore.userInfo

const warningList = reactive([
  { title: '发布', value: 0 },
  { title: '响应', value: 0 }
])

const getDisasterWarning = async () => {
  let getStatisticsByAreaCodesAndTimeRangeURL = `${window.baseUrl.disasterWarning}/getStatisticsByAreaCodesAndTimeRange?`
  getStatisticsByAreaCodesAndTimeRangeURL += `beginTime=${dayjs(refreshTime.value)
    .subtract(1, 'day')
    .format('YYYY-MM-DD HH:mm:ss')}&endTime=${dayjs(refreshTime.value).format(
    'YYYY-MM-DD HH:mm:ss'
  )}&parentVacode=${userInfo.dept.code}`
  const disposeDzObjRes = await sift_disposeDzObj({
    link: getStatisticsByAreaCodesAndTimeRangeURL
  })
  // console.log(disposeDzObjRes)
  if (disposeDzObjRes.state === 0) {
    const statistics = JSON.parse(disposeDzObjRes.data)[0]
    warningList[0].value = statistics.GUIDECOUNTYCOUNT
    warningList[1].value = statistics.RESPONSECOUNTYCOUNT
  }
}

onBeforeMount(() => {
  getDisasterWarning()
})

watch(
  () => refreshTime.value,
  () => {
    getDisasterWarning()
  }
)
</script>

<template>
  <div class="disaster-warning">
    <el-descriptions border :column="1">
      <el-descriptions-item
        label-align="center"
        align="center"
        v-for="item in warningList"
        :key="item.title"
        :label="item.title"
      >
        <span style="color: red">{{ item.value }}</span>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<style scoped>
.disaster-warning {
  width: 100%;
  height: 100%;
}
</style>
