<script setup>
import { reactive, onBeforeMount } from 'vue'
import { enterpConting_takeRefuge } from '@/api/enterpConting'
import { useWPDStore } from '@/stores/wpd'
import { useSystemStore } from '@/stores/system'

const WPDStore = useWPDStore()
const projectId = WPDStore.projectId
const systemStore = useSystemStore()
const selectedDept = systemStore.selectedDept
const areaId = window.WPD.get('WPAdministrativeArea').get(selectedDept.code).id
const type = window.WPD.get('WPAdministrativeArea').get(selectedDept.code).level

let shelter = window.WPD.get('Shelter')
const shelterCategories = reactive([])

const getShelter = async () => {
  const takeRefugeRes = await enterpConting_takeRefuge({
    projectId,
    areaId,
    type
  })
  if (takeRefugeRes.state === 0) {
    window.WPD.set('Shelter', new Map())
    for (let i = 0; i < takeRefugeRes.data.length; i++) {
      takeRefugeRes.data[i].placeType =
        takeRefugeRes.data[i].placeType === '' ? '未归类' : takeRefugeRes.data[i].placeType
      if (window.WPD.get('Shelter').get(takeRefugeRes.data[i].placeType) == null) {
        window.WPD.get('Shelter').set(takeRefugeRes.data[i].placeType, new Map())
      }
      for (let j = 0; j < takeRefugeRes.data[i].placeDetails.length; j++) {
        window.WPD.get('Shelter')
          .get(takeRefugeRes.data[i].placeType)
          .set(takeRefugeRes.data[i].placeDetails[j].emergId, takeRefugeRes.data[i].placeDetails[j])
      }
    }
    shelter = window.WPD.get('Shelter')
    categoryShelter()
  }
}

const categoryShelter = () => {
  shelter.forEach((value, key) => {
    shelterCategories.push({
      name: key,
      value: value.size
    })
  })
}

onBeforeMount(() => {
  if (shelter == null) {
    getShelter()
  } else {
    categoryShelter()
  }
})
</script>

<template>
  <div class="shelter">
    <el-card class="shelter-item" v-for="item in shelterCategories" :key="item.name">
      <div class="shelter-item-name">{{ item.name }}</div>
      <div class="shelter-item-value">{{ item.value }}</div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.shelter {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .shelter-item {
    width: 45%;
    height: 30px;
    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      padding: 0 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
