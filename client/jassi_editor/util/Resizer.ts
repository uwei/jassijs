import jassi, { $Class } from "remote/jassi/base/Jassi";
import {Component} from "jassi/ui/Component";
import {DragAndDropper} from "jassi_editor/util/DragAndDropper";

@$Class("jassi_editor.util.Resizer")
export class Resizer {
    cursorType: string;
    isCursorOnBorder: boolean;
    resizedElement: string;
    isMouseDown: boolean;
    elements: string;
    toResizedElement: JQuery<HTMLElement>;
    mousedownElements: JQuery<Element>;
    onelementselected;
    onpropertychanged;
    parentPanel: Component;
    lastSelected: string[];
    componentUnderCursor: Element;
    lassoMode: boolean;
    draganddropper: DragAndDropper;
    topElement: string;
	propertyChangetimer;
    constructor() {
        this.cursorType = "";
        this.isCursorOnBorder = false;
        this.isMouseDown = false;
        this.resizedElement = "";
        this.elements = undefined;
        this.toResizedElement = undefined;
        /** @member {function} - called when and element is selected function(domid,mouseevent */
        this.onelementselected = undefined;
        /** @member {function} - called when an element is resized function(component,property,value) */
        this.onpropertychanged = undefined;
        /** @member {jassi.ui.Component} - the parent panel */
        this.parentPanel = undefined;
        this.lastSelected = undefined;
        this.componentUnderCursor = undefined;
        this.lassoMode = false;
        this.draganddropper = undefined;

        /* this.mouseDown=function(event){
                 this._activateResize($(this).attr('id'),event);
         }
         this.mouseMove=function(event){
             this._resizeDiv(event); 
         };
         this.mouseUp=function(event){
             this._deActivateResize(event);
         }*/
    }
    mouseDown(event) {
        event.data._resizeDiv(event);
        event.data._activateResize($(this).attr('id'), event);
    }
    mouseMove(event) {
        event.data._resizeDiv(event);
    };
    mouseUp(event) {
        if (event.data !== undefined)
            event.data._deActivateResize(event);
    }
	//not every event is fired there nly the last with delay
	firePropertyChange(...param:any[]){
		var _this=this;
		if(this.propertyChangetimer){
			clearTimeout(this.propertyChangetimer);
		}
			
		this.propertyChangetimer=setTimeout(()=>{
			if (_this.onpropertychanged !== undefined) {
                        _this.onpropertychanged(...param);
            }		
		},200);
	}

	/**
         * resize the component
         * this is an onmousemove event called from _changeCursor()
         * @param {type} event
         */
    _resizeDiv(e) {

        //window.status = event1.type;
        //check drag is activated or not
        if (this.isMouseDown) {
            // console.debug("drag");
            var curevent = e;
            //coordiantes of the event position
            var x = curevent.clientX;
            var y = curevent.clientY;
            //var element = document.getElementById(this.resizedElement);
            var element: HTMLElement = <HTMLElement>this.componentUnderCursor;

            if (element === undefined) {
                var cursor = this.cursorType.substring(0, this.cursorType.indexOf('-'));
                this._changeCursor(e);
                return;
            }
            //top left positions of the div element
            var topLeftX = $(element._this.dom).offset().left;//element.offsetLeft;
            var topLeftY = $(element._this.dom).offset().top;//element.offsetTop;

            //width and height of the element
            var width = element.offsetWidth;
            var height = element.offsetHeight;

            //get the cursor sytle [e,w,n,s,ne,nw,se,sw]
            var cursor = this.cursorType.substring(0, this.cursorType.indexOf('-'));
            var _this = this;
            if (cursor.indexOf('e') !== -1) {
                var w = Math.max(x - topLeftX, 8);
                w = Math.round(w / 5) * 5;
                element._this.width = w;
                this.firePropertyChange(element._this, "width", w);
                /*if (this.onpropertychanged !== undefined) {
                	    this.onpropertychanged(element._this, "width", w);
                }*/
                //	element.style.width = Math.max(x - topLeftX,8)+'px';

            }
            if (cursor.indexOf('s') !== -1) {
                var h = Math.max(y - topLeftY, 8);
                h = Math.round(h / 5) * 5;
                element._this.height = h;//+'px';
                this.firePropertyChange(element._this, "height", h);
                /*if (this.onpropertychanged !== undefined) {
                        this.onpropertychanged(element._this, "height", h);
                }*/
            }
        } else {
            //  document.getElementById(elementID).style.cursor = cursorType;
            this._changeCursor(e);
        }

    }
    /**
             * activate resizing
             * @param {string} elementID
             * @param {type} e
             */
    _activateResize(elementID: string, e) {
        var _this = this;

        if (this.onelementselected !== undefined) {

            //select with click
            //delegate only the top window - this is the first event????
            if (this.topElement === undefined) {
                if ($("#" + elementID).hasClass("designerNoSelectable")) {
                    return;
                }
                this.topElement = elementID;

                setTimeout(function() {
                    $(".jselected").removeClass("jselected");
                    $("#" + _this.topElement).addClass("jselected");
                    _this.lastSelected = [_this.topElement];
                    if(!_this.onelementselected)
                    	console.log("onselected undefined");
                    _this.onelementselected(_this.lastSelected, e);
                    _this.topElement = undefined;
                }, 50);
            }

            var lastTime = new Date().getTime();
            //select with lasso

        }
        if (this.resizedElement === "" || this.resizedElement === undefined) {//if also parentcontainer will be fired->ignore
            this.resizedElement = elementID.toString();
            this.isMouseDown = true;
        }
    }
	/**
         * switch off the resizing
         * @param {type} event
         */
    _deActivateResize(event) {
        this.isMouseDown = false;
        this.isCursorOnBorder = false;
        this.cursorType = "default";
        if (this.resizedElement !== "" && this.resizedElement !== undefined) {
            document.getElementById(this.resizedElement).style.cursor = this.cursorType;
            this.resizedElement = "";
        }

    }

