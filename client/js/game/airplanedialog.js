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
                    found.airplane = _this.airplane;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWlycGxhbmVkaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL2FpcnBsYW5lZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFNQSxJQUFJLEdBQUcsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JULENBQUM7SUFDRixZQUFZO0lBQ1osTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNkLE9BQU8sY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNqRCxDQUFDLENBQUE7SUFDRCxNQUFhLGNBQWM7UUFNdkI7WUFIQSxjQUFTLEdBQUcsS0FBSyxDQUFDO1lBRVgsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1lBRTdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDckMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsSUFBSSxRQUFRLENBQUMsS0FBZTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksUUFBUTtZQUNSLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMxQixDQUFDO1FBQ08sV0FBVztZQUNmLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDNUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN4QixLQUFLLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztZQUV0QixJQUFJLEdBQUcsR0FBRyxRQUFRLENB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Q0o7SUFyVEQsd0NBcVRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMsIFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IFJvdXRlRGlhbG9nIH0gZnJvbSBcImdhbWUvcm91dGVkaWFsb2dcIjtcclxudmFyIGNzcyA9IGBcclxuICAgIHRhYmxle1xyXG4gICAgICAgIGZvbnQtc2l6ZTppbmhlcml0O1xyXG4gICAgfVxyXG5cclxuICAgIC5haXJwbGFuZWRpYWxvZyA+KntcclxuICAgICAgICBmb250LXNpemU6MTBweDsgXHJcbiAgICB9XHJcbiAgICAudWktZGlhbG9nLXRpdGxleyBcclxuICAgICAgICBmb250LXNpemU6MTBweDtcclxuICAgIH1cclxuICAgIC51aS1kaWFsb2ctdGl0bGViYXJ7XHJcbiAgICAgICAgaGVpZ2h0OjEwcHg7XHJcbiAgICB9XHJcbiAgICAjcm91dGUtbGlzdD5saXtcclxuICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7IC8qIFJlbW92ZSBidWxsZXRzICovXHJcbiAgICAgICAgcGFkZGluZzogMDsgLyogUmVtb3ZlIHBhZGRpbmcgKi9cclxuICAgICAgICBtYXJnaW46IDA7XHJcbiAgICB9XHJcbiAgICAjcm91dGUtbGlzdHtcclxuICAgICAgICBtYXJnaW4tYmxvY2stc3RhcnQ6IDBweDtcclxuICAgICAgICBtYXJnaW4tYmxvY2stZW5kOiAwcHg7XHJcbiAgICAgICAgcGFkZGluZy1pbmxpbmUtc3RhcnQ6IDBweDtcclxuICAgIH1cclxuYDtcclxuLy9AdHMtaWdub3JlXHJcbndpbmRvdy5haXJwbGFuZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBBaXJwbGFuZURpYWxvZyB7XHJcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfYWlycGxhbmU6IEFpcnBsYW5lO1xyXG4gICAgaGFzUGF1c2VkID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xyXG4gICAgcHVibGljIGRyb3BDaXRpZXNFbmFibGVkID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IEFpcnBsYW5lRGlhbG9nIHtcclxuICAgICAgICBpZiAoQWlycGxhbmVEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgQWlycGxhbmVEaWFsb2cuaW5zdGFuY2UgPSBuZXcgQWlycGxhbmVEaWFsb2coKTtcclxuICAgICAgICByZXR1cm4gQWlycGxhbmVEaWFsb2cuaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICBzZXQgYWlycGxhbmUodmFsdWU6IEFpcnBsYW5lKSB7XHJcbiAgICAgICAgdGhpcy5fYWlycGxhbmUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVJvdXRlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgYWlycGxhbmUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FpcnBsYW5lO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTdHlsZSgpIHtcclxuICAgICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG4gICAgICAgIHN0eWxlLmlkID0gXCJhaXJwbGFuZWRpYWxvZ2Nzc1wiO1xyXG4gICAgICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xyXG4gICAgICAgIHN0eWxlLmlubmVySFRNTCA9IGNzcztcclxuXHJcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVkaWFsb2djc3NcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcclxuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJhaXJwbGFuZWRpYWxvZ1wiIGNsYXNzPVwiYWlycGxhbmVkaWFsb2dcIj5cclxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cclxuICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZ1wiKTtcclxuICAgICAgICBpZiAob2xkKSB7XHJcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3JlYXRlU3R5bGUoKTtcclxuICAgICAgICB2YXIgYWlycGxhbmUgPSB0aGlzLmFpcnBsYW5lO1xyXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGlucHV0IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJldlwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIjxcIi8+XHJcbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImFpcnBsYW5lZGlhbG9nLW5leHRcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCI+XCIvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy10YWJzXCI+XHJcbiAgICAgICAgICAgICAgICA8dWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctcHJvZHVjdHNcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy50YWJsZS5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIkxvYWRcIicpICsgYDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2FpcnBsYW5lZGlhbG9nLWluZm9cIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy5pbmZvLnJlcGxhY2UoJzxzcGFuJywgJzxzcGFuIHRpdGxlPVwiSW5mb1wiJykgKyBgPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpICBpZD1cImFpcnBsYW5lZGlhbG9nLXJvdXRlLXRhYlwiPjxhIGhyZWY9XCIjYWlycGxhbmVkaWFsb2ctcm91dGVcIiBjbGFzcz1cImFpcnBsYW5lZGlhbG9nLXRhYnNcIj5gKyBJY29ucy5yb3V0ZS5yZXBsYWNlKCc8c3BhbicsICc8c3BhbiB0aXRsZT1cIlJvdXRlXCInKSArIGA8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWlycGxhbmVkaWFsb2ctcHJvZHVjdHMtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhaXJwbGFuZWRpYWxvZy1pbmZvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImFpcnBsYW5lZGlhbG9nLXJvdXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwicm91dGUtYWN0aXZlXCI+IGFjdGl2ZTwvaW5wdXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImVkaXQtcm91dGVcIj5gK0ljb25zLmVkaXQgKyBgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwicm91dGUtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XHJcbiAgICAgICAgJChcIiNhaXJwbGFuZWRpYWxvZy10YWJzXCIpLnRhYnMoe1xyXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjYWlycGxhbmVkaWFsb2ctdGFic1wiKS50YWJzKHtcclxuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vICAkKCBcIiNyb3V0ZS1saXN0XCIgKS5zb3J0YWJsZSgpO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbSk7XHJcblxyXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLW5leHRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcclxuICAgICAgICAgICAgICAgIHBvcysrO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RBaXJwbGFjZShfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXNbcG9zXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lZGlhbG9nLXByZXZcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKF90aGlzLmFpcnBsYW5lKTtcclxuICAgICAgICAgICAgICAgIHBvcy0tO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA9PT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZSA9IF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lc1twb3NdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1hY3RpdmVcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFjdCA9ICgoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA/IDEgOiAtMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYWN0ID09PSAtMSAmJiBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5hY3RpdmVSb3V0ZSA9IC0xO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID0gYWN0ICogTWF0aC5hYnMoX3RoaXMuYWlycGxhbmUuYWN0aXZlUm91dGUpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKCcuYWlycGxhbmVkaWFsb2ctdGFicycpLmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+ZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUpLmdldEF0dHJpYnV0ZShcImhyZWZcIikgPT09IFwiI2FpcnBsYW5lZGlhbG9nLXJvdXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbmFibGVEcm9wQ2l0aWVzKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdC1yb3V0ZVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLmFpcnBsYW5lPV90aGlzLmFpcnBsYW5lO1xyXG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5yb3V0ZT11bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBpZihfdGhpcy5haXJwbGFuZS5yb3V0ZS5sZW5ndGg+MClcclxuICAgICAgICAgICAgICAgICAgICBSb3V0ZURpYWxvZy5nZXRJbnN0YW5jZSgpLnJvdXRlPV90aGlzLmFpcnBsYW5lLnJvdXRlWzBdO1xyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIm5vIHJvdXRlIGRlZmluZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgUm91dGVEaWFsb2cuZ2V0SW5zdGFuY2UoKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB9XHJcbiAgICBlbmFibGVEcm9wQ2l0aWVzKGVuYWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBfdGhpcz10aGlzO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicm91dGUgXCIrKGVuYWJsZSA/IFwiZW5hYmxlXCIgOiBcImRpc2FibGVcIikpO1xyXG4gICAgICAgIGlmICh0aGlzLmRyb3BDaXRpZXNFbmFibGVkICYmICFlbmFibGUpIHtcclxuICAgICAgICAgICAgJChcIi5jaXR5XCIpLmRyYWdnYWJsZSgnZGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5kcm9wQ2l0aWVzRW5hYmxlZCA9PT0gZmFsc2UgJiYgZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICQoXCIuY2l0eVwiKS5kcmFnZ2FibGUoe1xyXG4gICAgICAgICAgICAgICAgY29ubmVjdFRvU29ydGFibGU6ICcjcm91dGUtbGlzdCcsXHJcbiAgICAgICAgICAgICAgICBoZWxwZXI6IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJjaXR5aWRcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaXR5PV90aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9ICc8bGkgaWQ9XCJyb3V0ZS0nICsgaWQgKyAnXCIgY2xhc3M9XCJ1aS1zdGF0ZS1kZWZhdWx0XCI+PGltZyBzcmM9XCInICsgY2l0eS5pY29uICsgJ1wiIDwvaW1nPicgKyBjaXR5Lm5hbWUgKyBcIjwvbGk+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKHJldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIGhlbHBlci5fcG9zaXRpb24uZG9tO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHJldmVydDogJ2ludmFsaWQnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyb3BDaXRpZXNFbmFibGVkPWVuYWJsZTtcclxuICAgIH1cclxuICAgIHVwZGF0ZURhdGEoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgY2hpbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmNoaWxkcmVuO1xyXG4gICAgICAgIHZhciBvbGQ6IFJvdXRlW10gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IF90aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIG9sZC5wdXNoKF90aGlzLmFpcnBsYW5lLnJvdXRlW3hdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX3RoaXMuYWlycGxhbmUucm91dGUgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNoaWxkcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGRzW3hdLmlkID09PSBcInJvdXRlLWR1bW15XCIpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgdmFyIHNpZCA9IGNoaWxkc1t4XS5pZC5zcGxpdChcIi1cIilbMV07XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHBhcnNlSW50KHNpZCk7XHJcbiAgICAgICAgICAgIHZhciBmb3VuZDogUm91dGUgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgb2xkLmxlbmd0aDsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkW3ldLmNpdHlpZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IG9sZFt5XTtcclxuICAgICAgICAgICAgICAgICAgICBvbGQuc3BsaWNlKHksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmb3VuZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3VuZCA9IG5ldyBSb3V0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZm91bmQuYWlycGxhbmU9X3RoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgICAgICAgICBmb3VuZC5jaXR5aWQgPSBpZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5yb3V0ZS5wdXNoKGZvdW5kKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB1cGRhdGVSb3V0ZSgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWxpc3RcIikgPT09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUucm91dGUubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICBodG1sID0gJzxsaSBpZD1cInJvdXRlLWR1bW15XCI+ZHJhZyBhbmQgZHJvcCBjaXRpZXMgaGVyZTwvbGk+JztcclxuICAgICAgICB2YXIgaWRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLnJvdXRlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuYWlycGxhbmUucm91dGVbeF0uY2l0eWlkO1xyXG4gICAgICAgICAgICBodG1sICs9ICc8bGkgaWQ9XCJyb3V0ZS0nICsgaWQgKyAnXCIgY2xhc3M9XCJ1aS1zdGF0ZS1kZWZhdWx0XCI+PGltZyBzcmM9XCInICsgdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbaWRdLmljb24gKyAnXCIgPC9pbWc+JyArXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1tpZF0ubmFtZSArIFwiIFwiICsgSWNvbnMudHJhc2gucmVwbGFjZShcIm1kaSBcIiwgXCJtZGkgcm91dGUtZGVsZXRlXCIpICsgXCI8L2xpPlwiO1xyXG5cclxuICAgICAgICAgICAgaWRzLnB1c2godGhpcy5haXJwbGFuZS5yb3V0ZVt4XS5jaXR5aWQpO1xyXG4gICAgICAgICAgICAvL3ZhciBzZG9tO1xyXG4gICAgICAgICAgICAvL3ZhciBkb206SFRNTFNwYW5FbGVtZW50PSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb3V0ZS1saXN0XCIpLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICAgICAgJChcIiNyb3V0ZS1saXN0XCIpLnNvcnRhYmxlKHtcclxuICAgICAgICAgICAgdXBkYXRlOiAoZXZlbnQsIHVpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVEYXRhKCk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGVSb3V0ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gICQoXCJhaXJwbGFuZWRpYWxvZy1yb3V0ZVwiKS5zb3J0YWJsZVxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMF0uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1swXS5uYW1lK2A8L3NwYW4+IFxyXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICA8c3Bhbj5gK3RoaXMuYWlycGxhbmUud29ybGQuY2l0aWVzWzFdLmljb24rdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbMV0ubmFtZStgPC9zcGFuPiBcclxuICAgICAgICAvLyAgICAgICAgICAgICAgIDxzcGFuPmArdGhpcy5haXJwbGFuZS53b3JsZC5jaXRpZXNbM10uaWNvbit0aGlzLmFpcnBsYW5lLndvcmxkLmNpdGllc1szXS5uYW1lK2A8L3NwYW4+IFxyXG5cclxuICAgIH1cclxuICAgIHNlbGVjdEFpcnBsYWNlKGFwKSB7XHJcbiAgICAgICAgdGhpcy5haXJwbGFuZSA9IGFwO1xyXG4gICAgICAgIGFwLndvcmxkLnNlbGVjdGlvbj8udW5zZWxlY3QoKTtcclxuICAgICAgICBhcC53b3JsZC5zZWxlY3Rpb24gPSBhcDtcclxuICAgICAgICBhcC5zZWxlY3QoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcclxuXHJcbiAgICB9XHJcbiAgICB1cGRhdGUoZm9yY2UgPSBmYWxzZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuYWlycGxhbmUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciByZXQgPSAnPGRpdiBzdHlsZT1cImRpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDMwcHggMzBweCAzMHB4IDMwcHg7XCI+JztcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFpcnBsYW5lLnByb2R1Y3RzW3hdICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPGRpdj4nICsgYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCIgXCIgKyB0aGlzLmFpcnBsYW5lLnByb2R1Y3RzW3hdICsgXCIgXCIgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldCArPSBcIjxkaXY+XCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZWRpYWxvZy1wcm9kdWN0cy1saXN0XCIpLmlubmVySFRNTCA9IHJldDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVRpdGxlKCk7XHJcbiAgICAgICAgJChcIi5yb3V0ZS1kZWxldGVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZURhdGEoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAoPGFueT5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWFjdGl2ZVwiKSkuY2hlY2tlZCA9ICh0aGlzLmFpcnBsYW5lLmFjdGl2ZVJvdXRlID4gLTEpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICB2YXIgY29tcGFuaWVzID0gdGhpcy5jaXR5LmNvbXBhbmllcztcclxuICAgICAgICAgIHZhciBhbGwgPSBhbGxQcm9kdWN0cztcclxuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcGFuaWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLWJ1aWxkaW5ncy10YWJsZVwiKTtcclxuICAgICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XHJcbiAgICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSBhbGxbY29tcGFuaWVzW3hdLnByb2R1Y3RpZF07XHJcbiAgICAgICAgICAgICAgdmFyIHByb2R1Y2UgPSBjb21wYW5pZXNbeF0uZ2V0RGFpbHlQcm9kdWNlKCk7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gcHJvZHVjZSArIFwiIFwiICsgcHJvZHVjdC5nZXRJY29uKCk7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bMV0uaW5uZXJIVE1MID0gcHJvZHVjdC5uYW1lICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzJdLmlubmVySFRNTCA9IGNvbXBhbmllc1t4XS5idWlsZGluZ3MgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gY29tcGFuaWVzW3hdLndvcmtlcnMgKyBcIi9cIiArIGNvbXBhbmllc1t4XS5nZXRNYXhXb3JrZXJzKCkgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgdHIuY2hpbGRyZW5bNF0uaW5uZXJIVE1MID0gXCIxMDAwXCIgKyBcIjwvdGQ+XCI7XHJcbiAgICAgICAgICAgICAgdmFyIG5lZWRzID0gXCJcIjtcclxuICAgICAgICAgICAgICBpZiAocHJvZHVjdC5pbnB1dDEgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgbmVlZHMgPSBcIlwiICsgY29tcGFuaWVzW3hdLmdldERhaWx5SW5wdXQxKCkgKyBcIiBcIiArIGFsbFtwcm9kdWN0LmlucHV0MV0uZ2V0SWNvbigpICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQyICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgIG5lZWRzID0gbmVlZHMgKyBcIlwiICsgY29tcGFuaWVzW3hdLmdldERhaWx5SW5wdXQyKCkgKyBcIiBcIiArIGFsbFtwcm9kdWN0LmlucHV0Ml0uZ2V0SWNvbigpO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzVdLmlubmVySFRNTCA9IG5lZWRzICsgXCI8L3RkPlwiO1xyXG4gICAgICAgICAgICAgIHRyLmNoaWxkcmVuWzZdLmlubmVySFRNTCA9ICc8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiK1wiPicgKyBcIjwvdGQ+XCIgKyAnPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIi1cIj4nICsgXCI8L3RkPlwiO1xyXG4gIFxyXG4gICAgICAgICAgfSovXHJcblxyXG4gICAgfVxyXG4gICAgdXBkYXRlVGl0bGUoKSB7XHJcbiAgICAgICAgdmFyIHNpY29uID0gJyc7XHJcbiAgICAgICAgaWYgKCQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJylbMF0uaW5uZXJIVE1MID0gdGhpcy5haXJwbGFuZS5uYW1lICsgXCIgXCIgKyB0aGlzLmFpcnBsYW5lLnN0YXR1czsgLy8nPGltZyBzdHlsZT1cImZsb2F0OiByaWdodFwiIGlkPVwiY2l0eWRpYWxvZy1pY29uXCIgc3JjPVwiJyArIHRoaXMuY2l0eS5pY29uICsgJ1wiICBoZWlnaHQ9XCIxNVwiPjwvaW1nPiAnICsgdGhpcy5jaXR5Lm5hbWUgKyBcIiBcIiArIHRoaXMuY2l0eS5wZW9wbGU7XHJcbiAgICB9XHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgaWYgKCQoXCIjYWlycGxhbmVkaWFsb2ctcm91dGUtdGFiXCIpLmhhc0NsYXNzKFwidWktdGFicy1hY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjE5MHB4XCIsXHJcbiAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjp7bXk6XCJsZWZ0IHRvcFwiLGF0OlwicmlnaHQgdG9wXCIsb2Y6JChkb2N1bWVudCl9ICxcclxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKHRydWUpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZW5hYmxlRHJvcENpdGllcyhmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xyXG4gICAgfVxyXG59Il19