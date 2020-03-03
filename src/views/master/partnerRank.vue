<template>
<div class='member-rank bg-f5'>
    <topbar title="合伙人做单排行榜"></topbar>
    <date-select @getDate="getDate" :init="-1"></date-select>
    <div class="container">
        <div class="nothing" v-if="nothing">
            <img src="../../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="item.tel">
            <div class="td1">
                <div class="award-icon" v-if="index==0">
                    <van-icon name="award" size="24" color="#ffd01e" />
                    <span style="color:#ffd01e;">{{parseInt(index+1)}}</span>
                </div>
                <div class="award-icon" v-if="index==1">
                    <van-icon name="award" size="24" color="#ff6c6c" />
                    <span style="color:#ff6c6c;">{{parseInt(index+1)}}</span>
                </div>
                <div class="award-icon" v-if="index==2">
                    <van-icon name="award" size="24" color="#ff976a" />
                    <span style="color:#ff976a;">{{parseInt(index+1)}}</span>
                </div>
                <div class="award-icon" v-if="index>2">
                    <van-icon name="award" size="24"/>
                    <span>{{parseInt(index+1)}}</span>
                </div>
            </div>
            <div class="td2">
                <div class="info">
                    <span class="tel">账号：{{item.tel_des}}</span>
                    <span class="count">成功做单：<strong>{{item.task_success_count}}</strong></span>
                </div>
                <span class="date">注册时间：{{item.create_time}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
import DateSelect from '@/components/date-select.vue';
export default {
    name: 'MemberRank',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            items: [],
            nothing: false,
        };
    },
    methods: {
        getDate(date) {
            this.formDate = date;
            this.getInfo();
        },
        getInfo() {
            this.$fly.get('/api/User/PartnerRankList',{
                dateTime: this.formDate
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        let list = data || [];
                        this.items = list.map(item => Object.assign({}, item, {
                            tel_des: item.tel.toString().substr(0, 3) + '****' + item.tel.toString().substr(7, 4)
                        }));
                        this.nothing = this.items.length == 0;
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        },
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.member-rank {
    .container {
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
            padding: 10px 0;
            background-color: #fff;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            .td1 {
                width: 60/11rem;
                text-align: center;
                .award-icon {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            }
            .td2 {
                flex: 1;
                .info {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14/11rem;
                    padding: 0 15px 3px 0;
                    .count strong {
                        color: #f80;
                    }
                }
                .date {
                    color: #999;
                    font-size: 12/11rem;
                }
            }
            .td3 {
                flex: 1;
                text-align: center;
                // color: #07c160;
            }
            .td4 {
                flex: 1;
                text-align: center;
                color: #f40;
            }
        }
    }
}
</style>