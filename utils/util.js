const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getCurrentDataFormat = () => {
  var date = new Date();
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  console.log(Y + "-" + M + "-" + D)
  return Y + "-" + M + "-" + D
}
const timeSlice = str => {
  var newStr = str.split("T")[1]
  var array = newStr.split(":")
  return array[0] + ":" + array[1]
}

const addDay=(dateStr,count)=>{
  var sdate = dateStr.split('-');
  var date = new Date(sdate[0], sdate[1] - 1, sdate[2]); 
  console.log(date)
  //年  
  var Y = date.getFullYear();
  //月  
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //日  
  var D = date.getDate() < 10 ? '0' + (date.getDate()+count) : date.getDate();
  console.log(Y + "-" + M + "-" + D)
  return Y + "-" + M + "-" + D
}


module.exports = {
  formatTime: formatTime,
  getCurrentDataFormat: getCurrentDataFormat,
  timeSlice:timeSlice,
  addDay: addDay
}
