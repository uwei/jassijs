var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "ace/ace", "jassijs/remote/Registry", "jassijs_editor/CodePanel", "ace/ext/language_tools"], function (require, exports, ace, Registry_1, CodePanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.AcePanelSimple = void 0;
    /// <amd-dependency path="ace/ace" name="ace"/>
    /**
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    let AcePanelSimple = class AcePanelSimple extends CodePanel_1.CodePanel {
        constructor() {
            super();
            var _this = this;
            var test = '<div class="CodePanel" style="height: 500px; width: 500px"></div>';
            super.init(test);
            this.domWrapper.style.display = "";
            this._editor = ace.edit(this._id);
            this.file = "";
            this._editor.setOptions({
                enableBasicAutocompletion: true,
                //   maxLines:Infinity,
                useSoftTabs: false,
                autoScrollEditorIntoView: false
                //      enableMultiselect: false,
                //    enableLinking: true
            });
            // this._editor.setAutoScrollEditorIntoView(false);
            this._editor.session.setOption("useWorker", false);
            this._editor.$blockScrolling = Infinity;
            this._editor.jassi = this;
            this._addEvents();
            //editor.$blockScrolling = Infinity;
        }
        _addEvents() {
            var _this = this;
            /*     this._editor.on('change', (obj, editor) => {
                     var lineHeight = this._editor.renderer.lineHeight;
                     var editorDiv = document.getElementById(_this._id);
                     editorDiv.style.height = lineHeight * _this._editor.getSession().getDocument().getLength() + " px";
                     _this._editor.resize();
                 });*/
        }
        autocomplete() {
            console.log("not implemented");
        }
        insert(pos, text) {
            this._editor.session.insert(pos, text);
        }
        /**
         * text changes
         * @param {function} handler
         */
        onchange(handler) {
            this._editor.on('change', handler);
        }
        /**
         * component get focus
         * @param {function} handler
         */
        onfocus(handler) {
            return this._editor.on("focus", handler);
        }
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler) {
            return this._editor.on("blur", handler);
        }
        /**
         * @param - the codetext
         */
        set value(value) {
            var lastcursor = this.cursorPosition;
            this._editor.setValue(value);
            this._editor.clearSelection();
            //force ctrl+z not shows an empty document
            if (this._isInited === undefined) {
                this._isInited = true;
                this._editor.getSession().setUndoManager(new ace.UndoManager());
            }
            if (lastcursor !== undefined) {
                //this.cursorPosition = lastcursor;
            }
            var _this = this;
        }
        get value() {
            return this._editor.getValue();
        }
        /**
         * @param {object} position - the current cursor position {row= ,column=}
         */
        set cursorPosition(cursor) {
            this._editor.focus();
            this._editor.gotoLine(cursor.row, cursor.column, true);
            var r = cursor.row;
            if (r > 5)
                r = r - 5;
            var _this = this;
            //_this._editor.renderer.scrollToRow(r);
            // _this._editor.renderer.scrollCursorIntoView({ row: cursor.row, column: cursor.column  }, 0.5);
        }
        get cursorPosition() {
            var ret = this._editor.getCursorPosition();
            ret.row++;
            ret.column++;
            return ret;
        }
        /**
         * returns a single line
         * @param {number} line - the line number
         */
        getLine(line) {
            return this._editor.getSession().getLine(line);
        }
        /**
         * @member {string} - the language of the editor e.g. "ace/mode/javascript"
         */
        set mode(mode) {
            //  alert(mode);
            this._mode = mode;
            this._editor.getSession().setMode("ace/mode/" + mode);
        }
        get mode() {
            return this._mode;
        }
        destroy() {
            this._editor.destroy();
            super.destroy();
        }
        /**
        * undo action
        */
        undo() {
            this._editor.undo();
        }
        /**
         * resize the editor
         * */
        resize() {
            this._editor.resize();
        }
    };
    AcePanelSimple = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.AcePanelSimple"),
        __metadata("design:paramtypes", [])
    ], AcePanelSimple);
    exports.AcePanelSimple = AcePanelSimple;
    async function test() {
        var dlg = new AcePanelSimple();
        dlg.value = "var h;\r\nvar k;\r\nvar k;\r\nvar k;\r\nconsole.debug('ddd');";
        dlg.mode = "typescript";
        dlg.height = 100;
        //dlg._editor.renderer.setShowGutter(false);		
        //dlg._editor.getSession().addGutterDecoration(1,"error_line");
        //  dlg._editor.getSession().setBreakpoint(1);
        // dlg._editor.getSession().setBreakpoint(2);
        var h = dlg.getBreakpoints();
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=AcePanelSimple.js.map