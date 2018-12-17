
const Tools =  {
    // 获取url参数
    queryBom: (n) => {
        let m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
        return !m ? "" : decodeURIComponent(m[2]);
    },
	// money格式化
    formatMoney:  (mVal, iAccuracy = 2) => {
        let fTmp = 0.00, // 临时变量
            iFra = 0, // 小数部分
            iInt = 0, // 整数部分
            aBuf = new Array(), // 输出缓存
            bPositive = true, // 保存正负值标记(true:正数)
            funZero = (iVal, iLen) => {
                let sTmp = iVal.toString();
                let sBuf = new Array();
                for (let i = 0, iLoop = iLen - sTmp.length; i < iLoop; i++)
                    sBuf.push('0');
                sBuf.push(sTmp);
                return sBuf.join('');
            };
        bPositive = (mVal >= 0); // 取出正负号
        fTmp = (isNaN(fTmp = parseFloat(mVal))) ? 0 : Math.abs(fTmp);// 强制转换为绝对值数浮点
        // 所有内容用正数规则处理
        iInt = parseInt(fTmp); // 分离整数部分
        iFra = parseInt((fTmp - iInt) * Math.pow(10, iAccuracy) + 0.5); //  分离小数部分(四舍五入)
        do {
            aBuf.unshift(funZero(iInt % 1000, 3));
        } while ((iInt = parseInt(iInt / 1000)));
        aBuf[0] = parseInt(aBuf[0]).toString();// 最高段区去掉前导0
        if (0 === iFra) {
            return ((bPositive) ? '' : '-') + aBuf.join(',')
        } else {
            return ((bPositive) ? '' : '-') + aBuf.join(',') + '.' + ((0 === iFra) ? '00' : funZero(iFra, iAccuracy));
        }
    },
    // 解析money格式
    unformatMoney: (sVal) => {
        let fTmp = parseFloat(sVal.replace(/,/g, ''));
        return (isNaN(fTmp) ? 0 : fTmp);
    },
    // 手机号码正则
    rephone : /^1[3|4|5|8|7][0-9]{9}$/,
    // rephone:/^1110[0-9]{7}$/,   //====测试环境=====
    // 验证码正则
    capt: /^[0-9]{6}$/,
    // 登录密码正则
    rePwd: /^(?![\d]+$)(?![a-z]+$)(?![A-Z]+$)(?![^\da-zA-Z]+$)/,
    // 姓名正则
    reName: /^[\w\u3E00-\u9FA5]+$/,
    // 身份证号正则
    reIdCard: /(^\d{15,18}$)|(^\d{17}(\d|X|x)$)/,
    // 银行卡号正则
    reBankCard: /^(\d{16,19})$/,
    // 金额正则（最少1，最多带两位小数）
    reMoneyGt1: /^[1-9][0-9]*([.][0-9]{1,2}){0,1}$/
}

Date.prototype.Format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,          //月份
        "d+": this.getDate(),                    //日
        "[Hh]+": this.getHours(),                   //小时
        "m+": this.getMinutes(),              //分
        "s+": this.getSeconds(),                //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Tools.formatDate = (pattern, seconds) => {
    let newTime;
    if (seconds) {
        newTime = new Date(Number(seconds) * 1000);
    } else {
        newTime = new Date();
    }
    return newTime.Format(pattern);
}
Tools.numberFormat = (_number) => {
    if (_number && !isNaN(parseFloat(_number))) {
        _number = parseFloat(_number);
        return _number.toFixed(2);
    } else {
        return _number;
    }
}
Tools.trim = (str) => {
    let result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    result = result.replace(/\s/g, "");
    return result;
}
module.exports = {
    Tools
}
