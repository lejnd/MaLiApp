<template>
<div class="smscode-btn">
    <van-button
        slot="button"
        :style="btnStyle"
        :size="size"
        :type="type"
        :hairline="hairline"
        :round="round"
        :disabled="smsDisable"
        @click="getSmsCode">{{text}}
    </van-button>
    <van-dialog
        v-model="showImgCode"
        show-cancel-button
        :before-close="beforeClose"
    >
        <div class="code-dialog">
            <h3>看不清？点击更换</h3>
            <img class="img-code" src="/api/User/ValidateCode" onclick="this.src = this.src + '?'">
            <van-cell-group class="img-code-input">
                <van-field
                    v-model="imgCode"
                    placeholder="输入图形验证码"
                    left-icon="photo-o"
                />
            </van-cell-group>
        </div>
    </van-dialog>
</div>
</template>

<script>
import common from '@/components/common';
export default {
    name: 'SmscodeBtn',
    props: {
        mobile: {
            default: () => '',
        },
        btnStyle: {
            type: Object,
            default: () => {},
        },
        size: {
            type: String,
            default: () => 'normal',
        },
        type: {
            type: String,
            default: () => 'info',
        },
        hairline: {
            type: Boolean,
            default: () => false,
        },
        round: {
            type: Boolean,
            default: () => false,
        },
        apiurl: {
            type: String,
            default: () => '/api/User/RegisterVerifyCode'
        }
    },
    data() {
        return {
            timer: -1,
            smsDisable: false,
            text: '获取验证码',
            showImgCode: false,
            imgCode: '',
        };
    },
    methods: {
        getSmsCode() {
            if (!this.mobile) {
                this.$notify('请输入手机号')
                return false
            }
            if (!common.isVerificationNumber(this.mobile)) {
                this.$notify('手机号码格式不正确')
                return false
            }
            this.showImgCode = true;
            // this.smsInterval();
            // this.$emit('getCode', this.mobile);
        },
        smsInterval() {
            const timeConf = 20;
            let count = timeConf;
            this.text = count + 's后重发';
            this.smsDisable = true;
            this.timer = setInterval(() => {
                count--;
                this.text = count + 's后重发';
                if (count <= 0) {
                    clearInterval(this.timer);
                    this.text = '获取验证码';
                    count = timeConf;
                    this.smsDisable = false;
                }
            }, 1000)
        },
        beforeClose(action, done) {
            if (action === 'confirm') {
                if (!this.imgCode) {
                    this.$notify('请输入图形验证码')
                    done(false);
                    return false
                }
                this.$fly.get(this.apiurl, {
                    tel: this.mobile,
                    imgCode: this.imgCode,
                }).then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        this.$toast(returnMsg);
                        this.smsInterval();
                        this.$emit('getCode', this.imgCode);
                        done();
                    } else {
                        this.$notify(returnMsg);
                        done(false);
                    }
                })
            } else {
                done();
            }
        },
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.smscode-btn {
    .van-dialog {
        width: 70%;
    }
    .code-dialog {
        padding: 20px;
        text-align: center;
        .img-code {
            width: 100%;
        }
        .img-code-input {
            margin-top: 10px;
            background-color: #fff;
            border: 1px solid #eee;
        }
    }
}
</style>