var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs_editor/util/Typescript"], function (require, exports, Registry_1, Classes_1, Typescript_1) {
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
            this.isJSX = false;
            this.sourceFile = undefined;
            this.refs = {};
            this.classes = {};
            this.imports = {};
            this.functions = {};
            this.variables = {};
            this.data = {};
            /** {[string]} - all code lines*/
        }
        getModifiedCode() {
            const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
            const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, this.isJSX ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
            var result = printer.printNode(ts.EmitHint.Unspecified, this.sourceFile, resultFile);
            result = this.reformatCode(result);
            return result;
        }
        updateCode() {
            //nothing
        }
        reformatCode(code) {
            const serviceHost = {
                getScriptFileNames: () => [],
                getScriptVersion: fileName => "1.0",
                getScriptSnapshot: fileName => {
                    return ts.ScriptSnapshot.fromString(code);
                },
                getCurrentDirectory: () => "",
                getCompilationSettings: () => ({}),
                getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
                fileExists: (a) => false,
                readFile: (a) => code,
                readDirectory: (a) => []
            };
            var file = this.variabelStack ? "tempdoc.tsx" : "tempdoc.ts";
            const languageService = ts.createLanguageService(serviceHost, ts.createDocumentRegistry());
            const textChanges = languageService.getFormattingEditsForDocument(file, {
                convertTabsToSpaces: true,
                //  indentMultiLineObjectLiteralBeginningOnBlankLine:true,
                // PlaceOpenBraceOnNewLineForFunctions:true,
                //   insertSpaceAfterCommaDelimiter: true,
                //  insertSpaceAfterKeywordsInControlFlowStatements: true,
                // insertSpaceBeforeAndAfterBinaryOperators: true,
                newLineCharacter: "\n",
                indentStyle: ts.IndentStyle.Smart,
                indentSize: 4,
                tabSize: 4
            });
            let finalText = code;
            var arr = textChanges.sort((a, b) => b.span.start - a.span.start);
            for (var x = 0; x < arr.length; x++) {
                var textChange = arr[x];
                const { span } = textChange;
                finalText = finalText.slice(0, span.start) + textChange.newText
                    + finalText.slice(span.start + span.length);
            }
            return finalText;
        }
        /**
         * add a property
         * @param {string} variable - name of the variable
         * @param {string} property - name of the property
         * @param {string} value  - code - the value
         * @param node - the node of the statement
         */
        add(variable, property, value, node, isFunction = false, trim = true, isJc = false) {
            var ret;
            if (value === undefined || value === null)
                return;
            if (trim && (typeof value === "string"))
                value = value.trim();
            property = property.trim();
            if (this.data[variable] === undefined) {
                this.data[variable] = {};
            }
            if (this.data[variable][property] === undefined) {
                this.data[variable][property] = [];
            }
            if (Array.isArray(this.data[variable][property])) {
                ret = {
                    value: value,
                    node: node,
                    isFunction,
                    isJc: isJc
                };
                this.data[variable][property].push(ret);
            }
            return ret;
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
        addRef(name, type) {
            if (!this.refsNode)
                return;
            var tp = ts.factory.createTypeReferenceNode(type, []);
            var newnode = ts.factory.createPropertySignature(undefined, name + "?", undefined, tp);
            //@ts-ignore
            newnode.parent = this.refsNode;
            this.refs[name] = { node: newnode, value: type, isFunction: false };
            this.refsNode["members"].push(newnode);
        }
        /**
         * add import {name} from file
         * @param name
         * @param file
         */
        addImportIfNeeded(name, file) {
            if (this.imports[name] === undefined) {
                //@ts-ignore
                //            var imp = ts.createNamedImports([ts.createImportSpecifier(false, undefined, ts.createIdentifier(name))]);
                const importNode = ts.factory.createImportDeclaration(undefined, ts.factory.createImportClause(false, ts.factory.createIdentifier("{" + name + "}"), undefined), ts.factory.createIdentifier("\"" + file + "\""));
                this.sourceFile = ts.factory.updateSourceFile(this.sourceFile, [importNode, ...this.sourceFile.statements]);
                this.imports[name] = file;
            }
        }
        parseRefsNode(node) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.TypeLiteral) {
                if (node["members"])
                    this.refsNode = node;
                node["members"].forEach(function (tnode) {
                    if (tnode.name) {
                        var name = tnode.name.text;
                        var stype = tnode.type.typeName.text;
                        _this.refs[name] = { node: tnode, value: stype, isFunction: false };
                    }
                    //            this.add("me", name, "typedeclaration:" + stype, undefined, aline, aline);
                });
            }
            node.getChildren().forEach(c => this.parseRefsNode(c));
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
                if (node["modifiers"] !== undefined) {
                    for (var m = 0; m < node["modifiers"].length; m++) {
                        var nd = node["modifiers"][m];
                        if (nd.kind === ts.SyntaxKind.Decorator) {
                            var parsedDec = this.parseDecorator(nd);
                            parsedClass.decorator[parsedDec.name] = parsedDec;
                            if (parsedClass.decorator["$Class"] && parsedDec.parameter.length > 0)
                                parsedClass.fullClassname = parsedDec.parameter[0].replaceAll('"', "");
                        }
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
                            var nd2 = parsedClass.members[col.methodname].node;
                            this.parseProperties(nd2);
                        }
                    }
                }
                else if (this.classScope === undefined) {
                    for (var key in parsedClass.members) {
                        this.parseProperties(parsedClass.members[key].node);
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
        parseJC(node, parent = undefined) {
            var _a, _b, _c;
            var nd = node;
            var element = node;
            var diff = node.expression.getFullText().length - node.expression.getText().length + "jc".length;
            if (this.variabelStack === undefined) {
                console.error("this.variabelStack undefined");
                return;
            }
            var jsx = this.variabelStack[element.pos + diff];
            /*        if (jsx === undefined)
                        jsx = this.variabelStack[element.pos];
                    if (jsx === undefined)
                        jsx = this.variabelStack[element.pos + 1];*/
            if (jsx && node.arguments.length > 0) {
                var tagname = node.arguments[0].getFullText();
                //find varname
                jsx.autoGenerated = true;
                if (node.arguments.length > 1) {
                    props = node.arguments[1];
                    for (var x = 0; x < props.properties.length; x++) {
                        var prop = props.properties[x];
                        if (prop.name.text === "ref") {
                            var val = prop["initializer"].getText();
                            if (prop.name.text === "children")
                                children = prop;
                            //if (val.startsWith("{") && val.endsWith("}"))
                            //   val = val.substring(1, val.length - 1);
                            if (val.startsWith("this."))
                                val = val.substring(5);
                            if (val.startsWith("refs."))
                                val = val.substring(5);
                            jsx.name = val;
                            jsx.autoGenerated = false;
                        }
                    }
                }
                if (jsx.autoGenerated)
                    jsx.name = this.getNextVariableNameForType(jsx.name);
                this.variabelStack[jsx.name] = jsx;
                nd["jname"] = jsx.name;
                var toAdd = this.add(jsx.name, "_new_", nd.getFullText(this.sourceFile), node, false, false, true);
                toAdd.className = tagname;
                var props;
                var children;
                if (jsx && node.arguments.length > 1) {
                    props = node.arguments[1];
                    for (var x = 0; x < props.properties.length; x++) {
                        var prop = props.properties[x];
                        var val = prop["initializer"].getText();
                        if (prop.name.text === "children")
                            children = prop;
                        //if (val.startsWith("{") && val.endsWith("}"))
                        //  val = val.substring(1, val.length - 1);
                        var sname = prop.name.text;
                        if (sname === "children")
                            sname = "add";
                        this.add(jsx.name, sname, val, prop, false, false, true);
                    }
                }
                if (jsx.component.constructor.name === 'HTMLComponent') {
                    this.add(jsx.name, "tag", tagname, undefined, false, false, true);
                }
                if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.jname) !== undefined) {
                    this.add((_b = node.parent) === null || _b === void 0 ? void 0 : _b.jname, "add", jsx.name, node, false, false, true);
                }
                if ((_c = children === null || children === void 0 ? void 0 : children.initializer) === null || _c === void 0 ? void 0 : _c.elements) {
                    for (var x = 0; x < children.initializer.elements.length; x++) {
                        var ch = children.initializer.elements[x];
                        if (ch.kind === ts.SyntaxKind.StringLiteral) {
                            var varname = this.getNextVariableNameForType("text", "text");
                            this.variabelStack[varname] = {
                                component: jsx.component.dom.childNodes[x]._this
                            };
                            //this.variabelStack[0];
                            var stext = JSON.stringify(ch.text);
                            var toAdd = this.add(varname, "_new_", stext, ch, false, false, true);
                            toAdd.className = "TextComponent";
                            this.variabelStack[varname] = ch;
                            this.add(varname, "text", stext, ch, false, false, true);
                            //if ((<any>node.parent)?.jname !== undefined) {
                            this.add(jsx.name, "add", varname, ch, false, false, true);
                            // }
                            var chvar = {
                                pos: ch.pos,
                                component: this.variabelStack[jsx.name].component._components[x],
                                name: varname
                            };
                            this.variabelStack[varname] = chvar;
                            this.variabelStack.__orginalarray__.push(chvar);
                        }
                        else {
                            // debugger;
                            this.parseProperties(ch);
                            // this.parseJC(ch, {});// consumeProperties)
                        }
                    }
                }
            }
        }
        parseJSX(_this, node) {
            var _a, _b;
            var nd = node;
            var element = nd;
            if (nd.openingElement)
                element = nd.openingElement;
            var jsx = _this.variabelStack[element.pos - 1];
            if (jsx === undefined)
                jsx = _this.variabelStack[element.pos];
            if (jsx === undefined)
                jsx = _this.variabelStack[element.pos + 1];
            if (jsx) {
                jsx.autoGenerated = true;
                for (var x = 0; x < element.attributes.properties.length; x++) {
                    var prop = element.attributes.properties[x];
                    if (prop.name.text === "ref") {
                        var val = prop["initializer"].getText();
                        if (val.startsWith("{") && val.endsWith("}"))
                            val = val.substring(1, val.length - 1);
                        if (val.startsWith("this."))
                            val = val.substring(5);
                        if (val.startsWith("refs."))
                            val = val.substring(5);
                        jsx.name = val;
                        jsx.autoGenerated = false;
                    }
                }
                var tagname = element.tagName.getText();
                if (jsx.autoGenerated)
                    jsx.name = this.getNextVariableNameForType(jsx.name);
                _this.variabelStack[jsx.name] = jsx;
                nd["jname"] = jsx.name;
                var toAdd = _this.add(jsx.name, "_new_", nd.getFullText(this.sourceFile), node);
                toAdd.className = tagname;
                for (var x = 0; x < element.attributes.properties.length; x++) {
                    var prop = element.attributes.properties[x];
                    var val = prop["initializer"].getText();
                    if (val.startsWith("{") && val.endsWith("}"))
                        val = val.substring(1, val.length - 1);
                    _this.add(jsx.name, prop.name.text, val, prop);
                }
                if (jsx.component.constructor.name === 'HTMLComponent') {
                    _this.add(jsx.name, "tag", '"' + tagname + '"', undefined);
                }
                if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.jname) !== undefined) {
                    _this.add((_b = node.parent) === null || _b === void 0 ? void 0 : _b.jname, "add", jsx.name, node);
                }
                //node.getChildren().forEach(c => _this.visitNode(c, consumeProperties));
                //mark textnodes
                var counttrivial = 0;
                if (nd.children) {
                    for (var x = 0; x < nd.children.length; x++) {
                        var ch = nd.children[x];
                        if (ch.kind === ts.SyntaxKind.JsxText) {
                            if (ch.containsOnlyTriviaWhiteSpaces) {
                                counttrivial++;
                            }
                            else {
                                var njsx = _this.variabelStack[ch.pos - 1];
                                if (njsx === undefined)
                                    njsx = _this.variabelStack[ch.pos];
                                if (njsx === undefined)
                                    njsx = _this.variabelStack[ch.pos + 1];
                                if (njsx) {
                                }
                                var varname = this.getNextVariableNameForType("text", "text");
                                var stext = JSON.stringify(ch.text);
                                var toAdd = _this.add(varname, "_new_", stext, ch, false, false);
                                toAdd.className = "HTMLTextComponent";
                                _this.variabelStack[varname] = ch;
                                _this.add(varname, "text", stext, ch, false, false);
                                //if ((<any>node.parent)?.jname !== undefined) {
                                _this.add(jsx.name, "add", varname, ch);
                                // }
                                var chvar = {
                                    pos: ch.pos,
                                    component: _this.variabelStack[jsx.name].component._components[x - counttrivial],
                                    name: varname
                                };
                                _this.variabelStack[varname] = chvar;
                                this.variabelStack.__orginalarray__.push(chvar);
                            }
                        }
                        else {
                            _this.visitNodeJSX(ch, {}); // consumeProperties)
                        }
                    }
                }
            }
            //        console.log(nd.openingElement.getText(this.sourceFile));
        }
        parseProperties(node) {
            var _this = this;
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
                    if (left === "jc") {
                        this.parseJC(node);
                        return;
                    }
                    var params = [];
                    node.arguments.forEach((arg) => {
                        var _a, _b;
                        params.push(arg.getText());
                        if (((_b = (_a = arg === null || arg === void 0 ? void 0 : arg.expression) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.getText()) === "config") {
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
                node.getChildren().forEach(c => _this.visitNode(c, true));
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
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Refs") {
                this.parseRefsNode(node);
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
                else if (this.variabelStack === undefined)
                    consumeProperties = true;
            }
            if (node.kind === ts.SyntaxKind.JsxElement) {
                _this.parseJSX(_this, node);
                return;
            }
            if (consumeProperties)
                this.parseProperties(node);
            else
                node.getChildren().forEach(c => _this.visitNode(c, consumeProperties));
            //TODO remove this block
            /*  if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                  this.add(node["name"].text, "", "", undefined);
              }*/
        }
        visitNodeJSX(node, consumeProperties = undefined) {
            var _this = this;
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
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Refs") {
                this.parseRefsNode(node);
                return;
            }
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Me") {
                this.parseRefsNode(node);
                return;
            }
            if (node.kind === ts.SyntaxKind.JsxElement || node.kind === ts.SyntaxKind.JsxSelfClosingElement) {
                _this.parseJSX(_this, node);
                return;
            }
            node.getChildren().forEach(c => _this.visitNodeJSX(c, consumeProperties));
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
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true, this.isJSX ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
            return this.searchClassnode(this.sourceFile, pos);
            //return this.parseold(code,onlyfunction);
        }
        removePos(node) {
            var _this = this;
            //@ts-ignore
            node.pos = -1;
            //@ts-ignore
            node.end = -1;
            node.forEachChild((ch) => _this.removePos(ch));
        }
        createNode(code, completeStatement = false) {
            var ret = ts.createSourceFile('dummytemp.ts', code, ts.ScriptTarget.ES5, true, this.isJSX ? ts.ScriptKind.TSX : undefined);
            if (completeStatement)
                return ret.statements[0];
            var node = ret.statements[0].expression;
            this.removePos(node);
            return node;
            //return this.parseold(code,onlyfunction);
        }
        initvariabelStack(values) {
            var autovars = {};
            var jsxvars = {};
            for (var x = 0; x < values.length; x++) {
                var v = values[x].component;
                var tag = v.tag === undefined ? v.constructor.name : v.tag;
                if (autovars[tag] === undefined)
                    autovars[tag] = 1;
                values[x].name = this.getNextVariableNameForType(tag); //tag + (autovars[tag]++);
                this.data[values[x].name] = {}; //reserve variable
                jsxvars[values[x].pos] = values[x];
            }
            this.variabelStack = jsxvars;
            this.variabelStack.__orginalarray__ = values;
        }
        /**
        * parse the code
        * @param {string} code - the code
        * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
        */
        parse(code, classScope = undefined, variabelStack = undefined, isJSX = false) {
            this.data = {};
            this.isJSX = isJSX;
            this.code = code;
            if (classScope !== undefined)
                this.classScope = classScope;
            else
                classScope = this.classScope;
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true, isJSX ? ts.ScriptKind.TSX : undefined);
            if (variabelStack)
                this.initvariabelStack(variabelStack);
            if (isJSX) {
                this.visitNodeJSX(this.sourceFile, false);
                return;
            }
            //    if (this.classScope === undefined)
            this.visitNode(this.sourceFile, true);
            //  else
            //    this.visitNode(this.sourceFile);
            //return this.parseold(code,onlyfunction);
        }
        removeNode(node) {
            var _a, _b, _c;
            if (node.parent === undefined)
                return;
            if (node.parent["statements"]) {
                var pos = node.parent["statements"].indexOf(node);
                if (pos >= 0)
                    node.parent["statements"].splice(pos, 1);
            }
            else if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent) && ((_b = node.parent) === null || _b === void 0 ? void 0 : _b.parent["type"]) !== undefined) {
                var pos = node.parent.parent["type"]["members"].indexOf(node);
                if (pos >= 0)
                    (_c = node.parent) === null || _c === void 0 ? void 0 : _c.parent["type"]["members"].splice(pos, 1);
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
            else if (node.parent["children"]) {
                var pos = node.parent["children"].indexOf(node);
                if (pos >= 0)
                    node.parent["children"].splice(pos, 1);
            }
            else
                throw Error(node.getFullText() + "could not be removed");
        }
        renameVariable(oldName, newName) {
            debugger;
            var autoName = false;
            var className = this.data[oldName]["_new_"][0].className;
            if (newName === "") {
                autoName = true;
                newName = this.getNextVariableNameForType(className.startsWith("\"") ? className.substring(1, className.length - 1) : className);
                //this.data[oldName]["_new_"][0].n
                // this.data[oldName]["_new_"][0].autoGenerated
            }
            this.data[newName] = this.data[oldName];
            delete this.data[oldName];
            var prefix = "this.refs.";
            if (this.code.indexOf("var refs=") !== -1 || this.code.indexOf("var refs ") !== -1 || this.code.indexOf("var refs:") !== -1 ||
                this.code.indexOf("let refs=") !== -1 || this.code.indexOf("let refs ") !== -1 || this.code.indexOf("let refs:") !== -1)
                prefix = "refs.";
            if (autoName)
                this.removePropertyInCode("ref", undefined, newName);
            else
                this.setPropertyInCode(newName, "ref", prefix + newName, this.classScope);
            if (this.refs[oldName])
                this.removeNode(this.refs[oldName].node);
            //   this.addImportIfNeeded("Ref", "jassijs/ui/Component");
            if (!autoName) {
                if (className.startsWith("\"") || this.data[newName].tag !== undefined) {
                    this.addImportIfNeeded("HTMLComponent", "jassijs/ui/Component");
                    this.addRef(newName, "HTMLComponent");
                }
                else
                    this.addRef(newName, className);
            }
            return newName;
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
                        params.push(ts.factory.createIdentifier(dec.parameter[i]));
                    }
                }
                var call = ts.factory.createCallExpression(ts.factory.createIdentifier(dec.name), undefined, params);
                newdec.push(ts.factory.createDecorator(call));
            }
            //var type=ts.createTy
            var newmember = ts.factory.createPropertyDeclaration(newdec, member.name, undefined, ts.factory.createTypeReferenceNode(member.type, []), undefined);
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
                            this.data[variablename][property].splice(x, 1);
                            break;
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
            var allprops = [];
            //collect allNodes to delete
            for (var vv = 0; vv < varnames.length; vv++) {
                var varname = varnames[vv];
                var prop = this.data[varname];
                if (varname.startsWith("me.") && this.refs[varname.substring(3)] !== undefined)
                    allprops.push(this.refs[varname.substring(3)]);
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
                if (allprops[x].node)
                    this.removeNode(allprops[x].node);
            }
            /*
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
                           var inconfig = prop[key][0]?.node?.initializer?.elements;
                           if (inconfig) {
                               for (var x = 0; x < inconfig.length; x++) {
                                   if (inconfig[x].getText() === varname || inconfig[x].getText().startsWith(varname)) {
                                       this.removeNode(inconfig[x]);
    
                                   }
                               }
                               if (inconfig.length === 0) {
                                   this.removeNode(prop[key][0]?.node);
                               }
                           }
                       }
                   }
               }
           }*/
            for (var vv = 0; vv < varnames.length; vv++) {
                delete this.data[varnames[vv]];
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
                if (this.data[varname + (counter === 1 ? "" : counter)] === undefined && (this.data.me === undefined || this.data.me[varname + (counter === 1 ? "" : counter)] === undefined))
                    break;
            }
            return varname + (counter === 1 ? "" : counter);
        }
        /**
         * change objectliteral to mutliline if needed
         */
        switchToMutlilineIfNeeded(node, newProperty, newValue) {
            try {
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
                        node.parent["arguments"][0] = ts.factory.createObjectLiteralExpression(node.parent["arguments"][0].properties, true);
                    }
                }
            }
            catch (_a) {
            }
        }
        setPropertyInConfig(variableName, property, value, isFunction = false, replace = undefined, before = undefined, scope) {
            var svalue = typeof value === "string" ? ts.factory.createIdentifier(value) : value;
            var config = this.data[variableName]["config"][0].node;
            config = config.arguments[0];
            var newExpression = ts.factory.createPropertyAssignment(property, svalue);
            if (property === "add" && replace === false) {
                property = "children";
                svalue = typeof value === "string" ? ts.factory.createIdentifier(value + ".config({})") : value;
                if (this.data[variableName]["children"] == undefined) { //
                    newExpression = ts.factory.createPropertyAssignment(property, ts.factory.createArrayLiteralExpression([svalue], true));
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
                if (replace && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                    let node = this.data[variableName][property][0].node;
                    this.data[variableName][property];
                    var pos = config.properties.indexOf(node);
                    config.properties[pos] = newExpression;
                    this.data[variableName][property][0].value = value;
                    this.data[variableName][property][0].node = newExpression;
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
                else {
                    config.properties.push(newExpression);
                    if (this.data[variableName][property] === undefined)
                        this.data[variableName][property] = [{ isFunction, value, node: newExpression }];
                    this.data[variableName][property][0].node = newExpression;
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
            }
            console.log("todo correct spaces");
            this.parse(this.getModifiedCode());
            //if (pos >= 0)
            //  node.parent["statements"].splice(pos, 1);
        }
        setPropertyInJC(variableName, property, value, isFunction = false, replace = undefined, before = undefined, scope) {
            var svalue = typeof value === "string" ? ts.factory.createIdentifier(value) : value;
            if (this.data[variableName]["_new_"][0].node.kind === ts.SyntaxKind.StringLiteral && property === "text") {
                this.data[variableName]["_new_"][0].value = value;
                //@ts-ignore
                this.data[variableName]["_new_"][0].node.text = value.toString().substring(1, value.toString().length - 1);
                //@ts-ignore
                this.data[variableName]["_new_"][0].node["end"] = -1;
                //@ts-ignore
                this.data[variableName]["_new_"][0].node["pos"] = -1;
                return;
            }
            var config = this.data[variableName]["_new_"][0].node["arguments"][1];
            if (this.data[variableName]["_new_"][0].node["arguments"].length < 2) {
                config = this.createNode("a={}");
                config = config.right;
                this.data[variableName]["_new_"][0].node["arguments"].push(config);
            }
            var newExpression = ts.factory.createPropertyAssignment(property, svalue);
            var jname;
            if (property === "add") { //transfer a child to another
                if (this.data[variableName]["add"] === undefined) {
                    newExpression = ts.factory.createPropertyAssignment("children", ts.factory.createArrayLiteralExpression([], true));
                    config.properties.push(newExpression);
                    this.data[variableName]["add"] = [{ node: newExpression, value: [], isFunction: false }];
                }
                if (typeof value === "string") {
                    jname = value;
                    var prop = this.data[value]["_new_"][0];
                    var classname = prop.className;
                    if (classname === "HTMLComponent")
                        classname = "\"" + prop.tag + "\"";
                    var node;
                    if (classname === "text") {
                        node = ts.factory.createStringLiteral("\"" + value + "\"");
                        //this.add(value, "text", <string>"", node);
                    }
                    else {
                        node = this.createNode("jc(" + classname + ",{})\n");
                        // if (classname === "br")
                        //   node = this.createNode("<" + classname + "/>");
                    }
                    prop.node = node;
                    prop.isJc = true;
                    prop.value = value;
                }
                else {
                    var name;
                    for (var key in this.data) {
                        if (this.data[key]["_new_"]) {
                            if (this.data[key]["_new_"][0].node === value)
                                name = key;
                        }
                    }
                    //jname=(<any>value).jname;
                    //remove old
                    if (value.parent["children"]) {
                        var pos = value.parent["children"].indexOf(value);
                        value.parent["children"].splice(pos, 0);
                    }
                    else {
                        var pos = value.parent["elements"].indexOf(value);
                        value.parent["elements"].splice(pos, 0);
                    }
                    prop = this.data[name]["_new_"][0];
                    node = value; //removeold
                }
                var props = this.data[variableName]["_new_"][0].node["arguments"][1].properties;
                for (var p = 0; p < props.length; p++) {
                    if (props[p].name.text === "children") {
                        node.parent = props[p].initializer;
                    }
                }
                if (node.parent === undefined)
                    throw "Parent not found";
                if (before) {
                    let found = undefined;
                    let ofound = -1;
                    console.log("var " + before.variablename);
                    console.log(this.data);
                    for (var o = 0; o < this.data[before.variablename][before.property].length; o++) {
                        if (this.data[before.variablename][before.property][o].value === before.value) {
                            found = this.data[before.variablename][before.property][o].node;
                            ofound = o;
                            break;
                        }
                    }
                    //@ts-ignore
                    var childrenNode = this.data[variableName]["add"][0].node.initializer;
                    var args = childrenNode.elements;
                    var pos = args.indexOf(found);
                    args.splice(pos, 0, node);
                    // config.properties.splice(pos + 1, 0, ts.factory.createJsxText("\n", true));
                    this.data[variableName]["add"].splice(ofound, 0, {
                        node: node,
                        value: jname,
                        isFunction: false
                    });
                    //this.data[variableName]["add"][0].node;
                }
                else {
                    var childrenNode = this.data[variableName]["add"][0].node["initializer"];
                    var args = childrenNode.elements;
                    args.push(node);
                    this.add(variableName, "add", value, node);
                }
                this.switchToMutlilineIfNeeded(config, property, value);
                return;
            }
            else { //comp.add(a) --> comp.config({children:[a]})
                if ((replace !== false && this.data[variableName] !== undefined && (this.data[variableName][property] !== undefined) || property === "tag")) { //edit existing
                    //let node = this.data[variableName][property][0].node;
                    //if (node === undefined && property === "tag") {//jc("div" => jc("span"
                    if (property === "tag") { //jc("div" => jc("span"
                        //  this.data[variableName][property][0].value = value;
                        var sval = value.substring(1, value.length - 1);
                        this.data[variableName]["_new_"][0].node["arguments"][0] = ts.factory.createStringLiteral(sval);
                    }
                    else {
                        let node = this.data[variableName][property][0].node;
                        this.data[variableName][property];
                        var pos = config.properties.indexOf(node);
                        config.properties[pos] = newExpression;
                        this.data[variableName][property][0].value = value;
                        this.data[variableName][property][0].node = newExpression;
                        this.switchToMutlilineIfNeeded(config, property, value);
                    }
                }
                else {
                    config.properties.push(newExpression);
                    if (this.data[variableName][property] === undefined)
                        this.data[variableName][property] = [{ isFunction, value, node: newExpression }];
                    this.data[variableName][property][0].node = newExpression;
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
            }
            console.log("todo correct spaces");
            // this.parse(this.getModifiedCode());
            //if (pos >= 0)
            //  node.parent["statements"].splice(pos, 1);
        }
        setPropertyInJSX(variableName, property, value, classscope, isFunction = false, replace = undefined, before = undefined, variablescope = undefined) {
            //if (this.data[variableName] === undefined)
            //    this.data[variableName] = {};
            var newValue;
            if (typeof value === "string")
                newValue = value.startsWith('"') ? ts.factory.createIdentifier(value) : ts.factory.createIdentifier("{" + value + "}");
            else
                newValue = value;
            ;
            var newExpression = newExpression = ts.factory.createJsxAttribute(ts.factory.createIdentifier(property), newValue);
            ;
            if (property === "new") { //me.panel1=new Panel({});
                /*       let prop = this.data[variableName]["_new_"][0];//.substring(3)];
                       var constr = prop.value;
                       value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                       replace = true;
                       var left = prop.node.getText();
                       left = left.substring(0, left.indexOf("=") - 1);
                       property = "_new_";
                       newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), newValue));
                   */
            }
            else if (isFunction) {
                //   newExpression = ts.createExpressionStatement(ts.createCall(
                //     ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), undefined, [newValue]));
            } /*else
                newExpression = ts.createExpressionStatement(ts.createAssignment(
                    ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), newValue));
            */
            var jname;
            if (property === "add") { //transfer a child to another
                var parent = this.data[variableName]["_new_"][0].node;
                if (typeof value === "string") {
                    jname = value;
                    var prop = this.data[value]["_new_"][0];
                    var classname = prop.className;
                    if (classname === "HTMLComponent")
                        classname = prop.tag;
                    var node;
                    if (classname === "text") {
                        node = ts.factory.createJsxText("", false);
                        this.add(value, "text", "", node);
                    }
                    else {
                        node = this.createNode("<" + classname + "></" + classname + ">");
                        if (classname === "br")
                            node = this.createNode("<" + classname + "/>");
                    }
                    prop.node = node;
                    prop.value = value;
                }
                else {
                    var name;
                    for (var key in this.data) {
                        if (this.data[key]["_new_"]) {
                            if (this.data[key]["_new_"][0].node === value)
                                name = key;
                        }
                    }
                    //jname=(<any>value).jname;
                    //remove old
                    var pos = value.parent["children"].indexOf(value);
                    value.parent["children"].splice(pos, 0);
                    prop = this.data[name]["_new_"][0];
                    node = value; //removeold
                }
                node.parent = parent;
                if (before) {
                    let found = undefined;
                    let ofound = -1;
                    console.log("var " + before.variablename);
                    console.log(this.data);
                    for (var o = 0; o < this.data[before.variablename][before.property].length; o++) {
                        if (this.data[before.variablename][before.property][o].value === before.value) {
                            found = this.data[before.variablename][before.property][o].node;
                            ofound = o;
                            break;
                        }
                    }
                    var pos = parent["children"].indexOf(found);
                    parent["children"].splice(pos, 0, node);
                    parent["children"].splice(pos + 1, 0, ts.factory.createJsxText("\n", true));
                    this.data[variableName]["add"].splice(ofound, 0, {
                        node: node,
                        value: jname,
                        isFunction: false
                    });
                    //this.data[variableName]["add"][0].node;
                }
                else {
                    if (parent["children"] === undefined)
                        debugger;
                    parent["children"].push(node);
                    parent["children"].push(ts.factory.createJsxText("\n", true));
                    this.add(variableName, "add", value, node);
                }
                return;
            }
            if (this.data[variableName]["_new_"][0].node.kind === ts.SyntaxKind.JsxText) {
                if (property === "text") {
                    var svalue = value;
                    var old = this.data[variableName][property][0].node.text; //getText() throw error if created manuell
                    svalue = JSON.parse(`{"a":` + svalue + "}").a;
                    if (svalue.length === svalue.trim().length) {
                        // @ts-ignore
                        svalue = old.substring(0, old.length - old.trimStart().length) + svalue + old.substring(old.length - (old.length - old.trimEnd().length));
                    }
                    //correct spaces linebrak are lost in html editing
                    this.data[variableName][property][0].value = JSON.stringify(svalue);
                    this.data[variableName][property][0].node.text = svalue;
                }
                return;
            }
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined && typeof value === "string") { //edit existing
                if (property === "tag") {
                    this.data[variableName]["_new_"][0].node.openingElement.tagName = ts.factory.createIdentifier(value.substring(1, value.length - 1));
                    this.data[variableName]["_new_"][0].node.closingElement.tagName = ts.factory.createIdentifier(value.substring(1, value.length - 1));
                    this.data[variableName][property][0].value = value;
                    this.data[variableName]["_new_"][0].node["jname"] = value.replaceAll('"', "");
                    return;
                }
                let node = this.data[variableName][property][0].node;
                var pos = node.parent["properties"].indexOf(node);
                //node.initializer.text=newValue;
                node.parent["properties"][pos] = newExpression;
                newExpression.parent = node.parent;
                this.data[variableName][property][0].node = newExpression;
                this.data[variableName][property][0].value = value;
                //var pos = node.parent["properties"].indexOf(node);
                //node.parent["properties"][pos] = newValue;
                //if (pos >= 0)
                //  node.parent["statements"].splice(pos, 1);
            }
            else { //insert new
                if (before) {
                    throw "not implemented";
                    /*  if (before.value === undefined)
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
                          node.parent["statements"].splice(pos, 0, newExpression);*/
                }
                else {
                    let parent = this.data[variableName]["_new_"][0].node.attributes;
                    if (parent === undefined)
                        parent = this.data[variableName]["_new_"][0].node.openingElement.attributes;
                    if (property === "tag" && typeof value === "string") { //HTMLComponent tag
                        var tagname = value.substring(1, value.length - 1);
                        this.data[variableName]["_new_"][0].node["jname"] = value.replaceAll('"', "");
                        if (this.data[variableName]["_new_"][0].node.attributes) {
                            this.data[variableName]["_new_"][0].node.tagName = ts.factory.createIdentifier(tagname);
                        }
                        else {
                            if (tagname.toLowerCase() === "br") { //br is created as <br></br> ==> correct
                                var oldnode = this.data[variableName]["_new_"][0].node;
                                var newnode = this.createNode("<br/>");
                                var pos = oldnode.parent.children.indexOf(oldnode);
                                oldnode.parent.children[pos] = newnode;
                                this.data[variableName]["_new_"][0].node = newnode;
                            }
                            else {
                                this.data[variableName]["_new_"][0].node.openingElement.tagName = ts.factory.createIdentifier(tagname);
                                this.data[variableName]["_new_"][0].node.closingElement.tagName = ts.factory.createIdentifier(tagname);
                            }
                        }
                    }
                    else {
                        parent["properties"].push(newExpression);
                        newExpression.parent = parent; //["properties"];
                    }
                    this.data[variableName][property] = [{ node: newExpression, isFunction, value }];
                }
            }
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
            if (this.isJSX)
                return this.setPropertyInJSX(variableName, property, value, classscope, isFunction, replace, before, variablescope);
            if (this.data[variableName] === undefined)
                this.data[variableName] = {};
            if (classscope === undefined)
                classscope = this.classScope;
            var scope = this.getNodeFromScope(classscope, variablescope);
            var newExpression = undefined;
            if (this.data[variableName]["_new_"] && this.data[variableName]["_new_"][0].isJc) {
                this.setPropertyInJC(variableName, property, value, isFunction, replace, before, scope);
                return;
            }
            if (this.data[variableName]["config"] !== undefined && property !== "new") {
                this.setPropertyInConfig(variableName, property, value, isFunction, replace, before, scope);
                return;
            }
            var newValue = typeof value === "string" ? ts.factory.createIdentifier(value) : value;
            var statements = scope["body"] ? scope["body"].statements : scope["statements"];
            if (property === "new") { //me.panel1=new Panel({});
                let prop = this.data[variableName]["_new_"][0]; //.substring(3)];
                var constr = prop.value;
                value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                replace = true;
                var left = prop.node.getText();
                left = left.substring(0, left.indexOf("=") - 1);
                property = "_new_";
                newExpression = ts.factory.createExpressionStatement(ts.factory.createAssignment(ts.factory.createIdentifier(left), newValue));
            }
            else if (isFunction) {
                //           newExpression=this.createNode(property === "" ? variableName : (variableName + "." + property)+"("+newValue.text+")",true);
                newExpression = ts.factory.createExpressionStatement(ts.factory.createCallExpression(ts.factory.createIdentifier(property === "" ? variableName : (variableName + "." + property)), undefined, [newValue]));
            }
            else
                newExpression = ts.factory.createExpressionStatement(ts.factory.createAssignment(ts.factory.createIdentifier(property === "" ? variableName : (variableName + "." + property)), newValue));
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                let node = this.data[variableName][property][0].node;
                var pos = node.parent["statements"].indexOf(node);
                node.parent["statements"][pos] = newExpression;
                newExpression.parent = node.parent;
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
        addVariableInCode(fulltype, classscope, variablescope = undefined, suggestedName = undefined, codeHasChanged = undefined) {
            var _a;
            if (classscope === undefined)
                classscope = this.classScope;
            let type = fulltype.split(".")[fulltype.split(".").length - 1];
            var varname = this.getNextVariableNameForType(type, suggestedName);
            if (this.variabelStack) {
                type = type === "TextComponent" ? "text" : type;
                this.data[varname] = {
                    "_new_": [{ className: type, tag: suggestedName }]
                };
                if (codeHasChanged) {
                    codeHasChanged.value = false;
                }
                // this.addRef(varname, type);
                return varname;
            }
            else {
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
                var st = this.createNode(prefix + varname + "=new " + type + "();", true);
                // var ass = ts.createAssignment(ts.createIdentifier(prefix + varname), ts.createIdentifier("new " + type + "()"));
                statements.splice(x, 0, st); //ts.factory.createStatement(ass));
                // if (useMe)
                this.addRef(varname, type);
            }
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
        await Typescript_1.mytypescript.waitForInited;
        var parser = new Parser();
        parser.parse("var j;j.config({children:[a,b,c]})");
        parser.swapPropertyWithParameter("j", "add", "c", "a");
        t.expectEqual(clean(parser.getModifiedCode()) === 'var j;j.config({ children: [c,b,a] });');
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
        console.log(clean(parser.getModifiedCode()));
        t.expectEqual(clean(parser.getModifiedCode()) === "function test() { var myclass=new MyClass(); b=8; myclass.a=9; }");
        parser = new Parser();
        parser.parse("");
        parser.addVariableInCode("MyClass", undefined);
        parser.setPropertyInCode("myclass", "a", "9", undefined);
        t.expectEqual(clean(parser.getModifiedCode()) === "var myclass=new MyClass();myclass.a=9;");
    }
    exports.tests = tests;
    async function test() {
        var h = ts;
        //tests(new Test());
        await Typescript_1.mytypescript.waitForInited;
        var code = Typescript_1.mytypescript.getCode("demo/hallo.tsx");
        var parser = new Parser();
        var scope = undefined; // [{ classname: "Dialog2", methodname: "layout" }];
        parser.parse(code, scope, false);
        debugger;
        parser.addVariableInCode("Component", [{ classname: undefined, methodname: "test" }]);
        //parser.addImportIfNeeded("table2", "jassijs/ui/Table2");
        //parser.setPropertyInCode("me.button2","pp","hallo",scope);
        // var j=parser.addVariableInCode("jassijs.ui.Button",[{classname:"Dialog",methodname:"layout"  }]);
        console.log(parser.getModifiedCode());
        // code = "function test(){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1,j:ppp.config({pp:9})})     }); }";
        // code = "function(test){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1},j(){j2.udo=9})     }); }";
        // code = "function test(){var ppp;var aaa=new Button();ppp.config({a:[9,6],  children:[ll.config({}),aaa.config({u:1,o:2,children:[kk.config({})]})]});}";
        //parser.parse(code, undefined);
        //code="reportdesign={k:9};";
        // parser.parse(code,[{ classname: "Dialog2", methodname: "layout" }]);// [{ classname: "TestDialogBinder", methodname: "layout" }]);
        //    parser.setPropertyInCode("me.table","new",'new Table({\n      paginationSize: 1\n})',undefined);
        //  console.log(parser.getModifiedCode());
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
//# sourceMappingURL=Parser.js.map