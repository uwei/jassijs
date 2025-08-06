
class BrowserServer {
    async updateApp(app: BrowserServerAppConfig) {
        await this.callAPI("POST", "./api/app", app);
    }
    async getApps():Promise<BrowserServerAppConfig[]> {
        return <any> await this.callAPI("POST", "./api/apps");
    }
    async startApp(name: string,doredirect:boolean=true):Promise<boolean> {
        var app: BrowserServerAppConfig = await this.getApp(name);
       
       
         
        // var reg=await navigator.serviceWorker.register(swfile + query, this.isAppScope()?undefined:{ scope: ("/browserserver/apps/" + name) });
        if(!this.isAppScope()){
            window.location.replace('./apps/'+name+"/BrowserserverLoadingPage.html");
            return false;
        }else{
            let registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                if(registration.scope.indexOf("/apps/"+name)!==-1)
                await registration.unregister();
            }
            let swfile=(this.isAppScope()?"../..":".")+"/service-worker-scope.js?"+new Date().getTime();
            let scope=location.pathname.split("/apps/")[0]+"/apps/"+name;
            var reg=await navigator.serviceWorker.register(swfile , { scope });
            navigator.serviceWorker.addEventListener('message', event => {
                let info=document.getElementById("info");
                info?.prepend(document.createTextNode(event.data.msg));
                info?.prepend(document.createElement('br'));
                if(event.data.msg==="serviceworker has started"){
                    if(doredirect){
                        let url="/";
                        if(app.redirectUrl)
                            url=app.redirectUrl;
                        if(url.startsWith("."))
                            url=url.substring(1);
                        window.location.replace((this.isAppScope()?"../..":".")+'/apps/'+name+url);
                    }
                }

               //console.log("log from worker: "+event.data.msg);
            });
        }
        //activate worker
       /* var started = await new Promise((resolve) => {
            navigator.serviceWorker.addEventListener('message', event => {
                let evt = event.data.msg;
                if (evt === "serviceworkercode has changed") {
                    resolve(false);
                }
                if (evt === "serviceworker has started") {
                    resolve(true);
                }
            });
        });*/
       /* if (started === false) {//Serviceworker code has changed - we must restart the worker
            let registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                if(registration.scope.indexOf("/app/")!==-1)
                await registration.unregister();
            }
            return await this.startApp(name,doredirect);
        }*/
       /* if(doredirect){
            let url="/";
            if(app.redirectUrl)
                url=app.redirectUrl;
            if(url.startsWith("."))
                url=url.substring(1);
           // window.location.replace((this.isAppScope()?"../..":".")+'/apps/'+name+url);
        }*/
        return true;
    }
    async getApp(name: string) {
        return await this.callAPI("GET", "./api/app?" + name);
    }
    isAppScope(){
        return location.href.indexOf("/apps/")!==-1;
    }
    async callAPI(method: string, url: string, data: any = undefined) {
        if(this.isAppScope())
            url=url.replace("./","../../");
        try {
            const options: any = {
                method: method.toUpperCase(), // z. B. 'POST', 'GET'
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            // Wenn Daten vorhanden sind und Methode erlaubt einen Body
            if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP-Fehler: ${response.status}`);
            }

            const result = await response.text(); // Antwort als JSON
            if(result==="")
                return undefined;
            return JSON.parse(result);
        } catch (error: any) {
            console.error('API-Fehler:', error.message);
            throw error; // Fehler weitergeben
        }
    }
}
