import jassi, { $Class } from "remote/jassi/base/Jassi";
import { Panel } from "jassi/ui/Panel";
import { CodePanel } from "jassi_editor/CodePanel";
import { VariablePanel } from "jassi/ui/VariablePanel";
import { DockingContainer } from "jassi/ui/DockingContainer";
import { ErrorPanel } from "jassi/ui/ErrorPanel";
import { Button } from "jassi/ui/Button";
import registry from "remote/jassi/base/Registry";
import { Server } from "remote/jassi/base/Server";
import { Reloader } from "jassi/util/Reloader";
import { classes } from "remote/jassi/base/Classes";
import { Component } from "jassi/ui/Component";

import { ReportDesign } from "jassi_report/ReportDesign";
import { $Property } from "jassi/ui/Property";
import { Test } from "jassi/base/Tests";
import { Tools } from "jassi/util/Tools";
import { ReportDesigner } from "jassi_report/designer/ReportDesigner";
import { AcePanel } from "jassi_editor/AcePanel";
/**
 * Panel for editing sources
 * @class jassi_report.ReportEditor
 */
@$Class("jassi_report.ReportEditor")
export class ReportEditor extends Panel {
    _main: DockingContainer;
    _codeView: Panel;
    _codeToolbar: Panel;
    _design: ReportDesigner;
    _codePanel: CodePanel;
    _variables: VariablePanel;
    constructor() {
        super();
        this.maximize();
        this._main = new DockingContainer();
        this._codeView = new Panel();
        this._codePanel = new AcePanel();
        this._design = new ReportDesigner();
        this._variables = new VariablePanel();
        this._codeToolbar = new Panel();
        this._init();
    }
    _init() {
        var _this = this;
        this._codePanel.width = "100%";
        this._codePanel.mode = "typescript";
        /*  this._codePanel.getDocTooltip = function (item) {
              return _this.getDocTooltip(item);
          }*/
        this._codeToolbar["horizontal"] = false;
        this._codeToolbar.height = "30";
        this._codeView["horizontal"] = true;
        this._codeView.add(this._codeToolbar);
        this._codeView.add(this._codePanel);
        this._codePanel.height = "calc(100% - 31px)";
        this._codePanel.width = "100%";
        this._main.width = "calc(100% - 1px)";
        this._main.height = "99%";
        var undo = new Button();
        undo.icon = "mdi mdi-undo";
        undo.tooltip = "Undo (Strg+Z)";
        undo.onclick(function() {
            console.log(_this._main.layout);
            _this._main.layout = _this._main.layout;
            _this._codePanel.undo();
        });
        this._codeToolbar.add(undo);
        var lasttop = (<HTMLElement>this._main.dom).offsetTop;
        var lasttop2 = 0;
        this._main.onresize = function() {
            setTimeout(function() {
                _this._codePanel.resize();
            }, 1000);
            /*     if(_this._main.dom.offsetTop!==lasttop){//resize to height
                    lasttop=_this._main.dom.offsetTop;
                    var i="calc(100% - "+(lasttop+1)+"px)";
                    _this._main.height=i;
                }*/
            //TODO _this._designView.resize();
        };
        super.add(this._main);
        this._variables.value = [];
        this._variables.addVariable(this, {});
        this._installView();
        //Dockingview
       
        this._design.codeEditor = this;
        //   this._codePanel.setCompleter(this);
    }
    _installView() {
        //	debugger;
        this._main.add(this._codeView, "Code..", "code");
        this._main.add(this._design, "Design", "design");
        var des='{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},        "content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"",	        "content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,		        "content":[		        	{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,			        "content":[	{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},			        			{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}			        		  ]		        },		        {"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,		        "content":[		        	{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,			        "content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}			        		]		        	},			        {"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,			        	"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true			        					        	}]			        },			         {"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,			        	"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true			        					        	}]			        },			     ]}			     ]},			 ]	        }	    	],	    	"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        this._design.mainLayout=JSON.stringify(des);
     }
    /**
    * get all known instances for type
    * @param {type} type - the type we are interested
    * @returns {[string]}
    */
    getVariablesForType(type) {
        return this._variables.getVariablesForType(type);
    }
    /**
     * gets the name of the variabel that holds the object
     * @param {object} ob - the
     */
    getVariableFromObject(ob) {
        return this._variables.getVariableFromObject(ob);
    }
    /**
     * gets the name object of the given variabel
     * @param {string} ob - the name of the variable
     */
    getObjectFromVariable(varname) {
        return this._variables.getObjectFromVariable(varname);
    }
    /**
      * renames a variable in design
      * @param {string} oldName
      * @param {string} newName
      */
    renameVariable(oldName, newName) {
    }
    /**
     * @member { jassi.ui.VariablePanel} - the variable
     */
    set variables(value) {
        this._variables = value;
    }
    get variables() {
        return undefined;
        return this._variables;
    }
    /**
     * @member {string} - the code
     */
    set value(value) {
        // this._codePanel.file = this._file;
        this._codePanel.value = value;
    }
    get value() {
        return this._codePanel.value;
    }
    setCursorPorition(position: number) {
        this.cursorPosition = this._codePanel.numberToPosition(position);
    }
    /**
    * @param {object} position - the current cursor position {row= ,column=}
    */
    set cursorPosition(cursor: {
        row: number;
        column: number;
    }) {
        this._codePanel.cursorPosition = cursor;
    }
    get cursorPosition() {
        return this._codePanel.cursorPosition;
    }
    destroy() {
        this._codeView.destroy();
        this._codePanel.destroy();
        this._design.destroy();
        this._codeToolbar.destroy();
        //this._main.destroy();
        super.destroy();
    }
    /**
    * undo action
    */
    undo() {
        this._codePanel.undo();
    }
}
export async function test() {
    var editor = new ReportEditor();
    editor.height = 500;
    var rep = { "content": { "stack": [{ "text": "Halloso" }, { "text": "sdsfsdf" }] } };
    editor.value = Tools.objectToJson(rep, "", true);
    return editor;
}
;
