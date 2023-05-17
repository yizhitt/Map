import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { reqMap } from '@/api'

export default new Vuex.Store({
  state: {
    MapList: []
  },
  mutations: {
    GETMAP(state, MapList) {
      state.MapList = MapList
    }
  },
  actions: {
    async getMap({ commit },param) {
      let result = await reqMap(param)
      if (result.code == 200) {
        commit('GETMAP', result.data.data)
      }
    }
  },
  modules: {
  }
})

