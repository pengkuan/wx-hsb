import {PID} from '../config/index';
export default {
  post (config) {
    config['method'] = 'POST';
    if (config.header) {
      config.header['Content-Type'] = "application/x-www-form-urlencoded";
    } else {
      config.header = {"Content-Type": "application/x-www-form-urlencoded"};
    }
    config.url += `?pid=${ PID }`;
    console.log(config.url);
    return wx.request(config);
  },
  get (config) {
    config.url += `?pid=${ PID }`;
    return wx.request(config);
  },
  filedFormat(obj) {
    let str = "";
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key]) {
        str += `${key}=${obj[key]}&`;
      }
    }
    return str.length ? str.substr(0, str.length - 1) : str;
  },
  throttle (fn, delay) {
    var timer = null;
    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function(){
        fn.apply(context, args);
      }, delay);
    }
  },
  inArray (arr, item, key) {
    if(!(arr instanceof Array)) return;
    let result = false;
    for (let i = 0; i < arr.length; i++) {
      if(key) {
        if(arr[i][key] == item[key]){
          result = true;
          break;
        }
      } else {
        if(arr[i] == item){
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
  }
}