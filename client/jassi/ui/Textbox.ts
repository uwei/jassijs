import jassi, { $Class } from "jassi/remote/Jassi";
import {Component,  $UIComponent } from "jassi/ui/Component";
import {DataComponent} from "jassi/ui/DataComponent";
import {DefaultConverter} from "jassi/ui/converters/DefaultConverter";
import registry from "jassi/remote/Registry";
import {Property,  $Property } from "jassi/ui/Property";
@$UIComponent({fullPath:"common/Textbox",icon:"mdi mdi-form-textbox"})
@$Class("jassi.ui.Textbox")
@$Property({name:"new",type:"string"})
export  class Textbox extends DataComponent{
       /* get dom(){
            return this.dom;
        }*/
        @$Property({type:"classselector", service:"$Converter"})
        converter:DefaultConverter;
        _autocompleterDisplay;
        _autocompleter;

        constructor(color=undefined){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super();
            super.init($('<input type="text" />')[0]);
            $(this.dom).css("color",color);
            this.converter=undefined;
        }
        /**
         * @member {boolean} disabled - enable or disable the element
         */
        set disabled(value){
            $(this.dom).prop('disabled', true);
        }
        get disabled(){
            return $(this.dom).prop('disabled');
        }
        /**
         * @member {string} value - value of the component 
         */
        set value(value){ //the Code
                    $(this.dom).val(value);
        }
        get value(){
        	var ret= $(this.dom).val();
        	if(this.converter!==undefined){
        		ret=this.converter.stringToObject(ret);
        	}
            return ret;
        }
          /**
         * called if value has changed
         * @param {function} handler - the function which is executed
         */

        @$Property({default:"function(event){\n\t\n}"})
        onclick(handler){
             $( "#"+this._id ).click(function(e) {
                handler(e);
            }); 
        }
        /**
         * called if value has changed
         * @param {function} handler - the function which is executed
         */

        @$Property({default:"function(event){\n\t\n}"})
        onchange(handler){
             $( "#"+this._id ).change(function(e) {
                handler(e);
            }); 
        }
        /**
         * called if a key is pressed down
         * @param {function} handler - the function which is executed
         */
        @$Property({default:"function(event){\n\t\n}"})
        onkeydown(handler){
             $(this.dom).keydown(function(e) {
                handler(e);
            }); 
        }
        /**
         * called if user has something typed
         * @param {function} handler - the function which is executed
         */
        @$Property({default:"function(event){\n\t\n}"})
        oninput(handler){
             $( "#"+this._id ).on("input",function() {
                handler();
            }); 
        }
        /*
         * <input list="browsers" name="myBrowser" />
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
</datalist>+>
         */
         @$Property()
         set placeholder(text:string){
         	$(this.dom).attr("placeholder",text);
         }
         
         get placeholder():string{
         	return $(this.dom).attr("placeholder");
         }
         /**
         *  @member {string|function} completerDisplay - property or function used to gets the value to display
         */
        set autocompleterDisplay(value:string|((object:any)=>string)){ 
            this._autocompleterDisplay=value;
            if(this.autocompleter!==undefined){
                this.autocompleter=this.autocompleter;//force rendering
            }
        }
        get autocompleterDisplay(){ 
            return this._autocompleterDisplay;
        }
        private fillCompletionList(values:any){
        	var h:any[]|(()=>any);
        	console.log("fill");
        	 var list=$(this.dom).attr("list");
        	var html="";
           var comp:any=$("#"+list);
           comp[0]._values=values;
           //comp.empty();
           for(var x=0;x<values.length;x++){
               var val=values[x];
               if(typeof (this.autocompleterDisplay)==="function"){
                   val=this.autocompleterDisplay(val);
               }else if(this.autocompleterDisplay!==undefined){
                   val=val[this.autocompleterDisplay];
               }
               html+='<option value="'+val+'">';
               //comp.append('<option value="'+val+'">');
            }
            comp[0].innerHTML=html;
        }
        /**
         *  @member {[object]} completer - values used for autocompleting 
         */
        set autocompleter(value:any[]|(()=>any)){ 
           var list=$(this.dom).attr("list");
           var _this=this;
           if(!list&&typeof(value)==="function"){
           		$(this.dom).on("mouseover",(ob)=>{
           			if(_this._autocompleter.children.length===0){
           				var values=value();
           				_this.fillCompletionList(values);
           			}
           		})
           }
           if(list===undefined){
               list=registry.nextID();
               this._autocompleter=$('<datalist id="'+list+'"/>')[0];
               this.domWrapper.appendChild(this._autocompleter);
               $(this.dom).attr("list",list);
           }
           if(typeof(value)==="function"){
           	
           }else{
        		this.fillCompletionList(value);
            	
           }
           // $(this.dom).val(value);
        }
        get autocompleter(){
            var list=$(this.dom).prop("list");
            if(list===undefined)
                return undefined;
            var comp=$(list)[0];
            if(comp===undefined)
                return undefined;
            return comp._values;
           // return $(this.dom).val();
        }
        /**
         * focus the textbox
         */
        focus(){
        	$(this.dom).focus();
        }
        destroy(){
        	if(this._autocompleter)
        		$(this._autocompleter).remove();
        	super.destroy();
        }

    }
export function test(){
	var ret=new Textbox();
	//ret.autocompleter=()=>[];
	return ret;
}
   // return CodeEditor.constructor;
