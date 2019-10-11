import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "Login" */ './views/login.vue')
        },
        {
            path: '/course',
            name: 'course',
            component: () => import(/* webpackChunkName: "course" */ './views/course.vue')
        },
        {
            path: '/detail',
            name: 'Detail',
            component: () => import(/* webpackChunkName: "Detail" */ './views/detail.vue')
        },
        {
            path: '/order',
            name: 'Order',
            component: () => import(/* webpackChunkName: "Order" */ './views/orderList.vue')
        },
        {
            path: '/user',
            name: 'User',
            component: () => import(/* webpackChunkName: "User" */ './views/userCenter.vue')
        },
        {
            path: '/user/info',
            name: 'UserInfo',
            component: () => import(/* webpackChunkName: "UserInfo" */ './views/userInfo.vue')
        },
        {
            path: '/user/fund',
            name: 'UserFund',
            component: () => import(/* webpackChunkName: "UserFund" */ './views/userFund.vue')
        },
        {
            path: '/user/team',
            name: 'UserTeam',
            component: () => import(/* webpackChunkName: "UserTeam" */ './views/userTeam.vue')
        },
        {
            path: '/user/cashout',
            name: 'UserCashout',
            component: () => import(/* webpackChunkName: "UserCashout" */ './views/userCashout.vue')
        },
        {
            path: '/user/setcommission',
            name: 'UserSetcommission',
            component: () => import(/* webpackChunkName: "UserSetcommission" */ './views/userSetcommission.vue')
        },
        {
            path: '/user/appeal',
            name: 'UserAppeal',
            component: () => import(/* webpackChunkName: "UserAppeal" */ './views/userAppeal.vue')
        },
        {
            path: '/user/appealist',
            name: 'UserAppealist',
            component: () => import(/* webpackChunkName: "UserAppealist" */ './views/userAppealist.vue')
        },
        {
            path: '/user/data',
            name: 'UserData',
            component: () => import(/* webpackChunkName: "UserData" */ './views/userData.vue')
        },
        {
            path: '/user/reopen',
            name: 'UserReopen',
            component: () => import(/* webpackChunkName: "UserReopen" */ './views/userReopen.vue')
        },
        {
            path: '/user/download',
            name: 'UserDownload',
            component: () => import(/* webpackChunkName: "UserDownload" */ './views/userDownload.vue')
        },
        {
            path: '/user/invite',
            name: 'UserInvite',
            component: () => import(/* webpackChunkName: "UserInvite" */ './views/userInvite.vue')
        },
        {
            path: '/user/reopenlist',
            name: 'UserReopenlist',
            component: () => import(/* webpackChunkName: "UserReopenlist" */ './views/userReopenlist.vue')
        },
        {
            path: '/user/provcode',
            name: 'UserProvcode',
            component: () => import(/* webpackChunkName: "UserProvcode" */ './views/userProvcode.vue')
        },
        {
            path: '/user/password',
            name: 'UserPassword',
            component: () => import(/* webpackChunkName: "UserPassword" */ './views/userPassword.vue')
        }
    ]
})
