import { reminderUtils } from '@/utils/reminder'

export default {
    namespaced: true,
    state: {
        token: uni.getStorageSync('token') || '',
        userInfo: uni.getStorageSync('userInfo') || null
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            uni.setStorageSync('token', token)
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
            uni.setStorageSync('userInfo', userInfo)
        },
        clearUser(state) {
            state.token = ''
            state.userInfo = null
            uni.removeStorageSync('token')
            uni.removeStorageSync('userInfo')
        }
    },
    actions: {
        logout({ commit }) {
            commit('clearUser')
            uni.reLaunch({
                url: '/pages/login/login'
            })
        },
        async loginSuccess({ commit }, { token, userInfo }) {
            commit('setToken', token)
            commit('setUserInfo', userInfo)
            reminderUtils.startChecking()
        }
    },
    getters: {
        getToken: state => state.token,
        isLogin: state => !!state.token,
        userInfo: state => state.userInfo || {}
    }
} 