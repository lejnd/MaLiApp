<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex';

export default {
    methods: {
        // 公告
        getNotice() {
            let pathArr = ['/user/qrcodeAction', '/user/qrcodeAction', '/user/qrcode', '/user/invite']
            if (pathArr.includes(window.location.pathname)) {
                console.log('此页面不触发通知');
                return false;
            };
            return this.$fly.get('/api/Task/GetNotice', { type: 1 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$dialog.alert({
                        title: '公告',
                        message: data.content,
                        messageAlign: 'left',
                        confirmButtonText: '了解了'
                    })
                }             
            })
        },
    },
    // created () {
    //     this.getUserInfo();
    // },
    mounted () {
        this.getNotice();
    }
}
</script>


<style lang="less">
#app {
    @my_blue: #03a9f3;
    @my_yellow: #FFC107;
    color: #333;
    font-size: 13/11rem;
    background-color: #fff;
    .van-button--info {
        background-color: @my_blue;
        border-color: @my_blue;
    }
    .van-button--plain.van-button--info {
        background-color: #fff;
        color: @my_blue;
    }

    .blueStyle {
        .van-tabs__nav {
            background-color: @my_blue;
        }
        .van-tab {
            // opacity: .6;
            color: #fff;
        }
        .van-tab--active {
            opacity: 1;
            background-color: #ff976a;
        }
        .van-tabs__line {
            background-color: #fff;
        }
    }

    .bg-f5 {
        min-height: 100vh;
        background-color: #f5f5f5;
        padding-bottom: 40px;
    }
}
</style>