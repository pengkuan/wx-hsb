Page({
  data: {
    reportUrl: ""
  },
  onLoad(options) {
    this.setData({
      reportUrl: 'https://mobile.huishoubao.com/mobile/qtreport_' + options.reportId +'.html'
    })
  }
});