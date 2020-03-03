<template>
<div class='user-invite'>
    <topbar title="邀请好友"></topbar>
    <div class="padding-wp">
        <div class="container">
            <h1 class="title0">邀请好友</h1>
            <p class="title1">大量任务，佣金多多</p>
            <div class="content">
                <p class="deco">您的邀请码</p>
                <p class="big">{{invitation_code}}</p>
                <!-- <p class="big">闪电云下云文化</p> -->
                <p class="link" @click="copyText" :data-clipboard-text="link">{{link}}</p>
                <p>点击链接复制</p>
                <p class="deco">快快邀请好友来闪电赚钱吧！</p>
                <div class="line"></div>
                <dir class="qrcode" ref="qrcode"></dir>
                <p class="deco">把二维码分享给好友吧</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common';
import QRCode from 'qrcodejs2';

export default {
    name: 'UserInvite',
    components: { Topbar },
    data() {
        return {
            qrcode: null,
            link: '',
            invitation_code: ''
        };
    },
    methods: {
        initQrcode() {
            if (this.qrcode) return; 
            this.qrcode = new QRCode(this.$refs.qrcode, {
                width: 120,
                height: 120,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
            this.qrcode.makeCode(this.link);
        },
        copyText() {
            let clipboard = new this.clipboard(".link");
            clipboard.on('success', () => {
                this.$toast('复制成功');
            });
            clipboard.on('error', () => {
                this.$toast('复制失败');
            });
        }
    },
    mounted() {
        this.invitation_code = this.$route.query.code;
        const host = window.location.host;
        this.link = `http://www.mali666.com/login?active=b&code=${this.invitation_code}`;
        this.initQrcode();
    },
}
</script>

<style lang='less'>
.user-invite {
    min-height: 100vh;
    background: url('../assets/img/friend-bg.jpg') no-repeat;
    background-size: cover;
    .padding-wp {
        padding: 30px;
    }
    .container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(0, 0, 0, .2);
        border-radius: 6px;
        .title0 {
            font-size: 26/11rem;
            color: #fff;
            font-weight: 700;
        }
        .title1 {
            font-size: 18/11rem;
            color: #fff;
            font-weight: 400;
            padding: 5px 0 20px 0;
        }
        .content {
            width: 95%;
            // margin: 20px 0;
            background-color: rgba(255, 255, 255, .9);
            border-radius: 5px;
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            p {
                font-size: 14/11rem;
            }
            .deco {
                margin: 15px 0;
            }
            .big {
                font-size: 22/11rem;
                font-weight: 600;
                margin-bottom: 10px;
            }
            .link {
                background-color: #ffebae;
                padding: 5px 10px;
                max-width: 90%;
                white-space: nowrap;
                overflow: hidden;
            }
            .line {
                height: 0;
                width: 100%;
                border-bottom: 1px dashed #aaa;
            }
            .qrcode {
                margin: 15px 0 5px 0;
                padding: 0;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>