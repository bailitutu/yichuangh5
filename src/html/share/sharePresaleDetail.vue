<template>
    <div style="height:100%;">
        <div class="nav_bar">
            <div class="nav_cell" @click.prevent="backPage">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title" v-if="presaleInfo.preSale">
                <time-left :endTime="presaleInfo.preSale.endTimeDate"></time-left>
            </p>
            <p class="nav_title" v-if="presaleInfo.originality">
                {{ presaleInfo.originality.name}}
            </p>
            <div style="width:1rem;"></div>
        </div>

        <yd-cell-group class="download_item mt-10">
            <yd-cell-item>
                <div slot="left" class="user_info">
                    <img :src="presaleInfo.shopImg" class="head_img" alt="">
                    <span>{{presaleInfo.shopName}}</span>
                </div>
                <div slot="right">
                    <yd-button size="small" type="warning" @click.native="$comm.downLoadApp()"> APP下载</yd-button>
                </div>
            </yd-cell-item>
        </yd-cell-group>

        <div class="pre_info" v-if="presaleInfo.preSale ">
            <p class="fs-14">{{ presaleInfo.preSale.designInfo}}</p>
            <yd-lightbox class="pre_img_list">
                <yd-lightbox-img class="pre_img_cell" v-for="(item, key) in presaleInfo.imgs" :key="key"
                                 :src="item"></yd-lightbox-img>
            </yd-lightbox>
        </div>
        <div class="pre_info" v-if=" presaleInfo.originality">
            <p class="fs-14">{{ presaleInfo.originality.info}}</p>
            <yd-lightbox class="pre_img_list">
                <yd-lightbox-img class="pre_img_cell" v-for="(item, key) in presaleInfo.imgs" :key="key"
                                 :src="item"></yd-lightbox-img>
            </yd-lightbox>
        </div>

        <yd-tab class="mt-10 shareList" border-color="#f4f4f4" color="#B0B0B0" active-color="#333333">
            <yd-tab-panel label="分享">
                <yd-cell-group v-if="shareList.length > 0">
                    <yd-cell-item align="top" v-for="( share,index) in shareList" :key="index">
                        <span slot="left">
                             <div class="share_cell">
                                <img :src="share.headImg" alt="" class="share_img">
                                <div class="share_content">
                                    <p class="fs-14 c-33">{{share.name}}</p>
                                    <div class="share_text c-b0 fs-12">{{ share.info}}</div>
                                </div>
                            </div>
                        </span>
                        <span slot="right">
                            {{ share.createTime}}
                        </span>
                    </yd-cell-item>
                </yd-cell-group>
                <p class="fs-14 c-b0 tac noData_tip" v-if="shareList.length == 0">暂无分享~</p>
            </yd-tab-panel>
            <yd-tab-panel label="评论">
                <yd-cell-group v-if="commandList.length > 0">
                    <yd-cell-item v-for="(command,c) in commandList" :key="c">
                        <span slot="left">
                             <div class="share_cell">
                                <img :src="command.headImg" alt="" class="share_img">
                                 <div class="share_content">
                                    <p class="fs-14 c-33">{{command.name}}</p>
                                    <div class="share_text c-b0 fs-12">{{command.info}}</div>
                                </div>
                            </div>
                        </span>
                        <span slot="right">
                          {{ command.createTime}}
                        </span>
                    </yd-cell-item>
                </yd-cell-group>
                <p class="fs-14 c-b0 tac noData_tip" v-if="commandList.length == 0">暂无评论~</p>

            </yd-tab-panel>
            <yd-tab-panel label="喜欢">
                <yd-cell-group v-if="likeList.length> 0">
                    <yd-cell-item v-for="(likes ,lik) in likeList" :key="lik">
                        <span slot="left">
                             <div class="share_cell">
                                <img :src="likes.headImg" alt="" class="share_img">
                                <p>{{likes.name}}</p>
                            </div>
                        </span>
                    </yd-cell-item>
                </yd-cell-group>
                <p class="fs-14 c-b0 tac noData_tip" v-if="likeList.length == 0">暂无数据~</p>
            </yd-tab-panel>
        </yd-tab>

    </div>
</template>

