var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs_editor/util/Typescript", "jassijs_editor/util/Parser", "jassijs_editor/template/TemplateDBObject", "jassijs/util/Tools", "jassijs/remote/Server", "jassijs/base/Windows", "jassijs/ui/OptionDialog", "jquery.choosen"], function (require, exports, Registry_1, Registry_2, Typescript_1, Parser_1, TemplateDBObject_1, Tools_1, Server_1, Windows_1, OptionDialog_1) {
    "use strict";
    var DatabaseSchema_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test3 = exports.DatabaseSchema = exports.DatabaseClass = exports.DatabaseField = void 0;
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
                    params.push("e=>" + field.inverseSide);
                if (s)
                    params.push(s);
                decs[field.relation] = { name: field.relation, parameter: params };
            }
            this.parsedClasses[dbcl.name].parent.addOrModifyMember({ name: field.name, type: realtype, decorator: decs }, this.parsedClasses[dbcl.name]);
        }
        async reloadCodeInEditor(file, text) {
            var editor = Windows_1.default.findComponent("jassijs_editor.CodeEditor-" + file);
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
                    // console.log(mcl.filename + "\n");
                    //  console.log(text + "\n");
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
            await Typescript_1.default.waitForInited;
            var data = await Registry_2.default.getJSONData("$DBObject");
            for (let x = 0; x < data.length; x++) {
                var entr = data[x];
                var parser = new Parser_1.Parser();
                var file = entr.filename;
                var code = Typescript_1.default.getCode(file);
                // if (code === undefined)
                //     code = await new Server().loadFile(file);
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
            }
        }
        async loadSchemaFromCode() {
            await this.parseFiles();
            //await registry.loadAllFilesForService("$DBObject")
            await Registry_2.default.reload();
            var data = Registry_2.default.getJSONData("$DBObject");
            this.databaseClasses = [];
            var _this = this;
            (await data).forEach((entr) => {
                var dbclass = new DatabaseClass();
                dbclass.name = entr.classname;
                dbclass.parent = _this;
                this.databaseClasses.push(dbclass);
                var pclass = this.parsedClasses[entr.classname];
                if (pclass) {
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
                }
            });
        }
    };
    DatabaseSchema.basicdatatypes = ["string", "int", "decimal", "boolean", "Date"];
    DatabaseSchema = DatabaseSchema_1 = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.util.DatabaseSchema")
    ], DatabaseSchema);
    exports.DatabaseSchema = DatabaseSchema;
    /*
    @$Class("jassijs.base.DatabaseColumnOptions")
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
    async function test3() {
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
        var text = await schema2.updateSchema(true);
        //console.log(result);
        //test.pop();
        //schema.visitNode(sourceFile);
    }
    exports.test3 = test3;
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
//# sourceMappingURL=DatabaseSchema.js.map