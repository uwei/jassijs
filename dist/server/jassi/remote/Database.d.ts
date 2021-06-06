export declare class TypeDef {
    fields: {
        [fieldname: string]: {
            [decorater: string]: any[];
        };
    };
    getRelation(fieldname: any): {
        type: string;
        oclass: any;
    };
}
export declare class Database {
    private constructor();
    typeDef: Map<object, TypeDef>;
    decoratorCalls: Map<object, any[]>;
    private removeOld;
    _setMetadata(constructor: any, field: string, decoratername: string, fieldprops: any[], decoraterprops: any[], delegate: any): void;
    fillDecorators(): void;
    getMetadata(sclass: any): TypeDef;
}
declare var db: Database;
export { db };
