import Vue from 'vue'
import Vuex from 'vuex'
import common from './components/common.vue'

Vue.use(Vuex)

const vm = Vue.prototype;

const state = {
    tasks: [],
    taskTotal: 0,
    localnum: 0,
    userInfo: {},
    noticeId: '',
    provcodeTemp: '',
}

const getters = {
    tasks: (state) => state.tasks,
    taskTotal: (state) => state.taskTotal,
    localnum: (state) => state.localnum,
    userInfo: (state) => state.userInfo,
    noticeId: (state) => state.noticeId,
    provcodeTemp: (state) => state.provcodeTemp,
}

const actions = {
    // 任务列表
    getTasks: ({ commit }, code) => {
        // commit('getTasks', []);
        return vm.$fly.get('/api/Task/GetTaskList', common.connectObj({
            provinceCode: code
        })).then((res) => {
            let { returnCode, returnMsg, data } = res;
            commit('getTasks', data)
            return Promise.resolve(res);
        })
    },
    getScreenTaskList: ({ commit }, code) => {
        commit('getTasks', []);
        return vm.$fly.get('/api/Task/GetScreenTaskList')
        .then((res) => {
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
    getUserInfo: ({ commit }, isRedis=false) => {
        return vm.$fly.get('/api/User/GetUserInfo', common.connectObj({
            isRedis: isRedis
        })).then((res) => {
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
    // 保存临时的provcode，如果临时的provcode存在，首页就不请求getUserInfo
    setProvcodeTemp: ({ commit }, code) => {
        commit('setProvcodeTemp', code)
    },
}

const mutations = {
    getTasks(state, data) {
        state.tasks = data.taskLists;
        state.taskTotal = data.total;
        state.localnum = data.localnum > 999 ? 999 : data.localnum;
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
    setProvcodeTemp(state, code) {
        state.provcodeTemp = code;
    },
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})
