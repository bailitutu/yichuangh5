import Vue from 'vue'
import Router from 'vue-router'
import goodDetail from '@/html/home/goodDetail'
import presellDetail from '@/html/home/presellDetail'
import search from '@/html/home/search'
import supplyGoods from '@/html/home/supplyGoods'
import addressList from '@/html/mine/addressList'
import addressEdit from '@/html/mine/addressEdit'
import addressSelect from '@/html/mine/addressSelect'
import changePassword from '@/html/mine/changePassword'
import changeShopIntro from '@/html/mine/changeShopIntro'
import changeShopName from '@/html/mine/changeShopName'
import concern from '@/html/mine/concern'
import orderSubmit from '@/html/mine/orderSubmit'
import phoneBinding from '@/html/mine/phoneBinding'
import phoneChange from '@/html/mine/phoneChange'
import shopDetail from '@/html/mine/shopDetail'
import shoppingCar from '@/html/mine/shoppingCar'


Vue.use(Router)

export default new Router({

    routes: [
        {
            path: '/search',
            name: 'search',
            component: search
        },
        {
            path: '/goodDetail',
            name: 'goodDetail',
            component: goodDetail
        },
        {
            path: '/presellDetail/:item',
            name: 'presellDetail',
            component: presellDetail
        },
        {
            path: '/addressList',
            name: 'addressList',
            component: addressList
        },{
            path: '/supplyGoods',
            name: 'supplyGoods',
            component: supplyGoods
        }, {
            path: '/addressEdit',
            name: 'addressEdit',
            component: addressEdit
        }, {
            path: '/addressSelect',
            name: 'addressSelect',
            component: addressSelect
        },
        {
            path: '/changePassword',
            name: 'changePassword',
            component: changePassword
        }, {
            path: '/changeShopIntro',
            name: 'changeShopIntro',
            component: changeShopIntro
        }, {
            path: '/changeShopName',
            name: 'changeShopName',
            component: changeShopName
        }, {
            path: '/concern',
            name: 'concern',
            component: concern
        }, {
            path: '/orderSubmit',
            name: 'orderSubmit',
            component: orderSubmit
        },
        {
            path: '/phoneBinding',
            name: 'phoneBinding',
            component: phoneBinding
        },
        {
            path: '/phoneChange',
            name: 'phoneChange',
            component: phoneChange
        }, {
            path: '/shopDetail',
            name: 'shopDetail',
            component: shopDetail
        },
        {
            path: '/shoppingCar',
            name: 'shoppingCar',
            component: shoppingCar
        }
    ]
})
