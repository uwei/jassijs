define(["require", "exports", "./HTMLComponent", "./TextComponent"], function (require, exports, HTMLComponent_1, TextComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createComponent = exports.React = void 0;
    var React = {
        createElement(type, props, ...children) {
            if (props === undefined || props === null) //TODO is this right?
                props = {};
            if (children) {
                props.children = children;
            }
            var ret = {
                props: props,
                type: type
            };
            //@ts-ignore
            for (var x = 0; x < Component._componentHook.length; x++) {
                //@ts-ignore
                Component._componentHook[x]("create", ret, "React.createElement");
            }
            return ret;
        }
    };
    exports.React = React;
    //@ts-ignore
    React.Component = class {
        constructor(props) {
            this.props = props;
        }
    };
    window.React = React;
    function createComponent(node) {
        var _a, _b;
        var atype = node.type;
        var props = node.props;
        var ret;
        if (typeof atype === "string") {
            if (props === undefined)
                props = {};
            props.tag = atype;
            ret = new HTMLComponent_1.HTMLComponent(props);
            //ret.tag = atype;
            var newdom = ret.dom; //document.createElement(atype);
            //ret.init(newdom, { noWrapper: true });
        }
        else if (atype.constructor !== undefined) {
            ret = new atype(props);
        }
        else if (typeof atype === "function") {
            ret = atype(props);
        }
        if (((_a = node === null || node === void 0 ? void 0 : node.props) === null || _a === void 0 ? void 0 : _a.children) !== undefined) {
            if (props === null || props === undefined)
                props = {};
            props.children = (_b = node === null || node === void 0 ? void 0 : node.props) === null || _b === void 0 ? void 0 : _b.children;
            for (var x = 0; x < props.children.length; x++) {
                var child = props.children[x];
                var cchild;
                if (typeof child === "string") {
                    cchild = new TextComponent_1.TextComponent();
                    cchild.tag = "";
                    cchild.text = child;
                    //child.dom = nd;
                }
                else {
                    cchild = createComponent(child);
                }
                ret.add(cchild);
            }
        }
        return ret;
    }
    exports.createComponent = createComponent;
});
//# sourceMappingURL=React.js.map