<template>
<div class='user-info'>
    <topbar title="个人资料"></topbar>
    <div class="container">
        <div class="form-wp">
            <div class="tip">请填写你的信息</div>
            <van-cell-group>
                <van-field :value="user.tel" label="账号" disabled placeholder="请输入用户名" />
                <van-field :value="user.parentid" label="我的上级" disabled placeholder="请输入用户名" />
                <van-field v-model="name" label="呢称" placeholder="请输入用户名" />
            </van-cell-group>
        </div>
        <div class="form-wp">
            <div class="tip">提现支付宝信息（以下请填写真实信息，账号和姓名要对应）</div>
            <van-cell-group>
                <van-field v-model="alipay_acount" label="支付宝账号" placeholder="请输入支付宝账号" />
                <van-field v-model="alipay_name" label="真实姓名" placeholder="请输入真实姓名" />
            </van-cell-group>
            <div class="deco">修改信息安全验证，验证码将发送到您的手机 {{myTel}}</div>
            <van-cell-group class="flex-box">
                <van-field
                    v-model="verifyCode"
                    type="tel"
                    placeholder="输入短信验证码"
                />
                <smscode-btn :btn-style="codeBtnStyle" :mobile="user.tel"></smscode-btn>
            </van-cell-group>
        </div>
        <div class="btn-group">
            <van-button class="btn" type="info" @click="submit">确定提交</van-button>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import SmscodeBtn from '@/components/smscode-button.vue';
import { mapActions, mapGetters } from 'vuex';
import common from '../components/common'

export default {
    name: 'UserInfo',
    components: { Topbar, SmscodeBtn },
    data() {
        return {
            codeBtnStyle: {
                backgroundColor: '#409eff',
                borderColor: '#409eff',
                width: '115px',
                borderRadius: '2px',
                marginLeft: '10px',
                height: '50px',
            },
            name: '',
            alipay_acount: '',
            alipay_name: '',
            verifyCode: '',
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return Object.assign({}, this.userInfo, {
                account_money: this.userInfo.account_money ? this.userInfo.account_money.toFixed(2) : 0.00,
            })
        },
        myTel() {
            if (this.user.tel) {
                let tel = this.user.tel.toString();
                return tel.substr(0, 3) + '****' + tel.substr(7, 4)
            }
            return '**'
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        submit() {
            if (!this.name) {
                this.$notify('请输入昵称')
                return false
            }
            if (!this.alipay_acount) {
                this.$notify('请输入支付宝账号')
                return false
            }
            if (!this.alipay_name) {
                this.$notify('请输入真实姓名')
                return false
            }
            this.$fly.post('/api/User/UpdateUserInfo', common.connectObj({
                name: this.name,
                alipay_acount: this.alipay_acount,
                alipay_name: this.alipay_name,
                verifyCode: this.verifyCode,
            })).then((res) => {
                let { returnMsg } = res;
                this.$toast(returnMsg);
                if (returnCode == 100) {
                    this.$router.push('/user');
                }
            })
        }
    },
    mounted() {
        this.getUserInfo().then(() => {
            this.name = this.user.name;
            this.alipay_name = this.user.alipay_name || '';
            this.alipay_acount = this.user.alipay_acount || '';
        })
    },
}
</script>

<style lang='less'>
.user-info {
    .form-wp {
        padding-bottom: 40px;
        .tip {
            padding: 10px 15px;
            background-color: #2ca5fd;
            color: #fff;
            font-size: 12/11rem;
        }
        .deco {
            padding: 10px 15px;
            background-color: #eee;
            color: #666;
            font-size: 12/11rem;
        }
        .van-cell {
            line-height: 30/11rem;
            font-size: 15/11rem;
        }
        .flex-box {
            display: flex;
            align-items: center;
            .codeBtn {
                width: 120px;
                margin-left: 10px;
                height: 46px;
            }
        }
    }
    .btn-group {
        padding: 0 15px;
        .btn {
            width: 100%;
            border-radius: 6px;
        }
    }
}
</style>