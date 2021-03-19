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
            super.destroy();
        }
        set columns(value) {
            this.table.setColumns(value);
            this.update();
        }
        get columns() {
            return this.table.getColumnDefinitions();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaS91aS9UYWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBZUEsSUFBTSxxQkFBcUIsR0FBM0IsTUFBTSxxQkFBcUI7UUFZdkIsWUFBWSxLQUFLLENBQUM7S0FDckIsQ0FBQTtJQVhHO1FBREMsb0JBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQzs7aUVBQ1g7SUFFdkI7UUFEQyxvQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOzs2REFDVDtJQUVwQjtRQURDLG9CQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxDQUFDOzt5REFDbEc7SUFFZjtRQURDLG9CQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUM7O3dFQUNRO0lBRTFDO1FBREMsb0JBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQzs7aUVBQ047SUFFeEI7UUFEQyxvQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLHVDQUF1QyxFQUFFLENBQUM7Ozs7NkRBQzlDO0lBWmhCLHFCQUFxQjtRQUQxQixjQUFNLENBQUMsZ0NBQWdDLENBQUM7T0FDbkMscUJBQXFCLENBYTFCO0lBZUQsSUFBYSxLQUFLO0lBVmxCOzs7Ozs7O01BT0U7SUFHRixNQUFhLEtBQU0sU0FBUSw2QkFBYTtRQVFwQyxZQUFZLFVBQXlCO1lBQ2pDLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLFVBQVUsS0FBSyxTQUFT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QUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRTtZQUNyRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFO1lBQ2pGLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUU7WUFDaEYsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRTtTQUNwRixDQUFDO1FBRUYsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDbkIsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7UUFFMUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRVIsa0JBQWtCO1FBQ2xCLDRCQUE0QjtRQUc1QixtREFBbUQ7UUFDbkQsd0JBQXdCO1FBRXhCLE9BQU8sR0FBRyxDQUFDO0lBRWYsQ0FBQztJQTNCRCxvQkEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcblxuaW1wb3J0IFwiamFzc2kvZXh0L3RhYnVsYXRvclwiO1xuaW1wb3J0IHsgRGF0YUNvbXBvbmVudCB9IGZyb20gXCJqYXNzaS91aS9EYXRhQ29tcG9uZW50XCI7XG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2kvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IENvbXBvbmVudCwgJFVJQ29tcG9uZW50IH0gZnJvbSBcImphc3NpL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaS91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyBDYWxlbmRhciB9IGZyb20gXCJqYXNzaS91aS9DYWxlbmRhclwiO1xuXG5pbnRlcmZhY2UgVGFibGVPcHRpb25zIGV4dGVuZHMgVGFidWxhdG9yLk9wdGlvbnMge1xuICAgIGRhdGFUcmVlQ2hpbGRGdW5jdGlvbj86ICgoZGF0YTogYW55KSA9PiBhbnkpfGFueTtcblxufVxuQCRDbGFzcyhcImphc3NpLnVpLlRhYmxlRWRpdG9yUHJvcGVydGllc1wiKVxuY2xhc3MgVGFibGVFZGl0b3JQcm9wZXJ0aWVzIHtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogdW5kZWZpbmVkIH0pXG4gICAgcGFnaW5hdGlvblNpemU6IG51bWJlcjtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogdHJ1ZSB9KVxuICAgIGhlYWRlclNvcnQ6IGJvb2xlYW47XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IFwiZml0RGF0YVN0cmV0Y2hcIiwgY2hvb3NlRnJvbTogWydmaXREYXRhJywgJ2ZpdENvbHVtbnMnLCAnZml0RGF0YUZpbGwnLCAnZml0RGF0YVN0cmV0Y2gnXSB9KVxuICAgIGxheW91dDogc3RyaW5nO1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiB1bmRlZmluZWQgfSlcbiAgICBkYXRhVHJlZUNoaWxkRnVuY3Rpb246IChhbnkpID0+IGFueSB8IGFueTtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogZmFsc2UgfSlcbiAgICBtb3ZhYmxlQ29sdW1uczogYm9vbGVhbjtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudDphbnksZ3JvdXA6YW55KXtcXG5cXHRcXG59XCIgfSlcbiAgICBjZWxsRGJsQ2xpY2soKSB7IH1cbn1cblxuQCRVSUNvbXBvbmVudCh7IGZ1bGxQYXRoOiBcImNvbW1vbi9UYWJsZVwiLCBpY29uOiBcIm1kaSBtZGktZ3JpZFwiIH0pXG5AJENsYXNzKFwiamFzc2kudWkuVGFibGVcIilcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ld1wiLCB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaS51aS5UYWJsZUVkaXRvclByb3BlcnRpZXNcIiB9KVxuLypcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9wYWdpbmF0aW9uU2l6ZVwiLCB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiB1bmRlZmluZWQgfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9oZWFkZXJTb3J0XCIsIHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0OiB0cnVlIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvbGF5b3V0XCIsIHR5cGU6IFwic3RyaW5nXCIsIGRlZmF1bHQ6IFwiZml0RGF0YVN0cmV0Y2hcIiwgY2hvb3NlRnJvbTogWydmaXREYXRhJywgJ2ZpdENvbHVtbnMnLCAnZml0RGF0YUZpbGwnLCAnZml0RGF0YVN0cmV0Y2gnXSB9KVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3L2RhdGFUcmVlQ2hpbGRGaWVsZFwiLCB0eXBlOiBcInN0cmluZ1wiLCBkZWZhdWx0OiB1bmRlZmluZWQgfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9tb3ZhYmxlQ29sdW1uc1wiLCB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdDogZmFsc2UgfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9jZWxsRGJsQ2xpY2tcIiwgdHlwZTogXCJmdW5jdGlvblwiLCBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50OmFueSxncm91cDphbnkpe1xcblxcdFxcbn1cIiB9KVxuKi9cblxuXG5leHBvcnQgY2xhc3MgVGFibGUgZXh0ZW5kcyBEYXRhQ29tcG9uZW50IHtcbiAgICB0YWJsZTogVGFidWxhdG9yO1xuICAgIF9zZWxlY3RIYW5kbGVyO1xuICAgIF9zZWxlY3Q6IHsgdmFsdWU6IGFueSB9OztcbiAgICBfdHJlZTtcbiAgICBfaXRlbXM6IGFueVtdO1xuICAgIF9zZWFyY2hib3g6IFRleHRib3g7XG4gICAgcHJpdmF0ZSBkYXRhVHJlZUNoaWxkRnVuY3Rpb246IHN0cmluZyB8ICgob2JqOiBhbnkpID0+IGFueSk7XG4gICAgY29uc3RydWN0b3IocHJvcGVydGllcz86IFRhYmxlT3B0aW9ucykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBzdXBlci5pbml0KCQoJzxkaXYgY2xhc3M9XCJUYWJsZVwiPjwvZGl2PicpWzBdKTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHByb3BlcnRpZXMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSB7fTtcblxuICAgICAgICBpZiAocHJvcGVydGllcy5hdXRvQ29sdW1ucyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcHJvcGVydGllcy5hdXRvQ29sdW1ucyA9IHRydWU7XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmF1dG9Db2x1bW5zRGVmaW5pdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmF1dG9Db2x1bW5zRGVmaW5pdGlvbnMgPSB0aGlzLmRlZmF1bHRBdXRvQ29sdW1uRGVmaW5pdGlvbnMuYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvcGVydGllcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb24gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmRhdGFUcmVlQ2hpbGRGaWVsZCA9IFwiX190cmVlY2hpbGRzXCI7XG4gICAgICAgICAgICB0aGlzLmRhdGFUcmVlQ2hpbGRGdW5jdGlvbiA9IHByb3BlcnRpZXMuZGF0YVRyZWVDaGlsZEZ1bmN0aW9uO1xuICAgICAgICAgICAgZGVsZXRlIHByb3BlcnRpZXMuZGF0YVRyZWVDaGlsZEZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9wZXJ0aWVzLmRhdGFUcmVlQ2hpbGRGaWVsZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcHJvcGVydGllcy5kYXRhVHJlZSA9IHRydWU7XG5cbiAgICAgICAgaWYgKHByb3BlcnRpZXMucGFnaW5hdGlvblNpemUgIT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0aWVzLnBhZ2luYXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcHJvcGVydGllcy5wYWdpbmF0aW9uID0gXCJsb2NhbFwiO1xuICAgICAgICAvLyBpZihwcm9wZXJ0aWVzLmxheW91dENvbHVtbnNPbk5ld0RhdGE9PT11bmRlZmluZWQpXG4gICAgICAgIC8vICAgICBwcm9wZXJ0aWVzLmxheW91dENvbHVtbnNPbk5ld0RhdGE9dHJ1ZTtcblxuICAgICAgICBpZiAocHJvcGVydGllcy5zZWxlY3RhYmxlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnNlbGVjdGFibGUgPSAxO1xuICAgICAgICAvLyBpZiAocHJvcGVydGllcy5hdXRvUmVzaXplID09PSB1bmRlZmluZWQpLy9lcnJvciBSZXNpemVPYnNlcnZlciBsb29wIGxpbWl0IGV4Y2VlZGVkIFxuICAgICAgICAvLyAgICBwcm9wZXJ0aWVzLmF1dG9SZXNpemUgPSBmYWxzZTtcbiAgICAgICAgaWYgKHByb3BlcnRpZXMubGF5b3V0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLmxheW91dCA9IFwiZml0RGF0YVN0cmV0Y2hcIjsgLy9cImZpdERhdGFGaWxsXCI7Ly8vL1wiZml0Q29sdW1uc1wiO1xuICAgICAgICB2YXIgZGF0YVRyZWVSb3dFeHBhbmRlZCA9IHByb3BlcnRpZXMuZGF0YVRyZWVSb3dFeHBhbmRlZDtcbiAgICAgICAgcHJvcGVydGllcy5kYXRhVHJlZVJvd0V4cGFuZGVkID0gZnVuY3Rpb24gKHJvdzogVGFidWxhdG9yLlJvd0NvbXBvbmVudCwgbGV2ZWwpIHtcbiAgICAgICAgICAgIF90aGlzLm9uVHJlZUV4cGFuZGVkKHJvdywgbGV2ZWwpO1xuICAgICAgICAgICAgaWYgKGRhdGFUcmVlUm93RXhwYW5kZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGRhdGFUcmVlUm93RXhwYW5kZWQocm93LCBsZXZlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHZhciByb3dDbGljayA9IHByb3BlcnRpZXMucm93Q2xpY2s7XG4gICAgICAgIHByb3BlcnRpZXMucm93Q2xpY2sgPSBmdW5jdGlvbiAoZTogYW55LCByb3c6IFRhYnVsYXRvci5Sb3dDb21wb25lbnQpIHtcbiAgICAgICAgICAgIF90aGlzLl9vbnNlbGVjdChlLCByb3cpO1xuICAgICAgICAgICAgaWYgKHJvd0NsaWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByb3dDbGljayhlLCByb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB2YXIgY29udGV4dENsaWNrID0gcHJvcGVydGllcy5jZWxsQ29udGV4dDtcbiAgICAgICAgcHJvcGVydGllcy5jZWxsQ29udGV4dCA9IGZ1bmN0aW9uIChlOiBhbnksIHJvdzogVGFidWxhdG9yLkNlbGxDb21wb25lbnQpIHtcbiAgICAgICAgICAgIF90aGlzLl9vbmNvbnRleHQoZSwgcm93KTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0Q2xpY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRDbGljayhlLCByb3cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnRhYmxlID0gbmV3IFRhYnVsYXRvcihcIltpZD0nXCIgKyB0aGlzLl9pZCArIFwiJ11cIiwgcHJvcGVydGllcyk7XG4gICAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgfVxuICAgIHByaXZhdGUgZGVmYXVsdEF1dG9Db2x1bW5EZWZpbml0aW9ucyhkZWZpbml0aW9uczogVGFidWxhdG9yLkNvbHVtbkRlZmluaXRpb25bXSk6IFRhYnVsYXRvci5Db2x1bW5EZWZpbml0aW9uW10ge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgcmV0ID0gW107XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgZGVmaW5pdGlvbnMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBkYXRhO1xuICAgICAgICAgICAgaWYgKGRlZmluaXRpb25zW3hdLnNvcnRlciA9PT0gXCJhcnJheVwiKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKF90aGlzLml0ZW1zICYmIF90aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gX3RoaXMuaXRlbXNbMF1bZGVmaW5pdGlvbnNbeF0uZmllbGRdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGlvbnNbeF0uZm9ybWF0dGVyID0gZnVuY3Rpb24gKGNlbGwsIGZvcm1hdHRlclBhcmFtcywgb25SZW5kZXJlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIENhbGVuZGFyLmZvcm1hdERhdGUoY2VsbC5nZXRWYWx1ZSgpKTsgLy9yZXR1cm4gdGhlIGNvbnRlbnRzIG9mIHRoZSBjZWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldC5wdXNoKGRlZmluaXRpb25zW3hdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG5cbiAgICAgICAgfVxuICAgIHByaXZhdGUgZ2V0Q2hpbGRzRnJvbVRyZWVGdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBjaGlsZHM7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY2hpbGRzID0gdGhpcy5kYXRhVHJlZUNoaWxkRnVuY3Rpb24oZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGlsZHMgPSBkYXRhW3RoaXMuZGF0YVRyZWVDaGlsZEZ1bmN0aW9uXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hpbGRzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICAgICAgY2hpbGRzID0gY2hpbGRzLmJpbmQoZGF0YSkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGRzO1xuICAgIH1cbiAgICBwcml2YXRlIHBvcHVsYXRlVHJlZURhdGEoZGF0YSkge1xuXG4gICAgICAgIHZhciBjaGlsZHMgPSB0aGlzLmdldENoaWxkc0Zyb21UcmVlRnVuY3Rpb24oZGF0YSk7XG5cbiAgICAgICAgaWYgKGNoaWxkcyAmJiBjaGlsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGEsIFwiX190cmVlY2hpbGRzXCIsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBuY2hpbGRzID0gdGhpcy5nZXRDaGlsZHNGcm9tVHJlZUZ1bmN0aW9uKGNoaWxkc1t4XSk7XG5cbiAgICAgICAgICAgICAgICBpZiAobmNoaWxkcyAmJiBuY2hpbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNoaWxkc1t4XSwgXCJfX3RyZWVjaGlsZHNcIiwge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcImR1bW15XCJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG9uVHJlZUV4cGFuZGVkKHJvdzogVGFidWxhdG9yLlJvd0NvbXBvbmVudCwgbGV2ZWwpIHtcbiAgICAgICAgaWYgKHRoaXMuZGF0YVRyZWVDaGlsZEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJvdy5nZXREYXRhKCk7XG4gICAgICAgICAgICBsZXQgY2hpbGRzID0gZGF0YS5fX3RyZWVjaGlsZHM7Ly90aGlzLmdldENoaWxkc0Zyb21UcmVlRnVuY3Rpb24oZGF0YSkgICAvL3Jvdy5nZXREYXRhKClbXCJjaGlsZHNcIl07XG4gICAgICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IGNoaWxkcy5sZW5ndGg7IGYrKykge1xuICAgICAgICAgICAgICAgIHRoaXMucG9wdWxhdGVUcmVlRGF0YShjaGlsZHNbZl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcm93LnVwZGF0ZShkYXRhKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsYXlvdXQoKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdEhhbmRsZXIgPSBbXTtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGUoKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudGFibGUudXBkYXRlRGF0YSh0aGlzLml0ZW1zKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBfb25jb250ZXh0KGV2ZW50OiBhbnksIHJvdzogVGFidWxhdG9yLkNlbGxDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS52YWx1ZSA9IFtyb3cuZ2V0RGF0YSgpXTtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEgPSBbcm93LmdldERhdGEoKV07XG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnNob3coZXZlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfb25zZWxlY3QoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCByb3c6IFRhYnVsYXRvci5Sb3dDb21wb25lbnQpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IFtdO1xuICAgICAgICB2YXIgYWlkcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0Q29tcG9uZW50ID09PSB1bmRlZmluZWQgJiYgdGhpcy5fZXZlbnRIYW5kbGVyW1wic2VsZWN0XCJdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGV2ZW50LmRhdGEgPSByb3cuZ2V0RGF0YSgpO1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3QudmFsdWUgPSBldmVudC5kYXRhO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInNlbGVjdFwiLCBldmVudCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiByZWdpc3RlciBhbiBldmVudCBpZiBhbiBpdGVtIGlzIHNlbGVjdGVkXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbiBjaGFuZ2VcbiAgICAgKi9cbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhPzpUYWJ1bGF0b3IuUm93Q29tcG9uZW50KXtcXG5cXHRcXG59XCIgfSlcbiAgICBvbmNoYW5nZShoYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnlFdmVudE9iamVjdCwgcm93PzogVGFidWxhdG9yLlJvd0NvbXBvbmVudCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwic2VsZWN0XCIsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KClcbiAgICBnZXQgc2hvd1NlYXJjaGJveCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlYXJjaGJveCAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzZXQgc2hvd1NlYXJjaGJveChlbmFibGU6IGJvb2xlYW4pIHtcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCFlbmFibGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWFyY2hib3ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlYXJjaGJveC5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NlYXJjaGJveDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NlYXJjaGJveCA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgICAgICB0aGlzLl9zZWFyY2hib3gucGxhY2Vob2xkZXIgPSBcInNlYXJjaCB0YWJsZS4uLlwiO1xuICAgICAgICAgICAgdGhpcy5fc2VhcmNoYm94Lm9ua2V5ZG93bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IF90aGlzLl9zZWFyY2hib3gudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRhYmxlLnNldEZpbHRlcihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkICYmIGRhdGFba2V5XSAhPT0gbnVsbCAmJiBkYXRhW2tleV0udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGV4dCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5wcmVwZW5kKHRoaXMuX3NlYXJjaGJveC5kb21XcmFwcGVyKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICAqIGlmIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkIHRoZW4gdGhlIHZhbHVlIG9mIF9jb21wb25lbnQgaXMgYWxzbyBjaGFuZ2VkIChfY29tcG9uZW50LnZhbHVlKVxuICAgICAgKi9cbiAgICBzZXQgc2VsZWN0Q29tcG9uZW50KF9jb21wb25lbnQ6IGFueSkgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuX3NlbGVjdCA9IF9jb21wb25lbnQ7XG4gICAgfVxuICAgIGdldCBzZWxlY3RDb21wb25lbnQoKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdDsvLyQodGhpcy5kb20pLnRleHQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IHRoZSBpdGVtcyBvZiB0aGUgdGFibGVcbiAgICAgKi9cbiAgICBzZXQgaXRlbXModmFsdWU6IGFueVtdKSB7XG4gICAgICAgIGlmICh2YWx1ZSAmJiB0aGlzLmRhdGFUcmVlQ2hpbGRGdW5jdGlvbikgey8vcG9wdWxhdGUgX190cmVlY2hpbGRzXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHZhbHVlLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3B1bGF0ZVRyZWVEYXRhKHZhbHVlW3hdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9pdGVtcyA9IHZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMudGFibGUuc2V0RGF0YSh2YWx1ZSk7XG4gICAgfVxuICAgIGdldCBpdGVtcygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IHNlbCAtIHRoZSBzZWxlY3RlZCBvYmplY3RcbiAgICAgKi9cbiAgICBzZXQgdmFsdWUoc2VsKSB7XG4gICAgICAgIGlmICh0aGlzLml0ZW1zID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLml0ZW1zLmluZGV4T2Yoc2VsKTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHRoaXMudGFibGUuZGVzZWxlY3RSb3codGhpcy50YWJsZS5nZXRTZWxlY3RlZFJvd3MoKSk7XG4gICAgICAgIGlmIChwb3MgPT09IC0xKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdGhpcy50YWJsZS5zZWxlY3RSb3codGhpcy50YWJsZS5nZXRSb3dzKClbcG9zXSk7XG4gICAgICAgIHRoaXMudGFibGUuc2Nyb2xsVG9Sb3codGhpcy50YWJsZS5nZXRSb3dzKClbcG9zXSk7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcblxuICAgICAgICB2YXIgcmV0ID0gdGhpcy50YWJsZS5nZXRTZWxlY3RlZFJvd3MoKTtcbiAgICAgICAgaWYgKHJldC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldFswXS5nZXREYXRhKCk7XG4gICAgICAgIC8qdmFyIGFpZHMgPSB3MnVpW3RoaXMuX2lkXS5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgaWYgKGFpZHMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG9icyA9IHcydWlbdGhpcy5faWRdLnJlY29yZHM7XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvYnMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgYWlkcy5sZW5ndGg7IHkrKykge1xuICAgICAgICAgICAgICAgIGlmIChvYnNbeF0uaWQgPT09IGFpZHNbeV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSBvYnNbeF0uX29yaWdpbmFsT2JqZWN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdCAhPT0gdW5kZWZpbmVkKS8vZXh0cmFjdCBwcm94eVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uLnB1c2gob2JzW3hdLl9vcmlnaW5hbE9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5wdXNoKG9ic1t4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxlY3Rpb24ubGVuZ3RoID09PSAxID8gc2VsZWN0aW9uWzBdIDogc2VsZWN0aW9uOyovXG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICogQG1lbWJlciB7c3RyaW5nfG51bWJlcn0gLSB0aGUgaGVpZ2h0IG9mIHRoZSBjb21wb25lbnQgXG4gICAgKiBlLmcuIDUwIG9yIFwiMTAwJVwiXG4gICAgKi9cbiAgICBzZXQgaGVpZ2h0KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHsgLy90aGUgQ29kZVxuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdGhpcy50YWJsZS5zZXRIZWlnaHQodmFsdWUpO1xuICAgICAgICAvL3N1cGVyLmhlaWdodD12YWx1ZTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlYXJjaGVzIHJlY29yZHMgaW4gdGhlIGdyaWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmllbGQgLSBuYW1lIG9mIHRoZSBzZWFyY2ggZmllbGRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgc2VhcmNoIGZpZWxkXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbZG9TZWxlY3RdIC0gaWYgdHJ1ZSB0aGUgZmlyc3QgZW50cnkgaXMgc2VsZWN0ZWRcbiAgICAgKi9cbiAgICBzZWFyY2goZmllbGQsIHZhbHVlLCBkb1NlbGVjdCkge1xuXHQvL2N1c3RvbSBmaWx0ZXIgZnVuY3Rpb25cblx0XHRcdGZ1bmN0aW9uIG1hdGNoQW55KGRhdGEsIGZpbHRlclBhcmFtcykge1xuXHRcdFx0XHQvL2RhdGEgLSB0aGUgZGF0YSBmb3IgdGhlIHJvdyBiZWluZyBmaWx0ZXJlZFxuXHRcdFx0XHQvL2ZpbHRlclBhcmFtcyAtIHBhcmFtcyBvYmplY3QgcGFzc2VkIHRvIHRoZSBmaWx0ZXJcblxuXHRcdFx0XHR2YXIgbWF0Y2ggPSBmYWxzZTtcblxuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuXHRcdFx0XHRcdGlmIChmaWx0ZXJQYXJhbXMudmFsdWU9PT11bmRlZmluZWR8fGZpbHRlclBhcmFtcy52YWx1ZT09PVwiXCJ8fGRhdGFba2V5XT8udG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoZmlsdGVyUGFyYW1zLnZhbHVlLnRvTG93ZXJDYXNlKCkpPi0xKSB7XG5cdFx0XHRcdFx0XHRtYXRjaCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIG1hdGNoO1xuXHRcdFx0fVxuXG5cdFx0XHQvL3NldCBmaWx0ZXIgdG8gY3VzdG9tIGZ1bmN0aW9uXG5cdFx0XHR0aGlzLnRhYmxlLnNldEZpbHRlciggbWF0Y2hBbnksIHsgdmFsdWU6IHZhbHVlIH0pO1xuICAgICAgICAgICAgaWYoZG9TZWxlY3QpIHtcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLmRlc2VsZWN0Um93KHRoaXMudGFibGUuZ2V0U2VsZWN0ZWRSb3dzKCkpO1xuICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICB0aGlzLnRhYmxlLnNlbGVjdFJvdyggdGhpcy50YWJsZS5nZXRSb3dGcm9tUG9zaXRpb24oMCx0cnVlKSk7XG4gICAgICAgICAgICB9XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIC8vIHRoaXMudHJlZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHRoaXMuX3NlYXJjaGJveCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fc2VhcmNoYm94LmRlc3Ryb3koKTtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHNldCBjb2x1bW5zKHZhbHVlOiBUYWJ1bGF0b3IuQ29sdW1uRGVmaW5pdGlvbltdKSB7XG4gICAgICAgIHRoaXMudGFibGUuc2V0Q29sdW1ucyh2YWx1ZSk7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfVxuICAgIGdldCBjb2x1bW5zKCk6IFRhYnVsYXRvci5Db2x1bW5EZWZpbml0aW9uW10ge1xuICAgICAgICByZXR1cm4gdGhpcy50YWJsZS5nZXRDb2x1bW5EZWZpbml0aW9ucygpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgdGFiID0gbmV3IFRhYmxlKHtcblxuICAgIH0pO1xuICAgIHRhYi53aWR0aCA9IDQwMDtcbiAgICB2YXIgdGFibGVkYXRhID0gW1xuICAgICAgICB7IGlkOiAxLCBuYW1lOiBcIk9saSBCb2JcIiwgYWdlOiBcIjEyXCIsIGNvbDogXCJyZWRcIiwgZG9iOiBcIlwiIH0sXG4gICAgICAgIHsgaWQ6IDIsIG5hbWU6IFwiTWFyeSBNYXlcIiwgYWdlOiBcIjFcIiwgY29sOiBcImJsdWVcIiwgZG9iOiBcIjE0LzA1LzE5ODJcIiB9LFxuICAgICAgICB7IGlkOiAzLCBuYW1lOiBcIkNocmlzdGluZSBMb2Jvd3NraVwiLCBhZ2U6IFwiNDJcIiwgY29sOiBcImdyZWVuXCIsIGRvYjogXCIyMi8wNS8xOTgyXCIgfSxcbiAgICAgICAgeyBpZDogNCwgbmFtZTogXCJCcmVuZG9uIFBoaWxpcHNcIiwgYWdlOiBcIjEyNVwiLCBjb2w6IFwib3JhbmdlXCIsIGRvYjogXCIwMS8wOC8xOTgwXCIgfSxcbiAgICAgICAgeyBpZDogNSwgbmFtZTogXCJNYXJncmV0IE1hcm1hanVrZVwiLCBhZ2U6IFwiMTZcIiwgY29sOiBcInllbGxvd1wiLCBkb2I6IFwiMzEvMDEvMTk5OVwiIH0sXG4gICAgXTtcblxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGFiLml0ZW1zID0gdGFibGVkYXRhO1xuXG4gICAgfSwgMTAwKTtcblxuICAgIC8vdGFiLnNlbGVjdCA9IHt9O1xuICAgIC8vIHRhYi5zaG93U2VhcmNoYm94ID0gdHJ1ZTtcblxuXG4gICAgLy8gICAgdmFyIGt1bmRlbiA9IGF3YWl0IGphc3NpLmRiLmxvYWQoXCJkZS5LdW5kZVwiKTtcbiAgICAvLyAgIHRhYi5pdGVtcyA9IGt1bmRlbjtcblxuICAgIHJldHVybiB0YWI7XG5cbn1cbiJdfQ==