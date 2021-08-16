<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-loading-bar-provider>
        <n-layout>
          <n-layout>
            <n-layout-header bordered>
              <n-page-header title="你画我猜" subtitle="乞丐版">
              </n-page-header>
            </n-layout-header>
            <n-layout-content content-style="padding: 24px;">
              <router-view />
            </n-layout-content>
          </n-layout>
          <n-back-top :right="40" :bottom="40" />
        </n-layout>
      </n-loading-bar-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
   
  },
});
</script>

<style scoped>
.n-layout-header {
  padding: 24px;
}
</style>
