<template>
    <yd-layout class="page">
        <yd-navbar slot="top" title="商品详情" class="page_nav">
            <router-link to="/back" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
        </yd-navbar>

        <yd-slider v-if="isReady" autoplay="30000" pagination-color="#fff" pagination-activecolor="#fff"
                   :style="{height:swiperHeight}">
            <yd-slider-item v-for="(item,index) in goodInfo.goodsImgs" :key="index">
                <a>
                    <img :src="item">
                </a>
            </yd-slider-item>
        </yd-slider>
        <div class="good_info"  v-if="isReady">
            <div class="good_info_head" >
                <p class="fs-16 c-333 goods_name">{{goodInfo.goodsName}}</p>
                <div v-if="goodInfo.spec">
                    <p class="good_prop">价格 <span class="fs-16 c-money">￥{{goodInfo.spec.price || 0.00}} </span><span class="c-money plr-10">佣金：￥{{goodInfo.spec.commission }}</span>  <span class="fs-12 c-b0 plr-10">销量: {{goodInfo.salesVolume}}</span></p>
                    <div class="good_attr">
                        <span class="good_label">{{goodInfo.label}}</span>
                        <span class="good_baotui">七天包退</span>
                        <span class="good_trans">商家配送</span>
                    </div>
                </div>
                <div class="good_intro fs-12 ">
                    {{goodInfo.goodsInfo}}
                </div>
            </div>
        </div>

        <div class="good_detail"  v-if="isReady">
            <div class="good_detail_title tac">
                <span class="fs-14">详情</span>
            </div>
            <div class="good_detail_img">
                <img v-for="(cell,ind) in goodInfo.goodsInfoImgs" :key="ind" :src="cell" alt="">
            </div>
        </div>

        <div class="goods_footer"  v-if="isReady" slot="bottom">
            <yd-button size="large" v-if="goodInfo.isUpperShelf == '0'" bgcolor="#000" color="#fff" shape="angle" class="buy_btn" @click.native="submitFn">
                上架
            </yd-button>
            <yd-button v-else   size="large"  bgcolor="#000" color="#fff" shape="angle" class="buy_btn" @click.native="hasUpper">
                已上架
            </yd-button>
        </div>
    </yd-layout>
</template>

<script>
    export default {
        name: "supply-goods",
        data() {
            return {
                isReady: false,
                swiperHeight: 0,
                userId: '',
                goodInfo: {},
                shopCode: ''
            }
        },
        created() {
            this.swiperHeight = window.innerWidth + 'px';
            this.shopGoodsId = this.$comm.getUrlKey('supplierGoodsId') || '238096800551145472';
            this.userId = this.$comm.getUrlKey('userId') || '230849995971104768';
            this.shopCode = this.$comm.getUrlKey('shopCode') || '230849995971104768';
            this.getGoodDetail();
        },
        methods: {
            // 获取商品信息
            getGoodDetail() {
                this.$dialog.loading.open('努力加载中...');
                this.$http.post('/type/detailSup', {
                    userId: this.userId,
                    supplierGoodsId: this.shopGoodsId
                }, (res) => {
                    this.$dialog.loading.close();
                    this.isReady = true;
                    this.goodInfo = res.data;
                }, (err) => {
                    this.$dialog.loading.close();
                    this.$dialog.toast({
                        mes: err.msg,
                        timeout: 1500
                    })
                })
            },
            // 上架
            submitFn() {
                this.$dialog.confirm({
                    mes: '确认上架该商品？',
                    opts: () => {
                        this.$http.post('/shop/upperShop', {
                            shopCode: this.shopCode,
                            goodsId: this.goodInfo.spec.supplierGoodsId
                        }, (res) => {
                            this.$dialog.toast({
                                mes: '上架成功！',
                                timeout: 1500
                            })
                            this.goodInfo.isUpperShelf = '1'
                            return;
                        }, (err) => {
                            this.$dialog.toast({
                                mes: '上架失败，请重试！',
                                timeout: 1500
                            })
                        })
                    }
                })
            },
            hasUpper(){
                this.$dialog.toast({
                    mes: '该商品已上架！',
                    timeout: 1500
                })
            }
        }
    }
</script>
<style>

    .yd-slider-pagination-item.yd-slider-pagination-item-active {
        background-color: #fff !important;
    }

    .yd-slider-item img, .yd-slider-item a {
        height: 100%;
    }

    .yd-slider-pagination {
        bottom: 1.1rem;
    }

    .yd-btn-block {
        margin-top: 0;
    }

    .yd-popup-content {
        overflow-y: visible;
    }
</style>
<style scoped>
    .shop_icon {
        height: 100%;
        width: 1rem;
        display: inline-block;
        background: url("../../assets/dianpu.png") no-repeat 0.4rem center;
        background-size: 0.48rem 0.48rem;
    }

    .good_info {
        min-height: 3rem;
        background: #fff;
        margin: -1rem 0.24rem 0.2rem;
        position: relative;
        z-index: 10;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
    }

    .good_info_head {
        padding: 0.1rem 0.2rem;
    }

    .good_intro {
        border-top: 1px solid #f4f4f4;
        color: #939393;
        padding: 0.1rem 0;
    }

    .good_prop {
        padding: 0.2rem 0;
    }

    .good_prop, .good_attr {
        padding: 0.12rem 0;
    }

    .good_attr .good_label {
        display: inline-block;
        padding-left: 0.4rem;
        font-size: 12px;
        margin-right: 0.2rem;
        background: url("../../assets/good_label.png") no-repeat center left;
        background-size: 0.24rem 0.24rem;
    }

    .good_attr .good_trans {
        display: inline-block;
        font-size: 12px;
        margin-right: 0.2rem;
        padding-left: 0.4rem;
        background: url("../../assets/good_trans.png") no-repeat center left;
        background-size: 0.28rem 0.2rem;
    }
    .good_attr .good_baotui {
        display: inline-block;
        font-size: 12px;
        margin-right: 0.2rem;
        padding-left: 0.4rem;
        background: url("../../assets/baotui_icon.png") no-repeat center left;
        background-size: 0.24rem 0.24rem;
    }
    .goods_name {
        white-space: normal;
        line-height: 0.6rem;
    }

    .good_detail {
        background: #fff;
        margin: 0.2rem 0.24rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
    }

    .good_detail_title {
        height: 0.88rem;
        font-size: 14px;
        color: #333;
        padding: 0;
        border-bottom: 1px solid #f4f4f4;
    }

    .good_detail_title span {
        height: .84rem;
        line-height: .84rem;
        display: inline-block;
        border-bottom: 1px solid #333;
    }

    .good_detail_img {
        overflow: hidden;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 0.2rem;
    }

    .good_detail_img img {
        display: inline-block;
        width: 100%;
    }

    .page {
        padding: 1rem 0 1.02rem;
    }

    .page_nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }

    .goods_footer {
        height: 1.02rem;
        background: #000;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .buy_btn {
        width: 100%;
        height: 100%;
    }
</style>

