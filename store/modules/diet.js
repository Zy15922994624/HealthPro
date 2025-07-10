import { getDietListAPI, getDietTypesAPI, getDietStatsAPI } from '@/api/diet.js'

export default {
  namespaced: true,
  
  state: {
    dietList: [], // 饮食记录列表
    todayStats: {
      calories: 0,  // 热量
      protein: 0, // 蛋白质
      fat: 0, // 脂肪
      carbohydrate: 0 // 碳水化合物
    },
    foodList: [] // 食物基础数据
  },
  
  mutations: {
    setTodayStats(state, stats) {
      state.todayStats = stats
    },
    setFoodList(state, list) {
      state.foodList = list
    },
    setDietList(state, list) {
      state.dietList = list
    }
  },
  
  actions: {
    // 获取今日统计
    async loadDietStats({ commit }) {
      try {
        const res = await getDietStatsAPI()
        if (res.code === 0) {
          commit('setTodayStats', res.data)
          return res.data  // 返回数据供组件使用
        }
      } catch (error) {
        console.error('获取饮食统计失败:', error)
      }
    },
    
    // 获取食物列表
    async getFoodList({ commit }) {
      try {
        const res = await getDietTypesAPI()
        if (res.code === 0) {
          commit('setFoodList', res.data)
        }
      } catch (error) {
        console.error('获取食物列表失败:', error)
      }
    },

    // 获取饮食记录
    async loadDietList({ commit }) {
      try {
        const res = await getDietListAPI()
        if (res.code === 0) {
          commit('setDietList', res.data)
        }
      } catch (error) {
        console.error('获取饮食记录失败:', error)
      }
    }
  }
} 