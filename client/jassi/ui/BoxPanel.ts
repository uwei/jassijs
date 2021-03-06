import { Panel } from "jassi/ui/Panel";
import jassi, { $Class } from "jassi/remote/Jassi";
import { $UIComponent } from "jassi/ui/Component";
import { $Property } from "jassi/ui/Property";
import { classes } from "jassi/remote/Classes";
//@ts-ignore
import Split from "jassi/ext/split";
import { HTMLPanel } from "jassi/ui/HTMLPanel";
@$UIComponent({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] })
@$Class("jassi.ui.BoxPanel")
@$Property({ name: "isAbsolute", hide: true, type: "boolean" })
export class BoxPanel extends Panel {
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
    constructor(properties = undefined) {
        super(properties);
        $(this.domWrapper).addClass('BoxPanel').removeClass('Panel');
        this.horizontal = false;
        $(this.dom).css("display", "flex");
    }
    /**
     * @member {boolean} - if true then the components are composed horizontally
     **/
    set horizontal(value: boolean) {
        this._horizontal = value;
        if (value)
            $(this.dom).css("flex-direction", "row");
        else
            $(this.dom).css("flex-direction", "column");
        this.updateSpliter();
        /*	this._horizontal=value;
            var jj=	$(this.dom).find(".jcomponent");
            if(this._horizontal){
                $(this.dom).css("display","table");
                $(this.dom).find(".jcomponent").css("display","table-row");
           }else{
                $(this.dom).css("display","flex");
                $(this.dom).find(".jcomponent").css("display","table-cell");
           }*/
    }
    @$Property({ default: true })
    get horizontal(): boolean {
        return this._horizontal;
    }
    /**
    * adds a component to the container
    * @param {jassi.ui.Component} component - the component to add
    */
    add(component) {
        /* if(this._horizontal){
                    $(component.domWrapper).css("display","table-row");
         }else{
                    $(component.domWrapper).css("display","table-cell");
         }*/
        super.add(component);
        this.updateSpliter();
    }
    /**
    * adds a component to the container before an other component
    * @param {jassi.ui.Component} component - the component to add
    * @param {jassi.ui.Component} before - the component before then component to add
    */
    addBefore(component, before) {
        /*if(this._horizontal){
                $(component.domWrapper).css("display","table-row");
           }else{
                $(component.domWrapper).css("display","table-cell");
           }*/
        super.addBefore(component, before);
        this.updateSpliter();
    }
    /**
     * set the size of splitter e.g. [40,60] the firstcomponent size is 40%
     */
    set spliter(size: number[]) {
        this._spliter = size;
        this.updateSpliter();
    }
    @$Property({type:"number[]",description:"set the size of splitter e.g. [40,60] the firstcomponent size is 40%"})
    get spliter(): number[] {
        return this._spliter;
    }
    updateSpliter() {
    	if (this._splitcomponent){
            this._splitcomponent.destroy();
    		this._splitcomponent=undefined;
    	}
        if (!this._spliter)
            return;
        var comp = [];
        for (var x = 0; x < this._components.length; x++) {
            if (this._components[x]["designDummyFor"])
                continue;
            $(this._components[x].__dom).css("width", this.horizontal ? "calc(100% - 5px)" : "100%");
            $(this._components[x].__dom).css("height", this.horizontal ? "100%" : "calc(100% - 5px)");
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
    var HTMLPanel = await classes.loadClass("jassi.ui.HTMLPanel");
    var ret = new BoxPanel();
    var me: any = {};
    ret["me"] = me;
    ret.horizontal = true;
    me.tb = new HTMLPanel();
    me.tb2 = new HTMLPanel();
    me.tb.value = "l&ouml;&auml;k&ouml;lk &ouml;lsfdk sd&auml;&ouml;flgkdf ";
    me.tb.width = 135;
    me.tb2.value = "löäkölk ölsfdk sdäöflgkdf ";
    ret.add(me.tb);
    ret.add(me.tb2);
    ret.spliter = [40, 60];
    ret.height = "400px";
    ret.width = "400px";
    return ret;
}
;
