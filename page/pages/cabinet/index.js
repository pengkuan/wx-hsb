import cabinet from '../../../model/cabinet';
import amapFile from '../../../util/amap-wx';
import {gdKey} from '../../../config/index';
import Utils from '../../../util/utils';
let ctx;
Page({
  data: {
    key: '',
    searchList: [],
    history: []
  },

  onLoad(options) {
    ctx = this;
  },

  onShow() {
    ctx = this;
    let history = wx.getStorageSync('searchPlace');
    ctx.setData({
      history: history.length ? history : []
    });
    if (ctx.data.key) ctx.loadMore();
  },
  loadMore() {
    if (!ctx.data.key.length) return;
    let searchList = ctx.data.searchList;

    var keywords = ctx.data.key;
    var myAmapFun = new amapFile.AMapWX({ key: gdKey });
    myAmapFun.getInputtips({
      keywords,
      location: '',
      success: function (data) {
        console.log(data);
        // if (data && data.tips) {
        //   that.setData({
        //     tips: data.tips
        //   });
        // }
        searchList = searchList.concat(data.tips);
        ctx.setData({
          searchList
        })
      }
    })
  },

  throttle: Utils.throttle(() => {
    ctx.setData({
      searchList: []
    });
    ctx.loadMore();
  }, 300),

  handleKey(e) {
    ctx.setData({
      key: e.detail.value
    });
    ctx.onKeyChanged();
  },

  onKeyChanged() {
    ctx.throttle()
  },
  navigateBackFunc(location) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面
    console.log(prevPage);

    let longitude = location.split(',')[0];
    let latitude = location.split(',')[1];
    prevPage.setData({
      latitude,
      longitude
    })
  },
  switchPageOnly(e){
    let dataset = e.currentTarget.dataset;
    console.log(dataset);
    ctx.navigateBackFunc(dataset.location)
    wx.navigateBack();
    // wx.navigateTo({
    //   url: dataset.url
    // })
  },
  switchPage(e) {
    let dataset = e.currentTarget.dataset;
    let history = ctx.data.history;

    let item = {
      name: dataset.name,
      location: dataset.location,
    };
    history.unshift(item);
    history = history.splice(0, 6);
    wx.setStorage({
      key: 'searchPlace',
      data: history
    });
    ctx.setData({
      history
    })

    ctx.navigateBackFunc(dataset.location)
    wx.navigateBack();
    // wx.navigateTo({
    //   url: dataset.url
    // })
  },

  clearHistory() {
    ctx.setData({
      history: []
    });
    wx.setStorage({
      key: 'searchPlace',
      data: []
    })
  },

  clearKey() {
    ctx.setData({
      key: ''
    })
  }
});