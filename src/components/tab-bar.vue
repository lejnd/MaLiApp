<template>
<div class='tab-bar'>
    <van-tabbar v-model="thisActive">
        <van-tabbar-item icon="bill" to="/">接单首页</van-tabbar-item>
        <van-tabbar-item icon="todo-list" to="/order">做单记录</van-tabbar-item>
        <van-tabbar-item icon="manager" to="/user">用户中心</van-tabbar-item>
    </van-tabbar>
</div>
</template>

<script>

export default {
    name: 'TabBar',
    props: {
        active: {
            type: Number,
            default: () => 0,
        }
    },
    data() {
        return {
            thisActive: this.active,
        };
    },
    methods: {
        
    },
    mounted() {
        this.thisActive = this.active;
    },
}
</script>

<style lang='less'>
    .tab-bar {
        height: 56px;
        .van-tabbar-item--active {
            color: #03a9f3;
        }
        .van-tabbar {
            height: 53px;
            box-shadow: 0 0 4px #eaeaea;
        }
        .van-tabbar-item__icon .van-icon {
            font-size: 20px;
        }
    }
</style>