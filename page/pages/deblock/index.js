// page/pages/deblock/index.js
let ctx, app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phones:[
      {
        name: '苹果账号', phone: 'apple', imgUrls: [
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-1.png', txt:'选择【设置】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-2.png', txt:'点击最上方的【账号】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-3.png', txt:'点击【退出登录】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-4.png', txt:'输入Apple ID密码，点击【关闭】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-5.png', txt:'在设置里点击【触控ID与密码】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-6.png', txt:'输入【开机密码】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-7.png', txt:'点击【关闭密码】'},
          { url: 'https://s1.huishoubao.com/static/m/common/iphone-8.png', txt:'点击【关闭】'}
        ]},
      {
        name: '三星账号', phone: 'sanxing', imgUrls: [
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-1.png', txt: '选择【设置】' },
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-2.png', txt: '点击【云和账号】' },
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-3.png', txt: '点击【账号】' },
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-5.png', txt: '点击【三星账号】' },
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-6.png', txt: '选择右上角更多' },
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-7.png', txt: '点击【删除账户】' },
          { url: 'https://s1.huishoubao.com/static/m/common/sanxing-8.png', txt: '点击【确定】完成' }
        ]},
      {
        name: '小米账号', phone: 'xiaomi', imgUrls: [
          { url: 'https://s1.huishoubao.com/static/m/common/xiaomi-1.png', txt: '选择【设置】' },
          { url: 'https://s1.huishoubao.com/static/m/common/xiaomi-2.png', txt: '点击【小米账号】' },
          { url: 'https://s1.huishoubao.com/static/m/common/xiaomi-3.png', txt: '点击【退出登录】' },
          { url: 'https://s1.huishoubao.com/static/m/common/xiaomi-4.png', txt: '点击【从手机上删除】' }
        ]},
      {
        name: '魅族账号', phone: 'meizu', imgUrls: [
          { url: 'https://s1.huishoubao.com/static/m/common/meizu-1.png', txt: '选择【设置】' },
          { url: 'https://s1.huishoubao.com/static/m/common/meizu-2.png', txt: '找到个人，点击【Flyme账号】' },
          { url: 'https://s1.huishoubao.com/static/m/common/meizu-3.png', txt: '点击【用户头像】' },
          { url: 'https://s1.huishoubao.com/static/m/common/meizu-4.png', txt: '点击【账号管理】' },
          { url: 'https://s1.huishoubao.com/static/m/common/meizu-5.png', txt: '点击【退出账号】' }
        ]}
    ],
    phone: 'apple',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 500,
    swiperCurrent: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    ctx = this;
  },
  switchPhone(e) {
    let dataset = e.currentTarget.dataset;
    ctx.setData({
      phone: dataset.phone,
      swiperCurrent: 0
    })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})