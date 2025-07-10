import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import sport from './modules/sport'
import diet from './modules/diet'
import health from './modules/health'
import settings from './modules/settings'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        sport,
        diet,
        health,
        settings
    }
})