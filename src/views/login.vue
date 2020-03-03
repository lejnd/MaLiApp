<template>
<div class='etc-apply'>
    <div class="banner">
        <img src="../assets/img/etc-banner.png" alt="">
    </div>
    <van-tabs v-model="activeName" @change="changeTab">
        <van-tab title="登录" name="a">
            <div class="form-wp">
                <van-cell-group>
                    <van-field
                        v-model="tel"
                        type="tel"
                        placeholder="手机号"
                        left-icon="graphic"
                    />
                </van-cell-group>
                <van-cell-group class="flex-box" v-if="loginType==1">
                    <van-field
                        v-model="verifyCode"
                        type="tel"
                        placeholder="短信验证码"
                        left-icon="envelop-o"
                    />
                    <smscode-btn :btn-style="codeBtnStyle" :mobile="tel" @getCode="getCode"></smscode-btn>
                </van-cell-group>
                <van-cell-group v-else>
                    <van-field
                        v-model="password"
                        type="password"
                        placeholder="密码"
                        left-icon="lock"
                    />
                </van-cell-group>
                <van-cell-group class="flex-box" v-if="loginType==0 && showImgCodeInput">
                    <van-field
                        v-model="imgCode"
                        placeholder="图形验证码"
                        left-icon="photo-o"
                    />
                    <img class="img-code" src="/api/User/ValidateCode" alt="看不清？点击更换" onclick="this.src = this.src + '?'">
                </van-cell-group>
            </div>
            <div class="access">
                <van-checkbox v-model="accessChecked">
                    已阅读并同意
                </van-checkbox>
                <span class="deco" @click="showAuthDialog=true">《闪电任务平台注册协议》</span>
            </div>
            <div class="deco-btn">
                <!-- <span @click="loginTypeSwich">{{loginTypeText}}<van-icon name="exchange"/></span> -->
                <span @click="gotoPassword">忘记密码</span>
            </div>
            <!-- <van-button class="submit deco-btn" icon="exchange" type="primary">{{loginTypeText}}</van-button> -->
            <van-button class="submit" type="primary" @click="submitLogin">登 录</van-button>
        </van-tab>
        <van-tab title="注册" name="b">
            <div class="form-wp">
                <van-cell-group>
                    <van-field
                        v-model="tel"
                        type="tel"
                        placeholder="手机号"
                        left-icon="graphic"
                    />
                </van-cell-group>
                <van-cell-group class="flex-box">
                    <van-field
                        v-model="verifyCode"
                        type="tel"
                        placeholder="验证码"
                        left-icon="envelop-o"
                    />
                    <smscode-btn :btn-style="codeBtnStyle" :mobile="tel" @getCode="getCode"></smscode-btn>
                </van-cell-group>
                <van-cell-group>
                    <van-field
                        v-model="password"
                        type="password"
                        placeholder="密码"
                        left-icon="lock"
                    />
                </van-cell-group>
                <van-cell-group>
                    <van-field
                        v-model="invitationCode"
                        placeholder="邀请码"
                        left-icon="friends-o"
                    />
                </van-cell-group>
            </div>
            <!-- <div class="deco">
                <van-icon name="warning-o" />
                <span>办理后会有1-7天的审核期，请您耐心等待，关注“ 飞讯商城 ”公众号随时查看办理进度</span>
            </div> -->
            <van-button class="submit" type="primary" @click="submitRegist">注 册</van-button>
        </van-tab>
    </van-tabs>
    <van-dialog
        v-model="showAuthDialog"
        title="《闪电任务平台注册协议》">
        <div class="auth-agreement" v-html="authAgreement"></div>
    </van-dialog>
</div>
</template>

