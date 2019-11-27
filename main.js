const maxLevel = 30;

var input;
var level = parseInt(localStorage.getItem("savedLevel"));
var score = parseInt(localStorage.getItem("savedScore"));
var Wortsammlung;
var maxLength = 14;
var winCounter, failCounter = 0;
var firstButtonPressed = false;
var timerStop = false;
var meldungen;
var keys = ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä", "Y", "X", "C", "V", "B", "N", "M"]
var keysPressed = [];


function setFails() {
    var failImg = document.getElementById("leftwrapper");
    var autoImg = document.getElementById("auto");
    var failHeight = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("height"), 10);
    var failWidth = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("width"), 10);

    autoImg.style.top = (failHeight * (failCounter/10))+'px';
    autoImg.style.left = (failWidth * (failCounter/10))+'px';
}

$.getJSON('msgs.json', function (messages) {
    meldungen = messages;

    success: init();
});



$(window).bind('hashchange',function(event){
    history.pushState("", document.title, window.location.pathname + window.location.search);
});

function init() {
    var hasBeenLaunched = localStorage.getItem("hasBeenLaunched");
    setFails();
    if (!hasBeenLaunched || hasBeenLaunched === false) {
        meldung(0);
        localStorage.setItem("hasBeenLaunched", true)
    }
    timerStop = true;
    firstButtonPressed = false;
    score = 0;
    document.getElementById("timer").innerHTML = "";
    if (!level) {
        level = 10
    }
    document.getElementById("level").innerHTML = "Level " + level / 10;
    document.getElementById("score").innerHTML = score + ' Punkte';
    resetGame();
}





function resetGame() {
    for (i = 0; i < keys.length; i++) {
        document.getElementById(keys[i] + "key").disabled = false;
        keysPressed[i] = 0;
    }
    winCounter = 0;
    failCounter = 0;
    setFails();
}

function startGame() {
    resetGame();
    input = getWord();
    document.getElementById("ip").innerHTML = getRandomNumber(0, 255) + "." + getRandomNumber(0, 255) + "." + getRandomNumber(0, 255) + "." + getRandomNumber(0, 255) + ":" + getRandomNumber(0, 65535);
    maxLength = 14 - (((level / 10) * 2) - 2);
    while (input.length > maxLength || input.length <= maxLength - 2) {
        input = getWord();
    }
    inputToHangman();

}

