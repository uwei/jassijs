import  {Button} from "jassijs/ui/Button";
import {Server} from "jassijs/remote/Server";
import {Reloader} from "jassijs/util/Reloader";

import registry from "jassijs/remote/Registry";
import { Kunde } from "de/remote/Kunde";


function test(){
   //let j=import("de/DK");
    // let dk=new DK();
   // dk.destroy();
}
test();



export  class MemoryTest{
    async MemoryTest(){
        
        let server=new Server();
        let test=await server.loadFile("demo/DK.ts");
        await server.saveFile("demo/DK.ts",test);

        await Reloader.instance.reloadJS("demo/DK.js");
        delete registry.data["$Class"]["demo.DK"];
        requirejs.undef("demo/DK.js");
        requirejs.undef("demo/DK");
    }
}
