"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileNode = void 0;
const Jassi_1 = require("jassijs/remote/Jassi");
;
let FileNode = class FileNode {
    constructor(fullpath = undefined) {
        if (fullpath) {
            this.fullpath = fullpath;
            this.name = fullpath.split("/")[fullpath.split("/").length - 1];
        }
    }
    isDirectory() {
        return this.files !== undefined;
    }
    resolveChilds(all) {
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
};
FileNode = __decorate([
    Jassi_1.$Class("jassijs.remote.FileNode"),
    __metadata("design:paramtypes", [String])
], FileNode);
exports.FileNode = FileNode;
//# sourceMappingURL=FileNode.js.map