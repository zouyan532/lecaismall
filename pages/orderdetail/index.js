// pages/orderdetail/index.js
const baseRequest = require('../../libraries/baseRequest.js');
const utils = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order: null,
        addressType: "收货地址",
        order: null,
        goodList: [],
        fromType: "",
        step: 0,
        states: [],
        username: null,
        address: null,
        isGetScore: true,
        getScore: 0,
        useScore: 0,
        backScore: 0,
        bottomList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOrderDetail(options.orderId)
    },
    getOrderDetail: function (orderId) {

        baseRequest.findWhithToken("v1/order/userOrder", {
            orderId: orderId
        }, "GET")
            .then(d => {

                console.log(d)
                var order = d.order
                var addressType
                var address
                var goodList = new Array()
                var fromType
                var adCode
                var district
                var username
                var bottomList = new Array()
                bottomList.push({
                    key:"订单编号:",
                    value:order.Id
                })
                if (order.Type == 2) {

                    adCode = order.DistributionType==1?order.OrderPickupLocation.PickupLocation.AdCode:order.OrderUserAddress.AdCode
                    district = order.DistributionType==1?order.OrderPickupLocation.PickupLocation.DetailAddress:order.OrderUserAddress.DetailAddress
                    username = order.DistributionType==1?order.OrderPickupLocation.Consignee + order.OrderPickupLocation.Contact
                        :order.OrderUserAddress.Consignee + order.OrderUserAddress.Contact
                    console.log(adCode)
                    var orderBookDates = order.OrderBookDates[0]
                    bottomList.push({
                        key:"预约时间:",
                        value: utils.getYMD(orderBookDates.Date)+" "
                        +(orderBookDates.Period==="DINNER"?"晚餐":"午餐") +" "
                        +utils.timeSlice(orderBookDates.StartTime)+"-"
                        +utils.timeSlice(orderBookDates.EndTime)
                    })
                    fromType = "集市"
                    if (order.DistributionType == 2) {
                        addressType = "自提信息"
                    }
                    order.FoodOrders.forEach(e => {
                        var amount = e.Amount
                        var price = e.Price
                        var name = e.Food.FoodName
                        var img
                        var goodId = e.FoodId
                        e.Food.FoodImages.forEach(i => {
                            if (i.ImageType == 2) {
                                img = i.ImageUrl
                            }
                        })
                        goodList.push({
                            amount: amount,
                            price: price,
                            name: name,
                            img: img,
                            goodId:goodId
                        })
                    })

                } else if (order.Type == 3) {
                    var orderBookDates = order.OrderBookDates[0]
                    bottomList.push({
                        key:"预约时间:",
                        value: utils.getYMD(orderBookDates.Date)+" "
                        +(orderBookDates.Period==="DINNER"?"晚餐":"午餐") +" "
                        +utils.timeSlice(orderBookDates.StartTime)+"-"
                        +utils.timeSlice(orderBookDates.EndTime)
                    })
                    district = order.OrderUserAddress.DetailAddress
                    username = order.OrderUserAddress.Consignee + " " + order.OrderUserAddress.Contact
                    fromType = "珍货铺"
                    adCode = order.OrderUserAddress.AdCode
                    console.log(adCode)
                    order.MaterialOrders.forEach(e => {
                        var amount = e.Amount
                        var price = e.Price
                        var name = e.Material.MaterialName
                        var img = null
                        var goodId = e.e.MaterialId
                        e.Material.MaterialImages.forEach(i => {
                            if (i.ImageType == 2) {
                                img = i.ImageUrl
                            }
                        })
                        goodList.push({
                            amount: amount,
                            price: price,
                            name: name,
                            goodId:goodId,
                            img: img
                        })
                    })
                } else if (order.Type == 4) {
                    var orderBookDates = order.SnackOrderBookDates[0]
                    bottomList.push({
                        key:"预约时间:",
                        value: utils.getYMD(orderBookDates.Date)+" "
                        +(orderBookDates.Period==="DINNER"?"晚餐":"午餐") +" "
                        +utils.timeSlice(orderBookDates.StartTime)+"-"
                        +utils.timeSlice(orderBookDates.EndTime)
                    })
                    district = order.OrderCompanyLocation.CompanyLocation.DetailAddress
                    username = order.OrderCompanyLocation.CompanyLocation.CompanyLocationName + " " + order.OrderCompanyLocation.CompanyLocation.Contact
                    fromType = "武餐店"
                    addressType = "公司地址"
                    adCode = order.OrderCompanyLocation.CompanyLocation.AdCode
                    console.log(adCode)
                    order.SnackOrders.forEach(e => {
                        var amount = e.Amount
                        var price = e.Price
                        var name = e.Snack.SnackName
                        var img
                        var goodId = e.SnackId
                        e.Snack.SnackImages.forEach(i => {
                            if (i.ImageType == 2) {
                                img = i.ImageUrl
                            }
                        })
                        goodList.push({
                            amount: amount,
                            price: price,
                            name: name,
                            img: img,
                            goodId:goodId
                        })
                    })
                } else if (order.Type == 5) {
                    adCode = order.OrderPickupLocation.PickupLocation.AdCode
                    district = order.OrderPickupLocation.PickupLocation.DetailAddress
                    username = order.OrderPickupLocation.Consignee + " " + order.OrderPickupLocation.Contact
                    var orderBookDates = order.HotpotOrderBookDates[0]
                    bottomList.push({
                        key:"预约时间:",
                        value: utils.getYMD(orderBookDates.Date)+" "
                        +(orderBookDates.Period==="DINNER"?"晚餐":"午餐") +" "
                        +utils.timeSlice(orderBookDates.StartTime)+"-"
                        +utils.timeSlice(orderBookDates.EndTime)
                    })
                    fromType = "火锅城"
                    if (order.DistributionType == 2) {
                        addressType = "自提信息"
                    }
                    order.HotpotOrders.forEach(e => {
                        var amount = e.Amount
                        var price = e.Price
                        var name = e.Hotpot.HotpotName
                        var img
                        var goodId = e.HotpotId
                        e.Hotpot.HotpotImages.forEach(i => {
                            if (i.ImageType == 2) {
                                img = i.ImageUrl
                            }
                        })
                        goodList.push({
                            amount: amount,
                            price: price,
                            name: name,
                            img: img,
                            goodId: goodId
                        })
                    })
                }
                var step = 0;
                switch (order.Status) {
                    case 0:
                        step = 0
                        break;
                    case 1:
                        step = 1
                        break;
                    case 2:
                        step = 2
                        break;
                    case 4:
                        step = 3
                        break;
                    case -2:
                        step = 2
                        break;
                    case -4:
                        step = 3
                        break;
                    case -1:
                        step = 0
                        break;
                    case 10001:
                        step = 1
                        break;
                }
                baseRequest.getCityByAdcode(adCode)
                    .then(e => {
                        console.log(e)
                        this.setData({
                            address: e.pois[0].pname + e.pois[1].cityname + district
                        })
                        return null
                    })
                    .catch(e => {
                        console.log(e)
                        return null
                    })
                var getScore = 0
                var useScore = 0
                var backScore = 0
                order.UserScoreHistories.forEach(his => {
                    if (order.UserScoreHistories.length > 0) {
                        switch (his.SourceId) {
                            case -5://活动订单消耗
                            case -4://食材订单消耗
                            case -7://轻快餐订单消耗
                            case -3://菜品订单消耗
                            case -8://火锅城订单消耗
                            case -3://活动订单消耗
                                useScore = his.Score
                                break
                            case 3://菜品订单获得
                            case 4://食材订单获得
                            case 5://活动订单获得
                            case 11://轻快餐订单获得
                            case 13://火锅城订单获得
                                getScore = his.Score
                                break
                            case 1003://菜品订单退还
                            case 1004://食材订单退还
                            case 1005://活动订单退还
                            case 1006://轻快餐订单退还
                            case 1008://火锅城订单退还
                                backScore = his.Score
                                break
                        }
                    }
                })
                this.setData({
                    order: order,
                    addressType: addressType ? addressType : this.data.addressType,
                    goodList: goodList,
                    fromType: fromType,
                    step: step,
                    username: username,
                    states: order.Status > 0 ? ["已下单", "已支付", "已发货", "已完成"] : ["已下单", "已支付", "已取消", "已退款"],
                    getScore: getScore,
                    useScore: useScore,
                    backScore: backScore,
                    bottomList:bottomList
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
    clickToDetail:function (e) {
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
            url:"../detail/index?id="+this.data.goodList[id].goodId
        })
    }
})