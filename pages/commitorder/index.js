// pages/commitorder/index.js
const baseRequest = require('../../libraries/baseRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    displayTotal: 0.00,
    total: 0.00,
    listGood: [],
    disName: "选择公司地址",
    disAddress: "(公司地址)",
    shipping: 0.00,
    isUseScore: false,
    score: 0,
    displayScore: 0,
    totalAmount: 0,
    selectCompany: null,
    time: "选择配送时间",
    start: "",
    end: "",
    period: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var mainPage = pages[pages.length - 2];
    var list = new Array()
    var totalAmount = 0
    mainPage.data.listCart.forEach((e, i) => {
      if (e.isCheck) {
        totalAmount = totalAmount + e.amount
        list.push(e)
      }
    })
    this.setData({
      total: mainPage.data.total,
      displayTotal: mainPage.data.total,
      listGood: list,
      totalAmount: totalAmount
    })
    this.getMyInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  switchChange: function (e) {
    this.setData({
      isUseScore: e.detail.value,
      displayTotal: e.detail.value ? this.data.score > this.data.total * 100 ? 0 : this.data.total - this.data.score / 100 : this.data.total
    })
  },
  getMyInfo: function () {
    baseRequest.findWhithToken("v1/user/myinfo", {}, "GET")
      .then(e => {
        this.setData({
          score: e.info.Score,
          displayScore: e.info.Score > this.data.total * 100 ? this.data.total * 100 : e.info.Score
        })
      })
      .catch(e => {
        this.showToast("网路错误", false)
      })
  },
  showToast(msg, isSuccess) {
    wx.showToast({
      title: msg,
      icon: isSuccess ? 'succes' : 'none',
      duration: 1000,
      mask: true
    })
  },
  clickSelectCompany(e) {
    wx.navigateTo({
      url: '../company/index',
    })
  },
  clickSelectTime(e) {
    if (this.data.selectCompany === null) {
      this.showToast("请先选择公司地址", false)
      return
    }
    wx.navigateTo({
      url: '../time/index',
    })
  }
})