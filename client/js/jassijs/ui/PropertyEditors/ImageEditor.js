var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/base/Actions"], function (require, exports, Editor_1, Jassi_1, Panel_1, Textbox_1, Button_1, Actions_1) {
    "use strict";
    var ImageEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ImageEditor = void 0;
    let ImageEditor = ImageEditor_1 = class ImageEditor extends Editor_1.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_1.Panel( /*{useSpan:true}*/);
            this._button = new Button_1.Button();
            this._textbox = new Textbox_1.Textbox();
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this._button.icon = "mdi mdi-glasses";
            this.component.add(this._textbox);
            this.component.add(this._button);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._button.onclick(() => {
                _this.showDialog();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === void 0 ? void 0 : value.startsWith('"'))
                value = value.substring(1);
            if (value === null || value === void 0 ? void 0 : value.endsWith('"')) {
                value = value.substring(0, value.length - 1);
            }
            this._textbox.value = value;
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
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            if (this.property) {
                this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
                this.propertyEditor.setPropertyInDesign(this.property.name, val);
            }
            super.callEvent("edit", param);
        }
        static async dummy() {
        }
        static async show() {
            await new ImageEditor_1(undefined, undefined).showDialog();
        }
        async showDialog(onlytest = undefined) {
            if (!this.dialog) {
                var _this = this;
                this.dialog = new Panel_1.Panel();
                var suche = new Textbox_1.Textbox();
                var icons = new Panel_1.Panel();
                this.dialog.add(suche);
                this.dialog.add(icons);
                suche.onchange((data) => {
                    var su = suche.value;
                    for (var x = 0; x < icons.dom.children[0].children.length; x++) {
                        var ic = icons.dom.children[0].children[x];
                        if (ic.className.indexOf(su) > -1) {
                            ic.setAttribute("style", "display:inline");
                        }
                        else
                            ic.setAttribute("style", "display:none");
                    }
                });
                var file = (await new Promise((resolve_1, reject_1) => { require(["jassijs/modul"], resolve_1, reject_1); })).default.css["materialdesignicons.min.css"] + "?ooo=9";
                var text = await $.ajax({ method: "get", url: file, crossDomain: true, contentType: "text/plain" });
                var all = text.split("}.");
                var html = "";
                window["ImageEditorClicked"] = function (data) {
                    _this._textbox.value = "mdi " + data;
                    suche.value = data;
                    _this._onchange();
                };
                var len = onlytest ? 20 : all.length;
                for (var x = 1; x < len; x++) {
                    var icon = all[x].split(":")[0];
                    html = html + "<span title='" + icon + "' onclick=ImageEditorClicked('" + icon + "') class='mdi " + icon + "'></span>";
                }
                var node = $("<span style='font-size:18pt'>" + html + "</span>");
                icons.__dom.appendChild(node[0]);
                if (!onlytest)
                    $(this.dialog.__dom).dialog({ height: "400", width: "400" });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "Tools",
            icon: "mdi mdi-tools",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "dummy", null);
    __decorate([
        Actions_1.$Action({
            name: "Tools/Icons",
            icon: "mdi mdi-image-area",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "show", null);
    ImageEditor = ImageEditor_1 = __decorate([
        Actions_1.$ActionProvider("jassijs.base.ActionNode"),
        Editor_1.$PropertyEditor(["image"]),
        Jassi_1.$Class("jassijs.ui.PropertyEditors.ImageEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ImageEditor);
    exports.ImageEditor = ImageEditor;
    function test() {
        var ed = new ImageEditor(undefined, undefined);
        ed.showDialog(true);
        return ed.dialog;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW1hZ2VFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9JbWFnZUVkaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQWNBLElBQWEsV0FBVyxtQkFBeEIsTUFBYSxXQUFZLFNBQVEsZUFBTTtRQUluQzs7OztXQUlHO1FBQ0gsWUFBWSxRQUFRLEVBQUUsY0FBYztZQUNoQyxLQUFLLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2hDLDBDQUEwQztZQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksYUFBSyxFQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsbUJBQW1CLENBQUM7WUFDMUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsS0FBSztnQkFDbEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUUsRUFBRTtnQkFD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LGtDQUFXO0lBK0h4QixTQUFnQixJQUFJO1FBQ2hCLElBQUksRUFBRSxHQUFHLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMvQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUVyQixDQUFDO0lBTEQsb0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGVja2JveCB9IGZyb20gXCJqYXNzaWpzL3VpL0NoZWNrYm94XCI7XHJcbmltcG9ydCB7IEVkaXRvciwgJFByb3BlcnR5RWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0VkaXRvclwiO1xyXG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xyXG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xyXG5pbXBvcnQgeyBPYmplY3RDaG9vc2VyIH0gZnJvbSBcImphc3NpanMvdWkvT2JqZWN0Q2hvb3NlclwiO1xyXG5pbXBvcnQgeyBEQk9iamVjdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9EQk9iamVjdFwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XHJcbmltcG9ydCB7ICRBY3Rpb24sICRBY3Rpb25Qcm92aWRlciB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvQWN0aW9uc1wiO1xyXG5AJEFjdGlvblByb3ZpZGVyKFwiamFzc2lqcy5iYXNlLkFjdGlvbk5vZGVcIilcclxuQCRQcm9wZXJ0eUVkaXRvcihbXCJpbWFnZVwiXSlcclxuQCRDbGFzcyhcImphc3NpanMudWkuUHJvcGVydHlFZGl0b3JzLkltYWdlRWRpdG9yXCIpXHJcbmV4cG9ydCBjbGFzcyBJbWFnZUVkaXRvciBleHRlbmRzIEVkaXRvciB7XHJcbiAgICBfdGV4dGJveDogVGV4dGJveDtcclxuICAgIF9idXR0b246IEJ1dHRvbjtcclxuICAgIGRpYWxvZzogUGFuZWw7XHJcbiAgICAvKipcclxuICAgICAqIENoZWNrYm94IEVkaXRvciBmb3IgYm9vbGVhbiB2YWx1ZXNcclxuICAgICAqIHVzZWQgYnkgUHJvcGVydHlFZGl0b3JcclxuICAgICAqIEBjbGFzcyBqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5Cb29sZWFuRWRpdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnR5LCBwcm9wZXJ0eUVkaXRvcikge1xyXG4gICAgICAgIHN1cGVyKHByb3BlcnR5LCBwcm9wZXJ0eUVkaXRvcik7XHJcbiAgICAgICAgLyoqIEBtZW1iZXIgLSB0aGUgcmVuZWRlcmluZyBjb21wb25lbnQgKiovXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBuZXcgUGFuZWwoLyp7dXNlU3Bhbjp0cnVlfSovKTtcclxuICAgICAgICB0aGlzLl9idXR0b24gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5fdGV4dGJveCA9IG5ldyBUZXh0Ym94KCk7XHJcbiAgICAgICAgdGhpcy5fdGV4dGJveC53aWR0aCA9IFwiY2FsYygxMDAlIC0gMzRweClcIjtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudC5oZWlnaHQgPSAyNDtcclxuICAgICAgICB0aGlzLl9idXR0b24uaWNvbiA9IFwibWRpIG1kaS1nbGFzc2VzXCI7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQuYWRkKHRoaXMuX3RleHRib3gpO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50LmFkZCh0aGlzLl9idXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX3RleHRib3gub25jaGFuZ2UoZnVuY3Rpb24gKHBhcmFtKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9vbmNoYW5nZShwYXJhbSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uLm9uY2xpY2soKCk9PntcclxuICAgICAgICAgICAgX3RoaXMuc2hvd0RpYWxvZygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge29iamVjdH0gb2IgLSB0aGUgb2JqZWN0IHdoaWNoIGlzIGVkaXRlZFxyXG4gICAgICovXHJcbiAgICBzZXQgb2Iob2IpIHtcclxuICAgICAgICBzdXBlci5vYiA9IG9iO1xyXG4gICAgICAgIC8vZGF0YWJpbmRlcixcInByb3BcIlxyXG4gICAgICAgIHZhciB2YWx1ZTpzdHJpbmcgPSB0aGlzLnByb3BlcnR5RWRpdG9yLmdldFByb3BlcnR5VmFsdWUodGhpcy5wcm9wZXJ0eSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYodmFsdWU/LnN0YXJ0c1dpdGgoJ1wiJykpXHJcbiAgICAgICAgICAgIHZhbHVlPXZhbHVlLnN1YnN0cmluZygxKTtcclxuICAgICAgICBpZih2YWx1ZT8uZW5kc1dpdGgoJ1wiJykpe1xyXG4gICAgICAgICAgICB2YWx1ZT12YWx1ZS5zdWJzdHJpbmcoMCx2YWx1ZS5sZW5ndGgtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3RleHRib3gudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICB9XHJcbiAgICBnZXQgb2IoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX29iO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAqIGdldCB0aGUgcmVuZGVyZXIgZm9yIHRoZSBQcm9wZXJ0eUVkaXRvclxyXG4gICAqIEByZXR1cm5zIC0gdGhlIFVJLWNvbXBvbmVudCBmb3IgdGhlIGVkaXRvclxyXG4gICAqL1xyXG4gICAgZ2V0Q29tcG9uZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIGludGVybiB0aGUgdmFsdWUgY2hhbmdlc1xyXG4gICAgKiBAcGFyYW0ge3R5cGV9IHBhcmFtXHJcbiAgICAqL1xyXG4gICAgX29uY2hhbmdlKHBhcmFtID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuX3RleHRib3gudmFsdWU7XHJcbiAgICAgICAgaWYodGhpcy5wcm9wZXJ0eSl7XHJcbiAgICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3Iuc2V0UHJvcGVydHlJbkNvZGUodGhpcy5wcm9wZXJ0eS5uYW1lLCAnXCInK3ZhbCsnXCInKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluRGVzaWduKHRoaXMucHJvcGVydHkubmFtZSwgdmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIuY2FsbEV2ZW50KFwiZWRpdFwiLCBwYXJhbSk7XHJcbiAgICB9XHJcbiAgICAgIEAkQWN0aW9uKHtcclxuICAgICAgICBuYW1lOiBcIlRvb2xzXCIsXHJcbiAgICAgICBpY29uOiBcIm1kaSBtZGktdG9vbHNcIixcclxuICAgIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgZHVtbXkoKXtcclxuICAgIH1cclxuICAgICBAJEFjdGlvbih7XHJcbiAgICAgICAgbmFtZTogXCJUb29scy9JY29uc1wiLFxyXG4gICAgICAgaWNvbjogXCJtZGkgbWRpLWltYWdlLWFyZWFcIixcclxuICAgIH0pXHJcbiAgICBzdGF0aWMgYXN5bmMgc2hvdygpe1xyXG4gICAgICAgIGF3YWl0IG5ldyBJbWFnZUVkaXRvcih1bmRlZmluZWQsdW5kZWZpbmVkKS5zaG93RGlhbG9nKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBzaG93RGlhbG9nKG9ubHl0ZXN0PXVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICghdGhpcy5kaWFsb2cpIHtcclxuICAgICAgICAgICAgdmFyIF90aGlzPXRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgICAgIHZhciBzdWNoZSA9IG5ldyBUZXh0Ym94KCk7XHJcbiAgICAgICAgICAgIHZhciBpY29ucyA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5hZGQoc3VjaGUpO1xyXG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5hZGQoaWNvbnMpO1xyXG4gICAgICAgICAgICBzdWNoZS5vbmNoYW5nZSgoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1OmFueSA9IHN1Y2hlLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBpY29ucy5kb20uY2hpbGRyZW5bMF0uY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWMgPSBpY29ucy5kb20uY2hpbGRyZW5bMF0uY2hpbGRyZW5beF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGljLmNsYXNzTmFtZS5pbmRleE9mKHN1KSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGljLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTppbmxpbmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGljLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwiZGlzcGxheTpub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSAoYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9tb2R1bFwiKSkuZGVmYXVsdC5jc3NbXCJtYXRlcmlhbGRlc2lnbmljb25zLm1pbi5jc3NcIl0gKyBcIj9vb289OVwiO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGF3YWl0ICQuYWpheCh7IG1ldGhvZDogXCJnZXRcIiwgdXJsOiBmaWxlLCBjcm9zc0RvbWFpbjogdHJ1ZSwgY29udGVudFR5cGU6IFwidGV4dC9wbGFpblwiIH0pO1xyXG4gICAgICAgICAgICB2YXIgYWxsID0gdGV4dC5zcGxpdChcIn0uXCIpXHJcbiAgICAgICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICAgICAgd2luZG93W1wiSW1hZ2VFZGl0b3JDbGlja2VkXCJdID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl90ZXh0Ym94LnZhbHVlPVwibWRpIFwiK2RhdGE7XHJcbiAgICAgICAgICAgICAgICBzdWNoZS52YWx1ZT1kYXRhO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX29uY2hhbmdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGxlbj1vbmx5dGVzdD8yMDphbGwubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMTsgeCA8IGxlbjsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWNvbiA9IGFsbFt4XS5zcGxpdChcIjpcIilbMF07XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sICsgXCI8c3BhbiB0aXRsZT0nXCIgKyBpY29uICsgXCInIG9uY2xpY2s9SW1hZ2VFZGl0b3JDbGlja2VkKCdcIiArIGljb24gKyBcIicpIGNsYXNzPSdtZGkgXCIgKyBpY29uICsgXCInPjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbm9kZSA9ICQoXCI8c3BhbiBzdHlsZT0nZm9udC1zaXplOjE4cHQnPlwiICsgaHRtbCArIFwiPC9zcGFuPlwiKTtcclxuICAgICAgICAgICAgaWNvbnMuX19kb20uYXBwZW5kQ2hpbGQobm9kZVswXSk7XHJcbiAgICAgICAgICAgIGlmKCFvbmx5dGVzdClcclxuICAgICAgICAgICAgICAgICQodGhpcy5kaWFsb2cuX19kb20pLmRpYWxvZyh7IGhlaWdodDogXCI0MDBcIiwgd2lkdGg6IFwiNDAwXCIgfSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAkKHRoaXMuZGlhbG9nLl9fZG9tKS5kaWFsb2coXCJvcGVuXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgZWQgPSBuZXcgSW1hZ2VFZGl0b3IodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xyXG4gICAgZWQuc2hvd0RpYWxvZyh0cnVlKTtcclxuICAgIHJldHVybiBlZC5kaWFsb2c7XHJcbiAgICBcclxufVxyXG5cclxuIl19