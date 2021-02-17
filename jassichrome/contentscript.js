// Listening to messages from backgroundscript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //console.log(eval(request));
    //send message to website
    request.fromJassiExtension=true;
    window.postMessage(request, "*");
    //console.log("content script received from backgroundscript "+JSON.stringify(request));
    // Callback
    //sendResponse({ message: 'Content script has received that message ' })
})
//listen to messages from website
window.addEventListener("message", function (event) {
    //console.log("contentscript received from website"+JSON.stringify(event));
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    //we only accept messages from jassi websites
    if (!event.data.toJassiExtension)
        return;
    //send the message to backgroundscript
    chrome.runtime.sendMessage(event.data, function (response) {
        //console.log("content script response from background "+response);
        if(response===undefined)
            response={};
        //response.fromJassiExtension=true;
        //response.mid=event.data.mid;
        //debugger;

    });
});