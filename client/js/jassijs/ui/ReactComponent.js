define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
/*export function createElement(tag:string,props:any,...children:Component[]):Component{
    var ret=new Component();
    ret.dom=document.createElement(tag);
    for(var prop in props){
        if(prop in ret.dom){
            Reflect.set(ret.dom,prop,[props[prop]])
        }if(ret.dom.hasAttribute(prop)){
            ret.dom.setAttribute(prop,props[prop]);
        }else if(ret.dom.hasAttribute(prop.toLocaleLowerCase())){
            ret.dom.setAttribute(prop,props[prop.toLocaleLowerCase()]);
        }
    }
    ret.init(ret.dom,{noWrapper:true});
    return ret;
}*/ 
//# sourceMappingURL=ReactComponent.js.map