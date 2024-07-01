import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";

//Limitations not implemented: separator,markerColor, counter is counting also the next elements

@$ReportComponent({ fullPath: "report/Ordered List", icon: "mdi mdi-format-list-numbered", editableChildComponents: ["this"] })
@$Class("jassijs_report.ROList")
//@$Property({name:"horizontal",hide:true})
export class ROList extends RComponent {
    reporttype: string = "ol";

    _reversed: boolean;
    _start: number;
    _type: string;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
      

    }
    render(){
        return React.createElement("ol", { className: "ROList"});
    }
   
    @$Property({ chooseFrom: ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"] })
    set type(value: string) {
        this._type = value;
        if (value === undefined)
            this.dom.style["list-style-type"]= "";
        else
            this.dom.style["list-style-type"]= value;
    }
    get type(): string {
        return this._type;
    }

    @$Property({ default: false })
    set reversed(value: boolean) {
        this._reversed = value;
        if (this._reversed)
            this.__dom.setAttribute("reversed", "");
        else
            this.__dom.removeAttribute("reversed");
    }
    get reversed(): boolean {
        return this._reversed;
    }
    @$Property({ default: 1 })
    set start(value: number) {
        this._start = value;
        this.__dom.setAttribute("start", value.toString());

    }
    get start(): number {
        return this._start;
    }

    /**
     * adds a component to the container before an other component
     * @param {jassijs.ui.Component} component - the component to add
     * @param {jassijs.ui.Component} before - the component before then component to add
     */
    addBefore(component, before) {
        if (component.addToParent)
            return component.addToParent(this);
        Component.replaceWrapper(component, document.createElement("li"));
        if (component._counter)
            component.counter = component._counter;
        if (component.listType !== undefined)
            component.listType = component._listType;
        super.addBefore(component, before);
    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {
        if (component.addToParent)
            return component.addToParent(this);
        Component.replaceWrapper(component, document.createElement("li"));
        if (component.listType !== undefined)
            component.listType = component._listType;
        if (component._counter)
            component.counter = component._counter;
        super.add(component);
    }

    toJSON() {
        var ret = super.toJSON();
        ret.ol = [];
        if (this.reversed)
            ret.reversed = true;
        if (this.start)
            ret.start = this.start;
        if (this.type)
            ret.type = this.type;

        for (let x = 0; x < this._components.length; x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            //@ts-ignore
            ret.ol.push(this._components[x].toJSON());
        }
        return ret;
    }
    fromJSON(ob: any): ROList {
        var ret = this;
        var arr = ob.ol;
        for (let x = 0; x < arr.length; x++) {
            ret.add(ReportDesign.fromJSON(arr[x]));
        }
        delete ob.ol;
        if (ob.reversed)
            ret.reversed = ob.reversed;
        delete ob.reversed;
        if (ob.start)
            ret.start = ob.start;
        delete ob.start;
        if (ob.type)
            ret.type = ob.type;
        delete ob.type;
        super.fromJSON(ob);
        return ret;
    }
}
