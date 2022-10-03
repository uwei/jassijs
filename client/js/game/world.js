define(["require", "exports", "game/city", "game/airplane"], function (require, exports, city_1, airplane_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.World = void 0;
    class World {
        constructor() {
            var _this = this;
            this.cities = [];
            this.airplanes = [];
        }
        getElementOffset(el) {
            let top = 0;
            let left = 0;
            let element = el;
            // Loop through the DOM tree
            // and add it's parent's offset to get page offset
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
            return {
                top,
                left,
            };
        }
        oncontextmenu(evt) {
            evt.preventDefault();
            /*
                     if(this.selection){
                         var pt=this.getElementOffset(evt.currentTarget);
                        (<Airplane>this.selection).flyTo(evt.x-pt.left-8,evt.y-pt.top-10);
                        console.log(evt.offsetX);
                    }*/
        }
        onclick(th) {
            var _a;
            (_a = this.selection) === null || _a === void 0 ? void 0 : _a.unselect();
        }
        update() {
            var _a;
            for (var x = 0; x < ((_a = this.airplanes) === null || _a === void 0 ? void 0 : _a.length); x++) {
                /*if (this.airplanes[x].x < 500)
                    this.airplanes[x].x = this.airplanes[x].x + 1;
                else {
                    this.airplanes[x].x = 100;
                }*/
                this.airplanes[x].update();
            }
        }
        create(dom) {
            var _this = this;
            this.dom = dom;
            this.cities = (0, city_1.createCities)(this, 5);
            for (var x = 0; x < this.cities.length; x++) {
                this.cities[x].create();
                this.cities[x].update();
                dom.appendChild(this.cities[x].dom);
            }
            for (var x = 0; x < 1; x++) {
                var ap = new airplane_1.Airplane();
                ap.name = "Airplane " + x;
                ap.speed = 10;
                ap.create();
                ap.world = this;
                this.dom.appendChild(ap.dom);
                this.airplanes.push(ap);
            }
            dom.addEventListener("click", (ev) => {
                _this.onclick(ev);
                return undefined;
            });
            dom.addEventListener("contextmenu", (ev) => {
                _this.oncontextmenu(ev);
                return undefined;
            });
        }
        findCityAt(x, y) {
            for (var i = 0; i < this.cities.length; i++) {
                if (this.cities[i].x === x && this.cities[i].y === y) {
                    return this.cities[i];
                }
            }
            return undefined;
        }
        destroy() {
            clearInterval(this._intervall);
        }
    }
    exports.World = World;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ybGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9nYW1lL3dvcmxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFPQSxNQUFhLEtBQUs7UUFPZDtZQUNJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUl4QixDQUFDO1FBQ1EsZ0JBQWdCLENBQUMsRUFBRTtZQUN4QixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFFakIsNEJBQTRCO1lBQzVCLGtEQUFrRDtZQUNsRCxHQUFHO2dCQUNDLEdBQUcsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQztnQkFDOUIsSUFBSSxJQUFJLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO2dCQUNoQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQzthQUNsQyxRQUFRLE9BQU8sRUFBRTtZQUVsQixPQUFPO2dCQUNILEdBQUc7Z0JBQ0gsSUFBSTthQUNQLENBQUM7UUFDTixDQUFDO1FBQ0QsYUFBYSxDQUFDLEdBQWM7WUFDeEIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzdCOzs7Ozt1QkFLVztRQUVQLENBQUM7UUFDRCxPQUFPLENBQUMsRUFBYzs7WUFFZCxNQUFBLElBQUksQ0FBQyxTQUFTLDBDQUFFLFFBQVEsRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNOztZQUNGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBRyxNQUFBLElBQUksQ0FBQyxTQUFTLDBDQUFFLE1BQU0sQ0FBQSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3Qzs7OzttQkFJRztnQkFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzlCO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFnQjtZQUNuQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBQyxHQUFHLENBQUM7WUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEsbUJBQVksRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUV4QixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkM7WUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QixJQUFJLEVBQUUsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztnQkFDeEIsRUFBRSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDZCxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ1osRUFBRSxDQUFDLEtBQUssR0FBQyxJQUFJLENBQUM7Z0JBQ2QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUMzQjtZQUNELEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFjLEVBQUUsRUFBRTtnQkFDN0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEIsT0FBTyxTQUFTLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUM7WUFDSCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBYSxFQUFDLEVBQUU7Z0JBQ2pELEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3hCLE9BQU8sU0FBUyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBRVAsQ0FBQztRQUNELFVBQVUsQ0FBQyxDQUFRLEVBQUMsQ0FBUTtZQUN4QixLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7Z0JBQ2pDLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUcsQ0FBQyxJQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFHLENBQUMsRUFBQztvQkFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUN6QjthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUNELE9BQU87WUFDSCxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDSjtJQWpHRCxzQkFpR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IENpdHksIGNyZWF0ZUNpdGllcyB9IGZyb20gXCJnYW1lL2NpdHlcIjtcclxuaW1wb3J0IHsgQWlycGxhbmUgfSBmcm9tIFwiZ2FtZS9haXJwbGFuZVwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JsZCB7XHJcbiAgICBfaW50ZXJ2YWxsO1xyXG4gICAgY2l0aWVzOiBDaXR5W107XHJcbiAgICBhaXJwbGFuZXM6IEFpcnBsYW5lW107XHJcbiAgICBzZWxlY3Rpb247XHJcbiAgICBkb206SFRNTEVsZW1lbnQ7XHJcbiAgICBnYW1lOkdhbWU7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuY2l0aWVzID0gW107XHJcbiAgICAgICAgdGhpcy5haXJwbGFuZXMgPSBbXTtcclxuICAgICAgICBcclxuICAgICAgIFxyXG5cclxuICAgIH1cclxuICAgICBwcml2YXRlIGdldEVsZW1lbnRPZmZzZXQoZWwpIHtcclxuICAgICAgICBsZXQgdG9wID0gMDtcclxuICAgICAgICBsZXQgbGVmdCA9IDA7XHJcbiAgICAgICAgbGV0IGVsZW1lbnQgPSBlbDtcclxuXHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBET00gdHJlZVxyXG4gICAgICAgIC8vIGFuZCBhZGQgaXQncyBwYXJlbnQncyBvZmZzZXQgdG8gZ2V0IHBhZ2Ugb2Zmc2V0XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3AgfHwgMDtcclxuICAgICAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQgfHwgMDtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgIH0gd2hpbGUgKGVsZW1lbnQpOyBcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdG9wLFxyXG4gICAgICAgICAgICBsZWZ0LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBvbmNvbnRleHRtZW51KGV2dDpNb3VzZUV2ZW50KXtcclxuICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuLypcclxuICAgICAgICAgaWYodGhpcy5zZWxlY3Rpb24pe1xyXG4gICAgICAgICAgICAgdmFyIHB0PXRoaXMuZ2V0RWxlbWVudE9mZnNldChldnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgICg8QWlycGxhbmU+dGhpcy5zZWxlY3Rpb24pLmZseVRvKGV2dC54LXB0LmxlZnQtOCxldnQueS1wdC50b3AtMTApO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldnQub2Zmc2V0WCk7XHJcbiAgICAgICAgfSovXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBvbmNsaWNrKHRoOiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uPy51bnNlbGVjdCgpO1xyXG4gICAgfVxyXG4gICAgdXBkYXRlKCkge1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5haXJwbGFuZXM/Lmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIC8qaWYgKHRoaXMuYWlycGxhbmVzW3hdLnggPCA1MDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFpcnBsYW5lc1t4XS54ID0gdGhpcy5haXJwbGFuZXNbeF0ueCArIDE7XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5haXJwbGFuZXNbeF0ueCA9IDEwMDtcclxuICAgICAgICAgICAgfSovXHJcbiAgICAgICAgICAgIHRoaXMuYWlycGxhbmVzW3hdLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNyZWF0ZShkb206IEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmRvbT1kb207XHJcbiAgICAgICAgdGhpcy5jaXRpZXMgPSBjcmVhdGVDaXRpZXModGhpcyw1KTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuY2l0aWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2l0aWVzW3hdLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmNpdGllc1t4XS51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmNpdGllc1t4XS5kb20pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IDE7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgYXAgPSBuZXcgQWlycGxhbmUoKTtcclxuICAgICAgICAgICAgYXAubmFtZSA9IFwiQWlycGxhbmUgXCIgKyB4O1xyXG4gICAgICAgICAgICBhcC5zcGVlZCA9IDEwO1xyXG4gICAgICAgICAgICBhcC5jcmVhdGUoKTtcclxuICAgICAgICAgICAgYXAud29ybGQ9dGhpcztcclxuICAgICAgICAgICAgdGhpcy5kb20uYXBwZW5kQ2hpbGQoYXAuZG9tKTtcclxuICAgICAgICAgICAgdGhpcy5haXJwbGFuZXMucHVzaChhcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIF90aGlzLm9uY2xpY2soZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRvbS5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgKGV2Ok1vdXNlRXZlbnQpPT57XHJcbiAgICAgICAgICAgIF90aGlzLm9uY29udGV4dG1lbnUoZXYpO1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgXHJcbiAgICB9XHJcbiAgICBmaW5kQ2l0eUF0KHg6bnVtYmVyLHk6bnVtYmVyKXtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPHRoaXMuY2l0aWVzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmNpdGllc1tpXS54PT09eCYmdGhpcy5jaXRpZXNbaV0ueT09PXkpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2l0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSAgIFxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5faW50ZXJ2YWxsKTtcclxuICAgIH1cclxufVxyXG5cclxuIl19