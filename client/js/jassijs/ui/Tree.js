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
            if (item === undefined)
                return undefined;
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
            if (item === undefined)
                return undefined;
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
            if (item === undefined)
                return undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvVHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQVdBOzs7O09BSUc7SUFHSCxJQUFNLHlCQUF5QixHQUEvQixNQUFNLHlCQUF5QjtLQUc5QixDQUFBO0lBREc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFFLENBQUM7OzJEQUMvRjtJQUZaLHlCQUF5QjtRQUQ5QixJQUFBLGNBQU0sRUFBQyxzQ0FBc0MsQ0FBQztPQUN6Qyx5QkFBeUIsQ0FHOUI7SUFFRCxJQUFNLG9CQUFvQixHQUExQixNQUFNLG9CQUFvQjtLQU96QixDQUFBO0lBTEc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLCtCQUErQixFQUFFLENBQUM7OzREQUMzRTtJQUVwQjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLG9DQUFvQyxFQUFFLENBQUM7OzBEQUM5RDtJQUVuQjtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLHNDQUFzQyxFQUFFLENBQUM7a0NBQzNFLHlCQUF5Qjt1REFBQztJQU5oQyxvQkFBb0I7UUFEekIsSUFBQSxjQUFNLEVBQUMsaUNBQWlDLENBQUM7T0FDcEMsb0JBQW9CLENBT3pCO0lBeURELElBQWEsSUFBSTtJQUxqQjs7OztNQUlFO0lBQ0YsTUFBYSxJQUFLLFNBQVEscUJBQVM7UUFhL0IsWUFBWSxPQUFvQztZQUM1QyxL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LHNCQUFzQjtRQUN0QixNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBRXpCLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFFdkIseURBQXlEO1lBQ3pELDhCQUE4QjtZQUM5QiwrQkFBK0I7WUFDL0IsMERBQTBEO1lBRTFELHdCQUF3QjtZQUN4Qix5QkFBeUI7WUFDekIsa0JBQWtCO1lBQ2xCLHdCQUF3QjtZQUN4QixrQkFBa0I7WUFDbEIsK0JBQStCO1lBQy9CLHNCQUFzQjtZQUN0Qjs7Z0NBRW9CO1lBRXBCLHVCQUF1QjtZQUN2QiwwQkFBMEI7UUFDOUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ1QsOEJBQThCO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUF0RUQsb0JBc0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiamFzc2lqcy9leHQvZmFuY3l0cmVlXCI7XG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IENvbXBvbmVudCwgJFVJQ29tcG9uZW50LCBDb21wb25lbnRDb25maWcgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcbmltcG9ydCB7IENvbXBvbmVudERlc2NyaXB0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnREZXNjcmlwdG9yXCI7XG5pbXBvcnQgcmVnaXN0cnkgZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5cblxuaW1wb3J0IGV4dGVuc2lvbnMgZnJvbSBcImphc3NpanMvYmFzZS9FeHRlbnNpb25zXCI7XG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgU3R5bGUgfSBmcm9tIFwiamFzc2lqcy91aS9TdHlsZVwiO1xuaW1wb3J0IHsgQ1NTUHJvcGVydGllcyB9IGZyb20gXCJqYXNzaWpzL3VpL0NTU1Byb3BlcnRpZXNcIjtcbi8qZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBKUXVlcnkge1xuICAgICAgICBmYW5jeXRyZWU6IGFueTtcbiAgICB9XG59Ki9cblxuQCRDbGFzcyhcImphc3NpanMudWkuVHJlZUVkaXRvclByb3BlcnRpZXNNdWx0aVwiKVxuY2xhc3MgVHJlZUVkaXRvclByb3BlcnRpZXNNdWx0aSB7XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IFwiXCIsIGNob29zZUZyb206IFtcIlwiLCBcInNhbWVQYXJlbnRcIiwgXCJzYW1lTGV2ZWxcIl0sIGRlc2NyaXB0aW9uOiBcIm11bHRpIHNlbGVjdGlvbiBtb2RlXCIgfSlcbiAgICBtb2RlPzogc3RyaW5nO1xufVxuQCRDbGFzcyhcImphc3NpanMudWkuVHJlZUVkaXRvclByb3BlcnRpZXNcIilcbmNsYXNzIFRyZWVFZGl0b3JQcm9wZXJ0aWVzIHtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogMywgY2hvb3NlRnJvbTogWzEsIDIsIDNdLCBkZXNjcmlwdGlvbjogXCIxPXNpbmdsZSAyPW11bHRpIDM9bXVsdGlfaGllclwiIH0pXG4gICAgc2VsZWN0TW9kZT86IG51bWJlcjtcbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogZmFsc2UsIGRlc2NyaXB0aW9uOiBcImRpc3BsYXkgYSBjaGVja2JveCBiZWZvcmUgdGhlIG5vZGVcIiB9KVxuICAgIGNoZWNrYm94PzogYm9vbGVhbjtcbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJqc29uXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2lqcy51aS5UcmVlRWRpdG9yUHJvcGVydGllc011bHRpXCIgfSlcbiAgICBtdWx0aT86IFRyZWVFZGl0b3JQcm9wZXJ0aWVzTXVsdGk7XG59XG5leHBvcnQgaW50ZXJmYWNlIFRyZWVDb25maWcgZXh0ZW5kcyBDb21wb25lbnRDb25maWcge1xuICAgIG9wdGlvbnM/OiBGYW5jeXRyZWUuRmFuY3l0cmVlT3B0aW9ucztcbiAgICAvKipcbiAgICAqIEBtZW1iZXIgLSBnZXQgdGhlIHByb3BlcnR5IGZvciB0aGUgZGlzcGxheSBvZiB0aGUgaXRlbSBvciBhbiBmdW5jdGlvbiB0byBnZXQgdGhlIGRpc3BsYXkgZnJvbSBhbiBpdGVtXG4gICAgKi9cbiAgICBwcm9wU3R5bGU/OiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBDU1NQcm9wZXJ0aWVzIH07XG4gICAgLyoqXG4gICAgICogQG1lbWJlciAtIGdldCB0aGUgcHJvcGVydHkgZm9yIHRoZSBkaXNwbGF5IG9mIHRoZSBpdGVtIG9yIGFuIGZ1bmN0aW9uIHRvIGdldCB0aGUgZGlzcGxheSBmcm9tIGFuIGl0ZW1cbiAgICAgKi9cbiAgICBwcm9wRGlzcGxheT86IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IHN0cmluZyB9O1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIgLSBnZXQgdGhlIGljb25wcm9wZXJ0eSBvZiB0aGUgaXRlbSBvciBhbiBmdW5jdGlvbiB0byBnZXQgdGhlIGljb24gZnJvbSBhbiBpdGVtXG4gICAgICovXG4gICAgcHJvcEljb24/OiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBzdHJpbmcgfVxuICAgIC8qKlxuICAgICogQG1lbWJlciAtIGdldCB0aGUgY2hpbGRzIG9mIHRoZSBpdGVtIG9yIGFuIGZ1bmN0aW9uIHRvIGdldCB0aGUgY2hpbGRzIGZyb20gYW4gaXRlbVxuICAgICovXG4gICAgcHJvcENoaWxkcz86IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IGFueVtdIH07XG5cbiAgICBvbnNlbGVjdD8oaGFuZGxlcik7XG5cbiAgICAvKipcbiAgICAgKiByZWdpc3RlciBhbiBldmVudCBpZiBhbiBpdGVtIGlzIGNsaWNrZWRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIG9uIGNsaWNrXG4gICAgICovXG4gICAgb25jbGljaz8oaGFuZGxlcjogKGV2ZW50PzogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE/OiBGYW5jeXRyZWUuRXZlbnREYXRhKSA9PiB2b2lkKTtcbiAgICAvKipcbiAgICAqIHNlbGVjdHMgaXRlbXNcbiAgICAqL1xuICAgIHNlbGVjdGlvbj86IGFueVtdO1xuICAgIC8qKlxuICAgICAqIHNldCB0aGUgYWN0aXZlIGl0ZW1cbiAgICAgKi9cbiAgICB2YWx1ZT87XG4gICAgLyoqXG4gICAgKiBAcGFyYW0gdmFsdWUgLSBzZXQgdGhlIGRhdGEgdG8gc2hvdyBpbiBUcmVlXG4gICAgKiovXG4gICAgaXRlbXM/OiBhbnk7XG4gICAgLyoqXG4gICAgICogaWYgdGhlIHZhbHVlIGlzIGNoYW5nZWQgdGhlbiB0aGUgdmFsdWUgb2YgX2NvbXBvbmVudCBpcyBhbHNvIGNoYW5nZWQgKF9jb21wb25lbnQudmFsdWUpXG4gICAgICovXG4gICAgc2VsZWN0Q29tcG9uZW50PzogeyB2YWx1ZTogbnVtYmVyIH07XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7amFzc2lqcy51aS5Db250ZXh0TWVudX0gLSB0aGUgY29udGV4dG1lbnUgb2YgdGhlIGNvbXBvbmVudFxuICAgICAqKi9cbiAgICBjb250ZXh0TWVudT87XG59XG5cbkAkVUlDb21wb25lbnQoeyBmdWxsUGF0aDogXCJjb21tb24vVHJlZVwiLCBpY29uOiBcIm1kaSBtZGktZmlsZS10cmVlXCIgfSlcbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlRyZWVcIilcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ld1wiLCB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzLnVpLlRyZWVFZGl0b3JQcm9wZXJ0aWVzXCIgfSlcbi8qQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3L3NlbGVjdE1vZGVcIiwgdHlwZTogXCJudW1iZXJcIiwgZGVmYXVsdDogMywgY2hvb3NlRnJvbTogWzEsIDIsIDNdLCBkZXNjcmlwdGlvbjogXCIxPXNpbmdsZSAyPW11bHRpIDM9bXVsdGlfaGllclwiIH0pXG5AJFByb3BlcnR5KHsgbmFtZTogXCJuZXcvY2hlY2tib3hcIiwgdHlwZTogXCJib29sZWFuXCIsIGRlZmF1bHQ6IGZhbHNlLCBkZXNjcmlwdGlvbjogXCJkZXNwbGF5IGEgY2hlY2tib3MgYmVmb3JlIHRoZSBub2RlXCIgfSlcbkAkUHJvcGVydHkoeyBuYW1lOiBcIm5ldy9tdWx0aVwiLCB0eXBlOiBcImpzb25cIiB9KVxuQCRQcm9wZXJ0eSh7IG5hbWU6IFwibmV3L211bHRpL21vZGVcIiwgdHlwZTogXCJzdHJpbmdcIiwgZGVmYXVsdDogXCJcIiwgY2hvb3NlRnJvbTogW1wiXCIsIFwic2FtZVBhcmVudFwiLCBcInNhbWVMZXZlbFwiXSwgZGVzY3JpcHRpb246IFwibXVsdGkgc2VsZWN0aW9uIG1vZGVcIiB9KVxuKi9cbmV4cG9ydCBjbGFzcyBUcmVlIGV4dGVuZHMgQ29tcG9uZW50IGltcGxlbWVudHMgVHJlZUNvbmZpZyB7XG4gICAgX3Byb3BEaXNwbGF5OiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBzdHJpbmcgfTtcbiAgICBfcHJvcEljb246IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IHN0cmluZyB9O1xuICAgIF9wcm9wQ2hpbGRzOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBhbnlbXSB9O1xuICAgIF9wcm9wU3R5bGU6IHN0cmluZyB8IHsgKGl0ZW06IGFueSk6IENTU1Byb3BlcnRpZXMgfTtcbiAgICBfc2VsZWN0OiB7IHZhbHVlOiBudW1iZXIgfTtcbiAgICB0cmVlOiBGYW5jeXRyZWUuRmFuY3l0cmVlO1xuICAgIF9pc0luaXRlZDogYm9vbGVhbjtcbiAgICBfaXRlbVRvS2V5OiBNYXA8YW55LCBzdHJpbmc+O1xuICAgIHByaXZhdGUgX2l0ZW1zO1xuICAgIHByaXZhdGUgX2FsbEtleXNSZWFkZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfYWxsTm9kZXNSZWFkZWQ6IGJvb2xlYW47XG4gICAgX2xhc3RPcHRpb25zOiBGYW5jeXRyZWUuRmFuY3l0cmVlT3B0aW9ucztcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogRmFuY3l0cmVlLkZhbmN5dHJlZU9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgc3VwZXIuaW5pdCgkKCc8ZGl2IGNsYXNzPVwiVHJlZVwiPjwvZGl2PicpWzBdKTtcbiAgICAgICAgdGhpcy5faXRlbVRvS2V5ID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICBjb25maWcoY29uZmlnOiBUcmVlQ29uZmlnKTogVHJlZSB7XG4gICAgICAgIHN1cGVyLmNvbmZpZyhjb25maWcpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBAJFByb3BlcnR5KHsgdHlwZTogXCJqc29uXCIsIGNvbXBvbmVudFR5cGU6IFwiamFzc2lqcy51aS5UYWJsZUVkaXRvclByb3BlcnRpZXNcIiB9KVxuICAgIHNldCBvcHRpb25zKG9wdGlvbnM6IEZhbmN5dHJlZS5GYW5jeXRyZWVPcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuX2xhc3RPcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgaWYgKHRoaXMudHJlZSkge1xuICAgICAgICAgICAgdmFyIGxhc3RTZWwgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgdmFyIGxhc3RJdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgICAgICAvL3RoaXMudGFibGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgLy90aGlzLnRhYmxlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICAvL0RlZmF1bHQgT3B0aW9uc1xuXG5cbiAgICAgICAgaWYgKG9wdGlvbnMuZXh0ZW5zaW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBvcHRpb25zLmV4dGVuc2lvbnMgPSBbXCJmaWx0ZXJcIiwgXCJtdWx0aVwiLCBcImRuZFwiXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zLmluZGV4T2YoXCJmaWx0ZXJcIikgPT09IC0xKVxuICAgICAgICAgICAgb3B0aW9ucy5leHRlbnNpb25zLnB1c2goXCJmaWx0ZXJcIik7XG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMuaW5kZXhPZihcIm11bHRpXCIpID09PSAtMSlcbiAgICAgICAgICAgIG9wdGlvbnMuZXh0ZW5zaW9ucy5wdXNoKFwibXVsdGlcIik7XG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMuaW5kZXhPZihcImRuZFwiKSA9PT0gLTEpXG4gICAgICAgICAgICBvcHRpb25zLmV4dGVuc2lvbnMucHVzaChcImRuZFwiKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsdGVyID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBvcHRpb25zLmZpbHRlciA9IHt9O1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXIubW9kZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgb3B0aW9ucy5maWx0ZXIubW9kZSA9IFwiaGlkZVwiO1xuICAgICAgICBpZiAob3B0aW9ucy5maWx0ZXIuYXV0b0V4cGFuZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgb3B0aW9ucy5maWx0ZXIuYXV0b0V4cGFuZCA9IHRydWU7XG5cbiAgICAgICAgdmFyIGJlZm9yZUV4cGFuZCA9IG9wdGlvbnMuYmVmb3JlRXhwYW5kO1xuICAgICAgICB2YXIgc2VsZWN0ID0gb3B0aW9ucy5zZWxlY3Q7XG4gICAgICAgIHZhciBjbGljayA9IG9wdGlvbnMuY2xpY2s7XG4gICAgICAgIG9wdGlvbnMuc291cmNlID0gW3sgdGl0bGU6ICdGb2xkZXIgaW4gaG9tZSBmb2xkZXInLCBrZXk6ICdmQTEwMCcsIGZvbGRlcjogdHJ1ZSwgbGF6eTogdHJ1ZSB9XTtcbiAgICAgICAgb3B0aW9ucy5pY29uID0gZmFsc2U7Ly93ZSBoYXZlIGFuIG93blxuICAgICAgICBvcHRpb25zLmxhenlMb2FkID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICBUcmVlTm9kZS5sb2FkQ2hpbGRzKGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5zZWxlY3QgPSBmdW5jdGlvbiAoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBGYW5jeXRyZWUuRXZlbnREYXRhKSB7XG4gICAgICAgICAgICBfdGhpcy5fb25zZWxlY3QoZXZlbnQsIGRhdGEpO1xuICAgICAgICAgICAgaWYgKHNlbGVjdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHNlbGVjdChldmVudCwgZGF0YSk7XG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMuY2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBGYW5jeXRyZWUuRXZlbnREYXRhKSB7XG4gICAgICAgICAgICBfdGhpcy5fb25jbGljayhldmVudCwgZGF0YSk7XG4gICAgICAgICAgICBpZiAoY2xpY2sgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpY2soZXZlbnQsIGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICQoXCIjXCIgKyB0aGlzLl9pZCkuZmFuY3l0cmVlKG9wdGlvbnMpO1xuICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgdGhpcy50cmVlID0gJC51aS5mYW5jeXRyZWUuZ2V0VHJlZShcIiNcIiArIHRoaXMuX2lkKTtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2lkKS5maW5kKFwidWxcIikuY3NzKFwiaGVpZ2h0XCIsIFwiY2FsYygxMDAlIC0gOHB4KVwiKTtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2lkKS5maW5kKFwidWxcIikuY3NzKFwid2VpZ2h0XCIsIFwiY2FsYygxMDAlIC0gOHB4KVwiKTtcbiAgICAgICAgJChcIiNcIiArIHRoaXMuX2lkKS5maW5kKFwidWxcIikuY3NzKFwib3ZlcmZsb3dcIiwgXCJhdXRvXCIpO1xuICAgICAgICBpZiAobGFzdEl0ZW1zKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gbGFzdEl0ZW1zO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0U2VsKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbGFzdFNlbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgb3B0aW9ucygpOiBGYW5jeXRyZWUuRmFuY3l0cmVlT3B0aW9ucyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXN0T3B0aW9ucztcbiAgICB9XG4gICAgLyoqXG4gICAgKiBAbWVtYmVyIC0gZ2V0IHRoZSBwcm9wZXJ0eSBmb3IgdGhlIGRpc3BsYXkgb2YgdGhlIGl0ZW0gb3IgYW4gZnVuY3Rpb24gdG8gZ2V0IHRoZSBkaXNwbGF5IGZyb20gYW4gaXRlbVxuICAgICovXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIsIGRlc2NyaXB0aW9uOiBcInRoZSBwcm9wZXJ0eSBjYWxsZWQgdG8gZ2V0IHRoZSBzdHlsZSBvZiB0aGUgaXRlbVwiIH0pXG4gICAgc2V0IHByb3BTdHlsZSh2YWx1ZTogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogQ1NTUHJvcGVydGllcyB9KSB7XG4gICAgICAgIHRoaXMuX3Byb3BTdHlsZSA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgcHJvcFN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcFN0eWxlO1xuICAgIH1cblxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiLCBkZXNjcmlwdGlvbjogXCJ0aGUgcHJvcGVydHkgY2FsbGVkIHRvIGdldCB0aGUgbmFtZSBvZiB0aGUgaXRlbVwiIH0pXG4gICAgc2V0IHByb3BEaXNwbGF5KHZhbHVlOiBzdHJpbmcgfCB7IChpdGVtOiBhbnkpOiBzdHJpbmcgfSkge1xuICAgICAgICB0aGlzLl9wcm9wRGlzcGxheSA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgcHJvcERpc3BsYXkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wRGlzcGxheTtcbiAgICB9XG5cbiAgICBzZXQgcHJvcEljb24oaWNvbjogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogc3RyaW5nIH0pIHtcbiAgICAgICAgdGhpcy5fcHJvcEljb24gPSBpY29uO1xuICAgIH1cbiAgICBnZXQgcHJvcEljb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9wSWNvbjtcbiAgICB9XG5cbiAgICBzZXQgcHJvcENoaWxkcyhjaGlsZDogc3RyaW5nIHwgeyAoaXRlbTogYW55KTogYW55W10gfSkge1xuICAgICAgICB0aGlzLl9wcm9wQ2hpbGRzID0gY2hpbGQ7XG4gICAgfVxuICAgIGdldCBwcm9wQ2hpbGRzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJvcENoaWxkcztcbiAgICB9XG4gICAgXG4gICAgb25zZWxlY3QoaGFuZGxlcikge1xuICAgICAgICB0aGlzLmFkZEV2ZW50KFwic2VsZWN0XCIsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBAJFByb3BlcnR5KHsgZGVmYXVsdDogXCJmdW5jdGlvbihldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LyosIGRhdGE/OkZhbmN5dHJlZS5FdmVudERhdGEqLyl7XFxuXFx0XFxufVwiIH0pXG4gICAgb25jbGljayhoYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YT86IEZhbmN5dHJlZS5FdmVudERhdGEpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5hZGRFdmVudChcImNsaWNrXCIsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIGZpbHRlcih0ZXh0OiBzdHJpbmcpIHtcbiAgICAgICAgLy8gdGhpcy5leHBhbmRBbGwoKTtcbiAgICAgICAgdGhpcy5fcmVhZEFsbE5vZGVzSWZOZWVkZWQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0ZXh0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmVlLmNsZWFyRmlsdGVyKCk7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5leHBhbmRBbGwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgdGhpcy50cmVlLmZpbHRlck5vZGVzKHRleHQsIHsgbGVhdmVzT25seTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICogZ2V0IHRpdGxlIGZyb20gbm9kZVxuICAgICovXG4gICAgZ2V0VGl0bGVGcm9tSXRlbShpdGVtKSB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BEaXNwbGF5KSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICByZXQgPSB0aGlzLnByb3BEaXNwbGF5KGl0ZW0pO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldCA9IGl0ZW1bdGhpcy5wcm9wRGlzcGxheV07XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxuICAgIC8qKlxuICAgKiBnZXQgdGl0bGUgZnJvbSBub2RlXG4gICAqL1xuICAgIGdldFN0eWxlRnJvbUl0ZW0oaXRlbSk6IENTU1Byb3BlcnRpZXMge1xuICAgICAgICB2YXIgcmV0O1xuICAgICAgICBpZihpdGVtPT09dW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5wcm9wU3R5bGUpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldCA9IHRoaXMucHJvcFN0eWxlKGl0ZW0pO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIHJldCA9IGl0ZW1bdGhpcy5wcm9wU3R5bGVdO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cbiAgICAvKipcbiAgICAqIGdldCBpY29uIGZyb20gbm9kZVxuICAgICovXG4gICAgZ2V0SWNvbkZyb21JdGVtKGl0ZW0pIHtcbiAgICAgICAgIGlmKGl0ZW09PT11bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodGhpcy5wcm9wSWNvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BJY29uKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcEljb24oaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbVt0aGlzLnByb3BJY29uXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAqIGdldCBjaGlsZHMgZnJvbSBub2RlXG4gICAgKi9cbiAgICBnZXRDaGlsZHNGcm9tSXRlbShpdGVtKSB7XG4gICAgICAgIHZhciBjcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgIGlmKGl0ZW09PT11bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBpZiAodHlwZW9mICh0aGlzLnByb3BDaGlsZHMpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNzID0gdGhpcy5wcm9wQ2hpbGRzKGl0ZW0pO1xuICAgICAgICB9IGVsc2VcbiAgICAgICAgICAgIGNzID0gaXRlbVt0aGlzLnByb3BDaGlsZHNdO1xuICAgICAgICByZXR1cm4gY3M7XG4gICAgfVxuXG5cbiAgICAvKnByaXZhdGUgZ2V0VHJlZU5vZGVGcm9tSWQoaWQ6c3RyaW5nKTpUcmVlTm9kZXtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIGZvcih2YXIgZW50ciBvZiB0aGlzLm9iamVjdFRvTm9kZSl7XG4gICAgICAgICAgICBpZihlbnRyWzFdLl9pZD09PWlkKVxuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyWzFdO1xuICAgICAgICAgICAgLy9lbnRyaWVzLnJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0qL1xuICAgIHByaXZhdGUgX29uc2VsZWN0KGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHZhciBpdGVtID0gdGhpcy5faXRlbVRvS2V5LmdldChkYXRhLm5vZGUuZGF0YSk7XG4gICAgICAgIGV2ZW50LmRhdGEgPSBpdGVtO1xuICAgICAgICB0aGlzLmNhbGxFdmVudChcInNlbGVjdFwiLCBldmVudCwgZGF0YSk7XG4gICAgfVxuICAgIHByaXZhdGUgX29uY2xpY2soZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBGYW5jeXRyZWUuRXZlbnREYXRhKSB7XG4gICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50LnRhcmdldFtcImNsYXNzTmFtZVwiXS5zdGFydHNXaXRoKFwiTWVudUJ1dHRvblwiKSkge1xuICAgICAgICAgICAgdGhpcy5fY2FsbENvbnRleHRtZW51KGV2ZW50Lm9yaWdpbmFsRXZlbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5jdHJsS2V5ID09PSB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuOy8vb25seSBzZWxlY3Rpb25cbiAgICAgICAgZXZlbnQuZGF0YSA9IGRhdGEubm9kZS5kYXRhLml0ZW07XG4gICAgICAgIGlmICh0aGlzLl9zZWxlY3QgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdC52YWx1ZSA9IGRhdGEubm9kZS5kYXRhLml0ZW07XG4gICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiY2xpY2tcIiwgZXZlbnQsIGRhdGEpO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0aW9uKHZhbHVlczogYW55W10pIHtcblxuICAgICAgICB0aGlzLnRyZWUuZ2V0U2VsZWN0ZWROb2RlcygpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGl0ZW0uc2V0U2VsZWN0ZWQoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodmFsdWVzID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXNbXCJfc2VsZWN0aW9uSXNXYWl0aW5nXCJdID0gdmFsdWVzO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IHZhbHVlcy5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZXNbdl07XG4gICAgICAgICAgICB0aGlzLl9yZWFkTm9kZUZyb21JdGVtKGl0ZW0pLnRoZW4oKG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICBub2RlLnNldFNlbGVjdGVkKHRydWUpO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzW1wiX3NlbGVjdGlvbklzV2FpdGluZ1wiXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBzZWxlY3Rpb24oKTogYW55W10ge1xuICAgICAgICB2YXIgcmV0ID0gW107XG4gICAgICAgIGlmICh0aGlzW1wiX3NlbGVjdGlvbklzV2FpdGluZ1wiXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXNbXCJfc2VsZWN0aW9uSXNXYWl0aW5nXCJdO1xuXG4gICAgICAgIHRoaXMudHJlZS5nZXRTZWxlY3RlZE5vZGVzKCkuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0LnB1c2goaXRlbS5kYXRhLml0ZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgYXN5bmMgYWN0aXZhdGVLZXkoa2V5OiBzdHJpbmcsIHBhcmVudDogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUgPSB1bmRlZmluZWQpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdmFyIG5vZGUgPSBhd2FpdCB0aGlzLl9yZWFkTm9kZUZyb21LZXkoa2V5KTtcbiAgICAgICAgaWYgKG5vZGUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGF3YWl0IG5vZGUuc2V0QWN0aXZlKHRydWUpO1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBwcml2YXRlIGFzeW5jIGV4cGFuZExhdGVyKHByb21pc2UsIGV4cGFuZDogYm9vbGVhbiwgbm9kZTogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUsIGFsbHJlYWR5U2Vlbikge1xuICAgICAgICByZXR1cm4gdGhpcy5leHBhbmRBbGwoZXhwYW5kLCBub2RlLCBhbGxyZWFkeVNlZW4pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBleHBhbmQgYWxsIG5vZGVzXG4gICAgICovXG4gICAgYXN5bmMgZXhwYW5kQWxsKGV4cGFuZDogYm9vbGVhbiA9IHRydWUsIHBhcmVudDogRmFuY3l0cmVlLkZhbmN5dHJlZU5vZGUgPSB1bmRlZmluZWQsIGFsbHJlYWR5U2VlbjogYW55W10gPSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIGlzUm9vdCA9IHBhcmVudCA9PT0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgYWxsID0gW107XG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHBhcmVudCA9IHRoaXMudHJlZS5yb290Tm9kZTtcbiAgICAgICAgaWYgKGV4cGFuZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgZXhwYW5kID0gdHJ1ZTtcbiAgICAgICAgaWYgKGFsbHJlYWR5U2VlbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhbGxyZWFkeVNlZW4gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJlbnQuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IHBhcmVudC5jaGlsZHJlblt4XTtcbiAgICAgICAgICAgICAgICBpZiAoYWxscmVhZHlTZWVuLmluZGV4T2Yobm9kZS5kYXRhLml0ZW0pID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgYWxscmVhZHlTZWVuLnB1c2gobm9kZS5kYXRhLml0ZW0pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaGFzQ2hpbGRyZW4oKSB8fCBub2RlLmlzTGF6eSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHJvbSA9IG5vZGUuc2V0RXhwYW5kZWQoZXhwYW5kKTtcbiAgICAgICAgICAgICAgICAgICAgYWxsLnB1c2godGhpcy5leHBhbmRMYXRlcihwcm9tLCBleHBhbmQsIG5vZGUsIGFsbHJlYWR5U2VlbikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgZXhwYW5kS2V5cyhrZXlzOiBzdHJpbmdbXSkge1xuICAgICAgICB2YXIgYWxsID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwga2V5cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIG4gPSBhd2FpdCB0aGlzLl9yZWFkTm9kZUZyb21LZXkoa2V5c1t4XSk7XG4gICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgIGF3YWl0IG4uc2V0RXhwYW5kZWQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgYWxsLnB1c2gobik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoYWxsKTtcbiAgICB9XG4gICAgcHVibGljIGdldEV4cGFuZGVkS2V5cyhwYXJlbnQ6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlID0gdW5kZWZpbmVkLCBleHBhbmRlZE5vZGVzOiBzdHJpbmdbXSA9IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgaXNSb290ID0gcGFyZW50ID09PSB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChwYXJlbnQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHBhcmVudCA9IHRoaXMudHJlZS5nZXRSb290Tm9kZSgpO1xuICAgICAgICBpZiAoZXhwYW5kZWROb2RlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBleHBhbmRlZE5vZGVzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhcmVudC5oYXNDaGlsZHJlbigpKSB7XG4gICAgICAgICAgICBwYXJlbnQuY2hpbGRyZW4uZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmlzRXhwYW5kZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBleHBhbmRlZE5vZGVzLnB1c2gobm9kZS5rZXkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdldEV4cGFuZGVkS2V5cyhub2RlLCBleHBhbmRlZE5vZGVzKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBleHBhbmRlZE5vZGVzO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgZXhwYW5kTm9kZShub2RlOiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSkge1xuICAgICAgICBub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAgICAgdmFyIGxpc3QgPSBub2RlLmdldFBhcmVudExpc3QoZmFsc2UsIGZhbHNlKTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxpc3QubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmICghbGlzdFt4XS5pc0V4cGFuZGVkKCkpXG4gICAgICAgICAgICAgICAgYXdhaXQgbGlzdFt4XS5zZXRFeHBhbmRlZCh0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgX3JlYWROb2RlRnJvbUl0ZW0oaXRlbTogYW55KTogUHJvbWlzZTxGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZT4ge1xuICAgICAgICB2YXIga2V5ID0gdGhpcy5faXRlbVRvS2V5LmdldChpdGVtKTtcbiAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdGhpcy5fcmVhZEFsbEtleXNJZk5lZWRlZCgpO1xuICAgICAgICBrZXkgPSB0aGlzLl9pdGVtVG9LZXkuZ2V0KGl0ZW0pO1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVhZE5vZGVGcm9tS2V5KGtleSk7XG4gICAgfVxuICAgIHByaXZhdGUgYXN5bmMgX3JlYWROb2RlRnJvbUtleShrZXk6IHN0cmluZyk6IFByb21pc2U8RmFuY3l0cmVlLkZhbmN5dHJlZU5vZGU+IHtcblxuICAgICAgICB2YXIgbmQgPSB0aGlzLnRyZWUuZ2V0Tm9kZUJ5S2V5KGtleSk7XG4gICAgICAgIGlmIChuZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHBhdGggPSBcIlwiO1xuICAgICAgICAgICAgdmFyIGdlc2tleSA9IFwiXCI7XG4gICAgICAgICAgICBrZXk/LnNwbGl0KFwifFwiKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2Vza2V5ID0gZ2Vza2V5ICsgKGdlc2tleSA9PT0gXCJcIiA/IFwiXCIgOiBcInxcIikgKyBrO1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCIgKyBnZXNrZXk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnRyZWUubG9hZEtleVBhdGgocGF0aCwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBuZCA9IHRoaXMudHJlZS5nZXROb2RlQnlLZXkoa2V5KTtcbiAgICAgICAgcmV0dXJuIG5kO1xuXG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpc1tcIl92YWx1ZUlzV2FpdGluZ1wiXSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9yZWFkTm9kZUZyb21JdGVtKHZhbHVlKS50aGVuKChub2RlKSA9PiB7XG4gICAgICAgICAgICBub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzW1wiX3ZhbHVlSXNXYWl0aW5nXCJdO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBhY3RpdmUgaXRlbVxuICAgICAqKi9cbiAgICBnZXQgdmFsdWUoKTogYW55IHtcbiAgICAgICAgaWYgKHRoaXNbXCJfdmFsdWVJc1dhaXRpbmdcIl0gIT09IHVuZGVmaW5lZCkvL2FzeW5jIHNldHRpbmcgXG4gICAgICAgICAgICByZXR1cm4gdGhpc1tcIl92YWx1ZUlzV2FpdGluZ1wiXTtcbiAgICAgICAgdmFyIGggPSB0aGlzLnRyZWUuZ2V0QWN0aXZlTm9kZSgpO1xuICAgICAgICBpZiAoaCA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBoLmRhdGEuaXRlbTtcbiAgICB9XG4gICAgcHJpdmF0ZSBhc3luYyBfcmVhZEFsbE5vZGVzSWZOZWVkZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuX2FsbE5vZGVzUmVhZGVkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzLl9yZWFkQWxsTm9kZXNJZk5lZWRlZCgpKTtcbiAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9yZWFkQWxsS2V5c0lmTmVlZGVkKCk7XG4gICAgICAgIHZhciBhbGxQYXRoZXMgPSBbXTtcblxuICAgICAgICB2YXIgYWxsUGF0aGVzID0gW107XG4gICAgICAgIHRoaXMuX2l0ZW1Ub0tleS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIC8vdmFyIGtleT1lbnRyeVsxXTtcbiAgICAgICAgICAgIHZhciBwYXRoID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBnZXNrZXkgPSBcIlwiO1xuICAgICAgICAgICAga2V5LnNwbGl0KFwifFwiKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICAgICAgICAgICAgZ2Vza2V5ID0gZ2Vza2V5ICsgKGdlc2tleSA9PT0gXCJcIiA/IFwiXCIgOiBcInxcIikgKyBrO1xuICAgICAgICAgICAgICAgIHBhdGggPSBwYXRoICsgXCIvXCIgKyBnZXNrZXk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFsbFBhdGhlcy5wdXNoKHBhdGgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGFsbFByb21pc2U6IFtdID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsUGF0aGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIGFsbFByb21pc2UucHVzaCh0aGlzLnRyZWUubG9hZEtleVBhdGgoYWxsUGF0aGVzW2ldLCB1bmRlZmluZWQpKTtcblxuICAgICAgICB9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGFsbFByb21pc2UpO1xuICAgICAgICB0aGlzLl9hbGxOb2Rlc1JlYWRlZCA9IHRydWU7XG4gICAgICAgIC8vICAgIFx0YXdhaXQgUHJvbWlzZS5hbGwoYWxsUHJvbWlzZSk7XG4gICAgICAgIC8vXHRhd2FpdCB0aGlzLnRyZWUubG9hZEtleVBhdGgoYWxsUGF0aGVzLHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIGdldEtleUZyb21JdGVtKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJldCA9IHRoaXMuX2l0ZW1Ub0tleS5nZXQoaXRlbSk7XG4gICAgICAgIGlmIChyZXQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHRoaXMuX3JlYWRBbGxLZXlzSWZOZWVkZWQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1Ub0tleS5nZXQoaXRlbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHJlYWQgYWxsIGtleXMgaWYgbm90IGFsbHJlYWR5IHJlYWRlZFxuICAgICAqKi9cbiAgICBwcml2YXRlIF9yZWFkQWxsS2V5c0lmTmVlZGVkKGl0ZW0gPSB1bmRlZmluZWQsIHBhdGg6IHN0cmluZyA9IHVuZGVmaW5lZCwgYWxscmVhZHlTZWVuOiBhbnlbXSA9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuX2FsbEtleXNSZWFkZWQgPT09IHRydWUpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy50cmVlLmdldFJvb3ROb2RlKCkuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWFkQWxsS2V5c0lmTmVlZGVkKGNoaWxkLmRhdGEuaXRlbSwgXCJcIiwgW10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbHJlYWR5U2Vlbi5pbmRleE9mKGl0ZW0pID09PSAtMSlcbiAgICAgICAgICAgIGFsbHJlYWR5U2Vlbi5wdXNoKGl0ZW0pO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciB0aXRsZSA9IHRoaXMuZ2V0VGl0bGVGcm9tSXRlbShpdGVtKS5yZXBsYWNlQWxsKFwifFwiLCBcIiFcIik7XG4gICAgICAgIHZhciBrZXkgPSBwYXRoICsgKHBhdGggPT09IFwiXCIgPyBcIlwiIDogXCJ8XCIpICsgdGl0bGU7XG4gICAgICAgIHRoaXMuX2l0ZW1Ub0tleS5zZXQoaXRlbSwga2V5KTtcblxuICAgICAgICB2YXIgY3M6IGFueVtdID0gdGhpcy5nZXRDaGlsZHNGcm9tSXRlbShpdGVtKTtcbiAgICAgICAgaWYgKGNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNzLmZvckVhY2goKGMgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlYWRBbGxLZXlzSWZOZWVkZWQoYywga2V5LCBhbGxyZWFkeVNlZW4pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2FsbEtleXNSZWFkZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzZXQgaXRlbXModmFsdWU6IGFueSkgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuX2l0ZW1zID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2FsbEtleXNSZWFkZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX2FsbE5vZGVzUmVhZGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9pdGVtVG9LZXkgPSBuZXcgTWFwKCk7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpXG4gICAgICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICAgIHZhciBhdmFsdWU6IFRyZWVOb2RlW10gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWx1ZS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgYXZhbHVlLnB1c2gobmV3IFRyZWVOb2RlKHRoaXMsIHZhbHVlW3hdKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50cmVlLnJlbG9hZChhdmFsdWUpO1xuICAgICAgICAvKiAgICAgICAgdmFyIHJvb3Q6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlID0gJChcIiNcIiArIHRoaXMuX2lkKS5mYW5jeXRyZWUoXCJnZXRUcmVlXCIpLnJvb3ROb2RlO1xuICAgICAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLm9iamVjdFRvTm9kZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAvL3RoaXMuX2FsbE5vZGVzPXt9O1xuICAgICAgICAgICAgICAgIHJvb3QuYWRkQ2hpbGRyZW4oYXZhbHVlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDtqIDwgcm9vdC5jaGlsZHJlbi5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGF2YWx1ZVtqXS5mYW5jeU5vZGUgPSByb290LmNoaWxkcmVuW2pdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9iamVjdFRvTm9kZS5zZXQodmFsdWVbal0sIGF2YWx1ZVtqXSk7XG4gICAgICAgICAgICAgICAgfSovXG4gICAgfVxuICAgIGdldCBpdGVtcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgIH1cbiAgICBzZXQgc2VsZWN0Q29tcG9uZW50KF9jb21wb25lbnQ6IHsgdmFsdWU6IG51bWJlciB9KSB7IC8vdGhlIENvZGVcbiAgICAgICAgdGhpcy5fc2VsZWN0ID0gX2NvbXBvbmVudDtcbiAgICB9XG4gICAgZ2V0IHNlbGVjdENvbXBvbmVudCgpOiB7IHZhbHVlOiBudW1iZXIgfSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3Q7Ly8kKHRoaXMuZG9tKS50ZXh0KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfY2FsbENvbnRleHRtZW51KGV2ZW50KSB7XG4gICAgICAgIHZhciB4ID0gOTtcbiAgICAgICAgLy92YXIgdHJlZT0kKGV2ZW50LnRhcmdldCkuYXR0cihcInRyZWVpZFwiKTtcbiAgICAgICAgLy90cmVlPSQoXCIjXCIrdHJlZSlbMF0uX3RoaXM7XG5cbiAgICAgICAgdmFyIG5ld2V2ZW50ID0ge1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB0YXJnZXQ6ICQoZXZlbnQudGFyZ2V0KS5wcmV2KClbMF1cblxuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRleHRNZW51ICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5fY2FsbENvbnRleHRtZW51KG5ld2V2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICAvL2V2dC5vcmlnaW5hbEV2ZW50LmNsaWVudFl9XG4gICAgICAgIC8vXHR0cmVlLmNvbnRleHRNZW51LnNob3coZXZlbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjcmVhdGUgdGhlIGNvbnRleHRtZW51XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGV2dCAgdGhlIGNsaWNrIGV2ZW50IGluIHRoZSBjb250ZXh0bWVudVxuICAgICAqKi9cbiAgICBwcml2YXRlIF9wcmVwYXJlQ29udGV4dG1lbnUoZXZ0KSB7XG4gICAgICAgIC8vdmFyIG5vZGU6IFRyZWVOb2RlID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbm9kZSA9ICQudWkuZmFuY3l0cmVlLmdldE5vZGUoZXZ0LnRhcmdldCk7XG4gICAgICAgIC8vbm9kZSA9IHRoaXMuX2FsbE5vZGVzW2V2dC50YXJnZXQuaWRdO1xuICAgICAgICBpZiAodGhpcy5fY29udGV4dE1lbnUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKG5vZGUuZGF0YS5pdGVtID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIHRlc3QgPSBub2RlLmRhdGEudHJlZS5zZWxlY3Rpb247XG4gICAgICAgICAgICAvL211bHRpc2VsZWN0IGFuZCB0aGUgY2xpY2tlZCBpcyB3aXRoaW4gdGhlIHNlbGVjdGlvblxuICAgICAgICAgICAgaWYgKHRlc3QgIT09IHVuZGVmaW5lZCAmJiB0ZXN0LmluZGV4T2Yobm9kZS5kYXRhLml0ZW0pICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRleHRNZW51LnZhbHVlID0gdGVzdDtcbiAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRleHRNZW51LnZhbHVlID0gW25vZGUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IG5vZGUuZGF0YS5pdGVtXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzZXQgY29udGV4dE1lbnUodmFsdWUpIHtcbiAgICAgICAgc3VwZXIuY29udGV4dE1lbnUgPSB2YWx1ZTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFsdWUub25iZWZvcmVzaG93KGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIF90aGlzLl9wcmVwYXJlQ29udGV4dG1lbnUoZXZ0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGdldCBjb250ZXh0TWVudSgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbnRleHRNZW51O1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9pdGVtcyA9IHVuZGVmaW5lZDtcblxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG5cbiAgICB9XG5cbn1cblxuY2xhc3MgVHJlZU5vZGUge1xuICAgIHRyZWU6IFRyZWU7XG4gICAgX2lkOiBzdHJpbmc7XG4gICAgaXRlbTtcbiAgICBpY29uOiBzdHJpbmc7XG4gICAgY2hpbGRyZW46IFRyZWVOb2RlW107XG4gICAgcGFyZW50OiBUcmVlTm9kZTtcbiAgICBmYW5jeU5vZGU6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlO1xuICAgIGtleTogc3RyaW5nO1xuICAgIGxhenk6IGJvb2xlYW47XG5cbiAgICAvL29wdGlvbnMuc291cmNlPVsgeyB0aXRsZTogJ0ZvbGRlciBpbiBob21lIGZvbGRlcicsIGtleTogJ2ZBMTAwJywgZm9sZGVyOiB0cnVlLCBsYXp5OiB0cnVlIH1dO1xuXG4gICAgY29uc3RydWN0b3IodHJlZSwgaXRlbSwgcGFyZW50OiBUcmVlTm9kZSA9IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRyZWUgPSB0cmVlO1xuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5faWQgPSByZWdpc3RyeS5uZXh0SUQoKTtcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcbiAgICAgICAgdmFyIHRpdGxlID0gdGhpcy50cmVlLmdldFRpdGxlRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgdGhpcy5rZXkgPSAocGFyZW50ICE9PSB1bmRlZmluZWQgPyBwYXJlbnQua2V5ICsgXCJ8XCIgOiBcIlwiKSArICh0aXRsZSA9PT0gdW5kZWZpbmVkID8gXCJcIiA6IHRpdGxlKS5yZXBsYWNlQWxsKFwifFwiLCBcIiFcIik7XG4gICAgICAgIHRoaXMudHJlZS5faXRlbVRvS2V5LnNldChpdGVtLCB0aGlzLmtleSk7XG4gICAgICAgIHRoaXMuaWNvbiA9IHRoaXMudHJlZS5nZXRJY29uRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgdmFyIGNzID0gdGhpcy50cmVlLmdldENoaWxkc0Zyb21JdGVtKHRoaXMuaXRlbSk7XG4gICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkICYmIGNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubGF6eSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBwcml2YXRlIGdldFN0eWxlKCk6IHN0cmluZyB7XG4gICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLnRyZWUuZ2V0U3R5bGVGcm9tSXRlbSh0aGlzLml0ZW0pO1xuICAgICAgICBpZiAoc3R5bGUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBzdHlsZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09IFwiX2NsYXNzbmFtZVwiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3S2V5ID0ga2V5LnJlcGxhY2VBbGwoXCJfXCIsIFwiLVwiKTtcblxuICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiXFx0XFx0XCIgKyBuZXdLZXkgKyBcIjpcIiArICg8c3RyaW5nPnN0eWxlW2tleV0pICsgXCI7XFxuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gICAgZ2V0IHRpdGxlKCkge1xuICAgICAgICB2YXIgcmV0ID0gdGhpcy50cmVlLmdldFRpdGxlRnJvbUl0ZW0odGhpcy5pdGVtKTtcblxuICAgICAgICB2YXIgYnQgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy50cmVlLmNvbnRleHRNZW51ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBidCA9IFwiPHNwYW4gY2xhc3M9J01lbnVCdXR0b24gbWVudSBtZGkgbWRpLW1lbnUtZG93bicgaWQ9OTAwICB0cmVlaWQ9XCIgKyB0aGlzLnRyZWUuX2lkICsgXCIgIGhlaWdodD0nMTAnIHdpZHRoPScxMCcgb25jbGljaz0nLypqYXNzaWpzLnVpLlRyZWUuX2NhbGxDb250ZXh0bWVudShldmVudCk7Ki8nPlwiO1xuICAgICAgICAvL3ByZXZlbnQgWFNTXG4gICAgICAgIHJldCA9IChyZXQgPT09IHVuZGVmaW5lZCA/IFwiXCIgOiByZXQpLnJlcGxhY2VBbGwoXCI8XCIsIFwiJmx0XCIpLnJlcGxhY2VBbGwoXCI+XCIsIFwiJmd0XCIpO1xuICAgICAgICByZXQgPSBcIjxzcGFuIGlkPVwiICsgdGhpcy5faWQgKyBcIiBzdHlsZT0nXCIgKyB0aGlzLmdldFN0eWxlKCkgKyBcIicgID5cIiArIHJldCArIFwiPC9zcGFuPlwiO1xuICAgICAgICByZXR1cm4gcmV0ICsgYnQ7XG4gICAgfVxuICAgIHN0YXRpYyBsb2FkQ2hpbGRzKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHZhciBub2RlOiBGYW5jeXRyZWUuRmFuY3l0cmVlTm9kZSA9IGRhdGEubm9kZTtcbiAgICAgICAgdmFyIGRlZmVycmVkUmVzdWx0ID0galF1ZXJ5LkRlZmVycmVkKCk7XG4gICAgICAgIHZhciB0cmVlID0gZGF0YS5ub2RlLmRhdGEudHJlZTtcbiAgICAgICAgdmFyIF90aGlzID0gZGF0YS5ub2RlO1xuICAgICAgICB2YXIgY3MgPSB0cmVlLmdldENoaWxkc0Zyb21JdGVtKGRhdGEubm9kZS5kYXRhLml0ZW0pO1xuICAgICAgICB2YXIgY2hpbGRzOiBUcmVlTm9kZVtdID0gW107XG4gICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkICYmIGNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY3MubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgbmQgPSBuZXcgVHJlZU5vZGUodHJlZSwgY3NbeF0sIF90aGlzKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChuZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGF0YS5yZXN1bHQgPSBjaGlsZHM7XG4gICAgICAgIHJldHVybjtcbiAgICAgICAgLyogICAgICAgIGZhbmN5bm9kZS5yZW1vdmVDaGlsZHJlbigpO1xuICAgICAgICAgICAgICAgIGZhbmN5bm9kZS5hZGRDaGlsZHJlbihjaGlsZHMpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwO2ogPCBmYW5jeW5vZGUuY2hpbGRyZW4ubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICAgICAgICBjaGlsZHNbal0uZmFuY3lOb2RlID0gZmFuY3lub2RlLmNoaWxkcmVuW2pdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWUub2JqZWN0VG9Ob2RlLnNldChjc1tqXSwgY2hpbGRzW2pdKTtcbiAgICAgICAgICAgICAgICB9Ki9cbiAgICAgICAgLy8gZGVsZXRlIHRoaXMuX2R1bW15O1xuICAgIH1cbiAgICAvKiBwb3B1bGF0ZShmYW5jeW5vZGU6IEZhbmN5dHJlZS5GYW5jeXRyZWVOb2RlKSB7XG4gICAgICAgICB2YXIgY3MgPSB0aGlzLnRyZWUuZ2V0Q2hpbGRzRnJvbUl0ZW0odGhpcy5pdGVtKTtcbiAgICAgICAgIHZhciBjaGlsZHM6IFRyZWVOb2RlW10gPSBbXTtcbiAgICAgICAgIGlmIChjcyAhPT0gdW5kZWZpbmVkICYmIGNzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDt4IDwgY3MubGVuZ3RoO3grKykge1xuICAgICAgICAgICAgICAgICB2YXIgbmQgPSBuZXcgVHJlZU5vZGUodGhpcy50cmVlLCBjc1t4XSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKG5kKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgICBmYW5jeW5vZGUucmVtb3ZlQ2hpbGRyZW4oKTtcbiAgICAgICAgIGZhbmN5bm9kZS5hZGRDaGlsZHJlbihjaGlsZHMpO1xuICAgICAgICAgZm9yICh2YXIgaiA9IDA7aiA8IGZhbmN5bm9kZS5jaGlsZHJlbi5sZW5ndGg7aisrKSB7XG4gICAgICAgICAgICAgY2hpbGRzW2pdLmZhbmN5Tm9kZSA9IGZhbmN5bm9kZS5jaGlsZHJlbltqXTtcbiAgICAgICAgICAgICB0aGlzLnRyZWUub2JqZWN0VG9Ob2RlLnNldChjc1tqXSwgY2hpbGRzW2pdKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGRlbGV0ZSB0aGlzLl9kdW1teTtcbiAgICAgICAgIC8vcmV0dXJuIHJldDtcbiAgICAgfSovXG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgdHJlZSA9IG5ldyBUcmVlKCk7XG4gICAgXG4gICAgdmFyIHM6IGFueSA9IHsgbmFtZTogXCJTYW5zYVwiLCBpZDogMSwgc3R5bGU6IHsgY29sb3I6IFwiYmx1ZVwiIH0gfTtcbiAgICB2YXIgcCA9IHsgbmFtZTogXCJQZXRlclwiLCBpZDogMiB9O1xuICAgIHZhciB1ID0geyBuYW1lOiBcIlV3ZVwiLCBpZDogMywgY2hpbGRzOiBbcCwgc10gfTtcbiAgICB2YXIgdCA9IHsgbmFtZTogXCJUb21cIiwgaWQ6IDUgfTtcbiAgICB2YXIgYyA9IHsgbmFtZTogXCJDaHJpc3RvcGhcIiwgaWQ6IDQsIGNoaWxkczogW3UsIHRdIH07XG4gICAgcy5jaGlsZHMgPSBbY107XG4gICAgdHJlZS5jb25maWcoe1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgIC8vIGNoZWNrYm94OiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHByb3BEaXNwbGF5OiBcIm5hbWVcIixcbiAgICAgICAgcHJvcENoaWxkczogXCJjaGlsZHNcIixcbiAgICAgICAgcHJvcFN0eWxlOiBcInN0eWxlXCIsXG4gICAgICAgIGl0ZW1zOiBbY10sXG4gICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgaGVpZ2h0OiBcIjEwMHB4XCIsXG4gICAgICAgIG9uY2xpY2s6ZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2VsZWN0IFwiICsgZGF0YS5kYXRhLm5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3Rpb24gOiBbcCwgc10sXG4gICAgICAgIHZhbHVlIDogcFxuICAgIH0pO1xuICAgIHRyZWUub25zZWxlY3QoKCk9PntcbiAgICAgICAgY29uc29sZS5sb2codHJlZS5zZWxlY3Rpb24pO1xuICAgIH0pO1xuICAgIC8qdHJlZS5wcm9wSWNvbiA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEubmFtZSA9PT0gXCJVd2VcIilcbiAgICAgICAgICAgIHJldHVybiBcInJlcy9jYXIuaWNvXCI7XG4gICAgfTsqL1xuXG5cbiAgICAvLyAgdHJlZS5fcmVhZEFsbEtleXNJZk5lZWRlZCgpO1xuXG4gICBcbiAgICAvL1x0YXdhaXQgdHJlZS50cmVlLmxvYWRLZXlQYXRoKFtcIi9DaHJpc3RvcGgvQ2hyaXN0b3BofFV3ZS9DaHJpc3RvcGh8VXdlfFBldGVyXCJdLHVuZGVmaW5lZCk7XG4gICAgLy9cdFx0dmFyIGg9dHJlZS50cmVlLmdldE5vZGVCeUtleShcIkNocmlzdG9waHxVd2V8UGV0ZXJcIik7XG4gICAgLy9cdFx0dHJlZS50cmVlLmFjdGl2YXRlS2V5KFwiQ2hyaXN0b3BofFV3ZXxQZXRlclwiKTtcblxuXG4gICAgLy9bXCJDaHJpc3RvcGhcIixcIkNocmlzdG9waC9Vd2UvVG9tMVwiXSwoKT0+e30pO1xuICAgIC8vXHRub2RlLnNldEFjdGl2ZSh0cnVlKTtcbiAgICAvLyB2YXIgaiA9IHRyZWUudmFsdWU7XG4gICAgd2luZG93LnNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuXG4gICAgICAgIHZhciBrID0gdHJlZS5zZWxlY3Rpb247XG5cbiAgICAgICAgLy9cdFx0dmFyIG5vZD10cmVlLnRyZWUuZ2V0Tm9kZUJ5S2V5KFwiQ2hyaXN0b3BoL1V3ZS9Ub20xXCIpO1xuICAgICAgICAvLyBhd2FpdCB0cmVlLmV4cGFuZEFsbCh0cnVlKTtcbiAgICAgICAgLy8gYXdhaXQgdHJlZS5leHBhbmRBbGwoZmFsc2UpO1xuICAgICAgICAvL1x0dmFyIG5vZGU9dHJlZS50cmVlLmdldE5vZGVCeUtleShcIkNocmlzdG9waC9Vd2UvUGV0ZXJcIik7XG5cbiAgICAgICAgLy9cdG5vZGUuc2V0QWN0aXZlKHRydWUpO1xuICAgICAgICAvL2F3YWl0IHRyZWUuZXhwYW5kQWxsKCk7XG4gICAgICAgIC8vIHRyZWUudmFsdWUgPSBwO1xuICAgICAgICAvL3RyZWUuZXhwYW5kQWxsKGZhbHNlKTtcbiAgICAgICAgLy8gdHJlZS52YWx1ZSA9IHA7XG4gICAgICAgIC8vdmFyIGs9dHJlZS5nZXRFeHBhbmRlZEtleXMoKTtcbiAgICAgICAgLy8gdHJlZS5leHBhbmRLZXlzKGspO1xuICAgICAgICAvKiB0cmVlLmV4cGFuZEFsbCgpO1xuICAgICAgICAgdHJlZS52YWx1ZSA9IHA7XG4gICAgICAgICB2YXIgbD10cmVlLnZhbHVlOyovXG5cbiAgICAgICAgLy8gIHZhciBqID0gdHJlZS52YWx1ZTtcbiAgICAgICAgLy8gYWxlcnQodHJlZS52YWx1ZS5uYW1lKTtcbiAgICB9LCA0MDAwKTtcbiAgICAvLyAgICBcdCQodHJlZS5fX2RvbSkuZGlhbG9nKCk7XG4gICAgcmV0dXJuIHRyZWU7XG59XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuIl19