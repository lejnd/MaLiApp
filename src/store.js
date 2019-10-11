import Vue from 'vue'
import Vuex from 'vuex'
import common from './components/common.vue'

Vue.use(Vuex)

const vm = Vue.prototype;

const state = {
    tasks: [],
    taskTotal: 0,
    userInfo: {},
    noticeId: '',
}

const getters = {
    tasks: (state) => state.tasks,
    taskTotal: (state) => state.taskTotal,
    userInfo: (state) => state.userInfo,
    noticeId: (state) => state.noticeId,
}

const actions = {
    // 任务列表
    getTasks: ({ commit }, code) => {
        commit('getTasks', []);
        return vm.$fly.get('/api/Task/GetTaskList', common.connectObj({
            provinceCode: code
        })).then((res) => {
            let { returnCode, returnMsg, data } = res;
            commit('getTasks', data)
            return Promise.resolve(res);
        })
    },
    // 移除任务
    removeTask: ({ commit }, id) => {
        commit('removeTask', id)
    },
    // 用户中心数据
    getUserInfo: ({ commit }) => {
        return vm.$fly.get('/api/User/GetUserInfo', common.connectObj())
        .then((res) => {
            let { returnCode, returnMsg, data } = res;
            if (returnCode == 100) {
                commit('getUserInfo', data);                
            } else {
                vm.$toast(returnMsg);
            }
        })
    },
    // 保存公告id，用于注销时清除本地缓存
    setNoticeId: ({ commit }, id) => {
        commit('setNoticeId', id)
    },
}

const mutations = {
    getTasks(state, data) {
        state.tasks = data.taskLists;
        state.taskTotal = data.total;
    },
    removeTask(state, id) {
        state.tasks = state.tasks.filter((task) => task.task_id != id);
    },
    getUserInfo(state, data) {
        state.userInfo = data;
    },
    setNoticeId(state, id) {
        state.noticeId = id;
    },
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})
