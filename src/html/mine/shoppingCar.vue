<template>
    <yd-layout title="购物车" link="/back">
        <ul class="car_list">
            <li v-for="(item ,index) in list" :key="index">
                <div class="car_left" @click="selectItem(index)">
                    <span :class="item.selected ? 'active': ''"></span>
                </div>
                <div class="car_center">
                    <div class="goods_img">
                        <img :src="item.goodsImg" alt="">
                    </div>
                    <div class="goods_detail" @click="checkGoodDetai(item.goodsId)">
                        <div class="one_row">{{item.goodsName}}</div>
                        <p class="fs-12 c-28" v-if="item.supplierGoodsDetail != undefined">{{item.supplierGoodsDetail.spec }}</p>
                        <span>￥{{ item.price}}</span>
                    </div>
                </div>
                <div class="car_right">
                    <yd-spinner  unit="1" width="1.6rem" height="0.45rem"  v-if="item.supplierGoodsDetail != undefined" v-model="item.number"   :val="item" :callback="numChange"></yd-spinner>
                </div>
            </li>
        </ul>

        <white-page v-if="list.length > 0 ? false :true"  noText="空空如也~"></white-page>

        <div class="car_footer" slot="bottom">
            <div class="car_tool">
                <yd-checkbox v-model="selectAll" size="20" @change.native="selAll" color="#606060"
                             style="font-size:0.28rem;" shape="circle">
                    全选
                </yd-checkbox>
                <p></p>
                <yd-button type="primary" bgcolor="#333" color="#fff" class="yc_btn" @click.native="delHandle">删除
                </yd-button>
            </div>
            <div class="car_end">
                <p>价格: <span>￥{{ allMoney }}</span></p>
                <yd-button type="primary" bgcolor="#333" color="#fff" class="yc_btn" @click.native="goPay">结算
                </yd-button>
            </div>
        </div>
    </yd-layout>
</template>

