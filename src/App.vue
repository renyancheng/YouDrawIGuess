<template>
  <n-layout>
    <n-layout>
      <n-layout-header bordered>
        <n-page-header title="你画我猜" subtitle="乞丐版"> </n-page-header>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;">
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-layout-content>
    </n-layout>
    <n-back-top :right="40" :bottom="40" />
  </n-layout>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped>
.n-layout-header {
  padding: 24px;
}
</style>
