import { $Class } from "jassijs/remote/Jassi";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

@$Class("jassijs.remote.DatabaseTools")
export class DatabaseTools extends RemoteObject {
    //this is a sample remote function
    public static async runSQL(sql: string, parameter: any[] = undefined, context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this.runSQL, sql, parameter, context);
        } else {
            if (!context.request.user.isAdmin)
                throw "only admins can delete";
            //@ts-ignore
            var man = await (await import("jassijs/server/DBManager")).DBManager.get();
            return man.runSQL(context, sql, parameter);
        }
    }
    public static async dropTables(tables: string[]): Promise<string> {
        for (var i = 0; i < tables.length; i++) {
            if ((/[A-Z,a-z,_,0-9]+/g).exec(tables[i])[0] !== tables[i]) {
                throw new Error(tables[i] + " is not a valid tablename");
            }
        }
        if (tables.length === 0) {
            throw new Error("no tables to drop")
        }
        return await DatabaseTools.runSQL("DROP TABLE " + tables.join(","));
    }
}
export async function test() {
    /*  var h=await DatabaseTools.runSQL('DROP TABLE :p1,:p2',[
                          {p1:"te_person2",
                                      p2:"tg_person"}]);//,"te_person2"]);*/
    //var h=await DatabaseTools.runSQL('select * from $1'); 


}
