<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'setNoticeId',
        ]),
        // 公告
        getNotice() {
            return this.$fly.get('/api/Task/GetNotice')
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    return Promise.resolve(data)
                }             
            })
        }
    },
    mounted () {
        // 公告alert
        this.getNotice().then((res) => {
            this.setNoticeId(res.id);
            if (res.is_show && !localStorage.getItem(`notice_${res.id}`)) {
                this.$dialog.confirm({
                    title: '公告',
                    message: res.content,
                    messageAlign: 'left',
                    cancelButtonText: '不再显示'
                }).then(() => {

                }).catch(() => {
                    localStorage.setItem(`notice_${res.id}`, 1)
                }); 
            }          
        })
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
            opacity: .6;
            color: #fff;
        }
        .van-tab--active {
            opacity: 1;
        }
        .van-tabs__line {
            background-color: #ffd270;
        }
    }

    .bg-f5 {
        min-height: 100vh;
        background-color: #f5f5f5;
        padding-bottom: 40px;
    }
}
</style>