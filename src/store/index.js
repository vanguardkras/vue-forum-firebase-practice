import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        categories: {},
        forums: {},
        threads: {},
        posts: {},
        users: {},
        authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
    },

    getters,
    actions,
    mutations

})