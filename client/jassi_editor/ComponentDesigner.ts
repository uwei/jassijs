import jassi, { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import {VariablePanel} from "jassi/ui/VariablePanel";
import {PropertyEditor} from "jassi/ui/PropertyEditor";
import {ComponentExplorer} from "jassi_editor/ComponentExplorer";
import {ComponentPalette} from "jassi_editor/ComponentPalette";
import {Resizer} from "jassi_editor/util/Resizer";
//import DragAndDropper from "jassi/ui/helper/DragAndDropper";
import {ErrorPanel} from "jassi/ui/ErrorPanel";
import {CodeEditorInvisibleComponents} from "jassi_editor/CodeEditorInvisibleComponents";
import {Repeater} from "jassi/ui/Repeater";
import  "jassi/ui/Databinder";
import {Button} from "jassi/ui/Button";
import {Component} from "jassi/ui/Component";
import {DragAndDropper} from "jassi_editor/util/DragAndDropper";
import {ComponentDescriptor} from "jassi/ui/ComponentDescriptor";
import { classes } from "jassi/remote/Classes";
import {Container} from "jassi/ui/Container";

declare global {
    export interface ExtensionAction {
        componentDesignerSetDesignMode?: {
            enable:boolean,
            componentDesigner:ComponentDesigner
        }
        componentDesignerComponentCreated?:{
            //component:Component
            newParent:Container
        }
    }
}




@$Class("jassi_editor.ComponentDesigner")
export class ComponentDesigner extends Panel{
        _codeEditor;
        editMode:boolean;
        _variables:VariablePanel;
        _propertyEditor:PropertyEditor;
        _errors:ErrorPanel;
        _componentPalette:ComponentPalette;
        _componentExplorer:ComponentExplorer;
        _invisibleComponents:CodeEditorInvisibleComponents;
        _designToolbar:Panel;
        _designPlaceholder:Panel;
        _resizer:Resizer;
        _draganddropper:DragAndDropper;
        lastSelected:Component;
       
        constructor(){
            super();
            this._codeEditor=undefined;
            this._initDesign();
            this.editMode=true;
           // this.lastSelected=undefined;
       
        }
        set codeEditor(value){
        	var _this=this;
        	this._codeEditor=value;
        	this._variables=this._codeEditor._variables; 
            this._propertyEditor=new PropertyEditor(value);
         //   this._propertyEditor=new PropertyEditor(undefined);
            this._errors=this._codeEditor._errors;
            this._componentPalette=new ComponentPalette();
            this._componentPalette.service="$UIComponent";
            this._componentExplorer=new ComponentExplorer(value,this._propertyEditor); 
            this._invisibleComponents=new CodeEditorInvisibleComponents(value);
            this.add(this._invisibleComponents);
            this._initComponentExplorer();
            this._installView();
            this._codeEditor._codePanel.onblur(function(evt){
                _this._propertyEditor.updateParser();
            });
            this.registerKeys();
            
        }
        get codeEditor(){
        	return this._codeEditor;
        }
        _initDesign(){
        	var _this=this;
            this._designToolbar=new Panel();
            this._designPlaceholder=new Panel();
            var save=new Button();
            save.tooltip="Save(Ctrl+S)";
            save.icon="mdi mdi-content-save mdi-18px";
            save.onclick(function(){
                 _this.save(); 
            });
            this._designToolbar.add(save);
    		
    		var run=new Button();
            run.icon="mdi mdi-car-hatchback mdi-18px";
            run.tooltip="Run(F4)";
            run.onclick(function(){
               _this.evalCode(); 
            });
            this._designToolbar.add(run);
           
            var undo=new Button();
            undo.icon="mdi mdi-undo mdi-18px";
            undo.tooltip="Undo (Strg+Z)";
            undo.onclick(function(){
               _this.undo(); 
            });
            this._designToolbar.add(undo);
            
             var test=new Button();
            test.icon="mdi mdi-bug mdi-18px";
            test.tooltip="Test";
            test.onclick(function(){
            			//var kk=_this._codeView.layout;
            });
            this._designToolbar.add(test);
            
           
            var edit=new Button();
            edit.icon="mdi mdi-run mdi-18px";
            edit.tooltip="Test Dialog";
            edit.onclick(function(){
            	_this.editDialog(!_this.editMode); 
            	edit.toggle(!_this.editMode);
               
            });
            this._designToolbar.add(edit);
           
            var lasso=new Button();
            lasso.icon="mdi mdi-lasso mdi-18px";
            lasso.tooltip="Select rubberband";
            lasso.onclick(function(){
                var val=lasso.toggle();
                _this._resizer.setLassoMode(val);
				_this._draganddropper.canDrop(!val);
            });
            this._designToolbar.add(lasso);
           
            var remove=new Button();
            remove.icon="mdi mdi-delete-forever-outline mdi-18px";
            remove.tooltip="Delete selected Control (ENTF)";
            remove.onclick(function(){
               _this.removeComponent(); 
            });
            this._designToolbar.add(remove);
            this.add(this._designToolbar);
			$(this._designPlaceholder.domWrapper).css("position","relative");
            this.add(this._designPlaceholder);
            
          
        }
          /**
         * manage shortcuts
         */
        registerKeys(){
            var _this=this;
            $( this._codeEditor._design.dom).attr("tabindex","1");
            $(this._codeEditor._design.dom).keydown(function(evt) {
                if(evt.keyCode===115&&evt.shiftKey){//F4
                   // var thiss=this._this._id;
                   // var editor = ace.edit(this._this._id);
                   _this.evalCode(true);
                   evt.preventDefault();
                   return false;
                }else if(evt.keyCode===115) {//F4
                     _this.evalCode(false);
                   evt.preventDefault();
                   return false;
                }
                if(evt.keyCode===90||evt.ctrlKey){//Ctrl+Z
                    _this.undo();
                }
                if(evt.keyCode===116){//F5
                    evt.preventDefault();
                    return false;
                }
                 if(evt.keyCode===46){//Del
                     _this.removeComponent();
                    evt.preventDefault();
                    return false;
                }
                
                if (( String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey)/* && (evt.which == 19)*/) {//Str+s
                    _this.save();
                     event.preventDefault();
                    return false;
                }
                
            });
        }
        resize(){
        	this._updateInvisibleComponents();
        }
        _installView(){
            this._codeEditor._main.add(this._propertyEditor,"Properties","properties"); 
            this._codeEditor._main.add(this._componentExplorer,"Components","components"); 
            this._codeEditor._main.add(this._componentPalette,"Palette","componentPalette"); 
            this._codeEditor._main.layout='{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
		}
        
       _updateInvisibleComponents(){
            var _this=this;
            this._invisibleComponents.update().then(function(){
               /* var h=_this._invisibleComponents.dom.offsetHeight;
                h=h+6+31;
                _this._designPlaceholder.height="calc(100% - "+h+"px)";*/
            });
         }
       
         _initComponentExplorer(){
             var _this=this;
             this._componentExplorer.onclick(function(data){
               var ob=data.data; 
               _this._propertyEditor.value=ob;
            });
            this._componentExplorer.getComponentName=function(item){
                var varname=_this._codeEditor.getVariableFromObject(item);
                if(varname===undefined)
                    return;
                if(varname.startsWith("this."))
                    return varname.substring(5);
                return varname;
            };
        }
        /**
         * removes the selected component
         */
        removeComponent(){
            var todel=this._propertyEditor.value;
            var varname=this._codeEditor.getVariableFromObject(todel);
            if(varname!=="this"){
                if(todel.domWrapper._parent!==undefined){
                    todel.domWrapper._parent.remove(todel);
                }
                this._propertyEditor.removeVariableInCode(varname);
                this._propertyEditor.removeVariableInDesign(varname);
                this._updateInvisibleComponents();
            } 
            
        }
         /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position, 
         *                              if false at the end of the layout() function or at the end of the code
         */
        evalCode(toCursor=undefined){
        	this._codeEditor.evalCode(toCursor);
        	
        }
         /**
         * save the code to server
         */
        save(){
            this._codeEditor.save();

        }
        
        /**
         * undo action
         */
        undo(){
            this._codeEditor.undo();
        }
        private getComponentIDsInDesign(component:Component,collect:string[]){
        	collect.push("#"+component._id);
        	var childs=component["_components"];
        	if(childs!==undefined){
        		for(let x=0;x<childs.length;x++){
        			this.getComponentIDsInDesign(childs[x],collect);
        		}
        	}
        }
        /**
         * dialog edit mode
         * @param {boolean} enable - if true allow resizing and drag and drop 
         */
        editDialog(enable){
        	var _this=this;
            this.editMode=enable;
            var component=this._designPlaceholder._components[0];
              //switch designmode
            var comps=$(component.dom).find(".jcomponent");
            for(var c=0;c<comps.length;c++){
                
                if(comps[c]._this["extensionCalled"]!==undefined){
                    comps[c]._this["extensionCalled"]({
                        componentDesignerSetDesignMode: { enable ,componentDesigner:this}
                    });
                    //comps[c]._this["setDesignMode"](enable,this);
                }
            }
            if(component["extensionCalled"]!==undefined){
                component["extensionCalled"]({
                    componentDesignerSetDesignMode: { enable ,componentDesigner:this}
                });

            }
            //if(component["setDesignMode"]!==undefined){
            //        component["setDesignMode"](enable,this);
            //    }
            this._variables.updateCache();//variables can be added with Repeater.setDesignMode
            if(this._resizer!==undefined){
                this._resizer.uninstall();console.log("uninstall");
            }
            if(this._draganddropper!==undefined){
                this._draganddropper.uninstall();
            }
           
            if(enable===true){
            	 var _this=this;
            	 var allcomponents=this._variables.getEditableComponents(component);
            	 if(this._propertyEditor.codeEditor===undefined){
            	 	var ret=[];
            	 	
            	 	this.getComponentIDsInDesign(component,ret);
            	 	allcomponents=ret.join(",");
            	 }else
                	allcomponents=this._variables.getEditableComponents(component);
                //this._installTinyEditor();
                this._draganddropper=new DragAndDropper();
                this._resizer=new Resizer();
                this._resizer.draganddropper= this._draganddropper;
                
               console.log("onselect");
                this._resizer.onelementselected=function(elementIDs,e){
                        var ret=[];
                        for(var x=0;x<elementIDs.length;x++){
                            var ob= $("#"+elementIDs[x])[0]._this;
                            if(ob["editorselectthis"])
                                ob=ob["editorselectthis"];
                            ret.push(ob);
                        }
                        if(ret.length>0){
                        		_this._propertyEditor.value=ret[0];
                        }
                      //  _this.lastSelected=_this._codeEditor.getVariableFromObject(_this._propertyEditor.value);
                };
               
                this._resizer.onpropertychanged=function(comp,prop,value){
                	if(_this._propertyEditor.value!==comp)
                		_this._propertyEditor.value=comp;
                    _this._propertyEditor.setPropertyInCode(prop,value+"",true);
                    _this._propertyEditor.value=_this._propertyEditor.value;
                };
				this._resizer.install(component,allcomponents);
                allcomponents=this._variables.getEditableComponents(component,true);
                this._draganddropper.install(component,allcomponents); 
                this._draganddropper.onpropertychanged=function(component,top,left,oldParent,newParent,beforeComponent){
                	_this.moveComponent(component,top,left,oldParent,newParent,beforeComponent);
                }
                this._draganddropper.onpropertyadded=function(type,component,top,left,newParent,beforeComponent){
                    _this.createComponent(type,component,top,left,newParent,beforeComponent);

                }
               
                this._draganddropper.isDragEnabled=function(event,ui){
                	 if(_this._resizer===undefined)
                	 	return false;
                    return _this._resizer.componentUnderCursor!==undefined;
                }
            }else{
            	
            }
          /*  $(".hoho2").selectable({});
			$(".hoho2").selectable("disable");*/
          /*  $(".HTMLPanel").selectable({});
			$(".HTMLPanel").selectable("disable");
			$(".HTMLPanel").draggable({});
			$(".HTMLPanel").draggable("disable");*/
        }
       
        /**
    	 * move a component
    	 * @param {jassi.ui.Component} component - the component to move
    	 * @param {number} top - the top absolute position
    	 * @param {number} left - the left absolute position
    	 * @param {jassi.ui.Container} newParent - the new parent container where the component move to
    	 * @param {jassi.ui.Component} beforeComponent - insert the component before beforeComponent
    	 **/
        moveComponent(component,top,left,oldParent,newParent,beforeComponent){
        			var _this=this;
                	/*if(beforeComponent!==undefined&&beforeComponent.designDummyFor!==undefined){
                    	beforeComponent=undefined;
                    }*/
                    var oldName=_this._codeEditor.getVariableFromObject(oldParent);
                    var newName=_this._codeEditor.getVariableFromObject(newParent);
                    var compName=_this._codeEditor.getVariableFromObject(component);
                    if(top!==undefined){
                        _this._propertyEditor.setPropertyInCode("x",top+"",true);
                    }else{
                         _this._propertyEditor.removePropertyInCode("x");
                    }
                    if(left!==undefined){
                        _this._propertyEditor.setPropertyInCode("y",left+"",true);
                    }else{
                         _this._propertyEditor.removePropertyInCode("y");
                    }
                   
                    if(oldParent!==newParent||beforeComponent!==undefined||top===undefined){//top=undefined ->on relative position at the end call the block
                        //get Position
                        _this._propertyEditor.removePropertyInCode("add",compName,oldName);
                        var before;
                        if(beforeComponent!==undefined&&beforeComponent.type!=="atEnd"){//designdummy atEnd
                            var on=_this._codeEditor.getVariableFromObject(beforeComponent);
                            var par=_this._codeEditor.getVariableFromObject(beforeComponent._parent);
                            before={variablename:par,property:"add",value:on};
                        }
                        _this._propertyEditor.setPropertyInCode("add",compName,false,newName,before);

                    }
                   /* if(newParent._components.length>1){//correct dummy
	                    var dummy=	newParent._components[newParent._components.length-2];
	                    if(dummy.designDummyFor!==undefined){
	                    	//var tmp=newParent._components[newParent._components.length-1];
	                    	newParent.remove(dummy);//._components[newParent._components.length-1]=newParent._components[newParent._components.length-2];
	                    	newParent.add(dummy);//._components[newParent._components.length-1]=tmp;
	                    }
                    }*/
                    _this._variables.updateCache();
                    _this._propertyEditor.value=_this._propertyEditor.value;
                    _this._componentExplorer.value=_this._componentExplorer.value;
        }
    	/**
    	 * create a new component
    	 * @param {string} type - the type of the new component
    	 * @param {jassi.ui.Component} component - the component themself
    	 * @param {number} top - the top absolute position
    	 * @param {number} left - the left absolute position
    	 * @param {jassi.ui.Container} newParent - the new parent container where the component is placed
    	 * @param {jassi.ui.Component} beforeComponent - insert the new component before beforeComponent
    	 **/
    	createComponent(type,component,top,left,newParent,beforeComponent):Component{
       				var _this=this;
                    /*if(beforeComponent!==undefined&&beforeComponent.designDummyFor&&beforeComponent.type==="atEnd"){
                    	beforeComponent=undefined;
                    }*/
                    var file=type.replaceAll(".","/");
                     var stype = file.split("/")[file.split("/").length - 1];
                    _this._propertyEditor.addImportIfNeeded(stype,file);
                    var repeater=_this._hasRepeatingContainer(newParent);
                    var scope=undefined;
                    if(repeater!==undefined){
                    	var repeatername=_this._codeEditor.getVariableFromObject(repeater);
                    	var test=_this._propertyEditor.parser.getPropertyValue(repeatername,"createRepeatingComponent");
                    	scope={ variablename:repeatername,methodname:"createRepeatingComponent"};
                    	if(test===undefined){
							var vardatabinder=_this._propertyEditor.getNextVariableNameForType("jassi.ui.Databinder"); 
			        		_this._propertyEditor.setPropertyInCode("createRepeatingComponent","function(me:Me){\n\t\n}",true,repeatername);
                    		repeater.createRepeatingComponent(function(me){
                    			if(this._designMode!==true)
                    				return;
                    			//_this._variables.addVariable(vardatabinder,databinder);
                    			_this._variables.updateCache();
                    		});
                    		/*var db=new jassi.ui.Databinder();
                    		if(repeater.value!==undefined&&repeater.value.length>0)
                    			db.value=repeater.value[0];
                    		_this._variables.add(vardatabinder,db);
                    		_this._variables.updateCache();*/
			        	}
                    }
                    var varvalue=new (classes.getClass(type));
                    if(this._propertyEditor.codeEditor!==undefined){
	                    var varname=_this._propertyEditor.addVariableInCode(type,scope);
	                    
	                    if(varname.startsWith("me.")){
	                        var me=_this._codeEditor.getObjectFromVariable("me");
	                        me[varname.substring(3)]=varvalue;
	                    }else if(varname.startsWith("this.")){
	                        var th= _this._codeEditor.getObjectFromVariable("this");
	                        th[varname.substring(5)]=varvalue;
	                    }else
	                        _this._variables.addVariable(varname,varvalue);
	                    var newName=_this._codeEditor.getVariableFromObject(newParent);
	                    var before;
	                    if(beforeComponent!==undefined&&beforeComponent.type!=="atEnd"){//Designdummy atEnd
	                           //if(beforeComponent.type==="beforeComponent")
	                            //   beforeComponent=beforeComponent.designDummyFor;
	                            var on=_this._codeEditor.getVariableFromObject(beforeComponent);
	                            var par=_this._codeEditor.getVariableFromObject(beforeComponent._parent);
	                            before={variablename:par,property:"add",value:on};
	                    }
	                    _this._propertyEditor.setPropertyInCode("add",varname,false,newName,before,scope);
                    }
                   
                    if(beforeComponent!==undefined){
                        newParent.addBefore(varvalue,beforeComponent);
                    }else{
                        newParent.add(varvalue);
                    }
                   /* if(newParent._components.length>1){//correct dummy
	                    if(newParent._designDummy){
	                    	//var tmp=newParent._components[newParent._components.length-1];
	                    	newParent.dom.removeChild(newParent._designDummy.domWrapper)
	                    	newParent.dom.append(newParent._designDummy.domWrapper)
	                    }
                    }*/
                    _this._variables.updateCache();
                    
                    //set initial properties for the new component
                    if(component.createFromParam!==undefined){
                    	for(var key in component.createFromParam){
                    		var val=component.createFromParam[key];
                    		if(typeof val==='string')
                    			val='"'+val+'"';
                    		_this._propertyEditor.setPropertyInCode(key,val,true,varname);
                    	}
                    	$.extend(varvalue,component.createFromParam);
                    }
                     if(top!==undefined){
                        _this._propertyEditor.setPropertyInCode("x",top+"",true,varname);
                        varvalue.x=top;
                    }
                    if(left!==undefined){
                        _this._propertyEditor.setPropertyInCode("y",left+"",true,varname);
                        varvalue.y=left;
                    }
                   
                    //notify componentdescriptor 
                    var ac=varvalue.extensionCalled;
                        if(ac!==undefined){
                            varvalue.extensionCalled({componentDesignerComponentCreated:{
                                newParent:newParent
                            }});
                        }
                    
                    //include the new element
                    _this.editDialog(true);
                    _this._propertyEditor.value=varvalue;
                  	
                    _this._componentExplorer.update();
                    //var test=_this._invisibleComponents;
                    _this._updateInvisibleComponents();
					return varvalue;
       }
       /**
        * is there a parent that acts a repeating container?
        **/
       _hasRepeatingContainer(component){
       		if(component===undefined)
       			return undefined;
       		if(this._codeEditor.getVariableFromObject(component)===undefined)
       			return undefined;
       		if(component instanceof Repeater){
       			return component;
       		}
       		return this._hasRepeatingContainer(component._parent);
       }
       
        /**
         * @member {jassi.ui.Component} - the designed component
         */
        set designedComponent(component){
        	var com=component;
    		if(com["isAbsolute"]!==true && com.width==="0" && com.height==="0"){
        		component.width="calc(100% - 1px)";
        		component.height="calc(100% - 1px)";
    		}
        	if(this._codeEditor.__evalToCursorReached!==true){
                    this._codeEditor._main.show("design");
                }
            if(this._designPlaceholder._components.length>0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0],true);
            this._designPlaceholder.add(component);
          // 
            this._propertyEditor.updateParser();
            this.editDialog(true); 
            
            this._componentExplorer.value=component;
            
               $( this.dom).focus();
            
          
            this._updateInvisibleComponents();
           
           
            //var parser=new jassi.ui.PropertyEditor.Parser();
            //parser.parse(_this.value);
        }
        get designedComponent(){
            return this._designPlaceholder._components[0];
        }
        destroy(){
        	 if(this._resizer!==undefined){
                this._resizer.uninstall();
            }
            if(this._draganddropper!==undefined){
            	this._draganddropper.isDragEnabled=undefined;
                this._draganddropper.uninstall();
            }
        	this._propertyEditor.destroy();
			this._componentPalette.destroy();
            this._componentExplorer.destroy();
            this._invisibleComponents.destroy();
            super.destroy();
        }
        
    }
   export async function test(){
        
         
    };
   

