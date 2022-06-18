
import { Kunde } from "de/remote/Kunde";
import { extensions, $Extension } from "jassijs/remote/Extensions";
import { $Class } from "jassijs/remote/Registry";

//Do not import the class we want to extend!
declare module "de/remote/Kunde"{
    export interface Kunde{
        extFunc2;
    }
}

@$Extension("de.Kunde")
@$Class("de.KundeExt2")
class KundeExt2 {
    /**
    * sample Extension
    */ 
    constructor() {

    }
    //Error wenn tabelle mit Tabulator mit Kunden gefüllt wird
    //extFunc2() { return 8; }
    /**
     * is called after main class is loaded
     * example type.prototype.hallo=function(){}
     * @param {class} type - the type to extend
     */
    static extend(type) {
        //Error wenn tabelle mit Tabulator mit Kunden gefüllt wird
        //type.prototype.extFunc2 = function () { return 8; }
    }

}
//jassijs.register("extensions", "de.Kunde", KundeExt2, "KundeExt2");

