//this file is autogenerated don't modify
define("jassijs_editor/registry",["require"], function(require) {
 return {
  default: {
	"jassijs_editor/AcePanel.ts": {
		"date": 1657651684000,
		"jassijs.ui.AcePanel": {}
	},
	"jassijs_editor/AcePanelSimple.ts": {
		"date": 1657651672000,
		"jassijs.ui.AcePanelSimple": {}
	},
	"jassijs_editor/ChromeDebugger.ts": {
		"date": 1681488351349,
		"jassijs_editor.ChromeDebugger": {}
	},
	"jassijs_editor/CodeEditor.ts": {
		"date": 1681581295125,
		"jassijs_editor.CodeEditorSettingsDescriptor": {
			"$SettingsDescriptor": [],
			"@members": {}
		},
		"jassijs_editor.CodeEditor": {
			"@members": {}
		}
	},
	"jassijs_editor/CodeEditorInvisibleComponents.ts": {
		"date": 1681558933154,
		"jassijs_editor.CodeEditorInvisibleComponents": {}
	},
	"jassijs_editor/CodePanel.ts": {
		"date": 1655661690000,
		"jassijs_editor.CodePanel": {}
	},
	"jassijs_editor/ComponentDesigner.ts": {
		"date": 1681569722080,
		"jassijs_editor.ComponentDesigner": {}
	},
	"jassijs_editor/ComponentExplorer.ts": {
		"date": 1656022472000,
		"jassijs_editor.ComponentExplorer": {}
	},
	"jassijs_editor/ComponentPalette.ts": {
		"date": 1656017274000,
		"jassijs_editor.ComponentPalette": {}
	},
	"jassijs_editor/Debugger.ts": {
		"date": 1656019586000,
		"jassijs_editor.Debugger": {}
	},
	"jassijs_editor/modul.ts": {
		"date": 1681572587537
	},
	"jassijs_editor/MonacoPanel.ts": {
		"date": 1681487384262,
		"jassijs_editor.MonacoPanel": {}
	},
	"jassijs_editor/StartEditor.ts": {
		"date": 1681571254207
	},
	"jassijs_editor/util/DragAndDropper.ts": {
		"date": 1657925428000,
		"jassijs_editor.util.DragAndDropper": {}
	},
	"jassijs_editor/util/Parser.ts": {
		"date": 1681569989718,
		"jassijs_editor.util.Parser": {}
	},
	"jassijs_editor/util/Resizer.ts": {
		"date": 1656018240000,
		"jassijs_editor.util.Resizer": {}
	},
	"jassijs_editor/util/TSSourceMap.ts": {
		"date": 1655556794000,
		"jassijs_editor.util.TSSourceMap": {}
	},
	"jassijs_editor/util/Typescript.ts": {
		"date": 1681589968062,
		"jassijs_editor.util.Typescript": {}
	},
	"jassijs_editor/ext/Monaco.ts": {
		"date": 1657653558211
	},
	"jassijs_editor/ext/monaco.ts": {
		"date": 1681572585834
	},
	"jassijs_editor/DatabaseDesigner.ts": {
		"date": 1681557203338,
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
	"jassijs_editor/util/DatabaseSchema.ts": {
		"date": 1681569386436,
		"jassijs_editor.util.DatabaseSchema": {}
	},
	"jassijs_editor/ErrorPanel.ts": {
		"date": 1681580018025,
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
	"jassijs_editor/template/TemplateDBDialog.ts": {
		"date": 1681570390413,
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
		"date": 1681570392626,
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
		"date": 1681579994977,
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
		"date": 1681570098013,
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
	"jassijs_editor/FileExplorer.ts": {
		"date": 1681578801564,
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
	"jassijs_editor/SearchExplorer.ts": {
		"date": 1681590244604,
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
	"jassijs_editor/util/Tests.ts": {
		"date": 1681570126439,
		"jassijs_editor.ui.TestAction": {
			"$ActionProvider": [
				"jassijs_editor.remote.FileNode"
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
	"jassijs_editor/ComponentSpy.ts": {
		"date": 1681570600554,
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
	}
}
 }
});