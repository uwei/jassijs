var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Image"], function (require, exports, Registry_1, Image_1) {
    "use strict";
    var DesignDummy_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignDummy = void 0;
    let DesignDummy = DesignDummy_1 = class DesignDummy extends Image_1.Image {
        constructor() {
            super();
        }
        static createIfNeeded(designDummyFor, type, editorselectthis = undefined, oclass = undefined) {
            var icon = "mdi mdi-card-plus-outline";
            if (type === "beforeComponent")
                icon = "mdi mdi-card-plus";
            if (designDummyFor["designDummies"]) {
                for (var x = 0; x < designDummyFor["designDummies"].length; x++) {
                    var du = designDummyFor["designDummies"][x];
                    if (du.type === type)
                        return du;
                }
            }
            var designDummy;
            if (oclass === undefined)
                designDummy = new DesignDummy_1();
            else
                designDummy = new oclass();
            designDummy.designDummyFor = designDummyFor;
            designDummy.type = type;
            designDummy._parent = designDummyFor;
            designDummy.editorselectthis = editorselectthis;
            designDummy.domWrapper.classList.remove("jcomponent");
            designDummy.domWrapper.classList.add("jdesigndummy");
            designDummy.domWrapper.style.width = "16px";
            if ((oclass === null || oclass === void 0 ? void 0 : oclass._classname) === 'jassijs.ui.MenuItem') {
                designDummy.icon = icon;
            }
            else
                designDummy.src = icon;
            if (type === "atEnd")
                designDummyFor.add(designDummy);
            if (type === "beforeComponent")
                designDummyFor.domWrapper.prepend(designDummy.domWrapper);
            if (!designDummyFor["designDummies"])
                designDummyFor["designDummies"] = [];
            designDummyFor["designDummies"].push(designDummy);
            designDummy.dom.classList.add("designerNoResizable");
            return designDummy;
            //
        }
        static destroyIfNeeded(designDummyFor, type) {
            if (designDummyFor["designDummies"]) {
                designDummyFor["designDummies"].forEach((dummy) => {
                    if (dummy["type"] === type) {
                        if (type === "atEnd")
                            designDummyFor.remove(dummy);
                        if (type === "beforeComponent")
                            designDummyFor.domWrapper.removeChild(dummy.domWrapper);
                        //(<Container>designDummyFor).remove(dummy); // comp.domWrapper.removeChild(comp["_designDummyPre"].domWrapper);
                        dummy.destroy();
                        /*dummy.domWrapper.parentNode.removeChild(dummy.domWrapper)
                        var pos=designDummyFor["designDummies"].indexOf(dummy);
                        if(pos>=0)
                            designDummyFor["designDummies"].splice(pos, 1);*/
                    }
                });
            }
        }
    };
    DesignDummy = DesignDummy_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.DesignDummy"),
        __metadata("design:paramtypes", [])
    ], DesignDummy);
    exports.DesignDummy = DesignDummy;
});
//# sourceMappingURL=DesignDummy.js.map