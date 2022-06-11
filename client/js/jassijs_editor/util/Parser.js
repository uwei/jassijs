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
                var _this = this;
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
                    node.arguments.forEach((arg) => {
                        var _a, _b, _c;
                        params.push(arg.getText());
                        if (((_c = (_b = (_a = arg) === null || _a === void 0 ? void 0 : _a.expression) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.getText()) === "config") {
                            _this.parseConfig(arg);
                        }
                        //arg.getText().indexOf(".config(")
                    });
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
                        try {
                            if (pos > 0 && statements[statements.length - 1].getText().startsWith("return "))
                                pos--;
                        }
                        catch (_a) {
                        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWVBLE1BQU0sZUFBZTtRQUFyQjtZQUdJLG9CQUFlLEdBQWMsRUFBRSxDQUFDO1lBQ2hDLGNBQVMsR0FBYyxFQUFFLENBQUM7UUFFOUIsQ0FBQztLQUFBO0lBQ0QsTUFBTSxZQUFZO1FBQWxCO1lBR0ksY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFFekQsQ0FBQztLQUFBO0lBQ0QsTUFBYSxXQUFXO1FBQXhCO1lBS0ksWUFBTyxHQUFzQyxFQUFFLENBQUM7WUFDaEQsY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBUEQsa0NBT0M7SUFFRCxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFNO1FBZ0JmOzs7V0FHRztRQUNIO1lBbkJBLGVBQVUsR0FBa0IsU0FBUyxDQUFDO1lBRXRDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1lBQ3ZDLFlBQU8sR0FBb0MsRUFBRSxDQUFDO1lBQzlDLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1lBQ3pDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBQzVDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBZXhDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRCxlQUFlO1lBQ1gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdkUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0gsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFLRDs7Ozs7O1dBTUc7UUFDSyxHQUFHLENBQUMsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFBRSxJQUFhLEVBQUUsVUFBVSxHQUFHLEtBQUs7WUFFNUYsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJO2dCQUNyQyxPQUFPO1lBQ1gsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzVCO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDdEM7WUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDL0IsS0FBSyxFQUFFLEtBQUs7b0JBQ1osSUFBSSxFQUFFLElBQUk7b0JBQ1YsVUFBVTtpQkFDYixDQUFDLENBQUM7YUFDTjtRQUNMLENBQUM7UUFDRDs7OztXQUlHO1FBQ0gsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVE7WUFDL0IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ2pELE9BQU8sR0FBRyxDQUFDO2lCQUNkO2FBQ0o7WUFDRCxPQUFPLFNBQVMsQ0FBQztZQUNqQjs7Ozs7Z0JBS0k7WUFDSixPQUFPO1lBQ1AsaUdBQWlHO1FBRXJHLENBQUM7UUFFRCxTQUFTLENBQUMsSUFBWSxFQUFFLElBQVk7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO2dCQUNoQixPQUFPO1lBQ1gsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQ0Q7Ozs7V0FJRztRQUNILGlCQUFpQixDQUFDLElBQVksRUFBRSxJQUFZO1lBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLFlBQVk7Z0JBQ1osSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkksSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUMzRztRQUNMLENBQUM7UUFDTyxlQUFlLENBQUMsSUFBYTtZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFO2dCQUN6QyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFVO29CQUN4QyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7d0JBQ1osSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQzNCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDckMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7cUJBQ3pFO29CQUNELHdGQUF3RjtnQkFDNUYsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNPLGVBQWUsQ0FBQyxHQUFRO1lBQzVCLElBQUksR0FBRyxLQUFLLFNBQVM7Z0JBQ2pCLE9BQU8sU0FBUyxDQUFDO1lBRXJCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHVCQUF1QixFQUFFO2dCQUNwRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDM0IsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO29CQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3hFO2lCQUNKO2dCQUNELE9BQU8sR0FBRyxDQUFDO2FBQ2Q7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFO2dCQUNqRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7YUFDbkI7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUU7Z0JBQzFELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7YUFDZDtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQzlDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQzthQUNuQjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUU7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFO2dCQUNoRCxPQUFPLEtBQUssQ0FBQzthQUNoQjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2xELE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2pELE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3hCO1lBRUQsTUFBTSxzQkFBc0IsQ0FBQztRQUNqQyxDQUFDO1FBQ08sY0FBYyxDQUFDLEdBQWlCO1lBQ3BDLElBQUksRUFBRSxHQUFRLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNoQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM3QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7YUFDdEI7aUJBQU07Z0JBRUgsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztnQkFDckMsSUFBSSxFQUFFLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMxQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoRSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7cUJBQ2pEO2lCQUVKO2FBQ0o7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFFTyxVQUFVLENBQUMsSUFBcUI7WUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzlDLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3ZDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUM7Z0JBQzdDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7b0JBQy9CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzdDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4RCxXQUFXLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQ2xELElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDOzRCQUNqRSxXQUFXLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDOUU7aUJBQ0o7Z0JBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdDLElBQUksU0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7b0JBQ2xDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVM7d0JBQ3RCLFNBQVMsQ0FBQSxhQUFhO29CQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUN0QyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4RSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7b0JBQ2hELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO3dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQzVDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2RCxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7eUJBQ25EO3FCQUNKO2lCQUNKO2dCQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixJQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssV0FBVyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTs0QkFDM0UsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDOzRCQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUM1QjtxQkFDSjtpQkFDSjthQUNKO1FBQ0wsQ0FBQztRQUNELFdBQVcsQ0FBQyxJQUF1QjtZQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ2hCLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxZQUFZO29CQUNaLElBQUksS0FBSyxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO29CQUNoRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7d0JBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNuQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs0QkFDOUIsMERBQTBEOzRCQUMxRCxJQUFJLElBQUksR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7NEJBQzlFLElBQUksQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQzs2QkFDOUM7NEJBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7eUJBQ25EO3FCQUNKO2lCQUNKO2FBQ0o7UUFDTCxDQUFDO1FBQ0QsZUFBZSxDQUFDLElBQWE7WUFDekIsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQy9CLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7b0JBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDdEQ7YUFDSjtZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7Z0JBQ3RGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxLQUFLLENBQUM7Z0JBQ1YsSUFBSSxLQUFLLENBQUM7Z0JBQ1YsSUFBSSxJQUFZLENBQUM7Z0JBQ2pCLElBQUksS0FBYSxDQUFDO2dCQUNsQixJQUFJLEtBQUssR0FBQyxJQUFJLENBQUM7Z0JBQ2YsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDN0IsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ2xCLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUNuQixJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUEsb0RBQW9EO29CQUMzRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUEsbURBQW1EO29CQUMzRSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3dCQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNCLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDdkIsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDbEIsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBLG9EQUFvRDtvQkFDM0UsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFOzt3QkFFM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDM0IsSUFBRyxDQUFBLE1BQUEsTUFBQSxNQUFNLEdBQUksMENBQUUsVUFBVSwwQ0FBRSxJQUFJLDBDQUFFLE9BQU8sRUFBRSxNQUFHLFFBQVEsRUFBQzs0QkFDbEQsS0FBSyxDQUFDLFdBQVcsQ0FBTSxHQUFHLENBQUMsQ0FBQzt5QkFDL0I7d0JBQ0EsbUNBQW1DO29CQUN4QyxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQzFCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3BDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDcEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO3dCQUNkLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7NEJBQ3RDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDdEM7d0JBQ0QsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN2QixPQUFPO3FCQUNWO29CQUNELEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEscURBQXFEO2lCQUNsRjtnQkFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztnQkFDZCxJQUFJLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDaEIsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUN0QyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7aUJBQ3RDO2dCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQzthQUM1RDs7Z0JBQ0csSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBQ08sU0FBUyxDQUFDLElBQWE7WUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFO2dCQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDNUM7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDL0MsSUFBSSxFQUFFLEdBQVEsSUFBSSxDQUFDO2dCQUNuQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztnQkFDbkMsSUFBSSxFQUFFLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO29CQUNsRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7b0JBQ25ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNsRDtpQkFDSjthQUNKO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQy9FLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDOUI7aUJBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3JELElBQUksQ0FBQyxVQUFVLENBQWtCLElBQUksQ0FBQyxDQUFDO2FBRTFDO2lCQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLHdCQUF3QjtnQkFDekYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxVQUFVOzRCQUNuRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNsQztpQkFDSjs7b0JBQ0csSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNsQzs7Z0JBQ0csSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCx3QkFBd0I7WUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7Z0JBQ2pGLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ2xEO1FBQ0wsQ0FBQztRQUNELGVBQWUsQ0FBQyxJQUFhLEVBQUUsR0FBVztZQUN0QyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDOUIsT0FBTztvQkFDSCxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7b0JBQ3RDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztpQkFDaEMsQ0FBQTthQUNKO1lBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLEVBQUMsd0JBQXdCO2dCQUNsRixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFBO2dCQUNoQyxPQUFPO29CQUNILFNBQVMsRUFBRSxTQUFTO29CQUNwQixVQUFVLEVBQUUsUUFBUTtpQkFDdkIsQ0FBQTthQUNKO1lBQ0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7b0JBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLElBQUk7d0JBQ0osT0FBTyxJQUFJLENBQUM7aUJBQ25CO2FBQ0o7WUFBQSxDQUFDO1lBQ0YsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELHlCQUF5QixDQUFDLElBQVksRUFBRSxHQUFXO1lBQy9DLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFFakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVuRixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNsRCwwQ0FBMEM7UUFFOUMsQ0FBQztRQUNEOzs7O1VBSUU7UUFDRixLQUFLLENBQUMsSUFBWSxFQUFFLGFBQTBELFNBQVM7WUFDbkYsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLFVBQVUsS0FBSyxTQUFTO2dCQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQzs7Z0JBRTdCLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBRWpDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFaEMsMENBQTBDO1FBQzlDLENBQUM7UUFDTyxVQUFVLENBQUMsSUFBYTtZQUM1QixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNoRDtpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDakQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDNUQ7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzdDO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ2hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNoRDtpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM5QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDOUM7O2dCQUNHLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFDRDs7WUFFSTtRQUNKLGlCQUFpQixDQUFDLE1BQW9CLEVBQUUsTUFBbUI7WUFDdkQsYUFBYTtZQUNiLGlDQUFpQztZQUNqQyxJQUFJLE1BQU0sR0FBbUIsU0FBUyxDQUFDO1lBQ3ZDLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDOUIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLE1BQU07b0JBQ1AsTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFDaEIsc0JBQXNCO2dCQUN0Qiw2QkFBNkI7Z0JBQzdCLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQztnQkFDdkIsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO29CQUNmLE1BQU0sR0FBRyxFQUFFLENBQUM7b0JBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMzQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdEQ7aUJBQ0o7Z0JBQ0QsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDekM7WUFDRCxzQkFBc0I7WUFDdEIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JJLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztZQUNyQixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7Z0JBQzVCLElBQUksR0FBRyxLQUFLLE1BQU0sQ0FBQyxJQUFJO29CQUNuQixJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUE7YUFDdEM7WUFDRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBRTFDO2lCQUFNO2dCQUNILElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQzthQUMzQztZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUNyQyxNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUM1QixDQUFDO1FBQ0Q7Ozs7O1VBS0U7UUFDRixvQkFBb0IsQ0FBQyxRQUFnQixFQUFFLFNBQVMsR0FBRyxTQUFTLEVBQUUsZUFBdUIsU0FBUzs7WUFDMUYsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtnQkFDN0csUUFBUSxHQUFHLFVBQVUsQ0FBQztnQkFDdEIsSUFBSSxTQUFTLEdBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQy9ELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzVELElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNsRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxTQUFTLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEVBQUU7d0JBQ3RGLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBRTVDLElBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs0QkFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDOUI7d0JBQ0QsT0FBTyxTQUFTLENBQUM7cUJBQ3BCO2lCQUVKO2FBQ0o7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUMxRixJQUFJLElBQUksR0FBVSxTQUFTLENBQUM7Z0JBQzVCLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtvQkFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMvRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsSUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUNoSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDL0M7cUJBQ0o7aUJBQ0o7O29CQUNHLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLElBQUksSUFBSSxTQUFTO29CQUNqQixPQUFPO2dCQUNYLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMzQixJQUFHLENBQUEsTUFBQSxNQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLDBDQUFFLFNBQVMsMENBQUUsTUFBTSxJQUFDLENBQUMsRUFBQztvQkFDNUMsT0FBTyxNQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLDBDQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDaEQ7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNqQjs7Ozs7bUJBS0c7Z0JBQ0gseUNBQXlDO2dCQUN6QywrQkFBK0I7Z0JBQy9CLHNCQUFzQjthQUN6QjtRQUVMLENBQUM7UUFDRDs7O1dBR0c7UUFDSCxvQkFBb0IsQ0FBQyxPQUFlOztZQUVoQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzlCLElBQUksUUFBUSxHQUFZLEVBQUUsQ0FBQztZQUMzQixJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUztnQkFDNUUsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELG1CQUFtQjtZQUNuQixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtnQkFDbEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ2hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2FBQ047WUFDRCxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0MsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixDQUFDLENBQUMsQ0FBQzthQUNOO1lBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JDO1lBQ0Qsc0NBQXNDO1lBQ3RDLEtBQUssSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7b0JBQ2xCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDakIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNwQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sR0FBRyxPQUFPLEVBQUU7Z0NBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOzZCQUMzQjt5QkFDSjt3QkFDRCxnQkFBZ0I7d0JBQ2hCLFlBQVk7d0JBQ1osSUFBSSxRQUFRLEdBQUcsTUFBQSxNQUFBLE1BQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJLDBDQUFFLFdBQVcsMENBQUUsUUFBUSxDQUFDO3dCQUN6RCxJQUFJLFFBQVEsRUFBRTs0QkFDVixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDdEMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssT0FBTyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEVBQUU7b0NBQ2hGLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBRWhDOzZCQUNKOzRCQUNELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0NBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksQ0FBQyxDQUFDOzZCQUN2Qzt5QkFDSjtxQkFDSjtpQkFDSjthQUNKO1FBRUwsQ0FBQztRQUNPLGdCQUFnQixDQUFDLFVBQXVELEVBQUUsZ0JBQXNELFNBQVM7O1lBQzdJLElBQUksS0FBSyxDQUFDO1lBQ1YsSUFBSSxhQUFhLEVBQUU7Z0JBQ2YsS0FBSyxHQUFHLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJLENBQUM7Z0JBQ2pGLEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6QztpQkFBTTtnQkFDSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7d0JBQ2QsS0FBSyxHQUFHLE1BQUEsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsMENBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsMENBQUUsSUFBSSxDQUFDO3dCQUNqRSxJQUFJLEtBQUs7NEJBQ0wsTUFBTTtxQkFDYjt5QkFBTSxFQUFDLG1CQUFtQjt3QkFDdkIsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUN6QztpQkFDSjthQUNKO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNEOzthQUVLO1FBQ0wsMEJBQTBCLENBQUMsSUFBWTtZQUNuQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hFLEtBQUssSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE9BQU8sR0FBRyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQzdDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxTQUFTO29CQUMzRSxNQUFNO2FBQ2I7WUFDRCxPQUFPLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDN0IsQ0FBQztRQUNEOztXQUVHO1FBQ0sseUJBQXlCLENBQUMsSUFBYSxFQUFFLFdBQW1CLEVBQUUsUUFBUTtZQUMxRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDOUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUM1QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDcEUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2hILEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2lCQUMzQztnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtvQkFDMUUseUJBQXlCO29CQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNwRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckQsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUNqQjtvQkFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDdEc7YUFDSjtRQUNMLENBQUM7UUFDTyxtQkFBbUIsQ0FBQyxZQUFvQixFQUFFLFFBQWdCLEVBQUUsS0FBdUIsRUFDdkYsYUFBc0IsS0FBSyxFQUFFLFVBQW1CLFNBQVMsRUFDekQsU0FBNEQsU0FBUyxFQUNyRSxLQUFjO1lBRWQsSUFBSSxNQUFNLEdBQVEsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNqRixJQUFJLE1BQU0sR0FBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM1RCxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLGFBQWEsR0FBRyxFQUFFLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFPLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZFLElBQUksUUFBUSxLQUFLLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO2dCQUN6QyxRQUFRLEdBQUcsVUFBVSxDQUFDO2dCQUN0QixNQUFNLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3hGLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxTQUFTLEVBQUUsRUFBQyxFQUFFO29CQUNyRCxhQUFhLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUM3RixNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDekM7cUJBQU07b0JBQ0gsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO3dCQUN0QixZQUFZO3dCQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUNqRjt5QkFBTTt3QkFDSCxZQUFZO3dCQUNaLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUM7d0JBQzdFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNuQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsRUFBRTtnQ0FDMUYsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dDQUMzQixPQUFPOzZCQUNWO3lCQUNKO3dCQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLENBQUM7cUJBQzNEO2lCQUVKO2FBQ0o7aUJBQU0sRUFBRyw2Q0FBNkM7Z0JBQ25ELElBQUksT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRSxFQUFDLGVBQWU7b0JBQy9ILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29CQUNyRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDMUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUMzRDtxQkFBTTtvQkFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQzNEO2FBQ0o7WUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztZQUNuQyxlQUFlO1lBQ2YsNkNBQTZDO1FBRWpELENBQUM7UUFDRDs7Ozs7Ozs7Ozs7O2FBWUs7UUFDTDs7Ozs7Ozs7OztVQVVFO1FBQ0YsaUJBQWlCLENBQUMsWUFBb0IsRUFBRSxRQUFnQixFQUFFLEtBQXVCLEVBQzdFLFVBQXVELEVBQ3ZELGFBQXNCLEtBQUssRUFBRSxVQUFtQixTQUFTLEVBQ3pELFNBQTRELFNBQVMsRUFDckUsZ0JBQXNELFNBQVM7WUFDL0QsSUFBSSxVQUFVLEtBQUssU0FBUztnQkFDeEIsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM3RCxJQUFJLGFBQWEsR0FBRyxTQUFTLENBQUM7WUFDOUIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDakQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUM1RixPQUFPO2FBQ1Y7WUFDRCxJQUFJLFFBQVEsR0FBUSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ25GLElBQUksVUFBVSxHQUFtQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFBO1lBQ3pELElBQUksUUFBUSxLQUFLLEtBQUssRUFBRSxFQUFFLDBCQUEwQjtnQkFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBLGlCQUFpQjtnQkFDaEUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDeEIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN6RyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNmLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxRQUFRLEdBQUcsT0FBTyxDQUFDO2dCQUNuQixhQUFhLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdkc7Ozs7Ozs7dUJBT087YUFDVjtpQkFBTSxJQUFJLFVBQVUsRUFBRTtnQkFDbkIsYUFBYSxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxSTs7Z0JBQ0csYUFBYSxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwSSxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUUsRUFBQyxlQUFlO2dCQUMvSCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDckQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO2dCQUMvQyxlQUFlO2dCQUNmLDZDQUE2QzthQUNoRDtpQkFBTSxFQUFDLFlBQVk7Z0JBQ2hCLElBQUksTUFBTSxFQUFFO29CQUNSLElBQUksTUFBTSxDQUFDLEtBQUssS0FBSyxTQUFTO3dCQUMxQixNQUFNLGlCQUFpQixDQUFDO29CQUM1QixJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7b0JBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM3RSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLEtBQUssRUFBRTs0QkFDM0UsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7NEJBQy9ELE1BQU07eUJBQ1Q7cUJBQ0o7b0JBQ0QsSUFBSSxDQUFDLElBQUk7d0JBQ0wsTUFBTSxLQUFLLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsR0FBRyxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNoSCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbEQsSUFBSSxHQUFHLElBQUksQ0FBQzt3QkFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2lCQUMvRDtxQkFBTTtvQkFDSCxJQUFJLFFBQVEsR0FBWSxTQUFTLENBQUM7b0JBQ2xDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRTt3QkFDdEMsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFOzRCQUNsQixxRUFBcUU7NEJBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQ3hFLFNBQVM7eUJBQ1o7d0JBQ0QsSUFBSSxRQUFRLEdBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQ3JHLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDOzRCQUNqQyxRQUFRLEdBQUcsUUFBUSxDQUFDO3FCQUMzQjtvQkFDRCxJQUFJLFFBQVEsRUFBRTt3QkFDVixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFDMUQsSUFBSSxHQUFHLElBQUksQ0FBQzs0QkFDUixRQUFRLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztxQkFDdkU7eUJBQU07d0JBQ0gsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQzt3QkFDNUIsSUFBRzs0QkFDQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztnQ0FDNUUsR0FBRyxFQUFFLENBQUM7eUJBQ2I7d0JBQUEsV0FBSzt5QkFFTDt3QkFDRCxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7cUJBQzVDO2lCQUNKO2FBQ0o7UUFDTCxDQUFDO1FBQ0Q7O1lBRUk7UUFDSix5QkFBeUIsQ0FBQyxRQUFnQixFQUFFLFFBQWdCLEVBQUUsVUFBa0IsRUFBRSxVQUFrQjtZQUNoRyxJQUFJLEtBQUssR0FBWSxTQUFTLENBQUM7WUFDL0IsSUFBSSxNQUFNLEdBQVksU0FBUyxDQUFDO1lBQ2hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssVUFBVTtvQkFDbkQsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzNCLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssVUFBVTtvQkFDbkQsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7YUFDL0I7WUFDRCxJQUFJLENBQUMsS0FBSztnQkFDTixNQUFNLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsTUFBTTtnQkFDUCxNQUFNLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLENBQUMsQ0FBQztZQUNyRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2RCxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRCxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUM1QyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUdoRCxDQUFDO1FBQ0Q7Ozs7OztVQU1FO1FBQ0YsaUJBQWlCLENBQUMsUUFBZ0IsRUFBRSxVQUF1RCxFQUFFLGdCQUFzRCxTQUFTOztZQUN4SixJQUFJLFVBQVUsS0FBSyxTQUFTO2dCQUN4QixVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9ELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVM7Z0JBQzdCLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsbUJBQW1CO1lBQ25CLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDNUQsWUFBWTtZQUNaLElBQUksQ0FBQSxNQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxVQUFVLDBDQUFFLE1BQU0sSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtnQkFDdEUsS0FBSyxHQUFHLElBQUksQ0FBQzthQUNoQjtZQUNELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFFcEMsSUFBSSxVQUFVLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFDekQsSUFBSSxJQUFJLEtBQUssU0FBUztnQkFDbEIsTUFBTSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztZQUNoRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztvQkFDdEYsTUFBTTthQUNiO1lBQ0QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNoSCxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQUksS0FBSztnQkFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUMxQyxDQUFDO0tBQ0osQ0FBQTtJQWwxQlksTUFBTTtRQURsQixJQUFBLGNBQU0sRUFBQyw0QkFBNEIsQ0FBQzs7T0FDeEIsTUFBTSxDQWsxQmxCO0lBbDFCWSx3QkFBTTtJQW8xQlosS0FBSyxVQUFVLElBQUk7UUFDdEIsTUFBTSxvQkFBVSxDQUFDLGFBQWEsQ0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5QyxJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQzFCLGtKQUFrSjtRQUNsSiwwSUFBMEk7UUFDM0ksMkpBQTJKO1FBQzFKLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELFFBQVEsQ0FBQztRQUNULElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsU0FBUyxFQUFDLFFBQVEsRUFBQyxVQUFVLEVBQUMsUUFBUSxFQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDbEcsNkRBQTZEO1FBRTdELDJEQUEyRDtRQUMzRCx1SEFBdUg7UUFDdkgsOEJBQThCO1FBQzlCLHNKQUFzSjtRQUN0SixvSkFBb0o7UUFDcEosT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLENBQUMsQ0FBQztRQUN0QyxZQUFZO1FBQ1o7OztnQ0FHd0I7SUFJNUIsQ0FBQztJQTVCRCxvQkE0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcblxyXG5cclxuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiO1xyXG5cclxuXHJcbmludGVyZmFjZSBQcm9wZXJ0aWVzIHtcclxuICAgIFtkZXRhaWxzOiBzdHJpbmddOiBFbnRyeTtcclxufVxyXG5pbnRlcmZhY2UgRW50cnkge1xyXG4gICAgdmFsdWU/OiBhbnk7XHJcbiAgICBub2RlPzogdHMuTm9kZTtcclxuICAgIGlzRnVuY3Rpb246IGJvb2xlYW47XHJcbn1cclxuY2xhc3MgUGFyc2VkRGVjb3JhdG9yIHtcclxuICAgIG5vZGU/OiB0cy5EZWNvcmF0b3I7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgcGFyc2VkUGFyYW1ldGVyPzogb2JqZWN0W10gPSBbXTtcclxuICAgIHBhcmFtZXRlcj86IHN0cmluZ1tdID0gW107XHJcblxyXG59XHJcbmNsYXNzIFBhcnNlZE1lbWJlciB7XHJcbiAgICBub2RlPzogdHMuTm9kZTtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBkZWNvcmF0b3I/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWREZWNvcmF0b3IgfSA9IHt9O1xyXG4gICAgdHlwZT86IHN0cmluZztcclxufVxyXG5leHBvcnQgY2xhc3MgUGFyc2VkQ2xhc3Mge1xyXG4gICAgcGFyZW50PzogUGFyc2VyO1xyXG4gICAgbm9kZT86IHRzLkNsYXNzRWxlbWVudDtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBmdWxsQ2xhc3NuYW1lPzogc3RyaW5nO1xyXG4gICAgbWVtYmVycz86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZE1lbWJlciB9ID0ge307XHJcbiAgICBkZWNvcmF0b3I/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWREZWNvcmF0b3IgfSA9IHt9O1xyXG59XHJcbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlBhcnNlclwiKVxyXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcclxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUgPSB1bmRlZmluZWQ7XHJcbiAgICB0eXBlTWVOb2RlOiB0cy5Ob2RlO1xyXG4gICAgdHlwZU1lOiB7IFtuYW1lOiBzdHJpbmddOiBFbnRyeSB9ID0ge307XHJcbiAgICBjbGFzc2VzOiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWRDbGFzcyB9ID0ge307XHJcbiAgICBpbXBvcnRzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG4gICAgZnVuY3Rpb25zOiB7IFtuYW1lOiBzdHJpbmddOiB0cy5Ob2RlIH0gPSB7fTtcclxuICAgIHZhcmlhYmxlczogeyBbbmFtZTogc3RyaW5nXTogdHMuTm9kZSB9ID0ge307XHJcbiAgICBjbGFzc1Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdO1xyXG5cclxuICAgIGNvZGU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgKiBAbWVtYmVyIHtPYmplY3QuPHN0cmluZyxPYmplY3QuPHN0cmluZyxbb2JqZWN0XT4+IC0gYWxsIHByb3BlcnRpZXNcclxuICAgICogZS5nLiBkYXRhW1widGV4dGJveDFcIl1bdmFsdWVdLT5FbnRyeVxyXG4gICAgKi9cclxuICAgIGRhdGE6IHsgW3ZhcmlhYmxlOiBzdHJpbmddOiB7IFtwcm9wZXJ0eTogc3RyaW5nXTogRW50cnlbXSB9IH07XHJcbiAgICAvKipcclxuICAgICAqIHBhcnNlcyBDb2RlIGZvciBVSSByZWxldmFudCBzZXR0aW5nc1xyXG4gICAgICogQGNsYXNzIGphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcclxuICAgICAgICAvKioge1tzdHJpbmddfSAtIGFsbCBjb2RlIGxpbmVzKi9cclxuICAgIH1cclxuXHJcbiAgICBnZXRNb2RpZmllZENvZGUoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcih7IG5ld0xpbmU6IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdEZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFwiZHVtbXkudHNcIiwgXCJcIiwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgLypzZXRQYXJlbnROb2RlcyovIGZhbHNlLCB0cy5TY3JpcHRLaW5kLlRTKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgdGhpcy5zb3VyY2VGaWxlLCByZXN1bHRGaWxlKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGEgcHJvcGVydHlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJpYWJsZSAtIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAtIGNvZGUgLSB0aGUgdmFsdWVcclxuICAgICAqIEBwYXJhbSBub2RlIC0gdGhlIG5vZGUgb2YgdGhlIHN0YXRlbWVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZCh2YXJpYWJsZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBub2RlOiB0cy5Ob2RlLCBpc0Z1bmN0aW9uID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5LnRyaW0oKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZV0gPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcclxuICAgICAgICAgICAgICAgIGlzRnVuY3Rpb25cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGEgcHJvcGVydHkgdmFsdWUgZnJvbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFyaWFibGUgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHlcclxuICAgICAqL1xyXG4gICAgZ2V0UHJvcGVydHlWYWx1ZSh2YXJpYWJsZSwgcHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XVswXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAvKiB2YXJpYWJsZT1cInRoaXMuXCIrdmFyaWFibGU7XHJcbiAgICAgICAgIGlmKHRoaXMuZGF0YVt2YXJpYWJsZV0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgaWYodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XVswXS52YWx1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSovXHJcbiAgICAgICAgLy90aGlzIFxyXG4gICAgICAgIC8vICAgdmFyIHZhbHVlPXRoaXMucHJvcGVydHlFZGl0b3IucGFyc2VyLmdldFByb3BlcnR5VmFsdWUodGhpcy52YXJpYWJsZW5hbWUsdGhpcy5wcm9wZXJ0eS5uYW1lKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkVHlwZU1lKG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnR5cGVNZU5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdHAgPSB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZSh0eXBlLCBbXSk7XHJcbiAgICAgICAgdmFyIG5ld25vZGUgPSB0cy5jcmVhdGVQcm9wZXJ0eVNpZ25hdHVyZSh1bmRlZmluZWQsIG5hbWUgKyBcIj9cIiwgdW5kZWZpbmVkLCB0cCwgdW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLnR5cGVNZU5vZGVbXCJtZW1iZXJzXCJdLnB1c2gobmV3bm9kZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGFkZCBpbXBvcnQge25hbWV9IGZyb20gZmlsZVxyXG4gICAgICogQHBhcmFtIG5hbWUgXHJcbiAgICAgKiBAcGFyYW0gZmlsZSBcclxuICAgICAqL1xyXG4gICAgYWRkSW1wb3J0SWZOZWVkZWQobmFtZTogc3RyaW5nLCBmaWxlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBvcnRzW25hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBpbXAgPSB0cy5jcmVhdGVOYW1lZEltcG9ydHMoW3RzLmNyZWF0ZUltcG9ydFNwZWNpZmllcihmYWxzZSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUpKV0pO1xyXG4gICAgICAgICAgICBjb25zdCBpbXBvcnROb2RlID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIGltcCksIHRzLmNyZWF0ZUxpdGVyYWwoZmlsZSkpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZUZpbGUgPSB0cy51cGRhdGVTb3VyY2VGaWxlTm9kZSh0aGlzLnNvdXJjZUZpbGUsIFtpbXBvcnROb2RlLCAuLi50aGlzLnNvdXJjZUZpbGUuc3RhdGVtZW50c10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VUeXBlTWVOb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVHlwZUxpdGVyYWwpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGVbXCJtZW1iZXJzXCJdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlTWVOb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgbm9kZVtcIm1lbWJlcnNcIl0uZm9yRWFjaChmdW5jdGlvbiAodG5vZGU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRub2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRub2RlLm5hbWUudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5cGUgPSB0bm9kZS50eXBlLnR5cGVOYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudHlwZU1lW25hbWVdID0geyBub2RlOiB0bm9kZSwgdmFsdWU6IHN0eXBlLCBpc0Z1bmN0aW9uOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmFkZChcIm1lXCIsIG5hbWUsIFwidHlwZWRlY2xhcmF0aW9uOlwiICsgc3R5cGUsIHVuZGVmaW5lZCwgYWxpbmUsIGFsaW5lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy5wYXJzZVR5cGVNZU5vZGUoYykpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0QXJndW1lbnQoYXJnOiBhbnkpIHtcclxuICAgICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0ge307XHJcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IGFyZy5wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICBpZiAocHJvcHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldFtwcm9wc1twXS5uYW1lLnRleHRdID0gdGhpcy5jb252ZXJ0QXJndW1lbnQocHJvcHNbcF0uaW5pdGlhbGl6ZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcudGV4dDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgbGV0IHJldCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IGFyZy5lbGVtZW50cy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgcmV0LnB1c2godGhpcy5jb252ZXJ0QXJndW1lbnQoYXJnLmVsZW1lbnRzW3BdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZy50ZXh0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVHJ1ZUtleXdvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5GYWxzZUtleXdvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTnVtZXJpY0xpdGVyYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihhcmcudGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJvd0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcuZ2V0VGV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgXCJFcnJvciB0eXBlIG5vdCBmb3VuZFwiO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXJzZURlY29yYXRvcihkZWM6IHRzLkRlY29yYXRvcik6IFBhcnNlZERlY29yYXRvciB7XHJcbiAgICAgICAgdmFyIGV4OiBhbnkgPSBkZWMuZXhwcmVzc2lvbjtcclxuICAgICAgICB2YXIgcmV0ID0gbmV3IFBhcnNlZERlY29yYXRvcigpO1xyXG4gICAgICAgIGlmIChleC5leHByZXNzaW9uID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0Lm5hbWUgPSBleC50ZXh0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICByZXQubmFtZSA9IGV4LmV4cHJlc3Npb24uZXNjYXBlZFRleHQ7XHJcbiAgICAgICAgICAgIGlmIChleC5leHByZXNzaW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGEgPSAwOyBhIDwgZXguYXJndW1lbnRzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LnBhcnNlZFBhcmFtZXRlci5wdXNoKHRoaXMuY29udmVydEFyZ3VtZW50KGV4LmFyZ3VtZW50c1thXSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wYXJhbWV0ZXIucHVzaChleC5hcmd1bWVudHNbYV0uZ2V0VGV4dCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHBhcnNlQ2xhc3Mobm9kZTogdHMuQ2xhc3NFbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5DbGFzc0RlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBwYXJzZWRDbGFzcyA9IG5ldyBQYXJzZWRDbGFzcygpO1xyXG4gICAgICAgICAgICBwYXJzZWRDbGFzcy5wYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBwYXJzZWRDbGFzcy5uYW1lID0gbm9kZS5uYW1lLmdldFRleHQoKTtcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3Mubm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3Nlc1twYXJzZWRDbGFzcy5uYW1lXSA9IHBhcnNlZENsYXNzO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5kZWNvcmF0b3JzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkZWMgPSB7fTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgbm9kZS5kZWNvcmF0b3JzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlZERlYyA9IHRoaXMucGFyc2VEZWNvcmF0b3Iobm9kZS5kZWNvcmF0b3JzW3hdKTtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZWRDbGFzcy5kZWNvcmF0b3JbcGFyc2VkRGVjLm5hbWVdID0gcGFyc2VkRGVjO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZWRDbGFzcy5kZWNvcmF0b3JbXCIkQ2xhc3NcIl0gJiYgcGFyc2VkRGVjLnBhcmFtZXRlci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRDbGFzcy5mdWxsQ2xhc3NuYW1lID0gcGFyc2VkRGVjLnBhcmFtZXRlclswXS5yZXBsYWNlQWxsKCdcIicsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGVbXCJtZW1iZXJzXCJdLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkTWVtID0gbmV3IFBhcnNlZE1lbWJlcigpXHJcbiAgICAgICAgICAgICAgICB2YXIgbWVtID0gbm9kZVtcIm1lbWJlcnNcIl1beF07XHJcbiAgICAgICAgICAgICAgICBpZiAobWVtLm5hbWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsvL0NvbnN0cnVjdG9yXHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0ubmFtZSA9IG1lbS5uYW1lLmVzY2FwZWRUZXh0O1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLm5vZGUgPSBub2RlW1wibWVtYmVyc1wiXVt4XTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS50eXBlID0gKG1lbS50eXBlID8gbWVtLnR5cGUuZ2V0RnVsbFRleHQoKS50cmltKCkgOiB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MubWVtYmVyc1twYXJzZWRNZW0ubmFtZV0gPSBwYXJzZWRNZW07XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAobWVtLmRlY29yYXRvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lbS5kZWNvcmF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJzZWREZWMgPSB0aGlzLnBhcnNlRGVjb3JhdG9yKG1lbS5kZWNvcmF0b3JzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkTWVtLmRlY29yYXRvcltwYXJzZWREZWMubmFtZV0gPSBwYXJzZWREZWM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNsYXNzU2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jbGFzc1Njb3BlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IHRoaXMuY2xhc3NTY29wZVt4XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLmNsYXNzbmFtZSA9PT0gcGFyc2VkQ2xhc3MubmFtZSAmJiBwYXJzZWRDbGFzcy5tZW1iZXJzW2NvbC5tZXRob2RuYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmQgPSBwYXJzZWRDbGFzcy5tZW1iZXJzW2NvbC5tZXRob2RuYW1lXS5ub2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlUHJvcGVydGllcyhuZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGFyc2VDb25maWcobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pIHtcclxuICAgICAgICBpZiAobm9kZS5hcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IG5vZGUuZXhwcmVzc2lvbi5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHZhciBsYXN0cG9zID0gbGVmdC5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9IGxlZnQ7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGxhc3Rwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IGxlZnQuc3Vic3RyaW5nKDAsIGxhc3Rwb3MpO1xyXG4gICAgICAgICAgICAgICAgcHJvcCA9IGxlZnQuc3Vic3RyaW5nKGxhc3Rwb3MgKyAxKTtcclxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BzOiBhbnlbXSA9IG5vZGUuYXJndW1lbnRzWzBdLnByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9wc1twXS5uYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciB2YWx1ZSA9IHRoaXMuY29udmVydEFyZ3VtZW50KHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGU6IHN0cmluZyA9IHByb3BzW3BdLmluaXRpYWxpemVyID8gcHJvcHNbcF0uaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGU/LmluZGV4T2YoXCIuY29uZmlnXCIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCh2YXJpYWJsZSwgbmFtZSwgY29kZSwgcHJvcHNbcF0sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwYXJzZVByb3BlcnRpZXMobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIGlmICh0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBub2RlLm5hbWUuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pbml0aWFsaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBub2RlLmluaXRpYWxpemVyLmdldFRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKG5hbWUsIFwiX25ld19cIiwgdmFsdWUsIG5vZGUucGFyZW50LnBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5vcGVyYXRvclRva2VuLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRXF1YWxzVG9rZW4pIHx8XHJcbiAgICAgICAgICAgIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUxO1xyXG4gICAgICAgICAgICB2YXIgbm9kZTI7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0OiBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgX3RoaXM9dGhpcztcclxuICAgICAgICAgICAgdmFyIGlzRnVuY3Rpb24gPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZTEgPSBub2RlLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICBub2RlMiA9IG5vZGUucmlnaHQ7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTEuZ2V0VGV4dCgpOy8vIHRoaXMuY29kZS5zdWJzdHJpbmcobm9kZTEucG9zLCBub2RlMS5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbm9kZTIuZ2V0VGV4dCgpOy8vdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMi5wb3MsIG5vZGUyLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCJuZXcgXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxlZnQsIFwiX25ld19cIiwgdmFsdWUsIG5vZGUucGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZTEgPSBub2RlLmV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICBub2RlMiA9IG5vZGUuYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgaXNGdW5jdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTEuZ2V0VGV4dCgpOy8vIHRoaXMuY29kZS5zdWJzdHJpbmcobm9kZTEucG9zLCBub2RlMS5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIG5vZGUuYXJndW1lbnRzLmZvckVhY2goKGFyZykgPT4geyBcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goYXJnLmdldFRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoKDxhbnk+YXJnKT8uZXhwcmVzc2lvbj8ubmFtZT8uZ2V0VGV4dCgpPT09XCJjb25maWdcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnBhcnNlQ29uZmlnKDxhbnk+YXJnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgIC8vYXJnLmdldFRleHQoKS5pbmRleE9mKFwiLmNvbmZpZyhcIilcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQuZW5kc1dpdGgoXCIuY29uZmlnXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGUgPSBsZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGUgPSBsZWZ0LnN1YnN0cmluZygwLCBsYXN0cG9zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcCA9IGxlZnQuc3Vic3RyaW5nKGxhc3Rwb3MgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJhbXMuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBwcm9wLCB2YWx1ZSwgbm9kZSwgaXNGdW5jdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZUNvbmZpZyhub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcmFtcy5qb2luKFwiLCBcIik7Ly90aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUyLnBvcywgbm9kZTIuZW5kKS50cmltKCk7Ly9cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICBwcm9wID0gbGVmdC5zdWJzdHJpbmcobGFzdHBvcyArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBwcm9wLCB2YWx1ZSwgbm9kZS5wYXJlbnQsIGlzRnVuY3Rpb24pO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMucGFyc2VQcm9wZXJ0aWVzKGMpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc1tub2RlW1wibmFtZVwiXS50ZXh0XSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIG5kOiBhbnkgPSBub2RlO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IG5kLm1vZHVsZVNwZWNpZmllci50ZXh0O1xyXG4gICAgICAgICAgICBpZiAobmQuaW1wb3J0Q2xhdXNlICYmIG5kLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXMgPSBuZC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgbmFtZXMubGVuZ3RoOyBlKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltcG9ydHNbbmFtZXNbZV0ubmFtZS5lc2NhcGVkVGV4dF0gPSBmaWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5UeXBlQWxpYXNEZWNsYXJhdGlvbiAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBcIk1lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVR5cGVNZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQ2xhc3MoPHRzLkNsYXNzRWxlbWVudD5ub2RlKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlICYmIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uKSB7Ly9mdW5jdGlvbnMgb3V0IG9mIGNsYXNzXHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25zW25vZGVbXCJuYW1lXCJdLnRleHRdID0gbm9kZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNsYXNzU2NvcGUubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gdGhpcy5jbGFzc1Njb3BlW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3NuYW1lID09PSB1bmRlZmluZWQgJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gY29sLm1ldGhvZG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMudmlzaXROb2RlKGMpKTtcclxuICAgICAgICAvL1RPRE8gcmVtb3ZlIHRoaXMgYmxvY2tcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24gJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gXCJ0ZXN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGQobm9kZVtcIm5hbWVcIl0udGV4dCwgXCJcIiwgXCJcIiwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZWFyY2hDbGFzc25vZGUobm9kZTogdHMuTm9kZSwgcG9zOiBudW1iZXIpOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfSB7XHJcbiAgICAgICAgaWYgKHRzLmlzTWV0aG9kRGVjbGFyYXRpb24obm9kZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogbm9kZS5wYXJlbnRbXCJuYW1lXCJdW1widGV4dFwiXSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZG5hbWU6IG5vZGUubmFtZVtcInRleHRcIl1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbikgey8vZnVuY3Rpb25zIG91dCBvZiBjbGFzc1xyXG4gICAgICAgICAgICB2YXIgZnVuY25hbWUgPSBub2RlW1wibmFtZVwiXS50ZXh0XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc25hbWU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZG5hbWU6IGZ1bmNuYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkcyA9IG5vZGUuZ2V0Q2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYyA9IGNoaWxkc1t4XTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSBjLnBvcyAmJiBwb3MgPD0gYy5lbmQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gdGhpcy5zZWFyY2hDbGFzc25vZGUoYywgcG9zKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZ2V0Q2xhc3NTY29wZUZyb21Qb3NpdGlvbihjb2RlOiBzdHJpbmcsIHBvczogbnVtYmVyKTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH0ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XHJcblxyXG4gICAgICAgIHRoaXMuc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoJ2R1bW15LnRzJywgY29kZSwgdHMuU2NyaXB0VGFyZ2V0LkVTNSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaENsYXNzbm9kZSh0aGlzLnNvdXJjZUZpbGUsIHBvcyk7XHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5wYXJzZW9sZChjb2RlLG9ubHlmdW5jdGlvbik7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHBhcnNlIHRoZSBjb2RlIFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIHRoZSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbmx5ZnVuY3Rpb24gLSBvbmx5IHRoZSBjb2RlIGluIHRoZSBmdW5jdGlvbiBpcyBwYXJzZWQsIGUuZy4gXCJsYXlvdXQoKVwiXHJcbiAgICAqL1xyXG4gICAgcGFyc2UoY29kZTogc3RyaW5nLCBjbGFzc1Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuICAgICAgICBpZiAoY2xhc3NTY29wZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzU2NvcGUgPSBjbGFzc1Njb3BlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY2xhc3NTY29wZSA9IHRoaXMuY2xhc3NTY29wZTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZSgnZHVtbXkudHMnLCBjb2RlLCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlKTtcclxuICAgICAgICB0aGlzLnZpc2l0Tm9kZSh0aGlzLnNvdXJjZUZpbGUpO1xyXG5cclxuICAgICAgICAvL3JldHVybiB0aGlzLnBhcnNlb2xkKGNvZGUsb25seWZ1bmN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlTm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXSkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnQucGFyZW50W1widHlwZVwiXVtcIm1lbWJlcnNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQucGFyZW50W1widHlwZVwiXVtcIm1lbWJlcnNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wibWVtYmVyc1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50W1wicHJvcGVydGllc1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInByb3BlcnRpZXNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJwcm9wZXJ0aWVzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnRbXCJlbGVtZW50c1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcImVsZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wiZWxlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKG5vZGUuZ2V0RnVsbFRleHQoKSArIFwiY291bGQgbm90IGJlIHJlbW92ZWRcIik7XHJcbiAgICB9XHJcbiAgICAvKiogXHJcbiAgICAgKiBtb2RpZnkgYSBtZW1iZXIgXHJcbiAgICAgKiovXHJcbiAgICBhZGRPck1vZGlmeU1lbWJlcihtZW1iZXI6IFBhcnNlZE1lbWJlciwgcGNsYXNzOiBQYXJzZWRDbGFzcykge1xyXG4gICAgICAgIC8vbWVtYmVyLm5vZGVcclxuICAgICAgICAvL3ZhciBuZXdtZW1iZXI9dHMuY3JlYXRlUHJvcGVydHlcclxuICAgICAgICB2YXIgbmV3ZGVjOiB0cy5EZWNvcmF0b3JbXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbWVtYmVyLmRlY29yYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgZGVjID0gbWVtYmVyLmRlY29yYXRvcltrZXldO1xyXG4gICAgICAgICAgICBpZiAoIW5ld2RlYylcclxuICAgICAgICAgICAgICAgIG5ld2RlYyA9IFtdO1xyXG4gICAgICAgICAgICAvL3RzLmNyZWF0ZURlY29yYXRvcigpXHJcbiAgICAgICAgICAgIC8vbWVtYmVyLmRlY29yYXRvcltrZXldLm5hbWU7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChkZWMucGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVjLnBhcmFtZXRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRzLmNyZWF0ZUlkZW50aWZpZXIoZGVjLnBhcmFtZXRlcltpXSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjYWxsID0gdHMuY3JlYXRlQ2FsbCh0cy5jcmVhdGVJZGVudGlmaWVyKGRlYy5uYW1lKSwgdW5kZWZpbmVkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBuZXdkZWMucHVzaCh0cy5jcmVhdGVEZWNvcmF0b3IoY2FsbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3ZhciB0eXBlPXRzLmNyZWF0ZVR5XHJcbiAgICAgICAgdmFyIG5ld21lbWJlciA9IHRzLmNyZWF0ZVByb3BlcnR5KG5ld2RlYywgdW5kZWZpbmVkLCBtZW1iZXIubmFtZSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZShtZW1iZXIudHlwZSwgW10pLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHZhciBub2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwY2xhc3MubWVtYmVycykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBtZW1iZXIubmFtZSlcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBwY2xhc3MubWVtYmVyc1trZXldLm5vZGVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl0ucHVzaChuZXdtZW1iZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXVtwb3NdID0gbmV3bWVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwY2xhc3MubWVtYmVyc1ttZW1iZXIubmFtZV0gPSBtZW1iZXI7XHJcbiAgICAgICAgbWVtYmVyLm5vZGUgPSBuZXdtZW1iZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgZnJvbSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gcmVtb3ZlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gW29ubHlWYWx1ZV0gLSByZW1vdmUgdGhlIHByb3BlcnR5IG9ubHkgaWYgdGhlIHZhbHVlIGlzIGZvdW5kXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRocGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgLSBkZWZhdWx0PXRoaXMudmFyaWFibGVuYW1lXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlUHJvcGVydHlJbkNvZGUocHJvcGVydHk6IHN0cmluZywgb25seVZhbHVlID0gdW5kZWZpbmVkLCB2YXJpYWJsZW5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCk6IHRzLk5vZGUge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdLmNvbmZpZyAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnR5ID09PSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICB2YXIgb2xkcGFyZW50OiBhbnkgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZU5vZGUgPSBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVOb2RlLmdldFRleHQoKSA9PT0gb25seVZhbHVlIHx8IHZhbHVlTm9kZS5nZXRUZXh0KCkuc3RhcnRzV2l0aChvbmx5VmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMuc3BsaWNlKHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUob2xkcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlTm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHByb3A6IEVudHJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAob25seVZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVt4XS52YWx1ZSA9PT0gb25seVZhbHVlfHx0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF0udmFsdWUuc3RhcnRzV2l0aChvbmx5VmFsdWUrXCIuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1bMF07XHJcbiAgICAgICAgICAgIGlmIChwcm9wID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKHByb3Aubm9kZSk7XHJcbiAgICAgICAgICAgIGlmKHByb3Aubm9kZVtcImV4cHJlc3Npb25cIl0/LmFyZ3VtZW50cz8ubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3Aubm9kZVtcImV4cHJlc3Npb25cIl0/LmFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcC5ub2RlO1xyXG4gICAgICAgICAgICAvKnZhciBvbGR2YWx1ZSA9IHRoaXMubGluZXNbcHJvcC5saW5lc3RhcnQgLSAxXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHByb3AubGluZXN0YXJ0O3ggPD0gcHJvcC5saW5lZW5kO3grKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lc1t4IC0gMV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IDEgJiYgdGhpcy5saW5lc1t4IC0gMl0uZW5kc1dpdGgoXCIsXCIpKS8vdHlwZSBNZT17IGJ0Mj86QnV0dG9uLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZXNbeCAtIDJdID0gdGhpcy5saW5lc1t4IC0gMl0uc3Vic3RyaW5nKDAsIHRoaXMubGluZXNbeCAtIDJdLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAvL3ZhciB0ZXh0ID0gdGhpcy5wYXJzZXIubGluZXNUb1N0cmluZygpO1xyXG4gICAgICAgICAgICAvL3RoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRleHQ7XHJcbiAgICAgICAgICAgIC8vdGhpcy51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxyXG4gICAgICovXHJcbiAgICByZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbdmFybmFtZV07XHJcbiAgICAgICAgdmFyIGFsbHByb3BzOiBFbnRyeVtdID0gW107XHJcbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgYWxscHJvcHMucHVzaCh0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0pO1xyXG4gICAgICAgIC8vcmVtb3ZlIHByb3BlcnRpZXNcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgIHByb3BzLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGFsbHByb3BzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGF0YS5tZVt2YXJuYW1lLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHByb3BzPy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxwcm9wcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUoYWxscHJvcHNbeF0ubm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcmVtb3ZlIGxpbmVzIHdoZXJlIHVzZWQgYXMgcGFyYW1ldGVyXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGtleSBpbiB0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbcHJvcGtleV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBwcm9wc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gcC52YWx1ZS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tpXSA9PT0gdmFybmFtZSB8fCBwYXJhbXNbaV0gPT09IFwidGhpcy5cIiArIHZhcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vaW4gY2hpbGRyZW46W11cclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5jb25maWcgPSBwcm9wW2tleV1bMF0/Lm5vZGU/LmluaXRpYWxpemVyPy5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5jb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBpbmNvbmZpZy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluY29uZmlnW3hdLmdldFRleHQoKSA9PT0gdmFybmFtZSB8fCBpbmNvbmZpZ1t4XS5nZXRUZXh0KCkuc3RhcnRzV2l0aCh2YXJuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShpbmNvbmZpZ1t4XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNvbmZpZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwcm9wW2tleV1bMF0/Lm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLCB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpOiB0cy5Ob2RlIHtcclxuICAgICAgICB2YXIgc2NvcGU7XHJcbiAgICAgICAgaWYgKHZhcmlhYmxlc2NvcGUpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSB0aGlzLmRhdGFbdmFyaWFibGVzY29wZS52YXJpYWJsZW5hbWVdW3ZhcmlhYmxlc2NvcGUubWV0aG9kbmFtZV1bMF0/Lm5vZGU7XHJcbiAgICAgICAgICAgIHNjb3BlID0gc2NvcGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGFzc3Njb3BlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2MgPSBjbGFzc3Njb3BlW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjLmNsYXNzbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5jbGFzc2VzW3NjLmNsYXNzbmFtZV0/Lm1lbWJlcnNbc2MubWV0aG9kbmFtZV0/Lm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjb3BlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7Ly9leHBvcnRlZCBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlID0gdGhpcy5mdW5jdGlvbnNbc2MubWV0aG9kbmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNjb3BlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBuZXh0IHZhcmlhYmxlbmFtZVxyXG4gICAgICogKi9cclxuICAgIGdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gdHlwZS5zcGxpdChcIi5cIilbdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBmb3IgKHZhciBjb3VudGVyID0gMTsgY291bnRlciA8IDEwMDA7IGNvdW50ZXIrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLm1lID09PSB1bmRlZmluZWQgfHwgdGhpcy5kYXRhLm1lW3Zhcm5hbWUgKyBjb3VudGVyXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YXJuYW1lICsgY291bnRlcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY2hhbmdlIG9iamVjdGxpdGVyYWwgdG8gbXV0bGlsaW5lIGlmIG5lZWRlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN3aXRjaFRvTXV0bGlsaW5lSWZOZWVkZWQobm9kZTogdHMuTm9kZSwgbmV3UHJvcGVydHk6IHN0cmluZywgbmV3VmFsdWUpIHtcclxuICAgICAgICB2YXIgb2xkVmFsdWUgPSBub2RlLmdldFRleHQoKTtcclxuICAgICAgICBpZiAobm9kZVtcIm11bHRpTGluZVwiXSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXNbeF07XHJcbiAgICAgICAgICAgICAgICBsZW4gKz0gKHByb3AuaW5pdGlhbGl6ZXIuZXNjYXBlZFRleHQgPyBwcm9wLmluaXRpYWxpemVyLmVzY2FwZWRUZXh0Lmxlbmd0aCA6IHByb3AuaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBsZW4gKz0gcHJvcC5uYW1lLmVzY2FwZWRUZXh0Lmxlbmd0aCArIDU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cobGVuKTtcclxuICAgICAgICAgICAgaWYgKG9sZFZhbHVlLmluZGV4T2YoXCJcXG5cIikgPiAtMSB8fCAobGVuID4gNjApIHx8IG5ld1ZhbHVlLmluZGV4T2YoXCJcXG5cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy9vcmRlciBhbHNvIG9sZCBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AucG9zID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5sZW4gPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydHlJbkNvbmZpZyh2YXJpYWJsZU5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHRzLk5vZGUsXHJcbiAgICAgICAgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGZhbHNlLCByZXBsYWNlOiBib29sZWFuID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcclxuICAgICAgICBzY29wZTogdHMuTm9kZSkge1xyXG5cclxuICAgICAgICB2YXIgc3ZhbHVlOiBhbnkgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB0cy5jcmVhdGVJZGVudGlmaWVyKHZhbHVlKSA6IHZhbHVlO1xyXG4gICAgICAgIHZhciBjb25maWcgPSA8YW55PnRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY29uZmlnXCJdWzBdLm5vZGU7XHJcbiAgICAgICAgY29uZmlnID0gY29uZmlnLmFyZ3VtZW50c1swXTtcclxuICAgICAgICB2YXIgbmV3RXhwcmVzc2lvbiA9IHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSwgPGFueT5zdmFsdWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJhZGRcIiAmJiByZXBsYWNlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eSA9IFwiY2hpbGRyZW5cIjtcclxuICAgICAgICAgICAgc3ZhbHVlID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSArIFwiLmNvbmZpZyh7fSlcIikgOiB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY2hpbGRyZW5cIl0gPT0gdW5kZWZpbmVkKSB7Ly9cclxuICAgICAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHksIHRzLmNyZWF0ZUFycmF5TGl0ZXJhbChbc3ZhbHVlXSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnByb3BlcnRpZXMucHVzaChuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY2hpbGRyZW5cIl1bMF0ubm9kZS5pbml0aWFsaXplci5lbGVtZW50cy5wdXNoKHN2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY2hpbGRyZW5cIl1bMF0ubm9kZS5pbml0aWFsaXplci5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFycmF5Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheVt4XS5nZXRUZXh0KCkgPT09IGJlZm9yZS52YWx1ZSB8fCBhcnJheVt4XS5nZXRUZXh0KCkuc3RhcnRzV2l0aChiZWZvcmUudmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZSh4LCAwLCBzdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vZGUgXCIgKyBiZWZvcmUudmFsdWUgKyBcIiBub3QgZm91bmQuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7ICAvL2NvbXAuYWRkKGEpIC0tPiBjb21wLmNvbmZpZyh7Y2hpbGRyZW46W2FdfSlcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2UgIT09IGZhbHNlICYmIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHsvL2VkaXQgZXhpc3RpbmdcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldWzBdLm5vZGU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gY29uZmlnLnByb3BlcnRpZXMuaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcm9wZXJ0aWVzW3Bvc10gPSBuZXdFeHByZXNzaW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb011dGxpbGluZUlmTmVlZGVkKGNvbmZpZywgcHJvcGVydHksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcm9wZXJ0aWVzLnB1c2gobmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTXV0bGlsaW5lSWZOZWVkZWQoY29uZmlnLCBwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY29ycmVjdCBzcGFjZXNcIik7XHJcbiAgICAgICAgdGhpcy5wYXJzZSh0aGlzLmdldE1vZGlmaWVkQ29kZSgpKTtcclxuICAgICAgICAvL2lmIChwb3MgPj0gMClcclxuICAgICAgICAvLyAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG5cclxuICAgIH1cclxuICAgIC8qICBtb3ZlUHJvcGVydFZhbHVlSW5Db2RlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBuZXdWYXJpYWJsZU5hbWU6IHN0cmluZywgYmVmb3JlVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY29uZmlnXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiYWRkXCIpXHJcbiAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICAgIHZhciBvbGRwYXJlbnQ6YW55PXRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZU5vZGU9b2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzW3hdO1xyXG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWVOb2RlLmdldFRleHQoKSA9PT0gdmFsdWUgfHx2YWx1ZU5vZGUuZ2V0VGV4dCgpLnN0YXJ0c1dpdGgodmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50cy5zcGxpY2UoeCwxKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfSovXHJcbiAgICAvKipcclxuICAgICogbW9kaWZ5IHRoZSBwcm9wZXJ0eSBpbiBjb2RlXHJcbiAgICAqIEBwYXJhbSB2YXJpYWJsZW5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICogQHBhcmFtICBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSBcclxuICAgICogQHBhcmFtIHZhbHVlIC0gdGhlIG5ldyB2YWx1ZVxyXG4gICAgKiBAcGFyYW0gY2xhc3NzY29wZSAgLSB0aGUgcHJvcGVydHkgd291bGQgYmUgaW5zZXJ0IGluIHRoaXMgYmxvY2tcclxuICAgICogQHBhcmFtIGlzRnVuY3Rpb24gIC0gdHJ1ZSBpZiB0aGUgcHJvcGVydHkgaXMgYSBmdW5jdGlvblxyXG4gICAgKiBAcGFyYW0gW3JlcGxhY2VdICAtIGlmIHRydWUgdGhlIG9sZCB2YWx1ZSBpcyBkZWxldGVkXHJcbiAgICAqIEBwYXJhbSBbYmVmb3JlXSAtIHRoZSBuZXcgcHJvcGVydHkgaXMgcGxhY2VkIGJlZm9yZSB0aGlzIHByb3BlcnR5XHJcbiAgICAqIEBwYXJhbSBbdmFyaWFibGVzY29wZV0gLSBpZiB0aGlzIHNjb3BlIGlzIGRlZmluZWQgLSB0aGUgbmV3IHByb3BlcnR5IHdvdWxkIGJlIGluc2VydCBpbiB0aGlzIHZhcmlhYmxlXHJcbiAgICAqL1xyXG4gICAgc2V0UHJvcGVydHlJbkNvZGUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCB0cy5Ob2RlLFxyXG4gICAgICAgIGNsYXNzc2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10sXHJcbiAgICAgICAgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGZhbHNlLCByZXBsYWNlOiBib29sZWFuID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcclxuICAgICAgICB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoY2xhc3NzY29wZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBjbGFzc3Njb3BlID0gdGhpcy5jbGFzc1Njb3BlO1xyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICB2YXIgbmV3RXhwcmVzc2lvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5SW5Db25maWcodmFyaWFibGVOYW1lLCBwcm9wZXJ0eSwgdmFsdWUsIGlzRnVuY3Rpb24sIHJlcGxhY2UsIGJlZm9yZSwgc2NvcGUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXdWYWx1ZTogYW55ID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkgOiB2YWx1ZTtcclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBzY29wZVtcImJvZHlcIl0uc3RhdGVtZW50c1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJuZXdcIikgeyAvL21lLnBhbmVsMT1uZXcgUGFuZWwoe30pO1xyXG4gICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiX25ld19cIl1bMF07Ly8uc3Vic3RyaW5nKDMpXTtcclxuICAgICAgICAgICAgdmFyIGNvbnN0ciA9IHByb3AudmFsdWU7XHJcbiAgICAgICAgICAgIHZhbHVlID0gY29uc3RyLnN1YnN0cmluZygwLCBjb25zdHIuaW5kZXhPZihcIihcIikgKyAxKSArIHZhbHVlICsgY29uc3RyLnN1YnN0cmluZyhjb25zdHIubGFzdEluZGV4T2YoXCIpXCIpKTtcclxuICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gcHJvcC5ub2RlLmdldFRleHQoKTtcclxuICAgICAgICAgICAgbGVmdCA9IGxlZnQuc3Vic3RyaW5nKDAsIGxlZnQuaW5kZXhPZihcIj1cIikgLSAxKTtcclxuICAgICAgICAgICAgcHJvcGVydHkgPSBcIl9uZXdfXCI7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihsZWZ0KSwgbmV3VmFsdWUpKTtcclxuICAgICAgICAgICAgLypcdH1lbHNley8vdmFyIGhoPW5ldyBQYW5lbCh7fSlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29uc3RyLnN1YnN0cmluZygwLCBjb25zdHIuaW5kZXhPZihcIihcIikgKyAxKSArIHZhbHVlICsgY29uc3RyLnN1YnN0cmluZyhjb25zdHIubGFzdEluZGV4T2YoXCIpXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RXhwcmVzc2lvbj10cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihcIm1lLlwiK3Byb3BlcnR5KSwgdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkpKTtcdFxyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUNhbGwodHMuY3JlYXRlSWRlbnRpZmllcih2YXJpYWJsZU5hbWUgKyBcIi5cIiArIHByb3BlcnR5KSwgdW5kZWZpbmVkLCBbbmV3VmFsdWVdKSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcih2YXJpYWJsZU5hbWUgKyBcIi5cIiArIHByb3BlcnR5KSwgbmV3VmFsdWUpKTtcclxuICAgICAgICBpZiAocmVwbGFjZSAhPT0gZmFsc2UgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgey8vZWRpdCBleGlzdGluZ1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXVtwb3NdID0gbmV3RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgLy9pZiAocG9zID49IDApXHJcbiAgICAgICAgICAgIC8vICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIHsvL2luc2VydCBuZXdcclxuICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZS52YWx1ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwibm90IGltcGxlbWVudGVkXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV0ubGVuZ3RoOyBvKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10udmFsdWUgPT09IGJlZm9yZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiUHJvcGVydHkgbm90IGZvdW5kIFwiICsgYmVmb3JlLnZhcmlhYmxlbmFtZSArIFwiLlwiICsgYmVmb3JlLnByb3BlcnR5ICsgXCIgdmFsdWUgXCIgKyBiZWZvcmUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cHJvcDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJfbmV3X1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2hvdWxkIGJlIGluIHRoZSBzYW1lIHNjb3BlIG9mIGRlY2xhcmF0aW9uIChpbXBvcnRhbnQgZm9yIHJlcGVhdGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bMF0ubm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3Rub2RlOiB0cy5Ob2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF0ubGVuZ3RoIC0gMV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdG5vZGUucGFyZW50ID09PSBzY29wZVtcImJvZHlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wID0gdGVzdG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gbGFzdHByb3AucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGxhc3Rwcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcyArIDEsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gc3RhdGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9zID4gMCAmJiBzdGF0ZW1lbnRzW3N0YXRlbWVudHMubGVuZ3RoIC0gMV0uZ2V0VGV4dCgpLnN0YXJ0c1dpdGgoXCJyZXR1cm4gXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zLS07XHJcbiAgICAgICAgICAgICAgICAgICAgfWNhdGNoe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50cy5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogc3dhcHMgdHdvIHN0YXRlbWVudHMgaW5kZW5kaWZpZWQgYnkgIGZ1bmN0aW9ucGFyYW1ldGVyIGluIGEgdmFyaWFibGUucHJvcGVydHkocGFyYW1ldGVyMSkgd2l0aCB2YXJpYWJsZS5wcm9wZXJ0eShwYXJhbWV0ZXIyKVxyXG4gICAgICoqL1xyXG4gICAgc3dhcFByb3BlcnR5V2l0aFBhcmFtZXRlcih2YXJpYWJsZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCBwYXJhbWV0ZXIxOiBzdHJpbmcsIHBhcmFtZXRlcjI6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBmaXJzdDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc2Vjb25kOiB0cy5Ob2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmVudC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50W3hdLnZhbHVlLnNwbGl0KFwiLFwiKVswXS50cmltKCkgPT09IHBhcmFtZXRlcjEpXHJcbiAgICAgICAgICAgICAgICBmaXJzdCA9IHBhcmVudFt4XS5ub2RlO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50W3hdLnZhbHVlLnNwbGl0KFwiLFwiKVswXS50cmltKCkgPT09IHBhcmFtZXRlcjIpXHJcbiAgICAgICAgICAgICAgICBzZWNvbmQgPSBwYXJlbnRbeF0ubm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmaXJzdClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJQYXJhbWV0ZXIgbm90IGZvdW5kIFwiICsgcGFyYW1ldGVyMSk7XHJcbiAgICAgICAgaWYgKCFzZWNvbmQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiUGFyYW1ldGVyIG5vdCBmb3VuZCBcIiArIHBhcmFtZXRlcjIpO1xyXG4gICAgICAgIHZhciBpZmlyc3QgPSBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2YoZmlyc3QpO1xyXG4gICAgICAgIHZhciBpc2Vjb25kID0gc2Vjb25kLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihzZWNvbmQpO1xyXG4gICAgICAgIGZpcnN0LnBhcmVudFtcInN0YXRlbWVudHNcIl1baWZpcnN0XSA9IHNlY29uZDtcclxuICAgICAgICBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdW2lzZWNvbmRdID0gZmlyc3Q7XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBhZGRzIGFuIFByb3BlcnR5XHJcbiAgICAqIEBwYXJhbSB0eXBlIC0gbmFtZSBvZiB0aGUgdHlwZSBvIGNyZWF0ZVxyXG4gICAgKiBAcGFyYW0gY2xhc3NzY29wZSAtIHRoZSBzY29wZSAobWV0aG9kbmFtZSkgd2hlcmUgdGhlIHZhcmlhYmxlIHNob3VsZCBiZSBpbnNlcnQgQ2xhc3MubGF5b3V0XHJcbiAgICAqIEBwYXJhbSB2YXJpYWJsZXNjb3BlIC0gdGhlIHNjb3BlIHdoZXJlIHRoZSB2YXJpYWJsZSBzaG91bGQgYmUgaW5zZXJ0IGUuZy4gaGFsbG8ub25jbGlja1xyXG4gICAgKiBAcmV0dXJucyAgdGhlIG5hbWUgb2YgdGhlIG9iamVjdFxyXG4gICAgKi9cclxuICAgIGFkZFZhcmlhYmxlSW5Db2RlKGZ1bGx0eXBlOiBzdHJpbmcsIGNsYXNzc2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10sIHZhcmlhYmxlc2NvcGU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWUgfSA9IHVuZGVmaW5lZCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKGNsYXNzc2NvcGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgY2xhc3NzY29wZSA9IHRoaXMuY2xhc3NTY29wZTtcclxuICAgICAgICBsZXQgdHlwZSA9IGZ1bGx0eXBlLnNwbGl0KFwiLlwiKVtmdWxsdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKHR5cGUpO1xyXG4gICAgICAgIHZhciB1c2VNZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbXCJtZVwiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB1c2VNZSA9IHRydWU7XHJcbiAgICAgICAgLy92YXIgaWYoc2NvcGVuYW1lKVxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5nZXROb2RlRnJvbVNjb3BlKGNsYXNzc2NvcGUsIHZhcmlhYmxlc2NvcGUpO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmIChub2RlPy5wYXJhbWV0ZXJzPy5sZW5ndGggPiAwICYmIG5vZGUucGFyYW1ldGVyc1swXS5uYW1lLnRleHQgPT0gXCJtZVwiKSB7XHJcbiAgICAgICAgICAgIHVzZU1lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByZWZpeCA9IHVzZU1lID8gXCJtZS5cIiA6IFwidmFyIFwiO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBub2RlW1wiYm9keVwiXS5zdGF0ZW1lbnRzO1xyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gc2NvcGUgdG8gaW5zZXJ0IGEgdmFyaWFibGUgY291bGQgYmUgZm91bmRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzdGF0ZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGVtZW50c1t4XS5nZXRUZXh0KCkuaW5jbHVkZXMoXCJuZXcgXCIpICYmICFzdGF0ZW1lbnRzW3hdLmdldFRleHQoKS5pbmNsdWRlcyhcInZhciBcIikpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFzcyA9IHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihwcmVmaXggKyB2YXJuYW1lKSwgdHMuY3JlYXRlSWRlbnRpZmllcihcIm5ldyBcIiArIHR5cGUgKyBcIigpXCIpKTtcclxuICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZSh4LCAwLCB0cy5jcmVhdGVTdGF0ZW1lbnQoYXNzKSk7XHJcbiAgICAgICAgaWYgKHVzZU1lKVxyXG4gICAgICAgICAgICB0aGlzLmFkZFR5cGVNZSh2YXJuYW1lLCB0eXBlKTtcclxuICAgICAgICByZXR1cm4gKHVzZU1lID8gXCJtZS5cIiA6IFwiXCIpICsgdmFybmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICBhd2FpdCB0eXBlc2NyaXB0LndhaXRGb3JJbml0ZWQ7XHJcbiAgICB2YXIgY29kZSA9IHR5cGVzY3JpcHQuZ2V0Q29kZShcImRlL0RpYWxvZy50c1wiKTtcclxuICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgICAvLyBjb2RlID0gXCJmdW5jdGlvbiB0ZXN0KCl7IHZhciBoYWxsbz17fTt2YXIgaDI9e307dmFyIHBwcD17fTtoYWxsby5wPTk7aGFsbG8uY29uZmlnKHthOjEsYjoyLCBrOmgyLmNvbmZpZyh7YzoxLGo6cHBwLmNvbmZpZyh7cHA6OX0pfSkgICAgIH0pOyB9XCI7XHJcbiAgICAvLyBjb2RlID0gXCJmdW5jdGlvbih0ZXN0KXsgdmFyIGhhbGxvPXt9O3ZhciBoMj17fTt2YXIgcHBwPXt9O2hhbGxvLnA9OTtoYWxsby5jb25maWcoe2E6MSxiOjIsIGs6aDIuY29uZmlnKHtjOjF9LGooKXtqMi51ZG89OX0pICAgICB9KTsgfVwiO1xyXG4gICAvLyBjb2RlID0gXCJmdW5jdGlvbiB0ZXN0KCl7dmFyIHBwcDt2YXIgYWFhPW5ldyBCdXR0b24oKTtwcHAuY29uZmlnKHthOls5LDZdLCAgY2hpbGRyZW46W2xsLmNvbmZpZyh7fSksYWFhLmNvbmZpZyh7dToxLG86MixjaGlsZHJlbjpba2suY29uZmlnKHt9KV19KV19KTt9XCI7XHJcbiAgICAvL3BhcnNlci5wYXJzZShjb2RlLCB1bmRlZmluZWQpO1xyXG4gICAgcGFyc2VyLnBhcnNlKGNvZGUsW3tjbGFzc25hbWU6XCJEaWFsb2dcIixtZXRob2RuYW1lOlwibGF5b3V0XCJ9XSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHZhciBub2RlID0gcGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIFwibWUudGV4dGJveDFcIiwgXCJtZS5wYW5lbDFcIik7XHJcbiAgICBwYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJ0aGlzXCIsXCJhZGRcIixub2RlLFt7Y2xhc3NuYW1lOlwiRGlhbG9nXCIsbWV0aG9kbmFtZTpcImxheW91dFwifV0sdHJ1ZSxmYWxzZSk7XHJcbiAgICAvL3ZhciBub2RlID0gcGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIFwia2tcIiwgXCJhYWFcIik7XHJcblxyXG4gICAgLy92YXIgbm9kZT1wYXJzZXIucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgXCJsbFwiLCBcInBwcFwiKTtcclxuICAgIC8vcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwiYWFhXCIsXCJhZGRcIixub2RlLFt7Y2xhc3NuYW1lOnVuZGVmaW5lZCwgbWV0aG9kbmFtZTpcInRlc3RcIn1dLHRydWUsZmFsc2UsdW5kZWZpbmVkLHVuZGVmaW5lZCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKG5vZGUuZ2V0VGV4dCgpKTtcclxuICAgIC8vICAgIHBhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcInBwcFwiLFwiYWRkXCIsXCJjY1wiLFt7Y2xhc3NuYW1lOnVuZGVmaW5lZCwgbWV0aG9kbmFtZTpcInRlc3RcIn1dLHRydWUsZmFsc2Use3ZhcmlhYmxlbmFtZTpcInBwcFwiLHByb3BlcnR5OlwiYWRkXCIsdmFsdWU6XCJsbFwifSk7XHJcbiAgICAvLyAgcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwiYWFhXCIsXCJhZGRcIixcImNjXCIsW3tjbGFzc25hbWU6dW5kZWZpbmVkLCBtZXRob2RuYW1lOlwidGVzdFwifV0sdHJ1ZSxmYWxzZSx7dmFyaWFibGVuYW1lOlwiYWFhXCIscHJvcGVydHk6XCJhZGRcIix2YWx1ZTpcImtrXCJ9KTtcclxuICAgIGNvbnNvbGUubG9nKHBhcnNlci5nZXRNb2RpZmllZENvZGUoKSk7XHJcbiAgICAvLyBkZWJ1Z2dlcjtcclxuICAgIC8qICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcih7IG5ld0xpbmU6IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkIH0pO1xyXG4gICAgICBjb25zdCByZXN1bHRGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShcImR1bW15LnRzXCIsIFwiXCIsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIGZhbHNlLCB0cy5TY3JpcHRLaW5kLlRTKTtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHBhcnNlci5zb3VyY2VGaWxlLCByZXN1bHRGaWxlKTtcclxuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTsqL1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5cclxuIl19