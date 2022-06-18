define(["require", "exports"], function (require, exports) {
    "use strict";
    reportdesign = {
        content: [
            "Hallo ${name}",
            "${address.street}",
            "${parameter.date}"
        ]
    };
    reportdesign.data = {
        name: "Klaus",
        address: {
            street: "Mainstreet 8"
        }
    };
    reportdesign.parameter = { date: "2021-10-10" }; //parameter
});
/*export function test() {
    return {
        reportdesign,
        data:{
            name:"Klaus",
            address:{
                street:"Mainstreet 8"
            }
        },
        parameter:{date:"2021-10-10"}      //parameter
    };
}*/
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDEtU2ltcGxlZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlbW9yZXBvcnRzLzAxLVNpbXBsZWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFBQSxZQUFZLEdBQUc7UUFDZCxPQUFPLEVBQUU7WUFDRixlQUFlO1lBQ2YsbUJBQW1CO1lBQ25CLG1CQUFtQjtTQUN0QjtLQUNKLENBQUM7SUFDRixZQUFZLENBQUMsSUFBSSxHQUFDO1FBQ04sSUFBSSxFQUFDLE9BQU87UUFDWixPQUFPLEVBQUM7WUFDSixNQUFNLEVBQUMsY0FBYztTQUN4QjtLQUNKLENBQUE7SUFDVCxZQUFZLENBQUMsU0FBUyxHQUFDLEVBQUMsSUFBSSxFQUFDLFlBQVksRUFBQyxDQUFDLENBQU0sV0FBVzs7QUFDNUQ7Ozs7Ozs7Ozs7O0dBV0ciLCJzb3VyY2VzQ29udGVudCI6WyJyZXBvcnRkZXNpZ24gPSB7XHJcblx0Y29udGVudDogW1xyXG4gICAgICAgIFwiSGFsbG8gJHtuYW1lfVwiLFxyXG4gICAgICAgIFwiJHthZGRyZXNzLnN0cmVldH1cIixcclxuICAgICAgICBcIiR7cGFyYW1ldGVyLmRhdGV9XCJcclxuICAgIF1cclxufTtcclxucmVwb3J0ZGVzaWduLmRhdGE9e1xyXG4gICAgICAgICAgICBuYW1lOlwiS2xhdXNcIixcclxuICAgICAgICAgICAgYWRkcmVzczp7XHJcbiAgICAgICAgICAgICAgICBzdHJlZXQ6XCJNYWluc3RyZWV0IDhcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5yZXBvcnRkZXNpZ24ucGFyYW1ldGVyPXtkYXRlOlwiMjAyMS0xMC0xMFwifTsgICAgICAvL3BhcmFtZXRlclxyXG4vKmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgcmV0dXJuIHsgXHJcbiAgICAgICAgcmVwb3J0ZGVzaWduLFxyXG4gICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICBuYW1lOlwiS2xhdXNcIixcclxuICAgICAgICAgICAgYWRkcmVzczp7XHJcbiAgICAgICAgICAgICAgICBzdHJlZXQ6XCJNYWluc3RyZWV0IDhcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgICAgICAgIFxyXG4gICAgICAgIHBhcmFtZXRlcjp7ZGF0ZTpcIjIwMjEtMTAtMTBcIn0gICAgICAvL3BhcmFtZXRlclxyXG4gICAgfTtcclxufSovXHJcbiJdfQ==