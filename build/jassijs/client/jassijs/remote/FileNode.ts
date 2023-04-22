import { $Class } from "jassijs/remote/Registry";;

@$Class("jassijs.remote.FileNode")
export class FileNode {
    name: string;
    fullpath?: string;
    parent?: FileNode;
    files?: FileNode[];
    date?: any;
    flag?: string;
    constructor(fullpath: string = undefined) {
        if (fullpath) {
            this.fullpath = fullpath;
            this.name = fullpath.split("/")[fullpath.split("/").length - 1];
        }
    }
    isDirectory?() {
        return this.files !== undefined;
    }
    resolveChilds?(all?: { [path: string]: FileNode }): { [path: string]: FileNode } {
        if (all === undefined)
            all = {};
        //var ret:FileNode[]=[];

        if (this.files !== undefined) {
            for (let x = 0; x < this.files.length; x++) {
                all[this.files[x].fullpath] = this.files[x];
                this.files[x].resolveChilds(all);
            }
        }
        return all;
    }
}