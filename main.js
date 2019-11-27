const maxLevel = 30;

var input;
var level = parseInt(localStorage.getItem("savedLevel"));
var score = parseInt(localStorage.getItem("savedScore"));
var maxLength = 14;
var winCounter, failCounter = 0;
var firstButtonPressed = false;
var timerStop = false;
var keys = ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä", "Y", "X", "C", "V", "B", "N", "M"]
var keysPressed = [];


function init() {
    var hasBeenLaunched = localStorage.getItem("hasBeenLaunched");
    setPolizeiPosition();
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
    startGame();
}

function resetGame() {
    for (i = 0; i < keys.length; i++) {
        document.getElementById(keys[i] + "key").disabled = false;
        keysPressed[i] = 0;
    }
    winCounter = 0;
    failCounter = 0;
    setPolizeiPosition();
}

function startGame() {
    resetGame();
    input = getWord().replace('\r', '');
    document.getElementById("ip").innerHTML = getRandomNumber(0, 255) + "." + getRandomNumber(0, 255) + "." + getRandomNumber(0, 255) + "." + getRandomNumber(0, 255) + ":" + getRandomNumber(0, 65535);
    maxLength = 14 - (((level / 10) * 2) - 2);
    while (input.length > maxLength || input.length <= maxLength - 2) {
        input = getWord().replace('\r', '');
    }
    inputToHangman(input);
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
            polizeiKommtNaeher();
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
                title: 'Level ' + maxLevel / 10 + ' gemeistert!',
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
    inputToHangman(input);
}