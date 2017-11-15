var url  = require('../url.js');

var exports = module.exports = {

    sfInService (query, callback) {

        wx.request({

            url    : url.sfInService,

            data   : {
                addr : query
            },

            success (res) {

                callback && callback(res);
            }

        });
    },

    getReservationSFOrder (obj, callback) {

        wx.request({

            url    : url.sfOrder,
            data   : obj,

            success (res) {

                callback && callback(res);
            }
        });
    },

    getLocation (obj, callback) {

        wx.request({

            url    : url.location,
            data   : obj,

            success (res) {

                callback && callback(res);
            }
        });
    }


};
