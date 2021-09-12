import { $Class } from "jassijs/remote/Jassi";

@$Class("jassi.util.Runlater")
export class Runlater {
    lastRun: number;
    func;
    timeout: number;
    isRunning = false;
    constructor(func, timeout) {
        this.func = func;
        this.timeout = timeout;
    }
    _checkRun() {
        var _this = this;
        if (Date.now() > this.timeout + this.lastRun) { 
            this.isRunning = false;
            this.func();
        } else {
            setTimeout(function () {
                _this._checkRun();
            }, this.timeout);
        }
    }

    runlater() {
        var _this = this;
        this.lastRun = Date.now();
        if (this.isRunning) {
            return;
        } else {
            this.isRunning = true;
            setTimeout(function () {
                _this._checkRun();
            }, this.timeout);
        }
    }
}