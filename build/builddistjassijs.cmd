
cd ..
rem call tsc --project tsconfig.jassijs-server.json
rem C:\wamp64\www\jassijs>powershell /c "$s=(get-content 'dist/jassijs-server.js').replace('client/jassijs/','jassijs/');set-content 'dist/jassijs-server.js' $s"
cd client
call tsc --project jassijs/tsconfig.json

pause