import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import "jassijs/ui/Image";
import registry from "jassijs/remote/Registry";
import { InvisibleComponent } from "jassijs/ui/InvisibleComponent";
import { Button } from "jassijs/ui/Button";
import { classes } from "jassijs/remote/Classes";
//import {CodeEditor} from "jassijs_editor/CodeEditor";//could be removed


@$Class("jassijs_editor.CodeEditorInvisibleComponents")
export class CodeEditorInvisibleComponents extends Panel {

    codeeditor;
    constructor(codeeditor) {
        super();
        
        /** 
       * @member {jassijs_editor.CodeEditor} - the parent CodeEditor
       * */

        this.codeeditor = codeeditor;
        this.layout();
    }
    render(){
        return <any>React.createElement("span", { className:"Panel",style:{border:"1px solid #ccc"}});
    }
    componentDidMount(): void {
       
    }
    layout() {
        this.update();
    }
    update() {

        var _this = this;
        while (_this._components.length > 0) {
            _this.remove(_this._components[0]);
        }
        var elements = _this.codeeditor.getVariablesForType("$isInivisibleComponent");//InvisibleComponent);
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
                    evt.currentTarget.ob.extensionCalled({ componentDesignerInvisibleComponentClicked: { codeEditor: _this.codeeditor, designButton: img } });
                }
            });
            var cn = classes.getClassName(ob);
            //search icon
            registry.getJSONData("$UIComponent").then((regdata) => {
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
        var helper = new (classes.getClass(component.createFromType))();
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
}
