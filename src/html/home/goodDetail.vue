<template>
    <yd-layout >
        <yd-navbar title="商品详情" class="page_nav">
            <router-link to="/" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
            <router-link slot="right" to="/shopDetail">
                <span class="shop_icon"></span>
            </router-link>
        </yd-navbar>

        <yd-slider autoplay="30000" pagination-color="#fff" pagination-activecolor="#fff" style="margin-top:1rem;"
                   :style="{height:swiperHeight}">
            <yd-slider-item v-for="(item,index) in goodInfo.goodsImg" :key="index">
                <a>
                    <img :src="item">
                </a>
            </yd-slider-item>
        </yd-slider>
        <div class="good_info">
            <div class="good_info_head" v-if="goodInfo.goods">
                <p class="fs-16 c-333 goods_name">{{goodInfo.goods.goodsName}}</p>
                <div v-if="goodInfo.detail">
                    <p class="good_prop">价格 <span class="fs-16 c-money">￥{{goodInfo.detail[0].price || 0.00}}</span></p>
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
                <img v-for="(cell,ind) in goodInfo.goodsInfoImg" :key="ind" :src="cell" alt="">
            </div>
        </div>

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

        <yd-popup v-model="showSelect" position="bottom" height="60%">
            <div class="sel_good_img" v-show="showSelect">
                <img src="../../assets/goods.png" class="hasBra" alt="">
            </div>
            <div class="sel_good_info">
                <p class="c-money fs-14">￥<span class="fs-16">{{buyGoodsInfo.price}}</span></p>
                <p class="fs-14 c-9b">库存：{{buyGoodsInfo.stock}}</p>
            </div>
            <p class="fs-16 c-28 plr-12">规格分类</p>
            <ul class="attr_list" v-if="goodInfo.detail">
                <li v-for="(att,atti) in goodInfo.detail" :key="atti">
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333" @click.native="selectAttr(atti)" class="attr_btn" :class=" att.selected ? 'active': ''">{{att.spec}}</yd-button>
                </li>
            </ul>

            <div class="sel_good_footer">
                <yd-cell-group>
                    <yd-cell-item>
                        <span slot="left">购买数量</span>
                        <yd-spinner slot="right" max="100" unit="1" width="1.6rem" height="0.45rem" v-model="buyNumber"></yd-spinner>
                    </yd-cell-item>
                </yd-cell-group>
                <yd-button size="large" shape="angle" bgcolor="#000" color="#fff" :disabled="buyGoodsInfo.stock == '0'" @click.native="submitFn">确定</yd-button>
            </div>
        </yd-popup>
    </yd-layout>
</template>

<script>
    export default {
        name: "good-detail",
        data() {
            return {
                swiperHeight: 0,
                userId:'',
                goodInfo: {},
                showSelect: false,//选择规格
                buyGoodsInfo:{},
                buyNumber: 1,
                buyType:1,
            }
        },
        created() {
            this.swiperHeight = window.innerWidth + 'px'; //设置轮播图高度
            this.shopGoodsId = this.$comm.getUrlKey('shopGoodsId') || '231225779655151616';
            this.userId = this.$comm.getUrlKey('userId') || '224418465157615616';
            this.getGoodDetail();
        },
        methods: {
            // 获取商品信息
            getGoodDetail() {
                this.$dialog.loading.open('努力加载中...');
                this.$http.post('/type/detail', {
                    shopGoodsId: this.shopGoodsId,
                }, (res) => {
                    this.$dialog.loading.close();
                    this.goodInfo = res.data;
                    if( this.goodInfo.detail.length> 0 ){
                        this.goodInfo.detail = this.goodInfo.detail.map((item)=>{
                            Object.assign(item,{selected : false});
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
                let shopPhone = this.goodInfo.shop.shopPhone;
                console.log(shopPhone)


            },
            // 加入购物车
            addCar() {
                this.showSelect = true;
                this.buyType = 1;
                this.setSelectDefault();
            },
            // 立即购买
            buyNow() {
                this.showSelect = true;
                this.buyType = 2;
                this.setSelectDefault();
            },
            // 选择商品规格
            selectAttr(i){
                this.goodInfo.detail = this.goodInfo.detail.map((item)=>{item.selected = false ;return item;});
                this.goodInfo.detail[i].selected = true;
                this.buyGoodsInfo = this.goodInfo.detail[i];
            },
            // 设置默认选中的规格
            setSelectDefault(){
                if(!this.buyGoodsInfo.length){
                    this.goodInfo.detail[0].selected = true;
                    this.buyGoodsInfo =  this.goodInfo.detail[0];
                }
            },
            // 选择规格完成确认
            submitFn(){
                // 判断当前库存是否足够
                if( parseInt( this.buyNumber) > parseInt(this.buyGoodsInfo.stock) ){
                    this.$dialog.toast({
                        mes:'库存不足',
                        timeout:'1500'
                    });
                    return;
                }
                let totalPrice = 0;
                totalPrice =Math.floor( parseInt(this.buyNumber) * this.buyGoodsInfo.price * 100)/100;

                // 判断是加入购物车还是立即购买
                if(this.buyType == 1){
                    this.$http.post('/type/addShoppingCart', {
                        goodsId: this.shopGoodsId,
                        userId:this.userId,
                        number:this.buyNumber,
                        specId: this.buyGoodsInfo.id,
                        price: totalPrice,
                    }, (res) => {
                        this.$dialog.toast({
                            mes:'加入购物车成功！',
                            timeout:'1500'
                        });
                        this.showSelect = false;
                        return;
                    }, (err) => {
                        this.$dialog.toast({
                            mes: err.msg,
                            timeout: 1500
                        })
                    })
                }else if(this.buyType == 2){
                    console.log(2222)

                    // 跳转原生页面
                    let goodsId = this.shopGoodsId ;
                    let specId = this.buyGoodsInfo.id ;
                    let goodsNum = this.buyNumber ;
                    // 跳转结算页面
                    window.location.href = 'http://www.yichuangpt.com/static/h5/yichuang-H5/html/shop-user/order-submit.html?userId='+ this.userId+'&goodsId='+ goodsId+'&specId='+ specId +'&num='+ goodsNum





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
        background-size: 0.28rem 0.2rem;
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
        border-top: 1px solid #f4f4f4;
        height: 1.02rem;
        background: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
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
    .sel_good_info{
        padding:0 2.6rem;
        background: #fff;
        height:1.6rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items:flex-start;
        align-content:stretch;
    }
    .sel_good_info p{
        padding:0.2rem 0;
    }

    .attr_list{
        width: 100%;
        font-size:0;
        height:3rem;
        overflow-y:auto;
    }
    .attr_list li{
        display: inline-block;
        font-size:0.28rem;
        color:#333;
        padding:0.2rem 0.24rem;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
    }
    .attr_btn{
        border:1px solid transparent;
    }
    .active{
        border:1px solid #939393;
    }
    .sel_good_footer {
        border-top: 1px solid #f4f4f4;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
    }

</style>
