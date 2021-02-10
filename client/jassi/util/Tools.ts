import jassi, { $Class } from "remote/jassi/base/Jassi";
import "jassi/ext/typescript";
//@ts-ignore
import lodash from "jassi/ext/lodash";
@$Class("jassi.util.Tools")
export class Tools {

    constructor() {
    }

    static copyObject(src) {
        //var j = Tools.objectToJson(src);
        //return Tools.jsonToObject(j);
        lodash();
        //@ts-ignore
        return _.cloneDeep(src);

    }
    /**
           * converts a json string to a object
           * @param {string} value - the code
           */
    static jsonToObject(code: string) {
        //var ret=eval("("+value+")");
        code = "a=" + code;
        var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
        var ret = Tools.visitNode2(sourceFile);
        return ret;
    }
    private static replaceQuotes(value): any {
        if (Array.isArray(value)) {
            for (var x = 0;x < value.length;x++) {
                if (typeof (value[x]) === "object") {
                    value[x] = this.replaceQuotes(value[x]);
                }
            }
            return value;
        }
        //if (typeof (value) === "object") {
        var ret = {};
        for (var key in value) {
            var newkey = "$%)" + key + "$%)";
            ret[newkey] = value[key];
            if (typeof value[key] === "object") {
                ret[newkey] = this.replaceQuotes(ret[newkey]);
            }
        }
        return ret;
        //}

    }
    /**
   * converts a string to a object
   * @param value - the object to stringify
   * @param space - the space before the property
   * @param nameWithQuotes - if true "key":value else key:value
   */
    static objectToJson(value, space = undefined, nameWithQuotes: boolean = true) {
        var ovalue = value;
        if (nameWithQuotes === false)
            ovalue = Tools.replaceQuotes(Tools.copyObject( ovalue));
        var ret: string = JSON.stringify(ovalue, function(key, value) {
            if (typeof (value) === "function") {
                let r = value.toString();
                r = r.replaceAll("\r" + space, "\r");
                r = r.replaceAll("\n" + space, "\n");
                r = r.replaceAll("\r", "$§&\r");
                r = r.replaceAll("\n", "$§&\n");
                r = r.replaceAll("\t", "$§&\t");
                r = r.replaceAll('\"', '$§&\"');
                //  ret=ret.replace("\t\t","");
                return "$%&" + r + "$%&";
            }
            return value;
        }, "\t");
        if (ret !== undefined) {
            ret = ret.replaceAll("\"$%&", "");
            ret = ret.replaceAll("$%&\"", "");
            //  ret = ret.replaceAll("\\r", "\r");
            //  ret = ret.replaceAll("\\n", "\n");
            //  ret = ret.replaceAll("\\t", "\t");
            //  ret = ret.replaceAll('\\"', '\"');
        }
        if (nameWithQuotes === false) {
            ret = ret.replaceAll("\"$%)", "");
            ret = ret.replaceAll("$%)\"", "");
        }
        ret=ret.replaceAll("$§&\\n","\n");
        ret=ret.replaceAll("$§&\\r","\t");
        ret=ret.replaceAll("$§&\\t","\t");
        ret=ret.replaceAll('$§&\\"','\"');
        //one to much
        //  ret=ret.substring(0,ret.length-2)+ret.substring(ret.length-1);
        return ret;
    }
    private static toText(node: ts.Node, text: string): string {
        return text.substring(node.pos, node.end).trim();
    }
    private static getValueFromNode(node: ts.Node, val: any, prop: any) {

    }
    private static visitObject(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            var ret = {};
            for (var i = 0;i < node["properties"].length;i++) {
                var s = node["properties"][i];
                var name = s["name"].text;
                ret[name] = Tools.visitObject(s["initializer"]);
            }
            return ret;
        } else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) {//[]
            let ret = [];
            for (let i = 0;i < node["elements"].length;i++) {
                let ob = this.visitObject(node["elements"][i]);
                ret.push(ob);
                /* if (s["initializer"].elements[i].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                     ob[name].push(_newob);
                     Tools.visitNode2(code, s["initializer"].elements[i], _newob);
                 }*/
            }
            return ret;
        } else if (node.kind === ts.SyntaxKind.StringLiteral) {
            return node.getText().substring(1, node.getText().length - 1);
        } else if (node.kind === ts.SyntaxKind.NumericLiteral) {
            return new Number(node.getText());
        } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        } else if (node.getText().startsWith("function")) {
            var func = function() {
                return node.getText();
            };
            func.toString = function() {
                return node.getText();
            }
            return func;
        } else {
            return node.getText();
        }
    }
    private static visitNode2(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            return Tools.visitObject(node);
        } else {
            var childs = node.getChildren();
            for (var x = 0;x < childs.length;x++) {
                var ret = Tools.visitNode2(childs[x]);
                if (ret)
                    return ret;
            }
        }
        return undefined;
    }
    private static visitNode(code: string, node: ts.Node, ob: any) {
        if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            node["properties"].forEach((s: ts.Node) => {

                var name = s["name"].text;

                var val = s["initializer"].getText(); //Tools.toText(s["initializer"], code);
                if (s["initializer"].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                    ob[name] = {};
                    Tools.visitNode(code, s, ob[name]);

                } else {
                    if (s["initializer"].kind === ts.SyntaxKind.StringLiteral) {
                        ob[name] = val;
                    } else
                        ob[name] = val;
                }
            });

        } else
            node.getChildren().forEach(c => {
                Tools.visitNode(code, c, ob);
            });
    }
    /**
     * parse a json string and returns an object an embed all values in string
     * e.g. 
     * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
     **/
    static jsonToStringObject(code: string) {
        code = "a=" + code;
        var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
        var ret = {};
        Tools.visitNode(code, sourceFile, ret);
        return ret;
    }
    private static _stringObjectToJson(ob: any, ret: any) {

        for (var key in ob) {
            if (typeof (ob[key]) === "string") {
                ret[key] = "%&&/" + ob[key] + "%&&/";
            } else {
                ret[key] = {}
                Tools._stringObjectToJson(ob[key], ret[key]);
            }
        }
    }
    /**
    * parse a json string and returns an object an embed all values in string
    * e.g. 
    * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
    **/
    static stringObjectToJson(ob: any, space: string) {
        var ret = {};
        Tools._stringObjectToJson(ob, ret);
        var sret = JSON.stringify(ret, function(key, value) {
            //rename propertynames
            if (typeof (value) === "object") {
                var keys = Object.assign({}, value);
                for (var key in keys) {
                    value["<<&START" + key + "END&>>"] = value[key];
                    delete value[key];
                }
            }
            return value;
        }, "      ");
        sret = sret.replaceAll("\\\"%&&/", "").replaceAll("%&&/\\\"", "");
        sret = sret.replaceAll("\"%&&/", "").replaceAll("%&&/\"", "");
        var aret = sret.split("\r");
        for (let x = 0;x < aret.length;x++) {
            aret[x] = space + aret[x];
        }

        var r = aret.join("\r");
        r = r.replaceAll("\\r", "\r");
        r = r.replaceAll("\\n", "\n");
        r = r.replaceAll("\\t", "\t");
        r = r.replaceAll("\"<<&START", "");
        r = r.replaceAll("END&>>\"", "");
        return r;
    }
}

export async function test() {
    var k = Tools.objectToJson({        
a: "h\no", b: 1, function() {
            var ad = "\n";
        }    
});
    var k2 = Tools.jsonToObject(k);
    var code = `{ 
	g:function(){
		return 1;
		
	}
	a:"hallo",
	i:{
		b:9,
		c:"test"
		}
	} `;
    var h = await Tools.jsonToStringObject(code);
    var h2 = Tools.stringObjectToJson(h, "    ");
    var j = {        
body: [
            ['Item', 'Price'],
            {
                foreach: "line in invoice.lines", do: [
                    '{{line.text}}', '{{line.price}}'
                ]
            }
        ]    
}
    var j2 = Tools.objectToJson(j, undefined, false)
    var g = Tools.jsonToObject(j2);
}














