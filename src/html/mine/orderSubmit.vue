<template>
    <yd-layout title="订单详情">
        <div class="address_item" v-if="hasAddress">
            <yd-button type="primary" size="large" style="margin-top:4px;" shape="angle"  bgcolor="#fff" color="#333">选择收货地址</yd-button>
        </div>
        <yd-cell-group v-else>
            <yd-cell-item arrow class="list_item" :href="{ path:'/addressSelect',query:{ type:'2'}}" type="link"
                          v-for="(data,index) in 1" :key="index">
                <div slot="left">
                    <p> 小明 <span class="ml-40">18232321123</span></p>
                    <div class="address_detail">浙江省杭州市余杭区常山路345号阿里巴巴未来科技 城3幢一单元2109</div>
                </div>
                <span slot="right"></span>
            </yd-cell-item>
        </yd-cell-group>

        <ul class="good_list">
            <li v-for="(item ,index) in list" :key="index">
                <div class="car_center">
                    <div class="goods_img">
                        <img :src="item.goodImg" alt="">
                    </div>
                    <div class="goods_detail">
                        <div class="one_row">{{item.name}}</div>
                        <p class="fs-12 c-b0"> 胸围20 腰围20 臂长20 </p>
                        <span class="c-b0">￥{{ item.price}}</span>
                    </div>
                </div>
            </li>
        </ul>


        <div class="car_footer">
            <div class="car_tool ">
                <p class="fs-14 c-28">数量</p>
                <span class="c-28 fs-14">1</span>
            </div>
            <div class="car_end">
                <p class="fs-16 c-money">￥{{ allMoney }}</p>
                <yd-button type="primary" bgcolor="#333" shape="angle" color="#fff" class="sub_btn" @click.native="goPay">结算</yd-button>
            </div>
        </div>


    </yd-layout>
</template>

<script>
    export default {
        name: "order-submit",
        data(){
            return {
                hasAddress:false,
                list: [

                    {
                        selected: true,
                        goodImg: require('../../assets/goods.png'),
                        name: '女士连衣裙女士连衣裙女士连衣裙女士连衣裙',
                        price: '188.50',
                        num: 1
                    }
                ]
            }
        }
    }
</script>

<style scoped>
    .address_item{
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
        align-content:center ;
    }

    .car_center .goods_detail {
        min-height: 1.6rem ;
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
    .car_tool{
        border-top:1px solid #f4f4f4;
        border-bottom:1px solid #f4f4f4;
    }
    .car_tool p{
        line-height: 1rem;

    }

    .car_tool span{
        min-width:2rem;
        text-align: center;
        line-height: 1rem;
    }
    .car_tool, .car_end {
        height:1rem;
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding-left:0.24rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .car_end p {
        line-height: 1rem;
    }

    .sub_btn{
        height:1rem;
        width:2rem;
        font-size:0.32rem;
    }
</style>
