//this file is autogenerated don't modify
define("jassijs_editor/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_editor/AcePanel.ts": {
                "date": 1684357702000,
                "jassijs.ui.AcePanel": {}
            },
            "jassijs_editor/AcePanelSimple.ts": {
                "date": 1657651672000,
                "jassijs.ui.AcePanelSimple": {}
            },
            "jassijs_editor/ChromeDebugger.ts": {
                "date": 1681488352000,
                "jassijs_editor.ChromeDebugger": {}
            },
            "jassijs_editor/CodeEditor.ts": {
                "date": 1698089473938.3076,
                "jassijs_editor.CodeEditorSettingsDescriptor": {
                    "$SettingsDescriptor": [],
                    "@members": {}
                },
                "jassijs_editor.CodeEditor": {
                    "@members": {}
                }
            },
            "jassijs_editor/CodeEditorInvisibleComponents.ts": {
                "date": 1681558934000,
                "jassijs_editor.CodeEditorInvisibleComponents": {}
            },
            "jassijs_editor/CodePanel.ts": {
                "date": 1655661690000,
                "jassijs_editor.CodePanel": {}
            },
            "jassijs_editor/ComponentDesigner.ts": {
                "date": 1699113283096.9436,
                "jassijs_editor.ComponentDesigner": {}
            },
            "jassijs_editor/ComponentExplorer.ts": {
                "date": 1696696982919.5652,
                "jassijs_editor.ComponentExplorer": {}
            },
            "jassijs_editor/ComponentPalette.ts": {
                "date": 1699116219018.671,
                "jassijs_editor.ComponentPalette": {}
            },
            "jassijs_editor/ComponentSpy.ts": {
                "date": 1698507857251.2354,
                "jassijs_editor.ui.ComponentSpy": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Administration",
                                    "icon": "mdi mdi-account-cog-outline"
                                }
                            ]
                        },
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Spy Components",
                                    "icon": "mdi mdi-police-badge"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/DatabaseDesigner.ts": {
                "date": 1698507857253.23,
                "jassijs_editor/DatabaseDesigner": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Database Designer",
                                    "icon": "mdi mdi-database-edit"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/Debugger.ts": {
                "date": 1656019586000,
                "jassijs_editor.Debugger": {}
            },
            "jassijs_editor/ErrorPanel.ts": {
                "date": 1682794808000,
                "jassijs_editor.ui.ErrorPanel": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Errors",
                                    "icon": "mdi mdi-emoticon-confused-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/ext/monaco.ts": {
                "date": 1681572586000
            },
            "jassijs_editor/FileExplorer.ts": {
                "date": 1683575950000,
                "jassijs_editor.ui.FileActions": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/File",
                                    "icon": "mdi mdi-file",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "download": {
                            "$Action": [
                                {
                                    "name": "Download",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "newFolder": {
                            "$Action": [
                                {
                                    "name": "New/Folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "newModule": {
                            "$Action": [
                                {
                                    "name": "New/Module",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "dodelete": {
                            "$Action": [
                                {
                                    "name": "Delete"
                                }
                            ]
                        },
                        "mapLocalFolder": {
                            "$Action": [
                                {
                                    "name": "Map local folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "closeLocalFolder": {
                            "$Action": [
                                {
                                    "name": "Close local folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "rename": {
                            "$Action": [
                                {
                                    "name": "Rename"
                                }
                            ]
                        },
                        "refresh": {
                            "$Action": [
                                {
                                    "name": "Refresh"
                                }
                            ]
                        },
                        "open": {
                            "$Action": [
                                {
                                    "name": "Open",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.FileExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/Files",
                                    "icon": "mdi mdi-file-tree"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/HtmlDesigner.ts": {
                "date": 1699287607642.389,
                "jassijs_editor.HtmlDesigner": {}
            },
            "jassijs_editor/modul.ts": {
                "date": 1695399690345.8984
            },
            "jassijs_editor/MonacoPanel.ts": {
                "date": 1684357486000,
                "jassijs_editor.MonacoPanel": {}
            },
            "jassijs_editor/SearchExplorer.ts": {
                "date": 1681590246000,
                "jassijs_editor.ui.SearchExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/Search",
                                    "icon": "mdi mdi-folder-search-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/StartEditor.ts": {
                "date": 1697200788486.8972
            },
            "jassijs_editor/template/TemplateDBDialog.ts": {
                "date": 1681570392000,
                "jassijs_editor.template.TemplateDBDialogProperties": {
                    "@members": {}
                },
                "jassijs.template.TemplateDBDialog": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/DBDialog",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateDBObject.ts": {
                "date": 1681570394000,
                "jassijs_editor.template.TemplateDBObjectProperties": {
                    "@members": {}
                },
                "jassijs.template.TemplateDBObject": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/DBObject",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateEmptyDialog.ts": {
                "date": 1681579996000,
                "jassijs_editor.template.TemplateEmptyDialog": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/Dialog",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateRemoteObject.ts": {
                "date": 1681570100000,
                "jassijs_editor.template.TemplateRemoteObject": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/RemoteObject",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/util/DatabaseSchema.ts": {
                "date": 1681569388000,
                "jassijs_editor.util.DatabaseSchema": {}
            },
            "jassijs_editor/util/DragAndDropper.ts": {
                "date": 1657925428000,
                "jassijs_editor.util.DragAndDropper": {}
            },
            "jassijs_editor/util/Parser.ts": {
                "date": 1698524672858.8315,
                "jassijs_editor.util.Parser": {}
            },
            "jassijs_editor/util/Resizer.ts": {
                "date": 1697234630938.0537,
                "jassijs_editor.util.Resizer": {}
            },
            "jassijs_editor/util/Tests.ts": {
                "date": 1698507857241.7307,
                "jassijs_editor.ui.TestAction": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "testNode": {
                            "$Action": [
                                {
                                    "name": "Run Tests"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/util/TSSourceMap.ts": {
                "date": 1682794840000,
                "jassijs_editor.util.TSSourceMap": {}
            },
            "jassijs_editor/util/Typescript.ts": {
                "date": 1697196860372.7793,
                "jassijs_editor.util.Typescript": {}
            }
        }
    };
});
//# sourceMappingURL=registry.js.map