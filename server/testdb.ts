import { createConnection, ConnectionOptions, getConnectionOptions, getConnection } from "typeorm";
import { MyUser } from "remote/de/MyUser";
import {AR} from "remote/de/AR";
import { db } from "remote/jassi/base/Database";
import { DBManager } from "jassi/server/DBManager";
import { Kunde } from "remote/de/Kunde";
import {Lieferant} from "remote/de/Lieferant";


export async function startDBManager() {
  var man=await DBManager.get();
  man.connection();
  var ourr = await (await DBManager.get()).findOne(Kunde);

  /*var k=new Kunde();
  k.id=6;
  k.vorname="Hilde";
 k.nachname="Heier";
 k.ort="Mainz";
 k.PLZ="99992";
 var h2=await (await DBManager.get()).connection().manager.insert(Kunde,k);
  */
  var u = new MyUser();
  u.firstName = "Udo";
  u.lastName = "kkop";
  u.id = 509;
  u.age = 9;
  var h=(await DBManager.get()).connection().getMetadata(MyUser);
  //  var c=await con.connect();
 // var kop=await(await DBManager.get()).save(u);
  var ou = await (await DBManager.get()).findOne(MyUser,500);

  
  return u.firstName;
}

