// pages/personal/index.js
import {
  hexMD5
} from "../../utils/md5.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: null,
    hasUserInfo: false,
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ExtraUserInfo: {
      "photoNumber": 0,
      "albumNumber": 0,
      "Contribution": 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.data.globalData = app.globalData;
    that.setData(that.data);
    if (that.data.globalData.userInfo) {
      app.sendSocketMessage({
        action: 'get-extra-user-info',
        openId: wx.getStorageSync('openId'),
        token: hexMD5(wx.getStorageSync('token') + "@fengjijiao@" + Math.floor(Date.now() / 63000))
      });
    }
    app.globalData.webSocket.callback = function(res) {
      console.log('index WebSocket 返回:', res);
      var result;
      try {
        result = JSON.parse(res.data);
        console.log('JSON解码数据:', result);
      } catch (e) {
        console.error('JSON解码数据失败!');
      }
      if (!result.action) {
        console.log('WebSocket 返回不标准!');
      } else if (result.action == 'get-extra-user-info') {
        that.data.ExtraUserInfo = result.data;
        that.setData(that.data);
      }
    }
    //授权判断
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 能支持open-type=getUserInfo 版本的做法
      // 无论是否被授权均尝试获取用户数据
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
      // 授权判断
      // 跳转到授权页面
      /*wx.getStorage({
        key: 'userInfo',
        success(res) {
          console.info("Already authorized");
        },
        fail() {
          console.info("Not authorized");*/
          //去除打开后直接跳转至授权
          /*wx.redirectTo({
            url: '../authority/authority',
          })*/
        /*}
      });*/
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: err => {
          this.setData({
            userInfo: null,
            hasUserInfo: false
          });
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onContact: function(e) {
    console.log('onContact', e)
  },
  onGotUserInfo: function(e) {
    console.log('onGotUserInfo', e)
    //点击确认授权时
    if (e.detail.userInfo) {
      console.log("用户同意了授权请求!");
      app.globalData.userInfo = e.detail.userInfo;
      wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      app.updateUserInfo();
      //tabBar方法switchTab
      wx.switchTab({
        url: '../index/index',
      });
    } else {
      this.setData({
        userInfo: null,
        hasUserInfo: false
      });
      console.log("用户拒绝了授权请求!");
    }
  },
})