<script setup>
import lodash from 'lodash'
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()
const selectedDept = computed(() => systemStore.selectedDept)

const renderStatus = ref(false)
const stationType = [
  { title: '水库站', type: 'WPStationRR', field: 'stationRRList' },
  { title: '水文站', type: 'WPStationZQ', field: 'stationZQList' },
  { title: '水位站', type: 'WPStationZZ', field: 'stationZZList' },
  { title: '雨量站', type: 'WPStationPP', field: 'stationPPList' },
  { title: '水电站', type: 'WPStationHP', field: 'stationHPList' },
  { title: '水闸', type: 'WPSluice', field: 'sluiceList' },
  { title: '堤防', type: 'WPembankment', field: 'bankmentList' },
  { title: '泵站', type: 'WPStationPump', field: 'stationPumpList' }
]
const stationField = reactive({
  WPStationRR: window.WPD.get('WPStationRR').get('field'),
  WPStationZQ: window.WPD.get('WPStationZQ').get('field'),
  WPStationZZ: window.WPD.get('WPStationZZ').get('field'),
  WPStationPP: window.WPD.get('WPStationPP').get('field'),
  WPStationHP: window.WPD.get('WPStationHP').get('field'),
  WPSluice: window.WPD.get('WPSluice').get('field'),
  WPembankment: window.WPD.get('WPembankment').get('field'),
  WPStationPump: window.WPD.get('WPStationPump').get('field')
})
const allStationList = reactive([])

const region = window.WPD.get('WPAdministrativeArea').get(selectedDept.value.code)
// console.log(region)

const dividedByRegion = reactive([])
const dividedByConstruction = reactive([])
const queryType = ref('分区域查询')
const activeStation = ref('')

const initRegionStation = (currentStation) => {
  dividedByRegion.splice(0, dividedByRegion.length)
  allStationList.splice(0, allStationList.length)
  const regionStationType = lodash.cloneDeep(stationType)
  for (let i = 0; i < regionStationType.length; i++) {
    const stationList = lodash.cloneDeep(region[regionStationType[i].field])
    regionStationType[i].children = []
    regionStationType[i].num = currentStation ? 1 : stationList.length

    const countyObj = {}
    const townshipObj = {}
    for (let j = 0; j < stationList.length; j++) {
      // stationList[j].name = `${stationList[j].name?.trim()}（${regionStationType[i].title}）`
      allStationList.push({
        ...stationList[j],
        value: stationList[j].name
      })

      if (countyObj[stationList[j].administrativeAreaXian] == null) {
        if (currentStation) {
          if (
            currentStation.administrativeAreaXian === '' ||
            currentStation.administrativeAreaXian === stationList[j].administrativeAreaXian
          ) {
            countyObj[stationList[j].administrativeAreaXian] = regionStationType[i].children.length
            regionStationType[i].children.push({
              title:
                stationList[j].administrativeAreaXian === ''
                  ? '未知'
                  : stationList[j].administrativeAreaXian,
              children: []
            })
          }
        } else {
          countyObj[stationList[j].administrativeAreaXian] = regionStationType[i].children.length
          regionStationType[i].children.push({
            title:
              stationList[j].administrativeAreaXian === ''
                ? '未知'
                : stationList[j].administrativeAreaXian,
            children: []
          })
        }
      }

      if (townshipObj[stationList[j].administrativeAreaZhen] == null) {
        if (currentStation) {
          if (
            currentStation.administrativeAreaZhen === '' ||
            currentStation.administrativeAreaZhen === stationList[j].administrativeAreaZhen
          ) {
            townshipObj[stationList[j].administrativeAreaZhen] =
              regionStationType[i].children[
                countyObj[stationList[j].administrativeAreaXian]
              ].children.length
            regionStationType[i].children[
              countyObj[stationList[j].administrativeAreaXian]
            ].children.push({
              title:
                stationList[j].administrativeAreaZhen === ''
                  ? '未知'
                  : stationList[j].administrativeAreaZhen,
              children: []
            })
          }
        } else {
          townshipObj[stationList[j].administrativeAreaZhen] =
            regionStationType[i].children[
              countyObj[stationList[j].administrativeAreaXian]
            ].children.length
          regionStationType[i].children[
            countyObj[stationList[j].administrativeAreaXian]
          ].children.push({
            title:
              stationList[j].administrativeAreaZhen === ''
                ? '未知'
                : stationList[j].administrativeAreaZhen,
            children: []
          })
        }
      }

      if (currentStation) {
        if (currentStation.name === stationList[j].name) {
          regionStationType[i].children[countyObj[stationList[j].administrativeAreaXian]].children[
            townshipObj[stationList[j].administrativeAreaZhen]
          ].children.push(stationList[j])

          regionStationType[i].children[countyObj[stationList[j].administrativeAreaXian]].num =
            regionStationType[i].children[
              countyObj[stationList[j].administrativeAreaXian]
            ].children[townshipObj[stationList[j].administrativeAreaZhen]].children.length
        }
      } else {
        regionStationType[i].children[countyObj[stationList[j].administrativeAreaXian]].children[
          townshipObj[stationList[j].administrativeAreaZhen]
        ].children.push(stationList[j])

        regionStationType[i].children[countyObj[stationList[j].administrativeAreaXian]].num =
          regionStationType[i].children[countyObj[stationList[j].administrativeAreaXian]].children[
            townshipObj[stationList[j].administrativeAreaZhen]
          ].children.length
      }
    }

    for (let j = 0; j < regionStationType[i].children.length; j++) {
      let num = 0
      for (let k = 0; k < regionStationType[i].children[j].children.length; k++) {
        regionStationType[i].children[j].children[k].num =
          regionStationType[i].children[j].children[k].children.length
        num += regionStationType[i].children[j].children[k].children.length
      }
      regionStationType[i].children[j].num = num
    }

    if (currentStation) {
      if (currentStation.idx_tempName === regionStationType[i].type) {
        dividedByRegion.push(regionStationType[i])
      }
    } else {
      dividedByRegion.push(regionStationType[i])
    }
  }
  // console.log(dividedByRegion)
}

