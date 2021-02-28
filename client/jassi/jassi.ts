
import jassi from    "jassi/remote/Jassi";
import  "jassi/remote/Classes";
import  "jassi/remote/Jassi";
//import  "jassi/base/Router";
import  "jassi/base/Extensions";
import "jassi/remote/Registry";
import "jassi/ext/jquerylib";
import "jassi/ext/intersection-observer";
import { Errors } from "jassi/base/Errors";
declare global {
  interface JQueryStatic {
          notify: any;
  }
}
jassi.errors=new Errors();

export default jassi;


