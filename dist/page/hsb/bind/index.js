"use strict";

var _user = require("../../../model/user");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;
Page({

  data: {
    tel: "",
    code: "",
    openid: "",
    unionid: ""
  },

  onLoad: function onLoad(params) {
    ctx = this;
    wx.setNavigationBarTitle({ title: '绑定手机号' });
    ctx.setData({
      openid: params.openid,
      unionid: params.unionid
    });
  },


  // 获取短信验证码
  getCode: function getCode() {
    var tel = ctx.data.tel;
    console.log(tel);
    _user2.default.getCode({ tel: tel }).then(function (data) {
      var showInfo = {
        title: '提示',
        icon: 'loading'
      };
      if (data.retcode == 0) {
        showInfo.title = "发送短信成功";
        showInfo.icon = 'success';
      } else {
        showInfo.title = data.retinfo;
      }
      wx.showToast(showInfo);
    });
  },
  telHandler: function telHandler(e) {
    var value = e.detail.value;
    this.setData({ tel: value });
  },
  codeHandler: function codeHandler(e) {
    var value = e.detail.value;
    this.setData({ code: value });
  },
  submit: function submit() {
    var data = ctx.data;
    console.log(data);
    _user2.default.bindTelLogin({
      tel: data.tel,
      code: data.code,
      openid: data.openid,
      unionid: data.unionid
    }).then(function (res) {
      if (res.retcode == 0) {
        wx.setStorage({
          key: userinfo,
          data: res.data,
          success: function success() {
            wx.navigateBack();
          }
        });
      }
    }, function (err) {
      wx.showToast({ title: err });
    });
  }
});
//# sourceMappingURL=index.js.map