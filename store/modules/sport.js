import { getSportListAPI, getSportTypesAPI } from '@/api/sport.js'

export default {
  namespaced: true,
  
  state: {
    sportList: [],
    todayStats: {
      calories: 0,
      duration: 0
    },
    sportTypes: []
  },
  
  mutations: {
    SET_SPORT_LIST(state, list) {
      state.sportList = list
    },
    SET_TODAY_STATS(state, stats) {
      state.todayStats = stats
    },
    SET_SPORT_TYPES(state, types) {
      state.sportTypes = types
    }
  },
  
  actions: {
    // 加载运动记录列表
    async loadSportList({ commit, dispatch }) {
        const res = await getSportListAPI()
        console.log('API返回的运动记录:', res.data)
        commit('SET_SPORT_LIST', res.data)
        dispatch('calculateTodayStats')
        return res.data
    },
    
    // 计算今日运动统计
    calculateTodayStats({ state, commit }) {
        const today = new Date().toISOString().split('T')[0]
        const todayRecords = state.sportList.filter(item => 
        item.createTime.startsWith(today)
      )
      
    const stats = {
        calories: todayRecords.reduce((sum, item) => sum + item.calories, 0),
        duration: todayRecords.reduce((sum, item) => sum + item.duration, 0)
      }
      
      commit('SET_TODAY_STATS', stats)
    },

    // 获取运动类型列表
    async getSportTypes({ commit }) {
        const res = await getSportTypesAPI()
        commit('SET_SPORT_TYPES', res.data)
        return res.data
    }
  }
}
