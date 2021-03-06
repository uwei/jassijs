
import { $Class } from "jassi/remote/Jassi";


import typescript from "jassi_editor/util/Typescript";


interface Properties {
    [details: string]: Entry;
}
interface Entry {
    value?: any;
    node?: ts.Node;
}
class ParsedDecorator {
    node?: ts.Decorator;
    name?: string;
    parsedParameter?: object[] = [];
    parameter?: string[] = [];

}
class ParsedMember {
    node?: ts.Node;
    name?: string;
    decorator?: { [name: string]: ParsedDecorator } = {};
    type?: string;
}
export class ParsedClass {
    parent?: Parser;
    node?: ts.ClassElement;
    name?: string;
    fullClassname?: string;
    members?: { [name: string]: ParsedMember } = {};
    decorator?: { [name: string]: ParsedDecorator } = {};
}
@$Class("jassi_editor.base.Parser")
export class Parser {
    sourceFile: ts.SourceFile = undefined;
    typeMeNode: ts.Node;
    typeMe: { [name: string]: Entry } = {};
    classes: { [name: string]: ParsedClass } = {};
    imports: { [name: string]: string } = {};
    functions: { [name: string]: ts.Node } = {};

    collectProperties: { classname: string, methodname: string }[];
    code: string;
    /**
    * @member {Object.<string,Object.<string,[object]>> - all properties
    * e.g. data["textbox1"][value]->Entry
    */
    data: { [variable: string]: { [property: string]: Entry[] } };
    /**
     * parses Code for UI relevant settings
     * @class jassi_editor.util.Parser
     */
    constructor() {

        this.data = {};
        /** {[string]} - all code lines*/
    }

