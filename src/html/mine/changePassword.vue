<template>
    <yd-layout title='密码修改' link="back">
        <div class="change_icon">
            <img src="../../assets/change_icon.png" alt="">
        </div>
        <yd-cell-group class="change_section">
            <yd-cell-item class="change_item">
                <yd-input slot="right" type="password" v-model="oldPwd" placeholder="输入旧密码"></yd-input>
            </yd-cell-item>
        </yd-cell-group>
        <yd-cell-group class="change_section">
            <yd-cell-item class="change_item">
                <yd-input slot="right" type="password" v-model="newPwd" placeholder="输入新密码"></yd-input>
            </yd-cell-item>
        </yd-cell-group>
        <yd-cell-group class="change_section">
            <yd-cell-item class="change_item">
                <yd-input slot="right" type="password" v-model="secongNewPwd" placeholder="再次确认密码"></yd-input>
            </yd-cell-item>
        </yd-cell-group>

        <div style="margin:0 0.7rem;">
            <yd-button type="primary" size="large" bgcolor="#333333" color="#fff" @click.native="submitFn">确定</yd-button>
        </div>
    </yd-layout>
</template>

<script>
    export default {
        name: "change-password",
        data(){
            return {
                oldPwd:'',
                newPwd:'',
                secongNewPwd:'',
                phone:''
            }
        },
        created(){
            this.phone =  this.$comm.getUrlKey('phone') || '';
        },
        methods:{
            // 提交修改
            submitFn(){
                // 验证

                if(this.phone == '' || !this.phone){
                    this.$dialog.toast({
                        mes:'用户信息获取失败，请重试！'
                    })
                    return;
                }
                if(this.oldPwd == '' || !this.oldPwd){
                    this.$dialog.toast({
                        mes:'请输入原密码！'
                    })
                    return;
                }
                if(this.newPwd == '' || !this.newPwd){
                    this.$dialog.toast({
                        mes:'请输入新密码！'
                    })
                    return;
                }
                if(this.secongNewPwd == '' || !this.secongNewPwd){
                    this.$dialog.toast({
                        mes:'请再次输入新密码！'
                    })
                    return;
                }
                if(this.newPwd !=  this.secongNewPwd){
                    this.$dialog.toast({
                        mes:'两次输入的密码不一致！'
                    })
                    return;
                }
                this.$http.post('/base/changePassword',{
                    phone:this.phone,
                    oldPwd:this.oldPwd,
                    newPwd:this.newPwd
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

<style scoped>
    .change_icon{
        width: 100%;
        height:auto;
        text-align: center;
        padding:0.72rem 0 0.2rem;
    }
    .change_icon img{
        width:4.40rem;
        height:4.40rem;
    }
    .change_section{
        margin: 0.4rem 0.7rem;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
        overflow: hidden;
    }
</style>
