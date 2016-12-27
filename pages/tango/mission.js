// pages/tango/mission.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
    this.setData({
      review: 0,
      study: 0,

      last_flag: "√",
      last_writing: "社員",
      last_pronunciation: "しゃいん",
      last_part: "名词",
      laset_meaning: "职员",

      pronunciation: "せんせい",
      tone: "③",
      writing: "先生",
      part: "名词",
      meaning: "老师",
    })
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  //事件处理函数
  rememberTap: function () {
    wx.showToast({
      title: '记住了',
      icon: 'success',
    });
    //TODO
  },
  forgetTap: function () {
    wx.showModal({
      title: '测试',
      content: '没记住'
    });
    //TODO
  }
})