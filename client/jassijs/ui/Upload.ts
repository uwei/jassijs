import { $Class } from "jassijs/remote/Registry";
import {Component,  $UIComponent} from "jassijs/ui/Component";
import {Property,  $Property } from "jassijs/ui/Property";

@$UIComponent({ fullPath:"common/Upload",icon:"mdi mdi-cloud-upload-outline"})
@$Class("jassijs.ui.Upload")
export class Upload extends Component{
       /* get dom(){
            return this.dom;
        }*/
        constructor(){ 
            super();    
            super.init($('<input type="file" id="dateien" name="files[]" />')[0]);
            var _this=this;
            $(this.dom).on("change",function(evt){
            	_this.readUpload(<any>evt);
            });
        }
        @$Property({chooseFromStrict:true,chooseFrom:["Text","DataUrl","ArrayBuffer","BinaryString"]})
        readAs:"Text"|"DataUrl"|"ArrayBuffer"|"BinaryString";

        get accept():string{
        	return $(this.dom).prop("accept");
        }
        /**
         * which file types are accepted e.g ".txt,.csv"
         **/
        @$Property()
        set accept(value:string){
        	$(this.dom).prop("accept",value);
        }
        get multiple():boolean{
        	return $(this.dom).prop("multiple");
        }
        /**
         * multiple files can be uploaded
         **/
        @$Property()
        set multiple(value:boolean){
        	$(this.dom).prop("multiple",value);
        }
		private async readUpload(evt:JQuery.TriggeredEvent<any,any,any,any>){
			var files:FileList = evt.target["files"];
            var _this=this;
			var data:{[file:string]:string|ArrayBuffer}={};
			var downloaded=0;
			for (var i = 0; i<files.length; i++) {
				var file=files[i];
				var reader = new FileReader();
                reader.addEventListener("load", function () {
                    data[file.name] = reader.result;
                    downloaded++;
                    if(downloaded==files.length){
                        _this.callEvent("uploaded",data,files,evt);
                    }
                }, false);
                if(this.readAs==="DataUrl"){
                    reader.readAsDataURL(file);
                   // data[file.name]=reader.result;
                }else if(this.readAs==="ArrayBuffer"){
                    reader.readAsArrayBuffer(file);
                   // data[file.name]=reader.result;
                }else if(this.readAs==="BinaryString"){
                    reader.readAsBinaryString(file);
                }else{
       			     reader.readAsText(file);
   			    }
			}
			
	    };
        /**
         * register handler to get the uploaded data
         */
        @$Property({default:"function(data:{[file:string]:string}){\n\t\n}"})
        onuploaded(handler:(data:{[file:string]:string},files:FileList,evt:JQueryEventObject)=>any){
        	this.addEvent("uploaded", handler);
        }

}
/*
	// UI-Events erst registrieren wenn das DOM bereit ist!
document.addEventListener("DOMContentLoaded", function () {
	// Falls neue Eingabe, neuer Aufruf der Auswahlfunktion
	document.getElementById('dateien')
		.addEventListener('change', dateiauswahl, false);
});*/

export function test(){
	var upload=new Upload();
	upload.readAs="DataUrl";
	upload.multiple=true;
	upload.onuploaded(function(data:{[file:string]:string}){
		debugger;
	});
//	upload.accept=".txt,.csv";
	return upload;
}
