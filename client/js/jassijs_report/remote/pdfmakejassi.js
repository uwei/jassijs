define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createReportDefinition = exports.doGroup = void 0;
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
    /*function replace(str, data, member) {
        var ob = getVar(data, member);
        return str.split("{{" + member + "}}").join(ob);
    }*/
    function getVar(data, member) {
        var ergebnis = member.toString().match(/\$\{(\w||\.)*\}/g);
        if (!ergebnis)
            member = "${" + member + "}";
        var ob = member.replaceTemplate(data, true);
        /*	var names = member.split(".");
            var ob = data[names[0]];
            for (let x = 1; x < names.length; x++) {
        
                if (ob === undefined)
                    return undefined;
                ob = ob[names[x]];
            }*/
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
        /*var variable = dataexpr.split(" in ")[0];
        var sarr = dataexpr.split(" in ")[1];
        var arr = getVar(data, sarr);
        
        for (let x = 0;x < arr.length;x++) {
            data[variable] = arr[x];
            var copy = JSON.parse(JSON.stringify(body));//deep copy
            copy = replaceTemplates(copy, data);
            def.table.body.push(copy);
        }*/
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
        /*header:[{ text:"Item"},{ text:"Price"}],
                        data:"line in invoice.lines",
                        //footer:[{ text:"Total"},{ text:""}],
                        body:[{ text:"Text"},{ text:"price"}],
                        groups:*/
    }
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
            var ergebnis = def.toString().match(/\$\{(\w||\.)*\}/g);
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
            delete def.editTogether; //RText
        }
        return def;
    }
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
        //definition.content = replaceTemplates(definition.content, data);
        replacePageInformation(definition);
        delete definition.data;
        return definition;
        // delete definition.parameter;
    }
    exports.createReportDefinition = createReportDefinition;
    var funccache = {};
    function addGroupFuncions(names, values) {
        names.push("sum");
        values.push(sum);
    }
    function sum(group, field) {
        return group + field;
    }
    function test() {
        var h = {
            k: 5,
            ho() {
                return this.k + 1;
            }
        };
        //@ts-ignore
        var s = "${sum(8,9)}".replaceTemplate(h, true);
        h.k = 60;
        s = "${ho()}".replaceTemplate(h, true);
        console.log(s + 2);
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmbWFrZWphc3NpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvcmVtb3RlL3BkZm1ha2VqYXNzaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQ0EsU0FBUyxLQUFLLENBQUMsR0FBRztRQUNqQixJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxlQUFlLElBQUksR0FBRztZQUN0RSxPQUFPLEdBQUcsQ0FBQztRQUVaLElBQUksR0FBRyxZQUFZLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO1lBQ2pELElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1COztZQUVyRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFOUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7WUFDcEIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM1QjtTQUNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBUUQsWUFBWTtJQUNaLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxHQUFHLFVBQVUsTUFBTSxFQUFFLFlBQVk7UUFDaEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1B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Z0IsSUFBSTtRQUNuQixJQUFJLENBQUMsR0FBRztZQUNQLENBQUMsRUFBRSxDQUFDO1lBQ0osRUFBRTtnQkFDRCxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLENBQUM7U0FDRCxDQUFBO1FBQ0QsWUFBWTtRQUNaLElBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1QsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFaRCxvQkFZQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5mdW5jdGlvbiBjbG9uZShvYmopIHtcclxuXHRpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiAob2JqKSAhPT0gJ29iamVjdCcgfHwgJ2lzQWN0aXZlQ2xvbmUnIGluIG9iailcclxuXHRcdHJldHVybiBvYmo7XHJcblxyXG5cdGlmIChvYmogaW5zdGFuY2VvZiBEYXRlIHx8IHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpXHJcblx0XHR2YXIgdGVtcCA9IG5ldyBvYmouY29uc3RydWN0b3IoKTsgLy9vciBuZXcgRGF0ZShvYmopO1xyXG5cdGVsc2VcclxuXHRcdHZhciB0ZW1wID0gb2JqLmNvbnN0cnVjdG9yKCk7XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XHJcblx0XHRcdG9ialsnaXNBY3RpdmVDbG9uZSddID0gbnVsbDtcclxuXHRcdFx0dGVtcFtrZXldID0gY2xvbmUob2JqW2tleV0pO1xyXG5cdFx0XHRkZWxldGUgb2JqWydpc0FjdGl2ZUNsb25lJ107XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0ZW1wO1xyXG59XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcblx0aW50ZXJmYWNlIFN0cmluZyB7XHJcblx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdHJlcGxhY2VUZW1wbGF0ZTogYW55O1xyXG5cdH1cclxufVxyXG4vL0B0cy1pZ25vcmVcclxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlVGVtcGxhdGUgPSBmdW5jdGlvbiAocGFyYW1zLCByZXR1cm5WYWx1ZXMpIHtcclxuXHRjb25zdCBuYW1lcyA9IE9iamVjdC5rZXlzKHBhcmFtcyk7XHJcblx0Y29uc3QgdmFscyA9IE9iamVjdC52YWx1ZXMocGFyYW1zKTtcclxuXHRhZGRHcm91cEZ1bmNpb25zKG5hbWVzLHZhbHMpO1xyXG5cdGZvciAobGV0IHggPSAwOyB4IDwgdmFscy5sZW5ndGg7IHgrKykge1xyXG5cdFx0aWYgKHR5cGVvZiB2YWxzW3hdID09PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0dmFsc1t4XSA9ICg8YW55PnZhbHNbeF0pLmJpbmQocGFyYW1zKTtcclxuXHRcdH1cclxuXHR9XHJcblx0bGV0IHN0YWcgPSBcIlwiO1xyXG5cdGlmIChyZXR1cm5WYWx1ZXMpIHtcclxuXHRcdG5hbWVzLnB1c2goXCJ0YWdcIik7XHJcblx0XHRzdGFnID0gXCJ0YWdcIjtcclxuXHRcdHZhbHMucHVzaChmdW5jdGlvbiB0YWcoc3RyaW5ncywgdmFsdWVzKSB7XHJcblx0XHRcdHJldHVybiB2YWx1ZXM7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmFyIGZ1bmMgPSBmdW5jY2FjaGVbbmFtZXMuam9pbihcIixcIikgKyB0aGlzXTtcclxuXHRpZiAoZnVuYyA9PT0gdW5kZWZpbmVkKSB7Ly9jcmVhdGUgZnVuY3Rpb25zIGlzIHNsb3cgc28gY2FjaGVcclxuXHRcdGZ1bmMgPSBuZXcgRnVuY3Rpb24oLi4ubmFtZXMsIGByZXR1cm4gJHtzdGFnfVxcYCR7dGhpc31cXGA7YCk7XHJcblx0XHRmdW5jY2FjaGVbbmFtZXMuam9pbihcIixcIikgKyB0aGlzXSA9IGZ1bmM7XHJcblx0fVxyXG5cdHJldHVybiBmdW5jKC4uLnZhbHMpO1xyXG59XHJcbi8qZnVuY3Rpb24gcmVwbGFjZShzdHIsIGRhdGEsIG1lbWJlcikge1xyXG5cdHZhciBvYiA9IGdldFZhcihkYXRhLCBtZW1iZXIpO1xyXG5cdHJldHVybiBzdHIuc3BsaXQoXCJ7e1wiICsgbWVtYmVyICsgXCJ9fVwiKS5qb2luKG9iKTtcclxufSovXHJcbmZ1bmN0aW9uIGdldFZhcihkYXRhLCBtZW1iZXI6IHN0cmluZykge1xyXG5cdHZhciBlcmdlYm5pcyA9IG1lbWJlci50b1N0cmluZygpLm1hdGNoKC9cXCRcXHsoXFx3fHxcXC4pKlxcfS9nKTtcclxuXHRpZiAoIWVyZ2VibmlzKVxyXG5cdFx0bWVtYmVyID0gXCIke1wiICsgbWVtYmVyICsgXCJ9XCI7XHJcblx0dmFyIG9iID0gbWVtYmVyLnJlcGxhY2VUZW1wbGF0ZShkYXRhLCB0cnVlKTtcclxuXHQvKlx0dmFyIG5hbWVzID0gbWVtYmVyLnNwbGl0KFwiLlwiKTtcclxuXHRcdHZhciBvYiA9IGRhdGFbbmFtZXNbMF1dO1xyXG5cdFx0Zm9yIChsZXQgeCA9IDE7IHggPCBuYW1lcy5sZW5ndGg7IHgrKykge1xyXG5cdFxyXG5cdFx0XHRpZiAob2IgPT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0XHRvYiA9IG9iW25hbWVzW3hdXTtcclxuXHRcdH0qL1xyXG5cdHJldHVybiBvYjtcclxufVxyXG4vL3JlcGxhY2Uge3tjdXJyZW50UGFnZX19IHt7cGFnZVdpZHRofX0ge3twYWdlSGVpZ2h0fX0ge3twYWdlQ291bnR9fSBpbiBoZWFkZXIsZm9vdGVyLCBiYWNrZ3JvdW5kXHJcbmZ1bmN0aW9uIHJlcGxhY2VQYWdlSW5mb3JtYXRpb24oZGVmKSB7XHJcblxyXG5cdGlmIChkZWYuYmFja2dyb3VuZCAmJiB0eXBlb2YgZGVmLmJhY2tncm91bmQgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0bGV0IGQgPSBKU09OLnN0cmluZ2lmeShkZWYuYmFja2dyb3VuZCk7XHJcblx0XHRkZWYuYmFja2dyb3VuZCA9IGZ1bmN0aW9uIChjdXJyZW50UGFnZSwgcGFnZVNpemUpIHtcclxuXHRcdFx0bGV0IHNyZXQgPSBkLnJlcGxhY2VBbGwoXCJ7e2N1cnJlbnRQYWdlfX1cIiwgY3VycmVudFBhZ2UpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlV2lkdGh9fVwiLCBwYWdlU2l6ZS53aWR0aCk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VIZWlnaHR9fVwiLCBwYWdlU2l6ZS5oZWlnaHQpO1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShzcmV0KTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKGRlZi5oZWFkZXIgJiYgdHlwZW9mIGRlZi5oZWFkZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0bGV0IGQgPSBKU09OLnN0cmluZ2lmeShkZWYuaGVhZGVyKTtcclxuXHRcdGRlZi5oZWFkZXIgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VDb3VudCkge1xyXG5cdFx0XHRsZXQgc3JldCA9IGQucmVwbGFjZUFsbChcInt7Y3VycmVudFBhZ2V9fVwiLCBjdXJyZW50UGFnZSk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VDb3VudH19XCIsIHBhZ2VDb3VudCk7XHJcblx0XHRcdHJldHVybiBKU09OLnBhcnNlKHNyZXQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoZGVmLmZvb3RlciAmJiB0eXBlb2YgZGVmLmZvb3RlciAhPT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRsZXQgZCA9IEpTT04uc3RyaW5naWZ5KGRlZi5mb290ZXIpO1xyXG5cclxuXHRcdGRlZi5mb290ZXIgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VDb3VudCwgcGFnZVNpemUpIHtcclxuXHRcdFx0bGV0IHNyZXQgPSBkLnJlcGxhY2VBbGwoXCJ7e2N1cnJlbnRQYWdlfX1cIiwgY3VycmVudFBhZ2UpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlQ291bnR9fVwiLCBwYWdlQ291bnQpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlV2lkdGh9fVwiLCBwYWdlU2l6ZS53aWR0aCk7XHJcblx0XHRcdHNyZXQgPSBzcmV0LnJlcGxhY2VBbGwoXCJ7e3BhZ2VIZWlnaHR9fVwiLCBwYWdlU2l6ZS5oZWlnaHQpO1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShzcmV0KTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuZnVuY3Rpb24gZ3JvdXBTb3J0KGdyb3VwLCBuYW1lLCBncm91cGZpZWxkcywgZ3JvdXBpZCA9IDApIHtcclxuXHR2YXIgcmV0ID0geyBlbnRyaWVzOiBbXSwgbmFtZTogbmFtZSB9O1xyXG5cdGlmIChncm91cGlkID4gMClcclxuXHRcdHJldFtcImdyb3VwZmllbGRcIl0gPSBncm91cGZpZWxkc1tncm91cGlkIC0gMV07XHJcblx0aWYgKEFycmF5LmlzQXJyYXkoZ3JvdXApKSB7XHJcblx0XHRncm91cC5mb3JFYWNoKChuZXUpID0+IHJldC5lbnRyaWVzLnB1c2gobmV1KSk7XHJcblxyXG5cdH0gZWxzZSB7XHJcblx0XHRmb3IgKHZhciBrZXkgaW4gZ3JvdXApIHtcclxuXHRcdFx0dmFyIG5ldSA9IGdyb3VwW2tleV07XHJcblx0XHRcdHJldC5lbnRyaWVzLnB1c2goZ3JvdXBTb3J0KG5ldSwga2V5LCBncm91cGZpZWxkcywgZ3JvdXBpZCArIDEpKTtcclxuXHRcdH1cclxuXHRcdHJldC5lbnRyaWVzID0gcmV0LmVudHJpZXMuc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRyZXR1cm4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblx0cmV0dXJuIHJldDtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZG9Hcm91cChlbnRyaWVzLCBncm91cGZpZWxkczogc3RyaW5nW10pIHtcclxuXHR2YXIgcmV0OiBhbnkgPSB7fTtcclxuXHRmb3IgKHZhciBlID0gMDsgZSA8IGVudHJpZXMubGVuZ3RoOyBlKyspIHtcclxuXHRcdHZhciBlbnRyeSA9IGVudHJpZXNbZV07XHJcblx0XHRsZXQgcGFyZW50ID0gcmV0O1xyXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBncm91cGZpZWxkcy5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHR2YXIgZ3JvdXBuYW1lID0gZW50cnlbZ3JvdXBmaWVsZHNbeF1dO1xyXG5cdFx0XHRpZiAoeCA8IGdyb3VwZmllbGRzLmxlbmd0aCAtIDEpIHsvL3VuZGVyZ3JvdXBzIGRvZXMgZXhpc3RzXHJcblx0XHRcdFx0aWYgKCFwYXJlbnRbZ3JvdXBuYW1lXSlcclxuXHRcdFx0XHRcdHBhcmVudFtncm91cG5hbWVdID0ge307XHJcblx0XHRcdH0gZWxzZSB7IC8vbGFzdCBncm91cCBjb250YW9ucyB0aGUgZGF0YVxyXG5cdFx0XHRcdGlmICghcGFyZW50W2dyb3VwbmFtZV0pXHJcblx0XHRcdFx0XHRwYXJlbnRbZ3JvdXBuYW1lXSA9IFtdO1xyXG5cdFx0XHRcdHBhcmVudFtncm91cG5hbWVdLnB1c2goZW50cnkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHBhcmVudCA9IHBhcmVudFtncm91cG5hbWVdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvL3NvcnRcclxuXHR2YXIgc29ydGVkID0gZ3JvdXBTb3J0KHJldCwgXCJtYWluXCIsIGdyb3VwZmllbGRzKTtcclxuXHJcblx0cmV0dXJuIHNvcnRlZDtcclxufVxyXG5mdW5jdGlvbiByZXBsYWNlRGF0YXRhYmxlKGRlZiwgZGF0YSkge1xyXG5cclxuXHR2YXIgaGVhZGVyID0gZGVmLmRhdGF0YWJsZS5oZWFkZXI7XHJcblx0dmFyIGZvb3RlciA9IGRlZi5kYXRhdGFibGUuZm9vdGVyO1xyXG5cdHZhciBkYXRhZXhwciA9IGRlZi5kYXRhdGFibGUuZGF0YWZvcmVhY2g7XHJcblx0dmFyIGdyb3VwcyA9IGRlZi5kYXRhdGFibGUuZ3JvdXBzO1xyXG5cdHZhciBib2R5ID0gZGVmLmRhdGF0YWJsZS5ib2R5O1xyXG5cdHZhciBncm91cGV4cHI6IHN0cmluZ1tdID0gW107XHJcblx0ZGVmLnRhYmxlID1jbG9uZShkZWYuZGF0YXRhYmxlKTtcclxuXHRkZWYudGFibGUuYm9keT0gW11cclxuXHRkZWxldGUgZGVmLnRhYmxlLmhlYWRlcjtcclxuXHRkZWxldGUgZGVmLnRhYmxlLmZvb3RlcjtcclxuXHRkZWxldGUgZGVmLnRhYmxlLmRhdGFmb3JlYWNoO1xyXG5cdGRlbGV0ZSBkZWYudGFibGUuZ3JvdXBzO1xyXG5cdFxyXG5cdGlmIChoZWFkZXIpXHJcblx0XHRkZWYudGFibGUuYm9keS5wdXNoKGhlYWRlcik7XHJcblx0aWYgKGdyb3VwcyA9PT0gdW5kZWZpbmVkIHx8IGdyb3Vwcy5sZW5ndGggPT09IDApIHtcclxuXHRcdGRlZi50YWJsZS5ib2R5LnB1c2goe1xyXG5cdFx0XHRmb3JlYWNoOiBkYXRhZXhwcixcclxuXHRcdFx0ZG86IGJvZHlcclxuXHRcdH0pO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgcGFyZW50OiBhbnkgPSB7fTtcclxuXHRcdHZhciB0b2FkZCA9IHtcclxuXHRcdFx0Zm9yZWFjaDogXCJncm91cDEgaW4gZGF0YXRhYmxlZ3JvdXBzLmVudHJpZXNcIixcclxuXHRcdFx0ZG86IHBhcmVudFxyXG5cdFx0fVxyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaCh0b2FkZCk7XHJcblx0XHRmb3IgKHZhciB4ID0gMDsgeCA8IGdyb3Vwcy5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHRncm91cGV4cHIucHVzaChncm91cHNbeF0uZXhwcmVzc2lvbik7XHJcblx0XHRcdGlmICh4IDwgZ3JvdXBzLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRwYXJlbnQuZm9yZWFjaCA9IFwiZ3JvdXBcIiArICh4ICsgMikudG9TdHJpbmcoKSArIFwiIGluIGdyb3VwXCIgKyAoeCArIDEpLnRvU3RyaW5nKCkgKyBcIi5lbnRyaWVzXCI7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdHBhcmVudC5mb3JlYWNoID0gZGF0YWV4cHIuc3BsaXQoXCIgXCIpWzBdICsgXCIgaW4gZ3JvdXBcIiArICh4ICsgMSkudG9TdHJpbmcoKSArIFwiLmVudHJpZXNcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZ3JvdXBzW3hdLmhlYWRlciAmJiBncm91cHNbeF0uaGVhZGVyLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0XHRwYXJlbnQuZG9maXJzdCA9IGdyb3Vwc1t4XS5oZWFkZXI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGdyb3Vwc1t4XS5mb290ZXIgJiYgZ3JvdXBzW3hdLmZvb3Rlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cGFyZW50LmRvbGFzdCA9IGdyb3Vwc1t4XS5mb290ZXI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHggPCBncm91cHMubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdHBhcmVudC5kbz17fTtcclxuXHRcdFx0XHRwYXJlbnQ9cGFyZW50LmRvO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwYXJlbnQuZG89Ym9keTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIGFyciA9IGdldEFycmF5RnJvbUZvckVhY2goZGVmLmRhdGF0YWJsZS5kYXRhZm9yZWFjaCwgZGF0YSk7XHJcblx0XHRkYXRhLmRhdGF0YWJsZWdyb3VwcyA9IGRvR3JvdXAoYXJyLCBncm91cGV4cHIpO1xyXG5cdH1cclxuXHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuZGF0YWZvcmVhY2g7XHJcblxyXG5cdC8qdmFyIHZhcmlhYmxlID0gZGF0YWV4cHIuc3BsaXQoXCIgaW4gXCIpWzBdO1xyXG5cdHZhciBzYXJyID0gZGF0YWV4cHIuc3BsaXQoXCIgaW4gXCIpWzFdO1xyXG5cdHZhciBhcnIgPSBnZXRWYXIoZGF0YSwgc2Fycik7XHJcblx0XHJcblx0Zm9yIChsZXQgeCA9IDA7eCA8IGFyci5sZW5ndGg7eCsrKSB7XHJcblx0XHRkYXRhW3ZhcmlhYmxlXSA9IGFyclt4XTtcclxuXHRcdHZhciBjb3B5ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShib2R5KSk7Ly9kZWVwIGNvcHlcclxuXHRcdGNvcHkgPSByZXBsYWNlVGVtcGxhdGVzKGNvcHksIGRhdGEpO1xyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaChjb3B5KTtcclxuXHR9Ki9cclxuXHRpZiAoZm9vdGVyKVxyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaChmb290ZXIpO1xyXG5cdC8vZGVsZXRlIGRhdGFbdmFyaWFibGVdO1xyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmhlYWRlcjtcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5mb290ZXI7XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuZm9yZWFjaDtcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5ncm91cHM7XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuYm9keTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIGRlZi5kYXRhdGFibGUpIHtcclxuXHRcdGRlZi50YWJsZVtrZXldID0gZGVmLmRhdGF0YWJsZVtrZXldO1xyXG5cdH1cclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZTtcclxuXHQvKmhlYWRlcjpbeyB0ZXh0OlwiSXRlbVwifSx7IHRleHQ6XCJQcmljZVwifV0sXHJcblx0XHRcdFx0XHRkYXRhOlwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsXHJcblx0XHRcdFx0XHQvL2Zvb3RlcjpbeyB0ZXh0OlwiVG90YWxcIn0seyB0ZXh0OlwiXCJ9XSxcclxuXHRcdFx0XHRcdGJvZHk6W3sgdGV4dDpcIlRleHRcIn0seyB0ZXh0OlwicHJpY2VcIn1dLFxyXG5cdFx0XHRcdFx0Z3JvdXBzOiovXHJcblxyXG5cclxufVxyXG5mdW5jdGlvbiBnZXRBcnJheUZyb21Gb3JFYWNoKGZvcmVhY2gsIGRhdGEpIHtcclxuXHR2YXIgc2FyciA9IGZvcmVhY2guc3BsaXQoXCIgaW4gXCIpWzFdO1xyXG5cdHZhciBhcnI7XHJcblx0aWYgKHNhcnIgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0YXJyID0gZGF0YT8uaXRlbXM7Ly93ZSBnZXQgdGhlIG1haW4gYXJyYXlcclxuXHR9IGVsc2Uge1xyXG5cdFx0YXJyID0gZ2V0VmFyKGRhdGEsIHNhcnIpO1xyXG5cdH1cclxuXHRyZXR1cm4gYXJyO1xyXG59XHJcbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZXMoZGVmLCBkYXRhLCBwYXJhbSA9IHVuZGVmaW5lZCkge1xyXG5cdGlmIChkZWYgPT09IHVuZGVmaW5lZClcclxuXHRcdHJldHVybjtcclxuXHRpZiAoZGVmLmRhdGF0YWJsZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRyZXBsYWNlRGF0YXRhYmxlKGRlZiwgZGF0YSk7XHJcblxyXG5cdH1cclxuXHRpZiAoZGVmLmZvcmVhY2ggIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0Ly9yZXNvbHZlIGZvcmVhY2hcclxuXHRcdC8vXHR7IGZvcmVhY2g6IFwibGluZSBpbiBpbnZvaWNlLmxpbmVzXCIsIGRvOiBbJ3t7bGluZS50ZXh0fX0nLCAne3tsaW5lLnByaWNlfX0nLCAnT0s/J11cdFxyXG5cdFx0aWYgKHBhcmFtPy5wYXJlbnRBcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdHRocm93IFwiZm9yZWFjaCBpcyBub3Qgc3Vyb3VuZGVkIGJ5IGFuIEFycmF5XCI7XHJcblx0XHR9XHJcblx0XHR2YXIgdmFyaWFibGUgPSBkZWYuZm9yZWFjaC5zcGxpdChcIiBpbiBcIilbMF07XHJcblx0XHR2YXIgYXJyOiBhbnlbXSA9IGdldEFycmF5RnJvbUZvckVhY2goZGVmLmZvcmVhY2gsIGRhdGEpO1xyXG5cclxuXHRcdGlmIChwYXJhbT8ucGFyZW50QXJyYXlQb3MgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRwYXJhbS5wYXJlbnRBcnJheVBvcyA9IHBhcmFtPy5wYXJlbnRBcnJheS5pbmRleE9mKGRlZik7XHJcblx0XHRcdHBhcmFtPy5wYXJlbnRBcnJheS5zcGxpY2UocGFyYW0ucGFyZW50QXJyYXlQb3MsIDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgYXJyLmxlbmd0aDsgeCsrKSB7XHJcblx0XHRcdGRhdGFbdmFyaWFibGVdID0gYXJyW3hdO1xyXG5cdFx0XHRkZWxldGUgZGVmLmZvcmVhY2g7XHJcblx0XHRcdHZhciBjb3B5O1xyXG5cdFx0XHRpZiAoZGVmLmRvZmlyc3QgJiYgeCA9PT0gMCkgey8vcmVuZGVyIG9ubHkgZm9yZmlyc3RcclxuXHRcdFx0XHRjb3B5ID0gY2xvbmUoZGVmLmRvZmlyc3QpO1xyXG5cdFx0XHRcdGNvcHkgPSByZXBsYWNlVGVtcGxhdGVzKGNvcHksIGRhdGEsIHBhcmFtKTtcclxuXHRcdFx0XHRpZiAoY29weSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0XHRcdFx0cGFyYW0ucGFyZW50QXJyYXkuc3BsaWNlKHBhcmFtLnBhcmVudEFycmF5UG9zKyssIDAsIGNvcHkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChkZWYuZG8pXHJcblx0XHRcdFx0Y29weSA9IGNsb25lKGRlZi5kbyk7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRjb3B5ID0gY2xvbmUoZGVmKTtcclxuXHJcblx0XHRcdGNvcHkgPSByZXBsYWNlVGVtcGxhdGVzKGNvcHksIGRhdGEsIHBhcmFtKTtcclxuXHRcdFx0aWYgKGNvcHkgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRwYXJhbS5wYXJlbnRBcnJheS5zcGxpY2UocGFyYW0ucGFyZW50QXJyYXlQb3MrKywgMCwgY29weSk7XHJcblxyXG5cdFx0XHRpZiAoZGVmLmRvbGFzdCAmJiB4ID09PSBhcnIubGVuZ3RoIC0gMSkgey8vcmVuZGVyIG9ubHkgZm9ybGFzdFxyXG5cdFx0XHRcdGNvcHkgPSBjbG9uZShkZWYuZG9sYXN0KTtcclxuXHRcdFx0XHRjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhLCBwYXJhbSk7XHJcblx0XHRcdFx0aWYgKGNvcHkgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdHBhcmFtLnBhcmVudEFycmF5LnNwbGljZShwYXJhbS5wYXJlbnRBcnJheVBvcysrLCAwLCBjb3B5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZGVsZXRlIGRhdGFbdmFyaWFibGVdO1xyXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZGVmKSkge1xyXG5cdFx0Zm9yICh2YXIgYSA9IDA7IGEgPCBkZWYubGVuZ3RoOyBhKyspIHtcclxuXHRcdFx0aWYgKGRlZlthXS5mb3JlYWNoICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRyZXBsYWNlVGVtcGxhdGVzKGRlZlthXSwgZGF0YSwgeyBwYXJlbnRBcnJheTogZGVmIH0pO1xyXG5cdFx0XHRcdGEtLTtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdFx0ZGVmW2FdID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZbYV0sIGRhdGEsIHsgcGFyZW50QXJyYXk6IGRlZiB9KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBkZWY7XHJcblx0fSBlbHNlIGlmICh0eXBlb2YgZGVmID09PSBcInN0cmluZ1wiKSB7XHJcblx0XHR2YXIgZXJnZWJuaXMgPSBkZWYudG9TdHJpbmcoKS5tYXRjaCgvXFwkXFx7KFxcd3x8XFwuKSpcXH0vZyk7XHJcblx0XHRpZiAoZXJnZWJuaXMgIT09IG51bGwpIHtcclxuXHRcdFx0ZGVmID0gZGVmLnJlcGxhY2VUZW1wbGF0ZShkYXRhKTtcclxuXHRcdFx0Ly9cdGZvciAodmFyIGUgPSAwOyBlIDwgZXJnZWJuaXMubGVuZ3RoOyBlKyspIHtcclxuXHRcdFx0Ly9cdFx0ZGVmID0gcmVwbGFjZShkZWYsIGRhdGEsIGVyZ2VibmlzW2VdLnN1YnN0cmluZygyLCBlcmdlYm5pc1tlXS5sZW5ndGggLSAyKSk7XHJcblx0XHRcdC8vXHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZGVmO1xyXG5cdH0gZWxzZSB7Ly9vYmplY3RcdFxyXG5cdFx0Zm9yICh2YXIga2V5IGluIGRlZikge1xyXG5cdFx0XHRkZWZba2V5XSA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2tleV0sIGRhdGEpO1xyXG5cclxuXHRcdH1cclxuXHRcdGRlbGV0ZSBkZWYuZWRpdFRvZ2V0aGVyOy8vUlRleHRcclxuXHR9XHJcblx0cmV0dXJuIGRlZjtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXBvcnREZWZpbml0aW9uKGRlZmluaXRpb24sIGRhdGEsIHBhcmFtZXRlcikge1xyXG5cdGRlZmluaXRpb24gPSBjbG9uZShkZWZpbml0aW9uKTsvL3RoaXMgd291bGQgYmUgbW9kaWZpZWRcclxuXHRpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKVxyXG5cdFx0ZGF0YSA9IGNsb25lKGRhdGEpOy8vdGhpcyB3b3VsZCBiZSBtb2RpZmllZFxyXG5cclxuXHRpZiAoZGF0YSA9PT0gdW5kZWZpbmVkICYmIGRlZmluaXRpb24uZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRkYXRhID0gZGVmaW5pdGlvbi5kYXRhO1xyXG5cdH1cclxuXHQvL3BhcmFtZXRlciBjb3VsZCBiZSBpbiBkYXRhXHJcblx0aWYgKGRhdGEgIT09IHVuZGVmaW5lZCAmJiBkYXRhLnBhcmFtZXRlciAhPT0gdW5kZWZpbmVkICYmIHBhcmFtZXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbWV0ZXIgd291bGQgb3ZlcnJpZGUgZGF0YS5wYXJhbWV0ZXJcIik7XHJcblx0fVxyXG5cdGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XHJcblx0XHRkYXRhID0geyBpdGVtczogZGF0YSB9Oy8vc28gd2UgY2FuIGRvIGRhdGEucGFyYW1ldGVyXHJcblx0fVxyXG5cdGlmIChwYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cclxuXHRcdGRhdGEucGFyYW1ldGVyID0gcGFyYW1ldGVyO1xyXG5cdH1cclxuXHQvL3BhcmFtZXRlciBjb3VsZCBiZSBpbiBkZWZpbml0aW9uXHJcblx0aWYgKGRhdGEgIT09IHVuZGVmaW5lZCAmJiBkYXRhLnBhcmFtZXRlciAhPT0gdW5kZWZpbmVkICYmIGRlZmluaXRpb24ucGFyYW1ldGVyICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcImRlZmluaXRpb24ucGFyYW1ldGVyIHdvdWxkIG92ZXJyaWRlIGRhdGEucGFyYW1ldGVyXCIpO1xyXG5cdH1cclxuXHRpZiAoZGVmaW5pdGlvbi5wYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0ZGF0YS5wYXJhbWV0ZXIgPSBkZWZpbml0aW9uLnBhcmFtZXRlcjtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0ZGVmaW5pdGlvbi5jb250ZW50ID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZpbml0aW9uLmNvbnRlbnQsIGRhdGEpO1xyXG5cdGlmIChkZWZpbml0aW9uLmJhY2tncm91bmQpXHJcblx0XHRkZWZpbml0aW9uLmJhY2tncm91bmQgPSByZXBsYWNlVGVtcGxhdGVzKGRlZmluaXRpb24uYmFja2dyb3VuZCwgZGF0YSk7XHJcblx0aWYgKGRlZmluaXRpb24uaGVhZGVyKVxyXG5cdFx0ZGVmaW5pdGlvbi5oZWFkZXIgPSByZXBsYWNlVGVtcGxhdGVzKGRlZmluaXRpb24uaGVhZGVyLCBkYXRhKTtcclxuXHRpZiAoZGVmaW5pdGlvbi5mb290ZXIpXHJcblx0XHRkZWZpbml0aW9uLmZvb3RlciA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmaW5pdGlvbi5mb290ZXIsIGRhdGEpO1xyXG5cclxuXHQvL2RlZmluaXRpb24uY29udGVudCA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmaW5pdGlvbi5jb250ZW50LCBkYXRhKTtcclxuXHRyZXBsYWNlUGFnZUluZm9ybWF0aW9uKGRlZmluaXRpb24pO1xyXG5cdGRlbGV0ZSBkZWZpbml0aW9uLmRhdGE7XHJcblx0cmV0dXJuIGRlZmluaXRpb247XHJcblx0Ly8gZGVsZXRlIGRlZmluaXRpb24ucGFyYW1ldGVyO1xyXG59XHJcbnZhciBmdW5jY2FjaGU6IGFueSA9IHt9O1xyXG5mdW5jdGlvbiBhZGRHcm91cEZ1bmNpb25zKG5hbWVzLHZhbHVlcyl7XHJcblx0bmFtZXMucHVzaChcInN1bVwiKTtcclxuXHR2YWx1ZXMucHVzaChzdW0pO1xyXG59XHJcbmZ1bmN0aW9uIHN1bShncm91cCxmaWVsZCl7XHJcblx0cmV0dXJuIGdyb3VwK2ZpZWxkO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG5cdHZhciBoID0ge1xyXG5cdFx0azogNSxcclxuXHRcdGhvKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5rICsgMTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9AdHMtaWdub3JlXHJcblx0dmFyIHMgPSBcIiR7c3VtKDgsOSl9XCIucmVwbGFjZVRlbXBsYXRlKGgsIHRydWUpO1xyXG5cdGguayA9IDYwO1xyXG5cdHMgPSBcIiR7aG8oKX1cIi5yZXBsYWNlVGVtcGxhdGUoaCwgdHJ1ZSk7XHJcblx0Y29uc29sZS5sb2cocyArIDIpO1xyXG59XHJcbiJdfQ==