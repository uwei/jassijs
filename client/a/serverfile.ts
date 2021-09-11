import { Server } from "jassijs/remote/Server";


export async function test(){
   
        await new Server().saveFile("$serverside/Hallo.ts","export class Hallo{};export function test(){return 2};");
        console.log(await new Server().loadFile("$serverside/Hallo.ts"));//,"export class Hallo{};export function test(){return 2};");

    
}