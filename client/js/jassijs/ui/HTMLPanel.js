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
        constructor(id = undefined) {
            super();
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.inited = false;
            this.customToolbarButtons = {};
            super.init('<div class="HTMLPanel mce-content-body" tabindex="-1" ><div class="HTMLPanelContent"> </div></div>'); //tabindex for key-event
            //$(this.domWrapper).removeClass("jcontainer");
            //  super.init($('<div class="HTMLPanel"></div>')[0]);
            var el = this.dom.children[0];
            this._designMode = false;
            this.newlineafter = false;
            // $(this.__dom).css("min-width", "10px");
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
            var editor = this.editor;
            var _this = this;
            var text = _this.dom.firstElementChild.innerHTML;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRNTFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy91aS9IVE1MUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUM7SUF5QjNCLElBQWEsU0FBUyxpQkFBdEIsTUFBYSxTQUFVLFNBQVEsNkJBQWE7UUFjeEM7OztZQUdJO1FBQ0osWUFBWSxFQUFFLEdBQUcsU0FBUztZQUN0QixLQUFLLEVBQUUsQ0FBQztZQWhCWixZQUFPLEdBQUcsQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBRy9ELFdBQU0sR0FBRyxLQUFLLENBQUM7WUFFdkIseUJBQW9CLEdBS2hCLEVBQUUsQ0FBQztZQU9ILEtBQUssQ0FBQyxJQUFJLENBQUMsb0dBQW9HLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtZQUMxSSwrQ0FBK0M7WUFDL0Msc0RBQXNEO1lBQ3RELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLDBDQUEwQztRQUM5QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQXVCO1lBQzFCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUlELElBQUksWUFBWTtZQUNaLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLGNBQWMsQ0FBQztRQUNyRCxDQUFDO1FBQ0QsSUFBSSxZQUFZLENBQUMsS0FBSztZQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGNB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QztLQUNKLENBQUE7SUFsTUc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxXQUFXLEVBQUUsMEJBQTBCLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDOzs7aURBR3RFO0lBYUQ7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxVQUFVLEVBQUUsaUVBQWlFLEVBQUUsQ0FBQzs7OzZDQUc1RjtJQWdDRDtRQURDLElBQUEsb0JBQVMsR0FBRTs7OzBDQUlYO0lBdkZRLFNBQVM7UUFGckIsSUFBQSx3QkFBWSxFQUFDLEVBQUUsUUFBUSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxvQ0FBb0MsRUFBRSxDQUFDO1FBQy9HLElBQUEsaUJBQU0sRUFBQyxzQkFBc0IsQ0FBQzs7T0FDbEIsU0FBUyxDQXFPckI7SUFyT1ksOEJBQVM7SUFzT3RCLFNBQWdCLElBQUk7UUFDaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUMxQixHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxHQUFHO1lBQzdCLEtBQUssRUFBRSxPQUFPO1lBQ2QsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUIsQ0FBQztRQUlGLEdBQUcsQ0FBQyxLQUFLLEdBQUcsK1NBQStTLENBQUM7UUFDNVQsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDakIsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDaEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBYkQsb0JBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYnVndGlueW1jZSA9IHVuZGVmaW5lZDtcbmltcG9ydCB7IENvbXBvbmVudCwgJFVJQ29tcG9uZW50LCBDb21wb25lbnRDb25maWcgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IHsgUHJvcGVydHksICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBEYXRhQ29tcG9uZW50LCBEYXRhQ29tcG9uZW50Q29uZmlnIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YUNvbXBvbmVudFwiO1xuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBKUXVlcnkge1xuICAgICAgICBkb3VibGV0YXA6IGFueTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSFRNTFBhbmVsQ29uZmlnIGV4dGVuZHMgRGF0YUNvbXBvbmVudENvbmZpZyB7XG5cbiAgICBuZXdsaW5lYWZ0ZXI/OiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogdGVtcGxhdGUgc3RyaW5nICBjb21wb25lbnQudmFsdWU9bmV3IFBlcnNvbigpO2NvbXBvbmVudC50ZW1wbGF0ZTpcInt7bmFtZX19XCJ9XG4gICAgICovXG4gICAgdGVtcGxhdGU/OiBzdHJpbmc7XG4gICAgdmFsdWU/OiBzdHJpbmc7XG5cbn1cblxuQCRVSUNvbXBvbmVudCh7IGZ1bGxQYXRoOiBcImNvbW1vbi9IVE1MUGFuZWxcIiwgaWNvbjogXCJtZGkgbWRpLWNsb3VkLXRhZ3NcIiAvKiwgaW5pdGlhbGl6ZTogeyB2YWx1ZTogXCJ0ZXh0XCIgfSAqLyB9KVxuQCRDbGFzcyhcImphc3NpanMudWkuSFRNTFBhbmVsXCIpXG5leHBvcnQgY2xhc3MgSFRNTFBhbmVsIGV4dGVuZHMgRGF0YUNvbXBvbmVudCBpbXBsZW1lbnRzIEhUTUxQYW5lbENvbmZpZyB7XG4gICAgc3RhdGljIG9sZGVkaXRvcjtcbiAgICBwcml2YXRlIF90Y207XG4gICAgdG9vbGJhciA9IFsnYm9sZCBpdGFsaWMgdW5kZXJsaW5lIGZvcmVjb2xvciBiYWNrY29sb3IgZm9udHNpemVzZWxlY3QnXTtcbiAgICBwcml2YXRlIF90ZW1wbGF0ZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3ZhbHVlO1xuICAgIHByaXZhdGUgaW5pdGVkID0gZmFsc2U7XG4gICAgZWRpdG9yO1xuICAgIGN1c3RvbVRvb2xiYXJCdXR0b25zOiB7XG4gICAgICAgIFtuYW1lOiBzdHJpbmddOiB7XG4gICAgICAgICAgICB0aXRsZTogc3RyaW5nO1xuICAgICAgICAgICAgYWN0aW9uOiBhbnk7XG4gICAgICAgIH07XG4gICAgfSA9IHt9O1xuICAgIC8qW1xuICAgICAgICAndW5kbyByZWRvIHwgYm9sZCBpdGFsaWMgdW5kZXJsaW5lIHwgZm9udHNpemVzZWxlY3QnLCAvL2ZvbnRzZWxlY3RcbiAgICAgICAgJ2ZvcmVjb2xvciBiYWNrY29sb3IgfCBudW1saXN0IGJ1bGxpc3Qgb3V0ZGVudCBpbmRlbnQnXG4gICAgXTsqL1xuICAgIGNvbnN0cnVjdG9yKGlkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHN1cGVyLmluaXQoJzxkaXYgY2xhc3M9XCJIVE1MUGFuZWwgbWNlLWNvbnRlbnQtYm9keVwiIHRhYmluZGV4PVwiLTFcIiA+PGRpdiBjbGFzcz1cIkhUTUxQYW5lbENvbnRlbnRcIj4gPC9kaXY+PC9kaXY+Jyk7IC8vdGFiaW5kZXggZm9yIGtleS1ldmVudFxuICAgICAgICAvLyQodGhpcy5kb21XcmFwcGVyKS5yZW1vdmVDbGFzcyhcImpjb250YWluZXJcIik7XG4gICAgICAgIC8vICBzdXBlci5pbml0KCQoJzxkaXYgY2xhc3M9XCJIVE1MUGFuZWxcIj48L2Rpdj4nKVswXSk7XG4gICAgICAgIHZhciBlbCA9IHRoaXMuZG9tLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLl9kZXNpZ25Nb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubmV3bGluZWFmdGVyID0gZmFsc2U7XG4gICAgICAgIC8vICQodGhpcy5fX2RvbSkuY3NzKFwibWluLXdpZHRoXCIsIFwiMTBweFwiKTtcbiAgICB9XG4gICAgY29uZmlnKGNvbmZpZzogSFRNTFBhbmVsQ29uZmlnKTogSFRNTFBhbmVsIHtcbiAgICAgICAgc3VwZXIuY29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuXG4gICAgQCRQcm9wZXJ0eSh7IGRlc2NyaXB0aW9uOiBcImxpbmUgYnJlYWsgYWZ0ZXIgZWxlbWVudFwiLCBkZWZhdWx0OiBmYWxzZSB9KVxuICAgIGdldCBuZXdsaW5lYWZ0ZXIoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbS5zdHlsZS5kaXNwbGF5ID09PSBcImlubGluZS1ibG9ja1wiO1xuICAgIH1cbiAgICBzZXQgbmV3bGluZWFmdGVyKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZSA/IFwiXCIgOiBcImlubGluZS1ibG9ja1wiO1xuICAgICAgICAoPEhUTUxFbGVtZW50PnRoaXMuZG9tLmNoaWxkcmVuWzBdKS5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyBcIlwiIDogXCJpbmxpbmUtYmxvY2tcIjtcbiAgICB9XG4gICAgY29tcGlsZVRlbXBsYXRlKHRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ29iaicsICd3aXRoKG9iail7IHJldHVybiBcXCcnICtcbiAgICAgICAgICAgIHRlbXBsYXRlLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKS5zcGxpdCgve3soW157fV0rKX19L2cpLm1hcChmdW5jdGlvbiAoZXhwcmVzc2lvbiwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpICUgMiA/ICgnXFwnKygnICsgZXhwcmVzc2lvbi50cmltKCkgKyAnKStcXCcnKSA6IGV4cHJlc3Npb247XG4gICAgICAgICAgICB9KS5qb2luKCcnKSArXG4gICAgICAgICAgICAnXFwnOyB9Jyk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBkZWNyaXB0aW9uOiAnZS5nLiBjb21wb25lbnQudmFsdWU9bmV3IFBlcnNvbigpO2NvbXBvbmVudC50ZW1wbGF0ZTpcInt7bmFtZX19XCInIH0pXG4gICAgZ2V0IHRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZTtcbiAgICB9XG4gICAgc2V0IHRlbXBsYXRlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7IC8vcmVmb3JtYXQgdmFsdWVcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBjb2RlIC0gaHRtbGNvZGUgb2YgdGhlIGNvbXBvbmVudFxuICAgICAqKi9cbiAgICBzZXQgdmFsdWUoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBzY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gY29kZTtcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHNjb2RlID0gXCJcIjtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb2RlID0gdGhpcy5jb21waWxlVGVtcGxhdGUodGhpcy50ZW1wbGF0ZSkoY29kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvZGUgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsOiBhbnkgPSB0aGlzLmRvbS5jaGlsZHJlblswXTtcbiAgICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc2NvZGUpO1xuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IHNjb2RlO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KClcbiAgICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICAgIGV4dGVuc2lvbkNhbGxlZChhY3Rpb246IEV4dGVuc2lvbkFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldERlc2lnbk1vZGUoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZS5lbmFibGUsIGFjdGlvbi5jb21wb25lbnREZXNpZ25lclNldERlc2lnbk1vZGUuY29tcG9uZW50RGVzaWduZXIpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmV4dGVuc2lvbkNhbGxlZChhY3Rpb24pO1xuICAgIH1cbiAgICBpbml0SWZOZWVkZWQodGlueW1jZSwgY29uZmlnKSB7XG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgIGxldCBzaWMgPSBfdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIF90aGlzLl90Y20gPSB0aW55bWNlLmluaXQoY29uZmlnKTsgLy9jaGFuZ2VzIHRoZSB0ZXh0IHRvIDxicj4gaWYgZW1wdHkgLSB3aHk/XG4gICAgICAgICAgICBpZiAoc2ljID09PSBcIlwiICYmIF90aGlzLnZhbHVlICE9PSBzaWMpXG4gICAgICAgICAgICAgICAgX3RoaXMudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gZWRpLnNob3coKTtcbiAgICAgICAgICAgIC8vIGVkaS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHVibGljIGZvY3VzTG9zdCgpIHtcbiAgICAgICAgdmFyIGVkaXRvciA9IHRoaXMuZWRpdG9yO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgdGV4dCA9IF90aGlzLmRvbS5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUw7XG4gICAgICAgIGlmICh0ZXh0ID09PSAnPGJyIGRhdGEtbWNlLWJvZ3VzPVwiMVwiPicpXG4gICAgICAgICAgICB0ZXh0ID0gXCJcIjtcbiAgICAgICAgZWRpdG9yLl9wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZShcInZhbHVlXCIsICdcIicgKyB0ZXh0LnJlcGxhY2VBbGwoJ1wiJywgXCInXCIpICsgJ1wiJywgdHJ1ZSk7XG5cblxuICAgICAgICBpZiAoX3RoaXMuX2Rlc2lnbk1vZGUgPT09IGZhbHNlKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvL2VkaXRvci5lZGl0RGlhbG9nKGZhbHNlKTtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlZGl0b3IuaWQpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBlZGl0b3IuX2RyYWdhbmRkcm9wcGVyLmVuYWJsZURyYWdnYWJsZSh0cnVlKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBfaW5pdFRpbnltY2UoZWRpdG9yKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciB0aW55bWNlID0gd2luZG93W1widGlueW1jZVwiXTsgLy9vZGVyIHRpbnltY2VsaWIuZGVmYXVsdFxuICAgICAgICBjb25zb2xlLmxvZyhcInJ1biBjb25maWdcIik7XG4gICAgICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgICAgICAvL1x0ICAgICAgICAgICAgICAgIHZhbGlkX2VsZW1lbnRzOiAnc3Ryb25nLGVtLHNwYW5bc3R5bGVdLGFbaHJlZl0sdWwsb2wsbGknLFxuICAgICAgICAgICAgLy8gIHZhbGlkX3N0eWxlczoge1xuICAgICAgICAgICAgLy8gICAgJyonOiAnZm9udC1zaXplLGZvbnQtZmFtaWx5LGNvbG9yLHRleHQtZGVjb3JhdGlvbix0ZXh0LWFsaWduJ1xuICAgICAgICAgICAgLy8gIH0sXG4gICAgICAgICAgICBtZW51YmFyOiBmYWxzZSxcbiAgICAgICAgICAgIC8vc3RhdHVzYmFyOiBmYWxzZSxcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnIycgKyBfdGhpcy5faWQsXG4gICAgICAgICAgICBmb250c2l6ZV9mb3JtYXRzOiBcIjhweCAxMHB4IDEycHggMTRweCAxOHB4IDI0cHggMzZweFwiLFxuICAgICAgICAgICAgaW5saW5lOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRfdG9vbGJhcl9jb250YWluZXI6ICcjJyArIHRoaXMuZWRpdG9yLmlubGluZUVkaXRvclBhbmVsLl9pZCxcbiAgICAgICAgICAgIHNldHVwOiBmdW5jdGlvbiAoZWQpIHtcbiAgICAgICAgICAgICAgICBlZC5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlZC5vbignZm9jdXMnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICQoZWQuZ2V0Q29udGFpbmVyKCkpLmNzcyhcImRpc3BsYXlcIiwgXCJpbmxpbmVcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgZGVidWdnZXI7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZWQub24oJ2JsdXInLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5mb2N1c0xvc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgLy9lZGl0b3IuZWRpdERpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlZC5vbignTm9kZUNoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gJChlZC5nZXRDb250YWluZXIoKSkuZmluZChcInN2Z1wiKS5hdHRyKFwid2lkdGhcIiwgXCIxNlwiKS5hdHRyKFwiaGVpZ2h0XCIsIFwiMTZcIikuYXR0cihcInZpZXdib3hcIiwgXCIwIDAgMjQgMjRcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vJChlZC5nZXRDb250YWluZXIoKSkuY3NzKFwid2hpdGUtc3BhY2VcIixcIm5vd3JhcFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gX3RoaXMuY3VzdG9tVG9vbGJhckJ1dHRvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ0ID0gX3RoaXMuY3VzdG9tVG9vbGJhckJ1dHRvbnNbbmFtZV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBidXR0b247XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gZWQudWkucmVnaXN0cnkuYWRkQnV0dG9uKG5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGJ0LnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25BY3Rpb246IGZ1bmN0aW9uIChlLCBmKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJ0MiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnQuYWN0aW9uKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ucG9zdHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG15dG9vbGJhcndpZHRoID0gMjQwO1xuICAgICAgICBjb25zb2xlLmxvZyhcImZpeCBDb21wb25lbnQgd2lkdGggaW4gdGlueVwiKVxuICAgICAgICAvLyBpZiAoTnVtYmVyKF90aGlzLmVkaXRvci5pbmxpbmVFZGl0b3JQYW5lbC5fcGFyZW50LndpZHRoLnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgLSBOdW1iZXIoX3RoaXMuZWRpdG9yLmlubGluZUVkaXRvclBhbmVsLl9wYXJlbnQuX2NvbXBvbmVudHNbMF0ud2lkdGgucmVwbGFjZShcInB4XCIsIFwiXCIpKSA8IG15dG9vbGJhcndpZHRoKSB7XG4gICAgICAgIC8vICAgICBkZWxldGUgY29uZmlnLmZpeGVkX3Rvb2xiYXJfY29udGFpbmVyO1xuICAgICAgICAvLyB9XG4gICAgICAgIGlmIChfdGhpc1tcInRvb2xiYXJcIl0pXG4gICAgICAgICAgICBjb25maWdbXCJ0b29sYmFyXCJdID0gX3RoaXNbXCJ0b29sYmFyXCJdO1xuICAgICAgICBmb3IgKHZhciBuYW1lIGluIF90aGlzLmN1c3RvbVRvb2xiYXJCdXR0b25zKSB7XG4gICAgICAgICAgICBjb25maWdbXCJ0b29sYmFyXCJdW2NvbmZpZ1tcInRvb2xiYXJcIl0ubGVuZ3RoIC0gMV0gPVxuICAgICAgICAgICAgICAgIGNvbmZpZ1tcInRvb2xiYXJcIl1bY29uZmlnW1widG9vbGJhclwiXS5sZW5ndGggLSAxXSArIFwiIHwgXCIgKyBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub24oXCJtb3VzZXVwXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuX2Rlc2lnbk1vZGUgPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGVkaXRvci5fZHJhZ2FuZGRyb3BwZXIuZW5hYmxlRHJhZ2dhYmxlKGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlZGkgPSB0aW55bWNlLmVkaXRvcnNbX3RoaXMuX2lkXTtcbiAgICAgICAgICAgIGlmIChlZGkuZ2V0Q29udGFpbmVyKCkpXG4gICAgICAgICAgICAgICAgKDxIVE1MRWxlbWVudD5lZGkuZ2V0Q29udGFpbmVyKCkpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICAgIC8vJCh0aGlzLmRvbVdyYXBwZXIpLmRyYWdnYWJsZSgnZGlzYWJsZScpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9fdGhpcy52YWx1ZT1zaWM7XG4gICAgICAgIC8qICAgICQoX3RoaXMuZG9tKS5kb3VibGV0YXAoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuX2Rlc2lnbk1vZGUgPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdElmTmVlZGVkKHRpbnltY2UsIGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgZWRpdG9yLl9kcmFnYW5kZHJvcHBlci5lbmFibGVEcmFnZ2FibGUoZmFsc2UpO1xuICAgICAgICAgICAgfSk7Ki9cbiAgICAgICAgX3RoaXMub24oJ2JsdXInLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5mb2N1c0xvc3QoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF90aGlzLm9uKCdmb2N1cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmluaXRJZk5lZWRlZCh0aW55bWNlLCBjb25maWcpO1xuICAgICAgICAgICAgdmFyIGVsID0gKDxIVE1MRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChfdGhpcy5lZGl0b3IuaW5saW5lRWRpdG9yUGFuZWwuX2lkKS5xdWVyeVNlbGVjdG9yKFwiLnRveC10aW55bWNlLWlubGluZVwiKSk7XG4gICAgICAgICAgICBpZiAoZWwpXG4gICAgICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKEhUTUxQYW5lbC5vbGRlZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAoPEhUTUxFbGVtZW50PkhUTUxQYW5lbC5vbGRlZGl0b3IuZ2V0Q29udGFpbmVyKCkpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGFjdGl2YXRlcyBvciBkZWFjdGl2YXRlcyBkZXNpZ25tb2RlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSB0cnVlIGlmIGFjdGl2YXRlIGRlc2lnbk1vZGVcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50RGVzaWduZXJ9IGVkaXRvciAtIGVkaXRvciBpbnN0YW5jZVxuICAgICAqL1xuICAgIF9zZXREZXNpZ25Nb2RlKGVuYWJsZSwgZWRpdG9yKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9kZXNpZ25Nb2RlID0gZW5hYmxlO1xuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFjdGl2YXRlIHRpbnlcIik7XG4gICAgICAgICAgICByZXF1aXJlanMoW1wiamFzc2lqcy9leHQvdGlueW1jZVwiXSwgZnVuY3Rpb24gKHRpbnltY2VsaWIpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5faW5pdFRpbnltY2UoZWRpdG9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IEhUTUxQYW5lbCgpO1xuICAgIHJldC5jdXN0b21Ub29sYmFyQnV0dG9ucy5UYWJsZSA9IHtcbiAgICAgICAgdGl0bGU6IFwiVGFibGVcIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7IGFsZXJ0KDgpOyB9XG4gICAgfTtcblxuXG5cbiAgICByZXQudmFsdWUgPSBcIjxzcGFuIHN0eWxlPSdmb250LXNpemU6IDEycHg7JyBkYXRhLW1jZS1zdHlsZT0nZm9udC1zaXplOiAxMnB4Oyc+ZHNmPHNwYW4gc3R5bGU9J2NvbG9yOiByZ2IoMjQxLCAxOTYsIDE1KTsnIGRhdGEtbWNlLXN0eWxlPSdjb2xvcjogI2YxYzQwZjsnPmc8c3Ryb25nPnNkZmdzZDwvc3Ryb25nPmZnc2RmZzwvc3Bhbj48L3NwYW4+PGJyPjxzdHJvbmc+PHNwYW4gc3R5bGU9J2NvbG9yOiByZ2IoMjQxLCAxOTYsIDE1KTsnIGRhdGEtbWNlLXN0eWxlPSdjb2xvcjogI2YxYzQwZjsnPnNkZmdzZGdzZGY8L3NwYW4+Z2Zkc2c8L3N0cm9uZz5cIjtcbiAgICByZXQuaGVpZ2h0ID0gNDAwO1xuICAgIHJldC53aWR0aCA9IDQwMDtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19