<script>
    import TimeLeft from '@/components/timeleft'

    export default {
        name: "share-presale-detail",
        components: {TimeLeft},
        data() {
            return {
                userId: '',
                preSaleId: '',
                shopId: '',
                isShopUser: '',
                presaleInfo: {},
                commandList: [],
                shareList: [],
                likeList: []
            }
        },
        created() {
            this.preSaleId = this.$comm.getUrlKey('preSaleId') || '224409962628124672';
            this.pageType = this.$comm.getUrlKey('pageType') || '';
            if (!this.pageType) { //预售
                this.getPresaleData();
                this.getShareList(1, 2);
                this.getShareList(2, 2);
                this.getShareList(3, 2);
            } else {//创意
                this.getOriginalData();
                this.getShareList(1, 1);
                this.getShareList(2, 1);
                this.getShareList(3, 1);
            }
        },
        methods: {
            // 返回
            backPage() {
                this.$router.back(-1);
            },
            // 获取预售详情
            getPresaleData() {
                this.$dialog.loading.open('努力加载中~');
                this.$http.post('/preSale/detail', {
                    userId: '11111111111',
                    preSaleId: this.preSaleId
                }, (res) => {
                    this.$dialog.loading.close();
                    this.presaleInfo = res.data;
                    console.log(this.presaleInfo)
                })
            },
            // 获取创意详情
            getOriginalData() {
                this.$dialog.loading.open('努力加载中~');
                this.$http.post('/originality/detail', {
                    userId: '11111111111',
                    id: this.preSaleId
                }, (res) => {
                    this.$dialog.loading.close();
                    this.presaleInfo = res.data;
                })
            },
            /*
            *  获取分享评论喜欢的列表
            *  status:1评论2分享3点赞
            *  type:预售为2,创意为1
            * */
            getShareList(status, type) {
                this.$http.post('/preSale/commentInfo', {
                    userId: '1111111111111',
                    preSaleId: this.preSaleId,
                    status: status,
                    type: type
                }, (res) => {
                    this.presaleInfo = res.data;
                    switch  (status)
                    {
                        case 1:
                            this.commandList = res.data;
                            break;
                        case 2:
                            this.shareList = res.data;
                            break;
                        case 3:
                            this.likeList = res.data;
                            break;
                        default:
                            break;
                    }

                })

            }
        }
    }
</script>

<style scoped>
    .nav_bar {
        width: 100%;
        height: 1rem;
        background: #fff;
        line-height: 1rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
        display: flex;
        justify-content: space-between;
    }

    .nav_cell {
        width: 1rem;
        padding-left: 0.24rem;
    }

    .nav_title {
        width: 100%;
        height: 1rem;
        text-align: center;
        font-size: 0.3rem;
        line-height: 1rem;
    }

    .download_item {
        height: 1rem;
        background: #fff;
        width: 100%;
        margin-top: 1.2rem;
    }

    .download_item .user_info {
        display: flex;
        align-items: stretch;
        align-content: center;
        line-height: 0.6rem;
    }

    .download_item .user_info span {
        padding-left: 0.2rem;
    }

    .download_item .head_img {
        width: 0.6rem;
        height: 0.6rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }
    .pre_info {
        background: #fff;
        margin-top: 10px;
        padding: 0.1rem 0 0.2rem;
    }

    .pre_info > p {
        line-height: 0.56rem;
        color: #606060;
        padding: 0.2rem 0.3rem;
    }

    .pre_img_list {
        margin: 0 0.3rem;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: center;
        align-content: stretch;
        font-size: 0;
        overflow: hidden;
    }

    .pre_img_cell {
        float: left;
        width: 32%;
        height: auto;
        margin-right: 2%;
        margin-bottom: 0.1rem;
        overflow: hidden;
    }

    .pre_img_cell:nth-child(3n) {
        margin-right: 0;
    }

    .share_cell {
        display: flex;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: center;
    }

    .share_cell .share_img {
        width: 0.6rem;
        height: 0.6rem;
    }

    .share_cell > p {
        padding-left: 0.2rem;
        padding-top: 0.1rem;
    }

    .share_content {
        padding-left: 0.2rem;
    }

    .share_content > p {
        padding: 0.1rem 0 0.04rem;
    }

    .share_text {
        width: 100%;
        white-space: normal;
        padding: 0.02rem 0.1rem 0.2rem 0;
    }

    .noData_tip {
        padding: 0.2rem;
    }
</style>
