<template>
<div class='detail'>
    <topbar v-if="!fixCode" title="订单操作"></topbar>
    <div class="container" v-if="num">
        <div class="qrcode-wp" @click="showDialog=true">
            <!-- <div id="qrcode" class="qrcode" ref="qrCodeUrl" v-if="!imgData">
                <img v-if="isImg" :src="item.qrcode_url" alt="">
            </div>
            <img v-if="imgData" :src="imgData" alt="" style="width:200px;height:200px;"> -->
            <img v-if="isImg" :src="item.qrcode_url" alt="">
            <qrcode v-else :value="item.qrcode_url"></qrcode>
        </div>
        <h3 class="order">订单号：{{item.task_id}}</h3>
        <div class="timer">
            <h3>超时时间：</h3>
            <overtime :create="item.create_time" :expire="item.expire_time" @timeover="goback"></overtime>
        </div>
        <h3 class="step">任务步骤：扫码，点击开始，过滑块，长按二维码识别，点击确认，填写资料，辅助成功</h3>
        <div class="tip-wp">
            <h3>温馨提示</h3>
            <p>1.请用微信扫码，微信出现辅助成功即可。</p>
            <p>2.辅助的微信号必须注册满半年，一个月能辅助一次，六个月两次，一年三次。</p>
            <p>3.扫码后提示不符合，则重新领取其他订单任务。</p>
        </div>
        <div class="btn-wp">
            <!-- <van-button v-if="!fixCode" class="btn" type="info" @click="userSetSuccess">我已辅助成功</van-button> -->
            <!-- <van-button class="btn" type="warning" plain @click="userSetRight" icon="warning-o">订单不符合</van-button> -->
            <van-button class="btn" type="warning" @click="giveupTask">放弃任务</van-button>
            <span class="deco">
                <van-icon name="info"/>恶意放弃任务会处以罚款
            </span>
        </div>
        <div class="btn-bottom">
            <div class="item">
                <p class="tip">记录便于平台发现问题</p>
                <div class="flex">
                    <van-button class="btn" type="info" @click="userSetRight(1)" size="mini">订单符合</van-button>
                    <van-button class="btn" type="warning" @click="userSetRight(-1)" size="mini">订单不符合</van-button>
                </div>
            </div>
            <div class="line"></div>
            <div class="item">
                <p class="tip">记录便于查询对账</p>
                <div class="flex">
                    <van-button class="btn" type="info" @click="userSetSuccess(1)" size="mini">辅助成功</van-button>
                    <van-button class="btn" type="warning" @click="userSetSuccess(0)" size="mini">辅助失败</van-button>
                </div>
            </div>
        </div>
        <van-dialog
            v-model="showDialog"
            title="扫描以下二维码"
            show-cancel-button
            :show-confirm-button="false"
            cancel-button-text="返回"
            cancel-button-color="#1989fa"
            class="full-dialog"
        >
            <div class="qrcode-wp dialog-content">
                <!-- <div id="qrcode" class="qrcode" ref="qrCodeUrl" v-if="!imgData">
                    <img v-if="isImg" :src="item.qrcode_url" alt="">
                </div>
                <img v-if="imgData" :src="imgData" alt="" style="width:200px;height:200px;"> -->
                <img v-if="isImg" :src="item.qrcode_url" alt="">
                <qrcode v-else :value="item.qrcode_url"></qrcode>
            </div>
        </van-dialog>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import Overtime from '@/components/overtime.vue';
