<template>
<div class='detail bg-f5'>
    <topbar title="订单操作"></topbar>
    <div class="container" v-if="num">
        <div class="qrcode-wp">
            <div id="qrcode" class="qrcode" ref="qrCodeUrl">
                <img v-if="item.type==2" :src="`data:image/png;base64,${item.qrcode_url}`" alt="">
            </div>
        </div>
        <div class="timer">
            <h3>超时时间：</h3>
            <overtime :create="item.create_time" :expire="item.expire_time" @timeover="goback"></overtime>
        </div>
        <div class="tip-wp">
            <h3>温馨提示</h3>
            <p>1.恶意抢单并且不完成任务的，系统将停封该账号</p>
            <p>2.抢单成功后，该任务会去到【微信扫码任务列表】</p>
            <p>3.不在有效时间内完成任务的，会导致任务失败</p>
        </div>
        <div class="btn-wp">
            <van-button class="btn" type="info" @click="giveupTask">放弃任务</van-button>
            <span class="deco">
                <van-icon name="info"/>恶意放弃任务会处以罚款
            </span>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import Overtime from '@/components/overtime.vue';
import QRCode from 'qrcodejs2';
import common from '../components/common'
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'Detail',
    components: { Overtime, Topbar },
    data() {
        return {
            num: null,
            qrcode: null,
            item: {},
        };
    },
    computed: {
        ...mapGetters([
            'tasks'
        ])
    },
    methods: {
        ...mapActions([
            'getTasks'
        ]),
        initQrcode (url) {
            if (this.item.type == 1) {
                let qrcode = new QRCode('qrcode',{
                    width: 200, // 设置宽度，单位像素
                    height: 200, // 设置高度，单位像素
                    text: url   // 设置二维码内容或跳转地址
                })
            } else {

            }
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
                    this.$router.replace('/');
                // })
            });
        },
        giveupTask() {
            this.$dialog.confirm({
                title: '确定放弃任务吗？',
                message: '恶意放弃任务会处以罚款'
            }).then(() => {
                this.$fly.get('/api/Task/GiveUpTask', { taskId: this.item.task_id })
                .then((res) => {
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        this.$router.replace('/');
                    } else {
                        this.$toast(returnMsg);
                    }
                })
            })
        }
    },
    mounted() {
        this.item = Object.assign({}, this.$route.query, {
            expire_time: Number(this.$route.query.expire_time),
        });
        this.num = true;
        this.$nextTick(() => {
            if (this.item.type == 1) {
                this.initQrcode(this.item.qrcode_url);                    
            }
        })
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
    .timer {
        padding: 15px 0;
        margin-top: 10px;
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
        }
        .deco {
            margin-top: 10px;
            color: #666;
            .van-icon {
                vertical-align: middle;
                margin-right: 8px;
            }
        }
    }
}
</style>