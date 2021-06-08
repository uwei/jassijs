var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Select", "jassijs/ui/BoxPanel", "jassijs/ext/spectrum"], function (require, exports, PropertyEditor_1, Editor_1, Textbox_1, Jassi_1, Select_1, BoxPanel_1) {
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
            var bt = $(this.icon.domWrapper).find(".sp-preview");
            bt.css("width", "8px");
            bt.css("height", "8px");
            var bx = $(this.icon.domWrapper).find(".sp-replacer");
            bx.css("height", "10px");
            bx.css("width", "10px");
            var bp = $(this.icon.domWrapper).find(".sp-dd");
            bp.css("height", "6px");
            //spec.width="10px";
            //   this.component.dom=font[0];
            this.select.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (!value || value === "")
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
        Editor_1.$PropertyEditor(["color"]),
        Jassi_1.$Class("jassijs.ui.PropertyEditors.ColorEditor")
        /**
        * Editor for color
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], ColorEditor);
    exports.ColorEditor = ColorEditor;
    function test3() {
        var prop = new PropertyEditor_1.PropertyEditor(undefined);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sb3JFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9Db2xvckVkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBVUEsSUFBSSxNQUFNLEdBQUMsQ0FBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFdBQVcsRUFBQyxjQUFjLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLGdCQUFnQixFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxVQUFVLEVBQUMsZUFBZSxFQUFDLFVBQVUsRUFBQyxXQUFXLEVBQUMsVUFBVSxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsZ0JBQWdCLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxTQUFTLEVBQUMsWUFBWSxFQUFDLGNBQWMsRUFBQyxlQUFlLEVBQUMsZUFBZSxFQUFDLGVBQWUsRUFBQyxlQUFlLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLGFBQWEsRUFBQyxhQUFhLEVBQUMsV0FBVyxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsVUFBVSxFQUFDLGVBQWUsRUFBQyxXQUFXLEVBQUMsY0FBYyxFQUFDLFdBQVcsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLHNCQUFzQixFQUFDLFdBQVcsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsZUFBZSxFQUFDLGNBQWMsRUFBQyxnQkFBZ0IsRUFBQyxnQkFBZ0IsRUFBQyxnQkFBZ0IsRUFBQyxhQUFhLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxZQUFZLEVBQUMsY0FBYyxFQUFDLGNBQWMsRUFBQyxnQkFBZ0IsRUFBQyxpQkFBaUIsRUFBQyxtQkFBbUIsRUFBQyxpQkFBaUIsRUFBQyxpQkFBaUIsRUFBQyxjQUFjLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxVQUFVLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxlQUFlLEVBQUMsV0FBVyxFQUFDLGVBQWUsRUFBQyxlQUFlLEVBQUMsWUFBWSxFQUFDLFdBQVcsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsUUFBUSxFQUFDLFlBQVksRUFBQyxVQUFVLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxXQUFXLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxXQUFXLEVBQUMsS0FBSyxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUMsWUFBWSxFQUFDLGFBQWEsRUFBQyxlQUFlLENBQUMsQ0FBQztJQU9sdUQsSUFBYSxXQUFXO0lBSnhCOzs7T0FHRztJQUNILE1BQWEsV0FBWSxTQUFRLGVBQU07UUFHbkMsWUFBYSxRQUFRLEVBQUUsY0FBYztZQUNwQyxLQUFLLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQzdCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQiwwQ0FBMEM7WUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBQyxJQUFJLENBQUM7WUFDL0IsSUFBSSxDQUFDLElBQUksR0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBQyxNQUFNLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLE1BQU0sQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sR0FBQyxVQUFTLEtBQVk7Z0JBQ3hDLE9BQU8saUVBQWlFLEdBQUMsS0FBSyxHQUFDLFVBQVUsR0FBQyxLQUFLLEdBQUMsU0FBUyxDQUFBO1lBQzFHLENBQUMsQ0FBQTtZQUNELElBQUksSUFBSSxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUNsQyxLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsVUFBUyxLQUFLO29CQUNyQixJQUFJLE1BQU0sR0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQy9CLElBQUksR0FBRyxHQUFVLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNwQyxJQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUcsQ0FBQyxDQUFDO3dCQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNsQixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUM7b0JBQ3ZCLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFDLE1BQU0sQ0FBQztvQkFDMUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDMUIsNkRBQTZEO2dCQUMzRCxDQUFDO2FBQ0EsQ0FBQyxDQUFDO1lBQ0gsZ0JBQWdCO1lBQ2hCLElBQUksRUFBRSxHQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNuRCxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQyxLQUFLLENBQUMsQ0FBQztZQUN0QixFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixJQUFJLEVBQUUsR0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUMsTUFBTSxDQUFDLENBQUM7WUFDekIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsSUFBSSxFQUFFLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLG9CQUFvQjtZQUNsQixnQ0FBZ0M7WUFFN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxLQUFLO2dCQUNoQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRVAsQ0FBQztRQUNEOztXQUVHO1FBQ0gsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNMLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEUsSUFBRyxDQUFDLEtBQUssSUFBRSxLQUFLLEtBQUcsRUFBRTtnQkFDcEIsS0FBSyxHQUFDLEVBQUUsQ0FBQzs7Z0JBRU4sS0FBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTVDLElBQUksR0FBRyxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3RDLElBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBRyxDQUFDLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUMsR0FBRyxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUM5QixDQUFDO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3BCLENBQUM7UUFFRDs7O1NBR0M7UUFDRCxZQUFZO1lBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFCLENBQUM7UUFDRCxjQUFjLENBQUMsS0FBWTtZQUMxQixpQ0FBaUM7WUFDOUIsaUVBQWlFO1lBQ2pFLHFFQUFxRTtZQUNyRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBQyxLQUFLLENBQUM7WUFDeEIsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRDs7O1dBR0c7UUFDSCxTQUFTLENBQUMsS0FBSztZQUNiLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3RCLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9ELElBQUksSUFBSSxHQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDSixDQUFBO0lBbkdZLFdBQVc7UUFOdkIsd0JBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLGNBQU0sQ0FBQyx3Q0FBd0MsQ0FBQztRQUNqRDs7O1dBR0c7OztPQUNVLFdBQVcsQ0FtR3ZCO0lBbkdZLGtDQUFXO0lBb0d4QixTQUFnQixLQUFLO1FBRXBCLElBQUksSUFBSSxHQUFDLElBQUksK0JBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsS0FBSyxHQUFDLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUxELHNCQUtDO0lBQ0QsU0FBZ0IsS0FBSztRQUNwQixJQUFJLEtBQUssR0FBQyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztRQUN6QixLQUFLLENBQUMsVUFBVSxHQUFDLEtBQUssQ0FBQztRQUN2QixJQUFJLElBQUksR0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUN2QixJQUFJLE9BQU8sR0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBSSxJQUFJLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3QixLQUFLLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLEdBQUMsTUFBTSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQWJELHNCQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQcm9wZXJ0eUVkaXRvcn0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JcIjtcbmltcG9ydCB7RWRpdG9yLCAgJFByb3BlcnR5RWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0VkaXRvclwiO1xuaW1wb3J0IHtUZXh0Ym94fSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcImphc3NpanMvdWkvU2VsZWN0XCI7XG5pbXBvcnQgeyBsb2FkRm9udElmTmVkZGVkIH0gZnJvbSBcImphc3NpanMvdWkvQ1NTUHJvcGVydGllc1wiO1xuaW1wb3J0IFwiamFzc2lqcy9leHQvc3BlY3RydW1cIjtcbmltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcbnZhciBjb2xvcnM9W1wiYmxhY2tcIixcInNpbHZlclwiLFwiZ3JheVwiLFwid2hpdGVcIixcIm1hcm9vblwiLFwicmVkXCIsXCJwdXJwbGVcIixcImZ1Y2hzaWFcIixcImdyZWVuXCIsXCJsaW1lXCIsXCJvbGl2ZVwiLFwieWVsbG93XCIsXCJuYXZ5XCIsXCJibHVlXCIsXCJ0ZWFsXCIsXCJhcXVhXCIsXCJvcmFuZ2VcIixcImFsaWNlYmx1ZVwiLFwiYW50aXF1ZXdoaXRlXCIsXCJhcXVhbWFyaW5lXCIsXCJhenVyZVwiLFwiYmVpZ2VcIixcImJpc3F1ZVwiLFwiYmxhbmNoZWRhbG1vbmRcIixcImJsdWV2aW9sZXRcIixcImJyb3duXCIsXCJidXJseXdvb2RcIixcImNhZGV0Ymx1ZVwiLFwiY2hhcnRyZXVzZVwiLFwiY2hvY29sYXRlXCIsXCJjb3JhbFwiLFwiY29ybmZsb3dlcmJsdWVcIixcImNvcm5zaWxrXCIsXCJjcmltc29uXCIsXCJkYXJrYmx1ZVwiLFwiZGFya2N5YW5cIixcImRhcmtnb2xkZW5yb2RcIixcImRhcmtncmF5XCIsXCJkYXJrZ3JlZW5cIixcImRhcmtncmV5XCIsXCJkYXJra2hha2lcIixcImRhcmttYWdlbnRhXCIsXCJkYXJrb2xpdmVncmVlblwiLFwiZGFya29yYW5nZVwiLFwiZGFya29yY2hpZFwiLFwiZGFya3JlZFwiLFwiZGFya3NhbG1vblwiLFwiZGFya3NlYWdyZWVuXCIsXCJkYXJrc2xhdGVibHVlXCIsXCJkYXJrc2xhdGVncmF5XCIsXCJkYXJrc2xhdGVncmV5XCIsXCJkYXJrdHVycXVvaXNlXCIsXCJkYXJrdmlvbGV0XCIsXCJkZWVwcGlua1wiLFwiZGVlcHNreWJsdWVcIixcImRpbWdyYXlcIixcImRpbWdyZXlcIixcImRvZGdlcmJsdWVcIixcImZpcmVicmlja1wiLFwiZmxvcmFsd2hpdGVcIixcImZvcmVzdGdyZWVuXCIsXCJnYWluc2Jvcm9cIixcImdob3N0d2hpdGVcIixcImdvbGRcIixcImdvbGRlbnJvZFwiLFwiZ3JlZW55ZWxsb3dcIixcImdyZXlcIixcImhvbmV5ZGV3XCIsXCJob3RwaW5rXCIsXCJpbmRpYW5yZWRcIixcImluZGlnb1wiLFwiaXZvcnlcIixcImtoYWtpXCIsXCJsYXZlbmRlclwiLFwibGF2ZW5kZXJibHVzaFwiLFwibGF3bmdyZWVuXCIsXCJsZW1vbmNoaWZmb25cIixcImxpZ2h0Ymx1ZVwiLFwibGlnaHRjb3JhbFwiLFwibGlnaHRjeWFuXCIsXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiLFwibGlnaHRncmF5XCIsXCJsaWdodGdyZWVuXCIsXCJsaWdodGdyZXlcIixcImxpZ2h0cGlua1wiLFwibGlnaHRzYWxtb25cIixcImxpZ2h0c2VhZ3JlZW5cIixcImxpZ2h0c2t5Ymx1ZVwiLFwibGlnaHRzbGF0ZWdyYXlcIixcImxpZ2h0c2xhdGVncmV5XCIsXCJsaWdodHN0ZWVsYmx1ZVwiLFwibGlnaHR5ZWxsb3dcIixcImxpbWVncmVlblwiLFwibGluZW5cIixcIm1lZGl1bWFxdWFtYXJpbmVcIixcIm1lZGl1bWJsdWVcIixcIm1lZGl1bW9yY2hpZFwiLFwibWVkaXVtcHVycGxlXCIsXCJtZWRpdW1zZWFncmVlblwiLFwibWVkaXVtc2xhdGVibHVlXCIsXCJtZWRpdW1zcHJpbmdncmVlblwiLFwibWVkaXVtdHVycXVvaXNlXCIsXCJtZWRpdW12aW9sZXRyZWRcIixcIm1pZG5pZ2h0Ymx1ZVwiLFwibWludGNyZWFtXCIsXCJtaXN0eXJvc2VcIixcIm1vY2Nhc2luXCIsXCJuYXZham93aGl0ZVwiLFwib2xkbGFjZVwiLFwib2xpdmVkcmFiXCIsXCJvcmFuZ2VyZWRcIixcIm9yY2hpZFwiLFwicGFsZWdvbGRlbnJvZFwiLFwicGFsZWdyZWVuXCIsXCJwYWxldHVycXVvaXNlXCIsXCJwYWxldmlvbGV0cmVkXCIsXCJwYXBheWF3aGlwXCIsXCJwZWFjaHB1ZmZcIixcInBlcnVcIixcInBpbmtcIixcInBsdW1cIixcInBvd2RlcmJsdWVcIixcInJvc3licm93blwiLFwicm95YWxibHVlXCIsXCJzYWRkbGVicm93blwiLFwic2FsbW9uXCIsXCJzYW5keWJyb3duXCIsXCJzZWFncmVlblwiLFwic2Vhc2hlbGxcIixcInNpZW5uYVwiLFwic2t5Ymx1ZVwiLFwic2xhdGVibHVlXCIsXCJzbGF0ZWdyYXlcIixcInNsYXRlZ3JleVwiLFwic25vd1wiLFwic3ByaW5nZ3JlZW5cIixcInN0ZWVsYmx1ZVwiLFwidGFuXCIsXCJ0aGlzdGxlXCIsXCJ0b21hdG9cIixcInR1cnF1b2lzZVwiLFwidmlvbGV0XCIsXCJ3aGVhdFwiLFwid2hpdGVzbW9rZVwiLFwieWVsbG93Z3JlZW5cIixcInJlYmVjY2FwdXJwbGVcIl07XG5AJFByb3BlcnR5RWRpdG9yKFtcImNvbG9yXCJdKVxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JzLkNvbG9yRWRpdG9yXCIpXG4vKipcbiogRWRpdG9yIGZvciBjb2xvclxuKiB1c2VkIGJ5IFByb3BlcnR5RWRpdG9yXG4qKi9cbmV4cG9ydCBjbGFzcyBDb2xvckVkaXRvciBleHRlbmRzIEVkaXRvcntcblx0aWNvbjpUZXh0Ym94O1xuXHRzZWxlY3Q6U2VsZWN0O1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3IpIHtcbiAgICBcdHN1cGVyKHByb3BlcnR5LCBwcm9wZXJ0eUVkaXRvcik7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8qKiBAbWVtYmVyIC0gdGhlIHJlbmVkZXJpbmcgY29tcG9uZW50ICoqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG5ldyBCb3hQYW5lbCgpO1xuXHRcdHRoaXMuY29tcG9uZW50Lmhvcml6b250YWw9dHJ1ZTtcblx0XHR0aGlzLmljb249bmV3IFRleHRib3goKTtcblx0XHR0aGlzLmljb24ud2lkdGg9XCIxMHB4XCI7XG5cdFx0dGhpcy5zZWxlY3Q9bmV3IFNlbGVjdCgpO1xuXHRcdHRoaXMuc2VsZWN0LndpZHRoPVwiODVweFwiO1xuXHRcdHRoaXMuY29tcG9uZW50LmFkZCh0aGlzLnNlbGVjdCk7XG5cdFx0dGhpcy5jb21wb25lbnQuYWRkKHRoaXMuaWNvbik7XG5cdFx0dGhpcy5zZWxlY3QuaXRlbXM9Y29sb3JzO1xuXHRcdHRoaXMuc2VsZWN0LmRpc3BsYXk9ZnVuY3Rpb24oY29sb3I6c3RyaW5nKXtcblx0XHRcdHJldHVybiBcIjxzcGFuPjxkaXYgc3R5bGU9J2Zsb2F0OmxlZnQ7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtiYWNrZ3JvdW5kOlwiK2NvbG9yK1wiJz48L2Rpdj5cIitjb2xvcitcIjwvc3Bhbj5cIlxuXHRcdH1cblx0XHR2YXIgc3BlYz0kKHRoaXMuaWNvbi5kb20pW1wic3BlY3RydW1cIl0oe1xuXHQgICAgXHRjb2xvcjogXCIjZjAwXCIsXG5cdCAgICBcdGNoYW5nZTogZnVuY3Rpb24oY29sb3IpIHtcblx0ICAgIFx0XHR2YXIgc2NvbG9yPWNvbG9yLnRvSGV4U3RyaW5nKCk7XG5cdCAgICBcdFx0dmFyIG9sZDpzdHJpbmdbXT1fdGhpcy5zZWxlY3QuaXRlbXM7XG5cdCAgICBcdFx0aWYob2xkLmluZGV4T2Yoc2NvbG9yKT09PS0xKVxuXHQgICAgXHRcdFx0b2xkLnB1c2goc2NvbG9yKTtcbiAgICBcdFx0XHRfdGhpcy5zZWxlY3QuaXRlbXM9b2xkO1xuXHQgICAgXHRcdF90aGlzLnNlbGVjdC52YWx1ZT1zY29sb3I7XG5cdCAgICBcdFx0X3RoaXMuX29uY2hhbmdlKHt9KTtcblx0Ly9cdFx0ICAgIF90aGlzLnBhbGV0dGVDaGFuZ2VkKGNvbG9yLnRvSGV4U3RyaW5nKCkpOyAvLyAjZmYwMDAwXG5cdFx0XHR9XG5cdCBcdH0pO1xuXHQgXHQvL2NvcnJlY3QgaGVpZ2h0XG5cdCBcdHZhciBidD0kKHRoaXMuaWNvbi5kb21XcmFwcGVyKS5maW5kKFwiLnNwLXByZXZpZXdcIik7XG5cdCBcdGJ0LmNzcyhcIndpZHRoXCIsXCI4cHhcIik7XG5cdCBcdGJ0LmNzcyhcImhlaWdodFwiLFwiOHB4XCIpO1xuXHQgXHR2YXIgYng9JCh0aGlzLmljb24uZG9tV3JhcHBlcikuZmluZChcIi5zcC1yZXBsYWNlclwiKTtcblx0IFx0YnguY3NzKFwiaGVpZ2h0XCIsXCIxMHB4XCIpO1xuXHRcdGJ4LmNzcyhcIndpZHRoXCIsXCIxMHB4XCIpO1xuXHQgXHR2YXIgYnA9JCh0aGlzLmljb24uZG9tV3JhcHBlcikuZmluZChcIi5zcC1kZFwiKTtcblx0IFx0YnAuY3NzKFwiaGVpZ2h0XCIsXCI2cHhcIik7XG5cdCBcdC8vc3BlYy53aWR0aD1cIjEwcHhcIjtcbiAgICAgLy8gICB0aGlzLmNvbXBvbmVudC5kb209Zm9udFswXTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2VsZWN0Lm9uY2hhbmdlKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgICAgX3RoaXMuX29uY2hhbmdlKHBhcmFtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSBvYiAtIHRoZSBvYmplY3Qgd2hpY2ggaXMgZWRpdGVkXG4gICAgICovXG4gICAgc2V0IG9iKG9iKSB7XG4gICAgICAgIHN1cGVyLm9iID0gb2I7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucHJvcGVydHlFZGl0b3IuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLnByb3BlcnR5KTtcbiAgICAgICAgaWYoIXZhbHVlfHx2YWx1ZT09PVwiXCIpXG4gICAgICAgIFx0dmFsdWU9XCJcIjtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMSwgdmFsdWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAkKHRoaXMuaWNvbi5kb20pW1wic3BlY3RydW1cIl0oXCJzZXRcIiwgdmFsdWUpO1xuICAgICAgICAgXG4gICAgICAgIHZhciBvbGQ6c3RyaW5nW109dGhpcy5zZWxlY3QuaXRlbXM7XG5cdCAgICBpZihvbGQuaW5kZXhPZih2YWx1ZSk9PT0tMSlcblx0ICAgIFx0b2xkLnB1c2godmFsdWUpO1xuXHQgICAgdGhpcy5zZWxlY3QuaXRlbXM9b2xkO1x0XHRcdFxuICAgICAgICB0aGlzLnNlbGVjdC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgb2IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vYjtcbiAgICB9XG5cbiAgICAvKipcbiAgICogZ2V0IHRoZSByZW5kZXJlciBmb3IgdGhlIFByb3BlcnR5RWRpdG9yXG4gICAqIEByZXR1cm5zIC0gdGhlIFVJLWNvbXBvbmVudCBmb3IgdGhlIGVkaXRvclxuICAgKi9cbiAgICBnZXRDb21wb25lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudDtcbiAgICB9XG4gICAgcGFsZXR0ZUNoYW5nZWQoY29sb3I6c3RyaW5nKXtcbiAgICBcdC8vdmFyIHZhbCA9ICBcIlxcXCJcIiArIGNvbG9yICsgXCJcXFwiXCI7XG4gICAgICAgIC8vdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZSh0aGlzLnByb3BlcnR5Lm5hbWUsIHZhbCk7XG4gICAgICAgIC8vdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluRGVzaWduKHRoaXMucHJvcGVydHkubmFtZSwgY29sb3IpO1xuICAgICAgICB0aGlzLnNlbGVjdC52YWx1ZT1jb2xvcjtcbiAgICAgICAgLy9zdXBlci5jYWxsRXZlbnQoXCJlZGl0XCIsIGNvbG9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpbnRlcm4gdGhlIHZhbHVlIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0ge3R5cGV9IHBhcmFtXG4gICAgICovXG4gICAgX29uY2hhbmdlKHBhcmFtKSB7XG4gICAgXHQgdmFyIHZhbCA9IHRoaXMuc2VsZWN0LnZhbHVlO1xuICAgICAgICAgICAgdmFsID0gXCJcXFwiXCIgKyB2YWwgKyBcIlxcXCJcIjtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZSh0aGlzLnByb3BlcnR5Lm5hbWUsIHZhbCk7XG4gICAgICAgIHZhciBvdmFsPXRoaXMuc2VsZWN0LnZhbHVlO1xuICAgICAgICAkKHRoaXMuaWNvbi5kb20pW1wic3BlY3RydW1cIl0oXCJzZXRcIiwgb3ZhbCk7XG4gICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkRlc2lnbih0aGlzLnByb3BlcnR5Lm5hbWUsIG92YWwpO1xuICAgICAgICBzdXBlci5jYWxsRXZlbnQoXCJlZGl0XCIsIHBhcmFtKTtcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gdGVzdDMoKXtcblx0XG5cdHZhciBwcm9wPW5ldyBQcm9wZXJ0eUVkaXRvcih1bmRlZmluZWQpO1xuXHRwcm9wLnZhbHVlPW5ldyBUZXh0Ym94KCk7XG5cdHJldHVybiBwcm9wO1xufSBcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0Migpe1xuXHR2YXIgcGFuZWw9bmV3IEJveFBhbmVsKCk7XG5cdHBhbmVsLmhvcml6b250YWw9ZmFsc2U7XG5cdHZhciBpY29uPW5ldyBUZXh0Ym94KCk7XG5cdHZhciB0ZXh0Ym94PW5ldyBUZXh0Ym94KCk7XG5cdHBhbmVsLmFkZCh0ZXh0Ym94KTtcblx0cGFuZWwuYWRkKGljb24pO1xuXHR2YXIgc3BlYz0kKGljb24uZG9tKVtcInNwZWN0cnVtXCJdKHtcbiAgICBcdGNvbG9yOiBcIiNmMDBcIlxuIFx0fSk7XG4gXHRzcGVjLndpZHRoPVwiMTBweFwiO1xuIFx0c3BlYy5oZWlnaHQ9XCIxMHB4XCI7XG5cdHJldHVybiBwYW5lbDtcbn1cbiJdfQ==