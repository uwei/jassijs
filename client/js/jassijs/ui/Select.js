var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/DataComponent", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs/ext/jquery.choosen"], function (require, exports, Jassi_1, Component_1, DataComponent_1, Property_1, Classes_1) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Select = void 0;
    /*
    declare global {
        interface JQuery {
            chosen: any;
        }
    }
    */
    let SelectCreateProperties = class SelectCreateProperties extends Component_1.ComponentCreateProperties {
    };
    __decorate([
        Property_1.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], SelectCreateProperties.prototype, "multiple", void 0);
    __decorate([
        Property_1.$Property({ default: false }),
        __metadata("design:type", Boolean)
    ], SelectCreateProperties.prototype, "allowDeselect", void 0);
    __decorate([
        Property_1.$Property({ default: "" }),
        __metadata("design:type", String)
    ], SelectCreateProperties.prototype, "placeholder", void 0);
    SelectCreateProperties = __decorate([
        Jassi_1.$Class("jassijs.ui.SelectCreateProperties")
    ], SelectCreateProperties);
    let Select = class Select extends DataComponent_1.DataComponent {
        constructor(properties = undefined) {
            super();
            super.init($('<select class="Select"><option value=""></option></select>')[0]);
            var _this = this;
            if (properties !== undefined && properties.multiple === true)
                $('#' + this._id).prop("multiple", true);
            var single = false;
            if (properties !== undefined && properties.allowDeselect !== undefined)
                single = properties.allowDeselect;
            var placeholder = "Select...";
            if (properties !== undefined && properties.placeholder !== undefined)
                placeholder = properties.placeholder;
            $('#' + this._id).chosen({
                // width: "100px",
                placeholder_text_single: placeholder,
                allow_single_deselect: single
            });
            this.domSelect = this.dom;
            if (this.domWrapper.children.length == 1) { //mobile device
                this.dom = this.domSelect;
            }
            else
                this.dom = this.domWrapper.children[1];
            $(this.domSelect).attr("id", "");
            $(this.dom).attr("id", this._id);
            $(this.domSelect).chosen().change(function (e) {
                if (_this._select !== undefined)
                    _this._select.value = _this.value;
                //e.data = _this.value;
                //handler(e);
            });
            // this.layout();
        }
        refresh() {
            $(this.domSelect).trigger("chosen:updated");
            //	 $('#'+this._id).data("placeholder","Select...").chosen({
            //	 	width: "100px"
            //	 });
        }
        /**
         * called if value has changed
         * @param {function} handler - the function which is executed
         */
        onchange(handler) {
            var _this = this;
            $(this.domSelect).chosen().change(function (e) {
                e.data = _this.value;
                handler(e);
            });
        }
        /**
         * if the value is changed then the value of _component is also changed (_component.value)
         */
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        /**
         * @member {string|function}  - property or function to get the displaystring for the object
         **/
        set display(value) {
            this._display = value;
            if (this.items !== undefined)
                this.items = this.items;
        }
        get display() {
            return this._display;
        }
        set items(value) {
            this._items = value;
            this.options = { undefined: undefined };
            if (this.domSelect === undefined)
                return;
            //TODO console.log("dekt.memoryleak");
            /* slow
            while (this.domSelect.firstChild) {
                $(this.domSelect.firstChild).remove();
    
            }
            this.domSelect.appendChild($('<option value=""></option>')[0]);
            for (var x = 0;x < value.length;x++) {
                var ob = value[x];
                var val = undefined;
                if (typeof (this.display) === "function")
                    val = this.display(ob);
                else if (this.display !== undefined)
                    val = ob[this.display];
                else
                    val = ob;
                this.options[x.toString()] = ob;
                var it = $('<option value="' + x + '">' + val + '</option>')[0];
                this.domSelect.appendChild(it);
            }
            this.refresh();
    */
            var html = '<option value=""></option>';
            for (var x = 0; x < value.length; x++) {
                var ob = value[x];
                var val = undefined;
                if (typeof (this.display) === "function")
                    val = this.display(ob);
                else if (this.display !== undefined)
                    val = ob[this.display];
                else
                    val = ob;
                this.options[x.toString()] = ob;
                html += '<option value="' + x + '">' + val + '</option>';
                //this.domSelect.appendChild(it);
            }
            this.domSelect.innerHTML = html;
            this.refresh();
            /*   for(var x=0;x<value.length;x++){
                   delete value[x].recid;
               }*/
        }
        get items() {
            //  if(w2ui[this._id]===undefined)
            return this._items;
            //   return w2ui[this._id].records;//$(this.dom).text();
        }
        /**
         * @member {object} sel - the selected object
         */
        set value(sel) {
            var found = false;
            if ($(this.domSelect).chosen().prop("multiple")) {
                var keys = [];
                if (sel) {
                    sel.forEach((se) => {
                        for (var key in this.options) {
                            if (this.options[key] === se) {
                                keys.push(key);
                                found = true;
                                break;
                            }
                        }
                        $(this.domSelect).val(keys).trigger("chosen:updated");
                    });
                }
            }
            else {
                for (var key in this.options) {
                    if (this.options[key] === sel) {
                        $(this.domSelect).val(key).trigger("chosen:updated");
                        found = true;
                        break;
                    }
                }
            }
            if (!found)
                $(this.domSelect).val("").trigger("chosen:updated");
            // refresh()
        }
        get value() {
            if (this.options === undefined)
                return undefined;
            var val = $(this.domSelect).chosen().val();
            if ($(this.domSelect).chosen().prop("multiple")) {
                var opts = [];
                val.forEach((e) => {
                    if (e !== "") //placeholder for empty
                        opts.push(this.options[e]);
                });
                return opts;
            }
            return this.options[val];
        }
        /**
         * @member {string|number} - the width of the component
         * e.g. 50 or "100%"
         */
        /* set width(value){ //the Code
             super.width=value;
         
              
              if(this.domWrapper.children.length>1){
                 var val=$(this.domWrapper).css("width");
                 $(this.domWrapper.children[1]).css("width",val);
              }
         }*/
        /**
         * binds a component to a databinder
         * @param {Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
        
        bind(databinder,property){
            this._databinder=databinder;
            databinder.add(property,this,"onselect");
            databinder.checkAutocommit(this);
        } */
        destroy() {
            //	$(this.domSelect).chosen('destroy');
            $(this.domSelect).chosen("destroy"); //.search_choices;
            $('#' + this._id).remove(); //.search_choices;
            $(this.domSelect).remove();
            $(this.dom).remove();
            this.domSelect = undefined;
            super.destroy();
        }
    };
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Select.prototype, "onchange", null);
    __decorate([
        Property_1.$Property({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Select.prototype, "display", null);
    Select = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Select", icon: "mdi mdi-form-dropdown" }),
        Jassi_1.$Class("jassijs.ui.Select"),
        Property_1.$Property({ name: "new", type: "json", componentType: "jassijs.ui.SelectCreateProperties" }),
        __metadata("design:paramtypes", [SelectCreateProperties])
    ], Select);
    exports.Select = Select;
    async function test() {
        var Panel = Classes_1.classes.getClass("jassijs.ui.Panel");
        var Button = Classes_1.classes.getClass("jassijs.ui.Button");
        var me = {};
        var pan = new Panel();
        var bt = new Button();
        var bt2 = new Button();
        me.sel = new Select({
            "multiple": false,
            "placeholder": "Hallo",
            "allowDeselect": false
        });
        bt.text = "wer";
        bt.onclick(function (event) {
            //	bt.text=me.sel.value.vorname;	
            me.sel.value = me.sel.items[1];
        });
        bt.height = 15;
        pan.width = 500;
        me.sel.display = "nachname";
        me.sel.items = [{ name: "Achim", nachname: "<b>Wenzel</b>" },
            { name: "Anne", nachname: "Meier" }];
        var h = me.sel.items;
        me.sel.width = 195;
        me.sel.height = 25;
        me.sel.onchange(function (event) {
            alert(event.data.nachname);
        });
        //	$('#'+sel._id).data("placeholder","Select2...").chosen({width: "200px"});
        pan.add(me.sel);
        pan.add(bt);
        pan.add(bt2);
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy91aS9TZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFTQTs7Ozs7O01BTUU7SUFFRixJQUFNLHNCQUFzQixHQUE1QixNQUFNLHNCQUF1QixTQUFRLHFDQUF5QjtLQU83RCxDQUFBO0lBTEE7UUFEQyxvQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDOzs0REFDWjtJQUVsQjtRQURDLG9CQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUM7O2lFQUNQO0lBRXZCO1FBREMsb0JBQVMsQ0FBQyxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQzs7K0RBQ047SUFOZixzQkFBc0I7UUFEM0IsY0FBTSxDQUFDLG1DQUFtQyxDQUFDO09BQ3RDLHNCQUFzQixDQU8zQjtJQU1ELElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU8sU0FBUSw2QkFBYTtRQU9yQyxZQUFZLGFBQW9DLFNBQVM7WUFDckQsS0FBSyxFQUFFLENBQUM7WUFFUixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyw0REFBNEQsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0UsSUFBSSxLQUFLLEdBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssSUFBSTtnQkFDeEQsQ0FBQyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM3QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsQ0FBQyxhQUFhLEtBQUssU0FBUztnQkFDbEUsTUFBTSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUM7WUFDdEMsSUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDO1lBQzlCLElBQUksVUFBVSxLQUFLLFNBQVMsSUFBSSxVQUFVLENBQUMsV0FBVyxLQUFLLFNBQVM7Z0JBQ2hFLFdBQVcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1lBRXpDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztnQkFFdEIsa0JBQWtCO2dCQUNqQix1QkFBdUIsRUFBRSxXQUFXO2dCQUNwQyxxQkFBcUIsRUFBRSxNQUFNO2FBQ2hDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUMxQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsRUFBQyxlQUFlO2dCQUN0RCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7YUFDN0I7O2dCQUNHLElBQUksQ0FBQyxHQUFHLEdBQWdCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVMsQ0FBQztnQkFDM0MsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLFNBQVM7b0JBQzNCLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ25DLHVCQUF1QjtnQkFDdkIsYUFBYTtZQUNqQixDQUFDLENBQUMsQ0FBQztZQUdILGlCQUFpQjtRQUNyQixDQUFDO1FBRUQsT0FBTztZQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFNUMsNERBQTREO1lBQzVELG1CQUFtQjtZQUNuQixPQUFPO1FBRVgsQ0FBQztRQUdEOzs7V0FHRztRQUVILFFBQVEsQ0FBQyxPQUFPO1lBRVosSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVMsQ0FBQztnQkFFeEMsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNyQixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDSjs7V0FFTTtRQUNILElBQUksZUFBZSxDQUFDLFVBQXlCO1lBQ3pDLElBQUksQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO1FBQzlCLENBQUM7UUFDRCxJQUFJLGVBQWU7WUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQSxxQkFBcUI7UUFDN0MsQ0FBQztRQUNEOztZQUVJO1FBQ0osSUFBSSxPQUFPLENBQUMsS0FBd0I7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7Z0JBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNoQyxDQUFDO1FBRUQsSUFBSSxPQUFPO1lBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7UUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFLO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUMsS0FBSyxDQUFDO1lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUN4QyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUztnQkFDNUIsT0FBTztZQUNYLHNDQUFzQztZQUN0Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFvQk47WUFDQyxJQUFJLElBQUksR0FBQyw0QkFBNEIsQ0FBQztZQUN0QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBRTtnQkFDNUIsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUM7Z0JBQ3BCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxVQUFVO29CQUNwQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVM7b0JBQy9CLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztvQkFFdkIsR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxJQUFFLGlCQUFpQixHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLFdBQVcsQ0FBQztnQkFDdkQsaUNBQWlDO2FBQ3BDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUMsSUFBSSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNWOztrQkFFTTtRQUNWLENBQUM7UUFDRCxJQUFJLEtBQUs7WUFFTCxrQ0FBa0M7WUFDbEMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ25CLHdEQUF3RDtRQUM1RCxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFJLEtBQUssQ0FBQyxHQUFHO1lBQ1osSUFBSSxLQUFLLEdBQUMsS0FBSyxDQUFDO1lBQ2hCLElBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUM7Z0JBQzlDLElBQUksSUFBSSxHQUFDLEVBQUUsQ0FBQztnQkFDWixJQUFHLEdBQUcsRUFBQztvQkFDTixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFDLEVBQUU7d0JBQ2pCLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTs0QkFDdkIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQ0FDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQ0FDckIsS0FBSyxHQUFDLElBQUksQ0FBQztnQ0FDRixNQUFNOzZCQUNUO3lCQUNKO3dCQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUM3RCxDQUFDLENBQUMsQ0FBQztpQkFDQTthQUNEO2lCQUFJO2dCQUNELEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDMUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRTt3QkFDM0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7d0JBQ2pFLEtBQUssR0FBQyxJQUFJLENBQUM7d0JBQ0MsTUFBTTtxQkFDVDtpQkFDSjthQUNKO1lBQ0UsSUFBRyxDQUFDLEtBQUs7Z0JBQ1IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDckQsWUFBWTtRQUNoQixDQUFDO1FBQ0QsSUFBSSxLQUFLO1lBQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVM7Z0JBQzFCLE9BQU8sU0FBUyxDQUFDO1lBQ3JCLElBQUksR0FBRyxHQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0MsSUFBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBQztnQkFDOUMsSUFBSSxJQUFJLEdBQUMsRUFBRSxDQUFDO2dCQUNaLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUMsRUFBRTtvQkFDaEIsSUFBRyxDQUFDLEtBQUcsRUFBRSxFQUFDLHVCQUF1Qjt3QkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sSUFBSSxDQUFDO2FBQ1o7WUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQVMsR0FBRyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNEOzs7V0FHRztRQUNIOzs7Ozs7OztZQVFJO1FBQ0o7Ozs7Ozs7OztZQVNJO1FBRUosT0FBTztZQUNILHVDQUF1QztZQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFBLGtCQUFrQjtZQUN0RCxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBLGtCQUFrQjtZQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7WUFDM0IsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FDSixDQUFBO0lBcEtHO1FBREMsb0JBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDOzs7OzBDQVNqRDtJQW1CRDtRQURDLG9CQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7Ozt5Q0FHN0I7SUF6RlEsTUFBTTtRQUhsQix3QkFBWSxDQUFDLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQztRQUMxRSxjQUFNLENBQUMsbUJBQW1CLENBQUM7UUFDM0Isb0JBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQyxhQUFhLEVBQUMsbUNBQW1DLEVBQUUsQ0FBQzt5Q0FRaEUsc0JBQXNCO09BUHBDLE1BQU0sQ0FnT2xCO0lBaE9ZLHdCQUFNO0lBa09aLEtBQUssVUFBVSxJQUFJO1FBR3RCLElBQUksS0FBSyxHQUFHLGlCQUFPLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDakQsSUFBSSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVuRCxJQUFJLEVBQUUsR0FBa0IsRUFFdkIsQ0FBQztRQUNGLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7UUFDdEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUM7WUFDaEIsVUFBVSxFQUFFLEtBQUs7WUFDakIsYUFBYSxFQUFFLE9BQU87WUFDdEIsZUFBZSxFQUFFLEtBQUs7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDaEIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUs7WUFDckIsaUNBQWlDO1lBQ2pDLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDZixHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUNoQixFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7UUFDL0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxFQUFDLElBQUksRUFBQyxPQUFPLEVBQUMsUUFBUSxFQUFDLGVBQWUsRUFBQztZQUNqRCxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEdBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7UUFDaEIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNuQixFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFTLEtBQUs7WUFDMUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFSCw0RUFBNEU7UUFFNUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixPQUFPLEdBQUcsQ0FBQztJQUVmLENBQUM7SUF6Q0Qsb0JBeUNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7Q29tcG9uZW50LCAgJFVJQ29tcG9uZW50LCBDb21wb25lbnRDcmVhdGVQcm9wZXJ0aWVzIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7RGF0YUNvbXBvbmVudH0gZnJvbSBcImphc3NpanMvdWkvRGF0YUNvbXBvbmVudFwiO1xyXG4vL2ltcG9ydCBCdXR0b24gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XHJcbmltcG9ydCBcImphc3NpanMvZXh0L2pxdWVyeS5jaG9vc2VuXCI7XHJcbi8vaW1wb3J0IHtQYW5lbH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcblxyXG4vKlxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBpbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgICAgICBjaG9zZW46IGFueTtcclxuICAgIH1cclxufVxyXG4qL1xyXG5AJENsYXNzKFwiamFzc2lqcy51aS5TZWxlY3RDcmVhdGVQcm9wZXJ0aWVzXCIpXHJcbmNsYXNzIFNlbGVjdENyZWF0ZVByb3BlcnRpZXMgZXh0ZW5kcyBDb21wb25lbnRDcmVhdGVQcm9wZXJ0aWVze1xyXG5cdEAkUHJvcGVydHkoeyBkZWZhdWx0OiBmYWxzZSB9KVxyXG5cdG11bHRpcGxlPzpib29sZWFuO1xyXG5cdEAkUHJvcGVydHkoeyBkZWZhdWx0OiBmYWxzZSB9KVxyXG5cdGFsbG93RGVzZWxlY3Q/OmJvb2xlYW47XHJcblx0QCRQcm9wZXJ0eSh7ZGVmYXVsdDogXCJcIiB9KVxyXG5cdHBsYWNlaG9sZGVyPzpzdHJpbmc7XHJcbn1cclxuXHJcblxyXG5AJFVJQ29tcG9uZW50KHsgZnVsbFBhdGg6IFwiY29tbW9uL1NlbGVjdFwiLCBpY29uOiBcIm1kaSBtZGktZm9ybS1kcm9wZG93blwiIH0pXHJcbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlNlbGVjdFwiKVxyXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXdcIiwgdHlwZTogXCJqc29uXCIsY29tcG9uZW50VHlwZTpcImphc3NpanMudWkuU2VsZWN0Q3JlYXRlUHJvcGVydGllc1wiIH0pXHJcbmV4cG9ydCBjbGFzcyBTZWxlY3QgZXh0ZW5kcyBEYXRhQ29tcG9uZW50IHtcclxuICAgIGRvbVNlbGVjdDogSFRNTEVsZW1lbnQ7XHJcbiAgICAvL2RvbTpFbGVtZW50O1xyXG4gICAgX3NlbGVjdDp7dmFsdWU6bnVtYmVyfTtcclxuICAgIG9wdGlvbnM7XHJcbiAgICBfZGlzcGxheTtcclxuICAgIF9pdGVtcztcclxuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6U2VsZWN0Q3JlYXRlUHJvcGVydGllcyA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHN1cGVyLmluaXQoJCgnPHNlbGVjdCBjbGFzcz1cIlNlbGVjdFwiPjxvcHRpb24gdmFsdWU9XCJcIj48L29wdGlvbj48L3NlbGVjdD4nKVswXSk7XHJcbiAgICAgICAgdmFyIF90aGlzPXRoaXM7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXMgIT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0aWVzLm11bHRpcGxlID09PSB0cnVlKVxyXG4gICAgICAgICAgICAkKCcjJyArIHRoaXMuX2lkKS5wcm9wKFwibXVsdGlwbGVcIiwgdHJ1ZSk7XHJcbiAgICAgICAgdmFyIHNpbmdsZSA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQgJiYgcHJvcGVydGllcy5hbGxvd0Rlc2VsZWN0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHNpbmdsZSA9IHByb3BlcnRpZXMuYWxsb3dEZXNlbGVjdDtcclxuICAgICAgICB2YXIgcGxhY2Vob2xkZXIgPSBcIlNlbGVjdC4uLlwiO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQgJiYgcHJvcGVydGllcy5wbGFjZWhvbGRlciAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlciA9IHByb3BlcnRpZXMucGxhY2Vob2xkZXI7XHJcblxyXG4gICAgICAgICQoJyMnICsgdGhpcy5faWQpLmNob3Nlbih7XHJcbiAgICAgICAgXHRcclxuICAgICAgICAgICAvLyB3aWR0aDogXCIxMDBweFwiLFxyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcl90ZXh0X3NpbmdsZTogcGxhY2Vob2xkZXIsIFxyXG4gICAgICAgICAgICBhbGxvd19zaW5nbGVfZGVzZWxlY3Q6IHNpbmdsZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZG9tU2VsZWN0ID0gdGhpcy5kb207XHJcbiAgICAgICAgaWYgKHRoaXMuZG9tV3JhcHBlci5jaGlsZHJlbi5sZW5ndGggPT0gMSkgey8vbW9iaWxlIGRldmljZVxyXG4gICAgICAgICAgICB0aGlzLmRvbSA9IHRoaXMuZG9tU2VsZWN0O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLmRvbSA9IDxIVE1MRWxlbWVudD50aGlzLmRvbVdyYXBwZXIuY2hpbGRyZW5bMV07XHJcbiAgICAgICAgJCh0aGlzLmRvbVNlbGVjdCkuYXR0cihcImlkXCIsIFwiXCIpO1xyXG4gICAgICAgICQodGhpcy5kb20pLmF0dHIoXCJpZFwiLCB0aGlzLl9pZCk7XHJcbiAgICAgICAgJCh0aGlzLmRvbVNlbGVjdCkuY2hvc2VuKCkuY2hhbmdlKGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBcdGlmIChfdGhpcy5fc2VsZWN0ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIFx0X3RoaXMuX3NlbGVjdC52YWx1ZSA9IF90aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAvL2UuZGF0YSA9IF90aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAvL2hhbmRsZXIoZSk7XHJcbiAgICAgICAgfSk7XHJcblx0XHRcdFxyXG5cclxuICAgICAgICAvLyB0aGlzLmxheW91dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2goKSB7XHJcbiAgICAgICAgJCh0aGlzLmRvbVNlbGVjdCkudHJpZ2dlcihcImNob3Nlbjp1cGRhdGVkXCIpO1xyXG5cclxuICAgICAgICAvL1x0ICQoJyMnK3RoaXMuX2lkKS5kYXRhKFwicGxhY2Vob2xkZXJcIixcIlNlbGVjdC4uLlwiKS5jaG9zZW4oe1xyXG4gICAgICAgIC8vXHQgXHR3aWR0aDogXCIxMDBweFwiXHJcbiAgICAgICAgLy9cdCB9KTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY2FsbGVkIGlmIHZhbHVlIGhhcyBjaGFuZ2VkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHdoaWNoIGlzIGV4ZWN1dGVkXHJcbiAgICAgKi9cclxuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50KXtcXG5cXHRcXG59XCIgfSlcclxuICAgIG9uY2hhbmdlKGhhbmRsZXIpIHtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAkKHRoaXMuZG9tU2VsZWN0KS5jaG9zZW4oKS5jaGFuZ2UoZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIFx0XHJcbiAgICAgICAgICAgIGUuZGF0YSA9IF90aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBoYW5kbGVyKGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cdC8qKlxyXG4gICAgICogaWYgdGhlIHZhbHVlIGlzIGNoYW5nZWQgdGhlbiB0aGUgdmFsdWUgb2YgX2NvbXBvbmVudCBpcyBhbHNvIGNoYW5nZWQgKF9jb21wb25lbnQudmFsdWUpXHJcbiAgICAgKi9cclxuICAgIHNldCBzZWxlY3RDb21wb25lbnQoX2NvbXBvbmVudDp7dmFsdWU6bnVtYmVyfSkgeyAvL3RoZSBDb2RlXHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gX2NvbXBvbmVudDtcclxuICAgIH1cclxuICAgIGdldCBzZWxlY3RDb21wb25lbnQoKTp7dmFsdWU6bnVtYmVyfSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlbGVjdDsvLyQodGhpcy5kb20pLnRleHQoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7c3RyaW5nfGZ1bmN0aW9ufSAgLSBwcm9wZXJ0eSBvciBmdW5jdGlvbiB0byBnZXQgdGhlIGRpc3BsYXlzdHJpbmcgZm9yIHRoZSBvYmplY3RcclxuICAgICAqKi9cclxuICAgIHNldCBkaXNwbGF5KHZhbHVlOiBzdHJpbmcgfCBGdW5jdGlvbikge1xyXG4gICAgICAgIHRoaXMuX2Rpc3BsYXkgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5pdGVtcyAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gdGhpcy5pdGVtcztcclxuICAgIH1cclxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiIH0pXHJcbiAgICBnZXQgZGlzcGxheSgpOiBzdHJpbmcgfCBGdW5jdGlvbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BsYXk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGl0ZW1zKHZhbHVlKSB7IC8vdGhlIENvZGVcclxuXHRcdHRoaXMuX2l0ZW1zPXZhbHVlO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHsgdW5kZWZpbmVkOiB1bmRlZmluZWQgfTtcclxuICAgICAgICBpZiAodGhpcy5kb21TZWxlY3QgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vVE9ETyBjb25zb2xlLmxvZyhcImRla3QubWVtb3J5bGVha1wiKTtcclxuICAgICAgICAvKiBzbG93XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuZG9tU2VsZWN0LmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgJCh0aGlzLmRvbVNlbGVjdC5maXJzdENoaWxkKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZG9tU2VsZWN0LmFwcGVuZENoaWxkKCQoJzxvcHRpb24gdmFsdWU9XCJcIj48L29wdGlvbj4nKVswXSk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7eCA8IHZhbHVlLmxlbmd0aDt4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9iID0gdmFsdWVbeF07XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMuZGlzcGxheSkgPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMuZGlzcGxheShvYik7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZGlzcGxheSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdmFsID0gb2JbdGhpcy5kaXNwbGF5XTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgdmFsID0gb2I7XHJcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1t4LnRvU3RyaW5nKCldID0gb2I7XHJcbiAgICAgICAgICAgIHZhciBpdCA9ICQoJzxvcHRpb24gdmFsdWU9XCInICsgeCArICdcIj4nICsgdmFsICsgJzwvb3B0aW9uPicpWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmRvbVNlbGVjdC5hcHBlbmRDaGlsZChpdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4qL1xyXG5cdFx0IHZhciBodG1sPSc8b3B0aW9uIHZhbHVlPVwiXCI+PC9vcHRpb24+JztcclxuXHRcdCBmb3IgKHZhciB4ID0gMDt4IDwgdmFsdWUubGVuZ3RoO3grKykge1xyXG4gICAgICAgICAgICB2YXIgb2IgPSB2YWx1ZVt4XTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5kaXNwbGF5KSA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy5kaXNwbGF5KG9iKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXNwbGF5ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB2YWwgPSBvYlt0aGlzLmRpc3BsYXldO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB2YWwgPSBvYjtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zW3gudG9TdHJpbmcoKV0gPSBvYjtcclxuICAgICAgICAgICAgaHRtbCs9JzxvcHRpb24gdmFsdWU9XCInICsgeCArICdcIj4nICsgdmFsICsgJzwvb3B0aW9uPic7XHJcbiAgICAgICAgICAgIC8vdGhpcy5kb21TZWxlY3QuYXBwZW5kQ2hpbGQoaXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRvbVNlbGVjdC5pbm5lckhUTUw9aHRtbDtcclxuXHRcdCB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAvKiAgIGZvcih2YXIgeD0wO3g8dmFsdWUubGVuZ3RoO3grKyl7XHJcbiAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVt4XS5yZWNpZDtcclxuICAgICAgICAgICB9Ki9cclxuICAgIH1cclxuICAgIGdldCBpdGVtcygpIHtcclxuXHJcbiAgICAgICAgLy8gIGlmKHcydWlbdGhpcy5faWRdPT09dW5kZWZpbmVkKVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcztcclxuICAgICAgICAvLyAgIHJldHVybiB3MnVpW3RoaXMuX2lkXS5yZWNvcmRzOy8vJCh0aGlzLmRvbSkudGV4dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7b2JqZWN0fSBzZWwgLSB0aGUgc2VsZWN0ZWQgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHNldCB2YWx1ZShzZWwpIHtcclxuICAgIFx0dmFyIGZvdW5kPWZhbHNlO1xyXG4gICAgXHRpZigkKHRoaXMuZG9tU2VsZWN0KS5jaG9zZW4oKS5wcm9wKFwibXVsdGlwbGVcIikpe1xyXG4gICAgXHRcdHZhciBrZXlzPVtdO1xyXG4gICAgXHRcdGlmKHNlbCl7XHJcblx0ICAgIFx0XHRzZWwuZm9yRWFjaCgoc2UpPT57XHJcblx0XHQgICAgXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcclxuXHRcdFx0ICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9uc1trZXldID09PSBzZSkge1xyXG5cdFx0XHQgICAgICAgICAgICBcdGtleXMucHVzaChrZXkpO1xyXG5cdFx0XHQgICAgXHRcdFx0Zm91bmQ9dHJ1ZTtcclxuXHRcdFx0ICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblx0XHRcdCAgICAgICAgfVxyXG5cdFx0ICAgIFx0ICAgICQodGhpcy5kb21TZWxlY3QpLnZhbChrZXlzKS50cmlnZ2VyKFwiY2hvc2VuOnVwZGF0ZWRcIik7XHJcblx0XHRcdFx0fSk7XHJcbiAgICBcdFx0fVxyXG4gICAgXHR9ZWxzZXtcclxuXHQgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLm9wdGlvbnMpIHtcclxuXHQgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zW2tleV0gPT09IHNlbCkge1xyXG5cdCAgICAgICAgICAgICAgICAkKHRoaXMuZG9tU2VsZWN0KS52YWwoa2V5KS50cmlnZ2VyKFwiY2hvc2VuOnVwZGF0ZWRcIik7XHJcblx0XHRcdFx0XHRmb3VuZD10cnVlO1xyXG5cdCAgICAgICAgICAgICAgICBicmVhaztcclxuXHQgICAgICAgICAgICB9XHJcblx0ICAgICAgICB9XHJcbiAgICBcdH1cclxuICAgICAgICBpZighZm91bmQpXHJcbiAgICAgICAgXHQkKHRoaXMuZG9tU2VsZWN0KS52YWwoXCJcIikudHJpZ2dlcihcImNob3Nlbjp1cGRhdGVkXCIpO1xyXG4gICAgICAgIC8vIHJlZnJlc2goKVxyXG4gICAgfVxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB2YXIgdmFsOmFueT0kKHRoaXMuZG9tU2VsZWN0KS5jaG9zZW4oKS52YWwoKTtcclxuICAgICAgICBpZigkKHRoaXMuZG9tU2VsZWN0KS5jaG9zZW4oKS5wcm9wKFwibXVsdGlwbGVcIikpe1xyXG4gICAgICAgIFx0dmFyIG9wdHM9W107XHJcbiAgICAgICAgXHR2YWwuZm9yRWFjaCgoZSk9PntcclxuICAgICAgICBcdFx0aWYoZSE9PVwiXCIpLy9wbGFjZWhvbGRlciBmb3IgZW1wdHlcclxuXHQgICAgICAgIFx0XHRvcHRzLnB1c2godGhpcy5vcHRpb25zWzxzdHJpbmc+ZV0pO1xyXG4gICAgICAgIFx0fSk7XHJcbiAgICAgICAgXHRyZXR1cm4gb3B0cztcclxuICAgICAgICB9XHRcclxuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zWzxzdHJpbmc+dmFsXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7c3RyaW5nfG51bWJlcn0gLSB0aGUgd2lkdGggb2YgdGhlIGNvbXBvbmVudCBcclxuICAgICAqIGUuZy4gNTAgb3IgXCIxMDAlXCJcclxuICAgICAqL1xyXG4gICAgLyogc2V0IHdpZHRoKHZhbHVlKXsgLy90aGUgQ29kZVxyXG4gICAgICAgICBzdXBlci53aWR0aD12YWx1ZTtcclxuICAgICBcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgaWYodGhpcy5kb21XcmFwcGVyLmNoaWxkcmVuLmxlbmd0aD4xKXtcclxuICAgICAgICAgICAgIHZhciB2YWw9JCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcIndpZHRoXCIpO1xyXG4gICAgICAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIuY2hpbGRyZW5bMV0pLmNzcyhcIndpZHRoXCIsdmFsKTtcclxuICAgICAgICAgIH1cclxuICAgICB9Ki9cclxuICAgIC8qKlxyXG4gICAgICogYmluZHMgYSBjb21wb25lbnQgdG8gYSBkYXRhYmluZGVyXHJcbiAgICAgKiBAcGFyYW0ge0RhdGFiaW5kZXJ9IGRhdGFiaW5kZXIgLSB0aGUgZGF0YWJpbmRlciB0byBiaW5kXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gYmluZFxyXG4gICAgXHJcbiAgICBiaW5kKGRhdGFiaW5kZXIscHJvcGVydHkpe1xyXG4gICAgICAgIHRoaXMuX2RhdGFiaW5kZXI9ZGF0YWJpbmRlcjtcclxuICAgICAgICBkYXRhYmluZGVyLmFkZChwcm9wZXJ0eSx0aGlzLFwib25zZWxlY3RcIik7XHJcbiAgICAgICAgZGF0YWJpbmRlci5jaGVja0F1dG9jb21taXQodGhpcyk7XHJcbiAgICB9ICovXHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICAvL1x0JCh0aGlzLmRvbVNlbGVjdCkuY2hvc2VuKCdkZXN0cm95Jyk7XHJcbiAgICAgICAgJCh0aGlzLmRvbVNlbGVjdCkuY2hvc2VuKFwiZGVzdHJveVwiKTsvLy5zZWFyY2hfY2hvaWNlcztcclxuICAgICAgICAkKCcjJyArIHRoaXMuX2lkKS5yZW1vdmUoKTsvLy5zZWFyY2hfY2hvaWNlcztcclxuICAgICAgICAkKHRoaXMuZG9tU2VsZWN0KS5yZW1vdmUoKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLmRvbVNlbGVjdCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG5cdFxyXG5cclxuICAgIHZhciBQYW5lbCA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzLnVpLlBhbmVsXCIpO1xyXG4gICAgdmFyIEJ1dHRvbiA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzLnVpLkJ1dHRvblwiKTtcclxuXHJcbiAgICB2YXIgbWU6IHtzZWw/OlNlbGVjdH0gPSB7XHJcbiAgICBcdFxyXG4gICAgfTtcclxuICAgIHZhciBwYW4gPSBuZXcgUGFuZWwoKTtcclxuICAgIHZhciBidCA9IG5ldyBCdXR0b24oKTtcclxuICAgIHZhciBidDIgPSBuZXcgQnV0dG9uKCk7XHJcbiAgICBtZS5zZWwgPSBuZXcgU2VsZWN0KHtcclxuICAgICAgICBcIm11bHRpcGxlXCI6IGZhbHNlLFxyXG4gICAgICAgIFwicGxhY2Vob2xkZXJcIjogXCJIYWxsb1wiLFxyXG4gICAgICAgIFwiYWxsb3dEZXNlbGVjdFwiOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBidC50ZXh0ID0gXCJ3ZXJcIjtcclxuICAgIGJ0Lm9uY2xpY2soZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAvL1x0YnQudGV4dD1tZS5zZWwudmFsdWUudm9ybmFtZTtcdFxyXG4gICAgICAgIG1lLnNlbC52YWx1ZSA9IG1lLnNlbC5pdGVtc1sxXTtcclxuICAgIH0pO1xyXG4gICAgYnQuaGVpZ2h0ID0gMTU7XHJcbiAgICBwYW4ud2lkdGggPSA1MDA7XHJcbiAgICBtZS5zZWwuZGlzcGxheSA9IFwibmFjaG5hbWVcIjtcclxuXHRtZS5zZWwuaXRlbXM9W3tuYW1lOlwiQWNoaW1cIixuYWNobmFtZTpcIjxiPldlbnplbDwvYj5cIn0sXHJcblx0XHRcdFx0XHR7bmFtZTpcIkFubmVcIixuYWNobmFtZTpcIk1laWVyXCJ9XTtcclxuXHR2YXIgaD1tZS5zZWwuaXRlbXM7XHJcbiAgICBtZS5zZWwud2lkdGggPSAxOTU7XHJcbiAgICBtZS5zZWwuaGVpZ2h0ID0gMjU7XHJcbiAgICBtZS5zZWwub25jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBhbGVydChldmVudC5kYXRhLm5hY2huYW1lKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vXHQkKCcjJytzZWwuX2lkKS5kYXRhKFwicGxhY2Vob2xkZXJcIixcIlNlbGVjdDIuLi5cIikuY2hvc2VuKHt3aWR0aDogXCIyMDBweFwifSk7XHJcblxyXG4gICAgcGFuLmFkZChtZS5zZWwpO1xyXG4gICAgcGFuLmFkZChidCk7XHJcbiAgICBwYW4uYWRkKGJ0Mik7XHJcbiAgICByZXR1cm4gcGFuO1xyXG5cclxufVxyXG5cclxuXHJcbiJdfQ==