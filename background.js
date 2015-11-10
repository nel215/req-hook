var callback = function(req){
  chrome.storage.sync.get(['filters', 'target'], (items)=> {
    var filters = items.filters || [];
    for(var i=0; i<filters.length; i++) {
      console.log(filters[i]);
      if(req.url.indexOf(filters[i]) >= 0) {
        console.log(req);
      }
    }
  });
};

chrome.webRequest.onBeforeRequest.addListener(callback, {urls: ['<all_urls>']});
