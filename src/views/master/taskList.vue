<template>
<div class='master-task bg-f5'>
    <topbar title="任务管理"></topbar>
    <date-select @getDate="getDate"></date-select>
    <!-- <div class="search-wp">
        <van-search
            v-model="searchTel"
            placeholder="请输入商家账号"
            show-action
            shape="round"
        >
            <van-button slot="action" @click="searchHandler" type="info" round size="small">搜索</van-button>
        </van-search>
    </div> -->
    <van-grid :border="false" :column-num="5">
        <van-grid-item>
            <span class="name">总任务</span>
            <span class="value">{{taskData.total_count}}</span>
        </van-grid-item>
        <van-grid-item>
            <span class="name" style="color:#1aad18;">已成功</span>
            <span class="value">{{taskData.success_count}}</span>
        </van-grid-item>
        <van-grid-item>
            <span class="name" style="color:#1aad18;">进行中</span>
            <span class="value">{{taskData.doing_count}}</span>
        </van-grid-item>
        <van-grid-item>
            <span class="name">失败</span>
            <span class="value">{{taskData.fail_count}}</span>
        </van-grid-item>
        <van-grid-item>
            <span class="name">申诉</span>
            <span class="value">{{taskData.complain_count}}</span>
        </van-grid-item>
    </van-grid>
    <van-tabs v-model="active" @change="tabChange">
        <van-tab title="进行中"></van-tab>
        <van-tab title="已成功"></van-tab>
        <van-tab title="失败"></van-tab>
        <van-tab title="申诉"></van-tab>
    </van-tabs>
    <van-list
        ref="vanlist"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
    >
        <div class="item" v-for="(task) in items" :key="task.id">
            <div class="item-row">
                <div class="work-id">
                    <p>账户：{{task.tel_des}}</p>
                    <p>任务ID：<span>{{task.task_id}}</span></p>
                </div>
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
    </van-list>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
import DateSelect from '@/components/date-select.vue';
export default {
    name: 'MasterList',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            searchTel: '',
            currentPage: 0,
            active: 0,
            items: [],
            taskData: {},

            loading: false,
            finished: false,
        };
    },
    computed: {
        pageTotal() {
            let eme = ['doing_count', 'success_count', 'fail_count', 'complain_count'];
            return this.taskData[eme[this.active]];
        }
    },
    methods: {
        getDate(date) {
            this.formDate = date;
            this.currentPage = 1;
            this.items = [];
            this.getData();
            this.getList();
        },
        // searchHandler() {
        //     this.currentPage = 1;
        //     this.items = [];
        //     this.getData();
        //     this.getList();
        // },
        onLoad() {
            console.log('onload');
            
            this.currentPage++;
            this.getList();
        },
        tabChange() {
            this.currentPage = 0;
            this.items = [];
            this.loading = false;
            this.finished = false;
            this.$refs.vanlist.check();
            // this.onLoad();
        },
        getData() {
            this.$fly.get('/api/Task/PartnerTaskStatistic',{
                dateTime: this.formDate,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.taskData = data;
                } else {
                    this.$toast(returnMsg)
                }
            })
        },
        getList() {
            this.$fly.get('/api/Task/PartnerTaskList',{
                dateTime: this.formDate,
                status: this.active + 1,
                pageIndex: this.currentPage,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        let list = data || [];
                        list = list.map(item => Object.assign({}, item, {
                            tel_des: item.tel.toString().substr(0, 3) + '****' + item.tel.toString().substr(7, 4),
                            formatTime: this.$moment(item.create_time).format('YYYY/MM/DD HH:mm:ss')
                        }));
                        this.items = this.items.concat(list);
                        this.loading = false;
                    }
                } else {
                    this.$toast(returnMsg)
                }
            }).finally(() => {
                if (this.items.length >= this.pageTotal) {
                    this.finished = true;
                }
            })
        },
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.master-task {
    .search-wp {
        .van-search {
            display: flex;
            align-items: center;
        }
    }
    .van-grid {
        .value {
            font-size: 12/11rem;
            padding-bottom: 8px;
        }
        .name {
            font-size: 14/11rem;
            font-weight: 700;
            margin-bottom: 3px;
        }
        .van-grid-item__content {
            padding: 8px;
        }
    }
    .van-list {
        padding: 10px;
        // .container {
        //     min-height: 80vh;
        // }
        .item {
            padding: 10px;
            background-color: #fff;
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