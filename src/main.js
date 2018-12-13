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

Vue.prototype.$http = Api
Vue.prototype.$comm = comm
Vue.use(YDUI)
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
