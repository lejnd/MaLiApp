<template>
<div class='user-feedback bg-f5'>
    <topbar title="意见反馈"></topbar>
    <div class="container">
        <div class="content">
            <div class="region-row">
                <h3 class="label">反馈类型：</h3>
                <van-radio-group v-model="type" class="radio-wp">
                    <van-radio name="1">意见反馈</van-radio>
                    <van-radio name="2">抽佣申请</van-radio>
                    <van-radio name="3">申请合作</van-radio>
                </van-radio-group>
            </div>
            <van-cell-group>
                <van-field v-if="type=='2'" v-model="rate" type="number" label="抽佣百分比" placeholder="请输入抽佣百分比">
                    <span slot="right-icon">%</span>
                </van-field>
                <van-field v-model="content" type="textarea" autosize label="意见反馈" placeholder="请输入意见反馈，最少10字，最多300字">
                </van-field>
            </van-cell-group>
            <div class="deco">
                <span>{{contentLength}}/300</span>
            </div>
        </div>
        <div class="btns">
            <van-button class="btn" type="info" @click="onSubmit()">提 交</van-button>
            <van-button class="btn" type="primary" to="/user/feedback_logs">反馈记录</van-button>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
export default {
    name: 'userFeedback',
    components: { Topbar },
    data() {
        return {
            content: '',
            type: '1',
            rate: '',
        };
    },
    computed: {
        contentLength() {
            return this.content.length;
        }
    },
    methods: {
        onSubmit() {
            if (this.type == '2' && this.rate < 1) {
                this.$notify('抽佣百分比不能小于1%');
                return false;
            }
            if (this.type == '2' && this.rate > 98) {
                this.$notify('抽佣百分比不能大于98%');
                return false;
            }
            let content = this.content.replace(/\s+/g, '');
            if (content.length < 10) {
                this.$notify('最少输入10个字')
                return false;
            }
            if (content.length > 500) {
                this.$notify('最多输入300个字')
                return false;
            }
            this.$fly.get('/api/User/Feedback', {
                content,
                type: this.type,
                rate: this.rate,
            }).then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.$toast(returnMsg)
                    this.$router.push('/user/feedback_logs');
                } else {
                    this.$notify(returnMsg)
                }
            })
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.user-feedback {
    .deco {
        padding: 5px 15px 20px 15px;
        text-align: right;
        color: #999;
    }
    .btns {
        padding: 0 15px;
        .btn {
            margin: 8px 0;
            width: 100%;
            border-radius: 4px;
        }
    }
    .region-row {
        padding: 10px 15px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        // align-items: center;
        font-size: 14/11rem;
        border-bottom: 1px solid #f5f5f5;
        .label {
            padding: 5px 0;
        }
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
            flex-wrap: wrap;
            height: 60px;
            .van-radio {
                margin-left: 15/11rem;
            }
        }
    }
}
</style>