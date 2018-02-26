//index.js
//获取应用实例
const app = getApp()
const baseRequest = require('../../libraries/baseRequest.js');
Page({
  data: {
    account: '',
    password: ''
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
  login: function (event) {
    this.showLoading();
    baseRequest.find('v1/user/login', {
      password: this.data.password,
      account: this.data.account,
      logintype: 0
    }, 'POST')
      .then(d => {
        this.hideLoading();
        switch (d.error_code) {
          case 0:
            console.log("登录成功")
            this.showToast("登陆成功", true);
            wx.setStorageSync("sessionId", d.sid);
            break
          case 2302:
            this.showToast("账号不存在",false);
            break;
          case 2001:
            this.showToast("密码错误", false);
            break;
          case 2005:
            this.showToast("账号被封禁", false);
            break;
        }
      })
      .catch(e => {
        this.hideLoading();
        console.log(e)
      })
  },
  accountInput: function (event) {
    this.setData({
      account: event.detail.value
    })
  },
  passwordInput: function (event) {
    this.setData({
      password: event.detail.value
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
  toForgetPassword(event){
    wx.navigateTo({
      url: "../register/index?isRegister=false",
    })
  },
  toRegister(event){
    wx.navigateTo({
      url: "../register/index?isRegister=true",
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '登录'
    })
  }
})
