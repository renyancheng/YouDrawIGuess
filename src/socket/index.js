import io from "socket.io-client"
import store from '../store/index'

const socket = io()

socket.on("connect", () => {
    console.log('成功与服务器建立连接！')
})

socket.on('room_info', ({ nicknames, holder, lines }) => {
    console.log(nicknames, holder, lines)
    store.commit('updateNicknames', nicknames)
    store.commit('updateHolder', holder)
    store.commit('updateLines', lines)
})

socket.on('user_enter', (nickname) => {
    store.commit('addToNicknames', nickname)
})

export default socket