<template>
    <div class="page">
        <div class="page_nav">
            <div class="page_nav_left" @click.stop="backPage">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </div>
            <div class="page_nav_right">
                <yd-button type="warning" size="small" color="#fff" bgcolor="#F76B1C"
                           @click.native="$comm.downLoadApp()">APP下载
                </yd-button>
            </div>

        </div>
        <div class="shop_top" ref="shoptop"
             :style="{backgroundImage: 'url('+ shopInfo.shopBackground +')', backgroundSize:'cover',backgroundPosition:'center'}">
            <div class="shop_info">
                <img :src="shopInfo.shopLogo" alt="">
                <div class="shop_detail c-fff">
                    <h3 class="fs-16">{{shopInfo.shopName}}</h3>
                    <p class="fs-14 mt-10" style="white-space: normal;">{{shopInfo.shopInfo}}</p>
                </div>
            </div>
        </div>
        <yd-tab border-color="#f4f4f4" color="#B0B0B0" active-color="#333333">
            <yd-tab-panel label="商品" :style="{ height: scrollHeight + 'px'}" class="tabLabel">
                <yd-list theme="2">
                    <yd-list-item v-for="(item, key) in goodList" :key="key" style="position: relative;"
                                  @click.native="checkGoodsDetail(item.id)">
                        <img slot="img" :src="item.goodsImg">
                        <span slot="title">{{item.goodsName}}</span>
                        <yd-list-other slot="other" style="margin-top:6px;">
                            <div>
                                <span class="list-price  c-money"><em>¥</em>{{item.price}}</span>
                                <span class="fs-12 c-b0" style="margin-left:4px;">{{item.count || '0'}}人付款</span>
                            </div>
                        </yd-list-other>

                    </yd-list-item>
                </yd-list>
                <p v-if="goodList.length > 0 ? true :false" class="tac fs-12 c-b0" style="padding:0.1rem;"> 没有数据啦~</p>

                <white-page v-if="goodList.length ==  0 ? true :false"></white-page>

            </yd-tab-panel>
            <yd-tab-panel label="原创" :style="{ height: scrollHeight + 'px'}"
                          style="overflow-y:auto;padding:0.1rem 0.2rem;">
                <ul class="pre_list">
                    <li v-for="(cell, pre) in presellList" :key="pre" class="hasBra" @click="checkPresell(cell.id)"
                        style="position: relative;">
                        <div class="pre_inner">
                            <time-left :endTime="cell.endTime"></time-left>
                            <img class="pre_img" :src="cell.firstImg">
                            <p class="fs-14 c-60" style="padding:0.1rem 0.2rem;">{{cell.designName}}</p>
                            <div class="fs-12 two_row pre_info" style="padding:0.1rem 0.2rem;">
                                {{cell.info}}
                            </div>
                            <div class="pre_detail">
                                <div>
                                    <img class="pre_head" :src="cell.userImg" alt="">
                                    <span class="fs-12 c-b0">{{cell.name}}</span>
                                </div>
                                <div>
                                    <img class="pre_zan" src="../../assets/161.png" alt="">
                                    <span class="fs-12 c-b0">{{cell.likeCount}}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-if="presellList.length > 0 ? true :false" class="tac fs-12 c-b0" style="padding:0.1rem;">没有数据啦~</p>
                <white-page v-if="presellList.length ==  0 ? true :false"></white-page>
            </yd-tab-panel>
        </yd-tab>
    </div>


</template>

