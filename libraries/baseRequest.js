const API_URL = 'http://api.lc-it.com';

const Promise = require('./bluebird')

function fetchApi(type, params, method) {
  return new Promise((resolve, reject) => {
    console.log(`${API_URL}/${type}`)
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: resolve,
      method: method,
      fail: reject
    })

  })
}

function fetchApiWithToken(type, params, method) {
  return new Promise((resolve, reject) => {
    console.log(`${API_URL}/${type}`)
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "sessionId": wx.getStorageSync("token"),
        "adCode": wx.getStorageSync("adCode")
      },
      success: resolve,
      method: method,
      fail: reject
    })

  })
}


module.exports = {
  find(type, params, method) {
    return fetchApi(type, params, method)
      .then(res => res.data)
  },
  findWhithToken(type, params, method) {
    return fetchApiWithToken(type, params, method)
      .then(res => res.data)
  },
}