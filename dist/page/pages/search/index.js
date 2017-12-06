'use strict';

var _product = require('../../../model/product');

var _product2 = _interopRequireDefault(_product);

var _utils = require('../../../util/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = void 0;
Page({
  data: {
    key: '',
    hotList: [],
    searchList: [],
    history: [],
    index: 0,
    hasMore: true,
    isShowNoMoreText: false,
    isShowLoadText: undefined,
    timeId: null
  },

  onShow: function onShow() {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    var history = wx.getStorageSync('search');
    var hotList = wx.getStorageSync('hotList');
    ctx.setData({
      history: history.length ? history : [],
      hotList: hotList.length ? hotList : []
    });
  },
  loadMore: function loadMore() {
    if (!ctx.data.hasMore) {
      ctx.setData({
        isShowNoMoreText: true
      });
      setTimeout(function () {
        ctx.setData({
          isShowNoMoreText: false
        });
      }, 2000);
      return;
    }
    if (!ctx.data.key.length) return;
    var index = ++ctx.data.index;
    var searchList = ctx.data.searchList;
    ctx.setData({
      isShowLoadText: true
    });
    _product2.default.search({
      key: ctx.data.key,
      pageIndex: index
    }).then(function (res) {
      var total = res.pdtcount;
      searchList = searchList.concat(res.productlist);
      var hasMore = total > searchList.length;
      ctx.setData({
        hasMore: hasMore,
        searchList: searchList,
        isShowLoadText: false
      });
    }, function (err) {
      console.log(err);
    });
  },


  throttle: _utils2.default.throttle(function () {
    ctx.setData({
      searchList: [],
      index: 0,
      hasMore: true,
      isShowNoMoreText: false,
      isShowLoadText: undefined
    });
    ctx.loadMore();
  }, 300),

  handleKey: function handleKey(e) {
    ctx.setData({
      key: e.detail.value
    });
    ctx.onKeyChanged();
  },
  onKeyChanged: function onKeyChanged() {
    ctx.throttle();
  },
  switchPage: function switchPage(e) {
    var dataset = e.currentTarget.dataset;
    var history = ctx.data.history;
    if (dataset.log) {
      var item = {
        id: dataset.id,
        name: dataset.name
      };
      var inArray = _utils2.default.inArray(history, item, 'id');
      if (!inArray) {
        history.unshift(item);
        history = history.splice(0, 10);
        wx.setStorage({
          key: 'search',
          data: history
        });
        ctx.setData({
          history: history
        });
      }
    }
    wx.navigateTo({
      url: dataset.url
    });
  },
  clearHistory: function clearHistory() {
    ctx.setData({
      history: []
    });
    wx.setStorage({
      key: 'search',
      data: []
    });
  }
});
//# sourceMappingURL=index.js.map