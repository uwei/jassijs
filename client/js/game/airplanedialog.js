define(["require", "exports", "game/product", "game/icons", "game/route"], function (require, exports, product_1, icons_1, route_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AirplaneDialog = void 0;
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
    #route-list>li{
        list-style-type: none; /* Remove bullets */
        padding: 0; /* Remove padding */
        margin: 0;
    }
    #route-list{
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 0px;
    }
`;
    //@ts-ignore
    window.airplane = function () {
        return AirplaneDialog.getInstance().airplane;
    };
    class AirplaneDialog {
        constructor() {
            this.hasPaused = false;
            this.create();
        }
        static getInstance() {
            if (AirplaneDialog.instance === undefined)
                AirplaneDialog.instance = new AirplaneDialog();
            return AirplaneDialog.instance;
        }
        set airplane(value) {
            this._airplane = value;
            this.updateRoute();
        }
        get airplane() {
            return this._airplane;
        }
        createStyle() {
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
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="airplanedialog" class="airplanedialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("airplanedialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            this.createStyle();
            var airplane = this.airplane;
            var products = product_1.allProducts;
            var _this = this;
            var sdom = `
          <div>
          <div>
            <input id="airplanedialog-prev" type="button" value="<"/>"
            <input id="airplanedialog-next" type="button" value=">"/>"
          </div>
            <div id="airplanedialog-tabs">
                <ul>
                    <li><a href="#airplanedialog-products">` + icons_1.Icons.table.replace('<span', '<span title="Load"') + `</a></li>
                    <li><a href="#airplanedialog-info">` + icons_1.Icons.info.replace('<span', '<span title="Info"') + `</a></li>
                    <li><a href="#airplanedialog-route">` + icons_1.Icons.route.replace('<span', '<span title="Route"') + `</a></li>
                </ul>
                <div id="airplanedialog-products">
                    <div id="airplanedialog-products-list">
                            
                    </div>         
                </div>
                <div id="airplanedialog-info">
                    
                 </div>
                 <div id="airplanedialog-route">
                    <input type="checkbox" id="route-active"> active</input>
                    <ul id="route-list">
                     
           
                    </ul>
                <div>
                
            </div>
          </div>
        `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
            this.dom.removeChild(this.dom.children[0]);
            this.dom.appendChild(newdom);
            $("#airplanedialog-tabs").tabs({
            //collapsible: true
            });
            setTimeout(() => {
                $("#airplanedialog-tabs").tabs({
                //collapsible: true
                });
                //  $( "#route-list" ).sortable();
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
                document.getElementById("route-active").addEventListener('click', (e) => {
                    var act = (document.getElementById("route-active").checked ? 1 : -1);
                    if (act === -1 && _this.airplane.activeRoute === 0)
                        _this.airplane.activeRoute = -1;
                    else
                        _this.airplane.activeRoute = act * Math.abs(_this.airplane.activeRoute);
                });
            }, 500);
            //document.createElement("span");
        }
        updateData() {
            var _this = this;
            var childs = document.getElementById("route-list").children;
            var old = [];
            for (var x = 0; x < _this.airplane.route.length; x++) {
                old.push(_this.airplane.route[x]);
            }
            _this.airplane.route = [];
            for (var x = 0; x < childs.length; x++) {
                if (childs[x].id === "route-dummy")
                    continue;
                var sid = childs[x].id.split("-")[1];
                var id = parseInt(sid);
                var found = undefined;
                for (var y = 0; y < old.length; y++) {
                    if (old[y].cityid === id) {
                        found = old[y];
                        old.splice(y, 1);
                        break;
                    }
                }
                if (found === undefined) {
                    found = new route_1.Route();
                    found.cityid = id;
                }
                _this.airplane.route.push(found);
            }
        }
        updateRoute() {
            var _this = this;
            if (document.getElementById("route-list") === null)
                return;
            var html = "";
            if (this.airplane.route.length === 0)
                html = '<li id="route-dummy">drag and drop cities here</li>';
            var ids = [];
            for (var x = 0; x < this.airplane.route.length; x++) {
                var id = this.airplane.route[x].cityid;
                html += '<li id="route-' + id + '" class="ui-state-default"><img src="' + this.airplane.world.cities[id].icon + '" </img>' +
                    this.airplane.world.cities[id].name + " " + icons_1.Icons.trash.replace("mdi ", "mdi route-delete") + "</li>";
                ids.push(this.airplane.route[x].cityid);
                //var sdom;
                //var dom:HTMLSpanElement= <any>document.createRange().createContextualFragment(sdom).children[0];
            }
            document.getElementById("route-list").innerHTML = html;
            $("#route-list").sortable({
                update: (event, ui) => {
                    _this.updateData();
                    setTimeout(() => {
                        _this.updateRoute();
                    }, 50);
                }
            });
            //  $("airplanedialog-route").sortable
            //                   <span>`+this.airplane.world.cities[0].icon+this.airplane.world.cities[0].name+`</span> 
            //                 <span>`+this.airplane.world.cities[1].icon+this.airplane.world.cities[1].name+`</span> 
            //               <span>`+this.airplane.world.cities[3].icon+this.airplane.world.cities[3].name+`</span> 
        }
        selectAirplace(ap) {
            var _a;
            this.airplane = ap;
            (_a = ap.world.selection) === null || _a === void 0 ? void 0 : _a.unselect();
            ap.world.selection = ap;
            ap.select();
            this.update(true);
        }
        update(force = false) {
            var _this = this;
            if (this.airplane === undefined)
                return;
            var ret = '<div style="display:grid;grid-template-columns: 30px 30px 30px 30px;">';
            for (var x = 0; x < product_1.allProducts.length; x++) {
                if (this.airplane.products[x] !== 0) {
                    ret = ret + '<div>' + product_1.allProducts[x].getIcon() + " " + this.airplane.products[x] + " " + "</div>";
                }
            }
            ret += "<div>";
            document.getElementById("airplanedialog-products-list").innerHTML = ret;
            this.updateTitle();
            $(".route-delete").click(function () {
                $(this).closest('li').remove();
                _this.updateData();
            });
            document.getElementById("route-active").checked = (this.airplane.activeRoute > -1);
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
                $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = this.airplane.name + " " + this.airplane.status; //'<img style="float: right" id="citydialog-icon" src="' + this.city.icon + '"  height="15"></img> ' + this.city.name + " " + this.city.people;
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
            this.update();
            $(this.dom).dialog({
                width: "190px",
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update(true);
                }
            });
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.AirplaneDialog = AirplaneDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQSxJQUFJLEdBQUcsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JULENBQUM7SUFDRixZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFLdkI7WUFGQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBR2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVztZQUNkLElBQUksY0FBYyxDQUFDLFFBQVEsS0FBSyxTQUFTO2dCQUNyQyxjQUFjLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDbkQsT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDO1FBQ25DLENBQUM7UUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFlO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBQ0QsSUFBSSxRQUFRO1lBQ1IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFCLENBQUM7UUFDTyxXQUFXO1lBQ2YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsRUFBRSxHQUFHLG1CQUFtQixDQUFDO1lBQy9CLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBRXRCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FB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QUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztnQkFDeEQsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsK0lBQStJO1FBQ3JRLENBQUM7UUFDRCxJQUFJO1lBQ0EsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUVkLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNmLEtBQUssRUFBRSxPQUFPO2dCQUNkLCtEQUErRDtnQkFDL0QsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLEVBQUU7b0JBQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7YUFDSixDQUFDLENBQUM7WUFDSCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBblFELHdDQW1RQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFsbENpdGllcywgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMsIFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbnZhciBjc3MgPSBgXHJcbiAgICB0YWJsZXtcclxuICAgICAgICBmb250LXNpemU6aW5oZXJpdDtcclxuICAgIH1cclxuXHJcbiAgICAuYWlycGxhbmVkaWFsb2cgPip7XHJcbiAgICAgICAgZm9udC1zaXplOjEwcHg7XHJcbiAgICB9XHJcbiAgICAudWktZGlhbG9nLXRpdGxleyBcclxuICAgICAgICBmb250LXNpemU6MTBweDtcclxuICAgIH1cclxuICAgIC51aS1kaWFsb2ctdGl0bGViYXJ7XHJcbiAgICAgICAgaGVpZ2h0OjEwcHg7XHJcbiAgICB9XHJcbiAgICAjcm91dGUtbGlzdD5saXtcclxuICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7IC8qIFJlbW92ZSBidWxsZXRzICovXHJcbiAgICAgICAgcGFkZGluZzogMDsgLyogUmVtb3ZlIHBhZGRpbmcgKi9cclxuICAgICAgICBtYXJnaW46IDA7XHJcbiAgICB9XHJcbiAgICAjcm91dGUtbGlzdHtcclxuICAgICAgICBtYXJnaW4tYmxvY2stc3RhcnQ6IDBweDtcclxuICAgICAgICBtYXJnaW4tYmxvY2stZW5kOiAwcHg7XHJcbiAgICAgICAgcGFkZGluZy1pbmxpbmUtc3RhcnQ6IDBweDtcclxuICAgIH1cclxuYDtcclxuLy9AdHMtaWdub3JlXHJcbndpbmRvdy5haXJwbGFuZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBBaXJwbGFuZURpYWxvZyB7XHJcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfYWlycGxhbmU6IEFpcnBsYW5lO1xyXG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBaXJwbGFuZURpYWxvZyB7XHJcbiAgICAgICAgaWYgKEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlID0gbmV3IEFpcnBsYW5lRGlhbG9nKCk7XHJcbiAgICAgICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgc2V0IGFpcnBsYW5lKHZhbHVlOiBBaXJwbGFuZSkge1xyXG4gICAgICAgIHRoaXMuX2FpcnBsYW5lID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3V0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGFpcnBsYW5lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9haXJwbGFuZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlU3R5bGUoKSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBzdHlsZS5pZCA9IFwiYWlycGxhbmVkaWFsb2djc3NcIjtcclxuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XHJcblxyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nY3NzXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiYWlycGxhbmVkaWFsb2dcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nXCI+XHJcbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2dcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XHJcbiAgICAgICAgdmFyIGFpcnBsYW5lID0gdGhpcy5haXJwbGFuZTtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBhbGxQcm9kdWN0cztcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8XCIvPlwiXHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlwiXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5cclxuICAgICAgICAgICAgICAgIDx1bD5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiPmArIEljb25zLnRhYmxlLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiTG9hZFwiJykgKyBgPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctaW5mb1wiPmArIEljb25zLmluZm8ucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJJbmZvXCInKSArIGA8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiPmArIEljb25zLnJvdXRlLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiUm91dGVcIicpICsgYDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICBcclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLWluZm9cIj5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcm91dGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJyb3V0ZS1hY3RpdmVcIj4gYWN0aXZlPC9pbnB1dD5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9XCJyb3V0ZS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XHJcbiAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQobmV3ZG9tKTtcclxuICAgICAgICAkKFwiI2FpcnBsYW5lZGlhbG9nLXRhYnNcIikudGFicyh7XHJcbiAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xyXG4gICAgICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gICQoIFwiI3JvdXRlLWxpc3RcIiApLnNvcnRhYmxlKCk7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcclxuXHJcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xyXG4gICAgICAgICAgICAgICAgcG9zKys7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zID49IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gMDtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdEFpcnBsYWNlKF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctcHJldlwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoX3RoaXMuYWlycGxhbmUpO1xyXG4gICAgICAgICAgICAgICAgcG9zLS07XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zID09PSAtMSlcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc107XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0ID0gKCg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID8gMSA6IC0xKTtcclxuICAgICAgICAgICAgICAgIGlmIChhY3QgPT09IC0xICYmIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID09PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gLTE7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPSBhY3QgKiBNYXRoLmFicyhfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sIDUwMCk7XHJcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgIH1cclxuICAgIHVwZGF0ZURhdGEoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgY2hpbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmNoaWxkcmVuO1xyXG4gICAgICAgIHZhciBvbGQ6IFJvdXRlW10gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIG9sZC5wdXNoKF90aGlzLmFpcnBsYW5lLnJvdXRlW3hdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX3RoaXMuYWlycGxhbmUucm91dGUgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRzW3hdLmlkID09PSBcInJvdXRlLWR1bW15XCIpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHNpZCA9IGNoaWxkc1t4XS5pZC5zcGxpdChcIi1cIilbMV07XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHNpZCk7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZDogUm91dGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgb2xkLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkW3ldLmNpdHlpZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG9sZFt5XTtcclxuICAgICAgICAgICAgICAgICAgICBvbGQuc3BsaWNlKHksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IG5ldyBSb3V0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZm91bmQuY2l0eWlkID0gaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUucm91dGUucHVzaChmb3VuZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdXBkYXRlUm91dGUoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpID09PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIGh0bWwgPSBcIlwiO1xyXG4gICAgICAgIGlmICh0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgaHRtbCA9ICc8bGkgaWQ9XCJyb3V0ZS1kdW1teVwiPmRyYWcgYW5kIGRyb3AgY2l0aWVzIGhlcmU8L2xpPic7XHJcbiAgICAgICAgdmFyIGlkcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSB0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZDtcclxuICAgICAgICAgICAgaHRtbCArPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3JjPVwiJyArIHRoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW2lkXS5pY29uICsgJ1wiIDwvaW1nPicgK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLm5hbWUgKyBcIiBcIiArIEljb25zLnRyYXNoLnJlcGxhY2UoXCJtZGkgXCIsIFwibWRpIHJvdXRlLWRlbGV0ZVwiKSArIFwiPC9saT5cIjtcclxuXHJcbiAgICAgICAgICAgIGlkcy5wdXNoKHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkKTtcclxuICAgICAgICAgICAgLy92YXIgc2RvbTtcclxuICAgICAgICAgICAgLy92YXIgZG9tOkhUTUxTcGFuRWxlbWVudD0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgICAgICQoXCIjcm91dGUtbGlzdFwiKS5zb3J0YWJsZSh7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogKGV2ZW50LCB1aSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlUm91dGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgIC8vICAkKFwiYWlycGxhbmVkaWFsb2ctcm91dGVcIikuc29ydGFibGVcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzBdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0ubmFtZStgPC9zcGFuPiBcclxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzFdLm5hbWUrYDwvc3Bhbj4gXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzNdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbM10ubmFtZStgPC9zcGFuPiBcclxuXHJcbiAgICB9XHJcbiAgICBzZWxlY3RBaXJwbGFjZShhcCkge1xyXG4gICAgICAgIHRoaXMuYWlycGxhbmUgPSBhcDtcclxuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24/LnVuc2VsZWN0KCk7XHJcbiAgICAgICAgYXAud29ybGQuc2VsZWN0aW9uID0gYXA7XHJcbiAgICAgICAgYXAuc2VsZWN0KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XHJcblxyXG4gICAgfVxyXG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICh0aGlzLmFpcnBsYW5lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgcmV0ID0gJzxkaXYgc3R5bGU9XCJkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAzMHB4IDMwcHggMzBweCAzMHB4O1wiPic7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5haXJwbGFuZS5wcm9kdWN0c1t4XSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgJzxkaXY+JyArIGFsbFByb2R1Y3RzW3hdLmdldEljb24oKSArIFwiIFwiICsgdGhpcy5haXJwbGFuZS5wcm9kdWN0c1t4XSArIFwiIFwiICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXQgKz0gXCI8ZGl2PlwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHMtbGlzdFwiKS5pbm5lckhUTUwgPSByZXQ7XHJcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xyXG4gICAgICAgICQoXCIucm91dGUtZGVsZXRlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikpLmNoZWNrZWQgPSAodGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA+IC0xKTtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgdmFyIGNvbXBhbmllcyA9IHRoaXMuY2l0eS5jb21wYW5pZXM7XHJcbiAgICAgICAgICB2YXIgYWxsID0gYWxsUHJvZHVjdHM7XHJcbiAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNvbXBhbmllcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgIHZhciB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIik7XHJcbiAgICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xyXG4gICAgICAgICAgICAgIHZhciBwcm9kdWN0ID0gYWxsW2NvbXBhbmllc1t4XS5wcm9kdWN0aWRdO1xyXG4gICAgICAgICAgICAgIHZhciBwcm9kdWNlID0gY29tcGFuaWVzW3hdLmdldERhaWx5UHJvZHVjZSgpO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzBdLmlubmVySFRNTCA9IHByb2R1Y2UgKyBcIiBcIiArIHByb2R1Y3QuZ2V0SWNvbigpO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzFdLmlubmVySFRNTCA9IHByb2R1Y3QubmFtZSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSBjb21wYW5pZXNbeF0uYnVpbGRpbmdzICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IGNvbXBhbmllc1t4XS53b3JrZXJzICsgXCIvXCIgKyBjb21wYW5pZXNbeF0uZ2V0TWF4V29ya2VycygpICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IFwiMTAwMFwiICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgIHZhciBuZWVkcyA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQxICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgIG5lZWRzID0gXCJcIiArIGNvbXBhbmllc1t4XS5nZXREYWlseUlucHV0MSgpICsgXCIgXCIgKyBhbGxbcHJvZHVjdC5pbnB1dDFdLmdldEljb24oKSArIFwiIFwiO1xyXG4gICAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICBuZWVkcyA9IG5lZWRzICsgXCJcIiArIGNvbXBhbmllc1t4XS5nZXREYWlseUlucHV0MigpICsgXCIgXCIgKyBhbGxbcHJvZHVjdC5pbnB1dDJdLmdldEljb24oKTtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlbls1XS5pbm5lckhUTUwgPSBuZWVkcyArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlbls2XS5pbm5lckhUTUwgPSAnPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIitcIj4nICsgXCI8L3RkPlwiICsgJzxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCItXCI+JyArIFwiPC90ZD5cIjtcclxuICBcclxuICAgICAgICAgIH0qL1xyXG5cclxuICAgIH1cclxuICAgIHVwZGF0ZVRpdGxlKCkge1xyXG4gICAgICAgIHZhciBzaWNvbiA9ICcnO1xyXG4gICAgICAgIGlmICgkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJykubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpWzBdLmlubmVySFRNTCA9IHRoaXMuYWlycGxhbmUubmFtZSArIFwiIFwiICsgdGhpcy5haXJwbGFuZS5zdGF0dXM7IC8vJzxpbWcgc3R5bGU9XCJmbG9hdDogcmlnaHRcIiBpZD1cImNpdHlkaWFsb2ctaWNvblwiIHNyYz1cIicgKyB0aGlzLmNpdHkuaWNvbiArICdcIiAgaGVpZ2h0PVwiMTVcIj48L2ltZz4gJyArIHRoaXMuY2l0eS5uYW1lICsgXCIgXCIgKyB0aGlzLmNpdHkucGVvcGxlO1xyXG4gICAgfVxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xyXG4gICAgICAgICAgICB3aWR0aDogXCIxOTBweFwiLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKFwiY2xvc2VcIik7XHJcbiAgICB9XHJcbn0iXX0=