Page({
  data: {
    reportId: ""
  },
  onLoad(options) {
    this.setData({
      reportId: options.reportId
    })
  }
});