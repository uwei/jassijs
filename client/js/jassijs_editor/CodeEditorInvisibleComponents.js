var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/Button", "jassijs/remote/Classes", "jassijs/ui/Image"], function (require, exports, Registry_1, Panel_1, Registry_2, Button_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditorInvisibleComponents = void 0;
    let CodeEditorInvisibleComponents = class CodeEditorInvisibleComponents extends Panel_1.Panel {
        constructor(codeeditor) {
            super();
            super.init('<span class="Panel" style="border:1px solid #ccc;"/>');
            /**
           * @member {jassijs_editor.CodeEditor} - the parent CodeEditor
           * */
            this.codeeditor = codeeditor;
            this.layout();
        }
        layout() {
            this.update();
        }
        update() {
            var _this = this;
            while (_this._components.length > 0) {
                _this.remove(_this._components[0]);
            }
            var elements = _this.codeeditor.getVariablesForType("$isInivisibleComponent"); //InvisibleComponent);
            for (var x = 0; x < elements.length; x++) {
                var img = new Button_1.Button();
                var name = elements[x];
                img.tooltip = name;
                //                    img.height=24;
                //  img.width=24;
                img.text = name.startsWith("me.") ? name.substring(3) : name;
                var ob = _this.codeeditor.getObjectFromVariable(name);
                img.dom["ob"] = ob;
                img.onclick(function (evt) {
                    _this.codeeditor._design._propertyEditor.value = evt.currentTarget.ob;
                    var ac = evt.currentTarget.ob.extensionCalled;
                    if (ac !== undefined) {
                        evt.currentTarget.ob.extensionCalled({ componentDesignerInvisibleComponentClicked: { codeEditor: _this.codeeditor, designButton: img } });
                    }
                });
                var cn = Classes_1.classes.getClassName(ob);
                //search icon
                Registry_2.default.getJSONData("$UIComponent").then((regdata) => {
                    regdata.forEach(function (val) {
                        if (val.classname === cn) {
                            img.icon = val.params[0].icon;
                        }
                    });
                });
                _this.add(img);
            }
            /* if(entries===undefined)
                  return;
              for(var key in entries){
                  var entry=entries[key].data;
                  var img=new jassijs.ui.Image();
                  var name=entry[1].split("/");
                  name=name[name.length-1];
                  img.tooltip=name;
                  img.src=entry[2];
                  img.height=24;
                  img.width=24;
                  img.createFromType=entry[0];
                  _this._makeDraggable(img);
                  _this.add(img);
              }*/
        }
        /**
         * install the draggable
         * @param {jassijs.ui.Component} component
         */
        _makeDraggable(component) {
            var helper = new (Classes_1.classes.getClass(component.createFromType))();
            document.getElementById("jassitemp").removeChild(helper.domWrapper);
            $(component.dom).draggable({
                cancel: "false", revert: "invalid",
                appendTo: "body",
                helper: function (event) {
                    return $(helper.dom);
                }
                /*   drag:function(event,ui){
                       var mouse=event.target._this.dom.style.cursor;
                       if(mouse==="e-resize"||mouse==="s-resize"||mouse==="se-resize")
                           return false;
                       else
                           return true;
                   }*/
            });
        }
        destroy() {
            super.destroy();
        }
    };
    CodeEditorInvisibleComponents = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.CodeEditorInvisibleComponents"),
        __metadata("design:paramtypes", [Object])
    ], CodeEditorInvisibleComponents);
    exports.CodeEditorInvisibleComponents = CodeEditorInvisibleComponents;
});
//# sourceMappingURL=CodeEditorInvisibleComponents.js.map