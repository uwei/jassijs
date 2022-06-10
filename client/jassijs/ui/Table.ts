;
import { $Class } from "jassijs/remote/Jassi";
import "jassijs/ext/tabulator";
import { DataComponent, DataComponentConfig } from "jassijs/ui/DataComponent";
import { $Property } from "jassijs/ui/Property";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { Textbox } from "jassijs/ui/Textbox";
import { Calendar } from "jassijs/ui/Calendar";
import { Databinder } from "jassijs/ui/Databinder";
interface TableOptions extends Tabulator.Options {
    dataTreeChildFunction?: ((data: any) => any) | any;
}
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
    @$Property({ default: "function(event:any,group:any){\n\t\n}" })
    cellDblClick() { }
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
    selectComponent?:any;
    /**
     * set the items of the table
     */
    items?:any[];
    columns?:Tabulator.ColumnDefinition[];
    bindItems?:any[];
}

@$UIComponent({ fullPath: "common/Table", icon: "mdi mdi-grid" })
@$Class("jassijs.ui.Table")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.TableEditorProperties" })
export class Table extends DataComponent implements TableConfig{
    table: Tabulator;
    _selectHandler;
    _select: {
        value: any;
    };
    ;
    _tree;
    _items: any[];
    _searchbox: Textbox;
    _databinderItems: Databinder;
    _lastOptions: TableOptions;
    private dataTreeChildFunction: string | ((obj: any) => any);
    constructor(properties?: TableOptions) {
        super();
        super.init($('<div class="Table"></div>')[0]);
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
        properties.dataTreeRowExpanded = function (row: Tabulator.RowComponent, level) {
            _this.onTreeExpanded(row, level);
            if (dataTreeRowExpanded !== undefined) {
                dataTreeRowExpanded(row, level);
            }
        };
        var rowClick = properties.rowClick;
        properties.rowClick = function (e: any, row: Tabulator.RowComponent) {
            _this._onselect(e, row);
            if (rowClick !== undefined) {
                rowClick(e, row);
            }
        };
        var contextClick = properties.cellContext;
        properties.cellContext = function (e: any, row: Tabulator.CellComponent) {
            _this._oncontext(e, row);
            if (contextClick !== undefined) {
                contextClick(e, row);
            }
            return undefined;
        };
        this.table = new Tabulator("[id='" + this._id + "']", properties);
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
                if (data instanceof Date) {
                    definitions[x].formatter = function (cell, formatterParams, onRendered) {
                        return Calendar.formatDate(cell.getValue()); //return the contents of the cell;
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
        await this.table.updateData(this.items);
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
            $(this.domWrapper).prepend(this._searchbox.domWrapper);
        }
    }
    set selectComponent(_component: any) {
        this._select = _component;
    }
    get selectComponent(): any {
        return this._select; //$(this.dom).text();
    }
    set items(value: any[]) {
        if (value && this.dataTreeChildFunction) { //populate __treechilds
            for (let x = 0; x < value.length; x++) {
                this.populateTreeData(value[x]);
            }
        }
        this._items = value;
        if (value !== undefined)
            this.table.setData(value);
    }
    get items(): any[] {
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
    set height(value: string | number) {
        //@ts-ignore
        this.table.setHeight(value);
        //super.height=value;
    }
    @$Property({ type: "string" })
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
    set bindItems(databinder:any[]) {
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
export async function test() {
    var tab = new Table({
        
    });
    tab.config({
        width :400,
        options :{
            headerSort: true
        }
    });
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
    //    var kunden = await jassijs.db.load("de.Kunde");
    //   tab.items = kunden;
    return tab;
}
