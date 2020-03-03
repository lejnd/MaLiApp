<template>
<div class='partner-income bg-f5'>
    <topbar title="合伙人收入"></topbar>
    <p class="total-money">累计收入：¥{{total_money}}</p>
    <div class="list">
        <div class="nothing" v-if="nothing">
            <img src="../../assets/img/nothing.png" alt="">
            <p>暂无数据</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <!-- <img class="icon" src="../../assets/img/man.png" alt=""> -->
            <div class="info">
                <h3>账号：{{item.tel_des}}</h3>
                <p>成功做单：{{item.task_success_count}}</p>
                <p>每单奖励：{{item.award_msg}}</p>
                <!-- <p>下级总做单：{{item.subtotaltaskcount}}</p>
                <p>下级成功做单：{{item.subtotaltask_success_count}}</p>
                <p>下级总成功率：{{item.subsuccess_rate}}</p> -->
                <p>做单时间：{{item.formatTime}}</p>
            </div>
            <div class="btn-group">
                <p>收入：<span class="money">{{item.award_money}} 元</span></p>
                <p><span class="deco">{{item.is_give_des}}</span></p>                
            </div>
        </div>
        <van-pagination
            v-if="total > PAGE_SIZE"
            v-model="currentPage" 
            :page-count="pageCount"
            @change="getList"
            mode="simple"
        />
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
const PAGE_SIZE = 10;

export default {
    name: 'PartnerIncome',
    components: { Topbar },
    data() {
        return {
            currentPage: 1,
            items: [{}, {}],
            item: {},
            total: 0,
            nothing: false,
            total_money: '',
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.total / PAGE_SIZE);
        }
    },
    methods: {
        getList() {
            // this.$toast.loading()
            this.items = [];
            this.$fly.get('/api/User/GetPartnerMoney',{
                pageIndex: this.currentPage,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        let list = data.list || [];
                        this.total = data.total_num;
                        this.total_money = data.total_money;
                        let eme = ['结算中', '奖励已发放']
                        this.items = list.map(item => Object.assign({}, item, {
                            tel_des: item.tel.toString().substr(0, 3) + '****' + item.tel.toString().substr(7, 4),
                            formatTime: this.$moment(item.create_time).format('YYYY/MM/DD HH:mm:ss'),
                            is_give_des: eme[item.is_give], 
                        }));
                    }
                } else {
                    this.$toast(returnMsg)
                }
            }).finally(() => {
                // this.$toast.clear();
                this.nothing = this.items.length == 0;
            })
        },
    },
    mounted() {
        this.getList();
    },
}
</script>

<style lang='less'>
.partner-income {
    padding-bottom: 60/11rem;
    .total-money {
        text-align: center;
        padding: 10px;
        color: #f50;
        font-size: 17/11rem;
    }
    .list {
        .nothing {
            text-align: center;
            padding: 40px 0;
            img {
                width: 100px;
                opacity: .4;
            }
            p {
                padding: 10px;
                font-size: 14/11rem;
                color: #999;
            }
        }
        .item {
            padding: 10px 15px;
            display: flex;
            align-items: center;
            background-color: #fff;
            margin-bottom: 5px;
            .icon {
                width: 36px;
                margin-right: 10px;
            }
            .info {
                flex: 1;
                h3 {
                    font-size: 15/11rem;
                    font-weight: 700;
                    margin-bottom: 3px;
                }
                h4 {
                    font-size: 13/11rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                p {
                    color: #787878;
                    line-height: 1.6;
                    font-size: 14/11rem;
                    &:last-child {
                        margin-top: 5px;
                    }
                }
            }
            .btn-group {
                p {
                    padding: 5px 0;
                    text-align: right;
                    .btn {
                        width: 85px;
                    }
                    .money {
                        color: #f50;
                        font-size: 14/11rem;
                        font-weight: 700;
                    }
                    .deco {
                        font-size: 16/11rem;
                        color: #f40;
                    }
                }
            }
        }
        .van-pagination {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: #fff;
            z-index: 1;
            padding-top: 5px;
        }
    }
}
</style>