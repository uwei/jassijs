var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ActionNode = void 0;
    let ActionNode = class ActionNode {
    };
    ActionNode = __decorate([
        Jassi_1.$Class("jassijs.base.ActionNode")
    ], ActionNode);
    exports.ActionNode = ActionNode;
    async function test() {
        var Actions = (await new Promise((resolve_1, reject_1) => { require(["jassijs/base/Actions"], resolve_1, reject_1); })).Actions;
        var actions = await Actions.getActionsFor([new ActionNode()]); //Class Actions
        console.log("found " + actions.length + " Actions");
    }
    exports.test = test;
});
//# sourceMappingURL=ActionNode.js.map