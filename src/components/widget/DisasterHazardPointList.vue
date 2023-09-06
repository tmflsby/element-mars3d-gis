<script setup>
import lodash from 'lodash'
import { ref, reactive, onBeforeMount } from 'vue'

const disasterHazardPoint = window.WPD.get('disasterHazardPoint')
const disasterHazardPointList = reactive([])
const searchValue = ref('')
const allDisasterHazardPointList = reactive([])
const activeTownship = ref('')
let copyDisasterHazardPointList = null

const initDisasterHazardPointData = () => {
  // GroundCollapseList 地面塌陷
  const GroundCollapseList = {
    title: '地面塌陷',
    num: 0,
    children: []
  }
  for (let i = 0; i < disasterHazardPoint.GroundCollapseList.length; i++) {
    disasterHazardPoint.GroundCollapseList[i].type = '地面塌陷'
    disasterHazardPoint.GroundCollapseList[i].disasterName =
      disasterHazardPoint.GroundCollapseList[i].disasterName.trim()

    GroundCollapseList.num++
    if (
      GroundCollapseList.children.find(
        (item) =>
          item.title === disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName
      ) == null
    ) {
      GroundCollapseList.children.push({
        title: disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName,
        num: 1,
        children: [
          {
            title: disasterHazardPoint.GroundCollapseList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.GroundCollapseList[i]]
          }
        ]
      })
    } else {
      GroundCollapseList.children.find(
        (item) =>
          item.title === disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName
      ).num++
      if (
        GroundCollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title ===
              disasterHazardPoint.GroundCollapseList[i].townshipAdministrativeAreaName
          ) == null
      ) {
        GroundCollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName
          )
          .children.push({
            title: disasterHazardPoint.GroundCollapseList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.GroundCollapseList[i]]
          })
      } else {
        GroundCollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title ===
              disasterHazardPoint.GroundCollapseList[i].townshipAdministrativeAreaName
          ).num++
        GroundCollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.GroundCollapseList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title ===
              disasterHazardPoint.GroundCollapseList[i].townshipAdministrativeAreaName
          )
          .children.push(disasterHazardPoint.GroundCollapseList[i])
      }
    }
  }
  // console.log(GroundCollapseList, 'GroundCollapseList')

  const DebrisFlowList = {
    title: '泥石流',
    num: 0,
    children: []
  }
  for (let i = 0; i < disasterHazardPoint.DebrisFlowList.length; i++) {
    disasterHazardPoint.DebrisFlowList[i].type = '泥石流'
    disasterHazardPoint.DebrisFlowList[i].disasterName =
      disasterHazardPoint.DebrisFlowList[i].disasterName.trim()
    DebrisFlowList.num++
    if (
      DebrisFlowList.children.find(
        (item) => item.title === disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName
      ) == null
    ) {
      DebrisFlowList.children.push({
        title: disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName,
        num: 1,
        children: [
          {
            title: disasterHazardPoint.DebrisFlowList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.DebrisFlowList[i]]
          }
        ]
      })
    } else {
      DebrisFlowList.children.find(
        (item) => item.title === disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName
      ).num++
      if (
        DebrisFlowList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].townshipAdministrativeAreaName
          ) == null
      ) {
        DebrisFlowList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName
          )
          .children.push({
            title: disasterHazardPoint.DebrisFlowList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.DebrisFlowList[i]]
          })
      } else {
        DebrisFlowList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].townshipAdministrativeAreaName
          ).num++
        DebrisFlowList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.DebrisFlowList[i].townshipAdministrativeAreaName
          )
          .children.push(disasterHazardPoint.DebrisFlowList[i])
      }
    }
  }
  // console.log(DebrisFlowList, 'DebrisFlowList')

  const CollapseList = {
    title: '崩塌',
    num: 0,
    children: []
  }
  for (let i = 0; i < disasterHazardPoint.CollapseList.length; i++) {
    disasterHazardPoint.CollapseList[i].type = '崩塌'
    disasterHazardPoint.CollapseList[i].disasterName =
      disasterHazardPoint.CollapseList[i].disasterName.trim()
    CollapseList.num++
    if (
      CollapseList.children.find(
        (item) => item.title === disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName
      ) == null
    ) {
      CollapseList.children.push({
        title: disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName,
        num: 1,
        children: [
          {
            title: disasterHazardPoint.CollapseList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.CollapseList[i]]
          }
        ]
      })
    } else {
      CollapseList.children.find(
        (item) => item.title === disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName
      ).num++
      if (
        CollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].townshipAdministrativeAreaName
          ) == null
      ) {
        CollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName
          )
          .children.push({
            title: disasterHazardPoint.CollapseList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.CollapseList[i]]
          })
      } else {
        CollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].townshipAdministrativeAreaName
          ).num++
        CollapseList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.CollapseList[i].townshipAdministrativeAreaName
          )
          .children.push(disasterHazardPoint.CollapseList[i])
      }
    }
  }
  // console.log(CollapseList, 'CollapseList')

  const LandSlideList = {
    title: '滑坡',
    num: 0,
    children: []
  }
  for (let i = 0; i < disasterHazardPoint.LandSlideList.length; i++) {
    disasterHazardPoint.LandSlideList[i].type = '滑坡'
    disasterHazardPoint.LandSlideList[i].disasterName =
      disasterHazardPoint.LandSlideList[i].disasterName.trim()
    LandSlideList.num++
    if (
      LandSlideList.children.find(
        (item) => item.title === disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName
      ) == null
    ) {
      LandSlideList.children.push({
        title: disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName,
        num: 1,
        children: [
          {
            title: disasterHazardPoint.LandSlideList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.LandSlideList[i]]
          }
        ]
      })
    } else {
      LandSlideList.children.find(
        (item) => item.title === disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName
      ).num++
      if (
        LandSlideList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].townshipAdministrativeAreaName
          ) == null
      ) {
        LandSlideList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName
          )
          .children.push({
            title: disasterHazardPoint.LandSlideList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.LandSlideList[i]]
          })
      } else {
        LandSlideList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].townshipAdministrativeAreaName
          ).num++
        LandSlideList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title === disasterHazardPoint.LandSlideList[i].townshipAdministrativeAreaName
          )
          .children.push(disasterHazardPoint.LandSlideList[i])
      }
    }
  }
  // console.log(LandSlideList, 'LandSlideList')

  const HighSteepSlopeList = {
    title: '高陡边坡',
    num: 0,
    children: []
  }
  for (let i = 0; i < disasterHazardPoint.HighSteepSlopeList.length; i++) {
    disasterHazardPoint.HighSteepSlopeList[i].type = '高陡边坡'
    disasterHazardPoint.HighSteepSlopeList[i].disasterName =
      disasterHazardPoint.HighSteepSlopeList[i].disasterName.trim()
    HighSteepSlopeList.num++
    if (
      HighSteepSlopeList.children.find(
        (item) =>
          item.title === disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName
      ) == null
    ) {
      HighSteepSlopeList.children.push({
        title: disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName,
        num: 1,
        children: [
          {
            title: disasterHazardPoint.HighSteepSlopeList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.HighSteepSlopeList[i]]
          }
        ]
      })
    } else {
      HighSteepSlopeList.children.find(
        (item) =>
          item.title === disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName
      ).num++
      if (
        HighSteepSlopeList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title ===
              disasterHazardPoint.HighSteepSlopeList[i].townshipAdministrativeAreaName
          ) == null
      ) {
        HighSteepSlopeList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName
          )
          .children.push({
            title: disasterHazardPoint.HighSteepSlopeList[i].townshipAdministrativeAreaName,
            num: 1,
            children: [disasterHazardPoint.HighSteepSlopeList[i]]
          })
      } else {
        HighSteepSlopeList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title ===
              disasterHazardPoint.HighSteepSlopeList[i].townshipAdministrativeAreaName
          ).num++
        HighSteepSlopeList.children
          .find(
            (item) =>
              item.title === disasterHazardPoint.HighSteepSlopeList[i].countyAdministrativeAreaName
          )
          .children.find(
            (item) =>
              item.title ===
              disasterHazardPoint.HighSteepSlopeList[i].townshipAdministrativeAreaName
          )
          .children.push(disasterHazardPoint.HighSteepSlopeList[i])
      }
    }
  }
  // console.log(HighSteepSlopeList, 'HighSteepSlopeList')

  disasterHazardPointList.push(GroundCollapseList)
  disasterHazardPointList.push(DebrisFlowList)
  disasterHazardPointList.push(CollapseList)
  disasterHazardPointList.push(LandSlideList)
  disasterHazardPointList.push(HighSteepSlopeList)

  allDisasterHazardPointList.push(...disasterHazardPoint.GroundCollapseList)
  allDisasterHazardPointList.push(...disasterHazardPoint.DebrisFlowList)
  allDisasterHazardPointList.push(...disasterHazardPoint.CollapseList)
  allDisasterHazardPointList.push(...disasterHazardPoint.LandSlideList)
  allDisasterHazardPointList.push(...disasterHazardPoint.HighSteepSlopeList)

  // console.log(disasterHazardPointList, 'disasterHazardPointList')
  copyDisasterHazardPointList = lodash.cloneDeep(disasterHazardPointList)
}

