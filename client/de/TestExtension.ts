import { Kunde } from "de/remote/Kunde";

export function test() {
    var kd = new Kunde();
    console.log(kd.extFunc());
}