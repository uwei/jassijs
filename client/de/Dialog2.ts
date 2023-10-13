import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { Button } from "jassijs/ui/Button";
type Me = {
    textbox?: Textbox;
    textbox2?: Textbox;
    textbox3?: Textbox;
    button1?: Button;
};
@$Class("de/Dialog2")
export class Dialog2 extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.textbox = new Textbox();
        me.textbox2 = new Textbox();
        me.textbox3 = new Textbox();
        me.button1 = new Button();
        this.config({
            children: [
                me.textbox.config({}),
                me.textbox2.config({ value: "fff" }),
                me.textbox3.config({}),
                me.button1.config({})
            ]
        });
    }
}

var editableDiv = document.getElementById('editableDiv');

function handlepaste(e) {
    var types, pastedData, savedContent;
debugger;
    // Browsers that support the 'text/html' type in the Clipboard API (Chrome, Firefox 22+)
    if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {

        // Check for 'text/html' in types list. See abligh's answer below for deatils on
        // why the DOMStringList bit is needed
        types = e.clipboardData.types;
        if (((types instanceof DOMStringList) && types.contains("text/html")) ||
            (types.indexOf && types.indexOf('text/html') !== -1)) {

            // Extract data and pass it to callback
            pastedData = e.clipboardData.getData('text/html');
            processPaste(editableDiv, pastedData);

            // Stop the data from actually being pasted
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    }

    // Everything else: Move existing element contents to a DocumentFragment for safekeeping
    savedContent = document.createDocumentFragment();
    while (editableDiv.childNodes.length > 0) {
        savedContent.appendChild(editableDiv.childNodes[0]);
    }

    // Then wait for browser to paste content into it and cleanup
    waitForPastedData(editableDiv, savedContent);
    return true;
}

function waitForPastedData(elem, savedContent) {
  
    // If data has been processes by browser, process it
    if (elem.childNodes && elem.childNodes.length > 0) {

        // Retrieve pasted content via innerHTML
        // (Alternatively loop through elem.childNodes or elem.getElementsByTagName here)
        var pastedData = elem.innerHTML;
      
        // Restore saved content
        elem.innerHTML = "";
        elem.appendChild(savedContent);

        // Call callback
        processPaste(elem, pastedData);
    }

    // Else wait 20ms and try again
    else {
        setTimeout(function () {
            waitForPastedData(elem, savedContent)
        }, 20);
    }
}

function processPaste(elem, pastedData) {
    // Do whatever with gathered data;
    alert(pastedData);
    elem.focus();
}




export async function test() {
    var ret = new Dialog2();
    ret.dom.contentEditable = "true";
    
    /*ret.dom.onpaste = (ev) => {
        ev.preventDefault();
        console.log(ev);
    };*/
    for (var x = 0; x < ret._components.length; x++) {
        var ent = ret._components[x];
        var text = document.createTextNode("hallo");
        ent.domWrapper.parentNode.insertBefore(text, ent.domWrapper);

        ent.domWrapper.contentEditable = "false";

    };
    $(ret.dom).bind('cut', function(e){ e.preventDefault();console.log(e);});
    windows.add(ret, "toll")
    // Modern browsers. Note: 3rd argument is required for Firefox <= 6
    if ( ret.dom.addEventListener) {
         ret.dom.addEventListener('paste', handlepaste, false);
    }
    //return ret;
}