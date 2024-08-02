import { Button } from "jassijs/ui/Button";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { Panel, PanelProperties } from "jassijs/ui/Panel";
import { $UIComponent, ComponentProperties, jc } from "jassijs/ui/Component";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import { DBObject } from "jassijs/remote/DBObject";
import { $Property, Property } from "jassijs/ui/Property";
import { $ActionProvider, ActionProperties } from "jassijs/base/Actions";
import { notify } from "jassijs/ui/Notify";

export class $DBObjectViewProperties {
    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    classname: string;
    actionname?: string;
    icon?: string;
    queryname?: string;
}
export function $DBObjectView(properties: $DBObjectViewProperties): Function {
    return function (pclass) {
        registry.register("$DBObjectView", pclass, properties);
        var p:Property={name:"value",componentType:properties.classname, type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }
        registry.registerMember("$Property", pclass,undefined, p);
    }
}


export interface DBObjectViewProperties<T> extends PanelProperties {
    /**
       * register an event if the object is created
       * @param {function} handler - the function that is called
       */
    oncreated?(handler: (obj: DBObject) => void);
    /**
    * register an event if the object is saved
    * @param {function} handler - the function that is called
    */
    onsaved?(handler: (obj: DBObject) => void);
    /**
     * register an event if the object is refreshed
     * @param {function} handler - the function that is called
     */
    onrefreshed?(handler: (obj: DBObject) => void);
    /**
    * register an event if the object is deleted
    * @param {function} handler - the function that is called
    */
    ondeleted?(handler: (obj: DBObject) => void);
    value?: T;
}
//@$UIComponent({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh", "me.databinder"] })
@$Class("jassijs/ui/DBObjectView")
//see export function $DBObjectView =>@$Property({name:"value", type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
export class DBObjectView<P extends DBObject = DBObject, T extends DBObjectViewProperties<P> = DBObjectViewProperties<P>> extends Panel<T> implements Omit<Panel, "isAbsolute"> {


    constructor(props: T = <any>{}) {
        super(props);
        this.dom.classList.add("designerNoResizable");//this should not be resized only me.main
        //everytime call super.layout
        //DBObjectView.prototype.layout.bind(this)(this.me);
        // this.layout(this.me);
    }
    config(config: T): DBObjectView {
        super.config(config);
        return this;
    }
    protected _setDesignMode(enable) {
        //no Icons to add Components in designer
    }

    
    set value(value: P) {

        this.states.value.current = value;
    }
    get value(): P {
        return this.states.value.current;
    }
    /**
     * create a new object
     */
    createObject(): any {
        var clname = registry.getData("$DBObjectView", classes.getClassName(this))[0].params[0].classname;
        var cl = classes.getClass(clname);
        this["value"] = new cl();
        this.callEvent("created", this["value"]);
        return this["value"];
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    oncreated(handler: (obj: DBObject) => void) {
        this.addEvent("created", handler);
    }
    private async doSave(ob) {
        var obj = await ob.save()
        this["value"] = typeof obj === "object" ? obj : ob;
        this.callEvent("saved", ob);

    }

    /**
     * saves the object
     */
    async saveObject() {
        var ob = await this.states.value.bind.$fromForm();
        if (ob !== undefined) {
            await this.doSave(ob);
            notify("saved", "info");
        }
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    onsaved(handler: (obj: DBObject) => void) {
        this.addEvent("saved", handler);
    }
    /**
     * refresh the object
     */
    refreshObject() {
        this.states.value.bind.$toForm();//this["value"]);
        this.callEvent("refreshed", this["value"]);
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    onrefreshed(handler: (obj: DBObject) => void) {
        this.addEvent("refreshed", handler);
    }
    /**
     * deletes Object
     **/
    deleteObject() {
        var ob: DBObject = <DBObject>this.states.value.bind.$fromForm();
        if (ob === undefined)
            return;
        ob.remove();

        //set obj to null
        var clname = registry.getData("$DBObjectView", classes.getClassName(this))[0].params[0].classname;
        var cl = classes.getClass(clname);
        this["value"] = new cl();
        this.callEvent("deleted", ob);
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    ondeleted(handler: (obj: DBObject) => void) {
        this.addEvent("deleted", handler);
    }
}

export async function test() {
    var ret = new DBObjectView();
    return ret;
}
export interface DBObjectViewToolbarProperties extends PanelProperties {
    view: DBObjectView
}
//@ts-ignore
export class DBObjectViewToolbar extends Panel<DBObjectViewToolbarProperties> {
    constructor(props: DBObjectViewToolbarProperties) {
        super(<any>props);
    }
    render() {
        return jc(BoxPanel, {
            horizontal:true,
            children: [
                jc(Button, {
                    text: "",
                    tooltip: "save",
                    icon: "mdi mdi-content-save",
                    onclick: (event) => {
                        this.props.view.saveObject();
                    }
                }),
                jc(Button, {
                    text: "",
                    tooltip: "remove",
                    icon: "mdi mdi-delete",
                    onclick: (event) => {
                        this.props.view.deleteObject();
                    }
                }),
                jc(Button, {
                    text: "",
                    tooltip: "refresh",
                    icon: "mdi mdi-refresh",
                    onclick: (event) => {
                        this.props.view.refreshObject();
                    }
                }),
                jc(Button, {
                    text: "",
                    tooltip: "new",
                    icon: "mdi mdi-tooltip-plus-outline",
                    onclick: (event) => {
                        this.props.view.createObject();
                    }
                })
            ]
        });
    }
}
