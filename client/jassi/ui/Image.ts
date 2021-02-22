import {Component, $UIComponent } from "jassi/ui/Component";
import {Property,  $Property } from "jassi/ui/Property";
import jassi, { $Class } from "jassi/remote/Jassi";
import { DataComponent } from "jassi/ui/DataComponent";

@$UIComponent({fullPath:"default/Image",icon:"mdi mdi-file-image"})//
@$Class("jassi.ui.Image")
export class Image extends DataComponent {
       /* get dom(){
            return this.dom;
        }*/
        constructor(){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super();
            //  var img=$('<div >')[0];
            //super.init($('<img vspace="0" hspace="0"  border="0"  src="" alt="">')[0]);
            super.init($('<div style="display: inline-block;white-space: nowrap;"><img  vspace="0" hspace="0"  border="0"  src="" alt=""></div>')[0]);
        }
      
        onclick(handler){ 
           $( "#"+this._id ).click(function() {
                handler();
            }); 
        }

         /**
         * @member {string} value - value of the component 
         */
        set value(value){ //the Code
             this.src=value;
        }
        @$Property({type:"string"})
        get value(){
        	return this.src
        }
        get width(){

            return super.width;
        }
        set width(value){
            if(value===undefined)
                $(this.dom.children[0]).attr("width","");
            else
                 $(this.dom.children[0]).attr("width","100%");
            super.width=value;
        }
        get height(){

            return super.height;
        }
        set height(value){
             if(value===undefined)
                $(this.dom.children[0]).attr("height","");
            else
                $(this.dom.children[0]).attr("height","100%");
            super.height=value;
        }
        
        
         /**
         * @member {string} - link to image
         */
        set src(icon:string){ 
            $(this.dom).removeClass();
            $(this.dom.children[0]).attr("src","")
            if(icon?.startsWith("mdi ")){
                $(this.dom).addClass(icon);
                $(this.dom.children[0]).css("visibility","hidden");
            }else{
                $(this.dom.children[0]).attr("src",icon)
                $(this.dom.children[0]).css("visibility","");
            }
        }
        @$Property()
        get src():string{ 
            var ret=$(this.dom).attr("src");
            if(ret==="")
                return $(this.dom).attr('class');
            else
                return ret;
  //            return $(this.dom).attr("src");
        }

}

export function test(){
    var ret=new Image();
    ret.src="mdi mdi-file-image";
    return ret;
}

