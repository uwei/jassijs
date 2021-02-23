var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jassi = exports.$register = exports.$Class = void 0;
    /*
    window.extentsionCalled = function (param:  ExtensionAction) {
        if (param.sample) {
            alert("default:" + param.defaultAction.name);
        }
       
    }
    window.extentsionCalled({
        sample: { name: "Passt" }
    })*/
    function $Class(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$Class", pclass, longclassname);
        };
    }
    exports.$Class = $Class;
    function $register(servicename, ...params) {
        return function (pclass) {
            Registry_1.default.register(servicename, pclass, params);
        };
    }
    exports.$register = $register;
    //@ts-ignore
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    /**
    * main class for jassi
    * @class Jassi
    */
    let Jassi = class Jassi {
        constructor() {
            this.isServer = false;
            //@ts-ignore
            this.isServer = window.document === undefined;
            if (!this.isServer) {
                //  this.myRequire("jassi/jassi.css");
                //  this.myRequire("https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css");
                //  this.myRequire("https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css");
            }
        }
        /**
         * include a global stylesheet
         * @id - the given id - important for update
         * @data - the css data to insert
         **/
        includeCSS(id, data) {
            //@ts-ignore
            var style = document.getElementById(id);
            //@ts-ignore
            if (!document.getElementById(id)) {
                style = $('<style id=' + id + '></style>')[0];
                //@ts-ignore
                document.head.appendChild(style);
            }
            var sstyle = "";
            for (var selector in data) {
                var sstyle = sstyle + "\n\t" + selector + "{\n";
                var properties = data[selector];
                var prop = {};
                for (let key in properties) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    prop[newKey] = properties[key];
                    sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
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
                }
                else {
                    url = href[0];
                    href.splice(0, 1);
                }
            }
            if (url.endsWith(".js")) {
                //@ts-ignore
                if (window.document.getElementById("-->" + url) !== null) {
                    this.myRequire(href, event);
                }
                else {
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
            }
            else {
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
                link.onload = function (data1, data2) {
                    _this.myRequire(href, event);
                };
                head.appendChild(link);
            }
        }
    };
    Jassi = __decorate([
        $Class("jassi.remote.Jassi"),
        __metadata("design:paramtypes", [])
    ], Jassi);
    exports.Jassi = Jassi;
    ;
    var jassi = new Jassi();
    //@ts-ignore
    if (window["jassi"] === undefined) { //reloading this file -> no destroy namespace
        //@ts-ignore
        window["jassi"] = jassi;
    }
    exports.default = jassi;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSmFzc2kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaS9yZW1vdGUvSmFzc2kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWNBOzs7Ozs7Ozs7UUFTSTtJQUdKLFNBQWdCLE1BQU0sQ0FBQyxhQUFxQjtRQUN4QyxPQUFPLFVBQVUsTUFBTTtZQUNuQixrQkFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQTtJQUNMLENBQUM7SUFKRCx3QkFJQztJQUNELFNBQWdCLFNBQVMsQ0FBQyxXQUFtQixFQUFFLEdBQUcsTUFBTTtRQUNwRCxPQUFPLFVBQVUsTUFBTTtZQUNuQixrQkFBUSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQTtJQUNMLENBQUM7SUFKRCw4QkFJQztJQVFELFlBQVk7SUFDWixNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLE1BQWEsRUFBRSxXQUFrQjtRQUNyRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUE7SUFJRDs7O01BR0U7SUFFRixJQUFhLEtBQUssR0FBbEIsTUFBYSxLQUFLO1FBTWQ7WUFEQSxhQUFRLEdBQVksS0FBSyxDQUFDO1lBRXRCLFlBQVk7WUFDWixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsQixzQ0FBc0M7Z0JBQ3RDLG9HQUFvRztnQkFDcEcsNEZBQTRGO2FBQzdGO1FBQ0wsQ0FBQztRQUNKOzs7O1lBSUk7UUFDSixVQUFVLENB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QztJQUMvQixZQUFZO0lBQ1osSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssU0FBUyxFQUFDLEVBQUMsNkNBQTZDO1FBQzNFLFlBQVk7UUFDYixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQzNCO0lBSUQsa0JBQWUsS0FBSyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCByZWdpc3RyeSBmcm9tIFwiamFzc2kvcmVtb3RlL1JlZ2lzdHJ5XCI7IFxyXG5cclxuXHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBleHBvcnQgY2xhc3MgRXh0ZW5zaW9uQWN0aW9uIHtcclxuICAgICAgIC8qIHNhbXBsZT86IHtcclxuICAgICAgICAgICAgbmFtZTogc3RyaW5nLFxyXG4gICAgICAgICAgICBwYXJhbTE6IHN0cmluZztcclxuICAgICAgICB9OyovXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbndpbmRvdy5leHRlbnRzaW9uQ2FsbGVkID0gZnVuY3Rpb24gKHBhcmFtOiAgRXh0ZW5zaW9uQWN0aW9uKSB7XHJcbiAgICBpZiAocGFyYW0uc2FtcGxlKSB7XHJcbiAgICAgICAgYWxlcnQoXCJkZWZhdWx0OlwiICsgcGFyYW0uZGVmYXVsdEFjdGlvbi5uYW1lKTtcclxuICAgIH1cclxuICAgXHJcbn1cclxud2luZG93LmV4dGVudHNpb25DYWxsZWQoe1xyXG4gICAgc2FtcGxlOiB7IG5hbWU6IFwiUGFzc3RcIiB9XHJcbn0pKi9cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gJENsYXNzKGxvbmdjbGFzc25hbWU6IHN0cmluZyk6IEZ1bmN0aW9uIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocGNsYXNzKSB7XHJcbiAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXIoXCIkQ2xhc3NcIiwgcGNsYXNzLCBsb25nY2xhc3NuYW1lKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gJHJlZ2lzdGVyKHNlcnZpY2VuYW1lOiBzdHJpbmcsIC4uLnBhcmFtcyk6IEZ1bmN0aW9uIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocGNsYXNzKSB7XHJcbiAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXIoc2VydmljZW5hbWUsIHBjbGFzcywgcGFyYW1zKTtcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgaW50ZXJmYWNlIFN0cmluZyB7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgcmVwbGFjZUFsbDogYW55O1xyXG4gICAgfVxyXG59XHJcbi8vQHRzLWlnbm9yZVxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoc2VhcmNoOnN0cmluZywgcmVwbGFjZW1lbnQ6c3RyaW5nKTpzdHJpbmcge1xyXG4gICAgdmFyIHRhcmdldCA9IHRoaXM7XHJcbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHNlYXJjaCkuam9pbihyZXBsYWNlbWVudCk7XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiogbWFpbiBjbGFzcyBmb3IgamFzc2lcclxuKiBAY2xhc3MgSmFzc2lcclxuKi9cclxuQCRDbGFzcyhcImphc3NpLnJlbW90ZS5KYXNzaVwiKVxyXG5leHBvcnQgY2xhc3MgSmFzc2kge1xyXG4gICAgLy8gIHB1YmxpYyBjbGFzc2VzOkNsYXNzZXM9dW5kZWZpbmVkO1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgYmFzZTogeyBbazogc3RyaW5nXTogYW55IH07XHJcbiAgICBwdWJsaWMgbW9kdWxlczp7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcclxuICAgIGlzU2VydmVyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmlzU2VydmVyID0gd2luZG93LmRvY3VtZW50ID09PSB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzU2VydmVyKSB7XHJcbiAgICAgICAgICAvLyAgdGhpcy5teVJlcXVpcmUoXCJqYXNzaS9qYXNzaS5jc3NcIik7XHJcbiAgICAgICAgICAvLyAgdGhpcy5teVJlcXVpcmUoXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL0BtZGkvZm9udEA1LjkuNTUvY3NzL21hdGVyaWFsZGVzaWduaWNvbnMubWluLmNzc1wiKTtcclxuICAgICAgICAgIC8vICB0aGlzLm15UmVxdWlyZShcImh0dHBzOi8vL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9qcXVlcnl1aS8xLjEyLjEvanF1ZXJ5LXVpLmNzc1wiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblx0LyoqXHJcblx0ICogaW5jbHVkZSBhIGdsb2JhbCBzdHlsZXNoZWV0XHJcblx0ICogQGlkIC0gdGhlIGdpdmVuIGlkIC0gaW1wb3J0YW50IGZvciB1cGRhdGVcclxuXHQgKiBAZGF0YSAtIHRoZSBjc3MgZGF0YSB0byBpbnNlcnRcclxuXHQgKiovXHJcblx0aW5jbHVkZUNTUyhpZDogc3RyaW5nLCBkYXRhOiB7IFtjc3NzZWxlY3Rvcjogc3RyaW5nXTogYW55LypDU1NQcm9wZXJ0aWVzKi8gfSkge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHZhciBzdHlsZTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpIHtcclxuXHQgICAgICAgIHN0eWxlID0gJCgnPHN0eWxlIGlkPScgKyBpZCArICc+PC9zdHlsZT4nKVswXTtcclxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xyXG5cdCAgICB9XHJcblx0ICAgIHZhciBzc3R5bGU9XCJcIjtcclxuXHQgICAgZm9yKHZhciBzZWxlY3RvciBpbiBkYXRhKXtcclxuXHRcdCAgICB2YXIgc3N0eWxlID0gc3N0eWxlK1wiXFxuXFx0XCIgKyBzZWxlY3RvciArIFwie1xcblwiO1xyXG5cdFx0ICAgIHZhciBwcm9wZXJ0aWVzPWRhdGFbc2VsZWN0b3JdO1xyXG5cdCAgICAgICAgdmFyIHByb3AgPSB7fTtcclxuXHRcdCAgICBmb3IgKGxldCBrZXkgaW4gcHJvcGVydGllcykge1xyXG5cdFx0ICAgIFx0aWYoa2V5PT09XCJfY2xhc3NuYW1lXCIpXHJcblx0XHQgICAgXHRcdGNvbnRpbnVlO1xyXG5cdFx0ICAgICAgICB2YXIgbmV3S2V5ID0ga2V5LnJlcGxhY2VBbGwoXCJfXCIsIFwiLVwiKTtcclxuXHRcdCAgICAgICAgcHJvcFtuZXdLZXldID0gKDxzdHJpbmc+cHJvcGVydGllc1trZXldKTtcclxuXHRcdCAgICAgICAgc3N0eWxlID0gc3N0eWxlICsgXCJcXHRcXHRcIiArIG5ld0tleSArIFwiOlwiICsgKDxzdHJpbmc+cHJvcGVydGllc1trZXldKSArIFwiO1xcblwiO1xyXG5cdFx0ICAgIH1cclxuXHRcdFx0c3N0eWxlID0gc3N0eWxlICsgXCJcXHR9XFxuXCI7XHJcblx0ICAgIH1cclxuXHQgICAgc3R5bGUuaW5uZXJIVE1MID0gc3N0eWxlO1xyXG5cdH1cclxuICAgIC8qKlxyXG4gICAgKiBpbmNsdWRlIGEganMgb3IgYSBjc3MgZmlsZVxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gaHJlZiAtIHVybChzKSBvZiB0aGUganMgb3IgY3NzIGZpbGUocylcclxuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gW3BhcmFtXSAtIHdvdWxkIGJlIGFkZGVkIHdpdGg/IHRvIHRoZSB1cmxcclxuICAgICovXHJcbiAgICBteVJlcXVpcmUoaHJlZiwgZXZlbnQgPSB1bmRlZmluZWQsIHBhcmFtID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZXJ2ZXIpXHJcbiAgICAgICAgICAgIHRocm93IFwiamFzcy5SZXF1aXJlIGlzIG9ubHkgYXZhaWxhYmxlIG9uIGNsaWVudFwiO1xyXG4gICAgICAgIGlmICgodHlwZW9mIGhyZWYpID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIGhyZWYgPSBbaHJlZl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdXJsID0gXCJcIjtcclxuICAgICAgICBpZiAoaHJlZiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGlmIChocmVmLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHVybCA9IGhyZWZbMF07XHJcbiAgICAgICAgICAgICAgICBocmVmLnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVybC5lbmRzV2l0aChcIi5qc1wiKSkge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIi0tPlwiICsgdXJsKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5teVJlcXVpcmUoaHJlZiwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICB2YXIganMgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgICAgICAgICAgIC8vICAganMudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiAgICAgICAgICAgICAgICBqcy5zcmMgPSB1cmwgKyAocGFyYW0gIT09IHVuZGVmaW5lZCA/IFwiP1wiICsgcGFyYW0gOiBcIlwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBqcy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubXlSZXF1aXJlKGhyZWYsIGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBqcy5pZCA9IFwiLS0+XCIgKyB1cmw7XHJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5kb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGpzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vICAgIDxsaW5rIGhyZWY9XCJsaWIvanF1ZXJ5LnNwbGl0dGVyLmNzc1wiIHJlbD1cInN0eWxlc2hlZXRcIi8+XHJcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB2YXIgaGVhZCA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgdmFyIGxpbmsgPSB3aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xyXG4gICAgICAgICAgICAvLyAgbGluay5yZWwgID0gJ2ltcG9ydCc7XHJcbiAgICAgICAgICAgIGxpbmsuaHJlZiA9IHVybDtcclxuICAgICAgICAgICAgbGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcclxuICAgICAgICAgICAgbGluay5pZCA9IFwiLS0+XCIgKyB1cmw7XHJcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxpbmsub25sb2FkID0gZnVuY3Rpb24gKGRhdGExLGRhdGEyKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5teVJlcXVpcmUoaHJlZiwgZXZlbnQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxudmFyIGphc3NpOiBKYXNzaSA9IG5ldyBKYXNzaSgpO1xyXG4vL0B0cy1pZ25vcmVcclxuaWYgKHdpbmRvd1tcImphc3NpXCJdID09PSB1bmRlZmluZWQpey8vcmVsb2FkaW5nIHRoaXMgZmlsZSAtPiBubyBkZXN0cm95IG5hbWVzcGFjZVxyXG4gICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgd2luZG93W1wiamFzc2lcIl0gPSBqYXNzaTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBqYXNzaTsiXX0=