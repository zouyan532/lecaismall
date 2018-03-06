const API_URL = 'https://api.lc-it.com';

const Promise = require('./bluebird')

function fetchApi(type, params, method) {
  return new Promise((resolve, reject) => {
    console.log(`${API_URL}/${type}`)
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "adCode": wx.getStorageSync("adCode")
      },
      success: resolve,
      method: method,
      fail: reject
    })

  })
}

function fetchApiWithToken(type, params, method) {
  return new Promise((resolve, reject) => {
    console.log(`${API_URL}/${type}`)
    console.log(params)
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      header: {
        'content-type': 'application/json',
        "sessionId": wx.getStorageSync("sessionId"),
        "adCode": wx.getStorageSync("adCode")
      },
      success: resolve,
      method: method,
      fail: reject
    })

  })
}
function fetchCityByAdcode(adcode) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: "http://restapi.amap.com/v3/place/text",
      data: {
        city: adcode,
        offset: 5,
        page: 1,
        key: "833b15cf1d6534b42867ddbb11be8eea"
      },
      success: resolve,
      method: "GET",
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
  getCityByAdcode(adcode) {
    return fetchCityByAdcode(adcode)
      .then(res => res.data)
  }
}