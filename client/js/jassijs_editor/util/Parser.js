var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_editor/util/Typescript"], function (require, exports, Jassi_1, Typescript_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Parser = exports.ParsedClass = void 0;
    class ParsedDecorator {
        constructor() {
            this.parsedParameter = [];
            this.parameter = [];
        }
    }
    class ParsedMember {
        constructor() {
            this.decorator = {};
        }
    }
    class ParsedClass {
        constructor() {
            this.members = {};
            this.decorator = {};
        }
    }
    exports.ParsedClass = ParsedClass;
    let Parser = class Parser {
        /**
         * parses Code for UI relevant settings
         * @class jassijs_editor.util.Parser
         */
        constructor() {
            this.sourceFile = undefined;
            this.typeMe = {};
            this.classes = {};
            this.imports = {};
            this.functions = {};
            this.variables = {};
            this.data = {};
            /** {[string]} - all code lines*/
        }
        getModifiedCode() {
            const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
            const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
            const result = printer.printNode(ts.EmitHint.Unspecified, this.sourceFile, resultFile);
            return result;
        }
        /**
         * add a property
         * @param {string} variable - name of the variable
         * @param {string} property - name of the property
         * @param {string} value  - code - the value
         * @param node - the node of the statement
         */
        add(variable, property, value, node, isFunction = false) {
            if (value === undefined || value === null)
                return;
            value = value.trim();
            property = property.trim();
            if (this.data[variable] === undefined) {
                this.data[variable] = {};
            }
            if (this.data[variable][property] === undefined) {
                this.data[variable][property] = [];
            }
            if (Array.isArray(this.data[variable][property])) {
                this.data[variable][property].push({
                    value: value,
                    node: node,
                    isFunction
                });
            }
        }
        /**
         * read a property value from code
         * @param {string} variable - the name of the variable
         * @param {string} property - the name of the property
         */
        getPropertyValue(variable, property) {
            if (this.data[variable] !== undefined) {
                if (this.data[variable][property] !== undefined) {
                    var ret = this.data[variable][property][0].value;
                    return ret;
                }
            }
            return undefined;
            /* variable="this."+variable;
             if(this.data[variable]!==undefined){
                 if(this.data[variable][property]!==undefined){
                     return this.data[variable][property][0].value;
                 }
             }*/
            //this 
            //   var value=this.propertyEditor.parser.getPropertyValue(this.variablename,this.property.name);
        }
        addTypeMe(name, type) {
            if (!this.typeMeNode)
                return;
            var tp = ts.createTypeReferenceNode(type, []);
            var newnode = ts.createPropertySignature(undefined, name + "?", undefined, tp, undefined);
            this.typeMeNode["members"].push(newnode);
        }
        /**
         * add import {name} from file
         * @param name
         * @param file
         */
        addImportIfNeeded(name, file) {
            if (this.imports[name] === undefined) {
                //@ts-ignore
                var imp = ts.createNamedImports([ts.createImportSpecifier(false, undefined, ts.createIdentifier(name))]);
                const importNode = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, imp), ts.createLiteral(file));
                this.sourceFile = ts.updateSourceFileNode(this.sourceFile, [importNode, ...this.sourceFile.statements]);
            }
        }
        parseTypeMeNode(node) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.TypeLiteral) {
                if (node["members"])
                    this.typeMeNode = node;
                node["members"].forEach(function (tnode) {
                    if (tnode.name) {
                        var name = tnode.name.text;
                        var stype = tnode.type.typeName.text;
                        _this.typeMe[name] = { node: tnode, value: stype, isFunction: false };
                    }
                    //            this.add("me", name, "typedeclaration:" + stype, undefined, aline, aline);
                });
            }
            node.getChildren().forEach(c => this.parseTypeMeNode(c));
        }
        convertArgument(arg) {
            if (arg === undefined)
                return undefined;
            if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                var ret = {};
                var props = arg.properties;
                if (props !== undefined) {
                    for (var p = 0; p < props.length; p++) {
                        ret[props[p].name.text] = this.convertArgument(props[p].initializer);
                    }
                }
                return ret;
            }
            else if (arg.kind === ts.SyntaxKind.StringLiteral) {
                return arg.text;
            }
            else if (arg.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                let ret = [];
                for (var p = 0; p < arg.elements.length; p++) {
                    ret.push(this.convertArgument(arg.elements[p]));
                }
                return ret;
            }
            else if (arg.kind === ts.SyntaxKind.Identifier) {
                return arg.text;
            }
            else if (arg.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (arg.kind === ts.SyntaxKind.NumericLiteral) {
                return Number(arg.text);
            }
            else if (arg.kind === ts.SyntaxKind.ArrowFunction) {
                return arg.getText();
            }
            throw "Error type not found";
        }
        parseDecorator(dec) {
            var ex = dec.expression;
            var ret = new ParsedDecorator();
            if (ex.expression === undefined) {
                ret.name = ex.text;
            }
            else {
                ret.name = ex.expression.escapedText;
                if (ex.expression !== undefined) {
                    for (var a = 0; a < ex.arguments.length; a++) {
                        ret.parsedParameter.push(this.convertArgument(ex.arguments[a]));
                        ret.parameter.push(ex.arguments[a].getText());
                    }
                }
            }
            return ret;
        }
        parseClass(node) {
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                var parsedClass = new ParsedClass();
                parsedClass.parent = this;
                parsedClass.name = node.name.getText();
                parsedClass.node = node;
                this.classes[parsedClass.name] = parsedClass;
                if (node.decorators !== undefined) {
                    var dec = {};
                    for (let x = 0; x < node.decorators.length; x++) {
                        var parsedDec = this.parseDecorator(node.decorators[x]);
                        parsedClass.decorator[parsedDec.name] = parsedDec;
                        if (parsedClass.decorator["$Class"] && parsedDec.parameter.length > 0)
                            parsedClass.fullClassname = parsedDec.parameter[0].replaceAll('"', "");
                    }
                }
                for (var x = 0; x < node["members"].length; x++) {
                    var parsedMem = new ParsedMember();
                    var mem = node["members"][x];
                    if (mem.name === undefined)
                        continue; //Constructor
                    parsedMem.name = mem.name.escapedText;
                    parsedMem.node = node["members"][x];
                    parsedMem.type = (mem.type ? mem.type.getFullText().trim() : undefined);
                    parsedClass.members[parsedMem.name] = parsedMem;
                    var params = [];
                    if (mem.decorators) {
                        for (let i = 0; i < mem.decorators.length; i++) {
                            let parsedDec = this.parseDecorator(mem.decorators[i]);
                            parsedMem.decorator[parsedDec.name] = parsedDec;
                        }
                    }
                }
                if (this.classScope) {
                    for (let x = 0; x < this.classScope.length; x++) {
                        var col = this.classScope[x];
                        if (col.classname === parsedClass.name && parsedClass.members[col.methodname]) {
                            var nd = parsedClass.members[col.methodname].node;
                            this.parseProperties(nd);
                        }
                    }
                }
            }
        }
        parseConfig(node) {
            if (node.arguments.length > 0) {
                var left = node.expression.getText();
                var lastpos = left.lastIndexOf(".");
                var variable = left;
                var prop = "";
                if (lastpos !== -1) {
                    variable = left.substring(0, lastpos);
                    prop = left.substring(lastpos + 1);
                    //@ts-ignore
                    var props = node.arguments[0].properties;
                    if (props !== undefined) {
                        for (var p = 0; p < props.length; p++) {
                            var name = props[p].name.text;
                            // var value = this.convertArgument(props[p].initializer);
                            var code = props[p].initializer ? props[p].initializer.getText() : "";
                            if ((code === null || code === void 0 ? void 0 : code.indexOf(".config")) > -1) {
                                this.parseProperties(props[p].initializer);
                            }
                            this.add(variable, name, code, props[p], false);
                        }
                    }
                }
            }
        }
        parseProperties(node) {
            if (ts.isVariableDeclaration(node)) {
                var name = node.name.getText();
                if (node.initializer !== undefined) {
                    var value = node.initializer.getText();
                    this.add(name, "_new_", value, node.parent.parent);
                }
            }
            if ((ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) ||
                ts.isCallExpression(node)) {
                var node1;
                var node2;
                var left;
                var value;
                var isFunction = false;
                if (ts.isBinaryExpression(node)) {
                    node1 = node.left;
                    node2 = node.right;
                    left = node1.getText(); // this.code.substring(node1.pos, node1.end).trim();
                    value = node2.getText(); //this.code.substring(node2.pos, node2.end).trim();
                    if (value.startsWith("new "))
                        this.add(left, "_new_", value, node.parent);
                }
                if (ts.isCallExpression(node)) {
                    node1 = node.expression;
                    node2 = node.arguments;
                    isFunction = true;
                    left = node1.getText(); // this.code.substring(node1.pos, node1.end).trim();
                    var params = [];
                    node.arguments.forEach((arg) => { params.push(arg.getText()); });
                    if (left.endsWith(".config")) {
                        var lastpos = left.lastIndexOf(".");
                        var variable = left;
                        var prop = "";
                        if (lastpos !== -1) {
                            variable = left.substring(0, lastpos);
                            prop = left.substring(lastpos + 1);
                        }
                        value = params.join(", ");
                        this.add(variable, prop, value, node, isFunction);
                        this.parseConfig(node);
                        return;
                    }
                    value = params.join(", "); //this.code.substring(node2.pos, node2.end).trim();//
                }
                var lastpos = left.lastIndexOf(".");
                var variable = left;
                var prop = "";
                if (lastpos !== -1) {
                    variable = left.substring(0, lastpos);
                    prop = left.substring(lastpos + 1);
                }
                this.add(variable, prop, value, node.parent, isFunction);
            }
            else
                node.getChildren().forEach(c => this.parseProperties(c));
        }
        visitNode(node) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.VariableDeclaration) {
                this.variables[node["name"].text] = node;
            }
            if (node.kind === ts.SyntaxKind.ImportDeclaration) {
                var nd = node;
                var file = nd.moduleSpecifier.text;
                if (nd.importClause && nd.importClause.namedBindings) {
                    var names = nd.importClause.namedBindings.elements;
                    for (var e = 0; e < names.length; e++) {
                        this.imports[names[e].name.escapedText] = file;
                    }
                }
            }
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Me") {
                this.parseTypeMeNode(node);
            }
            else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                this.parseClass(node);
            }
            else if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) { //functions out of class
                this.functions[node["name"].text] = node;
                if (this.classScope) {
                    for (let x = 0; x < this.classScope.length; x++) {
                        var col = this.classScope[x];
                        if (col.classname === undefined && node["name"].text === col.methodname)
                            this.parseProperties(node);
                    }
                }
                else
                    this.parseProperties(node);
            }
            else
                node.getChildren().forEach(c => this.visitNode(c));
            //TODO remove this block
            if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                this.add(node["name"].text, "", "", undefined);
            }
        }
        searchClassnode(node, pos) {
            if (ts.isMethodDeclaration(node)) {
                return {
                    classname: node.parent["name"]["text"],
                    methodname: node.name["text"]
                };
            }
            if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) { //functions out of class
                var funcname = node["name"].text;
                return {
                    classname: undefined,
                    methodname: funcname
                };
            }
            var childs = node.getChildren();
            for (var x = 0; x < childs.length; x++) {
                var c = childs[x];
                if (pos >= c.pos && pos <= c.end) {
                    var test = this.searchClassnode(c, pos);
                    if (test)
                        return test;
                }
            }
            ;
            return undefined;
        }
        getClassScopeFromPosition(code, pos) {
            this.data = {};
            this.code = code;
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true);
            return this.searchClassnode(this.sourceFile, pos);
            //return this.parseold(code,onlyfunction);
        }
        /**
        * parse the code
        * @param {string} code - the code
        * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
        */
        parse(code, classScope = undefined) {
            this.data = {};
            this.code = code;
            if (classScope !== undefined)
                this.classScope = classScope;
            else
                classScope = this.classScope;
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true);
            this.visitNode(this.sourceFile);
            //return this.parseold(code,onlyfunction);
        }
        removeNode(node) {
            if (node.parent["statements"]) {
                var pos = node.parent["statements"].indexOf(node);
                if (pos >= 0)
                    node.parent["statements"].splice(pos, 1);
            }
            else if (node.parent.parent["type"] !== undefined) {
                var pos = node.parent.parent["type"]["members"].indexOf(node);
                if (pos >= 0)
                    node.parent.parent["type"]["members"].splice(pos, 1);
            }
            else if (node.parent["members"] !== undefined) {
                var pos = node.parent["members"].indexOf(node);
                if (pos >= 0)
                    node.parent["members"].splice(pos, 1);
            }
            else if (node.parent["properties"] !== undefined) {
                var pos = node.parent["properties"].indexOf(node);
                if (pos >= 0)
                    node.parent["properties"].splice(pos, 1);
            }
            else if (node.parent["elements"] !== undefined) {
                var pos = node.parent["elements"].indexOf(node);
                if (pos >= 0)
                    node.parent["elements"].splice(pos, 1);
            }
            else
                throw Error(node.getFullText() + "could not be removed");
        }
        /**
         * modify a member
         **/
        addOrModifyMember(member, pclass) {
            //member.node
            //var newmember=ts.createProperty
            var newdec = undefined;
            for (var key in member.decorator) {
                var dec = member.decorator[key];
                if (!newdec)
                    newdec = [];
                //ts.createDecorator()
                //member.decorator[key].name;
                var params = undefined;
                if (dec.parameter) {
                    params = [];
                    for (var i = 0; i < dec.parameter.length; i++) {
                        params.push(ts.createIdentifier(dec.parameter[i]));
                    }
                }
                var call = ts.createCall(ts.createIdentifier(dec.name), undefined, params);
                newdec.push(ts.createDecorator(call));
            }
            //var type=ts.createTy
            var newmember = ts.createProperty(newdec, undefined, member.name, undefined, ts.createTypeReferenceNode(member.type, []), undefined);
            var node = undefined;
            for (var key in pclass.members) {
                if (key === member.name)
                    node = pclass.members[key].node;
            }
            if (node === undefined) {
                pclass.node["members"].push(newmember);
            }
            else {
                var pos = pclass.node["members"].indexOf(node);
                pclass.node["members"][pos] = newmember;
            }
            pclass.members[member.name] = member;
            member.node = newmember;
        }
        /**
        * removes the property from code
        * @param {type} property - the property to remove
        * @param {type} [onlyValue] - remove the property only if the value is found
        * @param {string} [variablename] - thpe name of the variable - default=this.variablename
        */
        removePropertyInCode(property, onlyValue = undefined, variablename = undefined) {
            var _a, _b, _c;
            if (this.data[variablename] !== undefined && this.data[variablename].config !== undefined && property === "add") {
                property = "children";
                var oldparent = this.data[variablename][property][0].node;
                for (var x = 0; x < oldparent.initializer.elements.length; x++) {
                    var valueNode = oldparent.initializer.elements[x];
                    if (valueNode.getText() === onlyValue || valueNode.getText().startsWith(onlyValue + ".")) {
                        oldparent.initializer.elements.splice(x, 1);
                        if (oldparent.initializer.elements.length === 0) {
                            this.removeNode(oldparent);
                        }
                        return valueNode;
                    }
                }
            }
            if (this.data[variablename] !== undefined && this.data[variablename][property] !== undefined) {
                var prop = undefined;
                if (onlyValue !== undefined) {
                    for (var x = 0; x < this.data[variablename][property].length; x++) {
                        if (this.data[variablename][property][x].value === onlyValue || this.data[variablename][property][x].value.startsWith(onlyValue + ".")) {
                            prop = this.data[variablename][property][x];
                        }
                    }
                }
                else
                    prop = this.data[variablename][property][0];
                if (prop == undefined)
                    return;
                this.removeNode(prop.node);
                if (((_b = (_a = prop.node["expression"]) === null || _a === void 0 ? void 0 : _a.arguments) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    return (_c = prop.node["expression"]) === null || _c === void 0 ? void 0 : _c.arguments[0];
                }
                return prop.node;
                /*var oldvalue = this.lines[prop.linestart - 1];
                for (let x = prop.linestart;x <= prop.lineend;x++) {
                    this.lines[x - 1] = undefined;
                    if (x > 1 && this.lines[x - 2].endsWith(","))//type Me={ bt2?:Button,
                        this.lines[x - 2] = this.lines[x - 2].substring(0, this.lines[x - 2].length);
                }*/
                //var text = this.parser.linesToString();
                //this.codeEditor.value = text;
                //this.updateParser();
            }
        }
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariableInCode(varname) {
            var _a, _b, _c, _d;
            var prop = this.data[varname];
            var allprops = [];
            if (varname.startsWith("me.") && this.typeMe[varname.substring(3)] !== undefined)
                allprops.push(this.typeMe[varname.substring(3)]);
            //remove properties
            for (var key in prop) {
                let props = prop[key];
                props.forEach((p) => {
                    allprops.push(p);
                });
            }
            if (varname.startsWith("me.")) {
                let props = this.data.me[varname.substring(3)];
                props === null || props === void 0 ? void 0 : props.forEach((p) => {
                    allprops.push(p);
                });
            }
            for (var x = 0; x < allprops.length; x++) {
                this.removeNode(allprops[x].node);
            }
            //remove lines where used as parameter
            for (var propkey in this.data) {
                var prop = this.data[propkey];
                for (var key in prop) {
                    var props = prop[key];
                    for (var x = 0; x < props.length; x++) {
                        let p = props[x];
                        var params = p.value.split(",");
                        for (var i = 0; i < params.length; i++) {
                            if (params[i] === varname || params[i] === "this." + varname) {
                                this.removeNode(p.node);
                            }
                        }
                        //in children:[]
                        //@ts-ignore
                        var inconfig = (_c = (_b = (_a = prop[key][0]) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.initializer) === null || _c === void 0 ? void 0 : _c.elements;
                        if (inconfig) {
                            for (var x = 0; x < inconfig.length; x++) {
                                if (inconfig[x].getText() === varname || inconfig[x].getText().startsWith(varname)) {
                                    this.removeNode(inconfig[x]);
                                }
                            }
                            if (inconfig.length === 0) {
                                this.removeNode((_d = prop[key][0]) === null || _d === void 0 ? void 0 : _d.node);
                            }
                        }
                    }
                }
            }
        }
        getNodeFromScope(classscope, variablescope = undefined) {
            var _a, _b, _c;
            var scope;
            if (variablescope) {
                scope = (_a = this.data[variablescope.variablename][variablescope.methodname][0]) === null || _a === void 0 ? void 0 : _a.node;
                scope = scope.expression.arguments[0];
            }
            else {
                for (var i = 0; i < classscope.length; i++) {
                    var sc = classscope[i];
                    if (sc.classname) {
                        scope = (_c = (_b = this.classes[sc.classname]) === null || _b === void 0 ? void 0 : _b.members[sc.methodname]) === null || _c === void 0 ? void 0 : _c.node;
                        if (scope)
                            break;
                    }
                    else { //exported function
                        scope = this.functions[sc.methodname];
                    }
                }
            }
            return scope;
        }
        /**
         * gets the next variablename
         * */
        getNextVariableNameForType(type) {
            var varname = type.split(".")[type.split(".").length - 1].toLowerCase();
            for (var counter = 1; counter < 1000; counter++) {
                if (this.data.me === undefined || this.data.me[varname + counter] === undefined)
                    break;
            }
            return varname + counter;
        }
        /**
         * change objectliteral to mutliline if needed
         */
        switchToMutlilineIfNeeded(node, newProperty, newValue) {
            var oldValue = node.getText();
            if (node["multiLine"] !== true) {
                var len = 0;
                for (var x = 0; x < node.parent["arguments"][0].properties.length; x++) {
                    var prop = node.parent["arguments"][0].properties[x];
                    len += (prop.initializer.escapedText ? prop.initializer.escapedText.length : prop.initializer.getText().length);
                    len += prop.name.escapedText.length + 5;
                }
                console.log(len);
                if (oldValue.indexOf("\n") > -1 || (len > 60) || newValue.indexOf("\n") > -1) {
                    //order also old elements
                    for (var x = 0; x < node.parent["arguments"][0].properties.length; x++) {
                        var prop = node.parent["arguments"][0].properties[x];
                        prop.pos = -1;
                        prop.len = -1;
                    }
                    node.parent["arguments"][0] = ts.createObjectLiteral(node.parent["arguments"][0].properties, true);
                }
            }
        }
        setPropertyInConfig(variableName, property, value, isFunction = false, replace = undefined, before = undefined, scope) {
            var svalue = typeof value === "string" ? ts.createIdentifier(value) : value;
            var config = this.data[variableName]["config"][0].node;
            config = config.arguments[0];
            var newExpression = ts.createPropertyAssignment(property, svalue);
            if (property === "add" && replace === false) {
                property = "children";
                svalue = typeof value === "string" ? ts.createIdentifier(value + ".config({})") : value;
                if (this.data[variableName]["children"] == undefined) { //
                    newExpression = ts.createPropertyAssignment(property, ts.createArrayLiteral([svalue], true));
                    config.properties.push(newExpression);
                }
                else {
                    if (before === undefined) {
                        //@ts-ignore
                        this.data[variableName]["children"][0].node.initializer.elements.push(svalue);
                    }
                    else {
                        //@ts-ignore
                        var array = this.data[variableName]["children"][0].node.initializer.elements;
                        for (var x = 0; x < array.length; x++) {
                            if (array[x].getText() === before.value || array[x].getText().startsWith(before.value + ".")) {
                                array.splice(x, 0, svalue);
                                return;
                            }
                        }
                        throw new Error("Node " + before.value + " not found.");
                    }
                }
            }
            else { //comp.add(a) --> comp.config({children:[a]})
                if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                    let node = this.data[variableName][property][0].node;
                    var pos = config.properties.indexOf(node);
                    config.properties[pos] = newExpression;
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
                else {
                    config.properties.push(newExpression);
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
            }
            console.log("correct spaces");
            this.parse(this.getModifiedCode());
            //if (pos >= 0)
            //  node.parent["statements"].splice(pos, 1);
        }
        /*  movePropertValueInCode(variableName: string, property: string, value: string, newVariableName: string, beforeValue: any) {
              if (this.data[variableName]["config"] !== undefined) {
                  if (property === "add")
                      property = "children";
                  var oldparent:any=this.data[variableName][property][0].node;
                  for (var x = 0; x < oldparent.initializer.elements.length; x++) {
                      var valueNode=oldparent.initializer.elements[x];
                      if (valueNode.getText() === value ||valueNode.getText().startsWith(value + ".")) {
                          oldparent.initializer.elements.splice(x,1);
                      }
                  }
              }
          }*/
        /**
        * modify the property in code
        * @param variablename - the name of the variable
        * @param  property - the property
        * @param value - the new value
        * @param classscope  - the property would be insert in this block
        * @param isFunction  - true if the property is a function
        * @param [replace]  - if true the old value is deleted
        * @param [before] - the new property is placed before this property
        * @param [variablescope] - if this scope is defined - the new property would be insert in this variable
        */
        setPropertyInCode(variableName, property, value, classscope, isFunction = false, replace = undefined, before = undefined, variablescope = undefined) {
            if (classscope === undefined)
                classscope = this.classScope;
            var scope = this.getNodeFromScope(classscope, variablescope);
            var newExpression = undefined;
            if (this.data[variableName]["config"] !== undefined) {
                this.setPropertyInConfig(variableName, property, value, isFunction, replace, before, scope);
                return;
            }
            var newValue = typeof value === "string" ? ts.createIdentifier(value) : value;
            var statements = scope["body"].statements;
            if (property === "new") { //me.panel1=new Panel({});
                let prop = this.data[variableName]["_new_"][0]; //.substring(3)];
                var constr = prop.value;
                value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                replace = true;
                var left = prop.node.getText();
                left = left.substring(0, left.indexOf("=") - 1);
                property = "_new_";
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), newValue));
                /*	}else{//var hh=new Panel({})
                        let prop = this.data[variableName][0];
                        var constr = prop[0].value;
                        value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                        replace = true;
                        isFunction=true;
                        newExpression=ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier("me."+property), ts.createIdentifier(value)));
                    }*/
            }
            else if (isFunction) {
                newExpression = ts.createExpressionStatement(ts.createCall(ts.createIdentifier(variableName + "." + property), undefined, [newValue]));
            }
            else
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(variableName + "." + property), newValue));
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                let node = this.data[variableName][property][0].node;
                var pos = node.parent["statements"].indexOf(node);
                node.parent["statements"][pos] = newExpression;
                //if (pos >= 0)
                //  node.parent["statements"].splice(pos, 1);
            }
            else { //insert new
                if (before) {
                    if (before.value === undefined)
                        throw "not implemented";
                    let node = undefined;
                    for (var o = 0; o < this.data[before.variablename][before.property].length; o++) {
                        if (this.data[before.variablename][before.property][o].value === before.value) {
                            node = this.data[before.variablename][before.property][o].node;
                            break;
                        }
                    }
                    if (!node)
                        throw Error("Property not found " + before.variablename + "." + before.property + " value " + before.value);
                    var pos = node.parent["statements"].indexOf(node);
                    if (pos >= 0)
                        node.parent["statements"].splice(pos, 0, newExpression);
                }
                else {
                    var lastprop = undefined;
                    for (let prop in this.data[variableName]) {
                        if (prop === "_new_") {
                            //should be in the same scope of declaration (important for repeater)
                            statements = this.data[variableName][prop][0].node.parent["statements"];
                            continue;
                        }
                        var testnode = this.data[variableName][prop][this.data[variableName][prop].length - 1].node;
                        if (testnode.parent === scope["body"])
                            lastprop = testnode;
                    }
                    if (lastprop) {
                        var pos = lastprop.parent["statements"].indexOf(lastprop);
                        if (pos >= 0)
                            lastprop.parent["statements"].splice(pos + 1, 0, newExpression);
                    }
                    else {
                        var pos = statements.length;
                        if (pos > 0 && statements[statements.length - 1].getText().startsWith("return "))
                            pos--;
                        statements.splice(pos, 0, newExpression);
                    }
                }
            }
        }
        /**
         * swaps two statements indendified by  functionparameter in a variable.property(parameter1) with variable.property(parameter2)
         **/
        swapPropertyWithParameter(variable, property, parameter1, parameter2) {
            var first = undefined;
            var second = undefined;
            var parent = this.data[variable][property];
            for (var x = 0; x < parent.length; x++) {
                if (parent[x].value.split(",")[0].trim() === parameter1)
                    first = parent[x].node;
                if (parent[x].value.split(",")[0].trim() === parameter2)
                    second = parent[x].node;
            }
            if (!first)
                throw Error("Parameter not found " + parameter1);
            if (!second)
                throw Error("Parameter not found " + parameter2);
            var ifirst = first.parent["statements"].indexOf(first);
            var isecond = second.parent["statements"].indexOf(second);
            first.parent["statements"][ifirst] = second;
            first.parent["statements"][isecond] = first;
        }
        /**
        * adds an Property
        * @param type - name of the type o create
        * @param classscope - the scope (methodname) where the variable should be insert Class.layout
        * @param variablescope - the scope where the variable should be insert e.g. hallo.onclick
        * @returns  the name of the object
        */
        addVariableInCode(fulltype, classscope, variablescope = undefined) {
            var _a;
            if (classscope === undefined)
                classscope = this.classScope;
            let type = fulltype.split(".")[fulltype.split(".").length - 1];
            var varname = this.getNextVariableNameForType(type);
            var useMe = false;
            if (this.data["me"] !== undefined)
                useMe = true;
            //var if(scopename)
            var node = this.getNodeFromScope(classscope, variablescope);
            //@ts-ignore
            if (((_a = node === null || node === void 0 ? void 0 : node.parameters) === null || _a === void 0 ? void 0 : _a.length) > 0 && node.parameters[0].name.text == "me") {
                useMe = true;
            }
            var prefix = useMe ? "me." : "var ";
            var statements = node["body"].statements;
            if (node === undefined)
                throw Error("no scope to insert a variable could be found");
            for (var x = 0; x < statements.length; x++) {
                if (!statements[x].getText().includes("new ") && !statements[x].getText().includes("var "))
                    break;
            }
            var ass = ts.createAssignment(ts.createIdentifier(prefix + varname), ts.createIdentifier("new " + type + "()"));
            statements.splice(x, 0, ts.createStatement(ass));
            if (useMe)
                this.addTypeMe(varname, type);
            return (useMe ? "me." : "") + varname;
        }
    };
    Parser = __decorate([
        (0, Jassi_1.$Class)("jassijs_editor.util.Parser"),
        __metadata("design:paramtypes", [])
    ], Parser);
    exports.Parser = Parser;
    async function test() {
        await Typescript_1.default.waitForInited;
        var code = Typescript_1.default.getCode("de/Dialog.ts");
        var parser = new Parser();
        // code = "function test(){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1,j:ppp.config({pp:9})})     }); }";
        // code = "function(test){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1},j(){j2.udo=9})     }); }";
        // code = "function test(){var ppp;var aaa=new Button();ppp.config({a:[9,6],  children:[ll.config({}),aaa.config({u:1,o:2,children:[kk.config({})]})]});}";
        //parser.parse(code, undefined);
        parser.parse(code, [{ classname: "Dialog", methodname: "layout" }]);
        debugger;
        var node = parser.removePropertyInCode("add", "me.textbox1", "me.panel1");
        parser.setPropertyInCode("this", "add", node, [{ classname: "Dialog", methodname: "layout" }], true, false);
        //var node = parser.removePropertyInCode("add", "kk", "aaa");
        //var node=parser.removePropertyInCode("add", "ll", "ppp");
        //parser.setPropertyInCode("aaa","add",node,[{classname:undefined, methodname:"test"}],true,false,undefined,undefined);
        //console.log(node.getText());
        //    parser.setPropertyInCode("ppp","add","cc",[{classname:undefined, methodname:"test"}],true,false,{variablename:"ppp",property:"add",value:"ll"});
        //  parser.setPropertyInCode("aaa","add","cc",[{classname:undefined, methodname:"test"}],true,false,{variablename:"aaa",property:"add",value:"kk"});
        console.log(parser.getModifiedCode());
        // debugger;
        /*  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
          const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
          const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
          console.log(result);*/
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWVBLE1BQU0sZUFBZTtRQUFyQjtZQUdJLG9CQUFlLEdBQWMsRUFBRSxDQUFDO1lBQ2hDLGNBQVMsR0FBYyxFQUFFLENBQUM7UUFFOUIsQ0FBQztLQUFBO0lBQ0QsTUFBTSxZQUFZO1FBQWxCO1lBR0ksY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFFekQsQ0FBQztLQUFBO0lBQ0QsTUFBYSxXQUFXO1FBQXhCO1lBS0ksWUFBTyxHQUFzQyxFQUFFLENBQUM7WUFDaEQsY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBUEQsa0NBT0M7SUFFRCxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFNO1FBZ0JmOzs7V0FHRztRQUNIO1lBbkJBLGVBQVUsR0FBa0IsU0FBUyxDQUFDO1lBRXRDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1lBQ3ZDLFlBQU8sR0FBb0MsRUFBRSxDQUFDO1lBQzlDLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1lBQ3pDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBQzVDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBZXhDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRCxlQUFlO1lBQ1gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdkUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENB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SSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMxQixrSkFBa0o7UUFDbEosMElBQTBJO1FBQzNJLDJKQUEySjtRQUMxSixnQ0FBZ0M7UUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUM7UUFDVCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsQ0FBQyxFQUFDLFNBQVMsRUFBQyxRQUFRLEVBQUMsVUFBVSxFQUFDLFFBQVEsRUFBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xHLDZEQUE2RDtRQUU3RCwyREFBMkQ7UUFDM0QsdUhBQXVIO1FBQ3ZILDhCQUE4QjtRQUM5QixzSkFBc0o7UUFDdEosb0pBQW9KO1FBQ3BKLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDdEMsWUFBWTtRQUNaOzs7Z0NBR3dCO0lBSTVCLENBQUM7SUE1QkQsb0JBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5cclxuXHJcbmltcG9ydCB0eXBlc2NyaXB0IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIjtcclxuXHJcblxyXG5pbnRlcmZhY2UgUHJvcGVydGllcyB7XHJcbiAgICBbZGV0YWlsczogc3RyaW5nXTogRW50cnk7XHJcbn1cclxuaW50ZXJmYWNlIEVudHJ5IHtcclxuICAgIHZhbHVlPzogYW55O1xyXG4gICAgbm9kZT86IHRzLk5vZGU7XHJcbiAgICBpc0Z1bmN0aW9uOiBib29sZWFuO1xyXG59XHJcbmNsYXNzIFBhcnNlZERlY29yYXRvciB7XHJcbiAgICBub2RlPzogdHMuRGVjb3JhdG9yO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIHBhcnNlZFBhcmFtZXRlcj86IG9iamVjdFtdID0gW107XHJcbiAgICBwYXJhbWV0ZXI/OiBzdHJpbmdbXSA9IFtdO1xyXG5cclxufVxyXG5jbGFzcyBQYXJzZWRNZW1iZXIge1xyXG4gICAgbm9kZT86IHRzLk5vZGU7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgZGVjb3JhdG9yPzogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkRGVjb3JhdG9yIH0gPSB7fTtcclxuICAgIHR5cGU/OiBzdHJpbmc7XHJcbn1cclxuZXhwb3J0IGNsYXNzIFBhcnNlZENsYXNzIHtcclxuICAgIHBhcmVudD86IFBhcnNlcjtcclxuICAgIG5vZGU/OiB0cy5DbGFzc0VsZW1lbnQ7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgZnVsbENsYXNzbmFtZT86IHN0cmluZztcclxuICAgIG1lbWJlcnM/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWRNZW1iZXIgfSA9IHt9O1xyXG4gICAgZGVjb3JhdG9yPzogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkRGVjb3JhdG9yIH0gPSB7fTtcclxufVxyXG5AJENsYXNzKFwiamFzc2lqc19lZGl0b3IudXRpbC5QYXJzZXJcIilcclxuZXhwb3J0IGNsYXNzIFBhcnNlciB7XHJcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlID0gdW5kZWZpbmVkO1xyXG4gICAgdHlwZU1lTm9kZTogdHMuTm9kZTtcclxuICAgIHR5cGVNZTogeyBbbmFtZTogc3RyaW5nXTogRW50cnkgfSA9IHt9O1xyXG4gICAgY2xhc3NlczogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkQ2xhc3MgfSA9IHt9O1xyXG4gICAgaW1wb3J0czogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgIGZ1bmN0aW9uczogeyBbbmFtZTogc3RyaW5nXTogdHMuTm9kZSB9ID0ge307XHJcbiAgICB2YXJpYWJsZXM6IHsgW25hbWU6IHN0cmluZ106IHRzLk5vZGUgfSA9IHt9O1xyXG4gICAgY2xhc3NTY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXTtcclxuXHJcbiAgICBjb2RlOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICogQG1lbWJlciB7T2JqZWN0LjxzdHJpbmcsT2JqZWN0LjxzdHJpbmcsW29iamVjdF0+PiAtIGFsbCBwcm9wZXJ0aWVzXHJcbiAgICAqIGUuZy4gZGF0YVtcInRleHRib3gxXCJdW3ZhbHVlXS0+RW50cnlcclxuICAgICovXHJcbiAgICBkYXRhOiB7IFt2YXJpYWJsZTogc3RyaW5nXTogeyBbcHJvcGVydHk6IHN0cmluZ106IEVudHJ5W10gfSB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBwYXJzZXMgQ29kZSBmb3IgVUkgcmVsZXZhbnQgc2V0dGluZ3NcclxuICAgICAqIEBjbGFzcyBqYXNzaWpzX2VkaXRvci51dGlsLlBhcnNlclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0ge307XHJcbiAgICAgICAgLyoqIHtbc3RyaW5nXX0gLSBhbGwgY29kZSBsaW5lcyovXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0TW9kaWZpZWRDb2RlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoeyBuZXdMaW5lOiB0cy5OZXdMaW5lS2luZC5MaW5lRmVlZCB9KTtcclxuICAgICAgICBjb25zdCByZXN1bHRGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShcImR1bW15LnRzXCIsIFwiXCIsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIC8qc2V0UGFyZW50Tm9kZXMqLyBmYWxzZSwgdHMuU2NyaXB0S2luZC5UUyk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHRoaXMuc291cmNlRmlsZSwgcmVzdWx0RmlsZSk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhIHByb3BlcnR5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFyaWFibGUgLSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gbmFtZSBvZiB0aGUgcHJvcGVydHlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgLSBjb2RlIC0gdGhlIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gbm9kZSAtIHRoZSBub2RlIG9mIHRoZSBzdGF0ZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGQodmFyaWFibGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbm9kZTogdHMuTm9kZSwgaXNGdW5jdGlvbiA9IGZhbHNlKSB7XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS50cmltKCk7XHJcbiAgICAgICAgcHJvcGVydHkgPSBwcm9wZXJ0eS50cmltKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVdID0ge307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XS5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgIG5vZGU6IG5vZGUsXHJcbiAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBhIHByb3BlcnR5IHZhbHVlIGZyb20gY29kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcmlhYmxlIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgKi9cclxuICAgIGdldFByb3BlcnR5VmFsdWUodmFyaWFibGUsIHByb3BlcnR5KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV1bMF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgLyogdmFyaWFibGU9XCJ0aGlzLlwiK3ZhcmlhYmxlO1xyXG4gICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgIGlmKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV1bMF0udmFsdWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH0qL1xyXG4gICAgICAgIC8vdGhpcyBcclxuICAgICAgICAvLyAgIHZhciB2YWx1ZT10aGlzLnByb3BlcnR5RWRpdG9yLnBhcnNlci5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMudmFyaWFibGVuYW1lLHRoaXMucHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFR5cGVNZShuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy50eXBlTWVOb2RlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHRwID0gdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUodHlwZSwgW10pO1xyXG4gICAgICAgIHZhciBuZXdub2RlID0gdHMuY3JlYXRlUHJvcGVydHlTaWduYXR1cmUodW5kZWZpbmVkLCBuYW1lICsgXCI/XCIsIHVuZGVmaW5lZCwgdHAsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy50eXBlTWVOb2RlW1wibWVtYmVyc1wiXS5wdXNoKG5ld25vZGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgaW1wb3J0IHtuYW1lfSBmcm9tIGZpbGVcclxuICAgICAqIEBwYXJhbSBuYW1lIFxyXG4gICAgICogQHBhcmFtIGZpbGUgXHJcbiAgICAgKi9cclxuICAgIGFkZEltcG9ydElmTmVlZGVkKG5hbWU6IHN0cmluZywgZmlsZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wb3J0c1tuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgaW1wID0gdHMuY3JlYXRlTmFtZWRJbXBvcnRzKFt0cy5jcmVhdGVJbXBvcnRTcGVjaWZpZXIoZmFsc2UsIHVuZGVmaW5lZCwgdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSldKTtcclxuICAgICAgICAgICAgY29uc3QgaW1wb3J0Tm9kZSA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCBpbXApLCB0cy5jcmVhdGVMaXRlcmFsKGZpbGUpKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMudXBkYXRlU291cmNlRmlsZU5vZGUodGhpcy5zb3VyY2VGaWxlLCBbaW1wb3J0Tm9kZSwgLi4udGhpcy5zb3VyY2VGaWxlLnN0YXRlbWVudHNdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlVHlwZU1lTm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlR5cGVMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlW1wibWVtYmVyc1wiXSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZU1lTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIG5vZGVbXCJtZW1iZXJzXCJdLmZvckVhY2goZnVuY3Rpb24gKHRub2RlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0bm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0bm9kZS5uYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eXBlID0gdG5vZGUudHlwZS50eXBlTmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnR5cGVNZVtuYW1lXSA9IHsgbm9kZTogdG5vZGUsIHZhbHVlOiBzdHlwZSwgaXNGdW5jdGlvbjogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgdGhpcy5hZGQoXCJtZVwiLCBuYW1lLCBcInR5cGVkZWNsYXJhdGlvbjpcIiArIHN0eXBlLCB1bmRlZmluZWQsIGFsaW5lLCBhbGluZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMucGFyc2VUeXBlTWVOb2RlKGMpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY29udmVydEFyZ3VtZW50KGFyZzogYW55KSB7XHJcbiAgICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgcHJvcHMgPSBhcmcucHJvcGVydGllcztcclxuICAgICAgICAgICAgaWYgKHByb3BzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXRbcHJvcHNbcF0ubmFtZS50ZXh0XSA9IHRoaXMuY29udmVydEFyZ3VtZW50KHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGxldCByZXQgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBhcmcuZWxlbWVudHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgIHJldC5wdXNoKHRoaXMuY29udmVydEFyZ3VtZW50KGFyZy5lbGVtZW50c1twXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcudGV4dDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRmFsc2VLZXl3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLk51bWVyaWNMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoYXJnLnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQXJyb3dGdW5jdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLmdldFRleHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IFwiRXJyb3IgdHlwZSBub3QgZm91bmRcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VEZWNvcmF0b3IoZGVjOiB0cy5EZWNvcmF0b3IpOiBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgICAgIHZhciBleDogYW55ID0gZGVjLmV4cHJlc3Npb247XHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBQYXJzZWREZWNvcmF0b3IoKTtcclxuICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldC5uYW1lID0gZXgudGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgcmV0Lm5hbWUgPSBleC5leHByZXNzaW9uLmVzY2FwZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGV4LmFyZ3VtZW50cy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wYXJzZWRQYXJhbWV0ZXIucHVzaCh0aGlzLmNvbnZlcnRBcmd1bWVudChleC5hcmd1bWVudHNbYV0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZXQucGFyYW1ldGVyLnB1c2goZXguYXJndW1lbnRzW2FdLmdldFRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNsYXNzKG5vZGU6IHRzLkNsYXNzRWxlbWVudCkge1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VkQ2xhc3MgPSBuZXcgUGFyc2VkQ2xhc3MoKTtcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MubmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLm5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXNbcGFyc2VkQ2xhc3MubmFtZV0gPSBwYXJzZWRDbGFzcztcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG5vZGUuZGVjb3JhdG9ycy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREZWMgPSB0aGlzLnBhcnNlRGVjb3JhdG9yKG5vZGUuZGVjb3JhdG9yc1t4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZGVjb3JhdG9yW3BhcnNlZERlYy5uYW1lXSA9IHBhcnNlZERlYztcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VkQ2xhc3MuZGVjb3JhdG9yW1wiJENsYXNzXCJdICYmIHBhcnNlZERlYy5wYXJhbWV0ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZnVsbENsYXNzbmFtZSA9IHBhcnNlZERlYy5wYXJhbWV0ZXJbMF0ucmVwbGFjZUFsbCgnXCInLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlW1wibWVtYmVyc1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZE1lbSA9IG5ldyBQYXJzZWRNZW1iZXIoKVxyXG4gICAgICAgICAgICAgICAgdmFyIG1lbSA9IG5vZGVbXCJtZW1iZXJzXCJdW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5uYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7Ly9Db25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLm5hbWUgPSBtZW0ubmFtZS5lc2NhcGVkVGV4dDtcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5ub2RlID0gbm9kZVtcIm1lbWJlcnNcIl1beF07XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0udHlwZSA9IChtZW0udHlwZSA/IG1lbS50eXBlLmdldEZ1bGxUZXh0KCkudHJpbSgpIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLm1lbWJlcnNbcGFyc2VkTWVtLm5hbWVdID0gcGFyc2VkTWVtO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5kZWNvcmF0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW0uZGVjb3JhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkRGVjID0gdGhpcy5wYXJzZURlY29yYXRvcihtZW0uZGVjb3JhdG9yc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5kZWNvcmF0b3JbcGFyc2VkRGVjLm5hbWVdID0gcGFyc2VkRGVjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc1Njb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2xhc3NTY29wZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmNsYXNzU2NvcGVbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzc25hbWUgPT09IHBhcnNlZENsYXNzLm5hbWUgJiYgcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5kID0gcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBhcnNlQ29uZmlnKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgaWYgKG5vZGUuYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBub2RlLmV4cHJlc3Npb24uZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgbGFzdHBvcyA9IGxlZnQubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgICAgICB2YXIgdmFyaWFibGUgPSBsZWZ0O1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChsYXN0cG9zICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyaWFibGUgPSBsZWZ0LnN1YnN0cmluZygwLCBsYXN0cG9zKTtcclxuICAgICAgICAgICAgICAgIHByb3AgPSBsZWZ0LnN1YnN0cmluZyhsYXN0cG9zICsgMSk7XHJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wczogYW55W10gPSBub2RlLmFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gcHJvcHNbcF0ubmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgdmFsdWUgPSB0aGlzLmNvbnZlcnRBcmd1bWVudChwcm9wc1twXS5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlOiBzdHJpbmcgPSBwcm9wc1twXS5pbml0aWFsaXplciA/IHByb3BzW3BdLmluaXRpYWxpemVyLmdldFRleHQoKSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlPy5pbmRleE9mKFwiLmNvbmZpZ1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wc1twXS5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQodmFyaWFibGUsIG5hbWUsIGNvZGUsIHByb3BzW3BdLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGFyc2VQcm9wZXJ0aWVzKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICBpZiAodHMuaXNWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gbm9kZS5uYW1lLmdldFRleHQoKTtcclxuICAgICAgICAgICAgaWYgKG5vZGUuaW5pdGlhbGl6ZXIgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbm9kZS5pbml0aWFsaXplci5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChuYW1lLCBcIl9uZXdfXCIsIHZhbHVlLCBub2RlLnBhcmVudC5wYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgodHMuaXNCaW5hcnlFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUub3BlcmF0b3JUb2tlbi5raW5kID09PSB0cy5TeW50YXhLaW5kLkVxdWFsc1Rva2VuKSB8fFxyXG4gICAgICAgICAgICB0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlMTtcclxuICAgICAgICAgICAgdmFyIG5vZGUyO1xyXG4gICAgICAgICAgICB2YXIgbGVmdDogc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWU6IHN0cmluZztcclxuICAgICAgICAgICAgdmFyIGlzRnVuY3Rpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZTEgPSBub2RlLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICBub2RlMiA9IG5vZGUucmlnaHQ7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTEuZ2V0VGV4dCgpOy8vIHRoaXMuY29kZS5zdWJzdHJpbmcobm9kZTEucG9zLCBub2RlMS5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbm9kZTIuZ2V0VGV4dCgpOy8vdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMi5wb3MsIG5vZGUyLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCJuZXcgXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxlZnQsIFwiX25ld19cIiwgdmFsdWUsIG5vZGUucGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZTEgPSBub2RlLmV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICBub2RlMiA9IG5vZGUuYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgaXNGdW5jdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTEuZ2V0VGV4dCgpOy8vIHRoaXMuY29kZS5zdWJzdHJpbmcobm9kZTEucG9zLCBub2RlMS5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIG5vZGUuYXJndW1lbnRzLmZvckVhY2goKGFyZykgPT4geyBwYXJhbXMucHVzaChhcmcuZ2V0VGV4dCgpKSB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0LmVuZHNXaXRoKFwiLmNvbmZpZ1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0cG9zID0gbGVmdC5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3Rwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSBsZWZ0LnN1YnN0cmluZyhsYXN0cG9zICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyYW1zLmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCh2YXJpYWJsZSwgcHJvcCwgdmFsdWUsIG5vZGUsIGlzRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VDb25maWcobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJhbXMuam9pbihcIiwgXCIpOy8vdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMi5wb3MsIG5vZGUyLmVuZCkudHJpbSgpOy8vXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsYXN0cG9zID0gbGVmdC5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9IGxlZnQ7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGxhc3Rwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IGxlZnQuc3Vic3RyaW5nKDAsIGxhc3Rwb3MpO1xyXG4gICAgICAgICAgICAgICAgcHJvcCA9IGxlZnQuc3Vic3RyaW5nKGxhc3Rwb3MgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFkZCh2YXJpYWJsZSwgcHJvcCwgdmFsdWUsIG5vZGUucGFyZW50LCBpc0Z1bmN0aW9uKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB0aGlzLnBhcnNlUHJvcGVydGllcyhjKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlZhcmlhYmxlRGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy52YXJpYWJsZXNbbm9kZVtcIm5hbWVcIl0udGV4dF0gPSBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBuZDogYW55ID0gbm9kZTtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBuZC5tb2R1bGVTcGVjaWZpZXIudGV4dDtcclxuICAgICAgICAgICAgaWYgKG5kLmltcG9ydENsYXVzZSAmJiBuZC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzID0gbmQuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IG5hbWVzLmxlbmd0aDsgZSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbXBvcnRzW25hbWVzW2VdLm5hbWUuZXNjYXBlZFRleHRdID0gZmlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZS5raW5kID09IHRzLlN5bnRheEtpbmQuVHlwZUFsaWFzRGVjbGFyYXRpb24gJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gXCJNZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VUeXBlTWVOb2RlKG5vZGUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUNsYXNzKDx0cy5DbGFzc0VsZW1lbnQ+bm9kZSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbikgey8vZnVuY3Rpb25zIG91dCBvZiBjbGFzc1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uc1tub2RlW1wibmFtZVwiXS50ZXh0XSA9IG5vZGU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzU2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jbGFzc1Njb3BlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IHRoaXMuY2xhc3NTY29wZVt4XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLmNsYXNzbmFtZSA9PT0gdW5kZWZpbmVkICYmIG5vZGVbXCJuYW1lXCJdLnRleHQgPT09IGNvbC5tZXRob2RuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlUHJvcGVydGllcyhub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlUHJvcGVydGllcyhub2RlKTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB0aGlzLnZpc2l0Tm9kZShjKSk7XHJcbiAgICAgICAgLy9UT0RPIHJlbW92ZSB0aGlzIGJsb2NrXHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uICYmIG5vZGVbXCJuYW1lXCJdLnRleHQgPT09IFwidGVzdFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKG5vZGVbXCJuYW1lXCJdLnRleHQsIFwiXCIsIFwiXCIsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2VhcmNoQ2xhc3Nub2RlKG5vZGU6IHRzLk5vZGUsIHBvczogbnVtYmVyKTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH0ge1xyXG4gICAgICAgIGlmICh0cy5pc01ldGhvZERlY2xhcmF0aW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc25hbWU6IG5vZGUucGFyZW50W1wibmFtZVwiXVtcInRleHRcIl0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2RuYW1lOiBub2RlLm5hbWVbXCJ0ZXh0XCJdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUgJiYgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24pIHsvL2Z1bmN0aW9ucyBvdXQgb2YgY2xhc3NcclxuICAgICAgICAgICAgdmFyIGZ1bmNuYW1lID0gbm9kZVtcIm5hbWVcIl0udGV4dFxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NuYW1lOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgICAgICBtZXRob2RuYW1lOiBmdW5jbmFtZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjaGlsZHMgPSBub2RlLmdldENoaWxkcmVuKCk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaGlsZHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGMgPSBjaGlsZHNbeF07XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gYy5wb3MgJiYgcG9zIDw9IGMuZW5kKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHRoaXMuc2VhcmNoQ2xhc3Nub2RlKGMsIHBvcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGVzdClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVzdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIGdldENsYXNzU2NvcGVGcm9tUG9zaXRpb24oY29kZTogc3RyaW5nLCBwb3M6IG51bWJlcik6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9IHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcclxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKCdkdW1teS50cycsIGNvZGUsIHRzLlNjcmlwdFRhcmdldC5FUzUsIHRydWUpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5zZWFyY2hDbGFzc25vZGUodGhpcy5zb3VyY2VGaWxlLCBwb3MpO1xyXG4gICAgICAgIC8vcmV0dXJuIHRoaXMucGFyc2VvbGQoY29kZSxvbmx5ZnVuY3Rpb24pO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBwYXJzZSB0aGUgY29kZSBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSB0aGUgY29kZVxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gb25seWZ1bmN0aW9uIC0gb25seSB0aGUgY29kZSBpbiB0aGUgZnVuY3Rpb24gaXMgcGFyc2VkLCBlLmcuIFwibGF5b3V0KClcIlxyXG4gICAgKi9cclxuICAgIHBhcnNlKGNvZGU6IHN0cmluZywgY2xhc3NTY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XHJcbiAgICAgICAgaWYgKGNsYXNzU2NvcGUgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5jbGFzc1Njb3BlID0gY2xhc3NTY29wZTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNsYXNzU2NvcGUgPSB0aGlzLmNsYXNzU2NvcGU7XHJcblxyXG4gICAgICAgIHRoaXMuc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoJ2R1bW15LnRzJywgY29kZSwgdHMuU2NyaXB0VGFyZ2V0LkVTNSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy52aXNpdE5vZGUodGhpcy5zb3VyY2VGaWxlKTtcclxuXHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5wYXJzZW9sZChjb2RlLG9ubHlmdW5jdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbW92ZU5vZGUobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0pIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl1bXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl1bXCJtZW1iZXJzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudFtcInByb3BlcnRpZXNcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJwcm9wZXJ0aWVzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wicHJvcGVydGllc1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50W1wiZWxlbWVudHNcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJlbGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcImVsZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihub2RlLmdldEZ1bGxUZXh0KCkgKyBcImNvdWxkIG5vdCBiZSByZW1vdmVkXCIpO1xyXG4gICAgfVxyXG4gICAgLyoqIFxyXG4gICAgICogbW9kaWZ5IGEgbWVtYmVyIFxyXG4gICAgICoqL1xyXG4gICAgYWRkT3JNb2RpZnlNZW1iZXIobWVtYmVyOiBQYXJzZWRNZW1iZXIsIHBjbGFzczogUGFyc2VkQ2xhc3MpIHtcclxuICAgICAgICAvL21lbWJlci5ub2RlXHJcbiAgICAgICAgLy92YXIgbmV3bWVtYmVyPXRzLmNyZWF0ZVByb3BlcnR5XHJcbiAgICAgICAgdmFyIG5ld2RlYzogdHMuRGVjb3JhdG9yW10gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG1lbWJlci5kZWNvcmF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGRlYyA9IG1lbWJlci5kZWNvcmF0b3Jba2V5XTtcclxuICAgICAgICAgICAgaWYgKCFuZXdkZWMpXHJcbiAgICAgICAgICAgICAgICBuZXdkZWMgPSBbXTtcclxuICAgICAgICAgICAgLy90cy5jcmVhdGVEZWNvcmF0b3IoKVxyXG4gICAgICAgICAgICAvL21lbWJlci5kZWNvcmF0b3Jba2V5XS5uYW1lO1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoZGVjLnBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlYy5wYXJhbWV0ZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCh0cy5jcmVhdGVJZGVudGlmaWVyKGRlYy5wYXJhbWV0ZXJbaV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgY2FsbCA9IHRzLmNyZWF0ZUNhbGwodHMuY3JlYXRlSWRlbnRpZmllcihkZWMubmFtZSksIHVuZGVmaW5lZCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgbmV3ZGVjLnB1c2godHMuY3JlYXRlRGVjb3JhdG9yKGNhbGwpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy92YXIgdHlwZT10cy5jcmVhdGVUeVxyXG4gICAgICAgIHZhciBuZXdtZW1iZXIgPSB0cy5jcmVhdGVQcm9wZXJ0eShuZXdkZWMsIHVuZGVmaW5lZCwgbWVtYmVyLm5hbWUsIHVuZGVmaW5lZCwgdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUobWVtYmVyLnR5cGUsIFtdKSwgdW5kZWZpbmVkKTtcclxuICAgICAgICB2YXIgbm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGNsYXNzLm1lbWJlcnMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gbWVtYmVyLm5hbWUpXHJcbiAgICAgICAgICAgICAgICBub2RlID0gcGNsYXNzLm1lbWJlcnNba2V5XS5ub2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdLnB1c2gobmV3bWVtYmVyKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl1bcG9zXSA9IG5ld21lbWJlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGNsYXNzLm1lbWJlcnNbbWVtYmVyLm5hbWVdID0gbWVtYmVyO1xyXG4gICAgICAgIG1lbWJlci5ub2RlID0gbmV3bWVtYmVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHJlbW92ZXMgdGhlIHByb3BlcnR5IGZyb20gY29kZVxyXG4gICAgKiBAcGFyYW0ge3R5cGV9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIHJlbW92ZVxyXG4gICAgKiBAcGFyYW0ge3R5cGV9IFtvbmx5VmFsdWVdIC0gcmVtb3ZlIHRoZSBwcm9wZXJ0eSBvbmx5IGlmIHRoZSB2YWx1ZSBpcyBmb3VuZFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlbmFtZV0gLSB0aHBlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIC0gZGVmYXVsdD10aGlzLnZhcmlhYmxlbmFtZVxyXG4gICAgKi9cclxuICAgIHJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5OiBzdHJpbmcsIG9ubHlWYWx1ZSA9IHVuZGVmaW5lZCwgdmFyaWFibGVuYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQpOiB0cy5Ob2RlIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXS5jb25maWcgIT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0eSA9PT0gXCJhZGRcIikge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eSA9IFwiY2hpbGRyZW5cIjtcclxuICAgICAgICAgICAgdmFyIG9sZHBhcmVudDogYW55ID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldWzBdLm5vZGU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVOb2RlID0gb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlTm9kZS5nZXRUZXh0KCkgPT09IG9ubHlWYWx1ZSB8fCB2YWx1ZU5vZGUuZ2V0VGV4dCgpLnN0YXJ0c1dpdGgob25seVZhbHVlICsgXCIuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLnNwbGljZSh4LCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKG9sZHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZU5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wOiBFbnRyeSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKG9ubHlWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF0udmFsdWUgPT09IG9ubHlWYWx1ZXx8dGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdLnZhbHVlLnN0YXJ0c1dpdGgob25seVZhbHVlK1wiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBwcm9wID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldWzBdO1xyXG4gICAgICAgICAgICBpZiAocHJvcCA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwcm9wLm5vZGUpO1xyXG4gICAgICAgICAgICBpZihwcm9wLm5vZGVbXCJleHByZXNzaW9uXCJdPy5hcmd1bWVudHM/Lmxlbmd0aD4wKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wLm5vZGVbXCJleHByZXNzaW9uXCJdPy5hcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3Aubm9kZTtcclxuICAgICAgICAgICAgLyp2YXIgb2xkdmFsdWUgPSB0aGlzLmxpbmVzW3Byb3AubGluZXN0YXJ0IC0gMV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwcm9wLmxpbmVzdGFydDt4IDw9IHByb3AubGluZWVuZDt4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGluZXNbeCAtIDFdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPiAxICYmIHRoaXMubGluZXNbeCAtIDJdLmVuZHNXaXRoKFwiLFwiKSkvL3R5cGUgTWU9eyBidDI/OkJ1dHRvbixcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW3ggLSAyXSA9IHRoaXMubGluZXNbeCAtIDJdLnN1YnN0cmluZygwLCB0aGlzLmxpbmVzW3ggLSAyXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgLy92YXIgdGV4dCA9IHRoaXMucGFyc2VyLmxpbmVzVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgLy90aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgICAgICAvL3RoaXMudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlcyB0aGUgdmFyaWFibGUgZnJvbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFybmFtZSAtIHRoZSB2YXJpYWJsZSB0byByZW1vdmVcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVmFyaWFibGVJbkNvZGUodmFybmFtZTogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgIHZhciBwcm9wID0gdGhpcy5kYXRhW3Zhcm5hbWVdO1xyXG4gICAgICAgIHZhciBhbGxwcm9wczogRW50cnlbXSA9IFtdO1xyXG4gICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikgJiYgdGhpcy50eXBlTWVbdmFybmFtZS5zdWJzdHJpbmcoMyldICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGFsbHByb3BzLnB1c2godGhpcy50eXBlTWVbdmFybmFtZS5zdWJzdHJpbmcoMyldKTtcclxuICAgICAgICAvL3JlbW92ZSBwcm9wZXJ0aWVzXHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3ApIHtcclxuICAgICAgICAgICAgbGV0IHByb3BzID0gcHJvcFtrZXldO1xyXG4gICAgICAgICAgICBwcm9wcy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLmRhdGEubWVbdmFybmFtZS5zdWJzdHJpbmcoMyldO1xyXG4gICAgICAgICAgICBwcm9wcz8uZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWxscHJvcHMucHVzaChwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxscHJvcHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKGFsbHByb3BzW3hdLm5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3JlbW92ZSBsaW5lcyB3aGVyZSB1c2VkIGFzIHBhcmFtZXRlclxyXG4gICAgICAgIGZvciAodmFyIHByb3BrZXkgaW4gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5kYXRhW3Byb3BrZXldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BzID0gcHJvcFtrZXldO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwcm9wcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBwID0gcHJvcHNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHAudmFsdWUuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXNbaV0gPT09IHZhcm5hbWUgfHwgcGFyYW1zW2ldID09PSBcInRoaXMuXCIgKyB2YXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUocC5ub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2luIGNoaWxkcmVuOltdXHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluY29uZmlnID0gcHJvcFtrZXldWzBdPy5ub2RlPy5pbml0aWFsaXplcj8uZWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgaW5jb25maWcubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNvbmZpZ1t4XS5nZXRUZXh0KCkgPT09IHZhcm5hbWUgfHwgaW5jb25maWdbeF0uZ2V0VGV4dCgpLnN0YXJ0c1dpdGgodmFybmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUoaW5jb25maWdbeF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5jb25maWcubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUocHJvcFtrZXldWzBdPy5ub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5vZGVGcm9tU2NvcGUoY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSwgdmFyaWFibGVzY29wZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZSB9ID0gdW5kZWZpbmVkKTogdHMuTm9kZSB7XHJcbiAgICAgICAgdmFyIHNjb3BlO1xyXG4gICAgICAgIGlmICh2YXJpYWJsZXNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gdGhpcy5kYXRhW3ZhcmlhYmxlc2NvcGUudmFyaWFibGVuYW1lXVt2YXJpYWJsZXNjb3BlLm1ldGhvZG5hbWVdWzBdPy5ub2RlO1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NzY29wZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjID0gY2xhc3NzY29wZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYy5jbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuY2xhc3Nlc1tzYy5jbGFzc25hbWVdPy5tZW1iZXJzW3NjLm1ldGhvZG5hbWVdPy5ub2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8vZXhwb3J0ZWQgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuZnVuY3Rpb25zW3NjLm1ldGhvZG5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzY29wZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmV4dCB2YXJpYWJsZW5hbWVcclxuICAgICAqICovXHJcbiAgICBnZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHR5cGUuc3BsaXQoXCIuXCIpW3R5cGUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgZm9yICh2YXIgY291bnRlciA9IDE7IGNvdW50ZXIgPCAxMDAwOyBjb3VudGVyKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5tZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZGF0YS5tZVt2YXJuYW1lICsgY291bnRlcl0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFybmFtZSArIGNvdW50ZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNoYW5nZSBvYmplY3RsaXRlcmFsIHRvIG11dGxpbGluZSBpZiBuZWVkZWRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzd2l0Y2hUb011dGxpbGluZUlmTmVlZGVkKG5vZGU6IHRzLk5vZGUsIG5ld1Byb3BlcnR5OiBzdHJpbmcsIG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gbm9kZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgaWYgKG5vZGVbXCJtdWx0aUxpbmVcIl0gIT09IHRydWUpIHtcclxuICAgICAgICAgICAgdmFyIGxlbiA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0ucHJvcGVydGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzW3hdO1xyXG4gICAgICAgICAgICAgICAgbGVuICs9IChwcm9wLmluaXRpYWxpemVyLmVzY2FwZWRUZXh0ID8gcHJvcC5pbml0aWFsaXplci5lc2NhcGVkVGV4dC5sZW5ndGggOiBwcm9wLmluaXRpYWxpemVyLmdldFRleHQoKS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgbGVuICs9IHByb3AubmFtZS5lc2NhcGVkVGV4dC5sZW5ndGggKyA1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxlbik7XHJcbiAgICAgICAgICAgIGlmIChvbGRWYWx1ZS5pbmRleE9mKFwiXFxuXCIpID4gLTEgfHwgKGxlbiA+IDYwKSB8fCBuZXdWYWx1ZS5pbmRleE9mKFwiXFxuXCIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vb3JkZXIgYWxzbyBvbGQgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0ucHJvcGVydGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0ucHJvcGVydGllc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLnBvcyA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AubGVuID0gLTE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXSA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwobm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0ucHJvcGVydGllcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHNldFByb3BlcnR5SW5Db25maWcodmFyaWFibGVOYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCB0cy5Ob2RlLFxyXG4gICAgICAgIGlzRnVuY3Rpb246IGJvb2xlYW4gPSBmYWxzZSwgcmVwbGFjZTogYm9vbGVhbiA9IHVuZGVmaW5lZCxcclxuICAgICAgICBiZWZvcmU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlP30gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgc2NvcGU6IHRzLk5vZGUpIHtcclxuXHJcbiAgICAgICAgdmFyIHN2YWx1ZTogYW55ID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkgOiB2YWx1ZTtcclxuICAgICAgICB2YXIgY29uZmlnID0gPGFueT50aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcImNvbmZpZ1wiXVswXS5ub2RlO1xyXG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZy5hcmd1bWVudHNbMF07XHJcbiAgICAgICAgdmFyIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHksIDxhbnk+c3ZhbHVlKTtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiYWRkXCIgJiYgcmVwbGFjZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgcHJvcGVydHkgPSBcImNoaWxkcmVuXCI7XHJcbiAgICAgICAgICAgIHN2YWx1ZSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUgKyBcIi5jb25maWcoe30pXCIpIDogdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcImNoaWxkcmVuXCJdID09IHVuZGVmaW5lZCkgey8vXHJcbiAgICAgICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5LCB0cy5jcmVhdGVBcnJheUxpdGVyYWwoW3N2YWx1ZV0sIHRydWUpKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcm9wZXJ0aWVzLnB1c2gobmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYmVmb3JlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcImNoaWxkcmVuXCJdWzBdLm5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHMucHVzaChzdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcImNoaWxkcmVuXCJdWzBdLm5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhcnJheS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJyYXlbeF0uZ2V0VGV4dCgpID09PSBiZWZvcmUudmFsdWUgfHwgYXJyYXlbeF0uZ2V0VGV4dCgpLnN0YXJ0c1dpdGgoYmVmb3JlLnZhbHVlICsgXCIuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5zcGxpY2UoeCwgMCwgc3ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb2RlIFwiICsgYmVmb3JlLnZhbHVlICsgXCIgbm90IGZvdW5kLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgeyAgLy9jb21wLmFkZChhKSAtLT4gY29tcC5jb25maWcoe2NoaWxkcmVuOlthXX0pXHJcbiAgICAgICAgICAgIGlmIChyZXBsYWNlICE9PSBmYWxzZSAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7Ly9lZGl0IGV4aXN0aW5nXHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IGNvbmZpZy5wcm9wZXJ0aWVzLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgICAgICBjb25maWcucHJvcGVydGllc1twb3NdID0gbmV3RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9NdXRsaWxpbmVJZk5lZWRlZChjb25maWcsIHByb3BlcnR5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25maWcucHJvcGVydGllcy5wdXNoKG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb011dGxpbGluZUlmTmVlZGVkKGNvbmZpZywgcHJvcGVydHksIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyhcImNvcnJlY3Qgc3BhY2VzXCIpO1xyXG4gICAgICAgIHRoaXMucGFyc2UodGhpcy5nZXRNb2RpZmllZENvZGUoKSk7XHJcbiAgICAgICAgLy9pZiAocG9zID49IDApXHJcbiAgICAgICAgLy8gIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAxKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKiAgbW92ZVByb3BlcnRWYWx1ZUluQ29kZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbmV3VmFyaWFibGVOYW1lOiBzdHJpbmcsIGJlZm9yZVZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcImNvbmZpZ1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImFkZFwiKVxyXG4gICAgICAgICAgICAgICAgICBwcm9wZXJ0eSA9IFwiY2hpbGRyZW5cIjtcclxuICAgICAgICAgICAgICB2YXIgb2xkcGFyZW50OmFueT10aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgdmFsdWVOb2RlPW9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50c1t4XTtcclxuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlTm9kZS5nZXRUZXh0KCkgPT09IHZhbHVlIHx8dmFsdWVOb2RlLmdldFRleHQoKS5zdGFydHNXaXRoKHZhbHVlICsgXCIuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMuc3BsaWNlKHgsMSk7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgIH0qL1xyXG4gICAgLyoqXHJcbiAgICAqIG1vZGlmeSB0aGUgcHJvcGVydHkgaW4gY29kZVxyXG4gICAgKiBAcGFyYW0gdmFyaWFibGVuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAqIEBwYXJhbSAgcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgXHJcbiAgICAqIEBwYXJhbSB2YWx1ZSAtIHRoZSBuZXcgdmFsdWVcclxuICAgICogQHBhcmFtIGNsYXNzc2NvcGUgIC0gdGhlIHByb3BlcnR5IHdvdWxkIGJlIGluc2VydCBpbiB0aGlzIGJsb2NrXHJcbiAgICAqIEBwYXJhbSBpc0Z1bmN0aW9uICAtIHRydWUgaWYgdGhlIHByb3BlcnR5IGlzIGEgZnVuY3Rpb25cclxuICAgICogQHBhcmFtIFtyZXBsYWNlXSAgLSBpZiB0cnVlIHRoZSBvbGQgdmFsdWUgaXMgZGVsZXRlZFxyXG4gICAgKiBAcGFyYW0gW2JlZm9yZV0gLSB0aGUgbmV3IHByb3BlcnR5IGlzIHBsYWNlZCBiZWZvcmUgdGhpcyBwcm9wZXJ0eVxyXG4gICAgKiBAcGFyYW0gW3ZhcmlhYmxlc2NvcGVdIC0gaWYgdGhpcyBzY29wZSBpcyBkZWZpbmVkIC0gdGhlIG5ldyBwcm9wZXJ0eSB3b3VsZCBiZSBpbnNlcnQgaW4gdGhpcyB2YXJpYWJsZVxyXG4gICAgKi9cclxuICAgIHNldFByb3BlcnR5SW5Db2RlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgdHMuTm9kZSxcclxuICAgICAgICBjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLFxyXG4gICAgICAgIGlzRnVuY3Rpb246IGJvb2xlYW4gPSBmYWxzZSwgcmVwbGFjZTogYm9vbGVhbiA9IHVuZGVmaW5lZCxcclxuICAgICAgICBiZWZvcmU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlP30gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgdmFyaWFibGVzY29wZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZSB9ID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGNsYXNzc2NvcGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgY2xhc3NzY29wZSA9IHRoaXMuY2xhc3NTY29wZTtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldE5vZGVGcm9tU2NvcGUoY2xhc3NzY29wZSwgdmFyaWFibGVzY29wZSk7XHJcbiAgICAgICAgdmFyIG5ld0V4cHJlc3Npb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY29uZmlnXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUluQ29uZmlnKHZhcmlhYmxlTmFtZSwgcHJvcGVydHksIHZhbHVlLCBpc0Z1bmN0aW9uLCByZXBsYWNlLCBiZWZvcmUsIHNjb3BlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3VmFsdWU6IGFueSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgICAgdmFyIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gc2NvcGVbXCJib2R5XCJdLnN0YXRlbWVudHNcclxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIpIHsgLy9tZS5wYW5lbDE9bmV3IFBhbmVsKHt9KTtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcIl9uZXdfXCJdWzBdOy8vLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wLnZhbHVlO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgIHJlcGxhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IHByb3Aubm9kZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGxlZnQgPSBsZWZ0LnN1YnN0cmluZygwLCBsZWZ0LmluZGV4T2YoXCI9XCIpIC0gMSk7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJfbmV3X1wiO1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIobGVmdCksIG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgICAgIC8qXHR9ZWxzZXsvL3ZhciBoaD1uZXcgUGFuZWwoe30pXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uc3RyID0gcHJvcFswXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGdW5jdGlvbj10cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0V4cHJlc3Npb249dHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIoXCJtZS5cIitwcm9wZXJ0eSksIHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpKSk7XHRcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVDYWxsKHRzLmNyZWF0ZUlkZW50aWZpZXIodmFyaWFibGVOYW1lICsgXCIuXCIgKyBwcm9wZXJ0eSksIHVuZGVmaW5lZCwgW25ld1ZhbHVlXSkpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIodmFyaWFibGVOYW1lICsgXCIuXCIgKyBwcm9wZXJ0eSksIG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgaWYgKHJlcGxhY2UgIT09IGZhbHNlICYmIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHsvL2VkaXQgZXhpc3RpbmdcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl1bcG9zXSA9IG5ld0V4cHJlc3Npb247XHJcbiAgICAgICAgICAgIC8vaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAvLyAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7Ly9pbnNlcnQgbmV3XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUudmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIm5vdCBpbXBsZW1lbnRlZFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvID0gMDsgbyA8IHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldLmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldW29dLnZhbHVlID09PSBiZWZvcmUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldW29dLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlByb3BlcnR5IG5vdCBmb3VuZCBcIiArIGJlZm9yZS52YXJpYWJsZW5hbWUgKyBcIi5cIiArIGJlZm9yZS5wcm9wZXJ0eSArIFwiIHZhbHVlIFwiICsgYmVmb3JlLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMCwgbmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdHByb3A6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiX25ld19cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3VsZCBiZSBpbiB0aGUgc2FtZSBzY29wZSBvZiBkZWNsYXJhdGlvbiAoaW1wb3J0YW50IGZvciByZXBlYXRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50cyA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BdWzBdLm5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0bm9kZTogdHMuTm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BdW3RoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BdLmxlbmd0aCAtIDFdLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3Rub2RlLnBhcmVudCA9PT0gc2NvcGVbXCJib2R5XCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0cHJvcCA9IHRlc3Rub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3Rwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihsYXN0cHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0cHJvcC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MgKyAxLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHN0YXRlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwb3MgPiAwICYmIHN0YXRlbWVudHNbc3RhdGVtZW50cy5sZW5ndGggLSAxXS5nZXRUZXh0KCkuc3RhcnRzV2l0aChcInJldHVybiBcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHMuc3BsaWNlKHBvcywgMCwgbmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHN3YXBzIHR3byBzdGF0ZW1lbnRzIGluZGVuZGlmaWVkIGJ5ICBmdW5jdGlvbnBhcmFtZXRlciBpbiBhIHZhcmlhYmxlLnByb3BlcnR5KHBhcmFtZXRlcjEpIHdpdGggdmFyaWFibGUucHJvcGVydHkocGFyYW1ldGVyMilcclxuICAgICAqKi9cclxuICAgIHN3YXBQcm9wZXJ0eVdpdGhQYXJhbWV0ZXIodmFyaWFibGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgcGFyYW1ldGVyMTogc3RyaW5nLCBwYXJhbWV0ZXIyOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZmlyc3Q6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHNlY29uZDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV07XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJlbnQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFt4XS52YWx1ZS5zcGxpdChcIixcIilbMF0udHJpbSgpID09PSBwYXJhbWV0ZXIxKVxyXG4gICAgICAgICAgICAgICAgZmlyc3QgPSBwYXJlbnRbeF0ubm9kZTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFt4XS52YWx1ZS5zcGxpdChcIixcIilbMF0udHJpbSgpID09PSBwYXJhbWV0ZXIyKVxyXG4gICAgICAgICAgICAgICAgc2Vjb25kID0gcGFyZW50W3hdLm5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmlyc3QpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiUGFyYW1ldGVyIG5vdCBmb3VuZCBcIiArIHBhcmFtZXRlcjEpO1xyXG4gICAgICAgIGlmICghc2Vjb25kKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlBhcmFtZXRlciBub3QgZm91bmQgXCIgKyBwYXJhbWV0ZXIyKTtcclxuICAgICAgICB2YXIgaWZpcnN0ID0gZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGZpcnN0KTtcclxuICAgICAgICB2YXIgaXNlY29uZCA9IHNlY29uZC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yoc2Vjb25kKTtcclxuICAgICAgICBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdW2lmaXJzdF0gPSBzZWNvbmQ7XHJcbiAgICAgICAgZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXVtpc2Vjb25kXSA9IGZpcnN0O1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogYWRkcyBhbiBQcm9wZXJ0eVxyXG4gICAgKiBAcGFyYW0gdHlwZSAtIG5hbWUgb2YgdGhlIHR5cGUgbyBjcmVhdGVcclxuICAgICogQHBhcmFtIGNsYXNzc2NvcGUgLSB0aGUgc2NvcGUgKG1ldGhvZG5hbWUpIHdoZXJlIHRoZSB2YXJpYWJsZSBzaG91bGQgYmUgaW5zZXJ0IENsYXNzLmxheW91dFxyXG4gICAgKiBAcGFyYW0gdmFyaWFibGVzY29wZSAtIHRoZSBzY29wZSB3aGVyZSB0aGUgdmFyaWFibGUgc2hvdWxkIGJlIGluc2VydCBlLmcuIGhhbGxvLm9uY2xpY2tcclxuICAgICogQHJldHVybnMgIHRoZSBuYW1lIG9mIHRoZSBvYmplY3RcclxuICAgICovXHJcbiAgICBhZGRWYXJpYWJsZUluQ29kZShmdWxsdHlwZTogc3RyaW5nLCBjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLCB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChjbGFzc3Njb3BlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGNsYXNzc2NvcGUgPSB0aGlzLmNsYXNzU2NvcGU7XHJcbiAgICAgICAgbGV0IHR5cGUgPSBmdWxsdHlwZS5zcGxpdChcIi5cIilbZnVsbHR5cGUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5nZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlKTtcclxuICAgICAgICB2YXIgdXNlTWUgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW1wibWVcIl0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdXNlTWUgPSB0cnVlO1xyXG4gICAgICAgIC8vdmFyIGlmKHNjb3BlbmFtZSlcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBpZiAobm9kZT8ucGFyYW1ldGVycz8ubGVuZ3RoID4gMCAmJiBub2RlLnBhcmFtZXRlcnNbMF0ubmFtZS50ZXh0ID09IFwibWVcIikge1xyXG4gICAgICAgICAgICB1c2VNZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcmVmaXggPSB1c2VNZSA/IFwibWUuXCIgOiBcInZhciBcIjtcclxuXHJcbiAgICAgICAgdmFyIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gbm9kZVtcImJvZHlcIl0uc3RhdGVtZW50cztcclxuICAgICAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vIHNjb3BlIHRvIGluc2VydCBhIHZhcmlhYmxlIGNvdWxkIGJlIGZvdW5kXCIpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc3RhdGVtZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoIXN0YXRlbWVudHNbeF0uZ2V0VGV4dCgpLmluY2x1ZGVzKFwibmV3IFwiKSAmJiAhc3RhdGVtZW50c1t4XS5nZXRUZXh0KCkuaW5jbHVkZXMoXCJ2YXIgXCIpKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhc3MgPSB0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIocHJlZml4ICsgdmFybmFtZSksIHRzLmNyZWF0ZUlkZW50aWZpZXIoXCJuZXcgXCIgKyB0eXBlICsgXCIoKVwiKSk7XHJcbiAgICAgICAgc3RhdGVtZW50cy5zcGxpY2UoeCwgMCwgdHMuY3JlYXRlU3RhdGVtZW50KGFzcykpO1xyXG4gICAgICAgIGlmICh1c2VNZSlcclxuICAgICAgICAgICAgdGhpcy5hZGRUeXBlTWUodmFybmFtZSwgdHlwZSk7XHJcbiAgICAgICAgcmV0dXJuICh1c2VNZSA/IFwibWUuXCIgOiBcIlwiKSArIHZhcm5hbWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgYXdhaXQgdHlwZXNjcmlwdC53YWl0Rm9ySW5pdGVkO1xyXG4gICAgdmFyIGNvZGUgPSB0eXBlc2NyaXB0LmdldENvZGUoXCJkZS9EaWFsb2cudHNcIik7XHJcbiAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gICAgLy8gY29kZSA9IFwiZnVuY3Rpb24gdGVzdCgpeyB2YXIgaGFsbG89e307dmFyIGgyPXt9O3ZhciBwcHA9e307aGFsbG8ucD05O2hhbGxvLmNvbmZpZyh7YToxLGI6MiwgazpoMi5jb25maWcoe2M6MSxqOnBwcC5jb25maWcoe3BwOjl9KX0pICAgICB9KTsgfVwiO1xyXG4gICAgLy8gY29kZSA9IFwiZnVuY3Rpb24odGVzdCl7IHZhciBoYWxsbz17fTt2YXIgaDI9e307dmFyIHBwcD17fTtoYWxsby5wPTk7aGFsbG8uY29uZmlnKHthOjEsYjoyLCBrOmgyLmNvbmZpZyh7YzoxfSxqKCl7ajIudWRvPTl9KSAgICAgfSk7IH1cIjtcclxuICAgLy8gY29kZSA9IFwiZnVuY3Rpb24gdGVzdCgpe3ZhciBwcHA7dmFyIGFhYT1uZXcgQnV0dG9uKCk7cHBwLmNvbmZpZyh7YTpbOSw2XSwgIGNoaWxkcmVuOltsbC5jb25maWcoe30pLGFhYS5jb25maWcoe3U6MSxvOjIsY2hpbGRyZW46W2trLmNvbmZpZyh7fSldfSldfSk7fVwiO1xyXG4gICAgLy9wYXJzZXIucGFyc2UoY29kZSwgdW5kZWZpbmVkKTtcclxuICAgIHBhcnNlci5wYXJzZShjb2RlLFt7Y2xhc3NuYW1lOlwiRGlhbG9nXCIsbWV0aG9kbmFtZTpcImxheW91dFwifV0pO1xyXG4gICAgZGVidWdnZXI7XHJcbiAgICB2YXIgbm9kZSA9IHBhcnNlci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBcIm1lLnRleHRib3gxXCIsIFwibWUucGFuZWwxXCIpO1xyXG4gICAgcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwidGhpc1wiLFwiYWRkXCIsbm9kZSxbe2NsYXNzbmFtZTpcIkRpYWxvZ1wiLG1ldGhvZG5hbWU6XCJsYXlvdXRcIn1dLHRydWUsZmFsc2UpO1xyXG4gICAgLy92YXIgbm9kZSA9IHBhcnNlci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBcImtrXCIsIFwiYWFhXCIpO1xyXG5cclxuICAgIC8vdmFyIG5vZGU9cGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIFwibGxcIiwgXCJwcHBcIik7XHJcbiAgICAvL3BhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcImFhYVwiLFwiYWRkXCIsbm9kZSxbe2NsYXNzbmFtZTp1bmRlZmluZWQsIG1ldGhvZG5hbWU6XCJ0ZXN0XCJ9XSx0cnVlLGZhbHNlLHVuZGVmaW5lZCx1bmRlZmluZWQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhub2RlLmdldFRleHQoKSk7XHJcbiAgICAvLyAgICBwYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJwcHBcIixcImFkZFwiLFwiY2NcIixbe2NsYXNzbmFtZTp1bmRlZmluZWQsIG1ldGhvZG5hbWU6XCJ0ZXN0XCJ9XSx0cnVlLGZhbHNlLHt2YXJpYWJsZW5hbWU6XCJwcHBcIixwcm9wZXJ0eTpcImFkZFwiLHZhbHVlOlwibGxcIn0pO1xyXG4gICAgLy8gIHBhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcImFhYVwiLFwiYWRkXCIsXCJjY1wiLFt7Y2xhc3NuYW1lOnVuZGVmaW5lZCwgbWV0aG9kbmFtZTpcInRlc3RcIn1dLHRydWUsZmFsc2Use3ZhcmlhYmxlbmFtZTpcImFhYVwiLHByb3BlcnR5OlwiYWRkXCIsdmFsdWU6XCJra1wifSk7XHJcbiAgICBjb25zb2xlLmxvZyhwYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCkpO1xyXG4gICAgLy8gZGVidWdnZXI7XHJcbiAgICAvKiAgY29uc3QgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoeyBuZXdMaW5lOiB0cy5OZXdMaW5lS2luZC5MaW5lRmVlZCB9KTtcclxuICAgICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCBmYWxzZSwgdHMuU2NyaXB0S2luZC5UUyk7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBwYXJzZXIuc291cmNlRmlsZSwgcmVzdWx0RmlsZSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7Ki9cclxuXHJcblxyXG5cclxufVxyXG5cclxuXHJcbiJdfQ==