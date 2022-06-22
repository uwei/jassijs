var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Select", "jassijs/ui/BoxPanel", "jassijs/ext/spectrum"], function (require, exports, PropertyEditor_1, Editor_1, Textbox_1, Registry_1, Select_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test3 = exports.ColorEditor = void 0;
    var colors = ["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "orange", "aliceblue", "antiquewhite", "aquamarine", "azure", "beige", "bisque", "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "wheat", "whitesmoke", "yellowgreen", "rebeccapurple"];
    let ColorEditor = 
    /**
    * Editor for color
    * used by PropertyEditor
    **/
    class ColorEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            var _this = this;
            /** @member - the renedering component **/
            this.component = new BoxPanel_1.BoxPanel();
            this.component.horizontal = true;
            this.icon = new Textbox_1.Textbox();
            this.icon.width = "10px";
            this.select = new Select_1.Select();
            this.select.width = "85px";
            this.component.add(this.select);
            this.component.add(this.icon);
            this.select.items = colors;
            this.select.display = function (color) {
                return "<span><div style='float:left;width:10px;height:10px;background:" + color + "'></div>" + color + "</span>";
            };
            var spec = $(this.icon.dom)["spectrum"]({
                color: "#f00",
                change: function (color) {
                    var scolor = color.toHexString();
                    var old = _this.select.items;
                    if (old.indexOf(scolor) === -1)
                        old.push(scolor);
                    _this.select.items = old;
                    _this.select.value = scolor;
                    _this._onchange({});
                    //		    _this.paletteChanged(color.toHexString()); // #ff0000
                }
            });
            //correct height
            var bt = this.icon.domWrapper.querySelector(".sp-preview");
            bt.style.width = "8px";
            bt.style.height = "8px";
            var bx = this.icon.domWrapper.querySelector(".sp-replacer");
            bx.style.height = "10px";
            bx.style.width = "10px";
            var bp = this.icon.domWrapper.querySelector(".sp-dd");
            bp.style.height = "6px";
            //spec.width="10px";
            //   this.component.dom=font[0];
            this.select.onchange(function (param) {
                _this._onchange(param);
            });
        }
        onedit(param) {
            super.onedit(param);
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === undefined || value === "")
                value = "";
            else
                value = value.substring(1, value.length - 1);
            $(this.icon.dom)["spectrum"]("set", value);
            var old = this.select.items;
            if (old.indexOf(value) === -1)
                old.push(value);
            this.select.items = old;
            this.select.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        paletteChanged(color) {
            //var val =  "\"" + color + "\"";
            //this.propertyEditor.setPropertyInCode(this.property.name, val);
            //this.propertyEditor.setPropertyInDesign(this.property.name, color);
            this.select.value = color;
            //super.callEvent("edit", color);
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.select.value;
            val = "\"" + val + "\"";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.select.value;
            $(this.icon.dom)["spectrum"]("set", oval);
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    ColorEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["color"]),
        (0, Registry_1.$Class)("jassijs.ui.PropertyEditors.ColorEditor")
        /**
        * Editor for color
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], ColorEditor);
    exports.ColorEditor = ColorEditor;
    function test3() {
        var prop = new PropertyEditor_1.PropertyEditor();
        prop.value = new Textbox_1.Textbox();
        return prop;
    }
    exports.test3 = test3;
    function test2() {
        var panel = new BoxPanel_1.BoxPanel();
        panel.horizontal = false;
        var icon = new Textbox_1.Textbox();
        var textbox = new Textbox_1.Textbox();
        panel.add(textbox);
        panel.add(icon);
        var spec = $(icon.dom)["spectrum"]({
            color: "#f00"
        });
        spec.width = "10px";
        spec.height = "10px";
        return panel;
    }
    exports.test2 = test2;
});
//# sourceMappingURL=ColorEditor.js.map