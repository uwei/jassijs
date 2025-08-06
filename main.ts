

import JassiServer from "./jassijs/server/JassiServer";
import { Compile } from "jassijs/server/Compile";
import { startCodeServer } from "./jassijs/server/PackServerFiles";


<<<<<<< HEAD
if (require("fs").existsSync("./private"))
    startCodeServer();
JassiServer();
/*new Compile().transpileModul("jassijs", true);
new Compile().transpileModul("jassijs", false);
new Compile().transpileModul("jassijs_editor", false);
new Compile().transpileModul("jassijs_report", true);
new Compile().transpileModul("jassijs_report", false);
new Compile().transpileModul("demoreports", false);
new Compile().transpileModul("northwind", true);
new Compile().transpileModul("northwind", false);
new Compile().transpileModul("tests", false);
new Compile().transpileModul("tests", true);
new Compile().transpileModul("demo", false);
*/
=======
new Compile().transpileModul("jassijs",true);
new Compile().transpileModul("jassijs",false);
new Compile().transpileModul("jassijs_editor",false);
new Compile().transpileModul("jassijs_report",true);
new Compile().transpileModul("jassijs_report",false);
new Compile().transpileModul("demoreports",false);
new Compile().transpileModul("northwind",true);
new Compile().transpileModul("northwind",false);
new Compile().transpileModul("tests",false);
new Compile().transpileModul("tests",true);
new Compile().transpileModul("demo",false); 
  
JassiServer();  
   
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
