<script setup>
import lodash from 'lodash'
import { ref, reactive, onBeforeMount } from 'vue'

const emergencyTransfer = window.WPD.get('emergencyTransfer')
const emergencyTransferList = reactive([])
const searchValue = ref('')
const allEmergencyTransfer = reactive([])
const activeTownship = ref('')
let copyEmergencyTransferList = null

const initEmergencyTransferData = () => {
  // console.log(emergencyTransfer)
  const WPCautionarea = {
    title: '危险区',
    num: emergencyTransfer.WPCautionarea.length,
    children: []
  }
  const WPCautionareaCountyObj = {}
  const WPCautionareaTownshipObj = {}
  for (let i = 0; i < emergencyTransfer.WPCautionarea.length; i++) {
    allEmergencyTransfer.push({
      type: 'WPCautionarea',
      typeName: '危险区',
      ...emergencyTransfer.WPCautionarea[i]
    })

    if (WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName] == null) {
      WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName] =
        WPCautionarea.children.length
      WPCautionarea.children.push({
        title:
          emergencyTransfer.WPCautionarea[i].countyName === ''
            ? '未知'
            : emergencyTransfer.WPCautionarea[i].countyName,
        children: []
      })
    }

    if (WPCautionareaTownshipObj[emergencyTransfer.WPCautionarea[i].areaName] == null) {
      WPCautionareaTownshipObj[emergencyTransfer.WPCautionarea[i].areaName] =
        WPCautionarea.children[
          WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName]
        ].children.length
      WPCautionarea.children[
        WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName]
      ].children.push({
        title:
          emergencyTransfer.WPCautionarea[i].areaName === ''
            ? '未知'
            : emergencyTransfer.WPCautionarea[i].areaName,
        children: []
      })
    }

    WPCautionarea.children[
      WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName]
    ].children[WPCautionareaTownshipObj[emergencyTransfer.WPCautionarea[i].areaName]].children.push(
      {
        type: 'WPCautionarea',
        typeName: '危险区',
        ...emergencyTransfer.WPCautionarea[i]
      }
    )

    WPCautionarea.children[
      WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName]
    ].num =
      WPCautionarea.children[
        WPCautionareaCountyObj[emergencyTransfer.WPCautionarea[i].countyName]
      ].children[
        WPCautionareaTownshipObj[emergencyTransfer.WPCautionarea[i].areaName]
      ].children.length
  }
  for (let i = 0; i < WPCautionarea.children.length; i++) {
    let num = 0
    for (let j = 0; j < WPCautionarea.children[i].children.length; j++) {
      WPCautionarea.children[i].children[j].num =
        WPCautionarea.children[i].children[j].children.length
      num += WPCautionarea.children[i].children[j].children.length
    }
    WPCautionarea.children[i].num = num
  }
  emergencyTransferList.push(WPCautionarea)

  const WPTransferRoute = {
    title: '转移路线',
    num: emergencyTransfer.WPTransferRoute.length,
    children: []
  }
  const WPTransferRouteCountyObj = {}
  const WPTransferRouteTownshipObj = {}
  for (let i = 0; i < emergencyTransfer.WPTransferRoute.length; i++) {
    allEmergencyTransfer.push({
      type: 'WPTransferRoute',
      typeName: '转移路线',
      ...emergencyTransfer.WPTransferRoute[i]
    })

    if (WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName] == null) {
      WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName] =
        WPTransferRoute.children.length
      WPTransferRoute.children.push({
        title:
          emergencyTransfer.WPTransferRoute[i].countyName === ''
            ? '未知'
            : emergencyTransfer.WPTransferRoute[i].countyName,
        children: []
      })
    }

    if (WPTransferRouteTownshipObj[emergencyTransfer.WPTransferRoute[i].areaName] == null) {
      WPTransferRouteTownshipObj[emergencyTransfer.WPTransferRoute[i].areaName] =
        WPTransferRoute.children[
          WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName]
        ].children.length
      WPTransferRoute.children[
        WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName]
      ].children.push({
        title:
          emergencyTransfer.WPTransferRoute[i].areaName === ''
            ? '未知'
            : emergencyTransfer.WPTransferRoute[i].areaName,
        children: []
      })
    }

    WPTransferRoute.children[
      WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName]
    ].children[
      WPTransferRouteTownshipObj[emergencyTransfer.WPTransferRoute[i].areaName]
    ].children.push({
      type: 'WPTransferRoute',
      typeName: '转移路线',
      ...emergencyTransfer.WPTransferRoute[i]
    })

    WPTransferRoute.children[
      WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName]
    ].num =
      WPTransferRoute.children[
        WPTransferRouteCountyObj[emergencyTransfer.WPTransferRoute[i].countyName]
      ].children[
        WPTransferRouteTownshipObj[emergencyTransfer.WPTransferRoute[i].areaName]
      ].children.length
  }
  for (let i = 0; i < WPTransferRoute.children.length; i++) {
    let num = 0
    for (let j = 0; j < WPTransferRoute.children[i].children.length; j++) {
      WPTransferRoute.children[i].children[j].num =
        WPTransferRoute.children[i].children[j].children.length
      num += WPTransferRoute.children[i].children[j].children.length
    }
    WPTransferRoute.children[i].num = num
  }
  emergencyTransferList.push(WPTransferRoute)

  const WPResettlementSite = {
    title: '安置点',
    num: emergencyTransfer.WPResettlementSite.length,
    children: []
  }
  const WPResettlementSiteCountyObj = {}
  const WPResettlementSiteTownshipObj = {}
  for (let i = 0; i < emergencyTransfer.WPResettlementSite.length; i++) {
    allEmergencyTransfer.push({
      type: 'WPResettlementSite',
      typeName: '安置点',
      ...emergencyTransfer.WPResettlementSite[i]
    })

    if (WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName] == null) {
      WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName] =
        WPResettlementSite.children.length
      WPResettlementSite.children.push({
        title:
          emergencyTransfer.WPResettlementSite[i].countyName === ''
            ? '未知'
            : emergencyTransfer.WPResettlementSite[i].countyName,
        children: []
      })
    }

    if (WPResettlementSiteTownshipObj[emergencyTransfer.WPResettlementSite[i].areaName] == null) {
      WPResettlementSiteTownshipObj[emergencyTransfer.WPResettlementSite[i].areaName] =
        WPResettlementSite.children[
          WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName]
        ].children.length
      WPResettlementSite.children[
        WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName]
      ].children.push({
        title:
          emergencyTransfer.WPResettlementSite[i].areaName === ''
            ? '未知'
            : emergencyTransfer.WPResettlementSite[i].areaName,
        children: []
      })
    }

    WPResettlementSite.children[
      WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName]
    ].children[
      WPResettlementSiteTownshipObj[emergencyTransfer.WPResettlementSite[i].areaName]
    ].children.push({
      type: 'WPResettlementSite',
      typeName: '安置点',
      ...emergencyTransfer.WPResettlementSite[i]
    })

    WPResettlementSite.children[
      WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName]
    ].num =
      WPResettlementSite.children[
        WPResettlementSiteCountyObj[emergencyTransfer.WPResettlementSite[i].countyName]
      ].children[
        WPResettlementSiteTownshipObj[emergencyTransfer.WPResettlementSite[i].areaName]
      ].children.length
  }
  for (let i = 0; i < WPResettlementSite.children.length; i++) {
    let num = 0
    for (let j = 0; j < WPResettlementSite.children[i].children.length; j++) {
      WPResettlementSite.children[i].children[j].num =
        WPResettlementSite.children[i].children[j].children.length
      num += WPResettlementSite.children[i].children[j].children.length
    }
    WPResettlementSite.children[i].num = num
  }
  emergencyTransferList.push(WPResettlementSite)

  // console.log(emergencyTransferList)
  copyEmergencyTransferList = lodash.cloneDeep(emergencyTransferList)
}

