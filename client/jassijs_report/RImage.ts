import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { $UIComponent, Component } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { Panel } from "jassijs/ui/Panel";

//mdi-format-list-numbered
@$ReportComponent({ fullPath: "report/Image", icon: "mdi mdi-image-frame" })
@$Class("jassijs_report.RImage")
//@$Property({name:"horizontal",hide:true})

export class RImage extends RComponent {
    reporttype: string = "image";
    _image: string = "";
    _fit: number[];
    _opacity: number;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this.init('<img class="RImage"></img>');
        this.domWrapper.classList.remove("jcontainer");
    }
    /**
     * adds a component to the container before an other component
     * @param {jassijs.ui.Component} component - the component to add
     * @param {jassijs.ui.Component} before - the component before then component to add
     */
    addBefore(component, before) {
        //do nothing
    }
    /**
  * adds a component to the container
  * @param {jassijs.ui.Component} component - the component to add
  */
    add(component) {
        //do nothing
    }
    @$Property({
        type: "rimage",
        chooseFrom: (data) => {
            debugger;
            return [];
        }
    })
    set image(value: string) {
        this._image = value;
        if (value === undefined)
            this.dom.setAttribute("src", "");
        else {

            //later we have a parent
            var report = RComponent.findReport(this);
            var _this = this;
            if (report === undefined) {
                if (_this["nextTry"] === undefined) {//deny recurse
                    setTimeout(() => {
                        _this["nextTry"] = true;
                        _this.image = value;
                    }, 200);
                } else {
                    delete _this["nextTry"];
                }
            } else {
                var im = report.images;
                if (im !== undefined && im[value] !== undefined) {
                    this.dom.setAttribute("src", im[value]);
                } else {
                    this.dom.setAttribute("src", value);
                }
            }
        }

    }
    get image(): string {
        return this._image;
    }
    @$Property({ type: "number[]", decription: "fit in rectangle width, height e.g. 10,20" })
    set fit(value: number[]) {
        this._fit = value;
        if (value === undefined) {
            this.__dom.style["object-fit"]= "";
            this.width = this.width;
            this.height = this.height;
        } else {
            this.__dom.style["object-fit"] ="contain";
            this.__dom.style.width= value[0].toString();
            this.__dom.style.height= value[1].toString();
        }
    }
    get fit(): number[] {
        return this._fit;
    }
    @$Property({ type: "number"})
    set opacity(value: number) {
        this._opacity = value;
        if (value === undefined) {
            this.__dom.style.opacity= "";
        } else {
            this.__dom.style.opacity= value.toString();
        }
    }
    get opacity(): number {
        return this._opacity;
    }
    toJSON() {
        var ret = super.toJSON();
        if (this.fit) {
            ret.fit = this.fit;
        }
        if (this.opacity) {
            ret.opacity = this.opacity;
        }
        //if (this.image)
        ret.image = this.image;
        return ret;
    }
    fromJSON(ob: any): RImage {
        var ret = this;
        if (ob.fit) {
            ret.fit = ob.fit;
            delete ob.fit;
        }
        if (ob.opacity) {
            ret.opacity = ob.opacity;
            delete ob.opacity;
        }
        //if (ob.image)
        ret.image = ob.image;
        delete ob.image;
        super.fromJSON(ob);
        return ret;
    }
}
