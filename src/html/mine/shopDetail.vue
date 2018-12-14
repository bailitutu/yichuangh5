<template>
    <yd-layout class="page" link="/back">
        <yd-navbar bgcolor="rgba(255,255,255,0)"  class="page_nav">
            <router-link to="" @click.native="backPage()"  slot="left">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </router-link>
            <router-link slot="right" to="" @click.native.prevent="shareFn">
                <span class="share_icon"></span>
            </router-link>
            <router-link slot="right" to="/record" class="goHistory">
                <span class="c-fff">交易记录</span>
            </router-link>
        </yd-navbar>
        <div class="shop_top" ref="shoptop" :style="{backgroundImage: 'url('+ bgImg+')', backgroundSize:'cover',backgroundPosition:'center'}">
            <div class="shop_info">
                <img :src="shopInfo.shopLogo" alt="">
                <div class="shop_detail c-fff">
                    <h3 class="fs-16">{{shopInfo.shopName}}</h3>
                    <p class="fs-14">店铺码:{{shopInfo.shopCode}}</p>
                    <p class="fs-14 " style="white-space: normal;">{{shopInfo.shopInfo}}</p>
                </div>
            </div>
            <div class="shop_right">
                <yd-button size="small" bgcolor="#fff" color="#333" class="shop_btn" @click.native="upperFn">上架</yd-button>
                <yd-button size="small" bgcolor="#fff" color="#333" class="shop_btn" @click.native="presellFn">预售</yd-button>
            </div>
        </div>
        <yd-tab border-color="#f4f4f4" color="#B0B0B0" active-color="#333333">
            <yd-tab-panel label="商品" :style="{ height: scrollHeight + 'px'}" style="overflow-y:auto;padding:0.1rem 0.2rem;">

                <yd-list theme="2"  >
                    <yd-list-item v-for="item, key in goodList" :key="key" style="position: relative;">
                        <img slot="img" :src="item.goodsImg">
                        <span slot="title">{{item.goodsName}}</span>
                        <div slot="other" @click="downSell(item.id)" class="xiajia_btn"></div>
                        <yd-list-other slot="other" style="margin-top:6px;">
                            <div>
                                <span class="list-price  c-money" ><em>¥</em>{{item.price}}</span>
                                <span class="list-del-price  c-money">佣 <em>¥</em>{{parseInt(item.commission)}}</span>
                                <span class="fs-12 c-b0" style="margin-left:4px;">{{item.count || '000'}}人付款</span>
                            </div>
                        </yd-list-other>

                    </yd-list-item>
                </yd-list>

                <p class="tac fs-12 c-b0" style="padding:0.1rem;"> 没有数据啦~</p>
            </yd-tab-panel>
            <yd-tab-panel label="预售" :style="{ height: scrollHeight + 'px'}" style="overflow-y:auto;padding:0.1rem 0.2rem;">
                <ul  class="pre_list" >
                    <li v-for="(cell, pre) in presellList" :key="pre"  class="hasBra" style="position: relative;">
                        <div class="pre_inner">
                            <p class="c-money tac pre_time" >剩余时间：75:23:00</p>
                            <img  class="pre_img" :src="cell.firstImg">
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

                <p class="tac fs-12 c-b0" style="padding:0.1rem;"> 没有数据啦~</p>

            </yd-tab-panel>
        </yd-tab>
    </yd-layout>


</template>

