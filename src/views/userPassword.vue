<template>
<div class='user-password'>
    <topbar title="更改密码"></topbar>
    <div class="container">
        <div class="form-wp">
            <van-cell-group>
                <van-field v-model="password" type="password" placeholder="请输入新密码" />
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="password2" type="password" placeholder="再次确认密码" />
            </van-cell-group>
            <van-cell-group v-if="isForget==1">
                <van-field v-model="inputTel" type="tel" placeholder="输入手机号码" />
            </van-cell-group>
            <div class="deco" v-else>修改密码安全验证，验证码将发送到您的手机 {{myTel}}</div>
            <van-cell-group class="flex-box">
                <van-field
                    v-model="verifyCode"
                    type="tel"
                    placeholder="输入短信验证码"
                />
                <smscode-btn :btn-style="codeBtnStyle" :apiurl="isForget==1 ? '/api/User/RegisterVerifyCode?type=1' : '/api/User/ResetPasswordVerifyCode'" :mobile="isForget==1?inputTel:mobile"></smscode-btn>
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
                width: '150px',
                borderRadius: '2px',
                marginLeft: '10px',
                height: '50px',
            },
            isForget: '',
            verifyCode: '',
            password: '',
            password2: '',
            inputTel: '',
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
        user() {
            return Object.assign({}, this.userInfo, {
            })
        },
        myTel() {
            if (this.user.tel) {
                let tel = this.user.tel.toString();
                return tel.substr(0, 3) + '****' + tel.substr(7, 4)
            }
            return '**'
        },
        mobile() {
            return this.user.tel ? this.user.tel.toString() : '';
        },
        isTransfer() {
            return this.$route.query.transfer == 1;
        }
    },
    methods: {
        ...mapActions([
            'getUserInfo'
        ]),
        submit() {
            if (!this.password) {
                this.$notify('请输入新密码')
                return false
            }
            if (this.password != this.password2) {
                this.$notify('两次密码输入不一致')
                return false
            }
            if (!this.verifyCode) {
                this.$notify('请输入验证码')
                return false
            }
            this.$fly.post('/api/User/UpdatePassword', {
                userType: 0,
                tel: this.isForget == 1 ? this.inputTel : this.user.tel,
                verifyCode: this.verifyCode,
                password: this.password
            }).then((res) => {
                let { returnCode, returnMsg } = res;
                this.$toast(returnMsg);
                if (returnCode == 100) {
                    this.isForget == 1 ?
                    this.$router.replace(`/login?tel=${this.inputTel}`) :
                    this.$router.replace('/user');
                }
            })
        }
    },
    mounted() {
        this.isForget = this.$route.query.forget;
        if (this.isForget != '1') {
            this.getUserInfo()
        }
    },
}
</script>

<style lang='less'>
.user-password {
    .form-wp {
        padding-bottom: 40px;
        .tip {
            padding: 0 15px;
            background-color: #fe853a;
            color: #fff;
            font-size: 12/11rem;
            line-height: 36px;
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
                // width: 120px;
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