declare global {
    var window: any;
    var isServer: any;
    var $: any;
}
import "jassi/remote/Registry";
import "jassi/server/PassportSetup";
declare class JassiConnectionProperties {
    port?: number;
    updeateRegistryOnStart?: any;
    syncRemoteFiles?: boolean;
    listenToPort?: boolean;
}
/**
 * starts jassi server
 * @param properties
 * @param expressApp
 * @returns expressApp
 */
export default function JassiServer(properties?: JassiConnectionProperties, expressApp?: any): any;
export {};
