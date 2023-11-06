import { $Class } from "jassijs/remote/Registry";
import {Property,  $Property } from "jassijs/ui/Property";
import { Component } from "jassijs/ui/Component";


var systemFonts= ["Arial","Helvetica Neue","Courier New","Times New Roman","Comic Sans MS","Impact"];
var api='https://fonts.googleapis.com/css?family=';
/**
 * loads googlefonts if needed
 **/
export function loadFontIfNedded(font:string){
	if(systemFonts.indexOf(font)===-1){
		var sfont=font.replaceAll(" ","+")
		if(!document.getElementById("-->"+api+sfont)){//"-->https://fonts.googleapis.com/css?family=Aclonica">
			jassijs.myRequire(api+sfont);
		}
	}
}

var hj:React.CSSProperties={
	backgroundColor:undefined,
};
@$Class("jassijs.ui.CSSProperties")
export class CSSProperties {
	@$Property({type:"color"})
	backgroundColor?:string;
	@$Property()
	backgroundImage?:string;
    @$Property({type:"color"})
	borderColor?:string;
	@$Property({chooseFrom:["none","hidden","dotted","dashed","solid","double","groove","ridge","inset","outset","inherit","initial","unset"]})
	borderStyle?:string|"none"|"hidden"|"dotted"|"dashed"|"solid"|"double"|"groove"|"ridge"|"inset"|"outset"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["thin","medium","thick","2px","inherit","initial","unset"]})
	borderWidth?:string|"thin"|"medium"|"thick"|"2px"|"inherit"|"initial"|"unset";
	@$Property({type:"color"})
	color?:string;
	@$Property({chooseFrom:["auto","default","none","context-menu","help","pointer","progress","wait","cell","crosshair","text","vertical-text","alias","copy","move","no-drop","not-allowed","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out","inherit","initial","unset"]})
	cursor?:string|"auto"|"default"|"none"|"context-menu"|"help"|"pointer"|"progress"|"wait"|"cell"|"crosshair"|"text"|"vertical-text"|"alias"|"copy"|"move"|"no-drop"|"not-allowed"|"grab"|"grabbing"|"all-scroll"|"col-resize"|"row-resize"|"n-resize"|"e-resize"|"s-resize"|"w-resize"|"ne-resize"|"nw-resize"|"se-resize"|"sw-resize"|"ew-resize"|"ns-resize"|"nesw-resize"|"nwse-resize"|"zoom-in"|"zoom-out"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["blur(5px)","brightness(0.4)","contrast(200%)","drop-shadow(16px 16px 20px blue)","grayscale(50%)","hue-rotate(90deg)","invert(75%)","opacity(25%)","saturate(30%)","sepia(60%)","inherit","initial","unset"]})
	filter?:string|"blur(5px)"|"brightness(0.4)"|"contrast(200%)"|"drop-shadow(16px 16px 20px blue)"|"grayscale(50%)"|"hue-rotate(90deg)"|"invert(75%)"|"opacity(25%)"|"saturate(30%)"|"sepia(60%)"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["left","right","none","inline-start","inline-end","inherit","initial","unset"]})
	float?:string|"left"|"right"|"none"|"inline-start"|"inline-end"|"inherit"|"initial"|"unset";
	@$Property({type:"font"})
	fontFamily?:string;
	@$Property({chooseFrom:["12px","xx-small","x-small","small","medium","large","x-large","xx-large","xxx-large","larger","smaller","inherit","initial","unset"]})
	fontSize?:string|"12px"|"xx-small"|"x-small"|"small"|"medium"|"large"|"x-large"|"xx-large"|"xxx-large"|"larger"|"smaller"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["normal","small-caps","small-caps slashed-zero","common-ligatures tabular-nums","no-common-ligatures proportional-nums","inherit","initial","unset"]})
	fontVariant?:string|"normal"|"small-caps"|"small-caps slashed-zero"|"common-ligatures tabular-nums"|"no-common-ligatures proportional-nums"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["normal","bold","lighter","bolder","100","900","inherit","initial","unset"]})
	fontWeight?:string|"normal"|"bold"|"lighter"|"bolder"|"100"|"900"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["normal","1px"]})
	letterSpacing?:string|"normal"|"1px";
	@$Property({chooseFrom:["normal","32px"]})
	lineHeight?:string|"normal"|"32px";
	@$Property({chooseFrom:["3px"]})
	marginBottom?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	marginLeft?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	marginRight?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	marginTop?:string|"3px";
	@$Property({chooseFrom:["visible","hidden","clip","scroll","auto","inherit","initial","unset"]})
	overflow?:string|"visible"|"hidden"|"clip"|"scroll"|"auto"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["3px"]})
	paddingBottom?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	paddingLeft?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	paddingRight?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	paddingTop?:string|"3px";
	@$Property({chooseFrom:["static","relative","absolute","sticky","fixed","inherit","initial","unset"]})
	position?:string|"static"|"relative"|"absolute"|"sticky"|"fixed"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["start","end","left","right","center","justify","match-parent","inherit","initial","unset"]})
	textAlign?:string|"start"|"end"|"left"|"right"|"center"|"justify"|"match-parent"|"inherit"|"initial"|"unset";
	@$Property({type:"color"})
	textDecorationColor?:string;
	@$Property({chooseFrom:["none","underline","overline","line-through","blink","spelling-error","grammar-error","inherit","initial","unset"]})
	textDecorationLine?:string|"none"|"underline"|"overline"|"line-through"|"blink"|"spelling-error"|"grammar-error"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["solid","double","dotted","dashed","wavy","inherit","initial","unset"]})
	textDecorationStyle?:string|"solid"|"double"|"dotted"|"dashed"|"wavy"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["3px"]})
	textDecorationThickness?:string|"3px";
	@$Property({chooseFrom:["none","capitalize","uppercase","lowercase","full-width","full-size-kana","inherit","initial","unset"]})
	textTransform?:string|"none"|"capitalize"|"uppercase"|"lowercase"|"full-width"|"full-size-kana"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["baseline","sub","super","text-top","text-bottom","middle","top","bottom","3px","inherit","initial","unset"]})
	verticalAlign?:string|"baseline"|"sub"|"super"|"text-top"|"text-bottom"|"middle"|"top"|"bottom"|"3px"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["1","2","auto"]})
	zIndex?:string|"1"|"2"|"auto";
	[name:string]:string;
	static applyTo(properties:React.CSSProperties, component:Component):React.CSSProperties{
		var prop={};
		for(let key in properties){
			var newKey=key;//.replaceAll("_","-");
			prop[newKey]=(<string>properties[key]);
			if(newKey==="font-family"){
				loadFontIfNedded(prop[newKey]);
			}
			component.dom.style[newKey]=properties[key];
		}
		return prop;
	}
}
