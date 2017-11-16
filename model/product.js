import config from '../config/index.js';
const url = 'https://www.huishoubao.com/common/product/categories';
export default {
    // 类目
    category () {
        return new Promise((resolve, rejsct) => {
            wx.request({
                url: url,
                success: function (res) {
                    if(res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            })
        })
    },
    // 品牌
    brands () {

    },
    // 机型
    products () {

    }
}