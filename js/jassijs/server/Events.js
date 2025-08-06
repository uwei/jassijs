"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = exports.EventEmitter = void 0;
class EventEmitter {
    constructor() {
        this._events = Object.create(null);
        this._maxListeners = 10;
    }
    on(event, listener) {
        return this._addListener(event, listener);
    }
    addListener(event, listener) {
        return this.on(event, listener);
    }
    once(event, listener) {
        const wrapper = (...args) => {
            this.removeListener(event, wrapper);
            listener(...args);
        };
        wrapper.originalListener = listener;
        return this.on(event, wrapper);
    }
    prependListener(event, listener) {
        return this._addListener(event, listener, true);
    }
    prependOnceListener(event, listener) {
        const wrapper = (...args) => {
            this.removeListener(event, wrapper);
            listener(...args);
        };
        wrapper.originalListener = listener;
        return this.prependListener(event, wrapper);
    }
    emit(event, ...args) {
        if (!this._events[event])
            return false;
        for (const listener of [...this._events[event]]) {
            listener(...args);
        }
        return true;
    }
    removeListener(event, listener) {
        const listeners = this._events[event];
        if (!listeners)
            return this;
        this._events[event] = listeners.filter(l => l !== listener && l.originalListener !== listener);
        return this;
    }
    off(event, listener) {
        return this.removeListener(event, listener);
    }
    removeAllListeners(event) {
        if (event) {
            delete this._events[event];
        }
        else {
            this._events = Object.create(null);
        }
        return this;
    }
    listeners(event) {
        var _a;
        return ((_a = this._events[event]) === null || _a === void 0 ? void 0 : _a.slice()) || [];
    }
    rawListeners(event) {
        return this._events[event] || [];
    }
    listenerCount(event) {
        var _a;
        return ((_a = this._events[event]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
    eventNames() {
        return Object.keys(this._events);
    }
    setMaxListeners(n) {
        this._maxListeners = n;
        return this;
    }
    getMaxListeners() {
        return this._maxListeners;
    }
    _addListener(event, listener, prepend = false) {
        if (typeof listener !== 'function') {
            throw new TypeError('Listener must be a function');
        }
        if (!this._events[event]) {
            this._events[event] = [];
        }
        if (prepend) {
            this._events[event].unshift(listener);
        }
        else {
            this._events[event].push(listener);
        }
        if (this._events[event].length > this._maxListeners) {
            console.warn(`MaxListenersExceededWarning: Possible memory leak detected for "${event}"`);
        }
        return this;
    }
}
// Modulstruktur wie in Node.js:
exports.EventEmitter = EventEmitter;
// Globales einmaliger Emit-Helfer (analog zu ev.once in Node.js)
function once(emitter, eventName, opts = {}) {
    return new Promise((resolve, reject) => {
        const handler = (...args) => {
            cleanup();
            resolve(args.length === 1 ? args[0] : args);
        };
        const errorHandler = (err) => {
            cleanup();
            reject(err);
        };
        const cleanup = () => {
            emitter.removeListener(eventName, handler);
            if (opts.rejectOnError) {
                emitter.removeListener('error', errorHandler);
            }
        };
        emitter.on(eventName, handler);
        if (opts.rejectOnError) {
            emitter.on('error', errorHandler);
        }
    });
}
exports.once = once;
//# sourceMappingURL=Events.js.map