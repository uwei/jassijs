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
                             <button id="sqadron-add">` + icons_1.Icons.toright + `</button>
                             <button id="sqadron-del" >` + icons_1.Icons.toleft + `</button><br/>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YWRyb25kaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3NxdWFkcm9uZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxNQUFhLGNBQWM7UUFLdkI7WUFFSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXO1lBQ2QsSUFBSSxjQUFjLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3JDLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsQ0FBQztRQUNELGFBQWEsQ0FBQyxJQUFZO1lBQ3RCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDeEQsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN2RDtZQUNELE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQztRQUNELFdBQVc7WUFDUCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFO2dCQUMxRSxJQUFJLEVBQUUsR0FBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDaEMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxt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Q0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFOzRCQUNuRyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ2xCLENBQUMsQ0FBQyxDQUFDO29CQUNQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDWixDQUFDO2FBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvRCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBak5ELHdDQWlOQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcbmltcG9ydCB7IEljb25zIH0gZnJvbSBcImdhbWUvaWNvbnNcIjtcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XG5cbmV4cG9ydCBjbGFzcyBTcXVhZHJvbkRpYWxvZyB7XG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcbiAgICBhaXJwbGFuZTogQWlycGxhbmU7XG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG5cbiAgICB9XG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IFNxdWFkcm9uRGlhbG9nIHtcbiAgICAgICAgaWYgKFNxdWFkcm9uRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5pbnN0YW5jZSA9IG5ldyBTcXVhZHJvbkRpYWxvZygpO1xuICAgICAgICByZXR1cm4gU3F1YWRyb25EaWFsb2cuaW5zdGFuY2U7XG4gICAgfVxuICAgIGdldEFjdGl2ZUl0ZW0obGlzdDogc3RyaW5nKSB7XG4gICAgICAgIHZhciBzZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsaXN0KTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzZWxlY3QuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3QuY2hpbGRyZW5beF0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWN0aXZlLWxpc3RpdGVtXCIpKVxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3QuY2hpbGRyZW5beF0uZ2V0QXR0cmlidXRlKFwidmFsdWVcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGJpbmRBY3Rpb25zKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lcy1pbi1jaXR5XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgIHZhciBlbCA9IDxIVE1MRWxlbWVudD5ldi50YXJnZXQ7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZXMtaW4tY2l0eVwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgc2VsZWN0LmNoaWxkcmVuLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgc2VsZWN0LmNoaWxkcmVuW3hdLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtbGlzdGl0ZW1cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLWxpc3RpdGVtXCIpO1xuXG4gICAgICAgIH0pO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lcy1pbi1zcXVhZHJvblwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2KSA9PiB7XG4gICAgICAgICAgICB2YXIgZWwgPSA8SFRNTEVsZW1lbnQ+ZXYudGFyZ2V0O1xuICAgICAgICAgICAgdmFyIHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVzLWluLXNxdWFkcm9uXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBzZWxlY3QuY2hpbGRyZW4ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICBzZWxlY3QuY2hpbGRyZW5beF0uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZS1saXN0aXRlbVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmUtbGlzdGl0ZW1cIik7XG5cbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3FhZHJvbi1hZGRcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgdmFyIHZhbCA9ICBfdGhpcy5nZXRBY3RpdmVJdGVtKFwiYWlycGxhbmVzLWluLWNpdHlcIik7IC8vKDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lcy1pbi1jaXR5XCIpKS52YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWwgPT09IFwibm8gYWlycGxhbmVzIGluIGNpdHlcIiB8fCB2YWwgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGFwID0gX3RoaXMuYWlycGxhbmUud29ybGQuZmluZEFpcnBsYW5lKHZhbCk7XG4gICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoYXApO1xuICAgICAgICAgICAgdmFyIGFwcG9zID0gX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoYXApO1xuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLnNwbGljZShwb3MsIDEpO1xuXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5zcXVhZHJvbi5wdXNoKGFwKTtcbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLnVwZGF0ZVNxdWFkcm9uKCk7XG4gICAgICAgICAgICBhcC51cGRhdGVTcXVhZHJvbigpO1xuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUud29ybGQuZG9tLnJlbW92ZUNoaWxkKGFwLmRvbSk7XG4gICAgICAgICAgICBhcC5kb20uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XG4gICAgICAgICAgICAvLyBfdGhpcy5haXJwbGFuZS5cblxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcWFkcm9uLWRlbFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICB2YXIgdmFsID0gIF90aGlzLmdldEFjdGl2ZUl0ZW0oXCJhaXJwbGFuZXMtaW4tc3F1YWRyb25cIik7XG4gICAgICAgICAgLy8gIHZhciB2YWwgPSAoPEhUTUxTZWxlY3RFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVzLWluLXNxdWFkcm9uXCIpKS52YWx1ZTtcbiAgICAgICAgICAgIGlmICh2YWwgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdmFyIGFwID0gX3RoaXMuYWlycGxhbmUud29ybGQuZmluZEFpcnBsYW5lKHZhbCk7XG4gICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuYWlycGxhbmUuc3F1YWRyb24uaW5kZXhPZihhcCk7XG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5zcXVhZHJvbi5zcGxpY2UocG9zLCAxKTtcblxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLnB1c2goYXApO1xuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUudXBkYXRlU3F1YWRyb24oKTtcbiAgICAgICAgICAgIGFwLnVwZGF0ZVNxdWFkcm9uKCk7XG4gICAgICAgICAgICBpZiAoYXAuZG9tID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhcC53b3JsZCA9IF90aGlzLmFpcnBsYW5lLndvcmxkO1xuICAgICAgICAgICAgICAgIGFwLnJlbmRlcigpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFwLmRvbS5zdHlsZS5kaXNwbGF5ID0gXCJpbml0aWFsXCI7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLndvcmxkLmRvbS5hcHBlbmRDaGlsZChhcC5kb20pO1xuICAgICAgICAgICAgYXAueCA9IF90aGlzLmFpcnBsYW5lLng7XG4gICAgICAgICAgICBhcC55ID0gX3RoaXMuYWlycGxhbmUueTtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJzcXVhZHJvbmRpYWxvZ1wiIGNsYXNzPVwic3F1YWRyb25kaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XG4gICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFkcm9uZGlhbG9nXCIpO1xuICAgICAgICBpZiAob2xkKSB7XG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XG4gICAgICAgIHZhciBwcm9kdWN0cyA9IHBhcmFtZXRlci5hbGxQcm9kdWN0cztcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHNkb20gPSBgXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8dGFibGU+XG4gICAgICAgICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBaXJwbGFuZXMgaW4gY2l0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwiYWlycGxhbmVzLWluLWNpdHlcIiBjbGFzcz1cIm15bGlzdCBib3hib3JkZXJcIiBzdHlsZT1cImhlaWdodDogMjUwcHg7d2lkdGg6MTUwcHhcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIHZhbHVlPVwibm8gYWlycGxhbmVzIGluIGNpdHlcIj5ubyBhaXJwbGFuZXMgaW4gY2l0eTwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzcWFkcm9uLWFkZFwiPmArIEljb25zLnRvcmlnaHQgKyBgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzcWFkcm9uLWRlbFwiID5gKyBJY29ucy50b2xlZnQgKyBgPC9idXR0b24+PGJyLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQWlybGFuZXMgaW4gU3F1YWRyb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBpZD1cImFpcnBsYW5lcy1pbi1zcXVhZHJvblwiIGNsYXNzPVwibXlsaXN0IGJveGJvcmRlclwiIHN0eWxlPVwiaGVpZ2h0OiAyNTBweDt3aWR0aDoxNTBweFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgfSkoKX1cbiAgICAgICAgICAgIFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICBgO1xuICAgICAgICB2YXIgbmV3ZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xuXG4gICAgICAgIC8vICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNpdHlkaWFsb2ctcHJldlwiKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKCEkKHRoaXMuZG9tKS5kaWFsb2coJ2lzT3BlbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VsZWN0Q2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVzLWluLWNpdHlcIik7XG4gICAgICAgIHZhciBzZWxlY3RTcXVhZHJvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVzLWluLXNxdWFkcm9uXCIpO1xuICAgICAgICB2YXIgY2l0eTogQ2l0eSA9IHRoaXMuYWlycGxhbmUuZ2V0Q3VycmVudENpdHkoKTtcblxuICAgICAgICBpZiAoY2l0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzZWxlY3RDaXR5LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICB2YXIgYXBzID0gY2l0eS5nZXRBaXJwbGFuZXNJbkNpdHkoKTtcbiAgICAgICAgICAgIHZhciBzID0gXCJcIjtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYXBzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFwc1t4XSAhPT0gdGhpcy5haXJwbGFuZSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9hZGQgPSBhcHNbeF07XG4gICAgICAgICAgICAgICAgICAgIHMgKz0gJzxsaSB2YWx1ZT1cIicgKyB0b2FkZC5uYW1lICsgJ1wiPicgKyB0b2FkZC5uYW1lICsgJzwvbGk+J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGVjdENpdHkuaW5uZXJIVE1MID0gcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VsZWN0Q2l0eS5pbm5lckhUTUwgPT09IFwiXCIpIHtcbiAgICAgICAgICAgIHNlbGVjdENpdHkuaW5uZXJIVE1MID0gJzxsaSB2YWx1ZT1cIm5vIGFpcnBsYW5lcyBpbiBjaXR5XCI+bm8gYWlycGxhbmVzIGluIGNpdHk8L2xpPic7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZWN0U3F1YWRyb24uaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgLy9zZWxlY3RTcXVhZHJvbi5hcHBlbmRDaGlsZChvcHQpO1xuICAgICAgICB2YXIgcyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZS5zcXVhZHJvbi5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIHRvYWRkID0gdGhpcy5haXJwbGFuZS5zcXVhZHJvblt4XTtcbiAgICAgICAgICAgIHMgKz0gJzxsaSB2YWx1ZT1cIicgKyB0b2FkZC5uYW1lICsgJ1wiPicgKyB0b2FkZC5uYW1lICsgJzwvbGk+J1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdFNxdWFkcm9uLmlubmVySFRNTCA9IHM7XG4gICAgfVxuICAgIHNob3coKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xuICAgICAgICAgICAgdGl0bGU6IFwiTW9kaWZ5IFNxdWFkcm9uXCIsXG4gICAgICAgICAgICB3aWR0aDogXCI0MDBweFwiLFxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxuICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOntteTpcImxlZnQgdG9wXCIsYXQ6XCJyaWdodCB0b3BcIixvZjokKGRvY3VtZW50KX0gLFxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJChlLnRhcmdldCkuZGlhbG9nKFwid2lkZ2V0XCIpLmZpbmQoXCIudWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLCBcImNvbnRhaW5tZW50XCIsIFwibm9uZVwiKTtcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcblxuICAgIH1cbiAgICBjbG9zZSgpIHtcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgfVxufVxuIl19