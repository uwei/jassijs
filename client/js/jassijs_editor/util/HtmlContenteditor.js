define(["require", "exports", "jassijs/ui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HtmlContentEditor = void 0;
    class HtmlContentEditor {
    }
    exports.HtmlContentEditor = HtmlContentEditor;
    function getParentList(node, list) {
        list.push(node);
        if (node !== document)
            getParentList(node.parentNode, list);
    }
    function deleteNodeBetween(node1, node2) {
        var list1 = [];
        var list2 = [];
        getParentList(node1, list1);
        getParentList(node2, list2);
        var pos = 0;
        var test = list1[pos];
        while (list2.indexOf(list1[pos]) === -1) {
            pos++;
        }
        var par1 = list1[pos - 1];
        var par2 = list2[list2.indexOf(list1[pos]) - 1];
        var todel = par1.nextSibling;
        while (todel !== par2) {
            var del = todel;
            todel = todel.nextSibling;
            del.remove();
        }
    }
    function removeNode(from, frompos, to, topos) {
        if (from === to) {
            var neu = to.textContent;
            to.textContent = neu.substring(0, frompos) + "" + neu.substring(topos);
        }
        else {
            deleteNodeBetween(from, to);
            from.textContent = from.textContent.substring(0, frompos);
            to.textContent = to.textContent.substring(topos);
        }
        var range = document.createRange();
        var selection = getSelection();
        range.setStart(from, frompos);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    function keydown(e) {
        var sel = document.getSelection();
        var position = sel.anchorNode.compareDocumentPosition(sel.focusNode);
        var anchorNode = sel.anchorNode;
        var anchorOffset = sel.anchorOffset;
        var focusNode = sel.focusNode;
        var focusOffset = sel.focusOffset;
        // selection has wrong direction
        if (!position && sel.anchorOffset > sel.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
            anchorOffset = sel.focusOffset;
            anchorNode = sel.focusNode;
            focusNode = sel.anchorNode;
            focusOffset = sel.anchorOffset;
        }
        if (e.keyCode === 13) {
            e.preventDefault();
            var old = anchorNode.textContent;
            var node = anchorNode;
            var v1 = old.substring(0, anchorOffset);
            var v2 = old.substring(focusOffset);
            node.textContent = v2;
            var enter = node.parentNode.insertBefore(document.createElement("br"), node);
            var textnode = enter.parentNode.insertBefore(document.createTextNode(v1), enter);
            return;
        }
        if (e.code === "Delete") {
            e.preventDefault();
            if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                sel.modify("extend", "right", "character");
                var newsel = document.getSelection();
                removeNode(anchorNode, anchorOffset, newsel.focusNode, newsel.focusOffset);
            }
            else {
                removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
            }
            return;
        }
        if (e.code === "Backspace") {
            e.preventDefault();
            if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                sel.modify("extend", "left", "character");
                var newsel = document.getSelection();
                removeNode(newsel.focusNode, newsel.focusOffset, anchorNode, anchorOffset);
            }
            else {
                removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
            }
            return;
        }
        if (e.key.length === 1) {
            var end = focusOffset;
            if (anchorNode !== focusNode) {
                end = anchorNode.textContent.length;
            }
            var neu = old.substring(0, anchorOffset) + e.key + old.substring(end);
            if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
            }
            else {
                removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
            }
            anchorNode.textContent = neu;
            e.preventDefault();
            var range = document.createRange();
            range.setStart(anchorNode, anchorOffset + 1);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
    function test() {
        var dom = React.createElement("div", {
            contenteditable: "true"
        }, "Hallo", "Du");
        var ret = (0, Component_1.createComponent)(dom);
        ret.dom.addEventListener("keydown", keydown);
        //windows.add(ret, "Hallo");
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=HtmlContenteditor.js.map