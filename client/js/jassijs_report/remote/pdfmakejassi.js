define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createReportDefinition = exports.doGroup = void 0;
    //templating is slow so we chache
    var funccache = {};
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
    function test() {
        var h = {
            all: doGroup(sampleData, ["city", "customer"]),
            k: 5,
            ho() {
                return this.k + 1;
            }
        };
        //@ts-ignore
        var s = "${Math.round(avg(all,'age'),2)}".replaceTemplate(h, true);
        console.log(s);
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmbWFrZWphc3NpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvcmVtb3RlL3BkZm1ha2VqYXNzaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQUEsaUNBQWlDO0lBQ2pDLElBQUksU0FBUyxHQUFRLEVBQUUsQ0FBQztJQUV4QixvQkFBb0I7SUFDcEIsU0FBUyxLQUFLLENBQUMsR0FBRztRQUNqQixJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxlQUFlLElBQUksR0FBRztZQUN0RSxPQUFPLEdBQUcsQ0FBQztRQUVaLElBQUksR0FBRyxZQUFZLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO1lBQ2pELElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1COztZQUVyRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFOUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7WUFDcEIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM1QjtTQUNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBUUQsa0NBQWtDO0lBQ2xDLHNHQUFzRztJQUN0RyxZQUFZO0lBQ1osTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLEdBQUcsVUFBVSxNQUFNLEVBQUUsWUFBWTtRQUNoRSxNQUFNLEtBQUss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UCxHQUFHLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sRUFBQyxVQUFVLENBQUMsQ0FBQztZQUM3QyxDQUFDLEVBQUUsQ0FBQztZQUNKLEVBQUU7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDO1NBQ0QsQ0FBQTtRQUNELFlBQVk7UUFDWixJQUFJLENBQUMsR0FBRyxpQ0FBaUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEIsQ0FBQztJQVpELG9CQVlDIiwic291cmNlc0NvbnRlbnQiOlsiLy90ZW1wbGF0aW5nIGlzIHNsb3cgc28gd2UgY2hhY2hlXHJcbnZhciBmdW5jY2FjaGU6IGFueSA9IHt9O1xyXG5cclxuLy9jbG9uZSB0aGUgb2JqIGRlcHBcclxuZnVuY3Rpb24gY2xvbmUob2JqKSB7XHJcblx0aWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnIHx8ICdpc0FjdGl2ZUNsb25lJyBpbiBvYmopXHJcblx0XHRyZXR1cm4gb2JqO1xyXG5cclxuXHRpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSB8fCB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiKVxyXG5cdFx0dmFyIHRlbXAgPSBuZXcgb2JqLmNvbnN0cnVjdG9yKCk7IC8vb3IgbmV3IERhdGUob2JqKTtcclxuXHRlbHNlXHJcblx0XHR2YXIgdGVtcCA9IG9iai5jb25zdHJ1Y3RvcigpO1xyXG5cclxuXHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG5cdFx0XHRvYmpbJ2lzQWN0aXZlQ2xvbmUnXSA9IG51bGw7XHJcblx0XHRcdHRlbXBba2V5XSA9IGNsb25lKG9ialtrZXldKTtcclxuXHRcdFx0ZGVsZXRlIG9ialsnaXNBY3RpdmVDbG9uZSddO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdGVtcDtcclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG5cdGludGVyZmFjZSBTdHJpbmcge1xyXG5cdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRyZXBsYWNlVGVtcGxhdGU6IGFueTtcclxuXHR9XHJcbn1cclxuLy9yZXBsYWNlIHRoZSBwYXJhbXMgaW4gdGhlIHN0cmluZ1xyXG4vL0BwYXJhbSB7Ym9vbGVhbn0gcmV0dXJuVmFsdWVzIC0gaWYgdHJ1ZSB0aGUgdGVtcGxhdGV2YWx1ZXMgd291bGQgYmUgcmV0dXJuZWQgbm90IHRoZSByZXBsYWNlcyBzdHJpbmdcclxuLy9AdHMtaWdub3JlXHJcblN0cmluZy5wcm90b3R5cGUucmVwbGFjZVRlbXBsYXRlID0gZnVuY3Rpb24gKHBhcmFtcywgcmV0dXJuVmFsdWVzKSB7XHJcblx0Y29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhwYXJhbXMpO1xyXG5cdGNvbnN0IHZhbHMgPSBPYmplY3QudmFsdWVzKHBhcmFtcyk7XHJcblx0YWRkR3JvdXBGdW5jaW9ucyhuYW1lcywgdmFscyk7XHJcblx0Zm9yIChsZXQgeCA9IDA7IHggPCB2YWxzLmxlbmd0aDsgeCsrKSB7XHJcblx0XHRpZiAodHlwZW9mIHZhbHNbeF0gPT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHR2YWxzW3hdID0gKDxhbnk+dmFsc1t4XSkuYmluZChwYXJhbXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRsZXQgc3RhZyA9IFwiXCI7XHJcblx0aWYgKHJldHVyblZhbHVlcykge1xyXG5cdFx0bmFtZXMucHVzaChcInRhZ1wiKTtcclxuXHRcdHN0YWcgPSBcInRhZ1wiO1xyXG5cdFx0dmFscy5wdXNoKGZ1bmN0aW9uIHRhZyhzdHJpbmdzLCB2YWx1ZXMpIHtcclxuXHRcdFx0cmV0dXJuIHZhbHVlcztcclxuXHRcdH0pO1xyXG5cdH1cclxuXHR2YXIgZnVuYyA9IGZ1bmNjYWNoZVtuYW1lcy5qb2luKFwiLFwiKSArIHRoaXNdO1xyXG5cdGlmIChmdW5jID09PSB1bmRlZmluZWQpIHsvL2NyZWF0ZSBmdW5jdGlvbnMgaXMgc2xvdyBzbyBjYWNoZVxyXG5cdFx0ZnVuYyA9IG5ldyBGdW5jdGlvbiguLi5uYW1lcywgYHJldHVybiAke3N0YWd9XFxgJHt0aGlzfVxcYDtgKTtcclxuXHRcdGZ1bmNjYWNoZVtuYW1lcy5qb2luKFwiLFwiKSArIHRoaXNdID0gZnVuYztcclxuXHR9XHJcblx0cmV0dXJuIGZ1bmMoLi4udmFscyk7XHJcbn1cclxuLy9nZXQgdGhlIG1lbWJlciBvZiB0aGUgZGF0YVxyXG5mdW5jdGlvbiBnZXRWYXIoZGF0YSwgbWVtYmVyOiBzdHJpbmcpIHtcclxuXHR2YXIgZXJnZWJuaXMgPSBtZW1iZXIudG9TdHJpbmcoKS5tYXRjaCgvXFwkXFx7KFxcd3x8XFwuKSpcXH0vZyk7XHJcblx0aWYgKCFlcmdlYm5pcylcclxuXHRcdG1lbWJlciA9IFwiJHtcIiArIG1lbWJlciArIFwifVwiO1xyXG5cdHZhciBvYiA9IG1lbWJlci5yZXBsYWNlVGVtcGxhdGUoZGF0YSwgdHJ1ZSk7XHJcblx0cmV0dXJuIG9iO1xyXG59XHJcbi8vcmVwbGFjZSB7e2N1cnJlbnRQYWdlfX0ge3twYWdlV2lkdGh9fSB7e3BhZ2VIZWlnaHR9fSB7e3BhZ2VDb3VudH19IGluIGhlYWRlcixmb290ZXIsIGJhY2tncm91bmRcclxuZnVuY3Rpb24gcmVwbGFjZVBhZ2VJbmZvcm1hdGlvbihkZWYpIHtcclxuXHJcblx0aWYgKGRlZi5iYWNrZ3JvdW5kICYmIHR5cGVvZiBkZWYuYmFja2dyb3VuZCAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRsZXQgZCA9IEpTT04uc3RyaW5naWZ5KGRlZi5iYWNrZ3JvdW5kKTtcclxuXHRcdGRlZi5iYWNrZ3JvdW5kID0gZnVuY3Rpb24gKGN1cnJlbnRQYWdlLCBwYWdlU2l6ZSkge1xyXG5cdFx0XHRsZXQgc3JldCA9IGQucmVwbGFjZUFsbChcInt7Y3VycmVudFBhZ2V9fVwiLCBjdXJyZW50UGFnZSk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VXaWR0aH19XCIsIHBhZ2VTaXplLndpZHRoKTtcclxuXHRcdFx0c3JldCA9IHNyZXQucmVwbGFjZUFsbChcInt7cGFnZUhlaWdodH19XCIsIHBhZ2VTaXplLmhlaWdodCk7XHJcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHNyZXQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoZGVmLmhlYWRlciAmJiB0eXBlb2YgZGVmLmhlYWRlciAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRsZXQgZCA9IEpTT04uc3RyaW5naWZ5KGRlZi5oZWFkZXIpO1xyXG5cdFx0ZGVmLmhlYWRlciA9IGZ1bmN0aW9uIChjdXJyZW50UGFnZSwgcGFnZUNvdW50KSB7XHJcblx0XHRcdGxldCBzcmV0ID0gZC5yZXBsYWNlQWxsKFwie3tjdXJyZW50UGFnZX19XCIsIGN1cnJlbnRQYWdlKTtcclxuXHRcdFx0c3JldCA9IHNyZXQucmVwbGFjZUFsbChcInt7cGFnZUNvdW50fX1cIiwgcGFnZUNvdW50KTtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2Uoc3JldCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmIChkZWYuZm9vdGVyICYmIHR5cGVvZiBkZWYuZm9vdGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdGxldCBkID0gSlNPTi5zdHJpbmdpZnkoZGVmLmZvb3Rlcik7XHJcblxyXG5cdFx0ZGVmLmZvb3RlciA9IGZ1bmN0aW9uIChjdXJyZW50UGFnZSwgcGFnZUNvdW50LCBwYWdlU2l6ZSkge1xyXG5cdFx0XHRsZXQgc3JldCA9IGQucmVwbGFjZUFsbChcInt7Y3VycmVudFBhZ2V9fVwiLCBjdXJyZW50UGFnZSk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VDb3VudH19XCIsIHBhZ2VDb3VudCk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VXaWR0aH19XCIsIHBhZ2VTaXplLndpZHRoKTtcclxuXHRcdFx0c3JldCA9IHNyZXQucmVwbGFjZUFsbChcInt7cGFnZUhlaWdodH19XCIsIHBhZ2VTaXplLmhlaWdodCk7XHJcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHNyZXQpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4vL3NvcnQgdGhlIGdyb3VwIHdpdGggZ3JvdXBmaWVsZHNcclxuZnVuY3Rpb24gZ3JvdXBTb3J0KGdyb3VwLCBuYW1lLCBncm91cGZpZWxkcywgZ3JvdXBpZCA9IDApIHtcclxuXHR2YXIgcmV0ID0geyBlbnRyaWVzOiBbXSwgbmFtZTogbmFtZSB9O1xyXG5cdGlmIChncm91cGlkID4gMClcclxuXHRcdHJldFtcImdyb3VwZmllbGRcIl0gPSBncm91cGZpZWxkc1tncm91cGlkIC0gMV07XHJcblx0aWYgKEFycmF5LmlzQXJyYXkoZ3JvdXApKSB7XHJcblx0XHRncm91cC5mb3JFYWNoKChuZXUpID0+IHJldC5lbnRyaWVzLnB1c2gobmV1KSk7XHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHRmb3IgKHZhciBrZXkgaW4gZ3JvdXApIHtcclxuXHRcdFx0dmFyIG5ldSA9IGdyb3VwW2tleV07XHJcblx0XHRcdHJldC5lbnRyaWVzLnB1c2goZ3JvdXBTb3J0KG5ldSwga2V5LCBncm91cGZpZWxkcywgZ3JvdXBpZCArIDEpKTtcclxuXHRcdH1cclxuXHRcdHJldC5lbnRyaWVzID0gcmV0LmVudHJpZXMuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIHJldDtcclxufVxyXG4vKipcclxuICogZ3JvdXBzIGFuZCBzb3J0IHRoZSBlbnRyaWVzXHJcbiAqIEBwYXJhbSB7YW55W119IGVudHJpZXMgLSB0aGUgZW50cmllcyB0byBncm91cFxyXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBncm91cGZpZWxkcyAtIHRoZSBmaWVsZHMgd2hlcmUgdGhlIGVudHJpZXMgYXJlIGdyb3VwZWQgIFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGRvR3JvdXAoZW50cmllcywgZ3JvdXBmaWVsZHM6IHN0cmluZ1tdKSB7XHJcblx0dmFyIHJldDogYW55ID0ge307XHJcblx0Zm9yICh2YXIgZSA9IDA7IGUgPCBlbnRyaWVzLmxlbmd0aDsgZSsrKSB7XHJcblx0XHR2YXIgZW50cnkgPSBlbnRyaWVzW2VdO1xyXG5cdFx0bGV0IHBhcmVudCA9IHJldDtcclxuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgZ3JvdXBmaWVsZHMubGVuZ3RoOyB4KyspIHtcclxuXHRcdFx0dmFyIGdyb3VwbmFtZSA9IGVudHJ5W2dyb3VwZmllbGRzW3hdXTtcclxuXHRcdFx0aWYgKHggPCBncm91cGZpZWxkcy5sZW5ndGggLSAxKSB7Ly91bmRlcmdyb3VwcyBkb2VzIGV4aXN0c1xyXG5cdFx0XHRcdGlmICghcGFyZW50W2dyb3VwbmFtZV0pXHJcblx0XHRcdFx0XHRwYXJlbnRbZ3JvdXBuYW1lXSA9IHt9O1xyXG5cdFx0XHR9IGVsc2UgeyAvL2xhc3QgZ3JvdXAgY29udGFvbnMgdGhlIGRhdGFcclxuXHRcdFx0XHRpZiAoIXBhcmVudFtncm91cG5hbWVdKVxyXG5cdFx0XHRcdFx0cGFyZW50W2dyb3VwbmFtZV0gPSBbXTtcclxuXHRcdFx0XHRwYXJlbnRbZ3JvdXBuYW1lXS5wdXNoKGVudHJ5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwYXJlbnQgPSBwYXJlbnRbZ3JvdXBuYW1lXTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9zb3J0XHJcblx0dmFyIHNvcnRlZCA9IGdyb3VwU29ydChyZXQsIFwibWFpblwiLCBncm91cGZpZWxkcyk7XHJcblxyXG5cdHJldHVybiBzb3J0ZWQ7XHJcbn1cclxuLy9yZXBsYWNlIHRoZSBkYXRhdGFibGUge2RhdGFibGU6Li4ufSB0byB0YWJsZTp7fVxyXG5mdW5jdGlvbiByZXBsYWNlRGF0YXRhYmxlKGRlZiwgZGF0YSkge1xyXG5cdHZhciBoZWFkZXIgPSBkZWYuZGF0YXRhYmxlLmhlYWRlcjtcclxuXHR2YXIgZm9vdGVyID0gZGVmLmRhdGF0YWJsZS5mb290ZXI7XHJcblx0dmFyIGRhdGFleHByID0gZGVmLmRhdGF0YWJsZS5kYXRhZm9yZWFjaDtcclxuXHR2YXIgZ3JvdXBzID0gZGVmLmRhdGF0YWJsZS5ncm91cHM7XHJcblx0dmFyIGJvZHkgPSBkZWYuZGF0YXRhYmxlLmJvZHk7XHJcblx0dmFyIGdyb3VwZXhwcjogc3RyaW5nW10gPSBbXTtcclxuXHRkZWYudGFibGUgPSBjbG9uZShkZWYuZGF0YXRhYmxlKTtcclxuXHRkZWYudGFibGUuYm9keSA9IFtdXHJcblx0ZGVsZXRlIGRlZi50YWJsZS5oZWFkZXI7XHJcblx0ZGVsZXRlIGRlZi50YWJsZS5mb290ZXI7XHJcblx0ZGVsZXRlIGRlZi50YWJsZS5kYXRhZm9yZWFjaDtcclxuXHRkZWxldGUgZGVmLnRhYmxlLmdyb3VwcztcclxuXHJcblx0aWYgKGhlYWRlcilcclxuXHRcdGRlZi50YWJsZS5ib2R5LnB1c2goaGVhZGVyKTtcclxuXHRpZiAoZ3JvdXBzID09PSB1bmRlZmluZWQgfHwgZ3JvdXBzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaCh7XHJcblx0XHRcdGZvcmVhY2g6IGRhdGFleHByLFxyXG5cdFx0XHRkbzogYm9keVxyXG5cdFx0fSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBwYXJlbnQ6IGFueSA9IHt9O1xyXG5cdFx0dmFyIHRvYWRkID0ge1xyXG5cdFx0XHRmb3JlYWNoOiBcImdyb3VwMSBpbiBkYXRhdGFibGVncm91cHMuZW50cmllc1wiLFxyXG5cdFx0XHRkbzogcGFyZW50XHJcblx0XHR9XHJcblx0XHRkZWYudGFibGUuYm9keS5wdXNoKHRvYWRkKTtcclxuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgZ3JvdXBzLmxlbmd0aDsgeCsrKSB7XHJcblx0XHRcdGdyb3VwZXhwci5wdXNoKGdyb3Vwc1t4XS5leHByZXNzaW9uKTtcclxuXHRcdFx0aWYgKHggPCBncm91cHMubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdHBhcmVudC5mb3JlYWNoID0gXCJncm91cFwiICsgKHggKyAyKS50b1N0cmluZygpICsgXCIgaW4gZ3JvdXBcIiArICh4ICsgMSkudG9TdHJpbmcoKSArIFwiLmVudHJpZXNcIjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwYXJlbnQuZm9yZWFjaCA9IGRhdGFleHByLnNwbGl0KFwiIFwiKVswXSArIFwiIGluIGdyb3VwXCIgKyAoeCArIDEpLnRvU3RyaW5nKCkgKyBcIi5lbnRyaWVzXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGdyb3Vwc1t4XS5oZWFkZXIgJiYgZ3JvdXBzW3hdLmhlYWRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cGFyZW50LmRvZmlyc3QgPSBncm91cHNbeF0uaGVhZGVyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChncm91cHNbeF0uZm9vdGVyICYmIGdyb3Vwc1t4XS5mb290ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHBhcmVudC5kb2xhc3QgPSBncm91cHNbeF0uZm9vdGVyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh4IDwgZ3JvdXBzLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRwYXJlbnQuZG8gPSB7fTtcclxuXHRcdFx0XHRwYXJlbnQgPSBwYXJlbnQuZG87XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cGFyZW50LmRvID0gYm9keTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIGFyciA9IGdldEFycmF5RnJvbUZvckVhY2goZGVmLmRhdGF0YWJsZS5kYXRhZm9yZWFjaCwgZGF0YSk7XHJcblx0XHRkYXRhLmRhdGF0YWJsZWdyb3VwcyA9IGRvR3JvdXAoYXJyLCBncm91cGV4cHIpO1xyXG5cdH1cclxuXHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuZGF0YWZvcmVhY2g7XHJcblxyXG5cdGlmIChmb290ZXIpXHJcblx0XHRkZWYudGFibGUuYm9keS5wdXNoKGZvb3Rlcik7XHJcblx0Ly9kZWxldGUgZGF0YVt2YXJpYWJsZV07XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuaGVhZGVyO1xyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmZvb3RlcjtcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5mb3JlYWNoO1xyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmdyb3VwcztcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5ib2R5O1xyXG5cclxuXHRmb3IgKHZhciBrZXkgaW4gZGVmLmRhdGF0YWJsZSkge1xyXG5cdFx0ZGVmLnRhYmxlW2tleV0gPSBkZWYuZGF0YXRhYmxlW2tleV07XHJcblx0fVxyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlO1xyXG59XHJcblxyXG4vL2dldCB0aGUgYXJyYXkgZm9yIHRoZSBmb3JlYWNoIHN0YXRlbWVudCBpbiB0aGUgZGF0YVxyXG5mdW5jdGlvbiBnZXRBcnJheUZyb21Gb3JFYWNoKGZvcmVhY2gsIGRhdGEpIHtcclxuXHR2YXIgc2FyciA9IGZvcmVhY2guc3BsaXQoXCIgaW4gXCIpWzFdO1xyXG5cdHZhciBhcnI7XHJcblx0aWYgKHNhcnIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0YXJyID0gZGF0YT8uaXRlbXM7Ly93ZSBnZXQgdGhlIG1haW4gYXJyYXlcclxuXHR9IGVsc2Uge1xyXG5cdFx0YXJyID0gZ2V0VmFyKGRhdGEsIHNhcnIpO1xyXG5cdH1cclxuXHRyZXR1cm4gYXJyO1xyXG59XHJcbi8vcmVwbGFjZSB0ZW1wbGF0ZXMgZS5nLiAke25hbWV9IHdpdGggdGhlIGRhdGFcclxuZnVuY3Rpb24gcmVwbGFjZVRlbXBsYXRlcyhkZWYsIGRhdGEsIHBhcmFtID0gdW5kZWZpbmVkKSB7XHJcblx0aWYgKGRlZiA9PT0gdW5kZWZpbmVkKVxyXG5cdFx0cmV0dXJuO1xyXG5cdGlmIChkZWYuZGF0YXRhYmxlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdHJlcGxhY2VEYXRhdGFibGUoZGVmLCBkYXRhKTtcclxuXHJcblx0fVxyXG5cdGlmIChkZWYuZm9yZWFjaCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHQvL3Jlc29sdmUgZm9yZWFjaFxyXG5cdFx0Ly9cdHsgZm9yZWFjaDogXCJsaW5lIGluIGludm9pY2UubGluZXNcIiwgZG86IFsne3tsaW5lLnRleHR9fScsICd7e2xpbmUucHJpY2V9fScsICdPSz8nXVx0XHJcblx0XHRpZiAocGFyYW0/LnBhcmVudEFycmF5ID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0dGhyb3cgXCJmb3JlYWNoIGlzIG5vdCBzdXJvdW5kZWQgYnkgYW4gQXJyYXlcIjtcclxuXHRcdH1cclxuXHRcdHZhciB2YXJpYWJsZSA9IGRlZi5mb3JlYWNoLnNwbGl0KFwiIGluIFwiKVswXTtcclxuXHRcdHZhciBhcnI6IGFueVtdID0gZ2V0QXJyYXlGcm9tRm9yRWFjaChkZWYuZm9yZWFjaCwgZGF0YSk7XHJcblxyXG5cdFx0aWYgKHBhcmFtPy5wYXJlbnRBcnJheVBvcyA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHBhcmFtLnBhcmVudEFycmF5UG9zID0gcGFyYW0/LnBhcmVudEFycmF5LmluZGV4T2YoZGVmKTtcclxuXHRcdFx0cGFyYW0/LnBhcmVudEFycmF5LnNwbGljZShwYXJhbS5wYXJlbnRBcnJheVBvcywgMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgeCA9IDA7IHggPCBhcnIubGVuZ3RoOyB4KyspIHtcclxuXHRcdFx0ZGF0YVt2YXJpYWJsZV0gPSBhcnJbeF07XHJcblx0XHRcdGRlbGV0ZSBkZWYuZm9yZWFjaDtcclxuXHRcdFx0dmFyIGNvcHk7XHJcblx0XHRcdGlmIChkZWYuZG9maXJzdCAmJiB4ID09PSAwKSB7Ly9yZW5kZXIgb25seSBmb3JmaXJzdFxyXG5cdFx0XHRcdGNvcHkgPSBjbG9uZShkZWYuZG9maXJzdCk7XHJcblx0XHRcdFx0Y29weSA9IHJlcGxhY2VUZW1wbGF0ZXMoY29weSwgZGF0YSwgcGFyYW0pO1xyXG5cdFx0XHRcdGlmIChjb3B5ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRwYXJhbS5wYXJlbnRBcnJheS5zcGxpY2UocGFyYW0ucGFyZW50QXJyYXlQb3MrKywgMCwgY29weSk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGRlZi5kbylcclxuXHRcdFx0XHRjb3B5ID0gY2xvbmUoZGVmLmRvKTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGNvcHkgPSBjbG9uZShkZWYpO1xyXG5cclxuXHRcdFx0Y29weSA9IHJlcGxhY2VUZW1wbGF0ZXMoY29weSwgZGF0YSwgcGFyYW0pO1xyXG5cdFx0XHRpZiAoY29weSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdHBhcmFtLnBhcmVudEFycmF5LnNwbGljZShwYXJhbS5wYXJlbnRBcnJheVBvcysrLCAwLCBjb3B5KTtcclxuXHJcblx0XHRcdGlmIChkZWYuZG9sYXN0ICYmIHggPT09IGFyci5sZW5ndGggLSAxKSB7Ly9yZW5kZXIgb25seSBmb3JsYXN0XHJcblx0XHRcdFx0Y29weSA9IGNsb25lKGRlZi5kb2xhc3QpO1xyXG5cdFx0XHRcdGNvcHkgPSByZXBsYWNlVGVtcGxhdGVzKGNvcHksIGRhdGEsIHBhcmFtKTtcclxuXHRcdFx0XHRpZiAoY29weSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0cGFyYW0ucGFyZW50QXJyYXkuc3BsaWNlKHBhcmFtLnBhcmVudEFycmF5UG9zKyssIDAsIGNvcHkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRkZWxldGUgZGF0YVt2YXJpYWJsZV07XHJcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShkZWYpKSB7XHJcblx0XHRmb3IgKHZhciBhID0gMDsgYSA8IGRlZi5sZW5ndGg7IGErKykge1xyXG5cdFx0XHRpZiAoZGVmW2FdLmZvcmVhY2ggIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2FdLCBkYXRhLCB7IHBhcmVudEFycmF5OiBkZWYgfSk7XHJcblx0XHRcdFx0YS0tO1xyXG5cdFx0XHR9IGVsc2VcclxuXHRcdFx0XHRkZWZbYV0gPSByZXBsYWNlVGVtcGxhdGVzKGRlZlthXSwgZGF0YSwgeyBwYXJlbnRBcnJheTogZGVmIH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGRlZjtcclxuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWYgPT09IFwic3RyaW5nXCIpIHtcclxuXHRcdHZhciBlcmdlYm5pcyA9IGRlZi50b1N0cmluZygpLm1hdGNoKC9cXCRcXHsvZyk7XHJcblx0XHRpZiAoZXJnZWJuaXMgIT09IG51bGwpIHtcclxuXHRcdFx0ZGVmID0gZGVmLnJlcGxhY2VUZW1wbGF0ZShkYXRhKTtcclxuXHRcdFx0Ly9cdGZvciAodmFyIGUgPSAwOyBlIDwgZXJnZWJuaXMubGVuZ3RoOyBlKyspIHtcclxuXHRcdFx0Ly9cdFx0ZGVmID0gcmVwbGFjZShkZWYsIGRhdGEsIGVyZ2VibmlzW2VdLnN1YnN0cmluZygyLCBlcmdlYm5pc1tlXS5sZW5ndGggLSAyKSk7XHJcblx0XHRcdC8vXHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZGVmO1xyXG5cdH0gZWxzZSB7Ly9vYmplY3RcdFxyXG5cdFx0Zm9yICh2YXIga2V5IGluIGRlZikge1xyXG5cdFx0XHRkZWZba2V5XSA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2tleV0sIGRhdGEpO1xyXG5cclxuXHRcdH1cclxuXHRcdGRlbGV0ZSBkZWYuZWRpdFRvZ2V0aGVyOy8vUlRleHQgaXMgb25seSB1c2VkIGZvciBlZGl0aW5nIHJlcG9ydFxyXG5cdH1cclxuXHRyZXR1cm4gZGVmO1xyXG59XHJcblxyXG4vKipcclxuICogY3JlYXRlIGFuIHBkZm1ha2UtZGVmaW5pdGlvbiBmcm9tIGFuIGphc3NpanMtcmVwb3J0LWRlZmluaXRpb24sIGZpbGxzIGRhdGEgYW5kIHBhcmFtZXRlciBpbiB0aGUgcmVwb3J0XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZWZpbml0aW9uIC0gdGhlIGphc3NpanMtcmVwb3J0IGRlZmluaXRpb25cclxuICogQHBhcmFtIHthbnl9IFtkYXRhXSAtIHRoZSBkYXRhIHdoaWNoIGFyZSBmaWxsZWQgaW4gdGhlIHJlcG9ydCAob3B0aW9uYWwpXHJcbiAqIEBwYXJhbSB7YW55fSBbcGFyYW1ldGVyXSAtIHRoZSBwYXJhbWV0ZXIgd2hpY2ggYXJlIGZpbGxlZCBpbiB0aGUgcmVwb3J0IChvdGlvbmFsKVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlcG9ydERlZmluaXRpb24oZGVmaW5pdGlvbiwgZGF0YSwgcGFyYW1ldGVyKSB7XHJcblx0ZGVmaW5pdGlvbiA9IGNsb25lKGRlZmluaXRpb24pOy8vdGhpcyB3b3VsZCBiZSBtb2RpZmllZFxyXG5cdGlmIChkYXRhICE9PSB1bmRlZmluZWQpXHJcblx0XHRkYXRhID0gY2xvbmUoZGF0YSk7Ly90aGlzIHdvdWxkIGJlIG1vZGlmaWVkXHJcblxyXG5cdGlmIChkYXRhID09PSB1bmRlZmluZWQgJiYgZGVmaW5pdGlvbi5kYXRhICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdGRhdGEgPSBkZWZpbml0aW9uLmRhdGE7XHJcblx0fVxyXG5cdC8vcGFyYW1ldGVyIGNvdWxkIGJlIGluIGRhdGFcclxuXHRpZiAoZGF0YSAhPT0gdW5kZWZpbmVkICYmIGRhdGEucGFyYW1ldGVyICE9PSB1bmRlZmluZWQgJiYgcGFyYW1ldGVyICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcInBhcmFtZXRlciB3b3VsZCBvdmVycmlkZSBkYXRhLnBhcmFtZXRlclwiKTtcclxuXHR9XHJcblx0aWYgKEFycmF5LmlzQXJyYXkoZGF0YSkpIHtcclxuXHRcdGRhdGEgPSB7IGl0ZW1zOiBkYXRhIH07Ly9zbyB3ZSBjYW4gZG8gZGF0YS5wYXJhbWV0ZXJcclxuXHR9XHJcblx0aWYgKHBhcmFtZXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG5cdFx0ZGF0YS5wYXJhbWV0ZXIgPSBwYXJhbWV0ZXI7XHJcblx0fVxyXG5cdC8vcGFyYW1ldGVyIGNvdWxkIGJlIGluIGRlZmluaXRpb25cclxuXHRpZiAoZGF0YSAhPT0gdW5kZWZpbmVkICYmIGRhdGEucGFyYW1ldGVyICE9PSB1bmRlZmluZWQgJiYgZGVmaW5pdGlvbi5wYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiZGVmaW5pdGlvbi5wYXJhbWV0ZXIgd291bGQgb3ZlcnJpZGUgZGF0YS5wYXJhbWV0ZXJcIik7XHJcblx0fVxyXG5cdGlmIChkZWZpbml0aW9uLnBhcmFtZXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRkYXRhLnBhcmFtZXRlciA9IGRlZmluaXRpb24ucGFyYW1ldGVyO1xyXG5cdH1cclxuXHRkZWZpbml0aW9uLmNvbnRlbnQgPSByZXBsYWNlVGVtcGxhdGVzKGRlZmluaXRpb24uY29udGVudCwgZGF0YSk7XHJcblx0aWYgKGRlZmluaXRpb24uYmFja2dyb3VuZClcclxuXHRcdGRlZmluaXRpb24uYmFja2dyb3VuZCA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmaW5pdGlvbi5iYWNrZ3JvdW5kLCBkYXRhKTtcclxuXHRpZiAoZGVmaW5pdGlvbi5oZWFkZXIpXHJcblx0XHRkZWZpbml0aW9uLmhlYWRlciA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmaW5pdGlvbi5oZWFkZXIsIGRhdGEpO1xyXG5cdGlmIChkZWZpbml0aW9uLmZvb3RlcilcclxuXHRcdGRlZmluaXRpb24uZm9vdGVyID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZpbml0aW9uLmZvb3RlciwgZGF0YSk7XHJcblxyXG5cdHJlcGxhY2VQYWdlSW5mb3JtYXRpb24oZGVmaW5pdGlvbik7XHJcblx0ZGVsZXRlIGRlZmluaXRpb24uZGF0YTtcclxuXHRyZXR1cm4gZGVmaW5pdGlvbjtcclxuXHQvLyBkZWxldGUgZGVmaW5pdGlvbi5wYXJhbWV0ZXI7XHJcbn1cclxuXHJcbi8vYWRkIGFnZ3JlZ2F0ZSBmdW5jdGlvbnMgZm9yIGdyb3VwaW5nXHJcbmZ1bmN0aW9uIGFkZEdyb3VwRnVuY2lvbnMobmFtZXMsIHZhbHVlcykge1xyXG5cdG5hbWVzLnB1c2goXCJzdW1cIik7XHJcblx0dmFsdWVzLnB1c2goc3VtKTtcclxuXHRuYW1lcy5wdXNoKFwiY291bnRcIik7XHJcblx0dmFsdWVzLnB1c2goY291bnQpO1xyXG5cdG5hbWVzLnB1c2goXCJtYXhcIik7XHJcblx0dmFsdWVzLnB1c2gobWF4KTtcclxuXHRuYW1lcy5wdXNoKFwibWluXCIpO1xyXG5cdHZhbHVlcy5wdXNoKG1pbik7XHJcblx0bmFtZXMucHVzaChcImF2Z1wiKTtcclxuXHR2YWx1ZXMucHVzaChhdmcpO1xyXG59XHJcbmZ1bmN0aW9uIGFnZ3IoZ3JvdXAsIGZpZWxkLGRhdGEpIHtcclxuXHR2YXIgcmV0ID0gMDtcclxuXHRpZiAoIUFycmF5LmlzQXJyYXkoZ3JvdXApICYmIGdyb3VwLmVudHJpZXMgPT09IHVuZGVmaW5lZClcclxuXHRcdHRocm93IG5ldyBFcnJvcihcInN1bSBpcyB2YWxpZCBvbmx5IGluIGFycmF5cyBhbmQgZ3JvdXBzXCIpO1xyXG5cdHZhciBzZmllbGQ6IHN0cmluZyA9IGZpZWxkO1xyXG5cdGlmIChmaWVsZC5pbmRleE9mKFwiJHtcIikgPT09IC0xKSB7XHJcblx0XHRzZmllbGQgPSBcIiR7XCIgKyBzZmllbGQgKyBcIn1cIjtcclxuXHR9XHJcblx0aWYoQXJyYXkuaXNBcnJheShncm91cCkpe1xyXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBncm91cC5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHR2YXIgb2IgPSBncm91cFt4XTtcclxuXHRcdFx0aWYob2IuZW50cmllcyE9PXVuZGVmaW5lZClcclxuXHRcdFx0XHRhZ2dyKG9iLmVudHJpZXMsZmllbGQsZGF0YSk7XHJcblx0XHRcdGVsc2V7XHJcblx0XHRcdFx0dmFyIHZhbCA9IHNmaWVsZC5yZXBsYWNlVGVtcGxhdGUob2IsIHRydWUpO1xyXG5cdFx0XHRcdGRhdGEuZnVuYyhkYXRhLHZhbD09PXVuZGVmaW5lZD8wOiBOdW1iZXIucGFyc2VGbG9hdCh2YWwpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1lbHNle1xyXG5cdFx0YWdncihncm91cC5lbnRyaWVzLGZpZWxkLGRhdGEpOy8vZ3JvdXBcclxuXHR9IFxyXG5cdHJldHVybiBkYXRhO1xyXG59XHJcblxyXG4vL3N1bSB0aGUgZmllbGQgaW4gdGhlIGdyb3VwXHJcbmZ1bmN0aW9uIHN1bShncm91cCwgZmllbGQpIHtcclxuXHRyZXR1cm4gYWdncihncm91cCxmaWVsZCx7XHJcblx0XHRyZXQ6MCxcclxuXHRcdGZ1bmM6KGRhdGEsbnVtKT0+e1xyXG5cdFx0XHRkYXRhLnJldD1kYXRhLnJldCtudW07XHJcblx0XHR9XHJcblx0fSkucmV0O1xyXG59XHJcbi8vY291bnQgdGhlIGZpZWxkIGluIHRoZSBncm91cFxyXG5mdW5jdGlvbiBjb3VudChncm91cCwgZmllbGQpIHtcclxuXHRyZXR1cm4gYWdncihncm91cCxmaWVsZCx7XHJcblx0XHRyZXQ6MCxcclxuXHRcdGZ1bmM6KGRhdGEsbnVtKT0+e1xyXG5cdFx0XHRkYXRhLnJldD1kYXRhLnJldCsxO1xyXG5cdFx0fVxyXG5cdH0pLnJldDtcclxufVxyXG4vL2dldCB0aGUgbWF4aW11bSBvZiB0aGUgZmllbGQgaW4gdGhlIGdyb3VwXHJcbmZ1bmN0aW9uIG1heChncm91cCwgZmllbGQpIHtcclxuXHRyZXR1cm4gYWdncihncm91cCxmaWVsZCx7XHJcblx0XHRyZXQ6TnVtYmVyLk1JTl9WQUxVRSxcclxuXHRcdGZ1bmM6KGRhdGEsbnVtKT0+e1xyXG5cdFx0XHRpZihudW0+ZGF0YS5yZXQpXHJcblx0XHRcdFx0ZGF0YS5yZXQ9bnVtO1xyXG5cdFx0fVxyXG5cdH0pLnJldDtcclxufVxyXG4vL2dldCB0aGUgbWluaW11bSBvZiB0aGUgZmllbGQgaW4gdGhlIGdyb3VwXHJcbmZ1bmN0aW9uIG1pbihncm91cCwgZmllbGQpIHtcclxuXHRyZXR1cm4gYWdncihncm91cCxmaWVsZCx7XHJcblx0XHRyZXQ6TnVtYmVyLk1BWF9WQUxVRSxcclxuXHRcdGZ1bmM6KGRhdGEsbnVtKT0+e1xyXG5cdFx0XHRpZihudW08ZGF0YS5yZXQpXHJcblx0XHRcdFx0ZGF0YS5yZXQ9bnVtO1xyXG5cdFx0fVxyXG5cdH0pLnJldDtcclxufVxyXG4vL2dldCB0aGUgbWluaW11bSBvZiB0aGUgZmllbGQgaW4gdGhlIGdyb3VwXHJcbmZ1bmN0aW9uIGF2Zyhncm91cCwgZmllbGQpIHtcclxuXHR2YXIgcmV0PSBhZ2dyKGdyb3VwLGZpZWxkLHtcclxuXHRcdHJldDowLFxyXG5cdFx0Y291bnQ6MCxcclxuXHRcdGZ1bmM6KGRhdGEsbnVtKT0+e1xyXG5cdFx0XHRkYXRhLnJldD1kYXRhLnJldCtudW07XHJcblx0XHRcdGRhdGEuY291bnQrKztcclxuXHJcblx0XHR9XHJcblx0fSk7XHJcblx0cmV0dXJuIHJldC5yZXQvcmV0LmNvdW50O1xyXG59XHJcbnZhciBzYW1wbGVEYXRhID0gW1xyXG5cdHsgaWQ6IDEsIGN1c3RvbWVyOiBcIkZyZWRcIiwgY2l0eTogXCJGcmFua2Z1cnRcIiwgYWdlOiA1MSB9LFxyXG5cdHsgaWQ6IDgsIGN1c3RvbWVyOiBcIkFsbWFcIiwgY2l0eTogXCJEcmVzZGVuXCIsIGFnZTogNzAgfSxcclxuXHR7IGlkOiAzLCBjdXN0b21lcjogXCJIZWluelwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDMzIH0sXHJcblx0eyBpZDogMiwgY3VzdG9tZXI6IFwiRnJlZFwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDg4IH0sXHJcblx0eyBpZDogNiwgY3VzdG9tZXI6IFwiTWF4XCIsIGNpdHk6IFwiRHJlc2RlblwiLCBhZ2U6IDMgfSxcclxuXHR7IGlkOiA0LCBjdXN0b21lcjogXCJIZWluelwiLCBjaXR5OiBcIkZyYW5rZnVydFwiLCBhZ2U6IDY0IH0sXHJcblx0eyBpZDogNSwgY3VzdG9tZXI6IFwiTWF4XCIsIGNpdHk6IFwiRHJlc2RlblwiLCBhZ2U6IDU0IH0sXHJcblx0eyBpZDogNywgY3VzdG9tZXI6IFwiQWxtYVwiLCBjaXR5OiBcIkRyZXNkZW5cIiwgYWdlOiAzMyB9LFxyXG5cdHsgaWQ6IDksIGN1c3RvbWVyOiBcIk90dG9cIiwgY2l0eTogXCJCZXJsaW5cIiwgYWdlOiAyMSB9XHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuXHR2YXIgaCA9IHtcclxuXHRcdGFsbDogZG9Hcm91cChzYW1wbGVEYXRhLCBbXCJjaXR5XCIsXCJjdXN0b21lclwiXSksXHJcblx0XHRrOiA1LFxyXG5cdFx0aG8oKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmsgKyAxO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvL0B0cy1pZ25vcmVcclxuXHR2YXIgcyA9IFwiJHtNYXRoLnJvdW5kKGF2ZyhhbGwsJ2FnZScpLDIpfVwiLnJlcGxhY2VUZW1wbGF0ZShoLCB0cnVlKTtcclxuXHRjb25zb2xlLmxvZyhzKTtcclxuXHRcclxufVxyXG4iXX0=