onBeforeMount(() => {
  initEmergencyTransferData()
})

const querySearch = (queryString, cb) => {
  const results = queryString
    ? allEmergencyTransfer.filter((item) => item.value.indexOf(queryString) > -1)
    : allEmergencyTransfer
  cb(results)
}

const selectEmergencyTransfer = () => {
  emergencyTransferList.splice(0, emergencyTransferList.length)
  const filterEmergencyTransfer = allEmergencyTransfer.filter(
    (item) => item.value === searchValue.value
  )
  console.log(filterEmergencyTransfer)
  const WPCautionarea = {
    title: '危险区',
    num: 0,
    children: []
  }
  const WPTransferRoute = {
    title: '转移路线',
    num: 0,
    children: []
  }
  const WPResettlementSite = {
    title: '安置点',
    num: 0,
    children: []
  }
  for (let i = 0; i < filterEmergencyTransfer.length; i++) {
    if (filterEmergencyTransfer[i].type === 'WPCautionarea') {
      WPCautionarea.num++
      if (
        WPCautionarea.children.find(
          (item) => item.title === filterEmergencyTransfer[i].countyName
        ) == null
      ) {
        WPCautionarea.children.push({
          title: filterEmergencyTransfer[i].countyName,
          num: 1,
          children: [
            {
              title: filterEmergencyTransfer[i].areaName,
              num: 1,
              children: [filterEmergencyTransfer[i]]
            }
          ]
        })
      } else {
        WPCautionarea.children.find((item) => item.title === filterEmergencyTransfer[i].countyName)
          .num++
        if (
          WPCautionarea.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName) == null
        ) {
          WPCautionarea.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.push({
              title: filterEmergencyTransfer[i].areaName,
              num: 1,
              children: [filterEmergencyTransfer[i]]
            })
        } else {
          WPCautionarea.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName).num++
          WPCautionarea.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName)
            .children.push(filterEmergencyTransfer[i])
        }
      }
    } else if (filterEmergencyTransfer[i].type === 'WPTransferRoute') {
      WPTransferRoute.num++
      if (
        WPTransferRoute.children.find(
          (item) => item.title === filterEmergencyTransfer[i].countyName
        ) == null
      ) {
        WPTransferRoute.children.push({
          title: filterEmergencyTransfer[i].countyName,
          num: 1,
          children: [
            {
              title: filterEmergencyTransfer[i].areaName,
              num: 1,
              children: [filterEmergencyTransfer[i]]
            }
          ]
        })
      } else {
        WPTransferRoute.children.find(
          (item) => item.title === filterEmergencyTransfer[i].countyName
        ).num++
        if (
          WPTransferRoute.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName) == null
        ) {
          WPTransferRoute.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.push({
              title: filterEmergencyTransfer[i].areaName,
              num: 1,
              children: [filterEmergencyTransfer[i]]
            })
        } else {
          WPTransferRoute.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName).num++
          WPTransferRoute.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName)
            .children.push(filterEmergencyTransfer[i])
        }
      }
    } else if (filterEmergencyTransfer[i].type === 'WPResettlementSite') {
      WPResettlementSite.num++
      if (
        WPResettlementSite.children.find(
          (item) => item.title === filterEmergencyTransfer[i].countyName
        ) == null
      ) {
        WPResettlementSite.children.push({
          title: filterEmergencyTransfer[i].countyName,
          num: 1,
          children: [
            {
              title: filterEmergencyTransfer[i].areaName,
              num: 1,
              children: [filterEmergencyTransfer[i]]
            }
          ]
        })
      } else {
        WPResettlementSite.children.find(
          (item) => item.title === filterEmergencyTransfer[i].countyName
        ).num++
        if (
          WPResettlementSite.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName) == null
        ) {
          WPResettlementSite.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.push({
              title: filterEmergencyTransfer[i].areaName,
              num: 1,
              children: [filterEmergencyTransfer[i]]
            })
        } else {
          WPResettlementSite.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName).num++
          WPResettlementSite.children
            .find((item) => item.title === filterEmergencyTransfer[i].countyName)
            .children.find((item) => item.title === filterEmergencyTransfer[i].areaName)
            .children.push(filterEmergencyTransfer[i])
        }
      }
    }
  }

  emergencyTransferList.push(WPCautionarea)
  emergencyTransferList.push(WPTransferRoute)
  emergencyTransferList.push(WPResettlementSite)
  activeTownship.value = ''
}

const clearSelectedEmergencyTransfer = () => {
  emergencyTransferList.splice(0, emergencyTransferList.length)
  emergencyTransferList.push(...copyEmergencyTransferList)
}
</script>

<template>
  <div class="emergency-transfer-list">
    <el-autocomplete
      placeholder="请输入内容"
      clearable
      v-model="searchValue"
      :fetch-suggestions="querySearch"
      @select="selectEmergencyTransfer"
      @clear="clearSelectedEmergencyTransfer"
    />
    <div class="content">
      <div class="content-title">
        <div class="title">名称</div>
        <div class="num">数量</div>
      </div>
      <el-collapse class="collapse-content">
        <el-collapse-item v-for="type in emergencyTransferList" :key="type.title">
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
                    <el-table-column prop="value" label="名称" align="center" />
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
.emergency-transfer-list {
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
