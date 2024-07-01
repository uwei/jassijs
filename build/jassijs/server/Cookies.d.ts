declare class C {
    set(name: string, value: string, params?: any): void;
    get(name: string): any;
    remove(name: string, params?: any): void;
    getJSON(): string;
}
declare var Cookies: C;
export { Cookies };
