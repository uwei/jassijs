import "jassijs/ext/jquerylib";
import { Upload } from "jassijs/ui/Upload";
import { Textbox } from "jassijs/ui/Textbox";
import { Image } from "jassijs/ui/Image";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel, PanelProperties } from "jassijs/ui/Panel";
import { $PropertyEditor, Editor } from "jassijs/ui/PropertyEditors/Editor";
import { RImage } from "jassijs_report/RImage";
import { RComponent } from "jassijs_report/RComponent";
import { jc } from "jassijs/ui/Component";
import { States, ccs } from "jassijs/ui/State";
type Me = {
    //  repeater1?: Repeater;
    panel1?: Panel;
    image1?: Image;
    itile?: Textbox;
    remove?: Button;
    upload1?: Upload;
    //  databinder1?: StateDatabinder;
};
@$PropertyEditor(["rimage"])
@$Class("jassi_report/RImagePropertyEditor")
export class RImageEditor extends Editor {
    _textbox: Textbox;
    _button: Button;
    dialog: RImageChooser;
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Panel( /*{useSpan:true}*/);
        this._button = new Button();
        this._textbox = new Textbox();
        this._textbox.width = "calc(100% - 34px)";
        this.component.height = 24;
        this._button.icon = "mdi mdi-glasses";
        this.component.add(this._textbox);
        this.component.add(this._button);
        var _this = this;
        this._textbox.onchange(function (param) {
            _this._onchange(param);
        });
        this._button.onclick(() => {
            _this.showDialog();
        });
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        //databinder,"prop"
        var value: string = this.propertyEditor.getPropertyValue(this.property);
        if (value?.startsWith('"'))
            value = value.substring(1);
        if (value?.endsWith('"')) {
            value = value.substring(0, value.length - 1);
        }
        this._textbox.value = value;
    }
    get ob() {
        return this._ob;
    }
    /**
   * get the renderer for the PropertyEditor
   * @returns - the UI-component for the editor
   */
    getComponent() {
        return this.component;
    }
    /**
    * intern the value changes
    * @param {type} param
    */
    _onchange(param = undefined) {
        var val = this._textbox.value;
        if (this.property) {
            this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
            this.propertyEditor.setPropertyInDesign(this.property.name, val);
        }
        super.callEvent("edit", param);
    }
    async showDialog(onlytest = undefined) {
        var _this = this;
        if (!this.dialog) {
            this.dialog = new RImageChooser();
            var image = (<RImage>this.ob);
            var report = RComponent.findReport(image);
            if (report?.images)
                this.dialog.items = report.images;

            $(this.dialog.__dom).dialog({
                height: "400", width: "400",
                close: () => {
                    if (report)
                        report.images = _this.dialog.items;
                    _this._onchange();
                }
            });
            this.dialog.onpictureselected((val) => {

                _this._textbox.value = val;
                if (report)
                    report.images = _this.dialog.items;
                _this._onchange();
                $(this.dialog.__dom).dialog("close");
            });
        } else {
            $(this.dialog.__dom).dialog("open");
        }
    }
}
interface DetailProperties{
    value:{ name: string, data: string};
    chooser:RImageChooser;
}
function Details(props:DetailProperties,stat:States<DetailProperties>){
     
    return jc(Panel,{
        children:[    
            jc(Textbox,{bind:stat.value.bind.name}),
             jc(Button,{
                icon : "mdi mdi-delete-forever-outline",
                onclick:(event)=>{
                    var ob = stat.value.current;
                    let pos = props.chooser.state.items.current.indexOf(ob);
                    props.chooser.state.items.current.splice(pos, 1);
                    props.chooser.state.items.current=[...props.chooser.state.items.current]
                }
            }),
            jc("br"),
            jc(Image,{ height:75,bind:stat.value.bind.data,
                onclick:(ev)=>{
                    props.chooser.value=stat.value.current.name;
//                     var ob = me.itile._databinder.value;
  //                _this.value = ob.name;
                  props.chooser.callEvent("pictureselected", stat.value.current.name);
                }
            
            }),
           
            jc(Image)
        ]
    })
}
interface RImageChooserProperties extends PanelProperties{
    items?: {
        name: string;
        data: string;
    }[];
    value?: string;
}

export class RImageChooser extends Panel<RImageChooserProperties> {
    me: Me;
    //active image;
    value: string;
   /* _items: {
        name: string;
        data: string;
    }[] = [];*/
    constructor(props={items:[]}) {
        super(props);
        this.me = {};
        //this.layout(this.me);
    }
    set items(val) {
        this.state.items.current.splice(0, this.state.items.current.length);
        for (var key in val) {
            this.state.items.current.push({ name: key, data: val[key] });
        }
        // this.me.repeater1.value = this._items;
        this.state.items.current=this.state.items.current;
    }
    get items() {
        var ret = {};
        for (var x = 0; x < this.state.items.current.length; x++) {
            ret[this.state.items.current[x].name] = this.state.items.current[x].data;
        }
        return ret;
    }
    onpictureselected(func) {
        this.addEvent("pictureselected", func);
    }
    render() {
        var _this = this;

        return jc(Panel, {
            children: [
                jc(Upload, {
                    multiple:true,
                    onuploaded:(data) => {
                        for (var key in data) {
                            _this.state.items.current.push({ name: key.split(".")[0], data: data[key] });
                        }
                        this.state.items.current=[...this.state.items.current];
                        //_this.items = _this.items;

                    },
                    readAs: "DataUrl"
                }),
                jc("span",{
                    children:ccs(()=> this.state.items.current.map(item => jc(Details, {
                            value:item,
                            chooser:this
                              })), this.state.items)
                })
            ]
        })
    }
   
}
export async function test() {
    var ret = new RImageChooser();

    return ret;
}
