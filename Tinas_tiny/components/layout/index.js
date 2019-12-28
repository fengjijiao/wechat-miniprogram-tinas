// components/layout/index.js
import {
  hexMD5
} from "../../utils/md5.js"
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    formSubmit: function (e) {
      let formId = e.detail.formId
      app.sendSocketMessage({
        action: 'post-form-id',
        pids: this.data.uploadedPidList,
        openId: wx.getStorageSync('openId'),
        token: hexMD5(wx.getStorageSync('token') + "@fengjijiao@" + Math.floor(Date.now() / 63000)),
        formId: formId
      });
      //console.log(formId)
    }
  }
})