<script>
    export default {
        name: "shop-detail",
        data(){
            return {
                scrollHeight:0,
                bgImg: require('@/assets/banner.png'),
                page: 1,
                pageSize: 10,
                shopInfo:{},
                goodList:[],
                presellList:[]
            }
        },
        created(){
            this.shopId = this.$comm.getUrlKey('shopId') || '230849995971104768';
        },
        mounted(){
            this.scrollHeight = window.innerHeight - this.$refs.shoptop.offsetHeight - 43 ;
            this.getShopInfo();
            this.getGoodsData();
            this.getPreSellData();
        },
        methods: {

            // 获取店铺信息
            getShopInfo(){
                this.$http.post('/appUser/findUserById', {
                    userId: this.shopId
                },(res)=>{
                    this.shopInfo = res.data
                })
            },
            // 获取商品列表
            getGoodsData(){
                this.$http.post('/shop/getGoodsShopById', {
                    shopId: this.shopId
                },(res)=>{
                    this.goodList = res.data
                })
            },
            // 获取预售列表
            getPreSellData(){
                this.$http.post('/shop/getPreSaleByUserId', {
                    userId: this.shopId
                },(res)=>{
                    this.presellList = res.data
                })
            },
            // 下架商品
            downSell(id){
                this.$http.post('/shop/commodityShelves', {
                    shopGoodsId: id
                },(res)=>{
                    this.$dialog.toast({
                        mes: '下架成功！',
                        timeout: 1500
                    })
                    this.getGoodsData()
                },()=>{
                    this.$dialog.toast({
                        mes: '下架失败，请重试！',
                        timeout: 1500
                    })
                })
            },
            // 前往上架
          upperFn(){
            if(this.$comm.isAndroid()){
              window.location.href = 'http://www.yichuangpt.com/static/gotoUpdate.html?userId='+ this.shopId
            }else if(this.$comm.isIos()){
              goUpdate()
            }
          },
          // 前往预售发布
          presellFn(){
            if(this.$comm.isAndroid()){
              window.location.href = 'http://www.yichuangpt.com/static/gotoPresale.html?userId='+ this.shopId
            }else if(this.$comm.isIos()){
              goPresell()
            }
          }

            // loadList() {
            //     this.$http.post('http://list.ydui.org/getdata.php?type=backposition', {
            //         params: {
            //             page: this.page,
            //             pagesize: this.pageSize
            //         }
            //     }).then(function (response) {
            //         const _list = response.body;
            //
            //         this.list = [...this.list, ..._list];
            //
            //         if (_list.length < this.pageSize || this.page == 3) {
            //             /* 所有数据加载完毕 */
            //             this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
            //             return;
            //         }
            //
            //         /* 单次请求数据完毕 */
            //         this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
            //
            //         this.page++;
            //     });
            // }
        }
    }
</script>
<style>
    .yd-tab-nav .yd-tab-active:before {
        width: 20%;
        margin-left: -10%;
    }
    .yd-list-theme2 .yd-list-item:nth-child(odd){
        padding-right:0.05rem;
    }
    .yd-list-theme2 .yd-list-item{
        padding-top:0.1rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
    }
    .yd-list-img img{
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }
    .yd-navbar:after{
        height:0;
    }
    .yd-navbar-item{
        flex:0 0 36%;
    }
    .yd-tab-box {
        border-bottom: 1px solid #f4f4f4;
    }
</style>
<style scoped>
    .page {
        background-color:transparent;
        height: 100%;
        overflow: hidden;
    }

    .page_nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }
    .share_icon {
        height: 100%;
        width: 1rem;
        display: inline-block;
        background: url("../../assets/share_2.png") no-repeat center;
        background-size: 0.4rem 0.4rem;
    }

    .goHistory{
        width:2rem;
    }
    /*店铺信息*/
    .shop_top{
        height:4.2rem;
        width: 100%;
        background-repeat: no-repeat;
        position: relative;
    }
    .shop_info{
        min-height:1.6rem;
        position: absolute;
        bottom:0;
        left: 0;
        right: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-content: flex-start;
        align-items: stretch;

        padding:0.1rem 0;
    }
    .shop_info>img{
        width:1rem;
        height: 1rem;
        outline: none;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        margin:0 0.2rem;
    }
    .shop_info .shop_detail{
        display: flex;
        flex:2;
        flex-direction: column;
        justify-content: space-between;
        align-content: stretch;
        align-items: flex-start;
        margin-left:1px;

    }
    .shop_right{
        position: absolute;
        right:0;
        bottom:0;
        z-index: 1;
        padding:0.24rem;
    }
    .shop_right .shop_btn{
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        height:0.8rem;
        width:0.8rem;
        line-height: 0.8rem;
        font-size:12px;
        padding:0;
        display: block;
        margin-bottom:0.2rem;
    }

    .xiajia_btn{
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        height:0.8rem;
        width:0.8rem;
        display: block;
        position: absolute;
        right:0.1rem;
        bottom:60px;
        z-index: 1;
        background: orange;
    }

    /*预售列表*/
    .pre_list{
        width:100%;
        font-size:0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .pre_list>li{
        width:50%;
        padding-top:0.1rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding-right:0.05rem;
        display: inline-block;
        overflow: hidden;
    }
    .pre_list>li:nth-child(even){
        padding-right:0;
        padding-left:0.05rem;
    }
    .pre_inner{
        width:100%;
        background:#fff;
    }
    .pre_time{
        line-height: 0.7rem;
        font-size:0.26rem;
        height:0.7rem;
    }
    .pre_inner>img{
        width:100%;
        height:3.2rem;

    }

    .pre_info{
        min-height:0.88rem;
        line-height: 0.44rem;
    }
    .pre_detail{
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        line-height: 0.44rem;
        padding:0.1rem 0.2rem;
    }
        .pre_detail>div{
            display: flex;
            align-content: center;
        }
    .pre_head{
        width:0.4rem;
        height:0.4rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
    .pre_zan{
        width:0.34rem;
        height:0.32rem;
    }
</style>