<script>
    import WhitePage from "../../components/whitePage";
    export default {
        name: "shopping-car",
        components: {WhitePage},
        data () {
            return {
                spinner1: 1,
                selectAll: false,
                list: []
            }
        },
        computed: {
            allMoney () {
                let allPrice = 0
                this.list.map((item) => {
                    if (item.selected) {
                        allPrice += Math.floor(parseFloat(item.price) * 100 * parseFloat(item.number)) / 100
                    }
                });
                return allPrice.toFixed(2)
            },
            hasSelect () {
                return this.list.filter(item => item.selected)
            }
        },
        watch: {
            list: {
                handler (val) {
                    let isAll = true
                    if (!val.length) {
                        isAll = false
                    } else {
                        val.map((item) => {
                            if (!item.selected) {
                                isAll = false
                            }
                        })
                    }
                    this.selectAll = isAll
                },
                deep: true
            }
        },
        created(){
            this.userId = this.$comm.getUrlKey('userId') || '224418465157615616';
            this.getCarList();
        },
        methods: {
            //获取购物车信息
            getCarList(){
                this.$dialog.loading.open('努力加载中...');
                this.$http.post('/myCays/findAllCars',{
                    userId:this.userId,
                },(res)=>{
                    this.$dialog.loading.close();
                    if(res.data.length> 0){
                        this.list =  res.data.map( (item) =>{
                            item.selected = false
                            return item;
                        })
                    }else{
                        this.list = []
                    }
                },(err)=>{
                    this.$dialog.loading.close();
                    this.$dialog.toast({
                        mes:err.msg,
                        timeout:1500
                    })
                })
            },
            // 选择某一项;
            selectItem (i) {
                this.list[i].selected = !this.list[i].selected;
            },
            // 全选/反选
            selAll () {
                this.list.forEach((item) => {
                    item.selected = !this.selectAll
                })
            },
            // 商品数量加减
            numChange(item,val){
                if(item.supplierGoodsDetail.stock < val){
                    this.$dialog.toast({
                        mes:'当前库存不足'
                    });
                    // item.number = item.supplierGoodsDetail.stock+  item.number
                    return ;
                }
                this.$http.post('/myCays/editCarInfo',{
                    carId:item.id,
                    num:val
                },(res)=>{
                    this.$dialog.toast({
                        mes: '修改成功！',
                        timeout: '1000'
                    });
                    return;
                },(err)=>{
                    this.$dialog.toast({
                        mes:err.msg,
                        timeout:1500
                    })
                })
            },
            // 删除  carId 是指  最外层id
            delHandle () {
                if (this.hasSelect.length > 0) {
                    this.$dialog.confirm({
                        title: '',
                        mes: '确认移除？',
                        opts: () => {
                            let selectList = this.list.filter(item =>{ return item.selected});
                            let carIdList = [];
                            selectList.map((item)=>{
                                carIdList.push(item.id)
                            }) ;//要移除的id 或数组
                            // 发送删除请求
                            this.$http.post('/myCays/delOneCar',{
                                carId:carIdList
                            },()=>{
                                this.$dialog.toast({
                                    mes:'删除成功',
                                    timeout:1500,
                                })
                                this.list = this.list.filter(item => !item.selected)
                            },(err)=>{
                                let errMsg = err.msg ? err.msg : '修改失败，请重试！'
                                this.$dialog.toast({
                                    mes:errMsg,
                                    timeout:1500,
                                })
                            })
                        }
                    })
                } else {
                    this.$dialog.toast({
                        mes: '请选择要移除的商品'
                    })
                }
            },
            // 查看商品详情
            checkGoodDetai(goodId){
                this.$router.push({path:'/goodDetail',query:{ shopGoodsId: goodId ,userId: this.userId,isH5: 1  }});
            },

            // 前往支付
            goPay () {
                if (this.hasSelect.length > 0) {
                    this.$dialog.confirm({
                        title: '',
                        mes: '确认结算？',
                        opts: () => {
                            // 提交结算订单
                            let selectList = this.list.filter((item)=>{ return item.selected == true});
                            this.$comm.setStorge('subOrderList',selectList);
                            this.$router.push({ path:'carOrderSubmit',query:{ userId: this.userId}});
                        }
                    })
                } else if(!this.list.length){
                    this.$dialog.toast({
                        mes: '购物车空空如也，快去逛逛吧！',
                        timeout:1500
                    })
                }else {
                    this.$dialog.toast({
                        mes: '请先选择商品',
                        timeout:1500
                    })
                }
            }
        }
    }
</script>
<style>
    .yd-confirm-hd,.yd-confirm-bd{
        text-align: center;
    }
</style>
<style scoped>
    .car_list {
        padding: 0 0.24rem;
        margin-bottom:0.2rem;
    }

    .car_list > li {
        height: 1.8rem;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: stretch;
        padding: 0.2rem 0.2rem 0.2rem 0;
        margin-top: 0.2rem;
        overflow: hidden;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
    }

    .car_left {
        width: 0.8rem;
        height: 100%;
        flex: 1;
        text-align: center;
        align-content: center;
        align-items: center;
        justify-content: center;
        display: flex;
    }

    .car_left span {
        width: 0.4rem;
        height: 0.4rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        border: 1px solid #606060;
        position: relative;
    }

    .car_left span.active::after {
        content: '';
        width: 0.24rem;
        height: 0.24rem;
        background: #606060;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -0.12rem;
        margin-top: -0.12rem;
    }

    .car_center {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-content: stretch;
    }

    .car_center .goods_detail {
        height: 100%;
        width: 3rem;
        overflow: hidden;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
        align-content: stretch;
        padding: 0 0.2rem;
    }

    .car_center .goods_img {
        width: 1.4rem;
        height: 1.4rem;
    }

    .car_center .goods_img img {
        width: 100%;
        height: 100%;
    }

    .car_right {
        display: flex;
        text-align: center;
        height: 100%;
        align-items: center;
    }

    .car_footer {
        width: 100%;
        height: 2rem;
        background: #fff;
    }

    .car_tool, .car_end {
        display: flex;
        justify-content: space-between;
        align-content: center;
        padding: 0.2rem 0.2rem 0;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .car_end p {
        font-size: 0.24rem;
        color: #606060;
    }

    .car_end > p > span {
        font-size: 0.36rem;
        color: #E01E1E;
    }
</style>