import Qrcode from '@/components/qrcode.vue';
import html2canvas from 'html2canvas';
import QRCode from 'qrcodejs2';
import common from '../components/common'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Detail',
    components: { Overtime, Topbar, Qrcode },
    data() {
        return {
            num: null,
            qrcode: null,
            item: {},
            fixCode: '',
            imgData: '',

            showDialog: false,
        };
    },
    computed: {
        ...mapGetters([
            'tasks'
        ]),
        isImg() {
            return common.check_is_img(this.item.qrcode_url);
        }
    },
    methods: {
        ...mapActions([
            'getTasks'
        ]),
        initQrcode (url) {
            let qrcode = new QRCode(this.$refs.qrCodeUrl, {
                width: 200, // 设置宽度，单位像素
                height: 200, // 设置高度，单位像素
                text: url,   // 设置二维码内容或跳转地址
                correctLevel: QRCode.CorrectLevel.L
            })
            setTimeout(() => {
                this.createPicture() // 二维码生成后，执行生成图片
            }, 2200)
        },
        createPicture () {
            html2canvas(this.$refs.qrCodeUrl, {
                backgroundColor: null,
                width: 200,
                height: 200
            }).then(canvas => {
                var imgData = canvas.toDataURL('image/jpeg')
                this.imgData = imgData
            })
        },
        // updateTaskStatus(id) {
        //     this.$fly.get('/api/Task/UpdataTaskDetailStatus', { taskId: id })
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.$toast('抢单成功，请在限定时间内完成任务！')
        //         } else {
        //             this.$dialog.alert({
        //                 message: returnMsg
        //             }).then(() => {
        //                 this.$router.replace('/');
        //             });
        //         }
        //     })
        // },
        // normalTask() {
        //     this.getTasks().then(() => {
        //         this.num = this.$route.params.index;
        //         if (!this.tasks[this.num]) {
        //             this.$toast('获取数据失败');
        //         } else {
        //             this.item = this.tasks[this.num]
        //             this.updateTaskStatus(this.item.task_id);
        //             this.$nextTick(() => {
        //                 if (this.item.type == 1) {
        //                     this.initQrcode(this.item.qrcode_url);                    
        //                 }
        //             })
        //         }
        //     })
        // },
        goback() {
            this.$dialog.alert({
                message: '任务已超时'
            }).then(() => {
                // this.$fly.get('/api/Task/TaskOverTime', common.connectObj({
                //     taskId: this.item.id,
                // })).then(() => {
                    if (this.fixCode) {
                        
                    } else {
                        this.$router.replace('/');
                    }
                // })
            });
        },
        giveupTask() {
            this.$dialog.confirm({
                title: '确定放弃任务吗？',
                message: '恶意放弃任务会处以罚款'
            }).then(() => {
                if (this.fixCode) {
                    this.$fly.get('/api/Task/GiveUpTaskQrcode', {
                        taskId: this.item.task_id,
                        code: this.fixCode,
                    }).then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        if (returnCode == 100) {
                            this.$toast(returnMsg);
                        } else {
                            this.$toast(returnMsg);
                        }
                    })
                } else {
                    this.$fly.get('/api/Task/GiveUpTask', { taskId: this.item.task_id })
                    .then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        if (returnCode == 100) {
                            this.$router.replace('/');
                        } else {
                            this.$toast(returnMsg);
                        }
                    })
                }
            })
        },
        userSetSuccess(status) {
            let eme = {
                '0': '辅助失败',
                '1': '辅助成功'
            }
            this.$dialog.confirm({
                title: '',
                message: `确定${eme[status]}了吗？`
            }).then(() => {
                if (this.fixCode) {
                    this.$fly.get('/api/Task/UserSetTaskSucessQrcode', {
                        id: this.item.task_id,
                        code: this.fixCode,
                        is_sucess: status,
                    }).then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        // if (returnCode == 100) {
                        //     this.$router.replace('/');
                        // } else {
                            this.$toast(returnMsg);
                        // }
                    })
                } else {
                    this.$fly.get('/api/Task/UserSetTaskSucess', { id: this.item.task_id, is_sucess: status })
                    .then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        // if (returnCode == 100) {
                        //     this.$router.replace('/');
                        // } else {
                            this.$toast(returnMsg);
                        // }
                    })
                }
            })
        },
        userSetRight(status) {
            let eme = {
                '-1': '订单不符合',
                '1': '订单符合'
            }
            this.$dialog.confirm({
                title: '',
                message: `确定${eme[status]}吗？`
            }).then(() => {
                if (this.fixCode) {
                    this.$fly.get('/api/Task/UserSetTaskRightQrcode', {
                        id: this.item.task_id,
                        right: status,
                        code: this.fixCode,
                    }).then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        // if (returnCode == 100) {
                        //     this.$router.replace('/');
                        // } else {
                            this.$toast(returnMsg);
                        // }
                    })
                } else {
                    this.$fly.get('/api/Task/UserSetTaskRight', {
                        id: this.item.task_id,
                        right: status
                    }).then((res) => {
                        let { returnCode, returnMsg, data } = res;
                        // if (returnCode == 100) {
                        //     this.$router.replace('/');
                        // } else {
                            this.$toast(returnMsg);
                        // }
                    })
                }
            })
        }
    },
    mounted() {
        // 判断是否是扫码进入 start
        this.fixCode = this.$route.query.fixCode;
        // END
        this.item = Object.assign({}, this.$route.query, {
            expire_time: Number(this.$route.query.expire_time),
        });
        this.num = true;
        // this.$nextTick(() => {
        //     if (!this.isImg) {
        //         this.initQrcode(this.item.qrcode_url);                    
        //     }
        // })
        // if (this.$route.params.index == -1) {
        //     this.item = Object.assign({}, this.$route.query, {
        //         expire_time: Number(this.$route.query.expire_time),
        //     });
        //     this.num = true;
        //     this.$nextTick(() => {
        //         if (this.item.type == 1) {
        //             this.initQrcode(this.item.qrcode_url);                    
        //         }
        //     })
        // } else {
        //     this.normalTask();
        // }
    },
}
</script>

