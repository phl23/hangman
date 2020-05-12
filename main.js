'use strict'
const maxLevel = 30;																	// Maximal-Level (3) * 10, für eventuelle spätere Zwischenlevel
const timerZeitInSec = 120;																// Konstante zur einfachen Regelung des Timers
const maxLength = 35;																	// Maximale Wortlänge, die in das Galgenmännchen-Feld passt
var liste = "alk"																		// Voreingestellte Wortliste
var input;																				// Initialisierung der Variable für User-Eingabe
var level = 10;																			// Startlevel = 1 (* 10)
//var level = parseInt(localStorage.getItem('savedLevel'));								// Eventuell zwischengespeichertes Level aus dem LocalStorage des Browsers holen, siehe https://developer.mozilla.org/de/docs/Web/API/Window/localStorage
var score = 0;																			// Startscore = 0
//var score = parseInt(localStorage.getItem('savedScore'));								// Evtl. Spielstand aus dem localStorage, siehe Z. 8
var winCounter, failCounter = 0;														// Gewinn- und Verlustzähler für die Gewinnabfrage [function checkWin()] = 0
//var newMaxLength = maxLength;															// Hilfsvariable für Wortlängen-Errechnung, siehe Z. 86
var firstButtonPressed = false;															// Hilfsvariable für Timer-Start
var timerStop = false;																	// Hilfsvariable für Timer-Stop
var versuchsZeit = 0;																	// Zähler für verbrauchte Zeit im jeweiligen Versuch
var usedWords = [];																		// Array für bereits genutzte Wörter, um Doppel-Verwendungen zu umgehen
var keys = [																			// Array mit validen Tastatureingaben
	'Q',
	'W',
	'E',
	'R',
	'T',
	'Z',
	'U',
	'I',
	'O',
	'P',
	'Ü',
	'A',
	'S',
	'D',
	'F',
	'G',
	'H',
	'J',
	'K',
	'L',
	'Ö',
	'Ä',
	'Y',
	'X',
	'C',
	'V',
	'B',
	'N',
	'M'
];
var keysPressed = [];																	// Array für bereits genutzte Tastatureingaben

function init() {		
/*
Generelle Initalisierung des "Spielfelds" und des UI - löscht Spielstand, Level etc.

Prüfe mittels localStorage (siehe Z.8), ob das Spiel in diesem Browser
schon einmal gestartet wurde. Wenn nicht (oder wenn Variable nicht existiert), 
zeige 1. Tutorial-Meldung und schreibe den 1. Spielstart in den localStorage.
*/																
	var hasBeenLaunched = localStorage.getItem('hasBeenLaunched');
	if (!hasBeenLaunched || hasBeenLaunched === false) {
		meldung(0);
		localStorage.setItem('hasBeenLaunched', true);
	}

	timerStop = true;	// Stoppe eventuell laufenden Timer-Loop
	score = 0;
	document.getElementById('timer').innerHTML = '';	// Lösche Inhalt von Timer-Div
	level = 10;
	//newMaxLength = maxLength;		// siehe Z. 12
	liste = document.getElementById("listenauswahl").value;		// Lese Auswahl des Dropdown-Menüs
	document.getElementById('level').innerHTML = 'Level ' + level / 10;	
	document.getElementById('score').innerHTML = score + ' Punkte';
	
	startGame();
}

function resetGame() {
/*
Spielrunde zurücksetzen - löscht NICHT Spielstand, Timer, Level 
*/
	for (var i = 0; i < keys.length; i++) {	// Virtuelle Tastatur & benutzte Buchstaben freigeben
		document.getElementById(keys[i] + 'key').disabled = false;
		keysPressed[i] = 0;
	}
	winCounter = 0;
	failCounter = 0;
	versuchsZeit = 0;
	firstButtonPressed = false;
	/* blendet das Polizeiauto wieder aus */
	var iframe = document.getElementById("iframegame");
	for (var i = 1; i <= 10; i++) {
	var schrittverbergen = iframe.contentWindow.document.getElementById("move" + i + "hide");
	schrittverbergen.style.display = "none";
	}

	setIp();
}

function startGame() {
/*
Startet eine neue Spielrunde - behält Timer, Score, Level bei
*/
	resetGame();
	input = getWord(liste).replace('\r', ''); // .replace('\r', '') löscht etwaige Zeilensprünge

	while (usedWords.includes(input)) {
		input = getWord(liste).replace('\r', '');
	}
	usedWords.push(input);

	//ANPASSUNG WORTLÄNGE ABHÄNGIG VON LEVEL - unausgereift
	/*
	newMaxLength = Math.floor((newMaxLength-(newMaxLength/4))) - ((level / 10) * 2 - 2);
	console.log("newMaxLength: "+newMaxLength)
	while (input.length > newMaxLength || input.length <= newMaxLength - 2) {
		input = getWord().replace('\r', '');
		if (input.length > maxLength) {
			console.log("INPUT.LENGTH: "+input.length)
			break;
		}
	}
	*/

	generateInputSpans(); 
	inputToHangman(input);
}

