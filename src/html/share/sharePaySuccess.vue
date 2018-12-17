<template>
    <yd-layout>

        <yd-navbar slot="top" title="支付成功"></yd-navbar>
        <div class="success_item tac">
            <img src="../../assets/pay_success.png" class="pay_success_img" alt="">
            <h3 class="tac c-33 mt-10 success_title">支付成功</h3>
            <p class="fs-14 mt-10 success_tip">快去下载衣创App 查看订单进度吧~</p>
        </div>

        <yd-cell-group class="bottom_item" slot="bottom">
            <yd-cell-item>
                <div slot="left" class="logo_item">
                    <img src="../../assets/login_logo.png" class="logo_icon" alt="">
                    <p class="fs-16 c-fff ml-10" >衣创</p>
                </div>
                <yd-button slot="right" size="small" bgcolor="#F76B1C" color="#fff">APP下载</yd-button>
            </yd-cell-item>

        </yd-cell-group>
    </yd-layout>


</template>

<script>
    export default {
        name: "share-pay-success"
    }
</script>
<style>
    .yd-cell-box{
        margin-bottom:0;
    }
    .yd-cell,.yd-cell-item{
        background-color:rgba(40,40,40,0.3);
    }
</style>
<style scoped>
    .success_item{
        margin-top: 0.2rem;
        background: #fff;
        padding-bottom:0.6rem;
    }
    .success_title{
        font-size: 0.4rem;
        font-weight:normal;
    }
    .success_tip{
        color: #888888;
    }
    .pay_success_img{
        width: 1.3rem;
        height:1.3rem;
        margin:0.6rem 0 0.1rem;
    }
    .bottom_item{
        background:rgba(40,40,40,0.5);
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
    }
</style>
