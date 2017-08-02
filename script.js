
document.getElementById("button1").addEventListener("click", sendUrl);

function sendUrl() {

    var data = document.getElementById("text1").value;
    var obj = { "data": data };
    var jsonData = JSON.stringify(obj);

    sendData(jsonData);

}

function sendData(data) {

    var xhttp = new XMLHttpRequest();

     xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            console.log("SUCCESS!!!");
            console.log(xhttp.responseText);
        }
    }; 

    xhttp.open("POST", "http://localhost:3000/receive", true);
    //xhttp.open("POST", "https://floating-island-50698.herokuapp.com/receive", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(data);

    firstTimeRegistration();
}


chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    console.log(tabs[0].url);
    url = tabs[0].url;

    document.getElementById('text1').value = url;
});

function registerCallback(registrationId) {
    console.log(registrationId);
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        return;
    }

    

    sendRegistrationId(registrationId, function(succeed) {
        if (succeed)
            chrome.storage.local.set({registered: true});
    });
}

function sendRegistrationId(registrationId, callback) {

    var obj = { "token" : registrationId };
    var jsonToken = JSON.stringify(obj);

    var xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            console.log("REGISTRATION SUCCESS!!!");
            console.log(xhttp.responseText);
        }
    };
    xhttp.open("POST", "http://localhost:3000/register", true);
    //xhttp.open("POST", "https://floating-island-50698.herokuapp.com/register", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(jsonToken); 

}

chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);

function firstTimeRegistration() {

    chrome.storage.local.get('registered', function(result) {

        // If already registered, bail out.
        if (result["registered"]) {
            console.log("Already registered ");
            return;
        }
        var senderId = "42904554132";
        chrome.gcm.register([senderId], registerCallback);
    });
}

chrome.gcm.onMessage.addListener(function(message) {
    console.log("MESSAGE RECEIVED!!!!!!");
    console.log(message);
});
 


