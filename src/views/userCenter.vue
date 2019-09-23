<template>
<div class='user-center bg-f5'>
    <div class="header-wp">
        <div class="user">
            <div class="avatar">
                <img src="../assets/img/logo.jpeg" alt="">
            </div>
            <div class="name">
                <p>{{user.tel}}（{{user.status_des}}）</p>
                <p>{{user.name}}</p>
                <p>邀请码：{{user.invitation_code}}</p>
            </div>
            <!-- <van-icon class="sitting" name="setting-o" /> -->
        </div>
        <div class="row">
            <div class="total">
                <h3>总接</h3>
                <span>{{user.totaltaskcount}} 单</span>
            </div>
        </div>
        <div class="row">
            <div class="item">
                <h3>总成功</h3>
                <span>{{user.totaltask_success_count}} 单</span>
            </div>
            <div class="item">
                <h3>总成功率</h3>
                <span>{{user.totaltask_success_rate}}</span>
            </div>
        </div>
    </div>
    <div class="wallet">
        <div class="balance">
            <h3>账户余额(元)</h3>
            <span>{{user.account_money}}</span>
        </div>
        <router-link to="/user/fund">
            <van-button plain type="info">资金明细</van-button>
        </router-link>
        <router-link to="/user/cashout">
            <van-button type="info" style="margin-left:10px;">提现</van-button>
        </router-link>
    </div>
    <div class="my-team">
        <div class="item" @click="gotoReopen">
            <van-icon name="lock" size="20" color="#03a9f3" />
            <span>申请解禁</span>
        </div>
        <div class="item" @click="gotoAppeal">
            <van-icon name="service" size="20" color="#03a9f3" />
            <span>任务申诉</span>
        </div>
    </div>
    <div class="setting-list">
        <router-link v-for="(item, index) in settingList" :key="index" :to="item.to">
            <div class="item">
                <h3>{{item.name}}</h3>
                <van-icon name="arrow" />
            </div>
        </router-link>
        <div class="item" @click="loginout">
            <h3>退出登录</h3>
            <van-icon name="arrow" />
        </div>
    </div>
    <tab-bar :active="2"></tab-bar>
</div>
</template>

<script>
import TabBar from '@/components/tab-bar.vue';
import common from '../components/common'
import { mapActions, mapGetters } from 'vuex';
export default {
    name: 'UserCenter',
    components: { TabBar },
    data() {
        return {
            settingList: [],
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'noticeId',
        ]),
        user() {
            return Object.assign({}, this.userInfo, {
                account_money: this.userInfo.account_money ? this.userInfo.account_money.toFixed(2) : 0.00,
            })
        },
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        gotoReopen() {
            this.$router.push('/user/reopen');
        },
        gotoAppeal() {
            this.$router.push('/user/appeal');
        },
        loginout() {
            this.$dialog.confirm({
                message: '确定要退出登录吗？'
            }).then(() => {
                this.$fly.get('/api/User/LoginOut', common.connectObj())
                .then(() => {
                    localStorage.removeItem('Authorization');
                    localStorage.removeItem('tel');
                    localStorage.removeItem(`notice_${this.noticeId}`)
                    this.$router.replace('/login');
                }).catch(() => {
                    this.$toash('注销失败')
                })
            })
        }
    },
    mounted() {
        this.getUserInfo().then(() => {
            this.settingList = [
                { to: '/user/info', name: '账户资料' },
                { to: '/user/provcode', name: '设置归属地' },
                { to: '/user/data', name: '数据统计' },
                { to: '/user/team', name: '我的团队' },
                { to: '/user/setcommission', name: '抽成设置' },
                { to: `/user/invite?code=${this.user.invitation_code}`, name: '邀请下级' },
                { to: '/user/download', name: 'APP下载' },
            ]
        })
    },
}
</script>

<style lang='less'>
@my_blue: #03a9f3;
@my_yellow: #FFC107;
.user-center {
    .header-wp {
        background: linear-gradient(to top right, #03a9f3, #01bcd3);
        color: #fff;
        .user {
            padding: 20px;
            display: flex;
            align-items: center;
            position: relative;
            .avatar {
                width: 60/11rem;
                height: 60/11rem;
                border-radius: 50%;
                overflow: hidden;
            }
            .name {
                font-size: 14/11rem;
                padding-left: 15px;
                line-height: 1.6;
                // p:first-child {
                //     font-size: 16/11rem;
                // }
            }
            .sitting {
                position: absolute;
                right: 20px;
                top: 20px;
                font-size: 20/11rem;
                padding: 10px;
            }
        }
        .row {
            padding: 0 24px;
            padding-bottom: 15px;
            display: flex;
            align-items: flex-end;
            h3 {
                font-size: 14/11rem;
                padding: 5px 0;
                font-weight: 300;
            }
            .total {
                // min-width: 50%;
                // flex: 1;
                span {
                    font-size: 18/11rem;
                    font-weight: 700;
                }
            }
            .btn {
                margin-left: 20px;
            }
            .item {
                flex: 1;
                span {
                    font-size: 16/11rem;
                    font-weight: 600;
                }
            }
        }
    }
    .wallet {
        padding: 30px 20px;
        display: flex;
        align-items: center;
        background-color: #fff;
        .balance {
            flex: 1;
            h3 {
                font-size: 14/11rem;
                margin-bottom: 5px;
                color: #666;
            }
            span {
                font-size: 18/11rem;
                font-weight: 700;
            }
        }
    }
    .my-team {
        display: flex;
        justify-content: space-between;
        .item {
            padding: 20px 15px;
            // width: 49%;
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16/11rem;
            background-color: #f5f5f5;
            color: #787878;
            // &:first-child {
            //     border-right: 1px solid #ccc;
            // }
            span {
                margin-left: 8px;
            }
        }
    }
    .setting-list {
        // padding: 10px 0;
        a {
            background-color: unset;
            color: unset;
        }
        .item {
            padding: 15px 20px;
            border-bottom: 1px solid #f5f5f5;
            display: flex;
            align-items: center;
            background-color: #fff;
            &:last-child {
                // border: 0;
            }
            h3 {
                flex: 1;
                font-size: 16/11rem;
                color: #666;
            }
        }
    }
}
</style>