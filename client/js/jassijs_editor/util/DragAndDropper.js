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
    exports.DragAndDropper = void 0;
    let DragAndDropper = class DragAndDropper {
        constructor() {
            this.onpropertychanged = undefined;
            this.onpropertyadded = undefined;
            this.lastDropCanceled = false;
            this.allIDs = "";
        }
        ;
        /**
         * could be override to block dragging
         */
        isDragEnabled(event, ui) {
            var mouse = event.target._this.dom.style.cursor;
            if (mouse === "e-resize" || mouse === "s-resize" || mouse === "se-resize")
                return true;
            else
                return false;
        }
        //dragging is active
        isDragging() {
            return this._isDragging;
        }
        /*public activateDragging(enable:boolean) {
            $(this.allIDs).find(".jcontainer").not(".jdesigncontainer").draggable(enable ? "enable" : "disable");
        }*/
        enableDraggable(enable) {
            //  this.onpropertychanged = undefined;
            // this.onpropertyadded = undefined;
            try {
                if (this.draggableComponents !== undefined) {
                    if (!enable)
                        this.draggableComponents.draggable('disable');
                    else
                        this.draggableComponents.draggable('enable');
                }
            }
            catch (_a) {
                console.log("fetched error");
                ;
            }
        }
        _drop(target, event, ui) {
            var _this = this;
            var newComponent = ui.draggable[0]._this;
            var newParent = target._this;
            var beforeComponent = target._this;
            var designDummyAtEnd;
            if ((beforeComponent === null || beforeComponent === void 0 ? void 0 : beforeComponent.type) === "atEnd") {
                designDummyAtEnd = beforeComponent;
                beforeComponent = undefined;
                newParent = newParent.designDummyFor;
            }
            if ((beforeComponent === null || beforeComponent === void 0 ? void 0 : beforeComponent.type) === "beforeComponent") {
                beforeComponent = newParent.designDummyFor;
                newParent = newParent.designDummyFor._parent;
            }
            if (target._this.isAbsolute) {
                var left = parseInt($(ui.helper).css('left'));
                var top = parseInt($(ui.helper).css('top'));
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    var offsetNewParent = $(target._this.dom).offset();
                    left = -offsetNewParent.left + parseInt($(ui.helper).css('left'));
                    top = -offsetNewParent.top + parseInt($(ui.helper).css('top'));
                    //      ui.helper[0]._this.left=left;
                    //    ui.helper[0]._this.y=top;
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(ui.draggable[0]._this.createFromType, newComponent, left, top, newParent, undefined);
                    return;
                }
                var oldParent = ui.draggable[0]._this._parent;
                var pleft = $(newParent.dom).offset().left;
                var ptop = $(newParent.dom).offset().top;
                var oleft = $(oldParent.dom).offset().left;
                var otop = $(oldParent.dom).offset().top;
                left = left + oleft - pleft;
                top = top + otop - ptop;
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
                    _this.onpropertychanged(newComponent, left, top, oldParent, newParent, undefined);
                }
            }
            else { //relative layout
                var oldParent = ui.draggable[0]._this._parent;
                if (!$(newParent.domWrapper).hasClass("jcontainer") && newParent._parent) {
                    newParent = newParent._parent;
                }
                $(ui.draggable).css({ 'top': "", 'left': "", "position": "relative" });
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(newComponent.createFromType, ui.draggable[0]._this, undefined, undefined, newParent, beforeComponent);
                }
                else {
                    //newParent.add(ui.draggable[0]._this);
                    if (target._this !== newParent)
                        newParent.addBefore(ui.draggable[0]._this, target._this);
                    else
                        newParent.add(ui.draggable[0]._this);
                    if (_this.onpropertychanged !== undefined) {
                        _this.onpropertychanged(newComponent, undefined, undefined, oldParent, newParent, beforeComponent);
                    }
                }
            }
            if (designDummyAtEnd) { //this Component should stand at last
                var par = designDummyAtEnd._parent;
                par.remove(designDummyAtEnd);
                par.add(designDummyAtEnd);
                par.designDummies.push(designDummyAtEnd); //bug insert dummy again
            }
        }
        /**
        * install the DragAndDropper
        * all child jomponents are draggable
        * all child containers are droppable
        * @param  parentPanel - all childs are effected
        * @param allIDs - ID's of all editable components e.g. #10,#12
        * @returns {unresolved}
        */
        install(parentPanel, allIDs) {
            //$(this.parentPainer");
            var _this = this;
            if (parentPanel !== undefined)
                this.parentPanel = parentPanel;
            if (allIDs !== undefined)
                this.allIDs = allIDs;
            var dcs = [];
            this.allIDs.split(",").forEach((str) => {
                let el = document.getElementById(str.substring(1));
                if (el) {
                    var classes = el.classList;
                    if (classes.contains("jcomponent") && !classes.contains("jdesigncontainer") && !classes.contains("designerNoDraggable"))
                        dcs.push(document.getElementById(str.substring(1)));
                }
            });
            //slow
            // this.draggableComponents = $(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
            this.draggableComponents = $(dcs); //.find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
            this.draggableComponents.draggable({
                cancel: "false",
                revert: "invalid",
                drag: function (event, ui) {
                    _this.lastDropCanceled = _this.isDragEnabled(event, ui);
                    setTimeout(function () {
                        _this.lastDropCanceled = false;
                    }, 100);
                    return !_this.lastDropCanceled;
                },
                start: function () {
                    _this._isDragging = true;
                },
                stop: function () {
                    _this._isDragging = false;
                },
                //appendTo: "body"
                helper: "clone",
            });
            //$(this.parentPanel.dom).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('disable');
            //$(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('enable');
            this.draggableComponents.draggable('disable');
            this.draggableComponents.draggable('enable');
            var _this = this;
            //all jcompoenents are proptargets                                         also jdesignummy     but no jcomponents in absolute Layout  no jcomponens that contains a jdesigndummy  absolutelayout container
            this.droppableComponents = $(this.parentPanel.dom).parent().parent().find(".jdesigndummy,.jcomponent:not(.jabsolutelayout>.jcomponent, :has(.jdesigndummy)),                      .jcontainer>.jabsolutelayout");
            //console.log(this.droppableComponents.length);
            for (var c = 0; c < this.droppableComponents.length; c++) {
                //  console.log(this.droppableComponents[c].id);
            }
            var isDropping = false;
            var dropWnd;
            var dropEvent;
            var dropUI;
            this.droppableComponents.droppable({
                greedy: true,
                hoverClass: "ui-state-highlight",
                tolerance: "pointer",
                drop: function (event, ui) {
                    //function is called for every Window in z-Index - we need the last one
                    if (_this.lastDropCanceled)
                        return;
                    dropWnd = this;
                    dropEvent = event;
                    dropUI = ui;
                    if (!isDropping) {
                        isDropping = true;
                        window.setTimeout(function () {
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
                try {
                    this.draggableComponents.draggable('destroy');
                }
                catch (_a) {
                    console.log("unable to destroy draganddrop");
                }
                delete $.ui["ddmanager"].current; //memory leak https://bugs.jqueryui.com/ticket/10667
                this.draggableComponents = undefined;
            }
            if (this.droppableComponents !== undefined) {
                this.droppableComponents.droppable();
                this.droppableComponents.droppable("destroy");
            }
        }
    };
    DragAndDropper = __decorate([
        Jassi_1.$Class("jassijs_editor.util.DragAndDropper"),
        __metadata("design:paramtypes", [])
    ], DragAndDropper);
    exports.DragAndDropper = DragAndDropper;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRHJhZ0FuZERyb3BwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzX2VkaXRvci91dGlsL0RyYWdBbmREcm9wcGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFJQSxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO1FBaUJ2QjtZQUNJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7WUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7WUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBbEJpSixDQUFDO1FBbUJuSjs7V0FFRztRQUNJLGFBQWEsQ0FBQyxLQUFVLEVBQUUsRUFBTztZQUNwQyxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztZQUNoRCxJQUFJLEtBQUssS0FBSyxVQUFVLElBQUksS0FBSyxLQUFLLFVBQVUsSUFBSSxLQUFLLEtBQUssV0FBVztnQkFDckUsT0FBTyxJQUFJLENBQUM7O2dCQUVaLE9BQU8sS0FBSyxDQUFDO1FBQ3JCLENBQUM7UUFDRCxvQkFBb0I7UUFDYixVQUFVO1lBQ2IsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQzVCLENBQUM7UUFDRDs7V0FFRztRQUNJLGVBQWUsQ0FBQyxNQUFlO1lBQ2xDLHVDQUF1QztZQUN2QyxvQ0FBb0M7WUFFcEMsSUFBRztnQkFDQyxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7b0JBQ3hDLElBQUksQ0FBQyxNQUFNO3dCQUNQLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7O3dCQUU5QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFFB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QUFnRjtZQUNoRixvRkFBb0Y7UUFDeEYsQ0FBQztRQUVEOztXQUVHO1FBQ0gsU0FBUztZQUNMLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxTQUFTLENBQUM7WUFDbkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7WUFDakMscUZBQXFGO1lBQ3JGLHFGQUFxRjtZQUNyRixpQ0FBaUM7WUFDakMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEtBQUssU0FBUyxFQUFFO2dCQUV4QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ3JDLElBQUc7b0JBQ0gsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDN0M7Z0JBQUEsV0FBSztvQkFDRixPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUM7aUJBQ2hEO2dCQUNELE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQSxvREFBb0Q7Z0JBQ3JGLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7YUFDeEM7WUFDRCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNqRDtRQUNMLENBQUM7S0FDSixDQUFBO0lBcFFZLGNBQWM7UUFEMUIsY0FBTSxDQUFDLG9DQUFvQyxDQUFDOztPQUNoQyxjQUFjLENBb1ExQjtJQXBRWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XG5cbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLkRyYWdBbmREcm9wcGVyXCIpXG5leHBvcnQgY2xhc3MgRHJhZ0FuZERyb3BwZXIge1xuICAgIC8vY2FsbGVkIGlmIGEgcHJvcGVydHkgaGFzIGNoYW5nZWQgdGhlIHBvc2l0aW9uXG4gICAgcHVibGljIG9ucHJvcGVydHljaGFuZ2VkOiAoY29tcG9uZW50OiBDb21wb25lbnQsIHRvcDogbnVtYmVyLCBsZWZ0OiBudW1iZXIsIG9sZFBhcmVudDogQ29tcG9uZW50LCBuZXdQYXJlbnQ6IENvbXBvbmVudCwgYmVmb3JlQ29tcG9uZW50OiBDb21wb25lbnQpID0+IGFueTtcbiAgICAvL2NhbGxlZCBpZiBhIHByb3BlcnR5IGlzIGFkZGVkXG4gICAgcHVibGljIG9ucHJvcGVydHlhZGRlZDogKHR5cGVuYW1lOiBzdHJpbmcsIGNvbXBvbmVudDogQ29tcG9uZW50LCB0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyLCBuZXdwYXJlbnQ6IG51bWJlciwgYmVmb3JlY29tcG9uZW50OiBDb21wb25lbnQpID0+IGFueTs7XG4gICAgLy90aGUgbGFzdCBkcm9wIGhhcyBiZWVuIGNhbmNlbGVkXG4gICAgcHJpdmF0ZSBsYXN0RHJvcENhbmNlbGVkOiBib29sZWFuO1xuICAgIC8vYWxsIGNvbXBvbmVudCBpZCdzIHdoaWNoIHNob3VsZCBiZSBkcmFnZ2VkXG4gICAgcHJpdmF0ZSBhbGxJRHM6IHN0cmluZztcbiAgICAvL2RyYWdnaW5nIGlzIGFjdGl2ZVxuICAgIHByaXZhdGUgX2lzRHJhZ2dpbmc6IGJvb2xlYW47XG4gICAgLy9hbGwgY2hpbGQgQ29tcG9uZW50cyBjYW4gYmUgZHJhZyBhbmQgZHJvcHBlZFxuICAgIHByaXZhdGUgcGFyZW50UGFuZWw6IENvbXBvbmVudDtcbiAgICAvL2FsbCBkcmFnZ2FibGUgY29tcG9uZW50c1xuICAgIHB1YmxpYyBkcmFnZ2FibGVDb21wb25lbnRzOiBKUXVlcnk8RWxlbWVudD47XG4gICAgLy9hbGwgZHJvcHBhYmxlIENvbXBvbmVudHNcbiAgICBwcml2YXRlIGRyb3BwYWJsZUNvbXBvbmVudHM6IEpRdWVyeTxFbGVtZW50PjtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vbnByb3BlcnR5Y2hhbmdlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5vbnByb3BlcnR5YWRkZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubGFzdERyb3BDYW5jZWxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFsbElEcyA9IFwiXCI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNvdWxkIGJlIG92ZXJyaWRlIHRvIGJsb2NrIGRyYWdnaW5nIFxuICAgICAqL1xuICAgIHB1YmxpYyBpc0RyYWdFbmFibGVkKGV2ZW50OiBhbnksIHVpOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIG1vdXNlID0gZXZlbnQudGFyZ2V0Ll90aGlzLmRvbS5zdHlsZS5jdXJzb3I7XG4gICAgICAgIGlmIChtb3VzZSA9PT0gXCJlLXJlc2l6ZVwiIHx8IG1vdXNlID09PSBcInMtcmVzaXplXCIgfHwgbW91c2UgPT09IFwic2UtcmVzaXplXCIpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvL2RyYWdnaW5nIGlzIGFjdGl2ZVxuICAgIHB1YmxpYyBpc0RyYWdnaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNEcmFnZ2luZztcbiAgICB9XG4gICAgLypwdWJsaWMgYWN0aXZhdGVEcmFnZ2luZyhlbmFibGU6Ym9vbGVhbikge1xuICAgICAgICAkKHRoaXMuYWxsSURzKS5maW5kKFwiLmpjb250YWluZXJcIikubm90KFwiLmpkZXNpZ25jb250YWluZXJcIikuZHJhZ2dhYmxlKGVuYWJsZSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIik7XG4gICAgfSovXG4gICAgcHVibGljIGVuYWJsZURyYWdnYWJsZShlbmFibGU6IGJvb2xlYW4pIHtcbiAgICAgICAgLy8gIHRoaXMub25wcm9wZXJ0eWNoYW5nZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIHRoaXMub25wcm9wZXJ0eWFkZGVkID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZUNvbXBvbmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICghZW5hYmxlKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZUNvbXBvbmVudHMuZHJhZ2dhYmxlKCdkaXNhYmxlJyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZUNvbXBvbmVudHMuZHJhZ2dhYmxlKCdlbmFibGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWNhdGNoe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJmZXRjaGVkIGVycm9yXCIpOztcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHByaXZhdGUgX2Ryb3AodGFyZ2V0LCBldmVudCwgdWkpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIG5ld0NvbXBvbmVudCA9IHVpLmRyYWdnYWJsZVswXS5fdGhpcztcbiAgICAgICAgdmFyIG5ld1BhcmVudCA9IHRhcmdldC5fdGhpcztcbiAgICAgICAgdmFyIGJlZm9yZUNvbXBvbmVudCA9IHRhcmdldC5fdGhpcztcbiAgICAgICAgdmFyIGRlc2lnbkR1bW15QXRFbmQ7XG4gICAgICAgIGlmIChiZWZvcmVDb21wb25lbnQ/LnR5cGUgPT09IFwiYXRFbmRcIikge1xuICAgICAgICAgICAgZGVzaWduRHVtbXlBdEVuZCA9IGJlZm9yZUNvbXBvbmVudDtcbiAgICAgICAgICAgIGJlZm9yZUNvbXBvbmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIG5ld1BhcmVudCA9IG5ld1BhcmVudC5kZXNpZ25EdW1teUZvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYmVmb3JlQ29tcG9uZW50Py50eXBlID09PSBcImJlZm9yZUNvbXBvbmVudFwiKSB7XG4gICAgICAgICAgICBiZWZvcmVDb21wb25lbnQgPSBuZXdQYXJlbnQuZGVzaWduRHVtbXlGb3I7XG4gICAgICAgICAgICBuZXdQYXJlbnQgPSBuZXdQYXJlbnQuZGVzaWduRHVtbXlGb3IuX3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFyZ2V0Ll90aGlzLmlzQWJzb2x1dGUpIHtcblxuICAgICAgICAgICAgdmFyIGxlZnQgPSBwYXJzZUludCgkKHVpLmhlbHBlcikuY3NzKCdsZWZ0JykpO1xuICAgICAgICAgICAgdmFyIHRvcCA9IHBhcnNlSW50KCQodWkuaGVscGVyKS5jc3MoJ3RvcCcpKTtcbiAgICAgICAgICAgIGlmICh1aS5kcmFnZ2FibGVbMF0uX3RoaXMuY3JlYXRlRnJvbVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXROZXdQYXJlbnQgPSAkKHRhcmdldC5fdGhpcy5kb20pLm9mZnNldCgpO1xuICAgICAgICAgICAgICAgIGxlZnQgPSAtb2Zmc2V0TmV3UGFyZW50LmxlZnQgKyBwYXJzZUludCgkKHVpLmhlbHBlcikuY3NzKCdsZWZ0JykpO1xuICAgICAgICAgICAgICAgIHRvcCA9IC1vZmZzZXROZXdQYXJlbnQudG9wICsgcGFyc2VJbnQoJCh1aS5oZWxwZXIpLmNzcygndG9wJykpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgdWkuaGVscGVyWzBdLl90aGlzLmxlZnQ9bGVmdDtcbiAgICAgICAgICAgICAgICAvLyAgICB1aS5oZWxwZXJbMF0uX3RoaXMueT10b3A7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25wcm9wZXJ0eWFkZGVkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25wcm9wZXJ0eWFkZGVkKHVpLmRyYWdnYWJsZVswXS5fdGhpcy5jcmVhdGVGcm9tVHlwZSwgbmV3Q29tcG9uZW50LCBsZWZ0LCB0b3AsIG5ld1BhcmVudCwgdW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb2xkUGFyZW50ID0gdWkuZHJhZ2dhYmxlWzBdLl90aGlzLl9wYXJlbnQ7XG4gICAgICAgICAgICB2YXIgcGxlZnQgPSAkKG5ld1BhcmVudC5kb20pLm9mZnNldCgpLmxlZnQ7XG4gICAgICAgICAgICB2YXIgcHRvcCA9ICQobmV3UGFyZW50LmRvbSkub2Zmc2V0KCkudG9wO1xuICAgICAgICAgICAgdmFyIG9sZWZ0ID0gJChvbGRQYXJlbnQuZG9tKS5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgICAgdmFyIG90b3AgPSAkKG9sZFBhcmVudC5kb20pLm9mZnNldCgpLnRvcDtcbiAgICAgICAgICAgIGxlZnQgPSBsZWZ0ICsgb2xlZnQgLSBwbGVmdDtcbiAgICAgICAgICAgIHRvcCA9IHRvcCArIG90b3AgLSBwdG9wO1xuICAgICAgICAgICAgLy9zbmFwIHRvIDVcbiAgICAgICAgICAgIGlmICh0b3AgIT09IDEpIHtcbiAgICAgICAgICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIDUpICogNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsZWZ0ICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IE1hdGgucm91bmQobGVmdCAvIDUpICogNTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBvbGRQYXJlbnQucmVtb3ZlKHVpLmRyYWdnYWJsZVswXS5fdGhpcyk7XG4gICAgICAgICAgICAkKHVpLmRyYWdnYWJsZSkuY3NzKHsgJ3RvcCc6IHRvcCwgJ2xlZnQnOiBsZWZ0LCBwb3NpdGlvbjogJ2Fic29sdXRlJyB9KTtcbiAgICAgICAgICAgIHRhcmdldC5fdGhpcy5hZGQodWkuZHJhZ2dhYmxlWzBdLl90aGlzKTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5vbnByb3BlcnR5Y2hhbmdlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMub25wcm9wZXJ0eWNoYW5nZWQobmV3Q29tcG9uZW50LCBsZWZ0LCB0b3AsIG9sZFBhcmVudCwgbmV3UGFyZW50LCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Ugey8vcmVsYXRpdmUgbGF5b3V0XG5cbiAgICAgICAgICAgIHZhciBvbGRQYXJlbnQgPSB1aS5kcmFnZ2FibGVbMF0uX3RoaXMuX3BhcmVudDtcblxuICAgICAgICAgICAgaWYgKCEkKG5ld1BhcmVudC5kb21XcmFwcGVyKS5oYXNDbGFzcyhcImpjb250YWluZXJcIikgJiYgbmV3UGFyZW50Ll9wYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBuZXdQYXJlbnQgPSBuZXdQYXJlbnQuX3BhcmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQodWkuZHJhZ2dhYmxlKS5jc3MoeyAndG9wJzogXCJcIiwgJ2xlZnQnOiBcIlwiLCBcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIiB9KTtcbiAgICAgICAgICAgIGlmICh1aS5kcmFnZ2FibGVbMF0uX3RoaXMuY3JlYXRlRnJvbVR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9ucHJvcGVydHlhZGRlZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9ucHJvcGVydHlhZGRlZChuZXdDb21wb25lbnQuY3JlYXRlRnJvbVR5cGUsIHVpLmRyYWdnYWJsZVswXS5fdGhpcywgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL25ld1BhcmVudC5hZGQodWkuZHJhZ2dhYmxlWzBdLl90aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Ll90aGlzICE9PSBuZXdQYXJlbnQpXG4gICAgICAgICAgICAgICAgICAgIG5ld1BhcmVudC5hZGRCZWZvcmUodWkuZHJhZ2dhYmxlWzBdLl90aGlzLCB0YXJnZXQuX3RoaXMpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbmV3UGFyZW50LmFkZCh1aS5kcmFnZ2FibGVbMF0uX3RoaXMpO1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5vbnByb3BlcnR5Y2hhbmdlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm9ucHJvcGVydHljaGFuZ2VkKG5ld0NvbXBvbmVudCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIG9sZFBhcmVudCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgICAgIGlmIChkZXNpZ25EdW1teUF0RW5kKSB7Ly90aGlzIENvbXBvbmVudCBzaG91bGQgc3RhbmQgYXQgbGFzdFxuICAgICAgICAgICAgdmFyIHBhciA9IGRlc2lnbkR1bW15QXRFbmQuX3BhcmVudDtcbiAgICAgICAgICAgIHBhci5yZW1vdmUoZGVzaWduRHVtbXlBdEVuZCk7XG4gICAgICAgICAgICBwYXIuYWRkKGRlc2lnbkR1bW15QXRFbmQpO1xuICAgICAgICAgICAgcGFyLmRlc2lnbkR1bW1pZXMucHVzaChkZXNpZ25EdW1teUF0RW5kKTsvL2J1ZyBpbnNlcnQgZHVtbXkgYWdhaW5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICogaW5zdGFsbCB0aGUgRHJhZ0FuZERyb3BwZXJcbiAgICAqIGFsbCBjaGlsZCBqb21wb25lbnRzIGFyZSBkcmFnZ2FibGVcbiAgICAqIGFsbCBjaGlsZCBjb250YWluZXJzIGFyZSBkcm9wcGFibGVcbiAgICAqIEBwYXJhbSAgcGFyZW50UGFuZWwgLSBhbGwgY2hpbGRzIGFyZSBlZmZlY3RlZFxuICAgICogQHBhcmFtIGFsbElEcyAtIElEJ3Mgb2YgYWxsIGVkaXRhYmxlIGNvbXBvbmVudHMgZS5nLiAjMTAsIzEyXG4gICAgKiBAcmV0dXJucyB7dW5yZXNvbHZlZH1cbiAgICAqL1xuICAgIHB1YmxpYyBpbnN0YWxsKHBhcmVudFBhbmVsOiBDb21wb25lbnQsIGFsbElEczogc3RyaW5nKSB7XG4gICAgICAgXG4gICAgICAgIC8vJCh0aGlzLnBhcmVudFBhaW5lclwiKTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHBhcmVudFBhbmVsICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLnBhcmVudFBhbmVsID0gcGFyZW50UGFuZWw7XG4gICAgICAgIGlmIChhbGxJRHMgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuYWxsSURzID0gYWxsSURzO1xuICAgICAgICB2YXIgZGNzID0gW107XG4gICAgICAgIHRoaXMuYWxsSURzLnNwbGl0KFwiLFwiKS5mb3JFYWNoKChzdHIpID0+IHtcbiAgICAgICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0ci5zdWJzdHJpbmcoMSkpO1xuICAgICAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSBlbC5jbGFzc0xpc3Q7XG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzZXMuY29udGFpbnMoXCJqY29tcG9uZW50XCIpICYmICFjbGFzc2VzLmNvbnRhaW5zKFwiamRlc2lnbmNvbnRhaW5lclwiKSAmJiAhY2xhc3Nlcy5jb250YWlucyhcImRlc2lnbmVyTm9EcmFnZ2FibGVcIikpXG4gICAgICAgICAgICAgICAgICAgIGRjcy5wdXNoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHN0ci5zdWJzdHJpbmcoMSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vc2xvd1xuICAgICAgIC8vIHRoaXMuZHJhZ2dhYmxlQ29tcG9uZW50cyA9ICQodGhpcy5hbGxJRHMpLmZpbmQoXCIuamNvbXBvbmVudFwiKS5ub3QoXCIuamRlc2lnbmNvbnRhaW5lclwiKS5ub3QoXCIuZGVzaWduZXJOb0RyYWdnYWJsZVwiKTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVDb21wb25lbnRzID0gJChkY3MpOy8vLmZpbmQoXCIuamNvbXBvbmVudFwiKS5ub3QoXCIuamRlc2lnbmNvbnRhaW5lclwiKS5ub3QoXCIuZGVzaWduZXJOb0RyYWdnYWJsZVwiKTtcblxuXG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlQ29tcG9uZW50cy5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgY2FuY2VsOiBcImZhbHNlXCIsXG4gICAgICAgICAgICByZXZlcnQ6IFwiaW52YWxpZFwiLFxuICAgICAgICAgICAgZHJhZzogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuXG4gICAgICAgICAgICAgICAgX3RoaXMubGFzdERyb3BDYW5jZWxlZCA9IF90aGlzLmlzRHJhZ0VuYWJsZWQoZXZlbnQsIHVpKTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubGFzdERyb3BDYW5jZWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFfdGhpcy5sYXN0RHJvcENhbmNlbGVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuX2lzRHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5faXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vYXBwZW5kVG86IFwiYm9keVwiXG4gICAgICAgICAgICBoZWxwZXI6IFwiY2xvbmVcIixcblxuICAgICAgICB9KTtcblxuICAgICAgICAvLyQodGhpcy5wYXJlbnRQYW5lbC5kb20pLmZpbmQoXCIuamNvbXBvbmVudFwiKS5ub3QoXCIuamRlc2lnbmNvbnRhaW5lclwiKS5ub3QoXCIuZGVzaWduZXJOb0RyYWdnYWJsZVwiKS5kcmFnZ2FibGUoJ2Rpc2FibGUnKTtcbiAgICAgICAgLy8kKHRoaXMuYWxsSURzKS5maW5kKFwiLmpjb21wb25lbnRcIikubm90KFwiLmpkZXNpZ25jb250YWluZXJcIikubm90KFwiLmRlc2lnbmVyTm9EcmFnZ2FibGVcIikuZHJhZ2dhYmxlKCdlbmFibGUnKTtcblxuICAgICAgICB0aGlzLmRyYWdnYWJsZUNvbXBvbmVudHMuZHJhZ2dhYmxlKCdkaXNhYmxlJyk7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlQ29tcG9uZW50cy5kcmFnZ2FibGUoJ2VuYWJsZScpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vYWxsIGpjb21wb2VuZW50cyBhcmUgcHJvcHRhcmdldHMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsc28gamRlc2lnbnVtbXkgICAgIGJ1dCBubyBqY29tcG9uZW50cyBpbiBhYnNvbHV0ZSBMYXlvdXQgIG5vIGpjb21wb25lbnMgdGhhdCBjb250YWlucyBhIGpkZXNpZ25kdW1teSAgYWJzb2x1dGVsYXlvdXQgY29udGFpbmVyXG4gICAgICAgIHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50cyA9ICQodGhpcy5wYXJlbnRQYW5lbC5kb20pLnBhcmVudCgpLnBhcmVudCgpLmZpbmQoXCIuamRlc2lnbmR1bW15LC5qY29tcG9uZW50Om5vdCguamFic29sdXRlbGF5b3V0Pi5qY29tcG9uZW50LCA6aGFzKC5qZGVzaWduZHVtbXkpKSwgICAgICAgICAgICAgICAgICAgICAgLmpjb250YWluZXI+LmphYnNvbHV0ZWxheW91dFwiKVxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50cy5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50cy5sZW5ndGg7IGMrKykge1xuICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50c1tjXS5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlzRHJvcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgdmFyIGRyb3BXbmQ7XG4gICAgICAgIHZhciBkcm9wRXZlbnQ7XG4gICAgICAgIHZhciBkcm9wVUk7XG4gICAgICAgIHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50cy5kcm9wcGFibGUoe1xuICAgICAgICAgICAgZ3JlZWR5OiB0cnVlLFxuICAgICAgICAgICAgaG92ZXJDbGFzczogXCJ1aS1zdGF0ZS1oaWdobGlnaHRcIixcbiAgICAgICAgICAgIHRvbGVyYW5jZTogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBkcm9wOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XG5cblxuICAgICAgICAgICAgICAgIC8vZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBldmVyeSBXaW5kb3cgaW4gei1JbmRleCAtIHdlIG5lZWQgdGhlIGxhc3Qgb25lXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmxhc3REcm9wQ2FuY2VsZWQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBkcm9wV25kID0gdGhpcztcbiAgICAgICAgICAgICAgICBkcm9wRXZlbnQgPSBldmVudDtcbiAgICAgICAgICAgICAgICBkcm9wVUkgPSB1aTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzRHJvcHBpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaXNEcm9wcGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRHJvcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kcm9wKGRyb3BXbmQsIGRyb3BFdmVudCwgZHJvcFVJKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vdGhpcy5kcm9wcGFibGVDb21wb25lbnRzLmRyb3BwYWJsZShcImVuYWJsZVwiKTtcbiAgICAgICAgLy8kKHRoaXMuYWxsSURzKS5lcShcIi5qY29udGFpbmVyXCIpLm5vdChcIi5qZGVzaWduY29udGFpbmVyXCIpLmRyb3BwYWJsZShcImVuYWJsZVwiKTtcbiAgICAgICAgLy8kKHRoaXMuYWxsSURzKS5maWx0ZXIoXCIuamNvbnRhaW5lclwiKS5ub3QoXCIuamRlc2lnbmNvbnRhaW5lclwiKS5kcm9wcGFibGUoXCJlbmFibGVcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdW5pbnN0YWxsIHRoZSBEcmFnQW5kRHJvcHBlclxuICAgICAqL1xuICAgIHVuaW5zdGFsbCgpIHtcbiAgICAgICAgdGhpcy5vbnByb3BlcnR5Y2hhbmdlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5vbnByb3BlcnR5YWRkZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIC8vIFx0JCh0aGlzLmFsbElEcykuZXEoXCIuamNvbnRhaW5lclwiKS5ub3QoXCIuamRlc2lnbmNvbnRhaW5lclwiKS5kcm9wcGFibGUoXCJkaXNhYmxlXCIpOyAgXG4gICAgICAgIC8vJCh0aGlzLnBhcmVudFBhbmVsLmRvbSkucGFyZW50KCkucGFyZW50KCkuZmluZChcIi5qY29udGFpbmVyXCIpLmRyb3BwYWJsZShcImRlc3Ryb3lcIik7XG4gICAgICAgIC8vIHZhciBjb21wb25lbnRzPSQodGhpcy5hbGxJRHMpO1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVDb21wb25lbnRzICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVDb21wb25lbnRzLmRyYWdnYWJsZSgpO1xuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVDb21wb25lbnRzLmRyYWdnYWJsZSgnZGVzdHJveScpO1xuICAgICAgICAgICAgfWNhdGNoe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidW5hYmxlIHRvIGRlc3Ryb3kgZHJhZ2FuZGRyb3BcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgJC51aVtcImRkbWFuYWdlclwiXS5jdXJyZW50Oy8vbWVtb3J5IGxlYWsgaHR0cHM6Ly9idWdzLmpxdWVyeXVpLmNvbS90aWNrZXQvMTA2NjdcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlQ29tcG9uZW50cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5kcm9wcGFibGVDb21wb25lbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50cy5kcm9wcGFibGUoKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcHBhYmxlQ29tcG9uZW50cy5kcm9wcGFibGUoXCJkZXN0cm95XCIpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19