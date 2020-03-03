<template>
<div class='user-qrcode'>
    <topbar title="专属固定码"></topbar>
    <van-tabs class="blueStyle" v-model="active" @change="createQrcode">
        <van-tab title="待抢订单(高价)">
        </van-tab>
        <van-tab title="一扫而过通道(筛选)">
        </van-tab>
    </van-tabs>
    <van-notice-bar
        text="如果使用固定码，要注意你的成功率，成功率低会被禁止接单"
        left-icon="volume-o"
    />
    <div class="container">
        <dir class="qrcode" ref="qrcode"></dir>
        <!-- <van-button class="btn" type="info" @click="submit">test goto</van-button> -->
        <div class="form-wp">
            <!-- <div class="region-row">
                <h3>固定抢单省份：</h3>
                <van-dropdown-menu class="flex1">
                    <van-dropdown-item v-model="qrcode_provcode" :options="regionOpt"/>
                </van-dropdown-menu>
            </div> -->
            <div class="region-row">
                <h3>固定码是否启用：</h3>
                <van-radio-group v-model="qrcode_enabled" class="radio-wp">
                    <van-radio name="1">启用</van-radio>
                    <van-radio name="0">禁用</van-radio>
                </van-radio-group>
            </div>
            <div class="btn-wp">
                <van-button class="btn" type="info" @click="setFixCode">保存设置</van-button>
            </div>
        </div>
        <div class="section">
            <p class="first">重点：智能适配任意省扫码人。通俗讲就是，江苏人扫固定码接的单子就是江苏的订单，安徽人扫就是安徽单，大幅度提升成功率。</p>
            <p>1、什么是专属固定码： 专属固定码即您的固定接单二维码，生成专属固定码后，您可以直接让扫码方扫专属码，即可获取平台的订单二维码，扫码辅助成功后，佣金会自动进入您的接单账号。</p>
            <p>2、专属固定码有什么优点：固定码永久有效+无需抢单，固定码永久有效且无需更换。您无需再手动点击抢单获取最新二维码，每次扫码直接出示固定码即可，扫码后会自动获取最新订单。</p>
            <p>3、如何使用推广专属固定码：可保存到手机相册或打印出来，扫码直接转发或出示固定码即可！简单便捷。</p>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common';
import config from '../config';
import QRCode from 'qrcodejs2';
export default {
    name: 'userQrcode',
    components: { Topbar },
    data() {
        return {
            active: 0,
            qrcode: null,
            fixCode: '',

            qrcode_provcode: '',
            qrcode_enabled: '1',
            regionOpt: [],
        };
    },
    methods: {
        getFixCode() {
            this.$fly.get('/api/User/GetFixCodeNew')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.fixCode = encodeURIComponent(data.code) || '';
                    this.qrcode_provcode = data.qrcode_provcode ? data.qrcode_provcode.toString() : '0';
                    this.qrcode_enabled = data.qrcode_enabled.toString() || '1';
                    this.createQrcode();
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        setFixCode() {
            this.$fly.get('/api/User/SetFixCodeNew', {
                // qrcode_provcode: this.qrcode_provcode,
                qrcode_provcode: '0',
                qrcode_enabled: this.qrcode_enabled,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.getFixCode();
                    this.$toast(returnMsg);
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        submit() {
            this.$router.push(`/user/qrcodeAction?active=${this.active}&code=${this.fixCode}`)
        },
        createQrcode() {
            this.$refs.qrcode.innerHTML = ''
            let url = `http://www.xziai.com/user/qrcodeAction?active=${this.active}&code=${this.fixCode}`
            this.qrcode = new QRCode(this.$refs.qrcode, {
                width: 220,
                height: 220,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
            this.qrcode.makeCode(url);
        },
    },
    mounted() {
        this.regionOpt = config.regions.filter(item => item.value != '0');
        this.getFixCode();
    },
}
</script>

<style lang='less'>
.user-qrcode {
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        .section {
            color: #919191;
            margin-top: 10px;
            padding: 5px 20px;
            p {
                padding: 5px 0;
                &.first {
                    color: #f80;
                    font-size: 14/11rem;
                }
            }
        }
        .region-row {
            padding: 0 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14/11rem;
            border-bottom: 1px solid #f5f5f5;
            .flex1 {
                flex: 1;
                .van-dropdown-menu__title {
                    width: 90%;
                    text-align: center;
                }
            }
            .radio-wp {
                flex: 1;
                display: flex;
                height: 60px;
                .van-radio {
                    margin-left: 15/11rem;
                }
            }
        }
        .btn-wp {
            display: flex;
            justify-content: center;
            .btn {
                width: 70%;
                margin-top: 20px;
            }
        }
    }
    dir {
        padding: 0;
    }
}
</style>