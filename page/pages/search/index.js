import product from '../../../model/product';
import Utils from '../../../util/utils';
let ctx;
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

  onShow () {
    ctx = this;
    wx.setNavigationBarTitle({
      title: '搜索'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
    let history = wx.getStorageSync('search');
    let hotList = wx.getStorageSync('hotList');
    ctx.setData({
      history: history.length ? history : [],
      hotList: hotList.length ? hotList : []
    });
  },

  loadMore () {
    if (!ctx.data.hasMore) {
      ctx.setData({
        isShowNoMoreText: true
      });
      setTimeout(() => {
        ctx.setData({
          isShowNoMoreText: false
        });
      }, 2000);
      return;
    }
    if (!ctx.data.key.length) return;
    let index = ++ctx.data.index;
    let searchList = ctx.data.searchList;
    ctx.setData({
      isShowLoadText: true
    });
    product.search({
      key: ctx.data.key,
      pageIndex: index
    }).then(res => {
      let total = res.pdtcount;
      searchList = searchList.concat(res.productlist);
      let hasMore = total > searchList.length;
      ctx.setData({
        hasMore,
        searchList,
        isShowLoadText: false
      })
    }, err => {
      console.log(err);
    })
  },

  throttle: Utils.throttle(() => {
    ctx.setData({
      searchList: [],
      index: 0,
      hasMore: true,
      isShowNoMoreText: false,
      isShowLoadText: undefined
    });
    ctx.loadMore();
  }, 300),

  handleKey (e) {
    ctx.setData({
      key: e.detail.value
    });
    ctx.onKeyChanged();
  },

  onKeyChanged () {
    ctx.throttle()
  },

  switchPage (e) {
    let dataset = e.currentTarget.dataset;
    let history = ctx.data.history;
    if (dataset.log) {
      let item = {
        id: dataset.id,
        name: dataset.name,
      };
      let inArray = Utils.inArray(history, item, 'id');
      if (!inArray) {
        history.unshift(item);
        history = history.splice(0, 10);
        wx.setStorage({
          key: 'search',
          data: history
        });
        ctx.setData({
          history
        })
      }
    }
    wx.navigateTo({
      url: dataset.url
    })
  },

  clearHistory () {
    ctx.setData({
      history: []
    });
    wx.setStorage({
      key: 'search',
      data: []
    })
  }
});