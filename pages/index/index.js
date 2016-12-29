//index.js
//获取应用实例
var app = getApp()

//获取LeanCloud对象
const AV = require('../../libs/av-weapp.js');

Page({
  data: {
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //事件处理函数
  startMissionTap: function() {
    wx.navigateTo({
      url: '../tango/mission'
    })
  },

  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
