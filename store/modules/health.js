import { 
    getLatestHealthAPI, 
    getHealthListAPI, 
    addHealthRecordAPI,
    getHealthEvaluationAPI,
    getHealthTrendAPI
} from '@/api/health'

const state = {
    latestHealth: {},
    healthList: [],
    evaluation: {},
    trendData: []
}

const mutations = {
    SET_LATEST_HEALTH(state, data) {
        state.latestHealth = data
    },
    SET_HEALTH_LIST(state, list) {
        state.healthList = list
    },
    SET_EVALUATION(state, data) {
        state.evaluation = data
    },
    SET_TREND_DATA(state, data) {
        state.trendData = data
    }
}

const actions = {
    // 获取最新健康记录
    async getLatestHealth({ commit }) {
        try {
            const res = await getLatestHealthAPI()
            if (res.code === 0) {
                commit('SET_LATEST_HEALTH', res.data)
            }
            return res
        } catch (error) {
            console.error('获取最新健康记录失败:', error)
            throw error
        }
    },

    // 获取健康记录列表
    async getHealthList({ commit }) {
        try {
            const res = await getHealthListAPI()
            if (res.code === 0) {
                commit('SET_HEALTH_LIST', res.data)
            }
            return res
        } catch (error) {
            console.error('获取健康记录列表失败:', error)
            throw error
        }
    },

    // 添加健康记录
    async addHealthRecord({ dispatch }, data) {
        try {
            const res = await addHealthRecordAPI(data)
            if (res.code === 0) {
                // 更新最新记录和列表
                await dispatch('getLatestHealth')
                await dispatch('getHealthList')
            }
            return res
        } catch (error) {
            console.error('添加健康记录失败:', error)
            throw error
        }
    },

    // 获取健康评估
    async getHealthEvaluation({ commit }) {
        try {
            const res = await getHealthEvaluationAPI()
            if (res.code === 0) {
                commit('SET_EVALUATION', res.data)
            }
            return res
        } catch (error) {
            console.error('获取健康评估失败:', error)
            throw error
        }
    },

    // 获取健康趋势数据
    async getHealthTrend({ commit }, params) {
        try {
            const res = await getHealthTrendAPI(params)
            if (res.code === 0) {
                commit('SET_TREND_DATA', res.data)
            }
            return res
        } catch (error) {
            console.error('获取健康趋势数据失败:', error)
            throw error
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
} 