var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/DataComponent", "jassi/ui/Property", "jassi/ui/Component", "jassi/ui/Textbox", "jassi/ui/Calendar", "jassi/ext/tabulator"], function (require, exports, Jassi_1, DataComponent_1, Property_1, Component_1, Textbox_1, Calendar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Table = void 0;
    ;
    let TableEditorProperties = class TableEditorProperties {
        cellDblClick() { }
    };
    __decorate([
        Property_1.$Property({ default: undefined }),
        __metadata("design:type", Number)
    ], TableEditorProperties.prototype, "paginationSize", void 0);
    __decorate([
        Property_1.$Property({ default: true }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "headerSort", void 0);
    __decorate([
        Property_1.$Property({ default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] }),
        __metadata("design:type", String)
    ], TableEditorProperties.prototype, "layout", void 0);
    __decorate([
        Property_1.$Property({ default: undefined }),
        __metadata("design:type", Function)
    ], TableEditorProperties.prototype, "dataTreeChildFunction", void 0);
    __decorate([
        Property_1.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "movableColumns", void 0);
    __decorate([
        Property_1.$Property({ default: "function(event:any,group:any){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TableEditorProperties.prototype, "cellDblClick", null);
    TableEditorProperties = __decorate([
        Jassi_1.$Class("jassi.ui.TableEditorProperties")
    ], TableEditorProperties);
    let Table = 
    /*
    @$Property({ name: "new/paginationSize", type: "number", default: undefined })
    @$Property({ name: "new/headerSort", type: "boolean", default: true })
    @$Property({ name: "new/layout", type: "string", default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] })
    @$Property({ name: "new/dataTreeChildField", type: "string", default: undefined })
    @$Property({ name: "new/movableColumns", type: "boolean", default: false })
    @$Property({ name: "new/cellDblClick", type: "function", default: "function(event:any,group:any){\n\t\n}" })
    */
    class Table extends DataComponent_1.DataComponent {
        constructor(properties) {
            super();
            super.init($('<div class="Table"></div>')[0]);
            var _this = this;
            if (properties === undefined)
                properties = {};
            if (properties.autoColumns === undefined)
                properties.autoColumns = true;
            if (properties.autoColumnsDefinitions === undefined) {
                properties.autoColumnsDefinitions = this.defaultAutoColumnDefinitions.bind(this);
            }
            if (properties.dataTreeChildFunction !== undefined) {
                //@ts-ignore
                properties.dataTreeChildField = "__treechilds";
                this.dataTreeChildFunction = properties.dataTreeChildFunction;
                delete properties.dataTreeChildFunction;
            }
            if (properties.dataTreeChildField !== undefined)
                properties.dataTree = true;
            if (properties.paginationSize !== undefined && properties.pagination == undefined)
                properties.pagination = "local";
            // if(properties.layoutColumnsOnNewData===undefined)
            //     properties.layoutColumnsOnNewData=true;
            if (properties.selectable === undefined)
                properties.selectable = 1;
            // if (properties.autoResize === undefined)//error ResizeObserver loop limit exceeded 
            //    properties.autoResize = false;
            if (properties.layout === undefined)
                properties.layout = "fitDataStretch"; //"fitDataFill";////"fitColumns";
            var dataTreeRowExpanded = properties.dataTreeRowExpanded;
            properties.dataTreeRowExpanded = function (row, level) {
                _this.onTreeExpanded(row, level);
                if (dataTreeRowExpanded !== undefined) {
                    dataTreeRowExpanded(row, level);
                }
            };
            var rowClick = properties.rowClick;
            properties.rowClick = function (e, row) {
                _this._onselect(e, row);
                if (rowClick !== undefined) {
                    rowClick(e, row);
                }
            };
            var contextClick = properties.cellContext;
            properties.cellContext = function (e, row) {
                _this._oncontext(e, row);
                if (contextClick !== undefined) {
                    contextClick(e, row);
                }
                return undefined;
            };
            this.table = new Tabulator("[id='" + this._id + "']", properties);
            this.layout();
        }
        ;
        defaultAutoColumnDefinitions(definitions) {
            var _this = this;
            var ret = [];
            for (let x = 0; x < definitions.length; x++) {
                var data;
                if (definitions[x].sorter === "array")
                    continue;
                if (_this.items && _this.items.length > 0) {
                    data = _this.items[0][definitions[x].field];
                    if (typeof data === "function")
                        continue;
                    if (data instanceof Date) {
                        definitions[x].formatter = function (cell, formatterParams, onRendered) {
                            return Calendar_1.Calendar.formatDate(cell.getValue()); //return the contents of the cell;
                        };
                    }
                }
                ret.push(definitions[x]);
            }
            return ret;
        }
        getChildsFromTreeFunction(data) {
            var childs;
            if (typeof this.dataTreeChildFunction === "function") {
                childs = this.dataTreeChildFunction(data);
            }
            else {
                childs = data[this.dataTreeChildFunction];
                if (typeof childs === "function")
                    childs = childs.bind(data)();
            }
            return childs;
        }
        populateTreeData(data) {
            var childs = this.getChildsFromTreeFunction(data);
            if (childs && childs.length > 0) {
                Object.defineProperty(data, "__treechilds", {
                    configurable: true,
                    get: function () {
                        return childs;
                    }
                });
                for (var x = 0; x < childs.length; x++) {
                    var nchilds = this.getChildsFromTreeFunction(childs[x]);
                    if (nchilds && nchilds.length > 0) {
                        Object.defineProperty(childs[x], "__treechilds", {
                            configurable: true,
                            get: function () {
                                return ["dummy"];
                            }
                        });
                    }
                }
            }
        }
        onTreeExpanded(row, level) {
            if (this.dataTreeChildFunction) {
                var data = row.getData();
                let childs = data.__treechilds; //this.getChildsFromTreeFunction(data)   //row.getData()["childs"];
                for (let f = 0; f < childs.length; f++) {
                    this.populateTreeData(childs[f]);
                }
                row.update(data);
            }
        }
        layout() {
            this._selectHandler = [];
        }
        async update() {
            await this.table.updateData(this.items);
        }
        _oncontext(event, row) {
            if (this.contextMenu !== undefined) {
                this.contextMenu.value = [row.getData()];
                event.data = [row.getData()];
                this.contextMenu.show(event);
            }
        }
        _onselect(event, row) {
            var selection = [];
            var aids = undefined;
            if (this.selectComponent === undefined && this._eventHandler["select"] === undefined)
                return;
            event.data = row.getData();
            if (this._select !== undefined)
                this._select.value = event.data;
            this.callEvent("select", event);
        }
        /**
         * register an event if an item is selected
         * @param {function} handler - the function that is called on change
         */
        onchange(handler) {
            this.addEvent("select", handler);
        }
        get showSearchbox() {
            return this._searchbox !== undefined;
        }
        set showSearchbox(enable) {
            let _this = this;
            if (!enable) {
                if (this._searchbox !== undefined) {
                    this._searchbox.destroy();
                    delete this._searchbox;
                }
            }
            else {
                this._searchbox = new Textbox_1.Textbox();
                this._searchbox.placeholder = "search table...";
                this._searchbox.onkeydown(() => {
                    window.setTimeout(() => {
                        var text = _this._searchbox.value;
                        _this.table.setFilter(data => {
                            for (var key in data) {
                                if (data[key] !== undefined && data[key] !== null && data[key].toString().toLowerCase().indexOf(text) >= 0) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }, 100);
                });
                $(this.domWrapper).prepend(this._searchbox.domWrapper);
            }
        }
        /**
          * if the value is changed then the value of _component is also changed (_component.value)
          */
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        /**
         * set the items of the table
         */
        set items(value) {
            if (value && this.dataTreeChildFunction) { //populate __treechilds
                for (let x = 0; x < value.length; x++) {
                    this.populateTreeData(value[x]);
                }
            }
            this._items = value;
            if (value !== undefined)
                this.table.setData(value);
        }
        get items() {
            return this._items;
        }
        /**
         * @member {object} sel - the selected object
         */
        set value(sel) {
            if (this.items === undefined)
                return;
            var pos = this.items.indexOf(sel);
            //@ts-ignore
            this.table.deselectRow(this.table.getSelectedRows());
            if (pos === -1)
                return;
            //@ts-ignore
            this.table.selectRow(this.table.getRows()[pos]);
            this.table.scrollToRow(this.table.getRows()[pos]);
        }
        get value() {
            var ret = this.table.getSelectedRows();
            if (ret.length === 0) {
                return undefined;
            }
            return ret[0].getData();
            /*var aids = w2ui[this._id].getSelection();
            if (aids.length === 0)
                return undefined;
            var obs = w2ui[this._id].records;
            var selection = [];
            for (var x = 0; x < obs.length; x++) {
                for (var y = 0; y < aids.length; y++) {
                    if (obs[x].id === aids[y]) {
                        var test = obs[x]._originalObject;
                        if (test !== undefined)//extract proxy
                            selection.push(obs[x]._originalObject);
                        else
                            selection.push(obs[x]);
                    }
                }
            }
            return selection.length === 1 ? selection[0] : selection;*/
        }
        /**
        * @member {string|number} - the height of the component
        * e.g. 50 or "100%"
        */
        set height(value) {
            //@ts-ignore
            this.table.setHeight(value);
            //super.height=value;
        }
        get height() {
            return super.height;
        }
        /**
         * Searches records in the grid
         * @param {string} field - name of the search field
         * @param {string} value - value of the search field
         * @param {boolean} [doSelect] - if true the first entry is selected
         */
        search(field, value, doSelect) {
            //custom filter function
            function matchAny(data, filterParams) {
                //data - the data for the row being filtered
                //filterParams - params object passed to the filter
                var _a;
                var match = false;
                for (var key in data) {
                    if (filterParams.value === undefined || filterParams.value === "" || ((_a = data[key]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase().indexOf(filterParams.value.toLowerCase())) > -1) {
                        match = true;
                    }
                }
                return match;
            }
            //set filter to custom function
            this.table.setFilter(matchAny, { value: value });
            if (doSelect) {
                //@ts-ignore
                this.table.deselectRow(this.table.getSelectedRows());
                //@ts-ignore
                this.table.selectRow(this.table.getRowFromPosition(0, true));
            }
        }
        destroy() {
            // this.tree = undefined;
            if (this._searchbox !== undefined)
                this._searchbox.destroy();
            if (this._databinderItems !== undefined) {
                this._databinderItems.remove(this);
                this._databinderItems = undefined;
            }
            super.destroy();
        }
        set columns(value) {
            this.table.setColumns(value);
            this.update();
        }
        get columns() {
            return this.table.getColumnDefinitions();
        }
        bindItems(databinder, property) {
            this._databinderItems = databinder;
            var _this = this;
            this._databinderItems.add(property, this, undefined, (tab) => {
                return tab.items;
            }, (tab, val) => {
                tab.items = val;
            });
            //databinderItems.add(property, this, "onchange");
            //databinder.checkAutocommit(this);
        }
    };
    __decorate([
        Property_1.$Property({ default: "function(event?: JQueryEventObject, data?:Tabulator.RowComponent){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "onchange", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Table.prototype, "showSearchbox", null);
    __decorate([
        Property_1.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "height", null);
    __decorate([
        Property_1.$Property({ type: "databinder" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "bindItems", null);
    Table = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Table", icon: "mdi mdi-grid" }),
        Jassi_1.$Class("jassi.ui.Table"),
        Property_1.$Property({ name: "new", type: "json", componentType: "jassi.ui.TableEditorProperties" })
        /*
        @$Property({ name: "new/paginationSize", type: "number", default: undefined })
        @$Property({ name: "new/headerSort", type: "boolean", default: true })
        @$Property({ name: "new/layout", type: "string", default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] })
        @$Property({ name: "new/dataTreeChildField", type: "string", default: undefined })
        @$Property({ name: "new/movableColumns", type: "boolean", default: false })
        @$Property({ name: "new/cellDblClick", type: "function", default: "function(event:any,group:any){\n\t\n}" })
        */
        ,
        __metadata("design:paramtypes", [Object])
    ], Table);
    exports.Table = Table;
    async function test() {
        var tab = new Table({});
        tab.width = 400;
        var tabledata = [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
        ];
        window.setTimeout(() => {
            tab.items = tabledata;
        }, 100);
        //tab.select = {};
        // tab.showSearchbox = true;
        //    var kunden = await jassi.db.load("de.Kunde");
        //   tab.items = kunden;
        return tab;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaS91aS9UYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBQUEsQ0FBQztJQWdCRCxJQUFNLHFCQUFxQixHQUEzQixNQUFNLHFCQUFxQjtRQVl2QixZQUFZLEtBQUssQ0FBQztLQUNyQixDQUFBO0lBWEc7UUFEQyxvQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxDQUFDOztpRUFDWDtJQUV2QjtRQURDLG9CQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUM7OzZEQUNUO0lBRXBCO1FBREMsb0JBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7O3lEQUNsRztJQUVmO1FBREMsb0JBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQzs7d0VBQ1E7SUFFMUM7UUFEQyxvQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDOztpRUFDTjtJQUV4QjtRQURDLG9CQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsdUNBQXVDLEVBQUUsQ0FBQzs7Ozs2REFDOUM7SUFaaEIscUJBQXFCO1FBRDFCLGNBQU0sQ0FBQyxnQ0FBZ0MsQ0FBQztPQUNuQyxxQkFBcUIsQ0FhMUI7SUFlRCxJQUFhLEtBQUs7SUFWbEI7Ozs7Ozs7TUFPRTtJQUdGLE1BQWEsS0FBTSxTQUFRLDZCQUFhO1FBU3BDLFlBQVksVUFBeUI7WUFDakMsS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksVUFB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QW1CLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUU7U0FDcEYsQ0FBQztRQUVGLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ25CLEdBQUcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBRTFCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVSLGtCQUFrQjtRQUNsQiw0QkFBNEI7UUFHNUIsbURBQW1EO1FBQ25ELHdCQUF3QjtRQUV4QixPQUFPLEdBQUcsQ0FBQztJQUVmLENBQUM7SUEzQkQsb0JBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpL3JlbW90ZS9KYXNzaVwiO1xuXG5pbXBvcnQgXCJqYXNzaS9leHQvdGFidWxhdG9yXCI7XG5pbXBvcnQgeyBEYXRhQ29tcG9uZW50IH0gZnJvbSBcImphc3NpL3VpL0RhdGFDb21wb25lbnRcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaS91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50LCAkVUlDb21wb25lbnQgfSBmcm9tIFwiamFzc2kvdWkvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpL3VpL1RleHRib3hcIjtcbmltcG9ydCB7IENhbGVuZGFyIH0gZnJvbSBcImphc3NpL3VpL0NhbGVuZGFyXCI7XG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpL3VpL0RhdGFiaW5kZXJcIjtcblxuaW50ZXJmYWNlIFRhYmxlT3B0aW9ucyBleHRlbmRzIFRhYnVsYXRvci5PcHRpb25zIHtcbiAgICBkYXRhVHJlZUNoaWxkRnVuY3Rpb24/OiAoKGRhdGE6IGFueSkgPT4gYW55KXxhbnk7XG5cbn1cbkAkQ2xhc3MoXCJqYXNzaS51aS5UYWJsZUVkaXRvclByb3BlcnRpZXNcIilcbmNsYXNzIFRhYmxlRWRpdG9yUHJvcGVydGllcyB7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IHVuZGVmaW5lZCB9KVxuICAgIHBhZ2luYXRpb25TaXplOiBudW1iZXI7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IHRydWUgfSlcbiAgICBoZWFkZXJTb3J0OiBib29sZWFuO1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZpdERhdGFTdHJldGNoXCIsIGNob29zZUZyb206IFsnZml0RGF0YScsICdmaXRDb2x1bW5zJywgJ2ZpdERhdGFGaWxsJywgJ2ZpdERhdGFTdHJldGNoJ10gfSlcbiAgICBsYXlvdXQ6IHN0cmluZztcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogdW5kZWZpbmVkIH0pXG4gICAgZGF0YVRyZWVDaGlsZEZ1bmN0aW9uOiAoYW55KSA9PiBhbnkgfCBhbnk7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IGZhbHNlIH0pXG4gICAgbW92YWJsZUNvbHVtbnM6IGJvb2xlYW47XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IFwiZnVuY3Rpb24oZXZlbnQ6YW55LGdyb3VwOmFueSl7XFxuXFx0XFxufVwiIH0pXG4gICAgY2VsbERibENsaWNrKCkgeyB9XG59XG5cbkAkVUlDb21wb25lbnQoeyBmdWxsUGF0aDogXCJjb21tb24vVGFibGVcIiwgaWNvbjogXCJtZGkgbWRpLWdyaWRcIiB9KVxuQCRDbGFzcyhcImphc3NpLnVpLlRhYmxlXCIpXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXdcIiwgdHlwZTogXCJqc29uXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2kudWkuVGFibGVFZGl0b3JQcm9wZXJ0aWVzXCIgfSlcbi8qXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvcGFnaW5hdGlvblNpemVcIiwgdHlwZTogXCJudW1iZXJcIiwgZGVmYXVsdDogdW5kZWZpbmVkIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvaGVhZGVyU29ydFwiLCB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdDogdHJ1ZSB9KVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3L2xheW91dFwiLCB0eXBlOiBcInN0cmluZ1wiLCBkZWZhdWx0OiBcImZpdERhdGFTdHJldGNoXCIsIGNob29zZUZyb206IFsnZml0RGF0YScsICdmaXRDb2x1bW5zJywgJ2ZpdERhdGFGaWxsJywgJ2ZpdERhdGFTdHJldGNoJ10gfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9kYXRhVHJlZUNoaWxkRmllbGRcIiwgdHlwZTogXCJzdHJpbmdcIiwgZGVmYXVsdDogdW5kZWZpbmVkIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvbW92YWJsZUNvbHVtbnNcIiwgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHQ6IGZhbHNlIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvY2VsbERibENsaWNrXCIsIHR5cGU6IFwiZnVuY3Rpb25cIiwgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudDphbnksZ3JvdXA6YW55KXtcXG5cXHRcXG59XCIgfSlcbiovXG5cblxuZXhwb3J0IGNsYXNzIFRhYmxlIGV4dGVuZHMgRGF0YUNvbXBvbmVudCB7XG4gICAgdGFibGU6IFRhYnVsYXRvcjtcbiAgICBfc2VsZWN0SGFuZGxlcjtcbiAgICBfc2VsZWN0OiB7IHZhbHVlOiBhbnkgfTs7XG4gICAgX3RyZWU7XG4gICAgX2l0ZW1zOiBhbnlbXTtcbiAgICBfc2VhcmNoYm94OiBUZXh0Ym94O1xuICAgIF9kYXRhYmluZGVySXRlbXM6RGF0YWJpbmRlcjtcbiAgICBwcml2YXRlIGRhdGFUcmVlQ2hpbGRGdW5jdGlvbjogc3RyaW5nIHwgKChvYmo6IGFueSkgPT4gYW55KTtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzPzogVGFibGVPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHN1cGVyLmluaXQoJCgnPGRpdiBjbGFzcz1cIlRhYmxlXCI+PC9kaXY+JylbMF0pO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAocHJvcGVydGllcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHt9O1xuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmF1dG9Db2x1bW5zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmF1dG9Db2x1bW5zID0gdHJ1ZTtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMuYXV0b0NvbHVtbnNEZWZpbml0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIHByb3BlcnRpZXMuYXV0b0NvbHVtbnNEZWZpbml0aW9ucyA9IHRoaXMuZGVmYXVsdEF1dG9Db2x1bW5EZWZpbml0aW9ucy5iaW5kKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmRhdGFUcmVlQ2hpbGRGdW5jdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIHByb3BlcnRpZXMuZGF0YVRyZWVDaGlsZEZpZWxkID0gXCJfX3RyZWVjaGlsZHNcIjtcbiAgICAgICAgICAgIHRoaXMuZGF0YVRyZWVDaGlsZEZ1bmN0aW9uID0gcHJvcGVydGllcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb247XG4gICAgICAgICAgICBkZWxldGUgcHJvcGVydGllcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3BlcnRpZXMuZGF0YVRyZWVDaGlsZEZpZWxkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmRhdGFUcmVlID0gdHJ1ZTtcblxuICAgICAgICBpZiAocHJvcGVydGllcy5wYWdpbmF0aW9uU2l6ZSAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnRpZXMucGFnaW5hdGlvbiA9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnBhZ2luYXRpb24gPSBcImxvY2FsXCI7XG4gICAgICAgIC8vIGlmKHByb3BlcnRpZXMubGF5b3V0Q29sdW1uc09uTmV3RGF0YT09PXVuZGVmaW5lZClcbiAgICAgICAgLy8gICAgIHByb3BlcnRpZXMubGF5b3V0Q29sdW1uc09uTmV3RGF0YT10cnVlO1xuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLnNlbGVjdGFibGUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHByb3BlcnRpZXMuc2VsZWN0YWJsZSA9IDE7XG4gICAgICAgIC8vIGlmIChwcm9wZXJ0aWVzLmF1dG9SZXNpemUgPT09IHVuZGVmaW5lZCkvL2Vycm9yIFJlc2l6ZU9ic2VydmVyIGxvb3AgbGltaXQgZXhjZWVkZWQgXG4gICAgICAgIC8vICAgIHByb3BlcnRpZXMuYXV0b1Jlc2l6ZSA9IGZhbHNlO1xuICAgICAgICBpZiAocHJvcGVydGllcy5sYXlvdXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHByb3BlcnRpZXMubGF5b3V0ID0gXCJmaXREYXRhU3RyZXRjaFwiOyAvL1wiZml0RGF0YUZpbGxcIjsvLy8vXCJmaXRDb2x1bW5zXCI7XG4gICAgICAgIHZhciBkYXRhVHJlZVJvd0V4cGFuZGVkID0gcHJvcGVydGllcy5kYXRhVHJlZVJvd0V4cGFuZGVkO1xuICAgICAgICBwcm9wZXJ0aWVzLmRhdGFUcmVlUm93RXhwYW5kZWQgPSBmdW5jdGlvbiAocm93OiBUYWJ1bGF0b3IuUm93Q29tcG9uZW50LCBsZXZlbCkge1xuICAgICAgICAgICAgX3RoaXMub25UcmVlRXhwYW5kZWQocm93LCBsZXZlbCk7XG4gICAgICAgICAgICBpZiAoZGF0YVRyZWVSb3dFeHBhbmRlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZGF0YVRyZWVSb3dFeHBhbmRlZChyb3csIGxldmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJvd0NsaWNrID0gcHJvcGVydGllcy5yb3dDbGljaztcbiAgICAgICAgcHJvcGVydGllcy5yb3dDbGljayA9IGZ1bmN0aW9uIChlOiBhbnksIHJvdzogVGFidWxhdG9yLlJvd0NvbXBvbmVudCkge1xuICAgICAgICAgICAgX3RoaXMuX29uc2VsZWN0KGUsIHJvdyk7XG4gICAgICAgICAgICBpZiAocm93Q2xpY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJvd0NsaWNrKGUsIHJvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciBjb250ZXh0Q2xpY2sgPSBwcm9wZXJ0aWVzLmNlbGxDb250ZXh0O1xuICAgICAgICBwcm9wZXJ0aWVzLmNlbGxDb250ZXh0ID0gZnVuY3Rpb24gKGU6IGFueSwgcm93OiBUYWJ1bGF0b3IuQ2VsbENvbXBvbmVudCkge1xuICAgICAgICAgICAgX3RoaXMuX29uY29udGV4dChlLCByb3cpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRDbGljayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dENsaWNrKGUsIHJvdyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudGFibGUgPSBuZXcgVGFidWxhdG9yKFwiW2lkPSdcIiArIHRoaXMuX2lkICsgXCInXVwiLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBkZWZhdWx0QXV0b0NvbHVtbkRlZmluaXRpb25zKGRlZmluaXRpb25zOiBUYWJ1bGF0b3IuQ29sdW1uRGVmaW5pdGlvbltdKTogVGFidWxhdG9yLkNvbHVtbkRlZmluaXRpb25bXSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciByZXQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBkZWZpbml0aW9ucy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGRhdGE7XG4gICAgICAgICAgICBpZiAoZGVmaW5pdGlvbnNbeF0uc29ydGVyID09PSBcImFycmF5XCIpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAoX3RoaXMuaXRlbXMgJiYgX3RoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBfdGhpcy5pdGVtc1swXVtkZWZpbml0aW9uc1t4XS5maWVsZF07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbml0aW9uc1t4XS5mb3JtYXR0ZXIgPSBmdW5jdGlvbiAoY2VsbCwgZm9ybWF0dGVyUGFyYW1zLCBvblJlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gQ2FsZW5kYXIuZm9ybWF0RGF0ZShjZWxsLmdldFZhbHVlKCkpOyAvL3JldHVybiB0aGUgY29udGVudHMgb2YgdGhlIGNlbGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0LnB1c2goZGVmaW5pdGlvbnNbeF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcblxuICAgICAgICB9XG4gICAgcHJpdmF0ZSBnZXRDaGlsZHNGcm9tVHJlZUZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdmFyIGNoaWxkcztcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmRhdGFUcmVlQ2hpbGRGdW5jdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjaGlsZHMgPSB0aGlzLmRhdGFUcmVlQ2hpbGRGdW5jdGlvbihkYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoaWxkcyA9IGRhdGFbdGhpcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb25dO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjaGlsZHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICBjaGlsZHMgPSBjaGlsZHMuYmluZChkYXRhKSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZHM7XG4gICAgfVxuICAgIHByaXZhdGUgcG9wdWxhdGVUcmVlRGF0YShkYXRhKSB7XG5cbiAgICAgICAgdmFyIGNoaWxkcyA9IHRoaXMuZ2V0Q2hpbGRzRnJvbVRyZWVGdW5jdGlvbihkYXRhKTtcblxuICAgICAgICBpZiAoY2hpbGRzICYmIGNoaWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGF0YSwgXCJfX3RyZWVjaGlsZHNcIiwge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5jaGlsZHMgPSB0aGlzLmdldENoaWxkc0Zyb21UcmVlRnVuY3Rpb24oY2hpbGRzW3hdKTtcblxuICAgICAgICAgICAgICAgIGlmIChuY2hpbGRzICYmIG5jaGlsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2hpbGRzW3hdLCBcIl9fdHJlZWNoaWxkc1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1wiZHVtbXlcIl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuICAgIHByaXZhdGUgb25UcmVlRXhwYW5kZWQocm93OiBUYWJ1bGF0b3IuUm93Q29tcG9uZW50LCBsZXZlbCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gcm93LmdldERhdGEoKTtcbiAgICAgICAgICAgIGxldCBjaGlsZHMgPSBkYXRhLl9fdHJlZWNoaWxkczsvL3RoaXMuZ2V0Q2hpbGRzRnJvbVRyZWVGdW5jdGlvbihkYXRhKSAgIC8vcm93LmdldERhdGEoKVtcImNoaWxkc1wiXTtcbiAgICAgICAgICAgIGZvciAobGV0IGYgPSAwOyBmIDwgY2hpbGRzLmxlbmd0aDsgZisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVRyZWVEYXRhKGNoaWxkc1tmXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3cudXBkYXRlKGRhdGEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxheW91dCgpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0SGFuZGxlciA9IFtdO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZSgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy50YWJsZS51cGRhdGVEYXRhKHRoaXMuaXRlbXMpO1xuICAgIH1cbiAgICBwcml2YXRlIF9vbmNvbnRleHQoZXZlbnQ6IGFueSwgcm93OiBUYWJ1bGF0b3IuQ2VsbENvbXBvbmVudCkge1xuICAgICAgICBpZiAodGhpcy5jb250ZXh0TWVudSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnZhbHVlID0gW3Jvdy5nZXREYXRhKCldO1xuICAgICAgICAgICAgZXZlbnQuZGF0YSA9IFtyb3cuZ2V0RGF0YSgpXTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuc2hvdyhldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9vbnNlbGVjdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIHJvdzogVGFidWxhdG9yLlJvd0NvbXBvbmVudCkge1xuICAgICAgICB2YXIgc2VsZWN0aW9uID0gW107XG4gICAgICAgIHZhciBhaWRzID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5zZWxlY3RDb21wb25lbnQgPT09IHVuZGVmaW5lZCAmJiB0aGlzLl9ldmVudEhhbmRsZXJbXCJzZWxlY3RcIl0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZXZlbnQuZGF0YSA9IHJvdy5nZXREYXRhKCk7XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC52YWx1ZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwic2VsZWN0XCIsIGV2ZW50KTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIGFuIGV2ZW50IGlmIGFuIGl0ZW0gaXMgc2VsZWN0ZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGNoYW5nZVxuICAgICAqL1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50PzogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE/OlRhYnVsYXRvci5Sb3dDb21wb25lbnQpe1xcblxcdFxcbn1cIiB9KVxuICAgIG9uY2hhbmdlKGhhbmRsZXI6IChldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LCByb3c/OiBUYWJ1bGF0b3IuUm93Q29tcG9uZW50KSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJzZWxlY3RcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoKVxuICAgIGdldCBzaG93U2VhcmNoYm94KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VhcmNoYm94ICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHNldCBzaG93U2VhcmNoYm94KGVuYWJsZTogYm9vbGVhbikge1xuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIWVuYWJsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NlYXJjaGJveCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VhcmNoYm94LmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fc2VhcmNoYm94O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2VhcmNoYm94ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaGJveC5wbGFjZWhvbGRlciA9IFwic2VhcmNoIHRhYmxlLi4uXCI7XG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hib3gub25rZXlkb3duKCgpID0+IHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gX3RoaXMuX3NlYXJjaGJveC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudGFibGUuc2V0RmlsdGVyKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQgJiYgZGF0YVtrZXldICE9PSBudWxsICYmIGRhdGFba2V5XS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLnByZXBlbmQodGhpcy5fc2VhcmNoYm94LmRvbVdyYXBwZXIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgICogaWYgdGhlIHZhbHVlIGlzIGNoYW5nZWQgdGhlbiB0aGUgdmFsdWUgb2YgX2NvbXBvbmVudCBpcyBhbHNvIGNoYW5nZWQgKF9jb21wb25lbnQudmFsdWUpXG4gICAgICAqL1xuICAgIHNldCBzZWxlY3RDb21wb25lbnQoX2NvbXBvbmVudDogYW55KSB7IC8vdGhlIENvZGVcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gX2NvbXBvbmVudDtcbiAgICB9XG4gICAgZ2V0IHNlbGVjdENvbXBvbmVudCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0Oy8vJCh0aGlzLmRvbSkudGV4dCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIGl0ZW1zIG9mIHRoZSB0YWJsZVxuICAgICAqL1xuICAgIHNldCBpdGVtcyh2YWx1ZTogYW55W10pIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHRoaXMuZGF0YVRyZWVDaGlsZEZ1bmN0aW9uKSB7Ly9wb3B1bGF0ZSBfX3RyZWVjaGlsZHNcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdmFsdWUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBvcHVsYXRlVHJlZURhdGEodmFsdWVbeF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy50YWJsZS5zZXREYXRhKHZhbHVlKTtcbiAgICB9XG4gICAgZ2V0IGl0ZW1zKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge29iamVjdH0gc2VsIC0gdGhlIHNlbGVjdGVkIG9iamVjdFxuICAgICAqL1xuICAgIHNldCB2YWx1ZShzZWwpIHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMuaXRlbXMuaW5kZXhPZihzZWwpO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdGhpcy50YWJsZS5kZXNlbGVjdFJvdyh0aGlzLnRhYmxlLmdldFNlbGVjdGVkUm93cygpKTtcbiAgICAgICAgaWYgKHBvcyA9PT0gLTEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdFJvdyh0aGlzLnRhYmxlLmdldFJvd3MoKVtwb3NdKTtcbiAgICAgICAgdGhpcy50YWJsZS5zY3JvbGxUb1Jvdyh0aGlzLnRhYmxlLmdldFJvd3MoKVtwb3NdKTtcbiAgICB9XG4gICAgZ2V0IHZhbHVlKCkge1xuXG4gICAgICAgIHZhciByZXQgPSB0aGlzLnRhYmxlLmdldFNlbGVjdGVkUm93cygpO1xuICAgICAgICBpZiAocmV0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0WzBdLmdldERhdGEoKTtcbiAgICAgICAgLyp2YXIgYWlkcyA9IHcydWlbdGhpcy5faWRdLmdldFNlbGVjdGlvbigpO1xuICAgICAgICBpZiAoYWlkcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgb2JzID0gdzJ1aVt0aGlzLl9pZF0ucmVjb3JkcztcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG9icy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPCBhaWRzLmxlbmd0aDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9ic1t4XS5pZCA9PT0gYWlkc1t5XSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IG9ic1t4XS5fb3JpZ2luYWxPYmplY3Q7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ICE9PSB1bmRlZmluZWQpLy9leHRyYWN0IHByb3h5XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb24ucHVzaChvYnNbeF0uX29yaWdpbmFsT2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLnB1c2gob2JzW3hdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlbGVjdGlvbi5sZW5ndGggPT09IDEgPyBzZWxlY3Rpb25bMF0gOiBzZWxlY3Rpb247Ki9cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgKiBAbWVtYmVyIHtzdHJpbmd8bnVtYmVyfSAtIHRoZSBoZWlnaHQgb2YgdGhlIGNvbXBvbmVudCBcbiAgICAqIGUuZy4gNTAgb3IgXCIxMDAlXCJcbiAgICAqL1xuICAgIHNldCBoZWlnaHQodmFsdWU6IHN0cmluZyB8IG51bWJlcikgeyAvL3RoZSBDb2RlXG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLnRhYmxlLnNldEhlaWdodCh2YWx1ZSk7XG4gICAgICAgIC8vc3VwZXIuaGVpZ2h0PXZhbHVlO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiB9KVxuICAgIGdldCBoZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2VhcmNoZXMgcmVjb3JkcyBpbiB0aGUgZ3JpZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZCAtIG5hbWUgb2YgdGhlIHNlYXJjaCBmaWVsZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAtIHZhbHVlIG9mIHRoZSBzZWFyY2ggZmllbGRcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtkb1NlbGVjdF0gLSBpZiB0cnVlIHRoZSBmaXJzdCBlbnRyeSBpcyBzZWxlY3RlZFxuICAgICAqL1xuICAgIHNlYXJjaChmaWVsZCwgdmFsdWUsIGRvU2VsZWN0KSB7XG5cdC8vY3VzdG9tIGZpbHRlciBmdW5jdGlvblxuXHRcdFx0ZnVuY3Rpb24gbWF0Y2hBbnkoZGF0YSwgZmlsdGVyUGFyYW1zKSB7XG5cdFx0XHRcdC8vZGF0YSAtIHRoZSBkYXRhIGZvciB0aGUgcm93IGJlaW5nIGZpbHRlcmVkXG5cdFx0XHRcdC8vZmlsdGVyUGFyYW1zIC0gcGFyYW1zIG9iamVjdCBwYXNzZWQgdG8gdGhlIGZpbHRlclxuXG5cdFx0XHRcdHZhciBtYXRjaCA9IGZhbHNlO1xuXG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKGZpbHRlclBhcmFtcy52YWx1ZT09PXVuZGVmaW5lZHx8ZmlsdGVyUGFyYW1zLnZhbHVlPT09XCJcInx8ZGF0YVtrZXldPy50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXJQYXJhbXMudmFsdWUudG9Mb3dlckNhc2UoKSk+LTEpIHtcblx0XHRcdFx0XHRcdG1hdGNoID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbWF0Y2g7XG5cdFx0XHR9XG5cblx0XHRcdC8vc2V0IGZpbHRlciB0byBjdXN0b20gZnVuY3Rpb25cblx0XHRcdHRoaXMudGFibGUuc2V0RmlsdGVyKCBtYXRjaEFueSwgeyB2YWx1ZTogdmFsdWUgfSk7XG4gICAgICAgICAgICBpZihkb1NlbGVjdCkge1xuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHRoaXMudGFibGUuZGVzZWxlY3RSb3codGhpcy50YWJsZS5nZXRTZWxlY3RlZFJvd3MoKSk7XG4gICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHRoaXMudGFibGUuc2VsZWN0Um93KCB0aGlzLnRhYmxlLmdldFJvd0Zyb21Qb3NpdGlvbigwLHRydWUpKTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgLy8gdGhpcy50cmVlID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5fc2VhcmNoYm94ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hib3guZGVzdHJveSgpO1xuICAgICAgIGlmKHRoaXMuX2RhdGFiaW5kZXJJdGVtcyE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICB0aGlzLl9kYXRhYmluZGVySXRlbXMucmVtb3ZlKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5fZGF0YWJpbmRlckl0ZW1zPXVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgc2V0IGNvbHVtbnModmFsdWU6IFRhYnVsYXRvci5Db2x1bW5EZWZpbml0aW9uW10pIHtcbiAgICAgICAgdGhpcy50YWJsZS5zZXRDb2x1bW5zKHZhbHVlKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9XG4gICAgZ2V0IGNvbHVtbnMoKTogVGFidWxhdG9yLkNvbHVtbkRlZmluaXRpb25bXSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRhYmxlLmdldENvbHVtbkRlZmluaXRpb25zKCk7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImRhdGFiaW5kZXJcIiB9KVxuICAgIGJpbmRJdGVtcyhkYXRhYmluZGVyLCBwcm9wZXJ0eSkge1xuICAgICAgICB0aGlzLl9kYXRhYmluZGVySXRlbXMgPSBkYXRhYmluZGVyO1xuICAgICAgICB2YXIgX3RoaXM9dGhpcztcbiAgICAgICAgIHRoaXMuX2RhdGFiaW5kZXJJdGVtcy5hZGQocHJvcGVydHksIHRoaXMsIHVuZGVmaW5lZCwodGFiKT0+e1xuICAgICAgICAgICAgIHJldHVybiB0YWIuaXRlbXM7XG4gICAgICAgICB9LCh0YWIsdmFsKT0+e1xuICAgICAgICAgICAgIHRhYi5pdGVtcz12YWw7XG4gICAgICAgICB9KTtcblxuICAgICAgICAvL2RhdGFiaW5kZXJJdGVtcy5hZGQocHJvcGVydHksIHRoaXMsIFwib25jaGFuZ2VcIik7XG4gICAgICAgIC8vZGF0YWJpbmRlci5jaGVja0F1dG9jb21taXQodGhpcyk7XG4gICAgfVxufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciB0YWIgPSBuZXcgVGFibGUoe1xuXG4gICAgfSk7XG4gICAgdGFiLndpZHRoID0gNDAwO1xuICAgIHZhciB0YWJsZWRhdGEgPSBbXG4gICAgICAgIHsgaWQ6IDEsIG5hbWU6IFwiT2xpIEJvYlwiLCBhZ2U6IFwiMTJcIiwgY29sOiBcInJlZFwiLCBkb2I6IFwiXCIgfSxcbiAgICAgICAgeyBpZDogMiwgbmFtZTogXCJNYXJ5IE1heVwiLCBhZ2U6IFwiMVwiLCBjb2w6IFwiYmx1ZVwiLCBkb2I6IFwiMTQvMDUvMTk4MlwiIH0sXG4gICAgICAgIHsgaWQ6IDMsIG5hbWU6IFwiQ2hyaXN0aW5lIExvYm93c2tpXCIsIGFnZTogXCI0MlwiLCBjb2w6IFwiZ3JlZW5cIiwgZG9iOiBcIjIyLzA1LzE5ODJcIiB9LFxuICAgICAgICB7IGlkOiA0LCBuYW1lOiBcIkJyZW5kb24gUGhpbGlwc1wiLCBhZ2U6IFwiMTI1XCIsIGNvbDogXCJvcmFuZ2VcIiwgZG9iOiBcIjAxLzA4LzE5ODBcIiB9LFxuICAgICAgICB7IGlkOiA1LCBuYW1lOiBcIk1hcmdyZXQgTWFybWFqdWtlXCIsIGFnZTogXCIxNlwiLCBjb2w6IFwieWVsbG93XCIsIGRvYjogXCIzMS8wMS8xOTk5XCIgfSxcbiAgICBdO1xuXG4gICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0YWIuaXRlbXMgPSB0YWJsZWRhdGE7XG5cbiAgICB9LCAxMDApO1xuXG4gICAgLy90YWIuc2VsZWN0ID0ge307XG4gICAgLy8gdGFiLnNob3dTZWFyY2hib3ggPSB0cnVlO1xuXG5cbiAgICAvLyAgICB2YXIga3VuZGVuID0gYXdhaXQgamFzc2kuZGIubG9hZChcImRlLkt1bmRlXCIpO1xuICAgIC8vICAgdGFiLml0ZW1zID0ga3VuZGVuO1xuXG4gICAgcmV0dXJuIHRhYjtcblxufVxuIl19