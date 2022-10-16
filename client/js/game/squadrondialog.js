define(["require", "exports", "game/product", "game/icons"], function (require, exports, product_1, icons_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SquadronDialog = void 0;
    var css = `
  .squadronialog >*{
        font-size:10px; 
    }
`;
    class SquadronDialog {
        constructor() {
            this.create();
        }
        static getInstance() {
            if (SquadronDialog.instance === undefined)
                SquadronDialog.instance = new SquadronDialog();
            return SquadronDialog.instance;
        }
        createStyle() {
            var style = document.createElement('style');
            style.id = "routedialogcss";
            style.type = 'text/css';
            style.innerHTML = css;
            var old = document.getElementById("routedialogcss");
            if (old) {
                old.parentNode.removeChild(old);
            }
            document.getElementsByTagName('head')[0].appendChild(style);
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
                var city = this.airplane.getCurrentCity();
                pos = city.airplanesInCity.indexOf(appos);
                city.airplanesInCity.splice(pos, 1);
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
            this.createStyle();
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
            var apid = this.airplane.world.airplanes.indexOf(this.airplane);
            if (city !== undefined) {
                selectCity.innerHTML = "";
                for (var x = 0; x < city.airplanesInCity.length; x++) {
                    if (city.airplanesInCity[x] !== apid) {
                        var opt = document.createElement("option");
                        var toadd = this.airplane.world.airplanes[city.airplanesInCity[x]];
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
                //     position:{my:"left top",at:"right top",of:$(document)} ,
                open: function (event, ui) {
                    _this.update();
                },
                close: function () {
                }
            });
            $(this.dom).parent().css({ position: "fixed" });
        }
        close() {
            $(this.dom).dialog("close");
        }
    }
    exports.SquadronDialog = SquadronDialog;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YWRyb25kaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3NxdWFkcm9uZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFNQSxJQUFJLEdBQUcsR0FBRzs7OztDQUlULENBQUM7SUFFRixNQUFhLGNBQWM7UUFLdkI7WUFFSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXO1lBQ2QsSUFBSSxjQUFjLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3JDLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsQ0FBQztRQUVPLFdBQVc7WUFDZixJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUM7WUFDNUIsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7WUFDeEIsS0FBSyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7WUFFdEIsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxDQUFDO1FBQ0QsV0FBVztZQUNQLElBQUksS0FBSyxHQUFDLElBQUksQ0FBQztZQUNmLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25FLFFBQVEsQ0FBQztnQkFDVCxJQUFJLEdBQUcsR0FBdUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBRSxDQUFDLEtBQUssQ0FBQztnQkFDbEYsSUFBSSxHQUFHLEtBQUssc0JBQXNCLElBQUUsR0FBRyxLQUFHLEVBQUU7b0JBQ3hDLE9BQU87Z0JBQ1gsSUFBSSxFQUFFLEdBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLEdBQUcsR0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEtBQUssR0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDaEQsR0FBRyxHQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRW5DLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDakMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNwQixLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDN0MsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixrQkFBa0I7WUFFckIsQ0FBQyxDQUFDLENBQUM7WUFDSCxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBRXZFLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVPLE1BQU07WUFDViw2QkFBNkI7WUFDN0IsSUFBSSxJQUFJLEdBQUc7Ozs7U0FJVixDQUFDO1lBQ0YsSUFBSSxDQUFDLEdBQUcsR0FBUSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNwRCxJQUFJLEdBQUcsRUFBRTtnQkFDTCxHQUFHLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNuQztZQUNELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzdCLElBQUksUUFBUSxHQUFHLHFCQUFXLENBQUM7WUFDM0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHOzs7Ozs7Ozs7O3VEQVVvQyxHQUFFLGFBQUssQ0FBQyxPQUFPLEdBQUc7d0RBQ2pCLEdBQUUsYUFBSyxDQUFDLE1BQU0sR0FBRzs7Ozs7Ozs7Ozt5QkFVaEQsQ0FBQyxTQUFTLEdBQUc7Z0JBQ3RCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDYixPQUFPLEdBQUcsQ0FBQztZQUNmLENBQUMsQ0FBQyxFQUFFOzs7U0FHUCxDQUFDO1lBQ0YsSUFBSSxNQUFNLEdBQVEsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRixJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTdCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVwQyxvREFBb0Q7WUFDcEQsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1IsaUNBQWlDO1FBQ3JDLENBQUM7UUFFRCxNQUFNO1lBQ0YsSUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQzlELElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztZQUN0RSxJQUFJLElBQUksR0FBUyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ2hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWhFLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtnQkFDcEIsVUFBVSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Z0JBQzFCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbEQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTt3QkFDbEMsSUFBSSxHQUFHLEdBQXNCLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzlELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25FLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQzt3QkFDdkIsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUN0QixVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMvQjtpQkFDSjthQUNKO1lBQ0QsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLEVBQUUsRUFBRTtnQkFDN0IsVUFBVSxDQUFDLFNBQVMsR0FBRyxvRUFBb0UsQ0FBQzthQUMvRjtZQUNELGNBQWMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksR0FBRyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDL0IsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUM5QixjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksR0FBRyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUN2QixHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLGNBQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7YUFFbkM7UUFDTCxDQUFDO1FBQ0QsSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxnQkFBZ0I7WUFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsS0FBSyxFQUFFLGlCQUFpQjtnQkFDeEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsK0RBQStEO2dCQUMvRCxJQUFJLEVBQUUsVUFBVSxLQUFLLEVBQUUsRUFBRTtvQkFDckIsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuQixDQUFDO2dCQUNELEtBQUssRUFBRTtnQkFDUCxDQUFDO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUVwRCxDQUFDO1FBQ0QsS0FBSztZQUNELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLENBQUM7S0FDSjtJQXpLRCx3Q0F5S0MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgYWxsUHJvZHVjdHMsIFByb2R1Y3QgfSBmcm9tIFwiZ2FtZS9wcm9kdWN0XCI7XHJcbmltcG9ydCB7IEFpcnBsYW5lIH0gZnJvbSBcImdhbWUvYWlycGxhbmVcIjtcclxuaW1wb3J0IHsgSWNvbnMgfSBmcm9tIFwiZ2FtZS9pY29uc1wiO1xyXG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gXCJnYW1lL3JvdXRlXCI7XHJcbmltcG9ydCB7IENpdHkgfSBmcm9tIFwiZ2FtZS9jaXR5XCI7XHJcbnZhciBjc3MgPSBgXHJcbiAgLnNxdWFkcm9uaWFsb2cgPip7XHJcbiAgICAgICAgZm9udC1zaXplOjEwcHg7IFxyXG4gICAgfVxyXG5gO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNxdWFkcm9uRGlhbG9nIHtcclxuICAgIGRvbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBhaXJwbGFuZTogQWlycGxhbmU7XHJcbiAgICBwdWJsaWMgc3RhdGljIGluc3RhbmNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBTcXVhZHJvbkRpYWxvZyB7XHJcbiAgICAgICAgaWYgKFNxdWFkcm9uRGlhbG9nLmluc3RhbmNlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIFNxdWFkcm9uRGlhbG9nLmluc3RhbmNlID0gbmV3IFNxdWFkcm9uRGlhbG9nKCk7XHJcbiAgICAgICAgcmV0dXJuIFNxdWFkcm9uRGlhbG9nLmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlU3R5bGUoKSB7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuICAgICAgICBzdHlsZS5pZCA9IFwicm91dGVkaWFsb2djc3NcIjtcclxuICAgICAgICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcclxuICAgICAgICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XHJcblxyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlZGlhbG9nY3NzXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzdHlsZSk7XHJcbiAgICB9XHJcbiAgICBiaW5kQWN0aW9ucygpIHtcclxuICAgICAgICB2YXIgX3RoaXM9dGhpcztcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxYWRyb24tYWRkXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgZGVidWdnZXI7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSAoPEhUTUxTZWxlY3RFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVzLWluLWNpdHlcIikpLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodmFsID09PSBcIm5vIGFpcnBsYW5lcyBpbiBjaXR5XCJ8fHZhbD09PVwiXCIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBhcD1fdGhpcy5haXJwbGFuZS53b3JsZC5maW5kQWlycGxhbmUodmFsKTtcclxuICAgICAgICAgICAgdmFyIHBvcz1fdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihhcCk7XHJcbiAgICAgICAgICAgIHZhciBhcHBvcz1fdGhpcy5haXJwbGFuZS53b3JsZC5haXJwbGFuZXMuaW5kZXhPZihhcCk7XHJcbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5zcGxpY2UocG9zLDEpO1xyXG4gICAgICAgICAgICB2YXIgY2l0eTogQ2l0eSA9IHRoaXMuYWlycGxhbmUuZ2V0Q3VycmVudENpdHkoKTtcclxuICAgICAgICAgICAgcG9zPWNpdHkuYWlycGxhbmVzSW5DaXR5LmluZGV4T2YoYXBwb3MpO1xyXG4gICAgICAgICAgICBjaXR5LmFpcnBsYW5lc0luQ2l0eS5zcGxpY2UocG9zLDEpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUuc3F1YWRyb24ucHVzaChhcCk7XHJcbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLnVwZGF0ZVNxdWFkcm9uKCk7XHJcbiAgICAgICAgICAgIGFwLnVwZGF0ZVNxdWFkcm9uKCk7XHJcbiAgICAgICAgICAgIF90aGlzLmFpcnBsYW5lLndvcmxkLmRvbS5yZW1vdmVDaGlsZChhcC5kb20pO1xyXG4gICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAvLyBfdGhpcy5haXJwbGFuZS5cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcWFkcm9uLWRlbFwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlKCkge1xyXG4gICAgICAgIC8vdGVtcGxhdGUgZm9yIGNvZGUgcmVsb2FkaW5nXHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2IGhpZGRlbiBpZD1cInNxdWFkcm9uZGlhbG9nXCIgY2xhc3M9XCJzcXVhZHJvbmRpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2PjwvZGl2PlxyXG4gICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdGhpcy5kb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHZhciBvbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxdWFkcm9uZGlhbG9nXCIpO1xyXG4gICAgICAgIGlmIChvbGQpIHtcclxuICAgICAgICAgICAgb2xkLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQob2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTdHlsZSgpO1xyXG4gICAgICAgIHZhciBhaXJwbGFuZSA9IHRoaXMuYWlycGxhbmU7XHJcbiAgICAgICAgdmFyIHByb2R1Y3RzID0gYWxsUHJvZHVjdHM7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJhaXJwbGFuZXMtaW4tY2l0eVwiIHNpemU9XCI3XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm5vIGFpcnBsYW5lcyBpbiBjaXR5XCI+bm8gYWlycGxhbmVzIGluIGNpdHk8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNxYWRyb24tYWRkXCI+YCsgSWNvbnMudG9yaWdodCArIGA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwic3FhZHJvbi1kZWxcIiA+YCsgSWNvbnMudG9sZWZ0ICsgYDwvYnV0dG9uPjxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cImFpcnBsYW5lcy1pbi1zcXVhZHJvblwiIHNpemU9XCI3XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgJHsoZnVuY3Rpb24gZnVuKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9KSgpfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgdmFyIG5ld2RvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQ2hpbGQodGhpcy5kb20uY2hpbGRyZW5bMF0pO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKG5ld2RvbSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb20pO1xyXG5cclxuICAgICAgICAvLyAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaXR5ZGlhbG9nLXByZXZcIilcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgX3RoaXMuYmluZEFjdGlvbnMoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIHZhciBzZWxlY3RDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZXMtaW4tY2l0eVwiKTtcclxuICAgICAgICB2YXIgc2VsZWN0U3F1YWRyb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFpcnBsYW5lcy1pbi1zcXVhZHJvblwiKTtcclxuICAgICAgICB2YXIgY2l0eTogQ2l0eSA9IHRoaXMuYWlycGxhbmUuZ2V0Q3VycmVudENpdHkoKTtcclxuICAgICAgICB2YXIgYXBpZCA9IHRoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLmluZGV4T2YodGhpcy5haXJwbGFuZSk7XHJcbiAgICBcclxuICAgICAgICBpZiAoY2l0eSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdENpdHkuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjaXR5LmFpcnBsYW5lc0luQ2l0eS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNpdHkuYWlycGxhbmVzSW5DaXR5W3hdICE9PSBhcGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b2FkZCA9IHRoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzW2NpdHkuYWlycGxhbmVzSW5DaXR5W3hdXTtcclxuICAgICAgICAgICAgICAgICAgICBvcHQudmFsdWUgPSB0b2FkZC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC50ZXh0ID0gdG9hZGQubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RDaXR5LmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNlbGVjdENpdHkuaW5uZXJIVE1MID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdENpdHkuaW5uZXJIVE1MID0gJzxvcHRpb24gdmFsdWU9XCJubyBhaXJwbGFuZXMgaW4gY2l0eVwiPm5vIGFpcnBsYW5lcyBpbiBjaXR5PC9vcHRpb24+JztcclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZWN0U3F1YWRyb24uaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgb3B0LnZhbHVlID0gdGhpcy5haXJwbGFuZS5uYW1lO1xyXG4gICAgICAgIG9wdC50ZXh0ID0gdGhpcy5haXJwbGFuZS5uYW1lO1xyXG4gICAgICAgIHNlbGVjdFNxdWFkcm9uLmFwcGVuZENoaWxkKG9wdCk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLmFpcnBsYW5lLnNxdWFkcm9uLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICAgICAgdmFyIHRvYWRkID0gdGhpcy5haXJwbGFuZS5zcXVhZHJvblt4XTtcclxuICAgICAgICAgICAgb3B0LnZhbHVlID0gdG9hZGQubmFtZTtcclxuICAgICAgICAgICAgb3B0LnRleHQgPSB0b2FkZC5uYW1lO1xyXG4gICAgICAgICAgICBzZWxlY3RTcXVhZHJvbi5hcHBlbmRDaGlsZChvcHQpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgLy91aS10YWJzLWFjdGl2ZVxyXG4gICAgICAgICQodGhpcy5kb20pLmRpYWxvZyh7XHJcbiAgICAgICAgICAgIHRpdGxlOiBcIk1vZGlmeSBTcXVhZHJvblwiLFxyXG4gICAgICAgICAgICB3aWR0aDogXCI1ODNweFwiLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcclxuICAgIH1cclxufVxyXG4iXX0=