import "jassijs/ext/jquerylib";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Image } from "jassijs/ui/Image";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import { $UIComponent, UIComponentProperties } from "jassijs/ui/Component";

@$Class("jassijs_editor.ComponentPalette")
export class ComponentPalette extends Panel {
    _service: string;
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
        registry.getJSONData(this._service).then((jdata) => {
            for (var x = 0; x < jdata.length; x++) {
                var mdata = jdata[x];
                var data: UIComponentProperties = mdata.params[0];
                if (data.fullPath === undefined || data.fullPath === "undefined")
                    continue;
                var img = new Image();
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
            for (var x = 0; x < jdata.length; x++) {
                var mdata = jdata[x];
                var data: UIComponentProperties = mdata.params[0];
                if (data.fullPath === undefined || data.fullPath === "undefined")
                    continue;
                var img = new Image();
                var name = data.fullPath.split("/");
                var sname = name[name.length - 1];
                img.tooltip = sname;
                img.dom.style.color = "blue";
                img.src = data.icon === undefined ? "mdi mdi-chart-tree mdi-18px" : data.icon + (data.icon.startsWith("mdi") ? " mdi-18px" : "");
                //img.height = 24;
                //img.width = 24;
                img["createFromType"] = mdata.classname;
                img["createFromParam"] = data.initialize;
                _this._makeDraggable2(img);
                _this.add(img);
            }
        });



        registry.loadAllFilesForService(this._service).then(function(){
            registry.getData(_this._service).forEach(function(mdata){
                var data:UIComponentProperties=mdata.params[0];
                var img=new Image();
                if(data.fullPath===undefined)
                    return;
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
       });
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
                    var cl = classes.getClass(component.createFromType);
                    if (cl === undefined) {
                        classes.loadClass(component.createFromType);//for later
                        cl = Panel;
                    }
                    helper = new cl();
                    var img = new Image();
                    img.src = component.src;
                    img.height = "24";
                    img.width = "24";
                    img.x = component.x;
                    img.y = component.y;
                    helper._position = img;
                    component._helper = helper;
                    if (component.createFromParam !== undefined) {
                        $.extend(helper, component.createFromParam);
                    }
                    document.getElementById("jassitemp").removeChild(helper.domWrapper);
                    document.getElementById("jassitemp").removeChild(helper._position.domWrapper);
                }
                return helper._position.dom;
            }
        });
    }
    _makeDraggable2(component) {
        var helper = undefined;

        var cl = classes.getClass(component.createFromType);
        if (cl === undefined) {
            classes.loadClass(component.createFromType);//for later
            cl = Panel;
        }

        /*   var img = new Image();
           (<any>img).native=true;
           img.src = component.src;
           img.dom.style.color = "blue";
           img.height = "24";
           img.width = "24";
           img.x = component.x;
           img.y = component.y;*/
        component.dom.draggable = true;
        component.dom.ondragstart = ev => {
        /*    helper = new cl();
            var img = new Image();
            img.src = component.src;
            img.height = "24";
            img.width = "24";
            img.x = component.x;
            img.y = component.y;
            helper._position = img;
            component._helper = helper;
            if (component.createFromParam !== undefined) {
                $.extend(helper, component.createFromParam);
            }*/
          //  ev.dataTransfer.setDragImage(img.dom, 20, 20);
            ev.dataTransfer.setData("text", JSON.stringify({
               createFromType : component["createFromType"],
               createFromParam : component["createFromParam"]                       
            }));
            //document.getElementById("jassitemp").removeChild(helper.domWrapper);
            //document.getElementById("jassitemp").removeChild(helper._position.domWrapper);
        }
 
        //helper._position = img;
        //component._helper = helper;
        // if (component.createFromParam !== undefined) {
        //   $.extend(helper, component.createFromParam);
        //  }

        /* $(component.dom).draggable({
             cancel: "false", revert: "invalid",
 
             appendTo: "body",
             helper: function (event) {
                 if (helper === undefined) {
                     var cl = classes.getClass(component.createFromType);
                     if (cl === undefined) {
                         classes.loadClass(component.createFromType);//for later
                         cl = Panel;
                     }
                     helper = new cl();
                     var img = new Image();
                     img.src = component.src;
                     img.height = "24";
                     img.width = "24";
                     img.x = component.x;
                     img.y = component.y;
                     helper._position = img;
                     component._helper = helper;
                     if (component.createFromParam !== undefined) {
                         $.extend(helper, component.createFromParam);
                     }
                     document.getElementById("jassitemp").removeChild(helper.domWrapper);
                     document.getElementById("jassitemp").removeChild(helper._position.domWrapper);
                 }
                 return helper._position.dom;
             }
         });*/
    }
    destroy() {

        for (var x = 0; x < this._components.length; x++) {
            var comp = this._components[x];
            if ((<any>comp).native !== true) {
                $(comp.dom).draggable({});
                $(comp.dom).draggable("destroy");
                if (comp["_helper"] !== undefined)
                    comp["_helper"].destroy();
            }
        }
        super.destroy();
    }
}
export function test() {
    var comp = new ComponentPalette();
    comp.service = "$UIComponent";
    return comp;
}