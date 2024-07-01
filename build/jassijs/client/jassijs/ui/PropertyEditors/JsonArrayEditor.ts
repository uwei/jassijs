import { JsonEditor } from "jassijs/ui/PropertyEditors/JsonEditor";
import { $PropertyEditor, Editor } from "jassijs/ui/PropertyEditors/Editor";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Table } from "jassijs/ui/Table";
import { Button } from "jassijs/ui/Button";


@$PropertyEditor(["jsonarray"])
@$Class("jassijs.ui.PropertyEditors.JsonArrayEditor")
export class JsonArrayEditor extends Editor {

    /**
       * Editor for number and string 
       * used by PropertyEditor
       * @class jassijs.ui.PropertyEditors.DefaultEditor
       */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Button();
        var _this = this;
        this.component.onclick(function (param) {
            _this._onclick(param);
        });
    }
    _onclick(param) {
    }
    /**
    * get the renderer for the PropertyEditor
    * @returns - the UI-component for the editor
    */
    getComponent() {
        return this.component;
    }
    /**
    * @member {object} ob - the object which is edited
    */
    set ob(ob) {
        super.ob = ob;
        var value = this.propertyEditor.getPropertyValue(this.property);
        this.component.value = value;
    }
    get ob() {
        return this._ob;
    }
    protected showDialog(control, propEditor) {
        var panel = new BoxPanel();
        var panelButtons = new BoxPanel();
        var table = new Table({
            options:{
                columns: [{ field: "field", title: "field" }]
            }
        });
        var up = new Button();
        table.height = "100%";
        panel.horizontal = true;
        panelButtons.add(up);
        panel.add(table);
        panel.add(panelButtons);
        panel.add(control);
        var docheight = $(document).height();
        $(panel.dom).dialog({
            height: docheight,
            width: "320px"

        });
    }
}

@$Class("jassijs.ui.JsonArrayEditor.TestProperties")
class TestProperties {
    @$Property({ decription: "name of the dialog" })
    name1: string;
    @$Property({ decription: "name of the dialog" })
    name2: string;
}
@$Class("jassijs.ui.JsonArrayEditor.TestProperties2")
class TestProperties2 {

    @$Property({ decription: "name of the dialog", type: "jsonarray", componentType: "jassijs.ui.JsonArrayEditor.TestProperties" })
    ob: any;
}

export function test() {
    var ret = new PropertyEditor();
    ret.value = new TestProperties2();
    return ret;
}