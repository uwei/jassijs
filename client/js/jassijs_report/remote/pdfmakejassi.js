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
    function test() {
        var h = {
            k: 5,
            ho() {
                return this.k + 1;
            }
        };
        //@ts-ignore
        var s = "${ho()}".replaceTemplate(h, true);
        h.k = 60;
        s = "${ho()}".replaceTemplate(h, true);
        console.log(s + 2);
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRmbWFrZWphc3NpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvcmVtb3RlL3BkZm1ha2VqYXNzaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQ0EsU0FBUyxLQUFLLENBQUMsR0FBRztRQUNqQixJQUFJLEdBQUcsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxlQUFlLElBQUksR0FBRztZQUN0RSxPQUFPLEdBQUcsQ0FBQztRQUVaLElBQUksR0FBRyxZQUFZLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO1lBQ2pELElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1COztZQUVyRCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFOUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7WUFDcEIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxHQUFHLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUM1QjtTQUNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBUUQsWUFBWTtJQUNaLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxHQUFHLFVBQVUsTUFBTSxFQUFFLFlBQVk7UUFDaEUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRW5DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssVUFBVSxFQUFFO2dCQUNsQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQVMsSUFBSSxDQUFDLENBQUMsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN0QztTQUNEO1FBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxZQUFZLEVBQUU7WUFDakIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQixJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTTtnQkFDckMsT0FBTyxNQUFNLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztTQUNIO1FBQ0QsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDN0MsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFLEVBQUMsbUNBQW1DO1lBQzNELElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEtBQUssRUFBRSxVQUFVLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQzVELFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN6QztRQUNELE9BQU8sSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFBO0lBQ0Q7OztPQUdHO0lBQ0gsU0FBUyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQWM7UUFDbkMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxRQUFRO1lBQ1osTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQzlCLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVDOzs7Ozs7O2VBT0k7UUFDSixPQUFPLEVBQUUsQ0FBQztJQUNYLENBQUM7SUFDRCxpR0FBaUc7SUFDakcsU0FBUyxzQkFBc0IsQ0FBQyxHQUFHO1FBRWxDLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO1lBQzNELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxXQUFXLEVBQUUsUUFBUTtnQkFDL0MsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFBO1NBQ0Q7UUFDRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUNuRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNuQyxHQUFHLENBQUMsTUFBTSxHQUFHLFVBQVUsV0FBVyxFQUFFLFNBQVM7Z0JBQzVDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQ3hELElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDbkQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQTtTQUNEO1FBQ0QsSUFBSSxHQUFHLENBQUMsTUFBTSxJQUFJLE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDbkQsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFbkMsR0FBRyxDQUFDLE1BQU0sR0FBRyxVQUFVLFdBQVcsRUFBRSxTQUFTLEVBQUUsUUFBUTtnQkFDdEQsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDeEQsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4RCxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUE7U0FDRDtJQUNGLENBQUM7SUFDRCxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxPQUFPLEdBQUcsQ0FBQztRQUN2RCxJQUFJLEdBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1FBQ3RDLElBQUksT0FBTyxHQUFHLENBQUM7WUFDZCxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUU5QzthQUFNO1lBQ04sS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLEVBQUU7Z0JBQ3RCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hFO1lBQ0QsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7U0FFSDtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQUNELFNBQWdCLE9BQU8sQ0FBQyxPQUFPLEVBQUUsV0FBcUI7UUFDckQsSUFBSSxHQUFHLEdBQVEsRUFBRSxDQUFDO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzVDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBQyx5QkFBeUI7b0JBQ3pELElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO3dCQUNyQixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUN4QjtxQkFBTSxFQUFFLDhCQUE4QjtvQkFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7d0JBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQzlCO2dCQUNELE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDM0I7U0FDRDtRQUNELE1BQU07UUFDTixJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVqRCxPQUFPLE1BQU0sQ0FBQztJQUNmLENBQUM7SUF0QkQsMEJBc0JDO0lBQ0QsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSTtRQUVsQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUN6QyxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUNsQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUM5QixJQUFJLFNBQVMsR0FBYSxFQUFFLENBQUM7UUFDN0IsR0FBRyxDQUFDLEtBQUssR0FBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFFLEVBQUUsQ0FBQTtRQUNsQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3hCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDeEIsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUM3QixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRXhCLElBQUksTUFBTTtZQUNULEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDaEQsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNuQixPQUFPLEVBQUUsUUFBUTtnQkFDakIsRUFBRSxFQUFFLElBQUk7YUFDUixDQUFDLENBQUM7U0FDSDthQUFNO1lBQ04sSUFBSSxNQUFNLEdBQVEsRUFBRSxDQUFDO1lBQ3JCLElBQUksS0FBSyxHQUFHO2dCQUNYLE9BQU8sRUFBRSxtQ0FBbUM7Z0JBQzVDLEVBQUUsRUFBRSxNQUFNO2FBQ1YsQ0FBQTtZQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMzQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMxQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsVUFBVSxDQUFDO2lCQUM5RjtxQkFBSTtvQkFDSixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQztpQkFDeEY7Z0JBQ0QsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDcEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO2lCQUNsQztnQkFDRCxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNwRCxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7aUJBQ2pDO2dCQUNELElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMxQixNQUFNLENBQUMsRUFBRSxHQUFDLEVBQUUsQ0FBQztvQkFDYixNQUFNLEdBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztpQkFDakI7cUJBQUk7b0JBQ0osTUFBTSxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUM7aUJBQ2Y7YUFDRDtZQUNELElBQUksR0FBRyxHQUFHLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMvQztRQUVELE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFFakM7Ozs7Ozs7OztXQVNHO1FBQ0gsSUFBSSxNQUFNO1lBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLHdCQUF3QjtRQUN4QixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQzVCLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztRQUM3QixPQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQzVCLE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFFMUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO1lBQzlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNwQztRQUNELE9BQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUNyQjs7OztpQ0FJYTtJQUdkLENBQUM7SUFDRCxTQUFTLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJO1FBQ3pDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7WUFDdkIsR0FBRyxHQUFHLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxLQUFLLENBQUMsQ0FBQSx1QkFBdUI7U0FDekM7YUFBTTtZQUNOLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBQ0QsU0FBUyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssR0FBRyxTQUFTO1FBQ3JELElBQUksR0FBRyxLQUFLLFNBQVM7WUFDcEIsT0FBTztRQUNSLElBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDaEMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBRTVCO1FBQ0QsSUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM5QixpQkFBaUI7WUFDakIsc0ZBQXNGO1lBQ3RGLElBQUksQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxNQUFLLFNBQVMsRUFBRTtnQkFDckMsTUFBTSxzQ0FBc0MsQ0FBQzthQUM3QztZQUNELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLElBQUksR0FBRyxHQUFVLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFeEQsSUFBSSxDQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxjQUFjLE1BQUssU0FBUyxFQUFFO2dCQUN4QyxLQUFLLENBQUMsY0FBYyxHQUFHLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN2RCxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ25EO1lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDbkIsSUFBSSxJQUFJLENBQUM7Z0JBQ1QsSUFBSSxHQUFHLENBQUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxzQkFBc0I7b0JBQ2xELElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMxQixJQUFJLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDM0MsSUFBSSxJQUFJLEtBQUssU0FBUzt3QkFDckIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDM0Q7Z0JBQ0QsSUFBSSxHQUFHLENBQUMsRUFBRTtvQkFDVCxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7b0JBRXJCLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRW5CLElBQUksR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLElBQUksS0FBSyxTQUFTO29CQUNyQixLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUMscUJBQXFCO29CQUM3RCxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDekIsSUFBSSxHQUFHLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzNDLElBQUksSUFBSSxLQUFLLFNBQVM7d0JBQ3JCLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQzNEO2FBQ0Q7WUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNqQjthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM5QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtvQkFDakMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUNyRCxDQUFDLEVBQUUsQ0FBQztpQkFDSjs7b0JBQ0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUMvRDtZQUNELE9BQU8sR0FBRyxDQUFDO1NBQ1g7YUFBTSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUNuQyxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDeEQsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFO2dCQUN0QixHQUFHLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEMsOENBQThDO2dCQUM5QywrRUFBK0U7Z0JBQy9FLElBQUk7YUFDSjtZQUNELE9BQU8sR0FBRyxDQUFDO1NBQ1g7YUFBTSxFQUFDLFNBQVM7WUFDaEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUU7Z0JBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFFNUM7WUFDRCxPQUFPLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQSxPQUFPO1NBQy9CO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDWixDQUFDO0lBR0QsU0FBZ0Isc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTO1FBQ2pFLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQSx3QkFBd0I7UUFDdkQsSUFBSSxJQUFJLEtBQUssU0FBUztZQUNyQixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsd0JBQXdCO1FBRTVDLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUN4RCxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztTQUN2QjtRQUNELDRCQUE0QjtRQUM1QixJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxTQUFTLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUNsRixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7U0FDM0Q7UUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUEsNkJBQTZCO1NBQ3BEO1FBQ0QsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBRTVCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQzNCO1FBQ0Qsa0NBQWtDO1FBQ2xDLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtZQUM3RixNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7U0FDdEU7UUFDRCxJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztTQUN0QztRQUlELFVBQVUsQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRSxJQUFJLFVBQVUsQ0FBQyxVQUFVO1lBQ3hCLFVBQVUsQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2RSxJQUFJLFVBQVUsQ0FBQyxNQUFNO1lBQ3BCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvRCxJQUFJLFVBQVUsQ0FBQyxNQUFNO1lBQ3BCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUvRCxrRUFBa0U7UUFDbEUsc0JBQXNCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsT0FBTyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLE9BQU8sVUFBVSxDQUFDO1FBQ2xCLCtCQUErQjtJQUNoQyxDQUFDO0lBMUNELHdEQTBDQztJQUNELElBQUksU0FBUyxHQUFRLEVBQUUsQ0FBQztJQUV4QixTQUFnQixJQUFJO1FBQ25CLElBQUksQ0FBQyxHQUFHO1lBQ1AsQ0FBQyxFQUFFLENBQUM7WUFDSixFQUFFO2dCQUNELE9BQU8sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsQ0FBQztTQUNELENBQUE7UUFDRCxZQUFZO1FBQ1osSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDVCxDQUFDLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQVpELG9CQVlDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmZ1bmN0aW9uIGNsb25lKG9iaikge1xyXG5cdGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIChvYmopICE9PSAnb2JqZWN0JyB8fCAnaXNBY3RpdmVDbG9uZScgaW4gb2JqKVxyXG5cdFx0cmV0dXJuIG9iajtcclxuXHJcblx0aWYgKG9iaiBpbnN0YW5jZW9mIERhdGUgfHwgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIilcclxuXHRcdHZhciB0ZW1wID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpOyAvL29yIG5ldyBEYXRlKG9iaik7XHJcblx0ZWxzZVxyXG5cdFx0dmFyIHRlbXAgPSBvYmouY29uc3RydWN0b3IoKTtcclxuXHJcblx0Zm9yICh2YXIga2V5IGluIG9iaikge1xyXG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuXHRcdFx0b2JqWydpc0FjdGl2ZUNsb25lJ10gPSBudWxsO1xyXG5cdFx0XHR0ZW1wW2tleV0gPSBjbG9uZShvYmpba2V5XSk7XHJcblx0XHRcdGRlbGV0ZSBvYmpbJ2lzQWN0aXZlQ2xvbmUnXTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIHRlbXA7XHJcbn1cclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuXHRpbnRlcmZhY2UgU3RyaW5nIHtcclxuXHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0cmVwbGFjZVRlbXBsYXRlOiBhbnk7XHJcblx0fVxyXG59XHJcbi8vQHRzLWlnbm9yZVxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VUZW1wbGF0ZSA9IGZ1bmN0aW9uIChwYXJhbXMsIHJldHVyblZhbHVlcykge1xyXG5cdGNvbnN0IG5hbWVzID0gT2JqZWN0LmtleXMocGFyYW1zKTtcclxuXHRjb25zdCB2YWxzID0gT2JqZWN0LnZhbHVlcyhwYXJhbXMpO1xyXG5cclxuXHRmb3IgKGxldCB4ID0gMDsgeCA8IHZhbHMubGVuZ3RoOyB4KyspIHtcclxuXHRcdGlmICh0eXBlb2YgdmFsc1t4XSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdHZhbHNbeF0gPSAoPGFueT52YWxzW3hdKS5iaW5kKHBhcmFtcyk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGxldCBzdGFnID0gXCJcIjtcclxuXHRpZiAocmV0dXJuVmFsdWVzKSB7XHJcblx0XHRuYW1lcy5wdXNoKFwidGFnXCIpO1xyXG5cdFx0c3RhZyA9IFwidGFnXCI7XHJcblx0XHR2YWxzLnB1c2goZnVuY3Rpb24gdGFnKHN0cmluZ3MsIHZhbHVlcykge1xyXG5cdFx0XHRyZXR1cm4gdmFsdWVzO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHZhciBmdW5jID0gZnVuY2NhY2hlW25hbWVzLmpvaW4oXCIsXCIpICsgdGhpc107XHJcblx0aWYgKGZ1bmMgPT09IHVuZGVmaW5lZCkgey8vY3JlYXRlIGZ1bmN0aW9ucyBpcyBzbG93IHNvIGNhY2hlXHJcblx0XHRmdW5jID0gbmV3IEZ1bmN0aW9uKC4uLm5hbWVzLCBgcmV0dXJuICR7c3RhZ31cXGAke3RoaXN9XFxgO2ApO1xyXG5cdFx0ZnVuY2NhY2hlW25hbWVzLmpvaW4oXCIsXCIpICsgdGhpc10gPSBmdW5jO1xyXG5cdH1cclxuXHRyZXR1cm4gZnVuYyguLi52YWxzKTtcclxufVxyXG4vKmZ1bmN0aW9uIHJlcGxhY2Uoc3RyLCBkYXRhLCBtZW1iZXIpIHtcclxuXHR2YXIgb2IgPSBnZXRWYXIoZGF0YSwgbWVtYmVyKTtcclxuXHRyZXR1cm4gc3RyLnNwbGl0KFwie3tcIiArIG1lbWJlciArIFwifX1cIikuam9pbihvYik7XHJcbn0qL1xyXG5mdW5jdGlvbiBnZXRWYXIoZGF0YSwgbWVtYmVyOiBzdHJpbmcpIHtcclxuXHR2YXIgZXJnZWJuaXMgPSBtZW1iZXIudG9TdHJpbmcoKS5tYXRjaCgvXFwkXFx7KFxcd3x8XFwuKSpcXH0vZyk7XHJcblx0aWYgKCFlcmdlYm5pcylcclxuXHRcdG1lbWJlciA9IFwiJHtcIiArIG1lbWJlciArIFwifVwiO1xyXG5cdHZhciBvYiA9IG1lbWJlci5yZXBsYWNlVGVtcGxhdGUoZGF0YSwgdHJ1ZSk7XHJcblx0LypcdHZhciBuYW1lcyA9IG1lbWJlci5zcGxpdChcIi5cIik7XHJcblx0XHR2YXIgb2IgPSBkYXRhW25hbWVzWzBdXTtcclxuXHRcdGZvciAobGV0IHggPSAxOyB4IDwgbmFtZXMubGVuZ3RoOyB4KyspIHtcclxuXHRcclxuXHRcdFx0aWYgKG9iID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHRcdFx0b2IgPSBvYltuYW1lc1t4XV07XHJcblx0XHR9Ki9cclxuXHRyZXR1cm4gb2I7XHJcbn1cclxuLy9yZXBsYWNlIHt7Y3VycmVudFBhZ2V9fSB7e3BhZ2VXaWR0aH19IHt7cGFnZUhlaWdodH19IHt7cGFnZUNvdW50fX0gaW4gaGVhZGVyLGZvb3RlciwgYmFja2dyb3VuZFxyXG5mdW5jdGlvbiByZXBsYWNlUGFnZUluZm9ybWF0aW9uKGRlZikge1xyXG5cclxuXHRpZiAoZGVmLmJhY2tncm91bmQgJiYgdHlwZW9mIGRlZi5iYWNrZ3JvdW5kICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdGxldCBkID0gSlNPTi5zdHJpbmdpZnkoZGVmLmJhY2tncm91bmQpO1xyXG5cdFx0ZGVmLmJhY2tncm91bmQgPSBmdW5jdGlvbiAoY3VycmVudFBhZ2UsIHBhZ2VTaXplKSB7XHJcblx0XHRcdGxldCBzcmV0ID0gZC5yZXBsYWNlQWxsKFwie3tjdXJyZW50UGFnZX19XCIsIGN1cnJlbnRQYWdlKTtcclxuXHRcdFx0c3JldCA9IHNyZXQucmVwbGFjZUFsbChcInt7cGFnZVdpZHRofX1cIiwgcGFnZVNpemUud2lkdGgpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlSGVpZ2h0fX1cIiwgcGFnZVNpemUuaGVpZ2h0KTtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2Uoc3JldCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmIChkZWYuaGVhZGVyICYmIHR5cGVvZiBkZWYuaGVhZGVyICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdGxldCBkID0gSlNPTi5zdHJpbmdpZnkoZGVmLmhlYWRlcik7XHJcblx0XHRkZWYuaGVhZGVyID0gZnVuY3Rpb24gKGN1cnJlbnRQYWdlLCBwYWdlQ291bnQpIHtcclxuXHRcdFx0bGV0IHNyZXQgPSBkLnJlcGxhY2VBbGwoXCJ7e2N1cnJlbnRQYWdlfX1cIiwgY3VycmVudFBhZ2UpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlQ291bnR9fVwiLCBwYWdlQ291bnQpO1xyXG5cdFx0XHRyZXR1cm4gSlNPTi5wYXJzZShzcmV0KTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKGRlZi5mb290ZXIgJiYgdHlwZW9mIGRlZi5mb290ZXIgIT09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0bGV0IGQgPSBKU09OLnN0cmluZ2lmeShkZWYuZm9vdGVyKTtcclxuXHJcblx0XHRkZWYuZm9vdGVyID0gZnVuY3Rpb24gKGN1cnJlbnRQYWdlLCBwYWdlQ291bnQsIHBhZ2VTaXplKSB7XHJcblx0XHRcdGxldCBzcmV0ID0gZC5yZXBsYWNlQWxsKFwie3tjdXJyZW50UGFnZX19XCIsIGN1cnJlbnRQYWdlKTtcclxuXHRcdFx0c3JldCA9IHNyZXQucmVwbGFjZUFsbChcInt7cGFnZUNvdW50fX1cIiwgcGFnZUNvdW50KTtcclxuXHRcdFx0c3JldCA9IHNyZXQucmVwbGFjZUFsbChcInt7cGFnZVdpZHRofX1cIiwgcGFnZVNpemUud2lkdGgpO1xyXG5cdFx0XHRzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwie3twYWdlSGVpZ2h0fX1cIiwgcGFnZVNpemUuaGVpZ2h0KTtcclxuXHRcdFx0cmV0dXJuIEpTT04ucGFyc2Uoc3JldCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbmZ1bmN0aW9uIGdyb3VwU29ydChncm91cCwgbmFtZSwgZ3JvdXBmaWVsZHMsIGdyb3VwaWQgPSAwKSB7XHJcblx0dmFyIHJldCA9IHsgZW50cmllczogW10sIG5hbWU6IG5hbWUgfTtcclxuXHRpZiAoZ3JvdXBpZCA+IDApXHJcblx0XHRyZXRbXCJncm91cGZpZWxkXCJdID0gZ3JvdXBmaWVsZHNbZ3JvdXBpZCAtIDFdO1xyXG5cdGlmIChBcnJheS5pc0FycmF5KGdyb3VwKSkge1xyXG5cdFx0Z3JvdXAuZm9yRWFjaCgobmV1KSA9PiByZXQuZW50cmllcy5wdXNoKG5ldSkpO1xyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0Zm9yICh2YXIga2V5IGluIGdyb3VwKSB7XHJcblx0XHRcdHZhciBuZXUgPSBncm91cFtrZXldO1xyXG5cdFx0XHRyZXQuZW50cmllcy5wdXNoKGdyb3VwU29ydChuZXUsIGtleSwgZ3JvdXBmaWVsZHMsIGdyb3VwaWQgKyAxKSk7XHJcblx0XHR9XHJcblx0XHRyZXQuZW50cmllcyA9IHJldC5lbnRyaWVzLnNvcnQoKGEsIGIpID0+IHtcclxuXHRcdFx0cmV0dXJuIGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cdHJldHVybiByZXQ7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGRvR3JvdXAoZW50cmllcywgZ3JvdXBmaWVsZHM6IHN0cmluZ1tdKSB7XHJcblx0dmFyIHJldDogYW55ID0ge307XHJcblx0Zm9yICh2YXIgZSA9IDA7IGUgPCBlbnRyaWVzLmxlbmd0aDsgZSsrKSB7XHJcblx0XHR2YXIgZW50cnkgPSBlbnRyaWVzW2VdO1xyXG5cdFx0bGV0IHBhcmVudCA9IHJldDtcclxuXHRcdGZvciAodmFyIHggPSAwOyB4IDwgZ3JvdXBmaWVsZHMubGVuZ3RoOyB4KyspIHtcclxuXHRcdFx0dmFyIGdyb3VwbmFtZSA9IGVudHJ5W2dyb3VwZmllbGRzW3hdXTtcclxuXHRcdFx0aWYgKHggPCBncm91cGZpZWxkcy5sZW5ndGggLSAxKSB7Ly91bmRlcmdyb3VwcyBkb2VzIGV4aXN0c1xyXG5cdFx0XHRcdGlmICghcGFyZW50W2dyb3VwbmFtZV0pXHJcblx0XHRcdFx0XHRwYXJlbnRbZ3JvdXBuYW1lXSA9IHt9O1xyXG5cdFx0XHR9IGVsc2UgeyAvL2xhc3QgZ3JvdXAgY29udGFvbnMgdGhlIGRhdGFcclxuXHRcdFx0XHRpZiAoIXBhcmVudFtncm91cG5hbWVdKVxyXG5cdFx0XHRcdFx0cGFyZW50W2dyb3VwbmFtZV0gPSBbXTtcclxuXHRcdFx0XHRwYXJlbnRbZ3JvdXBuYW1lXS5wdXNoKGVudHJ5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwYXJlbnQgPSBwYXJlbnRbZ3JvdXBuYW1lXTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9zb3J0XHJcblx0dmFyIHNvcnRlZCA9IGdyb3VwU29ydChyZXQsIFwibWFpblwiLCBncm91cGZpZWxkcyk7XHJcblxyXG5cdHJldHVybiBzb3J0ZWQ7XHJcbn1cclxuZnVuY3Rpb24gcmVwbGFjZURhdGF0YWJsZShkZWYsIGRhdGEpIHtcclxuXHJcblx0dmFyIGhlYWRlciA9IGRlZi5kYXRhdGFibGUuaGVhZGVyO1xyXG5cdHZhciBmb290ZXIgPSBkZWYuZGF0YXRhYmxlLmZvb3RlcjtcclxuXHR2YXIgZGF0YWV4cHIgPSBkZWYuZGF0YXRhYmxlLmRhdGFmb3JlYWNoO1xyXG5cdHZhciBncm91cHMgPSBkZWYuZGF0YXRhYmxlLmdyb3VwcztcclxuXHR2YXIgYm9keSA9IGRlZi5kYXRhdGFibGUuYm9keTtcclxuXHR2YXIgZ3JvdXBleHByOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGRlZi50YWJsZSA9Y2xvbmUoZGVmLmRhdGF0YWJsZSk7XHJcblx0ZGVmLnRhYmxlLmJvZHk9IFtdXHJcblx0ZGVsZXRlIGRlZi50YWJsZS5oZWFkZXI7XHJcblx0ZGVsZXRlIGRlZi50YWJsZS5mb290ZXI7XHJcblx0ZGVsZXRlIGRlZi50YWJsZS5kYXRhZm9yZWFjaDtcclxuXHRkZWxldGUgZGVmLnRhYmxlLmdyb3VwcztcclxuXHRcclxuXHRpZiAoaGVhZGVyKVxyXG5cdFx0ZGVmLnRhYmxlLmJvZHkucHVzaChoZWFkZXIpO1xyXG5cdGlmIChncm91cHMgPT09IHVuZGVmaW5lZCB8fCBncm91cHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRkZWYudGFibGUuYm9keS5wdXNoKHtcclxuXHRcdFx0Zm9yZWFjaDogZGF0YWV4cHIsXHJcblx0XHRcdGRvOiBib2R5XHJcblx0XHR9KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHBhcmVudDogYW55ID0ge307XHJcblx0XHR2YXIgdG9hZGQgPSB7XHJcblx0XHRcdGZvcmVhY2g6IFwiZ3JvdXAxIGluIGRhdGF0YWJsZWdyb3Vwcy5lbnRyaWVzXCIsXHJcblx0XHRcdGRvOiBwYXJlbnRcclxuXHRcdH1cclxuXHRcdGRlZi50YWJsZS5ib2R5LnB1c2godG9hZGQpO1xyXG5cdFx0Zm9yICh2YXIgeCA9IDA7IHggPCBncm91cHMubGVuZ3RoOyB4KyspIHtcclxuXHRcdFx0Z3JvdXBleHByLnB1c2goZ3JvdXBzW3hdLmV4cHJlc3Npb24pO1xyXG5cdFx0XHRpZiAoeCA8IGdyb3Vwcy5sZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0cGFyZW50LmZvcmVhY2ggPSBcImdyb3VwXCIgKyAoeCArIDIpLnRvU3RyaW5nKCkgKyBcIiBpbiBncm91cFwiICsgKHggKyAxKS50b1N0cmluZygpICsgXCIuZW50cmllc1wiO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRwYXJlbnQuZm9yZWFjaCA9IGRhdGFleHByLnNwbGl0KFwiIFwiKVswXSArIFwiIGluIGdyb3VwXCIgKyAoeCArIDEpLnRvU3RyaW5nKCkgKyBcIi5lbnRyaWVzXCI7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGdyb3Vwc1t4XS5oZWFkZXIgJiYgZ3JvdXBzW3hdLmhlYWRlci5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0cGFyZW50LmRvZmlyc3QgPSBncm91cHNbeF0uaGVhZGVyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChncm91cHNbeF0uZm9vdGVyICYmIGdyb3Vwc1t4XS5mb290ZXIubGVuZ3RoID4gMCkge1xyXG5cdFx0XHRcdHBhcmVudC5kb2xhc3QgPSBncm91cHNbeF0uZm9vdGVyO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh4IDwgZ3JvdXBzLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRwYXJlbnQuZG89e307XHJcblx0XHRcdFx0cGFyZW50PXBhcmVudC5kbztcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0cGFyZW50LmRvPWJvZHk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBhcnIgPSBnZXRBcnJheUZyb21Gb3JFYWNoKGRlZi5kYXRhdGFibGUuZGF0YWZvcmVhY2gsIGRhdGEpO1xyXG5cdFx0ZGF0YS5kYXRhdGFibGVncm91cHMgPSBkb0dyb3VwKGFyciwgZ3JvdXBleHByKTtcclxuXHR9XHJcblxyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmRhdGFmb3JlYWNoO1xyXG5cclxuXHQvKnZhciB2YXJpYWJsZSA9IGRhdGFleHByLnNwbGl0KFwiIGluIFwiKVswXTtcclxuXHR2YXIgc2FyciA9IGRhdGFleHByLnNwbGl0KFwiIGluIFwiKVsxXTtcclxuXHR2YXIgYXJyID0gZ2V0VmFyKGRhdGEsIHNhcnIpO1xyXG5cdFxyXG5cdGZvciAobGV0IHggPSAwO3ggPCBhcnIubGVuZ3RoO3grKykge1xyXG5cdFx0ZGF0YVt2YXJpYWJsZV0gPSBhcnJbeF07XHJcblx0XHR2YXIgY29weSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYm9keSkpOy8vZGVlcCBjb3B5XHJcblx0XHRjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhKTtcclxuXHRcdGRlZi50YWJsZS5ib2R5LnB1c2goY29weSk7XHJcblx0fSovXHJcblx0aWYgKGZvb3RlcilcclxuXHRcdGRlZi50YWJsZS5ib2R5LnB1c2goZm9vdGVyKTtcclxuXHQvL2RlbGV0ZSBkYXRhW3ZhcmlhYmxlXTtcclxuXHRkZWxldGUgZGVmLmRhdGF0YWJsZS5oZWFkZXI7XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuZm9vdGVyO1xyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmZvcmVhY2g7XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGUuZ3JvdXBzO1xyXG5cdGRlbGV0ZSBkZWYuZGF0YXRhYmxlLmJvZHk7XHJcblxyXG5cdGZvciAodmFyIGtleSBpbiBkZWYuZGF0YXRhYmxlKSB7XHJcblx0XHRkZWYudGFibGVba2V5XSA9IGRlZi5kYXRhdGFibGVba2V5XTtcclxuXHR9XHJcblx0ZGVsZXRlIGRlZi5kYXRhdGFibGU7XHJcblx0LypoZWFkZXI6W3sgdGV4dDpcIkl0ZW1cIn0seyB0ZXh0OlwiUHJpY2VcIn1dLFxyXG5cdFx0XHRcdFx0ZGF0YTpcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLFxyXG5cdFx0XHRcdFx0Ly9mb290ZXI6W3sgdGV4dDpcIlRvdGFsXCJ9LHsgdGV4dDpcIlwifV0sXHJcblx0XHRcdFx0XHRib2R5Olt7IHRleHQ6XCJUZXh0XCJ9LHsgdGV4dDpcInByaWNlXCJ9XSxcclxuXHRcdFx0XHRcdGdyb3VwczoqL1xyXG5cclxuXHJcbn1cclxuZnVuY3Rpb24gZ2V0QXJyYXlGcm9tRm9yRWFjaChmb3JlYWNoLCBkYXRhKSB7XHJcblx0dmFyIHNhcnIgPSBmb3JlYWNoLnNwbGl0KFwiIGluIFwiKVsxXTtcclxuXHR2YXIgYXJyO1xyXG5cdGlmIChzYXJyID09PSB1bmRlZmluZWQpIHtcclxuXHRcdGFyciA9IGRhdGE/Lml0ZW1zOy8vd2UgZ2V0IHRoZSBtYWluIGFycmF5XHJcblx0fSBlbHNlIHtcclxuXHRcdGFyciA9IGdldFZhcihkYXRhLCBzYXJyKTtcclxuXHR9XHJcblx0cmV0dXJuIGFycjtcclxufVxyXG5mdW5jdGlvbiByZXBsYWNlVGVtcGxhdGVzKGRlZiwgZGF0YSwgcGFyYW0gPSB1bmRlZmluZWQpIHtcclxuXHRpZiAoZGVmID09PSB1bmRlZmluZWQpXHJcblx0XHRyZXR1cm47XHJcblx0aWYgKGRlZi5kYXRhdGFibGUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0cmVwbGFjZURhdGF0YWJsZShkZWYsIGRhdGEpO1xyXG5cclxuXHR9XHJcblx0aWYgKGRlZi5mb3JlYWNoICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdC8vcmVzb2x2ZSBmb3JlYWNoXHJcblx0XHQvL1x0eyBmb3JlYWNoOiBcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLCBkbzogWyd7e2xpbmUudGV4dH19JywgJ3t7bGluZS5wcmljZX19JywgJ09LPyddXHRcclxuXHRcdGlmIChwYXJhbT8ucGFyZW50QXJyYXkgPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHR0aHJvdyBcImZvcmVhY2ggaXMgbm90IHN1cm91bmRlZCBieSBhbiBBcnJheVwiO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHZhcmlhYmxlID0gZGVmLmZvcmVhY2guc3BsaXQoXCIgaW4gXCIpWzBdO1xyXG5cdFx0dmFyIGFycjogYW55W10gPSBnZXRBcnJheUZyb21Gb3JFYWNoKGRlZi5mb3JlYWNoLCBkYXRhKTtcclxuXHJcblx0XHRpZiAocGFyYW0/LnBhcmVudEFycmF5UG9zID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cGFyYW0ucGFyZW50QXJyYXlQb3MgPSBwYXJhbT8ucGFyZW50QXJyYXkuaW5kZXhPZihkZWYpO1xyXG5cdFx0XHRwYXJhbT8ucGFyZW50QXJyYXkuc3BsaWNlKHBhcmFtLnBhcmVudEFycmF5UG9zLCAxKTtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCB4ID0gMDsgeCA8IGFyci5sZW5ndGg7IHgrKykge1xyXG5cdFx0XHRkYXRhW3ZhcmlhYmxlXSA9IGFyclt4XTtcclxuXHRcdFx0ZGVsZXRlIGRlZi5mb3JlYWNoO1xyXG5cdFx0XHR2YXIgY29weTtcclxuXHRcdFx0aWYgKGRlZi5kb2ZpcnN0ICYmIHggPT09IDApIHsvL3JlbmRlciBvbmx5IGZvcmZpcnN0XHJcblx0XHRcdFx0Y29weSA9IGNsb25lKGRlZi5kb2ZpcnN0KTtcclxuXHRcdFx0XHRjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhLCBwYXJhbSk7XHJcblx0XHRcdFx0aWYgKGNvcHkgIT09IHVuZGVmaW5lZClcclxuXHRcdFx0XHRcdHBhcmFtLnBhcmVudEFycmF5LnNwbGljZShwYXJhbS5wYXJlbnRBcnJheVBvcysrLCAwLCBjb3B5KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZGVmLmRvKVxyXG5cdFx0XHRcdGNvcHkgPSBjbG9uZShkZWYuZG8pO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Y29weSA9IGNsb25lKGRlZik7XHJcblxyXG5cdFx0XHRjb3B5ID0gcmVwbGFjZVRlbXBsYXRlcyhjb3B5LCBkYXRhLCBwYXJhbSk7XHJcblx0XHRcdGlmIChjb3B5ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0cGFyYW0ucGFyZW50QXJyYXkuc3BsaWNlKHBhcmFtLnBhcmVudEFycmF5UG9zKyssIDAsIGNvcHkpO1xyXG5cclxuXHRcdFx0aWYgKGRlZi5kb2xhc3QgJiYgeCA9PT0gYXJyLmxlbmd0aCAtIDEpIHsvL3JlbmRlciBvbmx5IGZvcmxhc3RcclxuXHRcdFx0XHRjb3B5ID0gY2xvbmUoZGVmLmRvbGFzdCk7XHJcblx0XHRcdFx0Y29weSA9IHJlcGxhY2VUZW1wbGF0ZXMoY29weSwgZGF0YSwgcGFyYW0pO1xyXG5cdFx0XHRcdGlmIChjb3B5ICE9PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRwYXJhbS5wYXJlbnRBcnJheS5zcGxpY2UocGFyYW0ucGFyZW50QXJyYXlQb3MrKywgMCwgY29weSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGRlbGV0ZSBkYXRhW3ZhcmlhYmxlXTtcclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRlZikpIHtcclxuXHRcdGZvciAodmFyIGEgPSAwOyBhIDwgZGVmLmxlbmd0aDsgYSsrKSB7XHJcblx0XHRcdGlmIChkZWZbYV0uZm9yZWFjaCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0cmVwbGFjZVRlbXBsYXRlcyhkZWZbYV0sIGRhdGEsIHsgcGFyZW50QXJyYXk6IGRlZiB9KTtcclxuXHRcdFx0XHRhLS07XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHRcdGRlZlthXSA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmW2FdLCBkYXRhLCB7IHBhcmVudEFycmF5OiBkZWYgfSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZGVmO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZiA9PT0gXCJzdHJpbmdcIikge1xyXG5cdFx0dmFyIGVyZ2VibmlzID0gZGVmLnRvU3RyaW5nKCkubWF0Y2goL1xcJFxceyhcXHd8fFxcLikqXFx9L2cpO1xyXG5cdFx0aWYgKGVyZ2VibmlzICE9PSBudWxsKSB7XHJcblx0XHRcdGRlZiA9IGRlZi5yZXBsYWNlVGVtcGxhdGUoZGF0YSk7XHJcblx0XHRcdC8vXHRmb3IgKHZhciBlID0gMDsgZSA8IGVyZ2VibmlzLmxlbmd0aDsgZSsrKSB7XHJcblx0XHRcdC8vXHRcdGRlZiA9IHJlcGxhY2UoZGVmLCBkYXRhLCBlcmdlYm5pc1tlXS5zdWJzdHJpbmcoMiwgZXJnZWJuaXNbZV0ubGVuZ3RoIC0gMikpO1xyXG5cdFx0XHQvL1x0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGRlZjtcclxuXHR9IGVsc2Ugey8vb2JqZWN0XHRcclxuXHRcdGZvciAodmFyIGtleSBpbiBkZWYpIHtcclxuXHRcdFx0ZGVmW2tleV0gPSByZXBsYWNlVGVtcGxhdGVzKGRlZltrZXldLCBkYXRhKTtcclxuXHJcblx0XHR9XHJcblx0XHRkZWxldGUgZGVmLmVkaXRUb2dldGhlcjsvL1JUZXh0XHJcblx0fVxyXG5cdHJldHVybiBkZWY7XHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVwb3J0RGVmaW5pdGlvbihkZWZpbml0aW9uLCBkYXRhLCBwYXJhbWV0ZXIpIHtcclxuXHRkZWZpbml0aW9uID0gY2xvbmUoZGVmaW5pdGlvbik7Ly90aGlzIHdvdWxkIGJlIG1vZGlmaWVkXHJcblx0aWYgKGRhdGEgIT09IHVuZGVmaW5lZClcclxuXHRcdGRhdGEgPSBjbG9uZShkYXRhKTsvL3RoaXMgd291bGQgYmUgbW9kaWZpZWRcclxuXHJcblx0aWYgKGRhdGEgPT09IHVuZGVmaW5lZCAmJiBkZWZpbml0aW9uLmRhdGEgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0ZGF0YSA9IGRlZmluaXRpb24uZGF0YTtcclxuXHR9XHJcblx0Ly9wYXJhbWV0ZXIgY291bGQgYmUgaW4gZGF0YVxyXG5cdGlmIChkYXRhICE9PSB1bmRlZmluZWQgJiYgZGF0YS5wYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCAmJiBwYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwicGFyYW1ldGVyIHdvdWxkIG92ZXJyaWRlIGRhdGEucGFyYW1ldGVyXCIpO1xyXG5cdH1cclxuXHRpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xyXG5cdFx0ZGF0YSA9IHsgaXRlbXM6IGRhdGEgfTsvL3NvIHdlIGNhbiBkbyBkYXRhLnBhcmFtZXRlclxyXG5cdH1cclxuXHRpZiAocGFyYW1ldGVyICE9PSB1bmRlZmluZWQpIHtcclxuXHJcblx0XHRkYXRhLnBhcmFtZXRlciA9IHBhcmFtZXRlcjtcclxuXHR9XHJcblx0Ly9wYXJhbWV0ZXIgY291bGQgYmUgaW4gZGVmaW5pdGlvblxyXG5cdGlmIChkYXRhICE9PSB1bmRlZmluZWQgJiYgZGF0YS5wYXJhbWV0ZXIgIT09IHVuZGVmaW5lZCAmJiBkZWZpbml0aW9uLnBhcmFtZXRlciAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJkZWZpbml0aW9uLnBhcmFtZXRlciB3b3VsZCBvdmVycmlkZSBkYXRhLnBhcmFtZXRlclwiKTtcclxuXHR9XHJcblx0aWYgKGRlZmluaXRpb24ucGFyYW1ldGVyICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdGRhdGEucGFyYW1ldGVyID0gZGVmaW5pdGlvbi5wYXJhbWV0ZXI7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdGRlZmluaXRpb24uY29udGVudCA9IHJlcGxhY2VUZW1wbGF0ZXMoZGVmaW5pdGlvbi5jb250ZW50LCBkYXRhKTtcclxuXHRpZiAoZGVmaW5pdGlvbi5iYWNrZ3JvdW5kKVxyXG5cdFx0ZGVmaW5pdGlvbi5iYWNrZ3JvdW5kID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZpbml0aW9uLmJhY2tncm91bmQsIGRhdGEpO1xyXG5cdGlmIChkZWZpbml0aW9uLmhlYWRlcilcclxuXHRcdGRlZmluaXRpb24uaGVhZGVyID0gcmVwbGFjZVRlbXBsYXRlcyhkZWZpbml0aW9uLmhlYWRlciwgZGF0YSk7XHJcblx0aWYgKGRlZmluaXRpb24uZm9vdGVyKVxyXG5cdFx0ZGVmaW5pdGlvbi5mb290ZXIgPSByZXBsYWNlVGVtcGxhdGVzKGRlZmluaXRpb24uZm9vdGVyLCBkYXRhKTtcclxuXHJcblx0Ly9kZWZpbml0aW9uLmNvbnRlbnQgPSByZXBsYWNlVGVtcGxhdGVzKGRlZmluaXRpb24uY29udGVudCwgZGF0YSk7XHJcblx0cmVwbGFjZVBhZ2VJbmZvcm1hdGlvbihkZWZpbml0aW9uKTtcclxuXHRkZWxldGUgZGVmaW5pdGlvbi5kYXRhO1xyXG5cdHJldHVybiBkZWZpbml0aW9uO1xyXG5cdC8vIGRlbGV0ZSBkZWZpbml0aW9uLnBhcmFtZXRlcjtcclxufVxyXG52YXIgZnVuY2NhY2hlOiBhbnkgPSB7fTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG5cdHZhciBoID0ge1xyXG5cdFx0azogNSxcclxuXHRcdGhvKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5rICsgMTtcclxuXHRcdH1cclxuXHR9XHJcblx0Ly9AdHMtaWdub3JlXHJcblx0dmFyIHMgPSBcIiR7aG8oKX1cIi5yZXBsYWNlVGVtcGxhdGUoaCwgdHJ1ZSk7XHJcblx0aC5rID0gNjA7XHJcblx0cyA9IFwiJHtobygpfVwiLnJlcGxhY2VUZW1wbGF0ZShoLCB0cnVlKTtcclxuXHRjb25zb2xlLmxvZyhzICsgMik7XHJcbn1cclxuIl19