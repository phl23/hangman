'use strict'
const maxLevel = 33;																	// Maximal-Level (3) * 10, für eventuelle spätere Zwischenlevel (33 da Level 3 Stage 3)
const maxLength = 35;																	// Maximale Wortlänge, die in das Galgenmännchen-Feld passt
const maxStage = 3;																		// Maximale Stage pro Mission, danach ist die Mission geschafft
var maxFails = 10;																		// Maximale Fails bevor zurück zu Missionsanfang (zu var ändern falls Missionen unterschiedliche Fails haben sollen)
var timerZeitInSec = 120;																// Nicht mehr Konstante, da von Mission zu Mission unterschiedlich
const timerLastSecValue = 20;															// Verbleibende Zeit in Sekunden ab wo der Timer die Farbe wechselt!
var liste = "spiele";																	// Voreingestellte Wortliste
var items = ['Baum',];																	// Hier kommen die Items rein ( im Klartext z.b. 'baum') bestimmt auch StartItems
var minPunkteItemReward = 0;															// Hier kommt die Mindestpunktzahl, die zum erhalten eines Items benötgt wird, rein.
var consoleOutput = false;																// Schatet die Ausgabe in der Console um
var input;																				// Initialisierung der Variable für User-Eingabe
var level = 0;																			// Startlevel = 0 bedeuted, dass das Spiel mit dem Tutorial beginnt!
var easymode = 1;																		// Schwierigkeitsgrad: 1 leicht, 2 normal, 3 schwer
var stagereset = false;																	// Soll bei Verloren die Stage neugestartet werden? oder die Mission
//var level = parseInt(localStorage.getItem('savedLevel'));								// Eventuell zwischengespeichertes Level aus dem LocalStorage des Browsers holen, siehe https://developer.mozilla.org/de/docs/Web/API/Window/localStorage
var score = 0;																			// Startscore = 0
var missionscore = 0;																	// Missionsscore = 0
//var score = parseInt(localStorage.getItem('savedScore'));								// Evtl. Spielstand aus dem localStorage, siehe Z. 8
var winCounter = 0;																		// Gewinn- und Verlustzähler für die Gewinnabfrage [function checkWin()] = 0 und Gesamtfail für Highscore?
var failCounter = 0;
var failCounterMission = 0;
var failCounterGesamt = 0;
const listelevel1 = "alk";
const listelevel2 = "spiele";
const listelevel3 = "katzennamen";

var playername = "anonymous"															// Standard Spieler Name für Highscore


/* Confirm Button Style */
	const confBtnDelay = 360;															// Dauer der Confirm Button Animation
	const confBtnTiming = "ease-in";													// Timing der Confirm Button Animation siehe: https://webkul.github.io/micron/docs.html#type-of-ease
	const confBtnInteraction = "jelly";													// Art der Confirm Button Animation siehe: https://webkul.github.io/micron/docs.html#interactions

//var newMaxLength = maxLength;															// Hilfsvariable für Wortlängen-Errechnung, siehe Z. 86 (im Init)
var firstButtonPressed = false;															// Hilfsvariable für Timer-Start
var timerStop = false;																	// Hilfsvariable für Timer-Stop
var punktereset = false;																// Hilfsvariable für Punktereset bei verloren (nicht score)
var scorereset = false;																	// Hilfsvariable um die Score bei Fehlverusch in der Mission zu resetten.
var timerLeft = timerZeitInSec;															// Hilfsvariable für Pause zwischen Stages
var verbleibendeZeit = 0;																// Hilfvariable für timer
var versuchsZeit = 0;																	// Zähler für verbrauchte Zeit im jeweiligen Versuch
var missionsZeit = 0;																	// Zähler für verbrauchte Zeit in der jeweiligen Mission
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




