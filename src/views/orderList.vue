<template>
<div class='order-list'>
    <date-select @getDate="getDate"></date-select>
    <van-tabs v-model="active" @change="getTaskCenter">
        <van-tab title="任务中">
            <div class="list">
                <p class="tip">
                    <span class="title">提示：</span>
                    确定是辅助成功的订单，却被商家判定为失败，需要在40分钟内尽快申诉，防止超过申诉时间。
                </p>
                <div class="nothing" v-if="aList.length <= 0">
                    {{nothingText}}
                </div>
                <div class="item" v-for="task in aList" :key="task.id">
                    <div class="item-row">
                        <div class="work-id">任务ID：<span>{{task.task_id}}</span></div>
                        <div class="price">赏金：<span>{{task.price.toFixed(2)}}</span></div>
                    </div>
                    <div class="item-row">
                        <div class="timer">
                            <h3>剩余时间：</h3>
                            <overtime :create="task.create_time" :expire="task.expire_time" @timeover="removeTask(task.task_id)"></overtime>
                            <van-tag v-if="task.user_hand_remark" type="success">{{task.user_hand_remark}}</van-tag>
                        </div>
                        <van-button class="btn" type="info" @click="gotoDetail(task)">做任务</van-button>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="任务完成">
            <div class="list">
                <p class="tip">
                    <span class="title">提示：</span>
                    确定是辅助成功的订单，却被商家判定为失败，需要在40分钟内尽快申诉，防止超过申诉时间。
                </p>
                <div class="nothing" v-if="bList.length <= 0">
                    {{nothingText}}
                </div>
                <div class="item" v-for="(task, index) in bList" :key="index">
                    <div class="item-row">
                        <div class="work-id">任务ID：<span>{{task.task_id}}</span></div>
                        <div class="price">赏金：<span>{{task.price.toFixed(2)}}</span></div>
                    </div>
                    <div class="item-row">
                        <div class="timer">
                            <h3>{{task.formatTime}}</h3>
                            <van-tag v-if="task.user_hand_remark" type="success">{{task.user_hand_remark}}</van-tag>
                        </div>
                        <span class="task-status">{{task.status_des}}</span>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="任务失败">
            <div class="list">
                <p class="tip">
                    <span class="title">提示：</span>
                    确定是辅助成功的订单，却被商家判定为失败，需要在40分钟内尽快申诉，防止超过申诉时间。
                </p>
                <div class="nothing" v-if="cList.length <= 0">
                    {{nothingText}}
                </div>
                <div class="item" v-for="(task, index) in cList" :key="index">
                    <div class="item-row">
                        <div class="work-id">任务ID：<span>{{task.task_id}}</span></div>
                        <div class="price">赏金：<span>{{task.price.toFixed(2)}}</span></div>
                    </div>
                    <div class="item-row">
                        <div class="timer">
                            <h3>{{task.formatTime}}</h3>
                            <van-tag v-if="task.user_hand_remark" type="success">{{task.user_hand_remark}}</van-tag>
                        </div>
                        <span class="task-status">{{task.status_des}}</span>
                    </div>
                    <div class="btn-wp" v-if="task.status == 6">
                        <van-button type="info" size="mini" :to="`/user/appeal?id=${task.task_id}`">申诉</van-button>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="申诉">
            <div class="list">
                <p class="tip">
                    <span class="title">提示：</span>
                    确定是辅助成功的订单，却被商家判定为失败，需要在40分钟内尽快申诉，防止超过申诉时间。
                </p>
                <div class="nothing" v-if="dList.length <= 0">
                    {{nothingText}}
                </div>
                <div class="item" v-for="(task, index) in dList" :key="index">
                    <div class="item-row">
                        <div class="work-id">任务ID：<span>{{task.task_id}}</span></div>
                        <div class="price">赏金：<span>{{task.price.toFixed(2)}}</span></div>
                    </div>
                    <div class="item-row">
                        <div class="timer">
                            <h3>{{task.formatTime}}</h3>
                            <van-tag v-if="task.user_hand_remark" type="success">{{task.user_hand_remark}}</van-tag>
                        </div>
                        <span class="task-status">{{task.status_des}}</span>
                    </div>
                </div>
            </div>
        </van-tab>
    </van-tabs>
    <tab-bar :active="1"></tab-bar>
