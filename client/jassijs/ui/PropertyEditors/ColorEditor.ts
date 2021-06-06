import {PropertyEditor} from "jassijs/ui/PropertyEditor";
import {Editor,  $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import {Textbox} from "jassijs/ui/Textbox";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import { classes } from "jassijs/remote/Classes";
import { Panel } from "jassijs/ui/Panel";
import { Select } from "jassijs/ui/Select";
import { loadFontIfNedded } from "jassijs/ui/CSSProperties";
import "jassijs/ext/spectrum";
import { BoxPanel } from "jassijs/ui/BoxPanel";
var colors=["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","orange","aliceblue","antiquewhite","aquamarine","azure","beige","bisque","blanchedalmond","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","gainsboro","ghostwhite","gold","goldenrod","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","limegreen","linen","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","oldlace","olivedrab","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","thistle","tomato","turquoise","violet","wheat","whitesmoke","yellowgreen","rebeccapurple"];
@$PropertyEditor(["color"])
@$Class("jassijs.ui.PropertyEditors.ColorEditor")
/**
* Editor for color
* used by PropertyEditor
**/
export class ColorEditor extends Editor{
	icon:Textbox;
	select:Select;
    constructor( property, propertyEditor) {
    	super(property, propertyEditor);
        var _this = this;
        /** @member - the renedering component **/
        this.component = new BoxPanel();
		this.component.horizontal=true;
		this.icon=new Textbox();
		this.icon.width="10px";
		this.select=new Select();
		this.select.width="85px";
		this.component.add(this.select);
		this.component.add(this.icon);
		this.select.items=colors;
		this.select.display=function(color:string){
			return "<span><div style='float:left;width:10px;height:10px;background:"+color+"'></div>"+color+"</span>"
		}
		var spec=$(this.icon.dom)["spectrum"]({
	    	color: "#f00",
	    	change: function(color) {
	    		var scolor=color.toHexString();
	    		var old:string[]=_this.select.items;
	    		if(old.indexOf(scolor)===-1)
	    			old.push(scolor);
    			_this.select.items=old;
	    		_this.select.value=scolor;
	    		_this._onchange({});
	//		    _this.paletteChanged(color.toHexString()); // #ff0000
			}
	 	});
	 	//correct height
	 	var bt=$(this.icon.domWrapper).find(".sp-preview");
	 	bt.css("width","8px");
	 	bt.css("height","8px");
	 	var bx=$(this.icon.domWrapper).find(".sp-replacer");
	 	bx.css("height","10px");
		bx.css("width","10px");
	 	var bp=$(this.icon.domWrapper).find(".sp-dd");
	 	bp.css("height","6px");
	 	//spec.width="10px";
     //   this.component.dom=font[0];
        
        this.select.onchange(function (param) {
            _this._onchange(param);
        });

    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        var value = this.propertyEditor.getPropertyValue(this.property);
        if(!value||value==="")
        	value="";
        else
            value = value.substring(1, value.length - 1);
         $(this.icon.dom)["spectrum"]("set", value);
         
        var old:string[]=this.select.items;
	    if(old.indexOf(value)===-1)
	    	old.push(value);
	    this.select.items=old;			
        this.select.value = value;
    }
    get ob() {
        return this._ob;
    }

    /**
   * get the renderer for the PropertyEditor
   * @returns - the UI-component for the editor
   */
    getComponent() {
        return this.component;
    }
    paletteChanged(color:string){
    	//var val =  "\"" + color + "\"";
        //this.propertyEditor.setPropertyInCode(this.property.name, val);
        //this.propertyEditor.setPropertyInDesign(this.property.name, color);
        this.select.value=color;
        //super.callEvent("edit", color);
    }

    /**
     * intern the value changes
     * @param {type} param
     */
    _onchange(param) {
    	 var val = this.select.value;
            val = "\"" + val + "\"";
        this.propertyEditor.setPropertyInCode(this.property.name, val);
        var oval=this.select.value;
        $(this.icon.dom)["spectrum"]("set", oval);
        this.propertyEditor.setPropertyInDesign(this.property.name, oval);
        super.callEvent("edit", param);
    }
}
export function test(){
	
	var prop=new PropertyEditor(undefined);
	prop.value=new Textbox();
	return prop;
} 
export function test2(){
	var panel=new BoxPanel();
	panel.horizontal=false;
	var icon=new Textbox();
	var textbox=new Textbox();
	panel.add(textbox);
	panel.add(icon);
	var spec=$(icon.dom)["spectrum"]({
    	color: "#f00"
 	});
 	spec.width="10px";
 	spec.height="10px";
	return panel;
}
