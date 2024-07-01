import { Component, $UIComponent } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { DataComponent, DataComponentProperties } from "jassijs/ui/DataComponent";

export interface ImageProperties extends DataComponentProperties {
    domProperties?:React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
       /**
    * register an event if the image is clicked
    * @param {function} handler - the function that is called on change
    */
    onclick?(handler);
  /**
    * @member {string} - link to image
    */
    src?:string;
    value?: string;
}

@$UIComponent({ fullPath: "default/Image", icon: "mdi mdi-file-image" })//
@$Class("jassijs.ui.Image")
export class Image<T extends ImageProperties=ImageProperties> extends DataComponent<T> implements ImageProperties{
    /* get dom(){
         return this.dom;
     }*/
    constructor(config:ImageProperties={}) { 
        super(config);
    }
    render(){
        return <div style={{display: "inline-block",whiteSpace: "nowrap"}}><img  {...this.props.domProperties} src="" alt=""></img></div>
    }
    config(config:T ): Image {
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
    @$Property({ type: "string" })
    set value(value) { //the Code
        this.src = value;
    }
    
    get value() {
        return this.src
    }
    get width() {

        return super.width;
    }
    set width(value) {
        if (value === undefined)
            (this.dom.children[0] as HTMLElement).setAttribute("width", "");
        else
            (this.dom.children[0]).setAttribute("width", "100%");
        super.width = value;
    }
    get height() {

        return super.height;
    }
    set height(value: string | number) {
        if (value === undefined)
            (this.dom.children[0]).setAttribute("height", "");
        else
            (this.dom.children[0]).setAttribute("height", "100%");
        super.height = value;
    }
    @$Property({ type: "image" })
    set src(icon: string) {
        this.dom.classList.forEach((cl)=>{this.dom.classList.remove(cl)});
        (this.dom.children[0]).setAttribute("src", "")
        if (icon?.startsWith("mdi ")) {
            icon.split(" ").forEach((cl)=>this.dom.classList.add(cl)) ;
            (this.dom.children[0] as HTMLElement).style.visibility= "hidden";
        } else {
           (this.dom.children[0]).setAttribute("src", icon);
            (this.dom.children[0] as HTMLElement).style.visibility= "";
        }
    }
    
    get src(): string {
        var ret = (this.dom.children[0] as HTMLElement).getAttribute("src");
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

