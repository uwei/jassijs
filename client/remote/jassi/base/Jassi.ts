
import { Classes, classes } from "./Classes";
import registry from "remote/jassi/base/Registry";



declare global {
    export class ExtensionAction {
       /* sample?: {
            name: string,
            param1: string;
        };*/
    }
}

/*
window.extentsionCalled = function (param:  ExtensionAction) {
    if (param.sample) {
        alert("default:" + param.defaultAction.name);
    }
   
}
window.extentsionCalled({
    sample: { name: "Passt" }
})*/


export function $Class(longclassname: string): Function {
    return function (pclass) {
        registry.register("$Class", pclass, longclassname);
    }
}
export function $register(servicename: string, ...params): Function {
    return function (pclass) {
        registry.register(servicename, pclass, params);
    }
}

declare global {
    interface String {
        replaceAll: any;
    }
}

String.prototype.replaceAll = function (search:string, replacement:string):string {
    var target = this;
    return target.split(search).join(replacement);
}



/**
* main class for jassi
* @class Jassi
*/
@$Class("remote.jassi.base.Jassi")
export class Jassi {
    //  public classes:Classes=undefined;
    [key: string]: any;
    base: { [k: string]: any };
    public modules:{[key: string]: string};
    isServer: boolean = false;
    constructor() {
        //@ts-ignore
        this.isServer = window.document === undefined;
        if (!this.isServer) {
            this.myRequire("jassi/jassi.css");
            this.myRequire("https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css");
            this.myRequire("//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css");
        }
    }
	/**
	 * include a global stylesheet
	 * @id - the given id - important for update
	 * @data - the css data to insert
	 **/
	includeCSS(id: string, data: { [cssselector: string]: any/*CSSProperties*/ }) {
        //@ts-ignore
        var style: HTMLElement = document.getElementById(id);
        //@ts-ignore
        if (!document.getElementById(id)) {
	        style = $('<style id=' + id + '></style>')[0];
            //@ts-ignore
            document.head.appendChild(style);
	    }
	    var sstyle="";
	    for(var selector in data){
		    var sstyle = sstyle+"\n\t" + selector + "{\n";
		    var properties=data[selector];
	        var prop = {};
		    for (let key in properties) {
		    	if(key==="_classname")
		    		continue;
		        var newKey = key.replaceAll("_", "-");
		        prop[newKey] = (<string>properties[key]);
		        sstyle = sstyle + "\t\t" + newKey + ":" + (<string>properties[key]) + ";\n";
		    }
			sstyle = sstyle + "\t}\n";
	    }
	    style.innerHTML = sstyle;
	}
    /**
    * include a js or a css file
    * @param {string|string[]} href - url(s) of the js or css file(s)
    * @param {function} [param] - would be added with? to the url
    */
    myRequire(href, event = undefined, param = undefined) {
        if (this.isServer)
            throw "jass.Require is only available on client";
        if ((typeof href) === "string") {
            href = [href];
        }

        var url = "";
        if (href instanceof Array) {
            if (href.length === 0) {
                if (event !== undefined)
                    event();
                return;
            } else {
                url = href[0];
                href.splice(0, 1);

            }
        }
        if (url.endsWith(".js")) {
            //@ts-ignore
            if (window.document.getElementById("-->" + url) !== null) {
                this.myRequire(href, event);
            } else {
                //@ts-ignore
                var js = window.document.createElement("script");
                //   js.type = "text/javascript";
                js.src = url + (param !== undefined ? "?" + param : "");
                var _this = this;
                js.onload = function () {
                    _this.myRequire(href, event);
                };
                js.id = "-->" + url;
                //@ts-ignore
                window.document.head.appendChild(js);
            }
        } else {
            //    <link href="lib/jquery.splitter.css" rel="stylesheet"/>
            //@ts-ignore
            var head = window.document.getElementsByTagName('head')[0];
            //@ts-ignore
            var link = window.document.createElement('link');
            //  link.rel  = 'import';
            link.href = url;
            link.rel = "stylesheet";
            link.id = "-->" + url;
            var _this = this;
            link.onload = function () {
                _this.myRequire(href, event);
            };
            head.appendChild(link);
        }
    }
};
var jassi: Jassi = new Jassi();
//@ts-ignore
if (window["jassi"] === undefined){//reloading this file -> no destroy namespace
     //@ts-ignore
    window["jassi"] = jassi;
}



export default jassi;