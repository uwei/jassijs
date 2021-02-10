import jassi, { $Class } from "remote/jassi/base/Jassi";
import {Panel} from "jassi/ui/Panel";
import {Tree} from "jassi/ui/Tree";
import {ComponentDescriptor} from "jassi/ui/ComponentDescriptor";
import { ContextMenu } from "jassi/ui/ContextMenu";
import { Action, Actions } from "jassi/base/Actions";
import { Container } from "jassi/ui/Container";
import { call, name } from "node_modules/@types/sizzle";
import { CodeEditor } from "jassi/ui/CodeEditor";
import { ComponentDesigner } from "jassi/ui/designer/ComponentDesigner";
import { PropertyEditor } from "jassi/ui/PropertyEditor";
import { propertyeditor } from "jassi/base/PropertyEditorService";

@$Class("jassi.ui.ComponentExplorer")
export class ComponentExplorer extends Panel {
    codeEditor:CodeEditor;
    propertyEditor:PropertyEditor;
    tree:Tree;
    //contextMenu:ContextMenu;
    _value;
    /**
    * edit object properties
    */
    constructor(codeEditor:CodeEditor,propertyEditor:PropertyEditor) {
        super();
        /** @member {jassi.ui.CodeEditor} - the parent CodeEditor */
        this.codeEditor = codeEditor;
        this.tree = new Tree();
        this.tree.height = "100%";
        this.contextMenu=new ContextMenu();
        this.add(this.contextMenu);
        this.layout();
        this.propertyEditor=propertyEditor;
    }
    /**
     * @member {jassi.ui.Component}  - the rendered object 
     */
    set value(value) {
        this._value = value;
        this.tree.items = value;
        this.tree.expandAll();
    }
    get value() {
        return this._value;
    }
    /**
     * get the displayname of the item
     * must be override
     * @param {object} item
     */
    getComponentName(item) {
        return item;
    }
    
    /**
     * get the child components
     * must be override
     * @param {object} item
     */
    getComponentChilds(item) {
        if (item === this.value)
            return item._components
        var comps = ComponentDescriptor.describe(item.constructor).resolveEditableComponents(item);

        var ret = [];
        for (var name in comps) {
            var comp = comps[name];
            var complist = comp._components;
            if (name !== "this" && this.getComponentName(comp) !== undefined) {
                if (ret.indexOf(comp) === -1)
                    ret.push(comp);
            }
            if (complist !== undefined) {
                for (var y = 0; y < complist.length; y++) {
                    if (this.getComponentName(complist[y]) !== undefined) {
                        if (ret.indexOf(complist[y]) === -1)
                            ret.push(complist[y]);
                    }
                }
            }
        }
        return ret;
    }
    layout() {
        var _this = this;
        this.tree.width = "100%";
        this.tree.height = "100%";
        this.tree.propChilds = function (item) {
            return _this.getComponentChilds(item);
        }

        this.tree.propDisplay = function (item) {
            return _this.getComponentName(item);
        }
        this.contextMenu.getActions=async function(data:any[]):Promise<Action[]>{
        	var ret=[];
        	var parent=<Container> data[0]._parent;
        	
        	if(parent!==undefined&&parent._components!==undefined){
        		var hasDummy=(parent._components[parent._components.length-1]["designDummyFor"]!==undefined?1:0);
        		if((parent._components.length>1+hasDummy)&&parent._components.indexOf(data[0])!==0){
	        		var ac:Action={
	        			call:function(){
	        				
	        				_this.propertyEditor.swapComponents(parent._components[parent._components.indexOf(data[0])+-1],data[0]);
	        				_this.tree.items=_this.tree.items;
	        				_this.tree.value=data[0];
	        			},
	        			name:"move up"
	        		};
	        		ret.push(ac)
	        	}
	        		if(parent._components.length>1+hasDummy&&
	        	      parent._components.indexOf(data[0])+hasDummy+1<parent._components.length){
	        			var ac:Action={
	        			call:function(){
	        				_this.propertyEditor.swapComponents(data[0],parent._components[parent._components.indexOf(data[0])+1]);
	        				_this.tree.items=_this.tree.items;
	        				_this.tree.value=data[0];
	        			},
	        			name:"move down"
	        		};
	        		ret.push(ac)
	        	}
        	}
        	return ret;
        }
        this.tree.contextMenu=this.contextMenu;
        this.add(this.tree);
    }
    update() {
        this.value = this.value;
    }
    onclick(handler) {
        this.tree.addEvent("click", handler);
    }
    destroy(){
    	this._value=undefined;
    	super.destroy();
    }
}
jassi.test = async function () {
    var dlg = new jassi.ui.ComponentExplorer();
    dlg.getComponentName = function (item) {
        return "hallo";
    };
    dlg.value = dlg;
    return dlg;
}


