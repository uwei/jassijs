"use strict:"
//this file is autogenerated don't modify
Object.defineProperty(exports, "__esModule", { value: true });
exports.default={
	"de/remote/AR.ts": {
		"date": 1614458857516,
		"de.AR": {
			"$Rights": [
				[
					{
						"name": "Auftragswesen/Ausgangsrechnung/festschreiben"
					},
					{
						"name": "Auftragswesen/Ausgangsrechnung/löschen"
					}
				]
			],
			"$DBObject": []
		}
	},
	"de/remote/ARZeile.ts": {
		"date": 1614464269053,
		"de.ARZeile": {
			"$DBObject": []
		}
	},
	"de/remote/Kunde.ext.ts": {
		"date": 1613332025514
	},
	"de/remote/Kunde.ts": {
		"date": 1614464285841,
		"de.Kunde": {
			"$ParentRights": [
				[
					{
						"name": "Kundennummern",
						"sqlToCheck": "me.id>=:i1 and me.id<=:i2",
						"description": {
							"text": "Kundennummern",
							"i1": "von",
							"i2": "bis"
						}
					}
				]
			],
			"$DBObject": []
		}
	},
	"de/remote/KundeExt.ts": {
		"date": 1613923393172,
		"de.KundeExt": {
			"$Extension": [
				"de.Kunde"
			]
		}
	},
	"de/remote/KundeExt2.ts": {
		"date": 1613332035281
	},
	"de/remote/Lieferant.ts": {
		"date": 1614464290662,
		"de.Lieferant": {
			"$DBObject": []
		}
	},
	"de/remote/MyUser.ts": {
		"date": 1613330861054,
		"de.MyUser": {
			"$DBObject": [],
			"Entity": []
		}
	}
}