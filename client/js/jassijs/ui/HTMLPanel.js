var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Component_1, Jassi_1, Property_1, DataComponent_1) {
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
            super.init($('<div class="HTMLPanel mce-content-body" tabindex="-1" ><div class="HTMLPanelContent"> </div></div>')[0]); //tabindex for key-event
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
                $(el).html(scode);
        }
        get value() {
            /*var el = this.dom.children[0];
            if (el === undefined)
                return "";
            var ret = $(el).html();
            return ret;*/
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
        _initTinymce(editor) {
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
                fixed_toolbar_container: '#' + this.editor.inlineEditorPanel._id,
                setup: function (ed) {
                    ed.on('change', function (e) {
                        var text = _this.dom.firstElementChild.innerHTML;
                        if (text === '<br data-mce-bogus="1">')
                            text = "";
                        editor._propertyEditor.setPropertyInCode("value", '"' + text.replaceAll('"', "'") + '"', true);
                    });
                    ed.on('focus', function (e) {
                        //   $(ed.getContainer()).css("display", "inline");
                        //   debugger;
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
            if (Number(_this.editor.inlineEditorPanel._parent.width.replace("px", "")) - Number(_this.editor.inlineEditorPanel._parent._components[0].width.replace("px", "")) < mytoolbarwidth) {
                delete config.fixed_toolbar_container;
            }
            if (_this["toolbar"])
                config["toolbar"] = _this["toolbar"];
            for (var name in _this.customToolbarButtons) {
                config["toolbar"][config["toolbar"].length - 1] =
                    config["toolbar"][config["toolbar"].length - 1] + " | " + name;
            }
            $(this.dom).on("mouseup", (e) => {
                if (_this._designMode === false)
                    return;
                editor._draganddropper.enableDraggable(false);
                let edi = tinymce.editors[_this._id];
                if (edi)
                    $(edi.getContainer()).css("display", "flex");
                //$(this.domWrapper).draggable('disable');
            });
            //_this.value=sic;
            /*    $(_this.dom).doubletap(function (e) {
                    if (_this._designMode === false)
                        return;
                    _this.initIfNeeded(tinymce, config);
                    editor._draganddropper.enableDraggable(false);
                });*/
            $(_this.dom).on('blur', function () {
                HTMLPanel_1.oldeditor = tinymce.editors[_this._id];
                editor._draganddropper.enableDraggable(true);
                setTimeout(() => {
                    let edi = tinymce.editors[_this._id];
                    //  $(edi?.getContainer()).css("display", "none");
                }, 100);
            });
            $(_this.dom).on('focus', function () {
                _this.initIfNeeded(tinymce, config);
                $('#' + _this.editor.inlineEditorPanel._id).find(".tox-tinymce-inline").css("display", "none");
                if (HTMLPanel_1.oldeditor) {
                    $(HTMLPanel_1.oldeditor.getContainer()).css("display", "none");
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
            /* if (enable) {
                 $(this.dom).on("mouseup", (e) => {
                     editor._draganddropper.enableDraggable(false);
                     //$(this.domWrapper).draggable('disable');
     
                 });
                 $(this.dom).on("blur", (e) => {
                     editor._draganddropper.enableDraggable(true);
     
                 });
             }
             return;*/
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
        (0, Jassi_1.$Class)("jassijs.ui.HTMLPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel);
    exports.HTMLPanel = HTMLPanel;
    function test() {
        var ret = new HTMLPanel();
        ret.customToolbarButtons.Table = {
            title: "Table",
            action: () => { alert(8); }
        };
        /*$(ret.dom).on("mouseup", (e) => {
            $(ret.domWrapper).draggable('disable');
            
        });*/
        $(ret.dom).on("blur", (e) => {
            $(ret.domWrapper).draggable('enable');
        });
        $(ret.dom).doubletap(function (e) {
            // if (_this._designMode === false)
            //      return;
            // _this.initIfNeeded(tinymce, config);
            var h = 9;
            //   ret.editor._draganddropper.enableDraggable(false);
        });
        ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
        ret.height = 25;
        ret.width = 107;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRNTFBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy91aS9IVE1MUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFBQSxJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUM7SUEwQjNCLElBQWEsU0FBUyxpQkFBdEIsTUFBYSxTQUFVLFNBQVEsNkJBQWE7UUFjeEM7OztZQUdJO1FBQ0osWUFBWSxFQUFFLEdBQUcsU0FBUztZQUN0QixLQUFLLEVBQUUsQ0FBQztZQWhCWixZQUFPLEdBQUcsQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1lBRy9ELFdBQU0sR0FBRyxLQUFLLENBQUM7WUFFdkIseUJBQW9CLEdBS2hCLEVBQUUsQ0FBQztZQU9ILEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLG9HQUFvRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtZQUNoSiwrQ0FBK0M7WUFDL0Msc0RBQXNEO1lBQ3RELElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLDBDQUEwQztRQUM5QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQXVCO1lBQzFCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUlELElBQUksWUFBWTtZQUNaLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssY0FBYyxDQUFDO1FBQ3pELENBQUM7UUFDRCxJQUFJLFlBQVksQ0FBQyxLQUFLO1lBQ2xCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENB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R0FBRyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDMUIsR0FBRyxDQUFDLG9CQUFvQixDQUFDLEtBQUssR0FBRztZQUM3QixLQUFLLEVBQUUsT0FBTztZQUNkLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlCLENBQUM7UUFDRjs7O2FBR0s7UUFDTCxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN4QixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUNILENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUM1QixtQ0FBbUM7WUFDbkMsZUFBZTtZQUNmLHVDQUF1QztZQUN2QyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVix1REFBdUQ7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsS0FBSyxHQUFHLCtTQUErUyxDQUFDO1FBQzVULEdBQUcsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQXhCRCxvQkF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYnVndGlueW1jZSA9IHVuZGVmaW5lZDtcbmltcG9ydCBqYXNzaSBmcm9tIFwiamFzc2lqcy9qYXNzaVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50LCAkVUlDb21wb25lbnQsIENvbXBvbmVudENvbmZpZyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSwgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IERhdGFDb21wb25lbnQsIERhdGFDb21wb25lbnRDb25maWcgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhQ29tcG9uZW50XCI7XG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEpRdWVyeSB7XG4gICAgICAgIGRvdWJsZXRhcDogYW55O1xuICAgIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBIVE1MUGFuZWxDb25maWcgZXh0ZW5kcyBEYXRhQ29tcG9uZW50Q29uZmlnIHtcblxuICAgIG5ld2xpbmVhZnRlcj86IGJvb2xlYW47XG5cbiAgICAvKipcbiAgICAgKiB0ZW1wbGF0ZSBzdHJpbmcgIGNvbXBvbmVudC52YWx1ZT1uZXcgUGVyc29uKCk7Y29tcG9uZW50LnRlbXBsYXRlOlwie3tuYW1lfX1cIn1cbiAgICAgKi9cbiAgICB0ZW1wbGF0ZT86IHN0cmluZztcbiAgICB2YWx1ZT86IHN0cmluZztcblxufVxuXG5AJFVJQ29tcG9uZW50KHsgZnVsbFBhdGg6IFwiY29tbW9uL0hUTUxQYW5lbFwiLCBpY29uOiBcIm1kaSBtZGktY2xvdWQtdGFnc1wiIC8qLCBpbml0aWFsaXplOiB7IHZhbHVlOiBcInRleHRcIiB9ICovIH0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5IVE1MUGFuZWxcIilcbmV4cG9ydCBjbGFzcyBIVE1MUGFuZWwgZXh0ZW5kcyBEYXRhQ29tcG9uZW50IGltcGxlbWVudHMgSFRNTFBhbmVsQ29uZmlnIHtcbiAgICBzdGF0aWMgb2xkZWRpdG9yO1xuICAgIHByaXZhdGUgX3RjbTtcbiAgICB0b29sYmFyID0gWydib2xkIGl0YWxpYyB1bmRlcmxpbmUgZm9yZWNvbG9yIGJhY2tjb2xvciBmb250c2l6ZXNlbGVjdCddO1xuICAgIHByaXZhdGUgX3RlbXBsYXRlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBfdmFsdWU7XG4gICAgcHJpdmF0ZSBpbml0ZWQgPSBmYWxzZTtcbiAgICBlZGl0b3I7XG4gICAgY3VzdG9tVG9vbGJhckJ1dHRvbnM6IHtcbiAgICAgICAgW25hbWU6IHN0cmluZ106IHtcbiAgICAgICAgICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgICAgICAgICBhY3Rpb246IGFueTtcbiAgICAgICAgfTtcbiAgICB9ID0ge307XG4gICAgLypbXG4gICAgICAgICd1bmRvIHJlZG8gfCBib2xkIGl0YWxpYyB1bmRlcmxpbmUgfCBmb250c2l6ZXNlbGVjdCcsIC8vZm9udHNlbGVjdFxuICAgICAgICAnZm9yZWNvbG9yIGJhY2tjb2xvciB8IG51bWxpc3QgYnVsbGlzdCBvdXRkZW50IGluZGVudCdcbiAgICBdOyovXG4gICAgY29uc3RydWN0b3IoaWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgc3VwZXIuaW5pdCgkKCc8ZGl2IGNsYXNzPVwiSFRNTFBhbmVsIG1jZS1jb250ZW50LWJvZHlcIiB0YWJpbmRleD1cIi0xXCIgPjxkaXYgY2xhc3M9XCJIVE1MUGFuZWxDb250ZW50XCI+IDwvZGl2PjwvZGl2PicpWzBdKTsgLy90YWJpbmRleCBmb3Iga2V5LWV2ZW50XG4gICAgICAgIC8vJCh0aGlzLmRvbVdyYXBwZXIpLnJlbW92ZUNsYXNzKFwiamNvbnRhaW5lclwiKTtcbiAgICAgICAgLy8gIHN1cGVyLmluaXQoJCgnPGRpdiBjbGFzcz1cIkhUTUxQYW5lbFwiPjwvZGl2PicpWzBdKTtcbiAgICAgICAgdmFyIGVsID0gdGhpcy5kb20uY2hpbGRyZW5bMF07XG4gICAgICAgIHRoaXMuX2Rlc2lnbk1vZGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5uZXdsaW5lYWZ0ZXIgPSBmYWxzZTtcbiAgICAgICAgLy8gJCh0aGlzLl9fZG9tKS5jc3MoXCJtaW4td2lkdGhcIiwgXCIxMHB4XCIpO1xuICAgIH1cbiAgICBjb25maWcoY29uZmlnOiBIVE1MUGFuZWxDb25maWcpOiBIVE1MUGFuZWwge1xuICAgICAgICBzdXBlci5jb25maWcoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG5cbiAgICBAJFByb3BlcnR5KHsgZGVzY3JpcHRpb246IFwibGluZSBicmVhayBhZnRlciBlbGVtZW50XCIsIGRlZmF1bHQ6IGZhbHNlIH0pXG4gICAgZ2V0IG5ld2xpbmVhZnRlcigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICQodGhpcy5kb20pLmNzcyhcImRpc3BsYXlcIikgPT09IFwiaW5saW5lLWJsb2NrXCI7XG4gICAgfVxuICAgIHNldCBuZXdsaW5lYWZ0ZXIodmFsdWUpIHtcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZGlzcGxheVwiLCB2YWx1ZSA/IFwiXCIgOiBcImlubGluZS1ibG9ja1wiKTtcbiAgICAgICAgJCh0aGlzLmRvbS5jaGlsZHJlblswXSkuY3NzKFwiZGlzcGxheVwiLCB2YWx1ZSA/IFwiXCIgOiBcImlubGluZS1ibG9ja1wiKTtcbiAgICB9XG4gICAgY29tcGlsZVRlbXBsYXRlKHRlbXBsYXRlKSB7XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oJ29iaicsICd3aXRoKG9iail7IHJldHVybiBcXCcnICtcbiAgICAgICAgICAgIHRlbXBsYXRlLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKS5zcGxpdCgve3soW157fV0rKX19L2cpLm1hcChmdW5jdGlvbiAoZXhwcmVzc2lvbiwgaSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpICUgMiA/ICgnXFwnKygnICsgZXhwcmVzc2lvbi50cmltKCkgKyAnKStcXCcnKSA6IGV4cHJlc3Npb247XG4gICAgICAgICAgICB9KS5qb2luKCcnKSArXG4gICAgICAgICAgICAnXFwnOyB9Jyk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBkZWNyaXB0aW9uOiAnZS5nLiBjb21wb25lbnQudmFsdWU9bmV3IFBlcnNvbigpO2NvbXBvbmVudC50ZW1wbGF0ZTpcInt7bmFtZX19XCInIH0pXG4gICAgZ2V0IHRlbXBsYXRlKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZTtcbiAgICB9XG4gICAgc2V0IHRlbXBsYXRlKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWU7IC8vcmVmb3JtYXQgdmFsdWVcbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSBjb2RlIC0gaHRtbGNvZGUgb2YgdGhlIGNvbXBvbmVudFxuICAgICAqKi9cbiAgICBzZXQgdmFsdWUoY29kZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciBzY29kZSA9IGNvZGU7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gY29kZTtcbiAgICAgICAgaWYgKHRoaXMudGVtcGxhdGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl92YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHNjb2RlID0gXCJcIjtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb2RlID0gdGhpcy5jb21waWxlVGVtcGxhdGUodGhpcy50ZW1wbGF0ZSkoY29kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvZGUgPSBlcnIubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsOiBhbnkgPSB0aGlzLmRvbS5jaGlsZHJlblswXTtcbiAgICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc2NvZGUpO1xuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoZWwpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICQoZWwpLmh0bWwoc2NvZGUpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KClcbiAgICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICAgICAgLyp2YXIgZWwgPSB0aGlzLmRvbS5jaGlsZHJlblswXTtcbiAgICAgICAgaWYgKGVsID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgdmFyIHJldCA9ICQoZWwpLmh0bWwoKTtcbiAgICAgICAgcmV0dXJuIHJldDsqL1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuICAgIGV4dGVuc2lvbkNhbGxlZChhY3Rpb246IEV4dGVuc2lvbkFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldERlc2lnbk1vZGUoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZS5lbmFibGUsIGFjdGlvbi5jb21wb25lbnREZXNpZ25lclNldERlc2lnbk1vZGUuY29tcG9uZW50RGVzaWduZXIpO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmV4dGVuc2lvbkNhbGxlZChhY3Rpb24pO1xuICAgIH1cbiAgICBpbml0SWZOZWVkZWQodGlueW1jZSwgY29uZmlnKSB7XG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5pbml0ZWQpIHtcbiAgICAgICAgICAgIGxldCBzaWMgPSBfdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIF90aGlzLl90Y20gPSB0aW55bWNlLmluaXQoY29uZmlnKTsgLy9jaGFuZ2VzIHRoZSB0ZXh0IHRvIDxicj4gaWYgZW1wdHkgLSB3aHk/XG4gICAgICAgICAgICBpZiAoc2ljID09PSBcIlwiICYmIF90aGlzLnZhbHVlICE9PSBzaWMpXG4gICAgICAgICAgICAgICAgX3RoaXMudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgdGhpcy5pbml0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gZWRpLnNob3coKTtcbiAgICAgICAgICAgIC8vIGVkaS5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHJpdmF0ZSBfaW5pdFRpbnltY2UoZWRpdG9yKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciB0aW55bWNlID0gd2luZG93W1widGlueW1jZVwiXTsgLy9vZGVyIHRpbnltY2VsaWIuZGVmYXVsdFxuXG4gICAgICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgICAgICAvL1x0ICAgICAgICAgICAgICAgIHZhbGlkX2VsZW1lbnRzOiAnc3Ryb25nLGVtLHNwYW5bc3R5bGVdLGFbaHJlZl0sdWwsb2wsbGknLFxuICAgICAgICAgICAgLy8gIHZhbGlkX3N0eWxlczoge1xuICAgICAgICAgICAgLy8gICAgJyonOiAnZm9udC1zaXplLGZvbnQtZmFtaWx5LGNvbG9yLHRleHQtZGVjb3JhdGlvbix0ZXh0LWFsaWduJ1xuICAgICAgICAgICAgLy8gIH0sXG4gICAgICAgICAgICBtZW51YmFyOiBmYWxzZSxcbiAgICAgICAgICAgIC8vc3RhdHVzYmFyOiBmYWxzZSxcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnIycgKyBfdGhpcy5faWQsXG4gICAgICAgICAgICBmb250c2l6ZV9mb3JtYXRzOiBcIjhweCAxMHB4IDEycHggMTRweCAxOHB4IDI0cHggMzZweFwiLFxuICAgICAgICAgICAgaW5saW5lOiB0cnVlLFxuICAgICAgICAgICAgZml4ZWRfdG9vbGJhcl9jb250YWluZXI6ICcjJyArIHRoaXMuZWRpdG9yLmlubGluZUVkaXRvclBhbmVsLl9pZCxcbiAgICAgICAgICAgIHNldHVwOiBmdW5jdGlvbiAoZWQpIHtcbiAgICAgICAgICAgICAgICBlZC5vbignY2hhbmdlJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBfdGhpcy5kb20uZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dCA9PT0gJzxiciBkYXRhLW1jZS1ib2d1cz1cIjFcIj4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIGVkaXRvci5fcHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUoXCJ2YWx1ZVwiLCAnXCInICsgdGV4dC5yZXBsYWNlQWxsKCdcIicsIFwiJ1wiKSArICdcIicsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGVkLm9uKCdmb2N1cycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICAgJChlZC5nZXRDb250YWluZXIoKSkuY3NzKFwiZGlzcGxheVwiLCBcImlubGluZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICBkZWJ1Z2dlcjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlZC5vbignYmx1cicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5fZGVzaWduTW9kZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIC8vZWRpdG9yLmVkaXREaWFsb2coZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJChcIiNcIiArIGVkLmlkKVswXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICBlZGl0b3IuX2RyYWdhbmRkcm9wcGVyLmVuYWJsZURyYWdnYWJsZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgLy9lZGl0b3IuZWRpdERpYWxvZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBlZC5vbignTm9kZUNoYW5nZScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICQoZWQuZ2V0Q29udGFpbmVyKCkpLmZpbmQoXCJzdmdcIikuYXR0cihcIndpZHRoXCIsIFwiMTZcIikuYXR0cihcImhlaWdodFwiLCBcIjE2XCIpLmF0dHIoXCJ2aWV3Ym94XCIsIFwiMCAwIDI0IDI0XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyQoZWQuZ2V0Q29udGFpbmVyKCkpLmNzcyhcIndoaXRlLXNwYWNlXCIsXCJub3dyYXBcIik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIF90aGlzLmN1c3RvbVRvb2xiYXJCdXR0b25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBidCA9IF90aGlzLmN1c3RvbVRvb2xiYXJCdXR0b25zW25hbWVdO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnV0dG9uO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IGVkLnVpLnJlZ2lzdHJ5LmFkZEJ1dHRvbihuYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBidC50aXRsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQWN0aW9uOiBmdW5jdGlvbiAoZSwgZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBidDIgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ0LmFjdGlvbihlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvbnBvc3RyZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidXR0b24gPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBteXRvb2xiYXJ3aWR0aCA9IDI0MDtcbiAgICAgICAgaWYgKE51bWJlcihfdGhpcy5lZGl0b3IuaW5saW5lRWRpdG9yUGFuZWwuX3BhcmVudC53aWR0aC5yZXBsYWNlKFwicHhcIiwgXCJcIikpIC0gTnVtYmVyKF90aGlzLmVkaXRvci5pbmxpbmVFZGl0b3JQYW5lbC5fcGFyZW50Ll9jb21wb25lbnRzWzBdLndpZHRoLnJlcGxhY2UoXCJweFwiLCBcIlwiKSkgPCBteXRvb2xiYXJ3aWR0aCkge1xuICAgICAgICAgICAgZGVsZXRlIGNvbmZpZy5maXhlZF90b29sYmFyX2NvbnRhaW5lcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX3RoaXNbXCJ0b29sYmFyXCJdKVxuICAgICAgICAgICAgY29uZmlnW1widG9vbGJhclwiXSA9IF90aGlzW1widG9vbGJhclwiXTtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBfdGhpcy5jdXN0b21Ub29sYmFyQnV0dG9ucykge1xuICAgICAgICAgICAgY29uZmlnW1widG9vbGJhclwiXVtjb25maWdbXCJ0b29sYmFyXCJdLmxlbmd0aCAtIDFdID1cbiAgICAgICAgICAgICAgICBjb25maWdbXCJ0b29sYmFyXCJdW2NvbmZpZ1tcInRvb2xiYXJcIl0ubGVuZ3RoIC0gMV0gKyBcIiB8IFwiICsgbmFtZTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMuZG9tKS5vbihcIm1vdXNldXBcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5fZGVzaWduTW9kZSA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgZWRpdG9yLl9kcmFnYW5kZHJvcHBlci5lbmFibGVEcmFnZ2FibGUoZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGVkaSA9IHRpbnltY2UuZWRpdG9yc1tfdGhpcy5faWRdO1xuICAgICAgICAgICAgaWYgKGVkaSlcbiAgICAgICAgICAgICAgICAkKGVkaS5nZXRDb250YWluZXIoKSkuY3NzKFwiZGlzcGxheVwiLCBcImZsZXhcIik7XG4gICAgICAgICAgICAvLyQodGhpcy5kb21XcmFwcGVyKS5kcmFnZ2FibGUoJ2Rpc2FibGUnKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vX3RoaXMudmFsdWU9c2ljO1xuICAgICAgICAvKiAgICAkKF90aGlzLmRvbSkuZG91YmxldGFwKGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLl9kZXNpZ25Nb2RlID09PSBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXRJZk5lZWRlZCh0aW55bWNlLCBjb25maWcpO1xuICAgICAgICAgICAgICAgIGVkaXRvci5fZHJhZ2FuZGRyb3BwZXIuZW5hYmxlRHJhZ2dhYmxlKGZhbHNlKTtcbiAgICAgICAgICAgIH0pOyovXG4gICAgICAgICQoX3RoaXMuZG9tKS5vbignYmx1cicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEhUTUxQYW5lbC5vbGRlZGl0b3IgPSB0aW55bWNlLmVkaXRvcnNbX3RoaXMuX2lkXTtcbiAgICAgICAgICAgIGVkaXRvci5fZHJhZ2FuZGRyb3BwZXIuZW5hYmxlRHJhZ2dhYmxlKHRydWUpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGVkaSA9IHRpbnltY2UuZWRpdG9yc1tfdGhpcy5faWRdO1xuICAgICAgICAgICAgICAgIC8vICAkKGVkaT8uZ2V0Q29udGFpbmVyKCkpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoX3RoaXMuZG9tKS5vbignZm9jdXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5pbml0SWZOZWVkZWQodGlueW1jZSwgY29uZmlnKTtcbiAgICAgICAgICAgICQoJyMnICsgX3RoaXMuZWRpdG9yLmlubGluZUVkaXRvclBhbmVsLl9pZCkuZmluZChcIi50b3gtdGlueW1jZS1pbmxpbmVcIikuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICBpZiAoSFRNTFBhbmVsLm9sZGVkaXRvcikge1xuICAgICAgICAgICAgICAgICQoSFRNTFBhbmVsLm9sZGVkaXRvci5nZXRDb250YWluZXIoKSkuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBhY3RpdmF0ZXMgb3IgZGVhY3RpdmF0ZXMgZGVzaWdubW9kZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlIC0gdHJ1ZSBpZiBhY3RpdmF0ZSBkZXNpZ25Nb2RlXG4gICAgICogQHBhcmFtIHtqYXNzaWpzLnVpLkNvbXBvbmVudERlc2lnbmVyfSBlZGl0b3IgLSBlZGl0b3IgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBfc2V0RGVzaWduTW9kZShlbmFibGUsIGVkaXRvcikge1xuICAgICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcbiAgICAgICAgLyogaWYgKGVuYWJsZSkge1xuICAgICAgICAgICAgICQodGhpcy5kb20pLm9uKFwibW91c2V1cFwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICBlZGl0b3IuX2RyYWdhbmRkcm9wcGVyLmVuYWJsZURyYWdnYWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgIC8vJCh0aGlzLmRvbVdyYXBwZXIpLmRyYWdnYWJsZSgnZGlzYWJsZScpO1xuIFxuICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICQodGhpcy5kb20pLm9uKFwiYmx1clwiLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICBlZGl0b3IuX2RyYWdhbmRkcm9wcGVyLmVuYWJsZURyYWdnYWJsZSh0cnVlKTtcbiBcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cbiAgICAgICAgIHJldHVybjsqL1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9kZXNpZ25Nb2RlID0gZW5hYmxlO1xuICAgICAgICBpZiAoZW5hYmxlKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImFjdGl2YXRlIHRpbnlcIik7XG4gICAgICAgICAgICByZXF1aXJlanMoW1wiamFzc2lqcy9leHQvdGlueW1jZVwiXSwgZnVuY3Rpb24gKHRpbnltY2VsaWIpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5faW5pdFRpbnltY2UoZWRpdG9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IEhUTUxQYW5lbCgpO1xuICAgIHJldC5jdXN0b21Ub29sYmFyQnV0dG9ucy5UYWJsZSA9IHtcbiAgICAgICAgdGl0bGU6IFwiVGFibGVcIixcbiAgICAgICAgYWN0aW9uOiAoKSA9PiB7IGFsZXJ0KDgpOyB9XG4gICAgfTtcbiAgICAvKiQocmV0LmRvbSkub24oXCJtb3VzZXVwXCIsIChlKSA9PiB7XG4gICAgICAgICQocmV0LmRvbVdyYXBwZXIpLmRyYWdnYWJsZSgnZGlzYWJsZScpO1xuICAgICAgICBcbiAgICB9KTsqL1xuICAgICQocmV0LmRvbSkub24oXCJibHVyXCIsIChlKSA9PiB7XG4gICAgICAgICQocmV0LmRvbVdyYXBwZXIpLmRyYWdnYWJsZSgnZW5hYmxlJyk7XG4gICAgfSk7XG4gICAgJChyZXQuZG9tKS5kb3VibGV0YXAoZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgLy8gaWYgKF90aGlzLl9kZXNpZ25Nb2RlID09PSBmYWxzZSlcbiAgICAgICAgLy8gICAgICByZXR1cm47XG4gICAgICAgIC8vIF90aGlzLmluaXRJZk5lZWRlZCh0aW55bWNlLCBjb25maWcpO1xuICAgICAgICB2YXIgaCA9IDk7XG4gICAgICAgIC8vICAgcmV0LmVkaXRvci5fZHJhZ2FuZGRyb3BwZXIuZW5hYmxlRHJhZ2dhYmxlKGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXQudmFsdWUgPSBcIjxzcGFuIHN0eWxlPSdmb250LXNpemU6IDEycHg7JyBkYXRhLW1jZS1zdHlsZT0nZm9udC1zaXplOiAxMnB4Oyc+ZHNmPHNwYW4gc3R5bGU9J2NvbG9yOiByZ2IoMjQxLCAxOTYsIDE1KTsnIGRhdGEtbWNlLXN0eWxlPSdjb2xvcjogI2YxYzQwZjsnPmc8c3Ryb25nPnNkZmdzZDwvc3Ryb25nPmZnc2RmZzwvc3Bhbj48L3NwYW4+PGJyPjxzdHJvbmc+PHNwYW4gc3R5bGU9J2NvbG9yOiByZ2IoMjQxLCAxOTYsIDE1KTsnIGRhdGEtbWNlLXN0eWxlPSdjb2xvcjogI2YxYzQwZjsnPnNkZmdzZGdzZGY8L3NwYW4+Z2Zkc2c8L3N0cm9uZz5cIjtcbiAgICByZXQuaGVpZ2h0ID0gMjU7XG4gICAgcmV0LndpZHRoID0gMTA3O1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=