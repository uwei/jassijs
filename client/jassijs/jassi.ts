
import jassijs from    "jassijs/remote/Jassi";
import  "jassijs/remote/Classes";
import  "jassijs/remote/Jassi";
//import  "jassijs/base/Router";
import  "jassijs/base/Extensions";
import "jassijs/remote/Registry";
import "jassijs/ext/jquerylib";
import "jassijs/ext/intersection-observer";
import { Errors } from "jassijs/base/Errors";
declare global {
  interface JQueryStatic {
          notify: any;
  }
}
jassijs.errors=new Errors();

export default jassijs;

