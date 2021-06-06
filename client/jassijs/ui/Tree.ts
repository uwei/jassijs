import "jassijs/ext/fancytree";
import { $Class } from "jassijs/remote/Jassi";
import { Component, $UIComponent } from "jassijs/ui/Component";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import registry from "jassijs/remote/Registry";


import extensions from "jassijs/base/Extensions";
import { $Property } from "jassijs/ui/Property";
import { Style } from "jassijs/ui/Style";
import { CSSProperties } from "jassijs/ui/CSSProperties";
/*declare global {
    interface JQuery {
        fancytree: any;
    }
}*/

@$Class("jassijs.ui.TreeEditorPropertiesMulti")
class TreeEditorPropertiesMulti {
    @$Property({ default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
    mode?: string;
}
@$Class("jassijs.ui.TreeEditorProperties")
class TreeEditorProperties {
    @$Property({ default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
    selectMode?: number;
    @$Property({ default: false, description: "display a checkbox before the node" })
    checkbox?: boolean;
    @$Property({ type: "json", componentType: "jassijs.ui.TreeEditorPropertiesMulti" })
    multi?: TreeEditorPropertiesMulti;
}

@$UIComponent({ fullPath: "common/Tree", icon: "mdi mdi-file-tree" })
@$Class("jassijs.ui.Tree")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.TreeEditorProperties" })
/*@$Property({ name: "new/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
@$Property({ name: "new/checkbox", type: "boolean", default: false, description: "desplay a checkbos before the node" })
@$Property({ name: "new/multi", type: "json" })
@$Property({ name: "new/multi/mode", type: "string", default: "", chooseFrom: ["", "sameParent", "sameLevel"], description: "multi selection mode" })
*/
export class Tree extends Component {
    _propDisplay: string | { (item: any): string };
    _propIcon: string | { (item: any): string };
    _propChilds: string | { (item: any): any[] };
    _propStyle: string | { (item: any): CSSProperties };
    _select: { value: number };
    tree: Fancytree.Fancytree;
    _isInited: boolean;
    _itemToKey: Map<any, string>;
    private _items;
    private _allKeysReaded: boolean;
    private _allNodesReaded: boolean;
    constructor(options?: Fancytree.FancytreeOptions) {
        super();
        super.init($('<div class="Tree"></div>')[0]);
        this._itemToKey = new Map();
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

        /* if (options.multi === undefined) {
             options.multi = {};
         }
         if (options.multi.mode === undefined) {
             options.multi.mode = "sameParent";//"","sameLevel"
         }*/

        var beforeExpand = options.beforeExpand;
        var activate = options.activate;
        var click = options.click;
        /* options.renderTitle=function (event:JQueryEventObject,data:Fancytree.EventData){
             var h=0;
         });*/
        options.source = [{ title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];
        options.icon = false;//we have an own
        options.lazyLoad = function (event, data) {
            TreeNode.loadChilds(event, data);

        };
        /* options.beforeExpand = function(event: JQueryEventObject, data: Fancytree.EventData) {
              if(data.node.children.length===1&&data.node.children[0].data.dummy===true){
                  var node2 = _this.objectToNode.get(data.node.data.item);
                      node2.populate(data.node);
              }
              if (beforeExpand !== undefined)
                  return beforeExpand(event, data);
              return true;
          };*/
        options.activate = function (event: JQueryEventObject, data: Fancytree.EventData) {
            _this._onselect(event, data);
            if (activate !== undefined)
                activate(event, data);
        };
        options.click = function (event: JQueryEventObject, data: Fancytree.EventData) {
            _this._onclick(event, data);
            if (click !== undefined)
                return click(event, data);
            return true;
        }
        $("#" + this._id).fancytree(options);
        //@ts-ignore
        this.tree = $.ui.fancytree.getTree("#" + this._id);
        $("#" + this._id).find("ul").css("height", "calc(100% - 8px)");
        $("#" + this._id).find("ul").css("weight", "calc(100% - 8px)");
        $("#" + this._id).find("ul").css("overflow", "auto");
    }
    /**
    * @member - get the property for the display of the item or an function to get the display from an item
    */
    @$Property({ type: "string", description: "the property called to get the style of the item" })
    set propStyle(value: string | { (item: any): CSSProperties }) {
        this._propStyle = value;
    }
    get propStyle() {
        return this._propStyle;
    }
    /**
     * @member - get the property for the display of the item or an function to get the display from an item
     */
    @$Property({ type: "string", description: "the property called to get the name of the item" })
    set propDisplay(value: string | { (item: any): string }) {
        this._propDisplay = value;
    }
    get propDisplay() {
        return this._propDisplay;
    }
    /**
     * @member - get the iconproperty of the item or an function to get the icon from an item
     */
    set propIcon(icon: string | { (item: any): string }) {
        this._propIcon = icon;
    }
    get propIcon() {
        return this._propIcon;
    }
    /**
    * @member - get the childs of the item or an function to get the childs from an item
    */
    set propChilds(child: string | { (item: any): any[] }) {
        this._propChilds = child;
    }
    get propChilds() {
        return this._propChilds;
    }

    onselect(handler) {
        this.addEvent("select", handler);
    }
    /**
     * register an event if an item is clicked
     * @param {function} handler - the function that is called on click
     */
    @$Property({ default: "function(event?: JQueryEventObject/*, data?:Fancytree.EventData*/){\n\t\n}" })
    onclick(handler: (event?: JQueryEventObject, data?: Fancytree.EventData) => void) {
        this.addEvent("click", handler);
    }

    filter(text: string) {
        // this.expandAll();
        this._readAllNodesIfNeeded().then(() => {
            if (text === "") {
                this.tree.clearFilter();
                // this.expandAll();
            } else {
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
        } else
            ret = item[this.propDisplay];
        return ret;
    }
    /**
   * get title from node
   */
    getStyleFromItem(item): CSSProperties {
        var ret;
        if (typeof (this.propStyle) === "function") {
            ret = this.propStyle(item);
        } else
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
            } else
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
        } else
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
    private _onselect(event, data) {
        var item = this._itemToKey.get(data.node.data);
        event.data = item;
        this.callEvent("select", event, data);
    }
    private _onclick(event: JQueryEventObject, data: Fancytree.EventData) {
        if (event.originalEvent.target["className"].startsWith("MenuButton")) {
            this._callContextmenu(event.originalEvent);
            return;
        }
        if (event.ctrlKey === true)
            return;//only selection
        event.data = data.node.data.item;
        if (this._select !== undefined)
            this._select.value = data.node.data.item;
        this.callEvent("click", event, data);
    }
    /**
     * selects items
     */
    set selection(values: any[]) {

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
    get selection(): any[] {
        var ret = [];
        if (this["_selectionIsWaiting"] !== undefined)
            return this["_selectionIsWaiting"];

        this.tree.getSelectedNodes().forEach((item) => {
            ret.push(item.data.item);
        });
        return ret;
    }
    async activateKey(key: string, parent: Fancytree.FancytreeNode = undefined): Promise<boolean> {
        var node = await this._readNodeFromKey(key);
        if (node === null)
            return false;
        await node.setActive(true);
        return true
    }
    private async expandLater(promise, expand: boolean, node: Fancytree.FancytreeNode, allreadySeen) {
        return this.expandAll(expand, node, allreadySeen);
    }
    /**
     * expand all nodes
     */
    async expandAll(expand: boolean = true, parent: Fancytree.FancytreeNode = undefined, allreadySeen: any[] = undefined) {
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
    async expandKeys(keys: string[]) {
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
    public getExpandedKeys(parent: Fancytree.FancytreeNode = undefined, expandedNodes: string[] = undefined) {
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

    private async expandNode(node: Fancytree.FancytreeNode) {
        node.setActive(true);
        var list = node.getParentList(false, false);

        for (var x = 0; x < list.length; x++) {
            if (!list[x].isExpanded())
                await list[x].setExpanded(true);
        }

    }
    private async _readNodeFromItem(item: any): Promise<Fancytree.FancytreeNode> {
        var key = this._itemToKey.get(item);
        if (key === undefined)
            this._readAllKeysIfNeeded();
        key = this._itemToKey.get(item);
        return this._readNodeFromKey(key);
    }
    private async _readNodeFromKey(key: string): Promise<Fancytree.FancytreeNode> {

        var nd = this.tree.getNodeByKey(key);
        if (nd === null) {
            var path = "";
            var geskey = "";
            key.split("|").forEach((k) => {
                geskey = geskey + (geskey === "" ? "" : "|") + k;
                path = path + "/" + geskey;
            });
            var _this = this;
            await this.tree.loadKeyPath(path, undefined);
        }
        nd = this.tree.getNodeByKey(key);
        return nd;

    }
    /**
     * set the active item
     */
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
    get value(): any {
        if (this["_valueIsWaiting"] !== undefined)//async setting 
            return this["_valueIsWaiting"];
        var h = this.tree.getActiveNode();
        if (h === null)
            return undefined;
        return h.data.item;
    }
    private async _readAllNodesIfNeeded() {
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
        var allPromise: [] = [];
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
    private _readAllKeysIfNeeded(item = undefined, path: string = undefined, allreadySeen: any[] = undefined) {
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

        var cs: any[] = this.getChildsFromItem(item);
        if (cs !== undefined) {
            cs.forEach((c => {
                this._readAllKeysIfNeeded(c, key, allreadySeen);
            }));
        }
        this._allKeysReaded = true;
    }
    /**
     * @param value - set the data to show in Tree
     **/
    set items(value: any) { //the Code
        this._items = value;
        this._allKeysReaded = undefined;
        this._allNodesReaded = undefined;
        this._itemToKey = new Map();
        if (!Array.isArray(value))
            value = [value];
        var avalue: TreeNode[] = [];
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
    /**
     * if the value is changed then the value of _component is also changed (_component.value)
     */
    set selectComponent(_component: { value: number }) { //the Code
        this._select = _component;
    }
    get selectComponent(): { value: number } {
        return this._select;//$(this.dom).text();
    }

    private _callContextmenu(event) {
        var x = 9;
        //var tree=$(event.target).attr("treeid");
        //tree=$("#"+tree)[0]._this;

        var newevent = {
            originalEvent: event,
            target: $(event.target).prev()[0]

        }
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
    private _prepareContextmenu(evt) {
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
            } else
                this._contextMenu.value = [node === undefined ? undefined : node.data.item];
        }
    }
    /**
     * @member {jassijs.ui.ContextMenu} - the contextmenu of the component
     **/
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

}

class TreeNode {
    tree: Tree;
    _id: string;
    item;
    icon: string;
    children: TreeNode[];
    parent: TreeNode;
    fancyNode: Fancytree.FancytreeNode;
    key: string;
    lazy: boolean;

    //options.source=[ { title: 'Folder in home folder', key: 'fA100', folder: true, lazy: true }];

    constructor(tree, item, parent: TreeNode = undefined) {
        this.tree = tree;
        this.parent = parent;
        this._id = registry.nextID();
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
    private getStyle(): string {
        var ret = "";
        var style = this.tree.getStyleFromItem(this.item);
        if (style) {
            for (let key in style) {
                if (key === "_classname")
                    continue;
                var newKey = key.replaceAll("_", "-");

                ret = ret + "\t\t" + newKey + ":" + (<string>style[key]) + ";\n";
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
        var node: Fancytree.FancytreeNode = data.node;
        var deferredResult = jQuery.Deferred();
        var tree = data.node.data.tree;
        var _this = data.node;
        var cs = tree.getChildsFromItem(data.node.data.item);
        var childs: TreeNode[] = [];
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
    /* populate(fancynode: Fancytree.FancytreeNode) {
         var cs = this.tree.getChildsFromItem(this.item);
         var childs: TreeNode[] = [];
         if (cs !== undefined && cs.length > 0) {
             for (var x = 0;x < cs.length;x++) {
                 var nd = new TreeNode(this.tree, cs[x], this);
                 childs.push(nd);
             }
         }
         fancynode.removeChildren();
         fancynode.addChildren(childs);
         for (var j = 0;j < fancynode.children.length;j++) {
             childs[j].fancyNode = fancynode.children[j];
             this.tree.objectToNode.set(cs[j], childs[j]);
         }
         delete this._dummy;
         //return ret;
     }*/
};

export async function test() {
    var tree = new Tree({
        checkbox: true
    });

    var s: any = { name: "Sansa", id: 1, style: { color: "blue" } };
    var p = { name: "Peter", id: 2 };
    var u = { name: "Uwe", id: 3, childs: [p, s] };
    var t = { name: "Tom", id: 5 };
    var c = { name: "Christoph", id: 4, childs: [u, t] };
    s.childs = [c];
    tree.propDisplay = "name";
    tree.propChilds = "childs";
    tree.propStyle = "style";
    /*tree.propIcon = function(data) {
        if (data.name === "Uwe")
            return "res/car.ico";
    };*/

    tree.items = [c];
    tree.width = "100%";

    tree.height = "100px";
    //  tree._readAllKeysIfNeeded();

    tree.onclick(function (data) {
        console.log("select " + data.data.name);
    });
    tree.selection = [p, s];
    var k = tree.selection;
    tree.value = p;
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














