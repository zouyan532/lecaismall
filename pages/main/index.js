
//获取应用实例

var app = getApp()
const baseRequest = require('../../libraries/baseRequest.js');
Page({
  data: {
    // tabbar
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    scrollLeft: 0,
    ad: null,
    listRec: null,
    listHot: null,
    limit: 6,
    offset: 0,
    loading: false,
    hasMore: true,
  },

  onLoad: function () {
    var that = this;
    /**
    * 获取系统信息
    */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    const adCode = wx.getStorageSync("adCode")
    if (adCode !== null && adCode.length > 0) {
      console.log("已有地址:" + adCode)
      this.initLoad();
    } else {
      console.log("获取地址")
      wx.chooseAddress({
        success: function (res) {
          console.log(JSON.stringify(res))
          wx.setStorageSync("adCode", "330281");
          this.initLoad();
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    }
  },

  initLoad: function () {
    this.showLoading();
    this.getMainAd();
    this.getRecomSnack();
    this.getHotSnack(false);
  },

  getRecomSnack: function () {
    baseRequest.findWhithToken("v1/snack/recommendSnack", {}, "GET")
      .then(d => {
        console.log(d)
        switch (d.error_code) {
          case 0:
            const array = new Array()
            for (var i = 0; i < d.snacks.length; i++) {
              var bean = d.snacks[i]
              var image;
              bean.SnackImages.forEach(function (e) {
                if (e.ImageType == 5) {
                  image = e.ImageUrl
                }
              });
              var sign = 0
              if (bean.SnackCities[0].Stock == 0) {
                sign = 1
              } else if (!bean.SnackCities[0].Enable) {
                sign = 2
              }
              var temp = {
                sign: sign,
                image: image,
                id: i
              }
              array[i] = temp
            }
            this.setData({
              listRec: array
            })
            break
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  getMainAd: function () {
    baseRequest.find("v1/system/snackAd", {}, "GET")
      .then(d => {
        console.log(d)
        switch (d.error_code) {
          case 0:
            console.log("广告获取")
            this.setData({
              ad: d.ad
            })
            break
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  getHotSnack: function (isMore) {
    if (!isMore) {
      this.setData({
        offset: 0
      })
    }
    baseRequest.findWhithToken("v1/snack/topSnack", {
      limit: this.data.limit,
      offset: this.data.offset,
    }, "GET")
      .then(d => {
        console.log(d)
        switch (d.error_code) {
          case 0:
            console.log("热卖菜品")
            if (d.snacks.length > 0) {
              if (d.snacks.length == this.data.limit) {
                this.setData({
                  offset: this.data.offset + this.data.limit
                })
              } else {
                this.setData({
                  hasMore: false
                })
              }
            } else {
              if (!this.data.offset == 0) {
                this.setData({
                  hasMore: false
                })
              }
            }


            const array = new Array()
            for (var i = 0; i < d.snacks.length; i++) {
              // console.log(d.snacks[i])
              var bean = d.snacks[i]
              var image;
              bean.SnackImages.forEach(function (e) {
                if (e.ImageType == 1) {
                  image = e.ImageUrl
                }
              });
              var sign = 0
              if (bean.SnackCities[0].Stock == 0) {
                sign = 1
              } else if (!bean.SnackCities[0].Enable) {
                sign = 2
              }
              var temp = {
                sign: sign,
                image: image,
                name: bean.SnackName,
                saleAmount: bean.SaleAmount,
                price: bean.SnackCities[0].CityPrice.toFixed(2),
                id: i
              }
              array[i] = temp
            }
            console.log("请求到的" + array)
            console.log(this.data.listHot)
            this.setData({
              listHot: isMore ? this.data.listHot.concat(array) : array
            })
            this.hideLoading();
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
            break
        }
      })
      .catch(e => {
        console.log(e)
      })
  },
  /**
  * 滑动切换tab
  */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    // 内容与tabbar的联动
    //这里的 2 75 是根据顶部tabbar的个数来决定的，我定义的是5个，2是索引，也就是说超过三页才会改变
    if (e.detail.current > 2) {
      var a = e.detail.current
      var query = wx.createSelectorQuery()
      query.select('.scrollBox').boundingClientRect(function (res) {
        var b = res.width
        that.setData({
          scrollLeft: (a - 2) * 75
        })
      })
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
      })
    } else {
      var a = e.detail.current
      this.setData({
        scrollLeft: 0
      })
    }
  },

  /**
  * 点击tab切换
  */

  swichNav: function (e) {
    var that = this;
    console.log(e.target)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  clickRec: function (e) {
    console.log(e);
  },

  showLoading() {
    this.setData({
      subtitle: '加载中...',
      loading: true,
    });
  },
  hideLoading() {
    this.setData({
      loading: false
    });
  },
  reachTop: function () {
    console.log("到达顶部")
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.initLoad();
  },
  reachBottm: function () {
    console.log("到达底部")
    this.getHotSnack(true)
  }
})
