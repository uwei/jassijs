
 
// StackContext.ts
const contextMap = new Map<string, any>();
let functionCounter = 0;

export function useStackContextTest<T = any, R = any>(
  context: T,
  fn: (...args: any[]) => R,
  ...args: any[] 
): R {
  const name = `__stackctx_${new Date().getTime() + (functionCounter++)}`;

  // Dummy-Funktion mit Namen ins Stack setzen
  function WrapperMarker(...innerArgs: any[]) {
    contextMap.set(name, context);
    const cleanup = () => contextMap.delete(name);

    try {
      const result = fn.apply(this, innerArgs);
      if (result instanceof Promise) {
        return result.finally(cleanup); 
      }
      cleanup();
      return result;
    } catch (err) {
      cleanup();
      throw err;
    }
  }

  // Rename funktion für Stack-Trace
  Object.defineProperty(WrapperMarker, 'name', { value: name });

  return WrapperMarker(...args);
}


export async function useStackContext<T = any, R = any>(
  context: T,
  fn: (...args: any[]) => R | Promise<R>,
  ...args: any[]
): Promise<R> {
  const name = `__stackctx_${Date.now() + (functionCounter++)}`;

  // Wrapper-Funktion mit eindeutigem Namen für den Stack
  async function wrapper(...innerArgs: any[]): Promise<R> {
    contextMap.set(name, context);
    try {
      return await fn.apply(this, innerArgs);
    } finally {
      contextMap.delete(name);
    }
  }

  // Setze den Funktionsnamen für sauberen Stack-Zugriff
  Object.defineProperty(wrapper, 'name', { value: name });

  return await wrapper(...args);
}


export function useStackContextOrg<T = any, R = any>(
  context: T,
  fn: (...args: any[]) => R,
  ...args: any[]
): R {
  const name = `__stackctx_${new Date().getTime() + (functionCounter++)}`;

  const wrapper = {
    [name]: function (...args: any[]) {
      contextMap.set(name, context);

      const cleanup = () => contextMap.delete(name);

      try {
        const result = fn.apply(this, args);
        if (result instanceof Promise) {
          return result.finally(cleanup);
        }
        cleanup();
        return result;
      } catch (err) {
        cleanup();
        throw err;
      }
    }
  }[name];

  return wrapper(...args);
}

export function getStackContext<T = any>(): T | undefined {
  const err = new Error();
  const stack = err.stack || '';
  for (const line of stack.split('\n')) {
    const match = line.match(/__stackctx_(\d+)/);
    if (match) {
      return contextMap.get(match[0]) as T;
    }
  }
  return undefined;
}


// Importiere Zone.js (falls nicht bereits in deinem Projekt vorhanden)


export function getZoneContext(){
  if(globalThis.Zone===undefined)
    return undefined;
  //@ts-ignore
  const obj = Zone.current.get('data');
  return obj;
}

export async function useZoneContext<T = any, R = any>(
  context: T,
  fn: (...args: any[]) => R | Promise<R>,
  ...args: any[]
): Promise<R> {
  if(jassijs.isServer){
    await import("zone.js");
  }else{
    await import("zone-js"); 

  }

  // Erstelle eine neue Zone
  //@ts-ignore
  const myZone = Zone.current.fork({
    name: `__zone_${new Date().getTime() + (functionCounter++)}`,
    properties: {data:context}
    
    ,
    onInvoke: (parentZoneDelegate, currentZone, targetZone, callback, applyThis, applyArgs,src) => {
     // console.log('Vor der Ausführung der Funktion in der Zone');
      const result = parentZoneDelegate.invoke(targetZone, callback, applyThis, applyArgs,src);
     // console.log('Nach der Ausführung der Funktion in der Zone');
      return result;
    }
  });


  // Verwende die Zone
  var ret = await myZone.run(fn);
  return ret;

}
