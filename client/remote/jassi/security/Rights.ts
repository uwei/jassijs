import jassi, { $Class } from "remote/jassi/base/Jassi";
import registry from "remote/jassi/base/Registry";
import { RemoteObject } from "remote/jassi/base/RemoteObject";

export class RightProperties{
    name:string;
    description?:string;
}
export class ParentRightProperties{
    name:string;
    description?:{
        text:string
        [parametername:string]:string
    };
    //e.g."id>=:i1 and id<=:i2"
    sqlToCheck:string;
}
export function $Rights(rights:RightProperties[]): Function {
    return function (pclass) {
        registry.register("$Rights", pclass, rights);
    }
}
export function $ParentRights(rights:[ParentRightProperties]): Function {
    return function (pclass) {
        registry.register("$ParentRights", pclass, rights);
    }
}
export function $CheckParentRight():Function{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            registry.registerMember("$CheckParentRight",target,propertyKey,undefined);
    }
}

@$Class("remote.jassi.security.Rights")
export class Rights extends RemoteObject{
    private _isAdmin:boolean;
    async isAdmin():Promise<boolean>{
        
        if (!jassi.isServer) {
            if(this._isAdmin!==undefined)
                return this._isAdmin;
            return await this.call(this,"isAdmin");
        } else {
            //@ts-ignore
            var req = (await import("jassi/server/getRequest")).getRequest();
            return req.user.isAdmin;
        }
    }

}
var rights=new Rights();
export default rights;