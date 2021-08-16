import io from "socket.io-client"
import store from '../store/index'

const socket = io()


socket.on("connect", () => {
    console.log('成功与服务器建立连接！')
    store.commit('updateConnected', true)
})

socket.on('disconnect', () => {
    console.log('与服务器断开连接！')
    store.commit('updateConnected', false)
})

socket.on('room_info', ({ nicknames, holder, lines }) => {
    store.commit('updateNicknames', nicknames)
    store.commit('updateHolder', holder)
    store.commit('updateLines', lines)
})

socket.on('user_enter', (nickname) => {
    store.commit('addToNicknames', nickname)
})

// 处理游戏开始
socket.on('game_started', holder => {
    store.commit('updateHolder', holder)
    alert(`${holder} 作为主持人开始了新游戏，大家可以开始踊跃猜答案啦！`)
})

// 处理游戏已经开始, 不能重复开始
socket.on('already_started', holder => {
    store.commit('updateHolder', holder)
    alert('当前已有游戏在进行中，主持人是：' + holder)
})

socket.on('game_stoped', () => {
    // 1. 清理相关数据
    store.commit('updateHolder', '')
    store.commit('updateLines', [])

    // 2. 弹出提示消息
    alert('主持人终止了当前游戏')
})

export default socket