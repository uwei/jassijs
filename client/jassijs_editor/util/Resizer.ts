import { $Class } from "jassijs/remote/Registry";
import { Component } from "jassijs/ui/Component";
import { DragAndDropper } from "jassijs_editor/util/DragAndDropper";

@$Class("jassijs_editor.util.Resizer")
export class Resizer {
    //the current cursor e.g. "default","s-resize" 
    private cursorType: string;
    //is the cursor under th border of an element
    private isCursorOnBorder: boolean;
    //the element which is currently resized
    private resizedElement: string;
    //is the mousebutton down
    private isMouseDown: boolean;
    //all elements which can be resized e.g. "#100,#102"
    private elements: string;
    //all elements with registred mousedown handler
    private mousedownElements: JQuery<Node>;
    //called if elements are selected
    public onelementselected: (ids: string[], event: any) => void;
    //called if properties has changed e.g. the width of a component
    public onpropertychanged: (component: Component, property: string, value: any) => void;
    //the parent component and all childcomponents can be resized
    private parentPanel: Component;
    //id's of the last selected Elements
    private lastSelected: string[];
    //the component under the mouse cursor
    public componentUnderCursor: Element;
    //is the lasso acivated? 
    private lassoMode: boolean;
    //the connected DragAndDropper
    public draganddropper: DragAndDropper;
    //the top element in z-order which is clicked
    private topElement: string;
    //timer to detect the component which should be changed
    private propertyChangetimer;
    constructor() {
        this.cursorType = "";
        this.isCursorOnBorder = false;
        this.isMouseDown = false;
        this.resizedElement = "";
        this.elements = undefined;
        this.onelementselected = undefined;
        this.onpropertychanged = undefined;
        this.parentPanel = undefined;
        this.lastSelected = undefined;
        this.componentUnderCursor = undefined;
        this.lassoMode = false;
        this.draganddropper = undefined;

    }
   
    private mouseDown(event) {
        event.data._resizeComponent(event);
        let elementID = $(this).attr('id');
        var _this:Resizer = event?.data;
        
        if (_this.onelementselected !== undefined) {

            //select with click
            //delegate only the top window - this is the first event????
            if (_this.topElement === undefined) {
                if ($("#" + elementID).hasClass("designerNoSelectable")) {
                    return;
                }
                _this.topElement = elementID;

                setTimeout(function () {
                    $(".jselected").removeClass("jselected");
                    $("#" + _this.topElement).addClass("jselected");
                    _this.lastSelected = [_this.topElement];
                    if (!_this.onelementselected)
                        console.log("onselected undefined");
                    _this.onelementselected(_this.lastSelected, event);
                    _this.topElement = undefined;
                }, 50);
            }

            var lastTime = new Date().getTime();
            //select with lasso

        }
        if (_this.resizedElement === "" || _this.resizedElement === undefined) {//if also parentcontainer will be fired->ignore
            _this.resizedElement = elementID.toString();
            _this.isMouseDown = true;
        }
    }
    private mouseMove(event) {
        event.data._resizeComponent(event);
    };
    private mouseUp(event) {
        if (event.data !== undefined) {
            var _this:Resizer = event?.data;
            _this.isMouseDown = false;
            _this.isCursorOnBorder = false;
            _this.cursorType = "default";
            if (_this.resizedElement !== "" && _this.resizedElement !== undefined) {
                document.getElementById(_this.resizedElement).style.cursor = _this.cursorType;
                _this.resizedElement = "";
            }
        }
    }
    //not every event should be fired - only the last with delay
    private firePropertyChange(...param: any[]) {
        var _this = this;
        if (this.propertyChangetimer) {
            clearTimeout(this.propertyChangetimer);
        }

        this.propertyChangetimer = setTimeout(() => {
            if (_this.onpropertychanged !== undefined) {
                //@ts-ignore
                _this.onpropertychanged(...param);
            }
        }, 200);
    }

