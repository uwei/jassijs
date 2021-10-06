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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sb3JFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9Db2xvckVkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBVUEsSUFBSSxNQUFNLEdBQUMsQ0FBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsU0FBUyxFQUFDLE9BQU8sRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLFdBQVcsRUFBQyxjQUFjLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLGdCQUFnQixFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsV0FBVyxFQUFDLFdBQVcsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxVQUFVLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxVQUFVLEVBQUMsZUFBZSxFQUFDLFVBQVUsRUFBQyxXQUFXLEVBQUMsVUFBVSxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsZ0JBQWdCLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxTQUFTLEVBQUMsWUFBWSxFQUFDLGNBQWMsRUFBQyxlQUFlLEVBQUMsZUFBZSxFQUFDLGVBQWUsRUFBQyxlQUFlLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxhQUFhLEVBQUMsU0FBUyxFQUFDLFNBQVMsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUFDLGFBQWEsRUFBQyxhQUFhLEVBQUMsV0FBVyxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLGFBQWEsRUFBQyxNQUFNLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUMsUUFBUSxFQUFD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QUksR0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUN2QixJQUFJLE9BQU8sR0FBQyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25CLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBSSxJQUFJLEdBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3QixLQUFLLEVBQUUsTUFBTTtTQUNmLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLEdBQUMsTUFBTSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUMsTUFBTSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQztJQWJELHNCQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQcm9wZXJ0eUVkaXRvcn0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JcIjtcbmltcG9ydCB7RWRpdG9yLCAgJFByb3BlcnR5RWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0VkaXRvclwiO1xuaW1wb3J0IHtUZXh0Ym94fSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcImphc3NpanMvdWkvU2VsZWN0XCI7XG5pbXBvcnQgeyBsb2FkRm9udElmTmVkZGVkIH0gZnJvbSBcImphc3NpanMvdWkvQ1NTUHJvcGVydGllc1wiO1xuaW1wb3J0IFwiamFzc2lqcy9leHQvc3BlY3RydW1cIjtcbmltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcbnZhciBjb2xvcnM9W1wiYmxhY2tcIixcInNpbHZlclwiLFwiZ3JheVwiLFwid2hpdGVcIixcIm1hcm9vblwiLFwicmVkXCIsXCJwdXJwbGVcIixcImZ1Y2hzaWFcIixcImdyZWVuXCIsXCJsaW1lXCIsXCJvbGl2ZVwiLFwieWVsbG93XCIsXCJuYXZ5XCIsXCJibHVlXCIsXCJ0ZWFsXCIsXCJhcXVhXCIsXCJvcmFuZ2VcIixcImFsaWNlYmx1ZVwiLFwiYW50aXF1ZXdoaXRlXCIsXCJhcXVhbWFyaW5lXCIsXCJhenVyZVwiLFwiYmVpZ2VcIixcImJpc3F1ZVwiLFwiYmxhbmNoZWRhbG1vbmRcIixcImJsdWV2aW9sZXRcIixcImJyb3duXCIsXCJidXJseXdvb2RcIixcImNhZGV0Ymx1ZVwiLFwiY2hhcnRyZXVzZVwiLFwiY2hvY29sYXRlXCIsXCJjb3JhbFwiLFwiY29ybmZsb3dlcmJsdWVcIixcImNvcm5zaWxrXCIsXCJjcmltc29uXCIsXCJkYXJrYmx1ZVwiLFwiZGFya2N5YW5cIixcImRhcmtnb2xkZW5yb2RcIixcImRhcmtncmF5XCIsXCJkYXJrZ3JlZW5cIixcImRhcmtncmV5XCIsXCJkYXJra2hha2lcIixcImRhcmttYWdlbnRhXCIsXCJkYXJrb2xpdmVncmVlblwiLFwiZGFya29yYW5nZVwiLFwiZGFya29yY2hpZFwiLFwiZGFya3JlZFwiLFwiZGFya3NhbG1vblwiLFwiZGFya3NlYWdyZWVuXCIsXCJkYXJrc2xhdGVibHVlXCIsXCJkYXJrc2xhdGVncmF5XCIsXCJkYXJrc2xhdGVncmV5XCIsXCJkYXJrdHVycXVvaXNlXCIsXCJkYXJrdmlvbGV0XCIsXCJkZWVwcGlua1wiLFwiZGVlcHNreWJsdWVcIixcImRpbWdyYXlcIixcImRpbWdyZXlcIixcImRvZGdlcmJsdWVcIixcImZpcmVicmlja1wiLFwiZmxvcmFsd2hpdGVcIixcImZvcmVzdGdyZWVuXCIsXCJnYWluc2Jvcm9cIixcImdob3N0d2hpdGVcIixcImdvbGRcIixcImdvbGRlbnJvZFwiLFwiZ3JlZW55ZWxsb3dcIixcImdyZXlcIixcImhvbmV5ZGV3XCIsXCJob3RwaW5rXCIsXCJpbmRpYW5yZWRcIixcImluZGlnb1wiLFwiaXZvcnlcIixcImtoYWtpXCIsXCJsYXZlbmRlclwiLFwibGF2ZW5kZXJibHVzaFwiLFwibGF3bmdyZWVuXCIsXCJsZW1vbmNoaWZmb25cIixcImxpZ2h0Ymx1ZVwiLFwibGlnaHRjb3JhbFwiLFwibGlnaHRjeWFuXCIsXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiLFwibGlnaHRncmF5XCIsXCJsaWdodGdyZWVuXCIsXCJsaWdodGdyZXlcIixcImxpZ2h0cGlua1wiLFwibGlnaHRzYWxtb25cIixcImxpZ2h0c2VhZ3JlZW5cIixcImxpZ2h0c2t5Ymx1ZVwiLFwibGlnaHRzbGF0ZWdyYXlcIixcImxpZ2h0c2xhdGVncmV5XCIsXCJsaWdodHN0ZWVsYmx1ZVwiLFwibGlnaHR5ZWxsb3dcIixcImxpbWVncmVlblwiLFwibGluZW5cIixcIm1lZGl1bWFxdWFtYXJpbmVcIixcIm1lZGl1bWJsdWVcIixcIm1lZGl1bW9yY2hpZFwiLFwibWVkaXVtcHVycGxlXCIsXCJtZWRpdW1zZWFncmVlblwiLFwibWVkaXVtc2xhdGVibHVlXCIsXCJtZWRpdW1zcHJpbmdncmVlblwiLFwibWVkaXVtdHVycXVvaXNlXCIsXCJtZWRpdW12aW9sZXRyZWRcIixcIm1pZG5pZ2h0Ymx1ZVwiLFwibWludGNyZWFtXCIsXCJtaXN0eXJvc2VcIixcIm1vY2Nhc2luXCIsXCJuYXZham93aGl0ZVwiLFwib2xkbGFjZVwiLFwib2xpdmVkcmFiXCIsXCJvcmFuZ2VyZWRcIixcIm9yY2hpZFwiLFwicGFsZWdvbGRlbnJvZFwiLFwicGFsZWdyZWVuXCIsXCJwYWxldHVycXVvaXNlXCIsXCJwYWxldmlvbGV0cmVkXCIsXCJwYXBheWF3aGlwXCIsXCJwZWFjaHB1ZmZcIixcInBlcnVcIixcInBpbmtcIixcInBsdW1cIixcInBvd2RlcmJsdWVcIixcInJvc3licm93blwiLFwicm95YWxibHVlXCIsXCJzYWRkbGVicm93blwiLFwic2FsbW9uXCIsXCJzYW5keWJyb3duXCIsXCJzZWFncmVlblwiLFwic2Vhc2hlbGxcIixcInNpZW5uYVwiLFwic2t5Ymx1ZVwiLFwic2xhdGVibHVlXCIsXCJzbGF0ZWdyYXlcIixcInNsYXRlZ3JleVwiLFwic25vd1wiLFwic3ByaW5nZ3JlZW5cIixcInN0ZWVsYmx1ZVwiLFwidGFuXCIsXCJ0aGlzdGxlXCIsXCJ0b21hdG9cIixcInR1cnF1b2lzZVwiLFwidmlvbGV0XCIsXCJ3aGVhdFwiLFwid2hpdGVzbW9rZVwiLFwieWVsbG93Z3JlZW5cIixcInJlYmVjY2FwdXJwbGVcIl07XG5AJFByb3BlcnR5RWRpdG9yKFtcImNvbG9yXCJdKVxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JzLkNvbG9yRWRpdG9yXCIpXG4vKipcbiogRWRpdG9yIGZvciBjb2xvclxuKiB1c2VkIGJ5IFByb3BlcnR5RWRpdG9yXG4qKi9cbmV4cG9ydCBjbGFzcyBDb2xvckVkaXRvciBleHRlbmRzIEVkaXRvcntcblx0aWNvbjpUZXh0Ym94O1xuXHRzZWxlY3Q6U2VsZWN0O1xuICAgIGNvbnN0cnVjdG9yKCBwcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3IpIHtcbiAgICBcdHN1cGVyKHByb3BlcnR5LCBwcm9wZXJ0eUVkaXRvcik7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8qKiBAbWVtYmVyIC0gdGhlIHJlbmVkZXJpbmcgY29tcG9uZW50ICoqL1xuICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG5ldyBCb3hQYW5lbCgpO1xuXHRcdHRoaXMuY29tcG9uZW50Lmhvcml6b250YWw9dHJ1ZTtcblx0XHR0aGlzLmljb249bmV3IFRleHRib3goKTtcblx0XHR0aGlzLmljb24ud2lkdGg9XCIxMHB4XCI7XG5cdFx0dGhpcy5zZWxlY3Q9bmV3IFNlbGVjdCgpO1xuXHRcdHRoaXMuc2VsZWN0LndpZHRoPVwiODVweFwiO1xuXHRcdHRoaXMuY29tcG9uZW50LmFkZCh0aGlzLnNlbGVjdCk7XG5cdFx0dGhpcy5jb21wb25lbnQuYWRkKHRoaXMuaWNvbik7XG5cdFx0dGhpcy5zZWxlY3QuaXRlbXM9Y29sb3JzO1xuXHRcdHRoaXMuc2VsZWN0LmRpc3BsYXk9ZnVuY3Rpb24oY29sb3I6c3RyaW5nKXtcblx0XHRcdHJldHVybiBcIjxzcGFuPjxkaXYgc3R5bGU9J2Zsb2F0OmxlZnQ7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtiYWNrZ3JvdW5kOlwiK2NvbG9yK1wiJz48L2Rpdj5cIitjb2xvcitcIjwvc3Bhbj5cIlxuXHRcdH1cblx0XHR2YXIgc3BlYz0kKHRoaXMuaWNvbi5kb20pW1wic3BlY3RydW1cIl0oe1xuXHQgICAgXHRjb2xvcjogXCIjZjAwXCIsXG5cdCAgICBcdGNoYW5nZTogZnVuY3Rpb24oY29sb3IpIHtcblx0ICAgIFx0XHR2YXIgc2NvbG9yPWNvbG9yLnRvSGV4U3RyaW5nKCk7XG5cdCAgICBcdFx0dmFyIG9sZDpzdHJpbmdbXT1fdGhpcy5zZWxlY3QuaXRlbXM7XG5cdCAgICBcdFx0aWYob2xkLmluZGV4T2Yoc2NvbG9yKT09PS0xKVxuXHQgICAgXHRcdFx0b2xkLnB1c2goc2NvbG9yKTtcbiAgICBcdFx0XHRfdGhpcy5zZWxlY3QuaXRlbXM9b2xkO1xuXHQgICAgXHRcdF90aGlzLnNlbGVjdC52YWx1ZT1zY29sb3I7XG5cdCAgICBcdFx0X3RoaXMuX29uY2hhbmdlKHt9KTtcblx0Ly9cdFx0ICAgIF90aGlzLnBhbGV0dGVDaGFuZ2VkKGNvbG9yLnRvSGV4U3RyaW5nKCkpOyAvLyAjZmYwMDAwXG5cdFx0XHR9XG5cdCBcdH0pO1xuXHQgXHQvL2NvcnJlY3QgaGVpZ2h0XG5cdCBcdHZhciBidD0kKHRoaXMuaWNvbi5kb21XcmFwcGVyKS5maW5kKFwiLnNwLXByZXZpZXdcIik7XG5cdCBcdGJ0LmNzcyhcIndpZHRoXCIsXCI4cHhcIik7XG5cdCBcdGJ0LmNzcyhcImhlaWdodFwiLFwiOHB4XCIpO1xuXHQgXHR2YXIgYng9JCh0aGlzLmljb24uZG9tV3JhcHBlcikuZmluZChcIi5zcC1yZXBsYWNlclwiKTtcblx0IFx0YnguY3NzKFwiaGVpZ2h0XCIsXCIxMHB4XCIpO1xuXHRcdGJ4LmNzcyhcIndpZHRoXCIsXCIxMHB4XCIpO1xuXHQgXHR2YXIgYnA9JCh0aGlzLmljb24uZG9tV3JhcHBlcikuZmluZChcIi5zcC1kZFwiKTtcblx0IFx0YnAuY3NzKFwiaGVpZ2h0XCIsXCI2cHhcIik7XG5cdCBcdC8vc3BlYy53aWR0aD1cIjEwcHhcIjtcbiAgICAgLy8gICB0aGlzLmNvbXBvbmVudC5kb209Zm9udFswXTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2VsZWN0Lm9uY2hhbmdlKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgICAgX3RoaXMuX29uY2hhbmdlKHBhcmFtKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSBvYiAtIHRoZSBvYmplY3Qgd2hpY2ggaXMgZWRpdGVkXG4gICAgICovXG4gICAgc2V0IG9iKG9iKSB7XG4gICAgICAgIHN1cGVyLm9iID0gb2I7XG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucHJvcGVydHlFZGl0b3IuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLnByb3BlcnR5KTtcbiAgICAgICAgaWYodmFsdWU9PT1udWxsfHx2YWx1ZT09PXVuZGVmaW5lZHx8dmFsdWU9PT1cIlwiKVxuICAgICAgICBcdHZhbHVlPVwiXCI7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICAgJCh0aGlzLmljb24uZG9tKVtcInNwZWN0cnVtXCJdKFwic2V0XCIsIHZhbHVlKTtcbiAgICAgICAgIFxuICAgICAgICB2YXIgb2xkOnN0cmluZ1tdPXRoaXMuc2VsZWN0Lml0ZW1zO1xuXHQgICAgaWYob2xkLmluZGV4T2YodmFsdWUpPT09LTEpXG5cdCAgICBcdG9sZC5wdXNoKHZhbHVlKTtcblx0ICAgIHRoaXMuc2VsZWN0Lml0ZW1zPW9sZDtcdFx0XHRcbiAgICAgICAgdGhpcy5zZWxlY3QudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IG9iKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAqIGdldCB0aGUgcmVuZGVyZXIgZm9yIHRoZSBQcm9wZXJ0eUVkaXRvclxuICAgKiBAcmV0dXJucyAtIHRoZSBVSS1jb21wb25lbnQgZm9yIHRoZSBlZGl0b3JcbiAgICovXG4gICAgZ2V0Q29tcG9uZW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQ7XG4gICAgfVxuICAgIHBhbGV0dGVDaGFuZ2VkKGNvbG9yOnN0cmluZyl7XG4gICAgXHQvL3ZhciB2YWwgPSAgXCJcXFwiXCIgKyBjb2xvciArIFwiXFxcIlwiO1xuICAgICAgICAvL3RoaXMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUodGhpcy5wcm9wZXJ0eS5uYW1lLCB2YWwpO1xuICAgICAgICAvL3RoaXMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkRlc2lnbih0aGlzLnByb3BlcnR5Lm5hbWUsIGNvbG9yKTtcbiAgICAgICAgdGhpcy5zZWxlY3QudmFsdWU9Y29sb3I7XG4gICAgICAgIC8vc3VwZXIuY2FsbEV2ZW50KFwiZWRpdFwiLCBjb2xvcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaW50ZXJuIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAgICogQHBhcmFtIHt0eXBlfSBwYXJhbVxuICAgICAqL1xuICAgIF9vbmNoYW5nZShwYXJhbSkge1xuICAgIFx0IHZhciB2YWwgPSB0aGlzLnNlbGVjdC52YWx1ZTtcbiAgICAgICAgICAgIHZhbCA9IFwiXFxcIlwiICsgdmFsICsgXCJcXFwiXCI7XG4gICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUodGhpcy5wcm9wZXJ0eS5uYW1lLCB2YWwpO1xuICAgICAgICB2YXIgb3ZhbD10aGlzLnNlbGVjdC52YWx1ZTtcbiAgICAgICAgJCh0aGlzLmljb24uZG9tKVtcInNwZWN0cnVtXCJdKFwic2V0XCIsIG92YWwpO1xuICAgICAgICB0aGlzLnByb3BlcnR5RWRpdG9yLnNldFByb3BlcnR5SW5EZXNpZ24odGhpcy5wcm9wZXJ0eS5uYW1lLCBvdmFsKTtcbiAgICAgICAgc3VwZXIuY2FsbEV2ZW50KFwiZWRpdFwiLCBwYXJhbSk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QzKCl7XG5cdFxuXHR2YXIgcHJvcD1uZXcgUHJvcGVydHlFZGl0b3IoKTtcblx0cHJvcC52YWx1ZT1uZXcgVGV4dGJveCgpO1xuXHRyZXR1cm4gcHJvcDtcbn0gXG5leHBvcnQgZnVuY3Rpb24gdGVzdDIoKXtcblx0dmFyIHBhbmVsPW5ldyBCb3hQYW5lbCgpO1xuXHRwYW5lbC5ob3Jpem9udGFsPWZhbHNlO1xuXHR2YXIgaWNvbj1uZXcgVGV4dGJveCgpO1xuXHR2YXIgdGV4dGJveD1uZXcgVGV4dGJveCgpO1xuXHRwYW5lbC5hZGQodGV4dGJveCk7XG5cdHBhbmVsLmFkZChpY29uKTtcblx0dmFyIHNwZWM9JChpY29uLmRvbSlbXCJzcGVjdHJ1bVwiXSh7XG4gICAgXHRjb2xvcjogXCIjZjAwXCJcbiBcdH0pO1xuIFx0c3BlYy53aWR0aD1cIjEwcHhcIjtcbiBcdHNwZWMuaGVpZ2h0PVwiMTBweFwiO1xuXHRyZXR1cm4gcGFuZWw7XG59XG4iXX0=