<template>
    <yd-layout >
        <div class="nav_bar" slot="top" >
            <div class="nav_cell" @click.prevent="backPage">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title">订单详情</p>
        </div>
        <div class="address_item" v-if="!hasAddress">
            <yd-button type="primary" @click.native="goSelect" size="large" style="margin-top:4px;" shape="angle"
                       bgcolor="#fff" color="#333">
                选择收货地址
            </yd-button>
        </div>
        <yd-cell-group v-else>
            <yd-cell-item arrow class="list_item" :href="{ path:'/addressSelect',query:{ userId:userId}}" type="link" >
                <div slot="left">
                    <p> {{addressInfo.consignee}} <span class="ml-40">{{addressInfo.phone}}</span></p>
                    <div class="address_detail">{{addressInfo.provinceName + addressInfo.cityName + addressInfo.areaName+addressInfo.detailAddr}}
                    </div>
                </div>
                <span slot="right"></span>
            </yd-cell-item>
        </yd-cell-group>

        <ul class="good_list" v-if="orderInfoList.length > 0 ? true :false">
            <li v-for="(item,index) in orderInfoList" :key="index">
                <div class="car_center">
                    <div class="goods_img">
                        <img :src="item.goodsImg" alt="">
                    </div>
                    <div class="goods_detail">
                        <div class="one_row">{{item.goodsName}}</div>
                        <p class="fs-12 c-b0" v-if="item.supplierGoodsDetail"> {{item.supplierGoodsDetail.spec || ''}} </p>
                        <div class="price_num"><span class="c-money">￥{{ item.price}}</span><span class="fs-14 c-33">X{{item.number}}</span></div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="car_footer" slot="bottom">
            <div class="car_tool ">
                <p class="fs-14 c-28">数量</p>
                <span class="c-28 fs-14">{{totalNum}}</span>
            </div>
            <div class="car_end">
                <p class="fs-16 c-money">￥{{ totalMoney || 0 }}</p>
                <yd-button type="primary" bgcolor="#333" shape="angle" color="#fff" class="sub_btn"
                           @click.native="submitFn">结算
                </yd-button>
            </div>
        </div>
    </yd-layout>
</template>

<script>
    export default {
        name: "car-order-submit",
        data() {
            return {
                totalMoney: 0,
                hasAddress: false,
                addressInfo: {},
                orderInfoList:[],
                totalNum: 0
            }
        },
        created() {
            this.userId = this.$comm.getUrlKey('userId') || this.$comm.getStorge('preOrderUserId') || '224418465157615616';
            this.getPageData();
        },
        methods: {
            // 返回
            backPage(){
                this.$router.back(-1);
            },
            // 获取页面信息
            getPageData() {
                let addId = this.$comm.getStorge('selAddressId') || null;
                if (!addId) {
                    this.getDefaultAddress()
                } else {
                    this.getAddressInfo(addId)
                }
                this.getOrderInfo();
            },

            // 获取默认地址
            getDefaultAddress() {
                // 获取默认 地址
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    this.addressList = res.data;
                    if (res.data.length > 0) {
                        res.data.map((item) => {
                            if (item.isDefault) {
                                this.addressInfo = item;
                                this.hasAddress = true;
                            }
                        })
                    } else {
                        this.hasAddress = false;
                    }
                })
                this.getOrderInfo();
            },
            // 当有选择地址时
            getAddressInfo(addId) {
                this.$http.post('/userAddress/getOneAddrDateil', {
                    id: addId
                }, (res) => {
                    this.addressInfo = {
                        consignee: res.data.name,
                        phone: res.data.phone,
                        detailAddr: res.data.detailaddr,
                        postalCode: res.data.postalCode,
                        provinceName: res.data.province,
                        cityName: res.data.city,
                        areaName: res.data.area
                    };
                    this.hasAddress = true
                })
            },
            // 获取订单信息
            getOrderInfo() {
                this.orderInfoList = this.$comm.getStorge('subOrderList')
                let totalPrice = 0;
                let totalNum = 0;
                let carts = [];
                this.orderInfoList.map((item)=>{
                    carts.push(item.id);
                    totalNum += parseFloat(item.number);
                    totalPrice += Math.round(parseFloat(item.price) * 100 * parseFloat(item.number)) / 100;
                });
                this.carts = carts;
                this.totalNum = totalNum;
                this.totalMoney = totalPrice.toFixed(2);

            },
            // 选择收货地址
            goSelect() {
                this.$router.push({path: 'addressSelect', query: {userId: this.userId}})
            },
            // 提交订单
            submitFn(){

                if (!this.hasAddress) {
                    this.$dialog.toast({
                        mes: '请选择收货地址！',
                        timeout: 1500
                    })
                    return;
                }
                let address = this.addressInfo.provinceName + this.addressInfo.cityName + this.addressInfo.areaName + this.addressInfo.detailAddr;
                this.$http.post('/myCays/clearCarts', {
                    carts: this.carts,
                    totalPrice: this.totalMoney,
                    phone: this.addressInfo.phone,
                    addr: address,
                    consignee: this.addressInfo.consignee,
                    postalCode: this.addressInfo.postalCode
                }, (res) => {
                    if (this.$comm.isIos()) {
                        goPay(res.data);
                    } else if (this.$comm.isAndroid()) {
                        let data = res.data;
                        window.location.href = 'http://www.yichuangpt.com/static/goPay.html?appId=' + data.appId + '&prepayId=' + data.prepayid + '&nonceStr=' + data.noncestr + '&timeStamp=' + data.timestamp + '&sign=' + data.sign;
                    }
                }, (err) => {
                    let errMsg = err.msg ? err.msg : '下单失败，请重试！'
                    this.$dialog.toast({
                        mes:errMsg
                    })
                    return;
                })
            }
        }
    }
</script>

<style scoped>
    .nav_bar{
        width:100%;
        height:1rem;
        background: #fff;
        line-height: 1rem;
        position: relative;
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
    .address_item {
        height: 52px;
        width: 100%;
        margin-top: 0.28rem;
        background: #fff;
        line-height: 52px;
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

    .good_list {
        width: 100%;
        margin-bottom:2.2rem;
    }

    .good_list > li {
        min-height: 2.08rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: stretch;
        padding: 0.2rem 0.24rem;
        margin-top: 0.2rem;
        overflow: hidden;

    }
    .price_num{
        width:100%;
        padding:0.1rem 0;
        display: flex;
        justify-content: space-between;
        align-items:center;
        align-content: center;
    }
    .car_center {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        align-content: center;
    }

    .car_center .goods_detail {
        min-height: 1.6rem;
        width: 3rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        align-content: stretch;
        padding: 0 0.2rem;
    }

    .car_center .goods_img {
        width: 1.6rem;
        height: 1.6rem;
    }

    .car_center .goods_img img {
        width: 100%;
        height: 100%;
    }

    .car_footer {
        width: 100%;
        height:2rem;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }

    .car_tool {
        border-top: 1px solid #f4f4f4;
        border-bottom: 1px solid #f4f4f4;
    }

    .car_tool p {
        line-height: 1rem;

    }

    .car_tool span {
        min-width: 2rem;
        text-align: center;
        line-height: 1rem;
    }

    .car_tool, .car_end {
        height: 1rem;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding-left: 0.24rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .car_end p {
        line-height: 1rem;
    }

    .sub_btn {
        height: 1rem;
        width: 2rem;
        font-size: 0.32rem;
    }
</style>