const initConstructionStation = (currentStation) => {
  dividedByConstruction.splice(0, dividedByConstruction.length)
  const constructionStationType = lodash.cloneDeep(stationType)
  for (let i = 0; i < constructionStationType.length; i++) {
    const stationList = lodash.cloneDeep(region[constructionStationType[i].field])
    constructionStationType[i].children = []
    constructionStationType[i].num = currentStation ? 1 : stationList.length

    const constructionObj = {}
    for (let j = 0; j < stationList.length; j++) {
      // stationList[j].name = `${stationList[j].name?.trim()}（${constructionStationType[i].title}）`
      stationList[j].source = stationList[j].source === '' ? '未知' : stationList[j].source

      if (constructionObj[stationList[j].source] == null) {
        if (currentStation) {
          if (currentStation.source === stationList[j].source) {
            constructionObj[stationList[j].source] = constructionStationType[i].children.length
            constructionStationType[i].children.push({
              title: stationList[j].source,
              children: []
            })
          }
        } else {
          constructionObj[stationList[j].source] = constructionStationType[i].children.length
          constructionStationType[i].children.push({
            title: stationList[j].source,
            children: []
          })
        }
      }

      if (currentStation) {
        if (currentStation.name === stationList[j].name) {
          constructionStationType[i].children[constructionObj[stationList[j].source]].children.push(
            stationList[j]
          )

          constructionStationType[i].children[constructionObj[stationList[j].source]].num =
            constructionStationType[i].children[
              constructionObj[stationList[j].source]
            ].children.length
        }
      } else {
        constructionStationType[i].children[constructionObj[stationList[j].source]].children.push(
          stationList[j]
        )

        constructionStationType[i].children[constructionObj[stationList[j].source]].num =
          constructionStationType[i].children[
            constructionObj[stationList[j].source]
          ].children.length
      }
    }

    if (currentStation) {
      if (currentStation.idx_tempName === constructionStationType[i].type) {
        dividedByConstruction.push(constructionStationType[i])
      }
    } else {
      dividedByConstruction.push(constructionStationType[i])
    }
  }
  // console.log(dividedByConstruction)
}

onMounted(() => {
  initRegionStation()

  initConstructionStation()

  renderStatus.value = true
})

const searchValue = ref('')

const querySearch = (queryString, cb) => {
  const results = queryString
    ? allStationList.filter(
        (station) => station.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
      )
    : allStationList
  cb(results)
}

const searchStation = () => {
  const currentStation = allStationList.find((station) => station.value === searchValue.value)
  // console.log(currentStation, currentStation.idx_tempName)
  if (queryType.value === '分区域查询') {
    initRegionStation(currentStation)
  } else {
    initConstructionStation(currentStation)
  }
  activeStation.value = ''
}

const clearStation = () => {
  if (queryType.value === '分区域查询') {
    initRegionStation()
  } else {
    initConstructionStation()
  }
}

watch(
  () => {
    return queryType.value
  },
  (val) => {
    if (val === '分区域查询') {
      initRegionStation()
    } else {
      initConstructionStation()
    }
    searchValue.value = ''
    activeStation.value = ''
  }
)
</script>

