var usedOn: any = {};
var openedOn: any = {};
var accessed: any = {};
var activeTabId;
var timeout: any;
var activeInterval = 2500;

// function _debug() {
//     console.log.apply(console, arguments);
// }

function _markActive(tabId: number) {
    // _debug('marked active', tabId);
    usedOn[tabId] = new Date().getTime();
    accessed[tabId] += 1;
}

function _handleTabActivated(data: any) {
    var tabId = data.tabId;
    activeTabId = tabId;
    // _debug('activated', tabId);

    clearTimeout(timeout);

    // after 3 seconds mark this tab as active
    // this is so if you are quickly switching tabs
    // they are not considered active
    timeout = setTimeout(function() {
        _markActive(tabId);
    }, activeInterval);
}

function _handleTabRemoved(tabId: any) {
    clearTimeout(timeout);

    // _debug('removedTab', tabId);
    delete usedOn[tabId];
    delete openedOn[tabId];
    delete accessed[tabId];
}

function _handleTabReplaced(newTabId: any, oldTabId: any) {
    if (usedOn[oldTabId]) {
        usedOn[newTabId] = usedOn[oldTabId];
    }

    if (openedOn[oldTabId]) {
        openedOn[newTabId] = openedOn[oldTabId];
    }

    if (accessed[oldTabId]) {
        accessed[newTabId] = accessed[oldTabId];
    }

    delete usedOn[oldTabId];
    delete openedOn[oldTabId];
    delete accessed[oldTabId];
}

function _removeTab(tabId: any) {
    // _debug('_removeTab', tabId);
    if (tabId) {
        chrome.tabs.remove(tabId, function() {});
    }
}

function _handleTabAdded(data: any) {
    var tabId = data.id || data;

    // _debug('added', tabId);
    _removeTab(tabId);
}

function _removeWindow(windowId: any){
    // _debug('_removeWindow', windowId);
    if (windowId) {
        chrome.windows.remove(windowId, function() {});
    }
}

function _removeWindows() {
    chrome.windows.getAll({}, function(windows: any){
        for(var i = 0; i < windows.length; i++){
            chrome.windows.remove(windows[i].id);
        }
    });
}

function _handleWindowAdded(data: any) {
    var winId = data.id || data;

    // _debug('added', winId);
    _removeWindow(winId);
}

function _bindEvents() {
    chrome.tabs.onActivated.addListener(_handleTabActivated);
    chrome.tabs.onCreated.addListener(_handleTabAdded);
    chrome.tabs.onAttached.addListener(_handleTabAdded);
    chrome.tabs.onRemoved.addListener(_handleTabRemoved);
    chrome.tabs.onDetached.addListener(_handleTabRemoved);
    chrome.tabs.onReplaced.addListener(_handleTabReplaced);
    chrome.windows.onCreated.addListener(_handleWindowAdded);
}

function _init() {
    _removeWindows();
    chrome.windows.create({
        url: chrome.runtime.getURL("index.html"),
        state:"maximized"
    });
    _bindEvents();
}

document.addEventListener("DOMContentLoaded", function(event) { 
    _init();
});
