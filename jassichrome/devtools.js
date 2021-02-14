
// references from bg page
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});
backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page, if any
});

chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener(function(res, data) {
    backgroundPageConnection.postMessage({
        event: 'onResourceContentCommitted',
        url: res,
        data: data
    });
});

chrome.devtools.panels.sources.createSidebarPane("Jassi Ext",
    function(sidebar) {
    // sidebar initialization code here
  //  sidebar.setObject({ some_data: "Some data to show" });
  sidebar.setPage("panel.html");
});
/*
chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "content_script.js"
});*/