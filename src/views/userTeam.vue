<template>
<div class='user-team bg-f5'>
    <topbar title="我的团队"></topbar>
    <date-select @getDate="getDate"></date-select>
    <div class="search-wp">
        <van-search
            v-model="searchTel"
            placeholder="请输入下级的账号"
            show-action
            shape="round"
            @search="searchHandler"
        >
            <van-button slot="action" @click="searchHandler" type="info" round size="small">搜索</van-button>
        </van-search>
        <div class="deco">
            <span>直接下级：{{childNum}}</span>
            <span>团队总数：{{teamNum}}</span>
            <!-- <span class="handle">设置下级抽成</span> -->
        </div>
    </div>
    <div class="list">
        <div class="item" v-for="(item, index) in teamList" :key="index">
            <img class="icon" src="../assets/img/man.png" alt="">
            <div class="info">
                <h3>{{item.tel}}</h3>
                <h4 v-if="item.remak_name && item.remak_name!='0'">(备注：{{item.remak_name}})</h4>
                <h4>(抽佣值：{{item.rate}}%)</h4>
                <p>总做单：{{item.totaltaskcount}}</p>
                <p>成功做单：{{item.totaltask_success_count}}</p>
                <p>总成功率：{{item.success_rate}}</p>
                <p>下级总做单：{{item.subtotaltaskcount}}</p>
                <p>下级成功做单：{{item.subtotaltask_success_count}}</p>
                <p>下级总成功率：{{item.subsuccess_rate}}</p>
                <p>注册时间：{{item.register_time}}</p>
            </div>
            <div class="btn-group">
                <p><van-button type="primary" size="small" @click="rateSetting(index, 'remark')">备注账号</van-button></p>
                <p><van-button type="info" size="small" @click="rateSetting(index, 'rate')">重设利润</van-button></p>
            </div>
        </div>
        <van-pagination
            v-if="childNum > 50"
            v-model="currentPage" 
            :page-count="pageCount"
            @change="getTeamList"
            mode="simple"
        />
    </div>
    <van-dialog
        v-model="showRateSetting"
        show-cancel-button
        :before-close="beforeRateSettingClose"
    >
        <div class="team-dialog">
            <van-radio-group v-model="titleRadio">
                <van-cell-group>
                    <van-cell :title="`设置${item.tel}的抽成`" clickable @click="titleRadio = '1'">
                        <van-radio slot="right-icon" name="1" />
                    </van-cell>
                    <van-cell title="设置所有下级抽成" clickable @click="titleRadio = '2'">
                        <van-radio slot="right-icon" name="2" />
                    </van-cell>
                </van-cell-group>
            </van-radio-group>
            <van-cell-group>
                <van-field type="number" v-model="rate" label="抽佣值" placeholder="请输入抽佣值">
                    <span slot="right-icon">%</span>
                </van-field>
            </van-cell-group>
            <div class="deco">
                <!-- <p>预计您的接单价格：{{estimatedPrice}}</p>
                <p>预计该下级接单价格：{{subEstimatedPrice}}</p> -->
            </div>
        </div>
    </van-dialog>
    <van-dialog
        v-model="showRemarkSetting"
        show-cancel-button
        :before-close="beforeRemarkSettingClose"
    >
        <div class="team-dialog">
            <h3 class="title">设置：{{item.tel}}的备注</h3>
            <van-cell-group>
                <van-field v-model="remak_name" label="设置备注" placeholder="请输入备注">
                </van-field>
            </van-cell-group>
        </div>
    </van-dialog>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import DateSelect from '@/components/date-select.vue';
import common from '../components/common'
import { mapActions, mapGetters } from 'vuex';

const PAGE_SIZE = 50;

export default {
    name: 'UserTeam',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            searchTel: '',
            childNum: '',     // 直接下级总数
            teamNum: '',      // 团队总数
            teamList: [],
            showRateSetting: false,
            showRemarkSetting: false,
            item: {},
            estimatedPrice: 0,
            rate: 0,
            titleRadio: '1',
            remak_name: '',
            currentPage: 1,
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        subEstimatedPrice() {
            return (this.estimatedPrice - this.estimatedPrice * this.rate/100).toFixed(2);
        },
        pageCount() {
            return Math.ceil(this.childNum / PAGE_SIZE);
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        getDate(date) {
            this.formDate = date;
        },
        searchHandler() {
            this.currentPage = 1;
            this.getTeamList();
        },
        getTeamList() {
            this.$fly.get('/api/User/GetMyTeamDetail', common.connectObj({
                dateTime: this.formDate,
                searchTel: this.searchTel,
                pageIndex: this.currentPage,
                pageSize: PAGE_SIZE,
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    if (data) {
                        this.childNum = data.childNum;
                        this.teamNum = data.teamNum;
                        let list = data.myChilds || [];
                        this.teamList = list.map((item) => Object.assign({}, item, {
                            register_time: this.$moment(item.register_time).format('YYYY/MM/DD HH:mm:ss')
                        }));
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        },
        rateSetting(index, btnName) {
            this.item = this.teamList[index];
            if (btnName == 'remark') {
                this.showRemarkSetting = true;                
            }
            if (btnName == 'rate') {
                this.showRateSetting = true;
                this.rate = this.item.rate;
            }
        },
        beforeRateSettingClose(action, done) {
            if (action === 'confirm') {
                if (this.rate < 1) {
                    this.$notify('抽佣值不能小于1%');
                    return false;
                }
                this.$fly.get('/api/User/SetMySubAgentcommission', common.connectObj({
                    setTel: this.item.tel,
                    rate: this.rate,
                    isAll: this.titleRadio == '1' ? false : true,
                })).then((res) => {
                    let { returnCode, returnMsg } = res;
                    if (returnCode == 100) {
                        this.$toast(returnMsg)
                        this.getTeamList();
                        done();                    
                    } else {
                        this.$toast(returnMsg);
                        done(false);
                    }
                })
            } else {
                done();
            }
        },
        beforeRemarkSettingClose(action, done) {
            if (action === 'confirm') {
                this.$fly.get('/api/User/SetSubUserRemark', {
                    tel: this.item.tel,
                    remak_name: this.remak_name
                }).then((res) => {
                    let { returnCode, returnMsg } = res;
                    if (returnCode == 100) {
                        this.$toast(returnMsg)
                        this.getTeamList();
                        done();                    
                    } else {
                        this.$toast(returnMsg);
                        done(false);
                    }
                })
            } else {
                done();
            }
        },
    },
    mounted() {
        this.getTeamList();
        this.getUserInfo().then(() => {
            this.estimatedPrice =  this.userInfo.estimated_price;
        });
    },
}
</script>

<style lang='less'>
.user-team {
    .search-wp {
        .van-search {
            display: flex;
            align-items: center;
        }
        .deco {
            padding: 10px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: space-evenly;
            background-color: #f5f5f5;
            // .handle {
            //     color: #03a9f3;
            //     padding: 10px 15px;
            // }
        }
    }
    .list {
        .item {
            padding: 10px 15px;
            display: flex;
            align-items: center;
            background-color: #fff;
            margin-bottom: 2px;
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
    .team-dialog {
        .title {
            padding: 15px;
            font-size: 16/11rem;
            font-weight: 700;
            // background-color: #03a9f3;
            // color: #fff;
            // margin-bottom: 10px;
        }
        .deco {
            padding: 15px;
            color: #666;
            font-size: 12/11rem;
        }
    }
}
</style>