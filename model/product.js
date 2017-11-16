import {url} from '../config/index';
import Utils from '../util/utils';

export default {
    // 类目
    category() {
        return new Promise((resolve, reject) => {
            Utils.get({
                url: url.categories,
                success: function (res) {
                    if (res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            });
        })
    },
    // 品牌
    brands({cid}) {
        return new Promise((resolve, reject) => {
            Utils.get({
                url: url.brands,
                data: {classId: cid},
                success(res) {
                    if (res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            });
        })
    },
    // 机型
    products({cid, bid, num}) {
        return new Promise((resolve, reject) => {
            Utils.get({
                url: url.products,
                data: {
                    classId: cid,
                    brandId: bid,
                    pageIndex: num
                },
                success(res) {
                    if (res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            });
        })
    },
    // 获取产品信息
    productInfo(param) {
        let productId = param.productId;
        return new Promise((resolve, reject) => {
            Utils.get({
                url: `https://www.huishoubao.com/api/get_product_param?itemid=${productId}&pid=1056`,
                success(res) {
                    if (res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            });
        })
    },
    // 估价https://www.huishoubao.com/v2/1196/api/products_evaluate/41567/12-17-36-40-63-68-73-77-83-10-21-23-27-30-53-55-59
    evaluate(params) {
        return new Promise((resolve, reject) => {
            Utils.get({
                url: `https://www.huishoubao.com/v2/1196/api/products_evaluate/${params.productId}/${params.selects}`,
                success(res) {
                    if (res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            });
        })
    },
    // 机型搜索
    search(params) {
        return new Promise((resolve, reject) => {
            Utils.get({
                url: url.search + params.key,
                data: {
                    pageIndex: params.pageIndex || 1
                },
                success(res) {
                    if (res.data) {
                        resolve(res.data.data);
                    } else {
                        reject(res.errmsg);
                    }
                }
            });
        })
    },
    priceHistory(params) {
        return new Promise((resolve, reject) => {
            Utils.get({
                url: `${url.priceHistory}${params.price}/${params.productId}/`,
                success: function (res) {
                    if (res.data) {
                        resolve(res.data.data)
                    } else {
                        reject(res)
                    }
                }
            });
        })
    }
}