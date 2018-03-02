// pages/company/index.js
const baseRequest = require('../../libraries/baseRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listCompany: [],
    key: '',
    limit: 12,
    offset: 0,
    isEnd: false,
    key: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCompanies(true)
  },
  getCompanies: function (isRefresh) {
    if (isRefresh) {
      this.setData({
        offset: 0
      })
    }
    baseRequest.findWhithToken("v1/location/companyLocations", {
      limit: this.data.limit,
      offset: this.data.offset
    }, "GET")
      .then(e => {
        switch (e.error_code) {
          case 0:
            if (this.data.limit == e.companyLocations.length) {
              this.setData({
                offset: this.data.offset + this.data.limit
              })
            } else {
              this.setData({
                isEnd: true
              })
            }

            this.setData({
              listCompany: isRefresh ? e.companyLocations : this.data.listCompany.concat(e.companyLocations)
            })
            break;
        }
      })
      .catch(e => {
        console.log(e)
        this.showToast("网路错误", false)
      })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("顶部触发")
    if (this.data.key.length == 0) {
      this.getCompanies(true)
    }
  },

  onUnload: function () {
    this.setData({
      key: "",
      offset: 0,
      isEnd: false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("底部触发")
    if (this.data.key.length == 0) {
      if (this.data.isEnd) {
        this.showToast("没有跟多内容了", false)
      }
      this.getCompanies(false)

    }
  },
  clickSaerch: function (e) {
    if (e.detail.value.length == 0) {
      this.setData({
        key: e.detail.value
      })
      this.getCompanies(false)
      return
    }

    baseRequest.findWhithToken("v1/location/searchCompanyLocation", {
      key: e.detail.value
    }, "POST")
      .then(d => {
        this.setData({
          listCompany: d.companyLocations,
          key: e.detail.value
        })
      })
      .catch(e => {
        console.log(e)
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
  clickitem:function(e){
    var pages = getCurrentPages()
    var commitOrderPage = pages[pages.length-2]
    var index = e.currentTarget.dataset.index
    var bean = this.data.listCompany[index]
    console.log(e)
    commitOrderPage.setData({
      selectCompany:bean,
      disName: bean.CompanyLocationName,
      disAddress: bean.DetailAddress,
      time: "选择配送时间",
      start: "",
      end: "",
      period: ""
    })
    wx.navigateBack({
    })
  }
})