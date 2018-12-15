<template>
    <yd-layout title="地址管理" :link="backUrl">
        <yd-cell-group class="mlr-10" style="background: #f4f4f4;">
            <yd-cell-item arrow class="list_item" :href="{ path:'/addressEdit',query:{ addressId:item.id ,userId: userId,pageType:1}}" type="link"
                          v-for="(item,index) in addressList" :key="index">
                <div slot="left">
                    <p> {{item.consignee}} <span class="ml-40">{{item.phone}}</span> <span v-if="item.isDefault == '1'" class="address_dot hasBra c-fff ml-40">默认</span>
                    </p>
                    <div class="address_detail">{{item.provinceName + item.cityName + item.areaName + item.detailAddr}}</div>
                </div>
                <span slot="right"></span>
            </yd-cell-item>
        </yd-cell-group>
        <div class="plr-10 mt-10" >
            <yd-button size="large" type="primary" class='foo_btn' bgcolor="#fff" @click.native="addAddress">
                <!--<yd-icon name="home" size=".6rem" color=""></yd-icon>-->
                新增地址
            </yd-button>
        </div>
    </yd-layout>
</template>

<script>
    export default {
        name: 'address-list',
        data() {
            return {
                backUrl:'',
                addressList:[]
            }
        },
        created() {
            this.userId = this.$comm.getUrlKey('userId') || '224418465157615616';
            this.getAddressList();
            this.isH5 = this.$comm.getUrlKey('isH5')|| undefined;
            this.backUrl = this.isH5 ? '/addressSelect' :'/back';
            },
        methods: {
            getAddressList() {
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    this.addressList = res.data;
                })
            },
            addAddress() {
                this.$router.push({path: 'addressEdit', query: {userId: this.userId}})
            }
        }
    }
</script>
<style>
    .yd-cell {
        background-color: #f4f4f4;
    }

</style>
<style scoped>
    .list_item {
        min-height: 85px;
        margin-top: 10px;
        background: #fff;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }

    .address_detail {
        height: auto;
        overflow: hidden;
        padding-right: 40px;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        margin-top: 8px;
    }

    .address_dot {
        background: #F68E1D;
        font-size: 12px;
        padding: 1px 2px;
    }

    .foo_btn {
        background: #fff;
        color: #282828;
        margin-bottom: 0.4rem;
    }
</style>
