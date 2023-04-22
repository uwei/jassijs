
import "jquery";
import "jquery.notify";

//@ts-ignore
$.notify.defaults({ position: "bottom right", className: "info" });
export function notify(text:string|object,style:string|any,options=undefined){
    //@ts-ignore
    $.notify(text,style,options);
}
export function notifyAddStyle(style,options){
    //@ts-ignore
    $.notify.addStyle(style,options);
}

