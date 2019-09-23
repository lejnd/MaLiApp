<template>
<div class='user-setcommission bg-f5'>
    <topbar title="抽成设置"></topbar>
    <div class="container">
        <div class="content">
            <van-cell-group>
                <van-field v-model="rate" type="number" label="抽佣百分比" placeholder="请输入抽佣百分比">
                    <span slot="right-icon">%</span>
                </van-field>
            </van-cell-group>
            <div class="section">
                <p>1、佣金百分比设置后，邀请好友注册，则默认抽取该好友上面数字的佣金比</p>
                <p>2、数字越大下级接单价格越低，下级接单价格=你的接单价格*（100-抽佣数值）/100</p>
                <!-- <p>3、预计您的接单价格：<strong>{{estimatedPrice}}</strong>（元）</p>
                <p>4、预计直接下级接单价格：<strong>{{subEstimatedPrice}}</strong>（元）</p> -->
            </div>
        </div>
        <van-button class="btn" type="info" @click="setRate">设置抽佣比例</van-button>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'UserSetcommission',
    components: { Topbar },
    data() {
        return {
            rate: '',
            estimatedPrice: 0
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        subEstimatedPrice() {
            return (this.estimatedPrice - this.estimatedPrice * this.rate/100).toFixed(2);
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        setRate() {
            if (this.rate < 1) {
                this.$notify('抽佣百分比不能小于1%');
                return false;
            }
            this.$fly.get('/api/User/SetMySubAgentRate', common.connectObj({
                rate: this.rate,
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                    this.init();
                } else {
                    this.$notify(returnMsg)
                }
            })
        },
        init() {
            this.getUserInfo().then(() => {
                this.rate = this.userInfo.rate_set;
                this.estimatedPrice = this.userInfo.estimated_price;
            })
        }
    },
    mounted() {
        this.init()
    },
}
</script>

<style lang='less'>
.user-setcommission {
    .container {
        padding: 15px;
        .content {
            background-color: #fff;
            padding: 15px;
            border-radius: 4px;
            .section {
                color: #919191;
                margin-top: 10px;
                p {
                    padding: 5px 0;
                }
            }
        }
        .btn {
            margin: 15px 0;
            width: 100%;
            border-radius: 4px;
        }
    }
}
</style>