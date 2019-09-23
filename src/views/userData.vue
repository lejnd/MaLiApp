<template>
<div class='user-data'>
    <topbar title="数据统计"></topbar>
    <div class="container">
         <div class="header">
             <h2 class="title">收益</h2>
             <div class="info">
                 <h3 class="money">¥ <strong>{{dataInfo.account_money}}</strong></h3>
                 <p class="alipay">支付宝：{{userInfo.alipay_acount || '未设置'}} | {{userInfo.alipay_name || '未设置'}}</p>
             </div>
             <van-button class="btn" plain round type="info" @click="gotoCashout">全部提现</van-button>
         </div>
         <div class="content">
             <h2 class="title">任务统计</h2>
             <div class="data-wp">
                <date-select @getDate="getDate"></date-select>
                <van-grid :border="false" :column-num="3">
                    <van-grid-item>
                        <span class="value">{{dataInfo.totaltaskcount}}</span>
                        <span class="name">日总接单</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.totaltask_success_count}}</span>
                        <span class="name">日成功单</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.success_rate}}</span>
                        <span class="name">日成功率</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.subtotaltaskcount}}</span>
                        <span class="name">下级日总接单</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.subtotaltask_success_count}}</span>
                        <span class="name">下级总成功单</span>
                    </van-grid-item>
                    <van-grid-item>
                        <span class="value">{{dataInfo.subsuccess_rate}}</span>
                        <span class="name">下级总成功率</span>
                    </van-grid-item>
                    <!-- <van-grid-item>
                        <span class="value">{{dataInfo.totaltask_failed_count}}</span>
                        <span class="name">日放弃数</span>
                    </van-grid-item> -->
                </van-grid>
             </div>
         </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common';
import DateSelect from '@/components/date-select.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'UserData',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            dataInfo: {},
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        getDate(date) {
            this.formDate = date;
            this.getInfo();
        },
        getInfo() {
            this.$fly.get('/api/User/StatisticsUserData', common.connectObj({
                dt: this.formDate
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        this.dataInfo = Object.assign({}, data)
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        },
        gotoCashout() {
            this.$router.push('/user/cashout');
        }
    },
    mounted() {
        this.getUserInfo();
    },
}
</script>

<style lang='less'>
.user-data {
    .container {
        .header {
            background-color: #03a9f3;
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            .title {
                padding-top: 20px;
                font-size: 18/11rem;
            }
            .info {
                text-align: center;
                padding: 35px 0;
                .money {
                    font-size: 18/11rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                    strong {
                        font-size: 27/11rem;
                        font-weight: 800;
                    }
                }
                .alipay {
                    font-size: 14/11rem;
                }
            }
            .btn {
                margin-bottom: -21px;
                border: 0;
                box-shadow: 0 0 8px #03a9f3;
                width: 140px;
            }
        }
        .content {
            padding: 28px 15px 40px 15px;
            .title {
                font-size: 16/11rem;
                padding: 20px 0;
            }
            .data-wp {
                padding: 15px;
                box-shadow: 0 0 12px #b1e7ff;
                .van-grid {
                    .value {
                        font-size: 17/11rem;
                        font-weight: 600;
                        padding-bottom: 8px;
                    }
                    .name {
                        color: #919191;
                        font-size: 14/11rem;
                    }
                }
            }
        }
    }
}
</style>