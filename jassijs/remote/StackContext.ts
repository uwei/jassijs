// StackContext.ts
const contextMap = new Map<string, any>();
let functionCounter = 0;

export function useStackContext<T = any, R = any>(
  context: T,
  fn: (...args: any[]) => R,
  ...args: any[]
): R {
  const name = `__stackctx_${new Date().getDate()+(functionCounter++)}`;

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

class A{
  async h(){
    return await this.h2();
  }
  async h2(){
    console.log('Aktueller StackContext:'+ getStackContext()?.sessionId);
    return "Ok";
  }
}

async function test2(){
  return await new A().h();
}
export async function test(){
  const hallo = await useStackContext({ sessionId: 'abc-124' }, async () => {
  // await new Promise(res => setTimeout(res, 10));
    return test2();
  });
  console.log(hallo);
}


