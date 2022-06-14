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
            else if (node.parent.kind === ts.SyntaxKind.ExpressionStatement) {
                var pos = node.parent.parent["statements"].indexOf(node.parent);
                if (pos >= 0)
                    node.parent.parent["statements"].splice(pos, 1);
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
        removeVariablesInCode(varnames) {
            var _a, _b, _c, _d;
            var allprops = [];
            //collect allNodes to delete
            for (var vv = 0; vv < varnames.length; vv++) {
                var varname = varnames[vv];
                var prop = this.data[varname];
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
            }
            //remove nodes
            for (var x = 0; x < allprops.length; x++) {
                this.removeNode(allprops[x].node);
            }
            for (var vv = 0; vv < varnames.length; vv++) {
                var varname = varnames[vv];
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
                if (!statements[x].getText().split("\n")[0].includes("new ") && !statements[x].getText().split("\n")[0].includes("var "))
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
        var code = Typescript_1.default.getCode("de/TestDialogBinder.ts");
        var parser = new Parser();
        // code = "function test(){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1,j:ppp.config({pp:9})})     }); }";
        // code = "function(test){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1},j(){j2.udo=9})     }); }";
        // code = "function test(){var ppp;var aaa=new Button();ppp.config({a:[9,6],  children:[ll.config({}),aaa.config({u:1,o:2,children:[kk.config({})]})]});}";
        //parser.parse(code, undefined);
        parser.parse(code, [{ classname: "TestDialogBinder", methodname: "layout" }]);
        debugger;
        parser.removeVariablesInCode(["me.repeater"]);
        //parser.addVariableInCode("Component", [{ classname: "Dialog", methodname: "layout" }]);
        //parser.setPropertyInCode("component", "x", "1", [{ classname: "Dialog", methodname: "layout" }]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWVBLE1BQU0sZUFBZTtRQUFyQjtZQUdJLG9CQUFlLEdBQWMsRUFBRSxDQUFDO1lBQ2hDLGNBQVMsR0FBYyxFQUFFLENBQUM7UUFFOUIsQ0FBQztLQUFBO0lBQ0QsTUFBTSxZQUFZO1FBQWxCO1lBR0ksY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFFekQsQ0FBQztLQUFBO0lBQ0QsTUFBYSxXQUFXO1FBQXhCO1lBS0ksWUFBTyxHQUFzQyxFQUFFLENBQUM7WUFDaEQsY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBUEQsa0NBT0M7SUFFRCxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFNO1FBZ0JmOzs7V0FHRztRQUNIO1lBbkJBLGVBQVUsR0FBa0IsU0FBUyxDQUFDO1lBRXRDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1lBQ3ZDLFlBQU8sR0FBb0MsRUFBRSxDQUFDO1lBQzlDLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1lBQ3pDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBQzVDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBZXhDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRCxlQUFlO1lBQ1gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdkUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENB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LG9KQUFvSjtRQUNwSixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLFlBQVk7UUFDWjs7O2dDQUd3QjtJQUk1QixDQUFDO0lBaENELG9CQWdDQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuXHJcblxyXG5pbXBvcnQgdHlwZXNjcmlwdCBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCI7XHJcblxyXG5cclxuaW50ZXJmYWNlIFByb3BlcnRpZXMge1xyXG4gICAgW2RldGFpbHM6IHN0cmluZ106IEVudHJ5O1xyXG59XHJcbmludGVyZmFjZSBFbnRyeSB7XHJcbiAgICB2YWx1ZT86IGFueTtcclxuICAgIG5vZGU/OiB0cy5Ob2RlO1xyXG4gICAgaXNGdW5jdGlvbjogYm9vbGVhbjtcclxufVxyXG5jbGFzcyBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgbm9kZT86IHRzLkRlY29yYXRvcjtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBwYXJzZWRQYXJhbWV0ZXI/OiBvYmplY3RbXSA9IFtdO1xyXG4gICAgcGFyYW1ldGVyPzogc3RyaW5nW10gPSBbXTtcclxuXHJcbn1cclxuY2xhc3MgUGFyc2VkTWVtYmVyIHtcclxuICAgIG5vZGU/OiB0cy5Ob2RlO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIGRlY29yYXRvcj86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZERlY29yYXRvciB9ID0ge307XHJcbiAgICB0eXBlPzogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBQYXJzZWRDbGFzcyB7XHJcbiAgICBwYXJlbnQ/OiBQYXJzZXI7XHJcbiAgICBub2RlPzogdHMuQ2xhc3NFbGVtZW50O1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIGZ1bGxDbGFzc25hbWU/OiBzdHJpbmc7XHJcbiAgICBtZW1iZXJzPzogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkTWVtYmVyIH0gPSB7fTtcclxuICAgIGRlY29yYXRvcj86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZERlY29yYXRvciB9ID0ge307XHJcbn1cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXCIpXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSA9IHVuZGVmaW5lZDtcclxuICAgIHR5cGVNZU5vZGU6IHRzLk5vZGU7XHJcbiAgICB0eXBlTWU6IHsgW25hbWU6IHN0cmluZ106IEVudHJ5IH0gPSB7fTtcclxuICAgIGNsYXNzZXM6IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZENsYXNzIH0gPSB7fTtcclxuICAgIGltcG9ydHM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbiAgICBmdW5jdGlvbnM6IHsgW25hbWU6IHN0cmluZ106IHRzLk5vZGUgfSA9IHt9O1xyXG4gICAgdmFyaWFibGVzOiB7IFtuYW1lOiBzdHJpbmddOiB0cy5Ob2RlIH0gPSB7fTtcclxuICAgIGNsYXNzU2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W107XHJcblxyXG4gICAgY29kZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge09iamVjdC48c3RyaW5nLE9iamVjdC48c3RyaW5nLFtvYmplY3RdPj4gLSBhbGwgcHJvcGVydGllc1xyXG4gICAgKiBlLmcuIGRhdGFbXCJ0ZXh0Ym94MVwiXVt2YWx1ZV0tPkVudHJ5XHJcbiAgICAqL1xyXG4gICAgZGF0YTogeyBbdmFyaWFibGU6IHN0cmluZ106IHsgW3Byb3BlcnR5OiBzdHJpbmddOiBFbnRyeVtdIH0gfTtcclxuICAgIC8qKlxyXG4gICAgICogcGFyc2VzIENvZGUgZm9yIFVJIHJlbGV2YW50IHNldHRpbmdzXHJcbiAgICAgKiBAY2xhc3MgamFzc2lqc19lZGl0b3IudXRpbC5QYXJzZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIC8qKiB7W3N0cmluZ119IC0gYWxsIGNvZGUgbGluZXMqL1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1vZGlmaWVkQ29kZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKHsgbmV3TGluZTogdHMuTmV3TGluZUtpbmQuTGluZUZlZWQgfSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCAvKnNldFBhcmVudE5vZGVzKi8gZmFsc2UsIHRzLlNjcmlwdEtpbmQuVFMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCB0aGlzLnNvdXJjZUZpbGUsIHJlc3VsdEZpbGUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgYSBwcm9wZXJ0eVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcmlhYmxlIC0gbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIG5hbWUgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgIC0gY29kZSAtIHRoZSB2YWx1ZVxyXG4gICAgICogQHBhcmFtIG5vZGUgLSB0aGUgbm9kZSBvZiB0aGUgc3RhdGVtZW50XHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkKHZhcmlhYmxlOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG5vZGU6IHRzLk5vZGUsIGlzRnVuY3Rpb24gPSBmYWxzZSkge1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkudHJpbSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlLFxyXG4gICAgICAgICAgICAgICAgaXNGdW5jdGlvblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlYWQgYSBwcm9wZXJ0eSB2YWx1ZSBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJpYWJsZSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSBcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAgICovXHJcbiAgICBnZXRQcm9wZXJ0eVZhbHVlKHZhcmlhYmxlLCBwcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIC8qIHZhcmlhYmxlPVwidGhpcy5cIit2YXJpYWJsZTtcclxuICAgICAgICAgaWYodGhpcy5kYXRhW3ZhcmlhYmxlXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9Ki9cclxuICAgICAgICAvL3RoaXMgXHJcbiAgICAgICAgLy8gICB2YXIgdmFsdWU9dGhpcy5wcm9wZXJ0eUVkaXRvci5wYXJzZXIuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLnZhcmlhYmxlbmFtZSx0aGlzLnByb3BlcnR5Lm5hbWUpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRUeXBlTWUobmFtZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoIXRoaXMudHlwZU1lTm9kZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciB0cCA9IHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKHR5cGUsIFtdKTtcclxuICAgICAgICB2YXIgbmV3bm9kZSA9IHRzLmNyZWF0ZVByb3BlcnR5U2lnbmF0dXJlKHVuZGVmaW5lZCwgbmFtZSArIFwiP1wiLCB1bmRlZmluZWQsIHRwLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMudHlwZU1lTm9kZVtcIm1lbWJlcnNcIl0ucHVzaChuZXdub2RlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGltcG9ydCB7bmFtZX0gZnJvbSBmaWxlXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBcclxuICAgICAqIEBwYXJhbSBmaWxlIFxyXG4gICAgICovXHJcbiAgICBhZGRJbXBvcnRJZk5lZWRlZChuYW1lOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmltcG9ydHNbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGltcCA9IHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKGZhbHNlLCB1bmRlZmluZWQsIHRzLmNyZWF0ZUlkZW50aWZpZXIobmFtZSkpXSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydE5vZGUgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgdHMuY3JlYXRlSW1wb3J0Q2xhdXNlKHVuZGVmaW5lZCwgaW1wKSwgdHMuY3JlYXRlTGl0ZXJhbChmaWxlKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc291cmNlRmlsZSA9IHRzLnVwZGF0ZVNvdXJjZUZpbGVOb2RlKHRoaXMuc291cmNlRmlsZSwgW2ltcG9ydE5vZGUsIC4uLnRoaXMuc291cmNlRmlsZS5zdGF0ZW1lbnRzXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXJzZVR5cGVNZU5vZGUobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5UeXBlTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICBpZiAobm9kZVtcIm1lbWJlcnNcIl0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGVNZU5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICBub2RlW1wibWVtYmVyc1wiXS5mb3JFYWNoKGZ1bmN0aW9uICh0bm9kZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodG5vZGUubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdG5vZGUubmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHlwZSA9IHRub2RlLnR5cGUudHlwZU5hbWUudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy50eXBlTWVbbmFtZV0gPSB7IG5vZGU6IHRub2RlLCB2YWx1ZTogc3R5cGUsIGlzRnVuY3Rpb246IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgIHRoaXMuYWRkKFwibWVcIiwgbmFtZSwgXCJ0eXBlZGVjbGFyYXRpb246XCIgKyBzdHlwZSwgdW5kZWZpbmVkLCBhbGluZSwgYWxpbmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB0aGlzLnBhcnNlVHlwZU1lTm9kZShjKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnZlcnRBcmd1bWVudChhcmc6IGFueSkge1xyXG4gICAgICAgIGlmIChhcmcgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLk9iamVjdExpdGVyYWxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHByb3BzID0gYXJnLnByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIGlmIChwcm9wcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0W3Byb3BzW3BdLm5hbWUudGV4dF0gPSB0aGlzLmNvbnZlcnRBcmd1bWVudChwcm9wc1twXS5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZy50ZXh0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQXJyYXlMaXRlcmFsRXhwcmVzc2lvbikge1xyXG4gICAgICAgICAgICBsZXQgcmV0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgYXJnLmVsZW1lbnRzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXQucHVzaCh0aGlzLmNvbnZlcnRBcmd1bWVudChhcmcuZWxlbWVudHNbcF0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5UcnVlS2V5d29yZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLkZhbHNlS2V5d29yZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5OdW1lcmljTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKGFyZy50ZXh0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLkFycm93RnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZy5nZXRUZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aHJvdyBcIkVycm9yIHR5cGUgbm90IGZvdW5kXCI7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlRGVjb3JhdG9yKGRlYzogdHMuRGVjb3JhdG9yKTogUGFyc2VkRGVjb3JhdG9yIHtcclxuICAgICAgICB2YXIgZXg6IGFueSA9IGRlYy5leHByZXNzaW9uO1xyXG4gICAgICAgIHZhciByZXQgPSBuZXcgUGFyc2VkRGVjb3JhdG9yKCk7XHJcbiAgICAgICAgaWYgKGV4LmV4cHJlc3Npb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXQubmFtZSA9IGV4LnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHJldC5uYW1lID0gZXguZXhwcmVzc2lvbi5lc2NhcGVkVGV4dDtcclxuICAgICAgICAgICAgaWYgKGV4LmV4cHJlc3Npb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgYSA9IDA7IGEgPCBleC5hcmd1bWVudHMubGVuZ3RoOyBhKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXQucGFyc2VkUGFyYW1ldGVyLnB1c2godGhpcy5jb252ZXJ0QXJndW1lbnQoZXguYXJndW1lbnRzW2FdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0LnBhcmFtZXRlci5wdXNoKGV4LmFyZ3VtZW50c1thXS5nZXRUZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcGFyc2VDbGFzcyhub2RlOiB0cy5DbGFzc0VsZW1lbnQpIHtcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIHBhcnNlZENsYXNzID0gbmV3IFBhcnNlZENsYXNzKCk7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLm5hbWUgPSBub2RlLm5hbWUuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICBwYXJzZWRDbGFzcy5ub2RlID0gbm9kZTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW3BhcnNlZENsYXNzLm5hbWVdID0gcGFyc2VkQ2xhc3M7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmRlY29yYXRvcnMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRlYyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBub2RlLmRlY29yYXRvcnMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VkRGVjID0gdGhpcy5wYXJzZURlY29yYXRvcihub2RlLmRlY29yYXRvcnNbeF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLmRlY29yYXRvcltwYXJzZWREZWMubmFtZV0gPSBwYXJzZWREZWM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlZENsYXNzLmRlY29yYXRvcltcIiRDbGFzc1wiXSAmJiBwYXJzZWREZWMucGFyYW1ldGVyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLmZ1bGxDbGFzc25hbWUgPSBwYXJzZWREZWMucGFyYW1ldGVyWzBdLnJlcGxhY2VBbGwoJ1wiJywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbm9kZVtcIm1lbWJlcnNcIl0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJzZWRNZW0gPSBuZXcgUGFyc2VkTWVtYmVyKClcclxuICAgICAgICAgICAgICAgIHZhciBtZW0gPSBub2RlW1wibWVtYmVyc1wiXVt4XTtcclxuICAgICAgICAgICAgICAgIGlmIChtZW0ubmFtZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOy8vQ29uc3RydWN0b3JcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5uYW1lID0gbWVtLm5hbWUuZXNjYXBlZFRleHQ7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0ubm9kZSA9IG5vZGVbXCJtZW1iZXJzXCJdW3hdO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLnR5cGUgPSAobWVtLnR5cGUgPyBtZW0udHlwZS5nZXRGdWxsVGV4dCgpLnRyaW0oKSA6IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRDbGFzcy5tZW1iZXJzW3BhcnNlZE1lbS5uYW1lXSA9IHBhcnNlZE1lbTtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChtZW0uZGVjb3JhdG9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVtLmRlY29yYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnNlZERlYyA9IHRoaXMucGFyc2VEZWNvcmF0b3IobWVtLmRlY29yYXRvcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZWRNZW0uZGVjb3JhdG9yW3BhcnNlZERlYy5uYW1lXSA9IHBhcnNlZERlYztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2xhc3NTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNsYXNzU2NvcGUubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gdGhpcy5jbGFzc1Njb3BlW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3NuYW1lID09PSBwYXJzZWRDbGFzcy5uYW1lICYmIHBhcnNlZENsYXNzLm1lbWJlcnNbY29sLm1ldGhvZG5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZCA9IHBhcnNlZENsYXNzLm1lbWJlcnNbY29sLm1ldGhvZG5hbWVdLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5kKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlQ29uZmlnKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgaWYgKG5vZGUuYXJndW1lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGxlZnQgPSBub2RlLmV4cHJlc3Npb24uZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgbGFzdHBvcyA9IGxlZnQubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgICAgICB2YXIgdmFyaWFibGUgPSBsZWZ0O1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChsYXN0cG9zICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyaWFibGUgPSBsZWZ0LnN1YnN0cmluZygwLCBsYXN0cG9zKTtcclxuICAgICAgICAgICAgICAgIHByb3AgPSBsZWZ0LnN1YnN0cmluZyhsYXN0cG9zICsgMSk7XHJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wczogYW55W10gPSBub2RlLmFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IHByb3BzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gcHJvcHNbcF0ubmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgdmFsdWUgPSB0aGlzLmNvbnZlcnRBcmd1bWVudChwcm9wc1twXS5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2RlOiBzdHJpbmcgPSBwcm9wc1twXS5pbml0aWFsaXplciA/IHByb3BzW3BdLmluaXRpYWxpemVyLmdldFRleHQoKSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlPy5pbmRleE9mKFwiLmNvbmZpZ1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlUHJvcGVydGllcyhwcm9wc1twXS5pbml0aWFsaXplcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQodmFyaWFibGUsIG5hbWUsIGNvZGUsIHByb3BzW3BdLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBwYXJzZVByb3BlcnRpZXMobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIGlmICh0cy5pc1ZhcmlhYmxlRGVjbGFyYXRpb24obm9kZSkpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBub2RlLm5hbWUuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICBpZiAobm9kZS5pbml0aWFsaXplciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBub2RlLmluaXRpYWxpemVyLmdldFRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkKG5hbWUsIFwiX25ld19cIiwgdmFsdWUsIG5vZGUucGFyZW50LnBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkgJiYgbm9kZS5vcGVyYXRvclRva2VuLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRXF1YWxzVG9rZW4pIHx8XHJcbiAgICAgICAgICAgIHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHtcclxuICAgICAgICAgICAgdmFyIG5vZGUxO1xyXG4gICAgICAgICAgICB2YXIgbm9kZTI7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0OiBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZTogc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgaXNGdW5jdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodHMuaXNCaW5hcnlFeHByZXNzaW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlMSA9IG5vZGUubGVmdDtcclxuICAgICAgICAgICAgICAgIG5vZGUyID0gbm9kZS5yaWdodDtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBub2RlMS5nZXRUZXh0KCk7Ly8gdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMS5wb3MsIG5vZGUxLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBub2RlMi5nZXRUZXh0KCk7Ly90aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUyLnBvcywgbm9kZTIuZW5kKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUuc3RhcnRzV2l0aChcIm5ldyBcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGQobGVmdCwgXCJfbmV3X1wiLCB2YWx1ZSwgbm9kZS5wYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgICAgICBub2RlMSA9IG5vZGUuZXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgICAgIG5vZGUyID0gbm9kZS5hcmd1bWVudHM7XHJcbiAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBub2RlMS5nZXRUZXh0KCk7Ly8gdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMS5wb3MsIG5vZGUxLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hcmd1bWVudHMuZm9yRWFjaCgoYXJnKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKGFyZy5nZXRUZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgoPGFueT5hcmcpPy5leHByZXNzaW9uPy5uYW1lPy5nZXRUZXh0KCkgPT09IFwiY29uZmlnXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMucGFyc2VDb25maWcoPGFueT5hcmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2FyZy5nZXRUZXh0KCkuaW5kZXhPZihcIi5jb25maWcoXCIpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChsZWZ0LmVuZHNXaXRoKFwiLmNvbmZpZ1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0cG9zID0gbGVmdC5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3Rwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSBsZWZ0LnN1YnN0cmluZyhsYXN0cG9zICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyYW1zLmpvaW4oXCIsIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCh2YXJpYWJsZSwgcHJvcCwgdmFsdWUsIG5vZGUsIGlzRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VDb25maWcobm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQuZW5kc1dpdGgoXCIuY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobm9kZS5hcmd1bWVudHNbMF1bXCJib2R5XCJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyYW1zLmpvaW4oXCIsIFwiKTsvL3RoaXMuY29kZS5zdWJzdHJpbmcobm9kZTIucG9zLCBub2RlMi5lbmQpLnRyaW0oKTsvL1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgbGFzdHBvcyA9IGxlZnQubGFzdEluZGV4T2YoXCIuXCIpO1xyXG4gICAgICAgICAgICB2YXIgdmFyaWFibGUgPSBsZWZ0O1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChsYXN0cG9zICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdmFyaWFibGUgPSBsZWZ0LnN1YnN0cmluZygwLCBsYXN0cG9zKTtcclxuICAgICAgICAgICAgICAgIHByb3AgPSBsZWZ0LnN1YnN0cmluZyhsYXN0cG9zICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGQodmFyaWFibGUsIHByb3AsIHZhbHVlLCBub2RlLnBhcmVudCwgaXNGdW5jdGlvbik7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy5wYXJzZVByb3BlcnRpZXMoYykpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5WYXJpYWJsZURlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFyaWFibGVzW25vZGVbXCJuYW1lXCJdLnRleHRdID0gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnREZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgbmQ6IGFueSA9IG5vZGU7XHJcbiAgICAgICAgICAgIHZhciBmaWxlID0gbmQubW9kdWxlU3BlY2lmaWVyLnRleHQ7XHJcbiAgICAgICAgICAgIGlmIChuZC5pbXBvcnRDbGF1c2UgJiYgbmQuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lcyA9IG5kLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzLmVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZSA9IDA7IGUgPCBuYW1lcy5sZW5ndGg7IGUrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1wb3J0c1tuYW1lc1tlXS5uYW1lLmVzY2FwZWRUZXh0XSA9IGZpbGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PSB0cy5TeW50YXhLaW5kLlR5cGVBbGlhc0RlY2xhcmF0aW9uICYmIG5vZGVbXCJuYW1lXCJdLnRleHQgPT09IFwiTWVcIikge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlVHlwZU1lTm9kZShub2RlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5DbGFzc0RlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VDbGFzcyg8dHMuQ2xhc3NFbGVtZW50Pm5vZGUpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24pIHsvL2Z1bmN0aW9ucyBvdXQgb2YgY2xhc3NcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbnNbbm9kZVtcIm5hbWVcIl0udGV4dF0gPSBub2RlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc1Njb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2xhc3NTY29wZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmNsYXNzU2NvcGVbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzc25hbWUgPT09IHVuZGVmaW5lZCAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBjb2wubWV0aG9kbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobm9kZSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy52aXNpdE5vZGUoYykpO1xyXG4gICAgICAgIC8vVE9ETyByZW1vdmUgdGhpcyBibG9ja1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbiAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBcInRlc3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLmFkZChub2RlW1wibmFtZVwiXS50ZXh0LCBcIlwiLCBcIlwiLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNlYXJjaENsYXNzbm9kZShub2RlOiB0cy5Ob2RlLCBwb3M6IG51bWJlcik6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9IHtcclxuICAgICAgICBpZiAodHMuaXNNZXRob2REZWNsYXJhdGlvbihub2RlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NuYW1lOiBub2RlLnBhcmVudFtcIm5hbWVcIl1bXCJ0ZXh0XCJdLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kbmFtZTogbm9kZS5uYW1lW1widGV4dFwiXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uKSB7Ly9mdW5jdGlvbnMgb3V0IG9mIGNsYXNzXHJcbiAgICAgICAgICAgIHZhciBmdW5jbmFtZSA9IG5vZGVbXCJuYW1lXCJdLnRleHRcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kbmFtZTogZnVuY25hbWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2hpbGRzID0gbm9kZS5nZXRDaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gY2hpbGRzW3hdO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IGMucG9zICYmIHBvcyA8PSBjLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLnNlYXJjaENsYXNzbm9kZShjLCBwb3MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBnZXRDbGFzc1Njb3BlRnJvbVBvc2l0aW9uKGNvZGU6IHN0cmluZywgcG9zOiBudW1iZXIpOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZSgnZHVtbXkudHMnLCBjb2RlLCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoQ2xhc3Nub2RlKHRoaXMuc291cmNlRmlsZSwgcG9zKTtcclxuICAgICAgICAvL3JldHVybiB0aGlzLnBhcnNlb2xkKGNvZGUsb25seWZ1bmN0aW9uKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogcGFyc2UgdGhlIGNvZGUgXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIC0gdGhlIGNvZGVcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IG9ubHlmdW5jdGlvbiAtIG9ubHkgdGhlIGNvZGUgaW4gdGhlIGZ1bmN0aW9uIGlzIHBhcnNlZCwgZS5nLiBcImxheW91dCgpXCJcclxuICAgICovXHJcbiAgICBwYXJzZShjb2RlOiBzdHJpbmcsIGNsYXNzU2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcclxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgIGlmIChjbGFzc1Njb3BlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NTY29wZSA9IGNsYXNzU2NvcGU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBjbGFzc1Njb3BlID0gdGhpcy5jbGFzc1Njb3BlO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKCdkdW1teS50cycsIGNvZGUsIHRzLlNjcmlwdFRhcmdldC5FUzUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudmlzaXROb2RlKHRoaXMuc291cmNlRmlsZSk7XHJcblxyXG4gICAgICAgIC8vcmV0dXJuIHRoaXMucGFyc2VvbGQoY29kZSxvbmx5ZnVuY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZW1vdmVOb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnQucGFyZW50W1widHlwZVwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdW1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdW1wibWVtYmVyc1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50W1wibWVtYmVyc1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnRbXCJwcm9wZXJ0aWVzXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wicHJvcGVydGllc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInByb3BlcnRpZXNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudFtcImVsZW1lbnRzXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wiZWxlbWVudHNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJlbGVtZW50c1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICAgfWVsc2UgaWYobm9kZS5wYXJlbnQua2luZD09PXRzLlN5bnRheEtpbmQuRXhwcmVzc2lvblN0YXRlbWVudCl7XHJcbiAgICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50LnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihub2RlLnBhcmVudCk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50LnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKG5vZGUuZ2V0RnVsbFRleHQoKSArIFwiY291bGQgbm90IGJlIHJlbW92ZWRcIik7XHJcbiAgICB9XHJcbiAgICAvKiogXHJcbiAgICAgKiBtb2RpZnkgYSBtZW1iZXIgXHJcbiAgICAgKiovXHJcbiAgICBhZGRPck1vZGlmeU1lbWJlcihtZW1iZXI6IFBhcnNlZE1lbWJlciwgcGNsYXNzOiBQYXJzZWRDbGFzcykge1xyXG4gICAgICAgIC8vbWVtYmVyLm5vZGVcclxuICAgICAgICAvL3ZhciBuZXdtZW1iZXI9dHMuY3JlYXRlUHJvcGVydHlcclxuICAgICAgICB2YXIgbmV3ZGVjOiB0cy5EZWNvcmF0b3JbXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbWVtYmVyLmRlY29yYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgZGVjID0gbWVtYmVyLmRlY29yYXRvcltrZXldO1xyXG4gICAgICAgICAgICBpZiAoIW5ld2RlYylcclxuICAgICAgICAgICAgICAgIG5ld2RlYyA9IFtdO1xyXG4gICAgICAgICAgICAvL3RzLmNyZWF0ZURlY29yYXRvcigpXHJcbiAgICAgICAgICAgIC8vbWVtYmVyLmRlY29yYXRvcltrZXldLm5hbWU7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChkZWMucGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVjLnBhcmFtZXRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRzLmNyZWF0ZUlkZW50aWZpZXIoZGVjLnBhcmFtZXRlcltpXSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjYWxsID0gdHMuY3JlYXRlQ2FsbCh0cy5jcmVhdGVJZGVudGlmaWVyKGRlYy5uYW1lKSwgdW5kZWZpbmVkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBuZXdkZWMucHVzaCh0cy5jcmVhdGVEZWNvcmF0b3IoY2FsbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3ZhciB0eXBlPXRzLmNyZWF0ZVR5XHJcbiAgICAgICAgdmFyIG5ld21lbWJlciA9IHRzLmNyZWF0ZVByb3BlcnR5KG5ld2RlYywgdW5kZWZpbmVkLCBtZW1iZXIubmFtZSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZShtZW1iZXIudHlwZSwgW10pLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHZhciBub2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwY2xhc3MubWVtYmVycykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBtZW1iZXIubmFtZSlcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBwY2xhc3MubWVtYmVyc1trZXldLm5vZGVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl0ucHVzaChuZXdtZW1iZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXVtwb3NdID0gbmV3bWVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwY2xhc3MubWVtYmVyc1ttZW1iZXIubmFtZV0gPSBtZW1iZXI7XHJcbiAgICAgICAgbWVtYmVyLm5vZGUgPSBuZXdtZW1iZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgZnJvbSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gcmVtb3ZlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gW29ubHlWYWx1ZV0gLSByZW1vdmUgdGhlIHByb3BlcnR5IG9ubHkgaWYgdGhlIHZhbHVlIGlzIGZvdW5kXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRocGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgLSBkZWZhdWx0PXRoaXMudmFyaWFibGVuYW1lXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlUHJvcGVydHlJbkNvZGUocHJvcGVydHk6IHN0cmluZywgb25seVZhbHVlID0gdW5kZWZpbmVkLCB2YXJpYWJsZW5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCk6IHRzLk5vZGUge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdLmNvbmZpZyAhPT0gdW5kZWZpbmVkICYmIHByb3BlcnR5ID09PSBcImFkZFwiKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICB2YXIgb2xkcGFyZW50OiBhbnkgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZU5vZGUgPSBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVOb2RlLmdldFRleHQoKSA9PT0gb25seVZhbHVlIHx8IHZhbHVlTm9kZS5nZXRUZXh0KCkuc3RhcnRzV2l0aChvbmx5VmFsdWUgKyBcIi5cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMuc3BsaWNlKHgsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUob2xkcGFyZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlTm9kZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHByb3A6IEVudHJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAob25seVZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVt4XS52YWx1ZSA9PT0gb25seVZhbHVlIHx8IHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVt4XS52YWx1ZS5zdGFydHNXaXRoKG9ubHlWYWx1ZSArIFwiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBwcm9wID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldWzBdO1xyXG4gICAgICAgICAgICBpZiAocHJvcCA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwcm9wLm5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocHJvcC5ub2RlW1wiZXhwcmVzc2lvblwiXT8uYXJndW1lbnRzPy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcC5ub2RlW1wiZXhwcmVzc2lvblwiXT8uYXJndW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wLm5vZGU7XHJcbiAgICAgICAgICAgIC8qdmFyIG9sZHZhbHVlID0gdGhpcy5saW5lc1twcm9wLmxpbmVzdGFydCAtIDFdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gcHJvcC5saW5lc3RhcnQ7eCA8PSBwcm9wLmxpbmVlbmQ7eCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW3ggLSAxXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGlmICh4ID4gMSAmJiB0aGlzLmxpbmVzW3ggLSAyXS5lbmRzV2l0aChcIixcIikpLy90eXBlIE1lPXsgYnQyPzpCdXR0b24sXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lc1t4IC0gMl0gPSB0aGlzLmxpbmVzW3ggLSAyXS5zdWJzdHJpbmcoMCwgdGhpcy5saW5lc1t4IC0gMl0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIC8vdmFyIHRleHQgPSB0aGlzLnBhcnNlci5saW5lc1RvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gdGV4dDtcclxuICAgICAgICAgICAgLy90aGlzLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlbW92ZXMgdGhlIHZhcmlhYmxlIGZyb20gY29kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcm5hbWUgLSB0aGUgdmFyaWFibGUgdG8gcmVtb3ZlXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVZhcmlhYmxlc0luQ29kZSh2YXJuYW1lczogc3RyaW5nW10pIHtcclxuICAgICAgICB2YXIgYWxscHJvcHM6IEVudHJ5W10gPSBbXTtcclxuICAgICAgICAvL2NvbGxlY3QgYWxsTm9kZXMgdG8gZGVsZXRlXHJcbiAgICAgICAgZm9yICh2YXIgdnYgPSAwOyB2diA8IHZhcm5hbWVzLmxlbmd0aDsgdnYrKykge1xyXG4gICAgICAgICAgICB2YXIgdmFybmFtZSA9IHZhcm5hbWVzW3Z2XTtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbdmFybmFtZV07XHJcblxyXG4gICAgICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpICYmIHRoaXMudHlwZU1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgYWxscHJvcHMucHVzaCh0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0pO1xyXG4gICAgICAgICAgICAvL3JlbW92ZSBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgICAgICBwcm9wcy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxscHJvcHMucHVzaChwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGF0YS5tZVt2YXJuYW1lLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgICAgICBwcm9wcz8uZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsbHByb3BzLnB1c2gocCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL3JlbW92ZSBub2Rlc1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxscHJvcHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKGFsbHByb3BzW3hdLm5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB2diA9IDA7IHZ2IDwgdmFybmFtZXMubGVuZ3RoOyB2disrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YXJuYW1lID0gdmFybmFtZXNbdnZdO1xyXG5cclxuICAgICAgICAgICAgLy9yZW1vdmUgbGluZXMgd2hlcmUgdXNlZCBhcyBwYXJhbWV0ZXJcclxuICAgICAgICAgICAgZm9yICh2YXIgcHJvcGtleSBpbiB0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0gdGhpcy5kYXRhW3Byb3BrZXldO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwcm9wcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IHByb3BzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gcC52YWx1ZS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zW2ldID09PSB2YXJuYW1lIHx8IHBhcmFtc1tpXSA9PT0gXCJ0aGlzLlwiICsgdmFybmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaW4gY2hpbGRyZW46W11cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmNvbmZpZyA9IHByb3Bba2V5XVswXT8ubm9kZT8uaW5pdGlhbGl6ZXI/LmVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5jb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgaW5jb25maWcubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5jb25maWdbeF0uZ2V0VGV4dCgpID09PSB2YXJuYW1lIHx8IGluY29uZmlnW3hdLmdldFRleHQoKS5zdGFydHNXaXRoKHZhcm5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShpbmNvbmZpZ1t4XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNvbmZpZy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUocHJvcFtrZXldWzBdPy5ub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5vZGVGcm9tU2NvcGUoY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSwgdmFyaWFibGVzY29wZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZSB9ID0gdW5kZWZpbmVkKTogdHMuTm9kZSB7XHJcbiAgICAgICAgdmFyIHNjb3BlO1xyXG4gICAgICAgIGlmICh2YXJpYWJsZXNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gdGhpcy5kYXRhW3ZhcmlhYmxlc2NvcGUudmFyaWFibGVuYW1lXVt2YXJpYWJsZXNjb3BlLm1ldGhvZG5hbWVdWzBdPy5ub2RlO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUuZXhwcmVzc2lvbilcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUuaW5pdGlhbGl6ZXI7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NzY29wZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjID0gY2xhc3NzY29wZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYy5jbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuY2xhc3Nlc1tzYy5jbGFzc25hbWVdPy5tZW1iZXJzW3NjLm1ldGhvZG5hbWVdPy5ub2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8vZXhwb3J0ZWQgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuZnVuY3Rpb25zW3NjLm1ldGhvZG5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzY29wZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmV4dCB2YXJpYWJsZW5hbWVcclxuICAgICAqICovXHJcbiAgICBnZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlOiBzdHJpbmcsIHN1Z2dlc3RlZE5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gc3VnZ2VzdGVkTmFtZTtcclxuICAgICAgICBpZiAodmFybmFtZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB2YXJuYW1lID0gdHlwZS5zcGxpdChcIi5cIilbdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBmb3IgKHZhciBjb3VudGVyID0gMTsgY291bnRlciA8IDEwMDA7IGNvdW50ZXIrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLm1lID09PSB1bmRlZmluZWQgfHwgdGhpcy5kYXRhLm1lW3Zhcm5hbWUgKyAoY291bnRlciA9PT0gMSA/IFwiXCIgOiBjb3VudGVyKV0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFybmFtZSArIChjb3VudGVyID09PSAxID8gXCJcIiA6IGNvdW50ZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGFuZ2Ugb2JqZWN0bGl0ZXJhbCB0byBtdXRsaWxpbmUgaWYgbmVlZGVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3dpdGNoVG9NdXRsaWxpbmVJZk5lZWRlZChub2RlOiB0cy5Ob2RlLCBuZXdQcm9wZXJ0eTogc3RyaW5nLCBuZXdWYWx1ZSkge1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IG5vZGUuZ2V0VGV4dCgpO1xyXG4gICAgICAgIGlmIChub2RlW1wibXVsdGlMaW5lXCJdICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0gbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0ucHJvcGVydGllc1t4XTtcclxuICAgICAgICAgICAgICAgIGxlbiArPSAocHJvcC5pbml0aWFsaXplci5lc2NhcGVkVGV4dCA/IHByb3AuaW5pdGlhbGl6ZXIuZXNjYXBlZFRleHQubGVuZ3RoIDogcHJvcC5pbml0aWFsaXplci5nZXRUZXh0KCkubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxlbiArPSBwcm9wLm5hbWUuZXNjYXBlZFRleHQubGVuZ3RoICsgNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsZW4pO1xyXG4gICAgICAgICAgICBpZiAob2xkVmFsdWUuaW5kZXhPZihcIlxcblwiKSA+IC0xIHx8IChsZW4gPiA2MCkgfHwgbmV3VmFsdWUuaW5kZXhPZihcIlxcblwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvL29yZGVyIGFsc28gb2xkIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5wb3MgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmxlbiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0gPSB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXMsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQcm9wZXJ0eUluQ29uZmlnKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgdHMuTm9kZSxcclxuICAgICAgICBpc0Z1bmN0aW9uOiBib29sZWFuID0gZmFsc2UsIHJlcGxhY2U6IGJvb2xlYW4gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgYmVmb3JlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZT99ID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIHNjb3BlOiB0cy5Ob2RlKSB7XHJcblxyXG4gICAgICAgIHZhciBzdmFsdWU6IGFueSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IDxhbnk+dGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl1bMF0ubm9kZTtcclxuICAgICAgICBjb25maWcgPSBjb25maWcuYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIHZhciBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5LCA8YW55PnN2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImFkZFwiICYmIHJlcGxhY2UgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICBzdmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB0cy5jcmVhdGVJZGVudGlmaWVyKHZhbHVlICsgXCIuY29uZmlnKHt9KVwiKSA6IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjaGlsZHJlblwiXSA9PSB1bmRlZmluZWQpIHsvL1xyXG4gICAgICAgICAgICAgICAgbmV3RXhwcmVzc2lvbiA9IHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSwgdHMuY3JlYXRlQXJyYXlMaXRlcmFsKFtzdmFsdWVdLCB0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICBjb25maWcucHJvcGVydGllcy5wdXNoKG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjaGlsZHJlblwiXVswXS5ub2RlLmluaXRpYWxpemVyLmVsZW1lbnRzLnB1c2goc3ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjaGlsZHJlblwiXVswXS5ub2RlLmluaXRpYWxpemVyLmVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYXJyYXkubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5W3hdLmdldFRleHQoKSA9PT0gYmVmb3JlLnZhbHVlIHx8IGFycmF5W3hdLmdldFRleHQoKS5zdGFydHNXaXRoKGJlZm9yZS52YWx1ZSArIFwiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKHgsIDAsIHN2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm9kZSBcIiArIGJlZm9yZS52YWx1ZSArIFwiIG5vdCBmb3VuZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHsgIC8vY29tcC5hZGQoYSkgLS0+IGNvbXAuY29uZmlnKHtjaGlsZHJlbjpbYV19KVxyXG4gICAgICAgICAgICBpZiAocmVwbGFjZSAhPT0gZmFsc2UgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgey8vZWRpdCBleGlzdGluZ1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBjb25maWcucHJvcGVydGllcy5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnByb3BlcnRpZXNbcG9zXSA9IG5ld0V4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTXV0bGlsaW5lSWZOZWVkZWQoY29uZmlnLCBwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnByb3BlcnRpZXMucHVzaChuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9NdXRsaWxpbmVJZk5lZWRlZChjb25maWcsIHByb3BlcnR5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjb3JyZWN0IHNwYWNlc1wiKTtcclxuICAgICAgICB0aGlzLnBhcnNlKHRoaXMuZ2V0TW9kaWZpZWRDb2RlKCkpO1xyXG4gICAgICAgIC8vaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgIC8vICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcblxyXG4gICAgfVxyXG4gICAgLyogIG1vdmVQcm9wZXJ0VmFsdWVJbkNvZGUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG5ld1ZhcmlhYmxlTmFtZTogc3RyaW5nLCBiZWZvcmVWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJhZGRcIilcclxuICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBcImNoaWxkcmVuXCI7XHJcbiAgICAgICAgICAgICAgdmFyIG9sZHBhcmVudDphbnk9dGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldWzBdLm5vZGU7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlTm9kZT1vbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHNbeF07XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZU5vZGUuZ2V0VGV4dCgpID09PSB2YWx1ZSB8fHZhbHVlTm9kZS5nZXRUZXh0KCkuc3RhcnRzV2l0aCh2YWx1ZSArIFwiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLnNwbGljZSh4LDEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9Ki9cclxuICAgIC8qKlxyXG4gICAgKiBtb2RpZnkgdGhlIHByb3BlcnR5IGluIGNvZGVcclxuICAgICogQHBhcmFtIHZhcmlhYmxlbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgKiBAcGFyYW0gIHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IFxyXG4gICAgKiBAcGFyYW0gdmFsdWUgLSB0aGUgbmV3IHZhbHVlXHJcbiAgICAqIEBwYXJhbSBjbGFzc3Njb3BlICAtIHRoZSBwcm9wZXJ0eSB3b3VsZCBiZSBpbnNlcnQgaW4gdGhpcyBibG9ja1xyXG4gICAgKiBAcGFyYW0gaXNGdW5jdGlvbiAgLSB0cnVlIGlmIHRoZSBwcm9wZXJ0eSBpcyBhIGZ1bmN0aW9uXHJcbiAgICAqIEBwYXJhbSBbcmVwbGFjZV0gIC0gaWYgdHJ1ZSB0aGUgb2xkIHZhbHVlIGlzIGRlbGV0ZWRcclxuICAgICogQHBhcmFtIFtiZWZvcmVdIC0gdGhlIG5ldyBwcm9wZXJ0eSBpcyBwbGFjZWQgYmVmb3JlIHRoaXMgcHJvcGVydHlcclxuICAgICogQHBhcmFtIFt2YXJpYWJsZXNjb3BlXSAtIGlmIHRoaXMgc2NvcGUgaXMgZGVmaW5lZCAtIHRoZSBuZXcgcHJvcGVydHkgd291bGQgYmUgaW5zZXJ0IGluIHRoaXMgdmFyaWFibGVcclxuICAgICovXHJcbiAgICBzZXRQcm9wZXJ0eUluQ29kZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHRzLk5vZGUsXHJcbiAgICAgICAgY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSxcclxuICAgICAgICBpc0Z1bmN0aW9uOiBib29sZWFuID0gZmFsc2UsIHJlcGxhY2U6IGJvb2xlYW4gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgYmVmb3JlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZT99ID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIHZhcmlhYmxlc2NvcGU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWUgfSA9IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gPSB7fTtcclxuICAgICAgICBpZiAoY2xhc3NzY29wZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBjbGFzc3Njb3BlID0gdGhpcy5jbGFzc1Njb3BlO1xyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICB2YXIgbmV3RXhwcmVzc2lvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldFByb3BlcnR5SW5Db25maWcodmFyaWFibGVOYW1lLCBwcm9wZXJ0eSwgdmFsdWUsIGlzRnVuY3Rpb24sIHJlcGxhY2UsIGJlZm9yZSwgc2NvcGUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXdWYWx1ZTogYW55ID0gdHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiID8gdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkgOiB2YWx1ZTtcclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBzY29wZVtcImJvZHlcIl0uc3RhdGVtZW50c1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJuZXdcIikgeyAvL21lLnBhbmVsMT1uZXcgUGFuZWwoe30pO1xyXG4gICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiX25ld19cIl1bMF07Ly8uc3Vic3RyaW5nKDMpXTtcclxuICAgICAgICAgICAgdmFyIGNvbnN0ciA9IHByb3AudmFsdWU7XHJcbiAgICAgICAgICAgIHZhbHVlID0gY29uc3RyLnN1YnN0cmluZygwLCBjb25zdHIuaW5kZXhPZihcIihcIikgKyAxKSArIHZhbHVlICsgY29uc3RyLnN1YnN0cmluZyhjb25zdHIubGFzdEluZGV4T2YoXCIpXCIpKTtcclxuICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gcHJvcC5ub2RlLmdldFRleHQoKTtcclxuICAgICAgICAgICAgbGVmdCA9IGxlZnQuc3Vic3RyaW5nKDAsIGxlZnQuaW5kZXhPZihcIj1cIikgLSAxKTtcclxuICAgICAgICAgICAgcHJvcGVydHkgPSBcIl9uZXdfXCI7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihsZWZ0KSwgbmV3VmFsdWUpKTtcclxuICAgICAgICAgICAgLypcdH1lbHNley8vdmFyIGhoPW5ldyBQYW5lbCh7fSlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29uc3RyLnN1YnN0cmluZygwLCBjb25zdHIuaW5kZXhPZihcIihcIikgKyAxKSArIHZhbHVlICsgY29uc3RyLnN1YnN0cmluZyhjb25zdHIubGFzdEluZGV4T2YoXCIpXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RXhwcmVzc2lvbj10cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihcIm1lLlwiK3Byb3BlcnR5KSwgdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkpKTtcdFxyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUNhbGwodHMuY3JlYXRlSWRlbnRpZmllcih2YXJpYWJsZU5hbWUgKyBcIi5cIiArIHByb3BlcnR5KSwgdW5kZWZpbmVkLCBbbmV3VmFsdWVdKSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcih2YXJpYWJsZU5hbWUgKyBcIi5cIiArIHByb3BlcnR5KSwgbmV3VmFsdWUpKTtcclxuICAgICAgICBpZiAocmVwbGFjZSAhPT0gZmFsc2UgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgey8vZWRpdCBleGlzdGluZ1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXVtwb3NdID0gbmV3RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgLy9pZiAocG9zID49IDApXHJcbiAgICAgICAgICAgIC8vICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIHsvL2luc2VydCBuZXdcclxuICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZS52YWx1ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwibm90IGltcGxlbWVudGVkXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV0ubGVuZ3RoOyBvKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10udmFsdWUgPT09IGJlZm9yZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiUHJvcGVydHkgbm90IGZvdW5kIFwiICsgYmVmb3JlLnZhcmlhYmxlbmFtZSArIFwiLlwiICsgYmVmb3JlLnByb3BlcnR5ICsgXCIgdmFsdWUgXCIgKyBiZWZvcmUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cHJvcDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJfbmV3X1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2hvdWxkIGJlIGluIHRoZSBzYW1lIHNjb3BlIG9mIGRlY2xhcmF0aW9uIChpbXBvcnRhbnQgZm9yIHJlcGVhdGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bMF0ubm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3Rub2RlOiB0cy5Ob2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF0ubGVuZ3RoIC0gMV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdG5vZGUucGFyZW50ID09PSBzY29wZVtcImJvZHlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wID0gdGVzdG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gbGFzdHByb3AucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGxhc3Rwcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcyArIDEsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gc3RhdGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+IDAgJiYgc3RhdGVtZW50c1tzdGF0ZW1lbnRzLmxlbmd0aCAtIDFdLmdldFRleHQoKS5zdGFydHNXaXRoKFwicmV0dXJuIFwiKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50cy5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogc3dhcHMgdHdvIHN0YXRlbWVudHMgaW5kZW5kaWZpZWQgYnkgIGZ1bmN0aW9ucGFyYW1ldGVyIGluIGEgdmFyaWFibGUucHJvcGVydHkocGFyYW1ldGVyMSkgd2l0aCB2YXJpYWJsZS5wcm9wZXJ0eShwYXJhbWV0ZXIyKVxyXG4gICAgICoqL1xyXG4gICAgc3dhcFByb3BlcnR5V2l0aFBhcmFtZXRlcih2YXJpYWJsZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCBwYXJhbWV0ZXIxOiBzdHJpbmcsIHBhcmFtZXRlcjI6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBmaXJzdDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc2Vjb25kOiB0cy5Ob2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmVudC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAocGFyZW50W3hdLnZhbHVlLnNwbGl0KFwiLFwiKVswXS50cmltKCkgPT09IHBhcmFtZXRlcjEpXHJcbiAgICAgICAgICAgICAgICBmaXJzdCA9IHBhcmVudFt4XS5ub2RlO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50W3hdLnZhbHVlLnNwbGl0KFwiLFwiKVswXS50cmltKCkgPT09IHBhcmFtZXRlcjIpXHJcbiAgICAgICAgICAgICAgICBzZWNvbmQgPSBwYXJlbnRbeF0ubm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFmaXJzdClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJQYXJhbWV0ZXIgbm90IGZvdW5kIFwiICsgcGFyYW1ldGVyMSk7XHJcbiAgICAgICAgaWYgKCFzZWNvbmQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiUGFyYW1ldGVyIG5vdCBmb3VuZCBcIiArIHBhcmFtZXRlcjIpO1xyXG4gICAgICAgIHZhciBpZmlyc3QgPSBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2YoZmlyc3QpO1xyXG4gICAgICAgIHZhciBpc2Vjb25kID0gc2Vjb25kLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihzZWNvbmQpO1xyXG4gICAgICAgIGZpcnN0LnBhcmVudFtcInN0YXRlbWVudHNcIl1baWZpcnN0XSA9IHNlY29uZDtcclxuICAgICAgICBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdW2lzZWNvbmRdID0gZmlyc3Q7XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBhZGRzIGFuIFByb3BlcnR5XHJcbiAgICAqIEBwYXJhbSB0eXBlIC0gbmFtZSBvZiB0aGUgdHlwZSBvIGNyZWF0ZVxyXG4gICAgKiBAcGFyYW0gY2xhc3NzY29wZSAtIHRoZSBzY29wZSAobWV0aG9kbmFtZSkgd2hlcmUgdGhlIHZhcmlhYmxlIHNob3VsZCBiZSBpbnNlcnQgQ2xhc3MubGF5b3V0XHJcbiAgICAqIEBwYXJhbSB2YXJpYWJsZXNjb3BlIC0gdGhlIHNjb3BlIHdoZXJlIHRoZSB2YXJpYWJsZSBzaG91bGQgYmUgaW5zZXJ0IGUuZy4gaGFsbG8ub25jbGlja1xyXG4gICAgKiBAcmV0dXJucyAgdGhlIG5hbWUgb2YgdGhlIG9iamVjdFxyXG4gICAgKi9cclxuICAgIGFkZFZhcmlhYmxlSW5Db2RlKGZ1bGx0eXBlOiBzdHJpbmcsIGNsYXNzc2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10sIHZhcmlhYmxlc2NvcGU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWUgfSA9IHVuZGVmaW5lZCwgc3VnZ2VzdGVkTmFtZSA9IHVuZGVmaW5lZCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKGNsYXNzc2NvcGUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgY2xhc3NzY29wZSA9IHRoaXMuY2xhc3NTY29wZTtcclxuICAgICAgICBsZXQgdHlwZSA9IGZ1bGx0eXBlLnNwbGl0KFwiLlwiKVtmdWxsdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKHR5cGUsIHN1Z2dlc3RlZE5hbWUpO1xyXG4gICAgICAgIHZhciB1c2VNZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbXCJtZVwiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB1c2VNZSA9IHRydWU7XHJcbiAgICAgICAgLy92YXIgaWYoc2NvcGVuYW1lKVxyXG4gICAgICAgIHZhciBub2RlID0gdGhpcy5nZXROb2RlRnJvbVNjb3BlKGNsYXNzc2NvcGUsIHZhcmlhYmxlc2NvcGUpO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmIChub2RlPy5wYXJhbWV0ZXJzPy5sZW5ndGggPiAwICYmIG5vZGUucGFyYW1ldGVyc1swXS5uYW1lLnRleHQgPT0gXCJtZVwiKSB7XHJcbiAgICAgICAgICAgIHVzZU1lID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHByZWZpeCA9IHVzZU1lID8gXCJtZS5cIiA6IFwidmFyIFwiO1xyXG5cclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBub2RlW1wiYm9keVwiXS5zdGF0ZW1lbnRzO1xyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gc2NvcGUgdG8gaW5zZXJ0IGEgdmFyaWFibGUgY291bGQgYmUgZm91bmRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzdGF0ZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGVtZW50c1t4XS5nZXRUZXh0KCkuc3BsaXQoXCJcXG5cIilbMF0uaW5jbHVkZXMoXCJuZXcgXCIpICYmICFzdGF0ZW1lbnRzW3hdLmdldFRleHQoKS5zcGxpdChcIlxcblwiKVswXS5pbmNsdWRlcyhcInZhciBcIikpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFzcyA9IHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihwcmVmaXggKyB2YXJuYW1lKSwgdHMuY3JlYXRlSWRlbnRpZmllcihcIm5ldyBcIiArIHR5cGUgKyBcIigpXCIpKTtcclxuICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZSh4LCAwLCB0cy5jcmVhdGVTdGF0ZW1lbnQoYXNzKSk7XHJcbiAgICAgICAgaWYgKHVzZU1lKVxyXG4gICAgICAgICAgICB0aGlzLmFkZFR5cGVNZSh2YXJuYW1lLCB0eXBlKTtcclxuICAgICAgICByZXR1cm4gKHVzZU1lID8gXCJtZS5cIiA6IFwiXCIpICsgdmFybmFtZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICBhd2FpdCB0eXBlc2NyaXB0LndhaXRGb3JJbml0ZWQ7XHJcbiAgICB2YXIgY29kZSA9IHR5cGVzY3JpcHQuZ2V0Q29kZShcImRlL1Rlc3REaWFsb2dCaW5kZXIudHNcIik7XHJcbiAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gICAgLy8gY29kZSA9IFwiZnVuY3Rpb24gdGVzdCgpeyB2YXIgaGFsbG89e307dmFyIGgyPXt9O3ZhciBwcHA9e307aGFsbG8ucD05O2hhbGxvLmNvbmZpZyh7YToxLGI6MiwgazpoMi5jb25maWcoe2M6MSxqOnBwcC5jb25maWcoe3BwOjl9KX0pICAgICB9KTsgfVwiO1xyXG4gICAgLy8gY29kZSA9IFwiZnVuY3Rpb24odGVzdCl7IHZhciBoYWxsbz17fTt2YXIgaDI9e307dmFyIHBwcD17fTtoYWxsby5wPTk7aGFsbG8uY29uZmlnKHthOjEsYjoyLCBrOmgyLmNvbmZpZyh7YzoxfSxqKCl7ajIudWRvPTl9KSAgICAgfSk7IH1cIjtcclxuICAgIC8vIGNvZGUgPSBcImZ1bmN0aW9uIHRlc3QoKXt2YXIgcHBwO3ZhciBhYWE9bmV3IEJ1dHRvbigpO3BwcC5jb25maWcoe2E6WzksNl0sICBjaGlsZHJlbjpbbGwuY29uZmlnKHt9KSxhYWEuY29uZmlnKHt1OjEsbzoyLGNoaWxkcmVuOltray5jb25maWcoe30pXX0pXX0pO31cIjtcclxuICAgIC8vcGFyc2VyLnBhcnNlKGNvZGUsIHVuZGVmaW5lZCk7XHJcbiAgICBwYXJzZXIucGFyc2UoY29kZSwgW3sgY2xhc3NuYW1lOiBcIlRlc3REaWFsb2dCaW5kZXJcIiwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9XSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxuICAgIHBhcnNlci5yZW1vdmVWYXJpYWJsZXNJbkNvZGUoW1wibWUucmVwZWF0ZXJcIl0pO1xyXG4gICAgLy9wYXJzZXIuYWRkVmFyaWFibGVJbkNvZGUoXCJDb21wb25lbnRcIiwgW3sgY2xhc3NuYW1lOiBcIkRpYWxvZ1wiLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH1dKTtcclxuICAgIC8vcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwiY29tcG9uZW50XCIsIFwieFwiLCBcIjFcIiwgW3sgY2xhc3NuYW1lOiBcIkRpYWxvZ1wiLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH1dKTtcclxuICAgIFxyXG4gICAgLy8gdmFyIG5vZGUgPSBwYXJzZXIucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgXCJtZS50ZXh0Ym94MVwiLCBcIm1lLnBhbmVsMVwiKTtcclxuICAgIC8vIHBhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcInRoaXNcIixcImFkZFwiLG5vZGUsW3tjbGFzc25hbWU6XCJEaWFsb2dcIixtZXRob2RuYW1lOlwibGF5b3V0XCJ9XSx0cnVlLGZhbHNlKTtcclxuICAgIC8vdmFyIG5vZGUgPSBwYXJzZXIucmVtb3ZlUHJvcGVydHlJbkNvZGUoXCJhZGRcIiwgXCJra1wiLCBcImFhYVwiKTtcclxuXHJcbiAgICAvL3ZhciBub2RlPXBhcnNlci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBcImxsXCIsIFwicHBwXCIpO1xyXG4gICAgLy9wYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJhYWFcIixcImFkZFwiLG5vZGUsW3tjbGFzc25hbWU6dW5kZWZpbmVkLCBtZXRob2RuYW1lOlwidGVzdFwifV0sdHJ1ZSxmYWxzZSx1bmRlZmluZWQsdW5kZWZpbmVkKTtcclxuICAgIC8vY29uc29sZS5sb2cobm9kZS5nZXRUZXh0KCkpO1xyXG4gICAgLy8gICAgcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwicHBwXCIsXCJhZGRcIixcImNjXCIsW3tjbGFzc25hbWU6dW5kZWZpbmVkLCBtZXRob2RuYW1lOlwidGVzdFwifV0sdHJ1ZSxmYWxzZSx7dmFyaWFibGVuYW1lOlwicHBwXCIscHJvcGVydHk6XCJhZGRcIix2YWx1ZTpcImxsXCJ9KTtcclxuICAgIC8vICBwYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJhYWFcIixcImFkZFwiLFwiY2NcIixbe2NsYXNzbmFtZTp1bmRlZmluZWQsIG1ldGhvZG5hbWU6XCJ0ZXN0XCJ9XSx0cnVlLGZhbHNlLHt2YXJpYWJsZW5hbWU6XCJhYWFcIixwcm9wZXJ0eTpcImFkZFwiLHZhbHVlOlwia2tcIn0pO1xyXG4gICAgY29uc29sZS5sb2cocGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpKTtcclxuICAgIC8vIGRlYnVnZ2VyO1xyXG4gICAgLyogIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKHsgbmV3TGluZTogdHMuTmV3TGluZUtpbmQuTGluZUZlZWQgfSk7XHJcbiAgICAgIGNvbnN0IHJlc3VsdEZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFwiZHVtbXkudHNcIiwgXCJcIiwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgZmFsc2UsIHRzLlNjcmlwdEtpbmQuVFMpO1xyXG4gICAgICBjb25zdCByZXN1bHQgPSBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgcGFyc2VyLnNvdXJjZUZpbGUsIHJlc3VsdEZpbGUpO1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXN1bHQpOyovXHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4iXX0=