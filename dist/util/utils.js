'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  // POST Request
  post: function post(config) {
    var app = getApp();
    var PID = app.globalData.pid;
    config['method'] = 'POST';
    if (config.header) {
      config.header['Content-Type'] = "application/x-www-form-urlencoded";
    } else {
      config.header = { "Content-Type": "application/x-www-form-urlencoded" };
    }
    config.url += '?pid=' + PID;
    return wx.request(config);
  },

  // Get Request
  get: function get(config) {
    var app = getApp();
    var PID = app.globalData.pid;
    config.url += '?pid=' + PID;
    return wx.request(config);
  },

  // 格式化queryString
  filedFormat: function filedFormat(obj) {
    var str = "";
    for (var key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        str += key + '=' + obj[key] + '&';
      }
    }
    return str.length ? str.substr(0, str.length - 1) : str;
  },

  // 节流函数
  throttle: function throttle(fn, delay) {
    var timer = null;
    return function () {
      var context = this,
          args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  },

  // 是否存在于数组
  inArray: function inArray(arr, item, key) {
    if (!(arr instanceof Array)) return;
    var result = false;
    for (var i = 0; i < arr.length; i++) {
      if (key) {
        if (arr[i][key] == item[key]) {
          result = true;
          break;
        }
      } else {
        if (arr[i] == item) {
          result = true;
          break;
        }
      }
    }
    return result;
  },

  // 设置顶部为白底的通用
  setWhiteNavBar: function setWhiteNavBar() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
  },

  //数组去重
  unique: function unique(arr) {
    var tmpArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (tmpArr.indexOf(arr[i]) == -1) {
        tmpArr.push(arr[i]);
      }
    }
    return tmpArr;
  },

  // 数字格式化
  formatNum: function formatNum(num) {
    return num > 9 ? num : '0' + num;
  },

  // 格式化日期对象
  formatDate: function formatDate(stamp) {
    stamp = parseInt(stamp);
    var date = stamp ? new Date(stamp) : new Date();
    var Y = date.getFullYear();
    var M = date.getMonth() + 1;
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return {
      Y: Y,
      M: this.formatNum(M),
      D: this.formatNum(D),
      h: this.formatNum(h),
      m: this.formatNum(m),
      s: this.formatNum(s)
    };
  },

  // 获取当前页面的query参数
  getCurPageOpt: function getCurPageOpt() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 1];
    return page.options;
  },

  // 根据key排序
  sortByKey: function sortByKey(arr, key) {
    arr.sort(function (x, y) {
      return y[key] - x[key];
    });
  },


  // 获取符合使用规则的代金券
  getAvailableCoupon: function getAvailableCoupon(cps, price) {
    price = parseInt(price);
    var temp = [];
    // 过滤达不到估价金额优惠券
    for (var i = 0; i < cps.length; i++) {
      cps[i]['useLimited'] = parseInt(cps[i]['useLimited']);
      cps[i['faceValue']] = parseInt(cps[i['faceValue']]);
      if (cps[i]['status'] == 10) {
        var couponPrice = cps[i]['useLimited'] / 1000;
        if (price >= couponPrice) {
          temp.push(cps[i]);
        }
      }
    }
    // 价格排序
    this.sortByKey(temp, 'faceValue');
    return temp[0];
  },

  // 是否为有效的手机号码
  isMobile: function isMobile(tel) {
    return (/^1\d{10}$/.test(tel)
    );
  },
  curTimeStamp: function curTimeStamp() {
    return new Date().getTime();
  }
};
//# sourceMappingURL=utils.js.map