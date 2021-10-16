define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createReportDefinition = exports.doGroup = void 0;
    //templating is slow so we chache
    var funccache = {};
    //https://github.com/Mottie/javascript-number-formatter/blob/master/src/format.js
    //license https://github.com/Mottie/javascript-number-formatter/blob/master/LICENSE
    const maskRegex = /[0-9\-+#]/;
    const notMaskRegex = /[^\d\-+#]/g;
    function getIndex(mask) {
        return mask.search(maskRegex);
    }
    function processMask(mask = "#.##") {
        const maskObj = {};
        const len = mask.length;
        const start = getIndex(mask);
        maskObj.prefix = start > 0 ? mask.substring(0, start) : "";
        // Reverse string: not an ideal method if there are surrogate pairs
        const end = getIndex(mask.split("").reverse().join(""));
        const offset = len - end;
        const substr = mask.substring(offset, offset + 1);
        // Add 1 to offset if mask has a trailing decimal/comma
        const indx = offset + ((substr === "." || (substr === ",")) ? 1 : 0);
        maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";
        maskObj.mask = mask.substring(start, indx);
        maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
        maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";
        // Search for group separator & decimal; anything not digit,
        // not +/- sign, and not #
        let result = maskObj.mask.match(notMaskRegex);
        // Treat the right most symbol as decimal
        maskObj.decimal = (result && result[result.length - 1]) || ".";
        // Treat the left most symbol as group separator
        maskObj.separator = (result && result[1] && result[0]) || ",";
        // Split the decimal for the format string if any
        result = maskObj.mask.split(maskObj.decimal);
        maskObj.integer = result[0];
        maskObj.fraction = result[1];
        return maskObj;
    }
    function processValue(value, maskObj, options) {
        let isNegative = false;
        const valObj = {
            value
        };
        if (value < 0) {
            isNegative = true;
            // Process only abs(), and turn on flag.
            valObj.value = -valObj.value;
        }
        valObj.sign = isNegative ? "-" : "";
        // Fix the decimal first, toFixed will auto fill trailing zero.
        valObj.value = Number(valObj.value).toFixed(maskObj.fraction && maskObj.fraction.length);
        // Convert number to string to trim off *all* trailing decimal zero(es)
        valObj.value = Number(valObj.value).toString();
        // Fill back any trailing zero according to format
        // look for last zero in format
        const posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
        let [valInteger = "0", valFraction = ""] = valObj.value.split(".");
        if (!valFraction || (valFraction && valFraction.length <= posTrailZero)) {
            valFraction = posTrailZero < 0
                ? ""
                : (Number("0." + valFraction).toFixed(posTrailZero + 1)).replace("0.", "");
        }
        valObj.integer = valInteger;
        valObj.fraction = valFraction;
        addSeparators(valObj, maskObj);
        // Remove negative sign if result is zero
        if (valObj.result === "0" || valObj.result === "") {
            // Remove negative sign if result is zero
            isNegative = false;
            valObj.sign = "";
        }
        if (!isNegative && maskObj.maskHasPositiveSign) {
            valObj.sign = "+";
        }
        else if (isNegative && maskObj.maskHasPositiveSign) {
            valObj.sign = "-";
        }
        else if (isNegative) {
            valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign
                ? ""
                : "-";
        }
        return valObj;
    }
    function addSeparators(valObj, maskObj) {
        valObj.result = "";
        // Look for separator
        const szSep = maskObj.integer.split(maskObj.separator);
        // Join back without separator for counting the pos of any leading 0
        const maskInteger = szSep.join("");
        const posLeadZero = maskInteger && maskInteger.indexOf("0");
        if (posLeadZero > -1) {
            while (valObj.integer.length < (maskInteger.length - posLeadZero)) {
                valObj.integer = "0" + valObj.integer;
            }
        }
        else if (Number(valObj.integer) === 0) {
            valObj.integer = "";
        }
        // Process the first group separator from decimal (.) only, the rest ignore.
        // get the length of the last slice of split result.
        const posSeparator = (szSep[1] && szSep[szSep.length - 1].length);
        if (posSeparator) {
            const len = valObj.integer.length;
            const offset = len % posSeparator;
            for (let indx = 0; indx < len; indx++) {
                valObj.result += valObj.integer.charAt(indx);
                // -posSeparator so that won't trail separator on full length
                if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
                    valObj.result += maskObj.separator;
                }
            }
        }
        else {
            valObj.result = valObj.integer;
        }
        valObj.result += (maskObj.fraction && valObj.fraction)
            ? maskObj.decimal + valObj.fraction
            : "";
        return valObj;
    }
    function _format(mask, value, options = {}) {
        if (!mask || isNaN(Number(value))) {
            // Invalid inputs
            return value;
        }
        const maskObj = processMask(mask);
        const valObj = processValue(value, maskObj, options);
        return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
    }
    ;
    ///////////////////////////////////END https://github.com/Mottie/javascript-number-formatter/blob/master/src/format.js
    //add 0 before
    function v(str, num) {
        str = str.toString();
        while (str.length < num) {
            str = "0" + str;
        }
        return str;
    }
    //simple dateformat perhaps we should use moments
    //now we do something basics
    function formatDate(format, date) {
        return format.
            replace("DD", v(date.getDate(), 2)).
            replace("D", date.getDate().toString()).
            replace("MM", v(date.getMonth(), 2)).
            replace("YYYY", date.getFullYear().toString()).
            replace("YY", (date.getFullYear() % 100).toString()).
            replace("A", date.getHours() > 12 ? "PM" : "AM").
            replace("hh", v(date.getHours(), 2)).
            replace("h", (date.getHours() % 12).toString()).
            replace("mm", v(date.getMinutes(), 2)).
            replace("ss", v(date.getSeconds(), 2));
    }
    //clone the obj depp
    function clone(obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;
        if (obj instanceof Date || typeof obj === "object")
            var temp = new obj.constructor(); //or new Date(obj);
        else
            var temp = obj.constructor();
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }
    //replace the params in the string
    //@param {boolean} returnValues - if true the templatevalues would be returned not the replaces string
    //@ts-ignore
    String.prototype.replaceTemplate = function (params, returnValues) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        addGroupFuncions(names, vals);
        for (let x = 0; x < vals.length; x++) {
            if (typeof vals[x] === "function") {
                vals[x] = vals[x].bind(params);
            }
        }
        let stag = "";
        if (returnValues) {
            names.push("tag");
            stag = "tag";
            vals.push(function tag(strings, values) {
                return values;
            });
        }
        var func = funccache[names.join(",") + this];
        if (func === undefined) { //create functions is slow so cache
            func = new Function(...names, `return ${stag}\`${this}\`;`);
            funccache[names.join(",") + this] = func;
        }
        return func(...vals);
    };
    //get the member of the data
    function getVar(data, member) {
        var ergebnis = member.toString().match(/\$\{(\w||\.)*\}/g);
        if (!ergebnis)
            member = "${" + member + "}";
        var ob = member.replaceTemplate(data, true);
        return ob;
    }
    //replace {{currentPage}} {{pageWidth}} {{pageHeight}} {{pageCount}} in header,footer, background
    function replacePageInformation(def) {
        if (def.background && typeof def.background !== "function") {
            let d = JSON.stringify(def.background);
            def.background = function (currentPage, pageSize) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
                sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
                return JSON.parse(sret);
            };
        }
        if (def.header && typeof def.header !== "function") {
            let d = JSON.stringify(def.header);
            def.header = function (currentPage, pageCount) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageCount}}", pageCount);
                return JSON.parse(sret);
            };
        }
        if (def.footer && typeof def.footer !== "function") {
            let d = JSON.stringify(def.footer);
            def.footer = function (currentPage, pageCount, pageSize) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageCount}}", pageCount);
                sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
                sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
                return JSON.parse(sret);
            };
        }
    }
    //sort the group with groupfields
    function groupSort(group, name, groupfields, groupid = 0) {
        var ret = { entries: [], name: name };
        if (groupid > 0)
            ret["groupfield"] = groupfields[groupid - 1];
        if (Array.isArray(group)) {
            group.forEach((neu) => ret.entries.push(neu));
        }
        else {
            for (var key in group) {
                var neu = group[key];
                ret.entries.push(groupSort(neu, key, groupfields, groupid + 1));
            }
            ret.entries = ret.entries.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
        return ret;
    }
    /**
     * groups and sort the entries
     * @param {any[]} entries - the entries to group
     * @param {string[]} groupfields - the fields where the entries are grouped
     */
    function doGroup(entries, groupfields) {
        var ret = {};
        for (var e = 0; e < entries.length; e++) {
            var entry = entries[e];
            let parent = ret;
            for (var x = 0; x < groupfields.length; x++) {
                var groupname = entry[groupfields[x]];
                if (x < groupfields.length - 1) { //undergroups does exists
                    if (!parent[groupname])
                        parent[groupname] = {};
                }
                else { //last group contaons the data
                    if (!parent[groupname])
                        parent[groupname] = [];
                    parent[groupname].push(entry);
                }
                parent = parent[groupname];
            }
        }
        //sort
        var sorted = groupSort(ret, "main", groupfields);
        return sorted;
    }
    exports.doGroup = doGroup;
    //replace the datatable {datable:...} to table:{}
    function replaceDatatable(def, data) {
        var header = def.datatable.header;
        var footer = def.datatable.footer;
        var dataexpr = def.datatable.dataforeach;
        var groups = def.datatable.groups;
        var body = def.datatable.body;
        var groupexpr = [];
        def.table = clone(def.datatable);
        def.table.body = [];
        delete def.table.header;
        delete def.table.footer;
        delete def.table.dataforeach;
        delete def.table.groups;
        if (header)
            def.table.body.push(header);
        if (groups === undefined || groups.length === 0) {
            def.table.body.push({
                foreach: dataexpr,
                do: body
            });
        }
        else {
            var parent = {};
            var toadd = {
                foreach: "group1 in datatablegroups.entries",
                do: parent
            };
            def.table.body.push(toadd);
            for (var x = 0; x < groups.length; x++) {
                groupexpr.push(groups[x].expression);
                if (x < groups.length - 1) {
                    parent.foreach = "group" + (x + 2).toString() + " in group" + (x + 1).toString() + ".entries";
                }
                else {
                    parent.foreach = dataexpr.split(" ")[0] + " in group" + (x + 1).toString() + ".entries";
                }
                if (groups[x].header && groups[x].header.length > 0) {
                    parent.dofirst = groups[x].header;
                }
                if (groups[x].footer && groups[x].footer.length > 0) {
                    parent.dolast = groups[x].footer;
                }
                if (x < groups.length - 1) {
                    parent.do = {};
                    parent = parent.do;
                }
                else {
                    parent.do = body;
                }
            }
            var arr = getArrayFromForEach(def.datatable.dataforeach, data);
            data.datatablegroups = doGroup(arr, groupexpr);
        }
        delete def.datatable.dataforeach;
        if (footer)
            def.table.body.push(footer);
        //delete data[variable];
        delete def.datatable.header;
        delete def.datatable.footer;
        delete def.datatable.foreach;
        delete def.datatable.groups;
        delete def.datatable.body;
        for (var key in def.datatable) {
            def.table[key] = def.datatable[key];
        }
        delete def.datatable;
    }
    //get the array for the foreach statement in the data
    function getArrayFromForEach(foreach, data) {
        var sarr = foreach.split(" in ")[1];
        var arr;
        if (sarr === undefined) {
            arr = data === null || data === void 0 ? void 0 : data.items; //we get the main array
        }
        else {
            arr = getVar(data, sarr);
        }
        return arr;
    }
    //replace templates e.g. ${name} with the data
    function replaceTemplates(def, data, param = undefined) {
        if (def === undefined)
            return;
        if (def.datatable !== undefined) {
            replaceDatatable(def, data);
        }
        if (def.format) {
            var val = def.text.replaceTemplate(data, true);
            if (val === undefined)
                return "";
            else if (typeof val == 'number') {
                def.text = _format(def.format, val, {});
            }
            else if (val.getMonth) {
                def.text = formatDate(def.format, val);
            }
            delete def.format;
        }
        if (def.foreach !== undefined) {
            //resolve foreach
            //	{ foreach: "line in invoice.lines", do: ['{{line.text}}', '{{line.price}}', 'OK?']	
            if ((param === null || param === void 0 ? void 0 : param.parentArray) === undefined) {
                throw "foreach is not surounded by an Array";
            }
            var variable = def.foreach.split(" in ")[0];
            var arr = getArrayFromForEach(def.foreach, data);
            if ((param === null || param === void 0 ? void 0 : param.parentArrayPos) === undefined) {
                param.parentArrayPos = param === null || param === void 0 ? void 0 : param.parentArray.indexOf(def);
                param === null || param === void 0 ? void 0 : param.parentArray.splice(param.parentArrayPos, 1);
            }
            for (let x = 0; x < arr.length; x++) {
                data[variable] = arr[x];
                delete def.foreach;
                var copy;
                if (def.dofirst && x === 0) { //render only forfirst
                    copy = clone(def.dofirst);
                    copy = replaceTemplates(copy, data, param);
                    if (copy !== undefined)
                        param.parentArray.splice(param.parentArrayPos++, 0, copy);
                }
                if (def.do)
                    copy = clone(def.do);
                else
                    copy = clone(def);
                copy = replaceTemplates(copy, data, param);
                if (copy !== undefined)
                    param.parentArray.splice(param.parentArrayPos++, 0, copy);
                if (def.dolast && x === arr.length - 1) { //render only forlast
                    copy = clone(def.dolast);
                    copy = replaceTemplates(copy, data, param);
                    if (copy !== undefined)
                        param.parentArray.splice(param.parentArrayPos++, 0, copy);
                }
            }
            delete data[variable];
            return undefined;
        }
        else if (Array.isArray(def)) {
            for (var a = 0; a < def.length; a++) {
                if (def[a].foreach !== undefined) {
                    replaceTemplates(def[a], data, { parentArray: def });
                    a--;
                }
                else
                    def[a] = replaceTemplates(def[a], data, { parentArray: def });
            }
            return def;
        }
        else if (typeof def === "string") {
            var ergebnis = def.toString().match(/\$\{/g);
            if (ergebnis !== null) {
                def = def.replaceTemplate(data);
                //	for (var e = 0; e < ergebnis.length; e++) {
                //		def = replace(def, data, ergebnis[e].substring(2, ergebnis[e].length - 2));
                //	}
            }
            return def;
        }
        else { //object	
            for (var key in def) {
                def[key] = replaceTemplates(def[key], data);
            }
            delete def.editTogether; //RText is only used for editing report
        }
        return def;
    }
    /**
     * create an pdfmake-definition from an jassijs-report-definition, fills data and parameter in the report
     * @param {string} definition - the jassijs-report definition
     * @param {any} [data] - the data which are filled in the report (optional)
     * @param {any} [parameter] - the parameter which are filled in the report (otional)
     */
    function createReportDefinition(definition, data, parameter) {
        definition = clone(definition); //this would be modified
        if (data !== undefined)
            data = clone(data); //this would be modified
        if (data === undefined && definition.data !== undefined) {
            data = definition.data;
        }
        //parameter could be in data
        if (data !== undefined && data.parameter !== undefined && parameter !== undefined) {
            throw new Error("parameter would override data.parameter");
        }
        if (Array.isArray(data)) {
            data = { items: data }; //so we can do data.parameter
        }
        if (parameter !== undefined) {
            data.parameter = parameter;
        }
        //parameter could be in definition
        if (data !== undefined && data.parameter !== undefined && definition.parameter !== undefined) {
            throw new Error("definition.parameter would override data.parameter");
        }
        if (definition.parameter !== undefined) {
            data.parameter = definition.parameter;
        }
        definition.content = replaceTemplates(definition.content, data);
        if (definition.background)
            definition.background = replaceTemplates(definition.background, data);
        if (definition.header)
            definition.header = replaceTemplates(definition.header, data);
        if (definition.footer)
            definition.footer = replaceTemplates(definition.footer, data);
        replacePageInformation(definition);
        delete definition.data;
        return definition;
        // delete definition.parameter;
    }
    exports.createReportDefinition = createReportDefinition;
    //add aggregate functions for grouping
    function addGroupFuncions(names, values) {
        names.push("sum");
        values.push(sum);
        names.push("count");
        values.push(count);
        names.push("max");
        values.push(max);
        names.push("min");
        values.push(min);
        names.push("avg");
        values.push(avg);
    }
    function aggr(group, field, data) {
        var ret = 0;
        if (!Array.isArray(group) && group.entries === undefined)
            throw new Error("sum is valid only in arrays and groups");
        var sfield = field;
        if (field.indexOf("${") === -1) {
            sfield = "${" + sfield + "}";
        }
        if (Array.isArray(group)) {
            for (var x = 0; x < group.length; x++) {
                var ob = group[x];
                if (ob.entries !== undefined)
                    aggr(ob.entries, field, data);
                else {
                    var val = sfield.replaceTemplate(ob, true);
                    data.func(data, val === undefined ? 0 : Number.parseFloat(val));
                }
            }
        }
        else {
            aggr(group.entries, field, data); //group
        }
        return data;
    }
    //sum the field in the group
    function sum(group, field) {
        return aggr(group, field, {
            ret: 0,
            func: (data, num) => {
                data.ret = data.ret + num;
            }
        }).ret;
    }
    //count the field in the group
    function count(group, field) {
        return aggr(group, field, {
            ret: 0,
            func: (data, num) => {
                data.ret = data.ret + 1;
            }
        }).ret;
    }
    //get the maximum of the field in the group
    function max(group, field) {
        return aggr(group, field, {
            ret: Number.MIN_VALUE,
            func: (data, num) => {
                if (num > data.ret)
                    data.ret = num;
            }
        }).ret;
    }
    //get the minimum of the field in the group
    function min(group, field) {
        return aggr(group, field, {
            ret: Number.MAX_VALUE,
            func: (data, num) => {
                if (num < data.ret)
                    data.ret = num;
            }
        }).ret;
    }
    //get the minimum of the field in the group
    function avg(group, field) {
        var ret = aggr(group, field, {
            ret: 0,
            count: 0,
            func: (data, num) => {
                data.ret = data.ret + num;
                data.count++;
            }
        });
        return ret.ret / ret.count;
    }
    function test() {
        var ff = _format("####,##", 50.22, {});
        var hh = formatDate("DD.MM.YYYY hh:mm:ss", new Date());
        var hh = formatDate("YY-MM-DD h:mm:ss A", new Date());
        var sampleData = [
            { id: 1, customer: "Fred", city: "Frankfurt", age: 51 },
            { id: 8, customer: "Alma", city: "Dresden", age: 70 },
            { id: 3, customer: "Heinz", city: "Frankfurt", age: 33 },
            { id: 2, customer: "Fred", city: "Frankfurt", age: 88 },
            { id: 6, customer: "Max", city: "Dresden", age: 3 },
            { id: 4, customer: "Heinz", city: "Frankfurt", age: 64 },
            { id: 5, customer: "Max", city: "Dresden", age: 54 },
            { id: 7, customer: "Alma", city: "Dresden", age: 33 },
            { id: 9, customer: "Otto", city: "Berlin", age: 21 }
        ];
        var h = {
            all: doGroup(sampleData, ["city", "customer"]),
            k: 5,
            ho() {
                return this.k + 1;
            }
        };
        //@ts-ignore
        var s = "${Math.round(avg(all,'age'),2)}".replaceTemplate(h, true);
        s = "${k}".replaceTemplate(h, true);
        s = "${ho()}".replaceTemplate(h, true);
    }
    exports.test = test;
});
//# sourceMappingURL=pdfmakejassi.js.map