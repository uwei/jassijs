declare global {
    var window: any;
    var isServer: any;
    var $: any;
}
import "jassijs/remote/Jassi";
import "jassijs/remote/Registry";
import "jassijs/server/PassportSetup";
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
