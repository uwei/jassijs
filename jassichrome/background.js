

var attachedTabs = {};
var version = "1.0";

chrome.debugger.onEvent.addListener(onEvent);
chrome.debugger.onDetach.addListener(onDetach);

chrome.browserAction.onClicked.addListener(function(tab) {
  var tabId = tab.id;
  var debuggeeId = {tabId:tabId};

  if (attachedTabs[tabId] == "pausing")
    return;

  if (!attachedTabs[tabId])
    chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId));
  else if (attachedTabs[tabId])
    chrome.debugger.detach(debuggeeId, onDetach.bind(null, debuggeeId));
});
function onDetach(debuggeeId) {
  var tabId = debuggeeId.tabId;
  delete attachedTabs[tabId];
  chrome.browserAction.setIcon({tabId:tabId, path:"debuggerPause.png"});
  chrome.browserAction.setTitle({tabId:tabId, title:"Pause JavaScript"});
}
function onAttach(debuggeeId,callback) {
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }

  var tabId = debuggeeId.tabId;
  chrome.browserAction.setIcon({tabId: tabId, path:"debuggerPausing.png"});
  chrome.browserAction.setTitle({tabId: tabId, title:"Pausing JavaScript"});
  attachedTabs[tabId] = "pausing";
  chrome.debugger.sendCommand(debuggeeId, "Debugger.enable", {},function done(deb){
      chrome.debugger.sendCommand(debuggeeId, "Runtime.enable", {},function done2(run){
        callback(deb,run);
      });
  });
 
}
window.bid="";
window.debuggeeId="";
window.removeLastBreakpoint=function(){
	 console.log("remove BP:"+window.bid);
     var test=chrome.debugger.sendCommand(window.debuggeeId, "Debugger.removeBreakpoint",{breakpointId:window.bid});
}
function onEvent(debuggeeId, method,param) {
  var tabId = debuggeeId.tabId;
  if (method == "Debugger.paused") {
    //var bid=param.hitBreakpoints[0];
     window.bid=param.hitBreakpoints[0];
     window.debuggeeId=debuggeeId;
     
      reportVariables(debuggeeId,param);
      
    //}
    //chrome.debugger.sendCommand(debuggeeId, "Debugger.resume");
    
    var c=1;
   /* attachedTabs[tabId] = "paused";
    var obId=param.callFrames[0].scopeChain[0].object.objectId;
    var frmid=param.callFrames[0].callFrameId;
    chrome.debugger.sendCommand(debuggeeId, "Runtime.enable", {}, function(d1,d2,d3){
      var jjj=d1;
    });
    var h=chrome.debugger.sendCommand(
      debuggeeId, "Runtime.getProperties", 
      {objectId: obId, ownProperties: false, accessorPropertiesOnly: false},
      function(data,var1,var2,var3,var4){
        chrome.debugger.sendCommand(
          debuggeeId, "Debugger.evaluateOnCallFrame", {
            callFrameId: frmid,
            expression: "window.kundene=jj",
            generatePreview: false,
            includeCommandLineAPI: false,
            objectGroup: "popover",
            returnByValue: false,
            silent: true
          },
              function(ret2){
                  var gg=0;
              });

      });
*/
    chrome.browserAction.setIcon({tabId:tabId, path:"debuggerContinue.png"});
    chrome.browserAction.setTitle({tabId:tabId, title:"Resume JavaScript"});
  }
}




chrome.runtime.onConnect.addListener(port => {
  console.log('connected ', port);

  if (port.name === 'hi') {
      port.onMessage.addListener(this.processMessage);
  }
});
// Background page -- background.js
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
     /*   chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject });*/
            //active Tab
            sendChangeRequestClients(message,sender);
           
           /* chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
                console.log(response.farewell);
              }); 
            }); */
    } 
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function() {
         devToolsConnection.onMessage.removeListener(devToolsListener);
    });


}); 
var changeRequestClient={};
var breakPointTypes={};
function sendChangeRequestClients(message,sender){ 
  var all = [];
  for(var key in changeRequestClient){
    if(message.url.url.indexOf(key)===0)
      all.push(changeRequestClient[key]);
  }
  changeRequestClient=[];
  for(var x=0;x<all.length;x++){
    var req=all[x];
    req(message);
  }
}


