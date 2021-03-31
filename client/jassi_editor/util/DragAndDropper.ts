import jassi, { $Class } from "jassi/remote/Jassi";
import { Component } from "jassi/ui/Component";

@$Class("jassi_editor.util.DragAndDropper")
export class DragAndDropper {
    onpropertychanged;
    onpropertyadded;
    lastDropCanceled: boolean;
    allIDs: string;
    _isDragging: boolean;
    parentPanel: Component;
    draggableComponents: JQuery<Element>;
    droppableComponents: JQuery<Element>;
    constructor() {
        /** @member {function} - called when an element is resized function(component,top,left) */
        this.onpropertychanged = undefined;
        this.onpropertyadded = undefined;
        this.lastDropCanceled = false;
        this.allIDs = "";//all ids
    }
    isDragEnabled(event, ui) {
        var mouse = event.target._this.dom.style.cursor;
        if (mouse === "e-resize" || mouse === "s-resize" || mouse === "se-resize")
            return true;
        else
            return false;
    }
    isDragging() {

        return this._isDragging;
    }
    canDrop(enable) {
        $(this.allIDs).find(".jcontainer").not(".jdesigncontainer").draggable(enable ? "enable" : "disable");
    }
   /* testDropDesignDummy(target, event, ui) {
        var _this = this;
        if (target._this._designDummyPre !== undefined) {
            var dummy = target._this._designDummyPre;
            var oldParent = ui.draggable[0]._this._parent;
            var oldx = $(ui.helper).offset().left;
            var oldy = $(ui.helper).offset().top;
            if (ui.draggable[0]._this.createFromType !== undefined) {
                oldx = parseInt($(ui.helper).css('left'));
                oldy = parseInt($(ui.helper).css('top'));
            }

            var com = dummy;
            var posx = $(com.dom).offset().left;
            var posy = $(com.dom).offset().top;
            var w = $(com.dom).outerWidth();
            var h = $(com.dom).outerHeight();

            if ((oldx >= posx && oldx <= posx + w) && (oldy >= posy && oldy <= posy + h) && com !== ui.draggable[0]._this) {
                //com=com.designDummyFor;
                $(ui.draggable).css({ 'top': "", 'left': "", "position": "relative" });
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, undefined, undefined, target._this._parent, com);
                    return true;
                }
                com.designDummyFor._parent.addBefore(ui.draggable[0]._this, com);
                if (_this.onpropertychanged !== undefined) {
                    _this.onpropertychanged(ui.draggable[0]._this, undefined, undefined, oldParent, target._this._parent, com.designDummyFor);
                }
                return true;
            }
        }
        return false;
    }*/
    _drop(target, event, ui) {
        var _this = this;
        var newComponent=ui.draggable[0]._this;
        var newParent=target._this;
        var beforeComponent=target._this;
        var designDummyAtEnd;
        if(beforeComponent?.type==="atEnd"){
            designDummyAtEnd=beforeComponent;
            beforeComponent=undefined;
            newParent=newParent.designDummyFor;
        }
         if(beforeComponent?.type==="beforeComponent"){
            beforeComponent=newParent.designDummyFor;
            newParent=newParent.designDummyFor._parent;
        }
        if (target._this.isAbsolute) {
 
            var left =parseInt($(ui.helper).css('left'));
            var top = parseInt($(ui.helper).css('top'));
            if (ui.draggable[0]._this.createFromType !== undefined) {
                var offsetNewParent = $(target._this.dom).offset();
                left = -offsetNewParent.left + parseInt($(ui.helper).css('left'));
                top = -offsetNewParent.top + parseInt($(ui.helper).css('top'));
                //      ui.helper[0]._this.left=left;
                //    ui.helper[0]._this.y=top;
                if (this.onpropertyadded !== undefined)
                    this.onpropertyadded(ui.draggable[0]._this.createFromType, newComponent, left, top,newParent);
                return;
            }
            var oldParent = ui.draggable[0]._this._parent;
            var pleft =$(newParent.dom).offset().left;
            var ptop = $(newParent.dom).offset().top;
            var oleft =$(oldParent.dom).offset().left;
            var otop = $(oldParent.dom).offset().top;
            left=left+oleft-pleft;
            top=top+otop-ptop;
            //snap to 5
            if (top !== 1) {
                top = Math.round(top / 5) * 5;
            }
            if (left !== 1) {
                left = Math.round(left / 5) * 5;
            }

            
            oldParent.remove(ui.draggable[0]._this);
            $(ui.draggable).css({ 'top': top, 'left': left, position: 'absolute' });
            target._this.add(ui.draggable[0]._this);
            if (_this.onpropertychanged !== undefined) {
                _this.onpropertychanged(newComponent, left, top, oldParent, newParent);
            }
        } else {//relative layout

            var oldParent = ui.draggable[0]._this._parent;
            
           if(!$(newParent.domWrapper).hasClass("jcontainer")&&newParent._parent){
            	newParent=newParent._parent;
           }
            $(ui.draggable).css({ 'top': "", 'left': "", "position": "relative" });
           if (ui.draggable[0]._this.createFromType !== undefined) {
                if (this.onpropertyadded !== undefined)
                    this.onpropertyadded(newComponent.createFromType, ui.draggable[0]._this, undefined, undefined, newParent,beforeComponent);

            }else{
                 //newParent.add(ui.draggable[0]._this);
                 if(target._this!==newParent)
                    newParent.addBefore(ui.draggable[0]._this, target._this);
                 else
                 newParent.add(ui.draggable[0]._this);
                if (_this.onpropertychanged !== undefined) {
                    _this.onpropertychanged(newComponent, undefined, undefined, oldParent, newParent,beforeComponent);
                }
            }
            /*var t = $(ui.draggable).css('left');
            var oldx = event.clientX;//["originalEvent"].offsetX; //$(ui.helper).offset().left;
            var oldy = event.clientY;//["originalEvent"].offsetY;//$(ui.helper).offset().top;
            var called = false;

            //  $(ui.draggable).css({ 'top': "", 'left': "", "position": "relative" });



            var all = [];
            for (var x = 0;x < target._this._components.length;x++) {
                all.push(target._this._components[x]);
            }
            
            for (var x = 0;x < all.length;x++) {
                var com = all[x];
                var postest = $(com.dom).position();
                var posx = $(com.dom).offset().left;
                var posy = $(com.dom).offset().top;
                var w = $(com.dom).outerWidth();
                var h = $(com.dom).outerHeight();
                if (com.designDummyFor)
                    com = com.designDummyFor;
                if ((oldx >= posx && oldx <= posx + w) && (oldy >= posy && oldy <= posy + h) && com !== ui.draggable[0]._this) {
                    if (ui.draggable[0]._this.createFromType !== undefined) {
                        if (this.onpropertyadded !== undefined)
                            this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, undefined, undefined, target._this, com);
                        return;
                    }
                    var h = 0;
                    console.debug(com._id);
                    com._parent.addBefore(ui.draggable[0]._this, com);
                    called = true;
                    if (_this.onpropertychanged !== undefined) {
                        _this.onpropertychanged(ui.draggable[0]._this, undefined, undefined, oldParent, target._this, com);
                    }
                    break;
                }

            }
            if (!called) {//insert at the end
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, undefined, undefined, target._this);
                    return;
                }
                target._this.add(ui.draggable[0]._this);
                if (_this.onpropertychanged !== undefined) {
                    _this.onpropertychanged(ui.draggable[0]._this, undefined, undefined, oldParent, target._this);
                }
            }*/
        }
        if(designDummyAtEnd){//this Component should stand at last
            var par=designDummyAtEnd._parent;
            par.remove(designDummyAtEnd);
            par.add(designDummyAtEnd);
            par.designDummies.push(designDummyAtEnd);//bug insert dummy again
        }
    }
    _dropoldsicherung(target, event, ui) {
        var _this = this;
        var l = $(ui.helper).offset().left; 
        var t = $(ui.helper).offset().top;
        var lp = $(ui.helper[0].parentNode).offset().left;
        var tp = $(ui.helper[0].parentNode).offset().top;

        console.debug(l + ":" + t + "-->" + (l - lp) + ":" + (t - tp));
        if (target._this.isAbsolute) {
            var offsetNewParent = $(target._this.dom).offset();
            var offsetOldParent = $(ui.draggable[0]._this._parent.dom).offset();
            var x = offsetNewParent.left - offsetOldParent.left;
            var y = offsetNewParent.top - offsetOldParent.top;
            let t = $(ui.draggable).css('left');
            var to = offsetOldParent.left;
            var tn = offsetNewParent.left;
            var tl = $(ui.draggable).offset().left;
            var test = $(ui.draggable).offset();
            var top = parseInt($(ui.helper).css('top')) - y;
            var left = parseInt($(ui.helper).css('left')) - x;

            if (ui.draggable[0]._this.createFromType !== undefined) {
                left = -offsetNewParent.left + parseInt($(ui.helper).css('left'));
                top = -offsetNewParent.top + parseInt($(ui.helper).css('top'));
                ui.helper[0]._this.left = top;
                ui.helper[0]._this.y = top;
                if (this.onpropertyadded !== undefined)
                    this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, left, top, target._this);
                return;
            }
            //snap to 5
            if (top !== 1) {
                top = Math.round(top / 5) * 5;
            }
            if (left !== 1) {
                left = Math.round(left / 5) * 5;
            }
            var oldParent = ui.draggable[0]._this._parent;
            oldParent.remove(ui.draggable[0]._this);
            $(ui.draggable).css({ 'top': top, 'left': left, position: 'absolute' });
            target._this.add(ui.draggable[0]._this);
            if (_this.onpropertychanged !== undefined) {
                _this.onpropertychanged(ui.draggable[0]._this, left, top, oldParent, target._this);
            }
        } else {//relative layout

            var oldParent = ui.draggable[0]._this._parent;
            var newParent = target._this;
            if (!$(newParent.dom).hasClass("jcontainer")) {
                newParent = newParent._parent;
            }
            if (ui.draggable[0]._this.createFromType !== undefined) {
                if (this.onpropertyadded !== undefined)
                    this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, undefined, undefined, target._this);
                return;
            }
            newParent.add(ui.draggable[0]._this);
            if (_this.onpropertychanged !== undefined) {
                _this.onpropertychanged(ui.draggable[0]._this, undefined, undefined, oldParent, newParent);
            }

