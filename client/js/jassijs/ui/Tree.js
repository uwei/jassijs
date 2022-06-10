var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ext/fancytree"], function (require, exports, Jassi_1, Component_1, Registry_1, Property_1) {
    "use strict";
    var _a, _b, _c;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tree = void 0;
    /*declare global {
        interface JQuery {
            fancytree: any;
        }
    }*/
    let TreeEditorPropertiesMulti = class TreeEditorPropertiesMulti {
    };
    __decorate([
        (0, Property_1.$Property)({ default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" }),
        __metadata("design:type", String)
    ], TreeEditorPropertiesMulti.prototype, "mode", void 0);
    TreeEditorPropertiesMulti = __decorate([
        (0, Jassi_1.$Class)("jassijs.ui.TreeEditorPropertiesMulti")
    ], TreeEditorPropertiesMulti);
    let TreeEditorProperties = class TreeEditorProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" }),
        __metadata("design:type", Number)
    ], TreeEditorProperties.prototype, "selectMode", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: false, description: "display a checkbox before the node" }),
        __metadata("design:type", Boolean)
    ], TreeEditorProperties.prototype, "checkbox", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs.ui.TreeEditorPropertiesMulti" }),
        __metadata("design:type", TreeEditorPropertiesMulti)
    ], TreeEditorProperties.prototype, "multi", void 0);
    TreeEditorProperties = __decorate([
        (0, Jassi_1.$Class)("jassijs.ui.TreeEditorProperties")
    ], TreeEditorProperties);
    let Tree = 
    /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
    @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
    @$Property({ name: "new/multi", type: "json" })
    @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
    */
    class Tree extends Component_1.Component {
        constructor(options) {
            super();
            super.init($('<div class="Tree"></div>')[0]);
            this._itemToKey = new Map();
            this.options = options;
        }
        config(config) {
            super.config(config);
            return this;
        }
        set options(options) {
            var _this = this;
            this._lastOptions = options;
            if (this.tree) {
                var lastSel = this.value;
                var lastItems = this.items;
                //this.table.destroy();
                //this.table = undefined;
            }
            var _this = this;
            if (options === undefined) {
                options = {};
            }
            //Default Options
            if (options.extensions === undefined) {
                options.extensions = ["filter", "multi", "dnd"];
            }
            if (options.extensions.indexOf("filter") === -1)
                options.extensions.push("filter");
            if (options.extensions.indexOf("multi") === -1)
                options.extensions.push("multi");
            if (options.extensions.indexOf("dnd") === -1)
                options.extensions.push("dnd");
            if (options.filter === undefined)
                options.filter = {};
            if (options.filter.mode === undefined)
                options.filter.mode = "hide";
            if (options.filter.autoExpand === undefined)
                options.filter.autoExpand = true;
            var beforeExpand = options.beforeExpand;
            var activate = options.activate;
            var click = options.click;
            options.source = [{ title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
            options.icon = false; //we have an own
            options.lazyLoad = function (event, data) {
                TreeNode.loadChilds(event, data);
            };
            options.activate = function (event, data) {
                _this._onselect(event, data);
                if (activate !== undefined)
                    activate(event, data);
            };
            options.click = function (event, data) {
                _this._onclick(event, data);
                if (click !== undefined)
                    return click(event, data);
                return true;
            };
            $("#" + this._id).fancytree(options);
            //@ts-ignore
            this.tree = $.ui.fancytree.getTree("#" + this._id);
            $("#" + this._id).find("ul").css("height", "calc(100% - 8px)");
            $("#" + this._id).find("ul").css("weight", "calc(100% - 8px)");
            $("#" + this._id).find("ul").css("overflow", "auto");
            if (lastItems) {
                this.items = lastItems;
            }
            if (lastSel) {
                this.value = lastSel;
            }
        }
        get options() {
            return this._lastOptions;
        }
        /**
        * @member - get the property for the display of the item or an function to get the display from an item
        */
        set propStyle(value) {
            this._propStyle = value;
        }
        get propStyle() {
            return this._propStyle;
        }
        set propDisplay(value) {
            this._propDisplay = value;
        }
        get propDisplay() {
            return this._propDisplay;
        }
        set propIcon(icon) {
            this._propIcon = icon;
        }
        get propIcon() {
            return this._propIcon;
        }
        set propChilds(child) {
            this._propChilds = child;
        }
        get propChilds() {
            return this._propChilds;
        }
        onselect(handler) {
            this.addEvent("select", handler);
        }
        onclick(handler) {
            this.addEvent("click", handler);
        }
        filter(text) {
            // this.expandAll();
            this._readAllNodesIfNeeded().then(() => {
                if (text === "") {
                    this.tree.clearFilter();
                    // this.expandAll();
                }
                else {
                    //@ts-ignore
                    this.tree.filterNodes(text, { leavesOnly: true });
                }
            });
        }
        /**
        * get title from node
        */
        getTitleFromItem(item) {
            var ret = "";
            if (typeof (this.propDisplay) === "function") {
                ret = this.propDisplay(item);
            }
            else
                ret = item[this.propDisplay];
            return ret;
        }
        /**
       * get title from node
       */
        getStyleFromItem(item) {
            var ret;
            if (typeof (this.propStyle) === "function") {
                ret = this.propStyle(item);
            }
            else
                ret = item[this.propStyle];
            return ret;
        }
        /**
        * get icon from node
        */
        getIconFromItem(item) {
            if (this.propIcon !== undefined) {
                if (typeof (this.propIcon) === "function") {
                    return this.propIcon(item);
                }
                else
                    return item[this.propIcon];
            }
            return undefined;
        }
        /**
        * get childs from node
        */
        getChildsFromItem(item) {
            var cs = undefined;
            if (typeof (this.propChilds) === "function") {
                cs = this.propChilds(item);
            }
            else
                cs = item[this.propChilds];
            return cs;
        }
        /*private getTreeNodeFromId(id:string):TreeNode{
            //@ts-ignore
            for(var entr of this.objectToNode){
                if(entr[1]._id===id)
                    return entr[1];
                //entries.return;
            }
            return undefined;
        }*/
        _onselect(event, data) {
            var item = this._itemToKey.get(data.node.data);
            event.data = item;
            this.callEvent("select", event, data);
        }
        _onclick(event, data) {
            if (event.originalEvent.target["className"].startsWith("MenuButton")) {
                this._callContextmenu(event.originalEvent);
                return;
            }
            if (event.ctrlKey === true)
                return; //only selection
            event.data = data.node.data.item;
            if (this._select !== undefined)
                this._select.value = data.node.data.item;
            this.callEvent("click", event, data);
        }
        set selection(values) {
            this.tree.getSelectedNodes().forEach((item) => {
                item.setSelected(false);
            });
            if (values === undefined)
                return;
            this["_selectionIsWaiting"] = values;
            var _this = this;
            for (var v = 0; v < values.length; v++) {
                var item = values[v];
                this._readNodeFromItem(item).then((node) => {
                    node.setSelected(true);
                    delete this["_selectionIsWaiting"];
                });
            }
        }
        get selection() {
            var ret = [];
            if (this["_selectionIsWaiting"] !== undefined)
                return this["_selectionIsWaiting"];
            this.tree.getSelectedNodes().forEach((item) => {
                ret.push(item.data.item);
            });
            return ret;
        }
        async activateKey(key, parent = undefined) {
            var node = await this._readNodeFromKey(key);
            if (node === null)
                return false;
            await node.setActive(true);
            return true;
        }
        async expandLater(promise, expand, node, allreadySeen) {
            return this.expandAll(expand, node, allreadySeen);
        }
        /**
         * expand all nodes
         */
        async expandAll(expand = true, parent = undefined, allreadySeen = undefined) {
            var isRoot = parent === undefined;
            var all = [];
            if (parent === undefined)
                parent = this.tree.rootNode;
            if (expand === undefined)
                expand = true;
            if (allreadySeen === undefined) {
                allreadySeen = [];
            }
            if (parent.hasChildren()) {
                for (var x = 0; x < parent.children.length; x++) {
                    var node = parent.children[x];
                    if (allreadySeen.indexOf(node.data.item) === -1)
                        allreadySeen.push(node.data.item);
                    else
                        continue;
                    if (node.hasChildren() || node.isLazy) {
                        var prom = node.setExpanded(expand);
                        all.push(this.expandLater(prom, expand, node, allreadySeen));
                    }
                }
                await Promise.all(all);
            }
        }
        async expandKeys(keys) {
            var all = [];
            for (var x = 0; x < keys.length; x++) {
                var n = await this._readNodeFromKey(keys[x]);
                if (n) {
                    await n.setExpanded(true);
                    all.push(n);
                }
            }
            await Promise.all(all);
        }
        getExpandedKeys(parent = undefined, expandedNodes = undefined) {
            var isRoot = parent === undefined;
            if (parent === undefined)
                parent = this.tree.getRootNode();
            if (expandedNodes === undefined) {
                expandedNodes = [];
            }
            if (parent.hasChildren()) {
                parent.children.forEach((node) => {
                    if (node.isExpanded()) {
                        expandedNodes.push(node.key);
                        this.getExpandedKeys(node, expandedNodes);
                    }
                });
            }
            return expandedNodes;
        }
        async expandNode(node) {
            node.setActive(true);
            var list = node.getParentList(false, false);
            for (var x = 0; x < list.length; x++) {
                if (!list[x].isExpanded())
                    await list[x].setExpanded(true);
            }
        }
        async _readNodeFromItem(item) {
            var key = this._itemToKey.get(item);
            if (key === undefined)
                this._readAllKeysIfNeeded();
            key = this._itemToKey.get(item);
            return this._readNodeFromKey(key);
        }
        async _readNodeFromKey(key) {
            var nd = this.tree.getNodeByKey(key);
            if (nd === null) {
                var path = "";
                var geskey = "";
                key === null || key === void 0 ? void 0 : key.split("|").forEach((k) => {
                    geskey = geskey + (geskey === "" ? "" : "|") + k;
                    path = path + "/" + geskey;
                });
                var _this = this;
                await this.tree.loadKeyPath(path, undefined);
            }
            nd = this.tree.getNodeByKey(key);
            return nd;
        }
        set value(value) {
            this["_valueIsWaiting"] = value;
            this._readNodeFromItem(value).then((node) => {
                node.setActive(true);
                delete this["_valueIsWaiting"];
            });
        }
        /**
         * get the active item
         **/
        get value() {
            if (this["_valueIsWaiting"] !== undefined) //async setting 
                return this["_valueIsWaiting"];
            var h = this.tree.getActiveNode();
            if (h === null)
                return undefined;
            return h.data.item;
        }
        async _readAllNodesIfNeeded() {
            if (this._allNodesReaded === true)
                return;
            if (this._allNodesReaded === false) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (this._allNodesReaded === true)
                            resolve(undefined);
                        else
                            resolve(this._readAllNodesIfNeeded());
                    }, 50);
                });
            }
            this._allNodesReaded = false;
            this._readAllKeysIfNeeded();
            var allPathes = [];
            var allPathes = [];
            this._itemToKey.forEach((key) => {
                //var key=entry[1];
                var path = "";
                var geskey = "";
                key.split("|").forEach((k) => {
                    geskey = geskey + (geskey === "" ? "" : "|") + k;
                    path = path + "/" + geskey;
                });
                allPathes.push(path);
            });
            var allPromise = [];
            for (var i = 0; i < allPathes.length; i++) {
                //@ts-ignore
                allPromise.push(this.tree.loadKeyPath(allPathes[i], undefined));
            }
            await Promise.all(allPromise);
            this._allNodesReaded = true;
            //    	await Promise.all(allPromise);
            //	await this.tree.loadKeyPath(allPathes,undefined);
        }
        getKeyFromItem(item) {
            var ret = this._itemToKey.get(item);
            if (ret === undefined)
                this._readAllKeysIfNeeded();
            return this._itemToKey.get(item);
        }
        /**
         * read all keys if not allready readed
         **/
        _readAllKeysIfNeeded(item = undefined, path = undefined, allreadySeen = undefined) {
            if (item === undefined && this._allKeysReaded === true)
                return;
            if (item === undefined) {
                this.tree.getRootNode().children.forEach((child) => {
                    this._readAllKeysIfNeeded(child.data.item, "", []);
                });
                return;
            }
            if (allreadySeen.indexOf(item) === -1)
                allreadySeen.push(item);
            else
                return;
            var title = this.getTitleFromItem(item).replaceAll("|", "!");
            var key = path + (path === "" ? "" : "|") + title;
            this._itemToKey.set(item, key);
            var cs = this.getChildsFromItem(item);
            if (cs !== undefined) {
                cs.forEach((c => {
                    this._readAllKeysIfNeeded(c, key, allreadySeen);
                }));
            }
            this._allKeysReaded = true;
        }
        set items(value) {
            this._items = value;
            this._allKeysReaded = undefined;
            this._allNodesReaded = undefined;
            this._itemToKey = new Map();
            if (!Array.isArray(value))
                value = [value];
            var avalue = [];
            for (var x = 0; x < value.length; x++) {
                avalue.push(new TreeNode(this, value[x]));
            }
            this.tree.reload(avalue);
            /*        var root: Fancytree.FancytreeNode = $("#" + this._id).fancytree("getTree").rootNode;
                    root.removeChildren();
                    this.objectToNode = new Map();
                    //this._allNodes={};
                    root.addChildren(avalue);
                    for (var j = 0;j < root.children.length;j++) {
                        avalue[j].fancyNode = root.children[j];
                        this.objectToNode.set(value[j], avalue[j]);
                    }*/
        }
        get items() {
            return this._items;
        }
        set selectComponent(_component) {
            this._select = _component;
        }
        get selectComponent() {
            return this._select; //$(this.dom).text();
        }
        _callContextmenu(event) {
            var x = 9;
            //var tree=$(event.target).attr("treeid");
            //tree=$("#"+tree)[0]._this;
            var newevent = {
                originalEvent: event,
                target: $(event.target).prev()[0]
            };
            event.preventDefault();
            if (this.contextMenu !== undefined) {
                this.contextMenu._callContextmenu(newevent);
            }
            //evt.originalEvent.clientY}
            //	tree.contextMenu.show(event);
        }
        /**
         * create the contextmenu
         * @param {object} evt  the click event in the contextmenu
         **/
        _prepareContextmenu(evt) {
            //var node: TreeNode = undefined;
            var node = $.ui.fancytree.getNode(evt.target);
            //node = this._allNodes[evt.target.id];
            if (this._contextMenu !== undefined) {
                if (node.data.item === undefined)
                    return;
                var test = node.data.tree.selection;
                //multiselect and the clicked is within the selection
                if (test !== undefined && test.indexOf(node.data.item) !== -1) {
                    this._contextMenu.value = test;
                }
                else
                    this._contextMenu.value = [node === undefined ? undefined : node.data.item];
            }
        }
        set contextMenu(value) {
            super.contextMenu = value;
            var _this = this;
            value.onbeforeshow(function (evt) {
                _this._prepareContextmenu(evt);
            });
        }
        get contextMenu() {
            return super.contextMenu;
        }
        destroy() {
            this._items = undefined;
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs.ui.TableEditorProperties" }),
        __metadata("design:type", typeof (_a = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _b : Object])
    ], Tree.prototype, "options", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string", description: "the property called to get the style of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propStyle", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string", description: "the property called to get the name of the item" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Tree.prototype, "propDisplay", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event?: JQueryEventObject/*, data?:Fancytree.EventData*/){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Function]),
        __metadata("design:returntype", void 0)
    ], Tree.prototype, "onclick", null);
    Tree = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Tree", icon: "mdi mdi-file-tree" }),
        (0, Jassi_1.$Class)("jassijs.ui.Tree"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.TreeEditorProperties" })
        /*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
        @$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
        @$Property({ name: "new/multi", type: "json" })
        @$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
        */
        ,
        __metadata("design:paramtypes", [typeof (_c = typeof Fancytree !== "undefined" && Fancytree.FancytreeOptions) === "function" ? _c : Object])
    ], Tree);
    exports.Tree = Tree;
    class TreeNode {
        //options.source=[ { title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
        constructor(tree, item, parent = undefined) {
            this.tree = tree;
            this.parent = parent;
            this._id = Registry_1.default.nextID();
            this.item = item;
            var title = this.tree.getTitleFromItem(this.item);
            this.key = (parent !== undefined ? parent.key + "|" : "") + (title === undefined ? "" : title).replaceAll("|", "!");
            this.tree._itemToKey.set(item, this.key);
            this.icon = this.tree.getIconFromItem(this.item);
            var cs = this.tree.getChildsFromItem(this.item);
            if (cs !== undefined && cs.length > 0) {
                this.lazy = true;
            }
        }
        getStyle() {
            var ret = "";
            var style = this.tree.getStyleFromItem(this.item);
            if (style) {
                for (let key in style) {
                    if (key === "_classname")
                        continue;
                    var newKey = key.replaceAll("_", "-");
                    ret = ret + "\t\t" + newKey + ":" + style[key] + ";\n";
                }
            }
            return ret;
        }
        get title() {
            var ret = this.tree.getTitleFromItem(this.item);
            var bt = "";
            if (this.tree.contextMenu !== undefined)
                bt = "<span class='MenuButton menu mdi mdi-menu-down' id=900  treeid=" + this.tree._id + "  height='10' width='10' onclick='/*jassijs.ui.Tree._callContextmenu(event);*/'>";
            //prevent XSS
            ret = (ret === undefined ? "" : ret).replaceAll("<", "&lt").replaceAll(">", "&gt");
            ret = "<span id=" + this._id + " style='" + this.getStyle() + "'  >" + ret + "</span>";
            return ret + bt;
        }
        static loadChilds(event, data) {
            var node = data.node;
            var deferredResult = jQuery.Deferred();
            var tree = data.node.data.tree;
            var _this = data.node;
            var cs = tree.getChildsFromItem(data.node.data.item);
            var childs = [];
            if (cs !== undefined && cs.length > 0) {
                for (var x = 0; x < cs.length; x++) {
                    var nd = new TreeNode(tree, cs[x], _this);
                    childs.push(nd);
                }
            }
            data.result = childs;
            return;
            /*        fancynode.removeChildren();
                    fancynode.addChildren(childs);
                    for (var j = 0;j < fancynode.children.length;j++) {
                        childs[j].fancyNode = fancynode.children[j];
                        this.tree.objectToNode.set(cs[j], childs[j]);
                    }*/
            // delete this._dummy;
        }
    }
    ;
    async function test() {
        var tree = new Tree();
        var s = { name: "Sansa", id: 1, style: { color: "blue" } };
        var p = { name: "Peter", id: 2 };
        var u = { name: "Uwe", id: 3, childs: [p, s] };
        var t = { name: "Tom", id: 5 };
        var c = { name: "Christoph", id: 4, childs: [u, t] };
        s.childs = [c];
        tree.config({
            options: {
                checkbox: true
            },
            propDisplay: "name",
            propChilds: "childs",
            propStyle: "style",
            items: [c],
            width: "100%",
            height: "100px",
            onclick: function (data) {
                console.log("select " + data.data.name);
            },
            selection: [p, s],
            value: p
        });
        /*tree.propIcon = function(data) {
            if (data.name === "Uwe")
                return "res/car.ico";
        };*/
        //  tree._readAllKeysIfNeeded();
        //	await tree.tree.loadKeyPath(["/Christoph/Christoph|Uwe/Christoph|Uwe|Peter"],undefined);
        //		var h=tree.tree.getNodeByKey("Christoph|Uwe|Peter");
        //		tree.tree.activateKey("Christoph|Uwe|Peter");
        //["Christoph","Christoph/Uwe/Tom1"],()=>{});
        //	node.setActive(true);
        // var j = tree.value;
        window.setTimeout(async () => {
            var k = tree.selection;
            //		var nod=tree.tree.getNodeByKey("Christoph/Uwe/Tom1");
            // await tree.expandAll(true);
            // await tree.expandAll(false);
            //	var node=tree.tree.getNodeByKey("Christoph/Uwe/Peter");
            //	node.setActive(true);
            //await tree.expandAll();
            // tree.value = p;
            //tree.expandAll(false);
            // tree.value = p;
            //var k=tree.getExpandedKeys();
            // tree.expandKeys(k);
            /* tree.expandAll();
             tree.value = p;
             var l=tree.value;*/
            //  var j = tree.value;
            // alert(tree.value.name);
        }, 4000);
        //    	$(tree.__dom).dialog();
        return tree;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvVHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQVdBOzs7O09BSUc7SUFHSCxJQUFNLHlCQUF5QixHQUEvQixNQUFNLHlCQUF5QjtLQUc5QixDQUFBO0lBREc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFFLENBQUM7OzJEQUMvRjtJQUZaLHlCQUF5QjtRQUQ5QixJQUFBLGNBQU0sRUFBQyxzQ0FBc0MsQ0FBQztPQUN6Qyx5QkFBeUIsQ0FHOUI7SUFFRCxJQUFNLG9CQUFvQixHQUExQixNQUFNLG9CQUFvQjtLQU96QixDQUFBO0lBTEc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLCtCQUErQixFQUFFLENBQUM7OzREQUMzRTtJQUVwQjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLG9DQUFvQyxFQUFFLENBQUM7OzBEQUM5RDtJQUVuQjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLHNDQUFzQyxFQUFFLENBQUM7a0NBQzNFLHlCQUF5Qjt1REFBQztJQU5oQyxvQkFBb0I7UUFEekIsSUFBQSxjQUFNLEVBQUMsaUNBQWlDLENBQUM7T0FDcEMsb0JBQW9CLENBT3pCO0lBeURELElBQWEsSUFBSTtJQUxqQjs7OztNQUlFO0lBQ0YsTUFBYSxJQUFLLFNBQVEscUJBQVM7UUFhL0IsWUFBWSxPQUFvQztZQUM1QyxL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O2dDQUVvQjtZQUVwQix1QkFBdUI7WUFDdkIsMEJBQTBCO1FBQzlCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNULDhCQUE4QjtRQUM5QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBcEVELG9CQW9FQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcImphc3NpanMvZXh0L2ZhbmN5dHJlZVwiO1xuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XG5pbXBvcnQgeyBDb21wb25lbnQsICRVSUNvbXBvbmVudCwgQ29tcG9uZW50Q29uZmlnIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBDb21wb25lbnREZXNjcmlwdG9yIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvclwiO1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuXG5cbmltcG9ydCBleHRlbnNpb25zIGZyb20gXCJqYXNzaWpzL2Jhc2UvRXh0ZW5zaW9uc1wiO1xuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IFN0eWxlIH0gZnJvbSBcImphc3NpanMvdWkvU3R5bGVcIjtcbmltcG9ydCB7IENTU1Byb3BlcnRpZXMgfSBmcm9tIFwiamFzc2lqcy91aS9DU1NQcm9wZXJ0aWVzXCI7XG4vKmRlY2xhcmUgZ2xvYmFsIHtcbiAgICBpbnRlcmZhY2UgSlF1ZXJ5IHtcbiAgICAgICAgZmFuY3l0cmVlOiBhbnk7XG4gICAgfVxufSovXG5cbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlRyZWVFZGl0b3JQcm9wZXJ0aWVzTXVsdGlcIilcbmNsYXNzIFRyZWVFZGl0b3JQcm9wZXJ0aWVzTXVsdGkge1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcIlwiLCBjaG9vc2VGcm9tOiBbXCJcIiwgXCJzYW1lUGFyZW50XCIsIFwic2FtZUxldmVsXCJdLCBkZXNjcmlwdGlvbjogXCJtdWx0aSBzZWxlY3Rpb24gbW9kZVwiIH0pXG4gICAgbW9kZT86IHN0cmluZztcbn1cbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlRyZWVFZGl0b3JQcm9wZXJ0aWVzXCIpXG5jbGFzcyBUcmVlRWRpdG9yUHJvcGVydGllcyB7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IDMsIGNob29zZUZyb206IFsxLCAyLCAzXSwgZGVzY3JpcHRpb246IFwiMT1zaW5nbGUgMj1tdWx0aSAzPW11bHRpX2hpZXJcIiB9KVxuICAgIHNlbGVjdE1vZGU/OiBudW1iZXI7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IGZhbHNlLCBkZXNjcmlwdGlvbjogXCJkaXNwbGF5IGEgY2hlY2tib3ggYmVmb3JlIHRoZSBub2RlXCIgfSlcbiAgICBjaGVja2JveD86IGJvb2xlYW47XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwianNvblwiLCBjb21wb25lbnRUeXBlOiBcImphc3NpanMudWkuVHJlZUVkaXRvclByb3BlcnRpZXNNdWx0aVwiIH0pXG4gICAgbXVsdGk/OiBUcmVlRWRpdG9yUHJvcGVydGllc011bHRpO1xufVxuZXhwb3J0IGludGVyZmFjZSBUcmVlQ29uZmlnIGV4dGVuZHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBvcHRpb25zPzogRmFuY3l0cmVlLkZhbmN5dHJlZU9wdGlvbnM7XG4gICAgLyoqXG4gICAgKiBAbWVtYmVyIC0gZ2V0IHRoZSBwcm9wZXJ0eSBmb3IgdGhlIGRpc3BsYXkgb2YgdGhlIGl0ZW0gb3IgYW4gZnVuY3Rpb24gdG8gZ2V0IHRoZSBkaXNwbGF5IGZyb20gYW4gaXRlbVxuICAgICovXG4gICAgcHJvcFN0eWxlPzogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogQ1NTUHJvcGVydGllcyB9O1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgLSBnZXQgdGhlIHByb3BlcnR5IGZvciB0aGUgZGlzcGxheSBvZiB0aGUgaXRlbSBvciBhbiBmdW5jdGlvbiB0byBnZXQgdGhlIGRpc3BsYXkgZnJvbSBhbiBpdGVtXG4gICAgICovXG4gICAgcHJvcERpc3BsYXk/OiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBzdHJpbmcgfTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIC0gZ2V0IHRoZSBpY29ucHJvcGVydHkgb2YgdGhlIGl0ZW0gb3IgYW4gZnVuY3Rpb24gdG8gZ2V0IHRoZSBpY29uIGZyb20gYW4gaXRlbVxuICAgICAqL1xuICAgIHByb3BJY29uPzogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogc3RyaW5nIH1cbiAgICAvKipcbiAgICAqIEBtZW1iZXIgLSBnZXQgdGhlIGNoaWxkcyBvZiB0aGUgaXRlbSBvciBhbiBmdW5jdGlvbiB0byBnZXQgdGhlIGNoaWxkcyBmcm9tIGFuIGl0ZW1cbiAgICAqL1xuICAgIHByb3BDaGlsZHM/OiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBhbnlbXSB9O1xuXG4gICAgb25zZWxlY3Q/KGhhbmRsZXIpO1xuXG4gICAgLyoqXG4gICAgICogcmVnaXN0ZXIgYW4gZXZlbnQgaWYgYW4gaXRlbSBpcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBvbiBjbGlja1xuICAgICAqL1xuICAgIG9uY2xpY2s/KGhhbmRsZXI6IChldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhPzogRmFuY3l0cmVlLkV2ZW50RGF0YSkgPT4gdm9pZCk7XG4gICAgLyoqXG4gICAgKiBzZWxlY3RzIGl0ZW1zXG4gICAgKi9cbiAgICBzZWxlY3Rpb24/OiBhbnlbXTtcbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIGFjdGl2ZSBpdGVtXG4gICAgICovXG4gICAgdmFsdWU/O1xuICAgIC8qKlxuICAgICogQHBhcmFtIHZhbHVlIC0gc2V0IHRoZSBkYXRhIHRvIHNob3cgaW4gVHJlZVxuICAgICoqL1xuICAgIGl0ZW1zPzogYW55O1xuICAgIC8qKlxuICAgICAqIGlmIHRoZSB2YWx1ZSBpcyBjaGFuZ2VkIHRoZW4gdGhlIHZhbHVlIG9mIF9jb21wb25lbnQgaXMgYWxzbyBjaGFuZ2VkIChfY29tcG9uZW50LnZhbHVlKVxuICAgICAqL1xuICAgIHNlbGVjdENvbXBvbmVudD86IHsgdmFsdWU6IG51bWJlciB9O1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29udGV4dE1lbnV9IC0gdGhlIGNvbnRleHRtZW51IG9mIHRoZSBjb21wb25lbnRcbiAgICAgKiovXG4gICAgY29udGV4dE1lbnU/O1xufVxuXG5AJFVJQ29tcG9uZW50KHsgZnVsbFBhdGg6IFwiY29tbW9uL1RyZWVcIiwgaWNvbjogXCJtZGkgbWRpLWZpbGUtdHJlZVwiIH0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5UcmVlXCIpXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXdcIiwgdHlwZTogXCJqc29uXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2lqcy51aS5UcmVlRWRpdG9yUHJvcGVydGllc1wiIH0pXG4vKkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9zZWxlY3RNb2RlXCIsIHR5cGU6IFwibnVtYmVyXCIsIGRlZmF1bHQ6IDMsIGNob29zZUZyb206IFsxLCAyLCAzXSwgZGVzY3JpcHRpb246IFwiMT1zaW5nbGUgMj1tdWx0aSAzPW11bHRpX2hpZXJcIiB9KVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3L2NoZWNrYm94XCIsIHR5cGU6IFwiYm9vbGVhblwiLCBkZWZhdWx0OiBmYWxzZSwgZGVzY3JpcHRpb246IFwiZGVzcGxheSBhIGNoZWNrYm9zIGJlZm9yZSB0aGUgbm9kZVwiIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvbXVsdGlcIiwgdHlwZTogXCJqc29uXCIgfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9tdWx0aS9tb2RlXCIsIHR5cGU6IFwic3RyaW5nXCIsIGRlZmF1bHQ6IFwiXCIsIGNob29zZUZyb206IFtcIlwiLCBcInNhbWVQYXJlbnRcIiwgXCJzYW1lTGV2ZWxcIl0sIGRlc2NyaXB0aW9uOiBcIm11bHRpIHNlbGVjdGlvbiBtb2RlXCIgfSlcbiovXG5leHBvcnQgY2xhc3MgVHJlZSBleHRlbmRzIENvbXBvbmVudCBpbXBsZW1lbnRzIFRyZWVDb25maWcge1xuICAgIF9wcm9wRGlzcGxheTogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogc3RyaW5nIH07XG4gICAgX3Byb3BJY29uOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBzdHJpbmcgfTtcbiAgICBfcHJvcENoaWxkczogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogYW55W10gfTtcbiAgICBfcHJvcFN0eWxlOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBDU1NQcm9wZXJ0aWVzIH07XG4gICAgX3NlbGVjdDogeyB2YWx1ZTogbnVtYmVyIH07XG4gICAgdHJlZTogRmFuY3l0cmVlLkZhbmN5dHJlZTtcbiAgICBfaXNJbml0ZWQ6IGJvb2xlYW47XG4gICAgX2l0ZW1Ub0tleTogTWFwPGFueSwgc3RyaW5nPjtcbiAgICBwcml2YXRlIF9pdGVtcztcbiAgICBwcml2YXRlIF9hbGxLZXlzUmVhZGVkOiBib29sZWFuO1xuICAgIHByaXZhdGUgX2FsbE5vZGVzUmVhZGVkOiBib29sZWFuO1xuICAgIF9sYXN0T3B0aW9uczogRmFuY3l0cmVlLkZhbmN5dHJlZU9wdGlvbnM7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IEZhbmN5dHJlZS5GYW5jeXRyZWVPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHN1cGVyLmluaXQoJCgnPGRpdiBjbGFzcz1cIlRyZWVcIj48L2Rpdj4nKVswXSk7XG4gICAgICAgIHRoaXMuX2l0ZW1Ub0tleSA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgY29uZmlnKGNvbmZpZzogVHJlZUNvbmZpZyk6IFRyZWUge1xuICAgICAgICBzdXBlci5jb25maWcoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwianNvblwiLCBjb21wb25lbnRUeXBlOiBcImphc3NpanMudWkuVGFibGVFZGl0b3JQcm9wZXJ0aWVzXCIgfSlcbiAgICBzZXQgb3B0aW9ucyhvcHRpb25zOiBGYW5jeXRyZWUuRmFuY3l0cmVlT3B0aW9ucykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLl9sYXN0T3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIGlmICh0aGlzLnRyZWUpIHtcbiAgICAgICAgICAgIHZhciBsYXN0U2VsID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHZhciBsYXN0SXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgICAgICAgICAgLy90aGlzLnRhYmxlLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIC8vdGhpcy50YWJsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zID0ge307XG4gICAgICAgIH1cbiAgICAgICAgLy9EZWZhdWx0IE9wdGlvbnNcblxuXG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3B0aW9ucy5leHRlbnNpb25zID0gW1wiZmlsdGVyXCIsIFwibXVsdGlcIiwgXCJkbmRcIl07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZXh0ZW5zaW9ucy5pbmRleE9mKFwiZmlsdGVyXCIpID09PSAtMSlcbiAgICAgICAgICAgIG9wdGlvbnMuZXh0ZW5zaW9ucy5wdXNoKFwiZmlsdGVyXCIpO1xuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zLmluZGV4T2YoXCJtdWx0aVwiKSA9PT0gLTEpXG4gICAgICAgICAgICBvcHRpb25zLmV4dGVuc2lvbnMucHVzaChcIm11bHRpXCIpO1xuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zLmluZGV4T2YoXCJkbmRcIikgPT09IC0xKVxuICAgICAgICAgICAgb3B0aW9ucy5leHRlbnNpb25zLnB1c2goXCJkbmRcIik7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgb3B0aW9ucy5maWx0ZXIgPSB7fTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyLm1vZGUgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIG9wdGlvbnMuZmlsdGVyLm1vZGUgPSBcImhpZGVcIjtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyLmF1dG9FeHBhbmQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIG9wdGlvbnMuZmlsdGVyLmF1dG9FeHBhbmQgPSB0cnVlO1xuXG4gICAgICAgIHZhciBiZWZvcmVFeHBhbmQgPSBvcHRpb25zLmJlZm9yZUV4cGFuZDtcbiAgICAgICAgdmFyIGFjdGl2YXRlID0gb3B0aW9ucy5hY3RpdmF0ZTtcbiAgICAgICAgdmFyIGNsaWNrID0gb3B0aW9ucy5jbGljaztcbiAgICAgICAgb3B0aW9ucy5zb3VyY2UgPSBbeyB0aXRsZTogJ0ZvbGRlciBpbiBob21lIGZvbGRlcicsIGtleTogJ2ZBMTAwJywgZm9sZGVyOiB0cnVlLCBsYXp5OiB0cnVlIH1dO1xuICAgICAgICBvcHRpb25zLmljb24gPSBmYWxzZTsvL3dlIGhhdmUgYW4gb3duXG4gICAgICAgIG9wdGlvbnMubGF6eUxvYWQgPSBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgIFRyZWVOb2RlLmxvYWRDaGlsZHMoZXZlbnQsIGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLmFjdGl2YXRlID0gZnVuY3Rpb24gKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogRmFuY3l0cmVlLkV2ZW50RGF0YSkge1xuICAgICAgICAgICAgX3RoaXMuX29uc2VsZWN0KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIGlmIChhY3RpdmF0ZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGFjdGl2YXRlKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5jbGljayA9IGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEZhbmN5dHJlZS5FdmVudERhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLl9vbmNsaWNrKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIGlmIChjbGljayAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBjbGljayhldmVudCwgZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAkKFwiI1wiICsgdGhpcy5faWQpLmZhbmN5dHJlZShvcHRpb25zKTtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHRoaXMudHJlZSA9ICQudWkuZmFuY3l0cmVlLmdldFRyZWUoXCIjXCIgKyB0aGlzLl9pZCk7XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9pZCkuZmluZChcInVsXCIpLmNzcyhcImhlaWdodFwiLCBcImNhbGMoMTAwJSAtIDhweClcIik7XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9pZCkuZmluZChcInVsXCIpLmNzcyhcIndlaWdodFwiLCBcImNhbGMoMTAwJSAtIDhweClcIik7XG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9pZCkuZmluZChcInVsXCIpLmNzcyhcIm92ZXJmbG93XCIsIFwiYXV0b1wiKTtcbiAgICAgICAgaWYgKGxhc3RJdGVtcykge1xuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IGxhc3RJdGVtcztcbiAgICAgICAgfVxuICAgICAgICBpZiAobGFzdFNlbCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IGxhc3RTZWw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0IG9wdGlvbnMoKTogRmFuY3l0cmVlLkZhbmN5dHJlZU9wdGlvbnMge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFzdE9wdGlvbnM7XG4gICAgfVxuICAgIC8qKlxuICAgICogQG1lbWJlciAtIGdldCB0aGUgcHJvcGVydHkgZm9yIHRoZSBkaXNwbGF5IG9mIHRoZSBpdGVtIG9yIGFuIGZ1bmN0aW9uIHRvIGdldCB0aGUgZGlzcGxheSBmcm9tIGFuIGl0ZW1cbiAgICAqL1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiLCBkZXNjcmlwdGlvbjogXCJ0aGUgcHJvcGVydHkgY2FsbGVkIHRvIGdldCB0aGUgc3R5bGUgb2YgdGhlIGl0ZW1cIiB9KVxuICAgIHNldCBwcm9wU3R5bGUodmFsdWU6IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IENTU1Byb3BlcnRpZXMgfSkge1xuICAgICAgICB0aGlzLl9wcm9wU3R5bGUgPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IHByb3BTdHlsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BTdHlsZTtcbiAgICB9XG5cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiwgZGVzY3JpcHRpb246IFwidGhlIHByb3BlcnR5IGNhbGxlZCB0byBnZXQgdGhlIG5hbWUgb2YgdGhlIGl0ZW1cIiB9KVxuICAgIHNldCBwcm9wRGlzcGxheSh2YWx1ZTogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogc3RyaW5nIH0pIHtcbiAgICAgICAgdGhpcy5fcHJvcERpc3BsYXkgPSB2YWx1ZTtcbiAgICB9XG4gICAgZ2V0IHByb3BEaXNwbGF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcERpc3BsYXk7XG4gICAgfVxuXG4gICAgc2V0IHByb3BJY29uKGljb246IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IHN0cmluZyB9KSB7XG4gICAgICAgIHRoaXMuX3Byb3BJY29uID0gaWNvbjtcbiAgICB9XG4gICAgZ2V0IHByb3BJY29uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcEljb247XG4gICAgfVxuXG4gICAgc2V0IHByb3BDaGlsZHMoY2hpbGQ6IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IGFueVtdIH0pIHtcbiAgICAgICAgdGhpcy5fcHJvcENoaWxkcyA9IGNoaWxkO1xuICAgIH1cbiAgICBnZXQgcHJvcENoaWxkcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BDaGlsZHM7XG4gICAgfVxuXG4gICAgb25zZWxlY3QoaGFuZGxlcikge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwic2VsZWN0XCIsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LyosIGRhdGE/OkZhbmN5dHJlZS5FdmVudERhdGEqLyl7XFxuXFx0XFxufVwiIH0pXG4gICAgb25jbGljayhoYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YT86IEZhbmN5dHJlZS5FdmVudERhdGEpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudChcImNsaWNrXCIsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIGZpbHRlcih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgLy8gdGhpcy5leHBhbmRBbGwoKTtcbiAgICAgICAgdGhpcy5fcmVhZEFsbE5vZGVzSWZOZWVkZWQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVlLmNsZWFyRmlsdGVyKCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leHBhbmRBbGwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgdGhpcy50cmVlLmZpbHRlck5vZGVzKHRleHQsIHsgbGVhdmVzT25seTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogZ2V0IHRpdGxlIGZyb20gbm9kZVxuICAgICovXG4gICAgZ2V0VGl0bGVGcm9tSXRlbShpdGVtKSB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BEaXNwbGF5KSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb3BEaXNwbGF5KGl0ZW0pO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldCA9IGl0ZW1bdGhpcy5wcm9wRGlzcGxheV07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgKiBnZXQgdGl0bGUgZnJvbSBub2RlXG4gICAqL1xuICAgIGdldFN0eWxlRnJvbUl0ZW0oaXRlbSk6IENTU1Byb3BlcnRpZXMge1xuICAgICAgICB2YXIgcmV0O1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BTdHlsZSkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0ID0gdGhpcy5wcm9wU3R5bGUoaXRlbSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0ID0gaXRlbVt0aGlzLnByb3BTdHlsZV07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICogZ2V0IGljb24gZnJvbSBub2RlXG4gICAgKi9cbiAgICBnZXRJY29uRnJvbUl0ZW0oaXRlbSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wSWNvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BJY29uKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcEljb24oaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt0aGlzLnByb3BJY29uXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAqIGdldCBjaGlsZHMgZnJvbSBub2RlXG4gICAgKi9cbiAgICBnZXRDaGlsZHNGcm9tSXRlbShpdGVtKSB7XG4gICAgICAgIHZhciBjcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5wcm9wQ2hpbGRzKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjcyA9IHRoaXMucHJvcENoaWxkcyhpdGVtKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICBjcyA9IGl0ZW1bdGhpcy5wcm9wQ2hpbGRzXTtcbiAgICAgICAgcmV0dXJuIGNzO1xuICAgIH1cblxuXG4gICAgLypwcml2YXRlIGdldFRyZWVOb2RlRnJvbUlkKGlkOnN0cmluZyk6VHJlZU5vZGV7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBmb3IodmFyIGVudHIgb2YgdGhpcy5vYmplY3RUb05vZGUpe1xuICAgICAgICAgICAgaWYoZW50clsxXS5faWQ9PT1pZClcbiAgICAgICAgICAgICAgICByZXR1cm4gZW50clsxXTtcbiAgICAgICAgICAgIC8vZW50cmllcy5yZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9Ki9cbiAgICBwcml2YXRlIF9vbnNlbGVjdChldmVudCwgZGF0YSkge1xuICAgICAgICB2YXIgaXRlbSA9IHRoaXMuX2l0ZW1Ub0tleS5nZXQoZGF0YS5ub2RlLmRhdGEpO1xuICAgICAgICBldmVudC5kYXRhID0gaXRlbTtcbiAgICAgICAgdGhpcy5jYWxsRXZlbnQoXCJzZWxlY3RcIiwgZXZlbnQsIGRhdGEpO1xuICAgIH1cbiAgICBwcml2YXRlIF9vbmNsaWNrKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogRmFuY3l0cmVlLkV2ZW50RGF0YSkge1xuICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudC50YXJnZXRbXCJjbGFzc05hbWVcIl0uc3RhcnRzV2l0aChcIk1lbnVCdXR0b25cIikpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxDb250ZXh0bWVudShldmVudC5vcmlnaW5hbEV2ZW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQuY3RybEtleSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHJldHVybjsvL29ubHkgc2VsZWN0aW9uXG4gICAgICAgIGV2ZW50LmRhdGEgPSBkYXRhLm5vZGUuZGF0YS5pdGVtO1xuICAgICAgICBpZiAodGhpcy5fc2VsZWN0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9zZWxlY3QudmFsdWUgPSBkYXRhLm5vZGUuZGF0YS5pdGVtO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcImNsaWNrXCIsIGV2ZW50LCBkYXRhKTtcbiAgICB9XG4gICAgc2V0IHNlbGVjdGlvbih2YWx1ZXM6IGFueVtdKSB7XG5cbiAgICAgICAgdGhpcy50cmVlLmdldFNlbGVjdGVkTm9kZXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBpdGVtLnNldFNlbGVjdGVkKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHZhbHVlcyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzW1wiX3NlbGVjdGlvbklzV2FpdGluZ1wiXSA9IHZhbHVlcztcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCB2YWx1ZXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgIHZhciBpdGVtID0gdmFsdWVzW3ZdO1xuICAgICAgICAgICAgdGhpcy5fcmVhZE5vZGVGcm9tSXRlbShpdGVtKS50aGVuKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRTZWxlY3RlZCh0cnVlKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpc1tcIl9zZWxlY3Rpb25Jc1dhaXRpbmdcIl07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgc2VsZWN0aW9uKCk6IGFueVtdIHtcbiAgICAgICAgdmFyIHJldCA9IFtdO1xuICAgICAgICBpZiAodGhpc1tcIl9zZWxlY3Rpb25Jc1dhaXRpbmdcIl0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzW1wiX3NlbGVjdGlvbklzV2FpdGluZ1wiXTtcblxuICAgICAgICB0aGlzLnRyZWUuZ2V0U2VsZWN0ZWROb2RlcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHJldC5wdXNoKGl0ZW0uZGF0YS5pdGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIGFzeW5jIGFjdGl2YXRlS2V5KGtleTogc3RyaW5nLCBwYXJlbnQ6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlID0gdW5kZWZpbmVkKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIHZhciBub2RlID0gYXdhaXQgdGhpcy5fcmVhZE5vZGVGcm9tS2V5KGtleSk7XG4gICAgICAgIGlmIChub2RlID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBhd2FpdCBub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3luYyBleHBhbmRMYXRlcihwcm9taXNlLCBleHBhbmQ6IGJvb2xlYW4sIG5vZGU6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlLCBhbGxyZWFkeVNlZW4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwYW5kQWxsKGV4cGFuZCwgbm9kZSwgYWxscmVhZHlTZWVuKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZXhwYW5kIGFsbCBub2Rlc1xuICAgICAqL1xuICAgIGFzeW5jIGV4cGFuZEFsbChleHBhbmQ6IGJvb2xlYW4gPSB0cnVlLCBwYXJlbnQ6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlID0gdW5kZWZpbmVkLCBhbGxyZWFkeVNlZW46IGFueVtdID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBpc1Jvb3QgPSBwYXJlbnQgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIGFsbCA9IFtdO1xuICAgICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwYXJlbnQgPSB0aGlzLnRyZWUucm9vdE5vZGU7XG4gICAgICAgIGlmIChleHBhbmQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGV4cGFuZCA9IHRydWU7XG4gICAgICAgIGlmIChhbGxyZWFkeVNlZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgYWxscmVhZHlTZWVuID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGFyZW50Lmhhc0NoaWxkcmVuKCkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyZW50LmNoaWxkcmVuLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBwYXJlbnQuY2hpbGRyZW5beF07XG4gICAgICAgICAgICAgICAgaWYgKGFsbHJlYWR5U2Vlbi5pbmRleE9mKG5vZGUuZGF0YS5pdGVtKSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGFsbHJlYWR5U2Vlbi5wdXNoKG5vZGUuZGF0YS5pdGVtKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmhhc0NoaWxkcmVuKCkgfHwgbm9kZS5pc0xhenkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb20gPSBub2RlLnNldEV4cGFuZGVkKGV4cGFuZCk7XG4gICAgICAgICAgICAgICAgICAgIGFsbC5wdXNoKHRoaXMuZXhwYW5kTGF0ZXIocHJvbSwgZXhwYW5kLCBub2RlLCBhbGxyZWFkeVNlZW4pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhbGwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFzeW5jIGV4cGFuZEtleXMoa2V5czogc3RyaW5nW10pIHtcbiAgICAgICAgdmFyIGFsbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGtleXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHZhciBuID0gYXdhaXQgdGhpcy5fcmVhZE5vZGVGcm9tS2V5KGtleXNbeF0pO1xuICAgICAgICAgICAgaWYgKG4pIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBuLnNldEV4cGFuZGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIGFsbC5wdXNoKG4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFsbCk7XG4gICAgfVxuICAgIHB1YmxpYyBnZXRFeHBhbmRlZEtleXMocGFyZW50OiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSA9IHVuZGVmaW5lZCwgZXhwYW5kZWROb2Rlczogc3RyaW5nW10gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIGlzUm9vdCA9IHBhcmVudCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBwYXJlbnQgPSB0aGlzLnRyZWUuZ2V0Um9vdE5vZGUoKTtcbiAgICAgICAgaWYgKGV4cGFuZGVkTm9kZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXhwYW5kZWROb2RlcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJlbnQuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgcGFyZW50LmNoaWxkcmVuLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pc0V4cGFuZGVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwYW5kZWROb2Rlcy5wdXNoKG5vZGUua2V5KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRFeHBhbmRlZEtleXMobm9kZSwgZXhwYW5kZWROb2Rlcyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZXhwYW5kZWROb2RlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGV4cGFuZE5vZGUobm9kZTogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUpIHtcbiAgICAgICAgbm9kZS5zZXRBY3RpdmUodHJ1ZSk7XG4gICAgICAgIHZhciBsaXN0ID0gbm9kZS5nZXRQYXJlbnRMaXN0KGZhbHNlLCBmYWxzZSk7XG5cbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsaXN0Lmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBpZiAoIWxpc3RbeF0uaXNFeHBhbmRlZCgpKVxuICAgICAgICAgICAgICAgIGF3YWl0IGxpc3RbeF0uc2V0RXhwYW5kZWQodHJ1ZSk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBwcml2YXRlIGFzeW5jIF9yZWFkTm9kZUZyb21JdGVtKGl0ZW06IGFueSk6IFByb21pc2U8RmFuY3l0cmVlLkZhbmN5dHJlZU5vZGU+IHtcbiAgICAgICAgdmFyIGtleSA9IHRoaXMuX2l0ZW1Ub0tleS5nZXQoaXRlbSk7XG4gICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3JlYWRBbGxLZXlzSWZOZWVkZWQoKTtcbiAgICAgICAga2V5ID0gdGhpcy5faXRlbVRvS2V5LmdldChpdGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWROb2RlRnJvbUtleShrZXkpO1xuICAgIH1cbiAgICBwcml2YXRlIGFzeW5jIF9yZWFkTm9kZUZyb21LZXkoa2V5OiBzdHJpbmcpOiBQcm9taXNlPEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlPiB7XG5cbiAgICAgICAgdmFyIG5kID0gdGhpcy50cmVlLmdldE5vZGVCeUtleShrZXkpO1xuICAgICAgICBpZiAobmQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBwYXRoID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBnZXNrZXkgPSBcIlwiO1xuICAgICAgICAgICAga2V5Py5zcGxpdChcInxcIikuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgICAgICAgICAgIGdlc2tleSA9IGdlc2tleSArIChnZXNrZXkgPT09IFwiXCIgPyBcIlwiIDogXCJ8XCIpICsgaztcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aCArIFwiL1wiICsgZ2Vza2V5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy50cmVlLmxvYWRLZXlQYXRoKHBhdGgsIHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICAgICAgbmQgPSB0aGlzLnRyZWUuZ2V0Tm9kZUJ5S2V5KGtleSk7XG4gICAgICAgIHJldHVybiBuZDtcblxuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2YWx1ZSkge1xuXG4gICAgICAgIHRoaXNbXCJfdmFsdWVJc1dhaXRpbmdcIl0gPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fcmVhZE5vZGVGcm9tSXRlbSh2YWx1ZSkudGhlbigobm9kZSkgPT4ge1xuICAgICAgICAgICAgbm9kZS5zZXRBY3RpdmUodHJ1ZSk7XG4gICAgICAgICAgICBkZWxldGUgdGhpc1tcIl92YWx1ZUlzV2FpdGluZ1wiXTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgYWN0aXZlIGl0ZW1cbiAgICAgKiovXG4gICAgZ2V0IHZhbHVlKCk6IGFueSB7XG4gICAgICAgIGlmICh0aGlzW1wiX3ZhbHVlSXNXYWl0aW5nXCJdICE9PSB1bmRlZmluZWQpLy9hc3luYyBzZXR0aW5nIFxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbXCJfdmFsdWVJc1dhaXRpbmdcIl07XG4gICAgICAgIHZhciBoID0gdGhpcy50cmVlLmdldEFjdGl2ZU5vZGUoKTtcbiAgICAgICAgaWYgKGggPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gaC5kYXRhLml0ZW07XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgX3JlYWRBbGxOb2Rlc0lmTmVlZGVkKCkge1xuICAgICAgICBpZiAodGhpcy5fYWxsTm9kZXNSZWFkZWQgPT09IHRydWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWxsTm9kZXNSZWFkZWQgPT09IHRydWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5fcmVhZEFsbE5vZGVzSWZOZWVkZWQoKSk7XG4gICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWxsTm9kZXNSZWFkZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVhZEFsbEtleXNJZk5lZWRlZCgpO1xuICAgICAgICB2YXIgYWxsUGF0aGVzID0gW107XG5cbiAgICAgICAgdmFyIGFsbFBhdGhlcyA9IFtdO1xuICAgICAgICB0aGlzLl9pdGVtVG9LZXkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAvL3ZhciBrZXk9ZW50cnlbMV07XG4gICAgICAgICAgICB2YXIgcGF0aCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgZ2Vza2V5ID0gXCJcIjtcbiAgICAgICAgICAgIGtleS5zcGxpdChcInxcIikuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgICAgICAgICAgIGdlc2tleSA9IGdlc2tleSArIChnZXNrZXkgPT09IFwiXCIgPyBcIlwiIDogXCJ8XCIpICsgaztcbiAgICAgICAgICAgICAgICBwYXRoID0gcGF0aCArIFwiL1wiICsgZ2Vza2V5O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhbGxQYXRoZXMucHVzaChwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBhbGxQcm9taXNlOiBbXSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbFBhdGhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBhbGxQcm9taXNlLnB1c2godGhpcy50cmVlLmxvYWRLZXlQYXRoKGFsbFBhdGhlc1tpXSwgdW5kZWZpbmVkKSk7XG5cbiAgICAgICAgfVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhbGxQcm9taXNlKTtcbiAgICAgICAgdGhpcy5fYWxsTm9kZXNSZWFkZWQgPSB0cnVlO1xuICAgICAgICAvLyAgICBcdGF3YWl0IFByb21pc2UuYWxsKGFsbFByb21pc2UpO1xuICAgICAgICAvL1x0YXdhaXQgdGhpcy50cmVlLmxvYWRLZXlQYXRoKGFsbFBhdGhlcyx1bmRlZmluZWQpO1xuICAgIH1cbiAgICBnZXRLZXlGcm9tSXRlbShpdGVtKSB7XG4gICAgICAgIHZhciByZXQgPSB0aGlzLl9pdGVtVG9LZXkuZ2V0KGl0ZW0pO1xuICAgICAgICBpZiAocmV0ID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9yZWFkQWxsS2V5c0lmTmVlZGVkKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtVG9LZXkuZ2V0KGl0ZW0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiByZWFkIGFsbCBrZXlzIGlmIG5vdCBhbGxyZWFkeSByZWFkZWRcbiAgICAgKiovXG4gICAgcHJpdmF0ZSBfcmVhZEFsbEtleXNJZk5lZWRlZChpdGVtID0gdW5kZWZpbmVkLCBwYXRoOiBzdHJpbmcgPSB1bmRlZmluZWQsIGFsbHJlYWR5U2VlbjogYW55W10gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCAmJiB0aGlzLl9hbGxLZXlzUmVhZGVkID09PSB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZS5nZXRSb290Tm9kZSgpLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVhZEFsbEtleXNJZk5lZWRlZChjaGlsZC5kYXRhLml0ZW0sIFwiXCIsIFtdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxyZWFkeVNlZW4uaW5kZXhPZihpdGVtKSA9PT0gLTEpXG4gICAgICAgICAgICBhbGxyZWFkeVNlZW4ucHVzaChpdGVtKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgdGl0bGUgPSB0aGlzLmdldFRpdGxlRnJvbUl0ZW0oaXRlbSkucmVwbGFjZUFsbChcInxcIiwgXCIhXCIpO1xuICAgICAgICB2YXIga2V5ID0gcGF0aCArIChwYXRoID09PSBcIlwiID8gXCJcIiA6IFwifFwiKSArIHRpdGxlO1xuICAgICAgICB0aGlzLl9pdGVtVG9LZXkuc2V0KGl0ZW0sIGtleSk7XG5cbiAgICAgICAgdmFyIGNzOiBhbnlbXSA9IHRoaXMuZ2V0Q2hpbGRzRnJvbUl0ZW0oaXRlbSk7XG4gICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjcy5mb3JFYWNoKChjID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWFkQWxsS2V5c0lmTmVlZGVkKGMsIGtleSwgYWxscmVhZHlTZWVuKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbGxLZXlzUmVhZGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc2V0IGl0ZW1zKHZhbHVlOiBhbnkpIHsgLy90aGUgQ29kZVxuICAgICAgICB0aGlzLl9pdGVtcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9hbGxLZXlzUmVhZGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5faXRlbVRvS2V5ID0gbmV3IE1hcCgpO1xuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgICAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgICB2YXIgYXZhbHVlOiBUcmVlTm9kZVtdID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmFsdWUubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGF2YWx1ZS5wdXNoKG5ldyBUcmVlTm9kZSh0aGlzLCB2YWx1ZVt4XSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHJlZS5yZWxvYWQoYXZhbHVlKTtcbiAgICAgICAgLyogICAgICAgIHZhciByb290OiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSA9ICQoXCIjXCIgKyB0aGlzLl9pZCkuZmFuY3l0cmVlKFwiZ2V0VHJlZVwiKS5yb290Tm9kZTtcbiAgICAgICAgICAgICAgICByb290LnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5vYmplY3RUb05vZGUgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICAgICAgLy90aGlzLl9hbGxOb2Rlcz17fTtcbiAgICAgICAgICAgICAgICByb290LmFkZENoaWxkcmVuKGF2YWx1ZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7aiA8IHJvb3QuY2hpbGRyZW4ubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICAgICAgICBhdmFsdWVbal0uZmFuY3lOb2RlID0gcm9vdC5jaGlsZHJlbltqXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmplY3RUb05vZGUuc2V0KHZhbHVlW2pdLCBhdmFsdWVbal0pO1xuICAgICAgICAgICAgICAgIH0qL1xuICAgIH1cbiAgICBnZXQgaXRlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgICB9XG4gICAgc2V0IHNlbGVjdENvbXBvbmVudChfY29tcG9uZW50OiB7IHZhbHVlOiBudW1iZXIgfSkgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuX3NlbGVjdCA9IF9jb21wb25lbnQ7XG4gICAgfVxuICAgIGdldCBzZWxlY3RDb21wb25lbnQoKTogeyB2YWx1ZTogbnVtYmVyIH0ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0Oy8vJCh0aGlzLmRvbSkudGV4dCgpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NhbGxDb250ZXh0bWVudShldmVudCkge1xuICAgICAgICB2YXIgeCA9IDk7XG4gICAgICAgIC8vdmFyIHRyZWU9JChldmVudC50YXJnZXQpLmF0dHIoXCJ0cmVlaWRcIik7XG4gICAgICAgIC8vdHJlZT0kKFwiI1wiK3RyZWUpWzBdLl90aGlzO1xuXG4gICAgICAgIHZhciBuZXdldmVudCA9IHtcbiAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgdGFyZ2V0OiAkKGV2ZW50LnRhcmdldCkucHJldigpWzBdXG5cbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy5jb250ZXh0TWVudSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuX2NhbGxDb250ZXh0bWVudShuZXdldmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9ldnQub3JpZ2luYWxFdmVudC5jbGllbnRZfVxuICAgICAgICAvL1x0dHJlZS5jb250ZXh0TWVudS5zaG93KGV2ZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY3JlYXRlIHRoZSBjb250ZXh0bWVudVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBldnQgIHRoZSBjbGljayBldmVudCBpbiB0aGUgY29udGV4dG1lbnVcbiAgICAgKiovXG4gICAgcHJpdmF0ZSBfcHJlcGFyZUNvbnRleHRtZW51KGV2dCkge1xuICAgICAgICAvL3ZhciBub2RlOiBUcmVlTm9kZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG5vZGUgPSAkLnVpLmZhbmN5dHJlZS5nZXROb2RlKGV2dC50YXJnZXQpO1xuICAgICAgICAvL25vZGUgPSB0aGlzLl9hbGxOb2Rlc1tldnQudGFyZ2V0LmlkXTtcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHRNZW51ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChub2RlLmRhdGEuaXRlbSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIHZhciB0ZXN0ID0gbm9kZS5kYXRhLnRyZWUuc2VsZWN0aW9uO1xuICAgICAgICAgICAgLy9tdWx0aXNlbGVjdCBhbmQgdGhlIGNsaWNrZWQgaXMgd2l0aGluIHRoZSBzZWxlY3Rpb25cbiAgICAgICAgICAgIGlmICh0ZXN0ICE9PSB1bmRlZmluZWQgJiYgdGVzdC5pbmRleE9mKG5vZGUuZGF0YS5pdGVtKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZXh0TWVudS52YWx1ZSA9IHRlc3Q7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZXh0TWVudS52YWx1ZSA9IFtub2RlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBub2RlLmRhdGEuaXRlbV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0IGNvbnRleHRNZW51KHZhbHVlKSB7XG4gICAgICAgIHN1cGVyLmNvbnRleHRNZW51ID0gdmFsdWU7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhbHVlLm9uYmVmb3Jlc2hvdyhmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgICAgICBfdGhpcy5fcHJlcGFyZUNvbnRleHRtZW51KGV2dCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXQgY29udGV4dE1lbnUoKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5jb250ZXh0TWVudTtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuXG4gICAgfVxuXG59XG5cbmNsYXNzIFRyZWVOb2RlIHtcbiAgICB0cmVlOiBUcmVlO1xuICAgIF9pZDogc3RyaW5nO1xuICAgIGl0ZW07XG4gICAgaWNvbjogc3RyaW5nO1xuICAgIGNoaWxkcmVuOiBUcmVlTm9kZVtdO1xuICAgIHBhcmVudDogVHJlZU5vZGU7XG4gICAgZmFuY3lOb2RlOiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZTtcbiAgICBrZXk6IHN0cmluZztcbiAgICBsYXp5OiBib29sZWFuO1xuXG4gICAgLy9vcHRpb25zLnNvdXJjZT1bIHsgdGl0bGU6ICdGb2xkZXIgaW4gaG9tZSBmb2xkZXInLCBrZXk6ICdmQTEwMCcsIGZvbGRlcjogdHJ1ZSwgbGF6eTogdHJ1ZSB9XTtcblxuICAgIGNvbnN0cnVjdG9yKHRyZWUsIGl0ZW0sIHBhcmVudDogVHJlZU5vZGUgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX2lkID0gcmVnaXN0cnkubmV4dElEKCk7XG4gICAgICAgIHRoaXMuaXRlbSA9IGl0ZW07XG4gICAgICAgIHZhciB0aXRsZSA9IHRoaXMudHJlZS5nZXRUaXRsZUZyb21JdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgIHRoaXMua2V5ID0gKHBhcmVudCAhPT0gdW5kZWZpbmVkID8gcGFyZW50LmtleSArIFwifFwiIDogXCJcIikgKyAodGl0bGUgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiB0aXRsZSkucmVwbGFjZUFsbChcInxcIiwgXCIhXCIpO1xuICAgICAgICB0aGlzLnRyZWUuX2l0ZW1Ub0tleS5zZXQoaXRlbSwgdGhpcy5rZXkpO1xuICAgICAgICB0aGlzLmljb24gPSB0aGlzLnRyZWUuZ2V0SWNvbkZyb21JdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgIHZhciBjcyA9IHRoaXMudHJlZS5nZXRDaGlsZHNGcm9tSXRlbSh0aGlzLml0ZW0pO1xuICAgICAgICBpZiAoY3MgIT09IHVuZGVmaW5lZCAmJiBjcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmxhenkgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgcHJpdmF0ZSBnZXRTdHlsZSgpOiBzdHJpbmcge1xuICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy50cmVlLmdldFN0eWxlRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgaWYgKHN0eWxlKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gc3R5bGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBcIl9jbGFzc25hbWVcIilcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0tleSA9IGtleS5yZXBsYWNlQWxsKFwiX1wiLCBcIi1cIik7XG5cbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIlxcdFxcdFwiICsgbmV3S2V5ICsgXCI6XCIgKyAoPHN0cmluZz5zdHlsZVtrZXldKSArIFwiO1xcblwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgdmFyIHJldCA9IHRoaXMudHJlZS5nZXRUaXRsZUZyb21JdGVtKHRoaXMuaXRlbSk7XG5cbiAgICAgICAgdmFyIGJ0ID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMudHJlZS5jb250ZXh0TWVudSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgYnQgPSBcIjxzcGFuIGNsYXNzPSdNZW51QnV0dG9uIG1lbnUgbWRpIG1kaS1tZW51LWRvd24nIGlkPTkwMCAgdHJlZWlkPVwiICsgdGhpcy50cmVlLl9pZCArIFwiICBoZWlnaHQ9JzEwJyB3aWR0aD0nMTAnIG9uY2xpY2s9Jy8qamFzc2lqcy51aS5UcmVlLl9jYWxsQ29udGV4dG1lbnUoZXZlbnQpOyovJz5cIjtcbiAgICAgICAgLy9wcmV2ZW50IFhTU1xuICAgICAgICByZXQgPSAocmV0ID09PSB1bmRlZmluZWQgPyBcIlwiIDogcmV0KS5yZXBsYWNlQWxsKFwiPFwiLCBcIiZsdFwiKS5yZXBsYWNlQWxsKFwiPlwiLCBcIiZndFwiKTtcbiAgICAgICAgcmV0ID0gXCI8c3BhbiBpZD1cIiArIHRoaXMuX2lkICsgXCIgc3R5bGU9J1wiICsgdGhpcy5nZXRTdHlsZSgpICsgXCInICA+XCIgKyByZXQgKyBcIjwvc3Bhbj5cIjtcbiAgICAgICAgcmV0dXJuIHJldCArIGJ0O1xuICAgIH1cbiAgICBzdGF0aWMgbG9hZENoaWxkcyhldmVudCwgZGF0YSkge1xuICAgICAgICB2YXIgbm9kZTogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUgPSBkYXRhLm5vZGU7XG4gICAgICAgIHZhciBkZWZlcnJlZFJlc3VsdCA9IGpRdWVyeS5EZWZlcnJlZCgpO1xuICAgICAgICB2YXIgdHJlZSA9IGRhdGEubm9kZS5kYXRhLnRyZWU7XG4gICAgICAgIHZhciBfdGhpcyA9IGRhdGEubm9kZTtcbiAgICAgICAgdmFyIGNzID0gdHJlZS5nZXRDaGlsZHNGcm9tSXRlbShkYXRhLm5vZGUuZGF0YS5pdGVtKTtcbiAgICAgICAgdmFyIGNoaWxkczogVHJlZU5vZGVbXSA9IFtdO1xuICAgICAgICBpZiAoY3MgIT09IHVuZGVmaW5lZCAmJiBjcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5kID0gbmV3IFRyZWVOb2RlKHRyZWUsIGNzW3hdLCBfdGhpcyk7XG4gICAgICAgICAgICAgICAgY2hpbGRzLnB1c2gobmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRhdGEucmVzdWx0ID0gY2hpbGRzO1xuICAgICAgICByZXR1cm47XG4gICAgICAgIC8qICAgICAgICBmYW5jeW5vZGUucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICBmYW5jeW5vZGUuYWRkQ2hpbGRyZW4oY2hpbGRzKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDtqIDwgZmFuY3lub2RlLmNoaWxkcmVuLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzW2pdLmZhbmN5Tm9kZSA9IGZhbmN5bm9kZS5jaGlsZHJlbltqXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVlLm9iamVjdFRvTm9kZS5zZXQoY3Nbal0sIGNoaWxkc1tqXSk7XG4gICAgICAgICAgICAgICAgfSovXG4gICAgICAgIC8vIGRlbGV0ZSB0aGlzLl9kdW1teTtcbiAgICB9XG4gICAgLyogcG9wdWxhdGUoZmFuY3lub2RlOiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSkge1xuICAgICAgICAgdmFyIGNzID0gdGhpcy50cmVlLmdldENoaWxkc0Zyb21JdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgICB2YXIgY2hpbGRzOiBUcmVlTm9kZVtdID0gW107XG4gICAgICAgICBpZiAoY3MgIT09IHVuZGVmaW5lZCAmJiBjcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7eCA8IGNzLmxlbmd0aDt4KyspIHtcbiAgICAgICAgICAgICAgICAgdmFyIG5kID0gbmV3IFRyZWVOb2RlKHRoaXMudHJlZSwgY3NbeF0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChuZCk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICAgICAgZmFuY3lub2RlLnJlbW92ZUNoaWxkcmVuKCk7XG4gICAgICAgICBmYW5jeW5vZGUuYWRkQ2hpbGRyZW4oY2hpbGRzKTtcbiAgICAgICAgIGZvciAodmFyIGogPSAwO2ogPCBmYW5jeW5vZGUuY2hpbGRyZW4ubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgIGNoaWxkc1tqXS5mYW5jeU5vZGUgPSBmYW5jeW5vZGUuY2hpbGRyZW5bal07XG4gICAgICAgICAgICAgdGhpcy50cmVlLm9iamVjdFRvTm9kZS5zZXQoY3Nbal0sIGNoaWxkc1tqXSk7XG4gICAgICAgICB9XG4gICAgICAgICBkZWxldGUgdGhpcy5fZHVtbXk7XG4gICAgICAgICAvL3JldHVybiByZXQ7XG4gICAgIH0qL1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHRyZWUgPSBuZXcgVHJlZSgpO1xuICAgIHZhciBzOiBhbnkgPSB7IG5hbWU6IFwiU2Fuc2FcIiwgaWQ6IDEsIHN0eWxlOiB7IGNvbG9yOiBcImJsdWVcIiB9IH07XG4gICAgdmFyIHAgPSB7IG5hbWU6IFwiUGV0ZXJcIiwgaWQ6IDIgfTtcbiAgICB2YXIgdSA9IHsgbmFtZTogXCJVd2VcIiwgaWQ6IDMsIGNoaWxkczogW3AsIHNdIH07XG4gICAgdmFyIHQgPSB7IG5hbWU6IFwiVG9tXCIsIGlkOiA1IH07XG4gICAgdmFyIGMgPSB7IG5hbWU6IFwiQ2hyaXN0b3BoXCIsIGlkOiA0LCBjaGlsZHM6IFt1LCB0XSB9O1xuICAgIHMuY2hpbGRzID0gW2NdO1xuICAgIHRyZWUuY29uZmlnKHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgY2hlY2tib3g6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAgcHJvcERpc3BsYXk6IFwibmFtZVwiLFxuICAgICAgICBwcm9wQ2hpbGRzOiBcImNoaWxkc1wiLFxuICAgICAgICBwcm9wU3R5bGU6IFwic3R5bGVcIixcbiAgICAgICAgaXRlbXM6IFtjXSxcbiAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICBoZWlnaHQ6IFwiMTAwcHhcIixcbiAgICAgICAgb25jbGljazpmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZWxlY3QgXCIgKyBkYXRhLmRhdGEubmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGlvbiA6IFtwLCBzXSxcbiAgICAgICAgdmFsdWUgOiBwXG4gICAgfSk7XG5cblxuICAgIC8qdHJlZS5wcm9wSWNvbiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEubmFtZSA9PT0gXCJVd2VcIilcbiAgICAgICAgICAgIHJldHVybiBcInJlcy9jYXIuaWNvXCI7XG4gICAgfTsqL1xuXG5cbiAgICAvLyAgdHJlZS5fcmVhZEFsbEtleXNJZk5lZWRlZCgpO1xuXG4gICBcbiAgICAvL1x0YXdhaXQgdHJlZS50cmVlLmxvYWRLZXlQYXRoKFtcIi9DaHJpc3RvcGgvQ2hyaXN0b3BofFV3ZS9DaHJpc3RvcGh8VXdlfFBldGVyXCJdLHVuZGVmaW5lZCk7XG4gICAgLy9cdFx0dmFyIGg9dHJlZS50cmVlLmdldE5vZGVCeUtleShcIkNocmlzdG9waHxVd2V8UGV0ZXJcIik7XG4gICAgLy9cdFx0dHJlZS50cmVlLmFjdGl2YXRlS2V5KFwiQ2hyaXN0b3BofFV3ZXxQZXRlclwiKTtcblxuXG4gICAgLy9bXCJDaHJpc3RvcGhcIixcIkNocmlzdG9waC9Vd2UvVG9tMVwiXSwoKT0+e30pO1xuICAgIC8vXHRub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAvLyB2YXIgaiA9IHRyZWUudmFsdWU7XG4gICAgd2luZG93LnNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIHZhciBrID0gdHJlZS5zZWxlY3Rpb247XG5cbiAgICAgICAgLy9cdFx0dmFyIG5vZD10cmVlLnRyZWUuZ2V0Tm9kZUJ5S2V5KFwiQ2hyaXN0b3BoL1V3ZS9Ub20xXCIpO1xuICAgICAgICAvLyBhd2FpdCB0cmVlLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgLy8gYXdhaXQgdHJlZS5leHBhbmRBbGwoZmFsc2UpO1xuICAgICAgICAvL1x0dmFyIG5vZGU9dHJlZS50cmVlLmdldE5vZGVCeUtleShcIkNocmlzdG9waC9Vd2UvUGV0ZXJcIik7XG5cbiAgICAgICAgLy9cdG5vZGUuc2V0QWN0aXZlKHRydWUpO1xuICAgICAgICAvL2F3YWl0IHRyZWUuZXhwYW5kQWxsKCk7XG4gICAgICAgIC8vIHRyZWUudmFsdWUgPSBwO1xuICAgICAgICAvL3RyZWUuZXhwYW5kQWxsKGZhbHNlKTtcbiAgICAgICAgLy8gdHJlZS52YWx1ZSA9IHA7XG4gICAgICAgIC8vdmFyIGs9dHJlZS5nZXRFeHBhbmRlZEtleXMoKTtcbiAgICAgICAgLy8gdHJlZS5leHBhbmRLZXlzKGspO1xuICAgICAgICAvKiB0cmVlLmV4cGFuZEFsbCgpO1xuICAgICAgICAgdHJlZS52YWx1ZSA9IHA7XG4gICAgICAgICB2YXIgbD10cmVlLnZhbHVlOyovXG5cbiAgICAgICAgLy8gIHZhciBqID0gdHJlZS52YWx1ZTtcbiAgICAgICAgLy8gYWxlcnQodHJlZS52YWx1ZS5uYW1lKTtcbiAgICB9LCA0MDAwKTtcbiAgICAvLyAgICBcdCQodHJlZS5fX2RvbSkuZGlhbG9nKCk7XG4gICAgcmV0dXJuIHRyZWU7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19