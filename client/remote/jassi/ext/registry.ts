

 // @ts-ignore:2307 - only on serverside
import fs = require("fs");

var registry_json = "{}";
if(fs){
        if(fs.existsSync("./../client" + "/index.json")){
                registry_json= fs.readFileSync("./../client" + "/index.json").toString();
        }
}
export default registry_json;
export function reloadRegistry() {
   
        fs.readFileSync("./../client" + "/index.json");
        registry_json;

}
