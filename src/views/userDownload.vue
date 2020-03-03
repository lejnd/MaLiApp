<template>
<div class='user-download'>
    <topbar title="下载"></topbar>   
    <van-tabs class="blueStyle" v-model="active" @change="changeTab">
        <van-tab title="安卓APP下载">
            <div class="container">
                <img class="logo" src="../assets/img/logo.jpeg" alt="">
                <h3 class="title">闪电安卓APP</h3>
                <van-button class="btn" round type="info" @click="gotoAndroid">点击下载</van-button>
                <div class="qrcode" ref="android_qrcode"></div>
                <p class="deco">扫描二维码安装</p>
                <div class="copy-wp" @click="copyText" :data-clipboard-text="androidUrl">
                    <p>点击复制下载地址，用浏览器打开</p>
                    <p>{{androidUrl}}</p>
                </div>
            </div>
        </van-tab>
        <van-tab title="苹果APP下载">
            <div class="container">
                <img class="logo" src="../assets/img/logo.jpeg" alt="">
                <h3 class="title">闪电苹果APP</h3>
                <van-button class="btn" round type="info" @click="gotoIOS">点击下载</van-button>
                <div class="qrcode" ref="ios_qrcode"></div>
                <p class="deco">扫描二维码安装</p>
                <div class="copy-wp" @click="copyText" :data-clipboard-text="iosUrl">
                    <p>点击复制下载地址，用浏览器打开</p>
                    <p>{{iosUrl}}</p>
                </div>
            </div>
        </van-tab>
    </van-tabs>
    <div v-if="isWx" class="wx-mock"></div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common';
import QRCode from 'qrcodejs2';

export default {
    name: 'UserDownload',
    components: { Topbar },
    data() {
        return {
            active: 0,
            androidcode: null,
            ioscode: null,
            isWx: false,
            androidUrl: 'http://huggiesbb.com/yybe6j',
            iosUrl: 'http://huggiesbb.com/yybe6j',
        };
    },
    methods: {
        androidQrcode() {
            if (this.androidcode) return; 
            this.androidcode = new QRCode(this.$refs.android_qrcode, {
                width: 130,
                height: 130,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
            this.androidcode.makeCode(this.androidUrl)
        },
        iosQrcode() {
            if (this.ioscode) return; 
            this.ioscode = new QRCode(this.$refs.ios_qrcode, {
                width: 130,
                height: 130,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
            this.ioscode.makeCode(this.iosUrl)
        },
        gotoAndroid() {
            window.location.href = this.androidUrl;
        },
        gotoIOS() {
            window.location.href = this.iosUrl;
        },
        changeTab() {
            if (this.active == 0) {
                this.$nextTick(() => {
                    this.androidQrcode();
                });
            }
            if (this.active == 1) {
                this.$nextTick(() => {
                    this.iosQrcode();
                });
            }
        },
        copyText() {
            let clipboard = new this.clipboard(".copy-wp");
            clipboard.on('success', () => {
                this.$toast('复制成功');
            });
            clipboard.on('error', () => {
                this.$toast('复制失败');
            });
        }
    },
    created () {
        if (common.isWeiXin()) {
            this.isWx = true;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.androidQrcode();
        });
    },
}
</script>

<style lang='less'>
.user-download {
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 14/11rem;
        padding: 15px;
        .logo {
            width: 80px;
            padding: 30px 0 15px 0;
        }
        .title {
            font-size: 17/11rem;
        }
        .btn {
            margin: 20px 0;
            width: 100px;
        }
        .deco {
            color: #666;
        }
        .qrcode {
            padding: 10px 0 15px 0;
        }
        .copy-wp {
            font-size: 12/11rem;
            margin: 20px 0;
            text-align: center;
            width: 100%;
            p {
                overflow-wrap: break-word;
            }
        }
    }
    .wx-mock {
        background: url('../assets/img/wx-mark.jpeg') no-repeat;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        opacity: .9;
    }
}
</style>