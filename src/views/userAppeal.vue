<template>
<div class='user-appeal bg-f5'>
    <topbar title="任务结果申诉"></topbar>
    <div class="container">
        <div class="content">
            <van-cell-group>
                <van-field v-model="taskId" type="number" label="申诉任务ID" placeholder="请输入要申诉的任务ID">
                </van-field>
            </van-cell-group>
            <div class="deco">
                <p class="tip">
                    <van-icon name="info-o" />
                    任务结果真实的情况下恶意发起申诉，核实后将以封号处理
                </p>
                <van-button class="btn" type="info" @click="appeal">提交申诉</van-button>
                <div class="result" @click="gotoList">
                    <span>查看申诉结果</span>
                    <van-icon name="arrow" />
                </div>
            </div>
        </div>
        <div class="section">
            <p>申诉说明：</p>
            <p>1、当任务结果被误判时，可以提交申诉，仅限当天任务</p>
            <p>2、提交申诉后，3小时内会公布申诉结果</p>
            <p>3、一天最多可申诉5个任务</p>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'

export default {
    name: 'UserAppeal',
    components: { Topbar },
    data() {
        return {
            taskId: '',
        };
    },
    methods: {
        appeal() {
            if (!this.taskId) {
                this.$notify('请输入申诉任务ID')
                return false
            }
            this.$fly.get('/api/User/ComplainTask', common.connectObj({
                taskId: this.taskId,
            })).then((res) => {
                let { returnCode, returnMsg, data } = res;
                this.$toast(returnMsg);
                if (returnCode == 100) {
                    this.$router.push('/user/appealist')
                }
            })
        },
        gotoList() {
            this.$router.push('/user/appealist')
        }
    },
    mounted() {
        if (this.$route.query.id) {
            this.taskId = this.$route.query.id
        }
    },
}
</script>

<style lang='less'>
.user-appeal {
    .container {
        // padding: 15px;
        .content {
            background-color: #fff;
            padding-top: 20px;
            border-radius: 4px;
            .deco {
                padding: 20px;
                .tip {
                    font-size: 12/11rem;
                    margin-bottom: 15px;
                    color: #f44;
                }
                .btn {
                    width: 100%;
                    margin-bottom: 10px;
                }
                .result {
                    padding: 10px;
                    color: #03a9f3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
        .section {
            color: #787878;
            padding: 10px 0;
            line-height: 1.8;
            font-size: 12/11rem;
            padding: 20px;
        }
    }
}
</style>