(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var Oldpdfmakejassi = window.pdfmakejassi;
		var api = window.pdfmakejassi = factory();
		api.noConflict = function () {
			window.Cookies = Oldpdfmakejassi;
			return api;
		};
	}
}(function () {
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


	function replace(str, data, member) {
		var ob = getVar(data, member);
		return str.split("{{" + member + "}}").join(ob);
	}
	function getVar(data, member) {
		var names = member.split(".");
		var ob = data[names[0]];
		for (let x = 1; x < names.length; x++) {

			if (ob === undefined)
				return undefined;
			ob = ob[names[x]];
		}
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
			}
		}
		if (def.header && typeof def.header !== "function") {
			let d = JSON.stringify(def.header);
			def.header = function (currentPage, pageCount) {
				let sret = d.replaceAll("{{currentPage}}", currentPage);
				sret = sret.replaceAll("{{pageCount}}", pageCount);
				return JSON.parse(sret);
			}
		}
		if (def.footer && typeof def.footer !== "function") {
			let d = JSON.stringify(def.footer);

			def.footer = function (currentPage, pageCount, pageSize) {
				let sret = d.replaceAll("{{currentPage}}", currentPage);
				sret = sret.replaceAll("{{pageCount}}", pageCount);
				sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
				sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
				return JSON.parse(sret);
			}
		}
	}

	function replaceDatatable(def, data) {

		var header = def.datatable.header;
		var footer = def.datatable.footer;
		var dataexpr = def.datatable.foreach;
		var groups = def.datatable.groups;
		var body = def.datatable.body;
		def.table = {
			body: []
		};
		if (header)
			def.table.body.push(header);
		def.table.body.push({
			foreach: def.datatable.dataforeach,
			do: body
		});
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
	function replaceTemplates(def, data, parentArray = undefined) {
		if(def===undefined)
			return;
		if (def.datatable !== undefined) {
			replaceDatatable(def, data);

		}
		if (def.foreach !== undefined) {
			//resolve foreach
			//	{ foreach: "line in invoice.lines", do: ['{{line.text}}', '{{line.price}}', 'OK?']	
			if (parentArray === undefined) {
				throw "foreach is not surounded by an Array";
			}
			var variable = def.foreach.split(" in ")[0];
			var sarr = def.foreach.split(" in ")[1];
			var arr;
			if (sarr === undefined) {
				debugger;
				arr = data?.items;//we get the main array
			} else {
				arr = getVar(data, sarr);
			}

			var pos = parentArray.indexOf(def);
			parentArray.splice(pos, 1);

			for (let x = 0; x < arr.length; x++) {
				data[variable] = arr[x];
				delete def.foreach;
				var copy;
				if (def.do)
					copy = JSON.parse(JSON.stringify(def.do));
				else
					copy = JSON.parse(JSON.stringify(def));

				copy = replaceTemplates(copy, data);
				parentArray.splice(pos++, 0, copy);
			}
			delete data[variable];
			return undefined;
		} else if (Array.isArray(def)) {
			for (var a = 0; a < def.length; a++) {
				if (def[a].foreach !== undefined) {
					replaceTemplates(def[a], data, def);
					a--;
				} else
					def[a] = replaceTemplates(def[a], data, def);
			}
			return def;
		} else if (typeof def === "string") {
			var ergebnis = def.toString().match(/\{\{(\w||\.)*\}\}/g);
			if (ergebnis !== null) {
				for (var e = 0; e < ergebnis.length; e++) {
					def = replace(def, data, ergebnis[e].substring(2, ergebnis[e].length - 2));
				}
			}
			return def;
		} else {//object	
			for (var key in def) {
				def[key] = replaceTemplates(def[key], data);

			}
			delete def.editTogether;//RText
		}
		return def;
	}

	return {
		createReportDefinition(definition, data, parameter) {
			definition = clone(definition);//this would be modified
			if (data !== undefined)
				data = clone(data);//this would be modified

			if (data === undefined && definition.data !== undefined) {
				data = definition.data;
			}
			//parameter could be in data
			if (data !== undefined && data.parameter !== undefined && parameter !== undefined) {
				throw new Error("parameter would override data.parameter");
			}
			if (Array.isArray(data)) {
				data = { items: data };//so we can do data.parameter
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
	}
}));
