
import fs = require('fs');


var  registry_json=fs.readFileSync("./../client"+"/registry.json");;

export default registry_json;
export async function reloadRegistry(){
    fs.readFileSync("./../client"+"/registry.json");
    registry_json
} 