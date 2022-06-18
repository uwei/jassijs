//@ts-ignore
import "jquery";
import GoldenLayout from "jassijs/ext/goldenlayout";
import { $Class } from "jassijs/remote/Registry";
import {Container} from "jassijs/ui/Container";
//import "jassijs/ext/jquery.resize";
import {Button} from "jassijs/ui/Button";
import {Textbox} from "jassijs/ui/Textbox";

//goldenlayout custom version - fixed leak s.u.
@$Class("jassijs.ui.DockingContainer")
export class DockingContainer extends Container {
    _registeredcomponents;
    _lastSize:number;
    _intersectionObserver:IntersectionObserver;
    _myLayout:GoldenLayout;
    _windowResizer;
    _noDestroyChilds:boolean;
        /**
    * a container where the components could be docked
    * @class jassijs.ui.DockingContainer
    */
    constructor(id=undefined) {//id connect to existing(not reqired)
        super(id);
        super.init('<div class="DockingContainer"/>');
        this.maximize();
        var _this = this;
        this._registeredcomponents = {};
        this._init();
        this._lastSize = -1;
        this._intersectionObserver = new IntersectionObserver(entries => {
            if (entries[0].intersectionRatio <= 0) {
                return;
            }
            if (_this._lastSize !==(<HTMLElement>_this.dom).offsetWidth * (<HTMLElement>_this.dom).offsetHeight) {
                _this._lastSize = (<HTMLElement>_this.dom).offsetWidth * (<HTMLElement>_this.dom).offsetHeight;
                _this._myLayout.updateSize();
            }
        }, { rootMargin: `0px 0px 0px 0px` });
        this._intersectionObserver.observe(_this.dom);
    }
     public static clearMemoryleak(container){
     
    	if(container===undefined){ 
    		//initialize to clean this code line $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
    		if(GoldenLayout.__lm.utils.fnBind.inited===undefined){
		        GoldenLayout.__lm.utils.fnBind = function( fn, context, boundArgs ) {
					var func= Function.prototype.bind.apply( fn, [ context ].concat( boundArgs || [] ) );
					func.orgFunc=fn;
					func.orgOb=context;
					return func;
				}
				GoldenLayout.__lm.utils.fnBind.inited=true;
	        }
	        return;
    	}
    			container.off("destroy");
                //memory leak golden layout
                container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
                container.tab._dragListener._fUp = undefined;
                container.tab._dragListener._oDocument.off('mousemove touchmove', container.tab._dragListener._fMove);
                container.tab._dragListener._oDocument.off('mouseup touchend', container.tab._dragListener._fUp);
               
                //uw hack in goldenlayout.js memory leak
                //change: $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
                //in    : this._uweiMouseUp=lm.utils.fnBind( this._hideAdditionalTabsDropdown, this );
                //        $( document ).mouseup(this._uweiMouseUp );
                
                $(document).off("mouseup", container.tab.header._uweiMouseUp);
                container.tab.header.activeContentItem = undefined;
                $(container.tab.header.element).off("destroy");
                $(container.tab.header.element).off("mouseup");
                $(container.tab.header.element).remove();
                $(container.tab.element).remove();
                $(container.element).remove();
    }
    /**
     * add a component to the container
     * @param {jassijs.ui.Component} component - the component to add
     * @param {string} title - the caption of the window
     * @param {string} name - the name of the window
     */
    add(component, title="", name=undefined) {//add a component to the container
        var exists = this._find(this._myLayout.root, name);
        component._parent = this;
        component.maximize();
        component.domWrapper._parent = this;
        if (name === undefined)
            name = title;
        this._registeredcomponents[name] = component;
        if (exists !== undefined) {
            console.warn("check memory leak");
            var old = exists.element[0].children[0].children[0];
            exists.element[0].children[0].replaceChild(component.domWrapper, old);
            old._this._parent = undefined;
            old._this.domWrapper._parent = undefined;
            return;
        }

        this._components.push(component);

        //delete from old parent
        if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
            component.domWrapper.parentNode.removeChild(component.domWrapper);
        }
        var config = {
            title: title,
            type: 'component',
            componentName: name,
            componentState: { title: title, name: name }
        };
        this._registerGL(name);
        var center = this._myLayout.root.contentItems[0];
        center.addChild(config);
       
    }
    /**
     * called on resizing could be redefined
     */
    onresize() {

    }
    /**
     * register a component to Golden layout
     * @param {String} name - the name of the component
     */
    _registerGL(name) {
        var _this = this;
        //save the component
        this._myLayout.registerComponent(name, function (container, state) {
            var component = _this._registeredcomponents[name];
            container.on('resize', function () {
                _this.onresize();
            });
        
            container.on("destroy", function (data) {
                
                container.off("resize");
                container.off("destroy");
                //memory leak golden layout
                container.tab._dragListener._oDocument.unbind('mouseup touchend', container.tab._dragListener._fUp);
                container.tab._dragListener._fUp = undefined;
                container.tab._dragListener._oDocument.off('mousemove touchmove', container.tab._dragListener._fMove);
                container.tab._dragListener._oDocument.off('mouseup touchend', container.tab._dragListener._fUp);
                if (_this._noDestroyChilds !== true) {
                    if (component._this !== undefined)
                        component._this.destroy();
                    delete _this._registeredcomponents[name];

                }
                delete _this._myLayout._components[name];
                //uw hack in goldenlayout.js memory leak
                //change: $( document ).mouseup( lm.utils.fnBind( this._hideAdditionalTabsDropdown, this ) );
                //in    : this._uweiMouseUp=lm.utils.fnBind( this._hideAdditionalTabsDropdown, this );
                //        $( document ).mouseup(this._uweiMouseUp );
                var kk=container.tab.header._hideAdditionalTabsDropdown.bound===container.tab.header._uweiMouseUp;
                //$(document).off("mouseup", container.tab.header._uweiMouseUp);
               // container.tab.header.activeContentItem = undefined;
                $(container.tab.header.element).off("destroy");
                $(container.tab.header.element).off("mouseup");
                $(container.tab.header.element).remove();
                $(container.tab.element).remove();
                $(container.element).remove();
                delete component._container;

            });

            if (component.dom !== undefined)
                component = component.dom;
            component._container = container;
            container.getElement()[0].appendChild(component);//html( '<h2>' + state.text + '</h2>');
        });
    }
    /**
     * remove a component from the container
     * @param {jassijs.ui.Component} component - the component to add
     */
    remove(component) {
    
        component._parent = undefined;
        component.domWrapper._parent = undefined;
        var pos = this._components.indexOf(component);
        if (pos >= 0)
            this._components.splice(pos, 1);
        var container = component.dom._container;
        //   container.getElement()[0].removeChild(component.dom);

        //            this.dom.removeChild(component.domWrapper);
        //console.warn("TODO call close tab?")
    }
    _init() {
        var config = {
            settings: {
                showPopoutIcon: false,
            },
            content: [{
                type: 'row',
                isClosable: false,
                content: []
            }],

        };
        this._myLayout = new GoldenLayout(config, this.dom);
	//	this._myLayout.on( 'selectionChanged', function(evt){
	//	    debugger;
	//	});
        var _this = this;
        this._myLayout.init();
        var thislayout = this._myLayout;
        this._windowResizer = function () {
            _this.update();
            window.setTimeout(function () {
                _this.update();


            }, 100);
        };
        $(window).resize(this._windowResizer);
        /* this._parentResizer=function(){
             //   alert("now");
               var h = $(_this.dom.parent).height();
               var w = $(_this.dom.parent).weigth();
               _this.width=w;
               _this.height=h;
           }
         $(this.dom.parent).resize(this._parentResizer);*/
        var func = function () {
            _this._myLayout.update();
            //     window.setTimeout(func,500);
        };
        // var thislayout=this._myLayout;
        //    window.setTimeout(func,500);

        /* var test=this.dom.parent;
              $(this.dom.parent).resize(function(){
             var h = $(_this.dom.parent).height();
             var w = $(_this.dom.parent).weigth();
             _this.width=w;
             _this.height=h;
         });*/
        // $(this.dom.firstChild).css("height","100%");
        //   $(this.dom.firstChild).css("width","100%");

    }
    /**
     * activate the window
     * @param {string} name - the name of the window
     */
    show(name) {
        var m = this._find(this._myLayout.root, name);
        if (m.parent.header !== undefined)
            m.parent.header.parent.setActiveContentItem(m);
    }
    /**
     * update the layout (size)
     */
    update() {
        this._myLayout.updateSize();
    }
    /**
     * finds a child in the config
     */
    _find(parent, name) {
        if (parent.contentItems === undefined)
            return undefined;
        for (var x = 0; x < parent.contentItems.length; x++) {
            if (parent.contentItems[x].config.componentName === name)
                return parent.contentItems[x];
            var test = this._find(parent.contentItems[x], name);
            if (test !== undefined)
                return test;
        }
        return undefined;
    }
    /** @member {String} - the layout of the windows */
    get layout() {
        return JSON.stringify(this._myLayout.toConfig());
    }
    set layoutold(value) {
        var fc = this.dom.firstChild;

        while (fc) {
            this.dom.removeChild(fc);
            fc = this.dom.firstChild;
        }

        var config = JSON.parse(value);
        this._myLayout = new GoldenLayout(config, this.dom);
        for (var name in this._registeredcomponents)
            this._registerGL(name);
        this._myLayout.init();
        this.update();
    }
    set layout(value) {
        for (var x = 0; x < this._components.length; x++) {
            var component = this._components[x];
            var container = component.dom["_container"];
            try{
            if (container&&container.getElement()[0].children.length > 0)
                container.getElement()[0].removeChild(container.getElement()[0].firstChild);
            }catch{
                var h=9;
            }
        }
        /* var fc = this.dom.firstChild;

         while( fc ) {
             this.dom.removeChild( fc );
             fc = this.dom.firstChild;
         }*/
        this._noDestroyChilds = true;
        this._myLayout.destroy();
        delete this._noDestroyChilds;
        var config = JSON.parse(value);
        this._myLayout = new GoldenLayout(config, this.dom);
        for (var name in this._registeredcomponents)
            this._registerGL(name);
        this._myLayout.init();
        this.update();
        this.addSelectionEvent(this._myLayout.root);
       
    }
    private addSelectionEvent(element){
    	if(element.contentItems!==undefined){
    		element.on("activeContentItemChanged",function(evt){
        		//console.log(evt.componentName);
        	});
        	for(let x=0;x<element.contentItems.length;x++){
        		this.addSelectionEvent(element.contentItems[x]);
        	}
    	}
    }
    destroy() {
        $(window).off("resize", this._windowResizer);
        //  $(this.dom.parent).off("resize",this._parentResizer);
        this._windowResizer = undefined;
        // this._parentResizer=undefined;
        this._intersectionObserver?.unobserve(this.dom);
        this._intersectionObserver = undefined;
       
        this._myLayout.destroy();
       
        this._myLayout = undefined;
        this._registeredcomponents = {};
        super.destroy();
    }
}

export function test() {
    var dock = new DockingContainer();
    var bt = new Button();
    dock.add(bt, "Hallo1", "Hallo1");
    var text = new Textbox();
    dock.add(text, "Hallo2", "Hallo2");

    // jassijs.windows.add(dock,"dock");
    //dock.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"stack","width":100,"height":80.99041533546327,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Hallo","type":"component","componentName":"Hallo","componentState":{"title":"Hallo","name":"Hallo"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.00958466453674,"content":[{"title":"Hallo2","type":"component","componentName":"Hallo2","componentState":{"title":"Hallo2","name":"Hallo2"},"isClosable":true,"reorderEnabled":true}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
    bt.onclick(function () {
        text.value = dock.layout;
        //  dock.layout=state;
        //var config=JSON.parse(state);
        //dock._myLayout = new GoldenLayout( config,dock.dom );
        //dock._myLayout.init();
    });
    return dock;
}
