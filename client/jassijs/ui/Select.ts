import "jassijs/ext/jquerylib";
import { $Class } from "jassijs/remote/Registry";
import {Component,  $UIComponent, ComponentProperties, ComponentProperties } from "jassijs/ui/Component";
import {DataComponent} from "jassijs/ui/DataComponent";
//import Button from "jassijs/ui/Button";
import "jquery.choosen";
//import {Panel} from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { classes } from "jassijs/remote/Classes";

jassijs.includeCSSFile("chosen.css");
export interface SelectConfig extends ComponentProperties{
   /**
     * called if value has changed
     * @param {function} handler - the function which is executed
     */
    onchange?(handler);
    /**
     * if the value is changed then the value of _component is also changed (_component.value)
     */
     selectComponent?:{value:number}; //the Code

    /**
     * @member {string|function}  - property or function to get the displaystring for the object
     **/
    display?;

    /**
     * all objects in the list
     */
    items?:any[];

     /**
     * @member {object} sel - the selected object
     */
    value?;
 }
@$Class("jassijs.ui.SelectCreateProperties")
class SelectCreateProperties extends ComponentProperties{
	@$Property({ default: false })
	multiple?:boolean;
	@$Property({ default: false })
	allowDeselect?:boolean;
	@$Property({default: "" })
	placeholder?:string;
}


@$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" })
@$Class("jassijs.ui.Select")
@$Property({ name: "new", type: "json",componentType:"jassijs.ui.SelectCreateProperties" })
export class Select extends DataComponent {
    domSelect: HTMLElement;
    //dom:Element;
    _select:{value:number};
    options;
    _display;
    _items;
    constructor(properties:SelectCreateProperties = undefined) {
        super();

        super.init('<select class="Select"><option value=""></option></select>');
        var _this=this;
        if (properties !== undefined && properties.multiple === true)
            document.getElementById(this._id)["multiple"]= true;
        var single = false;
        if (properties !== undefined && properties.allowDeselect !== undefined)
            single = properties.allowDeselect;
        var placeholder = "Select...";
        if (properties !== undefined && properties.placeholder !== undefined)
            placeholder = properties.placeholder;

        $('#' + this._id).chosen({
        	
           // width: "100px",
            placeholder_text_single: placeholder, 
            allow_single_deselect: single
        });
        this.domSelect = this.dom;
        if (this.domWrapper.children.length == 1) {//mobile device
            this.dom = this.domSelect;
        } else
            this.dom = <HTMLElement>this.domWrapper.children[1];
        this.domSelect.setAttribute("id","");
        this.dom.setAttribute("id", this._id);
        $(this.domSelect).chosen().change(function(e) {
        	if (_this._select !== undefined)
            	_this._select.value = _this.value;
            //e.data = _this.value;
            //handler(e);
        });
			

        // this.layout();
    }

    config(config:SelectConfig):Select {
        super.config(config);
        return this;
    }

    refresh() {
        $(this.domSelect).trigger("chosen:updated");
    }

    @$Property({ default: "function(event){\n\t\n}" })
    onchange(handler) {

        var _this = this;
        $(this.domSelect).chosen().change(function(e) {
        	
            e.data = _this.value;
            handler(e);
        });
    }
	 set selectComponent(_component:{value:number}) { //the Code
        this._select = _component;
    }
    get selectComponent():{value:number} {
        return this._select;//$(this.dom).text();
    }
    set display(value: string | Function) {
        this._display = value;
        if (this.items !== undefined)
            this.items = this.items;
    }
    @$Property({ type: "string" })
    get display(): string | Function {
        return this._display;
    }

