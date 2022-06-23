import { $ReportComponent, RComponent } from "jassijs_report/RComponent";
import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";
import { JassiError } from "jassijs/remote/Classes";


//@$UIComponent({editableChildComponents:["this"]})
@$ReportComponent({ fullPath: "report/Style", icon: "mdi mdi-virus-outline", editableChildComponents: ["this"] })
@$Class("jassijs_report.RStyle")
//@$Property({name:"horizontal",hide:true})

export class RStyle extends RComponent {
    $isInivisibleComponent = true;//invisible component in designer
    reporttype: string = "style";
    private activeComponentDesigner;
    _name:string;
    @$Property()
    set name(value:string){
        var old=this._name;
        this._name=value;
        if(this.activeComponentDesigner){
            if(old){//remove old
                var all=this.activeComponentDesigner.variables.value;
                for(let x=0;x<all.length;x++){
                    if(all[x].name===old){
                        all.splice(x,1);
                        this.activeComponentDesigner.variables.value=all;
                        break;
                    }
                }
                this.activeComponentDesigner.variables.addVariable(value, this,true);
                this.activeComponentDesigner.resize();
            }
            
             
        }
    }
    addToParent(suggestedparent){
        if(suggestedparent===undefined)
            throw new JassiError("suggestedparent is undefined");
        if(suggestedparent.reporttype=== "report"){
            suggestedparent.styleContainer.add(this);
            return;
        }
        this.addToParent(suggestedparent._parent);
    }
    get name():string{
        return this._name;
    }
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        var _this = this;
        this.onstylechanged((param1, param2) => {
            _this.update();
        })
    }

    toJSON() {
        var ret = super.toJSON();
        return ret;
    }
    update() {
        var style: HTMLElement = document.getElementById(this.styleid);
        if (!document.getElementById(this.styleid)) {
            style = RComponent.createHTMLElement('<style id=' + this.styleid + '></style>');
            document.head.appendChild(style);
        }
        var prop = {};
        var sstyle = "\t." + this.styleid + "{\n";
        sstyle += this.dom.style.cssText;

        sstyle = sstyle + "\t}\n";
        style.innerHTML = sstyle;

    }
    fromJSON(ob: any): RStyle {
        var ret = this;
        super.fromJSON(ob)
        //delete ob.stack;
        return ret;
    }
    //this.dom.style.cssText
    get styleid() {
        return "jassistyle" + this._id;
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this.activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
        }
        super.extensionCalled(action);
    }
}

export function test(){
    var n=new RStyle();
    var hh=Object.getOwnPropertyDescriptor(n,"name");

}