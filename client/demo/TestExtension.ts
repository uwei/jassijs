import { Kunde } from "remote/de/Kunde";

export function test() {
    var kd = new Kunde();
    console.log(kd.extFunc());
}