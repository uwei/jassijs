define(["require", "exports", "jassi/base/Windows", "jassi/ui/DBObjectExplorer", "jassi/ui/FileExplorer", "jassi/ui/SearchExplorer"], function (require, exports, Windows_1, DBObjectExplorer_1, FileExplorer_1, SearchExplorer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Windows_1.default.addLeft(new DBObjectExplorer_1.DBObjectExplorer(), "DBObjects");
    Windows_1.default.addLeft(new SearchExplorer_1.SearchExplorer(), "Search");
    Windows_1.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
});
//# sourceMappingURL=StartEditor.js.map