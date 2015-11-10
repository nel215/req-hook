var callback = function(req){
  console.log(req);
};

chrome.webRequest.onBeforeRequest.addListener(callback, {urls: ['<all_urls>']});
