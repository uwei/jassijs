import { Server } from "jassijs/remote/Server";


export async function test(){
   
        await new Server().saveFile("Hallo.ts","export class Hallo{};export function test(){return 1};",true);
    
}