<template>
    <yd-layout title="编辑地址" link="/addressList">
        <yd-cell-group class="mt-10">
            <yd-cell-item>
                <span slot="left">收货人名称：</span>
                <input slot="right" type="text" v-model="name" placeholder="请输入收货人名称">
            </yd-cell-item>
            <yd-cell-item>
                <span slot="left">手机号：</span>
                <yd-input slot="right" v-model="phone" required :show-success-icon="false" :show-error-icon="false"
                          regex="mobile" placeholder="请输入手机号码"></yd-input>
            </yd-cell-item>

            <yd-cell-item>
                <span slot="left">邮编：</span>
                <input slot="right" type="number" v-model="postalCode" value="postalCode" placeholder="请输入邮编">
            </yd-cell-item>

            <yd-cell-item arrow>
                <span slot="left">所在地区：</span>
                <input slot="right" type="text" @click.stop="show2 = true" v-model="address" readonly
                       placeholder="请选择所在地区">
            </yd-cell-item>
            <yd-cell-item>
                <span slot="left" style="align-self:flex-start;padding-top:8px;">详细地址：</span>
                <yd-textarea slot="right" placeholder="请输入详细地址" maxlength="100" v-model="detailaddr"></yd-textarea>
            </yd-cell-item>
            <div class="set_default">
                <yd-checkbox v-model="isDefault" size="16"><span style="font-size:14px;">设为默认地址</span></yd-checkbox>
            </div>
        </yd-cell-group>
        <yd-cityselect v-model="show2" :callback="selAddress" :items="district" :provance="province" :city="city" :area="area" ></yd-cityselect>
        <div class="prl-10 mt-10">
            <yd-button size="large" type="primary" bgcolor="#fff" color="#282828" @click.native="savahandler"> 保存
            </yd-button>
        </div>
        <div class="prl-10 mt-10" v-if=" pageType == 0 ? false : true">
            <yd-button size="large" type="danger" class="mt-10" color="#fff" @click.native="delAddress"> 删除地址
            </yd-button>
        </div>
    </yd-layout>
</template>

<script>
    import District from 'ydui-district/dist/gov_province_city_area_id'

    export default {
        name: 'address-edit',
        data() {
            return {
                show2: false,
                userId: '',
                addressId: '',
                pageType: 0,
                name: '',
                province: '',
                city: '',
                area: '',
                phone: '',
                postalCode: '',
                address: '',
                detailaddr: '',
                isDefault: true,
                district: District,
            }
        },
        created() {
            this.pageType = this.$route.query.pageType || 0;  //0: 新增 ；1： 修改；
            this.userId = this.$route.query.userId;
            if (this.pageType) {
                this.addressId = this.$route.query.addressId;
                this.getAddressDetail(this.addressId)
            }
        },
        methods: {
            // 修改地址时获取地址信息
            getAddressDetail(id) {
                this.$http.post('/userAddress/getOneAddrDateil', {
                    id: id
                }, (res) => {
                    console.log(res.data);
                    this.name = res.data.name;
                    this.isDefault = res.data.isDefault== '1' ? true : false;
                    this.phone = res.data.phone;
                    this.detailaddr = res.data.detailaddr;
                    this.postalCode = res.data.postalCode;
                    this.address = res.data.province + ' ' + res.data.city + ' ' + res.data.area;

                })
            },

            // 点击保存
            savahandler() {
                // 验证
                if(this.name == ""){
                    this.$dialog.toast({
                        mes: '请填写收货人！',
                        timeout: 1500
                    })
                    return;
                }

                if(this.phone == ""  ){
                    this.$dialog.toast({
                        mes: '请填写收货人手机号！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.postalCode == ""){
                    this.$dialog.toast({
                        mes: '请填写邮编！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.postalCode.length != 6){
                    this.$dialog.toast({
                        mes: '邮编错误！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.province == ""){
                    this.$dialog.toast({
                        mes: '请选择地区！',
                        timeout: 1500
                    })
                    return;
                }
                if(this.detailAddr == ""){
                    this.$dialog.toast({
                        mes: '请填写详细地址！',
                        timeout: 1500
                    })
                    return;
                }

                if (!this.pageType) { //新增
                    this.addAddress()
                } else { //修改
                    this.editAddress();
                }
            },
            // 新增地址
            addAddress() {
                let postData = {
                    userId: this.userId,
                    consignee: this.name,
                    postalCode: this.postalCode,
                    isDefault: this.isDefault ? '1' : false,
                    phone: this.phone,
                    province: this.province,
                    city: this.city,
                    area: this.area,
                    detailAddr: this.detailaddr
                };
                console.log(postData)
                this.$http.post('/userAddress/saveAddress', postData, (res) => {
                    this.$dialog.toast({
                        mes: '添加成功',
                        callback: () => {
                            this.$router.back(-1)
                        }
                    })
                })
            },

            // 修改地址
            editAddress() {

                let postData = {
                    id: this.addressId,
                    userId: this.userId,
                    consignee: this.name,
                    postalCode: this.postalCode,
                    phone: this.phone,
                    province: this.province,
                    city: this.city,
                    area: this.area,
                    detailAddr: this.detailAddr,
                    isDefault: this.isDefault ? '1' : false,
                };
                this.$http.post('/userAddress/updateAdd', postData, (res) => {
                    this.$dialog.toast({
                        mes: '修改成功',
                        callback: () => {
                            this.$router.back(-1)
                        }
                    })
                })
            },

            // 选择省市区
            selAddress(ret) {
                this.address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
                this.province = ret.itemValue1;
                this.city = ret.itemValue2;
                this.area = ret.itemValue3;
            },
            // 删除地址
            delAddress() {
                this.$dialog.confirm({
                    mes: '确认删除？',
                    opts: () => {
                        this.$dialog.loading.open('');
                        this.$http.post('/userAddress/delAddress', {
                            id: this.addressId,
                        }, () => {
                            this.$dialog.loading.close();
                            this.$dialog.toast({
                                mes: '删除成功',
                                timeout: 1500,
                                icon: 'success',
                                callback: () => {
                                    this.$router.history.go(-1);
                                }
                            })
                        })
                    }
                })
            }


        }
    }
</script>

<style>
    .mt-10 {
        margin-top: 10px;
    }

    .prl-10 {
        padding: 0 12px;
    }

    .set_default {
        padding: 12px;
        background: #fff;
    }

    .yd-cell-left {
        min-width: 100px;
    }

    .plr-10 {
        padding: 0 10px;
    }


</style>