function eliminate(buchstabe) {
/*
Kernfunktion des Spiels

*/
	var index = input.indexOf(buchstabe);
	keysPressed[keys.indexOf(buchstabe)]++;	// mitzählen, wie oft ein Buchstabe schon eliminiert wurde
	if (document.getElementById(buchstabe + 'key') != undefined) {	// Validiert Tastatureingabe, indem ihr Vorhandensein in der virtuellen Tastatur überprüft wird
		if (firstButtonPressed == false) {	// Wenn es sich um die 1. Eingabe der Spielrunde und das 1. Level handelt, wird der Timer gestartet
			if (level == 10) {
				timerStop = false;
				startTimer(timerZeitInSec);
			}
			firstButtonPressed = true;
		}
		if (index == -1) {	// wenn für den eingegebenen Buchstaben im gesuchten Wort kein index gefunden wird, zählt es als Fail
			failCounter++;
			setPolizeiPosition(failCounter);	// ruft Function auf um das PolizeiFahrzeug zu bewegen
		} else {	// Wenn ein index gefunden wird:
			while (index != -1) {
				index = input.indexOf(buchstabe, index);
				if (index != -1 && document.getElementById('input' + (index + 1) + 'inner') != null) {
					document.getElementById('input' + (index + 1) + 'inner').style.visibility = 'visible'; //decke Buchstabe im Passwortfeld auf (<span>-Name korrespondiert mit index, z.B. 'input3inner')
					if (keysPressed[keys.indexOf(buchstabe)] == 1) {	// Wenn ein Buchstabe genau einmal probiert wurde, zählt es als Win
						winCounter++;	
					}
					index++;	// index wird um 1 erhöht, dass Wort wird nach weiterem Vorkommen des Buchstabens durchsucht
				}
			}
		}
		if (keysPressed[keys.indexOf(buchstabe)] == level / 10) {	// Die virtuelle Taste wird erst nach einer Anzahl an Versuchen, die dem Level entspricht, ausgegraut (z.B. Level 2: Nach dem 2. Versuch, "E" zu eliminieren, wird es ausgegraut.)
			document.getElementById(buchstabe + 'key').disabled = true;
		}
	}
	checkWin();
}

function checkWin() {
/*
Gewinnabfrage
Überprüft, ob das Wort gefunden wurde. Wenn ja, werden die erreichten Punkte addiert und es wird überprüft, ob das Maximallevel erreicht ist. In diesem Fall ist das Spiel gewonnen.
Überprüft, ob alle Versuche verbraucht sind. Wenn ja, ist das Spiel verloren.
Jeweilige Popup-Meldungen werden angezeigt.
*/
	var punkte = 0;
	if (winCounter == input.length) {
		punkte = (10 - failCounter) * (timerZeitInSec-versuchsZeit);
		Swal.fire({
			title: 'Richtig!',
			html: input + ' war richtig.<br>Du hast '+(timerZeitInSec-versuchsZeit)+' x ' + (10 - failCounter) + ' = ' + punkte + ' Punkte erreicht!',
			icon: 'success',
			confirmButtonText: 'Weiter'
		});
		score = score + punkte;
		if (level < maxLevel) {
			level = level + 10;
			meldung(level/10);
			document.getElementById('level').innerHTML = 'Level ' + level / 10;
			startGame();
		} else {
			Swal.fire({
				title: 'Level ' + maxLevel / 10 + ' gemeistert!',
				html: input+' war richtig!<br>Punktestand: ' + score,
				icon: 'success',
				confirmButtonText: 'Weiter'
			});
			init();
		}
		localStorage.setItem('savedLevel', level);
		localStorage.setItem('savedScore', score);
	}
	if (failCounter == 10) {
		Swal.fire({
			title: 'Verloren!',
			text: 'Leider verloren, die Lösung wäre ' + input + ' gewesen!',
			icon: 'error',
			confirmButtonText: 'Weiter'
		});
		init();
	}
}

function ownWord() {
/*

	*** Derzeit ungenutzt ***

Ermöglicht manuelle Worteingabe
*/
	var Leerzeichen = 0;
	var unsanitized = window.prompt('Wort eingeben (max. 14 Zeichen):', '');
	while (unsanitized.length > maxLength) {
		unsanitized = window.prompt('Das waren mehr als 14 Zeichen! Bitte erneut eingeben:', '');
	}
	if (unsanitized.indexOf(' ') != -1) {
		Leerzeichen++;
		if (unsanitized.indexOf(' ', unsanitized.indexOf(' ') + 1) > -1 && Leerzeichen > 0) {
			Leerzeichen++;
			while (
				unsanitized.indexOf(' ', unsanitized.indexOf(' ', unsanitized.indexOf(' ') + 1) + 1) > -1 &&
				Leerzeichen > 0
			) {
				unsanitized = window.prompt('Eingabe darf max. 2 Leerzeichen enthalten! Bitte erneut eingeben:', '');
			}
		}
	}
	while (unsanitized.length < 2) {
		unsanitized = window.prompt('1 Buchstasdabe ist kein Wort! Bitte erneut eingeben:', '');
	}

	resetGame();
	input = unsanitized.toUpperCase();
	inputToHangman(input);
}