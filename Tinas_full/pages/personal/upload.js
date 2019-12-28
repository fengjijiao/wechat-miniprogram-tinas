// pages/personal/upload.js
import {
  $wuxToptips,
  $wuxToast
} from '../../miniprogram_npm/wux-weapp/index'
import {
  isInArray,
  repeatNumberInArray
} from "../../utils/util.js"
import {
  hexMD5
} from "../../utils/md5.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadedList: [],
    uploadedPidList: [],
    formAuthData: {
      openId: wx.getStorageSync('openId'),
      token: null
    },
    popupSelect: 'Class C',
    options2: ['Class A', 'Class B', 'Class C', 'Class D', 'Class E', 'Class F'],
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
    this.data.globalData = app.globalData;
    //页面显示时,需重载token
    this.data.formAuthData.token = hexMD5(wx.getStorageSync('token') + "@fengjijiao@" + Math.floor(Date.now() / 63000));
    this.setData(this.data);
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
      } else if (result.action == 'post-album') {
        if (result.status) {
          wx.hideLoading();
          $wuxToast().show({
            type: 'success',
            duration: 1500,
            color: '#fff',
            text: '发布成功,将在审核后显示!',
            success: () => {
              console.log('发布相册成功')
              //返回主页
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          console.log('发布相册出错,原因:'+result.msg+'!');
        }
      }
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
  onChange(e) {
    console.log('onChange', e)
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      this.setData({
        progress: 0,
      })
      wx.showLoading()
    } else if (file.status === 'done') {
      /*this.setData({
        imageUrl: file.url,
      })*/
      this.data.uploadedList.push({
        uid: this.data.uploadedList.length,
        status: file.status,
        url: file.url
      });
    }
    //每次change都更新token,确保验证成功
    this.data.formAuthData.token = hexMD5(wx.getStorageSync('token') + "@fengjijiao@" + Math.floor(Date.now() / 63000));
    this.setData(this.data);
  },
  onSuccess(e) {
    console.log('onSuccess', e)
  },
  onFail(e) {
    console.log('onFail', e)
  },
  onComplete(e) {
    console.log('onComplete', e)
    const {
      data
    } = e.detail
    var result;
    try {
      result = JSON.parse(data);
      console.log('JSON解码数据:', result);
    } catch (e) {
      console.error('JSON解码数据失败!');
    }
    if (result.status) {
      if (isInArray(this.data.uploadedPidList, result.pid)) {
        console.log('已存在于数组uploadedPidList中');
      } else {
        this.data.uploadedPidList.push(result.pid);
        this.setData(this.data);
      }
    } else {
      console.log(result.msg);
    }
    wx.hideLoading()
  },
  onProgress(e) {
    console.log('onProgress', e)
    this.setData({
      progress: e.detail.file.progress,
    })
  },
  onPreview(e) {
    console.log('onPreview', e)
    const {
      file,
      uploadedList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: uploadedList.map((n) => n.url),
    })
  },
  onRemove(e) {
    console.log('onRemove', e)
    const {
      file,
      uploadedList
    } = e.detail
    var result;
    try {
      result = JSON.parse(file.res.data);
      console.log('JSON解码数据:', result);
    } catch (e) {
      console.error('JSON解码数据失败!');
    }
    if (result.status) {
      //删除相册pid数组(uploadedPidList)中指定的照片
      if (repeatNumberInArray(this.data.uploadedPidList, result.pid) == 1) {
        var sign = 0;
        for (var i = 0; i < this.data.uploadedPidList.length; i++) {
          if (this.data.uploadedPidList[i] == result.pid) {
            //delete this.data.uploadedPidList[i];
            sign++;
          }
          if (sign) {
            this.data.uploadedPidList[i] = this.data.uploadedPidList[i + 1];
          }
        }
        if (sign) {
          this.data.uploadedPidList.pop();
        }
        this.setData(this.data);
      }
    } else {
      console.log("移除图片失败!");
    }
  },
  publish: function(e) {
    console.log("formId: "+e.detail.formId);
    if (this.data.uploadedPidList.length > 0) {
      wx.showLoading({
        title: '发布中...',
      });
      app.sendSocketMessage({
        action: 'post-album',
        pids: this.data.uploadedPidList,
        openId: wx.getStorageSync('openId'),
        token: hexMD5(wx.getStorageSync('token') + "@fengjijiao@" + Math.floor(Date.now() / 63000)),
        formId: e.detail.formId
      });
    } else {
      //图片数量少于0
      $wuxToptips().show({
        icon: 'cancel',
        hidden: false,
        text: '你还没有上传照片呢!',
        duration: 3000,
        success() {},
      });
    }
  },
  onPopupSelectChange: function(e) {
    this.setData({ popupSelect: e.detail.value })
  },
})