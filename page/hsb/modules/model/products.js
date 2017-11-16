var url = require('../url');
import { PID } from '../constant';
const commonUtil = require('./common')

var exports = module.exports = {

  brands: [],

    // 获取 
    getBrands(callback) {
        var brands = this.brands;
        brands.length ? callback(brands) : wx.request({
            url: url.brands,
            success: function (res) {
                brands = res.data.data.items;
                if (brands) {
                    brands.splice(15, 1);
                    exports.brands = brands;
                }
                callback(brands);
            },
            fail: function (err) {
                console.log(err);
            }
        });
    },
    
    getPads(bid,index,count,callback) {
        return wx.request({
            url: url.padList + '?mid='+bid+'&size='+index,
            success: function (res) {
                var data = res.data.data;
                var total = data.pageinfo.total;
                callback && callback(data && data.items, count,total);
            },
            fail: function (err) {
                console.log(err);
            }
        });
    },

    getList(bid, index, count, callback) {

        return wx.request({

            url: url.productsList + bid + '/' + index,
            success: function (res) {
                var data = res.data.data;
                // var items = res.data.data.items;
                callback && callback(data && data.items, count);
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },
    search(key, index, count, callback) {
        return wx.request({

            url: url.search + key + '/' + index,
            success: function (res) {
                var data = res.data.data;
                // var items = res.data.data.items;
                callback && callback(data && data.items, count);
            },
            fail: function (err) {
                console.log(err);
            }
        })
    },
    getSelectOption(itemid, callback) { 
 
        wx.request({ 
            url : url.getSelectOption, 
            data : "itemid=" + itemid + "&pid=" + PID, 
            method : 'POST', 
            success: function(response) { 
                if(commonUtil.isResponseSuccess(response.data, true)) { 
                    callback(response.data.data); 
                } 
            } 
        }); 
    },
    options(itemid, callback) {

        wx.request({

            url: url.options + itemid,
            success: function (res) {
                //excuseme ? why the data is a object ,not an array?
                var data = res.data.data;
                var items = data.items;

                var listA = [];
                var listB = [];

                Object.keys(items).forEach(function (key) {

                    var its = items[key];
                    its.list = [];
                    Object.keys(its.items).forEach(function (key) {
                        its.list.push(its.items[key]);
                    });
                    delete its.items;
                    listA.push(its);
                    listB.push(its);
                });

                delete data.items;

                data.options = listA;
                data.options2 = listB;

                for (var i in data.options) {

                    if (data.options[i].name == "机身外观") {

                        for (var j in data.options[i].list) {

                            if (data.options[i].list[j].name == "全新手机") {
                                data.options[i].list.splice(0, 1);
                            }
                        }
                    }
                }

                callback && callback(data);
            }
        });
    },
    evaluate(itemid, selects, callback) {
        wx.request({

            url: url.evaluate + itemid + '/' + selects,

            success(res) {

                var data = res.data.data;
                data.quotation = Math.round(data.quotation / 100);
                callback && callback(data);
            }
        });
    },

    hotList(callback) {

        wx.request({

            url: url.hotList,
            success(res) {
                var data = res.data.data;
                data.quotation = Math.round(data.quotation / 100);
                callback && callback(data);
            }
        });
    }
};