function inputToHangman() {
    for (var i = 1; i < 15; i++) {
        var buchstabe = input.charAt(i - 1);
        var inputSpan = "input" + i;
        document.getElementById(inputSpan + "inner").style.visibility = 'hidden';
        if (buchstabe !== undefined) { //Vorhandene Buchstabenplatzhalter sichtbar machen
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

function eliminate(buchstabe) {
    var index = input.indexOf(buchstabe);
    keysPressed[keys.indexOf(buchstabe)]++; //mitzählen, wie oft ein Buchstabe schon eliminiert wurde
    if (document.getElementById(buchstabe + 'key') != undefined) { //Tastatureingabe-Validität per DOM-Abfrage
        if (firstButtonPressed == false) {
            timerStop = false;
            startTimer(120);
            firstButtonPressed = true;
        }
        if (index == -1) {
            failCounter++;
            failed();
        } else {
            while (index != -1) {
                index = input.indexOf(buchstabe, index)
                if (index != -1 && document.getElementById("input" + (index + 1) + "inner") != null) {
                    document.getElementById("input" + (index + 1) + "inner").style.visibility = 'visible';
                    if (keysPressed[keys.indexOf(buchstabe)] == 1) {
                        winCounter++;
                    }
                    index++;
                }
            }
        }
        if (keysPressed[keys.indexOf(buchstabe)] == level / 10) {
            document.getElementById(buchstabe + 'key').disabled = true;
        }
    }
    checkWin();
}

function checkWin() {
    var punkte = 10 - failCounter;
    if (winCounter == input.length) {
        Swal.fire({
            title: 'Richtig!',
            html: input + ' war richtig.<br>Du hast ' + punkte + ' Punkte erreicht!',
            icon: 'success',
            confirmButtonText: 'Weiter'
        });
        score = score + punkte;
        if (level < maxLevel) {
            level = level + 10;
            document.getElementById("level").innerHTML = "Level " + level / 10;
        } else {
            Swal.fire({
                title: 'Level 5 gemeistert!',
                text: 'Punktestand: ' + score,
                icon: 'success',
                confirmButtonText: 'Weiter'
            });
            level = 10;
            score = 0;
            document.getElementById("level").innerHTML = "Level " + level / 10;
        }
        localStorage.setItem("savedLevel", level);
        localStorage.setItem("savedScore", score);
        startGame();
    }
    if (failCounter == 10) {
        Swal.fire({
            title: 'Verloren!',
            text: 'Leider verloren, die Lösung wäre ' + input + ' gewesen!',
            icon: 'error',
            confirmButtonText: 'Weiter'
        });
        if (level > 10) {
            level = level - 10;
            document.getElementById("level").innerHTML = "Level " + level / 10;
        }
        if (score - 10 > 0) {
            score = score - 10;
        } else {
            score = 0;
        }
        localStorage.setItem("savedLevel", level);
        localStorage.setItem("savedScore", score);
        startGame();
    }

}

function failed() {
    var failImg = document.getElementById("leftwrapper");
    var autoImg = document.getElementById("auto");
    var failHeight = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("height"), 10);
    var failWidth = parseInt(window.getComputedStyle(failImg, null).getPropertyValue("width"), 10);
    var failInterval = (failCounter-1)/10;
    var y = 10;
    var x = setInterval(function () {

        autoImg.style.top = (failHeight * failInterval)+'px';
        autoImg.style.left = (failWidth * failInterval)+'px';
        
        failInterval = failInterval + 0.01;
        console.log(y);
        y = y-1;
        
        if (y <= 0) {
            clearInterval(x);
        }
    }, 100);

}

function ownWord() {
    var Leerzeichen = 0;
    var unsanitized = window.prompt("Wort eingeben (max. 14 Zeichen):", '')
    while (unsanitized.length > maxLength) {
        unsanitized = window.prompt("Das waren mehr als 14 Zeichen! Bitte erneut eingeben:", '')
    }
    if (unsanitized.indexOf(" ") != -1) {
        Leerzeichen++;
        if (unsanitized.indexOf(" ", unsanitized.indexOf(" ") + 1) > -1 && Leerzeichen > 0) {
            Leerzeichen++;
            while (unsanitized.indexOf(" ", unsanitized.indexOf(" ", unsanitized.indexOf(" ") + 1) + 1) > -1 && Leerzeichen > 0) {
                unsanitized = window.prompt('Eingabe darf max. 2 Leerzeichen enthalten! Bitte erneut eingeben:', '')
            }
        }
    }
    while (unsanitized.length < 2) {
        unsanitized = window.prompt('1 Buchstasdabe ist kein Wort! Bitte erneut eingeben:', '')
    }

    resetGame();
    input = unsanitized.toUpperCase();
    inputToHangman();
}

document.addEventListener('keydown', function (event) {
    if (document.getElementById(String.fromCharCode(event.keyCode) + 'key') && document.getElementById(String.fromCharCode(event.keyCode) + 'key').disabled != true) { //Buchstabe nur eliminieren, wenn der dazugehörige Button nicht bereits disabled ist
        eliminate(String.fromCharCode(event.keyCode));
    }
});

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

function locationAlert(locationID) {
    if (locationID === 1) {
    Swal.fire({
        title: 'Tante Emma Laden',
        text: 'Brich bei Tante Emma ein!',
        icon: 'info', 
        confirmButtonText: 'Los gehts!', 
        showCloseButton: 'true'
    }).then(function(result) {
        if (result.value) {
            window.location.href = "#page1";
        }
    });
    }
}

function meldung(id) {
    var meldungsDiv = document.getElementById("meldungsdiv");

    console.log(meldungen);
    meldungsDiv.innerHTML = meldungen.id[id];


    window.location.href = "#meldungspage";
}