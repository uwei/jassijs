class OldC { constructor() { console.log("old"); } }
class NewC { constructor() { console.log("new"); } }
class A{
    constructor(){
        alert(8);
    }
}
export function test(){
  NewC.prototype = OldC.prototype;
NewC.prototype.constructor = NewC;
OldC = NewC;
new NewC();
}