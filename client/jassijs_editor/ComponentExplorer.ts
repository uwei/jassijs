import jassijs, { $Class } from "jassijs/remote/Jassi";
import {Panel} from "jassijs/ui/Panel";
import {Tree} from "jassijs/ui/Tree";
import {ComponentDescriptor} from "jassijs/ui/ComponentDescriptor";
import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Action, Actions } from "jassijs/base/Actions";
import { Container } from "jassijs/ui/Container";
import { CodeEditor } from "jassijs_editor/CodeEditor";
import { ComponentDesigner } from "jassijs_editor/ComponentDesigner";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { propertyeditor } from "jassijs/base/PropertyEditorService";

@$Class("jassijs_editor.ComponentExplorer")
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
        /** @member {jassijs_editor.CodeEditor} - the parent CodeEditor */
        this.codeEditor = codeEditor;
        this.tree = new Tree();
        this.tree.height = "100%";
        this.contextMenu=new ContextMenu();
        this.add(this.contextMenu);
        this.layout();
        this.propertyEditor=propertyEditor;
    }
    /**
     * @member {jassijs.ui.Component}  - the rendered object 
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
            if(comp===undefined)
                continue;
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
jassijs.test = async function () {
    var dlg = new jassijs.ui.ComponentExplorer();
    dlg.getComponentName = function (item) {
        return "hallo";
    };
    dlg.value = dlg;
    return dlg;
}


