define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tableLayouts = void 0;
    var tableLayouts = {
        zebra: {
            isSystem: false,
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        },
        noBorders: {
            isSystem: true,
            layout: {
                hLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        headerLineOnly: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 1 ? 2 : 0); //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        lightHorizontalLines: {
            isSystem: true,
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 1)
                        return 2;
                    if (i === 0 || i === node.table.body.length)
                        return 0;
                    return 1; //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        frameWithLines: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                }
            }
        },
        frame: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 0;
                }
            }
        },
        custom: {
            isSystem: false,
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return null;
                },
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 4 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'red';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'blue' : 'green';
                },
                paddingLeft: function (i, node) { return 1; },
                paddingRight: function (i, node) { return 1; },
                paddingTop: function (i, node) { return 1; },
                paddingBottom: function (i, node) { return 1; }
            }
        }
    };
    exports.tableLayouts = tableLayouts;
});
//# sourceMappingURL=RTableLayouts.js.map