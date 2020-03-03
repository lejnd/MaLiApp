<template>
<div class='data-select'>
    <van-cell-group>
        <van-field
            v-model="formDate"
            label="选择日期"
            placeholder=""
            right-icon="notes-o"
            disabled
            :clickable="true"
            @click="selectDate"
        />
    </van-cell-group>
    <van-popup v-model="dateShow" position="bottom">
        <van-datetime-picker
            v-model="currentDate"
            type="date"
            @confirm="confirm"
            @cancel="cancel"
        />
    </van-popup>
</div>
</template>

<script>

export default {
    name: 'DateSelect',
    components: {},
    props: {
        init: {
            type: Number,
            default: () => 0
        }
    },
    data() {
        return {
            dateShow: false,
            currentDate: new Date(),
        };
    },
    computed: {
        formDate() {      
            return this.$moment(this.currentDate).format('YYYY-MM-DD');
        },
        initDate() {
            let Dates = new Date();
            Dates.setDate(Dates.getDate() + this.init);
            return Dates
        }
    },
    methods: {
        selectDate() {
            this.dateShow = true;
        },
        confirm() {
            if (this.currentDate > this.initDate) {
                this.currentDate = this.initDate;
                this.$notify('日期不能大于当前日期');
                return false;
            }
            this.dateShow = false;
            this.$emit('getDate', this.formDate);
        },
        cancel() {
            this.dateShow = false;
        },
    },
    mounted() {
        this.currentDate = this.initDate;
        this.$emit('getDate', this.formDate);
    },
}
</script>

<style lang='less'>

</style>