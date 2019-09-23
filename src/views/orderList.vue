<template>
<div class='order-list'>
    <date-select @getDate="getDate"></date-select>
    <van-tabs v-model="active">
        <van-tab title="任务中">
            <div class="list">
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
                        </div>
                        <van-button class="btn" type="info" @click="gotoDetail(task)">做任务</van-button>
                    </div>
                </div>
            </div>
        </van-tab>
        <!-- <van-tab title="审核中">
            <div class="list">
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
                        </div>
                        <span class="task-status">{{task.task_status_des}}</span>
                    </div>
                </div>
            </div>
        </van-tab> -->
        <van-tab title="任务完成">
            <div class="list">
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
                        </div>
                        <span class="task-status">{{task.task_status_des}}</span>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="任务失败">
            <div class="list">
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
                        </div>
                        <span class="task-status">{{task.task_status_des}}</span>
                    </div>
                </div>
            </div>
        </van-tab>
        <!-- <van-tab title="已失败">
            <div class="list">
                <div class="nothing" v-if="eList.length <= 0">
                    {{nothingText}}
                </div>
                <div class="item" v-for="(task, index) in eList" :key="index">
                    <div class="item-row">
                        <div class="work-id">任务ID：<span>{{task.task_id}}</span></div>
                        <div class="price">赏金：<span>{{task.price.toFixed(2)}}</span></div>
                    </div>
                    <div class="item-row">
                        <div class="timer">
                            <h3>{{task.formatTime}}</h3>
                        </div>
                        <span class="task-status">{{task.task_status_des}}</span>
                    </div>
                </div>
            </div>
        </van-tab> -->
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
            setTimeout(() => {
                this.aList = this.aList.filter((task) => task.task_id != id);
                // this.$fly.get('/api/Task/TaskOverTime', common.connectObj({
                //     taskId: id
                // }))
            }, 0)
        },
        getTaskCenter() {
            this.$fly.get('/api/Task/GetTaskCenter', common.connectObj({
                dateTime: this.formDate,
            }))
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                this.nothingText = '暂无数据'
                if (returnCode == 100) {
                    this.aList = data.filter((item) => item.task_status == 1);
                    let newData = data.map((item) => Object.assign({}, item, {
                        formatTime: this.$moment(item.create_time).format('YYYY/MM/DD HH:mm:ss')
                    }))
                    this.bList = newData.filter((item) => item.task_status == 2);
                    this.cList = newData.filter((item) => item.task_status == 3);
                    this.dList = newData.filter((item) => item.task_status == 4);
                    this.eList = newData.filter((item) => item.task_status == 5);
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
        .nothing {
            text-align: center;
            font-size: 15/11rem;
            color: #ccc;
            padding: 20px 0;
        }
        .item {
            padding: 10px 15px;
            // border: 1px solid #dedede;
            box-shadow: 0 0 6px #dcdcdc;
            margin-bottom: 10px;
            border-radius: 4px;
            font-size: 13/11rem;
            .item-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #dedede;
                padding: 10px 0;
                &:last-child {
                    border-bottom: 0;
                }
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
        }
    }
}
</style>