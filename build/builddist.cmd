
cd ..

cd client
rem replace requirejs with an version we can use as without requirejs and also in node 
powershell "$all=(get-content 'js/jassijs_report/remote/pdfmakejassi.js');$all[0]='(function (factory) {var registeredInModuleLoader;if (typeof define === `function` && define.amd) {define(factory);registeredInModuleLoader = true;}if (typeof exports === `object`) {module.exports = factory();registeredInModuleLoader = true;}if (!registeredInModuleLoader) {var Oldpdfmakejassi = window.pdfmakejassi;var api = window.pdfmakejassi = factory();api.noConflict = function () {window.pdfmakejassi = Oldpdfmakejassi;return api;};}}(function () {let exports={};';$all[$all.Length-2]='return exports;}));';$all[$all.Length-1]='';$all|set-content '../dist/pdfmakejassi.js'"
copy jassistart.js "..\dist" /Y
copy jassijs\jassijs.css  "..\dist" /Y
copy jassijs_editor\jassijs_editor.css  "..\dist" /Y
copy jassijs_report\jassijs_report.css  "..\dist" /Y
 

copy "service-worker.js" "..\dist/sample" /Y
copy "service-worker.js" "..\private/sample" /Y

call tsc --project jassijs/tsconfig.json
call tsc --project jassijs_editor/tsconfig.json
call tsc --project demoreports/tsconfig.json 
call tsc --project jassijs_report/tsconfig.json
call tsc --project demo/tsconfig.json
call tsc --project jassijs_localserver/tsconfig.json
call tsc --project northwind/tsconfig.json
call tsc --project tests/tsconfig.json
pause