<template>
<div class='user-master bg-f5'>
    <topbar :title="title"></topbar>
    <!-- <p class="tip">您是分站 12344 站长特权</p> -->
    <van-grid :column-num="3" v-if="isShow">
        <van-grid-item :to="`/master/memberList?is_child_partner=${is_child_partner}&userType=${userType}`" icon="friends" text="会员管理" />
        <van-grid-item to="/master/memberRank" icon="label" text="会员做单排行榜" />
        <!-- <van-grid-item to="/master/partnerRank" icon="fire" text="合伙人做单排行榜" /> -->
        <!-- <van-grid-item @click="isDev" icon="fire" text="合伙人做单排行榜" /> -->
        <van-grid-item to="/master/taskList" icon="todo-list" text="任务列表" />
        <van-grid-item to="/master/partnerIncome" icon="balance-list" text="合伙人收入" />
        <van-grid-item v-if="userType==2" to="/master/partnerList" icon="manager" text="子合伙人管理" />
    </van-grid>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'UserMaster',
    components: { Topbar },
    data() {
        return {
            title: '',
            userType: '',        // 1、总代； 2、合伙人
            is_child_partner: '',    // 1、子合伙人
            isShow: false,
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
    },
    methods: {
        ...mapActions([
            'getUserInfo',
        ]),
        isDev() {
            this.$toast('敬请期待')
        }
    },
    mounted() {
        this.title = this.$route.query.name || '特权';
        this.getUserInfo().then(() => {
            this.isShow = true;
            this.userType = this.userInfo.type;
            this.is_child_partner = this.userInfo.is_child_partner;
        })
    },
}
</script>

<style lang='less'>
.user-master {
    .tip {
        text-align: center;
        font-size: 14/11rem;
        padding: 20px 10px;
    }
}
</style>