<template>
    <div>
        <yd-navbar title="商品详情" class="page_nav" >
            <router-link to="" @click.native="backFn" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
            <router-link v-if="goodInfo.shop" slot="right"
                         :to="{ path:'/shareShopDetail',query:{  shopId: goodInfo.shop.shopId}}">
                <span class="shop_icon"></span>
            </router-link>
        </yd-navbar>
        <div class="bottom_item">
            <div class="download_item">
                <div slot="left" class="logo_item">
                    <img src="../../assets/login_logo.png" class="logo_icon" alt="">
                    <p class="fs-16 c-fff ml-10" >衣创</p>
                </div>
                <yd-button slot="right" size="small" bgcolor="#F76B1C" color="#fff" @click.native="$comm.downLoadApp()">APP下载</yd-button>
            </div>

        </div>

        <yd-slider autoplay="30000" pagination-color="#fff" pagination-activecolor="#fff" style="margin-top:1rem;"
                   :style="{height:swiperHeight}" v-if="goodInfo.goodsImg">
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
            <div class="good_detail_img" v-if="goodInfo.goodsInfoImg">
                <img v-for="(cell,ind) in goodInfo.goodsInfoImg" :key="ind" :src="cell" alt="">
            </div>
        </div>
        <!--选择商品-->
        <yd-popup v-model="showSelect" position="bottom" height="60%">
            <div class="sel_good_img" v-show="showSelect">
                <img :src="goodInfo.goodsImg[0]" class="hasBra" alt="">
            </div>
            <div class="sel_good_info">
                <p class="c-money fs-14">￥<span class="fs-16">{{buyGoodsInfo.price}}</span></p>
                <p class="fs-14 c-9b">库存：{{buyGoodsInfo.stock}}</p>
            </div>
            <p class="fs-16 c-28 plr-12">规格分类</p>
            <ul class="attr_list" v-if="goodInfo.detail">
                <li v-for="(att,atti) in goodInfo.detail" :key="atti">
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333"
                               @click.native="selectAttr(atti)" class="attr_btn" :class=" att.selected ? 'active': ''">
                        {{att.spec}}
                    </yd-button>
                </li>
            </ul>

            <div class="sel_good_footer">
                <yd-cell-group>
                    <yd-cell-item>
                        <span slot="left">购买数量</span>
                        <yd-spinner slot="right" max="100" unit="1" min="1" width="1.6rem" height="0.45rem"
                                    v-model="buyNumber"></yd-spinner>
                    </yd-cell-item>
                </yd-cell-group>
                <yd-button size="large" shape="angle" bgcolor="#000" class="submit_btn" color="#fff"
                           :disabled="buyGoodsInfo.stock == '0'"
                           @click.native="submitFn">确定
                </yd-button>
            </div>
        </yd-popup>
        <!--登录-->
        <yd-popup v-model="showLogin" position="center" width="80%" >
            <div class="bg-fff login_sec">
                <p  class="fs-16 c-28 tac login_title" >账号登录 </p>
                <p class="fs-14 c-28 tac login_title">(用于订单管理及物流跟踪)</p>
                <div class="login_section">
                    <div class="change_item">
                        <span class="icon_phone"></span>
                        <yd-input  type="number" v-model="loginPhone" required regex="mobile" placeholder="请输入手机号"></yd-input>
                    </div>
                </div>
                <div class="login_section">
                    <div class="change_item">
                        <span class="icon_pass"></span>
                        <yd-input  type="password" v-model="loginPass" placeholder="请输入密码"></yd-input>
                    </div>
                </div>

                <yd-button bgcolor="#000" class="login_btn" color="#fff" size="large" @click.native="loginFn">登录</yd-button>
                <yd-button bgcolor="#fff" style="border:1px solid #f4f4f4;" class="login_btn" color="#333" size="large" @click.native="goReg">注册</yd-button>
            </div>
        </yd-popup>

        <!--注册-->
        <yd-popup v-model="showReg" position="center" width="80%" >
            <div class="bg-fff login_sec">
                <p  class="fs-16 c-28 tac login_title" >账号注册 </p>
                <p class="fs-14 c-28 tac login_title">(用于订单管理及物流跟踪)</p>
                <div class="login_section">
                    <div class="change_item">
                        <span class="icon_phone"></span>
                        <yd-input  type="number" v-model="regPhone" required regex="mobile"  placeholder="请输入手机号"></yd-input>
                    </div>
                </div>
                <div class="login_section">
                    <div class="change_item">
                        <yd-input  type="number" v-model="regCode"  max="6" placeholder="请输入验证码"></yd-input>
                        <yd-sendcode  v-model="hasSend"
                                     @click.native="sendCode"
                                     type="warning"
                        ></yd-sendcode>
                    </div>
                </div>

                <div class="login_section">
                    <div class="change_item">
                        <span class="icon_pass"></span>
                        <yd-input  type="password" v-model="regPassOne" placeholder="请输入密码"></yd-input>
                    </div>
                </div>
                <div class="login_section">
                    <div class="change_item">
                        <span class="icon_pass"></span>
                        <yd-input  type="password" v-model="regPassTwo" placeholder="请输入密码"></yd-input>
                    </div>
                </div>

                <yd-button bgcolor="#000" class="login_btn" color="#fff" size="large" @click.native="registerFn">注册</yd-button>
                <yd-button bgcolor="#fff" style="border:1px solid #f4f4f4;" class="login_btn" color="#333" size="large" @click.native="goLogin">登录</yd-button>
            </div>
        </yd-popup>

        <yd-button size="small" class="buy_btn" bgcolor="#000" color="#fff" shape="circle" @click.native="buyNow"> 购买</yd-button>
    </div>
