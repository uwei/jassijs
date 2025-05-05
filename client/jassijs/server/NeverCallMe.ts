
throw "NeverCallMe"
import ts = require('typescript'); 
import * as TypeScript from 'typescript';
//this published the ts namespace as TypescriptNamespace - but never call this file - we only register the namespace für NativeAdapter
declare global {
        //@ts-ignore
        export import TypescriptNamespace = TypeScript;
        //@ts-ignore
        export import ts = TypeScript;
}



