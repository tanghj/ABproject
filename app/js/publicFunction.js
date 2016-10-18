function judgeDevice(){
  var ua = navigator.userAgent.toLowerCase();
  var Device = undefined; 
  if (/iphone|ipad|ipod/.test(ua)) {
    Device = "iOS";
  } else if (/android/.test(ua)) {
    Device = "Android";
  }else{
    Device = "Pc";
  }
  return Device;
}