import {Panel} from "jassijs/ui/Panel";
import {BoxPanel} from "jassijs/ui/BoxPanel";
import {HTMLPanel} from "jassijs/ui/HTMLPanel";
import {Button} from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Jassi";
import {Component} from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import {Textbox} from "jassijs/ui/Textbox";


class Me{
    boxpanel1? :BoxPanel;
    htmlpanel1?:HTMLPanel;
    buttons? :BoxPanel;
    inputText?:Textbox;
    propertyEditor?:any;

}
export interface DialogResult{
	button:string;
	text?:string;
	properties?:any;
}

@$Class("jassijs.ui.OptionDialog")
export class OptionDialog extends Panel {
    parentComponent:Component;
    @$Property()
    text:string;
    options:string[];
    selectedOption:string;
    me:Me;
	
   

    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties=undefined) {//id connect to existing(not reqired)
        super(properties);
        this.parentComponent = undefined;
        this.text = "";
        this.options = [];
        this.selectedOption = "cancel";
        /* @member {string} - the text for the Dialog*/

    }
    layout() {
        var me:Me = this.me = {};
        var _this = this;
        me.boxpanel1 = new BoxPanel();
        me.htmlpanel1 = new HTMLPanel();
        me.buttons = new BoxPanel();
        me.buttons.horizontal = true;
        me.htmlpanel1.value = this.text;
        this.add(me.boxpanel1);
        this.add(me.buttons);
        me.htmlpanel1.value = "";
        me.boxpanel1.add(me.htmlpanel1);
        me.boxpanel1.width="100%";
        me.boxpanel1.height="calc(100% - 50px)";
        me.inputText=new Textbox();
        me.boxpanel1.add(me.inputText);
        
        for (var x = 0; x < this.options.length; x++) {
            var button = new Button();
            me.buttons.add(button);
            button.onclick(function (evt) {
                _this.selectedOption = evt.currentTarget._this.text;
                $(_this.dom).dialog("close");
            });
            button.text = this.options[x];
        }

    }
    /**
    * ask for properties in propertygrid 
    * @param text - the text to be displayed
    * @param  properties - the properties which should be filled, marked by @$Property
    * @param  options - the options e.g ["ok","Cancel"]
    * @param parent - the parent component
    * @param modal - display the dialog modal
    */
    static async askProperties(text:string, properties:any, options:string[], parent:Component=undefined, modal=false):Promise<DialogResult> {
    
    	return await OptionDialog._show(text,options,parent,modal,undefined,properties);
    }
    /**
    * @param text - the text to be displayed
    * @param  options - the options
    * @param parent - the parent component
    * @param modal - display the dialog modal
    * @param  inputDefaultText - if the user should input something
    * 
    */
    static async show(text:string, options:string[], parent:Component=undefined, modal:boolean=false,inputDefaultText:string=undefined):Promise<DialogResult> {
    
    	return await OptionDialog._show(text,options,parent,modal,inputDefaultText);
    }
    
    static async _show(text:string, options:string[], parent:Component, modal:boolean,inputDefaultText:string=undefined,properties=undefined):Promise<DialogResult> {
        var promise = new Promise<DialogResult>(function (resolve, reject) {
            var ret = new OptionDialog();
            var config:JQueryUI.DialogOptions = {};
            ret.options = options;
            ret.layout();
            ret.me.htmlpanel1.value=text;
            if(inputDefaultText===undefined){
            	ret.me.boxpanel1.remove(ret.me.inputText);
            	ret.me.inputText.destroy();
            	
            }else{
            	ret.me.inputText.value=inputDefaultText;
            
            	
            }
            if(properties!==undefined){
                import("jassijs/ui/PropertyEditor").then((lib:any)=>{
                    ret.me.propertyEditor=new lib.PropertyEditor(undefined);
                    ret.me.propertyEditor.width="100%";
                    ret.me.propertyEditor.height="100%";
                    ret.me.boxpanel1.add(ret.me.propertyEditor);
                    ret.me.propertyEditor.value=properties;
                    config.width="400";
                    config.height="400";
    
                });
            }
            config.beforeClose = function (event, ui) {
                resolve({button: ret.selectedOption,text:<string>ret.me.inputText.value,properties:properties});
            }
            if (modal)
                config.modal = modal;
            if (parent !== undefined)
                config.appendTo = "#" + parent._id;
            var dlg = $(ret.dom).dialog(config);

        });
        return await promise;
    }

}
@$Class("jassijs.ui.OptionDialogTestProp")
class Testprop{
	@$Property()
	visible:boolean;
	@$Property()
	text:string;
	
}
export async function test2() {
    var tet = await OptionDialog.show("Should I ask?", ["yes", "no"], undefined, false);
    if(tet.button==="yes"){
    	var age = await OptionDialog.show("Whats yout age?", ["ok", "cancel"], undefined, false,"18");
    	if(age.button==="ok")
	    	console.log(age.text);
	    var prop=new Testprop();
    	var ret2=await OptionDialog.askProperties("Please fill:",prop,["ok","cancel"])
    }
    
    //var ret=new jassijs.ui.Dialog();

    //return ret;
};


