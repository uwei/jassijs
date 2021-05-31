class Settings{
    static $includeSettings(file:string):Settings{
        var ret=new Settings()
        ret["name"]=file;
        return ret;
    }
}
class Testsettings{
    static get:Testsettings=Settings.$includeSettings("a.Testsetting");
}
export function test(){
    console.log(Testsettings.name);
}