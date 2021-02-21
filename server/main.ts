import  JassiServer  from "./jassi/server/JassiServer";
import { DBManager } from "jassi/server/DBManager";
import { Employees } from "northwind/remote/Employees";
import { getManager } from "typeorm";
JassiServer();
async function test(){
    var man=await DBManager.get();
    var all=[];
    var ent1=new Employees();
    ent1.id=508;
    all.push(ent1);
    var ent2=new Employees();
    ent2.id=509;
    ent1.ReportsTo=ent2;
    all.push(ent2);
    var em=(await man.connection()).createEntityManager();
    //em.insert(ent2.constructor,ent2);
}
test();