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
  }
}