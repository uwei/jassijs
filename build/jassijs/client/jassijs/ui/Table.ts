import registry, { $Class } from "jassijs/remote/Registry";
import "jassijs/ext/tabulator";
import { DataComponent, DataComponentConfig } from "jassijs/ui/DataComponent";
import { $Property } from "jassijs/ui/Property";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { Textbox } from "jassijs/ui/Textbox";
import { Calendar } from "jassijs/ui/Calendar";
import { Databinder } from "jassijs/ui/Databinder";
import { classes } from "jassijs/remote/Classes";
import { Tabulator } from "tabulator-tables"; 
import { DateTimeConverter, DateTimeFormat } from "jassijs/ui/converters/DateTimeConverter";
import { Numberformatter } from "jassijs/util/Numberformatter";   
export interface LazyLoadOption {
    classname: string;
    loadFunc: string;
    pageSize?: number; 
}

//@ts-ignore
export interface TableOptions extends Tabulator.Options {
    dataTreeChildFunction?: ((data: any) => any) | any;
    lazyLoad?: LazyLoadOption;
    items?: any[];
    columns?: MyColumnDefinition[];
    [unknown:string]:any;//TODO hack if other modules use TableOptions then  the properties inTabulator.Options are unknown - how to I solve this?
}
//@ts-ignore
export interface MyColumnDefinition extends Tabulator.ColumnDefinition {
    formatter?: MyFormatter;
    formatterParams?: MyFormatterParams;
    editor?:MyEditor;
    [unknown:string]:any;//TODO hack if other modules use TableOptions then  the properties inTabulator.Options are unknown - how to I solve this?
}
export type MyFormatterParams = Tabulator.FormatterParams | {
    datefimeformat: DateTimeFormat;
    numberformat: "#.##0,00" | string;
    [unknown:string]:any;//TODO hack if other modules use TableOptions then  the properties inTabulator.Options are unknown - how to I solve this?
};
export type MyEditor = Tabulator.Editor | "datetimeformat" | "numberformat"|any;//TODO hack if other modules use TableOptions then  the properties inTabulator.Options are unknown - how to I solve this?
export type MyFormatter = Tabulator.Formatter | "datetimeformat" | "numberformat"|any;//TODO hack if other modules use TableOptions then  the properties inTabulator.Options are unknown - how to I solve this?
@$Class("jassijs.ui.TableEditorProperties")
class TableEditorProperties {
    @$Property({ default: undefined })
    paginationSize: number;
    @$Property({ default: true })
    headerSort: boolean;
    @$Property({ default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] })
    layout: string;
    @$Property({ default: undefined })
    dataTreeChildFunction: (any) => any | any;
    @$Property({ default: false })
    movableColumns: boolean;
}
export interface TableConfig extends DataComponentConfig {
    options?: TableOptions;
    /**
    * register an event if an item is selected
    * @param {function} handler - the function that is called on change
    */
    onchange?(handler: (event?: JQueryEventObject, row?: Tabulator.RowComponent) => void);
    showSearchbox?: boolean;
    /**
    * if the value is changed then the value of _component is also changed (_component.value)
    */
    selectComponent?: any;
    /**
     * set the items of the table
     */
    items?: any[];
    columns?: Tabulator.ColumnDefinition[];
    bindItems?: any[];
}
@$UIComponent({ fullPath: "common/Table", icon: "mdi mdi-grid" })
@$Class("jassijs.ui.Table")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.TableEditorProperties" })
export class Table extends DataComponent implements TableConfig {
    table: Tabulator;
    _selectHandler;
    _select: {
        value: any;
    };
    ;
    private _lazyLoadOption: LazyLoadOption;
    private _lastLazySort = undefined;
    private _lastLazySearch = undefined;
    private _lazyDataHasChanged = undefined;
    _tree;
    _items: any[];
    _searchbox: Textbox;
    _databinderItems: Databinder;
    _lastOptions: TableOptions;
    private dataTreeChildFunction: string | ((obj: any) => any);
    constructor(properties?: TableOptions) {
        super();
        super.init('<div class="Table"></div>');
        var _this = this;
        this.options = properties;
        this._selectHandler = [];
    }
    config(config: TableConfig): Table {
        super.config(config);
        return this;
    }
    @$Property({ type: "json", componentType: "jassijs.ui.TableEditorProperties" })
    set options(properties: TableOptions) {
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
        if (properties.autoColumns === undefined && properties.columns === undefined)
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
        //if (properties.paginationSize !== undefined && properties.pagination == undefined)
         //   properties.pagination = "local";
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
        this.table = new Tabulator("[id='" + this._id + "']", <any>properties);
        this.table.on("rowClick", (e, e2) => { _this._onselect(<any>e, e2); });
        this.table.on("cellContext", (e, e2) => { _this._oncontext(e, e2); });
        this.table.on("dataTreeRowExpanded", (e, e2) => { _this.onTreeExpanded(e, e2); });
        if (properties.lazyLoad) {
            //updates the tabledata if user sort with headerclick
            this.table.on("headerClick", function (e, c) {
                setTimeout(() => {
                    _this.update();
                }, 1000);
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
    get options(): TableOptions {
        return this._lastOptions;
    }
    /**
     * create a SQL-Querry for a search in all visible columns
     */
    private sqlForLazySearch() {
        if (this._searchbox.value === undefined || this._searchbox.value === "") {
            return undefined;
        }
        var fields = registry.getMemberData("design:type")[this._lazyLoadOption.classname];
        var columns = this.table.getColumns(false);
        var wheres: string[] = [];
        for (var x = 0; x < columns.length; x++) {
            var found = fields[columns[x].getField()];
            //           where:`UPPER(CAST(ID AS TEXT)) LIKE :mftext`,
            //        whereParams:{mftext:"%24%"}
            if (found) { //
                if (found[0][0] === String) {
                    wheres.push("UPPER(\"" + columns[x].getField() + "\") LIKE :mftext");
                }
                else if (found[0][0] === Number || found[0][0] === Date)
                    wheres.push("UPPER(CAST(\"" + columns[x].getField() + "\" AS TEXT)) LIKE :mftext");
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
    private lazyLoadFunc(url, param, param2) {
        //var data=await this._progressiveLoadFunc();
        //return data;
        // debugger;
        var _this = this;
        return new Promise((resolve) => {
            classes.loadClass(_this._lazyLoadOption.classname).then((cl) => {
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
                var opt: any = {
                    skip: (param2.page - 1) * pageSize,
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
    private defaultAutoColumnDefinitions(definitions: Tabulator.ColumnDefinition[]): Tabulator.ColumnDefinition[] {
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
                if (data instanceof Date && definitions[x].formatter === undefined) {
                    definitions[x].formatter = function (cell, formatterParams, onRendered) {
                        return cell.getValue() === undefined ? "" : cell.getValue().toLocaleDateString(); //return the contents of the cell;
                    };
                }
            }
            ret.push(definitions[x]);
        }
        return ret;
    }
    private getChildsFromTreeFunction(data) {
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
    private populateTreeData(data) {
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
    private onTreeExpanded(row: Tabulator.RowComponent, level) {
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
    private _oncontext(event: any, row: Tabulator.CellComponent) {
        if (this.contextMenu !== undefined) {
            this.contextMenu.value = [row.getData()];
            event.data = [row.getData()];
            this.contextMenu.show(event);
        }
    }
    private _onselect(event: JQueryEventObject, row: Tabulator.RowComponent) {
        var selection = [];
        var aids = undefined;
        if (this.selectComponent === undefined && this._eventHandler["select"] === undefined)
            return;
        event.data = row.getData();
        if (this._select !== undefined)
            this._select.value = event.data;
        this.callEvent("select", event);
    }
    @$Property({ default: "function(event?: JQueryEventObject, data?:Tabulator.RowComponent){\n\t\n}" })
    onchange(handler: (event?: JQueryEventObject, row?: Tabulator.RowComponent) => void) {
        this.addEvent("select", handler);
    }
    @$Property()
    get showSearchbox(): boolean {
        return this._searchbox !== undefined;
    }
    set showSearchbox(enable: boolean) {
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
            this._searchbox = new Textbox();
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
    set selectComponent(_component: any) {
        this._select = _component;
    }
    get selectComponent(): any {
        return this._select;
    }
    private _setItemsIntern(value: any[], updateData = true) {
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
    set items(value: any[]) {
        this._setItemsIntern(value);
    }
    get items(): any[] {
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
                catch { }
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
    }
    /**
    * @member {string|number} - the height of the component
    * e.g. 50 or "100%"
    */
    set height(value: string | number) {
        if (value === "100%") {
            if (this.showSearchbox)
                value = "calc(100% - 28px)";
            else
                value = "calc(100% - 7px)";
        }
        super.height = value;
    }
    @$Property({ type: "string" })
    get height() {
        return super.height;
    }
    set width(value: string | number) {
        if (value === "100%")
            value = "calc(100% - 5px)";
        super.width = value;
    }
    @$Property({ type: "string" })
    get width(): string {
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
            //data - the data for the row being filtered
            //filterParams - params object passed to the filter
            var match = false;
            for (var key in data) {
                if (filterParams.value === undefined || filterParams.value === "" || data[key]?.toString().toLowerCase().indexOf(filterParams.value.toLowerCase()) > -1) {
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
    set columns(value: Tabulator.ColumnDefinition[]) {
        this.table.setColumns(value);
        this.update();
    }
    get columns(): Tabulator.ColumnDefinition[] {
        return this.table.getColumnDefinitions();
    }
    @$Property({ type: "databinder" })
    set bindItems(databinder: any[]) {
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
}
Tabulator.extendModule("format", "formatters", {
    datetimeformat: function (cell, formatterParams) {
        var val = cell.getValue();
        if (val === undefined)
            return "";
        if (formatterParams?.datefimeformat === undefined) {
            return DateTimeConverter.toLocalString(val, "DATE_SHORT");
        }
        else {
            return DateTimeConverter.toLocalString(val, formatterParams?.datefimeformat);
        }
    },
    numberformat: function (cell, formatterParams) {
        var val: number = cell.getValue();
        if (val === undefined)
            return "";
        if (formatterParams?.numberformat === undefined) {
            return val.toLocaleString();
        }
        else {
            return Numberformatter.format(formatterParams?.numberformat, val);
        }
    }
});
Tabulator.extendModule("edit", "editors", {
    datetimeformat: function (cell, onRendered, success, cancel, editorParams) {
        var f: DateTimeFormat = cell.getColumn().getDefinition()?.formatterParams?.datefimeformat;
        var editor = document.createElement("input");
        var format = "yyyy-MM-dd";
        if (f === undefined || f.startsWith("DATE_")) {
            format = "yyyy-MM-dd";
            editor.setAttribute("type", "date");
        }
        else if (f.startsWith("DATE_")) {
            format = "yyyy-MM-dd";
        }
        else if (f.startsWith("TIME_") && f.indexOf("SECONDS") > 0) {
            editor.setAttribute("type", "time");
            editor.setAttribute("step", "2");
            format = "HH:mm:ss";
        }
        else if (f.startsWith("TIME_") && f.indexOf("SECONDS") === -1) {
            editor.setAttribute("type", "time");
            format = "HH:mm";
        }
        else if (f.startsWith("DATETIME_") && f.indexOf("SECONDS") > 0) {
            editor.setAttribute("type", "datetime-local");
            editor.setAttribute("step", "2");
            format = "yyyy-MM-dd\'T\'HH:mm";
        }
        else if (f.startsWith("DATETIME_") && f.indexOf("SECONDS") === -1) {
            editor.setAttribute("type", "datetime-local");
            format = "yyyy-MM-dd\'T\'HH:mm:ss";
        }
        //create and style input
        editor.style.padding = "3px";
        editor.style.width = "100%";
        editor.style.boxSizing = "border-box";
        //Set value of editor to the current value of the cell
        editor.value = DateTimeConverter.toFormat(cell.getValue(), format);
        //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
        onRendered(function () {
            editor.focus();
            // editor.style.css = "100%";
        });
        editor.addEventListener("keydown", (ev) => {
            if (ev.keyCode == 13) {
                successFunc();
            }
            if (ev.keyCode == 27) {
                cancel();
            }
        });
        //when the value has been set, trigger the cell to update
        function successFunc() {
            var str = editor.value
            if (format.split(":").length > editor.value.split(":").length)
                str = str + ":00";
            var ret = DateTimeConverter.fromFormat(str, format);

            console.log(ret);
            success(ret);
        }
        // editor.addEventListener("change", successFunc);
        editor.addEventListener("blur", successFunc);
        //return the editor element
        return editor;
    },
    numberformat: function (cell, onRendered, success, cancel, editorParams) {
        var editor = document.createElement("input");
        var format = "yyyy-MM-dd";
       // editor.setAttribute("type", "number");

        //create and style input
        editor.style.padding = "3px";
        editor.style.width = "100%";
        editor.style.boxSizing = "border-box";
        //Set value of editor to the current value of the cell
        editor.value = Numberformatter.numberToString(cell.getValue());
        //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
        onRendered(function () {
            editor.focus();
            //  editor.style.css = "100%";
        });
        editor.addEventListener("keydown", (ev) => {
            if (ev.keyCode == 13) {
                successFunc();
            }
            if (ev.keyCode == 27) {
                cancel();
            }
        });
        //when the value has been set, trigger the cell to update
        function successFunc() {
            var str = editor.value;
            var ret = Numberformatter.stringToNumber(str);
            success(ret);
        }
        // editor.addEventListener("change", successFunc);
        editor.addEventListener("blur", successFunc);
        //return the editor element
        return editor;
    }
});
export async function test() {
    var tabledata = [
        { id: 1, name: "Oli Bob", age: 12.5, col: "red", dob: new Date() },
        { id: 2, name: "Mary May", age: 1.555, col: "blue", dob: new Date() },
        { id: 3, name: "Christine Lobowski", age: 42, col: "green", dob: new Date() },
        { id: 4, name: "Brendon Philips", age: 12, col: "orange", dob: new Date() },
        { id: 5, name: "Margret Marmajuke", age: 99, col: "yellow", dob: new Date() },
    ];
    var tab = new Table({
        height: 300,
        headerSort: true,
        items: tabledata,
        columns: [
            { field: "id", title: "id" },
            { field: "age", title: "age", formatter: "numberformat",formatterParams: { numberformat: "#.##0,00" }, editor: "numberformat" },
            { field: "name", title: "name", formatter: "buttonTick" },
            { field: "dob", title: "dob", formatter: "datetimeformat", formatterParams: { datefimeformat: "DATETIME_SHORT" }, editor: "datetimeformat" }
        ]
    });
    tab.showSearchbox = true;
    tab.on("dblclick", () => {
        //  alert(tab.value);
    });
    tab.width = 417;
    tab.height = 324;
    return tab;
}
