var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Table", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Table_1, Jassi_1, Panel_1, Registry_1, Classes_1, BoxPanel_1, Actions_1, Windows_1) {
    "use strict";
    var DBObjectDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DBObjectDialog = void 0;
    let DBObjectDialog = DBObjectDialog_1 = class DBObjectDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.splitpanel1 = new BoxPanel_1.BoxPanel();
            me.IDDBView = new Panel_1.Panel();
            me.table1 = new Table_1.Table();
            me.table1.height = "calc(100% - 300px)";
            me.table1.width = "calc(100% - 50px)";
            me.splitpanel1.add(me.IDDBView);
            me.splitpanel1.spliter = [70, 30];
            me.splitpanel1.height = "100%";
            me.splitpanel1.horizontal = false;
            //	me.splitpanel1.width=910;
            me.splitpanel1.add(me.table1);
            this.add(me.splitpanel1);
            //    me.table1.height = "150";
        }
        /**
         * set the DBObject-classname to show in this dialog
         **/
        set dbclassname(classname) {
            this._dbclassname = classname;
            this.update();
        }
        get dbclassname() {
            return this._dbclassname;
        }
        async update() {
            //DBTable
            var cl = await Classes_1.classes.loadClass(this._dbclassname);
            var _this = this;
            //@ts-ignore
            this.data = await cl.find();
            this.me.table1.items = this.data;
            //DBView
            var data = await Registry_1.default.getJSONData("$DBObjectView");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.classname === this.dbclassname) {
                    var cl = await Classes_1.classes.loadClass(data[x].classname);
                    this.me.IDDBView.removeAll();
                    this.view = new cl();
                    this.me.IDDBView.add(this.view);
                    //@ts-ignore
                    this.view.value = this.data.length > 0 ? this.data[0] : undefined;
                    this.view.onrefreshed(() => {
                        _this.me.table1.update();
                    });
                    this.view.onsaved((obj) => {
                        var all = _this.me.table1.items;
                        if (all.indexOf(obj) === -1) {
                            all.push(obj);
                            _this.me.table1.items = _this.me.table1.items;
                            _this.me.table1.value = obj;
                            _this.me.table1.update();
                        }
                        else
                            _this.me.table1.update();
                    });
                    this.view.ondeleted((obj) => {
                        var all = _this.me.table1.items;
                        var pos = all.indexOf(obj);
                        if (pos >= 0)
                            all.splice(pos, 1);
                        _this.me.table1.items = all;
                        //select prev element
                        while (pos !== 0 && pos > all.length - 1) {
                            pos--;
                        }
                        if (pos >= 0) {
                            _this.me.table1.value = all[pos];
                            _this.view.value = all[pos];
                        }
                        _this.me.table1.update();
                    });
                    this.me.table1.selectComponent = this.view;
                }
            }
        }
        static createFunction(classname) {
            return function () {
                var ret = new DBObjectDialog_1();
                ret.dbclassname = classname;
                ret.height = "100%";
                Windows_1.default.add(ret, classname);
            };
        }
        /**
         * create Action for all DBObjectView with actionname is defined
         */
        static async createActions() {
            var ret = [];
            var data = await Registry_1.default.getJSONData("$DBObjectView");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.actionname) {
                    ret.push({
                        name: param.actionname,
                        icon: param.icon,
                        run: this.createFunction(param.classname)
                    });
                }
            }
            return ret;
        }
        static async createFor(classname) {
            var ret = new DBObjectDialog_1();
            ret.height = 400;
            ret.dbclassname = classname;
            /*	setimeout(()=>{
             //	ret.height="100%";
             //	ret.me.splitpanel1.refresh();
             },1000);*/
            return ret;
        }
    };
    __decorate([
        Actions_1.$Actions(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DBObjectDialog, "createActions", null);
    DBObjectDialog = DBObjectDialog_1 = __decorate([
        Actions_1.$ActionProvider("jassijs.base.ActionNode"),
        Jassi_1.$Class("jassijs.ui.DBObjectDialog"),
        __metadata("design:paramtypes", [])
    ], DBObjectDialog);
    exports.DBObjectDialog = DBObjectDialog;
    async function test() {
        //var ret = await DBObjectDialog.createFor("jassijs.security.User");
        var ret = await DBObjectDialog.createFor("northwind.Customer");
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=DBObjectDialog.js.map