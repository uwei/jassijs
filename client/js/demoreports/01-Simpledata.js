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
//# sourceMappingURL=01-Simpledata.js.map