    set items(value) { //the Code
		this._items=value;
        this.options = { undefined: undefined };
        if (this.domSelect === undefined)
            return;
        //TODO console.log("dekt.memoryleak");
        /* slow
        while (this.domSelect.firstChild) {
            $(this.domSelect.firstChild).remove();

        }
        this.domSelect.appendChild($('<option value=""></option>')[0]);
        for (var x = 0;x < value.length;x++) {
            var ob = value[x];
            var val = undefined;
            if (typeof (this.display) === "function")
                val = this.display(ob);
            else if (this.display !== undefined)
                val = ob[this.display];
            else
                val = ob;
            this.options[x.toString()] = ob;
            var it = $('<option value="' + x + '">' + val + '</option>')[0];
            this.domSelect.appendChild(it);
        }
        this.refresh();
*/
		 var html='<option value=""></option>';
		 for (var x = 0;x < value.length;x++) {
            var ob = value[x];
            var val = undefined;
            if (typeof (this.display) === "function")
                val = this.display(ob);
            else if (this.display !== undefined)
                val = ob[this.display];
            else
                val = ob;
            this.options[x.toString()] = ob;
            html+='<option value="' + x + '">' + val + '</option>';
            //this.domSelect.appendChild(it);
        }
        this.domSelect.innerHTML=html;
		 this.refresh();
    }
    get items() {
       return this._items;
    }

   
    set value(sel) {
    	var found=false;
    	if($(this.domSelect).chosen().prop("multiple")){
    		var keys=[];
    		if(sel){
	    		sel.forEach((se)=>{
		    		for (var key in this.options) {
			            if (this.options[key] === se) {
			            	keys.push(key);
			    			found=true;
			                break;
			            }
			        }
		    	    $(this.domSelect).val(keys).trigger("chosen:updated");
				});
    		}
    	}else{
	        for (var key in this.options) {
	            if (this.options[key] === sel) {
	                $(this.domSelect).val(key).trigger("chosen:updated");
					found=true;
	                break;
	            }
	        }
    	}
        if(!found)
        	$(this.domSelect).val("").trigger("chosen:updated");
        // refresh()
    }
    get value() {
        if (this.options === undefined)
            return undefined;
        var val:any=$(this.domSelect).chosen().val();
        if($(this.domSelect).chosen().prop("multiple")){
        	var opts=[];
        	val.forEach((e)=>{
        		if(e!=="")//placeholder for empty
	        		opts.push(this.options[<string>e]);
        	});
        	return opts;
        }	
        return this.options[<string>val];
    }
    /**
     * @member {string|number} - the width of the component 
     * e.g. 50 or "100%"
     */
    /* set width(value){ //the Code
         super.width=value;
     
          
          if(this.domWrapper.children.length>1){
             var val=$(this.domWrapper).css("width");
             $(this.domWrapper.children[1]).css("width",val);
          }
     }*/
    /**
     * binds a component to a databinder
     * @param {Databinder} databinder - the databinder to bind
     * @param {string} property - the property to bind
    
    bind(databinder,property){
        this._databinder=databinder;
        databinder.add(property,this,"onselect");
        databinder.checkAutocommit(this);
    } */

    destroy() {
        //	$(this.domSelect).chosen('destroy');
        $(this.domSelect).chosen("destroy");//.search_choices;
        $('#' + this._id).remove();//.search_choices;
        $(this.domSelect).remove();
        $(this.dom).remove();
        this.domSelect = undefined;
        super.destroy();
    }
}

export async function test() {
	

    var Panel = classes.getClass("jassijs.ui.Panel");
    var Button = classes.getClass("jassijs.ui.Button");

    var me: {sel?:Select} = {
    	
    };
    var pan = new Panel();
    var bt = new Button();
    var bt2 = new Button();
    me.sel = new Select({
        "multiple": false,
        "placeholder": "Hallo",
        "allowDeselect": false
    });
    bt.text = "wer";
    bt.onclick(function(event) {
        //	bt.text=me.sel.value.vorname;	
        me.sel.value = me.sel.items[1];
    });
    bt.height = 15;
    pan.width = 500;
    me.sel.display = "nachname";
	me.sel.items=[{name:"Achim",nachname:"<b>Wenzel</b>"},
					{name:"Anne",nachname:"Meier"}];
	var h=me.sel.items;
    me.sel.width = 195;
    me.sel.height = 25;
    me.sel.onchange(function(event) {
        alert(event.data.nachname);
    });

    //	$('#'+sel._id).data("placeholder","Select2...").chosen({width: "200px"});

    pan.add(me.sel);
    pan.add(bt);
    pan.add(bt2);
    return pan;

}


