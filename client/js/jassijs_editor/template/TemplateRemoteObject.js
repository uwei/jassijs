var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/base/Actions", "jassijs/remote/Registry", "jassijs/ui/OptionDialog", "jassijs_editor/FileExplorer"], function (require, exports, Actions_1, Registry_1, OptionDialog_1, FileExplorer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateRemoteObject = void 0;
    const code = `import { $Class } from "jassijs/remote/Registry";
import { Context, DefaultParameterValue, UseServer } from "jassijs/remote/RemoteObject";
import { ValidateFunctionParameter, ValidateIsInt, ValidateIsString } from "jassijs/remote/Validator";

@$Class("{{fullclassname}}")
export class {{name}}{

    @UseServer()
    @ValidateFunctionParameter() 
    // name must be a string - validated on client and server
    // if age is missing set 9 as default value
    public async sayHello( @ValidateIsString() name: string, @DefaultParameterValue(9) age:number=9,context?:Context) {
            //this runs serverside
            return "Hello3 "+name+"("+age+")";  //this would be execute on server  
    }

    @UseServer()
    public static async info() {
            //this runs serverside
            try{
                return "static server runs on "+(\`Node.js version: \${process.version}\`);  //this would be execute on server  
            }catch{
                return "static server runs on browser";
            }
    }
}
export async function test(){
    console.log(await new {{name}}().sayHello("Kurtt"));
    console.log(await new {{name}}().sayHello("Kurtt",10));
    console.log(await {{name}}.info());

}
`;
    let TemplateRemoteObject = class TemplateRemoteObject {
        static async newFile(all) {
            var res = await OptionDialog_1.OptionDialog.show("Enter RemoteObject name:", ["ok", "cancel"], undefined, true, "MyRemoteObject");
            if (res.button === "ok" && res.text !== all[0].name) {
                var scode = code.replaceAll("{{name}}", res.text);
                scode = scode.replaceAll("{{fullclassname}}", (all[0].fullpath + "/" + res.text).replaceAll("/", "."));
                FileExplorer_1.FileActions.newFile(all, res.text + ".ts", scode, true);
            }
        }
    };
    TemplateRemoteObject.code = code;
    __decorate([
        (0, Actions_1.$Action)({
            name: "New/RemoteObject",
            isEnabled: function (all) {
                return all[0].isDirectory() && all[0].fullpath.split("/").length > 1 && all[0].fullpath.split("/")[1] === "remote";
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateRemoteObject, "newFile", null);
    TemplateRemoteObject = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.remote.FileNode"),
        (0, Registry_1.$Class)("jassijs_editor.template.TemplateRemoteObject")
    ], TemplateRemoteObject);
    exports.TemplateRemoteObject = TemplateRemoteObject;
});
//# sourceMappingURL=TemplateRemoteObject.js.map