import {Component, $UIComponent } from "jassi/ui/Component";
import {Property,  $Property } from "jassi/ui/Property";
import jassi, { $Class } from "jassi/remote/Jassi";

@$UIComponent({fullPath:"default/Image",icon:"mdi mdi-file-image"})//
@$Class("jassi.ui.Image")
export class Image extends Component{
       /* get dom(){
            return this.dom;
        }*/
        constructor(){ /* document.onkeydown = function(event) {
                alert("Hallo");
            };*/
            super();
            //  var img=$('<div >')[0];
            //super.init($('<img vspace="0" hspace="0"  border="0"  src="" alt="">')[0]);
            super.init($('<span><img vspace="0" hspace="0"  border="0"  src="" alt=""></span>')[0]);
        }
      
        onclick(handler){ 
           $( "#"+this._id ).click(function() {
                handler();
            }); 
        }
        
         /**
         * @member {string} - link to image
         */
        set src(icon:string){ 
            $(this.dom).removeClass();
            $(this.dom.children[0]).attr("src","")
            if(icon?.startsWith("mdi ")){
                $(this.dom).addClass(icon);
            }else{
                $(this.dom.children[0]).attr("src",icon)
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

