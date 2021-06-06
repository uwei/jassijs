import * as ts from "typescript";
/**
 * compile
 */
export declare class Compile {
    static lastModifiedTSFiles: string[];
    lastCompiledTSFiles: string[];
    private static clientWatcherIsRunning;
    static eventEmitter: any;
    constructor();
    test(response: any): void;
    compile(fileNames: string[], options: ts.CompilerOptions): string[];
    runWatcher(): void;
    reportDiagnostic(diagnostic: ts.Diagnostic): void;
    checkNewCompiledFiles(response: any): void;
    reportWatchStatusChanged(diagnostic: ts.Diagnostic): void;
    transpile(fileName: string): void;
}
