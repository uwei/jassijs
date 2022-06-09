import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Component, $UIComponent, ComponentConfig } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";

export interface ButtonConfig extends ComponentConfig{
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
export class Button extends Component implements ButtonConfig {
   
    constructor() {
        super();
        super.init($('<button class="Button" id="dummy" contenteditable=false><span class="buttonspan"><img style="display: none" class="buttonimg"></img></span><span class="buttontext" > </span></button>')[0]);
    }
    config(config:ButtonConfig):Button {
        super.config(<ComponentConfig>config);
        return this;
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler, removeOldHandler: boolean = true) {
       
        if(removeOldHandler){
            this.off("click");
        }
        return this.on("click",handler);
/*        if (removeOldHandler)
            $("#" + this._id).prop("onclick", null).off("click");
        $("#" + this._id).click(function (ob) {
            handler(ob);
        });*/
    }
    set icon(icon: string) { //the Code
        var img;
        var el1 = $(this.dom).find(".buttonspan");
        el1.removeClass();
        el1.addClass("buttonspan");
         $(this.dom).find(".buttonimg").attr("src", "");
        if (icon?.startsWith("mdi")) {
            el1.addClass(icon);
            $(this.dom).find(".buttonimg").css("display","none");
        } else {
            $(this.dom).find(".buttonimg").css("display","initial");
            $(this.dom).find(".buttonimg").attr("src", icon);
        }
    }
    @$Property({type:"image"})
    get icon(): string { //the Code
        var ret=$(this.dom).find(".buttonimg").attr("src");
        if(ret===""){
            ret= $(this.dom).find(".buttonspan").attr("class").replace("buttonspan ","");
        }
        return ret;
    }
    set text(value: string) { //the Code
        $(this.dom).find(".buttontext").html(value);
    }
    @$Property()
    get text(): string {
        return $(this.dom).find(".buttontext").text();
    }
    toggle(setDown = undefined) {
        if (setDown === undefined) {
            $(this.dom).toggleClass("down");
            return $(this.dom).hasClass("down");
        } else {
            if (setDown && !$(this.dom).hasClass("down"))
                $(this.dom).toggleClass("down");
            if (!setDown && $(this.dom).hasClass("down"))
                $(this.dom).toggleClass("down");

            return $(this.dom).hasClass("down");
        }
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