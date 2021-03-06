import jassi, { $Class } from "jassi/remote/Jassi";
import { classes } from "jassi/remote/Classes";



@$Class("jassi.remote.RemoteProtocol")
export class RemoteProtocol {
    static counter = 0;
    classname: string;
    _this: any;
    parameter: any[];
    method: string;
    /**
     * converts object to jsonstring
     * if class is registerd in classes then the class is used
     * if id is used then recursive childs are possible
     * @param obj 
     */
    stringify(obj) {
        var ref = [];

        return JSON.stringify(obj, function (key, value) {
            var val: any = {};
            var clname = value === null ? undefined : classes.getClassName(value);
            var k = clname;
            if (k !== undefined) {
                val.__clname__ = clname;

                //if (value.id !== undefined)
                //	k = k + ":" + (value.id === undefined ? RemoteProtocol.counter++ : value.id);
                //the object was seen the we save a ref
                if (ref.indexOf(value) >= 0) {
                    val.__ref__ = ref.indexOf(value);

                } else {
                    Object.assign(val, value);
                    ref.push(value);
                    val.__refid__ = ref.length - 1;
                }


            } else {
                val = value;
            }


            return val;
        });
    }

    public static async simulateUser(user: string = undefined, password: string = undefined) {
        var rights = (await import("jassi/remote/security/Rights")).default;
        //	if(await rights.isAdmin()){
        //		throw new Error("not an admin")
        //	}
        if (user === undefined) {
            //@ts-ignore
            var Cookies = (await import("jassi/util/Cookies")).Cookies;
            Cookies.remove("simulateUser", {});
            Cookies.remove("simulateUserPassword", {});
        } else {
            Cookies.set("simulateUser", user, {});
            Cookies.set("simulateUserPassword", password, {});
        }

    }
    async exec(config,object){
        return await $.ajax(config,object);
    }
    /**
   * call the server
   */
    async call() {
        if (jassi.isServer)
            throw new Error("should be called on client");
        var sdataObject = undefined;
        var url = "remoteprotocol?" + Date.now();
        var _this = this;
        var redirect = undefined;
        var config = {
            url: url,
            type: 'post',
            dataType: "text",
            data: this.stringify(this),
        }
        try {
            var ret = await this.exec(config,this._this);
        } catch (ex) {
            if (ex.status === 401 || (ex.responseText && ex.responseText.indexOf("jwt expired") !== -1)) {
                redirect = new Promise((resolve) => {
                    //@ts-ignore
                    import("jassi/base/LoginDialog").then((lib) => {
                        lib.doAfterLogin(resolve, _this);
                    });
                });
            } else {
                throw ex;
            }
        }

        if (redirect !== undefined)
            return await redirect;
        if (ret === "$$undefined$$")
            return undefined;
        var retval = await this.parse(ret);
        if (retval["**throw error**"] !== undefined) {
            throw new Error(retval["**throw error**"]);
        }
        return retval;
    }

    /**
     * converts jsonstring to an object
     */
    async parse(text: string) {
        var ref = {};
        if (text === undefined)
            return undefined;
        if (text === "")
            return "";
        //first get all classnames	
        var allclassnames = [];
      
        JSON.parse(text, function (key, value) {
            if (value === null || value === undefined)
                return value;
            if (value.__clname__ !== null && value.__clname__ !== undefined && allclassnames.indexOf(value.__clname__) === -1) {
                allclassnames.push(value.__clname__);
            }
            
            return value;
        });

        //all classes must be loaded
        for (var x = 0; x < allclassnames.length; x++) {
            await classes.loadClass(allclassnames[x]);
        }
        return JSON.parse(text, function (key, value) {
            var val = value;
            if (value === null || value === undefined)
                return value;
            if (value.__ref__ !== undefined) {
                val = ref[value.__ref__];
                if (val === undefined) {
                    //TODO import types from js
                    //create dummy
                    var type = classes.getClass(value.__clname__);
                    //@ts-ignore
                    var test = type._createObject === undefined ? undefined : type._createObject(val);
                    if (test !== undefined)
                        val = test;
                    else
                        val = new type();
                    ref[value.__ref__] = val;
                }
            } else {
                if (value.__clname__ !== undefined) {
                    if (value.__refid__ !== undefined && ref[value.__refid__] !== undefined) {//there is a dummy
                        val = ref[value.__refid__];
                    } else {
                        //TODO import types from js
                        var type = classes.getClass(value.__clname__);
                        //@ts-ignore
                        var test = type._createObject === undefined ? undefined : type._createObject(value);
                        if (test !== undefined)
                            val = test;
                        else
                            val = new type();
                        if (value.__refid__ !== undefined) {
                            ref[value.__refid__] = val;
                        }
                    }
                    Object.assign(val, value);
                    delete val.__refid__;
                    delete val.__clname__;
                }
            }
            //Date conversation
            var datepattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
            if (typeof value === 'string') {
                var a = datepattern.exec(value);
                if (a)
                    return new Date(value);
            }
            return val;
        });
    }
    async test() {
        var a: any = new A();
        var b: any = new B();
        a.b = b;
        a.name = "max";
        a.id = 9;
        b.a = a;
        b.id = 7;
        var s = this.stringify(a);
        var test = await this.parse(s);
    }
}


class A {
    name: "hallo"
}
//jassi.register("classes", "de.A", A);
class B {
    hh: "du"

}
//jassi.register("classes", "de.B", B);