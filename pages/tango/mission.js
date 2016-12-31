// pages/tango/mission.js

//获取应用实例
var app = getApp()

//获取LeanCloud对象
const AV = require('../../libs/av-weapp.js');

var longTapId = ''; //长按记住了的单词ID
var tangoList = {}; //本次任务选择的单词列表
var size = 20; //本次任务选择的单词数
var max = 0; //数据库中符合条件的单词数

var currentTango; //当前单词
var lastTango; //上个单词
var lastFlag; //上个正误

var REMEMBER_SCORE = 7; //记住分数
var TIRED_COEFFICIENT = 35; //
var REMEMBER_MIN_SCORE = 4; //记住最低分数
var FORGET_SCORE = -3; //忘记分数
var REMEMBER_FOREVER_SCORE = 64; //彻底记住分数
var REVIEW_FREQUENCY = 5; //复习系数
var TODAY_CONSECUTIVE_REVIEW_MAX = 10; //最大连续复习

var INTERVAL_TIME_MIN = 500; //防误触最小间隔
var NEW_TANGO_DELAY = 1000; //答案显示前进行操作的延迟时间

var pronunciationDelay = 2500; //读音延迟时间
var writingDelay = 3000; //写法延迟时间
var meaningDelay = 3500; //意思延迟时间

var DEFAULT_GOAL = 30;

var TONE_ARRAY = ['◎', '①', '②', '③', '④', '⑤', '⑥', '⑦']; //音调格式

Page({
  //初始数据
  data: {
    review: 0, //本次复习
    study: 0, //本次学习

    last_id: '', //上个ID
    last_flag: '', //上个正误
    last_writing: '', //上个写法
    last_pronunciation: '', //上个读音
    last_part: '', //上个词性
    laset_meaning: '', //上个意思

    id: '', //ID
    pronunciation: '', //读音
    tone: '', //音调
    writing: '加载中', //写法
    part: '', //词性
    meaning: '', //意思
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this;
    //获取用户数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  onReady: function () {
    // 页面渲染完成
    let that = this;
    //查询本次任务学习的单词
    var cou = new AV.Query('TangoList');
    cou.count().then(function (count) {
      //符合要求的单词数
      max = count;
      var query = new AV.Query('TangoList');
      //跳过的单词数
      var start = parseInt(Math.random() * (max - size));
      query.skip(start);
      query.limit(size);
      query.find().then(function (result) {
        //将查询到的单词加入列表
        tangoList = result;
        //查询到的单词数量
        size = tangoList.length;
        //选取要显示的单词
        var tango = result[parseInt(Math.random() * size)];
        //显示单词
        that.showNewTango(tango);
      }, function (error) {
        console.error(error);
      });
    }, function (error) {
      console.error(error);
    });
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
  //点击记住了
  rememberTap: function () {
    //触发长按事件后不触发点击事件
    if (lastTango != undefined && longTapId == lastTango.id) {
      longTapId = '';
      return;
    }
    wx.showToast({
      title: '记住了',
      icon: 'success',
    });
    //TODO
    //选取新单词
    var tango = tangoList[parseInt(Math.random() * size)];
    //显示新单词
    this.showNewTango(tango, true);
  },
  //点击没记住
  forgetTap: function () {
    var that = this;
    wx.showModal({
      title: '测试',
      content: '没记住',
      success: function (res) {
        if (res.confirm) {
          console.info("确定");
        }
        //选取新单词
        var tango = tangoList[parseInt(Math.random() * size)];
        //显示新单词
        that.showNewTango(tango, false);
      }
    });
    //TODO
  },
  //长按记住了，彻底记住
  foreverTap: function () {
    longTapId = this.data.id;
    wx.showToast({
      title: longTapId,
      icon: 'success',
    });
    //TODO
    //选取新单词
    var tango = tangoList[parseInt(Math.random() * size)];
    //显示新单词
    this.showNewTango(tango, true);
  },
  lastTap: function () {
    this.showNewTango(lastTango);
  },
  //显示新的单词
  showNewTango: function (tango, flag) {
    if (flag != undefined) {
      //将当前单词记为上个单词
      lastTango = currentTango;
      //设置正误格式
      lastFlag = flag;
      var flagStr = lastFlag ? '√' : '×';
      //设置音调格式
      var tone = lastTango.get('Tone');
      var toneStr = '';
      if (tone >= 0 && tone < TONE_ARRAY.length) {
        toneStr = TONE_ARRAY[tone];
      }
      //设置词性格式
      var part = lastTango.get('PartOfSpeech');
      if (part.trim().length > 0) {
        part = '[' + part + ']';
      }
      //将上个单词信息显示到界面
      this.setData({
        last_id: lastTango.id, //上个ID
        last_flag: flagStr, //上个正误
        last_pronunciation: lastTango.get('Pronunciation'), //上个读音
        last_tone: toneStr, //上个音调
        last_writing: lastTango.get('Writing'), //上个写法
        last_part: part, //上个词性
        last_meaning: lastTango.get('Meaning'), //上个意思
      })
    } else {
      //没有上个单词则不显示
      lastTango = null;
      this.setData({
        last_id: '', //上个ID
        last_flag: '', //上个正误
        last_pronunciation: '', //上个读音
        last_tone: '', //上个音调
        last_writing: '', //上个写法
        last_part: '', //上个词性
        last_meaning: '', //上个意思
      })
    }
    //将新单词设为当前单词
    currentTango = tango;
    //设置音调格式
    var tone = currentTango.get('Tone');
    var toneStr = '';
    if (tone >= 0 && tone < TONE_ARRAY.length) {
      toneStr = TONE_ARRAY[tone];
    }
    //设置词性格式
    var part = currentTango.get('PartOfSpeech');
    if (part.trim().length > 0) {
      part = '[' + part + ']';
    }
    //设置新单词
    this.setData({
      id: currentTango.id, //ID
      pronunciation: currentTango.get('Pronunciation'), //读音
      tone: toneStr, //音调
      writing: currentTango.get('Writing'), //写法
      part: part, //词性
      meaning: currentTango.get('Meaning'), //意思
    });
    var r = parseInt(Math.random() * 3);
    switch (r) {
      case 0:
        this.delayPronunciation(currentTango.get('Pronunciation'), toneStr);
        this.delayWriting(currentTango.get('Writing'));
        break;
      case 1:
        this.delayPronunciation(currentTango.get('Pronunciation'), toneStr);
        this.delayMeaning(part, currentTango.get('Meaning'));
        break;
      case 2:
        this.delayWriting(currentTango.get('Writing'));
        this.delayMeaning(part, currentTango.get('Meaning'));
        break;
    }
  },
  //延迟读音
  delayPronunciation: function (pronunciation, tone) {
    let that = this;
    that.setData({
      pronunciation: '', //读音
      tone: '', //音调
    });
    setTimeout(function () {
      that.setData({
        pronunciation: pronunciation, //读音
        tone: tone, //音调
      });
    }, writingDelay);
  },
  //延迟写法
  delayWriting: function (writing) {
    let that = this;
    that.setData({
      writing: '', //写法
    });
    setTimeout(function () {
      that.setData({
        writing: writing, //写法
      });
    }, pronunciationDelay);
  },
  //延迟意思
  delayMeaning: function (part, meaning) {
    let that = this;
    that.setData({
      part: '', //词性
      meaning: '', //意思
    });
    setTimeout(function () {
      that.setData({
        part: part, //词性
        meaning: meaning, //意思
      });
    }, meaningDelay);
  },
})