<template>
    <yd-layout>
        <div class="nav_bar">
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
            <yd-cell-item arrow class="list_item" :href="{ path:'/shareAddressSelect',query:{ userId:userId}}"
                          type="link">
                <div slot="left">
                    <p> {{addressInfo.consignee}} <span class="ml-40">{{addressInfo.phone}}</span></p>
                    <div class="address_detail">{{addressInfo.provinceName + addressInfo.cityName +
                        addressInfo.areaName+addressInfo.detailAddr}}
                    </div>
                </div>
                <span slot="right"></span>
            </yd-cell-item>
        </yd-cell-group>

        <ul class="good_list">
            <li>
                <div class="car_center">
                    <div class="goods_img">
                        <img :src="goodsInfo.goodsImg" alt="">
                    </div>
                    <div class="goods_detail">
                        <div class="one_row">{{goodsInfo.goodsName}}</div>
                        <p class="fs-12 c-b0"> {{goodsInfo.spec}} </p>
                        <span class="c-b0">￥{{ goodsInfo.price}}</span>
                    </div>
                </div>
            </li>
        </ul>
        <div class="car_footer">
            <div class="car_tool ">
                <p class="fs-14 c-28">数量</p>
                <span class="c-28 fs-14">{{num}}</span>
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
        name: "share-order-submit",
        data() {
            return {
                totalMoney: 0,
                hasAddress: false,
                addressInfo: {},
                goodsInfo: {},
                num: 1,
                goodsType:''
            }
        },
        created() {
            this.userId = this.$comm.getStorge('preOrderUserId') || '';
            this.goodsId = this.$comm.getStorge('preOrderGoodsId') || '';
            this.specId = this.$comm.getStorge('preOrderSpecId') || '';
            this.goodsType =  this.$comm.getStorge('preOrderGoodsType') || '0';
            this.storeName = this.$comm.getStorge('preOrderStoreName') || '';
            this.storePhone = this.$comm.getStorge('preOrderStorePhone') || '';
            this.storeCode = this.$comm.getStorge('preOrderStoreCode') || '';
            this.num = this.$comm.getStorge('preOrderGoodsNum') || '';
            this.getPageData();
            this.YCshareOpenId = this.$comm.getStorge('YCshareOpenId') || ''
        },
        methods: {
            // 返回
            backPage() {
                this.$router.back(-1);
            },
            // 获取页面信息
            getPageData() {
                let addId = this.$comm.getStorge('selShareAddressId') || null;
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
                this.$http.post('/supplierGoodsDetail/getDetailBySpecId', {
                    detailId: this.specId
                }, (res) => {
                    this.goodsInfo = res.data;
                    this.totalMoney = (Math.round(parseFloat(this.goodsInfo.price) * 100 * parseFloat(this.num)) / 100).toFixed(2);
                })
            },
            // 选择收货地址
            goSelect() {
                this.$router.push({path: '/shareAddressSelect', query: {userId: this.userId}})
            },
            // 提交订单
            submitFn() {

                if (!this.hasAddress) {
                    this.$dialog.toast({
                        mes: '请选择收货地址！',
                        timeout: 1500
                    })
                    return;
                }
                let address = this.addressInfo.provinceName + this.addressInfo.cityName + this.addressInfo.areaName + this.addressInfo.detailAddr;
                this.$http.post('/order/createShopOrder', {
                    openId: this.YCshareOpenId,
                    goodsId: this.goodsId,
                    userId: this.userId,
                    specId: this.specId,
                    spec: this.goodsInfo.spec,
                    goodsType: this.goodsType,
                    photoPath: this.goodsInfo.goodsImg,
                    storePhone: this.storePhone,
                    storeName: this.storeName,
                    storeCode: this.storeCode,
                    price: this.goodsInfo.price,
                    goodsNum: this.num,
                    goodsName: this.goodsInfo.goodsName,
                    totalPrice: this.totalMoney,
                    phone: this.addressInfo.phone,
                    address: address,
                    consignee: this.addressInfo.consignee,
                    postalCode: this.addressInfo.postalCode,
                    payType: 'WEB'
                }, (resData) => {
                    let data = resData.data;
                    let that = this;
                    // 调起微信支付
                    function onBridgeReady() {
                        WeixinJSBridge.invoke(
                            'getBrandWCPayRequest', {
                                "appId": data.appId,     //公众号名称，由商户传入
                                "timeStamp": data.timeStamp,         //时间戳，自1970年以来的秒数
                                "nonceStr": data.nonceStr, //随机串
                                "package": data.package, //????
                                "signType": "MD5",         //微信签名方式：
                                "paySign": data.paySign, //微信签名
                                'jsApiList': ['chooseWXPay']
                            },
                            function (res) {
                                alert( JSON.stringify(res))
                                if (res.err_msg == "get_brand_wcpay_request:ok") {
                                    //支付成功后跳转的页面
                                    that.$router.push({path: '/sharePaySuccess'})
                                } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                    that.$dialog.toast({
                                        mes: '支付取消！',
                                        timeout: 1500
                                    })
                                } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                                    that.$dialog.toast({
                                        mes: '支付失败！',
                                        timeout: 1500
                                    });
                                    WeixinJSBridge.call('closeWindow');
                                }
                            }
                        );
                    }

                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                }, (err) => {
                    let errMsg = err.msg ? err.msg : '下单失败，请重试!';
                    this.$dialog.toast({
                        mes: errMsg,
                        timeout: 1500
                    })
                    return;
                })
            }
        }
    }
</script>

<style scoped>
    .nav_bar {
        width: 100%;
        height: 1rem;
        background: #fff;
        line-height: 1rem;
        position: relative;
    }

    .nav_cell {
        width: 1rem;
        padding-left: 0.24rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
    }

    .nav_title {
        width: 100%;
        height: 1rem;
        text-align: center;
        font-size: 0.3rem;
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
        height: 2rem;
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
