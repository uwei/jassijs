define("jassi/ext/tabulator", ['tabulatorlib'], function (Tabulator) {
    var path = require('jassi/modul').default.require.paths["tabulatorlib"];
    jassi.myRequire(path.replace("js", "css") + ".min.css");
    window.Tabulator = Tabulator;
    //hack 
    var initializeRow = function (row) {
        var childArray = row.getData()[this.field];
        //hack uw
        if (typeof childArray === "function") {
            childArray = row.getData()[this.field]();
        }
        if (typeof this.field === "function") {
            childArray = this.field(row.getData());
        }
        //end hack uw
        var isArray = Array.isArray(childArray);
        var children = isArray || !isArray && (typeof childArray === 'undefined' ? 'undefined' : _typeof(childArray)) === "object" && childArray !== null;
        if (!children && row.modules.dataTree && row.modules.dataTree.branchEl) {
            row.modules.dataTree.branchEl.parentNode.removeChild(row.modules.dataTree.branchEl);
        }
        if (!children && row.modules.dataTree && row.modules.dataTree.controlEl) {
            row.modules.dataTree.controlEl.parentNode.removeChild(row.modules.dataTree.controlEl);
        }
        row.modules.dataTree = {
            index: 0,
            open: children ? row.modules.dataTree ? row.modules.dataTree.open : this.startOpen(row.getComponent(), 0) : false,
            controlEl: row.modules.dataTree && children ? row.modules.dataTree.controlEl : false,
            branchEl: row.modules.dataTree && children ? row.modules.dataTree.branchEl : false,
            parent: false,
            children: children
        };
    };
    var generateChildren = function (row) {
        var _this40 = this;
        var children = [];
        var childArray = row.getData()[this.field];
        //hack uw
        if (typeof childArray === "function") {
            childArray = row.getData()[this.field]();
        }
        if (typeof this.field === "function") {
            childArray = this.field(row.getData());
        }
        //end hack uw
        if (!Array.isArray(childArray)) {
            childArray = [childArray];
        }
        childArray.forEach(function (childData) {
            //hack uw
            //var childRow = new Row(childData || {}, _this40.table.rowManager);
            var childRow = new row.__proto__.constructor(childData || {}, _this40.table.rowManager);
            //end hack uw
            childRow.modules.dataTree.index = row.modules.dataTree.index + 1;
            childRow.modules.dataTree.parent = row;
            if (childRow.modules.dataTree.children) {
                childRow.modules.dataTree.open = _this40.startOpen(childRow.getComponent(), childRow.modules.dataTree.index);
            }
            children.push(childRow);
        });
        return children;
    };
    var generateColumnsFromRowData = function (data) {
        var cols = [], row, sorter;
        if (data && data.length) {
            row = data[0];
            for (var key in row) {
                var col = { field: key, title: key };
                var value = row[key];
                //hack uw
                if (typeof value === "function")
                    continue;
                if (Array.isArray(value))
                    continue;
                if (key === "_classname")
                    continue;
                //end hack uw	
                switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
                    case "undefined":
                        sorter = "string";
                        break;
                    case "boolean":
                        sorter = "boolean";
                        break;
                    case "object":
                        if (Array.isArray(value)) {
                            sorter = "array";
                        }
                        else {
                            sorter = "string";
                        }
                        break;
                    default:
                        if (!isNaN(value) && value !== "") {
                            sorter = "number";
                        }
                        else {
                            if (value.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i)) {
                                sorter = "alphanum";
                            }
                            else {
                                sorter = "string";
                            }
                        }
                        break;
                }
                col.sorter = sorter;
                cols.push(col);
            }
            this.table.options.columns = cols;
            this.setColumns(this.table.options.columns);
        }
    };
    window.Tabulator.hackuw = function (table) {
        table.columnManager.__proto__.generateColumnsFromRowData = generateColumnsFromRowData;
        table.modules.dataTree.__proto__.initializeRow = initializeRow;
        table.modules.dataTree.__proto__.generateChildren = generateChildren;
        delete Tabulator.hackuw;
    };
    /*
        return {
            default: Tabulator,
        }*/
});
//# sourceMappingURL=tabulator.js.map