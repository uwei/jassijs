define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    return;
    debugger;
    // Importiere Zone.js (falls nicht bereits in deinem Projekt vorhanden)
    var pZone = Zone();
    // Erstelle eine neue Zone
    const myZone = pZone.current.fork({
        name: 'myCustomZone',
        onInvoke: (parentZoneDelegate, currentZone, targetZone, callback, applyThis, applyArgs) => {
            console.log('Vor der Ausführung der Funktion in der Zone');
            const result = parentZoneDelegate.invoke(targetZone, callback, applyThis, applyArgs);
            console.log('Nach der Ausführung der Funktion in der Zone');
            return result;
        }
    });
    // Verwende die Zone
    myZone.run(() => {
        console.log('Dies läuft innerhalb der benutzerdefinierten Zone');
        setTimeout(() => {
            console.log('Asynchrone Operation innerhalb der Zone');
        }, 1000);
    });
    console.log('Dies läuft außerhalb der Zone');
});
//# sourceMappingURL=zz.js.map