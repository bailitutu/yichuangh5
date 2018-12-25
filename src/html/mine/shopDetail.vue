<template>
    <div class="page">
        <div class="page_nav">
            <div class="page_nav_left" @click.stop="backPage">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </div>
            <div class="page_nav_right" v-if="!isCheck">
                <div class="nav_cell_right" @click.stop="shareShop">
                    <span class="share_icon"></span>
                </div>
                <div class="nav_cell_right" @click="checkRecord">
                    <span class="c-fff">交易记录</span>
                </div>
            </div>
            <div class="page_nav_right" v-if="isCheck">
                <div class="nav_cell_right"  @click.stop="shareShop">
                    <span class="share_icon"></span>
                </div>
                <div class="nav_cell_right" @click.stop="connectShop">
                    <span class="chat_icon"></span>
                </div>
                <div class="nav_cell_right">
                    <yd-button type="warning" style="min-width: 0.8rem;" size="small" @click.native="concernShop">{{
                        isConcern == 1 ? '已关注' : '关注'}}
                    </yd-button>
                </div>
            </div>
        </div>
        <div class="shop_top" ref="shoptop"
             :style="{backgroundImage: 'url('+ shopInfo.shopBackground +')', backgroundSize:'cover',backgroundPosition:'center'}">
            <div class="shop_info">
                <img src="" v-lazy="shopInfo.shopLogo" alt="">
                <div class="shop_detail c-fff">
                    <h3 class="fs-16">{{shopInfo.shopName}}</h3>
                    <p class="fs-14">店铺码:{{shopInfo.shopCode}}</p>
                    <p class="fs-14 " style="white-space: normal;">{{shopInfo.shopInfo}}</p>
                </div>
            </div>
            <div class="shop_right" v-show="!isCheck">
                <yd-button size="small" bgcolor="#fff" color="#333" class="shop_btn" @click.native="upperFn">上架
                </yd-button>
                <yd-button size="small" bgcolor="#fff" color="#333" class="shop_btn" @click.native="presellFn">预售
                </yd-button>
            </div>
        </div>
        <yd-tab border-color="#f4f4f4" color="#B0B0B0" active-color="#333333">
            <yd-tab-panel label="商品" :style="{ height: scrollHeight + 'px'}"
                          style="overflow-y:auto;padding:0.1rem 0.2rem;">

                <yd-list theme="2">
                    <yd-list-item v-for="(item, key) in goodList" :key="key" style="position: relative;"
                                  @click.native="checkGoodsDetail(item.id)">
                        <img slot="img" :src="item.goodsImg">
                        <span slot="title">{{item.goodsName}}</span>
                        <div slot="other" v-if="!isCheck" @click.stop="downSell(item.id)" class="xiajia_btn">下架
                        </div>
                        <yd-list-other slot="other" style="margin-top:6px;">
                            <div>
                                <span class="list-price  c-money"><em>¥</em>{{item.price}}</span>
                                <span class="list-del-price  c-money" v-if="!isCheck">佣 <em>¥</em>{{parseInt(item.commission)}}</span>
                                <span class="fs-12 c-b0" style="margin-left:4px;">{{item.count || '0'}}人付款</span>
                            </div>
                        </yd-list-other>

                    </yd-list-item>
                </yd-list>
                <p v-if="goodList.length > 0 ? true :false" class="tac fs-12 c-b0" style="padding:0.1rem;"> 没有数据啦~</p>

                <white-page v-if="goodList.length ==  0 ? true :false"></white-page>

            </yd-tab-panel>
            <yd-tab-panel label="预售" :style="{ height: scrollHeight + 'px'}"
                          style="overflow-y:auto;padding:0.1rem 0.2rem;">
                <ul class="pre_list">
                    <li v-for="(cell, pre) in presellList" :key="pre" class="hasBra" @click="checkPresell(cell.id)"
                        style="position: relative;">
                        <div class="pre_inner">
                            <time-left :endTime="cell.endTimeDate"></time-left>
                            <!--<p class="c-money tac pre_time">剩余时间：75:23:00</p>-->
                            <img class="pre_img" :src="cell.firstImg">
                            <p class="fs-14 c-60" style="padding:0.1rem 0.2rem;">{{cell.designName}}</p>
                            <div class="fs-12 one_row pre_info" style="padding:0.1rem 0.2rem;">
                                {{cell.info}}
                            </div>
                            <div class="pre_detail">
                                <div>
                                    <img class="pre_head" :src="cell.userImg" alt="">
                                    <span class="fs-12 c-b0 ml-10">{{cell.name}}</span>
                                </div>
                                <div>
                                    <img class="pre_zan" src="../../assets/161.png" alt="">
                                    <span class="fs-12 c-b0">{{cell.likeCount}}</span>
                                </div>
                            </div>

                        </div>
                    </li>
                </ul>
                <p v-if="presellList.length > 0 ? true :false" class="tac fs-12 c-b0" style="padding:0.1rem;">
                    没有数据啦~</p>
                <white-page v-if="presellList.length ==  0 ? true :false"></white-page>

            </yd-tab-panel>
        </yd-tab>
    </div>


