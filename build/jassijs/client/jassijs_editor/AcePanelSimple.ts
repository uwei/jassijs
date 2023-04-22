/// <amd-dependency path="ace/ace" name="ace"/>
declare var ace;
import 'ace/ext/language_tools';
import { $Class } from "jassijs/remote/Registry";
import { CodePanel } from "jassijs_editor/CodePanel";



/**
* wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
* @class jassijs.ui.CodePanel
*/
@$Class("jassijs.ui.AcePanelSimple")
export class AcePanelSimple extends CodePanel{
    private _mode: string;
    private _editor;
    private _isInited: boolean;
    constructor() {
        super();
        var _this = this;
        var test = '<div class="CodePanel" style="height: 500px; width: 500px"></div>';
        super.init(test);
        this.domWrapper.style.display="";
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
        this._editor.session.setOption("useWorker", false)
        this._editor.$blockScrolling = Infinity;
        this._editor.jassi = this;
        this._addEvents();
        //editor.$blockScrolling = Infinity;
    }
    private _addEvents() {
        var _this = this;
   /*     this._editor.on('change', (obj, editor) => {
            var lineHeight = this._editor.renderer.lineHeight;
            var editorDiv = document.getElementById(_this._id);
            editorDiv.style.height = lineHeight * _this._editor.getSession().getDocument().getLength() + " px";
            _this._editor.resize();
        });*/


    }
    autocomplete(){
        console.log("not implemented");
    }
	public insert(pos:number,text:string){
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
    set value(value: string) { //the Code
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
    get value(): string {
        return this._editor.getValue();
    }
    /**
     * @param {object} position - the current cursor position {row= ,column=}
     */
    set cursorPosition(cursor: { row: number, column: number }) {
        this._editor.focus();
        this._editor.gotoLine(cursor.row, cursor.column, true);
        var r = cursor.row;
        if (r > 5)
            r = r -5;
        var _this = this;
        //_this._editor.renderer.scrollToRow(r);
       // _this._editor.renderer.scrollCursorIntoView({ row: cursor.row, column: cursor.column  }, 0.5);
    }
    get cursorPosition(): { row: number, column: number } {
        var ret= this._editor.getCursorPosition();
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
}
export async function test() {

    var dlg = new AcePanelSimple();
    dlg.value = "var h;\r\nvar k;\r\nvar k;\r\nvar k;\r\nconsole.debug('ddd');";
    dlg.mode = "typescript";
    dlg.height=100;

    //dlg._editor.renderer.setShowGutter(false);		
    //dlg._editor.getSession().addGutterDecoration(1,"error_line");
    //  dlg._editor.getSession().setBreakpoint(1);
    // dlg._editor.getSession().setBreakpoint(2);
    var h = dlg.getBreakpoints();
    return dlg;
}

