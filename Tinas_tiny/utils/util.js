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

const isInArray = (arr,ele) => {
  for(var i=0;i<arr.length;i++){
    if(arr[i]==ele){
      return 1;
    }
  }
  return 0;
}

const repeatNumberInArray = (arr,ele) => {
  var sum=0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == ele) {
      sum++;
    }
  }
  return sum;
}
module.exports = {
  formatTime: formatTime,
  isInArray: isInArray,
  repeatNumberInArray: repeatNumberInArray
}
