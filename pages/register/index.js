const baseRequest = require('../../libraries/baseRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck: true,
    account: '',
    smscode: '',
    password: '',
    repassword: '',
    isRegister: false
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      isRegister: options.isRegister === "true"
    })

    wx.setNavigationBarTitle({
      title: this.data.isRegister ? '注册' : '忘记密码'
    })
  },

  checkboxChange: function (e) {
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  accountInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  verInput: function (e) {
    this.setData({
      smscode: e.detail.value
    })
  },
  clickGetVCode: function (e) {
    baseRequest.find("v1/user/getSmsCode", {
      telephone: this.data.account,
      type: this.data.isRegister ? 0 : 1
    }, "POST")
      .then(d => {
        this.hideLoading();
        switch (d.error_code) {
          case 0:
            this.showToast("验证码已发送", true);
            break
          case 2104:
            this.showToast("电话号码不正确", false)
            break
          case 2303:
            this.showToast("该用户已注册", false)
            break
          case 2107:
            this.showToast("短信数量超出每日限制", false)
            break
        }
      })
      .catch(e => {
        this.hideLoading();
        console.log(e)
      })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  repasswordInput: function (e) {
    this.setData({
      repassword: e.detail.value
    })
  },
  register: function (e) {
    if (this.data.password !== this.data.repassword) {
      this.showToast("输入的两次密码不一致", false);
      return
    }
    if (this.data.isRegister) {
      baseRequest.find("v1/user/registe", {
        logintype: 0,
        account: this.data.account,
        smscode: this.data.smscode,
        password: this.data.password,
      }, "POST")
        .then(d => {
          this.hideLoading();
          switch (d.error_code) {
            case 0:
              console.log("注册")
              this.showToast("注册成功", true);
              wx.navigateBack({
                delta: 1
              })
              break
            case 2205:
              this.showToast("密码格式不正确,字母数字组合", false);
              break;
            case 2108:
              this.showToast("短信验证码错误", false);
              break;
            case 2301:
              this.showToast("账户已存在", false);
              break;
          }
        })
        .catch(e => {
          this.hideLoading();
          console.log(e)
        })
    } else {
      baseRequest.find("v1/user/resetpwd",{
        telephone:this.data.account,
        smscode:this.data.smscode,
        password:this.data.password
      },"POST")
        .then(d => {
          this.hideLoading();
          switch (d.error_code) {
            case 0:
              this.showToast("密码重置成功", true);
              wx.navigateBack({
                delta: 1
              })
              break
            case 2205:
              this.showToast("密码格式不正确,字母数字组合", false);
              break;
            case 2108:
              this.showToast("短信验证码错误", false);
              break;
            case 2302:
              this.showToast("账户不存在", false);
              break;
          }
        })
        .catch(e => {
          this.hideLoading();
          console.log(e)
        })
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
})