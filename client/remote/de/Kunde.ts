import { DBObject, $DBObject } from "jassi/remote/DBObject";
import { AR } from "remote/de/AR";
import jassi, { $Class } from "jassi/remote/Jassi";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassi/util/DatabaseSchema";
import "remote/de/Kunde.ext";
import { ExtensionProvider } from "jassi/remote/Extensions";
import { $DBObjectQuery } from "jassi/remote/DBObjectQuery";
import { $ParentRights } from "jassi/remote/security/Rights";
//import "jassi/ext/enableExtension.js?de.Kunde";
@$ParentRights([{ name: "Kundennummern", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
        description: {
            text: "Kundennummern",
            i1: "von",
            i2: "bis"
        } }])
@$DBObject()
@$Class("de.Kunde")
export class Kunde extends DBObject implements ExtensionProvider {
    @PrimaryColumn()
    id: number;
    @Column()
    vorname: string;
    @Column()
    nachname: string;
    @Column()
    strasse: string;
    @Column()
    PLZ: string;
    @Column({ nullable: true })
    ort: string;
    @Column()
    hausnummer: number;
    @OneToMany(type => AR, ar => ar.kunde)
    rechnungen: AR[];
    initExtensions() {
        //this function would be extended
    }
    constructor() {
        super();
        this.id = 0;
        this.vorname = "";
        this.nachname = "";
        this.strasse = "";
        this.PLZ = "";
        this.hausnummer = 0;
        this.initExtensions();
    }
    /**
    * add here all properties for the PropertyEditor
    * @param {[jassi.ui.ComponentDescriptor]} desc - describe fields for propertyeditor
    * e.g.  desc.fields.push(new jassi.ui.Property("id","number"));
    */
    static describeComponent(desc) {
        desc.actions.push({
            name: "Bewertung", description: "Bewerte den Kunden", icon: "mdi mdi-car", run: function (kunden) {
                for (var x = 0; x < kunden.length; x++) {
                    // $.notify("bewerte..." + kunden[x].vorname, "info", { position: "right" });
                    //	alert("bewerten..."+kunden[x].vorname);
                }
            }
        });
    }
    @$DBObjectQuery({ name: "Alle nach Namen", description: "Kundenliste nach Namen" })
    static async alleKundenNachNachname(): Promise<any[]> {
        return await Kunde.find({ order: "nachname" });
    }
    @$DBObjectQuery({ name: "Alle nach Nummer", description: "Kundenliste nach Nummer" })
    static async alleKundenNachNummer(): Promise<any[]> {
        return await Kunde.find({ order: "id" });
    }
    static async find(options = undefined): Promise<any[]> {
        if (!jassi.isServer) {
            return await this.call("find", options);
        }
        else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.find(this, options);
        }
    }
    static async sample() {
        var kunde1 = new Kunde();
        Object.assign(kunde1, { id: 1, vorname: "Max", nachname: "Meier", strasse: "Dorfstrße", hausnummer: 100 });
        var kunde2 = new Kunde();
        Object.assign(kunde2, { id: 2, vorname: "Mario", nachname: "Meier", strasse: "Dorfstraße", hausnummer: 87 });
        var kunde3 = new Kunde();
        Object.assign(kunde3, { id: 3, vorname: "Alma", nachname: "Alser", strasse: "Hauptstraße", hausnummer: 7 });
        var kunde4 = new Kunde();
        Object.assign(kunde4, { id: 4, vorname: "Elke", nachname: "Krautz", strasse: "Gehweg", hausnummer: 5 });
        await kunde1.save();
        await kunde2.save();
        await kunde3.save();
        await kunde4.save();
        //  $(document.body).html(h);
        //jassi.db.delete(kunde);
    }
    @Column({	nullable: true})
    land: string;
}
export async function test() {
    //await Kunde.sample();
    var k = <Kunde>await Kunde.findOne({ id: 1 });
    k.vorname = "Ella";
    k.land="Deutschland";
    k.nachname = "Klotz";
    k.ort = "Mainz";
    k.PLZ = "99992";
    k.save();
    //	new de.Kunde().generate();
    //jassi.db.uploadType(de.Kunde);
}
;
