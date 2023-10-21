import { $Class } from "jassijs/remote/Registry";
import { Component, $UIComponent, ComponentProperties } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";


export interface ButtonProperties extends ComponentProperties{
    domProperties?:React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      /**
    * register an event if the button is clicked
    * @param {function} handler - the function that is called on change
    */
    onclick?(handler, removeOldHandler: boolean );
     /**
    * @member {string} - the icon of the button
    */
    icon?:string;
        /**
     * @member {string} - the caption of the button
     */
    text?:string;

}


@$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } })
@$Class("jassijs.ui.Button")
export class Button<T extends ButtonProperties={}> extends Component<ButtonProperties> implements ButtonProperties {
    constructor(properties:ButtonProperties={}){
        super(properties);
    }
    config(config: T,forceRender=false): Button<T> {
        super.config(config);
        return this;
    }
    get dom(): HTMLButtonElement {
        return <any>super.dom;
    }

    set dom(value: HTMLButtonElement) {
        super.dom=value;
    }
    render(){
        return React.createElement("button",{...this.props.domProperties,
                                        className:"Button",
                                        contenteditable:false},
                React.createElement("span",{
                                className:"buttonspan"
                                },React.createElement("img",{
                                    style:{display: "none"},
                                    className:"buttonimg"}),
                                  React.createElement("span",{
                                    className:"buttontext"
                                  })
                )
        );
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler, removeOldHandler: boolean = true) {
       
        if(removeOldHandler){
            this.off("click");
        }
        return this.on("click",handler);
    }
    set icon(icon: string) { //the Code
        var img;
        if(icon===undefined)
            icon="";
        if(this.dom===undefined||this.dom===null)
            debugger;
        var el1 = this.dom.querySelector(".buttonspan");
        el1.classList.forEach((cl)=> {el1.classList.remove(cl)});
        el1.classList.add("buttonspan");
         (<HTMLInputElement> this.dom.querySelector(".buttonimg")).setAttribute("src","");
        if (icon?.startsWith("mdi")) {
            icon.split(" ").forEach((cl)=>{el1.classList.add(cl)});
            
            (<HTMLElement> this.dom.querySelector(".buttonimg")).style.display="none";
        } else {
            (<HTMLElement> this.dom.querySelector(".buttonimg")).style.display="initial";
            (<HTMLInputElement> this.dom.querySelector(".buttonimg")).setAttribute("src",icon);
        }
    }
    
    @$Property({type:"image"})
    get icon(): string { //the Code
        var ret=(<HTMLInputElement> this.dom.querySelector(".buttonimg")).getAttribute("src");
        if(ret===""){
            ret= (<HTMLInputElement> this.dom.querySelector(".buttonspan")).getAttribute("class").replace("buttonspan ","");
        }
        return ret;
    }
    set text(value: string) { //the Code
        (<HTMLInputElement> this.dom.querySelector(".buttontext")).innerText=value===undefined?"":value;
    }
    @$Property()
    get text(): string {
        var ret=(<HTMLInputElement> this.dom.querySelector(".buttontext")).innerText;
        if(ret===undefined)
            ret="";
        return  ret;
    }
    toggle(setDown = undefined) {
        if (setDown === undefined) {
            this.dom.classList.contains("down")?this.dom.classList.remove("down"):this.dom.classList.add("down");
            
            return this.dom.classList.contains("down");
        } else {
            if (setDown && !this.dom.classList.contains("down"))
                this.dom.classList.contains("down")?this.dom.classList.remove("down"):this.dom.classList.add("down");
            if (!setDown && this.dom.classList.contains("down"))
                this.dom.classList.contains("down")?this.dom.classList.remove("down"):this.dom.classList.add("down");

            return this.dom.classList.contains("down");
        }
    }
    destroy(){
        super.destroy();
    }
}

export async function test() {
    var Panel = (await (import("jassijs/ui/Panel"))).Panel;
    var pan = new Panel();
    var but = new Button();
    but.text = "Hallo";
    but.icon ="mdi mdi-car"; //"mdi mdi-car";//"res/red.jpg";
    but.onclick(()=>alert(1));
    //alert(but.icon);
    pan.add(but);
    pan.width = 100;
    pan.height = 100;
    return pan;
}