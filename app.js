//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          console.info(res.code);
          wx.getUserInfo({
            success: function (user) {
              that.globalData.userInfo = user.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openId: null,
  }
})

//初始化LeanCloud对象
const AV = require('./libs/av-weapp.js');
AV.init({
  appId: 'JU6HFVAzc5KrBnJBTMc7QbTe-gzGzoHsz',
  appKey: 'ptscFhYmavGYVvIGCikAczN2',
});