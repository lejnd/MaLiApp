<template>
<div class='user-fund bg-f5'>
    <topbar title="资金明细"></topbar>
    <van-tabs class="blueStyle" v-model="active" @change="tabChange">
        <van-tab title="余额明细">
            <div class="container">
                <date-select @getDate="getDate"></date-select>
                <div class="item" v-for="(item, index) in balanceList" :key="index">
                    <img class="icon" src="../assets/img/money.png" alt="">
                    <div class="info">
                        <div class="money">
                            <div>
                                <h3>{{item.businessTypeDes}}：<strong>{{item.amount}}</strong></h3>
                            </div>
                            <!-- <p>卡商价格：{{item.afterMoney}}</p> -->
                        </div>
                        <p>{{item.time}}</p>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="提现明细">
            <div class="container">
                <div class="item" v-for="(item, index) in cashoutList" :key="index">
                    <img class="icon" src="../assets/img/wallet.png" alt="">
                    <div class="info">
                        <h3>提现：{{item.money}}</h3>
                        <p>{{item.withdraw_time}}</p>
                    </div>
                    <span class="result" style="color:#07c160;">{{item.status_des}}</span>
                </div>
            </div>
        </van-tab>
    </van-tabs>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
import DateSelect from '@/components/date-select.vue';
export default {
    name: 'UserFund',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            active: 0,
            cashoutList: [],
            balanceList: [],
        };
    },
    methods: {
        getDate(date) {
            this.formDate = date;
            this.getBalanceList();            
        },
        getCashoutList() {
            this.$fly.get('/api/User/GetWithDrawAccountMoneyDetail', common.connectObj())
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data && data.length > 0) {
                        this.cashoutList = data.map((item) => Object.assign({}, item, {
                            withdraw_time: this.$moment(item.withdraw_time).format('YYYY/MM/DD HH:mm:ss')
                        }));
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        },
        getBalanceList() {
            this.$fly.get('/api/User/GetUserAccountMoneyInDetail', common.connectObj({
                dt: this.formDate
            }))
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data && data.length > 0) {
                        this.balanceList = data.map((item) => Object.assign({}, item, {
                            time: this.$moment(item.time).format('YYYY/MM/DD HH:mm:ss')
                        }));
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        },
        tabChange() {
            if (this.active == 0) {
                this.balanceList = [];
                this.getBalanceList();
            }
            if (this.active == 1) {
                this.cashoutList = [];
                this.getCashoutList();
            }
        }
    },
    mounted() {
        this.getCashoutList();
    },
}
</script>

<style lang='less'>
.user-fund {
    .container {
        background-color: #fff;
        .item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid #f5f5f5;
            .icon {
                width: 36px;
                margin-right: 15px;
            }
            .info {
                flex: 1;
                .money {
                    display: flex;
                    justify-content: space-between;
                }
                h3 {
                    font-size: 14/11rem;
                    margin-bottom: 5px;
                    strong {
                        color: #f40;
                    }
                }
                p {
                    color: #888;
                }
            }
            .result {
                padding-left: 10px;
            }
        }
    }
}
</style>