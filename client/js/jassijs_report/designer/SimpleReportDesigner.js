var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_report/designer/ReportDesigner", "jassijs/util/Tools"], function (require, exports, Jassi_1, ReportDesigner_1, Tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SimpleReportDesigner = void 0;
    let SimpleReportDesigner = class SimpleReportDesigner extends ReportDesigner_1.ReportDesigner {
        constructor() {
            super();
            this.codePrefix = "var ttt=";
            this.mainLayout = JSON.stringify({
                "settings": { "hasHeaders": true, "constrainDragToContainer": true, "reorderEnabled": true, "selectionEnabled": false, "popoutWholeStack": false, "blockedPopoutsThrowError": true, "closePopoutsOnUnload": true, "showPopoutIcon": false, "showMaximiseIcon": true, "showCloseIcon": true, "responsiveMode": "onload" }, "dimensions": { "borderWidth": 5, "minItemHeight": 10, "minItemWidth": 10, "headerHeight": 20, "dragProxyWidth": 300, "dragProxyHeight": 200 }, "labels": { "close": "close", "maximise": "maximise", "minimise": "minimise", "popout": "open in new window", "popin": "pop in", "tabDropdown": "additional tabs" }, "content": [{
                        "type": "column", "isClosable": true, "reorderEnabled": true, "title": "", "content": [{
                                "type": "row", "isClosable": true, "reorderEnabled": true, "title": "", "height": 81.04294066258988,
                                "content": [{
                                        "type": "stack", "width": 80.57491289198606, "height": 71.23503465658476, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0,
                                        "content": [
                                            { "title": "Code..", "type": "component", "componentName": "code", "componentState": { "title": "Code..", "name": "code" }, "isClosable": true, "reorderEnabled": true },
                                            { "title": "Design", "type": "component", "componentName": "design", "componentState": { "title": "Design", "name": "design" }, "isClosable": true, "reorderEnabled": true }
                                        ]
                                    },
                                    {
                                        "type": "column", "isClosable": true, "reorderEnabled": true, "title": "", "width": 19.42508710801394,
                                        "content": [
                                            {
                                                "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 19.844357976653697,
                                                "content": [{ "title": "Palette", "type": "component", "componentName": "componentPalette", "componentState": { "title": "Palette", "name": "componentPalette" }, "isClosable": true, "reorderEnabled": true }]
                                            },
                                            {
                                                "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 80.1556420233463,
                                                "content": [{ "title": "Properties", "type": "component", "componentName": "properties", "componentState": { "title": "Properties", "name": "properties" }, "isClosable": true, "reorderEnabled": true }]
                                            },
                                            {
                                                "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 19.844357976653697,
                                                "content": [{ "title": "Components", "type": "component", "componentName": "components", "componentState": { "title": "Components", "name": "components" }, "isClosable": true, "reorderEnabled": true }]
                                            }
                                        ]
                                    }]
                            }
                        ]
                    }], "isClosable": true, "reorderEnabled": true, "title": "", "openPopouts": [], "maximisedItemId": null
            });
            this._designToolbar.remove(this.saveButton);
            this._designToolbar.remove(this.runButton);
            this.editButton.tooltip = "pdf preview";
            this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";
            //        this._designToolbar.remove(this.);
            //'{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true},{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":19.42508710801394,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';        //'{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":9.78603688012232,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":61.55066380085299,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":28.663299319024677,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        propertyChanged() {
            this.propertyIsChanging = true;
            let job = this.designedComponent.toJSON();
            delete job.parameter;
            delete job.data;
            let ob = Tools_1.Tools.objectToJson(job, undefined, false, 80);
            this._codeEditor._codePanel.value = this.codePrefix + ob + ";";
            this.propertyIsChanging = false;
            /*  let job=this.designedComponent.toJSON();
              delete job.parameter;
              delete job.data;
              let ob=Tools.objectToJson(job,undefined,false);
              if(this._codeChanger.parser.variables["reportdesign"]){
                  var s=this._codeChanger.parser.code.substring(0,this._codeChanger.parser.variables["reportdesign"].pos)+
                      " reportdesign = "+ob+this._codeChanger.parser.code.substring(this._codeChanger.parser.variables["reportdesign"].end);
                      this.codeEditor.value = s;
                  this._codeChanger.updateParser();
                  this._codeChanger.callEvent("codeChanged", {});
              //this.callEvent("codeChanged", {});
              }else
                  this._codeChanger.setPropertyInCode("reportdesign",ob);*/
        }
    };
    SimpleReportDesigner = __decorate([
        (0, Jassi_1.$Class)("jassijs_report.designer.SimpleReportDesigner"),
        __metadata("design:paramtypes", [])
    ], SimpleReportDesigner);
    exports.SimpleReportDesigner = SimpleReportDesigner;
    function test() {
        var reportdesign = {
            content: [
                {
                    text: "Hallo Herr {{nachname}}"
                },
                {
                    text: "ok"
                },
                {
                    columns: [
                        {
                            text: "text"
                        },
                        {
                            text: "text"
                        }
                    ]
                }
            ],
            data: {
                nachname: "Meier"
            }
        };
    }
    exports.test = test;
});
//# sourceMappingURL=SimpleReportDesigner.js.map