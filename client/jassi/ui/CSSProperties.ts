import jassi, { $Class } from "remote/jassi/base/Jassi";
import {Property,  $Property } from "jassi/ui/Property";
import { Component } from "jassi/ui/Component";


var systemFonts= ["Arial","Helvetica Neue","Courier New","Times New Roman","Comic Sans MS","Impact"];
var api='https://fonts.googleapis.com/css?family=';
/**
 * loads googlefonts if needed
 **/
export function loadFontIfNedded(font:string){
	if(systemFonts.indexOf(font)===-1){
		var sfont=font.replaceAll(" ","+")
		if(!document.getElementById("-->"+api+sfont)){//"-->https://fonts.googleapis.com/css?family=Aclonica">
			jassi.myRequire(api+sfont);
		}
	}
}

@$Class("jassi.ui.CSSProperties")
export class CSSProperties{
	@$Property({type:"color"})
	background_color?:string;
	@$Property()
	background_image?:string;
    @$Property({type:"color"})
	border_color?:string;
	@$Property({chooseFrom:["none","hidden","dotted","dashed","solid","double","groove","ridge","inset","outset","inherit","initial","unset"]})
	border_style?:string|"none"|"hidden"|"dotted"|"dashed"|"solid"|"double"|"groove"|"ridge"|"inset"|"outset"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["thin","medium","thick","2px","inherit","initial","unset"]})
	border_width?:string|"thin"|"medium"|"thick"|"2px"|"inherit"|"initial"|"unset";
	@$Property({type:"color"})
	color?:string;
	@$Property({chooseFrom:["auto","default","none","context-menu","help","pointer","progress","wait","cell","crosshair","text","vertical-text","alias","copy","move","no-drop","not-allowed","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out","inherit","initial","unset"]})
	cursor?:string|"auto"|"default"|"none"|"context-menu"|"help"|"pointer"|"progress"|"wait"|"cell"|"crosshair"|"text"|"vertical-text"|"alias"|"copy"|"move"|"no-drop"|"not-allowed"|"grab"|"grabbing"|"all-scroll"|"col-resize"|"row-resize"|"n-resize"|"e-resize"|"s-resize"|"w-resize"|"ne-resize"|"nw-resize"|"se-resize"|"sw-resize"|"ew-resize"|"ns-resize"|"nesw-resize"|"nwse-resize"|"zoom-in"|"zoom-out"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["blur(5px)","brightness(0.4)","contrast(200%)","drop-shadow(16px 16px 20px blue)","grayscale(50%)","hue-rotate(90deg)","invert(75%)","opacity(25%)","saturate(30%)","sepia(60%)","inherit","initial","unset"]})
	filter?:string|"blur(5px)"|"brightness(0.4)"|"contrast(200%)"|"drop-shadow(16px 16px 20px blue)"|"grayscale(50%)"|"hue-rotate(90deg)"|"invert(75%)"|"opacity(25%)"|"saturate(30%)"|"sepia(60%)"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["left","right","none","inline-start","inline-end","inherit","initial","unset"]})
	float?:string|"left"|"right"|"none"|"inline-start"|"inline-end"|"inherit"|"initial"|"unset";
	@$Property({type:"font"})
	font_family?:string;
	@$Property({chooseFrom:["12px","xx-small","x-small","small","medium","large","x-large","xx-large","xxx-large","larger","smaller","inherit","initial","unset"]})
	font_size?:string|"12px"|"xx-small"|"x-small"|"small"|"medium"|"large"|"x-large"|"xx-large"|"xxx-large"|"larger"|"smaller"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["normal","small-caps","small-caps slashed-zero","common-ligatures tabular-nums","no-common-ligatures proportional-nums","inherit","initial","unset"]})
	font_variant?:string|"normal"|"small-caps"|"small-caps slashed-zero"|"common-ligatures tabular-nums"|"no-common-ligatures proportional-nums"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["normal","bold","lighter","bolder","100","900","inherit","initial","unset"]})
	font_weight?:string|"normal"|"bold"|"lighter"|"bolder"|"100"|"900"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["normal","1px"]})
	letter_spacing?:string|"normal"|"1px";
	@$Property({chooseFrom:["normal","32px"]})
	line_height?:string|"normal"|"32px";
	@$Property({chooseFrom:["3px"]})
	margin_bottom?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	margin_left?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	margin_right?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	margin_top?:string|"3px";
	@$Property({chooseFrom:["visible","hidden","clip","scroll","auto","inherit","initial","unset"]})
	overflow?:string|"visible"|"hidden"|"clip"|"scroll"|"auto"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["3px"]})
	padding_bottom?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	padding_left?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	padding_right?:string|"3px";
	@$Property({chooseFrom:["3px"]})
	padding_top?:string|"3px";
	@$Property({chooseFrom:["static","relative","absolute","sticky","fixed","inherit","initial","unset"]})
	position?:string|"static"|"relative"|"absolute"|"sticky"|"fixed"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["start","end","left","right","center","justify","match-parent","inherit","initial","unset"]})
	text_align?:string|"start"|"end"|"left"|"right"|"center"|"justify"|"match-parent"|"inherit"|"initial"|"unset";
	@$Property({type:"color"})
	text_decoration_color?:string;
	@$Property({chooseFrom:["none","underline","overline","line-through","blink","spelling-error","grammar-error","inherit","initial","unset"]})
	text_decoration_line?:string|"none"|"underline"|"overline"|"line-through"|"blink"|"spelling-error"|"grammar-error"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["solid","double","dotted","dashed","wavy","inherit","initial","unset"]})
	text_decoration_style?:string|"solid"|"double"|"dotted"|"dashed"|"wavy"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["3px"]})
	text_decoration_thickness?:string|"3px";
	@$Property({chooseFrom:["none","capitalize","uppercase","lowercase","full-width","full-size-kana","inherit","initial","unset"]})
	text_transform?:string|"none"|"capitalize"|"uppercase"|"lowercase"|"full-width"|"full-size-kana"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["baseline","sub","super","text-top","text-bottom","middle","top","bottom","3px","inherit","initial","unset"]})
	vertical_align?:string|"baseline"|"sub"|"super"|"text-top"|"text-bottom"|"middle"|"top"|"bottom"|"3px"|"inherit"|"initial"|"unset";
	@$Property({chooseFrom:["1","2","auto"]})
	z_index?:string|"1"|"2"|"auto";
	[name:string]:string;
	static applyTo(properties:CSSProperties, component:Component):CSSProperties{
		var prop={};
		for(let key in properties){
			var newKey=key.replaceAll("_","-");
			prop[newKey]=(<string>properties[key]);
			if(newKey==="font-family"){
				loadFontIfNedded(prop[newKey]);
			}
		}
		$(component.dom).css(prop);
		return prop;
	}
}
