import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { Kunde } from "de/remote/Kunde";
import { extensions, $Extension } from "jassijs/remote/Extensions";

//Do not import the class we want to extend!
declare module "de/remote/Kunde"{
    export  interface Kunde{
        extFunc():string;
        extField:string;
    }
}

 

extensions.annotateMember("de.Kunde","extField",String,Column({nullable:true}));


//  de.Kunde.prototype.extFunc=function(){return 6;}
@$Extension("de.Kunde")
@$Class("de.KundeExt")
class KundeExt {
    hello:string;

    get hello2(){
        return "pp";
    }
    //this is called on Kunde
    
    /**
    * sample Extension
    */
   initExtensions() {
        
    }
    extFunc(){
        return 3;
    }
    /**
     * is called after main class is loaded
     * example type.prototype.hallo=function(){}
     * @param {class} type - the type to extend
     */
    static extend(type) {
        //type.prototype.extFunc = function () { return 8; }
    }

}
//Hack for tabulator.js
KundeExt.prototype.extFunc["match"]=function(){return false;}
//jassijs.register("extensions", "de.Kunde", KundeExt, "KundeExt");

