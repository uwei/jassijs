var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/RComponent", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs/remote/Classes"], function (require, exports, RComponent_1, Jassi_1, Property_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.RStyle = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStyle = 
    //@$Property({name:"horizontal",hide:true})
    class RStyle extends RComponent_1.RComponent {
        constructor(properties = undefined) {
            super(properties);
            this.$isInivisibleComponent = true; //invisible component in designer
            this.reporttype = "style";
            var _this = this;
            this.onstylechanged((param1, param2) => {
                _this.update();
            });
        }
        set name(value) {
            var old = this._name;
            this._name = value;
            if (this.activeComponentDesigner) {
                if (old) { //remove old
                    var all = this.activeComponentDesigner.variables.value;
                    for (let x = 0; x < all.length; x++) {
                        if (all[x].name === old) {
                            all.splice(x, 1);
                            this.activeComponentDesigner.variables.value = all;
                            break;
                        }
                    }
                    this.activeComponentDesigner.variables.addVariable(value, this, true);
                    this.activeComponentDesigner.resize();
                }
            }
        }
        addToParent(suggestedparent) {
            if (suggestedparent === undefined)
                throw new Classes_1.JassiError("suggestedparent is undefined");
            if (suggestedparent.reporttype === "report") {
                suggestedparent.styleContainer.add(this);
                return;
            }
            this.addToParent(suggestedparent._parent);
        }
        get name() {
            return this._name;
        }
        toJSON() {
            var ret = super.toJSON();
            return ret;
        }
        update() {
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = $('<style id=' + this.styleid + '></style>')[0];
                document.head.appendChild(style);
            }
            var prop = {};
            var sstyle = "\t." + this.styleid + "{\n";
            sstyle += this.dom.style.cssText;
            sstyle = sstyle + "\t}\n";
            style.innerHTML = sstyle;
        }
        fromJSON(ob) {
            var ret = this;
            super.fromJSON(ob);
            //delete ob.stack;
            return ret;
        }
        //this.dom.style.cssText
        get styleid() {
            return "jassistyle" + this._id;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this.activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RStyle.prototype, "name", null);
    RStyle = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Style", icon: "mdi mdi-virus-outline", editableChildComponents: ["this"] }),
        (0, Jassi_1.$Class)("jassijs_report.RStyle")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStyle);
    exports.RStyle = RStyle;
    function test() {
        var n = new RStyle();
        var hh = Object.getOwnPropertyDescriptor(n, "name");
        debugger;
    }
    exports.test = test;
});
//# sourceMappingURL=RStyle.js.map