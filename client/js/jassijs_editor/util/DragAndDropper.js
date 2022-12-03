var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ext/jquerylib"], function (require, exports, Registry_1) {
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
                var left = parseInt(ui.helper[0].style.left);
                var top = parseInt(ui.helper[0].style.top);
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
        (0, Registry_1.$Class)("jassijs_editor.util.DragAndDropper"),
        __metadata("design:paramtypes", [])
    ], DragAndDropper);
    exports.DragAndDropper = DragAndDropper;
});
//# sourceMappingURL=DragAndDropper.js.map