function init(levelwahl) {		
/*
Generelle Initalisierung des "Spielfelds" und des UI - löscht Spielstand, Level etc.
Levelwahl wird durch Levelauswahl Popup bestimmt

Prüfe mittels localStorage (siehe variablen am Anfang der main.js), ob das Spiel in diesem Browser
schon einmal gestartet wurde. Wenn nicht (oder wenn Variable nicht existiert), 
zeige 1. Tutorial-Meldung und schreibe den 1. Spielstart in den localStorage.
*/																
	
	if (level < 10) {			// Nur beim ersten Start, dann ist var level = 0
		willkommenmsg();
		deactivateLevel('all');
		activateLevel('1');
		showHighscore();
	}
	scoreAnzeige();
	var hasBeenLaunched = localStorage.getItem('hasBeenLaunched');
	/* Hier später allgemeines Tutorial einbauen und in msg.json bei Tutorial auf Platz 0 eintragen
	if (!hasBeenLaunched || hasBeenLaunched === false) {
		tutorialmsg(0);
		localStorage.setItem('hasBeenLaunched', true);
	} */
	
	timerStop = true;	// Stoppe eventuell laufenden Timer-Loop
	document.getElementById('timer').innerHTML = '';	// Lösche Inhalt von Timer-Div
	if (typeof levelwahl === typeof undefined)  {  // Check ob ein Level gewählt wurde, nur zu Testzwecke, da später nicht die Spiele-Seite direkt geladen wird
		levelwahl = 0;
	}
	level = levelwahl;
	if (level == 0) {		// Checke ob Firststart! Hier alles reinschreiben, was beim ersten Start kommt. z.B.: Tutorial
		return;
	}
	//newMaxLength = maxLength;		// siehe Z. 12 (Am Anfang der main.js)
	if (11 <= level && level <= 19) {		// Prüft das gewählte Level und wählt die entsprechende Wortliste
		liste = listelevel1;
	}
	if (21 <= level && level <= 29) {
		liste = listelevel2;
	}
	if (31 <= level && level <= 39) {
		liste = listelevel3;
	}
	// liste = document.getElementById("listenauswahl").value;		// Lese Auswahl des Dropdown-Menüs
	$.mobile.changePage("#page2",{transition:"slideup"});  // Gehe auf Seite 2 (Spiel)
	missionscore = 0;
	missionsZeit = 0;
	versuchsZeit = 0;
	greenFlashInit();
	redFlashInit();
	itemsAnzeige();
	startGame();
	 
}

function resetGame() {
/*
Spielrunde zurücksetzen - löscht NICHT Spielstand, Timer, Level -- gedacht für neue Stage!
*/
	for (var i = 0; i < keys.length; i++) {	// Virtuelle Tastatur & benutzte Buchstaben freigeben
		document.getElementById(keys[i] + 'key').disabled = false;
		keysPressed[i] = 0;
	}
	winCounter = 0;
	failCounter = 0;
	document.getElementById('fails').className = '';
	versuchsZeit = 0;
	
	$("#greenwin").fadeOut(0,'swing');
	if (level % 10 == 1) {			// wird nur bei Missionsstart und nicht bei Stagestart zurückgesetzt
		failCounterMission = 0;
	}
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
	if (consoleOutput == true) {  // Testzwecke
		$('#lösung').remove();  // Testzwecke
		$('#lösungdiv').css({"display" : "flex", "height" : "3vh"});  // Testzwecke
		$('#lösungdiv').prepend('<span id="lösung" style="margin:0 auto"></span>');	// Testzwecke
		document.getElementById('lösung').innerHTML = (usedWords[usedWords.length - 1]);	// Testzwecke
		console.log(usedWords);  // Testzwecke
	}
	
	//ANPASSUNG WORTLÄNGE ABHÄNGIG VON LEVEL - unausgereift
	/*
	newMaxLength = Math.floor((newMaxLength-(newMaxLength/4))) - ((level / 10) * 2 - 2);
	if (consoleOutput == true) {
		console.log("newMaxLength: "+newMaxLength);  // Testzwecke
	}
	while (input.length > newMaxLength || input.length <= newMaxLength - 2) {
		input = getWord().replace('\r', '');
		if (input.length > maxLength) {
			if (consoleOutput == true) {
				console.log("INPUT.LENGTH: "+input.length);  // Testzwecke
			}
			break;
		}
	}
	*/

	generateInputSpans(); 
	inputToHangman(input);
	if (punktereset == true) {
		missionscore = 0;
		missionsZeit = 0;
		punktereset = false;
	}

	missionScoreAnzeige();
	levelAnzeige();
	setMap(Math.floor(level / 10));
	// Kleiner Fix, damit die verbleibende Zeit angezeigt wird bevor man die Stagemsg bestätigt
	if (level % 10 == 1) {
		timerLeft = timerZeitInSec;		// Setzt den Timer in der ersten Stage immer auf timerZeitInSec (z.b. 120)
	}
	if (timerLeft < timerLastSecValue) {		// Letzte Sekunden Warnung
		document.getElementById('timer').className = 'lastseconds';
	}
	else {
		document.getElementById('timer').className = 'normal';	// Letzte Sekunden Warnung deaktiveren
	}
	$("#redloose").fadeOut(100,'swing', function() {		// Roten Verloren Bildschrim entfernen
		stagemsg(level);
	});
	
}

