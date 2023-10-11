
import { ServerIndexer } from "jassijs/server/RegistryIndexer";
import  JassiServer  from "./jassijs/server/JassiServer";

import { Compile } from "jassijs/server/Compile";

//import { compilePackage } from "./jassijs/server/CreatePackage";

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
   