	/**
         * changes the cursor and determine the toResizedElement
         * @param {type} e
         */
    _changeCursor(e) {
        var borderSize = 4;
        this.cursorType = "default";

        // var els=$(".one");//document.getElementsByClassName("one");
        var els = $(this.parentPanel.dom).find(this.elements);
        for (var i = 0;i < els.length;i++) {
            var element: HTMLElement = <HTMLElement>els[i];
            if ($(element).hasClass("designerNoResizable")) {
                continue;
            }
            //code start for changing the cursor
            //var element2 = document.getElementById(elementID);
            var topLeftX = $(element).offset().left;//element.offsetLeft;
            var topLeftY = $(element).offset().top;//element.offsetTop;
            var bottomRightX = topLeftX + element.offsetWidth;
            var bottomRightY = topLeftY + element.offsetHeight;
            var curevent = e;
            var x = curevent.clientX;
            var y = curevent.clientY;
            //window.status = topLeftX +"--"+topLeftY+"--"+bottomRightX+"--"+bottomRightY+"--"+x+"--"+y+"--"+isMouseDown;

            //change the cursor style when it is on the border or even at a distance of 8 pixels around the border
            if (x >= bottomRightX - borderSize && x <= bottomRightX + borderSize) {
                /*  if(y >= bottomRightY-borderSize && y <= bottomRightY+borderSize){
                          this.isCursorOnBorder = true;
                          this.cursorType = "se-resize";
                  }*/
                if (y > topLeftY - borderSize && y < bottomRightY + borderSize) {
                    this.isCursorOnBorder = true;
                    this.cursorType = "e-resize";
                }
            }
            else if (x > topLeftX - borderSize && x < bottomRightX + borderSize) {
                if (y >= bottomRightY - borderSize && y <= bottomRightY + borderSize) {
                    this.isCursorOnBorder = true;
                    this.cursorType = "s-resize";
                }
            }
            if (this.cursorType === "e-resize" || this.cursorType === "s-resize") {
                var test = $(element).closest(".jcomponent");
                if (test !== undefined && test.hasClass("ui-draggable")) {
                    this.toResizedElement = test;
                    // test.draggable( "disable" );
                    //  if(this.toResizedElement[0]._this!=undefined&&this.toResizedElement[0]._this.dom!=undefined)
                    //    $(this.toResizedElement[0]._this.dom).prop('disabled', true);
                }
                var isDragging = false;
                if (this.draganddropper !== undefined) {
                    element == undefined;
                    isDragging = this.draganddropper.isDragging();
                }
                if (!this.lassoMode && !isDragging) {
                    this.componentUnderCursor = test[0];
                    element.style.cursor = this.cursorType;
                } else {
                    this.cursorType = "default";
                    this.componentUnderCursor = undefined;
                    element.style.cursor = this.cursorType;
                }
                return;
            }
            this.componentUnderCursor = undefined;
            element.style.cursor = this.cursorType;
        }
        if (this.toResizedElement !== undefined) {
            //     this.toResizedElement.draggable( "enable" );
        }
    }
    setLassoMode(enable) {
        this.lassoMode = enable;
        this.lastSelected = [];
        this.resizedElement = "";
        this.cursorType = "";
        this.isCursorOnBorder = false;
        this.isMouseDown = false;

        this.toResizedElement = undefined;
        var lastTime = new Date().getTime();
        var _this = this;
        if (enable === true) {
            $(this.parentPanel.dom).selectable({
                selected: function(event, ui) {
                    if (new Date().getTime() - lastTime > 500) {//new selection
                        _this.lastSelected = [];
                        $(".jselected").removeClass("jselected");
                        setTimeout(function() {
                            _this.onelementselected(_this.lastSelected);
                            _this.lastSelected = undefined;
                        }, 50);
                    }
                    lastTime = new Date().getTime();
                    var a = 9;
                    if (ui.selected._this && $(ui.selected).hasClass("jcomponent") && !$(ui.selected).hasClass("designerNoSelectable")) {
                        var ids = _this.elements + ",";
                        if (ids.indexOf("#" + ui.selected._this._id + ",") > -1) {
                            _this.lastSelected.push(ui.selected._this._id);
                            $("#" + ui.selected._this._id).addClass("jselected");
                        }
                    }
                }
            });
        } else {

            $(this.parentPanel.dom).selectable("destroy");
        }

    }
    /**
     * install the resizer
     * @param {jassi.ui.Component} parentPanel - the parent component
     * @param {string} elements - the search pattern for the components to resize e.q. ".jresizeable"
     */
    install(parentPanel, elements) {
        var _this = this;
        $(parentPanel.domWrapper).resizable({
            resize: function(evt: any) {
                var h = evt.target.offsetHeight;
                var w = evt.target.offsetWidth;
                if (_this.onpropertychanged !== undefined) {
                    evt.target._this.width = w;
                    evt.target._this.height = h;
                    _this.onpropertychanged(evt.target._this, "width", w);
                    _this.onpropertychanged(evt.target._this, "height", h);
                    $(evt.target._this.domWrapper).css("width", w + "px");
                    $(evt.target._this.domWrapper).css("height", h + "px");
                }
            }
        });
        if (parentPanel !== undefined)
            this.parentPanel = parentPanel;
        if (elements !== undefined)
            this.elements = elements;
        $(this.parentPanel.dom).on("mousedown", this, this.mouseDown);
        this.mousedownElements = $(this.parentPanel.dom).find(this.elements);
        this.mousedownElements.on("mousedown", this, this.mouseDown);
        $(this.parentPanel.dom).on("mousemove", this, this.mouseMove);
        $(this.parentPanel.dom).on("mouseup", this, this.mouseUp);

        //this.setLassoMode(true);
        //this.setLassoMode(false);

    }
    tt(){
    	 if (this.parentPanel !== undefined) {
            $(this.parentPanel.dom).off("mousedown", this.mouseDown);
            if (this.mousedownElements !== undefined)
                this.mousedownElements.off("mousedown", this.mouseDown);
            this.mousedownElements = undefined;
            $(this.parentPanel.dom).off("mousemove", this.mouseMove);
            $(this.parentPanel.dom).on("mouseup", this.mouseUp);
        }
    }
    /**
     * uninstall the resizer
     */
    uninstall() {
        this.onelementselected = undefined;
        this.onpropertychanged = undefined;
        if (this.parentPanel !== undefined) {
            $(this.parentPanel.dom).off("mousedown", this.mouseDown);
            if (this.mousedownElements !== undefined)
                this.mousedownElements.off("mousedown", this.mouseDown);
            this.mousedownElements = undefined;
            $(this.parentPanel.dom).off("mousemove", this.mouseMove);
            $(this.parentPanel.dom).on("mouseup", this.mouseUp);
        }
        this.resizedElement = "";
        this.elements = undefined;
        this.toResizedElement = undefined;
        this.parentPanel = undefined;
        this.lastSelected = undefined;
        this.componentUnderCursor = undefined;
        this.draganddropper = undefined;

        /*  this.mouseDown.bound=undefined;
          this.mouseMove.bound=undefined;
          this.mouseUp.bound=undefined;*/

    }
}