            /*
            
            let t = $(ui.draggable).css('left');
            var oldx = $(ui.helper).offset().left;
            var oldy = $(ui.helper).offset().top;
            var called = false;
            if (ui.draggable[0]._this.createFromType !== undefined) {
                oldx = parseInt($(ui.helper).css('left'));
                oldy = parseInt($(ui.helper).css('top'));
            }
            $(ui.draggable).css({ 'top': "", 'left': "", "position": "relative" });

			var comps=[];
			for(var xx=0;xx<target._this._components.length;x++){
				comps.push(target._this._components[x]);
			}
			
            for (var x = 0;x < comps.length;x++) {
                var com = comps[x];
                var postest = $(com.dom).position();
                var posx = $(com.dom).offset().left;
                var posy = $(com.dom).offset().top;
                var w = $(com.dom).outerWidth();
                var h = $(com.dom).outerHeight();

                if ((oldx >= posx && oldx <= posx + w) && (oldy >= posy && oldy <= posy + h) && com !== ui.draggable[0]._this) {
                    if (ui.draggable[0]._this.createFromType !== undefined) {
                        if (this.onpropertyadded !== undefined)
                            this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, undefined, undefined, target._this, com);
                        return;
                    }
                    var h = 0;
                    console.debug(com._id);
                    com._parent.addBefore(ui.draggable[0]._this, com);
                    called = true;
                    if (_this.onpropertychanged !== undefined) {
                        _this.onpropertychanged(ui.draggable[0]._this, undefined, undefined, oldParent, target._this, com);
                    }
                    break;
                }

            }
            if (!called) {//insert at the end
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(ui.draggable[0]._this.createFromType, ui.draggable[0]._this, undefined, undefined, target._this);
                    return;
                }
                target._this.add(ui.draggable[0]._this);
                if (_this.onpropertychanged !== undefined) {
                    _this.onpropertychanged(ui.draggable[0]._this, undefined, undefined, oldParent, target._this);
                }
            }*/
        }
    }
    /**
    * install the DragAndDropper
    * all child jomponents are draggable
    * all child containers are droppable
    * @param {jassi.ui.Component} parentPanel - all childs are effected
    * @param {string} all - ID's of all editable components e.g. #10,#12
    * @returns {unresolved}
    */
    install(parentPanel, all) {
        //$(this.parentPainer");
        var _this = this;
        if (parentPanel !== undefined)
            this.parentPanel = parentPanel;
        if (all !== undefined)
            this.allIDs = all;


        // this.draggableComponents = $(this.parentPanel.dom).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
        this.draggableComponents = $(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");


        this.draggableComponents.draggable({
            cancel: "false", 
            revert: "invalid",
            drag: function(event, ui) {
                
                _this.lastDropCanceled = _this.isDragEnabled(event, ui);
                setTimeout(function() {
                    _this.lastDropCanceled = false;
                }, 100);
                return !_this.lastDropCanceled;
            },
            start: function() {
                _this._isDragging = true;
            },
            stop: function() {
                _this._isDragging = false;
            },
            //appendTo: "body"
            helper: "clone",

        });

        $(this.parentPanel.dom).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('disable');
        $(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('enable');

        var _this = this;
        //all jcompoenents are proptargets                                         also jdesignummy     but no jcomponents in absolute Layout  no jcomponens that contains a jdesigndummy  absolutelayout container
        this.droppableComponents = $(this.parentPanel.dom).parent().parent().find(".jdesigndummy,.jcomponent:not(.jabsolutelayout>.jcomponent, :has(.jdesigndummy)),                      .jcontainer>.jabsolutelayout")
        console.log(this.droppableComponents.length);
        var isDropping = false;
        var dropWnd;
        var dropEvent;
        var dropUI;
        this.droppableComponents.droppable({
            greedy: true,
            hoverClass: "ui-state-highlight",
            tolerance:"pointer",
            drop: function(event, ui) {


                //function is called for every Window in z-Index - we need the last one
                if (_this.lastDropCanceled)
                    return;
                dropWnd = this;
                dropEvent = event;
                dropUI = ui;
                if (!isDropping) {
                    isDropping = true;
                    window.setTimeout(function() {
                        isDropping = false;
                        _this._drop(dropWnd, dropEvent, dropUI);
                    }, 50);
                }
            }
        });
        //this.droppableComponents.droppable("enable");
        //$(this.allIDs).eq(".jcontainer").not(".jdesigncontainer").droppable("enable");
        //$(this.allIDs).filter(".jcontainer").not(".jdesigncontainer").droppable("enable");
    }
    enableDraggable(enable: boolean) {
        //  this.onpropertychanged = undefined;
        // this.onpropertyadded = undefined;
        if (this.draggableComponents !== undefined) {
            if (!enable)
                this.draggableComponents.draggable('disable');
            else
                this.draggableComponents.draggable('enable');
        }

    }
    /**
     * uninstall the DragAndDropper
     */
    uninstall() {
        this.onpropertychanged = undefined;
        this.onpropertyadded = undefined;
        // 	$(this.allIDs).eq(".jcontainer").not(".jdesigncontainer").droppable("disable");  
        //$(this.parentPanel.dom).parent().parent().find(".jcontainer").droppable("destroy");
        // var components=$(this.allIDs);
        if (this.draggableComponents !== undefined) {

            this.draggableComponents.draggable();
            this.draggableComponents.draggable('destroy');
            delete $.ui["ddmanager"].current;//memory leak https://bugs.jqueryui.com/ticket/10667
            this.draggableComponents = undefined;
        }
        if (this.droppableComponents !== undefined) {
            this.droppableComponents.droppable();
            this.droppableComponents.droppable("destroy");
        }
    }
}
