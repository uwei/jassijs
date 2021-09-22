define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                datatable: {
                    groups: [
                        {
                            header: ["${group1.name}", "", ""],
                            expression: "city",
                            footer: ["", "", ""]
                        },
                        {
                            header: [
                                "${group2.name}",
                                "",
                                { text: [], editTogether: true }
                            ],
                            expression: "customer",
                            footer: [
                                "custfooter",
                                "",
                                { text: [], editTogether: true }
                            ]
                        }
                    ],
                    header: ["id", "customer", "city"],
                    dataforeach: "cust",
                    body: ["${cust.id}", "${cust.customer}", "${cust.city}"]
                }
            }
        ]
    };
    var sampleData = [
        { id: 1, customer: "Fred", city: "Frankfurt" },
        { id: 8, customer: "Alma", city: "Dresden" },
        { id: 3, customer: "Heinz", city: "Frankfurt" },
        { id: 2, customer: "Fred", city: "Frankfurt" },
        { id: 6, customer: "Max", city: "Dresden" },
        { id: 4, customer: "Heinz", city: "Frankfurt" },
        { id: 5, customer: "Max", city: "Dresden" },
        { id: 7, customer: "Alma", city: "Dresden" },
        { id: 9, customer: "Otto", city: "Berlin" }
    ];
    function groupsort(group, groupname, groupfields, groupid = 0) {
        var ret = { entries: [], groupname: groupname };
        if (groupid > 0)
            ret["groupfield"] = groupfields[groupid - 1];
        if (Array.isArray(group)) {
            group.forEach((neu) => ret.entries.push(neu));
        }
        else {
            for (var key in group) {
                var neu = group[key];
                ret.entries.push(groupsort(neu, key, groupfields, groupid + 1));
            }
            ret.entries = ret.entries.sort((a, b) => {
                return a.groupname.localeCompare(b.groupname);
            });
        }
        return ret;
    }
    function dogroup(entries, groupfields) {
        var ret = {};
        for (var e = 0; e < entries.length; e++) {
            var entry = entries[e];
            let parent = ret;
            for (var x = 0; x < groupfields.length; x++) {
                var groupname = entry[groupfields[x]];
                if (x < groupfields.length - 1) { //undergroups does exists
                    if (!parent[groupname])
                        parent[groupname] = {};
                }
                else { //last group contaons the data
                    if (!parent[groupname])
                        parent[groupname] = [];
                    parent[groupname].push(entry);
                }
                parent = parent[groupname];
            }
        }
        //sort
        var sorted = groupsort(ret, "main", groupfields);
        return sorted;
    }
    async function test() {
        var test = dogroup(sampleData, ["city", "customer"]);
        console.log(JSON.stringify(test));
        // kk.o=0;
        var dlg = { reportdesign };
        dlg.value = sampleData;
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=Testdatatable3.js.map