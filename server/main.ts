import  JassiServer  from "./jassijs/server/JassiServer";
/*import { DBManager } from "jassijs/server/DBManager";
import { Employees } from "northwind/remote/Employees";
import { getManager } from "typeorm";*/
var path = require('path');
var parentDir = path.dirname(require.main.filename);
console.log("main->"+parentDir); 
JassiServer();

 