var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/ext/split"], function (require, exports, Panel_1, Jassi_1, Component_1, Property_1, Classes_1, split_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.BoxPanel = void 0;
    let BoxPanel = class BoxPanel extends Panel_1.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            $(this.domWrapper).addClass('BoxPanel').removeClass('Panel');
            this.horizontal = false;
            $(this.dom).css("display", "flex");
        }
        config(config) {
            super.config(config);
            return this;
        }
        set horizontal(value) {
            this._horizontal = value;
            if (value)
                $(this.dom).css("flex-direction", "row");
            else
                $(this.dom).css("flex-direction", "column");
            this.updateSpliter();
        }
        get horizontal() {
            return this._horizontal;
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            /* if(this._horizontal){
                        $(component.domWrapper).css("display","table-row");
             }else{
                        $(component.domWrapper).css("display","table-cell");
             }*/
            super.add(component);
            this.updateSpliter();
        }
        /**
        * adds a component to the container before an other component
        * @param {jassijs.ui.Component} component - the component to add
        * @param {jassijs.ui.Component} before - the component before then component to add
        */
        addBefore(component, before) {
            /*if(this._horizontal){
                    $(component.domWrapper).css("display","table-row");
               }else{
                    $(component.domWrapper).css("display","table-cell");
               }*/
            super.addBefore(component, before);
            this.updateSpliter();
        }
        set spliter(size) {
            this._spliter = size;
            this.updateSpliter();
        }
        get spliter() {
            return this._spliter;
        }
        updateSpliter() {
            if (this._splitcomponent) {
                this._splitcomponent.destroy();
                this._splitcomponent = undefined;
            }
            if (!this._spliter)
                return;
            var comp = [];
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                //test
                $(this._components[x].__dom).css("overflow", "scroll");
                $(this._components[x].__dom).css("width", this.horizontal ? "calc(100% - 5px)" : "100%");
                $(this._components[x].__dom).css("height", this.horizontal ? "100%" : "calc(100% - 5px)");
                comp.push(this._components[x].domWrapper);
            }
            this._splitcomponent = (0, split_1.default)(comp, {
                sizes: this._spliter,
                gutterSize: 8,
                minSize: [50, 50, 50, 50, 50, 50, 50, 50],
                direction: this.horizontal ? 'horizontal' : 'vertical'
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: true }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], BoxPanel.prototype, "horizontal", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number[]", description: "set the size of splitter e.g. [40,60] the firstcomponent size is 40%" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], BoxPanel.prototype, "spliter", null);
    BoxPanel = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        (0, Jassi_1.$Class)("jassijs.ui.BoxPanel"),
        (0, Property_1.$Property)({ name: "isAbsolute", hide: true, type: "boolean" }),
        __metadata("design:paramtypes", [Object])
    ], BoxPanel);
    exports.BoxPanel = BoxPanel;
    async function test() {
        var HTMLPanel = await Classes_1.classes.loadClass("jassijs.ui.HTMLPanel");
        var ret = new BoxPanel();
        var me = {};
        ret["me"] = me;
        ret.horizontal = true;
        me.tb = new HTMLPanel();
        me.tb2 = new HTMLPanel();
        me.tb.value = "l&ouml;&auml;k&ouml;lk &ouml;lsfdk sd&auml;&ouml;flgkdf ";
        me.tb.width = 135;
        me.tb2.value = "löäkölk ölsfdk sdäöflgkdf ";
        ret.add(me.tb);
        ret.add(me.tb2);
        ret.spliter = [40, 60];
        ret.height = 50;
        ret.width = "100%";
        return ret;
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm94UGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3VpL0JveFBhbmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUF3QkEsSUFBYSxRQUFRLEdBQXJCLE1BQWEsUUFBUyxTQUFRLGFBQUs7UUFJL0I7Ozs7OztVQU1FO1FBQ0YsWUFBWSxVQUFVLEdBQUcsU0FBUztZQUM5QixLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDO1FBRUQsTUFBTSxDQUFDLE1BQXNCO1lBQ3pCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQWM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDekIsSUFBSSxLQUFLO2dCQUNMLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDOztnQkFFekMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXpCLENBQUM7UUFFRCxJQUFJLFVBQVU7WUFDVixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDNUIsQ0FBQztRQUNEOzs7VUFH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Q0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ25CLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQWpCRCxvQkFpQkM7SUFDRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFuZWwsIFBhbmVsQ29uZmlnIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcbmltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgJFVJQ29tcG9uZW50LCBDb21wb25lbnRDb25maWcgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcbi8vQHRzLWlnbm9yZVxuaW1wb3J0IFNwbGl0IGZyb20gXCJqYXNzaWpzL2V4dC9zcGxpdFwiO1xuaW1wb3J0IHsgSFRNTFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvSFRNTFBhbmVsXCI7XG5cblxuZXhwb3J0IGludGVyZmFjZSBCb3hQYW5lbENvbmZpZyBleHRlbmRzIFBhbmVsQ29uZmlnIHtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtib29sZWFufSAtIGlmIHRydWUgdGhlbiB0aGUgY29tcG9uZW50cyBhcmUgY29tcG9zZWQgaG9yaXpvbnRhbGx5XG4gICAgICoqL1xuICAgIGhvcml6b250YWw/OiBib29sZWFuO1xuICAgIC8qKlxuICAgICAgKiBzZXQgdGhlIHNpemUgb2Ygc3BsaXR0ZXIgZS5nLiBbNDAsNjBdIHRoZSBmaXJzdGNvbXBvbmVudCBzaXplIGlzIDQwJVxuICAgICAgKi9cbiAgICBzcGxpdGVyPzogbnVtYmVyW107XG59XG5cbkAkVUlDb21wb25lbnQoeyBmdWxsUGF0aDogXCJjb21tb24vQm94UGFuZWxcIiwgaWNvbjogXCJtZGkgbWRpLXZpZXctc2VxdWVudGlhbC1vdXRsaW5lXCIsIGVkaXRhYmxlQ2hpbGRDb21wb25lbnRzOiBbXCJ0aGlzXCJdIH0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5Cb3hQYW5lbFwiKVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwiaXNBYnNvbHV0ZVwiLCBoaWRlOiB0cnVlLCB0eXBlOiBcImJvb2xlYW5cIiB9KVxuZXhwb3J0IGNsYXNzIEJveFBhbmVsIGV4dGVuZHMgUGFuZWwgaW1wbGVtZW50cyBCb3hQYW5lbENvbmZpZyB7XG4gICAgX2hvcml6b250YWw6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfc3BsaXRlcjogbnVtYmVyW107XG4gICAgcHJpdmF0ZSBfc3BsaXRjb21wb25lbnQ6IGFueTtcbiAgICAvKipcbiAgICAqXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtwcm9wZXJ0aWVzLmlkXSAtICBjb25uZWN0IHRvIGV4aXN0aW5nIGlkIChub3QgcmVxaXJlZClcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BlcnRpZXMudXNlU3Bhbl0gLSAgdXNlIHNwYW4gbm90IGRpdlxuICAgICpcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXMgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VwZXIocHJvcGVydGllcyk7XG4gICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5hZGRDbGFzcygnQm94UGFuZWwnKS5yZW1vdmVDbGFzcygnUGFuZWwnKTtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gZmFsc2U7XG4gICAgICAgICQodGhpcy5kb20pLmNzcyhcImRpc3BsYXlcIiwgXCJmbGV4XCIpO1xuICAgIH1cblxuICAgIGNvbmZpZyhjb25maWc6IEJveFBhbmVsQ29uZmlnKTogQm94UGFuZWwge1xuICAgICAgICBzdXBlci5jb25maWcoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldCBob3Jpem9udGFsKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2hvcml6b250YWwgPSB2YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlKVxuICAgICAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwiZmxleC1kaXJlY3Rpb25cIiwgXCJyb3dcIik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICQodGhpcy5kb20pLmNzcyhcImZsZXgtZGlyZWN0aW9uXCIsIFwiY29sdW1uXCIpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNwbGl0ZXIoKTtcblxuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogdHJ1ZSB9KVxuICAgIGdldCBob3Jpem9udGFsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faG9yaXpvbnRhbDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBhZGRzIGEgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXJcbiAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gYWRkXG4gICAgKi9cbiAgICBhZGQoY29tcG9uZW50KSB7XG4gICAgICAgIC8qIGlmKHRoaXMuX2hvcml6b250YWwpe1xuICAgICAgICAgICAgICAgICAgICAkKGNvbXBvbmVudC5kb21XcmFwcGVyKS5jc3MoXCJkaXNwbGF5XCIsXCJ0YWJsZS1yb3dcIik7XG4gICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgJChjb21wb25lbnQuZG9tV3JhcHBlcikuY3NzKFwiZGlzcGxheVwiLFwidGFibGUtY2VsbFwiKTtcbiAgICAgICAgIH0qL1xuICAgICAgICBzdXBlci5hZGQoY29tcG9uZW50KTtcbiAgICAgICAgdGhpcy51cGRhdGVTcGxpdGVyKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICogYWRkcyBhIGNvbXBvbmVudCB0byB0aGUgY29udGFpbmVyIGJlZm9yZSBhbiBvdGhlciBjb21wb25lbnRcbiAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gYWRkXG4gICAgKiBAcGFyYW0ge2phc3NpanMudWkuQ29tcG9uZW50fSBiZWZvcmUgLSB0aGUgY29tcG9uZW50IGJlZm9yZSB0aGVuIGNvbXBvbmVudCB0byBhZGRcbiAgICAqL1xuICAgIGFkZEJlZm9yZShjb21wb25lbnQsIGJlZm9yZSkge1xuICAgICAgICAvKmlmKHRoaXMuX2hvcml6b250YWwpe1xuICAgICAgICAgICAgICAgICQoY29tcG9uZW50LmRvbVdyYXBwZXIpLmNzcyhcImRpc3BsYXlcIixcInRhYmxlLXJvd1wiKTtcbiAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJChjb21wb25lbnQuZG9tV3JhcHBlcikuY3NzKFwiZGlzcGxheVwiLFwidGFibGUtY2VsbFwiKTtcbiAgICAgICAgICAgfSovXG4gICAgICAgIHN1cGVyLmFkZEJlZm9yZShjb21wb25lbnQsIGJlZm9yZSk7XG4gICAgICAgIHRoaXMudXBkYXRlU3BsaXRlcigpO1xuICAgIH1cbiAgICBzZXQgc3BsaXRlcihzaXplOiBudW1iZXJbXSkge1xuICAgICAgICB0aGlzLl9zcGxpdGVyID0gc2l6ZTtcbiAgICAgICAgdGhpcy51cGRhdGVTcGxpdGVyKCk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcIm51bWJlcltdXCIsIGRlc2NyaXB0aW9uOiBcInNldCB0aGUgc2l6ZSBvZiBzcGxpdHRlciBlLmcuIFs0MCw2MF0gdGhlIGZpcnN0Y29tcG9uZW50IHNpemUgaXMgNDAlXCIgfSlcbiAgICBnZXQgc3BsaXRlcigpOiBudW1iZXJbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcGxpdGVyO1xuICAgIH1cbiAgICB1cGRhdGVTcGxpdGVyKCkge1xuICAgICAgICBpZiAodGhpcy5fc3BsaXRjb21wb25lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX3NwbGl0Y29tcG9uZW50LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuX3NwbGl0Y29tcG9uZW50ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc3BsaXRlcilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGNvbXAgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLl9jb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29tcG9uZW50c1t4XVtcImRlc2lnbkR1bW15Rm9yXCJdKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy90ZXN0XG4gICAgICAgICAgICAkKHRoaXMuX2NvbXBvbmVudHNbeF0uX19kb20pLmNzcyhcIm92ZXJmbG93XCIsIFwic2Nyb2xsXCIpO1xuICAgICAgICAgICAgJCh0aGlzLl9jb21wb25lbnRzW3hdLl9fZG9tKS5jc3MoXCJ3aWR0aFwiLCB0aGlzLmhvcml6b250YWwgPyBcImNhbGMoMTAwJSAtIDVweClcIiA6IFwiMTAwJVwiKTtcbiAgICAgICAgICAgICQodGhpcy5fY29tcG9uZW50c1t4XS5fX2RvbSkuY3NzKFwiaGVpZ2h0XCIsIHRoaXMuaG9yaXpvbnRhbCA/IFwiMTAwJVwiIDogXCJjYWxjKDEwMCUgLSA1cHgpXCIpO1xuICAgICAgICAgICAgY29tcC5wdXNoKHRoaXMuX2NvbXBvbmVudHNbeF0uZG9tV3JhcHBlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zcGxpdGNvbXBvbmVudCA9IFNwbGl0KGNvbXAsIHtcbiAgICAgICAgICAgIHNpemVzOiB0aGlzLl9zcGxpdGVyLFxuICAgICAgICAgICAgZ3V0dGVyU2l6ZTogOCxcbiAgICAgICAgICAgIG1pblNpemU6IFs1MCwgNTAsIDUwLCA1MCwgNTAsIDUwLCA1MCwgNTBdLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiB0aGlzLmhvcml6b250YWwgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciBIVE1MUGFuZWwgPSBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhcImphc3NpanMudWkuSFRNTFBhbmVsXCIpO1xuICAgIHZhciByZXQgPSBuZXcgQm94UGFuZWwoKTtcbiAgICB2YXIgbWU6IGFueSA9IHt9O1xuICAgIHJldFtcIm1lXCJdID0gbWU7XG4gICAgcmV0Lmhvcml6b250YWwgPSB0cnVlO1xuICAgIG1lLnRiID0gbmV3IEhUTUxQYW5lbCgpO1xuICAgIG1lLnRiMiA9IG5ldyBIVE1MUGFuZWwoKTtcbiAgICBtZS50Yi52YWx1ZSA9IFwibCZvdW1sOyZhdW1sO2smb3VtbDtsayAmb3VtbDtsc2ZkayBzZCZhdW1sOyZvdW1sO2ZsZ2tkZiBcIjtcbiAgICBtZS50Yi53aWR0aCA9IDEzNTtcbiAgICBtZS50YjIudmFsdWUgPSBcImzDtsOka8O2bGsgw7Zsc2ZkayBzZMOkw7ZmbGdrZGYgXCI7XG4gICAgcmV0LmFkZChtZS50Yik7XG4gICAgcmV0LmFkZChtZS50YjIpO1xuICAgIHJldC5zcGxpdGVyID0gWzQwLCA2MF07XG4gICAgcmV0LmhlaWdodCA9IDUwO1xuICAgIHJldC53aWR0aCA9IFwiMTAwJVwiO1xuICAgIHJldHVybiByZXQ7XG59XG47XG4iXX0=