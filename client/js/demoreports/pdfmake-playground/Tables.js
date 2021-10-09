define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            { text: 'Tables', style: 'header' },
            'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
            { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
            'The following table has nothing more than a body array',
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        ['One value goes here', 'Another one here', 'OK?']
                    ]
                }
            },
            { text: 'A simple table with nested elements', style: 'subheader' },
            'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3'],
                        [
                            {
                                stack: [
                                    'Let\'s try an unordered list',
                                    {
                                        ul: [
                                            'item 1',
                                            'item 2'
                                        ]
                                    }
                                ]
                            },
                            [
                                'or a nested table',
                                {
                                    table: {
                                        body: [
                                            ['Col1', 'Col2', 'Col3'],
                                            ['1', '2', '3'],
                                            ['1', '2', '3']
                                        ]
                                    },
                                }
                            ],
                            { text: [
                                    'Inlines can be ',
                                    { text: 'styled\n', italics: true },
                                    { text: 'easily as everywhere else', fontSize: 10 }
                                ]
                            }
                        ]
                    ]
                }
            },
            { text: 'Defining column widths', style: 'subheader' },
            'Tables support the same width definitions as standard columns:',
            {
                bold: true,
                ul: [
                    'auto',
                    'star',
                    'fixed value'
                ]
            },
            {
                style: 'tableExample',
                table: {
                    widths: [100, '*', 200, '*'],
                    body: [
                        ['width=100', 'star-sized', 'width=200', 'star-sized'],
                        ['fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        ['This is a star-sized column. The next column over, an auto-sized column, will wrap to accomodate all the text in this cell.', 'I am auto sized.'],
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    widths: ['*', 'auto'],
                    body: [
                        ['This is a star-sized column. The next column over, an auto-sized column, will not wrap to accomodate all the text in this cell, because it has been given the noWrap style.', { text: 'I am auto sized.', noWrap: true }],
                    ]
                }
            },
            { text: 'Defining row heights', style: 'subheader' },
            {
                style: 'tableExample',
                table: {
                    heights: [20, 50, 70],
                    body: [
                        ['row 1 with height 20', 'column B'],
                        ['row 2 with height 50', 'column B'],
                        ['row 3 with height 70', 'column B']
                    ]
                }
            },
            'With same height:',
            {
                style: 'tableExample',
                table: {
                    heights: 40,
                    body: [
                        ['row 1', 'column B'],
                        ['row 2', 'column B'],
                        ['row 3', 'column B']
                    ]
                }
            },
            'With height from function:',
            {
                style: 'tableExample',
                table: {
                    heights: function (row) {
                        return (row + 1) * 25;
                    },
                    body: [
                        ['row 1', 'column B'],
                        ['row 2', 'column B'],
                        ['row 3', 'column B']
                    ]
                }
            },
            { text: 'Column/row spans', pageBreak: 'before', style: 'subheader' },
            'Each cell-element can set a rowSpan or colSpan',
            {
                style: 'tableExample',
                color: '#444',
                table: {
                    widths: [200, 'auto', 'auto'],
                    headerRows: 2,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                        [{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        [{ rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3'],
                        ['', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, ''],
                        ['Sample value 1', '', ''],
                    ]
                }
            },
            { text: 'Headers', pageBreak: 'before', style: 'subheader' },
            'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
            { text: ['It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here'], color: 'gray', italics: true },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    // dontBreakRows: true,
                    // keepWithHeaderRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        [
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                        ]
                    ]
                }
            },
            { text: 'Styling tables', style: 'subheader' },
            'You can provide a custom styler for the table. Currently it supports:',
            {
                ul: [
                    'line widths',
                    'line colors',
                    'cell paddings',
                ]
            },
            'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
            { text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: 'noBorders'
            },
            { text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: 'headerLineOnly'
            },
            { text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: 'lightHorizontalLines'
            },
            { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
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
                    },
                    // hLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; },
                    // fillColor: function (rowIndex, node, columnIndex) { return null; }
                }
            },
            { text: 'zebra style', margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                    }
                }
            },
            { text: 'and can be used dash border', margin: [0, 20, 0, 8] },
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                        ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'black';
                    },
                    hLineStyle: function (i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return null;
                        }
                        return { dash: { length: 10, space: 4 } };
                    },
                    vLineStyle: function (i, node) {
                        if (i === 0 || i === node.table.widths.length) {
                            return null;
                        }
                        return { dash: { length: 4 } };
                    },
                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; },
                    // fillColor: function (i, node) { return null; }
                }
            },
            { text: 'Optional border', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
            'Each cell contains an optional border property: an array of 4 booleans for left border, top border, right border, bottom border.',
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            {
                                border: [false, true, false, false],
                                fillColor: '#eeeeee',
                                text: 'border:\n[false, true, false, false]'
                            },
                            {
                                border: [false, false, false, false],
                                fillColor: '#dddddd',
                                text: 'border:\n[false, false, false, false]'
                            },
                            {
                                border: [true, true, true, true],
                                fillColor: '#eeeeee',
                                text: 'border:\n[true, true, true, true]'
                            }
                        ],
                        [
                            {
                                rowSpan: 3,
                                border: [true, true, true, true],
                                fillColor: '#eeeeff',
                                text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
                            },
                            {
                                border: undefined,
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                            {
                                border: [true, false, false, false],
                                fillColor: '#dddddd',
                                text: 'border:\n[true, false, false, false]'
                            }
                        ],
                        [
                            '',
                            {
                                colSpan: 2,
                                border: [true, true, true, true],
                                fillColor: '#eeffee',
                                text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
                            },
                            ''
                        ],
                        [
                            '',
                            {
                                border: undefined,
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                            {
                                border: [false, false, true, true],
                                fillColor: '#dddddd',
                                text: 'border:\n[false, false, true, true]'
                            }
                        ]
                    ]
                },
                layout: {
                    defaultBorder: false,
                }
            },
            'For every cell without a border property, whether it has all borders or not is determined by layout.defaultBorder, which is false in the table above and true (by default) in the table below.',
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            {
                                border: [false, false, false, false],
                                fillColor: '#eeeeee',
                                text: 'border:\n[false, false, false, false]'
                            },
                            {
                                fillColor: '#dddddd',
                                text: 'border:\nundefined'
                            },
                            {
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                        ],
                        [
                            {
                                fillColor: '#dddddd',
                                text: 'border:\nundefined'
                            },
                            {
                                fillColor: '#eeeeee',
                                text: 'border:\nundefined'
                            },
                            {
                                border: [true, true, false, false],
                                fillColor: '#dddddd',
                                text: 'border:\n[true, true, false, false]'
                            },
                        ]
                    ]
                }
            },
            'And some other examples with rowSpan/colSpan...',
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            '',
                            'column 1',
                            'column 2',
                            'column 3'
                        ],
                        [
                            'row 1',
                            {
                                rowSpan: 3,
                                colSpan: 3,
                                border: [true, true, true, true],
                                fillColor: '#cccccc',
                                text: 'rowSpan: 3\ncolSpan: 3\n\nborder:\n[true, true, true, true]'
                            },
                            '',
                            ''
                        ],
                        [
                            'row 2',
                            '',
                            '',
                            ''
                        ],
                        [
                            'row 3',
                            '',
                            '',
                            ''
                        ]
                    ]
                },
                layout: {
                    defaultBorder: false,
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            {
                                colSpan: 3,
                                text: 'colSpan: 3\n\nborder:\n[false, false, false, false]',
                                fillColor: '#eeeeee',
                                border: [false, false, false, false]
                            },
                            '',
                            ''
                        ],
                        [
                            'border:\nundefined',
                            'border:\nundefined',
                            'border:\nundefined'
                        ]
                    ]
                }
            },
            {
                style: 'tableExample',
                table: {
                    body: [
                        [
                            { rowSpan: 3, text: 'rowSpan: 3\n\nborder:\n[false, false, false, false]', fillColor: '#eeeeee', border: [false, false, false, false] },
                            'border:\nundefined',
                            'border:\nundefined'
                        ],
                        [
                            '',
                            'border:\nundefined',
                            'border:\nundefined'
                        ],
                        [
                            '',
                            'border:\nundefined',
                            'border:\nundefined'
                        ]
                    ]
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
        // alignment: 'justify'
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vZGVtb3JlcG9ydHMvcGRmbWFrZS1wbGF5Z3JvdW5kL1RhYmxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBQUEsSUFBSSxZQUFZLEdBQUU7UUFDakIsT0FBTyxFQUFFO1lBQ1IsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7WUFDakMsZ0lBQWdJO1lBQ2hJLEVBQUMsSUFBSSxFQUFFLHVFQUF1RSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUM7WUFDbkcsd0RBQXdEO1lBQ3hEO2dCQUNDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ04sSUFBSSxFQUFFO3dCQUNMLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUM7d0JBQ3BDLENBQUMscUJBQXFCLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxDQUFDO3FCQUNsRDtpQkFDRDthQUNEO1lBQ0QsRUFBQyxJQUFJLEVBQUUscUNBQXFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQztZQUNqRSxrR0FBa0c7WUFDbEc7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQzt3QkFDcEM7NEJBQ0M7Z0NBQ0MsS0FBSyxFQUFFO29DQUNOLDhCQUE4QjtvQ0FDOUI7d0NBQ0MsRUFBRSxFQUFFOzRDQUNILFFBQVE7NENBQ1IsUUFBUTt5Q0FDUjtxQ0FDRDtpQ0FDRDs2QkFDRDs0QkFDRDtnQ0FDQyxtQkFBbUI7Z0NBQ25CO29DQUNDLEtBQUssRUFBRTt3Q0FDTixJQUFJLEVBQUU7NENBQ0wsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQzs0Q0FDeEIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQzs0Q0FDZixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO3lDQUNmO3FDQUNEO2lDQUNEOzZCQUNEOzRCQUNELEVBQUMsSUFBSSxFQUFFO29DQUNMLGlCQUFpQjtvQ0FDakIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUM7b0NBQ2pDLEVBQUMsSUFBSSxFQUFFLDJCQUEyQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7aUNBQUM7NkJBQ25EO3lCQUNEO3FCQUNEO2lCQUNEO2FBQ0Q7WUFDRCxFQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDO1lBQ3BELGdFQUFnRTtZQUNoRTtnQkFDQyxJQUFJLEVBQUUsSUFBSTtnQkFDVixFQUFFLEVBQUU7b0JBQ0gsTUFBTTtvQkFDTixNQUFNO29CQUNOLGFBQWE7aUJBQ2I7YUFDRDtZQUNEO2dCQUNDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ04sTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO29CQUM1QixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUM7d0JBQ3RELENBQUMsb0RBQW9ELEVBQUUsRUFBQyxJQUFJLEVBQUUsMEJBQTBCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsMEJBQTBCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsMEJBQTBCLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUM7cUJBQzVQO2lCQUNEO2FBQ0Q7WUFDRDtnQkFDQyxLQUFLLEVBQUUsY0FBYztnQkFDckIsS0FBSyxFQUFFO29CQUNOLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUM7b0JBQ3JCLElBQUksRUFBRTt3QkFDTCxDQUFDLDZIQUE2SCxFQUFFLGtCQUFrQixDQUFDO3FCQUNuSjtpQkFDRDthQUNEO1lBQ0Q7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO29CQUNyQixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyw2S0FBNkssRUFBRSxFQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLENBQUM7cUJBQ3pOO2lCQUNEO2FBQ0Q7WUFDRCxFQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDO1lBQ2xEO2dCQUNDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ04sT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7b0JBQ3JCLElBQUksRUFBRTt3QkFDTCxDQUFDLHNCQUFzQixFQUFFLFVBQVUsQ0FBQzt3QkFDcEMsQ0FBQyxzQkFBc0IsRUFBRSxVQUFVLENBQUM7d0JBQ3BDLENBQUMsc0JBQXNCLEVBQUUsVUFBVSxDQUFDO3FCQUNwQztpQkFDRDthQUNEO1lBQ0QsbUJBQW1CO1lBQ25CO2dCQUNDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ04sT0FBTyxFQUFFLEVBQUU7b0JBQ1gsSUFBSSxFQUFFO3dCQUNMLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQzt3QkFDckIsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO3dCQUNyQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7cUJBQ3JCO2lCQUNEO2FBQ0Q7WUFDRCw0QkFBNEI7WUFDNUI7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixPQUFPLEVBQUUsVUFBVSxHQUFHO3dCQUNyQixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDdkIsQ0FBQztvQkFDRCxJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO3dCQUNyQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7d0JBQ3JCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztxQkFDckI7aUJBQ0Q7YUFDRDtZQUNELEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQztZQUNuRSxnREFBZ0Q7WUFDaEQ7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRTtvQkFDTixNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztvQkFDN0IsVUFBVSxFQUFFLENBQUM7b0JBQ2IseUJBQXlCO29CQUN6QixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxFQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUM7d0JBQzdKLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUM7d0JBQzdMLENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7d0JBQ3RELENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxtR0FBbUcsRUFBQyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUM3SixDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDeEMsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsNkRBQTZELEVBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ3JILENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztxQkFDMUI7aUJBQ0Q7YUFDRDtZQUNELEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUM7WUFDMUQsd0hBQXdIO1lBQ3hILEVBQUMsSUFBSSxFQUFFLENBQUMsK1VBQStVLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUM7WUFDdlg7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsQ0FBQztvQkFDYix1QkFBdUI7b0JBQ3ZCLHlCQUF5QjtvQkFDekIsSUFBSSxFQUFFO3dCQUNMLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLENBQUM7d0JBQzlIOzRCQUNDLDJ6Q0FBMnpDOzRCQUMzekMsMnpDQUEyekM7NEJBQzN6QywyekNBQTJ6Qzt5QkFDM3pDO3FCQUNEO2lCQUNEO2FBQ0Q7WUFDRCxFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDO1lBQzVDLHVFQUF1RTtZQUN2RTtnQkFDQyxFQUFFLEVBQUU7b0JBQ0gsYUFBYTtvQkFDYixhQUFhO29CQUNiLGVBQWU7aUJBQ2Y7YUFDRDtZQUNELCtHQUErRztZQUMvRyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUM7WUFDekY7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsQ0FBQztvQkFDYixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQzt3QkFDOUgsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztxQkFDdEQ7aUJBQ0Q7Z0JBQ0QsTUFBTSxFQUFFLFdBQVc7YUFDbkI7WUFDRCxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUM7WUFDMUU7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsQ0FBQztvQkFDYixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQzt3QkFDOUgsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztxQkFDdEQ7aUJBQ0Q7Z0JBQ0QsTUFBTSxFQUFFLGdCQUFnQjthQUN4QjtZQUNELEVBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztZQUNoRjtnQkFDQyxLQUFLLEVBQUUsY0FBYztnQkFDckIsS0FBSyxFQUFFO29CQUNOLFVBQVUsRUFBRSxDQUFDO29CQUNiLElBQUksRUFBRTt3QkFDTCxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxDQUFDO3dCQUM5SCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3FCQUN0RDtpQkFDRDtnQkFDRCxNQUFNLEVBQUUsc0JBQXNCO2FBQzlCO1lBQ0QsRUFBQyxJQUFJLEVBQUUsNkNBQTZDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUM7WUFDNUU7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixVQUFVLEVBQUUsQ0FBQztvQkFDYixJQUFJLEVBQUU7d0JBQ0wsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsQ0FBQzt3QkFDOUgsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDdEQsQ0FBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxnQkFBZ0IsQ0FBQztxQkFDdEQ7aUJBQ0Q7Z0JBQ0QsTUFBTSxFQUFFO29CQUNQLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJO3dCQUM1QixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxDQUFDO29CQUNELFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJO3dCQUM1QixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxDQUFDO29CQUNELFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJO3dCQUM1QixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUNyRSxDQUFDO29CQUNELFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJO3dCQUM1QixPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUN2RSxDQUFDO29CQUNELCtFQUErRTtvQkFDL0UsK0VBQStFO29CQUMvRSxnREFBZ0Q7b0JBQ2hELGlEQUFpRDtvQkFDakQsK0NBQStDO29CQUMvQyxrREFBa0Q7b0JBQ2xELHFFQUFxRTtpQkFDckU7YUFDRDtZQUNELEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztZQUM1QztnQkFDQyxLQUFLLEVBQUUsY0FBYztnQkFDckIsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRTt3QkFDTCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3dCQUN0RCxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDO3FCQUN0RDtpQkFDRDtnQkFDRCxNQUFNLEVBQUU7b0JBQ1AsU0FBUyxFQUFFLFVBQVUsUUFBUSxFQUFFLElBQUksRUFBRSxXQUFXO3dCQUMvQyxPQUFPLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ2hELENBQUM7aUJBQ0Q7YUFDRDtZQUNELEVBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDO1lBQzVEO2dCQUNDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ04sVUFBVSxFQUFFLENBQUM7b0JBQ2IsSUFBSSxFQUFFO3dCQUNMLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFDLENBQUM7d0JBQzlILENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7d0JBQ3RELENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7d0JBQ3RELENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7d0JBQ3RELENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7d0JBQ3RELENBQUMsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUM7cUJBQ3REO2lCQUNEO2dCQUNELE1BQU0sRUFBRTtvQkFDUCxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsSUFBSTt3QkFDNUIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsQ0FBQztvQkFDRCxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsSUFBSTt3QkFDNUIsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUQsQ0FBQztvQkFDRCxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsSUFBSTt3QkFDNUIsT0FBTyxPQUFPLENBQUM7b0JBQ2hCLENBQUM7b0JBQ0QsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUk7d0JBQzVCLE9BQU8sT0FBTyxDQUFDO29CQUNoQixDQUFDO29CQUNELFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJO3dCQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTs0QkFDNUMsT0FBTyxJQUFJLENBQUM7eUJBQ1o7d0JBQ0QsT0FBTyxFQUFDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxFQUFDLENBQUM7b0JBQ3ZDLENBQUM7b0JBQ0QsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLElBQUk7d0JBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFOzRCQUM5QyxPQUFPLElBQUksQ0FBQzt5QkFDWjt3QkFDRCxPQUFPLEVBQUMsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxFQUFDLENBQUM7b0JBQzVCLENBQUM7b0JBQ0QsZ0RBQWdEO29CQUNoRCxpREFBaUQ7b0JBQ2pELCtDQUErQztvQkFDL0Msa0RBQWtEO29CQUNsRCxpREFBaUQ7aUJBQ2pEO2FBQ0Q7WUFDRCxFQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztZQUM5RixrSUFBa0k7WUFDbEk7Z0JBQ0MsS0FBSyxFQUFFLGNBQWM7Z0JBQ3JCLEtBQUssRUFBRTtvQkFDTixJQUFJLEVBQUU7d0JBQ0w7NEJBQ0M7Z0NBQ0MsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO2dDQUNuQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLHNDQUFzQzs2QkFDNUM7NEJBQ0Q7Z0NBQ0MsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO2dDQUNwQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLHVDQUF1Qzs2QkFDN0M7NEJBQ0Q7Z0NBQ0MsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO2dDQUNoQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLG1DQUFtQzs2QkFDekM7eUJBQ0Q7d0JBQ0Q7NEJBQ0M7Z0NBQ0MsT0FBTyxFQUFFLENBQUM7Z0NBQ1YsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO2dDQUNoQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLGlEQUFpRDs2QkFDdkQ7NEJBQ0Q7Z0NBQ0MsTUFBTSxFQUFFLFNBQVM7Z0NBQ2pCLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixJQUFJLEVBQUUsb0JBQW9COzZCQUMxQjs0QkFDRDtnQ0FDQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7Z0NBQ25DLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixJQUFJLEVBQUUsc0NBQXNDOzZCQUM1Qzt5QkFDRDt3QkFDRDs0QkFDQyxFQUFFOzRCQUNGO2dDQUNDLE9BQU8sRUFBRSxDQUFDO2dDQUNWLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztnQ0FDaEMsU0FBUyxFQUFFLFNBQVM7Z0NBQ3BCLElBQUksRUFBRSxpREFBaUQ7NkJBQ3ZEOzRCQUNELEVBQUU7eUJBQ0Y7d0JBQ0Q7NEJBQ0MsRUFBRTs0QkFDRjtnQ0FDQyxNQUFNLEVBQUUsU0FBUztnQ0FDakIsU0FBUyxFQUFFLFNBQVM7Z0NBQ3BCLElBQUksRUFBRSxvQkFBb0I7NkJBQzFCOzRCQUNEO2dDQUNDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztnQ0FDbEMsU0FBUyxFQUFFLFNBQVM7Z0NBQ3BCLElBQUksRUFBRSxxQ0FBcUM7NkJBQzNDO3lCQUNEO3FCQUNEO2lCQUNEO2dCQUNELE1BQU0sRUFBRTtvQkFDUCxhQUFhLEVBQUUsS0FBSztpQkFDcEI7YUFDRDtZQUNELGdNQUFnTTtZQUNoTTtnQkFDQyxLQUFLLEVBQUUsY0FBYztnQkFDckIsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRTt3QkFDTDs0QkFDQztnQ0FDQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7Z0NBQ3BDLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixJQUFJLEVBQUUsdUNBQXVDOzZCQUM3Qzs0QkFDRDtnQ0FDQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLG9CQUFvQjs2QkFDMUI7NEJBQ0Q7Z0NBQ0MsU0FBUyxFQUFFLFNBQVM7Z0NBQ3BCLElBQUksRUFBRSxvQkFBb0I7NkJBQzFCO3lCQUNEO3dCQUNEOzRCQUNDO2dDQUNDLFNBQVMsRUFBRSxTQUFTO2dDQUNwQixJQUFJLEVBQUUsb0JBQW9COzZCQUMxQjs0QkFDRDtnQ0FDQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLG9CQUFvQjs2QkFDMUI7NEJBQ0Q7Z0NBQ0MsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDO2dDQUNsQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLHFDQUFxQzs2QkFDM0M7eUJBQ0Q7cUJBQ0Q7aUJBQ0Q7YUFDRDtZQUNELGlEQUFpRDtZQUNqRDtnQkFDQyxLQUFLLEVBQUUsY0FBYztnQkFDckIsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRTt3QkFDTDs0QkFDQyxFQUFFOzRCQUNGLFVBQVU7NEJBQ1YsVUFBVTs0QkFDVixVQUFVO3lCQUNWO3dCQUNEOzRCQUNDLE9BQU87NEJBQ1A7Z0NBQ0MsT0FBTyxFQUFFLENBQUM7Z0NBQ1YsT0FBTyxFQUFFLENBQUM7Z0NBQ1YsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO2dDQUNoQyxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsSUFBSSxFQUFFLDZEQUE2RDs2QkFDbkU7NEJBQ0QsRUFBRTs0QkFDRixFQUFFO3lCQUNGO3dCQUNEOzRCQUNDLE9BQU87NEJBQ1AsRUFBRTs0QkFDRixFQUFFOzRCQUNGLEVBQUU7eUJBQ0Y7d0JBQ0Q7NEJBQ0MsT0FBTzs0QkFDUCxFQUFFOzRCQUNGLEVBQUU7NEJBQ0YsRUFBRTt5QkFDRjtxQkFDRDtpQkFDRDtnQkFDRCxNQUFNLEVBQUU7b0JBQ1AsYUFBYSxFQUFFLEtBQUs7aUJBQ3BCO2FBQ0Q7WUFDRDtnQkFDQyxLQUFLLEVBQUUsY0FBYztnQkFDckIsS0FBSyxFQUFFO29CQUNOLElBQUksRUFBRTt3QkFDTDs0QkFDQztnQ0FDQyxPQUFPLEVBQUUsQ0FBQztnQ0FDVixJQUFJLEVBQUUscURBQXFEO2dDQUMzRCxTQUFTLEVBQUUsU0FBUztnQ0FDcEIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDOzZCQUNwQzs0QkFDRCxFQUFFOzRCQUNGLEVBQUU7eUJBQ0Y7d0JBQ0Q7NEJBQ0Msb0JBQW9COzRCQUNwQixvQkFBb0I7NEJBQ3BCLG9CQUFvQjt5QkFDcEI7cUJBQ0Q7aUJBQ0Q7YUFDRDtZQUNEO2dCQUNDLEtBQUssRUFBRSxjQUFjO2dCQUNyQixLQUFLLEVBQUU7b0JBQ04sSUFBSSxFQUFFO3dCQUNMOzRCQUNDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUscURBQXFELEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBQzs0QkFDckksb0JBQW9COzRCQUNwQixvQkFBb0I7eUJBQ3BCO3dCQUNEOzRCQUNDLEVBQUU7NEJBQ0Ysb0JBQW9COzRCQUNwQixvQkFBb0I7eUJBQ3BCO3dCQUNEOzRCQUNDLEVBQUU7NEJBQ0Ysb0JBQW9COzRCQUNwQixvQkFBb0I7eUJBQ3BCO3FCQUNEO2lCQUNEO2FBQ0Q7U0FDRDtRQUNELE1BQU0sRUFBRTtZQUNQLE1BQU0sRUFBRTtnQkFDUCxRQUFRLEVBQUUsRUFBRTtnQkFDWixJQUFJLEVBQUUsSUFBSTtnQkFDVixNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7YUFDckI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3JCO1lBQ0QsWUFBWSxFQUFFO2dCQUNiLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzthQUNyQjtZQUNELFdBQVcsRUFBRTtnQkFDWixJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUUsRUFBRTtnQkFDWixLQUFLLEVBQUUsT0FBTzthQUNkO1NBQ0Q7UUFDRCxZQUFZLEVBQUU7UUFDYix1QkFBdUI7U0FDdkI7S0FFRCxDQUFBO0lBRUQsU0FBZ0IsSUFBSTtRQUNoQixPQUFPO1lBQ0gsWUFBWTtZQUNaLHlCQUF5QjtZQUMxQixnQ0FBZ0M7U0FDbEMsQ0FBQztJQUNOLENBQUM7SUFORCxvQkFNQyIsInNvdXJjZXNDb250ZW50IjpbInZhciByZXBvcnRkZXNpZ24gPXtcblx0Y29udGVudDogW1xuXHRcdHt0ZXh0OiAnVGFibGVzJywgc3R5bGU6ICdoZWFkZXInfSxcblx0XHQnT2ZmaWNpYWwgZG9jdW1lbnRhdGlvbiBpcyBpbiBwcm9ncmVzcywgdGhpcyBkb2N1bWVudCBpcyBqdXN0IGEgZ2xpbXBzZSBvZiB3aGF0IGlzIHBvc3NpYmxlIHdpdGggcGRmbWFrZSBhbmQgaXRzIGxheW91dCBlbmdpbmUuJyxcblx0XHR7dGV4dDogJ0Egc2ltcGxlIHRhYmxlIChubyBoZWFkZXJzLCBubyB3aWR0aCBzcGVjaWZpZWQsIG5vIHNwYW5zLCBubyBzdHlsaW5nKScsIHN0eWxlOiAnc3ViaGVhZGVyJ30sXG5cdFx0J1RoZSBmb2xsb3dpbmcgdGFibGUgaGFzIG5vdGhpbmcgbW9yZSB0aGFuIGEgYm9keSBhcnJheScsXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFsnQ29sdW1uIDEnLCAnQ29sdW1uIDInLCAnQ29sdW1uIDMnXSxcblx0XHRcdFx0XHRbJ09uZSB2YWx1ZSBnb2VzIGhlcmUnLCAnQW5vdGhlciBvbmUgaGVyZScsICdPSz8nXVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7dGV4dDogJ0Egc2ltcGxlIHRhYmxlIHdpdGggbmVzdGVkIGVsZW1lbnRzJywgc3R5bGU6ICdzdWJoZWFkZXInfSxcblx0XHQnSXQgaXMgb2YgY291cnNlIHBvc3NpYmxlIHRvIG5lc3QgYW55IG90aGVyIHR5cGUgb2Ygbm9kZXMgYXZhaWxhYmxlIGluIHBkZm1ha2UgaW5zaWRlIHRhYmxlIGNlbGxzJyxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0WydDb2x1bW4gMScsICdDb2x1bW4gMicsICdDb2x1bW4gMyddLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0c3RhY2s6IFtcblx0XHRcdFx0XHRcdFx0XHQnTGV0XFwncyB0cnkgYW4gdW5vcmRlcmVkIGxpc3QnLFxuXHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdHVsOiBbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCdpdGVtIDEnLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQnaXRlbSAyJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0J29yIGEgbmVzdGVkIHRhYmxlJyxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFsnQ29sMScsICdDb2wyJywgJ0NvbDMnXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0WycxJywgJzInLCAnMyddLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRbJzEnLCAnMicsICczJ11cblx0XHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFx0e3RleHQ6IFtcblx0XHRcdFx0XHRcdFx0XHQnSW5saW5lcyBjYW4gYmUgJyxcblx0XHRcdFx0XHRcdFx0XHR7dGV4dDogJ3N0eWxlZFxcbicsIGl0YWxpY3M6IHRydWV9LFxuXHRcdFx0XHRcdFx0XHRcdHt0ZXh0OiAnZWFzaWx5IGFzIGV2ZXJ5d2hlcmUgZWxzZScsIGZvbnRTaXplOiAxMH1dXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7dGV4dDogJ0RlZmluaW5nIGNvbHVtbiB3aWR0aHMnLCBzdHlsZTogJ3N1YmhlYWRlcid9LFxuXHRcdCdUYWJsZXMgc3VwcG9ydCB0aGUgc2FtZSB3aWR0aCBkZWZpbml0aW9ucyBhcyBzdGFuZGFyZCBjb2x1bW5zOicsXG5cdFx0e1xuXHRcdFx0Ym9sZDogdHJ1ZSxcblx0XHRcdHVsOiBbXG5cdFx0XHRcdCdhdXRvJyxcblx0XHRcdFx0J3N0YXInLFxuXHRcdFx0XHQnZml4ZWQgdmFsdWUnXG5cdFx0XHRdXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHR3aWR0aHM6IFsxMDAsICcqJywgMjAwLCAnKiddLFxuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0Wyd3aWR0aD0xMDAnLCAnc3Rhci1zaXplZCcsICd3aWR0aD0yMDAnLCAnc3Rhci1zaXplZCddLFxuXHRcdFx0XHRcdFsnZml4ZWQtd2lkdGggY2VsbHMgaGF2ZSBleGFjdGx5IHRoZSBzcGVjaWZpZWQgd2lkdGgnLCB7dGV4dDogJ25vdGhpbmcgaW50ZXJlc3RpbmcgaGVyZScsIGl0YWxpY3M6IHRydWUsIGNvbG9yOiAnZ3JheSd9LCB7dGV4dDogJ25vdGhpbmcgaW50ZXJlc3RpbmcgaGVyZScsIGl0YWxpY3M6IHRydWUsIGNvbG9yOiAnZ3JheSd9LCB7dGV4dDogJ25vdGhpbmcgaW50ZXJlc3RpbmcgaGVyZScsIGl0YWxpY3M6IHRydWUsIGNvbG9yOiAnZ3JheSd9XVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHR3aWR0aHM6IFsnKicsICdhdXRvJ10sXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRbJ1RoaXMgaXMgYSBzdGFyLXNpemVkIGNvbHVtbi4gVGhlIG5leHQgY29sdW1uIG92ZXIsIGFuIGF1dG8tc2l6ZWQgY29sdW1uLCB3aWxsIHdyYXAgdG8gYWNjb21vZGF0ZSBhbGwgdGhlIHRleHQgaW4gdGhpcyBjZWxsLicsICdJIGFtIGF1dG8gc2l6ZWQuJ10sXG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHN0eWxlOiAndGFibGVFeGFtcGxlJyxcblx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdHdpZHRoczogWycqJywgJ2F1dG8nXSxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFsnVGhpcyBpcyBhIHN0YXItc2l6ZWQgY29sdW1uLiBUaGUgbmV4dCBjb2x1bW4gb3ZlciwgYW4gYXV0by1zaXplZCBjb2x1bW4sIHdpbGwgbm90IHdyYXAgdG8gYWNjb21vZGF0ZSBhbGwgdGhlIHRleHQgaW4gdGhpcyBjZWxsLCBiZWNhdXNlIGl0IGhhcyBiZWVuIGdpdmVuIHRoZSBub1dyYXAgc3R5bGUuJywge3RleHQ6ICdJIGFtIGF1dG8gc2l6ZWQuJywgbm9XcmFwOiB0cnVlfV0sXG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHt0ZXh0OiAnRGVmaW5pbmcgcm93IGhlaWdodHMnLCBzdHlsZTogJ3N1YmhlYWRlcid9LFxuXHRcdHtcblx0XHRcdHN0eWxlOiAndGFibGVFeGFtcGxlJyxcblx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdGhlaWdodHM6IFsyMCwgNTAsIDcwXSxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFsncm93IDEgd2l0aCBoZWlnaHQgMjAnLCAnY29sdW1uIEInXSxcblx0XHRcdFx0XHRbJ3JvdyAyIHdpdGggaGVpZ2h0IDUwJywgJ2NvbHVtbiBCJ10sXG5cdFx0XHRcdFx0Wydyb3cgMyB3aXRoIGhlaWdodCA3MCcsICdjb2x1bW4gQiddXG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9LFxuXHRcdCdXaXRoIHNhbWUgaGVpZ2h0OicsXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0aGVpZ2h0czogNDAsXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRbJ3JvdyAxJywgJ2NvbHVtbiBCJ10sXG5cdFx0XHRcdFx0Wydyb3cgMicsICdjb2x1bW4gQiddLFxuXHRcdFx0XHRcdFsncm93IDMnLCAnY29sdW1uIEInXVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnV2l0aCBoZWlnaHQgZnJvbSBmdW5jdGlvbjonLFxuXHRcdHtcblx0XHRcdHN0eWxlOiAndGFibGVFeGFtcGxlJyxcblx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdGhlaWdodHM6IGZ1bmN0aW9uIChyb3cpIHtcblx0XHRcdFx0XHRyZXR1cm4gKHJvdyArIDEpICogMjU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRbJ3JvdyAxJywgJ2NvbHVtbiBCJ10sXG5cdFx0XHRcdFx0Wydyb3cgMicsICdjb2x1bW4gQiddLFxuXHRcdFx0XHRcdFsncm93IDMnLCAnY29sdW1uIEInXVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7dGV4dDogJ0NvbHVtbi9yb3cgc3BhbnMnLCBwYWdlQnJlYWs6ICdiZWZvcmUnLCBzdHlsZTogJ3N1YmhlYWRlcid9LFxuXHRcdCdFYWNoIGNlbGwtZWxlbWVudCBjYW4gc2V0IGEgcm93U3BhbiBvciBjb2xTcGFuJyxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHRjb2xvcjogJyM0NDQnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0d2lkdGhzOiBbMjAwLCAnYXV0bycsICdhdXRvJ10sXG5cdFx0XHRcdGhlYWRlclJvd3M6IDIsXG5cdFx0XHRcdC8vIGtlZXBXaXRoSGVhZGVyUm93czogMSxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFt7dGV4dDogJ0hlYWRlciB3aXRoIENvbHNwYW4gPSAyJywgc3R5bGU6ICd0YWJsZUhlYWRlcicsIGNvbFNwYW46IDIsIGFsaWdubWVudDogJ2NlbnRlcid9LCB7fSwge3RleHQ6ICdIZWFkZXIgMycsIHN0eWxlOiAndGFibGVIZWFkZXInLCBhbGlnbm1lbnQ6ICdjZW50ZXInfV0sXG5cdFx0XHRcdFx0W3t0ZXh0OiAnSGVhZGVyIDEnLCBzdHlsZTogJ3RhYmxlSGVhZGVyJywgYWxpZ25tZW50OiAnY2VudGVyJ30sIHt0ZXh0OiAnSGVhZGVyIDInLCBzdHlsZTogJ3RhYmxlSGVhZGVyJywgYWxpZ25tZW50OiAnY2VudGVyJ30sIHt0ZXh0OiAnSGVhZGVyIDMnLCBzdHlsZTogJ3RhYmxlSGVhZGVyJywgYWxpZ25tZW50OiAnY2VudGVyJ31dLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbe3Jvd1NwYW46IDMsIHRleHQ6ICdyb3dTcGFuIHNldCB0byAzXFxuTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2ljaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvcid9LCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJycsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywge2NvbFNwYW46IDIsIHJvd1NwYW46IDIsIHRleHQ6ICdCb3RoOlxcbnJvd1NwYW4gYW5kIGNvbFNwYW5cXG5jYW4gYmUgZGVmaW5lZCBhdCB0aGUgc2FtZSB0aW1lJ30sICcnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJycsICcnXSxcblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e3RleHQ6ICdIZWFkZXJzJywgcGFnZUJyZWFrOiAnYmVmb3JlJywgc3R5bGU6ICdzdWJoZWFkZXInfSxcblx0XHQnWW91IGNhbiBkZWNsYXJlIGhvdyBtYW55IHJvd3Mgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgYSBoZWFkZXIuIEhlYWRlcnMgYXJlIGF1dG9tYXRpY2FsbHkgcmVwZWF0ZWQgb24gdGhlIGZvbGxvd2luZyBwYWdlcycsXG5cdFx0e3RleHQ6IFsnSXQgaXMgYWxzbyBwb3NzaWJsZSB0byBzZXQga2VlcFdpdGhIZWFkZXJSb3dzIHRvIG1ha2Ugc3VyZSB0aGVyZSB3aWxsIGJlIG5vIHBhZ2UtYnJlYWsgYmV0d2VlbiB0aGUgaGVhZGVyIGFuZCB0aGVzZSByb3dzLiBUYWtlIGEgbG9vayBhdCB0aGUgZG9jdW1lbnQtZGVmaW5pdGlvbiBhbmQgcGxheSB3aXRoIGl0LiBJZiB5b3Ugc2V0IGl0IHRvIG9uZSwgdGhlIGZvbGxvd2luZyB0YWJsZSB3aWxsIGF1dG9tYXRpY2FsbHkgc3RhcnQgb24gdGhlIG5leHQgcGFnZSwgc2luY2UgdGhlcmVcXCdzIG5vdCBlbm91Z2ggc3BhY2UgZm9yIHRoZSBmaXJzdCByb3cgdG8gYmUgcmVuZGVyZWQgaGVyZSddLCBjb2xvcjogJ2dyYXknLCBpdGFsaWNzOiB0cnVlfSxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHRoZWFkZXJSb3dzOiAxLFxuXHRcdFx0XHQvLyBkb250QnJlYWtSb3dzOiB0cnVlLFxuXHRcdFx0XHQvLyBrZWVwV2l0aEhlYWRlclJvd3M6IDEsXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRbe3RleHQ6ICdIZWFkZXIgMScsIHN0eWxlOiAndGFibGVIZWFkZXInfSwge3RleHQ6ICdIZWFkZXIgMicsIHN0eWxlOiAndGFibGVIZWFkZXInfSwge3RleHQ6ICdIZWFkZXIgMycsIHN0eWxlOiAndGFibGVIZWFkZXInfV0sXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0J0xvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS4gTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY28gbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LCBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtLiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uJyxcblx0XHRcdFx0XHRcdCdMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS4gTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY28gbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LCBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtLicsXG5cdFx0XHRcdFx0XHQnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yIGluY2lkaWR1bnQgdXQgbGFib3JlIGV0IGRvbG9yZSBtYWduYSBhbGlxdWEuIFV0IGVuaW0gYWQgbWluaW0gdmVuaWFtLCBxdWlzIG5vc3RydWQgZXhlcmNpdGF0aW9uIHVsbGFtY28gbGFib3JpcyBuaXNpIHV0IGFsaXF1aXAgZXggZWEgY29tbW9kbyBjb25zZXF1YXQuIER1aXMgYXV0ZSBpcnVyZSBkb2xvciBpbiByZXByZWhlbmRlcml0IGluIHZvbHVwdGF0ZSB2ZWxpdCBlc3NlIGNpbGx1bSBkb2xvcmUgZXUgZnVnaWF0IG51bGxhIHBhcmlhdHVyLiBFeGNlcHRldXIgc2ludCBvY2NhZWNhdCBjdXBpZGF0YXQgbm9uIHByb2lkZW50LCBzdW50IGluIGN1bHBhIHF1aSBvZmZpY2lhIGRlc2VydW50IG1vbGxpdCBhbmltIGlkIGVzdCBsYWJvcnVtLiBMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LCBzZWQgZG8gZWl1c21vZCB0ZW1wb3IgaW5jaWRpZHVudCB1dCBsYWJvcmUgZXQgZG9sb3JlIG1hZ25hIGFsaXF1YS4gVXQgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2l0YXRpb24gdWxsYW1jbyBsYWJvcmlzIG5pc2kgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlIGlydXJlIGRvbG9yIGluIHJlcHJlaGVuZGVyaXQgaW4gdm9sdXB0YXRlIHZlbGl0IGVzc2UgY2lsbHVtIGRvbG9yZSBldSBmdWdpYXQgbnVsbGEgcGFyaWF0dXIuIEV4Y2VwdGV1ciBzaW50IG9jY2FlY2F0IGN1cGlkYXRhdCBub24gcHJvaWRlbnQsIHN1bnQgaW4gY3VscGEgcXVpIG9mZmljaWEgZGVzZXJ1bnQgbW9sbGl0IGFuaW0gaWQgZXN0IGxhYm9ydW0uIExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkbyBlaXVzbW9kIHRlbXBvciBpbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBVdCBlbmltIGFkIG1pbmltIHZlbmlhbSwgcXVpcyBub3N0cnVkIGV4ZXJjaXRhdGlvbiB1bGxhbWNvIGxhYm9yaXMgbmlzaSB1dCBhbGlxdWlwIGV4IGVhIGNvbW1vZG8gY29uc2VxdWF0LiBEdWlzIGF1dGUgaXJ1cmUgZG9sb3IgaW4gcmVwcmVoZW5kZXJpdCBpbiB2b2x1cHRhdGUgdmVsaXQgZXNzZSBjaWxsdW0gZG9sb3JlIGV1IGZ1Z2lhdCBudWxsYSBwYXJpYXR1ci4gRXhjZXB0ZXVyIHNpbnQgb2NjYWVjYXQgY3VwaWRhdGF0IG5vbiBwcm9pZGVudCwgc3VudCBpbiBjdWxwYSBxdWkgb2ZmaWNpYSBkZXNlcnVudCBtb2xsaXQgYW5pbSBpZCBlc3QgbGFib3J1bS4nLFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e3RleHQ6ICdTdHlsaW5nIHRhYmxlcycsIHN0eWxlOiAnc3ViaGVhZGVyJ30sXG5cdFx0J1lvdSBjYW4gcHJvdmlkZSBhIGN1c3RvbSBzdHlsZXIgZm9yIHRoZSB0YWJsZS4gQ3VycmVudGx5IGl0IHN1cHBvcnRzOicsXG5cdFx0e1xuXHRcdFx0dWw6IFtcblx0XHRcdFx0J2xpbmUgd2lkdGhzJyxcblx0XHRcdFx0J2xpbmUgY29sb3JzJyxcblx0XHRcdFx0J2NlbGwgcGFkZGluZ3MnLFxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0J3dpdGggbW9yZSBvcHRpb25zIGNvbWluZyBzb29uLi4uXFxuXFxucGRmbWFrZSBjdXJyZW50bHkgaGFzIGEgZmV3IHByZWRlZmluZWQgc3R5bGVzIChzZWUgdGhlbSBvbiB0aGUgbmV4dCBwYWdlKScsXG5cdFx0e3RleHQ6ICdub0JvcmRlcnM6JywgZm9udFNpemU6IDE0LCBib2xkOiB0cnVlLCBwYWdlQnJlYWs6ICdiZWZvcmUnLCBtYXJnaW46IFswLCAwLCAwLCA4XX0sXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0aGVhZGVyUm93czogMSxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFt7dGV4dDogJ0hlYWRlciAxJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9LCB7dGV4dDogJ0hlYWRlciAyJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9LCB7dGV4dDogJ0hlYWRlciAzJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9XSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0bGF5b3V0OiAnbm9Cb3JkZXJzJ1xuXHRcdH0sXG5cdFx0e3RleHQ6ICdoZWFkZXJMaW5lT25seTonLCBmb250U2l6ZTogMTQsIGJvbGQ6IHRydWUsIG1hcmdpbjogWzAsIDIwLCAwLCA4XX0sXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0aGVhZGVyUm93czogMSxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFt7dGV4dDogJ0hlYWRlciAxJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9LCB7dGV4dDogJ0hlYWRlciAyJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9LCB7dGV4dDogJ0hlYWRlciAzJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9XSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0bGF5b3V0OiAnaGVhZGVyTGluZU9ubHknXG5cdFx0fSxcblx0XHR7dGV4dDogJ2xpZ2h0SG9yaXpvbnRhbExpbmVzOicsIGZvbnRTaXplOiAxNCwgYm9sZDogdHJ1ZSwgbWFyZ2luOiBbMCwgMjAsIDAsIDhdfSxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHRoZWFkZXJSb3dzOiAxLFxuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0W3t0ZXh0OiAnSGVhZGVyIDEnLCBzdHlsZTogJ3RhYmxlSGVhZGVyJ30sIHt0ZXh0OiAnSGVhZGVyIDInLCBzdHlsZTogJ3RhYmxlSGVhZGVyJ30sIHt0ZXh0OiAnSGVhZGVyIDMnLCBzdHlsZTogJ3RhYmxlSGVhZGVyJ31dLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRsYXlvdXQ6ICdsaWdodEhvcml6b250YWxMaW5lcydcblx0XHR9LFxuXHRcdHt0ZXh0OiAnYnV0IHlvdSBjYW4gcHJvdmlkZSBhIGN1c3RvbSBzdHlsZXIgYXMgd2VsbCcsIG1hcmdpbjogWzAsIDIwLCAwLCA4XX0sXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0aGVhZGVyUm93czogMSxcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFt7dGV4dDogJ0hlYWRlciAxJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9LCB7dGV4dDogJ0hlYWRlciAyJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9LCB7dGV4dDogJ0hlYWRlciAzJywgc3R5bGU6ICd0YWJsZUhlYWRlcid9XSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0bGF5b3V0OiB7XG5cdFx0XHRcdGhMaW5lV2lkdGg6IGZ1bmN0aW9uIChpLCBub2RlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChpID09PSAwIHx8IGkgPT09IG5vZGUudGFibGUuYm9keS5sZW5ndGgpID8gMiA6IDE7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZMaW5lV2lkdGg6IGZ1bmN0aW9uIChpLCBub2RlKSB7XG5cdFx0XHRcdFx0cmV0dXJuIChpID09PSAwIHx8IGkgPT09IG5vZGUudGFibGUud2lkdGhzLmxlbmd0aCkgPyAyIDogMTtcblx0XHRcdFx0fSxcblx0XHRcdFx0aExpbmVDb2xvcjogZnVuY3Rpb24gKGksIG5vZGUpIHtcblx0XHRcdFx0XHRyZXR1cm4gKGkgPT09IDAgfHwgaSA9PT0gbm9kZS50YWJsZS5ib2R5Lmxlbmd0aCkgPyAnYmxhY2snIDogJ2dyYXknO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2TGluZUNvbG9yOiBmdW5jdGlvbiAoaSwgbm9kZSkge1xuXHRcdFx0XHRcdHJldHVybiAoaSA9PT0gMCB8fCBpID09PSBub2RlLnRhYmxlLndpZHRocy5sZW5ndGgpID8gJ2JsYWNrJyA6ICdncmF5Jztcblx0XHRcdFx0fSxcblx0XHRcdFx0Ly8gaExpbmVTdHlsZTogZnVuY3Rpb24gKGksIG5vZGUpIHsgcmV0dXJuIHtkYXNoOiB7IGxlbmd0aDogMTAsIHNwYWNlOiA0IH19OyB9LFxuXHRcdFx0XHQvLyB2TGluZVN0eWxlOiBmdW5jdGlvbiAoaSwgbm9kZSkgeyByZXR1cm4ge2Rhc2g6IHsgbGVuZ3RoOiAxMCwgc3BhY2U6IDQgfX07IH0sXG5cdFx0XHRcdC8vIHBhZGRpbmdMZWZ0OiBmdW5jdGlvbihpLCBub2RlKSB7IHJldHVybiA0OyB9LFxuXHRcdFx0XHQvLyBwYWRkaW5nUmlnaHQ6IGZ1bmN0aW9uKGksIG5vZGUpIHsgcmV0dXJuIDQ7IH0sXG5cdFx0XHRcdC8vIHBhZGRpbmdUb3A6IGZ1bmN0aW9uKGksIG5vZGUpIHsgcmV0dXJuIDI7IH0sXG5cdFx0XHRcdC8vIHBhZGRpbmdCb3R0b206IGZ1bmN0aW9uKGksIG5vZGUpIHsgcmV0dXJuIDI7IH0sXG5cdFx0XHRcdC8vIGZpbGxDb2xvcjogZnVuY3Rpb24gKHJvd0luZGV4LCBub2RlLCBjb2x1bW5JbmRleCkgeyByZXR1cm4gbnVsbDsgfVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e3RleHQ6ICd6ZWJyYSBzdHlsZScsIG1hcmdpbjogWzAsIDIwLCAwLCA4XX0sXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRsYXlvdXQ6IHtcblx0XHRcdFx0ZmlsbENvbG9yOiBmdW5jdGlvbiAocm93SW5kZXgsIG5vZGUsIGNvbHVtbkluZGV4KSB7XG5cdFx0XHRcdFx0cmV0dXJuIChyb3dJbmRleCAlIDIgPT09IDApID8gJyNDQ0NDQ0MnIDogbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e3RleHQ6ICdhbmQgY2FuIGJlIHVzZWQgZGFzaCBib3JkZXInLCBtYXJnaW46IFswLCAyMCwgMCwgOF19LFxuXHRcdHtcblx0XHRcdHN0eWxlOiAndGFibGVFeGFtcGxlJyxcblx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdGhlYWRlclJvd3M6IDEsXG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRbe3RleHQ6ICdIZWFkZXIgMScsIHN0eWxlOiAndGFibGVIZWFkZXInfSwge3RleHQ6ICdIZWFkZXIgMicsIHN0eWxlOiAndGFibGVIZWFkZXInfSwge3RleHQ6ICdIZWFkZXIgMycsIHN0eWxlOiAndGFibGVIZWFkZXInfV0sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XHRbJ1NhbXBsZSB2YWx1ZSAxJywgJ1NhbXBsZSB2YWx1ZSAyJywgJ1NhbXBsZSB2YWx1ZSAzJ10sXG5cdFx0XHRcdFx0WydTYW1wbGUgdmFsdWUgMScsICdTYW1wbGUgdmFsdWUgMicsICdTYW1wbGUgdmFsdWUgMyddLFxuXHRcdFx0XHRcdFsnU2FtcGxlIHZhbHVlIDEnLCAnU2FtcGxlIHZhbHVlIDInLCAnU2FtcGxlIHZhbHVlIDMnXSxcblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdGxheW91dDoge1xuXHRcdFx0XHRoTGluZVdpZHRoOiBmdW5jdGlvbiAoaSwgbm9kZSkge1xuXHRcdFx0XHRcdHJldHVybiAoaSA9PT0gMCB8fCBpID09PSBub2RlLnRhYmxlLmJvZHkubGVuZ3RoKSA/IDIgOiAxO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR2TGluZVdpZHRoOiBmdW5jdGlvbiAoaSwgbm9kZSkge1xuXHRcdFx0XHRcdHJldHVybiAoaSA9PT0gMCB8fCBpID09PSBub2RlLnRhYmxlLndpZHRocy5sZW5ndGgpID8gMiA6IDE7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhMaW5lQ29sb3I6IGZ1bmN0aW9uIChpLCBub2RlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICdibGFjayc7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZMaW5lQ29sb3I6IGZ1bmN0aW9uIChpLCBub2RlKSB7XG5cdFx0XHRcdFx0cmV0dXJuICdibGFjayc7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGhMaW5lU3R5bGU6IGZ1bmN0aW9uIChpLCBub2RlKSB7XG5cdFx0XHRcdFx0aWYgKGkgPT09IDAgfHwgaSA9PT0gbm9kZS50YWJsZS5ib2R5Lmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiB7ZGFzaDoge2xlbmd0aDogMTAsIHNwYWNlOiA0fX07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHZMaW5lU3R5bGU6IGZ1bmN0aW9uIChpLCBub2RlKSB7XG5cdFx0XHRcdFx0aWYgKGkgPT09IDAgfHwgaSA9PT0gbm9kZS50YWJsZS53aWR0aHMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIHtkYXNoOiB7bGVuZ3RoOiA0fX07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdC8vIHBhZGRpbmdMZWZ0OiBmdW5jdGlvbihpLCBub2RlKSB7IHJldHVybiA0OyB9LFxuXHRcdFx0XHQvLyBwYWRkaW5nUmlnaHQ6IGZ1bmN0aW9uKGksIG5vZGUpIHsgcmV0dXJuIDQ7IH0sXG5cdFx0XHRcdC8vIHBhZGRpbmdUb3A6IGZ1bmN0aW9uKGksIG5vZGUpIHsgcmV0dXJuIDI7IH0sXG5cdFx0XHRcdC8vIHBhZGRpbmdCb3R0b206IGZ1bmN0aW9uKGksIG5vZGUpIHsgcmV0dXJuIDI7IH0sXG5cdFx0XHRcdC8vIGZpbGxDb2xvcjogZnVuY3Rpb24gKGksIG5vZGUpIHsgcmV0dXJuIG51bGw7IH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHt0ZXh0OiAnT3B0aW9uYWwgYm9yZGVyJywgZm9udFNpemU6IDE0LCBib2xkOiB0cnVlLCBwYWdlQnJlYWs6ICdiZWZvcmUnLCBtYXJnaW46IFswLCAwLCAwLCA4XX0sXG5cdFx0J0VhY2ggY2VsbCBjb250YWlucyBhbiBvcHRpb25hbCBib3JkZXIgcHJvcGVydHk6IGFuIGFycmF5IG9mIDQgYm9vbGVhbnMgZm9yIGxlZnQgYm9yZGVyLCB0b3AgYm9yZGVyLCByaWdodCBib3JkZXIsIGJvdHRvbSBib3JkZXIuJyxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRib3JkZXI6IFtmYWxzZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlXSxcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2VlZWVlZScsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxuW2ZhbHNlLCB0cnVlLCBmYWxzZSwgZmFsc2VdJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6ICcjZGRkZGRkJyxcblx0XHRcdFx0XHRcdFx0dGV4dDogJ2JvcmRlcjpcXG5bZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV0sXG5cdFx0XHRcdFx0XHRcdGZpbGxDb2xvcjogJyNlZWVlZWUnLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiAnYm9yZGVyOlxcblt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXSdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0cm93U3BhbjogMyxcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiBbdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV0sXG5cdFx0XHRcdFx0XHRcdGZpbGxDb2xvcjogJyNlZWVlZmYnLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiAncm93U3BhbjogM1xcblxcbmJvcmRlcjpcXG5bdHJ1ZSwgdHJ1ZSwgdHJ1ZSwgdHJ1ZV0nXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRib3JkZXI6IHVuZGVmaW5lZCxcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2VlZWVlZScsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxudW5kZWZpbmVkJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiBbdHJ1ZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV0sXG5cdFx0XHRcdFx0XHRcdGZpbGxDb2xvcjogJyNkZGRkZGQnLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiAnYm9yZGVyOlxcblt0cnVlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXSdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdCcnLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRjb2xTcGFuOiAyLFxuXHRcdFx0XHRcdFx0XHRib3JkZXI6IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXSxcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2VlZmZlZScsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdjb2xTcGFuOiAyXFxuXFxuYm9yZGVyOlxcblt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXSdcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQnJ1xuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0JycsXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdGJvcmRlcjogdW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6ICcjZWVlZWVlJyxcblx0XHRcdFx0XHRcdFx0dGV4dDogJ2JvcmRlcjpcXG51bmRlZmluZWQnXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRib3JkZXI6IFtmYWxzZSwgZmFsc2UsIHRydWUsIHRydWVdLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6ICcjZGRkZGRkJyxcblx0XHRcdFx0XHRcdFx0dGV4dDogJ2JvcmRlcjpcXG5bZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlXSdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRdXG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHRsYXlvdXQ6IHtcblx0XHRcdFx0ZGVmYXVsdEJvcmRlcjogZmFsc2UsXG5cdFx0XHR9XG5cdFx0fSxcblx0XHQnRm9yIGV2ZXJ5IGNlbGwgd2l0aG91dCBhIGJvcmRlciBwcm9wZXJ0eSwgd2hldGhlciBpdCBoYXMgYWxsIGJvcmRlcnMgb3Igbm90IGlzIGRldGVybWluZWQgYnkgbGF5b3V0LmRlZmF1bHRCb3JkZXIsIHdoaWNoIGlzIGZhbHNlIGluIHRoZSB0YWJsZSBhYm92ZSBhbmQgdHJ1ZSAoYnkgZGVmYXVsdCkgaW4gdGhlIHRhYmxlIGJlbG93LicsXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiBbZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6ICcjZWVlZWVlJyxcblx0XHRcdFx0XHRcdFx0dGV4dDogJ2JvcmRlcjpcXG5bZmFsc2UsIGZhbHNlLCBmYWxzZSwgZmFsc2VdJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2RkZGRkZCcsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxudW5kZWZpbmVkJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2VlZWVlZScsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxudW5kZWZpbmVkJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2RkZGRkZCcsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxudW5kZWZpbmVkJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2VlZWVlZScsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxudW5kZWZpbmVkJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Ym9yZGVyOiBbdHJ1ZSwgdHJ1ZSwgZmFsc2UsIGZhbHNlXSxcblx0XHRcdFx0XHRcdFx0ZmlsbENvbG9yOiAnI2RkZGRkZCcsXG5cdFx0XHRcdFx0XHRcdHRleHQ6ICdib3JkZXI6XFxuW3RydWUsIHRydWUsIGZhbHNlLCBmYWxzZV0nXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0J0FuZCBzb21lIG90aGVyIGV4YW1wbGVzIHdpdGggcm93U3Bhbi9jb2xTcGFuLi4uJyxcblx0XHR7XG5cdFx0XHRzdHlsZTogJ3RhYmxlRXhhbXBsZScsXG5cdFx0XHR0YWJsZToge1xuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0JycsXG5cdFx0XHRcdFx0XHQnY29sdW1uIDEnLFxuXHRcdFx0XHRcdFx0J2NvbHVtbiAyJyxcblx0XHRcdFx0XHRcdCdjb2x1bW4gMydcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdCdyb3cgMScsXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHJvd1NwYW46IDMsXG5cdFx0XHRcdFx0XHRcdGNvbFNwYW46IDMsXG5cdFx0XHRcdFx0XHRcdGJvcmRlcjogW3RydWUsIHRydWUsIHRydWUsIHRydWVdLFxuXHRcdFx0XHRcdFx0XHRmaWxsQ29sb3I6ICcjY2NjY2NjJyxcblx0XHRcdFx0XHRcdFx0dGV4dDogJ3Jvd1NwYW46IDNcXG5jb2xTcGFuOiAzXFxuXFxuYm9yZGVyOlxcblt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXSdcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQnJyxcblx0XHRcdFx0XHRcdCcnXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHQncm93IDInLFxuXHRcdFx0XHRcdFx0JycsXG5cdFx0XHRcdFx0XHQnJyxcblx0XHRcdFx0XHRcdCcnXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHQncm93IDMnLFxuXHRcdFx0XHRcdFx0JycsXG5cdFx0XHRcdFx0XHQnJyxcblx0XHRcdFx0XHRcdCcnXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0bGF5b3V0OiB7XG5cdFx0XHRcdGRlZmF1bHRCb3JkZXI6IGZhbHNlLFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICd0YWJsZUV4YW1wbGUnLFxuXHRcdFx0dGFibGU6IHtcblx0XHRcdFx0Ym9keTogW1xuXHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0Y29sU3BhbjogMyxcblx0XHRcdFx0XHRcdFx0dGV4dDogJ2NvbFNwYW46IDNcXG5cXG5ib3JkZXI6XFxuW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXScsXG5cdFx0XHRcdFx0XHRcdGZpbGxDb2xvcjogJyNlZWVlZWUnLFxuXHRcdFx0XHRcdFx0XHRib3JkZXI6IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV1cblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHQnJyxcblx0XHRcdFx0XHRcdCcnXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHQnYm9yZGVyOlxcbnVuZGVmaW5lZCcsXG5cdFx0XHRcdFx0XHQnYm9yZGVyOlxcbnVuZGVmaW5lZCcsXG5cdFx0XHRcdFx0XHQnYm9yZGVyOlxcbnVuZGVmaW5lZCdcblx0XHRcdFx0XHRdXG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHN0eWxlOiAndGFibGVFeGFtcGxlJyxcblx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdGJvZHk6IFtcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHR7cm93U3BhbjogMywgdGV4dDogJ3Jvd1NwYW46IDNcXG5cXG5ib3JkZXI6XFxuW2ZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlXScsIGZpbGxDb2xvcjogJyNlZWVlZWUnLCBib3JkZXI6IFtmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZV19LFxuXHRcdFx0XHRcdFx0J2JvcmRlcjpcXG51bmRlZmluZWQnLFxuXHRcdFx0XHRcdFx0J2JvcmRlcjpcXG51bmRlZmluZWQnXG5cdFx0XHRcdFx0XSxcblx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHQnJyxcblx0XHRcdFx0XHRcdCdib3JkZXI6XFxudW5kZWZpbmVkJyxcblx0XHRcdFx0XHRcdCdib3JkZXI6XFxudW5kZWZpbmVkJ1xuXHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0JycsXG5cdFx0XHRcdFx0XHQnYm9yZGVyOlxcbnVuZGVmaW5lZCcsXG5cdFx0XHRcdFx0XHQnYm9yZGVyOlxcbnVuZGVmaW5lZCdcblx0XHRcdFx0XHRdXG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9XG5cdF0sXG5cdHN0eWxlczoge1xuXHRcdGhlYWRlcjoge1xuXHRcdFx0Zm9udFNpemU6IDE4LFxuXHRcdFx0Ym9sZDogdHJ1ZSxcblx0XHRcdG1hcmdpbjogWzAsIDAsIDAsIDEwXVxuXHRcdH0sXG5cdFx0c3ViaGVhZGVyOiB7XG5cdFx0XHRmb250U2l6ZTogMTYsXG5cdFx0XHRib2xkOiB0cnVlLFxuXHRcdFx0bWFyZ2luOiBbMCwgMTAsIDAsIDVdXG5cdFx0fSxcblx0XHR0YWJsZUV4YW1wbGU6IHtcblx0XHRcdG1hcmdpbjogWzAsIDUsIDAsIDE1XVxuXHRcdH0sXG5cdFx0dGFibGVIZWFkZXI6IHtcblx0XHRcdGJvbGQ6IHRydWUsXG5cdFx0XHRmb250U2l6ZTogMTMsXG5cdFx0XHRjb2xvcjogJ2JsYWNrJ1xuXHRcdH1cblx0fSxcblx0ZGVmYXVsdFN0eWxlOiB7XG5cdFx0Ly8gYWxpZ25tZW50OiAnanVzdGlmeSdcblx0fVxuXHRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgcmV0dXJuIHsgXG4gICAgICAgIHJlcG9ydGRlc2lnbixcbiAgICAgICAgLy9kYXRhOnt9LCAgICAgICAgIC8vZGF0YVxuICAgICAgIC8vIHBhcmFtZXRlcjp7fSAgICAgIC8vcGFyYW1ldGVyXG4gICAgfTtcbn0iXX0=