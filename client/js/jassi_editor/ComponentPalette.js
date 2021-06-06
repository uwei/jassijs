var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Image", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, jassijs_1, Panel_1, Image_1, Registry_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentPalette = void 0;
    let ComponentPalette = class ComponentPalette extends Panel_1.Panel {
        constructor() {
            super();
            this.layout();
        }
        layout() {
        }
        /**
         * @member {string} - the service where the palette-items are registred
         **/
        set service(value) {
            var _this = this;
            this._service = value;
            while (this._components.length > 0) {
                this.remove(this._components[0]);
            }
            Registry_1.default.getJSONData(this._service).then((jdata) => {
                for (var x = 0; x < jdata.length; x++) {
                    var mdata = jdata[x];
                    var data = mdata.params[0];
                    if (data.fullPath === undefined || data.fullPath === "undefined")
                        continue;
                    var img = new Image_1.Image();
                    var name = data.fullPath.split("/");
                    var sname = name[name.length - 1];
                    img.tooltip = sname;
                    img.src = data.icon === undefined ? "mdi mdi-chart-tree mdi-18px" : data.icon + (data.icon.startsWith("mdi") ? " mdi-18px" : "");
                    //img.height = 24;
                    //img.width = 24;
                    img["createFromType"] = mdata.classname;
                    img["createFromParam"] = data.initialize;
                    _this._makeDraggable(img);
                    _this.add(img);
                }
            });
            /*registry.loadAllFilesForService(this._service).then(function(){
                registry.getData(_this._service).forEach(function(mdata){
                    var data:UIComponentProperties=mdata.params[0];
                    var img=new Image();
                    var name=data.fullPath.split("/");
                    var sname=name[name.length-1];
                    img.tooltip=sname;
                    img.src=data.icon===undefined?"res/unknowncomponent.png":data.icon;
                    img.height=24;
                    img.width=24;
                    img["createFromType"]=classes.getClassName(mdata.oclass);
                    img["createFromParam"]=data.initialize;
                    _this._makeDraggable(img);
                    _this.add(img);
                });
           });*/
        }
        get service() {
            return this._service;
        }
        /**
         * install the draggable
         * @param {jassijs.ui.Image} component
         */
        _makeDraggable(component) {
            var helper = undefined;
            $(component.dom).draggable({
                cancel: "false", revert: "invalid",
                appendTo: "body",
                helper: function (event) {
                    if (helper === undefined) {
                        var cl = Classes_1.classes.getClass(component.createFromType);
                        if (cl === undefined) {
                            Classes_1.classes.loadClass(component.createFromType); //for later
                            cl = Panel_1.Panel;
                        }
                        helper = new cl();
                        var img = new Image_1.Image();
                        img.src = component.src;
                        img.height = 24;
                        img.width = 24;
                        img.x = component.x;
                        img.y = component.y;
                        helper._position = img;
                        component._helper = helper;
                        if (component.createFromParam !== undefined) {
                            $.extend(helper, component.createFromParam);
                        }
                        $("#jassitemp")[0].removeChild(helper.domWrapper);
                        $("#jassitemp")[0].removeChild(helper._position.domWrapper);
                    }
                    return helper._position.dom; //$(helper.dom);
                }
            });
        }
        destroy() {
            for (var x = 0; x < this._components.length; x++) {
                var comp = this._components[x];
                $(comp.dom).draggable("destroy");
                if (comp["_helper"] !== undefined)
                    comp["_helper"].destroy();
            }
            super.destroy();
        }
    };
    ComponentPalette = __decorate([
        jassijs_1.$Class("jassijs_editor.ComponentPalette"),
        __metadata("design:paramtypes", [])
    ], ComponentPalette);
    exports.ComponentPalette = ComponentPalette;
});
//# sourceMappingURL=ComponentPalette.js.map