var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("jassi/jassi", ["require", "exports", "jassi/remote/Jassi", "jassi/base/Errors", "jassi/remote/Classes", "jassi/remote/Jassi", "jassi/base/Extensions", "jassi/remote/Registry", "jassi/ext/jquerylib", "jassi/ext/intersection-observer"], function (require, exports, Jassi_1, Errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Jassi_1.default.errors = new Errors_1.Errors();
    exports.default = Jassi_1.default;
});
define("jassi/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jquery_language = 'https://cdn.jsdelivr.net/gh/jquery/jquery-ui@main/ui/i18n/datepicker-' + navigator.language.split("-")[0];
    exports.default = {
        "css": {
            "jassi.css": "jassi.css",
            "materialdesignicons.min.css": "https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css",
            "jquery-ui.css": "https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css"
        },
        "types": {
            "node_modules/jquery/JQuery.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/JQuery.d.ts",
            "node_modules/jquery/JQueryStatic.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/JQueryStatic.d.ts",
            "node_modules/jquery/legacy.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/legacy.d.ts",
            "node_modules/jquery/misc.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/misc.d.ts",
            "node_modules/jqueryui/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/jqueryui/index.d.ts",
            "node_modules/chosen-js/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/chosen-js/index.d.ts",
            "node_modules/jquery.fancytree/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery.fancytree/index.d.ts",
            "node_modules/requirejs/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/requirejs/index.d.ts",
            "node_modules/sizzle/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/sizzle/index.d.ts",
            "node_modules/tabulator-tables/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/tabulator-tables/index.d.ts",
            "node_modules/typescript/typescriptServices.d.ts": "https://cdn.jsdelivr.net/gh/microsoft/TypeScript@release-3.7/lib/typescriptServices.d.ts"
        },
        "require": {
            "paths": {
                'intersection-observer': '//cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js',
                'goldenlayout': '//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/goldenlayout',
                "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect",
                'jquery.choosen': '//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery',
                'jquery.contextMenu': '//rawgit.com/s-yadav/contextMenu.js/master/contextMenu',
                'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
                "jquery.fancytree.ui-deps": '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.ui-deps',
                'jquery.fancytree.filter': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.filter',
                'jquery.fancytree.multi': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.multi',
                'jquery.fancytree.dnd': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.dnd',
                'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery',
                'jquery.ui': '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui',
                'jquery.ui.touch': '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min',
                'jquery.doubletap': '//cdnjs.cloudflare.com/ajax/libs/jquery-touch-events/2.0.3/jquery.mobile-events.min',
                'jquery.notify': '//cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min',
                'jquery.language': jquery_language,
                'js-cookie': '//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
                'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
                'papaparse': '//cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.3/papaparse.min',
                'ric': '//cdn.jsdelivr.net/npm/requestidlecallback@0.3.0/index.min',
                'source.map': "https://unpkg.com/source-map@0.7.3/dist/source-map",
                'spectrum': '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min',
                'splitlib': '//cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min',
                'tabulatorlib': '//unpkg.com/tabulator-tables@4.9.3/dist/js/tabulator',
                'tinymcelib': '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min' //also define in tinymce.js
            },
            "shim": {
                'goldenlayout': ["jquery"],
                "jquery.choosen": ["jquery"],
                "jquery.contextMenu": ["jquery.ui"],
                'jquery.fancytree': ["jquery", "jquery.ui"],
                'jquery.fancytree.dnd': ["jquery", "jquery.ui"],
                'jquery.ui': ["jquery"],
                'jquery.notify': ["jquery"],
                'jquery.ui.touch': ["jquery", "jquery.ui"],
                'jquery.doubletap': ["jquery"],
                'jassi/jassi': ['jquery', 'jquery.ui', 'jquery.ui.touch'],
                "spectrum": ["jquery"]
            }
        }
    };
});
//this file is autogenerated don't modify
define("jassi/registry", ["require"], function (require) {
    return {
        default: {
            "jassi/base/ActionNode.ts": {
                "date": 1613505970029,
                "jassi.base.ActionNode": {}
            },
            "jassi/base/Actions.ts": {
                "date": 1613555666518,
                "jassi.base.Actions": {}
            },
            "jassi/base/Database.ts": {
                "date": 1613218544160,
                "jassi.base.Database": {},
                "jassi.base.Database.TypeResolver": {},
                "jassi.base.Database.Type": {},
                "jassi.base.Database.Field": {}
            },
            "jassi/base/DatabaseSchema.ts": {
                "date": 1615410630397,
                "jassi.base.DatabaseSchema": {}
            },
            "jassi/base/Errors.ts": {
                "date": 1590693468836
            },
            "jassi/base/Extensions.ts": {
                "date": 1613921826082
            },
            "jassi/base/LoginDialog.ts": {
                "date": 1613218597119
            },
            "jassi/base/PropertyEditorService.ts": {
                "date": 1613218566584,
                "jassi.base.PropertyEditorService": {}
            },
            "jassi/base/Router.ts": {
                "date": 1615231156312,
                "jassi.base.Router": {}
            },
            "jassi/base/Tests.ts": {
                "date": 1613416627532,
                "jassi.ui.TestAction": {
                    "$ActionProvider": [
                        "jassi.remote.FileNode"
                    ]
                },
                "jassi.base.Test": {}
            },
            "jassi/base/Windows.ts": {
                "date": 1613218544160,
                "jassi.base.Windows": {}
            },
            "jassi/jassi.ts": {
                "date": 1614358430834
            },
            "jassi/modul.ts": {
                "date": 1615134737730
            },
            "jassi/remote/Classes.ts": {
                "date": 1613925159863,
                "jassi.remote.Classes": {}
            },
            "jassi/remote/Database.ts": {
                "date": 1615586709418,
                "jassi.remote.Database": {}
            },
            "jassi/remote/DBArray.ts": {
                "date": 1615231253407,
                "jassi.remote.DBArray": {}
            },
            "jassi/remote/DBObject.ts": {
                "date": 1615492360475,
                "jassi.remote.DBObject": {}
            },
            "jassi/remote/DBObjectQuery.ts": {
                "date": 1613218566583
            },
            "jassi/remote/Extensions.ts": {
                "date": 1615231258775
            },
            "jassi/remote/FileNode.ts": {
                "date": 1614803263239,
                "jassi.remote.FileNode": {}
            },
            "jassi/remote/hallo.ts": {
                "date": 1613218515810
            },
            "jassi/remote/Jassi.ts": {
                "date": 1614285410993,
                "jassi.remote.Jassi": {}
            },
            "jassi/remote/ObjectTransaction.ts": {
                "date": 1614468824546
            },
            "jassi/remote/Registry.ts": {
                "date": 1614285404119
            },
            "jassi/remote/RemoteObject.ts": {
                "date": 1614545171594,
                "jassi.remote.RemoteObject": {}
            },
            "jassi/remote/RemoteProtocol.ts": {
                "date": 1614463817133,
                "jassi.remote.RemoteProtocol": {}
            },
            "jassi/remote/security/Group.ts": {
                "date": 1613218997136,
                "jassi.remote.security.Group": {
                    "$DBObject": [
                        {
                            "name": "jassi_group"
                        }
                    ]
                }
            },
            "jassi/remote/security/ParentRight.ts": {
                "date": 1613219003253,
                "jassi.remote.security.ParentRight": {
                    "$DBObject": [
                        {
                            "name": "jassi_parentright"
                        }
                    ]
                }
            },
            "jassi/remote/security/Right.ts": {
                "date": 1613219011774,
                "jassi.remote.security.Right": {
                    "$DBObject": [
                        {
                            "name": "jassi_right"
                        }
                    ]
                }
            },
            "jassi/remote/security/Rights.ts": {
                "date": 1614469207075,
                "jassi.remote.security.Rights": {}
            },
            "jassi/remote/security/User.ts": {
                "date": 1615231236534,
                "jassi.remote.security.User": {
                    "$DBObject": [
                        {
                            "name": "jassi_user"
                        }
                    ]
                }
            },
            "jassi/remote/Server.ts": {
                "date": 1615732643984,
                "jassi.remote.Server": {}
            },
            "jassi/remote/Transaction.ts": {
                "date": 1614545262225,
                "jassi.remote.Transaction": {}
            },
            "jassi/security/GroupView.ts": {
                "date": 1613218741242,
                "jassi/security/GroupView": {
                    "$DBObjectView": [
                        {
                            "classname": "{{dbfullclassname}}"
                        }
                    ]
                }
            },
            "jassi/security/UserView.ts": {
                "date": 1613218819988,
                "jassi/UserView": {
                    "$DBObjectView": [
                        {
                            "classname": "jassi.security.User"
                        }
                    ]
                }
            },
            "jassi/template/TemplateDBDialog.ts": {
                "date": 1615921857812,
                "jassi.ui.TemplateDBDialogProperties": {},
                "jassi.ui.TemplateDBDialog": {
                    "$ActionProvider": [
                        "jassi.remote.FileNode"
                    ]
                }
            },
            "jassi/template/TemplateDBObject.ts": {
                "date": 1613649434998,
                "jassi.ui.TemplateDBDialogProperties": {},
                "jassi.ui.TemplateDBObject": {
                    "$ActionProvider": [
                        "jassi.remote.FileNode"
                    ]
                }
            },
            "jassi/template/TemplateEmptyDialog.ts": {
                "date": 1613504671112,
                "jassi.ui.TemplateEmptyDialog": {
                    "$ActionProvider": [
                        "jassi.remote.FileNode"
                    ]
                }
            },
            "jassi/ui/ActionNodeMenu.ts": {
                "date": 1613512475808,
                "jassi/ui/ActionNodeMenu": {}
            },
            "jassi/ui/BoxPanel.ts": {
                "date": 1613218544160,
                "jassi.ui.BoxPanel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/BoxPanel",
                            "icon": "mdi mdi-view-sequential-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "isAbsolute",
                            "hide": true,
                            "type": "boolean"
                        }
                    ]
                }
            },
            "jassi/ui/Button.ts": {
                "date": 1614117889882,
                "jassi.ui.Button": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Button",
                            "icon": "mdi mdi-gesture-tap-button",
                            "initialize": {
                                "text": "button"
                            }
                        }
                    ]
                }
            },
            "jassi/ui/Calendar.ts": {
                "date": 1614021824682,
                "jassi.ui.Calendar": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Calendar",
                            "icon": "mdi mdi-calendar-month"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassi/ui/Checkbox.ts": {
                "date": 1613218544158,
                "jassi.ui.Checkbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Ceckbox",
                            "icon": "mdi mdi-checkbox-marked-outline"
                        }
                    ]
                }
            },
            "jassi/ui/Component.ts": {
                "date": 1613218566584,
                "jassi.ui.Component": {}
            },
            "jassi/ui/ComponentDescriptor.ts": {
                "date": 1613218566584,
                "jassi.ui.ComponentDescriptor": {}
            },
            "jassi/ui/ComponentSpy.ts": {
                "date": 1615231223589,
                "jassi.ui.ComponentSpy": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "jassi/ui/Container.ts": {
                "date": 1613218544159,
                "jassi.ui.Container": {}
            },
            "jassi/ui/ContextMenu.ts": {
                "date": 1614703451260,
                "jassi.ui.ContextMenu": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/ContextMenu",
                            "icon": "mdi mdi-dots-vertical",
                            "editableChildComponents": [
                                "menu"
                            ]
                        }
                    ]
                }
            },
            "jassi/ui/converters/DefaultConverter.ts": {
                "date": 1615231302585,
                "jassi.ui.converters.DefaultConverterProperties": {},
                "jassi.ui.converters.DefaultConverter": {
                    "$Converter": [
                        {
                            "name": "custom"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassi.ui.converters.DefaultConverterProperties"
                        }
                    ]
                }
            },
            "jassi/ui/converters/NumberConverter.ts": {
                "date": 1615231311640,
                "jassi.ui.converters.NumberConverter": {
                    "$Converter": [
                        {
                            "name": "number"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json"
                        }
                    ]
                }
            },
            "jassi/ui/converters/StringConverter.ts": {
                "date": 1615231315342,
                "jassi.ui.converters.StringConverter": {
                    "$Converter": [
                        {
                            "name": "string"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json"
                        }
                    ]
                }
            },
            "jassi/ui/CSSProperties.ts": {
                "date": 1613218544159,
                "jassi.ui.CSSProperties": {}
            },
            "jassi/ui/DatabaseDesigner.ts": {
                "date": 1613673965699,
                "jassi/ui/DatabaseDesigner": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "jassi/ui/Databinder.ts": {
                "date": 1615589873138,
                "jassi.ui.Databinder": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Databinder",
                            "icon": "mdi mdi-connection"
                        }
                    ]
                }
            },
            "jassi/ui/DataComponent.ts": {
                "date": 1615587905350,
                "jassi.ui.DataComponent": {}
            },
            "jassi/ui/DBObjectDialog.ts": {
                "date": 1614464799579,
                "jassi.ui.DBObjectDialog": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "jassi/ui/DBObjectExplorer.ts": {
                "date": 1613416590967,
                "jassi.ui.DBObjectNode": {},
                "jassi.ui.DBFileActions": {
                    "$ActionProvider": [
                        "jassi.remote.FileNode"
                    ]
                },
                "jassi.ui.DBObjectActions": {
                    "$ActionProvider": [
                        "jassi.ui.DBObjectNode"
                    ]
                },
                "jassi.ui.DBObjectExplorer": {}
            },
            "jassi/ui/DBObjectView.ts": {
                "date": 1613557693832,
                "jassi/ui/DBObjectView": {
                    "$UIComponent": [
                        {
                            "editableChildComponents": [
                                "this",
                                "me.main",
                                "me.toolbar",
                                "me.save",
                                "me.remove",
                                "me.refresh"
                            ]
                        }
                    ]
                }
            },
            "jassi/ui/DesignDummy.ts": {
                "date": 1615231275007,
                "jassi.ui.DesignDummy": {}
            },
            "jassi/ui/DockingContainer.ts": {
                "date": 1613218544158,
                "jassi.ui.DockingContainer": {}
            },
            "jassi/ui/ErrorPanel.ts": {
                "date": 1613512902725,
                "jassi.ui.ErrorPanel": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "jassi/ui/FileExplorer.ts": {
                "date": 1614885881026,
                "jassi.ui.FileActions": {
                    "$ActionProvider": [
                        "jassi.remote.FileNode"
                    ]
                },
                "jassi.ui.FileExplorer": {}
            },
            "jassi/ui/HTMLEditorPanel.ts": {
                "date": 1613218566582,
                "jassi.ui.HTMLEditorPanel": {}
            },
            "jassi/ui/HTMLPanel.ts": {
                "date": 1615496666013,
                "jassi.ui.HTMLPanel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/HTMLPanel",
                            "icon": "mdi mdi-cloud-tags"
                        }
                    ]
                }
            },
            "jassi/ui/Image.ts": {
                "date": 1614118156072,
                "jassi.ui.Image": {
                    "$UIComponent": [
                        {
                            "fullPath": "default/Image",
                            "icon": "mdi mdi-file-image"
                        }
                    ]
                }
            },
            "jassi/ui/InvisibleComponent.ts": {
                "date": 1615231279789,
                "jassi.ui.InvisibleComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                }
            },
            "jassi/ui/Menu.ts": {
                "date": 1613218544159,
                "jassi.ui.Menu": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Menu",
                            "icon": "mdi mdi-menu",
                            "initialize": {
                                "text": "menu"
                            }
                        }
                    ]
                }
            },
            "jassi/ui/MenuItem.ts": {
                "date": 1613506069164,
                "jassi.ui.MenuItem": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/MenuItem",
                            "icon": "mdi mdi-menu-open",
                            "initialize": {
                                "text": "menu"
                            },
                            "editableChildComponents": [
                                "items"
                            ]
                        }
                    ]
                }
            },
            "jassi/ui/ObjectChooser.ts": {
                "date": 1615590050176,
                "jassi.ui.ObjectChooser": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/ObjectChooser",
                            "icon": "mdi mdi-glasses"
                        }
                    ]
                }
            },
            "jassi/ui/OptionDialog.ts": {
                "date": 1613218544158,
                "jassi.ui.OptionDialog": {},
                "jassi.ui.OptionDialogTestProp": {}
            },
            "jassi/ui/Panel.ts": {
                "date": 1615231285196,
                "jassi.ui.PanelCreateProperties": {},
                "jassi.ui.Panel": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Panel",
                            "icon": "mdi mdi-checkbox-blank-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassi.ui.PanelCreateProperties"
                        }
                    ]
                }
            },
            "jassi/ui/Property.ts": {
                "date": 1613218566584,
                "jassi.ui.Property": {}
            },
            "jassi/ui/PropertyEditor.ts": {
                "date": 1615844604424,
                "jassi.ui.PropertyEditor": {},
                "jassi.ui.PropertyEditorTestProperties": {}
            },
            "jassi/ui/PropertyEditors/BooleanEditor.ts": {
                "date": 1613218544157,
                "jassi.ui.PropertyEditors.BooleanEditor": {
                    "$PropertyEditor": [
                        [
                            "boolean"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/ClassSelectorEditor.ts": {
                "date": 1613421412342,
                "jassi.ui.PropertyEditors.ClassSelectorEditor": {
                    "$PropertyEditor": [
                        [
                            "classselector"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/ColorEditor.ts": {
                "date": 1613421827599,
                "jassi.ui.PropertyEditors.ColorEditor": {
                    "$PropertyEditor": [
                        [
                            "color"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/ComponentSelectorEditor.ts": {
                "date": 1613338542938,
                "jassi.ui.PropertyEditors.ComponentSelectorEditor": {
                    "$PropertyEditor": [
                        [
                            "componentselector"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/DatabinderEditor.ts": {
                "date": 1613421449783,
                "jassi.ui.PropertyEditors.DatabinderEditor": {
                    "$PropertyEditor": [
                        [
                            "databinder"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/DBObjectEditor.ts": {
                "date": 1613218544160,
                "jassi.ui.PropertyEditors.DBObjectEditor": {
                    "$PropertyEditor": [
                        [
                            "dbobject"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/DefaultEditor.ts": {
                "date": 1613421239003,
                "jassi.ui.PropertyEditors.DefaultEditor": {
                    "$PropertyEditor": [
                        [
                            "string",
                            "number",
                            "number[]"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/Editor.ts": {
                "date": 1613218566582,
                "jassi.ui.PropertyEditors.Editor": {}
            },
            "jassi/ui/PropertyEditors/FontEditor.ts": {
                "date": 1613338564468,
                "jassi.ui.PropertyEditors.FontEditor": {
                    "$PropertyEditor": [
                        [
                            "font"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/FunctionEditor.ts": {
                "date": 1613421461639,
                "jassi.ui.PropertyEditors.FunctionEditor": {
                    "$PropertyEditor": [
                        [
                            "function"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/HTMLEditor.ts": {
                "date": 1613218544157,
                "jassi.ui.PropertyEditors.HTMLEditor": {
                    "$PropertyEditor": [
                        [
                            "html"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/ImageEditor.ts": {
                "date": 1614118659538,
                "jassi.ui.PropertyEditors.ImageEditor": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ],
                    "$PropertyEditor": [
                        [
                            "image"
                        ]
                    ]
                }
            },
            "jassi/ui/PropertyEditors/JsonEditor.ts": {
                "date": 1613332987727,
                "jassi.ui.PropertyEditors.JsonEditor": {
                    "$PropertyEditor": [
                        [
                            "json"
                        ]
                    ]
                },
                "jassi.ui.PropertyEditorTestProperties": {},
                "jassi.ui.PropertyEditorTestProperties2": {}
            },
            "jassi/ui/PropertyEditors/LoadingEditor.ts": {
                "date": 1613218544158
            },
            "jassi/ui/PropertyEditors/NameEditor.ts": {
                "date": 1613421352058,
                "jassi.ui.PropertyEditors.NameEditor": {
                    "$PropertyEditor": [
                        [
                            "*name*"
                        ]
                    ]
                }
            },
            "jassi/ui/Repeater.ts": {
                "date": 1613218544158,
                "jassi.ui.Repeater": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Repeater",
                            "icon": "mdi mdi-locker-multiple",
                            "editableChildComponents": [
                                "this",
                                "design"
                            ]
                        }
                    ]
                }
            },
            "jassi/ui/SearchExplorer.ts": {
                "date": 1613218609627,
                "jassi.ui.SearchExplorer": {}
            },
            "jassi/ui/Select.ts": {
                "date": 1613338080789,
                "jassi.ui.SelectCreateProperties": {},
                "jassi.ui.Select": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Select",
                            "icon": "mdi mdi-form-dropdown"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassi.ui.SelectCreateProperties"
                        }
                    ]
                }
            },
            "jassi/ui/Style.ts": {
                "date": 1613218544157,
                "jassi.ui.Style": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Style",
                            "icon": "mdi mdi-virus"
                        }
                    ]
                }
            },
            "jassi/ui/Table.ts": {
                "date": 1614285087403,
                "jassi.ui.TableEditorProperties": {},
                "jassi.ui.Table": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Table",
                            "icon": "mdi mdi-grid"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassi.ui.TableEditorProperties"
                        }
                    ]
                }
            },
            "jassi/ui/Textarea.ts": {
                "date": 1614023973946,
                "jassi.ui.Textarea": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textarea",
                            "icon": "mdi mdi-text-box-outline"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassi/ui/Textbox.ts": {
                "date": 1614029152611,
                "jassi.ui.Textbox": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Textbox",
                            "icon": "mdi mdi-form-textbox"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "string"
                        }
                    ]
                }
            },
            "jassi/ui/Tree.ts": {
                "date": 1614961346455,
                "jassi.ui.TreeEditorPropertiesMulti": {},
                "jassi.ui.TreeEditorProperties": {},
                "jassi.ui.Tree": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Tree",
                            "icon": "mdi mdi-file-tree"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "new",
                            "type": "json",
                            "componentType": "jassi.ui.TreeEditorProperties"
                        }
                    ]
                }
            },
            "jassi/ui/Upload.ts": {
                "date": 1613218544157,
                "jassi.ui.Upload": {
                    "$UIComponent": [
                        {
                            "fullPath": "common/Upload",
                            "icon": "mdi mdi-cloud-upload-outline"
                        }
                    ]
                }
            },
            "jassi/ui/VariablePanel.ts": {
                "date": 1613914326592,
                "jassi.ui.VariablePanel": {}
            },
            "jassi/util/Cookies.ts": {
                "date": 1611783871704
            },
            "jassi/util/CSVImport.ts": {
                "date": 1615844053088,
                "jassi.util.CSVImport": {
                    "$ActionProvider": [
                        "jassi.base.ActionNode"
                    ]
                }
            },
            "jassi/util/DatabaseSchema.ts": {
                "date": 1615318935612
            },
            "jassi/util/Reloader.ts": {
                "date": 1615324259508,
                "jassi.util.Reloader": {}
            },
            "jassi/util/Tools.ts": {
                "date": 1613218544160,
                "jassi.util.Tools": {}
            }
        }
    };
});
define("jassi/base/ActionNode", ["require", "exports", "jassi/remote/Jassi"], function (require, exports, Jassi_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionNode = void 0;
    let ActionNode = class ActionNode {
    };
    ActionNode = __decorate([
        Jassi_2.$Class("jassi.base.ActionNode")
    ], ActionNode);
    exports.ActionNode = ActionNode;
});
define("jassi/base/Actions", ["require", "exports", "jassi/remote/Registry", "jassi/remote/Jassi", "jassi/remote/Classes"], function (require, exports, Registry_1, Jassi_3, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Actions = exports.$ActionProvider = exports.$Action = exports.$Actions = exports.ActionProperties = void 0;
    class ActionProperties {
    }
    exports.ActionProperties = ActionProperties;
    /**
     * usage
     * @$Actions()
     * static test():ActionProperties[]{
     * }
     */
    function $Actions() {
        return function (target, propertyKey, descriptor) {
            Registry_1.default.registerMember("$Actions", target, propertyKey);
        };
    }
    exports.$Actions = $Actions;
    function $Action(property) {
        return function (target, propertyKey, descriptor) {
            Registry_1.default.registerMember("$Action", target, propertyKey, property);
        };
    }
    exports.$Action = $Action;
    function $ActionProvider(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$ActionProvider", pclass);
        };
    }
    exports.$ActionProvider = $ActionProvider;
    let Actions = class Actions {
        static async getActionsFor(vdata) {
            var oclass = vdata[0].constructor;
            var ret = [];
            /*men.text = actions[x].name;
                    men.icon = actions[x].icon;
                    men.onclick(function (evt) {
                        ac.run([node]);
                    });*/
            var sclass = Classes_1.classes.getClassName(oclass);
            var allclasses = (await Registry_1.default.getJSONData("$ActionProvider")).filter(entr => entr.params[0] === sclass);
            await Registry_1.default.loadAllFilesForEntries(allclasses);
            let data = Registry_1.default.getData("$ActionProvider");
            for (let x = 0; x < allclasses.length; x++) {
                var entr = allclasses[x];
                var mem = Registry_1.default.getMemberData("$Action")[entr.classname];
                for (let name in mem) {
                    let ac = mem[name][0][0];
                    if (ac.isEnabled !== undefined && ((await ac.isEnabled(vdata)) === false))
                        continue;
                    ret.push({
                        name: ac.name,
                        icon: ac.icon,
                        call: ac.run ? ac.run : Classes_1.classes.getClass(entr.classname)[name]
                    });
                }
                mem = Registry_1.default.getMemberData("$Actions")[entr.classname];
                for (let name in mem) {
                    let acs = await Classes_1.classes.getClass(entr.classname)[name]();
                    for (let x = 0; x < acs.length; x++) {
                        let ac = acs[x];
                        if (ac.isEnabled !== undefined && ((await ac.isEnabled(vdata)) === false))
                            continue;
                        ret.push({
                            name: ac.name,
                            icon: ac.icon,
                            call: ac.run
                        });
                    }
                }
            }
            return ret;
        }
    };
    Actions = __decorate([
        Jassi_3.$Class("jassi.base.Actions")
    ], Actions);
    exports.Actions = Actions;
    async function test() {
    }
    exports.test = test;
});
define("jassi/base/Database", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/DBArray"], function (require, exports, Jassi_4, Classes_2, DBArray_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Database = void 0;
    var cl = Classes_2.classes; //force import
    let Database = class Database {
        /**
         * database service
         * @class jassi.base.Database
         */
        constructor() {
            /** @member {jassi.base.Database.TypeResolver} holds typedefinitions for each type
             *  use  typeDef[sclassname]
             */
            this.typeDef = new TypeResolver(this);
            /**
             * @member {Object.<string,{Object.<number,jassi.base.DBObject>}>} holds all known databaseobjects
             * cache[typename][id]=ob
             **/
            this.cache = {};
        }
        /**
         * clears the cache
         */
        clearCache() {
            for (var key in this.cache) {
                this.cache[key] = {};
            }
        }
        /**
         * registers a database class
         * @param {string} - the name of the class
         * @param {class} - the class
         */
        register(name, data) {
            var cl = Classes_2.classes.getClass(name);
            cl.prototype._dbtype = name;
            this.typeDef.addClass(cl);
            this.cache[name] = {};
        }
        /**
         * uploads the type definition to the server
         * @param {jassi.base.Database.Type} the type definition
         */
        async uploadType(definition) {
            var sdef = JSON.stringify(definition, undefined, "\t");
            return Jassi_4.default.server.call("uploadType", sdef);
        }
        /**
         * reloads a database object
         * @param {DBObject} objectToReload - the object to reload
         * @returns {jassi.base.DBObject} - the reloaded object
         */
        async reload(objectToReload) {
            var type = objectToReload.__proto__._dbtype;
            var ret = await this.query(type, "id=" + objectToReload.id);
            if (ret.length > 0)
                return ret[0];
        }
        /**
         * loads a object from db
         * @param {string} type - the typename
         * @param {int} id - the id of the object, load all if undefined
         * @param [{string}] resolveFields - the fields to resolve
         * @returns {jassi.base.DBObject}
         */
        async load(type, id, resolveFields = undefined) {
            var sid = "id>0";
            if (id !== undefined)
                sid = "id=" + id;
            if (resolveFields === undefined)
                resolveFields = [];
            for (var x = 0; x < resolveFields.length; x++) { //add .this
                resolveFields[x] = (resolveFields[x].startsWith("this.") ? "" : "this.") + resolveFields[x];
            }
            var ret = await this.query(type, sid, resolveFields);
            if (id !== undefined)
                return (ret.length > 0) ? ret[0] : null;
            return ret;
        }
        /**
         * Child objects are not loaded completly. This loads the object completly.
         * @param {jassi.base.DBObject} ob - the object to resolve
         * @returns {jassi.base.DBObject|jassi.base.DBArray}
         */
        async resolve(ob) {
            if (ob !== undefined) {
                if (ob.unresolvedclassname !== undefined) {
                    var ret = await this._getMember(ob.parent, ob.member, ob.unresolvedclassname, ob.id);
                    //set linked object
                    /*        var link=this.typeDef.linkForField(ob.parent.__proto__._dbtype,ob.member);
                            
                            if(link!==undefined&&this.getTypeDef(ob.parent.__proto__._dbtype)[ob.member].type==="array"&&
                                     link.type!="array"){//array can not connected){
                                for(var x=0;x<ret.length;x++){
                                    var aob=ret[x];
                                    
                                    aob["_"+link.name]=ob.parent;
                                }
                            }else if(link!==undefined&&link.type==="object"){
                                ret["_"+link.name]=ob.parent;
                            }
                                */
                    if (ret instanceof DBArray_1.DBArray) {
                    }
                    return ret;
                }
                else
                    return ob;
            }
            //if(ob)
        }
        /**
         * Child objects are not loaded completly. This loads a object member of a object.
         * @param {DBObject} ob - the object
         * @param {string} member - the name of the member to load
         * @param {string} memberclassname - the typename of the member
         * @param {int|string} ids - the id or the ids (comma separated) e.g. id1,id2,id3
         * @returns {DBObject} - the resolved member
         */
        async _getMember(ob, member, memberclassname, ids) {
            if (ids === undefined || ids === null) {
                var data = {
                    id: ob.id,
                    type: ob.__proto__._dbtype,
                    member: member
                };
                var sret = await Jassi_4.default.server.call("getMember", data);
                var obret = await this._fromJSON(memberclassname, sret);
                return obret;
            }
            //we only need to expand ids
            var def = this.typeDef.getTypeDef(ob.__proto__._dbtype);
            var field = def[member];
            if (field.type === "object") {
                var test = db.cache[memberclassname][ids];
                if (test !== undefined)
                    return test;
                return (await this.query(memberclassname, "id in (" + ids + ")"))[0];
            }
            if (field.type === "array") {
                var ret = new Jassi_4.default.base.DBArray();
                var vids = ids.split(",");
                var idsToResolve = "";
                for (var x = 0; x < vids.length; x++) {
                    var test = db.cache[memberclassname][vids[x]];
                    if (test !== undefined)
                        ret.add(test);
                    else { //resolve
                        var T = Classes_2.classes.getClass(memberclassname);
                        ob = new T();
                        idsToResolve = idsToResolve + (idsToResolve === "" ? "" : ",") + vids[x];
                        this.cache[memberclassname][vids[x]] = ob;
                        ret.add(ob); //will be filled with cache
                    }
                }
                if (idsToResolve !== "")
                    await this.query(memberclassname, "id in (" + idsToResolve + ")")[0]; //would be resolved with cache
                return ret;
            }
            //var sret=jassi.server.call("getMember",data);
            //var obret= this._fromJSON(memberclassname,sret);
            return obret;
        }
        /**
         * createObjects from returned json array retObs
         */
        _createObjects(type, retObs, resolvedFields) {
            var ret = new Jassi_4.default.base.DBArray();
            for (var x = 0; x < retObs.length; x++) {
                var props = retObs[x];
                var ob = this.cache[type][props["id"]];
                if (ob === undefined) {
                    var T = Classes_2.classes.getClass(type);
                    ob = new T();
                    this.cache[type][props["id"]] = ob;
                }
                //all returned relations are set to null
                for (var f = 0; f < resolvedFields.length; f++) {
                    ob._setObjectProperty(resolvedFields[f], null);
                }
                for (var prop in props) {
                    // var prop=props[y];
                    var data = props[prop];
                    /*if(data!==null&&data.unresolvedclassname!==undefined){
                        var def= this.typeDef.getTypeDef(type);
                        var field=def[prop];
    
                        if(field.type==="object"){
                            var iscached=this.cache[field.usertype][data["id"]];
                            if(iscached!==undefined){
                                 ob._setObjectProperty(prop,iscached);
                                 continue;
                             }
                         }
                         data.parent=ob;
                         data.member=prop;
                         data.id=data["id"];
                         data.resolve=async function(){
                             var res=await jassi.db.resolve(this);
                             this.parent._setObjectProperty(this.member,res);
                             ret=this.parent._objectProperties[this.member];
                             return ret;
                         }
                         data.resolve.bind(data);
                         ob._setObjectProperty(prop,data);
                        
    
                    }else*/
                    ob[prop] = data;
                }
                ret.push(ob);
            }
            return ret;
        }
        /**
         * loads an object from a jsonstring
         * @param {string} type - the name of the type
         * @param {string} json - the json string
         * @returns {jassi.base.DBObject}
         */
        async _fromJSON(type, json) {
            //   if(json==undefined)
            //       return null;
            var data = JSON.parse(json);
            var retOb = data.result;
            var retObs = retOb;
            var resolvedFields = [];
            var allResolvedFields = [];
            for (var cl in data.relations) {
                for (var field in data.relations[cl]) {
                    var sfield = field.split(".")[1];
                    if (resolvedFields.indexOf(sfield) === -1)
                        resolvedFields.push(sfield);
                }
                allResolvedFields.push(field);
            }
            var ret = this._createObjects(type, retObs, resolvedFields);
            for (var cl in data.resolvedObjects) {
                resolvedFields = [];
                var arr = data.resolvedObjects[cl];
                var rels = data.relations[cl];
                //calc object members for the class which we would modify 
                for (var rel in rels) {
                    for (var test = 0; test < allResolvedFields.length; test++) {
                        if (allResolvedFields[test].indexOf(rel + ".") !== -1) {
                            var toAdd = allResolvedFields[test].substring((rel + ".").length);
                            toAdd = toAdd.split(".")[0];
                            if (resolvedFields.indexOf(toAdd) === -1) {
                                resolvedFields.push(toAdd);
                            }
                        }
                    }
                }
                this._createObjects(cl, arr, resolvedFields);
            }
            //setup relations
            for (var cl in data.relations) {
                for (var ffield in data.relations[cl]) {
                    var _field = ffield.split(".");
                    field = _field[field.length - 1];
                    var rels = data.relations[cl][ffield];
                    for (var id in rels) {
                        var ob = this.cache[cl][Number(id)];
                        var def = this.typeDef.getTypeDef(cl);
                        var ofield = def[field];
                        var fieldtype = ofield.usertype;
                        if (ofield.type === "object") {
                            var mob = this.cache[fieldtype][Number(rels[id])];
                            ob._setObjectProperty(field, mob);
                        }
                        else {
                            var arr = new Jassi_4.default.base.DBArray();
                            var adata = rels[id];
                            for (var x = 0; x < adata.length; x++) {
                                var mob = this.cache[fieldtype][Number(adata[x])];
                                arr.add(mob);
                            }
                            ob._setObjectProperty(field, arr);
                        }
                    }
                }
            }
            if (retOb.length === undefined)
                return ret[0];
            return ret;
        }
        /**
         * executes a database query
         * @param {string} type - the name of the returned type
         * @param {type} query - the query string
         * @param [{string}] resolveFields - the fields to resolve
         * @returns {jassi.base.DBArray}
         */
        async query(type, query, resolveFields = undefined) {
            var parameter = {
                type: type,
                resolve: resolveFields
            };
            var sret = await Jassi_4.default.server.call("query", query, parameter);
            var ret = await this._fromJSON(type, sret);
            return ret;
        }
        /**
         * save the object to database
         * @param {jassi.base.DBObject} ob - the object to save
         */
        async save(ob) {
            var parameter = { type: ob.__proto__._dbtype };
            var toSave = { id: ob.id };
            var type = this.typeDef.getTypeDef(ob.__proto__._dbtype);
            var test = this.cache[ob.__proto__._dbtype][ob.id];
            if (test !== undefined && test !== ob)
                throw "only one persistent instance could saved! Use reload to get the previous persistent instance";
            for (var member in type) {
                var field = type[member];
                if (member === "linkedfields" || member === "name" || member === "fields" || member === "_classname")
                    continue;
                if (field.type === "object") {
                    if (ob._objectProperties[member] !== undefined && ob._objectProperties[member].unresolvedclassname !== undefined)
                        continue; //member was not resolved so ignore it
                    if (ob[member] === undefined || ob[member] === null) {
                        toSave[member] = null;
                    }
                    else
                        toSave[member] = { id: ob[member].id };
                }
                else if (field.type === "array") {
                    if (ob._objectProperties[member] !== undefined && ob._objectProperties[member].unresolvedclassname !== undefined)
                        continue; //member was not resolved so ignore it
                    var arr = ob[member];
                    if (ob[member] === undefined || ob[member] === null) {
                        toSave[member] = null;
                        continue;
                    }
                    toSave[member] = [];
                    for (var x = 0; x < arr.length; x++) {
                        var child = arr[x];
                        toSave[member].push({ id: child.id });
                    }
                }
                else if (field.type === "int" || field.type === "string")
                    toSave[member] = ob[member];
                else {
                    throw "member " + field.name + "type can not be saved " + field.type;
                }
            }
            var sob = JSON.stringify(toSave, undefined, "\t");
            var ret = await Jassi_4.default.server.call("save", sob, parameter);
            if (!$.isNumeric(ret))
                throw ret;
            ob.id = Number(ret);
            this.cache[ob.__proto__._dbtype][ob.id] = ob;
            $.notify("saved", "info", { position: "right" });
        }
        /**
         * deletes an object in the database
         * @param {jassi.base.DBObject} ob - the object to remove
         */
        async remove(ob) {
            var parameter = { type: ob.__proto__._dbtype };
            return await Jassi_4.default.server.call("remove", { id: ob.id }, parameter);
        }
    };
    Database = __decorate([
        Jassi_4.$Class("jassi.base.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    exports.Database = Database;
    let TypeResolver = class TypeResolver {
        /**
         * database definition of database classes
         * @class jassi.base.Database.TypeResolver
         */
        constructor(db) {
            this.db = db;
        }
        /**
         * adds a class to resolver
         * @param {class} thisclass - the class to add
         */
        addClass(thisclass) {
            return;
            var classname = thisclass.prototype._dbtype;
            var sclassname = classname.replaceAll(".", "_");
            //var def=JSON.parse(ret.responseText);
            this[sclassname] = new Type(sclassname);
            var fields = thisclass._fields;
            for (var x = 0; x < fields.length; x++) {
                var jf = fields[x];
                var field = new Field(jf.name, jf.type, jf.usertype, jf.link);
                this[sclassname][field.name] = field;
                if (field.link !== undefined) {
                    this[sclassname].linkedfields[field.link] = field;
                }
            }
        }
        /**
        * types are linked if they
        * gets the linked for a field
        *
        */
        linkForField(classname, field) {
            var link = this.getTypeDef(classname)[field].link;
            if (link === undefined) {
                var test = this.getTypeDef(classname)[field].usertype;
                test = this.getTypeDef(test).linkedfields[classname + "." + field];
                if (test !== undefined) {
                    return test;
                }
            }
            else {
                var stypename = link.substring(0, link.lastIndexOf("."));
                var sfield = link.substring(link.lastIndexOf(".") + 1, link.length);
                return this.getTypeDef(stypename)[sfield];
            }
            return undefined;
        }
        getTypeDef(classname) {
            var sclassname = classname.replaceAll(".", "_");
            if (this[sclassname] === undefined) {
                //var def=JSON.parse(ret.responseText);
                this[sclassname] = new Jassi_4.default.base.Database.Type(sclassname);
                debugger;
                alert("is the next line right?");
                var def = this[sclassname];
                for (var x = 0; x < def.fields.length; x++) {
                    var jf = def.fields[x];
                    var field = new Jassi_4.default.base.Database.Field(jf.name, jf.type, jf.usertype, jf.link);
                    this[sclassname][field.name] = field;
                    if (field.link !== undefined) {
                        this[sclassname].linkedfields[field.link] = field;
                    }
                }
            }
            return this[sclassname];
        }
    };
    TypeResolver = __decorate([
        Jassi_4.$Class("jassi.base.Database.TypeResolver"),
        __metadata("design:paramtypes", [Object])
    ], TypeResolver);
    let Type = class Type {
        /**
     * type definition of database class
     * @class jassi.base.Database.Type
     */
        constructor(name) {
            /**
             * @member {string} - the name of the type
             */
            this.name = name;
            /**
             * @member {[jassi.base.Database.Field]} - the persistent fields
             */
            this.fields = undefined;
            /**
             * all linked fields
             * @member {Object.<string,jassi.base.Database.Field>} [classname+"."+field]
             */
            this.linkedfields = {};
        }
    };
    Type = __decorate([
        Jassi_4.$Class("jassi.base.Database.Type"),
        __metadata("design:paramtypes", [Object])
    ], Type);
    let Field = class Field {
        /**
     * type definition of database field
     * @class jassi.base.Database.Field
     */
        constructor(name, type, usertype, link) {
            /**
             * @member {string} - the name of the field
             */
            this.name = name;
            /**
             * @member {string} - the database type
             * oneof string,int,object,array
             */
            this.type = type;
            /**
             * @member {string} - must be defined by type array and object
             */
            this.usertype = usertype;
            /**
             * @member {string} - the type and fieldname of the linked field [type.member]
             * The field is linked to an other field and has no own sql-table.
             * e.g.  Customer.invoices  could be linked to Invoice.customer
             * Links can be set between fields of type array or object of the own or a different classes.
             * If two fields are linked - the link must be set on only one field.
             */
            this.link = link;
        }
    };
    Field = __decorate([
        Jassi_4.$Class("jassi.base.Database.Field"),
        __metadata("design:paramtypes", [Object, Object, Object, Object])
    ], Field);
    var db = new Database();
    exports.default = db;
    Jassi_4.default.test = async function () {
        var all = await db.load("de.Kunde", undefined, ["rechnungen", "rechnungen.zeilen", "rechnungen.zeilen.ar"]);
        //var all=await jassi.db.load("de.ARZeile",undefined,["ar"]);
        all = all;
        //jassi.server.call("testQuery");
    };
});
define("jassi/base/DatabaseSchema", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry", "jassi_editor/util/Typescript", "jassi_editor/util/Parser", "jassi/template/TemplateDBObject", "jassi/util/Tools", "jassi/remote/Server", "jassi/base/Windows", "jassi/ui/OptionDialog", "jassi/ext/jquery.choosen"], function (require, exports, Jassi_5, Registry_2, Typescript_1, Parser_1, TemplateDBObject_1, Tools_1, Server_1, Windows_1, OptionDialog_1) {
    "use strict";
    var DatabaseSchema_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.DatabaseSchema = exports.DatabaseClass = exports.DatabaseField = void 0;
    class DatabaseField {
        get nullable() {
            var _a;
            return (_a = this.properties) === null || _a === void 0 ? void 0 : _a.nullable;
        }
        set nullable(value) {
            if (value === undefined) {
                if (this.properties)
                    delete this.properties.nullable;
                return;
            }
            if (DatabaseSchema.basicdatatypes.indexOf(this.type) === -1 || this.relation) {
                if (value === undefined)
                    return;
                throw "This field could not be nullable";
            }
            if (this.properties === undefined)
                this.properties = {};
            this.properties.nullable = value;
        }
        getReverseField() {
            if (this.inverseSide && this.inverseSide !== "") {
                if (this.inverseSide.indexOf(".") === -1)
                    return undefined;
                var sp = this.inverseSide.split(".");
                var clname = this.type.replace("[]", "");
                var cl = this.parent.parent.getClass(clname);
                if (!cl)
                    return undefined;
                return cl.getField(sp[1]);
            }
            return undefined;
        }
        /**
         * looks possible relations in the type class
         **/
        getPossibleRelations() {
            if (this.name === "id")
                return ["PrimaryColumn", "PrimaryGeneratedColumn"];
            if (!this.type || DatabaseSchema.basicdatatypes.indexOf(this.type) >= 0)
                return [];
            var values = [];
            if (this.type.endsWith("[]")) {
                values = ["", "OneToMany", "ManyToMany"];
            }
            else
                values = ["", "OneToOne", "ManyToOne"];
            var cl = this.type.replace("[]", "");
            var parentcl = this.parent.name;
            var relclass = this.parent.parent.getClass(cl);
            for (var x = 0; x < relclass.fields.length; x++) {
                var relfield = relclass.fields[x];
                if (this.type.endsWith("[]")) {
                    if (relfield.type === parentcl) {
                        //OneToMany
                        values.push("e." + relfield.name);
                    }
                    if (relfield.type === (parentcl + "[]")) {
                        //ManyToMany
                        values.push("e." + relfield.name);
                        values.push("e." + relfield.name + "(join)");
                    }
                }
                else {
                    if (relfield.type === parentcl) {
                        //OneToOne
                        values.push("e." + relfield.name);
                        values.push("e." + relfield.name + "(join)");
                    }
                    if (relfield.type === (parentcl + "[]")) {
                        //ManyToOne
                        values.push("e." + relfield.name);
                    }
                }
            }
            return values;
        }
        get relationinfo() {
            if (this.relation === "OneToOne" || this.relation === "ManyToMany" || this.relation === "ManyToOne" || this.relation === "OneToMany") {
                if (this.inverseSide) {
                    return this.inverseSide + (this.join ? "(join)" : "");
                }
                else {
                    return this.relation;
                }
            }
            else if (this.relation === "PrimaryColumn" || this.relation === "PrimaryGeneratedColumn")
                return this.relation;
            else
                return undefined;
        }
        set relationinfo(value) {
            var _a;
            if (value === "")
                value = undefined;
            if (value === undefined) {
                this.relation = undefined;
                //  return;
            }
            if (value === "PrimaryColumn" || value === "PrimaryGeneratedColumn") {
                if (this.name === "id")
                    this.relation = value;
                return;
            }
            if (value === undefined || value === "OneToOne" || value === "ManyToMany" || value === "ManyToOne" || value === "OneToMany") {
                var old = this.getReverseField();
                if (old !== undefined)
                    old.inverseSide = undefined; //delete the relation on the reverse side
                this.relation = value;
                this.inverseSide = undefined;
            }
            else {
                var oval = value;
                if (oval.endsWith("(join)")) {
                    oval = oval.replace("(join)", "");
                    this.join = true;
                }
                else
                    this.join = false;
                this.inverseSide = oval;
                var rfield = this.getReverseField();
                if (rfield === undefined) {
                    this.inverseSide = undefined;
                    throw Error("relation not found");
                }
                //set the relation on the reverse side
                if (!((_a = rfield.inverseSide) === null || _a === void 0 ? void 0 : _a.endsWith("." + this.name)))
                    rfield.inverseSide = "e." + this.name;
                if (this.type.endsWith("[]")) {
                    if (rfield.type.endsWith("[]")) {
                        this.relation = "ManyToMany";
                        //sets the join in the other
                        rfield.join = !this.join;
                    }
                    else {
                        this.relation = "OneToMany";
                    }
                }
                else {
                    if (rfield.type.endsWith("[]")) {
                        this.relation = "ManyToOne";
                    }
                    else {
                        this.relation = "OneToOne";
                        //sets the join in the other
                        rfield.join = !this.join;
                    }
                }
            }
        }
    }
    exports.DatabaseField = DatabaseField;
    class DatabaseClass {
        constructor() {
            this.fields = [];
        }
        getField(name) {
            for (var x = 0; x < this.fields.length; x++) {
                var cl = this.fields[x];
                if (cl.name === name)
                    return cl;
            }
            ;
            return undefined;
        }
    }
    exports.DatabaseClass = DatabaseClass;
    var classnode = undefined;
    let DatabaseSchema = DatabaseSchema_1 = class DatabaseSchema {
        constructor() {
            this.databaseClasses = [];
        }
        getClass(name) {
            for (var x = 0; x < this.databaseClasses.length; x++) {
                var cl = this.databaseClasses[x];
                if (cl.name === name)
                    return cl;
            }
            ;
            return undefined;
        }
        //type => ARZeile
        getFulltype(type, parsedClass) {
            var pos = type.lastIndexOf(">");
            if (pos > -1)
                type = type.substring(pos + 1).trim();
            var file = parsedClass.parent.imports[type];
            if (type === parsedClass.name)
                return parsedClass;
            var ret = this.definedImports[type + "|" + file];
            if (!ret) {
                throw Error("Import not found " + parsedClass.fullClassname + " : " + type);
            }
            return ret;
        }
        createDBClass(cl) {
            var scode = TemplateDBObject_1.TemplateDBObject.code.replaceAll("{{fullclassname}}", cl.name);
            var file = cl.name.replaceAll(".", "/") + ".ts";
            file = file.substring(0, file.indexOf("/")) + "/remote" + "/" + file.substring(file.indexOf("/") + 1);
            cl.filename = file;
            cl.simpleclassname = cl.name.split(".")[cl.name.split(".").length - 1];
            scode = scode.replaceAll("{{classname}}", cl.simpleclassname);
            scode = scode.replaceAll("{{PrimaryAnnotator}}", "@" + cl.getField("id").relation + "()");
            var parser = new Parser_1.Parser();
            parser.parse(scode);
            for (var key in parser.classes) {
                var pclass = parser.classes[key];
                pclass["filename"] = file;
                if (pclass.decorator["$DBObject"]) {
                    //var dbclass=pclass.decorator["$Class"].param[0];
                    this.parsedClasses[pclass.fullClassname] = pclass;
                    this.definedImports[pclass.name + "|" + file.substring(0, file.length - 3)] = pclass;
                }
            }
        }
        createDBField(field, dbcl) {
            var _a;
            var decs = {};
            if ((field.join || field.inverseSide === undefined || field.inverseSide === "") && field.relation === "OneToOne")
                decs["JoinColumn"] = { name: "JoinColumn", parameter: [] };
            if ((field.join || field.inverseSide === undefined || field.inverseSide === "") && field.join && field.relation === "ManyToMany")
                decs["JoinTable"] = { name: "JoinTable", parameter: [] };
            var realtype = field.type;
            var realprops = field.properties;
            if (field.type === "decimal") {
                realtype = "number";
                if (!realprops)
                    realprops = {};
                realprops.type = "decimal";
            }
            if (field.type === "int")
                realtype = "number";
            var s = realprops ? (_a = Tools_1.Tools.objectToJson(realprops, undefined, false)) === null || _a === void 0 ? void 0 : _a.replaceAll("\n", "") : undefined;
            var p = undefined;
            if (!field.relation || field.relation === "") {
                if (s)
                    p = [s];
                decs["Column"] = { name: "Column", parameter: p };
            }
            else if (field.relation === "PrimaryColumn" || field.relation === "PrimaryGeneratedColumn") {
                if (s)
                    p = [s];
                decs[field.relation] = { name: field.relation, parameter: p };
            }
            else {
                var params = [];
                var tcl = field.type.replace("[]", "");
                realtype = this.getClass(tcl).simpleclassname;
                if (dbcl.name !== tcl)
                    this.parsedClasses[dbcl.name].parent.addImportIfNeeded(realtype, this.getClass(tcl).filename.substring(0, this.getClass(tcl).filename.length - 3));
                let scl = tcl;
                if (scl.indexOf(".") > -1) {
                    scl = scl.substring(scl.lastIndexOf(".") + 1);
                }
                params.push("type => " + scl);
                if (field.inverseSide && field.inverseSide !== "")
                    params.push(field.inverseSide);
                if (s)
                    params.push(s);
                decs[field.relation] = { name: field.relation, parameter: params };
            }
            this.parsedClasses[dbcl.name].parent.addOrModifyMember({ name: field.name, type: realtype, decorator: decs }, this.parsedClasses[dbcl.name]);
        }
        async reloadCodeInEditor(file, text) {
            var editor = Windows_1.default.findComponent("jassi_editor.CodeEditor-" + file);
            if (editor !== undefined) {
                if (editor._codeToReload === undefined) {
                    var data = await OptionDialog_1.OptionDialog.show("The source was updated in Chrome. Do you want to load this modification?", ["Yes", "No"], editor, false);
                    if (data.button === "Yes")
                        editor.value = text;
                    delete editor._codeToReload;
                }
            }
        }
        async updateSchema(onlyPreview = false) {
            var _a;
            ///todo wenn kein basicfieldtype muss eine Beziehung hinterlegt sein throw Error
            var changes = "";
            var org = new DatabaseSchema_1();
            await org.loadSchemaFromCode();
            var modifiedclasses = [];
            //check relations
            for (var x = 0; x < this.databaseClasses.length; x++) {
                var dbcl = this.databaseClasses[x];
                for (var y = 0; y < dbcl.fields.length; y++) {
                    let f = dbcl.fields[y];
                    if (DatabaseSchema_1.basicdatatypes.indexOf(f.type) === -1 && (f.relation === undefined || f.relation === ""))
                        throw Error("Relation must be filled " + dbcl.name + " field " + f.name);
                }
            }
            for (var x = 0; x < this.databaseClasses.length; x++) {
                var dbcl = this.databaseClasses[x];
                if (org.getClass(dbcl.name) === undefined) {
                    changes += "create class " + dbcl.name + "\n";
                    modifiedclasses.push(dbcl);
                    if (!onlyPreview) {
                        this.createDBClass(dbcl);
                    }
                }
                for (var y = 0; y < dbcl.fields.length; y++) {
                    var field = dbcl.fields[y];
                    var forg = (_a = org.getClass(dbcl.name)) === null || _a === void 0 ? void 0 : _a.getField(field.name);
                    if (org.getClass(dbcl.name) === undefined || forg === undefined) {
                        changes += "create field " + dbcl.name + ": " + field.name + "\n";
                        if (modifiedclasses.indexOf(dbcl) === -1)
                            modifiedclasses.push(dbcl);
                        if (!onlyPreview) {
                            this.createDBField(field, dbcl);
                        }
                    }
                    else {
                        var jfield = JSON.stringify(field.properties);
                        var jorg = JSON.stringify(forg.properties);
                        var fieldjoin = field.join;
                        if (fieldjoin === false)
                            fieldjoin = undefined;
                        if (field.type !== forg.type || field.inverseSide !== forg.inverseSide || field.relation !== forg.relation || jfield !== jorg || fieldjoin !== forg.join) {
                            changes += "modify deorator field " + dbcl.name + ": " + field.name + "\n";
                            if (modifiedclasses.indexOf(dbcl) === -1)
                                modifiedclasses.push(dbcl);
                            if (!onlyPreview) {
                                this.createDBField(field, dbcl);
                            }
                        }
                    }
                }
            }
            var files = [];
            var contents = [];
            if (!onlyPreview) {
                for (var x = 0; x < modifiedclasses.length; x++) {
                    var mcl = modifiedclasses[x];
                    var text = this.parsedClasses[mcl.name].parent.getModifiedCode();
                    files.push(mcl.filename);
                    contents.push(text);
                    console.log(mcl.filename + "\n");
                    console.log(text + "\n");
                }
                try {
                    await new Server_1.Server().saveFiles(files, contents);
                    for (var y = 0; y < files.length; y++)
                        await this.reloadCodeInEditor(files[y], contents[y]);
                }
                catch (perr) {
                    alert(perr.message);
                }
            }
            return changes;
        }
        async parseFiles() {
            this.parsedClasses = {};
            this.definedImports = {};
            var data = await Registry_2.default.getJSONData("$DBObject");
            data.forEach((entr) => {
                var parser = new Parser_1.Parser();
                var file = entr.filename;
                var code = Typescript_1.default.getCode(file);
                if (code !== undefined) {
                    try {
                        parser.parse(code);
                    }
                    catch (err) {
                        console.error("error in parsing " + file);
                        throw err;
                    }
                    for (var key in parser.classes) {
                        var pclass = parser.classes[key];
                        pclass["filename"] = file;
                        if (pclass.decorator["$DBObject"]) {
                            //var dbclass=pclass.decorator["$Class"].param[0];
                            this.parsedClasses[pclass.fullClassname] = pclass;
                            this.definedImports[pclass.name + "|" + file.substring(0, file.length - 3)] = pclass;
                        }
                    }
                }
            });
        }
        async loadSchemaFromCode() {
            await this.parseFiles();
            //await registry.loadAllFilesForService("$DBObject")
            var data = Registry_2.default.getJSONData("$DBObject");
            this.databaseClasses = [];
            var _this = this;
            (await data).forEach((entr) => {
                var dbclass = new DatabaseClass();
                dbclass.name = entr.classname;
                dbclass.parent = _this;
                this.databaseClasses.push(dbclass);
                var pclass = this.parsedClasses[entr.classname];
                dbclass.filename = pclass["filename"];
                dbclass.simpleclassname = pclass.name;
                dbclass.name = pclass.fullClassname;
                for (var fname in pclass.members) {
                    var pfield = pclass.members[fname];
                    if (!pfield.decorator["Column"] && !pfield.decorator["PrimaryColumn"] && !pfield.decorator["PrimaryGeneratedColumn"] && !pfield.decorator["OneToOne"] && !pfield.decorator["ManyToOne"] && !pfield.decorator["OneToMany"] && !pfield.decorator["ManyToMany"])
                        continue;
                    var field = new DatabaseField();
                    field["parent"] = dbclass;
                    field.name = fname;
                    dbclass.fields.push(field);
                    var meta = pfield.decorator;
                    if (meta["PrimaryColumn"]) {
                        field.relation = "PrimaryColumn";
                    }
                    else if (meta["PrimaryGeneratedColumn"]) {
                        field.relation = "PrimaryColumn";
                    }
                    else if (meta["Column"]) {
                        field.relation = undefined;
                        //var mt=mtype[0][0];
                        if (meta["Column"].parameter.length > 0 && meta["Column"].parameter.length > 0) {
                            field.properties = meta["Column"].parsedParameter[0];
                        }
                    }
                    else if (meta["ManyToOne"]) {
                        field.relation = "ManyToOne";
                        if (meta["ManyToOne"].parameter.length > 0) {
                            for (var x = 0; x < meta["ManyToOne"].parameter.length; x++) {
                                let vd = meta["ManyToOne"].parameter[x];
                                if (x === 0) {
                                    field.type = this.getFulltype(meta["ManyToOne"].parameter[0], pclass).fullClassname;
                                }
                                else {
                                    if (!meta["ManyToOne"].parameter[x].startsWith("{")) {
                                        field.inverseSide = vd.split(">")[1].trim();
                                    }
                                    else {
                                        field.properties = meta["ManyToOne"].parsedParameter[x];
                                    }
                                }
                            }
                        }
                    }
                    else if (meta["OneToMany"]) {
                        field.relation = "OneToMany";
                        if (meta["OneToMany"].parameter.length > 0) {
                            for (var x = 0; x < meta["OneToMany"].parameter.length; x++) {
                                let vd = meta["OneToMany"].parameter[x];
                                if (x === 0) {
                                    field.type = this.getFulltype(meta["OneToMany"].parameter[0], pclass).fullClassname + "[]";
                                }
                                else {
                                    if (!meta["OneToMany"].parameter[x].startsWith("{")) {
                                        field.inverseSide = vd.split(">")[1].trim();
                                    }
                                    else {
                                        field.properties = meta["OneToMany"].parsedParameter[x];
                                    }
                                }
                            }
                        }
                    }
                    else if (meta["ManyToMany"]) {
                        field.relation = "ManyToMany";
                        if (meta["ManyToMany"].parameter.length > 0) {
                            for (var x = 0; x < meta["ManyToMany"].parameter.length; x++) {
                                let vd = meta["ManyToMany"].parameter[x];
                                if (x === 0) {
                                    field.type = this.getFulltype(meta["ManyToMany"].parameter[0], pclass).fullClassname + "[]";
                                }
                                else {
                                    if (!meta["ManyToMany"].parameter[x].startsWith("{")) {
                                        field.inverseSide = vd.split(">")[1].trim();
                                    }
                                    else {
                                        field.properties = meta["ManyToMany"].parsedParameter[x];
                                    }
                                }
                            }
                        }
                        if (meta["JoinTable"])
                            field.join = true;
                    }
                    else if (meta["OneToOne"]) {
                        field.relation = "OneToOne";
                        if (meta["OneToOne"].parameter.length > 0) {
                            for (var x = 0; x < meta["OneToOne"].parameter.length; x++) {
                                let vd = meta["OneToOne"].parameter[x];
                                if (x === 0) {
                                    field.type = this.getFulltype(meta["OneToOne"].parameter[0], pclass).fullClassname;
                                }
                                else {
                                    if (!meta["OneToOne"].parameter[x].startsWith("{")) {
                                        field.inverseSide = vd.split(">")[1].trim();
                                    }
                                    else {
                                        field.properties = meta["OneToOne"].parsedParameter[x];
                                    }
                                }
                            }
                        }
                        if (meta["JoinColumn"])
                            field.join = true;
                    }
                    if (meta["PrimaryColumn"] || meta["PrimaryGeneratedColumn"] || meta["Column"]) {
                        var tp = pfield.type;
                        if (tp === "string")
                            field.type = "string";
                        else if (tp === "number")
                            field.type = "int";
                        else if (tp === "boolean")
                            field.type = "boolean";
                        else if (tp === "Date")
                            field.type = "Date";
                        else
                            throw new Error("type unknown " + dbclass.name + ":" + field.name);
                        if (field.properties !== undefined && field.properties["type"]) {
                            field.type = field.properties["type"];
                        }
                    }
                }
            });
        }
    };
    DatabaseSchema.basicdatatypes = ["string", "int", "decimal", "boolean", "Date"];
    DatabaseSchema = DatabaseSchema_1 = __decorate([
        Jassi_5.$Class("jassi.base.DatabaseSchema")
    ], DatabaseSchema);
    exports.DatabaseSchema = DatabaseSchema;
    /*
    @$Class("jassi.base.DatabaseColumnOptions")
    class ColumnOptions{
    //	@$Property({type:"string",chooseFrom:DatabaseSchema.basicdatatypes,description:"Column type. Must be one of the value from the ColumnTypes class."})
      //  type?: ColumnType;
        @$Property({description:"Indicates if column's value can be set to NULL.", default:false})
        nullable?: boolean;
        @$Property({type:"string",description:"Default database value."})
        default?: any;
        @$Property({description:"Indicates if column is always selected by QueryBuilder and find operations.",default:true})
        @$Property({description:'Column types length. Used only on some column types. For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).'})
        length?: number;
        [name:string]:any;
    }*/
    async function test() {
        var schema = new DatabaseSchema();
        await schema.loadSchemaFromCode();
        var schema2 = new DatabaseSchema();
        await schema2.loadSchemaFromCode();
        var test = new DatabaseClass();
        test.parent = schema2;
        test.name = "de.NeuerKunde";
        var testf = new DatabaseField();
        testf.name = "id";
        testf.type = "int";
        testf.relation = "PrimaryColumn";
        test.fields.push(testf);
        schema2.databaseClasses.push(test);
        var f = new DatabaseField();
        f.name = "hallo";
        f.type = "string";
        schema2.getClass("de.AR").fields.push(f);
        schema2.getClass("de.AR").getField("nummer").properties = { nullable: false };
        console.log(await schema2.updateSchema(true));
        //console.log(result);
        //test.pop();
        //schema.visitNode(sourceFile);
    }
    exports.test = test;
    async function test2() {
        var schema = new DatabaseSchema();
        await schema.loadSchemaFromCode();
        var h = schema.getClass("de.AR").getField("kunde");
        var f = h.getReverseField();
        var kk = f.relationinfo;
        debugger;
        f.relationinfo = kk;
    }
    exports.test2 = test2;
});
define("jassi/base/Errors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Errors = void 0;
    class Errors {
        /**
        * Error handling.
        * @class jassi.base.Error
        */
        constructor() {
            this.items = [];
            this.handler = {};
            var _this = this;
            Errors.errors = this;
            window.addEventListener("unhandledrejection", function (err) {
                _this.addError(err);
            });
            window.addEventListener("error", function (err) {
                _this.addError(err);
            });
            /* window.onerror =function(errorMsg, url, lineNumber, column, errorObj) {
                  var stack=(errorObj===null||errorObj===undefined)?"":errorObj.stack;
                  var s = 'Error: ' + errorMsg +
                                             ' Script: ' + url +
                                             ' (' + lineNumber +
                                             ', ' + column +
                                             '): ' +  stack+"->"+url;
                  var err={ errorMsg:errorMsg,url:url,lineNumber:lineNumber,column:column,errorObj:errorObj};
                 _this.addError(err);
                  console.error(s);
                  
                  if(orge!==null)
                  return orge(errorMsg, url, lineNumber, column, errorObj);
              }*/
            var org = console.log;
            console.log = function (ob) {
                org(ob);
                if (ob === undefined)
                    return;
                var logOb = { infoMsg: ob };
                _this.items.push(logOb);
                if (_this.items.count > 10) {
                    _this.items.splice(10, 1);
                }
                for (var key in _this.handler) {
                    _this.handler[key](logOb);
                }
            };
        }
        addError(err) {
            this.items.push(err);
            if (this.items.count > 20) {
                this.items.splice(20, 1);
            }
            for (var key in this.handler) {
                this.handler[key](err);
            }
        }
        /**
         * raise if error is thrown
         * @param {function} func - callback function
         * @param {string} [id] - the id of the component that registers the error
         */
        onerror(func, id) {
            if (id === undefined)
                id = Errors._randomID++;
            this.handler[id] = func;
        }
        /**
         * raise if error is thrown
         * @param {function} func - callback function
         * @param {string} [id] - the id of the component that registers the error
         */
        offerror(id) {
            delete this.handler[id];
        }
    }
    exports.Errors = Errors;
    Errors._randomID = 10000;
    ;
});
define("jassi/base/Extensions", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry"], function (require, exports, Jassi_6, Registry_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = void 0;
    class Extensions {
        constructor() {
            this.items = {};
        }
        /**
         * extend the class
         * @param {class} type - extend the type - add functions
         */
        extend(classname, classdef) {
            var exts = this.items[classname];
            if (exts !== undefined) {
                for (var alias in exts) {
                    var cl = exts[alias];
                    if (cl.extend) {
                        cl.extend(classdef);
                    }
                }
            }
        }
        async forFile(file) {
            var items = await Registry_3.default.getJSONData("extensions");
            return items[file];
        }
        /**
         * init the Extensions
         */
        init() {
            /*
            var config={
                paths:{},
                shim:{},
                map:{'*':{}}
            }

            var items=registry.get("extensions");
            for(var clname in items){
                var file=clname.replaceAll(".","/");
                config.paths[clname]=file;
                config.map["*"][file]=clname;
                
                var files=["jassi/jassi"];
                for(var f=0;f<items[clname].length;f++){
                    files.push("js/"+items[clname][f].file.replace(".ts",".js"));
                }
                config.shim[clname]=files;
            }*/
            //requirejs.config(config);
        }
        /**
         * extend an existing class
         * all methods and property where copied
         * @param {string} - the name of the class to extend
         * @param {class} - the class
         */
        register(name, extClass, alias) {
            if (alias === undefined)
                throw "Error Extension " + name + ": alias must be implemented";
            if (this.items[name] === undefined)
                this.items[name] = {};
            this.items[name][alias] = extClass;
        }
    }
    exports.Extensions = Extensions;
    var extensions = Jassi_6.default.extensions;
    exports.default = extensions;
});
define("jassi/base/LoginDialog", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.login = exports.doAfterLogin = void 0;
    var queue = [];
    function doAfterLogin(resolve, prot) {
        queue.push([resolve, prot]);
    }
    exports.doAfterLogin = doAfterLogin;
    var isrunning = false;
    async function check(dialog, win) {
        var test = (win.document && win.document.body) ? win.document.body.innerHTML : "";
        if (test.indexOf("{}") !== -1) {
            dialog.dialog("destroy");
            document.body.removeChild(dialog[0]);
            isrunning = false;
            for (var x = 0; x < queue.length; x++) {
                var data = queue[x];
                data[0](await data[1].call());
            }
            queue = [];
        }
        else {
            setTimeout(() => {
                check(dialog, win);
            }, 100);
        }
    }
    async function login() {
        if (isrunning)
            return;
        queue = [];
        isrunning = true;
        return new Promise((resolve) => {
            var fr = $(`
    <iframe src="/login.html" name="navigation"></iframe>
 `);
            document.body.appendChild(fr[0]);
            setTimeout(() => {
                if (!fr[0]["contentWindow"]) {
                    alert("no content window for login");
                }
                check(fr, fr[0]["contentWindow"]);
            }, 100);
            fr.dialog();
            /* var sform = `
             
             <form    action="javascript:alert(9);" method="post" class="" >
                 <input type="text" name="username" ><br>
                 <input type="password" name="password" ><br>
                  <button  class="LoginButton" type="button">Login</button>
             </form>
             
             `;
             var form = $(sform);
             form.submit("submit", function (e) {
                // e.preventDefault();
             });
             form.find(":button").on("click", () => {
                 //@ts-ignore
                 form.submit();
                 $.post({
                     url:"user/login",
                     data:"user=admin&password=j@ssi"
                 })
                 form.dialog("destroy");
             })
            
             document.body.appendChild(form[0]);
             var ret=form.dialog({
                 modal:true
             });
             return ret;
         });*/
        });
    }
    exports.login = login;
});
define("jassi/base/PropertyEditorService", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/Registry", "jassi/ui/PropertyEditors/LoadingEditor"], function (require, exports, Jassi_7, Classes_3, Registry_4, LoadingEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyeditor = exports.PropertyEditorService = void 0;
    let PropertyEditorService = class PropertyEditorService {
        /**
        * manage all PropertyEditors
        * @class jassi.ui.PropertyEditorService
        */
        constructor() {
            /** @member {Object.<string,[class]>}
             *  data[type]*/
            this.data = {};
            this.funcRegister = Registry_4.default.onregister("$PropertyEditor", this.register.bind(this));
        }
        reset() {
            this.data = {};
        }
        destroy() {
            Registry_4.default.offregister("$PropertyEditor", this.funcRegister);
        }
        async loadType(type) {
            if (this.data[type] === undefined) {
                var dat = await Registry_4.default.getJSONData("$PropertyEditor");
                for (var x = 0; x < dat.length; x++) {
                    if (dat[x].params[0].indexOf(type) !== -1) {
                        await Classes_3.classes.loadClass(dat[x].classname);
                    }
                }
                if (this.data[type] === undefined)
                    throw "PropertyEditor not found for type:" + type;
            }
            return Classes_3.classes.loadClass(this.data[type]);
        }
        /**
         * creates PropertyEditor for type
         *
         * @param {string} variablename - the name of the variable
         * @param {jassi.ui.Property} property - name of the type
         * @param {jassi.ui.PropertyEditor} propertyEditor - the PropertyEditor instance
         */
        createFor(property, propertyEditor) {
            var sclass = undefined;
            var promise = undefined;
            if (property.editor !== undefined) {
                sclass = property.editor;
            }
            else {
                if (this.data[property.type] === undefined) {
                    promise = this.loadType(property.type);
                }
                else
                    sclass = this.data[property.type][0];
            }
            if (sclass !== undefined) {
                var oclass = Classes_3.classes.getClass(sclass);
                if (oclass)
                    return new (oclass)(property, propertyEditor);
                else
                    return new LoadingEditor_1.LoadingEditor(property, propertyEditor, Classes_3.classes.loadClass(sclass));
            }
            else
                return new LoadingEditor_1.LoadingEditor(property, propertyEditor, promise);
        }
        register(oclass, types) {
            var name = Classes_3.classes.getClassName(oclass);
            for (var x = 0; x < types.length; x++) {
                if (this.data[types[x]] === undefined)
                    this.data[types[x]] = [];
                if (this.data[types[x]].indexOf(name) === -1)
                    this.data[types[x]].push(name);
            }
        }
    };
    PropertyEditorService = __decorate([
        Jassi_7.$Class("jassi.base.PropertyEditorService"),
        __metadata("design:paramtypes", [])
    ], PropertyEditorService);
    exports.PropertyEditorService = PropertyEditorService;
    var propertyeditor = new PropertyEditorService();
    exports.propertyeditor = propertyeditor;
});
define("jassi/base/Router", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/ui/ComponentDescriptor", "jassi/base/Windows"], function (require, exports, Jassi_8, Classes_4, ComponentDescriptor_1, Windows_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.router = exports.Router = void 0;
    new Promise((resolve_1, reject_1) => { require(["jassi/remote/Classes"], resolve_1, reject_1); });
    let Router = class Router {
        constructor() {
        }
        /**
         * registers a database class
         * @param {string} - the name of the class
         * @param {class} - the class
         */
        register(name, data) {
            throw "Error not implemented";
        }
        /**
         * resolve the url
         * @param {string} hash - the hash to resolve
         */
        resolve(hash) {
            if (hash === "")
                return;
            var tags = hash.substring(1).split("&");
            var params = {};
            for (var x = 0; x < tags.length; x++) {
                var kv = tags[x].split("=");
                params[kv[0]] = kv[1];
            }
            if (params.do !== undefined) {
                var clname = params.do;
                //load js file
                Classes_4.classes.loadClass(clname).then(function (cl) {
                    if (cl === undefined)
                        return;
                    var props = ComponentDescriptor_1.ComponentDescriptor.describe(cl).fields;
                    ;
                    var id = undefined;
                    for (var p = 0; p < props.length; p++) {
                        if (props[p].id) {
                            id = props[p].name;
                        }
                    }
                    var name = params.do;
                    if (params[id])
                        name = name + "-" + params[id];
                    if (Windows_2.default.contains(name)) {
                        var window = Windows_2.default.show(name);
                        var ob = Windows_2.default.findComponent(name);
                        if (ob !== undefined) {
                            for (var key in params) {
                                if (key !== "do" && //no classname
                                    key !== id) { //no id!
                                    ob[key] = params[key];
                                }
                            }
                        }
                        return window;
                    }
                    else {
                        var ob = new cl();
                        for (var key in params) {
                            if (key !== "do") {
                                ob[key] = params[key];
                            }
                        }
                        Windows_2.default.add(ob, ob.title, name);
                        if (ob.callEvent !== undefined) {
                            Windows_2.default.onclose(ob, function (param) {
                                ob.callEvent("close", param);
                            });
                        }
                    }
                });
                /*var urltags=[];
                for(var p=0;p<props.length;p){
                    if(props[p].isUrlTag){
                        urltags.push(props[p]);
                    }
                }*/
            }
        }
        /**
         * generate a URL from the component
         * @param {jassi.ui.Component} component - the component to inspect
         */
        getURLFromComponent(component) {
        }
        /**
         *
         * @param {string} hash - the hash to navigate
         */
        navigate(hash) {
            window.location.hash = hash;
            this.resolve(hash);
        }
    };
    Router = __decorate([
        Jassi_8.$Class("jassi.base.Router"),
        __metadata("design:paramtypes", [])
    ], Router);
    exports.Router = Router;
    ;
    window.addEventListener("popstate", function (evt) {
        router.resolve(window.location.hash);
    });
    let router = new Router();
    exports.router = router;
});
define("jassi/base/Tests", ["require", "exports", "jassi/remote/Jassi", "jassi/base/Actions", "jassi_editor/util/Typescript", "jassi/ui/Component", "jassi/ui/Container", "jassi/ui/BoxPanel", "jassi/base/Windows", "jassi/ui/HTMLPanel"], function (require, exports, Jassi_9, Actions_1, Typescript_2, Component_1, Container_1, BoxPanel_1, Windows_3, HTMLPanel_1) {
    "use strict";
    var TestAction_1, _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tests = exports.Test = exports.TestAction = void 0;
    let TestAction = TestAction_1 = class TestAction {
        static async testNode(all, container = undefined) {
            //var isRoot=false;
            if (container === undefined) {
                container = new BoxPanel_1.BoxPanel();
                Windows_3.default.add(container, "Tests");
                //	isRoot=true;
            }
            for (var x = 0; x < all.length; x++) {
                var file = all[x];
                if (file.isDirectory()) {
                    await TestAction_1.testNode(file.files, container);
                }
                else {
                    await Typescript_2.default.initService();
                    var text = Typescript_2.default.getCode(file.fullpath);
                    if (text !== undefined) {
                        text = text.toLowerCase();
                        console.log("test " + file.fullpath);
                        if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                            var func = (await new Promise((resolve_2, reject_2) => { require([file.fullpath.substring(0, file.fullpath.length - 3)], resolve_2, reject_2); })).test;
                            if (typeof func === "function") {
                                var ret = await func(new Test());
                                if (ret instanceof Component_1.Component) {
                                    $(ret.dom).css({ position: "relative" });
                                    ret.width = 400;
                                    var head = new HTMLPanel_1.HTMLPanel();
                                    head.value = "<b>" + file.fullpath + "</b>";
                                    container.add(head);
                                    container.add(ret);
                                }
                            }
                        }
                    }
                }
            }
            // if(isRoot&&container._components.length>0){
            //  }
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "Test"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, typeof (_a = typeof Container_1.Container !== "undefined" && Container_1.Container) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], TestAction, "testNode", null);
    TestAction = TestAction_1 = __decorate([
        Actions_1.$ActionProvider("jassi.remote.FileNode"),
        Jassi_9.$Class("jassi.ui.TestAction")
    ], TestAction);
    exports.TestAction = TestAction;
    let Test = class Test {
        /**
         * fails if the condition is false
         * @parameter condition
         **/
        expectEqual(condition) {
            if (!condition)
                throw new Error("Test fails");
        }
        /**
         * fails if the func does not throw an error
         * @parameter func - the function that should failed
         **/
        expectError(func) {
            try {
                if (func.toString().startsWith("async ")) {
                    var errobj;
                    try {
                        throw new Error("test fails");
                    }
                    catch (err) {
                        errobj = err;
                    }
                    func().then(() => {
                        throw errobj;
                    }).catch((err) => {
                        if (err.message === "test fails")
                            throw errobj;
                        var k = 1; //io
                    });
                    return;
                }
                else {
                    func();
                }
            }
            catch (_a) {
                return; //io
            }
            throw new Error("test fails");
        }
    };
    Test = __decorate([
        Jassi_9.$Class("jassi.base.Test")
    ], Test);
    exports.Test = Test;
    class Tests {
    }
    exports.Tests = Tests;
});
define("jassi/base/Windows", ["require", "exports", "jassi/ui/Panel", "jassi/remote/Jassi", "jassi/ext/goldenlayout", "jassi/ui/ComponentDescriptor", "jassi/remote/Classes", "jassi/util/Cookies"], function (require, exports, Panel_1, Jassi_10, goldenlayout_1, ComponentDescriptor_2, Classes_5, Cookies_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Windows = void 0;
    let Windows = class Windows {
        /**
         * the window system -> jassi.windows
         * @class jassi.base.Windows
         */
        constructor() {
            this._noRestore = [];
            this._myLayout = undefined;
            this._counter = 0;
            this._id = "jassi.windows";
            this.dom = $('<div class="Windows" id="' + this._id + 'jassi.windows"/>')[0];
            this._desktop = new Panel_1.Panel();
            this._desktop.maximize();
            //@member {Object.<string,lm.items.Component>} holds all known windows 
            this.components = [];
            //  this._desktop.add(new jassi.ui.Button());
            $(document.body).append(this.dom);
            //formemoryleak
            this._init();
        }
        /**
         * inits the component
         */
        _init() {
            var config = {
                settings: {
                    showPopoutIcon: false
                },
                content: [{
                        type: 'row',
                        name: 'mid',
                        isClosable: false,
                        content: [
                            {
                                type: 'stack',
                                name: 'center',
                                isClosable: false,
                                content: [{
                                        type: 'component',
                                        isClosable: false,
                                        componentName: 'main',
                                        componentState: {}
                                    }]
                            }
                        ]
                    }]
            };
            this._myLayout = new goldenlayout_1.default(config);
            var thisDesktop = this._desktop;
            var _this = this;
            this._myLayout.registerComponent('main', function (container, state) {
                var v = container.getElement();
                v[0].appendChild(thisDesktop.dom); //html( '<h2>' + state.text + '</h2>');
                _this.inited = true;
            });
            this._myLayout.init();
            this.restoreWindows();
            var j = this._myLayout;
        }
        /**
         * search a window
         * @param {object|undefined} parent - the parent window
         * @param {type} name - name of the window
         * @returns {object} - the founded window
         */
        _findDeep(parent, name) {
            if (parent === undefined)
                parent = this._myLayout.root;
            for (var x = 0; x < parent.contentItems.length; x++) {
                if (parent.contentItems[x].config.name === name || parent.contentItems[x].config.componentName === name)
                    return parent.contentItems[x];
                var test = this._findDeep(parent.contentItems[x], name);
                if (test !== undefined)
                    return test;
            }
            return undefined;
        }
        /**
         * true if there a window with that name
         * @param {string} name
         * @returns {boolean}
         */
        contains(name) {
            return this._myLayout._components[name] !== undefined;
        }
        /**
         * activate the window
         * @param {string} name - the neme of the window
         * @returns {objet} - the window
         */
        show(name) {
            //           var m=this._find(this._myLayout.root,name);
            var m = this.components[name];
            if (m.parent.header !== undefined)
                m.parent.header.parent.setActiveContentItem(m);
            return m;
        }
        /**
         * finds the component for the name
         * @param {string} name - the name of the window
         * @returns {jassi.ui.Component} - the found dom element
         */
        findComponent(name) {
            var m = this.components[name]; //this._find(this._myLayout.root,name);
            if (m === undefined)
                return undefined;
            if (m.container === undefined || m.container._config === undefined || m.container._config.componentState === undefined)
                return undefined;
            var ret = m.container._config.componentState.component;
            if (ret._this !== undefined)
                return ret._this;
        }
        /**
         * adds a window to the side (left - area)
         * @param {dom|jassi.ui.Component} component - the component to add
         * @param {string} title - the title
         */
        addLeft(component, title) {
            var parentname = 'xxxleft';
            this._noRestore.push(title);
            var config = {
                name: parentname,
                type: 'stack',
                content: []
            };
            var _this = this;
            var parent = this.components[parentname];
            if (parent === undefined) {
                this._myLayout.root.contentItems[0].addChild(config, 0);
                parent = this._myLayout.root.contentItems[0].contentItems[0];
                this._myLayout.root.contentItems[0].contentItems[0].config.width = 15;
                this.components[parentname] = parent;
                parent.on("itemDestroyed", () => {
                    delete _this.components[parentname];
                    _this._myLayout.updateSize();
                });
            }
            this._add(parent, component, title);
        }
        /**
        * adds a window to the side (left - area)
        * @param {dom|jassi.ui.Component} component - the component to add
        * @param {string} title - the title
        */
        addRight(component, title) {
            var parentname = 'xxxright';
            this._noRestore.push(title);
            var _this = this;
            var config = {
                name: parentname,
                type: 'column',
                content: []
            };
            var parent = this.components[parentname];
            if (parent === undefined) {
                var pos = this._myLayout.root.contentItems[0].contentItems.length;
                this._myLayout.root.contentItems[0].addChild(config, pos);
                parent = this._myLayout.root.contentItems[0].contentItems[pos];
                parent.config.width = 15;
                this.components[parentname] = parent;
                parent.on("itemDestroyed", () => {
                    delete _this.components[parentname];
                    _this._myLayout.updateSize();
                });
            }
            this._add(parent, component, title);
        }
        add(component, title, name = undefined) {
            var parent = this.components["center"];
            if (parent === undefined)
                parent = this.components["center"] = this._findDeep(this._myLayout.root, "center");
            return this._add(parent, component, title, name);
        }
        /**
         * add a window to the main area
         * @param {dom|jassi.ui.Component} component - the component to add
         * @param {string} title - the title
         * @param {string} [id] - the name (id) - =title if undefined
         */
        _add(parent, component, title, name = undefined) {
            var _this = this;
            if (component.dom !== undefined)
                component = component.dom;
            if (name === undefined)
                name = title;
            if (this.components[name] !== undefined)
                name = name + this._counter++;
            var config = {
                title: title,
                type: 'component',
                componentName: name,
                componentState: { title: title, name: name, component: component }
            };
            this._myLayout.registerComponent(name, function (container, state) {
                var v = container.getElement();
                state.component._container = container;
                var z = v[0].appendChild(state.component); //html( '<h2>' + state.text + '</h2>');
                _this.onclose(state.component, function (data) {
                    if (data.config.componentState.component._this !== undefined)
                        data.config.componentState.component._this.destroy();
                    delete data.config.componentState.component._container;
                    delete data.config.componentState.component;
                    //memory leak golden layout
                    // container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
                    /*  container.tab.element.remove();
                      var myNode =container.tab.element[0];
                      while (myNode.firstChild) {
                          myNode.removeChild(myNode.firstChild);
                      }*/
                    // container.tab.header.activeContentItem = undefined;
                    delete _this._myLayout._components[name];
                    delete _this.components[name];
                    _this.saveWindows();
                });
                var test = _this.components[name];
            });
            parent.addChild(config);
            for (var x = 0; x < parent.contentItems.length; x++) {
                if (parent.contentItems[x].config.name === name || parent.contentItems[x].config.componentName === name) {
                    this.components[name] = parent.contentItems[x];
                    //activate
                    var _this = this;
                    setTimeout(function () {
                        _this.show(name);
                        _this.saveWindows();
                    }, 10);
                    //this.components[name].parent.header.parent.setActiveContentItem(this.components[name]);
                }
            }
            var j = 9;
        }
        test() {
            var name = "oo";
            var title = "oo";
            var config = {
                title: title,
                type: 'component',
                componentName: name,
                componentState: { title: title, name: name }
            };
            var tt = $("<Button>");
            var _this = this;
            this._myLayout.registerComponent(name, function (container, componentState) {
                // var v=container.getElement();
                container.on("destroy", function (data) {
                    var hh = container.tab;
                    hh._dragListener._oDocument.unbind('mouseup touchend', hh._dragListener._fUp);
                    delete _this._myLayout._components[name];
                });
            });
            var center = this.components["center"];
            if (center === undefined)
                center = this.components["center"] = this._findDeep(this._myLayout.root, "center");
            center.addChild(config);
        }
        /**
         * gets the url for the given component
         * @param {jassi.ui.component} comp - the component to read
         */
        getUrlFromComponent(comp) {
            var props = ComponentDescriptor_2.ComponentDescriptor.describe(comp.constructor).fields;
            var urltags = [];
            for (var p = 0; p < props.length; p++) {
                if (props[p].isUrlTag) {
                    urltags.push(props[p]);
                }
            }
            var url = "#do=" + Classes_5.classes.getClassName(comp);
            for (var x = 0; x < urltags.length; x++) {
                url = url + "&" + urltags[x].name + "=" + comp[urltags[x].name];
            }
            return url;
            return "";
        }
        restoreWindows() {
            var save = Cookies_1.Cookies.get('openedwindows');
            if (save === undefined || save === "")
                return;
            var all = save.split(",");
            new Promise((resolve_3, reject_3) => { require(["./Router"], resolve_3, reject_3); }).then(function (router) {
                for (var x = 0; x < all.length; x++) {
                    router.router.navigate(all[x]);
                }
            });
        }
        /*
         * writes all opened components to cookie
         */
        saveWindows() {
            var all = [];
            for (var key in this.components) {
                var comp = this.findComponent(key); //this.components[key].container._config.componentState.component;
                if (comp !== undefined && this._noRestore.indexOf(key) === -1) {
                    // comp=comp._this;
                    if (comp !== undefined) {
                        var url = this.getUrlFromComponent(comp);
                        all.push(url);
                    }
                }
            }
            var s = "";
            for (var x = 0; x < all.length; x++) {
                s = s + (s === "" ? "" : ",") + all[x];
            }
            Cookies_1.Cookies.set('openedwindows', s, { expires: 30 });
        }
        /**
         * fired if component is closing
         * @param {dom|jassi.UI.Component} component - the component to register this event
         * @param {function} func
         */
        onclose(component, func) {
            if (component.dom !== undefined)
                component = component.dom;
            component._container.on("destroy", function (data) {
                func(data);
            });
        }
    };
    Windows = __decorate([
        Jassi_10.$Class("jassi.base.Windows"),
        __metadata("design:paramtypes", [])
    ], Windows);
    exports.Windows = Windows;
    var windows = new Windows();
    windows = windows;
    exports.default = windows;
});
//   myRequire("lib/goldenlayout.js",function(){
//  jassi.windows._init();
//  });
//return Component.constructor;
undefined;
//Hack for jquery.fancytree.dnd
define("jquery-ui/ui/widgets/draggable", function () {
    return jQuery.ui;
});
define("jquery-ui/ui/widgets/droppable", function () {
    return jQuery.ui;
});
//END Hack
define("jassi/ext/fancytree", ["jassi/remote/Jassi", "jquery.fancytree", 'jquery.fancytree.filter', 'jquery.fancytree.multi', 'jquery.fancytree.dnd'], function () {
    //jassi.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
    var path = require('jassi/modul').default.require.paths["jquery.fancytree"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/skin-win8/ui.fancytree.css");
    return { default: "" };
});
define("jassi/ext/goldenlayout", ['goldenlayout', "jassi/remote/Jassi"], function (GoldenLayout) {
    var path = require('jassi/modul').default.require.paths["goldenlayout"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/css/goldenlayout-base.css");
    jassi.myRequire(path + "/css/goldenlayout-light-theme.css");
    return {
        default: GoldenLayout
    };
});
//polyfill for old ios
var def = [];
if (window.IntersectionObserver === undefined) {
    def = ["intersection-observer"];
}
define("jassi/ext/intersection-observer", def, function () {
    return {};
});
define("jassi/ext/jquery.choosen", ["jassi/remote/Jassi", "jquery.choosen"], function () {
    var path = require('jassi/modul').default.require.paths["jquery.choosen"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/chosen.css");
    return {
        default: ""
    };
});
define("jassi/ext/jquery.contextmenu", ["jassi/remote/Jassi", "jquery.contextMenu"], function () {
    var path = require('jassi/modul').default.require.paths["jquery.contextMenu"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/contextMenu.css");
    return {
        default: ""
    };
});
define("jassi/ext/jquerylib", [
    "jquery",
    "jquery.ui",
    "jquery.ui.touch",
    "jquery.doubletap",
    "jquery.notify"
], function (require) {
    $.notify.defaults({ position: "bottom right", className: "info" });
    define("../widgets/datepicker", [], function () {
        return $.datepicker;
    });
    requirejs(['jquery.language'], function () {
        $.datepicker.setDefaults($.datepicker.regional[navigator.language.split("-")[0]]);
    });
    return {
        default: ""
    };
});
define("jassi/ext/js-cookie", ['js-cookie'], function (cookie) {
    return {
        default: cookie
    };
});
define("jassi/ext/lodash", ["lodash"], function (lodash) {
    //jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css");
    return {
        default: lodash
    };
});
requirejs.config({
    paths: {},
});
define("jassi/ext/papaparse", ["papaparse"], function (papa) {
    // jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.css");
    return {
        Papa: papa
    };
});
define("jassi/ext/requestidlecallback", ["ric"], function () {
    return { default: "" };
});
//dummy for sourcemap 
define("fs", [], function () {
    return undefined;
});
define("path", [], function () {
    return undefined;
});
define("jassi/ext/sourcemap", ["source.map", "exports"], function (sm, exp) {
    exp = 1;
    // requirejs.undef("fs");
    // requirejs.undef("path");
    return {
        default: sm
    };
});
define("jassi/ext/spectrum", ["jassi/remote/Jassi", "spectrum"], function () {
    //'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
    var path = require('jassi/modul').default.require.paths["spectrum"];
    //path=path.substring(0,path.lastIndexOf("/"));
    jassi.myRequire(path + ".css");
    return {
        default: ""
    };
});
define("jassi/ext/split", ["splitlib"], function (split) {
    return {
        default: split
    };
});
define("jassi/ext/tabulator", ['tabulatorlib'], function (Tabulator) {
    var path = require('jassi/modul').default.require.paths["tabulatorlib"];
    jassi.myRequire(path.replace("js", "css") + ".min.css");
    window.Tabulator = Tabulator;
});
////GEHT NICHT 
////use requirejs(["https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min.js"],function(tinymcelib){
//var path = require('jassi/modul').default.require.paths["tinymcelib"];
//path=path.substring(0,path.lastIndexOf("/"));
//var path="//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min";
var tinyMCEPreInit = {
    suffix: '.min',
    base: "//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2",
    query: ''
};
define("jassi/ext/tinymce", ["tinymcelib"], function (require) {
    return {
        default: tinymce
    };
});
define("jassi/remote/Classes", ["require", "exports", "jassi/remote/Registry"], function (require, exports, Registry_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.classes = exports.Classes = void 0;
    function $Class(longclassname) {
        return function (pclass) {
            Registry_5.default.register("$Class", pclass, longclassname);
        };
    }
    /**
    * manage all registered classes ->jassi.register("classes")
    * @class jassi.base.Classes
    */
    let Classes = class Classes {
        constructor() {
            this._cache = {};
            this.funcRegister = Registry_5.default.onregister("$Class", this.register.bind(this));
        }
        destroy() {
            Registry_5.default.offregister("$Class", this.funcRegister);
        }
        /**
         * load the a class
         * @param classname - the class to load
         */
        async loadClass(classname) {
            var cl = await Registry_5.default.getJSONData("$Class", classname);
            if (cl === undefined) {
                try {
                    await new Promise((resolve_4, reject_4) => { require([classname.replaceAll(".", "/")], resolve_4, reject_4); });
                }
                catch (err) {
                    err = err;
                }
            }
            else {
                if (cl === undefined || cl.length === 0) {
                    throw "Class not found:" + classname;
                }
                var file = cl[0].filename;
                //@ts-ignore
                if (window.document === undefined) {
                    var pack = file.split("/");
                    if (pack.length < 2 || pack[1] !== "remote") {
                        throw "failed loadClass " + classname + " on server only remote classes coud be loaded";
                    }
                }
                var imp = await new Promise((resolve_5, reject_5) => { require([file.replace(".ts", "")], resolve_5, reject_5); });
            }
            return this.getClass(classname);
        }
        /**
        * get the class of the given classname
        * @param {string} - the classname
        * @returns {class} - the class
        */
        getClass(classname) {
            return this._cache[classname];
            /* var ret=this.getPackage(classname);
             
             if(ret!==undefined&&ret.prototype!==undefined && ret.prototype.constructor === ret)
                 return ret;
             else
                 return undefined; */
        }
        /**
        * get the name of the given class
        * @param {class} _class - the class (prototype)
        * @returns {string} name of the class
        */
        getClassName(_class) {
            var _a, _b, _c, _d, _e, _f;
            if (_class === undefined)
                return undefined;
            if ((_a = _class.constructor) === null || _a === void 0 ? void 0 : _a._classname)
                return (_b = _class.constructor) === null || _b === void 0 ? void 0 : _b._classname;
            if ((_d = (_c = _class.prototype) === null || _c === void 0 ? void 0 : _c.constructor) === null || _d === void 0 ? void 0 : _d._classname)
                return (_f = (_e = _class.prototype) === null || _e === void 0 ? void 0 : _e.constructor) === null || _f === void 0 ? void 0 : _f._classname;
            return undefined;
        }
        register(data, name) {
            //data.prototype._classname=name;
            this._cache[name] = data;
        }
    };
    Classes = __decorate([
        $Class("jassi.remote.Classes"),
        __metadata("design:paramtypes", [])
    ], Classes);
    exports.Classes = Classes;
    ;
    let classes = new Classes();
    exports.classes = classes;
});
define("jassi/remote/DBArray", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes"], function (require, exports, Jassi_11, Classes_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBArray = void 0;
    let cl = Classes_6.classes; //force Classes.
    let DBArray = class DBArray
    /**
    * Array for jassi.base.DBObject's
    * can be saved to db
    * @class jassi.base.DBArray
    */
     extends Array {
        constructor(...args) {
            super(...args);
        }
        /**
         * adds an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to add
         */
        add(ob) {
            if (ob === undefined || ob === null)
                throw "Error cannot add object null";
            this.push(ob);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = Jassi_11.default.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) < 0)
                            test.add(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob.__objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, this._parentObject);
                    }
                }
            }
        }
        /**
         * for compatibility
         */
        async resolve() {
            //Object was already resolved   
            return this;
        }
        /**
         * remove an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to remove
         */
        remove(ob) {
            var pos = this.indexOf(ob);
            if (pos >= 0)
                this.splice(pos, 1);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = Jassi_11.default.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) >= 0)
                            test.remove(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob._getObjectProperty(link.name);
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, null);
                    }
                }
            }
        }
    };
    DBArray = __decorate([
        Jassi_11.$Class("jassi.remote.DBArray"),
        __metadata("design:paramtypes", [Object])
    ], DBArray);
    exports.DBArray = DBArray;
});
define("jassi/remote/DBObject", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/RemoteObject", "jassi/remote/Registry", "jassi/util/DatabaseSchema", "jassi/remote/Database"], function (require, exports, Jassi_12, Classes_7, RemoteObject_1, Registry_6, DatabaseSchema_2, Database_1) {
    "use strict";
    var DBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObject = exports.MyFindManyOptions = exports.$DBObject = void 0;
    let cl = Classes_7.classes; //force Classes
    function $DBObject(options) {
        return function (pclass, ...params) {
            var classname = Classes_7.classes.getClassName(pclass);
            if (!options)
                options = {};
            if (!options.name)
                options.name = classname.toLowerCase().replaceAll(".", "_");
            Registry_6.default.register("$DBObject", pclass, options);
            DatabaseSchema_2.Entity(options)(pclass, ...params); //pass to orginal Entitiy
        };
    }
    exports.$DBObject = $DBObject;
    class MyFindManyOptions {
    }
    exports.MyFindManyOptions = MyFindManyOptions;
    /**
    * base class for all database entfities
    * all objects which use the jassi.db must implement this
    * @class DBObject
    */
    let DBObject = DBObject_1 = class DBObject extends RemoteObject_1.RemoteObject {
        constructor() {
            super();
        }
        isAutoId() {
            var def = Database_1.db.getMetadata(this.constructor);
            return def.id.PrimaryGeneratedColumn !== undefined;
        }
        static getFromCache(classname, id) {
            if (!DBObject_1.cache[classname])
                return undefined;
            return DBObject_1.cache[classname][id.toString()];
        }
        removeFromCache() {
            var clname = Classes_7.classes.getClassName(this);
            if (!DBObject_1.cache[clname])
                return;
            delete DBObject_1.cache[clname][this.id.toString()];
        }
        static _createObject(ob) {
            if (ob === undefined)
                return undefined;
            var cl = DBObject_1.cache[ob.__clname__];
            if (cl === undefined) {
                cl = {};
                DBObject_1.cache[ob.__clname__] = cl;
            }
            var ret = cl[ob.id];
            if (ret === undefined) {
                ret = new (Classes_7.classes.getClass(ob.__clname__))();
                cl[ob.id] = ret;
            }
            return ret;
        }
        //public id:number;
        /**
         * replace all childs objects with {id:}
         */
        _replaceObjectWithId(obj) {
            var ret = {};
            if (obj === undefined)
                return undefined;
            for (var key in obj) {
                ret[key] = obj[key];
                if (ret[key] !== undefined && ret[key] !== null && ret[key].id !== undefined) {
                    ret[key] = { id: ret[key].id };
                }
                if (Array.isArray(ret[key])) {
                    ret[key] = [];
                    for (var i = 0; i < obj[key].length; i++) {
                        ret[key].push(obj[key][i]);
                        if (ret[key][i] !== undefined && ret[key][i] !== null && ret[key][i].id !== undefined) {
                            ret[key][i] = { id: ret[key][i].id };
                        }
                    }
                }
            }
            return ret;
        }
        /**
        * save the object to jassi.db
        */
        async save(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this.id !== undefined) {
                    var cname = Classes_7.classes.getClassName(this);
                    var cl = DBObject_1.cache[cname];
                    if (cl === undefined) {
                        cl = {};
                        DBObject_1.cache[cname] = cl;
                    }
                    if (cl[this.id] === undefined) {
                        cl[this.id] = this; //must be cached before inserting, so the new properties are introduced to the existing
                        if (this.isAutoId())
                            throw new Error("autoid - load the object  before saving or remove id");
                        else {
                            //this._createObjectInDB
                            return await this.call(this, this._createObjectInDB, context);
                        } //fails if the Object is saved before loading 
                    }
                    else {
                        if (cl[this.id] !== this) {
                            throw new Error("the object must be loaded before save");
                        }
                    }
                    cl[this.id] = this; //Update cache on save
                    var newob = this._replaceObjectWithId(this);
                    var h = await this.call(newob, this.save, context);
                    this.id = h.id;
                    return this;
                }
                else {
                    if (!this.isAutoId()) {
                        throw new Error("error while saving the Id is not set");
                    }
                    else {
                        var newob = this._replaceObjectWithId(this);
                        var h = await this.call(newob, this._createObjectInDB, context);
                        this.id = h.id;
                        DBObject_1.cache[Classes_7.classes.getClassName(this)][this.id] = this;
                        return this;
                    }
                }
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_6, reject_6) => { require(["jassi/server/DBManager"], resolve_6, reject_6); })).DBManager.get();
                return man.save(context, this);
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
        async _createObjectInDB(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                throw new Error("createObject could oly be called on server");
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_7, reject_7) => { require(["jassi/server/DBManager"], resolve_7, reject_7); })).DBManager.get();
                return man.insert(context, this);
            }
        }
        static async findOne(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.findOne, options, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_8, reject_8) => { require(["jassi/server/DBManager"], resolve_8, reject_8); })).DBManager.get();
                return man.findOne(context, this, options);
            }
        }
        static async find(options = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.find, options, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_9, reject_9) => { require(["jassi/server/DBManager"], resolve_9, reject_9); })).DBManager.get();
                return man.find(context, this, options);
            }
        }
        /**
        * reload the object from jassi.db
        */
        async remove(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                //@ts-ignore
                var cl = DBObject_1.cache[Classes_7.classes.getClassName(this)];
                if (cl !== undefined) {
                    delete cl[this.id];
                }
                return await this.call({ id: this.id }, this.remove, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_10, reject_10) => { require(["jassi/server/DBManager"], resolve_10, reject_10); })).DBManager.get();
                await man.remove(context, this);
            }
        }
        _getObjectProperty(dummy) {
        }
        _setObjectProperty(dummy, dumm1) {
        }
    };
    DBObject.cache = {};
    DBObject = DBObject_1 = __decorate([
        Jassi_12.$Class("jassi.remote.DBObject"),
        __metadata("design:paramtypes", [])
    ], DBObject);
    exports.DBObject = DBObject;
    async function test() {
        var h = Database_1.db.getMetadata(Classes_7.classes.getClass("de.Kunde"));
        // debugger;
    }
    exports.test = test;
});
define("jassi/remote/DBObjectQuery", ["require", "exports", "jassi/remote/Classes", "jassi/remote/Registry"], function (require, exports, Classes_8, Registry_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectQuery = exports.$DBObjectQuery = exports.DBObjectQueryProperties = void 0;
    class DBObjectQueryProperties {
    }
    exports.DBObjectQueryProperties = DBObjectQueryProperties;
    function $DBObjectQuery(property) {
        return function (target, propertyKey, descriptor) {
            var test = Classes_8.classes.getClassName(target);
            Registry_7.default.registerMember("$DBObjectQuery", target, propertyKey, property);
        };
    }
    exports.$DBObjectQuery = $DBObjectQuery;
    class DBObjectQuery {
        async execute() {
            return undefined;
        }
        static async getQueries(classname) {
            var cl = await Classes_8.classes.loadClass(classname);
            var ret = [];
            var all = Registry_7.default.getMemberData("$DBObjectQuery");
            var queries = all[classname];
            for (var name in queries) {
                var qu = queries[name][0][0];
                var query = new DBObjectQuery();
                query.classname = classname;
                query.name = qu.name;
                query.description = qu.description;
                query.execute = async function () {
                    return await cl[name]();
                };
                ret.push(query);
            }
            return ret;
        }
    }
    exports.DBObjectQuery = DBObjectQuery;
    async function test() {
        var qu = (await DBObjectQuery.getQueries("de.Kunde"))[0];
        var j = await qu.execute();
    }
    exports.test = test;
});
define("jassi/remote/Database", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes"], function (require, exports, Jassi_13, Classes_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.db = exports.Database = void 0;
    class TypeDef {
    }
    let Database = class Database {
        constructor() {
            this.typeDef = new Map();
            this.decoratorCalls = new Map();
            ;
        }
        removeOld(oclass) {
            var name = Classes_9.classes.getClassName(oclass);
            this.typeDef.forEach((value, key) => {
                var testname = Classes_9.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.typeDef.delete(key);
            });
            this.decoratorCalls.forEach((value, key) => {
                var testname = Classes_9.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.decoratorCalls.delete(key);
            });
        }
        _setMetadata(constructor, field, decoratername, fieldprops, decoraterprops, delegate) {
            var def = this.typeDef.get(constructor);
            if (def === undefined) {
                def = new TypeDef();
                this.decoratorCalls.set(constructor, []);
                this.typeDef.set(constructor, def); //new class
            }
            if (field === "this") {
                this.removeOld(constructor);
            }
            this.decoratorCalls.get(constructor).push([delegate, fieldprops, decoraterprops]);
            var afield = def[field];
            if (def[field] === undefined) {
                afield = {};
                def[field] = afield;
            }
            afield[decoratername] = fieldprops;
        }
        fillDecorators() {
            this.decoratorCalls.forEach((allvalues, key) => {
                allvalues.forEach((value) => {
                    value[0](...value[1])(...value[2]);
                });
            });
        }
        getMetadata(sclass) {
            return this.typeDef.get(sclass);
        }
    };
    Database = __decorate([
        Jassi_13.$Class("jassi.remote.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    exports.Database = Database;
    //@ts-ignore
    var db = new Database();
    exports.db = db;
});
define("jassi/remote/Extensions", ["require", "exports", "jassi/remote/Registry"], function (require, exports, Registry_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extensions = exports.Extensions = exports.$Extension = void 0;
    function $Extension(forclass) {
        return function (pclass) {
            Registry_8.default.register("$Extension", pclass, forclass);
        };
    }
    exports.$Extension = $Extension;
    class Extensions {
        constructor() {
            this.funcRegister = Registry_8.default.onregister("$Extension", this.register.bind(this));
        }
        destroy() {
            Registry_8.default.offregister("$Extension", this.funcRegister);
        }
        annotate(oclass, ...annotations) {
        }
        register(extensionclass, forclass) {
            //TODO reloading???
            //we must wait with to extent because forclass ist not loaded
            var func = Registry_8.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === forclass) {
                    Registry_8.default.offregister("$Class", func);
                    let props = Object.getOwnPropertyNames(extensionclass.prototype);
                    for (var m = 0; m < props.length; m++) {
                        var member = props[m];
                        if (member !== "_classname" && member !== "constructor") {
                            if (typeof extensionclass.prototype[member] === "function") {
                                if (oclass.prototype[member] !== undefined) {
                                    var sic = oclass.prototype[member];
                                    var ext = extensionclass.prototype[member];
                                    oclass.prototype[member] = function (...p) {
                                        sic.bind(this)(...p);
                                        ext.bind(this)(...p);
                                    };
                                }
                                else
                                    oclass.prototype[member] = extensionclass.prototype[member];
                            }
                        }
                    }
                }
            });
            //  alert(forclass);
        }
        annotateMember(classname, member, type, ...annotations) {
            var func = Registry_8.default.onregister("$Class", function (oclass, params) {
                if (oclass.prototype.constructor._classname === classname) {
                    Registry_8.default.offregister("$Class", func);
                    //designtype
                    Reflect["metadata"]("design:type", type)(oclass.prototype, member);
                    for (var x = 0; x < annotations.length; x++) {
                        let ann = annotations[x];
                        ann(oclass.prototype, member);
                    }
                }
            });
        }
    }
    exports.Extensions = Extensions;
    var extensions = new Extensions();
    exports.extensions = extensions;
});
define("jassi/remote/FileNode", ["require", "exports", "jassi/remote/Jassi"], function (require, exports, Jassi_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileNode = void 0;
    ;
    let FileNode = class FileNode {
        isDirectory() {
            return this.files !== undefined;
        }
        resolveChilds(all) {
            if (all === undefined)
                all = {};
            //var ret:FileNode[]=[];
            if (this.files !== undefined) {
                for (let x = 0; x < this.files.length; x++) {
                    all[this.files[x].fullpath] = this.files[x];
                    this.files[x].resolveChilds(all);
                }
            }
            return all;
        }
    };
    FileNode = __decorate([
        Jassi_14.$Class("jassi.remote.FileNode")
    ], FileNode);
    exports.FileNode = FileNode;
});
define("jassi/remote/Jassi", ["require", "exports", "jassi/remote/Registry"], function (require, exports, Registry_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Jassi = exports.$register = exports.$Class = void 0;
    /*
    window.extentsionCalled = function (param:  ExtensionAction) {
        if (param.sample) {
            alert("default:" + param.defaultAction.name);
        }
       
    }
    window.extentsionCalled({
        sample: { name: "Passt" }
    })*/
    function $Class(longclassname) {
        return function (pclass) {
            Registry_9.default.register("$Class", pclass, longclassname);
        };
    }
    exports.$Class = $Class;
    function $register(servicename, ...params) {
        return function (pclass) {
            Registry_9.default.register(servicename, pclass, params);
        };
    }
    exports.$register = $register;
    //@ts-ignore
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };
    /**
    * main class for jassi
    * @class Jassi
    */
    let Jassi = class Jassi {
        constructor() {
            this.isServer = false;
            //@ts-ignore
            this.isServer = window.document === undefined;
            if (!this.isServer) {
                //  this.myRequire("jassi/jassi.css");
                //  this.myRequire("https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css");
                //  this.myRequire("https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css");
            }
        }
        /**
         * include a global stylesheet
         * @id - the given id - important for update
         * @data - the css data to insert
         **/
        includeCSS(id, data) {
            //@ts-ignore
            var style = document.getElementById(id);
            //@ts-ignore
            if (!document.getElementById(id)) {
                style = $('<style id=' + id + '></style>')[0];
                //@ts-ignore
                document.head.appendChild(style);
            }
            var sstyle = "";
            for (var selector in data) {
                var sstyle = sstyle + "\n\t" + selector + "{\n";
                var properties = data[selector];
                var prop = {};
                for (let key in properties) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    prop[newKey] = properties[key];
                    sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
                }
                sstyle = sstyle + "\t}\n";
            }
            style.innerHTML = sstyle;
        }
        /**
        * include a js or a css file
        * @param {string|string[]} href - url(s) of the js or css file(s)
        * @param {function} [param] - would be added with? to the url
        */
        myRequire(href, event = undefined, param = undefined) {
            if (this.isServer)
                throw "jass.Require is only available on client";
            if ((typeof href) === "string") {
                href = [href];
            }
            var url = "";
            if (href instanceof Array) {
                if (href.length === 0) {
                    if (event !== undefined)
                        event();
                    return;
                }
                else {
                    url = href[0];
                    href.splice(0, 1);
                }
            }
            if (url.endsWith(".js")) {
                //@ts-ignore
                if (window.document.getElementById("-->" + url) !== null) {
                    this.myRequire(href, event);
                }
                else {
                    //@ts-ignore
                    var js = window.document.createElement("script");
                    //   js.type = "text/javascript";
                    js.src = url + (param !== undefined ? "?" + param : "");
                    var _this = this;
                    js.onload = function () {
                        _this.myRequire(href, event);
                    };
                    js.id = "-->" + url;
                    //@ts-ignore
                    window.document.head.appendChild(js);
                }
            }
            else {
                //    <link href="lib/jquery.splitter.css" rel="stylesheet"/>
                //@ts-ignore
                var head = window.document.getElementsByTagName('head')[0];
                //@ts-ignore
                var link = window.document.createElement('link');
                //  link.rel  = 'import';
                link.href = url;
                link.rel = "stylesheet";
                link.id = "-->" + url;
                var _this = this;
                //@ts-ignore 
                link.onload = function (data1, data2) {
                    _this.myRequire(href, event);
                };
                head.appendChild(link);
            }
        }
    };
    Jassi = __decorate([
        $Class("jassi.remote.Jassi"),
        __metadata("design:paramtypes", [])
    ], Jassi);
    exports.Jassi = Jassi;
    ;
    var jassi = new Jassi();
    //@ts-ignore
    if (window["jassi"] === undefined) { //reloading this file -> no destroy namespace
        //@ts-ignore
        window["jassi"] = jassi;
    }
    exports.default = jassi;
});
define("jassi/remote/ObjectTransaction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ObjectTransaction = void 0;
    class ObjectTransaction {
        constructor() {
            this.statements = [];
            this.functionsFinally = [];
        }
        transactionResolved(context) {
            //var session = getNamespace('objecttransaction');
            var test = context.objecttransactionitem; // session.get("objecttransaction");
            if (test)
                test.resolve = true;
        }
        addFunctionFinally(functionToAdd) {
            this.functionsFinally.push(functionToAdd);
        }
        checkFinally() {
            let canFinally = true;
            this.statements.forEach((ent) => {
                if (ent.result === "**unresolved**")
                    canFinally = false;
                if (ent.result["then"] && !ent["resolve"]) { //Promise, which is not resolved by addFunctionFinally
                    canFinally = false;
                }
            });
            if (canFinally) {
                this.finally();
            }
        }
        async finally() {
            for (let x = 0; x < this.functionsFinally.length; x++) {
                await this.functionsFinally[x]();
            }
        }
    }
    exports.ObjectTransaction = ObjectTransaction;
});
define("jassi/remote/Registry", ["require", "exports", "reflect-metadata"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.migrateModul = exports.Registry = void 0;
    if (Reflect["_metadataorg"] === undefined) {
        Reflect["_metadataorg"] = Reflect["metadata"];
        if (Reflect["_metadataorg"] === undefined)
            Reflect["_metadataorg"] = null;
    }
    //@ts-ignore
    Reflect["metadata"] = function (o, property, ...args) {
        return function (target, propertyKey, descriptor, ...fargs) {
            //delegation to 
            if (Reflect["_metadataorg"] !== null) {
                var func = Reflect["_metadataorg"](o, property, ...args);
                func(target, propertyKey, descriptor, ...fargs);
            }
            if (o === "design:type") {
                registry.registerMember("design:type", target, propertyKey, property);
            }
        };
    };
    class DataEntry {
    }
    class JSONDataEntry {
    }
    /**
    * Manage all known data registered by jassi.register
    * the data is downloaded by /registry.json
    * registry.json is updated by the server on code upload
    * @class jassi.base.Registry
    */
    class Registry {
        constructor() {
            this.jsondata = undefined;
            this.data = {};
            this.dataMembers = {};
            this._eventHandler = {};
            this._nextID = 10;
        }
        getData(service, classname = undefined) {
            var olddata = this.data[service];
            if (olddata === undefined)
                return [];
            var ret = [];
            if (classname !== undefined) {
                if (olddata[classname] !== undefined) {
                    ret.push(olddata[classname]);
                }
            }
            else {
                for (var key in olddata) {
                    ret.push(olddata[key]);
                }
            }
            return ret;
        }
        onregister(service, callback) {
            var events = this._eventHandler[service];
            if (events === undefined) {
                events = [];
                this._eventHandler[service] = events;
            }
            events.push(callback);
            //push already registered events
            var olddata = this.data[service];
            for (var key in olddata) {
                var dataentry = olddata[key];
                callback(dataentry.oclass, ...dataentry.params);
            }
            return callback;
        }
        offregister(service, callback) {
            var events = this._eventHandler[service];
            var pos = events.indexOf(callback);
            if (pos >= 0)
                events.splice(pos, 1);
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation, because the annotation is saved in
         *            index.json and could be read without loading the class
         **/
        register(service, oclass, ...params) {
            var sclass = oclass.prototype.constructor._classname;
            if (sclass === undefined && service !== "$Class") {
                throw "@$Class member is missing or must be set at last";
                return;
            }
            if (service === "$Class") {
                sclass = params[0];
                oclass.prototype.constructor._classname = params[0];
            }
            if (this.data[service] === undefined) {
                this.data[service] = {};
            }
            this.data[service][sclass] = { oclass, params };
            //the array could be modified so we need a copy
            var events = this._eventHandler[service] === undefined ? undefined : [].concat(this._eventHandler[service]);
            if (events !== undefined) {
                for (var x = 0; x < events.length; x++) {
                    events[x](oclass, ...params);
                }
            }
            if (service === "$Class") {
                //console.log("load " + params[0]);
                //finalize temporary saved registerd members
                let tempMem = oclass.prototype.$$tempRegisterdMembers$$;
                if (tempMem === undefined)
                    //@ts-ignore
                    tempMem = oclass.$$tempRegisterdMembers$$;
                if (tempMem !== undefined) {
                    //this.dataMembers = oclass.prototype.$$tempRegisterdMembers$$;
                    for (var sservice in tempMem) {
                        var pservice = tempMem[sservice];
                        if (this.dataMembers[sservice] === undefined) {
                            this.dataMembers[sservice] = {};
                        }
                        this.dataMembers[sservice][sclass] = pservice;
                    }
                    delete oclass.prototype.$$tempRegisterdMembers$$;
                    //@ts-ignore
                    delete oclass.$$tempRegisterdMembers$$;
                }
            }
        }
        getMemberData(service) {
            return this.dataMembers[service];
        }
        /**
         * register an anotation
         * Important: this function should only used from an annotation
         **/
        registerMember(service, oclass /*new (...args: any[]) => any*/, membername, ...params) {
            var m = oclass;
            if (oclass.prototype !== undefined)
                m = oclass.prototype;
            //the classname is not already known so we temporarly store the data in oclass.$$tempRegisterdMembers$$
            //and register the member in register("$Class",....)
            if (m.$$tempRegisterdMembers$$ === undefined) {
                m.$$tempRegisterdMembers$$ = {};
            }
            if (m.$$tempRegisterdMembers$$[service] === undefined) {
                m.$$tempRegisterdMembers$$[service] = {};
            }
            if (m.$$tempRegisterdMembers$$[service][membername] === undefined) {
                m.$$tempRegisterdMembers$$[service][membername] = [];
            }
            m.$$tempRegisterdMembers$$[service][membername].push(params);
        }
        /**
        * with every call a new id is generated - used to create a free id for the dom
        * @returns {number} - the id
        */
        nextID() {
            this._nextID = this._nextID + 1;
            return this._nextID.toString();
        }
        /**
        * Load text with Ajax synchronously: takes path to file and optional MIME type
        * @param {string} filePath - the url
        * @returns {string} content
        */ /*
        loadFile(filePath)
        {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let response = null;
                xhr.addEventListener("readystatechange", function() {
                  if (this.readyState === xhr.DONE) {
                    response = this.responseText;
                    if (response) {
                      //response = JSON.parse(response);
                      resolve(response);
                    }
                  }
                });
                xhr.open("GET",filePath, true);
                xhr.send();
                xhr.overrideMimeType("application/json");
                xhr.onerror = function(error) {
                  reject({
                    error: "Some error"
                  })
                }
              });
        }*/
        async loadText(url) {
            return new Promise((resolve) => {
                //@ts-ignore
                let oReq = new XMLHttpRequest();
                oReq.open("GET", url);
                oReq.onerror = () => {
                    resolve(undefined);
                };
                oReq.addEventListener("load", () => {
                    if (oReq.status === 200)
                        resolve(oReq.responseText);
                    else
                        resolve(undefined);
                });
                oReq.send();
            });
        }
        /**
         * reload the registry
         */
        async reload() {
            this.jsondata = { $Class: {} };
            var _this = this;
            var modultext = "";
            //@ts-ignore
            if ((window === null || window === void 0 ? void 0 : window.document) === undefined) { //on server
                //@ts-ignore
                var fs = await new Promise((resolve_11, reject_11) => { require(['fs'], resolve_11, reject_11); });
                modultext = fs.readFileSync("./jassi.json", 'utf-8');
                var modules = JSON.parse(modultext).modules;
                for (let modul in modules) {
                    try {
                        //@ts-ignore
                        delete require.cache[require.resolve(modul + "/registry")];
                        var data = (await require(modul + "/registry")).default;
                        this.initJSONData(data);
                        /*    //requirejs.undef("js/"+modul+"/registry.js");
                            var text = fs.readFileSync("./../client/" + modul + "/registry.js", 'utf-8');
                            text = text.substring(text.indexOf("default:") + 8);
                            text = text.substring(0, text.lastIndexOf("}") - 1);
                            text = text.substring(0, text.lastIndexOf("}") - 1);
                            var d = JSON.parse(text)
                            _*/
                    }
                    catch (_a) {
                        console.error("failed load registry " + modul + "/registry.js");
                    }
                }
            }
            else { //on client
                var all = {};
                var mod = JSON.parse(await (this.loadText("jassi.json")));
                for (let modul in mod.modules) {
                    if (!mod.modules[modul].endsWith(".js"))
                        //@ts-ignore
                        requirejs.undef(modul + "/registry");
                    {
                        var m = modul;
                        all[modul] = new Promise((resolve, reject) => {
                            //@ts-ignore
                            require([m + "/registry"], function (ret, r2) {
                                resolve(ret.default);
                            });
                        });
                    }
                }
                for (let modul in mod.modules) {
                    var data = await all[modul];
                    _this.initJSONData(data);
                }
            }
            /* for (let modul in modules) {
            
                        //requirejs.undef("js/"+modul+"/registry.js");
                        all[modul] = fs.readFileSync("./../client/"+modul+"/registry.js", 'utf-8');
                    }
                    for (let modul in modules) {
                        var data = await all[modul].default;
                        _this.initJSONData(data);
                    }
            */
            //var reg = await this.reloadRegistry();
            //_this.initJSONData(reg);
            /*     requirejs.undef("text!../../../../registry.json?bust="+window["jassiversion"]);
             require(["text!../../../../registry.json?bust="+window["jassiversion"]], function(registry){
                 _this.init(registry);
             });*/
        }
        /**
        * loads entries from json string
        * @param {string} json - jsondata
        */
        initJSONData(json) {
            if (json === undefined)
                return;
            var vdata = json;
            for (var file in vdata) {
                var vfiles = vdata[file];
                for (var classname in vfiles) {
                    if (classname === "date")
                        continue;
                    this.jsondata.$Class[classname] = {
                        classname: classname,
                        params: [classname],
                        filename: file
                    };
                    var theclass = vfiles[classname];
                    for (var service in theclass) {
                        if (this.jsondata[service] === undefined)
                            this.jsondata[service] = {};
                        var entr = new JSONDataEntry();
                        entr.params = theclass[service];
                        /* if (vfiles.$Class === undefined) {
                             console.log("@$Class annotation is missing for " + file + " Service " + service);
                         }*/
                        entr.classname = classname; //vfiles.$Class === undefined ? undefined : vfiles.$Class[0];
                        entr.filename = file;
                        this.jsondata[service][entr.classname] = entr;
                    }
                }
            }
        }
        /**
         *
         * @param service - the service for which we want informations
         */
        async getJSONData(service, classname = undefined) {
            if (this.isLoading)
                await this.isLoading;
            if (this.jsondata === undefined) {
                this.isLoading = this.reload();
                await this.isLoading;
            }
            this.isLoading = undefined;
            var ret = [];
            var odata = this.jsondata[service];
            if (odata === undefined)
                return ret;
            if (classname !== undefined)
                return odata[classname] === undefined ? undefined : [odata[classname]];
            for (var clname in odata) {
                if (classname === undefined || classname === clname)
                    ret.push(odata[clname]);
            }
            return ret;
        }
        getAllFilesForService(service, classname = undefined) {
            var data = this.jsondata[service];
            var ret = [];
            for (var clname in data) {
                var test = data[clname];
                if (classname == undefined || test.classname === classname)
                    ret.push(test.filename);
            }
            return ret;
        }
        async loadAllFilesForEntries(entries) {
            var files = [];
            for (let x = 0; x < entries.length; x++) {
                if (files.indexOf(entries[x].filename) === -1)
                    files.push(entries[x].filename);
            }
            await this.loadAllFiles(files);
        }
        /**
         * load all files that registered the service
         * @param {string} service - name of the service
         * @param {function} callback - called when loading is finished
         */
        async loadAllFilesForService(service) {
            var services = this.getAllFilesForService(service);
            await this.loadAllFiles(services);
        }
        /**
         * load all files
         * @param {string} files - the files to load
         */
        async loadAllFiles(files) {
            //   var services = this.getAllFilesForService(service);
            return new Promise((resolve, reject) => {
                var dependency = [];
                for (var x = 0; x < files.length; x++) {
                    var name = files[x];
                    if (name.endsWith(".ts"))
                        name = name.substring(0, name.length - 3);
                    dependency.push(name);
                }
                var req = require;
                req(dependency, function () {
                    resolve(undefined);
                });
            });
        }
    }
    exports.Registry = Registry;
    ;
    var registry = new Registry();
    exports.default = registry;
    function migrateModul(oldModul, newModul) {
        newModul.registry._nextID = oldModul.registry._nextID;
        newModul.registry.entries = oldModul.registry.entries;
    }
    exports.migrateModul = migrateModul;
});
//jassi.registry=registry;
define("jassi/remote/RemoteObject", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes", "jassi/remote/RemoteProtocol"], function (require, exports, Jassi_15, Classes_10, RemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteObject = exports.Context = void 0;
    class Context {
    }
    exports.Context = Context;
    let RemoteObject = class RemoteObject {
        static async call(method, ...parameter) {
            if (Jassi_15.default.isServer)
                throw "should be called on client";
            var prot = new RemoteProtocol_1.RemoteProtocol();
            var context = parameter[parameter.length - 1];
            prot.classname = Classes_10.classes.getClassName(this);
            prot._this = "static";
            prot.parameter = parameter;
            prot.method = method.name;
            prot.parameter.splice(parameter.length - 1, 1);
            var ret;
            if (context === null || context === void 0 ? void 0 : context.transactionitem) {
                ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
                return ret;
            }
            //let Transaction= (await import("jassi/remote/Transaction")).Transaction;
            //var trans=Transaction.cache.get(_this);
            //if(trans&&trans[method.name]){
            //	throw "not implemented"
            //	ret=await trans[method.name][0]._push(undefined,prot.method,prot,trans[method.name][1]);
            //}
            ret = await prot.call();
            return ret;
        }
        async call(_this, method, ...parameter) {
            if (Jassi_15.default.isServer)
                throw "should be called on client";
            var prot = new RemoteProtocol_1.RemoteProtocol();
            var context = parameter[parameter.length - 1];
            prot.classname = Classes_10.classes.getClassName(this);
            prot._this = _this;
            prot.parameter = parameter;
            prot.method = method.name;
            prot.parameter.splice(parameter.length - 1, 1);
            var ret;
            //let context=(await import("jassi/remote/Context")).Context;
            //let Transaction= (await import("jassi/remote/Transaction")).Transaction;
            //var trans=Transaction.cache.get(_this);
            //var trans=context.get("transaction");
            if (context === null || context === void 0 ? void 0 : context.transactionitem) {
                ret = await context.transactionitem.transaction.wait(context.transactionitem, prot);
                return ret;
            }
            ret = await prot.call();
            return ret;
        }
    };
    RemoteObject = __decorate([
        Jassi_15.$Class("jassi.remote.RemoteObject")
    ], RemoteObject);
    exports.RemoteObject = RemoteObject;
});
define("jassi/remote/RemoteProtocol", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Classes"], function (require, exports, Jassi_16, Classes_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RemoteProtocol = void 0;
    let RemoteProtocol = class RemoteProtocol {
        /**
         * converts object to jsonstring
         * if class is registerd in classes then the class is used
         * if id is used then recursive childs are possible
         * @param obj
         */
        stringify(obj) {
            var ref = [];
            return JSON.stringify(obj, function (key, value) {
                var val = {};
                var clname = value === null ? undefined : Classes_11.classes.getClassName(value);
                var k = clname;
                if (k !== undefined) {
                    val.__clname__ = clname;
                    //if (value.id !== undefined)
                    //	k = k + ":" + (value.id === undefined ? RemoteProtocol.counter++ : value.id);
                    //the object was seen the we save a ref
                    if (ref.indexOf(value) >= 0) {
                        val.__ref__ = ref.indexOf(value);
                    }
                    else {
                        Object.assign(val, value);
                        ref.push(value);
                        val.__refid__ = ref.length - 1;
                    }
                }
                else {
                    val = value;
                }
                return val;
            });
        }
        static async simulateUser(user = undefined, password = undefined) {
            var rights = (await new Promise((resolve_12, reject_12) => { require(["jassi/remote/security/Rights"], resolve_12, reject_12); })).default;
            //	if(await rights.isAdmin()){
            //		throw new Error("not an admin")
            //	}
            if (user === undefined) {
                //@ts-ignore
                var Cookies = (await new Promise((resolve_13, reject_13) => { require(["jassi/util/Cookies"], resolve_13, reject_13); })).Cookies;
                Cookies.remove("simulateUser", {});
                Cookies.remove("simulateUserPassword", {});
            }
            else {
                Cookies.set("simulateUser", user, {});
                Cookies.set("simulateUserPassword", password, {});
            }
        }
        async exec(config, object) {
            return await $.ajax(config, object);
        }
        /**
       * call the server
       */
        async call() {
            if (Jassi_16.default.isServer)
                throw new Error("should be called on client");
            var sdataObject = undefined;
            var url = "remoteprotocol?" + Date.now();
            var _this = this;
            var redirect = undefined;
            var config = {
                url: url,
                type: 'post',
                dataType: "text",
                data: this.stringify(this),
            };
            try {
                var ret = await this.exec(config, this._this);
            }
            catch (ex) {
                if (ex.status === 401 || (ex.responseText && ex.responseText.indexOf("jwt expired") !== -1)) {
                    redirect = new Promise((resolve) => {
                        //@ts-ignore
                        new Promise((resolve_14, reject_14) => { require(["jassi/base/LoginDialog"], resolve_14, reject_14); }).then((lib) => {
                            lib.doAfterLogin(resolve, _this);
                        });
                    });
                }
                else {
                    throw ex;
                }
            }
            if (redirect !== undefined)
                return await redirect;
            if (ret === "$$undefined$$")
                return undefined;
            var retval = await this.parse(ret);
            if (retval["**throw error**"] !== undefined) {
                throw new Error(retval["**throw error**"]);
            }
            return retval;
        }
        /**
         * converts jsonstring to an object
         */
        async parse(text) {
            var ref = {};
            if (text === undefined)
                return undefined;
            if (text === "")
                return "";
            //first get all classnames	
            var allclassnames = [];
            JSON.parse(text, function (key, value) {
                if (value === null || value === undefined)
                    return value;
                if (value.__clname__ !== null && value.__clname__ !== undefined && allclassnames.indexOf(value.__clname__) === -1) {
                    allclassnames.push(value.__clname__);
                }
                return value;
            });
            //all classes must be loaded
            for (var x = 0; x < allclassnames.length; x++) {
                await Classes_11.classes.loadClass(allclassnames[x]);
            }
            return JSON.parse(text, function (key, value) {
                var val = value;
                if (value === null || value === undefined)
                    return value;
                if (value.__ref__ !== undefined) {
                    val = ref[value.__ref__];
                    if (val === undefined) {
                        //TODO import types from js
                        //create dummy
                        var type = Classes_11.classes.getClass(value.__clname__);
                        //@ts-ignore
                        var test = type._createObject === undefined ? undefined : type._createObject(val);
                        if (test !== undefined)
                            val = test;
                        else
                            val = new type();
                        ref[value.__ref__] = val;
                    }
                }
                else {
                    if (value.__clname__ !== undefined) {
                        if (value.__refid__ !== undefined && ref[value.__refid__] !== undefined) { //there is a dummy
                            val = ref[value.__refid__];
                        }
                        else {
                            //TODO import types from js
                            var type = Classes_11.classes.getClass(value.__clname__);
                            //@ts-ignore
                            var test = type._createObject === undefined ? undefined : type._createObject(value);
                            if (test !== undefined)
                                val = test;
                            else
                                val = new type();
                            if (value.__refid__ !== undefined) {
                                ref[value.__refid__] = val;
                            }
                        }
                        Object.assign(val, value);
                        delete val.__refid__;
                        delete val.__clname__;
                    }
                }
                //Date conversation
                var datepattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
                if (typeof value === 'string') {
                    var a = datepattern.exec(value);
                    if (a)
                        return new Date(value);
                }
                return val;
            });
        }
        async test() {
            var a = new A();
            var b = new B();
            a.b = b;
            a.name = "max";
            a.id = 9;
            b.a = a;
            b.id = 7;
            var s = this.stringify(a);
            var test = await this.parse(s);
        }
    };
    RemoteProtocol.counter = 0;
    RemoteProtocol = __decorate([
        Jassi_16.$Class("jassi.remote.RemoteProtocol")
    ], RemoteProtocol);
    exports.RemoteProtocol = RemoteProtocol;
    class A {
    }
    //jassi.register("classes", "de.A", A);
    class B {
    }
});
//jassi.register("classes", "de.B", B);
define("jassi/remote/Server", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/RemoteObject", "jassi/remote/FileNode", "jassi/remote/Classes"], function (require, exports, Jassi_17, RemoteObject_2, FileNode_1, Classes_12) {
    "use strict";
    var Server_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Server = void 0;
    let Server = Server_2 = class Server extends RemoteObject_2.RemoteObject {
        constructor() {
            super();
        }
        _convertFileNode(node) {
            var ret = new FileNode_1.FileNode();
            Object.assign(ret, node);
            if (ret.files !== undefined) {
                for (let x = 0; x < ret.files.length; x++) {
                    ret.files[x].parent = ret;
                    var s = ret.fullpath === undefined ? "" : ret.fullpath;
                    ret.files[x].fullpath = s + (s === "" ? "" : "/") + ret.files[x].name;
                    ret.files[x] = this._convertFileNode(ret.files[x]);
                }
            }
            return ret;
        }
        async fillFilesInMapIfNeeded() {
            if (Server_2.filesInMap)
                return;
            var ret = {};
            for (var mod in Jassi_17.default.modules) {
                if (Jassi_17.default.modules[mod].endsWith(".js")) {
                    var code = await $.ajax({ url: Jassi_17.default.modules[mod] + ".map", dataType: "text" });
                    var data = JSON.parse(code);
                    var files = data.sources;
                    for (let x = 0; x < files.length; x++) {
                        let fname = files[x].substring(files[x].indexOf(mod + "/"));
                        ret[fname] = {
                            id: x,
                            modul: mod
                        };
                    }
                }
            }
            Server_2.filesInMap = ret;
        }
        async addFilesFromMap(root) {
            await this.fillFilesInMapIfNeeded();
            for (var fname in Server_2.filesInMap) {
                let path = fname.split("/");
                var parent = root;
                for (let p = 0; p < path.length; p++) {
                    if (p + 1 < path.length) {
                        let dirname = path[p];
                        var found = undefined;
                        for (let f = 0; f < parent.files.length; f++) {
                            if (parent.files[f].name === dirname)
                                found = parent.files[f];
                        }
                        if (!found) {
                            found = {
                                flag: "fromMap",
                                name: dirname,
                                files: []
                            };
                            parent.files.push(found);
                        }
                        parent = found;
                    }
                    else {
                        parent.files.push({
                            flag: "fromMap",
                            name: path[p],
                            date: undefined
                        });
                    }
                }
            }
        }
        /**
        * gets alls ts/js-files from server
        * @param {Promise<string>} [async] - returns a Promise for asynchros handling
        * @returns {string[]} - list of files
        */
        async dir(withDate = false, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret;
                if ((await Server_2.isOnline(context)) === true)
                    ret = await this.call(this, this.dir, withDate, context);
                else
                    ret = { name: "", files: [] };
                await this.addFilesFromMap(ret);
                ret.fullpath = ""; //root
                let r = this._convertFileNode(ret);
                return r;
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_15, reject_15) => { require(["jassi/server/Filesystem"], resolve_15, reject_15); });
                var rett = await new fs.default().dir("", withDate);
                return rett;
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
        async zip(directoryname, serverdir = undefined, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.zip, directoryname, serverdir, context);
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_16, reject_16) => { require(["jassi/server/Filesystem"], resolve_16, reject_16); });
                return await new fs.default().zip(directoryname, serverdir);
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
        /**
         * gets the content of a file from server
         * @param {string} fileNamew
         * @returns {string} content of the file
         */
        async loadFiles(fileNames, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.loadFiles, fileNames, context);
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_17, reject_17) => { require(["jassi/server/Filesystem"], resolve_17, reject_17); });
                return new fs.default().loadFiles(fileNames);
                // return ["jassi/base/ChromeDebugger.ts"];
            }
        }
        /**
         * gets the content of a file from server
         * @param {string} fileName
         * @returns {string} content of the file
         */
        async loadFile(fileName, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                await this.fillFilesInMapIfNeeded();
                if (Server_2.filesInMap[fileName]) {
                    //perhabs the files ar in localserver?
                    var Filessystem = Classes_12.classes.getClass("jassi_localserver.Filessystem");
                    if (Filessystem && (await new Filessystem().loadFileEntry(fileName) !== undefined)) {
                        //use ajax
                    }
                    else {
                        var found = Server_2.filesInMap[fileName];
                        var code = await this.loadFile(Jassi_17.default.modules[found.modul] + ".map", context);
                        var data = JSON.parse(code).sourcesContent[found.id];
                        return data;
                    }
                }
                return $.ajax({ url: fileName, dataType: "text" });
                //return await this.call(this,"loadFile", fileName);
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_18, reject_18) => { require(["jassi/server/Filesystem"], resolve_18, reject_18); });
                var rett = new fs.default().loadFile(fileName);
                return rett;
            }
        }
        /**
        * put the content to a file
        * @param [{string}] fileNames - the name of the file
        * @param [{string}] contents
        */
        async saveFiles(fileNames, contents, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var allfileNames = [];
                var allcontents = [];
                var alltsfiles = [];
                for (var f = 0; f < fileNames.length; f++) {
                    var _this = this;
                    var fileName = fileNames[f];
                    var content = contents[f];
                    if (fileName.endsWith(".ts") || fileName.endsWith(".js")) {
                        //@ts-ignore
                        var tss = await new Promise((resolve_19, reject_19) => { require(["jassi_editor/util/Typescript"], resolve_19, reject_19); });
                        var rets = await tss.default.transpile(fileName, content);
                        allfileNames = allfileNames.concat(rets.fileNames);
                        allcontents = allcontents.concat(rets.contents);
                        alltsfiles.push(fileName);
                    }
                    else {
                        allfileNames.push(fileName);
                        allcontents.push(content);
                    }
                }
                var res = await this.call(this, this.saveFiles, allfileNames, allcontents, context);
                if (res === "") {
                    //@ts-ignore
                    $.notify(fileName + " saved", "info", { position: "bottom right" });
                    for (var x = 0; x < alltsfiles.length; x++) {
                        await $.ajax({ url: alltsfiles[x], dataType: "text" });
                    }
                }
                else {
                    //@ts-ignore
                    $.notify(fileName + " not saved", "error", { position: "bottom right" });
                    throw Error(res);
                }
                return res;
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_20, reject_20) => { require(["jassi/server/Filesystem"], resolve_20, reject_20); });
                var ret = await new fs.default().saveFiles(fileNames, contents, true);
                return ret;
            }
        }
        /**
        * put the content to a file
        * @param {string} fileName - the name of the file
        * @param {string} content
        */
        async saveFile(fileName, content, context = undefined) {
            /*await this.fillFilesInMapIfNeeded();
            if (Server.filesInMap[fileName]) {
                //@ts-ignore
                 $.notify(fileName + " could not be saved on server", "error", { position: "bottom right" });
                return;
            }*/
            return await this.saveFiles([fileName], [content], context);
            /* if (!jassi.isServer) {
                 var ret = await this.call(this, "saveFiles", fileNames, contents);
                 //@ts-ignore
                 //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                 return ret;
             } else {
                 //@ts-ignore
                 var fs: any = await import("jassi/server/Filesystem");
                 return new fs.default().saveFiles(fileNames, contents);
             }*/
        }
        /**
        * deletes a file or directory
        **/
        async delete(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.delete, name, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_21, reject_21) => { require(["jassi/server/Filesystem"], resolve_21, reject_21); });
                return await new fs.default().remove(name);
            }
        }
        /**
         * renames a file or directory
         **/
        async rename(oldname, newname, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.rename, oldname, newname, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_22, reject_22) => { require(["jassi/server/Filesystem"], resolve_22, reject_22); });
                return await new fs.default().rename(oldname, newname);
                ;
            }
        }
        /**
        * is the nodes server running
        **/
        static async isOnline(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                try {
                    if (this.isonline === undefined)
                        Server_2.isonline = await this.call(this.isOnline, context);
                    return await Server_2.isonline;
                }
                catch (_a) {
                    return false;
                }
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
            }
            else {
                return true;
            }
        }
        /**
         * creates a file
         **/
        async createFile(filename, content, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createFile, filename, content, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_23, reject_23) => { require(["jassi/server/Filesystem"], resolve_23, reject_23); });
                return await new fs.default().createFile(filename, content);
            }
        }
        /**
        * creates a file
        **/
        async createFolder(foldername, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var ret = await this.call(this, this.createFolder, foldername, context);
                //@ts-ignore
                //  $.notify(fileNames[0] + " and more saved", "info", { position: "bottom right" });
                return ret;
            }
            else {
                //@ts-ignore
                var fs = await new Promise((resolve_24, reject_24) => { require(["jassi/server/Filesystem"], resolve_24, reject_24); });
                return await new fs.default().createFolder(foldername);
            }
        }
        static async mytest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.mytest, context);
            }
            else
                return 14; //this is called on server
        }
    };
    Server.isonline = undefined;
    //files found in js.map of modules in the jassi.json
    Server.filesInMap = undefined;
    Server = Server_2 = __decorate([
        Jassi_17.$Class("jassi.remote.Server"),
        __metadata("design:paramtypes", [])
    ], Server);
    exports.Server = Server;
    async function test() {
        var byteCharacters = atob(await new Server().zip("local"));
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        // If you want to use the image in your DOM:
        var blob = new Blob([byteArray], { type: "application/zip" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = url;
        link.click();
        link.remove();
    }
    exports.test = test;
});
define("jassi/remote/Transaction", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/RemoteObject"], function (require, exports, Jassi_18, RemoteObject_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transaction = exports.TransactionItem = void 0;
    //var serversession;
    class TransactionItem {
        constructor() {
            this.result = "**unresolved**";
        }
    }
    exports.TransactionItem = TransactionItem;
    let Transaction = class Transaction extends RemoteObject_3.RemoteObject {
        constructor() {
            super(...arguments);
            this.statements = [];
            this.context = new RemoteObject_3.Context();
        }
        async execute() {
            //  return this.context.register("transaction", this, async () => {
            for (var x = 0; x < this.statements.length; x++) {
                var it = this.statements[x];
                var context = {
                    isServer: false,
                    transaction: this,
                    transactionitem: it
                };
                it.promise = it.obj[it.method.name](...it.params, context);
                it.promise.then((val) => {
                    it.result = val; //promise returned or resolved out of Transaction
                });
            }
            let _this = this;
            await new Promise((res) => {
                _this.ready = res;
            });
            var ret = [];
            for (let x = 0; x < this.statements.length; x++) {
                var res = await this.statements[x].promise;
                ret.push(res);
            }
            return ret;
            //  });
        }
        async wait(transactionItem, prot) {
            transactionItem.remoteProtocol = prot;
            //if all transactions are placed then do the request
            var foundUnplaced = false;
            for (let x = 0; x < this.statements.length; x++) {
                let it = this.statements[x];
                if (it.result === "**unresolved**" && it.remoteProtocol === undefined)
                    foundUnplaced = true;
            }
            if (foundUnplaced === false) {
                this.sendRequest();
            }
            let _this = this;
            return new Promise((res) => {
                transactionItem.resolve = res;
            }); //await this.statements[id].result;//wait for result - comes with Request
        }
        async sendRequest(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var prots = [];
                for (let x = 0; x < this.statements.length; x++) {
                    let st = this.statements[x];
                    if (st.result !== "**unresolved**")
                        prots.push(undefined);
                    else
                        prots.push(st.remoteProtocol.stringify(st.remoteProtocol));
                }
                var sic = this.statements;
                this.statements = prots;
                var ret = await this.call(this, this.sendRequest, context);
                this.statements = sic;
                for (let x = 0; x < this.statements.length; x++) {
                    this.statements[x].resolve(ret[x]);
                }
                this.ready();
                //ret is not what we want - perhaps there is a modification
                /* let ret2=[];
                 for(let x=0;x<this.statements.length;x++){
                     ret2.push(await this.statements[x].promise);
                 }
                 this.resolve(ret);*/
                return true;
            }
            else {
                //@ts-ignore
                //@ts-ignore
                var ObjectTransaction = (await new Promise((resolve_25, reject_25) => { require(["jassi/remote/ObjectTransaction"], resolve_25, reject_25); })).ObjectTransaction;
                var ot = new ObjectTransaction();
                ot.statements = [];
                let ret = [];
                for (let x = 0; x < this.statements.length; x++) {
                    var stat = {
                        result: "**unresolved**"
                    };
                    ot.statements.push(stat);
                }
                for (let x = 0; x < this.statements.length; x++) {
                    ret.push(this.doServerStatement(this.statements, ot, x, context));
                }
                for (let x = 0; x < ret.length; x++) {
                    ret[x] = await ret[x];
                }
                return ret;
            }
        }
        async doServerStatement(statements, ot /*:ObjectTransaction*/, num, context) {
            //@ts-ignore
            var _execute = (await new Promise((resolve_26, reject_26) => { require(["jassi/server/DoRemoteProtocol"], resolve_26, reject_26); }))._execute;
            var _this = this;
            var newcontext = {};
            Object.assign(newcontext, context);
            newcontext.objecttransaction = ot;
            newcontext.objecttransactionitem = ot.statements[num];
            //@ts-ignore
            ot.statements[num].result = _execute(_this.statements[num], context.request, newcontext);
            return ot.statements[num].result;
        }
        add(obj, method, ...params) {
            var ti = new TransactionItem();
            ti.method = method;
            ti.obj = obj;
            ti.params = params;
            ti.transaction = this;
            this.statements.push(ti);
        }
    };
    Transaction = __decorate([
        Jassi_18.$Class("jassi.remote.Transaction")
    ], Transaction);
    exports.Transaction = Transaction;
});
define("jassi/remote/hallo", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OO = void 0;
    class KK {
    }
    class OO {
        constructor() {
            this.hallo = "";
        }
        static test() {
            //  var result = Reflect.getOwnMetadata("design:type", OO,"hallo");
            //  var result = Reflect.getMetadata("design:type", OO,"hallo");
            //  var jj=Reflect.getMetadataKeys(OO);
            //  var jj2=Reflect.getOwnMetadataKeys(OO);
        }
    }
    exports.OO = OO;
});
define("jassi/remote/security/Group", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/security/ParentRight", "jassi/remote/security/User", "jassi/remote/security/Right"], function (require, exports, DBObject_2, Jassi_19, DatabaseSchema_3, ParentRight_1, User_1, Right_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Group = void 0;
    //import "jassi/ext/enableExtension.js?de.Kunde";
    let Group = class Group extends DBObject_2.DBObject {
    };
    __decorate([
        DatabaseSchema_3.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Group.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_3.Column(),
        __metadata("design:type", String)
    ], Group.prototype, "name", void 0);
    __decorate([
        DatabaseSchema_3.JoinTable(),
        DatabaseSchema_3.ManyToMany(type => ParentRight_1.ParentRight, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "parentRights", void 0);
    __decorate([
        DatabaseSchema_3.JoinTable(),
        DatabaseSchema_3.ManyToMany(type => Right_1.Right, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "rights", void 0);
    __decorate([
        DatabaseSchema_3.ManyToMany(type => User_1.User, ob => ob.groups),
        __metadata("design:type", Array)
    ], Group.prototype, "users", void 0);
    Group = __decorate([
        DBObject_2.$DBObject({ name: "jassi_group" }),
        Jassi_19.$Class("jassi.remote.security.Group")
    ], Group);
    exports.Group = Group;
});
define("jassi/remote/security/ParentRight", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/security/Group"], function (require, exports, DBObject_3, Jassi_20, DatabaseSchema_4, Group_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParentRight = void 0;
    //import "jassi/ext/enableExtension.js?de.Kunde";
    let ParentRight = class ParentRight extends DBObject_3.DBObject {
    };
    __decorate([
        DatabaseSchema_4.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_4.Column(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "name", void 0);
    __decorate([
        DatabaseSchema_4.Column(),
        __metadata("design:type", String)
    ], ParentRight.prototype, "classname", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i1", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", Number)
    ], ParentRight.prototype, "i2", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s1", void 0);
    __decorate([
        DatabaseSchema_4.Column({ nullable: true }),
        __metadata("design:type", String)
    ], ParentRight.prototype, "s2", void 0);
    __decorate([
        DatabaseSchema_4.ManyToMany(type => Group_1.Group, ob => ob.parentRights),
        __metadata("design:type", Array)
    ], ParentRight.prototype, "groups", void 0);
    ParentRight = __decorate([
        DBObject_3.$DBObject({ name: "jassi_parentright" }),
        Jassi_20.$Class("jassi.remote.security.ParentRight")
    ], ParentRight);
    exports.ParentRight = ParentRight;
});
define("jassi/remote/security/Right", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/security/Group"], function (require, exports, DBObject_4, Jassi_21, DatabaseSchema_5, Group_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Right = void 0;
    //import "jassi/ext/enableExtension.js?de.Kunde";
    let Right = class Right extends DBObject_4.DBObject {
    };
    __decorate([
        DatabaseSchema_5.PrimaryColumn(),
        __metadata("design:type", Number)
    ], Right.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_5.Column(),
        __metadata("design:type", String)
    ], Right.prototype, "name", void 0);
    __decorate([
        DatabaseSchema_5.ManyToMany(type => Group_2.Group, ob => ob.rights),
        __metadata("design:type", Array)
    ], Right.prototype, "groups", void 0);
    Right = __decorate([
        DBObject_4.$DBObject({ name: "jassi_right" }),
        Jassi_21.$Class("jassi.remote.security.Right")
    ], Right);
    exports.Right = Right;
});
define("jassi/remote/security/Rights", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry", "jassi/remote/RemoteObject"], function (require, exports, Jassi_22, Registry_10, RemoteObject_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rights = exports.$CheckParentRight = exports.$ParentRights = exports.$Rights = exports.ParentRightProperties = exports.RightProperties = void 0;
    class RightProperties {
    }
    exports.RightProperties = RightProperties;
    class ParentRightProperties {
    }
    exports.ParentRightProperties = ParentRightProperties;
    function $Rights(rights) {
        return function (pclass) {
            Registry_10.default.register("$Rights", pclass, rights);
        };
    }
    exports.$Rights = $Rights;
    function $ParentRights(rights) {
        return function (pclass) {
            Registry_10.default.register("$ParentRights", pclass, rights);
        };
    }
    exports.$ParentRights = $ParentRights;
    function $CheckParentRight() {
        return function (target, propertyKey, descriptor) {
            Registry_10.default.registerMember("$CheckParentRight", target, propertyKey, undefined);
        };
    }
    exports.$CheckParentRight = $CheckParentRight;
    let Rights = class Rights extends RemoteObject_4.RemoteObject {
        async isAdmin(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (this._isAdmin !== undefined)
                    return this._isAdmin;
                return await this.call(this, this.isAdmin, context);
            }
            else {
                //@ts-ignore
                var req = context.request;
                return req.user.isAdmin;
            }
        }
    };
    Rights = __decorate([
        Jassi_22.$Class("jassi.remote.security.Rights")
    ], Rights);
    exports.Rights = Rights;
    var rights = new Rights();
    exports.default = rights;
});
define("jassi/remote/security/User", ["require", "exports", "jassi/remote/DBObject", "jassi/remote/Jassi", "jassi/util/DatabaseSchema", "jassi/remote/security/Group", "jassi/remote/security/ParentRight"], function (require, exports, DBObject_5, Jassi_23, DatabaseSchema_6, Group_3, ParentRight_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.User = void 0;
    let User = class User extends DBObject_5.DBObject {
        /**
       * reload the object from jassi.db
       */
        async hallo(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.hallo, context);
            }
            else {
                return 11;
            }
        }
        async save() {
            return await super.save();
        }
    };
    __decorate([
        DatabaseSchema_6.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        DatabaseSchema_6.Column(),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        DatabaseSchema_6.Column({ select: false }),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    __decorate([
        DatabaseSchema_6.JoinTable(),
        DatabaseSchema_6.ManyToMany(type => Group_3.Group, ob => ob.users),
        __metadata("design:type", Array)
    ], User.prototype, "groups", void 0);
    __decorate([
        DatabaseSchema_6.Column({ nullable: true }),
        __metadata("design:type", Boolean)
    ], User.prototype, "isAdmin", void 0);
    User = __decorate([
        DBObject_5.$DBObject({ name: "jassi_user" }),
        Jassi_23.$Class("jassi.remote.security.User")
    ], User);
    exports.User = User;
    async function test() {
        var gps = await (Group_3.Group.find({}));
    }
    exports.test = test;
    async function test2() {
        var user = new User();
        user.id = 1;
        user.email = "a@b.com";
        user.password = "";
        var group1 = new Group_3.Group();
        group1.id = 1;
        group1.name = "Mandanten I";
        var group2 = new Group_3.Group();
        group2.id = 2;
        group2.name = "Mandanten 2";
        var pr1 = new ParentRight_2.ParentRight();
        pr1.id = 10;
        pr1.classname = "de.Kunde";
        pr1.name = "Kunden";
        pr1.i1 = 1;
        pr1.i2 = 4;
        await pr1.save();
        var pr2 = new ParentRight_2.ParentRight();
        pr2.id = 11;
        pr2.classname = "de.Kunde";
        pr2.name = "Kunden";
        pr2.i1 = 6;
        pr2.i2 = 10;
        await pr2.save();
        group1.parentRights = [pr1];
        await group1.save();
        group2.parentRights = [pr2];
        await group2.save();
        user.groups = [group1, group2];
        await user.save();
    }
    exports.test2 = test2;
});
define("jassi/security/GroupView", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/remote/security/Group", "jassi/ui/DBObjectView"], function (require, exports, Jassi_24, Property_1, Group_4, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.GroupView = void 0;
    let GroupView = class GroupView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "GroupView" : "GroupView " + this.value.id;
        }
        layout(me) {
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Group_4.Group !== "undefined" && Group_4.Group) === "function" ? _a : Object)
    ], GroupView.prototype, "value", void 0);
    GroupView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "{{dbfullclassname}}" }),
        Jassi_24.$Class("jassi/security/GroupView"),
        __metadata("design:paramtypes", [])
    ], GroupView);
    exports.GroupView = GroupView;
    async function test() {
        var ret = new GroupView;
        ret["value"] = await Group_4.Group.findOne();
        return ret;
    }
    exports.test = test;
});
define("jassi/security/UserView", ["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/remote/security/User", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_25, Property_2, User_2, DBObjectView_2) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.UserView = void 0;
    let UserView = class UserView extends DBObjectView_2.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "User" : "User " + this.value.email;
        }
        layout(me) {
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            this.add(me.textbox1);
            this.add(me.textbox2);
            me.textbox1.bind(me.databinder, "id");
            me.textbox1.width = 40;
            me.textbox1.converter = new NumberConverter_1.NumberConverter();
            me.textbox2.bind(me.databinder, "email");
        }
        createObject() {
            super.createObject();
            this.value.password = Math.random().toString(36).slice(-8); //random password
            $.notify("random password set: " + this.value.password, "info", { position: "right" });
            console.log("random password set: " + this.value.password);
        }
    };
    __decorate([
        Property_2.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof User_2.User !== "undefined" && User_2.User) === "function" ? _a : Object)
    ], UserView.prototype, "value", void 0);
    UserView = __decorate([
        DBObjectView_2.$DBObjectView({ classname: "jassi.security.User" }),
        Jassi_25.$Class("jassi/UserView"),
        __metadata("design:paramtypes", [])
    ], UserView);
    exports.UserView = UserView;
    async function test() {
        var ret = new UserView();
        ret["value"] = await User_2.User.findOne();
        return ret;
    }
    exports.test = test;
});
define("jassi/template/TemplateDBDialog", ["require", "exports", "jassi/base/Actions", "jassi/remote/Jassi", "jassi/ui/OptionDialog", "jassi/ui/FileExplorer", "jassi/ui/Property", "jassi/remote/DBObject", "jassi/remote/Classes", "jassi/remote/Registry"], function (require, exports, Actions_2, Jassi_26, OptionDialog_2, FileExplorer_1, Property_3, DBObject_6, Classes_13, Registry_11) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateDBDialog = exports.TemplateDBDialogProperties = void 0;
    const code = `import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { {{dbclassname}} } from "{{dbfilename}}";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: {{dbclassname}};
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "{{dialogname}}" : "{{dialogname}} " + this.value.id;
    }
    layout(me: Me) {
    }
}

export async function test(){
	var ret=new {{dialogname}};
	
	ret["value"]=<{{dbclassname}}>await {{dbclassname}}.findOne({ relations: ["*"] });
	return ret;
}`;
    let TemplateDBDialogProperties = class TemplateDBDialogProperties {
    };
    __decorate([
        Property_3.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TemplateDBDialogProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_3.$Property({ type: "classselector", service: "$DBObject" }),
        __metadata("design:type", typeof (_a = typeof DBObject_6.DBObject !== "undefined" && DBObject_6.DBObject) === "function" ? _a : Object)
    ], TemplateDBDialogProperties.prototype, "dbobject", void 0);
    TemplateDBDialogProperties = __decorate([
        Jassi_26.$Class("jassi.ui.TemplateDBDialogProperties")
    ], TemplateDBDialogProperties);
    exports.TemplateDBDialogProperties = TemplateDBDialogProperties;
    let TemplateDBDialog = class TemplateDBDialog {
        static async newFile(all) {
            var props = new TemplateDBDialogProperties();
            var res = await OptionDialog_2.OptionDialog.askProperties("Create new DBDialog:", props, ["ok", "cancel"], undefined, false);
            if (res.button === "ok") {
                var scode = code.replaceAll("{{dialogname}}", props.dialogname);
                var fulldbclassname = Classes_13.classes.getClassName(props.dbobject);
                var shortdbclassname = fulldbclassname.split(".")[fulldbclassname.split(".").length - 1];
                var cl = await Registry_11.default.getJSONData("$Class", fulldbclassname);
                var dbfilename = cl[0].filename;
                dbfilename = dbfilename.substring(0, dbfilename.length - 3);
                scode = scode.replaceAll("{{fullclassname}}", (all[0].fullpath + "/" + props.dialogname).replaceAll("/", "."));
                scode = scode.replaceAll("{{dbclassname}}", shortdbclassname);
                scode = scode.replaceAll("{{fulldbclassname}}", fulldbclassname);
                scode = scode.replaceAll("{{dbfilename}}", dbfilename);
                FileExplorer_1.FileActions.newFile(all, props.dialogname + ".ts", scode, true);
            }
        }
    };
    TemplateDBDialog.code = code;
    __decorate([
        Actions_2.$Action({
            name: "New/DBDialog",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateDBDialog, "newFile", null);
    TemplateDBDialog = __decorate([
        Actions_2.$ActionProvider("jassi.remote.FileNode"),
        Jassi_26.$Class("jassi.ui.TemplateDBDialog")
    ], TemplateDBDialog);
    exports.TemplateDBDialog = TemplateDBDialog;
});
define("jassi/template/TemplateDBObject", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/base/Actions", "jassi/ui/OptionDialog", "jassi/ui/FileExplorer"], function (require, exports, Jassi_27, Property_4, Actions_3, OptionDialog_3, FileExplorer_2) {
    "use strict";
    var TemplateDBObject_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateDBObject = exports.TemplateDBObjectProperties = void 0;
    var code = `import {DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany,JoinColumn,JoinTable } from "jassi/util/DatabaseSchema";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";


@$DBObject()
@$Class("{{fullclassname}}")

export class {{classname}} extends DBObject {

    {{PrimaryAnnotator}}
    id: number;
  
    constructor() {
        super();
    }
}


export async function test() {
};`;
    let TemplateDBObjectProperties = class TemplateDBObjectProperties {
    };
    __decorate([
        Property_4.$Property({ decription: "name of the db class" }),
        __metadata("design:type", String)
    ], TemplateDBObjectProperties.prototype, "name", void 0);
    __decorate([
        Property_4.$Property({ default: "true", description: "the primary column alue will be automatically generated with an auto-increment value" }),
        __metadata("design:type", String)
    ], TemplateDBObjectProperties.prototype, "autogeneratedid", void 0);
    TemplateDBObjectProperties = __decorate([
        Jassi_27.$Class("jassi.ui.TemplateDBDialogProperties")
    ], TemplateDBObjectProperties);
    exports.TemplateDBObjectProperties = TemplateDBObjectProperties;
    let TemplateDBObject = TemplateDBObject_2 = class TemplateDBObject {
        static async newFile(all) {
            var props = new TemplateDBObjectProperties();
            var res = await OptionDialog_3.OptionDialog.askProperties("Create Database Class:", props, ["ok", "cancel"], undefined, false);
            if (res.button === "ok") {
                var scode = TemplateDBObject_2.code.replaceAll("{{fullclassname}}", all[0].fullpath + "/" + props.name);
                scode = scode.replaceAll("{{classname}}", props.name);
                var anno = "@PrimaryColumn()";
                if (props.autogeneratedid)
                    anno = "@PrimaryGeneratedColumn()";
                scode = scode.replaceAll("{{PrimaryAnnotator}}", anno);
                FileExplorer_2.FileActions.newFile(all, props.name + ".ts", scode, true);
            }
        }
    };
    TemplateDBObject.code = code;
    __decorate([
        Actions_3.$Action({
            name: "New/DBObject",
            isEnabled: function (all) {
                return all[0].isDirectory() && all[0].fullpath.startsWith("remote/");
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateDBObject, "newFile", null);
    TemplateDBObject = TemplateDBObject_2 = __decorate([
        Actions_3.$ActionProvider("jassi.remote.FileNode"),
        Jassi_27.$Class("jassi.ui.TemplateDBObject")
    ], TemplateDBObject);
    exports.TemplateDBObject = TemplateDBObject;
});
define("jassi/template/TemplateEmptyDialog", ["require", "exports", "jassi/base/Actions", "jassi/remote/Jassi", "jassi/ui/OptionDialog", "jassi/ui/FileExplorer"], function (require, exports, Actions_4, Jassi_28, OptionDialog_4, FileExplorer_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateEmptyDialog = void 0;
    const code = `import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";

type Me = {
}

@$Class("{{fullclassname}}")
export class {{dialogname}} extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
	}
}

export async function test(){
	var ret=new {{dialogname}}();
	return ret;
}`;
    let TemplateEmptyDialog = class TemplateEmptyDialog {
        static async newFile(all) {
            var res = await OptionDialog_4.OptionDialog.show("Enter dialog name:", ["ok", "cancel"], undefined, true, "Dialog");
            if (res.button === "ok" && res.text !== all[0].name) {
                var scode = code.replaceAll("{{dialogname}}", res.text);
                scode = scode.replaceAll("{{fullclassname}}", all[0].fullpath + "/" + res.text);
                FileExplorer_3.FileActions.newFile(all, res.text + ".ts", scode, true);
            }
        }
    };
    TemplateEmptyDialog.code = code;
    __decorate([
        Actions_4.$Action({
            name: "New/Dialog",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateEmptyDialog, "newFile", null);
    TemplateEmptyDialog = __decorate([
        Actions_4.$ActionProvider("jassi.remote.FileNode"),
        Jassi_28.$Class("jassi.ui.TemplateEmptyDialog")
    ], TemplateEmptyDialog);
    exports.TemplateEmptyDialog = TemplateEmptyDialog;
});
define("jassi/ui/ActionNodeMenu", ["require", "exports", "jassi/ui/Menu", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/base/Actions", "jassi/base/ActionNode", "jassi/ui/MenuItem"], function (require, exports, Menu_1, Jassi_29, Panel_2, Actions_5, ActionNode_1, MenuItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ActionNodeMenu = void 0;
    let ActionNodeMenu = class ActionNodeMenu extends Panel_2.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.menu = new Menu_1.Menu();
            me.menu.width = 150;
            this.add(me.menu);
            this.fillActions();
        }
        async fillActions() {
            var actions = await Actions_5.Actions.getActionsFor([new ActionNode_1.ActionNode()]); //Class Actions
            actions.forEach(action => {
                var path = action.name.split("/"); //childmenus
                var parent = this.me.menu;
                for (var i = 0; i < path.length; i++) {
                    if (i === path.length - 1) {
                        var men = new MenuItem_1.MenuItem();
                        men["_classaction"] = true;
                        men.text = path[i];
                        men.icon = action.icon;
                        men.onclick(() => action.call(undefined));
                        parent.add(men);
                    }
                    else {
                        var name = path[i];
                        var found = undefined;
                        parent._components.forEach((men) => {
                            if (men.text === name)
                                found = men.items;
                        });
                        if (found === undefined) {
                            var men = new MenuItem_1.MenuItem();
                            men["_classaction"] = true;
                            men.text = name;
                            parent.add(men);
                            parent = men.items;
                        }
                        else {
                            parent = found;
                        }
                    }
                }
            });
        }
    };
    ActionNodeMenu = __decorate([
        Jassi_29.$Class("jassi/ui/ActionNodeMenu"),
        __metadata("design:paramtypes", [])
    ], ActionNodeMenu);
    exports.ActionNodeMenu = ActionNodeMenu;
    async function test() {
        var ret = new ActionNodeMenu();
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/BoxPanel", ["require", "exports", "jassi/ui/Panel", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/Property", "jassi/remote/Classes", "jassi/ext/split"], function (require, exports, Panel_3, Jassi_30, Component_2, Property_5, Classes_14, split_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.BoxPanel = void 0;
    let BoxPanel = class BoxPanel extends Panel_3.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            $(this.domWrapper).addClass('BoxPanel').removeClass('Panel');
            this.horizontal = false;
            $(this.dom).css("display", "flex");
        }
        /**
         * @member {boolean} - if true then the components are composed horizontally
         **/
        set horizontal(value) {
            this._horizontal = value;
            if (value)
                $(this.dom).css("flex-direction", "row");
            else
                $(this.dom).css("flex-direction", "column");
            this.updateSpliter();
            /*	this._horizontal=value;
                var jj=	$(this.dom).find(".jcomponent");
                if(this._horizontal){
                    $(this.dom).css("display","table");
                    $(this.dom).find(".jcomponent").css("display","table-row");
               }else{
                    $(this.dom).css("display","flex");
                    $(this.dom).find(".jcomponent").css("display","table-cell");
               }*/
        }
        get horizontal() {
            return this._horizontal;
        }
        /**
        * adds a component to the container
        * @param {jassi.ui.Component} component - the component to add
        */
        add(component) {
            /* if(this._horizontal){
                        $(component.domWrapper).css("display","table-row");
             }else{
                        $(component.domWrapper).css("display","table-cell");
             }*/
            super.add(component);
            this.updateSpliter();
        }
        /**
        * adds a component to the container before an other component
        * @param {jassi.ui.Component} component - the component to add
        * @param {jassi.ui.Component} before - the component before then component to add
        */
        addBefore(component, before) {
            /*if(this._horizontal){
                    $(component.domWrapper).css("display","table-row");
               }else{
                    $(component.domWrapper).css("display","table-cell");
               }*/
            super.addBefore(component, before);
            this.updateSpliter();
        }
        /**
         * set the size of splitter e.g. [40,60] the firstcomponent size is 40%
         */
        set spliter(size) {
            this._spliter = size;
            this.updateSpliter();
        }
        get spliter() {
            return this._spliter;
        }
        updateSpliter() {
            if (this._splitcomponent) {
                this._splitcomponent.destroy();
                this._splitcomponent = undefined;
            }
            if (!this._spliter)
                return;
            var comp = [];
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]["designDummyFor"])
                    continue;
                $(this._components[x].__dom).css("width", this.horizontal ? "calc(100% - 5px)" : "100%");
                $(this._components[x].__dom).css("height", this.horizontal ? "100%" : "calc(100% - 5px)");
                comp.push(this._components[x].domWrapper);
            }
            this._splitcomponent = split_1.default(comp, {
                sizes: this._spliter,
                gutterSize: 8,
                minSize: [50, 50, 50, 50, 50, 50, 50, 50],
                direction: this.horizontal ? 'horizontal' : 'vertical'
            });
        }
    };
    __decorate([
        Property_5.$Property({ default: true }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], BoxPanel.prototype, "horizontal", null);
    __decorate([
        Property_5.$Property({ type: "number[]", description: "set the size of splitter e.g. [40,60] the firstcomponent size is 40%" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], BoxPanel.prototype, "spliter", null);
    BoxPanel = __decorate([
        Component_2.$UIComponent({ fullPath: "common/BoxPanel", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        Jassi_30.$Class("jassi.ui.BoxPanel"),
        Property_5.$Property({ name: "isAbsolute", hide: true, type: "boolean" }),
        __metadata("design:paramtypes", [Object])
    ], BoxPanel);
    exports.BoxPanel = BoxPanel;
    async function test() {
        var HTMLPanel = await Classes_14.classes.loadClass("jassi.ui.HTMLPanel");
        var ret = new BoxPanel();
        var me = {};
        ret["me"] = me;
        ret.horizontal = true;
        me.tb = new HTMLPanel();
        me.tb2 = new HTMLPanel();
        me.tb.value = "l&ouml;&auml;k&ouml;lk &ouml;lsfdk sd&auml;&ouml;flgkdf ";
        me.tb.width = 135;
        me.tb2.value = "löäkölk ölsfdk sdäöflgkdf ";
        ret.add(me.tb);
        ret.add(me.tb2);
        ret.spliter = [40, 60];
        ret.height = "400px";
        ret.width = "400px";
        return ret;
    }
    exports.test = test;
    ;
});
define("jassi/ui/Button", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/Property"], function (require, exports, Jassi_31, Component_3, Property_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Button = void 0;
    let Button = class Button extends Component_3.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<button class="Button" id="dummy" contenteditable=false><span class="buttonspan"><img class="buttonimg"></img></span><span class="buttontext" > </span></button>')[0]);
        }
        /**
        * register an event if the button is clicked
        * @param {function} handler - the function that is called on change
        */
        onclick(handler, removeOldHandler = true) {
            if (removeOldHandler)
                $("#" + this._id).prop("onclick", null).off("click");
            $("#" + this._id).click(function (ob) {
                handler(ob);
            });
        }
        /**
        * @member {string} - the icon of the button
        */
        set icon(icon) {
            var img;
            var el1 = $(this.dom).find(".buttonspan");
            el1.removeClass();
            el1.addClass("buttonspan");
            $(this.dom).find(".buttonimg").attr("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                el1.addClass(icon);
            }
            else {
                $(this.dom).find(".buttonimg").attr("src", icon);
            }
        }
        get icon() {
            var ret = $(this.dom).find(".buttonimg").attr("src");
            if (ret === "") {
                ret = $(this.dom).find(".buttonspan").attr("class").replace("buttonspan ", "");
            }
            return ret;
        }
        /**
         * @member {string} - the caption of the button
         */
        set text(value) {
            $(this.dom).find(".buttontext").html(value);
        }
        get text() {
            return $(this.dom).find(".buttontext").text();
        }
        toggle(setDown = undefined) {
            if (setDown === undefined) {
                $(this.dom).toggleClass("down");
                return $(this.dom).hasClass("down");
            }
            else {
                if (setDown && !$(this.dom).hasClass("down"))
                    $(this.dom).toggleClass("down");
                if (!setDown && $(this.dom).hasClass("down"))
                    $(this.dom).toggleClass("down");
                return $(this.dom).hasClass("down");
            }
        }
    };
    __decorate([
        Property_6.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Button.prototype, "onclick", null);
    __decorate([
        Property_6.$Property({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "icon", null);
    __decorate([
        Property_6.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Button.prototype, "text", null);
    Button = __decorate([
        Component_3.$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } }),
        Jassi_31.$Class("jassi.ui.Button"),
        __metadata("design:paramtypes", [])
    ], Button);
    exports.Button = Button;
    async function test() {
        var Panel = (await (new Promise((resolve_27, reject_27) => { require(["jassi/ui/Panel"], resolve_27, reject_27); }))).Panel;
        var pan = new Panel();
        var but = new Button();
        but.text = "Hallo";
        but.icon = "res/red.jpg"; //"mdi mdi-car";//"res/red.jpg";
        //alert(but.icon);
        pan.add(but);
        pan.width = 100;
        pan.height = 100;
        return pan;
    }
    exports.test = test;
});
define("jassi/ui/CSSProperties", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property"], function (require, exports, Jassi_32, Property_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSSProperties = exports.loadFontIfNedded = void 0;
    var systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    var api = 'https://fonts.googleapis.com/css?family=';
    /**
     * loads googlefonts if needed
     **/
    function loadFontIfNedded(font) {
        if (systemFonts.indexOf(font) === -1) {
            var sfont = font.replaceAll(" ", "+");
            if (!document.getElementById("-->" + api + sfont)) { //"-->https://fonts.googleapis.com/css?family=Aclonica">
                Jassi_32.default.myRequire(api + sfont);
            }
        }
    }
    exports.loadFontIfNedded = loadFontIfNedded;
    let CSSProperties = class CSSProperties {
        static applyTo(properties, component) {
            var prop = {};
            for (let key in properties) {
                var newKey = key.replaceAll("_", "-");
                prop[newKey] = properties[key];
                if (newKey === "font-family") {
                    loadFontIfNedded(prop[newKey]);
                }
            }
            $(component.dom).css(prop);
            return prop;
        }
    };
    __decorate([
        Property_7.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "background_color", void 0);
    __decorate([
        Property_7.$Property(),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "background_image", void 0);
    __decorate([
        Property_7.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_color", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_style", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["thin", "medium", "thick", "2px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "border_width", void 0);
    __decorate([
        Property_7.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "color", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait", "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "cursor", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["blur(5px)", "brightness(0.4)", "contrast(200%)", "drop-shadow(16px 16px 20px blue)", "grayscale(50%)", "hue-rotate(90deg)", "invert(75%)", "opacity(25%)", "saturate(30%)", "sepia(60%)", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "filter", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["left", "right", "none", "inline-start", "inline-end", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "float", void 0);
    __decorate([
        Property_7.$Property({ type: "font" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_family", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["12px", "xx-small", "x-small", "small", "medium", "large", "x-large", "xx-large", "xxx-large", "larger", "smaller", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_size", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["normal", "small-caps", "small-caps slashed-zero", "common-ligatures tabular-nums", "no-common-ligatures proportional-nums", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_variant", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["normal", "bold", "lighter", "bolder", "100", "900", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "font_weight", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["normal", "1px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "letter_spacing", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["normal", "32px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "line_height", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_bottom", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_left", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_right", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "margin_top", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["visible", "hidden", "clip", "scroll", "auto", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "overflow", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_bottom", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_left", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_right", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "padding_top", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["static", "relative", "absolute", "sticky", "fixed", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "position", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["start", "end", "left", "right", "center", "justify", "match-parent", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_align", void 0);
    __decorate([
        Property_7.$Property({ type: "color" }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_color", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["none", "underline", "overline", "line-through", "blink", "spelling-error", "grammar-error", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_line", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["solid", "double", "dotted", "dashed", "wavy", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_style", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["3px"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_decoration_thickness", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["none", "capitalize", "uppercase", "lowercase", "full-width", "full-size-kana", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "text_transform", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom", "3px", "inherit", "initial", "unset"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "vertical_align", void 0);
    __decorate([
        Property_7.$Property({ chooseFrom: ["1", "2", "auto"] }),
        __metadata("design:type", String)
    ], CSSProperties.prototype, "z_index", void 0);
    CSSProperties = __decorate([
        Jassi_32.$Class("jassi.ui.CSSProperties")
    ], CSSProperties);
    exports.CSSProperties = CSSProperties;
});
define("jassi/ui/Calendar", ["require", "exports", "jassi/ui/Textbox", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Property"], function (require, exports, Textbox_2, Component_4, Jassi_33, Property_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Calendar = void 0;
    let Calendar = class Calendar extends Textbox_2.Textbox {
        constructor(properties = undefined) {
            super(properties);
            this._value = undefined;
            $(this.dom).datepicker();
        }
        get value() {
            return $(this.dom).datepicker('getDate');
        }
        set value(val) {
            $(this.dom).datepicker('setDate', val);
        }
        static parseDate(date, format = undefined, settings = undefined) {
            if (settings === undefined)
                settings = $.datepicker.regional[navigator.language.split("-")[0]];
            if (format === undefined)
                format = settings.dateFormat;
            return $.datepicker.parseDate(format, date, settings);
        }
        static formatDate(date, format = undefined, settings = undefined) {
            if (settings === undefined)
                settings = $.datepicker.regional[navigator.language.split("-")[0]];
            if (format === undefined)
                format = settings.dateFormat;
            return $.datepicker.formatDate(format, date, settings);
        }
    };
    Calendar = __decorate([
        Component_4.$UIComponent({ fullPath: "common/Calendar", icon: "mdi mdi-calendar-month" }),
        Jassi_33.$Class("jassi.ui.Calendar"),
        Property_8.$Property({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Calendar);
    exports.Calendar = Calendar;
    function test() {
        var cal = new Calendar();
        cal.value = new Date(1978, 5, 1);
        var h = Calendar.parseDate("18.03.2020");
        var hh = Calendar.formatDate(h);
        var i = cal.value;
        // cal.value=Date.now()
        return cal;
    }
    exports.test = test;
});
define("jassi/ui/Checkbox", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/Property"], function (require, exports, Jassi_34, Component_5, Property_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checkbox = void 0;
    let Checkbox = class Checkbox extends Component_5.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>')[0]);
            this.checkbox = this.dom.firstChild;
            //             $(this.domWrapper).append($('<span class="checkboxtext"></span>'));
        }
        onclick(handler) {
            $(this.checkbox).click(function () {
                handler();
            });
        }
        /**
         * @member {string} - the caption of the button
         */
        set value(value) {
            if (value === "true")
                value = true;
            if (value === "false")
                value = false;
            $(this.checkbox).prop("checked", value);
        }
        get value() {
            return $(this.checkbox).prop("checked");
        }
        /**
        * @member {string} - the caption of the button
        */
        set text(value) {
            $(this.domWrapper).find(".checkboxtext").html(value);
        }
        get text() {
            return $(this.domWrapper).find(".checkboxtext").html();
        }
    };
    __decorate([
        Property_9.$Property({ type: "boolean" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Checkbox.prototype, "value", null);
    __decorate([
        Property_9.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Checkbox.prototype, "text", null);
    Checkbox = __decorate([
        Component_5.$UIComponent({ fullPath: "common/Ceckbox", icon: "mdi mdi-checkbox-marked-outline" }),
        Jassi_34.$Class("jassi.ui.Checkbox"),
        __metadata("design:paramtypes", [])
    ], Checkbox);
    exports.Checkbox = Checkbox;
});
//@class({longname:"jassi.ui.Checkbox"})
define("jassi/ui/Component", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/remote/Registry", "jassi/remote/Classes", "jassi/ui/CSSProperties"], function (require, exports, Jassi_35, Property_10, Registry_12, Classes_15, CSSProperties_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = exports.ComponentCreateProperties = exports.$UIComponent = exports.UIComponentProperties = void 0;
    class UIComponentProperties {
    }
    exports.UIComponentProperties = UIComponentProperties;
    function $UIComponent(properties) {
        return function (pclass) {
            Registry_12.default.register("$UIComponent", pclass, properties);
        };
    }
    exports.$UIComponent = $UIComponent;
    class ComponentCreateProperties {
    }
    exports.ComponentCreateProperties = ComponentCreateProperties;
    let Component = class Component {
        /*  get domWrapper():Element{
              return this._domWrapper;
          }
          set domWrapper(element:Element){
              if(element===undefined){
                  debugger;
              }
              this._domWrapper=element;
          }*/
        /**
         * base class for each Component
         * @class jassi.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            if (properties === undefined || properties.id === undefined) {
            }
            else {
                this._id = properties.id;
                this.__dom = document.getElementById(properties.id);
                this.dom._this = this;
            }
        }
        /**
         * adds an event
         * @param {type} name - the name of the event
         * @param {function} func - callfunction for the event
         */
        addEvent(name, func) {
            var events = this._eventHandler[name];
            if (events === undefined) {
                events = [];
                this._eventHandler[name] = events;
            }
            events.push(func);
        }
        /**
         * call the event
         * @param {name} name - the name of the event
         * @param {object} param 1- parameter for the event
         * @param {object} param 2- parameter for the event
         * @param {object} param 3- parameter for the event
         * @param {object} param 4- parameter for the event
         */
        callEvent(name, param1, param2 = undefined, param3 = undefined, param4 = undefined) {
            var ret = [];
            var events = this._eventHandler[name];
            if (events === undefined)
                return;
            for (var x = 0; x < events.length; x++) {
                ret.push(events[x](param1, param2, param3, param4));
            }
            return ret;
        }
        /**
         * @member {dom} - the dom element
         */
        get dom() {
            return this.__dom;
        }
        set dom(value) {
            var domalt = this.__dom;
            this.__dom = value;
            /** @member {dom} - the dom-element*/
            this.$ = $(value);
            /** @member {numer}  - the id of the element */
            $(this.dom).addClass("jinlinecomponent");
            $(this.dom).addClass("jresizeable");
            if (domalt !== undefined) {
                $(domalt).removeClass("jinlinecomponent");
                $(domalt).removeClass("jresizeable");
            }
            this.dom._this = this;
        }
        static cloneAttributes(target, source) {
            [...source.attributes].forEach(attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue); });
        }
        static replaceWrapper(old, newWrapper) {
            //Component.cloneAttributes(newWrapper,old.domWrapper);
            var cls = $(old.domWrapper).attr("class");
            //var st=$(old.domWrapper).attr("style");
            var id = $(old.domWrapper).attr("id"); //old.domWrapper._id;
            $(newWrapper).attr("id", id);
            $(newWrapper).attr("class", cls);
            //$(newWrapper).attr("style",st);
            while (old.domWrapper.children.length > 0) {
                newWrapper.appendChild(old.domWrapper.children[0]);
            }
            if (old.domWrapper.parentNode != null)
                old.domWrapper.parentNode.replaceChild(newWrapper, old.domWrapper);
            old.domWrapper = newWrapper;
            old.domWrapper._this = old;
            old.domWrapper._id = id;
        }
        /**
         * inits the component
         * @param {dom} dom - init the dom element
         * @paran {object} properties - properties to init
        */
        init(dom, properties = undefined) {
            //is already attached
            if (this.domWrapper !== undefined) {
                if (this.domWrapper.parentNode !== undefined)
                    this.domWrapper.parentNode.removeChild(this.domWrapper);
                this.domWrapper._this = undefined;
            }
            if (this.dom !== undefined) {
                this.__dom._this = undefined;
            }
            //allready watched?
            if (Jassi_35.default.componentSpy !== undefined) {
                Jassi_35.default.componentSpy.unwatch(this);
            }
            this.dom = dom;
            this._id = Registry_12.default.nextID();
            $(this.dom).attr("id", this._id);
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
            //add _this to the dom element
            var lid = Registry_12.default.nextID();
            var st = 'style="display: inline"';
            if (this instanceof Classes_15.classes.getClass("jassi.ui.Container")) {
                st = "";
            }
            if (properties !== undefined && properties.noWrapper === true) {
                this.domWrapper = this.dom;
                this.domWrapper._id = this._id;
                $(this.domWrapper).addClass("jcomponent");
            }
            else {
                /** @member {dom} - the dom element for label*/
                this.domWrapper = $('<div id="' + lid + '" class ="jcomponent"' + st + '></div>')[0];
                this.domWrapper._this = this;
                this.domWrapper._id = lid;
                this.domWrapper.appendChild(dom);
            }
            //append temporary so new elements must not added immediately
            if (document.getElementById("jassitemp") === null) {
                var temp = $('<template id="jassitemp"></template>')[0];
                $(document.body).append(temp);
            }
            //for profilling save code pos
            if (Jassi_35.default.componentSpy !== undefined) {
                Jassi_35.default.componentSpy.watch(this);
            }
            $("#jassitemp")[0].appendChild(this.domWrapper);
        }
        set label(value) {
            if (value === undefined) {
                var lab = $(this.domWrapper).find(".jlabel");
                if (lab.length === 1)
                    this.domWrapper.removeChild(lab[0]);
            }
            else {
                //CHECK children(0)-> first() 
                if ($(this.domWrapper).find(".jlabel").length === 0) {
                    let lab = $('<label class="jlabel" for="' + this._id + '"></label>')[0]; //
                    $(this.domWrapper).prepend(lab);
                }
                $(this.domWrapper).children(":first").html(value);
            }
        }
        /**
         * @member {string} - the label over the component
         */
        get label() {
            //CHECK children(0)-> first()
            if ($(this.domWrapper).first().attr('class') === undefined || !$(this.domWrapper).first().attr('class').startsWith("jlabel")) {
                return "";
            }
            return $(this.domWrapper).children(":first").text();
        }
        get tooltip() {
            return $(this.dom).attr("title");
        }
        /**
        * @member {string} - tooltip for the component
        */
        set tooltip(value) {
            $(this.domWrapper).attr("title", value);
            $(this.domWrapper).tooltip();
        }
        get x() {
            return Number($(this.domWrapper).css("left").replace("px", ""));
        }
        /**
         * @member {number} - the left absolute position
         */
        set x(value) {
            $(this.domWrapper).css("left", value);
            $(this.domWrapper).css("position", "absolute");
        }
        get y() {
            return Number($(this.domWrapper).css("top").replace("px", ""));
        }
        /**
         * @member {number|string} - the top absolute position
         */
        set y(value) {
            $(this.domWrapper).css("top", value);
            $(this.domWrapper).css("position", "absolute");
        }
        /**
         * @member {boolean} - component is hidden
         */
        get hidden() {
            return $(this.__dom).is(":hidden");
        }
        set hidden(value) {
            if (value) {
                this["old_display"] = $(this.__dom).css('display');
                $(this.__dom).css('display', 'none');
            }
            else if ($(this.__dom).css('display') === "none") {
                if (this["old_display"] !== undefined)
                    $(this.__dom).css('display', this["old_display"]);
                else
                    $(this.__dom).removeAttr('display');
            }
        }
        /**
         * @member {string|number} - the height of the component
         * e.g. 50 or "100%"
         */
        set height1(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1)
                $(this.dom).css("height", "100%");
            else
                $(this.dom).css("height", value);
            $(this.domWrapper).css("height", value);
        }
        get height1() {
            return $(this.domWrapper).css("height").replace("px", "");
        }
        /**
         * @member {string|number} - the width of the component
         * e.g. 50 or "100%"
         */
        set width1(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1 && $(this.domWrapper).is("div"))
                $(this.dom).css("width", "100%");
            else
                $(this.dom).css("width", value);
            $(this.domWrapper).css("width", value);
        }
        get width1() {
            return $(this.domWrapper).css("width").replace("px", "");
        }
        /**
        * @member {string|number} - the width of the component
        * e.g. 50 or "100%"
        */
        set width(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1 && $(this.domWrapper).css("display") !== "inline") { //&&$(this.domWrapper).is("div"))7
                $(this.dom).css("width", "100%");
                $(this.domWrapper).css("width", value);
            }
            else {
                $(this.dom).css("width", value);
                $(this.domWrapper).css("width", "");
            }
            //  
        }
        get width() {
            if ($(this.domWrapper).css("width") !== undefined)
                return $(this.domWrapper).css("width");
            return $(this.dom).css("width").replace("px", "");
        }
        /**
         * @member {string|number} - the height of the component
         * e.g. 50 or "100%"
         */
        set height(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1) {
                $(this.dom).css("height", "100%");
                $(this.domWrapper).css("height", value);
            }
            else {
                $(this.dom).css("height", value);
                $(this.domWrapper).css("height", "");
            }
            //$(this.domWrapper).css("height",value);
        }
        get height() {
            if ($(this.domWrapper).css("height") !== undefined)
                return $(this.domWrapper).css("height");
            if ($(this.dom).css("height") !== undefined)
                return undefined;
            return $(this.dom).css("height").replace("px", "");
        }
        /**
        * sets CSS Properties
        */
        css(properties, removeOldProperties = true) {
            var prop = CSSProperties_1.CSSProperties.applyTo(properties, this);
            //if css-properties are already set and now a properties is deleted
            if (this["_lastCssChange"]) {
                for (let key in this["_lastCssChange"]) {
                    if (prop[key] === undefined) {
                        $(this.dom).css(key, "");
                    }
                }
            }
            this["_lastCssChange"] = prop;
        }
        /**
         * maximize the component
         */
        maximize() {
            // $(this.dom).addClass("jmaximized");
            $(this.dom).css("width", "calc(100% - 2px)");
            $(this.dom).css("height", "calc(100% - 2px)");
        }
        get styles() {
            return this._styles;
        }
        set styles(styles) {
            this._styles = styles;
            var newstyles = [];
            styles.forEach((st) => {
                newstyles.push(st.styleid);
            });
            //removeOld
            var classes = $(this.dom).attr("class").split(" ");
            classes.forEach((cl) => {
                if (cl.startsWith("jassistyle") && newstyles.indexOf(cl) === -1) {
                    $(this.dom).removeClass(cl);
                }
            });
            newstyles.forEach((st) => {
                if (classes.indexOf(st) === -1)
                    $(this.dom).addClass(st);
            });
        }
        get contextMenu() {
            return this._contextMenu;
        }
        /**
         * @member {jassi.ui.ContextMenu} - the contextmenu of the component
         **/
        set contextMenu(value) {
            if (this._contextMenu !== undefined)
                this._contextMenu.unregisterComponent(this);
            if (value !== undefined) {
                var ContextMenu = Classes_15.classes.getClass("jassi.ui.ContextMenu");
                if (value instanceof ContextMenu === false) {
                    throw "value is not of type jassi.ui.ContextMenu";
                }
                this._contextMenu = value;
                value.registerComponent(this);
            }
            else
                this._contextMenu = undefined;
        }
        destroy() {
            if (this.contextMenu !== undefined) {
                this.contextMenu.destroy();
            }
            if (Jassi_35.default.componentSpy !== undefined) {
                Jassi_35.default.componentSpy.unwatch(this);
            }
            if (this._parent !== undefined) {
                this._parent.remove(this);
            }
            if (this.domWrapper !== undefined && this.domWrapper.parentNode !== undefined && this.domWrapper.parentNode !== null)
                this.domWrapper.parentNode.removeChild(this.domWrapper);
            if (this.__dom !== undefined) {
                $(this.__dom).remove();
                this.__dom._this = undefined;
                this.__dom = undefined;
            }
            if (this.domWrapper !== undefined) {
                $(this.domWrapper).remove();
                this.domWrapper._this = undefined;
                this.domWrapper = undefined;
            }
            if (this.designDummies) {
                this.designDummies.forEach((dummy) => { dummy.destroy(); });
            }
            this.events = [];
            this.$ = undefined;
        }
        extensionCalled(action) {
        }
    };
    __decorate([
        Property_10.$Property({ description: "adds a label above the component" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Component.prototype, "label", null);
    __decorate([
        Property_10.$Property({ description: "tooltip are displayed on mouse over" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Component.prototype, "tooltip", null);
    __decorate([
        Property_10.$Property({}),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], Component.prototype, "x", null);
    __decorate([
        Property_10.$Property(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], Component.prototype, "y", null);
    __decorate([
        Property_10.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Component.prototype, "hidden", null);
    __decorate([
        Property_10.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "width", null);
    __decorate([
        Property_10.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "height", null);
    __decorate([
        Property_10.$Property({ type: "json", componentType: "jassi.ui.CSSProperties" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_a = typeof CSSProperties_1.CSSProperties !== "undefined" && CSSProperties_1.CSSProperties) === "function" ? _a : Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Component.prototype, "css", null);
    __decorate([
        Property_10.$Property({ type: "componentselector", componentType: "[jassi.ui.Style]" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Component.prototype, "styles", null);
    __decorate([
        Property_10.$Property({ type: "componentselector", componentType: "jassi.ui.ContextMenu" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "contextMenu", null);
    Component = __decorate([
        Jassi_35.$Class("jassi.ui.Component"),
        __metadata("design:paramtypes", [ComponentCreateProperties])
    ], Component);
    exports.Component = Component;
});
define("jassi/ui/ComponentDescriptor", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/remote/Classes", "jassi/remote/Registry"], function (require, exports, Jassi_36, Property_11, Classes_16, Registry_13) {
    "use strict";
    var ComponentDescriptor_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentDescriptor = void 0;
    let ComponentDescriptor = ComponentDescriptor_3 = class ComponentDescriptor {
        /**
        * describes a Component
        * @class jassi.ui.EditorProperty
        */
        constructor() {
            /** @member {[jassi.ui.Property]}  - all property fields which should visible in PropertyEditor*/
            this.fields = [];
            /** @member {[jassi.ui.Property]}  - all property fields which acts are editable*/
            this.editableComponents = [];
        }
        /**
         * describes a class
         * @param {class}  type - the type of the class
         * @param {boolean}  nocache - an uncached version
         * @returns {jassi.ui.ComponentDescriptor} - which describes the component
         */
        static describe(type, nocache = undefined) {
            var _a;
            if (ComponentDescriptor_3.cache === undefined) {
                ComponentDescriptor_3.cache = {};
            }
            var cache = ComponentDescriptor_3.cache[type];
            var allFields = [];
            var isDescribeComponentOverided = undefined;
            if (cache === undefined || nocache === true) {
                var family = [];
                cache = new ComponentDescriptor_3();
                cache.fields = [];
                var hideBaseClassProperties = false;
                do {
                    family.push(type);
                    var sclass = Classes_16.classes.getClassName(type);
                    if (Registry_13.default.getMemberData("$Property") === undefined)
                        return cache;
                    var props = Registry_13.default.getMemberData("$Property")[sclass];
                    if (props !== undefined) {
                        var info = Registry_13.default.getMemberData("design:type")[sclass];
                        for (var key in props) {
                            var data = props[key];
                            for (let x = 0; x < data.length; x++) {
                                if ((_a = data[x][0]) === null || _a === void 0 ? void 0 : _a.hideBaseClassProperties) {
                                    hideBaseClassProperties = data[x][0].hideBaseClassProperties;
                                    continue;
                                }
                                var prop = new Property_11.Property(key);
                                Object.assign(prop, data[x][0]);
                                if (prop.type === undefined) {
                                    if (info !== undefined && info[key] !== undefined) {
                                        var tp = info[key][0][0];
                                        if (tp.name === "String")
                                            prop.type = "string";
                                        else if (tp.name === "Number")
                                            prop.type = "number";
                                        else if (tp.name === "Boolean")
                                            prop.type = "boolean";
                                        else if (tp.name === "Function")
                                            prop.type = "function";
                                        else
                                            prop.type = Classes_16.classes.getClassName(tp);
                                    }
                                }
                                if (prop.type === undefined && prop.hide !== true)
                                    throw "Property Type not found:" + sclass + "." + key;
                                if (cache.fields !== undefined && allFields.indexOf(prop.name) === -1) {
                                    cache.fields.push(prop);
                                    allFields.push(prop.name);
                                }
                            }
                        }
                    }
                    type = type.__proto__;
                } while (type !== null && type.name !== "" && !hideBaseClassProperties);
                //Hidden fields
                if (cache.fields !== undefined) {
                    for (let c = 0; c < cache.fields.length; c++) {
                        if (cache.fields[c].hide === true) {
                            cache.fields.splice(c--, 1);
                        }
                    }
                }
            }
            return cache;
        }
        /**
         * get the ids of all editable Components by the designer
         * @param {jassi.ui.Component} component - the component to inspect
         * @param {boolean} idFromLabel - if true not the id but the id form label is returned
         * @param {flag} - undocumented-used for recursation
         **/
        static getEditableComponents(component, idFromLabel, includeFrozenContainer, flag) {
            var ret = "";
            var sclass = Classes_16.classes.getClassName(component);
            var props = Registry_13.default.getData("$UIComponent")[sclass];
            if (!props) {
                props = props = Registry_13.default.getData("$ReportComponent")[sclass];
            }
            if (!props === undefined)
                return ret;
            var prop = props.params[0];
            if (includeFrozenContainer === false && prop.editableChildComponents.length === 0 && flag === "child")
                ret = "";
            else
                ret = "#" + ((idFromLabel === true) ? component.domWrapper._id : component._id);
            //TODO implement child container
            if (flag === "child" && prop.editableChildComponents.length === 0)
                return ret;
            if (component["_components"] !== undefined) {
                for (var x = 0; x < component["_components"].length; x++) {
                    var t = ComponentDescriptor_3.getEditableComponents(component["_components"][x], idFromLabel, includeFrozenContainer, "child");
                    if (t !== "") {
                        ret = ret + (ret === "" ? "" : ",") + t;
                    }
                }
            }
            return ret;
        }
        /** calc editableComponents
         * @param {object} ob - the object to resolve
         * @returns {Object.<string,jassi.ui.Component> - <name,component>
         **/
        resolveEditableComponents(ob) {
            var ret = {};
            var sclass = Classes_16.classes.getClassName(ob);
            if (Registry_13.default.getData("$UIComponent", sclass) !== undefined && Registry_13.default.getData("$UIComponent", sclass)[0] !== undefined) {
                var props = Registry_13.default.getData("$UIComponent", sclass)[0].params[0];
                this.editableComponents = props.editableChildComponents;
            }
            if (Registry_13.default.getData("$ReportComponent", sclass) !== undefined && Registry_13.default.getData("$ReportComponent", sclass)[0] !== undefined) {
                var props = Registry_13.default.getData("$ReportComponent", sclass)[0].params[0];
                this.editableComponents = props.editableChildComponents;
            }
            if (this.editableComponents !== undefined) {
                for (var x = 0; x < this.editableComponents.length; x++) {
                    var field = this.editableComponents[x];
                    var members = field.split(".");
                    var retob = ob;
                    for (var m = 0; m < members.length; m++) {
                        if (members[m] === "this")
                            retob = retob;
                        else
                            retob = retob[members[m]];
                    }
                    ret[field] = retob;
                }
            }
            return ret;
        }
        /**
         * remove a field
         * @param {string} field - the name of the field to remove
         */
        removeField(field) {
            for (var x = 0; x < this.fields.length; x++) {
                if (this.fields[x].name === field) {
                    this.fields.splice(x, 1);
                    x = x - 1;
                }
            }
        }
    };
    ComponentDescriptor = ComponentDescriptor_3 = __decorate([
        Jassi_36.$Class("jassi.ui.ComponentDescriptor"),
        __metadata("design:paramtypes", [])
    ], ComponentDescriptor);
    exports.ComponentDescriptor = ComponentDescriptor;
});
define("jassi/ui/ComponentSpy", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Table", "jassi/ui/HTMLPanel", "jassi/ui/Button", "jassi/ui/BoxPanel", "jassi/ui/Select", "jassi/remote/Classes", "jassi/base/Actions", "jassi/base/Router"], function (require, exports, Jassi_37, Panel_4, Table_1, HTMLPanel_2, Button_1, BoxPanel_2, Select_1, Classes_17, Actions_6, Router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComponentSpy = void 0;
    class Me {
    }
    let ComponentSpy = class ComponentSpy extends Panel_4.Panel {
        constructor() {
            super();
            this.ids = {};
            this.labelids = {};
            this.layout();
        }
        static async showDialog() {
            Router_1.router.navigate("#do=jassi.ui.ComponentSpy");
        }
        layout() {
            var me = this.me = {};
            me.IDText = new HTMLPanel_2.HTMLPanel();
            var _this = this;
            me.boxpanel1 = new BoxPanel_2.BoxPanel();
            me.IDUpdate = new Button_1.Button();
            me.IDClear = new Button_1.Button();
            me.IDTable = new Table_1.Table();
            me.IDTest = new Button_1.Button();
            this.add(me.boxpanel1);
            this.add(me.IDTable);
            this.add(me.IDText);
            me.boxpanel1.add(me.IDUpdate);
            me.boxpanel1.add(me.IDClear);
            me.boxpanel1.add(me.IDTest);
            me.boxpanel1.horizontal = false;
            me.IDClear.text = "clear";
            me.IDUpdate.text = "update";
            me.IDUpdate.onclick(function (event) {
                _this.update();
            });
            me.IDClear.onclick(function (event) {
                _this.clear();
            });
            me.IDTest.onclick(function (event) {
                var sel = new Select_1.Select();
                sel.destroy();
            });
            me.IDUpdate.text = "Update";
            me.IDTable.width = "100%";
            me.IDTable.height = "400";
            me.IDTable.onchange(function (ob) {
                me.IDText.value = ob.data.stack.replaceAll("\n", "<br>");
            });
        }
        update() {
            var data = [];
            for (var k in Jassi_37.default.componentSpy.ids) {
                data.push(Jassi_37.default.componentSpy.ids[k]);
            }
            this.me.IDTable.items = data;
        }
        clear() {
            Jassi_37.default.componentSpy.ids = {};
            Jassi_37.default.componentSpy.labelids = {};
            this.update();
        }
        watch(component) {
            var ob = {
                type: Classes_17.classes.getClassName(component),
                id: component._id,
                labelid: component.domWrapper === undefined ? 0 : component.domWrapper._id,
                stack: new Error().stack
            };
            this.ids[ob.id] = ob;
            this.labelids[ob.labelid] = ob;
        }
        stack(id) {
            var test = this.ids[id];
            if (test === undefined)
                test = this.labelids[id];
            if (test !== undefined)
                return test.stack;
            else
                return "empty";
        }
        unwatch(component) {
            var ob = this.ids[component._id];
            if (ob !== undefined) {
                delete this.ids[ob.id];
                delete this.labelids[ob.labelid];
            }
        }
        list() {
            var test = ["jj", "kkk"];
            return test;
        }
        destroy() {
            super.destroy();
        }
    };
    __decorate([
        Actions_6.$Action({
            name: "Administration/Spy Components",
            icon: "mdi mdi-police-badge",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ComponentSpy, "showDialog", null);
    ComponentSpy = __decorate([
        Actions_6.$ActionProvider("jassi.base.ActionNode"),
        Jassi_37.$Class("jassi.ui.ComponentSpy"),
        __metadata("design:paramtypes", [])
    ], ComponentSpy);
    exports.ComponentSpy = ComponentSpy;
    Jassi_37.default.test = function () {
        return new ComponentSpy();
    };
    Jassi_37.default.componentSpy = new ComponentSpy();
});
define("jassi/ui/Container", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component"], function (require, exports, Jassi_38, Component_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Container = void 0;
    let Container = class Container extends Component_6.Component {
        /**
         *
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            super(properties);
            this._components = [];
        }
        /**
        * inits the component
        * @param {dom} dom - init the dom element
        * @paran {object} properties - properties to init
       */
        init(dom, properties = undefined) {
            super.init(dom, properties);
            $(this.domWrapper).addClass("jcontainer");
        }
        /**
         * adds a component to the container
         * @param {jassi.ui.Component} component - the component to add
         */
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            /* component._parent=this;
             component.domWrapper._parent=this;
             if(component.domWrapper.parentNode!==null&&component.domWrapper.parentNode!==undefined){
                  component.domWrapper.parentNode.removeChild(component.domWrapper);
             }*/
            if (this["designDummyFor"])
                this.designDummies.push(component);
            else
                this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassi.ui.Component} component - the component to add
         * @param {jassi.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            component._parent = this;
            component.domWrapper._parent = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            if (component["designDummyFor"])
                this.designDummies.push(component);
            else
                this._components.splice(index, 0, component);
            $(component.domWrapper).insertBefore(before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        /**
       * remove the component
       * @param {jassi.ui.Component} component - the component to remove
       * @param {boolean} destroy - if true the component would be destroyed
       */
        remove(component, destroy = false) {
            var _a;
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            var pos = this._components.indexOf(component);
            if (pos >= 0)
                this._components.splice(pos, 1);
            let posd = (_a = this.designDummies) === null || _a === void 0 ? void 0 : _a.indexOf(component);
            if (posd >= 0)
                this.designDummies.splice(posd, 1);
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        /**
       * remove all component
       * @param {boolean} destroy - if true the component would be destroyed
       */
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            var tmp = [].concat(this._components);
            for (var k = 0; k < tmp.length; k++) {
                tmp[k].destroy();
            }
            this._components = [];
            super.destroy();
        }
    };
    Container = __decorate([
        Jassi_38.$Class("jassi.ui.Container"),
        __metadata("design:paramtypes", [Object])
    ], Container);
    exports.Container = Container;
});
define("jassi/ui/ContextMenu", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Menu", "jassi/ui/InvisibleComponent", "jassi/ui/Component", "jassi/remote/Classes", "jassi/ui/Property", "jassi/base/Actions", "jassi/ui/MenuItem", "jassi/ext/jquery.contextmenu"], function (require, exports, Jassi_39, Menu_2, InvisibleComponent_1, Component_7, Classes_18, Property_12, Actions_7, MenuItem_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ContextMenu = void 0;
    //https://github.com/s-yadav/contextMenu.js/
    let ContextMenu = class ContextMenu extends InvisibleComponent_1.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
            var _this = this;
            this.menu = new Menu_2.Menu({ noUpdate: true });
            this.menu._mainMenu = this;
            //this.menu._parent=this;
            $(this.dom).append(this.menu.dom);
            $(this.menu.dom).contextMenu("menu", "#" + this.menu._id, { triggerOn: 'dummyevent' });
            this.contextComponents = [];
            //this.menu._parent=this;
            $(this.menu.dom).addClass("jcontainer");
            this._components = [this.menu]; //neede for getEditablecontextComponents
            this.onbeforeshow(function () {
                return _this._updateClassActions();
            });
        }
        /**
         * @member - the objects for the includeClassActions @ActionProvider if  is enabled
         **/
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        /**
         * could be override to provide Context-actions
         * exsample:
         * cmen.getActions=async function(objects:[]){
         *		return [{name:"hallo",call:ob=>{}]
         *	};
         **/
        async getActions(data) {
            return [];
        }
        //		static async  getActionsFor(oclass:new (...args: any[]) => any):Promise<{name:string,icon?:string,call:(objects:any[])}[]>{
        /*	registerActions(func:{(any[]):Promise<{name:string,icon?:string,call:(objects:any[])}[]}>){
                this._getActions=func;
            }*/
        _removeClassActions(menu) {
            for (var y = 0; y < menu._components.length; y++) {
                var test = menu._components[y];
                if (test["_classaction"] == true) {
                    menu.remove(test);
                    test.destroy();
                    y--;
                }
                if (test._components !== undefined) {
                    this._removeClassActions(test);
                }
            }
        }
        _setDesignMode(enable) {
            var h = 9;
        }
        async _updateClassActions() {
            //remove classActions
            this._removeClassActions(this.menu);
            var _this = this;
            var actions = await this.getActions(this.value);
            if (this.value === undefined || this.includeClassActions !== true || this.value.length <= 0)
                actions = actions; //do nothing
            else {
                var a = await Actions_7.Actions.getActionsFor(this.value); //Class Actions
                for (var x = 0; x < a.length; x++) {
                    actions.push(a[x]);
                }
            }
            actions.forEach(action => {
                var path = action.name.split("/"); //childmenus
                var parent = this.menu;
                for (var i = 0; i < path.length; i++) {
                    if (i === path.length - 1) {
                        var men = new MenuItem_2.MenuItem();
                        men["_classaction"] = true;
                        men.text = path[i];
                        men.icon = action.icon;
                        men.onclick(() => action.call(_this.value));
                        parent.add(men);
                    }
                    else {
                        var name = path[i];
                        var found = undefined;
                        parent._components.forEach((men) => {
                            if (men.text === name)
                                found = men.items;
                        });
                        if (found === undefined) {
                            var men = new MenuItem_2.MenuItem();
                            men["_classaction"] = true;
                            men.text = name;
                            parent.add(men);
                            parent = men.items;
                        }
                        else {
                            parent = found;
                        }
                    }
                }
            });
        }
        _menueChanged() {
        }
        getMainMenu() {
            return this;
        }
        /**
         * register an event if the contextmenu is showing
         * @param {function} handler - the function that is called on change
         * @returns {boolean} - false if the contextmenu should not been shown
         */
        onbeforeshow(handler) {
            this.addEvent("beforeshow", handler);
        }
        async _callContextmenu(evt) {
            if (evt.preventDefault !== undefined)
                evt.preventDefault();
            var cancel = this.callEvent("beforeshow", evt);
            if (cancel !== undefined) {
                for (var x = 0; x < cancel.length; x++) {
                    if (cancel[x] !== undefined && cancel[x].then !== undefined)
                        cancel[x] = await cancel[x];
                    if (cancel[x] === false)
                        return;
                }
            }
            let y = evt.originalEvent.clientY;
            //$(_this.menu.dom).contextMenu("menu","#"+_this.menu._id);//,{triggerOn:'contextmenu'});
            //$(_this.menu.dom).contextMenu('open',evt);
            this.show({ left: evt.originalEvent.clientX, top: y });
        }
        /**
         * register the contextMenu (right click) on the component
         * @member {jassi.ui.Component} - the component which gets the contextmenu
         **/
        registerComponent(component) {
            this.contextComponents.push(component);
            var _this = this;
            $(component.dom).contextmenu(function (evt) {
                _this._callContextmenu(evt);
            });
        }
        /**
         * unregister the contextMenu (right click) on the component
         * @member {jassi.ui.Component} - the component which gets the contextmenu
         **/
        unregisterComponent(component) {
            //$(component.dom).contextmenu(function(ob){});//now we always can destroy
            $(component.dom).off("contextmenu");
            //$(component.dom).contextmenu("destroy");
            var pos = this.contextComponents.indexOf(component);
            if (pos >= 0)
                this.contextComponents.splice(pos, 1);
        }
        /**
         * shows the contextMenu
         */
        show(event) {
            //@ts-ignore
            if (this.domWrapper.parentNode.getAttribute('id') === "jassitemp" && this.contextComponents.length > 0) {
                //the contextmenu is not added to a container to we add the contextmenu to the contextComponent
                this.contextComponents[0].domWrapper.appendChild(this.domWrapper);
            }
            var _this = this;
            window.setTimeout(function () {
                $(_this.menu.dom).menu();
                $(_this.menu.dom).menu("destroy");
                $(_this.menu.dom).contextMenu("menu", "#" + _this.menu._id, { triggerOn: 'dummyevent' });
                //correct pos menu not visible
                if (event.top + $(_this.menu.dom).height() > window.innerHeight) {
                    event.top = window.innerHeight - $(_this.menu.dom).height();
                }
                if (event.left + $(_this.menu.dom).width() > window.innerWidth) {
                    event.left = window.innerWidth - $(_this.menu.dom).width();
                }
                $(_this.menu.dom).contextMenu('open', event);
            }, 10);
        }
        close() {
            $(this.menu.dom).contextMenu('close', event);
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this.menu.extensionCalled(action);
            }
            if (action.componentDesignerInvisibleComponentClicked) {
                var design = action.componentDesignerInvisibleComponentClicked.designButton.dom;
                //return this.show({ top: $(design).offset().top + 30, left: $(design).offset().left + 5 });
                return this.show(design); //{ top: $(design).offset().top, left: $(design).offset().left });
            }
            super.extensionCalled(action);
        }
        destroy() {
            this._value = undefined;
            while (this.contextComponents.length > 0) {
                this.unregisterComponent(this.contextComponents[0]);
            }
            $(this.menu.dom).contextMenu("menu", "#" + this.menu._id);
            $(this.menu.dom).contextMenu("destroy");
            this.menu.destroy();
            super.destroy();
        }
    };
    __decorate([
        Property_12.$Property(),
        __metadata("design:type", Boolean)
    ], ContextMenu.prototype, "includeClassActions", void 0);
    __decorate([
        Property_12.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ContextMenu.prototype, "onbeforeshow", null);
    ContextMenu = __decorate([
        Component_7.$UIComponent({ fullPath: "common/ContextMenu", icon: "mdi mdi-dots-vertical", editableChildComponents: ["menu"] }),
        Jassi_39.$Class("jassi.ui.ContextMenu"),
        __metadata("design:paramtypes", [])
    ], ContextMenu);
    exports.ContextMenu = ContextMenu;
    async function test() {
        var Panel = Classes_18.classes.getClass("jassi.ui.Panel");
        var Button = Classes_18.classes.getClass("jassi.ui.Button");
        var MenuItem = Classes_18.classes.getClass("jassi.ui.MenuItem");
        var FileNode = Classes_18.classes.getClass("jassi.remote.FileNode");
        var bt = new Button();
        var cmen = new ContextMenu();
        var men = new MenuItem();
        //var pan=new Panel();
        men.text = "static Menu";
        men.onclick(() => { alert("ok"); });
        cmen.includeClassActions = true;
        cmen.menu.add(men);
        var nd = new FileNode();
        nd.name = "File";
        cmen.value = [nd];
        cmen.getActions = async function (objects) {
            var all = objects;
            return [{
                    name: "getActions-Action",
                    call: function (ob) {
                        alert(ob[0]["name"]);
                    }
                }];
        };
        bt.contextMenu = cmen;
        bt.text = "hallo";
        //pan.add(bt);
        //bt.domWrapper.appendChild(cmen.domWrapper);
        //pan.add(cmen);
        return bt;
    }
    exports.test = test;
});
define("jassi/ui/DBObjectDialog", ["require", "exports", "jassi/ui/Table", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/remote/Registry", "jassi/remote/Classes", "jassi/ui/BoxPanel", "jassi/base/Actions", "jassi/base/Windows"], function (require, exports, Table_2, Jassi_40, Panel_5, Registry_14, Classes_19, BoxPanel_3, Actions_8, Windows_4) {
    "use strict";
    var DBObjectDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectDialog = void 0;
    let DBObjectDialog = DBObjectDialog_1 = class DBObjectDialog extends Panel_5.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.splitpanel1 = new BoxPanel_3.BoxPanel();
            me.IDDBView = new Panel_5.Panel();
            me.table1 = new Table_2.Table();
            me.table1.height = "calc(100% - 300px)";
            me.table1.width = "calc(100% - 50px)";
            me.splitpanel1.add(me.IDDBView);
            me.splitpanel1.spliter = [70, 30];
            me.splitpanel1.height = "100%";
            me.splitpanel1.horizontal = false;
            //	me.splitpanel1.width=910;
            me.splitpanel1.add(me.table1);
            this.add(me.splitpanel1);
            //    me.table1.height = "150";
        }
        /**
         * set the DBObject-classname to show in this dialog
         **/
        set dbclassname(classname) {
            this._dbclassname = classname;
            this.update();
        }
        get dbclassname() {
            return this._dbclassname;
        }
        async update() {
            //DBTable
            var cl = await Classes_19.classes.loadClass(this._dbclassname);
            var _this = this;
            //@ts-ignore
            this.data = await cl.find();
            this.me.table1.items = this.data;
            //DBView
            var data = await Registry_14.default.getJSONData("$DBObjectView");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.classname === this.dbclassname) {
                    var cl = await Classes_19.classes.loadClass(data[x].classname);
                    this.me.IDDBView.removeAll();
                    this.view = new cl();
                    this.me.IDDBView.add(this.view);
                    //@ts-ignore
                    this.view.value = this.data.length > 0 ? this.data[0] : undefined;
                    this.view.onrefreshed(() => {
                        _this.me.table1.update();
                    });
                    this.view.onsaved((obj) => {
                        var all = _this.me.table1.items;
                        if (all.indexOf(obj) === -1) {
                            all.push(obj);
                            _this.me.table1.items = _this.me.table1.items;
                            _this.me.table1.value = obj;
                            _this.me.table1.update();
                        }
                        else
                            _this.me.table1.update();
                    });
                    this.view.ondeleted((obj) => {
                        var all = _this.me.table1.items;
                        var pos = all.indexOf(obj);
                        if (pos >= 0)
                            all.splice(pos, 1);
                        _this.me.table1.items = all;
                        //select prev element
                        while (pos !== 0 && pos > all.length - 1) {
                            pos--;
                        }
                        if (pos >= 0) {
                            _this.me.table1.value = all[pos];
                            _this.view.value = all[pos];
                        }
                        _this.me.table1.update();
                    });
                    this.me.table1.selectComponent = this.view;
                }
            }
        }
        static createFunction(classname) {
            return function () {
                var ret = new DBObjectDialog_1();
                ret.dbclassname = classname;
                ret.height = "100%";
                Windows_4.default.add(ret, classname);
            };
        }
        /**
         * create Action for all DBObjectView with actionname is defined
         */
        static async createAcions() {
            var ret = [];
            var data = await Registry_14.default.getJSONData("$DBObjectView");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.actionname) {
                    ret.push({
                        name: param.actionname,
                        icon: param.icon,
                        run: this.createFunction(param.classname)
                    });
                }
            }
            return ret;
        }
        static async createFor(classname) {
            var ret = new DBObjectDialog_1();
            ret.height = 400;
            ret.dbclassname = classname;
            /*	setimeout(()=>{
             //	ret.height="100%";
             //	ret.me.splitpanel1.refresh();
             },1000);*/
            return ret;
        }
    };
    __decorate([
        Actions_8.$Actions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectDialog, "createAcions", null);
    DBObjectDialog = DBObjectDialog_1 = __decorate([
        Actions_8.$ActionProvider("jassi.base.ActionNode"),
        Jassi_40.$Class("jassi.ui.DBObjectDialog"),
        __metadata("design:paramtypes", [])
    ], DBObjectDialog);
    exports.DBObjectDialog = DBObjectDialog;
    async function test() {
        //var ret = await DBObjectDialog.createFor("jassi.security.User");
        var ret = await DBObjectDialog.createFor("northwind.Customer");
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/DBObjectExplorer", ["require", "exports", "jassi/ui/ContextMenu", "jassi/ui/Tree", "jassi/remote/Jassi", "jassi/base/Actions", "jassi/ui/Panel", "jassi/remote/Registry", "jassi/base/Router", "jassi/ui/DBObjectDialog", "jassi/base/Windows"], function (require, exports, ContextMenu_1, Tree_1, Jassi_41, Actions_9, Panel_6, Registry_15, Router_2, DBObjectDialog_2, Windows_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectExplorer = exports.DBObjectActions = exports.DBFileActions = exports.DBObjectNode = void 0;
    let DBObjectNode = class DBObjectNode {
    };
    DBObjectNode = __decorate([
        Jassi_41.$Class("jassi.ui.DBObjectNode")
    ], DBObjectNode);
    exports.DBObjectNode = DBObjectNode;
    let DBFileActions = class DBFileActions {
        static async ViewData(all) {
            var entrys = await Registry_15.default.getJSONData("$DBObject");
            for (var x = 0; x < entrys.length; x++) {
                if (all[0].fullpath === entrys[x].filename) {
                    var h = new DBObjectNode();
                    h.name = entrys[x].classname;
                    h.filename = entrys[x].filename;
                    DBObjectActions.ViewData([h]);
                }
            }
        }
    };
    __decorate([
        Actions_9.$Action({
            name: "View Data",
            isEnabled: async function (all) {
                if (all[0].isDirectory())
                    return false;
                //console.log("TODO make isEnabled this async")
                var entrys = await Registry_15.default.getJSONData("$DBObject");
                for (var x = 0; x < entrys.length; x++) {
                    if (all[0].fullpath === entrys[x].filename)
                        return true;
                }
                return false;
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBFileActions, "ViewData", null);
    DBFileActions = __decorate([
        Actions_9.$ActionProvider("jassi.remote.FileNode"),
        Jassi_41.$Class("jassi.ui.DBFileActions")
    ], DBFileActions);
    exports.DBFileActions = DBFileActions;
    let DBObjectActions = class DBObjectActions {
        static async ViewData(all) {
            var ret = new DBObjectDialog_2.DBObjectDialog();
            ret.dbclassname = all[0].name;
            ret.height = "100%";
            Windows_5.default.add(ret, all[0].name);
        }
        static async OpenCode(all) {
            Router_2.router.navigate("#do=jassi_editor.CodeEditor&file=" + all[0].filename);
        }
    };
    __decorate([
        Actions_9.$Action({ name: "View Data" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBObjectActions, "ViewData", null);
    __decorate([
        Actions_9.$Action({ name: "Open Code" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], DBObjectActions, "OpenCode", null);
    DBObjectActions = __decorate([
        Actions_9.$ActionProvider("jassi.ui.DBObjectNode"),
        Jassi_41.$Class("jassi.ui.DBObjectActions")
    ], DBObjectActions);
    exports.DBObjectActions = DBObjectActions;
    let DBObjectExplorer = class DBObjectExplorer extends Panel_6.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.tree = new Tree_1.Tree();
            me.contextmenu = new ContextMenu_1.ContextMenu();
            this.add(me.contextmenu);
            this.add(me.tree);
            me.tree.width = "100%";
            me.tree.height = "100%";
            me.tree.propDisplay = "name";
            me.tree.contextMenu = me.contextmenu;
            me.tree.onclick(function (event /*, data?:Fancytree.EventData*/) {
                var node = event.data;
                DBObjectActions.OpenCode([node]);
            });
            me.contextmenu.includeClassActions = true;
            this.update();
        }
        async update() {
            var entrys = await Registry_15.default.getJSONData("$DBObject");
            var all = [];
            entrys.forEach((entry) => {
                var h = new DBObjectNode();
                ;
                h.name = entry.classname;
                h.filename = entry.filename;
                all.push(h);
            });
            this.me.tree.items = all;
        }
    };
    DBObjectExplorer = __decorate([
        Jassi_41.$Class("jassi.ui.DBObjectExplorer"),
        __metadata("design:paramtypes", [])
    ], DBObjectExplorer);
    exports.DBObjectExplorer = DBObjectExplorer;
    async function test() {
        var ret = new DBObjectExplorer();
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/DBObjectView", ["require", "exports", "jassi/ui/Button", "jassi/ui/BoxPanel", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Databinder", "jassi/ui/Component", "jassi/remote/Registry", "jassi/remote/Classes", "jassi/ui/Property"], function (require, exports, Button_2, BoxPanel_4, Jassi_42, Panel_7, Databinder_1, Component_8, Registry_16, Classes_20, Property_13) {
    "use strict";
    var DBObjectView_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectView = exports.$DBObjectView = exports.DBObjectViewProperties = void 0;
    class DBObjectViewProperties {
    }
    exports.DBObjectViewProperties = DBObjectViewProperties;
    function $DBObjectView(properties) {
        return function (pclass) {
            Registry_16.default.register("$DBObjectView", pclass, properties);
        };
    }
    exports.$DBObjectView = $DBObjectView;
    let DBObjectView = DBObjectView_3 = class DBObjectView extends Panel_7.Panel {
        constructor() {
            super();
            this.me = {};
            //everytime call super.layout
            DBObjectView_3.prototype.layout.bind(this)(this.me);
            // this.layout(this.me);
        }
        _setDesignMode(enable) {
            //no Icons to add Components in designer
        }
        /**
         * create a new object
         */
        createObject() {
            var clname = Registry_16.default.getData("$DBObjectView", Classes_20.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_20.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("created", this["value"]);
            return this["value"];
        }
        /**
        * register an event if the object is created
        * @param {function} handler - the function that is called
        */
        oncreated(handler) {
            this.addEvent("deleted", handler);
        }
        /**
         * saves the object
         */
        saveObject() {
            var ob = this.me.databinder.fromForm();
            ob.save().then((obj) => {
                this["value"] = obj;
                this.callEvent("saved", obj);
            });
        }
        /**
         * register an event if the object is saved
         * @param {function} handler - the function that is called
         */
        onsaved(handler) {
            this.addEvent("saved", handler);
        }
        /**
         * refresh the object
         */
        refreshObject() {
            this.me.databinder.toForm(this["value"]);
            this.callEvent("refreshed", this["value"]);
        }
        /**
         * register an event if the object is refreshed
         * @param {function} handler - the function that is called
         */
        onrefreshed(handler) {
            this.addEvent("refreshed", handler);
        }
        /**
         * deletes Object
         **/
        deleteObject() {
            var ob = this.me.databinder.fromForm();
            ob.remove();
            //set obj to null
            var clname = Registry_16.default.getData("$DBObjectView", Classes_20.classes.getClassName(this))[0].params[0].classname;
            var cl = Classes_20.classes.getClass(clname);
            this["value"] = new cl();
            this.callEvent("deleted", ob);
        }
        /**
         * register an event if the object is deleted
         * @param {function} handler - the function that is called
         */
        ondeleted(handler) {
            this.addEvent("deleted", handler);
        }
        layout(me) {
            var _this = this;
            me.toolbar = new BoxPanel_4.BoxPanel();
            me.save = new Button_2.Button();
            me.remove = new Button_2.Button();
            me.refresh = new Button_2.Button();
            me.create = new Button_2.Button();
            me.databinder = new Databinder_1.Databinder();
            me.main = new Panel_7.Panel();
            me.databinder.definePropertyFor(this, "value");
            this.add(me.toolbar);
            this.add(me.main);
            me.main.width = "100%";
            me.main.height = "100%";
            me.main.css({ position: "relative" });
            //$(me.main.dom).css("background-color","coral");
            me.toolbar.add(me.create);
            me.toolbar.add(me.save);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.refresh);
            me.toolbar.add(me.remove);
            me.save.text = "";
            me.save.tooltip = "save";
            me.save.icon = "mdi mdi-content-save";
            me.save.onclick(function (event) {
                _this.saveObject();
            });
            me.remove.text = "";
            me.remove.icon = "mdi mdi-delete";
            me.remove.onclick(function (event) {
                _this.deleteObject();
            });
            me.remove.tooltip = "remove";
            me.refresh.text = "";
            me.refresh.icon = "mdi mdi-refresh";
            me.refresh.onclick(function (event) {
                _this.refreshObject();
            });
            me.refresh.tooltip = "refresh";
            me.create.text = "";
            me.create.icon = "mdi mdi-tooltip-plus-outline";
            me.create.onclick(function (event) {
                _this.createObject();
                //me.binder.toForm();
            });
            me.create.tooltip = "new";
        }
    };
    __decorate([
        Property_13.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "oncreated", null);
    __decorate([
        Property_13.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onsaved", null);
    __decorate([
        Property_13.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "onrefreshed", null);
    __decorate([
        Property_13.$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], DBObjectView.prototype, "ondeleted", null);
    DBObjectView = DBObjectView_3 = __decorate([
        Component_8.$UIComponent({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh"] }),
        Jassi_42.$Class("jassi/ui/DBObjectView"),
        __metadata("design:paramtypes", [])
    ], DBObjectView);
    exports.DBObjectView = DBObjectView;
    async function test() {
        var ret = new DBObjectView();
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/DataComponent", ["require", "exports", "jassi/ui/Component", "jassi/ui/Property", "jassi/remote/Jassi"], function (require, exports, Component_9, Property_14, Jassi_43) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataComponent = void 0;
    var tmpDatabinder = undefined;
    let DataComponent = class DataComponent extends Component_9.Component {
        /**
        * base class for each Component
        * @class jassi.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            super(properties);
            this._autocommit = false;
        }
        /**
         * @member {bool} autocommit -  if true the databinder will update the value on every change
         *                              if false the databinder will update the value on databinder.toForm
         */
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //    this._databinder.checkAutocommit(this);
        }
        /**
         * binds a component to a databinder
         * @param {jassi.ui.Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
         */
        bind(databinder, property) {
            this._databinder = databinder;
            databinder.add(property, this, "onchange");
            //databinder.checkAutocommit(this);
        }
        destroy() {
            if (this._databinder !== undefined) {
                this._databinder.remove(this);
                this._databinder = undefined;
            }
            super.destroy();
        }
    };
    __decorate([
        Property_14.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], DataComponent.prototype, "autocommit", null);
    __decorate([
        Property_14.$Property({ type: "databinder" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], DataComponent.prototype, "bind", null);
    DataComponent = __decorate([
        Jassi_43.$Class("jassi.ui.DataComponent"),
        __metadata("design:paramtypes", [Object])
    ], DataComponent);
    exports.DataComponent = DataComponent;
});
define("jassi/ui/DatabaseDesigner", ["require", "exports", "jassi/ui/BoxPanel", "jassi/ui/Button", "jassi/ui/Databinder", "jassi/ui/Select", "jassi/ui/Table", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/base/DatabaseSchema", "jassi/ui/OptionDialog", "jassi/base/Router", "jassi/base/Actions"], function (require, exports, BoxPanel_5, Button_3, Databinder_2, Select_2, Table_3, Jassi_44, Panel_8, DatabaseSchema_7, OptionDialog_5, Router_3, Actions_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseDesigner = void 0;
    var ttt = 1;
    let DatabaseDesigner = class DatabaseDesigner extends Panel_8.Panel {
        constructor() {
            super();
            this.allTypes = { values: [""] };
            this.posibleRelations = { values: [""] };
            this.me = {};
            this.layout(this.me);
        }
        static async showDialog() {
            Router_3.router.navigate("#do=jassi/ui/DatabaseDesigner");
        }
        layout(me) {
            me.newclass = new Button_3.Button();
            me.boxpanel1 = new BoxPanel_5.BoxPanel();
            me.save = new Button_3.Button();
            me.boxpanel2 = new BoxPanel_5.BoxPanel(false);
            me.newfield = new Button_3.Button();
            me.boxpanel1.horizontal = true;
            var _this = this;
            var xxx = 0;
            var params = { values: ["hall", "du"] };
            me.table = new Table_3.Table({
                autoColumns: false,
                columns: [
                    //@ts-ignore
                    { title: "name", field: "name", editor: "input", editable: true },
                    //@ts-ignore
                    { title: "type", field: "type", editor: "select", editorParams: this.allTypes },
                    //@ts-ignore
                    { title: "nullable", field: "nullable", editor: "tick", editorParams: { tristate: false } },
                    //@ts-ignore
                    {
                        title: "relationinfo", field: "relationinfo", editor: "select",
                        editorParams: this.posibleRelations,
                        cellEditing: function (cell) {
                            _this.updatePossibleRelations(cell);
                        }
                    }
                ]
            });
            me.select = new Select_2.Select();
            me.databinder = new Databinder_2.Databinder();
            this.add(me.databinder);
            me.table.width = 565;
            me.table.height = "300";
            me.table.onchange(function (event, data) {
            });
            me.select.display = "name";
            me.select.selectComponent = me.databinder;
            me.select.onchange(function (event) {
                _this.update();
            });
            me.select.width = 210;
            this.readSchema();
            this.width = 719;
            this.height = 386;
            this.add(me.boxpanel1);
            this.add(me.boxpanel2);
            me.newclass.text = "Create DBClass";
            me.newclass.onclick(function (event) {
                _this.newClass();
            });
            me.newclass.icon = "mdi mdi-note-plus-outline";
            me.newclass.tooltip = "new DBClass";
            me.newclass.width = "150";
            me.boxpanel1.add(me.select);
            me.boxpanel1.width = 365;
            me.boxpanel1.add(me.newclass);
            me.boxpanel1.add(me.save);
            me.save.text = "Save all Classes";
            me.save.onclick(function (event) {
                _this.saveAll();
            });
            me.save.width = 150;
            me.save.icon = "mdi mdi-content-save";
            me.save.width = 180;
            me.boxpanel2.height = 115;
            me.boxpanel2.horizontal = true;
            me.boxpanel2.width = 50;
            me.newfield.text = "Create Field";
            me.newfield.icon = "mdi mdi-playlist-plus";
            me.newfield.onclick(function (event) {
                var field = new DatabaseSchema_7.DatabaseField();
                //@ts-ignore
                field.parent = _this.currentClass;
                _this.currentClass.fields.push(field);
                me.table.items = _this.currentClass.fields;
            });
            me.newfield.width = "140";
            me.boxpanel2.add(me.table);
            me.boxpanel2.add(me.newfield);
        }
        async saveAll() {
            try {
                var text = await this.currentSchema.updateSchema(true);
                if (text !== "") {
                    if ((await OptionDialog_5.OptionDialog.show("Do you won't this changes?<br/>" + text.replaceAll("\n", "<br/>"), ["Yes", "Cancel"])).button === "Yes") {
                        this.currentSchema.updateSchema(false);
                    }
                }
                else {
                    alert("no changes detected");
                }
            }
            catch (err) {
                alert(err.message);
            }
        }
        async newClass() {
            var sub = this.currentClass.name.substring(0, this.currentClass.name.lastIndexOf("."));
            var res = await OptionDialog_5.OptionDialog.show("Enter classname", ["OK", "Cancel"], undefined, true, sub + ".MyOb");
            if (res.button === "OK") {
                this.currentClass = new DatabaseSchema_7.DatabaseClass();
                this.currentClass.name = res.text;
                var f = new DatabaseSchema_7.DatabaseField();
                f.name = "id";
                f.type = "int";
                f.relation = "PrimaryColumn";
                this.currentClass.fields = [f];
                this.currentSchema.databaseClasses.push(this.currentClass);
                this.me.select.items = this.currentSchema.databaseClasses;
                this.me.select.value = this.currentClass;
                this.update();
            }
        }
        updatePossibleRelations(cell) {
            var _this = this;
            var tp = cell.getData();
            this.posibleRelations.values = tp.getPossibleRelations();
        }
        updateTypes() {
            var _this = this;
            this.allTypes.values = [];
            DatabaseSchema_7.DatabaseSchema.basicdatatypes.forEach((e) => {
                _this.allTypes.values.push(e);
            });
            this.currentSchema.databaseClasses.forEach((cl) => {
                _this.allTypes.values.push(cl.name);
                _this.allTypes.values.push(cl.name + "[]");
            });
        }
        update() {
            this.currentClass = this.me.select.value;
            this.me.table.items = this.currentClass.fields;
            this.updateTypes();
        }
        async readSchema() {
            this.currentSchema = new DatabaseSchema_7.DatabaseSchema();
            await this.currentSchema.loadSchemaFromCode();
            this.me.select.items = this.currentSchema.databaseClasses;
            this.me.select.value = this.currentSchema.databaseClasses[0];
            this.update();
        }
    };
    __decorate([
        Actions_10.$Action({
            name: "Administration/Database Designer",
            icon: "mdi mdi-database-edit",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DatabaseDesigner, "showDialog", null);
    DatabaseDesigner = __decorate([
        Actions_10.$ActionProvider("jassi.base.ActionNode"),
        Jassi_44.$Class("jassi/ui/DatabaseDesigner"),
        __metadata("design:paramtypes", [])
    ], DatabaseDesigner);
    exports.DatabaseDesigner = DatabaseDesigner;
    async function test() {
        var ret = new DatabaseDesigner();
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/Databinder", ["require", "exports", "jassi/ui/InvisibleComponent", "jassi/ui/Component", "jassi/remote/Jassi"], function (require, exports, InvisibleComponent_2, Component_10, Jassi_45) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Databinder = void 0;
    let Databinder = class Databinder extends InvisibleComponent_2.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
            /** @member {[jassi.ui.Component]} components - all binded components*/
            this.components = [];
            /** @member {[string]} properties - all binded properties*/
            this._properties = [];
            /** @member [[function]] getter - all functions to get the component value*/
            this._getter = [];
            /** @member [[function]] setter - all functions to set the component value*/
            this._setter = [];
            /** @member {[function]} onChange - changeHandler for all components used for autocommit*/
            this._onChange = [];
            /** @member {[function]} autocommit - autocommitHandler for all components*/
            this._autocommit = [];
            /** @member [{object}] userObject - the object to bind*/
            this.userObject = undefined;
        }
        /**
        * binds the component to the property of the userObject
        * @param {string} property - the name of the property to bind
        * @param {jassi.ui.Component} component - the component to bind
        * @param {string} [onChange] - functionname to register the  changehandler - if missing no autocommit is possible
        * @param {function} [getter] - function to get the value of the component - if missing .value is used
        * @param {function} [setter] - function to put the value of the component - if missing .value is used
        */
        add(property, component, onChange = undefined, getter = undefined, setter = undefined) {
            this.remove(component);
            this.components.push(component);
            this._properties.push(property);
            if (getter === undefined) {
                this._getter.push(function (component) {
                    return component["value"];
                });
            }
            else
                this._getter.push(getter);
            if (setter === undefined) {
                this._setter.push(function (component, value) {
                    component["value"] = value;
                });
            }
            else
                this._setter.push(setter);
            if (onChange === undefined) {
                this._onChange.push(component["onChange"]);
            }
            else
                this._onChange.push(onChange);
            if (this.userObject !== undefined) {
                var pos = this._properties.indexOf(property);
                let setter = this._setter[pos];
                setter(component, this.userObject[property]);
            }
            let _this = this;
            if (component[this._onChange[this._onChange.length - 1]]) {
                component[this._onChange[this._onChange.length - 1]]((event) => {
                    _this.componentChanged(component, property, event);
                });
            }
            // this._autocommit.push(undefined);
        }
        componentChanged(component, property, event) {
            let pos = this.components.indexOf(component);
            if (component.autocommit) {
                this._fromForm(pos);
            }
            var val = this._getter[pos](this.components[pos]); //this._getter[pos](this.components[pos]);
            //synchronize the new object to all the other components
            for (let x = 0; x < this.components.length; x++) {
                var test = this._getter[x](this.components[x]);
                if (this._properties[x] === property && test != val && this.components[x] !== component) {
                    this._setter[x](this.components[x], val);
                }
            }
        }
        remove(component) {
            for (var x = 0; x < this.components.length; x++) {
                if (this.components[x] === component) {
                    this.components.splice(x, 1);
                    this._properties.splice(x, 1);
                    this._getter.splice(x, 1);
                    this._setter.splice(x, 1);
                    this._onChange.splice(x, 1);
                    this._autocommit.splice(x, 1);
                }
            }
        }
        /**
         * defines getter and setter and connect this to the databinder
         * @param {object} object - the object where we define the property
         * @param {string} propertyname - the name of the property
         **/
        definePropertyFor(object, propertyname) {
            var _this = this;
            Object.defineProperty(object, propertyname, {
                get: function () { return _this.value; },
                set: function (newValue) {
                    if (newValue !== undefined && newValue.then !== undefined) {
                        newValue.then(function (ob2) {
                            _this.value = ob2;
                        });
                    }
                    else
                        _this.value = newValue;
                },
                enumerable: true,
                configurable: true
            });
        }
        /**
         * @member {object} value - the binded userobject - call toForm on set
         */
        get value() {
            // this.fromForm();
            return this.userObject;
        }
        set value(obj) {
            var _this = this;
            if (obj !== undefined && obj.then !== undefined) {
                obj.then(function (ob2) {
                    _this.toForm(ob2);
                });
            }
            else
                this.toForm(obj);
        }
        /**
         * binds the object to all added components
         * @param {object} obj - the object to bind
         */
        toForm(obj) {
            this.userObject = obj;
            for (var x = 0; x < this.components.length; x++) {
                var comp = this.components[x];
                var prop = this._properties[x];
                var sfunc = this._setter[x];
                var sget = this._getter[x];
                var oldValue = sget(comp);
                if (prop === "this") {
                    if (oldValue !== this.userObject) {
                        sfunc(comp, this.userObject);
                    }
                }
                else {
                    if (this.userObject === undefined) {
                        if (oldValue !== undefined)
                            sfunc(comp, undefined);
                    }
                    else {
                        if (oldValue !== this.userObject[prop]) {
                            sfunc(comp, this.userObject[prop]);
                        }
                    }
                }
                //var sfunc=this.setter[x];
                //this._toForm(prop,comp);
            }
        }
        /**
         * gets the objectproperties from all added components
         * @return {object}
         */
        fromForm() {
            if (this.userObject === undefined)
                return undefined;
            for (var x = 0; x < this.components.length; x++) {
                this._fromForm(x);
            }
            return this.userObject;
        }
        /**
         * get objectproperty
         * @param {number} x - the numer of the component
         */
        _fromForm(x) {
            var comp = this.components[x];
            var prop = this._properties[x];
            var sfunc = this._getter[x];
            var test = sfunc(comp);
            if (test !== undefined) {
                if (prop === "this") {
                    var val = test;
                    this.value = test;
                }
                else {
                    if (comp["converter"] !== undefined) {
                        test = comp["converter"].stringToObject(test);
                    }
                    this.userObject[prop] = test;
                }
            }
        }
        /**
         * register the autocommit handler if needed
         * @param {jassi.ui.DataComponent} component
         */
        /* checkAutocommit(component){
             if(component.autocommit!==true)
                 return;
             var pos=this.components.indexOf(component);
             if(this._autocommit[pos]!==undefined)
                 return;
             var onchange=this._onChange[pos];
             if(onchange===undefined)
                 return;
             var _this=this;
             this._autocommit[pos]=function(){
                 pos=_this.components.indexOf(component);
                 _this._fromForm(pos);
             };
             component[onchange](this._autocommit[pos]);
         }*/
        destroy() {
            this.components = [];
            this._properties = [];
            this._getter = [];
            this._setter = [];
            this._onChange = [];
            this._autocommit = [];
            this.userObject = undefined;
            super.destroy();
        }
    };
    Databinder = __decorate([
        Component_10.$UIComponent({ fullPath: "common/Databinder", icon: "mdi mdi-connection" }),
        Jassi_45.$Class("jassi.ui.Databinder"),
        __metadata("design:paramtypes", [])
    ], Databinder);
    exports.Databinder = Databinder;
});
// return CodeEditor.constructor;
define("jassi/ui/DesignDummy", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Image", "jassi/ui/MenuItem"], function (require, exports, Jassi_46, Image_1, MenuItem_3) {
    "use strict";
    var DesignDummy_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DesignDummy = void 0;
    let DesignDummy = DesignDummy_1 = class DesignDummy extends Image_1.Image {
        constructor() {
            super();
        }
        static createIfNeeded(designDummyFor, type, editorselectthis = undefined, oclass = undefined) {
            var icon = "mdi mdi-card-plus-outline";
            if (type === "beforeComponent")
                icon = "mdi mdi-card-plus";
            if (designDummyFor["designDummies"]) {
                for (var x = 0; x < designDummyFor["designDummies"].length; x++) {
                    var du = designDummyFor["designDummies"][x];
                    if (du.type === type)
                        return du;
                }
            }
            var designDummy;
            if (oclass === undefined)
                designDummy = new DesignDummy_1();
            else
                designDummy = new oclass();
            designDummy.designDummyFor = designDummyFor;
            designDummy.type = type;
            designDummy._parent = designDummyFor;
            designDummy.editorselectthis = editorselectthis;
            $(designDummy.domWrapper).removeClass("jcomponent");
            $(designDummy.domWrapper).addClass("jdesigndummy");
            $(designDummy.domWrapper).css("width", "16px");
            if (oclass === MenuItem_3.MenuItem) {
                designDummy.icon = icon;
            }
            else
                designDummy.src = icon;
            if (type === "atEnd")
                designDummyFor.add(designDummy);
            if (type === "beforeComponent")
                $(designDummyFor.domWrapper).prepend(designDummy.domWrapper);
            if (!designDummyFor["designDummies"])
                designDummyFor["designDummies"] = [];
            designDummyFor["designDummies"].push(designDummy);
            return designDummy;
            //
        }
        static destroyIfNeeded(designDummyFor, type) {
            if (designDummyFor["designDummies"]) {
                designDummyFor["designDummies"].forEach((dummy) => {
                    if (dummy["type"] === type) {
                        if (type === "atEnd")
                            designDummyFor.remove(dummy);
                        if (type === "beforeComponent")
                            designDummyFor.domWrapper.removeChild(dummy.domWrapper);
                        //(<Container>designDummyFor).remove(dummy); // comp.domWrapper.removeChild(comp["_designDummyPre"].domWrapper);
                        dummy.destroy();
                        /*dummy.domWrapper.parentNode.removeChild(dummy.domWrapper)
                        var pos=designDummyFor["designDummies"].indexOf(dummy);
                        if(pos>=0)
                            designDummyFor["designDummies"].splice(pos, 1);*/
                    }
                });
            }
        }
    };
    DesignDummy = DesignDummy_1 = __decorate([
        Jassi_46.$Class("jassi.ui.DesignDummy"),
        __metadata("design:paramtypes", [])
    ], DesignDummy);
    exports.DesignDummy = DesignDummy;
});
define("jassi/ui/DockingContainer", ["require", "exports", "jassi/ext/goldenlayout", "jassi/remote/Jassi", "jassi/ui/Container", "jassi/ui/Button", "jassi/ui/Textbox"], function (require, exports, goldenlayout_2, Jassi_47, Container_2, Button_4, Textbox_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DockingContainer = void 0;
    //goldenlayout custom version - fixed leak s.u.
    let DockingContainer = class DockingContainer extends Container_2.Container {
        /**
    * a container where the components could be docked
    * @class jassi.ui.DockingContainer
    */
        constructor(id = undefined) {
            super(id);
            super.init($('<div class="DockingContainer"/>')[0]);
            this.maximize();
            var _this = this;
            this._registeredcomponents = {};
            this._init();
            this._lastSize = -1;
            this._intersectionObserver = new IntersectionObserver(entries => {
                if (entries[0].intersectionRatio <= 0) {
                    return;
                }
                if (_this._lastSize !== _this.dom.offsetWidth * _this.dom.offsetHeight) {
                    _this._lastSize = _this.dom.offsetWidth * _this.dom.offsetHeight;
                    _this._myLayout.updateSize();
                }
            }, { rootMargin: `0px 0px 0px 0px` });
            this._intersectionObserver.observe(_this.dom);
        }
        static clearMemoryleak(container) {
            if (container === undefined) {
                //initialize to clean this code line $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
                if (goldenlayout_2.default.__lm.utils.fnBind.inited === undefined) {
                    goldenlayout_2.default.__lm.utils.fnBind = function (fn, context, boundArgs) {
                        var func = Function.prototype.bind.apply(fn, [context].concat(boundArgs || []));
                        func.orgFunc = fn;
                        func.orgOb = context;
                        return func;
                    };
                    goldenlayout_2.default.__lm.utils.fnBind.inited = true;
                }
                return;
            }
            container.off("destroy");
            //memory leak golden layout
            container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
            container.tab._dragListener._fUp = undefined;
            container.tab._dragListener._oDocument.off('mousemove touchmove', container.tab._dragListener._fMove);
            container.tab._dragListener._oDocument.off('mouseup touchend', container.tab._dragListener._fUp);
            //uw hack in goldenlayout.js memory leak
            //change: $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
            //in    : this._uweiMouseUp=lm.utils.fnBind( this._hideAdditionalTabsDropdown, this );
            //        $( document ).mouseup(this._uweiMouseUp );
            $(document).off("mouseup", container.tab.header._uweiMouseUp);
            container.tab.header.activeContentItem = undefined;
            $(container.tab.header.element).off("destroy");
            $(container.tab.header.element).off("mouseup");
            $(container.tab.header.element).remove();
            $(container.tab.element).remove();
            $(container.element).remove();
        }
        /**
         * add a component to the container
         * @param {jassi.ui.Component} component - the component to add
         * @param {string} title - the caption of the window
         * @param {string} name - the name of the window
         */
        add(component, title = "", name = undefined) {
            var exists = this._find(this._myLayout.root, name);
            component._parent = this;
            component.maximize();
            component.domWrapper._parent = this;
            if (name === undefined)
                name = title;
            this._registeredcomponents[name] = component;
            if (exists !== undefined) {
                console.warn("check memory leak");
                var old = exists.element[0].children[0].children[0];
                exists.element[0].children[0].replaceChild(component.domWrapper, old);
                old._this._parent = undefined;
                old._this.domWrapper._parent = undefined;
                return;
            }
            this._components.push(component);
            //delete from old parent
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            var config = {
                title: title,
                type: 'component',
                componentName: name,
                componentState: { title: title, name: name }
            };
            this._registerGL(name);
            var center = this._myLayout.root.contentItems[0];
            center.addChild(config);
        }
        /**
         * called on resizing could be redefined
         */
        onresize() {
        }
        /**
         * register a component to Golden layout
         * @param {String} name - the name of the component
         */
        _registerGL(name) {
            var _this = this;
            //save the component
            this._myLayout.registerComponent(name, function (container, state) {
                var component = _this._registeredcomponents[name];
                container.on('resize', function () {
                    _this.onresize();
                });
                container.on("destroy", function (data) {
                    container.off("resize");
                    container.off("destroy");
                    //memory leak golden layout
                    container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
                    container.tab._dragListener._fUp = undefined;
                    container.tab._dragListener._oDocument.off('mousemove touchmove', container.tab._dragListener._fMove);
                    container.tab._dragListener._oDocument.off('mouseup touchend', container.tab._dragListener._fUp);
                    if (_this._noDestroyChilds !== true) {
                        if (component._this !== undefined)
                            component._this.destroy();
                        delete _this._registeredcomponents[name];
                    }
                    delete _this._myLayout._components[name];
                    //uw hack in goldenlayout.js memory leak
                    //change: $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
                    //in    : this._uweiMouseUp=lm.utils.fnBind( this._hideAdditionalTabsDropdown, this );
                    //        $( document ).mouseup(this._uweiMouseUp );
                    var kk = container.tab.header._hideAdditionalTabsDropdown.bound === container.tab.header._uweiMouseUp;
                    //$(document).off("mouseup", container.tab.header._uweiMouseUp);
                    // container.tab.header.activeContentItem = undefined;
                    $(container.tab.header.element).off("destroy");
                    $(container.tab.header.element).off("mouseup");
                    $(container.tab.header.element).remove();
                    $(container.tab.element).remove();
                    $(container.element).remove();
                    delete component._container;
                });
                if (component.dom !== undefined)
                    component = component.dom;
                component._container = container;
                container.getElement()[0].appendChild(component); //html( '<h2>' + state.text + '</h2>');
            });
        }
        /**
         * remove a component from the container
         * @param {jassi.ui.Component} component - the component to add
         */
        remove(component) {
            component._parent = undefined;
            component.domWrapper._parent = undefined;
            var pos = this._components.indexOf(component);
            if (pos >= 0)
                this._components.splice(pos, 1);
            var container = component.dom._container;
            //   container.getElement()[0].removeChild(component.dom);
            //            this.dom.removeChild(component.domWrapper);
            console.warn("TODO call close tab?");
        }
        _init() {
            var config = {
                settings: {
                    showPopoutIcon: false,
                },
                content: [{
                        type: 'row',
                        isClosable: false,
                        content: []
                    }],
            };
            this._myLayout = new goldenlayout_2.default(config, this.dom);
            //	this._myLayout.on( 'selectionChanged', function(evt){
            //	    debugger;
            //	});
            var _this = this;
            this._myLayout.init();
            var thislayout = this._myLayout;
            this._windowResizer = function () {
                _this.update();
                window.setTimeout(function () {
                    _this.update();
                }, 100);
            };
            $(window).resize(this._windowResizer);
            /* this._parentResizer=function(){
                 //   alert("now");
                   var h = $(_this.dom.parent).height();
                   var w = $(_this.dom.parent).weigth();
                   _this.width=w;
                   _this.height=h;
               }
             $(this.dom.parent).resize(this._parentResizer);*/
            var func = function () {
                _this._myLayout.update();
                //     window.setTimeout(func,500);
            };
            // var thislayout=this._myLayout;
            //    window.setTimeout(func,500);
            /* var test=this.dom.parent;
                  $(this.dom.parent).resize(function(){
                 var h = $(_this.dom.parent).height();
                 var w = $(_this.dom.parent).weigth();
                 _this.width=w;
                 _this.height=h;
             });*/
            // $(this.dom.firstChild).css("height","100%");
            //   $(this.dom.firstChild).css("width","100%");
        }
        /**
         * activate the window
         * @param {string} name - the name of the window
         */
        show(name) {
            var m = this._find(this._myLayout.root, name);
            if (m.parent.header !== undefined)
                m.parent.header.parent.setActiveContentItem(m);
        }
        /**
         * update the layout (size)
         */
        update() {
            this._myLayout.updateSize();
        }
        /**
         * finds a child in the config
         */
        _find(parent, name) {
            if (parent.contentItems === undefined)
                return undefined;
            for (var x = 0; x < parent.contentItems.length; x++) {
                if (parent.contentItems[x].config.componentName === name)
                    return parent.contentItems[x];
                var test = this._find(parent.contentItems[x], name);
                if (test !== undefined)
                    return test;
            }
            return undefined;
        }
        /** @member {String} - the layout of the windows */
        get layout() {
            return JSON.stringify(this._myLayout.toConfig());
        }
        set layoutold(value) {
            var fc = this.dom.firstChild;
            while (fc) {
                this.dom.removeChild(fc);
                fc = this.dom.firstChild;
            }
            var config = JSON.parse(value);
            this._myLayout = new goldenlayout_2.default(config, this.dom);
            for (var name in this._registeredcomponents)
                this._registerGL(name);
            this._myLayout.init();
            this.update();
        }
        set layout(value) {
            for (var x = 0; x < this._components.length; x++) {
                var component = this._components[x];
                var container = component.dom["_container"];
                if (container.getElement()[0].children.length > 0)
                    container.getElement()[0].removeChild(container.getElement()[0].firstChild);
            }
            /* var fc = this.dom.firstChild;
    
             while( fc ) {
                 this.dom.removeChild( fc );
                 fc = this.dom.firstChild;
             }*/
            this._noDestroyChilds = true;
            this._myLayout.destroy();
            delete this._noDestroyChilds;
            var config = JSON.parse(value);
            this._myLayout = new goldenlayout_2.default(config, this.dom);
            for (var name in this._registeredcomponents)
                this._registerGL(name);
            this._myLayout.init();
            this.update();
            this.addSelectionEvent(this._myLayout.root);
        }
        addSelectionEvent(element) {
            if (element.contentItems !== undefined) {
                element.on("activeContentItemChanged", function (evt) {
                    console.log(evt.componentName);
                });
                for (let x = 0; x < element.contentItems.length; x++) {
                    this.addSelectionEvent(element.contentItems[x]);
                }
            }
        }
        destroy() {
            $(window).off("resize", this._windowResizer);
            //  $(this.dom.parent).off("resize",this._parentResizer);
            this._windowResizer = undefined;
            // this._parentResizer=undefined;
            this._intersectionObserver.unobserve(this.dom);
            this._intersectionObserver = undefined;
            this._myLayout.destroy();
            this._myLayout = undefined;
            this._registeredcomponents = {};
            super.destroy();
        }
    };
    DockingContainer = __decorate([
        Jassi_47.$Class("jassi.ui.DockingContainer"),
        __metadata("design:paramtypes", [Object])
    ], DockingContainer);
    exports.DockingContainer = DockingContainer;
    Jassi_47.default.test = function () {
        var dock = new DockingContainer();
        var bt = new Button_4.Button();
        dock.add(bt, "Hallo", "Hallo");
        var text = new Textbox_3.Textbox();
        dock.add(text, "Hallo2", "Hallo2");
        // jassi.windows.add(dock,"dock");
        dock.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"stack","width":100,"height":80.99041533546327,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Hallo","type":"component","componentName":"Hallo","componentState":{"title":"Hallo","name":"Hallo"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.00958466453674,"content":[{"title":"Hallo2","type":"component","componentName":"Hallo2","componentState":{"title":"Hallo2","name":"Hallo2"},"isClosable":true,"reorderEnabled":true}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        bt.onclick(function () {
            text.value = dock.layout;
            //  dock.layout=state;
            //var config=JSON.parse(state);
            //dock._myLayout = new GoldenLayout( config,dock.dom );
            //dock._myLayout.init();
        });
        return dock;
    };
});
define("jassi/ui/ErrorPanel", ["require", "exports", "jassi/ui/Panel", "jassi/base/Errors", "jassi/remote/Jassi", "jassi/ui/Button", "jassi_editor/util/TSSourceMap", "jassi/base/Router", "jassi/base/Actions"], function (require, exports, Panel_9, Errors_2, Jassi_48, Button_5, TSSourceMap_1, Router_4, Actions_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ErrorPanel = void 0;
    let ErrorPanel = class ErrorPanel extends Panel_9.Panel {
        /**
     * shows errors
     * @class jassi.ui.ErrorPanel
     */
        constructor() {
            super();
            this.layout();
        }
        static async showDialog() {
            Router_4.router.navigate("#do=jassi.ui.ErrorPanel");
        }
        layout() {
            var _this = this;
            this.IDClear = new Button_5.Button();
            this.IDClear.tooltip = "Clear log";
            this.IDClear.icon = "mdi mdi-delete";
            this.IDClear.onclick(function () {
                _this.clear();
                Jassi_48.default.errors.items = [];
            });
            this.IDClear.width = 35;
            this.IDSearch = new Button_5.Button();
            this.IDSearch.tooltip = "search errors";
            this.IDSearch.icon = "mdi mdi-file-search-outline";
            this.IDSearch.onclick(function () {
                _this.search();
            });
            this.IDToolbar = new Panel_9.Panel();
            this.IDToolbar.width = "99%";
            this.IDToolbar.add(this.IDClear);
            this.IDToolbar.add(this.IDSearch);
            this.IDToolbar.height = 20;
            super.add(this.IDToolbar);
            var value = $('<span><font  size="2"><span class="errorpanel"></span></font></span>')[0];
            this.dom.appendChild(value);
            this._container = $(this.dom).find(".errorpanel")[0];
            this.registerError();
            //old Errors
            for (var x = 0; x < Jassi_48.default.errors.items.length; x++) {
                this.addError(Jassi_48.default.errors.items[x]);
            }
            if (window["jassi_debug"] === undefined)
                window["jassi_debug"] = { variables: [] };
        }
        /**
         * search Errors in code
         **/
        async search() {
            var typescript = (await new Promise((resolve_28, reject_28) => { require(["jassi_editor/util/Typescript"], resolve_28, reject_28); })).default;
            await typescript.initService();
            var all = await typescript.getDiagnosticsForAll();
            if (all.length === 0)
                $.notify("no Errors found", "info", { position: "right" });
            for (var x = 0; x < all.length; x++) {
                var diag = all[x];
                var s = diag.file.fileName;
                var pos = typescript.getLineAndCharacterOfPosition(diag.file.fileName, diag.start);
                var href = window.location.origin;
                var err = {
                    filename: diag.file.fileName,
                    lineno: pos.line,
                    colno: pos.character,
                    error: {
                        message: diag.messageText,
                        stack: "" //href + "/" + diag.file.fileName + ":" + pos.line + ":" + pos.character
                    }
                };
                Errors_2.Errors.errors.addError(err);
            }
        }
        /**
         * adds a new error
         * @param {object} error - the error
         */
        async addError(error) {
            var _a;
            var msg = "";
            if (error.infoMsg !== undefined) {
                msg = error.infoMsg + "<br>";
            }
            else {
                var sstack = "";
                var m = (_a = error.error) === null || _a === void 0 ? void 0 : _a.message;
                if (!m)
                    m = "";
                if (m.messageText)
                    m = m.messageText;
                if (error.error) {
                    sstack = m.replaceAll(":", "") + "(" + error.filename + ":" + error.lineno + ":" + error.colno + ")\n";
                    if (error.error.stack !== undefined)
                        sstack = sstack + error.error.stack;
                }
                if (error.reason !== undefined) {
                    sstack = error.reason.message + ":::\n";
                    if (error.reason.stack !== undefined)
                        sstack = sstack + error.reason.stack;
                }
                var stack = sstack.split('\n');
                msg = "";
                for (var i = 0; i < stack.length; i++) {
                    var line = stack[i];
                    if (line.indexOf(".ts:") > 0) {
                        msg = msg + '<div>' + line.substring(0, line.lastIndexOf("(")) +
                            '<a href="#" onclick="jassi.ErrorPanel.prototype.onsrclink(this);">' +
                            line.substr(line.lastIndexOf("(") + 1, line.length - 1) + '</a>)' + "" + '</div>';
                    }
                    else {
                        if (line.split(":").length < 4)
                            continue; //edge and chrome insert message in stack->ignore
                        var poshttp = line.indexOf("http");
                        var url = await this._convertURL(line.substring(poshttp, line.length));
                        line = line.replace("\n", "");
                        var ident = (i === 0 ? "0" : "20");
                        msg = msg + '<div style="text-indent:' + ident + 'px;">' + line.substring(0, poshttp) +
                            '<a href="#" onclick="jassi.ErrorPanel.prototype.onsrclink(this);">' +
                            url + '</a>' + (line.endsWith(")") ? ")" : "") + '</div>';
                    }
                }
            }
            var value = $('<span>' + msg + '</span>');
            $(this._container).prepend(value);
            //  this.dom.appendChild(value);
        }
        async _convertURL(url) {
            //eliminate ?
            var lpos = url.indexOf("?");
            if (lpos > 0)
                url = url.substring(0, lpos) + url.substring(url.indexOf(":", lpos));
            var href = window.location.href;
            href = href.substring(0, window.location.href.lastIndexOf("/"));
            url = url.replace("$temp", "");
            url = url.replace(href + "/", "");
            if (url.endsWith(")"))
                url = url.substring(0, url.length - 1);
            var wurl = window.location.href.split("/app.html")[0];
            url = url.replace(wurl, "");
            if (!url.startsWith("/"))
                url = "/" + url;
            if (url.startsWith("/js") && url.indexOf(".js") > -1) {
                var aurl = url.substring(1).split(":");
                var newline = await new TSSourceMap_1.TSSourceMap().getLineFromJS(aurl[0], Number(aurl[1]), Number(aurl[2]));
                url = aurl[0].substring(3).replace(".js", ".ts") + ":" + newline + ":" + aurl[2];
                if (url.startsWith("tmp/"))
                    url = url.substring(4);
            }
            return url;
        }
        /**
         * deletes all errors
         */
        clear() {
            while (this._container.firstChild) {
                this._container.removeChild(this._container.firstChild);
            }
        }
        registerError() {
            var _this = this;
            Jassi_48.default.errors.onerror(function (err) {
                _this.addError(err);
            }, this._id);
        }
        unregisterError() {
            Jassi_48.default.errors.offerror(this._id);
        }
        destroy() {
            this.unregisterError();
            super.destroy();
            //this._container
        }
    };
    __decorate([
        Actions_11.$Action({
            name: "Administration/Errors",
            icon: "mdi mdi-emoticon-confused-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ErrorPanel, "showDialog", null);
    ErrorPanel = __decorate([
        Actions_11.$ActionProvider("jassi.base.ActionNode"),
        Jassi_48.$Class("jassi.ui.ErrorPanel"),
        __metadata("design:paramtypes", [])
    ], ErrorPanel);
    exports.ErrorPanel = ErrorPanel;
    function test() {
        var ret = new ErrorPanel();
        return ret;
    }
    exports.test = test;
    ;
    ErrorPanel.prototype["onsrclink"] = function (param) {
        var data = param.text.split(":");
        if (data[1] === "")
            return;
        Router_4.router.navigate("#do=jassi_editor.CodeEditor&file=" + data[0] + "&line=" + data[1]);
        // jassi_editor.CodeEditor.open(param.text);
    };
    Jassi_48.default.ErrorPanel = ErrorPanel;
});
define("jassi/ui/FileExplorer", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Tree", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi/remote/Server", "jassi/base/Router", "jassi/base/Actions", "jassi/ui/OptionDialog", "jassi_editor/util/Typescript", "jassi/ui/ContextMenu"], function (require, exports, Jassi_49, Tree_2, Panel_10, Textbox_4, Server_3, Router_5, Actions_12, OptionDialog_6, Typescript_3, ContextMenu_2) {
    "use strict";
    var FileExplorer_4;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.FileExplorer = exports.FileActions = void 0;
    //drag from Desktop https://www.html5rocks.com/de/tutorials/file/dndfiles/
    let FileActions = class FileActions {
        static async newFile(all, fileName = undefined, code = "", open = false) {
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            if (fileName === undefined) {
                var res = await OptionDialog_6.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, ".ts");
                if (res.button === "ok" && res.text !== all[0].name) {
                    fileName = res.text;
                }
                else
                    return;
            }
            console.log("create " + fileName);
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
            var newfile = path + "/" + fileName;
            var ret = await new Server_3.Server().createFile(newfile, code);
            var newkey = path + "|" + fileName;
            if (ret !== "") {
                alert(ret);
                return;
            }
            try {
                await FileExplorer.instance.refresh();
                await FileExplorer.instance.tree.activateKey(newkey);
                if (open)
                    Router_5.router.navigate("#do=jassi_editor.CodeEditor&file=" + newkey.replaceAll("|", "/"));
            }
            catch (err) {
                debugger;
            }
        }
        static async download(all) {
            var path = all[0].fullpath;
            var byteCharacters = atob(await new Server_3.Server().zip(path));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // If you want to use the image in your DOM:
            var blob = new Blob([byteArray], { type: "application/zip" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.href = url;
            link.click();
            link.remove();
        }
        static async newFolder(all) {
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            var res = await OptionDialog_6.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
            if (res.button === "ok" && res.text !== all[0].name) {
                console.log("create Folder" + res.text);
                var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
                var newfile = path + "/" + res.text;
                var ret = await new Server_3.Server().createFolder(newfile);
                var newkey = path + "|" + res.text;
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                await FileExplorer.instance.refresh();
                FileExplorer.instance.tree.activateKey(newkey);
            }
        }
        static async dodelete(all) {
            var s = "";
            all.forEach((node) => {
                s = s + "" + node.fullpath + "<br/>";
            });
            var res = await OptionDialog_6.OptionDialog.show("Delete this?<br/>" + s, ["ok", "cancel"], undefined, true);
            if (res.button === "ok" && res.text !== all[0].name) {
                var ret = await new Server_3.Server().delete(all[0].fullpath);
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                var key = FileExplorer.instance.tree.getKeyFromItem(all[0].parent);
                await FileExplorer.instance.refresh();
                FileExplorer.instance.tree.activateKey(key);
            }
        }
        static async rename(all) {
            if (all.length !== 1)
                alert("only one file could be renamed");
            else {
                var res = await OptionDialog_6.OptionDialog.show("Enter new name:", ["ok", "cancel"], undefined, true, all[0].name);
                if (res.button === "ok" && res.text !== all[0].name) {
                    console.log("rename " + all[0].name + " to " + res.text);
                    var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
                    var path = all[0].parent !== undefined ? all[0].parent.fullpath : "";
                    var newfile = path + "/" + res.text;
                    var ret = await new Server_3.Server().rename(all[0].fullpath, newfile);
                    var newkey = key.replace(all[0].name, res.text);
                    if (ret !== "") {
                        alert(ret);
                        return;
                    }
                    if (!all[0].isDirectory())
                        Typescript_3.default.renameFile(all[0].fullpath, newfile);
                    await FileExplorer.instance.refresh();
                    FileExplorer.instance.tree.activateKey(newkey);
                }
            }
        }
        static async refresh(all) {
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
            await FileExplorer.instance.refresh();
            FileExplorer.instance.tree.activateKey(key);
        }
        static async open(all) {
            var node = all[0];
            if (node.isDirectory())
                return;
            Router_5.router.navigate("#do=jassi_editor.CodeEditor&file=" + node.fullpath);
        }
    };
    __decorate([
        Actions_12.$Action({
            name: "New/File",
            icon: "mdi mdi-file",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, String, String, Boolean]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newFile", null);
    __decorate([
        Actions_12.$Action({
            name: "Download",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "download", null);
    __decorate([
        Actions_12.$Action({
            name: "New/Folder",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newFolder", null);
    __decorate([
        Actions_12.$Action({ name: "Delete" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "dodelete", null);
    __decorate([
        Actions_12.$Action({ name: "Rename" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "rename", null);
    __decorate([
        Actions_12.$Action({ name: "Refresh" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "refresh", null);
    __decorate([
        Actions_12.$Action({
            name: "Open",
            isEnabled: function (all) {
                return !all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "open", null);
    FileActions = __decorate([
        Actions_12.$ActionProvider("jassi.remote.FileNode"),
        Jassi_49.$Class("jassi.ui.FileActions")
    ], FileActions);
    exports.FileActions = FileActions;
    let FileExplorer = FileExplorer_4 = class FileExplorer extends Panel_10.Panel {
        constructor() {
            super();
            FileExplorer_4.instance = this;
            //this.maximize();
            $(this.dom).css("width", "calc(100% - 8px)");
            $(this.dom).css("height", "calc(100% - 25px)"); //why 25????
            this.tree = new Tree_2.Tree();
            this.search = new Textbox_4.Textbox();
            this.layout();
            this.tree.propStyle = node => { return this.getStyle(node); };
        }
        getStyle(node) {
            var _a;
            var ret = undefined;
            if (((_a = node.flag) === null || _a === void 0 ? void 0 : _a.indexOf("fromMap")) > -1) {
                ret = {
                    color: "green"
                };
            }
            return ret;
        }
        async refresh() {
            let root = (await new Server_3.Server().dir());
            root.fullpath = "";
            root.name = "client";
            var keys = this.tree.getExpandedKeys();
            this.tree.items = [root];
            if (keys.indexOf("client") === -1)
                keys.push("client");
            await this.tree.expandKeys(keys);
        }
        async layout() {
            var _this = this;
            this.tree.width = "100%";
            this.tree.height = "100%";
            super.add(this.search);
            super.add(this.tree);
            this.tree.propDisplay = "name";
            this.tree.propChilds = "files";
            let context = new ContextMenu_2.ContextMenu();
            this.tree.contextMenu = context;
            context.includeClassActions = true;
            this.refresh();
            this.add(this.tree);
            // this._files.files;
            this.tree.onclick(function (evt) {
                if (evt.data !== undefined) {
                    FileActions.open([evt.data]);
                }
            });
            $("#" + this._id).css("flow", "visible");
            this.search.onkeydown(function (evt) {
                window.setTimeout(() => {
                    _this.tree.filter(_this.search.value);
                    if (evt.code === "Enter") {
                        //_this.tree.
                    }
                }, 100);
            });
        }
    };
    FileExplorer.instance = undefined;
    FileExplorer = FileExplorer_4 = __decorate([
        Jassi_49.$Class("jassi.ui.FileExplorer"),
        __metadata("design:paramtypes", [])
    ], FileExplorer);
    exports.FileExplorer = FileExplorer;
    function test() {
        return new FileExplorer();
    }
    exports.test = test;
});
define("jassi/ui/HTMLEditorPanel", ["require", "exports", "jassi/ui/Panel", "jassi/ui/HTMLPanel", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ext/tinymce", "jassi/remote/Registry"], function (require, exports, Panel_11, HTMLPanel_3, Button_6, Jassi_50, tinymce_1, Registry_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEditorPanel = void 0;
    class Me {
    }
    let HTMLEditorPanel = class HTMLEditorPanel extends Panel_11.Panel {
        constructor(id = undefined) {
            super();
            this.layout();
        }
        async layout() {
            var me = this.me = {};
            me.IDHtml = new HTMLPanel_3.HTMLPanel();
            me.IDChange = new Button_6.Button();
            this.add(me.IDHtml);
            this.add(me.IDChange);
            //me.IDHtml.text="Hallo";
            var randclass = "ed" + Registry_17.default.nextID();
            $(me.IDHtml.dom).addClass(randclass);
            me.IDChange.text = "OK";
            me.IDChange.onclick(function (event) {
            });
            /*	 $(randclass).tinymce({
                 //	script_url : '../js/tinymce/tinymce.min.js',
                         statusbar: false,
                            //toolbar: true,
                            menubar: false
                 });*/
            // tinymce.activeEditor.destroy();
            var editor = await tinymce_1.default.init({
                statusbar: false,
                //toolbar: true,
                menubar: false,
                selector: '.' + randclass,
            });
            // editor.setContent("Hallo");
            //tinymce.activeEditor.remove();
            //tinymce.execCommand('mceRemoveControl', true, '');
            // me.IDHtml.height="calc(100% - 50px)";
        }
        set value(val) {
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(val);
                this.dom.appendChild(el);
            }
            else
                $(el).html(val);
        }
        get value() {
            var el = this.dom.children[0];
            if (el === undefined)
                return "";
            return $(el).html();
        }
    };
    HTMLEditorPanel = __decorate([
        Jassi_50.$Class("jassi.ui.HTMLEditorPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLEditorPanel);
    exports.HTMLEditorPanel = HTMLEditorPanel;
    Jassi_50.default.test = async function () {
        var dlg = new HTMLEditorPanel();
        //	dlg.value=jassi.db.load("de.Kunde",9);	
        return dlg;
    };
});
// return CodeEditor.constructor;
define("jassi/ui/HTMLPanel", ["require", "exports", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/ui/DataComponent"], function (require, exports, Component_11, Jassi_51, Property_15, DataComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLPanel = void 0;
    var bugtinymce = undefined;
    let HTMLPanel = class HTMLPanel extends DataComponent_1.DataComponent {
        /*[
            'undo redo | bold italic underline | fontsizeselect', //fontselect
            'forecolor backcolor | numlist bullist outdent indent'
        ];*/
        constructor(id = undefined) {
            super();
            this.toolbar = ['undo redo | bold italic underline', 'forecolor backcolor | fontsizeselect  '];
            super.init($('<div class="HTMLPanel"><div class="HTMLPanelContent"> </div></div>')[0]);
            //  super.init($('<div class="HTMLPanel"></div>')[0]);
            var el = this.dom.children[0];
            this._designMode = false;
            this.newlineafter = false;
            // $(this.__dom).css("min-width", "10px");
        }
        get newlineafter() {
            return $(this.dom).css("display") === "inline-block";
        }
        set newlineafter(value) {
            $(this.dom).css("display", value ? "" : "inline-block");
            $(this.dom.children[0]).css("display", value ? "" : "inline-block");
        }
        compileTemplate(template) {
            return new Function('obj', 'with(obj){ return \'' +
                template.replace(/\n/g, '\\n').split(/{{([^{}]+)}}/g).map(function (expression, i) {
                    return i % 2 ? ('\'+(' + expression.trim() + ')+\'') : expression;
                }).join('') +
                '\'; }');
        }
        get template() {
            return this._template;
        }
        /**
         * template string  component.value=new Person();component.template:"{{name}}"}
         */
        set template(value) {
            this._template = value;
            this.value = this.value; //reformat value
        }
        /**
         * @member {string} code - htmlcode of the component
         **/
        set value(code) {
            var scode = code;
            this._value = code;
            if (this.template) {
                if (this._value === undefined)
                    scode = "";
                else {
                    scode = this.compileTemplate(this.template)(code);
                }
            }
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(scode);
                this.dom.appendChild(el);
            }
            else
                $(el).html(scode);
        }
        get value() {
            /*var el = this.dom.children[0];
            if (el === undefined)
                return "";
            var ret = $(el).html();
            return ret;*/
            return this._value;
        }
        /**
         * @member {boolean} - the component could be edited
         */
        set editAllowed(value) {
            /*	this._editAllowed=value;
                if(enable){
                    requirejs(["tinymce"],function(){
                        _this._tcm=tinymce.init({
                            
                                //menubar: false,
                                //statusbar: false,
                                //toolbar: false,
                                selector: '#'+_this._id,//'.HTMLPanel',
                                inline: true,
                                setup:function(ed) {
                                    
                                   ed.on('blur', function(e) {
                                                if($("#"+ed.id)[0]===undefined)
                                                    return;
                                       var html=$("#"+ed.id)[0]._this;
                                       var text= ed.getContent();
                                       text='"'+text.substring(31,text.length-7).replaceAll("\"","\\\"")+'"';
                                       _this.value=text;
                                   });
                               }
                            });
                        });
                }else{
                    console.log("dest");
                    tinymce.editors[_this._id].destroy();
                }*/
        }
        get editAllowed() {
            return this._editAllowed;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
            }
            super.extensionCalled(action);
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         * @param {jassi.ui.ComponentDesigner} editor - editor instance
         */
        _setDesignMode(enable, editor) {
            var _this = this;
            this._designMode = enable;
            if (enable) {
                console.log("activate tiny");
                requirejs(["jassi/ext/tinymce"], function (tinymcelib) {
                    if (!bugtinymce) { //https://stackoverflow.com/questions/20008384/tinymce-how-do-i-prevent-br-data-mce-bogus-1-text-in-editor
                        const tinymceBind = window["tinymce"].DOM.bind;
                        window["tinymce"].DOM.bind = (target, name, func, scope) => {
                            // TODO This is only necessary until https://github.com/tinymce/tinymce/issues/4355 is fixed
                            if (name === 'mouseup' && func.toString().includes('throttle()')) {
                                return func;
                            }
                            else {
                                return tinymceBind(target, name, func, scope);
                            }
                        };
                    }
                    var tinymce = window["tinymce"]; //oder tinymcelib.default
                    var config = {
                        //	                valid_elements: 'strong,em,span[style],a[href],ul,ol,li',
                        //  valid_styles: {
                        //    '*': 'font-size,font-family,color,text-decoration,text-align'
                        //  },
                        menubar: false,
                        //statusbar: false,
                        selector: '#' + _this._id,
                        inline: true,
                        setup: function (ed) {
                            ed.on('change', function (e) {
                                var text = _this.dom.firstElementChild.innerHTML;
                                console.log(text);
                                if (text === '<br data-mce-bogus="1">')
                                    text = "";
                                editor._propertyEditor.setPropertyInCode("value", '"' + text.replaceAll('"', "'") + '"', true);
                            });
                            ed.on('blur', function (e) {
                                if (_this._designMode === false)
                                    return;
                                //editor.editDialog(false);
                                if ($("#" + ed.id)[0] === undefined)
                                    return;
                                editor._draganddropper.enableDraggable(true);
                                //editor.editDialog(true);
                            });
                        }
                    };
                    if (_this["toolbar"])
                        config["toolbar"] = _this["toolbar"];
                    var sic = _this.value;
                    _this._tcm = tinymce.init(config); //changes the text to <br> if empty - why?
                    if (sic === "" && _this.value !== sic)
                        _this.value = "";
                    //_this.value=sic;
                    $(_this.dom).doubletap(function (e) {
                        if (_this._designMode === false)
                            return;
                        var sic = editor._draganddropper.draggableComponents;
                        editor._draganddropper.enableDraggable(false);
                        //	editor._draganddropper.uninstall();
                        //editor._resizer.uninstall();
                        /*   var sel = _this._id;
                           if (tinymce !== undefined && tinymce.editors[sel] !== undefined) {
                               //$(e.currentTarget.parentNode._this.domWrapper).draggable('disable');
                               tinymce.editors[sel].fire('focus');
                           }*/
                    });
                });
            } //else
            //	tinymce.editors[_this._id].destroy();
        }
        destroy() {
            super.destroy();
        }
    };
    __decorate([
        Property_15.$Property({ description: "line break after element", default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel.prototype, "newlineafter", null);
    __decorate([
        Property_15.$Property({ decription: 'e.g. component.value=new Person();component.template:"{{name}}"' }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "template", null);
    __decorate([
        Property_15.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLPanel.prototype, "value", null);
    HTMLPanel = __decorate([
        Component_11.$UIComponent({ fullPath: "common/HTMLPanel", icon: "mdi mdi-cloud-tags" /*, initialize: { value: "text" } */ }),
        Jassi_51.$Class("jassi.ui.HTMLPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLPanel);
    exports.HTMLPanel = HTMLPanel;
});
define("jassi/ui/Image", ["require", "exports", "jassi/ui/Component", "jassi/ui/Property", "jassi/remote/Jassi", "jassi/ui/DataComponent"], function (require, exports, Component_12, Property_16, Jassi_52, DataComponent_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Image = void 0;
    let Image = class Image extends DataComponent_2.DataComponent {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            //  var img=$('<div >')[0];
            //super.init($('<img vspace="0" hspace="0"  border="0"  src="" alt="">')[0]);
            super.init($('<div style="display: inline-block;white-space: nowrap;"><img  vspace="0" hspace="0"  border="0"  src="" alt=""></div>')[0]);
        }
        onclick(handler) {
            $("#" + this._id).click(function () {
                handler();
            });
        }
        /**
        * @member {string} value - value of the component
        */
        set value(value) {
            this.src = value;
        }
        get value() {
            return this.src;
        }
        get width() {
            return super.width;
        }
        set width(value) {
            if (value === undefined)
                $(this.dom.children[0]).attr("width", "");
            else
                $(this.dom.children[0]).attr("width", "100%");
            super.width = value;
        }
        get height() {
            return super.height;
        }
        set height(value) {
            if (value === undefined)
                $(this.dom.children[0]).attr("height", "");
            else
                $(this.dom.children[0]).attr("height", "100%");
            super.height = value;
        }
        /**
        * @member {string} - link to image
        */
        set src(icon) {
            $(this.dom).removeClass();
            $(this.dom.children[0]).attr("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi ")) {
                $(this.dom).addClass(icon);
                $(this.dom.children[0]).css("visibility", "hidden");
            }
            else {
                $(this.dom.children[0]).attr("src", icon);
                $(this.dom.children[0]).css("visibility", "");
            }
        }
        get src() {
            var ret = $(this.dom).attr("src");
            if (ret === "")
                return $(this.dom).attr('class');
            else
                return ret;
            //            return $(this.dom).attr("src");
        }
    };
    __decorate([
        Property_16.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Image.prototype, "value", null);
    __decorate([
        Property_16.$Property({ type: "image" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Image.prototype, "src", null);
    Image = __decorate([
        Component_12.$UIComponent({ fullPath: "default/Image", icon: "mdi mdi-file-image" }) //
        ,
        Jassi_52.$Class("jassi.ui.Image"),
        __metadata("design:paramtypes", [])
    ], Image);
    exports.Image = Image;
    function test() {
        var ret = new Image();
        ret.src = "mdi mdi-file-image";
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/InvisibleComponent", ["require", "exports", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Property"], function (require, exports, Component_13, Jassi_53, Property_17) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InvisibleComponent = void 0;
    /**
     * invivisible Component
     **/
    let InvisibleComponent = class InvisibleComponent extends Component_13.Component {
        constructor(properties = undefined) {
            super(properties);
        }
    };
    InvisibleComponent = __decorate([
        Jassi_53.$Class("jassi.ui.InvisibleComponent")
        /*@$Property({name:"label",hide:true})
        @$Property({name:"icon",hide:true})
        @$Property({name:"tooltip",hide:true})
        @$Property({name:"x",hide:true})
        @$Property({name:"y",hide:true})
        @$Property({name:"width",hide:true})
        @$Property({name:"height",hide:true})
        @$Property({name:"contextMenu",hide:true})
        @$Property({name:"invisible",hide:true})
        @$Property({name:"hidden",hide:true})
        @$Property({name:"styles",hide:true})*/
        ,
        Property_17.$Property({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], InvisibleComponent);
    exports.InvisibleComponent = InvisibleComponent;
});
define("jassi/ui/Menu", ["require", "exports", "jassi/jassi", "jassi/ui/Container", "jassi/ui/Property", "jassi/ui/MenuItem", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/DesignDummy"], function (require, exports, jassi_1, Container_3, Property_18, MenuItem_4, Jassi_54, Component_14, DesignDummy_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Menu = void 0;
    /*declare global {
        interface JQuery {
                //menu: any;
        }
    }*/
    let Menu = class Menu extends Container_3.Container {
        constructor(options = undefined) {
            super();
            this._isRoot = true;
            super.init($('<ul ' + ` style="Menu"></ul>`)[0]);
            if (options !== undefined && options.noUpdate === true) {
                this._noUpdate = true;
            }
            else
                $(this.dom).menu();
            this._text = "";
            this._icon = "";
        }
        _sample() {
            super.init($('<ul ' + ` class="Menu">
<li>  <div><img  src="res/car.ico" />Save</div></li>
<li title="create button" onclick="doCreate()"><div><img  src="res/car.ico" />Create</div>
    <ul class="Menu" style="visibility:hidden">
    <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
    </ul>
</li>
<li title="update button2"> <div> <img src="res/tree.ico" />Update2</div>
    <ul style="Menu">
      <li> <div><img   src="res/car.ico" />Hoho</div></li>
     <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
      </ul>
</li>
<li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
</ul>`)[0]);
        }
        _menueChanged() {
            if (this._isRoot && this._noUpdate !== true) {
                $(this.dom).menu();
                $(this.dom).menu("destroy");
                $(this.dom).menu();
            }
            if (this._parent !== undefined && this._parent._menueChanged !== undefined)
                this._parent._menueChanged();
        }
        getMainMenu() {
            if (this._parent !== undefined && this._parent.getMainMenu !== undefined)
                return this._parent.getMainMenu();
            if (this._mainMenu !== undefined)
                return this._mainMenu;
            return this;
        }
        /**
        * adds a component to the container before an other component
        * @param {jassi.ui.Component} component - the component to add
        * @param {jassi.ui.Component} before - the component before then component to add
        */
        addBefore(component, before) {
            super.addBefore(component, before);
            this._menueChanged();
        }
        /**
          * adds a component to the container
          * @param {jassi.ui.Menu} component - the component to add
          */
        add(component) {
            if (this._designDummy !== undefined && this._components[this._components.length - 1] === this._designDummy)
                super.addBefore(component, this._designDummy);
            else
                super.add(component);
            this._menueChanged();
        }
        onclick(handler) {
            $("#" + this._id).click(function (ob) {
                handler(ob);
            });
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
        /**
        * activates or deactivates designmode
        * @param {boolean} enable - true if activate designMode
        */
        _setDesignMode(enable) {
            this._designMode = enable;
            if (enable) { //dummy at the end
                DesignDummy_2.DesignDummy.createIfNeeded(this, "atEnd", undefined, MenuItem_4.MenuItem);
                /*            if(this._designDummy===undefined){
                                this._designDummy=new MenuItem();
                                this._designDummy.icon="res/add-component.ico";
                                $(this._designDummy.domWrapper).removeClass("jcomponent");
                                this._designDummy.designDummyFor="atEnd";
                                this.add(this._designDummy);
                            }else if(this._designDummy!==undefined&& this["isAbsolute"]===true){//TODO isAbsolute relevant?
                                this.remove(this._designDummy);
                                this._designDummy=undefined;
                            }*/
            }
            else {
                DesignDummy_2.DesignDummy.destroyIfNeeded(this, "atEnd");
                /* if(this._designDummy!==undefined){
                    this.remove(this._designDummy);
                    this._designDummy=undefined;
                }*/
            }
        }
        destroy() {
            $(this.dom).menu();
            $(this.dom).menu("destroy");
            super.destroy();
        }
    };
    __decorate([
        Property_18.$Property({ name: "onclick", type: "function", default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Menu.prototype, "onclick", null);
    Menu = __decorate([
        Component_14.$UIComponent({ fullPath: "common/Menu", icon: "mdi mdi-menu", initialize: { text: "menu" } }),
        Jassi_54.$Class("jassi.ui.Menu"),
        __metadata("design:paramtypes", [Object])
    ], Menu);
    exports.Menu = Menu;
    jassi_1.default.test = async function () {
        // kk.o=0;
        var menu = new Menu();
        menu.width = 200;
        /*	var save=new jassi.ui.Menu();
            var save2=new jassi.ui.Menu();
        
            menu.add(save);
            save.onclick(function(){
                alert("ok");
            });
            save.text="dd";
            menu.add(save2);
            save2.text="pppq";
            save2.icon="res/button";
            save2.onclick(function(event){
                
            });*/
        return menu;
    };
});
define("jassi/ui/MenuItem", ["require", "exports", "jassi/ui/Component", "jassi/ui/Menu", "jassi/ui/Property", "jassi/remote/Jassi", "jassi/ui/Container"], function (require, exports, Component_15, Menu_3, Property_19, Jassi_55, Container_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MenuItem = void 0;
    //jassi.myRequire("lib/contextMenu.css");
    let MenuItem = class MenuItem extends Container_4.Container {
        constructor() {
            super();
            super.init($('<li style="white-space: nowrap"><div><span class="menuitemspan"><img class="menuitemicon" /></span><span class="menuitemtext">.</span></div></li>')[0], { noWrapper: true });
            $(this.dom).addClass("designerNoResizable");
            this._text = "";
            this._icon = "";
            this.items = new Menu_3.Menu();
            $(this.items.dom).menu("destroy");
            this.items._parent = this;
            this._components = [this.items]; //neede for getEditableComponents
            delete this.items._isRoot;
        }
        onclick(handler) {
            var _this = this;
            $("#" + this._id).click(function (ob) {
                handler(ob);
                //_this.this.items._parent.close();
            });
        }
        /**
        * @member {string} - the icon of the button
        */
        set icon(icon) {
            this._icon = icon;
            var img;
            var el1 = $(this.dom).find(".menuitemspan");
            el1.removeClass();
            el1.addClass("menuitemspan");
            $(this.dom).find(".menuitemicon").attr("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                el1.addClass(icon);
            }
            else {
                $(this.dom).find(".menuitemicon").attr("src", icon);
            }
            //if (icon === "")
            //    icon = "res/dummy.ico";
            //$(this.dom).find(".menuitemicon").attr("src", icon);
        }
        get icon() {
            var ret = $(this.dom).find(".menuitemicon").attr("src");
            if (ret === "") {
                ret = $(this.dom).find(".menuitemspan").attr("class").replace("menuitemspan ", "");
            }
            return ret;
        }
        /**
         * @member {string} - the caption of the button
         */
        set text(value) {
            //<li><div><img  src="res/car.ico" /><span>Save</span></div></li>
            this._text = value;
            var h;
            $(this.dom).find(".menuitemtext")[0].innerText = value;
        }
        get text() {
            return $(this.dom).find(".menuitemtext")[0].innerText;
        }
        destroy() {
            super.destroy();
            this.items.destroy;
        }
        getMainMenu() {
            if (this._parent !== undefined && this._parent.getMainMenu !== undefined)
                return this._parent.getMainMenu();
            if (this._mainMenu !== undefined)
                return this._mainMenu;
            return undefined;
        }
        _menueChanged() {
            if (this.items._components.length > 0 && this.items.dom.parentNode !== this.dom) {
                this.items.dom.parentNode.removeChild(this.items.dom);
                this.dom.appendChild(this.items.dom);
                $(this.items.dom).addClass("jcontainer"); //for drop-target
            }
            if (this.items._components.length > 0)
                $(this.dom).addClass("iw-has-submenu");
            else
                $(this.dom).removeClass("iw-has-submenu");
            if (this._parent !== undefined && this._parent._menueChanged !== undefined)
                this._parent._menueChanged();
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._designMode = action.componentDesignerSetDesignMode.enable;
                return this.items.extensionCalled(action); //setDesignMode(enable);
            }
            if (action.componentDesignerComponentCreated) {
                var x = 0;
                var test = this.getMainMenu();
                if (test !== undefined) {
                    //$(test.menu.dom).css("display","inline-block");//
                    test._menueChanged();
                }
                return;
                //var design=codeeditor._design.dom;
                //component.show({top:$(design).offset().top+30,left:$(design).offset().left+5});
            }
            super.extensionCalled(action);
        }
    };
    __decorate([
        Property_19.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MenuItem.prototype, "onclick", null);
    __decorate([
        Property_19.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "icon", null);
    __decorate([
        Property_19.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "text", null);
    MenuItem = __decorate([
        Component_15.$UIComponent({ fullPath: "common/MenuItem", icon: "mdi mdi-menu-open", initialize: { text: "menu" }, editableChildComponents: ["items"] }),
        Jassi_55.$Class("jassi.ui.MenuItem"),
        __metadata("design:paramtypes", [])
    ], MenuItem);
    exports.MenuItem = MenuItem;
    async function test() {
        // kk.o=0;
        var menu = new Menu_3.Menu();
        var save = new MenuItem();
        var save2 = new MenuItem();
        menu.width = 200;
        menu.add(save);
        save.onclick(function () {
            alert("ok");
        });
        save.text = "dd";
        save.items.add(save2);
        save2.text = "pppq";
        save2.icon = "mdi mdi-car"; //"res/red.jpg";
        save2.onclick(function (event) {
        });
        return menu;
    }
    exports.test = test;
});
define("jassi/ui/ObjectChooser", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Table", "jassi/ui/Panel", "jassi/ui/Button", "jassi/ui/Textbox", "jassi/ui/Property", "jassi/ui/Component", "jassi/remote/Classes"], function (require, exports, Jassi_56, Table_4, Panel_12, Button_7, Textbox_5, Property_20, Component_16, Classes_21) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ObjectChooser = void 0;
    /*
    https://blog.openshift.com/using-filezilla-and-sftp-on-windows-with-openshift/
    */
    class Me {
    }
    let ObjectChooser = class ObjectChooser extends Button_7.Button {
        constructor() {
            super();
            /**
            * @member {number} - the height of the dialog
            */
            this.dialogHeight = 300;
            /**
            * @member {number} - the width of the dialog
            */
            this.dialogWidth = 450;
            this.layout();
        }
        get title() {
            return "Select";
        }
        layout() {
            var me = this.me = {};
            var _this = this;
            this.autocommit = true;
            this.text = "";
            this.onclick(function (event) {
                if (_this.value !== undefined) {
                    me.IDTable.value = _this.value;
                }
                var dlg = $(me.IDPanel.dom).dialog({
                    width: _this.dialogWidth,
                    height: _this.dialogHeight,
                    modal: true
                    /*beforeClose: function(event, ui) {
                       
                    } */
                });
                _this.callEvent("showDialog", event);
            });
            this.icon = "mdi mdi-glasses";
            me.IDPanel = new Panel_12.Panel();
            me.IDCancel = new Button_7.Button();
            var _this = this;
            me.IDSearch = new Textbox_5.Textbox();
            me.IDOK = new Button_7.Button();
            me.IDTable = new Table_4.Table();
            me.IDPanel.add(me.IDSearch);
            me.IDPanel.add(me.IDOK);
            me.IDPanel.add(me.IDCancel);
            me.IDPanel.add(me.IDTable);
            me.IDOK.width = 55;
            me.IDOK.text = "OK";
            me.IDOK.onclick(function (event) {
                _this.ok();
            });
            me.IDSearch.width = 170;
            me.IDSearch.oninput(function (event) {
                me.IDTable.search("all", me.IDSearch.value, true);
            });
            $(me.IDTable.dom).doubletap(function (data) {
                _this.ok();
            });
            me.IDSearch.onkeydown(function (event) {
                if (event.keyCode == 13) {
                    _this.ok();
                    return false;
                }
                if (event.keyCode == 27) {
                    _this.cancel();
                    return false;
                }
            });
            me.IDSearch.height = 15;
            me.IDTable.width = "100%";
            me.IDTable.height = "calc(100% - 100px)";
            setTimeout(() => { me.IDSearch.focus(); }, 200);
            setTimeout(() => { me.IDSearch.focus(); }, 1000);
            me.IDCancel.onclick(function (event) {
                _this.cancel();
            });
            me.IDCancel.text = "Cancel";
            me.IDPanel.height = "100%";
            me.IDPanel.width = "100%";
        }
        ok() {
            var me = this.me;
            $(me.IDPanel.dom).dialog("destroy");
            this.value = me.IDTable.value;
            this.callEvent("change", event);
        }
        cancel() {
            var me = this.me;
            $(me.IDPanel.dom).dialog("destroy");
        }
        /**
         * @member {object} value - selection of the component
         */
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        async loadObjects(classname) {
            var cl = await Classes_21.classes.loadClass(classname);
            return await cl.find();
        }
        set items(value) {
            var _this = this;
            if (value !== undefined && typeof (value) === "string") {
                this.loadObjects(value).then((data) => {
                    _this.me.IDTable.items = data;
                });
            }
            else
                _this.me.IDTable.items = value;
        }
        get items() {
            return this._items;
        }
        /**
        * called if value has changed
        * @param {function} handler - the function which is executed
        */
        onchange(handler) {
            this.addEvent("change", handler);
        }
        /**
         * @member {bool} autocommit -  if true the databinder will update the value on every change
         *                              if false the databinder will update the value on databinder.toForm
         */
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //	this._databinder.checkAutocommit(this);
        }
        /**
         * binds a component to a databinder
         * @param {jassi.ui.Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
         */
        bind(databinder, property) {
            this._databinder = databinder;
            databinder.add(property, this, "onchange");
            //databinder.checkAutocommit(this);
        }
        destroy() {
            this._value = undefined;
            this.me.IDPanel.destroy();
            super.destroy();
        }
    };
    __decorate([
        Property_20.$Property({ default: 450 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogHeight", void 0);
    __decorate([
        Property_20.$Property({ default: 300 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogWidth", void 0);
    __decorate([
        Property_20.$Property({ type: "string", description: "the classname for to choose" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "items", null);
    __decorate([
        Property_20.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "onchange", null);
    __decorate([
        Property_20.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ObjectChooser.prototype, "autocommit", null);
    __decorate([
        Property_20.$Property({ type: "databinder" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "bind", null);
    ObjectChooser = __decorate([
        Component_16.$UIComponent({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" }),
        Jassi_56.$Class("jassi.ui.ObjectChooser"),
        __metadata("design:paramtypes", [])
    ], ObjectChooser);
    exports.ObjectChooser = ObjectChooser;
    async function test() {
        // kk.o=0;
        var Kunde = (await new Promise((resolve_29, reject_29) => { require(["de/remote/Kunde"], resolve_29, reject_29); })).Kunde;
        var dlg = new ObjectChooser();
        dlg.items = "de.Kunde";
        dlg.value = (await Kunde.find({ id: 1 }))[0];
        //	var kunden=await jassi.db.load("de.Kunde");
        //	dlg.value=kunden[4];
        //	dlg.me.IDTable.items=kunden;
        return dlg;
    }
    exports.test = test;
});
define("jassi/ui/OptionDialog", ["require", "exports", "jassi/ui/Panel", "jassi/ui/BoxPanel", "jassi/ui/HTMLPanel", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/ui/Textbox", "jassi/ui/PropertyEditor"], function (require, exports, Panel_13, BoxPanel_6, HTMLPanel_4, Button_8, Jassi_57, Property_21, Textbox_6, PropertyEditor_1) {
    "use strict";
    var OptionDialog_7;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.OptionDialog = void 0;
    class Me {
    }
    let OptionDialog = OptionDialog_7 = class OptionDialog extends Panel_13.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.parentComponent = undefined;
            this.text = "";
            this.options = [];
            this.selectedOption = "cancel";
            /* @member {string} - the text for the Dialog*/
        }
        layout() {
            var me = this.me = {};
            var _this = this;
            me.boxpanel1 = new BoxPanel_6.BoxPanel();
            me.htmlpanel1 = new HTMLPanel_4.HTMLPanel();
            me.buttons = new BoxPanel_6.BoxPanel();
            me.buttons.horizontal = true;
            me.htmlpanel1.value = this.text;
            this.add(me.boxpanel1);
            this.add(me.buttons);
            me.htmlpanel1.value = "";
            me.boxpanel1.add(me.htmlpanel1);
            me.boxpanel1.width = "100%";
            me.boxpanel1.height = "calc(100% - 50px)";
            me.inputText = new Textbox_6.Textbox();
            me.boxpanel1.add(me.inputText);
            me.propertyEditor = new PropertyEditor_1.PropertyEditor(undefined);
            me.propertyEditor.width = "100%";
            me.propertyEditor.height = "100%";
            me.boxpanel1.add(me.propertyEditor);
            for (var x = 0; x < this.options.length; x++) {
                var button = new Button_8.Button();
                me.buttons.add(button);
                button.onclick(function (evt) {
                    _this.selectedOption = evt.currentTarget._this.text;
                    $(_this.dom).dialog("close");
                });
                button.text = this.options[x];
            }
        }
        /**
        * ask for properties in propertygrid
        * @param text - the text to be displayed
        * @param  properties - the properties which should be filled, marked by @$Property
        * @param  options - the options e.g ["ok","Cancel"]
        * @param parent - the parent component
        * @param modal - display the dialog modal
        */
        static async askProperties(text, properties, options, parent = undefined, modal = false) {
            return await OptionDialog_7._show(text, options, parent, modal, undefined, properties);
        }
        /**
        * @param text - the text to be displayed
        * @param  options - the options
        * @param parent - the parent component
        * @param modal - display the dialog modal
        * @param  inputDefaultText - if the user should input something
        *
        */
        static async show(text, options, parent = undefined, modal = false, inputDefaultText = undefined) {
            return await OptionDialog_7._show(text, options, parent, modal, inputDefaultText);
        }
        static async _show(text, options, parent, modal, inputDefaultText = undefined, properties = undefined) {
            var promise = new Promise(function (resolve, reject) {
                var ret = new OptionDialog_7();
                var config = {};
                ret.options = options;
                ret.layout();
                ret.me.htmlpanel1.value = text;
                if (inputDefaultText === undefined) {
                    ret.me.boxpanel1.remove(ret.me.inputText);
                    ret.me.inputText.destroy();
                }
                else {
                    ret.me.inputText.value = inputDefaultText;
                }
                if (properties === undefined) {
                    ret.me.boxpanel1.remove(ret.me.propertyEditor);
                    ret.me.propertyEditor.destroy();
                }
                else {
                    ret.me.propertyEditor.value = properties;
                    config.width = "400";
                    config.height = "400";
                }
                config.beforeClose = function (event, ui) {
                    resolve({ button: ret.selectedOption, text: ret.me.inputText.value, properties: properties });
                };
                if (modal)
                    config.modal = modal;
                if (parent !== undefined)
                    config.appendTo = "#" + parent._id;
                var dlg = $(ret.dom).dialog(config);
            });
            return await promise;
        }
    };
    __decorate([
        Property_21.$Property(),
        __metadata("design:type", String)
    ], OptionDialog.prototype, "text", void 0);
    OptionDialog = OptionDialog_7 = __decorate([
        Jassi_57.$Class("jassi.ui.OptionDialog"),
        __metadata("design:paramtypes", [Object])
    ], OptionDialog);
    exports.OptionDialog = OptionDialog;
    let Testprop = class Testprop {
    };
    __decorate([
        Property_21.$Property(),
        __metadata("design:type", Boolean)
    ], Testprop.prototype, "visible", void 0);
    __decorate([
        Property_21.$Property(),
        __metadata("design:type", String)
    ], Testprop.prototype, "text", void 0);
    Testprop = __decorate([
        Jassi_57.$Class("jassi.ui.OptionDialogTestProp")
    ], Testprop);
    async function test() {
        var tet = await OptionDialog.show("Should I ask?", ["yes", "no"], undefined, false);
        if (tet.button === "yes") {
            var age = await OptionDialog.show("Whats yout age?", ["ok", "cancel"], undefined, false, "18");
            if (age.button === "ok")
                console.log(age.text);
            var prop = new Testprop();
            var ret2 = await OptionDialog.askProperties("Please fill:", prop, ["ok", "cancel"]);
        }
        //var ret=new jassi.ui.Dialog();
        //return ret;
    }
    exports.test = test;
    ;
});
define("jassi/ui/Panel", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Container", "jassi/ui/Component", "jassi/ui/Property", "jassi/ui/DesignDummy"], function (require, exports, Jassi_58, Container_5, Component_17, Property_22, DesignDummy_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Panel = void 0;
    let PanelCreateProperties = class PanelCreateProperties extends Component_17.ComponentCreateProperties {
    };
    __decorate([
        Property_22.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], PanelCreateProperties.prototype, "useSpan", void 0);
    PanelCreateProperties = __decorate([
        Jassi_58.$Class("jassi.ui.PanelCreateProperties")
    ], PanelCreateProperties);
    let Panel = 
    //@$Property({ name: "new/useSpan", type: "boolean", default: false })
    class Panel extends Container_5.Container {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            var addStyle = "";
            var tag = properties !== undefined && properties.useSpan === true ? "span" : "div";
            if (properties != undefined && properties.id === "body") {
                super();
                this.dom = document.body;
                this.domWrapper = this.dom;
                /** @member {numer}  - the id of the element */
                this._id = "body";
                this.dom.id = "body";
                //super.init($('<div class="Panel" style="border:1px solid #ccc;"/>')[0]);
                //            $(document.body).append(this.domWrapper); 
            }
            else {
                super(properties);
                if (properties === undefined || properties.id === undefined) {
                    //super.init($('<div class="Panel"/>')[0]);
                    super.init($('<' + tag + ' class="Panel" style="border:1px solid #ccc;"/>')[0]);
                }
            }
            this._designMode = false;
            this.isAbsolute = false;
        }
        /**
         * @param {boolean} the elements are ordered absolute
         **/
        set isAbsolute(value) {
            this._isAbsolute = value;
            if (value)
                $(this.dom).addClass("jabsolutelayout");
            else
                $(this.dom).removeClass("jabsolutelayout");
            if (this._designMode !== undefined)
                this._setDesignMode(this._designMode);
            if (this._designMode && this._activeComponentDesigner) {
                this._activeComponentDesigner.editDialog(true);
            }
        }
        get isAbsolute() {
            return this._isAbsolute;
        }
        max() {
            if (this._id == "body") {
                $(this.domWrapper).css("width", "100%");
                $(this.domWrapper).css("height", "calc(100vh - 2px)");
            }
            else {
                $(this.domWrapper).css("width", "100%");
                $(this.domWrapper).css("height", "100%");
            }
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
        /**
        * adds a component to the container
        * @param {jassi.ui.Component} component - the component to add
        */
        add(component) {
            //     $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
            return super.add(component);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassi.ui.Component} component - the component to add
         * @param {jassi.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            //   $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
            return super.addBefore(component, before);
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         */
        _setDesignMode(enable) {
            this._designMode = enable;
            if (enable) { //dummy in containers at the end
                if (this.isAbsolute === false) {
                    DesignDummy_3.DesignDummy.createIfNeeded(this, "atEnd", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                    /*            if (this._designDummy === undefined && this.isAbsolute === false) {
                                    this._designDummy = new Image();
                                    this._designDummy._parent=this;
                                    console.log(this._designDummy._id);
                                    $(this._designDummy.domWrapper).removeClass("jcomponent");
                                    $(this._designDummy.domWrapper).addClass("jdesigndummy");
                                    $(this._designDummy.domWrapper).css("width","16px");
                                    this._designDummy["designDummyFor"] = "atEnd";
                                    this._designDummy["src"] = "res/add-component.ico";
                                    this._designDummy["_editorselectthis"]=(this["_editorselectthis"]?this["_editorselectthis"]:this);
                                    //$(this.domWrapper).append(this._designDummy.domWrapper);
                                    this.domWrapper.appendChild(this._designDummy.domWrapper);
                                } else if (this._designDummy !== undefined && this.isAbsolute === true) {
                                    this.remove(this._designDummy);
                                    this._designDummy.destroy();
                                    this._designDummy = undefined;
                                }*/
                }
                else {
                    DesignDummy_3.DesignDummy.destroyIfNeeded(this, "atEnd");
                    /* if (this._designDummy !== undefined) {
                         this.remove(this._designDummy);
                         this._designDummy = undefined;
                     }*/
                }
            }
            else {
                DesignDummy_3.DesignDummy.destroyIfNeeded(this, "atEnd");
            }
            if (enable) { //dummy in containers at the end
                if (this.isAbsolute === false) {
                    for (var x = 0; x < this._components.length; x++) {
                        var comp = this._components[x];
                        if (comp instanceof Container_5.Container && !$(comp.dom).hasClass("jdisableaddcomponents")) {
                            DesignDummy_3.DesignDummy.createIfNeeded(comp, "beforeComponent", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                        }
                    }
                }
            }
            else {
                for (var x = 0; x < this._components.length; x++) {
                    var comp = this._components[x];
                    DesignDummy_3.DesignDummy.destroyIfNeeded(comp, "beforeComponent");
                }
            }
        }
        destroy() {
            super.destroy();
            if (this._designDummy)
                this._designDummy.destroy();
            this._activeComponentDesigner = undefined;
        }
    };
    __decorate([
        Property_22.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Panel.prototype, "isAbsolute", null);
    Panel = __decorate([
        Component_17.$UIComponent({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] }),
        Jassi_58.$Class("jassi.ui.Panel"),
        Property_22.$Property({ name: "new", type: "json", componentType: "jassi.ui.PanelCreateProperties" })
        //@$Property({ name: "new/useSpan", type: "boolean", default: false })
        ,
        __metadata("design:paramtypes", [PanelCreateProperties])
    ], Panel);
    exports.Panel = Panel;
});
define("jassi/ui/Property", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry", "jassi/remote/Classes"], function (require, exports, Jassi_59, Registry_18, Classes_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Property = exports.$Property = void 0;
    function $Property(property = undefined) {
        return function (target, propertyKey, descriptor) {
            //debugger;
            var test = Classes_22.classes.getClassName(target);
            if (propertyKey === undefined)
                Registry_18.default.registerMember("$Property", target.prototype, "new", property); //allow registerMember in class definition
            else
                Registry_18.default.registerMember("$Property", target, propertyKey, property);
        };
    }
    exports.$Property = $Property;
    let Property = class Property {
        /**
         * Property for PropertyEditor
         * @class jassi.ui.EditorProperty
         */
        constructor(name = undefined, type = undefined) {
            this.name = name;
            this.type = type;
        }
    };
    Property = __decorate([
        Jassi_59.$Class("jassi.ui.Property"),
        __metadata("design:paramtypes", [Object, Object])
    ], Property);
    exports.Property = Property;
});
define("jassi/ui/PropertyEditor", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Image", "jassi_editor/util/Parser", "jassi/ui/ComponentDescriptor", "jassi/ui/PropertyEditors/NameEditor", "jassi/base/PropertyEditorService", "jassi/ui/Property", "jassi/base/PropertyEditorService"], function (require, exports, Jassi_60, Panel_14, Image_2, Parser_2, ComponentDescriptor_4, NameEditor_1, PropertyEditorService_1, Property_23) {
    "use strict";
    var PropertyEditor_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestProperties = exports.PropertyEditor = void 0;
    let PropertyEditor = PropertyEditor_2 = class PropertyEditor extends Panel_14.Panel {
        /**
        * edit object properties
        */
        constructor(codeEditor) {
            super();
            this.readPropertyValueFromDesign = false;
            this.codeChanges = {};
            this.table = new Panel_14.Panel();
            this.table.init($(`<table style="table-layout: fixed;font-size:11px">
                            <thead>
                                <tr>
                                    <th class="propertyeditorheader">Name</th>
                                    <th class="propertyeditorheader">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="propertyeditorrow">
                                    <td >a1</td><td>b1</td>
                                </tr>
                            </tbody>
                            </table>`)[0]);
            this.add(this.table);
            this.table.width = "98%";
            $(".propertyeditorheader").resizable({ handles: "e" });
            //            $( ".propertyeditorheader" ).css("height","8px");
            //$(this.dom).css("height","");
            this.clear();
            this.layout();
            /**
             * @member {jassi_editor.CodeEditor} - the parent CodeEditor
             * if undefined - no code changes would be done
             * */
            this.codeEditor = codeEditor;
            /** @member {jassi.base.Parser} - the code-parser*/
            this.parser = new Parser_2.Parser();
            /** @member {string} - the name of the variable in code*/
            this.variablename = "";
            /** @member {jassi.ui.PropertyEditor} - parent propertyeditor*/
            this.parentPropertyEditor;
            /** @member {[jassi.ui.PropertyEditor]} - if multiselect - the propertyeditors of the other elements*/
            this._multiselectEditors;
        }
        /**
         * adds a new property
         * @param {string} name  - the name of the property
         * @param {jassi.ui.PropertyEditors.Editor} editor - the propertyeditor to render the property
         * @param {string} description - the the description is tooltip over the name
         */
        addProperty(name, editor, description) {
            var component = editor.getComponent();
            var row = $('<tr nowrap class="propertyeditorrow"><td  style="font-size:11px" nowrap title="' + description + '">' + name + '</td><td class="propertyvalue"  nowrap></td></tr>')[0];
            var but = new Image_2.Image();
            but.src = "mdi mdi-delete-forever-outline";
            var _this = this;
            but.onclick(function () {
                _this.removePropertyInDesign(name);
                _this.removePropertyInCode(name);
                _this.updateParser();
                _this.value = _this.value;
            });
            $(row.children[0]).tooltip();
            // $(row.children[0]).css("font-size", "11px");
            $(row.children[0]).prepend(but.dom);
            //$(component.dom).css("font-size", "11px");
            this.table.dom.children[1].appendChild(row);
            row["_components"] = [editor, but];
            /* $(component.dom).css({
                 "width":"100%",
                 "padding":"initial",
                 "font-size":"11px"
             });*/
            try {
                row.children[1].appendChild(component.dom);
            }
            catch (_a) {
                //Why
                //debugger;
            }
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        oncodeChanged(handler) {
            this.addEvent("codeChanged", handler);
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        onpropertyChanged(handler) {
            this.addEvent("propertyChanged", handler);
        }
        /**
         * delete all properties
         */
        clear() {
            var trs = $(this.dom).find(".propertyeditorrow");
            for (var x = 0; x < trs.length; x++) {
                var row = trs[x];
                if (row["_components"] !== undefined) {
                    for (var c = 0; c < row["_components"].length; c++) {
                        row["_components"][c]["__destroyed"] = true;
                        row["_components"][c].destroy();
                    }
                }
                $(row).remove();
            }
        }
        /**
       * if parentPropertyEditor is defined then the value of the property must be substituted
       * @param {jassi.ui.PropertyEditor propertyEditor
       * @param {[opject} props
       * @param {string} propname the propertyName
       */
        /* _getParentEditorValue(propertyEditor,ob,propname){
             
         }*/
        /**
         * if parentPropertyEditor is defined then the properties are defined there
         * @param {jassi.ui.PropertyEditor propertyEditor
         * @param {[opject} props
         * @param {string} propname the propertyName
        
        _addParentEditorProperties(propertyEditor, props, propname) {
            if (propertyEditor.parentPropertyEditor !== undefined)
                this._addParentEditorProperties(propertyEditor.parentPropertyEditor, props, propertyEditor.variablename + "/" + propname);
            else {
                var ret;
                if (this.showThisProperties !== undefined) {
                    ret = Tools.copyObject(this.showThisProperties);
                } else
                    ret = ComponentDescriptor.describe(propertyEditor.value.constructor, true).fields;
                for (var x = 0;x < ret.length;x++) {
                    if (ret[x].name.startsWith(propname + "/")) {
                        var test = ret[x].name.substring((propname + "/").length);
                        if (test.indexOf("/") < 0) {
                            ret[x].name = test;
                            props.push(ret[x]);
                        }
                    }
    
                }
            }
        } */
        /**
         * get all known instances for type
         * @param {type} type - the type we are interested
         * @returns {[string]}
         */
        getVariablesForType(type) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getVariablesForType(type);
        }
        /**
         * get the variablename of an object
         * @param {object} ob - the object to search
         * @returns {string}
         */
        getVariableFromObject(ob) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getVariableFromObject(ob);
        }
        /**
          * gets the name object of the given variabel
          * @param {string} ob - the name of the variable
         *  @returns {string}
         */
        getObjectFromVariable(ob) {
            if (this.codeEditor === undefined)
                return undefined;
            return this.codeEditor.getObjectFromVariable(ob);
        }
        /**
         * @member {object}  - the rendered object
         */
        set value(value) {
            if (value !== this._value && this.parentPropertyEditor === undefined)
                this.codeChanges = {};
            if (value !== undefined || (value === null || value === void 0 ? void 0 : value.dom) !== undefined) {
                if (!$(value.dom).is(":focus"))
                    $(value.dom).focus();
            }
            if (value !== undefined && this.value !== undefined && this.value.constructor === value.constructor) {
                this._value = value;
                if (this.codeEditor)
                    this.variablename = this.codeEditor.getVariableFromObject(this._value);
                this.update();
                return;
            }
            this._multiselectEditors = [];
            if (value !== undefined && value.length > 1) {
                for (var x = 1; x < value.length; x++) {
                    var multi = new PropertyEditor_2(this.codeEditor);
                    multi.codeEditor = this.codeEditor;
                    multi.parentPropertyEditor = this.parentPropertyEditor;
                    multi.value = value[x];
                    multi.parser = this.parser;
                    if (multi.codeEditor !== undefined)
                        this.variablename = this.codeEditor.getVariableFromObject(value[x]);
                    this._multiselectEditors.push(multi);
                }
                this._value = value[0];
            }
            else
                this._value = value;
            if (value === []) {
                this._value = undefined;
                return;
            }
            if (this.codeEditor !== undefined && this.parentPropertyEditor === undefined)
                this.variablename = this.codeEditor.getVariableFromObject(this._value);
            var _this = this;
            this._initValue();
            _this.update();
        }
        swapComponents(first, second) {
            //swap Design
            if (first._parent !== second._parent)
                throw "swaped components must have the same parent";
            var parent = first._parent;
            var ifirst = parent._components.indexOf(first);
            var isecond = parent._components.indexOf(second);
            var dummy = $("<div/>");
            parent._components[ifirst] = second;
            parent._components[isecond] = first;
            $(first.domWrapper).replaceWith(dummy);
            $(second.domWrapper).replaceWith($(first.domWrapper));
            dummy.replaceWith($(second.domWrapper));
            //swap Code
            var firstname = this.getVariableFromObject(first);
            var secondname = this.getVariableFromObject(second);
            var parentname = this.getVariableFromObject(parent);
            this.parser.swapPropertyWithParameter(parentname, "add", firstname, secondname);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
        }
        _initValue() {
            var _a;
            var props = [];
            /* if (this.parentPropertyEditor !== undefined)
                 this._addParentEditorProperties(this.parentPropertyEditor, props, this.variablename);
             else*/ {
                if (this.showThisProperties !== undefined)
                    props = this.showThisProperties;
                else {
                    if (!this._value)
                        props = [];
                    else
                        props = (_a = ComponentDescriptor_4.ComponentDescriptor.describe(this._value.constructor)) === null || _a === void 0 ? void 0 : _a.fields;
                    if (!props)
                        props = [];
                }
            }
            //TODO cache this
            var _this = this;
            _this.properties = {};
            /*for (var x = 0; x < props.length; x++) {
                _this.properties[props[x].name] = { name: props[x].name, component: undefined, description: props[x].description };
            }*/
            var allProperties = [];
            if (_this._multiselectEditors.length === 0) {
                var hasvarname = _this.getVariableFromObject(_this._value);
                if (hasvarname !== undefined) {
                    var nameEditor = new NameEditor_1.NameEditor("name", _this);
                    //_this.addProperty("name", nameEditor, "the name of the component");
                    //allProperties.push({name:"name",editor:nameEditor,description:"the name of the component"});
                    _this.properties["name"] = {
                        name: "name", editor: nameEditor,
                        description: "the name of the component", "component": nameEditor.getComponent()
                    };
                    //nameEditor.ob = _this._value;
                }
            }
            for (var x = 0; x < props.length; x++) {
                if (props[x].name.indexOf("/") > -1) {
                }
                else {
                    _this.properties[props[x].name] = { isVisible: props[x].isVisible, name: props[x].name, component: undefined, description: props[x].description };
                    var editor = PropertyEditorService_1.propertyeditor.createFor(props[x], _this);
                    if (editor === undefined) {
                        console.log("Editor not found for " + _this.variablename);
                        continue;
                    }
                    var sname = editor.property.name;
                    editor.onedit(function (event) {
                        _this.callEvent("propertyChanged", event);
                    });
                    //editor.ob = _this._value;
                    if (_this.properties[editor.property.name] === undefined) {
                        console.log("Property not found " + editor.property);
                        continue;
                    }
                    _this.properties[editor.property.name].editor = editor;
                    if (editor !== undefined && _this.properties[editor.property.name] !== undefined) {
                        _this.properties[editor.property.name].component = editor.getComponent();
                    }
                }
            }
            for (var key in _this.properties) {
                var prop = _this.properties[key];
                var doAdd = true;
                for (var m = 0; m < _this._multiselectEditors.length; m++) {
                    var test = _this._multiselectEditors[m].properties[prop.name];
                    if (test === undefined)
                        doAdd = false;
                }
                if (doAdd) {
                    if (prop.component !== undefined)
                        //_this.addProperty(prop.name, prop.editor, prop.description);
                        allProperties.push({ name: prop.name, editor: prop.editor, description: prop.description, isVisible: prop.isVisible });
                }
            }
            _this.clear();
            for (let p = 0; p < allProperties.length; p++) {
                let prop = allProperties[p];
                _this.addProperty(prop.name, prop.editor, prop.description);
            }
            // });
        }
        /**
         * updates values
         */
        update() {
            for (var key in this.properties) {
                var prop = this.properties[key];
                if (prop.editor === undefined) {
                    console.warn("PropertyEditor for " + key + " not found");
                    continue;
                }
                //sometimes the component is already deleted e.g.resize
                if (prop.editor["__destroyed"] !== true) {
                    if (prop.isVisible) {
                        var isVisible = prop.isVisible(this.value);
                        if (isVisible) {
                            $(prop.editor.component.dom.parentNode).css('display', '');
                        }
                        else {
                            $(prop.editor.component.dom.parentNode).css('display', 'none');
                        }
                    }
                    prop.editor.ob = this.value;
                }
            }
        }
        get value() {
            return this._value;
        }
        /**
         * gets the value of the property
         * @param {string} property
         * @param {boolean} [noDefaultValue] - returns no default value of the property
         * @returns {object}
         */
        getPropertyValue(property, noDefaultValue = undefined) {
            if (this.readPropertyValueFromDesign) {
                let ret = this._value[property.name];
                if (ret === undefined && !noDefaultValue)
                    ret = property.default;
                return ret;
            }
            var ret = undefined;
            if (this.codeEditor === undefined) { //read property
                var r = this.codeChanges[property.name];
                if (r === undefined) {
                    if (this.parentPropertyEditor === undefined && this._value[property.name])
                        return this._value[property.name];
                    if (noDefaultValue !== true)
                        return property.default;
                    return r;
                }
                return r;
            }
            if (property.name === "new" && this.variablename.startsWith("me.")) {
                if (this.parser.data["me"] === undefined)
                    return undefined;
                var prop = this.parser.data["me"][this.variablename.substring(3)];
                if (prop === undefined)
                    return undefined;
                var constr = prop[0].value;
                if (constr.startsWith("typedeclaration:") && prop.length > 1)
                    constr = prop[1].value;
                ret = constr.substring(constr.indexOf("(") + 1, constr.lastIndexOf(")"));
                if (ret === "")
                    ret = undefined;
            }
            else {
                ret = this.parser.getPropertyValue(this.variablename, property.name);
                if (this.codeEditor === undefined && ret === undefined && this._value !== undefined) {
                    ret = this._value[property.name];
                    if (typeof (ret) === "function") {
                        ret = undefined;
                    }
                }
                if (ret === undefined && noDefaultValue !== true)
                    ret = property.default;
            }
            if (this._multiselectEditors !== undefined) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].updateParser();
                    var test = this._multiselectEditors[m].getPropertyValue(property, noDefaultValue);
                    if (test !== ret) {
                        return undefined;
                    }
                }
            }
            return ret;
        }
        updateCodeEditor() {
            this.codeEditor.evalCode();
        }
        /**
         * update the parser
         */
        updateParser() {
            var _a;
            if (this.codeEditor === undefined)
                return;
            if (this.parentPropertyEditor !== undefined) {
                this.parentPropertyEditor.updateParser();
            }
            else {
                var text = this.codeEditor.value;
                var val = this.codeEditor.getObjectFromVariable("this");
                if (text)
                    this.parser.parse(text, [{ classname: (_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name, methodname: "layout" }, { classname: undefined, methodname: "test" }]);
            }
        }
        /**
         * adds an required file to the code
         */
        addImportIfNeeded(name, file) {
            if (this.codeEditor === undefined)
                return;
            this.parser.addImportIfNeeded(name, file);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
        }
        /**
         * gets the next variablename
         * */
        getNextVariableNameForType(type) {
            return this.parser.getNextVariableNameForType(type);
        }
        /**
         * adds an Property
         * @param type - name of the type o create
         * @param scopename - the scope {variable: ,methodname:} to add the variable - if missing layout()
         * @returns  the name of the object
         */
        addVariableInCode(type, scopename) {
            var _a;
            var val = this.codeEditor.getObjectFromVariable("this");
            var ret = this.parser.addVariableInCode(type, [{ classname: (_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name, methodname: "layout" }, { classname: undefined, methodname: "test" }], scopename);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
            return ret;
        }
        /**
         * modify the property in code
         * @param {string} property - the property
         * @param {string} value - the new value
         * @param {boolean} [replace]  - if true the old value is deleted
         * @param {string} [variablename] - the name of the variable - default=this.variablename
         * @param {object} [before] - {variablename,property,value=undefined}
         * @param {object} scope - the scope {variable: ,methodname:} the scope - if missing layout()
        */
        setPropertyInCode(property, value, replace = undefined, variableName = undefined, before = undefined, scopename = undefined) {
            var _a;
            if (this.codeEditor === undefined) {
                this.codeChanges[property] = value;
                this.callEvent("codeChanged", {});
                return;
            }
            if (this.codeEditor === undefined || this.parentPropertyEditor !== undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            if (variableName === undefined && this._multiselectEditors !== undefined) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].updateParser();
                    this._multiselectEditors[m].setPropertyInCode(property, value, replace, variableName, before);
                }
                if (this._multiselectEditors.length > 0)
                    this.updateParser();
            }
            var prop;
            if (variableName === undefined) {
                variableName = this.variablename;
                prop = this._value[property];
            }
            else {
                prop = this.codeEditor.getObjectFromVariable(variableName)[property];
            }
            var isFunction = (typeof (prop) === "function");
            var val = this.codeEditor.getObjectFromVariable("this");
            this.parser.setPropertyInCode(variableName, property, value, [{ classname: (_a = val === null || val === void 0 ? void 0 : val.constructor) === null || _a === void 0 ? void 0 : _a.name, methodname: "layout" }, { classname: undefined, methodname: "test" }], isFunction, replace, before, scopename);
            //correct spaces
            if (value && value.indexOf("\n") > -1) {
                this.codeEditor.value = this.parser.getModifiedCode();
                this.updateParser();
            }
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
        * modify the property in design
        * @param {string} property - the property
        * @param {string} value - the new value
        */
        setPropertyInDesign(property, value) {
            if (this._multiselectEditors) {
                for (var m = 0; m < this._multiselectEditors.length; m++) {
                    this._multiselectEditors[m].setPropertyInDesign(property, value);
                }
            }
            if (property === "new" && this.variablename.startsWith("me.")) {
                this.codeEditor.evalCode();
                //  var test=this.codeEditor.getObjectFromVariable(this.variablename);
                //  this.value=this.codeEditor.getObjectFromVariable(this.variablename);
                return;
            }
            //var ob = this.codeEditor._variables.evalExpression(value);
            if (typeof (this._value[property]) === "function")
                this._value[property](value);
            else
                this._value[property] = value;
        }
        /**
         * goto source position
         * @param position - in Code
         */
        gotoCodePosition(position) {
            if (this.parentPropertyEditor !== undefined)
                return this.parentPropertyEditor.gotoCodePosition(position);
            this.codeEditor.viewmode = "code";
            this.codeEditor.setCursorPorition(position);
        }
        /**
         * goto source line
         * @param {number} line - line in Code
         */
        gotoCodeLine(line) {
            if (this.parentPropertyEditor !== undefined)
                return this.parentPropertyEditor.gotoCodeLine(line);
            this.codeEditor.viewmode = "code";
            this.codeEditor.cursorPosition = { row: line, column: 200 };
        }
        /**
         * renames a variable in code
         */
        renameVariableInCode(oldName, newName) {
            var code = this.codeEditor.value;
            if (this.codeEditor === undefined)
                return;
            var found = true;
            if (oldName.startsWith("me."))
                oldName = oldName.substring(3);
            if (newName.startsWith("me."))
                newName = newName.substring(3);
            if (oldName.startsWith("this."))
                oldName = oldName.substring(5);
            if (newName.startsWith("this."))
                newName = newName.substring(5);
            var reg = new RegExp("\\W" + oldName + "\\W");
            while (found == true) {
                found = false;
                code = code.replace(reg, function replacer(match, offset, string) {
                    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                    found = true;
                    return match.substring(0, 1) + newName + match.substring(match.length - 1, match.length);
                });
            }
            this.codeEditor.value = code;
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
         * renames a variable in design
         */
        renameVariableInDesign(oldName, newName) {
            this.codeEditor.renameVariable(oldName, newName);
        }
        /**
        * removes the variable from design
        * @param  varname - the variable to remove
        */
        removeVariableInDesign(varname) {
            //TODO this und var?
            if (varname.startsWith("me.")) {
                var vname = varname.substring(3);
                var me = this.codeEditor.getObjectFromVariable("me");
                delete me[vname];
            }
        }
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariableInCode(varname) {
            if (this.codeEditor === undefined) {
                this.callEvent("codeChanged", {});
                return;
            }
            this.parser.removeVariableInCode(varname);
            this.codeEditor.value = this.parser.getModifiedCode();
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
        * removes the property from code
        * @param {type} property - the property to remove
        * @param {type} [onlyValue] - remove the property only if the value is found
        * @param {string} [variablename] - the name of the variable - default=this.variablename
        */
        removePropertyInCode(property, onlyValue = undefined, variablename = undefined) {
            if (this.codeEditor === undefined) {
                delete this.codeChanges[property];
                this.callEvent("codeChanged", {});
                return;
            }
            if (this.codeEditor === undefined) {
                delete this._value[property];
                this.callEvent("codeChanged", {});
                return;
            }
            for (var m = 0; m < this._multiselectEditors.length; m++) {
                this._multiselectEditors[m].updateParser();
                this._multiselectEditors[m].removePropertyInCode(property, onlyValue, variablename);
            }
            if (variablename === undefined)
                variablename = this.variablename;
            this.updateParser();
            ; //notwendig?
            this.parser.removePropertyInCode(property, onlyValue, variablename);
            var text = this.parser.getModifiedCode();
            this.codeEditor.value = text;
            this.updateParser();
            this.callEvent("codeChanged", {});
        }
        /**
        * removes the property in design
        */
        removePropertyInDesign(property) {
            for (var m = 0; m < this._multiselectEditors.length; m++) {
                this._multiselectEditors[m].removePropertyInDesign(property);
            }
            if (typeof (this._value[property]) === "function")
                this._value[property](undefined);
            else {
                try {
                    this._value[property] = undefined;
                }
                catch (_a) {
                }
                delete this._value[property];
            }
        }
        layout(me = undefined) {
        }
        destroy() {
            this._value = undefined;
            this.clear();
            super.destroy();
        }
    };
    PropertyEditor = PropertyEditor_2 = __decorate([
        Jassi_60.$Class("jassi.ui.PropertyEditor"),
        __metadata("design:paramtypes", [Object])
    ], PropertyEditor);
    exports.PropertyEditor = PropertyEditor;
    let TestProperties = class TestProperties {
    };
    __decorate([
        Property_23.$Property({ decription: "name of the dialog", }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    TestProperties = __decorate([
        Jassi_60.$Class("jassi.ui.PropertyEditorTestProperties")
    ], TestProperties);
    exports.TestProperties = TestProperties;
    function test() {
        var ret = new PropertyEditor(undefined);
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/Repeater", ["require", "exports", "jassi/ui/Panel", "jassi/ui/Databinder", "jassi/ui/Component", "jassi/ui/Property", "jassi/remote/Jassi"], function (require, exports, Panel_15, Databinder_3, Component_18, Property_24, Jassi_61) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeater = void 0;
    class DesignPanel extends Panel_15.Panel {
    }
    let Repeater = class Repeater extends Panel_15.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super();
            this._autocommit = false;
            this.design = new DesignPanel();
            this.add(this.design);
            this.design.width = "100%";
            this.design.height = "100%";
            $(this.design.domWrapper).addClass("designerNoDraggable");
            $(this.design.dom).addClass("designerNoSelectable");
            $(this.design.dom).addClass("designerNoResizable");
        }
        createRepeatingComponent(func) {
            this._createRepeatingComponent = func;
            func.bind(this);
            if (this._value !== undefined)
                this.update();
        }
        _copyMeFromParent(me, parent, override = true) {
            if (parent === undefined)
                return;
            if (parent.me !== undefined) {
                for (var key in parent.me) {
                    if (override === true || me[key] === undefined) {
                        me[key] = parent.me[key];
                    }
                }
                return;
            }
            this._copyMeFromParent(me, parent._parent);
        }
        update() {
            if (this._createRepeatingComponent === undefined)
                return;
            if (this._designMode === true) {
                if (this.design._parent !== this) {
                    this.removeAll();
                    this.add(this.design);
                }
                if (this._isCreated !== true) {
                    this.design.databinder = new Databinder_3.Databinder();
                    this.me = {};
                    this._copyMeFromParent(this.me, this._parent);
                    this._createRepeatingComponent(this.me);
                    var comp = this._componentDesigner.designedComponent;
                    if (comp["me"] !== undefined) {
                        this._copyMeFromParent(comp["me"], this, false); //me from Dialog
                        this._componentDesigner._codeEditor.variables.addVariable("me", comp["me"]);
                        this._componentDesigner._codeEditor.variables.updateCache();
                    }
                    this._isCreated = true;
                }
                if (this.value === undefined || this.value === null || this.value.length < 0)
                    this.design.databinder.value = undefined;
                else
                    this.design.databinder.value = this.value[0];
                this.design.extensionCalled({
                    componentDesignerSetDesignMode: {
                        enable: this._designMode,
                        componentDesigner: undefined
                    }
                });
                //this.design._setDesignMode(this._designMode);
            }
            else {
                this.remove(this.design); //no destroy the design
                this.removeAll(true);
                if (this.value === undefined)
                    return;
                var sic = this.design;
                for (var x = 0; x < this.value.length; x++) {
                    this.design = new DesignPanel();
                    var ob = this.value[x];
                    this.design.databinder = new Databinder_3.Databinder();
                    this.design.databinder.value = ob;
                    this.design.me = {};
                    this._copyMeFromParent(this.design.me, this._parent);
                    this._createRepeatingComponent(this.design.me);
                    this.add(this.design);
                    this.add(this.design.databinder);
                }
                this.design = sic;
            }
        }
        /**
         * adds a component to the container
         * @param {jassi.ui.Component} component - the component to add
         */
        add(component) {
            super.add(component);
        }
        _dummy(func) {
            //dummy
        }
        /**
         *  @member {array} value - the array which objects used to create the repeating components
         */
        set value(val) {
            this._value = val;
            this.update();
        }
        get value() {
            return this._value;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
            }
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         */
        _setDesignMode(enable, designer = undefined) {
            this._componentDesigner = designer;
            if (this._designMode !== enable) {
                this._designMode = enable;
                this.update();
            }
            else
                this._designMode = enable;
            //	super.setDesignMode(enable);
        }
        /**
         * binds a component to a databinder
         * @param {jassi.ui.Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
         */
        bind(databinder, property) {
            this._databinder = databinder;
            databinder.add(property, this, "_dummy");
        }
        destroy() {
            this._value = undefined;
            this.design.destroy();
            super.destroy();
        }
    };
    __decorate([
        Property_24.$Property({ type: "databinder" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Repeater.prototype, "bind", null);
    Repeater = __decorate([
        Component_18.$UIComponent({ fullPath: "common/Repeater", icon: "mdi mdi-locker-multiple", editableChildComponents: ["this", "design"] }),
        Jassi_61.$Class("jassi.ui.Repeater"),
        __metadata("design:paramtypes", [Object])
    ], Repeater);
    exports.Repeater = Repeater;
});
define("jassi/ui/SearchExplorer", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Tree", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi_editor/util/Typescript", "jassi/base/Router"], function (require, exports, Jassi_62, Tree_3, Panel_16, Textbox_7, Typescript_4, Router_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SearchExplorer = void 0;
    let SearchExplorer = class SearchExplorer extends Panel_16.Panel {
        constructor() {
            super();
            //@member - maximal hits which are found 
            this.maximalFounds = 100;
            //this.maximize();
            $(this.dom).css("width", "calc(100% - 2px)");
            $(this.dom).css("height", "calc(100% - 2px)");
            this.tree = new Tree_3.Tree();
            this.search = new Textbox_7.Textbox();
            this.layout();
        }
        async doSearch() {
            var Typescript = (await new Promise((resolve_30, reject_30) => { require(["jassi_editor/util/Typescript"], resolve_30, reject_30); })).Typescript;
            var all = [];
            var files = []; // [{name:"Hallo",lines:[{ name:"Treffer1",pos:1},{name:"treffer2" ,pos:2}]}];
            var toFind = this.search.value.toLocaleLowerCase();
            var count = 0;
            var filenames = Typescript_4.default.getFiles();
            for (var f = 0; f < filenames.length; f++) {
                var file = filenames[f];
                var code = Typescript_4.default.getCode(file);
                if (code) {
                    var text = code.toLowerCase();
                    var pos = text.indexOf(toFind);
                    var foundedFile = { name: file, lines: [] };
                    while (pos !== -1) {
                        count++;
                        if (count > this.maximalFounds) {
                            break;
                        }
                        var startline = text.lastIndexOf("\n", pos);
                        var endline = text.indexOf("\n", pos);
                        var line = text.substring(startline, endline);
                        foundedFile.lines.push({ name: line, pos: pos, file: file });
                        pos = text.indexOf(toFind, pos + 1);
                    }
                    if (foundedFile.lines.length > 0)
                        files.push(foundedFile);
                    if (count > this.maximalFounds) {
                        break;
                    }
                }
            }
            this.tree.items = files;
            this.tree.expandAll();
        }
        async layout() {
            var _this = this;
            this.tree.width = "100%";
            this.tree.height = "100%";
            super.add(this.search);
            super.add(this.tree);
            this.tree.propDisplay = "name";
            this.tree.propChilds = "lines";
            this.tree.onclick(function (evt) {
                if (evt.data !== undefined && evt.data.file !== undefined) {
                    var pos = evt.data.pos;
                    var file = evt.data.file;
                    new Promise((resolve_31, reject_31) => { require(["jassi_editor/util/Typescript"], resolve_31, reject_31); }).then(Typescript => {
                        var text = Typescript_4.default.getCode(file);
                        var line = text.substring(0, pos).split("\n").length;
                        Router_6.router.navigate("#do=jassi_editor.CodeEditor&file=" + file + "&line=" + line);
                    });
                }
            });
            $("#" + this._id).css("flow", "visible");
            this.search.onkeydown(function (evt) {
                window.setTimeout(() => {
                    //	if(evt.code==="Enter"){
                    _this.doSearch();
                    //	}
                }, 100);
            });
            this.search.height = 15;
        }
    };
    SearchExplorer = __decorate([
        Jassi_62.$Class("jassi.ui.SearchExplorer"),
        __metadata("design:paramtypes", [])
    ], SearchExplorer);
    exports.SearchExplorer = SearchExplorer;
    function test() {
        return new SearchExplorer();
    }
    exports.test = test;
});
define("jassi/ui/Select", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/DataComponent", "jassi/ui/Property", "jassi/remote/Classes", "jassi/ext/jquery.choosen"], function (require, exports, Jassi_63, Component_19, DataComponent_3, Property_25, Classes_23) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Select = void 0;
    /*
    declare global {
        interface JQuery {
            chosen: any;
        }
    }
    */
    let SelectCreateProperties = class SelectCreateProperties extends Component_19.ComponentCreateProperties {
    };
    __decorate([
        Property_25.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], SelectCreateProperties.prototype, "multiple", void 0);
    __decorate([
        Property_25.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], SelectCreateProperties.prototype, "allowDeselect", void 0);
    __decorate([
        Property_25.$Property({ default: "" }),
        __metadata("design:type", String)
    ], SelectCreateProperties.prototype, "placeholder", void 0);
    SelectCreateProperties = __decorate([
        Jassi_63.$Class("jassi.ui.SelectCreateProperties")
    ], SelectCreateProperties);
    let Select = class Select extends DataComponent_3.DataComponent {
        constructor(properties = undefined) {
            super();
            super.init($('<select class="Select"><option value=""></option></select>')[0]);
            var _this = this;
            if (properties !== undefined && properties.multiple === true)
                $('#' + this._id).prop("multiple", true);
            var single = false;
            if (properties !== undefined && properties.allowDeselect !== undefined)
                single = properties.allowDeselect;
            var placeholder = "Select...";
            if (properties !== undefined && properties.placeholder !== undefined)
                placeholder = properties.placeholder;
            $('#' + this._id).chosen({
                // width: "100px",
                placeholder_text_single: placeholder,
                allow_single_deselect: single
            });
            this.domSelect = this.dom;
            if (this.domWrapper.children.length == 1) { //mobile device
                this.dom = this.domSelect;
            }
            else
                this.dom = this.domWrapper.children[1];
            $(this.domSelect).attr("id", "");
            $(this.dom).attr("id", this._id);
            $(this.domSelect).chosen().change(function (e) {
                if (_this._select !== undefined)
                    _this._select.value = _this.value;
                //e.data = _this.value;
                //handler(e);
            });
            // this.layout();
        }
        refresh() {
            $(this.domSelect).trigger("chosen:updated");
            //	 $('#'+this._id).data("placeholder","Select...").chosen({
            //	 	width: "100px"
            //	 });
        }
        /**
         * called if value has changed
         * @param {function} handler - the function which is executed
         */
        onchange(handler) {
            var _this = this;
            $(this.domSelect).chosen().change(function (e) {
                e.data = _this.value;
                handler(e);
            });
        }
        /**
         * if the value is changed then the value of _component is also changed (_component.value)
         */
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        /**
         * @member {string|function}  - property or function to get the displaystring for the object
         **/
        set display(value) {
            this._display = value;
            if (this.items !== undefined)
                this.items = this.items;
        }
        get display() {
            return this._display;
        }
        set items(value) {
            this._items = value;
            this.options = { undefined: undefined };
            if (this.domSelect === undefined)
                return;
            console.log("dekt.memoryleak");
            /* slow
            while (this.domSelect.firstChild) {
                $(this.domSelect.firstChild).remove();
    
            }
            this.domSelect.appendChild($('<option value=""></option>')[0]);
            for (var x = 0;x < value.length;x++) {
                var ob = value[x];
                var val = undefined;
                if (typeof (this.display) === "function")
                    val = this.display(ob);
                else if (this.display !== undefined)
                    val = ob[this.display];
                else
                    val = ob;
                this.options[x.toString()] = ob;
                var it = $('<option value="' + x + '">' + val + '</option>')[0];
                this.domSelect.appendChild(it);
            }
            this.refresh();
    */
            var html = '<option value=""></option>';
            for (var x = 0; x < value.length; x++) {
                var ob = value[x];
                var val = undefined;
                if (typeof (this.display) === "function")
                    val = this.display(ob);
                else if (this.display !== undefined)
                    val = ob[this.display];
                else
                    val = ob;
                this.options[x.toString()] = ob;
                html += '<option value="' + x + '">' + val + '</option>';
                //this.domSelect.appendChild(it);
            }
            this.domSelect.innerHTML = html;
            this.refresh();
            /*   for(var x=0;x<value.length;x++){
                   delete value[x].recid;
               }*/
        }
        get items() {
            //  if(w2ui[this._id]===undefined)
            return this._items;
            //   return w2ui[this._id].records;//$(this.dom).text();
        }
        /**
         * @member {object} sel - the selected object
         */
        set value(sel) {
            var found = false;
            if ($(this.domSelect).chosen().prop("multiple")) {
                var keys = [];
                if (sel) {
                    sel.forEach((se) => {
                        for (var key in this.options) {
                            if (this.options[key] === se) {
                                keys.push(key);
                                found = true;
                                break;
                            }
                        }
                        $(this.domSelect).val(keys).trigger("chosen:updated");
                    });
                }
            }
            else {
                for (var key in this.options) {
                    if (this.options[key] === sel) {
                        $(this.domSelect).val(key).trigger("chosen:updated");
                        found = true;
                        break;
                    }
                }
            }
            if (!found)
                $(this.domSelect).val("").trigger("chosen:updated");
            // refresh()
        }
        get value() {
            if (this.options === undefined)
                return undefined;
            var val = $(this.domSelect).chosen().val();
            if ($(this.domSelect).chosen().prop("multiple")) {
                var opts = [];
                val.forEach((e) => {
                    if (e !== "") //placeholder for empty
                        opts.push(this.options[e]);
                });
                return opts;
            }
            return this.options[val];
        }
        /**
         * @member {string|number} - the width of the component
         * e.g. 50 or "100%"
         */
        /* set width(value){ //the Code
             super.width=value;
         
              
              if(this.domWrapper.children.length>1){
                 var val=$(this.domWrapper).css("width");
                 $(this.domWrapper.children[1]).css("width",val);
              }
         }*/
        /**
         * binds a component to a databinder
         * @param {Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
        
        bind(databinder,property){
            this._databinder=databinder;
            databinder.add(property,this,"onselect");
            databinder.checkAutocommit(this);
        } */
        destroy() {
            //	$(this.domSelect).chosen('destroy');
            $(this.domSelect).chosen("destroy"); //.search_choices;
            $('#' + this._id).remove(); //.search_choices;
            $(this.domSelect).remove();
            $(this.dom).remove();
            this.domSelect = undefined;
            super.destroy();
        }
    };
    __decorate([
        Property_25.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Select.prototype, "onchange", null);
    __decorate([
        Property_25.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Select.prototype, "display", null);
    Select = __decorate([
        Component_19.$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" }),
        Jassi_63.$Class("jassi.ui.Select"),
        Property_25.$Property({ name: "new", type: "json", componentType: "jassi.ui.SelectCreateProperties" }),
        __metadata("design:paramtypes", [SelectCreateProperties])
    ], Select);
    exports.Select = Select;
    async function test() {
        var Panel = Classes_23.classes.getClass("jassi.ui.Panel");
        var Button = Classes_23.classes.getClass("jassi.ui.Button");
        var me = {};
        var pan = new Panel();
        var bt = new Button();
        var bt2 = new Button();
        me.sel = new Select({
            "multiple": false,
            "placeholder": "Hallo",
            "allowDeselect": false
        });
        bt.text = "wer";
        bt.onclick(function (event) {
            //	bt.text=me.sel.value.vorname;	
            me.sel.value = me.sel.items[1];
        });
        bt.height = 15;
        pan.width = 500;
        me.sel.display = "nachname";
        me.sel.items = [{ name: "Achim", nachname: "<b>Wenzel</b>" },
            { name: "Anne", nachname: "Meier" }];
        var h = me.sel.items;
        me.sel.width = 195;
        me.sel.height = 25;
        me.sel.onchange(function (event) {
            alert(event.data.nachname);
        });
        //	$('#'+sel._id).data("placeholder","Select2...").chosen({width: "200px"});
        pan.add(me.sel);
        pan.add(bt);
        pan.add(bt2);
        return pan;
    }
    exports.test = test;
});
define("jassi/ui/Style", ["require", "exports", "jassi/ui/InvisibleComponent", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/ui/CSSProperties"], function (require, exports, InvisibleComponent_3, Component_20, Jassi_64, Property_26, CSSProperties_2) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.Style = void 0;
    let Style = 
    /**
     * on ore mors Style can be assigned to component
     * the style is appended to the head
     **/
    class Style extends InvisibleComponent_3.InvisibleComponent {
        constructor() {
            super();
            super.init($('<span class="InvisibleComponent"></span>')[0]);
        }
        get styleid() {
            return "jassistyle" + this._id;
        }
        /**
        * sets CSS Properties
        */
        css(properties, removeOldProperties = true) {
            //never!super.css(properties,removeOldProperties);
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = $('<style id=' + this.styleid + '></style>')[0];
                document.head.appendChild(style);
            }
            var prop = {};
            var sstyle = "\t." + this.styleid + "{\n";
            for (let key in properties) {
                var newKey = key.replaceAll("_", "-");
                prop[newKey] = properties[key];
                sstyle = sstyle + "\t\t" + newKey + ":" + properties[key] + ";\n";
            }
            sstyle = sstyle + "\t}\n";
            style.innerHTML = sstyle;
        }
        destroy() {
            super.destroy();
            if (document.getElementById(this.styleid)) {
                document.head.removeChild(document.getElementById(this.styleid));
            }
        }
    };
    __decorate([
        Property_26.$Property({ type: "json", componentType: "jassi.ui.CSSProperties" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [typeof (_a = typeof CSSProperties_2.CSSProperties !== "undefined" && CSSProperties_2.CSSProperties) === "function" ? _a : Object, Boolean]),
        __metadata("design:returntype", void 0)
    ], Style.prototype, "css", null);
    Style = __decorate([
        Component_20.$UIComponent({ fullPath: "common/Style", icon: "mdi mdi-virus" }),
        Jassi_64.$Class("jassi.ui.Style")
        /**
         * on ore mors Style can be assigned to component
         * the style is appended to the head
         **/
        ,
        __metadata("design:paramtypes", [])
    ], Style);
    exports.Style = Style;
    function test() {
        var css = {
            filter: "drop-shadow(16px 16px 20px blue)"
        };
        Jassi_64.default.includeCSS("mytest2id", {
            ".Panel": css,
            ".jinlinecomponent": {
                color: "red"
            }
        });
        setTimeout(() => {
            Jassi_64.default.includeCSS("mytest2id", undefined); //remove
        }, 400);
        // includeCSS("mytest2id",undefined);
    }
    exports.test = test;
    function test2() {
        var st = new Style();
        st.css({
            color: "red"
        });
        st.destroy();
    }
    exports.test2 = test2;
});
define("jassi/ui/Table", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/DataComponent", "jassi/ui/Property", "jassi/ui/Component", "jassi/ui/Textbox", "jassi/ui/Calendar", "jassi/ext/tabulator"], function (require, exports, Jassi_65, DataComponent_4, Property_27, Component_21, Textbox_8, Calendar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Table = void 0;
    let TableEditorProperties = class TableEditorProperties {
        cellDblClick() { }
    };
    __decorate([
        Property_27.$Property({ default: undefined }),
        __metadata("design:type", Number)
    ], TableEditorProperties.prototype, "paginationSize", void 0);
    __decorate([
        Property_27.$Property({ default: true }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "headerSort", void 0);
    __decorate([
        Property_27.$Property({ default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] }),
        __metadata("design:type", String)
    ], TableEditorProperties.prototype, "layout", void 0);
    __decorate([
        Property_27.$Property({ default: undefined }),
        __metadata("design:type", Function)
    ], TableEditorProperties.prototype, "dataTreeChildFunction", void 0);
    __decorate([
        Property_27.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], TableEditorProperties.prototype, "movableColumns", void 0);
    __decorate([
        Property_27.$Property({ default: "function(event:any,group:any){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TableEditorProperties.prototype, "cellDblClick", null);
    TableEditorProperties = __decorate([
        Jassi_65.$Class("jassi.ui.TableEditorProperties")
    ], TableEditorProperties);
    let Table = 
    /*
    @$Property({ name: "new/paginationSize", type: "number", default: undefined })
    @$Property({ name: "new/headerSort", type: "boolean", default: true })
    @$Property({ name: "new/layout", type: "string", default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] })
    @$Property({ name: "new/dataTreeChildField", type: "string", default: undefined })
    @$Property({ name: "new/movableColumns", type: "boolean", default: false })
    @$Property({ name: "new/cellDblClick", type: "function", default: "function(event:any,group:any){\n\t\n}" })
    */
    class Table extends DataComponent_4.DataComponent {
        constructor(properties) {
            super();
            super.init($('<div class="Table"></div>')[0]);
            var _this = this;
            if (properties === undefined)
                properties = {};
            if (properties.autoColumns === undefined)
                properties.autoColumns = true;
            if (properties.autoColumnsDefinitions === undefined) {
                properties.autoColumnsDefinitions = this.defaultAutoColumnDefinitions.bind(this);
            }
            if (properties.dataTreeChildFunction !== undefined) {
                //@ts-ignore
                properties.dataTreeChildField = "__treechilds";
                this.dataTreeChildFunction = properties.dataTreeChildFunction;
                delete properties.dataTreeChildFunction;
            }
            if (properties.dataTreeChildField !== undefined)
                properties.dataTree = true;
            if (properties.paginationSize !== undefined && properties.pagination == undefined)
                properties.pagination = "local";
            // if(properties.layoutColumnsOnNewData===undefined)
            //     properties.layoutColumnsOnNewData=true;
            if (properties.selectable === undefined)
                properties.selectable = 1;
            // if (properties.autoResize === undefined)//error ResizeObserver loop limit exceeded 
            //    properties.autoResize = false;
            if (properties.layout === undefined)
                properties.layout = "fitDataStretch"; //"fitDataFill";////"fitColumns";
            var dataTreeRowExpanded = properties.dataTreeRowExpanded;
            properties.dataTreeRowExpanded = function (row, level) {
                _this.onTreeExpanded(row, level);
                if (dataTreeRowExpanded !== undefined) {
                    dataTreeRowExpanded(row, level);
                }
            };
            var rowClick = properties.rowClick;
            properties.rowClick = function (e, row) {
                _this._onselect(e, row);
                if (rowClick !== undefined) {
                    rowClick(e, row);
                }
            };
            var contextClick = properties.cellContext;
            properties.cellContext = function (e, row) {
                _this._oncontext(e, row);
                if (contextClick !== undefined) {
                    contextClick(e, row);
                }
                return undefined;
            };
            this.table = new Tabulator("[id='" + this._id + "']", properties);
            this.layout();
        }
        ;
        defaultAutoColumnDefinitions(definitions) {
            var _this = this;
            var ret = [];
            for (let x = 0; x < definitions.length; x++) {
                var data;
                if (definitions[x].sorter === "array")
                    continue;
                if (_this.items && _this.items.length > 0) {
                    data = _this.items[0][definitions[x].field];
                    if (typeof data === "function")
                        continue;
                    if (data instanceof Date) {
                        definitions[x].formatter = function (cell, formatterParams, onRendered) {
                            return Calendar_1.Calendar.formatDate(cell.getValue()); //return the contents of the cell;
                        };
                    }
                }
                ret.push(definitions[x]);
            }
            return ret;
        }
        getChildsFromTreeFunction(data) {
            var childs;
            if (typeof this.dataTreeChildFunction === "function") {
                childs = this.dataTreeChildFunction(data);
            }
            else {
                childs = data[this.dataTreeChildFunction];
                if (typeof childs === "function")
                    childs = childs.bind(data)();
            }
            return childs;
        }
        populateTreeData(data) {
            var childs = this.getChildsFromTreeFunction(data);
            if (childs && childs.length > 0) {
                Object.defineProperty(data, "__treechilds", {
                    configurable: true,
                    get: function () {
                        return childs;
                    }
                });
                for (var x = 0; x < childs.length; x++) {
                    var nchilds = this.getChildsFromTreeFunction(childs[x]);
                    if (nchilds && nchilds.length > 0) {
                        Object.defineProperty(childs[x], "__treechilds", {
                            configurable: true,
                            get: function () {
                                return ["dummy"];
                            }
                        });
                    }
                }
            }
        }
        onTreeExpanded(row, level) {
            if (this.dataTreeChildFunction) {
                var data = row.getData();
                let childs = data.__treechilds; //this.getChildsFromTreeFunction(data)   //row.getData()["childs"];
                for (let f = 0; f < childs.length; f++) {
                    this.populateTreeData(childs[f]);
                }
                row.update(data);
            }
        }
        layout() {
            this._selectHandler = [];
        }
        async update() {
            await this.table.updateData(this.items);
        }
        _oncontext(event, row) {
            if (this.contextMenu !== undefined) {
                this.contextMenu.value = [row.getData()];
                event.data = [row.getData()];
                this.contextMenu.show(event);
            }
        }
        _onselect(event, row) {
            var selection = [];
            var aids = undefined;
            if (this.selectComponent === undefined && this._eventHandler["select"] === undefined)
                return;
            event.data = row.getData();
            if (this._select !== undefined)
                this._select.value = event.data;
            this.callEvent("select", event);
        }
        /**
         * register an event if an item is selected
         * @param {function} handler - the function that is called on change
         */
        onchange(handler) {
            this.addEvent("select", handler);
        }
        get showSearchbox() {
            return this._searchbox !== undefined;
        }
        set showSearchbox(enable) {
            let _this = this;
            if (!enable) {
                if (this._searchbox !== undefined) {
                    this._searchbox.destroy();
                    delete this._searchbox;
                }
            }
            else {
                this._searchbox = new Textbox_8.Textbox();
                this._searchbox.placeholder = "search table...";
                this._searchbox.onkeydown(() => {
                    window.setTimeout(() => {
                        var text = _this._searchbox.value;
                        _this.table.setFilter(data => {
                            for (var key in data) {
                                if (data[key] !== undefined && data[key] !== null && data[key].toString().toLowerCase().indexOf(text) >= 0) {
                                    return true;
                                }
                            }
                            return false;
                        });
                    }, 100);
                });
                $(this.domWrapper).prepend(this._searchbox.domWrapper);
            }
        }
        /**
          * if the value is changed then the value of _component is also changed (_component.value)
          */
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        /**
         * set the items of the table
         */
        set items(value) {
            if (value && this.dataTreeChildFunction) { //populate __treechilds
                for (let x = 0; x < value.length; x++) {
                    this.populateTreeData(value[x]);
                }
            }
            this._items = value;
            if (value !== undefined)
                this.table.setData(value);
        }
        get items() {
            return this._items;
        }
        /**
         * @member {object} sel - the selected object
         */
        set value(sel) {
            if (this.items === undefined)
                return;
            var pos = this.items.indexOf(sel);
            //@ts-ignore
            this.table.deselectRow(this.table.getSelectedRows());
            if (pos === -1)
                return;
            //@ts-ignore
            this.table.selectRow(this.table.getRows()[pos]);
            this.table.scrollToRow(this.table.getRows()[pos]);
        }
        get value() {
            var ret = this.table.getSelectedRows();
            if (ret.length === 0) {
                return undefined;
            }
            return ret[0].getData();
            /*var aids = w2ui[this._id].getSelection();
            if (aids.length === 0)
                return undefined;
            var obs = w2ui[this._id].records;
            var selection = [];
            for (var x = 0; x < obs.length; x++) {
                for (var y = 0; y < aids.length; y++) {
                    if (obs[x].id === aids[y]) {
                        var test = obs[x]._originalObject;
                        if (test !== undefined)//extract proxy
                            selection.push(obs[x]._originalObject);
                        else
                            selection.push(obs[x]);
                    }
                }
            }
            return selection.length === 1 ? selection[0] : selection;*/
        }
        /**
        * @member {string|number} - the height of the component
        * e.g. 50 or "100%"
        */
        set height(value) {
            //@ts-ignore
            this.table.setHeight(value);
            //super.height=value;
        }
        get height() {
            return super.height;
        }
        /**
         * Searches records in the grid
         * @param {string} field - name of the search field
         * @param {string} value - value of the search field
         * @param {boolean} [doSelect] - if true the first entry is selected
         */
        search(field, value, doSelect) {
        }
        destroy() {
            // this.tree = undefined;
            if (this._searchbox !== undefined)
                this._searchbox.destroy();
            super.destroy();
        }
        set columns(value) {
            this.table.setColumns(value);
            this.update();
        }
        get columns() {
            return this.table.getColumnDefinitions();
        }
    };
    __decorate([
        Property_27.$Property({ default: "function(event?: JQueryEventObject, data?:Tabulator.RowComponent){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Table.prototype, "onchange", null);
    __decorate([
        Property_27.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Table.prototype, "showSearchbox", null);
    __decorate([
        Property_27.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Table.prototype, "height", null);
    Table = __decorate([
        Component_21.$UIComponent({ fullPath: "common/Table", icon: "mdi mdi-grid" }),
        Jassi_65.$Class("jassi.ui.Table"),
        Property_27.$Property({ name: "new", type: "json", componentType: "jassi.ui.TableEditorProperties" })
        /*
        @$Property({ name: "new/paginationSize", type: "number", default: undefined })
        @$Property({ name: "new/headerSort", type: "boolean", default: true })
        @$Property({ name: "new/layout", type: "string", default: "fitDataStretch", chooseFrom: ['fitData', 'fitColumns', 'fitDataFill', 'fitDataStretch'] })
        @$Property({ name: "new/dataTreeChildField", type: "string", default: undefined })
        @$Property({ name: "new/movableColumns", type: "boolean", default: false })
        @$Property({ name: "new/cellDblClick", type: "function", default: "function(event:any,group:any){\n\t\n}" })
        */
        ,
        __metadata("design:paramtypes", [Object])
    ], Table);
    exports.Table = Table;
    async function test() {
        var tab = new Table({});
        tab.width = 400;
        var tabledata = [
            { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
            { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
            { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
            { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
            { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
        ];
        window.setTimeout(() => {
            tab.items = tabledata;
        }, 100);
        //tab.select = {};
        // tab.showSearchbox = true;
        //    var kunden = await jassi.db.load("de.Kunde");
        //   tab.items = kunden;
        return tab;
    }
    exports.test = test;
});
define("jassi/ui/Textarea", ["require", "exports", "jassi/ui/Component", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/ui/Textbox"], function (require, exports, Component_22, Jassi_66, Property_28, Textbox_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Textarea = void 0;
    let Textarea = class Textarea extends Textbox_9.Textbox {
        constructor() {
            super();
            super.init($('<textarea  />')[0]);
        }
    };
    Textarea = __decorate([
        Component_22.$UIComponent({ fullPath: "common/Textarea", icon: "mdi mdi-text-box-outline" }),
        Jassi_66.$Class("jassi.ui.Textarea"),
        Property_28.$Property({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [])
    ], Textarea);
    exports.Textarea = Textarea;
});
define("jassi/ui/Textbox", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/DataComponent", "jassi/ui/converters/DefaultConverter", "jassi/remote/Registry", "jassi/ui/Property"], function (require, exports, Jassi_67, Component_23, DataComponent_5, DefaultConverter_1, Registry_19, Property_29) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Textbox = void 0;
    let Textbox = class Textbox extends DataComponent_5.DataComponent {
        constructor(color = undefined) {
            super();
            super.init($('<input type="text" />')[0]);
            $(this.dom).css("color", color);
            this.converter = undefined;
        }
        /**
         * @member {boolean} disabled - enable or disable the element
         */
        set disabled(value) {
            $(this.dom).prop('disabled', true);
        }
        get disabled() {
            return $(this.dom).prop('disabled');
        }
        /**
         * @member {string} value - value of the component
         */
        set value(value) {
            $(this.dom).val(value);
        }
        get value() {
            var ret = $(this.dom).val();
            if (this.converter !== undefined) {
                ret = this.converter.stringToObject(ret);
            }
            return ret;
        }
        /**
       * called if value has changed
       * @param {function} handler - the function which is executed
       */
        onclick(handler) {
            $("#" + this._id).click(function (e) {
                handler(e);
            });
        }
        /**
         * called if value has changed
         * @param {function} handler - the function which is executed
         */
        onchange(handler) {
            $("#" + this._id).change(function (e) {
                handler(e);
            });
        }
        /**
         * called if a key is pressed down
         * @param {function} handler - the function which is executed
         */
        onkeydown(handler) {
            $(this.dom).keydown(function (e) {
                handler(e);
            });
        }
        /**
         * called if user has something typed
         * @param {function} handler - the function which is executed
         */
        oninput(handler) {
            $("#" + this._id).on("input", function () {
                handler();
            });
        }
        /*
         * <input list="browsers" name="myBrowser" />
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
</datalist>+>
         */
        set placeholder(text) {
            $(this.dom).attr("placeholder", text);
        }
        get placeholder() {
            return $(this.dom).attr("placeholder");
        }
        /**
        *  @member {string|function} completerDisplay - property or function used to gets the value to display
        */
        set autocompleterDisplay(value) {
            this._autocompleterDisplay = value;
            if (this.autocompleter !== undefined) {
                this.autocompleter = this.autocompleter; //force rendering
            }
        }
        get autocompleterDisplay() {
            return this._autocompleterDisplay;
        }
        fillCompletionList(values) {
            var h;
            console.log("fill");
            var list = $(this.dom).attr("list");
            var html = "";
            var comp = $("#" + list);
            comp[0]._values = values;
            //comp.empty();
            for (var x = 0; x < values.length; x++) {
                var val = values[x];
                if (typeof (this.autocompleterDisplay) === "function") {
                    val = this.autocompleterDisplay(val);
                }
                else if (this.autocompleterDisplay !== undefined) {
                    val = val[this.autocompleterDisplay];
                }
                html += '<option value="' + val + '">';
                //comp.append('<option value="'+val+'">');
            }
            comp[0].innerHTML = html;
        }
        /**
         *  @member {[object]} completer - values used for autocompleting
         */
        set autocompleter(value) {
            var list = $(this.dom).attr("list");
            var _this = this;
            if (!list && typeof (value) === "function") {
                $(this.dom).on("mouseover", (ob) => {
                    if (_this._autocompleter.children.length === 0) {
                        var values = value();
                        _this.fillCompletionList(values);
                    }
                });
            }
            if (list === undefined) {
                list = Registry_19.default.nextID();
                this._autocompleter = $('<datalist id="' + list + '"/>')[0];
                this.domWrapper.appendChild(this._autocompleter);
                $(this.dom).attr("list", list);
            }
            if (typeof (value) === "function") {
            }
            else {
                this.fillCompletionList(value);
            }
            // $(this.dom).val(value);
        }
        get autocompleter() {
            var list = $(this.dom).prop("list");
            if (list === undefined)
                return undefined;
            var comp = $(list)[0];
            if (comp === undefined)
                return undefined;
            return comp._values;
            // return $(this.dom).val();
        }
        /**
         * focus the textbox
         */
        focus() {
            $(this.dom).focus();
        }
        destroy() {
            if (this._autocompleter)
                $(this._autocompleter).remove();
            super.destroy();
        }
    };
    __decorate([
        Property_29.$Property({ type: "classselector", service: "$Converter" }),
        __metadata("design:type", typeof (_a = typeof DefaultConverter_1.DefaultConverter !== "undefined" && DefaultConverter_1.DefaultConverter) === "function" ? _a : Object)
    ], Textbox.prototype, "converter", void 0);
    __decorate([
        Property_29.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Textbox.prototype, "value", null);
    __decorate([
        Property_29.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onclick", null);
    __decorate([
        Property_29.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onchange", null);
    __decorate([
        Property_29.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "onkeydown", null);
    __decorate([
        Property_29.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Textbox.prototype, "oninput", null);
    __decorate([
        Property_29.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Textbox.prototype, "placeholder", null);
    Textbox = __decorate([
        Component_23.$UIComponent({ fullPath: "common/Textbox", icon: "mdi mdi-form-textbox" }),
        Jassi_67.$Class("jassi.ui.Textbox"),
        Property_29.$Property({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Textbox);
    exports.Textbox = Textbox;
    function test() {
        var ret = new Textbox();
        //ret.autocompleter=()=>[];
        return ret;
    }
    exports.test = test;
});
// return CodeEditor.constructor;
define("jassi/ui/Tree", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/remote/Registry", "jassi/ui/Property", "jassi/ext/fancytree"], function (require, exports, Jassi_68, Component_24, Registry_20, Property_30) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tree = void 0;
    /*declare global {
        interface JQuery {
            fancytree: any;
        }
    }*/
    let TreeEditorPropertiesMulti = class TreeEditorPropertiesMulti {
    };
    __decorate([
        Property_30.$Property({ default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" }),
        __metadata("design:type", String)
    ], TreeEditorPropertiesMulti.prototype, "mode", void 0);
    TreeEditorPropertiesMulti = __decorate([
        Jassi_68.$Class("jassi.ui.TreeEditorPropertiesMulti")
    ], TreeEditorPropertiesMulti);
    let TreeEditorProperties = class TreeEditorProperties {
    };
    __decorate([
        Property_30.$Property({ default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        __metadata("design:type", Number)
    ], TreeEditorProperties.prototype, "selectMode", void 0);
    __decorate([
        Property_30.$Property({ default: false, description: "display a checkbox before the node" }),
        __metadata("design:type", Boolean)
    ], TreeEditorProperties.prototype, "checkbox", void 0);
    __decorate([
        Property_30.$Property({ type: "json", componentType: "jassi.ui.TreeEditorPropertiesMulti" }),
        __metadata("design:type", TreeEditorPropertiesMulti)
    ], TreeEditorProperties.prototype, "multi", void 0);
    TreeEditorProperties = __decorate([
        Jassi_68.$Class("jassi.ui.TreeEditorProperties")
    ], TreeEditorProperties);
    let Tree = 
    /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
    @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
    @$Property({ name: "new/multi", type: "json" })
    @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
    */
    class Tree extends Component_24.Component {
        constructor(options) {
            super();
            super.init($('<div class="Tree"></div>')[0]);
            this._itemToKey = new Map();
            var _this = this;
            if (options === undefined) {
                options = {};
            }
            //Default Options
            if (options.extensions === undefined) {
                options.extensions = ["filter", "multi", "dnd"];
            }
            if (options.extensions.indexOf("filter") === -1)
                options.extensions.push("filter");
            if (options.extensions.indexOf("multi") === -1)
                options.extensions.push("multi");
            if (options.extensions.indexOf("dnd") === -1)
                options.extensions.push("dnd");
            if (options.filter === undefined)
                options.filter = {};
            if (options.filter.mode === undefined)
                options.filter.mode = "hide";
            if (options.filter.autoExpand === undefined)
                options.filter.autoExpand = true;
            /* if (options.multi === undefined) {
                 options.multi = {};
             }
             if (options.multi.mode === undefined) {
                 options.multi.mode = "sameParent";//"","sameLevel"
             }*/
            var beforeExpand = options.beforeExpand;
            var activate = options.activate;
            var click = options.click;
            /* options.renderTitle=function (event:JQueryEventObject,data:Fancytree.EventData){
                 var h=0;
             });*/
            options.source = [{ title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
            options.icon = false; //we have an own
            options.lazyLoad = function (event, data) {
                TreeNode.loadChilds(event, data);
            };
            /* options.beforeExpand = function(event: JQueryEventObject, data: Fancytree.EventData) {
                  if(data.node.children.length===1&&data.node.children[0].data.dummy===true){
                      var node2 = _this.objectToNode.get(data.node.data.item);
                          node2.populate(data.node);
                  }
                  if (beforeExpand !== undefined)
                      return beforeExpand(event, data);
                  return true;
              };*/
            options.activate = function (event, data) {
                _this._onselect(event, data);
                if (activate !== undefined)
                    activate(event, data);
            };
            options.click = function (event, data) {
                _this._onclick(event, data);
                if (click !== undefined)
                    return click(event, data);
                return true;
            };
            $("#" + this._id).fancytree(options);
            //@ts-ignore
            this.tree = $.ui.fancytree.getTree("#" + this._id);
            $("#" + this._id).find("ul").css("height", "calc(100% - 8px)");
            $("#" + this._id).find("ul").css("weight", "calc(100% - 8px)");
            $("#" + this._id).find("ul").css("overflow", "auto");
        }
        /**
        * @member - get the property for the display of the item or an function to get the display from an item
        */
        set propStyle(value) {
            this._propStyle = value;
        }
        get propStyle() {
            return this._propStyle;
        }
        /**
         * @member - get the property for the display of the item or an function to get the display from an item
         */
        set propDisplay(value) {
            this._propDisplay = value;
        }
        get propDisplay() {
            return this._propDisplay;
        }
        /**
         * @member - get the iconproperty of the item or an function to get the icon from an item
         */
        set propIcon(icon) {
            this._propIcon = icon;
        }
        get propIcon() {
            return this._propIcon;
        }
        /**
        * @member - get the childs of the item or an function to get the childs from an item
        */
        set propChilds(child) {
            this._propChilds = child;
        }
        get propChilds() {
            return this._propChilds;
        }
        onselect(handler) {
            this.addEvent("select", handler);
        }
        /**
         * register an event if an item is clicked
         * @param {function} handler - the function that is called on click
         */
        onclick(handler) {
            this.addEvent("click", handler);
        }
        filter(text) {
            // this.expandAll();
            this._readAllNodesIfNeeded().then(() => {
                if (text === "") {
                    this.tree.clearFilter();
                    // this.expandAll();
                }
                else {
                    //@ts-ignore
                    this.tree.filterNodes(text, { leavesOnly: true });
                }
            });
        }
        /**
        * get title from node
        */
        getTitleFromItem(item) {
            var ret = "";
            if (typeof (this.propDisplay) === "function") {
                ret = this.propDisplay(item);
            }
            else
                ret = item[this.propDisplay];
            return ret;
        }
        /**
       * get title from node
       */
        getStyleFromItem(item) {
            var ret;
            if (typeof (this.propStyle) === "function") {
                ret = this.propStyle(item);
            }
            else
                ret = item[this.propStyle];
            return ret;
        }
        /**
        * get icon from node
        */
        getIconFromItem(item) {
            if (this.propIcon !== undefined) {
                if (typeof (this.propIcon) === "function") {
                    return this.propIcon(item);
                }
                else
                    return item[this.propIcon];
            }
            return undefined;
        }
        /**
        * get childs from node
        */
        getChildsFromItem(item) {
            var cs = undefined;
            if (typeof (this.propChilds) === "function") {
                cs = this.propChilds(item);
            }
            else
                cs = item[this.propChilds];
            return cs;
        }
        /*private getTreeNodeFromId(id:string):TreeNode{
            //@ts-ignore
            for(var entr of this.objectToNode){
                if(entr[1]._id===id)
                    return entr[1];
                //entries.return;
            }
            return undefined;
        }*/
        _onselect(event, data) {
            var item = this._itemToKey.get(data.node.data);
            event.data = item;
            this.callEvent("select", event, data);
        }
        _onclick(event, data) {
            if (event.originalEvent.target["className"].startsWith("MenuButton")) {
                this._callContextmenu(event.originalEvent);
                return;
            }
            if (event.ctrlKey === true)
                return; //only selection
            event.data = data.node.data.item;
            if (this._select !== undefined)
                this._select.value = data.node.data.item;
            this.callEvent("click", event, data);
        }
        /**
         * selects items
         */
        set selection(values) {
            this.tree.getSelectedNodes().forEach((item) => {
                item.setSelected(false);
            });
            if (values === undefined)
                return;
            this["_selectionIsWaiting"] = values;
            var _this = this;
            for (var v = 0; v < values.length; v++) {
                var item = values[v];
                this._readNodeFromItem(item).then((node) => {
                    node.setSelected(true);
                    delete this["_selectionIsWaiting"];
                });
            }
        }
        get selection() {
            var ret = [];
            if (this["_selectionIsWaiting"] !== undefined)
                return this["_selectionIsWaiting"];
            this.tree.getSelectedNodes().forEach((item) => {
                ret.push(item.data.item);
            });
            return ret;
        }
        async activateKey(key, parent = undefined) {
            var node = await this._readNodeFromKey(key);
            if (node === null)
                return false;
            await node.setActive(true);
            return true;
        }
        async expandLater(promise, expand, node, allreadySeen) {
            return this.expandAll(expand, node, allreadySeen);
        }
        /**
         * expand all nodes
         */
        async expandAll(expand = true, parent = undefined, allreadySeen = undefined) {
            var isRoot = parent === undefined;
            var all = [];
            if (parent === undefined)
                parent = this.tree.rootNode;
            if (expand === undefined)
                expand = true;
            if (allreadySeen === undefined) {
                allreadySeen = [];
            }
            if (parent.hasChildren()) {
                for (var x = 0; x < parent.children.length; x++) {
                    var node = parent.children[x];
                    if (allreadySeen.indexOf(node.data.item) === -1)
                        allreadySeen.push(node.data.item);
                    else
                        continue;
                    if (node.hasChildren() || node.isLazy) {
                        var prom = node.setExpanded(expand);
                        all.push(this.expandLater(prom, expand, node, allreadySeen));
                    }
                }
                await Promise.all(all);
            }
        }
        async expandKeys(keys) {
            var all = [];
            for (var x = 0; x < keys.length; x++) {
                var n = await this._readNodeFromKey(keys[x]);
                if (n) {
                    await n.setExpanded(true);
                    all.push(n);
                }
            }
            await Promise.all(all);
        }
        getExpandedKeys(parent = undefined, expandedNodes = undefined) {
            var isRoot = parent === undefined;
            if (parent === undefined)
                parent = this.tree.getRootNode();
            if (expandedNodes === undefined) {
                expandedNodes = [];
            }
            if (parent.hasChildren()) {
                parent.children.forEach((node) => {
                    if (node.isExpanded()) {
                        expandedNodes.push(node.key);
                        this.getExpandedKeys(node, expandedNodes);
                    }
                });
            }
            return expandedNodes;
        }
        async expandNode(node) {
            node.setActive(true);
            var list = node.getParentList(false, false);
            for (var x = 0; x < list.length; x++) {
                if (!list[x].isExpanded())
                    await list[x].setExpanded(true);
            }
        }
        async _readNodeFromItem(item) {
            var key = this._itemToKey.get(item);
            if (key === undefined)
                this._readAllKeysIfNeeded();
            key = this._itemToKey.get(item);
            return this._readNodeFromKey(key);
        }
        async _readNodeFromKey(key) {
            var nd = this.tree.getNodeByKey(key);
            if (nd === null) {
                var path = "";
                var geskey = "";
                key.split("|").forEach((k) => {
                    geskey = geskey + (geskey === "" ? "" : "|") + k;
                    path = path + "/" + geskey;
                });
                var _this = this;
                await this.tree.loadKeyPath(path, undefined);
            }
            nd = this.tree.getNodeByKey(key);
            return nd;
        }
        /**
         * set the active item
         */
        set value(value) {
            this["_valueIsWaiting"] = value;
            this._readNodeFromItem(value).then((node) => {
                node.setActive(true);
                delete this["_valueIsWaiting"];
            });
        }
        /**
         * get the active item
         **/
        get value() {
            if (this["_valueIsWaiting"] !== undefined) //async setting 
                return this["_valueIsWaiting"];
            var h = this.tree.getActiveNode();
            if (h === null)
                return undefined;
            return h.data.item;
        }
        async _readAllNodesIfNeeded() {
            if (this._allNodesReaded === true)
                return;
            if (this._allNodesReaded === false) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (this._allNodesReaded === true)
                            resolve(undefined);
                        else
                            resolve(this._readAllNodesIfNeeded());
                    }, 50);
                });
            }
            this._allNodesReaded = false;
            this._readAllKeysIfNeeded();
            var allPathes = [];
            var allPathes = [];
            this._itemToKey.forEach((key) => {
                //var key=entry[1];
                var path = "";
                var geskey = "";
                key.split("|").forEach((k) => {
                    geskey = geskey + (geskey === "" ? "" : "|") + k;
                    path = path + "/" + geskey;
                });
                allPathes.push(path);
            });
            var allPromise = [];
            for (var i = 0; i < allPathes.length; i++) {
                //@ts-ignore
                allPromise.push(this.tree.loadKeyPath(allPathes[i], undefined));
            }
            await Promise.all(allPromise);
            this._allNodesReaded = true;
            //    	await Promise.all(allPromise);
            //	await this.tree.loadKeyPath(allPathes,undefined);
        }
        getKeyFromItem(item) {
            var ret = this._itemToKey.get(item);
            if (ret === undefined)
                this._readAllKeysIfNeeded();
            return this._itemToKey.get(item);
        }
        /**
         * read all keys if not allready readed
         **/
        _readAllKeysIfNeeded(item = undefined, path = undefined, allreadySeen = undefined) {
            if (item === undefined && this._allKeysReaded === true)
                return;
            if (item === undefined) {
                this.tree.getRootNode().children.forEach((child) => {
                    this._readAllKeysIfNeeded(child.data.item, "", []);
                });
                return;
            }
            if (allreadySeen.indexOf(item) === -1)
                allreadySeen.push(item);
            else
                return;
            var title = this.getTitleFromItem(item).replaceAll("|", "!");
            var key = path + (path === "" ? "" : "|") + title;
            this._itemToKey.set(item, key);
            var cs = this.getChildsFromItem(item);
            if (cs !== undefined) {
                cs.forEach((c => {
                    this._readAllKeysIfNeeded(c, key, allreadySeen);
                }));
            }
            this._allKeysReaded = true;
        }
        /**
         * @param value - set the data to show in Tree
         **/
        set items(value) {
            this._items = value;
            this._allKeysReaded = undefined;
            this._allNodesReaded = undefined;
            this._itemToKey = new Map();
            if (!Array.isArray(value))
                value = [value];
            var avalue = [];
            for (var x = 0; x < value.length; x++) {
                avalue.push(new TreeNode(this, value[x]));
            }
            this.tree.reload(avalue);
            /*        var root: Fancytree.FancytreeNode = $("#" + this._id).fancytree("getTree").rootNode;
                    root.removeChildren();
                    this.objectToNode = new Map();
                    //this._allNodes={};
                    root.addChildren(avalue);
                    for (var j = 0;j < root.children.length;j++) {
                        avalue[j].fancyNode = root.children[j];
                        this.objectToNode.set(value[j], avalue[j]);
                    }*/
        }
        get items() {
            return this._items;
        }
        /**
         * if the value is changed then the value of _component is also changed (_component.value)
         */
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        _callContextmenu(event) {
            var x = 9;
            //var tree=$(event.target).attr("treeid");
            //tree=$("#"+tree)[0]._this;
            var newevent = {
                originalEvent: event,
                target: $(event.target).prev()[0]
            };
            event.preventDefault();
            if (this.contextMenu !== undefined) {
                this.contextMenu._callContextmenu(newevent);
            }
            //evt.originalEvent.clientY}
            //	tree.contextMenu.show(event);
        }
        /**
         * create the contextmenu
         * @param {object} evt  the click event in the contextmenu
         **/
        _prepareContextmenu(evt) {
            //var node: TreeNode = undefined;
            var node = $.ui.fancytree.getNode(evt.target);
            //node = this._allNodes[evt.target.id];
            if (this._contextMenu !== undefined) {
                if (node.data.item === undefined)
                    return;
                var test = node.data.tree.selection;
                //multiselect and the clicked is within the selection
                if (test !== undefined && test.indexOf(node.data.item) !== -1) {
                    this._contextMenu.value = test;
                }
                else
                    this._contextMenu.value = [node === undefined ? undefined : node.data.item];
            }
        }
        /**
         * @member {jassi.ui.ContextMenu} - the contextmenu of the component
         **/
        set contextMenu(value) {
            super.contextMenu = value;
            var _this = this;
            value.onbeforeshow(function (evt) {
                _this._prepareContextmenu(evt);
            });
        }
        get contextMenu() {
            return super.contextMenu;
        }
        destroy() {
            this._items = undefined;
            super.destroy();
        }
    };
    __decorate([
        Property_30.$Property({ type: "string", description: "the property called to get the style of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propStyle", null);
    __decorate([
        Property_30.$Property({ type: "string", description: "the property called to get the name of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propDisplay", null);
    __decorate([
        Property_30.$Property({ default: "function(event?: JQueryEventObject/*, data?:Fancytree.EventData*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Tree.prototype, "onclick", null);
    Tree = __decorate([
        Component_24.$UIComponent({ fullPath: "common/Tree", icon: "mdi mdi-file-tree" }),
        Jassi_68.$Class("jassi.ui.Tree"),
        Property_30.$Property({ name: "new", type: "json", componentType: "jassi.ui.TreeEditorProperties" })
        /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
        @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
        @$Property({ name: "new/multi", type: "json" })
        @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
        */
        ,
        __metadata("design:paramtypes", [Object])
    ], Tree);
    exports.Tree = Tree;
    class TreeNode {
        //options.source=[ { title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
        constructor(tree, item, parent = undefined) {
            this.tree = tree;
            this.parent = parent;
            this._id = Registry_20.default.nextID();
            this.item = item;
            var title = this.tree.getTitleFromItem(this.item);
            this.key = (parent !== undefined ? parent.key + "|" : "") + (title === undefined ? "" : title).replaceAll("|", "!");
            this.tree._itemToKey.set(item, this.key);
            this.icon = this.tree.getIconFromItem(this.item);
            var cs = this.tree.getChildsFromItem(this.item);
            if (cs !== undefined && cs.length > 0) {
                this.lazy = true;
            }
        }
        getStyle() {
            var ret = "";
            var style = this.tree.getStyleFromItem(this.item);
            if (style) {
                for (let key in style) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    ret = ret + "\t\t" + newKey + ":" + style[key] + ";\n";
                }
            }
            return ret;
        }
        get title() {
            var ret = this.tree.getTitleFromItem(this.item);
            var bt = "";
            if (this.tree.contextMenu !== undefined)
                bt = "<span class='MenuButton menu mdi mdi-menu-down' id=900  treeid=" + this.tree._id + "  height='10' width='10' onclick='/*jassi.ui.Tree._callContextmenu(event);*/'>";
            //prevent XSS
            ret = (ret === undefined ? "" : ret).replaceAll("<", "&lt").replaceAll(">", "&gt");
            ret = "<span id=" + this._id + " style='" + this.getStyle() + "'  >" + ret + "</span>";
            return ret + bt;
        }
        static loadChilds(event, data) {
            var node = data.node;
            var deferredResult = jQuery.Deferred();
            var tree = data.node.data.tree;
            var _this = data.node;
            var cs = tree.getChildsFromItem(data.node.data.item);
            var childs = [];
            if (cs !== undefined && cs.length > 0) {
                for (var x = 0; x < cs.length; x++) {
                    var nd = new TreeNode(tree, cs[x], _this);
                    childs.push(nd);
                }
            }
            data.result = childs;
            return;
            /*        fancynode.removeChildren();
                    fancynode.addChildren(childs);
                    for (var j = 0;j < fancynode.children.length;j++) {
                        childs[j].fancyNode = fancynode.children[j];
                        this.tree.objectToNode.set(cs[j], childs[j]);
                    }*/
            // delete this._dummy;
        }
    }
    ;
    async function test() {
        var tree = new Tree({
            checkbox: true
        });
        var s = { name: "Sansa", id: 1, style: { color: "blue" } };
        var p = { name: "Peter", id: 2 };
        var u = { name: "Uwe", id: 3, childs: [p, s] };
        var t = { name: "Tom", id: 5 };
        var c = { name: "Christoph", id: 4, childs: [u, t] };
        s.childs = [c];
        tree.propDisplay = "name";
        tree.propChilds = "childs";
        tree.propStyle = "style";
        /*tree.propIcon = function(data) {
            if (data.name === "Uwe")
                return "res/car.ico";
        };*/
        tree.items = [c];
        tree.width = "100%";
        tree.height = "100px";
        //  tree._readAllKeysIfNeeded();
        tree.onclick(function (data) {
            console.log("select " + data.data.name);
        });
        tree.selection = [p, s];
        var k = tree.selection;
        tree.value = p;
        //	await tree.tree.loadKeyPath(["/Christoph/Christoph|Uwe/Christoph|Uwe|Peter"],undefined);
        //		var h=tree.tree.getNodeByKey("Christoph|Uwe|Peter");
        //		tree.tree.activateKey("Christoph|Uwe|Peter");
        //["Christoph","Christoph/Uwe/Tom1"],()=>{});
        //	node.setActive(true);
        // var j = tree.value;
        window.setTimeout(async () => {
            var k = tree.selection;
            //		var nod=tree.tree.getNodeByKey("Christoph/Uwe/Tom1");
            // await tree.expandAll(true);
            // await tree.expandAll(false);
            //	var node=tree.tree.getNodeByKey("Christoph/Uwe/Peter");
            //	node.setActive(true);
            //await tree.expandAll();
            // tree.value = p;
            //tree.expandAll(false);
            // tree.value = p;
            //var k=tree.getExpandedKeys();
            // tree.expandKeys(k);
            /* tree.expandAll();
             tree.value = p;
             var l=tree.value;*/
            //  var j = tree.value;
            // alert(tree.value.name);
        }, 4000);
        //    	$(tree.__dom).dialog();
        return tree;
    }
    exports.test = test;
});
define("jassi/ui/Upload", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/Property"], function (require, exports, Jassi_69, Component_25, Property_31) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Upload = void 0;
    let Upload = class Upload extends Component_25.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<input type="file" id="dateien" name="files[]" />')[0]);
            var _this = this;
            $(this.dom).on("change", function (evt) {
                _this.readUpload(evt);
            });
        }
        get accept() {
            return $(this.dom).prop("accept");
        }
        /**
         * which file types are accepted e.g ".txt,.csv"
         **/
        set accept(value) {
            $(this.dom).prop("accept", value);
        }
        get multiple() {
            return $(this.dom).prop("multiple");
        }
        /**
         * multiple files can be uploaded
         **/
        set multiple(value) {
            $(this.dom).prop("multiple", value);
        }
        async readUpload(evt) {
            var files = evt.target["files"];
            var data = {};
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.readAsText(file);
                data[file.name] = await file.text();
            }
            this.callEvent("uploaded", data, files, evt);
        }
        ;
        /**
         * register handler to get the uploaded data
         */
        onuploaded(handler) {
            this.addEvent("uploaded", handler);
        }
    };
    __decorate([
        Property_31.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Upload.prototype, "accept", null);
    __decorate([
        Property_31.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Upload.prototype, "multiple", null);
    __decorate([
        Property_31.$Property({ default: "function(data:{[file:string]:string}){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Upload.prototype, "onuploaded", null);
    Upload = __decorate([
        Component_25.$UIComponent({ fullPath: "common/Upload", icon: "mdi mdi-cloud-upload-outline" }),
        Jassi_69.$Class("jassi.ui.Upload"),
        __metadata("design:paramtypes", [])
    ], Upload);
    exports.Upload = Upload;
    /*
        // UI-Events erst registrieren wenn das DOM bereit ist!
    document.addEventListener("DOMContentLoaded", function () {
        // Falls neue Eingabe, neuer Aufruf der Auswahlfunktion
        document.getElementById('dateien')
            .addEventListener('change', dateiauswahl, false);
    });*/
    function test() {
        var upload = new Upload();
        upload.multiple = true;
        upload.onuploaded(function (data) {
            debugger;
        });
        //	upload.accept=".txt,.csv";
        return upload;
    }
    exports.test = test;
});
define("jassi/ui/VariablePanel", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Component", "jassi/ui/ComponentDescriptor"], function (require, exports, Jassi_70, Panel_17, Component_26, ComponentDescriptor_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VariablePanel = void 0;
    Jassi_70.default.d = function (id) {
        if (Jassi_70.default.d[id] === true)
            return false;
        Jassi_70.default.d[id] = true;
        return true;
    };
    // console.log(jassi.d(9)?debug:0);
    // console.log(jassi.d(9)?debug:0);
    let VariablePanel = class VariablePanel extends Panel_17.Panel {
        constructor() {
            super();
            /**cache**/
            /**@member {Object.<number, boolean>} **/
            this.debugpoints = {};
        }
        async createTable() {
            var Table = (await new Promise((resolve_32, reject_32) => { require(["jassi/ui/Table"], resolve_32, reject_32); })).Table;
            this.table = new Table({
                dataTreeChildFunction: function (obj) {
                    var ret = [];
                    if (typeof (obj.value) === "string")
                        return ret;
                    for (var v in obj.value) {
                        var oval = obj.value[v];
                        ret.push({
                            name: v,
                            value: oval
                        });
                    }
                    return ret;
                }
            });
            this.table.width = "calc(100% - 2px)";
            this.table.height = "calc(100% - 2px)";
            super.add(this.table);
        }
        /**
         * VariabelPanel for id
         * @id {number} - the id
         * @returns  {jassi.ui.VariablePanel}
        **/
        static get(id) {
            if ($("#" + id).length === 0) //dummy for Codeeditor has closed
                return { __db: true, add: function () { }, update: function () { } };
            return $("#" + id)[0]._this;
        }
        clear() {
            this.value = [];
            this._cache = [];
        }
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addAll(vars) {
            for (var key in vars) {
                this.addVariable(key, vars[key], false);
            }
            this.update();
        }
        /**
         *
         * @param {string} name - name of the variable
         * @param {object} value - the value of the variable
         * @param {boolean} [refresh] - refresh the dialog
         */
        addVariable(name, value, refresh = undefined) {
            var values;
            //@ts-ignore
            if (this.value === undefined || this.value === "")
                values = [];
            else
                values = this.value;
            var found = false;
            for (var x = 0; x < values.length; x++) {
                if (values[x].name === name) {
                    found = true;
                    values[x].value = value;
                    break;
                }
            }
            if (!found)
                values.push({ name: name, value: value });
            if (refresh !== false)
                this.update();
        }
        /**
         * analyze describeComponent(desc) -> desc.editableComponents and publish this
         **/
        updateCache() {
            this._cache = {};
            var vars = this.value;
            for (var x = 0; x < vars.length; x++) {
                var val = vars[x].value;
                var name = vars[x].name;
                this._cache[name] = val;
                if (name === "me" || name === "this") {
                    for (var key in val) {
                        this._cache[name + "." + key] = val[key];
                    }
                }
            }
            var _this = this;
            function update(key, val) {
                if (val instanceof Component_26.Component) {
                    var comps = undefined;
                    try {
                        comps = ComponentDescriptor_5.ComponentDescriptor.describe(val.constructor).resolveEditableComponents(val);
                    }
                    catch (_a) {
                    }
                    var ret = [];
                    for (var name in comps) {
                        var comp = comps[name];
                        var fname = name;
                        if (comps !== undefined && name !== "this") {
                            fname = key + "." + name;
                            _this._cache[fname] = comp;
                            update(fname, comps[name]);
                        }
                        if (comp === undefined)
                            comp = comp;
                        var complist = comp._components;
                        if (complist !== undefined) {
                            for (var o = 0; o < complist.length; o++) {
                                update(fname, complist[o]);
                            }
                        }
                    }
                }
            }
            for (var key in this._cache) {
                val = this._cache[key];
                update(key, val);
            }
        }
        /**
         * get the ids of all editable Components by the designer
         * @param {jassi.ui.Component} component - the component to inspect
         * @param {boolean} idFromLabel - if true not the id but the id form label is returned
         **/
        getEditableComponents(component, idFromLabel = undefined) {
            var ret = "";
            if (this.getVariableFromObject(component) !== undefined)
                ret = "#" + ((idFromLabel === true) ? component.domWrapper._id : component._id);
            if (component._components !== undefined) {
                for (var x = 0; x < component._components.length; x++) {
                    var t = this.getEditableComponents(component._components[x], idFromLabel);
                    if (t !== "") {
                        ret = ret + (ret === "" ? "" : ",") + t;
                    }
                }
            }
            return ret;
        }
        /**
        * get all known instances for type
        * @param {type} type - the type we are interested
        * @returns {[string]}
        */
        getVariablesForType(type) {
            var ret = [];
            var vars = this.value;
            if (type === undefined)
                return ret;
            for (var x = 0; x < vars.length; x++) {
                var val = vars[x].value;
                var name = vars[x].name;
                if (val !== undefined && (val instanceof type))
                    ret.push(name);
            }
            //seach in this
            vars = this._cache["this"];
            for (let y in vars) {
                if (vars[y] instanceof type)
                    ret.push("this." + y);
            }
            //seach in me
            vars = this._cache["me"];
            if (vars !== undefined) {
                for (let z in vars) {
                    if (vars[z] instanceof type)
                        ret.push("me." + z);
                }
            }
            return ret;
        }
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob) {
            for (var key in this._cache) {
                if (this._cache[key] === ob)
                    return key;
            }
        }
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname) {
            if (this._cache === undefined)
                return undefined;
            return this._cache[varname];
        }
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName) {
            if (oldName.startsWith("this.")) {
                oldName = oldName.substring(5);
                if (newName.startsWith("this."))
                    newName = newName.substring(5);
                let vars = this._cache["this"];
                vars[newName] = vars[oldName];
                delete vars[oldName];
            }
            else if (oldName.startsWith("me.")) {
                oldName = oldName.substring(3);
                if (newName.startsWith("me."))
                    newName = newName.substring(3);
                let vars = this._cache["me"];
                vars[newName] = vars[oldName];
                delete vars[oldName];
            }
            else {
                let vars = this.value;
                for (var x = 0; x < vars.length; x++) {
                    var val = vars[x].value;
                    var name = vars[x].name;
                    if (name === oldName) {
                        vars[x].name = newName;
                    }
                }
            }
            this.update();
        }
        /**
         * refreshes Table
         */
        update() {
            this.value = this.value;
            this.updateCache();
        }
        set value(value) {
            this._items = value;
            if (this.table)
                this.table.items = value;
        }
        get value() {
            return this._items; //this.table.items;
        }
        static getMembers(ob, withFunction) {
            if (withFunction === undefined)
                withFunction = false;
            var ret = [];
            for (var k in ob) {
                ret.push(k);
            }
            if (withFunction) {
                var type = ob.__proto__;
                if (ob.constructor !== null) //ob is a class
                    type = ob;
                this._getMembersProto(type, ret, ob);
            }
            return ret;
        }
        static _getMembersProto(proto, ret, ob) {
            if (proto === null)
                return;
            if (proto.constructor.name === "Object")
                return;
            var names = Object.getOwnPropertyNames(proto);
            for (var x = 0; x < names.length; x++) {
                ret.push(names[x]);
            }
            if (proto.__proto__ !== undefined && proto.__proto__ !== null) {
                this._getMembersProto(proto.__proto__, ret, ob);
            }
        }
        /**
        *
        * @param {string} name - the name of the object
        */
        evalExpression(name) {
            var toEval = "_variables_._curCursor=" + name + ";";
            var vals = this.value;
            for (var x = 0; x < vals.length; x++) {
                var v = vals[x];
                var sname = v.name;
                if (sname === "this")
                    sname = "this_this";
                if (sname !== "windows")
                    toEval = "var " + sname + "=_variables_.getObjectFromVariable(\"" + v.name + "\");" + toEval;
            }
            toEval = "var ev=function(){" + toEval + '};ev.bind(_variables_.getObjectFromVariable("this"))();';
            toEval = "var _variables_=$('#" + this._id + "')[0]._this;" + toEval;
            try {
                eval(toEval);
            }
            catch (ex) {
            }
            //this is the real object for .
            return this._curCursor;
        }
        destroy() {
            this.clear();
            this.debugpoints = [];
            this.table.items = [];
            super.destroy();
        }
    };
    VariablePanel = __decorate([
        Jassi_70.$Class("jassi.ui.VariablePanel"),
        __metadata("design:paramtypes", [])
    ], VariablePanel);
    exports.VariablePanel = VariablePanel;
});
define("jassi/ui/PropertyEditors/BooleanEditor", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/Checkbox", "jassi/ui/PropertyEditors/Editor"], function (require, exports, Jassi_71, Checkbox_1, Editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BooleanEditor = void 0;
    let BooleanEditor = class BooleanEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Checkbox_1.Checkbox();
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.value;
            this.propertyEditor.setPropertyInCode(this.property.name, val.toString());
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            super.callEvent("edit", param);
        }
    };
    BooleanEditor = __decorate([
        Editor_1.$PropertyEditor(["boolean"]),
        Jassi_71.$Class("jassi.ui.PropertyEditors.BooleanEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], BooleanEditor);
    exports.BooleanEditor = BooleanEditor;
});
define("jassi/ui/PropertyEditors/ClassSelectorEditor", ["require", "exports", "jassi/ui/Select", "jassi/ui/PropertyEditors/Editor", "jassi/ui/PropertyEditors/JsonEditor", "jassi/util/Tools", "jassi/ui/converters/StringConverter", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi/remote/Registry", "jassi/ui/ComponentDescriptor", "jassi/remote/Classes"], function (require, exports, Select_3, Editor_2, JsonEditor_1, Tools_2, StringConverter_1, Jassi_72, Panel_18, Textbox_10, Registry_21, ComponentDescriptor_6, Classes_24) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassSelectorEditor = void 0;
    let ClassSelectorEditor = class ClassSelectorEditor extends Editor_2.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassi.ui.PropertyEditors.BooleanEditor
         */
        constructor(property = undefined, propertyEditor = undefined) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_18.Panel();
            this.component.width = "100%";
            this.select = new Select_3.Select();
            this.select.width = "calc(100% - 26px)";
            this.property = Tools_2.Tools.copyObject(property);
            this.jsonEditor = new JsonEditor_1.JsonEditor(this.property, propertyEditor);
            this.jsonEditor.parentPropertyEditor = this;
            this.jsonEditor.component.text = "";
            this.jsonEditor.component.icon = "mdi mdi-glasses";
            this.jsonEditor.component.width = 26;
            this.component.add(this.select);
            this.component.add(this.jsonEditor.getComponent());
            var _this = this;
            this.jsonEditor.onpropertyChanged(function (param) {
                return;
            });
            this.select.onchange(function (sel) {
                var converter = sel.data;
                _this.changeConverter(converter);
            });
            this.initSelect();
            // this.component.onclick(function(param){
            //     _this._onclick(param);
            // });
        }
        changeConverter(converter) {
            var _this = this;
            var testval = _this.propertyEditor.getPropertyValue(_this.property);
            var shortClassname = converter.classname.split(".")[converter.classname.split(".").length - 1];
            if (testval === undefined || !testval.startsWith("new " + shortClassname)) {
                _this.propertyEditor.setPropertyInCode(_this.property.name, "new " + shortClassname + "()");
                var file = converter.classname.replaceAll(".", "/");
                var stype = file.split("/")[file.split("/").length - 1];
                _this.propertyEditor.addImportIfNeeded(stype, file);
                Classes_24.classes.loadClass(converter.classname).then((pclass) => {
                    _this.propertyEditor.setPropertyInDesign(_this.property.name, new pclass());
                });
            }
            _this.property.constructorClass = converter.classname;
            _this.jsonEditor.showThisProperties = ComponentDescriptor_6.ComponentDescriptor.describe(Classes_24.classes.getClass(converter.classname)).fields;
            for (var x = 0; x < _this.jsonEditor.showThisProperties.length; x++) {
                var test = _this.jsonEditor.showThisProperties[x].name;
                if (test.startsWith("new")) {
                    _this.jsonEditor.showThisProperties[x].name = _this.property.name + test.substring(3);
                }
            }
            _this.jsonEditor.ob = {};
            _this.jsonEditor.component.text = "";
        }
        initSelect() {
            var _this = this;
            Registry_21.default.loadAllFilesForService(this.property.service).then(function () {
                var converters = Registry_21.default.getData(_this.property.service);
                var data = [];
                /*data.push({
                       classname:undefined,
                       data:""
                   });*/
                for (var x = 0; x < converters.length; x++) {
                    var con = converters[x];
                    var cname = Classes_24.classes.getClassName(con.oclass);
                    var name = cname;
                    if (con.params[0] && con.params[0].name !== undefined)
                        name = con.params[0].name;
                    data.push({
                        classname: cname,
                        data: name
                    });
                }
                _this.select.items = data;
                _this.select.display = "data";
                _this.ob = _this.ob;
            });
            //	this.select
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            if (this.propertyEditor === undefined)
                return;
            if (this.select.items === undefined)
                return; //list is not inited
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                for (var x = 0; x < this.select.items.length; x++) {
                    var sel = this.select.items[x];
                    var shortClassname = sel.classname;
                    if (shortClassname !== undefined) {
                        shortClassname = shortClassname.split(".")[shortClassname.split(".").length - 1];
                        if (value.indexOf(shortClassname) > -1) {
                            this.select.value = sel;
                            this.changeConverter(sel);
                            break;
                        }
                    }
                }
            }
            else {
                this.select.value = "";
            }
            super.ob = ob;
            // this.component.value=value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.value;
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            super.callEvent("edit", param);
        }
        layout() {
            var me = this.me = {};
            me.pan = new Panel_18.Panel();
            me.tb = new Textbox_10.Textbox();
            me.pan.height = 15;
            me.pan.add(me.tb);
            me.tb.height = 15;
            me.tb.converter = new StringConverter_1.StringConverter();
        }
        destroy() {
            this.select.destroy();
            super.destroy();
        }
    };
    ClassSelectorEditor = __decorate([
        Editor_2.$PropertyEditor(["classselector"]),
        Jassi_72.$Class("jassi.ui.PropertyEditors.ClassSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ClassSelectorEditor);
    exports.ClassSelectorEditor = ClassSelectorEditor;
    Jassi_72.default.test = function () {
        ComponentDescriptor_6.ComponentDescriptor.cache = {};
        var t = new ClassSelectorEditor();
        t.layout();
        return t.me.pan;
    };
});
define("jassi/ui/PropertyEditors/ColorEditor", ["require", "exports", "jassi/ui/PropertyEditor", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Select", "jassi/ui/BoxPanel", "jassi/ext/spectrum"], function (require, exports, PropertyEditor_3, Editor_3, Textbox_11, Jassi_73, Select_4, BoxPanel_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.ColorEditor = void 0;
    var colors = ["black", "silver", "gray", "white", "maroon", "red", "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal", "aqua", "orange", "aliceblue", "antiquewhite", "aquamarine", "azure", "beige", "bisque", "blanchedalmond", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "gainsboro", "ghostwhite", "gold", "goldenrod", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "limegreen", "linen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "oldlace", "olivedrab", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "wheat", "whitesmoke", "yellowgreen", "rebeccapurple"];
    let ColorEditor = 
    /**
    * Editor for color
    * used by PropertyEditor
    **/
    class ColorEditor extends Editor_3.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            var _this = this;
            /** @member - the renedering component **/
            this.component = new BoxPanel_7.BoxPanel();
            this.component.horizontal = true;
            this.icon = new Textbox_11.Textbox();
            this.icon.width = "10px";
            this.select = new Select_4.Select();
            this.select.width = "85px";
            this.component.add(this.select);
            this.component.add(this.icon);
            this.select.items = colors;
            this.select.display = function (color) {
                return "<span><div style='float:left;width:10px;height:10px;background:" + color + "'></div>" + color + "</span>";
            };
            var spec = $(this.icon.dom)["spectrum"]({
                color: "#f00",
                change: function (color) {
                    var scolor = color.toHexString();
                    var old = _this.select.items;
                    if (old.indexOf(scolor) === -1)
                        old.push(scolor);
                    _this.select.items = old;
                    _this.select.value = scolor;
                    _this._onchange({});
                    //		    _this.paletteChanged(color.toHexString()); // #ff0000
                }
            });
            //correct height
            var bt = $(this.icon.domWrapper).find(".sp-preview");
            bt.css("width", "8px");
            bt.css("height", "8px");
            var bx = $(this.icon.domWrapper).find(".sp-replacer");
            bx.css("height", "10px");
            bx.css("width", "10px");
            var bp = $(this.icon.domWrapper).find(".sp-dd");
            bp.css("height", "6px");
            //spec.width="10px";
            //   this.component.dom=font[0];
            this.select.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (!value || value === "")
                value = "";
            else
                value = value.substring(1, value.length - 1);
            $(this.icon.dom)["spectrum"]("set", value);
            var old = this.select.items;
            if (old.indexOf(value) === -1)
                old.push(value);
            this.select.items = old;
            this.select.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        paletteChanged(color) {
            //var val =  "\"" + color + "\"";
            //this.propertyEditor.setPropertyInCode(this.property.name, val);
            //this.propertyEditor.setPropertyInDesign(this.property.name, color);
            this.select.value = color;
            //super.callEvent("edit", color);
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.select.value;
            val = "\"" + val + "\"";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.select.value;
            $(this.icon.dom)["spectrum"]("set", oval);
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    ColorEditor = __decorate([
        Editor_3.$PropertyEditor(["color"]),
        Jassi_73.$Class("jassi.ui.PropertyEditors.ColorEditor")
        /**
        * Editor for color
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], ColorEditor);
    exports.ColorEditor = ColorEditor;
    function test() {
        var prop = new PropertyEditor_3.PropertyEditor(undefined);
        prop.value = new Textbox_11.Textbox();
        return prop;
    }
    exports.test = test;
    function test2() {
        var panel = new BoxPanel_7.BoxPanel();
        panel.horizontal = false;
        var icon = new Textbox_11.Textbox();
        var textbox = new Textbox_11.Textbox();
        panel.add(textbox);
        panel.add(icon);
        var spec = $(icon.dom)["spectrum"]({
            color: "#f00"
        });
        spec.width = "10px";
        spec.height = "10px";
        return panel;
    }
    exports.test2 = test2;
});
define("jassi/ui/PropertyEditors/ComponentSelectorEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Select", "jassi/remote/Classes", "jassi/remote/Jassi"], function (require, exports, Editor_4, Select_5, Classes_25, Jassi_74) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentSelectorEditor = void 0;
    /**
     * select one or more instances of an class
     * used by PropertyEditor
     **/
    let ComponentSelectorEditor = class ComponentSelectorEditor extends Editor_4.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Select_5.Select({
                multiple: (property.componentType.indexOf("[") === 0)
            });
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var scomponentType = this.property.componentType.replace("[", "").replace("]", "");
            var data = this.propertyEditor.getVariablesForType(Classes_25.classes.getClass(scomponentType));
            this.component.items = data === undefined ? [] : data;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (this.property.componentType.indexOf("[") === 0 && value) {
                value = value.substring(1, value.length - 1).split(",");
            }
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            if (this.property.componentType.indexOf("[") === 0) {
                let oval = [];
                let code = "";
                for (var x = 0; x < val.length; x++) {
                    code = code + (code === "" ? "" : ",") + val[x];
                    let o = this.propertyEditor.getObjectFromVariable(val[x]);
                    oval.push(o);
                }
                this.propertyEditor.setPropertyInCode(this.property.name, "[" + code + "]");
                this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            }
            else {
                let oval = this.propertyEditor.getObjectFromVariable(val);
                this.propertyEditor.setPropertyInCode(this.property.name, val);
                this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            }
            super.callEvent("edit", param);
        }
    };
    ComponentSelectorEditor = __decorate([
        Editor_4.$PropertyEditor(["componentselector"]),
        Jassi_74.$Class("jassi.ui.PropertyEditors.ComponentSelectorEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ComponentSelectorEditor);
    exports.ComponentSelectorEditor = ComponentSelectorEditor;
    function test() {
    }
    exports.test = test;
});
define("jassi/ui/PropertyEditors/DBObjectEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi/ui/ObjectChooser", "jassi/remote/Classes"], function (require, exports, Editor_5, Jassi_75, Panel_19, Textbox_12, ObjectChooser_1, Classes_26) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBObjectEditor = void 0;
    let DBObjectEditor = class DBObjectEditor extends Editor_5.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassi.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_19.Panel( /*{useSpan:true}*/);
            this._textbox = new Textbox_12.Textbox();
            this._objectchooser = new ObjectChooser_1.ObjectChooser();
            this._objectchooser.width = 24;
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this.component.add(this._textbox);
            this.component.add(this._objectchooser);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._objectchooser.onclick(function (ob) {
                _this._objectchooser.items = _this.property.componentType;
            }, false);
            this._objectchooser.onchange(function (ob) {
                _this.dbobject = _this._objectchooser.value;
                _this._textbox.value = _this._objectchooser.value.id;
                _this._onchange();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                //jassi.db.load("de.Kunde",9);
                if (value.startsWith("jassi.db.load")) {
                    var nr = value.split(",")[1];
                    nr = nr.substring(0, nr.indexOf(")") - 1);
                    this._textbox.value = nr;
                }
            }
            else {
                this._textbox.value = "";
            }
            var _this = this;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        async loadObject(id) {
            var tp = await Classes_26.classes.loadClass(this.property.componentType);
            return await tp["findOne"](parseInt(id));
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            var type = this.property.componentType;
            var sval = "jassi.db.load(\"" + type + "\"," + val + ")";
            var _this = this;
            this.propertyEditor.setPropertyInCode(this.property.name, sval);
            if (val && val !== "" && this.dbobject === undefined) {
                this.loadObject(val).then((ob) => {
                    _this.dbobject = ob;
                    _this.propertyEditor.setPropertyInDesign(_this.property.name, _this.dbobject);
                });
            }
            else
                this.propertyEditor.setPropertyInDesign(this.property.name, this.dbobject);
            /* var _this=this;
             jassi.db.load("de.Kunde",val).then(function(ob){
                 _this.propertyEditor.setPropertyInDesign(_this.property.name,ob);
             });*/
            /*
            var func=this.propertyEditor.value[this.property.name];
            var binder=this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder,sp[0]);
            //setPropertyInDesign(this.property.name,val);*/
            super.callEvent("edit", param);
        }
    };
    DBObjectEditor = __decorate([
        Editor_5.$PropertyEditor(["dbobject"]),
        Jassi_75.$Class("jassi.ui.PropertyEditors.DBObjectEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DBObjectEditor);
    exports.DBObjectEditor = DBObjectEditor;
});
define("jassi/ui/PropertyEditors/DatabinderEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Databinder", "jassi/remote/Jassi", "jassi/ui/Textbox"], function (require, exports, Editor_6, Databinder_4, Jassi_76, Textbox_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabinderEditor = void 0;
    let DatabinderEditor = class DatabinderEditor extends Editor_6.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_13.Textbox();
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                var sp = value.replaceAll('"', "").split(",");
                value = sp[1] + "-" + sp[0];
                this.component.value = value;
            }
            else {
                this.component.value = "";
            }
            //TODO call this on focus
            var binders = this.propertyEditor.getVariablesForType(Databinder_4.Databinder);
            if (binders !== undefined) {
                var comps = [];
                for (var x = 0; x < binders.length; x++) {
                    var binder = this.propertyEditor.getObjectFromVariable(binders[x]);
                    if (binder === undefined)
                        continue;
                    let ob = binder.value;
                    if (ob !== undefined) {
                        for (var m in ob) {
                            comps.push(m + "-" + binders[x]);
                        }
                    }
                }
                this.component.autocompleter = comps;
            }
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param) {
            var val = this.component.value;
            var sp = val.split("-");
            val = sp[1] + ',"' + sp[0] + '"';
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var func = this.propertyEditor.value[this.property.name];
            var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder, sp[0]);
            //setPropertyInDesign(this.property.name,val);
            super.callEvent("edit", param);
        }
    };
    DatabinderEditor = __decorate([
        Editor_6.$PropertyEditor(["databinder"]),
        Jassi_76.$Class("jassi.ui.PropertyEditors.DatabinderEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DatabinderEditor);
    exports.DatabinderEditor = DatabinderEditor;
});
define("jassi/ui/PropertyEditors/DefaultEditor", ["require", "exports", "jassi/ui/Textbox", "jassi/ui/PropertyEditors/Editor", "jassi/remote/Jassi"], function (require, exports, Textbox_14, Editor_7, Jassi_77) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DefaultEditor = class DefaultEditor extends Editor_7.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_14.Textbox();
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
            if (property.chooseFrom !== undefined) {
                if (typeof (property.chooseFrom) === "function") {
                    this.component.autocompleter = function () {
                        return property.chooseFrom(_this.ob);
                    };
                }
                else
                    this.component.autocompleter = property.chooseFrom;
            }
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && this.property.type === "string" && typeof value === 'string' && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }
            else if (value !== undefined && this.property.type === "number[]") {
                if (typeof (value) === "string")
                    value = value.replaceAll("[", "").replaceAll("]", "");
                else {
                    value = value.join(",");
                }
            }
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            if (this.property.type === "string")
                val = "\"" + val + "\"";
            if (this.property.type === "number[]")
                val = (val === "" ? "undefined" : "[" + val + "]");
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.component.value;
            if (this.property.type === "number") {
                oval = Number(oval);
            }
            if (this.property.type === "number[]") {
                if (oval === "")
                    oval = undefined;
                else {
                    var all = oval.split(",");
                    oval = [];
                    for (var x = 0; x < all.length; x++) {
                        oval.push(Number(all[x].trim()));
                    }
                }
            }
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    DefaultEditor = __decorate([
        Editor_7.$PropertyEditor(["string", "number", "number[]"]),
        Jassi_77.$Class("jassi.ui.PropertyEditors.DefaultEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DefaultEditor);
});
define("jassi/ui/PropertyEditors/Editor", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry"], function (require, exports, Jassi_78, Registry_22) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editor = exports.$PropertyEditor = void 0;
    function $PropertyEditor(supportedtypes) {
        return function (pclass) {
            Registry_22.default.register("$PropertyEditor", pclass, supportedtypes);
        };
    }
    exports.$PropertyEditor = $PropertyEditor;
    let Editor = class Editor {
        /**
        * Editor for number and string
        * used by PropertyEditor
        * @class jassi.ui.PropertyEditors.DefaultEditor
        */
        constructor(property, propertyEditor) {
            /** @member - the renedering component **/
            this.component = undefined;
            /** @member - the edited object */
            this._ob = undefined;
            /** @member {string} - the name of the variable */
            /** @member {jassi.ui.Property} - the property to edit */
            this.property = property;
            /** @member {jassi.ui.PropertEditor} - the PropertyEditor instance */
            this.propertyEditor = propertyEditor;
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
        }
        /**
         * adds an event
         * @param {type} name - the name of the event
         * @param {function} func - callfunction for the event
         */
        addEvent(name, func) {
            var events = this._eventHandler[name];
            if (events === undefined) {
                events = [];
                this._eventHandler[name] = events;
            }
            events.push(func);
        }
        /**
         * call the event
         * @param {name} name - the name of the event
         * @param {object} param 1- parameter for the event
         * @param {object} param 2- parameter for the event
         * @param {object} param 3- parameter for the event
         */
        callEvent(name, param1 = undefined, param2 = undefined, param3 = undefined) {
            var events = this._eventHandler[name];
            if (events === undefined)
                return;
            if (name === "edit") {
                if (param1 === undefined)
                    param1 = {};
                param1.property = this.property.name;
            }
            for (var x = 0; x < events.length; x++) {
                events[x](param1, param2, param3);
            }
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            this._ob = ob;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return undefined;
        }
        /**
         * called on value changes
         * @param handler - function(oldValue,newValue)
         */
        onedit(handler) {
            this.addEvent("edit", handler);
        }
        destroy() {
            if (this.component !== undefined) {
                this.component.destroy();
            }
        }
    };
    Editor = __decorate([
        Jassi_78.$Class("jassi.ui.PropertyEditors.Editor"),
        __metadata("design:paramtypes", [Object, Object])
    ], Editor);
    exports.Editor = Editor;
});
define("jassi/ui/PropertyEditors/FontEditor", ["require", "exports", "jassi/ui/PropertyEditor", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Select", "jassi/ui/CSSProperties"], function (require, exports, PropertyEditor_4, Editor_8, Textbox_15, Jassi_79, Select_6, CSSProperties_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.FontEditor = void 0;
    let systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    let googleFonts = ["Aclonica", "Allan", "Annie Use Your Telescope", "Anonymous Pro", "Allerta Stencil", "Allerta", "Amaranth", "Anton", "Architects Daughter", "Arimo", "Artifika", "Arvo", "Asset", "Astloch", "Bangers", "Bentham", "Bevan", "Bigshot One", "Bowlby One", "Bowlby One SC", "Brawler", "Buda:300", "Cabin", "Calligraffitti", "Candal", "Cantarell", "Cardo", "Carter One", "Caudex", "Cedarville Cursive", "Cherry Cream Soda", "Chewy", "Coda", "Coming Soon", "Copse", "Corben", "Cousine", "Covered By Your Grace", "Crafty Girls", "Crimson Text", "Crushed", "Cuprum", "Damion", "Dancing Script", "Dawning of a New Day", "Didact Gothic", "Droid Sans", "Droid Serif", "EB Garamond", "Expletus Sans", "Fontdiner Swanky", "Forum", "Francois One", "Geo", "Give You Glory", "Goblin One", "Goudy Bookletter 1911", "Gravitas One", "Gruppo", "Hammersmith One", "Holtwood One SC", "Homemade Apple", "Inconsolata", "Indie Flower", "Irish Grover", "Istok Web", "Josefin Sans", "Josefin Slab", "Judson", "Jura", "Just Another Hand", "Just Me Again Down Here", "Kameron", "Kenia", "Kranky", "Kreon", "Kristi", "La Belle Aurore", "Lato", "League Script", "Lekton", "Limelight", "Lobster", "Lobster Two", "Lora", "Love Ya Like A Sister", "Loved by the King", "Luckiest Guy", "Maiden Orange", "Mako", "Maven Pro", "Maven Pro:900", "Meddon", "MedievalSharp", "Megrim", "Merriweather", "Metrophobic", "Michroma", "Miltonian Tattoo", "Miltonian", "Modern Antiqua", "Monofett", "Molengo", "Mountains of Christmas", "Muli:300", "Muli", "Neucha", "Neuton", "News Cycle", "Nixie One", "Nobile", "Nova Cut", "Nova Flat", "Nova Mono", "Nova Oval", "Nova Round", "Nova Script", "Nova Slim", "Nova Square", "Nunito", "Old Standard TT", "Open Sans:300", "Open Sans", "Open Sans:600", "Open Sans:800", "Open Sans Condensed:300", "Orbitron", "Orbitron:500", "Orbitron:700", "Orbitron:900", "Oswald", "Over the Rainbow", "Reenie Beanie", "Pacifico", "Patrick Hand", "Paytone One", "Permanent Marker", "Philosopher", "Play", "Playfair Display", "Podkova", "Press Start 2P", "Puritan", "Quattrocento", "Quattrocento Sans", "Radley", "Raleway:100", "Redressed", "Rock Salt", "Rokkitt", "Ruslan Display", "Schoolbell", "Shadows Into Light", "Shanti", "Sigmar One", "Six Caps", "Slackey", "Smythe", "Sniglet", "Sniglet:800", "Special Elite", "Stardos Stencil", "Sue Elen Francisco", "Sunshiney", "Swanky and Moo Moo", "Syncopate", "Tangerine", "Tenor Sans", "Terminal Dosis Light", "The Girl Next Door", "Tinos", "Ubuntu", "Ultra", "Unkempt", "UnifrakturCook:bold", "UnifrakturMaguntia", "Varela", "Varela Round", "Vibur", "Vollkorn", "VT323", "Waiting for the Sunrise", "Wallpoet", "Walter Turncoat", "Wire One", "Yanone Kaffeesatz", "Yeseva One", "Zeyada"];
    let FontEditor = 
    /**
    * Editor for font
    * used by PropertyEditor
    **/
    class FontEditor extends Editor_8.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Select_6.Select({
                "multiple": false,
                "placeholder": "select a font",
                "allowDeselect": false
            });
            this.component.width = "100%";
            this.component.display = function (item) {
                return '<span style=font-family:"' + item + '>' + item + '</span>';
            };
            var all = [];
            for (let i = 0; i < systemFonts.length; i++) {
                all.push(systemFonts[i]);
            }
            for (let i = 0; i < googleFonts.length; i++) {
                all.push(googleFonts[i]);
                CSSProperties_3.loadFontIfNedded(googleFonts[i]);
            }
            this.component.items = all;
            //   this.component.dom=font[0];
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && value.length > 1)
                value = value.substring(1, value.length - 1);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            val = "\"" + val + "\"";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.component.value;
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    FontEditor = __decorate([
        Editor_8.$PropertyEditor(["font"]),
        Jassi_79.$Class("jassi.ui.PropertyEditors.FontEditor")
        /**
        * Editor for font
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], FontEditor);
    exports.FontEditor = FontEditor;
    function test() {
        var prop = new PropertyEditor_4.PropertyEditor(undefined);
        prop.value = new Textbox_15.Textbox();
        return prop;
    }
    exports.test = test;
});
define("jassi/ui/PropertyEditors/FunctionEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Button", "jassi/remote/Jassi"], function (require, exports, Editor_9, Button_9, Jassi_80) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FunctionEditor = void 0;
    let FunctionEditor = class FunctionEditor extends Editor_9.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Button_9.Button();
            this.component.width = "100%";
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property, true);
            if (value === undefined) {
                this.component.text = "none";
            }
            else
                this.component.text = "function";
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.text;
            if (val !== "function") { //function is still empty
                var value = this.propertyEditor.parser.getPropertyValue(this.propertyEditor.variablename, this.property.name);
                this.propertyEditor.setPropertyInCode(this.property.name, this.property.default);
                this.component.value = "function";
                //  this.propertyEditor.gotoCodeLine(line + 1);
                super.callEvent("edit", param);
            } /* else {//function is already defined so goto
                let line = this.propertyEditor.parser.data[this.propertyEditor.variablename][this.property.name][0].linestart;
                this.propertyEditor.gotoCodeLine(line + 1);
    
            }*/
            var node = this.propertyEditor.parser.data[this.propertyEditor.variablename][this.property.name][0].node;
            var pos = node["expression"].arguments[0].body.pos;
            this.propertyEditor.gotoCodePosition(pos + 2);
        }
    };
    FunctionEditor = __decorate([
        Editor_9.$PropertyEditor(["function"]),
        Jassi_80.$Class("jassi.ui.PropertyEditors.FunctionEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], FunctionEditor);
    exports.FunctionEditor = FunctionEditor;
});
define("jassi/ui/PropertyEditors/HTMLEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/remote/Jassi", "jassi/ui/Textbox", "jassi/ui/ObjectChooser", "jassi/ui/Panel"], function (require, exports, Editor_10, Jassi_81, Textbox_16, ObjectChooser_2, Panel_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEditor = void 0;
    let HTMLEditor = class HTMLEditor extends Editor_10.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassi.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_20.Panel( /*{useSpan:true}*/);
            this._textbox = new Textbox_16.Textbox();
            this._objectchooser = new ObjectChooser_2.ObjectChooser();
            this._objectchooser.width = 24;
            this._textbox.width = "calc(100% - 28px)";
            this.component.height = 24;
            this.component.add(this._textbox);
            this.component.add(this._objectchooser);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange('"' + param + '"');
            });
            this._objectchooser.onclick(function (ob) {
                _this._objectchooser.items = _this.property.type;
            });
            this._objectchooser.onchange(function (ob) {
                _this._textbox.value = _this._objectchooser.value.id;
                _this._onchange();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && this.property.type === "string" && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }
            this._textbox.value = value;
            var _this = this;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            var type = this.property.type;
            // var sval="jassi.db.load(\""+type+"\","+val+")";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
            /* var _this=this;
             jassi.db.load("de.Kunde",val).then(function(ob){
                 _this.propertyEditor.setPropertyInDesign(_this.property.name,ob);
             });*/
            /*
            var func=this.propertyEditor.value[this.property.name];
            var binder=this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder,sp[0]);
            //setPropertyInDesign(this.property.name,val);*/
            super.callEvent("edit", param);
        }
    };
    HTMLEditor = __decorate([
        Editor_10.$PropertyEditor(["html"]),
        Jassi_81.$Class("jassi.ui.PropertyEditors.HTMLEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], HTMLEditor);
    exports.HTMLEditor = HTMLEditor;
});
define("jassi/ui/PropertyEditors/ImageEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi/ui/Button", "jassi/base/Actions"], function (require, exports, Editor_11, Jassi_82, Panel_21, Textbox_17, Button_10, Actions_13) {
    "use strict";
    var ImageEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ImageEditor = void 0;
    let ImageEditor = ImageEditor_1 = class ImageEditor extends Editor_11.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassi.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_21.Panel( /*{useSpan:true}*/);
            this._button = new Button_10.Button();
            this._textbox = new Textbox_17.Textbox();
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this._button.icon = "mdi mdi-glasses";
            this.component.add(this._textbox);
            this.component.add(this._button);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._button.onclick(() => {
                _this.showDialog();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            this._textbox.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            if (this.property) {
                this.propertyEditor.setPropertyInCode(this.property.name, val);
                this.propertyEditor.setPropertyInDesign(this.property.name, val);
            }
            super.callEvent("edit", param);
        }
        static async show() {
            await new ImageEditor_1(undefined, undefined).showDialog();
        }
        async showDialog() {
            if (!this.dialog) {
                var _this = this;
                this.dialog = new Panel_21.Panel();
                var suche = new Textbox_17.Textbox();
                var icons = new Panel_21.Panel();
                this.dialog.add(suche);
                this.dialog.add(icons);
                suche.onchange((data) => {
                    var su = suche.value;
                    for (var x = 0; x < icons.dom.children[0].children.length; x++) {
                        var ic = icons.dom.children[0].children[x];
                        if (ic.className.indexOf(su) > -1) {
                            ic.setAttribute("style", "display:inline");
                        }
                        else
                            ic.setAttribute("style", "display:none");
                    }
                });
                var file = (await new Promise((resolve_33, reject_33) => { require(["jassi/modul"], resolve_33, reject_33); })).default.css["materialdesignicons.min.css"] + "?ooo=9";
                var text = await $.ajax({ method: "get", url: file, crossDomain: true, contentType: "text/plain" });
                var all = text.split("}.");
                var html = "";
                window["ImageEditorClicked"] = function (data) {
                    _this._textbox.value = "mdi " + data;
                    suche.value = data;
                    _this._onchange();
                    console.log(data);
                };
                for (var x = 1; x < all.length; x++) {
                    var icon = all[x].split(":")[0];
                    html = html + "<span title='" + icon + "' onclick=ImageEditorClicked('" + icon + "') class='mdi " + icon + "'></span>";
                }
                var node = $("<span style='font-size:18pt'>" + html + "</span>");
                icons.__dom.appendChild(node[0]);
                $(this.dialog.__dom).dialog({ height: "400", width: "400" });
            }
        }
    };
    __decorate([
        Actions_13.$Action({
            name: "Tools/Icons",
            icon: "mdi mdi-image-area",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ImageEditor, "show", null);
    ImageEditor = ImageEditor_1 = __decorate([
        Actions_13.$ActionProvider("jassi.base.ActionNode"),
        Editor_11.$PropertyEditor(["image"]),
        Jassi_82.$Class("jassi.ui.PropertyEditors.ImageEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], ImageEditor);
    exports.ImageEditor = ImageEditor;
    function test() {
        var ed = new ImageEditor(undefined, undefined);
        ed.showDialog();
    }
    exports.test = test;
});
define("jassi/ui/PropertyEditors/JsonEditor", ["require", "exports", "jassi/remote/Jassi", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Button", "jassi/ui/PropertyEditor", "jassi/util/Tools", "jassi/remote/Classes", "jassi/ui/Property"], function (require, exports, Jassi_83, Editor_12, Button_11, PropertyEditor_5, Tools_3, Classes_27, Property_32) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.JsonEditor = void 0;
    let JsonEditor = class JsonEditor extends Editor_12.Editor {
        /**
         * Editor for number and string
         * used by PropertyEditor
         * @class jassi.ui.PropertyEditors.DefaultEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Button_11.Button();
            var _this = this;
            this.component.onclick(function (param) {
                _this._onclick(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            //set cache for propertyvalues
            var empty = value === undefined || value.length === 0;
            if (empty) {
                this.component.icon = "mdi mdi-decagram-outline";
            }
            else
                this.component.icon = "mdi mdi-decagram";
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        _getPropertyValue(property) {
        }
        /**
         * register an event if the property has changed
         * @param {function} handler - the function that is called on change
         */
        onpropertyChanged(handler) {
            this.addEvent("propertyChanged", handler);
        }
        makePropertyChangedEvent(propEditor) {
            var _this = this;
            propEditor.onpropertyChanged(function (param) {
                _this.callEvent("propertyChanged", param);
                if (_this.propertyEditor.parentPropertyEditor === undefined) { //only if the last JSON-PropertyEditor Window is closed
                    var space = ""; //_this.propertyEditor.getSpace(_this.property.name);
                    //var str = Tools.objectToJson(propEditor.value, space);
                    var str = Tools_3.Tools.stringObjectToJson(propEditor.codeChanges, space);
                    if (_this.property.constructorClass !== undefined) {
                        var shortClassname = _this.property.constructorClass.split(".")[_this.property.constructorClass.split(".").length - 1];
                        str = "new " + shortClassname + "(" + str + ")";
                    }
                    var line = _this.propertyEditor.setPropertyInCode(_this.property.name, str);
                    //set Property in Design
                    //???Alternativ: 
                    var test = _this._ob; //Tools.stringObjectToObject
                    if (typeof (_this._ob[_this.property.name]) === "function")
                        _this._ob[_this.property.name](propEditor.value);
                    else
                        _this._ob[_this.property.name] = propEditor.value;
                    _this.callEvent("edit", param);
                }
                else
                    propEditor.parentPropertyEditor.callEvent("propertyChanged", param);
                let val = propEditor.value;
                if (!val) {
                    _this.component.icon = "mdi mdi-decagram-outline";
                }
                else {
                    _this.component.icon = "mdi mdi-decagram";
                }
            });
        }
        /**
         * initiate the default values in the PropertyEditor from code
         **/
        setCode(propEditor) {
            var _this = this;
            var av = this.propertyEditor.getPropertyValue(this.property);
            if (av !== undefined) {
                if (_this.propertyEditor.parentPropertyEditor === undefined) {
                    //we convert the ob to a stringobject and initialize the values
                    let textob = Tools_3.Tools.jsonToStringObject(av);
                    propEditor.codeChanges = textob === undefined ? {} : textob;
                }
                else {
                    propEditor.codeChanges = av;
                }
            }
            else {
                if (_this.propertyEditor.parentPropertyEditor === undefined) {
                    propEditor.codeChanges = {};
                }
                else {
                    this.propertyEditor.codeChanges[this.property.name] = {};
                    propEditor.codeChanges = this.propertyEditor.codeChanges[this.property.name];
                }
            }
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onclick(param) {
            var val = this.component.text;
            //if(val!=="function"){//function is still empty
            var propEditor = new PropertyEditor_5.PropertyEditor(undefined);
            propEditor.readPropertyValueFromDesign = this.propertyEditor.readPropertyValueFromDesign;
            propEditor.showThisProperties = this.showThisProperties;
            var _this = this;
            this.setCode(propEditor);
            this.makePropertyChangedEvent(propEditor);
            propEditor.parentPropertyEditor = this.propertyEditor;
            propEditor.variablename = this.property.name;
            var newclass = Classes_27.classes.getClass(this.property.componentType);
            var newvalue = new newclass();
            //only the top-PropertyEditor changed something
            if (this.propertyEditor.parentPropertyEditor === undefined) {
                var code = this.propertyEditor.getPropertyValue(this.property);
                if (this.property.constructorClass !== undefined) {
                    var param = code === undefined ? undefined : code.substring(code.indexOf("(") + 1, code.indexOf(")"));
                    if (param === "")
                        param = undefined;
                    Classes_27.classes.loadClass(this.property.constructorClass).then((oclass) => {
                        let oparam = Tools_3.Tools.jsonToObject(param);
                        var vv = new oclass(param === undefined ? undefined : oparam);
                        propEditor.value = vv;
                    });
                }
                else {
                    let val = undefined;
                    if (code === undefined) {
                        val = {};
                    }
                    else if (typeof (code) === "string") {
                        val = Tools_3.Tools.jsonToObject(code);
                    }
                    else
                        val = code;
                    Object.assign(newvalue, val);
                    val = newvalue;
                    propEditor.value = val;
                }
            }
            else {
                propEditor.showThisProperties = this.propertyEditor.showThisProperties;
                var val = this.propertyEditor.value[this.property.name];
                //if (propEditor.value === undefined) {
                if (val === undefined) {
                    propEditor.value = newvalue;
                    this.propertyEditor.value[this.property.name] = propEditor.value;
                }
                else {
                    Object.assign(newvalue, val);
                    val = newvalue;
                    propEditor.value = val;
                }
            }
            var docheight = $(document).height();
            var docwidth = $(document).width();
            $(propEditor.dom).dialog({
                height: docheight,
                width: "320px",
                beforeClose: function (event, ui) {
                    if (propEditor.variablename === "new") {
                        propEditor.parentPropertyEditor.updateCodeEditor();
                    }
                }
            });
        }
    };
    JsonEditor = __decorate([
        Editor_12.$PropertyEditor(["json"]),
        Jassi_83.$Class("jassi.ui.PropertyEditors.JsonEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], JsonEditor);
    exports.JsonEditor = JsonEditor;
    let TestProperties = class TestProperties {
    };
    __decorate([
        Property_32.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_32.$Property({ name: "jo/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        Property_32.$Property({ name: "jo", type: "json", componentType: "jassi.ui.PropertyEditorTestProperties2" }),
        __metadata("design:type", Object)
    ], TestProperties.prototype, "jo", void 0);
    TestProperties = __decorate([
        Jassi_83.$Class("jassi.ui.PropertyEditorTestProperties")
    ], TestProperties);
    let TestProperties2 = class TestProperties2 {
    };
    __decorate([
        Property_32.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties2.prototype, "name1", void 0);
    __decorate([
        Property_32.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TestProperties2.prototype, "name2", void 0);
    TestProperties2 = __decorate([
        Jassi_83.$Class("jassi.ui.PropertyEditorTestProperties2")
    ], TestProperties2);
    function test() {
        var ret = new PropertyEditor_5.PropertyEditor(undefined);
        ret.value = new TestProperties();
        return ret;
    }
    exports.test = test;
});
define("jassi/ui/PropertyEditors/LoadingEditor", ["require", "exports", "jassi/ui/Textbox", "jassi/ui/PropertyEditors/Editor"], function (require, exports, Textbox_18, Editor_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadingEditor = void 0;
    class LoadingEditor extends Editor_13.Editor {
        constructor(property, propertyEditor, waitforclass) {
            super(property, propertyEditor);
            this._property = property;
            this._propertyEditor = propertyEditor;
            /** @member - the renedering component **/
            this.component = new Textbox_18.Textbox();
            let _this = this;
            waitforclass.then((cl) => {
                _this._editor = new cl(_this.property, _this.propertyEditor);
                _this.component.dom.parentNode.replaceChild(_this._editor.getComponent().dom, _this.component.dom);
                _this._editor.ob = _this.ob;
                _this.component = _this._editor.component;
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            if (this._editor)
                this._editor = ob;
            else
                super.ob = ob;
        }
        get ob() {
            if (this._editor)
                return this._editor.ob;
            else
                return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
    }
    exports.LoadingEditor = LoadingEditor;
});
define("jassi/ui/PropertyEditors/NameEditor", ["require", "exports", "jassi/ui/PropertyEditors/Editor", "jassi/ui/Textbox", "jassi/remote/Jassi"], function (require, exports, Editor_14, Textbox_19, Jassi_84) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NameEditor = void 0;
    let NameEditor = class NameEditor extends Editor_14.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_19.Textbox();
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getVariableFromObject(ob);
            if (value.startsWith("this."))
                value = value.substring(5);
            if (value.startsWith("me."))
                value = value.substring(3);
            /*            var value=this.propertyEditor.getPropertyValue(this.property);
                        if(value!==undefined&&value.startsWith("\"")&&value.endsWith("\"")&&this.property.type==="string"){
                            value=value.substring(1,value.length-1);
                        }*/
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var old = this.propertyEditor.getVariableFromObject(this._ob);
            this.propertyEditor.renameVariableInCode(old, this.component.value);
            this.propertyEditor.renameVariableInDesign(old, this.component.value);
            var varname = this.component.value;
            if (old !== undefined && old.startsWith("me."))
                varname = "me." + varname;
            if (old !== undefined && old.startsWith("this."))
                varname = "this." + varname;
            this.propertyEditor.variablename = varname;
            /*  var val=this.component.value;
              if(this.property.type==="string")
                  val="\""+val+"\"";
              this.propertyEditor.setPropertyInCode(this.property.name,val);
              this.propertyEditor.setPropertyInDesign(this.property.name,val);
              super.callEvent("edit",param);*/
        }
    };
    NameEditor = __decorate([
        Editor_14.$PropertyEditor(["*name*"]),
        Jassi_84.$Class("jassi.ui.PropertyEditors.NameEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], NameEditor);
    exports.NameEditor = NameEditor;
});
define("jassi/ui/converters/DefaultConverter", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry", "jassi/ui/Property"], function (require, exports, Jassi_85, Registry_23, Property_33) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultConverter = exports.$Converter = exports.$ConverterProperties = void 0;
    class $ConverterProperties {
    }
    exports.$ConverterProperties = $ConverterProperties;
    function $Converter(param) {
        return function (pclass) {
            Registry_23.default.register("$Converter", pclass, param);
        };
    }
    exports.$Converter = $Converter;
    let DefaultConverterProperties = class DefaultConverterProperties {
        stringToObject() {
        }
    };
    __decorate([
        Property_33.$Property({ default: "function(ob){}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DefaultConverterProperties.prototype, "stringToObject", null);
    DefaultConverterProperties = __decorate([
        Jassi_85.$Class("jassi.ui.converters.DefaultConverterProperties")
    ], DefaultConverterProperties);
    let DefaultConverter = 
    //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
    class DefaultConverter {
        constructor() {
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            return str;
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            return obj.ToString();
        }
    };
    DefaultConverter = __decorate([
        $Converter({ name: "custom" }),
        Jassi_85.$Class("jassi.ui.converters.DefaultConverter"),
        Property_33.$Property({ name: "new", type: "json", componentType: "jassi.ui.converters.DefaultConverterProperties" })
        //@$Property({ name: "new/stringToObject", type: "function", default: "function(ob){}" })
        ,
        __metadata("design:paramtypes", [])
    ], DefaultConverter);
    exports.DefaultConverter = DefaultConverter;
});
define("jassi/ui/converters/NumberConverter", ["require", "exports", "jassi/ui/converters/DefaultConverter", "jassi/remote/Jassi", "jassi/ui/Property"], function (require, exports, DefaultConverter_2, Jassi_86, Property_34) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NumberConverter = void 0;
    let NumberConverter = 
    //@$Property({name:"new/min",type:"number",default:undefined})
    //@$Property({name:"new/max",type:"number",default:undefined})
    class NumberConverter extends DefaultConverter_2.DefaultConverter {
        constructor(param = {}) {
            super();
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            if (str === undefined || str === "")
                return undefined;
            return Number(str);
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            if (obj === undefined)
                return undefined;
            return obj.ToString();
        }
    };
    NumberConverter = __decorate([
        DefaultConverter_2.$Converter({ name: "number" }),
        Jassi_86.$Class("jassi.ui.converters.NumberConverter"),
        Property_34.$Property({ name: "new", type: "json" })
        //@$Property({name:"new/min",type:"number",default:undefined})
        //@$Property({name:"new/max",type:"number",default:undefined})
        ,
        __metadata("design:paramtypes", [Object])
    ], NumberConverter);
    exports.NumberConverter = NumberConverter;
});
define("jassi/ui/converters/StringConverter", ["require", "exports", "jassi/ui/converters/DefaultConverter", "jassi/remote/Jassi", "jassi/ui/Property"], function (require, exports, DefaultConverter_3, Jassi_87, Property_35) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StringConverter = void 0;
    let StringConverter = 
    //@$Property({ name: "new/minChars", type: "number", default: undefined })
    //@$Property({ name: "new/maxChars", type: "number", default: undefined })
    class StringConverter extends DefaultConverter_3.DefaultConverter {
        constructor() {
            super();
        }
        /**
         * converts a string to the object
         * an error can be thrown for validation
         * @param {string} str - the string to convert
         */
        stringToObject(str) {
            return str;
        }
        /**
         * converts an object to string
         * @param {string} obj - the object to convert
         */
        objectToString(obj) {
            return obj.ToString();
        }
    };
    StringConverter = __decorate([
        DefaultConverter_3.$Converter({ name: "string" }),
        Jassi_87.$Class("jassi.ui.converters.StringConverter"),
        Property_35.$Property({ name: "new", type: "json" })
        //@$Property({ name: "new/minChars", type: "number", default: undefined })
        //@$Property({ name: "new/maxChars", type: "number", default: undefined })
        ,
        __metadata("design:paramtypes", [])
    ], StringConverter);
    exports.StringConverter = StringConverter;
});
define("jassi/util/CSVImport", ["require", "exports", "jassi/ui/Upload", "jassi/ui/Button", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "jassi/ui/BoxPanel", "jassi/ui/Select", "jassi/ui/Table", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ext/papaparse", "jassi/remote/Database", "jassi/remote/Registry", "jassi/remote/Classes", "jassi/remote/DBObject", "jassi/base/Actions", "jassi/base/Router", "jassi/remote/Server", "jassi/remote/Transaction"], function (require, exports, Upload_1, Button_12, NumberConverter_2, Textbox_20, BoxPanel_8, Select_7, Table_5, Jassi_88, Panel_22, papaparse_1, Database_2, Registry_24, Classes_28, DBObject_7, Actions_14, Router_7, Server_4, Transaction_1) {
    "use strict";
    var CSVImport_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CSVImport = void 0;
    let CSVImport = CSVImport_1 = class CSVImport extends Panel_22.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async showDialog() {
            Router_7.router.navigate("#do=jassi.util.CSVImport");
        }
        async initTableHeaders() {
            var _this = this;
            var html = "<option></option>";
            var meta = Database_2.db.getMetadata(await Classes_28.classes.loadClass(this.me.select.value));
            var lkeys = [];
            for (var key in meta) {
                if (key === "this")
                    continue;
                html = html + '<option value="' + key.toLowerCase() + '">' + key.toLowerCase() + '</option>';
                lkeys.push(key.toLowerCase());
            }
            for (var x = 0; x < this.fieldCount; x++) {
                var el = $("#" + this._id + "--" + x)[0];
                el.innerHTML = html;
                var pos = lkeys.indexOf(this.data[0]["Column " + x].toLowerCase());
                //assign dettected fields in first row
                if (pos !== -1) {
                    $("#" + this._id + "--" + x).val(lkeys[pos]);
                }
            }
            //this.me.table.
        }
        async initClasses() {
            var cls = [];
            var _this = this;
            await Registry_24.default.loadAllFilesForService("$DBObject");
            var data = Registry_24.default.getData("$DBObject");
            data.forEach((entr) => {
                cls.push(Classes_28.classes.getClassName(entr.oclass));
            });
            this.me.select.items = cls;
            //debug
        }
        readData(csvdata) {
            var csvdata = papaparse_1.Papa.parse(csvdata, { skipEmptyLines: true }).data;
            var len = csvdata[0].length;
            this.data = [];
            //convert [{1:hallo",2:"Du"}]
            for (var z = 0; z < csvdata.length; z++) {
                var ob = {};
                for (var x = 0; x < len; x++) {
                    ob["Column " + x] = csvdata[z][x];
                }
                this.data.push(ob);
            }
        }
        updateTable() {
            let _this = this;
            this.fieldCount = 0;
            for (var key in this.data[0]) {
                this.fieldCount++;
            }
            this.initClasses();
            var cols = [];
            var formatter = function (cell, formatterParams, onRendered) {
                return '<select name="pets" id="' + _this._id + "--" + formatterParams.max + '"><option>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option></select';
            };
            for (var x = 0; x < this.fieldCount; x++) {
                cols.push({
                    headerSort: false,
                    title: "Column " + x,
                    field: "Column " + x,
                    titleFormatter: formatter,
                    titleFormatterParams: { max: x }
                });
            }
            this.me.table.columns = cols;
            this.me.table.items = this.data;
        }
        layout(me) {
            me.boxpanel1 = new BoxPanel_8.BoxPanel();
            me.fromLine = new Textbox_20.Textbox();
            me.next = new Button_12.Button();
            me.upload = new Upload_1.Upload();
            var _this = this;
            this.me.table = new Table_5.Table({
                autoColumns: false
            });
            me.select = new Select_7.Select();
            me.table.width = 500;
            me.table.height = "200";
            me.fromLine.value = 2;
            this.add(me.upload);
            this.add(me.boxpanel1);
            this.add(me.table);
            this.add(me.next);
            me.select.label = "DB-Class";
            me.select.width = 235;
            me.select.onchange(function (event) {
                _this.initTableHeaders();
            });
            me.select.height = 30;
            me.boxpanel1.width = 195;
            me.boxpanel1.horizontal = false;
            me.boxpanel1.add(me.fromLine);
            me.boxpanel1.add(me.select);
            me.fromLine.label = "start from line";
            me.fromLine.width = "80";
            me.fromLine.converter = new NumberConverter_2.NumberConverter();
            me.next.text = "Import";
            me.next.onclick(function (event) {
                _this.doimport().then((prot) => {
                    alert(prot);
                    console.log(prot);
                });
            });
            me.upload.onuploaded(function (fdata) {
                for (var key in fdata) {
                    _this.readData(fdata[key]);
                    _this.updateTable();
                }
            });
        }
        /**
         * imports a csv-file into database
         * @param urlcsv - the link to the csv which we import
         * @param dbclass
         * @param fieldmapping - e.g. {"id":"CUSTOMERID"} if the field id is in csv-column CUSTOMERID or {"id":1} if the field id is in column 1
         * @param replace - replace text e.g. {"für":"fuer"}
         * returns the message if succeeded
         */
        static async startImport(urlcsv, dbclass, fieldmapping = undefined, replace = undefined) {
            var imp = new CSVImport_1();
            var mapping = {};
            let ret = await new Server_4.Server().loadFile(urlcsv);
            if (replace) {
                for (let key in replace) {
                    ret = ret.replaceAll(key, replace[key]);
                }
            }
            imp.readData(ret);
            var _meta = Database_2.db.getMetadata(await Classes_28.classes.loadClass(dbclass));
            var meta = {};
            for (let k in _meta) {
                meta[k.toLowerCase()] = k;
            }
            var lkeys = [];
            var fieldids = {};
            for (var field in imp.data[0]) { //fieldnames
                //let field=imp.data[0][x];
                var x = Number(field.replace("Column ", ""));
                var fieldname = imp.data[0][field];
                fieldids[fieldname.toLowerCase()] = x;
                if (meta[fieldname.toLowerCase()]) {
                    mapping[fieldname.toLowerCase()] = x;
                }
            }
            if (fieldmapping) {
                for (var key in fieldmapping) {
                    let val = fieldmapping[key];
                    if (Number.isInteger(val)) {
                        mapping[key] = Number(val) - 1;
                    }
                    else {
                        if (fieldids[val.toLowerCase()] !== undefined)
                            mapping[key] = fieldids[val.toLowerCase()];
                    }
                }
            }
            /*		for (var key in meta) {
                        if (key === "this")
                            continue;
                        html = html + '<option value="' + key.toLowerCase() + '">' + key.toLowerCase() + '</option>';
                        lkeys.push(key.toLowerCase());
                    }*/
            return await imp._doimport(imp.data, dbclass, 2, mapping);
        }
        async doimport() {
            //read userchoices
            var assignedfields = {};
            for (var x = 0; x < this.fieldCount; x++) {
                var value = $("#" + this._id + "--" + x).val();
                if (value !== "")
                    assignedfields[value] = x;
            }
            return await this._doimport(this.data, this.me.select.value, this.me.fromLine.value, assignedfields);
        }
        async _doimport(data, dbclass, fromLine, assignedfields) {
            var Type = Classes_28.classes.getClass(dbclass);
            //read objects so we can read from cache
            let nil = await Type["find"]();
            var meta = Database_2.db.getMetadata(await Classes_28.classes.loadClass(dbclass));
            var members = Registry_24.default.getMemberData("design:type")[dbclass];
            var allObjects = [];
            var from = fromLine;
            for (var x = from - 1; x < data.length; x++) {
                var satz = data[x];
                var ob = new Type();
                for (var fname in meta) {
                    let pos = assignedfields[fname.toLowerCase()];
                    if (pos !== undefined) {
                        let val = satz["Column " + pos];
                        var mtype = members[fname];
                        if (mtype !== undefined) {
                            var mt = mtype[0][0];
                            if (mt === Number)
                                val = Number(val.replaceAll(",", "."));
                            if (mt === Boolean) {
                                val = (val === "true" || val === true || val === 1 || val === "1");
                            }
                            if (val === "#NV")
                                val = undefined;
                        }
                        if ((meta[fname].OneToOne || meta[fname].ManyToOne) && val !== undefined) {
                            val = { id: val };
                        }
                        ob[fname] = val;
                    }
                }
                var exists = DBObject_7.DBObject.getFromCache(dbclass, ob.id);
                if (exists) {
                    Object.assign(exists, ob);
                    allObjects.push(exists);
                }
                else
                    allObjects.push(ob);
            }
            var ret = [];
            var trans = new Transaction_1.Transaction();
            for (var x = 0; x < allObjects.length; x++) {
                var obs = allObjects[x];
                trans.add(obs, obs.save);
            }
            await trans.execute();
            return "imported " + allObjects.length + " objects";
        }
    };
    __decorate([
        Actions_14.$Action({ name: "Administration/Database CSV-Import", icon: "mdi mdi-database-import" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], CSVImport, "showDialog", null);
    CSVImport = CSVImport_1 = __decorate([
        Actions_14.$ActionProvider("jassi.base.ActionNode"),
        Jassi_88.$Class("jassi.util.CSVImport"),
        __metadata("design:paramtypes", [])
    ], CSVImport);
    exports.CSVImport = CSVImport;
    async function test() {
        var csv = `id,testid,companyname,contactname,contacttitle,address,city,region,postalcode,country,phone,fax
ALFKI,1,Alfreds Futterkiste,Maria Anders,Sales Representative,Obere Str. 57,Berlin,#NV,12209,Germany,030-0074321,030-0076545
ANATR,2,Ana Trujillo Emparedados y helados,Ana Trujillo,Owner,Avda. de la Constitución 2222,México D.F.,#NV,05021,Mexico,(5) 555-4729,(5) 555-3745
ANTON,3,Antonio Moreno Taquería,Antonio Moreno,Owner,Mataderos  2312,México D.F.,#NV,05023,Mexico,(5) 555-3932,#NV
AROUT,4,Around the Horn,Thomas Hardy,Sales Representative,120 Hanover Sq.,London,#NV,WA1 1DP,UK,(171) 555-7788,(171) 555-6750
BERGS,5,Berglunds snabbköp,Christina Berglund,Order Administrator,Berguvsvägen  8,Luleå,#NV,S-958 22,Sweden,0921-12 34 65,0921-12 34 67
BLAUS,6,Blauer See Delikatessen,Hanna Moos,Sales Representative,Forsterstr. 57,Mannheim,#NV,68306,Germany,0621-08460,0621-08924
BLONP,7,Blondesddsl père et fils,Frédérique Citeaux,Marketing Manager,"24, place Kléber",Strasbourg,#NV,67000,France,88.60.15.31,88.60.15.32
BOLID,8,Bólido Comidas preparadas,Martín Sommer,Owner,"C/ Araquil, 67",Madrid,#NV,28023,Spain,(91) 555 22 82,(91) 555 91 99
BONAP,9,Bon app',Laurence Lebihan,Owner,"12, rue des Bouchers",Marseille,#NV,13008,France,91.24.45.40,91.24.45.41
BOTTM,10,Bottom-Dollar Markets,Elizabeth Lincoln,Accounting Manager,23 Tsawassen Blvd.,Tsawassen,BC,T2F 8M4,Canada,(604) 555-4729,(604) 555-3745
BSBEV,11,B's Beverages,Victoria Ashworth,Sales Representative,Fauntleroy Circus,London,#NV,EC2 5NT,UK,(171) 555-1212,#NV
CACTU,12,Cactus Comidas para llevar,Patricio Simpson,Sales Agent,Cerrito 333,Buenos Aires,#NV,1010,Argentina,(1) 135-5555,(1) 135-4892
CENTC,13,Centro comercial Moctezuma,Francisco Chang,Marketing Manager,Sierras de Granada 9993,México D.F.,#NV,05022,Mexico,(5) 555-3392,(5) 555-7293
CHOPS,14,Chop-suey Chinese,Yang Wang,Owner,Hauptstr. 29,Bern,#NV,3012,Switzerland,0452-076545,#NV
COMMI,15,Comércio Mineiro,Pedro Afonso,Sales Associate,"Av. dos Lusíadas, 23",Sao Paulo,SP,05432-043,Brazil,(11) 555-7647,#NV
CONSH,16,Consolidated Holdings,Elizabeth Brown,Sales Representative,Berkeley Gardens 12  Brewery,London,#NV,WX1 6LT,UK,(171) 555-2282,(171) 555-9199
DRACD,17,Drachenblut Delikatessen,Sven Ottlieb,Order Administrator,Walserweg 21,Aachen,#NV,52066,Germany,0241-039123,0241-059428
DUMON,18,Du monde entier,Janine Labrune,Owner,"67, rue des Cinquante Otages",Nantes,#NV,44000,France,40.67.88.88,40.67.89.89
EASTC,19,Eastern Connection,Ann Devon,Sales Agent,35 King George,London,#NV,WX3 6FW,UK,(171) 555-0297,(171) 555-3373
ERNSH,20,Ernst Handel,Roland Mendel,Sales Manager,Kirchgasse 6,Graz,#NV,8010,Austria,7675-3425,7675-3426
FAMIA,21,Familia Arquibaldo,Aria Cruz,Marketing Assistant,"Rua Orós, 92",Sao Paulo,SP,05442-030,Brazil,(11) 555-9857,#NV
FISSA,22,FISSA Fabrica Inter. Salchichas S.A.,Diego Roel,Accounting Manager,"C/ Moralzarzal, 86",Madrid,#NV,28034,Spain,(91) 555 94 44,(91) 555 55 93
FOLIG,23,Folies gourmandes,Martine Rancé,Assistant Sales Agent,"184, chaussée de Tournai",Lille,#NV,59000,France,20.16.10.16,20.16.10.17
FOLKO,24,Folk och fä HB,Maria Larsson,Owner,Åkergatan 24,Bräcke,#NV,S-844 67,Sweden,0695-34 67 21,#NV
FRANK,25,Frankenversand,Peter Franken,Marketing Manager,Berliner Platz 43,München,#NV,80805,Germany,089-0877310,089-0877451
FRANR,26,France restauration,Carine Schmitt,Marketing Manager,"54, rue Royale",Nantes,#NV,44000,France,40.32.21.21,40.32.21.20
FRANS,27,Franchi S.p.A.,Paolo Accorti,Sales Representative,Via Monte Bianco 34,Torino,#NV,10100,Italy,011-4988260,011-4988261
FURIB,28,Furia Bacalhau e Frutos do Mar,Lino Rodriguez,Sales Manager,Jardim das rosas n. 32,Lisboa,#NV,1675,Portugal,(1) 354-2534,(1) 354-2535
GALED,29,Galería del gastrónomo,Eduardo Saavedra,Marketing Manager,"Rambla de Cataluña, 23",Barcelona,#NV,08022,Spain,(93) 203 4560,(93) 203 4561
GODOS,30,Godos Cocina Típica,José Pedro Freyre,Sales Manager,"C/ Romero, 33",Sevilla,#NV,41101,Spain,(95) 555 82 82,#NV
GOURL,31,Gourmet Lanchonetes,André Fonseca,Sales Associate,"Av. Brasil, 442",Campinas,SP,04876-786,Brazil,(11) 555-9482,#NV
GREAL,32,Great Lakes Food Market,Howard Snyder,Marketing Manager,2732 Baker Blvd.,Eugene,OR,97403,USA,(503) 555-7555,#NV
GROSR,33,GROSELLA-Restaurante,Manuel Pereira,Owner,5ª Ave. Los Palos Grandes,Caracas,DF,1081,Venezuela,(2) 283-2951,(2) 283-3397
HANAR,34,Hanari Carnes,Mario Pontes,Accounting Manager,"Rua do Paço, 67",Rio de Janeiro,RJ,05454-876,Brazil,(21) 555-0091,(21) 555-8765
HILAA,35,HILARION-Abastos,Carlos Hernández,Sales Representative,Carrera 22 con Ave. Carlos Soublette #8-35,San Cristóbal,Táchira,5022,Venezuela,(5) 555-1340,(5) 555-1948
HUNGC,36,Hungry Coyote Import Store,Yoshi Latimer,Sales Representative,City Center Plaza 516 Main St.,Elgin,OR,97827,USA,(503) 555-6874,(503) 555-2376
HUNGO,37,Hungry Owl All-Night Grocers,Patricia McKenna,Sales Associate,8 Johnstown Road,Cork,Co. Cork,#NV,Ireland,2967 542,2967 3333
ISLAT,38,Island Trading,Helen Bennett,Marketing Manager,Garden House Crowther Way,Cowes,Isle of Wight,PO31 7PJ,UK,(198) 555-8888,#NV
KOENE,39,Königlich Essen,Philip Cramer,Sales Associate,Maubelstr. 90,Brandenburg,#NV,14776,Germany,0555-09876,#NV
LACOR,40,La corne d'abondance,Daniel Tonini,Sales Representative,"67, avenue de l'Europe",Versailles,#NV,78000,France,30.59.84.10,30.59.85.11
LAMAI,41,La maison d'Asie,Annette Roulet,Sales Manager,1 rue Alsace-Lorraine,Toulouse,#NV,31000,France,61.77.61.10,61.77.61.11
LAUGB,42,Laughing Bacchus Wine Cellars,Yoshi Tannamuri,Marketing Assistant,1900 Oak St.,Vancouver,BC,V3F 2K1,Canada,(604) 555-3392,(604) 555-7293
LAZYK,43,Lazy K Kountry Store,John Steel,Marketing Manager,12 Orchestra Terrace,Walla Walla,WA,99362,USA,(509) 555-7969,(509) 555-6221
LEHMS,44,Lehmanns Marktstand,Renate Messner,Sales Representative,Magazinweg 7,Frankfurt a.M.,#NV,60528,Germany,069-0245984,069-0245874
LETSS,45,Let's Stop N Shop,Jaime Yorres,Owner,87 Polk St. Suite 5,San Francisco,CA,94117,USA,(415) 555-5938,#NV
LILAS,46,LILA-Supermercado,Carlos González,Accounting Manager,Carrera 52 con Ave. Bolívar #65-98 Llano Largo,Barquisimeto,Lara,3508,Venezuela,(9) 331-6954,(9) 331-7256
LINOD,47,LINO-Delicateses,Felipe Izquierdo,Owner,Ave. 5 de Mayo Porlamar,I. de Margarita,Nueva Esparta,4980,Venezuela,(8) 34-56-12,(8) 34-93-93
LONEP,48,Lonesome Pine Restaurant,Fran Wilson,Sales Manager,89 Chiaroscuro Rd.,Portland,OR,97219,USA,(503) 555-9573,(503) 555-9646
MAGAA,49,Magazzini Alimentari Riuniti,Giovanni Rovelli,Marketing Manager,Via Ludovico il Moro 22,Bergamo,#NV,24100,Italy,035-640230,035-640231
MAISD,50,Maison Dewey,Catherine Dewey,Sales Agent,Rue Joseph-Bens 532,Bruxelles,#NV,B-1180,Belgium,(02) 201 24 67,(02) 201 24 68
MEREP,51,Mère Paillarde,Jean Fresnière,Marketing Assistant,43 rue St. Laurent,Montréal,Québec,H1J 1C3,Canada,(514) 555-8054,(514) 555-8055
MORGK,52,Morgenstern Gesundkost,Alexander Feuer,Marketing Assistant,Heerstr. 22,Leipzig,#NV,04179,Germany,0342-023176,#NV
NORTS,53,North/South,Simon Crowther,Sales Associate,South House 300 Queensbridge,London,#NV,SW7 1RZ,UK,(171) 555-7733,(171) 555-2530
OCEAN,54,Océano Atlántico Ltda.,Yvonne Moncada,Sales Agent,Ing. Gustavo Moncada 8585 Piso 20-A,Buenos Aires,#NV,1010,Argentina,(1) 135-5333,(1) 135-5535
OLDWO,55,Old World Delicatessen,Rene Phillips,Sales Representative,2743 Bering St.,Anchorage,AK,99508,USA,(907) 555-7584,(907) 555-2880
OTTIK,56,Ottilies Käseladen,Henriette Pfalzheim,Owner,Mehrheimerstr. 369,Köln,#NV,50739,Germany,0221-0644327,0221-0765721
PARIS,57,Paris spécialités,Marie Bertrand,Owner,"265, boulevard Charonne",Paris,#NV,75012,France,(1) 42.34.22.66,(1) 42.34.22.77
PERIC,58,Pericles Comidas clásicas,Guillermo Fernández,Sales Representative,Calle Dr. Jorge Cash 321,México D.F.,#NV,05033,Mexico,(5) 552-3745,(5) 545-3745
PICCO,59,Piccolo und mehr,Georg Pipps,Sales Manager,Geislweg 14,Salzburg,#NV,5020,Austria,6562-9722,6562-9723
PRINI,60,Princesa Isabel Vinhos,Isabel de Castro,Sales Representative,Estrada da saúde n. 58,Lisboa,#NV,1756,Portugal,(1) 356-5634,#NV
QUEDE,61,Que Delícia,Bernardo Batista,Accounting Manager,"Rua da Panificadora, 12",Rio de Janeiro,RJ,02389-673,Brazil,(21) 555-4252,(21) 555-4545
QUEEN,62,Queen Cozinha,Lúcia Carvalho,Marketing Assistant,"Alameda dos Canàrios, 891",Sao Paulo,SP,05487-020,Brazil,(11) 555-1189,#NV
QUICK,63,QUICK-Stop,Horst Kloss,Accounting Manager,Taucherstraße 10,Cunewalde,#NV,01307,Germany,0372-035188,#NV
RANCH,64,Rancho grande,Sergio Gutiérrez,Sales Representative,Av. del Libertador 900,Buenos Aires,#NV,1010,Argentina,(1) 123-5555,(1) 123-5556
RATTC,65,Rattlesnake Canyon Grocery,Paula Wilson,Assistant Sales Representative,2817 Milton Dr.,Albuquerque,NM,87110,USA,(505) 555-5939,(505) 555-3620
REGGC,66,Reggiani Caseifici,Maurizio Moroni,Sales Associate,Strada Provinciale 124,Reggio Emilia,#NV,42100,Italy,0522-556721,0522-556722
RICAR,67,Ricardo Adocicados,Janete Limeira,Assistant Sales Agent,"Av. Copacabana, 267",Rio de Janeiro,RJ,02389-890,Brazil,(21) 555-3412,#NV
RICSU,68,Richter Supermarkt,Michael Holz,Sales Manager,Grenzacherweg 237,Genève,#NV,1203,Switzerland,0897-034214,#NV
ROMEY,69,Romero y tomillo,Alejandra Camino,Accounting Manager,"Gran Vía, 1",Madrid,#NV,28001,Spain,(91) 745 6200,(91) 745 6210
SANTG,70,Santé Gourmet,Jonas Bergulfsen,Owner,Erling Skakkes gate 78,Stavern,#NV,4110,Norway,07-98 92 35,07-98 92 47
SAVEA,71,Save-a-lot Markets,Jose Pavarotti,Sales Representative,187 Suffolk Ln.,Boise,ID,83720,USA,(208) 555-8097,#NV
SEVES,72,Seven Seas Imports,Hari Kumar,Sales Manager,90 Wadhurst Rd.,London,#NV,OX15 4NB,UK,(171) 555-1717,(171) 555-5646
SIMOB,73,Simons bistro,Jytte Petersen,Owner,Vinbæltet 34,Kobenhavn,#NV,1734,Denmark,31 12 34 56,31 13 35 57
SPECD,74,Spécialités du monde,Dominique Perrier,Marketing Manager,"25, rue Lauriston",Paris,#NV,75016,France,(1) 47.55.60.10,(1) 47.55.60.20
SPLIR,75,Split Rail Beer & Ale,Art Braunschweiger,Sales Manager,P.O. Box 555,Lander,WY,82520,USA,(307) 555-4680,(307) 555-6525
SUPRD,76,Suprêmes délices,Pascale Cartrain,Accounting Manager,"Boulevard Tirou, 255",Charleroi,#NV,B-6000,Belgium,(071) 23 67 22 20,(071) 23 67 22 21
THEBI,77,The Big Cheese,Liz Nixon,Marketing Manager,89 Jefferson Way Suite 2,Portland,OR,97201,USA,(503) 555-3612,#NV
THECR,78,The Cracker Box,Liu Wong,Marketing Assistant,55 Grizzly Peak Rd.,Butte,MT,59801,USA,(406) 555-5834,(406) 555-8083
TOMSP,79,Toms Spezialitäten,Karin Josephs,Marketing Manager,Luisenstr. 48,Münster,#NV,44087,Germany,0251-031259,0251-035695
TORTU,80,Tortuga Restaurante,Miguel Angel Paolino,Owner,Avda. Azteca 123,México D.F.,#NV,05033,Mexico,(5) 555-2933,#NV
TRADH,81,Tradição Hipermercados,Anabela Domingues,Sales Representative,"Av. Inês de Castro, 414",Sao Paulo,SP,05634-030,Brazil,(11) 555-2167,(11) 555-2168
TRAIH,82,Trail's Head Gourmet Provisioners,Helvetius Nagy,Sales Associate,722 DaVinci Blvd.,Kirkland,WA,98034,USA,(206) 555-8257,(206) 555-2174
VAFFE,83,Vaffeljernet,Palle Ibsen,Sales Manager,Smagsloget 45,Århus,#NV,8200,Denmark,86 21 32 43,86 22 33 44
VICTE,84,Victuailles en stock,Mary Saveley,Sales Agent,"2, rue du Commerce",Lyon,#NV,69004,France,78.32.54.86,78.32.54.87
VINET,85,Vins et alcools Chevalier,Paul Henriot,Accounting Manager,59 rue de l'Abbaye,Reims,#NV,51100,France,26.47.15.10,26.47.15.11
WANDK,86,Die Wandernde Kuh,Rita Müller,Sales Representative,Adenauerallee 900,Stuttgart,#NV,70563,Germany,0711-020361,0711-035428
WARTH,87,Wartian Herkku,Pirkko Koskitalo,Accounting Manager,Torikatu 38,Oulu,#NV,90110,Finland,981-443655,981-443655
WELLI,88,Wellington Importadora,Paula Parente,Sales Manager,"Rua do Mercado, 12",Resende,SP,08737-363,Brazil,(14) 555-8122,#NV
WHITC,89,White Clover Markets,Karl Jablonski,Owner,305 - 14th Ave. S. Suite 3B,Seattle,WA,98128,USA,(206) 555-4112,(206) 555-4115
WILMK,90,Wilman Kala,Matti Karttunen,Owner/Marketing Assistant,Keskuskatu 45,Helsinki,#NV,21240,Finland,90-224 8858,90-224 8858
WOLZA,91,Wolski  Zajazd,Zbyszek Piestrzeniewicz,Owner,ul. Filtrowa 68,Warszawa,#NV,01-012,Poland,(26) 642-7012,(26) 642-7012
`;
        var s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/products.csv", "northwind.Products", { "id": "productid", "supplier": "supplierid", "category": "categoryid" });
        //	var s = await CSVImport.startImport("https://uwei.github.io/jassijs/client/northwind/import/employees.csv", "northwind.Employees",
        //		{ "id": "EmployeeID" });
        console.log(s);
        /*	var t = await classes.loadClass("northwind.Customer");
            var ret = new CSVImport();
            ret.readData(csv);
            ret.updateTable();
        
            return ret;*/
    }
    exports.test = test;
});
define("jassi/util/Cookies", ["require", "exports", "jassi/ext/js-cookie"], function (require, exports, js_cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cookies = void 0;
    class C {
        set(name, value, params = undefined) {
        }
        get(name) {
        }
        remove(name, params = undefined) {
        } // removed!
    }
    var Cookies = js_cookie_1.default;
    exports.Cookies = Cookies;
});
define("jassi/util/DatabaseSchema", ["require", "exports", "jassi/remote/Database", "jassi/remote/Classes"], function (require, exports, Database_3, Classes_29) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ManyToMany = exports.ManyToOne = exports.OneToMany = exports.OneToOne = exports.PrimaryColumn = exports.Column = exports.JoinTable = exports.JoinColumn = exports.PrimaryGeneratedColumn = exports.Entity = void 0;
    //define Decoraters for typeorm
    let cache = {};
    function addDecorater(decoratername, ...args) {
        return function (...fargs) {
            var con = fargs.length === 1 ? fargs[0] : fargs[0].constructor;
            var clname = Classes_29.classes.getClassName(con);
            var field = fargs.length == 1 ? "this" : fargs[1];
            Database_3.db._setMetadata(con, field, decoratername, args, fargs, undefined);
        };
    }
    function Entity(...param) {
        return addDecorater("Entity", param);
    }
    exports.Entity = Entity;
    function PrimaryGeneratedColumn(...param) {
        return addDecorater("PrimaryGeneratedColumn", param);
    }
    exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
    function JoinColumn(...param) {
        return addDecorater("JoinColumn", param);
    }
    exports.JoinColumn = JoinColumn;
    function JoinTable(...param) {
        return addDecorater("JoinTable", param);
    }
    exports.JoinTable = JoinTable;
    function Column(...any) {
        return addDecorater("Column", any);
    }
    exports.Column = Column;
    function PrimaryColumn(...any) {
        return addDecorater("PrimaryColumn", any);
    }
    exports.PrimaryColumn = PrimaryColumn;
    function OneToOne(...any) {
        return addDecorater("OneToOne", any);
    }
    exports.OneToOne = OneToOne;
    function OneToMany(...any) {
        return addDecorater("OneToMany", any);
    }
    exports.OneToMany = OneToMany;
    function ManyToOne(...any) {
        return addDecorater("ManyToOne", any);
    }
    exports.ManyToOne = ManyToOne;
    function ManyToMany(...any) {
        return addDecorater("ManyToMany", any);
    }
    exports.ManyToMany = ManyToMany;
});
define("jassi/util/Reloader", ["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry"], function (require, exports, Jassi_89, Registry_25) {
    "use strict";
    var Reloader_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Reloader = void 0;
    let Reloader = Reloader_1 = class Reloader {
        /**
         * reloads Code
         */
        constructor() {
            this.listener = [];
        }
        /**
         * check code changes out of the browser if localhost and load the changes in to the browser
         */
        static startReloadCodeFromServer() {
            if (Reloader_1.reloadCodeFromServerIsRunning)
                return;
            if (window.location.hostname !== "localhost") {
                return;
            }
            var h = { date: 0, files: [] };
            var f = async function () {
                Jassi_89.default.server.call("checkDir", h.date).then(function (t) {
                    h = JSON.parse(t);
                    var len = h.files.length;
                    if (len > 3)
                        len = 1;
                    for (var x = 0; x < len; x++) {
                        var file = h.files[x];
                        new Reloader_1().reloadJS(file);
                        $.notify(file + " reloaded", "info", { position: "bottom right" });
                    }
                    window.setTimeout(f, 100000);
                });
            };
            window.setTimeout(f, 100000);
        }
        /**
         * listener for code reloaded
         * @param {function} func - callfunction for the event
         */
        addEventCodeReloaded(func) {
            this.listener.push(func);
        }
        removeEventCodeReloaded(func) {
            var pos = this.listener.indexOf(func);
            if (pos !== -1) {
                this.listener.splice(pos, 1);
            }
        }
        _findScript(name) {
            var scripts = $('script');
            for (var x = 0; x < scripts.length; x++) {
                var attr = scripts[x].getAttributeNode("src");
                if (attr !== null && attr !== undefined && attr.value === (name + ".js")) { //?bust="+window.jassiversion
                    return scripts[x];
                }
            }
            return undefined;
        }
        async reloadJS(fileName) {
            await this.reloadJSAll([fileName]);
        }
        async reloadJSAll(fileNames) {
            //classname->file
            var files = {};
            let allModules = {};
            var allfiles = [];
            for (let ff = 0; ff < fileNames.length; ff++) {
                var fileName = fileNames[ff];
                var fileNameBlank = fileName;
                if (fileNameBlank.endsWith(".js"))
                    fileNameBlank = fileNameBlank.substring(0, fileNameBlank.length - 3);
                var test = this._findScript(fileNameBlank);
                //de.Kunde statt de/kunde
                if (test !== undefined) {
                    var attr = test.getAttributeNode("data-requiremodule");
                    if (attr !== null) {
                        fileNameBlank = attr.value;
                    }
                }
                //load all classes which are in the same filename
                var allclasses = await Registry_25.default.getJSONData("$Class");
                var classesInFile = [];
                for (var x = 0; x < allclasses.length; x++) {
                    var pclass = allclasses[x];
                    if (pclass.filename === fileName) {
                        classesInFile.push(pclass.filename);
                    }
                }
                //collect all classes which depends on the class
                var family = {};
                for (var x = 0; x < classesInFile.length; x++) {
                    var classname = classesInFile[x];
                    var check = classes.getClass(classname);
                    if (check === undefined)
                        continue;
                    var classes = classes.getCache();
                    family[classname] = {};
                    for (var key in classes) {
                        if (key === classname)
                            files[key] = allclasses[key][0].file;
                        if (classes[key].prototype instanceof check) {
                            files[key] = allclasses[key][0].file;
                            var tree = [];
                            let test = classes[key].prototype;
                            while (test !== check.prototype) {
                                tree.push(classes.getClassName(test));
                                test = test["__proto__"];
                                //all.push(allclasses[key][0].file);
                            }
                            var cur = family[classname];
                            for (var c = tree.length - 1; c >= 0; c--) {
                                var cl = tree[c];
                                if (cur[cl] === undefined)
                                    cur[cl] = {};
                                cur = cur[cl];
                            }
                            //delete class - its better to get an exception if sonething goes wrong
                            //  classes[key]=undefined;
                            //jassi.classes.removeClass(key);
                        }
                    }
                }
                for (var key in files) {
                    if (files[key].endsWith(".js"))
                        files[key] = files[key].substring(0, files[key].length - 3); //files._self_=fileName;
                    allfiles.push(files[key]);
                }
                if (allfiles.indexOf(fileNameBlank) < 0) {
                    allfiles.push(fileNameBlank);
                }
                //save all modules
            }
            await new Promise((resolve, reject) => {
                require(allfiles, function (...ret) {
                    for (var rx = 0; rx < ret.length; rx++) {
                        allModules[allfiles[rx]] = ret[rx];
                    }
                    resolve(undefined);
                });
            });
            for (let x = 0; x < allfiles.length; x++) {
                requirejs.undef(allfiles[x]);
            }
            //undefined all files
            /*  for (var key in files) {
                  requirejs.undef(files[key]);
              }*/
            // requirejs.undef(fileNameBlank);
            /*  var hasloaded = {};
              var doclass = async function (fam) {
                  for (var key in fam) {
                      var name = fam[key].name;
                      var file = files[key];
                      //console.log("reload "+key+"->"+file);
                      var next = fam[key];
                      var key = key;
                      await new Promise((resolve, reject) => {
                          require([file], function (ret) {
                              _this.migrateModul(allModules, file, ret);
                              resolve(undefined);
                          });
                      });
                      await doclass(next);
                  }
              }
              doclass(family);*/
            var _this = this;
            // console.log("reload " + JSON.stringify(fileNameBlank));
            await new Promise((resolve, reject) => {
                require(allfiles, function (...ret) {
                    async function run() {
                        for (let f = 0; f < allfiles.length; f++) {
                            _this.migrateModul(allModules, allfiles[f], ret[f]);
                        }
                        for (let i = 0; i < _this.listener.length; i++) {
                            await _this.listener[i](allfiles);
                        }
                        ;
                    }
                    run().then(() => {
                        resolve(undefined);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }).catch(err => {
                throw err;
            });
        }
        migrateModul(allModules, file, modul) {
            if (modul === undefined)
                return;
            var old = allModules[file];
            this.migrateClasses(file, old, modul);
            //now migrate loaded modules
            modul.__oldModul = old;
            while (old !== undefined) {
                for (let key in old) {
                    if (key !== "__oldModul") {
                        old[key] = modul[key];
                    }
                }
                old = old.__oldModul;
            }
        }
        migrateClasses(file, oldmodul, modul) {
            if (oldmodul === undefined)
                return;
            for (let key in modul) {
                var newClass = modul[key];
                if (newClass.prototype !== undefined && key !== "__oldModul") {
                    //migrate old Class
                    var meths = Object.getOwnPropertyNames(newClass.prototype);
                    if (Reloader_1.cache[file + "/" + key] === undefined) {
                        Reloader_1.cache[file + "/" + key] = [];
                        Reloader_1.cache[file + "/" + key].push(oldmodul[key]);
                    }
                    for (let c = 0; c < Reloader_1.cache[file + "/" + key].length; c++) {
                        var oldClass = Reloader_1.cache[file + "/" + key][c];
                        if (oldClass !== undefined) {
                            for (var x = 0; x < meths.length; x++) {
                                var m = meths[x];
                                if (m === "constructor" || m === "length" || m === "prototype") {
                                    continue;
                                }
                                var desc = Object.getOwnPropertyDescriptor(newClass.prototype, m);
                                if (desc.value !== undefined) { //function
                                    oldClass.prototype[m] = newClass.prototype[m];
                                }
                                if (desc.get !== undefined || desc.set !== undefined) {
                                    Object.defineProperty(oldClass.prototype, m, desc);
                                }
                            }
                        }
                    }
                    Reloader_1.cache[file + "/" + key].push(newClass);
                }
            }
        }
    };
    Reloader.cache = [];
    Reloader.reloadCodeFromServerIsRunning = false;
    Reloader.instance = new Reloader_1();
    Reloader = Reloader_1 = __decorate([
        Jassi_89.$Class("jassi.util.Reloader"),
        __metadata("design:paramtypes", [])
    ], Reloader);
    exports.Reloader = Reloader;
});
define("jassi/util/Tools", ["require", "exports", "jassi/remote/Jassi", "jassi/ext/lodash"], function (require, exports, Jassi_90, lodash_1) {
    "use strict";
    var Tools_4;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tools = void 0;
    let Tools = Tools_4 = class Tools {
        constructor() {
        }
        static copyObject(src) {
            //var j = Tools.objectToJson(src);
            //return Tools.jsonToObject(j);
            lodash_1.default();
            //@ts-ignore
            return _.cloneDeep(src);
        }
        /**
               * converts a json string to a object
               * @param {string} value - the code
               */
        static jsonToObject(code) {
            //var ret=eval("("+value+")");
            code = "a=" + code;
            var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
            var ret = Tools_4.visitNode2(sourceFile);
            return ret;
        }
        static replaceQuotes(value) {
            if (Array.isArray(value)) {
                for (var x = 0; x < value.length; x++) {
                    if (typeof (value[x]) === "object") {
                        value[x] = this.replaceQuotes(value[x]);
                    }
                }
                return value;
            }
            //if (typeof (value) === "object") {
            var ret = {};
            for (var key in value) {
                var newkey = "$%)" + key + "$%)";
                ret[newkey] = value[key];
                if (typeof value[key] === "object") {
                    ret[newkey] = this.replaceQuotes(ret[newkey]);
                }
            }
            return ret;
            //}
        }
        /**
       * converts a string to a object
       * @param value - the object to stringify
       * @param space - the space before the property
       * @param nameWithQuotes - if true "key":value else key:value
       */
        static objectToJson(value, space = undefined, nameWithQuotes = true) {
            var ovalue = value;
            if (nameWithQuotes === false)
                ovalue = Tools_4.replaceQuotes(Tools_4.copyObject(ovalue));
            var ret = JSON.stringify(ovalue, function (key, value) {
                if (typeof (value) === "function") {
                    let r = value.toString();
                    r = r.replaceAll("\r" + space, "\r");
                    r = r.replaceAll("\n" + space, "\n");
                    r = r.replaceAll("\r", "$§&\r");
                    r = r.replaceAll("\n", "$§&\n");
                    r = r.replaceAll("\t", "$§&\t");
                    r = r.replaceAll('\"', '$§&\"');
                    //  ret=ret.replace("\t\t","");
                    return "$%&" + r + "$%&";
                }
                return value;
            }, "\t");
            if (ret !== undefined) {
                ret = ret.replaceAll("\"$%&", "");
                ret = ret.replaceAll("$%&\"", "");
                //  ret = ret.replaceAll("\\r", "\r");
                //  ret = ret.replaceAll("\\n", "\n");
                //  ret = ret.replaceAll("\\t", "\t");
                //  ret = ret.replaceAll('\\"', '\"');
            }
            if (nameWithQuotes === false) {
                ret = ret.replaceAll("\"$%)", "");
                ret = ret.replaceAll("$%)\"", "");
            }
            ret = ret.replaceAll("$§&\\n", "\n");
            ret = ret.replaceAll("$§&\\r", "\t");
            ret = ret.replaceAll("$§&\\t", "\t");
            ret = ret.replaceAll('$§&\\"', '\"');
            //one to much
            //  ret=ret.substring(0,ret.length-2)+ret.substring(ret.length-1);
            return ret;
        }
        static toText(node, text) {
            return text.substring(node.pos, node.end).trim();
        }
        static getValueFromNode(node, val, prop) {
        }
        static visitObject(node) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                var ret = {};
                for (var i = 0; i < node["properties"].length; i++) {
                    var s = node["properties"][i];
                    var name = s["name"].text;
                    ret[name] = Tools_4.visitObject(s["initializer"]);
                }
                return ret;
            }
            else if (node.kind === ts.SyntaxKind.ArrayLiteralExpression) { //[]
                let ret = [];
                for (let i = 0; i < node["elements"].length; i++) {
                    let ob = this.visitObject(node["elements"][i]);
                    ret.push(ob);
                    /* if (s["initializer"].elements[i].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                         ob[name].push(_newob);
                         Tools.visitNode2(code, s["initializer"].elements[i], _newob);
                     }*/
                }
                return ret;
            }
            else if (node.kind === ts.SyntaxKind.StringLiteral) {
                return node.getText().substring(1, node.getText().length - 1);
            }
            else if (node.kind === ts.SyntaxKind.NumericLiteral) {
                return new Number(node.getText());
            }
            else if (node.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (node.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (node.getText().startsWith("function")) {
                var func = function () {
                    return node.getText();
                };
                func.toString = function () {
                    return node.getText();
                };
                return func;
            }
            else {
                return node.getText();
            }
        }
        static visitNode2(node) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                return Tools_4.visitObject(node);
            }
            else {
                var childs = node.getChildren();
                for (var x = 0; x < childs.length; x++) {
                    var ret = Tools_4.visitNode2(childs[x]);
                    if (ret)
                        return ret;
                }
            }
            return undefined;
        }
        static visitNode(code, node, ob) {
            if (node.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                node["properties"].forEach((s) => {
                    var name = s["name"].text;
                    var val = s["initializer"].getText(); //Tools.toText(s["initializer"], code);
                    if (s["initializer"].kind === ts.SyntaxKind.ObjectLiteralExpression) {
                        ob[name] = {};
                        Tools_4.visitNode(code, s, ob[name]);
                    }
                    else {
                        if (s["initializer"].kind === ts.SyntaxKind.StringLiteral) {
                            ob[name] = val;
                        }
                        else
                            ob[name] = val;
                    }
                });
            }
            else
                node.getChildren().forEach(c => {
                    Tools_4.visitNode(code, c, ob);
                });
        }
        /**
         * parse a json string and returns an object an embed all values in string
         * e.g.
         * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
         **/
        static jsonToStringObject(code) {
            code = "a=" + code;
            var sourceFile = ts.createSourceFile('hallo.ts', code, ts.ScriptTarget.ES5, true);
            var ret = {};
            Tools_4.visitNode(code, sourceFile, ret);
            return ret;
        }
        static _stringObjectToJson(ob, ret) {
            for (var key in ob) {
                if (typeof (ob[key]) === "string") {
                    ret[key] = "%&&/" + ob[key] + "%&&/";
                }
                else {
                    ret[key] = {};
                    Tools_4._stringObjectToJson(ob[key], ret[key]);
                }
            }
        }
        /**
        * parse a json string and returns an object an embed all values in string
        * e.g.
        * { a:"hallo",i:{b:9,c:"test"}} would be convert to{ a:""hallo"",i:{b:"9",c:""test""}}
        **/
        static stringObjectToJson(ob, space) {
            var ret = {};
            Tools_4._stringObjectToJson(ob, ret);
            var sret = JSON.stringify(ret, function (key, value) {
                //rename propertynames
                if (typeof (value) === "object") {
                    var keys = Object.assign({}, value);
                    for (var key in keys) {
                        value["<<&START" + key + "END&>>"] = value[key];
                        delete value[key];
                    }
                }
                return value;
            }, "      ");
            sret = sret.replaceAll("\\\"%&&/", "").replaceAll("%&&/\\\"", "");
            sret = sret.replaceAll("\"%&&/", "").replaceAll("%&&/\"", "");
            var aret = sret.split("\r");
            for (let x = 0; x < aret.length; x++) {
                aret[x] = space + aret[x];
            }
            var r = aret.join("\r");
            r = r.replaceAll("\\r", "\r");
            r = r.replaceAll("\\n", "\n");
            r = r.replaceAll("\\t", "\t");
            r = r.replaceAll("\"<<&START", "");
            r = r.replaceAll("END&>>\"", "");
            return r;
        }
    };
    Tools = Tools_4 = __decorate([
        Jassi_90.$Class("jassi.util.Tools"),
        __metadata("design:paramtypes", [])
    ], Tools);
    exports.Tools = Tools;
    async function test() {
        var k = Tools.objectToJson({
            a: "h\no", b: 1, function() {
                var ad = "\n";
            }
        });
        var k2 = Tools.jsonToObject(k);
        var code = `{ 
	g:function(){
		return 1;
		
	}
	a:"hallo",
	i:{
		b:9,
		c:"test"
		}
	} `;
        var h = await Tools.jsonToStringObject(code);
        var h2 = Tools.stringObjectToJson(h, "    ");
        var j = {
            body: [
                ['Item', 'Price'],
                {
                    foreach: "line in invoice.lines", do: [
                        '{{line.text}}', '{{line.price}}'
                    ]
                }
            ]
        };
        var j2 = Tools.objectToJson(j, undefined, false);
        var g = Tools.jsonToObject(j2);
    }
    exports.test = test;
});
//# sourceMappingURL=jassi.js.map