export const __esModule: boolean;
declare const _default: {
    "jassijs/remote/Classes.ts": {
        date: number;
        "jassijs.remote.JassiError": {};
        "jassijs.remote.Classes": {};
    };
    "jassijs/remote/ClientError.ts": {
        date: number;
        "jassijs.remote.ClientError": {};
    };
    "jassijs/remote/Database.ts": {
        date: number;
        "jassijs.remote.Database": {};
    };
    "jassijs/remote/DatabaseTools.ts": {
        date: number;
        "jassijs.remote.DatabaseTools": {
            "@members": {
                runSQL: {
                    ValidateFunctionParameter: any[];
                };
            };
        };
    };
    "jassijs/remote/DBArray.ts": {
        date: number;
        "jassijs.remote.DBArray": {};
    };
    "jassijs/remote/DBObject.ts": {
        date: number;
        "jassijs.remote.DBObject": {};
    };
    "jassijs/remote/DBObjectQuery.ts": {
        date: number;
    };
    "jassijs/remote/Extensions.ts": {
        date: number;
    };
    "jassijs/remote/FileNode.ts": {
        date: number;
        "jassijs.remote.FileNode": {};
    };
    "jassijs/remote/hallo.ts": {
        date: number;
    };
    "jassijs/remote/Jassi.ts": {
        date: number;
    };
    "jassijs/remote/JassijsGlobal.ts": {
        date: number;
    };
    "jassijs/remote/ObjectTransaction.ts": {
        date: number;
    };
    "jassijs/remote/Registry.ts": {
        date: number;
    };
    "jassijs/remote/RemoteObject.ts": {
        date: number;
        "jassijs.remote.RemoteObject": {};
    };
    "jassijs/remote/RemoteProtocol.ts": {
        date: number;
        "jassijs.remote.RemoteProtocol": {};
    };
    "jassijs/remote/security/Group.ts": {
        date: number;
        "jassijs.security.Group": {
            $DBObject: {
                name: string;
            }[];
            "@members": {
                id: {
                    ValidateIsInt: {
                        optional: boolean;
                    }[];
                    PrimaryColumn: any[];
                };
                name: {
                    ValidateIsString: any[];
                    Column: any[];
                };
                parentRights: {
                    ValidateIsArray: {
                        optional: boolean;
                        type: string;
                    }[];
                    JoinTable: any[];
                    ManyToMany: string[];
                };
                rights: {
                    ValidateIsArray: {
                        optional: boolean;
                        type: string;
                    }[];
                    JoinTable: any[];
                    ManyToMany: string[];
                };
                users: {
                    ValidateIsArray: {
                        optional: boolean;
                        type: string;
                    }[];
                    ManyToMany: string[];
                };
            };
        };
    };
    "jassijs/remote/security/ParentRight.ts": {
        date: number;
        "jassijs.security.ParentRight": {
            $DBObject: {
                name: string;
            }[];
            "@members": {
                id: {
                    ValidateIsInt: {
                        optional: boolean;
                    }[];
                    PrimaryGeneratedColumn: any[];
                };
                name: {
                    ValidateIsString: any[];
                    Column: any[];
                };
                classname: {
                    ValidateIsString: any[];
                    Column: any[];
                };
                i1: {
                    ValidateIsNumber: {
                        optional: boolean;
                    }[];
                    Column: {
                        nullable: boolean;
                    }[];
                };
                i2: {
                    ValidateIsNumber: {
                        optional: boolean;
                    }[];
                    Column: {
                        nullable: boolean;
                    }[];
                };
                s1: {
                    ValidateIsString: {
                        optional: boolean;
                    }[];
                    Column: {
                        nullable: boolean;
                    }[];
                };
                s2: {
                    ValidateIsString: {
                        optional: boolean;
                    }[];
                    Column: {
                        nullable: boolean;
                    }[];
                };
                groups: {
                    ValidateIsArray: {
                        optional: boolean;
                        type: string;
                    }[];
                    ManyToMany: string[];
                };
            };
        };
    };
    "jassijs/remote/security/Right.ts": {
        date: number;
        "jassijs.security.Right": {
            $DBObject: {
                name: string;
            }[];
            "@members": {
                id: {
                    ValidateIsInt: {
                        optional: boolean;
                    }[];
                    PrimaryColumn: any[];
                };
                name: {
                    ValidateIsString: any[];
                    Column: any[];
                };
                groups: {
                    ValidateIsArray: {
                        optional: boolean;
                        type: string;
                    }[];
                    ManyToMany: string[];
                };
            };
        };
    };
    "jassijs/remote/security/Rights.ts": {
        date: number;
        "jassijs.security.Rights": {};
    };
    "jassijs/remote/security/Setting.ts": {
        date: number;
        "jassijs.security.Setting": {
            $DBObject: {
                name: string;
            }[];
            "@members": {
                id: {
                    ValidateIsInt: {
                        optional: boolean;
                    }[];
                    PrimaryColumn: any[];
                };
                data: {
                    ValidateIsString: {
                        optional: boolean;
                    }[];
                    Column: {
                        nullable: boolean;
                    }[];
                };
            };
        };
    };
    "jassijs/remote/security/User.ts": {
        date: number;
        "jassijs.security.User": {
            $DBObject: {
                name: string;
            }[];
            "@members": {
                id: {
                    ValidateIsNumber: {
                        optional: boolean;
                    }[];
                    PrimaryGeneratedColumn: any[];
                };
                email: {
                    ValidateIsString: any[];
                    Column: any[];
                };
                password: {
                    ValidateIsString: {
                        optional: boolean;
                    }[];
                    Column: {
                        select: boolean;
                    }[];
                };
                groups: {
                    ValidateIsArray: {
                        optional: boolean;
                        type: string;
                    }[];
                    JoinTable: any[];
                    ManyToMany: string[];
                };
                isAdmin: {
                    ValidateIsBoolean: {
                        optional: boolean;
                    }[];
                    Column: {
                        nullable: boolean;
                    }[];
                };
            };
        };
    };
    "jassijs/remote/Settings.ts": {
        date: number;
        "jassijs.remote.Settings": {
            "@members": {
                remove: {
                    ValidateFunctionParameter: any[];
                };
                save: {
                    ValidateFunctionParameter: any[];
                };
                saveAll: {
                    ValidateFunctionParameter: any[];
                };
            };
        };
    };
    "jassijs/remote/Test.ts": {
        date: number;
        "jassijs.remote.Test": {};
    };
    "jassijs/remote/Transaction.ts": {
        date: number;
        "jassijs.remote.Transaction": {};
    };
    "jassijs/server/Compile.ts": {
        date: number;
    };
    "jassijs/server/DBManager.ts": {
        date: number;
        "jassijs/server/DBManager": {
            $Serverservice: {
                name: string;
                getInstance: string;
            }[];
        };
    };
    "jassijs/server/DoRemoteProtocol.ts": {
        date: number;
    };
    "jassijs/server/Filesystem.ts": {
        date: number;
        "jassijs.server.Filesystem": {
            $Serverservice: {
                name: string;
                getInstance: string;
            }[];
        };
    };
    "jassijs/server/Indexer.ts": {
        date: number;
    };
    "jassijs/server/JassiServer.ts": {
        date: number;
    };
    "jassijs/server/PassportLoginRegister.ts": {
        date: number;
    };
    "jassijs/server/PassportSetup.ts": {
        date: number;
    };
    "jassijs/server/RawBody.ts": {
        date: number;
    };
    "jassijs/server/RegistryIndexer.ts": {
        date: number;
    };
    "jassijs/server/Zip.ts": {
        date: number;
    };
    "jassijs/UserModel.ts": {
        date: number;
    };
    "jassijs/util/DatabaseSchema.ts": {
        date: number;
    };
    "jassijs/remote/Validator.ts": {
        date: number;
    };
    "jassijs/remote/Server.ts": {
        date: number;
        "jassijs.remote.Server": {
            "@members": {
                dir: {
                    ValidateFunctionParameter: any[];
                };
                zip: {
                    ValidateFunctionParameter: any[];
                };
                loadFiles: {
                    ValidateFunctionParameter: any[];
                };
                loadFile: {
                    ValidateFunctionParameter: any[];
                };
                saveFiles: {
                    ValidateFunctionParameter: any[];
                };
                saveFile: {
                    ValidateFunctionParameter: any[];
                };
                testServersideFile: {
                    ValidateFunctionParameter: any[];
                };
                removeServerModul: {
                    ValidateFunctionParameter: any[];
                };
                delete: {
                    ValidateFunctionParameter: any[];
                };
                rename: {
                    ValidateFunctionParameter: any[];
                };
                createFile: {
                    ValidateFunctionParameter: any[];
                };
                createFolder: {
                    ValidateFunctionParameter: any[];
                };
                createModule: {
                    ValidateFunctionParameter: any[];
                };
            };
        };
    };
    "jassijs/remote/Serverservice.ts": {
        date: number;
    };
    "jassijs/index.d.ts": {
        date: number;
    };
    "jassijs/server/UpdatePackage.ts": {
        date: number;
    };
};
export default _default;
