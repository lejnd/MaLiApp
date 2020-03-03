<template>
<div class='partner-list bg-f5'>
    <topbar title="子合伙人管理"></topbar>
    <date-select @getDate="getDate" :init="-1"></date-select>
    <div class="search-wp">
        <van-search
            v-model="searchTel"
            placeholder="请输入用户手机号"
            show-action
            shape="round"
        >
            <van-button slot="action" @click="searchHandler" type="info" round size="small">搜索</van-button>
        </van-search>
    </div>
    <div class="list">
        <div class="nothing" v-if="nothing">
            <img src="../../assets/img/nothing.png" alt="">
            <p>暂无数据</p>
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <img class="icon" src="../../assets/img/man.png" alt="">
            <div class="info">
                <h3>账号：{{item.tel_des}}</h3>
                <p>团队会员：{{item.team_num}}</p>
                <p>做单数量：{{item.task_success_count}}</p>
                <p style="color: #f60;">奖励金额：{{item.award_money}}</p>
            </div>
            <div class="btn-group">
                <p><van-button class="btn" type="info" size="small" @click="openChild(item)">{{item.is_child_partner==1 ? '取消' : '开启'}}合伙人</van-button></p>             
            </div>
        </div>
        <van-pagination
            v-if="total > 5"
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
import common from '@/components/common';
import DateSelect from '@/components/date-select.vue';

const PAGE_SIZE = 5;

export default {
    name: 'PartnerList',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            currentPage: 1,
            searchTel: '',
            nothing: false,

            items: [],
            item: {},
            total: 0,
        };
    },
    computed: {
        pageCount() {
            return Math.ceil(this.total / PAGE_SIZE);
        }
    },
    methods: {
        getDate(date) {
            this.formDate = date;
            this.currentPage = 1;
            this.getList();
        },
        searchHandler() {
            this.currentPage = 1;
            this.getList();
        },
        getList() {
            // this.$toast.loading()
            this.items = [];
            this.$fly.get('/api/User/PartnerChildList',{
                dateTime: this.formDate,
                searchTel: this.searchTel,
                pageIndex: this.currentPage,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        let list = data.list || [];
                        this.total = data.total_num;
                        this.items = list.map(item => Object.assign({}, item, {
                            tel_des: item.tel.toString().substr(0, 3) + '****' + item.tel.toString().substr(7, 4),
                            formatTime: this.$moment(item.create_time).format('YYYY/MM/DD HH:mm:ss')
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
        openChild(item) {
            this.$dialog.confirm({
                title: '提示',
                message: `确定为 ${item.tel_des} ${item.is_child_partner==1 ? '取消' : '开启'}合伙人？`,
            }).then(() => {
                if (item.is_child_partner==1) {
                    this.$fly.get('/api/User/PartnerCancelChild',{
                        childTel: item.tel,
                    }).then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        if (returnCode == 100) {
                            this.getList();
                            this.$toast(returnMsg)
                        } else {
                            this.$toast(returnMsg)
                        }
                    })
                } else {
                    this.$fly.get('/api/User/PartnerOpenChild',{
                        childTel: item.tel,
                    }).then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        if (returnCode == 100) {
                            this.getList();
                            this.$toast(returnMsg)
                        } else {
                            this.$toast(returnMsg)
                        }
                    })
                }
            })
        },
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.partner-list {
    padding-bottom: 60/11rem;
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
                    &:last-child {
                        margin-top: 5px;
                    }
                }
            }
            .btn-group {
                p {
                    padding: 5px 0;
                    .btn {
                        width: 85px;
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