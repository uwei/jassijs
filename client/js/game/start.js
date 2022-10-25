requirejs.config({
    baseUrl: '.',
});
requirejs(["game/game"], (game) => {
    $().ready(() => {
        var dom = document.getElementById("game");
        var g = new game.Game();
        g.newGame();
        g.render(dom);
    });
});
//# sourceMappingURL=start.js.map