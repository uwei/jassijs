import windows from "jassi/base/Windows";
import { DBObjectExplorer } from "jassi/ui/DBObjectExplorer";
import { FileExplorer } from "jassi/ui/FileExplorer";
import { SearchExplorer } from "jassi/ui/SearchExplorer";

windows.addLeft(new DBObjectExplorer(), "DBObjects");
windows.addLeft(new SearchExplorer(), "Search");
windows.addLeft(new FileExplorer(), "Files");