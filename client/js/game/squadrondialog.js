define(["require", "exports", "game/icons"], function (require, exports, icons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SquadronDialog = void 0;
    class SquadronDialog {
        constructor() {
            this.create();
        }
        static getInstance() {
            if (SquadronDialog.instance === undefined)
                SquadronDialog.instance = new SquadronDialog();
            return SquadronDialog.instance;
        }
        getActiveItem(list) {
            var select = document.getElementById(list);
            for (var x = 0; x < select.children.length; x++) {
                if (select.children[x].classList.contains("active-listitem"))
                    return select.children[x].getAttribute("value");
            }
            return "";
        }
        bindActions() {
            var _this = this;
            document.getElementById("airplanes-in-city").addEventListener("click", (ev) => {
                var el = ev.target;
                if (!(el instanceof HTMLLIElement))
                    return;
                var select = document.getElementById("airplanes-in-city");
                for (var x = 0; x < select.children.length; x++) {
                    select.children[x].classList.remove("active-listitem");
                }
                el.classList.add("active-listitem");
            });
            document.getElementById("airplanes-in-squadron").addEventListener("click", (ev) => {
                var el = ev.target;
                var select = document.getElementById("airplanes-in-squadron");
                for (var x = 0; x < select.children.length; x++) {
                    select.children[x].classList.remove("active-listitem");
                }
                el.classList.add("active-listitem");
            });
            document.getElementById("sqadron-add").addEventListener('click', (e) => {
                var val = _this.getActiveItem("airplanes-in-city"); //(<HTMLSelectElement>document.getElementById("airplanes-in-city")).value;
                if (val === "no airplanes in city" || val === "")
                    return;
                var ap = _this.airplane.world.findAirplane(val);
                var pos = _this.airplane.world.airplanes.indexOf(ap);
                var appos = _this.airplane.world.airplanes.indexOf(ap);
                _this.airplane.world.airplanes.splice(pos, 1);
                _this.airplane.squadron.push(ap);
                _this.airplane.updateSquadron();
                ap.updateSquadron();
                _this.airplane.world.dom.removeChild(ap.dom);
                ap.dom.style.display = "none";
                _this.update();
                // _this.airplane.
            });
            document.getElementById("sqadron-del").addEventListener('click', (e) => {
                var val = _this.getActiveItem("airplanes-in-squadron");
                //  var val = (<HTMLSelectElement>document.getElementById("airplanes-in-squadron")).value;
                if (val === "")
                    return;
                var ap = _this.airplane.world.findAirplane(val);
                var pos = _this.airplane.squadron.indexOf(ap);
                _this.airplane.squadron.splice(pos, 1);
                _this.airplane.world.airplanes.push(ap);
                _this.airplane.updateSquadron();
                ap.updateSquadron();
                if (ap.dom === undefined) {
                    ap.world = _this.airplane.world;
                    ap.render();
                }
                else {
                    ap.dom.style.display = "initial";
                }
                _this.airplane.world.dom.appendChild(ap.dom);
                ap.x = _this.airplane.x;
                ap.y = _this.airplane.y;
                _this.update();
            });
        }
        create() {
            //template for code reloading
            var sdom = `
          <div hidden id="squadrondialog" class="squadrondialog">
            <div></div>
           </div>
        `;
            this.dom = document.createRange().createContextualFragment(sdom).children[0];
            var old = document.getElementById("squadrondialog");
            if (old) {
                old.parentNode.removeChild(old);
            }
            var airplane = this.airplane;
            var products = parameter.allProducts;
            var _this = this;
            var sdom = `
          <div>
                <table>
                    <tr>
                        <td>
                            Airplanes in city
                           <ul id="airplanes-in-city" class="mylist boxborder" style="height: 250px;width:150px">
                                <li value="no airplanes in city">no airplanes in city</li>
                            </ul>
                        </td>
                        <td>
                             <button id="sqadron-add" class="mybutton">` + icons_1.Icons.toright + `</button>
                             <button id="sqadron-del"  class="mybutton">` + icons_1.Icons.toleft + `</button><br/>
                        </td>
                        <td>
                            Airlanes in Squadron
                           <ul id="airplanes-in-squadron" class="mylist boxborder" style="height: 250px;width:150px">
                                
                            </ul>
                        </td>
                        
                    </tr>
                </table>
                       ${(function fun() {
                var ret = "";
                return ret;
            })()}
            
          </div>
        `;
            var newdom = document.createRange().createContextualFragment(sdom).children[0];
            this.dom.removeChild(this.dom.children[0]);
            this.dom.appendChild(newdom);
            document.body.appendChild(this.dom);
            //        document.getElementById("citydialog-prev")
            setTimeout(() => {
                _this.bindActions();
            }, 500);
            //document.createElement("span");
        }
        update() {
            try {
                if (!$(this.dom).dialog('isOpen')) {
                    return;
                }
            }
            catch (_a) {
                return;
            }
            var selectCity = document.getElementById("airplanes-in-city");
            var selectSquadron = document.getElementById("airplanes-in-squadron");
            var city = this.airplane.getCurrentCity();
            if (city !== undefined) {
                selectCity.innerHTML = "";
                var aps = city.getAirplanesInCity();
                var s = "";
                for (var x = 0; x < aps.length; x++) {
                    if (aps[x] !== this.airplane) {
                        var toadd = aps[x];
                        s += '<li value="' + toadd.name + '">' + toadd.name + '</li>';
                    }
                }
                selectCity.innerHTML = s;
            }
            if (selectCity.innerHTML === "") {
                selectCity.innerHTML = '<li value="no airplanes in city">no airplanes in city</li>';
            }
            selectSquadron.innerHTML = "";
            //selectSquadron.appendChild(opt);
            var s = "";
            for (var x = 0; x < this.airplane.squadron.length; x++) {
                var toadd = this.airplane.squadron[x];
                s += '<li value="' + toadd.name + '">' + toadd.name + '</li>';
            }
            selectSquadron.innerHTML = s;
        }
        show() {
            var _this = this;
            this.dom.removeAttribute("hidden");
            this.update();
            //ui-tabs-active
            $(this.dom).dialog({
                title: "Modify Squadron",
                width: "400px",
                draggable: true,
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update();
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
    exports.SquadronDialog = SquadronDialog;
});
//# sourceMappingURL=squadrondialog.js.map