var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
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
//# sourceMappingURL=Table.js.map
//# sourceMappingURL=Table.js.map