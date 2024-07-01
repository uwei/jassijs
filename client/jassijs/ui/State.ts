class StateProp {
    ob;
    proppath: string[];

}
//window.timecount=0;
function _resolve(ob,props,path:string[],recurseCount){
    if(recurseCount>3)
        return;
    for(var key in props){
        var val =props[key];
        
        if(val instanceof State){
            props[key]=val.current;
            val._comps_.push({ ob: ob, proppath: [...path,key]});
            continue;
        }
        if(typeof val==="object"&& Array.isArray(val)===false&&(val?._rerenderMe === undefined)){
            _resolve(ob,val,[...path,key],recurseCount++)
        }
    }
}
export function resolveState(ob,config){
  var test=  new Date().getTime();
    _resolve(ob,config,[],0);
    //window.timecount=window.timecount+new Date().getTime()-test;
}
function createParams<T>(data:any={}):T&{readonly ref:{readonly[Property in keyof T]-?:{current:T[Property]}}}{
    data.ref=new Proxy(data as any,{
            get(target,key:string){
                if(target[key]===undefined){
                    target[key]={
                        _current:undefined,
                        set current(value){
                            data[key]=value;
                            this._current=value;
                        },
                        get current(){
                            return this.current;
                        }
                    }
                }
                return target[key];
            }
        })
  
    return data;
}

export class State<T> {
    private data;
    self:any=this;
    _comps_: StateProp[] = [];
    constructor(data = undefined) {
        this.data = data;
    }
    _observe_(control, property, atype) {
        this._comps_.push({ ob: control, proppath: [property] });
    }

    get current():T {
        return this.data;
    }
    set current(data:T) {
        if(this.data===data)
            return;
        this.data = data;
        for (var x = 0; x < this._comps_.length; x++) {
            var c = this._comps_[x];
            var newVal={};
            var cur=newVal;
            for(var y=0;y< c.proppath.length;y++){
                var prop = c.proppath[y];
                cur[prop]={};
                
                if(y==c.proppath.length-1){
                    cur[prop]=data;
                }else
                    cur=cur[prop];
                
            }
            c.ob.config(newVal);
           /* if (c.atype === "style") {
                //for (var key in (<any>props).style) {
                //var val = (<any>props).style[key];
                ob.dom.style[prop] = data;
                //}
            }else    if (c.atype === "dom") {
                Reflect.set(ob.dom, prop, data);
            }else     if (c.atype === "attribute") {

                ob.dom.setAttribute(prop, data);
            }else{
                Reflect.set(ob,prop,data);
            }*/

            /*else if (prop in this.dom) {
                       Reflect.set(this.dom, prop, [props[prop]])
                   } else if (prop.toLocaleLowerCase() in this.dom) {
                       Reflect.set(this.dom, prop.toLocaleLowerCase(), props[prop])
                   } else if (prop in this.dom)
                   this.dom.setAttribute(prop, (<any>props)[prop]);*/
        }

    }
}
export function createState<T>(val:T=undefined){
    var ret=new State<T>();
    ret.current=val;
    return ret;
}
interface Me{
    hallo?:string;
}

export function test(){
    var me:Me=<any>{a:6} 
    debugger;
    var params=createParams<Me>(me);
   
    params.ref.hallo.current="JJJ";
    console.log(me.hallo);
}