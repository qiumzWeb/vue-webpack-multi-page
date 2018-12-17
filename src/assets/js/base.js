import Vue from 'vue'
const Common = {
    domain: document.domain.substring(document.domain.indexOf(".")),
    // cookie封装
    cookie: {
        get: (n) => {
            let m = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
            return !m ? "" : m[2];
        },
        set: (name, value, domain, path, hour, expireTime) => {
            let cookie = [
                name + "=" + value + ";"
            ];
            if (domain && domain != "/") {
                cookie.push("domain =" + domain);
            } else {
                cookie.push("domain =" + Common.domain);
            }
            if (path) {
                cookie.push("path =" + path);
            }
            if (hour) {
                let expire = new Date();
                expire.setTime(expire.getTime() + (hour * 60 * 60 * 1000));
                cookie.push("expires=" + expire.toGMTString());
            }
            if (expireTime) {
                let expire = new Date(expireTime);
                cookie.push("expires=" + expire.toGMTString());
            }
            document.cookie = cookie.join(";");
        },
        del: (name, domain, path) => {
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + (domain && domain != '/' ? ("domain=" + domain + ";") : "domain=" + Common.domain);
            // 旧数据清理
            document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=" + (path ? path : "/") + "; " + "domain=";
        }
    },
    tempStore: {
        get: key => window.sessionStorage && window.sessionStorage.getItem(key),
        /* 赋值 */
        set: (key, data) => window.sessionStorage && window.sessionStorage.setItem(key, data),
        /* 删除 */
        remove: key => window.sessionStorage && window.sessionStorage.removeItem(key),
        /*  [慎用] 清除所有的key/value */
        clear: () => window.sessionStorage && window.sessionStorage.clear()
    },

    queryBom: (n) => {
        let m = window.location.search.match(new RegExp("(\\?|&)" + n + "=([^&]*)(&|$)"));
        return !m ? "" : decodeURIComponent(m[2]);
    },
    HOSTNAME: window.location.protocol + "//" + window.location.host
}
Common.localStore = {
        get: (key) => {
            if (window.localStorage) {
                return window.localStorage && window.localStorage[key];
            } else {
                Common.cookie.get(key);
            }
        },
        /* 赋值 */
        set: (key, data) => {
            try { //隐私模式异常
                if (window.localStorage) {
                    window.localStorage && window.localStorage.setItem(key, data);
                } else {
                    Common.cookie.set(key, data);
                }
            } catch (e) {
                console.log(e);
            }
        },
        /* 删除 */
        remove: (key) => {
            if (window.localStorage) {
                return window.localStorage && window.localStorage.removeItem(key);
            } else {
                Common.cookie.del(key);
            }
        },
        /* [慎用] 清除所有的key/value*/
        clear: () => window.localStorage && window.localStorage.clear()
    }
    //判断是否app
Common.deviceType = (Common.cookie.get("source") || "wap").toLowerCase();

//浏览器内核
Common.browser = {
    versions: (() => {
        const u = navigator.userAgent;
        const app = navigator.appVersion;
        return { // 移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
            weixin: u.indexOf("MicroMessenger") > -1 // 是否是微信环境
        };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
let Hub = new Vue(); // 创建事件中心
Common.alert = (type = 'default', message, time = 2, callback, args) => {
    Hub.$emit('alert', type, message, time);
    setTimeout(() => {
        if (typeof (callback) === 'function') {
            if (args) {
                callback(args);
            } else {
                callback();
            }
        }
    }, time * 1000);
}
Common.confirm = (data, okeyCall, cancelCall) => {
    Hub.$emit('confirm', data, okeyCall, cancelCall);
}
module.exports = {
    Vue,
    Common,
    Hub,
}