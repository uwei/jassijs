var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Component"], function (require, exports, Registry_1, Panel_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog3 = void 0;
    var x = 1;
    class H extends Component_1.HTMLComponent {
        render() {
            return React.createElement("div", {
                style: { borderStyle: "ridge", borderWidth: "5px" }
            }); //, "Hallo" + (x++);
        }
    }
    class H2 extends Component_1.HTMLComponent {
        render() {
            return React.createElement("u", {
                style: { borderStyle: "ridge", borderWidth: "5px" }
            }); //, "Hallo" + (x++));
        }
    }
    let Dialog3 = class Dialog3 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            /*
            this.dom.contentEditable = "true";
            me.p1=new Panel();
            me.p1.domWrapper.style.borderWidth = "5px;";
            me.p1.domWrapper.style.borderStyle = "ridge";
            
            me.p2 = new Panel();
            me.p2.domWrapper.style.borderWidth = "5px;";
            me.p2.domWrapper.style.borderStyle = "ridge";
            me.p3 = new Panel();
            me.p3.domWrapper.style.borderWidth = "5px;";
            me.p3.domWrapper.style.borderStyle = "ridge";
            me.p4 = new H({ nowrapper: true });
            me.p5 = new H({ nowrapper: true });
            this.add(me.p1);
            me.p1.add(me.p2);
            me.p1.add(me.p3);
            this.add(me.p4);
            this.add(me.p5);
            this.height = 25;
            setTimeout(()=>{
                const selection = window.getSelection()
                console.log(me.p2.dom.id);
                const headerElement = document.querySelector('#'+me.p2.dom.id).childNodes[0]
                selection.setBaseAndExtent(headerElement,0,headerElement,2)
            },10000);
    */
        }
    };
    Dialog3 = __decorate([
        (0, Registry_1.$Class)("demo/Dialog3"),
        __metadata("design:paramtypes", [])
    ], Dialog3);
    exports.Dialog3 = Dialog3;
    async function test() {
        var ret = new Dialog3();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog3.js.map