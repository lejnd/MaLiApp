<template>
<div class='ranking bg-f5'>
    <van-tabs v-model="active" color="#03a9f3" @change="changeTabs">
        <van-tab title="日 榜">
            <date-select @getDate="getDate"></date-select>
            <div class="tableH">
                <span class="th1">排名</span>
                <span style="flex:1;">用户</span>
                <span style="flex:1;">成功订单</span>
                <span style="flex:1;">奖励金</span>
            </div>
            <div class="container">
                <div class="nothing" v-if="nothingDay">
                    <img src="../assets/img/nothing.png" alt="">
                    <p>暂无记录</p>
                </div>
                <div class="item" v-for="(item, index) in dayItems" :key="item.tel">
                    <div class="td1">
                        <img class="td1-img" v-if="index==0" src="../assets/img/ranking1.png" alt="">
                        <img class="td1-img" v-if="index==1" src="../assets/img/ranking2.png" alt="">
                        <img class="td1-img" v-if="index==2" src="../assets/img/ranking3.png" alt="">
                        <span class="td1-text" v-if="index>2">{{index+1}}</span>
                    </div>
                    <span class="td2">{{item.tel_des}}</span>
                    <span class="td3">{{item.task_success_count}}</span>
                    <span class="td4">¥{{item.award_money}}</span>
                </div>
            </div>
        </van-tab>
        <van-tab title="周 榜">
            <div class="select">
                <span
                    class="select-item"
                    v-for="(item, index) in opts"
                    :key="index"
                    :class="{ 'selected': weekIndex == index }"
                    @click="selectWeek(item, index)"
                >
                    {{item.text}}
                </span>
            </div>
            <div class="tableH">
                <span class="th1">排名</span>
                <span style="flex:1;">用户</span>
                <span style="flex:1;">成功订单</span>
                <span style="flex:1;">奖励金</span>
            </div>
            <div class="container">
                <div class="nothing" v-if="nothingWeek">
                    <img src="../assets/img/nothing.png" alt="">
                    <p>暂无记录</p>
                </div>
                <div class="item" v-for="(item, index) in weekItems" :key="item.tel">
                    <div class="td1">
                        <img class="td1-img" v-if="index==0" src="../assets/img/ranking1.png" alt="">
                        <img class="td1-img" v-if="index==1" src="../assets/img/ranking2.png" alt="">
                        <img class="td1-img" v-if="index==2" src="../assets/img/ranking3.png" alt="">
                        <span class="td1-text" v-if="index>2">{{index+1}}</span>
                    </div>
                    <span class="td2">{{item.tel_des}}</span>
                    <span class="td3">{{item.task_success_count}}</span>
                    <span class="td4">¥{{item.award_money}}</span>
                </div>
            </div>
        </van-tab>
    </van-tabs>
    <tab-bar :active="2"></tab-bar>
</div>
</template>

<script>
import TabBar from '@/components/tab-bar.vue';
import DateSelect from '@/components/date-select.vue';
import common from '../components/common'
export default {
    name: 'Ranking',
    components: { TabBar, DateSelect },
    data() {
        return {
            active: '0',
            searchDay: '',
            dayItems: [],

            opts: [
                { text: '本周', value: 0 },
                { text: '上周', value: 7 },
                { text: '上两周', value: 14 },
            ],
            weekIndex: 0,
            weekItems: [],
            nothingDay: false,
            nothingWeek: false,
        };
    },
    methods: {
        getDate(date) {
            this.searchDay = date;
            this.dayStatistic();
        },
        dayStatistic() {
            if (this.searchDay < this.dateCompute(-7)) {
                this.$notify('只能查询最近7天的数据');
                this.dayItems = [];
                this.nothingDay = true;
                return false;
            }
            this.$fly.get('/api/Task/DayStatistic', { dateTime: this.searchDay })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data || [];
                    this.dayItems = list.map(item => Object.assign({}, item, {
                        tel_des: item.tel.toString().substr(0, 3) + '**' + item.tel.toString().substr(7, 4)
                    }));
                    this.nothingDay = this.dayItems.length == 0

                } else {
                    this.$toast(returnMsg)
                }          
            })
        },
        weekStatistic(dateTime) {
            this.$fly.get('/api/Task/WeekStatistic', { dateTime })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data || [];
                    this.weekItems = list.map(item => Object.assign({}, item, {
                        tel_des: item.tel.toString().substr(0, 3) + '**' + item.tel.toString().substr(7, 4),
                        award_money: item.day_sum_money + item.week_award_money
                    }));
                    this.nothingWeek = this.weekItems.length == 0
                } else {
                    this.$toast(returnMsg)
                }          
            })
        },
        selectWeek(item, index) {
            this.weekIndex = index;
            let dateTime = this.dateCompute(-item.value);
            this.weekStatistic(dateTime);
        },
        changeTabs() {
            if (this.active == '1') {
                let myDate = new Date();//当前日期
                let dateTime = this.$moment(myDate).format('YYYY-MM-DD');
                this.weekStatistic(dateTime);
            }
        },
        // 日期运算
        dateCompute(val) {
            let myDate = new Date();//当前日期
            let d = new Date(myDate);
            d.setDate(d.getDate() + val);
            return this.$moment(d).format('YYYY-MM-DD');
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
@tableWidth1: 60/11rem;
.ranking {
    .tableH {
        // padding: 0 15px;
        display: flex;
        height: 30px;
        align-items: center;
        background-color: #fff;
        margin-bottom: 1px;
        margin-top: 5px;
        .th1 {
            width: @tableWidth1;
        }
        span {
            text-align: center;
        }
    }
    .select {
        display: flex;
        // justify-content: space-between;
        padding: 5px 10px;
        &-item {
            border: 1px solid #dedede;
            border-radius: 5px;
            padding: 6px 15px;
            // flex: 1;
            margin-right: 5px;
            text-align: center;
            &.selected {
                background-color: #03a9f3;
                border-color: #03a9f3;
                color: #fff;
            }
        }
    }
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
            margin-bottom: 1px;
            display: flex;
            align-items: center;
            .td1 {
                width: @tableWidth1;
                text-align: center;
                .td1-img {
                    width: @tableWidth1;
                }
                .td1-text {
                    font-size: 18/11rem;
                    font-weight: 800;
                    color: #bcbcbc;
                    font-style: italic;
                }
            }
            .td2 {
                flex: 1;
                text-align: center;
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