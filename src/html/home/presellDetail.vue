<template>
    <yd-layout >
        <div class="page_nav">
            <div class="page_nav_left" @click.stop="backPage">
                <yd-navbar-back-icon color="#fff"></yd-navbar-back-icon>
            </div>
            <div class="page_nav_title">
                预售详情
            </div>
        </div>

        <div class="download_item">

        </div>


    </yd-layout>
</template>

<script>
    export default {
        name: "presell-detail",
        data(){
            return {
                backUrl:''
            }
        },
        created(){
            this.userId = this.$comm.getUrlKey('userId') || '';
            this.preSaleId = this.$comm.getUrlKey('preSaleId') || '';
            this.shopId = this.$comm.getUrlKey('shopId') || '';
            this.isShopUser = this.$comm.getUrlKey('isShopUser') || '';
        },
        methods:{
            backPage(){
                this.$route.back(-1);
            }
        }
    }
</script>

<style scoped>

</style>
