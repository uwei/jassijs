import "jassijs/ext/jquerylib";
import { Upload } from "jassijs/ui/Upload";
import { Textbox } from "jassijs/ui/Textbox";
import { Image } from "jassijs/ui/Image";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Button } from "jassijs/ui/Button";
import { Repeater } from "jassijs/ui/Repeater";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $PropertyEditor, Editor } from "jassijs/ui/PropertyEditors/Editor";
import { $Action } from "jassijs/base/Actions";
import { RImage } from "jassijs_report/RImage";
import { RComponent } from "jassijs_report/RComponent";
import { StateDatabinder } from "jassijs/ui/StateBinder";
type Me = {
    repeater1?: Repeater;
    panel1?: Panel;
    image1?: Image;
    itile?: Textbox;
    remove?: Button;
    upload1?: Upload;
    databinder1?: StateDatabinder;
};
@$PropertyEditor(["rimage"])
@$Class("jassi_report/RImagePropertyEditor")
export class RImageEditor extends Editor {
    _textbox: Textbox;
    _button: Button;
    dialog: RImageChooser;
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Panel( /*{useSpan:true}*/);
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
        this._button.onclick(() => {
            _this.showDialog();
        });
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        //databinder,"prop"
        var value: string = this.propertyEditor.getPropertyValue(this.property);
        if (value?.startsWith('"'))
            value = value.substring(1);
        if (value?.endsWith('"')) {
            value = value.substring(0, value.length - 1);
        }
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
        if (this.property) {
            this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
        }
        super.callEvent("edit", param);
    }
    async showDialog(onlytest = undefined) {
        var _this = this;
        if (!this.dialog) {
            this.dialog = new RImageChooser();
            var image = (<RImage>this.ob);
            var report = RComponent.findReport(image);
            if (report?.images)
                this.dialog.items = report.images;
            
            $(this.dialog.__dom).dialog({ height: "400", width: "400",
                close: () => {
                    if (report)
                        report.images = _this.dialog.items;
                    _this._onchange();
                } });
            this.dialog.onpictureselected((val) => {
                
                _this._textbox.value = val;
                if (report)
                    report.images = _this.dialog.items;
                _this._onchange();
                $(this.dialog.__dom).dialog("close");
            });
        }else{
             $(this.dialog.__dom).dialog("open");
        }
    }
}
export class RImageChooser extends Panel {
    me: Me;
    //active image;
    value: string;
    _items: {
        name: string;
        data: string;
    }[] = [];
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    set items(val) {
        this._items.splice(0, this._items.length);
        for (var key in val) {
            this._items.push({ name: key, data: val[key] });
        }
        this.me.repeater1.value = this._items;
    }
    get items() {
        var ret = {};
        for (var x = 0; x < this._items.length; x++) {
            ret[this._items[x].name] = this._items[x].data;
        }
        return ret;
    }
    onpictureselected(func) {
        this.addEvent("pictureselected", func);
    }
    layout(me: Me) {
        var _this = this;
        me.repeater1 = new Repeater();
        me.databinder1 = new Databinder();
        me.databinder1.value = this;
        me.repeater1.value = this._items;
        me.upload1 = new Upload();
        me.upload1.onuploaded((data) => {
            for (var key in data) {
                _this._items.push({ name: key.split(".")[0], data: data[key] });
            }
            _this.items = _this.items;
        });
        me.upload1.readAs = "DataUrl";
        this.add(me.upload1);
        this.add(me.repeater1);
        me.repeater1.createRepeatingComponent(function (me: Me) {
            me.panel1 = new Panel();
            me.image1 = new Image();
            me.itile = new Textbox();
            me.remove = new Button();
            me.repeater1.design.add(me.panel1);
            me.panel1.add(me.itile);
            me.panel1.add(me.remove);
            me.panel1.add(me.image1);
            me.image1.height = "75";
            me.remove.text = "";
            me.remove.icon = "mdi mdi-delete-forever-outline";
            me.itile.bind=[me.repeater1.design.databinder, "name"];
            me.itile.onchange(function(event){
                var ob = me.itile._databinder.value;
                ob.name=me.itile.value;
                _this.items = _this.items;
            });
            me.image1.bind=[me.repeater1.design.databinder, "data"];
            me.remove.onclick(function (event) {
                var ob = me.itile._databinder.value;
                let pos = _this._items.indexOf(ob);
                _this._items.splice(pos, 1);
                _this.items = _this.items;
            });
            me.image1.onclick(function (event) {
                var ob = me.itile._databinder.value;
                _this.value = ob.name;
                _this.callEvent("pictureselected", ob.name);
            });
           
        });
    }
}
export async function test() {
    var ret = new RImageChooser();
    
    return ret;
}
