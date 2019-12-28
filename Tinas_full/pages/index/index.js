//index.js
//获取应用实例
const app = getApp()
import {
  $wuxGallery
} from '../../miniprogram_npm/wux-weapp/index'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    index_settings: {
      NetWorkTestFinished: false,
      AlbumsTaskFinished: false,
      AlbumsAddUnFinished: false,
      AlbumsNoMored: false
    },
    albums: [],
    albums_photo_uri: [],
    albums_photo_uri_length: 0
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //that.data.albums=[];
    //that.data.albums_photo_uri=[];
    //that.data.albums_photo_uri_length=0;
    if (!that.data.index_settings.NetWorkTestFinished) {
      console.log("openId:" + (wx.getStorageSync('openId') ? wx.getStorageSync('openId') : "NULL"));
      app.sendSocketMessage({
        action: 'network-test',
        data: {
          body: 'test-content'
        }
      });
      that.data.index_settings.NetWorkTestFinished = true;
    }
    if (that.data.albums.length == 0) {
      app.sendSocketMessage({
        action: 'get-albums'
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
      } else if (result.action == 'network-test') {
        if (result.data.body == 'test-content') {
          console.log('WebSocket 连接测试成功!');
        } else {
          wx.showToast({
            title: '联系不上Server!',
            icon: 'none'
          });
          console.log('WebSocket 连接测试失败!');
        }
      } else if (result.action == 'get-albums') {
        //any others
        if (result.status) {
          that.data.albums.push(result.data);
          that.data.albums_photo_uri[that.data.albums_photo_uri_length] = [];
          for (var i = 0; i < result.data.photos.length; i++) {
            that.data.albums_photo_uri[that.data.albums_photo_uri_length].push("https://tinas.fengjijiao.cn/getImages?pid=" + result.data.photos[i]);
            //app.sendSocketMessage({ action: 'get-photo', pid: result.data.photos[i] });
          }
          that.data.albums_photo_uri_length++;
        } else {
          that.data.index_settings.AlbumsAddUnFinished = false;
          that.data.index_settings.AlbumsNoMored = true;
        }
        that.data.index_settings.AlbumsTaskFinished = true;
        that.setData(that.data);
      } else if (result.action == 'get-photo') {
        console.log(result.data);
      }
    }
  },
  previewImage: function(e) {
    const {
      current,
      album_id
    } = e.currentTarget.dataset //将需要获取的组件属性写入字典内
    let urls = this.data.albums_photo_uri[album_id]
    console.log("album_id:" + album_id);

    wx.previewImage({
      current,
      urls
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.albums.length > 0){
      this.data.index_settings.AlbumsAddUnFinished = true;
      this.data.index_settings.AlbumsNoMored = false;
      this.setData(this.data);
      app.sendSocketMessage({
        action: 'get-albums',
        prev: this.data.albums.length,
        last: this.data.albums.length + 6
      });
    }
  },
})