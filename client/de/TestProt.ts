 //navigator.serviceWorker.controller.postMessage({
   //         type: 'LOGGED_IN'
     //   });//

import { LocalProtocol } from "jassijs_localserver/LocalProtocol";
 navigator.serviceWorker.controller.postMessage({
            type: 'ACTIVATE_REMOTEPROTCOL'
        });
  // 
navigator.serviceWorker.addEventListener("message", (evt) => {
                if (evt.data?.type === "REQUEST_REMOTEPROTCOL") {
                   new LocalProtocol().messageReceived(evt);
                }
            });