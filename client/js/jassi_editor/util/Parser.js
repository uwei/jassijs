var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi_editor/util/Typescript"], function (require, exports, Jassi_1, Typescript_1) {
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
         * @class jassi_editor.util.Parser
         */
        constructor() {
            this.sourceFile = undefined;
            this.typeMe = {};
            this.classes = {};
            this.imports = {};
            this.functions = {};
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
                var value = node.initializer.getText();
                this.add(name, "_new_", value, node.parent.parent);
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
                        if (prop === "_new_")
                            continue;
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
        Jassi_1.$Class("jassi_editor.base.Parser"),
        __metadata("design:paramtypes", [])
    ], Parser);
    exports.Parser = Parser;
    async function test() {
        var code = Typescript_1.default.getCode("remote/de/AR.ts");
        var parser = new Parser();
        parser.parse(code, undefined);
        const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
        const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
        const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
        console.log(result);
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lfZWRpdG9yL3V0aWwvUGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFjQSxNQUFNLGVBQWU7UUFBckI7WUFHSSxvQkFBZSxHQUFjLEVBQUUsQ0FBQztZQUNoQyxjQUFTLEdBQWMsRUFBRSxDQUFDO1FBRTlCLENBQUM7S0FBQTtJQUNELE1BQU0sWUFBWTtRQUFsQjtZQUdJLGNBQVMsR0FBeUMsRUFBRSxDQUFDO1FBRXpELENBQUM7S0FBQTtJQUNELE1BQWEsV0FBVztRQUF4QjtZQUtJLFlBQU8sR0FBc0MsRUFBRSxDQUFDO1lBQ2hELGNBQVMsR0FBeUMsRUFBRSxDQUFDO1FBQ3pELENBQUM7S0FBQTtJQVBELGtDQU9DO0lBRUQsSUFBYSxNQUFNLEdBQW5CLE1BQWEsTUFBTTtRQWVmOzs7V0FHRztRQUNIO1lBbEJBLGVBQVUsR0FBa0IsU0FBUyxDQUFDO1lBRXRDLFdBQU0sR0FBOEIsRUFBRSxDQUFDO1lBQ3ZDLFlBQU8sR0FBb0MsRUFBRSxDQUFDO1lBQzlDLFlBQU8sR0FBK0IsRUFBRSxDQUFDO1lBQ3pDLGNBQVMsR0FBZ0MsRUFBRSxDQUFDO1lBZXhDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRCxlQUFlO1lBQ1gsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDdkUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0gsTUFBTSxN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QUFPLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hHLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN6RixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBSXhCLENBQUM7SUFYRCxvQkFXQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2kvcmVtb3RlL0phc3NpXCI7XHJcblxyXG5cclxuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSBcImphc3NpX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIjtcclxuXHJcblxyXG5pbnRlcmZhY2UgUHJvcGVydGllcyB7XHJcbiAgICBbZGV0YWlsczogc3RyaW5nXTogRW50cnk7XHJcbn1cclxuaW50ZXJmYWNlIEVudHJ5IHtcclxuICAgIHZhbHVlPzogYW55O1xyXG4gICAgbm9kZT86IHRzLk5vZGU7XHJcbn1cclxuY2xhc3MgUGFyc2VkRGVjb3JhdG9yIHtcclxuICAgIG5vZGU/OiB0cy5EZWNvcmF0b3I7XHJcbiAgICBuYW1lPzogc3RyaW5nO1xyXG4gICAgcGFyc2VkUGFyYW1ldGVyPzogb2JqZWN0W10gPSBbXTtcclxuICAgIHBhcmFtZXRlcj86IHN0cmluZ1tdID0gW107XHJcblxyXG59XHJcbmNsYXNzIFBhcnNlZE1lbWJlciB7XHJcbiAgICBub2RlPzogdHMuTm9kZTtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBkZWNvcmF0b3I/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWREZWNvcmF0b3IgfSA9IHt9O1xyXG4gICAgdHlwZT86IHN0cmluZztcclxufVxyXG5leHBvcnQgY2xhc3MgUGFyc2VkQ2xhc3Mge1xyXG4gICAgcGFyZW50PzogUGFyc2VyO1xyXG4gICAgbm9kZT86IHRzLkNsYXNzRWxlbWVudDtcclxuICAgIG5hbWU/OiBzdHJpbmc7XHJcbiAgICBmdWxsQ2xhc3NuYW1lPzogc3RyaW5nO1xyXG4gICAgbWVtYmVycz86IHsgW25hbWU6IHN0cmluZ106IFBhcnNlZE1lbWJlciB9ID0ge307XHJcbiAgICBkZWNvcmF0b3I/OiB7IFtuYW1lOiBzdHJpbmddOiBQYXJzZWREZWNvcmF0b3IgfSA9IHt9O1xyXG59XHJcbkAkQ2xhc3MoXCJqYXNzaV9lZGl0b3IuYmFzZS5QYXJzZXJcIilcclxuZXhwb3J0IGNsYXNzIFBhcnNlciB7XHJcbiAgICBzb3VyY2VGaWxlOiB0cy5Tb3VyY2VGaWxlID0gdW5kZWZpbmVkO1xyXG4gICAgdHlwZU1lTm9kZTogdHMuTm9kZTtcclxuICAgIHR5cGVNZTogeyBbbmFtZTogc3RyaW5nXTogRW50cnkgfSA9IHt9O1xyXG4gICAgY2xhc3NlczogeyBbbmFtZTogc3RyaW5nXTogUGFyc2VkQ2xhc3MgfSA9IHt9O1xyXG4gICAgaW1wb3J0czogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcclxuICAgIGZ1bmN0aW9uczogeyBbbmFtZTogc3RyaW5nXTogdHMuTm9kZSB9ID0ge307XHJcblxyXG4gICAgY29sbGVjdFByb3BlcnRpZXM6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W107XHJcbiAgICBjb2RlOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICogQG1lbWJlciB7T2JqZWN0LjxzdHJpbmcsT2JqZWN0LjxzdHJpbmcsW29iamVjdF0+PiAtIGFsbCBwcm9wZXJ0aWVzXHJcbiAgICAqIGUuZy4gZGF0YVtcInRleHRib3gxXCJdW3ZhbHVlXS0+RW50cnlcclxuICAgICovXHJcbiAgICBkYXRhOiB7IFt2YXJpYWJsZTogc3RyaW5nXTogeyBbcHJvcGVydHk6IHN0cmluZ106IEVudHJ5W10gfSB9O1xyXG4gICAgLyoqXHJcbiAgICAgKiBwYXJzZXMgQ29kZSBmb3IgVUkgcmVsZXZhbnQgc2V0dGluZ3NcclxuICAgICAqIEBjbGFzcyBqYXNzaV9lZGl0b3IudXRpbC5QYXJzZXJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIC8qKiB7W3N0cmluZ119IC0gYWxsIGNvZGUgbGluZXMqL1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1vZGlmaWVkQ29kZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHByaW50ZXIgPSB0cy5jcmVhdGVQcmludGVyKHsgbmV3TGluZTogdHMuTmV3TGluZUtpbmQuTGluZUZlZWQgfSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0RmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXCJkdW1teS50c1wiLCBcIlwiLCB0cy5TY3JpcHRUYXJnZXQuTGF0ZXN0LCAvKnNldFBhcmVudE5vZGVzKi8gZmFsc2UsIHRzLlNjcmlwdEtpbmQuVFMpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHByaW50ZXIucHJpbnROb2RlKHRzLkVtaXRIaW50LlVuc3BlY2lmaWVkLCB0aGlzLnNvdXJjZUZpbGUsIHJlc3VsdEZpbGUpO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIGFkZCBhIHByb3BlcnR5XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFyaWFibGUgLSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gbmFtZSBvZiB0aGUgcHJvcGVydHlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSAgLSBjb2RlIC0gdGhlIHZhbHVlXHJcbiAgICAgKiBAcGFyYW0gbm9kZSAtIHRoZSBub2RlIG9mIHRoZSBzdGF0ZW1lbnRcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGQodmFyaWFibGU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IHN0cmluZywgbm9kZTogdHMuTm9kZSkge1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xyXG4gICAgICAgIHByb3BlcnR5ID0gcHJvcGVydHkudHJpbSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICBub2RlOiBub2RlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVhZCBhIHByb3BlcnR5IHZhbHVlIGZyb20gY29kZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcmlhYmxlIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5XHJcbiAgICAgKi9cclxuICAgIGdldFByb3BlcnR5VmFsdWUodmFyaWFibGUsIHByb3BlcnR5KTogYW55IHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdmFyaWFibGVdW3Byb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV1bMF0udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgLyogdmFyaWFibGU9XCJ0aGlzLlwiK3ZhcmlhYmxlO1xyXG4gICAgICAgICBpZih0aGlzLmRhdGFbdmFyaWFibGVdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgIGlmKHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhW3ZhcmlhYmxlXVtwcm9wZXJ0eV1bMF0udmFsdWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH0qL1xyXG4gICAgICAgIC8vdGhpcyBcclxuICAgICAgICAvLyAgIHZhciB2YWx1ZT10aGlzLnByb3BlcnR5RWRpdG9yLnBhcnNlci5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMudmFyaWFibGVuYW1lLHRoaXMucHJvcGVydHkubmFtZSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFR5cGVNZShuYW1lOiBzdHJpbmcsIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgIGlmICghdGhpcy50eXBlTWVOb2RlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHRwID0gdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUodHlwZSwgW10pO1xyXG4gICAgICAgIHZhciBuZXdub2RlID0gdHMuY3JlYXRlUHJvcGVydHlTaWduYXR1cmUodW5kZWZpbmVkLCBuYW1lICsgXCI/XCIsIHVuZGVmaW5lZCwgdHAsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy50eXBlTWVOb2RlW1wibWVtYmVyc1wiXS5wdXNoKG5ld25vZGUpO1xyXG4gICAgfVxyXG4gICAgYWRkSW1wb3J0SWZOZWVkZWQobmFtZTogc3RyaW5nLCBmaWxlOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5pbXBvcnRzW25hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIGltcCA9IHRzLmNyZWF0ZU5hbWVkSW1wb3J0cyhbdHMuY3JlYXRlSW1wb3J0U3BlY2lmaWVyKHVuZGVmaW5lZCwgdHMuY3JlYXRlSWRlbnRpZmllcihuYW1lKSldKTtcclxuICAgICAgICAgICAgY29uc3QgaW1wb3J0Tm9kZSA9IHRzLmNyZWF0ZUltcG9ydERlY2xhcmF0aW9uKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB0cy5jcmVhdGVJbXBvcnRDbGF1c2UodW5kZWZpbmVkLCBpbXApLCB0cy5jcmVhdGVMaXRlcmFsKGZpbGUpKTtcclxuICAgICAgICAgICAgdGhpcy5zb3VyY2VGaWxlID0gdHMudXBkYXRlU291cmNlRmlsZU5vZGUodGhpcy5zb3VyY2VGaWxlLCBbaW1wb3J0Tm9kZSwgLi4udGhpcy5zb3VyY2VGaWxlLnN0YXRlbWVudHNdKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHBhcnNlVHlwZU1lTm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlR5cGVMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGlmIChub2RlW1wibWVtYmVyc1wiXSlcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZU1lTm9kZSA9IG5vZGU7XHJcbiAgICAgICAgICAgIG5vZGVbXCJtZW1iZXJzXCJdLmZvckVhY2goZnVuY3Rpb24gKHRub2RlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0bm9kZS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0bm9kZS5uYW1lLnRleHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eXBlID0gdG5vZGUudHlwZS50eXBlTmFtZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnR5cGVNZVtuYW1lXSA9IHsgbm9kZTogdG5vZGUsIHZhbHVlOiBzdHlwZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmFkZChcIm1lXCIsIG5hbWUsIFwidHlwZWRlY2xhcmF0aW9uOlwiICsgc3R5cGUsIHVuZGVmaW5lZCwgYWxpbmUsIGFsaW5lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuZ2V0Q2hpbGRyZW4oKS5mb3JFYWNoKGMgPT4gdGhpcy5wYXJzZVR5cGVNZU5vZGUoYykpO1xyXG4gICAgfVxyXG4gICAgY29udmVydEFyZ3VtZW50KGFyZzogYW55KSB7XHJcbiAgICAgICAgaWYgKGFyZyA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcclxuICAgICAgICAgICAgdmFyIHJldCA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgcHJvcHMgPSBhcmcucHJvcGVydGllcztcclxuICAgICAgICAgICAgaWYgKHByb3BzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcHJvcHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXRbcHJvcHNbcF0ubmFtZS50ZXh0XSA9IHRoaXMuY29udmVydEFyZ3VtZW50KHByb3BzW3BdLmluaXRpYWxpemVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLnRleHQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5BcnJheUxpdGVyYWxFeHByZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGxldCByZXQgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCA9IDA7IHAgPCBhcmcuZWxlbWVudHMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgIHJldC5wdXNoKHRoaXMuY29udmVydEFyZ3VtZW50KGFyZy5lbGVtZW50c1twXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhcmcua2luZCA9PT0gdHMuU3ludGF4S2luZC5JZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcmcudGV4dDtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRmFsc2VLZXl3b3JkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFyZy5raW5kID09PSB0cy5TeW50YXhLaW5kLk51bWVyaWNMaXRlcmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIoYXJnLnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoYXJnLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQXJyb3dGdW5jdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJnLmdldFRleHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IFwiRXJyb3IgdHlwZSBub3QgZm91bmRcIjtcclxuICAgIH1cclxuICAgIHByaXZhdGUgcGFyc2VEZWNvcmF0b3IoZGVjOiB0cy5EZWNvcmF0b3IpOiBQYXJzZWREZWNvcmF0b3Ige1xyXG4gICAgICAgIHZhciBleDogYW55ID0gZGVjLmV4cHJlc3Npb247XHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBQYXJzZWREZWNvcmF0b3IoKTtcclxuICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldC5uYW1lID0gZXgudGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgcmV0Lm5hbWUgPSBleC5leHByZXNzaW9uLmVzY2FwZWRUZXh0O1xyXG4gICAgICAgICAgICBpZiAoZXguZXhwcmVzc2lvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGV4LmFyZ3VtZW50cy5sZW5ndGg7IGErKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldC5wYXJzZWRQYXJhbWV0ZXIucHVzaCh0aGlzLmNvbnZlcnRBcmd1bWVudChleC5hcmd1bWVudHNbYV0pKTtcclxuICAgICAgICAgICAgICAgICAgICByZXQucGFyYW1ldGVyLnB1c2goZXguYXJndW1lbnRzW2FdLmdldFRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwYXJzZUNsYXNzKG5vZGU6IHRzLkNsYXNzRWxlbWVudCkge1xyXG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuQ2xhc3NEZWNsYXJhdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcGFyc2VkQ2xhc3MgPSBuZXcgUGFyc2VkQ2xhc3MoKTtcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MucGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgcGFyc2VkQ2xhc3MubmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHBhcnNlZENsYXNzLm5vZGUgPSBub2RlO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXNbcGFyc2VkQ2xhc3MubmFtZV0gPSBwYXJzZWRDbGFzcztcclxuICAgICAgICAgICAgaWYgKG5vZGUuZGVjb3JhdG9ycyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IG5vZGUuZGVjb3JhdG9ycy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZWREZWMgPSB0aGlzLnBhcnNlRGVjb3JhdG9yKG5vZGUuZGVjb3JhdG9yc1t4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZGVjb3JhdG9yW3BhcnNlZERlYy5uYW1lXSA9IHBhcnNlZERlYztcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VkQ2xhc3MuZGVjb3JhdG9yW1wiJENsYXNzXCJdICYmIHBhcnNlZERlYy5wYXJhbWV0ZXIubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VkQ2xhc3MuZnVsbENsYXNzbmFtZSA9IHBhcnNlZERlYy5wYXJhbWV0ZXJbMF0ucmVwbGFjZUFsbCgnXCInLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBub2RlW1wibWVtYmVyc1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlZE1lbSA9IG5ldyBQYXJzZWRNZW1iZXIoKVxyXG4gICAgICAgICAgICAgICAgdmFyIG1lbSA9IG5vZGVbXCJtZW1iZXJzXCJdW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5uYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7Ly9Db25zdHJ1Y3RvclxyXG4gICAgICAgICAgICAgICAgcGFyc2VkTWVtLm5hbWUgPSBtZW0ubmFtZS5lc2NhcGVkVGV4dDtcclxuICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5ub2RlID0gbm9kZVtcIm1lbWJlcnNcIl1beF07XHJcbiAgICAgICAgICAgICAgICBwYXJzZWRNZW0udHlwZSA9IChtZW0udHlwZSA/IG1lbS50eXBlLmdldEZ1bGxUZXh0KCkudHJpbSgpIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgIHBhcnNlZENsYXNzLm1lbWJlcnNbcGFyc2VkTWVtLm5hbWVdID0gcGFyc2VkTWVtO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lbS5kZWNvcmF0b3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZW0uZGVjb3JhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyc2VkRGVjID0gdGhpcy5wYXJzZURlY29yYXRvcihtZW0uZGVjb3JhdG9yc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlZE1lbS5kZWNvcmF0b3JbcGFyc2VkRGVjLm5hbWVdID0gcGFyc2VkRGVjO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb2xsZWN0UHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmNvbGxlY3RQcm9wZXJ0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbCA9IHRoaXMuY29sbGVjdFByb3BlcnRpZXNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbC5jbGFzc25hbWUgPT09IHBhcnNlZENsYXNzLm5hbWUgJiYgcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5kID0gcGFyc2VkQ2xhc3MubWVtYmVyc1tjb2wubWV0aG9kbmFtZV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZVByb3BlcnRpZXMobmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHBhcnNlUHJvcGVydGllcyhub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgaWYgKHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5vZGUubmFtZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5vZGUuaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZChuYW1lLCBcIl9uZXdfXCIsIHZhbHVlLCBub2RlLnBhcmVudC5wYXJlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSAmJiBub2RlLm9wZXJhdG9yVG9rZW4ua2luZCA9PT0gdHMuU3ludGF4S2luZC5FcXVhbHNUb2tlbikgfHxcclxuICAgICAgICAgICAgdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlKSkge1xyXG4gICAgICAgICAgICB2YXIgbm9kZTE7XHJcbiAgICAgICAgICAgIHZhciBub2RlMjtcclxuICAgICAgICAgICAgdmFyIGxlZnQ6IHN0cmluZztcclxuICAgICAgICAgICAgdmFyIHZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUxID0gbm9kZS5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgbm9kZTIgPSBub2RlLnJpZ2h0O1xyXG4gICAgICAgICAgICAgICAgbGVmdCA9IG5vZGUxLmdldFRleHQoKTsvLyB0aGlzLmNvZGUuc3Vic3RyaW5nKG5vZGUxLnBvcywgbm9kZTEuZW5kKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5vZGUyLmdldFRleHQoKTsvL3RoaXMuY29kZS5zdWJzdHJpbmcobm9kZTIucG9zLCBub2RlMi5lbmQpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5zdGFydHNXaXRoKFwibmV3IFwiKSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZChsZWZ0LCBcIl9uZXdfXCIsIHZhbHVlLCBub2RlLnBhcmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24obm9kZSkpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUxID0gbm9kZS5leHByZXNzaW9uO1xyXG4gICAgICAgICAgICAgICAgbm9kZTIgPSBub2RlLmFyZ3VtZW50cztcclxuICAgICAgICAgICAgICAgIGxlZnQgPSBub2RlMS5nZXRUZXh0KCk7Ly8gdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMS5wb3MsIG5vZGUxLmVuZCkudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hcmd1bWVudHMuZm9yRWFjaCgoYXJnKSA9PiB7IHBhcmFtcy5wdXNoKGFyZy5nZXRUZXh0KCkpIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJhbXMuam9pbihcIiwgXCIpOy8vdGhpcy5jb2RlLnN1YnN0cmluZyhub2RlMi5wb3MsIG5vZGUyLmVuZCkudHJpbSgpOy8vXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBsYXN0cG9zID0gbGVmdC5sYXN0SW5kZXhPZihcIi5cIik7XHJcbiAgICAgICAgICAgIHZhciB2YXJpYWJsZSA9IGxlZnQ7XHJcbiAgICAgICAgICAgIHZhciBwcm9wID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKGxhc3Rwb3MgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2YXJpYWJsZSA9IGxlZnQuc3Vic3RyaW5nKDAsIGxhc3Rwb3MpO1xyXG4gICAgICAgICAgICAgICAgcHJvcCA9IGxlZnQuc3Vic3RyaW5nKGxhc3Rwb3MgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFkZCh2YXJpYWJsZSwgcHJvcCwgdmFsdWUsIG5vZGUucGFyZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB0aGlzLnBhcnNlUHJvcGVydGllcyhjKSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkltcG9ydERlY2xhcmF0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBuZDogYW55ID0gbm9kZTtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBuZC5tb2R1bGVTcGVjaWZpZXIudGV4dDtcclxuICAgICAgICAgICAgaWYgKG5kLmltcG9ydENsYXVzZSAmJiBuZC5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWVzID0gbmQuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MuZWxlbWVudHM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlID0gMDsgZSA8IG5hbWVzLmxlbmd0aDsgZSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbXBvcnRzW25hbWVzW2VdLm5hbWUuZXNjYXBlZFRleHRdID0gZmlsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobm9kZS5raW5kID09IHRzLlN5bnRheEtpbmQuVHlwZUFsaWFzRGVjbGFyYXRpb24gJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gXCJNZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VUeXBlTWVOb2RlKG5vZGUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkNsYXNzRGVjbGFyYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZUNsYXNzKDx0cy5DbGFzc0VsZW1lbnQ+bm9kZSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZSAmJiBub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRnVuY3Rpb25EZWNsYXJhdGlvbikgey8vZnVuY3Rpb25zIG91dCBvZiBjbGFzc1xyXG4gICAgICAgICAgICB0aGlzLmZ1bmN0aW9uc1tub2RlW1wibmFtZVwiXS50ZXh0XSA9IG5vZGU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbGxlY3RQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuY29sbGVjdFByb3BlcnRpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29sID0gdGhpcy5jb2xsZWN0UHJvcGVydGllc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29sLmNsYXNzbmFtZSA9PT0gdW5kZWZpbmVkICYmIG5vZGVbXCJuYW1lXCJdLnRleHQgPT09IGNvbC5tZXRob2RuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlUHJvcGVydGllcyhub2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBub2RlLmdldENoaWxkcmVuKCkuZm9yRWFjaChjID0+IHRoaXMudmlzaXROb2RlKGMpKTtcclxuICAgICAgICAvL1RPRE8gcmVtb3ZlIHRoaXMgYmxvY2tcclxuICAgICAgICBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkZ1bmN0aW9uRGVjbGFyYXRpb24gJiYgbm9kZVtcIm5hbWVcIl0udGV4dCA9PT0gXCJ0ZXN0XCIpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGQobm9kZVtcIm5hbWVcIl0udGV4dCwgXCJcIiwgXCJcIiwgdW5kZWZpbmVkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIHBhcnNlIHRoZSBjb2RlIFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIHRoZSBjb2RlXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbmx5ZnVuY3Rpb24gLSBvbmx5IHRoZSBjb2RlIGluIHRoZSBmdW5jdGlvbiBpcyBwYXJzZWQsIGUuZy4gXCJsYXlvdXQoKVwiXHJcbiAgICAqL1xyXG4gICAgcGFyc2UoY29kZTogc3RyaW5nLCBjb2xsZWN0UHJvcGVydGllczogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgICAgIHRoaXMuY29kZSA9IGNvZGU7XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0UHJvcGVydGllcyA9IGNvbGxlY3RQcm9wZXJ0aWVzO1xyXG5cclxuICAgICAgICB0aGlzLnNvdXJjZUZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKCdkdW1teS50cycsIGNvZGUsIHRzLlNjcmlwdFRhcmdldC5FUzUsIHRydWUpO1xyXG4gICAgICAgIHRoaXMudmlzaXROb2RlKHRoaXMuc291cmNlRmlsZSk7XHJcblxyXG4gICAgICAgIC8vcmV0dXJuIHRoaXMucGFyc2VvbGQoY29kZSxvbmx5ZnVuY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSByZW1vdmVOb2RlKG5vZGU6IHRzLk5vZGUpIHtcclxuICAgICAgICBpZiAobm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnQucGFyZW50W1widHlwZVwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdW1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudC5wYXJlbnRbXCJ0eXBlXCJdW1wibWVtYmVyc1wiXS5zcGxpY2UocG9zLCAxKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50W1wibWVtYmVyc1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcIm1lbWJlcnNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAgICAgbm9kZS5wYXJlbnRbXCJtZW1iZXJzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihub2RlLmdldEZ1bGxUZXh0KCkgKyBcImNvdWxkIG5vdCBiZSByZW1vdmVkXCIpO1xyXG4gICAgfVxyXG4gICAgLyoqIFxyXG4gICAgICogbW9kaWZ5IGEgbWVtYmVyIFxyXG4gICAgICoqL1xyXG4gICAgYWRkT3JNb2RpZnlNZW1iZXIobWVtYmVyOiBQYXJzZWRNZW1iZXIsIHBjbGFzczogUGFyc2VkQ2xhc3MpIHtcclxuICAgICAgICAvL21lbWJlci5ub2RlXHJcbiAgICAgICAgLy92YXIgbmV3bWVtYmVyPXRzLmNyZWF0ZVByb3BlcnR5XHJcbiAgICAgICAgdmFyIG5ld2RlYzogdHMuRGVjb3JhdG9yW10gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIG1lbWJlci5kZWNvcmF0b3IpIHtcclxuICAgICAgICAgICAgdmFyIGRlYyA9IG1lbWJlci5kZWNvcmF0b3Jba2V5XTtcclxuICAgICAgICAgICAgaWYgKCFuZXdkZWMpXHJcbiAgICAgICAgICAgICAgICBuZXdkZWMgPSBbXTtcclxuICAgICAgICAgICAgLy90cy5jcmVhdGVEZWNvcmF0b3IoKVxyXG4gICAgICAgICAgICAvL21lbWJlci5kZWNvcmF0b3Jba2V5XS5uYW1lO1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBpZiAoZGVjLnBhcmFtZXRlcikge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRlYy5wYXJhbWV0ZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMucHVzaCh0cy5jcmVhdGVJZGVudGlmaWVyKGRlYy5wYXJhbWV0ZXJbaV0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgY2FsbCA9IHRzLmNyZWF0ZUNhbGwodHMuY3JlYXRlSWRlbnRpZmllcihkZWMubmFtZSksIHVuZGVmaW5lZCwgcGFyYW1zKTtcclxuICAgICAgICAgICAgbmV3ZGVjLnB1c2godHMuY3JlYXRlRGVjb3JhdG9yKGNhbGwpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy92YXIgdHlwZT10cy5jcmVhdGVUeVxyXG4gICAgICAgIHZhciBuZXdtZW1iZXIgPSB0cy5jcmVhdGVQcm9wZXJ0eShuZXdkZWMsIHVuZGVmaW5lZCwgbWVtYmVyLm5hbWUsIHVuZGVmaW5lZCwgdHMuY3JlYXRlVHlwZVJlZmVyZW5jZU5vZGUobWVtYmVyLnR5cGUsIFtdKSwgdW5kZWZpbmVkKTtcclxuICAgICAgICB2YXIgbm9kZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGNsYXNzLm1lbWJlcnMpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gbWVtYmVyLm5hbWUpXHJcbiAgICAgICAgICAgICAgICBub2RlID0gcGNsYXNzLm1lbWJlcnNba2V5XS5ub2RlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcGNsYXNzLm5vZGVbXCJtZW1iZXJzXCJdLnB1c2gobmV3bWVtYmVyKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IHBjbGFzcy5ub2RlW1wibWVtYmVyc1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBwY2xhc3Mubm9kZVtcIm1lbWJlcnNcIl1bcG9zXSA9IG5ld21lbWJlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGNsYXNzLm1lbWJlcnNbbWVtYmVyLm5hbWVdID0gbWVtYmVyO1xyXG4gICAgICAgIG1lbWJlci5ub2RlID0gbmV3bWVtYmVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHJlbW92ZXMgdGhlIHByb3BlcnR5IGZyb20gY29kZVxyXG4gICAgKiBAcGFyYW0ge3R5cGV9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIHJlbW92ZVxyXG4gICAgKiBAcGFyYW0ge3R5cGV9IFtvbmx5VmFsdWVdIC0gcmVtb3ZlIHRoZSBwcm9wZXJ0eSBvbmx5IGlmIHRoZSB2YWx1ZSBpcyBmb3VuZFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlbmFtZV0gLSB0aHBlIG5hbWUgb2YgdGhlIHZhcmlhYmxlIC0gZGVmYXVsdD10aGlzLnZhcmlhYmxlbmFtZVxyXG4gICAgKi9cclxuICAgIHJlbW92ZVByb3BlcnR5SW5Db2RlKHByb3BlcnR5OiBzdHJpbmcsIG9ubHlWYWx1ZSA9IHVuZGVmaW5lZCwgdmFyaWFibGVuYW1lOiBzdHJpbmcgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV0gIT09IHVuZGVmaW5lZCAmJiB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcDogRW50cnkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmIChvbmx5VmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmRhdGFbdmFyaWFibGVuYW1lXVtwcm9wZXJ0eV0ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW3ZhcmlhYmxlbmFtZV1bcHJvcGVydHldW3hdLnZhbHVlID09PSBvbmx5VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVt4XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgcHJvcCA9IHRoaXMuZGF0YVt2YXJpYWJsZW5hbWVdW3Byb3BlcnR5XVswXTtcclxuICAgICAgICAgICAgaWYgKHByb3AgPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUocHJvcC5ub2RlKTtcclxuICAgICAgICAgICAgLyp2YXIgb2xkdmFsdWUgPSB0aGlzLmxpbmVzW3Byb3AubGluZXN0YXJ0IC0gMV07XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSBwcm9wLmxpbmVzdGFydDt4IDw9IHByb3AubGluZWVuZDt4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGluZXNbeCAtIDFdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPiAxICYmIHRoaXMubGluZXNbeCAtIDJdLmVuZHNXaXRoKFwiLFwiKSkvL3R5cGUgTWU9eyBidDI/OkJ1dHRvbixcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW3ggLSAyXSA9IHRoaXMubGluZXNbeCAtIDJdLnN1YnN0cmluZygwLCB0aGlzLmxpbmVzW3ggLSAyXS5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgLy92YXIgdGV4dCA9IHRoaXMucGFyc2VyLmxpbmVzVG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgLy90aGlzLmNvZGVFZGl0b3IudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgICAgICAvL3RoaXMudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiByZW1vdmVzIHRoZSB2YXJpYWJsZSBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YXJuYW1lIC0gdGhlIHZhcmlhYmxlIHRvIHJlbW92ZVxyXG4gICAgICovXHJcbiAgICByZW1vdmVWYXJpYWJsZUluQ29kZSh2YXJuYW1lOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbdmFybmFtZV07XHJcbiAgICAgICAgdmFyIGFsbHByb3BzOiBFbnRyeVtdID0gW107XHJcbiAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcIm1lLlwiKSAmJiB0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgYWxscHJvcHMucHVzaCh0aGlzLnR5cGVNZVt2YXJuYW1lLnN1YnN0cmluZygzKV0pO1xyXG4gICAgICAgIC8vcmVtb3ZlIHByb3BlcnRpZXNcclxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgIHByb3BzLmZvckVhY2goKHApID0+IHtcclxuICAgICAgICAgICAgICAgIGFsbHByb3BzLnB1c2gocCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFybmFtZS5zdGFydHNXaXRoKFwibWUuXCIpKSB7XHJcbiAgICAgICAgICAgIGxldCBwcm9wcyA9IHRoaXMuZGF0YS5tZVt2YXJuYW1lLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHByb3BzPy5mb3JFYWNoKChwKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhbGxwcm9wcy5wdXNoKHApO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxwcm9wcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZU5vZGUoYWxscHJvcHNbeF0ubm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vcmVtb3ZlIGxpbmVzIHdoZXJlIHVzZWQgYXMgcGFyYW1ldGVyXHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGtleSBpbiB0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIHByb3AgPSB0aGlzLmRhdGFbcHJvcGtleV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcHMgPSBwcm9wW2tleV07XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHByb3BzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHAgPSBwcm9wc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gcC52YWx1ZS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tpXSA9PT0gdmFybmFtZSB8fCBwYXJhbXNbaV0gPT09IFwidGhpcy5cIiArIHZhcm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTm9kZShwLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBnZXROb2RlRnJvbVNjb3BlKGNsYXNzc2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10sIHZhcmlhYmxlc2NvcGU6IHsgdmFyaWFibGVuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWUgfSA9IHVuZGVmaW5lZCk6IHRzLk5vZGUge1xyXG4gICAgICAgIHZhciBzY29wZTtcclxuICAgICAgICBpZiAodmFyaWFibGVzY29wZSkge1xyXG4gICAgICAgICAgICBzY29wZSA9IHRoaXMuZGF0YVt2YXJpYWJsZXNjb3BlLnZhcmlhYmxlbmFtZV1bdmFyaWFibGVzY29wZS5tZXRob2RuYW1lXVswXT8ubm9kZTtcclxuICAgICAgICAgICAgc2NvcGUgPSBzY29wZS5leHByZXNzaW9uLmFyZ3VtZW50c1swXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzc2NvcGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzYyA9IGNsYXNzc2NvcGVbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2MuY2xhc3NuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLmNsYXNzZXNbc2MuY2xhc3NuYW1lXT8ubWVtYmVyc1tzYy5tZXRob2RuYW1lXT8ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsvL2V4cG9ydGVkIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSB0aGlzLmZ1bmN0aW9uc1tzYy5tZXRob2RuYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc2NvcGU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5leHQgdmFyaWFibGVuYW1lXHJcbiAgICAgKiAqL1xyXG4gICAgZ2V0TmV4dFZhcmlhYmxlTmFtZUZvclR5cGUodHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0eXBlLnNwbGl0KFwiLlwiKVt0eXBlLnNwbGl0KFwiLlwiKS5sZW5ndGggLSAxXS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgIGZvciAodmFyIGNvdW50ZXIgPSAxOyBjb3VudGVyIDwgMTAwMDsgY291bnRlcisrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEubWUgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmRhdGEubWVbdmFybmFtZSArIGNvdW50ZXJdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhcm5hbWUgKyBjb3VudGVyO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIG1vZGlmeSB0aGUgcHJvcGVydHkgaW4gY29kZVxyXG4gICAgKiBAcGFyYW0gdmFyaWFibGVuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAqIEBwYXJhbSAgcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgXHJcbiAgICAqIEBwYXJhbSB2YWx1ZSAtIHRoZSBuZXcgdmFsdWVcclxuICAgICogQHBhcmFtIGNsYXNzc2NvcGUgIC0gdGhlIHByb3BlcnR5IHdvdWxkIGJlIGluc2VydCBpbiB0aGlzIGJsb2NrXHJcbiAgICAqIEBwYXJhbSBpc0Z1bmN0aW9uICAtIHRydWUgaWYgdGhlIHByb3BlcnR5IGlzIGEgZnVuY3Rpb25cclxuICAgICogQHBhcmFtIFtyZXBsYWNlXSAgLSBpZiB0cnVlIHRoZSBvbGQgdmFsdWUgaXMgZGVsZXRlZFxyXG4gICAgKiBAcGFyYW0gW2JlZm9yZV0gLSB0aGUgbmV3IHByb3BlcnR5IGlzIHBsYWNlZCBiZWZvcmUgdGhpcyBwcm9wZXJ0eVxyXG4gICAgKiBAcGFyYW0gW3ZhcmlhYmxlc2NvcGVdIC0gaWYgdGhpcyBzY29wZSBpcyBkZWZpbmVkIC0gdGhlIG5ldyBwcm9wZXJ0eSB3b3VsZCBiZSBpbnNlcnQgaW4gdGhpcyB2YXJpYWJsZVxyXG4gICAgKi9cclxuICAgIHNldFByb3BlcnR5SW5Db2RlKHZhcmlhYmxlTmFtZTogc3RyaW5nLCBwcm9wZXJ0eTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nLFxyXG4gICAgICAgIGNsYXNzc2NvcGU6IHsgY2xhc3NuYW1lOiBzdHJpbmcsIG1ldGhvZG5hbWU6IHN0cmluZyB9W10sXHJcbiAgICAgICAgaXNGdW5jdGlvbjogYm9vbGVhbiA9IGZhbHNlLCByZXBsYWNlOiBib29sZWFuID0gdW5kZWZpbmVkLFxyXG4gICAgICAgIGJlZm9yZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgcHJvcGVydHk6IHN0cmluZywgdmFsdWU/fSA9IHVuZGVmaW5lZCxcclxuICAgICAgICB2YXJpYWJsZXNjb3BlOiB7IHZhcmlhYmxlbmFtZTogc3RyaW5nLCBtZXRob2RuYW1lIH0gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB2YXIgc2NvcGUgPSB0aGlzLmdldE5vZGVGcm9tU2NvcGUoY2xhc3NzY29wZSwgdmFyaWFibGVzY29wZSk7XHJcbiAgICAgICAgdmFyIG5ld0V4cHJlc3Npb24gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHN0YXRlbWVudHM6IHRzLlN0YXRlbWVudFtdID0gc2NvcGVbXCJib2R5XCJdLnN0YXRlbWVudHNcclxuICAgICAgICBpZiAocHJvcGVydHkgPT09IFwibmV3XCIpIHsgLy9tZS5wYW5lbDE9bmV3IFBhbmVsKHt9KTtcclxuICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtcIl9uZXdfXCJdWzBdOy8vLnN1YnN0cmluZygzKV07XHJcbiAgICAgICAgICAgIHZhciBjb25zdHIgPSBwcm9wLnZhbHVlO1xyXG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgIHJlcGxhY2UgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbGVmdCA9IHByb3Aubm9kZS5nZXRUZXh0KCk7XHJcbiAgICAgICAgICAgIGxlZnQgPSBsZWZ0LnN1YnN0cmluZygwLCBsZWZ0LmluZGV4T2YoXCI9XCIpIC0gMSk7XHJcbiAgICAgICAgICAgIHByb3BlcnR5ID0gXCJfbmV3X1wiO1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIobGVmdCksIHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpKSk7XHJcbiAgICAgICAgICAgIC8qXHR9ZWxzZXsvL3ZhciBoaD1uZXcgUGFuZWwoe30pXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByb3AgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVswXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29uc3RyID0gcHJvcFswXS52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbnN0ci5zdWJzdHJpbmcoMCwgY29uc3RyLmluZGV4T2YoXCIoXCIpICsgMSkgKyB2YWx1ZSArIGNvbnN0ci5zdWJzdHJpbmcoY29uc3RyLmxhc3RJbmRleE9mKFwiKVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGdW5jdGlvbj10cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld0V4cHJlc3Npb249dHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIoXCJtZS5cIitwcm9wZXJ0eSksIHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpKSk7XHRcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVDYWxsKHRzLmNyZWF0ZUlkZW50aWZpZXIodmFyaWFibGVOYW1lICsgXCIuXCIgKyBwcm9wZXJ0eSksIHVuZGVmaW5lZCwgW3RzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpXSkpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBuZXdFeHByZXNzaW9uID0gdHMuY3JlYXRlRXhwcmVzc2lvblN0YXRlbWVudCh0cy5jcmVhdGVBc3NpZ25tZW50KHRzLmNyZWF0ZUlkZW50aWZpZXIodmFyaWFibGVOYW1lICsgXCIuXCIgKyBwcm9wZXJ0eSksIHRzLmNyZWF0ZUlkZW50aWZpZXIodmFsdWUpKSk7XHJcbiAgICAgICAgaWYgKHJlcGxhY2UgIT09IGZhbHNlICYmIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHsvL2VkaXQgZXhpc3RpbmdcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmRhdGFbdmFyaWFibGVOYW1lXVtwcm9wZXJ0eV1bMF0ubm9kZTtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5vZGUucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKG5vZGUpO1xyXG4gICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl1bcG9zXSA9IG5ld0V4cHJlc3Npb247XHJcbiAgICAgICAgICAgIC8vaWYgKHBvcyA+PSAwKVxyXG4gICAgICAgICAgICAvLyAgbm9kZS5wYXJlbnRbXCJzdGF0ZW1lbnRzXCJdLnNwbGljZShwb3MsIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7Ly9pbnNlcnQgbmV3XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUudmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBcIm5vdCBpbXBsZW1lbnRlZFwiO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBvID0gMDsgbyA8IHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldLmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldW29dLnZhbHVlID09PSBiZWZvcmUudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IHRoaXMuZGF0YVtiZWZvcmUudmFyaWFibGVuYW1lXVtiZWZvcmUucHJvcGVydHldW29dLm5vZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghbm9kZSlcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlByb3BlcnR5IG5vdCBmb3VuZCBcIiArIGJlZm9yZS52YXJpYWJsZW5hbWUgKyBcIi5cIiArIGJlZm9yZS5wcm9wZXJ0eSArIFwiIHZhbHVlIFwiICsgYmVmb3JlLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihub2RlKTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPj0gMClcclxuICAgICAgICAgICAgICAgICAgICBub2RlLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcywgMCwgbmV3RXhwcmVzc2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdHByb3A6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuZGF0YVt2YXJpYWJsZU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiX25ld19cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3Rub2RlOiB0cy5Ob2RlID0gdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF1bdGhpcy5kYXRhW3ZhcmlhYmxlTmFtZV1bcHJvcF0ubGVuZ3RoIC0gMV0ubm9kZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGVzdG5vZGUucGFyZW50ID09PSBzY29wZVtcImJvZHlcIl0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wID0gdGVzdG5vZGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdHByb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gbGFzdHByb3AucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKGxhc3Rwcm9wKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID49IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Rwcm9wLnBhcmVudFtcInN0YXRlbWVudHNcIl0uc3BsaWNlKHBvcyArIDEsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gc3RhdGVtZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcz4wJiZzdGF0ZW1lbnRzW3N0YXRlbWVudHMubGVuZ3RoIC0gMV0uZ2V0VGV4dCgpLnN0YXJ0c1dpdGgoXCJyZXR1cm4gXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3MtLTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZShwb3MsIDAsIG5ld0V4cHJlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBzd2FwcyB0d28gc3RhdGVtZW50cyBpbmRlbmRpZmllZCBieSAgZnVuY3Rpb25wYXJhbWV0ZXIgaW4gYSB2YXJpYWJsZS5wcm9wZXJ0eShwYXJhbWV0ZXIxKSB3aXRoIHZhcmlhYmxlLnByb3BlcnR5KHBhcmFtZXRlcjIpXHJcbiAgICAgKiovXHJcbiAgICBzd2FwUHJvcGVydHlXaXRoUGFyYW1ldGVyKHZhcmlhYmxlOiBzdHJpbmcsIHByb3BlcnR5OiBzdHJpbmcsIHBhcmFtZXRlcjE6IHN0cmluZywgcGFyYW1ldGVyMjogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGZpcnN0OiB0cy5Ob2RlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBzZWNvbmQ6IHRzLk5vZGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMuZGF0YVt2YXJpYWJsZV1bcHJvcGVydHldO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyZW50Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRbeF0udmFsdWUuc3BsaXQoXCIsXCIpWzBdLnRyaW0oKSA9PT0gcGFyYW1ldGVyMSlcclxuICAgICAgICAgICAgICAgIGZpcnN0ID0gcGFyZW50W3hdLm5vZGU7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRbeF0udmFsdWUuc3BsaXQoXCIsXCIpWzBdLnRyaW0oKSA9PT0gcGFyYW1ldGVyMilcclxuICAgICAgICAgICAgICAgIHNlY29uZCA9IHBhcmVudFt4XS5ub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWZpcnN0KVxyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIlBhcmFtZXRlciBub3QgZm91bmQgXCIgKyBwYXJhbWV0ZXIxKTtcclxuICAgICAgICBpZiAoIXNlY29uZClcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJQYXJhbWV0ZXIgbm90IGZvdW5kIFwiICsgcGFyYW1ldGVyMik7XHJcbiAgICAgICAgdmFyIGlmaXJzdCA9IGZpcnN0LnBhcmVudFtcInN0YXRlbWVudHNcIl0uaW5kZXhPZihmaXJzdCk7XHJcbiAgICAgICAgdmFyIGlzZWNvbmQgPSBzZWNvbmQucGFyZW50W1wic3RhdGVtZW50c1wiXS5pbmRleE9mKHNlY29uZCk7XHJcbiAgICAgICAgZmlyc3QucGFyZW50W1wic3RhdGVtZW50c1wiXVtpZmlyc3RdID0gc2Vjb25kO1xyXG4gICAgICAgIGZpcnN0LnBhcmVudFtcInN0YXRlbWVudHNcIl1baXNlY29uZF0gPSBmaXJzdDtcclxuXHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIGFkZHMgYW4gUHJvcGVydHlcclxuICAgICogQHBhcmFtIHR5cGUgLSBuYW1lIG9mIHRoZSB0eXBlIG8gY3JlYXRlXHJcbiAgICAqIEBwYXJhbSBjbGFzc3Njb3BlIC0gdGhlIHNjb3BlIChtZXRob2RuYW1lKSB3aGVyZSB0aGUgdmFyaWFibGUgc2hvdWxkIGJlIGluc2VydCBDbGFzcy5sYXlvdXRcclxuICAgICogQHBhcmFtIHZhcmlhYmxlc2NvcGUgLSB0aGUgc2NvcGUgd2hlcmUgdGhlIHZhcmlhYmxlIHNob3VsZCBiZSBpbnNlcnQgZS5nLiBoYWxsby5vbmNsaWNrXHJcbiAgICAqIEByZXR1cm5zICB0aGUgbmFtZSBvZiB0aGUgb2JqZWN0XHJcbiAgICAqL1xyXG4gICAgYWRkVmFyaWFibGVJbkNvZGUoZnVsbHR5cGU6IHN0cmluZywgY2xhc3NzY29wZTogeyBjbGFzc25hbWU6IHN0cmluZywgbWV0aG9kbmFtZTogc3RyaW5nIH1bXSwgdmFyaWFibGVzY29wZTogeyB2YXJpYWJsZW5hbWU6IHN0cmluZywgbWV0aG9kbmFtZSB9ID0gdW5kZWZpbmVkKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgdHlwZSA9IGZ1bGx0eXBlLnNwbGl0KFwiLlwiKVtmdWxsdHlwZS5zcGxpdChcIi5cIikubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgdmFyIHZhcm5hbWUgPSB0aGlzLmdldE5leHRWYXJpYWJsZU5hbWVGb3JUeXBlKHR5cGUpO1xyXG4gICAgICAgIC8vdmFyIGlmKHNjb3BlbmFtZSlcclxuICAgICAgICB2YXIgcHJlZml4ID0gXCJtZS5cIjtcclxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0Tm9kZUZyb21TY29wZShjbGFzc3Njb3BlLCB2YXJpYWJsZXNjb3BlKTtcclxuICAgICAgICB2YXIgc3RhdGVtZW50czogdHMuU3RhdGVtZW50W10gPSBub2RlW1wiYm9keVwiXS5zdGF0ZW1lbnRzO1xyXG4gICAgICAgIGlmIChub2RlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwibm8gc2NvcGUgdG8gaW5zZXJ0IGEgdmFyaWFibGUgY291bGQgYmUgZm91bmRcIik7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzdGF0ZW1lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhdGVtZW50c1t4XS5nZXRUZXh0KCkuaW5jbHVkZXMoXCJuZXcgXCIpICYmICFzdGF0ZW1lbnRzW3hdLmdldFRleHQoKS5pbmNsdWRlcyhcInZhciBcIikpXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGFzcyA9IHRzLmNyZWF0ZUFzc2lnbm1lbnQodHMuY3JlYXRlSWRlbnRpZmllcihwcmVmaXggKyB2YXJuYW1lKSwgdHMuY3JlYXRlSWRlbnRpZmllcihcIm5ldyBcIiArIHR5cGUgKyBcIigpXCIpKTtcclxuICAgICAgICBzdGF0ZW1lbnRzLnNwbGljZSh4LCAwLCB0cy5jcmVhdGVTdGF0ZW1lbnQoYXNzKSk7XHJcbiAgICAgICAgdGhpcy5hZGRUeXBlTWUodmFybmFtZSwgdHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIFwibWUuXCIgKyB2YXJuYW1lO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciBjb2RlID0gdHlwZXNjcmlwdC5nZXRDb2RlKFwicmVtb3RlL2RlL0FSLnRzXCIpO1xyXG4gICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICAgIHBhcnNlci5wYXJzZShjb2RlLCB1bmRlZmluZWQpO1xyXG4gICAgY29uc3QgcHJpbnRlciA9IHRzLmNyZWF0ZVByaW50ZXIoeyBuZXdMaW5lOiB0cy5OZXdMaW5lS2luZC5MaW5lRmVlZCB9KTtcclxuICAgIGNvbnN0IHJlc3VsdEZpbGUgPSB0cy5jcmVhdGVTb3VyY2VGaWxlKFwiZHVtbXkudHNcIiwgXCJcIiwgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdCwgZmFsc2UsIHRzLlNjcmlwdEtpbmQuVFMpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gcHJpbnRlci5wcmludE5vZGUodHMuRW1pdEhpbnQuVW5zcGVjaWZpZWQsIHBhcnNlci5zb3VyY2VGaWxlLCByZXN1bHRGaWxlKTtcclxuICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XHJcblxyXG5cclxuXHJcbn1cclxuXHJcblxyXG4iXX0=