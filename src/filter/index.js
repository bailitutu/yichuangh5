let myFilter = {
    /**
     * 将字符串金额保留两位小数或0.00
     */
    money: function (val) {
        if (!val) {
            return '0.00'
        } else {
            return Math.floor(parseFloat(val * 100)) / 100
        }
    },
    /**
     * 将手机号隐藏中间四位 例如：138****6666；
     */
    hidePhone: function (val) {
        return val.substr(0, 3) + '****' + val.substr(7)
    },
    /**
     * 转换为金额 99.99 形式
     */
    transMoney: function (val) {
        return Math.floor(parseFloat(val * 100)) / 100
    }
}

export default myFilter

