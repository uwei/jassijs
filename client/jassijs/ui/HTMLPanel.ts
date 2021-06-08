
var bugtinymce = undefined;
import jassi from "jassijs/jassi";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { $Class } from "jassijs/remote/Jassi";
import { Property, $Property } from "jassijs/ui/Property";
import { DataComponent } from "jassijs/ui/DataComponent";
declare global {
    interface JQuery {
        doubletap: any;
    }
}
@$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags"/*, initialize: { value: "text" } */ })
@$Class("jassijs.ui.HTMLPanel")
export class HTMLPanel extends DataComponent {
    private _editAllowed: boolean;
    private _tcm;
    toolbar = ['undo redo | bold italic underline', 'forecolor backcolor | fontsizeselect  '];
    private _template: string;
    private _value;
    /*[
        'undo redo | bold italic underline | fontsizeselect', //fontselect 
        'forecolor backcolor | numlist bullist outdent indent'
    ];*/
    constructor(id = undefined) {//id connect to existing(not reqired)
        super();
        super.init($('<div class="HTMLPanel"><div class="HTMLPanelContent"> </div></div>')[0]);
        //  super.init($('<div class="HTMLPanel"></div>')[0]);
        var el = this.dom.children[0];
        this._designMode = false;
        this.newlineafter = false;
        // $(this.__dom).css("min-width", "10px");
    }
    @$Property({ description: "line break after element", default: false })
    get newlineafter(): boolean {
        return $(this.dom).css("display") === "inline-block";
    }
    set newlineafter(value) {
        $(this.dom).css("display", value ? "" : "inline-block");
        $(this.dom.children[0]).css("display", value ? "" : "inline-block");
    }
    compileTemplate(template) {
        return new Function('obj', 'with(obj){ return \'' +
            template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
            }).join('') +
            '\'; }');

    }
    @$Property({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' })
    get template(): string {
        return this._template;
    }
    /**
     * template string  component.value=new Person();component.template:"{{name}}"}
     */
    set template(value: string) {
        this._template = value;
        this.value = this.value;//reformat value
    }
    /**
     * @member {string} code - htmlcode of the component
     **/
    set value(code: string) { //the Code
        var scode = code;
        this._value = code;
        if (this.template) {
            if (this._value === undefined)
                scode = "";
            else {
                try {
                    scode = this.compileTemplate(this.template)(code);
                } catch (err) {
                    scode = err.message;
                }
            }
        }
        var el: any = this.dom.children[0];
        if (el === undefined) {
            el = document.createTextNode(scode);
            this.dom.appendChild(el);
        } else
            $(el).html(scode);

    }
    @$Property()
    get value(): string {
        /*var el = this.dom.children[0];
        if (el === undefined)
            return "";
        var ret = $(el).html();
        return ret;*/
        return this._value;
    }
    /**
     * @member {boolean} - the component could be edited
     */
    set editAllowed(value) {
        /*	this._editAllowed=value;
            if(enable){
                requirejs(["tinymce"],function(){
                    _this._tcm=tinymce.init({
                        
                            //menubar: false,
                            //statusbar: false,
                            //toolbar: false,
                            selector: '#'+_this._id,//'.HTMLPanel',
                            inline: true,
                            setup:function(ed) {
                            	
                               ed.on('blur', function(e) {
                                            if($("#"+ed.id)[0]===undefined)
                                                return;
                                   var html=$("#"+ed.id)[0]._this;
                                   var text= ed.getContent();
                                   text='"'+text.substring(31,text.length-7).replaceAll("\"","\\\"")+'"';
                                   _this.value=text;
                               });
                           }
                        });
                    });
            }else{
                console.log("dest");
                tinymce.editors[_this._id].destroy();
            }*/
    }

    get editAllowed() {
        return this._editAllowed;
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            return this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
        }
        super.extensionCalled(action);
    }
   
    /**
     * activates or deactivates designmode
     * @param {boolean} enable - true if activate designMode
     * @param {jassijs.ui.ComponentDesigner} editor - editor instance
     */
    _setDesignMode(enable, editor) {
        var _this = this;
        this._designMode = enable;
        if (enable) {
            console.log("activate tiny");
            requirejs(["jassijs/ext/tinymce"], function (tinymcelib) {
                if (!bugtinymce) {//https://stackoverflow.com/questions/20008384/tinymce-how-do-i-prevent-br-data-mce-bogus-1-text-in-editor
                    const tinymceBind = window["tinymce"].DOM.bind;
                    window["tinymce"].DOM.bind = (target, name, func, scope) => {
                        // TODO This is only necessary until https://github.com/tinymce/tinymce/issues/4355 is fixed
                        if (name === 'mouseup' && func.toString().includes('throttle()')) {
                            return func;
                        } else {
                            return tinymceBind(target, name, func, scope);
                        }
                    };

                }
                var tinymce = window["tinymce"];//oder tinymcelib.default
                var config = {
                    //	                valid_elements: 'strong,em,span[style],a[href],ul,ol,li',
                    //  valid_styles: {
                    //    '*': 'font-size,font-family,color,text-decoration,text-align'
                    //  },
                    menubar: false,
                    //statusbar: false,

                    selector: '#' + _this._id,//'.HTMLPanel',
                    inline: true,
                    setup: function (ed) {
                        ed.on('change', function (e) {
                            var text = _this.dom.firstElementChild.innerHTML;
                            console.log(text);
                            if (text === '<br data-mce-bogus="1">')
                                text = "";
                            editor._propertyEditor.setPropertyInCode("value", '"' + text.replaceAll('"', "'") + '"', true);
                        });
                        ed.on('blur', function (e) {
                            if (_this._designMode === false)
                                return;
                            //editor.editDialog(false);
                            if ($("#" + ed.id)[0] === undefined)
                                return;
                            editor._draganddropper.enableDraggable(true);
                            //editor.editDialog(true);
                        });
                    }
                }
                if (_this["toolbar"])
                    config["toolbar"] = _this["toolbar"];
                var sic = _this.value;
                _this._tcm = tinymce.init(config);//changes the text to <br> if empty - why?
                if (sic === "" && _this.value !== sic)
                    _this.value = "";
                //_this.value=sic;
                $(_this.dom).doubletap(function (e) { //Editor Menu
                    if (_this._designMode === false)
                        return;
                    var sic = editor._draganddropper.draggableComponents;
                    editor._draganddropper.enableDraggable(false);


                    //	editor._draganddropper.uninstall();
                    //editor._resizer.uninstall();

                    /*   var sel = _this._id;
                       if (tinymce !== undefined && tinymce.editors[sel] !== undefined) {
                           //$(e.currentTarget.parentNode._this.domWrapper).draggable('disable');
                           tinymce.editors[sel].fire('focus');
                       }*/
                });
            });
        }//else
        //	tinymce.editors[_this._id].destroy();
    }
    destroy() {

        super.destroy();
    }
}

export function test(){
    var ret=new HTMLPanel();
    ret.value="Sample <b>Text</b>";
    return ret;
}
