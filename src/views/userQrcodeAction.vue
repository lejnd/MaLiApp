<template>
    <div class="qrcode-action">
        <div class="container">
            <p class="text"></p>
            <p class="text">
                <span>提示：</span>提交任务后，显示不符合验证资格的，请两分钟后重新获取二维码
            </p>
            <p class="text">
                <span>特别提醒：</span>如果在本月您已经成功辅助过相关任务，请关闭此页面，不要点击开始，下月在来，谢谢！
            </p>
            <div class="btn-wp">
                <van-button class="btn" type="info" @click="autodo">开 始</van-button>
            </div>
        </div>
        <van-dialog v-model="showAutodo" title="正在抢单..." :show-confirm-button="false">
            <div class="show-autodo">
                <van-loading type="spinner" />
            </div>
        </van-dialog>
    </div>
</template>

<script>
export default {
    name: "qrcodeAction",
    metaInfo: {
        title: "任务"
    },
    components: {},
    data() {
        return {
            active: '',
            code: '',
            guid: '',
            myIP: '',

            autoBtnLoading: false,
            showAutodo: false,
            autodoTimer: -1
        };
    },
    methods: {
        autodo() {
            this.autoBtnLoading = true;
            this.showAutodo = true;
            this.getAutoTask();
            this.autodoTimer = setInterval(() => {
                this.getAutoTask();
            }, 3000);
        },
        getAutoTask() {
            let apiName = this.active == 0 ? "AutoTaskByQrcode" : "ScreenTaskByQrcode";
            this.$fly
                .get(`/api/Task/${apiName}`, {
                    code: this.code,
                    qrcode_Identify: this.guid,
                    ip: this.myIP,
                })
                .then(res => {
                    if (!this.autodoTimer) return;
                    let { returnCode, returnMsg, data } = res;
                    if (returnCode == 100) {
                        if (data.task_id) {
                            clearInterval(this.autodoTimer);
                            this.$router.push({
                                path: `/detail`,
                                query: Object.assign({}, data, {
                                    fixCode: this.code
                                })
                            });
                        }
                    } else {
                        this.cancelAutodo();
                        this.$toast(returnMsg);
                    }
                })
                .catch(() => {
                    this.cancelAutodo();
                    this.$toast("操作失败，请重试");
                });
        },
        cancelAutodo() {
            clearInterval(this.autodoTimer);
            this.showAutodo = false;
            this.autoBtnLoading = false;
        },
        // 生成GUID
        createGuid() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16)
                    .substring(1);
            }
            return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
        },
    },
    mounted() {
        // 引入js获取ip
        const oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.src = 'http://pv.sohu.com/cityjson?ie=utf-8';
        document.body.appendChild(oScript);
        oScript.onload = () => {
            this.myIP = returnCitySN['cip'];
            this.active = this.$route.query.active;
            this.code = this.$route.query.code;
            this.guid = localStorage.getItem("guid") || "";
            if (this.guid) {
                console.log(this.guid);
                this.autodo();
            } else {
                let guid = this.createGuid();
                localStorage.setItem("guid", guid);
                this.guid = guid;
            }
        }
    }
};
</script>

<style lang='less'>
.qrcode-action {
    padding: 20px;
    .container {
        border: 1px solid #eee;
        .text {
            padding: 20px;
            border-bottom: 1px solid #eee;
            font-size: 15/11rem;
            color: #a5632b;
            span {
                color: #333;
            }
        }
        .btn-wp {
            padding: 20px;
            display: flex;
            justify-content: center;
        }
    }
    .show-autodo {
        padding: 30px 0;
        display: flex;
        justify-content: center;
    }
}
</style>