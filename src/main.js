import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import socket from './socket/index'
import naive from 'naive-ui'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'

const app = createApp(App)

app.use(naive)
app.use(router)
app.use(store)

app.mount('#app')

window.$message = import('naive-ui').MessageApi;
window.$dialog = import('naive-ui').DialogApi;
window.$notification = import('naive-ui').NotificationApi;
window.$loadingBar = import('naive-ui').LoadingBarApi;
