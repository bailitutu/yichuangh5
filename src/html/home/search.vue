<template>
    <yd-layout class="page">
        <yd-cell-group class="search_item">
            <yd-cell-item >
                <div slot="left" class="search_cell">
                    <yd-icon name="search" size="15px" class="search_icon" ></yd-icon>
                    <yd-input v-model="searchValue" required :show-success-icon="false" :show-error-icon="false"  placeholder="寻找你的专属"></yd-input>
                </div>
                <yd-button slot="right" type="default" size="small" bgcolor="#fff" color="#333" class="cancel_btn">取消</yd-button>
            </yd-cell-item>
        </yd-cell-group>

        <div class="history_item" v-show="!isSearch">
            <yd-cell-group>
                <yd-cell-item class="">
                    <p slot="left" style="font-weight:bold;" class="fs-16"> 搜索历史</p>
                    <yd-button slot="right" type="primary" size="mini" bgcolor="#f4f4f4" color="#333333" @click.native="clearHistory">清除</yd-button>
                </yd-cell-item>
            </yd-cell-group>
            <ul class="history_list">
               <li v-for="(his,ind) in historyList" :key="ind" @click="historyHandle(  )">
                   <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">体育场馆预定</yd-button>
               </li>
                <li>
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">停车泊位</yd-button>
                </li>
                <li>
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">体育场馆预定</yd-button>
                </li>
                <li>
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">停车泊位</yd-button>
                </li>
                <li>
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">体育场馆预定</yd-button>
                </li>
                <li>
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">停车泊位</yd-button>
                </li>
                <li>
                    <yd-button type="primary" size="small" bgcolor="#f4f4f4" color="#333333">体育场馆预定</yd-button>
                </li>
            </ul>
        </div>
        <yd-cell-group class="result_item" v-show="isSearch">
            <yd-cell-item v-for="(item,index) in  searchList" :key="index" @click.native="checkGoods()">
                 <span slot="left" class="fs-14 c-28">长袖衣服</span>
            </yd-cell-item>
        </yd-cell-group>
    </yd-layout>
</template>

<script>
    export default {
        name: "search",
        data(){
            return {
                searchValue:'寻找你的专属',
                searchList:[], //搜索结果
                historyList:[ ], //搜索历史
                isSearch:false //是否在搜索
            }
        },
        watch:{
            searchValue:()=>{
                this.isSearch = false; //重置搜索
                this.getSearch();
            }
        },
        created(){
          this.userId = this.$comm.getUrlKey('userId') || ''
          this.getHistorylist();
        },
        methods:{
            // 获取搜索历史列表
            getHistorylist(){
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    console.log(res)
                    this.historyList = res.data;
                })
            },
            // 点击搜索历史
            historyHandle( val){
                this.searchValue = val;
            },
            // 搜索
            getSearch( ){
                this.isSearch = true
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    value: this.searchValue
                }, (res) => {
                    console.log(res)
                    this.searchList = res.data;
                })
            },
            // 清空搜索历史
            clearHistory(){
                this.$http.post('/userAddress/findAllAddrByUserId', {
                    userId: this.userId
                }, (res) => {
                    console.log(res)
                    this.$dialog.toast({
                        mes: '已清空',
                        timeout:1500
                    })
                    this.historyList = []
                })
            },
            // 查看搜索商品详情
            checkGoods(id){
                this.$router.push({path:'goodDetail',query:{ userId:this.userId,shopGoodsId: id}})
            }
        }
    }
</script>
<style>
    .yd-cell-box{
        margin-bottom:0;
    }
</style>
<style scoped>
    .page{
        height: 100%;
        width: 100%;
        background: #fff;
    }
    .search_item{
        position:fixed;
        top:0;
        left:0;
        z-index: 1000;
    }
    .search_cell{
        width:6rem;
        height:0.72rem;
        background: #f4f4f4;
        line-height: 0.72rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        padding-left:0.2rem;
        flex:3;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        align-content: center;
    }
    .search_cell .search_icon{
        margin-right:0.2rem;
    }
    .cancel_btn{
        width:0.8rem;
        height:100%;
        line-height: 1rem;
        font-size:0.32rem;
    }
    .history_item{
        background: #fff;
        margin-top:1rem;
    }
    .history_list{
        width: 100%;
        font-size:0;
    }
    .history_item li{
        display: inline-block;
        font-size:0.28rem;
        color:#333;
        padding:0.2rem 0.24rem;
    }
    .result_item{
        margin-top:1rem;
    }

</style>
