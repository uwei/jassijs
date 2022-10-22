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
                width: "400px",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YWRyb25kaWFsb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3NxdWFkcm9uZGlhbG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxNQUFhLGNBQWM7UUFLdkI7WUFFSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFbEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxXQUFXO1lBQ2QsSUFBSSxjQUFjLENBQUMsUUFBUSxLQUFLLFNBQVM7Z0JBQ3JDLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztZQUNuRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7UUFDbkMsQ0FBQztRQUVELFdBQVc7WUFDUCxJQUFJLEtBQUssR0FBQyxJQUFJLENBQUM7WUFDZixRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNuRSxJQUFJLEdBQUcsR0FBdUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBRSxDQUFDLEtBQUssQ0FBQztnQkFDbEYsSUFBSSxHQUFHLEtBQUssc0JBQXNCLElBQUUsR0FBRyxLQUFHLEVBQUU7b0JBQ3hDLE9BQU87Z0JBQ1gsSUFBSSxFQUFFLEdBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLEdBQUcsR0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxJQUFJLEtBQUssR0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFFN0MsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNqQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNoQyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3BCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ2hCLGtCQUFrQjtZQUVyQixDQUFDLENBQUMsQ0FBQztZQUNILFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFFdkUsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRU8sTUFBTTtZQUNWLDZCQUE2QjtZQUM3QixJQUFJLElBQUksR0FBRzs7OztTQUlWLENBQUM7WUFDRixJQUFJLENBQUMsR0FBRyxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BELElBQUksR0FBRyxFQUFFO2dCQUNMLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixJQUFJLFFBQVEsR0FBRyxxQkFBVyxDQUFDO1lBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLElBQUksR0FBRzs7Ozs7Ozs7Ozt1REFVb0MsR0FBRSxhQUFLLENBQUMsT0FBTyxHQUFHO3dEQUNqQixHQUFFLGFBQUssQ0FBQyxNQUFNLEdBQUc7Ozs7Ozs7Ozs7eUJBVWhELENBQUMsU0FBUyxHQUFHO2dCQUN0QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxHQUFHLENBQUM7WUFDZixDQUFDLENBQUMsRUFBRTs7O1NBR1AsQ0FBQztZQUNGLElBQUksTUFBTSxHQUFRLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU3QixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFcEMsb0RBQW9EO1lBQ3BELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1osS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSLGlDQUFpQztRQUNyQyxDQUFDO1FBRUQsTUFBTTtZQUNGLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM5RCxJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDdEUsSUFBSSxJQUFJLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUVoRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7Z0JBQ3BCLFVBQVUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixJQUFJLEdBQUcsR0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ2pDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7d0JBQzFCLElBQUksR0FBRyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUM5RCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQzt3QkFDdkIsR0FBRyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO3dCQUN0QixVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMvQjtpQkFDSjthQUNKO1lBQ0QsSUFBSSxVQUFVLENBQUMsU0FBUyxLQUFLLEVBQUUsRUFBRTtnQkFDN0IsVUFBVSxDQUFDLFNBQVMsR0FBRyxvRUFBb0UsQ0FBQzthQUMvRjtZQUNELGNBQWMsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQzlCLElBQUksR0FBRyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDL0IsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUM5QixjQUFjLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksR0FBRyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUN2QixHQUFHLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQ3RCLGNBQWMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7YUFFbkM7UUFDTCxDQUFDO1FBQ0QsSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxnQkFBZ0I7WUFDaEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7Z0JBQ2YsS0FBSyxFQUFFLGlCQUFpQjtnQkFDeEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsU0FBUyxFQUFDLElBQUk7Z0JBQ2QsK0RBQStEO2dCQUMvRCxJQUFJLEVBQUUsVUFBVSxLQUFLLEVBQUUsRUFBRTtvQkFDckIsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuQixDQUFDO2dCQUNELEtBQUssRUFBRTtnQkFDUCxDQUFDO2FBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFDLGFBQWEsRUFBQyxNQUFNLENBQUMsQ0FBQztZQUM3RCxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRXBELENBQUM7UUFDRCxLQUFLO1lBQ0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQztLQUNKO0lBekpELHdDQXlKQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5pbXBvcnQgeyBhbGxQcm9kdWN0cywgUHJvZHVjdCB9IGZyb20gXCJnYW1lL3Byb2R1Y3RcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gXCJnYW1lL2ljb25zXCI7XHJcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSBcImdhbWUvcm91dGVcIjtcclxuaW1wb3J0IHsgQ2l0eSB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTcXVhZHJvbkRpYWxvZyB7XHJcbiAgICBkb206IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgYWlycGxhbmU6IEFpcnBsYW5lO1xyXG4gICAgcHVibGljIHN0YXRpYyBpbnN0YW5jZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGUoKTtcclxuXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogU3F1YWRyb25EaWFsb2cge1xyXG4gICAgICAgIGlmIChTcXVhZHJvbkRpYWxvZy5pbnN0YW5jZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBTcXVhZHJvbkRpYWxvZy5pbnN0YW5jZSA9IG5ldyBTcXVhZHJvbkRpYWxvZygpO1xyXG4gICAgICAgIHJldHVybiBTcXVhZHJvbkRpYWxvZy5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBiaW5kQWN0aW9ucygpIHtcclxuICAgICAgICB2YXIgX3RoaXM9dGhpcztcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxYWRyb24tYWRkXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9ICg8SFRNTFNlbGVjdEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZXMtaW4tY2l0eVwiKSkudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT09IFwibm8gYWlycGxhbmVzIGluIGNpdHlcInx8dmFsPT09XCJcIilcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGFwPV90aGlzLmFpcnBsYW5lLndvcmxkLmZpbmRBaXJwbGFuZSh2YWwpO1xyXG4gICAgICAgICAgICB2YXIgcG9zPV90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKGFwKTtcclxuICAgICAgICAgICAgdmFyIGFwcG9zPV90aGlzLmFpcnBsYW5lLndvcmxkLmFpcnBsYW5lcy5pbmRleE9mKGFwKTtcclxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUud29ybGQuYWlycGxhbmVzLnNwbGljZShwb3MsMSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBfdGhpcy5haXJwbGFuZS5zcXVhZHJvbi5wdXNoKGFwKTtcclxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUudXBkYXRlU3F1YWRyb24oKTtcclxuICAgICAgICAgICAgYXAudXBkYXRlU3F1YWRyb24oKTtcclxuICAgICAgICAgICAgX3RoaXMuYWlycGxhbmUud29ybGQuZG9tLnJlbW92ZUNoaWxkKGFwLmRvbSk7XHJcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgIC8vIF90aGlzLmFpcnBsYW5lLlxyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNxYWRyb24tZGVsXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGUoKSB7XHJcbiAgICAgICAgLy90ZW1wbGF0ZSBmb3IgY29kZSByZWxvYWRpbmdcclxuICAgICAgICB2YXIgc2RvbSA9IGBcclxuICAgICAgICAgIDxkaXYgaGlkZGVuIGlkPVwic3F1YWRyb25kaWFsb2dcIiBjbGFzcz1cInNxdWFkcm9uZGlhbG9nXCI+XHJcbiAgICAgICAgICAgIDxkaXY+PC9kaXY+XHJcbiAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICB0aGlzLmRvbSA9IDxhbnk+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc2RvbSkuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgdmFyIG9sZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3F1YWRyb25kaWFsb2dcIik7XHJcbiAgICAgICAgaWYgKG9sZCkge1xyXG4gICAgICAgICAgICBvbGQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYWlycGxhbmUgPSB0aGlzLmFpcnBsYW5lO1xyXG4gICAgICAgIHZhciBwcm9kdWN0cyA9IGFsbFByb2R1Y3RzO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHNkb20gPSBgXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwiYWlycGxhbmVzLWluLWNpdHlcIiBzaXplPVwiN1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJubyBhaXJwbGFuZXMgaW4gY2l0eVwiPm5vIGFpcnBsYW5lcyBpbiBjaXR5PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJzcWFkcm9uLWFkZFwiPmArIEljb25zLnRvcmlnaHQgKyBgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInNxYWRyb24tZGVsXCIgPmArIEljb25zLnRvbGVmdCArIGA8L2J1dHRvbj48YnIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJhaXJwbGFuZXMtaW4tc3F1YWRyb25cIiBzaXplPVwiN1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICR7KGZ1bmN0aW9uIGZ1bigpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICAgICAgfSkoKX1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHZhciBuZXdkb20gPSA8YW55PmRvY3VtZW50LmNyZWF0ZVJhbmdlKCkuY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50KHNkb20pLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIHRoaXMuZG9tLnJlbW92ZUNoaWxkKHRoaXMuZG9tLmNoaWxkcmVuWzBdKTtcclxuICAgICAgICB0aGlzLmRvbS5hcHBlbmRDaGlsZChuZXdkb20pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcclxuXHJcbiAgICAgICAgLy8gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2l0eWRpYWxvZy1wcmV2XCIpXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLmJpbmRBY3Rpb25zKCk7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAvL2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB2YXIgc2VsZWN0Q2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWlycGxhbmVzLWluLWNpdHlcIik7XHJcbiAgICAgICAgdmFyIHNlbGVjdFNxdWFkcm9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhaXJwbGFuZXMtaW4tc3F1YWRyb25cIik7XHJcbiAgICAgICAgdmFyIGNpdHk6IENpdHkgPSB0aGlzLmFpcnBsYW5lLmdldEN1cnJlbnRDaXR5KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGNpdHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBzZWxlY3RDaXR5LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBhcHM9Y2l0eS5nZXRBaXJwbGFuZXNJbkNpdHkoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhcHMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcHNbeF0gIT09IHRoaXMuYWlycGxhbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3B0OiBIVE1MT3B0aW9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvYWRkID0gYXBzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdC52YWx1ZSA9IHRvYWRkLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0LnRleHQgPSB0b2FkZC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdENpdHkuYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2VsZWN0Q2l0eS5pbm5lckhUTUwgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgc2VsZWN0Q2l0eS5pbm5lckhUTUwgPSAnPG9wdGlvbiB2YWx1ZT1cIm5vIGFpcnBsYW5lcyBpbiBjaXR5XCI+bm8gYWlycGxhbmVzIGluIGNpdHk8L29wdGlvbj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxlY3RTcXVhZHJvbi5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBvcHQ6IEhUTUxPcHRpb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKTtcclxuICAgICAgICBvcHQudmFsdWUgPSB0aGlzLmFpcnBsYW5lLm5hbWU7XHJcbiAgICAgICAgb3B0LnRleHQgPSB0aGlzLmFpcnBsYW5lLm5hbWU7XHJcbiAgICAgICAgc2VsZWN0U3F1YWRyb24uYXBwZW5kQ2hpbGQob3B0KTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuYWlycGxhbmUuc3F1YWRyb24ubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgdmFyIG9wdDogSFRNTE9wdGlvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xyXG4gICAgICAgICAgICB2YXIgdG9hZGQgPSB0aGlzLmFpcnBsYW5lLnNxdWFkcm9uW3hdO1xyXG4gICAgICAgICAgICBvcHQudmFsdWUgPSB0b2FkZC5uYW1lO1xyXG4gICAgICAgICAgICBvcHQudGV4dCA9IHRvYWRkLm5hbWU7XHJcbiAgICAgICAgICAgIHNlbGVjdFNxdWFkcm9uLmFwcGVuZENoaWxkKG9wdCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAvL3VpLXRhYnMtYWN0aXZlXHJcbiAgICAgICAgJCh0aGlzLmRvbSkuZGlhbG9nKHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiTW9kaWZ5IFNxdWFkcm9uXCIsXHJcbiAgICAgICAgICAgIHdpZHRoOiBcIjQwMHB4XCIsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTp0cnVlLFxyXG4gICAgICAgICAgICAvLyAgICAgcG9zaXRpb246e215OlwibGVmdCB0b3BcIixhdDpcInJpZ2h0IHRvcFwiLG9mOiQoZG9jdW1lbnQpfSAsXHJcbiAgICAgICAgICAgIG9wZW46IGZ1bmN0aW9uIChldmVudCwgdWkpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuZGlhbG9nKFwid2lkZ2V0XCIpLmRyYWdnYWJsZShcIm9wdGlvblwiLFwiY29udGFpbm1lbnRcIixcIm5vbmVcIik7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkucGFyZW50KCkuY3NzKHsgcG9zaXRpb246IFwiZml4ZWRcIiB9KTtcclxuXHJcbiAgICB9XHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICAkKHRoaXMuZG9tKS5kaWFsb2coXCJjbG9zZVwiKTtcclxuICAgIH1cclxufVxyXG4iXX0=