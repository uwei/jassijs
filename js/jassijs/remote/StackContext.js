"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.getStackContext = exports.useStackContext = void 0;
// StackContext.ts
const contextMap = new Map();
let functionCounter = 0;
function useStackContext(context, fn, ...args) {
    const name = `__stackctx_${new Date().getDate() + (functionCounter++)}`;
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
exports.useStackContext = useStackContext;
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
class A {
    async h() {
        return await this.h2();
    }
    async h2() {
        var _a;
        console.log('Aktueller StackContext:' + ((_a = getStackContext()) === null || _a === void 0 ? void 0 : _a.sessionId));
        return "Ok";
    }
}
async function test2() {
    return await new A().h();
}
async function test() {
    const hallo = await useStackContext({ sessionId: 'abc-124' }, async () => {
        // await new Promise(res => setTimeout(res, 10));
        return test2();
    });
    console.log(hallo);
}
exports.test = test;
//# sourceMappingURL=StackContext.js.map