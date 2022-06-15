define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            "Hallo ${name}",
            "${address.street}",
            "${parameter.date}"
        ]
    };
    function test() {
        return {
            reportdesign,
            data: {
                name: "Klaus",
                address: {
                    street: "Mainstreet 8"
                }
            },
            parameter: { date: "2021-10-10" } //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDEtU2ltcGxlZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlbW9yZXBvcnRzLzAxLVNpbXBsZWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUFBLElBQUksWUFBWSxHQUFHO1FBQ2xCLE9BQU8sRUFBRTtZQUNGLGVBQWU7WUFDZixtQkFBbUI7WUFDbkIsbUJBQW1CO1NBQ3RCO0tBQ0osQ0FBQztJQUVGLFNBQWdCLElBQUk7UUFDaEIsT0FBTztZQUNILFlBQVk7WUFDWixJQUFJLEVBQUM7Z0JBQ0QsSUFBSSxFQUFDLE9BQU87Z0JBQ1osT0FBTyxFQUFDO29CQUNKLE1BQU0sRUFBQyxjQUFjO2lCQUN4QjthQUNKO1lBQ0QsU0FBUyxFQUFDLEVBQUMsSUFBSSxFQUFDLFlBQVksRUFBQyxDQUFNLFdBQVc7U0FDakQsQ0FBQztJQUNOLENBQUM7SUFYRCxvQkFXQyIsInNvdXJjZXNDb250ZW50IjpbInZhciByZXBvcnRkZXNpZ24gPSB7XHJcblx0Y29udGVudDogW1xyXG4gICAgICAgIFwiSGFsbG8gJHtuYW1lfVwiLFxyXG4gICAgICAgIFwiJHthZGRyZXNzLnN0cmVldH1cIixcclxuICAgICAgICBcIiR7cGFyYW1ldGVyLmRhdGV9XCJcclxuICAgIF1cclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgcmV0dXJuIHsgXHJcbiAgICAgICAgcmVwb3J0ZGVzaWduLFxyXG4gICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICBuYW1lOlwiS2xhdXNcIixcclxuICAgICAgICAgICAgYWRkcmVzczp7XHJcbiAgICAgICAgICAgICAgICBzdHJlZXQ6XCJNYWluc3RyZWV0IDhcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgICAgICAgIFxyXG4gICAgICAgIHBhcmFtZXRlcjp7ZGF0ZTpcIjIwMjEtMTAtMTBcIn0gICAgICAvL3BhcmFtZXRlclxyXG4gICAgfTtcclxufVxyXG4iXX0=