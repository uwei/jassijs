import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { JassiError } from "jassijs/remote/Classes";
import { serverservices } from "jassijs/remote/Serverservice";
import { ValidateFunctionParameter, ValidateIsArray, ValidateIsString } from "jassijs/remote/Validator";

@$Class("jassijs.remote.DatabaseTools")
export class DatabaseTools extends RemoteObject { 
    //this is a sample remote function
    @ValidateFunctionParameter()
    public static async runSQL(@ValidateIsString() sql: string, @ValidateIsArray({optional:true}) parameter: any[] = undefined, context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this.runSQL, sql, parameter, context);
        } else {
            if (!context.request.user.isAdmin)
                throw new JassiError( "only admins can delete");
            return (await serverservices.db).runSQL(context, sql, parameter); 
        }
    }
    public static async dropTables(tables: string[]): Promise<string> {
        for (var i = 0; i < tables.length; i++) {
            if ((/[A-Z,a-z,_,0-9]+/g).exec(tables[i])[0] !== tables[i]) {
                throw new JassiError(tables[i] + " is not a valid tablename");
            }
        }
        if (tables.length === 0) {
            throw new JassiError("no tables to drop")
        }
        return await DatabaseTools.runSQL("DROP TABLE " + tables.join(","));
    }
}
export async function test() {
    /*  var h=await DatabaseTools.runSQL('DROP TABLE :p1,:p2',[
                          {p1:"te_person2",
                                      p2:"tg_person"}]);//,"te_person2"]);*/
    //var h=await DatabaseTools.runSQL('select * from jassijs_rights'); 
 
}
