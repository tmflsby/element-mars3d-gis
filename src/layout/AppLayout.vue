<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/layout/AppHeader.vue'
import AppMain from '@/layout/AppMain.vue'
</script>

<template>
  <div class="app-layout">
    <el-container>
      <el-header>
        <AppHeader />
      </el-header>
      <el-main>
        <AppMain />
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.app-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-container {
    width: 100%;
    height: 100%;
    .el-header {
      padding: 0;
    }
    .el-main {
      padding: 0;
    }
  }
}
</style>
