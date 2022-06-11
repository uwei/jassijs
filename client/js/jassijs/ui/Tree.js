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
            var select = options.select;
            var click = options.click;
            options.source = [{ title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
            options.icon = false; //we have an own
            options.lazyLoad = function (event, data) {
                TreeNode.loadChilds(event, data);
            };
            options.select = function (event, data) {
                _this._onselect(event, data);
                if (select !== undefined)
                    select(event, data);
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
            // checkbox: true
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
        tree.onselect(() => {
            console.log(tree.selection);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvVHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQVdBOzs7O09BSUc7SUFHSCxJQUFNLHlCQUF5QixHQUEvQixNQUFNLHlCQUF5QjtLQUc5QixDQUFBO0lBREc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFFLENBQUM7OzJEQUMvRjtJQUZaLHlCQUF5QjtRQUQ5QixJQUFBLGNBQU0sRUFBQyxzQ0FBc0MsQ0FBQztPQUN6Qyx5QkFBeUIsQ0FHOUI7SUFFRCxJQUFNLG9CQUFvQixHQUExQixNQUFNLG9CQUFvQjtLQU96QixDQUFBO0lBTEc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLCtCQUErQixFQUFFLENBQUM7OzREQUMzRTtJQUVwQjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLG9DQUFvQyxFQUFFLENBQUM7OzBEQUM5RDtJQUVuQjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLHNDQUFzQyxFQUFFLENBQUM7a0NBQzNFLHlCQUF5Qjt1REFBQztJQU5oQyxvQkFBb0I7UUFEekIsSUFBQSxjQUFNLEVBQUMsaUNBQWlDLENBQUM7T0FDcEMsb0JBQW9CLENBT3pCO0lBeURELElBQWEsSUFBSTtJQUxqQjs7OztNQUlFO0lBQ0YsTUFBYSxJQUFLLFNBQVEscUJBQVM7UUFhL0IsWUFBWSxPQUFvQztZQUM1QyxL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WUFFMUQsd0JBQXdCO1lBQ3hCLHlCQUF5QjtZQUN6QixrQkFBa0I7WUFDbEIsd0JBQXdCO1lBQ3hCLGtCQUFrQjtZQUNsQiwrQkFBK0I7WUFDL0Isc0JBQXNCO1lBQ3RCOztnQ0FFb0I7WUFFcEIsdUJBQXVCO1lBQ3ZCLDBCQUEwQjtRQUM5QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDVCw4QkFBOEI7UUFDOUIsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQXRFRCxvQkFzRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJqYXNzaWpzL2V4dC9mYW5jeXRyZWVcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50LCAkVUlDb21wb25lbnQsIENvbXBvbmVudENvbmZpZyB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xuaW1wb3J0IHsgQ29tcG9uZW50RGVzY3JpcHRvciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudERlc2NyaXB0b3JcIjtcbmltcG9ydCByZWdpc3RyeSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcblxuXG5pbXBvcnQgZXh0ZW5zaW9ucyBmcm9tIFwiamFzc2lqcy9iYXNlL0V4dGVuc2lvbnNcIjtcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XG5pbXBvcnQgeyBTdHlsZSB9IGZyb20gXCJqYXNzaWpzL3VpL1N0eWxlXCI7XG5pbXBvcnQgeyBDU1NQcm9wZXJ0aWVzIH0gZnJvbSBcImphc3NpanMvdWkvQ1NTUHJvcGVydGllc1wiO1xuLypkZWNsYXJlIGdsb2JhbCB7XG4gICAgaW50ZXJmYWNlIEpRdWVyeSB7XG4gICAgICAgIGZhbmN5dHJlZTogYW55O1xuICAgIH1cbn0qL1xuXG5AJENsYXNzKFwiamFzc2lqcy51aS5UcmVlRWRpdG9yUHJvcGVydGllc011bHRpXCIpXG5jbGFzcyBUcmVlRWRpdG9yUHJvcGVydGllc011bHRpIHtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJcIiwgY2hvb3NlRnJvbTogW1wiXCIsIFwic2FtZVBhcmVudFwiLCBcInNhbWVMZXZlbFwiXSwgZGVzY3JpcHRpb246IFwibXVsdGkgc2VsZWN0aW9uIG1vZGVcIiB9KVxuICAgIG1vZGU/OiBzdHJpbmc7XG59XG5AJENsYXNzKFwiamFzc2lqcy51aS5UcmVlRWRpdG9yUHJvcGVydGllc1wiKVxuY2xhc3MgVHJlZUVkaXRvclByb3BlcnRpZXMge1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiAzLCBjaG9vc2VGcm9tOiBbMSwgMiwgM10sIGRlc2NyaXB0aW9uOiBcIjE9c2luZ2xlIDI9bXVsdGkgMz1tdWx0aV9oaWVyXCIgfSlcbiAgICBzZWxlY3RNb2RlPzogbnVtYmVyO1xuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBmYWxzZSwgZGVzY3JpcHRpb246IFwiZGlzcGxheSBhIGNoZWNrYm94IGJlZm9yZSB0aGUgbm9kZVwiIH0pXG4gICAgY2hlY2tib3g/OiBib29sZWFuO1xuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzLnVpLlRyZWVFZGl0b3JQcm9wZXJ0aWVzTXVsdGlcIiB9KVxuICAgIG11bHRpPzogVHJlZUVkaXRvclByb3BlcnRpZXNNdWx0aTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgVHJlZUNvbmZpZyBleHRlbmRzIENvbXBvbmVudENvbmZpZyB7XG4gICAgb3B0aW9ucz86IEZhbmN5dHJlZS5GYW5jeXRyZWVPcHRpb25zO1xuICAgIC8qKlxuICAgICogQG1lbWJlciAtIGdldCB0aGUgcHJvcGVydHkgZm9yIHRoZSBkaXNwbGF5IG9mIHRoZSBpdGVtIG9yIGFuIGZ1bmN0aW9uIHRvIGdldCB0aGUgZGlzcGxheSBmcm9tIGFuIGl0ZW1cbiAgICAqL1xuICAgIHByb3BTdHlsZT86IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IENTU1Byb3BlcnRpZXMgfTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIC0gZ2V0IHRoZSBwcm9wZXJ0eSBmb3IgdGhlIGRpc3BsYXkgb2YgdGhlIGl0ZW0gb3IgYW4gZnVuY3Rpb24gdG8gZ2V0IHRoZSBkaXNwbGF5IGZyb20gYW4gaXRlbVxuICAgICAqL1xuICAgIHByb3BEaXNwbGF5Pzogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogc3RyaW5nIH07XG4gICAgLyoqXG4gICAgICogQG1lbWJlciAtIGdldCB0aGUgaWNvbnByb3BlcnR5IG9mIHRoZSBpdGVtIG9yIGFuIGZ1bmN0aW9uIHRvIGdldCB0aGUgaWNvbiBmcm9tIGFuIGl0ZW1cbiAgICAgKi9cbiAgICBwcm9wSWNvbj86IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IHN0cmluZyB9XG4gICAgLyoqXG4gICAgKiBAbWVtYmVyIC0gZ2V0IHRoZSBjaGlsZHMgb2YgdGhlIGl0ZW0gb3IgYW4gZnVuY3Rpb24gdG8gZ2V0IHRoZSBjaGlsZHMgZnJvbSBhbiBpdGVtXG4gICAgKi9cbiAgICBwcm9wQ2hpbGRzPzogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogYW55W10gfTtcblxuICAgIG9uc2VsZWN0PyhoYW5kbGVyKTtcblxuICAgIC8qKlxuICAgICAqIHJlZ2lzdGVyIGFuIGV2ZW50IGlmIGFuIGl0ZW0gaXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXIgLSB0aGUgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgb24gY2xpY2tcbiAgICAgKi9cbiAgICBvbmNsaWNrPyhoYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YT86IEZhbmN5dHJlZS5FdmVudERhdGEpID0+IHZvaWQpO1xuICAgIC8qKlxuICAgICogc2VsZWN0cyBpdGVtc1xuICAgICovXG4gICAgc2VsZWN0aW9uPzogYW55W107XG4gICAgLyoqXG4gICAgICogc2V0IHRoZSBhY3RpdmUgaXRlbVxuICAgICAqL1xuICAgIHZhbHVlPztcbiAgICAvKipcbiAgICAqIEBwYXJhbSB2YWx1ZSAtIHNldCB0aGUgZGF0YSB0byBzaG93IGluIFRyZWVcbiAgICAqKi9cbiAgICBpdGVtcz86IGFueTtcbiAgICAvKipcbiAgICAgKiBpZiB0aGUgdmFsdWUgaXMgY2hhbmdlZCB0aGVuIHRoZSB2YWx1ZSBvZiBfY29tcG9uZW50IGlzIGFsc28gY2hhbmdlZCAoX2NvbXBvbmVudC52YWx1ZSlcbiAgICAgKi9cbiAgICBzZWxlY3RDb21wb25lbnQ/OiB7IHZhbHVlOiBudW1iZXIgfTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtqYXNzaWpzLnVpLkNvbnRleHRNZW51fSAtIHRoZSBjb250ZXh0bWVudSBvZiB0aGUgY29tcG9uZW50XG4gICAgICoqL1xuICAgIGNvbnRleHRNZW51Pztcbn1cblxuQCRVSUNvbXBvbmVudCh7IGZ1bGxQYXRoOiBcImNvbW1vbi9UcmVlXCIsIGljb246IFwibWRpIG1kaS1maWxlLXRyZWVcIiB9KVxuQCRDbGFzcyhcImphc3NpanMudWkuVHJlZVwiKVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3XCIsIHR5cGU6IFwianNvblwiLCBjb21wb25lbnRUeXBlOiBcImphc3NpanMudWkuVHJlZUVkaXRvclByb3BlcnRpZXNcIiB9KVxuLypAJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvc2VsZWN0TW9kZVwiLCB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAzLCBjaG9vc2VGcm9tOiBbMSwgMiwgM10sIGRlc2NyaXB0aW9uOiBcIjE9c2luZ2xlIDI9bXVsdGkgMz1tdWx0aV9oaWVyXCIgfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9jaGVja2JveFwiLCB0eXBlOiBcImJvb2xlYW5cIiwgZGVmYXVsdDogZmFsc2UsIGRlc2NyaXB0aW9uOiBcImRlc3BsYXkgYSBjaGVja2JvcyBiZWZvcmUgdGhlIG5vZGVcIiB9KVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3L211bHRpXCIsIHR5cGU6IFwianNvblwiIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvbXVsdGkvbW9kZVwiLCB0eXBlOiBcInN0cmluZ1wiLCBkZWZhdWx0OiBcIlwiLCBjaG9vc2VGcm9tOiBbXCJcIiwgXCJzYW1lUGFyZW50XCIsIFwic2FtZUxldmVsXCJdLCBkZXNjcmlwdGlvbjogXCJtdWx0aSBzZWxlY3Rpb24gbW9kZVwiIH0pXG4qL1xuZXhwb3J0IGNsYXNzIFRyZWUgZXh0ZW5kcyBDb21wb25lbnQgaW1wbGVtZW50cyBUcmVlQ29uZmlnIHtcbiAgICBfcHJvcERpc3BsYXk6IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IHN0cmluZyB9O1xuICAgIF9wcm9wSWNvbjogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogc3RyaW5nIH07XG4gICAgX3Byb3BDaGlsZHM6IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IGFueVtdIH07XG4gICAgX3Byb3BTdHlsZTogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogQ1NTUHJvcGVydGllcyB9O1xuICAgIF9zZWxlY3Q6IHsgdmFsdWU6IG51bWJlciB9O1xuICAgIHRyZWU6IEZhbmN5dHJlZS5GYW5jeXRyZWU7XG4gICAgX2lzSW5pdGVkOiBib29sZWFuO1xuICAgIF9pdGVtVG9LZXk6IE1hcDxhbnksIHN0cmluZz47XG4gICAgcHJpdmF0ZSBfaXRlbXM7XG4gICAgcHJpdmF0ZSBfYWxsS2V5c1JlYWRlZDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9hbGxOb2Rlc1JlYWRlZDogYm9vbGVhbjtcbiAgICBfbGFzdE9wdGlvbnM6IEZhbmN5dHJlZS5GYW5jeXRyZWVPcHRpb25zO1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBGYW5jeXRyZWUuRmFuY3l0cmVlT3B0aW9ucykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBzdXBlci5pbml0KCQoJzxkaXYgY2xhc3M9XCJUcmVlXCI+PC9kaXY+JylbMF0pO1xuICAgICAgICB0aGlzLl9pdGVtVG9LZXkgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGNvbmZpZyhjb25maWc6IFRyZWVDb25maWcpOiBUcmVlIHtcbiAgICAgICAgc3VwZXIuY29uZmlnKGNvbmZpZyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzLnVpLlRhYmxlRWRpdG9yUHJvcGVydGllc1wiIH0pXG4gICAgc2V0IG9wdGlvbnMob3B0aW9uczogRmFuY3l0cmVlLkZhbmN5dHJlZU9wdGlvbnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5fbGFzdE9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICBpZiAodGhpcy50cmVlKSB7XG4gICAgICAgICAgICB2YXIgbGFzdFNlbCA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB2YXIgbGFzdEl0ZW1zID0gdGhpcy5pdGVtcztcbiAgICAgICAgICAgIC8vdGhpcy50YWJsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAvL3RoaXMudGFibGUgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIC8vRGVmYXVsdCBPcHRpb25zXG5cblxuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZXh0ZW5zaW9ucyA9IFtcImZpbHRlclwiLCBcIm11bHRpXCIsIFwiZG5kXCJdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMuaW5kZXhPZihcImZpbHRlclwiKSA9PT0gLTEpXG4gICAgICAgICAgICBvcHRpb25zLmV4dGVuc2lvbnMucHVzaChcImZpbHRlclwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZXh0ZW5zaW9ucy5pbmRleE9mKFwibXVsdGlcIikgPT09IC0xKVxuICAgICAgICAgICAgb3B0aW9ucy5leHRlbnNpb25zLnB1c2goXCJtdWx0aVwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZXh0ZW5zaW9ucy5pbmRleE9mKFwiZG5kXCIpID09PSAtMSlcbiAgICAgICAgICAgIG9wdGlvbnMuZXh0ZW5zaW9ucy5wdXNoKFwiZG5kXCIpO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXIgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIG9wdGlvbnMuZmlsdGVyID0ge307XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlci5tb2RlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBvcHRpb25zLmZpbHRlci5tb2RlID0gXCJoaWRlXCI7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbHRlci5hdXRvRXhwYW5kID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBvcHRpb25zLmZpbHRlci5hdXRvRXhwYW5kID0gdHJ1ZTtcblxuICAgICAgICB2YXIgYmVmb3JlRXhwYW5kID0gb3B0aW9ucy5iZWZvcmVFeHBhbmQ7XG4gICAgICAgIHZhciBzZWxlY3QgPSBvcHRpb25zLnNlbGVjdDtcbiAgICAgICAgdmFyIGNsaWNrID0gb3B0aW9ucy5jbGljaztcbiAgICAgICAgb3B0aW9ucy5zb3VyY2UgPSBbeyB0aXRsZTogJ0ZvbGRlciBpbiBob21lIGZvbGRlcicsIGtleTogJ2ZBMTAwJywgZm9sZGVyOiB0cnVlLCBsYXp5OiB0cnVlIH1dO1xuICAgICAgICBvcHRpb25zLmljb24gPSBmYWxzZTsvL3dlIGhhdmUgYW4gb3duXG4gICAgICAgIG9wdGlvbnMubGF6eUxvYWQgPSBmdW5jdGlvbiAoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgIFRyZWVOb2RlLmxvYWRDaGlsZHMoZXZlbnQsIGRhdGEpO1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLnNlbGVjdCA9IGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEZhbmN5dHJlZS5FdmVudERhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLl9vbnNlbGVjdChldmVudCwgZGF0YSk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgc2VsZWN0KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5jbGljayA9IGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEZhbmN5dHJlZS5FdmVudERhdGEpIHtcbiAgICAgICAgICAgIF90aGlzLl9vbmNsaWNrKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIGlmIChjbGljayAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHJldHVybiBjbGljayhldmVudCwgZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2lkKS5mYW5jeXRyZWUob3B0aW9ucyk7XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLnRyZWUgPSAkLnVpLmZhbmN5dHJlZS5nZXRUcmVlKFwiI1wiICsgdGhpcy5faWQpO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5faWQpLmZpbmQoXCJ1bFwiKS5jc3MoXCJoZWlnaHRcIiwgXCJjYWxjKDEwMCUgLSA4cHgpXCIpO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5faWQpLmZpbmQoXCJ1bFwiKS5jc3MoXCJ3ZWlnaHRcIiwgXCJjYWxjKDEwMCUgLSA4cHgpXCIpO1xuICAgICAgICAkKFwiI1wiICsgdGhpcy5faWQpLmZpbmQoXCJ1bFwiKS5jc3MoXCJvdmVyZmxvd1wiLCBcImF1dG9cIik7XG4gICAgICAgIGlmIChsYXN0SXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBsYXN0SXRlbXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxhc3RTZWwpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBsYXN0U2VsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBvcHRpb25zKCk6IEZhbmN5dHJlZS5GYW5jeXRyZWVPcHRpb25zIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhc3RPcHRpb25zO1xuICAgIH1cbiAgICAvKipcbiAgICAqIEBtZW1iZXIgLSBnZXQgdGhlIHByb3BlcnR5IGZvciB0aGUgZGlzcGxheSBvZiB0aGUgaXRlbSBvciBhbiBmdW5jdGlvbiB0byBnZXQgdGhlIGRpc3BsYXkgZnJvbSBhbiBpdGVtXG4gICAgKi9cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJzdHJpbmdcIiwgZGVzY3JpcHRpb246IFwidGhlIHByb3BlcnR5IGNhbGxlZCB0byBnZXQgdGhlIHN0eWxlIG9mIHRoZSBpdGVtXCIgfSlcbiAgICBzZXQgcHJvcFN0eWxlKHZhbHVlOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBDU1NQcm9wZXJ0aWVzIH0pIHtcbiAgICAgICAgdGhpcy5fcHJvcFN0eWxlID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBwcm9wU3R5bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wU3R5bGU7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIsIGRlc2NyaXB0aW9uOiBcInRoZSBwcm9wZXJ0eSBjYWxsZWQgdG8gZ2V0IHRoZSBuYW1lIG9mIHRoZSBpdGVtXCIgfSlcbiAgICBzZXQgcHJvcERpc3BsYXkodmFsdWU6IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IHN0cmluZyB9KSB7XG4gICAgICAgIHRoaXMuX3Byb3BEaXNwbGF5ID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBwcm9wRGlzcGxheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BEaXNwbGF5O1xuICAgIH1cblxuICAgIHNldCBwcm9wSWNvbihpY29uOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLl9wcm9wSWNvbiA9IGljb247XG4gICAgfVxuICAgIGdldCBwcm9wSWNvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BJY29uO1xuICAgIH1cblxuICAgIHNldCBwcm9wQ2hpbGRzKGNoaWxkOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBhbnlbXSB9KSB7XG4gICAgICAgIHRoaXMuX3Byb3BDaGlsZHMgPSBjaGlsZDtcbiAgICB9XG4gICAgZ2V0IHByb3BDaGlsZHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wQ2hpbGRzO1xuICAgIH1cbiAgICBcbiAgICBvbnNlbGVjdChoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJzZWxlY3RcIiwgaGFuZGxlcik7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50PzogSlF1ZXJ5RXZlbnRPYmplY3QvKiwgZGF0YT86RmFuY3l0cmVlLkV2ZW50RGF0YSovKXtcXG5cXHRcXG59XCIgfSlcbiAgICBvbmNsaWNrKGhhbmRsZXI6IChldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhPzogRmFuY3l0cmVlLkV2ZW50RGF0YSkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwiY2xpY2tcIiwgaGFuZGxlcik7XG4gICAgfVxuXG4gICAgZmlsdGVyKHRleHQ6IHN0cmluZykge1xuICAgICAgICAvLyB0aGlzLmV4cGFuZEFsbCgpO1xuICAgICAgICB0aGlzLl9yZWFkQWxsTm9kZXNJZk5lZWRlZCgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRleHQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWUuY2xlYXJGaWx0ZXIoKTtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmV4cGFuZEFsbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWUuZmlsdGVyTm9kZXModGV4dCwgeyBsZWF2ZXNPbmx5OiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBnZXQgdGl0bGUgZnJvbSBub2RlXG4gICAgKi9cbiAgICBnZXRUaXRsZUZyb21JdGVtKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJldCA9IFwiXCI7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMucHJvcERpc3BsYXkpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMucHJvcERpc3BsYXkoaXRlbSk7XG4gICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgcmV0ID0gaXRlbVt0aGlzLnByb3BEaXNwbGF5XTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgLyoqXG4gICAqIGdldCB0aXRsZSBmcm9tIG5vZGVcbiAgICovXG4gICAgZ2V0U3R5bGVGcm9tSXRlbShpdGVtKTogQ1NTUHJvcGVydGllcyB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIGlmICh0eXBlb2YgKHRoaXMucHJvcFN0eWxlKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb3BTdHlsZShpdGVtKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICByZXQgPSBpdGVtW3RoaXMucHJvcFN0eWxlXTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgLyoqXG4gICAgKiBnZXQgaWNvbiBmcm9tIG5vZGVcbiAgICAqL1xuICAgIGdldEljb25Gcm9tSXRlbShpdGVtKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BJY29uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMucHJvcEljb24pID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wSWNvbihpdGVtKTtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtW3RoaXMucHJvcEljb25dO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICogZ2V0IGNoaWxkcyBmcm9tIG5vZGVcbiAgICAqL1xuICAgIGdldENoaWxkc0Zyb21JdGVtKGl0ZW0pIHtcbiAgICAgICAgdmFyIGNzID0gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BDaGlsZHMpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNzID0gdGhpcy5wcm9wQ2hpbGRzKGl0ZW0pO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGNzID0gaXRlbVt0aGlzLnByb3BDaGlsZHNdO1xuICAgICAgICByZXR1cm4gY3M7XG4gICAgfVxuXG5cbiAgICAvKnByaXZhdGUgZ2V0VHJlZU5vZGVGcm9tSWQoaWQ6c3RyaW5nKTpUcmVlTm9kZXtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGZvcih2YXIgZW50ciBvZiB0aGlzLm9iamVjdFRvTm9kZSl7XG4gICAgICAgICAgICBpZihlbnRyWzFdLl9pZD09PWlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyWzFdO1xuICAgICAgICAgICAgLy9lbnRyaWVzLnJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0qL1xuICAgIHByaXZhdGUgX29uc2VsZWN0KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5faXRlbVRvS2V5LmdldChkYXRhLm5vZGUuZGF0YSk7XG4gICAgICAgIGV2ZW50LmRhdGEgPSBpdGVtO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInNlbGVjdFwiLCBldmVudCwgZGF0YSk7XG4gICAgfVxuICAgIHByaXZhdGUgX29uY2xpY2soZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBGYW5jeXRyZWUuRXZlbnREYXRhKSB7XG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50LnRhcmdldFtcImNsYXNzTmFtZVwiXS5zdGFydHNXaXRoKFwiTWVudUJ1dHRvblwiKSkge1xuICAgICAgICAgICAgdGhpcy5fY2FsbENvbnRleHRtZW51KGV2ZW50Lm9yaWdpbmFsRXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5ID09PSB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuOy8vb25seSBzZWxlY3Rpb25cbiAgICAgICAgZXZlbnQuZGF0YSA9IGRhdGEubm9kZS5kYXRhLml0ZW07XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC52YWx1ZSA9IGRhdGEubm9kZS5kYXRhLml0ZW07XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY2xpY2tcIiwgZXZlbnQsIGRhdGEpO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uKHZhbHVlczogYW55W10pIHtcblxuICAgICAgICB0aGlzLnRyZWUuZ2V0U2VsZWN0ZWROb2RlcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0uc2V0U2VsZWN0ZWQoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodmFsdWVzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXNbXCJfc2VsZWN0aW9uSXNXYWl0aW5nXCJdID0gdmFsdWVzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IHZhbHVlcy5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZXNbdl07XG4gICAgICAgICAgICB0aGlzLl9yZWFkTm9kZUZyb21JdGVtKGl0ZW0pLnRoZW4oKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnNldFNlbGVjdGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzW1wiX3NlbGVjdGlvbklzV2FpdGluZ1wiXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBzZWxlY3Rpb24oKTogYW55W10ge1xuICAgICAgICB2YXIgcmV0ID0gW107XG4gICAgICAgIGlmICh0aGlzW1wiX3NlbGVjdGlvbklzV2FpdGluZ1wiXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbXCJfc2VsZWN0aW9uSXNXYWl0aW5nXCJdO1xuXG4gICAgICAgIHRoaXMudHJlZS5nZXRTZWxlY3RlZE5vZGVzKCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0LnB1c2goaXRlbS5kYXRhLml0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgYXN5bmMgYWN0aXZhdGVLZXkoa2V5OiBzdHJpbmcsIHBhcmVudDogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUgPSB1bmRlZmluZWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIG5vZGUgPSBhd2FpdCB0aGlzLl9yZWFkTm9kZUZyb21LZXkoa2V5KTtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGF3YWl0IG5vZGUuc2V0QWN0aXZlKHRydWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBwcml2YXRlIGFzeW5jIGV4cGFuZExhdGVyKHByb21pc2UsIGV4cGFuZDogYm9vbGVhbiwgbm9kZTogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUsIGFsbHJlYWR5U2Vlbikge1xuICAgICAgICByZXR1cm4gdGhpcy5leHBhbmRBbGwoZXhwYW5kLCBub2RlLCBhbGxyZWFkeVNlZW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBleHBhbmQgYWxsIG5vZGVzXG4gICAgICovXG4gICAgYXN5bmMgZXhwYW5kQWxsKGV4cGFuZDogYm9vbGVhbiA9IHRydWUsIHBhcmVudDogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUgPSB1bmRlZmluZWQsIGFsbHJlYWR5U2VlbjogYW55W10gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIGlzUm9vdCA9IHBhcmVudCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgYWxsID0gW107XG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHBhcmVudCA9IHRoaXMudHJlZS5yb290Tm9kZTtcbiAgICAgICAgaWYgKGV4cGFuZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgZXhwYW5kID0gdHJ1ZTtcbiAgICAgICAgaWYgKGFsbHJlYWR5U2VlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhbGxyZWFkeVNlZW4gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJlbnQuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHBhcmVudC5jaGlsZHJlblt4XTtcbiAgICAgICAgICAgICAgICBpZiAoYWxscmVhZHlTZWVuLmluZGV4T2Yobm9kZS5kYXRhLml0ZW0pID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgYWxscmVhZHlTZWVuLnB1c2gobm9kZS5kYXRhLml0ZW0pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSB8fCBub2RlLmlzTGF6eSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbSA9IG5vZGUuc2V0RXhwYW5kZWQoZXhwYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2godGhpcy5leHBhbmRMYXRlcihwcm9tLCBleHBhbmQsIG5vZGUsIGFsbHJlYWR5U2VlbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZXhwYW5kS2V5cyhrZXlzOiBzdHJpbmdbXSkge1xuICAgICAgICB2YXIgYWxsID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwga2V5cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIG4gPSBhd2FpdCB0aGlzLl9yZWFkTm9kZUZyb21LZXkoa2V5c1t4XSk7XG4gICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgIGF3YWl0IG4uc2V0RXhwYW5kZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYWxsLnB1c2gobik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoYWxsKTtcbiAgICB9XG4gICAgcHVibGljIGdldEV4cGFuZGVkS2V5cyhwYXJlbnQ6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlID0gdW5kZWZpbmVkLCBleHBhbmRlZE5vZGVzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgaXNSb290ID0gcGFyZW50ID09PSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHBhcmVudCA9IHRoaXMudHJlZS5nZXRSb290Tm9kZSgpO1xuICAgICAgICBpZiAoZXhwYW5kZWROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBleHBhbmRlZE5vZGVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmlzRXhwYW5kZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZE5vZGVzLnB1c2gobm9kZS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEV4cGFuZGVkS2V5cyhub2RlLCBleHBhbmRlZE5vZGVzKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHBhbmRlZE5vZGVzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwYW5kTm9kZShub2RlOiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSkge1xuICAgICAgICBub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAgICAgdmFyIGxpc3QgPSBub2RlLmdldFBhcmVudExpc3QoZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxpc3QubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICghbGlzdFt4XS5pc0V4cGFuZGVkKCkpXG4gICAgICAgICAgICAgICAgYXdhaXQgbGlzdFt4XS5zZXRFeHBhbmRlZCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgX3JlYWROb2RlRnJvbUl0ZW0oaXRlbTogYW55KTogUHJvbWlzZTxGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZT4ge1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5faXRlbVRvS2V5LmdldChpdGVtKTtcbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fcmVhZEFsbEtleXNJZk5lZWRlZCgpO1xuICAgICAgICBrZXkgPSB0aGlzLl9pdGVtVG9LZXkuZ2V0KGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZE5vZGVGcm9tS2V5KGtleSk7XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgX3JlYWROb2RlRnJvbUtleShrZXk6IHN0cmluZyk6IFByb21pc2U8RmFuY3l0cmVlLkZhbmN5dHJlZU5vZGU+IHtcblxuICAgICAgICB2YXIgbmQgPSB0aGlzLnRyZWUuZ2V0Tm9kZUJ5S2V5KGtleSk7XG4gICAgICAgIGlmIChuZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHBhdGggPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGdlc2tleSA9IFwiXCI7XG4gICAgICAgICAgICBrZXk/LnNwbGl0KFwifFwiKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2Vza2V5ID0gZ2Vza2V5ICsgKGdlc2tleSA9PT0gXCJcIiA/IFwiXCIgOiBcInxcIikgKyBrO1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCIgKyBnZXNrZXk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRyZWUubG9hZEtleVBhdGgocGF0aCwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBuZCA9IHRoaXMudHJlZS5nZXROb2RlQnlLZXkoa2V5KTtcbiAgICAgICAgcmV0dXJuIG5kO1xuXG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpc1tcIl92YWx1ZUlzV2FpdGluZ1wiXSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9yZWFkTm9kZUZyb21JdGVtKHZhbHVlKS50aGVuKChub2RlKSA9PiB7XG4gICAgICAgICAgICBub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzW1wiX3ZhbHVlSXNXYWl0aW5nXCJdO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBhY3RpdmUgaXRlbVxuICAgICAqKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXNbXCJfdmFsdWVJc1dhaXRpbmdcIl0gIT09IHVuZGVmaW5lZCkvL2FzeW5jIHNldHRpbmcgXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tcIl92YWx1ZUlzV2FpdGluZ1wiXTtcbiAgICAgICAgdmFyIGggPSB0aGlzLnRyZWUuZ2V0QWN0aXZlTm9kZSgpO1xuICAgICAgICBpZiAoaCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBoLmRhdGEuaXRlbTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3luYyBfcmVhZEFsbE5vZGVzSWZOZWVkZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2FsbE5vZGVzUmVhZGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9yZWFkQWxsTm9kZXNJZk5lZWRlZCgpKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZWFkQWxsS2V5c0lmTmVlZGVkKCk7XG4gICAgICAgIHZhciBhbGxQYXRoZXMgPSBbXTtcblxuICAgICAgICB2YXIgYWxsUGF0aGVzID0gW107XG4gICAgICAgIHRoaXMuX2l0ZW1Ub0tleS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIC8vdmFyIGtleT1lbnRyeVsxXTtcbiAgICAgICAgICAgIHZhciBwYXRoID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBnZXNrZXkgPSBcIlwiO1xuICAgICAgICAgICAga2V5LnNwbGl0KFwifFwiKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2Vza2V5ID0gZ2Vza2V5ICsgKGdlc2tleSA9PT0gXCJcIiA/IFwiXCIgOiBcInxcIikgKyBrO1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCIgKyBnZXNrZXk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFsbFBhdGhlcy5wdXNoKHBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGFsbFByb21pc2U6IFtdID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsUGF0aGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIGFsbFByb21pc2UucHVzaCh0aGlzLnRyZWUubG9hZEtleVBhdGgoYWxsUGF0aGVzW2ldLCB1bmRlZmluZWQpKTtcblxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFsbFByb21pc2UpO1xuICAgICAgICB0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9IHRydWU7XG4gICAgICAgIC8vICAgIFx0YXdhaXQgUHJvbWlzZS5hbGwoYWxsUHJvbWlzZSk7XG4gICAgICAgIC8vXHRhd2FpdCB0aGlzLnRyZWUubG9hZEtleVBhdGgoYWxsUGF0aGVzLHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGdldEtleUZyb21JdGVtKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJldCA9IHRoaXMuX2l0ZW1Ub0tleS5nZXQoaXRlbSk7XG4gICAgICAgIGlmIChyZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3JlYWRBbGxLZXlzSWZOZWVkZWQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1Ub0tleS5nZXQoaXRlbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlYWQgYWxsIGtleXMgaWYgbm90IGFsbHJlYWR5IHJlYWRlZFxuICAgICAqKi9cbiAgICBwcml2YXRlIF9yZWFkQWxsS2V5c0lmTmVlZGVkKGl0ZW0gPSB1bmRlZmluZWQsIHBhdGg6IHN0cmluZyA9IHVuZGVmaW5lZCwgYWxscmVhZHlTZWVuOiBhbnlbXSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX2FsbEtleXNSZWFkZWQgPT09IHRydWUpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy50cmVlLmdldFJvb3ROb2RlKCkuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWFkQWxsS2V5c0lmTmVlZGVkKGNoaWxkLmRhdGEuaXRlbSwgXCJcIiwgW10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbHJlYWR5U2Vlbi5pbmRleE9mKGl0ZW0pID09PSAtMSlcbiAgICAgICAgICAgIGFsbHJlYWR5U2Vlbi5wdXNoKGl0ZW0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGVGcm9tSXRlbShpdGVtKS5yZXBsYWNlQWxsKFwifFwiLCBcIiFcIik7XG4gICAgICAgIHZhciBrZXkgPSBwYXRoICsgKHBhdGggPT09IFwiXCIgPyBcIlwiIDogXCJ8XCIpICsgdGl0bGU7XG4gICAgICAgIHRoaXMuX2l0ZW1Ub0tleS5zZXQoaXRlbSwga2V5KTtcblxuICAgICAgICB2YXIgY3M6IGFueVtdID0gdGhpcy5nZXRDaGlsZHNGcm9tSXRlbShpdGVtKTtcbiAgICAgICAgaWYgKGNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNzLmZvckVhY2goKGMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlYWRBbGxLZXlzSWZOZWVkZWQoYywga2V5LCBhbGxyZWFkeVNlZW4pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FsbEtleXNSZWFkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzZXQgaXRlbXModmFsdWU6IGFueSkgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2FsbEtleXNSZWFkZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2FsbE5vZGVzUmVhZGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9pdGVtVG9LZXkgPSBuZXcgTWFwKCk7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpXG4gICAgICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICAgIHZhciBhdmFsdWU6IFRyZWVOb2RlW10gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWx1ZS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgYXZhbHVlLnB1c2gobmV3IFRyZWVOb2RlKHRoaXMsIHZhbHVlW3hdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmVlLnJlbG9hZChhdmFsdWUpO1xuICAgICAgICAvKiAgICAgICAgdmFyIHJvb3Q6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlID0gJChcIiNcIiArIHRoaXMuX2lkKS5mYW5jeXRyZWUoXCJnZXRUcmVlXCIpLnJvb3ROb2RlO1xuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdFRvTm9kZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuX2FsbE5vZGVzPXt9O1xuICAgICAgICAgICAgICAgIHJvb3QuYWRkQ2hpbGRyZW4oYXZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDtqIDwgcm9vdC5jaGlsZHJlbi5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGF2YWx1ZVtqXS5mYW5jeU5vZGUgPSByb290LmNoaWxkcmVuW2pdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdFRvTm9kZS5zZXQodmFsdWVbal0sIGF2YWx1ZVtqXSk7XG4gICAgICAgICAgICAgICAgfSovXG4gICAgfVxuICAgIGdldCBpdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0Q29tcG9uZW50KF9jb21wb25lbnQ6IHsgdmFsdWU6IG51bWJlciB9KSB7IC8vdGhlIENvZGVcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gX2NvbXBvbmVudDtcbiAgICB9XG4gICAgZ2V0IHNlbGVjdENvbXBvbmVudCgpOiB7IHZhbHVlOiBudW1iZXIgfSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Q7Ly8kKHRoaXMuZG9tKS50ZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2FsbENvbnRleHRtZW51KGV2ZW50KSB7XG4gICAgICAgIHZhciB4ID0gOTtcbiAgICAgICAgLy92YXIgdHJlZT0kKGV2ZW50LnRhcmdldCkuYXR0cihcInRyZWVpZFwiKTtcbiAgICAgICAgLy90cmVlPSQoXCIjXCIrdHJlZSlbMF0uX3RoaXM7XG5cbiAgICAgICAgdmFyIG5ld2V2ZW50ID0ge1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB0YXJnZXQ6ICQoZXZlbnQudGFyZ2V0KS5wcmV2KClbMF1cblxuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51ICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5fY2FsbENvbnRleHRtZW51KG5ld2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvL2V2dC5vcmlnaW5hbEV2ZW50LmNsaWVudFl9XG4gICAgICAgIC8vXHR0cmVlLmNvbnRleHRNZW51LnNob3coZXZlbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgdGhlIGNvbnRleHRtZW51XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2dCAgdGhlIGNsaWNrIGV2ZW50IGluIHRoZSBjb250ZXh0bWVudVxuICAgICAqKi9cbiAgICBwcml2YXRlIF9wcmVwYXJlQ29udGV4dG1lbnUoZXZ0KSB7XG4gICAgICAgIC8vdmFyIG5vZGU6IFRyZWVOb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbm9kZSA9ICQudWkuZmFuY3l0cmVlLmdldE5vZGUoZXZ0LnRhcmdldCk7XG4gICAgICAgIC8vbm9kZSA9IHRoaXMuX2FsbE5vZGVzW2V2dC50YXJnZXQuaWRdO1xuICAgICAgICBpZiAodGhpcy5fY29udGV4dE1lbnUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YS5pdGVtID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHRlc3QgPSBub2RlLmRhdGEudHJlZS5zZWxlY3Rpb247XG4gICAgICAgICAgICAvL211bHRpc2VsZWN0IGFuZCB0aGUgY2xpY2tlZCBpcyB3aXRoaW4gdGhlIHNlbGVjdGlvblxuICAgICAgICAgICAgaWYgKHRlc3QgIT09IHVuZGVmaW5lZCAmJiB0ZXN0LmluZGV4T2Yobm9kZS5kYXRhLml0ZW0pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRleHRNZW51LnZhbHVlID0gdGVzdDtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRleHRNZW51LnZhbHVlID0gW25vZGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IG5vZGUuZGF0YS5pdGVtXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXQgY29udGV4dE1lbnUodmFsdWUpIHtcbiAgICAgICAgc3VwZXIuY29udGV4dE1lbnUgPSB2YWx1ZTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFsdWUub25iZWZvcmVzaG93KGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIF90aGlzLl9wcmVwYXJlQ29udGV4dG1lbnUoZXZ0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBjb250ZXh0TWVudSgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbnRleHRNZW51O1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9pdGVtcyA9IHVuZGVmaW5lZDtcblxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG5cbiAgICB9XG5cbn1cblxuY2xhc3MgVHJlZU5vZGUge1xuICAgIHRyZWU6IFRyZWU7XG4gICAgX2lkOiBzdHJpbmc7XG4gICAgaXRlbTtcbiAgICBpY29uOiBzdHJpbmc7XG4gICAgY2hpbGRyZW46IFRyZWVOb2RlW107XG4gICAgcGFyZW50OiBUcmVlTm9kZTtcbiAgICBmYW5jeU5vZGU6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlO1xuICAgIGtleTogc3RyaW5nO1xuICAgIGxhenk6IGJvb2xlYW47XG5cbiAgICAvL29wdGlvbnMuc291cmNlPVsgeyB0aXRsZTogJ0ZvbGRlciBpbiBob21lIGZvbGRlcicsIGtleTogJ2ZBMTAwJywgZm9sZGVyOiB0cnVlLCBsYXp5OiB0cnVlIH1dO1xuXG4gICAgY29uc3RydWN0b3IodHJlZSwgaXRlbSwgcGFyZW50OiBUcmVlTm9kZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5faWQgPSByZWdpc3RyeS5uZXh0SUQoKTtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy50cmVlLmdldFRpdGxlRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgdGhpcy5rZXkgPSAocGFyZW50ICE9PSB1bmRlZmluZWQgPyBwYXJlbnQua2V5ICsgXCJ8XCIgOiBcIlwiKSArICh0aXRsZSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHRpdGxlKS5yZXBsYWNlQWxsKFwifFwiLCBcIiFcIik7XG4gICAgICAgIHRoaXMudHJlZS5faXRlbVRvS2V5LnNldChpdGVtLCB0aGlzLmtleSk7XG4gICAgICAgIHRoaXMuaWNvbiA9IHRoaXMudHJlZS5nZXRJY29uRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgdmFyIGNzID0gdGhpcy50cmVlLmdldENoaWxkc0Zyb21JdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkICYmIGNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubGF6eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBwcml2YXRlIGdldFN0eWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLnRyZWUuZ2V0U3R5bGVGcm9tSXRlbSh0aGlzLml0ZW0pO1xuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiX2NsYXNzbmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3S2V5ID0ga2V5LnJlcGxhY2VBbGwoXCJfXCIsIFwiLVwiKTtcblxuICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiXFx0XFx0XCIgKyBuZXdLZXkgKyBcIjpcIiArICg8c3RyaW5nPnN0eWxlW2tleV0pICsgXCI7XFxuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZ2V0IHRpdGxlKCkge1xuICAgICAgICB2YXIgcmV0ID0gdGhpcy50cmVlLmdldFRpdGxlRnJvbUl0ZW0odGhpcy5pdGVtKTtcblxuICAgICAgICB2YXIgYnQgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy50cmVlLmNvbnRleHRNZW51ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBidCA9IFwiPHNwYW4gY2xhc3M9J01lbnVCdXR0b24gbWVudSBtZGkgbWRpLW1lbnUtZG93bicgaWQ9OTAwICB0cmVlaWQ9XCIgKyB0aGlzLnRyZWUuX2lkICsgXCIgIGhlaWdodD0nMTAnIHdpZHRoPScxMCcgb25jbGljaz0nLypqYXNzaWpzLnVpLlRyZWUuX2NhbGxDb250ZXh0bWVudShldmVudCk7Ki8nPlwiO1xuICAgICAgICAvL3ByZXZlbnQgWFNTXG4gICAgICAgIHJldCA9IChyZXQgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiByZXQpLnJlcGxhY2VBbGwoXCI8XCIsIFwiJmx0XCIpLnJlcGxhY2VBbGwoXCI+XCIsIFwiJmd0XCIpO1xuICAgICAgICByZXQgPSBcIjxzcGFuIGlkPVwiICsgdGhpcy5faWQgKyBcIiBzdHlsZT0nXCIgKyB0aGlzLmdldFN0eWxlKCkgKyBcIicgID5cIiArIHJldCArIFwiPC9zcGFuPlwiO1xuICAgICAgICByZXR1cm4gcmV0ICsgYnQ7XG4gICAgfVxuICAgIHN0YXRpYyBsb2FkQ2hpbGRzKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHZhciBub2RlOiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSA9IGRhdGEubm9kZTtcbiAgICAgICAgdmFyIGRlZmVycmVkUmVzdWx0ID0galF1ZXJ5LkRlZmVycmVkKCk7XG4gICAgICAgIHZhciB0cmVlID0gZGF0YS5ub2RlLmRhdGEudHJlZTtcbiAgICAgICAgdmFyIF90aGlzID0gZGF0YS5ub2RlO1xuICAgICAgICB2YXIgY3MgPSB0cmVlLmdldENoaWxkc0Zyb21JdGVtKGRhdGEubm9kZS5kYXRhLml0ZW0pO1xuICAgICAgICB2YXIgY2hpbGRzOiBUcmVlTm9kZVtdID0gW107XG4gICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkICYmIGNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY3MubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbmQgPSBuZXcgVHJlZU5vZGUodHJlZSwgY3NbeF0sIF90aGlzKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5yZXN1bHQgPSBjaGlsZHM7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgLyogICAgICAgIGZhbmN5bm9kZS5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICAgICAgICAgIGZhbmN5bm9kZS5hZGRDaGlsZHJlbihjaGlsZHMpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwO2ogPCBmYW5jeW5vZGUuY2hpbGRyZW4ubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHNbal0uZmFuY3lOb2RlID0gZmFuY3lub2RlLmNoaWxkcmVuW2pdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWUub2JqZWN0VG9Ob2RlLnNldChjc1tqXSwgY2hpbGRzW2pdKTtcbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuX2R1bW15O1xuICAgIH1cbiAgICAvKiBwb3B1bGF0ZShmYW5jeW5vZGU6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlKSB7XG4gICAgICAgICB2YXIgY3MgPSB0aGlzLnRyZWUuZ2V0Q2hpbGRzRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgIHZhciBjaGlsZHM6IFRyZWVOb2RlW10gPSBbXTtcbiAgICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkICYmIGNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDt4IDwgY3MubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgICB2YXIgbmQgPSBuZXcgVHJlZU5vZGUodGhpcy50cmVlLCBjc1t4XSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKG5kKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgICBmYW5jeW5vZGUucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgIGZhbmN5bm9kZS5hZGRDaGlsZHJlbihjaGlsZHMpO1xuICAgICAgICAgZm9yICh2YXIgaiA9IDA7aiA8IGZhbmN5bm9kZS5jaGlsZHJlbi5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgICAgY2hpbGRzW2pdLmZhbmN5Tm9kZSA9IGZhbmN5bm9kZS5jaGlsZHJlbltqXTtcbiAgICAgICAgICAgICB0aGlzLnRyZWUub2JqZWN0VG9Ob2RlLnNldChjc1tqXSwgY2hpbGRzW2pdKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGRlbGV0ZSB0aGlzLl9kdW1teTtcbiAgICAgICAgIC8vcmV0dXJuIHJldDtcbiAgICAgfSovXG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgdHJlZSA9IG5ldyBUcmVlKCk7XG4gICAgXG4gICAgdmFyIHM6IGFueSA9IHsgbmFtZTogXCJTYW5zYVwiLCBpZDogMSwgc3R5bGU6IHsgY29sb3I6IFwiYmx1ZVwiIH0gfTtcbiAgICB2YXIgcCA9IHsgbmFtZTogXCJQZXRlclwiLCBpZDogMiB9O1xuICAgIHZhciB1ID0geyBuYW1lOiBcIlV3ZVwiLCBpZDogMywgY2hpbGRzOiBbcCwgc10gfTtcbiAgICB2YXIgdCA9IHsgbmFtZTogXCJUb21cIiwgaWQ6IDUgfTtcbiAgICB2YXIgYyA9IHsgbmFtZTogXCJDaHJpc3RvcGhcIiwgaWQ6IDQsIGNoaWxkczogW3UsIHRdIH07XG4gICAgcy5jaGlsZHMgPSBbY107XG4gICAgdHJlZS5jb25maWcoe1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgIC8vIGNoZWNrYm94OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHByb3BEaXNwbGF5OiBcIm5hbWVcIixcbiAgICAgICAgcHJvcENoaWxkczogXCJjaGlsZHNcIixcbiAgICAgICAgcHJvcFN0eWxlOiBcInN0eWxlXCIsXG4gICAgICAgIGl0ZW1zOiBbY10sXG4gICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgaGVpZ2h0OiBcIjEwMHB4XCIsXG4gICAgICAgIG9uY2xpY2s6ZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0IFwiICsgZGF0YS5kYXRhLm5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3Rpb24gOiBbcCwgc10sXG4gICAgICAgIHZhbHVlIDogcFxuICAgIH0pO1xuICAgIHRyZWUub25zZWxlY3QoKCk9PntcbiAgICAgICAgY29uc29sZS5sb2codHJlZS5zZWxlY3Rpb24pO1xuICAgIH0pO1xuICAgIC8qdHJlZS5wcm9wSWNvbiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEubmFtZSA9PT0gXCJVd2VcIilcbiAgICAgICAgICAgIHJldHVybiBcInJlcy9jYXIuaWNvXCI7XG4gICAgfTsqL1xuXG5cbiAgICAvLyAgdHJlZS5fcmVhZEFsbEtleXNJZk5lZWRlZCgpO1xuXG4gICBcbiAgICAvL1x0YXdhaXQgdHJlZS50cmVlLmxvYWRLZXlQYXRoKFtcIi9DaHJpc3RvcGgvQ2hyaXN0b3BofFV3ZS9DaHJpc3RvcGh8VXdlfFBldGVyXCJdLHVuZGVmaW5lZCk7XG4gICAgLy9cdFx0dmFyIGg9dHJlZS50cmVlLmdldE5vZGVCeUtleShcIkNocmlzdG9waHxVd2V8UGV0ZXJcIik7XG4gICAgLy9cdFx0dHJlZS50cmVlLmFjdGl2YXRlS2V5KFwiQ2hyaXN0b3BofFV3ZXxQZXRlclwiKTtcblxuXG4gICAgLy9bXCJDaHJpc3RvcGhcIixcIkNocmlzdG9waC9Vd2UvVG9tMVwiXSwoKT0+e30pO1xuICAgIC8vXHRub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAvLyB2YXIgaiA9IHRyZWUudmFsdWU7XG4gICAgd2luZG93LnNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIHZhciBrID0gdHJlZS5zZWxlY3Rpb247XG5cbiAgICAgICAgLy9cdFx0dmFyIG5vZD10cmVlLnRyZWUuZ2V0Tm9kZUJ5S2V5KFwiQ2hyaXN0b3BoL1V3ZS9Ub20xXCIpO1xuICAgICAgICAvLyBhd2FpdCB0cmVlLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgLy8gYXdhaXQgdHJlZS5leHBhbmRBbGwoZmFsc2UpO1xuICAgICAgICAvL1x0dmFyIG5vZGU9dHJlZS50cmVlLmdldE5vZGVCeUtleShcIkNocmlzdG9waC9Vd2UvUGV0ZXJcIik7XG5cbiAgICAgICAgLy9cdG5vZGUuc2V0QWN0aXZlKHRydWUpO1xuICAgICAgICAvL2F3YWl0IHRyZWUuZXhwYW5kQWxsKCk7XG4gICAgICAgIC8vIHRyZWUudmFsdWUgPSBwO1xuICAgICAgICAvL3RyZWUuZXhwYW5kQWxsKGZhbHNlKTtcbiAgICAgICAgLy8gdHJlZS52YWx1ZSA9IHA7XG4gICAgICAgIC8vdmFyIGs9dHJlZS5nZXRFeHBhbmRlZEtleXMoKTtcbiAgICAgICAgLy8gdHJlZS5leHBhbmRLZXlzKGspO1xuICAgICAgICAvKiB0cmVlLmV4cGFuZEFsbCgpO1xuICAgICAgICAgdHJlZS52YWx1ZSA9IHA7XG4gICAgICAgICB2YXIgbD10cmVlLnZhbHVlOyovXG5cbiAgICAgICAgLy8gIHZhciBqID0gdHJlZS52YWx1ZTtcbiAgICAgICAgLy8gYWxlcnQodHJlZS52YWx1ZS5uYW1lKTtcbiAgICB9LCA0MDAwKTtcbiAgICAvLyAgICBcdCQodHJlZS5fX2RvbSkuZGlhbG9nKCk7XG4gICAgcmV0dXJuIHRyZWU7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19