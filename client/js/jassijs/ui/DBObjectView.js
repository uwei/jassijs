var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Databinder", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/Property"], function (require, exports, Button_1, BoxPanel_1, Jassi_1, Panel_1, Databinder_1, Component_1, Registry_1, Classes_1, Property_1) {
    "use strict";
    var DBObjectView_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectView = exports.$DBObjectView = exports.DBObjectViewProperties = void 0;
    class DBObjectViewProperties {
    }
    exports.DBObjectViewProperties = DBObjectViewProperties;
    function $DBObjectView(properties) {
        return function (pclass) {
            Registry_1.default.register("$DBObjectView", pclass, properties);
        };
    }
    exports.$DBObjectView = $DBObjectView;
    let DBObjectView = DBObjectView_1 = class DBObjectView extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            $(this.dom).addClass("designerNoResizable"); //this should not be resized only me.main
            //everytime call super.layout
            DBObjectView_1.prototype.layout.bind(this)(this.me);
            // this.layout(this.me);
        }
        config(config) {
            super.config(config);
            return this;
        }
        _setDesignMode(enable) {
            //no Icons to add Components in designer
        }
        /**
         * create a new object
         */
        createObject() {
            var clname = Registry_1.default.getData("$DBObjectView", Classes_1.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_1.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("created", this["value"]);
            return this["value"];
        }
        oncreated(handler) {
            this.addEvent("deleted", handler);
        }
        /**
         * saves the object
         */
        saveObject() {
            var ob = this.me.databinder.fromForm();
            ob.save().then((obj) => {
                this["value"] = obj;
                this.callEvent("saved", obj);
            });
        }
        onsaved(handler) {
            this.addEvent("saved", handler);
        }
        /**
         * refresh the object
         */
        refreshObject() {
            this.me.databinder.toForm(this["value"]);
            this.callEvent("refreshed", this["value"]);
        }
        onrefreshed(handler) {
            this.addEvent("refreshed", handler);
        }
        /**
         * deletes Object
         **/
        deleteObject() {
            var ob = this.me.databinder.fromForm();
            ob.remove();
            //set obj to null
            var clname = Registry_1.default.getData("$DBObjectView", Classes_1.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_1.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("deleted", ob);
        }
        ondeleted(handler) {
            this.addEvent("deleted", handler);
        }
        layout(me) {
            var _this = this;
            me.toolbar = new BoxPanel_1.BoxPanel();
            me.save = new Button_1.Button();
            me.remove = new Button_1.Button();
            me.refresh = new Button_1.Button();
            me.create = new Button_1.Button();
            me.databinder = new Databinder_1.Databinder();
            me.main = new Panel_1.Panel();
            me.databinder.definePropertyFor(this, "value");
            this.add(me.toolbar);
            this.add(me.main);
            me.main.width = "100%";
            me.main.height = "100%";
            me.main.css = { position: "relative" };
            //$(me.main.dom).css("background-color","coral");
            me.toolbar.add(me.create);
            me.toolbar.add(me.save);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.refresh);
            me.toolbar.add(me.remove);
            me.save.text = "";
            me.save.tooltip = "save";
            me.save.icon = "mdi mdi-content-save";
            me.save.onclick(function (event) {
                _this.saveObject();
            });
            me.remove.text = "";
            me.remove.icon = "mdi mdi-delete";
            me.remove.onclick(function (event) {
                _this.deleteObject();
            });
            me.remove.tooltip = "remove";
            me.refresh.text = "";
            me.refresh.icon = "mdi mdi-refresh";
            me.refresh.onclick(function (event) {
                _this.refreshObject();
            });
            me.refresh.tooltip = "refresh";
            me.create.text = "";
            me.create.icon = "mdi mdi-tooltip-plus-outline";
            me.create.onclick(function (event) {
                _this.createObject();
                //me.binder.toForm();
            });
            me.create.tooltip = "new";
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "oncreated", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onsaved", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onrefreshed", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "ondeleted", null);
    DBObjectView = DBObjectView_1 = __decorate([
        (0, Component_1.$UIComponent)({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh"] }),
        (0, Jassi_1.$Class)("jassijs/ui/DBObjectView"),
        __metadata("design:paramtypes", [])
    ], DBObjectView);
    exports.DBObjectView = DBObjectView;
    async function test() {
        var ret = new DBObjectView();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiREJPYmplY3RWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy91aS9EQk9iamVjdFZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFxQkEsTUFBYSxzQkFBc0I7S0FPbEM7SUFQRCx3REFPQztJQUNELFNBQWdCLGFBQWEsQ0FBQyxVQUFrQztRQUM1RCxPQUFPLFVBQVUsTUFBTTtZQUNuQixrQkFBUSxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQTtJQUNMLENBQUM7SUFKRCxzQ0FJQztJQTJCRCxJQUFhLFlBQVksb0JBQXpCLE1BQWEsWUFBYSxTQUFRLGFBQUs7UUFHbkM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxFQUFFLEdBQUMsRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFBLHlDQUF5QztZQUNyRiw2QkFBNkI7WUFDN0IsY0FBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuRCx3QkFBd0I7UUFDM0IsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUEwQjtZQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDUyxjQUFjLENBQUMsTUFBTTtZQUM5Qix3Q0FBd0M7UUFDekMsQ0FBQztRQUNEOztXQUVHO1FBQ0gsWUFBWTtZQUNYLElBQUksTUFBTSxHQUFDLGtCQUFRLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBQyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1B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RDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLE9BQU8sRUFBRSxzQ0FBc0MsRUFBRSxDQUFDOzs7O21EQUc5RDtJQWVEO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsT0FBTyxFQUFFLHNDQUFzQyxFQUFFLENBQUM7Ozs7aURBRzlEO0lBMUVRLFlBQVk7UUFGeEIsSUFBQSx3QkFBWSxFQUFDLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxNQUFNLEVBQUMsU0FBUyxFQUFDLFlBQVksRUFBQyxTQUFTLEVBQUMsV0FBVyxFQUFDLFlBQVksQ0FBQyxFQUFFLENBQUM7UUFDN0csSUFBQSxjQUFNLEVBQUMseUJBQXlCLENBQUM7O09BQ3JCLFlBQVksQ0E4SHhCO0lBOUhZLG9DQUFZO0lBZ0lsQixLQUFLLFVBQVUsSUFBSTtRQUN6QixJQUFJLEdBQUcsR0FBQyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQzNCLE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUhELG9CQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCdXR0b259IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xyXG5pbXBvcnQge0JveFBhbmVsfSBmcm9tIFwiamFzc2lqcy91aS9Cb3hQYW5lbFwiO1xyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHtQYW5lbCwgUGFuZWxDb25maWd9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XHJcbmltcG9ydCB7ICRVSUNvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCByZWdpc3RyeSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcbmltcG9ydCB7IERCT2JqZWN0IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0RCT2JqZWN0XCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcbmltcG9ydCB7ICRBY3Rpb25Qcm92aWRlciwgQWN0aW9uUHJvcGVydGllcyB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvQWN0aW9uc1wiO1xyXG5cclxuZXhwb3J0IHR5cGUgREJPYmplY3RWaWV3TWUgPSB7XHJcblx0ZGF0YWJpbmRlcj86RGF0YWJpbmRlcixcclxuXHRjcmVhdGU/OkJ1dHRvbixcclxuXHRtYWluPzpQYW5lbCxcclxuXHR0b29sYmFyPzpCb3hQYW5lbCxcclxuXHRzYXZlPzpCdXR0b24sXHJcblx0cmVtb3ZlPzpCdXR0b24sXHJcblx0cmVmcmVzaD86QnV0dG9uXHJcbn1cclxuZXhwb3J0IGNsYXNzIERCT2JqZWN0Vmlld1Byb3BlcnRpZXMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBmdWxsIHBhdGggdG8gY2xhc3NpZml5IHRoZSBVSUNvbXBvbmVudCBlLmcgY29tbW9uL1RvcENvbXBvbmVudCBcclxuICAgICAqL1xyXG4gICAgY2xhc3NuYW1lOiBzdHJpbmc7XHJcbiAgICBhY3Rpb25uYW1lPzpzdHJpbmc7XHJcbiAgICBpY29uPzpzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uICREQk9iamVjdFZpZXcocHJvcGVydGllczogREJPYmplY3RWaWV3UHJvcGVydGllcyk6IEZ1bmN0aW9uIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocGNsYXNzKSB7XHJcbiAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXIoXCIkREJPYmplY3RWaWV3XCIsIHBjbGFzcywgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbn1cclxudHlwZSBNZT1EQk9iamVjdFZpZXdNZTtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgREJPYmplY3RWaWV3Q29uZmlnIGV4dGVuZHMgUGFuZWxDb25maWcge1xyXG4gIC8qKlxyXG4gICAgICogcmVnaXN0ZXIgYW4gZXZlbnQgaWYgdGhlIG9iamVjdCBpcyBjcmVhdGVkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkXHJcbiAgICAgKi9cclxuICAgIG9uY3JlYXRlZD8oaGFuZGxlcjogKG9iajpEQk9iamVjdCApID0+IHZvaWQpO1xyXG4gICAgIC8qKlxyXG4gICAgICogcmVnaXN0ZXIgYW4gZXZlbnQgaWYgdGhlIG9iamVjdCBpcyBzYXZlZFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZFxyXG4gICAgICovXHJcbiAgICBvbnNhdmVkPyhoYW5kbGVyOiAob2JqOkRCT2JqZWN0ICkgPT4gdm9pZCk7XHJcbiAgICAvKipcclxuICAgICAqIHJlZ2lzdGVyIGFuIGV2ZW50IGlmIHRoZSBvYmplY3QgaXMgcmVmcmVzaGVkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkXHJcbiAgICAgKi9cclxuICAgIG9ucmVmcmVzaGVkPyhoYW5kbGVyOiAob2JqOkRCT2JqZWN0ICkgPT4gdm9pZCk7XHJcbiAgICAgLyoqXHJcbiAgICAgKiByZWdpc3RlciBhbiBldmVudCBpZiB0aGUgb2JqZWN0IGlzIGRlbGV0ZWRcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWRcclxuICAgICAqL1xyXG4gICAgb25kZWxldGVkPyhoYW5kbGVyOiAob2JqOkRCT2JqZWN0ICkgPT4gdm9pZCk7XHJcbn1cclxuQCRVSUNvbXBvbmVudCh7IGVkaXRhYmxlQ2hpbGRDb21wb25lbnRzOiBbXCJ0aGlzXCIsXCJtZS5tYWluXCIsXCJtZS50b29sYmFyXCIsXCJtZS5zYXZlXCIsXCJtZS5yZW1vdmVcIixcIm1lLnJlZnJlc2hcIl0gfSlcclxuQCRDbGFzcyhcImphc3NpanMvdWkvREJPYmplY3RWaWV3XCIpXHJcbmV4cG9ydCBjbGFzcyBEQk9iamVjdFZpZXcgZXh0ZW5kcyBQYW5lbCBpbXBsZW1lbnRzICBPbWl0PERCT2JqZWN0Vmlld0NvbmZpZyxcImlzQWJzb2x1dGVcIj4ge1xyXG5cdG1lO1xyXG5cdHZhbHVlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1lPXt9O1xyXG4gICAgICAgICQodGhpcy5kb20pLmFkZENsYXNzKFwiZGVzaWduZXJOb1Jlc2l6YWJsZVwiKTsvL3RoaXMgc2hvdWxkIG5vdCBiZSByZXNpemVkIG9ubHkgbWUubWFpblxyXG4gICAgICAgIC8vZXZlcnl0aW1lIGNhbGwgc3VwZXIubGF5b3V0XHJcbiAgICAgICAgREJPYmplY3RWaWV3LnByb3RvdHlwZS5sYXlvdXQuYmluZCh0aGlzKSh0aGlzLm1lKTtcclxuICAgICAgIC8vIHRoaXMubGF5b3V0KHRoaXMubWUpO1xyXG4gICAgfVxyXG4gICAgY29uZmlnKGNvbmZpZzogREJPYmplY3RWaWV3Q29uZmlnKTpEQk9iamVjdFZpZXcge1xyXG4gICAgICAgIHN1cGVyLmNvbmZpZyhjb25maWcpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIF9zZXREZXNpZ25Nb2RlKGVuYWJsZSkge1xyXG4gICAgXHQvL25vIEljb25zIHRvIGFkZCBDb21wb25lbnRzIGluIGRlc2lnbmVyXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNyZWF0ZSBhIG5ldyBvYmplY3RcclxuICAgICAqL1xyXG4gICAgY3JlYXRlT2JqZWN0KCk6YW55e1xyXG4gICAgXHR2YXIgY2xuYW1lPXJlZ2lzdHJ5LmdldERhdGEoXCIkREJPYmplY3RWaWV3XCIsY2xhc3Nlcy5nZXRDbGFzc05hbWUodGhpcykpWzBdLnBhcmFtc1swXS5jbGFzc25hbWU7XHJcbiAgICBcdHZhciBjbD1jbGFzc2VzLmdldENsYXNzKGNsbmFtZSk7XHJcblx0XHR0aGlzW1widmFsdWVcIl09bmV3IGNsKCk7XHJcblx0XHR0aGlzLmNhbGxFdmVudChcImNyZWF0ZWRcIiwgdGhpc1tcInZhbHVlXCJdKTtcclxuXHRcdHJldHVybiB0aGlzW1widmFsdWVcIl07XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihvYmo/Lyo6IERCT2JqZWN0Ki8pe1xcblxcdFxcbn1cIiB9KVxyXG4gICAgb25jcmVhdGVkKGhhbmRsZXI6IChvYmo6REJPYmplY3QgKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudChcImRlbGV0ZWRcIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHNhdmVzIHRoZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgc2F2ZU9iamVjdCgpe1xyXG4gICAgXHR2YXIgb2IgPSB0aGlzLm1lLmRhdGFiaW5kZXIuZnJvbUZvcm0oKTtcclxuICAgICAgICBvYi5zYXZlKCkudGhlbigob2JqKT0+e1xyXG4gICAgICAgIFx0dGhpc1tcInZhbHVlXCJdPW9iajtcclxuICAgICAgICBcdHRoaXMuY2FsbEV2ZW50KFwic2F2ZWRcIiwgb2JqKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKG9iaj8vKjogREJPYmplY3QqLyl7XFxuXFx0XFxufVwiIH0pXHJcbiAgICBvbnNhdmVkKGhhbmRsZXI6IChvYmo6REJPYmplY3QgKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudChcInNhdmVkXCIsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZWZyZXNoIHRoZSBvYmplY3RcclxuICAgICAqL1xyXG4gICAgcmVmcmVzaE9iamVjdCgpe1xyXG5cdFx0dGhpcy5tZS5kYXRhYmluZGVyLnRvRm9ybSh0aGlzW1widmFsdWVcIl0pO1xyXG5cdFx0dGhpcy5jYWxsRXZlbnQoXCJyZWZyZXNoZWRcIiwgdGhpc1tcInZhbHVlXCJdKTtcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKG9iaj8vKjogREJPYmplY3QqLyl7XFxuXFx0XFxufVwiIH0pXHJcbiAgICBvbnJlZnJlc2hlZChoYW5kbGVyOiAob2JqOkRCT2JqZWN0ICkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJyZWZyZXNoZWRcIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGRlbGV0ZXMgT2JqZWN0XHJcbiAgICAgKiovXHJcbiAgICBkZWxldGVPYmplY3QoKXtcclxuICAgIFx0dmFyIG9iOkRCT2JqZWN0ID0gPERCT2JqZWN0PnRoaXMubWUuZGF0YWJpbmRlci5mcm9tRm9ybSgpO1xyXG4gICAgICAgIG9iLnJlbW92ZSgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vc2V0IG9iaiB0byBudWxsXHJcbiAgICAgICAgdmFyIGNsbmFtZT1yZWdpc3RyeS5nZXREYXRhKFwiJERCT2JqZWN0Vmlld1wiLGNsYXNzZXMuZ2V0Q2xhc3NOYW1lKHRoaXMpKVswXS5wYXJhbXNbMF0uY2xhc3NuYW1lO1xyXG4gICAgXHR2YXIgY2w9Y2xhc3Nlcy5nZXRDbGFzcyhjbG5hbWUpO1xyXG5cdFx0dGhpc1tcInZhbHVlXCJdPW5ldyBjbCgpO1xyXG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiZGVsZXRlZFwiLCBvYik7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihvYmo/Lyo6IERCT2JqZWN0Ki8pe1xcblxcdFxcbn1cIiB9KVxyXG4gICAgb25kZWxldGVkKGhhbmRsZXI6IChvYmo6REJPYmplY3QgKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudChcImRlbGV0ZWRcIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBsYXlvdXQobWU6TWUpIHtcclxuICAgIFx0dmFyIF90aGlzPXRoaXM7XHJcblx0ICAgIG1lLnRvb2xiYXI9bmV3IEJveFBhbmVsKCk7XHJcblx0ICAgIG1lLnNhdmU9bmV3IEJ1dHRvbigpO1xyXG5cdCAgICBtZS5yZW1vdmU9bmV3IEJ1dHRvbigpO1xyXG5cdCAgICBtZS5yZWZyZXNoPW5ldyBCdXR0b24oKTtcclxuXHQgICAgbWUuY3JlYXRlPW5ldyBCdXR0b24oKTtcclxuICAgIFx0bWUuZGF0YWJpbmRlciA9IG5ldyBEYXRhYmluZGVyKCk7XHJcbiAgICBcdG1lLm1haW49bmV3IFBhbmVsKCk7XHJcbiAgICBcdG1lLmRhdGFiaW5kZXIuZGVmaW5lUHJvcGVydHlGb3IodGhpcywgXCJ2YWx1ZVwiKTtcclxuICAgIFx0dGhpcy5hZGQobWUudG9vbGJhcik7XHJcbiAgICBcdHRoaXMuYWRkKG1lLm1haW4pO1xyXG4gICAgXHRtZS5tYWluLndpZHRoPVwiMTAwJVwiO1xyXG4gICAgXHRtZS5tYWluLmhlaWdodD1cIjEwMCVcIjtcclxuICAgIFx0bWUubWFpbi5jc3M9eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH07XHJcbiAgICBcdC8vJChtZS5tYWluLmRvbSkuY3NzKFwiYmFja2dyb3VuZC1jb2xvclwiLFwiY29yYWxcIik7XHJcbiAgICBcdG1lLnRvb2xiYXIuYWRkKG1lLmNyZWF0ZSk7XHJcbiAgICBcdG1lLnRvb2xiYXIuYWRkKG1lLnNhdmUpO1xyXG4gICAgXHRtZS50b29sYmFyLmhvcml6b250YWw9dHJ1ZTtcclxuICAgIFx0bWUudG9vbGJhci5hZGQobWUucmVmcmVzaCk7XHJcbiAgICBcdG1lLnRvb2xiYXIuYWRkKG1lLnJlbW92ZSk7XHJcbiAgICBcdG1lLnNhdmUudGV4dD1cIlwiO1xyXG4gXHRcdG1lLnNhdmUudG9vbHRpcD1cInNhdmVcIjtcclxuICAgIFx0bWUuc2F2ZS5pY29uPVwibWRpIG1kaS1jb250ZW50LXNhdmVcIjtcclxuICAgIFx0bWUuc2F2ZS5vbmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIFx0XHRfdGhpcy5zYXZlT2JqZWN0KCk7XHJcbiAgICBcdH0pO1xyXG4gICAgXHRtZS5yZW1vdmUudGV4dD1cIlwiO1xyXG4gICAgXHRtZS5yZW1vdmUuaWNvbj1cIm1kaSBtZGktZGVsZXRlXCI7XHJcbiAgICBcdG1lLnJlbW92ZS5vbmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIFx0XHRfdGhpcy5kZWxldGVPYmplY3QoKTtcclxuICAgIFx0fSk7XHJcbiAgICBcdG1lLnJlbW92ZS50b29sdGlwPVwicmVtb3ZlXCI7XHJcbiAgICBcdG1lLnJlZnJlc2gudGV4dD1cIlwiO1xyXG4gICAgXHRtZS5yZWZyZXNoLmljb249XCJtZGkgbWRpLXJlZnJlc2hcIjtcclxuICAgIFx0bWUucmVmcmVzaC5vbmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgIFx0XHRfdGhpcy5yZWZyZXNoT2JqZWN0KCk7XHJcbiAgICBcdH0pO1xyXG4gICAgXHRtZS5yZWZyZXNoLnRvb2x0aXA9XCJyZWZyZXNoXCI7XHJcbiAgICBcdG1lLmNyZWF0ZS50ZXh0PVwiXCI7XHJcbiAgICBcdG1lLmNyZWF0ZS5pY29uPVwibWRpIG1kaS10b29sdGlwLXBsdXMtb3V0bGluZVwiO1xyXG4gICAgXHRcclxuICAgIFx0bWUuY3JlYXRlLm9uY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgXHRcdF90aGlzLmNyZWF0ZU9iamVjdCgpO1xyXG5cdFx0XHQvL21lLmJpbmRlci50b0Zvcm0oKTtcclxuICAgIFx0fSk7XHJcbiAgICBcclxuICAgIFx0bWUuY3JlYXRlLnRvb2x0aXA9XCJuZXdcIjtcclxuICAgIFxyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKXtcclxuXHR2YXIgcmV0PW5ldyBEQk9iamVjdFZpZXcoKTtcclxuXHRyZXR1cm4gcmV0O1xyXG59Il19