var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/Classes"], function (require, exports, Jassi_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteProtocol = void 0;
    let RemoteProtocol = class RemoteProtocol {
        /**
         * converts object to jsonstring
         * if class is registerd in classes then the class is used
         * if id is used then recursive childs are possible
         * @param obj
         */
        stringify(obj) {
            var ref = [];
            return JSON.stringify(obj, function (key, value) {
                var val = {};
                var clname = value === null ? undefined : Classes_1.classes.getClassName(value);
                var k = clname;
                if (k !== undefined) {
                    val.__clname__ = clname;
                    //if (value.id !== undefined)
                    //	k = k + ":" + (value.id === undefined ? RemoteProtocol.counter++ : value.id);
                    //the object was seen the we save a ref
                    if (ref.indexOf(value) >= 0) {
                        val.__ref__ = ref.indexOf(value);
                    }
                    else {
                        Object.assign(val, value);
                        ref.push(value);
                        val.__refid__ = ref.length - 1;
                    }
                }
                else {
                    val = value;
                }
                return val;
            });
        }
        static async simulateUser(user = undefined, password = undefined) {
            var rights = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/security/Rights"], resolve_1, reject_1); })).default;
            //	if(await rights.isAdmin()){
            //		throw new Error("not an admin")
            //	}
            //@ts-ignore
            var Cookies = (await new Promise((resolve_2, reject_2) => { require(["jassijs/util/Cookies"], resolve_2, reject_2); })).Cookies;
            if (user === undefined) {
                Cookies.remove("simulateUser", {});
                Cookies.remove("simulateUserPassword", {});
            }
            else {
                Cookies.set("simulateUser", user, {});
                Cookies.set("simulateUserPassword", password, {});
            }
        }
        async exec(config, object) {
            return await new Promise((resolve, reject) => {
                //@ts-ignore
                var xhr = new XMLHttpRequest();
                xhr.open('POST', config.url, true);
                xhr.setRequestHeader("Content-Type", "text");
                xhr.onload = function (data) {
                    if (this.status === 200)
                        resolve(this.responseText);
                    else
                        reject(this);
                };
                xhr.send(config.data);
                xhr.onerror = function (data) {
                    reject(data);
                };
            });
            //return await $.ajax(config, object);
        }
        /**
       * call the server
       */
        async call() {
            if (Jassi_1.default.isServer)
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
            };
            var ret;
            try {
                ret = await this.exec(config, this._this);
            }
            catch (ex) {
                if (ex.status === 401 || (ex.responseText && ex.responseText.indexOf("jwt expired") !== -1)) {
                    redirect = new Promise((resolve) => {
                        //@ts-ignore
                        new Promise((resolve_3, reject_3) => { require(["jassijs/base/LoginDialog"], resolve_3, reject_3); }).then((lib) => {
                            lib.doAfterLogin(resolve, _this);
                        });
                    });
                }
                else {
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
        async parse(text) {
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
                await Classes_1.classes.loadClass(allclassnames[x]);
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
                        var type = Classes_1.classes.getClass(value.__clname__);
                        //@ts-ignore
                        var test = type._createObject === undefined ? undefined : type._createObject(val);
                        if (test !== undefined)
                            val = test;
                        else
                            val = new type();
                        ref[value.__ref__] = val;
                    }
                }
                else {
                    if (value.__clname__ !== undefined) {
                        if (value.__refid__ !== undefined && ref[value.__refid__] !== undefined) { //there is a dummy
                            val = ref[value.__refid__];
                        }
                        else {
                            //TODO import types from js
                            var type = Classes_1.classes.getClass(value.__clname__);
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
            var a = new A();
            var b = new B();
            a.b = b;
            a.name = "max";
            a.id = 9;
            b.a = a;
            b.id = 7;
            var s = this.stringify(a);
            var test = await this.parse(s);
        }
    };
    RemoteProtocol.counter = 0;
    RemoteProtocol = __decorate([
        Jassi_1.$Class("jassijs.remote.RemoteProtocol")
    ], RemoteProtocol);
    exports.RemoteProtocol = RemoteProtocol;
    class A {
    }
    //jassijs.register("classes", "de.A", A);
    class B {
    }
});
//jassijs.register("classes", "de.B", B);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVtb3RlUHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3JlbW90ZS9SZW1vdGVQcm90b2NvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBTUEsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztRQU12Qjs7Ozs7V0FLRztRQUNILFNBQVMsQ0FBQyxHQUFHO1lBQ1QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBRWIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEdBQUcsRUFBRSxLQUFLO2dCQUMzQyxJQUFJLEdBQUcsR0FBUSxFQUFFLENBQUM7Z0JBQ2xCLElBQUksTUFBTSxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RFLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztnQkFDZixJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7b0JBQ2pCLEdBQUcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO29CQUV4Qiw2QkFBNkI7b0JBQzdCLGdGQUFnRjtvQkFDaEYsdUNBQXVDO29CQUN2QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN6QixHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBRXBDO3lCQUFNO3dCQUNILE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUMxQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNoQixHQUFHLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO3FCQUNsQztpQkFHSjtxQkFBTTtvQkFDSCxHQUFHLEdB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Tjs7QUFDRCx5Q0FBeUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcblxyXG5cclxuXHJcbkAkQ2xhc3MoXCJqYXNzaWpzLnJlbW90ZS5SZW1vdGVQcm90b2NvbFwiKVxyXG5leHBvcnQgY2xhc3MgUmVtb3RlUHJvdG9jb2wge1xyXG4gICAgc3RhdGljIGNvdW50ZXIgPSAwO1xyXG4gICAgY2xhc3NuYW1lOiBzdHJpbmc7XHJcbiAgICBfdGhpczogYW55O1xyXG4gICAgcGFyYW1ldGVyOiBhbnlbXTtcclxuICAgIG1ldGhvZDogc3RyaW5nO1xyXG4gICAgLyoqIFxyXG4gICAgICogY29udmVydHMgb2JqZWN0IHRvIGpzb25zdHJpbmdcclxuICAgICAqIGlmIGNsYXNzIGlzIHJlZ2lzdGVyZCBpbiBjbGFzc2VzIHRoZW4gdGhlIGNsYXNzIGlzIHVzZWRcclxuICAgICAqIGlmIGlkIGlzIHVzZWQgdGhlbiByZWN1cnNpdmUgY2hpbGRzIGFyZSBwb3NzaWJsZVxyXG4gICAgICogQHBhcmFtIG9iaiBcclxuICAgICAqL1xyXG4gICAgc3RyaW5naWZ5KG9iaikge1xyXG4gICAgICAgIHZhciByZWYgPSBbXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHZhbDogYW55ID0ge307XHJcbiAgICAgICAgICAgIHZhciBjbG5hbWUgPSB2YWx1ZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IGNsYXNzZXMuZ2V0Q2xhc3NOYW1lKHZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIGsgPSBjbG5hbWU7XHJcbiAgICAgICAgICAgIGlmIChrICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhbC5fX2NsbmFtZV9fID0gY2xuYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vaWYgKHZhbHVlLmlkICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAvL1x0ayA9IGsgKyBcIjpcIiArICh2YWx1ZS5pZCA9PT0gdW5kZWZpbmVkID8gUmVtb3RlUHJvdG9jb2wuY291bnRlcisrIDogdmFsdWUuaWQpO1xyXG4gICAgICAgICAgICAgICAgLy90aGUgb2JqZWN0IHdhcyBzZWVuIHRoZSB3ZSBzYXZlIGEgcmVmXHJcbiAgICAgICAgICAgICAgICBpZiAocmVmLmluZGV4T2YodmFsdWUpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWwuX19yZWZfXyA9IHJlZi5pbmRleE9mKHZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odmFsLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVmLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbC5fX3JlZmlkX18gPSByZWYubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgc2ltdWxhdGVVc2VyKHVzZXI6IHN0cmluZyA9IHVuZGVmaW5lZCwgcGFzc3dvcmQ6IHN0cmluZyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHZhciByaWdodHMgPSAoYXdhaXQgaW1wb3J0KFwiamFzc2lqcy9yZW1vdGUvc2VjdXJpdHkvUmlnaHRzXCIpKS5kZWZhdWx0O1xyXG4gICAgICAgIC8vXHRpZihhd2FpdCByaWdodHMuaXNBZG1pbigpKXtcclxuICAgICAgICAvL1x0XHR0aHJvdyBuZXcgRXJyb3IoXCJub3QgYW4gYWRtaW5cIilcclxuICAgICAgICAvL1x0fVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHZhciBDb29raWVzID0gKGF3YWl0IGltcG9ydChcImphc3NpanMvdXRpbC9Db29raWVzXCIpKS5Db29raWVzO1xyXG4gICAgICAgIGlmICh1c2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIENvb2tpZXMucmVtb3ZlKFwic2ltdWxhdGVVc2VyXCIsIHt9KTtcclxuICAgICAgICAgICAgQ29va2llcy5yZW1vdmUoXCJzaW11bGF0ZVVzZXJQYXNzd29yZFwiLCB7fSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgQ29va2llcy5zZXQoXCJzaW11bGF0ZVVzZXJcIiwgdXNlciwge30pO1xyXG4gICAgICAgICAgICBDb29raWVzLnNldChcInNpbXVsYXRlVXNlclBhc3N3b3JkXCIsIHBhc3N3b3JkLCB7fSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGFzeW5jIGV4ZWMoY29uZmlnLCBvYmplY3QpIHtcclxuICAgICAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignUE9TVCcsIGNvbmZpZy51cmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcInRleHRcIik7XHJcblxyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuc3RhdHVzPT09MjAwKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdCh0aGlzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgIFxyXG4gICAgICAgICAgICB4aHIuc2VuZChjb25maWcuZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5vbmVycm9yPWZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgIHJlamVjdChkYXRhKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgICAvL3JldHVybiBhd2FpdCAkLmFqYXgoY29uZmlnLCBvYmplY3QpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICogY2FsbCB0aGUgc2VydmVyXHJcbiAgICovXHJcbiAgICBhc3luYyBjYWxsKCkge1xyXG4gICAgICAgIGlmIChqYXNzaWpzLmlzU2VydmVyKVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgYmUgY2FsbGVkIG9uIGNsaWVudFwiKTtcclxuICAgICAgICB2YXIgc2RhdGFPYmplY3QgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHVybCA9IFwicmVtb3RlcHJvdG9jb2w/XCIgKyBEYXRlLm5vdygpO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHJlZGlyZWN0ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICB0eXBlOiAncG9zdCcsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcInRleHRcIixcclxuICAgICAgICAgICAgZGF0YTogdGhpcy5zdHJpbmdpZnkodGhpcyksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXQ7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0ID0gYXdhaXQgdGhpcy5leGVjKGNvbmZpZywgdGhpcy5fdGhpcyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgaWYgKGV4LnN0YXR1cyA9PT0gNDAxIHx8IChleC5yZXNwb25zZVRleHQgJiYgZXgucmVzcG9uc2VUZXh0LmluZGV4T2YoXCJqd3QgZXhwaXJlZFwiKSAhPT0gLTEpKSB7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgaW1wb3J0KFwiamFzc2lqcy9iYXNlL0xvZ2luRGlhbG9nXCIpLnRoZW4oKGxpYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaWIuZG9BZnRlckxvZ2luKHJlc29sdmUsIF90aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZWRpcmVjdCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgcmVkaXJlY3Q7XHJcbiAgICAgICAgaWYgKHJldCA9PT0gXCIkJHVuZGVmaW5lZCQkXCIpXHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHJldHZhbCA9IGF3YWl0IHRoaXMucGFyc2UocmV0KTtcclxuICAgICAgICBpZiAocmV0dmFsW1wiKip0aHJvdyBlcnJvcioqXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJldHZhbFtcIioqdGhyb3cgZXJyb3IqKlwiXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb252ZXJ0cyBqc29uc3RyaW5nIHRvIGFuIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBhc3luYyBwYXJzZSh0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICB2YXIgcmVmID0ge307XHJcbiAgICAgICAgaWYgKHRleHQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICBpZiAodGV4dCA9PT0gXCJcIilcclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgLy9maXJzdCBnZXQgYWxsIGNsYXNzbmFtZXNcdFxyXG4gICAgICAgIHZhciBhbGxjbGFzc25hbWVzID0gW107XHJcblxyXG4gICAgICAgIEpTT04ucGFyc2UodGV4dCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5fX2NsbmFtZV9fICE9PSBudWxsICYmIHZhbHVlLl9fY2xuYW1lX18gIT09IHVuZGVmaW5lZCAmJiBhbGxjbGFzc25hbWVzLmluZGV4T2YodmFsdWUuX19jbG5hbWVfXykgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBhbGxjbGFzc25hbWVzLnB1c2godmFsdWUuX19jbG5hbWVfXyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9hbGwgY2xhc3NlcyBtdXN0IGJlIGxvYWRlZFxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsY2xhc3NuYW1lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhhbGxjbGFzc25hbWVzW3hdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodGV4dCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHZhbHVlLl9fcmVmX18gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdmFsID0gcmVmW3ZhbHVlLl9fcmVmX19dO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIGltcG9ydCB0eXBlcyBmcm9tIGpzXHJcbiAgICAgICAgICAgICAgICAgICAgLy9jcmVhdGUgZHVtbXlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IGNsYXNzZXMuZ2V0Q2xhc3ModmFsdWUuX19jbG5hbWVfXyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0eXBlLl9jcmVhdGVPYmplY3QgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHR5cGUuX2NyZWF0ZU9iamVjdCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHRlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlZlt2YWx1ZS5fX3JlZl9fXSA9IHZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5fX2NsbmFtZV9fICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuX19yZWZpZF9fICE9PSB1bmRlZmluZWQgJiYgcmVmW3ZhbHVlLl9fcmVmaWRfX10gIT09IHVuZGVmaW5lZCkgey8vdGhlcmUgaXMgYSBkdW1teVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSByZWZbdmFsdWUuX19yZWZpZF9fXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL1RPRE8gaW1wb3J0IHR5cGVzIGZyb20ganNcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR5cGUgPSBjbGFzc2VzLmdldENsYXNzKHZhbHVlLl9fY2xuYW1lX18pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0eXBlLl9jcmVhdGVPYmplY3QgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHR5cGUuX2NyZWF0ZU9iamVjdCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXN0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSB0ZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWwgPSBuZXcgdHlwZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUuX19yZWZpZF9fICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZlt2YWx1ZS5fX3JlZmlkX19dID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24odmFsLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbC5fX3JlZmlkX187XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbC5fX2NsbmFtZV9fO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vRGF0ZSBjb252ZXJzYXRpb25cclxuICAgICAgICAgICAgdmFyIGRhdGVwYXR0ZXJuID0gL14oXFxkezR9KS0oXFxkezJ9KS0oXFxkezJ9KVQoXFxkezJ9KTooXFxkezJ9KTooXFxkezJ9KD86XFwuXFxkKikpKD86WnwoXFwrfC0pKFtcXGR8Ol0qKSk/JC87XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYSA9IGRhdGVwYXR0ZXJuLmV4ZWModmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGEpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgdGVzdCgpIHtcclxuICAgICAgICB2YXIgYTogYW55ID0gbmV3IEEoKTtcclxuICAgICAgICB2YXIgYjogYW55ID0gbmV3IEIoKTtcclxuICAgICAgICBhLmIgPSBiO1xyXG4gICAgICAgIGEubmFtZSA9IFwibWF4XCI7XHJcbiAgICAgICAgYS5pZCA9IDk7XHJcbiAgICAgICAgYi5hID0gYTtcclxuICAgICAgICBiLmlkID0gNztcclxuICAgICAgICB2YXIgcyA9IHRoaXMuc3RyaW5naWZ5KGEpO1xyXG4gICAgICAgIHZhciB0ZXN0ID0gYXdhaXQgdGhpcy5wYXJzZShzKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNsYXNzIEEge1xyXG4gICAgbmFtZTogXCJoYWxsb1wiXHJcbn1cclxuLy9qYXNzaWpzLnJlZ2lzdGVyKFwiY2xhc3Nlc1wiLCBcImRlLkFcIiwgQSk7XHJcbmNsYXNzIEIge1xyXG4gICAgaGg6IFwiZHVcIlxyXG5cclxufVxyXG4vL2phc3NpanMucmVnaXN0ZXIoXCJjbGFzc2VzXCIsIFwiZGUuQlwiLCBCKTsiXX0=