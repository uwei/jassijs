define("jassijs/ext/goldenlayout", ['goldenlayout', "jassijs/remote/Jassi"], function (GoldenLayout) {
    jassijs.includeCSSFile("goldenlayout-base.css");
    jassijs.includeCSSFile("goldenlayout-light-theme.css");
    return {
        default: GoldenLayout
    };
});
//# sourceMappingURL=goldenlayout.js.map