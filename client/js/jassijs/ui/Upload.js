var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/ui/UIComponents"], function (require, exports, Registry_1, Component_1, Property_1, UIComponents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Upload = void 0;
    let Upload = class Upload extends Component_1.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor(props = {}) {
            super(props);
        }
        render() {
            var _this = this;
            return React.createElement("input", {
                className: "Upload", type: "file", name: "files[]",
                onChange: (evt) => {
                    _this.readUpload(evt);
                }
            });
        }
        config(config) {
            super.config(config);
            return this;
        }
        componentDidMount() {
        }
        get dom() {
            return super.dom;
        }
        set dom(value) {
            super.dom = value;
        }
        get readAs() {
            return this.state.readAs.current;
        }
        set readAs(value) {
            this.state.readAs.current = value;
        }
        get accept() {
            return this.dom.accept;
        }
        /**
         * which file types are accepted e.g ".txt,.csv"
         **/
        set accept(value) {
            this.dom.accept = value;
        }
        get multiple() {
            return this.dom.multiple;
        }
        /**
         * multiple files can be uploaded
         **/
        set multiple(value) {
            this.dom.multiple = value;
        }
        handleDownload(parent, data, file, reader, files, evt) {
            reader.addEventListener("load", function (e) {
                data[file.name] = reader.result;
                parent.downloaded++;
                if (parent.downloaded == files.length) {
                    parent.callEvent("uploaded", data, files, evt);
                }
            }, false);
        }
        async readUpload(evt) {
            var files = evt.target["files"];
            var _this = this;
            var data = {};
            this.downloaded = 0;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                this.handleDownload(_this, data, file, reader, files, evt);
                if (this.readAs === "DataUrl") {
                    reader.readAsDataURL(file);
                    // data[file.name]=reader.result;
                }
                else if (this.readAs === "ArrayBuffer") {
                    reader.readAsArrayBuffer(file);
                    // data[file.name]=reader.result;
                }
                else if (this.readAs === "BinaryString") {
                    reader.readAsBinaryString(file);
                }
                else {
                    reader.readAsText(file);
                }
            }
        }
        ;
        /**
         * register handler to get the uploaded data
         */
        onuploaded(handler) {
            this.addEvent("uploaded", handler);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFromStrict: true, chooseFrom: ["Text", "DataUrl", "ArrayBuffer", "BinaryString"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Upload.prototype, "readAs", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Upload.prototype, "accept", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Upload.prototype, "multiple", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(data:{[file:string]:string}){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Upload.prototype, "onuploaded", null);
    Upload = __decorate([
        (0, UIComponents_1.$UIComponent)({ fullPath: "common/Upload", icon: "mdi mdi-cloud-upload-outline" }),
        (0, Registry_1.$Class)("jassijs.ui.Upload"),
        __metadata("design:paramtypes", [Object])
    ], Upload);
    exports.Upload = Upload;
    /*
        // UI-Events erst registrieren wenn das DOM bereit ist!
    document.addEventListener("DOMContentLoaded", function () {
        // Falls neue Eingabe, neuer Aufruf der Auswahlfunktion
        document.getElementById('dateien')
            .addEventListener('change', dateiauswahl, false);
    });*/
    function test() {
        var upload = new Upload({
            readAs: "DataUrl",
            multiple: true
        });
        //    upload.readAs = "DataUrl";
        //   upload.multiple = true;
        upload.onuploaded(function (data) {
            debugger;
            console.log(data);
        });
        //	upload.accept=".txt,.csv";
        return upload;
    }
    exports.test = test;
});
//# sourceMappingURL=Upload.js.map