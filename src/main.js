// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'
// import '@/assets/font-icon/iconfont.css'
import '@/common/reset.css'
import Api from '@/common/api.js'
import myFilter from './filter'
import comm from '@/common/common.js'
import '@/common/ydui.flexible.js'
//引入fastClick
import FastClick from 'fastclick'
//初始化FastClick实例。在页面的DOM文档加载完成后
FastClick.attach(document.body)
FastClick.prototype.onTouchEnd = function(event) {
    if(event.target.hasAttribute("type") && event.target.getAttribute("type") == "text") {
        event.preventDefault();
        return false;
    }
}

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    preLoad: 1,    //预加载高度的比例
    // error: 'http://cdn.uehtml.com/201402/1392662591495_1140x0.gif',  //图像的src加载失败
    // loading: 'http://cdn.uehtml.com/201402/1392662591495_1140x0.gif', //src的图像加载
    attempt: 1,  //尝试计数
    listenEvents: [ 'scroll', 'mousewheel' ]
});

Vue.prototype.$http = Api
Vue.prototype.$comm = comm
Vue.use(YDUI)
// Vue.use(Vuex);

Vue.config.productionTip = false

for (let key in myFilter) {
    Vue.filter(key, myFilter[key])
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})



