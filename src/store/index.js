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
    getters: {
        isGameStarted(state) {
            // 根据主持人是否存在, 判断游戏是否开始
            return !!state.holder
        },
        isGameHolder(state) {
            return state.nickname === state.holder
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
        },
        updateConnected(state, connected) {
            state.connected = connected
        },
        drawNewLine(state, newLine) {
            state.lines.push(newLine)
        },
        updateNewLine(state, lastLine) {
            const line = state.lines[state.lines.length - 1]
            line.points = lastLine.points
        },
        delFromNicknames(state, nickname) {
            state.nicknames = state.nicknames.filter(item => item !== nickname)
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
        },
        sendStartGame(context, imageAnswer) {
            socket.emit('start_game', imageAnswer)
        },
        sendStopGame(context) {
            socket.emit('stop_game')
        },
        sendDrawNewLine(context, line) {
            socket.emit('new_line', line)
        },
        sendUpdateNewLine(context, line) {
            socket.emit('update_line', line)
        },
        sendAnswerGame(context, inputImageName) {
            socket.emit('answer_game', inputImageName)
        },
        sendUserLeave(context) {
            socket.emit('leave')
            context.commit('updateNickname', '')
            localStorage.removeItem('nickname')
        }
    }
})

export default store