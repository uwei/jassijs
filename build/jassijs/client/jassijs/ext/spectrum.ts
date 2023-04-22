
/// <amd-dependency path="spectrum" name="spectrum"/>
import modul from 'jassijs/modul';
//'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
var path = modul.require.paths["spectrum"];
//path=path.substring(0,path.lastIndexOf("/"));
jassijs.myRequire(path + ".css");
