import { $Class } from "jassijs/remote/Registry";
import { Component, ComponentProperties } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/UIComponents";

export interface UploadProperties extends ComponentProperties {
    readAs?: "Text" | "DataUrl" | "ArrayBuffer" | "BinaryString";

    accept?: string;
    multiple?: boolean;
    onuploaded?: (any, FileList, JQueryEventObject) => any;
}

@$UIComponent({ fullPath: "common/Upload", icon: "mdi mdi-cloud-upload-outline" })
@$Class("jassijs.ui.Upload")
export class Upload<T extends UploadProperties = UploadProperties> extends Component<T> implements UploadProperties {
    /* get dom(){
         return this.dom;
     }*/
    constructor(props: UploadProperties = {}) {
        super(props);
    }
    private downloaded;
    render() {
        var _this = this;
        return React.createElement("input", {
            className: "Upload", type: "file", name: "files[]",
            onChange: (evt) => {
                _this.readUpload(<any>evt);
            }
        });
    }
    config(config: T): Upload {
        super.config(config);
        return this;
    }
    componentDidMount(): void {
    }
    get dom(): HTMLInputElement {
        return <any>super.dom;
    }

    set dom(value: HTMLInputElement) {
        super.dom = value;
    }
    @$Property({ chooseFromStrict: true, chooseFrom: ["Text", "DataUrl", "ArrayBuffer", "BinaryString"] })
    get readAs(): "Text" | "DataUrl" | "ArrayBuffer" | "BinaryString" {
        return this.state.readAs.current;
    }
    set readAs(value: "Text" | "DataUrl" | "ArrayBuffer" | "BinaryString") {
        this.state.readAs.current = value;
    }
    get accept(): string {
        return this.dom.accept;
    }
    /**
     * which file types are accepted e.g ".txt,.csv"
     **/
    @$Property()
    set accept(value: string) {
        this.dom.accept = value;
    }
    get multiple(): boolean {
        return this.dom.multiple;
    }
    /**
     * multiple files can be uploaded
     **/
    @$Property()
    set multiple(value: boolean) {
        this.dom.multiple = value;
    }
    private handleDownload(parent:Upload,data, file,  reader, files, evt) {
        reader.addEventListener("load", function (e) {
            data[file.name] = reader.result;
            parent.downloaded++;
            if (parent.downloaded == files.length) {
                parent.callEvent("uploaded", data, files, evt);
            }
        }, false);
    }
    private async readUpload(evt: JQuery.TriggeredEvent<any, any, any, any>) {
        var files: FileList = evt.target["files"];
        var _this = this;
        var data: { [file: string]: string | ArrayBuffer } = {};
        this.downloaded = 0;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            this.handleDownload(_this,data,file,reader,files,evt);
            if (this.readAs === "DataUrl") {
                reader.readAsDataURL(file);
                // data[file.name]=reader.result;
            } else if (this.readAs === "ArrayBuffer") {
                reader.readAsArrayBuffer(file);
                // data[file.name]=reader.result;
            } else if (this.readAs === "BinaryString") {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        }

    };
    /**
     * register handler to get the uploaded data
     */
    @$Property({ default: "function(data:{[file:string]:string}){\n\t\n}" })
    onuploaded(handler: (data: { [file: string]: string }, files: FileList, evt: JQueryEventObject) => any) {
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

export function test() {
    var upload = new Upload({
        readAs: "DataUrl",
        multiple: true
    });
    //    upload.readAs = "DataUrl";
    //   upload.multiple = true;
    upload.onuploaded(function (data: { [file: string]: string }) {
        debugger;
        console.log(data);
    });
    //	upload.accept=".txt,.csv";
    return upload;
}
