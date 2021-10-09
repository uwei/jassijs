import { BoxPanel } from "jassijs/ui/BoxPanel";
import jassijs, { $Class } from "jassijs/remote/Jassi";
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
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this.init($('<img class="RImage"></img>')[0]);
        $(this.domWrapper).removeClass("jcontainer");
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
            $(this.dom).attr("src", "");
        else{
           
          //later we have a parent
          var report = RComponent.findReport(this);
          var _this = this;
          if (report === undefined) {
              if(_this["nextTry"]===undefined){//deny recurse
                  setTimeout(() => {
                      _this["nextTry"]=true;
                      _this.image=value;
                  },200);
              }else{
                  delete _this["nextTry"];
              }
          }else{
              var im = report.images;
              if (im !== undefined&&im[value]!==undefined) {
                  $(this.dom).attr("src", im[value]);
              }else{
                 $(this.dom).attr("src", value);
              }
          }
        }

    }
    get image(): string {
        return this._image;
    }
    toJSON() {
        var ret = super.toJSON();

        //if (this.image)
        ret.image = this.image;
        return ret;
    }
    fromJSON(ob: any): RUList {
        var ret = this;

        //if (ob.image)
        ret.image = ob.image;
        delete ob.image;
        super.fromJSON(ob);
        return ret;
    }
}
