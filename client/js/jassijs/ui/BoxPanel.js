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
        /**
         * @member {boolean} - if true then the components are composed horizontally
         **/
        set horizontal(value) {
            this._horizontal = value;
            if (value)
                $(this.dom).css("flex-direction", "row");
            else
                $(this.dom).css("flex-direction", "column");
            this.updateSpliter();
            /*	this._horizontal=value;
                var jj=	$(this.dom).find(".jcomponent");
                if(this._horizontal){
                    $(this.dom).css("display","table");
                    $(this.dom).find(".jcomponent").css("display","table-row");
               }else{
                    $(this.dom).css("display","flex");
                    $(this.dom).find(".jcomponent").css("display","table-cell");
               }*/
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
        /**
         * set the size of splitter e.g. [40,60] the firstcomponent size is 40%
         */
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
            this._splitcomponent = split_1.default(comp, {
                sizes: this._spliter,
                gutterSize: 8,
                minSize: [50, 50, 50, 50, 50, 50, 50, 50],
                direction: this.horizontal ? 'horizontal' : 'vertical'
            });
        }
    };
    __decorate([
        Property_1.$Property({ default: true }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], BoxPanel.prototype, "horizontal", null);
    __decorate([
        Property_1.$Property({ type: "number[]", description: "set the size of splitter e.g. [40,60] the firstcomponent size is 40%" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], BoxPanel.prototype, "spliter", null);
    BoxPanel = __decorate([
        Component_1.$UIComponent({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        Jassi_1.$Class("jassijs.ui.BoxPanel"),
        Property_1.$Property({ name: "isAbsolute", hide: true, type: "boolean" }),
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
//# sourceMappingURL=BoxPanel.js.map