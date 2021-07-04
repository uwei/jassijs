
import jassi from "jassijs/remote/Jassi";
//Do not import the class we want to extend!
declare module "de/remote/Kunde"{
    export interface Kunde{
        extFunc2;
    }
}
//  de.Kunde.prototype.extFunc=function(){return 6;}
class KundeExt2 {
    /**
    * sample Extension
    */ 
    constructor() {

    }
    /**
     * is called after main class is loaded
     * example type.prototype.hallo=function(){}
     * @param {class} type - the type to extend
     */
    static extend(type) {
        type.prototype.extFunc2 = function () { return 8; }
    }

}
//jassijs.register("extensions", "de.Kunde", KundeExt2, "KundeExt2");

