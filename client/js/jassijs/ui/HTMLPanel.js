var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Component_1, Registry_1, Property_1, DataComponent_1) {
    "use strict";
    var HTMLPanel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HTMLPanel = void 0;
    var bugtinymce = undefined;
    let HTMLPanel = HTMLPanel_1 = class HTMLPanel extends DataComponent_1.DataComponent {
        /*[
            'undo redo | bold italic underline | fontsizeselect', //fontselect
            'forecolor backcolor | numlist bullist outdent indent'
        ];*/
        constructor(properties = {}) {
            super();
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.inited = false;
            this.customToolbarButtons = {};
            //$(this.domWrapper).removeClass("jcontainer");
            //  super.init($('<div class="HTMLPanel"></div>')[0]);
            this._designMode = false;
            this.newlineafter = false;
            // $(this.__dom).css("min-width", "10px");
        }
        render() {
            return React.createElement("div", { className: "HTMLPanel mce-content-body", tabIndex: -1 },
                React.createElement("div", { className: "HTMLPanelContent" }, " "));
        }
        config(config) {
            super.config(config);
            return this;
        }
        get newlineafter() {
            return this.dom.style.display === "inline-block";
        }
        set newlineafter(value) {
            this.dom.style.display = value ? "" : "inline-block";
            this.domWrapper.style.display = value ? "" : "inline-block";
            this.dom.children[0].style.display = value ? "" : "inline-block";
        }
        compileTemplate(template) {
            return new Function('obj', 'with(obj){ return \'' +
                template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                    return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
                }).join('') +
                '\'; }');
        }
        get template() {
            return this._template;
        }
        set template(value) {
            this._template = value;
            this.value = this.value; //reformat value
        }
        /**
         * @member {string} code - htmlcode of the component
         **/
        set value(code) {
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
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(scode);
                this.dom.appendChild(el);
            }
            else
                el.innerHTML = scode;
        }
        get value() {
            return this._value;
        }
        extensionCalled(action) {
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
        focusLost() {
            var _a, _b;
            var editor = this.editor;
            var _this = this;
            var text = (_b = (_a = _this.dom) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.innerHTML;
            if (text === '<br data-mce-bogus="1">')
                text = "";
            editor._propertyEditor.setPropertyInCode("value", '"' + text.replaceAll('"', "'") + '"', true);
            if (_this._designMode === false)
                return;
            //editor.editDialog(false);
            if (!document.getElementById(editor.id))
                return;
            editor._draganddropper.enableDraggable(true);
        }
        _initTinymce(editor) {
            var _this = this;
            var tinymce = window["tinymce"]; //oder tinymcelib.default
            console.log("run config");
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
                fixed_toolbar_container: '#' + this.editor.inlineEditorPanel._id,
                setup: function (ed) {
                    ed.on('change', function (e) {
                    });
                    ed.on('focus', function (e) {
                        //   $(ed.getContainer()).css("display", "inline");
                        //   debugger;
                    });
                    ed.on('blur', function (e) {
                        _this.focusLost();
                        //editor.editDialog(true);
                    });
                    ed.on('NodeChange', function (e) {
                        // $(ed.getContainer()).find("svg").attr("width", "16").attr("height", "16").attr("viewbox", "0 0 24 24");
                        //$(ed.getContainer()).css("white-space","nowrap");
                    });
                    for (var name in _this.customToolbarButtons) {
                        var bt = _this.customToolbarButtons[name];
                        var button;
                        var test = ed.ui.registry.addButton(name, {
                            text: bt.title,
                            onAction: function (e, f) {
                                var bt2 = this;
                                bt.action(e);
                            },
                            onpostrender: function () {
                                button = this;
                            }
                        });
                    }
                }
            };
            var mytoolbarwidth = 240;
            console.log("fix Component width in tiny");
            // if (Number(_this.editor.inlineEditorPanel._parent.width.replace("px", "")) - Number(_this.editor.inlineEditorPanel._parent._components[0].width.replace("px", "")) < mytoolbarwidth) {
            //     delete config.fixed_toolbar_container;
            // }
            if (_this["toolbar"])
                config["toolbar"] = _this["toolbar"];
            for (var name in _this.customToolbarButtons) {
                config["toolbar"][config["toolbar"].length - 1] =
                    config["toolbar"][config["toolbar"].length - 1] + " | " + name;
            }
            this.on("mouseup", (e) => {
                if (_this._designMode === false)
                    return;
                editor._draganddropper.enableDraggable(false);
                let edi = tinymce.editors[_this._id];
                if (edi.getContainer())
                    edi.getContainer().style.display = "flex";
                //$(this.domWrapper).draggable('disable');
            });
            //_this.value=sic;
            /*    $(_this.dom).doubletap(function (e) {
                    if (_this._designMode === false)
                        return;
                    _this.initIfNeeded(tinymce, config);
                    editor._draganddropper.enableDraggable(false);
                });*/
            _this.on('blur', function () {
                _this.focusLost();
            });
            _this.on('focus', function () {
                _this.initIfNeeded(tinymce, config);
                var el = document.getElementById(_this.editor.inlineEditorPanel._id).querySelector(".tox-tinymce-inline");
                if (el)
                    el.style.display = "none";
                if (HTMLPanel_1.oldeditor) {
                    HTMLPanel_1.oldeditor.getContainer().style.display = "none";
                }
            });
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         * @param {jassijs.ui.ComponentDesigner} editor - editor instance
         */
        _setDesignMode(enable, editor) {
            this.editor = editor;
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
    };
    __decorate([
        (0, Property_1.$Property)({ description: "line break after element", default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel.prototype, "newlineafter", null);
    __decorate([
        (0, Property_1.$Property)({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "template", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "value", null);
    HTMLPanel = HTMLPanel_1 = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ }),
        (0, Registry_1.$Class)("jassijs.ui.HTMLPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel);
    exports.HTMLPanel = HTMLPanel;
    function test() {
        var ret = new HTMLPanel();
        ret.customToolbarButtons.Table = {
            title: "Table",
            action: () => { alert(8); }
        };
        ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
        ret.height = 400;
        ret.width = 400;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=HTMLPanel.js.map