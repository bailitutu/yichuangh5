<template>
    <yd-layout title="地址选择" link="/back">
        <yd-cell-group class="mlr-10" style="background: #f4f4f4;">
            <yd-cell-item class="list_item" @click.native="selectHandle(item)"
                          v-for="(item,index) in addressList" :key="index">
                <div slot="left">
                    <p> {{item.consignee}} <span class="ml-40">{{item.phone}}</span> <span v-if="item.isDefault" class="address_dot hasBra c-fff ml-40">默认</span>
                    </p>
                    <div class="address_detail">{{item.provinceName + item.cityName + item.areaName + item.detailAddr}}</div>
                </div>
            </yd-cell-item>
        </yd-cell-group>
        <div class="plr-10"
             style="width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">
            <yd-button size="large" type="primary" class='foo_btn' bgcolor="#fff" @click.native="addressManage">
                <!--<yd-icon name="home" size=".6rem" color=""></yd-icon>-->
                地址管理
            </yd-button>
        </div>
        <white-page v-if="addressList.length > 0 ? false :true" ></white-page>
    </yd-layout>
</template>

<script>
    import WhitePage from "../../components/whitePage";
    export default {
        name: "address-select",
        components: {WhitePage},
        data() {
            return {
                addressList:[],
            }
        },
        created(){
            this.userId = this.$comm.getUrlKey('userId') || '224418465157615616';
            this.getAddressList();
        },
        methods: {
            // 获取地址列表
            getAddressList() {

                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    this.addressList = res.data;
                })

            },
            // 选择地址
            selectHandle(item){
                console.log(item)
                // if(this.$comm.isAndroid()){
                //
                // }else if(this.$comm.isIos()){
                //
                // }else{
                //
                //
                // }

            },
            // 进入地址管理
            addressManage() {
                this.$router.push({path: 'addressList', query: {isH5: '1'}})
            }
        }
    }
</script>

<style>
    .plr-10 {
        padding: 0 10px;
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

    .yd-cell {
        background-color: #f4f4f4;
    }

    .foo_btn {
        background: #fff;
        color: #282828;
        margin-bottom: 0.4rem;
    }
</style>
