import jassi, { $Class } from "./Jassi";
import  {classes} from "./Classes";
let cl=classes;//force Classes.

@$Class("jassi.remote.DBArray")
export  class DBArray

/**
* Array for jassi.base.DBObject's
* can be saved to db
* @class jassi.base.DBArray
*/
extends Array{
   constructor(...args){
       super(...args);
   }
   private _parentObject;
   private _parentObjectMember;
   /**
    * adds an object 
    * if the object is linked to an other object then update this
    * @param {object} ob - the object to add
    */
   add(ob){
       if(ob===undefined||ob===null)
           throw "Error cannot add object null";
       this.push(ob);
       if(this._parentObject!==undefined){ 
           //set linked object
           var link=jassi.db.typeDef.linkForField(this._parentObject.__proto__._dbtype,this._parentObjectMember);
           if(link!==undefined&&link.type==="array"){//array can not connected){
               var test=ob._objectProperties[link.name];//do not resolve!
               if(test!==undefined&&test.unresolvedclassname===undefined){
                   if(test.indexOf(this._parentObject)<0)
                       test.add(this._parentObject);
               }
           }
           if(link!==undefined&&link.type==="object"){
               var test=ob.__objectProperties[link.name];//do not resolve!
               if(test!==undefined&&test.unresolvedclassname!==undefined&&test!==this){
                   ob._setObjectProperty(link.name,this._parentObject);
               }
           }
       }
   }
   /**
    * for compatibility
    */
   async resolve(){
       //Object was already resolved   
       return this;
   }

   /**
    * remove an object 
    * if the object is linked to an other object then update this
    * @param {object} ob - the object to remove
    */
   remove(ob){ 
       var pos=this.indexOf(ob); 
       if(pos>=0)
           this.splice(pos, 1);
        if(this._parentObject!==undefined){
           //set linked object
           var link=jassi.db.typeDef.linkForField(this._parentObject.__proto__._dbtype,this._parentObjectMember);
          
           if(link!==undefined&&link.type==="array"){//array can not connected){
               var test=ob._objectProperties[link.name];//do not resolve!
               if(test!==undefined&&test.unresolvedclassname===undefined){
                   if(test.indexOf(this._parentObject)>=0)
                       test.remove(this._parentObject);
               }
           }
           if(link!==undefined&&link.type==="object"){
               var test=ob._getObjectProperty(link.name);
               if(test!==undefined&&test.unresolvedclassname!==undefined&&test!==this){
                   ob._setObjectProperty(link.name,null);
               }
           }
       }
       
   }
}
