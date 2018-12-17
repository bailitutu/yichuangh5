<template>
    <yd-layout>
        <div class="nav_bar" slot="top" >
            <div class="nav_cell" @click.prevent="backPage">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title">预售详情</p>
            <div style="width:1rem;"></div>
        </div>

        <yd-cell-group class="download_item mt-10" >
            <yd-cell-item>
                <div slot="left" class="user_info">
                    <img src="../../assets/head.png"  class="head_img" alt="">
                    <span>小仙女</span>
                </div>
                <div slot="right">
                    <yd-button size="small" type="warning" >APP下载</yd-button>
                </div>
            </yd-cell-item>
        </yd-cell-group>

        <div class="pre_info">
            <p class="fs-14">很美的裙子，看着图片有点厚，但是实物很飘逸， 很漂亮，满意。</p>
            <yd-lightbox class="pre_img_list">
                <yd-lightbox-img class="pre_img_cell" v-for="item, key in list" :key="key" :src="item.src"></yd-lightbox-img>
            </yd-lightbox>
        </div>

        <yd-tab class="mt-10" border-color="#f4f4f4" color="#B0B0B0" active-color="#333333">
            <yd-tab-panel label="分享">
                <yd-cell-group>
                    <yd-cell-item align="top">
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                <div class="share_content">
                                    <p class="fs-14 c-33">小仙女</p>
                                    <div class="share_text c-b0 fs-12">分享至朋友圈</div>
                                </div>
                            </div>
                        </span>
                        <span slot="right">
                            201231231231
                        </span>
                    </yd-cell-item>
                </yd-cell-group>
            </yd-tab-panel>
            <yd-tab-panel label="评论">
                <yd-cell-group>
                    <yd-cell-item>
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                 <div class="share_content">
                                    <p class="fs-14 c-33">小仙女</p>
                                    <div class="share_text c-b0 fs-12">这衣服不错！收到路况房间埃里克森的房价阿斯顿发生地方啥东风路卡机是的发是的发时代峰峻阿萨德发阿斯顿发就士大夫 阿斯顿减肥</div>
                                </div>
                            </div>
                        </span>
                        <span slot="right" >
                            201231231231
                        </span>
                    </yd-cell-item>
                    <yd-cell-item>
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                 <div class="share_content">
                                    <p class="fs-14 c-33">小仙女</p>
                                    <div class="share_text c-b0 fs-12">这衣服不错！收到路况房间埃里克森的房价阿斯顿发生地方啥东风路卡机是的发是的发时代峰峻阿萨德发阿斯顿发就士大夫 阿斯顿减肥</div>
                                </div>
                            </div>
                        </span>
                        <span slot="right" >
                            201231231231
                        </span>
                    </yd-cell-item>
                    <yd-cell-item>
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                 <div class="share_content">
                                    <p class="fs-14 c-33">小仙女</p>
                                    <div class="share_text c-b0 fs-12">这衣服不错！收到路况房间埃里克森的房价阿斯顿发生地方啥东风路卡机是的发是的发时代峰峻阿萨德发阿斯顿发就士大夫 阿斯顿减肥</div>
                                </div>
                            </div>
                        </span>
                        <span slot="right" >
                            201231231231
                        </span>
                    </yd-cell-item>
                </yd-cell-group>
            </yd-tab-panel>
            <yd-tab-panel label="喜欢">
                <yd-cell-group>
                    <yd-cell-item>
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                <p>小仙女</p>
                            </div>
                        </span>
                    </yd-cell-item>
                    <yd-cell-item>
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                <p>小仙女</p>
                            </div>
                        </span>

                    </yd-cell-item>
                    <yd-cell-item>
                        <span slot="left">
                             <div class="share_cell">
                                <img src="../../assets/head.png" alt="" class="share_img">
                                <p>小仙女</p>
                            </div>
                        </span>

                    </yd-cell-item>
                </yd-cell-group>


            </yd-tab-panel>
        </yd-tab>

    </yd-layout>
</template>

<script>
    export default {
        name: "share-presale-detail",
        data() {
            return {
                userId: '',
                preSaleId: '',
                shopId: '',
                isShopUser: '',
                list: [
                    {src: 'http://static.ydcss.com/uploads/lightbox/meizu_s1.jpg'},
                    {src: 'http://static.ydcss.com/uploads/lightbox/meizu_s2.jpg'},
                    {src: 'http://static.ydcss.com/uploads/lightbox/meizu_s3.jpg'},
                    {src: 'http://static.ydcss.com/uploads/lightbox/meizu_s4.jpg'},
                    {src: 'http://static.ydcss.com/uploads/lightbox/meizu_s5.jpg'},
                ]
            }
        },
        created() {
            this.userId = this.$comm.getUrlKey('userId') || '';
            this.preSaleId = this.$comm.getUrlKey('preSaleId') || '';
            this.shopId = this.$comm.getUrlKey('shopId') || '';
            this.isShopUser = this.$comm.getUrlKey('isShopUser') || '';
        },
        methods: {
            // 返回
            backPage() {
                this.$router.back(-1);
            }
        }
    }
</script>

<style scoped>
    .nav_bar{
        width:100%;
        height:1rem;
        background: #fff;
        line-height: 1rem;
        display:flex;
        justify-content: s;
    }
    .nav_cell{
        width:1rem;
        padding-left:0.24rem;
    }
    .nav_title{
        width: 100%;
        height:1rem;
        text-align: center;
        font-size:0.3rem;
        line-height: 1rem;
    }
    .download_item{
        height:1rem;
        background: #fff;
        width:100%;
    }
    .download_item .user_info{
        display: flex;
        align-items: stretch;
        align-content: center;
        line-height: 0.6rem;
    }
    .download_item .user_info span{
        padding-left:0.2rem;
    }
    .download_item .head_img{
        width:0.6rem;
        height:0.6rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }

    .pre_info{
        background: #fff;
        margin-top:10px;
        padding:0.1rem 0 0.2rem;
    }
    .pre_info>p{
        line-height: 0.56rem;
        color: #606060;
        padding:0.2rem 0.3rem;
    }
    .pre_img_list{
        margin:0 0.3rem;
        display: flex;
        justify-content: flex-start;
        flex-wrap:wrap;
        align-items: center;
        align-content: stretch;
        font-size:0;
        overflow: hidden;
    }
    .pre_img_cell{
        float: left;
        width:32%;
        height:auto;
        margin-right:2%;
        margin-bottom:0.1rem;
        overflow: hidden;
    }
    .pre_img_cell:nth-child(3n){
        margin-right:0;
    }
    .share_cell{
        display: flex;
        justify-content: flex-start;
        align-content: flex-start;
        align-items:center;
    }
    .share_cell .share_img{
        width:0.6rem;
        height:0.6rem;
    }
    .share_cell>p{
        padding-left:0.2rem;
        padding-top:0.1rem;
    }
    .share_content{
        padding-left:0.2rem;
    }
    .share_content>p{
        padding:0.1rem 0 0.04rem;
    }
    .share_text{
        width:100%;
        white-space: normal;
        padding:0.02rem 0.1rem 0.2rem 0;
    }
</style>