</div>
</template>

<script>
import TabBar from '@/components/tab-bar.vue';
import common from '../components/common';
import Overtime from '@/components/overtime.vue';
import DateSelect from '@/components/date-select.vue';

export default {
    name: 'OrderList',
    components: { TabBar, Overtime, DateSelect },
    data() {
        return {
            formDate: '',
            active: 0,
            nothingText: '',
            aList: [],  // 任务中
            bList: [],  // 审核中
            cList: [],  // 已完成
            dList: [],  // 已放弃
            eList: [],  // 已失败
        };
    },
    methods: {
        getDate(date) {
            this.formDate = date;
            this.getTaskCenter();
        },
        removeTask(id) {
            // setTimeout(() => {
            //     this.aList = this.aList.filter((task) => task.task_id != id);
            //     // this.$fly.get('/api/Task/TaskOverTime', common.connectObj({
            //     //     taskId: id
            //     // }))
            // }, 0)
        },
        getTaskCenter() {
            this.$fly.get('/api/Task/GetTaskCenter', common.connectObj({
                dateTime: this.formDate,
            }))
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                this.nothingText = '暂无数据'
                if (returnCode == 100) {
                    /***
                    a、任务中：2
                    b、任务完成：1、5
                    c、任务失败：3、6
                    d、申诉：>=8
                    ***/
                    this.aList = data.filter((item) => item.status == 2);
                    let newData = data.map((item) => Object.assign({}, item, {
                        formatTime: this.$moment(item.create_time).format('YYYY/MM/DD HH:mm:ss')
                    }))
                    this.bList = newData.filter((item) => item.status == 1 || item.status == 5);
                    this.cList = newData.filter((item) => item.status == 3 || item.status == 6);
                    this.dList = newData.filter((item) => item.status >= 8);
                    // 测试数据
                    // this.aList = [{
                    //     create_time: "2019-10-19T02:00:41",
                    //     expire_time: 300,
                    //     id: "1185254410998124544",
                    //     price: 9.11,
                    //     qrcode_url: "weixin110.qq.com/e5",
                    //     status: 5,
                    //     status_des: "任务中",
                    //     task_id: "1185254383219249152",
                    //     tel: "18388064350",
                    //     type: 2,
                    //     user_hand_remark: "我已辅助成功"
                    // }]
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        gotoDetail(task) {
            this.$router.push({
                path: '/detail',
                query: task
            });       
        },
    },
    mounted() {
        // this.getTaskCenter()
    },
}
</script>

<style lang='less'>
.order-list {
    .van-tabs__wrap--scrollable .van-tab {
        flex: 1;
    }
    .van-tabs__content {
        padding: 16/11rem;
    }
    .van-button--info {
        background-color: #409eff;
        border-color: #409eff;
    }
    .van-tabs__line {
        background-color: #ffbe2d;
    }
    .list {
        .tip {
            font-size: 12/11rem;
            padding: 0px 0 15px 0;
            color: #888;
            .title {
                color: #f40;
            }
        }
        .nothing {
            text-align: center;
            font-size: 15/11rem;
            color: #ccc;
            padding: 20px 0;
        }
        .item {
            padding: 10px;
            // border: 1px solid #dedede;
            box-shadow: 0 0 6px #dcdcdc;
            margin-bottom: 10px;
            border-radius: 4px;
            font-size: 13/11rem;
            .item-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 5px 0;
                .work-id {
                    span {
                        font-size: 15/11rem;
                        color: #1989fa;
                    }
                }
                .price {
                    margin-left: 5px;
                    span {
                        font-size: 15/11rem;
                        font-weight: 700;
                    }
                }
                .timer {
                    h3 {
                        // font-size: 14/11rem;
                    }
                }
                .btn {
                    width: 120/11rem;
                }
                .task-status {
                    font-size: 16/11rem;
                    color: #f44;
                    padding: 8px;
                }
            }
            .btn-wp {
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>