define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Route = void 0;
    class Route {
        constructor() {
            this.type = "Route";
            this.unloadShopAmount = [];
            this.loadShopAmount = [];
            this.loadShopUntilAmount = [];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                this.unloadShopAmount.push(undefined);
                this.loadShopAmount.push(undefined);
                this.loadShopUntilAmount.push(undefined);
            }
        }
        /* unloadMarket() {
             var city = this.airplane.world.cities[this.cityid];
             for (var x = 0; x < parameter.allProducts.length; x++) {
                 var max = this.airplane.products[x];
     
                 if (this.unloadMarketAmount[x] !== undefined) {
                     max = Math.min(this.airplane.products[x], this.unloadMarketAmount[x]);
                     if (max < 0)
                         max = 0;
                 } else
                     max = 0;
                 if (max) {
                     for (var y = 0; y < max; y++) {
                         var price = parameter.allProducts[x].calcPrice(city.people, city.market[x], false);//city.isProducedHere(x));
                         if (price >= this.unloadMarketPrice[x]) {
                             city.world.game.changeMoney(1 * price, "airplane sells from market", city);
                             city.market[x] += 1;
                             this.airplane.products[x] -= 1;
                             this.airplane.refreshLoadedCount();
                         } else {
                             break;
     
                         }
                     }
     
                 }
             }
         }*/
        unloadShop() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var max = this.unloadShopAmount[x];
                if (max !== undefined) {
                    max = Math.min(max, this.airplane.products[x]);
                    if (max) {
                        var diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                        if (diff > 0)
                            max = Math.min(max, diff);
                        else
                            max = 0;
                        this.airplane.products[x] -= max;
                        this.airplane.refreshLoadedCount();
                        city.shop[x] += max;
                        diff = city.shops * parameter.capacityShop - city.getCompleteAmount();
                        if (diff <= 0) {
                            city.domShopfull.style.display = "initial";
                        }
                    }
                }
            }
        }
        loadShop() {
            var city = this.airplane.world.cities[this.cityid];
            for (var x = 0; x < parameter.allProducts.length; x++) {
                var minStock = city.shopMinStock[x] ? city.shopMinStock[x] : 0;
                var max = this.loadShopUntilAmount[x];
                if (max === undefined) {
                    if (this.loadShopAmount[x]) {
                        max = this.loadShopAmount[x];
                        //  if (x === 2)
                        //    console.log(city.name + " " + city.shop[x] + "  min" + minStock);
                        var tt = city.shop[x] - minStock;
                        if (max !== 0 && max !== undefined && (max > tt)) {
                            if (x === 17)
                                max = max;
                            max = city.shop[x] - minStock;
                        }
                        var notAvailable = this.loadShopAmount[x] - max;
                        this.airplane.world.game.statistic.successfulLoad[0][x] += max;
                        this.airplane.world.game.statistic.unsuccessfulLoad[0][x] += notAvailable;
                    }
                }
                else {
                    max = city.shop[x] - (this.loadShopUntilAmount[x] + minStock);
                }
                if (max < 0)
                    max = 0;
                if (this.maxLoad !== undefined && max !== undefined) {
                    max = Math.min(this.maxLoad - this.airplane.products[x], max);
                }
                if (max < 0)
                    max = 0;
                if (max && max > (this.airplane.capacity - this.airplane.loadedCount))
                    max = this.airplane.capacity - this.airplane.loadedCount;
                if (max) {
                    this.airplane.products[x] += max;
                    this.airplane.refreshLoadedCount();
                    city.shop[x] -= max;
                }
            }
        }
        /*  loadMarket() {
              var city = this.airplane.world.cities[this.cityid];
              for (var x = 0; x < parameter.allProducts.length; x++) {
                  var max = this.loadMarketAmount[x];
                  if (this.maxLoad !== undefined&&max) {
                      max = Math.min(max,this.maxLoad - this.airplane.products[x]);
                      if (max < 0)
                          max = 0;
                  }
                  if (max && max > (this.airplane.capacity - this.airplane.loadedCount))
                      max = this.airplane.capacity - this.airplane.loadedCount;
                  if (max) {
                      for (var y = 0; y < max; y++) {
                          var price = parameter.allProducts[x].calcPrice(city.people, city.market[x] - 1, city.isProducedHere(x));
                          if (price <= this.loadMarketPrice[x]) {
                              city.world.game.changeMoney(-1 * price, "airplane buys from market", city);
                              city.market[x] -= 1;
                              this.airplane.products[x] += 1;
                              this.airplane.refreshLoadedCount();
                          } else {
                              break;
      
                          }
                      }
      
                  }
              }
          }*/
        load() {
            this.loadShop();
            // this.loadMarket();
        }
        unload() {
            //  this.unloadMarket();
            this.unloadShop();
        }
    }
    exports.Route = Route;
});
//# sourceMappingURL=route.js.map