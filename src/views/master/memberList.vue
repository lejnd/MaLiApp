<template>
<div class='member-list bg-f5'>
    <topbar title="会员管理"></topbar>
    <date-select @getDate="getDate"></date-select>
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
    <div class="sort-wp">
        <div class="item" @click="sortHandler(1)">
            <span>注册时间</span>
            <!-- <van-icon v-if="registerTimeDescing" size="18" name="arrow-down" />
            <van-icon v-else size="18" name="arrow-up" /> -->
            <div class="arrow">
                <div class="up-arrow" :class="{ 'active': sort==1 && ascOrDesc==1 }"></div>
                <div class="down-arrow" :class="{ 'active': sort==1 && ascOrDesc==2 }"></div>
            </div>
        </div>
        <div class="item" @click="sortHandler(2)">
            <span>做单数量</span>
            <!-- <van-icon v-if="sucessCountDescing" size="18" name="arrow-down" />
            <van-icon v-else size="18" name="arrow-up" /> -->
            <div class="arrow">
                <div class="up-arrow" :class="{ 'active': sort==2 && ascOrDesc==1 }"></div>
                <div class="down-arrow" :class="{ 'active': sort==2 && ascOrDesc==2 }"></div>
            </div>
        </div>
        <div class="item" @click="sortHandler(3)">
            <span>等级排行</span>
            <!-- <van-icon v-if="levelDescing" size="18" name="arrow-down" />
            <van-icon v-else size="18" name="arrow-up" /> -->
            <div class="arrow">
                <div class="up-arrow" :class="{ 'active': sort==3 && ascOrDesc==1 }"></div>
                <div class="down-arrow" :class="{ 'active': sort==3 && ascOrDesc==2 }"></div>
            </div>
        </div>
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
                <p>成功做单：{{item.task_success_count}}</p>
                <p>总做单：{{item.total_taskcount}}</p>
                <!-- <p>下级总做单：{{item.subtotaltaskcount}}</p>
                <p>下级成功做单：{{item.subtotaltask_success_count}}</p>
                <p>下级总成功率：{{item.subsuccess_rate}}</p> -->
                <p>注册时间：{{item.register_time}}</p>
            </div>
            <div class="btn-group">
                <p><van-button class="btn" v-show="!telTemps.includes(item.tel)" v-if="item.open_master && userType==2" type="primary" size="small" @click="openChild(item)">开启合伙人</van-button></p>
                <p><van-button class="btn" v-if="is_child_partner!=1" type="info" size="small" @click="disableChild(item)">{{item.status==1 ? '禁用' : '启用'}}</van-button></p>
                <p><van-button class="btn" type="info" plain size="small" @click="setCode(item)">邀请码</van-button></p>                
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
    <van-dialog
        v-model="codeDialog"
        title="设置邀请码"
        show-cancel-button
        :before-close="beforeCodeDialogClose"
    >
        <div class="code-dialog">
            <van-cell-group>
                <van-field :value="item.tel_des" disabled label="下级账号">
                </van-field>
                <van-field :value="item.register_time" disabled label="注册时间">
                </van-field>
                <van-field v-model="invitation_code" label="邀请码" placeholder="请设置邀请码">
                </van-field>
            </van-cell-group>
        </div>
    </van-dialog>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
import DateSelect from '@/components/date-select.vue';

const PAGE_SIZE = 5;

export default {
    name: 'MemberList',
    components: { Topbar, DateSelect },
    data() {
        return {
            formDate: '',
            searchTel: '',
            sort: 2,   //  排序类型(1:注册时间 2:成功单数(默认) 3:层级排行)
            ascOrDesc: 2,   // 1:升序 2:降序(默认)
            currentPage: 1,
            items: [],
            item: {},
            total: 0,
            nothing: false,

            codeDialog: false,
            invitation_code: '',

            userType: '',
            is_child_partner: '',

            telTemps: [], // 缓存电话数组
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
        sortHandler(val) {
            this.sort = val;
            this.ascOrDesc == 1 ? this.ascOrDesc = 2 : this.ascOrDesc = 1;
            this.currentPage = 1;
            this.getList();
        },
        getList() {
            this.$toast.loading()
            this.items = [];
            this.$fly.get('/api/User/PartnerUserManagerList',{
                dateTime: this.formDate,
                searchTel: this.searchTel,
                sort: this.sort,
                ascOrDesc: this.ascOrDesc,
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
                this.$toast.clear();
                this.nothing = this.items.length == 0;
            })
        },
        openChild(item) {
            this.$dialog.confirm({
                title: '提示',
                message: `确定为 ${item.tel_des} 开启合伙人？`,
            }).then(() => {
                this.$fly.get('/api/User/PartnerOpenChild',{
                    childTel: item.tel,
                }).then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        this.telTemps.push(item.tel);
                        this.getList();
                        this.$toast(returnMsg)
                    } else {
                        this.$toast(returnMsg)
                    }
                })
            })
        },
        disableChild(item) {
            let status = item.status==1 ? 0 : 1
            this.$dialog.confirm({
                title: '提示',
                message: `确定${item.status==1 ? '禁用' : '启用'} ${item.tel_des} 吗？`,
            }).then(() => {
                this.$fly.get('/api/User/PartnerDisableChild',{
                    childTel: item.tel,
                    status: status
                }).then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        this.getList();
                        this.$toast(returnMsg)
                    } else {
                        this.$toast(returnMsg)
                    }
                })
            })
        },
        setCode(item) {
            this.item = item;
            this.codeDialog = true;
            this.invitation_code = item.invitation_code;
        },
        beforeCodeDialogClose(action, done) {
            if (action === 'confirm') {
                let re =  /^[0-9a-zA-Z]*$/;
                if (!re.test(this.invitation_code)) {
                    this.$notify('邀请码只能是数字或字母');
                    done(false);
                    return false;
                }
                if (this.invitation_code.length != 8) {
                    this.$notify('邀请码应该为8个字符');
                    done(false);
                    return false;
                }
                this.$fly.get('/api/User/PartnerSetInvitationCode', {
                    childTel: this.item.tel,
                    invitation_code: this.invitation_code,
                }).then((res) => {
                    let { returnCode, returnMsg } = res;
                    if (returnCode == 100) {
                        this.$toast(returnMsg)
                        this.getList();
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
        this.userType = this.$route.query.userType;
        this.is_child_partner =  this.$route.query.is_child_partner;
    },
}
</script>

<style lang='less'>
.member-list {
    padding-bottom: 60/11rem;
    .sort-wp {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        .item {
            padding: 10px;
            display: flex;
            align-items: center;
            font-size: 14/11rem;
            .arrow {
                position: relative;
                display: inline-block;
                margin-left: 5/11rem;
                height: 22/11rem;
                .down-arrow, .up-arrow {
                    display: block;
                    position: relative;
                    top: -2/11rem;
                    margin-left: 0;
                    width: 0;
                    height: 0;
                    border: 7/11rem solid transparent;
                    border-top-color: #999999;
                    &.active {
                        border-top-color: #f7b52c;
                    }
                }
                .up-arrow {
                    top: -4/11rem;
                    transform: rotate(180deg);
                }
            }
        }
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
    .code-dialog {
        padding: 15px 0;
    }
}
</style>