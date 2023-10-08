import { Component, $UIComponent } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { DataComponent, DataComponentProperties } from "jassijs/ui/DataComponent";

export interface ImageConfig extends DataComponentProperties {

       /**
    * register an event if the image is clicked
    * @param {function} handler - the function that is called on change
    */
    onclick?(handler);
  /**
    * @member {string} - link to image
    */
    src?:string;
}

@$UIComponent({ fullPath: "default/Image", icon: "mdi mdi-file-image" })//
@$Class("jassijs.ui.Image")
export class Image extends DataComponent implements ImageConfig{
    /* get dom(){
         return this.dom;
     }*/
    constructor() { 
        super();
        super.init('<div style="display: inline-block;white-space: nowrap;"><img  vspace="0" hspace="0"  border="0"  src="" alt=""></div>');
    }
     config(config:ImageConfig ): Image {
        super.config(config);
        return this;
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler) {
        this.on("click",handler);

    }

    /**
    * @member {string} value - value of the component 
    */
    set value(value) { //the Code
        this.src = value;
    }
    @$Property({ type: "string" })
    get value() {
        return this.src
    }
    get width() {

        return super.width;
    }
    set width(value) {
        if (value === undefined)
            (<HTMLElement>this.dom.children[0]).setAttribute("width", "");
        else
            (<HTMLElement>this.dom.children[0]).setAttribute("width", "100%");
        super.width = value;
    }
    get height() {

        return super.height;
    }
    set height(value) {
        if (value === undefined)
            (<HTMLElement>this.dom.children[0]).setAttribute("height", "");
        else
            (<HTMLElement>this.dom.children[0]).setAttribute("height", "100%");
        super.height = value;
    }
    set src(icon: string) {
        this.dom.classList.forEach((cl)=>{this.dom.classList.remove(cl)});
        (<HTMLElement>this.dom.children[0]).setAttribute("src", "")
        if (icon?.startsWith("mdi ")) {
            icon.split(" ").forEach((cl)=>this.dom.classList.add(cl)) ;
            (<HTMLElement>this.dom.children[0]).style.visibility= "hidden";
        } else {
           (<HTMLElement>this.dom.children[0]).setAttribute("src", icon);
            (<HTMLElement>this.dom.children[0]).style.visibility= "";
        }
    }
    @$Property({ type: "image" })
    get src(): string {
        var ret = (<HTMLElement>this.dom.children[0]).getAttribute("src");
        if (ret === "")
            return this.dom.getAttribute('class');
        else
            return ret;
        //            return $(this.dom).attr("src");
    }

}

export function test() {
    var ret = new Image().config({src:"mdi mdi-file-image"});
    
    return ret;
}

