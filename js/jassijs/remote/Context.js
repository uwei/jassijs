"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoneContext = exports.getZoneContext = exports.getStackContext = exports.useStackContextOrg = exports.useStackContext = exports.useStackContextTest = void 0;
// StackContext.ts
const contextMap = new Map();
let functionCounter = 0;
function useStackContextTest(context, fn, ...args) {
    const name = `__stackctx_${new Date().getTime() + (functionCounter++)}`;
    // Dummy-Funktion mit Namen ins Stack setzen
    function WrapperMarker(...innerArgs) {
        contextMap.set(name, context);
        const cleanup = () => contextMap.delete(name);
        try {
            const result = fn.apply(this, innerArgs);
            if (result instanceof Promise) {
                return result.finally(cleanup);
            }
            cleanup();
            return result;
        }
        catch (err) {
            cleanup();
            throw err;
        }
    }
    // Rename funktion für Stack-Trace
    Object.defineProperty(WrapperMarker, 'name', { value: name });
    return WrapperMarker(...args);
}
exports.useStackContextTest = useStackContextTest;
async function useStackContext(context, fn, ...args) {
    const name = `__stackctx_${Date.now() + (functionCounter++)}`;
    // Wrapper-Funktion mit eindeutigem Namen für den Stack
    async function wrapper(...innerArgs) {
        contextMap.set(name, context);
        try {
            return await fn.apply(this, innerArgs);
        }
        finally {
            contextMap.delete(name);
        }
    }
    // Setze den Funktionsnamen für sauberen Stack-Zugriff
    Object.defineProperty(wrapper, 'name', { value: name });
    return await wrapper(...args);
}
exports.useStackContext = useStackContext;
function useStackContextOrg(context, fn, ...args) {
    const name = `__stackctx_${new Date().getTime() + (functionCounter++)}`;
    const wrapper = {
        [name]: function (...args) {
            contextMap.set(name, context);
            const cleanup = () => contextMap.delete(name);
            try {
                const result = fn.apply(this, args);
                if (result instanceof Promise) {
                    return result.finally(cleanup);
                }
                cleanup();
                return result;
            }
            catch (err) {
                cleanup();
                throw err;
            }
        }
    }[name];
    return wrapper(...args);
}
exports.useStackContextOrg = useStackContextOrg;
function getStackContext() {
    const err = new Error();
    const stack = err.stack || '';
    for (const line of stack.split('\n')) {
        const match = line.match(/__stackctx_(\d+)/);
        if (match) {
            return contextMap.get(match[0]);
        }
    }
    return undefined;
}
exports.getStackContext = getStackContext;
// Importiere Zone.js (falls nicht bereits in deinem Projekt vorhanden)
function getZoneContext() {
    if (globalThis.Zone === undefined)
        return undefined;
    //@ts-ignore
    const obj = Zone.current.get('data');
    return obj;
}
exports.getZoneContext = getZoneContext;
async function useZoneContext(context, fn, ...args) {
    if (jassijs.isServer) {
        await Promise.resolve().then(() => require("zone.js"));
    }
    else {
        await Promise.resolve().then(() => require("zone-js"));
    }
    // Erstelle eine neue Zone
    //@ts-ignore
    const myZone = Zone.current.fork({
        name: `__zone_${new Date().getTime() + (functionCounter++)}`,
        properties: { data: context },
        onInvoke: (parentZoneDelegate, currentZone, targetZone, callback, applyThis, applyArgs, src) => {
            // console.log('Vor der Ausführung der Funktion in der Zone');
            const result = parentZoneDelegate.invoke(targetZone, callback, applyThis, applyArgs, src);
            // console.log('Nach der Ausführung der Funktion in der Zone');
            return result;
        }
    });
    // Verwende die Zone
    var ret = await myZone.run(fn);
    return ret;
}
exports.useZoneContext = useZoneContext;
//# sourceMappingURL=Context.js.map