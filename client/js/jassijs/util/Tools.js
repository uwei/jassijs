var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    var Tools_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tools = void 0;
    //@ts-ignore
    //import lodash from "jassijs/ext/lodash";
    let Tools = Tools_1 = class Tools {
        constructor() {
        }
        static copyObject(obj) {
            if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
                return obj;
            if (obj instanceof Date || typeof obj === "object")
                var temp = new obj.constructor(); //or new Date(obj);
            else
                var temp = obj.constructor();
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    obj['isActiveClone'] = null;
                    temp[key] = Tools_1.copyObject(obj[key]);
                    delete obj['isActiveClone'];
                }
            }
            return temp;
        }
        /*   static copyObject(src) {
              lodash();
               //@ts-ignore
               return _.cloneDeep(src);
       
           }*/
        /**
               * converts a json string to a object
               * @param {string} value - the code
               */
        static jsonToObject(code) {
            //var ret=eval("("+value+")");
            code = "a=" + code;
            var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
            var ret = Tools_1.visitNode2(sourceFile);
            return ret;
        }
        static replaceQuotes(value) {
            if (Array.isArray(value)) {
                for (var x = 0; x < value.length; x++) {
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
        static objectToJson(value, space = undefined, nameWithQuotes = true, lengthForLinebreak = undefined) {
            var ovalue = value;
            if (nameWithQuotes === false)
                ovalue = Tools_1.replaceQuotes(Tools_1.copyObject(ovalue));
            var ret = JSON.stringify(ovalue, function (key, value) {
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
            ret = ret.replaceAll("$§&\\n", "\n");
            ret = ret.replaceAll("$§&\\r", "\t");
            ret = ret.replaceAll("$§&\\t", "\t");
            ret = ret.replaceAll('$§&\\"', '\"');
            //stick linebreak together
            /* {
                  a:1,
                  b:2
               }
               wird
               { a:1, b:2}
            }*/
            if (lengthForLinebreak) {
                let pos = 0;
                var sret = "";
                var startBlock = undefined;
                var startBlock2 = undefined;
                for (var x = 0; x < ret.length; x++) {
                    if (ret[x] === "{") {
                        startBlock = x;
                    }
                    if (ret[x] === "[") {
                        startBlock2 = x;
                    }
                    if (ret[x] === "}" && startBlock !== undefined) {
                        var test = ret.substring(startBlock, x);
                        if (test.length < lengthForLinebreak) {
                            var neu = ret.substring(0, startBlock);
                            var rep = test.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "");
                            neu += rep;
                            neu += ret.substring(x);
                            ret = neu;
                            x = startBlock + rep.length + 1;
                            startBlock = undefined;
                        }
                    }
                    if (ret[x] === "]" && startBlock2 !== undefined) {
                        var test = ret.substring(startBlock2, x);
                        if (test.length < lengthForLinebreak) {
                            var neu = ret.substring(0, startBlock2);
                            var rep = test.replaceAll("\r", "").replaceAll("\n", "").replaceAll("\t", "");
                            neu += rep;
                            neu += ret.substring(x);
                            ret = neu;
                            x = startBlock2 + rep.length + 1;
                            startBlock2 = undefined;
                        }
                    }
                }
            }
            //one to much
            //  ret=ret.substring(0,ret.length-2)+ret.substring(ret.length-1);
            return ret;
        }
        static toText(node, text) {
            return text.substring(node.pos, node.end).trim();
        }
        static getValueFromNode(node, val, prop) {
        }
        static visitObject(node) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                var ret = {};
                for (var i = 0; i < node["properties"].length; i++) {
                    var s = node["properties"][i];
                    var name = s["name"].text;
                    ret[name] = Tools_1.visitObject(s["initializer"]);
                }
                return ret;
            }
            else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) { //[]
                let ret = [];
                for (let i = 0; i < node["elements"].length; i++) {
                    let ob = this.visitObject(node["elements"][i]);
                    ret.push(ob);
                    /* if (s["initializer"].elements[i].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                         ob[name].push(_newob);
                         Tools.visitNode2(code, s["initializer"].elements[i], _newob);
                     }*/
                }
                return ret;
            }
            else if (node.kind === ts.SyntaxKind.StringLiteral) {
                return node.getText().substring(1, node.getText().length - 1);
            }
            else if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return new Number(node.getText());
            }
            else if (node.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (node.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (node.getText().startsWith("function")) {
                var func = function () {
                    return node.getText();
                };
                func.toString = function () {
                    return node.getText();
                };
                return func;
            }
            else {
                return node.getText();
            }
        }
        static visitNode2(node) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                return Tools_1.visitObject(node);
            }
            else {
                var childs = node.getChildren();
                for (var x = 0; x < childs.length; x++) {
                    var ret = Tools_1.visitNode2(childs[x]);
                    if (ret)
                        return ret;
                }
            }
            return undefined;
        }
        static visitNode(code, node, ob) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                node["properties"].forEach((s) => {
                    var name = s["name"].text;
                    var val = s["initializer"].getText(); //Tools.toText(s["initializer"], code);
                    if (s["initializer"].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        ob[name] = {};
                        Tools_1.visitNode(code, s, ob[name]);
                    }
                    else {
                        if (s["initializer"].kind === ts.SyntaxKind.StringLiteral) {
                            ob[name] = val;
                        }
                        else
                            ob[name] = val;
                    }
                });
            }
            else
                node.getChildren().forEach(c => {
                    Tools_1.visitNode(code, c, ob);
                });
        }
        /**
         * parse a json string and returns an object an embed all values in string
         * e.g.
         * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
         **/
        static jsonToStringObject(code) {
            code = "a=" + code;
            var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
            var ret = {};
            Tools_1.visitNode(code, sourceFile, ret);
            return ret;
        }
        static _stringObjectToJson(ob, ret) {
            for (var key in ob) {
                if (typeof (ob[key]) === "string") {
                    ret[key] = "%&&/" + ob[key] + "%&&/";
                }
                else {
                    ret[key] = {};
                    Tools_1._stringObjectToJson(ob[key], ret[key]);
                }
            }
        }
        /**
        * parse a json string and returns an object an embed all values in string
        * e.g.
        * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
        **/
        static stringObjectToJson(ob, space) {
            var ret = {};
            Tools_1._stringObjectToJson(ob, ret);
            var sret = JSON.stringify(ret, function (key, value) {
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
            for (let x = 0; x < aret.length; x++) {
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
    };
    Tools = Tools_1 = __decorate([
        Jassi_1.$Class("jassijs.util.Tools"),
        __metadata("design:paramtypes", [])
    ], Tools);
    exports.Tools = Tools;
    async function test() {
        var k = Tools.objectToJson({
            g: { k: 9, p: 2 },
            a: "h\no", b: 1, c: function () {
                var ad = "\n";
            }
        }, undefined, false, 60);
        console.log(k);
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
        };
        var j2 = Tools.objectToJson(j, undefined, false);
        var g = Tools.jsonToObject(j2);
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3V0aWwvVG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFFQSxZQUFZO0lBQ1osMENBQTBDO0lBRTFDLElBQWEsS0FBSyxhQUFsQixNQUFhLEtBQUs7UUFFZDtRQUNBLENBQUM7UUFDTSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUc7WUFDeEIsSUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQUksZUFBZSxJQUFJLEdBQUc7Z0JBQ25FLE9BQU8sR0FBRyxDQUFDO1lBRWYsSUFBSSxHQUFHLFlBQVksSUFBSSxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVE7Z0JBQzlDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1COztnQkFFckQsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBRWpDLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO2dCQUNqQixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2hELEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxPQUFPLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztpQkFDL0I7YUFDSjtZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDSjs7Ozs7Y0FLTTtRQUNIOzs7aUJBR1M7UUFDVCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQVk7WUFDNUIsOEJBQThCO1lBQzlCLElBQUksR0FBRyxJ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QUFNLEVBQUUsT0FBTyxDQUFDO2dCQUNqQjtvQkFDSSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsRUFBRSxFQUFFO3dCQUNsQyxlQUFlLEVBQUUsZ0JBQWdCO3FCQUNwQztpQkFDSjthQUNKO1NBQ1IsQ0FBQTtRQUNHLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFsQ0Qsb0JBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5cbi8vQHRzLWlnbm9yZVxuLy9pbXBvcnQgbG9kYXNoIGZyb20gXCJqYXNzaWpzL2V4dC9sb2Rhc2hcIjtcbkAkQ2xhc3MoXCJqYXNzaWpzLnV0aWwuVG9vbHNcIilcbmV4cG9ydCBjbGFzcyBUb29scyB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG4gICAgcHVibGljIHN0YXRpYyBjb3B5T2JqZWN0KG9iaikge1xuICAgICAgICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiAob2JqKSAhPT0gJ29iamVjdCcgfHwgJ2lzQWN0aXZlQ2xvbmUnIGluIG9iailcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG5cbiAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUgfHwgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIilcbiAgICAgICAgICAgIHZhciB0ZW1wID0gbmV3IG9iai5jb25zdHJ1Y3RvcigpOyAvL29yIG5ldyBEYXRlKG9iaik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHZhciB0ZW1wID0gb2JqLmNvbnN0cnVjdG9yKCk7XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgICAgICAgICBvYmpbJ2lzQWN0aXZlQ2xvbmUnXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGVtcFtrZXldID0gVG9vbHMuY29weU9iamVjdChvYmpba2V5XSk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9ialsnaXNBY3RpdmVDbG9uZSddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZW1wO1xuICAgIH1cbiAvKiAgIHN0YXRpYyBjb3B5T2JqZWN0KHNyYykge1xuICAgICAgIGxvZGFzaCgpO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgcmV0dXJuIF8uY2xvbmVEZWVwKHNyYyk7XG5cbiAgICB9Ki9cbiAgICAvKipcbiAgICAgICAgICAgKiBjb252ZXJ0cyBhIGpzb24gc3RyaW5nIHRvIGEgb2JqZWN0XG4gICAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIC0gdGhlIGNvZGVcbiAgICAgICAgICAgKi9cbiAgICBzdGF0aWMganNvblRvT2JqZWN0KGNvZGU6IHN0cmluZykge1xuICAgICAgICAvL3ZhciByZXQ9ZXZhbChcIihcIit2YWx1ZStcIilcIik7XG4gICAgICAgIGNvZGUgPSBcImE9XCIgKyBjb2RlO1xuICAgICAgICB2YXIgc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoJ2hhbGxvLnRzJywgY29kZSwgdHMuU2NyaXB0VGFyZ2V0LkVTNSwgdHJ1ZSk7XG4gICAgICAgIHZhciByZXQgPSBUb29scy52aXNpdE5vZGUyKHNvdXJjZUZpbGUpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyByZXBsYWNlUXVvdGVzKHZhbHVlKTogYW55IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDt4IDwgdmFsdWUubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlW3hdKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZVt4XSA9IHRoaXMucmVwbGFjZVF1b3Rlcyh2YWx1ZVt4XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vaWYgKHR5cGVvZiAodmFsdWUpID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbmV3a2V5ID0gXCIkJSlcIiArIGtleSArIFwiJCUpXCI7XG4gICAgICAgICAgICByZXRbbmV3a2V5XSA9IHZhbHVlW2tleV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlW2tleV0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICByZXRbbmV3a2V5XSA9IHRoaXMucmVwbGFjZVF1b3RlcyhyZXRbbmV3a2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgLy99XG5cbiAgICB9XG4gICAgLyoqXG4gICAqIGNvbnZlcnRzIGEgc3RyaW5nIHRvIGEgb2JqZWN0XG4gICAqIEBwYXJhbSB2YWx1ZSAtIHRoZSBvYmplY3QgdG8gc3RyaW5naWZ5XG4gICAqIEBwYXJhbSBzcGFjZSAtIHRoZSBzcGFjZSBiZWZvcmUgdGhlIHByb3BlcnR5XG4gICAqIEBwYXJhbSBuYW1lV2l0aFF1b3RlcyAtIGlmIHRydWUgXCJrZXlcIjp2YWx1ZSBlbHNlIGtleTp2YWx1ZVxuICAgKi9cbiAgICBzdGF0aWMgb2JqZWN0VG9Kc29uKHZhbHVlLCBzcGFjZSA9IHVuZGVmaW5lZCwgbmFtZVdpdGhRdW90ZXM6IGJvb2xlYW4gPSB0cnVlLGxlbmd0aEZvckxpbmVicmVhazpudW1iZXI9dW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBvdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgaWYgKG5hbWVXaXRoUXVvdGVzID09PSBmYWxzZSlcbiAgICAgICAgICAgIG92YWx1ZSA9IFRvb2xzLnJlcGxhY2VRdW90ZXMoVG9vbHMuY29weU9iamVjdCggb3ZhbHVlKSk7XG4gICAgICAgIHZhciByZXQ6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KG92YWx1ZSwgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAodmFsdWUpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgciA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgciA9IHIucmVwbGFjZUFsbChcIlxcclwiICsgc3BhY2UsIFwiXFxyXCIpO1xuICAgICAgICAgICAgICAgIHIgPSByLnJlcGxhY2VBbGwoXCJcXG5cIiArIHNwYWNlLCBcIlxcblwiKTtcbiAgICAgICAgICAgICAgICByID0gci5yZXBsYWNlQWxsKFwiXFxyXCIsIFwiJMKnJlxcclwiKTtcbiAgICAgICAgICAgICAgICByID0gci5yZXBsYWNlQWxsKFwiXFxuXCIsIFwiJMKnJlxcblwiKTtcbiAgICAgICAgICAgICAgICByID0gci5yZXBsYWNlQWxsKFwiXFx0XCIsIFwiJMKnJlxcdFwiKTtcbiAgICAgICAgICAgICAgICByID0gci5yZXBsYWNlQWxsKCdcXFwiJywgJyTCpyZcXFwiJyk7XG4gICAgICAgICAgICAgICAgLy8gIHJldD1yZXQucmVwbGFjZShcIlxcdFxcdFwiLFwiXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBcIiQlJlwiICsgciArIFwiJCUmXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sIFwiXFx0XCIpO1xuICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldCA9IHJldC5yZXBsYWNlQWxsKFwiXFxcIiQlJlwiLCBcIlwiKTtcbiAgICAgICAgICAgIHJldCA9IHJldC5yZXBsYWNlQWxsKFwiJCUmXFxcIlwiLCBcIlwiKTtcbiAgICAgICAgICAgIC8vICByZXQgPSByZXQucmVwbGFjZUFsbChcIlxcXFxyXCIsIFwiXFxyXCIpO1xuICAgICAgICAgICAgLy8gIHJldCA9IHJldC5yZXBsYWNlQWxsKFwiXFxcXG5cIiwgXCJcXG5cIik7XG4gICAgICAgICAgICAvLyAgcmV0ID0gcmV0LnJlcGxhY2VBbGwoXCJcXFxcdFwiLCBcIlxcdFwiKTtcbiAgICAgICAgICAgIC8vICByZXQgPSByZXQucmVwbGFjZUFsbCgnXFxcXFwiJywgJ1xcXCInKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmFtZVdpdGhRdW90ZXMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXQgPSByZXQucmVwbGFjZUFsbChcIlxcXCIkJSlcIiwgXCJcIik7XG4gICAgICAgICAgICByZXQgPSByZXQucmVwbGFjZUFsbChcIiQlKVxcXCJcIiwgXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0PXJldC5yZXBsYWNlQWxsKFwiJMKnJlxcXFxuXCIsXCJcXG5cIik7XG4gICAgICAgIHJldD1yZXQucmVwbGFjZUFsbChcIiTCpyZcXFxcclwiLFwiXFx0XCIpO1xuICAgICAgICByZXQ9cmV0LnJlcGxhY2VBbGwoXCIkwqcmXFxcXHRcIixcIlxcdFwiKTtcbiAgICAgICAgcmV0PXJldC5yZXBsYWNlQWxsKCckwqcmXFxcXFwiJywnXFxcIicpO1xuICAgICAgICAvL3N0aWNrIGxpbmVicmVhayB0b2dldGhlclxuICAgICAgICAvKiB7XG4gICAgICAgICAgICAgIGE6MSxcbiAgICAgICAgICAgICAgYjoyXG4gICAgICAgICAgIH1cbiAgICAgICAgICAgd2lyZCBcbiAgICAgICAgICAgeyBhOjEsIGI6Mn1cbiAgICAgICAgfSovXG4gICAgICAgIGlmKGxlbmd0aEZvckxpbmVicmVhayl7XG4gICAgICAgICAgICBsZXQgcG9zPTA7XG4gICAgICAgICAgICB2YXIgc3JldD1cIlwiO1xuICAgICAgICAgICAgdmFyIHN0YXJ0QmxvY2s9dW5kZWZpbmVkO1xuICAgICAgICAgICAgdmFyIHN0YXJ0QmxvY2syPXVuZGVmaW5lZDtcbiAgICAgICAgICAgIGZvcih2YXIgeD0wO3g8cmV0Lmxlbmd0aDt4Kyspe1xuICAgICAgICAgICAgICAgIGlmKHJldFt4XT09PVwie1wiKXtcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRCbG9jaz14O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihyZXRbeF09PT1cIltcIil7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0QmxvY2syPXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHJldFt4XT09PVwifVwiJiZzdGFydEJsb2NrIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3Q9cmV0LnN1YnN0cmluZyhzdGFydEJsb2NrLHgpO1xuICAgICAgICAgICAgICAgICAgICBpZih0ZXN0Lmxlbmd0aDxsZW5ndGhGb3JMaW5lYnJlYWspe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ldT1yZXQuc3Vic3RyaW5nKDAsc3RhcnRCbG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwPXRlc3QucmVwbGFjZUFsbChcIlxcclwiLFwiXCIpLnJlcGxhY2VBbGwoXCJcXG5cIixcIlwiKS5yZXBsYWNlQWxsKFwiXFx0XCIsXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXUrPXJlcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldSs9cmV0LnN1YnN0cmluZyh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldD1uZXU7XG4gICAgICAgICAgICAgICAgICAgICAgICB4PXN0YXJ0QmxvY2srcmVwLmxlbmd0aCsxO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRCbG9jaz11bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGlmKHJldFt4XT09PVwiXVwiJiZzdGFydEJsb2NrMiE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0PXJldC5zdWJzdHJpbmcoc3RhcnRCbG9jazIseCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRlc3QubGVuZ3RoPGxlbmd0aEZvckxpbmVicmVhayl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV1PXJldC5zdWJzdHJpbmcoMCxzdGFydEJsb2NrMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVwPXRlc3QucmVwbGFjZUFsbChcIlxcclwiLFwiXCIpLnJlcGxhY2VBbGwoXCJcXG5cIixcIlwiKS5yZXBsYWNlQWxsKFwiXFx0XCIsXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXUrPXJlcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldSs9cmV0LnN1YnN0cmluZyh4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldD1uZXU7XG4gICAgICAgICAgICAgICAgICAgICAgICB4PXN0YXJ0QmxvY2syK3JlcC5sZW5ndGgrMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0QmxvY2syPXVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL29uZSB0byBtdWNoXG4gICAgICAgIC8vICByZXQ9cmV0LnN1YnN0cmluZygwLHJldC5sZW5ndGgtMikrcmV0LnN1YnN0cmluZyhyZXQubGVuZ3RoLTEpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyB0b1RleHQobm9kZTogdHMuTm9kZSwgdGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3Vic3RyaW5nKG5vZGUucG9zLCBub2RlLmVuZCkudHJpbSgpO1xuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRWYWx1ZUZyb21Ob2RlKG5vZGU6IHRzLk5vZGUsIHZhbDogYW55LCBwcm9wOiBhbnkpIHtcblxuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyB2aXNpdE9iamVjdChub2RlOiB0cy5Ob2RlKSB7XG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBub2RlW1wicHJvcGVydGllc1wiXS5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHMgPSBub2RlW1wicHJvcGVydGllc1wiXVtpXTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHNbXCJuYW1lXCJdLnRleHQ7XG4gICAgICAgICAgICAgICAgcmV0W25hbWVdID0gVG9vbHMudmlzaXRPYmplY3Qoc1tcImluaXRpYWxpemVyXCJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLkFycmF5TGl0ZXJhbEV4cHJlc3Npb24pIHsvL1tdXG4gICAgICAgICAgICBsZXQgcmV0ID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDtpIDwgbm9kZVtcImVsZW1lbnRzXCJdLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgb2IgPSB0aGlzLnZpc2l0T2JqZWN0KG5vZGVbXCJlbGVtZW50c1wiXVtpXSk7XG4gICAgICAgICAgICAgICAgcmV0LnB1c2gob2IpO1xuICAgICAgICAgICAgICAgIC8qIGlmIChzW1wiaW5pdGlhbGl6ZXJcIl0uZWxlbWVudHNbaV0ua2luZCA9PT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgb2JbbmFtZV0ucHVzaChfbmV3b2IpO1xuICAgICAgICAgICAgICAgICAgICAgVG9vbHMudmlzaXROb2RlMihjb2RlLCBzW1wiaW5pdGlhbGl6ZXJcIl0uZWxlbWVudHNbaV0sIF9uZXdvYik7XG4gICAgICAgICAgICAgICAgIH0qL1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0VGV4dCgpLnN1YnN0cmluZygxLCBub2RlLmdldFRleHQoKS5sZW5ndGggLSAxKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuTnVtZXJpY0xpdGVyYWwpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTnVtYmVyKG5vZGUuZ2V0VGV4dCgpKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuRmFsc2VLZXl3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS5raW5kID09PSB0cy5TeW50YXhLaW5kLlRydWVLZXl3b3JkKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChub2RlLmdldFRleHQoKS5zdGFydHNXaXRoKFwiZnVuY3Rpb25cIikpIHtcbiAgICAgICAgICAgIHZhciBmdW5jID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5vZGUuZ2V0VGV4dCgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGZ1bmMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5nZXRUZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZnVuYztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmdldFRleHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyB2aXNpdE5vZGUyKG5vZGU6IHRzLk5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUua2luZCA9PT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIFRvb2xzLnZpc2l0T2JqZWN0KG5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNoaWxkcyA9IG5vZGUuZ2V0Q2hpbGRyZW4oKTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwO3ggPCBjaGlsZHMubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBUb29scy52aXNpdE5vZGUyKGNoaWxkc1t4XSk7XG4gICAgICAgICAgICAgICAgaWYgKHJldClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyB2aXNpdE5vZGUoY29kZTogc3RyaW5nLCBub2RlOiB0cy5Ob2RlLCBvYjogYW55KSB7XG4gICAgICAgIGlmIChub2RlLmtpbmQgPT09IHRzLlN5bnRheEtpbmQuT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24pIHtcbiAgICAgICAgICAgIG5vZGVbXCJwcm9wZXJ0aWVzXCJdLmZvckVhY2goKHM6IHRzLk5vZGUpID0+IHtcblxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gc1tcIm5hbWVcIl0udGV4dDtcblxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBzW1wiaW5pdGlhbGl6ZXJcIl0uZ2V0VGV4dCgpOyAvL1Rvb2xzLnRvVGV4dChzW1wiaW5pdGlhbGl6ZXJcIl0sIGNvZGUpO1xuICAgICAgICAgICAgICAgIGlmIChzW1wiaW5pdGlhbGl6ZXJcIl0ua2luZCA9PT0gdHMuU3ludGF4S2luZC5PYmplY3RMaXRlcmFsRXhwcmVzc2lvbikge1xuICAgICAgICAgICAgICAgICAgICBvYltuYW1lXSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBUb29scy52aXNpdE5vZGUoY29kZSwgcywgb2JbbmFtZV0pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNbXCJpbml0aWFsaXplclwiXS5raW5kID09PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iW25hbWVdID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iW25hbWVdID0gdmFsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgbm9kZS5nZXRDaGlsZHJlbigpLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgVG9vbHMudmlzaXROb2RlKGNvZGUsIGMsIG9iKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBwYXJzZSBhIGpzb24gc3RyaW5nIGFuZCByZXR1cm5zIGFuIG9iamVjdCBhbiBlbWJlZCBhbGwgdmFsdWVzIGluIHN0cmluZ1xuICAgICAqIGUuZy4gXG4gICAgICogeyBhOlwiaGFsbG9cIixpOntiOjksYzpcInRlc3RcIn19IHdvdWxkIGJlIGNvbnZlcnQgdG97IGE6XCJcImhhbGxvXCJcIixpOntiOlwiOVwiLGM6XCJcInRlc3RcIlwifX1cbiAgICAgKiovXG4gICAgc3RhdGljIGpzb25Ub1N0cmluZ09iamVjdChjb2RlOiBzdHJpbmcpIHtcbiAgICAgICAgY29kZSA9IFwiYT1cIiArIGNvZGU7XG4gICAgICAgIHZhciBzb3VyY2VGaWxlID0gdHMuY3JlYXRlU291cmNlRmlsZSgnaGFsbG8udHMnLCBjb2RlLCB0cy5TY3JpcHRUYXJnZXQuRVM1LCB0cnVlKTtcbiAgICAgICAgdmFyIHJldCA9IHt9O1xuICAgICAgICBUb29scy52aXNpdE5vZGUoY29kZSwgc291cmNlRmlsZSwgcmV0KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHJpdmF0ZSBzdGF0aWMgX3N0cmluZ09iamVjdFRvSnNvbihvYjogYW55LCByZXQ6IGFueSkge1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAob2Jba2V5XSkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICByZXRba2V5XSA9IFwiJSYmL1wiICsgb2Jba2V5XSArIFwiJSYmL1wiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXRba2V5XSA9IHt9XG4gICAgICAgICAgICAgICAgVG9vbHMuX3N0cmluZ09iamVjdFRvSnNvbihvYltrZXldLCByZXRba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgKiBwYXJzZSBhIGpzb24gc3RyaW5nIGFuZCByZXR1cm5zIGFuIG9iamVjdCBhbiBlbWJlZCBhbGwgdmFsdWVzIGluIHN0cmluZ1xuICAgICogZS5nLiBcbiAgICAqIHsgYTpcImhhbGxvXCIsaTp7Yjo5LGM6XCJ0ZXN0XCJ9fSB3b3VsZCBiZSBjb252ZXJ0IHRveyBhOlwiXCJoYWxsb1wiXCIsaTp7YjpcIjlcIixjOlwiXCJ0ZXN0XCJcIn19XG4gICAgKiovXG4gICAgc3RhdGljIHN0cmluZ09iamVjdFRvSnNvbihvYjogYW55LCBzcGFjZTogc3RyaW5nKSB7XG4gICAgICAgIHZhciByZXQgPSB7fTtcbiAgICAgICAgVG9vbHMuX3N0cmluZ09iamVjdFRvSnNvbihvYiwgcmV0KTtcbiAgICAgICAgdmFyIHNyZXQgPSBKU09OLnN0cmluZ2lmeShyZXQsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIC8vcmVuYW1lIHByb3BlcnR5bmFtZXNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmFzc2lnbih7fSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBrZXlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlW1wiPDwmU1RBUlRcIiArIGtleSArIFwiRU5EJj4+XCJdID0gdmFsdWVba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LCBcIiAgICAgIFwiKTtcbiAgICAgICAgc3JldCA9IHNyZXQucmVwbGFjZUFsbChcIlxcXFxcXFwiJSYmL1wiLCBcIlwiKS5yZXBsYWNlQWxsKFwiJSYmL1xcXFxcXFwiXCIsIFwiXCIpO1xuICAgICAgICBzcmV0ID0gc3JldC5yZXBsYWNlQWxsKFwiXFxcIiUmJi9cIiwgXCJcIikucmVwbGFjZUFsbChcIiUmJi9cXFwiXCIsIFwiXCIpO1xuICAgICAgICB2YXIgYXJldCA9IHNyZXQuc3BsaXQoXCJcXHJcIik7XG4gICAgICAgIGZvciAobGV0IHggPSAwO3ggPCBhcmV0Lmxlbmd0aDt4KyspIHtcbiAgICAgICAgICAgIGFyZXRbeF0gPSBzcGFjZSArIGFyZXRbeF07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgciA9IGFyZXQuam9pbihcIlxcclwiKTtcbiAgICAgICAgciA9IHIucmVwbGFjZUFsbChcIlxcXFxyXCIsIFwiXFxyXCIpO1xuICAgICAgICByID0gci5yZXBsYWNlQWxsKFwiXFxcXG5cIiwgXCJcXG5cIik7XG4gICAgICAgIHIgPSByLnJlcGxhY2VBbGwoXCJcXFxcdFwiLCBcIlxcdFwiKTtcbiAgICAgICAgciA9IHIucmVwbGFjZUFsbChcIlxcXCI8PCZTVEFSVFwiLCBcIlwiKTtcbiAgICAgICAgciA9IHIucmVwbGFjZUFsbChcIkVORCY+PlxcXCJcIiwgXCJcIik7XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIGsgPSBUb29scy5vYmplY3RUb0pzb24oeyAgXG4gICAgICAgIGc6e2s6OSxwOjJ9ICAgICAsXG5hOiBcImhcXG5vXCIsIGI6IDEsIGM6ZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYWQgPSBcIlxcblwiO1xuICAgICAgICB9ICAgIFxufSx1bmRlZmluZWQsZmFsc2UsNjApO1xuICAgIGNvbnNvbGUubG9nKGspO1xuICAgIHZhciBrMiA9IFRvb2xzLmpzb25Ub09iamVjdChrKTtcbiAgICB2YXIgY29kZSA9IGB7IFxuXHRnOmZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuIDE7XG5cdFx0XG5cdH1cblx0YTpcImhhbGxvXCIsXG5cdGk6e1xuXHRcdGI6OSxcblx0XHRjOlwidGVzdFwiXG5cdFx0fVxuXHR9IGA7XG4gICAgdmFyIGggPSBhd2FpdCBUb29scy5qc29uVG9TdHJpbmdPYmplY3QoY29kZSk7XG4gICAgdmFyIGgyID0gVG9vbHMuc3RyaW5nT2JqZWN0VG9Kc29uKGgsIFwiICAgIFwiKTtcbiAgICB2YXIgaiA9IHsgICAgICAgIFxuYm9keTogW1xuICAgICAgICAgICAgWydJdGVtJywgJ1ByaWNlJ10sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZm9yZWFjaDogXCJsaW5lIGluIGludm9pY2UubGluZXNcIiwgZG86IFtcbiAgICAgICAgICAgICAgICAgICAgJ3t7bGluZS50ZXh0fX0nLCAne3tsaW5lLnByaWNlfX0nXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICBdICAgIFxufVxuICAgIHZhciBqMiA9IFRvb2xzLm9iamVjdFRvSnNvbihqLCB1bmRlZmluZWQsIGZhbHNlKVxuICAgIHZhciBnID0gVG9vbHMuanNvblRvT2JqZWN0KGoyKTtcbn1cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iXX0=