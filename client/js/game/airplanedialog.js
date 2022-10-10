define(["require", "exports", "game/product", "game/icons", "game/route", "game/routedialog"], function (require, exports, product_1, icons_1, route_1, routedialog_1) {
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
            this.dropCitiesEnabled = false;
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
            <input id="airplanedialog-prev" type="button" value="<"/>
            <input id="airplanedialog-next" type="button" value=">"/>
          </div>
            <div id="airplanedialog-tabs">
                <ul>
                    <li><a href="#airplanedialog-products" class="airplanedialog-tabs">` + icons_1.Icons.table.replace('<span', '<span title="Load"') + `</a></li>
                    <li><a href="#airplanedialog-info" class="airplanedialog-tabs">` + icons_1.Icons.info.replace('<span', '<span title="Info"') + `</a></li>
                    <li  id="airplanedialog-route-tab"><a href="#airplanedialog-route" class="airplanedialog-tabs">` + icons_1.Icons.route.replace('<span', '<span title="Route"') + `</a></li>
                </ul>
                <div id="airplanedialog-products">
                    <div id="airplanedialog-products-list">
                            
                    </div>         
                </div>
                <div id="airplanedialog-info">
                    
                 </div>
                 <div id="airplanedialog-route">
                    <input type="checkbox" id="route-active"> active</input>
                    <button id="edit-route">` + icons_1.Icons.edit + `</button>
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
                $('.airplanedialog-tabs').click(function (event) {
                    if (event.target.getAttribute("href") === "#airplanedialog-route" ||
                        event.target.parentNode.getAttribute("href") === "#airplanedialog-route") {
                        _this.enableDropCities(true);
                    }
                    else {
                        _this.enableDropCities(false);
                    }
                });
                document.getElementById("edit-route").addEventListener('click', (e) => {
                    routedialog_1.RouteDialog.getInstance().airplane = _this.airplane;
                    routedialog_1.RouteDialog.getInstance().route = undefined;
                    if (_this.airplane.route.length > 0)
                        routedialog_1.RouteDialog.getInstance().route = _this.airplane.route[0];
                    else {
                        alert("no route defined");
                        return;
                    }
                    routedialog_1.RouteDialog.getInstance().show();
                });
            }, 500);
            //document.createElement("span");
        }
        enableDropCities(enable) {
            var _this = this;
            console.log("route " + (enable ? "enable" : "disable"));
            if (this.dropCitiesEnabled && !enable) {
                $(".city").draggable('destroy');
            }
            if (this.dropCitiesEnabled === false && enable) {
                $(".city").draggable({
                    connectToSortable: '#route-list',
                    helper: function (event) {
                        var id = parseInt(event.target.getAttribute("cityid"));
                        var city = _this.airplane.world.cities[id];
                        var ret = '<li id="route-' + id + '" class="ui-state-default"><img src="' + city.icon + '" </img>' + city.name + "</li>";
                        return $(ret);
                        // return helper._position.dom;
                    },
                    revert: 'invalid'
                });
            }
            this.dropCitiesEnabled = enable;
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
            if ($("#airplanedialog-route-tab").hasClass("ui-tabs-active")) {
                _this.enableDropCities(true);
            }
            //ui-tabs-active
            $(this.dom).dialog({
                width: "190px",
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update(true);
                },
                close: function () {
                    _this.enableDropCities(false);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFNQSxJQUFJLEdBQUcsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JULENBQUM7SUFDRixZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBQ08sV0FBVztZQUNmLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN4QixLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUV0QixJQUFJLEdBQUcsR0FBRyxRQUFRLENB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dHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbmltcG9ydCB7IGFsbFByb2R1Y3RzLCBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xyXG5pbXBvcnQgeyBBaXJwbGFuZSB9IGZyb20gXCJnYW1lL2FpcnBsYW5lXCI7XHJcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcclxuaW1wb3J0IHsgUm91dGUgfSBmcm9tIFwiZ2FtZS9yb3V0ZVwiO1xyXG5pbXBvcnQgeyBSb3V0ZURpYWxvZyB9IGZyb20gXCJnYW1lL3JvdXRlZGlhbG9nXCI7XHJcbnZhciBjc3MgPSBgXHJcbiAgICB0YWJsZXtcclxuICAgICAgICBmb250LXNpemU6aW5oZXJpdDtcclxuICAgIH1cclxuXHJcbiAgICAuYWlycGxhbmVkaWFsb2cgPip7XHJcbiAgICAgICAgZm9udC1zaXplOjEwcHg7IFxyXG4gICAgfVxyXG4gICAgLnVpLWRpYWxvZy10aXRsZXsgXHJcbiAgICAgICAgZm9udC1zaXplOjEwcHg7XHJcbiAgICB9XHJcbiAgICAudWktZGlhbG9nLXRpdGxlYmFye1xyXG4gICAgICAgIGhlaWdodDoxMHB4O1xyXG4gICAgfVxyXG4gICAgI3JvdXRlLWxpc3Q+bGl7XHJcbiAgICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lOyAvKiBSZW1vdmUgYnVsbGV0cyAqL1xyXG4gICAgICAgIHBhZGRpbmc6IDA7IC8qIFJlbW92ZSBwYWRkaW5nICovXHJcbiAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgfVxyXG4gICAgI3JvdXRlLWxpc3R7XHJcbiAgICAgICAgbWFyZ2luLWJsb2NrLXN0YXJ0OiAwcHg7XHJcbiAgICAgICAgbWFyZ2luLWJsb2NrLWVuZDogMHB4O1xyXG4gICAgICAgIHBhZGRpbmctaW5saW5lLXN0YXJ0OiAwcHg7XHJcbiAgICB9XHJcbmA7XHJcbi8vQHRzLWlnbm9yZVxyXG53aW5kb3cuYWlycGxhbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gQWlycGxhbmVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZTtcclxufVxyXG5leHBvcnQgY2xhc3MgQWlycGxhbmVEaWFsb2cge1xyXG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgX2FpcnBsYW5lOiBBaXJwbGFuZTtcclxuICAgIGhhc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcclxuICAgIHB1YmxpYyBkcm9wQ2l0aWVzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBaXJwbGFuZURpYWxvZyB7XHJcbiAgICAgICAgaWYgKEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlID0gbmV3IEFpcnBsYW5lRGlhbG9nKCk7XHJcbiAgICAgICAgcmV0dXJuIEFpcnBsYW5lRGlhbG9nLmluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgc2V0IGFpcnBsYW5lKHZhbHVlOiBBaXJwbGFuZSkge1xyXG4gICAgICAgIHRoaXMuX2FpcnBsYW5lID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3V0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGFpcnBsYW5lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9haXJwbGFuZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY3JlYXRlU3R5bGUoKSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBzdHlsZS5pZCA9IFwiYWlycGxhbmVkaWFsb2djc3NcIjtcclxuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XHJcblxyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nY3NzXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwiYWlycGxhbmVkaWFsb2dcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nXCI+XHJcbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2dcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNyZWF0ZVN0eWxlKCk7XHJcbiAgICAgICAgdmFyIGFpcnBsYW5lID0gdGhpcy5haXJwbGFuZTtcclxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBhbGxQcm9kdWN0cztcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI8XCIvPlxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9XCJhaXJwbGFuZWRpYWxvZy1uZXh0XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPlwiLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctdGFic1wiPlxyXG4gICAgICAgICAgICAgICAgPHVsPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMudGFibGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJMb2FkXCInKSArIGA8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNhaXJwbGFuZWRpYWxvZy1pbmZvXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMuaW5mby5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIkluZm9cIicpICsgYDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSAgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZS10YWJcIj48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIgY2xhc3M9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+YCsgSWNvbnMucm91dGUucmVwbGFjZSgnPHNwYW4nLCAnPHNwYW4gdGl0bGU9XCJSb3V0ZVwiJykgKyBgPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctaW5mb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInJvdXRlLWFjdGl2ZVwiPiBhY3RpdmU8L2lucHV0PlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJlZGl0LXJvdXRlXCI+YCtJY29ucy5lZGl0ICsgYDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cInJvdXRlLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xyXG4gICAgICAgICQoXCIjYWlycGxhbmVkaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgLy9jb2xsYXBzaWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2FpcnBsYW5lZGlhbG9nLXRhYnNcIikudGFicyh7XHJcbiAgICAgICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyAgJCggXCIjcm91dGUtbGlzdFwiICkuc29ydGFibGUoKTtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1uZXh0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihfdGhpcy5haXJwbGFuZSk7XHJcbiAgICAgICAgICAgICAgICBwb3MrKztcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPj0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0QWlycGxhY2UoX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW3Bvc10pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihfdGhpcy5haXJwbGFuZSk7XHJcbiAgICAgICAgICAgICAgICBwb3MtLTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPT09IC0xKVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUgPSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBhY3QgPSAoKDxhbnk+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikpLmNoZWNrZWQgPyAxIDogLTEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdCA9PT0gLTEgJiYgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPT09IDApXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPSAtMTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9IGFjdCAqIE1hdGguYWJzKF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJCgnLmFpcnBsYW5lZGlhbG9nLXRhYnMnKS5jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKSA9PT0gXCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiB8fFxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PmV2ZW50LnRhcmdldC5wYXJlbnROb2RlKS5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyh0cnVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyhmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXQtcm91dGVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5haXJwbGFuZT1fdGhpcy5haXJwbGFuZTtcclxuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkucm91dGU9dW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgaWYoX3RoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoPjApXHJcbiAgICAgICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZT1fdGhpcy5haXJwbGFuZS5yb3V0ZVswXTtcclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJubyByb3V0ZSBkZWZpbmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFJvdXRlRGlhbG9nLmdldEluc3RhbmNlKCkuc2hvdygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgfVxyXG4gICAgZW5hYmxlRHJvcENpdGllcyhlbmFibGU6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgX3RoaXM9dGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJvdXRlIFwiKyhlbmFibGUgPyBcImVuYWJsZVwiIDogXCJkaXNhYmxlXCIpKTtcclxuICAgICAgICBpZiAodGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCAmJiAhZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoJ2Rlc3Ryb3knKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZHJvcENpdGllc0VuYWJsZWQgPT09IGZhbHNlICYmIGVuYWJsZSkge1xyXG4gICAgICAgICAgICAkKFwiLmNpdHlcIikuZHJhZ2dhYmxlKHtcclxuICAgICAgICAgICAgICAgIGNvbm5lY3RUb1NvcnRhYmxlOiAnI3JvdXRlLWxpc3QnLFxyXG4gICAgICAgICAgICAgICAgaGVscGVyOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2l0eWlkXCIpKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2l0eT1fdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSAnPGxpIGlkPVwicm91dGUtJyArIGlkICsgJ1wiIGNsYXNzPVwidWktc3RhdGUtZGVmYXVsdFwiPjxpbWcgc3JjPVwiJyArIGNpdHkuaWNvbiArICdcIiA8L2ltZz4nICsgY2l0eS5uYW1lICsgXCI8L2xpPlwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJChyZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBoZWxwZXIuX3Bvc2l0aW9uLmRvbTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICByZXZlcnQ6ICdpbnZhbGlkJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kcm9wQ2l0aWVzRW5hYmxlZD1lbmFibGU7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVEYXRhKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIGNoaWxkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKS5jaGlsZHJlbjtcclxuICAgICAgICB2YXIgb2xkOiBSb3V0ZVtdID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBfdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBvbGQucHVzaChfdGhpcy5haXJwbGFuZS5yb3V0ZVt4XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF90aGlzLmFpcnBsYW5lLnJvdXRlID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaGlsZHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkc1t4XS5pZCA9PT0gXCJyb3V0ZS1kdW1teVwiKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIHZhciBzaWQgPSBjaGlsZHNbeF0uaWQuc3BsaXQoXCItXCIpWzFdO1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQpO1xyXG4gICAgICAgICAgICB2YXIgZm91bmQ6IFJvdXRlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IG9sZC5sZW5ndGg7IHkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZFt5XS5jaXR5aWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBvbGRbeV07XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkLnNwbGljZSh5LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm91bmQgPSBuZXcgUm91dGUoKTtcclxuICAgICAgICAgICAgICAgIGZvdW5kLmNpdHlpZCA9IGlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLnJvdXRlLnB1c2goZm91bmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHVwZGF0ZVJvdXRlKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtbGlzdFwiKSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBodG1sID0gXCJcIjtcclxuICAgICAgICBpZiAodGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIGh0bWwgPSAnPGxpIGlkPVwicm91dGUtZHVtbXlcIj5kcmFnIGFuZCBkcm9wIGNpdGllcyBoZXJlPC9saT4nO1xyXG4gICAgICAgIHZhciBpZHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIGlkID0gdGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWQ7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gJzxsaSBpZD1cInJvdXRlLScgKyBpZCArICdcIiBjbGFzcz1cInVpLXN0YXRlLWRlZmF1bHRcIj48aW1nIHNyYz1cIicgKyB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0uaWNvbiArICdcIiA8L2ltZz4nICtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzW2lkXS5uYW1lICsgXCIgXCIgKyBJY29ucy50cmFzaC5yZXBsYWNlKFwibWRpIFwiLCBcIm1kaSByb3V0ZS1kZWxldGVcIikgKyBcIjwvbGk+XCI7XHJcblxyXG4gICAgICAgICAgICBpZHMucHVzaCh0aGlzLmFpcnBsYW5lLnJvdXRlW3hdLmNpdHlpZCk7XHJcbiAgICAgICAgICAgIC8vdmFyIHNkb207XHJcbiAgICAgICAgICAgIC8vdmFyIGRvbTpIVE1MU3BhbkVsZW1lbnQ9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgICAgICAkKFwiI3JvdXRlLWxpc3RcIikuc29ydGFibGUoe1xyXG4gICAgICAgICAgICB1cGRhdGU6IChldmVudCwgdWkpID0+IHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZURhdGEoKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZVJvdXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgNTApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvLyAgJChcImFpcnBsYW5lZGlhbG9nLXJvdXRlXCIpLnNvcnRhYmxlXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1swXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzBdLm5hbWUrYDwvc3Bhbj4gXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMV0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1sxXS5uYW1lK2A8L3NwYW4+IFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgPHNwYW4+YCt0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5pY29uK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzNdLm5hbWUrYDwvc3Bhbj4gXHJcblxyXG4gICAgfVxyXG4gICAgc2VsZWN0QWlycGxhY2UoYXApIHtcclxuICAgICAgICB0aGlzLmFpcnBsYW5lID0gYXA7XHJcbiAgICAgICAgYXAud29ybGQuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xyXG4gICAgICAgIGFwLndvcmxkLnNlbGVjdGlvbiA9IGFwO1xyXG4gICAgICAgIGFwLnNlbGVjdCgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xyXG5cclxuICAgIH1cclxuICAgIHVwZGF0ZShmb3JjZSA9IGZhbHNlKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5haXJwbGFuZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdmFyIHJldCA9ICc8ZGl2IHN0eWxlPVwiZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczogMzBweCAzMHB4IDMwcHggMzBweDtcIj4nO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsUHJvZHVjdHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gIT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldCA9IHJldCArICc8ZGl2PicgKyBhbGxQcm9kdWN0c1t4XS5nZXRJY29uKCkgKyBcIiBcIiArIHRoaXMuYWlycGxhbmUucHJvZHVjdHNbeF0gKyBcIiBcIiArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0ICs9IFwiPGRpdj5cIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByb2R1Y3RzLWxpc3RcIikuaW5uZXJIVE1MID0gcmV0O1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGl0bGUoKTtcclxuICAgICAgICAkKFwiLnJvdXRlLWRlbGV0ZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnbGknKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlRGF0YSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICg8YW55PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYWN0aXZlXCIpKS5jaGVja2VkID0gKHRoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUgPiAtMSk7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgIHZhciBjb21wYW5pZXMgPSB0aGlzLmNpdHkuY29tcGFuaWVzO1xyXG4gICAgICAgICAgdmFyIGFsbCA9IGFsbFByb2R1Y3RzO1xyXG4gICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wYW5pZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYmxlXCIpO1xyXG4gICAgICAgICAgICAgIHZhciB0ciA9IHRhYmxlLmNoaWxkcmVuWzBdLmNoaWxkcmVuW3ggKyAxXTtcclxuICAgICAgICAgICAgICB2YXIgcHJvZHVjdCA9IGFsbFtjb21wYW5pZXNbeF0ucHJvZHVjdGlkXTtcclxuICAgICAgICAgICAgICB2YXIgcHJvZHVjZSA9IGNvbXBhbmllc1t4XS5nZXREYWlseVByb2R1Y2UoKTtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlblswXS5pbm5lckhUTUwgPSBwcm9kdWNlICsgXCIgXCIgKyBwcm9kdWN0LmdldEljb24oKTtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlblsxXS5pbm5lckhUTUwgPSBwcm9kdWN0Lm5hbWUgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gY29tcGFuaWVzW3hdLmJ1aWxkaW5ncyArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlblszXS5pbm5lckhUTUwgPSBjb21wYW5pZXNbeF0ud29ya2VycyArIFwiL1wiICsgY29tcGFuaWVzW3hdLmdldE1heFdvcmtlcnMoKSArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICB0ci5jaGlsZHJlbls0XS5pbm5lckhUTUwgPSBcIjEwMDBcIiArIFwiPC90ZD5cIjtcclxuICAgICAgICAgICAgICB2YXIgbmVlZHMgPSBcIlwiO1xyXG4gICAgICAgICAgICAgIGlmIChwcm9kdWN0LmlucHV0MSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICBuZWVkcyA9IFwiXCIgKyBjb21wYW5pZXNbeF0uZ2V0RGFpbHlJbnB1dDEoKSArIFwiIFwiICsgYWxsW3Byb2R1Y3QuaW5wdXQxXS5nZXRJY29uKCkgKyBcIiBcIjtcclxuICAgICAgICAgICAgICBpZiAocHJvZHVjdC5pbnB1dDIgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgbmVlZHMgPSBuZWVkcyArIFwiXCIgKyBjb21wYW5pZXNbeF0uZ2V0RGFpbHlJbnB1dDIoKSArIFwiIFwiICsgYWxsW3Byb2R1Y3QuaW5wdXQyXS5nZXRJY29uKCk7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNV0uaW5uZXJIVE1MID0gbmVlZHMgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNl0uaW5uZXJIVE1MID0gJzxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCIrXCI+JyArIFwiPC90ZD5cIiArICc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiLVwiPicgKyBcIjwvdGQ+XCI7XHJcbiAgXHJcbiAgICAgICAgICB9Ki9cclxuXHJcbiAgICB9XHJcbiAgICB1cGRhdGVUaXRsZSgpIHtcclxuICAgICAgICB2YXIgc2ljb24gPSAnJztcclxuICAgICAgICBpZiAoJCh0aGlzLmRvbSkucGFyZW50KCkuZmluZCgnLnVpLWRpYWxvZy10aXRsZScpLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKVswXS5pbm5lckhUTUwgPSB0aGlzLmFpcnBsYW5lLm5hbWUgKyBcIiBcIiArIHRoaXMuYWlycGxhbmUuc3RhdHVzOyAvLyc8aW1nIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0XCIgaWQ9XCJjaXR5ZGlhbG9nLWljb25cIiBzcmM9XCInICsgdGhpcy5jaXR5Lmljb24gKyAnXCIgIGhlaWdodD1cIjE1XCI+PC9pbWc+ICcgKyB0aGlzLmNpdHkubmFtZSArIFwiIFwiICsgdGhpcy5jaXR5LnBlb3BsZTtcclxuICAgIH1cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICBpZiAoJChcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZS10YWJcIikuaGFzQ2xhc3MoXCJ1aS10YWJzLWFjdGl2ZVwiKSkge1xyXG4gICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL3VpLXRhYnMtYWN0aXZlXHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcclxuICAgICAgICAgICAgd2lkdGg6IFwiMTkwcHhcIixcclxuICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOntteTpcImxlZnQgdG9wXCIsYXQ6XCJyaWdodCB0b3BcIixvZjokKGRvY3VtZW50KX0gLFxyXG4gICAgICAgICAgICBvcGVuOiBmdW5jdGlvbiAoZXZlbnQsIHVpKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmNzcyh7IHBvc2l0aW9uOiBcImZpeGVkXCIgfSk7XHJcblxyXG4gICAgfVxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKFwiY2xvc2VcIik7XHJcbiAgICB9XHJcbn0iXX0=