var filter = {
  urls: urls
};

var callback = function(req){
  console.log(req);
};

chrome.webRequest.onBeforeRequest.addListener(callback, filter);