function eliminate(buchstabe) {
	
/*
Kernfunktion des Spiels
*/
	var index = input.indexOf(buchstabe);
	keysPressed[keys.indexOf(buchstabe)]++;	// mitzählen, wie oft ein Buchstabe schon eliminiert wurde
	if (document.getElementById(buchstabe + 'key') != undefined) {	// Validiert Tastatureingabe, indem ihr Vorhandensein in der virtuellen Tastatur überprüft wird
		if (firstButtonPressed == false) {	// Wenn es sich um die 1. Eingabe der Spielrunde wird der Timer gestartet
			timerStop = false;
			startTimer(timerZeitInSec);
			firstButtonPressed = true;
		}
		if (index == -1) {	// wenn für den eingegebenen Buchstaben im gesuchten Wort kein index gefunden wird, zählt es als Fail
			flashKeyRed(buchstabe);
			failCounter++;
			if (failCounter == 7){
				document.getElementById('fails').className = 'almostmax';
			}
			failCounterMission++;
			setPolizeiPosition(failCounter);	// ruft Function auf um das PolizeiFahrzeug zu bewegen
			failAnzeige();		// Für Testzwecke
		} else {	// Wenn ein index gefunden wird:
			flashKeyGreen(buchstabe);
			while (index != -1) {
				index = input.indexOf(buchstabe, index);
				flashTerminalGreen(index);
				if (index != -1 && document.getElementById('input' + (index + 1) + 'inner') != null) {
					if (document.getElementById('input' + (index + 1) + 'inner').style.visibility != 'visible') {		//Falls schon zuvor von Item aufgedeckt
							document.getElementById('input' + (index + 1) + 'inner').style.visibility = 'visible'; //decke Buchstabe im Passwortfeld auf (<span>-Name korrespondiert mit index, z.B. 'input3inner')
						if (keysPressed[keys.indexOf(buchstabe)] == 1) {	// Wenn ein Buchstabe genau einmal probiert wurde, zählt es als Win
							winCounter++;	
						}
					}					
					index++;	// index wird um 1 erhöht, dass Wort wird nach weiterem Vorkommen des Buchstabens durchsucht
					document.getElementById(buchstabe + 'key').disabled = true;			// Blendet richtige Buchstaben aus
				}
			}
		}
		// + 1 hier, da das Level immer eine dezimal Stelle hat bei geteilt durch 10
		if (keysPressed[keys.indexOf(buchstabe)] + 1 > level / 10) {		// Die virtuelle Taste wird erst nach einer Anzahl an Versuchen, 
			document.getElementById(buchstabe + 'key').disabled = true;		// die dem Level entspricht, ausgegraut (z.B. Level 2: Nach dem 2. Versuch, "E" zu eliminieren, wird es ausgegraut.)	
		}																	// Richtige Buchstaben werden allerdings schon weiter oben ausgeblendet!
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
	if (winCounter >= input.length) {
		punkte = ((maxFails) - failCounter) * (timerZeitInSec-versuchsZeit); // MaxZeit - gebrauchte Zeit in der Stage x Fehler übrig    Punkte erreicht
		missionscore = missionscore + punkte;
		missionsZeit = versuchsZeit + missionsZeit;
		missionScoreAnzeige();
		if (level == maxLevel) {				// Spiel komplett gewonnen!
			score = missionscore + score;
			failCounterGesamt = failCounterMission + failCounterGesamt;
			timerStop = true;		// Sonst feuert der Timer bei der Siegbenachrichtigung
			scoreAnzeige();
			$("#greenwin").fadeIn(850,'swing', function() {
				siegmsg(0);							// Sieg-Nachricht für Testzwecke! roll roll
			})
			return;
		}
		else {		// Stage gewonnen!
			// Hier nächste Stage
			if (level % 10 != maxStage) {			// % ist der modulus Operator -> z.b. 53 geteilt durch 10 = 5 mit Rest 3 , also alles was mit "maxStage" endet löst nicht aus!
				timerLeft = verbleibendeZeit;
				timerStop = true;
				stagesiegmsg(punkte);
			}
			else {		// Hier passiert das was bei Missionsabschluss passiert
				timerStop = true;		// Sonst feuert der Timer bei der Siegbenachrichtigung
				if (punkte > minPunkteItemReward) {
					rewardItem(Math.floor(level / 10) + 1);		// Vergibt ein Item wenn bestimmte Punkte erreicht wurden.
				}
				score = missionscore + score;
				failCounterGesamt = failCounterMission + failCounterGesamt;
				deactivateLevel(Math.floor(level / 10));
				activateLevel(Math.floor(level / 10) + 1);
				missionsiegmsg(punkte);
				failCounterMission = 0;
				missionsZeit = 0;
				scoreAnzeige();
			}
		}		
	}
	if (failCounter == maxFails) {
		failCounterGesamt = failCounterMission + failCounterGesamt;
		$("#redloose").fadeIn(850,'swing', function() {
			gameOver();
		})
	}
}

/*

	*** Derzeit ungenutzt ***

*/

function ownWord() {
/*

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