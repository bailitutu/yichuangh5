<template>
    <yd-layout>
        <yd-navbar title="店铺介绍">
            <router-link to="/back" slot="left">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </router-link>
            <router-link slot="right" to="" @click.native="submitFn()">
                <span class="c-b0">保存</span>
            </router-link>
        </yd-navbar>
        <yd-cell-group style='padding:10px;' class="hasBra">
            <yd-cell-item class="input_cell ">
                <yd-input slot="right"  type="text" v-model="inputValue" placeholder="你需要一个好的介绍"></yd-input>
            </yd-cell-item>
        </yd-cell-group>
    </yd-layout>
</template>

<script>
    export default {
        name: "change-shop-intro",
        data(){
            return{
                inputValue:'',
                userId:''
            }
        },
        created(){
            this.userId = this.$comm.getUrlKey('userId') || ''
        },
        methods:{
            // 提交修改
            submitFn(){

                this.$http.post('/base/personalCenter',{
                    id:this.userId,
                    shopInfo:this.inputValue,
                },(res)=>{
                    this.$dialog.toast({
                        mes:'修改成功',
                        timeout:1500,
                        callback:()=>{
                            // 返回APP端
                            this.$comm.normalBack();
                        }
                    })

                },(err)=>{
                    this.$dialog.toast({
                        mes:err.msg,
                        timeout:1500
                    })
                })

            }

        }
    }
</script>
<style>
    .yd-cell{
        background: #f4f4f4;
    }
</style>
<style scoped>
    .input_cell{
        border:1px solid #f4f4f4;
        overflow:hidden;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
</style>
