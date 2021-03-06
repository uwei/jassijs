import { Checkbox } from "jassi/ui/Checkbox";
import { Editor, $PropertyEditor } from "jassi/ui/PropertyEditors/Editor";
import { Databinder } from "jassi/ui/Databinder";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { Textbox } from "jassi/ui/Textbox";
import { ObjectChooser } from "jassi/ui/ObjectChooser";
import { DBObject } from "jassi/remote/DBObject";
import { classes } from "jassi/remote/Classes";
import { Button } from "jassi/ui/Button";
import { $Action, $ActionProvider } from "jassi/base/Actions";
@$ActionProvider("jassi.base.ActionNode")
@$PropertyEditor(["image"])
@$Class("jassi.ui.PropertyEditors.ImageEditor")
export class ImageEditor extends Editor {
    _textbox: Textbox;
    _button: Button;
    dialog: Panel;
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassi.ui.PropertyEditors.BooleanEditor
     */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Panel(/*{useSpan:true}*/);
        this._button = new Button();
        this._textbox = new Textbox();
        this._textbox.width = "calc(100% - 34px)";
        this.component.height = 24;
        this._button.icon = "mdi mdi-glasses";
        this.component.add(this._textbox);
        this.component.add(this._button);

        var _this = this;
        this._textbox.onchange(function (param) {
            _this._onchange(param);
        });
        this._button.onclick(()=>{
            _this.showDialog();
        })
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        //databinder,"prop"
        var value = this.propertyEditor.getPropertyValue(this.property);

        this._textbox.value = value;

    }
    get ob() {
        return this._ob;
    }

    /**
   * get the renderer for the PropertyEditor
   * @returns - the UI-component for the editor
   */
    getComponent() {
        return this.component;
    }


    /**
    * intern the value changes
    * @param {type} param
    */
    _onchange(param = undefined) {
        var val = this._textbox.value;
        if(this.property){
         this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
        }
        super.callEvent("edit", param);
    }
     @$Action({
        name: "Tools/Icons",
       icon: "mdi mdi-image-area",
    })
    static async show(){
        await new ImageEditor(undefined,undefined).showDialog();
    }
    async showDialog() {
        if (!this.dialog) {
            var _this=this;
            this.dialog = new Panel();
            var suche = new Textbox();
            var icons = new Panel();
            this.dialog.add(suche);
            this.dialog.add(icons);
            suche.onchange((data) => {
                var su:any = suche.value;
                for (var x = 0; x < icons.dom.children[0].children.length; x++) {
                    var ic = icons.dom.children[0].children[x];
                    if (ic.className.indexOf(su) > -1) {
                        ic.setAttribute("style", "display:inline");
                    } else
                        ic.setAttribute("style", "display:none");
                }
            });
            var file = (await import("jassi/modul")).default.css["materialdesignicons.min.css"] + "?ooo=9";
            var text = await $.ajax({ method: "get", url: file, crossDomain: true, contentType: "text/plain" });
            var all = text.split("}.")
            var html = "";
            window["ImageEditorClicked"] = function (data) {
                _this._textbox.value="mdi "+data;
                suche.value=data;
                _this._onchange();
                console.log(data);

            }
            for (var x = 1; x < all.length; x++) {
                var icon = all[x].split(":")[0];


                html = html + "<span title='" + icon + "' onclick=ImageEditorClicked('" + icon + "') class='mdi " + icon + "'></span>";
            }
            var node = $("<span style='font-size:18pt'>" + html + "</span>");
            icons.__dom.appendChild(node[0]);
            $(this.dialog.__dom).dialog({ height: "400", width: "400" });
        }

    }
}
export function test() {
    var ed = new ImageEditor(undefined, undefined);
    ed.showDialog();
}

