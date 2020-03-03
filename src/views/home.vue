<template>
<div class='home'>
    <!-- <van-notice-bar text="抢单后请马上进行扫码辅助，多次任务失败将会被封停账号！" left-icon="volume" /> -->
    <van-tabs class="blueStyle" v-model="active" @change="changeTab">
        <van-tab title="待抢订单(高价)">
        </van-tab>
        <van-tab title="一扫而过通道(筛选)">
        </van-tab>
    </van-tabs>
    <van-notice-bar
        v-if="scrollNotice"
        :text="scrollNotice"
        left-icon="volume-o"
    />
    <div class="container">
        <!-- <div class="header-row">
            <van-tag mark type="warning">{{taskTotal ? `${taskTotal}单待抢` : '暂无订单'}}</van-tag>
            <van-button v-if="active==0" class="btn" type="info" plain round :disabled="replayBtnLoading" @click="getMyCityList" size="mini">获取本省订单[<span class="strong">{{localnum}}单</span>]</van-button>
            <p v-if="active==0" class="deco">大概率不填资料</p>
        </div> -->
        <div class="btn-group">
            <div class="flex1">
                <van-dropdown-menu v-if="active==0">
                    <van-dropdown-item
                        v-model="region"
                        :options="regionOpt"
                        @change="regionChange"
                        @open="regionOpen"
                        @close="regionClose"
                    />
                </van-dropdown-menu>
            </div>
            <van-button class="btn" icon="replay" :loading="replayBtnLoading" plain type="info" @click="active==0 ? getTasksHandler() : getScreenTaskHandler()" size="mini">刷新任务</van-button>
            <van-button class="btn" type="info" :disabled="autoBtnLoading" @click="autodo" size="mini">自动抢单</van-button>
            <!-- <van-button class="btn" type="info" @click="autoReplay" size="small">自动刷新</van-button> -->
        </div>
        <div class="list-wp">
            <div class="nothing" v-if="nothing">
                {{nothingText}}
            </div>
            <div class="item" v-for="(task, index) in taskList" :key="task.task_id">
                <div class="item-row">
                    <div class="work-id">
                        <p class="order">任务ID：<span>{{task.taskidDisplay}}</span></p>
                        <p class="region">
                            <span>{{task.province_name}}</span>
                            <span v-if="active==0" style="background-color:#f80;">{{task.direct==0 ? '定向' : '非定向'}}</span>
                        </p>
                    </div>
                    <div class="price">赏金：<span>{{task.price}}</span></div>
                </div>
                <div class="item-row">
                    <div class="timer">
                        <h3>剩余时间：</h3>
                        <overtime :create="task.create_time" :expire="task.expire_time" @timeover="remove(task.task_id)"></overtime>
                    </div>
                    <van-button class="btn" type="info" :loading="handleTaskLoading==index" @click="handleTask(task,index)">抢 单</van-button>
                </div>
            </div>
        </div>
    </div>
    <!-- <div class="order-list">
        <date-select @getDate="getDate"></date-select>
        <div class="nothing" v-if="aList.length <= 0">
            {{nothingText}}
        </div>
        <div class="item" v-for="task in aList" :key="task.id">
            <div class="item-row">
                <div class="work-id">任务ID：<span>{{task.task_id}}</span></div>
                <div class="price">赏金：<span>{{task.price}}</span></div>
            </div>
            <div class="item-row">
                <div class="timer">
                    <h3>剩余时间：</h3>
                    <overtime :create="task.create_time" :expire="task.expire_time" @timeover="removeOrderTask(task.task_id)"></overtime>
                </div>
                <van-button class="btn" type="info" @click="gotoDetail(task)">做任务</van-button>
            </div>
        </div>
    </div> -->
    <router-link class="side-btn00" to="/user/provcode">
        <span>获<br>取<br>定<br>位</span>
    </router-link>
    <div class="side-btn0" @click="getNotice">
        <span>公<br>告</span>
    </div>
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
import { setTimeout } from 'timers';

