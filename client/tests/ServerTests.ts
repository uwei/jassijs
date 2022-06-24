import registry from "jassijs/remote/Registry";
import { Test } from "jassijs/remote/Test";
import { Server } from "jassijs/remote/Server";

export async function test(tests:Test) {
        var text="export class Hallo{};export function test(){return "+ registry.nextID()+ "};"
        await new Server().saveFile("$serverside/Hallo.ts", text);
        var text2=await new Server().loadFile("$serverside/Hallo.ts");
        tests.expectEqual(text===text2);
        //,"export class Hallo{};export function test(){return 2};");


}