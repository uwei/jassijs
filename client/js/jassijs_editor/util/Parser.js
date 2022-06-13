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
                    if (left.endsWith(".createRepeatingComponent")) {
                        this.parseProperties(node.arguments[0]["body"]);
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
                if (scope.expression)
                    scope = scope.expression.arguments[0];
                else
                    scope = scope.initializer;
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
        getNextVariableNameForType(type, suggestedName = undefined) {
            var varname = suggestedName;
            if (varname === undefined)
                varname = type.split(".")[type.split(".").length - 1].toLowerCase();
            for (var counter = 1; counter < 1000; counter++) {
                if (this.data.me === undefined || this.data.me[varname + (counter === 1 ? "" : counter)] === undefined)
                    break;
            }
            return varname + (counter === 1 ? "" : counter);
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
            if (this.data[variableName] === undefined)
                this.data[variableName] = {};
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
        addVariableInCode(fulltype, classscope, variablescope = undefined, suggestedName = undefined) {
            var _a;
            if (classscope === undefined)
                classscope = this.classScope;
            let type = fulltype.split(".")[fulltype.split(".").length - 1];
            var varname = this.getNextVariableNameForType(type, suggestedName);
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
        // var node = parser.removePropertyInCode("add", "me.textbox1", "me.panel1");
        // parser.setPropertyInCode("this","add",node,[{classname:"Dialog",methodname:"layout"}],true,false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWVBLE1BQU0sZUFBZTtRQUFyQjtZQUdJLG9CQUFlLEdBQWMsRUFBRSxDQUFDO1lBQ2hDLGNBQVMsR0FBYyxFQUFFLENBQUM7UUFFOUIsQ0FBQztLQUFBO0lBQ0QsTUFBTSxZQUFZO1FBQWxCO1lBR0ksY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFFekQsQ0FBQztLQUFBO0lBQ0QsTUFBYSxXQUFXO1FBQXhCO1lBS0ksWUFBTyxHQUFzQyxFQUFFLENBQUM7WUFDaEQsY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBUEQsa0NBT0M7SUFFRCxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFNO1FBZ0JmOzs7V0FHRztRQUNIO1lBbkJBLGVBQVUsR0FBa0IsU0FBUyxDQUFDO1lBRXRDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1lBQ3ZDLFlBQU8sR0FBb0MsRUFBRSxDQUFDO1lBQzlDLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1lBQ3pDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBQzVDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBZXhDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRCxlQUFlO1lBQ1gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdkUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0gsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sTUFBTSxDQUFDO1FBQ2xCLENBQUM7UUFLRDs7Ozs7O1dBTUc7UUFDSyxHQUFHLENBQUMsUUFBZ0IsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFBRSxJQUFhLEVBQUUsVUFBVSxHQUFHLEtBQUs7WUFFNUYsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJO2dCQUNyQyxPQUFPO1lBQ1gsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNCLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzVCO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDdEM7WUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDL0IsS0FBSyxFQUFFLEtBQUs7b0JBQ1osSUFBSSxFQUFFLElBQUk7b0JBQ1YsVUFBVTtpQkFDYixDQUFDLENBQUM7YUFDTjtRQUNMLENBQUM7UUFDRDs7OztXQUlHO1FBQ0gsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFFBQVE7WUFDL0IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRTtvQkFDN0MsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ2pELE9BQU8sR0FBRyxDQUFDO2lCQUNkO2FBQ0o7WUFDRCxPQUFPLFNBQVMsQ0FBQztZQUNqQjs7Ozs7Z0JBS0k7WUFDSixPQUFPO1lBQ1AsaUdBQWlHO1FBRXJHLENBQUM7UUFFRCxTQUFTLENBQUMsSUFBWSxFQUFFLElBQVk7WUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVO2dCQUNoQixPQUFPO1lBQ1gsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5QyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMxRixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBQ0Q7Ozs7V0FJRztRQUNILGlCQUFpQixDQUFDLElBQVksRUFBRSxJQUFZO1lBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQ2xDLFlBQVk7Z0JBQ1osSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RyxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsdUJBQXVCLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDbkksSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzthQUMzRztRQUNMLENBQUM7UUFDTyxlQUFlLENBQUMsSUFBYTtZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFO2dCQUN6QyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7b0JBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFVO29CQUN4QyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7d0JBQ1osSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQzNCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQzt3QkFDckMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7cUJBQ3pFO29CQUNELHdGQUF3RjtnQkFDNUYsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNPLGVBQWUsQ0FBQyxHQUFRO1lBQzVCLElBQUksR0FBRyxLQUFLLFNBQVM7Z0JBQ2pCLE9BQU8sU0FBUyxDQUFDO1lBRXJCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHVCQUF1QixFQUFFO2dCQUNwRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQztnQkFDM0IsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO29CQUNyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3hFO2lCQUNKO2dCQUNELE9BQU8sR0FBRyxDQUFDO2FBQ2Q7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFO2dCQUNqRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7YUFDbkI7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsc0JBQXNCLEVBQUU7Z0JBQzFELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsT0FBTyxHQUFHLENBQUM7YUFDZDtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUU7Z0JBQzlDLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQzthQUNuQjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUU7Z0JBQy9DLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7aUJBQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFO2dCQUNoRCxPQUFPLEtBQUssQ0FBQzthQUNoQjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUU7Z0JBQ2xELE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzQjtpQkFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUU7Z0JBQ2pELE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ3hCO1lBRUQsTUFBTSxzQkFBc0IsQ0FBQztRQUNqQyxDQUFDO1FBQ08sY0FBYyxDQUFDLEdBQWlCO1lBQ3BDLElBQUksRUFBRSxHQUFRLEdBQUcsQ0FBQyxVQUFVLENBQUM7WUFDN0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNoQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM3QixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7YUFDdEI7aUJBQU07Z0JBRUgsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQztnQkFDckMsSUFBSSxFQUFFLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUMxQyxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNoRSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7cUJBQ2pEO2lCQUVKO2FBQ0o7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFFTyxVQUFVLENBQUMsSUFBcUI7WUFDcEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzlDLElBQUksV0FBVyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUMxQixXQUFXLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ3ZDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUN4QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUM7Z0JBQzdDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7b0JBQy9CLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztvQkFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzdDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN4RCxXQUFXLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQ2xELElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDOzRCQUNqRSxXQUFXLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztxQkFDOUU7aUJBQ0o7Z0JBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdDLElBQUksU0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7b0JBQ2xDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVM7d0JBQ3RCLFNBQVMsQ0FBQSxhQUFhO29CQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUN0QyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDcEMsU0FBUyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4RSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7b0JBQ2hELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO3dCQUNoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQzVDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2RCxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7eUJBQ25EO3FCQUNKO2lCQUNKO2dCQUNELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixJQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssV0FBVyxDQUFDLElBQUksSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRTs0QkFDM0UsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDOzRCQUNsRCxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3lCQUM1QjtxQkFDSjtpQkFDSjthQUNKO1FBQ0wsQ0FBQztRQUNELFdBQVcsQ0FBQyxJQUF1QjtZQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ2hCLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDdEMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxZQUFZO29CQUNaLElBQUksS0FBSyxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO29CQUNoRCxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7d0JBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOzRCQUNuQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs0QkFDOUIsMERBQTBEOzRCQUMxRCxJQUFJLElBQUksR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7NEJBQzlFLElBQUksQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUMvQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQzs2QkFDOUM7NEJBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7eUJBQ25EO3FCQUNKO2lCQUNKO2FBQ0o7UUFDTCxDQUFDO1FBQ0QsZUFBZSxDQUFDLElBQWE7WUFDekIsSUFBSSxFQUFFLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQy9CLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxTQUFTLEVBQUU7b0JBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDdEQ7YUFDSjtZQUNELElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUM7Z0JBQ3RGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxLQUFLLENBQUM7Z0JBQ1YsSUFBSSxLQUFLLENBQUM7Z0JBQ1YsSUFBSSxJQUFZLENBQUM7Z0JBQ2pCLElBQUksS0FBYSxDQUFDO2dCQUNsQixJQUFJLEtBQUssR0FBQyxJQUFJLENBQUM7Z0JBQ2YsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDN0IsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7b0JBQ2xCLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO29CQUNuQixJQUFJLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUEsb0RBQW9EO29CQUMzRSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUEsbURBQW1EO29CQUMzRSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO3dCQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztpQkFDbkQ7Z0JBQ0QsSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzNCLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO29CQUN4QixLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztvQkFDdkIsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDbEIsSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBLG9EQUFvRDtvQkFDM0UsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO29CQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFOzt3QkFFM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzt3QkFDM0IsSUFBRyxDQUFBLE1BQUEsTUFBQSxNQUFNLEdBQUksMENBQUUsVUFBVSwwQ0FBRSxJQUFJLDBDQUFFLE9BQU8sRUFBRSxNQUFHLFFBQVEsRUFBQzs0QkFDbEQsS0FBSyxDQUFDLFdBQVcsQ0FBTSxHQUFHLENBQUMsQ0FBQzt5QkFDL0I7d0JBQ0EsbUNBQW1DO29CQUN4QyxDQUFDLENBQUMsQ0FBQztvQkFDSCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7d0JBQzFCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQ3BDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQzt3QkFDcEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO3dCQUNkLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFOzRCQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7NEJBQ3RDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQzt5QkFDdEM7d0JBQ0QsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3dCQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUN2QixPQUFPO3FCQUNWO29CQUNELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFO3dCQUM1QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDbkQ7b0JBQ0QsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxxREFBcUQ7aUJBQ2xGO2dCQUVELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3BDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztnQkFDcEIsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNkLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNoQixRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7b0JBQ3RDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDdEM7Z0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQzVEOztnQkFDRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFDTyxTQUFTLENBQUMsSUFBYTtZQUMzQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM1QztZQUNELElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFFO2dCQUMvQyxJQUFJLEVBQUUsR0FBUSxJQUFJLENBQUM7Z0JBQ25CLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUU7b0JBQ2xELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQztvQkFDbkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7cUJBQ2xEO2lCQUNKO2FBQ0o7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksRUFBRTtnQkFDL0UsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QjtpQkFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDckQsSUFBSSxDQUFDLFVBQVUsQ0FBa0IsSUFBSSxDQUFDLENBQUM7YUFFMUM7aUJBQU0sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLEVBQUMsd0JBQXdCO2dCQUN6RixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDakIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM3QixJQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLFVBQVU7NEJBQ25FLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2xDO2lCQUNKOztvQkFDRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2xDOztnQkFDRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELHdCQUF3QjtZQUN4QixJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDakYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDbEQ7UUFDTCxDQUFDO1FBQ0QsZUFBZSxDQUFDLElBQWEsRUFBRSxHQUFXO1lBQ3RDLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM5QixPQUFPO29CQUNILFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDdEMsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUNoQyxDQUFBO2FBQ0o7WUFDRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUUsRUFBQyx3QkFBd0I7Z0JBQ2xGLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUE7Z0JBQ2hDLE9BQU87b0JBQ0gsU0FBUyxFQUFFLFNBQVM7b0JBQ3BCLFVBQVUsRUFBRSxRQUFRO2lCQUN2QixDQUFBO2FBQ0o7WUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRTtvQkFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQ3hDLElBQUksSUFBSTt3QkFDSixPQUFPLElBQUksQ0FBQztpQkFDbkI7YUFDSjtZQUFBLENBQUM7WUFDRixPQUFPLFNBQVMsQ0FBQztRQUNyQixDQUFDO1FBQ0QseUJBQXlCLENBQUMsSUFBWSxFQUFFLEdBQVc7WUFDL0MsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUVqQixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRW5GLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2xELDBDQUEwQztRQUU5QyxDQUFDO1FBQ0Q7Ozs7VUFJRTtRQUNGLEtBQUssQ0FBQyxJQUFZLEVBQUUsYUFBMEQsU0FBUztZQUNuRixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksVUFBVSxLQUFLLFNBQVM7Z0JBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDOztnQkFFN0IsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFFakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUVoQywwQ0FBMEM7UUFDOUMsQ0FBQztRQUNPLFVBQVUsQ0FBQyxJQUFhO1lBQzVCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUNqRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlELElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1RDtpQkFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUM3QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0MsSUFBSSxHQUFHLElBQUksQ0FBQztvQkFDUixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDN0M7aUJBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDaEQsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzlDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLEdBQUcsSUFBSSxDQUFDO29CQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM5Qzs7Z0JBQ0csTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLHNCQUFzQixDQUFDLENBQUM7UUFDakUsQ0FBQztRQUNEOztZQUVJO1FBQ0osaUJBQWlCLENBQUMsTUFBb0IsRUFBRSxNQUFtQjtZQUN2RCxhQUFhO1lBQ2IsaUNBQWlDO1lBQ2pDLElBQUksTUFBTSxHQUFtQixTQUFTLENBQUM7WUFDdkMsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUM5QixJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLENBQUMsTUFBTTtvQkFDUCxNQUFNLEdBQUcsRUFBRSxDQUFDO2dCQUNoQixzQkFBc0I7Z0JBQ3RCLDZCQUE2QjtnQkFDN0IsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDO2dCQUN2QixJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUU7b0JBQ2YsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUN0RDtpQkFDSjtnQkFDRCxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUN6QztZQUNELHNCQUFzQjtZQUN0QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDckksSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3JCLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtnQkFDNUIsSUFBSSxHQUFHLEtBQUssTUFBTSxDQUFDLElBQUk7b0JBQ25CLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQTthQUN0QztZQUNELElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFFMUM7aUJBQU07Z0JBQ0gsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO2FBQzNDO1lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQzVCLENBQUM7UUFDRDs7Ozs7VUFLRTtRQUNGLG9CQUFvQixDQUFDLFFBQWdCLEVBQUUsU0FBUyxHQUFHLFNBQVMsRUFBRSxlQUF1QixTQUFTOztZQUMxRixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO2dCQUM3RyxRQUFRLEdBQUcsVUFBVSxDQUFDO2dCQUN0QixJQUFJLFNBQVMsR0FBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDL0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDNUQsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2xELElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsRUFBRTt3QkFDdEYsU0FBUyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFFNUMsSUFBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOzRCQUM3QyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUM5Qjt3QkFDRCxPQUFPLFNBQVMsQ0FBQztxQkFDcEI7aUJBRUo7YUFDSjtZQUNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzFGLElBQUksSUFBSSxHQUFVLFNBQVMsQ0FBQztnQkFDNUIsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO29CQUN6QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQy9ELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUMsR0FBRyxDQUFDLEVBQUU7NEJBQ2hJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMvQztxQkFDSjtpQkFDSjs7b0JBQ0csSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELElBQUksSUFBSSxJQUFJLFNBQVM7b0JBQ2pCLE9BQU87Z0JBQ1gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLElBQUcsQ0FBQSxNQUFBLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsMENBQUUsU0FBUywwQ0FBRSxNQUFNLElBQUMsQ0FBQyxFQUFDO29CQUM1QyxPQUFPLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsMENBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRDtnQkFDRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCOzs7OzttQkFLRztnQkFDSCx5Q0FBeUM7Z0JBQ3pDLCtCQUErQjtnQkFDL0Isc0JBQXNCO2FBQ3pCO1FBRUwsQ0FBQztRQUNEOzs7V0FHRztRQUNILG9CQUFvQixDQUFDLE9BQWU7O1lBRWhDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDOUIsSUFBSSxRQUFRLEdBQVksRUFBRSxDQUFDO1lBQzNCLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTO2dCQUM1RSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsbUJBQW1CO1lBQ25CLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO2dCQUNsQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsQ0FBQyxDQUFDLENBQUM7YUFDTjtZQUNELElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ2pCLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2FBQ047WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckM7WUFDRCxzQ0FBc0M7WUFDdEMsS0FBSyxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUMzQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM5QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtvQkFDbEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbkMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3BDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLE9BQU8sSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssT0FBTyxHQUFHLE9BQU8sRUFBRTtnQ0FDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7NkJBQzNCO3lCQUNKO3dCQUNELGdCQUFnQjt3QkFDaEIsWUFBWTt3QkFDWixJQUFJLFFBQVEsR0FBRyxNQUFBLE1BQUEsTUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksMENBQUUsV0FBVywwQ0FBRSxRQUFRLENBQUM7d0JBQ3pELElBQUksUUFBUSxFQUFFOzRCQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dDQUN0QyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtvQ0FDaEYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FFaEM7NkJBQ0o7NEJBQ0QsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQ0FDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQUUsSUFBSSxDQUFDLENBQUM7NkJBQ3ZDO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0o7UUFFTCxDQUFDO1FBQ08sZ0JBQWdCLENBQUMsVUFBdUQsRUFBRSxnQkFBc0QsU0FBUzs7WUFDN0ksSUFBSSxLQUFLLENBQUM7WUFDVixJQUFJLGFBQWEsRUFBRTtnQkFDZixLQUFLLEdBQUcsTUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksQ0FBQztnQkFDakYsSUFBRyxLQUFLLENBQUMsVUFBVTtvQkFDZixLQUFLLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUV0QyxLQUFLLEdBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUUvQjtpQkFBTTtnQkFDSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7d0JBQ2QsS0FBSyxHQUFHLE1BQUEsTUFBQSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsMENBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsMENBQUUsSUFBSSxDQUFDO3dCQUNqRSxJQUFJLEtBQUs7NEJBQ0wsTUFBTTtxQkFDYjt5QkFBTSxFQUFDLG1CQUFtQjt3QkFDdkIsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO3FCQUN6QztpQkFDSjthQUNKO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNEOzthQUVLO1FBQ0wsMEJBQTBCLENBQUMsSUFBWSxFQUFDLGdCQUFxQixTQUFTO1lBQ2xFLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQztZQUM1QixJQUFHLE9BQU8sS0FBRyxTQUFTO2dCQUNsQixPQUFPLEdBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN0RSxLQUFLLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRSxPQUFPLEdBQUcsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO2dCQUM3QyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQSxFQUFFLENBQUEsQ0FBQyxDQUFBLE9BQU8sQ0FBQyxDQUFDLEtBQUssU0FBUztvQkFDNUYsTUFBTTthQUNiO1lBQ0QsT0FBTyxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUcsQ0FBQyxDQUFBLENBQUMsQ0FBQSxFQUFFLENBQUEsQ0FBQyxDQUFBLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRDs7V0FFRztRQUNLLHlCQUF5QixDQUFDLElBQWEsRUFBRSxXQUFtQixFQUFFLFFBQVE7WUFDMUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzlCLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDNUIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3BFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyRCxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNoSCxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDM0M7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakIsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7b0JBQzFFLHlCQUF5QjtvQkFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDcEUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JELElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDakI7b0JBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3RHO2FBQ0o7UUFDTCxDQUFDO1FBQ08sbUJBQW1CLENBQUMsWUFBb0IsRUFBRSxRQUFnQixFQUFFLEtBQXVCLEVBQ3ZGLGFBQXNCLEtBQUssRUFBRSxVQUFtQixTQUFTLEVBQ3pELFNBQTRELFNBQVMsRUFDckUsS0FBYztZQUVkLElBQUksTUFBTSxHQUFRLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDakYsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDNUQsTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsRUFBTyxNQUFNLENBQUMsQ0FBQztZQUN2RSxJQUFJLFFBQVEsS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssRUFBRTtnQkFDekMsUUFBUSxHQUFHLFVBQVUsQ0FBQztnQkFDdEIsTUFBTSxHQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO2dCQUN4RixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksU0FBUyxFQUFFLEVBQUMsRUFBRTtvQkFDckQsYUFBYSxHQUFHLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDN0YsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3pDO3FCQUFNO29CQUNILElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTt3QkFDdEIsWUFBWTt3QkFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztxQkFDakY7eUJBQU07d0JBQ0gsWUFBWTt3QkFDWixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDO3dCQUM3RSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDbkMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0NBQzFGLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQ0FDM0IsT0FBTzs2QkFDVjt5QkFDSjt3QkFDRCxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDO3FCQUMzRDtpQkFFSjthQUNKO2lCQUFNLEVBQUcsNkNBQTZDO2dCQUNuRCxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxTQUFTLEVBQUUsRUFBQyxlQUFlO29CQUMvSCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDckQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDO29CQUN2QyxJQUFJLENBQUMseUJBQXlCLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDM0Q7cUJBQU07b0JBQ0gsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3RDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUMzRDthQUNKO1lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7WUFDbkMsZUFBZTtZQUNmLDZDQUE2QztRQUVqRCxDQUFDO1FBQ0Q7Ozs7Ozs7Ozs7OzthQVlLO1FBQ0w7Ozs7Ozs7Ozs7VUFVRTtRQUNGLGlCQUFpQixDQUFDLFlBQW9CLEVBQUUsUUFBZ0IsRUFBRSxLQUF1QixFQUM3RSxVQUF1RCxFQUN2RCxhQUFzQixLQUFLLEVBQUUsVUFBbUIsU0FBUyxFQUN6RCxTQUE0RCxTQUFTLEVBQ3JFLGdCQUFzRCxTQUFTO1lBRS9ELElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBRyxTQUFTO2dCQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFDLEVBQUUsQ0FBQztZQUMvQixJQUFJLFVBQVUsS0FBSyxTQUFTO2dCQUN4QixVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzdELElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUNqRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzVGLE9BQU87YUFDVjtZQUNELElBQUksUUFBUSxHQUFRLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDbkYsSUFBSSxVQUFVLEdBQW1CLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUE7WUFDekQsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFLEVBQUUsMEJBQTBCO2dCQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUEsaUJBQWlCO2dCQUNoRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN4QixLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pHLE9BQU8sR0FBRyxJQUFJLENBQUM7Z0JBQ2YsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDL0IsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELFFBQVEsR0FBRyxPQUFPLENBQUM7Z0JBQ25CLGFBQWEsR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN2Rzs7Ozs7Ozt1QkFPTzthQUNWO2lCQUFNLElBQUksVUFBVSxFQUFFO2dCQUNuQixhQUFhLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFJOztnQkFDRyxhQUFhLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBRyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3BJLElBQUksT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFNBQVMsRUFBRSxFQUFDLGVBQWU7Z0JBQy9ILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNyRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxhQUFhLENBQUM7Z0JBQy9DLGVBQWU7Z0JBQ2YsNkNBQTZDO2FBQ2hEO2lCQUFNLEVBQUMsWUFBWTtnQkFDaEIsSUFBSSxNQUFNLEVBQUU7b0JBQ1IsSUFBSSxNQUFNLENBQUMsS0FBSyxLQUFLLFNBQVM7d0JBQzFCLE1BQU0saUJBQWlCLENBQUM7b0JBQzVCLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztvQkFDckIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQzdFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxFQUFFOzRCQUMzRSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs0QkFDL0QsTUFBTTt5QkFDVDtxQkFDSjtvQkFDRCxJQUFJLENBQUMsSUFBSTt3QkFDTCxNQUFNLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsWUFBWSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxHQUFHLFNBQVMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2hILElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNsRCxJQUFJLEdBQUcsSUFBSSxDQUFDO3dCQUNSLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7aUJBQy9EO3FCQUFNO29CQUNILElBQUksUUFBUSxHQUFZLFNBQVMsQ0FBQztvQkFDbEMsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO3dCQUN0QyxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUU7NEJBQ2xCLHFFQUFxRTs0QkFDckUsVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQzs0QkFDeEUsU0FBUzt5QkFDWjt3QkFDRCxJQUFJLFFBQVEsR0FBWSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFDckcsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNLENBQUM7NEJBQ2pDLFFBQVEsR0FBRyxRQUFRLENBQUM7cUJBQzNCO29CQUNELElBQUksUUFBUSxFQUFFO3dCQUNWLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMxRCxJQUFJLEdBQUcsSUFBSSxDQUFDOzRCQUNSLFFBQVEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDO3FCQUN2RTt5QkFBTTt3QkFDSCxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO3dCQUM1QixJQUFHOzRCQUNDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO2dDQUM1RSxHQUFHLEVBQUUsQ0FBQzt5QkFDYjt3QkFBQSxXQUFLO3lCQUVMO3dCQUNELFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztxQkFDNUM7aUJBQ0o7YUFDSjtRQUNMLENBQUM7UUFDRDs7WUFFSTtRQUNKLHlCQUF5QixDQUFDLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxVQUFrQixFQUFFLFVBQWtCO1lBQ2hHLElBQUksS0FBSyxHQUFZLFNBQVMsQ0FBQztZQUMvQixJQUFJLE1BQU0sR0FBWSxTQUFTLENBQUM7WUFDaEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMzQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxVQUFVO29CQUNuRCxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDM0IsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxVQUFVO29CQUNuRCxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzthQUMvQjtZQUNELElBQUksQ0FBQyxLQUFLO2dCQUNOLE1BQU0sS0FBSyxDQUFDLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxNQUFNO2dCQUNQLE1BQU0sS0FBSyxDQUFDLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFELEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQzVDLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBR2hELENBQUM7UUFDRDs7Ozs7O1VBTUU7UUFDRixpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFVBQXVELEVBQUUsZ0JBQXNELFNBQVMsRUFBQyxhQUFhLEdBQUMsU0FBUzs7WUFDaEwsSUFBSSxVQUFVLEtBQUssU0FBUztnQkFDeEIsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDakMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxFQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xFLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNsQixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUztnQkFDN0IsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixtQkFBbUI7WUFDbkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUM1RCxZQUFZO1lBQ1osSUFBSSxDQUFBLE1BQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFVBQVUsMENBQUUsTUFBTSxJQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO2dCQUN0RSxLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQ2hCO1lBQ0QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUVwQyxJQUFJLFVBQVUsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUN6RCxJQUFJLElBQUksS0FBSyxTQUFTO2dCQUNsQixNQUFNLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1lBQ2hFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO29CQUN0RixNQUFNO2FBQ2I7WUFDRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2hILFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxLQUFLO2dCQUNMLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzFDLENBQUM7S0FDSixDQUFBO0lBOTFCWSxNQUFNO1FBRGxCLElBQUEsY0FBTSxFQUFDLDRCQUE0QixDQUFDOztPQUN4QixNQUFNLENBODFCbEI7SUE5MUJZLHdCQUFNO0lBZzJCWixLQUFLLFVBQVUsSUFBSTtRQUN0QixNQUFNLG9CQUFVLENBQUMsYUFBYSxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLG9CQUFVLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDMUIsa0pBQWtKO1FBQ2xKLDBJQUEwSTtRQUMzSSwySkFBMko7UUFDMUosZ0NBQWdDO1FBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFDLENBQUMsRUFBQyxTQUFTLEVBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsUUFBUSxDQUFDO1FBQ1YsNkVBQTZFO1FBQzlFLHFHQUFxRztRQUNuRyw2REFBNkQ7UUFFN0QsMkRBQTJEO1FBQzNELHVIQUF1SDtRQUN2SCw4QkFBOEI7UUFDOUIsc0pBQXNKO1FBQ3RKLG9KQUFvSjtRQUNwSixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLFlBQVk7UUFDWjs7O2dDQUd3QjtJQUk1QixDQUFDO0lBNUJELG9CQTRCQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuXHJcblxyXG5pbXBvcnQgdHlwZXNjcmlwdCBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCI7XHJcblxyXG5cclxuaW50ZXJmYWNlIFByb3BlcnRpZXMge1xyXG4gICAgW2RldGFpbHM6IHN0cmluZ106IEVudHJ5O1xyXG59XHJcbmludGVyZmFjZSBFbnRyeSB7XHJcbiAgICB2YWx1ZT86IGFueTtcclxuICAgIG5vZGU/OiB0cy5Ob2RlO1xyXG4gICAgaXNGdW5jdGlvbjogYm9vbGVhbjtcclxufVxyXG5jbGFzcyBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgbm9kZT86IHRzLkRlY29yYXRvcjtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBwYXJzZWRQYXJhbWV0ZXI/OiBvYmplY3RbXSA9IFtdO1xyXG4gICAgcGFyYW1ldGVyPzogc3RyaW5nW10gPSBbXTtcclxuXHJcbn1cclxuY2xhc3MgUGFyc2VkTWVtYmVyIHtcclxuICAgIG5vZGU/OiB0cy5Ob2RlO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIGRlY29yYXRvcj86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZERlY29yYXRvciB9ID0ge307XHJcbiAgICB0eXBlPzogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBQYXJzZWRDbGFzcyB7XHJcbiAgICBwYXJlbnQ/OiBQYXJzZXI7XHJcbiAgICBub2RlPzogdHMuQ2xhc3NFbGVtZW50O1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIGZ1bGxDbGFzc25hbWU/OiBzdHJpbmc7XHJcbiAgICBtZW1iZXJzPzogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkTWVtYmVyIH0gPSB7fTtcclxuICAgIGRlY29yYXRvcj86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZERlY29yYXRvciB9ID0ge307XHJcbn1cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXCIpXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSA9IHVuZGVmaW5lZDtcclxuICAgIHR5cGVNZU5vZGU6IHRzLk5vZGU7XHJcbiAgICB0eXBlTWU6IHsgW25hbWU6IHN0cmluZ106IEVudHJ5IH0gPSB7fTtcclxuICAgIGNsYXNzZXM6IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZENsYXNzIH0gPSB7fTtcclxuICAgIGltcG9ydHM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbiAgICBmdW5jdGlvbnM6IHsgW25hbWU6IHN0cmluZ106IHRzLk5vZGUgfSA9IHt9O1xyXG4gICAgdmFyaWFibGVzOiB7IFtuYW1lOiBzdHJpbmddOiB0cy5Ob2RlIH0gPSB7fTtcclxuICAgIGNsYXNzU2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W107XHJcblxyXG4gICAgY29kZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge09iamVjdC48c3RyaW5nLE9iamVjdC48c3RyaW5nLFtvYmplY3RdPj4gLSBhbGwgcHJvcGVydGllc1xyXG4gICAgKiBlLmcuIGRhdGFbXCJ0ZXh0Ym94MVwiXVt2YWx1ZV0tPkVudHJ5XHJcbiAgICAqL1xyXG4gICAgZGF0YTogeyBbdmFyaWFibGU6IHN0cmluZ106IHsgW3Byb3BlcnR5OiBzdHJpbmddOiBFbnRyeVtdIH0gfTtcclxuICAgIC8qKlxyXG4gICAgICogcGFyc2VzIENvZGUgZm9yIFVJIHJlbGV2YW50IHNldHRpbmdzXHJcbiAgICAgKiBAY2xhc3MgamFzc2lqc19lZGl0b3IudXRpbC5QYXJzZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIC8qKiB7W3N0cmluZ119IC0gYWxsIGNvZGUgbGluZXMqL1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1vZGlmaWVkQ29kZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKHsgbmV3TGluZTogdHMuTmV3TGluZUtpbmQuTGluZUZlZWQgfSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCAvKnNldFBhcmVudE5vZGVzKi8gZmFsc2UsIHRzLlNjcmlwdEtpbmQuVFMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCB0aGlzLnNvdXJjZUZpbGUsIHJlc3VsdEZpbGUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgYSBwcm9wZXJ0eVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcmlhYmxlIC0gbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIG5hbWUgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgIC0gY29kZSAtIHRoZSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIG5vZGUgLSB0aGUgbm9kZSBvZiB0aGUgc3RhdGVtZW50XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkKHZhcmlhYmxlOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG5vZGU6IHRzLk5vZGUsIGlzRnVuY3Rpb24gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkudHJpbSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlLFxyXG4gICAgICAgICAgICAgICAgaXNGdW5jdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgYSBwcm9wZXJ0eSB2YWx1ZSBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJpYWJsZSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAgICovXHJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlKHZhcmlhYmxlLCBwcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIC8qIHZhcmlhYmxlPVwidGhpcy5cIit2YXJpYWJsZTtcclxuICAgICAgICAgaWYodGhpcy5kYXRhW3ZhcmlhYmxlXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9Ki9cclxuICAgICAgICAvL3RoaXMgXHJcbiAgICAgICAgLy8gICB2YXIgdmFsdWU9dGhpcy5wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLnZhcmlhYmxlbmFtZSx0aGlzLnByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRUeXBlTWUobmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRoaXMudHlwZU1lTm9kZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciB0cCA9IHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKHR5cGUsIFtdKTtcclxuICAgICAgICB2YXIgbmV3bm9kZSA9IHRzLmNyZWF0ZVByb3BlcnR5U2lnbmF0dXJlKHVuZGVmaW5lZCwgbmFtZSArIFwiP1wiLCB1bmRlZmluZWQsIHRwLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMudHlwZU1lTm9kZVtcIm1lbWJlcnNcIl0ucHVzaChuZXdub2RlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGltcG9ydCB7bmFtZX0gZnJvbSBmaWxlXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBcclxuICAgICAqIEBwYXJhbSBmaWxlIFxyXG4gICAgICovXHJcbiAgICBhZGRJbXBvcnRJZk5lZWRlZChuYW1lOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmltcG9ydHNbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGltcCA9IHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKGZhbHNlLCB1bmRlZmluZWQsIHRzLmNyZWF0ZUlkZW50aWZpZXIobmFtZSkpXSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydE5vZGUgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgaW1wKSwgdHMuY3JlYXRlTGl0ZXJhbChmaWxlKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlRmlsZSA9IHRzLnVwZGF0ZVNvdXJjZUZpbGVOb2RlKHRoaXMuc291cmNlRmlsZSwgW2ltcG9ydE5vZGUsIC4uLnRoaXMuc291cmNlRmlsZS5zdGF0ZW1lbnRzXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXJzZVR5cGVNZU5vZGUobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5UeXBlTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICBpZiAobm9kZVtcIm1lbWJlcnNcIl0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVNZU5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICBub2RlW1wibWVtYmVyc1wiXS5mb3JFYWNoKGZ1bmN0aW9uICh0bm9kZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdG5vZGUubmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHlwZSA9IHRub2RlLnR5cGUudHlwZU5hbWUudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy50eXBlTWVbbmFtZV0gPSB7IG5vZGU6IHRub2RlLCB2YWx1ZTogc3R5cGUsIGlzRnVuY3Rpb246IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIHRoaXMuYWRkKFwibWVcIiwgbmFtZSwgXCJ0eXBlZGVjbGFyYXRpb246XCIgKyBzdHlwZSwgdW5kZWZpbmVkLCBhbGluZSwgYWxpbmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB0aGlzLnBhcnNlVHlwZU1lTm9kZShjKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnZlcnRBcmd1bWVudChhcmc6IGFueSkge1xyXG4gICAgICAgIGlmIChhcmcgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHByb3BzID0gYXJnLnByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIGlmIChwcm9wcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0W3Byb3BzW3BdLm5hbWUudGV4dF0gPSB0aGlzLmNvbnZlcnRBcmd1bWVudChwcm9wc1twXS5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZy50ZXh0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbikge1xyXG4gICAgICAgICAgICBsZXQgcmV0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgYXJnLmVsZW1lbnRzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXQucHVzaCh0aGlzLmNvbnZlcnRBcmd1bWVudChhcmcuZWxlbWVudHNbcF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5UcnVlS2V5d29yZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLkZhbHNlS2V5d29yZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5OdW1lcmljTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKGFyZy50ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLkFycm93RnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZy5nZXRUZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBcIkVycm9yIHR5cGUgbm90IGZvdW5kXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlRGVjb3JhdG9yKGRlYzogdHMuRGVjb3JhdG9yKTogUGFyc2VkRGVjb3JhdG9yIHtcclxuICAgICAgICB2YXIgZXg6IGFueSA9IGRlYy5leHByZXNzaW9uO1xyXG4gICAgICAgIHZhciByZXQgPSBuZXcgUGFyc2VkRGVjb3JhdG9yKCk7XHJcbiAgICAgICAgaWYgKGV4LmV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXQubmFtZSA9IGV4LnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHJldC5uYW1lID0gZXguZXhwcmVzc2lvbi5lc2NhcGVkVGV4dDtcclxuICAgICAgICAgICAgaWYgKGV4LmV4cHJlc3Npb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBleC5hcmd1bWVudHMubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQucGFyc2VkUGFyYW1ldGVyLnB1c2godGhpcy5jb252ZXJ0QXJndW1lbnQoZXguYXJndW1lbnRzW2FdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LnBhcmFtZXRlci5wdXNoKGV4LmFyZ3VtZW50c1thXS5nZXRUZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDbGFzcyhub2RlOiB0cy5DbGFzc0VsZW1lbnQpIHtcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHBhcnNlZENsYXNzID0gbmV3IFBhcnNlZENsYXNzKCk7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLm5hbWUgPSBub2RlLm5hbWUuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICBwYXJzZWRDbGFzcy5ub2RlID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW3BhcnNlZENsYXNzLm5hbWVdID0gcGFyc2VkQ2xhc3M7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmRlY29yYXRvcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlYyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBub2RlLmRlY29yYXRvcnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkRGVjID0gdGhpcy5wYXJzZURlY29yYXRvcihub2RlLmRlY29yYXRvcnNbeF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLmRlY29yYXRvcltwYXJzZWREZWMubmFtZV0gPSBwYXJzZWREZWM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlZENsYXNzLmRlY29yYXRvcltcIiRDbGFzc1wiXSAmJiBwYXJzZWREZWMucGFyYW1ldGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLmZ1bGxDbGFzc25hbWUgPSBwYXJzZWREZWMucGFyYW1ldGVyWzBdLnJlcGxhY2VBbGwoJ1wiJywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZVtcIm1lbWJlcnNcIl0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZWRNZW0gPSBuZXcgUGFyc2VkTWVtYmVyKClcclxuICAgICAgICAgICAgICAgIHZhciBtZW0gPSBub2RlW1wibWVtYmVyc1wiXVt4XTtcclxuICAgICAgICAgICAgICAgIGlmIChtZW0ubmFtZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOy8vQ29uc3RydWN0b3JcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5uYW1lID0gbWVtLm5hbWUuZXNjYXBlZFRleHQ7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0ubm9kZSA9IG5vZGVbXCJtZW1iZXJzXCJdW3hdO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLnR5cGUgPSAobWVtLnR5cGUgPyBtZW0udHlwZS5nZXRGdWxsVGV4dCgpLnRyaW0oKSA6IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRDbGFzcy5tZW1iZXJzW3BhcnNlZE1lbS5uYW1lXSA9IHBhcnNlZE1lbTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChtZW0uZGVjb3JhdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVtLmRlY29yYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlZERlYyA9IHRoaXMucGFyc2VEZWNvcmF0b3IobWVtLmRlY29yYXRvcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRNZW0uZGVjb3JhdG9yW3BhcnNlZERlYy5uYW1lXSA9IHBhcnNlZERlYztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNsYXNzU2NvcGUubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gdGhpcy5jbGFzc1Njb3BlW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3NuYW1lID09PSBwYXJzZWRDbGFzcy5uYW1lICYmIHBhcnNlZENsYXNzLm1lbWJlcnNbY29sLm1ldGhvZG5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZCA9IHBhcnNlZENsYXNzLm1lbWJlcnNbY29sLm1ldGhvZG5hbWVdLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5kKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwYXJzZUNvbmZpZyhub2RlOiB0cy5DYWxsRXhwcmVzc2lvbikge1xyXG4gICAgICAgIGlmIChub2RlLmFyZ3VtZW50cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gbm9kZS5leHByZXNzaW9uLmdldFRleHQoKTtcclxuICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICBwcm9wID0gbGVmdC5zdWJzdHJpbmcobGFzdHBvcyArIDEpO1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcHM6IGFueVtdID0gbm9kZS5hcmd1bWVudHNbMF0ucHJvcGVydGllcztcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHByb3BzW3BdLm5hbWUudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHZhbHVlID0gdGhpcy5jb252ZXJ0QXJndW1lbnQocHJvcHNbcF0uaW5pdGlhbGl6ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29kZTogc3RyaW5nID0gcHJvcHNbcF0uaW5pdGlhbGl6ZXIgPyBwcm9wc1twXS5pbml0aWFsaXplci5nZXRUZXh0KCkgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29kZT8uaW5kZXhPZihcIi5jb25maWdcIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMocHJvcHNbcF0uaW5pdGlhbGl6ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBuYW1lLCBjb2RlLCBwcm9wc1twXSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBhcnNlUHJvcGVydGllcyhub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmluaXRpYWxpemVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobmFtZSwgXCJfbmV3X1wiLCB2YWx1ZSwgbm9kZS5wYXJlbnQucGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLm9wZXJhdG9yVG9rZW4ua2luZCA9PT0gdHMuU3ludGF4S2luZC5FcXVhbHNUb2tlbikgfHxcclxuICAgICAgICAgICAgdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTE7XHJcbiAgICAgICAgICAgIHZhciBub2RlMjtcclxuICAgICAgICAgICAgdmFyIGxlZnQ6IHN0cmluZztcclxuICAgICAgICAgICAgdmFyIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcz10aGlzO1xyXG4gICAgICAgICAgICB2YXIgaXNGdW5jdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodHMuaXNCaW5hcnlFeHByZXNzaW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlMSA9IG5vZGUubGVmdDtcclxuICAgICAgICAgICAgICAgIG5vZGUyID0gbm9kZS5yaWdodDtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBub2RlMS5nZXRUZXh0KCk7Ly8gdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMS5wb3MsIG5vZGUxLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBub2RlMi5nZXRUZXh0KCk7Ly90aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUyLnBvcywgbm9kZTIuZW5kKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhcnRzV2l0aChcIm5ldyBcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQobGVmdCwgXCJfbmV3X1wiLCB2YWx1ZSwgbm9kZS5wYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlMSA9IG5vZGUuZXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgIG5vZGUyID0gbm9kZS5hcmd1bWVudHM7XHJcbiAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBub2RlMS5nZXRUZXh0KCk7Ly8gdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMS5wb3MsIG5vZGUxLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hcmd1bWVudHMuZm9yRWFjaCgoYXJnKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaChhcmcuZ2V0VGV4dCgpKTtcclxuICAgICAgICAgICAgICAgICAgICBpZigoPGFueT5hcmcpPy5leHByZXNzaW9uPy5uYW1lPy5nZXRUZXh0KCk9PT1cImNvbmZpZ1wiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucGFyc2VDb25maWcoPGFueT5hcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgLy9hcmcuZ2V0VGV4dCgpLmluZGV4T2YoXCIuY29uZmlnKFwiKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobGVmdC5lbmRzV2l0aChcIi5jb25maWdcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGFzdHBvcyA9IGxlZnQubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9IGxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0cG9zICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IGxlZnQuc3Vic3RyaW5nKDAsIGxhc3Rwb3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gbGVmdC5zdWJzdHJpbmcobGFzdHBvcyArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcmFtcy5qb2luKFwiLCBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQodmFyaWFibGUsIHByb3AsIHZhbHVlLCBub2RlLCBpc0Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlQ29uZmlnKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0LmVuZHNXaXRoKFwiLmNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUuYXJndW1lbnRzWzBdW1wiYm9keVwiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcmFtcy5qb2luKFwiLCBcIik7Ly90aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUyLnBvcywgbm9kZTIuZW5kKS50cmltKCk7Ly9cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICBwcm9wID0gbGVmdC5zdWJzdHJpbmcobGFzdHBvcyArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBwcm9wLCB2YWx1ZSwgbm9kZS5wYXJlbnQsIGlzRnVuY3Rpb24pO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMucGFyc2VQcm9wZXJ0aWVzKGMpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc1tub2RlW1wibmFtZVwiXS50ZXh0XSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIG5kOiBhbnkgPSBub2RlO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IG5kLm1vZHVsZVNwZWNpZmllci50ZXh0O1xyXG4gICAgICAgICAgICBpZiAobmQuaW1wb3J0Q2xhdXNlICYmIG5kLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXMgPSBuZC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgbmFtZXMubGVuZ3RoOyBlKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltcG9ydHNbbmFtZXNbZV0ubmFtZS5lc2NhcGVkVGV4dF0gPSBmaWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5UeXBlQWxpYXNEZWNsYXJhdGlvbiAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBcIk1lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVR5cGVNZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQ2xhc3MoPHRzLkNsYXNzRWxlbWVudD5ub2RlKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlICYmIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uKSB7Ly9mdW5jdGlvbnMgb3V0IG9mIGNsYXNzXHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25zW25vZGVbXCJuYW1lXCJdLnRleHRdID0gbm9kZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNsYXNzU2NvcGUubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gdGhpcy5jbGFzc1Njb3BlW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3NuYW1lID09PSB1bmRlZmluZWQgJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gY29sLm1ldGhvZG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMudmlzaXROb2RlKGMpKTtcclxuICAgICAgICAvL1RPRE8gcmVtb3ZlIHRoaXMgYmxvY2tcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24gJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gXCJ0ZXN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGQobm9kZVtcIm5hbWVcIl0udGV4dCwgXCJcIiwgXCJcIiwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZWFyY2hDbGFzc25vZGUobm9kZTogdHMuTm9kZSwgcG9zOiBudW1iZXIpOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfSB7XHJcbiAgICAgICAgaWYgKHRzLmlzTWV0aG9kRGVjbGFyYXRpb24obm9kZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogbm9kZS5wYXJlbnRbXCJuYW1lXCJdW1widGV4dFwiXSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZG5hbWU6IG5vZGUubmFtZVtcInRleHRcIl1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZSAmJiBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbikgey8vZnVuY3Rpb25zIG91dCBvZiBjbGFzc1xyXG4gICAgICAgICAgICB2YXIgZnVuY25hbWUgPSBub2RlW1wibmFtZVwiXS50ZXh0XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc25hbWU6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZG5hbWU6IGZ1bmNuYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGNoaWxkcyA9IG5vZGUuZ2V0Q2hpbGRyZW4oKTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYyA9IGNoaWxkc1t4XTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSBjLnBvcyAmJiBwb3MgPD0gYy5lbmQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXN0ID0gdGhpcy5zZWFyY2hDbGFzc25vZGUoYywgcG9zKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgZ2V0Q2xhc3NTY29wZUZyb21Qb3NpdGlvbihjb2RlOiBzdHJpbmcsIHBvczogbnVtYmVyKTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH0ge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XHJcblxyXG4gICAgICAgIHRoaXMuc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoJ2R1bW15LnRzJywgY29kZSwgdHMuU2NyaXB0VGFyZ2V0LkVTNSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnNlYXJjaENsYXNzbm9kZSh0aGlzLnNvdXJjZUZpbGUsIHBvcyk7XHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5wYXJzZW9sZChjb2RlLG9ubHlmdW5jdGlvbik7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHBhcnNlIHRoZSBjb2RlIFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIHRoZSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbmx5ZnVuY3Rpb24gLSBvbmx5IHRoZSBjb2RlIGluIHRoZSBmdW5jdGlvbiBpcyBwYXJzZWQsIGUuZy4gXCJsYXlvdXQoKVwiXHJcbiAgICAqL1xyXG4gICAgcGFyc2UoY29kZTogc3RyaW5nLCBjbGFzc1Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuICAgICAgICBpZiAoY2xhc3NTY29wZSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLmNsYXNzU2NvcGUgPSBjbGFzc1Njb3BlO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgY2xhc3NTY29wZSA9IHRoaXMuY2xhc3NTY29wZTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZSgnZHVtbXkudHMnLCBjb2RlLCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlKTtcclxuICAgICAgICB0aGlzLnZpc2l0Tm9kZSh0aGlzLnNvdXJjZUZpbGUpO1xyXG5cclxuICAgICAgICAvL3JldHVybiB0aGlzLnBhcnNlb2xkKGNvZGUsb25seWZ1bmN0aW9uKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcmVtb3ZlTm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXSkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnQucGFyZW50W1widHlwZVwiXVtcIm1lbWJlcnNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQucGFyZW50W1widHlwZVwiXVtcIm1lbWJlcnNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wibWVtYmVyc1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50W1wicHJvcGVydGllc1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInByb3BlcnRpZXNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJwcm9wZXJ0aWVzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnRbXCJlbGVtZW50c1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcImVsZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wiZWxlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKG5vZGUuZ2V0RnVsbFRleHQoKSArIFwiY291bGQgbm90IGJlIHJlbW92ZWRcIik7XHJcbiAgICB9XHJcbiAgICAvKiogXHJcbiAgICAgKiBtb2RpZnkgYSBtZW1iZXIgXHJcbiAgICAgKiovXHJcbiAgICBhZGRPck1vZGlmeU1lbWJlcihtZW1iZXI6IFBhcnNlZE1lbWJlciwgcGNsYXNzOiBQYXJzZWRDbGFzcykge1xyXG4gICAgICAgIC8vbWVtYmVyLm5vZGVcclxuICAgICAgICAvL3ZhciBuZXdtZW1iZXI9dHMuY3JlYXRlUHJvcGVydHlcclxuICAgICAgICB2YXIgbmV3ZGVjOiB0cy5EZWNvcmF0b3JbXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbWVtYmVyLmRlY29yYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgZGVjID0gbWVtYmVyLmRlY29yYXRvcltrZXldO1xyXG4gICAgICAgICAgICBpZiAoIW5ld2RlYylcclxuICAgICAgICAgICAgICAgIG5ld2RlYyA9IFtdO1xyXG4gICAgICAgICAgICAvL3RzLmNyZWF0ZURlY29yYXRvcigpXHJcbiAgICAgICAgICAgIC8vbWVtYmVyLmRlY29yYXRvcltrZXldLm5hbWU7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChkZWMucGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVjLnBhcmFtZXRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRzLmNyZWF0ZUlkZW50aWZpZXIoZGVjLnBhcmFtZXRlcltpXSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjYWxsID0gdHMuY3JlYXRlQ2FsbCh0cy5jcmVhdGVJZGVudGlmaWVyKGRlYy5uYW1lKSwgdW5kZWZpbmVkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBuZXdkZWMucHVzaCh0cy5jcmVhdGVEZWNvcmF0b3IoY2FsbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3ZhciB0eXBlPXRzLmNyZWF0ZVR5XHJcbiAgICAgICAgdmFyIG5ld21lbWJlciA9IHRzLmNyZWF0ZVByb3BlcnR5KG5ld2RlYywgdW5kZWZpbmVkLCBtZW1iZXIubmFtZSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZShtZW1iZXIudHlwZSwgW10pLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHZhciBub2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwY2xhc3MubWVtYmVycykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBtZW1iZXIubmFtZSlcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBwY2xhc3MubWVtYmVyc1trZXldLm5vZGVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl0ucHVzaChuZXdtZW1iZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXVtwb3NdID0gbmV3bWVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwY2xhc3MubWVtYmVyc1ttZW1iZXIubmFtZV0gPSBtZW1iZXI7XHJcbiAgICAgICAgbWVtYmVyLm5vZGUgPSBuZXdtZW1iZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgZnJvbSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gcmVtb3ZlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gW29ubHlWYWx1ZV0gLSByZW1vdmUgdGhlIHByb3BlcnR5IG9ubHkgaWYgdGhlIHZhbHVlIGlzIGZvdW5kXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRocGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgLSBkZWZhdWx0PXRoaXMudmFyaWFibGVuYW1lXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlUHJvcGVydHlJbkNvZGUocHJvcGVydHk6IHN0cmluZywgb25seVZhbHVlID0gdW5kZWZpbmVkLCB2YXJpYWJsZW5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCk6IHRzLk5vZGUge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdLmNvbmZpZyAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnR5ID09PSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICB2YXIgb2xkcGFyZW50OiBhbnkgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZU5vZGUgPSBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVOb2RlLmdldFRleHQoKSA9PT0gb25seVZhbHVlIHx8IHZhbHVlTm9kZS5nZXRUZXh0KCkuc3RhcnRzV2l0aChvbmx5VmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMuc3BsaWNlKHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUob2xkcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlTm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHByb3A6IEVudHJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAob25seVZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVt4XS52YWx1ZSA9PT0gb25seVZhbHVlfHx0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF0udmFsdWUuc3RhcnRzV2l0aChvbmx5VmFsdWUrXCIuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1bMF07XHJcbiAgICAgICAgICAgIGlmIChwcm9wID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKHByb3Aubm9kZSk7XHJcbiAgICAgICAgICAgIGlmKHByb3Aubm9kZVtcImV4cHJlc3Npb25cIl0/LmFyZ3VtZW50cz8ubGVuZ3RoPjApe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3Aubm9kZVtcImV4cHJlc3Npb25cIl0/LmFyZ3VtZW50c1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcC5ub2RlO1xyXG4gICAgICAgICAgICAvKnZhciBvbGR2YWx1ZSA9IHRoaXMubGluZXNbcHJvcC5saW5lc3RhcnQgLSAxXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHByb3AubGluZXN0YXJ0O3ggPD0gcHJvcC5saW5lZW5kO3grKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lc1t4IC0gMV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IDEgJiYgdGhpcy5saW5lc1t4IC0gMl0uZW5kc1dpdGgoXCIsXCIpKS8vdHlwZSBNZT17IGJ0Mj86QnV0dG9uLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZXNbeCAtIDJdID0gdGhpcy5saW5lc1t4IC0gMl0uc3Vic3RyaW5nKDAsIHRoaXMubGluZXNbeCAtIDJdLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAvL3ZhciB0ZXh0ID0gdGhpcy5wYXJzZXIubGluZXNUb1N0cmluZygpO1xyXG4gICAgICAgICAgICAvL3RoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRleHQ7XHJcbiAgICAgICAgICAgIC8vdGhpcy51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxyXG4gICAgICovXHJcbiAgICByZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbdmFybmFtZV07XHJcbiAgICAgICAgdmFyIGFsbHByb3BzOiBFbnRyeVtdID0gW107XHJcbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgYWxscHJvcHMucHVzaCh0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0pO1xyXG4gICAgICAgIC8vcmVtb3ZlIHByb3BlcnRpZXNcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgIHByb3BzLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGFsbHByb3BzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGF0YS5tZVt2YXJuYW1lLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHByb3BzPy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxwcm9wcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUoYWxscHJvcHNbeF0ubm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcmVtb3ZlIGxpbmVzIHdoZXJlIHVzZWQgYXMgcGFyYW1ldGVyXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGtleSBpbiB0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbcHJvcGtleV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBwcm9wc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gcC52YWx1ZS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tpXSA9PT0gdmFybmFtZSB8fCBwYXJhbXNbaV0gPT09IFwidGhpcy5cIiArIHZhcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vaW4gY2hpbGRyZW46W11cclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5jb25maWcgPSBwcm9wW2tleV1bMF0/Lm5vZGU/LmluaXRpYWxpemVyPy5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5jb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBpbmNvbmZpZy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluY29uZmlnW3hdLmdldFRleHQoKSA9PT0gdmFybmFtZSB8fCBpbmNvbmZpZ1t4XS5nZXRUZXh0KCkuc3RhcnRzV2l0aCh2YXJuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShpbmNvbmZpZ1t4XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNvbmZpZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwcm9wW2tleV1bMF0/Lm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLCB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpOiB0cy5Ob2RlIHtcclxuICAgICAgICB2YXIgc2NvcGU7XHJcbiAgICAgICAgaWYgKHZhcmlhYmxlc2NvcGUpIHtcclxuICAgICAgICAgICAgc2NvcGUgPSB0aGlzLmRhdGFbdmFyaWFibGVzY29wZS52YXJpYWJsZW5hbWVdW3ZhcmlhYmxlc2NvcGUubWV0aG9kbmFtZV1bMF0/Lm5vZGU7XHJcbiAgICAgICAgICAgIGlmKHNjb3BlLmV4cHJlc3Npb24pXHJcbiAgICAgICAgICAgICAgICBzY29wZSA9IHNjb3BlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzY29wZT1zY29wZS5pbml0aWFsaXplcjtcclxuICAgICAgICAgICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzc2NvcGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzYyA9IGNsYXNzc2NvcGVbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2MuY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLmNsYXNzZXNbc2MuY2xhc3NuYW1lXT8ubWVtYmVyc1tzYy5tZXRob2RuYW1lXT8ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsvL2V4cG9ydGVkIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLmZ1bmN0aW9uc1tzYy5tZXRob2RuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5leHQgdmFyaWFibGVuYW1lXHJcbiAgICAgKiAqL1xyXG4gICAgZ2V0TmV4dFZhcmlhYmxlTmFtZUZvclR5cGUodHlwZTogc3RyaW5nLHN1Z2dlc3RlZE5hbWU6c3RyaW5nPXVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gc3VnZ2VzdGVkTmFtZTtcclxuICAgICAgICBpZih2YXJuYW1lPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB2YXJuYW1lPXR5cGUuc3BsaXQoXCIuXCIpW3R5cGUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgZm9yICh2YXIgY291bnRlciA9IDE7IGNvdW50ZXIgPCAxMDAwOyBjb3VudGVyKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5tZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZGF0YS5tZVt2YXJuYW1lICsgKGNvdW50ZXI9PT0xP1wiXCI6Y291bnRlcildID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhcm5hbWUgKyAoY291bnRlcj09PTE/XCJcIjpjb3VudGVyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY2hhbmdlIG9iamVjdGxpdGVyYWwgdG8gbXV0bGlsaW5lIGlmIG5lZWRlZFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHN3aXRjaFRvTXV0bGlsaW5lSWZOZWVkZWQobm9kZTogdHMuTm9kZSwgbmV3UHJvcGVydHk6IHN0cmluZywgbmV3VmFsdWUpIHtcclxuICAgICAgICB2YXIgb2xkVmFsdWUgPSBub2RlLmdldFRleHQoKTtcclxuICAgICAgICBpZiAobm9kZVtcIm11bHRpTGluZVwiXSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB2YXIgbGVuID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXNbeF07XHJcbiAgICAgICAgICAgICAgICBsZW4gKz0gKHByb3AuaW5pdGlhbGl6ZXIuZXNjYXBlZFRleHQgPyBwcm9wLmluaXRpYWxpemVyLmVzY2FwZWRUZXh0Lmxlbmd0aCA6IHByb3AuaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBsZW4gKz0gcHJvcC5uYW1lLmVzY2FwZWRUZXh0Lmxlbmd0aCArIDU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cobGVuKTtcclxuICAgICAgICAgICAgaWYgKG9sZFZhbHVlLmluZGV4T2YoXCJcXG5cIikgPiAtMSB8fCAobGVuID4gNjApIHx8IG5ld1ZhbHVlLmluZGV4T2YoXCJcXG5cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy9vcmRlciBhbHNvIG9sZCBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3AucG9zID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5sZW4gPSAtMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdID0gdHMuY3JlYXRlT2JqZWN0TGl0ZXJhbChub2RlLnBhcmVudFtcImFyZ3VtZW50c1wiXVswXS5wcm9wZXJ0aWVzLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgc2V0UHJvcGVydHlJbkNvbmZpZyh2YXJpYWJsZU5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHRzLk5vZGUsXHJcbiAgICAgICAgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGZhbHNlLCByZXBsYWNlOiBib29sZWFuID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcclxuICAgICAgICBzY29wZTogdHMuTm9kZSkge1xyXG5cclxuICAgICAgICB2YXIgc3ZhbHVlOiBhbnkgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB0cy5jcmVhdGVJZGVudGlmaWVyKHZhbHVlKSA6IHZhbHVlO1xyXG4gICAgICAgIHZhciBjb25maWcgPSA8YW55PnRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY29uZmlnXCJdWzBdLm5vZGU7XHJcbiAgICAgICAgY29uZmlnID0gY29uZmlnLmFyZ3VtZW50c1swXTtcclxuICAgICAgICB2YXIgbmV3RXhwcmVzc2lvbiA9IHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSwgPGFueT5zdmFsdWUpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJhZGRcIiAmJiByZXBsYWNlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBwcm9wZXJ0eSA9IFwiY2hpbGRyZW5cIjtcclxuICAgICAgICAgICAgc3ZhbHVlID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSArIFwiLmNvbmZpZyh7fSlcIikgOiB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY2hpbGRyZW5cIl0gPT0gdW5kZWZpbmVkKSB7Ly9cclxuICAgICAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVQcm9wZXJ0eUFzc2lnbm1lbnQocHJvcGVydHksIHRzLmNyZWF0ZUFycmF5TGl0ZXJhbChbc3ZhbHVlXSwgdHJ1ZSkpO1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnByb3BlcnRpZXMucHVzaChuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY2hpbGRyZW5cIl1bMF0ubm9kZS5pbml0aWFsaXplci5lbGVtZW50cy5wdXNoKHN2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY2hpbGRyZW5cIl1bMF0ubm9kZS5pbml0aWFsaXplci5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFycmF5Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcnJheVt4XS5nZXRUZXh0KCkgPT09IGJlZm9yZS52YWx1ZSB8fCBhcnJheVt4XS5nZXRUZXh0KCkuc3RhcnRzV2l0aChiZWZvcmUudmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnNwbGljZSh4LCAwLCBzdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vZGUgXCIgKyBiZWZvcmUudmFsdWUgKyBcIiBub3QgZm91bmQuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7ICAvL2NvbXAuYWRkKGEpIC0tPiBjb21wLmNvbmZpZyh7Y2hpbGRyZW46W2FdfSlcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2UgIT09IGZhbHNlICYmIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHsvL2VkaXQgZXhpc3RpbmdcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldWzBdLm5vZGU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gY29uZmlnLnByb3BlcnRpZXMuaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcm9wZXJ0aWVzW3Bvc10gPSBuZXdFeHByZXNzaW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zd2l0Y2hUb011dGxpbGluZUlmTmVlZGVkKGNvbmZpZywgcHJvcGVydHksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZy5wcm9wZXJ0aWVzLnB1c2gobmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTXV0bGlsaW5lSWZOZWVkZWQoY29uZmlnLCBwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY29ycmVjdCBzcGFjZXNcIik7XHJcbiAgICAgICAgdGhpcy5wYXJzZSh0aGlzLmdldE1vZGlmaWVkQ29kZSgpKTtcclxuICAgICAgICAvL2lmIChwb3MgPj0gMClcclxuICAgICAgICAvLyAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG5cclxuICAgIH1cclxuICAgIC8qICBtb3ZlUHJvcGVydFZhbHVlSW5Db2RlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBuZXdWYXJpYWJsZU5hbWU6IHN0cmluZywgYmVmb3JlVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY29uZmlnXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiYWRkXCIpXHJcbiAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICAgIHZhciBvbGRwYXJlbnQ6YW55PXRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZU5vZGU9b2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzW3hdO1xyXG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWVOb2RlLmdldFRleHQoKSA9PT0gdmFsdWUgfHx2YWx1ZU5vZGUuZ2V0VGV4dCgpLnN0YXJ0c1dpdGgodmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50cy5zcGxpY2UoeCwxKTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgfSovXHJcbiAgICAvKipcclxuICAgICogbW9kaWZ5IHRoZSBwcm9wZXJ0eSBpbiBjb2RlXHJcbiAgICAqIEBwYXJhbSB2YXJpYWJsZW5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICogQHBhcmFtICBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSBcclxuICAgICogQHBhcmFtIHZhbHVlIC0gdGhlIG5ldyB2YWx1ZVxyXG4gICAgKiBAcGFyYW0gY2xhc3NzY29wZSAgLSB0aGUgcHJvcGVydHkgd291bGQgYmUgaW5zZXJ0IGluIHRoaXMgYmxvY2tcclxuICAgICogQHBhcmFtIGlzRnVuY3Rpb24gIC0gdHJ1ZSBpZiB0aGUgcHJvcGVydHkgaXMgYSBmdW5jdGlvblxyXG4gICAgKiBAcGFyYW0gW3JlcGxhY2VdICAtIGlmIHRydWUgdGhlIG9sZCB2YWx1ZSBpcyBkZWxldGVkXHJcbiAgICAqIEBwYXJhbSBbYmVmb3JlXSAtIHRoZSBuZXcgcHJvcGVydHkgaXMgcGxhY2VkIGJlZm9yZSB0aGlzIHByb3BlcnR5XHJcbiAgICAqIEBwYXJhbSBbdmFyaWFibGVzY29wZV0gLSBpZiB0aGlzIHNjb3BlIGlzIGRlZmluZWQgLSB0aGUgbmV3IHByb3BlcnR5IHdvdWxkIGJlIGluc2VydCBpbiB0aGlzIHZhcmlhYmxlXHJcbiAgICAqL1xyXG4gICAgc2V0UHJvcGVydHlJbkNvZGUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCB0cy5Ob2RlLFxyXG4gICAgICAgIGNsYXNzc2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10sXHJcbiAgICAgICAgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGZhbHNlLCByZXBsYWNlOiBib29sZWFuID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcclxuICAgICAgICB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVOYW1lXT09PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV09e307XHJcbiAgICAgICAgaWYgKGNsYXNzc2NvcGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgY2xhc3NzY29wZSA9IHRoaXMuY2xhc3NTY29wZTtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldE5vZGVGcm9tU2NvcGUoY2xhc3NzY29wZSwgdmFyaWFibGVzY29wZSk7XHJcbiAgICAgICAgdmFyIG5ld0V4cHJlc3Npb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiY29uZmlnXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUluQ29uZmlnKHZhcmlhYmxlTmFtZSwgcHJvcGVydHksIHZhbHVlLCBpc0Z1bmN0aW9uLCByZXBsYWNlLCBiZWZvcmUsIHNjb3BlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3VmFsdWU6IGFueSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgICAgdmFyIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gc2NvcGVbXCJib2R5XCJdLnN0YXRlbWVudHNcclxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIpIHsgLy9tZS5wYW5lbDE9bmV3IFBhbmVsKHt9KTtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcIl9uZXdfXCJdWzBdOy8vLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wLnZhbHVlO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgIHJlcGxhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IHByb3Aubm9kZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGxlZnQgPSBsZWZ0LnN1YnN0cmluZygwLCBsZWZ0LmluZGV4T2YoXCI9XCIpIC0gMSk7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJfbmV3X1wiO1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIobGVmdCksIG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgICAgIC8qXHR9ZWxzZXsvL3ZhciBoaD1uZXcgUGFuZWwoe30pXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uc3RyID0gcHJvcFswXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGdW5jdGlvbj10cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0V4cHJlc3Npb249dHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIoXCJtZS5cIitwcm9wZXJ0eSksIHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpKSk7XHRcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVDYWxsKHRzLmNyZWF0ZUlkZW50aWZpZXIodmFyaWFibGVOYW1lICsgXCIuXCIgKyBwcm9wZXJ0eSksIHVuZGVmaW5lZCwgW25ld1ZhbHVlXSkpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIodmFyaWFibGVOYW1lICsgXCIuXCIgKyBwcm9wZXJ0eSksIG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgaWYgKHJlcGxhY2UgIT09IGZhbHNlICYmIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHsvL2VkaXQgZXhpc3RpbmdcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl1bcG9zXSA9IG5ld0V4cHJlc3Npb247XHJcbiAgICAgICAgICAgIC8vaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAvLyAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7Ly9pbnNlcnQgbmV3XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUudmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIm5vdCBpbXBsZW1lbnRlZFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvID0gMDsgbyA8IHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldLmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldW29dLnZhbHVlID09PSBiZWZvcmUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldW29dLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlByb3BlcnR5IG5vdCBmb3VuZCBcIiArIGJlZm9yZS52YXJpYWJsZW5hbWUgKyBcIi5cIiArIGJlZm9yZS5wcm9wZXJ0eSArIFwiIHZhbHVlIFwiICsgYmVmb3JlLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMCwgbmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdHByb3A6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiX25ld19cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3Nob3VsZCBiZSBpbiB0aGUgc2FtZSBzY29wZSBvZiBkZWNsYXJhdGlvbiAoaW1wb3J0YW50IGZvciByZXBlYXRlcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50cyA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BdWzBdLm5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0bm9kZTogdHMuTm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BdW3RoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BdLmxlbmd0aCAtIDFdLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRlc3Rub2RlLnBhcmVudCA9PT0gc2NvcGVbXCJib2R5XCJdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0cHJvcCA9IHRlc3Rub2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3Rwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihsYXN0cHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0cHJvcC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MgKyAxLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHN0YXRlbWVudHMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+IDAgJiYgc3RhdGVtZW50c1tzdGF0ZW1lbnRzLmxlbmd0aCAtIDFdLmdldFRleHQoKS5zdGFydHNXaXRoKFwicmV0dXJuIFwiKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH1jYXRjaHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHMuc3BsaWNlKHBvcywgMCwgbmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHN3YXBzIHR3byBzdGF0ZW1lbnRzIGluZGVuZGlmaWVkIGJ5ICBmdW5jdGlvbnBhcmFtZXRlciBpbiBhIHZhcmlhYmxlLnByb3BlcnR5KHBhcmFtZXRlcjEpIHdpdGggdmFyaWFibGUucHJvcGVydHkocGFyYW1ldGVyMilcclxuICAgICAqKi9cclxuICAgIHN3YXBQcm9wZXJ0eVdpdGhQYXJhbWV0ZXIodmFyaWFibGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgcGFyYW1ldGVyMTogc3RyaW5nLCBwYXJhbWV0ZXIyOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgZmlyc3Q6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHNlY29uZDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV07XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJlbnQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFt4XS52YWx1ZS5zcGxpdChcIixcIilbMF0udHJpbSgpID09PSBwYXJhbWV0ZXIxKVxyXG4gICAgICAgICAgICAgICAgZmlyc3QgPSBwYXJlbnRbeF0ubm9kZTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFt4XS52YWx1ZS5zcGxpdChcIixcIilbMF0udHJpbSgpID09PSBwYXJhbWV0ZXIyKVxyXG4gICAgICAgICAgICAgICAgc2Vjb25kID0gcGFyZW50W3hdLm5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmlyc3QpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiUGFyYW1ldGVyIG5vdCBmb3VuZCBcIiArIHBhcmFtZXRlcjEpO1xyXG4gICAgICAgIGlmICghc2Vjb25kKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlBhcmFtZXRlciBub3QgZm91bmQgXCIgKyBwYXJhbWV0ZXIyKTtcclxuICAgICAgICB2YXIgaWZpcnN0ID0gZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGZpcnN0KTtcclxuICAgICAgICB2YXIgaXNlY29uZCA9IHNlY29uZC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yoc2Vjb25kKTtcclxuICAgICAgICBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdW2lmaXJzdF0gPSBzZWNvbmQ7XHJcbiAgICAgICAgZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXVtpc2Vjb25kXSA9IGZpcnN0O1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogYWRkcyBhbiBQcm9wZXJ0eVxyXG4gICAgKiBAcGFyYW0gdHlwZSAtIG5hbWUgb2YgdGhlIHR5cGUgbyBjcmVhdGVcclxuICAgICogQHBhcmFtIGNsYXNzc2NvcGUgLSB0aGUgc2NvcGUgKG1ldGhvZG5hbWUpIHdoZXJlIHRoZSB2YXJpYWJsZSBzaG91bGQgYmUgaW5zZXJ0IENsYXNzLmxheW91dFxyXG4gICAgKiBAcGFyYW0gdmFyaWFibGVzY29wZSAtIHRoZSBzY29wZSB3aGVyZSB0aGUgdmFyaWFibGUgc2hvdWxkIGJlIGluc2VydCBlLmcuIGhhbGxvLm9uY2xpY2tcclxuICAgICogQHJldHVybnMgIHRoZSBuYW1lIG9mIHRoZSBvYmplY3RcclxuICAgICovXHJcbiAgICBhZGRWYXJpYWJsZUluQ29kZShmdWxsdHlwZTogc3RyaW5nLCBjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLCB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQsc3VnZ2VzdGVkTmFtZT11bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChjbGFzc3Njb3BlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGNsYXNzc2NvcGUgPSB0aGlzLmNsYXNzU2NvcGU7XHJcbiAgICAgICAgbGV0IHR5cGUgPSBmdWxsdHlwZS5zcGxpdChcIi5cIilbZnVsbHR5cGUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5nZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlLHN1Z2dlc3RlZE5hbWUpO1xyXG4gICAgICAgIHZhciB1c2VNZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbXCJtZVwiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB1c2VNZSA9IHRydWU7XHJcbiAgICAgICAgLy92YXIgaWYoc2NvcGVuYW1lKVxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5nZXROb2RlRnJvbVNjb3BlKGNsYXNzc2NvcGUsIHZhcmlhYmxlc2NvcGUpO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmIChub2RlPy5wYXJhbWV0ZXJzPy5sZW5ndGggPiAwICYmIG5vZGUucGFyYW1ldGVyc1swXS5uYW1lLnRleHQgPT0gXCJtZVwiKSB7XHJcbiAgICAgICAgICAgIHVzZU1lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByZWZpeCA9IHVzZU1lID8gXCJtZS5cIiA6IFwidmFyIFwiO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBub2RlW1wiYm9keVwiXS5zdGF0ZW1lbnRzO1xyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gc2NvcGUgdG8gaW5zZXJ0IGEgdmFyaWFibGUgY291bGQgYmUgZm91bmRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzdGF0ZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGVtZW50c1t4XS5nZXRUZXh0KCkuaW5jbHVkZXMoXCJuZXcgXCIpICYmICFzdGF0ZW1lbnRzW3hdLmdldFRleHQoKS5pbmNsdWRlcyhcInZhciBcIikpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFzcyA9IHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihwcmVmaXggKyB2YXJuYW1lKSwgdHMuY3JlYXRlSWRlbnRpZmllcihcIm5ldyBcIiArIHR5cGUgKyBcIigpXCIpKTtcclxuICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZSh4LCAwLCB0cy5jcmVhdGVTdGF0ZW1lbnQoYXNzKSk7XHJcbiAgICAgICAgaWYgKHVzZU1lKVxyXG4gICAgICAgICAgICB0aGlzLmFkZFR5cGVNZSh2YXJuYW1lLCB0eXBlKTtcclxuICAgICAgICByZXR1cm4gKHVzZU1lID8gXCJtZS5cIiA6IFwiXCIpICsgdmFybmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICBhd2FpdCB0eXBlc2NyaXB0LndhaXRGb3JJbml0ZWQ7XHJcbiAgICB2YXIgY29kZSA9IHR5cGVzY3JpcHQuZ2V0Q29kZShcImRlL0RpYWxvZy50c1wiKTtcclxuICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgICAvLyBjb2RlID0gXCJmdW5jdGlvbiB0ZXN0KCl7IHZhciBoYWxsbz17fTt2YXIgaDI9e307dmFyIHBwcD17fTtoYWxsby5wPTk7aGFsbG8uY29uZmlnKHthOjEsYjoyLCBrOmgyLmNvbmZpZyh7YzoxLGo6cHBwLmNvbmZpZyh7cHA6OX0pfSkgICAgIH0pOyB9XCI7XHJcbiAgICAvLyBjb2RlID0gXCJmdW5jdGlvbih0ZXN0KXsgdmFyIGhhbGxvPXt9O3ZhciBoMj17fTt2YXIgcHBwPXt9O2hhbGxvLnA9OTtoYWxsby5jb25maWcoe2E6MSxiOjIsIGs6aDIuY29uZmlnKHtjOjF9LGooKXtqMi51ZG89OX0pICAgICB9KTsgfVwiO1xyXG4gICAvLyBjb2RlID0gXCJmdW5jdGlvbiB0ZXN0KCl7dmFyIHBwcDt2YXIgYWFhPW5ldyBCdXR0b24oKTtwcHAuY29uZmlnKHthOls5LDZdLCAgY2hpbGRyZW46W2xsLmNvbmZpZyh7fSksYWFhLmNvbmZpZyh7dToxLG86MixjaGlsZHJlbjpba2suY29uZmlnKHt9KV19KV19KTt9XCI7XHJcbiAgICAvL3BhcnNlci5wYXJzZShjb2RlLCB1bmRlZmluZWQpO1xyXG4gICAgcGFyc2VyLnBhcnNlKGNvZGUsW3tjbGFzc25hbWU6XCJEaWFsb2dcIixtZXRob2RuYW1lOlwibGF5b3V0XCJ9XSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgLy8gdmFyIG5vZGUgPSBwYXJzZXIucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgXCJtZS50ZXh0Ym94MVwiLCBcIm1lLnBhbmVsMVwiKTtcclxuICAvLyBwYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJ0aGlzXCIsXCJhZGRcIixub2RlLFt7Y2xhc3NuYW1lOlwiRGlhbG9nXCIsbWV0aG9kbmFtZTpcImxheW91dFwifV0sdHJ1ZSxmYWxzZSk7XHJcbiAgICAvL3ZhciBub2RlID0gcGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIFwia2tcIiwgXCJhYWFcIik7XHJcblxyXG4gICAgLy92YXIgbm9kZT1wYXJzZXIucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgXCJsbFwiLCBcInBwcFwiKTtcclxuICAgIC8vcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwiYWFhXCIsXCJhZGRcIixub2RlLFt7Y2xhc3NuYW1lOnVuZGVmaW5lZCwgbWV0aG9kbmFtZTpcInRlc3RcIn1dLHRydWUsZmFsc2UsdW5kZWZpbmVkLHVuZGVmaW5lZCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKG5vZGUuZ2V0VGV4dCgpKTtcclxuICAgIC8vICAgIHBhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcInBwcFwiLFwiYWRkXCIsXCJjY1wiLFt7Y2xhc3NuYW1lOnVuZGVmaW5lZCwgbWV0aG9kbmFtZTpcInRlc3RcIn1dLHRydWUsZmFsc2Use3ZhcmlhYmxlbmFtZTpcInBwcFwiLHByb3BlcnR5OlwiYWRkXCIsdmFsdWU6XCJsbFwifSk7XHJcbiAgICAvLyAgcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwiYWFhXCIsXCJhZGRcIixcImNjXCIsW3tjbGFzc25hbWU6dW5kZWZpbmVkLCBtZXRob2RuYW1lOlwidGVzdFwifV0sdHJ1ZSxmYWxzZSx7dmFyaWFibGVuYW1lOlwiYWFhXCIscHJvcGVydHk6XCJhZGRcIix2YWx1ZTpcImtrXCJ9KTtcclxuICAgIGNvbnNvbGUubG9nKHBhcnNlci5nZXRNb2RpZmllZENvZGUoKSk7XHJcbiAgICAvLyBkZWJ1Z2dlcjtcclxuICAgIC8qICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcih7IG5ld0xpbmU6IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkIH0pO1xyXG4gICAgICBjb25zdCByZXN1bHRGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZShcImR1bW15LnRzXCIsIFwiXCIsIHRzLlNjcmlwdFRhcmdldC5MYXRlc3QsIGZhbHNlLCB0cy5TY3JpcHRLaW5kLlRTKTtcclxuICAgICAgY29uc3QgcmVzdWx0ID0gcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHBhcnNlci5zb3VyY2VGaWxlLCByZXN1bHRGaWxlKTtcclxuICAgICAgY29uc29sZS5sb2cocmVzdWx0KTsqL1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5cclxuIl19