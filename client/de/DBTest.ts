import { AR } from "de/remote/AR";
import { Kunde } from "de/remote/Kunde";
import {ARZeile} from "de/remote/ARZeile";

export async function test(){
  
}
export async function test4() {
    //await Kunde.sample();
    var ar:AR = <AR> (await AR.find({ id: 900 }))[0];
    
	var kunde:Kunde = (await Kunde.find({ id: 5 }))[0];
	ar.kunde=kunde;
	ar.save()
	var zeile=(await ARZeile.find({ id: 5 }))[0];
	zeile.ar=ar;
	zeile.position=50;
	zeile.text="kk2k";
	
	zeile.save();
   
};

export async function test2() {
    //await Kunde.sample();
    var all = await Kunde.find({ id: 5 });
    var k = all[0];
    k.id = 5;
    k.vorname = "Markus";
    k.nachname = "Beier";
    k.ort = "Mainz";
    k.PLZ = "99992";
    try{
   debugger;
		await k.save();
    }catch(ex){
    	debugger;
    }
    //	new de.Kunde().generate();
    //jassijs.db.uploadType(de.Kunde);
};
export async function test3() {
    var all = await AR.find();
    var z = (await AR.find({ id: 902 }))[0];
    //console.log(z.nummer++);
    z.save();
    var kd: Kunde = (await Kunde.find({ id: 4 }))[0];
    kd.extField = "yes"; 
	kd.save();
}