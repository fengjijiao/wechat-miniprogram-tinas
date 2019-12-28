// pages/landscape/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    currentTab: 0,
    listByClassification: [{
        "classificationName": "A class",
        "quantity": 3
      },
      {
        "classificationName": "B class",
        "quantity": 6
      },
      {
        "classificationName": "C class",
        "quantity": 9
      },
      {
        "classificationName": "D class",
        "quantity": 6
      }
    ],
    listByPersonal: [{
        "personalName": "PA",
        "personalClassifications": [{
          "classificationName": "D class",
          "quantity": 6
        },
          {
            "classificationName": "A class",
            "quantity": 8
          }]
      },
      {
        "personalName": "PB",
        "personalClassifications": [{
          "classificationName": "A class",
          "quantity": 3
        },
          {
            "classificationName": "B class",
            "quantity": 11
          },
          {
            "classificationName": "E class",
            "quantity": 20
          }]
      },
      {
        "personalName": "PC",
        "personalClassifications": [{
          "classificationName": "C class",
          "quantity": 9
        }]
      }
    ]
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
  onPageScroll: function(e) {
    console.log('onPageScroll', e.scrollTop)
    this.setData({
      scrollTop: e.scrollTop,
    })
  },
  onTabsChange: function(e) {
    console.log('onTabsChange', e)
    const {
      key
    } = e.detail
    this.data.currentTab = key;
    this.setData(this.data);
  },
  onSwiperChange: function(e) {
    console.log('onSwiperChange', e)
    const {
      current: index,
      source
    } = e.detail
    this.data.currentTab = index;
    this.setData(this.data);
  },
})