import jassi, { $Class } from "remote/jassi/base/Jassi";
import {Component,  $UIComponent} from "jassi/ui/Component";
import {Property,  $Property } from "jassi/ui/Property";



@$UIComponent({ fullPath:"common/Button",icon:"mdi mdi-gesture-tap-button",initialize:{text:"button"}})
@$Class("jassi.ui.Button")
export class Button extends Component{
       /* get dom(){
            return this.dom;
        }*/
        constructor(){ 
            super();    
            super.init($('<button class="Button" id="dummy" contenteditable=false><span class="element1"></span><span class="element2" > </span></button>')[0]);
        }
        
     
         /**
         * register an event if the button is clicked
         * @param {function} handler - the function that is called on change
         */
        @$Property({default:"function(event){\n\t\n}"})
        onclick(handler,removeOldHandler:boolean=true){ 
        	if(removeOldHandler)
	        	$("#"+this._id ).prop("onclick", null).off("click");
           $( "#"+this._id ).click(function(ob) {
                handler(ob);
            }); 
        }
         /**
         * @member {string} - the icon of the button
         */
        set icon(icon:string){ //the Code
            var img;
            if(icon?.startsWith("mdi")){
                img=$('<span >')[0];
                $(img).removeClass();
                $(img).addClass(icon);
            }else{
                img=$('<img vspace="0" hspace="0"  border="0"  src="" alt="">')[0];
                $(img).attr("src",icon);
            }
            var dompic=$(this.dom).find(".element1")[0];
            if(dompic.children.length===1)
                dompic.removeChild(dompic.children[0]);
            dompic.appendChild(img);
        }
        @$Property()
        get icon():string{ //the Code
            var dompic=$(this.dom).find(".element1")[0];
            if(dompic.children.length===1)
                return "";
            return ($(this.dom).find(".element1")).attr("class");
        }
        /**
         * @member {string} - the caption of the button
         */
        set text(value:string){ //the Code
            $(this.dom).find(".element2").html(value);
        }
        @$Property()
        get text():string{
            return  $(this.dom).find(".element2").text();
        }
        toggle(setDown=undefined){
        	if(setDown===undefined){
	        	 $(this.dom).toggleClass("down");
	        	 return $(this.dom).hasClass("down");
        	}else{
        		if(setDown&&!$(this.dom).hasClass("down"))
        			$(this.dom).toggleClass("down");
        		if(!setDown&& $(this.dom).hasClass("down"))
        			$(this.dom).toggleClass("down");
        		
        		return $(this.dom).hasClass("down");
        	}
        }
}