function reportVariables(debuggeeId,param){
    var obId=param.callFrames[0].scopeChain[0].object.objectId;
    var frmid=param.callFrames[0].callFrameId;
    var bid=param.hitBreakpoints[0];
    var h=chrome.debugger.sendCommand(debuggeeId, "Runtime.getProperties", 
      {objectId: obId, ownProperties: false, accessorPropertiesOnly: false},
      function(data){
          var code="{let __retre__={};__retre__.this=this;";
          for(var x=0;x<data.result.length;x++){
            var v=data.result[x];
            code=code+"__retre__."+v.name+"="+v.name+";";
          }
        
         code=code+"jassi.debugger.reportVariables('"+param.callFrames[0].url+"',__retre__,'"+breakPointTypes[bid]+"');__retre__=undefined;}";
          chrome.debugger.sendCommand(
            debuggeeId, "Debugger.evaluateOnCallFrame", {
              callFrameId: frmid,
              expression: code,
              generatePreview: false,
              includeCommandLineAPI: false,
              //objectGroup: "popover",
              returnByValue: false,
              silent: true
            },
              function(ret2){
                if(breakPointTypes[bid]==="checkpoint"||breakPointTypes[bid]==="variablepoint"){
                  var test=chrome.debugger.sendCommand(debuggeeId, "Debugger.removeBreakpoint",
                  {breakpointId:bid},
                      function(data1,data2){
                        delete breakPointTypes[bid];
                        chrome.debugger.sendCommand(debuggeeId, "Debugger.resume");
                        
                    });
                 
                }
              });

      });
}

function handleDebuggerRequest(request,sender,sendResponse){
           var debuggeeId = {tabId:sender.tab.id};
           if(request.name==="disconnect"){
              if(changeRequestClient[site]!==undefined)
                delete changeRequestClient[site];
               var debuggeeId = {tabId:sender.tab.id};
               try{
                chrome.debugger.detach(debuggeeId, onDetach.bind(null, debuggeeId));
               }catch(ex){

               }
              sendResponse("ok");
            }else if(request.name==="breakpointChanged"){
              if(request.enable){
               
                try{
                  var test=chrome.debugger.sendCommand(debuggeeId, "Debugger.setBreakpointByUrl",
                  {condition: "",lineNumber: request.line,url: request.url},
                      function(data1,data2){
                         var h=data1;
                         sendResponse(h);
                          if(request.type!=="debugpoint")
                            breakPointTypes[data1.breakpointId]=request.type;
                    });
                }catch(err){
                  sendResponse(err);
                }
              }else{
                 try{
                   //1:28:0:http://localhost/jassi/public_html/demo/TreeTable.js?bust=1551540611941
                   var bid="1:"+request.line+":0:"+request.url;
                   if(breakPointTypes[bid]!==undefined)
                    delete breakPointTypes[bid];
                  var test=chrome.debugger.sendCommand(debuggeeId, "Debugger.removeBreakpoint",
                  {breakpointId:bid},
                      function(data1,data2){
                         var h=data1;
                         sendResponse(h);
                    });
                }catch(err){
                  sendResponse(err);
                }
              } 
            }else
               sendResponse("unknown method");
}

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
      var site=sender.url.split("/app.html")[0];
      if(request.name==="getCodeChange")
        changeRequestClient[site]=sendResponse;
      else{
        var debuggeeId = {tabId:sender.tab.id};
        if(!attachedTabs[sender.tab.id]){
          chrome.debugger.attach(debuggeeId, version, onAttach.bind(null, debuggeeId,function callback(v1,v2){
            handleDebuggerRequest(request, sender, sendResponse);
           }));
        }else
          handleDebuggerRequest(request, sender, sendResponse);
        
      }
     
     
  });
/* geht
chrome.tabs.executeScript(knownTabs[x], { 
     code: 'window.klaus=1;',
      //code: 'window.jassi.debugger.saveCode("'+file+'","'+code+'")',
      runAt: 'document_end', 
      allFrames: true        // Run at the top-level frame only to get
                              // just one result
    }, function(results) {
       // var result = results[0];
        console.log(results); // Example
    });
    */

/* geht nicht
chrome.runtime.onConnect.addListener(function(port) {
  alert("port");
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    aler("background get what");
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });*/

 