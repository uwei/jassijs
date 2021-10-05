var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Menu", "jassijs/ui/InvisibleComponent", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ui/Property", "jassijs/base/Actions", "jassijs/ui/MenuItem", "jassijs/ext/jquery.contextmenu"], function (require, exports, Jassi_1, Menu_1, InvisibleComponent_1, Component_1, Classes_1, Property_1, Actions_1, MenuItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ContextMenu = void 0;
    //https://github.com/s-yadav/contextMenu.js/
    let ContextMenu = class ContextMenu extends InvisibleComponent_1.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
            var _this = this;
            this.menu = new Menu_1.Menu({ noUpdate: true });
            this.menu._mainMenu = this;
            //this.menu._parent=this;
            $(this.dom).append(this.menu.dom);
            $(this.menu.dom).contextMenu("menu", "#" + this.menu._id, { triggerOn: 'dummyevent' });
            this.contextComponents = [];
            //this.menu._parent=this;
            $(this.menu.dom).addClass("jcontainer");
            this._components = [this.menu]; //neede for getEditablecontextComponents
            this.onbeforeshow(function () {
                return _this._updateClassActions();
            });
        }
        /**
         * @member - the objects for the includeClassActions @ActionProvider if  is enabled
         **/
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        /**
         * could be override to provide Context-actions
         * exsample:
         * cmen.getActions=async function(objects:[]){
         *		return [{name:"hallo",call:ob=>{}]
         *	};
         **/
        async getActions(data) {
            return [];
        }
        //		static async  getActionsFor(oclass:new (...args: any[]) => any):Promise<{name:string,icon?:string,call:(objects:any[])}[]>{
        /*	registerActions(func:{(any[]):Promise<{name:string,icon?:string,call:(objects:any[])}[]}>){
                this._getActions=func;
            }*/
        _removeClassActions(menu) {
            for (var y = 0; y < menu._components.length; y++) {
                var test = menu._components[y];
                if (test["_classaction"] == true) {
                    menu.remove(test);
                    test.destroy();
                    y--;
                }
                if (test._components !== undefined) {
                    this._removeClassActions(test);
                }
            }
        }
        _setDesignMode(enable) {
            var h = 9;
        }
        async _updateClassActions() {
            //remove classActions
            this._removeClassActions(this.menu);
            var _this = this;
            var actions = await this.getActions(this.value);
            if (this.value === undefined || this.includeClassActions !== true || this.value.length <= 0)
                actions = actions; //do nothing
            else {
                var a = await Actions_1.Actions.getActionsFor(this.value); //Class Actions
                for (var x = 0; x < a.length; x++) {
                    actions.push(a[x]);
                }
            }
            actions.forEach(action => {
                var path = action.name.split("/"); //childmenus
                var parent = this.menu;
                for (var i = 0; i < path.length; i++) {
                    if (i === path.length - 1) {
                        var men = new MenuItem_1.MenuItem();
                        men["_classaction"] = true;
                        men.text = path[i];
                        men.icon = action.icon;
                        men.onclick(() => action.call(_this.value));
                        parent.add(men);
                    }
                    else {
                        var name = path[i];
                        var found = undefined;
                        parent._components.forEach((men) => {
                            if (men.text === name)
                                found = men.items;
                        });
                        if (found === undefined) {
                            var men = new MenuItem_1.MenuItem();
                            men["_classaction"] = true;
                            men.text = name;
                            parent.add(men);
                            parent = men.items;
                        }
                        else {
                            parent = found;
                        }
                    }
                }
            });
        }
        _menueChanged() {
        }
        getMainMenu() {
            return this;
        }
        /**
         * register an event if the contextmenu is showing
         * @param {function} handler - the function that is called on change
         * @returns {boolean} - false if the contextmenu should not been shown
         */
        onbeforeshow(handler) {
            this.addEvent("beforeshow", handler);
        }
        async _callContextmenu(evt) {
            if (evt.preventDefault !== undefined)
                evt.preventDefault();
            this.target = evt.target;
            var cancel = this.callEvent("beforeshow", evt);
            if (cancel !== undefined) {
                for (var x = 0; x < cancel.length; x++) {
                    if (cancel[x] !== undefined && cancel[x].then !== undefined)
                        cancel[x] = await cancel[x];
                    if (cancel[x] === false)
                        return;
                }
            }
            let y = evt.originalEvent.clientY;
            //$(_this.menu.dom).contextMenu("menu","#"+_this.menu._id);//,{triggerOn:'contextmenu'});
            //$(_this.menu.dom).contextMenu('open',evt);
            this.show({ left: evt.originalEvent.clientX, top: y });
        }
        /**
         * register the contextMenu (right click) on the component
         * @member {jassijs.ui.Component} - the component which gets the contextmenu
         **/
        registerComponent(component) {
            this.contextComponents.push(component);
            var _this = this;
            $(component.dom).contextmenu(function (evt) {
                _this._callContextmenu(evt);
            });
        }
        /**
         * unregister the contextMenu (right click) on the component
         * @member {jassijs.ui.Component} - the component which gets the contextmenu
         **/
        unregisterComponent(component) {
            //$(component.dom).contextmenu(function(ob){});//now we always can destroy
            $(component.dom).off("contextmenu");
            //$(component.dom).contextmenu("destroy");
            var pos = this.contextComponents.indexOf(component);
            if (pos >= 0)
                this.contextComponents.splice(pos, 1);
        }
        /**
         * shows the contextMenu
         */
        show(event) {
            //@ts-ignore
            if (this.domWrapper.parentNode.getAttribute('id') === "jassitemp" && this.contextComponents.length > 0) {
                //the contextmenu is not added to a container to we add the contextmenu to the contextComponent
                this.contextComponents[0].domWrapper.appendChild(this.domWrapper);
            }
            var _this = this;
            window.setTimeout(function () {
                $(_this.menu.dom).menu();
                $(_this.menu.dom).menu("destroy");
                $(_this.menu.dom).contextMenu("menu", "#" + _this.menu._id, { triggerOn: 'dummyevent' });
                //correct pos menu not visible
                if (!event) {
                    event = $(':hover').last().offset();
                }
                else {
                    if (event.top + $(_this.menu.dom).height() > window.innerHeight) {
                        event.top = window.innerHeight - $(_this.menu.dom).height();
                    }
                    if (event.left + $(_this.menu.dom).width() > window.innerWidth) {
                        event.left = window.innerWidth - $(_this.menu.dom).width();
                    }
                }
                $(_this.menu.dom).contextMenu('open', event);
            }, 10);
        }
        close() {
            $(this.menu.dom).contextMenu('close', event);
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this.menu.extensionCalled(action);
            }
            if (action.componentDesignerInvisibleComponentClicked) {
                var design = action.componentDesignerInvisibleComponentClicked.designButton.dom;
                //return this.show({ top: $(design).offset().top + 30, left: $(design).offset().left + 5 });
                return this.show(design); //{ top: $(design).offset().top, left: $(design).offset().left });
            }
            super.extensionCalled(action);
        }
        destroy() {
            this._value = undefined;
            while (this.contextComponents.length > 0) {
                this.unregisterComponent(this.contextComponents[0]);
            }
            $(this.menu.dom).contextMenu("menu", "#" + this.menu._id);
            $(this.menu.dom).contextMenu("destroy");
            this.menu.destroy();
            super.destroy();
        }
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean)
    ], ContextMenu.prototype, "includeClassActions", void 0);
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ContextMenu.prototype, "onbeforeshow", null);
    ContextMenu = __decorate([
        Component_1.$UIComponent({ fullPath: "common/ContextMenu", icon: "mdi mdi-dots-vertical", editableChildComponents: ["menu"] }),
        Jassi_1.$Class("jassijs.ui.ContextMenu"),
        __metadata("design:paramtypes", [])
    ], ContextMenu);
    exports.ContextMenu = ContextMenu;
    async function test() {
        var Panel = Classes_1.classes.getClass("jassijs.ui.Panel");
        var Button = Classes_1.classes.getClass("jassijs.ui.Button");
        var MenuItem = Classes_1.classes.getClass("jassijs.ui.MenuItem");
        var FileNode = Classes_1.classes.getClass("jassijs.remote.FileNode");
        var bt = new Button();
        var cmen = new ContextMenu();
        var men = new MenuItem();
        //var pan=new Panel();
        men.text = "static Menu";
        men.onclick(() => { alert("ok"); });
        cmen.includeClassActions = true;
        cmen.menu.add(men);
        var nd = new FileNode();
        nd.name = "File";
        cmen.value = [nd];
        cmen.getActions = async function (objects) {
            var all = objects;
            return [{
                    name: "getActions-Action", call: function (ob) {
                        alert(ob[0]["name"]);
                    }
                }];
        };
        bt.contextMenu = cmen;
        bt.text = "hallo";
        //pan.add(bt);
        //bt.domWrapper.appendChild(cmen.domWrapper);
        //pan.add(cmen);
        return bt;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dE1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3VpL0NvbnRleHRNZW51LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFpQkEsNENBQTRDO0lBRzVDLElBQWEsV0FBVyxHQUF4QixNQUFhLFdBQVksU0FBUSx1Q0FBa0I7UUFzQi9DO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDM0IseUJBQXlCO1lBQ3pCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUN2RixJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1lBQzVCLHlCQUF5QjtZQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLHdDQUF3QztZQUN2RSxJQUFJ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QUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLFdBQVcsT0FBVztZQUN6QyxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUM7WUFDbEIsT0FBTyxDQUFDO29CQUNKLElBQUksRUFBRSxtQkFBbUIsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFTO3dCQUNoRCxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLENBQUM7aUJBQ0osQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDO1FBQ0YsRUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdEIsRUFBRSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDbEIsY0FBYztRQUVkLDZDQUE2QztRQUM3QyxnQkFBZ0I7UUFDaEIsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBbENELG9CQWtDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcImphc3NpanMvZXh0L2pxdWVyeS5jb250ZXh0bWVudVwiO1xuaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBNZW51IH0gZnJvbSBcImphc3NpanMvdWkvTWVudVwiO1xuaW1wb3J0IHsgSW52aXNpYmxlQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvSW52aXNpYmxlQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb21wb25lbnQsICRVSUNvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgQWN0aW9ucywgQWN0aW9uIH0gZnJvbSBcImphc3NpanMvYmFzZS9BY3Rpb25zXCI7XG5pbXBvcnQgeyBNZW51SXRlbSB9IGZyb20gXCJqYXNzaWpzL3VpL01lbnVJdGVtXCI7XG5cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBKUXVlcnkge1xuICAgICAgICBjb250ZXh0TWVudTogYW55O1xuICAgIH1cbn1cbi8vaHR0cHM6Ly9naXRodWIuY29tL3MteWFkYXYvY29udGV4dE1lbnUuanMvXG5AJFVJQ29tcG9uZW50KHsgZnVsbFBhdGg6IFwiY29tbW9uL0NvbnRleHRNZW51XCIsIGljb246IFwibWRpIG1kaS1kb3RzLXZlcnRpY2FsXCIsIGVkaXRhYmxlQ2hpbGRDb21wb25lbnRzOiBbXCJtZW51XCJdIH0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5Db250ZXh0TWVudVwiKVxuZXhwb3J0IGNsYXNzIENvbnRleHRNZW51IGV4dGVuZHMgSW52aXNpYmxlQ29tcG9uZW50IHtcbiAgICBtZW51OiBNZW51O1xuICAgIGNvbnRleHRDb21wb25lbnRzO1xuICAgIF9jb21wb25lbnRzOiBDb21wb25lbnRbXTtcbiAgICB0YXJnZXQ6YW55O1xuICAgIEAkUHJvcGVydHkoKVxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgLSBpbmNsdWRlcyBBY3Rpb25zIGZyb20gQEFjdGlvblByb3ZpZGVyIGZvciB0aGUgb2JqZWN0cyBpbiB2YWx1ZVxuICAgICAqL1xuICAgIGluY2x1ZGVDbGFzc0FjdGlvbnM6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfdmFsdWU7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciAtIHRoZSBvYmplY3RzIGZvciB0aGUgaW5jbHVkZUNsYXNzQWN0aW9ucyBAQWN0aW9uUHJvdmlkZXIgaWYgIGlzIGVuYWJsZWRcbiAgICAgKiovXG4gICAgc2V0IHZhbHVlKHZhbHVlOiBhbnlbXSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsvL2lkIGNvbm5lY3QgdG8gZXhpc3Rpbmcobm90IHJlcWlyZWQpXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHN1cGVyLmluaXQoJCgnPHNwYW4gY2xhc3M9XCJJbnZpc2libGVDb21wb25lbnRcIj48L3NwYW4+JylbMF0pO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLm1lbnUgPSBuZXcgTWVudSh7IG5vVXBkYXRlOiB0cnVlIH0pO1xuICAgICAgICB0aGlzLm1lbnUuX21haW5NZW51ID0gdGhpcztcbiAgICAgICAgLy90aGlzLm1lbnUuX3BhcmVudD10aGlzO1xuICAgICAgICAkKHRoaXMuZG9tKS5hcHBlbmQodGhpcy5tZW51LmRvbSk7XG4gICAgICAgICQodGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoXCJtZW51XCIsIFwiI1wiICsgdGhpcy5tZW51Ll9pZCwgeyB0cmlnZ2VyT246ICdkdW1teWV2ZW50JyB9KTtcbiAgICAgICAgdGhpcy5jb250ZXh0Q29tcG9uZW50cyA9IFtdO1xuICAgICAgICAvL3RoaXMubWVudS5fcGFyZW50PXRoaXM7XG4gICAgICAgICQodGhpcy5tZW51LmRvbSkuYWRkQ2xhc3MoXCJqY29udGFpbmVyXCIpO1xuICAgICAgICB0aGlzLl9jb21wb25lbnRzID0gW3RoaXMubWVudV07Ly9uZWVkZSBmb3IgZ2V0RWRpdGFibGVjb250ZXh0Q29tcG9uZW50c1xuICAgICAgICB0aGlzLm9uYmVmb3Jlc2hvdyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuX3VwZGF0ZUNsYXNzQWN0aW9ucygpO1xuICAgICAgICB9KVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBjb3VsZCBiZSBvdmVycmlkZSB0byBwcm92aWRlIENvbnRleHQtYWN0aW9uc1xuICAgICAqIGV4c2FtcGxlOlxuICAgICAqIGNtZW4uZ2V0QWN0aW9ucz1hc3luYyBmdW5jdGlvbihvYmplY3RzOltdKXtcbiAgICAgKlx0XHRyZXR1cm4gW3tuYW1lOlwiaGFsbG9cIixjYWxsOm9iPT57fV1cbiAgICAgKlx0fTtcbiAgICAgKiovXG4gICAgYXN5bmMgZ2V0QWN0aW9ucyhkYXRhOiBhbnlbXSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvL1x0XHRzdGF0aWMgYXN5bmMgIGdldEFjdGlvbnNGb3Iob2NsYXNzOm5ldyAoLi4uYXJnczogYW55W10pID0+IGFueSk6UHJvbWlzZTx7bmFtZTpzdHJpbmcsaWNvbj86c3RyaW5nLGNhbGw6KG9iamVjdHM6YW55W10pfVtdPntcbiAgICAvKlx0cmVnaXN0ZXJBY3Rpb25zKGZ1bmM6eyhhbnlbXSk6UHJvbWlzZTx7bmFtZTpzdHJpbmcsaWNvbj86c3RyaW5nLGNhbGw6KG9iamVjdHM6YW55W10pfVtdfT4pe1xuICAgICAgICAgICAgdGhpcy5fZ2V0QWN0aW9ucz1mdW5jO1xuICAgICAgICB9Ki9cbiAgICBwcml2YXRlIF9yZW1vdmVDbGFzc0FjdGlvbnMobWVudSkge1xuICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG1lbnUuX2NvbXBvbmVudHMubGVuZ3RoOyB5KyspIHtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gbWVudS5fY29tcG9uZW50c1t5XTtcbiAgICAgICAgICAgIGlmICh0ZXN0W1wiX2NsYXNzYWN0aW9uXCJdID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBtZW51LnJlbW92ZSh0ZXN0KTtcbiAgICAgICAgICAgICAgICB0ZXN0LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB5LS07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVzdC5fY29tcG9uZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlQ2xhc3NBY3Rpb25zKHRlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHByb3RlY3RlZCBfc2V0RGVzaWduTW9kZShlbmFibGUpIHtcbiAgICAgICAgdmFyIGggPSA5O1xuXG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgX3VwZGF0ZUNsYXNzQWN0aW9ucygpIHtcblxuXG4gICAgICAgIC8vcmVtb3ZlIGNsYXNzQWN0aW9uc1xuICAgICAgICB0aGlzLl9yZW1vdmVDbGFzc0FjdGlvbnModGhpcy5tZW51KTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBhd2FpdCB0aGlzLmdldEFjdGlvbnModGhpcy52YWx1ZSk7XG5cbiAgICAgICAgaWYgKHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmluY2x1ZGVDbGFzc0FjdGlvbnMgIT09IHRydWUgfHwgdGhpcy52YWx1ZS5sZW5ndGggPD0gMClcbiAgICAgICAgICAgIGFjdGlvbnMgPSBhY3Rpb25zOy8vZG8gbm90aGluZ1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBhID0gYXdhaXQgQWN0aW9ucy5nZXRBY3Rpb25zRm9yKHRoaXMudmFsdWUpOy8vQ2xhc3MgQWN0aW9uc1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9ucy5wdXNoKGFbeF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgICAgICAgICAgdmFyIHBhdGggPSBhY3Rpb24ubmFtZS5zcGxpdChcIi9cIik7Ly9jaGlsZG1lbnVzXG4gICAgICAgICAgICB2YXIgcGFyZW50OiBNZW51ID0gdGhpcy5tZW51O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHBhdGgubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWVuID0gbmV3IE1lbnVJdGVtKCk7XG4gICAgICAgICAgICAgICAgICAgIG1lbltcIl9jbGFzc2FjdGlvblwiXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG1lbi50ZXh0ID0gcGF0aFtpXTtcbiAgICAgICAgICAgICAgICAgICAgbWVuLmljb24gPSBhY3Rpb24uaWNvbjtcbiAgICAgICAgICAgICAgICAgICAgbWVuLm9uY2xpY2soKCkgPT4gYWN0aW9uLmNhbGwoX3RoaXMudmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmFkZChtZW4pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gcGF0aFtpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuX2NvbXBvbmVudHMuZm9yRWFjaCgobWVuKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKDxNZW51SXRlbT5tZW4pLnRleHQgPT09IG5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSAoPE1lbnVJdGVtPm1lbikuaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lbiA9IG5ldyBNZW51SXRlbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVuW1wiX2NsYXNzYWN0aW9uXCJdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbi50ZXh0ID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudC5hZGQobWVuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IG1lbi5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGZvdW5kO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBfbWVudWVDaGFuZ2VkKCkge1xuXG4gICAgfVxuICAgIGdldE1haW5NZW51KCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogcmVnaXN0ZXIgYW4gZXZlbnQgaWYgdGhlIGNvbnRleHRtZW51IGlzIHNob3dpbmdcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGNoYW5nZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIGZhbHNlIGlmIHRoZSBjb250ZXh0bWVudSBzaG91bGQgbm90IGJlZW4gc2hvd25cbiAgICAgKi9cbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudCl7XFxuXFx0XFxufVwiIH0pXG4gICAgb25iZWZvcmVzaG93KGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudChcImJlZm9yZXNob3dcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIGFzeW5jIF9jYWxsQ29udGV4dG1lbnUoZXZ0KSB7XG4gICAgICAgIGlmIChldnQucHJldmVudERlZmF1bHQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnRhcmdldD1ldnQudGFyZ2V0O1xuICAgICAgICB2YXIgY2FuY2VsID0gdGhpcy5jYWxsRXZlbnQoXCJiZWZvcmVzaG93XCIsIGV2dCk7XG4gICAgICAgIGlmIChjYW5jZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjYW5jZWwubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBpZiAoY2FuY2VsW3hdICE9PSB1bmRlZmluZWQgJiYgY2FuY2VsW3hdLnRoZW4gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsW3hdID0gYXdhaXQgY2FuY2VsW3hdO1xuICAgICAgICAgICAgICAgIGlmIChjYW5jZWxbeF0gPT09IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHkgPSBldnQub3JpZ2luYWxFdmVudC5jbGllbnRZO1xuXG4gICAgICAgIC8vJChfdGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoXCJtZW51XCIsXCIjXCIrX3RoaXMubWVudS5faWQpOy8vLHt0cmlnZ2VyT246J2NvbnRleHRtZW51J30pO1xuICAgICAgICAvLyQoX3RoaXMubWVudS5kb20pLmNvbnRleHRNZW51KCdvcGVuJyxldnQpO1xuICAgICAgICB0aGlzLnNob3coeyBsZWZ0OiBldnQub3JpZ2luYWxFdmVudC5jbGllbnRYLCB0b3A6IHkgfSk7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIHRoZSBjb250ZXh0TWVudSAocmlnaHQgY2xpY2spIG9uIHRoZSBjb21wb25lbnRcbiAgICAgKiBAbWVtYmVyIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gLSB0aGUgY29tcG9uZW50IHdoaWNoIGdldHMgdGhlIGNvbnRleHRtZW51XG4gICAgICoqL1xuICAgIHJlZ2lzdGVyQ29tcG9uZW50KGNvbXBvbmVudCkge1xuICAgICAgICB0aGlzLmNvbnRleHRDb21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgJChjb21wb25lbnQuZG9tKS5jb250ZXh0bWVudShmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBfdGhpcy5fY2FsbENvbnRleHRtZW51KGV2dCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB1bnJlZ2lzdGVyIHRoZSBjb250ZXh0TWVudSAocmlnaHQgY2xpY2spIG9uIHRoZSBjb21wb25lbnRcbiAgICAgKiBAbWVtYmVyIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gLSB0aGUgY29tcG9uZW50IHdoaWNoIGdldHMgdGhlIGNvbnRleHRtZW51XG4gICAgICoqL1xuICAgIHVucmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KSB7XG4gICAgICAgIC8vJChjb21wb25lbnQuZG9tKS5jb250ZXh0bWVudShmdW5jdGlvbihvYil7fSk7Ly9ub3cgd2UgYWx3YXlzIGNhbiBkZXN0cm95XG4gICAgICAgICQoY29tcG9uZW50LmRvbSkub2ZmKFwiY29udGV4dG1lbnVcIik7XG4gICAgICAgIC8vJChjb21wb25lbnQuZG9tKS5jb250ZXh0bWVudShcImRlc3Ryb3lcIik7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmNvbnRleHRDb21wb25lbnRzLmluZGV4T2YoY29tcG9uZW50KTtcbiAgICAgICAgaWYgKHBvcyA+PSAwKVxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Q29tcG9uZW50cy5zcGxpY2UocG9zLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzaG93cyB0aGUgY29udGV4dE1lbnVcbiAgICAgKi9cbiAgICBzaG93KGV2ZW50KSB7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBpZiAodGhpcy5kb21XcmFwcGVyLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpID09PSBcImphc3NpdGVtcFwiICYmIHRoaXMuY29udGV4dENvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy90aGUgY29udGV4dG1lbnUgaXMgbm90IGFkZGVkIHRvIGEgY29udGFpbmVyIHRvIHdlIGFkZCB0aGUgY29udGV4dG1lbnUgdG8gdGhlIGNvbnRleHRDb21wb25lbnRcbiAgICAgICAgICAgIHRoaXMuY29udGV4dENvbXBvbmVudHNbMF0uZG9tV3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRvbVdyYXBwZXIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoX3RoaXMubWVudS5kb20pLm1lbnUoKTtcbiAgICAgICAgICAgICQoX3RoaXMubWVudS5kb20pLm1lbnUoXCJkZXN0cm95XCIpO1xuICAgICAgICAgICAgJChfdGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoXCJtZW51XCIsIFwiI1wiICsgX3RoaXMubWVudS5faWQsIHsgdHJpZ2dlck9uOiAnZHVtbXlldmVudCcgfSk7XG4gICAgICAgICAgICAvL2NvcnJlY3QgcG9zIG1lbnUgbm90IHZpc2libGVcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIWV2ZW50KXtcbiAgICAgICAgICAgICAgICBldmVudD0kKCc6aG92ZXInKS5sYXN0KCkub2Zmc2V0KClcbiAgICAgICAgICAgIH1lbHNle1xuICAgIFxuICAgICAgICAgICAgICAgIGlmIChldmVudC50b3AgKyAkKF90aGlzLm1lbnUuZG9tKS5oZWlnaHQoKSA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAkKF90aGlzLm1lbnUuZG9tKS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmxlZnQgKyAkKF90aGlzLm1lbnUuZG9tKS53aWR0aCgpID4gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQubGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gJChfdGhpcy5tZW51LmRvbSkud2lkdGgoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgJChfdGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoJ29wZW4nLCBldmVudCk7XG4gICAgICAgIH0sIDEwKTtcbiAgICB9XG4gICAgY2xvc2UoKSB7XG4gICAgICAgICQodGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoJ2Nsb3NlJywgZXZlbnQpO1xuICAgIH1cblxuICAgIGV4dGVuc2lvbkNhbGxlZChhY3Rpb246IEV4dGVuc2lvbkFjdGlvbikge1xuICAgICAgICBpZiAoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVudS5leHRlbnNpb25DYWxsZWQoYWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVySW52aXNpYmxlQ29tcG9uZW50Q2xpY2tlZCkge1xuICAgICAgICAgICAgdmFyIGRlc2lnbiA9IGFjdGlvbi5jb21wb25lbnREZXNpZ25lckludmlzaWJsZUNvbXBvbmVudENsaWNrZWQuZGVzaWduQnV0dG9uLmRvbTtcbiAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMuc2hvdyh7IHRvcDogJChkZXNpZ24pLm9mZnNldCgpLnRvcCArIDMwLCBsZWZ0OiAkKGRlc2lnbikub2Zmc2V0KCkubGVmdCArIDUgfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93KGRlc2lnbik7Ly97IHRvcDogJChkZXNpZ24pLm9mZnNldCgpLnRvcCwgbGVmdDogJChkZXNpZ24pLm9mZnNldCgpLmxlZnQgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBzdXBlci5leHRlbnNpb25DYWxsZWQoYWN0aW9uKTtcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgd2hpbGUgKHRoaXMuY29udGV4dENvbXBvbmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy51bnJlZ2lzdGVyQ29tcG9uZW50KHRoaXMuY29udGV4dENvbXBvbmVudHNbMF0pO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoXCJtZW51XCIsIFwiI1wiICsgdGhpcy5tZW51Ll9pZCk7XG4gICAgICAgICQodGhpcy5tZW51LmRvbSkuY29udGV4dE1lbnUoXCJkZXN0cm95XCIpO1xuICAgICAgICB0aGlzLm1lbnUuZGVzdHJveSgpO1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgfVxuXG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcblxuICAgIHZhciBQYW5lbCA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzLnVpLlBhbmVsXCIpO1xuICAgIHZhciBCdXR0b24gPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqcy51aS5CdXR0b25cIik7XG4gICAgdmFyIE1lbnVJdGVtID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanMudWkuTWVudUl0ZW1cIik7XG4gICAgdmFyIEZpbGVOb2RlID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanMucmVtb3RlLkZpbGVOb2RlXCIpO1xuXG4gICAgdmFyIGJ0ID0gbmV3IEJ1dHRvbigpO1xuICAgIHZhciBjbWVuID0gbmV3IENvbnRleHRNZW51KCk7XG4gICAgdmFyIG1lbiA9IG5ldyBNZW51SXRlbSgpO1xuICAgIC8vdmFyIHBhbj1uZXcgUGFuZWwoKTtcblxuICAgIG1lbi50ZXh0ID0gXCJzdGF0aWMgTWVudVwiO1xuICAgIG1lbi5vbmNsaWNrKCgpID0+IHsgYWxlcnQoXCJva1wiKTsgfSk7XG4gICAgY21lbi5pbmNsdWRlQ2xhc3NBY3Rpb25zID0gdHJ1ZTtcbiAgICBjbWVuLm1lbnUuYWRkKG1lbik7XG4gICAgdmFyIG5kID0gbmV3IEZpbGVOb2RlKCk7XG4gICAgbmQubmFtZSA9IFwiRmlsZVwiO1xuICAgIGNtZW4udmFsdWUgPSBbbmRdO1xuICAgIGNtZW4uZ2V0QWN0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uIChvYmplY3RzOiBbXSk6IFByb21pc2U8QWN0aW9uW10+IHtcbiAgICAgICAgdmFyIGFsbCA9IG9iamVjdHM7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgbmFtZTogXCJnZXRBY3Rpb25zLUFjdGlvblwiLCBjYWxsOiBmdW5jdGlvbiAob2I6IGFueVtdKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQob2JbMF1bXCJuYW1lXCJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICB9O1xuICAgIGJ0LmNvbnRleHRNZW51ID0gY21lbjtcbiAgICBidC50ZXh0ID0gXCJoYWxsb1wiO1xuICAgIC8vcGFuLmFkZChidCk7XG5cbiAgICAvL2J0LmRvbVdyYXBwZXIuYXBwZW5kQ2hpbGQoY21lbi5kb21XcmFwcGVyKTtcbiAgICAvL3Bhbi5hZGQoY21lbik7XG4gICAgcmV0dXJuIGJ0O1xufSJdfQ==