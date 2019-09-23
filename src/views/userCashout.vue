<template>
<div class='user-cashout bg-f5'>
    <topbar title="提现"></topbar>
    <div class="container">
        <div class="account">
            <h3>账户余额</h3>
            <strong>¥ {{account_money}}</strong>
            <p>支付宝账号：{{alipay}}</p>
        </div>
        <div class="section">
            <p>1、未设置支付宝账号者，请到账户资料页面补全您的支付宝账号收款信息！</p>
            <p>2、注意支付宝账号和真实名字是否匹配，不匹配到账户资料页面修改！</p>
            <p>3、由于支付宝风控，耐心等待，提现到账时间12小时内；</p>
            <p>4、提现手续费1%</p>
        </div>
        <div class="cashout">
            <van-cell-group>
                <van-field v-model="amount" type="number" placeholder="请输入提现金额">
                    <span slot="right-icon">元</span>
                </van-field>
            </van-cell-group>
            <div class="all-cash">
                <span @click="amount = account_money">全部提现</span>
            </div>
            <div class="btn-group">
                <van-button class="btn" type="info" @click="cashout">提现</van-button>
                <!-- <van-button class="btn" type="primary" @click="cashoutAll">全部提现</van-button> -->
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'UserCashout',
    components: { Topbar },
    data() {
        return {
            account_money: null,
            isAll: false,
            amount: 0,
            alipay: '',
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
        // cashoutAll() {
        //     this.$dialog.confirm({
        //         title: '余额：2121.00元',
        //         message: '确定全部提现吗？'
        //     }).then(() => {
        //         this.isAll = true;
        //         this.cashout();
        //     })
        // },
        cashout() {
            if (!this.userInfo.alipay_acount) {
                this.$notify('请先绑定提现账号');
                this.$router.push('/user/info');
                return false;
            }
            if (this.amount < 20) {
                this.$notify('提现金额不能小于20元');
                return false;
            }
            if (this.amount > this.account_money) {
                this.$notify('提现金额不能大于账户余额');
                return false;
            }
            this.$fly.get('/api/User/WithDrawAccountMoney', common.connectObj({
                amount: this.amount,
                alipayAccount: this.userInfo.alipay_acount,
                alipayName: this.userInfo.alipay_name
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                } else {
                    this.$toast(returnMsg)
                }
            })
        }
    },
    mounted() {
        this.getUserInfo().then(() => {
            this.account_money = this.userInfo.account_money;
            this.alipay = this.userInfo.alipay_acount ? `${this.userInfo.alipay_acount} | ${this.userInfo.alipay_name}` : '未设置'
        })
    },
}
</script>

<style lang='less'>
.user-cashout {
    .container {
        padding: 15px;
        .account {
            background: linear-gradient(to top right, #03a9f3, #01bcd3);
            color: #fff;
            padding: 20px;
            font-size: 14/11rem;
            line-height: 1.8;
            margin-bottom: 10px;
            border-radius: 4px;
            strong {
                font-size: 20/11rem;
                font-weight: 700;
            }
        }
        .section {
            padding: 15px 0;
            line-height: 1.7;
            color: #777;
            font-size: 13/11rem;
        }
        .cashout {
            .all-cash {
                padding: 10px 0;
                span {
                    padding: 10px;
                    color: #03a9f3;
                }
            }
            .btn-group {
                margin-top: 10px;
                .btn {
                    width: 100%;
                    margin-top: 10px;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>