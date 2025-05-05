var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/DataComponent"], function (require, exports, Registry_1, Property_1, DataComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HTMLPanel = void 0;
    var bugtinymce = undefined;
    //@$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ })
    let HTMLPanel = class HTMLPanel extends DataComponent_1.DataComponent {
        constructor(properties = {}) {
            super(properties);
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.newlineafter = false;
        }
        render() {
            return React.createElement("div", { contentEditable: "false", className: "HTMLPanel", tabIndex: -1 },
                React.createElement("div", { className: "HTMLPanelContent" }, " "));
        }
        config(config) {
            super.config(config);
            return this;
        }
        get newlineafter() {
            return this.dom.style.display === "inline-block";
        }
        set newlineafter(value) {
            this.dom.style.display = value ? "" : "inline-block";
            this.domWrapper.style.display = value ? "" : "inline-block";
            this.dom.children[0].style.display = value ? "" : "inline-block";
        }
        compileTemplate(template) {
            return new Function('obj', 'with(obj){ return \'' +
                template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                    return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
                }).join('') +
                '\'; }');
        }
        get template() {
            return this._template;
        }
        set template(value) {
            this._template = value;
            this.value = this.value; //reformat value
        }
        /**
         * @member {string} code - htmlcode of the component
         **/
        set value(code) {
            var scode = code;
            this.state.value.current = code;
            if (this.template) {
                if (this.state.value.current === undefined)
                    scode = "";
                else {
                    try {
                        scode = this.compileTemplate(this.template)(code);
                    }
                    catch (err) {
                        scode = err.message;
                    }
                }
            }
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(scode);
                this.dom.appendChild(el);
            }
            else
                el.innerHTML = scode;
        }
        get value() {
            return this.state.value.current;
        }
        destroy() {
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ description: "line break after element", default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel.prototype, "newlineafter", null);
    __decorate([
        (0, Property_1.$Property)({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "template", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "value", null);
    HTMLPanel = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.HTMLPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel);
    exports.HTMLPanel = HTMLPanel;
    function test() {
        var ret = new HTMLPanel();
        ret.value = "<span style='font-size: 12px;' data-mce-style='font-size: 12px;'>dsf<span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>g<strong>sdfgsd</strong>fgsdfg</span></span><br><strong><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>sdfgsdgsdf</span>gfdsg</strong>";
        ret.height = 400;
        ret.width = 400;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=HTMLPanel.js.map