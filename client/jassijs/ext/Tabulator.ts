/// <amd-module name="tabulator-tables"/>
/// <amd-dependency path="tabulatorlib" name="tabulator"/>
import modul from 'jassijs/modul';
declare var tabulator;
var Tabulator = tabulator;
var path = modul.require.paths["tabulatorlib"];
jassijs.myRequire(path.replace("/js/", "/css/")+".css");

export { Tabulator };    