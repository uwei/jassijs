import jassijs, { $Class } from "jassijs/remote/Jassi";
import {Component,  $UIComponent } from "jassijs/ui/Component";
import {Property,  $Property } from "jassijs/ui/Property";
import { DataComponent } from "jassijs/ui/DataComponent";


@$UIComponent({ fullPath:"common/Ceckbox",icon:"mdi mdi-checkbox-marked-outline"})
@$Class("jassijs.ui.Checkbox")
export class Checkbox extends DataComponent{
        checkbox:ChildNode;
       /* get dom(){
            return this.dom;
        }*/
        constructor(){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super();
             
            super.init($('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>')[0]);
            this.checkbox=this.dom.firstChild;
//             $(this.domWrapper).append($('<span class="checkboxtext"></span>'));
        }
       
        onclick(handler){ 
           $(this.checkbox).click(function() {
                handler();
            }); 
        }
        /**
         * @member {string} - the caption of the button
         */
        set value(value){ //the Code
            if(value==="true")
                value=true;
            if(value==="false")
                value=false;
            
            $(this.checkbox).prop("checked",value);
        }
        @$Property({type:"boolean"})
        get value(){
            return  $(this.checkbox).prop("checked");
        }
         /**
         * @member {string} - the caption of the button
         */
        set text(value:string){ //the Code
            $(this.domWrapper).find(".checkboxtext").html(value);
        }
        @$Property()
        get text():string{
            return  $(this.domWrapper).find(".checkboxtext").html();
        }
       
    }
    export function test(){
        var cb=new Checkbox();
        cb.label="label";
        cb.value=true;
        return cb;
    }