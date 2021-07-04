var bt = document.getElementById('lastbreak');
bt.addEventListener('click', function () {
    chrome.extension.getBackgroundPage().removeLastBreakpoint();
}, false);
//# sourceMappingURL=panel.js.map