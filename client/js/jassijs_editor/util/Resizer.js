var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Resizer = void 0;
    let Resizer = class Resizer {
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
        mouseDown(event) {
            event.data._resizeComponent(event);
            let elementID = $(this).attr('id');
            var _this = event === null || event === void 0 ? void 0 : event.data;
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
            if (_this.resizedElement === "" || _this.resizedElement === undefined) { //if also parentcontainer will be fired->ignore
                _this.resizedElement = elementID.toString();
                _this.isMouseDown = true;
            }
        }
        mouseMove(event) {
            event.data._resizeComponent(event);
        }
        ;
        mouseUp(event) {
            if (event.data !== undefined) {
                var _this = event === null || event === void 0 ? void 0 : event.data;
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
        firePropertyChange(...param) {
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
        _resizeComponent(e) {
            //window.status = event1.type;
            //check drag is activated or not
            if (this.isMouseDown) {
                // console.debug("drag");
                var curevent = e;
                //coordiantes of the event position
                var x = curevent.clientX;
                var y = curevent.clientY;
                //var element = document.getElementById(this.resizedElement);
                var element = this.componentUnderCursor;
                if (element === undefined) {
                    var cursor = this.cursorType.substring(0, this.cursorType.indexOf('-'));
                    this._changeCursor(e);
                    return;
                }
                if (this.lastSelected && this.lastSelected.length > 0 && this.lastSelected[0] !== element.id)
                    return;
                //top left positions of the div element
                var topLeftX = $(element._this.dom).offset().left; //element.offsetLeft;
                var topLeftY = $(element._this.dom).offset().top; //element.offsetTop;
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
                    element._this.height = h; //+'px';
                    this.firePropertyChange(element._this, "height", h);
                    /*if (this.onpropertychanged !== undefined) {
                            this.onpropertychanged(element._this, "height", h);
                    }*/
                }
            }
            else {
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
            var dcs = [];
            this.elements.split(",").forEach((str) => {
                let el = document.getElementById(str.substring(1));
                if (el) {
                    var classes = el.classList;
                    if (!classes.contains("designerNoResizable"))
                        dcs.push(document.getElementById(str.substring(1)));
                }
            });
            var els = $(dcs);
            for (var i = 0; i < els.length; i++) {
                var element = els[i];
                if (element === null)
                    continue;
                var noresizex = $(element).hasClass("designerNoResizableX");
                var noresizey = $(element).hasClass("designerNoResizableY");
                if ($(element).hasClass("designerNoResizable")) {
                    continue;
                }
                //code start for changing the cursor
                //var element2 = document.getElementById(elementID);
                var topLeftX = $(element).offset().left; //element.offsetLeft;
                var topLeftY = $(element).offset().top; //element.offsetTop;
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
                    if ((y > topLeftY - borderSize && y < bottomRightY + borderSize)) {
                        if (!noresizex) {
                            this.isCursorOnBorder = true;
                            this.cursorType = "e-resize";
                        }
                    }
                }
                else if ((x > topLeftX - borderSize && x < bottomRightX + borderSize)) {
                    if (!noresizey && (y >= bottomRightY - borderSize && y <= bottomRightY + borderSize)) {
                        if (!noresizey) {
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
                    }
                    else {
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
        setLassoMode(enable) {
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
                        if (new Date().getTime() - lastTime > 500) { //new selection
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
            }
            else {
                $(this.parentPanel.dom).selectable("destroy");
            }
        }
        /**
         * install the resizer
         * @param parentPanel - the parent component
         * @param elements - the search pattern for the components to resize e.q. ".jresizeable"
         */
        install(parentPanel, elements) {
            var _this = this;
            if (!$(parentPanel.dom).hasClass("designerNoResizable")) {
                $(parentPanel.domWrapper).resizable({
                    resize: function (evt) {
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
    };
    Resizer = __decorate([
        Jassi_1.$Class("jassijs_editor.util.Resizer"),
        __metadata("design:paramtypes", [])
    ], Resizer);
    exports.Resizer = Resizer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanNfZWRpdG9yL3V0aWwvUmVzaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBYSxPQUFPLEdBQXBCLE1BQWEsT0FBTztRQStCaEI7WUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1lBQzlCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7WUFDbkMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztZQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztZQUM5QixJQUFJLENBQUMsb0JBQW9CLEdBQUcsU0FBUyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO1FBRXBDLENBQUM7UUFFTyxTQUFTLENBQUMsS0FBSztZQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsSUFBSSxLQUFLLEdBQVcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksQ0FBQztZQUVoQyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7Z0JBRXZDLG1CQUFtQjtnQkFDbkIs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RUFBRTtnQkFDaEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3pELElBQUksSUFBSSxDQUFDLGlCQUFpQixLQUFLLFNBQVM7b0JBQ3BDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7WUFDOUIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQztZQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztZQUVoQzs7NkNBRWlDO1FBRXJDLENBQUM7S0FDSixDQUFBO0lBaFhZLE9BQU87UUFEbkIsY0FBTSxDQUFDLDZCQUE2QixDQUFDOztPQUN6QixPQUFPLENBZ1huQjtJQWhYWSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEcmFnQW5kRHJvcHBlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL0RyYWdBbmREcm9wcGVyXCI7XG5cbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlJlc2l6ZXJcIilcbmV4cG9ydCBjbGFzcyBSZXNpemVyIHtcbiAgICAvL3RoZSBjdXJyZW50IGN1cnNvciBlLmcuIFwiZGVmYXVsdFwiLFwicy1yZXNpemVcIiBcbiAgICBwcml2YXRlIGN1cnNvclR5cGU6IHN0cmluZztcbiAgICAvL2lzIHRoZSBjdXJzb3IgdW5kZXIgdGggYm9yZGVyIG9mIGFuIGVsZW1lbnRcbiAgICBwcml2YXRlIGlzQ3Vyc29yT25Cb3JkZXI6IGJvb2xlYW47XG4gICAgLy90aGUgZWxlbWVudCB3aGljaCBpcyBjdXJyZW50bHkgcmVzaXplZFxuICAgIHByaXZhdGUgcmVzaXplZEVsZW1lbnQ6IHN0cmluZztcbiAgICAvL2lzIHRoZSBtb3VzZWJ1dHRvbiBkb3duXG4gICAgcHJpdmF0ZSBpc01vdXNlRG93bjogYm9vbGVhbjtcbiAgICAvL2FsbCBlbGVtZW50cyB3aGljaCBjYW4gYmUgcmVzaXplZCBlLmcuIFwiIzEwMCwjMTAyXCJcbiAgICBwcml2YXRlIGVsZW1lbnRzOiBzdHJpbmc7XG4gICAgLy9hbGwgZWxlbWVudHMgd2l0aCByZWdpc3RyZWQgbW91c2Vkb3duIGhhbmRsZXJcbiAgICBwcml2YXRlIG1vdXNlZG93bkVsZW1lbnRzOiBKUXVlcnk8Tm9kZT47XG4gICAgLy9jYWxsZWQgaWYgZWxlbWVudHMgYXJlIHNlbGVjdGVkXG4gICAgcHVibGljIG9uZWxlbWVudHNlbGVjdGVkOiAoaWRzOiBzdHJpbmdbXSwgZXZlbnQ6IGFueSkgPT4gdm9pZDtcbiAgICAvL2NhbGxlZCBpZiBwcm9wZXJ0aWVzIGhhcyBjaGFuZ2VkIGUuZy4gdGhlIHdpZHRoIG9mIGEgY29tcG9uZW50XG4gICAgcHVibGljIG9ucHJvcGVydHljaGFuZ2VkOiAoY29tcG9uZW50OiBDb21wb25lbnQsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpID0+IHZvaWQ7XG4gICAgLy90aGUgcGFyZW50IGNvbXBvbmVudCBhbmQgYWxsIGNoaWxkY29tcG9uZW50cyBjYW4gYmUgcmVzaXplZFxuICAgIHByaXZhdGUgcGFyZW50UGFuZWw6IENvbXBvbmVudDtcbiAgICAvL2lkJ3Mgb2YgdGhlIGxhc3Qgc2VsZWN0ZWQgRWxlbWVudHNcbiAgICBwcml2YXRlIGxhc3RTZWxlY3RlZDogc3RyaW5nW107XG4gICAgLy90aGUgY29tcG9uZW50IHVuZGVyIHRoZSBtb3VzZSBjdXJzb3JcbiAgICBwdWJsaWMgY29tcG9uZW50VW5kZXJDdXJzb3I6IEVsZW1lbnQ7XG4gICAgLy9pcyB0aGUgbGFzc28gYWNpdmF0ZWQ/IFxuICAgIHByaXZhdGUgbGFzc29Nb2RlOiBib29sZWFuO1xuICAgIC8vdGhlIGNvbm5lY3RlZCBEcmFnQW5kRHJvcHBlclxuICAgIHB1YmxpYyBkcmFnYW5kZHJvcHBlcjogRHJhZ0FuZERyb3BwZXI7XG4gICAgLy90aGUgdG9wIGVsZW1lbnQgaW4gei1vcmRlciB3aGljaCBpcyBjbGlja2VkXG4gICAgcHJpdmF0ZSB0b3BFbGVtZW50OiBzdHJpbmc7XG4gICAgLy90aW1lciB0byBkZXRlY3QgdGhlIGNvbXBvbmVudCB3aGljaCBzaG91bGQgYmUgY2hhbmdlZFxuICAgIHByaXZhdGUgcHJvcGVydHlDaGFuZ2V0aW1lcjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5jdXJzb3JUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5pc0N1cnNvck9uQm9yZGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZXNpemVkRWxlbWVudCA9IFwiXCI7XG4gICAgICAgIHRoaXMuZWxlbWVudHMgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMub25lbGVtZW50c2VsZWN0ZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMub25wcm9wZXJ0eWNoYW5nZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMucGFyZW50UGFuZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubGFzdFNlbGVjdGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFVuZGVyQ3Vyc29yID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmxhc3NvTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRyYWdhbmRkcm9wcGVyID0gdW5kZWZpbmVkO1xuXG4gICAgfVxuICAgXG4gICAgcHJpdmF0ZSBtb3VzZURvd24oZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuZGF0YS5fcmVzaXplQ29tcG9uZW50KGV2ZW50KTtcbiAgICAgICAgbGV0IGVsZW1lbnRJRCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgdmFyIF90aGlzOlJlc2l6ZXIgPSBldmVudD8uZGF0YTtcbiAgICAgICAgXG4gICAgICAgIGlmIChfdGhpcy5vbmVsZW1lbnRzZWxlY3RlZCAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIC8vc2VsZWN0IHdpdGggY2xpY2tcbiAgICAgICAgICAgIC8vZGVsZWdhdGUgb25seSB0aGUgdG9wIHdpbmRvdyAtIHRoaXMgaXMgdGhlIGZpcnN0IGV2ZW50Pz8/P1xuICAgICAgICAgICAgaWYgKF90aGlzLnRvcEVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICgkKFwiI1wiICsgZWxlbWVudElEKS5oYXNDbGFzcyhcImRlc2lnbmVyTm9TZWxlY3RhYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMudG9wRWxlbWVudCA9IGVsZW1lbnRJRDtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLmpzZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcImpzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIF90aGlzLnRvcEVsZW1lbnQpLmFkZENsYXNzKFwianNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5sYXN0U2VsZWN0ZWQgPSBbX3RoaXMudG9wRWxlbWVudF07XG4gICAgICAgICAgICAgICAgICAgIGlmICghX3RoaXMub25lbGVtZW50c2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9uc2VsZWN0ZWQgdW5kZWZpbmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5vbmVsZW1lbnRzZWxlY3RlZChfdGhpcy5sYXN0U2VsZWN0ZWQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudG9wRWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsYXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgLy9zZWxlY3Qgd2l0aCBsYXNzb1xuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKF90aGlzLnJlc2l6ZWRFbGVtZW50ID09PSBcIlwiIHx8IF90aGlzLnJlc2l6ZWRFbGVtZW50ID09PSB1bmRlZmluZWQpIHsvL2lmIGFsc28gcGFyZW50Y29udGFpbmVyIHdpbGwgYmUgZmlyZWQtPmlnbm9yZVxuICAgICAgICAgICAgX3RoaXMucmVzaXplZEVsZW1lbnQgPSBlbGVtZW50SUQudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIF90aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIG1vdXNlTW92ZShldmVudCkge1xuICAgICAgICBldmVudC5kYXRhLl9yZXNpemVDb21wb25lbnQoZXZlbnQpO1xuICAgIH07XG4gICAgcHJpdmF0ZSBtb3VzZVVwKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBfdGhpczpSZXNpemVyID0gZXZlbnQ/LmRhdGE7XG4gICAgICAgICAgICBfdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xuICAgICAgICAgICAgX3RoaXMuaXNDdXJzb3JPbkJvcmRlciA9IGZhbHNlO1xuICAgICAgICAgICAgX3RoaXMuY3Vyc29yVHlwZSA9IFwiZGVmYXVsdFwiO1xuICAgICAgICAgICAgaWYgKF90aGlzLnJlc2l6ZWRFbGVtZW50ICE9PSBcIlwiICYmIF90aGlzLnJlc2l6ZWRFbGVtZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChfdGhpcy5yZXNpemVkRWxlbWVudCkuc3R5bGUuY3Vyc29yID0gX3RoaXMuY3Vyc29yVHlwZTtcbiAgICAgICAgICAgICAgICBfdGhpcy5yZXNpemVkRWxlbWVudCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy9ub3QgZXZlcnkgZXZlbnQgc2hvdWxkIGJlIGZpcmVkIC0gb25seSB0aGUgbGFzdCB3aXRoIGRlbGF5XG4gICAgcHJpdmF0ZSBmaXJlUHJvcGVydHlDaGFuZ2UoLi4ucGFyYW06IGFueVtdKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLnByb3BlcnR5Q2hhbmdldGltZXIpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnByb3BlcnR5Q2hhbmdldGltZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0eUNoYW5nZXRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoX3RoaXMub25wcm9wZXJ0eWNoYW5nZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIF90aGlzLm9ucHJvcGVydHljaGFuZ2VkKC4uLnBhcmFtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIHJlc2l6ZSB0aGUgY29tcG9uZW50XG4gICAgKiB0aGlzIGlzIGFuIG9ubW91c2Vtb3ZlIGV2ZW50IGNhbGxlZCBmcm9tIF9jaGFuZ2VDdXJzb3IoKVxuICAgICogQHBhcmFtIHt0eXBlfSBldmVudFxuICAgICovXG4gICAgcHJpdmF0ZSBfcmVzaXplQ29tcG9uZW50KGUpIHtcblxuICAgICAgICAvL3dpbmRvdy5zdGF0dXMgPSBldmVudDEudHlwZTtcbiAgICAgICAgLy9jaGVjayBkcmFnIGlzIGFjdGl2YXRlZCBvciBub3RcbiAgICAgICAgaWYgKHRoaXMuaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZGVidWcoXCJkcmFnXCIpO1xuICAgICAgICAgICAgdmFyIGN1cmV2ZW50ID0gZTtcbiAgICAgICAgICAgIC8vY29vcmRpYW50ZXMgb2YgdGhlIGV2ZW50IHBvc2l0aW9uXG4gICAgICAgICAgICB2YXIgeCA9IGN1cmV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgICB2YXIgeSA9IGN1cmV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgICAvL3ZhciBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5yZXNpemVkRWxlbWVudCk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+dGhpcy5jb21wb25lbnRVbmRlckN1cnNvcjtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBjdXJzb3IgPSB0aGlzLmN1cnNvclR5cGUuc3Vic3RyaW5nKDAsIHRoaXMuY3Vyc29yVHlwZS5pbmRleE9mKCctJykpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZUN1cnNvcihlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLmxhc3RTZWxlY3RlZCYmdGhpcy5sYXN0U2VsZWN0ZWQubGVuZ3RoPjAmJnRoaXMubGFzdFNlbGVjdGVkWzBdIT09ZWxlbWVudC5pZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAvL3RvcCBsZWZ0IHBvc2l0aW9ucyBvZiB0aGUgZGl2IGVsZW1lbnRcbiAgICAgICAgICAgIHZhciB0b3BMZWZ0WCA9ICQoZWxlbWVudC5fdGhpcy5kb20pLm9mZnNldCgpLmxlZnQ7Ly9lbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICB2YXIgdG9wTGVmdFkgPSAkKGVsZW1lbnQuX3RoaXMuZG9tKS5vZmZzZXQoKS50b3A7Ly9lbGVtZW50Lm9mZnNldFRvcDtcblxuICAgICAgICAgICAgLy93aWR0aCBhbmQgaGVpZ2h0IG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAgICB2YXIgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgICAgICAvL2dldCB0aGUgY3Vyc29yIHN5dGxlIFtlLHcsbixzLG5lLG53LHNlLHN3XVxuICAgICAgICAgICAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yVHlwZS5zdWJzdHJpbmcoMCwgdGhpcy5jdXJzb3JUeXBlLmluZGV4T2YoJy0nKSk7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgaWYgKGN1cnNvci5pbmRleE9mKCdlJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdmFyIHcgPSBNYXRoLm1heCh4IC0gdG9wTGVmdFgsIDgpO1xuICAgICAgICAgICAgICAgIHcgPSBNYXRoLnJvdW5kKHcgLyA1KSAqIDU7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5fdGhpcy53aWR0aCA9IHc7XG4gICAgICAgICAgICAgICAgdGhpcy5maXJlUHJvcGVydHlDaGFuZ2UoZWxlbWVudC5fdGhpcywgXCJ3aWR0aFwiLCB3KTtcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLm9ucHJvcGVydHljaGFuZ2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25wcm9wZXJ0eWNoYW5nZWQoZWxlbWVudC5fdGhpcywgXCJ3aWR0aFwiLCB3KTtcbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgICAgICAgICAvL1x0ZWxlbWVudC5zdHlsZS53aWR0aCA9IE1hdGgubWF4KHggLSB0b3BMZWZ0WCw4KSsncHgnO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3Vyc29yLmluZGV4T2YoJ3MnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB2YXIgaCA9IE1hdGgubWF4KHkgLSB0b3BMZWZ0WSwgOCk7XG4gICAgICAgICAgICAgICAgaCA9IE1hdGgucm91bmQoaCAvIDUpICogNTtcbiAgICAgICAgICAgICAgICBlbGVtZW50Ll90aGlzLmhlaWdodCA9IGg7Ly8rJ3B4JztcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVQcm9wZXJ0eUNoYW5nZShlbGVtZW50Ll90aGlzLCBcImhlaWdodFwiLCBoKTtcbiAgICAgICAgICAgICAgICAvKmlmICh0aGlzLm9ucHJvcGVydHljaGFuZ2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25wcm9wZXJ0eWNoYW5nZWQoZWxlbWVudC5fdGhpcywgXCJoZWlnaHRcIiwgaCk7XG4gICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKS5zdHlsZS5jdXJzb3IgPSBjdXJzb3JUeXBlO1xuICAgICAgICAgICAgdGhpcy5fY2hhbmdlQ3Vyc29yKGUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgKiBjaGFuZ2VzIHRoZSBjdXJzb3JcbiAgICAqIEBwYXJhbSB7dHlwZX0gZVxuICAgICovXG4gICAgX2NoYW5nZUN1cnNvcihlKSB7XG4gICAgICAgIHZhciBib3JkZXJTaXplID0gNDtcbiAgICAgICAgdGhpcy5jdXJzb3JUeXBlID0gXCJkZWZhdWx0XCI7XG4gICAgICAgICAvL3Nsb3dcbiAgICAgICAgLy92YXIgZWxzID0gJCh0aGlzLnBhcmVudFBhbmVsLmRvbSkuZmluZCh0aGlzLmVsZW1lbnRzKTtcbiAgICAgICAgdmFyIGRjcz1bXTtcbiAgICAgICAgdGhpcy5lbGVtZW50cy5zcGxpdChcIixcIikuZm9yRWFjaCgoc3RyKT0+e1xuICAgICAgICAgICAgbGV0IGVsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0ci5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgaWYoZWwpe1xuICAgICAgICAgICAgICAgIHZhciBjbGFzc2VzPWVsLmNsYXNzTGlzdDtcbiAgICAgICAgICAgICAgICBpZighY2xhc3Nlcy5jb250YWlucyhcImRlc2lnbmVyTm9SZXNpemFibGVcIikpXG4gICAgICAgICAgICAgICAgZGNzLnB1c2goZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RyLnN1YnN0cmluZygxKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICBcbiAgICAgICAgdmFyIGVscz0kKGRjcyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudDogSFRNTEVsZW1lbnQgPSA8SFRNTEVsZW1lbnQ+ZWxzW2ldO1xuICAgICAgICAgICAgaWYoZWxlbWVudD09PW51bGwpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB2YXIgbm9yZXNpemV4PSQoZWxlbWVudCkuaGFzQ2xhc3MoXCJkZXNpZ25lck5vUmVzaXphYmxlWFwiKTtcbiAgICAgICAgICAgIHZhciBub3Jlc2l6ZXk9JChlbGVtZW50KS5oYXNDbGFzcyhcImRlc2lnbmVyTm9SZXNpemFibGVZXCIpO1xuICAgICAgICAgICAgaWYgKCQoZWxlbWVudCkuaGFzQ2xhc3MoXCJkZXNpZ25lck5vUmVzaXphYmxlXCIpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvZGUgc3RhcnQgZm9yIGNoYW5naW5nIHRoZSBjdXJzb3JcbiAgICAgICAgICAgIC8vdmFyIGVsZW1lbnQyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKTtcbiAgICAgICAgICAgIHZhciB0b3BMZWZ0WCA9ICQoZWxlbWVudCkub2Zmc2V0KCkubGVmdDsvL2VsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIHZhciB0b3BMZWZ0WSA9ICQoZWxlbWVudCkub2Zmc2V0KCkudG9wOy8vZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICB2YXIgYm90dG9tUmlnaHRYID0gdG9wTGVmdFggKyBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIGJvdHRvbVJpZ2h0WSA9IHRvcExlZnRZICsgZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICB2YXIgY3VyZXZlbnQgPSBlO1xuICAgICAgICAgICAgdmFyIHggPSBjdXJldmVudC5jbGllbnRYO1xuICAgICAgICAgICAgdmFyIHkgPSBjdXJldmVudC5jbGllbnRZO1xuICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhub3Jlc2l6ZXgrXCI6XCIrbm9yZXNpemV5KTtcbiAgICAgICAgICAgIC8vd2luZG93LnN0YXR1cyA9IHRvcExlZnRYICtcIi0tXCIrdG9wTGVmdFkrXCItLVwiK2JvdHRvbVJpZ2h0WCtcIi0tXCIrYm90dG9tUmlnaHRZK1wiLS1cIit4K1wiLS1cIit5K1wiLS1cIitpc01vdXNlRG93bjtcblxuICAgICAgICAgICAgLy9jaGFuZ2UgdGhlIGN1cnNvciBzdHlsZSB3aGVuIGl0IGlzIG9uIHRoZSBib3JkZXIgb3IgZXZlbiBhdCBhIGRpc3RhbmNlIG9mIDggcGl4ZWxzIGFyb3VuZCB0aGUgYm9yZGVyXG4gICAgICAgICAgICBpZiAoeCA+PSBib3R0b21SaWdodFggLSBib3JkZXJTaXplICYmIHggPD0gYm90dG9tUmlnaHRYICsgYm9yZGVyU2l6ZSkge1xuICAgICAgICAgICAgICAgIC8qICBpZih5ID49IGJvdHRvbVJpZ2h0WS1ib3JkZXJTaXplICYmIHkgPD0gYm90dG9tUmlnaHRZK2JvcmRlclNpemUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ3Vyc29yT25Cb3JkZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnNvclR5cGUgPSBcInNlLXJlc2l6ZVwiO1xuICAgICAgICAgICAgICAgICAgfSovXG4gICAgICAgICAgICAgICAgaWYgKCggeSA+IHRvcExlZnRZIC0gYm9yZGVyU2l6ZSAmJiB5IDwgYm90dG9tUmlnaHRZICsgYm9yZGVyU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIW5vcmVzaXpleCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ3Vyc29yT25Cb3JkZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3JUeXBlID0gXCJlLXJlc2l6ZVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoKCB4ID4gdG9wTGVmdFggLSBib3JkZXJTaXplICYmIHggPCBib3R0b21SaWdodFggKyBib3JkZXJTaXplKSkge1xuICAgICAgICAgICAgICAgIGlmICghbm9yZXNpemV5JiYoeSA+PSBib3R0b21SaWdodFkgLSBib3JkZXJTaXplICYmIHkgPD0gYm90dG9tUmlnaHRZICsgYm9yZGVyU2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIW5vcmVzaXpleSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmlzQ3Vyc29yT25Cb3JkZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3JUeXBlID0gXCJzLXJlc2l6ZVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY3Vyc29yVHlwZSA9PT0gXCJlLXJlc2l6ZVwiIHx8IHRoaXMuY3Vyc29yVHlwZSA9PT0gXCJzLXJlc2l6ZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSAkKGVsZW1lbnQpLmNsb3Nlc3QoXCIuamNvbXBvbmVudFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdhbmRkcm9wcGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlzRHJhZ2dpbmcgPSB0aGlzLmRyYWdhbmRkcm9wcGVyLmlzRHJhZ2dpbmcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxhc3NvTW9kZSAmJiAhaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudFVuZGVyQ3Vyc29yID0gdGVzdFswXTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSB0aGlzLmN1cnNvclR5cGU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJzb3JUeXBlID0gXCJkZWZhdWx0XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50VW5kZXJDdXJzb3IgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuY3Vyc29yID0gdGhpcy5jdXJzb3JUeXBlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFVuZGVyQ3Vyc29yID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5jdXJzb3IgPSB0aGlzLmN1cnNvclR5cGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogZW5hYmxlIG9yIGRpc2FibGUgdGhlIGxhc3NvXG4gICAgICogd2l0aCBsYXNzbyBzb21lIGNvbXBvbmVudHMgY2FuIGJlIHNlbGVjdGVkIHdpdGggZHJhZ2dpbmdcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0TGFzc29Nb2RlKGVuYWJsZTpib29sZWFuKSB7XG4gICAgICAgIHRoaXMubGFzc29Nb2RlID0gZW5hYmxlO1xuICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9IFtdO1xuICAgICAgICB0aGlzLnJlc2l6ZWRFbGVtZW50ID0gXCJcIjtcbiAgICAgICAgdGhpcy5jdXJzb3JUeXBlID0gXCJcIjtcbiAgICAgICAgdGhpcy5pc0N1cnNvck9uQm9yZGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgdmFyIGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChlbmFibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICQodGhpcy5wYXJlbnRQYW5lbC5kb20pLnNlbGVjdGFibGUoe1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGxhc3RUaW1lID4gNTAwKSB7Ly9uZXcgc2VsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5sYXN0U2VsZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuanNlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwianNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMub25lbGVtZW50c2VsZWN0ZWQoX3RoaXMubGFzdFNlbGVjdGVkLCBldmVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMubGFzdFNlbGVjdGVkID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhID0gOTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHVpLnNlbGVjdGVkLl90aGlzICYmICQodWkuc2VsZWN0ZWQpLmhhc0NsYXNzKFwiamNvbXBvbmVudFwiKSAmJiAhJCh1aS5zZWxlY3RlZCkuaGFzQ2xhc3MoXCJkZXNpZ25lck5vU2VsZWN0YWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGlkcyA9IF90aGlzLmVsZW1lbnRzICsgXCIsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWRzLmluZGV4T2YoXCIjXCIgKyB1aS5zZWxlY3RlZC5fdGhpcy5faWQgKyBcIixcIikgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmxhc3RTZWxlY3RlZC5wdXNoKHVpLnNlbGVjdGVkLl90aGlzLl9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIiArIHVpLnNlbGVjdGVkLl90aGlzLl9pZCkuYWRkQ2xhc3MoXCJqc2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJCh0aGlzLnBhcmVudFBhbmVsLmRvbSkuc2VsZWN0YWJsZShcImRlc3Ryb3lcIik7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBpbnN0YWxsIHRoZSByZXNpemVyXG4gICAgICogQHBhcmFtIHBhcmVudFBhbmVsIC0gdGhlIHBhcmVudCBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0gZWxlbWVudHMgLSB0aGUgc2VhcmNoIHBhdHRlcm4gZm9yIHRoZSBjb21wb25lbnRzIHRvIHJlc2l6ZSBlLnEuIFwiLmpyZXNpemVhYmxlXCJcbiAgICAgKi9cbiAgICBpbnN0YWxsKHBhcmVudFBhbmVsOkNvbXBvbmVudCwgZWxlbWVudHM6c3RyaW5nKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghJChwYXJlbnRQYW5lbC5kb20pLmhhc0NsYXNzKFwiZGVzaWduZXJOb1Jlc2l6YWJsZVwiKSkge1xuICAgICAgICAgICAgJChwYXJlbnRQYW5lbC5kb21XcmFwcGVyKS5yZXNpemFibGUoe1xuICAgICAgICAgICAgICAgIHJlc2l6ZTogZnVuY3Rpb24gKGV2dDogYW55KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoID0gZXZ0LnRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3ID0gZXZ0LnRhcmdldC5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLm9ucHJvcGVydHljaGFuZ2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2dC50YXJnZXQuX3RoaXMud2lkdGggPSB3O1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZ0LnRhcmdldC5fdGhpcy5oZWlnaHQgPSBoO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMub25wcm9wZXJ0eWNoYW5nZWQoZXZ0LnRhcmdldC5fdGhpcywgXCJ3aWR0aFwiLCB3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLm9ucHJvcGVydHljaGFuZ2VkKGV2dC50YXJnZXQuX3RoaXMsIFwiaGVpZ2h0XCIsIGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChldnQudGFyZ2V0Ll90aGlzLmRvbVdyYXBwZXIpLmNzcyhcIndpZHRoXCIsIHcgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChldnQudGFyZ2V0Ll90aGlzLmRvbVdyYXBwZXIpLmNzcyhcImhlaWdodFwiLCBoICsgXCJweFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnRQYW5lbCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5wYXJlbnRQYW5lbCA9IHBhcmVudFBhbmVsO1xuICAgICAgICBpZiAoZWxlbWVudHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHMgPSBlbGVtZW50cztcbiAgICAgICAgJCh0aGlzLnBhcmVudFBhbmVsLmRvbSkub24oXCJtb3VzZWRvd25cIiwgdGhpcywgdGhpcy5tb3VzZURvd24pO1xuICAgICAgICB0aGlzLm1vdXNlZG93bkVsZW1lbnRzID0gJCh0aGlzLnBhcmVudFBhbmVsLmRvbSkuZmluZCh0aGlzLmVsZW1lbnRzKTtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLm1vdXNlZG93bkVsZW1lbnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlZG93bkVsZW1lbnRzW3hdID0gdGhpcy5tb3VzZWRvd25FbGVtZW50c1t4XS5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubW91c2Vkb3duRWxlbWVudHMub24oXCJtb3VzZWRvd25cIiwgdGhpcywgdGhpcy5tb3VzZURvd24pO1xuICAgICAgICAkKHRoaXMucGFyZW50UGFuZWwuZG9tKS5vbihcIm1vdXNlbW92ZVwiLCB0aGlzLCB0aGlzLm1vdXNlTW92ZSk7XG4gICAgICAgICQodGhpcy5wYXJlbnRQYW5lbC5kb20pLm9uKFwibW91c2V1cFwiLCB0aGlzLCB0aGlzLm1vdXNlVXApO1xuXG4gICAgICAgIC8vdGhpcy5zZXRMYXNzb01vZGUodHJ1ZSk7XG4gICAgICAgIC8vdGhpcy5zZXRMYXNzb01vZGUoZmFsc2UpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdW5pbnN0YWxsIHRoZSByZXNpemVyXG4gICAgICovXG4gICAgdW5pbnN0YWxsKCkge1xuICAgICAgICB0aGlzLm9uZWxlbWVudHNlbGVjdGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLm9ucHJvcGVydHljaGFuZ2VkID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5wYXJlbnRQYW5lbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAkKHRoaXMucGFyZW50UGFuZWwuZG9tKS5vZmYoXCJtb3VzZWRvd25cIiwgdGhpcy5tb3VzZURvd24pO1xuICAgICAgICAgICAgaWYgKHRoaXMubW91c2Vkb3duRWxlbWVudHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNlZG93bkVsZW1lbnRzLm9mZihcIm1vdXNlZG93blwiLCB0aGlzLm1vdXNlRG93bik7XG4gICAgICAgICAgICB0aGlzLm1vdXNlZG93bkVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgJCh0aGlzLnBhcmVudFBhbmVsLmRvbSkub2ZmKFwibW91c2Vtb3ZlXCIsIHRoaXMubW91c2VNb3ZlKTtcbiAgICAgICAgICAgICQodGhpcy5wYXJlbnRQYW5lbC5kb20pLm9uKFwibW91c2V1cFwiLCB0aGlzLm1vdXNlVXApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzaXplZEVsZW1lbnQgPSBcIlwiO1xuICAgICAgICB0aGlzLmVsZW1lbnRzID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnBhcmVudFBhbmVsID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5jb21wb25lbnRVbmRlckN1cnNvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5kcmFnYW5kZHJvcHBlciA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvKiAgdGhpcy5tb3VzZURvd24uYm91bmQ9dW5kZWZpbmVkO1xuICAgICAgICAgIHRoaXMubW91c2VNb3ZlLmJvdW5kPXVuZGVmaW5lZDtcbiAgICAgICAgICB0aGlzLm1vdXNlVXAuYm91bmQ9dW5kZWZpbmVkOyovXG5cbiAgICB9XG59XG4iXX0=