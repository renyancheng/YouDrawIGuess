<template>
  <div>
    <n-grid
      :x-gap="10"
      :y-gap="5"
      cols="2 s:3 m:4 l:5 xl:6 2xl:7"
      responsive="screen"
    >
      <n-gi :span="2">
        <n-card
          :title="`房间用户列表(共${nicknames.length}人)`"
          size="medium"
          hoverable
        >
          <n-space>
            <n-alert v-if="connected" title="服务已连接" type="success">
            </n-alert>
            <n-alert v-else title="服务已断开" type="error"> </n-alert>
            <n-alert v-if="isGameStarted" title="游戏进行中" type="success">
            </n-alert>
            <n-alert v-else title="游戏未开始" type="warning"> </n-alert>
          </n-space>

          <n-list v-if="nicknames" bordered>
            <n-list-item v-for="item in nicknames" :key="item">
              {{ item }}
              <span v-if="item == nickname">(我)</span>
              <span v-if="item == holder">(主持人)</span>
            </n-list-item>
          </n-list>

          <n-space>
            <n-button
              :disabled="isGameStarted"
              type="info"
              size="medium"
              @click="startGameHandler"
              ghost
            >
              <template #icon>
                <n-icon>
                  <edit-filled />
                </n-icon>
              </template>
              主持游戏
            </n-button>
            <n-button type="error" size="medium" @click="exitHandler" ghost>
              <template #icon>
                <n-icon>
                  <exit-to-app-filled />
                </n-icon>
              </template>
              退出游戏
            </n-button>
            <n-button
              v-if="isGameStarted && nickname === holder"
              type="error"
              size="medium"
              @click="stopGameHandler"
              ghost
            >
              <template #icon>
                <n-icon>
                  <cloud-off-filled />
                </n-icon>
              </template>
              结束游戏
            </n-button>

            <n-space v-else>
              <n-button
                :disabled="!isGameStarted"
                type="success"
                size="medium"
                @click="answerGameHandler"
                ghost
              >
                <template #icon>
                  <n-icon>
                    <question-answer-filled />
                  </n-icon>
                </template>
                猜答案
              </n-button>
            </n-space>
          </n-space>
        </n-card>
      </n-gi>
      <n-gi :span="2">
        <n-card ref="containerRef" title="画图" size="medium" hoverable>
          <div
            id="container"
            @mousedown="mousedownHandler"
            @mouseup="mouseupHandler"
            @mousemove="mousemoveHandler"
          ></div>
        </n-card>
      </n-gi>
    </n-grid>

    <n-modal v-model:show="showDialog" preset="dialog">
      <template #header>
        <div>申请成为主持人</div>
      </template>
      <div style="padding: 24px">
        <n-input
          v-model:value="expectImageName"
          type="text"
          label="你画我猜答案"
          placeholder="请输入答案"
          size="large"
          clearable
          required
        ></n-input>
      </div>
      <template #action>
        <n-space>
          <n-button
            type="success"
            size="medium"
            @click="showDialog = false"
            ghost
            >取消</n-button
          >
          <n-button type="success" size="medium" @click="saveDialogHandler"
            >确定</n-button
          >
        </n-space>
      </template>
    </n-modal>
    <n-modal v-model:show="showAnswerDialog" preset="dialog">
      <template #header>
        <div>猜答案</div>
      </template>
      <div style="padding: 24px">
        <n-input
          v-model:value="inputImageName"
          type="text"
          label="你画我猜答案"
          placeholder="请输入答案"
          size="large"
          clearable
          required
        ></n-input>
      </div>
      <template #action>
        <n-space>
          <n-button
            type="success"
            size="medium"
            @click="showAnswerDialog = false"
            ghost
            >取消</n-button
          >
          <n-button type="success" size="medium" @click="saveAnswerDialogHandler">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
