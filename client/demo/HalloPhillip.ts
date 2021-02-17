import { BoxPanel } from "jassi/ui/BoxPanel";
import { Table } from "jassi/ui/Table";
import { HTMLPanel } from "jassi/ui/HTMLPanel";
import { Select } from "jassi/ui/Select";
import { Panel } from "jassi/ui/Panel";
import { Button } from "jassi/ui/Button";
import { Textbox } from "jassi/ui/Textbox";
import { NumberConverter } from "jassi/ui/converters/NumberConverter";
import { $Class } from "jassi/remote/Jassi";
import { router } from "jassi/base/Router";
import { $Action, $ActionProvider, $Actions, ActionProperties } from "jassi/base/Actions";

type Me = {
    aboutbutton?: Button;
    text?: Textbox;
    zahl1?: Textbox;
    zahl2?: Textbox;
    ergebnis?: Textbox;
};

@$ActionProvider("jassi.base.ActionNode")
@$Class("demo.HalloPhillip")
export class HalloPhillip extends Panel {
    me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    @$Actions()
    static testActions():ActionProperties[]{
        return [{name:"Demo/say hello",run:function(){
            alert("hello");
        }}]
    }
     @$Action({
        name: "Demo/Hallo Phillip",
       icon: "mdi mdi-face",
    })
    static async showDialog() {
        router.navigate("#do=demo.HalloPhillip");  
    }
    async setdata() {
    }
    layout(me: Me) {
        me.aboutbutton = new Button();
        me.text = new Textbox();
        me.zahl1 = new Textbox();
        me.zahl2 = new Textbox();
        me.ergebnis = new Textbox();
        this.isAbsolute = true;
        this.width = 574;
        this.height = 529;
        this.add(me.text);
        this.add(me.zahl1);
        this.add(me.zahl2);
        this.add(me.ergebnis);
        this.add(me.aboutbutton);
        me.aboutbutton.text = "about us";
        me.aboutbutton.x = 3;
        me.aboutbutton.y = 3;
        me.aboutbutton.onclick(function (event) {
            me.text.value = "mein papa und ich haben diese textbox programiert";
        });
        me.aboutbutton.height = 20;
        me.text.x = 5;
        me.text.y = 30;
        me.text.width = 165;
        me.zahl1.x = 5;
        me.zahl1.y = 60;
        me.zahl1.label = "zahl 1";
        me.zahl1.converter = new NumberConverter();
        me.zahl1.oninput(function (event) {
            me.ergebnis.value = <number>me.zahl1.value + <number>me.zahl2.value;
        });
        me.zahl1.height = 15;
        me.zahl2.x = 5;
        me.zahl2.y = 109;
        me.zahl2.label = "zahl 2";
        me.zahl2.converter = new NumberConverter();
        me.zahl2.oninput(function (event) {
            me.ergebnis.value = <number>me.zahl1.value + <number>me.zahl2.value;
        });
        me.ergebnis.x = 5;
        me.ergebnis.y = 165;
        me.ergebnis.label = "ergebnis";
        me.ergebnis.converter = new NumberConverter();
    }
    destroy() {
        //$(this.me.text.dom).draggable("destroy");
        super.destroy();
    }
}
;
export function test() {
    var t = new HalloPhillip();
    $.notify.addStyle('download extension', {
        html: '<a href="https://raw.githubusercontent.com/uwei/jassijs/main/jassichrome/jassijsext.zip" target="_blank"><span data-notify-text/></a>'
    });
    $.notify('For debugging in edge an chrome the jassi debugging extension must be installed. Click here to download.', {
        style: 'download extension'
    });
    // kk.o=0;
    return t;
}
