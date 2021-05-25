import jassi, { $Class } from "jassi/remote/Jassi";
import { Component, $UIComponent } from "jassi/ui/Component";
import { Property, $Property } from "jassi/ui/Property";



@$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } })
@$Class("jassi.ui.Button")
export class Button extends Component {
    /* get dom(){
         return this.dom;
     }*/
    constructor() {
        super();
        super.init($('<button class="Button" id="dummy" contenteditable=false><span class="buttonspan"><img class="buttonimg"></img></span><span class="buttontext" > </span></button>')[0]);
    }


    /**
    * register an event if the button is clicked
    * @param {function} handler - the function that is called on change
    */
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
    /**
    * @member {string} - the icon of the button
    */
    set icon(icon: string) { //the Code
        var img;
        var el1 = $(this.dom).find(".buttonspan");
        el1.removeClass();
        el1.addClass("buttonspan");
         $(this.dom).find(".buttonimg").attr("src", "");
        if (icon?.startsWith("mdi")) {
            el1.addClass(icon);

        } else {
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
    /**
     * @member {string} - the caption of the button
     */
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
    var Panel = (await (import("jassi/ui/Panel"))).Panel;
    var pan = new Panel();
    var but = new Button();
    but.text = "Hallo";
    but.icon ="res/red.jpg"; //"mdi mdi-car";//"res/red.jpg";
    //alert(but.icon);
    pan.add(but);
    pan.width = 100;
    pan.height = 100;
    return pan;
}