import { City } from "game/city";
import { allProducts, Product } from "game/product";
import { Airplane } from "game/airplane";
var css = `
    table{
        font-size:inherit;
    }

    .airplanedialog >*{
        font-size:10px;
    }
    .ui-dialog-title{ 
        font-size:10px;
    }
    .ui-dialog-titlebar{
        height:10px;
    }
`;
//@ts-ignore
window.airplane = function () {
    return AirplaneDialog.getInstance().airplane;
}
export class AirplaneDialog {
    dom: HTMLDivElement;
    airplane: Airplane;
    hasPaused = false;
    public static instance;
    constructor() {
        this.create();
    }
    static getInstance(): AirplaneDialog {
        if (AirplaneDialog.instance === undefined)
            AirplaneDialog.instance = new AirplaneDialog();
        return AirplaneDialog.instance;
    }
    private createStyle() {
        var style = document.createElement('style');
        style.id = "airplanedialogcss";
        style.type = 'text/css';
        style.innerHTML = css;

        var old = document.getElementById("airplanedialogcss");
        if (old) {
            old.parentNode.removeChild(old);
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    private create() {
        //template for code reloading
        var sdom = `
          <div hidden id="airplanedialog" class="airplanedialog">
            <div></div>
           </div>
        `;
        this.dom = <any>document.createRange().createContextualFragment(sdom).children[0];
        var old = document.getElementById("airplanedialog");
        if (old) {
            old.parentNode.removeChild(old);
        }
        this.createStyle();
        var airplane = this.airplane;
        var products = allProducts;
        var _this = this;
        var sdom = `
          <div>
          <div>
            <input id="airplanedialog-prev" type="button" value="<"/>"
            <input id="airplanedialog-next" type="button" value=">"/>"
          </div>
            <div id="airplanedialog-tabs">
                <ul>
                    <li><a href="#airplanedialog-products">products</a></li>
                    <li><a href="#airplanedialog-info">Info</a></li>
                </ul>
                <div id="airplanedialog-products">
                    <div id="airplanedialog-products-list">
                            
                    </div>         
                </div>
                <div id="airplanedialog-info">
                    
                 </div>
                
            </div>
          </div>
        `;
        var newdom = <any>document.createRange().createContextualFragment(sdom).children[0];
        this.dom.removeChild(this.dom.children[0]);
        this.dom.appendChild(newdom);
        $("#airplanedialog-tabs").tabs({
            //collapsible: true
        });
        setTimeout(() => {
            $("#airplanedialog-tabs").tabs({
                //collapsible: true
            });
        }, 100);
        document.body.appendChild(this.dom);

        //        document.getElementById("citydialog-prev")
        setTimeout(() => {
            document.getElementById("airplanedialog-next").addEventListener("click", (ev) => {
                var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
                pos++;
                if (pos >= _this.airplane.world.airplanes.length)
                    pos = 0;
                _this.selectAirplace(_this.airplane.world.airplanes[pos]);
            });
            document.getElementById("airplanedialog-prev").addEventListener("click", (ev) => {
                var pos = _this.airplane.world.airplanes.indexOf(_this.airplane);
                pos--;
                if (pos === -1)
                    pos = _this.airplane.world.airplanes.length - 1;
                _this.airplane = _this.airplane.world.airplanes[pos];
                _this.update(true);
            });


        }, 500);
        //document.createElement("span");
    }
    selectAirplace(ap) {
        this.airplane = ap;
        ap.world.selection?.unselect();
        ap.world.selection = ap;
        ap.select();
        this.update(true);
        
    }
    update(force = false) {
        if(this.airplane===undefined)
            return;
        var ret = '<div style="display:grid;grid-template-columns: 30px 30px 30px 30px;">';
        for (var x = 0; x < allProducts.length; x++) {
            if (this.airplane.products[x] !== 0) {
                ret = ret + '<div>' + allProducts[x].getIcon() + " " + this.airplane.products[x] + " " + "</div>";
            }
        }
        ret += "<div>";
        document.getElementById("airplanedialog-products-list").innerHTML = ret;
        this.updateTitle();
        /*
          var companies = this.city.companies;
          var all = allProducts;
          for (var x = 0; x < companies.length; x++) {
              var table = document.getElementById("citydialog-buildings-table");
              var tr = table.children[0].children[x + 1];
              var product = all[companies[x].productid];
              var produce = companies[x].getDailyProduce();
              tr.children[0].innerHTML = produce + " " + product.getIcon();
              tr.children[1].innerHTML = product.name + "</td>";
              tr.children[2].innerHTML = companies[x].buildings + "</td>";
              tr.children[3].innerHTML = companies[x].workers + "/" + companies[x].getMaxWorkers() + "</td>";
              tr.children[4].innerHTML = "1000" + "</td>";
              var needs = "";
              if (product.input1 !== undefined)
                  needs = "" + companies[x].getDailyInput1() + " " + all[product.input1].getIcon() + " ";
              if (product.input2 !== undefined)
                  needs = needs + "" + companies[x].getDailyInput2() + " " + all[product.input2].getIcon();
              tr.children[5].innerHTML = needs + "</td>";
              tr.children[6].innerHTML = '<input type="button" value="+">' + "</td>" + '<input type="button" value="-">' + "</td>";
  
          }*/

    }
    updateTitle() {
        var sicon = '';
        if ($(this.dom).parent().find('.ui-dialog-title').length > 0)
            $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = this.airplane.name+" "+this.airplane.status; //'<img style="float: right" id="citydialog-icon" src="' + this.city.icon + '"  height="15"></img> ' + this.city.name + " " + this.city.people;
    }
    show() {
        var _this = this;
          this.dom.removeAttribute("hidden");
        this.update();

        $(this.dom).dialog({
            width: "170px",
            open: function (event, ui) {
                _this.update(true);
            }
        });

    }

}