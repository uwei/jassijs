/// <amd-dependency name="ace" path="ace/ace" />
declare module "jassijs_editor/AcePanel" {
    import 'ace/ext/language_tools';
    import "jassijs_editor/Debugger";
    import { CodePanel } from "jassijs_editor/CodePanel";
    import { Runlater } from "jassijs/util/Runlater";
    /**
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    export class AcePanel extends CodePanel {
        private _mode;
        private _editor;
        private _isInited;
        file: string;
        private static _tooltipdiv;
        private _lastTooltipRefresh;
        checkErrorTask: Runlater;
        constructor();
        render(): any;
        componentDidMount(): void;
        private _addEvents;
        autocomplete(): void;
        /**
         * add commands to Ace Editor
         **/
        private _addCommands;
        private _tooltiprefresh;
        /**
         * show tooltip
         */
        private _manageTooltip;
        insert(pos: number, text: string): void;
        /**
         * check if imports are neded and do so
         **/
        _doRequiredImports(pos: {
            row: number;
            column: number;
        }, name: string): void;
        /**
         * check for errors or warnings
         */
        private _checkCode;
        /**
         * text changes
         * @param {function} handler
         */
        onchange(handler: any): void;
        /**
         * initialize the Ace language Tools (only once)
         */
        private _installLangTools;
        /**
        * get the completion entrys for the Ace-Code-Editor
        * @param editor - the editor instance
        * @param session - the editor session
        * @param pos - the current code position
        * @param prefix - the word before the code position
        * @param callback - the function to transfer the completions
        */
        getCompletions(editor: any, session: any, pos: {
            row: number;
            column: number;
        }, prefix: any, callback: any): void;
        /**
        * get the documentation for a member for the Ace-Code-Editor
        * @param {object} item - the member to describe
        */
        getDocTooltip(item: any): string;
        /**
         * gets a list of all lines with breakpoint
         * @returns {Object.<number, boolean>}
         */
        getBreakpoints(): {
            [line: number]: boolean;
        };
        /**
         * component get focus
         * @param {function} handler
         */
        onfocus(handler: any): any;
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler: any): any;
        /**
         * @param - the codetext
         */
        set value(value: string);
        get value(): string;
        /**
         * @param {object} position - the current cursor position {row= ,column=}
         */
        set cursorPosition(cursor: {
            row: number;
            column: number;
        });
        get cursorPosition(): {
            row: number;
            column: number;
        };
        /**
         * returns a single line
         * @param {number} line - the line number
         */
        getLine(line: any): any;
        /**
         * @member {string} - the language of the editor e.g. "ace/mode/javascript"
         */
        set mode(mode: string);
        get mode(): string;
        destroy(): void;
        /**
        * undo action
        */
        undo(): void;
        /**
         * resize the editor
         * */
        resize(): void;
    }
    export function test(): unknown;
}
/// <amd-dependency name="ace" path="ace/ace" />
declare module "jassijs_editor/AcePanelSimple" {
    import 'ace/ext/language_tools';
    import { CodePanel } from "jassijs_editor/CodePanel";
    /**
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    export class AcePanelSimple extends CodePanel {
        private _mode;
        private _editor;
        private _isInited;
        constructor();
        render(): any;
        componentDidMount(): void;
        private _addEvents;
        autocomplete(): void;
        insert(pos: number, text: string): void;
        /**
         * text changes
         * @param {function} handler
         */
        onchange(handler: any): void;
        /**
         * component get focus
         * @param {function} handler
         */
        onfocus(handler: any): any;
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler: any): any;
        /**
         * @param - the codetext
         */
        set value(value: string);
        get value(): string;
        /**
         * @param {object} position - the current cursor position {row= ,column=}
         */
        set cursorPosition(cursor: {
            row: number;
            column: number;
        });
        get cursorPosition(): {
            row: number;
            column: number;
        };
        /**
         * returns a single line
         * @param {number} line - the line number
         */
        getLine(line: any): any;
        /**
         * @member {string} - the language of the editor e.g. "ace/mode/javascript"
         */
        set mode(mode: string);
        get mode(): string;
        destroy(): void;
        /**
        * undo action
        */
        undo(): void;
        /**
         * resize the editor
         * */
        resize(): void;
    }
    export function test(): unknown;
}
declare module "jassijs_editor/ChromeDebugger" {
    import { Debugger } from "jassijs_editor/Debugger";
    /**
     * debugging in Chrome
     */
    export class ChromeDebugger extends Debugger {
        private static mid;
        private responseList;
        allBreakPoints: {
            [file: string]: string[];
        };
        constructor();
        static showHintExtensionNotInstalled(): void;
        private onChromeMessage;
        private sendChromeMessage;
        urlToFile(url: any): any;
        saveCode(url: any, code: any): any;
        /**
         * remove all breakpoints for the file
         * @param file
         */
        removeBreakpointsForFile(file: string): any;
        /**
         * sets a breakpoint for debugging
         * @param {string} file
         * @param {number} line
         * @param {number} enable - if true then breakpoint is set if false then removed
         * @param {string} type - the type default undefined->stop debugging
         **/
        breakpointChanged(file: any, line: any, column: any, enable: any, type?: any): unknown;
        /**
        * add debugpoints in code
        * @param {[string]} lines - code
        * @param {Object.<number, boolean>} debugpoints - the debugpoints
        * @param {jassijs_editor.CodeEditor} codeEditor
        */
        addDebugpoints(lines: any, debugpoints: any, codeEditor: any): void;
        /**
         * report current variable scope
         * @param {numer} url - url of the script
         * @param {[Object.<string,object>]} variables
         */
        reportVariables(url: any, variables: any, type?: any): void;
        destroy(): void;
    }
    export function test(): void;
}
declare module "jassijs_editor/CodeEditor" {
    import { Panel } from "jassijs/ui/Panel";
    import { CodePanel } from "jassijs_editor/CodePanel";
    import { VariablePanel } from "jassijs/ui/VariablePanel";
    import { DockingContainer } from "jassijs/ui/DockingContainer";
    import { ErrorPanel } from "jassijs_editor/ErrorPanel";
    import { Button } from "jassijs/ui/Button";
    global {
        export interface KnownSettings {
            Development_DefaultEditor: "ace" | "monaco" | "aceOnBrowser";
            Development_MoanacoEditorTheme: "vs-dark" | "vs-light" | "hc-black";
        }
    }
    /**
     * Panel for editing sources
     * @class jassijs_editor.CodeEditor
     */
    export class CodeEditor extends Panel {
        _main: DockingContainer;
        _codeView: Panel;
        _codeToolbar: Panel;
        _codePanel: CodePanel;
        _errors: ErrorPanel;
        _file: string;
        variables: VariablePanel;
        _design: Panel;
        editMode: boolean;
        __evalToCursorReached: boolean;
        autoCompleteButton: Button;
        private _line;
        constructor(properties?: {
            codePanel?: CodePanel;
            hideToolbar?: boolean;
        });
        private _initCodePanel;
        private _init;
        static addFilesToCompletion(filenames: string[]): any;
        _installView(): void;
        private _save;
        /**
        * save the code to server
        */
        save(): void;
        /**
         * goto to the declariation on cursor
         */
        gotoDeclaration(): any;
        /**
         * search text in classes at the given text
         * @param {string} text - the text to search
         * @returns {jassijs_editor.CodeEditor} - the editor instance
         */
        static search(text: any): unknown;
        /**
         * manage shortcuts
         */
        registerKeys(): void;
        /**
         * extract lines from code
         * @param {string} code - the code
         * @returns {[string]} - all lines
         */
        _codeToLines(code: any): any;
        _evalToCursorReached(): void;
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addVariables(variables: any): void;
        private fillVariablesAndSetupParser;
        getDesigner(): Panel;
        /**
         * load the right editor for the returned value
         */
        private _processEvalResult;
        private hookComponents;
        private _evalCodeOnLoad;
        private saveTempFile;
        evalServerside(): unknown;
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        evalCode(toCursor?: any): any;
        /**
         * switch view
         * @member {string} view - "design" or "code"
         */
        set viewmode(view: any);
        /**
        * get all known instances for type
        * @param {type} type - the type we are interested
        * @returns {[string]}
        */
        getVariablesForType(type: any): any;
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob: any): any;
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname: any): any;
        isVariableAutogenerated(varname: any): any;
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName: string, newName: string, autogenerated: boolean): void;
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        removeVariableInDesign(varname: any): any;
        /**
         * @member {string} - the code
         */
        set value(value: any);
        get value(): any;
        setCursorPorition(position: number): void;
        /**
        * @param {object} position - the current cursor position {row= ,column=}
        */
        set cursorPosition(cursor: {
            row: number;
            column: number;
        });
        get cursorPosition(): {
            row: number;
            column: number;
        };
        /**
         * @member {string} - title of the component
         */
        get title(): any;
        /**
        * @member {string} - the url to edit
        */
        set file(value: string);
        get file(): string;
        /**
        * goes to the line number
        * @param {object} value - the line number
        */
        set line(value: number);
        get line(): number;
        /**
         * open the file
         */
        openFile(_file: any): any;
        destroy(): void;
        /**
        * undo action
        */
        undo(): void;
    }
    export function test(): any;
}
declare module "jassijs_editor/CodeEditorInvisibleComponents" {
    import { Panel } from "jassijs/ui/Panel";
    import "jassijs/ui/Image";
    export class CodeEditorInvisibleComponents extends Panel {
        codeeditor: any;
        constructor(codeeditor: any);
        render(): any;
        componentDidMount(): void;
        layout(): void;
        update(): void;
        /**
         * install the draggable
         * @param {jassijs.ui.Component} component
         */
        _makeDraggable(component: any): void;
        destroy(): void;
    }
}
declare module "jassijs_editor/CodePanel" {
    import { Panel } from "jassijs/ui/Panel";
    export abstract class CodePanel extends Panel {
        static typescript: any;
        file: string;
        resize(): void;
        undo(): void;
        abstract set mode(mode: string);
        abstract get mode(): string;
        abstract set value(value: string);
        abstract get value(): string;
        abstract autocomplete(): any;
        /**
         * breakpoint changed
         * @param {function} handler - function(line,enabled,type)
         */
        onBreakpointChanged(handler: any): void;
        /**
        * gets a list of all lines with breakpoint
        * @returns {Object.<number, boolean>}
        */
        getBreakpoints(): {
            [line: number]: boolean;
        };
        numberToPosition(pos: number): {
            row: number;
            column: number;
        };
        static numberToPosition(file: string, pos: number, code: string): {
            row: number;
            column: number;
        };
        positionToNumber(pos: {
            row: number;
            column: number;
        }): number;
        static getAutoimport(lpos: number, file: string, code: string): Promise<{
            text: string;
            pos: {
                row: number;
                column: number;
            };
        }>;
        /**
       * @param {object} position - the current cursor position {row= ,column=}
       */
        abstract set cursorPosition(cursor: {
            row: number;
            column: number;
        });
        abstract get cursorPosition(): {
            row: number;
            column: number;
        };
        /**
             * goes to the declaration under cursor
             */
        gotoDeclaration(): void;
    }
}
declare module "jassijs_editor/ComponentDesigner" {
    import { Panel } from "jassijs/ui/Panel";
    import { VariablePanel } from "jassijs/ui/VariablePanel";
    import { PropertyEditor } from "jassijs/ui/PropertyEditor";
    import { ComponentExplorer } from "jassijs_editor/ComponentExplorer";
    import { ComponentPalette } from "jassijs_editor/ComponentPalette";
    import { Resizer } from "jassijs_editor/util/Resizer";
    import { ErrorPanel } from "jassijs_editor/ErrorPanel";
    import { CodeEditorInvisibleComponents } from "jassijs_editor/CodeEditorInvisibleComponents";
    import "jassijs/ui/StateBinder";
    import { Button } from "jassijs/ui/Button";
    import { Component } from "jassijs/ui/Component";
    import { DragAndDropper } from "jassijs_editor/util/DragAndDropper";
    import { Container } from "jassijs/ui/Container";
    export class ClipboardData {
        varNamesToCopy: string[];
        children: {
            [name: string]: string[];
        };
        properties: {
            [name: string]: {
                [propname: string]: any[];
            };
        };
        types: {
            [name: string]: string;
        };
        allChilds: string[];
    }
    export class ComponentDesigner extends Panel {
        _codeEditor: any;
        editMode: boolean;
        variables: VariablePanel;
        _propertyEditor: PropertyEditor;
        _errors: ErrorPanel;
        _componentPalette: ComponentPalette;
        _componentExplorer: ComponentExplorer;
        dummy: any;
        _invisibleComponents: CodeEditorInvisibleComponents;
        _designToolbar: Panel;
        _designPlaceholder: Panel;
        _resizer: Resizer;
        _draganddropper: DragAndDropper;
        saveButton: Button;
        runButton: Button;
        lassoButton: Button;
        undoButton: Button;
        editButton: Button;
        cutButton: Button;
        inlineEditorPanel: Panel;
        copyButton: Button;
        pasteButton: Button;
        dummyHolder: HTMLSpanElement;
        lastSelectedDummy: {
            component: any;
            pre: boolean;
        };
        private _lastComponent;
        constructor(props: any);
        connectParser(parser: any): void;
        set codeEditor(value: any);
        get codeEditor(): any;
        _initDesign(): void;
        /**
       * manage shortcuts
       */
        registerKeys(): void;
        resize(): void;
        _installView(): void;
        _updateInvisibleComponents(): void;
        _initComponentExplorer(): void;
        deleteComponents(text: any): void;
        /**
         * removes the selected component
         */
        cutComponent(): any;
        private copyProperties;
        componentsToString(components: Component[]): string;
        copy(): Promise<string>;
        private pasteComponent;
        pasteComponents(text: string, parent: Container, before?: Component): any;
        paste(): any;
        /**
        * execute the current code
        * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
        *                              if false at the end of the layout() function or at the end of the code
        */
        evalCode(toCursor?: any): void;
        /**
        * save the code to server
        */
        save(): void;
        /**
         * undo action
         */
        undo(): void;
        private getComponentIDsInDesign;
        createDragAndDropper(): DragAndDropper;
        selectComponents(components: Component[]): void;
        /**
         * dialog edit mode
         * @param {boolean} enable - if true allow resizing and drag and drop
         */
        editDialog(enable: any): void;
        /**
         * move a component
         * @param {jassijs.ui.Component} component - the component to move
         * @param {number} top - the top absolute position
         * @param {number} left - the left absolute position
         * @param {jassijs.ui.Container} newParent - the new parent container where the component move to
         * @param {jassijs.ui.Component} beforeComponent - insert the component before beforeComponent
         **/
        moveComponent(component: any, top: any, left: any, oldParent: any, newParent: any, beforeComponent: any): void;
        /**
         * create a new component
         * @param {string} type - the type of the new component
         * @param {jassijs.ui.Component} component - the component themself
         * @param {number} top - the top absolute position
         * @param {number} left - the left absolute position
         * @param {jassijs.ui.Container} newParent - the new parent container where the component is placed
         * @param {jassijs.ui.Component} beforeComponent - insert the new component before beforeComponent
         **/
        createComponent(type: any, component: any, top: any, left: any, newParent: any, beforeComponent: any, doUpdate?: boolean, suggestedName?: string, refresh?: boolean): Component;
        createVariable(type: any, scope: any, varvalue: any, suggestedName?: string, refresh?: boolean): any;
        private fillVariables;
        codeHasChanged(): void;
        createPreDummy(node: HTMLElement): HTMLSpanElement;
        createPostDummy(): HTMLSpanElement;
        private insertDummies;
        select(nodeStart: Node, posStart: number, nodeEnd?: Node, posEnd?: number): any;
        /**
         * @member {jassijs.ui.Component} - the designed component
         */
        set designedComponent(component: any);
        onDesignedComponentChanged(handler: (Component: any) => void): void;
        updateDummies(): void;
        get designedComponent(): any;
        destroy(): void;
    }
    export function test(): unknown;
}
declare module "jassijs_editor/ComponentExplorer" {
    import { Panel } from "jassijs/ui/Panel";
    import { Tree } from "jassijs/ui/Tree";
    import { PropertyEditor } from "jassijs/ui/PropertyEditor";
    import { Component } from "jassijs/ui/Component";
    export class ComponentExplorer extends Panel {
        codeEditor: any;
        propertyEditor: PropertyEditor;
        tree: Tree;
        _value: any;
        /**
        * edit object properties
        */
        constructor(codeEditor: any, propertyEditor: PropertyEditor);
        /**
         * @member {jassijs.ui.Component}  - the rendered object
         */
        set value(value: any);
        get value(): any;
        /**
         * get the displayname of the item
         * must be override
         * @param {object} item
         */
        getComponentName(item: any): any;
        /**
         * get the child components
         * must be override
         * @param {object} item
         */
        getComponentChilds(item: any): {};
        getComponentChildsOld(item: any): {};
        select(component: Component): void;
        layout(): void;
        update(): void;
        onselect(handler: any): void;
        onclick(handler: any): void;
        destroy(): void;
    }
    export function test(): unknown;
}
declare module "jassijs_editor/ComponentPalette" {
    import "jassijs/ext/jquerylib";
    import { Panel } from "jassijs/ui/Panel";
    export class ComponentPalette extends Panel {
        _service: string;
        constructor();
        layout(): void;
        /**
         * @member {string} - the service where the palette-items are registred
         **/
        set service(value: string);
        get service(): string;
        /**
         * install the draggable
         * @param {jassijs.ui.Image} component
         */
        _makeDraggable(component: any): void;
        _makeDraggable2(component: any): void;
        destroy(): void;
    }
    export function test(): ComponentPalette;
}
declare module "jassijs_editor/ComponentSpy" {
    import { Panel } from "jassijs/ui/Panel";
    import { Table } from "jassijs/ui/Table";
    import { Button } from "jassijs/ui/Button";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { ErrorPanel } from "jassijs_editor/ErrorPanel";
    class Me {
        IDText?: ErrorPanel;
        boxpanel1?: BoxPanel;
        IDUpdate?: Button;
        IDClear?: Button;
        IDTable?: Table;
    }
    export class ComponentSpy extends Panel {
        ids: any;
        labelids: any;
        me: Me;
        hook: any;
        constructor();
        static dummy(): any;
        static showDialog(): any;
        layout(): void;
        update(): void;
        clear(): void;
        watch(component: any): void;
        stack(id: any): any;
        unwatch(component: any): void;
        list(): {};
        destroy(): void;
    }
    export function test(): ComponentSpy;
}
declare module "jassijs_editor/DatabaseDesigner" {
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { Button } from "jassijs/ui/Button";
    import { Select } from "jassijs/ui/Select";
    import { Table } from "jassijs/ui/Table";
    import { Panel } from "jassijs/ui/Panel";
    import { DatabaseClass, DatabaseSchema } from "jassijs_editor/util/DatabaseSchema";
    import { StateDatabinder } from "jassijs/ui/StateBinder";
    type Me = {
        table?: Table;
        select?: Select;
        databinder?: StateDatabinder;
        newclass?: Button;
        boxpanel1?: BoxPanel;
        save?: Button;
        boxpanel2?: BoxPanel;
        newfield?: Button;
        removefield?: Button;
        boxpanel3?: BoxPanel;
    };
    export class DatabaseDesigner extends Panel {
        me: Me;
        currentSchema: DatabaseSchema;
        currentClass: DatabaseClass;
        allTypes: {
            values: {};
        };
        posibleRelations: {
            values: {};
        };
        constructor(readShema?: boolean);
        static showDialog(): any;
        layout(me: Me, readShema?: boolean): void;
        saveAll(showChanges?: any): Promise<string>;
        addField(typename?: string, name?: string, nullable?: boolean, relation?: string): void;
        addClass(classname?: string): any;
        updatePossibleRelations(cell: any): void;
        updateTypes(): void;
        update(): void;
        readSchema(): any;
    }
    export function test(): unknown;
}
declare module "jassijs_editor/Debugger" {
    export class Debugger {
        destroyed: boolean;
        debugpoints: any;
        /**
         * routing of url
         * @class jassijs.base.Debugger
         */
        constructor();
        /**
         * @param {string} file - the file to save
         * @param {string} code - the code to Transform
         * @param [number] debuglines - lines which updates the variables
         * @param {Object.<int,string>}  debuglinesConditions - is the breakpoint in line conitionally [line]->condition
         **/
        debugCode(file: any, code: any, debuglines: any, debuglinesConditions: any, evalToCursorPosition: any): any;
        /**
         * remove all breakpoints for the file
         * @param file
         */
        removeBreakpointsForFile(file: string): any;
        /**
        * extract all variables in code
        * @param {string} code - the code to inspect
        */
        _extractVariables(code: any): {};
        /**
         * sets a breakpoint for debugging
         * @param {string} file
         * @param {number} line
         * @param {number} enable - if true then breakpoint is set if false then removed
         * @param {string} type - the type default undefined->stop debugging
         **/
        breakpointChanged(file: any, line: any, column: any, enable: any, type: any): void;
        /**
         * report current variable scope
         * @param {numer} id - id of the variablepanel
         * @param {[Object.<string,object>]} variables
         */
        reportVariables(id: any, variables: any): void;
        /**
        * add debugpoints in code
        * @param {[string]} lines - code
        * @param {Object.<number, boolean>} debugpoints - the debugpoints
        * @param {jassijs_editor.CodeEditor} codeEditor
        */
        addDebugpoints(lines: any, debugpoints: any, codeEditor: any): void;
        /**
         *
         * @param {string} code - full source code
         * @param {jassijs_editor.CodeEditor} codeEditor
         * @returns {string}
         */
        getCodeForBreakpoint(code: any, codeEditor: any): string;
        destroy(): void;
    }
}
declare module "jassijs_editor/ErrorPanel" {
    import { Panel } from "jassijs/ui/Panel";
    import { Button } from "jassijs/ui/Button";
    export class ErrorPanel extends Panel {
        IDClear: Button;
        _container: any;
        IDToolbar: Panel;
        IDSearch: Button;
        withControls: boolean;
        withLastErrors: boolean;
        withNewErrors: boolean;
        /**
     * shows errors
     * @class jassijs.ui.ErrorPanel
     */
        constructor(withControls?: boolean, withLastErrors?: boolean, withNewErrors?: boolean);
        static showDialog(): any;
        layout(): void;
        /**
         * search Errors in code
         **/
        search(): any;
        /**
         * adds a new error
         * @param {object} error - the error
         */
        addError(error: any): any;
        _convertURL(url: string): unknown;
        /**
         * deletes all errors
         */
        clear(): void;
        registerError(): void;
        unregisterError(): void;
        destroy(): void;
    }
    export function test2(): ErrorPanel;
}
/// <amd-dependency name="_monaco" path="vs/editor/editor.main" />
declare module "jassijs_editor/ext/monaco" {
    export {};
}
declare module "jassijs_editor/ext/monaco2" {
    export {};
}
/// <amd-dependency name="tsWorker" path="vs/language/typescript/tsWorker" />
declare module "jassijs_editor/ext/typescriptservices" {
    var ts: any;
    export default ts;
}
declare module "jassijs_editor/FileExplorer" {
    import { Tree } from "jassijs/ui/Tree";
    import { Panel } from "jassijs/ui/Panel";
    import { Textbox } from "jassijs/ui/Textbox";
    import { FileNode } from "jassijs/remote/FileNode";
    import { CSSProperties } from "jassijs/ui/CSSProperties";
    export class FileActions {
        static newFile(all: FileNode[], fileName?: string, code?: string, open?: boolean): any;
        static download(all: FileNode[]): any;
        static newFolder(all: FileNode[], filename?: string): any;
        static newModule(all: FileNode[]): any;
        static dodelete(all: FileNode[], withwarning?: boolean): any;
        private static reloadFilesystem;
        static mapLocalFolder(all: FileNode[], foldername?: any): any;
        static closeLocalFolder(all: FileNode[], foldername?: any): any;
        static rename(all: FileNode[], foldername?: any): any;
        static refresh(all: FileNode[]): any;
        static open(all: FileNode[]): any;
    }
    export class FileExplorer extends Panel {
        tree: Tree;
        _files: any;
        search: Textbox;
        static instance: FileExplorer;
        constructor();
        static show(): any;
        getStyle(node: FileNode): CSSProperties;
        refresh(): any;
        layout(): any;
    }
    export function test(): FileExplorer;
}
declare module "jassijs_editor/HtmlDesigner" {
    import { ComponentDesigner } from "jassijs_editor/ComponentDesigner";
    import { Component, HTMLComponent } from "jassijs/ui/Component";
    import { Button } from "jassijs/ui/Button";
    import { Textbox } from "jassijs/ui/Textbox";
    import "jassijs/ext/spectrum";
    export class HtmlDesigner extends ComponentDesigner {
        boldButton: Button;
        italicButton: Button;
        underlineButton: Button;
        colorIcon: Textbox;
        bgcolorIcon: Textbox;
        fontSizeButton: HTMLComponent;
        constructor();
        private onclick;
        private getParentList;
        private htmlToClipboardData;
        select(nodeStart: Node, posStart: number, nodeEnd?: Node, posEnd?: number): any;
        ondrop(ev: DragEvent): void;
        paste(): unknown;
        copy(): Promise<string>;
        updateContentEditable(component: Component): void;
        registerKeys(): void;
        private deleteNodeBetween;
        protected wrapTextNodeIfNeeded(found: Node): any;
        bold(): void;
        italic(): void;
        underline(): void;
        /**
         * if user select lastnode to firstnode
         */
        private reverseSelectionIfNeeded;
        setStyle(style: string, value?: any): Component[];
        applyStyle(comp: Component, stylename: string, value?: any): void;
        _initDesign(): void;
        private _createFontSizeIcon;
        private _createColorIcon;
        private _createBGColorIcon;
        editDialog(enable: any): void;
        createDragAndDropper(): any;
        private removeNodes;
        protected changeText(node: Node, text: string, deleteNodeIfEmpty?: boolean): Node;
        private splitText;
        cutComponent(): unknown;
        createTextComponent(text: any, par: any, before: any): Component;
        protected insertLineBreak(sel: Selection, atEndOfContainer?: Component): void;
        private keydown;
    }
    export function test(): any;
}
declare module "jassijs_editor/modul" {
    const _default: {
        css: {
            "jassijs_editor.css": string;
        };
        types: {
            "node_modules/csstype.d.ts": string;
            "node_modules/@types/react/canary.d.ts": string;
            "node_modules/@types/react/experimental.d.ts": string;
            "node_modules/@types/react/global.d.ts": string;
            "node_modules/@types/react/index.d.ts": string;
            "node_modules/@types/react/jsx-runtime.d.ts": string;
            "node_modules/@types/react/jsx-dev-runtime.d.ts": string;
            "node_modules/monaco.d.ts": string;
            "node_modules/@types/typescript.d.ts": string;
        };
        require: {
            map: {
                "*": {
                    typescript: string;
                };
            };
            paths: {
                ace: string;
                'ace/ext/language_tools': string;
                vs: string;
            };
            shim: {
                'ace/ext/language_tools': {};
            };
        };
    };
    export default _default;
}
declare module "jassijs_editor/MonacoPanel" {
    import "jassijs_editor/Debugger";
    import "jassijs_editor/ext/monaco";
    import { CodePanel } from "jassijs_editor/CodePanel";
    /**
    * wrapper for the Ace-Code editor with Typescript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    export class MonacoPanel extends CodePanel {
        private _mode;
        private _editor;
        private _isInited;
        file: string;
        private static _tooltipdiv;
        private _lastTooltipRefresh;
        constructor();
        render(): any;
        componentDidMount(): void;
        private getBreakpointDecoration;
        autocomplete(): void;
        private _mouseDown;
        /**
         * gets a list of all lines with breakpoint
         * @returns {Object.<number, boolean>}
         */
        getBreakpoints(): {
            [line: number]: boolean;
        };
        /**
         * breakpoint changed
         * @param {function} handler - function(line,enabled,type)
         */
        onBreakpointChanged(handler: any): void;
        /**
         * component get focus
         * @param {function} handler
         */
        onfocus(handler: any): any;
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler: any): any;
        /**
         * @param - the codetext
         */
        set value(value: string);
        get value(): string;
        /**
         * @param {object} position - the current cursor position {row= ,column=}
         */
        set cursorPosition(cursor: {
            row: number;
            column: number;
        });
        get cursorPosition(): {
            row: number;
            column: number;
        };
        destroy(): void;
        /**
        * undo action
        */
        undo(): void;
        /**
         * resize the editor
         * */
        resize(): void;
        /**
       * @member {string} - the language of the editor e.g. "ace/mode/javascript"
       */
        set mode(mode: string);
        get mode(): string;
        loadsample(): any;
    }
    export function test(): unknown;
}
declare module "jassijs_editor/SearchExplorer" {
    import { Tree } from "jassijs/ui/Tree";
    import { Panel } from "jassijs/ui/Panel";
    import { Textbox } from "jassijs/ui/Textbox";
    export class SearchExplorer extends Panel {
        tree: Tree;
        search: Textbox;
        maximalFounds: Number;
        constructor();
        static show(): any;
        doSearch(): any;
        layout(): any;
    }
    export function test(): SearchExplorer;
}
declare module "jassijs_editor/StartEditor" { }
declare module "jassijs_editor/template/TemplateDBDialog" {
    import { FileNode } from "jassijs/remote/FileNode";
    import { DBObject } from "jassijs/remote/DBObject";
    export class TemplateDBDialogProperties {
        dialogname: string;
        dbobject: DBObject;
    }
    export class TemplateDBDialog {
        static code: string;
        static newFile(all: FileNode[]): any;
    }
}
declare module "jassijs_editor/template/TemplateDBObject" {
    import { FileNode } from "jassijs/remote/FileNode";
    export class TemplateDBObjectProperties {
        name: string;
        autogeneratedid: string;
    }
    export class TemplateDBObject {
        static code: string;
        static newFile(all: FileNode[]): any;
    }
}
declare module "jassijs_editor/template/TemplateEmptyDialog" {
    import { FileNode } from "jassijs/remote/FileNode";
    export class TemplateEmptyDialog {
        static code: string;
        static newFile(all: FileNode[]): any;
    }
}
declare module "jassijs_editor/template/TemplateRemoteObject" {
    import { FileNode } from "jassijs/remote/FileNode";
    export class TemplateRemoteObject {
        static code: string;
        static newFile(all: FileNode[]): any;
    }
}
declare module "jassijs_editor/util/DatabaseSchema" {
    import "jquery.choosen";
    export class DatabaseField {
        name: string;
        type: string;
        relation: string;
        properties: any;
        inverseSide: string;
        join: boolean;
        get nullable(): boolean;
        set nullable(value: boolean);
        private parent;
        getReverseField(): DatabaseField;
        /**
         * looks possible relations in the type class
         **/
        getPossibleRelations(): string[];
        get relationinfo(): string;
        set relationinfo(value: string);
    }
    export class DatabaseClass {
        filename: string;
        name: string;
        fields: DatabaseField[];
        properties: any;
        parent: DatabaseSchema;
        simpleclassname: string;
        getField(name: string): DatabaseField;
    }
    export class DatabaseSchema {
        static basicdatatypes: {};
        databaseClasses: DatabaseClass[];
        private parsedClasses;
        private definedImports;
        getClass(name: string): DatabaseClass;
        private getFulltype;
        private createDBClass;
        private createDBField;
        private reloadCodeInEditor;
        updateSchema(onlyPreview?: boolean): Promise<string>;
        private parseFiles;
        loadSchemaFromCode(): any;
    }
    export function test3(): any;
    export function test2(): any;
}
declare module "jassijs_editor/util/DragAndDropper" {
    import { Component } from "jassijs/ui/Component";
    import "jassijs/ext/jquerylib";
    export class DragAndDropper {
        onpropertychanged: (component: Component, top: number, left: number, oldParent: Component, newParent: Component, beforeComponent: Component) => any;
        onpropertyadded: (typename: string, component: Component, top: number, left: number, newparent: number, beforecomponent: Component) => any;
        private lastDropCanceled;
        private allIDs;
        private _isDragging;
        private parentPanel;
        draggableComponents: JQuery<Element>;
        private droppableComponents;
        constructor();
        /**
         * could be override to block dragging
         */
        isDragEnabled(event: any, ui: any): boolean;
        isDragging(): boolean;
        enableDraggable(enable: boolean): void;
        private _drop;
        /**
        * install the DragAndDropper
        * all child jomponents are draggable
        * all child containers are droppable
        * @param  parentPanel - all childs are effected
        * @param allIDs - ID's of all editable components e.g. #10,#12
        * @returns {unresolved}
        */
        install(parentPanel: Component, allIDs: string): void;
        /**
         * uninstall the DragAndDropper
         */
        uninstall(): void;
    }
}
declare module "jassijs_editor/util/Parser" {
    import ts from "typescript";
    import { Test } from "jassijs/remote/Test";
    interface Entry {
        value?: any;
        node?: ts.Node;
        isFunction: boolean;
        isJc?: boolean;
        className?: string;
    }
    class ParsedDecorator {
        node?: ts.Decorator;
        name?: string;
        parsedParameter?: object[];
        parameter?: string[];
    }
    class ParsedMember {
        node?: ts.Node;
        name?: string;
        decorator?: {
            [name: string]: ParsedDecorator;
        };
        type?: string;
    }
    export class ParsedClass {
        parent?: Parser;
        node?: ts.ClassElement;
        name?: string;
        fullClassname?: string;
        members?: {
            [name: string]: ParsedMember;
        };
        decorator?: {
            [name: string]: ParsedDecorator;
        };
    }
    export class Parser {
        isJSX: boolean;
        sourceFile: ts.SourceFile;
        refsNode: ts.Node;
        refs: {
            [name: string]: Entry;
        };
        classes: {
            [name: string]: ParsedClass;
        };
        imports: {
            [name: string]: string;
        };
        functions: {
            [name: string]: ts.Node;
        };
        variables: {
            [name: string]: ts.Node;
        };
        classScope: {
            classname: string;
            methodname: string;
        }[];
        variabelStack: any;
        code: string;
        /**
        * @member {Object.<string,Object.<string,[object]>> - all properties
        * e.g. data["textbox1"][value]->Entry
        */
        data: {
            [variable: string]: {
                [property: string]: Entry[];
            };
        };
        /**
         * parses Code for UI relevant settings
         * @class jassijs_editor.util.Parser
         */
        constructor();
        getModifiedCode(): string;
        updateCode(): void;
        reformatCode(code: string): string;
        /**
         * add a property
         * @param {string} variable - name of the variable
         * @param {string} property - name of the property
         * @param {string} value  - code - the value
         * @param node - the node of the statement
         */
        private add;
        /**
         * read a property value from code
         * @param {string} variable - the name of the variable
         * @param {string} property - the name of the property
         */
        getPropertyValue(variable: any, property: any): any;
        addRef(name: string, type: string): void;
        /**
         * add import {name} from file
         * @param name
         * @param file
         */
        addImportIfNeeded(name: string, file: string): void;
        private parseRefsNode;
        private convertArgument;
        private parseDecorator;
        private parseClass;
        private parseConfig;
        private parseJC;
        private parseJSX;
        private parseProperties;
        private visitNode;
        private visitNodeJSX;
        searchClassnode(node: ts.Node, pos: number): {
            classname: string;
            methodname: string;
        };
        getClassScopeFromPosition(code: string, pos: number): {
            classname: string;
            methodname: string;
        };
        private removePos;
        private createNode;
        initvariabelStack(values: any[]): void;
        /**
        * parse the code
        * @param {string} code - the code
        * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
        */
        parse(code: string, classScope?: {
            classname: string;
            methodname: string;
        }[], variabelStack?: any, isJSX?: boolean): void;
        private removeNode;
        renameVariable(oldName: string, newName: string): string;
        /**
         * modify a member
         **/
        addOrModifyMember(member: ParsedMember, pclass: ParsedClass): void;
        /**
        * removes the property from code
        * @param {type} property - the property to remove
        * @param {type} [onlyValue] - remove the property only if the value is found
        * @param {string} [variablename] - thpe name of the variable - default=this.variablename
        */
        removePropertyInCode(property: string, onlyValue?: any, variablename?: string): ts.Node;
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariablesInCode(varnames: string[]): void;
        private getNodeFromScope;
        /**
         * gets the next variablename
         * */
        getNextVariableNameForType(type: string, suggestedName?: string): string;
        /**
         * change objectliteral to mutliline if needed
         */
        private switchToMutlilineIfNeeded;
        private setPropertyInConfig;
        private setPropertyInJC;
        setPropertyInJSX(variableName: string, property: string, value: string | ts.Node, classscope: {
            classname: string;
            methodname: string;
        }[], isFunction?: boolean, replace?: boolean, before?: {
            variablename: string;
            property: string;
            value?: any;
        }, variablescope?: {
            variablename: string;
            methodname: any;
        }): void;
        /**
        * modify the property in code
        * @param variablename - the name of the variable
        * @param  property - the property
        * @param value - the new value
        * @param classscope  - the property would be insert in this block
        * @param isFunction  - true if the property is a function
        * @param [replace]  - if true the old value is deleted
        * @param [before] - the new property is placed before this property
        * @param [variablescope] - if this scope is defined - the new property would be insert in this variable
        */
        setPropertyInCode(variableName: string, property: string, value: string | ts.Node, classscope: {
            classname: string;
            methodname: string;
        }[], isFunction?: boolean, replace?: boolean, before?: {
            variablename: string;
            property: string;
            value?: any;
        }, variablescope?: {
            variablename: string;
            methodname: any;
        }): void;
        /**
         * swaps two statements indendified by  functionparameter in a variable.property(parameter1) with variable.property(parameter2)
         **/
        swapPropertyWithParameter(variable: string, property: string, parameter1: string, parameter2: string): void;
        /**
        * adds an Property
        * @param type - name of the type o create
        * @param classscope - the scope (methodname) where the variable should be insert Class.layout
        * @param variablescope - the scope where the variable should be insert e.g. hallo.onclick
        * @returns  the name of the object
        */
        addVariableInCode(fulltype: string, classscope: {
            classname: string;
            methodname: string;
        }[], variablescope?: {
            variablename: string;
            methodname: any;
        }, suggestedName?: any, codeHasChanged?: {
            value: boolean;
        }): string;
    }
    export function tests(t: Test): any;
    export function test(): any;
}
declare module "jassijs_editor/util/Resizer" {
    import "jassijs/ext/jquerylib";
    import { Component } from "jassijs/ui/Component";
    import { DragAndDropper } from "jassijs_editor/util/DragAndDropper";
    export class Resizer {
        private cursorType;
        private isCursorOnBorder;
        private resizedElement;
        private isMouseDown;
        private elements;
        private mousedownElements;
        onelementselected: (ids: string[], event: any) => void;
        onpropertychanged: (component: Component, property: string, value: any) => void;
        private parentPanel;
        private lastSelected;
        componentUnderCursor: Element;
        private lassoMode;
        draganddropper: DragAndDropper;
        private topElement;
        private propertyChangetimer;
        constructor();
        private mouseDownOld;
        private mouseDown;
        private mouseMove;
        private mouseUp;
        private firePropertyChange;
        /**
        * resize the component
        * this is an onmousemove event called from _changeCursor()
        * @param {type} event
        */
        private _resizeComponent;
        /**
        * changes the cursor
        * @param {type} e
        */
        _changeCursor(e: any): void;
        /**
         * enable or disable the lasso
         * with lasso some components can be selected with dragging
         */
        setLassoMode(enable: boolean): void;
        /**
         * install the resizer
         * @param parentPanel - the parent component
         * @param elements - the search pattern for the components to resize e.q. ".jresizeable"
         */
        install(parentPanel: Component, elements: string): void;
        /**
         * uninstall the resizer
         */
        uninstall(): void;
    }
}
declare module "jassijs_editor/util/Tests" {
    import { FileNode } from "jassijs/remote/FileNode";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Test } from "jassijs/remote/Test";
    class MyContainer extends BoxPanel {
        startDate: number;
        statustext: HTMLPanel;
        alltests: number;
        failedtests: number;
        finished: boolean;
        update(): void;
    }
    export class TestAction {
        static testNode(all: FileNode[], container?: MyContainer): any;
    }
    export class Tests {
    }
    export function test(tst: Test): any;
}
declare module "jassijs_editor/util/TSSourceMap" {
    export class TSSourceMap {
        getCode(file: string): unknown;
        getLineFromTS(tsfile: string, line: any, column: any): Promise<{
            line: number;
            column: number;
            jsfilename: string;
        }>;
        getLineFromJS(jsfile: string, line: number, column: number): Promise<{
            source: string;
            line: number;
            column: number;
        }>;
        getLinesFromJS(jsfile: any, data: {
            line: number;
            column: number;
        }[]): Promise<{
            source: string;
            line: number;
            column: number;
        }[]>;
    }
}
declare module "jassijs_editor/util/Typescript" {
    import "jassijs_editor/ext/monaco2";
    import "jassijs_editor/ext/monaco";
    import ts from "typescript";
    export class Typescript {
        static instance: Typescript;
        waitForInited: Promise<boolean>;
        tsWorker: monaco.languages.typescript.TypeScriptWorker;
        static languageServiceHost: ts.LanguageServiceHost;
        static ts: any;
        /**
        * resolved if the service is inited
        */
        private static _isInited;
        static compilerSettings: {
            baseUrl: string;
            target: string;
            module: string;
            sourceMap: boolean;
            outDir: string;
            allowJs: boolean;
            moduleResolution: any;
            jsx: any;
            emitDecoratorMetadata: boolean;
            experimentalDecorators: boolean;
            esModuleInterop: boolean;
            typeRoots: {};
        };
        isInited(file: any): boolean;
        /**
         * transpile the ts-file an returns all reflected files
         * @param fileName
         * @param content
         */
        transpile(fileName: string, content: string, compilerSettings?: any): Promise<{
            fileNames: string[];
            contents: string[];
        }>;
        private constructor();
        static initMonaco(): void;
        initInIdle: boolean;
        private includeModulTypes;
        /**
         * initialize the services tooks any seconds
         * functions which uses the languageservice are blocked until ready
         */
        initService(): Promise<boolean>;
        /**
         * unused
         */
        getDefinitionAtPosition(file: string, position: number): unknown;
        /**
         * unused
         */
        getSignatureHelpItems(file: string, position: number): unknown;
        includefileIfNeeded(file: string): any;
        renameFile(oldfile: string, newfile: string): any;
        /**
         * @returns all code filenames
         */
        getFiles(): string[];
        /**
         * get the code for a file
         * @params file - the filename e.g. jassijs/base/Parser.ts
         */
        getCode(file: string): string;
        /**
         * put file in cache
         * @param file - the ts file
         * @param text - the text of the ts file
         */
        setCode(file: string, text: string): any;
        /**
         * get info for a completionentry
         * @param file - the ts file
         * @param position - the position in string
         * @param item -the item we are interested
         * @param formatOptions -unused
         * @param source -unused
         * @param preferences - unused
         */
        getCompletionEntryDetails(file: string, position: number, item: string, formatOptions?: {}, source?: any, preferences?: {}): unknown;
        /**
         * get all completions at a  position
         * @param file -the ts file
         * @param position -the position in string
         * @param text - the text of the file is saved to cache
         */
        getCompletion(file: string, position: number, text: string, options: any): unknown;
        getQuickInfoAtPosition(file: string, position: number, text: string): unknown;
        getCodeFixesAtPosition(file: string, text: string, start: number, end: number, errorCodes: []): Promise<any>;
        formatDocument(filePath: string, text?: string): unknown;
        getDiagnosticsForAll(): Promise<ts.Diagnostic[]>;
        getLineAndCharacterOfPosition(fileName: string, pos: number): {
            line: any;
            character: any;
        };
        getPositionOfLineAndCharacter(fileName: string, pos: {
            line: any;
            character: any;
        }): number;
        getDiagnostics(file: string, text?: string): unknown;
    }
    var mytypescript: Typescript;
    export { mytypescript };
}
