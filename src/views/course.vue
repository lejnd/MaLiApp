<template>
<div class='course'>
    <topbar title="接单教程"></topbar>
    <div class="container">
        <p>1、进入首页，先点击接单教程进入学习，会了在接单。</p>
        <p>2、由于腾讯规则改变，成为地区辅助，同地区（扫码方微信关联手机号归属地）和单子显示地区辅助不填资料，用户一年三次机会，第一次也不用填写资料，扫到资料尽可能做单，资料比较简单。</p>
        <p>3、接单用户做单前提前点击【全部】，选择接单省份在进行接单。</p>
        <p>4、【刷新任务】功能：商家在不停的进行放单，平台接单用户也很多，出来的单子基本都会被接单方秒接，抢不到单子请点击刷新订单，抢单手速快一点。</p>
        <p>5、【自动抢单】功能：点击自动抢单，系统会优先按照订单时间顺序抢单，适合地推用户 PS：设置地区点击自动抢单可以按照地区自动抢单。</p>
        <p class="ps">PS：用户做单切记不要浪费订单，接到订单尽可能完成，成功率低的用户系统风控自动封号。</p>
        <img src="../assets/img/course1.jpeg" alt="">
        <img src="../assets/img/course2.jpeg" alt="">
        <img src="../assets/img/course3.jpeg" alt="">
        <img src="../assets/img/course4.jpeg" alt="">
        <img src="../assets/img/course5.jpeg" alt="">
        <h2>常见问题：</h2>
        <h3>1、提现手续费及到账时间</h3>
        <p>答：账户20元起提现，提现手续费用1%，手续费最低一元。200元以下秒到账，200以上12小时内到账。</p>
        <h3>2、收益计算</h3>
        <p>答：一次推广，终身受益。项目为无线层收益，抽成收益=下级做单数+下级推广的所有做单用户（包括推广用户推广下去的所有做单用户）
所有做单数利润都与推广者有关。</p>
        <h3>3、地推礼品成本和渠道</h3>
        <p>答：非资料辅助礼品成本一般在0.3-0.8元，进货渠道阿里巴巴等线上电商平台及本地批发市场</p>
        <h3>4、推广方法有哪些</h3>
        <p>答：发展本地资源，扩展线下带有流量的店铺，推广学生渠道，各大引流APP都可以尝试。自己组建地推团队，招聘员工利润也是可观的。</p>
        <h3>5、为什么账户被禁用</h3>
        <p>答：接单的成功率过低，浪费订单资源，系统有波动的风控封禁比例，用户做单务必确保有人做单在抢单。</p>
        <h3>6、新规则怎么不用填资料</h3>
        <p>1⃣一个微信号一年可以辅助三次，一年首次辅助不用填资料。<br>2⃣️同一个地区辅助【订单省份和扫码客户同一个地区，外地人或者手机号不是同地区需要填资料】不需要填资料。<br>3⃣️国外部分号段订单不用填写资料。</p>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
export default {
    name: 'Course',
    components: { Topbar },
    data() {
        return {
            
        };
    },
    methods: {
        
    },
    mounted() {
        
    },
}
</script>

<style lang='less'>
.course {
    .container {
        padding: 15px;
        img {
            width: 100%;
            margin-bottom: 10px;
        }
        p {
            font-size: 14/11rem;
            line-height: 1.5;
            padding: 3px 0;
            &.ps {
                color: #f40;
            }
        }
        h2 {
            font-size: 20/11rem;
            font-weight: 700;
            padding: 15px 0 0 0;
        }
        h3 {
            font-size: 16/11rem;
            font-weight: 600;
            margin-top: 10px;
        }
    }
}
</style>