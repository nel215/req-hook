import request from 'superagent';

var callback = function(req){
  chrome.storage.sync.get(['filters', 'target'], (items)=> {
    var filters = items.filters || [];
    var target = items.target || 'http://localhost/';
    for(var i=0; i<filters.length; i++) {
      if(req.url.indexOf(filters[i]) >= 0) {
        return request
          .post(target)
          .send(req)
          .end((err, res)=> {
            console.log(err);
            console.log(res);
          });
      }
    }
  });
};

chrome.webRequest.onBeforeRequest.addListener(callback, {urls: ['<all_urls>']});
