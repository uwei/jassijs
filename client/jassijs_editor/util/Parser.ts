
import { $Class } from "jassijs/remote/Registry";


import typescript from "jassijs_editor/util/Typescript";
import { Tests } from "jassijs/base/Tests";
import { Test } from "jassijs/remote/Test";
import { JassiError } from "jassijs/remote/Classes";


interface Properties {
    [details: string]: Entry;
}
interface Entry {
    value?: any;
    node?: ts.Node;
    isFunction: boolean;
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
@$Class("jassijs_editor.util.Parser")
export class Parser {
    sourceFile: ts.SourceFile = undefined;
    typeMeNode: ts.Node;
    typeMe: { [name: string]: Entry } = {};
    classes: { [name: string]: ParsedClass } = {};
    imports: { [name: string]: string } = {};
    functions: { [name: string]: ts.Node } = {};
    variables: { [name: string]: ts.Node } = {};
    classScope: { classname: string, methodname: string }[];

    code: string;
    /**
    * @member {Object.<string,Object.<string,[object]>> - all properties
    * e.g. data["textbox1"][value]->Entry
    */
    data: { [variable: string]: { [property: string]: Entry[] } };
    /**
     * parses Code for UI relevant settings
     * @class jassijs_editor.util.Parser
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
    private add(variable: string, property: string, value: string, node: ts.Node, isFunction = false) {

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
    /**
     * add import {name} from file
     * @param name 
     * @param file 
     */
    addImportIfNeeded(name: string, file: string) {
        if (this.imports[name] === undefined) {
            //@ts-ignore
            var imp = ts.createNamedImports([ts.createImportSpecifier(false, undefined, ts.createIdentifier(name))]);
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
                    _this.typeMe[name] = { node: tnode, value: stype, isFunction: false };
                }
                //            this.add("me", name, "typedeclaration:" + stype, undefined, aline, aline);
            });
        }
        node.getChildren().forEach(c => this.parseTypeMeNode(c));
    }
    private convertArgument(arg: any) {
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
        } else if (arg.kind === ts.SyntaxKind.ArrowFunction||arg.kind===ts.SyntaxKind.FunctionExpression) {
            return arg.getText();
        }

        throw new JassiError("Error type not found");
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
    private parseConfig(node: ts.CallExpression) {
        if (node.arguments.length > 0) {
            var left = node.expression.getText();
            var lastpos = left.lastIndexOf(".");
            var variable = left;
            var prop = "";
            if (lastpos !== -1) {
                variable = left.substring(0, lastpos);
                prop = left.substring(lastpos + 1);
                //@ts-ignore
                var props: any[] = node.arguments[0].properties;
                if (props !== undefined) {
                    for (var p = 0; p < props.length; p++) {
                        var name = props[p].name.text;
                        // var value = this.convertArgument(props[p].initializer);
                        var code: string = props[p].initializer ? props[p].initializer.getText() : "";
                        if (code?.indexOf(".config") > -1) {
                            this.parseProperties(props[p].initializer);
                        }
                        this.add(variable, name, code, props[p], false);
                    }
                }
            }
        }
    }
    private parseProperties(node: ts.Node) {
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
            var left: string;
            var value: string;
            var _this = this;
            var isFunction = false;
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
                isFunction = true;
                left = node1.getText();// this.code.substring(node1.pos, node1.end).trim();
                var params = [];
                node.arguments.forEach((arg) => {

                    params.push(arg.getText());
                    if ((<any>arg)?.expression?.name?.getText() === "config") {
                        _this.parseConfig(<any>arg);
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
                    this.visitNode(node.arguments[0]["body"],true)
                    //this.parseProperties(node.arguments[0]["body"]);
                }
                value = params.join(", ");//this.code.substring(node2.pos, node2.end).trim();//
            }

            var lastpos = left.lastIndexOf(".");
            var variable = left;
            var prop = "";
            if (lastpos !== -1) {
                variable = left.substring(0, lastpos);
                prop = left.substring(lastpos + 1);
            }
            this.add(variable, prop, value, node.parent, isFunction);
        } else
            node.getChildren().forEach(c => this.visitNode(c,true));
    }
    private visitNode(node: ts.Node,consumeProperties=undefined) {
        var _this = this;
        if (node.kind === ts.SyntaxKind.VariableDeclaration) {
            this.variables[node["name"].text] = node;
        }
        if (node.kind === ts.SyntaxKind.ImportDeclaration) {
            var nd: any = node;
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
        } else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            this.parseClass(<ts.ClassElement>node);
            return;
        } else if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) {//functions out of class
            this.functions[node["name"].text] = node;
            if (this.classScope) {
                for (let x = 0; x < this.classScope.length; x++) {
                    var col = this.classScope[x];
                    if (col.classname === undefined && node["name"].text === col.methodname)
                        consumeProperties=true;
                }
            } else
                consumeProperties=true;
        } 
        if(consumeProperties)
            this.parseProperties(node);
        else
            node.getChildren().forEach(c => this.visitNode(c,consumeProperties));
        //TODO remove this block
      /*  if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
            this.add(node["name"].text, "", "", undefined);
        }*/
    }
    searchClassnode(node: ts.Node, pos: number): { classname: string, methodname: string } {
        if (ts.isMethodDeclaration(node)) {
            return {
                classname: node.parent["name"]["text"],
                methodname: node.name["text"]
            }
        }
        if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) {//functions out of class
            var funcname = node["name"].text
            return {
                classname: undefined,
                methodname: funcname
            }
        }
        var childs = node.getChildren();
        for (var x = 0; x < childs.length; x++) {
            var c = childs[x];
            if (pos >= c.pos && pos <= c.end) {
                var test = this.searchClassnode(c, pos);
                if (test)
                    return test;
            }
        };
        return undefined;
    }
    getClassScopeFromPosition(code: string, pos: number): { classname: string, methodname: string } {
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
    parse(code: string, classScope: { classname: string, methodname: string }[] = undefined) {
        this.data = {};
        this.code = code;
        if (classScope !== undefined)
            this.classScope = classScope;
        else
            classScope = this.classScope;

        this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true);
        if(this.classScope===undefined)
            this.visitNode(this.sourceFile,true);
        else
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
        } else if (node.parent["properties"] !== undefined) {
            var pos = node.parent["properties"].indexOf(node);
            if (pos >= 0)
                node.parent["properties"].splice(pos, 1);
        } else if (node.parent["elements"] !== undefined) {
            var pos = node.parent["elements"].indexOf(node);
            if (pos >= 0)
                node.parent["elements"].splice(pos, 1);
         }else if(node.parent.kind===ts.SyntaxKind.ExpressionStatement){
              var pos = node.parent.parent["statements"].indexOf(node.parent);
            if (pos >= 0)
                node.parent.parent["statements"].splice(pos, 1);
         }else
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
    removePropertyInCode(property: string, onlyValue = undefined, variablename: string = undefined): ts.Node {
        if (this.data[variablename] !== undefined && this.data[variablename].config !== undefined && property === "add") {
            property = "children";
            var oldparent: any = this.data[variablename][property][0].node;
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
            var prop: Entry = undefined;
            if (onlyValue !== undefined) {
                for (var x = 0; x < this.data[variablename][property].length; x++) {
                    if (this.data[variablename][property][x].value === onlyValue || this.data[variablename][property][x].value.startsWith(onlyValue + ".")) {
                        prop = this.data[variablename][property][x];
                    }
                }
            } else
                prop = this.data[variablename][property][0];
            if (prop == undefined)
                return;
            this.removeNode(prop.node);
            if (prop.node["expression"]?.arguments?.length > 0) {
                return prop.node["expression"]?.arguments[0];
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
    removeVariablesInCode(varnames: string[]) {
        var allprops: Entry[] = [];
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
                props?.forEach((p) => {
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
        }

    }
    private getNodeFromScope(classscope: { classname: string, methodname: string }[], variablescope: { variablename: string, methodname } = undefined): ts.Node {
        var scope;
        if(classscope===undefined){
            return this.sourceFile;
        }
        if (variablescope) {
            scope = this.data[variablescope.variablename][variablescope.methodname][0]?.node;
            if (scope.expression)
                scope = scope.expression.arguments[0];
            else
                scope = scope.initializer;

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
    getNextVariableNameForType(type: string, suggestedName: string = undefined) {
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
    private switchToMutlilineIfNeeded(node: ts.Node, newProperty: string, newValue) {
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
    private setPropertyInConfig(variableName: string, property: string, value: string | ts.Node,
        isFunction: boolean = false, replace: boolean = undefined,
        before: { variablename: string, property: string, value?} = undefined,
        scope: ts.Node) {

        var svalue: any = typeof value === "string" ? ts.createIdentifier(value) : value;
        var config = <any>this.data[variableName]["config"][0].node;
        config = config.arguments[0];
        var newExpression = ts.createPropertyAssignment(property, <any>svalue);
        if (property === "add" && replace === false) {
            property = "children";
            svalue = typeof value === "string" ? ts.createIdentifier(value + ".config({})") : value;
            if (this.data[variableName]["children"] == undefined) {//
                newExpression = ts.createPropertyAssignment(property, ts.createArrayLiteral([svalue], true));
                config.properties.push(newExpression);
            } else {
                if (before === undefined) {
                    //@ts-ignore
                    this.data[variableName]["children"][0].node.initializer.elements.push(svalue);
                } else {
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
        } else {  //comp.add(a) --> comp.config({children:[a]})
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) {//edit existing
                let node = this.data[variableName][property][0].node;
                var pos = config.properties.indexOf(node);
                config.properties[pos] = newExpression;
                this.switchToMutlilineIfNeeded(config, property, value);
            } else {
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
    setPropertyInCode(variableName: string, property: string, value: string | ts.Node,
        classscope: { classname: string, methodname: string }[],
        isFunction: boolean = false, replace: boolean = undefined,
        before: { variablename: string, property: string, value?} = undefined,
        variablescope: { variablename: string, methodname } = undefined) {

        if (this.data[variableName] === undefined)
            this.data[variableName] = {};
        if (classscope === undefined)
            classscope = this.classScope;
        var scope = this.getNodeFromScope(classscope, variablescope);
        var newExpression = undefined;
        if (this.data[variableName]["config"] !== undefined&&property !== "new") {
            this.setPropertyInConfig(variableName, property, value, isFunction, replace, before, scope);
            return;
        }
        var newValue: any = typeof value === "string" ? ts.createIdentifier(value) : value;
        var statements: ts.Statement[] = scope["body"]?scope["body"].statements:scope["statements"];
        if (property === "new") { //me.panel1=new Panel({});
            let prop = this.data[variableName]["_new_"][0];//.substring(3)];
            var constr = prop.value;
            value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
            replace = true;
            var left = prop.node.getText();
            left = left.substring(0, left.indexOf("=") - 1);
            property = "_new_";
            newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), newValue));
        } else if (isFunction) {
            newExpression = ts.createExpressionStatement(ts.createCall(
                ts.createIdentifier(property===""?variableName:(variableName + "." + property)), undefined, [newValue]));
        } else
            newExpression = ts.createExpressionStatement(ts.createAssignment(
                ts.createIdentifier(property===""?variableName:(variableName + "." + property)), newValue));
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
                    if (prop === "_new_") {
                        //should be in the same scope of declaration (important for repeater)
                        statements = this.data[variableName][prop][0].node.parent["statements"];
                        continue;
                    }
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
                    try {
                        if (pos > 0 && statements[statements.length - 1].getText().startsWith("return "))
                            pos--;
                    } catch {

                    }
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
        if(this.data[variable]["config"]&&property==="add"){
            var children=(<any>this.data[variable]["children"][0].node).initializer.elements;
            var ifirst;
            var isecond;
            
            for(var x=0;x<children.length;x++){
                var text=children[x].getText()
                if(text===parameter1||text.startsWith(parameter1+".config")){
                    ifirst=x;
                }
                if(text===parameter2||text.startsWith(parameter2+".config")){
                    isecond=x;
                }
            }
            var temp=children[ifirst];
            children[ifirst]=children[isecond];
            children[isecond]=temp;
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
    addVariableInCode(fulltype: string, classscope: { classname: string, methodname: string }[], variablescope: { variablename: string, methodname } = undefined, suggestedName = undefined): string {
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
        if (node?.parameters?.length > 0 && node.parameters[0].name.text == "me") {
            useMe = true;
        }
        var prefix = useMe ? "me." : "var ";
        if (node === undefined)
            throw Error("no scope to insert a variable could be found");
       
        var statements: ts.Statement[] = node["body"]?node["body"].statements:node["statements"];
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
}

export async function tests(t:Test){
    function clean(s:string):string{
        return s.replaceAll("\t","").replaceAll("\r","").replaceAll("\n","")
    }
    await typescript.waitForInited;
    var parser=new Parser();
    parser.parse("var j;j.config({children:[a,b,c]})");
    parser.swapPropertyWithParameter("j","add","c","a");
    t.expectEqual(clean(parser.getModifiedCode())==='var j;j.config({ children: [c, b, a] });');
    parser.parse("var j;j.add(a);j.add(b);j.add(c);");
    parser.swapPropertyWithParameter("j","add","c","a");
    t.expectEqual(clean(parser.getModifiedCode())==='var j;j.add(c);j.add(b);j.add(a);');
   
    
    parser.parse("class A{}");
    t.expectEqual(parser.classes.A!==undefined);
    parser.parse("var a=8;");
    t.expectEqual(parser.data.a!==undefined);
    parser.parse("b=8;");
    t.expectEqual(parser.data.b!==undefined);
    parser.parse("b=8",[{classname:undefined,methodname:"test"}]);
    t.expectEqual(parser.data.b===undefined);
    var scope=[{classname:undefined,methodname:"test"}];
    parser.parse("function test(){b=8;}",scope);
    t.expectEqual(parser.data.b!==undefined);
    
    parser.addVariableInCode("MyClass",scope);
    parser.setPropertyInCode("myclass","a","9",scope);
    t.expectEqual(clean(parser.getModifiedCode())==="function test() { var myclass = new MyClass(); b = 8; myclass.a = 9; }");
    
    parser=new Parser();
    parser.parse("");
    parser.addVariableInCode("MyClass",undefined);
    parser.setPropertyInCode("myclass","a","9",undefined);
    t.expectEqual(clean(parser.getModifiedCode())==="var myclass = new MyClass();myclass.a = 9;");

}
export async function test() {
    tests(new Test());
   
    await typescript.waitForInited;
    var code = typescript.getCode("demo/Dialog2.ts");
    var parser = new Parser();
    // code = "function test(){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1,j:ppp.config({pp:9})})     }); }";
    // code = "function(test){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1},j(){j2.udo=9})     }); }";
    // code = "function test(){var ppp;var aaa=new Button();ppp.config({a:[9,6],  children:[ll.config({}),aaa.config({u:1,o:2,children:[kk.config({})]})]});}";
    //parser.parse(code, undefined);
    //code="reportdesign={k:9};";
    
    parser.parse(code,[{ classname: "Dialog2", methodname: "layout" }]);// [{ classname: "TestDialogBinder", methodname: "layout" }]);
 
    parser.setPropertyInCode("me.table","new",'new Table({\n      paginationSize: 1\n})',undefined);
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



