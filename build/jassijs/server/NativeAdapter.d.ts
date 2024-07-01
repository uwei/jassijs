/// <reference types="node" />
import fs = require('fs');
import myfs = fs.promises;
import ts = require("typescript");
export { ts };
export { myfs };
export declare function exists(filename: string): Promise<boolean>;
export declare function dozip(directoryname: string, serverdir?: boolean): Promise<string>;
export declare function reloadJSAll(filenames: string[], afterUnload: () => {}): Promise<void>;
