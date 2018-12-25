<template>
    <div>
        <div class="nav_bar">
            <div class="nav_cell" @click.prevent="backPage">
                <yd-navbar-back-icon></yd-navbar-back-icon>
            </div>
            <p class="nav_title">绑定新手机号</p>
        </div>
        <div class="change_icon">
            <img src="../../assets/change_icon.png" alt="">
        </div>
        <div class="phone_tip">
            <p>您当前已绑定手机 <span>{{phoneDeal}}</span></p>
        </div>
        <yd-cell-group class="change_section">
            <yd-cell-item class="change_item">
                <span slot="left" class="phone_label">+86</span>
                <yd-input slot="right" v-model="newPhone" regx="mobile" :show-success-icon="false"
                          :show-error-icon="false" placeholder="请输入新手机号码"></yd-input>
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
            <yd-button type="primary" size="large" bgcolor="#333333" color="#fff" @click.native="submitFn">确定
            </yd-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "phone-binding",
        data() {
            return {
                hasSend: false,
                newPhone: '',
                bindPhone: '',
                returnCode: '',
                testCode: ''
            }
        },
        computed: {
            phoneDeal() {
                return this.bindPhone.substr(0, 3) + '****' + this.bindPhone.substr(7)
            }
        },
        created() {
            this.bindPhone = this.$comm.getUrlKey('phone') || '';
        },
        methods: {
            // 页面回跳
            backPage() {
                this.$router.back(-1);
            },
            // 发送验证码
            sendCode() {
                if (this.newPhone == '') {
                    this.$dialog.toast({
                        mes: '请先输入新手机号！',
                        timeout: 1500
                    })
                    return;
                }
                this.$dialog.loading.open('发送中...');
                setTimeout(() => {
                    this.$http.post('/base/getCheckCode', {
                        phone: this.newPhone,
                        type: 0
                    }, (res) => {
                        this.returnCode = res.data.code;
                        this.hasSend = true;
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '已发送,请注意查收',
                            icon: 'success',
                            timeout: 1500
                        })
                    }, () => {
                        this.$dialog.loading.close();
                        this.$dialog.toast({
                            mes: '发送失败，请稍候重试！',
                            timeout: 1500
                        })
                        return;
                    })
                }, 300)
            },
            // 提交修改
            submitFn() {
                if (this.returnCode == '') {
                    this.$dialog.toast({
                        mes: '请先获取验证码！',
                        timeout: 1500
                    })
                    return;
                }
                if (this.testCode == '' || this.testCode.length != 6 || this.returnCode != this.testCode) {
                    this.$dialog.toast({
                        mes: '验证码错误！',
                        timeout: 1500
                    })
                    return;
                }
                this.$dialog.loading.open('正在提交...');
                setTimeout(() => {
                    this.$http.post('/base/changePhone', {
                        oldPhone: this.bindPhone,
                        newPhone: this.newPhone
                    }, (res) => {
                        this.$dialog.loading.close()
                        this.$dialog.toast({
                            mes: '修改成功！',
                            icon: 'success',
                            timeout: 1500,
                            callback: () => {
                                if (this.$comm.isIos()) {
                                    goExit()
                                } else if (this.$comm.isAndroid()) {
                                    window.location.href = 'http://www.yichuangpt.com/static/gotoLogin.html';
                                }
                            }
                        });
                    }, (err) => {
                        this.$dialog.loading.close();
                        let errmsg = '修改失败，请稍候重试！';
                        if (err.msg) {
                            errmsg = err.msg
                        }
                        this.$dialog.toast({
                            mes: errmsg,
                            timeout: 1500
                        })
                    })
                }, 200)
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

    .change_icon {
        width: 100%;
        height: auto;
        text-align: center;
        padding: 1.72rem 0 0.2rem;
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
