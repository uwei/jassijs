define(["require", "exports", "game/product", "game/icons"], function (require, exports, product_1, icons_1) {
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
                debugger;
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
            var products = product_1.allProducts;
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
                width: "583px",
                draggable: true,
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update();
                },
                close: function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YWRyb25kaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3NxdWFkcm9uZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxNQUFhLGNBQWM7UUFLdkI7WUFFSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXO1lBQ2QsSUFBSSxjQUFjLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3JDLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsQ0FBQztRQUVELFdBQVc7WUFDUCxJQUFJLEtBQUssR0FBQyxJQUFJLENBQUM7WUFDZixRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNuRSxRQUFRLENBQUM7Z0JBQ1QsSUFBSSxHQUFHLEdBQXVCLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQ2xGLElBQUksR0FBRyxLQUFLLHNCQUFzQixJQUFFLEdBQUcsS0FBRyxFQUFFO29CQUN4QyxPQUFPO2dCQUNYLElBQUksRUFBRSxHQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxHQUFHLEdBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbkQsSUFBSSxLQUFLLEdBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDckQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFD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Z2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3F1YWRyb25EaWFsb2cge1xyXG4gICAgZG9tOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIGFpcnBsYW5lOiBBaXJwbGFuZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XHJcblxyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldEluc3RhbmNlKCk6IFNxdWFkcm9uRGlhbG9nIHtcclxuICAgICAgICBpZiAoU3F1YWRyb25EaWFsb2cuaW5zdGFuY2UgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgU3F1YWRyb25EaWFsb2cuaW5zdGFuY2UgPSBuZXcgU3F1YWRyb25EaWFsb2coKTtcclxuICAgICAgICByZXR1cm4gU3F1YWRyb25EaWFsb2cuaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgYmluZEFjdGlvbnMoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzPXRoaXM7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcWFkcm9uLWFkZFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gKDxIVE1MU2VsZWN0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lcy1pbi1jaXR5XCIpKS52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PT0gXCJubyBhaXJwbGFuZXMgaW4gY2l0eVwifHx2YWw9PT1cIlwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgYXA9X3RoaXMuYWlycGxhbmUud29ybGQuZmluZEFpcnBsYW5lKHZhbCk7XHJcbiAgICAgICAgICAgIHZhciBwb3M9X3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoYXApO1xyXG4gICAgICAgICAgICB2YXIgYXBwb3M9X3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YoYXApO1xyXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuc3BsaWNlKHBvcywxKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLnNxdWFkcm9uLnB1c2goYXApO1xyXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS51cGRhdGVTcXVhZHJvbigpO1xyXG4gICAgICAgICAgICBhcC51cGRhdGVTcXVhZHJvbigpO1xyXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS53b3JsZC5kb20ucmVtb3ZlQ2hpbGQoYXAuZG9tKTtcclxuICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgICAgLy8gX3RoaXMuYWlycGxhbmUuXHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3FhZHJvbi1kZWxcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZSgpIHtcclxuICAgICAgICAvL3RlbXBsYXRlIGZvciBjb2RlIHJlbG9hZGluZ1xyXG4gICAgICAgIHZhciBzZG9tID0gYFxyXG4gICAgICAgICAgPGRpdiBoaWRkZW4gaWQ9XCJzcXVhZHJvbmRpYWxvZ1wiIGNsYXNzPVwic3F1YWRyb25kaWFsb2dcIj5cclxuICAgICAgICAgICAgPGRpdj48L2Rpdj5cclxuICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHRoaXMuZG9tID0gPGFueT5kb2N1bWVudC5jcmVhdGVSYW5nZSgpLmNyZWF0ZUNvbnRleHR1YWxGcmFnbWVudChzZG9tKS5jaGlsZHJlblswXTtcclxuICAgICAgICB2YXIgb2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcXVhZHJvbmRpYWxvZ1wiKTtcclxuICAgICAgICBpZiAob2xkKSB7XHJcbiAgICAgICAgICAgIG9sZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG9sZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gYWxsUHJvZHVjdHM7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJhaXJwbGFuZXMtaW4tY2l0eVwiIHNpemU9XCI3XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm5vIGFpcnBsYW5lcyBpbiBjaXR5XCI+bm8gYWlycGxhbmVzIGluIGNpdHk8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNxYWRyb24tYWRkXCI+YCsgSWNvbnMudG9yaWdodCArIGA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic3FhZHJvbi1kZWxcIiA+YCsgSWNvbnMudG9sZWZ0ICsgYDwvYnV0dG9uPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImFpcnBsYW5lcy1pbi1zcXVhZHJvblwiIHNpemU9XCI3XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9KSgpfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHZhciBzZWxlY3RDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZXMtaW4tY2l0eVwiKTtcclxuICAgICAgICB2YXIgc2VsZWN0U3F1YWRyb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lcy1pbi1zcXVhZHJvblwiKTtcclxuICAgICAgICB2YXIgY2l0eTogQ2l0eSA9IHRoaXMuYWlycGxhbmUuZ2V0Q3VycmVudENpdHkoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoY2l0eSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdENpdHkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgdmFyIGFwcz1jaXR5LmdldEFpcnBsYW5lc0luQ2l0eSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFwcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGFwc1t4XSAhPT0gdGhpcy5haXJwbGFuZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9hZGQgPSBhcHNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnZhbHVlID0gdG9hZGQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBvcHQudGV4dCA9IHRvYWRkLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0Q2l0eS5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzZWxlY3RDaXR5LmlubmVySFRNTCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBzZWxlY3RDaXR5LmlubmVySFRNTCA9ICc8b3B0aW9uIHZhbHVlPVwibm8gYWlycGxhbmVzIGluIGNpdHlcIj5ubyBhaXJwbGFuZXMgaW4gY2l0eTwvb3B0aW9uPic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNlbGVjdFNxdWFkcm9uLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgIG9wdC52YWx1ZSA9IHRoaXMuYWlycGxhbmUubmFtZTtcclxuICAgICAgICBvcHQudGV4dCA9IHRoaXMuYWlycGxhbmUubmFtZTtcclxuICAgICAgICBzZWxlY3RTcXVhZHJvbi5hcHBlbmRDaGlsZChvcHQpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZS5zcXVhZHJvbi5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgIHZhciB0b2FkZCA9IHRoaXMuYWlycGxhbmUuc3F1YWRyb25beF07XHJcbiAgICAgICAgICAgIG9wdC52YWx1ZSA9IHRvYWRkLm5hbWU7XHJcbiAgICAgICAgICAgIG9wdC50ZXh0ID0gdG9hZGQubmFtZTtcclxuICAgICAgICAgICAgc2VsZWN0U3F1YWRyb24uYXBwZW5kQ2hpbGQob3B0KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2hvdygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUF0dHJpYnV0ZShcImhpZGRlblwiKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIC8vdWktdGFicy1hY3RpdmVcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coe1xyXG4gICAgICAgICAgICB0aXRsZTogXCJNb2RpZnkgU3F1YWRyb25cIixcclxuICAgICAgICAgICAgd2lkdGg6IFwiNTgzcHhcIixcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOnRydWUsXHJcbiAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjp7bXk6XCJsZWZ0IHRvcFwiLGF0OlwicmlnaHQgdG9wXCIsb2Y6JChkb2N1bWVudCl9ICxcclxuICAgICAgICAgICAgb3BlbjogZnVuY3Rpb24gKGV2ZW50LCB1aSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5kaWFsb2coXCJ3aWRnZXRcIikuZHJhZ2dhYmxlKFwib3B0aW9uXCIsXCJjb250YWlubWVudFwiLFwibm9uZVwiKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5wYXJlbnQoKS5jc3MoeyBwb3NpdGlvbjogXCJmaXhlZFwiIH0pO1xyXG5cclxuICAgIH1cclxuICAgIGNsb3NlKCkge1xyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyhcImNsb3NlXCIpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==