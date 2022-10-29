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
        bindActions() {
            var _this = this;
            document.getElementById("sqadron-add").addEventListener('click', (e) => {
                var val = document.getElementById("airplanes-in-city").value;
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
                _this.update();
                // _this.airplane.
            });
            document.getElementById("sqadron-del").addEventListener('click', (e) => {
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
                           <select id="airplanes-in-city" size="7">
                                <option value="no airplanes in city">no airplanes in city</option>
                            </select>
                        </td>
                        <td>
                             <button id="sqadron-add">` + icons_1.Icons.toright + `</button>
                             <button id="sqadron-del" >` + icons_1.Icons.toleft + `</button><br/>
                        </td>
                        <td>
                           <select id="airplanes-in-squadron" size="7">
                                
                            </select>
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
                for (var x = 0; x < aps.length; x++) {
                    if (aps[x] !== this.airplane) {
                        var opt = document.createElement("option");
                        var toadd = aps[x];
                        opt.value = toadd.name;
                        opt.text = toadd.name;
                        selectCity.appendChild(opt);
                    }
                }
            }
            if (selectCity.innerHTML === "") {
                selectCity.innerHTML = '<option value="no airplanes in city">no airplanes in city</option>';
            }
            selectSquadron.innerHTML = "";
            var opt = document.createElement("option");
            opt.value = this.airplane.name;
            opt.text = this.airplane.name;
            selectSquadron.appendChild(opt);
            for (var x = 0; x < this.airplane.squadron.length; x++) {
                var opt = document.createElement("option");
                var toadd = this.airplane.squadron[x];
                opt.value = toadd.name;
                opt.text = toadd.name;
                selectSquadron.appendChild(opt);
            }
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