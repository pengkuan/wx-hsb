import { url } from '../config/index';
import Utils from '../util/utils';
export default {
  sfCity () {
    return new Promise((resolve, reject) => {
      Utils.get({
        url: url.sfCity,
        success (res) {
          res = res.data;
          if (res.ret == 0) {
            resolve(res.data)
          } else {
            reject(res.retinfo)
          }
        }
      })
    })
  }
}
