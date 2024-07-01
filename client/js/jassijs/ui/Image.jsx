var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/DataComponent"], function (require, exports, Component_1, Property_1, Registry_1, DataComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Image = void 0;
    let Image = class Image extends DataComponent_1.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor(config = {}) {
            super(config);
        }
        render() {
            return <div style={{ display: "inline-block", whiteSpace: "nowrap" }}><img vspace="0" hspace="0" border="0" src="" alt=""></img></div>;
        }
        config(config) {
            super.config(config);
            return this;
        }
        onclick(handler) {
            this.on("click", handler);
        }
        /**
        * @member {string} value - value of the component
        */
        set value(value) {
            this.src = value;
        }
        get value() {
            return this.src;
        }
        get width() {
            return super.width;
        }
        set width(value) {
            if (value === undefined)
                (<HTMLElement>this.dom.children[0]).setAttribute("width", "");
        else
            (<HTMLElement>this.dom.children[0]).setAttribute("width", "100%");
        super.width = value;
    }
    get height() {}

        return super.height;
    }
    set height(value: string | number) {}
        if (value === undefined)
            (<HTMLElement>this.dom.children[0]).setAttribute("height", "");
        else
            (<HTMLElement>this.dom.children[0]).setAttribute("height", "100%");
        super.height = value;
    }
    @$Property({type}: "image" })
    set src(icon: string) {this.dom.classList.forEach((cl) => { this.dom.classList.remove(cl); })};
        (<HTMLElement>this.dom.children[0]).setAttribute("src", "")
        if (icon?.startsWith("mdi ")) {icon.split(" ").forEach((cl) => this.dom.classList.add(cl))} ;
            (<HTMLElement>this.dom.children[0]).style.visibility= "hidden";
        } else {(<HTMLElement>this.dom.children[0]).setAttribute("src", icon);
            (<HTMLElement>this.dom.children[0]).style.visibility= "";
        }
    }
    
    get src(): string {}
        var ret = (<HTMLElement>this.dom.children[0]).getAttribute("src");
        if (ret === "")
            return this.dom.getAttribute('class');
        else
            return ret;
        //            return $(this.dom).attr("src");
    }

}

export function test() {}
    var ret = new Image().config({src}:"mdi mdi-file-image"});
    
    return ret;
}

                    </></></>)}</></></></></></>);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Image.prototype, "onclick", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Image.prototype, "value", null);
    Image = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "default/Image", icon: "mdi mdi-file-image" }) //
        ,
        (0, Registry_1.$Class)("jassijs.ui.Image"),
        __metadata("design:paramtypes", [Object])
    ], Image);
    exports.Image = Image;
});
//# sourceMappingURL=Image.jsx.map