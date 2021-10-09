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
        add(variable, property, value, node) {
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
                    node: node
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
        addImportIfNeeded(name, file) {
            if (this.imports[name] === undefined) {
                var imp = ts.createNamedImports([ts.createImportSpecifier(undefined, ts.createIdentifier(name))]);
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
                        _this.typeMe[name] = { node: tnode, value: stype };
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
                if (this.collectProperties) {
                    for (let x = 0; x < this.collectProperties.length; x++) {
                        var col = this.collectProperties[x];
                        if (col.classname === parsedClass.name && parsedClass.members[col.methodname]) {
                            var nd = parsedClass.members[col.methodname].node;
                            this.parseProperties(nd);
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
                    left = node1.getText(); // this.code.substring(node1.pos, node1.end).trim();
                    var params = [];
                    node.arguments.forEach((arg) => { params.push(arg.getText()); });
                    value = params.join(", "); //this.code.substring(node2.pos, node2.end).trim();//
                }
                var lastpos = left.lastIndexOf(".");
                var variable = left;
                var prop = "";
                if (lastpos !== -1) {
                    variable = left.substring(0, lastpos);
                    prop = left.substring(lastpos + 1);
                }
                this.add(variable, prop, value, node.parent);
            }
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
                if (this.collectProperties) {
                    for (let x = 0; x < this.collectProperties.length; x++) {
                        var col = this.collectProperties[x];
                        if (col.classname === undefined && node["name"].text === col.methodname)
                            this.parseProperties(node);
                    }
                }
            }
            else
                node.getChildren().forEach(c => this.visitNode(c));
            //TODO remove this block
            if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                this.add(node["name"].text, "", "", undefined);
            }
        }
        /**
        * parse the code
        * @param {string} code - the code
        * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
        */
        parse(code, collectProperties = undefined) {
            this.data = {};
            this.code = code;
            this.collectProperties = collectProperties;
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
            if (this.data[variablename] !== undefined && this.data[variablename][property] !== undefined) {
                var prop = undefined;
                if (onlyValue !== undefined) {
                    for (var x = 0; x < this.data[variablename][property].length; x++) {
                        if (this.data[variablename][property][x].value === onlyValue) {
                            prop = this.data[variablename][property][x];
                        }
                    }
                }
                else
                    prop = this.data[variablename][property][0];
                if (prop == undefined)
                    return;
                this.removeNode(prop.node);
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
            var scope = this.getNodeFromScope(classscope, variablescope);
            var newExpression = undefined;
            var statements = scope["body"].statements;
            if (property === "new") { //me.panel1=new Panel({});
                let prop = this.data[variableName]["_new_"][0]; //.substring(3)];
                var constr = prop.value;
                value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                replace = true;
                var left = prop.node.getText();
                left = left.substring(0, left.indexOf("=") - 1);
                property = "_new_";
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), ts.createIdentifier(value)));
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
                newExpression = ts.createExpressionStatement(ts.createCall(ts.createIdentifier(variableName + "." + property), undefined, [ts.createIdentifier(value)]));
            }
            else
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(variableName + "." + property), ts.createIdentifier(value)));
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
            let type = fulltype.split(".")[fulltype.split(".").length - 1];
            var varname = this.getNextVariableNameForType(type);
            //var if(scopename)
            var prefix = "me.";
            var node = this.getNodeFromScope(classscope, variablescope);
            var statements = node["body"].statements;
            if (node === undefined)
                throw Error("no scope to insert a variable could be found");
            for (var x = 0; x < statements.length; x++) {
                if (!statements[x].getText().includes("new ") && !statements[x].getText().includes("var "))
                    break;
            }
            var ass = ts.createAssignment(ts.createIdentifier(prefix + varname), ts.createIdentifier("new " + type + "()"));
            statements.splice(x, 0, ts.createStatement(ass));
            this.addTypeMe(varname, type);
            return "me." + varname;
        }
    };
    Parser = __decorate([
        Jassi_1.$Class("jassijs_editor.base.Parser"),
        __metadata("design:paramtypes", [])
    ], Parser);
    exports.Parser = Parser;
    async function test() {
        await Typescript_1.default.waitForInited;
        var code = Typescript_1.default.getCode("jassijs_editor/util/Parser.ts");
        var parser = new Parser();
        parser.parse(code, undefined);
        /*  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
          const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
          const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
          console.log(result);*/
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWNBLE1BQU0sZUFBZTtRQUFyQjtZQUdJLG9CQUFlLEdBQWMsRUFBRSxDQUFDO1lBQ2hDLGNBQVMsR0FBYyxFQUFFLENBQUM7UUFFOUIsQ0FBQztLQUFBO0lBQ0QsTUFBTSxZQUFZO1FBQWxCO1lBR0ksY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFFekQsQ0FBQztLQUFBO0lBQ0QsTUFBYSxXQUFXO1FBQXhCO1lBS0ksWUFBTyxHQUFzQyxFQUFFLENBQUM7WUFDaEQsY0FBUyxHQUF5QyxFQUFFLENBQUM7UUFDekQsQ0FBQztLQUFBO0lBUEQsa0NBT0M7SUFFRCxJQUFhLE1BQU0sR0FBbkIsTUFBYSxNQUFNO1FBZWY7OztXQUdHO1FBQ0g7WUFsQkEsZUFBVSxHQUFrQixTQUFTLENBQUM7WUFFdEMsV0FBTSxHQUE4QixFQUFFLENBQUM7WUFDdkMsWUFBTyxHQUFvQyxFQUFFLENBQUM7WUFDOUMsWUFBTyxHQUErQixFQUFFLENBQUM7WUFDekMsY0FBUyxHQUFnQyxFQUFFLENBQUM7WUFDNUMsY0FBUyxHQUFnQyxFQUFFLENBQUM7WUFjeEMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixpQ0FBaUM7UUFDckMsQ0FBQztRQUVELGVBQWU7WUFDWCxNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN2RSxNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FB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QUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QixPQUFPLEtBQUssR0FBRyxPQUFPLENBQUM7UUFDM0IsQ0FBQztLQUNKLENBQUE7SUEzbEJZLE1BQU07UUFEbEIsY0FBTSxDQUFDLDRCQUE0QixDQUFDOztPQUN4QixNQUFNLENBMmxCbEI7SUEzbEJZLHdCQUFNO0lBNmxCWixLQUFLLFVBQVUsSUFBSTtRQUN0QixNQUFNLG9CQUFVLENBQUMsYUFBYSxDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLG9CQUFVLENBQUMsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDL0QsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVoQzs7O2dDQUd3QjtJQUkxQixDQUFDO0lBYkQsb0JBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcblxyXG5cclxuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiO1xyXG5cclxuXHJcbmludGVyZmFjZSBQcm9wZXJ0aWVzIHtcclxuICAgIFtkZXRhaWxzOiBzdHJpbmddOiBFbnRyeTtcclxufVxyXG5pbnRlcmZhY2UgRW50cnkge1xyXG4gICAgdmFsdWU/OiBhbnk7XHJcbiAgICBub2RlPzogdHMuTm9kZTtcclxufVxyXG5jbGFzcyBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgbm9kZT86IHRzLkRlY29yYXRvcjtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBwYXJzZWRQYXJhbWV0ZXI/OiBvYmplY3RbXSA9IFtdO1xyXG4gICAgcGFyYW1ldGVyPzogc3RyaW5nW10gPSBbXTtcclxuXHJcbn1cclxuY2xhc3MgUGFyc2VkTWVtYmVyIHtcclxuICAgIG5vZGU/OiB0cy5Ob2RlO1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIGRlY29yYXRvcj86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZERlY29yYXRvciB9ID0ge307XHJcbiAgICB0eXBlPzogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBQYXJzZWRDbGFzcyB7XHJcbiAgICBwYXJlbnQ/OiBQYXJzZXI7XHJcbiAgICBub2RlPzogdHMuQ2xhc3NFbGVtZW50O1xyXG4gICAgbmFtZT86IHN0cmluZztcclxuICAgIGZ1bGxDbGFzc25hbWU/OiBzdHJpbmc7XHJcbiAgICBtZW1iZXJzPzogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkTWVtYmVyIH0gPSB7fTtcclxuICAgIGRlY29yYXRvcj86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZERlY29yYXRvciB9ID0ge307XHJcbn1cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLmJhc2UuUGFyc2VyXCIpXHJcbmV4cG9ydCBjbGFzcyBQYXJzZXIge1xyXG4gICAgc291cmNlRmlsZTogdHMuU291cmNlRmlsZSA9IHVuZGVmaW5lZDtcclxuICAgIHR5cGVNZU5vZGU6IHRzLk5vZGU7XHJcbiAgICB0eXBlTWU6IHsgW25hbWU6IHN0cmluZ106IEVudHJ5IH0gPSB7fTtcclxuICAgIGNsYXNzZXM6IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZENsYXNzIH0gPSB7fTtcclxuICAgIGltcG9ydHM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9ID0ge307XHJcbiAgICBmdW5jdGlvbnM6IHsgW25hbWU6IHN0cmluZ106IHRzLk5vZGUgfSA9IHt9O1xyXG4gICAgdmFyaWFibGVzOiB7IFtuYW1lOiBzdHJpbmddOiB0cy5Ob2RlIH0gPSB7fTtcclxuICAgIGNvbGxlY3RQcm9wZXJ0aWVzOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdO1xyXG4gICAgY29kZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge09iamVjdC48c3RyaW5nLE9iamVjdC48c3RyaW5nLFtvYmplY3RdPj4gLSBhbGwgcHJvcGVydGllc1xyXG4gICAgKiBlLmcuIGRhdGFbXCJ0ZXh0Ym94MVwiXVt2YWx1ZV0tPkVudHJ5XHJcbiAgICAqL1xyXG4gICAgZGF0YTogeyBbdmFyaWFibGU6IHN0cmluZ106IHsgW3Byb3BlcnR5OiBzdHJpbmddOiBFbnRyeVtdIH0gfTtcclxuICAgIC8qKlxyXG4gICAgICogcGFyc2VzIENvZGUgZm9yIFVJIHJlbGV2YW50IHNldHRpbmdzXHJcbiAgICAgKiBAY2xhc3MgamFzc2lqc19lZGl0b3IudXRpbC5QYXJzZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIC8qKiB7W3N0cmluZ119IC0gYWxsIGNvZGUgbGluZXMqL1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1vZGlmaWVkQ29kZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKHsgbmV3TGluZTogdHMuTmV3TGluZUtpbmQuTGluZUZlZWQgfSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCAvKnNldFBhcmVudE5vZGVzKi8gZmFsc2UsIHRzLlNjcmlwdEtpbmQuVFMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCB0aGlzLnNvdXJjZUZpbGUsIHJlc3VsdEZpbGUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhIHByb3BlcnR5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFyaWFibGUgLSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gbmFtZSBvZiB0aGUgcHJvcGVydHlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgLSBjb2RlIC0gdGhlIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gbm9kZSAtIHRoZSBub2RlIG9mIHRoZSBzdGF0ZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGQodmFyaWFibGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbm9kZTogdHMuTm9kZSkge1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkudHJpbSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBhIHByb3BlcnR5IHZhbHVlIGZyb20gY29kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcmlhYmxlIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgKi9cclxuICAgIGdldFByb3BlcnR5VmFsdWUodmFyaWFibGUsIHByb3BlcnR5KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV1bMF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgLyogdmFyaWFibGU9XCJ0aGlzLlwiK3ZhcmlhYmxlO1xyXG4gICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgIGlmKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV1bMF0udmFsdWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH0qL1xyXG4gICAgICAgIC8vdGhpcyBcclxuICAgICAgICAvLyAgIHZhciB2YWx1ZT10aGlzLnByb3BlcnR5RWRpdG9yLnBhcnNlci5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMudmFyaWFibGVuYW1lLHRoaXMucHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFR5cGVNZShuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy50eXBlTWVOb2RlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHRwID0gdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUodHlwZSwgW10pO1xyXG4gICAgICAgIHZhciBuZXdub2RlID0gdHMuY3JlYXRlUHJvcGVydHlTaWduYXR1cmUodW5kZWZpbmVkLCBuYW1lICsgXCI/XCIsIHVuZGVmaW5lZCwgdHAsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy50eXBlTWVOb2RlW1wibWVtYmVyc1wiXS5wdXNoKG5ld25vZGUpO1xyXG4gICAgfVxyXG4gICAgYWRkSW1wb3J0SWZOZWVkZWQobmFtZTogc3RyaW5nLCBmaWxlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBvcnRzW25hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIGltcCA9IHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKHVuZGVmaW5lZCwgdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSldKTtcclxuICAgICAgICAgICAgY29uc3QgaW1wb3J0Tm9kZSA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCBpbXApLCB0cy5jcmVhdGVMaXRlcmFsKGZpbGUpKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMudXBkYXRlU291cmNlRmlsZU5vZGUodGhpcy5zb3VyY2VGaWxlLCBbaW1wb3J0Tm9kZSwgLi4udGhpcy5zb3VyY2VGaWxlLnN0YXRlbWVudHNdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlVHlwZU1lTm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlR5cGVMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlW1wibWVtYmVyc1wiXSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZU1lTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIG5vZGVbXCJtZW1iZXJzXCJdLmZvckVhY2goZnVuY3Rpb24gKHRub2RlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0bm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0bm9kZS5uYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eXBlID0gdG5vZGUudHlwZS50eXBlTmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnR5cGVNZVtuYW1lXSA9IHsgbm9kZTogdG5vZGUsIHZhbHVlOiBzdHlwZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmFkZChcIm1lXCIsIG5hbWUsIFwidHlwZWRlY2xhcmF0aW9uOlwiICsgc3R5cGUsIHVuZGVmaW5lZCwgYWxpbmUsIGFsaW5lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy5wYXJzZVR5cGVNZU5vZGUoYykpO1xyXG4gICAgfVxyXG4gICAgY29udmVydEFyZ3VtZW50KGFyZzogYW55KSB7XHJcbiAgICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgcHJvcHMgPSBhcmcucHJvcGVydGllcztcclxuICAgICAgICAgICAgaWYgKHByb3BzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXRbcHJvcHNbcF0ubmFtZS50ZXh0XSA9IHRoaXMuY29udmVydEFyZ3VtZW50KHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGxldCByZXQgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBhcmcuZWxlbWVudHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgIHJldC5wdXNoKHRoaXMuY29udmVydEFyZ3VtZW50KGFyZy5lbGVtZW50c1twXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcudGV4dDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRmFsc2VLZXl3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLk51bWVyaWNMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoYXJnLnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQXJyb3dGdW5jdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLmdldFRleHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IFwiRXJyb3IgdHlwZSBub3QgZm91bmRcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VEZWNvcmF0b3IoZGVjOiB0cy5EZWNvcmF0b3IpOiBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgICAgIHZhciBleDogYW55ID0gZGVjLmV4cHJlc3Npb247XHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBQYXJzZWREZWNvcmF0b3IoKTtcclxuICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldC5uYW1lID0gZXgudGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgcmV0Lm5hbWUgPSBleC5leHByZXNzaW9uLmVzY2FwZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGV4LmFyZ3VtZW50cy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wYXJzZWRQYXJhbWV0ZXIucHVzaCh0aGlzLmNvbnZlcnRBcmd1bWVudChleC5hcmd1bWVudHNbYV0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZXQucGFyYW1ldGVyLnB1c2goZXguYXJndW1lbnRzW2FdLmdldFRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNsYXNzKG5vZGU6IHRzLkNsYXNzRWxlbWVudCkge1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VkQ2xhc3MgPSBuZXcgUGFyc2VkQ2xhc3MoKTtcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MubmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLm5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXNbcGFyc2VkQ2xhc3MubmFtZV0gPSBwYXJzZWRDbGFzcztcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG5vZGUuZGVjb3JhdG9ycy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREZWMgPSB0aGlzLnBhcnNlRGVjb3JhdG9yKG5vZGUuZGVjb3JhdG9yc1t4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZGVjb3JhdG9yW3BhcnNlZERlYy5uYW1lXSA9IHBhcnNlZERlYztcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VkQ2xhc3MuZGVjb3JhdG9yW1wiJENsYXNzXCJdICYmIHBhcnNlZERlYy5wYXJhbWV0ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZnVsbENsYXNzbmFtZSA9IHBhcnNlZERlYy5wYXJhbWV0ZXJbMF0ucmVwbGFjZUFsbCgnXCInLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlW1wibWVtYmVyc1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZE1lbSA9IG5ldyBQYXJzZWRNZW1iZXIoKVxyXG4gICAgICAgICAgICAgICAgdmFyIG1lbSA9IG5vZGVbXCJtZW1iZXJzXCJdW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5uYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7Ly9Db25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLm5hbWUgPSBtZW0ubmFtZS5lc2NhcGVkVGV4dDtcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5ub2RlID0gbm9kZVtcIm1lbWJlcnNcIl1beF07XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0udHlwZSA9IChtZW0udHlwZSA/IG1lbS50eXBlLmdldEZ1bGxUZXh0KCkudHJpbSgpIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLm1lbWJlcnNbcGFyc2VkTWVtLm5hbWVdID0gcGFyc2VkTWVtO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5kZWNvcmF0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW0uZGVjb3JhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkRGVjID0gdGhpcy5wYXJzZURlY29yYXRvcihtZW0uZGVjb3JhdG9yc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5kZWNvcmF0b3JbcGFyc2VkRGVjLm5hbWVdID0gcGFyc2VkRGVjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xsZWN0UHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNvbGxlY3RQcm9wZXJ0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IHRoaXMuY29sbGVjdFByb3BlcnRpZXNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzc25hbWUgPT09IHBhcnNlZENsYXNzLm5hbWUgJiYgcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5kID0gcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBhcnNlUHJvcGVydGllcyhub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGlmKG5vZGUuaW5pdGlhbGl6ZXIhPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gbm9kZS5pbml0aWFsaXplci5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZChuYW1lLCBcIl9uZXdfXCIsIHZhbHVlLCBub2RlLnBhcmVudC5wYXJlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgodHMuaXNCaW5hcnlFeHByZXNzaW9uKG5vZGUpICYmIG5vZGUub3BlcmF0b3JUb2tlbi5raW5kID09PSB0cy5TeW50YXhLaW5kLkVxdWFsc1Rva2VuKSB8fFxyXG4gICAgICAgICAgICB0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBub2RlMTtcclxuICAgICAgICAgICAgdmFyIG5vZGUyO1xyXG4gICAgICAgICAgICB2YXIgbGVmdDogc3RyaW5nO1xyXG4gICAgICAgICAgICB2YXIgdmFsdWU6IHN0cmluZztcclxuICAgICAgICAgICAgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZTEgPSBub2RlLmxlZnQ7XHJcbiAgICAgICAgICAgICAgICBub2RlMiA9IG5vZGUucmlnaHQ7XHJcbiAgICAgICAgICAgICAgICBsZWZ0ID0gbm9kZTEuZ2V0VGV4dCgpOy8vIHRoaXMuY29kZS5zdWJzdHJpbmcobm9kZTEucG9zLCBub2RlMS5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbm9kZTIuZ2V0VGV4dCgpOy8vdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMi5wb3MsIG5vZGUyLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoXCJuZXcgXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkKGxlZnQsIFwiX25ld19cIiwgdmFsdWUsIG5vZGUucGFyZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICAgICAgbm9kZTEgPSBub2RlLmV4cHJlc3Npb247XHJcbiAgICAgICAgICAgICAgICBub2RlMiA9IG5vZGUuYXJndW1lbnRzO1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG5vZGUxLmdldFRleHQoKTsvLyB0aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUxLnBvcywgbm9kZTEuZW5kKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBub2RlLmFyZ3VtZW50cy5mb3JFYWNoKChhcmcpID0+IHsgcGFyYW1zLnB1c2goYXJnLmdldFRleHQoKSkgfSk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcmFtcy5qb2luKFwiLCBcIik7Ly90aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUyLnBvcywgbm9kZTIuZW5kKS50cmltKCk7Ly9cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGxhc3Rwb3MgPSBsZWZ0Lmxhc3RJbmRleE9mKFwiLlwiKTtcclxuICAgICAgICAgICAgdmFyIHZhcmlhYmxlID0gbGVmdDtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSBcIlwiO1xyXG4gICAgICAgICAgICBpZiAobGFzdHBvcyAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlID0gbGVmdC5zdWJzdHJpbmcoMCwgbGFzdHBvcyk7XHJcbiAgICAgICAgICAgICAgICBwcm9wID0gbGVmdC5zdWJzdHJpbmcobGFzdHBvcyArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWRkKHZhcmlhYmxlLCBwcm9wLCB2YWx1ZSwgbm9kZS5wYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMucGFyc2VQcm9wZXJ0aWVzKGMpKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuVmFyaWFibGVEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnZhcmlhYmxlc1tub2RlW1wibmFtZVwiXS50ZXh0XSA9IG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdmFyIG5kOiBhbnkgPSBub2RlO1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IG5kLm1vZHVsZVNwZWNpZmllci50ZXh0O1xyXG4gICAgICAgICAgICBpZiAobmQuaW1wb3J0Q2xhdXNlICYmIG5kLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmFtZXMgPSBuZC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncy5lbGVtZW50cztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgbmFtZXMubGVuZ3RoOyBlKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmltcG9ydHNbbmFtZXNbZV0ubmFtZS5lc2NhcGVkVGV4dF0gPSBmaWxlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT0gdHMuU3ludGF4S2luZC5UeXBlQWxpYXNEZWNsYXJhdGlvbiAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBcIk1lXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVR5cGVNZU5vZGUobm9kZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlQ2xhc3MoPHRzLkNsYXNzRWxlbWVudD5ub2RlKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlICYmIG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5GdW5jdGlvbkRlY2xhcmF0aW9uKSB7Ly9mdW5jdGlvbnMgb3V0IG9mIGNsYXNzXHJcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25zW25vZGVbXCJuYW1lXCJdLnRleHRdID0gbm9kZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY29sbGVjdFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5jb2xsZWN0UHJvcGVydGllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2wgPSB0aGlzLmNvbGxlY3RQcm9wZXJ0aWVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2wuY2xhc3NuYW1lID09PSB1bmRlZmluZWQgJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gY29sLm1ldGhvZG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VQcm9wZXJ0aWVzKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy52aXNpdE5vZGUoYykpO1xyXG4gICAgICAgIC8vVE9ETyByZW1vdmUgdGhpcyBibG9ja1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbiAmJiBub2RlW1wibmFtZVwiXS50ZXh0ID09PSBcInRlc3RcIikge1xyXG4gICAgICAgICAgICB0aGlzLmFkZChub2RlW1wibmFtZVwiXS50ZXh0LCBcIlwiLCBcIlwiLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogcGFyc2UgdGhlIGNvZGUgXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIC0gdGhlIGNvZGVcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IG9ubHlmdW5jdGlvbiAtIG9ubHkgdGhlIGNvZGUgaW4gdGhlIGZ1bmN0aW9uIGlzIHBhcnNlZCwgZS5nLiBcImxheW91dCgpXCJcclxuICAgICovXHJcbiAgICBwYXJzZShjb2RlOiBzdHJpbmcsIGNvbGxlY3RQcm9wZXJ0aWVzOiB7IGNsYXNzbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lOiBzdHJpbmcgfVtdID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0ge307XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuICAgICAgICB0aGlzLmNvbGxlY3RQcm9wZXJ0aWVzID0gY29sbGVjdFByb3BlcnRpZXM7XHJcblxyXG4gICAgICAgIHRoaXMuc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoJ2R1bW15LnRzJywgY29kZSwgdHMuU2NyaXB0VGFyZ2V0LkVTNSwgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy52aXNpdE5vZGUodGhpcy5zb3VyY2VGaWxlKTtcclxuXHJcbiAgICAgICAgLy9yZXR1cm4gdGhpcy5wYXJzZW9sZChjb2RlLG9ubHlmdW5jdGlvbik7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHJlbW92ZU5vZGUobm9kZTogdHMuTm9kZSkge1xyXG4gICAgICAgIGlmIChub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0pIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl1bXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgIG5vZGUucGFyZW50LnBhcmVudFtcInR5cGVcIl1bXCJtZW1iZXJzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKG5vZGUuZ2V0RnVsbFRleHQoKSArIFwiY291bGQgbm90IGJlIHJlbW92ZWRcIik7XHJcbiAgICB9XHJcbiAgICAvKiogXHJcbiAgICAgKiBtb2RpZnkgYSBtZW1iZXIgXHJcbiAgICAgKiovXHJcbiAgICBhZGRPck1vZGlmeU1lbWJlcihtZW1iZXI6IFBhcnNlZE1lbWJlciwgcGNsYXNzOiBQYXJzZWRDbGFzcykge1xyXG4gICAgICAgIC8vbWVtYmVyLm5vZGVcclxuICAgICAgICAvL3ZhciBuZXdtZW1iZXI9dHMuY3JlYXRlUHJvcGVydHlcclxuICAgICAgICB2YXIgbmV3ZGVjOiB0cy5EZWNvcmF0b3JbXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gbWVtYmVyLmRlY29yYXRvcikge1xyXG4gICAgICAgICAgICB2YXIgZGVjID0gbWVtYmVyLmRlY29yYXRvcltrZXldO1xyXG4gICAgICAgICAgICBpZiAoIW5ld2RlYylcclxuICAgICAgICAgICAgICAgIG5ld2RlYyA9IFtdO1xyXG4gICAgICAgICAgICAvL3RzLmNyZWF0ZURlY29yYXRvcigpXHJcbiAgICAgICAgICAgIC8vbWVtYmVyLmRlY29yYXRvcltrZXldLm5hbWU7XHJcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChkZWMucGFyYW1ldGVyKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGVjLnBhcmFtZXRlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRzLmNyZWF0ZUlkZW50aWZpZXIoZGVjLnBhcmFtZXRlcltpXSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBjYWxsID0gdHMuY3JlYXRlQ2FsbCh0cy5jcmVhdGVJZGVudGlmaWVyKGRlYy5uYW1lKSwgdW5kZWZpbmVkLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBuZXdkZWMucHVzaCh0cy5jcmVhdGVEZWNvcmF0b3IoY2FsbCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3ZhciB0eXBlPXRzLmNyZWF0ZVR5XHJcbiAgICAgICAgdmFyIG5ld21lbWJlciA9IHRzLmNyZWF0ZVByb3BlcnR5KG5ld2RlYywgdW5kZWZpbmVkLCBtZW1iZXIubmFtZSwgdW5kZWZpbmVkLCB0cy5jcmVhdGVUeXBlUmVmZXJlbmNlTm9kZShtZW1iZXIudHlwZSwgW10pLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHZhciBub2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwY2xhc3MubWVtYmVycykge1xyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSBtZW1iZXIubmFtZSlcclxuICAgICAgICAgICAgICAgIG5vZGUgPSBwY2xhc3MubWVtYmVyc1trZXldLm5vZGVcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl0ucHVzaChuZXdtZW1iZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXVtwb3NdID0gbmV3bWVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwY2xhc3MubWVtYmVyc1ttZW1iZXIubmFtZV0gPSBtZW1iZXI7XHJcbiAgICAgICAgbWVtYmVyLm5vZGUgPSBuZXdtZW1iZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogcmVtb3ZlcyB0aGUgcHJvcGVydHkgZnJvbSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gcmVtb3ZlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gW29ubHlWYWx1ZV0gLSByZW1vdmUgdGhlIHByb3BlcnR5IG9ubHkgaWYgdGhlIHZhbHVlIGlzIGZvdW5kXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbdmFyaWFibGVuYW1lXSAtIHRocGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgLSBkZWZhdWx0PXRoaXMudmFyaWFibGVuYW1lXHJcbiAgICAqL1xyXG4gICAgcmVtb3ZlUHJvcGVydHlJbkNvZGUocHJvcGVydHk6IHN0cmluZywgb25seVZhbHVlID0gdW5kZWZpbmVkLCB2YXJpYWJsZW5hbWU6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wOiBFbnRyeSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKG9ubHlWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV1beF0udmFsdWUgPT09IG9ubHlWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBwcm9wID0gdGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldWzBdO1xyXG4gICAgICAgICAgICBpZiAocHJvcCA9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwcm9wLm5vZGUpO1xyXG4gICAgICAgICAgICAvKnZhciBvbGR2YWx1ZSA9IHRoaXMubGluZXNbcHJvcC5saW5lc3RhcnQgLSAxXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHByb3AubGluZXN0YXJ0O3ggPD0gcHJvcC5saW5lZW5kO3grKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lc1t4IC0gMV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoeCA+IDEgJiYgdGhpcy5saW5lc1t4IC0gMl0uZW5kc1dpdGgoXCIsXCIpKS8vdHlwZSBNZT17IGJ0Mj86QnV0dG9uLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGluZXNbeCAtIDJdID0gdGhpcy5saW5lc1t4IC0gMl0uc3Vic3RyaW5nKDAsIHRoaXMubGluZXNbeCAtIDJdLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICAvL3ZhciB0ZXh0ID0gdGhpcy5wYXJzZXIubGluZXNUb1N0cmluZygpO1xyXG4gICAgICAgICAgICAvL3RoaXMuY29kZUVkaXRvci52YWx1ZSA9IHRleHQ7XHJcbiAgICAgICAgICAgIC8vdGhpcy51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlbW92ZXMgdGhlIHZhcmlhYmxlIGZyb20gY29kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcm5hbWUgLSB0aGUgdmFyaWFibGUgdG8gcmVtb3ZlXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVZhcmlhYmxlSW5Db2RlKHZhcm5hbWU6IHN0cmluZykge1xyXG5cclxuICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZGF0YVt2YXJuYW1lXTtcclxuICAgICAgICB2YXIgYWxscHJvcHM6IEVudHJ5W10gPSBbXTtcclxuICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpICYmIHRoaXMudHlwZU1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHRoaXMudHlwZU1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXSk7XHJcbiAgICAgICAgLy9yZW1vdmUgcHJvcGVydGllc1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wcyA9IHByb3Bba2V5XTtcclxuICAgICAgICAgICAgcHJvcHMuZm9yRWFjaCgocCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWxscHJvcHMucHVzaChwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJtZS5cIikpIHtcclxuICAgICAgICAgICAgbGV0IHByb3BzID0gdGhpcy5kYXRhLm1lW3Zhcm5hbWUuc3Vic3RyaW5nKDMpXTtcclxuICAgICAgICAgICAgcHJvcHM/LmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGFsbHByb3BzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbHByb3BzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShhbGxwcm9wc1t4XS5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9yZW1vdmUgbGluZXMgd2hlcmUgdXNlZCBhcyBwYXJhbWV0ZXJcclxuICAgICAgICBmb3IgKHZhciBwcm9wa2V5IGluIHRoaXMuZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcCA9IHRoaXMuZGF0YVtwcm9wa2V5XTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3ApIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wcyA9IHByb3Bba2V5XTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcHJvcHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcCA9IHByb3BzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBwLnZhbHVlLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyYW1zW2ldID09PSB2YXJuYW1lIHx8IHBhcmFtc1tpXSA9PT0gXCJ0aGlzLlwiICsgdmFybmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVOb2RlKHAubm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdldE5vZGVGcm9tU2NvcGUoY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSwgdmFyaWFibGVzY29wZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZSB9ID0gdW5kZWZpbmVkKTogdHMuTm9kZSB7XHJcbiAgICAgICAgdmFyIHNjb3BlO1xyXG4gICAgICAgIGlmICh2YXJpYWJsZXNjb3BlKSB7XHJcbiAgICAgICAgICAgIHNjb3BlID0gdGhpcy5kYXRhW3ZhcmlhYmxlc2NvcGUudmFyaWFibGVuYW1lXVt2YXJpYWJsZXNjb3BlLm1ldGhvZG5hbWVdWzBdPy5ub2RlO1xyXG4gICAgICAgICAgICBzY29wZSA9IHNjb3BlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3NzY29wZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjID0gY2xhc3NzY29wZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChzYy5jbGFzc25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuY2xhc3Nlc1tzYy5jbGFzc25hbWVdPy5tZW1iZXJzW3NjLm1ldGhvZG5hbWVdPy5ub2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8vZXhwb3J0ZWQgZnVuY3Rpb25cclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IHRoaXMuZnVuY3Rpb25zW3NjLm1ldGhvZG5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzY29wZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmV4dCB2YXJpYWJsZW5hbWVcclxuICAgICAqICovXHJcbiAgICBnZXROZXh0VmFyaWFibGVOYW1lRm9yVHlwZSh0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgdmFybmFtZSA9IHR5cGUuc3BsaXQoXCIuXCIpW3R5cGUuc3BsaXQoXCIuXCIpLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgZm9yICh2YXIgY291bnRlciA9IDE7IGNvdW50ZXIgPCAxMDAwOyBjb3VudGVyKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YS5tZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuZGF0YS5tZVt2YXJuYW1lICsgY291bnRlcl0gPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFybmFtZSArIGNvdW50ZXI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogbW9kaWZ5IHRoZSBwcm9wZXJ0eSBpbiBjb2RlXHJcbiAgICAqIEBwYXJhbSB2YXJpYWJsZW5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICogQHBhcmFtICBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSBcclxuICAgICogQHBhcmFtIHZhbHVlIC0gdGhlIG5ldyB2YWx1ZVxyXG4gICAgKiBAcGFyYW0gY2xhc3NzY29wZSAgLSB0aGUgcHJvcGVydHkgd291bGQgYmUgaW5zZXJ0IGluIHRoaXMgYmxvY2tcclxuICAgICogQHBhcmFtIGlzRnVuY3Rpb24gIC0gdHJ1ZSBpZiB0aGUgcHJvcGVydHkgaXMgYSBmdW5jdGlvblxyXG4gICAgKiBAcGFyYW0gW3JlcGxhY2VdICAtIGlmIHRydWUgdGhlIG9sZCB2YWx1ZSBpcyBkZWxldGVkXHJcbiAgICAqIEBwYXJhbSBbYmVmb3JlXSAtIHRoZSBuZXcgcHJvcGVydHkgaXMgcGxhY2VkIGJlZm9yZSB0aGlzIHByb3BlcnR5XHJcbiAgICAqIEBwYXJhbSBbdmFyaWFibGVzY29wZV0gLSBpZiB0aGlzIHNjb3BlIGlzIGRlZmluZWQgLSB0aGUgbmV3IHByb3BlcnR5IHdvdWxkIGJlIGluc2VydCBpbiB0aGlzIHZhcmlhYmxlXHJcbiAgICAqL1xyXG4gICAgc2V0UHJvcGVydHlJbkNvZGUodmFyaWFibGVOYW1lOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsXHJcbiAgICAgICAgY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSxcclxuICAgICAgICBpc0Z1bmN0aW9uOiBib29sZWFuID0gZmFsc2UsIHJlcGxhY2U6IGJvb2xlYW4gPSB1bmRlZmluZWQsXHJcbiAgICAgICAgYmVmb3JlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZT99ID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIHZhcmlhYmxlc2NvcGU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWUgfSA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciBzY29wZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICB2YXIgbmV3RXhwcmVzc2lvbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBzY29wZVtcImJvZHlcIl0uc3RhdGVtZW50c1xyXG4gICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJuZXdcIikgeyAvL21lLnBhbmVsMT1uZXcgUGFuZWwoe30pO1xyXG4gICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW1wiX25ld19cIl1bMF07Ly8uc3Vic3RyaW5nKDMpXTtcclxuICAgICAgICAgICAgdmFyIGNvbnN0ciA9IHByb3AudmFsdWU7XHJcbiAgICAgICAgICAgIHZhbHVlID0gY29uc3RyLnN1YnN0cmluZygwLCBjb25zdHIuaW5kZXhPZihcIihcIikgKyAxKSArIHZhbHVlICsgY29uc3RyLnN1YnN0cmluZyhjb25zdHIubGFzdEluZGV4T2YoXCIpXCIpKTtcclxuICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gcHJvcC5ub2RlLmdldFRleHQoKTtcclxuICAgICAgICAgICAgbGVmdCA9IGxlZnQuc3Vic3RyaW5nKDAsIGxlZnQuaW5kZXhPZihcIj1cIikgLSAxKTtcclxuICAgICAgICAgICAgcHJvcGVydHkgPSBcIl9uZXdfXCI7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihsZWZ0KSwgdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkpKTtcclxuICAgICAgICAgICAgLypcdH1lbHNley8vdmFyIGhoPW5ldyBQYW5lbCh7fSlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wWzBdLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gY29uc3RyLnN1YnN0cmluZygwLCBjb25zdHIuaW5kZXhPZihcIihcIikgKyAxKSArIHZhbHVlICsgY29uc3RyLnN1YnN0cmluZyhjb25zdHIubGFzdEluZGV4T2YoXCIpXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpc0Z1bmN0aW9uPXRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3RXhwcmVzc2lvbj10cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihcIm1lLlwiK3Byb3BlcnR5KSwgdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkpKTtcdFxyXG4gICAgICAgICAgICAgICAgfSovXHJcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUNhbGwodHMuY3JlYXRlSWRlbnRpZmllcih2YXJpYWJsZU5hbWUgKyBcIi5cIiArIHByb3BlcnR5KSwgdW5kZWZpbmVkLCBbdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSldKSk7XHJcbiAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgIG5ld0V4cHJlc3Npb24gPSB0cy5jcmVhdGVFeHByZXNzaW9uU3RhdGVtZW50KHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcih2YXJpYWJsZU5hbWUgKyBcIi5cIiArIHByb3BlcnR5KSwgdHMuY3JlYXRlSWRlbnRpZmllcih2YWx1ZSkpKTtcclxuICAgICAgICBpZiAocmVwbGFjZSAhPT0gZmFsc2UgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkgey8vZWRpdCBleGlzdGluZ1xyXG4gICAgICAgICAgICBsZXQgbm9kZSA9IHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdW3Byb3BlcnR5XVswXS5ub2RlO1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLmluZGV4T2Yobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXVtwb3NdID0gbmV3RXhwcmVzc2lvbjtcclxuICAgICAgICAgICAgLy9pZiAocG9zID49IDApXHJcbiAgICAgICAgICAgIC8vICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgfSBlbHNlIHsvL2luc2VydCBuZXdcclxuICAgICAgICAgICAgaWYgKGJlZm9yZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGJlZm9yZS52YWx1ZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwibm90IGltcGxlbWVudGVkXCI7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIG8gPSAwOyBvIDwgdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV0ubGVuZ3RoOyBvKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10udmFsdWUgPT09IGJlZm9yZS52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gdGhpcy5kYXRhW2JlZm9yZS52YXJpYWJsZW5hbWVdW2JlZm9yZS5wcm9wZXJ0eV1bb10ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiUHJvcGVydHkgbm90IGZvdW5kIFwiICsgYmVmb3JlLnZhcmlhYmxlbmFtZSArIFwiLlwiICsgYmVmb3JlLnByb3BlcnR5ICsgXCIgdmFsdWUgXCIgKyBiZWZvcmUudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5zcGxpY2UocG9zLCAwLCBuZXdFeHByZXNzaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0cHJvcDogdHMuTm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHByb3AgaW4gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJfbmV3X1wiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9zaG91bGQgYmUgaW4gdGhlIHNhbWUgc2NvcGUgb2YgZGVjbGFyYXRpb24gKGltcG9ydGFudCBmb3IgcmVwZWF0ZXIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudHM9dGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bMF0ubm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3Rub2RlOiB0cy5Ob2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF0ubGVuZ3RoIC0gMV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdG5vZGUucGFyZW50ID09PSBzY29wZVtcImJvZHlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wID0gdGVzdG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gbGFzdHByb3AucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGxhc3Rwcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcyArIDEsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gc3RhdGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcz4wJiZzdGF0ZW1lbnRzW3N0YXRlbWVudHMubGVuZ3RoIC0gMV0uZ2V0VGV4dCgpLnN0YXJ0c1dpdGgoXCJyZXR1cm4gXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MtLTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZShwb3MsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBzd2FwcyB0d28gc3RhdGVtZW50cyBpbmRlbmRpZmllZCBieSAgZnVuY3Rpb25wYXJhbWV0ZXIgaW4gYSB2YXJpYWJsZS5wcm9wZXJ0eShwYXJhbWV0ZXIxKSB3aXRoIHZhcmlhYmxlLnByb3BlcnR5KHBhcmFtZXRlcjIpXHJcbiAgICAgKiovXHJcbiAgICBzd2FwUHJvcGVydHlXaXRoUGFyYW1ldGVyKHZhcmlhYmxlOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHBhcmFtZXRlcjE6IHN0cmluZywgcGFyYW1ldGVyMjogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGZpcnN0OiB0cy5Ob2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBzZWNvbmQ6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyZW50Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRbeF0udmFsdWUuc3BsaXQoXCIsXCIpWzBdLnRyaW0oKSA9PT0gcGFyYW1ldGVyMSlcclxuICAgICAgICAgICAgICAgIGZpcnN0ID0gcGFyZW50W3hdLm5vZGU7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRbeF0udmFsdWUuc3BsaXQoXCIsXCIpWzBdLnRyaW0oKSA9PT0gcGFyYW1ldGVyMilcclxuICAgICAgICAgICAgICAgIHNlY29uZCA9IHBhcmVudFt4XS5ub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWZpcnN0KVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlBhcmFtZXRlciBub3QgZm91bmQgXCIgKyBwYXJhbWV0ZXIxKTtcclxuICAgICAgICBpZiAoIXNlY29uZClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJQYXJhbWV0ZXIgbm90IGZvdW5kIFwiICsgcGFyYW1ldGVyMik7XHJcbiAgICAgICAgdmFyIGlmaXJzdCA9IGZpcnN0LnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihmaXJzdCk7XHJcbiAgICAgICAgdmFyIGlzZWNvbmQgPSBzZWNvbmQucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKHNlY29uZCk7XHJcbiAgICAgICAgZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXVtpZmlyc3RdID0gc2Vjb25kO1xyXG4gICAgICAgIGZpcnN0LnBhcmVudFtcInN0YXRlbWVudHNcIl1baXNlY29uZF0gPSBmaXJzdDtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIGFkZHMgYW4gUHJvcGVydHlcclxuICAgICogQHBhcmFtIHR5cGUgLSBuYW1lIG9mIHRoZSB0eXBlIG8gY3JlYXRlXHJcbiAgICAqIEBwYXJhbSBjbGFzc3Njb3BlIC0gdGhlIHNjb3BlIChtZXRob2RuYW1lKSB3aGVyZSB0aGUgdmFyaWFibGUgc2hvdWxkIGJlIGluc2VydCBDbGFzcy5sYXlvdXRcclxuICAgICogQHBhcmFtIHZhcmlhYmxlc2NvcGUgLSB0aGUgc2NvcGUgd2hlcmUgdGhlIHZhcmlhYmxlIHNob3VsZCBiZSBpbnNlcnQgZS5nLiBoYWxsby5vbmNsaWNrXHJcbiAgICAqIEByZXR1cm5zICB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0XHJcbiAgICAqL1xyXG4gICAgYWRkVmFyaWFibGVJbkNvZGUoZnVsbHR5cGU6IHN0cmluZywgY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSwgdmFyaWFibGVzY29wZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZSB9ID0gdW5kZWZpbmVkKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdHlwZSA9IGZ1bGx0eXBlLnNwbGl0KFwiLlwiKVtmdWxsdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKHR5cGUpO1xyXG4gICAgICAgIC8vdmFyIGlmKHNjb3BlbmFtZSlcclxuICAgICAgICB2YXIgcHJlZml4ID0gXCJtZS5cIjtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBub2RlW1wiYm9keVwiXS5zdGF0ZW1lbnRzO1xyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gc2NvcGUgdG8gaW5zZXJ0IGEgdmFyaWFibGUgY291bGQgYmUgZm91bmRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzdGF0ZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGVtZW50c1t4XS5nZXRUZXh0KCkuaW5jbHVkZXMoXCJuZXcgXCIpICYmICFzdGF0ZW1lbnRzW3hdLmdldFRleHQoKS5pbmNsdWRlcyhcInZhciBcIikpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFzcyA9IHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihwcmVmaXggKyB2YXJuYW1lKSwgdHMuY3JlYXRlSWRlbnRpZmllcihcIm5ldyBcIiArIHR5cGUgKyBcIigpXCIpKTtcclxuICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZSh4LCAwLCB0cy5jcmVhdGVTdGF0ZW1lbnQoYXNzKSk7XHJcbiAgICAgICAgdGhpcy5hZGRUeXBlTWUodmFybmFtZSwgdHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIFwibWUuXCIgKyB2YXJuYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIGF3YWl0IHR5cGVzY3JpcHQud2FpdEZvckluaXRlZDtcclxuICAgIHZhciBjb2RlID0gdHlwZXNjcmlwdC5nZXRDb2RlKFwiamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXIudHNcIik7XHJcbiAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gICAgcGFyc2VyLnBhcnNlKGNvZGUsIHVuZGVmaW5lZCk7XHJcblxyXG4gIC8qICBjb25zdCBwcmludGVyID0gdHMuY3JlYXRlUHJpbnRlcih7IG5ld0xpbmU6IHRzLk5ld0xpbmVLaW5kLkxpbmVGZWVkIH0pO1xyXG4gICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCBmYWxzZSwgdHMuU2NyaXB0S2luZC5UUyk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBwcmludGVyLnByaW50Tm9kZSh0cy5FbWl0SGludC5VbnNwZWNpZmllZCwgcGFyc2VyLnNvdXJjZUZpbGUsIHJlc3VsdEZpbGUpO1xyXG4gICAgY29uc29sZS5sb2cocmVzdWx0KTsqL1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5cclxuIl19