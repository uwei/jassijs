import {Panel} from "jassijs/ui/Panel";
import { $Class } from "jassijs/remote/Registry";
//@ts-ignore
import GoldenLayout from "jassijs/ext/goldenlayout";

import {ComponentDescriptor} from "jassijs/ui/ComponentDescriptor";
import { classes } from "jassijs/remote/Classes";
import {DockingContainer} from "jassijs/ui/DockingContainer";
import { Cookies } from "jassijs/util/Cookies";
import { Component } from "jassijs/ui/Component";




@$Class("jassijs.base.Windows")
export class Windows {
    _myLayout;
    _counter: number;
    _id: string;
    dom;
    _desktop: Panel;
    components: any[];
    inited: boolean;
    private _noRestore:any[]=[];
    /**
     * the window system -> jassijs.windows
     * @class jassijs.base.Windows
     */
    constructor() {
        this._myLayout = undefined;
        this._counter = 0;
        this._id = "jassijs.windows";
        this.dom = Component.createHTMLElement('<div class="Windows" id="' + this._id + 'jassijs.windows"/>');
        this._desktop = new Panel();
        this._desktop.maximize();
        //@member {Object.<string,lm.items.Component>} holds all known windows 
        this.components = [];
        //  this._desktop.add(new jassijs.ui.Button());
        document.body.append(this.dom);
        //formemoryleak
        this._init();
    }
    /**
     * inits the component
     */
    _init() {
        var config = {
            settings: {
                showPopoutIcon: false
            },
            content: [{
                type: 'row',
                name: 'mid',
                isClosable: false,
                content: [
                    {
                        type: 'stack',
                        name: 'center',
                        isClosable: false,
                        content: [{
                            type: 'component',
                            isClosable: false,

                            componentName: 'main',
                            componentState: {}
                        }]
                    }
            ]}]
        };

        this._myLayout = new GoldenLayout(config);

        var thisDesktop = this._desktop;
        var _this = this;
        this._myLayout.registerComponent('main', function (container, state) {
            var v = container.getElement();
            v[0].appendChild(thisDesktop.dom);//html( '<h2>' + state.text + '</h2>');
            _this.inited = true;
        });
        this._myLayout.init();

        this.restoreWindows();
		var j=this._myLayout;

    }

    /**
     * search a window
     * @param {object|undefined} parent - the parent window
     * @param {type} name - name of the window
     * @returns {object} - the founded window
     */
    _findDeep(parent, name) {
        if (parent === undefined)
            parent = this._myLayout.root;
        for (var x = 0; x < parent.contentItems.length; x++) {
            if (parent.contentItems[x].config.name === name || parent.contentItems[x].config.componentName === name)
                return parent.contentItems[x];
            var test = this._findDeep(parent.contentItems[x], name);
            if (test !== undefined)
                return test;
        }
        return undefined;
    }
    /**
     * true if there a window with that name 
     * @param {string} name
     * @returns {boolean} 
     */
    contains(name) {
        return this._myLayout._components[name] !== undefined;
    }
    /**
     * activate the window
     * @param {string} name - the neme of the window
     * @returns {objet} - the window
     */
    show(name) {
        //           var m=this._find(this._myLayout.root,name);
        var m = this.components[name];

        if (m.parent.header !== undefined)
            m.parent.header.parent.setActiveContentItem(m);
        return m;
    }
    /**
     * finds the component for the name
     * @param {string} name - the name of the window
     * @returns {jassijs.ui.Component} - the found dom element
     */
    findComponent(name) {
        var m = this.components[name];//this._find(this._myLayout.root,name);
        if (m === undefined)
            return undefined;
        if (m.container === undefined || m.container._config === undefined || m.container._config.componentState === undefined)
            return undefined;

        var ret = m.container._config.componentState.component;
        if (ret._this !== undefined)
            return ret._this;
    }
    /**
     * adds a window to the side (left - area)
     * @param {dom|jassijs.ui.Component} component - the component to add
     * @param {string} title - the title
     */
    addLeft(component, title) {
    	var parentname='xxxleft';
        if(this._noRestore.indexOf(title)===-1)
        	this._noRestore.push(title);
    	var config = {
            name: parentname,
            type: 'stack',
            content: []
        };
        var _this=this;
        var parent = this.components[parentname];
        if (parent === undefined) {
            this._myLayout.root.contentItems[0].addChild(config, 0);
            parent = this._myLayout.root.contentItems[0].contentItems[0];
            this._myLayout.root.contentItems[0].contentItems[0].config.width = 15;
			this.components[parentname]=parent;
			parent.on("itemDestroyed",()=>{
				//delete _this.components[config.name];
				_this._myLayout.updateSize();
			});
        }
    	this._add(parent,component,title);
    }
     /**
     * adds a window to the side (left - area)
     * @param {dom|jassijs.ui.Component} component - the component to add
     * @param {string} title - the title
     */
    addRight(component, title) {
    	var parentname='xxxright';
    	this._noRestore.push(title);
    	var _this=this;
    	var config = {
            name: parentname,
            type: 'column',
            content: []
        };
        var parent = this.components[parentname];
        if (parent === undefined) {
        	var pos=this._myLayout.root.contentItems[0].contentItems.length;
            this._myLayout.root.contentItems[0].addChild(config, pos);
            parent = this._myLayout.root.contentItems[0].contentItems[pos];
            parent.config.width = 15;
			this.components[parentname]=parent;
			parent.on("itemDestroyed",()=>{
				//delete _this.components[parentname];
				_this._myLayout.updateSize();
			});
        }
    	this._add(parent,component,title);
    }
   
