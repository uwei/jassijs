var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Button", "jassijs/ui/Property", "jassijs/ui/Component"], function (require, exports, Registry_1, Button_1, Property_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$UIComponent = exports.UIComponentProperties = void 0;
    Registry_1 = __importStar(Registry_1);
    jassijs.includeCSSFile("jassijs.css");
    jassijs.includeCSSFile("materialdesignicons.min.css");
    //@$UIComponent is used so this file is loaded with ComponentPalette
    //vergleichen
    //jeder bekommt componentid
    //gehe durch baum wenn dom_component fehlt, dann ist kopiert und muss mit id von componentid gerenderd werden
    class UIComponentProperties {
    }
    exports.UIComponentProperties = UIComponentProperties;
    function $UIComponent(properties) {
        return function (pclass) {
            Registry_1.default.register("$UIComponent", pclass, properties);
        };
    }
    exports.$UIComponent = $UIComponent;
    let DummyButton = class DummyButton {
    };
    DummyButton = __decorate([
        $UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        (0, Property_1.$Property)({ name: "text", type: "string" }),
        (0, Property_1.$Property)({ name: "onclick", type: "function", default: "function(event){\n\t\n}" }),
        (0, Property_1.$Property)({ name: "icon", type: "image" }),
        (0, Registry_1.$Class)("jassijs.ui.Button", Button_1.Button)
    ], DummyButton);
    let DummyComponent = class DummyComponent {
    };
    DummyComponent = __decorate([
        (0, Property_1.$Property)({ name: "useWrapper", type: "boolean", description: "wraps the component with div" }),
        (0, Property_1.$Property)({ name: "onfocus", type: "function", default: "function(event){\n\t\n}" }),
        (0, Property_1.$Property)({ name: "onblur", type: "function", default: "function(event){\n\t\n}" }),
        (0, Property_1.$Property)({ name: "label", type: "string", description: "adds a label above the component" }),
        (0, Property_1.$Property)({ name: "tooltip", type: "string", description: "tooltip are displayed on mouse over" }),
        (0, Property_1.$Property)({ name: "x", type: "number" }),
        (0, Property_1.$Property)({ name: "y", type: "number" }),
        (0, Property_1.$Property)({ name: "hidden", type: "boolean" }),
        (0, Property_1.$Property)({ name: "width", type: "number" }),
        (0, Property_1.$Property)({ name: "height", type: "number" }),
        (0, Property_1.$Property)({ name: "style", type: "json", componentType: "jassijs.ui.CSSProperties" }),
        (0, Property_1.$Property)({ name: "styles", type: "componentselector", componentType: "[jassijs.ui.Style]" }),
        (0, Property_1.$Property)({ name: "contextMenu", type: "componentselector", componentType: "jassijs.ui.ContextMenu" }),
        (0, Registry_1.$Class)("jassijs.ui.Component", Component_1.Component)
    ], DummyComponent);
    let DummyHTMLComponent = class DummyHTMLComponent {
    };
    DummyHTMLComponent = __decorate([
        (0, Property_1.$Property)({ name: "children", type: "jassijs.ui.Component", createDummyInDesigner: doCreateDummyForHTMLComponent }),
        $UIComponent({ fullPath: "common/HTMLComponent", icon: "mdi mdi-cloud-tags", initialize: { tag: "input" }, }),
        (0, Registry_1.$Class)("jassijs.ui.HTMLComponent", Component_1.HTMLComponent)
    ], DummyHTMLComponent);
    function doCreateDummyForHTMLComponent(component, isPreDummy) {
        var disabledBoth = ["tr", "td", "th"];
        var enabledPost = ["div", "ol", "ul"];
        var disabledPre = [];
        var tag = component === null || component === void 0 ? void 0 : component.tag;
        if (tag === undefined)
            return false;
        if (disabledBoth.indexOf(tag.toLowerCase()) !== -1) {
            return false;
        }
        else if (isPreDummy && disabledPre.indexOf(tag.toLowerCase()) !== -1) {
            return false;
        }
        else if (!isPreDummy && enabledPost.indexOf(tag.toLowerCase()) !== -1) {
            return true;
        }
        return isPreDummy; //prodummy is enabled at default / postdummy is disabled 
    }
    let DummyTextComponent = class DummyTextComponent {
    };
    DummyTextComponent = __decorate([
        (0, Property_1.$Property)({
            name: "tag",
            type: "string",
            chooseFromStrict: true,
            chooseFrom: (comp) => {
                const allElements = document.body.getElementsByTagName('*');
                const uniqueTags = new Set();
                for (let element of allElements) {
                    uniqueTags.add(element.tagName.toLowerCase());
                }
                return Array.from(uniqueTags).sort();
            }
        }),
        (0, Property_1.$Property)({ name: "text", type: "string" }),
        (0, Registry_1.$Class)("jassijs.ui.TextComponent", Component_1.TextComponent)
    ], DummyTextComponent);
    ;
});
//# sourceMappingURL=UIComponent.js.map