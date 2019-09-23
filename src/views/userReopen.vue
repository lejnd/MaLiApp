<template>
<div class='user-reopen bg-f5'>
    <topbar title="申请解禁"></topbar>
    <h1 class="tip">请填写你的解禁理由</h1>
    <van-cell-group>
        <van-field v-model="reason" type="textarea" placeholder="输入你的解禁理由">
        </van-field>
    </van-cell-group>
    <div class="btn-group">
        <van-button class="btn" type="info" @click="submit">确定提交</van-button>
        <van-button class="btn" type="primary" @click="gotoList">解禁申请记录</van-button>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'
export default {
    name: 'UserReopen',
    components: { Topbar },
    data() {
        return {
            reason: ''
        };
    },
    methods: {
        submit() {
            if (!this.reason) {
                this.$notify('请输入理由')
                return false
            }
            this.$fly.get('/api/User/AccountApply', common.connectObj({
                reason: this.reason,
            })).then((res) => {
                let { returnCode, returnMsg } = res;
                this.$toast(returnMsg);
                if (returnCode == 100) {
                    this.gotoList()
                }
            })
        },
        gotoList() {
            this.$router.push('/user/reopenlist')
        }
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.user-reopen {
    .tip {
        padding: 10px 20px;
        font-size: 14/11rem;
    }
    .btn-group {
        padding: 30px 20px;
        .btn {
            width: 100%;
            margin-bottom: 15px;
        }
    }
}
</style>