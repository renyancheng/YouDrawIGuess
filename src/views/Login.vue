<template>
  <div>
    <n-card title="登录" hoverable>
      <n-form
        :model="loginForm"
        ref="loginFormRef"
        :rules="loginRules"
        label-width="80"
        inline
      >
        <n-form-item label="昵称" path="user.nickname">
          <n-input
            placeholder="请输入昵称"
            v-model:value="loginForm.user.nickname"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button type="primary" @click="enterGame">进入游戏</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>
<script>
import { reactive, ref, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useMessage } from "naive-ui";
import socket from "../socket/index";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const message = useMessage();
    const loginFormRef = ref(null);

    let loginForm = reactive({
      user: {
        nickname: "",
      },
    });

    return {
      loginForm,
      loginFormRef,
      loginRules: {
        user: {
          nickname: {
            required: true,
            message: "昵称不能为空",
            trigger: "input",
          },
        },
      },
      enterGame() {
        let nickname = loginForm.user.nickname;

        loginFormRef.value.validate(async (errors) => {
          if (!errors) {
            const isExist = await store.dispatch("checkUserExist", nickname);
            if (isExist) {
              message.error("此昵称已被占用");
            } else {
              localStorage.setItem("nickname", nickname);
              router.push("/game");
            }
          } else {
            message.error("请输入昵称");
          }
        });
      },
    };
  },
});
</script>
