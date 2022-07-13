var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs_editor/util/Typescript", "jassijs/remote/Test", "jassijs/remote/Classes"], function (require, exports, Registry_1, Typescript_1, Test_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.tests = exports.Parser = exports.ParsedClass = void 0;
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
            else if (arg.kind === ts.SyntaxKind.ArrowFunction || arg.kind === ts.SyntaxKind.FunctionExpression) {
                return arg.getText();
            }
            throw new Classes_1.JassiError("Error type not found");
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
                        this.visitNode(node.arguments[0]["body"], true);
                        //this.parseProperties(node.arguments[0]["body"]);
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
                node.getChildren().forEach(c => this.visitNode(c, true));
        }
        visitNode(node, consumeProperties = undefined) {
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
                return;
            }
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Me") {
                this.parseTypeMeNode(node);
                return;
            }
            else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                this.parseClass(node);
                return;
            }
            else if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) { //functions out of class
                this.functions[node["name"].text] = node;
                if (this.classScope) {
                    for (let x = 0; x < this.classScope.length; x++) {
                        var col = this.classScope[x];
                        if (col.classname === undefined && node["name"].text === col.methodname)
                            consumeProperties = true;
                    }
                }
                else
                    consumeProperties = true;
            }
            if (consumeProperties)
                this.parseProperties(node);
            else
                node.getChildren().forEach(c => this.visitNode(c, consumeProperties));
            //TODO remove this block
            /*  if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                  this.add(node["name"].text, "", "", undefined);
              }*/
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
            if (this.classScope === undefined)
                this.visitNode(this.sourceFile, true);
            else
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
            if (classscope === undefined) {
                return this.sourceFile;
            }
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
            if (this.data[variableName]["config"] !== undefined && property !== "new") {
                this.setPropertyInConfig(variableName, property, value, isFunction, replace, before, scope);
                return;
            }
            var newValue = typeof value === "string" ? ts.createIdentifier(value) : value;
            var statements = scope["body"] ? scope["body"].statements : scope["statements"];
            if (property === "new") { //me.panel1=new Panel({});
                let prop = this.data[variableName]["_new_"][0]; //.substring(3)];
                var constr = prop.value;
                value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                replace = true;
                var left = prop.node.getText();
                left = left.substring(0, left.indexOf("=") - 1);
                property = "_new_";
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), newValue));
            }
            else if (isFunction) {
                newExpression = ts.createExpressionStatement(ts.createCall(ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), undefined, [newValue]));
            }
            else
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), newValue));
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
            if (this.data[variable]["config"] && property === "add") {
                var children = this.data[variable]["children"][0].node.initializer.elements;
                var ifirst;
                var isecond;
                for (var x = 0; x < children.length; x++) {
                    var text = children[x].getText();
                    if (text === parameter1 || text.startsWith(parameter1 + ".config")) {
                        ifirst = x;
                    }
                    if (text === parameter2 || text.startsWith(parameter2 + ".config")) {
                        isecond = x;
                    }
                }
                var temp = children[ifirst];
                children[ifirst] = children[isecond];
                children[isecond] = temp;
                return;
            }
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
            if (node === undefined)
                throw Error("no scope to insert a variable could be found");
            var statements = node["body"] ? node["body"].statements : node["statements"];
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
        (0, Registry_1.$Class)("jassijs_editor.util.Parser"),
        __metadata("design:paramtypes", [])
    ], Parser);
    exports.Parser = Parser;
    async function tests(t) {
        function clean(s) {
            return s.replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
        }
        await Typescript_1.default.waitForInited;
        var parser = new Parser();
        parser.parse("var j;j.config({children:[a,b,c]})");
        parser.swapPropertyWithParameter("j", "add", "c", "a");
        t.expectEqual(clean(parser.getModifiedCode()) === 'var j;j.config({ children: [c, b, a] });');
        parser.parse("var j;j.add(a);j.add(b);j.add(c);");
        parser.swapPropertyWithParameter("j", "add", "c", "a");
        t.expectEqual(clean(parser.getModifiedCode()) === 'var j;j.add(c);j.add(b);j.add(a);');
        parser.parse("class A{}");
        t.expectEqual(parser.classes.A !== undefined);
        parser.parse("var a=8;");
        t.expectEqual(parser.data.a !== undefined);
        parser.parse("b=8;");
        t.expectEqual(parser.data.b !== undefined);
        parser.parse("b=8", [{ classname: undefined, methodname: "test" }]);
        t.expectEqual(parser.data.b === undefined);
        var scope = [{ classname: undefined, methodname: "test" }];
        parser.parse("function test(){b=8;}", scope);
        t.expectEqual(parser.data.b !== undefined);
        parser.addVariableInCode("MyClass", scope);
        parser.setPropertyInCode("myclass", "a", "9", scope);
        t.expectEqual(clean(parser.getModifiedCode()) === "function test() { var myclass = new MyClass(); b = 8; myclass.a = 9; }");
        parser = new Parser();
        parser.parse("");
        parser.addVariableInCode("MyClass", undefined);
        parser.setPropertyInCode("myclass", "a", "9", undefined);
        t.expectEqual(clean(parser.getModifiedCode()) === "var myclass = new MyClass();myclass.a = 9;");
    }
    exports.tests = tests;
    async function test() {
        tests(new Test_1.Test());
        await Typescript_1.default.waitForInited;
        var code = Typescript_1.default.getCode("demo/Dialog2.ts");
        var parser = new Parser();
        // code = "function test(){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1,j:ppp.config({pp:9})})     }); }";
        // code = "function(test){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1},j(){j2.udo=9})     }); }";
        // code = "function test(){var ppp;var aaa=new Button();ppp.config({a:[9,6],  children:[ll.config({}),aaa.config({u:1,o:2,children:[kk.config({})]})]});}";
        //parser.parse(code, undefined);
        //code="reportdesign={k:9};";
        parser.parse(code, [{ classname: "Dialog2", methodname: "layout" }]); // [{ classname: "TestDialogBinder", methodname: "layout" }]);
        parser.setPropertyInCode("me.table", "new", 'new Table({\n      paginationSize: 1\n})', undefined);
        console.log(parser.getModifiedCode());
        // parser.removeVariablesInCode(["me.repeater"]);
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
        // debugger;
        /*  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
          const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
          const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
          console.log(result);*/
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWtCQSxNQUFNLGVBQWU7UUFBckI7WUFHSSxvQkFBZSxHQUFjLEVBQUUsQ0FBQztZQUNoQyxjQUFTLEdBQWMsRUFBRSxDQUFDO1FBRTlCLENBQUM7S0FBQTtJQUNELE1BQU0sWUFBWTtRQUFsQjtZQUdJLGNBQVMsR0FBeUMsRUFBRSxDQUFDO1FBRXpELENBQUM7S0FBQTtJQUNELE1BQWEsV0FBVztRQUF4QjtZQUtJLFlBQU8sR0FBc0MsRUFBRSxDQUFDO1lBQ2hELGNBQVMsR0FBeUMsRUFBRSxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQVBELGtDQU9DO0lBRUQsSUFBYSxNQUFNLEdBQW5CLE1BQWEsTUFBTTtRQWdCZjs7O1dBR0c7UUFDSDtZQW5CQSxlQUFVLEdBQWtCLFNBQVMsQ0FBQztZQUV0QyxXQUFNLEdBQThCLEVBQUUsQ0FBQztZQUN2QyxZQUFPLEdBQW9DLEVBQUUsQ0FBQztZQUM5QyxZQUFPLEdBQStCLEVBQUUsQ0FBQztZQUN6QyxjQUFTLEdBQWdDLEVBQUUsQ0FBQztZQUM1QyxjQUFTLEdBQWdDLEVBQUUsQ0FBQztZQWV4QyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNmLGlDQUFpQztRQUNyQyxDQUFDO1FBRUQsZUFBZTtZQUNYLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxD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Q0FBQztRQUMvQixJQUFJLElBQUksR0FBRyxvQkFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ2pELElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDMUIsa0pBQWtKO1FBQ2xKLDBJQUEwSTtRQUMxSSwySkFBMko7UUFDM0osZ0NBQWdDO1FBQ2hDLDZCQUE2QjtRQUU3QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBQyxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUEsOERBQThEO1FBRWxJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLDBDQUEwQyxFQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFDdkMsaURBQWlEO1FBQ2hELHlGQUF5RjtRQUN6RixtR0FBbUc7UUFFbkcsNkVBQTZFO1FBQzdFLHFHQUFxRztRQUNyRyw2REFBNkQ7UUFFN0QsMkRBQTJEO1FBQzNELHVIQUF1SDtRQUN2SCw4QkFBOEI7UUFDOUIsc0pBQXNKO1FBQ3RKLG9KQUFvSjtRQUVwSixZQUFZO1FBQ1o7OztnQ0FHd0I7SUFJNUIsQ0FBQztJQXRDRCxvQkFzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcblxyXG5cclxuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBUZXN0cyB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvVGVzdHNcIjtcclxuaW1wb3J0IHsgVGVzdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9UZXN0XCI7XHJcbmltcG9ydCB7IEphc3NpRXJyb3IgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xyXG5cclxuXHJcbmludGVyZmFjZSBQcm9wZXJ0aWVzIHtcclxuICAgIFtkZXRhaWxzOiBzdHJpbmddOiBFbnRyeTtcclxufVxyXG5pbnRlcmZhY2UgRW50cnkge1xyXG4gICAgdmFsdWU/OiBhbnk7XHJcbiAgICBub2RlPzogdHMuTm9kZTtcclxuICAgIGlzRnVuY3Rpb246IGJvb2xlYW47XHJcbn1cclxuY2xhc3MgUGFyc2VkRGVjb3JhdG9yIHtcclxuICAgIG5vZGU/OiB0cy5EZWNvcmF0b3I7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgcGFyc2VkUGFyYW1ldGVyPzogb2JqZWN0W10gPSBbXTtcclxuICAgIHBhcmFtZXRlcj86IHN0cmluZ1tdID0gW107XHJcblxyXG59XHJcbmNsYXNzIFBhcnNlZE1lbWJlciB7XHJcbiAgICBub2RlPzogdHMuTm9kZTtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBkZWNvcmF0b3I/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWREZWNvcmF0b3IgfSA9IHt9O1xyXG4gICAgdHlwZT86IHN0cmluZztcclxufVxyXG5leHBvcnQgY2xhc3MgUGFyc2VkQ2xhc3Mge1xyXG4gICAgcGFyZW50PzogUGFyc2VyO1xyXG4gICAgbm9kZT86IHRzLkNsYXNzRWxlbWVudDtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBmdWxsQ2xhc3NuYW1lPzogc3RyaW5nO1xyXG4gICAgbWVtYmVycz86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZE1lbWJlciB9ID0ge307XHJcbiAgICBkZWNvcmF0b3I/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWREZWNvcmF0b3IgfSA9IHt9O1xyXG59XHJcbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlBhcnNlclwiKVxyXG5leHBvcnQgY2xhc3MgUGFyc2VyIHtcclxuICAgIHNvdXJjZUZpbGU6IHRzLlNvdXJjZUZpbGUgPSB1bmRlZmluZWQ7XHJcbiAgICB0eXBlTWVOb2RlOiB0cy5Ob2RlO1xyXG4gICAgdHlwZU1lOiB7IFtuYW1lOiBzdHJpbmddOiBFbnRyeSB9ID0ge307XHJcbiAgICBjbGFzc2VzOiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWRDbGFzcyB9ID0ge307XHJcbiAgICBpbXBvcnRzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xyXG4gICAgZnVuY3Rpb25zOiB7IFtuYW1lOiBzdHJpbmddOiB0cy5Ob2RlIH0gPSB7fTtcclxuICAgIHZhcmlhYmxlczogeyBbbmFtZTogc3RyaW5nXTogdHMuTm9kZSB9ID0ge307XHJcbiAgICBjbGFzc1Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdO1xyXG5cclxuICAgIGNvZGU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgKiBAbWVtYmVyIHtPYmplY3QuPHN0cmluZyxPYmplY3QuPHN0cmluZyxbb2JqZWN0XT4+IC0gYWxsIHByb3BlcnRpZXNcclxuICAgICogZS5nLiBkYXRhW1widGV4dGJveDFcIl1bdmFsdWVdLT5FbnRyeVxyXG4gICAgKi9cclxuICAgIGRhdGE6IHsgW3ZhcmlhYmxlOiBzdHJpbmddOiB7IFtwcm9wZXJ0eTogc3RyaW5nXTogRW50cnlbXSB9IH07XHJcbiAgICAvKipcclxuICAgICAqIHBhcnNlcyBDb2RlIGZvciBVSSByZWxldmFudCBzZXR0aW5nc1xyXG4gICAgICogQGNsYXNzIGphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcclxuICAgICAgICAvKioge1tzdHJpbmddfSAtIGFsbCBjb2RlIGxpbmVzKi9cclxuICAgIH1cclxuXHJcbiAgICBnZXRNb2RpZmllZENvZGUoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcih7IG5ld0xpbmU6IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdEZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFwiZHVtbXkudHNcIiwgXCJcIiwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgLypzZXRQYXJlbnROb2RlcyovIGZhbHNlLCB0cy5TY3JpcHRLaW5kLlRTKTtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgdGhpcy5zb3VyY2VGaWxlLCByZXN1bHRGaWxlKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogYWRkIGEgcHJvcGVydHlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJpYWJsZSAtIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSBuYW1lIG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlICAtIGNvZGUgLSB0aGUgdmFsdWVcclxuICAgICAqIEBwYXJhbSBub2RlIC0gdGhlIG5vZGUgb2YgdGhlIHN0YXRlbWVudFxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZCh2YXJpYWJsZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLCBub2RlOiB0cy5Ob2RlLCBpc0Z1bmN0aW9uID0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcclxuICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnR5LnRyaW0oKTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZV0gPSB7fTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICAgICAgbm9kZTogbm9kZSxcclxuICAgICAgICAgICAgICAgIGlzRnVuY3Rpb25cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZWFkIGEgcHJvcGVydHkgdmFsdWUgZnJvbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFyaWFibGUgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHlcclxuICAgICAqL1xyXG4gICAgZ2V0UHJvcGVydHlWYWx1ZSh2YXJpYWJsZSwgcHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XVswXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAvKiB2YXJpYWJsZT1cInRoaXMuXCIrdmFyaWFibGU7XHJcbiAgICAgICAgIGlmKHRoaXMuZGF0YVt2YXJpYWJsZV0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgaWYodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XVswXS52YWx1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSovXHJcbiAgICAgICAgLy90aGlzIFxyXG4gICAgICAgIC8vICAgdmFyIHZhbHVlPXRoaXMucHJvcGVydHlFZGl0b3IucGFyc2VyLmdldFByb3BlcnR5VmFsdWUodGhpcy52YXJpYWJsZW5hbWUsdGhpcy5wcm9wZXJ0eS5uYW1lKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkVHlwZU1lKG5hbWU6IHN0cmluZywgdHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnR5cGVNZU5vZGUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgdHAgPSB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZSh0eXBlLCBbXSk7XHJcbiAgICAgICAgdmFyIG5ld25vZGUgPSB0cy5jcmVhdGVQcm9wZXJ0eVNpZ25hdHVyZSh1bmRlZmluZWQsIG5hbWUgKyBcIj9cIiwgdW5kZWZpbmVkLCB0cCwgdW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLnR5cGVNZU5vZGVbXCJtZW1iZXJzXCJdLnB1c2gobmV3bm9kZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGFkZCBpbXBvcnQge25hbWV9IGZyb20gZmlsZVxyXG4gICAgICogQHBhcmFtIG5hbWUgXHJcbiAgICAgKiBAcGFyYW0gZmlsZSBcclxuICAgICAqL1xyXG4gICAgYWRkSW1wb3J0SWZOZWVkZWQobmFtZTogc3RyaW5nLCBmaWxlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBvcnRzW25hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIHZhciBpbXAgPSB0cy5jcmVhdGVOYW1lZEltcG9ydHMoW3RzLmNyZWF0ZUltcG9ydFNwZWNpZmllcihmYWxzZSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJZGVudGlmaWVyKG5hbWUpKV0pO1xyXG4gICAgICAgICAgICBjb25zdCBpbXBvcnROb2RlID0gdHMuY3JlYXRlSW1wb3J0RGVjbGFyYXRpb24odW5kZWZpbmVkLCB1bmRlZmluZWQsIHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIGltcCksIHRzLmNyZWF0ZUxpdGVyYWwoZmlsZSkpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdXJjZUZpbGUgPSB0cy51cGRhdGVTb3VyY2VGaWxlTm9kZSh0aGlzLnNvdXJjZUZpbGUsIFtpbXBvcnROb2RlLCAuLi50aGlzLnNvdXJjZUZpbGUuc3RhdGVtZW50c10pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VUeXBlTWVOb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVHlwZUxpdGVyYWwpIHtcclxuICAgICAgICAgICAgaWYgKG5vZGVbXCJtZW1iZXJzXCJdKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlTWVOb2RlID0gbm9kZTtcclxuICAgICAgICAgICAgbm9kZVtcIm1lbWJlcnNcIl0uZm9yRWFjaChmdW5jdGlvbiAodG5vZGU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRub2RlLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRub2RlLm5hbWUudGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5cGUgPSB0bm9kZS50eXBlLnR5cGVOYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudHlwZU1lW25hbWVdID0geyBub2RlOiB0bm9kZSwgdmFsdWU6IHN0eXBlLCBpc0Z1bmN0aW9uOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmFkZChcIm1lXCIsIG5hbWUsIFwidHlwZWRlY2xhcmF0aW9uOlwiICsgc3R5cGUsIHVuZGVmaW5lZCwgYWxpbmUsIGFsaW5lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy5wYXJzZVR5cGVNZU5vZGUoYykpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjb252ZXJ0QXJndW1lbnQoYXJnOiBhbnkpIHtcclxuICAgICAgICBpZiAoYXJnID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0ge307XHJcbiAgICAgICAgICAgIHZhciBwcm9wcyA9IGFyZy5wcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICBpZiAocHJvcHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBwcm9wcy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldFtwcm9wc1twXS5uYW1lLnRleHRdID0gdGhpcy5jb252ZXJ0QXJndW1lbnQocHJvcHNbcF0uaW5pdGlhbGl6ZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5TdHJpbmdMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcudGV4dDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgbGV0IHJldCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IGFyZy5lbGVtZW50cy5sZW5ndGg7IHArKykge1xyXG4gICAgICAgICAgICAgICAgcmV0LnB1c2godGhpcy5jb252ZXJ0QXJndW1lbnQoYXJnLmVsZW1lbnRzW3BdKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLklkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFyZy50ZXh0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVHJ1ZUtleXdvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5GYWxzZUtleXdvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTnVtZXJpY0xpdGVyYWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE51bWJlcihhcmcudGV4dCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJvd0Z1bmN0aW9ufHxhcmcua2luZD09PXRzLlN5bnRheEtpbmQuRnVuY3Rpb25FeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcuZ2V0VGV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhyb3cgbmV3IEphc3NpRXJyb3IoXCJFcnJvciB0eXBlIG5vdCBmb3VuZFwiKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VEZWNvcmF0b3IoZGVjOiB0cy5EZWNvcmF0b3IpOiBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgICAgIHZhciBleDogYW55ID0gZGVjLmV4cHJlc3Npb247XHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBQYXJzZWREZWNvcmF0b3IoKTtcclxuICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldC5uYW1lID0gZXgudGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgcmV0Lm5hbWUgPSBleC5leHByZXNzaW9uLmVzY2FwZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGV4LmFyZ3VtZW50cy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wYXJzZWRQYXJhbWV0ZXIucHVzaCh0aGlzLmNvbnZlcnRBcmd1bWVudChleC5hcmd1bWVudHNbYV0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZXQucGFyYW1ldGVyLnB1c2goZXguYXJndW1lbnRzW2FdLmdldFRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNsYXNzKG5vZGU6IHRzLkNsYXNzRWxlbWVudCkge1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VkQ2xhc3MgPSBuZXcgUGFyc2VkQ2xhc3MoKTtcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MubmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLm5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXNbcGFyc2VkQ2xhc3MubmFtZV0gPSBwYXJzZWRDbGFzcztcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG5vZGUuZGVjb3JhdG9ycy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREZWMgPSB0aGlzLnBhcnNlRGVjb3JhdG9yKG5vZGUuZGVjb3JhdG9yc1t4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZGVjb3JhdG9yW3BhcnNlZERlYy5uYW1lXSA9IHBhcnNlZERlYztcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VkQ2xhc3MuZGVjb3JhdG9yW1wiJENsYXNzXCJdICYmIHBhcnNlZERlYy5wYXJhbWV0ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZnVsbENsYXNzbmFtZSA9IHBhcnNlZERlYy5wYXJhbWV0ZXJbMF0ucmVwbGFjZUFsbCgnXCInLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlW1wibWVtYmVyc1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZE1lbSA9IG5ldyBQYXJzZWRNZW1iZXIoKVxyXG4gICAgICAgICAgICAgICAgdmFyIG1lbSA9IG5vZGVbXCJtZW1iZXJzXCJdW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5uYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7Ly9Db25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLm5hbWUgPSBtZW0ubmFtZS5lc2NhcGVkVGV4dDtcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5ub2RlID0gbm9kZVtcIm1lbWJlcnNcIl1beF07XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0udHlwZSA9IChtZW0udHlwZSA/IG1lbS50eXBlLmdldEZ1bGxUZXh0KCkudHJpbSgpIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLm1lbWJlcnNbcGFyc2VkTWVtLm5hbWVdID0gcGFyc2VkTWVtO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5kZWNvcmF0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW0uZGVjb3JhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkRGVjID0gdGhpcy5wYXJzZURlY29yYXRvcihtZW0uZGVjb3JhdG9yc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5kZWNvcmF0b3JbcGFyc2VkRGVjLm5hbWVdID0gcGFyc2VkRGVjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc1Njb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2xhc3NTY29wZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmNsYXNzU2NvcGVbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzc25hbWUgPT09IHBhcnNlZENsYXNzLm5hbWUgJiYgcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5kID0gcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VDb25maWcobm9kZTogdHMuQ2FsbEV4cHJlc3Npb24pIHtcclxuICAgICAgICBpZiAobm9kZS5hcmd1bWVudHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IG5vZGUuZXhwcmVzc2lvbi5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHZhciBsYXN0cG9zID0gbGVmdC5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9IGxlZnQ7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGxhc3Rwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IGxlZnQuc3Vic3RyaW5nKDAsIGxhc3Rwb3MpO1xyXG4gICAgICAgICAgICAgICAgcHJvcCA9IGxlZnQuc3Vic3RyaW5nKGxhc3Rwb3MgKyAxKTtcclxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BzOiBhbnlbXSA9IG5vZGUuYXJndW1lbnRzWzBdLnByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9wc1twXS5uYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciB2YWx1ZSA9IHRoaXMuY29udmVydEFyZ3VtZW50KHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGU6IHN0cmluZyA9IHByb3BzW3BdLmluaXRpYWxpemVyID8gcHJvcHNbcF0uaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGU/LmluZGV4T2YoXCIuY29uZmlnXCIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZCh2YXJpYWJsZSwgbmFtZSwgY29kZSwgcHJvcHNbcF0sIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlUHJvcGVydGllcyhub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGlmIChub2RlLmluaXRpYWxpemVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGQobmFtZSwgXCJfbmV3X1wiLCB2YWx1ZSwgbm9kZS5wYXJlbnQucGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLm9wZXJhdG9yVG9rZW4ua2luZCA9PT0gdHMuU3ludGF4S2luZC5FcXVhbHNUb2tlbikgfHxcclxuICAgICAgICAgICAgdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTE7XHJcbiAgICAgICAgICAgIHZhciBub2RlMjtcclxuICAgICAgICAgICAgdmFyIGxlZnQ6IHN0cmluZztcclxuICAgICAgICAgICAgdmFyIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBpc0Z1bmN0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUxID0gbm9kZS5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgbm9kZTIgPSBub2RlLnJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG5vZGUxLmdldFRleHQoKTsvLyB0aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUxLnBvcywgbm9kZTEuZW5kKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5vZGUyLmdldFRleHQoKTsvL3RoaXMuY29kZS5zdWJzdHJpbmcobm9kZTIucG9zLCBub2RlMi5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGFydHNXaXRoKFwibmV3IFwiKSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChsZWZ0LCBcIl9uZXdfXCIsIHZhbHVlLCBub2RlLnBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUxID0gbm9kZS5leHByZXNzaW9uO1xyXG4gICAgICAgICAgICAgICAgbm9kZTIgPSBub2RlLmFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIGlzRnVuY3Rpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG5vZGUxLmdldFRleHQoKTsvLyB0aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUxLnBvcywgbm9kZTEuZW5kKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBub2RlLmFyZ3VtZW50cy5mb3JFYWNoKChhcmcpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goYXJnLmdldFRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCg8YW55PmFyZyk/LmV4cHJlc3Npb24/Lm5hbWU/LmdldFRleHQoKSA9PT0gXCJjb25maWdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5wYXJzZUNvbmZpZyg8YW55PmFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vYXJnLmdldFRleHQoKS5pbmRleE9mKFwiLmNvbmZpZyhcIilcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQuZW5kc1dpdGgoXCIuY29uZmlnXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFyaWFibGUgPSBsZWZ0O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGUgPSBsZWZ0LnN1YnN0cmluZygwLCBsYXN0cG9zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcCA9IGxlZnQuc3Vic3RyaW5nKGxhc3Rwb3MgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJhbXMuam9pbihcIiwgXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBwcm9wLCB2YWx1ZSwgbm9kZSwgaXNGdW5jdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZUNvbmZpZyhub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGVmdC5lbmRzV2l0aChcIi5jcmVhdGVSZXBlYXRpbmdDb21wb25lbnRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpc2l0Tm9kZShub2RlLmFyZ3VtZW50c1swXVtcImJvZHlcIl0sdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUuYXJndW1lbnRzWzBdW1wiYm9keVwiXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcmFtcy5qb2luKFwiLCBcIik7Ly90aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUyLnBvcywgbm9kZTIuZW5kKS50cmltKCk7Ly9cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICBwcm9wID0gbGVmdC5zdWJzdHJpbmcobGFzdHBvcyArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBwcm9wLCB2YWx1ZSwgbm9kZS5wYXJlbnQsIGlzRnVuY3Rpb24pO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMudmlzaXROb2RlKGMsdHJ1ZSkpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSxjb25zdW1lUHJvcGVydGllcz11bmRlZmluZWQpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc1tub2RlW1wibmFtZVwiXS50ZXh0XSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIG5kOiBhbnkgPSBub2RlO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IG5kLm1vZHVsZVNwZWNpZmllci50ZXh0O1xyXG4gICAgICAgICAgICBpZiAobmQuaW1wb3J0Q2xhdXNlICYmIG5kLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXMgPSBuZC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgbmFtZXMubGVuZ3RoOyBlKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltcG9ydHNbbmFtZXNbZV0ubmFtZS5lc2NhcGVkVGV4dF0gPSBmaWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PSB0cy5TeW50YXhLaW5kLlR5cGVBbGlhc0RlY2xhcmF0aW9uICYmIG5vZGVbXCJuYW1lXCJdLnRleHQgPT09IFwiTWVcIikge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlVHlwZU1lTm9kZShub2RlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUNsYXNzKDx0cy5DbGFzc0VsZW1lbnQ+bm9kZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUgJiYgbm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24pIHsvL2Z1bmN0aW9ucyBvdXQgb2YgY2xhc3NcclxuICAgICAgICAgICAgdGhpcy5mdW5jdGlvbnNbbm9kZVtcIm5hbWVcIl0udGV4dF0gPSBub2RlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jbGFzc1Njb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY2xhc3NTY29wZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmNsYXNzU2NvcGVbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzc25hbWUgPT09IHVuZGVmaW5lZCAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBjb2wubWV0aG9kbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3VtZVByb3BlcnRpZXM9dHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zdW1lUHJvcGVydGllcz10cnVlO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgaWYoY29uc3VtZVByb3BlcnRpZXMpXHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB0aGlzLnZpc2l0Tm9kZShjLGNvbnN1bWVQcm9wZXJ0aWVzKSk7XHJcbiAgICAgICAgLy9UT0RPIHJlbW92ZSB0aGlzIGJsb2NrXHJcbiAgICAgIC8qICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24gJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gXCJ0ZXN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGQobm9kZVtcIm5hbWVcIl0udGV4dCwgXCJcIiwgXCJcIiwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9Ki9cclxuICAgIH1cclxuICAgIHNlYXJjaENsYXNzbm9kZShub2RlOiB0cy5Ob2RlLCBwb3M6IG51bWJlcik6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9IHtcclxuICAgICAgICBpZiAodHMuaXNNZXRob2REZWNsYXJhdGlvbihub2RlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NuYW1lOiBub2RlLnBhcmVudFtcIm5hbWVcIl1bXCJ0ZXh0XCJdLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kbmFtZTogbm9kZS5uYW1lW1widGV4dFwiXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlICYmIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uKSB7Ly9mdW5jdGlvbnMgb3V0IG9mIGNsYXNzXHJcbiAgICAgICAgICAgIHZhciBmdW5jbmFtZSA9IG5vZGVbXCJuYW1lXCJdLnRleHRcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kbmFtZTogZnVuY25hbWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY2hpbGRzID0gbm9kZS5nZXRDaGlsZHJlbigpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY2hpbGRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjID0gY2hpbGRzW3hdO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IGMucG9zICYmIHBvcyA8PSBjLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0aGlzLnNlYXJjaENsYXNzbm9kZShjLCBwb3MpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlc3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBnZXRDbGFzc1Njb3BlRnJvbVBvc2l0aW9uKGNvZGU6IHN0cmluZywgcG9zOiBudW1iZXIpOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuXHJcbiAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZSgnZHVtbXkudHMnLCBjb2RlLCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VhcmNoQ2xhc3Nub2RlKHRoaXMuc291cmNlRmlsZSwgcG9zKTtcclxuICAgICAgICAvL3JldHVybiB0aGlzLnBhcnNlb2xkKGNvZGUsb25seWZ1bmN0aW9uKTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogcGFyc2UgdGhlIGNvZGUgXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIC0gdGhlIGNvZGVcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IG9ubHlmdW5jdGlvbiAtIG9ubHkgdGhlIGNvZGUgaW4gdGhlIGZ1bmN0aW9uIGlzIHBhcnNlZCwgZS5nLiBcImxheW91dCgpXCJcclxuICAgICovXHJcbiAgICBwYXJzZShjb2RlOiBzdHJpbmcsIGNsYXNzU2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7fTtcclxuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xyXG4gICAgICAgIGlmIChjbGFzc1Njb3BlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3NTY29wZSA9IGNsYXNzU2NvcGU7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBjbGFzc1Njb3BlID0gdGhpcy5jbGFzc1Njb3BlO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKCdkdW1teS50cycsIGNvZGUsIHRzLlNjcmlwdFRhcmdldC5FUzUsIHRydWUpO1xyXG4gICAgICAgIGlmKHRoaXMuY2xhc3NTY29wZT09PXVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy52aXNpdE5vZGUodGhpcy5zb3VyY2VGaWxlLHRydWUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy52aXNpdE5vZGUodGhpcy5zb3VyY2VGaWxlKTtcclxuXHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5wYXJzZW9sZChjb2RlLG9ubHlmdW5jdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbW92ZU5vZGUobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0pIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl1bXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl1bXCJtZW1iZXJzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudFtcInByb3BlcnRpZXNcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJwcm9wZXJ0aWVzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wicHJvcGVydGllc1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50W1wiZWxlbWVudHNcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJlbGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcImVsZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgICB9ZWxzZSBpZihub2RlLnBhcmVudC5raW5kPT09dHMuU3ludGF4S2luZC5FeHByZXNzaW9uU3RhdGVtZW50KXtcclxuICAgICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnQucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUucGFyZW50KTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnQucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3Iobm9kZS5nZXRGdWxsVGV4dCgpICsgXCJjb3VsZCBub3QgYmUgcmVtb3ZlZFwiKTtcclxuICAgIH1cclxuICAgIC8qKiBcclxuICAgICAqIG1vZGlmeSBhIG1lbWJlciBcclxuICAgICAqKi9cclxuICAgIGFkZE9yTW9kaWZ5TWVtYmVyKG1lbWJlcjogUGFyc2VkTWVtYmVyLCBwY2xhc3M6IFBhcnNlZENsYXNzKSB7XHJcbiAgICAgICAgLy9tZW1iZXIubm9kZVxyXG4gICAgICAgIC8vdmFyIG5ld21lbWJlcj10cy5jcmVhdGVQcm9wZXJ0eVxyXG4gICAgICAgIHZhciBuZXdkZWM6IHRzLkRlY29yYXRvcltdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBtZW1iZXIuZGVjb3JhdG9yKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWMgPSBtZW1iZXIuZGVjb3JhdG9yW2tleV07XHJcbiAgICAgICAgICAgIGlmICghbmV3ZGVjKVxyXG4gICAgICAgICAgICAgICAgbmV3ZGVjID0gW107XHJcbiAgICAgICAgICAgIC8vdHMuY3JlYXRlRGVjb3JhdG9yKClcclxuICAgICAgICAgICAgLy9tZW1iZXIuZGVjb3JhdG9yW2tleV0ubmFtZTtcclxuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKGRlYy5wYXJhbWV0ZXIpIHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWMucGFyYW1ldGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLnB1c2godHMuY3JlYXRlSWRlbnRpZmllcihkZWMucGFyYW1ldGVyW2ldKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNhbGwgPSB0cy5jcmVhdGVDYWxsKHRzLmNyZWF0ZUlkZW50aWZpZXIoZGVjLm5hbWUpLCB1bmRlZmluZWQsIHBhcmFtcyk7XHJcbiAgICAgICAgICAgIG5ld2RlYy5wdXNoKHRzLmNyZWF0ZURlY29yYXRvcihjYWxsKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vdmFyIHR5cGU9dHMuY3JlYXRlVHlcclxuICAgICAgICB2YXIgbmV3bWVtYmVyID0gdHMuY3JlYXRlUHJvcGVydHkobmV3ZGVjLCB1bmRlZmluZWQsIG1lbWJlci5uYW1lLCB1bmRlZmluZWQsIHRzLmNyZWF0ZVR5cGVSZWZlcmVuY2VOb2RlKG1lbWJlci50eXBlLCBbXSksIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHBjbGFzcy5tZW1iZXJzKSB7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IG1lbWJlci5uYW1lKVxyXG4gICAgICAgICAgICAgICAgbm9kZSA9IHBjbGFzcy5tZW1iZXJzW2tleV0ubm9kZVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXS5wdXNoKG5ld21lbWJlcik7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdW3Bvc10gPSBuZXdtZW1iZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBjbGFzcy5tZW1iZXJzW21lbWJlci5uYW1lXSA9IG1lbWJlcjtcclxuICAgICAgICBtZW1iZXIubm9kZSA9IG5ld21lbWJlcjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiByZW1vdmVzIHRoZSBwcm9wZXJ0eSBmcm9tIGNvZGVcclxuICAgICogQHBhcmFtIHt0eXBlfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSB0byByZW1vdmVcclxuICAgICogQHBhcmFtIHt0eXBlfSBbb25seVZhbHVlXSAtIHJlbW92ZSB0aGUgcHJvcGVydHkgb25seSBpZiB0aGUgdmFsdWUgaXMgZm91bmRcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IFt2YXJpYWJsZW5hbWVdIC0gdGhwZSBuYW1lIG9mIHRoZSB2YXJpYWJsZSAtIGRlZmF1bHQ9dGhpcy52YXJpYWJsZW5hbWVcclxuICAgICovXHJcbiAgICByZW1vdmVQcm9wZXJ0eUluQ29kZShwcm9wZXJ0eTogc3RyaW5nLCBvbmx5VmFsdWUgPSB1bmRlZmluZWQsIHZhcmlhYmxlbmFtZTogc3RyaW5nID0gdW5kZWZpbmVkKTogdHMuTm9kZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV0uY29uZmlnICE9PSB1bmRlZmluZWQgJiYgcHJvcGVydHkgPT09IFwiYWRkXCIpIHtcclxuICAgICAgICAgICAgcHJvcGVydHkgPSBcImNoaWxkcmVuXCI7XHJcbiAgICAgICAgICAgIHZhciBvbGRwYXJlbnQ6IGFueSA9IHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlTm9kZSA9IG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50c1t4XTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZU5vZGUuZ2V0VGV4dCgpID09PSBvbmx5VmFsdWUgfHwgdmFsdWVOb2RlLmdldFRleHQoKS5zdGFydHNXaXRoKG9ubHlWYWx1ZSArIFwiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZHBhcmVudC5pbml0aWFsaXplci5lbGVtZW50cy5zcGxpY2UoeCwgMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShvbGRwYXJlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVOb2RlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcDogRW50cnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChvbmx5VmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdLnZhbHVlID09PSBvbmx5VmFsdWUgfHwgdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdLnZhbHVlLnN0YXJ0c1dpdGgob25seVZhbHVlICsgXCIuXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1bMF07XHJcbiAgICAgICAgICAgIGlmIChwcm9wID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKHByb3Aubm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwcm9wLm5vZGVbXCJleHByZXNzaW9uXCJdPy5hcmd1bWVudHM/Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wLm5vZGVbXCJleHByZXNzaW9uXCJdPy5hcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3Aubm9kZTtcclxuICAgICAgICAgICAgLyp2YXIgb2xkdmFsdWUgPSB0aGlzLmxpbmVzW3Byb3AubGluZXN0YXJ0IC0gMV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwcm9wLmxpbmVzdGFydDt4IDw9IHByb3AubGluZWVuZDt4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGluZXNbeCAtIDFdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPiAxICYmIHRoaXMubGluZXNbeCAtIDJdLmVuZHNXaXRoKFwiLFwiKSkvL3R5cGUgTWU9eyBidDI/OkJ1dHRvbixcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW3ggLSAyXSA9IHRoaXMubGluZXNbeCAtIDJdLnN1YnN0cmluZygwLCB0aGlzLmxpbmVzW3ggLSAyXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgLy92YXIgdGV4dCA9IHRoaXMucGFyc2VyLmxpbmVzVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgLy90aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgICAgICAvL3RoaXMudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVtb3ZlcyB0aGUgdmFyaWFibGUgZnJvbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFybmFtZSAtIHRoZSB2YXJpYWJsZSB0byByZW1vdmVcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVmFyaWFibGVzSW5Db2RlKHZhcm5hbWVzOiBzdHJpbmdbXSkge1xyXG4gICAgICAgIHZhciBhbGxwcm9wczogRW50cnlbXSA9IFtdO1xyXG4gICAgICAgIC8vY29sbGVjdCBhbGxOb2RlcyB0byBkZWxldGVcclxuICAgICAgICBmb3IgKHZhciB2diA9IDA7IHZ2IDwgdmFybmFtZXMubGVuZ3RoOyB2disrKSB7XHJcbiAgICAgICAgICAgIHZhciB2YXJuYW1lID0gdmFybmFtZXNbdnZdO1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZGF0YVt2YXJuYW1lXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikgJiYgdGhpcy50eXBlTWVbdmFybmFtZS5zdWJzdHJpbmcoMyldICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHRoaXMudHlwZU1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXSk7XHJcbiAgICAgICAgICAgIC8vcmVtb3ZlIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3ApIHtcclxuICAgICAgICAgICAgICAgIGxldCBwcm9wcyA9IHByb3Bba2V5XTtcclxuICAgICAgICAgICAgICAgIHByb3BzLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BzID0gdGhpcy5kYXRhLm1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXTtcclxuICAgICAgICAgICAgICAgIHByb3BzPy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxscHJvcHMucHVzaChwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcmVtb3ZlIG5vZGVzXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxwcm9wcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUoYWxscHJvcHNbeF0ubm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAodmFyIHZ2ID0gMDsgdnYgPCB2YXJuYW1lcy5sZW5ndGg7IHZ2KyspIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSB2YXJuYW1lc1t2dl07XHJcblxyXG4gICAgICAgICAgICAvL3JlbW92ZSBsaW5lcyB3aGVyZSB1c2VkIGFzIHBhcmFtZXRlclxyXG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wa2V5IGluIHRoaXMuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbcHJvcGtleV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wcyA9IHByb3Bba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwID0gcHJvcHNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBwLnZhbHVlLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJhbXNbaV0gPT09IHZhcm5hbWUgfHwgcGFyYW1zW2ldID09PSBcInRoaXMuXCIgKyB2YXJuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKHAubm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9pbiBjaGlsZHJlbjpbXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluY29uZmlnID0gcHJvcFtrZXldWzBdPy5ub2RlPy5pbml0aWFsaXplcj8uZWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBpbmNvbmZpZy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNvbmZpZ1t4XS5nZXRUZXh0KCkgPT09IHZhcm5hbWUgfHwgaW5jb25maWdbeF0uZ2V0VGV4dCgpLnN0YXJ0c1dpdGgodmFybmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKGluY29uZmlnW3hdKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluY29uZmlnLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwcm9wW2tleV1bMF0/Lm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLCB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpOiB0cy5Ob2RlIHtcclxuICAgICAgICB2YXIgc2NvcGU7XHJcbiAgICAgICAgaWYoY2xhc3NzY29wZT09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZUZpbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YXJpYWJsZXNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gdGhpcy5kYXRhW3ZhcmlhYmxlc2NvcGUudmFyaWFibGVuYW1lXVt2YXJpYWJsZXNjb3BlLm1ldGhvZG5hbWVdWzBdPy5ub2RlO1xyXG4gICAgICAgICAgICBpZiAoc2NvcGUuZXhwcmVzc2lvbilcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUuZXhwcmVzc2lvbi5hcmd1bWVudHNbMF07XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gc2NvcGUuaW5pdGlhbGl6ZXI7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NzY29wZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjID0gY2xhc3NzY29wZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYy5jbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuY2xhc3Nlc1tzYy5jbGFzc25hbWVdPy5tZW1iZXJzW3NjLm1ldGhvZG5hbWVdPy5ub2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8vZXhwb3J0ZWQgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuZnVuY3Rpb25zW3NjLm1ldGhvZG5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzY29wZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmV4dCB2YXJpYWJsZW5hbWVcclxuICAgICAqICovXHJcbiAgICBnZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlOiBzdHJpbmcsIHN1Z2dlc3RlZE5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gc3VnZ2VzdGVkTmFtZTtcclxuICAgICAgICBpZiAodmFybmFtZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB2YXJuYW1lID0gdHlwZS5zcGxpdChcIi5cIilbdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV0udG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBmb3IgKHZhciBjb3VudGVyID0gMTsgY291bnRlciA8IDEwMDA7IGNvdW50ZXIrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhLm1lID09PSB1bmRlZmluZWQgfHwgdGhpcy5kYXRhLm1lW3Zhcm5hbWUgKyAoY291bnRlciA9PT0gMSA/IFwiXCIgOiBjb3VudGVyKV0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFybmFtZSArIChjb3VudGVyID09PSAxID8gXCJcIiA6IGNvdW50ZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGFuZ2Ugb2JqZWN0bGl0ZXJhbCB0byBtdXRsaWxpbmUgaWYgbmVlZGVkXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3dpdGNoVG9NdXRsaWxpbmVJZk5lZWRlZChub2RlOiB0cy5Ob2RlLCBuZXdQcm9wZXJ0eTogc3RyaW5nLCBuZXdWYWx1ZSkge1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IG5vZGUuZ2V0VGV4dCgpO1xyXG4gICAgICAgIGlmIChub2RlW1wibXVsdGlMaW5lXCJdICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHZhciBsZW4gPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wID0gbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0ucHJvcGVydGllc1t4XTtcclxuICAgICAgICAgICAgICAgIGxlbiArPSAocHJvcC5pbml0aWFsaXplci5lc2NhcGVkVGV4dCA/IHByb3AuaW5pdGlhbGl6ZXIuZXNjYXBlZFRleHQubGVuZ3RoIDogcHJvcC5pbml0aWFsaXplci5nZXRUZXh0KCkubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIGxlbiArPSBwcm9wLm5hbWUuZXNjYXBlZFRleHQubGVuZ3RoICsgNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsZW4pO1xyXG4gICAgICAgICAgICBpZiAob2xkVmFsdWUuaW5kZXhPZihcIlxcblwiKSA+IC0xIHx8IChsZW4gPiA2MCkgfHwgbmV3VmFsdWUuaW5kZXhPZihcIlxcblwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvL29yZGVyIGFsc28gb2xkIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC5wb3MgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLmxlbiA9IC0xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJhcmd1bWVudHNcIl1bMF0gPSB0cy5jcmVhdGVPYmplY3RMaXRlcmFsKG5vZGUucGFyZW50W1wiYXJndW1lbnRzXCJdWzBdLnByb3BlcnRpZXMsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBzZXRQcm9wZXJ0eUluQ29uZmlnKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgdHMuTm9kZSxcclxuICAgICAgICBpc0Z1bmN0aW9uOiBib29sZWFuID0gZmFsc2UsIHJlcGxhY2U6IGJvb2xlYW4gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgYmVmb3JlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZT99ID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIHNjb3BlOiB0cy5Ob2RlKSB7XHJcblxyXG4gICAgICAgIHZhciBzdmFsdWU6IGFueSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IDxhbnk+dGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl1bMF0ubm9kZTtcclxuICAgICAgICBjb25maWcgPSBjb25maWcuYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIHZhciBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KHByb3BlcnR5LCA8YW55PnN2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImFkZFwiICYmIHJlcGxhY2UgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJjaGlsZHJlblwiO1xyXG4gICAgICAgICAgICBzdmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgPyB0cy5jcmVhdGVJZGVudGlmaWVyKHZhbHVlICsgXCIuY29uZmlnKHt9KVwiKSA6IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjaGlsZHJlblwiXSA9PSB1bmRlZmluZWQpIHsvL1xyXG4gICAgICAgICAgICAgICAgbmV3RXhwcmVzc2lvbiA9IHRzLmNyZWF0ZVByb3BlcnR5QXNzaWdubWVudChwcm9wZXJ0eSwgdHMuY3JlYXRlQXJyYXlMaXRlcmFsKFtzdmFsdWVdLCB0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICBjb25maWcucHJvcGVydGllcy5wdXNoKG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjaGlsZHJlblwiXVswXS5ub2RlLmluaXRpYWxpemVyLmVsZW1lbnRzLnB1c2goc3ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjaGlsZHJlblwiXVswXS5ub2RlLmluaXRpYWxpemVyLmVsZW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYXJyYXkubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5W3hdLmdldFRleHQoKSA9PT0gYmVmb3JlLnZhbHVlIHx8IGFycmF5W3hdLmdldFRleHQoKS5zdGFydHNXaXRoKGJlZm9yZS52YWx1ZSArIFwiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkuc3BsaWNlKHgsIDAsIHN2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm9kZSBcIiArIGJlZm9yZS52YWx1ZSArIFwiIG5vdCBmb3VuZC5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHsgIC8vY29tcC5hZGQoYSkgLS0+IGNvbXAuY29uZmlnKHtjaGlsZHJlbjpbYV19KVxyXG4gICAgICAgICAgICBpZiAocmVwbGFjZSAhPT0gZmFsc2UgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgey8vZWRpdCBleGlzdGluZ1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBjb25maWcucHJvcGVydGllcy5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnByb3BlcnRpZXNbcG9zXSA9IG5ld0V4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvTXV0bGlsaW5lSWZOZWVkZWQoY29uZmlnLCBwcm9wZXJ0eSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLnByb3BlcnRpZXMucHVzaChuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3dpdGNoVG9NdXRsaWxpbmVJZk5lZWRlZChjb25maWcsIHByb3BlcnR5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJjb3JyZWN0IHNwYWNlc1wiKTtcclxuICAgICAgICB0aGlzLnBhcnNlKHRoaXMuZ2V0TW9kaWZpZWRDb2RlKCkpO1xyXG4gICAgICAgIC8vaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgIC8vICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcblxyXG4gICAgfVxyXG4gICAgLyogIG1vdmVQcm9wZXJ0VmFsdWVJbkNvZGUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIG5ld1ZhcmlhYmxlTmFtZTogc3RyaW5nLCBiZWZvcmVWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJhZGRcIilcclxuICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBcImNoaWxkcmVuXCI7XHJcbiAgICAgICAgICAgICAgdmFyIG9sZHBhcmVudDphbnk9dGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldWzBdLm5vZGU7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBvbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlTm9kZT1vbGRwYXJlbnQuaW5pdGlhbGl6ZXIuZWxlbWVudHNbeF07XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZU5vZGUuZ2V0VGV4dCgpID09PSB2YWx1ZSB8fHZhbHVlTm9kZS5nZXRUZXh0KCkuc3RhcnRzV2l0aCh2YWx1ZSArIFwiLlwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb2xkcGFyZW50LmluaXRpYWxpemVyLmVsZW1lbnRzLnNwbGljZSh4LDEpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICB9Ki9cclxuICAgIC8qKlxyXG4gICAgKiBtb2RpZnkgdGhlIHByb3BlcnR5IGluIGNvZGVcclxuICAgICogQHBhcmFtIHZhcmlhYmxlbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgKiBAcGFyYW0gIHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IFxyXG4gICAgKiBAcGFyYW0gdmFsdWUgLSB0aGUgbmV3IHZhbHVlXHJcbiAgICAqIEBwYXJhbSBjbGFzc3Njb3BlICAtIHRoZSBwcm9wZXJ0eSB3b3VsZCBiZSBpbnNlcnQgaW4gdGhpcyBibG9ja1xyXG4gICAgKiBAcGFyYW0gaXNGdW5jdGlvbiAgLSB0cnVlIGlmIHRoZSBwcm9wZXJ0eSBpcyBhIGZ1bmN0aW9uXHJcbiAgICAqIEBwYXJhbSBbcmVwbGFjZV0gIC0gaWYgdHJ1ZSB0aGUgb2xkIHZhbHVlIGlzIGRlbGV0ZWRcclxuICAgICogQHBhcmFtIFtiZWZvcmVdIC0gdGhlIG5ldyBwcm9wZXJ0eSBpcyBwbGFjZWQgYmVmb3JlIHRoaXMgcHJvcGVydHlcclxuICAgICogQHBhcmFtIFt2YXJpYWJsZXNjb3BlXSAtIGlmIHRoaXMgc2NvcGUgaXMgZGVmaW5lZCAtIHRoZSBuZXcgcHJvcGVydHkgd291bGQgYmUgaW5zZXJ0IGluIHRoaXMgdmFyaWFibGVcclxuICAgICovXHJcbiAgICBzZXRQcm9wZXJ0eUluQ29kZSh2YXJpYWJsZU5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IHRzLk5vZGUsXHJcbiAgICAgICAgY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSxcclxuICAgICAgICBpc0Z1bmN0aW9uOiBib29sZWFuID0gZmFsc2UsIHJlcGxhY2U6IGJvb2xlYW4gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgYmVmb3JlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZT99ID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIHZhcmlhYmxlc2NvcGU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWUgfSA9IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gPSB7fTtcclxuICAgICAgICBpZiAoY2xhc3NzY29wZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBjbGFzc3Njb3BlID0gdGhpcy5jbGFzc1Njb3BlO1xyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICB2YXIgbmV3RXhwcmVzc2lvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bXCJjb25maWdcIl0gIT09IHVuZGVmaW5lZCYmcHJvcGVydHkgIT09IFwibmV3XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUluQ29uZmlnKHZhcmlhYmxlTmFtZSwgcHJvcGVydHksIHZhbHVlLCBpc0Z1bmN0aW9uLCByZXBsYWNlLCBiZWZvcmUsIHNjb3BlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3VmFsdWU6IGFueSA9IHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIiA/IHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgICAgdmFyIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gc2NvcGVbXCJib2R5XCJdP3Njb3BlW1wiYm9keVwiXS5zdGF0ZW1lbnRzOnNjb3BlW1wic3RhdGVtZW50c1wiXTtcclxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIpIHsgLy9tZS5wYW5lbDE9bmV3IFBhbmVsKHt9KTtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcIl9uZXdfXCJdWzBdOy8vLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wLnZhbHVlO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgIHJlcGxhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IHByb3Aubm9kZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGxlZnQgPSBsZWZ0LnN1YnN0cmluZygwLCBsZWZ0LmluZGV4T2YoXCI9XCIpIC0gMSk7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJfbmV3X1wiO1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIobGVmdCksIG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUNhbGwoXHJcbiAgICAgICAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKHByb3BlcnR5PT09XCJcIj92YXJpYWJsZU5hbWU6KHZhcmlhYmxlTmFtZSArIFwiLlwiICsgcHJvcGVydHkpKSwgdW5kZWZpbmVkLCBbbmV3VmFsdWVdKSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQoXHJcbiAgICAgICAgICAgICAgICB0cy5jcmVhdGVJZGVudGlmaWVyKHByb3BlcnR5PT09XCJcIj92YXJpYWJsZU5hbWU6KHZhcmlhYmxlTmFtZSArIFwiLlwiICsgcHJvcGVydHkpKSwgbmV3VmFsdWUpKTtcclxuICAgICAgICBpZiAocmVwbGFjZSAhPT0gZmFsc2UgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgey8vZWRpdCBleGlzdGluZ1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXVtwb3NdID0gbmV3RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgLy9pZiAocG9zID49IDApXHJcbiAgICAgICAgICAgIC8vICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIHsvL2luc2VydCBuZXdcclxuICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZS52YWx1ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwibm90IGltcGxlbWVudGVkXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV0ubGVuZ3RoOyBvKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10udmFsdWUgPT09IGJlZm9yZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiUHJvcGVydHkgbm90IGZvdW5kIFwiICsgYmVmb3JlLnZhcmlhYmxlbmFtZSArIFwiLlwiICsgYmVmb3JlLnByb3BlcnR5ICsgXCIgdmFsdWUgXCIgKyBiZWZvcmUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cHJvcDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJfbmV3X1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vc2hvdWxkIGJlIGluIHRoZSBzYW1lIHNjb3BlIG9mIGRlY2xhcmF0aW9uIChpbXBvcnRhbnQgZm9yIHJlcGVhdGVyKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bMF0ubm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3Rub2RlOiB0cy5Ob2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF0ubGVuZ3RoIC0gMV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdG5vZGUucGFyZW50ID09PSBzY29wZVtcImJvZHlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wID0gdGVzdG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gbGFzdHByb3AucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGxhc3Rwcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcyArIDEsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gc3RhdGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvcyA+IDAgJiYgc3RhdGVtZW50c1tzdGF0ZW1lbnRzLmxlbmd0aCAtIDFdLmdldFRleHQoKS5zdGFydHNXaXRoKFwicmV0dXJuIFwiKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50cy5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogc3dhcHMgdHdvIHN0YXRlbWVudHMgaW5kZW5kaWZpZWQgYnkgIGZ1bmN0aW9ucGFyYW1ldGVyIGluIGEgdmFyaWFibGUucHJvcGVydHkocGFyYW1ldGVyMSkgd2l0aCB2YXJpYWJsZS5wcm9wZXJ0eShwYXJhbWV0ZXIyKVxyXG4gICAgICoqL1xyXG4gICAgc3dhcFByb3BlcnR5V2l0aFBhcmFtZXRlcih2YXJpYWJsZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCBwYXJhbWV0ZXIxOiBzdHJpbmcsIHBhcmFtZXRlcjI6IHN0cmluZykge1xyXG4gICAgICAgIHZhciBmaXJzdDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc2Vjb25kOiB0cy5Ob2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBwYXJlbnQgPSB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XTtcclxuICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVdW1wiY29uZmlnXCJdJiZwcm9wZXJ0eT09PVwiYWRkXCIpe1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW49KDxhbnk+dGhpcy5kYXRhW3ZhcmlhYmxlXVtcImNoaWxkcmVuXCJdWzBdLm5vZGUpLmluaXRpYWxpemVyLmVsZW1lbnRzO1xyXG4gICAgICAgICAgICB2YXIgaWZpcnN0O1xyXG4gICAgICAgICAgICB2YXIgaXNlY29uZDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvcih2YXIgeD0wO3g8Y2hpbGRyZW4ubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dD1jaGlsZHJlblt4XS5nZXRUZXh0KClcclxuICAgICAgICAgICAgICAgIGlmKHRleHQ9PT1wYXJhbWV0ZXIxfHx0ZXh0LnN0YXJ0c1dpdGgocGFyYW1ldGVyMStcIi5jb25maWdcIikpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmaXJzdD14O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYodGV4dD09PXBhcmFtZXRlcjJ8fHRleHQuc3RhcnRzV2l0aChwYXJhbWV0ZXIyK1wiLmNvbmZpZ1wiKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNlY29uZD14O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB0ZW1wPWNoaWxkcmVuW2lmaXJzdF07XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2lmaXJzdF09Y2hpbGRyZW5baXNlY29uZF07XHJcbiAgICAgICAgICAgIGNoaWxkcmVuW2lzZWNvbmRdPXRlbXA7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJlbnQubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFt4XS52YWx1ZS5zcGxpdChcIixcIilbMF0udHJpbSgpID09PSBwYXJhbWV0ZXIxKVxyXG4gICAgICAgICAgICAgICAgZmlyc3QgPSBwYXJlbnRbeF0ubm9kZTtcclxuICAgICAgICAgICAgaWYgKHBhcmVudFt4XS52YWx1ZS5zcGxpdChcIixcIilbMF0udHJpbSgpID09PSBwYXJhbWV0ZXIyKVxyXG4gICAgICAgICAgICAgICAgc2Vjb25kID0gcGFyZW50W3hdLm5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZmlyc3QpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiUGFyYW1ldGVyIG5vdCBmb3VuZCBcIiArIHBhcmFtZXRlcjEpO1xyXG4gICAgICAgIGlmICghc2Vjb25kKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlBhcmFtZXRlciBub3QgZm91bmQgXCIgKyBwYXJhbWV0ZXIyKTtcclxuICAgICAgICB2YXIgaWZpcnN0ID0gZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGZpcnN0KTtcclxuICAgICAgICB2YXIgaXNlY29uZCA9IHNlY29uZC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yoc2Vjb25kKTtcclxuICAgICAgICBmaXJzdC5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdW2lmaXJzdF0gPSBzZWNvbmQ7XHJcbiAgICAgICAgZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXVtpc2Vjb25kXSA9IGZpcnN0O1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogYWRkcyBhbiBQcm9wZXJ0eVxyXG4gICAgKiBAcGFyYW0gdHlwZSAtIG5hbWUgb2YgdGhlIHR5cGUgbyBjcmVhdGVcclxuICAgICogQHBhcmFtIGNsYXNzc2NvcGUgLSB0aGUgc2NvcGUgKG1ldGhvZG5hbWUpIHdoZXJlIHRoZSB2YXJpYWJsZSBzaG91bGQgYmUgaW5zZXJ0IENsYXNzLmxheW91dFxyXG4gICAgKiBAcGFyYW0gdmFyaWFibGVzY29wZSAtIHRoZSBzY29wZSB3aGVyZSB0aGUgdmFyaWFibGUgc2hvdWxkIGJlIGluc2VydCBlLmcuIGhhbGxvLm9uY2xpY2tcclxuICAgICogQHJldHVybnMgIHRoZSBuYW1lIG9mIHRoZSBvYmplY3RcclxuICAgICovXHJcbiAgICBhZGRWYXJpYWJsZUluQ29kZShmdWxsdHlwZTogc3RyaW5nLCBjbGFzc3Njb3BlOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdLCB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQsIHN1Z2dlc3RlZE5hbWUgPSB1bmRlZmluZWQpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChjbGFzc3Njb3BlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIGNsYXNzc2NvcGUgPSB0aGlzLmNsYXNzU2NvcGU7XHJcbiAgICAgICAgbGV0IHR5cGUgPSBmdWxsdHlwZS5zcGxpdChcIi5cIilbZnVsbHR5cGUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciB2YXJuYW1lID0gdGhpcy5nZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlLCBzdWdnZXN0ZWROYW1lKTtcclxuICAgICAgICB2YXIgdXNlTWUgPSBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW1wibWVcIl0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdXNlTWUgPSB0cnVlO1xyXG4gICAgICAgIC8vdmFyIGlmKHNjb3BlbmFtZSlcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBpZiAobm9kZT8ucGFyYW1ldGVycz8ubGVuZ3RoID4gMCAmJiBub2RlLnBhcmFtZXRlcnNbMF0ubmFtZS50ZXh0ID09IFwibWVcIikge1xyXG4gICAgICAgICAgICB1c2VNZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcmVmaXggPSB1c2VNZSA/IFwibWUuXCIgOiBcInZhciBcIjtcclxuICAgICAgICBpZiAobm9kZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIm5vIHNjb3BlIHRvIGluc2VydCBhIHZhcmlhYmxlIGNvdWxkIGJlIGZvdW5kXCIpO1xyXG4gICAgICAgXHJcbiAgICAgICAgdmFyIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gbm9kZVtcImJvZHlcIl0/bm9kZVtcImJvZHlcIl0uc3RhdGVtZW50czpub2RlW1wic3RhdGVtZW50c1wiXTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHN0YXRlbWVudHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKCFzdGF0ZW1lbnRzW3hdLmdldFRleHQoKS5zcGxpdChcIlxcblwiKVswXS5pbmNsdWRlcyhcIm5ldyBcIikgJiYgIXN0YXRlbWVudHNbeF0uZ2V0VGV4dCgpLnNwbGl0KFwiXFxuXCIpWzBdLmluY2x1ZGVzKFwidmFyIFwiKSlcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYXNzID0gdHMuY3JlYXRlQXNzaWdubWVudCh0cy5jcmVhdGVJZGVudGlmaWVyKHByZWZpeCArIHZhcm5hbWUpLCB0cy5jcmVhdGVJZGVudGlmaWVyKFwibmV3IFwiICsgdHlwZSArIFwiKClcIikpO1xyXG4gICAgICAgIHN0YXRlbWVudHMuc3BsaWNlKHgsIDAsIHRzLmNyZWF0ZVN0YXRlbWVudChhc3MpKTtcclxuICAgICAgICBpZiAodXNlTWUpXHJcbiAgICAgICAgICAgIHRoaXMuYWRkVHlwZU1lKHZhcm5hbWUsIHR5cGUpO1xyXG4gICAgICAgIHJldHVybiAodXNlTWUgPyBcIm1lLlwiIDogXCJcIikgKyB2YXJuYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdHModDpUZXN0KXtcclxuICAgIGZ1bmN0aW9uIGNsZWFuKHM6c3RyaW5nKTpzdHJpbmd7XHJcbiAgICAgICAgcmV0dXJuIHMucmVwbGFjZUFsbChcIlxcdFwiLFwiXCIpLnJlcGxhY2VBbGwoXCJcXHJcIixcIlwiKS5yZXBsYWNlQWxsKFwiXFxuXCIsXCJcIilcclxuICAgIH1cclxuICAgIGF3YWl0IHR5cGVzY3JpcHQud2FpdEZvckluaXRlZDtcclxuICAgIHZhciBwYXJzZXI9bmV3IFBhcnNlcigpO1xyXG4gICAgcGFyc2VyLnBhcnNlKFwidmFyIGo7ai5jb25maWcoe2NoaWxkcmVuOlthLGIsY119KVwiKTtcclxuICAgIHBhcnNlci5zd2FwUHJvcGVydHlXaXRoUGFyYW1ldGVyKFwialwiLFwiYWRkXCIsXCJjXCIsXCJhXCIpO1xyXG4gICAgdC5leHBlY3RFcXVhbChjbGVhbihwYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCkpPT09J3ZhciBqO2ouY29uZmlnKHsgY2hpbGRyZW46IFtjLCBiLCBhXSB9KTsnKTtcclxuICAgIHBhcnNlci5wYXJzZShcInZhciBqO2ouYWRkKGEpO2ouYWRkKGIpO2ouYWRkKGMpO1wiKTtcclxuICAgIHBhcnNlci5zd2FwUHJvcGVydHlXaXRoUGFyYW1ldGVyKFwialwiLFwiYWRkXCIsXCJjXCIsXCJhXCIpO1xyXG4gICAgdC5leHBlY3RFcXVhbChjbGVhbihwYXJzZXIuZ2V0TW9kaWZpZWRDb2RlKCkpPT09J3ZhciBqO2ouYWRkKGMpO2ouYWRkKGIpO2ouYWRkKGEpOycpO1xyXG4gICBcclxuICAgIFxyXG4gICAgcGFyc2VyLnBhcnNlKFwiY2xhc3MgQXt9XCIpO1xyXG4gICAgdC5leHBlY3RFcXVhbChwYXJzZXIuY2xhc3Nlcy5BIT09dW5kZWZpbmVkKTtcclxuICAgIHBhcnNlci5wYXJzZShcInZhciBhPTg7XCIpO1xyXG4gICAgdC5leHBlY3RFcXVhbChwYXJzZXIuZGF0YS5hIT09dW5kZWZpbmVkKTtcclxuICAgIHBhcnNlci5wYXJzZShcImI9ODtcIik7XHJcbiAgICB0LmV4cGVjdEVxdWFsKHBhcnNlci5kYXRhLmIhPT11bmRlZmluZWQpO1xyXG4gICAgcGFyc2VyLnBhcnNlKFwiYj04XCIsW3tjbGFzc25hbWU6dW5kZWZpbmVkLG1ldGhvZG5hbWU6XCJ0ZXN0XCJ9XSk7XHJcbiAgICB0LmV4cGVjdEVxdWFsKHBhcnNlci5kYXRhLmI9PT11bmRlZmluZWQpO1xyXG4gICAgdmFyIHNjb3BlPVt7Y2xhc3NuYW1lOnVuZGVmaW5lZCxtZXRob2RuYW1lOlwidGVzdFwifV07XHJcbiAgICBwYXJzZXIucGFyc2UoXCJmdW5jdGlvbiB0ZXN0KCl7Yj04O31cIixzY29wZSk7XHJcbiAgICB0LmV4cGVjdEVxdWFsKHBhcnNlci5kYXRhLmIhPT11bmRlZmluZWQpO1xyXG4gICAgXHJcbiAgICBwYXJzZXIuYWRkVmFyaWFibGVJbkNvZGUoXCJNeUNsYXNzXCIsc2NvcGUpO1xyXG4gICAgcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwibXljbGFzc1wiLFwiYVwiLFwiOVwiLHNjb3BlKTtcclxuICAgIHQuZXhwZWN0RXF1YWwoY2xlYW4ocGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpKT09PVwiZnVuY3Rpb24gdGVzdCgpIHsgdmFyIG15Y2xhc3MgPSBuZXcgTXlDbGFzcygpOyBiID0gODsgbXljbGFzcy5hID0gOTsgfVwiKTtcclxuICAgIFxyXG4gICAgcGFyc2VyPW5ldyBQYXJzZXIoKTtcclxuICAgIHBhcnNlci5wYXJzZShcIlwiKTtcclxuICAgIHBhcnNlci5hZGRWYXJpYWJsZUluQ29kZShcIk15Q2xhc3NcIix1bmRlZmluZWQpO1xyXG4gICAgcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwibXljbGFzc1wiLFwiYVwiLFwiOVwiLHVuZGVmaW5lZCk7XHJcbiAgICB0LmV4cGVjdEVxdWFsKGNsZWFuKHBhcnNlci5nZXRNb2RpZmllZENvZGUoKSk9PT1cInZhciBteWNsYXNzID0gbmV3IE15Q2xhc3MoKTtteWNsYXNzLmEgPSA5O1wiKTtcclxuXHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB0ZXN0cyhuZXcgVGVzdCgpKTtcclxuICAgXHJcbiAgICBhd2FpdCB0eXBlc2NyaXB0LndhaXRGb3JJbml0ZWQ7XHJcbiAgICB2YXIgY29kZSA9IHR5cGVzY3JpcHQuZ2V0Q29kZShcImRlbW8vRGlhbG9nMi50c1wiKTtcclxuICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgICAvLyBjb2RlID0gXCJmdW5jdGlvbiB0ZXN0KCl7IHZhciBoYWxsbz17fTt2YXIgaDI9e307dmFyIHBwcD17fTtoYWxsby5wPTk7aGFsbG8uY29uZmlnKHthOjEsYjoyLCBrOmgyLmNvbmZpZyh7YzoxLGo6cHBwLmNvbmZpZyh7cHA6OX0pfSkgICAgIH0pOyB9XCI7XHJcbiAgICAvLyBjb2RlID0gXCJmdW5jdGlvbih0ZXN0KXsgdmFyIGhhbGxvPXt9O3ZhciBoMj17fTt2YXIgcHBwPXt9O2hhbGxvLnA9OTtoYWxsby5jb25maWcoe2E6MSxiOjIsIGs6aDIuY29uZmlnKHtjOjF9LGooKXtqMi51ZG89OX0pICAgICB9KTsgfVwiO1xyXG4gICAgLy8gY29kZSA9IFwiZnVuY3Rpb24gdGVzdCgpe3ZhciBwcHA7dmFyIGFhYT1uZXcgQnV0dG9uKCk7cHBwLmNvbmZpZyh7YTpbOSw2XSwgIGNoaWxkcmVuOltsbC5jb25maWcoe30pLGFhYS5jb25maWcoe3U6MSxvOjIsY2hpbGRyZW46W2trLmNvbmZpZyh7fSldfSldfSk7fVwiO1xyXG4gICAgLy9wYXJzZXIucGFyc2UoY29kZSwgdW5kZWZpbmVkKTtcclxuICAgIC8vY29kZT1cInJlcG9ydGRlc2lnbj17azo5fTtcIjtcclxuICAgIFxyXG4gICAgcGFyc2VyLnBhcnNlKGNvZGUsW3sgY2xhc3NuYW1lOiBcIkRpYWxvZzJcIiwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9XSk7Ly8gW3sgY2xhc3NuYW1lOiBcIlRlc3REaWFsb2dCaW5kZXJcIiwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9XSk7XHJcbiBcclxuICAgIHBhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcIm1lLnRhYmxlXCIsXCJuZXdcIiwnbmV3IFRhYmxlKHtcXG4gICAgICBwYWdpbmF0aW9uU2l6ZTogMVxcbn0pJyx1bmRlZmluZWQpO1xyXG4gICAgY29uc29sZS5sb2cocGFyc2VyLmdldE1vZGlmaWVkQ29kZSgpKTtcclxuICAgLy8gcGFyc2VyLnJlbW92ZVZhcmlhYmxlc0luQ29kZShbXCJtZS5yZXBlYXRlclwiXSk7XHJcbiAgICAvL3BhcnNlci5hZGRWYXJpYWJsZUluQ29kZShcIkNvbXBvbmVudFwiLCBbeyBjbGFzc25hbWU6IFwiRGlhbG9nXCIsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfV0pO1xyXG4gICAgLy9wYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJjb21wb25lbnRcIiwgXCJ4XCIsIFwiMVwiLCBbeyBjbGFzc25hbWU6IFwiRGlhbG9nXCIsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfV0pO1xyXG4gICAgXHJcbiAgICAvLyB2YXIgbm9kZSA9IHBhcnNlci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBcIm1lLnRleHRib3gxXCIsIFwibWUucGFuZWwxXCIpO1xyXG4gICAgLy8gcGFyc2VyLnNldFByb3BlcnR5SW5Db2RlKFwidGhpc1wiLFwiYWRkXCIsbm9kZSxbe2NsYXNzbmFtZTpcIkRpYWxvZ1wiLG1ldGhvZG5hbWU6XCJsYXlvdXRcIn1dLHRydWUsZmFsc2UpO1xyXG4gICAgLy92YXIgbm9kZSA9IHBhcnNlci5yZW1vdmVQcm9wZXJ0eUluQ29kZShcImFkZFwiLCBcImtrXCIsIFwiYWFhXCIpO1xyXG5cclxuICAgIC8vdmFyIG5vZGU9cGFyc2VyLnJlbW92ZVByb3BlcnR5SW5Db2RlKFwiYWRkXCIsIFwibGxcIiwgXCJwcHBcIik7XHJcbiAgICAvL3BhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcImFhYVwiLFwiYWRkXCIsbm9kZSxbe2NsYXNzbmFtZTp1bmRlZmluZWQsIG1ldGhvZG5hbWU6XCJ0ZXN0XCJ9XSx0cnVlLGZhbHNlLHVuZGVmaW5lZCx1bmRlZmluZWQpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhub2RlLmdldFRleHQoKSk7XHJcbiAgICAvLyAgICBwYXJzZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJwcHBcIixcImFkZFwiLFwiY2NcIixbe2NsYXNzbmFtZTp1bmRlZmluZWQsIG1ldGhvZG5hbWU6XCJ0ZXN0XCJ9XSx0cnVlLGZhbHNlLHt2YXJpYWJsZW5hbWU6XCJwcHBcIixwcm9wZXJ0eTpcImFkZFwiLHZhbHVlOlwibGxcIn0pO1xyXG4gICAgLy8gIHBhcnNlci5zZXRQcm9wZXJ0eUluQ29kZShcImFhYVwiLFwiYWRkXCIsXCJjY1wiLFt7Y2xhc3NuYW1lOnVuZGVmaW5lZCwgbWV0aG9kbmFtZTpcInRlc3RcIn1dLHRydWUsZmFsc2Use3ZhcmlhYmxlbmFtZTpcImFhYVwiLHByb3BlcnR5OlwiYWRkXCIsdmFsdWU6XCJra1wifSk7XHJcblxyXG4gICAgLy8gZGVidWdnZXI7XHJcbiAgICAvKiAgY29uc3QgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoeyBuZXdMaW5lOiB0cy5OZXdMaW5lS2luZC5MaW5lRmVlZCB9KTtcclxuICAgICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCBmYWxzZSwgdHMuU2NyaXB0S2luZC5UUyk7XHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCBwYXJzZXIuc291cmNlRmlsZSwgcmVzdWx0RmlsZSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7Ki9cclxuXHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG4iXX0=