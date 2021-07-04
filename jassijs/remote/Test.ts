import { $Class } from "./Jassi";

@$Class("jassijs.remote.Test")
export class Test {

    /**
     * fails if the condition is false
     * @parameter condition 
     **/
    expectEqual(condition: boolean) {
        if (!condition)
            throw new Error("Test fails");
    }
    /**
     * fails if the func does not throw an error
     * @parameter func - the function that should failed
     **/
    expectError(func) {
        try {

            if (func.toString().startsWith("async ")) {
                var errobj;
                try {
                    throw new Error("test fails");
                } catch (err) {
                    errobj = err;
                }
                func().then(() => {
                    throw errobj;
                }).catch((err) => {
                    if (err.message === "test fails")
                        throw errobj;
                    var k = 1;//io
                });
                return;
            } else {
                func();
            }
        } catch {
            return;//io
        }
        throw new Error("test fails");
    }
    /**
    * fails if the func does not throw an error
    * @parameter func - the function that should failed
    **/
    async expectErrorAsync(func) {
        var errors = false;
        try {
            var errobj;

            await func().then((e) => {

            }).catch((e) => {
                errors = true;
            });
        } catch {
            errors = true;
        }
        if (!errors)
            throw new Error("test fails");
    }
}