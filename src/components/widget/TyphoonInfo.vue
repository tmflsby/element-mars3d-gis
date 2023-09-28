<script setup>
import dayjs from 'dayjs'
import lodash from 'lodash'
import mars3dLayer from '@/utils/mars3dLayer'
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { Typhoon_GetTyphoonList, Typhoon_GetTyphoonPath } from '@/api/weather'

const tableData = reactive([])
const tableColumn = reactive([
  { title: '台风编号', field: 'num' },
  { title: '中文名', field: 'name_cn' },
  { title: '英文名', field: 'name_en' }
])
const selectedTyphoon = ref([])

const getTyphoonList = async () => {
  const getTyphoonListRes = await Typhoon_GetTyphoonList({
    year: dayjs().year()
  })
  // console.log(getTyphoonListRes)
  if (getTyphoonListRes.code === 200 && getTyphoonListRes.success) {
    for (let i = 0; i < getTyphoonListRes.data.length; i++) {
      tableData.push({
        num: getTyphoonListRes.data[i].value,
        name_cn: getTyphoonListRes.data[i].text
          .split(' ')[0]
          .split(getTyphoonListRes.data[i].value)[1],
        name_en: getTyphoonListRes.data[i].text.split(' ')[1]
      })
    }
  }
}

onBeforeMount(() => {
  getTyphoonList()
})

const selectionChange = (selection) => {
  // console.log(selection)
  selectedTyphoon.value = selection
  if (!window.CustomLayer.typhoonAlarmLineLayer) {
    mars3dLayer.typhoonAlarmLineLayer()
  }
}

watch(
  () => {
    return selectedTyphoon.value
  },
  async (newVal, oldVal) => {
    // console.log(newVal, oldVal)
    // 新增
    if (newVal.length > oldVal.length) {
      const addTyphoon = lodash.difference(newVal, oldVal)
      // console.log(addTyphoon)
      for (let i = 0; i < addTyphoon.length; i++) {
        const getTyphoonPathRes = await Typhoon_GetTyphoonPath({
          typhoonNo: addTyphoon[i].num
        })
        // console.log(getTyphoonPathRes)
        if (getTyphoonPathRes.success) {
          mars3dLayer.typhoonPathLayer(getTyphoonPathRes.data)
        }
      }
    }
    // 减少
    if (newVal.length < oldVal.length) {
      const deleteTyphoon = lodash.difference(oldVal, newVal)
      for (let i = 0; i < deleteTyphoon.length; i++) {
        // 清除台风路径layer
        window.CustomLayer.typhoonPathLayer[deleteTyphoon[i].name_en].clear()
      }
      // console.log(deleteTyphoon)
    }
    if (newVal.length > 0) {
      window.CustomLayer.typhoonAlarmLineLayer.show = true
      window.CustomLayer.maskLayer.show = false
    } else {
      window.CustomLayer.typhoonAlarmLineLayer.show = false
      window.CustomLayer.maskLayer.show = true
    }
  }
)
</script>

<template>
  <div class="typhoon-info">
    <el-table height="100%" :data="tableData" @selectionChange="selectionChange">
      <el-table-column type="selection" />
      <el-table-column
        v-for="item in tableColumn"
        :key="item.field"
        :prop="item.field"
        :label="item.title"
      />
    </el-table>
  </div>
</template>

<style scoped>
.typhoon-info {
  width: 100%;
  height: 100%;
}
</style>
