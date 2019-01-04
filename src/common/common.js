//判断是否是安卓
function isAndroid() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    return isAndroid == true ? true : false;
}

//判断是否是ios
function isIos() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isIOS == true ? true : false;
}

// 常规返回
function normalBack() {
    if (isAndroid()) {
        window.location.href = 'http://www.yichuangpt.com/static/gotoAndroid.html'
    } else if (isIos()) {
        goBack();
    }
}

// APP下载
function downLoadApp() {
    if (isAndroid()) {
        window.location.href = 'https://www.baidu.com/?tn=22073068_2_oem_dg'
    } else if (isIos()) {
        window.location.href = 'https://www.baidu.com/?tn=22073068_2_oem_dg'
    }
}

//设置localStorage
function setLocalStorage(key, value, seconds) {
    if (!value) localStorage.removeItem(key);
    else {
        let seconds = (seconds || 30 * 60) * 1000; // 资源有效期，默认保留30分钟
        let exp = new Date();
        localStorage[key] = JSON.stringify({value: value, expires: exp.getTime() + seconds});
    }
};


// 获取LocalStorage
function getLocalStorage(key) {
    if (localStorage.length > 0 && localStorage[key]) {
        let o = JSON.parse(localStorage[key]);
        localStorage.removeItem(key)
        if (!o || o.expires < Date.now()) return null;
        if (o && o.expires >= Date.now()) setLocalStorage(key, o.value);
        return o.value
    } else return null;
};

export default {
    isAndroid: isAndroid,
    isIos: isIos,
    normalBack: normalBack,
    getUrlKey: function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
    },
    setStorge: function (key, val) {
        setLocalStorage(key, val);
    },
    getStorge: function (key) {
        return getLocalStorage(key)
    },
    removeStorge: function (key) {
        localStorage.removeItem(key)
    },
    clearStorge: function () {
        window.localStorage.clear();
    },
    downLoadApp: downLoadApp
}



