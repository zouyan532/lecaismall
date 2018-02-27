
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
    listHotAll: null,
    listCart: null,
    listCartAll: null,
    total: 0.00,
    isAllChecked: false,
    modalhidden: true,
    currentNeedDeleteGoodId: null
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
      this.initLoadSnack();
    } else {
      wx.chooseAddress({
        success: function (res) {
          wx.setStorageSync("adCode", "330281");
          this.initLoadSnack();
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    }
  },

  initLoadSnack: function () {
    this.showLoading();
    this.getMainAd();
    this.getRecomSnack();
    this.getHotSnack(false);
  },

  getRecomSnack: function () {
    baseRequest.findWhithToken("v1/snack/recommendSnack", {}, "GET")
      .then(d => {
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
        switch (d.error_code) {
          case 0:
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
        switch (d.error_code) {
          case 0:
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
            this.setData({
              listHot: isMore ? this.data.listHot.concat(array) : array,
              listHotAll: isMore ? this.data.listHotAll.concat(d.snacks) : d.snacks
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
      if (this.data.currentTab == 1) {
        this.initLoadCart()
      }
    }
  },
  initLoadCart: function () {
    baseRequest.findWhithToken("v1/cart/snackCarts", {}, "GET")
      .then(d => {
        console.log(d)
        switch (d.error_code) {
          case 0:
            const array = new Array()
            for (var i = 0; i < d.snacks.length; i++) {
              var bean = d.snacks[i]
              var image;
              bean.SnackImages.forEach(function (e) {
                if (e.ImageType == 2) {
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
                id: i,
                price: bean.SnackCities[0].CityPrice.toFixed(2),
                amount: bean.SnackCarts[0].Amount,
                isCheck: false,
                name: bean.SnackName
              }
              array[i] = temp
            }
            this.setData({
              listCart: array,
              listCartAll: d.snacks
            })
            this.upDateTotal();
            break
        }
      })
      .catch(e => {
        console.log(e)
        this.showToast("网络错误", false)
      })
  },
  clickRec: function (e) {
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.initLoadSnack();
  },
  reachBottm: function () {
    this.getHotSnack(true)
  },
  addtocart: function (e) {
    var bean = this.data.listHotAll[e.currentTarget.dataset.id]
    let count = 0;
    if (bean.SnackCarts.length > 0) {
      count = bean.SnackCarts[0].Amount
    }
    if (bean.SnackCities.length > 0) {
      if (bean.SnackCities[0].Stock != 0) {
        if (bean.SnackCities[0].Enable) {
          if (count < bean.SnackCities[0].TotalStock) {
            this.modifyCarts(count + 1, bean.SnackId, true)
          }
        } else {
          this.showToast("该商品已下架", false)
        }
      } else {
        this.showToast("该商品已售罄", false)
      }
    } else {
      this.showToast("当前城市暂无销售", false)
    }
  },
  showToast(msg, isSuccess) {
    wx.showToast({
      title: msg,
      icon: isSuccess ? 'succes' : 'none',
      duration: 1000,
      mask: true
    })
  },
  bindCheckbox: function (e) {
    let id = parseInt(e.currentTarget.dataset.id)
    var check = "listCart[" + id + "].isCheck"
    this.setData({
      [check]: !this.data.listCart[id].isCheck
    })
    var count = 0
    this.data.listCart.forEach(e => {
      if (e.isCheck) {
        count++
      }
    })
    if (count == this.data.listCart.length) {
      this.setData({
        isAllChecked: true,
      })
    } else {
      this.setData({
        isAllChecked: false
      })
    }
    this.upDateTotal()
  },
  upDateTotal: function () {
    var total = 0;
    this.data.listCart.forEach(e => {
      if (e.isCheck) {
        total = total + parseFloat(e.price) * e.amount
      }
      this.setData({
        total: total.toFixed(2)
      })
    })
  },
  bindAllCheckbox: function () {
    this.setData({
      isAllChecked: !this.data.isAllChecked
    })
    var list = this.data.listCart
    console.log(list)
    for (var i = 0; i < list.length; i++) {
      list[i].isCheck = this.data.isAllChecked
    }
    this.setData({
      listCart: list
    })
    this.upDateTotal()
  },
  bindCartNum: function (e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    var amount = type === "-" ? this.data.listCart[id].amount - 1 : this.data.listCart[id].amount + 1
    console.log(this.data.listCart[id].sign == 0)
    this.changeGoodAmount(amount, id)
  },
  changeGoodAmount(amount,id) {
    let goodId = this.data.listCartAll[id].SnackId
    if (amount == 0) {
      this.setData({
        modalhidden: false,
        currentNeedDeleteGoodId: goodId
      })
      return
    }
    if (this.data.listCart[id].sign == 0) {
      let count = this.data.listCartAll[id].SnackCities[0].TotalStock
      if (amount <= count) {
        this.modifyCarts(amount, goodId, false)
      }
    } else if (this.data.listCart[id].sign == 1) {
      this.showToast("商品已售罄", false)
    } else if (this.data.listCart[id].sign == 2) {
      this.showToast("商品已下架", false)
    }
  },
  modifyCarts: function (amount, goodId, isAddCart) {
    baseRequest.findWhithToken("v1/cart/snackCarts", {
      SnackCarts: [
        {
          SnackId: goodId,
          Amount: amount
        }
      ]
    }, "POST")
      .then(d => {
        switch (d.error_code) {
          case 0:
            isAddCart ? this.showToast("已添加到购物车", true) : null
            this.getHotSnack(false)
            this.initLoadCart()
            break
        }
        return null
      })
      .catch(e => {
        console.log(e)
        this.showToast("网络错误", false)
      })
  },
  deleteCarts: function () {
    baseRequest.findWhithToken("v1/cart/snackCarts", {
      SnackCarts: [
        {
          SnackId: this.data.currentNeedDeleteGoodId
        }]
    }, "PUT")
      .then(d => {
        switch (d.error_code) {
          case 0:
            this.getHotSnack(false)
            this.initLoadCart()
            break
        }
        return null
      })
      .catch(e => {
        console.log(e)
        this.showToast("网络错误", false)
      })
  },
  cancelDelete(e) {
    this.setData({
      modalhidden: true
    })
  },
  confirmDelete(e) {
    this.setData({
      modalhidden: true
    })
    this.deleteCarts()
  },
  bindIptCartNum(e) {
    
    let id = e.currentTarget.dataset.id
    this.changeGoodAmount(e.detail.value, id)
  }
})
