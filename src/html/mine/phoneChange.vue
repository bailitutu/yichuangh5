<template>
    <yd-layout title='手机号码更改' link="/back">
        <div class="change_icon">
            <img src="../../assets/change_icon.png" alt="">
        </div>
        <div class="phone_tip">
            <p>您当前已绑定手机 <span>{{bindPhone | hidePhone}}</span></p>
        </div>
        <yd-cell-group class="change_section">
            <yd-cell-item class="change_item">
                <span slot="left" class="phone_label">+86</span>
                <yd-input slot="right" :value="bindPhone" :show-success-icon="false" :show-error-icon="false" :show-clear-icon="false" readonly placeholder="请输入原手机号码"></yd-input>
            </yd-cell-item>
        </yd-cell-group>
        <yd-cell-group class="change_section">
            <yd-cell-item class="change_item">
                <input slot="right" type="number" max="6" v-model="testCode" placeholder="请输入验证码">
                <yd-sendcode slot="right"
                             v-model="hasSend"
                             @click.native="sendCode"
                             type="warning"
                ></yd-sendcode>
            </yd-cell-item>
        </yd-cell-group>

        <div style="margin:0 0.7rem;">
            <yd-button type="primary" size="large" bgcolor="#333333" color="#fff" @click.native="nextFn">下一步</yd-button>
        </div>
    </yd-layout>
</template>

<script>
    export default {
        name: "phone-change",
        data () {
            return {
                hasSend: false,
                bindPhone: '18223423412',
                testCode:'',
                returnCode: ''
            }
        },
        created(){
            this.bindPhone = this.$comm.getUrlKey('phone') || '18458893454';
        },
        methods: {
            // 发送验证码
            sendCode () {
                this.$dialog.loading.open('发送中...');
                setTimeout(() => {
                    this.$http.post('/base/getCheckCode',{
                        phone:this.bindPhone,
                        type: 0
                    },(res) =>{
                        this.returnCode = res.data.code;
                        this.hasSend = true;
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '已发送,请注意查收',
                            icon: 'success',
                            timeout: 1500
                        });
                    },() => {
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '发送失败，请稍候重试！',
                            timeout: 1500
                        })
                    })
                }, 300)
            },
            // 下一步
            nextFn () {
                if(this.returnCode == '' ){
                    this.$dialog.toast({
                        mes: '请先获取验证码！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.testCode == '' || this.testCode.length != 6 || this.returnCode != this.testCode ){
                    this.$dialog.toast({
                        mes: '验证码错误！',
                        timeout: 1500
                    })
                    return;
                }
                this.$router.push({path: '/phoneBinding',query:{ phone: this.bindPhone}})
            }

        }
    }
</script>
<style scoped>
    .change_icon {
        width: 100%;
        height: auto;
        text-align: center;
        padding: 0.72rem 0 0.2rem;
    }

    .change_icon img {
        width: 4.40rem;
        height: 4.40rem;
    }

    .change_section {
        margin: 0.4rem 0.7rem;
        -webkit-border-radius: 0.08rem;
        -moz-border-radius: 0.08rem;
        border-radius: 0.08rem;
        overflow: hidden;
    }

    .phone_tip {
        text-align: center;
        font-size: 0.28rem;
        color: #606060;
    }

    .phone_tip span {
        color: #0C7FE7;
    }

    .phone_label {
        width: 0.84rem;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        border-right: 1px solid #9B9B9B;
        margin-right: 0.2rem;
    }
</style>
