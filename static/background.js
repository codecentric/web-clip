let session = null;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(request.type === 'setSession') {
      session = request.payload;
      sendResponse(session);
    } else if(request.type === 'getSession') {
      sendResponse(session)
    }
  }
);