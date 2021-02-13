import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import { Kunde } from "remote/de/Kunde";
import { extensions, $Extension } from "jassi/remote/Extensions";

//Do not import the class we want to extend!
declare module "remote/de/Kunde"{
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
        type.prototype.extFunc = function () { return 8; }
    }

}

//jassi.register("extensions", "de.Kunde", KundeExt, "KundeExt");