<style lang='less'>
.detail {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 80/11rem;
    .container {
        padding: 16/11rem;
    }
    .qrcode-wp {
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 20/11rem;
        display: flex;
        align-items: center;
        justify-content: center;
        .qrcode {
            padding: 0;
            // width: 100%;
            display: flex;
            justify-content: center;
            text-align: center;
            img {
                width: 200px;
                height: 200px;
            }
        }
    }
    .order {
        padding: 10px 0;
        text-align: center;
        font-size: 14/11rem;
    }
    .timer {
        padding: 15px 0;
        display: flex;
        justify-content: center;
        align-items: baseline;
        font-size: 16/11rem;
        border: 1px solid #eee;
        border-radius: 4px;
        h3 {
            margin-right: 10px;
        }
        span {
            font-size: 24/11rem;
            color: #f00;
        }
    }
    .step {
        border: 1px solid #eee;
        border-radius: 4px;
        padding: 15px 20px;
        color: #03a9f3;
        font-size: 17/11rem;
        margin-top: 10px;
    }
    .tip-wp {
        font-size: 12/11rem;
        padding: 15px;
        h3 {
            font-weight: 500;
            margin-bottom: 10px;
        }
        p {
            color: #666;
            line-height: 1.8;
        }
    }
    .btn-wp {
        display: flex;
        flex-flow: column;
        align-items: center;
        margin-top: 10px;
        .btn {
            width: 60%;
            margin-bottom: 15px;
        }
        .deco {
            color: #666;
            .van-icon {
                vertical-align: middle;
                margin-right: 8px;
            }
        }
    }
    .btn-bottom {
        position: fixed;
        width: 100%;
        background-color: #fff;
        bottom: 0;
        left: 0;
        display: flex;
        box-shadow: 0 0 0 #999;
        padding: 10/11rem 0;
        .item {
            flex: 1;
            .tip {
                text-align: center;
                color: #999;
                padding-bottom: 8/11rem;
                font-size: 12/11rem;
            }
            .flex {
                display: flex;
                justify-content: space-evenly;
                .btn {
                    height: 26px;
                    padding: 0 6px;
                }
            }
        }
        .line {
            width: 2px;
            background-color: #eee;
        }
    }
    .full-dialog {
        width: 100vw;
        top: 50%;
        .dialog-content {
            height: 84vh;
            border: 0;
            img {
                width: 80%;
            }
        }
    }
}
</style>