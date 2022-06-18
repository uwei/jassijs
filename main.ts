import  JassiServer  from "./jassijs/server/JassiServer";

/*import { DBManager } from "jassijs/server/DBManager";
import { Employees } from "northwind/remote/Employees";
import { getManager } from "typeorm";*/
console.log(require('path').dirname(require.main.filename).replaceAll("\\","/"));
               
JassiServer();

 