    /**
    * resize the component
    * this is an onmousemove event called from _changeCursor()
    * @param {type} event
    */
    private _resizeComponent(e) {

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
            if(this.lastSelected&&this.lastSelected.length>0&&this.lastSelected[0]!==element.id)
                return;
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
    * changes the cursor
    * @param {type} e
    */
    _changeCursor(e) {
        var borderSize = 4;
        this.cursorType = "default";
         //slow
        //var els = $(this.parentPanel.dom).find(this.elements);
        var dcs=[];
        this.elements.split(",").forEach((str)=>{
            let el=document.getElementById(str.substring(1));
            if(el){
                var classes=el.classList;
                if(!classes.contains("designerNoResizable"))
                dcs.push(document.getElementById(str.substring(1)));
            }
        });
       
        var els=$(dcs);
        for (var i = 0; i < els.length; i++) {
            var element: HTMLElement = <HTMLElement>els[i];
            if(element===null)
                continue;
            var noresizex=$(element).hasClass("designerNoResizableX");
            var noresizey=$(element).hasClass("designerNoResizableY");
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
           // console.log(noresizex+":"+noresizey);
            //window.status = topLeftX +"--"+topLeftY+"--"+bottomRightX+"--"+bottomRightY+"--"+x+"--"+y+"--"+isMouseDown;

            //change the cursor style when it is on the border or even at a distance of 8 pixels around the border
            if (x >= bottomRightX - borderSize && x <= bottomRightX + borderSize) {
                /*  if(y >= bottomRightY-borderSize && y <= bottomRightY+borderSize){
                          this.isCursorOnBorder = true;
                          this.cursorType = "se-resize";
                  }*/
                if (( y > topLeftY - borderSize && y < bottomRightY + borderSize)) {
                    if(!noresizex){
                        this.isCursorOnBorder = true;
                        this.cursorType = "e-resize";
                    }
                }
            }
            else if (( x > topLeftX - borderSize && x < bottomRightX + borderSize)) {
                if (!noresizey&&(y >= bottomRightY - borderSize && y <= bottomRightY + borderSize)) {
                    if(!noresizey){
                        this.isCursorOnBorder = true;
                        this.cursorType = "s-resize";
                    }
                }
            }
            if (this.cursorType === "e-resize" || this.cursorType === "s-resize") {
                var test = $(element).closest(".jcomponent");
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
    }
    /**
     * enable or disable the lasso
     * with lasso some components can be selected with dragging
     */
    public setLassoMode(enable:boolean) {
        this.lassoMode = enable;
        this.lastSelected = [];
        this.resizedElement = "";
        this.cursorType = "";
        this.isCursorOnBorder = false;
        this.isMouseDown = false;
        var lastTime = new Date().getTime();
        var _this = this;
        if (enable === true) {
            $(this.parentPanel.dom).selectable({
                selected: function (event, ui) {
                    if (new Date().getTime() - lastTime > 500) {//new selection
                        _this.lastSelected = [];
                        $(".jselected").removeClass("jselected");
                        setTimeout(function () {
                            _this.onelementselected(_this.lastSelected, event);
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
     * @param parentPanel - the parent component
     * @param elements - the search pattern for the components to resize e.q. ".jresizeable"
     */
    install(parentPanel:Component, elements:string) {
        var _this = this;
        if (!$(parentPanel.dom).hasClass("designerNoResizable")) {
            $(parentPanel.domWrapper).resizable({
                resize: function (evt: any) {
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
        }
        if (parentPanel !== undefined)
            this.parentPanel = parentPanel;
        if (elements !== undefined)
            this.elements = elements;
        $(this.parentPanel.dom).on("mousedown", this, this.mouseDown);
        this.mousedownElements = $(this.parentPanel.dom).find(this.elements);
        for (let x = 0; x < this.mousedownElements.length; x++) {
            this.mousedownElements[x] = this.mousedownElements[x].parentNode;
        }
        this.mousedownElements.on("mousedown", this, this.mouseDown);
        $(this.parentPanel.dom).on("mousemove", this, this.mouseMove);
        $(this.parentPanel.dom).on("mouseup", this, this.mouseUp);

        //this.setLassoMode(true);
        //this.setLassoMode(false);

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
        this.parentPanel = undefined;
        this.lastSelected = undefined;
        this.componentUnderCursor = undefined;
        this.draganddropper = undefined;

        /*  this.mouseDown.bound=undefined;
          this.mouseMove.bound=undefined;
          this.mouseUp.bound=undefined;*/

    }
}
