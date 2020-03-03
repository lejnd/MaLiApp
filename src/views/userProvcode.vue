<template>
<div class='user-provcode bg-f5'>
    <topbar title="设置归属地"></topbar>
    <div class="container">
        <section class="form-block">
            <h2 class="form-title">
                <span>选择当前归属省份</span>
                <van-button class="btn" plain size="mini" icon="aim" type="info" @click="getGeo">自动获取定位</van-button>
            </h2>
            <div class="region-wp">
                <div class="region-row">
                    <h3>归属地</h3>
                    <van-dropdown-menu class="flex1">
                        <van-dropdown-item v-model="region" :options="regionOpt" :disabled="isDisabled" />
                    </van-dropdown-menu>
                </div>
            </div>
        </section>
        <div class="btn-group">
            <van-button class="btn" type="info" @click="onSubmit">确定设置</van-button>
        </div>
    </div>
</div>
</template>

<script>
import Topbar from '@/components/top-bar.vue';
import common from '@/components/common';
import config from '@/config';
import { mapGetters, mapActions } from 'vuex';
import { Promise } from 'q';

export default {
    name: 'UserProvcode',
    components: { Topbar },
    data() {
        return {
            region: '',
            regionOpt: config.regions,
            isDisabled: true,
            toast: null,
        };
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ])
    },
    methods: {
        ...mapActions([
            'getUserInfo',
            'setProvcodeTemp'
        ]),
        // getRegionList() {
        //     return this.$fly.get('/api/Task/GetProvince')
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             let list = data.map(item => ({
        //                 text: item.province_name,
        //                 value: item.province_code,
        //             }))
        //             this.regionOpt = list.filter(item => item.value != '0')
        //         } else {
        //             this.$toast(returnMsg);
        //         }
        //     })
        // },
        // getProvinceByTel() {
        //     return this.$fly.get('/api/Task/GetProvinceByTel')
        //     .then((res) => {
        //         let { returnCode, returnMsg, data } = res;
        //         if (returnCode == 100) {
        //             this.region = data.province_code;
        //         } else {
        //             this.isDisabled = false;
        //             this.$toast(returnMsg);
        //             return Promise.reject()
        //         }
        //     })
        // },
        getLoction(lat, lng) {
            return this.$fly.get('/api/Task/GetProvinceByGps', { lat, lng })
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                this.toast.clear()
                if (returnCode == 100) {
                    this.region = data.province_code;
                } else {
                    this.getGeoError();
                    return Promise.reject()
                }
            })
        },
        onSubmit() {
            if (!this.region) {
                this.$notify('请选择归属省份');
                return false;
            }
            this.$fly.post(`/api/User/UpdateProvcode?provcode=${this.region}`)
            .then((res) => {
                let { returnCode, returnMsg, data } = res;
                if (returnCode == 100) {
                    this.setProvcodeTemp(this.region);
                    this.$toast('设置成功');
                    this.$router.replace('/');
                } else {
                    this.$toast(returnMsg);
                }
            })
        },
        getGeo() {
            let vm = this;
            this.toast = this.$toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                message: '正在获取定位'
            });
            if (!window.plus) {
                console.log(1111);
                vm.requestPosition();
            } else {
                plus.geolocation.getCurrentPosition(function(p){
                    let lat = p.coords.latitude;
                    let lng = p.coords.longitude;
                    console.log('plus address: ', lat, lng);
                    vm.getLoction(lat, lng)
                    .then(() => {
                        vm.onSubmit();
                    }).catch(() => {
                        vm.$toast('获取地址失败，请手动选择归属地');
                    });
                }, function(e){
                    console.log('Geolocation error: ' + e.message);
                    vm.toast.clear()
                    vm.getGeoError();
                });
            }  
        },
        requestPosition() {
            let nav = null;
            let vm = this;
            if (nav == null) {
                nav = window.navigator;
            }
            if (nav != null) {
                var geoloc = nav.geolocation;
                if (geoloc != null) {
                    geoloc.getCurrentPosition(successCallback, errorCallback);
                }
                else {
                    console.log("浏览器不支持此功能。");
                    showMessage()
                }
            }
            else {
                console.log("未找到定位设备。");
                showMessage()
            }
            function successCallback(position) {
                vm.getLoction(position.coords.latitude, position.coords.longitude)
                .then(() => {
                    vm.onSubmit();
                }).catch(() => {
                    vm.$toast('获取地址失败，请手动选择归属地');
                });
                // postLocation(position.coords.latitude, position.coords.longitude);
            };
            function errorCallback(error) {
                console.log(error);
                showMessage()
                switch (error.code) {
                    case 1:
                        vm.$toast("位置服务被拒绝,请确保已开启定位功能并允许。");
                        break;
                    case 2:
                        vm.$toast("暂时获取不到位置信息。");
                        break;
                    case 3:
                        vm.$toast("获取信息超时。");
                        break;
                    default:
                        vm.$toast("未知错误。");
                        break;
                }
            };
            function showMessage() {
                vm.toast.clear()
                vm.getGeoError()
            }
        },
        // 为成功获取定位的操作
        getGeoError() {
            if (this.userInfo.provcode == '0') {
                this.$dialog.alert({
                    title: '提示',
                    message: '请手动设置归属地，以便顺利做任务，归属地设置后不能更改！',
                }).then(() => {
                    this.isDisabled = false;
                })
            } else {
                this.$dialog.alert({
                    title: '提示',
                    message: '未能成功获取定位，请重试',
                })
            }
        }
    },
    mounted() { 
        // this.getProvinceByTel().then(() => {
        //     this.onSubmit();
        // }).catch(() => {
        //     this.$toast('获取地址失败，请手动选择归属地');
        // });
        this.getUserInfo().then(() => {
            // this.getRegionList();  使用本地的地区列表
            if (this.userInfo.provcode == '0') {
                this.getGeo();
            } else {
                this.region = this.userInfo.provcode.toString();
            };
        })
    },
}
</script>

<style lang='less'>
.user-provcode {
    .container {
        .form-block {
            .form-title {
                margin: 0;
                padding: 15px 15px 15px;
                color: rgba(69, 90, 100, 0.6);
                font-weight: normal;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
                .btn {
                    padding: 0 8px;
                }
            }
            .region-wp {
                margin-bottom: 15px;
                background-color: #fff;
                .region-row {
                    padding: 0 15px;
                    display: flex;
                    align-items: center;
                    font-size: 14/11rem;
                    .flex1 {
                        flex: 1;
                        .van-dropdown-menu__title {
                            width: 90%;
                            text-align: center;
                        }
                    }
                }
            }
        }
        .btn-group {
            padding: 0 15px;
            .btn {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
}
</style>