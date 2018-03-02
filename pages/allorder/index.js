// pages/allorder/index.js
const baseRequest = require('../../libraries/baseRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    limit: 12,
    offset: 0,
    listOrder: [],
    listDisplay: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList(true);
  },
  getOrderList: function (isRefresh) {
    if (isRefresh) {
      this.setData({
        offset: 0,
        hasMore:true
      })
    }
    baseRequest.findWhithToken("v1/order/userOrders", {
      requireAllStatus: true,
      limit: this.data.limit,
      offset: this.data.offset
    }, "GET")
      .then(c => {
        console.log(c)
        if (c.orders.length == this.data.limit) {
          this.setData({
            offset: this.data.offset + this.data.limit
          })
        } else {
          this.setData({
            hasMore: false
          })
        }
        var array = new Array()
        c.orders.forEach((e, i) => {
          var total = e.Price
          var ship = e.ShipFee
          var type = e.Type
          var count = 0;
          var list = new Array()
          var toptext
          if (type == 2) {
            toptext = "集市"
            e.FoodOrders.forEach(v => {
              count = count + v.Amount
              var amount = v.Amount
              console.log(amount)
              var name = v.Food.FoodName
              var price = v.Price
              var img;
              v.Food.FoodImages.forEach(d => {
                if (d.ImageType == 2) {
                  img = d.ImageUrl
                }
              })
              list.push({
                amount: amount,
                name: name,
                img: img,
                price: price,
              })
            })
          } else if (type == 3) {
            toptext = "珍货铺"
            e.MaterialOrders.forEach(v => {
              count = count + v.Amount
              var amount = v.Amount
              var name = v.Material.MaterialName
              var price = v.Price
              var img;
              v.Material.MaterialImages.forEach(d => {
                if (d.ImageType == 2) {
                  img = d.ImageUrl
                }
              })
              list.push({
                amount: amount,
                name: name,
                img: img,
                price: price,
              })
            })
          } else if (type == 4) {
            toptext = "武餐店"
            e.SnackOrders.forEach(v => {
              count = count + v.Amount
              var amount = v.Amount
              var name = v.Snack.SnackName
              var price = v.Price
              var img;
              v.Snack.SnackImages.forEach(d => {
                if (d.ImageType == 2) {
                  img = d.ImageUrl
                }
              })
              list.push({
                amount: amount,
                name: name,
                img: img,
                price: price,
              })
            })
          } else if (type == 5) {
            toptext = "火锅城"
            e.HotpotOrders.forEach(v => {
              count = count + v.Amount
              var amount = v.Amount
              var name = v.Hotpot.HotpotName
              var price = v.Price
              var img;
              v.Hotpot.HotpotImages.forEach(d => {
                if (d.ImageType == 2) {
                  img = d.ImageUrl
                }
              })
              list.push({
                amount: amount,
                name: name,
                img: img,
                price: price,
              })
            })
          }
          var state
          var left_button_text
          var right_button_text
          if (e.Status == -4) {
            state = "退款完成"
            right_button_text = "删除订单"
          } else if (e.Status == -2) {
            state = '退款中'
            right_button_text = "查看订单"
          } else if (e.Status == -1) {
            state = "交易关闭"
            right_button_text = "删除订单"
          } else if (e.Status == 0) {
            state = "待支付"
            left_button_text = "取消订单"
            right_button_text = "付款"
          } else if (e.Status == 1) {
            state = "待配送"
            right_button_text = "退款"
          } else if (e.status == 2) {
            state = "待收货"
            left_button_text = "确认收货"
            right_button_text = '查看订单'
          } else if (e.status == 3) {
            state = "待评价"
          } else if (e.status == 4) {
            state = "交易完成"
            left_button_text = "删除订单"
            right_button_text = "查看订单"
          } else if (e.status == 10001) {
            state = "待接单"
            left_button_text = "取消订单"
            right_button_text = "查看订单"
          }
          array.push({
            total: total.toFixed(2),
            ship: ship.toFixed(2),
            type: type,
            count: count,
            status: e.Status,
            state: state,
            left_button_text: left_button_text,
            right_button_text: right_button_text,
            list: list,
            toptext: toptext
          })
        })
        this.setData({
          listOrder: isRefresh ? c.orders : this.data.listOrder.concat(c.orders),
          listDisplay: isRefresh ? array : this.data.listDisplay.concat(array),
        })
      })
      .catch(e => {
        console.log(e)
        this.showToast("网络错误", false)
      })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderList(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore) {
      this.getOrderList(false)
    }
  },
  showToast(msg, isSuccess) {
    wx.showToast({
      title: msg,
      icon: isSuccess ? 'succes' : 'none',
      duration: 1000,
      mask: true
    })
  }
})