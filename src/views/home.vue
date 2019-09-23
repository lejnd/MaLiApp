<template>
<div class='home'>
    <!-- <van-notice-bar text="抢单后请马上进行扫码辅助，多次任务失败将会被封停账号！" left-icon="volume" /> -->
    <van-tabs class="blueStyle" v-model="active" @change="changeTab">
        <van-tab title="待抢订单">
            <div class="container">
                <div class="btn-group">
                    <div class="flex1">
                        <van-dropdown-menu>
                            <van-dropdown-item
                                v-model="region"
                                :options="regionOpt"
                                @change="regionChange"
                                @open="regionOpen"
                                @close="regionClose"
                            />
                        </van-dropdown-menu>
                    </div>
                    <van-button class="btn" icon="replay" :loading="replayBtnLoading" plain type="info" @click="replay" size="small">刷新任务</van-button>
                    <van-button class="btn" type="info" :disabled="autoBtnLoading" @click="autodo" size="small">自动抢单</van-button>
                    <!-- <van-button class="btn" type="info" @click="autoReplay" size="small">自动刷新</van-button> -->
                </div>
                <div class="list-wp">
                    <div class="nothing" v-if="tasks.length <= 0">
                        {{nothingText}}
                    </div>
                    <div class="item" v-for="(task, index) in tasks" :key="index">
                        <div class="item-row">
                            <div class="work-id">
                                <p class="order">任务ID：<span>{{task.task_id}}</span></p>
                                <p class="region"><span>{{task.province_name}}</span></p>
                            </div>
                            <div class="price">赏金：<span>{{task.price.toFixed(2)}}</span></div>
                        </div>
                        <div class="item-row">
                            <div class="timer">
                                <h3>剩余时间：</h3>
                                <overtime :create="task.create_time" :expire="task.expire_time" @timeover="remove(task.task_id)"></overtime>
                            </div>
                            <van-button class="btn" type="info" :loading="handleTaskLoading" @click="handleTask(task)">抢 单</van-button>
                        </div>
                    </div>
                </div>
            </div>
        </van-tab>
        <van-tab title="待完成订单">
            <div class="order-list">
                <!-- <date-select @getDate="getDate"></date-select> -->
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
                            <overtime :create="task.create_time" :expire="task.expire_time" @timeover="removeOrderTask(task.task_id)"></overtime>
                        </div>
                        <van-button class="btn" type="info" @click="gotoDetail(task)">做任务</van-button>
                    </div>
                </div>
            </div>
        </van-tab>
    </van-tabs>
    <!-- <router-link class="side-btn0" to="/user/provcode">
        <span>设<br>置<br>归<br>属<br>地</span>
    </router-link> -->
    <router-link class="side-btn" to="/course">
        <span>接<br>单<br>教<br>程</span>
    </router-link>
    <van-dialog
        v-model="showAutodo"
        title="正在抢单..."
        confirm-button-text="取消自动抢单"
        @confirm="cancelAutodo"
    >
        <div class="show-autodo">
            <van-loading type="spinner" />
        </div>
    </van-dialog>
    <tab-bar :active="0"></tab-bar>
</div>
</template>

<script>
import TabBar from '@/components/tab-bar.vue';
import Overtime from '@/components/overtime.vue';
import { mapGetters, mapActions } from 'vuex';
import common from '../components/common'
import DateSelect from '@/components/date-select.vue';
import config from '../config';
import { log } from 'util';

const TEXT = '接单会员接单请根据自己所在省份接对应省份订单，同省份订单大量不填资料。各级接单会员务必实事求是接对应省份订单，同省份辅助，发展本省资源，吃肉！务必实事求是选择自己所在地省份，这样才能保证单量稳定，价格稳定。'

