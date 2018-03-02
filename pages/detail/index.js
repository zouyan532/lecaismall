// pages/detail/index.js
const baseRequest = require('../../libraries/baseRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    snackId: null,
    name: "",
    price: 0.00,
    saleAmount: 0,
    bottomImages: [],
    topImages: [],
    images: {},
    addCartTimes: 0,
    sign: 0,
    loading:false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      snackId: options.id
    })
    this.initLoad()
  },
  initLoad: function () {
    baseRequest.findWhithToken("v1/snack/snackDetail", {
      snackId: this.data.snackId
    }, "GET")
      .then(d => {
        console.log(d.snack)
        this.hideLoading();
        var topImages = new Array()
        var bottomImages = new Array()
        d.snack.SnackImages.sort((a, b) => {
          return a.ImageIndex - b.ImageIndex
        })
        d.snack.SnackImages.forEach(e => {
          if (e.ImageType == 3) {
            topImages.push(e.ImageUrl)
          } else if (e.ImageType == 4) {
            bottomImages.push(e.ImageUrl)
          }
        })
        var sign = 0
        if (d.snack.SnackCities[0].Stock == 0) {
          sign = 1
        } else if (!d.snack.SnackCities[0].Enable) {
          sign = 2
        }
        this.setData({
          topImages: topImages,
          bottomImages: bottomImages,
          name: d.snack.SnackName,
          price: d.snack.SnackCities[0].CityPrice.toFixed(2),
          saleAmount: d.snack.SaleAmount,
          addCartTimes: d.snack.SnackCarts.length == 0 ? 0 : d.snack.SnackCarts[0].Amount,
          sign: sign
        })

      })
      .catch(e => {
        console.log(e)
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
  imageLoad: function (e) {
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;    //图片的真实宽高比例
    var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
      viewHeight = 718 / ratio;    //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  },
  addtoCart: function () {
    if (this.data.sign == 0) {
      this.showLoading()
      this.modifyCarts(this.data.addCartTimes + 1, this.data.snackId)
    } else if (this.data == 1) {
      this.showToast("该商品已售罄", false);
    } else {
      this.showToast("该商品已下架", false);
    }
  },
  modifyCarts: function (amount, goodId) {
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
            this.showToast("已添加到购物车", true)
            this.initLoad();
            break
        }
        return null
      })
      .catch(e => {
        console.log(e)
        this.showToast("网络错误", false)
      })
  },
  clickCart:function(){
    var pages = getCurrentPages()
    var mainPage = pages[[pages.length-2]]
    mainPage.setData({
      currentTab:1
    })
    wx.navigateBack()
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
})