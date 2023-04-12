import { Server } from "jassijs/remote/Server";

export async function test(){
    var g=await new Server().loadFiles(["de/remote/Kunde.ts"]);
  
}