var onArmClick = function(e) {
    var button = this;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "arm", type: button.getAttribute("data-type")}, function(response) {
            console.log(response);
        });

        window.close();
    });  
};

var buttons = document.getElementsByClassName("arm");
var buttonsLength = buttons.length;

for(var i = 0; i < buttonsLength; i++) {
    buttons[i].addEventListener("click", onArmClick, false);
}
