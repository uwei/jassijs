var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs_report/RComponent"], function (require, exports, Jassi_1, Property_1, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RImage = void 0;
    //mdi-format-list-numbered
    let RImage = 
    //@$Property({name:"horizontal",hide:true})
    class RImage extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "image";
            this._image = "";
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
        set image(value) {
            this._image = value;
            if (value === undefined)
                $(this.dom).attr("src", "");
            else {
                //later we have a parent
                var report = RComponent_1.RComponent.findReport(this);
                var _this = this;
                if (report === undefined) {
                    if (_this["nextTry"] === undefined) { //deny recurse
                        setTimeout(() => {
                            _this["nextTry"] = true;
                            _this.image = value;
                        }, 200);
                    }
                    else {
                        delete _this["nextTry"];
                    }
                }
                else {
                    var im = report.images;
                    if (im !== undefined && im[value] !== undefined) {
                        $(this.dom).attr("src", im[value]);
                    }
                    else {
                        $(this.dom).attr("src", value);
                    }
                }
            }
        }
        get image() {
            return this._image;
        }
        set fit(value) {
            this._fit = value;
            if (value === undefined) {
                $(this.__dom).css("object-fit", "");
                this.width = this.width;
                this.height = this.height;
            }
            else {
                $(this.__dom).css("object-fit", "contain");
                $(this.__dom).css("width", value[0]);
                $(this.__dom).css("height", value[1]);
            }
        }
        get fit() {
            return this._fit;
        }
        set opacity(value) {
            this._opacity = value;
            if (value === undefined) {
                $(this.__dom).css("opacity", "");
            }
            else {
                $(this.__dom).css("opacity", value);
            }
        }
        get opacity() {
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
        fromJSON(ob) {
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
    };
    __decorate([
        (0, Property_1.$Property)({
            type: "rimage",
            chooseFrom: (data) => {
                debugger;
                return [];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RImage.prototype, "image", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number[]", decription: "fit in rectangle width, height e.g. 10,20" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RImage.prototype, "fit", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number" }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RImage.prototype, "opacity", null);
    RImage = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Image", icon: "mdi mdi-image-frame" }),
        (0, Jassi_1.$Class)("jassijs_report.RImage")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RImage);
    exports.RImage = RImage;
});
//# sourceMappingURL=RImage.js.map