<template>
  <div class="water-conservancy-info" v-if="renderStatus">
    <el-radio-group v-model="queryType">
      <el-radio-button label="分区域查询" />
      <el-radio-button label="分建设单位查询" />
    </el-radio-group>
    <el-autocomplete
      style="width: 100%; margin-bottom: 20px"
      placeholder="请输入内容"
      v-model="searchValue"
      :fetch-suggestions="querySearch"
      @select="searchStation"
      @clear="clearStation"
      clearable
    >
    </el-autocomplete>
    <div class="content">
      <div class="content-title">
        <div class="title">名称</div>
        <div class="num">数量</div>
      </div>
      <el-collapse class="collapse-content" v-show="queryType === '分区域查询'">
        <el-collapse-item v-for="stationType in dividedByRegion" :key="stationType.title">
          <template #title>
            <div class="station-type">
              <div class="title">{{ stationType.title }}</div>
              <div class="num">{{ stationType.num }}</div>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item v-for="county in stationType.children" :key="county.title">
              <template #title>
                <div class="county">
                  <div class="title">{{ county.title }}</div>
                  <div class="num">{{ county.num }}</div>
                </div>
              </template>

              <el-collapse>
                <el-collapse-item v-for="township in county.children" :key="township.title">
                  <template #title>
                    <div class="township">
                      <div class="title">{{ township.title }}</div>
                      <div class="num">{{ township.num }}</div>
                    </div>
                  </template>

                  <el-collapse accordion v-model="activeStation">
                    <el-collapse-item
                      v-for="station in township.children"
                      :key="station.name"
                      :name="station.name"
                    >
                      <template #title>
                        <div class="station">
                          <div class="title">{{ station.name }}</div>
                        </div>
                      </template>
                      <el-descriptions border :column="1" v-if="activeStation === station.name">
                        <template
                          v-for="item in stationField[station.idx_tempName]"
                          :key="item.field + item.title"
                        >
                          <el-descriptions-item
                            align="center"
                            v-if="item.field !== 'idx_topoId'"
                            :label="item.title"
                          >
                            {{ station[item.field] }}
                          </el-descriptions-item>
                        </template>
                      </el-descriptions>
                    </el-collapse-item>
                  </el-collapse>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
      <el-collapse class="collapse-content" v-show="queryType === '分建设单位查询'">
        <el-collapse-item v-for="stationType in dividedByConstruction" :key="stationType.title">
          <template #title>
            <div class="station-type">
              <div class="title">{{ stationType.title }}</div>
              <div class="num">{{ stationType.num }}</div>
            </div>
          </template>

          <el-collapse>
            <el-collapse-item v-for="sourceType in stationType.children" :key="sourceType.title">
              <template #title>
                <div class="source-type">
                  <div class="title">{{ sourceType.title }}</div>
                  <div class="num">{{ sourceType.num }}</div>
                </div>
              </template>

              <el-collapse accordion v-model="activeStation">
                <el-collapse-item
                  v-for="station in sourceType.children"
                  :key="station.name"
                  :name="station.name"
                >
                  <template #title>
                    <div class="station">
                      <div class="title">{{ station.name }}</div>
                    </div>
                  </template>
                  <el-descriptions border :column="1" v-if="activeStation === station.name">
                    <template
                      v-for="item in stationField[station.idx_tempName]"
                      :key="item.field + item.title"
                    >
                      <el-descriptions-item
                        align="center"
                        v-if="item.field !== 'idx_topoId'"
                        :label="item.title"
                      >
                        {{ station[item.field] }}
                      </el-descriptions-item>
                    </template>
                  </el-descriptions>
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
.water-conservancy-info {
  width: 100%;
  height: 100%;
  :deep(.el-radio-group) {
    width: 100%;
    .el-radio-button {
      width: 50%;
      input,
      span {
        width: 100%;
      }
    }
  }
  :deep(.el-autocomplete) {
    margin-top: 10px;
    width: 100%;
  }
  .content {
    width: 100%;
    height: calc(100% - 100px);
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
    .station-type,
    .county,
    .township,
    .source-type {
      width: 100%;
      display: flex;
    }
    .station {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .title,
  .num {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  :deep(.el-descriptions__table) {
    width: 100%;
    display: flex;
    tbody {
      display: flex;
      flex-direction: column;
      width: 100%;
      tr {
        width: 100%;
        display: flex;
        .el-descriptions__label {
          width: 30%;
        }
        .el-descriptions__content {
          width: 70%;
        }
      }
    }
  }
}
</style>
