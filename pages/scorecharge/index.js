// pages/scorecharge/index.js
const baseRequest = require('../../libraries/baseRequest.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardId: "",
        password: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    clickCharge: function (e) {
        baseRequest.findWhithToken("v1/user/rechargeCard", {
            Id: this.data.cardId,
            Password: this.data.password
        }, "PUT")
            .then(e => {
                console.log(e)
                this.showToast(e.error_message)
            })
            .catch(e => {
                console.log(e)
            })
    },
    cardIdInput: function (e) {
        this.setData({
            cardId:e.detail.value
        })
    },
    passwordInput:function (e) {
        this.setData({
            password:e.detail.value
        })
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