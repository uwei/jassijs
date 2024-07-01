declare class Modules {
    modules: {
        [modul: string]: string;
    };
    server: Modules;
    constructor();
}
declare var modules: Modules;
export { modules };
