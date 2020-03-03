<template>
<div class='userFeedbackLogs bg-f5'>
    <topbar title="反馈记录"></topbar>
    <div class="container">
        <div class="nothing" v-if="nothing">
            <img src="../assets/img/nothing.png" alt="">
            <p>暂无记录</p>
        </div>
        <div class="item" v-for="(item) in items" :key="item.feedback_id">
            <div class="item-unit">
                <div class="item-header">
                    <h3 class="title">反馈意见：</h3>
                    <span class="time">{{item.create_time}}</span>
                </div>
                <div class="item-body" style="background-color:#f5f5f5;">{{item.content}}</div>
            </div>
            <div class="item-unit">
                <div class="item-header">
                    <h3 class="title2">回复内容：</h3>
                    <span class="time">{{item.reply_time}}</span>
                </div>
                <div class="item-body">{{item.reply}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
export default {
    name: 'userFeedbackLogs',
    components: { Topbar },
    data() {
        return {
            items: [],
            nothing: false,
        };
    },
    methods: {
        getLogs() {
            this.$fly.get('/api/User/GetFeedbackResult').then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    let list = data || [];
                    this.items = list.map(item => Object.assign({}, item, {
                        create_time: common.formatTime(item.create_time),
                        reply_time: common.formatTime(item.reply_time),
                        reply: item.reply || '暂未回复'
                    }));
                    this.nothing = this.items.length == 0;
                } else {
                    this.$notify(returnMsg)
                }
            })
        }
    },
    mounted() {
        this.getLogs();
    },
}
</script>

<style lang='less'>
.userFeedbackLogs {
    .container {
        padding: 10px;
        .nothing {
            text-align: center;
            padding: 40px 0;
            img {
                width: 100px;
                opacity: .4;
            }
            p {
                padding: 10px;
                font-size: 14/11rem;
                color: #999;
            }
        }
        .item {
            box-shadow: 0 0 8px #e5e5e5;
            background-color: #fff;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            .item-unit {
                padding: 5px 0;
                &:first-child {
                    // border-bottom: 1px solid #f5f5f5;
                }
            }
            &-header {
                display: flex;
                justify-content: space-between;
                .title {
                    font-size: 14/11rem;
                    font-weight: 800;
                }
                .title2 {
                    font-size: 13/11rem;
                    font-weight: 500;
                }
                .time {
                    font-size: 10/11rem;
                    color: #878787;
                }
            }
            &-body {
                word-break: break-all;
                color: #878787;
                padding: 5px;
            }
        }
    }
}
</style>