<script>
import { ref, defineComponent } from "vue";
import { useStore, mapState, mapGetters } from "vuex";
import {
  EditFilled,
  ExitToAppFilled,
  CloudOffFilled,
  QuestionAnswerFilled,
} from "@vicons/material";
import { useMessage, useDialog } from "naive-ui";
import Konva from "konva";
import { useRouter } from "vue-router";

export default defineComponent({
  data() {
    return {
      stage: null,
      layer: null,
      stroke: "#df4b26",
      strokeWidth: 5,
    };
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const message = useMessage();
    const dialog = useDialog();

    store.dispatch("sendUserEnter");

    let showDialog = ref(false);

    let showAnswerDialog = ref(false);

    let expectImageName = ref(null);

    let inputImageName = ref(null);

    let painting = ref(false);

    return {
      showDialog,
      showAnswerDialog,
      expectImageName,
      inputImageName,
      painting,
      startGameHandler() {
        showDialog.value = true;
      },
      saveDialogHandler() {
        if (!expectImageName.value) {
          message.error("答案不能为空");
          return;
        }
        store.dispatch("sendStartGame", expectImageName.value);
        showDialog.value = false;
        expectImageName = "";
      },
      stopGameHandler() {
        dialog.warning({
          title: "警告",
          content: "确定结束游戏？（可能会导致他人离开游戏）",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            store.dispatch("sendStopGame");
            message.success("成功结束游戏！");
          },
        });
      },
      answerGameHandler() {
        showAnswerDialog.value = true;
      },
      saveAnswerDialogHandler() {
        // 1. 检查答案是否为空
        if (!inputImageName.value) {
          message.error("答案不能为空");
          return;
        }
        // 2. 将答案发送到服务器
        store.dispatch("sendAnswerGame", inputImageName.value);
        // 3. 关闭弹出框
        showAnswerDialog.value = false;
      },
      exitHandler() {
        dialog.warning({
          title: "警告",
          content: "确定退出游戏？",
          positiveText: "确定",
          negativeText: "取消",
          onPositiveClick: () => {
            store.dispatch("sendUserLeave");
            router.replace("/login");
            message.success("成功退出游戏！");
          },
        });
      },
      mousedownHandler(e) {
        if (this.isGameStarted && this.isGameHolder) {
          painting.value = true;
          const newLine = {
            stroke: this.stroke,
            strokeWidth: this.strokeWidth,
            points: [e.layerX, e.layerY],
          };
          // 本地画线, 存到vuex中
          store.commit("drawNewLine", newLine);
          store.dispatch("sendDrawNewLine", newLine);
        } else if (!this.isGameStarted) {
          message.error("现在还不能画图哦");
        } else if (!this.isGameHolder) {
          message.error("你不是主持人无法画图");
        } else {
          message.error("画图失败");
        }
      },

      // 鼠标拖动
      mousemoveHandler(e) {
        if (painting.value) {
          let lastLine = this.lines[this.lines.length - 1];
          lastLine.points = lastLine.points.concat([e.layerX, e.layerY]);
          store.commit("updateNewLine", lastLine);
          store.dispatch("sendUpdateNewLine", lastLine);
        }
      },

      // 鼠标释放
      mouseupHandler() {
        painting.value = false;
      },
    };
  },
  mounted() {
    this.stage = new Konva.Stage({
      container: "container",
      width: this.$refs.containerRef.$el.offsetWidth,
      height: 400,
    });

    this.layer = new Konva.Layer();

    this.stage.add(this.layer);
  },
  watch: {
    lines: {
      handler(val, oldVal) {
        for (let key in val) {
          let line = new Konva.Line(val[key]);
          this.layer.add(line);
        }
      },
      deep: true,
    },
  },
  components: {
    EditFilled,
    ExitToAppFilled,
    CloudOffFilled,
    QuestionAnswerFilled,
  },
  computed: {
    ...mapGetters(["isGameStarted", "isGameHolder"]),
    ...mapState(["connected", "nickname", "nicknames", "holder", "lines"]),
  },
});
</script>
