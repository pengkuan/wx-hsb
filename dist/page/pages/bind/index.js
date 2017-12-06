'use strict';

var _user = require('../../../model/user');

var _user2 = _interopRequireDefault(_user);

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0,
    timeId = void 0,
    app = getApp();

Page({

  data: {
    type: 'bind',
    tel: '',
    code: "",
    openid: "",
    unionid: "",
    isValidTel: false,
    counter: 0 // 默认只需等待0秒
  },

  onShow: function onShow() {
    var params = _utils2.default.getCurPageOpt();
    ctx = this;
    var tel = _user2.default.getUserInfo().tel;
    var title = params.type === 'bind' ? '绑定手机' : '解绑手机';
    wx.setNavigationBarTitle({
      title: title
    });
    _utils2.default.setWhiteNavBar();
    // 有可能没有token 比如直接编译当前页面
    var wxToken = _user2.default.getWxToken();
    ctx.setData({
      type: params.type,
      tel: tel ? tel : '',
      openid: wxToken.openid,
      unionid: wxToken.unionid,
      isValidTel: tel && tel.length === 11
    });
    if (Object.keys(wxToken).length === 0) {
      _user2.default.getWxCode().then(function (code) {
        _user2.default.getWxOpenId(code).then(function (wxToken) {
          _user2.default.setWxToken(wxToken);
          ctx.setData({
            openid: wxToken.openid,
            unionid: wxToken.unionid
          });
        });
      });
    }
  },


  /**
   * 获取短信验证码
   * tel 已经校验过了
   */
  getCode: function getCode() {
    var tel = ctx.data.tel;
    ctx.setData({
      counter: 30
    });
    ctx.counting();
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
  counting: function counting() {
    var counter = ctx.data.counter;
    if (counter === 0) return;
    timeId = setTimeout(function () {
      ctx.setData({
        counter: counter - 1
      });
      ctx.counting();
    }, 1000);
  },
  handleTel: function handleTel(e) {
    var tel = e.detail.value;
    this.setData({
      tel: tel,
      isValidTel: tel && tel.length === 11
    });
  },
  handleCode: function handleCode(e) {
    var value = e.detail.value;
    this.setData({
      code: value
    });
  },
  clearTel: function clearTel() {
    ctx.setData({
      tel: '',
      isValidTel: false,
      code: ''
    });
  },


  /**
   * 解绑手机号
   * 需用用户登录
   */
  unbindTel: function unbindTel() {
    var data = ctx.data;
    var userInfo = _user2.default.getUserInfo();
    console.log(userInfo);
    _user2.default.authUserUnbindTel({
      uid: userInfo.us_uid,
      userkey: userInfo.userkey,
      openid: data.openid
    }).then(function (res) {
      // 解绑成功清除回收宝账户信息
      _user2.default.setUserInfo({});
      wx.reLaunch({
        url: '../person/index',
        success: function success(err) {
          console.log(err);
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    });
  },


  // 绑定手机号
  submit: function submit() {
    var data = ctx.data;
    if (data.type == 'bind') ctx.bindTelLogin();
    if (data.type == 'unbind') ctx.unbindTel();
  },


  // 绑定手机号
  bindTelLogin: function bindTelLogin() {
    var data = ctx.data;
    _user2.default.bindTelLogin({
      tel: data.tel,
      code: data.code,
      openid: data.openid,
      unionid: data.unionid
    }).then(function (data) {
      _user2.default.setUserInfo(data);
      wx.navigateBack({
        delta: 1
      });
    }, function (err) {
      wx.showToast({
        title: err
      });
    });
  }
});
//# sourceMappingURL=index.js.map