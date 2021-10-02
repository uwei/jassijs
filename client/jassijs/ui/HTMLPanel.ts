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
@$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ })
@$Class("jassijs.ui.HTMLPanel")
export class HTMLPanel extends DataComponent {
    private _tcm;
    toolbar = ['undo redo | bold italic underline | forecolor ', 'backcolor fontsizeselect'];
    private _template: string;
    private _value;
    private inited = false;
    customToolbarButtons: {
        [name: string]: {
            title: string,
            action: any;
        }
    } = {};
    /*[
        'undo redo | bold italic underline | fontsizeselect', //fontselect
        'forecolor backcolor | numlist bullist outdent indent'
    ];*/
    constructor(id = undefined) {
        super();
        super.init($('<div class="HTMLPanel mce-content-body" tabindex="-1"><div class="HTMLPanelContent"> </div></div>')[0]); //tabindex for key-event
        //$(this.domWrapper).removeClass("jcontainer");
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
        this.value = this.value; //reformat value
    }
    /**
     * @member {string} code - htmlcode of the component
     **/
    set value(code: string) {
        var scode = code;
        this._value = code;
        if (this.template) {
            if (this._value === undefined)
                scode = "";
            else {
                try {
                    scode = this.compileTemplate(this.template)(code);
                }
                catch (err) {
                    scode = err.message;
                }
            }
        }
        var el: any = this.dom.children[0];
        if (el === undefined) {
            el = document.createTextNode(scode);
            this.dom.appendChild(el);
        }
        else
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
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            return this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
        }
        super.extensionCalled(action);
    }
    initIfNeeded(tinymce, config) {
        let _this = this;
        if (!this.inited) {
            let sic = _this.value;
            _this._tcm = tinymce.init(config); //changes the text to <br> if empty - why?
            if (sic === "" && _this.value !== sic)
                _this.value = "";
            this.inited = true;

            // edi.show();
            // edi.hide();
        }
    }
    private _initTinymce(editor) {
        var _this = this;
        var tinymce = window["tinymce"]; //oder tinymcelib.default
        var config = {
            //	                valid_elements: 'strong,em,span[style],a[href],ul,ol,li',
            //  valid_styles: {
            //    '*': 'font-size,font-family,color,text-decoration,text-align'
            //  },
            menubar: false,
            //statusbar: false,
            selector: '#' + _this._id,
            fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
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
                for (var name in _this.customToolbarButtons) {
                    var bt = _this.customToolbarButtons[name];
                    ed.ui.registry.addButton(name, {
                        text: bt.title,
                        onAction: function (e) {
                            bt.action(e);
                        }
                    });
                }
            }
        };
        if (_this["toolbar"])
            config["toolbar"] = _this["toolbar"];
        for (var name in _this.customToolbarButtons) {
            config["toolbar"][config["toolbar"].length - 1] =
                config["toolbar"][config["toolbar"].length - 1] + " | " + name;
        }
        //_this.value=sic;
        $(_this.dom).doubletap(function (e) {
            if (_this._designMode === false)
                return;
            _this.initIfNeeded(tinymce, config);
            editor._draganddropper.enableDraggable(false);
        });
        $(_this.dom).on('blur', function () {
            setTimeout(() => {
                let edi = tinymce.editors[_this._id];
                $(edi?.container).css("display", "none");
            }, 500);
        });
        $(_this.dom).on('focus', function () {
            _this.initIfNeeded(tinymce, config);
            setTimeout(() => {
                //let edi = tinymce.editors[_this._id];
                //edi.selection.select(edi.getBody(), true);
            }, 10);
        });
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
            // console.log("activate tiny");
            requirejs(["jassijs/ext/tinymce"], function (tinymcelib) {
                _this._initTinymce(editor);
            });
        }
    }
    destroy() {
        super.destroy();
    }
}
export function test() {
    var ret = new HTMLPanel();
    ret.customToolbarButtons.Table={
        title: "Table",
        action: () => { alert(8); }
    };
    ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsfg<strong>sdfgsd</strong>fgsdfg</span><br>";
    return ret;
}
