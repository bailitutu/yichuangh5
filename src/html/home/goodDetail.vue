<template>
    <div>
        <div class="nav_bar">
            <div class="nav_cell" @click.prevent="backFn">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title">商品详情</p>
            <div class="nav_cell_right" v-if="goodInfo.shop" @click="checkShop">
                <span class="shop_icon"></span>
            </div>
        </div>
        <yd-slider autoplay="30000" pagination-color="#fff" pagination-activecolor="#fff" style="margin-top:1rem;"
                   :style="{height:swiperHeight}">
            <yd-slider-item v-for="(item,index) in goodInfo.goodsImg" :key="index">
                <a>
                    <img :src="item" >
                </a>
            </yd-slider-item>
        </yd-slider>
        <div class="good_info">
            <div class="good_info_head" v-if="goodInfo.goods">
                <p class="fs-16 c-333 goods_name">{{goodInfo.goods.goodsName}}</p>
                <div v-if="goodInfo.detail">
                    <p class="good_prop">价格 <span class="fs-16 c-money">￥{{goodInfo.detail[0].price || '0.00'}}</span>
                    </p>
                    <div class="good_attr">
                        <span class="good_label">{{goodInfo.goods.label}}</span>
                        <span class="good_baotui">七天包退</span>
                        <span class="good_trans">商家配送</span>
                    </div>
                </div>
                <div class="good_intro fs-12 ">
                    {{goodInfo.goods.goodsInfo}}
                </div>
            </div>
        </div>
        <div class="good_detail">
            <div class="good_detail_title tac">
                <span class="fs-14">详情</span>
            </div>
            <div class="good_detail_img">
                <img v-for="(cell,ind) in goodInfo.goodsInfoImg" :key="ind" src="" v-lazy="cell" alt="">
            </div>
        </div>
        <yd-popup class="attr_section" v-model="showSelect" position="bottom" height="60%">
            <div class="sel_good_img" v-show="showSelect" v-if="goodInfo.goodsImg">
                <img :src="goodInfo.goodsImg[0]" class="hasBra" alt="">
            </div>
            <div class="sel_good_info" v-show="showSelect">
                <p class="c-money fs-14">￥<span class="fs-16">{{buyGoodsInfo.price}}</span></p>
                <p class="fs-14 c-9b">库存：{{buyGoodsInfo.stock}}</p>
            </div>
            <p class="fs-16 c-28 plr-12" v-show="showSelect">规格分类</p>
            <ul class="attr_list" v-if="goodInfo.detail" v-show="showSelect">
                <li v-for="(att,atti) in goodInfo.detail" :key="atti">
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333"
                               @click.native="selectAttr(atti)" class="attr_btn" :class=" att.selected ? 'active': ''">
                        {{att.spec}}
                    </yd-button>
                </li>
            </ul>

            <div class="sel_good_footer" v-show="showSelect">
                <div class="sel_good_cell">
                    <span class="fs-14">购买数量</span>
                    <yd-spinner  unit="1" min="1" width="1.6rem" height="0.45rem"
                                v-model="buyNumber"></yd-spinner>
                </div>
                <yd-button size="large" shape="angle" bgcolor="#000" class="submit_btn" color="#fff"
                           @click.native="submitFn">确定
                </yd-button>
            </div>
        </yd-popup>
        <yd-flexbox class="goods_footer">
            <yd-flexbox-item class="connect_cell" @click.native="connctShop()">
                <img src="../../assets/connct_shop.png" alt="">
                <p class="fs-12">联系店主</p>
            </yd-flexbox-item>
            <yd-flexbox-item>
                <yd-button size="large" bgcolor="#fff" color="#000" class="addCar_btn" @click.native="addCar">加入购物车
                </yd-button>
            </yd-flexbox-item>
            <yd-flexbox-item>
                <yd-button size="large" bgcolor="#000" color="#fff" class="buy_btn" @click.native="buyNow">立即购买
                </yd-button>
            </yd-flexbox-item>
        </yd-flexbox>
    </div>
</template>

