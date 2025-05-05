
/// <amd-dependency path="splitlib" name="Split"/>
declare var Split;


import { Panel, PanelProperties} from "jassijs/ui/Panel";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { classes } from "jassijs/remote/Classes";
//@ts-ignore
//import Split from "jassijs/ext/split";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Container, ContainerProperties } from "./Container";
import { $UIComponent } from "jassijs/ui/UIComponent";


export interface BoxPanelProperties extends PanelProperties {

    /**
     * @member {boolean} - if true then the components are composed horizontally
     **/
    horizontal?: boolean;
    /**
      * set the size of splitter e.g. [40,60] the firstcomponent size is 40%
      */
    spliter?: number[];
}

@$UIComponent({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] })
@$Class("jassijs.ui.BoxPanel")
@$Property({ name: "isAbsolute", hide: true, type: "boolean" })
export class BoxPanel<T extends BoxPanelProperties=BoxPanelProperties> extends Panel<T> implements BoxPanelProperties {
    _horizontal: boolean;
    private _spliter: number[];
    private _splitcomponent: any;
    /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
    constructor(properties:T=<any>{}) {
        super(properties);
        this.domWrapper.classList.add('BoxPanel')
        this.domWrapper.classList.remove('Panel');

        this.horizontal = !properties?.horizontal===false;
        this.dom.style.display="flex";
    }

    config(config: T): BoxPanel {
        super.config(config);
        return this;
    }
    @$Property()
    set horizontal(value: boolean) {
        this._horizontal = value;
        if (value)
            this.dom.style["flex-direction"]="row";
        else
            this.dom.style["flex-direction"]= "column";
        this.updateSpliter();

    }
    
    get horizontal(): boolean {
        return this._horizontal;
    }
    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component) {

        super.add(component);
        this.updateSpliter();
    }
    /**
    * adds a component to the container before an other component
    * @param {jassijs.ui.Component} component - the component to add
    * @param {jassijs.ui.Component} before - the component before then component to add
    */
    addBefore(component, before) {
        super.addBefore(component, before);
        this.updateSpliter();
    }
    @$Property({ type: "number[]", description: "set the size of splitter e.g. [40,60] the firstcomponent size is 40%" })
    set spliter(size: number[]) {
        this._spliter = size;
        this.updateSpliter();
    }
    get spliter(): number[] {
        return this._spliter;
    }
    updateSpliter() {
        if (this._splitcomponent) {
            this._splitcomponent.destroy();
            this._splitcomponent = undefined;
        }
        if (!this._spliter)
            return;
        var comp = [];
        for (var x = 0; x < this._components.length; x++) {
            //test
            this._components[x].__dom.style.overflow="scroll";
            this._components[x].__dom.style.width=( this.horizontal ? "calc(100% - 5px)" : "100%");
            this._components[x].__dom.style.height= (this.horizontal ? "100%" : "calc(100% - 5px)");
            comp.push(this._components[x].domWrapper);
        } 

        this._splitcomponent = Split(comp, {
            sizes: this._spliter,
            gutterSize: 8,
            minSize: [50, 50, 50, 50, 50, 50, 50, 50],
            direction: this.horizontal ? 'horizontal' : 'vertical'
        });
    }
}
export async function test() {
    var HTMLPanel = await classes.loadClass("jassijs.ui.HTMLPanel");
    var ret = new BoxPanel();
    var me: any = {};
    ret["me"] = me;
   // ret.horizontal = true;
    me.tb = new HTMLPanel();
    me.tb2 = new HTMLPanel();
    me.tb.value = "l&ouml;&auml;k&ouml;lk &ouml;lsfdk sd&auml;&ouml;flgkdf ";
    me.tb.width = 135;
    me.tb2.value = "löäkölk ölsfdk sdäöflgkdf ";
    ret.add(me.tb);
    ret.add(me.tb2);
    ret.spliter = [40, 60];
    ret.height = 50;
    ret.width = "100%";
    return ret;
}
;
