requirejs.config({

  baseUrl: '.',
});

requirejs(["game/game"], (game) => {
  $().ready(() => {
    var dom = document.getElementById("game");
    var g = new game.Game();
    g.create(dom);

  })
});