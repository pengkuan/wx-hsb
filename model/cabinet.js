import { url } from '../config/index';
import Utils from '../util/utils';

export default {
  getBoxInfo(longitude,latitude,distanceRange) {
    return new Promise((resolve, reject) => {
      const data = Utils.createBoxParams('fengChao.getBoxInfo', {
        longitude,
        latitude,
        distanceRange
      });
      wx.request({
        url: url.getBoxInfo,
        header: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        data: JSON.stringify(data),
        success: function (res) {
          console.log(res);
          if (res.data) {
            resolve(res.data._data.boxList)
          } else {
            reject(res)
          }
        },
        fail: function (res) {
          console.log(res);
        }
      });
    })
  }
}