</template>

<script>
    export default {
        name: "share-good-detail",
        data() {
            return {
                swiperHeight: 0,
                YCuserId: '',
                goodInfo: {},
                showSelect: false, //选择规格
                buyGoodsInfo: {},
                buyNumber: 1,
                buyType: 1,
                showLogin: false, //登录弹窗
                showReg:true, //注册弹窗
                hasSend:false, //是否发送了验证码
                loginPhone:'',
                loginPass:'',
                regPhone:'',
                regPassOne:'',
                regPassTwo:'',
                regCode:'',//验证码
                returnCode:'' //返回码

            }
        },
        created() {
            this.swiperHeight = window.innerWidth + 'px'; //设置轮播图高度
            this.shopGoodsId = this.$comm.getUrlKey('shopGoodsId') || '231225779655151616';
            this.getGoodDetail();
        },
        methods: {
            // 返回
            backFn() {
                this.$router.back(-1);
            },
            // 获取商品信息
            getGoodDetail() {
                this.$dialog.loading.open('努力加载中...');
                this.$http.post('/type/detail', {
                    shopGoodsId: this.shopGoodsId,
                }, (res) => {
                    this.$dialog.loading.close();
                    this.goodInfo = res.data;
                    if (this.goodInfo.detail && this.goodInfo.detail.length > 0) {
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

            // 登录
            loginFn(){
                // 表单验证
                if(this.loginPhone == ""){
                    this.$dialog.toast({
                        mes: '请填写手机号！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.loginPass == ""){
                    this.$dialog.toast({
                        mes: '请填写密码！',
                        timeout: 1500
                    })
                    return;
                }

                this.$http.post('/base/appLogin', {
                    phone: this.loginPhone,
                    password: this.loginPass
                }, (res) => {
                    this.showLogin = false;
                    this.$comm.setStorge('YCshareUserId',res.id);
                    this.YCuserId = res.id;
                    this.$dialog.toast({
                        mes: '登录成功！',
                        timeout: 1000,
                        callback:()=>{
                            this.showSelect = true;
                        }
                    })
                }, (err) => {
                    this.$dialog.toast({
                        mes: err.msg,
                        timeout: 1500
                    })
                })
            },
            // 去注册
            goReg(){
                this.showLogin = false;
                this.showReg = true
            },
            // 去登录
            goLogin(){
                this.showLogin = true;
                this.showReg = false
            },
            // 发送验证码
            sendCode(){

                if( this.regPhone == ''){
                    this.$dialog.toast({
                        mes: '请填写手机号！',
                        timeout: 1500
                    })
                    return;
                }
                this.$dialog.loading.open('发送中...');
                setTimeout(() => {
                    this.$http.post('/base/getCheckCode',{
                        phone: this.regPhone,
                        type:1
                    },(res)=>{
                        this.returnCode = this.data.code;
                        this.hasSend = true;
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '已发送,请注意查收',
                            icon: 'success',
                            timeout: 1500
                        })
                    },()=>{
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '发送失败，请稍候重试！',
                            icon: 'success',
                            timeout: 1500
                        })
                    })
                }, 300)
            },
            // 注册
            registerFn(){
                // 表单验证
                if(this.regPhone == ""){
                    this.$dialog.toast({
                        mes: '请填写手机号！',
                        timeout: 1500
                    })
                    return;
                }
                if(!this.hasSend){
                    this.$dialog.toast({
                        mes: '请先获取验证码！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.regCode == ""){
                    this.$dialog.toast({
                        mes: '请填写验证码！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.regPassOne == "" ){
                    this.$dialog.toast({
                        mes: '请填写密码！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.regPassTwo == "" ){
                    this.$dialog.toast({
                        mes: '请再次输入密码！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.regPassOne !== this.regPassTwo ){
                    this.$dialog.toast({
                        mes: '两次填写的密码不一致！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.regCode != this.returnCode){
                    this.$dialog.toast({
                        mes: '验证码错误！',
                        timeout: 1500
                    })
                    return;
                }
                this.$http.post('/base/register', {
                    phone: this.regPhone,
                    password: this.regPassOne
                }, () => {
                    this.showReg = false;
                    this.$dialog.toast({
                        mes: '注册成功！',
                        timeout: 1000,
                        callback:()=>{
                            this.showLogin = true;
                            this.loginPhone = this.regPhone;
                            this.loginPass = this.regPassOne;
                        }
                    })
                }, (err) => {
                    this.$dialog.toast({
                        mes: err.msg,
                        timeout: 1500
                    })
                })
            },


            // 立即购买
            buyNow() {
                this.YCuserId = this.$comm.getStorge('YCshareUserId') || '';
                if(!this.YCuserId){
                    this.showLogin = true;
                }else{
                    this.showSelect = true;
                    this.buyType = 2;
                    this.setSelectDefault();
                }
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
                if (this.buyGoodsInfo && this.buyGoodsInfo.length > 0) {
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
                // let totalPrice = (Math.floor(parseInt(this.buyNumber) * parseFloat(this.buyGoodsInfo.price) * 100) / 100).toFixed(2);
                // 调起支付
                let goodsId = this.shopGoodsId;
                let specId = this.buyGoodsInfo.id;
                let goodsNum = this.buyNumber;
                this.$router.push({
                    path: 'shareOrderSubmit',
                    query: {goodsId: goodsId, specId: specId, num: goodsNum}
                });
                this.$comm.setStorge('preOrderGoodsId', goodsId);
                this.$comm.setStorge('preOrderSpecId', specId);
                this.$comm.setStorge('preOrderGoodsNum', goodsNum);
                this.$comm.setStorge('preOrderUserId', this.userId);





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
    .shop_icon {
        height: 100%;
        width: 1rem;
        display: inline-block;
        background: url("../../assets/dianpu.png") no-repeat 0.4rem center;
        background-size: 0.48rem 0.48rem;
    }
    .bottom_item{
        position: fixed;
        top:1rem;
        left:0;
        right:0;
        z-index: 100;
        background-color:rgba(40,40,40,0.5);
        height:1rem;
        padding:0 0.3rem;
    }
    .download_item{
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background:rgba(40,40,40,0.1);
    }
    .logo_item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: center;
    }

    .logo_icon{
        width:0.6rem;
        height:0.6rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
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
        margin: 0.2rem 0.24rem 0.2rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        overflow: hidden;
        border-color:#fff;
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


    .buy_btn {
        width: 1rem;
        height: 1rem;
        padding:0;
        position: fixed;
        bottom:1.2rem;
        right:0.24rem;
        z-index: 100;
    }

    .submit_btn {
        height: 1rem;
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
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000;
    }

    /*登录弹窗*/
    .login_sec{
        padding:0.2rem 0.4rem ;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .login_title{
        padding:0.1rem ;
    }
    .change_item{
        border:1px solid #f4f4f4;
        display: flex;
        justify-content: space-between;
        align-content: center;
        align-items: center;
        margin-bottom:0.2rem;
        padding:0.2rem;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
    .change_item .icon_phone{
        width: 0.6rem;
        height:0.6rem;
        background: url('../../assets/icon_phone.png') no-repeat center left;
        background-size: 0.34rem 0.5rem;
        margin-right:0.2rem;
    }
    .change_item .icon_pass{
        width: 0.6rem;
        height:0.6rem;
        background: url('../../assets/icon_pass.png') no-repeat center left;
        background-size: 0.48rem 0.5rem;
        margin-right:0.2rem;
    }
    .login_btn{
        margin-bottom:0.2rem;
    }
</style>
