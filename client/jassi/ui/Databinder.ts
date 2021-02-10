
import jassi from "jassi/jassi";
import {InvisibleComponent} from "jassi/ui/InvisibleComponent";
import {Component,  $UIComponent } from "jassi/ui/Component";
import { $Class } from "remote/jassi/base/Jassi";


@$UIComponent({fullPath:"common/Databinder",icon:"mdi mdi-connection"})
@$Class("jassi.ui.Databinder")
export  class Databinder extends InvisibleComponent{
        components:Component[];
        _properties:string[];
        _getter: { (comp: Component): any; } [];
        _setter:{ (comp: Component,value:any): any; } [];
        _onChange:string[];
        _autocommit:any[];
        userObject;
        constructor(){//id connect to existing(not reqired)
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
            /** @member {[jassi.ui.Component]} components - all binded components*/
            this.components=[];
            /** @member {[string]} properties - all binded properties*/
            this._properties=[];
            /** @member [[function]] getter - all functions to get the component value*/
            this._getter=[];
            /** @member [[function]] setter - all functions to set the component value*/
            this._setter=[];
            /** @member {[function]} onChange - changeHandler for all components used for autocommit*/
            this._onChange=[];
            /** @member {[function]} autocommit - autocommitHandler for all components*/
            this._autocommit=[];
            /** @member [{object}] userObject - the object to bind*/
            this.userObject=undefined;
        }
        
            
         /**
         * binds the component to the property of the userObject
         * @param {string} property - the name of the property to bind
         * @param {jassi.ui.Component} component - the component to bind
         * @param {string} [onChange] - functionname to register the  changehandler - if missing no autocommit is possible
         * @param {function} [getter] - function to get the value of the component - if missing .value is used
         * @param {function} [setter] - function to put the value of the component - if missing .value is used
         */
        add(property,component,onChange=undefined,getter=undefined,setter=undefined){//add a component to the container
            this.remove(component);
            this.components.push(component);
            this._properties.push(property);
            if(getter===undefined){
                this._getter.push(function(component:Component){
                    return component["value"];
                });
            }else
                this._getter.push(getter);
            
            if(setter===undefined){
                this._setter.push(function(component,value){
                    component["value"]=value;
                });
            }else
                this._setter.push(setter);
            
            if(onChange===undefined){
                this._onChange.push(component["onChange"]);
            }else
                this._onChange.push(onChange);
            
            if(this.userObject!==undefined){
                var pos=this._properties.indexOf(property);
                let setter=this._setter[pos];
                setter(component,this.userObject[property]);
            }
            this._autocommit.push(undefined);
        }
        remove(component){
            for(var x=0;x<this.components.length;x++){
                if(this.components[x]===component){
                    this.components.splice(x, 1);
                    this._properties.splice(x, 1);
                    this._getter.splice(x, 1);
                    this._setter.splice(x, 1);
                    this._onChange.splice(x, 1);
                    this._autocommit.splice(x, 1);
                }
            }
        }
        /**
         * defines getter and setter and connect this to the databinder 
         * @param {object} object - the object where we define the property 
         * @param {string} propertyname - the name of the property
         **/
        definePropertyFor(object,propertyname){
        	var _this=this;
        	Object.defineProperty(object, propertyname, {
			  get: function() { return _this.value; },
			  set: function(newValue) {
			  		if(newValue!==undefined&&newValue.then!==undefined){
			        	newValue.then(function(ob2){
			        			_this.value=ob2;
			        	});
		      		}else
		      			_this.value = newValue; 
			  	
			  },
			  enumerable: true,
			  configurable: true
			});
        }
        /**
         * @member {object} value - the binded userobject - call toForm on set
         */  
        get value(){
           // this.fromForm();
            return this.userObject;
        }
        set value(obj){
        	var _this=this;
        	if(obj!==undefined&&obj.then!==undefined){
	        	obj.then(function(ob2){
	        			_this.toForm(ob2);
	        	});
      		}else
	            this.toForm(obj);
        }
        /**
         * binds the object to all added components
         * @param {object} obj - the object to bind
         */
        toForm(obj){
            this.userObject=obj;
            for(var x=0;x<this.components.length;x++){
                var comp=this.components[x];
                var prop=this._properties[x];
                var sfunc=this._setter[x];
                var sget=this._getter[x];
                var oldValue=sget(comp);
                if(prop==="this"){
                    if(oldValue!==this.userObject){
                        sfunc(comp,this.userObject);
                    }
                }else{
                	if(this.userObject===undefined){
                		if(oldValue!==undefined)
                			sfunc(comp,undefined);	
                    }else{
                    	if(oldValue!==this.userObject[prop]){
	                        sfunc(comp,this.userObject[prop]);
	                    }
                    }
                }
                 //var sfunc=this.setter[x];
                 //this._toForm(prop,comp);
            }
        }
        /**
         * gets the objectproperties from all added components
         * @return {object}
         */
        fromForm(){
            if(this.userObject===undefined)
                return undefined;
            for(var x=0;x<this.components.length;x++){
                this._fromForm(x);
            }
            return this.userObject;
        }
        
        /**
         * get objectproperty
         * @param {number} x - the numer of the component
         */
        _fromForm(x){
            var comp=this.components[x];
            var prop=this._properties[x];
            var sfunc=this._getter[x];
            var test=sfunc(comp);
            if(test!==undefined){
                     if(prop==="this"){
                         var val=test;
                     	this.value=test;
                     }else{
                     	if(comp["converter"]!==undefined){
                     		test=comp["converter"].stringToObject(test);
                     	}
	                	this.userObject[prop]= test;
                    }
            }
        }
        /**
         * register the autocommit handler if needed
         * @param {jassi.ui.DataComponent} component
         */
        checkAutocommit(component){
            if(component.autocommit!==true)
                return;
            var pos=this.components.indexOf(component);
            if(this._autocommit[pos]!==undefined)
                return;
            var onchange=this._onChange[pos];
            if(onchange===undefined)
                return;
            var _this=this;
            this._autocommit[pos]=function(){
                pos=_this.components.indexOf(component);
                _this._fromForm(pos);
            };
            component[onchange](this._autocommit[pos]);
        }
        destroy(){
        	
            this.components=[];
            this._properties=[];
            this._getter=[];
            this._setter=[];
            this._onChange=[];
            this._autocommit=[];
            this.userObject=undefined;
        	super.destroy();
        }
    }

   // return CodeEditor.constructor;

