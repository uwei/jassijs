var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/ui/PropertyEditors/LoadingEditor"], function (require, exports, Jassi_1, Classes_1, Registry_1, LoadingEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propertyeditor = exports.PropertyEditorService = void 0;
    let PropertyEditorService = class PropertyEditorService {
        /**
        * manage all PropertyEditors
        * @class jassijs.ui.PropertyEditorService
        */
        constructor() {
            /** @member {Object.<string,[class]>}
             *  data[type]*/
            this.data = {};
            this.funcRegister = Registry_1.default.onregister("$PropertyEditor", this.register.bind(this));
        }
        reset() {
            this.data = {};
        }
        destroy() {
            Registry_1.default.offregister("$PropertyEditor", this.funcRegister);
        }
        async loadType(type) {
            if (this.data[type] === undefined) {
                var dat = await Registry_1.default.getJSONData("$PropertyEditor");
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
                    promise = this.loadType(property.type);
                }
                else
                    sclass = this.data[property.type][0];
            }
            if (sclass !== undefined) {
                var oclass = Classes_1.classes.getClass(sclass);
                if (oclass)
                    return new (oclass)(property, propertyEditor);
                else
                    return new LoadingEditor_1.LoadingEditor(property, propertyEditor, Classes_1.classes.loadClass(sclass));
            }
            else
                return new LoadingEditor_1.LoadingEditor(property, propertyEditor, promise);
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
        Jassi_1.$Class("jassijs.base.PropertyEditorService"),
        __metadata("design:paramtypes", [])
    ], PropertyEditorService);
    exports.PropertyEditorService = PropertyEditorService;
    var propertyeditor = new PropertyEditorService();
    exports.propertyeditor = propertyeditor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvcGVydHlFZGl0b3JTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy9iYXNlL1Byb3BlcnR5RWRpdG9yU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBU0EsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7UUFHOUI7OztVQUdFO1FBQ0Y7WUFDSTs0QkFDZ0I7WUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsWUFBWSxHQUFDLGtCQUFRLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQztRQUNELEtBQUs7WUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNuQixDQUFDO1FBQ0QsT0FBTztZQUNILGtCQUFRLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBQ08sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFXO1lBQ2hDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUM7Z0JBQ3hCLElBQUksR0FBRyxHQUFDLE1BQU0sa0JBQVEsQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDdEQsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7b0JBQzNCLElBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUcsQ0FBQyxDQUFDLEVBQUM7d0JBQ2xELE1BQU0saUJBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO3FCQUMxQztpQkFFVTtnQkFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssU0FBUztvQkFDN0IsTUFBTSxvQ0FBb0MsR0FBRyxJQUFJLENBQUM7YUFDekQ7WUFDRCxPQUFPLGlCQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0Q7Ozs7OztXQU1HO1FBQ0gsU0FBUyxDQUFFLFFBQWlCLEVBQUUsY0FBNkI7WUFDdkQsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDO1lBQ3ZCLElBQUksT0FBTyxHQUFDLFNBQVMsQ0FBQztZQUN0QixJQUFJLFFBQVEsQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUMvQixNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUM1QjtpQkFBTTtnQkFDSCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBQztvQkFDeEMsT0FBTyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN2Qzs7b0JBQ0EsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsSUFBRyxNQUFNLEtBQUcsU0FBUyxFQUFDO2dCQUNyQixJQUFJLE1BQU0sR0FBRyxpQkFBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEMsSUFBRyxNQUFNO29CQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQzs7b0JBRS9DLE9BQU8sSUFBSSw2QkFBYSxDQUFDLFFBQVEsRUFBQyxjQUFjLEVBQUMsaUJBQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzthQUM3RTs7Z0JBQ0EsT0FBTyxJQUFJLDZCQUFhLENBQUMsUUFBUSxFQUFDLGNBQWMsRUFBQyxPQUFPLENBQUMsQ0FBQztRQUUvRCxDQUFDO1FBQ08sUUFBUSxDQUFDLE1BQW1DLEVBQUUsS0FBYztZQUNoRSxJQUFJLElBQUksR0FBUSxpQkFBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVM7b0JBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUM3QixJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEM7UUFDTCxDQUFDO0tBQ0osQ0FBQTtJQXRFWSxxQkFBcUI7UUFEakMsY0FBTSxDQUFDLG9DQUFvQyxDQUFDOztPQUNoQyxxQkFBcUIsQ0FzRWpDO0lBdEVZLHNEQUFxQjtJQXVFbEMsSUFBSSxjQUFjLEdBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO0lBQ3ZDLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQge1Byb3BlcnR5RWRpdG9yfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvclwiO1xuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgcmVnaXN0cnkgZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQge0VkaXRvcn0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0VkaXRvclwiO1xuaW1wb3J0IHtQcm9wZXJ0eX0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IExvYWRpbmdFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvcnMvTG9hZGluZ0VkaXRvclwiO1xuXG5AJENsYXNzKFwiamFzc2lqcy5iYXNlLlByb3BlcnR5RWRpdG9yU2VydmljZVwiKVxuZXhwb3J0IGNsYXNzIFByb3BlcnR5RWRpdG9yU2VydmljZSB7XG4gICAgZGF0YTsvLzp7IFtrZXk6c3RyaW5nXTpbc3RyaW5nXTsgfTtcbiAgICBwcml2YXRlIGZ1bmNSZWdpc3RlcjtcbiAgICAvKipcbiAgICAqIG1hbmFnZSBhbGwgUHJvcGVydHlFZGl0b3JzXG4gICAgKiBAY2xhc3MgamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvclNlcnZpY2VcbiAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKiogQG1lbWJlciB7T2JqZWN0LjxzdHJpbmcsW2NsYXNzXT59XG4gICAgICAgICAqICBkYXRhW3R5cGVdKi9cbiAgICAgICAgdGhpcy5kYXRhID0ge307XG4gICAgICAgIHRoaXMuZnVuY1JlZ2lzdGVyPXJlZ2lzdHJ5Lm9ucmVnaXN0ZXIoXCIkUHJvcGVydHlFZGl0b3JcIix0aGlzLnJlZ2lzdGVyLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge307XG4gICAgfVxuICAgIGRlc3Ryb3koKXtcbiAgICAgICAgcmVnaXN0cnkub2ZmcmVnaXN0ZXIoXCIkUHJvcGVydHlFZGl0b3JcIix0aGlzLmZ1bmNSZWdpc3Rlcik7XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgbG9hZFR5cGUodHlwZTpzdHJpbmcpe1xuICAgIFx0IGlmICh0aGlzLmRhdGFbdHlwZV0gPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgdmFyIGRhdD1hd2FpdCByZWdpc3RyeS5nZXRKU09ORGF0YShcIiRQcm9wZXJ0eUVkaXRvclwiKTtcbiAgICAgICAgICAgICAgICBmb3IodmFyIHg9MDt4PGRhdC5sZW5ndGg7eCsrKXtcbiAgICAgICAgICAgICAgICBcdFx0aWYoZGF0W3hdLnBhcmFtc1swXS5pbmRleE9mKHR5cGUpIT09LTEpe1xuXHRcdFx0XHRcdFx0XHRhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhkYXRbeF0uY2xhc3NuYW1lKTtcblx0XHRcdFx0XHRcdH1cbiAgICAgICAgICAgICAgICBcdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhW3R5cGVdID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHRocm93IFwiUHJvcGVydHlFZGl0b3Igbm90IGZvdW5kIGZvciB0eXBlOlwiICsgdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjbGFzc2VzLmxvYWRDbGFzcyh0aGlzLmRhdGFbdHlwZV0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjcmVhdGVzIFByb3BlcnR5RWRpdG9yIGZvciB0eXBlXG4gICAgICogXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhcmlhYmxlbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Qcm9wZXJ0eX0gcHJvcGVydHkgLSBuYW1lIG9mIHRoZSB0eXBlIFxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcn0gcHJvcGVydHlFZGl0b3IgLSB0aGUgUHJvcGVydHlFZGl0b3IgaW5zdGFuY2UgXG4gICAgICovXG4gICAgY3JlYXRlRm9yKCBwcm9wZXJ0eTpQcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3I6UHJvcGVydHlFZGl0b3IpOkVkaXRvciB7XG4gICAgICAgIHZhciBzY2xhc3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBwcm9taXNlPXVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHByb3BlcnR5LmVkaXRvciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzY2xhc3MgPSBwcm9wZXJ0eS5lZGl0b3I7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW3Byb3BlcnR5LnR5cGVdID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgcHJvbWlzZT10aGlzLmxvYWRUeXBlKHByb3BlcnR5LnR5cGUpO1xuICAgICAgICAgICAgfWVsc2Vcblx0ICAgICAgICAgICAgc2NsYXNzID0gdGhpcy5kYXRhW3Byb3BlcnR5LnR5cGVdWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmKHNjbGFzcyE9PXVuZGVmaW5lZCl7XG4gICAgICAgIFx0dmFyIG9jbGFzcyA9IGNsYXNzZXMuZ2V0Q2xhc3Moc2NsYXNzKTtcbiAgICAgICAgXHRpZihvY2xhc3MpXG5cdCAgICAgICAgXHRyZXR1cm4gbmV3IChvY2xhc3MpKCBwcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3IpO1xuXHQgICAgICAgIGVsc2Vcblx0ICAgICAgICBcdHJldHVybiBuZXcgTG9hZGluZ0VkaXRvcihwcm9wZXJ0eSxwcm9wZXJ0eUVkaXRvcixjbGFzc2VzLmxvYWRDbGFzcyhzY2xhc3MpKTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgXHRyZXR1cm4gbmV3IExvYWRpbmdFZGl0b3IocHJvcGVydHkscHJvcGVydHlFZGl0b3IscHJvbWlzZSk7XG4gICAgICAgIFxuICAgIH1cbiAgICBwcml2YXRlIHJlZ2lzdGVyKG9jbGFzczogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gYW55LCB0eXBlczpzdHJpbmdbXSl7XG4gICAgICAgIHZhciBuYW1lOnN0cmluZz1jbGFzc2VzLmdldENsYXNzTmFtZShvY2xhc3MpO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhW3R5cGVzW3hdXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVt0eXBlc1t4XV0gPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGFbdHlwZXNbeF1dLmluZGV4T2YobmFtZSkgPT09IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YVt0eXBlc1t4XV0ucHVzaChuYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbnZhciBwcm9wZXJ0eWVkaXRvcj1uZXcgUHJvcGVydHlFZGl0b3JTZXJ2aWNlKCk7XG5leHBvcnQge3Byb3BlcnR5ZWRpdG9yfTtcblxuIl19