var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/ui/Textbox", "jassijs/ui/Calendar", "jassijs/remote/Classes", "tabulator-tables"], function (require, exports, Registry_1, DataComponent_1, Property_1, Component_1, Textbox_1, Calendar_1, Classes_1, tabulator_tables_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Table = void 0;
    let TableEditorProperties = class TableEditorProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ default: undefined }),
        __metadata("design:type", Number)
    ], TableEditorProperties.prototype, "paginationSize", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: true }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "headerSort", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] }),
        __metadata("design:type", String)
    ], TableEditorProperties.prototype, "layout", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: undefined }),
        __metadata("design:type", Function)
    ], TableEditorProperties.prototype, "dataTreeChildFunction", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: false }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "movableColumns", void 0);
    TableEditorProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.TableEditorProperties")
    ], TableEditorProperties);
    let Table = class Table extends DataComponent_1.DataComponent {
        constructor(properties) {
            super();
            this._lastLazySort = undefined;
            this._lastLazySearch = undefined;
            this._lazyDataHasChanged = undefined;
            super.init('<div class="Table"></div>');
            var _this = this;
            this.options = properties;
            this._selectHandler = [];
        }
        ;
        config(config) {
            super.config(config);
            return this;
        }
        set options(properties) {
            var _this = this;
            this._lastOptions = properties;
            if (this.table) {
                var lastSel = this.value;
                var lastItems = this.items;
                this.table.destroy();
                this.table = undefined;
            }
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
            if (properties.lazyLoad) {
                this._lazyLoadOption = properties.lazyLoad;
                properties.ajaxURL = 'does/not/matter';
                properties.ajaxRequestFunc = _this.lazyLoadFunc.bind(this); // (p1,p2,p3)=>_this.progressiveLoad(p1,p2,p3);
                properties.progressiveLoad = 'scroll';
            }
            if (properties.items) {
                properties.data = this._setItemsIntern(properties.items, false);
                delete properties.items;
                ;
            }
            this.table = new tabulator_tables_1.Tabulator("[id='" + this._id + "']", properties);
            this.table.on("rowClick", (e, e2) => { _this._onselect(e, e2); });
            this.table.on("cellContext", (e, e2) => { _this._oncontext(e, e2); });
            this.table.on("dataTreeRowExpanded", (e, e2) => { _this.onTreeExpanded(e, e2); });
            if (properties.lazyLoad) {
                //updates the tabledata if user sort with headerclick
                this.table.on("headerClick", function (e, c) {
                    setTimeout(() => {
                        _this.update();
                    }, 100);
                });
                if (this._searchbox) {
                    this._searchbox.onchange(() => {
                        setTimeout(() => {
                            _this.update();
                        }, 50);
                    });
                }
                delete properties.lazyLoad;
            }
            if (lastItems) {
                this.items = lastItems;
            }
            if (lastSel) {
                this.value = lastSel;
            }
        }
        get options() {
            return this._lastOptions;
        }
        /**
         * create a SQL-Querry for a search in all visible columns
         */
        sqlForLazySearch() {
            if (this._searchbox.value === undefined || this._searchbox.value === "") {
                return undefined;
            }
            var fields = Registry_1.default.getMemberData("design:type")[this._lazyLoadOption.classname];
            var columns = this.table.getColumns(false);
            var wheres = [];
            for (var x = 0; x < columns.length; x++) {
                var found = fields[columns[x].getField()];
                //           where:`UPPER(CAST(ID AS TEXT)) LIKE :mftext`,
                //        whereParams:{mftext:"%24%"}
                if (found) { //
                    if (found[0][0] === String) {
                        wheres.push("UPPER('" + columns[x].getField() + "') LIKE :mftext");
                    }
                    else {
                        wheres.push("UPPER(CAST('" + columns[x].getField() + "' AS TEXT)) LIKE :mftext");
                    }
                }
            }
            if (wheres.length > 0) {
                return wheres.join(" or ");
            }
        }
        onlazyloaded(func) {
            this.addEvent("lazyloaded", func);
        }
        /**
         * loads lazy data from _progressiveLoadFunc
         */
        lazyLoadFunc(url, param, param2) {
            //var data=await this._progressiveLoadFunc();
            //return data;
            // debugger;
            var _this = this;
            return new Promise((resolve) => {
                Classes_1.classes.loadClass(_this._lazyLoadOption.classname).then((cl) => {
                    var newSort = undefined;
                    var tt = _this.table.getSorters();
                    if (tt) {
                        newSort = {};
                        for (var x = 0; x < tt.length; x++) {
                            newSort[tt[x].field] = tt[x].dir.toUpperCase();
                        }
                    }
                    var pageSize = _this._lazyLoadOption.pageSize;
                    if (pageSize === undefined)
                        pageSize = 200;
                    var opt = {
                        skip: param2.page * pageSize,
                        take: pageSize,
                        order: newSort
                    };
                    var where = _this.sqlForLazySearch();
                    if (where) {
                        opt.where = where;
                        opt.whereParams = { mftext: "%" + this._searchbox.value.toUpperCase() + "%" };
                        //   console.log(where);
                    }
                    if (JSON.stringify(newSort) !== this._lastLazySort || this._searchbox.value !== this._lastLazySearch || this._lazyDataHasChanged) {
                        pageSize = (1 + param2.page) * pageSize;
                        opt.take = pageSize;
                        opt.skip = 0;
                        this._lastLazySort = JSON.stringify(newSort);
                        this._lastLazySearch = this._searchbox.value;
                        this._lazyDataHasChanged = undefined;
                    }
                    cl[_this._lazyLoadOption.loadFunc](opt).then((data) => {
                        var ret = {
                            "last_page": data.length < pageSize ? 0 : (param2.page + 1),
                            data: data
                        };
                        console.log(param2.page * pageSize);
                        resolve(ret);
                        _this.callEvent("lazyloaded", data, opt, param, param2);
                    });
                });
            });
        }
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
        async update() {
            if (this._lazyLoadOption) {
                this._lazyDataHasChanged = true;
                var sel = this.value;
                await this.table.replaceData("/data.php");
                this.value = sel;
            }
            else {
                await this.table.updateData(this.items);
            }
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
                if (this.height === "calc(100% - 28px)")
                    this.height = "100%";
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
                if (this._lazyLoadOption) {
                    this._searchbox.onchange(() => {
                        setTimeout(() => {
                            _this.table.replaceData("/data.php");
                        }, 50);
                    });
                }
                this.domWrapper.prepend(this._searchbox.domWrapper);
                if (this.height === "calc(100% - 7px)") ///correct height
                    this.height = "100%";
            }
        }
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select;
        }
        _setItemsIntern(value, updateData = true) {
            if (value && this.dataTreeChildFunction) { //populate __treechilds
                for (let x = 0; x < value.length; x++) {
                    this.populateTreeData(value[x]);
                }
            }
            this._items = value;
            if (value !== undefined && updateData)
                this.table.setData(value);
            return value;
        }
        set items(value) {
            this._setItemsIntern(value);
        }
        get items() {
            return this._items;
        }
        async updateOrInsertItem(item) {
            var ret = await this.updateItem(item);
            if (ret === undefined)
                return await this.insertItem(item);
        }
        async updateItem(item) {
            var rows = this.table.getRows();
            for (var x = 0; x < rows.length; x++) {
                if (rows[x].getData() === item) {
                    //@ts-ignore
                    await rows[x].update(item);
                    return rows[x];
                }
            }
            return undefined;
        }
        async insertItem(item) {
            var ret = await this.table.addRow(item);
            ret.select();
            ret.scrollTo();
            return ret;
        }
        async removeItem(item) {
            var rows = this.table.getRows();
            for (var x = 0; x < rows.length; x++) {
                if (rows[x].getData() === item) {
                    //@ts-ignore
                    try {
                        rows[x + 1].select();
                        rows[x + 1].scrollTo();
                    }
                    catch (_a) { }
                    await rows[x].delete();
                    return;
                }
            }
        }
        /**
         * @member {object} sel - the selected object
         */
        set value(sel) {
            //@ts-ignore
            this.table.deselectRow(this.table.getSelectedRows());
            var rows = this.table.getRows();
            for (var x = 0; x < rows.length; x++) {
                if (rows[x].getData() === sel) {
                    //@ts-ignore
                    this.table.selectRow(rows[x]);
                    this.table.scrollToRow(rows[x]);
                }
            }
            return;
            debugger;
            if (this.items === undefined)
                return;
            var pos = this.items.indexOf(sel);
            //@ts-ignore
            this.table.deselectRow(this.table.getSelectedRows());
            if (pos === -1)
                return;
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
            if (value === "100%") {
                if (this.showSearchbox)
                    value = "calc(100% - 28px)";
                else
                    value = "calc(100% - 7px)";
            }
            super.height = value;
        }
        get height() {
            return super.height;
        }
        set width(value) {
            if (value === "100%")
                value = "calc(100% - 5px)";
            super.width = value;
        }
        get width() {
            return super.width;
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
                var _a;
                //data - the data for the row being filtered
                //filterParams - params object passed to the filter
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
        set bindItems(databinder) {
            this._databinderItems = databinder[0];
            var _this = this;
            this._databinderItems.add(databinder[1], this, undefined, (tab) => {
                return tab.items;
            }, (tab, val) => {
                tab.items = val;
            });
            //databinderItems.add(property, this, "onchange");
            //databinder.checkAutocommit(this);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "options", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event?: JQueryEventObject, data?:Tabulator.RowComponent){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "onchange", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Table.prototype, "showSearchbox", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "height", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "width", null);
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Table.prototype, "bindItems", null);
    Table = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Table", icon: "mdi mdi-grid" }),
        (0, Registry_1.$Class)("jassijs.ui.Table"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:paramtypes", [Object])
    ], Table);
    exports.Table = Table;
    var page = 0;
    var id = 0;
    function updateData(v1, v2, v3) {
        // debugger;
        return new Promise((resolve) => {
            console.log("updateData");
            var data = [];
            for (var x = id; x < 200 + id; x++) {
                data.push({ id: x, name: "Person " + x });
            }
            id = x;
            page++;
            var ret = {
                "last_page": x > 2000 ? 0 : (v3.page + 1),
                data: data
            };
            console.log(x);
            resolve(ret);
        });
    }
    async function test() {
        var tabledata = [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
        ];
        var tab = new Table({
            height: 200,
            headerSort: true,
            items: tabledata
        });
        tab.showSearchbox = true;
        //window.setTimeout(() => {
        tab.items = tabledata;
        // }, 100);
        tab.on("dblclick", () => {
            //  alert(tab.value);
        });
        tab.width = 176;
        tab.height = 223;
        //tab.select = {};
        // tab.showSearchbox = true;
        //    var kunden = await jassijs.db.load("de.Kunde");
        //   tab.items = kunden;
        return tab;
    }
    exports.test = test;
});
//# sourceMappingURL=Table.js.map