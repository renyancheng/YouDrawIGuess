<template>
  <n-layout>
    <n-layout>
      <n-layout-header>颐和园路</n-layout-header>
      <n-layout-content content-style="padding: 24px;">
      </n-layout-content>
    </n-layout>
    <n-back-top :right="40" :bottom="40" />
  </n-layout>
</template>

<script setup>
import { ref, h } from "vue";
const state = ref("a");
</script>

<style scoped>
.n-layout-header {
  padding: 24px;
}
</style>
