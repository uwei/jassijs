import "jassijs/ext/jquerylib";
import "jquery.choosen";
import { $Class } from "jassijs/remote/Registry";
import { Component, $UIComponent, ComponentProperties, jc, createComponent, HTMLComponent, Ref } from "jassijs/ui/Component";
import { DataComponent, DataComponentProperties } from "jassijs/ui/DataComponent";
import { $Property } from "jassijs/ui/Property";
import { classes } from "jassijs/remote/Classes";
jassijs.includeCSSFile("chosen.css");
export interface SelectProperties extends DataComponentProperties {
    domProperties?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
    /**
      * called if value has changed
      * @param {function} handler - the function which is executed
      */
    onchange?(handler);
    /**
     * if the value is changed then the value of _component is also changed (_component.value)
     */
    selectComponent?: {
        value: number;
    }; //the Code
    /**
     * @member {string|function}  - property or function to get the displaystring for the object
     **/
    display?;
    /**
     * all objects in the list
     */
    items?: any[];
    /**
    * @member {object} sel - the selected object
    */
    value?;
    //@$Property({ default: false })
    multiple?: boolean;
    //@$Property({ default: false })
    allowDeselect?: boolean;
    //@$Property({default: "" })
    placeholder?: string;
}
type Refs = {
    select: HTMLComponent;
};
@$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" })
@$Class("jassijs.ui.Select")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.SelectProperties" })
export class Select<T extends SelectProperties = SelectProperties> extends DataComponent<T> {
    declare refs: Refs;
    //dom:Element; 
    _select: {
        value: number;
    };
    options;
    _display;
    _items;
    constructor(properties: SelectProperties = undefined) {
        super(properties);
        // super.init('<select class="Select"><option value=""></option></select>');
        var _this = this;
        if (properties !== undefined && properties.multiple === true)
            document.getElementById(this._id)["multiple"] = true;
        var single = false;
        if (properties !== undefined && properties.allowDeselect !== undefined)
            single = properties.allowDeselect;
        var placeholder = "Select...";
        if (properties !== undefined && properties.placeholder !== undefined)
            placeholder = properties.placeholder;
        $('#' + this._id).chosen({
            width: "100px",
            placeholder_text_single: placeholder,
            allow_single_deselect: single
        });
        var domSelect = this.dom;
        if (this.domWrapper.children.length == 1) { //mobile device
            this.dom = domSelect;
        }
        else
            this.dom = <HTMLElement>this.domWrapper.children[1];
        domSelect.setAttribute("id", "");
        this.dom.setAttribute("id", this._id);
        $(domSelect).chosen().change(function (e) {
            if (_this._select !== undefined)
                _this._select.value = _this.value;
            //e.data = _this.value;
            //handler(e);
        });
        // this.layout();
    }
    render() {
        //  super.init('<select class="Select"><option value=""></option></select>');
        return React.createElement("select", { 
            ref: this.refs.select,
            ...this.props.domProperties,
            className: "Select"
        }, React.createElement("option", {
            value: ""
        }));
    }
    config(config: T) {
        //width first else it doesnt work ?bug 
        if(config?.width)
            this.width=<any>config.width;
        super.config(config);
        return this;
    }
    refresh() {
        $(this.refs.select.dom).trigger("chosen:updated");
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onchange(handler) {
        var _this = this;
        $(this.refs.select.dom).chosen().change(function (e) {
            e.data = _this.value;
            handler(e);
        });
    }
    set selectComponent(_component: {
        value: number;
    }) {
        this._select = _component;
    }
    get selectComponent(): {
        value: number;
    } {
        return this._select; //$(this.dom).text();
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

    set items(value) {
        this._items = value;
        this.options = { undefined: undefined };
        if (this.refs.select.dom === undefined)
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
        var html = '<option value=""></option>';
        if(value!==undefined){
            for (var x = 0; x < value.length; x++) {
                var ob = value[x];
                var val = undefined;
                if (typeof (this.display) === "function")
                    val = this.display(ob);
                else if (this.display !== undefined)
                    val = ob[this.display];
                else
                    val = ob;
                this.options[x.toString()] = ob;
                html += '<option value="' + x + '">' + val + '</option>';
                //this.domSelect.appendChild(it);
            }
        }
        this.refs.select.dom.innerHTML = html;
        this.refresh();
    }
    get items() {
        return this._items;
    }
    set width(value: number) {
        var s = value + "px";
        $(this.refs.select.dom).chosen({ width: s });//.trigger("chosen:updated");
        var _this = this;
      //  setTimeout(() => $(_this.refs.select.dom).chosen({ width: s }), 1000);
      //  $(this.refs.select.dom).chosen().trigger("chosen:updated");
    }
    set value(sel) {
        var found = false;
        if ($(this.refs.select.dom).chosen().prop("multiple")) {
            var keys = [];
            if (sel) {
                sel.forEach((se) => {
                    for (var key in this.options) {
                        if (this.options[key] === se) {
                            keys.push(key);
                            found = true;
                            break;
                        }
                    }
                    $(this.refs.select.dom).val(keys).trigger("chosen:updated");
                });
            }
        }
        else {
            for (var key in this.options) {
                if (this.options[key] === sel) {
                    $(this.refs.select.dom).val(key).trigger("chosen:updated");
                    found = true;
                    break;
                }
            }
        }
        if (!found)
            $(this.refs.select.dom).val("").trigger("chosen:updated");
        // refresh()
    }
    get value() {
        if (this.options === undefined)
            return undefined;
        var val: any = $(this.refs.select.dom).chosen().val();
        if ($(this.refs.select.dom).chosen().prop("multiple")) {
            var opts = [];
            val.forEach((e) => {
                if (e !== "") //placeholder for empty
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
        $(this.refs.select.dom).chosen("destroy"); //.search_choices;
        $('#' + this._id).remove(); //.search_choices;
        $(this.refs.select.dom).remove();
        $(this.dom).remove();
        // this.refs.select.dom = undefined;
        super.destroy();
    }
}
export async function test() {
    var Panel = classes.getClass("jassijs.ui.Panel");
    var Button = classes.getClass("jassijs.ui.Button");
    var me: {
        sel?: Select;
    } = {};
    var pan = new Panel();
    var bt = new Button();
    bt.text = "wer";
    bt.onclick(function (event) {
        //	bt.text=me.sel.value.vorname;	
        me.sel.value = me.sel.items[1];
    });
    bt.height = 15;
    pan.width = 500;
    /* me.sel = new Select({
                            "multiple": false,
                        "placeholder": "Hallo",
                        "allowDeselect": false
      });
                        me.sel.display = "nachname";

                        me.sel.items=[{name:"Achim",nachname:"<b>Wenzel</b>"},
                        {name:"Anne",nachname:"Meier"}];


                        me.sel.width = 195;
                        me.sel.height = 25;
                        me.sel.onchange(function(event) {
                            alert(event.data.nachname);
      }); */
    var items = [{ name: "Achim", nachname: "<b>Wenzel</b>" },
    { name: "Anne", nachname: "Meier" }];
    var c = jc(Select, {
        items: items,
        display: "nachname",
       
        value:items[0],
         width: 500
    });
    me.sel = <any>createComponent(c);

    //	$('#'+sel._id).data("placeholder","Select2...").chosen({width: "200px"});
    pan.add(me.sel);
    var sel2=new Select({
        items:["jj","pp"],
        width:24
    })
    pan.add(sel2);
    
    pan.add(bt);
    return pan;
}