    add(component, title, name = undefined){
    	var parent = this.components["center"];
        if (parent === undefined)
            parent = this.components["center"] = this._findDeep(this._myLayout.root, "center");
        return this._add(parent,component,title,name);
    }
    /**
     * add a window to the main area
     * @param {dom|jassijs.ui.Component} component - the component to add
     * @param {string} title - the title
     * @param {string} [id] - the name (id) - =title if undefined 
     */
    _add(parent,component, title, name = undefined) {
        var _this = this;
        if (component.dom !== undefined)
            component = component.dom;
        if (name === undefined)
            name = title;
        if (this.components[name] !== undefined)
            name = name + this._counter++;

        var config = {
            title: title,
            type: 'component',
            componentName: name,
            componentState: { title: title, name: name, component: component }
        };
        this._myLayout.registerComponent(name, function (container, state) {
            var v = container.getElement();
            state.component._container = container;
            var z = v[0].appendChild(state.component);//html( '<h2>' + state.text + '</h2>');
            _this.onclose(state.component, function (data) {
                if (data.config.componentState.component._this !== undefined)
                    data.config.componentState.component._this.destroy();
                delete data.config.componentState.component._container;
                delete data.config.componentState.component;
                //memory leak golden layout
               // container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
              /*  container.tab.element.remove();
                var myNode =container.tab.element[0];
                while (myNode.firstChild) {
                    myNode.removeChild(myNode.firstChild);
                }*/
               // container.tab.header.activeContentItem = undefined;

                delete _this._myLayout._components[name];
                delete _this.components[name];
                _this.saveWindows();
            });
            var test = _this.components[name];

        });
       
        parent.addChild(config);
        for (var x = 0; x < parent.contentItems.length; x++) {
            if (parent.contentItems[x].config.name === name || parent.contentItems[x].config.componentName === name) {
                this.components[name] = parent.contentItems[x];
                //activate
                var _this = this;
                setTimeout(function () {
                    _this.show(name);
                    _this.saveWindows();
                }, 10);
                //this.components[name].parent.header.parent.setActiveContentItem(this.components[name]);
            }

        }

        var j = 9;
    }
    test() {
        var name = "oo";
        var title = "oo";
        var config = {
            title: title,
            type: 'component',
            componentName: name,
            componentState: { title: title, name: name }
        };
        var tt = Component.createHTMLElement("<Button>");

        var _this = this;
        this._myLayout.registerComponent(name, function (container, componentState) {
            // var v=container.getElement();
            container.on("destroy", function (data) {
                var hh = container.tab;
                hh._dragListener._oDocument.unbind('mouseup touchend', hh._dragListener._fUp);
                delete _this._myLayout._components[name];
            })
        });
        var center = this.components["center"];
        if (center === undefined)
            center = this.components["center"] = this._findDeep(this._myLayout.root, "center");
        center.addChild(config);
    }
    /**
     * gets the url for the given component
     * @param {jassijs.ui.component} comp - the component to read 
     */
    getUrlFromComponent(comp) {
        var props = ComponentDescriptor.describe(comp.constructor).fields;

        var urltags = [];
        for (var p = 0; p < props.length; p++) {
            if (props[p].isUrlTag) {
                urltags.push(props[p]);
            }
        }
        var url = "#do=" + classes.getClassName(comp);
        for (var x = 0; x < urltags.length; x++) {
            url = url + "&" + urltags[x].name + "=" + comp[urltags[x].name];
        }
        return url;

        return "";
    }
    restoreWindows() {
        
        var save =Cookies.get('openedwindows');
        if (save === undefined || save === "")
            return;
        var all = save.split(",");
        import("./Router").then(function (router) {
            for (var x = 0; x < all.length; x++) {

                router.router.navigate(all[x]);
            }
        });

    }
    /*
     * writes all opened components to cookie
     */
    saveWindows() {
        var all = [];
        for (var key in this.components) {

            var comp = this.findComponent(key);//this.components[key].container._config.componentState.component;

            if (comp !== undefined&&this._noRestore.indexOf(key)===-1) {
                // comp=comp._this;
                if (comp !== undefined) {
                    var url = this.getUrlFromComponent(comp);
                    all.push(url);
                }
            }
        }
        var s="";
        for(var x=0;x<all.length;x++){
            s=s+(s===""?"":",")+all[x];
        }
        
        Cookies.set('openedwindows', s, {  expires: 30 });

    }
    /**
     * fired if component is closing
     * @param {dom|jassijs.UI.Component} component - the component to register this event
     * @param {function} func
     */
    onclose(component, func) {
        if (component.dom !== undefined)
            component = component.dom;
        component._container.on("destroy", function (data) {
            func(data);
        })
    }
}

var windows = new Windows();
windows = windows;

export default windows;
  //   myRequire("lib/goldenlayout.js",function(){
       //  jassijs.windows._init();
   //  });

    //return Component.constructor;
