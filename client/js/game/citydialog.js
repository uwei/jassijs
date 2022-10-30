define(["require", "exports", "game/city", "game/icons", "game/citydialogmarket", "game/citydialogshop"], function (require, exports, city_1, icons_1, citydialogmarket_1, citydialogshop_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CityDialog = void 0;
    //@ts-ignore
    window.city = function () {
        return CityDialog.getInstance().city;
    };
    class CityDialog {
        constructor() {
            this.hasPaused = false;
            this.create();
        }
        static getInstance() {
            if (CityDialog.instance === undefined)
                CityDialog.instance = new CityDialog();
            return CityDialog.instance;
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="citydialog" class="citydialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("citydialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            var products = parameter.allProducts;
            var _this = this;
            var city = _this.city;
            var sdom = `
          <div>
          <div>
            <input id="citydialog-prev" type="button" value="<"/>
            <input id="citydialog-next" type="button" value=">"/>
          </div>
            <div id="citydialog-tabs">
                <ul>
                    <li><a href="#citydialog-market" id="citydialog-market-tab" class="citydialog-tabs">Market</a></li>
                    <li><a href="#citydialog-buildings" id="citydialog-buildings-tab" class="citydialog-tabs">Buildings</a></li>
                    <li><a href="#citydialog-shop" id="citydialog-shop-tab"  class="citydialog-tabs">` + icons_1.Icons.shop + ` MyShop</a></li>
                    <li><a href="#citydialog-construction" id="citydialog-construction-tab" class="citydialog-tabs">Construction</a></li>
                    <li><a href="#citydialog-score" id="citydialog-score-tab"  class="citydialog-tabs">Score</a></li>
                </ul>
                <div id="citydialog-market">` + citydialogmarket_1.CityDialogMarket.getInstance().create() + `
                </div>
                <div id="citydialog-buildings"> ` + this.createBuildings() + `
                </div>
                <div id="citydialog-shop">` + citydialogshop_1.CityDialogShop.getInstance().create() + `
                </div>
                <div id="citydialog-construction">` + this.createConstruction() + `
                </div>
                <div id="citydialog-score">` + this.createScore() + `
                </div>
          </div>
        `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
            this.dom.removeChild(this.dom.children[0]);
            this.dom.appendChild(newdom);
            $("#citydialog-tabs").tabs({
            //collapsible: true
            });
            setTimeout(() => {
                $("#citydialog-tabs").tabs({
                //collapsible: true
                });
            }, 100);
            document.body.appendChild(this.dom);
            //        document.getElementById("citydialog-prev")
            setTimeout(() => { _this.bindActions(); }, 500);
            //document.createElement("span");
        }
        createBuildings() {
            return `<table id="citydialog-buildings-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Produce</th>
                            <th> </th>
                            <th>Buildings</th>
                            <th>Jobs</th>
                            <th>Needs</th>
                            <th></th>
                            <th>Actions</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < 5; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + "<td></td>";
                    ret = ret + '<td><button id="new-factory_' + x + '">' + "+" + icons_1.Icons.factory + '</button>' +
                        '<button id="delete-factory_' + x + '">' + "-" + icons_1.Icons.factory + '</button>' +
                        '<button id="buy-license_' + x + '">' + "buy license to produce for 50.000" + icons_1.Icons.money + '</button>' +
                        '<div id="no-shop_' + x + '">need a shop to produce</div>' +
                        '</td>';
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>
                    <br/>
                        <br/>
                        <b>My-Shops</b>
                    <br/>
                       ` + icons_1.Icons.shop + ` Shops: <span id="count-shops">0/0</span>  
                        ` + ` costs: <span id="costs-shops">0</span> ` + icons_1.Icons.money + `  
                        <button id="buy-shop">+` + icons_1.Icons.home + ` for 15.000` + icons_1.Icons.money + " 20x" + parameter.allProducts[0].getIcon() +
                " 40x" + parameter.allProducts[1].getIcon() + `</button> 
                        <button id="delete-shop">-` + icons_1.Icons.home + `</button>`;
        }
        createScore() {
            return `<table id="citydialog-score-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Name</th>
                            <th> </th>
                            <th>Produce</th>
                            <th>Need</th>
                            <th>Score</th>
                        </tr>
                       ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allProducts.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allProducts[x].getIcon() + "</td>";
                    ret = ret + "<td>" + parameter.allProducts[x].name + "</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "<td>0</td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}
                    </table>`;
        }
        createConstruction() {
            return `<table id="citydialog-construction-table" style="height:100%;weight:100%;">
                        <tr>
                            <th>Model</th>
                            <th>Speed</th>
                            <th>Capacity</th>
                            <th>Daily Costs</th>
                            <th>Build days</th>
                            <th>Action</th>
                        </tr>
                        ${(function fun() {
                var ret = "";
                for (var x = 0; x < parameter.allAirplaneTypes.length; x++) {
                    ret = ret + "<tr>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].model + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].speed + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].capacity + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].costs + "</td>";
                    ret = ret + "<td>" + parameter.allAirplaneTypes[x].buildDays + "</td>";
                    ret = ret + "<td>" + '<button id="new-airplane_' + x + '">' + "+" + icons_1.Icons.airplane + " " +
                        city_1.City.getBuildingCostsAsIcon(Math.round(parameter.allAirplaneTypes[x].buildingCosts * parameter.rateCostsAirplaine), parameter.allAirplaneTypes[x].buildingMaterial) + "</button></td>";
                    ret = ret + "</tr>";
                }
                return ret;
            })()}  
                </table>

                <table id="citydialog-constructionqueue-table" style="height:100%;weight:100%;">
                        
                </table> 
            
            `;
        }
        bindActions() {
            var _this = this;
            document.getElementById("citydialog-next").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos++;
                if (pos >= _this.city.world.cities.length - 1)
                    pos = 0;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });
            document.getElementById("citydialog-prev").addEventListener("click", (ev) => {
                var pos = _this.city.world.cities.indexOf(_this.city);
                pos--;
                if (pos === -1)
                    pos = _this.city.world.cities.length - 2;
                _this.city = _this.city.world.cities[pos];
                _this.update(true);
            });
            for (var x = 0; x < 5; x++) {
                document.getElementById("new-factory_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    if (!_this.city.commitBuildingCosts(comp.getBuildingCosts(), comp.getBuildingMaterial(), "buy building"))
                        return;
                    _this.city.buildBuilding(comp.productid);
                    //comp.buildings++;
                    _this.update();
                });
                document.getElementById("delete-factory_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    if (_this.city.tryRemoveBuildingInProgress(comp.productid)) {
                        _this.update();
                        return;
                    }
                    if (comp.buildings > 0)
                        comp.buildings--;
                    var unempl = this.city.companies[id].workers - (this.city.companies[id].buildings * parameter.workerInCompany);
                    if (unempl > 0) {
                        this.city.companies[id].workers -= unempl;
                        this.city.transferWorker(unempl);
                    }
                    _this.update();
                });
                document.getElementById("buy-license_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = Number(sid.split("_")[1]);
                    var comp = _this.city.companies[id];
                    if (!_this.city.commitBuildingCosts(50000, [], "buy licence"))
                        return;
                    comp.hasLicense = true;
                });
            }
            document.getElementById("buy-shop").addEventListener("click", (evt) => {
                if (!_this.city.commitBuildingCosts(25000, [40, 80], "buy building"))
                    return;
                _this.city.buildBuilding(10000);
                _this.update();
            });
            document.getElementById("delete-shop").addEventListener("click", (evt) => {
                if (_this.city.shops === 0)
                    return;
                if (_this.city.tryRemoveBuildingInProgress(10000)) {
                    _this.update();
                    return;
                }
                _this.city.shops--;
                _this.update();
            });
            for (var x = 0; x < parameter.allAirplaneTypes.length; x++) {
                document.getElementById("new-airplane_" + x).addEventListener("click", (evt) => {
                    var sid = evt.target.id;
                    if (sid === "")
                        sid = evt.target.parentNode.id;
                    var id = parseInt(sid.split("_")[1]);
                    _this.city.buildAirplane(id);
                    _this.update(true);
                    //_this.newAirplane(id);
                });
            }
            citydialogshop_1.CityDialogShop.getInstance().bindActions();
            citydialogmarket_1.CityDialogMarket.getInstance().bindActions();
        }
        updateBuildings() {
            /*
                                   <th>produce</th>
                                       <th> </th>
                                       <th>buildings</th>
                                       <th>jobs</th>
                                       <th>needs</th>
                                       <th></th>
                                       <th>costs new building</th>
                                       <th>actions</th>
                   */
            var companies = this.city.companies;
            var all = parameter.allProducts;
            for (var x = 0; x < companies.length; x++) {
                var comp = companies[x];
                var table = document.getElementById("citydialog-buildings-table");
                var tr = table.children[0].children[x + 1];
                var product = all[comp.productid];
                var produce = comp.getDailyProduce();
                tr.children[0].innerHTML = produce + " " + product.getIcon();
                tr.children[1].innerHTML = product.name;
                var s = comp.buildings.toString();
                var inprogr = this.city.getBuildingInProgress(comp.productid);
                if (inprogr) {
                    s = s + "(" + inprogr + icons_1.Icons.hammer + ")";
                }
                tr.children[2].innerHTML = s;
                tr.children[3].innerHTML = comp.workers + "/" + comp.getMaxWorkers();
                var needs1 = "";
                var needs2 = "";
                if (product.input1 !== undefined)
                    needs1 = "" + comp.getDailyInput1() + all[product.input1].getIcon() + " ";
                tr.children[4].innerHTML = needs1;
                if (product.input2 !== undefined)
                    needs2 = "<br/>" + comp.getDailyInput2() + all[product.input2].getIcon();
                tr.children[4].innerHTML = needs1 + " " + needs2;
                if (comp.hasLicense) {
                    document.getElementById("buy-license_" + x).setAttribute("hidden", "");
                }
                else {
                    document.getElementById("buy-license_" + x).removeAttribute("hidden");
                }
                if (this.city.shops === 0) {
                    document.getElementById("no-shop_" + x).removeAttribute("hidden");
                }
                else {
                    document.getElementById("no-shop_" + x).setAttribute("hidden", "");
                }
                if (comp.hasLicense && this.city.shops > 0) {
                    document.getElementById("new-factory_" + x).innerHTML = "+" + icons_1.Icons.factory +
                        city_1.City.getBuildingCostsAsIcon(comp.getBuildingCosts(), comp.getBuildingMaterial());
                    document.getElementById("new-factory_" + x).removeAttribute("hidden");
                    document.getElementById("delete-factory_" + x).removeAttribute("hidden");
                }
                else {
                    document.getElementById("new-factory_" + x).setAttribute("hidden", "");
                    document.getElementById("delete-factory_" + x).setAttribute("hidden", "");
                }
                var mat = comp.getBuildingMaterial();
                if (this.city.canBuild(comp.getBuildingCosts(), comp.getBuildingMaterial()) != "") {
                    document.getElementById("new-factory_" + x).setAttribute("disabled", "");
                    document.getElementById("new-factory_" + x).setAttribute("title", "not all building costs are available");
                }
                else {
                    document.getElementById("new-factory_" + x).removeAttribute("disabled");
                    document.getElementById("new-factory_" + x).removeAttribute("title");
                }
                if (this.city.canBuild(50000, []) === "") {
                    document.getElementById("buy-license_" + x).removeAttribute("disabled");
                }
                else {
                    document.getElementById("buy-license_" + x).setAttribute("disabled", "");
                }
            }
            var sh = "" + this.city.shops;
            var inprogr = this.city.getBuildingInProgress(10000);
            if (inprogr) {
                sh = sh + "(" + inprogr + icons_1.Icons.hammer + ")";
            }
            document.getElementById("count-shops").innerHTML = "" + sh;
            document.getElementById("costs-shops").innerHTML = "" + this.city.getDailyCostsShops();
            if (this.city.canBuild(15000, [20, 40]) !== "") {
                document.getElementById("buy-shop").setAttribute("disabled", "");
            }
            else {
                document.getElementById("buy-shop").removeAttribute("disabled");
            }
        }
        updateConstruction() {
            for (var x = 0; x < parameter.allAirplaneTypes.length; x++) {
                if (this.city.canBuild(Math.round(parameter.allAirplaneTypes[x].buildingCosts * parameter.rateCostsAirplaine), parameter.allAirplaneTypes[x].buildingMaterial) === "") {
                    document.getElementById("new-airplane_" + x).removeAttribute("disabled");
                }
                else {
                    document.getElementById("new-airplane_" + x).setAttribute("disabled", "");
                }
            }
            var tab = document.getElementById("citydialog-constructionqueue-table");
            var html = `<tr>
                    <th>Modelname</th>
                    <th>Finished</th>
                    <th></th>
                </tr>`;
            for (var x = 0; x < this.city.queueAirplane.length; x++) {
                html += '<tr><td >' + this.city.queueAirplane[x].name + "</td>";
                html += "     <td>" + new Date(this.city.queueAirplane[x].ready).toLocaleDateString() + "</td>";
                html += "</tr>";
            }
            tab.innerHTML = html;
        }
        updateScore() {
            var needs = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                needs.push(0);
            }
            for (var i = 0; i < this.city.companies.length; i++) {
                var test = parameter.allProducts[this.city.companies[i].productid];
                if (test.input1 !== undefined) {
                    needs[test.input1] += (Math.round(this.city.companies[i].workers * test.input1Amount / parameter.workerInCompany));
                }
                if (test.input2 !== undefined) {
                    needs[test.input2] += (Math.round(this.city.companies[i].workers * test.input2Amount / parameter.workerInCompany));
                }
            }
            //score
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var table = document.getElementById("citydialog-score-table");
                var tr = table.children[0].children[x + 1];
                var prod = "";
                var product = parameter.allProducts[x];
                for (var i = 0; i < this.city.companies.length; i++) {
                    if (this.city.companies[i].productid === x) {
                        prod = Math.round(this.city.companies[i].workers * product.dailyProduce / parameter.workerInCompany).toString();
                    }
                }
                tr.children[2].innerHTML = prod;
                tr.children[3].innerHTML = needs[x] === 0 ? "" : needs[x];
                tr.children[4].innerHTML = this.city.score[x] + "</td>";
            }
        }
        update(force = false) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            if (!this.city)
                return;
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_u) {
                return;
            }
            if (!this.city.hasAirport)
                return;
            this.updateTitle();
            //pause game while trading
            if (!force) {
                if ((_c = (_b = (_a = document.getElementById("citydialog-market-tab")) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList) === null || _c === void 0 ? void 0 : _c.contains("ui-tabs-active")) {
                    if (!this.city.world.game.isPaused()) {
                        this.hasPaused = true;
                        this.city.world.game.pause();
                    }
                    return; ///no update because of slider
                }
                else {
                    if (this.hasPaused) {
                        this.city.world.game.resume();
                    }
                }
            }
            citydialogmarket_1.CityDialogMarket.getInstance().update();
            if ((_f = (_e = (_d = document.getElementById("citydialog-market-tab")) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.classList) === null || _f === void 0 ? void 0 : _f.contains("ui-tabs-active"))
                citydialogmarket_1.CityDialogMarket.getInstance().update();
            if ((_j = (_h = (_g = document.getElementById("citydialog-buildings-tab")) === null || _g === void 0 ? void 0 : _g.parentElement) === null || _h === void 0 ? void 0 : _h.classList) === null || _j === void 0 ? void 0 : _j.contains("ui-tabs-active"))
                this.updateBuildings();
            if (force || ((_m = (_l = (_k = document.getElementById("citydialog-shop-tab")) === null || _k === void 0 ? void 0 : _k.parentElement) === null || _l === void 0 ? void 0 : _l.classList) === null || _m === void 0 ? void 0 : _m.contains("ui-tabs-active")))
                citydialogshop_1.CityDialogShop.getInstance().update();
            if ((_q = (_p = (_o = document.getElementById("citydialog-construction-tab")) === null || _o === void 0 ? void 0 : _o.parentElement) === null || _p === void 0 ? void 0 : _p.classList) === null || _q === void 0 ? void 0 : _q.contains("ui-tabs-active"))
                this.updateConstruction();
            if ((_t = (_s = (_r = document.getElementById("citydialog-score-tab")) === null || _r === void 0 ? void 0 : _r.parentElement) === null || _s === void 0 ? void 0 : _s.classList) === null || _t === void 0 ? void 0 : _t.contains("ui-tabs-active"))
                this.updateScore();
            return;
        }
        updateTitle() {
            var sicon = '';
            if ($(this.dom).parent().find('.ui-dialog-title').length > 0)
                $(this.dom).parent().find('.ui-dialog-title')[0].innerHTML = '<img style="float: right" id="citydialog-icon" src="' + this.city.icon +
                    '"  height="15"></img> ' + this.city.name + " " + this.city.people + " " + icons_1.Icons.people;
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
            this.update();
            $(this.dom).dialog({
                width: "400px",
                draggable: true,
                // position: { my: "left top", at: "right top", of: $(AirplaneDialog.getInstance().dom) },
                open: function (event, ui) {
                    _this.update(true);
                },
                close: function (ev, ev2) {
                    if (_this.hasPaused) {
                        _this.city.world.game.resume();
                    }
                },
                create: function (e) {
                    setTimeout(() => {
                        $(e.target).dialog("widget").find(".ui-dialog-titlebar-close")[0].addEventListener('touchstart', (e) => {
                            _this.close();
                        });
                    }, 200);
                }
            }).dialog("widget").draggable("option", "containment", "none");
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.CityDialog = CityDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2l0eWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2dhbWUvY2l0eWRpYWxvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBU0EsWUFBWTtJQUNaLE1BQU0sQ0FBQyxJQUFJLEdBQUc7UUFDVixPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFDekMsQ0FBQyxDQUFBO0lBRUQsTUFBYSxVQUFVO1FBS25CO1lBRkEsY0FBUyxHQUFHLEtBQUssQ0FBQztZQUdkLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFdBQVc7WUFDZCxJQUFJLFVBQVUsQ0FBQyxRQUFRLEtBQUssU0FBUztnQkFDakMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQzNDLE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztRQUMvQixDQUFDO1FBR08sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNoRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUVELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUM7WUFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDdEIsSUFBSSxJQUFJLEdBQUc7Ozs7Ozs7Ozs7c0dBVW1GLEdBQUUsYUFBSyxD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QUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBMWZELGdDQTBmQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5pbXBvcnQgeyBQcm9kdWN0IH0gZnJvbSBcImdhbWUvcHJvZHVjdFwiO1xuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xuaW1wb3J0IHsgQWlycGxhbmVEaWFsb2cgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZWRpYWxvZ1wiO1xuaW1wb3J0IHsgQ29tcGFueSB9IGZyb20gXCJnYW1lL2NvbXBhbnlcIjtcbmltcG9ydCB7IENpdHlEaWFsb2dNYXJrZXQgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nbWFya2V0XCI7XG5pbXBvcnQgeyBDaXR5RGlhbG9nU2hvcCB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dzaG9wXCI7XG5cbi8vQHRzLWlnbm9yZVxud2luZG93LmNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIENpdHlEaWFsb2cuZ2V0SW5zdGFuY2UoKS5jaXR5O1xufVxuXG5leHBvcnQgY2xhc3MgQ2l0eURpYWxvZyB7XG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcbiAgICBjaXR5OiBDaXR5O1xuICAgIGhhc1BhdXNlZCA9IGZhbHNlO1xuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBDaXR5RGlhbG9nIHtcbiAgICAgICAgaWYgKENpdHlEaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIENpdHlEaWFsb2cuaW5zdGFuY2UgPSBuZXcgQ2l0eURpYWxvZygpO1xuICAgICAgICByZXR1cm4gQ2l0eURpYWxvZy5pbnN0YW5jZTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xuICAgICAgICB2YXIgc2RvbSA9IGBcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cImNpdHlkaWFsb2dcIiBjbGFzcz1cImNpdHlkaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2dcIik7XG4gICAgICAgIGlmIChvbGQpIHtcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJvZHVjdHMgPSBwYXJhbWV0ZXIuYWxsUHJvZHVjdHM7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjaXR5ID0gX3RoaXMuY2l0eTtcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPGlucHV0IGlkPVwiY2l0eWRpYWxvZy1wcmV2XCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiPFwiLz5cbiAgICAgICAgICAgIDxpbnB1dCBpZD1cImNpdHlkaWFsb2ctbmV4dFwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIj5cIi8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGlkPVwiY2l0eWRpYWxvZy10YWJzXCI+XG4gICAgICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLW1hcmtldFwiIGlkPVwiY2l0eWRpYWxvZy1tYXJrZXQtdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5NYXJrZXQ8L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1idWlsZGluZ3NcIiBpZD1cImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYlwiIGNsYXNzPVwiY2l0eWRpYWxvZy10YWJzXCI+QnVpbGRpbmdzPC9hPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI2NpdHlkaWFsb2ctc2hvcFwiIGlkPVwiY2l0eWRpYWxvZy1zaG9wLXRhYlwiICBjbGFzcz1cImNpdHlkaWFsb2ctdGFic1wiPmArIEljb25zLnNob3AgKyBgIE15U2hvcDwvYT48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiIGlkPVwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb24tdGFiXCIgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5Db25zdHJ1Y3Rpb248L2E+PC9saT5cbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjY2l0eWRpYWxvZy1zY29yZVwiIGlkPVwiY2l0eWRpYWxvZy1zY29yZS10YWJcIiAgY2xhc3M9XCJjaXR5ZGlhbG9nLXRhYnNcIj5TY29yZTwvYT48L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctbWFya2V0XCI+YCsgQ2l0eURpYWxvZ01hcmtldC5nZXRJbnN0YW5jZSgpLmNyZWF0ZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWJ1aWxkaW5nc1wiPiBgKyB0aGlzLmNyZWF0ZUJ1aWxkaW5ncygpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLXNob3BcIj5gKyBDaXR5RGlhbG9nU2hvcC5nZXRJbnN0YW5jZSgpLmNyZWF0ZSgpICsgYFxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvblwiPmArIHRoaXMuY3JlYXRlQ29uc3RydWN0aW9uKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImNpdHlkaWFsb2ctc2NvcmVcIj5gKyB0aGlzLmNyZWF0ZVNjb3JlKCkgKyBgXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xuICAgICAgICB0aGlzLmRvbS5yZW1vdmVDaGlsZCh0aGlzLmRvbS5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XG4gICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuXG4gICAgICAgICAgICAvL2NvbGxhcHNpYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICQoXCIjY2l0eWRpYWxvZy10YWJzXCIpLnRhYnMoe1xuICAgICAgICAgICAgICAgIC8vY29sbGFwc2libGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgX3RoaXMuYmluZEFjdGlvbnMoKTsgfSwgNTAwKTtcbiAgICAgICAgLy9kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVCdWlsZGluZ3MoKSB7XG4gICAgICAgIHJldHVybiBgPHRhYmxlIGlkPVwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFibGVcIiBzdHlsZT1cImhlaWdodDoxMDAlO3dlaWdodDoxMDAlO1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+IDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkJ1aWxkaW5nczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OZWVkczwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRyPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD48L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyAnPHRkPjxidXR0b24gaWQ9XCJuZXctZmFjdG9yeV8nICsgeCArICdcIj4nICsgXCIrXCIgKyBJY29ucy5mYWN0b3J5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJkZWxldGUtZmFjdG9yeV8nICsgeCArICdcIj4nICsgXCItXCIgKyBJY29ucy5mYWN0b3J5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJidXktbGljZW5zZV8nICsgeCArICdcIj4nICsgXCJidXkgbGljZW5zZSB0byBwcm9kdWNlIGZvciA1MC4wMDBcIiArIEljb25zLm1vbmV5ICsgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgaWQ9XCJuby1zaG9wXycgKyB4ICsgJ1wiPm5lZWQgYSBzaG9wIHRvIHByb2R1Y2U8L2Rpdj4nICtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdGQ+JztcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxici8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Yj5NeS1TaG9wczwvYj5cbiAgICAgICAgICAgICAgICAgICAgPGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgYCsgSWNvbnMuc2hvcCArIGAgU2hvcHM6IDxzcGFuIGlkPVwiY291bnQtc2hvcHNcIj4wLzA8L3NwYW4+ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGAgKyBgIGNvc3RzOiA8c3BhbiBpZD1cImNvc3RzLXNob3BzXCI+MDwvc3Bhbj4gYCArIEljb25zLm1vbmV5ICsgYCAgXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiYnV5LXNob3BcIj4rYCsgSWNvbnMuaG9tZSArIGAgZm9yIDE1LjAwMGAgKyBJY29ucy5tb25leSArIFwiIDIweFwiICsgcGFyYW1ldGVyLmFsbFByb2R1Y3RzWzBdLmdldEljb24oKSArXG4gICAgICAgICAgICBcIiA0MHhcIiArIHBhcmFtZXRlci5hbGxQcm9kdWN0c1sxXS5nZXRJY29uKCkgKyBgPC9idXR0b24+IFxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImRlbGV0ZS1zaG9wXCI+LWArIEljb25zLmhvbWUgKyBgPC9idXR0b24+YDtcbiAgICB9XG5cbiAgICBjcmVhdGVTY29yZSgpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLXNjb3JlLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5Qcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmVlZDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlNjb3JlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxQcm9kdWN0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+XCIgKyBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbeF0uZ2V0SWNvbigpICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArIHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XS5uYW1lICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD4wPC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dGQ+MDwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPjA8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9KSgpfVxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPmA7XG4gICAgfVxuICAgIGNyZWF0ZUNvbnN0cnVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvbi10YWJsZVwiIHN0eWxlPVwiaGVpZ2h0OjEwMCU7d2VpZ2h0OjEwMCU7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPk1vZGVsPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+U3BlZWQ8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5DYXBhY2l0eTwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkRhaWx5IENvc3RzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+QnVpbGQgZGF5czwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPkFjdGlvbjwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8dHI+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0ubW9kZWwgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0uc3BlZWQgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0uY2FwYWNpdHkgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0uY29zdHMgKyBcIjwvdGQ+XCI7XG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHJldCArIFwiPHRkPlwiICsgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGREYXlzICsgXCI8L3RkPlwiO1xuICAgICAgICAgICAgICAgICAgICByZXQgPSByZXQgKyBcIjx0ZD5cIiArICc8YnV0dG9uIGlkPVwibmV3LWFpcnBsYW5lXycgKyB4ICsgJ1wiPicgKyBcIitcIiArIEljb25zLmFpcnBsYW5lICsgXCIgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eS5nZXRCdWlsZGluZ0Nvc3RzQXNJY29uKE1hdGgucm91bmQocGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGRpbmdDb3N0cyAqIHBhcmFtZXRlci5yYXRlQ29zdHNBaXJwbGFpbmUpLCBwYXJhbWV0ZXIuYWxsQWlycGxhbmVUeXBlc1t4XS5idWlsZGluZ01hdGVyaWFsKSArIFwiPC9idXR0b24+PC90ZD5cIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0ID0gcmV0ICsgXCI8L3RyPlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX0gIFxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG5cbiAgICAgICAgICAgICAgICA8dGFibGUgaWQ9XCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvbnF1ZXVlLXRhYmxlXCIgc3R5bGU9XCJoZWlnaHQ6MTAwJTt3ZWlnaHQ6MTAwJTtcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIDwvdGFibGU+IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBgO1xuICAgIH1cblxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctbmV4dFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXMuaW5kZXhPZihfdGhpcy5jaXR5KTtcbiAgICAgICAgICAgIHBvcysrO1xuICAgICAgICAgICAgaWYgKHBvcyA+PSBfdGhpcy5jaXR5LndvcmxkLmNpdGllcy5sZW5ndGggLSAxKVxuICAgICAgICAgICAgICAgIHBvcyA9IDA7XG4gICAgICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXNbcG9zXTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcblxuICAgICAgICAgICAgdmFyIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmluZGV4T2YoX3RoaXMuY2l0eSk7XG4gICAgICAgICAgICBwb3MtLTtcbiAgICAgICAgICAgIGlmIChwb3MgPT09IC0xKVxuICAgICAgICAgICAgICAgIHBvcyA9IF90aGlzLmNpdHkud29ybGQuY2l0aWVzLmxlbmd0aCAtIDI7XG4gICAgICAgICAgICBfdGhpcy5jaXR5ID0gX3RoaXMuY2l0eS53b3JsZC5jaXRpZXNbcG9zXTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgNTsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkuaWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNpZCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgc2lkID0gKDxhbnk+ZXZ0LnRhcmdldCkucGFyZW50Tm9kZS5pZFxuICAgICAgICAgICAgICAgIHZhciBpZCA9IE51bWJlcihzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICB2YXIgY29tcCA9IF90aGlzLmNpdHkuY29tcGFuaWVzW2lkXTtcblxuICAgICAgICAgICAgICAgIGlmICghX3RoaXMuY2l0eS5jb21taXRCdWlsZGluZ0Nvc3RzKGNvbXAuZ2V0QnVpbGRpbmdDb3N0cygpLCBjb21wLmdldEJ1aWxkaW5nTWF0ZXJpYWwoKSwgXCJidXkgYnVpbGRpbmdcIikpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LmJ1aWxkQnVpbGRpbmcoY29tcC5wcm9kdWN0aWQpO1xuICAgICAgICAgICAgICAgIC8vY29tcC5idWlsZGluZ3MrKztcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmNpdHkudHJ5UmVtb3ZlQnVpbGRpbmdJblByb2dyZXNzKGNvbXAucHJvZHVjdGlkKSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChjb21wLmJ1aWxkaW5ncyA+IDApXG4gICAgICAgICAgICAgICAgICAgIGNvbXAuYnVpbGRpbmdzLS07XG4gICAgICAgICAgICAgICAgdmFyIHVuZW1wbCA9IHRoaXMuY2l0eS5jb21wYW5pZXNbaWRdLndvcmtlcnMgLSAodGhpcy5jaXR5LmNvbXBhbmllc1tpZF0uYnVpbGRpbmdzICogcGFyYW1ldGVyLndvcmtlckluQ29tcGFueSk7XG4gICAgICAgICAgICAgICAgaWYgKHVuZW1wbCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LmNvbXBhbmllc1tpZF0ud29ya2VycyAtPSB1bmVtcGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2l0eS50cmFuc2Zlcldvcmtlcih1bmVtcGwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBOdW1iZXIoc2lkLnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXAgPSBfdGhpcy5jaXR5LmNvbXBhbmllc1tpZF07XG4gICAgICAgICAgICAgICAgaWYgKCFfdGhpcy5jaXR5LmNvbW1pdEJ1aWxkaW5nQ29zdHMoNTAwMDAsIFtdLCBcImJ1eSBsaWNlbmNlXCIpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY29tcC5oYXNMaWNlbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1zaG9wXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBpZiAoIV90aGlzLmNpdHkuY29tbWl0QnVpbGRpbmdDb3N0cygyNTAwMCwgWzQwLCA4MF0sIFwiYnV5IGJ1aWxkaW5nXCIpKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIF90aGlzLmNpdHkuYnVpbGRCdWlsZGluZygxMDAwMCk7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVsZXRlLXNob3BcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldnQpID0+IHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaXR5LnNob3BzID09PSAwKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaXR5LnRyeVJlbW92ZUJ1aWxkaW5nSW5Qcm9ncmVzcygxMDAwMCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5jaXR5LnNob3BzLS07XG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZ0KSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLmlkO1xuICAgICAgICAgICAgICAgIGlmIChzaWQgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgIHNpZCA9ICg8YW55PmV2dC50YXJnZXQpLnBhcmVudE5vZGUuaWRcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBwYXJzZUludChzaWQuc3BsaXQoXCJfXCIpWzFdKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LmJ1aWxkQWlycGxhbmUoaWQpO1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAvL190aGlzLm5ld0FpcnBsYW5lKGlkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgQ2l0eURpYWxvZ1Nob3AuZ2V0SW5zdGFuY2UoKS5iaW5kQWN0aW9ucygpO1xuICAgICAgICBDaXR5RGlhbG9nTWFya2V0LmdldEluc3RhbmNlKCkuYmluZEFjdGlvbnMoKTtcbiAgICB9XG5cblxuXG4gICAgdXBkYXRlQnVpbGRpbmdzKCkge1xuICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5wcm9kdWNlPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPiA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+YnVpbGRpbmdzPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmpvYnM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+bmVlZHM8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPmNvc3RzIG5ldyBidWlsZGluZzwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5hY3Rpb25zPC90aD5cbiAgICAgICAgICAgICAgICovXG4gICAgICAgIHZhciBjb21wYW5pZXMgPSB0aGlzLmNpdHkuY29tcGFuaWVzO1xuICAgICAgICB2YXIgYWxsID0gcGFyYW1ldGVyLmFsbFByb2R1Y3RzO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGNvbXBhbmllcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGNvbXAgPSBjb21wYW5pZXNbeF07XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctYnVpbGRpbmdzLXRhYmxlXCIpO1xuICAgICAgICAgICAgdmFyIHRyID0gdGFibGUuY2hpbGRyZW5bMF0uY2hpbGRyZW5beCArIDFdO1xuICAgICAgICAgICAgdmFyIHByb2R1Y3QgPSBhbGxbY29tcC5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgdmFyIHByb2R1Y2UgPSBjb21wLmdldERhaWx5UHJvZHVjZSgpO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMF0uaW5uZXJIVE1MID0gcHJvZHVjZSArIFwiIFwiICsgcHJvZHVjdC5nZXRJY29uKCk7XG4gICAgICAgICAgICB0ci5jaGlsZHJlblsxXS5pbm5lckhUTUwgPSBwcm9kdWN0Lm5hbWU7XG4gICAgICAgICAgICB2YXIgcyA9IGNvbXAuYnVpbGRpbmdzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB2YXIgaW5wcm9nciA9IHRoaXMuY2l0eS5nZXRCdWlsZGluZ0luUHJvZ3Jlc3MoY29tcC5wcm9kdWN0aWQpO1xuICAgICAgICAgICAgaWYgKGlucHJvZ3IpIHtcbiAgICAgICAgICAgICAgICBzID0gcyArIFwiKFwiICsgaW5wcm9nciArIEljb25zLmhhbW1lciArIFwiKVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHIuY2hpbGRyZW5bMl0uaW5uZXJIVE1MID0gcztcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzNdLmlubmVySFRNTCA9IGNvbXAud29ya2VycyArIFwiL1wiICsgY29tcC5nZXRNYXhXb3JrZXJzKCk7XG4gICAgICAgICAgICB2YXIgbmVlZHMxID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBuZWVkczIgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaW5wdXQxICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgbmVlZHMxID0gXCJcIiArIGNvbXAuZ2V0RGFpbHlJbnB1dDEoKSArIGFsbFtwcm9kdWN0LmlucHV0MV0uZ2V0SWNvbigpICsgXCIgXCI7XG4gICAgICAgICAgICB0ci5jaGlsZHJlbls0XS5pbm5lckhUTUwgPSBuZWVkczE7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pbnB1dDIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBuZWVkczIgPSBcIjxici8+XCIgKyBjb21wLmdldERhaWx5SW5wdXQyKCkgKyBhbGxbcHJvZHVjdC5pbnB1dDJdLmdldEljb24oKTtcbiAgICAgICAgICAgIHRyLmNoaWxkcmVuWzRdLmlubmVySFRNTCA9IG5lZWRzMSArIFwiIFwiICsgbmVlZHMyO1xuXG4gICAgICAgICAgICBpZiAoY29tcC5oYXNMaWNlbnNlKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuc2hvcHMgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vLXNob3BfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm8tc2hvcF9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbXAuaGFzTGljZW5zZSAmJiB0aGlzLmNpdHkuc2hvcHMgPiAwKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLmlubmVySFRNTCA9IFwiK1wiICsgSWNvbnMuZmFjdG9yeSArXG4gICAgICAgICAgICAgICAgICAgIENpdHkuZ2V0QnVpbGRpbmdDb3N0c0FzSWNvbihjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCkpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3LWZhY3RvcnlfXCIgKyB4KS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGUtZmFjdG9yeV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImhpZGRlblwiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlbGV0ZS1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwiaGlkZGVuXCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1hdCA9IGNvbXAuZ2V0QnVpbGRpbmdNYXRlcmlhbCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZChjb21wLmdldEJ1aWxkaW5nQ29zdHMoKSwgY29tcC5nZXRCdWlsZGluZ01hdGVyaWFsKCkpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIFwibm90IGFsbCBidWlsZGluZyBjb3N0cyBhcmUgYXZhaWxhYmxlXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1mYWN0b3J5X1wiICsgeCkucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXctZmFjdG9yeV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcInRpdGxlXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZCg1MDAwMCwgW10pID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktbGljZW5zZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1eS1saWNlbnNlX1wiICsgeCkuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgICB2YXIgc2ggPSBcIlwiK3RoaXMuY2l0eS5zaG9wcztcbiAgICAgICAgdmFyIGlucHJvZ3IgPSB0aGlzLmNpdHkuZ2V0QnVpbGRpbmdJblByb2dyZXNzKDEwMDAwKTtcbiAgICAgICAgaWYgKGlucHJvZ3IpIHtcbiAgICAgICAgICAgIHNoID0gc2ggKyBcIihcIiArIGlucHJvZ3IgKyBJY29ucy5oYW1tZXIgKyBcIilcIjtcbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvdW50LXNob3BzXCIpLmlubmVySFRNTCA9IFwiXCIgKyBzaDtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb3N0cy1zaG9wc1wiKS5pbm5lckhUTUwgPSBcIlwiICsgdGhpcy5jaXR5LmdldERhaWx5Q29zdHNTaG9wcygpO1xuXG4gICAgICAgIGlmICh0aGlzLmNpdHkuY2FuQnVpbGQoMTUwMDAsIFsyMCwgNDBdKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXktc2hvcFwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLCBcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV5LXNob3BcIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cblxuXG5cblxuICAgIH1cblxuICAgIHVwZGF0ZUNvbnN0cnVjdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwYXJhbWV0ZXIuYWxsQWlycGxhbmVUeXBlcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2l0eS5jYW5CdWlsZChNYXRoLnJvdW5kKHBhcmFtZXRlci5hbGxBaXJwbGFuZVR5cGVzW3hdLmJ1aWxkaW5nQ29zdHMgKiBwYXJhbWV0ZXIucmF0ZUNvc3RzQWlycGxhaW5lKSwgcGFyYW1ldGVyLmFsbEFpcnBsYW5lVHlwZXNbeF0uYnVpbGRpbmdNYXRlcmlhbCkgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ldy1haXJwbGFuZV9cIiArIHgpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRhYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1jb25zdHJ1Y3Rpb25xdWV1ZS10YWJsZVwiKTtcbiAgICAgICAgdmFyIGh0bWwgPSBgPHRyPlxuICAgICAgICAgICAgICAgICAgICA8dGg+TW9kZWxuYW1lPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPkZpbmlzaGVkPC90aD5cbiAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+XG4gICAgICAgICAgICAgICAgPC90cj5gO1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0eS5xdWV1ZUFpcnBsYW5lLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBodG1sICs9ICc8dHI+PHRkID4nICsgdGhpcy5jaXR5LnF1ZXVlQWlycGxhbmVbeF0ubmFtZSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgIGh0bWwgKz0gXCIgICAgIDx0ZD5cIiArIG5ldyBEYXRlKHRoaXMuY2l0eS5xdWV1ZUFpcnBsYW5lW3hdLnJlYWR5KS50b0xvY2FsZURhdGVTdHJpbmcoKSArIFwiPC90ZD5cIjtcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIHRhYi5pbm5lckhUTUwgPSBodG1sO1xuICAgIH1cbiAgICB1cGRhdGVTY29yZSgpIHtcbiAgICAgICAgdmFyIG5lZWRzID0gW107XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICBuZWVkcy5wdXNoKDApO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXR5LmNvbXBhbmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHRlc3QgPSBwYXJhbWV0ZXIuYWxsUHJvZHVjdHNbdGhpcy5jaXR5LmNvbXBhbmllc1tpXS5wcm9kdWN0aWRdO1xuICAgICAgICAgICAgaWYgKHRlc3QuaW5wdXQxICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBuZWVkc1t0ZXN0LmlucHV0MV0gKz0gKE1hdGgucm91bmQodGhpcy5jaXR5LmNvbXBhbmllc1tpXS53b3JrZXJzICogdGVzdC5pbnB1dDFBbW91bnQgLyBwYXJhbWV0ZXIud29ya2VySW5Db21wYW55KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGVzdC5pbnB1dDIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG5lZWRzW3Rlc3QuaW5wdXQyXSArPSAoTWF0aC5yb3VuZCh0aGlzLmNpdHkuY29tcGFuaWVzW2ldLndvcmtlcnMgKiB0ZXN0LmlucHV0MkFtb3VudCAvIHBhcmFtZXRlci53b3JrZXJJbkNvbXBhbnkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvL3Njb3JlXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGFyYW1ldGVyLmFsbFByb2R1Y3RzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2NvcmUtdGFibGVcIik7XG4gICAgICAgICAgICB2YXIgdHIgPSB0YWJsZS5jaGlsZHJlblswXS5jaGlsZHJlblt4ICsgMV07XG4gICAgICAgICAgICB2YXIgcHJvZCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgcHJvZHVjdCA9IHBhcmFtZXRlci5hbGxQcm9kdWN0c1t4XTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaXR5LmNvbXBhbmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNpdHkuY29tcGFuaWVzW2ldLnByb2R1Y3RpZCA9PT0geCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9kID0gTWF0aC5yb3VuZCh0aGlzLmNpdHkuY29tcGFuaWVzW2ldLndvcmtlcnMgKiBwcm9kdWN0LmRhaWx5UHJvZHVjZSAvIHBhcmFtZXRlci53b3JrZXJJbkNvbXBhbnkpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0ci5jaGlsZHJlblsyXS5pbm5lckhUTUwgPSBwcm9kO1xuICAgICAgICAgICAgdHIuY2hpbGRyZW5bM10uaW5uZXJIVE1MID0gbmVlZHNbeF0gPT09IDAgPyBcIlwiIDogbmVlZHNbeF07XG4gICAgICAgICAgICB0ci5jaGlsZHJlbls0XS5pbm5lckhUTUwgPSB0aGlzLmNpdHkuc2NvcmVbeF0gKyBcIjwvdGQ+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlKGZvcmNlID0gZmFsc2UpIHtcblxuICAgICAgICBpZiAoIXRoaXMuY2l0eSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghJCh0aGlzLmRvbSkuZGlhbG9nKCdpc09wZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmNpdHkuaGFzQWlycG9ydClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICAgICAgICAvL3BhdXNlIGdhbWUgd2hpbGUgdHJhZGluZ1xuICAgICAgICBpZiAoIWZvcmNlKSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNpdHkud29ybGQuZ2FtZS5pc1BhdXNlZCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzUGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUucGF1c2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuOy8vL25vIHVwZGF0ZSBiZWNhdXNlIG9mIHNsaWRlclxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNQYXVzZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaXR5LndvcmxkLmdhbWUucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcblxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLW1hcmtldC10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIENpdHlEaWFsb2dNYXJrZXQuZ2V0SW5zdGFuY2UoKS51cGRhdGUoKTtcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1idWlsZGluZ3MtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ1aWxkaW5ncygpO1xuICAgICAgICBpZiAoZm9yY2UgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXNob3AtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICBDaXR5RGlhbG9nU2hvcC5nZXRJbnN0YW5jZSgpLnVwZGF0ZSgpO1xuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLWNvbnN0cnVjdGlvbi10YWJcIik/LnBhcmVudEVsZW1lbnQ/LmNsYXNzTGlzdD8uY29udGFpbnMoXCJ1aS10YWJzLWFjdGl2ZVwiKSlcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29uc3RydWN0aW9uKCk7XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctc2NvcmUtdGFiXCIpPy5wYXJlbnRFbGVtZW50Py5jbGFzc0xpc3Q/LmNvbnRhaW5zKFwidWktdGFicy1hY3RpdmVcIikpXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlKCk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVUaXRsZSgpIHtcbiAgICAgICAgdmFyIHNpY29uID0gJyc7XG4gICAgICAgIGlmICgkKHRoaXMuZG9tKS5wYXJlbnQoKS5maW5kKCcudWktZGlhbG9nLXRpdGxlJykubGVuZ3RoID4gMClcbiAgICAgICAgICAgICQodGhpcy5kb20pLnBhcmVudCgpLmZpbmQoJy51aS1kaWFsb2ctdGl0bGUnKVswXS5pbm5lckhUTUwgPSAnPGltZyBzdHlsZT1cImZsb2F0OiByaWdodFwiIGlkPVwiY2l0eWRpYWxvZy1pY29uXCIgc3JjPVwiJyArIHRoaXMuY2l0eS5pY29uICtcbiAgICAgICAgICAgICAgICAnXCIgIGhlaWdodD1cIjE1XCI+PC9pbWc+ICcgKyB0aGlzLmNpdHkubmFtZSArIFwiIFwiICsgdGhpcy5jaXR5LnBlb3BsZSArIFwiIFwiICsgSWNvbnMucGVvcGxlO1xuICAgIH1cbiAgICBzaG93KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcblxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xuICAgICAgICAgICAgd2lkdGg6IFwiNDAwcHhcIixcbiAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIC8vIHBvc2l0aW9uOiB7IG15OiBcImxlZnQgdG9wXCIsIGF0OiBcInJpZ2h0IHRvcFwiLCBvZjogJChBaXJwbGFuZURpYWxvZy5nZXRJbnN0YW5jZSgpLmRvbSkgfSxcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uIChldiwgZXYyKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmhhc1BhdXNlZCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaXR5LndvcmxkLmdhbWUucmVzdW1lKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuZGlhbG9nKFwid2lkZ2V0XCIpLmZpbmQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLCBcImNvbnRhaW5tZW50XCIsIFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcblxuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgfVxufVxuIl19