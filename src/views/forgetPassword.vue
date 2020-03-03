<template>
<div class='forget-password bg-f5'>
    <topbar title="忘记密码"></topbar>
    <div class="container">
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
    </div>
</div>
</template>

<script>
import SmscodeBtn from '@/components/smscode-button.vue';
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'

export default {
    name: '',
    components: { Topbar, SmscodeBtn },
    data() {
        return {
            codeBtnStyle: {
                backgroundColor: '#409eff',
                borderColor: '#409eff',
                width: '120px',
                borderRadius: '10px',
                marginLeft: '10px',
                height: '50px',
            },
            tel: '',
            verifyCode: '',
            password: '',
        };
    },
    methods: {
        
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.forget-password {
    .container {
        padding: 15px;
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
}
</style>