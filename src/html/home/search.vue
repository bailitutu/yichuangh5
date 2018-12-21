<template>
    <yd-layout class="page">
        <yd-cell-group class="search_item">
            <yd-cell-item>
                <div slot="left" class="search_cell">
                    <yd-icon name="search" size="15px" class="search_icon"></yd-icon>
                    <yd-input v-model="searchValue" required :show-success-icon="false" :show-error-icon="false"
                              :show-clear-icon="false"
                              placeholder="寻找你的专属" :onBlur="getSearch"></yd-input>
                </div>
                <yd-button slot="right" size="small" bgcolor="#fff" color="#333" class="cancel_btn"
                           @click.native="cancelFn">取消
                </yd-button>
            </yd-cell-item>
        </yd-cell-group>

        <div class="history_item" v-show="!isSearch && historyList.length > 0">
            <yd-cell-group>
                <yd-cell-item>
                    <p slot="left" style="font-weight:bold;" class="fs-16"> 搜索历史</p>
                    <yd-button slot="right" type="primary" size="mini" bgcolor="#f4f4f4" color="#333333"
                               @click.native="clearHistory">清除
                    </yd-button>
                </yd-cell-item>
            </yd-cell-group>
            <ul class="history_list">
                <li v-for="(his,ind) in historyList" :key="ind" @click="historyHandle( his.queryKey )">
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">{{his.queryKey}}
                    </yd-button>
                </li>
            </ul>
        </div>
        <yd-cell-group class="result_item" v-show="isSearch">
            <yd-cell-item v-for="(item,index) in  searchList" :key="index" @click.native="checkGoods(item.shopGoodsId)">
                <div slot="left" class="fs-14 c-28 one_row" style="width:6rem;" >{{item.goodsName}}</div>
            </yd-cell-item>
        </yd-cell-group>
        <div class="no_page_item" v-show="isSearch && searchList.length == 0">
            <img src="../../assets/no-search.png" alt="">
            <p> 找不到商品~</p>
        </div>
    </yd-layout>
</template>

<script>
    export default {
        name: "search",
        data() {
            return {
                searchValue: '',
                searchList: [], //搜索结果
                historyList: [], //搜索历史
                isSearch: false //是否在搜索
            }
        },
        created() {
            this.userId = this.$comm.getUrlKey('userId') || '224418465157615616'
            this.getHistorylist();
        },
        methods: {
            // 获取搜索历史列表
            getHistorylist() {
                this.$http.post('/search/list', {
                    userId: this.userId
                }, (res) => {
                    if (res.data && res.data.length > 0) {
                        let resArr = [];
                        let resObj = {}
                        for (let i = 0; i < res.data.length; i++) {
                            if (!resObj[res.data[i].queryKey]) {
                                resArr.push(res.data[i]);
                                resObj[res.data[i].queryKey] = true
                            }
                        }
                        this.historyList = resArr;
                    }else{
                        this.historyList = []
                    }
                })
            },
            // 点击搜索历史
            historyHandle(val) {
                this.searchValue = val;
                this.getSearch();
            },
            // 搜索
            getSearch() {
                if (this.searchValue == '') {
                    this.isSearch = false;
                    this.getHistorylist();
                    return;
                }
                this.$http.post('/search/query', {
                    userId: this.userId,
                    queryKey: this.searchValue
                }, (res) => {
                    this.isSearch = true;
                    this.searchList = res.data;
                }, () => {
                    this.$dialog.toast({
                        mes: '搜索失败，请重试！',
                        timeout: 1500
                    });
                })
            },
            // 清空搜索历史
            clearHistory() {
                this.$http.post('/search/clearSearch', {
                    userId: this.userId
                }, (res) => {
                    this.$dialog.toast({
                        mes: '已清空',
                        timeout: 1500
                    })
                    this.historyList = []
                }, () => {
                    this.$dialog.toast({
                        mes: '清空失败，请重试！',
                        timeout: 1500
                    })
                })
            },
            // 查看搜索商品详情
            checkGoods(id) {
                this.$router.push({path: '/goodDetail', query: {userId: this.userId, shopGoodsId: id, isH5: 1}})
            },
            // 取消搜索
            cancelFn() {
                this.$router.push({path: 'back'})
            }
        }

    }
</script>
<style>
    .yd-cell-box {
        margin-bottom: 0;
    }
</style>
<style scoped>

    .page {
        height: 100%;
        width: 100%;
        background: #fff;
    }

    .search_item {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
    }

    .search_cell {
        width: 6rem;
        height: 0.72rem;
        background: #f4f4f4;
        line-height: 0.72rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding-left: 0.2rem;
        flex: 3;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        align-content: center;
    }

    .search_cell .search_icon {
        margin-right: 0.2rem;
    }

    .no_page_item {
        height: auto;
        width: 100%;
        padding: 3rem 0;
        text-align: center;
    }

    .no_page_item img {
        width: 1.4rem;
        height: 1.5rem;
        margin: 0 auto;
    }

    .no_page_item p {
        font-size: 12px;
        color: #b0b0b0;
        margin-top: 0.2rem;
        text-align: center;
    }

    .cancel_btn {
        width: 0.8rem;
        height: 100%;
        line-height: 1rem;
        font-size: 0.32rem;
    }

    .history_item {
        background: #fff;
        margin-top: 1rem;
    }

    .history_list {
        width: 100%;
        font-size: 0;
    }

    .history_item li {
        display: inline-block;
        font-size: 0.28rem;
        color: #333;
        padding: 0.2rem 0.24rem;
    }

    .result_item {
        margin-top: 1rem;
        width:100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

</style>
