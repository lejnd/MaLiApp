<template>
<div class='overtime'>
    <span>{{formTime}}</span>
</div>
</template>

<script>
export default {
    name: 'Overtime',
    props: {
        create: {
            type: String,
            default: () => '',
        },
        expire: {
            type: Number,
            default: () => 0
        },
    },
    data() {
        return {
            overtime: null,
            formTime: null,
        };
    },
    methods: {
        getOvertime(c, e) {
            let date = new Date();
            let nTime = date.getTime();
            c = c.replace(/-/g, "/").replace("T", " ");
            let cTime = new Date(c).getTime();
            let cha = (nTime - cTime) / 1000;
            return e - cha;
        },
        formatSeconds(a) {
            var hh = parseInt(a/3600);  
            if(hh<10) hh = "0" + hh;  
            var mm = parseInt((a-hh*3600)/60);  
            if(mm<10) mm = "0" + mm;  
            var ss = parseInt((a-hh*3600)%60);  
            if(ss<10) ss = "0" + ss;  
            var length = hh + " : " + mm + " : " + ss;  
            if(a>0){  
                return length;  
            }else{  
                return "NaN";  
            }  
        }
    },
    mounted() {
        this.overtime = this.getOvertime(this.create, this.expire);
        let interval = setInterval(() => {
            if (this.overtime >= 0) {
                this.formTime = this.formatSeconds(this.overtime);
                this.overtime--;
            } else {
                this.formTime = '任务超时';
                clearInterval(interval);
                this.$emit('timeover');
            }
        }, 1000)
    },
}
</script>

<style lang='less'>
.overtime {
    padding: 6px 0;
    span {
        font-size: 17/11rem;
        color: #ff5555;
        font-weight: 600;
    }
}
</style>