<script>
    export default {
        name: "good-detail",
        data() {
            return {
                swiperHeight: 0,
                userId: '',
                goodInfo: {},
                showSelect: false,//选择规格
                buyGoodsInfo: {},
                buyNumber: 1,
                buyType: 1,
            }
        },
        mounted() {
            this.swiperHeight = window.innerWidth + 'px'; //设置轮播图高度
            this.shopGoodsId = this.$comm.getUrlKey('shopGoodsId') || '220333521498148864';
            this.userId = this.$comm.getUrlKey('userId') || '224418465157615616';
            this.getGoodDetail();
        },
        methods: {
            // 返回
            backFn() {
                if (this.$comm.getUrlKey('isH5') ) {
                    this.$router.back(-1);
                } else {
                    this.$comm.normalBack();
                }
            },
            // 跳转店铺
            checkShop(){
                if(this.goodInfo.shop.isOpen == 0){
                    this.$dialog.toast({
                        mes:'该店铺已停封！',
                        timeout:1500
                    })
                    return;
                }
                this.$router.push({ path:'/shopDetail',query:{ isCheck: 1, shopId: this.goodInfo.shop.shopId,userId:this.userId}})
            },
            // 获取商品信息
            getGoodDetail() {
                this.$dialog.loading.open('努力加载中...');
                this.$http.post('/type/detail', {
                    shopGoodsId: this.shopGoodsId,
                }, (res) => {
                    this.$dialog.loading.close();
                    this.goodInfo = res.data;
                    if (this.goodInfo.detail.length > 0) {
                        this.goodInfo.detail = this.goodInfo.detail.map((item) => {
                            Object.assign(item, {selected: false});
                            return item;
                        })
                    }
                }, (err) => {
                    this.$dialog.loading.close();
                    this.$dialog.toast({
                        mes: err.msg,
                        timeout: 1500
                    })
                })
            },
            // 联系店主 跳转原生
            connctShop() {
                if(this.userId == this.goodInfo.shop.shopId){
                    this.$dialog.toast({
                        mes:'这是你自家商品哦~'
                    })
                    return;
                }

                let shopPhone = this.goodInfo.shop.shopPhone;
                if (this.$comm.isAndroid()) {
                    window.location.href = 'http://www.yichuangpt.com/static/gochat.html?phone=' + shopPhone;
                } else if (this.$comm.isIos()) {
                    goChat(shopPhone)
                }
            },
            // 加入购物车
            addCar() {
                if(this.goodInfo.shop.isOpen == 0){
                    this.$dialog.toast({
                        mes:'该店铺已停封！',
                        timeout:1500
                    })
                    return;
                }
                this.showSelect = true;
                this.buyType = 1;
                this.setSelectDefault();
            },
            // 立即购买
            buyNow() {
                if(this.goodInfo.shop.isOpen == 0){
                    this.$dialog.toast({
                        mes: '该店铺已停封！',
                        timeout:1500
                    })
                    return;
                }
                this.showSelect = true;
                this.buyType = 2;
                this.setSelectDefault();
            },
            // 选择商品规格
            selectAttr(i) {
                this.goodInfo.detail = this.goodInfo.detail.map((item) => {
                    item.selected = false;
                    return item;
                });
                this.goodInfo.detail[i].selected = true;
                this.buyGoodsInfo = this.goodInfo.detail[i];
            },
            // 设置默认选中的规格
            setSelectDefault() {
                let arr = Object.keys(this.buyGoodsInfo);
                if( arr.length == 0 ){
                    this.goodInfo.detail[0].selected = true;
                    this.buyGoodsInfo = this.goodInfo.detail[0];
                }
            },
            // 选择规格完成确认
            submitFn() {
                // 判断当前库存是否足够
                if (parseInt(this.buyNumber) > parseInt(this.buyGoodsInfo.stock)) {
                    this.$dialog.toast({
                        mes: '库存不足',
                        timeout: '1500'
                    });
                    return;
                }
                // let totalPrice = 0;
                // totalPrice = Math.floor(parseInt(this.buyNumber) * parseFloat(this.buyGoodsInfo.price) * 100) / 100;

                // 判断是加入购物车还是立即购买
                if (this.buyType == 1) {
                    this.$http.post('/type/addShoppingCart', {
                        goodsId: this.shopGoodsId,
                        userId: this.userId,
                        number: this.buyNumber,
                        specId: this.buyGoodsInfo.id,
                        price: this.buyGoodsInfo.price
                    }, (res) => {
                        this.$dialog.toast({
                            mes: '加入购物车成功！',
                            timeout: '1500'
                        });
                        this.showSelect = false;
                        this.getGoodDetail();
                        this.buyGoodsInfo = {}
                    }, (err) => {
                        this.$dialog.toast({
                            mes: err.msg,
                            timeout: 1500
                        })
                    })
                } else if (this.buyType == 2) {

                    // 跳转原生页面
                    let goodsId = this.shopGoodsId;
                    let specId = this.buyGoodsInfo.id;
                    let goodsNum = this.buyNumber;
                    // 跳转结算页面
                    this.$router.push({
                        path: 'orderSubmit',
                        query: {userId: this.userId, goodsId: goodsId, specId: specId, num: goodsNum}
                    });
                    this.$comm.setStorge('YCOrderBackUrl', this.$route.fullPath);
                    this.$comm.setStorge('preOrderGoodsId', goodsId);
                    this.$comm.setStorge('preOrderSpecId', specId);
                    this.$comm.setStorge('preOrderGoodsNum', goodsNum);
                    this.$comm.setStorge('preOrderUserId', this.userId);
                }

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

    .yd-cell-box {
        margin-bottom: 0;
    }

    .yd-popup-content {
        overflow-y: visible !important;
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
    .nav_cell_right{
        width:1rem;
        padding-right:0.24rem;
        position: absolute;
        top:0;
        right:0;
        z-index: 10;
    }
    .shop_icon {
        height: 1rem;
        width: 1rem;
        display: inline-block;
        background: url("../../assets/dianpu.png") no-repeat center center;
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
        margin: 0.2rem 0.24rem 1.2rem;
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
        font-size:0;
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
    .attr_section{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-content: stretch;
        align-items:center;
    }
    .goods_footer {
        border-top: 1px solid #f4f4f4;
        height: 1.02rem;
        background: #fff;
        position: fixed;
        bottom:0;
        left:0;
        right:0;
        z-index: 1000;
    }

    .connect_cell {
        width: 2rem;
        flex: none;
        text-align: center;
    }

    .connect_cell img {
        width: 0.44rem;
        height: 0.4rem;
    }

    .connect_cell p {
        text-align: center;
        color: #939393;
    }

    .addCar_btn {
        border: 1px solid #000;
        height: 0.7rem;
        width: 2.4rem;
    }

    .buy_btn {
        width: 2.4rem;
        height: 0.7rem;
    }

    .submit_btn {
        height: 1rem;
        border:none;
        outline: none;
    }

    /*选择规格弹窗*/
    .sel_good_img {
        position: absolute;
        top: -0.4rem;
        left: 0.4rem;
        width: 2rem;
        height: 2rem;
        background: #fff;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
        padding: 0.1rem;
        z-index: 1550;
    }

    .sel_good_img img {
        width: 1.8rem;
        height: 1.8rem;
    }
    .sel_good_cell{
        display: flex;
        justify-content: space-between;
        height:1rem;
        padding:0 0.24rem;
        background: #fff;
        align-items: center;
        align-content: center;
    }
    .sel_good_info {
        padding: 0 2.6rem;
        background: #fff;
        height: 1.6rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        align-content: stretch;
    }

    .sel_good_info p {
        padding: 0.2rem 0;
    }

    .attr_list {
        width: 100%;
        font-size: 0;
        height: 3rem;
        overflow-y: auto;
    }

    .attr_list li {
        display: inline-block;
        font-size: 0.28rem;
        color: #333;
        padding: 0.2rem 0.24rem;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
    }

    .attr_btn {
        border: 1px solid transparent;
    }

    .active {
        border: 1px solid #939393;
    }

    .sel_good_footer {
        border-top: 1px solid #f4f4f4;
        position:absolute;
        bottom:0;
        left:0;
        right:0;
        z-index: 1;
        background: #000;
    }

</style>
