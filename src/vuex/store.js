import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user_id:'',
        username:'游客',
        password:'',
    },
    getters: {
        user_id: state => state.user_id,
        username: state =>state.username,
        password: state =>state.password
    },
    mutations: {
        login (state, msg){
            state.username = msg.username
            state.password = msg.password
        }
    }
})
export default store