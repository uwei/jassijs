var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, jassijs_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Upload = void 0;
    let Upload = class Upload extends Component_1.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<input type="file" id="dateien" name="files[]" />')[0]);
            var _this = this;
            $(this.dom).on("change", function (evt) {
                _this.readUpload(evt);
            });
        }
        get accept() {
            return $(this.dom).prop("accept");
        }
        /**
         * which file types are accepted e.g ".txt,.csv"
         **/
        set accept(value) {
            $(this.dom).prop("accept", value);
        }
        get multiple() {
            return $(this.dom).prop("multiple");
        }
        /**
         * multiple files can be uploaded
         **/
        set multiple(value) {
            $(this.dom).prop("multiple", value);
        }
        async readUpload(evt) {
            var files = evt.target["files"];
            var data = {};
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.readAsText(file);
                data[file.name] = await file.text();
            }
            this.callEvent("uploaded", data, files, evt);
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
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Upload.prototype, "accept", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Upload.prototype, "multiple", null);
    __decorate([
        Property_1.$Property({ default: "function(data:{[file:string]:string}){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Upload.prototype, "onuploaded", null);
    Upload = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Upload", icon: "mdi mdi-cloud-upload-outline" }),
        jassijs_1.$Class("jassijs.ui.Upload"),
        __metadata("design:paramtypes", [])
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
        var upload = new Upload();
        upload.multiple = true;
        upload.onuploaded(function (data) {
            debugger;
        });
        //	upload.accept=".txt,.csv";
        return upload;
    }
    exports.test = test;
});
//# sourceMappingURL=Upload.js.map
//# sourceMappingURL=Upload.js.map