onBeforeMount(() => {
  initDisasterHazardPointData()
})

const querySearch = (queryString, cb) => {
  const results = queryString
    ? allDisasterHazardPointList.filter((item) => item.disasterName.indexOf(queryString) > -1)
    : allDisasterHazardPointList
  // console.log(results, 'results')
  cb(results)
}

const selectDisasterHazardPoint = () => {
  disasterHazardPointList.splice(0, disasterHazardPointList.length)
  const filterDisasterHazardPointList = allDisasterHazardPointList.filter(
    (item) => item.disasterName.indexOf(searchValue.value) > -1
  )
  console.log(filterDisasterHazardPointList, 'filterDisasterHazardPointList')
  disasterHazardPointList.push({
    title: filterDisasterHazardPointList[0].type,
    num: 1,
    children: [
      {
        title: filterDisasterHazardPointList[0].countyAdministrativeAreaName,
        num: 1,
        children: [
          {
            title: filterDisasterHazardPointList[0].townshipAdministrativeAreaName,
            num: 1,
            children: [filterDisasterHazardPointList[0]]
          }
        ]
      }
    ]
  })
  activeTownship.value = ''
}

const clearSelectedDisasterHazardPoint = () => {
  disasterHazardPointList.splice(0, disasterHazardPointList.length, ...copyDisasterHazardPointList)
}
</script>

