import { getUserSettingsAPI, updateSettingsAPI } from '@/api/settings'

export default {
    namespaced: true,
    state: {
        settings: uni.getStorageSync('userSettings') || {
            // 健康目标
            targetWeight: '',
            targetBMI: '',
            targetSteps: '',
            targetDuration: '',
            // 提醒设置
            enableReminder: false,
            reminderTime: '08:00',
            // 系统设置
            enableNotification: true,
            enableSync: true,
            // 显示设置
            showBMI: true,
            showBloodPressure: true
        }
    },
    mutations: {
        // 更新设置
        setSettings(state, settings) {
            state.settings = settings
            // 同步到本地存储
            uni.setStorageSync('userSettings', settings)
        }
    },
    actions: {
        // 获取设置
        async getSettings({ commit }) {
            try {
                const res = await getUserSettingsAPI()
                if (res.code === 0) {
                    commit('setSettings', res.data)
                    return true
                }
                return false
            } catch (error) {
                console.error('获取设置失败:', error)
                return false
            }
        },
        // 保存设置
        async saveSettings({ commit }, settings) {
            try {
                console.log('准备保存的数据:', settings)
                const res = await updateSettingsAPI(settings)
                console.log('API返回结果:', res)
                
                if (res.code === 0) {
                    commit('setSettings', settings)
                    return true  // 确保返回 true
                }
                return false
            } catch (error) {
                console.error('保存设置失败:', error)
                return false
            }
        }
    },
    getters: {
        getSettings: state => state.settings
    }
} 