export default {
    name: 'Home',
    components: { TabBar, Overtime, DateSelect },
    data() {
        return {
            nothing: false,
            nothingText: '暂无订单',
            showAutodo: false,
            autodoTimer: -1,
            active: 0,
            aList: [],
            autoBtnLoading: true,
            replayBtnLoading: false,
            handleTaskLoading: null,
            region: '0',
            regionOpt: [],
            scrollNotice: '',
        };
    },
    computed: {
        ...mapGetters([
            'tasks',
            'userInfo',
            'taskTotal',
            'localnum',
            'provcodeTemp'
        ]),
        taskList() {
            let list = this.tasks || [];
            return list.map(item => Object.assign({}, item, {
                price: item.price.toFixed(2),
                taskidDisplay: item.task_id ? item.task_id.slice(0, -4)+'****' : '',
            }))
        }
    },
    methods: {
        ...mapActions([
            'getTasks',
            'getScreenTaskList',
            'removeTask',
            'getUserInfo',
            'setProvcodeTemp',
        ]),
        getTasksHandler() {
            this.nothing = false;
            this.replayBtnLoading = true;
            this.getTasks(this.region).then(() => {
                this.nothing = this.tasks.length == 0;
                if (this.tasks.length == 0) {
                    this.getNothingText()
                }
            }).catch(() => {
                this.$toast('刷新失败，请重试')
            }).finally(() => {
                setTimeout(() => {
                    this.replayBtnLoading = false;
                }, 1500)
            })
        },
        getScreenTaskHandler() {
            this.nothing = false;
            this.replayBtnLoading = true;
            this.getScreenTaskList().then(() => {
                this.nothing = this.tasks.length == 0;
                if (this.tasks.length == 0) {
                    this.getNothingText()
                }
            }).catch(() => {
                this.$toast('刷新失败，请重试')
            }).finally(() => {
                this.replayBtnLoading = false;
            })
        },
        autodo() {
            // if (this.region == '0') {
            //     this.$notify('请先选择归属地！');
            //     return false;
            // }
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
        handleTask(task, index) {
            // let canHandle = task.province_code == '0' ||
            //     task.province_code == '1' ||
            //     task.province_code == '710000' ||
            //     task.province_code == '810000' ||
            //     task.province_code == '820000' || task.province_code == '990000';
            // if (!canHandle && task.province_code != this.userInfo.provcode) {
            //     this.$dialog.alert({
            //         title: '提示',
            //         message: '非同省订单，出现填资料几率变大，确定接单？',
            //         showCancelButton: true,
            //         // confirmButtonText: ''
            //     })
            //     .then(() => {
            //         this.handleTaskLoading = index;
            //         this.getTaskByHand(task.task_id).then(() => {
            //             this.handleTaskLoading = null;
            //             this.$router.push({
            //                 path: '/detail',
            //                 query: task
            //             });       
            //         }).catch(() => {
            //             this.handleTaskLoading = null;
            //         })
            //     })
            // } else {
            //     this.handleTaskLoading = index;
            //     this.getTaskByHand(task.task_id).then(() => {
            //         this.handleTaskLoading = null;
            //         this.$router.push({
            //             path: '/detail',
            //             query: task
            //         });       
            //     }).catch(() => {
            //         this.handleTaskLoading = null;
            //     })
            // }
            this.handleTaskLoading = index;
            this.getTaskByHand(task.task_id).then(() => {
                this.handleTaskLoading = null;
                this.$router.push({
                    path: '/detail',
                    query: task
                });       
            }).catch(() => {
                this.handleTaskLoading = null;
            })
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
            let apiName = this.active==0 ? 'GetAutoTask' : 'GetScreenAutoTask';
            this.$fly.get(`/api/Task/${apiName}`, common.connectObj({
                provinceCode: this.region,
            })).then((res) => {
                if (!this.autodoTimer) return;
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data.task_id) {
                        clearInterval(this.autodoTimer);
                        this.$router.push({
                            path: `/detail`,
                            query: data,
                        });
                    }
                } else {
                    this.cancelAutodo();
                    this.$toast(returnMsg);
                }
            }).catch(() => {
                this.cancelAutodo();
                this.$toast('操作失败，请重试');
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
                    this.$toast(returnMsg);
                    return Promise.reject(returnMsg);
                }
            })
        },

        // 待完成订单 start
        // getDate(date) {
        //     this.formDate = date;
        //     this.getTaskCenter();
        // },
        // removeOrderTask(id) {
        //     setTimeout(() => {
        //         this.aList = this.aList.filter((task) => task.task_id != id);
        //     }, 0);
        //     // this.$fly.get('/api/Task/TaskOverTime', common.connectObj({
        //     //     taskId: id
        //     // }))
        // },
        // getTaskCenter() {
        //     this.nothing = false;
        //     this.$fly.get('/api/Task/GetTaskCenter', common.connectObj({
        //         dateTime: this.$moment(new Date()).format('YYYY-MM-DD'),
        //     }))
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         this.nothingText = '暂无数据'
        //         if (returnCode == 100) {
        //             let list = data.filter((item) => item.task_status == 1);
        //             this.aList = list.map(item => Object.assign({}, item, {
        //                 price: item.price.toFixed(2),
        //             }))
        //             this.nothing = this.aList.length == 0
        //         } else {
        //             this.$toast(returnMsg);
        //         }
        //     })
        // },
        // 待完成订单 end

        // getRegionList() {
        //     return this.$fly.get('/api/Task/GetProvince')
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.regionOpt = data.map(item => ({
        //                 text: item.province_name,
        //                 value: item.province_code,
        //             }))
        //         } else {
        //             this.$toast(returnMsg);
        //         }
        //     })
        // },
        changeTab() {
            if (this.active == 0) {
                this.getTasksHandler();
            }
            if (this.active == 1) {
                // this.getTaskCenter();
                // this.getDate();
                this.getScreenTaskHandler();
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
        },
        // 公告
        getNotice() {
            return this.$fly.get('/api/Task/GetNotice', { type: 1 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$dialog.alert({
                        title: '公告',
                        message: data.content,
                        messageAlign: 'left',
                        confirmButtonText: '了解了'
                    })
                }             
            })
        },
        // 获取首页空白文字
        getNothingText() {
            // if (this.nothingText) return false;
            return this.$fly.get('/api/Task/GetNotice', { type: 4 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.nothingText = data.content;
                }             
            })
        },
        // 获取首页滚动通知
        getScrollNotice() {
            if (this.scrollNotice) return false;
            return this.$fly.get('/api/Task/GetNotice', { type: 9 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.scrollNotice = data.content;
                }             
            })
        },
        // 获取本省订单
        // getMyCityList() {
        //     // 如果本地缓存的临时provcode存在，就不再请求getUserInfo
        //     if (this.provcodeTemp) {
        //         this.region = this.provcodeTemp;
        //         this.getTasksHandler()
        //     } else {
        //         const isRedis = true;
        //         this.getUserInfo(isRedis).then(() => {
        //             if (this.userInfo.provcode == 0) {
        //                 this.$router.replace('/user/provcode');
        //             } else {
        //                 this.region = this.userInfo.provcode.toString();
        //                 this.setProvcodeTemp(this.region);
        //                 this.getTasksHandler()
        //             }
        //         })
        //     }
        // }
        getMyCityList() {
            // 如果本地缓存的临时provcode存在，就不再请求getUserInfo
            this.region = this.userInfo.provcode.toString();
            this.getTasksHandler()
        }
    },
    created () {
        
    },
    mounted() {
        // this.getRegionList();
        this.getTasksHandler()
        this.autoBtnLoading = false;
        this.getScrollNotice();
        if (Object.keys(this.userInfo).length == 0) {
            this.getUserInfo().then(() => {
                this.active = this.userInfo.active;
                if (this.userInfo.provcode == 0) {
                    this.$router.replace('/user/provcode');
                } else {
                    this.regionOpt = [
                        { text: '全部', value: '0' },
                        { text: '平台认证不填资料', value: '1' },
                        ...config.regions.filter(item => item.value == this.userInfo.provcode),
                        { text: '其他', value: '-1' }
                    ]
                }
            })
        } else {
            this.regionOpt = [
                { text: '全部', value: '0' },
                { text: '平台认证不填资料', value: '1' },
                ...config.regions.filter(item => item.value == this.userInfo.provcode),
                { text: '其他', value: '-1' }
            ]
        }
        // 公告alert
        // this.getNotice()
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
            padding: 0 8px 0 0;
        }
    }
    .container {
        padding: 16/11rem;
        .header-row {
            display: flex;
            align-items: center;
            padding-bottom: 8px;
            .btn {
                margin-left: 15/11rem;
                padding: 0 10px;
                border-width: 0;
                line-height: 5px;
                .strong {
                    color: #f40;
                }
            }
            .deco {
                font-size: 10/11rem;
                color: #999;
            }
        }
        .btn-group {
            display: flex;
            align-items: center;
            .flex1 {
                flex: 1;
            }
            .btn {
                padding: 0 8px;
                margin-right: 10px;
                border-radius: 6px;
                height: 30px;
                box-shadow: 0 0 8px #c4dbff;
                border: 0;
                min-width: 70px;
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
                padding-top: 10px;
                // border: 1px solid #dedede;
                box-shadow: 0 0 6px #dcdcdc;
                margin-bottom: 10px;
                border-radius: 4px;
                font-size: 13/11rem;
                .item-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    // border-bottom: 1px solid #f5f5f5;
                    // padding: 10px 0;
                    padding-bottom: 10px;
                    &:last-child {
                        border-bottom: 0;
                    }
                    .work-id {
                        .order span {
                            font-size: 14/11rem;
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
                                margin-right: 5px;
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
                        display: flex;
                        align-items: center;
                        h3 {
                            font-size: 12/11rem;
                        }
                        .overtime span {
                            font-size: 15/11rem;
                        }
                    }
                    .btn {
                        width: 27vw;
                        min-width: 70/11rem;
                        height: 32/11rem;
                        line-height: 30/11rem;
                        font-size: 13/11rem;
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
    .side-btn00 {
        position: fixed;
        left: 0;
        bottom: 244px;
        background-color: @my_blue;
        padding: 10px 7px;
        border-radius: 0 6px 6px 0;
        font-size: 12px;
        color: #fffbe8;
        box-shadow: 0 0 6px #aaa;
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