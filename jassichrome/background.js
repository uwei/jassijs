//https://github.com/uwei/jassijs
var version = "1.0";
var attachedTabs = {};
var tabsForCodeChange = [];


chrome.debugger.onEvent.addListener(onEvent);
chrome.debugger.onDetach.addListener(onDetach);

chrome.browserAction.onClicked.addListener(function (tab) {
  var tabId = tab.id;
  var debuggeeId = { tabId: tabId };
  enableDebuggerIfNeeded(true, tab, () => {
    try{
      chrome.debugger.sendCommand(debuggeeId, "Debugger.resume");
      if(window.debuggeeId)
        window.removeLastBreakpoint();
    }catch{

    }
  })
});
function onDetach(debuggeeId) {
  var tabId = debuggeeId.tabId;
  delete attachedTabs[tabId];
}
function onAttach(debuggeeId, callback) {
  var tabId = debuggeeId.tabId;
  attachedTabs[tabId] = "pausing";
  chrome.debugger.sendCommand(debuggeeId, "Debugger.enable", {}, function done(deb) {
    chrome.debugger.sendCommand(debuggeeId, "Runtime.enable", {}, function done2(run) {
      if (callback)
        callback(deb, run);
    });
  });
}

//connect the debugger
function enableDebuggerIfNeeded(enable, tab, callback) {
  if (enable && !attachedTabs[tab.id]) {
    chrome.debugger.attach({ tabId: tab.id }, version, onAttach.bind(null, { tabId: tab.id }, (v1, v2) => {
      callback(v1, v2);
    }));
  } else if (enable) {
    callback();
  } else {
    onDetach.bind(null, tab);
  }
}
//the last paused breakpoint id
window.bid = "";
//the last paused debuggeeId
window.debuggeeId = "";
//this funtion removes the last paused breakpoint
window.removeLastBreakpoint = function () {
  console.log("remove BP:" + window.bid);
  var test = chrome.debugger.sendCommand(window.debuggeeId, "Debugger.removeBreakpoint", { breakpointId: window.bid });
}
function onEvent(debuggeeId, method, param) {
  var tabId = debuggeeId.tabId;
  if (method == "Debugger.paused") {
    window.bid = param.hitBreakpoints[0];
    window.debuggeeId = debuggeeId;
  }
}




chrome.runtime.onConnect.addListener(port => {
  console.log('connected ', port);

  if (port.name === 'hi') {
    port.onMessage.addListener(this.processMessage);
  }
});
// Background page -- background.js
chrome.runtime.onConnect.addListener(function (devToolsConnection) {
  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function (message, sender, sendResponse) {
    //send message to content script
    tabsForCodeChange.forEach((id) => {
      message.fromJassiExtension = true;
      chrome.tabs.sendMessage(id, message);
    });
  }
  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener);
  devToolsConnection.onDisconnect.addListener(function () {
    devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});

var breakPointTypes = {};

//enable or disable a breakpoint
function changeBreakpoint(request, sender, sendResponse) {
  var debuggeeId = { tabId: sender.tab.id };
  enableDebuggerIfNeeded(true, sender.tab, () => {
    if (request.enable) {
      try {
        var test = chrome.debugger.sendCommand(debuggeeId, "Debugger.setBreakpointByUrl",
          { condition: "", lineNumber: request.line, url: request.url },
          function (data1, data2) {
            var h = data1;
            sendResponse(h);
            if (request.type !== "debugpoint")
              breakPointTypes[data1.breakpointId] = request.type;
          });
      } catch (err) {
        sendResponse(err);
      }
    } else {
      try {
        //1:28:0:http://localhost/jassi/public_html/....
        var bid = "1:" + request.line + ":0:" + request.url;
        if (breakPointTypes[bid] !== undefined)
          delete breakPointTypes[bid];
        chrome.debugger.sendCommand(debuggeeId, "Debugger.removeBreakpoint",
          { breakpointId: bid },
          function (data1, data2) {
            var h = data1;
            sendResponse(h);
          });
      } catch (err) {
        sendResponse(err);
      }
    }
  });
}
function handleDebuggerRequest(request, sender, sendResponse) {

  var debuggeeId = { tabId: sender.tab.id };
  if (request.name === "getCodeChange") {
    tabsForCodeChange.push(sender.tab.id);
  }
  if (request.name === "connect") {
    chrome.tabs.sendMessage(sender.tab.id, {
      fromJassiExtension: true,
      connected: true
    });
  }
  if (request.name === "disconnect") {
    if (changeRequestClient[site] !== undefined)
      delete changeRequestClient[site];
    var debuggeeId = { tabId: sender.tab.id };
    try {
      chrome.debugger.detach(debuggeeId, onDetach.bind(null, debuggeeId));
    } catch (ex) {

    }
    sendResponse("ok");
  } else if (request.name === "breakpointChanged") {
    changeBreakpoint(request, sender, sendResponse);
  } else
    sendResponse("unknown method");
}

//listen to contentscript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("received from contentscript " + sender.tab.id + ":" + JSON.stringify(request));
  handleDebuggerRequest(request, sender, sendResponse);
  // Callback for that request
  //sendResponse({ message: "Background has received that message 🔥" });
});
