import {Panel} from "jassi/ui/Panel";
import {BoxPanel} from "jassi/ui/BoxPanel";
import {HTMLPanel} from "jassi/ui/HTMLPanel";
import {Button} from "jassi/ui/Button";
import jassi, { $Class } from "jassi/remote/Jassi";
import {Component} from "jassi/ui/Component";
import { $Property } from "jassi/ui/Property";
import {Textbox} from "jassi/ui/Textbox";
import { PropertyEditor } from "jassi/ui/PropertyEditor";

class Me{
    boxpanel1? :BoxPanel;
    htmlpanel1?:HTMLPanel;
    buttons? :BoxPanel;
    inputText?:Textbox;
    propertyEditor?:PropertyEditor;

}
export interface DialogResult{
	button:string;
	text?:string;
	properties?:any;
}

@$Class("jassi.ui.OptionDialog")
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
        me.propertyEditor=new PropertyEditor(undefined);
        me.propertyEditor.width="100%";
        me.propertyEditor.height="100%";
        me.boxpanel1.add(me.propertyEditor);
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
            if(properties===undefined){
            	ret.me.boxpanel1.remove(ret.me.propertyEditor);
            	ret.me.propertyEditor.destroy();
            }else{
            	ret.me.propertyEditor.value=properties;
            	config.width="400";
            	config.height="400";
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
@$Class("jassi.ui.OptionDialogTestProp")
class Testprop{
	@$Property()
	visible:boolean;
	@$Property()
	text:string;
	
}
export async function test() {
    var tet = await OptionDialog.show("Should I ask?", ["yes", "no"], undefined, false);
    if(tet.button==="yes"){
    	var age = await OptionDialog.show("Whats yout age?", ["ok", "cancel"], undefined, false,"18");
    	if(age.button==="ok")
	    	console.log(age.text);
	    var prop=new Testprop();
    	var ret2=await OptionDialog.askProperties("Please fill:",prop,["ok","cancel"])
    }
    
    //var ret=new jassi.ui.Dialog();

    //return ret;
};


