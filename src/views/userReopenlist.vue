<template>
<div class='user-reopenlist bg-f5'>
    <topbar title="解禁申请记录"></topbar>
    <div class="container">
        <div class="nothing" v-if="items.length <= 0">
            {{nothingText}}
        </div>
        <div class="item" v-for="(item, index) in items" :key="index">
            <div class="row">
                <span class="taskid">用户：{{item.tel}}</span>
            </div>
            <div class="row">
                理由：{{item.reason}}
            </div>
            <div class="row">
                提交时间：{{item.create_time}}
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '../components/common'

export default {
    name: 'UserReopenlist',
    components: { Topbar },
    data() {
        return {
            items: [],
            nothingText: ''
        };
    },
    methods: {
        getList() {
            this.$fly.get('/api/User/AccountApplyHistory', common.connectObj())
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.nothingText = '暂无数据';
                    if (data && data.length > 0) {
                        this.items = data.map((item) => Object.assign({}, item, {
                            create_time: this.$moment(item.create_time).format('YYYY/MM/DD HH:mm:ss')
                        }));
                    }
                } else {
                    this.$toast(returnMsg)
                }
            })
        }
    },
    mounted() {
        this.getList();
    },
}
</script>

<style lang='less'>
.user-reopenlist {
    .nothing {
        text-align: center;
        font-size: 15/11rem;
        color: #ccc;
        padding: 20px 0;
    }
    .container {
        padding: 15px;
        .item {
            background-color: #fff;
            padding: 0 15px;
            border-radius: 4px;
            .row {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #eee;
                padding: 15px 0;
                margin-bottom: 5px;
                font-size: 13/11rem;
                &:last-child {
                    border-bottom: 0;
                }
                .result {
                    color: #03a9f3;
                }
            }
        }
    }
}
</style>