<script>
    import TimeLeft from '@/components/timeleft'
    import WhitePage from '@/components/whitePage'

    export default {
        name: "share-shop-detail",
        components: {TimeLeft, WhitePage},
        data() {
            return {
                scrollHeight: 0,
                bgImg: 'https://appyichuang.oss-cn-hangzhou.aliyuncs.com/img/test/9c6fba1d-9e30-4de8-a0a3-288ef891687a-1544779381566',
                shopInfo: {}, //店铺信息
                goodList: [], //商品列表
                presellList: [], //预售列表
                userCode: '',
                userOpenId: ''
            }
        },
        created() {
            this.shopId = this.$comm.getUrlKey('state') || '230849995971104768';
            this.userCode = this.$comm.getUrlKey('code') || '';
            if (this.isCheck) {
                this.getConcerShop();
            }
            if (this.userCode) {
                this.getOpenId();
            }
        },
        mounted() {
            this.scrollHeight = window.innerHeight - this.$refs.shoptop.offsetHeight - 46;
            this.getShopInfo();
            this.getGoodsData();
            this.getPreSellData();
        },
        methods: {
            // 返回
            backPage() {
                this.$router.back(-1);
            },
            // 获取店铺信息
            getShopInfo() {
                this.$http.post('/appUser/findUserById', {
                    userId: this.shopId
                }, (res) => {
                    if (!res.data.shopBackground) {
                        res.data.shopBackground = this.bgImg;
                    }
                    if (res.data && res.data.isOpen == 0) {
                        let that = this;
                        this.$dialog.toast({
                            mes: '该店铺已停封！',
                            timeout: 1500,
                            callback() {
                                that.backPage();
                            }
                        })
                        return;
                    }
                    this.shopInfo = res.data;
                }, (err) => {
                    let that = this;
                    this.$dialog.toast({
                        mes: err.msg,
                        timeout: 1500,
                        callback() {
                            that.backPage();
                        }
                    })
                })
            },
            // 获取openId
            getOpenId() {
                this.$http.post('/weixin/getOpenId', {
                    code: this.userCode
                }, (res) => {
                    this.$comm.setStorge('YCshareOpenId', res.data.openId)
                })
            },
            // 获取商品列表
            getGoodsData() {
                this.$dialog.loading.open('努力加载中...');
                this.$http.post('/shop/getGoodsShopById', {
                    shopId: this.shopId
                }, (res) => {
                    this.$dialog.loading.close();
                    this.goodList = res.data
                })
            },
            // 获取预售列表
            getPreSellData() {
                this.$http.post('/shop/getPreSaleByUserId', {
                    userId: this.shopId
                }, (res) => {
                    this.presellList = res.data
                })
            },
            // 查看商品详情
            checkGoodsDetail(id) {
                this.$router.push({path: '/shareGoodDetail', query: {shopGoodsId: id}})
            },
            // 查看预售商品发布详情
            checkPresell(id) {
                this.$router.push({path: '/sharePresaleDetail', query: {preSaleId: id}});
            }
        }
    }
</script>
<style>


    .yd-list-theme2 .yd-list-item:nth-child(odd) {
        padding-right: 0.05rem;
    }

    .yd-list-theme2 .yd-list-item {
        padding-top: 0.1rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    }

    .yd-list-img img {
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .yd-tab-box {
        border-bottom: 1px solid #f4f4f4;
    }
</style>
<style scoped>
    .page {
        background-color: transparent;
        height: 100%;
        overflow: hidden;
    }

    .page_nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        height: 0.88rem;
        background: transparent;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: stretch;
    }

    .page_nav_left {
        width: 1rem;
        padding: 0 0.24rem;
        height: 0.88rem;
        text-align: left;
        line-height: 0.88rem;
    }

    .page_nav_right {
        padding: 0 0.14rem;
        height: 0.88rem;
        line-height: 0.88rem;
        display: flex;
        justify-content: space-between;
        align-content: stretch;
        align-items: center;
    }

    /*店铺信息*/
    .shop_top {
        height: 4.2rem;
        width: 100%;
        background-repeat: no-repeat;
        position: relative;
    }

    .shop_info {
        min-height: 1.6rem;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-content: flex-start;
        align-items: stretch;

        padding: 0.1rem 0;
    }

    .shop_info > img {
        width: 1rem;
        height: 1rem;
        outline: none;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        margin: 0 0.2rem;
    }

    .shop_info .shop_detail {
        display: flex;
        padding: 0.1rem 0;
        flex: 2;
        flex-direction: column;
        justify-content: stretch;
        align-content: flex-start;
        align-items: flex-start;
        margin-left: 1px;
    }

    .tabLabel {
        overflow-y: auto;
        padding: 0.1rem 0.2rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    /*预售列表*/
    .pre_list {
        width: 100%;
        font-size: 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .pre_list > li {
        width: 50%;
        padding-top: 0.1rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding-right: 0.05rem;
        display: inline-block;
        overflow: hidden;
    }

    .pre_list > li:nth-child(even) {
        padding-right: 0;
        padding-left: 0.05rem;
    }

    .pre_inner {
        width: 100%;
        background: #fff;
    }

    .pre_time {
        line-height: 0.7rem;
        font-size: 0.26rem;
        height: 0.7rem;
    }

    .pre_inner > img {
        width: 100%;
        height: 3.2rem;

    }

    .pre_info {
        min-height: 0.88rem;
        line-height: 0.44rem;
    }

    .pre_detail {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        line-height: 0.44rem;
        padding: 0.1rem 0.2rem;
    }

    .pre_detail > div {
        display: flex;
        align-content: center;
    }

    .pre_head {
        width: 0.4rem;
        height: 0.4rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }

    .pre_zan {
        width: 0.34rem;
        height: 0.32rem;
    }
</style>

