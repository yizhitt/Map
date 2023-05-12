import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { reqMap } from '@/api'

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    async getMap({ commit }) {
      let result = await reqMap()
      console.log(commit,result)
    }
  },
  modules: {
  }
})
