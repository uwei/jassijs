
export class Errors {
    public static errors: Errors;
    public items;
    public handler;
    private static _randomID = 100000;
    /**
    * Error handling.
    * @class jassijs.base.Error
    */
    constructor() {
        this.items = [];
        this.handler = {};
        var _this = this;
        Errors.errors = this;
         window.addEventListener("unhandledrejection", function(err) {
        	 _this.addError(err);
        });
        window.addEventListener("error", function(err) {
        	 _this.addError(err);
        });
        /* window.onerror =function(errorMsg, url, lineNumber, column, errorObj) {
              var stack=(errorObj===null||errorObj===undefined)?"":errorObj.stack;
              var s = 'Error: ' + errorMsg + 
                                         ' Script: ' + url + 
                                         ' (' + lineNumber + 
                                         ', ' + column + 
                                         '): ' +  stack+"->"+url;
              var err={ errorMsg:errorMsg,url:url,lineNumber:lineNumber,column:column,errorObj:errorObj};
             _this.addError(err);
              console.error(s);
              
              if(orge!==null)
              return orge(errorMsg, url, lineNumber, column, errorObj);
          }*/
        var org = console.log;
        console.log = function(ob) {
            org(ob);
            if (ob === undefined)
                return;
            var logOb = { infoMsg: ob };
            _this.items.push(logOb);
            if (_this.items.count > 10) {
                _this.items.splice(10, 1);
            }
            for (var key in _this.handler) {
                _this.handler[key](logOb);
            }

        }
    }
    addError(err) {
        this.items.push(err);
        if (this.items.count > 20) {
            this.items.splice(20, 1);
        }

        for (var key in this.handler) {
            this.handler[key](err);
        }
    }
    /**
     * raise if error is thrown
     * @param {function} func - callback function
     * @param {string} [id] - the id of the component that registers the error
     */
    onerror(func, id) {
        if (id === undefined)
            id = Errors._randomID++;
        this.handler[id] = func;
        return id;
    }
    /**
     * delete the error handler
     * @param {function} func - callback function
     * @param {string} [id] - the id of the component that registers the error
     */
    offerror(id) {
        delete this.handler[id];
    }
};
var errors=new Errors();
export {errors};

