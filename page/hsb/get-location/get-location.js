var formatLocation = require('./format-location.js')

var LL2MC  = [[
    -0.0003218135878613132  , 111320.7020701615 , 0.00369383431289  ,
    823725.6402795718       , 0.46104986909093  , 2351.343141331292 ,
    1.58060784298199        , 8.77738589078284  , 0.37238884252424  , 7.45
], [
    -0.0003441963504368392  , 111320.7020576856 , 278.2353980772752 ,
    2485758.690035394       , 6070.750963243378 , 54821.18345352118 ,
    9540.606633304236       , -2710.55326746645 , 1405.483844121726 , 22.5
], [
    0.00220636496208        , 111320.7020209128 , 51751.86112841131 ,
    3796837.749470245       , 992013.7397791013 , -1221952.21711287 ,
    1340652.697009075       , -620943.6990984312, 144416.9293806241 , 37.5
], [
    0.00337398766765        , 111320.7020202162 , 4481351.045890365 ,
    -23393751.19931662      , 79682215.47186455 , -115964993.2797253,
    97236711.15602145       , -43661946.33752821, 8477230.501135234 , 52.5
], [
    0.0008277824516172526   , 111320.7020463578 , 647795574.6671607 ,
    -4082003173.641316      , 10774905663.51142 , -15171875531.51559,
    12053065338.62167       , -5124939663.577472, 913311935.9512032 , 67.5
], [
    -0.0015702102444        , 111320.7020616939 , 1704480524535203  ,
    -10338987376042340      , 26112667856603880 , -35149669176653700,
    26595700718403920       , -10725012454188240, 1800819912950474  , 82.5
]];
function wgs84Tobd09(wgs84) {

    var lat   = Math.abs(wgs84.latitude);
    var lng   = Math.abs(wgs84.longitude);
    var ll2mc = LL2MC[Math.floor(lat / 15)];

    var z     = lat / ll2mc[9];

    lng = ll2mc[0] + ll2mc[1] * lng;
    lat = ll2mc[2]
            + ll2mc[3] * z
            + ll2mc[4] * Math.pow(z, 2)
            + ll2mc[5] * Math.pow(z, 3)
            + ll2mc[6] * Math.pow(z, 4)
            + ll2mc[7] * Math.pow(z, 5)
            + ll2mc[8] * Math.pow(z, 6);

    return {
        lng : +lng.toFixed(2),
        lat : +lat.toFixed(2)
    };
}
Page({
  data: {
    hasLocation: false,
    searchValue : '',
  },
  onLoad: function () {
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res, formatLocation(res.longitude, res.latitude));

        that.setData({
          hasLocation: true,
          location: res
        });
        wx.request({
            url: 'https://doop.www.huishoubao.com/v2/api/baidu'
              + '?lng=' + res.longitude
              + '&lat=' + res.latitude
              + '&dis=' + 60
              + '&num=' + 1,

            success: function(res) {
                console.log(res);
                res.data.items.forEach(function(item){
                    item.name = item.name.replace(/[(（]/, ' ').replace(/[)）]/, '');
                });
                that.setData({
                    lbsState : true,
                    lbs      : res.data
                });
            }
        });
      }
    })
  },
  search: function (value){

    var that = this;
    that.setData({
        searchValue : value
    });
    value && wx.request({
        url: 'https://doop.www.huishoubao.com/v2/api/baidu2/' + that.data.lbs.detail.city_code + '/0/' + value,
        success: function(res) {
            console.log(res);
            that.setData({
                search : res.data.s.map(function(item){
                    item = item.split('$');
                    return {
                      city : item[0],
                      district : item[1],
                      xxxx     : item[2],
                      name     : item[3],
                      cityCode : item[4],
                      yyyy     : item[5]
                    }
                })
            });
        }
    });
  },
  bindKeyInput: function(e) {
      this.search(e.detail.value);
  },
  bindTap:function(e){
      this.search(e.currentTarget.dataset.name);
  },
  bindTap2:function(e){
      console.log(e.currentTarget.dataset);
  },
  closeSearch : function(){
    this.setData({
        search : [],
        searchValue : ''
    })
  }
})
