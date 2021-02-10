import jassi, { $Class } from "remote/jassi/base/Jassi";
import {Panel} from "jassi/ui/Panel";
import {HTMLPanel} from "jassi/ui/HTMLPanel";
import "jassi/ui/Image";
import registry from "remote/jassi/base/Registry";
import {InvisibleComponent} from "./InvisibleComponent";
import {Button} from "jassi/ui/Button";
import { classes } from "remote/jassi/base/Classes";
import {Component,  $UIComponent, UIComponentProperties } from "jassi/ui/Component";
import {CodeEditor} from "jassi/ui/CodeEditor";//could be removed

declare global {
    export interface ExtensionAction {
        componentDesignerInvisibleComponentClicked?:{
            codeEditor:CodeEditor,
            designButton:Button
        }
    }
}
@$Class("jassi.ui.CodeEditorInvisibleComponents")
export class CodeEditorInvisibleComponents extends Panel {
    codeeditor;
    constructor(codeeditor) {
        super();
        super.init($('<span class="Panel" style="border:1px solid #ccc;"/>')[0]);
        /** 
       * @member {jassi.ui.CodeEditor} - the parent CodeEditor
       * */

        this.codeeditor = codeeditor;
        this.layout();
    }
    layout() {
        this.update();
    }
    async update() {

        var _this = this;
        while (_this._components.length > 0) {
            _this.remove(_this._components[0]);
        }
        var elements = _this.codeeditor.getVariablesForType(InvisibleComponent);
        for (var x = 0; x < elements.length; x++) {
            var img = new Button();
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
                    evt.currentTarget.ob.extensionCalled({componentDesignerInvisibleComponentClicked:{ codeEditor:_this.codeeditor,designButton:img}});
                }
            });
            var cn = classes.getClassName(ob);
            //search icon
            var regdata=await registry.getJSONData("$UIComponent");
            regdata.forEach(function(val){
                if(val.classname===cn){
                    img.icon=val.params[0].icon;
                }
            });
            _this.add(img);
        }
        /* if(entries===undefined)
              return;
          for(var key in entries){
              var entry=entries[key].data;
              var img=new jassi.ui.Image();
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
     * @param {jassi.ui.Component} component
     */
    _makeDraggable(component) {
        var helper = new (classes.getClass(component.createFromType))();
        $("#jassitemp")[0].removeChild(helper.domWrapper);
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
}
