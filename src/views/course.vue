<template>
<div class='course'>
    <topbar title="接单教程"></topbar>
    <van-tabs v-model="active">
        <van-tab title="接单教程">
            <div class="container">
                <div v-html="htmlText"></div>
                <img src="../assets/img/course1.jpeg" alt="">
                <img src="../assets/img/course2.jpeg" alt="">
                <img src="../assets/img/course3.jpeg" alt="">
                <img src="../assets/img/course4.jpeg" alt="">
                <img src="../assets/img/course5.jpeg" alt="">
            </div>
        </van-tab>
        <van-tab title="常见问题">
            <div class="container">
                <div v-html="questionHtml"></div>
            </div>
        </van-tab>
    </van-tabs>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
export default {
    name: 'Course',
    components: { Topbar },
    data() {
        return {
            active: 0,
            htmlText: '',
            questionHtml: '',
        };
    },
    methods: {
        // 获取接单教程文字
        getText() {
            return this.$fly.get('/api/Task/GetNotice', { type: 5 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.htmlText = data.content;
                }             
            })
        },
        // 获取常见问题
        getQuestion() {
            return this.$fly.get('/api/Task/GetNotice', { type: 6 })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.questionHtml = data.content;
                }             
            })
        }
    },
    mounted() {
        this.getText();
        this.getQuestion();
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