    getModifiedCode(): string {
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
    private add(variable: string, property: string, value: string, node: ts.Node) {

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
    getPropertyValue(variable, property): any {
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

    addTypeMe(name: string, type: string) {
        if (!this.typeMeNode)
            return;
        var tp = ts.createTypeReferenceNode(type, []);
        var newnode = ts.createPropertySignature(undefined, name + "?", undefined, tp, undefined);
        this.typeMeNode["members"].push(newnode);
    }
    addImportIfNeeded(name: string, file: string) {
        if (this.imports[name] === undefined) {
            var imp = ts.createNamedImports([ts.createImportSpecifier(undefined, ts.createIdentifier(name))]);
            const importNode = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, imp), ts.createLiteral(file));
            this.sourceFile = ts.updateSourceFileNode(this.sourceFile, [importNode, ...this.sourceFile.statements]);
        }
    }
    private parseTypeMeNode(node: ts.Node) {
        var _this = this;
        if (node.kind === ts.SyntaxKind.TypeLiteral) {
            if (node["members"])
                this.typeMeNode = node;
            node["members"].forEach(function (tnode: any) {
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
    convertArgument(arg: any) {
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
        } else if (arg.kind === ts.SyntaxKind.StringLiteral) {
            return arg.text;
        } else if (arg.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            let ret = [];
            for (var p = 0; p < arg.elements.length; p++) {
                ret.push(this.convertArgument(arg.elements[p]));
            }
            return ret;
        } else if (arg.kind === ts.SyntaxKind.Identifier) {
            return arg.text;
        } else if (arg.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        } else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        } else if (arg.kind === ts.SyntaxKind.NumericLiteral) {
            return Number(arg.text);
        } else if (arg.kind === ts.SyntaxKind.ArrowFunction) {
            return arg.getText();
        }

        throw "Error type not found";
    }
    private parseDecorator(dec: ts.Decorator): ParsedDecorator {
        var ex: any = dec.expression;
        var ret = new ParsedDecorator();
        if (ex.expression === undefined) {
            ret.name = ex.text;
        } else {

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

    private parseClass(node: ts.ClassElement) {
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
                var parsedMem = new ParsedMember()
                var mem = node["members"][x];
                if (mem.name === undefined)
                    continue;//Constructor
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
    parseProperties(node: ts.Node) {
        if (ts.isVariableDeclaration(node)) {
            var name = node.name.getText();
            var value = node.initializer.getText();
            this.add(name, "_new_", value, node.parent.parent);
        }
        if ((ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) ||
            ts.isCallExpression(node)) {
            var node1;
            var node2;
            var left: string;
            var value: string;
            if (ts.isBinaryExpression(node)) {
                node1 = node.left;
                node2 = node.right;
                left = node1.getText();// this.code.substring(node1.pos, node1.end).trim();
                value = node2.getText();//this.code.substring(node2.pos, node2.end).trim();
                if (value.startsWith("new "))
                    this.add(left, "_new_", value, node.parent);
            }
            if (ts.isCallExpression(node)) {
                node1 = node.expression;
                node2 = node.arguments;
                left = node1.getText();// this.code.substring(node1.pos, node1.end).trim();
                var params = [];
                node.arguments.forEach((arg) => { params.push(arg.getText()) });
                value = params.join(", ");//this.code.substring(node2.pos, node2.end).trim();//
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
    private visitNode(node: ts.Node) {
        var _this = this;
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            var nd: any = node;
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
        } else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            this.parseClass(<ts.ClassElement>node);

        } else if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) {//functions out of class
            this.functions[node["name"].text] = node;
            if (this.collectProperties) {
                for (let x = 0; x < this.collectProperties.length; x++) {
                    var col = this.collectProperties[x];
                    if (col.classname === undefined && node["name"].text === col.methodname)
                        this.parseProperties(node);
                }
            }
        } else
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
    parse(code: string, collectProperties: { classname: string, methodname: string }[] = undefined) {
        this.data = {};
        this.code = code;
        this.collectProperties = collectProperties;

        this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true);
        this.visitNode(this.sourceFile);

        //return this.parseold(code,onlyfunction);
    }
    private removeNode(node: ts.Node) {
        if (node.parent["statements"]) {
            var pos = node.parent["statements"].indexOf(node);
            if (pos >= 0)
                node.parent["statements"].splice(pos, 1);
        } else if (node.parent.parent["type"] !== undefined) {
            var pos = node.parent.parent["type"]["members"].indexOf(node);
            if (pos >= 0)
                node.parent.parent["type"]["members"].splice(pos, 1);
        } else if (node.parent["members"] !== undefined) {
            var pos = node.parent["members"].indexOf(node);
            if (pos >= 0)
                node.parent["members"].splice(pos, 1);
        } else
            throw Error(node.getFullText() + "could not be removed");
    }
    /** 
     * modify a member 
     **/
    addOrModifyMember(member: ParsedMember, pclass: ParsedClass) {
        //member.node
        //var newmember=ts.createProperty
        var newdec: ts.Decorator[] = undefined;
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
                node = pclass.members[key].node
        }
        if (node === undefined) {
            pclass.node["members"].push(newmember);

        } else {
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
    removePropertyInCode(property: string, onlyValue = undefined, variablename: string = undefined) {
        if (this.data[variablename] !== undefined && this.data[variablename][property] !== undefined) {
            var prop: Entry = undefined;
            if (onlyValue !== undefined) {
                for (var x = 0; x < this.data[variablename][property].length; x++) {
                    if (this.data[variablename][property][x].value === onlyValue) {
                        prop = this.data[variablename][property][x];
                    }
                }
            } else
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
    removeVariableInCode(varname: string) {

        var prop = this.data[varname];
        var allprops: Entry[] = [];
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
            props?.forEach((p) => {
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
    private getNodeFromScope(classscope: { classname: string, methodname: string }[], variablescope: { variablename: string, methodname } = undefined): ts.Node {
        var scope;
        if (variablescope) {
            scope = this.data[variablescope.variablename][variablescope.methodname][0]?.node;
            scope = scope.expression.arguments[0];
        } else {
            for (var i = 0; i < classscope.length; i++) {
                var sc = classscope[i];
                if (sc.classname) {
                    scope = this.classes[sc.classname]?.members[sc.methodname]?.node;
                    if (scope)
                        break;
                } else {//exported function
                    scope = this.functions[sc.methodname];
                }
            }
        }
        return scope;
    }
    /**
     * gets the next variablename
     * */
    getNextVariableNameForType(type: string) {
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
    setPropertyInCode(variableName: string, property: string, value: string,
        classscope: { classname: string, methodname: string }[],
        isFunction: boolean = false, replace: boolean = undefined,
        before: { variablename: string, property: string, value?} = undefined,
        variablescope: { variablename: string, methodname } = undefined) {
        var scope = this.getNodeFromScope(classscope, variablescope);
        var newExpression = undefined;
        var statements: ts.Statement[] = scope["body"].statements
        if (property === "new") { //me.panel1=new Panel({});
            let prop = this.data[variableName]["_new_"][0];//.substring(3)];
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
        } else if (isFunction) {
            newExpression = ts.createExpressionStatement(ts.createCall(ts.createIdentifier(variableName + "." + property), undefined, [ts.createIdentifier(value)]));
        } else
            newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(variableName + "." + property), ts.createIdentifier(value)));
        if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) {//edit existing
            let node = this.data[variableName][property][0].node;
            var pos = node.parent["statements"].indexOf(node);
            node.parent["statements"][pos] = newExpression;
            //if (pos >= 0)
            //  node.parent["statements"].splice(pos, 1);
        } else {//insert new
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
            } else {
                var lastprop: ts.Node = undefined;
                for (let prop in this.data[variableName]) {
                    if (prop === "_new_")
                        continue;
                    var testnode: ts.Node = this.data[variableName][prop][this.data[variableName][prop].length - 1].node;
                    if (testnode.parent === scope["body"])
                        lastprop = testnode;
                }
                if (lastprop) {
                    var pos = lastprop.parent["statements"].indexOf(lastprop);
                    if (pos >= 0)
                        lastprop.parent["statements"].splice(pos + 1, 0, newExpression);
                } else {
                    var pos = statements.length;
                    if (statements[statements.length - 1].getText().startsWith("return "))
                        pos--;
                    statements.splice(pos, 0, newExpression);
                }
            }
        }
    }
    /**
     * swaps two statements indendified by  functionparameter in a variable.property(parameter1) with variable.property(parameter2)
     **/
    swapPropertyWithParameter(variable: string, property: string, parameter1: string, parameter2: string) {
        var first: ts.Node = undefined;
        var second: ts.Node = undefined;
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
    addVariableInCode(fulltype: string, classscope: { classname: string, methodname: string }[], variablescope: { variablename: string, methodname } = undefined): string {
        let type = fulltype.split(".")[fulltype.split(".").length - 1];
        var varname = this.getNextVariableNameForType(type);
        //var if(scopename)
        var prefix = "me.";
        var node = this.getNodeFromScope(classscope, variablescope);
        var statements: ts.Statement[] = node["body"].statements;
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
}

export async function test() {
    var code = typescript.getCode("remote/de/AR.ts");
    var parser = new Parser();
    parser.parse(code, undefined);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
    const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
    console.log(result);



}


