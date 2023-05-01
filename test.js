"use strict:";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("../jassijs/remote/Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.config = exports.Config = void 0;
    class Config {
        constructor() {
            if (!window.document) {
                this.isServer = true;
                var fs = require("fs");
                this.init(fs.readFileSync('./client/jassijs.json', 'utf-8'));
            }
        }
        init(configtext) {
            this.jsonData = JSON.parse(configtext);
            this.modules = this.jsonData.modules;
            this.server = {
                modules: this.jsonData.server.modules
            };
        }
        async reload() {
            if (!window.document) {
                this.isServer = true;
                var fs = require("fs");
                this.init(fs.readFileSync('./client/jassijs.json', 'utf-8'));
            }
            else {
                var myfs = (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/NativeAdapter"], resolve_1, reject_1); })).myfs;
                this.init(await myfs.readFile('./client/jassijs.json', 'utf-8'));
            }
        }
        async saveJSON() {
            var myfs = (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/NativeAdapter"], resolve_2, reject_2); })).myfs;
            await myfs.writeFile('./client/jassijs.json', JSON.stringify(this.jsonData, undefined, "\t"));
            this.init(await myfs.readFile('./client/jassijs.json'));
        }
    }
    exports.Config = Config;
    var config = new Config();
    exports.config = config;
});
define("../jassijs/remote/Classes", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.classes = exports.Classes = exports.JassiError = void 0;
    let JassiError = class JassiError extends Error {
        constructor(msg) {
            super(msg);
        }
    };
    JassiError = __decorate([
        $Class("jassijs.remote.JassiError"),
        __metadata("design:paramtypes", [String])
    ], JassiError);
    exports.JassiError = JassiError;
    function $Class(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$Class", pclass, longclassname);
        };
    }
    /**
    * manage all registered classes ->jassijs.register("classes")
    * @class jassijs.base.Classes
    */
    let Classes = class Classes {
        constructor() {
            this._cache = {};
            this.funcRegister = Registry_1.default.onregister("$Class", this.register.bind(this));
        }
        destroy() {
            Registry_1.default.offregister("$Class", this.funcRegister);
        }
        /**
         * load the a class
         * @param classname - the class to load
         */
        async loadClass(classname) {
            var cl = await Registry_1.default.getJSONData("$Class", classname);
            if (cl === undefined) {
                try {
                    //@ts-ignore
                    if (require.main) { //nodes load project class from module
                        //@ts-ignore 
                        await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                    }
                    else {
                        await new Promise((resolve_3, reject_3) => { require([classname.replaceAll(".", "/")], resolve_3, reject_3); });
                    }
                }
                catch (err) {
                    err = err;
                }
            }
            else {
                if (cl === undefined || cl.length === 0) {
                    throw new JassiError("Class not found:" + classname);
                }
                var file = cl[0].filename;
                //@ts-ignore
                if (window.document === undefined) {
                    var pack = file.split("/");
                    if (pack.length < 2 || pack[1] === "server") {
                        // throw new JassiError("Server classes could not be loaded: " + classname );
                    }
                }
                //@ts-ignore
                if (require.main) { //nodes load project class from module
                    //@ts-ignore
                    var imp = await Promise.resolve().then(() => require.main.require(file.replace(".ts", "")));
                }
                else {
                    var imp = await new Promise((resolve_4, reject_4) => { require([file.replace(".ts", "")], resolve_4, reject_4); });
                }
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
        $Class("jassijs.remote.Classes"),
        __metadata("design:paramtypes", [])
    ], Classes);
    exports.Classes = Classes;
    ;
    let classes = new Classes();
    exports.classes = classes;
    async function test(t) {
        var cl = classes.getClass("jassijs.ui.Button");
        t.expectEqual(cl === await classes.loadClass("jassijs.ui.Button"));
        t.expectEqual(classes.getClassName(cl) === "jassijs.ui.Button");
    }
    exports.test = test;
});
//needed to Compile registry
var exports = {};
//this file is autogenerated don't modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "jassijs/remote/Classes.ts": {
        "date": 1682795551717.3792,
        "jassijs.remote.JassiError": {},
        "jassijs.remote.Classes": {}
    },
    "jassijs/remote/ClientError.ts": {
        "date": 1655556930000,
        "jassijs.remote.ClientError": {}
    },
    "jassijs/remote/Database.ts": {
        "date": 1655556796000,
        "jassijs.remote.Database": {}
    },
    "jassijs/remote/DatabaseTools.ts": {
        "date": 1681309880654.3965,
        "jassijs.remote.DatabaseTools": {
            "@members": {
                "runSQL": {
                    "ValidateFunctionParameter": []
                }
            }
        }
    },
    "jassijs/remote/DBArray.ts": {
        "date": 1655556796000,
        "jassijs.remote.DBArray": {}
    },
    "jassijs/remote/DBObject.ts": {
        "date": 1681317354018.0388,
        "jassijs.remote.DBObject": {}
    },
    "jassijs/remote/DBObjectQuery.ts": {
        "date": 1623876714000
    },
    "jassijs/remote/Extensions.ts": {
        "date": 1626209336000
    },
    "jassijs/remote/FileNode.ts": {
        "date": 1655556796000,
        "jassijs.remote.FileNode": {}
    },
    "jassijs/remote/hallo.ts": {
        "date": 1622985410000
    },
    "jassijs/remote/Jassi.ts": {
        "date": 1682794538158.105
    },
    "jassijs/remote/JassijsGlobal.ts": {
        "date": 1655549782000
    },
    "jassijs/remote/ObjectTransaction.ts": {
        "date": 1622985414000
    },
    "jassijs/remote/Registry.ts": {
        "date": 1682847812388.982
    },
    "jassijs/remote/RemoteObject.ts": {
        "date": 1655556866000,
        "jassijs.remote.RemoteObject": {}
    },
    "jassijs/remote/RemoteProtocol.ts": {
        "date": 1655556796000,
        "jassijs.remote.RemoteProtocol": {}
    },
    "jassijs/remote/security/Group.ts": {
        "date": 1682888734579.9475,
        "jassijs.security.Group": {
            "$DBObject": [
                {
                    "name": "jassijs_group"
                }
            ],
            "@members": {
                "id": {
                    "ValidateIsInt": [
                        {
                            "optional": true
                        }
                    ],
                    "PrimaryColumn": []
                },
                "name": {
                    "ValidateIsString": [],
                    "Column": []
                },
                "parentRights": {
                    "ValidateIsArray": [
                        {
                            "optional": true,
                            "type": "function"
                        }
                    ],
                    "JoinTable": [],
                    "ManyToMany": [
                        "function",
                        "function"
                    ]
                },
                "rights": {
                    "ValidateIsArray": [
                        {
                            "optional": true,
                            "type": "function"
                        }
                    ],
                    "JoinTable": [],
                    "ManyToMany": [
                        "function",
                        "function"
                    ]
                },
                "users": {
                    "ValidateIsArray": [
                        {
                            "optional": true,
                            "type": "function"
                        }
                    ],
                    "ManyToMany": [
                        "function",
                        "function"
                    ]
                }
            }
        }
    },
    "jassijs/remote/security/ParentRight.ts": {
        "date": 1681581396308.1873,
        "jassijs.security.ParentRight": {
            "$DBObject": [
                {
                    "name": "jassijs_parentright"
                }
            ],
            "@members": {
                "id": {
                    "ValidateIsInt": [
                        {
                            "optional": true
                        }
                    ],
                    "PrimaryGeneratedColumn": []
                },
                "name": {
                    "ValidateIsString": [],
                    "Column": []
                },
                "classname": {
                    "ValidateIsString": [],
                    "Column": []
                },
                "i1": {
                    "ValidateIsNumber": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                },
                "i2": {
                    "ValidateIsNumber": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                },
                "s1": {
                    "ValidateIsString": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                },
                "s2": {
                    "ValidateIsString": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                },
                "groups": {
                    "ValidateIsArray": [
                        {
                            "optional": true,
                            "type": "function"
                        }
                    ],
                    "ManyToMany": [
                        "function",
                        "function"
                    ]
                }
            }
        }
    },
    "jassijs/remote/security/Right.ts": {
        "date": 1681322767134.66,
        "jassijs.security.Right": {
            "$DBObject": [
                {
                    "name": "jassijs_right"
                }
            ],
            "@members": {
                "id": {
                    "ValidateIsInt": [
                        {
                            "optional": true
                        }
                    ],
                    "PrimaryColumn": []
                },
                "name": {
                    "ValidateIsString": [],
                    "Column": []
                },
                "groups": {
                    "ValidateIsArray": [
                        {
                            "optional": true,
                            "type": "function"
                        }
                    ],
                    "ManyToMany": [
                        "function",
                        "function"
                    ]
                }
            }
        }
    },
    "jassijs/remote/security/Rights.ts": {
        "date": 1655556796000,
        "jassijs.security.Rights": {}
    },
    "jassijs/remote/security/Setting.ts": {
        "date": 1681316435162.0532,
        "jassijs.security.Setting": {
            "$DBObject": [
                {
                    "name": "jassijs_setting"
                }
            ],
            "@members": {
                "id": {
                    "ValidateIsInt": [
                        {
                            "optional": true
                        }
                    ],
                    "PrimaryColumn": []
                },
                "data": {
                    "ValidateIsString": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                }
            }
        }
    },
    "jassijs/remote/security/User.ts": {
        "date": 1681329602964.0217,
        "jassijs.security.User": {
            "$DBObject": [
                {
                    "name": "jassijs_user"
                }
            ],
            "@members": {
                "id": {
                    "ValidateIsNumber": [
                        {
                            "optional": true
                        }
                    ],
                    "PrimaryGeneratedColumn": []
                },
                "email": {
                    "ValidateIsString": [],
                    "Column": []
                },
                "password": {
                    "ValidateIsString": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "select": false
                        }
                    ]
                },
                "groups": {
                    "ValidateIsArray": [
                        {
                            "optional": true,
                            "type": "function"
                        }
                    ],
                    "JoinTable": [],
                    "ManyToMany": [
                        "function",
                        "function"
                    ]
                },
                "isAdmin": {
                    "ValidateIsBoolean": [
                        {
                            "optional": true
                        }
                    ],
                    "Column": [
                        {
                            "nullable": true
                        }
                    ]
                }
            }
        }
    },
    "jassijs/remote/Settings.ts": {
        "date": 1681315774170.6409,
        "jassijs.remote.Settings": {
            "@members": {
                "remove": {
                    "ValidateFunctionParameter": []
                },
                "save": {
                    "ValidateFunctionParameter": []
                },
                "saveAll": {
                    "ValidateFunctionParameter": []
                }
            }
        }
    },
    "jassijs/remote/Test.ts": {
        "date": 1655556930000,
        "jassijs.remote.Test": {}
    },
    "jassijs/remote/Transaction.ts": {
        "date": 1655556866000,
        "jassijs.remote.Transaction": {}
    },
    "jassijs/server/Compile.ts": {
        "date": 1682933011024.6155
    },
    "jassijs/server/DBManager.ts": {
        "date": 1682710550782.2158,
        "jassijs/server/DBManager": {
            "$Serverservice": [
                {
                    "name": "db",
                    "getInstance": "function"
                }
            ]
        }
    },
    "jassijs/server/DoRemoteProtocol.ts": {
        "date": 1682362433279.5454
    },
    "jassijs/server/Filesystem.ts": {
        "date": 1682807745323.753,
        "jassijs.server.Filesystem": {
            "$Serverservice": [
                {
                    "name": "filesystem",
                    "getInstance": "function"
                }
            ]
        }
    },
    "jassijs/server/Indexer.ts": {
        "date": 1682806194944.4678
    },
    "jassijs/server/JassiServer.ts": {
        "date": 1682449512016.267
    },
    "jassijs/server/PassportLoginRegister.ts": {
        "date": 1680946666515.8162
    },
    "jassijs/server/PassportSetup.ts": {
        "date": 1680946687665.4827
    },
    "jassijs/server/RawBody.ts": {
        "date": 1654195782000
    },
    "jassijs/server/RegistryIndexer.ts": {
        "date": 1682799790211.1238
    },
    "jassijs/server/Zip.ts": {
        "date": 1622984046000
    },
    "jassijs/UserModel.ts": {
        "date": 1622984046000
    },
    "jassijs/util/DatabaseSchema.ts": {
        "date": 1611490792000
    },
    "jassijs/remote/Validator.ts": {
        "date": 1681322647267.7717
    },
    "jassijs/remote/Server.ts": {
        "date": 1682794608034.317,
        "jassijs.remote.Server": {
            "@members": {
                "dir": {
                    "ValidateFunctionParameter": []
                },
                "zip": {
                    "ValidateFunctionParameter": []
                },
                "loadFiles": {
                    "ValidateFunctionParameter": []
                },
                "loadFile": {
                    "ValidateFunctionParameter": []
                },
                "saveFiles": {
                    "ValidateFunctionParameter": []
                },
                "saveFile": {
                    "ValidateFunctionParameter": []
                },
                "testServersideFile": {
                    "ValidateFunctionParameter": []
                },
                "removeServerModul": {
                    "ValidateFunctionParameter": []
                },
                "delete": {
                    "ValidateFunctionParameter": []
                },
                "rename": {
                    "ValidateFunctionParameter": []
                },
                "createFile": {
                    "ValidateFunctionParameter": []
                },
                "createFolder": {
                    "ValidateFunctionParameter": []
                },
                "createModule": {
                    "ValidateFunctionParameter": []
                }
            }
        }
    },
    "jassijs/remote/Serverservice.ts": {
        "date": 1682715263974.073
    },
    "jassijs/index.d.ts": {
        "date": 1681918735844.9463
    },
    "jassijs/server/UpdatePackage.ts": {
        "date": 1682701331180.3745
    },
    "jassijs/remote/Config.ts": {
        "date": 1682889087734.386
    },
    "jassijs/server/NativeAdapter.ts": {
        "date": 1682806209363.9146
    },
    "jassijs/server/FileTools.ts": {
        "date": 1682792900059.5854
    },
    "jassijs/server/Reloader.ts": {
        "date": 1682793104106.3633
    },
    "jassijs/server/DBManagerExt.ts": {
        "date": 1682717755128.099
    },
    "jassijs/server/TypeORMListener.ts": {
        "date": 1682718172595.0825,
        "jassijs.server.TypeORMListener": {
            "EventSubscriber": []
        }
    },
    "jassijs/server/DatabaseSchema.ts": {
        "date": 1682241708158.535
    },
    "jassijs/server/ext/EmpyDeclaration.ts": {
        "date": 1682275347821.4524
    },
    "jassijs/server/ext/jszip.ts": {
        "date": 1657714030000
    },
    "jassijs/server/Installserver.ts": {
        "date": 1682880639293.302
    },
    "jassijs/server/LocalProtocol.ts": {
        "date": 1682365334193.8733
    },
    "jassijs/server/Testuser.ts": {
        "date": 1655556794000,
        "Testuser": {
            "$DBObject": [],
            "@members": {
                "id": {
                    "PrimaryColumn": []
                },
                "firstname": {
                    "Column": []
                },
                "lastname": {
                    "Column": []
                }
            }
        }
    },
    "jassijs/remote/Modules.ts": {
        "date": 1682799474543.8716
    },
    "jassijs/server/Cookies.ts": {
        "date": 1682364418785.7334
    },
    "jassijs/server/FS.ts": {
        "date": 1682930344917.084
    }
};
//this file is autogenerated don't modify
define("jassijs/registry", ["require"], function (require) {
    return exports;
});
//# sourceMappingURL=test.js.map