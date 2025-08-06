"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDB = exports.testExpress = exports.download = exports.erstelleZip = exports.jssql = void 0;
const JSZip = require('jszip');
const fs = require('fs');
async function jssql() {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    // Neue In-Memory-Datenbank
    const db = new SQL.Database();
    // Tabelle erstellen und Daten einfügen
    db.run(`
      CREATE TABLE users (id INTEGER, name TEXT, age INTEGER);
      INSERT INTO users VALUES (1, 'Alice', 28);
      INSERT INTO users VALUES (2, 'Bob', 35);
      INSERT INTO users VALUES (3, 'Charlie', 22);
    `);
    // Abfrage ausführen
    const result = db.exec("SELECT * FROM users WHERE age > 25 ORDER BY age DESC");
    // Ergebnis anzeigen
    console.log(JSON.stringify(result[0], null, 2));
    // Optional: Datenbank exportieren
    const binaryArray = db.export();
    const buff = Buffer.from(binaryArray);
    return buff;
}
exports.jssql = jssql;
async function erstelleZip() {
    const zip = new JSZip();
    // Datei hinzufügen (Text-Inhalt)
    zip.file('hallo.txt', 'Hallo Welt!');
    // Unterordner mit Datei
    zip.folder('docs').file('info.txt', 'Dies ist eine Info-Datei.');
    // ZIP-Datei als Buffer generieren
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    download(content);
    // In Datei schreiben
    //fs.writeFileSync('beispiel.zip', content);
    console.log('ZIP-Datei erstellt: beispiel.zip');
}
exports.erstelleZip = erstelleZip;
function download(content) {
    // In Blob konvertieren – ZIP-Datei als MIME-Typ
    const blob = new Blob([content], { type: 'application/zip' });
    // URL erzeugen
    const url = URL.createObjectURL(blob);
    // Temporären Link erzeugen & Klick simulieren
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beispiel.zip';
    document.body.appendChild(a);
    a.click();
    // Aufräumen
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
exports.download = download;
async function testExpress() {
    const express = require('express');
    const path = require('path');
    const app = express();
    const PORT = 5001;
    // Optional: eigene Route
    app.get('/index.html', (req, res) => {
        debugger;
        try {
            res.send('Hallo Welt von Express!');
        }
        catch (err) {
            debugger;
        }
    });
    app.listen(PORT, () => {
        console.log(`🚀 Server läuft unter http://localhost:${PORT}`);
    });
}
exports.testExpress = testExpress;
async function testDB() {
    var User = require("jassijs/remote/security/User").User;
    debugger;
    var h = await User.findOne(undefined, { isServer: true, request: { user: { user: "admin" } } }); //context.request.user.user
    var us = new User();
    us.id = 9;
    us.email = "a@b";
    us.password = "kk";
    await us.save({ isServer: true, request: { user: { user: "admin" } } });
    var h2 = await User.findOne(undefined, { isServer: true, request: { user: { user: "admin" } } }); //context.request.user.user
    debugger;
}
exports.testDB = testDB;
//# sourceMappingURL=run.js.map