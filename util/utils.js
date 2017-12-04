export default {
  // POST Request
  post (config) {
    let app = getApp();
    let PID = app.globalData.pid;
    config['method'] = 'POST';
    if (config.header) {
      config.header['Content-Type'] = "application/x-www-form-urlencoded";
    } else {
      config.header = {"Content-Type": "application/x-www-form-urlencoded"};
    }
    config.url += `?pid=${ PID }`;
    return wx.request(config);
  },
  // Get Request
  get (config) {
    let app = getApp();
    let PID = app.globalData.pid;
    config.url += `?pid=${ PID }`;
    return wx.request(config);
  },
  // 格式化queryString
  filedFormat(obj) {
    let str = "";
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        str += `${key}=${obj[key]}&`;
      }
    }
    return str.length ? str.substr(0, str.length - 1) : str;
  },
  // 节流函数
  throttle (fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  },
  // 是否存在于数组
  inArray (arr, item, key) {
    if (!(arr instanceof Array)) return;
    let result = false;
    for (let i = 0; i < arr.length; i++) {
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
  setWhiteNavBar () {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    })
  },
  //数组去重
  unique(arr){
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (tmpArr.indexOf(arr[i]) == -1) {
        tmpArr.push(arr[i]);
      }
    }
    return tmpArr;
  },
  // 数字格式化
  formatNum (num) {
    return num > 9 ? num : `0${num}`
  },
  // 格式化日期对象
  formatDate (stamp) {
    stamp = parseInt(stamp);
    let date = stamp ? new Date(stamp) : new Date();
    let Y = date.getFullYear();
    let M = date.getMonth() + 1;
    let D = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return {
      Y,
      M: this.formatNum(M),
      D: this.formatNum(D),
      h: this.formatNum(h),
      m: this.formatNum(m),
      s: this.formatNum(s),
    }
  },
  // 获取当前页面的query参数
  getCurPageOpt () {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    return page.options;
  },
  // 根据key排序
  sortByKey (arr, key) {
    arr.sort((x, y) => y[key] - x[key]);
  },

  // 获取符合使用规则的代金券
  getAvailableCoupon (cps, price) {
    price = parseInt(price);
    let temp = [];
    // 过滤达不到估价金额优惠券
    for (let i = 0; i < cps.length; i++) {
      cps[i]['useLimited'] = parseInt(cps[i]['useLimited']);
      cps[i['faceValue']] = parseInt(cps[i['faceValue']]);
      if (cps[i]['status'] == 10) {
        let couponPrice = cps[i]['useLimited'] / 1000;
        if (price >= couponPrice) {
          temp.push(cps[i]);
        }
      }
    }
    // 价格排序
    this.sortByKey(temp, 'faceValue');
    return temp[0];
  }
}