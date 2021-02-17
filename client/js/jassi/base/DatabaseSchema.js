var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/remote/Registry", "jassi_editor/util/Typescript", "jassi_editor/util/Parser", "jassi/template/TemplateDBObject", "jassi/util/Tools", "jassi/remote/Server", "jassi/base/Windows", "jassi/ui/OptionDialog", "jassi/ext/jquery.choosen"], function (require, exports, Jassi_1, Registry_1, Typescript_1, Parser_1, TemplateDBObject_1, Tools_1, Server_1, Windows_1, OptionDialog_1) {
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
                return parsedClass.fullClassname;
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
            if (field.join && field.relation === "OneToOne")
                decs["JoinColumn"] = { name: "JoinColumn", parameter: [] };
            if (field.join && field.relation === "ManyToMany")
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
            var data = await Registry_1.default.getJSONData("$DBObject");
            data.forEach((entr) => {
                var parser = new Parser_1.Parser();
                var file = entr.filename;
                var code = Typescript_1.default.getCode(file);
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
            });
        }
        async loadSchemaFromCode() {
            await this.parseFiles();
            //await registry.loadAllFilesForService("$DBObject")
            var data = Registry_1.default.getJSONData("$DBObject");
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
        Jassi_1.$Class("jassi.base.DatabaseSchema")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VTY2hlbWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaS9iYXNlL0RhdGFiYXNlU2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBbUJBLE1BQWEsYUFBYTtRQVN0QixJQUFJLFFBQVE7O1lBQ1IsYUFBTyxJQUFJLENBQUMsVUFBVSwwQ0FBRSxRQUFRLENBQUM7UUFDckMsQ0FBQztRQUNELElBQUksUUFBUSxDQUFDLEtBQWM7WUFDdkIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixJQUFJLElBQUksQ0FBQyxVQUFVO29CQUNmLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7Z0JBQ3BDLE9BQU87YUFDVjtZQUVELElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQzFFLElBQUksS0FBSyxLQUFLLFNBQVM7b0JBQ25CLE9BQU87Z0JBQ1gsTUFBTSxrQ0FBa0MsQ0FBQzthQUM1QztZQUNELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTO2dCQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFckMsQ0FBQztRQUVELGVBQWU7WUFDWCxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxFQUFFLEVBQUU7Z0JBQzdDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQyxPQUFPLFNBQVMsQ0FBQztnQkFDckIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JD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QyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUM1QixJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDO1FBQ3hCLFFBQVEsQ0FBQztRQUNULENBQUMsQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFSRCxzQkFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCByZWdpc3RyeSBmcm9tIFwiamFzc2kvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgeyBkYiB9IGZyb20gXCJqYXNzaS9yZW1vdGUvRGF0YWJhc2VcIjtcbmltcG9ydCBcImphc3NpL2V4dC9qcXVlcnkuY2hvb3NlblwiO1xuaW1wb3J0IHR5cGVzY3JpcHQsIHsgVHlwZXNjcmlwdCB9IGZyb20gXCJqYXNzaV9lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCI7XG5cbmltcG9ydCB7IFBhcnNlciwgUGFyc2VkQ2xhc3MgfSBmcm9tIFwiamFzc2lfZWRpdG9yL3V0aWwvUGFyc2VyXCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSwgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpL3VpL1Byb3BlcnR5XCI7XG5cbmltcG9ydCB7IFRlbXBsYXRlREJPYmplY3QgfSBmcm9tIFwiamFzc2kvdGVtcGxhdGUvVGVtcGxhdGVEQk9iamVjdFwiO1xuXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJqYXNzaS91dGlsL1Rvb2xzXCI7XG5cbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCJqYXNzaS9yZW1vdGUvU2VydmVyXCI7XG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2kvYmFzZS9XaW5kb3dzXCI7XG5pbXBvcnQgeyBPcHRpb25EaWFsb2cgfSBmcm9tIFwiamFzc2kvdWkvT3B0aW9uRGlhbG9nXCI7XG4gXG5cbmV4cG9ydCBjbGFzcyBEYXRhYmFzZUZpZWxkIHtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIHJlbGF0aW9uOiBzdHJpbmc7XG4gICAgcHJvcGVydGllczogYW55O1xuICAgIGludmVyc2VTaWRlOiBzdHJpbmc7XG4gICAgam9pbjogYm9vbGVhbjtcblxuXG4gICAgZ2V0IG51bGxhYmxlKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzPy5udWxsYWJsZTtcbiAgICB9XG4gICAgc2V0IG51bGxhYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9wZXJ0aWVzKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnByb3BlcnRpZXMubnVsbGFibGU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRGF0YWJhc2VTY2hlbWEuYmFzaWNkYXRhdHlwZXMuaW5kZXhPZih0aGlzLnR5cGUpID09PSAtMSB8fCB0aGlzLnJlbGF0aW9uKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB0aHJvdyBcIlRoaXMgZmllbGQgY291bGQgbm90IGJlIG51bGxhYmxlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvcGVydGllcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0ge307XG4gICAgICAgIHRoaXMucHJvcGVydGllcy5udWxsYWJsZSA9IHZhbHVlO1xuXG4gICAgfVxuICAgIHByaXZhdGUgcGFyZW50OiBEYXRhYmFzZUNsYXNzO1xuICAgIGdldFJldmVyc2VGaWVsZCgpOiBEYXRhYmFzZUZpZWxkIHtcbiAgICAgICAgaWYgKHRoaXMuaW52ZXJzZVNpZGUgJiYgdGhpcy5pbnZlcnNlU2lkZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW52ZXJzZVNpZGUuaW5kZXhPZihcIi5cIikgPT09IC0xKVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB2YXIgc3AgPSB0aGlzLmludmVyc2VTaWRlLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICAgIHZhciBjbG5hbWUgPSB0aGlzLnR5cGUucmVwbGFjZShcIltdXCIsIFwiXCIpXG4gICAgICAgICAgICB2YXIgY2wgPSB0aGlzLnBhcmVudC5wYXJlbnQuZ2V0Q2xhc3MoY2xuYW1lKTtcbiAgICAgICAgICAgIGlmICghY2wpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHJldHVybiBjbC5nZXRGaWVsZChzcFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cblx0LyoqXG5cdCAqIGxvb2tzIHBvc3NpYmxlIHJlbGF0aW9ucyBpbiB0aGUgdHlwZSBjbGFzc1xuXHQgKiovXG4gICAgZ2V0UG9zc2libGVSZWxhdGlvbnMoKTogc3RyaW5nW10ge1xuICAgICAgICBpZiAodGhpcy5uYW1lID09PSBcImlkXCIpXG4gICAgICAgICAgICByZXR1cm4gW1wiUHJpbWFyeUNvbHVtblwiLCBcIlByaW1hcnlHZW5lcmF0ZWRDb2x1bW5cIl07XG5cbiAgICAgICAgaWYgKCF0aGlzLnR5cGUgfHwgRGF0YWJhc2VTY2hlbWEuYmFzaWNkYXRhdHlwZXMuaW5kZXhPZih0aGlzLnR5cGUpID49IDApXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMudHlwZS5lbmRzV2l0aChcIltdXCIpKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSBbXCJcIiwgXCJPbmVUb01hbnlcIiwgXCJNYW55VG9NYW55XCJdO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHZhbHVlcyA9IFtcIlwiLCBcIk9uZVRvT25lXCIsIFwiTWFueVRvT25lXCJdO1xuICAgICAgICB2YXIgY2wgPSB0aGlzLnR5cGUucmVwbGFjZShcIltdXCIsIFwiXCIpO1xuICAgICAgICB2YXIgcGFyZW50Y2wgPSB0aGlzLnBhcmVudC5uYW1lO1xuICAgICAgICB2YXIgcmVsY2xhc3MgPSB0aGlzLnBhcmVudC5wYXJlbnQuZ2V0Q2xhc3MoY2wpO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDt4IDwgcmVsY2xhc3MuZmllbGRzLmxlbmd0aDt4KyspIHtcbiAgICAgICAgICAgIHZhciByZWxmaWVsZCA9IHJlbGNsYXNzLmZpZWxkc1t4XTtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUuZW5kc1dpdGgoXCJbXVwiKSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlbGZpZWxkLnR5cGUgPT09IHBhcmVudGNsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vT25lVG9NYW55XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKFwiZS5cIiArIHJlbGZpZWxkLm5hbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVsZmllbGQudHlwZSA9PT0gKHBhcmVudGNsICsgXCJbXVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAvL01hbnlUb01hbnlcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goXCJlLlwiICsgcmVsZmllbGQubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKFwiZS5cIiArIHJlbGZpZWxkLm5hbWUgKyBcIihqb2luKVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlbGZpZWxkLnR5cGUgPT09IHBhcmVudGNsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vT25lVG9PbmVcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goXCJlLlwiICsgcmVsZmllbGQubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKFwiZS5cIiArIHJlbGZpZWxkLm5hbWUgKyBcIihqb2luKVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlbGZpZWxkLnR5cGUgPT09IChwYXJlbnRjbCArIFwiW11cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9NYW55VG9PbmVcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2goXCJlLlwiICsgcmVsZmllbGQubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICAgIGdldCByZWxhdGlvbmluZm8oKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMucmVsYXRpb24gPT09IFwiT25lVG9PbmVcIiB8fCB0aGlzLnJlbGF0aW9uID09PSBcIk1hbnlUb01hbnlcIiB8fCB0aGlzLnJlbGF0aW9uID09PSBcIk1hbnlUb09uZVwiIHx8IHRoaXMucmVsYXRpb24gPT09IFwiT25lVG9NYW55XCIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludmVyc2VTaWRlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW52ZXJzZVNpZGUgKyAodGhpcy5qb2luID8gXCIoam9pbilcIiA6IFwiXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxhdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlbGF0aW9uID09PSBcIlByaW1hcnlDb2x1bW5cIiB8fCB0aGlzLnJlbGF0aW9uID09PSBcIlByaW1hcnlHZW5lcmF0ZWRDb2x1bW5cIilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbGF0aW9uO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzZXQgcmVsYXRpb25pbmZvKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBcIlwiKVxuICAgICAgICAgICAgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlbGF0aW9uID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgLy8gIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgPT09IFwiUHJpbWFyeUNvbHVtblwiIHx8IHZhbHVlID09PSBcIlByaW1hcnlHZW5lcmF0ZWRDb2x1bW5cIikge1xuICAgICAgICAgICAgaWYgKHRoaXMubmFtZSA9PT0gXCJpZFwiKVxuICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gXCJPbmVUb09uZVwiIHx8IHZhbHVlID09PSBcIk1hbnlUb01hbnlcIiB8fCB2YWx1ZSA9PT0gXCJNYW55VG9PbmVcIiB8fCB2YWx1ZSA9PT0gXCJPbmVUb01hbnlcIikge1xuXG4gICAgICAgICAgICB2YXIgb2xkID0gdGhpcy5nZXRSZXZlcnNlRmllbGQoKTtcbiAgICAgICAgICAgIGlmIChvbGQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBvbGQuaW52ZXJzZVNpZGUgPSB1bmRlZmluZWQ7Ly9kZWxldGUgdGhlIHJlbGF0aW9uIG9uIHRoZSByZXZlcnNlIHNpZGVcbiAgICAgICAgICAgIHRoaXMucmVsYXRpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuaW52ZXJzZVNpZGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb3ZhbCA9IHZhbHVlO1xuICAgICAgICAgICAgaWYgKG92YWwuZW5kc1dpdGgoXCIoam9pbilcIikpIHtcbiAgICAgICAgICAgICAgICBvdmFsID0gb3ZhbC5yZXBsYWNlKFwiKGpvaW4pXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuam9pbiA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmpvaW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaW52ZXJzZVNpZGUgPSBvdmFsO1xuICAgICAgICAgICAgdmFyIHJmaWVsZCA9IHRoaXMuZ2V0UmV2ZXJzZUZpZWxkKCk7XG5cbiAgICAgICAgICAgIGlmIChyZmllbGQgPT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbnZlcnNlU2lkZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcInJlbGF0aW9uIG5vdCBmb3VuZFwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9zZXQgdGhlIHJlbGF0aW9uIG9uIHRoZSByZXZlcnNlIHNpZGVcbiAgICAgICAgICAgIGlmICghcmZpZWxkLmludmVyc2VTaWRlPy5lbmRzV2l0aChcIi5cIiArIHRoaXMubmFtZSkpXG4gICAgICAgICAgICAgICAgcmZpZWxkLmludmVyc2VTaWRlID0gXCJlLlwiICsgdGhpcy5uYW1lO1xuICAgICAgICAgICAgaWYgKHRoaXMudHlwZS5lbmRzV2l0aChcIltdXCIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJmaWVsZC50eXBlLmVuZHNXaXRoKFwiW11cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbiA9IFwiTWFueVRvTWFueVwiO1xuICAgICAgICAgICAgICAgICAgICAvL3NldHMgdGhlIGpvaW4gaW4gdGhlIG90aGVyXG4gICAgICAgICAgICAgICAgICAgIHJmaWVsZC5qb2luID0gIXRoaXMuam9pbjtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVsYXRpb24gPSBcIk9uZVRvTWFueVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJmaWVsZC50eXBlLmVuZHNXaXRoKFwiW11cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbiA9IFwiTWFueVRvT25lXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWxhdGlvbiA9IFwiT25lVG9PbmVcIjtcbiAgICAgICAgICAgICAgICAgICAgLy9zZXRzIHRoZSBqb2luIGluIHRoZSBvdGhlclxuICAgICAgICAgICAgICAgICAgICByZmllbGQuam9pbiA9ICF0aGlzLmpvaW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5leHBvcnQgY2xhc3MgRGF0YWJhc2VDbGFzcyB7XG4gICAgZmlsZW5hbWU6IHN0cmluZztcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZmllbGRzOiBEYXRhYmFzZUZpZWxkW10gPSBbXTtcbiAgICBwcm9wZXJ0aWVzOiBhbnk7XG4gICAgcGFyZW50OiBEYXRhYmFzZVNjaGVtYTtcbiAgICBzaW1wbGVjbGFzc25hbWU6IHN0cmluZztcbiAgICBnZXRGaWVsZChuYW1lOiBzdHJpbmcpOiBEYXRhYmFzZUZpZWxkIHtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7eCA8IHRoaXMuZmllbGRzLmxlbmd0aDt4KyspIHtcbiAgICAgICAgICAgIHZhciBjbCA9IHRoaXMuZmllbGRzW3hdO1xuICAgICAgICAgICAgaWYgKGNsLm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cblxudmFyIGNsYXNzbm9kZSA9IHVuZGVmaW5lZDtcbkAkQ2xhc3MoXCJqYXNzaS5iYXNlLkRhdGFiYXNlU2NoZW1hXCIpXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VTY2hlbWEge1xuICAgIHN0YXRpYyBiYXNpY2RhdGF0eXBlcyA9IFtcInN0cmluZ1wiLCBcImludFwiLCBcImRlY2ltYWxcIiwgXCJib29sZWFuXCIsXCJEYXRlXCJdO1xuICAgIGRhdGFiYXNlQ2xhc3NlczogRGF0YWJhc2VDbGFzc1tdID0gW107XG4gICAgcHJpdmF0ZSBwYXJzZWRDbGFzc2VzOiB7IFtjbGFzc25hbWU6IHN0cmluZ106IFBhcnNlZENsYXNzIH07XG4gICAgLy9BUnxkZS9BUlxuICAgIHByaXZhdGUgZGVmaW5lZEltcG9ydHM6IHsgW2ltcG9ydG5hbWU6IHN0cmluZ106IFBhcnNlZENsYXNzIH07XG4gICAgZ2V0Q2xhc3MobmFtZTogc3RyaW5nKTogRGF0YWJhc2VDbGFzcyB7XG4gICAgICAgIGZvciAodmFyIHggPSAwO3ggPCB0aGlzLmRhdGFiYXNlQ2xhc3Nlcy5sZW5ndGg7eCsrKSB7XG4gICAgICAgICAgICB2YXIgY2wgPSB0aGlzLmRhdGFiYXNlQ2xhc3Nlc1t4XTtcbiAgICAgICAgICAgIGlmIChjbC5uYW1lID09PSBuYW1lKVxuICAgICAgICAgICAgICAgIHJldHVybiBjbDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvL3R5cGUgPT4gQVJaZWlsZVxuICAgIHByaXZhdGUgZ2V0RnVsbHR5cGUodHlwZTogc3RyaW5nLCBwYXJzZWRDbGFzczogUGFyc2VkQ2xhc3MpIHtcbiAgICAgICAgdmFyIHBvcyA9IHR5cGUubGFzdEluZGV4T2YoXCI+XCIpO1xuICAgICAgICBpZiAocG9zID4gLTEpXG4gICAgICAgICAgICB0eXBlID0gdHlwZS5zdWJzdHJpbmcocG9zICsgMSkudHJpbSgpO1xuICAgICAgICB2YXIgZmlsZSA9IHBhcnNlZENsYXNzLnBhcmVudC5pbXBvcnRzW3R5cGVdO1xuICAgICAgICBpZih0eXBlPT09cGFyc2VkQ2xhc3MubmFtZSlcbiAgICAgICAgICAgIHJldHVybiBwYXJzZWRDbGFzcy5mdWxsQ2xhc3NuYW1lO1xuICAgICAgICB2YXIgcmV0ID0gdGhpcy5kZWZpbmVkSW1wb3J0c1t0eXBlICsgXCJ8XCIgKyBmaWxlXTtcbiAgICAgICAgaWYgKCFyZXQpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiSW1wb3J0IG5vdCBmb3VuZCBcIiArIHBhcnNlZENsYXNzLmZ1bGxDbGFzc25hbWUgKyBcIiA6IFwiICsgdHlwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgcHJpdmF0ZSBjcmVhdGVEQkNsYXNzKGNsOiBEYXRhYmFzZUNsYXNzKSB7XG4gICAgICAgIHZhciBzY29kZSA9IFRlbXBsYXRlREJPYmplY3QuY29kZS5yZXBsYWNlQWxsKFwie3tmdWxsY2xhc3NuYW1lfX1cIiwgY2wubmFtZSk7XG4gICAgICAgIHZhciBmaWxlID0gY2wubmFtZS5yZXBsYWNlQWxsKFwiLlwiLCBcIi9cIikgKyBcIi50c1wiO1xuICAgICAgICBmaWxlPWZpbGUuc3Vic3RyaW5nKDAsZmlsZS5pbmRleE9mKFwiL1wiKSkrXCIvcmVtb3RlXCIrXCIvXCIrZmlsZS5zdWJzdHJpbmcoZmlsZS5pbmRleE9mKFwiL1wiKSsxKTtcbiAgICAgICAgY2wuZmlsZW5hbWUgPSBmaWxlO1xuICAgICAgICBjbC5zaW1wbGVjbGFzc25hbWUgPSBjbC5uYW1lLnNwbGl0KFwiLlwiKVtjbC5uYW1lLnNwbGl0KFwiLlwiKS5sZW5ndGggLSAxXTtcbiAgICAgICAgc2NvZGUgPSBzY29kZS5yZXBsYWNlQWxsKFwie3tjbGFzc25hbWV9fVwiLCBjbC5zaW1wbGVjbGFzc25hbWUpO1xuICAgICAgICBzY29kZSA9IHNjb2RlLnJlcGxhY2VBbGwoXCJ7e1ByaW1hcnlBbm5vdGF0b3J9fVwiLCBcIkBcIiArIGNsLmdldEZpZWxkKFwiaWRcIikucmVsYXRpb24gKyBcIigpXCIpO1xuICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xuICAgICAgICBwYXJzZXIucGFyc2Uoc2NvZGUpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyc2VyLmNsYXNzZXMpIHtcbiAgICAgICAgICAgIHZhciBwY2xhc3MgPSBwYXJzZXIuY2xhc3Nlc1trZXldO1xuICAgICAgICAgICAgcGNsYXNzW1wiZmlsZW5hbWVcIl0gPSBmaWxlO1xuICAgICAgICAgICAgaWYgKHBjbGFzcy5kZWNvcmF0b3JbXCIkREJPYmplY3RcIl0pIHtcbiAgICAgICAgICAgICAgICAvL3ZhciBkYmNsYXNzPXBjbGFzcy5kZWNvcmF0b3JbXCIkQ2xhc3NcIl0ucGFyYW1bMF07XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZWRDbGFzc2VzW3BjbGFzcy5mdWxsQ2xhc3NuYW1lXSA9IHBjbGFzcztcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmluZWRJbXBvcnRzW3BjbGFzcy5uYW1lICsgXCJ8XCIgKyBmaWxlLnN1YnN0cmluZygwLCBmaWxlLmxlbmd0aCAtIDMpXSA9IHBjbGFzcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBwcml2YXRlIGNyZWF0ZURCRmllbGQoZmllbGQ6IERhdGFiYXNlRmllbGQsIGRiY2w6IERhdGFiYXNlQ2xhc3MpIHtcbiAgICAgICAgdmFyIGRlY3MgPSB7fTtcbiAgICAgICAgaWYgKGZpZWxkLmpvaW4gJiYgZmllbGQucmVsYXRpb24gPT09IFwiT25lVG9PbmVcIilcbiAgICAgICAgICAgIGRlY3NbXCJKb2luQ29sdW1uXCJdID0geyBuYW1lOiBcIkpvaW5Db2x1bW5cIiwgcGFyYW1ldGVyOiBbXSB9O1xuICAgICAgICBpZiAoZmllbGQuam9pbiAmJiBmaWVsZC5yZWxhdGlvbiA9PT0gXCJNYW55VG9NYW55XCIpXG4gICAgICAgICAgICBkZWNzW1wiSm9pblRhYmxlXCJdID0geyBuYW1lOiBcIkpvaW5UYWJsZVwiLCBwYXJhbWV0ZXI6IFtdIH07XG4gICAgICAgIHZhciByZWFsdHlwZSA9IGZpZWxkLnR5cGU7XG4gICAgICAgIHZhciByZWFscHJvcHMgPSBmaWVsZC5wcm9wZXJ0aWVzO1xuICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJkZWNpbWFsXCIpIHtcbiAgICAgICAgICAgIHJlYWx0eXBlID0gXCJudW1iZXJcIjtcbiAgICAgICAgICAgIGlmICghcmVhbHByb3BzKVxuICAgICAgICAgICAgICAgIHJlYWxwcm9wcyA9IHt9O1xuICAgICAgICAgICAgcmVhbHByb3BzLnR5cGUgPSBcImRlY2ltYWxcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJpbnRcIilcbiAgICAgICAgICAgIHJlYWx0eXBlID0gXCJudW1iZXJcIjtcbiAgICAgICAgdmFyIHMgPSByZWFscHJvcHMgPyBUb29scy5vYmplY3RUb0pzb24ocmVhbHByb3BzLCB1bmRlZmluZWQsIGZhbHNlKT8ucmVwbGFjZUFsbChcIlxcblwiLCBcIlwiKSA6IHVuZGVmaW5lZDtcblxuICAgICAgICB2YXIgcCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKCFmaWVsZC5yZWxhdGlvbiB8fCBmaWVsZC5yZWxhdGlvbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgaWYgKHMpXG4gICAgICAgICAgICAgICAgcCA9IFtzXTtcbiAgICAgICAgICAgIGRlY3NbXCJDb2x1bW5cIl0gPSB7IG5hbWU6IFwiQ29sdW1uXCIsIHBhcmFtZXRlcjogcCB9O1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnJlbGF0aW9uID09PSBcIlByaW1hcnlDb2x1bW5cIiB8fCBmaWVsZC5yZWxhdGlvbiA9PT0gXCJQcmltYXJ5R2VuZXJhdGVkQ29sdW1uXCIpIHtcbiAgICAgICAgICAgIGlmIChzKVxuICAgICAgICAgICAgICAgIHAgPSBbc107XG4gICAgICAgICAgICBkZWNzW2ZpZWxkLnJlbGF0aW9uXSA9IHsgbmFtZTogZmllbGQucmVsYXRpb24sIHBhcmFtZXRlcjogcCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xuICAgICAgICAgICAgdmFyIHRjbCA9IGZpZWxkLnR5cGUucmVwbGFjZShcIltdXCIsIFwiXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZWFsdHlwZSA9IHRoaXMuZ2V0Q2xhc3ModGNsKS5zaW1wbGVjbGFzc25hbWU7XG4gICAgICAgICAgICBpZihkYmNsLm5hbWUhPT10Y2wpXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZWRDbGFzc2VzW2RiY2wubmFtZV0ucGFyZW50LmFkZEltcG9ydElmTmVlZGVkKHJlYWx0eXBlLCB0aGlzLmdldENsYXNzKHRjbCkuZmlsZW5hbWUuc3Vic3RyaW5nKDAsdGhpcy5nZXRDbGFzcyh0Y2wpLmZpbGVuYW1lLmxlbmd0aC0zKSk7XG4gICAgICAgICAgICBsZXQgc2NsPXRjbDtcbiAgICAgICAgICAgIGlmKHNjbC5pbmRleE9mKFwiLlwiKT4tMSl7XG4gICAgICAgICAgICAgICAgc2NsPXNjbC5zdWJzdHJpbmcoc2NsLmxhc3RJbmRleE9mKFwiLlwiKSsxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmFtcy5wdXNoKFwidHlwZSA9PiBcIiArIHNjbCk7XG4gICAgICAgICAgICBpZiAoZmllbGQuaW52ZXJzZVNpZGUgJiYgZmllbGQuaW52ZXJzZVNpZGUgIT09IFwiXCIpXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goZmllbGQuaW52ZXJzZVNpZGUpO1xuICAgICAgICAgICAgaWYgKHMpXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2gocyk7XG4gICAgICAgICAgICBkZWNzW2ZpZWxkLnJlbGF0aW9uXSA9IHsgbmFtZTogZmllbGQucmVsYXRpb24sIHBhcmFtZXRlcjogcGFyYW1zIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJzZWRDbGFzc2VzW2RiY2wubmFtZV0ucGFyZW50LmFkZE9yTW9kaWZ5TWVtYmVyKHsgbmFtZTogZmllbGQubmFtZSwgdHlwZTogcmVhbHR5cGUsIGRlY29yYXRvcjogZGVjcyB9LCB0aGlzLnBhcnNlZENsYXNzZXNbZGJjbC5uYW1lXSk7XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgcmVsb2FkQ29kZUluRWRpdG9yKGZpbGU6IHN0cmluZywgdGV4dDogc3RyaW5nKSB7XG4gICAgICAgIHZhciBlZGl0b3IgPSB3aW5kb3dzLmZpbmRDb21wb25lbnQoXCJqYXNzaV9lZGl0b3IuQ29kZUVkaXRvci1cIiArIGZpbGUpO1xuICAgICAgICBpZiAoZWRpdG9yICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgaWYgKGVkaXRvci5fY29kZVRvUmVsb2FkID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gYXdhaXQgT3B0aW9uRGlhbG9nLnNob3coXCJUaGUgc291cmNlIHdhcyB1cGRhdGVkIGluIENocm9tZS4gRG8geW91IHdhbnQgdG8gbG9hZCB0aGlzIG1vZGlmaWNhdGlvbj9cIiwgW1wiWWVzXCIsIFwiTm9cIl0sIGVkaXRvciwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmJ1dHRvbiA9PT0gXCJZZXNcIilcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yLnZhbHVlID0gdGV4dDtcbiAgICAgICAgICAgICAgICBkZWxldGUgZWRpdG9yLl9jb2RlVG9SZWxvYWQ7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyB1cGRhdGVTY2hlbWEob25seVByZXZpZXc6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgICAgIC8vL3RvZG8gd2VubiBrZWluIGJhc2ljZmllbGR0eXBlIG11c3MgZWluZSBCZXppZWh1bmcgaGludGVybGVndCBzZWluIHRocm93IEVycm9yXG4gICAgICAgIHZhciBjaGFuZ2VzID0gXCJcIjtcbiAgICAgICAgdmFyIG9yZyA9IG5ldyBEYXRhYmFzZVNjaGVtYSgpO1xuICAgICAgICBhd2FpdCBvcmcubG9hZFNjaGVtYUZyb21Db2RlKCk7XG4gICAgICAgIHZhciBtb2RpZmllZGNsYXNzZXM6IERhdGFiYXNlQ2xhc3NbXSA9IFtdO1xuICAgICAgICAvL2NoZWNrIHJlbGF0aW9uc1xuICAgICAgICBmb3IgKHZhciB4ID0gMDt4IDwgdGhpcy5kYXRhYmFzZUNsYXNzZXMubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgdmFyIGRiY2wgPSB0aGlzLmRhdGFiYXNlQ2xhc3Nlc1t4XTtcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwO3kgPCBkYmNsLmZpZWxkcy5sZW5ndGg7eSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGYgPSBkYmNsLmZpZWxkc1t5XTtcbiAgICAgICAgICAgICAgICBpZiAoRGF0YWJhc2VTY2hlbWEuYmFzaWNkYXRhdHlwZXMuaW5kZXhPZihmLnR5cGUpID09PSAtMSAmJiAoZi5yZWxhdGlvbiA9PT0gdW5kZWZpbmVkIHx8IGYucmVsYXRpb24gPT09IFwiXCIpKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIlJlbGF0aW9uIG11c3QgYmUgZmlsbGVkIFwiICsgZGJjbC5uYW1lICsgXCIgZmllbGQgXCIgKyBmLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHggPSAwO3ggPCB0aGlzLmRhdGFiYXNlQ2xhc3Nlcy5sZW5ndGg7eCsrKSB7XG4gICAgICAgICAgICB2YXIgZGJjbCA9IHRoaXMuZGF0YWJhc2VDbGFzc2VzW3hdO1xuICAgICAgICAgICAgaWYgKG9yZy5nZXRDbGFzcyhkYmNsLm5hbWUpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzICs9IFwiY3JlYXRlIGNsYXNzIFwiICsgZGJjbC5uYW1lICsgXCJcXG5cIjtcbiAgICAgICAgICAgICAgICBtb2RpZmllZGNsYXNzZXMucHVzaChkYmNsKTtcbiAgICAgICAgICAgICAgICBpZiAoIW9ubHlQcmV2aWV3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlREJDbGFzcyhkYmNsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDt5IDwgZGJjbC5maWVsZHMubGVuZ3RoO3krKykge1xuICAgICAgICAgICAgICAgIHZhciBmaWVsZCA9IGRiY2wuZmllbGRzW3ldO1xuICAgICAgICAgICAgICAgIHZhciBmb3JnID0gb3JnLmdldENsYXNzKGRiY2wubmFtZSk/LmdldEZpZWxkKGZpZWxkLm5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChvcmcuZ2V0Q2xhc3MoZGJjbC5uYW1lKSA9PT0gdW5kZWZpbmVkIHx8IGZvcmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzICs9IFwiY3JlYXRlIGZpZWxkIFwiICsgZGJjbC5uYW1lICsgXCI6IFwiICsgZmllbGQubmFtZSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RpZmllZGNsYXNzZXMuaW5kZXhPZihkYmNsKSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllZGNsYXNzZXMucHVzaChkYmNsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvbmx5UHJldmlldykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVEQkZpZWxkKGZpZWxkLCBkYmNsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBqZmllbGQgPSBKU09OLnN0cmluZ2lmeShmaWVsZC5wcm9wZXJ0aWVzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGpvcmcgPSBKU09OLnN0cmluZ2lmeShmb3JnLnByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRqb2luID0gZmllbGQuam9pbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZpZWxkam9pbiA9PT0gZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZGpvaW4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC50eXBlICE9PSBmb3JnLnR5cGUgfHwgZmllbGQuaW52ZXJzZVNpZGUgIT09IGZvcmcuaW52ZXJzZVNpZGUgfHwgZmllbGQucmVsYXRpb24gIT09IGZvcmcucmVsYXRpb24gfHwgamZpZWxkICE9PSBqb3JnIHx8IGZpZWxkam9pbiAhPT0gZm9yZy5qb2luKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VzICs9IFwibW9kaWZ5IGRlb3JhdG9yIGZpZWxkIFwiICsgZGJjbC5uYW1lICsgXCI6IFwiICsgZmllbGQubmFtZSArIFwiXFxuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobW9kaWZpZWRjbGFzc2VzLmluZGV4T2YoZGJjbCkgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVkY2xhc3Nlcy5wdXNoKGRiY2wpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvbmx5UHJldmlldykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlREJGaWVsZChmaWVsZCwgZGJjbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgIHZhciBjb250ZW50czogc3RyaW5nW10gPSBbXTtcbiAgICAgICAgaWYgKCFvbmx5UHJldmlldykge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7eCA8IG1vZGlmaWVkY2xhc3Nlcy5sZW5ndGg7eCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1jbCA9IG1vZGlmaWVkY2xhc3Nlc1t4XTtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMucGFyc2VkQ2xhc3Nlc1ttY2wubmFtZV0ucGFyZW50LmdldE1vZGlmaWVkQ29kZSgpO1xuICAgICAgICAgICAgICAgIGZpbGVzLnB1c2gobWNsLmZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICBjb250ZW50cy5wdXNoKHRleHQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG1jbC5maWxlbmFtZSArIFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRleHQgKyBcIlxcblwiKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgU2VydmVyKCkuc2F2ZUZpbGVzKGZpbGVzLCBjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IDA7eSA8IGZpbGVzLmxlbmd0aDt5KyspXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVsb2FkQ29kZUluRWRpdG9yKGZpbGVzW3ldLCBjb250ZW50c1t5XSk7XG4gICAgICAgICAgICB9IGNhdGNoIChwZXJyKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQocGVyci5tZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hhbmdlcztcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3luYyBwYXJzZUZpbGVzKCkge1xuICAgICAgICB0aGlzLnBhcnNlZENsYXNzZXMgPSB7fTtcbiAgICAgICAgdGhpcy5kZWZpbmVkSW1wb3J0cyA9IHt9O1xuICAgICAgICB2YXIgZGF0YSA9IGF3YWl0IHJlZ2lzdHJ5LmdldEpTT05EYXRhKFwiJERCT2JqZWN0XCIpO1xuICAgICAgICBkYXRhLmZvckVhY2goKGVudHIpID0+IHtcbiAgICAgICAgICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XG4gICAgICAgICAgICB2YXIgZmlsZSA9IGVudHIuZmlsZW5hbWU7XG4gICAgICAgICAgICB2YXIgY29kZSA9IHR5cGVzY3JpcHQuZ2V0Q29kZShmaWxlKTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgIHBhcnNlci5wYXJzZShjb2RlKTtcbiAgICAgICAgICAgIH1jYXRjaChlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJlcnJvciBpbiBwYXJzaW5nIFwiK2ZpbGUpO1xuICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJzZXIuY2xhc3Nlcykge1xuICAgICAgICAgICAgICAgIHZhciBwY2xhc3MgPSBwYXJzZXIuY2xhc3Nlc1trZXldO1xuICAgICAgICAgICAgICAgIHBjbGFzc1tcImZpbGVuYW1lXCJdID0gZmlsZTtcbiAgICAgICAgICAgICAgICBpZiAocGNsYXNzLmRlY29yYXRvcltcIiREQk9iamVjdFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAvL3ZhciBkYmNsYXNzPXBjbGFzcy5kZWNvcmF0b3JbXCIkQ2xhc3NcIl0ucGFyYW1bMF07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyc2VkQ2xhc3Nlc1twY2xhc3MuZnVsbENsYXNzbmFtZV0gPSBwY2xhc3M7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmaW5lZEltcG9ydHNbcGNsYXNzLm5hbWUgKyBcInxcIiArIGZpbGUuc3Vic3RyaW5nKDAsIGZpbGUubGVuZ3RoIC0gMyldID0gcGNsYXNzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFzeW5jIGxvYWRTY2hlbWFGcm9tQ29kZSgpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5wYXJzZUZpbGVzKCk7XG4gICAgICAgIC8vYXdhaXQgcmVnaXN0cnkubG9hZEFsbEZpbGVzRm9yU2VydmljZShcIiREQk9iamVjdFwiKVxuICAgICAgICB2YXIgZGF0YSA9IHJlZ2lzdHJ5LmdldEpTT05EYXRhKFwiJERCT2JqZWN0XCIpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlQ2xhc3NlcyA9IFtdO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAoYXdhaXQgZGF0YSkuZm9yRWFjaCgoZW50cikgPT4ge1xuICAgICAgICAgICAgdmFyIGRiY2xhc3MgPSBuZXcgRGF0YWJhc2VDbGFzcygpO1xuICAgICAgICAgICAgZGJjbGFzcy5uYW1lID0gZW50ci5jbGFzc25hbWU7XG4gICAgICAgICAgICBkYmNsYXNzLnBhcmVudCA9IF90aGlzO1xuICAgICAgICAgICAgdGhpcy5kYXRhYmFzZUNsYXNzZXMucHVzaChkYmNsYXNzKTtcbiAgICAgICAgICAgIHZhciBwY2xhc3MgPSB0aGlzLnBhcnNlZENsYXNzZXNbZW50ci5jbGFzc25hbWVdO1xuICAgICAgICAgICAgZGJjbGFzcy5maWxlbmFtZSA9IHBjbGFzc1tcImZpbGVuYW1lXCJdO1xuICAgICAgICAgICAgZGJjbGFzcy5zaW1wbGVjbGFzc25hbWUgPSBwY2xhc3MubmFtZTtcbiAgICAgICAgICAgIGRiY2xhc3MubmFtZSA9IHBjbGFzcy5mdWxsQ2xhc3NuYW1lO1xuICAgICAgICAgICAgZm9yICh2YXIgZm5hbWUgaW4gcGNsYXNzLm1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGZpZWxkID0gcGNsYXNzLm1lbWJlcnNbZm5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghcGZpZWxkLmRlY29yYXRvcltcIkNvbHVtblwiXSAmJiAhcGZpZWxkLmRlY29yYXRvcltcIlByaW1hcnlDb2x1bW5cIl0gJiYgIXBmaWVsZC5kZWNvcmF0b3JbXCJQcmltYXJ5R2VuZXJhdGVkQ29sdW1uXCJdICYmICFwZmllbGQuZGVjb3JhdG9yW1wiT25lVG9PbmVcIl0gJiYgIXBmaWVsZC5kZWNvcmF0b3JbXCJNYW55VG9PbmVcIl0gJiYgIXBmaWVsZC5kZWNvcmF0b3JbXCJPbmVUb01hbnlcIl0gJiYgIXBmaWVsZC5kZWNvcmF0b3JbXCJNYW55VG9NYW55XCJdKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB2YXIgZmllbGQgPSBuZXcgRGF0YWJhc2VGaWVsZCgpO1xuICAgICAgICAgICAgICAgIGZpZWxkW1wicGFyZW50XCJdID0gZGJjbGFzcztcbiAgICAgICAgICAgICAgICBmaWVsZC5uYW1lID0gZm5hbWU7XG4gICAgICAgICAgICAgICAgZGJjbGFzcy5maWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICAgICAgdmFyIG1ldGEgPSBwZmllbGQuZGVjb3JhdG9yO1xuXG4gICAgICAgICAgICAgICAgaWYgKG1ldGFbXCJQcmltYXJ5Q29sdW1uXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkLnJlbGF0aW9uID0gXCJQcmltYXJ5Q29sdW1uXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhW1wiUHJpbWFyeUdlbmVyYXRlZENvbHVtblwiXSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5yZWxhdGlvbiA9IFwiUHJpbWFyeUNvbHVtblwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YVtcIkNvbHVtblwiXSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5yZWxhdGlvbiA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICAvL3ZhciBtdD1tdHlwZVswXVswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1ldGFbXCJDb2x1bW5cIl0ucGFyYW1ldGVyLmxlbmd0aCA+IDAgJiYgbWV0YVtcIkNvbHVtblwiXS5wYXJhbWV0ZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQucHJvcGVydGllcyA9IG1ldGFbXCJDb2x1bW5cIl0ucGFyc2VkUGFyYW1ldGVyWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGFbXCJNYW55VG9PbmVcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQucmVsYXRpb24gPSBcIk1hbnlUb09uZVwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVtcIk1hbnlUb09uZVwiXS5wYXJhbWV0ZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7eCA8IG1ldGFbXCJNYW55VG9PbmVcIl0ucGFyYW1ldGVyLmxlbmd0aDt4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmQgPSBtZXRhW1wiTWFueVRvT25lXCJdLnBhcmFtZXRlclt4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gdGhpcy5nZXRGdWxsdHlwZShtZXRhW1wiTWFueVRvT25lXCJdLnBhcmFtZXRlclswXSwgcGNsYXNzKS5mdWxsQ2xhc3NuYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbWV0YVtcIk1hbnlUb09uZVwiXS5wYXJhbWV0ZXJbeF0uc3RhcnRzV2l0aChcIntcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmludmVyc2VTaWRlID0gdmQuc3BsaXQoXCI+XCIpWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnByb3BlcnRpZXMgPSBtZXRhW1wiTWFueVRvT25lXCJdLnBhcnNlZFBhcmFtZXRlclt4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YVtcIk9uZVRvTWFueVwiXSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5yZWxhdGlvbiA9IFwiT25lVG9NYW55XCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhW1wiT25lVG9NYW55XCJdLnBhcmFtZXRlci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDt4IDwgbWV0YVtcIk9uZVRvTWFueVwiXS5wYXJhbWV0ZXIubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2ZCA9IG1ldGFbXCJPbmVUb01hbnlcIl0ucGFyYW1ldGVyW3hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0aGlzLmdldEZ1bGx0eXBlKG1ldGFbXCJPbmVUb01hbnlcIl0ucGFyYW1ldGVyWzBdLCBwY2xhc3MpLmZ1bGxDbGFzc25hbWUgKyBcIltdXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFtZXRhW1wiT25lVG9NYW55XCJdLnBhcmFtZXRlclt4XS5zdGFydHNXaXRoKFwie1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuaW52ZXJzZVNpZGUgPSB2ZC5zcGxpdChcIj5cIilbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQucHJvcGVydGllcyA9IG1ldGFbXCJPbmVUb01hbnlcIl0ucGFyc2VkUGFyYW1ldGVyW3hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhW1wiTWFueVRvTWFueVwiXSkge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5yZWxhdGlvbiA9IFwiTWFueVRvTWFueVwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVtcIk1hbnlUb01hbnlcIl0ucGFyYW1ldGVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwO3ggPCBtZXRhW1wiTWFueVRvTWFueVwiXS5wYXJhbWV0ZXIubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB2ZCA9IG1ldGFbXCJNYW55VG9NYW55XCJdLnBhcmFtZXRlclt4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoeCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gdGhpcy5nZXRGdWxsdHlwZShtZXRhW1wiTWFueVRvTWFueVwiXS5wYXJhbWV0ZXJbMF0sIHBjbGFzcykuZnVsbENsYXNzbmFtZSArIFwiW11cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1ldGFbXCJNYW55VG9NYW55XCJdLnBhcmFtZXRlclt4XS5zdGFydHNXaXRoKFwie1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQuaW52ZXJzZVNpZGUgPSB2ZC5zcGxpdChcIj5cIilbMV0udHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQucHJvcGVydGllcyA9IG1ldGFbXCJNYW55VG9NYW55XCJdLnBhcnNlZFBhcmFtZXRlclt4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobWV0YVtcIkpvaW5UYWJsZVwiXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmpvaW4gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtZXRhW1wiT25lVG9PbmVcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGQucmVsYXRpb24gPSBcIk9uZVRvT25lXCI7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhW1wiT25lVG9PbmVcIl0ucGFyYW1ldGVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwO3ggPCBtZXRhW1wiT25lVG9PbmVcIl0ucGFyYW1ldGVyLmxlbmd0aDt4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmQgPSBtZXRhW1wiT25lVG9PbmVcIl0ucGFyYW1ldGVyW3hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSB0aGlzLmdldEZ1bGx0eXBlKG1ldGFbXCJPbmVUb09uZVwiXS5wYXJhbWV0ZXJbMF0sIHBjbGFzcykuZnVsbENsYXNzbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1ldGFbXCJPbmVUb09uZVwiXS5wYXJhbWV0ZXJbeF0uc3RhcnRzV2l0aChcIntcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmludmVyc2VTaWRlID0gdmQuc3BsaXQoXCI+XCIpWzFdLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnByb3BlcnRpZXMgPSBtZXRhW1wiT25lVG9PbmVcIl0ucGFyc2VkUGFyYW1ldGVyW3hdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhW1wiSm9pbkNvbHVtblwiXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLmpvaW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtZXRhW1wiUHJpbWFyeUNvbHVtblwiXSB8fCBtZXRhW1wiUHJpbWFyeUdlbmVyYXRlZENvbHVtblwiXSB8fCBtZXRhW1wiQ29sdW1uXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cCA9IHBmaWVsZC50eXBlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHAgPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gXCJzdHJpbmdcIjtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHAgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gXCJpbnRcIjtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHAgPT09IFwiYm9vbGVhblwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQudHlwZSA9IFwiYm9vbGVhblwiO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0cCA9PT0gXCJEYXRlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZC50eXBlID0gXCJEYXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInR5cGUgdW5rbm93biBcIiArIGRiY2xhc3MubmFtZSArIFwiOlwiICsgZmllbGQubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWVsZC5wcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQgJiYgZmllbGQucHJvcGVydGllc1tcInR5cGVcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkLnR5cGUgPSBmaWVsZC5wcm9wZXJ0aWVzW1widHlwZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuLypcbkAkQ2xhc3MoXCJqYXNzaS5iYXNlLkRhdGFiYXNlQ29sdW1uT3B0aW9uc1wiKVxuY2xhc3MgQ29sdW1uT3B0aW9uc3tcbi8vXHRAJFByb3BlcnR5KHt0eXBlOlwic3RyaW5nXCIsY2hvb3NlRnJvbTpEYXRhYmFzZVNjaGVtYS5iYXNpY2RhdGF0eXBlcyxkZXNjcmlwdGlvbjpcIkNvbHVtbiB0eXBlLiBNdXN0IGJlIG9uZSBvZiB0aGUgdmFsdWUgZnJvbSB0aGUgQ29sdW1uVHlwZXMgY2xhc3MuXCJ9KVxuICAvLyAgdHlwZT86IENvbHVtblR5cGU7XG4gICAgQCRQcm9wZXJ0eSh7ZGVzY3JpcHRpb246XCJJbmRpY2F0ZXMgaWYgY29sdW1uJ3MgdmFsdWUgY2FuIGJlIHNldCB0byBOVUxMLlwiLCBkZWZhdWx0OmZhbHNlfSkgXG5cdG51bGxhYmxlPzogYm9vbGVhbjtcbiAgICBAJFByb3BlcnR5KHt0eXBlOlwic3RyaW5nXCIsZGVzY3JpcHRpb246XCJEZWZhdWx0IGRhdGFiYXNlIHZhbHVlLlwifSkgXG5cdGRlZmF1bHQ/OiBhbnk7XG4gICAgQCRQcm9wZXJ0eSh7ZGVzY3JpcHRpb246XCJJbmRpY2F0ZXMgaWYgY29sdW1uIGlzIGFsd2F5cyBzZWxlY3RlZCBieSBRdWVyeUJ1aWxkZXIgYW5kIGZpbmQgb3BlcmF0aW9ucy5cIixkZWZhdWx0OnRydWV9KVxuXHRAJFByb3BlcnR5KHtkZXNjcmlwdGlvbjonQ29sdW1uIHR5cGVzIGxlbmd0aC4gVXNlZCBvbmx5IG9uIHNvbWUgY29sdW1uIHR5cGVzLiBGb3IgZXhhbXBsZSB0eXBlID0gXCJzdHJpbmdcIiBhbmQgbGVuZ3RoID0gXCIxMDBcIiBtZWFucyB0aGF0IE9STSB3aWxsIGNyZWF0ZSBhIGNvbHVtbiB3aXRoIHR5cGUgdmFyY2hhcigxMDApLid9KVxuICAgIGxlbmd0aD86IG51bWJlcjtcbiAgICBbbmFtZTpzdHJpbmddOmFueTtcbn0qL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHNjaGVtYSA9IG5ldyBEYXRhYmFzZVNjaGVtYSgpO1xuICAgIGF3YWl0IHNjaGVtYS5sb2FkU2NoZW1hRnJvbUNvZGUoKTtcbiAgICB2YXIgc2NoZW1hMiA9IG5ldyBEYXRhYmFzZVNjaGVtYSgpO1xuICAgIGF3YWl0IHNjaGVtYTIubG9hZFNjaGVtYUZyb21Db2RlKCk7XG5cbiAgICB2YXIgdGVzdCA9IG5ldyBEYXRhYmFzZUNsYXNzKCk7XG4gICAgdGVzdC5wYXJlbnQgPSBzY2hlbWEyO1xuICAgIHRlc3QubmFtZSA9IFwiZGUuTmV1ZXJLdW5kZVwiO1xuICAgIHZhciB0ZXN0ZiA9IG5ldyBEYXRhYmFzZUZpZWxkKCk7XG4gICAgdGVzdGYubmFtZSA9IFwiaWRcIjtcbiAgICB0ZXN0Zi50eXBlID0gXCJpbnRcIjtcbiAgICB0ZXN0Zi5yZWxhdGlvbiA9IFwiUHJpbWFyeUNvbHVtblwiO1xuICAgIHRlc3QuZmllbGRzLnB1c2godGVzdGYpO1xuICAgIHNjaGVtYTIuZGF0YWJhc2VDbGFzc2VzLnB1c2godGVzdCk7XG4gICAgdmFyIGYgPSBuZXcgRGF0YWJhc2VGaWVsZCgpO1xuICAgIGYubmFtZSA9IFwiaGFsbG9cIjtcbiAgICBmLnR5cGUgPSBcInN0cmluZ1wiO1xuICAgIHNjaGVtYTIuZ2V0Q2xhc3MoXCJkZS5BUlwiKS5maWVsZHMucHVzaChmKTtcbiAgICBzY2hlbWEyLmdldENsYXNzKFwiZGUuQVJcIikuZ2V0RmllbGQoXCJudW1tZXJcIikucHJvcGVydGllcyA9IHsgbnVsbGFibGU6IGZhbHNlIH07XG4gICAgY29uc29sZS5sb2coYXdhaXQgc2NoZW1hMi51cGRhdGVTY2hlbWEodHJ1ZSkpO1xuICAgIC8vY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAvL3Rlc3QucG9wKCk7XG4gICAgLy9zY2hlbWEudmlzaXROb2RlKHNvdXJjZUZpbGUpO1xuXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0MigpIHtcbiAgICB2YXIgc2NoZW1hID0gbmV3IERhdGFiYXNlU2NoZW1hKCk7XG4gICAgYXdhaXQgc2NoZW1hLmxvYWRTY2hlbWFGcm9tQ29kZSgpO1xuICAgIHZhciBoID0gc2NoZW1hLmdldENsYXNzKFwiZGUuQVJcIikuZ2V0RmllbGQoXCJrdW5kZVwiKTtcbiAgICB2YXIgZiA9IGguZ2V0UmV2ZXJzZUZpZWxkKCk7XG4gICAgdmFyIGtrID0gZi5yZWxhdGlvbmluZm87XG4gICAgZGVidWdnZXI7XG4gICAgZi5yZWxhdGlvbmluZm8gPSBraztcbn1cblxuXG5cblxuIl19