<script>
import SmscodeBtn from '@/components/smscode-button.vue';
import common from '@/components/common';
export default {
    name: 'EtcApply',
    components: { SmscodeBtn },
    data() {
        return {
            activeName: 'a',
            codeBtnStyle: {
                backgroundColor: '#409eff',
                borderColor: '#409eff',
                width: '150px',
                borderRadius: '10px',
                marginLeft: '10px',
                height: '50px',
            },
            password: '',
            invitationCode: '',
            tel: '',
            verifyCode: '',
            userType: 0,  // 0.代理商；1.卡商
            loginType: 0, // 0.密码登录； 1.验证码登录
            showImgCodeInput: false,
            // showImgCode: false,
            imgCode: '',
            showAuthDialog: false,
            accessChecked: false,
            authAgreement: common.authAgreement()
        };
    },
    computed: {
        loginTypeText() {
            return this.loginType == 1 ? '使用密码登录' : '使用验证码登录';
        }
    },
    methods: {
        changeTab() {
            this.password = '';
            this.verifyCode = '';
            this.imgCode = '';
        },
        getCode(imgCode) {
            this.imgCode = imgCode;
        },
        // beforeClose(action, done) {
        //     if (action === 'confirm') {
        //         if (!this.imgCode) {
        //             this.$notify('请输入图形验证码')
        //             done(false);
        //             return false
        //         }
        //         this.$fly.get('/api/User/RegisterVerifyCode', {
        //             tel: this.tel,
        //             imgCode: this.imgCode,
        //         }).then((res) => {
        //             let { returnCode, returnMsg, data } = res;
        //             if (returnCode == 100) {
        //                 this.$toast(returnMsg);
        //                 done();
        //             } else {
        //                 this.$notify(returnMsg);
        //                 done(false);
        //             }
        //         })
        //     } else {
        //         done();
        //     }
        // },
        submitRegist() {
            if (!this.tel) {
                this.$notify('请输入手机号')
                return false
            }
            if (!common.isVerificationNumber(this.tel)) {
                this.$notify('手机号码格式不正确')
                return false
            }
            if (!this.verifyCode) {
                this.$notify('请输入验证码')
                return false
            }
            if (!this.password) {
                this.$notify('请输入密码')
                return false
            }
            if (!this.invitationCode) {
                this.$notify('请输入邀请码')
                return false
            }
            let data = {
                userType: this.userType,
                tel: this.tel,
                verifyCode: this.verifyCode,
                invitationCode: this.invitationCode,
                password: this.password,
            }
            this.$fly.post('/api/User/Register', data)
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                // 306，用户已存在
                if (returnCode == 100 || returnCode == 306) {
                    this.$toast(returnMsg);
                    this.activeName = 'a';
                } else {
                    this.$notify(returnMsg);
                }
            })
        },
        loginTypeSwich() {
            this.imgCode = '';
            this.loginType = this.loginType == 1 ? 0 : 1;
        },
        submitLogin() {
            if (!this.tel) {
                this.$notify('请输入手机号')
                return false
            }
            if (!common.isVerificationNumber(this.tel)) {
                this.$notify('手机号码格式不正确')
                return false
            }
            if (!this.accessChecked) {
                this.$notify('请同意《闪电任务平台注册协议》')
                return false
            }
            let data = {
                loginType: this.loginType,
                userType: this.userType,
                tel: this.tel,
                password: this.password,
                verifyCode: this.verifyCode,
                imgCode: this.imgCode,
            }
            this.$fly.post('/api/User/Login', data)
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let Authorization = data.access_token;
                    localStorage.setItem('Authorization', Authorization);
                    localStorage.setItem('tel', this.tel);
                    this.$toast(returnMsg);
                    this.$router.replace('/');
                // 需要输入图形验证码
                } else if (returnCode == 310) {
                    this.$notify(returnMsg);
                    this.showImgCodeInput = true;
                } else {
                    this.$notify(returnMsg);
                }
            })
        },
        gotoPassword() {
            this.$router.push('/user/password?forget=1')
        }
    },
    mounted() {
        this.activeName = this.$route.query.active || 'a';
        this.invitationCode = this.$route.query.code || '';
        this.tel = this.$route.query.tel || '';
    },
}
</script>

<style lang='less'>
.etc-apply {
    padding: 15/11rem;
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    .banner {
        border-radius: 10px;
        margin-bottom: 15/11rem;
        img {
            width: 100%;
        }
    }
    .van-tabs {
        flex: 1;
    }
    .van-tabs__content {
        padding: 15/11rem 0;
    }
    .van-tabs__line {
        background-color: #ffd270;
    }
    .access {
        font-size: 14/11rem;
        margin-left: 5/11rem;
        margin: 10px 0;
        display: flex;
        align-items: center;
        .deco {
            color: #409eff;
        }
        .van-checkbox__icon--round .van-icon {
            background-color: #fff;
        }
        .van-checkbox__icon--checked .van-icon {
            background-color: #1989fa;
        }
    }
    .auth-agreement {
        padding: 20px;
        max-height: 65vh;
        overflow-y: auto;
        font-size: 12px;
        p {
            text-indent: 2em;
            margin-bottom: 8px;
        }
        h3 {
            font-weight: 700;
        }
    }
    .form-wp {
        .van-cell-group {
            .van-field__left-icon {
                margin-right: 10px;
                .van-icon {
                    font-size: 20px;
                }
            }
            &:first-child {
                .van-field__left-icon {
                    color: #66CCFF;
                }
            }
            &:nth-child(2), &:nth-child(4) {
                .van-field__left-icon {
                    color: rgb(255, 168, 37);
                }
            }
            &:nth-child(3) {
                .van-field__left-icon {
                    color: #31d777;
                }
            }
        }
    }
    .van-cell-group {
        margin-bottom: 15/11rem;
        background-color: #f5f5f5;
        border-color: #f5f5f5;
        &.flex-box {
            display: flex;
            align-items: center;
            .img-code {
                width: 120px;
                margin-left: 10px;
                height: 46px;
            }
        }
        .van-cell {
            border-radius: 10px;
            padding: 13px 15px;
            font-size: 15/11rem;
        }
    }
    .deco {
        color: #999;
        font-size: 12/11rem;
        line-height: 2;
        display: flex;
        .van-icon {
            margin-right: 5px;
            margin-top: 5px;
            vertical-align: sub;
        }
    }
    .deco-btn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 5px;
        // margin-bottom: 10px;
        span {
            padding: 8px 0;
            font-size: 13/11rem;
            color: #409eff;
            .van-icon {
                vertical-align: middle;
                margin-left: 5px;
            }
        }
    }
    .submit {
        width: 100%;
        margin-top: 20/11rem;
        border-color: #409eff;
        background-color: #409eff;
        font-size: 16/11rem;
        border-radius: 10px;
        // &.deco-btn {
        //     background-color: #fff;
        //     color: rgb(255, 160, 17);
        //     font-size: 15/11rem;
        //     margin-top: 10/11rem;
        // }
    }
}
</style>