</template>

<script>
    import TimeLeft from '@/components/timeleft'
    import WhitePage from '@/components/whitePage'

    export default {
        name: "shop-detail",
        components: {TimeLeft, WhitePage},
        data() {
            return {
                isCheck: false, //是否是从商品详情页跳转过来的
                isBanner: false, //是否是从banner 图跳转过来的
                isConcern: false,//是否关注了当前店铺
                scrollHeight: 0,
                bgImg: 'https://appyichuang.oss-cn-hangzhou.aliyuncs.com/img/test/9c6fba1d-9e30-4de8-a0a3-288ef891687a-1544779381566',
                shopInfo: {}, //店铺信息
                goodList: [], //商品列表
                presellList: [] //预售列表
            }
        },
        created() {
            this.shopId = this.$comm.getUrlKey('shopId') || '230849995971104768';
            this.isCheck = this.$comm.getUrlKey('isCheck') == '1' ? true : false ;
            this.isBanner = this.$comm.getUrlKey('isBanner') == '1' ? true : false ;
            this.userId = this.$comm.getUrlKey('userId') || '230178710307868672';
            if (this.isCheck) {
                this.getConcerShop();
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
                if( this.isBanner){ //首页轮播图进入
                  this.$comm.normalBack();
                  return;
                }
                if (this.isCheck && !this.isBanner) { //h5查看页面
                    this.$router.back(-1);
                }else{
                    this.$comm.normalBack();
                }
            },
            // 分享店铺
            shareShop(){
                let info = {
                    title:this.shopInfo.shopName,
                    imgUrl:'https://appyichuang.oss-cn-hangzhou.aliyuncs.com/img/test/23ece438-1382-4a19-ad60-3802b681dc14-1545126120466',
                    url:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc9353d09a0d1f197&redirect_uri=http%3a%2f%2fwww.yichuangpt.com%2fstatic%2fh5%2fdist%2findex.html%23%2fshareShopDetail&response_type=code&scope=snsapi_base&state='+ this.shopInfo.id+'#wechat_redirect',
                    conntent:this.shopInfo.shopInfo
                };
                if(this.$comm.isAndroid()){
                    window.location.href = 'http://www.yichuangpt.com/static/goShareShop.html?title='+ info.title +'&imgUrl='+ info.imgUrl +'&url='+ info.url + '&conntent='+ info.conntent
                }else if(this.$comm.isIos()){
                    let url = info.url;
                    console.log(url)
                    goShare(info);
                }
            },
            // 查看交易记录
            checkRecord() {
                this.$router.push({path: '/record'})
            },
            // 联系店主
            connectShop() {

                if(this.userId == this.shopId){
                    this.$dialog.toast({
                        mes:'这是你自己的店铺！'
                    })
                    return;
                }
                let shopPhone = this.shopInfo.phone;
                if (this.$comm.isAndroid()) {
                    window.location.href = 'http://www.yichuangpt.com/static/gochat.html?phone=' + shopPhone;
                } else if (this.$comm.isIos()) {
                    goChat(shopPhone)
                }
            },
            // 查询是否已关注店铺
            getConcerShop() {
                this.$http.post('/appUser/isFollow', {
                    userId: this.shopId,
                    fansId: this.userId
                }, (res) => {
                    if (res.data == '0') { //0 为未关注，1为已关注
                        this.isConcern = false;
                    } else {
                        this.isConcern = true;
                    }
                })
            },
            // 关注/取消关注店铺
            concernShop() {
                if(this.userId == this.shopId){
                    this.$dialog.toast({
                        mes:'无法关注自家的店铺哦~'
                    })
                    return;
                }
                this.$http.post('/shop/followShop', {
                    userId: this.shopId,
                    fansId: this.userId
                }, (res) => {
                    if (!this.isConcern) {
                        // 去关注店铺
                        this.$dialog.toast({
                            mes: '关注成功！',
                            timeout: 1500
                        })
                        this.isConcern = true;
                        return;

                    } else {
                        //去取消店铺
                        this.$dialog.toast({
                            mes: '取消成功！',
                            timeout: 1500
                        })
                        this.isConcern = false;
                        return;

                    }
                })
            },


            // 获取店铺信息
            getShopInfo() {
                this.$http.post('/appUser/findUserById', {
                    userId: this.shopId
                }, (res) => {
                    if (!res.data.shopBackground) {
                        res.data.shopBackground = this.bgImg;
                    }
                    if( res.data.isOpen == 0){
                        this.$dialog.toast({
                            mes:'该店铺已停封！',
                            timeout:1500
                        })
                        this.backPage();
                        return;
                    }
                    this.shopInfo = res.data;

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
            // 下架商品
            downSell(id) {
                this.$dialog.confirm({
                    title: '',
                    mes: '确定下架该商品？',
                    opts: () => {
                        this.$http.post('/shop/commodityShelves', {
                            shopGoodsId: id
                        }, (res) => {
                            this.$dialog.toast({
                                mes: '下架成功！',
                                timeout: 1500
                            })
                            this.getGoodsData()
                        }, () => {
                            this.$dialog.toast({
                                mes: '下架失败，请重试！',
                                timeout: 1500
                            })
                        })
                    }
                })
            },
            // 前往上架
            upperFn() {
                if (this.$comm.isAndroid()) {
                    window.location.href = 'http://www.yichuangpt.com/static/gotoUpdate.html?userId=' + this.shopId + '&shopCode='+ this.shopInfo.shopCode
                } else if (this.$comm.isIos()) {
                    goUpdate({
                        shopCode: this.shopInfo.shopCode,
                        shopId: this.shopId
                    })
                }
            },
            // 前往发布预售页面
            presellFn() {
                if (this.$comm.isAndroid()) {
                    window.location.href = 'http://www.yichuangpt.com/static/gotoPresale.html?userId=' + this.shopId
                } else if (this.$comm.isIos()) {
                    goPresell()
                }
            },
            // 查看商品详情
            checkGoodsDetail(id) {
                let userid = this.isCheck ? this.userId : this.shopId;
                this.$router.push({path: '/goodDetail', query: {userId: userid, shopGoodsId: id, isH5: 1}})
            },
            // 查看预售商品发布详情
            checkPresell(id) {
                let userid = this.isCheck ? this.userId : this.shopId;
                if (this.$comm.isAndroid()) {
                    window.location.href = 'http://www.yichuangpt.com/static/presellDetail.html?userId=' + userid + '&preSaleId=' + id;
                } else if (this.$comm.isIos()) {
                    goPresellDetail(id)
                }
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

    .page_nav_right .nav_cell_right {
        padding: 0 0.2rem;
    }

    .share_icon {
        height: 0.88rem;
        width: 0.4rem;
        display: block;
        background: url("../../assets/share_2.png") no-repeat center;
        background-size: 0.4rem 0.4rem;
    }

    .chat_icon {
        height: 0.88rem;
        width: 0.4rem;
        display: block;
        background: url("../../assets/pinglun_2.png") no-repeat center;
        background-size: 0.4rem 0.4rem;
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
        flex: 2;
        flex-direction: column;
        justify-content: space-between;
        align-content: stretch;
        align-items: flex-start;
        margin-left: 1px;

    }

    .shop_right {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 1;
        padding: 0.24rem;
    }

    .shop_right .shop_btn {
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        height: 0.8rem;
        width: 0.8rem;
        line-height: 0.8rem;
        font-size: 12px;
        padding: 0;
        display: block;
        margin-bottom: 0.2rem;
    }

    .xiajia_btn {
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        height: 0.8rem;
        width: 0.8rem;
        display: block;
        position: absolute;
        right: 0.1rem;
        bottom: 60px;
        z-index: 1;
        background: orange;
        text-align: center;
        line-height: 0.8rem;
        color: #fff;
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
