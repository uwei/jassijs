//@ts-ignore
import cock from "jassijs/ext/js-cookie";


class C{
    set(name:string, value:string, params=undefined){

    }
    get(name:string):any{

    }
    remove(name:string, params=undefined){

    }
    getJSON(){
        return "";
    } // removed!
}
var Cookies:C=cock.default;
export {Cookies};