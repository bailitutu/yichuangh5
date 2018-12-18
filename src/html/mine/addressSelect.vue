<template>
    <div>
        <div class="nav_bar">
            <div class="nav_cell" @click.prevent="backPage">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title">地址选择</p>
        </div>

        <yd-cell-group class="list_sec">
            <yd-cell-item class="list_item" @click.native="selectHandle(item)"
                          v-for="(item,index) in addressList" :key="index">
                <div slot="left">
                    <p> {{item.consignee}} <span class="ml-40">{{item.phone}}</span> <span v-if="item.isDefault == '1'"
                                                                                           class="address_dot hasBra c-fff ml-40">默认</span>
                    </p>
                    <div class="address_detail">{{item.provinceName + item.cityName + item.areaName +
                        item.detailAddr}}
                    </div>
                </div>
            </yd-cell-item>
        </yd-cell-group>
        <white-page v-if="addressList.length > 0 ? false :true"></white-page>
        <div class="plr-10 mt-10">
            <yd-button size="large" type="primary" class='foo_btn' bgcolor="#fff" @click.native="addressManage">
                地址管理
            </yd-button>
        </div>
    </div>
</template>

<script>
    import WhitePage from "../../components/whitePage";

    export default {
        name: "address-select",
        components: {WhitePage},
        data() {
            return {
                addressList: [],
            }
        },
        created() {
            this.userId = this.$comm.getUrlKey('userId') || '';
            this.pageType = this.$comm.getUrlKey('pageType') || 0;
            this.getAddressList();
        },
        methods: {
            // 页面回跳
            backPage() {
                if (this.pageType == '1') {
                    this.$comm.normalBack();
                } else {
                    this.$router.back(-1);
                }
            },
            // 获取地址列表
            getAddressList() {
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    this.addressList = res.data;
                })
            },
            // 选择地址
            selectHandle(item) {
                if (this.pageType == '1') {
                    this.$comm.normalBack();
                    if (this.$comm.isAndroid()) {
                        window.location.href = 'http://www.yichuangpt.com/static/gotoSt.html?addrId=' + item.id
                    } else if (this.$comm.isIos()) {
                        addressGoBack(item)
                    }
                } else {
                    this.$comm.setStorge('selAddressId', item.id);
                    this.$router.back(-1);
                }
            },
            // 进入地址管理
            addressManage() {
                this.$router.push({path: 'addressList', query: {userId: this.userId, isH5: '1'}})
            }
        }
    }
</script>

<style>
    .nav_bar {
        width: 100%;
        height: 1rem;
        background: #fff;
        line-height: 1rem;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
    }

    .nav_cell {
        width: 1rem;
        padding-left: 0.24rem;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
    }

    .nav_title {
        width: 100%;
        height: 1rem;
        text-align: center;
        font-size: 0.3rem;
        line-height: 1rem;
    }
    .plr-10 {
        padding: 0 10px;
    }

    .list_sec {
        margin: 1rem 0.24rem 0;
        background: #f4f4f4;
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

    .address_dot {
        background: #F68E1D;
        font-size: 12px;
        padding: 1px 2px;
    }

    .yd-cell {
        background-color: #f4f4f4;
    }

    .foo_btn {
        background: #fff;
        color: #282828;
        margin-bottom: 0.4rem;
    }
</style>