<template>
  <div class="disaster-hazard-point-list">
    <el-autocomplete
      placeholder="请输入内容"
      clearable
      value-key="disasterName"
      v-model="searchValue"
      :fetch-suggestions="querySearch"
      @select="selectDisasterHazardPoint"
      @clear="clearSelectedDisasterHazardPoint"
    />
    <div class="content">
      <div class="content-title">
        <div class="title">名称</div>
        <div class="num">数量</div>
      </div>
      <el-collapse class="collapse-content">
        <el-collapse-item v-for="type in disasterHazardPointList" :key="type.title">
          <template #title>
            <div class="type">
              <div class="title">{{ type.title }}</div>
              <div class="num">{{ type.num }}</div>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item v-for="county in type.children" :key="county.title">
              <template #title>
                <div class="county">
                  <div class="title">{{ county.title }}</div>
                  <div class="num">{{ county.num }}</div>
                </div>
              </template>

              <el-collapse accordion v-model="activeTownship">
                <el-collapse-item
                  v-for="township in county.children"
                  :key="township.title"
                  :name="township.title"
                >
                  <template #title>
                    <div class="township">
                      <div class="title">{{ township.title }}</div>
                      <div class="num">{{ township.num }}</div>
                    </div>
                  </template>

                  <el-table
                    max-height="300"
                    :data="township.children"
                    v-if="activeTownship === township.title"
                  >
                    <el-table-column prop="disasterName" label="名称" align="center" />
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
.disaster-hazard-point-list {
  width: 100%;
  height: 100%;
  :deep(.el-autocomplete) {
    margin: 10px 0;
    width: 100%;
  }
  :deep(.el-table__header-wrapper) {
    display: none;
  }
  .content {
    width: 100%;
    height: calc(100% - 60px);
    .content-title {
      width: 100%;
      height: 50px;
      display: flex;
      padding-right: 20px;
      box-sizing: border-box;
    }
    .collapse-content {
      width: 100%;
      height: 100%;
      overflow: auto;
      :deep(.el-collapse-item__content) {
        padding: 0;
      }
    }
  }
  .type,
  .county,
  .township {
    width: 100%;
    display: flex;
  }
  .title,
  .num {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
