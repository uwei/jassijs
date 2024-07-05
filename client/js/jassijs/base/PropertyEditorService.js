var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/remote/Registry"], function (require, exports, Registry_1, Classes_1, Registry_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyeditor = exports.PropertyEditorService = void 0;
    Registry_2 = __importDefault(Registry_2);
    let PropertyEditorService = class PropertyEditorService {
        /**
        * manage all PropertyEditors
        * @class jassijs.ui.PropertyEditorService
        */
        constructor() {
            /** @member {Object.<string,[class]>}
             *  data[type]*/
            this.data = {};
            this.funcRegister = Registry_2.default.onregister("$PropertyEditor", this.register.bind(this));
        }
        reset() {
            this.data = {};
        }
        destroy() {
            Registry_2.default.offregister("$PropertyEditor", this.funcRegister);
        }
        async loadType(type) {
            if (this.data[type] === undefined) {
                var dat = await Registry_2.default.getJSONData("$PropertyEditor");
                for (var x = 0; x < dat.length; x++) {
                    if (dat[x].params[0].indexOf(type) !== -1) {
                        await Classes_1.classes.loadClass(dat[x].classname);
                    }
                }
                if (this.data[type] === undefined)
                    throw "PropertyEditor not found for type:" + type;
            }
            return Classes_1.classes.loadClass(this.data[type]);
        }
        /**
         * creates PropertyEditor for type
         *
         * @param {string} variablename - the name of the variable
         * @param {jassijs.ui.Property} property - name of the type
         * @param {jassijs.ui.PropertyEditor} propertyEditor - the PropertyEditor instance
         */
        createFor(property, propertyEditor) {
            var sclass = undefined;
            var promise = undefined;
            if (property.editor !== undefined) {
                sclass = property.editor;
            }
            else {
                if (this.data[property.type] === undefined) {
                    return this.loadType(property.type);
                }
                else
                    sclass = this.data[property.type][0];
            }
            var oclass = Classes_1.classes.getClass(sclass);
            if (oclass)
                return new (oclass)(property, propertyEditor);
            throw new Error("class not loaded " + sclass);
            //return new LoadingEditor(property,propertyEditor,classes.loadClass(sclass));
        }
        register(oclass, types) {
            var name = Classes_1.classes.getClassName(oclass);
            for (var x = 0; x < types.length; x++) {
                if (this.data[types[x]] === undefined)
                    this.data[types[x]] = [];
                if (this.data[types[x]].indexOf(name) === -1)
                    this.data[types[x]].push(name);
            }
        }
    };
    PropertyEditorService = __decorate([
        (0, Registry_1.$Class)("jassijs.base.PropertyEditorService"),
        __metadata("design:paramtypes", [])
    ], PropertyEditorService);
    exports.PropertyEditorService = PropertyEditorService;
    var propertyeditor = new PropertyEditorService();
    exports.propertyeditor = propertyeditor;
});
//# sourceMappingURL=PropertyEditorService.js.map