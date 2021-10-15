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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmbWFrZWphc3NpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvcmVtb3RlL3BkZm1ha2VqYXNzaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQUEsaUNBQWlDO0lBQ2pDLElBQUksU0FBUyxHQUFRLEVBQUUsQ0FBQztJQUN4QixpRkFBaUY7SUFDakYsbUZBQW1GO0lBQ25GLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQztJQUM5QixNQUFNLFlBQVksR0FBRyxZQUFZLENBQUM7SUFFbEMsU0FBUyxRQUFRLENBQUMsSUFBSTtRQUNyQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELFNBQVMsV0FBVyxDQUFDLElBQUksR0FBRyxNQUFNO1FBQ2pDLE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ3hCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFM0QsbUVBQW1FO1FBQ25FLE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE1BQU0sTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDekIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xELHVEQUF1RDtRQUN2RCxNQUFNLElB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LGVBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFHeEMsQ0FBQztJQTdCRCxvQkE2QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvL3RlbXBsYXRpbmcgaXMgc2xvdyBzbyB3ZSBjaGFjaGVcclxudmFyIGZ1bmNjYWNoZTogYW55ID0ge307XHJcbi8vaHR0cHM6Ly9naXRodWIuY29tL01vdHRpZS9qYXZhc2NyaXB0LW51bWJlci1mb3JtYXR0ZXIvYmxvYi9tYXN0ZXIvc3JjL2Zvcm1hdC5qc1xyXG4vL2xpY2Vuc2UgaHR0cHM6Ly9naXRodWIuY29tL01vdHRpZS9qYXZhc2NyaXB0LW51bWJlci1mb3JtYXR0ZXIvYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG5jb25zdCBtYXNrUmVnZXggPSAvWzAtOVxcLSsjXS87XHJcbmNvbnN0IG5vdE1hc2tSZWdleCA9IC9bXlxcZFxcLSsjXS9nO1xyXG5cclxuZnVuY3Rpb24gZ2V0SW5kZXgobWFzaykge1xyXG5cdHJldHVybiBtYXNrLnNlYXJjaChtYXNrUmVnZXgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzTWFzayhtYXNrID0gXCIjLiMjXCIpIHtcclxuXHRjb25zdCBtYXNrT2JqOiBhbnkgPSB7fTtcclxuXHRjb25zdCBsZW4gPSBtYXNrLmxlbmd0aDtcclxuXHRjb25zdCBzdGFydCA9IGdldEluZGV4KG1hc2spO1xyXG5cdG1hc2tPYmoucHJlZml4ID0gc3RhcnQgPiAwID8gbWFzay5zdWJzdHJpbmcoMCwgc3RhcnQpIDogXCJcIjtcclxuXHJcblx0Ly8gUmV2ZXJzZSBzdHJpbmc6IG5vdCBhbiBpZGVhbCBtZXRob2QgaWYgdGhlcmUgYXJlIHN1cnJvZ2F0ZSBwYWlyc1xyXG5cdGNvbnN0IGVuZCA9IGdldEluZGV4KG1hc2suc3BsaXQoXCJcIikucmV2ZXJzZSgpLmpvaW4oXCJcIikpO1xyXG5cdGNvbnN0IG9mZnNldCA9IGxlbiAtIGVuZDtcclxuXHRjb25zdCBzdWJzdHIgPSBtYXNrLnN1YnN0cmluZyhvZmZzZXQsIG9mZnNldCArIDEpO1xyXG5cdC8vIEFkZCAxIHRvIG9mZnNldCBpZiBtYXNrIGhhcyBhIHRyYWlsaW5nIGRlY2ltYWwvY29tbWFcclxuXHRjb25zdCBpbmR4ID0gb2Zmc2V0ICsgKChzdWJzdHIgPT09IFwiLlwiIHx8IChzdWJzdHIgPT09IFwiLFwiKSkgPyAxIDogMCk7XHJcblx0bWFza09iai5zdWZmaXggPSBlbmQgPiAwID8gbWFzay5zdWJzdHJpbmcoaW5keCwgbGVuKSA6IFwiXCI7XHJcblxyXG5cdG1hc2tPYmoubWFzayA9IG1hc2suc3Vic3RyaW5nKHN0YXJ0LCBpbmR4KTtcclxuXHRtYXNrT2JqLm1hc2tIYXNOZWdhdGl2ZVNpZ24gPSBtYXNrT2JqLm1hc2suY2hhckF0KDApID09PSBcIi1cIjtcclxuXHRtYXNrT2JqLm1hc2tIYXNQb3NpdGl2ZVNpZ24gPSBtYXNrT2JqLm1hc2suY2hhckF0KDApID09PSBcIitcIjtcclxuXHJcblx0Ly8gU2VhcmNoIGZvciBncm91cCBzZXBhcmF0b3IgJiBkZWNpbWFsOyBhbnl0aGluZyBub3QgZGlnaXQsXHJcblx0Ly8gbm90ICsvLSBzaWduLCBhbmQgbm90ICNcclxuXHRsZXQgcmVzdWx0ID0gbWFza09iai5tYXNrLm1hdGNoKG5vdE1hc2tSZWdleCk7XHJcblx0Ly8gVHJlYXQgdGhlIHJpZ2h0IG1vc3Qgc3ltYm9sIGFzIGRlY2ltYWxcclxuXHRtYXNrT2JqLmRlY2ltYWwgPSAocmVzdWx0ICYmIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0pIHx8IFwiLlwiO1xyXG5cdC8vIFRyZWF0IHRoZSBsZWZ0IG1vc3Qgc3ltYm9sIGFzIGdyb3VwIHNlcGFyYXRvclxyXG5cdG1hc2tPYmouc2VwYXJhdG9yID0gKHJlc3VsdCAmJiByZXN1bHRbMV0gJiYgcmVzdWx0WzBdKSB8fCBcIixcIjtcclxuXHJcblx0Ly8gU3BsaXQgdGhlIGRlY2ltYWwgZm9yIHRoZSBmb3JtYXQgc3RyaW5nIGlmIGFueVxyXG5cdHJlc3VsdCA9IG1hc2tPYmoubWFzay5zcGxpdChtYXNrT2JqLmRlY2ltYWwpO1xyXG5cdG1hc2tPYmouaW50ZWdlciA9IHJlc3VsdFswXTtcclxuXHRtYXNrT2JqLmZyYWN0aW9uID0gcmVzdWx0WzFdO1xyXG5cdHJldHVybiBtYXNrT2JqO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwcm9jZXNzVmFsdWUodmFsdWUsIG1hc2tPYmosIG9wdGlvbnMpIHtcclxuXHRsZXQgaXNOZWdhdGl2ZSA9IGZhbHNlO1xyXG5cdGNvbnN0IHZhbE9iajogYW55ID0ge1xyXG5cdFx0dmFsdWVcclxuXHR9O1xyXG5cdGlmICh2YWx1ZSA8IDApIHtcclxuXHRcdGlzTmVnYXRpdmUgPSB0cnVlO1xyXG5cdFx0Ly8gUHJvY2VzcyBvbmx5IGFicygpLCBhbmQgdHVybiBvbiBmbGFnLlxyXG5cdFx0dmFsT2JqLnZhbHVlID0gLXZhbE9iai52YWx1ZTtcclxuXHR9XHJcblxyXG5cdHZhbE9iai5zaWduID0gaXNOZWdhdGl2ZSA/IFwiLVwiIDogXCJcIjtcclxuXHJcblx0Ly8gRml4IHRoZSBkZWNpbWFsIGZpcnN0LCB0b0ZpeGVkIHdpbGwgYXV0byBmaWxsIHRyYWlsaW5nIHplcm8uXHJcblx0dmFsT2JqLnZhbHVlID0gTnVtYmVyKHZhbE9iai52YWx1ZSkudG9GaXhlZChtYXNrT2JqLmZyYWN0aW9uICYmIG1hc2tPYmouZnJhY3Rpb24ubGVuZ3RoKTtcclxuXHQvLyBDb252ZXJ0IG51bWJlciB0byBzdHJpbmcgdG8gdHJpbSBvZmYgKmFsbCogdHJhaWxpbmcgZGVjaW1hbCB6ZXJvKGVzKVxyXG5cdHZhbE9iai52YWx1ZSA9IE51bWJlcih2YWxPYmoudmFsdWUpLnRvU3RyaW5nKCk7XHJcblxyXG5cdC8vIEZpbGwgYmFjayBhbnkgdHJhaWxpbmcgemVybyBhY2NvcmRpbmcgdG8gZm9ybWF0XHJcblx0Ly8gbG9vayBmb3IgbGFzdCB6ZXJvIGluIGZvcm1hdFxyXG5cdGNvbnN0IHBvc1RyYWlsWmVybyA9IG1hc2tPYmouZnJhY3Rpb24gJiYgbWFza09iai5mcmFjdGlvbi5sYXN0SW5kZXhPZihcIjBcIik7XHJcblx0bGV0IFt2YWxJbnRlZ2VyID0gXCIwXCIsIHZhbEZyYWN0aW9uID0gXCJcIl0gPSB2YWxPYmoudmFsdWUuc3BsaXQoXCIuXCIpO1xyXG5cdGlmICghdmFsRnJhY3Rpb24gfHwgKHZhbEZyYWN0aW9uICYmIHZhbEZyYWN0aW9uLmxlbmd0aCA8PSBwb3NUcmFpbFplcm8pKSB7XHJcblx0XHR2YWxGcmFjdGlvbiA9IHBvc1RyYWlsWmVybyA8IDBcclxuXHRcdFx0PyBcIlwiXHJcblx0XHRcdDogKE51bWJlcihcIjAuXCIgKyB2YWxGcmFjdGlvbikudG9GaXhlZChwb3NUcmFpbFplcm8gKyAxKSkucmVwbGFjZShcIjAuXCIsIFwiXCIpO1xyXG5cdH1cclxuXHJcblx0dmFsT2JqLmludGVnZXIgPSB2YWxJbnRlZ2VyO1xyXG5cdHZhbE9iai5mcmFjdGlvbiA9IHZhbEZyYWN0aW9uO1xyXG5cdGFkZFNlcGFyYXRvcnModmFsT2JqLCBtYXNrT2JqKTtcclxuXHJcblx0Ly8gUmVtb3ZlIG5lZ2F0aXZlIHNpZ24gaWYgcmVzdWx0IGlzIHplcm9cclxuXHRpZiAodmFsT2JqLnJlc3VsdCA9PT0gXCIwXCIgfHwgdmFsT2JqLnJlc3VsdCA9PT0gXCJcIikge1xyXG5cdFx0Ly8gUmVtb3ZlIG5lZ2F0aXZlIHNpZ24gaWYgcmVzdWx0IGlzIHplcm9cclxuXHRcdGlzTmVnYXRpdmUgPSBmYWxzZTtcclxuXHRcdHZhbE9iai5zaWduID0gXCJcIjtcclxuXHR9XHJcblxyXG5cdGlmICghaXNOZWdhdGl2ZSAmJiBtYXNrT2JqLm1hc2tIYXNQb3NpdGl2ZVNpZ24pIHtcclxuXHRcdHZhbE9iai5zaWduID0gXCIrXCI7XHJcblx0fSBlbHNlIGlmIChpc05lZ2F0aXZlICYmIG1hc2tPYmoubWFza0hhc1Bvc2l0aXZlU2lnbikge1xyXG5cdFx0dmFsT2JqLnNpZ24gPSBcIi1cIjtcclxuXHR9IGVsc2UgaWYgKGlzTmVnYXRpdmUpIHtcclxuXHRcdHZhbE9iai5zaWduID0gb3B0aW9ucyAmJiBvcHRpb25zLmVuZm9yY2VNYXNrU2lnbiAmJiAhbWFza09iai5tYXNrSGFzTmVnYXRpdmVTaWduXHJcblx0XHRcdD8gXCJcIlxyXG5cdFx0XHQ6IFwiLVwiO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHZhbE9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkU2VwYXJhdG9ycyh2YWxPYmosIG1hc2tPYmopIHtcclxuXHR2YWxPYmoucmVzdWx0ID0gXCJcIjtcclxuXHQvLyBMb29rIGZvciBzZXBhcmF0b3JcclxuXHRjb25zdCBzelNlcCA9IG1hc2tPYmouaW50ZWdlci5zcGxpdChtYXNrT2JqLnNlcGFyYXRvcik7XHJcblx0Ly8gSm9pbiBiYWNrIHdpdGhvdXQgc2VwYXJhdG9yIGZvciBjb3VudGluZyB0aGUgcG9zIG9mIGFueSBsZWFkaW5nIDBcclxuXHRjb25zdCBtYXNrSW50ZWdlciA9IHN6U2VwLmpvaW4oXCJcIik7XHJcblxyXG5cdGNvbnN0IHBvc0xlYWRaZXJvID0gbWFza0ludGVnZXIgJiYgbWFza0ludGVnZXIuaW5kZXhPZihcIjBcIik7XHJcblx0aWYgKHBvc0xlYWRaZXJvID4gLTEpIHtcclxuXHRcdHdoaWxlICh2YWxPYmouaW50ZWdlci5sZW5ndGggPCAobWFza0ludGVnZXIubGVuZ3RoIC0gcG9zTGVhZFplcm8pKSB7XHJcblx0XHRcdHZhbE9iai5pbnRlZ2VyID0gXCIwXCIgKyB2YWxPYmouaW50ZWdlcjtcclxuXHRcdH1cclxuXHR9IGVsc2UgaWYgKE51bWJlcih2YWxPYmouaW50ZWdlcikgPT09IDApIHtcclxuXHRcdHZhbE9iai5pbnRlZ2VyID0gXCJcIjtcclxuXHR9XHJcblxyXG5cdC8vIFByb2Nlc3MgdGhlIGZpcnN0IGdyb3VwIHNlcGFyYXRvciBmcm9tIGRlY2ltYWwgKC4pIG9ubHksIHRoZSByZXN0IGlnbm9yZS5cclxuXHQvLyBnZXQgdGhlIGxlbmd0aCBvZiB0aGUgbGFzdCBzbGljZSBvZiBzcGxpdCByZXN1bHQuXHJcblx0Y29uc3QgcG9zU2VwYXJhdG9yID0gKHN6U2VwWzFdICYmIHN6U2VwW3N6U2VwLmxlbmd0aCAtIDFdLmxlbmd0aCk7XHJcblx0aWYgKHBvc1NlcGFyYXRvcikge1xyXG5cdFx0Y29uc3QgbGVuID0gdmFsT2JqLmludGVnZXIubGVuZ3RoO1xyXG5cdFx0Y29uc3Qgb2Zmc2V0ID0gbGVuICUgcG9zU2VwYXJhdG9yO1xyXG5cdFx0Zm9yIChsZXQgaW5keCA9IDA7IGluZHggPCBsZW47IGluZHgrKykge1xyXG5cdFx0XHR2YWxPYmoucmVzdWx0ICs9IHZhbE9iai5pbnRlZ2VyLmNoYXJBdChpbmR4KTtcclxuXHRcdFx0Ly8gLXBvc1NlcGFyYXRvciBzbyB0aGF0IHdvbid0IHRyYWlsIHNlcGFyYXRvciBvbiBmdWxsIGxlbmd0aFxyXG5cdFx0XHRpZiAoISgoaW5keCAtIG9mZnNldCArIDEpICUgcG9zU2VwYXJhdG9yKSAmJiBpbmR4IDwgbGVuIC0gcG9zU2VwYXJhdG9yKSB7XHJcblx0XHRcdFx0dmFsT2JqLnJlc3VsdCArPSBtYXNrT2JqLnNlcGFyYXRvcjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHR2YWxPYmoucmVzdWx0ID0gdmFsT2JqLmludGVnZXI7XHJcblx0fVxyXG5cclxuXHR2YWxPYmoucmVzdWx0ICs9IChtYXNrT2JqLmZyYWN0aW9uICYmIHZhbE9iai5mcmFjdGlvbilcclxuXHRcdD8gbWFza09iai5kZWNpbWFsICsgdmFsT2JqLmZyYWN0aW9uXHJcblx0XHQ6IFwiXCI7XHJcblx0cmV0dXJuIHZhbE9iajtcclxufVxyXG5cclxuZnVuY3Rpb24gX2Zvcm1hdChtYXNrLCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XHJcblx0aWYgKCFtYXNrIHx8IGlzTmFOKE51bWJlcih2YWx1ZSkpKSB7XHJcblx0XHQvLyBJbnZhbGlkIGlucHV0c1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgbWFza09iajogYW55ID0gcHJvY2Vzc01hc2sobWFzayk7XHJcblx0Y29uc3QgdmFsT2JqID0gcHJvY2Vzc1ZhbHVlKHZhbHVlLCBtYXNrT2JqLCBvcHRpb25zKTtcclxuXHRyZXR1cm4gbWFza09iai5wcmVmaXggKyB2YWxPYmouc2lnbiArIHZhbE9iai5yZXN1bHQgKyBtYXNrT2JqLnN1ZmZpeDtcclxufTtcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9FTkQgaHR0cHM6Ly9naXRodWIuY29tL01vdHRpZS9qYXZhc2NyaXB0LW51bWJlci1mb3JtYXR0ZXIvYmxvYi9tYXN0ZXIvc3JjL2Zvcm1hdC5qc1xyXG4vL2FkZCAwIGJlZm9yZVxyXG5mdW5jdGlvbiB2KHN0cixudW0pe1xyXG5cdHN0cj1zdHIudG9TdHJpbmcoKTtcclxuXHR3aGlsZShzdHIubGVuZ3RoPG51bSl7XHJcblx0XHRzdHI9XCIwXCIrc3RyO1xyXG5cdH1cclxuXHRyZXR1cm4gc3RyO1xyXG59XHJcblxyXG4vL3NpbXBsZSBkYXRlZm9ybWF0IHBlcmhhcHMgd2Ugc2hvdWxkIHVzZSBtb21lbnRzXHJcbi8vbm93IHdlIGRvIHNvbWV0aGluZyBiYXNpY3NcclxuZnVuY3Rpb24gZm9ybWF0RGF0ZShmb3JtYXQ6c3RyaW5nLGRhdGU6RGF0ZSl7XHJcblx0cmV0dXJuIGZvcm1hdC5cclxuXHRcdFx0cmVwbGFjZShcIkREXCIsdihkYXRlLmdldERhdGUoKSwyKSkuXHJcblx0XHRcdHJlcGxhY2UoXCJEXCIsZGF0ZS5nZXREYXRlKCkudG9TdHJpbmcoKSkuXHJcblx0XHRcdHJlcGxhY2UoXCJNTVwiLHYoZGF0ZS5nZXRNb250aCgpLDIpKS5cclxuXHRcdFx0cmVwbGFjZShcIllZWVlcIixkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKSkuXHJcblx0XHRcdHJlcGxhY2UoXCJZWVwiLChkYXRlLmdldEZ1bGxZZWFyKCklMTAwKS50b1N0cmluZygpKS5cclxuXHRcdFx0cmVwbGFjZShcIkFcIixkYXRlLmdldEhvdXJzKCk+MTI/XCJQTVwiOlwiQU1cIikuXHJcblx0XHRcdHJlcGxhY2UoXCJoaFwiLHYoZGF0ZS5nZXRIb3VycygpLDIpKS5cclxuXHRcdFx0cmVwbGFjZShcImhcIiwoZGF0ZS5nZXRIb3VycygpICUgMTIpLnRvU3RyaW5nKCkpLlxyXG5cdFx0XHRyZXBsYWNlKFwibW1cIix2KGRhdGUuZ2V0TWludXRlcygpLDIpKS5cclxuXHRcdFx0cmVwbGFjZShcInNzXCIsdihkYXRlLmdldFNlY29uZHMoKSwyKSk7XHJcbn1cclxuXHJcbi8vY2xvbmUgdGhlIG9iaiBkZXBwXHJcbmZ1bmN0aW9uIGNsb25lKG9iaikge1xyXG5cdGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIChvYmopICE9PSAnb2JqZWN0JyB8fCAnaXNBY3RpdmVDbG9uZScgaW4gb2JqKVxyXG5cdFx0cmV0dXJuIG9iajtcclxuXHJcblx0aWYgKG9iaiBpbnN0YW5jZW9mIERhdGUgfHwgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIilcclxuXHRcdHZhciB0ZW1wID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpOyAvL29yIG5ldyBEYXRlKG9iaik7XHJcblx0ZWxzZVxyXG5cdFx0dmFyIHRlbXAgPSBvYmouY29uc3RydWN0b3IoKTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuXHRcdFx0b2JqWydpc0FjdGl2ZUNsb25lJ10gPSBudWxsO1xyXG5cdFx0XHR0ZW1wW2tleV0gPSBjbG9uZShvYmpba2V5XSk7XHJcblx0XHRcdGRlbGV0ZSBvYmpbJ2lzQWN0aXZlQ2xvbmUnXTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRlbXA7XHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuXHRpbnRlcmZhY2UgU3RyaW5nIHtcclxuXHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0cmVwbGFjZVRlbXBsYXRlOiBhbnk7XHJcblx0fVxyXG59XHJcbi8vcmVwbGFjZSB0aGUgcGFyYW1zIGluIHRoZSBzdHJpbmdcclxuLy9AcGFyYW0ge2Jvb2xlYW59IHJldHVyblZhbHVlcyAtIGlmIHRydWUgdGhlIHRlbXBsYXRldmFsdWVzIHdvdWxkIGJlIHJldHVybmVkIG5vdCB0aGUgcmVwbGFjZXMgc3RyaW5nXHJcbi8vQHRzLWlnbm9yZVxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VUZW1wbGF0ZSA9IGZ1bmN0aW9uIChwYXJhbXMsIHJldHVyblZhbHVlcykge1xyXG5cdGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXMocGFyYW1zKTtcclxuXHRjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyhwYXJhbXMpO1xyXG5cdGFkZEdyb3VwRnVuY2lvbnMobmFtZXMsIHZhbHMpO1xyXG5cdGZvciAobGV0IHggPSAwOyB4IDwgdmFscy5sZW5ndGg7IHgrKykge1xyXG5cdFx0aWYgKHR5cGVvZiB2YWxzW3hdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dmFsc1t4XSA9ICg8YW55PnZhbHNbeF0pLmJpbmQocGFyYW1zKTtcclxuXHRcdH1cclxuXHR9XHJcblx0bGV0IHN0YWcgPSBcIlwiO1xyXG5cdGlmIChyZXR1cm5WYWx1ZXMpIHtcclxuXHRcdG5hbWVzLnB1c2goXCJ0YWdcIik7XHJcblx0XHRzdGFnID0gXCJ0YWdcIjtcclxuXHRcdHZhbHMucHVzaChmdW5jdGlvbiB0YWcoc3RyaW5ncywgdmFsdWVzKSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZXM7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmFyIGZ1bmMgPSBmdW5jY2FjaGVbbmFtZXMuam9pbihcIixcIikgKyB0aGlzXTtcclxuXHRpZiAoZnVuYyA9PT0gdW5kZWZpbmVkKSB7Ly9jcmVhdGUgZnVuY3Rpb25zIGlzIHNsb3cgc28gY2FjaGVcclxuXHRcdGZ1bmMgPSBuZXcgRnVuY3Rpb24oLi4ubmFtZXMsIGByZXR1cm4gJHtzdGFnfVxcYCR7dGhpc31cXGA7YCk7XHJcblx0XHRmdW5jY2FjaGVbbmFtZXMuam9pbihcIixcIikgKyB0aGlzXSA9IGZ1bmM7XHJcblx0fVxyXG5cdHJldHVybiBmdW5jKC4uLnZhbHMpO1xyXG59XHJcbi8vZ2V0IHRoZSBtZW1iZXIgb2YgdGhlIGRhdGFcclxuZnVuY3Rpb24gZ2V0VmFyKGRhdGEsIG1lbWJlcjogc3RyaW5nKSB7XHJcblx0dmFyIGVyZ2VibmlzID0gbWVtYmVyLnRvU3RyaW5nKCkubWF0Y2goL1xcJFxceyhcXHd8fFxcLikqXFx9L2cpO1xyXG5cdGlmICghZXJnZWJuaXMpXHJcblx0XHRtZW1iZXIgPSBcIiR7XCIgKyBtZW1iZXIgKyBcIn1cIjtcclxuXHR2YXIgb2IgPSBtZW1iZXIucmVwbGFjZVRlbXBsYXRlKGRhdGEsIHRydWUpO1xyXG5cdHJldHVybiBvYjtcclxufVxyXG4vL3JlcGxhY2Uge3tjdXJyZW50UGFnZX19IHt7cGFnZVdpZHRofX0ge3twYWdlSGVpZ2h0fX0ge3twYWdlQ291bnR9fSBpbiBoZWFkZXIsZm9vdGVyLCBiYWNrZ3JvdW5kXHJcbmZ1bmN0aW9uIHJlcGxhY2VQYWdlSW5mb3JtYXRpb24oZGVmKSB7XHJcblxyXG5cdGlmIChkZWYuYmFja2dyb3VuZCAmJiB0eXBlb2YgZGVmLmJhY2tncm91bmQgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0bGV0IGQgPSBKU09OLnN0cmluZ2lmeShkZWYuYmFja2dyb3VuZCk7XHJcblx0XHRkZWYuYmFja2dyb3VuZCA9IGZ1bmN0aW9uIChjdXJyZW50UGFnZSwgcGFnZVNpemUpIHtcclxuXHRcdFx0bGV0IHNyZXQgPSBkLnJlcGxhY2VBbGwoXCJ7e2N1cnJlbnRQYWdlfX1cIiwgY3VycmVudFBhZ2UpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlV2lkdGh9fVwiLCBwYWdlU2l6ZS53aWR0aCk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VIZWlnaHR9fVwiLCBwYWdlU2l6ZS5oZWlnaHQpO1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShzcmV0KTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKGRlZi5oZWFkZXIgJiYgdHlwZW9mIGRlZi5oZWFkZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0bGV0IGQgPSBKU09OLnN0cmluZ2lmeShkZWYuaGVhZGVyKTtcclxuXHRcdGRlZi5oZWFkZXIgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VDb3VudCkge1xyXG5cdFx0XHRsZXQgc3JldCA9IGQucmVwbGFjZUFsbChcInt7Y3VycmVudFBhZ2V9fVwiLCBjdXJyZW50UGFnZSk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VDb3VudH19XCIsIHBhZ2VDb3VudCk7XHJcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHNyZXQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoZGVmLmZvb3RlciAmJiB0eXBlb2YgZGVmLmZvb3RlciAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRsZXQgZCA9IEpTT04uc3RyaW5naWZ5KGRlZi5mb290ZXIpO1xyXG5cclxuXHRcdGRlZi5mb290ZXIgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VDb3VudCwgcGFnZVNpemUpIHtcclxuXHRcdFx0bGV0IHNyZXQgPSBkLnJlcGxhY2VBbGwoXCJ7e2N1cnJlbnRQYWdlfX1cIiwgY3VycmVudFBhZ2UpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlQ291bnR9fVwiLCBwYWdlQ291bnQpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlV2lkdGh9fVwiLCBwYWdlU2l6ZS53aWR0aCk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VIZWlnaHR9fVwiLCBwYWdlU2l6ZS5oZWlnaHQpO1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShzcmV0KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuLy9zb3J0IHRoZSBncm91cCB3aXRoIGdyb3VwZmllbGRzXHJcbmZ1bmN0aW9uIGdyb3VwU29ydChncm91cCwgbmFtZSwgZ3JvdXBmaWVsZHMsIGdyb3VwaWQgPSAwKSB7XHJcblx0dmFyIHJldCA9IHsgZW50cmllczogW10sIG5hbWU6IG5hbWUgfTtcclxuXHRpZiAoZ3JvdXBpZCA+IDApXHJcblx0XHRyZXRbXCJncm91cGZpZWxkXCJdID0gZ3JvdXBmaWVsZHNbZ3JvdXBpZCAtIDFdO1xyXG5cdGlmIChBcnJheS5pc0FycmF5KGdyb3VwKSkge1xyXG5cdFx0Z3JvdXAuZm9yRWFjaCgobmV1KSA9PiByZXQuZW50cmllcy5wdXNoKG5ldSkpO1xyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIGdyb3VwKSB7XHJcblx0XHRcdHZhciBuZXUgPSBncm91cFtrZXldO1xyXG5cdFx0XHRyZXQuZW50cmllcy5wdXNoKGdyb3VwU29ydChuZXUsIGtleSwgZ3JvdXBmaWVsZHMsIGdyb3VwaWQgKyAxKSk7XHJcblx0XHR9XHJcblx0XHRyZXQuZW50cmllcyA9IHJldC5lbnRyaWVzLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cdHJldHVybiByZXQ7XHJcbn1cclxuLyoqXHJcbiAqIGdyb3VwcyBhbmQgc29ydCB0aGUgZW50cmllc1xyXG4gKiBAcGFyYW0ge2FueVtdfSBlbnRyaWVzIC0gdGhlIGVudHJpZXMgdG8gZ3JvdXBcclxuICogQHBhcmFtIHtzdHJpbmdbXX0gZ3JvdXBmaWVsZHMgLSB0aGUgZmllbGRzIHdoZXJlIHRoZSBlbnRyaWVzIGFyZSBncm91cGVkICBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkb0dyb3VwKGVudHJpZXMsIGdyb3VwZmllbGRzOiBzdHJpbmdbXSkge1xyXG5cdHZhciByZXQ6IGFueSA9IHt9O1xyXG5cdGZvciAodmFyIGUgPSAwOyBlIDwgZW50cmllcy5sZW5ndGg7IGUrKykge1xyXG5cdFx0dmFyIGVudHJ5ID0gZW50cmllc1tlXTtcclxuXHRcdGxldCBwYXJlbnQgPSByZXQ7XHJcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IGdyb3VwZmllbGRzLmxlbmd0aDsgeCsrKSB7XHJcblx0XHRcdHZhciBncm91cG5hbWUgPSBlbnRyeVtncm91cGZpZWxkc1t4XV07XHJcblx0XHRcdGlmICh4IDwgZ3JvdXBmaWVsZHMubGVuZ3RoIC0gMSkgey8vdW5kZXJncm91cHMgZG9lcyBleGlzdHNcclxuXHRcdFx0XHRpZiAoIXBhcmVudFtncm91cG5hbWVdKVxyXG5cdFx0XHRcdFx0cGFyZW50W2dyb3VwbmFtZV0gPSB7fTtcclxuXHRcdFx0fSBlbHNlIHsgLy9sYXN0IGdyb3VwIGNvbnRhb25zIHRoZSBkYXRhXHJcblx0XHRcdFx0aWYgKCFwYXJlbnRbZ3JvdXBuYW1lXSlcclxuXHRcdFx0XHRcdHBhcmVudFtncm91cG5hbWVdID0gW107XHJcblx0XHRcdFx0cGFyZW50W2dyb3VwbmFtZV0ucHVzaChlbnRyeSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cGFyZW50ID0gcGFyZW50W2dyb3VwbmFtZV07XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vc29ydFxyXG5cdHZhciBzb3J0ZWQgPSBncm91cFNvcnQocmV0LCBcIm1haW5cIiwgZ3JvdXBmaWVsZHMpO1xyXG5cclxuXHRyZXR1cm4gc29ydGVkO1xyXG59XHJcbi8vcmVwbGFjZSB0aGUgZGF0YXRhYmxlIHtkYXRhYmxlOi4uLn0gdG8gdGFibGU6e31cclxuZnVuY3Rpb24gcmVwbGFjZURhdGF0YWJsZShkZWYsIGRhdGEpIHtcclxuXHR2YXIgaGVhZGVyID0gZGVmLmRhdGF0YWJsZS5oZWFkZXI7XHJcblx0dmFyIGZvb3RlciA9IGRlZi5kYXRhdGFibGUuZm9vdGVyO1xyXG5cdHZhciBkYXRhZXhwciA9IGRlZi5kYXRhdGFibGUuZGF0YWZvcmVhY2g7XHJcblx0dmFyIGdyb3VwcyA9IGRlZi5kYXRhdGFibGUuZ3JvdXBzO1xyXG5cdHZhciBib2R5ID0gZGVmLmRhdGF0YWJsZS5ib2R5O1xyXG5cdHZhciBncm91cGV4cHI6IHN0cmluZ1tdID0gW107XHJcblx0ZGVmLnRhYmxlID0gY2xvbmUoZGVmLmRhdGF0YWJsZSk7XHJcblx0ZGVmLnRhYmxlLmJvZHkgPSBbXVxyXG5cdGRlbGV0ZSBkZWYudGFibGUuaGVhZGVyO1xyXG5cdGRlbGV0ZSBkZWYudGFibGUuZm9vdGVyO1xyXG5cdGRlbGV0ZSBkZWYudGFibGUuZGF0YWZvcmVhY2g7XHJcblx0ZGVsZXRlIGRlZi50YWJsZS5ncm91cHM7XHJcblxyXG5cdGlmIChoZWFkZXIpXHJcblx0XHRkZWYudGFibGUuYm9keS5wdXNoKGhlYWRlcik7XHJcblx0aWYgKGdyb3VwcyA9PT0gdW5kZWZpbmVkIHx8IGdyb3Vwcy5sZW5ndGggPT09IDApIHtcclxuXHRcdGRlZi50YWJsZS5ib2R5LnB1c2goe1xyXG5cdFx0XHRmb3JlYWNoOiBkYXRhZXhwcixcclxuXHRcdFx0ZG86IGJvZHlcclxuXHRcdH0pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgcGFyZW50OiBhbnkgPSB7fTtcclxuXHRcdHZhciB0b2FkZCA9IHtcclxuXHRcdFx0Zm9yZWFjaDogXCJncm91cDEgaW4gZGF0YXRhYmxlZ3JvdXBzLmVudHJpZXNcIixcclxuXHRcdFx0ZG86IHBhcmVudFxyXG5cdFx0fVxyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaCh0b2FkZCk7XHJcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IGdyb3Vwcy5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHRncm91cGV4cHIucHVzaChncm91cHNbeF0uZXhwcmVzc2lvbik7XHJcblx0XHRcdGlmICh4IDwgZ3JvdXBzLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRwYXJlbnQuZm9yZWFjaCA9IFwiZ3JvdXBcIiArICh4ICsgMikudG9TdHJpbmcoKSArIFwiIGluIGdyb3VwXCIgKyAoeCArIDEpLnRvU3RyaW5nKCkgKyBcIi5lbnRyaWVzXCI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cGFyZW50LmZvcmVhY2ggPSBkYXRhZXhwci5zcGxpdChcIiBcIilbMF0gKyBcIiBpbiBncm91cFwiICsgKHggKyAxKS50b1N0cmluZygpICsgXCIuZW50cmllc1wiO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChncm91cHNbeF0uaGVhZGVyICYmIGdyb3Vwc1t4XS5oZWFkZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHBhcmVudC5kb2ZpcnN0ID0gZ3JvdXBzW3hdLmhlYWRlcjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZ3JvdXBzW3hdLmZvb3RlciAmJiBncm91cHNbeF0uZm9vdGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRwYXJlbnQuZG9sYXN0ID0gZ3JvdXBzW3hdLmZvb3RlcjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoeCA8IGdyb3Vwcy5sZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0cGFyZW50LmRvID0ge307XHJcblx0XHRcdFx0cGFyZW50ID0gcGFyZW50LmRvO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBhcmVudC5kbyA9IGJvZHk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBhcnIgPSBnZXRBcnJheUZyb21Gb3JFYWNoKGRlZi5kYXRhdGFibGUuZGF0YWZvcmVhY2gsIGRhdGEpO1xyXG5cdFx0ZGF0YS5kYXRhdGFibGVncm91cHMgPSBkb0dyb3VwKGFyciwgZ3JvdXBleHByKTtcclxuXHR9XHJcblxyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmRhdGFmb3JlYWNoO1xyXG5cclxuXHRpZiAoZm9vdGVyKVxyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaChmb290ZXIpO1xyXG5cdC8vZGVsZXRlIGRhdGFbdmFyaWFibGVdO1xyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmhlYWRlcjtcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5mb290ZXI7XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuZm9yZWFjaDtcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5ncm91cHM7XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuYm9keTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIGRlZi5kYXRhdGFibGUpIHtcclxuXHRcdGRlZi50YWJsZVtrZXldID0gZGVmLmRhdGF0YWJsZVtrZXldO1xyXG5cdH1cclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZTtcclxufVxyXG5cclxuLy9nZXQgdGhlIGFycmF5IGZvciB0aGUgZm9yZWFjaCBzdGF0ZW1lbnQgaW4gdGhlIGRhdGFcclxuZnVuY3Rpb24gZ2V0QXJyYXlGcm9tRm9yRWFjaChmb3JlYWNoLCBkYXRhKSB7XHJcblx0dmFyIHNhcnIgPSBmb3JlYWNoLnNwbGl0KFwiIGluIFwiKVsxXTtcclxuXHR2YXIgYXJyO1xyXG5cdGlmIChzYXJyID09PSB1bmRlZmluZWQpIHtcclxuXHRcdGFyciA9IGRhdGE/Lml0ZW1zOy8vd2UgZ2V0IHRoZSBtYWluIGFycmF5XHJcblx0fSBlbHNlIHtcclxuXHRcdGFyciA9IGdldFZhcihkYXRhLCBzYXJyKTtcclxuXHR9XHJcblx0cmV0dXJuIGFycjtcclxufVxyXG4vL3JlcGxhY2UgdGVtcGxhdGVzIGUuZy4gJHtuYW1lfSB3aXRoIHRoZSBkYXRhXHJcbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZXMoZGVmLCBkYXRhLCBwYXJhbSA9IHVuZGVmaW5lZCkge1xyXG5cdGlmIChkZWYgPT09IHVuZGVmaW5lZClcclxuXHRcdHJldHVybjtcclxuXHRpZiAoZGVmLmRhdGF0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRyZXBsYWNlRGF0YXRhYmxlKGRlZiwgZGF0YSk7XHJcblxyXG5cdH1cclxuXHRpZihkZWYuZm9ybWF0KXtcclxuXHRcdHZhciB2YWwgPSBkZWYudGV4dC5yZXBsYWNlVGVtcGxhdGUoZGF0YSx0cnVlKTtcclxuXHRcdGlmKHZhbD09PXVuZGVmaW5lZClcclxuXHRcdCAgICByZXR1cm4gXCJcIjtcclxuXHRcdGVsc2UgaWYodHlwZW9mIHZhbCA9PSAnbnVtYmVyJyl7XHJcblx0XHRcdGRlZi50ZXh0PV9mb3JtYXQoZGVmLmZvcm1hdCx2YWwse30pO1xyXG5cdFx0fWVsc2UgaWYodmFsLmdldE1vbnRoKXtcclxuXHRcdFx0ZGVmLnRleHQ9Zm9ybWF0RGF0ZShkZWYuZm9ybWF0LHZhbCk7XHJcblx0XHR9XHJcblx0XHRkZWxldGUgZGVmLmZvcm1hdDtcclxuXHR9XHJcblx0aWYgKGRlZi5mb3JlYWNoICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdC8vcmVzb2x2ZSBmb3JlYWNoXHJcblx0XHQvL1x0eyBmb3JlYWNoOiBcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLCBkbzogWyd7e2xpbmUudGV4dH19JywgJ3t7bGluZS5wcmljZX19JywgJ09LPyddXHRcclxuXHRcdGlmIChwYXJhbT8ucGFyZW50QXJyYXkgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aHJvdyBcImZvcmVhY2ggaXMgbm90IHN1cm91bmRlZCBieSBhbiBBcnJheVwiO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHZhcmlhYmxlID0gZGVmLmZvcmVhY2guc3BsaXQoXCIgaW4gXCIpWzBdO1xyXG5cdFx0dmFyIGFycjogYW55W10gPSBnZXRBcnJheUZyb21Gb3JFYWNoKGRlZi5mb3JlYWNoLCBkYXRhKTtcclxuXHJcblx0XHRpZiAocGFyYW0/LnBhcmVudEFycmF5UG9zID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cGFyYW0ucGFyZW50QXJyYXlQb3MgPSBwYXJhbT8ucGFyZW50QXJyYXkuaW5kZXhPZihkZWYpO1xyXG5cdFx0XHRwYXJhbT8ucGFyZW50QXJyYXkuc3BsaWNlKHBhcmFtLnBhcmVudEFycmF5UG9zLCAxKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGFyci5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHRkYXRhW3ZhcmlhYmxlXSA9IGFyclt4XTtcclxuXHRcdFx0ZGVsZXRlIGRlZi5mb3JlYWNoO1xyXG5cdFx0XHR2YXIgY29weTtcclxuXHRcdFx0aWYgKGRlZi5kb2ZpcnN0ICYmIHggPT09IDApIHsvL3JlbmRlciBvbmx5IGZvcmZpcnN0XHJcblx0XHRcdFx0Y29weSA9IGNsb25lKGRlZi5kb2ZpcnN0KTtcclxuXHRcdFx0XHRjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhLCBwYXJhbSk7XHJcblx0XHRcdFx0aWYgKGNvcHkgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdHBhcmFtLnBhcmVudEFycmF5LnNwbGljZShwYXJhbS5wYXJlbnRBcnJheVBvcysrLCAwLCBjb3B5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGVmLmRvKVxyXG5cdFx0XHRcdGNvcHkgPSBjbG9uZShkZWYuZG8pO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29weSA9IGNsb25lKGRlZik7XHJcblxyXG5cdFx0XHRjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhLCBwYXJhbSk7XHJcblx0XHRcdGlmIChjb3B5ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0cGFyYW0ucGFyZW50QXJyYXkuc3BsaWNlKHBhcmFtLnBhcmVudEFycmF5UG9zKyssIDAsIGNvcHkpO1xyXG5cclxuXHRcdFx0aWYgKGRlZi5kb2xhc3QgJiYgeCA9PT0gYXJyLmxlbmd0aCAtIDEpIHsvL3JlbmRlciBvbmx5IGZvcmxhc3RcclxuXHRcdFx0XHRjb3B5ID0gY2xvbmUoZGVmLmRvbGFzdCk7XHJcblx0XHRcdFx0Y29weSA9IHJlcGxhY2VUZW1wbGF0ZXMoY29weSwgZGF0YSwgcGFyYW0pO1xyXG5cdFx0XHRcdGlmIChjb3B5ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRwYXJhbS5wYXJlbnRBcnJheS5zcGxpY2UocGFyYW0ucGFyZW50QXJyYXlQb3MrKywgMCwgY29weSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGRlbGV0ZSBkYXRhW3ZhcmlhYmxlXTtcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRlZikpIHtcclxuXHRcdGZvciAodmFyIGEgPSAwOyBhIDwgZGVmLmxlbmd0aDsgYSsrKSB7XHJcblx0XHRcdGlmIChkZWZbYV0uZm9yZWFjaCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmVwbGFjZVRlbXBsYXRlcyhkZWZbYV0sIGRhdGEsIHsgcGFyZW50QXJyYXk6IGRlZiB9KTtcclxuXHRcdFx0XHRhLS07XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGRlZlthXSA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2FdLCBkYXRhLCB7IHBhcmVudEFycmF5OiBkZWYgfSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZGVmO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gXCJzdHJpbmdcIikge1xyXG5cdFx0dmFyIGVyZ2VibmlzID0gZGVmLnRvU3RyaW5nKCkubWF0Y2goL1xcJFxcey9nKTtcclxuXHRcdGlmIChlcmdlYm5pcyAhPT0gbnVsbCkge1xyXG5cdFx0XHRkZWYgPSBkZWYucmVwbGFjZVRlbXBsYXRlKGRhdGEpO1xyXG5cdFx0XHQvL1x0Zm9yICh2YXIgZSA9IDA7IGUgPCBlcmdlYm5pcy5sZW5ndGg7IGUrKykge1xyXG5cdFx0XHQvL1x0XHRkZWYgPSByZXBsYWNlKGRlZiwgZGF0YSwgZXJnZWJuaXNbZV0uc3Vic3RyaW5nKDIsIGVyZ2VibmlzW2VdLmxlbmd0aCAtIDIpKTtcclxuXHRcdFx0Ly9cdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBkZWY7XHJcblx0fSBlbHNlIHsvL29iamVjdFx0XHJcblx0XHRmb3IgKHZhciBrZXkgaW4gZGVmKSB7XHJcblx0XHRcdGRlZltrZXldID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZba2V5XSwgZGF0YSk7XHJcblxyXG5cdFx0fVxyXG5cdFx0ZGVsZXRlIGRlZi5lZGl0VG9nZXRoZXI7Ly9SVGV4dCBpcyBvbmx5IHVzZWQgZm9yIGVkaXRpbmcgcmVwb3J0XHJcblx0fVxyXG5cdHJldHVybiBkZWY7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBjcmVhdGUgYW4gcGRmbWFrZS1kZWZpbml0aW9uIGZyb20gYW4gamFzc2lqcy1yZXBvcnQtZGVmaW5pdGlvbiwgZmlsbHMgZGF0YSBhbmQgcGFyYW1ldGVyIGluIHRoZSByZXBvcnRcclxuICogQHBhcmFtIHtzdHJpbmd9IGRlZmluaXRpb24gLSB0aGUgamFzc2lqcy1yZXBvcnQgZGVmaW5pdGlvblxyXG4gKiBAcGFyYW0ge2FueX0gW2RhdGFdIC0gdGhlIGRhdGEgd2hpY2ggYXJlIGZpbGxlZCBpbiB0aGUgcmVwb3J0IChvcHRpb25hbClcclxuICogQHBhcmFtIHthbnl9IFtwYXJhbWV0ZXJdIC0gdGhlIHBhcmFtZXRlciB3aGljaCBhcmUgZmlsbGVkIGluIHRoZSByZXBvcnQgKG90aW9uYWwpXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVwb3J0RGVmaW5pdGlvbihkZWZpbml0aW9uLCBkYXRhLCBwYXJhbWV0ZXIpIHtcclxuXHRkZWZpbml0aW9uID0gY2xvbmUoZGVmaW5pdGlvbik7Ly90aGlzIHdvdWxkIGJlIG1vZGlmaWVkXHJcblx0aWYgKGRhdGEgIT09IHVuZGVmaW5lZClcclxuXHRcdGRhdGEgPSBjbG9uZShkYXRhKTsvL3RoaXMgd291bGQgYmUgbW9kaWZpZWRcclxuXHJcblx0aWYgKGRhdGEgPT09IHVuZGVmaW5lZCAmJiBkZWZpbml0aW9uLmRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0ZGF0YSA9IGRlZmluaXRpb24uZGF0YTtcclxuXHR9XHJcblx0Ly9wYXJhbWV0ZXIgY291bGQgYmUgaW4gZGF0YVxyXG5cdGlmIChkYXRhICE9PSB1bmRlZmluZWQgJiYgZGF0YS5wYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCAmJiBwYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIHdvdWxkIG92ZXJyaWRlIGRhdGEucGFyYW1ldGVyXCIpO1xyXG5cdH1cclxuXHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG5cdFx0ZGF0YSA9IHsgaXRlbXM6IGRhdGEgfTsvL3NvIHdlIGNhbiBkbyBkYXRhLnBhcmFtZXRlclxyXG5cdH1cclxuXHRpZiAocGFyYW1ldGVyICE9PSB1bmRlZmluZWQpIHtcclxuXHJcblx0XHRkYXRhLnBhcmFtZXRlciA9IHBhcmFtZXRlcjtcclxuXHR9XHJcblx0Ly9wYXJhbWV0ZXIgY291bGQgYmUgaW4gZGVmaW5pdGlvblxyXG5cdGlmIChkYXRhICE9PSB1bmRlZmluZWQgJiYgZGF0YS5wYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCAmJiBkZWZpbml0aW9uLnBhcmFtZXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZWZpbml0aW9uLnBhcmFtZXRlciB3b3VsZCBvdmVycmlkZSBkYXRhLnBhcmFtZXRlclwiKTtcclxuXHR9XHJcblx0aWYgKGRlZmluaXRpb24ucGFyYW1ldGVyICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdGRhdGEucGFyYW1ldGVyID0gZGVmaW5pdGlvbi5wYXJhbWV0ZXI7XHJcblx0fVxyXG5cdGRlZmluaXRpb24uY29udGVudCA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmaW5pdGlvbi5jb250ZW50LCBkYXRhKTtcclxuXHRpZiAoZGVmaW5pdGlvbi5iYWNrZ3JvdW5kKVxyXG5cdFx0ZGVmaW5pdGlvbi5iYWNrZ3JvdW5kID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZpbml0aW9uLmJhY2tncm91bmQsIGRhdGEpO1xyXG5cdGlmIChkZWZpbml0aW9uLmhlYWRlcilcclxuXHRcdGRlZmluaXRpb24uaGVhZGVyID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZpbml0aW9uLmhlYWRlciwgZGF0YSk7XHJcblx0aWYgKGRlZmluaXRpb24uZm9vdGVyKVxyXG5cdFx0ZGVmaW5pdGlvbi5mb290ZXIgPSByZXBsYWNlVGVtcGxhdGVzKGRlZmluaXRpb24uZm9vdGVyLCBkYXRhKTtcclxuXHJcblx0cmVwbGFjZVBhZ2VJbmZvcm1hdGlvbihkZWZpbml0aW9uKTtcclxuXHRkZWxldGUgZGVmaW5pdGlvbi5kYXRhO1xyXG5cdHJldHVybiBkZWZpbml0aW9uO1xyXG5cdC8vIGRlbGV0ZSBkZWZpbml0aW9uLnBhcmFtZXRlcjtcclxufVxyXG5cclxuLy9hZGQgYWdncmVnYXRlIGZ1bmN0aW9ucyBmb3IgZ3JvdXBpbmdcclxuZnVuY3Rpb24gYWRkR3JvdXBGdW5jaW9ucyhuYW1lcywgdmFsdWVzKSB7XHJcblx0bmFtZXMucHVzaChcInN1bVwiKTtcclxuXHR2YWx1ZXMucHVzaChzdW0pO1xyXG5cdG5hbWVzLnB1c2goXCJjb3VudFwiKTtcclxuXHR2YWx1ZXMucHVzaChjb3VudCk7XHJcblx0bmFtZXMucHVzaChcIm1heFwiKTtcclxuXHR2YWx1ZXMucHVzaChtYXgpO1xyXG5cdG5hbWVzLnB1c2goXCJtaW5cIik7XHJcblx0dmFsdWVzLnB1c2gobWluKTtcclxuXHRuYW1lcy5wdXNoKFwiYXZnXCIpO1xyXG5cdHZhbHVlcy5wdXNoKGF2Zyk7XHJcbn1cclxuZnVuY3Rpb24gYWdncihncm91cCwgZmllbGQsZGF0YSkge1xyXG5cdHZhciByZXQgPSAwO1xyXG5cdGlmICghQXJyYXkuaXNBcnJheShncm91cCkgJiYgZ3JvdXAuZW50cmllcyA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwic3VtIGlzIHZhbGlkIG9ubHkgaW4gYXJyYXlzIGFuZCBncm91cHNcIik7XHJcblx0dmFyIHNmaWVsZDogc3RyaW5nID0gZmllbGQ7XHJcblx0aWYgKGZpZWxkLmluZGV4T2YoXCIke1wiKSA9PT0gLTEpIHtcclxuXHRcdHNmaWVsZCA9IFwiJHtcIiArIHNmaWVsZCArIFwifVwiO1xyXG5cdH1cclxuXHRpZihBcnJheS5pc0FycmF5KGdyb3VwKSl7XHJcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IGdyb3VwLmxlbmd0aDsgeCsrKSB7XHJcblx0XHRcdHZhciBvYiA9IGdyb3VwW3hdO1xyXG5cdFx0XHRpZihvYi5lbnRyaWVzIT09dW5kZWZpbmVkKVxyXG5cdFx0XHRcdGFnZ3Iob2IuZW50cmllcyxmaWVsZCxkYXRhKTtcclxuXHRcdFx0ZWxzZXtcclxuXHRcdFx0XHR2YXIgdmFsID0gc2ZpZWxkLnJlcGxhY2VUZW1wbGF0ZShvYiwgdHJ1ZSk7XHJcblx0XHRcdFx0ZGF0YS5mdW5jKGRhdGEsdmFsPT09dW5kZWZpbmVkPzA6IE51bWJlci5wYXJzZUZsb2F0KHZhbCkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fWVsc2V7XHJcblx0XHRhZ2dyKGdyb3VwLmVudHJpZXMsZmllbGQsZGF0YSk7Ly9ncm91cFxyXG5cdH0gXHJcblx0cmV0dXJuIGRhdGE7XHJcbn1cclxuXHJcbi8vc3VtIHRoZSBmaWVsZCBpbiB0aGUgZ3JvdXBcclxuZnVuY3Rpb24gc3VtKGdyb3VwLCBmaWVsZCkge1xyXG5cdHJldHVybiBhZ2dyKGdyb3VwLGZpZWxkLHtcclxuXHRcdHJldDowLFxyXG5cdFx0ZnVuYzooZGF0YSxudW0pPT57XHJcblx0XHRcdGRhdGEucmV0PWRhdGEucmV0K251bTtcclxuXHRcdH1cclxuXHR9KS5yZXQ7XHJcbn1cclxuLy9jb3VudCB0aGUgZmllbGQgaW4gdGhlIGdyb3VwXHJcbmZ1bmN0aW9uIGNvdW50KGdyb3VwLCBmaWVsZCkge1xyXG5cdHJldHVybiBhZ2dyKGdyb3VwLGZpZWxkLHtcclxuXHRcdHJldDowLFxyXG5cdFx0ZnVuYzooZGF0YSxudW0pPT57XHJcblx0XHRcdGRhdGEucmV0PWRhdGEucmV0KzE7XHJcblx0XHR9XHJcblx0fSkucmV0O1xyXG59XHJcbi8vZ2V0IHRoZSBtYXhpbXVtIG9mIHRoZSBmaWVsZCBpbiB0aGUgZ3JvdXBcclxuZnVuY3Rpb24gbWF4KGdyb3VwLCBmaWVsZCkge1xyXG5cdHJldHVybiBhZ2dyKGdyb3VwLGZpZWxkLHtcclxuXHRcdHJldDpOdW1iZXIuTUlOX1ZBTFVFLFxyXG5cdFx0ZnVuYzooZGF0YSxudW0pPT57XHJcblx0XHRcdGlmKG51bT5kYXRhLnJldClcclxuXHRcdFx0XHRkYXRhLnJldD1udW07XHJcblx0XHR9XHJcblx0fSkucmV0O1xyXG59XHJcbi8vZ2V0IHRoZSBtaW5pbXVtIG9mIHRoZSBmaWVsZCBpbiB0aGUgZ3JvdXBcclxuZnVuY3Rpb24gbWluKGdyb3VwLCBmaWVsZCkge1xyXG5cdHJldHVybiBhZ2dyKGdyb3VwLGZpZWxkLHtcclxuXHRcdHJldDpOdW1iZXIuTUFYX1ZBTFVFLFxyXG5cdFx0ZnVuYzooZGF0YSxudW0pPT57XHJcblx0XHRcdGlmKG51bTxkYXRhLnJldClcclxuXHRcdFx0XHRkYXRhLnJldD1udW07XHJcblx0XHR9XHJcblx0fSkucmV0O1xyXG59XHJcbi8vZ2V0IHRoZSBtaW5pbXVtIG9mIHRoZSBmaWVsZCBpbiB0aGUgZ3JvdXBcclxuZnVuY3Rpb24gYXZnKGdyb3VwLCBmaWVsZCkge1xyXG5cdHZhciByZXQ9IGFnZ3IoZ3JvdXAsZmllbGQse1xyXG5cdFx0cmV0OjAsXHJcblx0XHRjb3VudDowLFxyXG5cdFx0ZnVuYzooZGF0YSxudW0pPT57XHJcblx0XHRcdGRhdGEucmV0PWRhdGEucmV0K251bTtcclxuXHRcdFx0ZGF0YS5jb3VudCsrO1xyXG5cclxuXHRcdH1cclxuXHR9KTtcclxuXHRyZXR1cm4gcmV0LnJldC9yZXQuY291bnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG5cdHZhciBmZj0gX2Zvcm1hdChcIiMjIyMsIyNcIiwgNTAuMjIsIHt9KTtcclxuXHR2YXIgaGg9Zm9ybWF0RGF0ZShcIkRELk1NLllZWVkgaGg6bW06c3NcIixuZXcgRGF0ZSgpKTtcclxuXHR2YXIgaGg9Zm9ybWF0RGF0ZShcIllZLU1NLUREIGg6bW06c3MgQVwiLG5ldyBEYXRlKCkpO1xyXG5cdHZhciBzYW1wbGVEYXRhID0gW1xyXG5cdFx0eyBpZDogMSwgY3VzdG9tZXI6IFwiRnJlZFwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDUxIH0sXHJcblx0XHR7IGlkOiA4LCBjdXN0b21lcjogXCJBbG1hXCIsIGNpdHk6IFwiRHJlc2RlblwiLCBhZ2U6IDcwIH0sXHJcblx0XHR7IGlkOiAzLCBjdXN0b21lcjogXCJIZWluelwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDMzIH0sXHJcblx0XHR7IGlkOiAyLCBjdXN0b21lcjogXCJGcmVkXCIsIGNpdHk6IFwiRnJhbmtmdXJ0XCIsIGFnZTogODggfSxcclxuXHRcdHsgaWQ6IDYsIGN1c3RvbWVyOiBcIk1heFwiLCBjaXR5OiBcIkRyZXNkZW5cIiwgYWdlOiAzIH0sXHJcblx0XHR7IGlkOiA0LCBjdXN0b21lcjogXCJIZWluelwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDY0IH0sXHJcblx0XHR7IGlkOiA1LCBjdXN0b21lcjogXCJNYXhcIiwgY2l0eTogXCJEcmVzZGVuXCIsIGFnZTogNTQgfSxcclxuXHRcdHsgaWQ6IDcsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIsIGFnZTogMzMgfSxcclxuXHRcdHsgaWQ6IDksIGN1c3RvbWVyOiBcIk90dG9cIiwgY2l0eTogXCJCZXJsaW5cIiwgYWdlOiAyMSB9XHJcblx0XTtcclxuXHJcblx0dmFyIGggPSB7XHJcblx0XHRhbGw6IGRvR3JvdXAoc2FtcGxlRGF0YSwgW1wiY2l0eVwiLFwiY3VzdG9tZXJcIl0pLFxyXG5cdFx0azogNSxcclxuXHRcdGhvKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5rICsgMTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9AdHMtaWdub3JlXHJcblx0dmFyIHMgPSBcIiR7TWF0aC5yb3VuZChhdmcoYWxsLCdhZ2UnKSwyKX1cIi5yZXBsYWNlVGVtcGxhdGUoaCwgdHJ1ZSk7XHJcblx0cyA9IFwiJHtrfVwiLnJlcGxhY2VUZW1wbGF0ZShoLCB0cnVlKTtcclxuXHRzID0gXCIke2hvKCl9XCIucmVwbGFjZVRlbXBsYXRlKGgsIHRydWUpO1xyXG5cclxuXHRcclxufVxyXG4iXX0=