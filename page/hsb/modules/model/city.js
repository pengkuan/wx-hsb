












var url  = require('../url.js');

var exports = module.exports = {

    cityList (obj, callback) {

        wx.request({

            url     : url.city,
            data    : obj,

            success : function (res) {

                callback && callback(res);
            }

        });
    },

    areaList (obj, callback) {

        wx.request({

            url     : url.area,
            data    : obj,

            success : function (res) {

                callback && callback(res);
            }

        });
    },

    visitDate (callback) {

        wx.request({

            url     : url.visitDate,

            success : function (res) {

                callback && callback(res);
            }

        });
    },

    visitTime (cityid, callback) {

        wx.request({

            url    : url.visitTime,

            data   : {
                cityid : cityid
            },

            success (res) {

                callback && callback(res);
            }
        });
    }

};
