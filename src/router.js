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
        },
        {
            path: '/user/feedback',
            name: 'UserFeedback',
            component: () => import(/* webpackChunkName: "UserFeedback" */ './views/userFeedback.vue')
        },
        {
            path: '/user/feedback_logs',
            name: 'UserFeedbackLogs',
            component: () => import(/* webpackChunkName: "UserFeedbackLogs" */ './views/userFeedbackLogs.vue')
        },
        {
            path: '/user/qrcode',
            name: 'userQrcode',
            component: () => import(/* webpackChunkName: "userQrcode" */ './views/userQrcode.vue')
        },
        {
            path: '/user/qrcodeAction',
            name: 'userQrcodeAction',
            component: () => import(/* webpackChunkName: "userQrcodeAction" */ './views/userQrcodeAction.vue')
        },
        {
            path: '/ranking',
            name: 'ranking',
            component: () => import(/* webpackChunkName: "ranking" */ './views/ranking.vue')
        },
        {
            path: '/notices',
            name: 'notices',
            component: () => import(/* webpackChunkName: "notices" */ './views/notices.vue')
        },
        {
            path: '/master',
            name: 'userMaster',
            component: () => import(/* webpackChunkName: "userMaster" */ './views/master/index.vue')
        },
        {
            path: '/master/memberRank',
            name: 'memberRank',
            component: () => import(/* webpackChunkName: "memberRank" */ './views/master/memberRank.vue')
        },
        {
            path: '/master/taskList',
            name: 'masterTask',
            component: () => import(/* webpackChunkName: "masterTask" */ './views/master/taskList.vue')
        },
        {
            path: '/master/partnerRank',
            name: 'partnerRank',
            component: () => import(/* webpackChunkName: "partnerRank" */ './views/master/partnerRank.vue')
        },
        {
            path: '/master/memberList',
            name: 'memberList',
            component: () => import(/* webpackChunkName: "memberList" */ './views/master/memberList.vue')
        },
        {
            path: '/master/partnerList',
            name: 'partnerList',
            component: () => import(/* webpackChunkName: "partnerList" */ './views/master/partnerList.vue')
        },
        {
            path: '/master/partnerIncome',
            name: 'partnerIncome',
            component: () => import(/* webpackChunkName: "partnerIncome" */ './views/master/partnerIncome.vue')
        },
        
    ]
})
