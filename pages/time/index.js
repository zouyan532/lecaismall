// pages/time/index.js
const baseRequest = require('../../libraries/baseRequest.js');
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderTypeId: 4,
    distributionTypeId: 3,
    firstDay: "",
    selectCompany: null,
    listPeriod: [],
    listAvaiable: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages = getCurrentPages();
    var companyPage = pages[pages.length - 2]
    this.setData({
      selectCompany: companyPage.data.selectCompany
    })
    this.getAvaiableDate()
  },
  getAvaiableDate: function () {
    baseRequest.findWhithToken("v1/order/avaiableDate", {
      orderTypeId: this.data.orderTypeId,
      distributionTypeId: this.data.distributionTypeId
    }, "GET")
      .then(e => {
        console.log(e)
        this.setData({
          firstDay: e.firstDay
        })
        this.getAvaiablePeriod(this.data.firstDay)
        if (this.data.firstDay === util.getCurrentDataFormat()) {
          this.setData({
            listAvaiable: [{
              display: '今天',
              date: this.data.firstDay,
              isCheck: true
            }, {
              display: "明天",
              date: util.addDay(this.data.firstDay, 1),
              isCheck: false
            }, {
              display: "后天",
              date: util.addDay(this.data.firstDay, 2),
              isCheck: false
            }]
          })
        } else {
          this.setData({
            listAvaiable: [{
              display: '明天',
              date: util.addDay(this.data.firstDay, 1),
              isCheck: true
            }, {
              display: "后天",
              date: util.addDay(this.data.firstDay, 2),
              isCheck: false
            }, {
              display: util.addDay(this.data.firstDay, 3),
              date: util.addDay(this.data.firstDay, 3),
              isCheck: false
            }]
          })
        }
        return null
      })
      .catch(e => {
        console.log(e)
        this.showToast("网路错误", false)
      })
  },
  getAvaiablePeriod: function (day) {
    baseRequest.findWhithToken("v1/order/avaiablePeriod", {
      orderTypeId: this.data.orderTypeId,
      distributionTypeId: this.data.distributionTypeId,
      bookDate: day
    }, "GET")
      .then(e => {
        var array = new Array()
        e.cityShipTimes.forEach((e, i) => {
          this.data.selectCompany.CompanyLocationPreTimes.forEach((v, i) => {
            if (e.Period === v.Period) {
              var period = e.Period === "LUNCH" ? "午餐" : "晚餐"
              array.push({
                display: period + " " + util.timeSlice(v.StartTime) + "-" + util.timeSlice(v.EndTime),
                start: util.timeSlice(v.StartTime),
                end: util.timeSlice(v.EndTime),
                period: e.Period,
                isCheck:false
              })
            }
          })
        })
        console.log(array)
        this.setData({
          listPeriod: array
        })
        return null
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
  bindCheckAvaiable(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.listAvaiable
    list.forEach(e=>{
      e.isCheck = false
    })
    list[index].isCheck = true
    this.setData({
      listAvaiable:list
    })
    this.getAvaiablePeriod(list[index].date)
  },
  bindCheckPeriod(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.listPeriod
    list.forEach(e => {
      e.isCheck = false
    })
    list[index].isCheck = true
    this.setData({
      listPeriod: list
    })
    var pages = getCurrentPages()
    var commitOrderPage = pages[pages.length-2]
    var time = ""
    this.data.listAvaiable.forEach(e=>{
        if(e.isCheck){
          time = e.date+" "
        }
    })
    console.log(time + this.data.listPeriod[index].display)
    commitOrderPage.setData({
      time: time + this.data.listPeriod[index].display,
      start: this.data.listPeriod[index].start,
      end: this.data.listPeriod[index].end,
      period: this.data.listPeriod[index].period
    })
    wx.navigateBack({
      
    })
  }
})