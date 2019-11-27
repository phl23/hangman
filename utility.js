var Wortsammlung;
var meldungen;

$.get('deutsch.txt', function (data) { //Wortliste abrufen und auf Array aufteilen
    Wortsammlung = data.split("\n");

    success: init();
}, "text");

$.getJSON('msgs.json', function (messages) {
    meldungen = messages;

    success: console.log('msgs.JSON geladen');
});

$(window).bind('hashchange',function(event){
    history.pushState("", document.title, window.location.pathname + window.location.search);
});

document.addEventListener('keydown', function (event) {
    if (document.getElementById(String.fromCharCode(event.keyCode) + 'key') && document.getElementById(String.fromCharCode(event.keyCode) + 'key').disabled != true) { //Buchstabe nur eliminieren, wenn der dazugehörige Button nicht bereits disabled ist
        eliminate(String.fromCharCode(event.keyCode));
    }
});

function getWord() {
    var randomWort;
    randomWort = Wortsammlung[getRandomNumber(0, Wortsammlung.length)];
    randomWort = randomWort.toUpperCase();
    return randomWort;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function inputToHangman(myInput) {
    for (var i = 1; i < 15; i++) {
        var input = myInput;
        var buchstabe = input.charAt(i - 1);
        var inputSpan = "input" + i;
        document.getElementById(inputSpan + "inner").style.visibility = 'hidden';
        if (buchstabe !== undefined) { //Vorhandene Buchstabenplatzhalter sichtbar machen
            if (buchstabe == "\r") {input.replace('\r','')}
            if (buchstabe == " ") {
                document.getElementById(inputSpan + "inner").textContent = 'x';
                document.getElementById(inputSpan).display = "inline-block";
                document.getElementById(inputSpan).style.visibility = 'hidden';
                winCounter++;
            } else {
                document.getElementById(inputSpan + "inner").textContent = buchstabe;
                document.getElementById(inputSpan).display = "inline-block";
                document.getElementById(inputSpan).style.visibility = 'visible';
            }
        }
    }
}


function meldung(id) {
    var meldungsDiv = document.getElementById("meldungsdiv");

    console.log(meldungen);
    meldungsDiv.innerHTML = meldungen.tutorial[id];


    window.location.href = "#meldungspage";
}

function locationAlert(locationID) {
    Swal.fire({
        title: meldungen.location.title[locationID],
        text: meldungen.location.text[locationID],
        icon: 'info', 
        confirmButtonText: 'Los gehts!', 
        showCloseButton: 'true'
    }).then(function(result) {
        if (result.value) {
            window.location.href = "#page1";
        }
    });
    
}

function startTimer(zeitInSec) {
    console.log("timer started");
    var verbleibendeZeit = zeitInSec;
    var zeroM, zeroS;
    var x = setInterval(function () {
        verbleibendeZeit = verbleibendeZeit - 1;
        var mins = Math.floor((verbleibendeZeit / 60));
        var secs = Math.floor((verbleibendeZeit % 60));
        if (secs >= 10) {
            zeroS = "";
        } else {
            zeroS = "0";
        }
        if (mins >= 10) {
            zeroM = "";
        } else {
            zeroM = "0";
        }
        document.getElementById("timer").innerHTML = zeroM + mins + ":" + zeroS + secs;
        if (verbleibendeZeit < 0 || timerStop == true) {
            clearInterval(x);
            document.getElementById("timer").innerHTML = "";
        }
    }, 1000);
}

function polizeiKommtNaeher() {
    var failImg = document.getElementById("leftwrapper");
    var autoImg = document.getElementById("auto");
    var failHeight = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("height"), 10);
    var failWidth = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("width"), 10);
    var failInterval = (failCounter-1)/10;
    var y = 10;
    var debugDate = new Date;
    console.log('Auto fährt los: '+debugDate.toString());
    var x = setInterval(function () {

        autoImg.style.top = (failHeight * failInterval)+'px';
        autoImg.style.left = (failWidth * failInterval)+'px';
        
        failInterval = failInterval + 0.01;
        y = y-1;
        
        if (y <= 0) {
            debugDate = new Date;
            console.log('Auto angekommen: '+debugDate.toString());
            clearInterval(x);
        }
    }, 100);

}

function setPolizeiPosition() {
    var failImg = document.getElementById("leftwrapper");
    var autoImg = document.getElementById("auto");
    var failHeight = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("height"), 10);
    var failWidth = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("width"), 10);

    autoImg.style.top = (failHeight * (failCounter/10))+'px';
    autoImg.style.left = (failWidth * (failCounter/10))+'px';
}
