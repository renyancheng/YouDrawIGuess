/*
 * @Author: Mufeng
 * @Date: 2021-08-16 09:40:02
 * @FilePath: /你画我猜/src/store/index.js
 */
import { createStore } from 'vuex'
import socket from '../socket/index'

const store = createStore({
    state() {
        return {
            connected: false,
            nickname: '', // 当前用户昵称
            nicknames: [], // 房间用户昵称列表
            holder: '', // 游戏主持人
            lines: [] // 房间的绘图信息 (画了多少根线)
        }
    },
    mutations: {
        updateNickname(state, nickname) {
            state.nickname = nickname || ''
        },
        updateNicknames(state, nicknames) {
            state.nicknames = nicknames || []
        },
        updateHolder(state, holder) {
            state.holder = holder || ''
        },
        updateLines(state, lines) {
            state.lines = lines || []
        },
        addToNicknames(state, nickname) {
            if (!state.nicknames.includes(nickname)) {
                state.nicknames.push(nickname)
            }
        }
    },
    actions: {
        sendUserEnter(context) {
            const nickname = localStorage.getItem('nickname')
            socket.emit('enter', nickname)
            context.commit('updateNickname', nickname)
        },
        checkUserExist(context, nickname) {
            return new Promise((resolve, reject) => {
                socket.emit('check_user_exist', nickname, isExist => {
                    resolve(isExist)
                })
            })
        }
    }
})

export default store