export default {
    name: 'Home',
    components: { TabBar, Overtime, DateSelect },
    data() {
        return {
            nothingText: '',
            showAutodo: false,
            autodoTimer: -1,
            active: 0,
            aList: [],
            autoBtnLoading: true,
            replayBtnLoading: false,
            handleTaskLoading: false,
            region: '0',
            regionOpt: []
        };
    },
    computed: {
        ...mapGetters([
            'tasks',
            'userInfo',
        ])
    },
    methods: {
        ...mapActions([
            'getTasks',
            'removeTask',
            'getUserInfo'
        ]),
        getTasksHandler(toast) {
            this.getTasks(this.region).then(() => {
                toast ? toast.clear() : false;
                this.nothingText = TEXT;
            }).catch(() => {
                toast ? toast.clear() : false;
                this.$toast('刷新失败，请重试')
            })
        },
        replay() {
            const toast = this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                message: '倒计时 3 秒'
            });
            let second = 3;
            const timer = setInterval(() => {
                second--;
                if (second) {
                    toast.message = `倒计时 ${second} 秒`;
                } else {
                    clearInterval(timer);
                    this.getTasksHandler(toast)
                }
            }, 500);
        },
        autodo() {
            if (this.region == '0') {
                this.$notify('请先选择归属地！');
                return false;
            }
            this.autoBtnLoading = true;
            this.showAutodo = true;
            this.autodoTimer = setInterval(() => {
                this.getAutoTask();
            }, 3000)
        },
        cancelAutodo() {
            clearInterval(this.autodoTimer);
            this.showAutodo = false;
            this.autoBtnLoading = false;
        },
        autoReplay() {
        },
        gotoDetail(task) {
            this.$router.push({
                path: '/detail',
                query: task
            });       
        },
        handleTask(task) {
            let canHandle = task.province_code == '0' || task.province_code == '1';
            if (!canHandle && task.province_code != this.userInfo.provcode) {
                this.$dialog.alert({
                    title: '提示',
                    message: '由于辅助市场规则，暂时只能接本省订单',
                    // confirmButtonText: '继续'
                })
                // .then(() => {
                //     this.handleTaskLoading = true;
                //     this.getTaskByHand(task.task_id).then(() => {
                //         this.handleTaskLoading = false;
                //         this.$router.push({
                //             path: '/detail',
                //             query: task
                //         });       
                //     })
                // })
            } else {
                this.handleTaskLoading = true;
                this.getTaskByHand(task.task_id).then(() => {
                    this.handleTaskLoading = false;
                    this.$router.push({
                        path: '/detail',
                        query: task
                    });       
                })
            }
        },
        remove(id) {
            setTimeout(() => {
                this.removeTask(id);
                // this.$fly.get('/api/Task/TaskOverTime', common.connectObj({
                //     taskId: id,
                // }))
            }, 0)
        },
        getAutoTask() {
            this.$fly.get('/api/Task/GetAutoTask', common.connectObj({
                provinceCode: this.region,
            })).then((res) => {
                if (!this.autodoTimer) return;
                let { returnCode, returnMsg, data } = res;
                if (data.task_id) {
                    clearInterval(this.autodoTimer);
                    this.$router.push({
                        path: `/detail`,
                        query: data,
                    });
                }
            })
        },
        getTaskByHand(id) {
            return this.$fly.get('/api/Task/GetTaskByHand', common.connectObj({
                taskId: id,
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    return Promise.resolve();
                } else {
                    this.$toast('领取任务数量超过限制');
                    return Promise.reject('领取任务数量超过限制');
                }
            })
        },

        // 待完成订单 start
        // getDate(date) {
        //     this.formDate = date;
        //     this.getTaskCenter();
        // },
        removeOrderTask(id) {
            setTimeout(() => {
                this.aList = this.aList.filter((task) => task.task_id != id);
                console.log(this.aList)
            }, 0);
            // this.$fly.get('/api/Task/TaskOverTime', common.connectObj({
            //     taskId: id
            // }))
        },
        getTaskCenter() {
            this.nothingText = '';
            this.$fly.get('/api/Task/GetTaskCenter', common.connectObj({
                dateTime: this.$moment(new Date()).format('YYYY-MM-DD'),
            }))
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                this.nothingText = '暂无数据'
                if (returnCode == 100) {
                    this.aList = data.filter((item) => item.task_status == 1);
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        // 待完成订单 end

        getRegionList() {
            return this.$fly.get('/api/Task/GetProvince')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.regionOpt = data.map(item => ({
                        text: item.province_name,
                        value: item.province_code,
                    }))
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        changeTab() {
            if (this.active == 0) {
                this.replay();
            }
            if (this.active == 1) {
                this.getTaskCenter();
                // this.getDate();
            }
        },
        regionChange() {
            localStorage.setItem('region', this.region);
            this.getTasksHandler();
        },
        regionOpen() {
            document.body.style['overflow-y'] = 'hidden'
        },
        regionClose() {
            document.body.style['overflow-y'] = 'auto'
        }
    },
    created () {
        this.getUserInfo().then(() => {
            if (this.userInfo.provcode == 0) {
                this.$router.replace('/user/provcode');
            } else {
                this.region = this.userInfo.provcode.toString();
                this.getTasksHandler()
            }
        })
    },
    mounted() {
        this.getRegionList();
        this.autoBtnLoading = false;
    },
}
</script>

<style lang='less'>
@my_blue: #03a9f3;
@my_yellow: #FFC107;
.home {
    .van-notice-bar {
        font-size: 12/11rem;
        padding: 0 16/11rem;
        .van-notice-bar__left-icon, .van-notice-bar__right-icon {
            font-size: 12/11rem;
            min-width: 16/11rem;
        }
    }
    .van-dropdown-menu {
        height: 40px;
    }
    .van-hairline--top-bottom::after {
        border: 0;
    }
    .van-dropdown-menu__item {
        justify-content: flex-start;
        .van-dropdown-menu__title {
            color: #767676;
            font-size: 13/11rem;
            // padding: 0 8px 0 0;
        }
    }
    .container {
        padding: 16/11rem;
        .btn-group {
            display: flex;
            .flex1 {
                flex: 1;
            }
            .btn {
                width: 90px;
                margin-right: 10px;
                border-radius: 6px;
                height: 38px;
                box-shadow: 0 0 8px #c4dbff;
                border: 0;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .list-wp {
            padding: 10/11rem 0;
            .nothing {
                text-align: center;
                font-size: 15/11rem;
                color: #ccc;
                padding: 20px 0;
            }
            .item {
                padding: 2px 15px;
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
                        .order span {
                            font-size: 15/11rem;
                            color: #1989fa;
                        }
                        .region {
                            margin-top: 8px;
                            font-size: 10/11rem;
                            span {
                                background-color: #03a9f3;
                                padding: 3px 8px;
                                border-radius: 20px;
                                color: #fff;
                            }
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
                }
            }
        }
    }
    .show-autodo {
        padding: 30px 0;
        display: flex;
        justify-content: center;
    }
    .side-btn0 {
        position: fixed;
        left: 0;
        bottom: 180px;
        background-color: @my_blue;
        padding: 10px 7px;
        border-radius: 0 6px 6px 0;
        font-size: 12px;
        color: #fffbe8;
        box-shadow: 0 0 6px #aaa;
    }
    .side-btn {
        position: fixed;
        left: 0;
        bottom: 80px;
        background-color: @my_blue;
        padding: 10px 7px;
        border-radius: 0 6px 6px 0;
        font-size: 12px;
        color: #fffbe8;
        box-shadow: 0 0 6px #aaa;
    }
    .order-list {
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
            }
        }
    }
}
</style>