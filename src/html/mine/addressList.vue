<template>
    <div>
        <div class="nav_bar" >
            <div class="nav_cell" @click.prevent="backPage">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title">地址管理</p>
        </div>

        <yd-cell-group class="mlr-10 list_sec" >
            <yd-cell-item arrow class="list_item" :href="{ path:'/addressEdit',query:{ addressId:item.id ,userId: userId,pageType:1,isDefault:item.isDefault}}" type="link"
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
                新增地址
            </yd-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'address-list',
        data() {
            return {
                addressList:[]
            }
        },
        created() {
            this.userId = this.$comm.getUrlKey('userId') || '240377469021065216';
            this.getAddressList();
            this.isH5 = this.$comm.getUrlKey('isH5') || undefined;
        },
        methods: {
            // 页面回跳
            backPage(){
                if(this.isH5){
                    this.$router.back(-1);
                }else{
                    this.$comm.normalBack();
                }
            },
            // 获取地址列表
            getAddressList() {
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    this.addressList = res.data;
                })
            },
            // 进行添加地址
            addAddress() {
                this.$router.push({path: 'addressEdit', query: {userId: this.userId}})
            }
        }
    }
</script>
<style>
    .yd-cell {
        background-color: #f4f4f4!important;
    }

</style>
<style scoped>
    .nav_bar{
        width:100%;
        height:1rem;
        background: #fff;
        line-height: 1rem;
        position: fixed;
        top:0;
        left:0;
        right:0;
        z-index: 100;
    }
    .nav_cell{
        width:1rem;
        padding-left:0.24rem;
        position: absolute;
        top:0;
        left:0;
        z-index: 10;
    }
    .nav_title{
        width: 100%;
        height:1rem;
        text-align: center;
        font-size:0.3rem;
        line-height: 1rem;
    }
    .list_sec{
        margin-top:1rem;
        background-color: #f4f4f4;
        overflow: hidden;
    }
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
