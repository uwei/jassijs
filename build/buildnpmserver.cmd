cd ..
rd build\jassijs /S /Q
xcopy build\template_jassijs build /s /e /i
copy js\main.js build\jassijs\js /Y
copy jassijs\index.d.ts  "build\jassijs" /Y
copy package.json  "build\jassijs" /Y
copy client\app.ts build\jassijs\client /Y
copy client\favicon.ico build\jassijs\client /Y
copy client\index.html build\jassijs\client /Y
copy client\jassistart.js build\jassijs\client /Y
copy client\login.html build\jassijs\client /Y
copy client\register.html build\jassijs\client /Y
copy client\service-worker.js build\jassijs\client /Y
md "build\jassijs\client\js"
copy client\js\app.js build\jassijs\client\js /Y
xcopy client\js\jassijs build\jassijs\client\js\jassijs /s /e /i
xcopy client\js\jassijs_editor build\jassijs\client\js\jassijs_editor /s /e /i
xcopy client\js\jassijs_report build\jassijs\client\js\jassijs_report /s /e /i
xcopy client\jassijs build\jassijs\client\jassijs /s /e /i
xcopy client\jassijs_editor build\jassijs\client\jassijs_editor /s /e /i
xcopy client\jassijs_report build\jassijs\client\jassijs_report /s /e /i
md "build\jassijs\client\node_modules\@types\jassijs-client"
copy dist\index.d.ts build\jassijs\client\node_modules\@types\jassijs-client /Y
copy dist\jassijs.d.ts build\jassijs\client\node_modules\@types\jassijs-client /Y
copy dist\jassijs_editor.d.ts build\jassijs\client\node_modules\@types\jassijs-client /Y
copy dist\jassijs_localserver.d.ts build\jassijs\client\node_modules\@types\jassijs-client /Y
copy dist\jassijs_report.d.ts build\jassijs\client\node_modules\@types\jassijs-client /Y
rem copy client\jassijs\jassijs.css build\jassijs\client\jassijs /Y
rem md build\jassijs\client\jassijs_editor
rem copy client\jassijs_editor\jassijs_editor.css build\jassijs\client\jassijs_editor /Y
rem copy client\jassijs_editor\jassijs_editor.css build\jassijs\client\jassijs_editor /Y

call tsc --project tsconfig.jassijs.json 
cd build/jassijs

call npm pack --pack-destination="./../../dist"


pause