import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
const state = {
    preOrderInfo: {
        selectAddressId:'',
        goodsId:'',
        num:'',
        specId:'',
        userId:''
    }
}
const mutations = {
    updateAddress(state,newAdd){
        return state.preOrderInfo.selectAddressId = newAdd
    },
    updateOrderInfo(state,newInfo){
        return state.preOrderInfo = {...newInfo}
    }
}

//待提交的订单信息
const orderPreInfo = {}

const store = new Vuex.Store({
    state,
    mutations
})
export default store

