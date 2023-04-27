declare module "jassijs_localserver/modul" {
    const _default: {
        require: {
            paths: {};
            shim: {};
        };
    };
    export default _default;
}
declare module "jassijs/server/ext/EmpyDeclaration" {
    export {};
}
/// <amd-dependency name="JSZip" path="jszip" />
declare module "jassijs/server/ext/jszip" {
    var JSZip: any;
    export default JSZip;
}
declare module "jassijs/server/DatabaseSchema" {
    import { EntityOptions } from "typeorm";
    export function Entity(...param: any[]): Function;
    export function PrimaryGeneratedColumn(...param: any[]): Function;
    export function JoinColumn(...param: any[]): Function;
    export function JoinTable(...param: any[]): Function;
    export function Column(...param: any[]): Function;
    export function PrimaryColumn(...param: any[]): Function;
    export function OneToOne(...param: any[]): Function;
    export function OneToMany(...param: any[]): Function;
    export function ManyToOne(...param: any[]): Function;
    export function ManyToMany(...param: any[]): Function;
    export { EntityOptions };
}
