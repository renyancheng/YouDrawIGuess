<template>
  <div>
    <n-grid :x-gap="10" :y-gap="5" :cols="12">
      <n-gi :span="4">
        <n-card title="房间用户列表(共3人)" size="medium" hoverable>
          <n-space>
            <n-alert title="服务已连接" type="success"> </n-alert>
            <!-- <n-alert title="游戏进行中" type="success"> </n-alert> -->
            <n-alert title="游戏未开始" type="warning"> </n-alert>
          </n-space>

          <n-list bordered>
            <n-list-item> 沐风 </n-list-item>
            <n-list-item> 沐风 </n-list-item>
            <n-list-item> 沐风 </n-list-item>
          </n-list>
          <n-space>
            <n-button type="info" size="medium" ghost>
              <template #icon>
                <n-icon>
                  <edit-filled />
                </n-icon>
              </template>
              主持游戏
            </n-button>
            <n-button type="error" size="medium" ghost>
              <template #icon>
                <n-icon>
                  <exit-to-app-filled />
                </n-icon>
              </template>
              退出游戏
            </n-button>
          </n-space>
        </n-card>
      </n-gi>
      <n-gi :span="8">
        <n-card title="画图" size="medium" hoverable> </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script>
import { reactive, defineComponent } from "vue";
import { useStore } from "vuex";
import { EditFilled, ExitToAppFilled } from "@vicons/material";

export default defineComponent({
  setup() {
    const store = useStore();
    store.dispatch("sendUserEnter");
  },
  components: {
    EditFilled,
    ExitToAppFilled,
  },
});
</script>
