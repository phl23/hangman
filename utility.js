'use strict'

var Wortsammlung = {deutsch: [],katzennamen: [], spiele: [], alk: []};
var meldungen;

$.get(
	'spiele.txt',
	function(data) {
		//Wortliste abrufen und auf Array aufteilen
		Wortsammlung.spiele = data.split('\n');
	},
	'text'
);

$.get(
	'katzennamen.txt',
	function(data) {
		//Wortliste abrufen und auf Array aufteilen
		Wortsammlung.katzennamen = data.split('\n');
	},
	'text'
);


$.get(
	'alk.txt',
	function(data) {
		//Wortliste abrufen und auf Array aufteilen
		Wortsammlung.alk = data.split('\n');
	},
	'text'
);

$.get(
	'deutsch.txt',
	function(data) {
		//Wortliste abrufen und auf Array aufteilen
		Wortsammlung.deutsch = data.split('\n');

		success: init();
	},
	'text'
);

$.getJSON('msgs.json', function(messages) {
	meldungen = messages;

	// success: stagemsg(level/10);;   /// ?????????????????????  Wofür benötigt?
});

$(window).bind('hashchange', function(event) {
	history.pushState('', document.title, window.location.pathname + window.location.search);
});

document.addEventListener('keydown', function(event) {
	if (
		document.getElementById(String.fromCharCode(event.keyCode) + 'key') &&
		document.getElementById(String.fromCharCode(event.keyCode) + 'key').disabled != true
	) {
		//Buchstabe nur eliminieren, wenn der dazugehörige Button nicht bereits disabled ist
		eliminate(String.fromCharCode(event.keyCode));
	}
});

function getWord(wortliste) {
	var randomWort;
	randomWort = Wortsammlung[wortliste][getRandomNumber(0, Wortsammlung[wortliste].length)];
	randomWort = randomWort.toUpperCase();
	return randomWort;
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function generateInputSpans() {
	var outerSpan;
	var innerSpan;
	var generatedOuterSpan;
	var generatedInnerSpan;
	var spanArray = [];

	generatedOuterSpan = document.getElementById('inputwrapper').innerHTML = ('');

	for (var i = 0; i < input.length; i++) {
		outerSpan = document.createElement("span");
		outerSpan.setAttribute("id", "input"+(i+1));
		outerSpan.setAttribute("class", "input");
		outerSpan.setAttribute("display", "none");

		innerSpan = document.createElement("span");
		innerSpan.setAttribute("id", "input"+(i+1)+"inner");
		innerSpan.setAttribute("style", "visibility:hidden");

		generatedOuterSpan = document.getElementById('inputwrapper').appendChild(outerSpan);
		generatedInnerSpan = document.getElementById('input'+(i+1)).appendChild(innerSpan);

		spanArray[(i+1)] = generatedOuterSpan;
	}
	// console.log(spanArray);		// Testzwecke
}

function inputToHangman(myInput) {
	for (var i = 1; i < (myInput.length+1); i++) {
		var input = myInput;
		var buchstabe = input.charAt(i - 1);
		var inputSpan = 'input' + i;
		if (buchstabe !== undefined) {
			//Vorhandene Buchstabenplatzhalter sichtbar machen
			if (buchstabe == '-') {
				document.getElementById(inputSpan + 'inner').textContent = '-';
				document.getElementById(inputSpan).display = 'inline-block';
				document.getElementById(inputSpan).style.visibility = 'visible';
				document.getElementById(inputSpan).style.borderBottom = 'none';
				document.getElementById(inputSpan+'inner').style.visibility = 'visible';
				winCounter++;
			}
			if (buchstabe == ' ') {
				document.getElementById(inputSpan + 'inner').textContent = 'x';
				document.getElementById(inputSpan).display = 'inline-block';
				document.getElementById(inputSpan).style.visibility = 'hidden';
				winCounter++;
			} else {
				document.getElementById(inputSpan + 'inner').textContent = buchstabe;
				document.getElementById(inputSpan).display = 'inline-block';
				document.getElementById(inputSpan).style.visibility = 'visible';
			}
		}
	}
}

/*

Variante für Anzeige auf ganzem Bildschrim Testzwecke

function tutorialmsg(id) {
	var meldungsDiv = document.getElementById('tutorialdiv');

	meldungsDiv.innerHTML = meldungen.tutorial.text[id];

	window.location.href = '#tutorialpage';
}

function stagemsg(id) {
	var meldungsDiv = document.getElementById('stagetextdiv');
	
	meldungsDiv.innerHTML = meldungen.stages["mission" + Math.floor(level / 10)][id];   // [] ersetzt die .mission1  -  muss also OHNE punkt angesetzt werden.... ^.-

	window.location.href = '#stagetextpage';
}

function siegmsg(id) {
	var meldungsDiv = document.getElementById('siegtextdiv');

	meldungsDiv.innerHTML = meldungen.sieg[id];

	window.location.href = '#siegtextpage';
}

*/

function tutorialmsg(id) {
	// console.log(meldungen); // Testzwecke
	swal.fire({
		customClass: {
			container: 'tutorialpopup',
			confirmButton: 'confirm-button-tutorial',
		},
		title: meldungen.tutorial.title[id],
		html: meldungen.tutorial.text[id],
			// imageUrl: './images/tutorial.png',
		icon: 'info',
		showCancelButton: false,
		confirmButtonText: 'Alles klar!',
	})
}

function stagemsg(MissionZahl) {
	// console.log(meldungen); // Testzwecke
	swal.fire({
		customClass: {
			container: 'stagemsgpopup',
			confirmButton: 'confirm-button-stagemsg',
		},
		title: '', // Titel wird in der HTML mitgeliefert
		html: meldungen.stages["mission" + Math.floor(level / 10)][MissionZahl % 10],
			// imageUrl: './images/tutorial.png',
		imageUrl: './images/mission' + Math.floor(level / 10) + '.png',
		showCancelButton: false,
		confirmButtonText: 'EZ PZ Lemon Squeezy!',
	});
}

function siegmsg(id) {
	// console.log(meldungen); // Testzwecke
	swal.fire({
		customClass: {
			container: 'siegmsgpopup',
			confirmButton: 'confirm-button-siegmsg',
		},
		title: 'Du hast es geschafft!',
		html: 'Sehr gut!<br>' + input + ' war richtig!<br>Missionspunkte: ' + missionscore + '<br>Gesamter Punktestand: ' + score + '<br><br>' + meldungen.sieg[id],    // ID: 0 ist der komplette Sieg
			// imageUrl: './images/siegmsg.png',
		icon: 'success',
		showCancelButton: false,
		allowOutsideClick: false,
		allowEscapeKey: true,				// Nur für Testzwecke  später nur durch confirmButton weiter
		confirmButtonText: 'Katsching! Gimme ma moneh!',
	})
	.then((result) => {
		if (result.value) {
		  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
		}
	  });
}

function MissionWahl(MissionZahl) {
	// console.log(meldungen); // Testzwecke
	swal.fire({
		customClass: {
			container: 'missionwahlpopup',
			confirmButton: 'confirm-button-map',
			cancelButton: 'cancel-button-map'
		},
		title: meldungen.location.title[MissionZahl / 10 - 0.1], // MissionZahl wird immer als 11, 21, 31 usw. übergeben, daher auf gerade Zahl kürzen.
		html: meldungen.location.text[MissionZahl / 10 - 0.1], // MissionZahl wird immer als 11, 21, 31 usw. übergeben, daher auf gerade Zahl kürzen.
		imageUrl: './images/mission' + (MissionZahl / 10 - 0.1) + '.png',  // MissionZahl wird immer als 11, 21, 31 usw. übergeben, daher auf gerade Zahl kürzen.
		showCancelButton: true,
		confirmButtonText: 'Starte Mission ' + (MissionZahl / 10 - 0.1),  // MissionZahl wird immer als 11, 21, 31 usw. übergeben, daher auf gerade Zahl kürzen.
		cancelButtonText: 'Zurück zur Karte',
		reverseButtons: true
	})
	.then((result) => {
		if (result.value) {
			init(MissionZahl);
		}
	});
}

function startTimer(zeitInSec) {
	// console.log('timer started'); // Testzwecke
	if (level % 10 == 1) {						// Checkt ob erste Stage oder spätere, bei späteren stages läuft der timer weiter
		timerLeft = zeitInSec;
	}
	verbleibendeZeit = timerLeft;
	var zeroM, zeroS;
	var x = setInterval(function() {
		if (timerStop == true) {
			clearInterval(x);
			return;
		}
		if (firstButtonPressed == true) {
			verbleibendeZeit = verbleibendeZeit - 1;
			versuchsZeit++;
		}
		var mins = Math.floor(verbleibendeZeit / 60);
		var secs = Math.floor(verbleibendeZeit % 60);
		if (secs >= 10) {
			zeroS = '';
		} else {
			zeroS = '0';
		}
		if (mins >= 10) {
			zeroM = '';
		} else {
			zeroM = '0';
		}
		document.getElementById('timer').innerHTML = zeroM + mins + ':' + zeroS + secs;
		if (verbleibendeZeit < 0) {
			clearInterval(x);
			document.getElementById('timer').innerHTML = 'GAME OVER';
			gameOver(true);
		}
	}, 1000);		// ms pro Tick des Intervalls
}

function gameOver(timerloss) {
	if (timerloss != 'true') {
		timerStop = true;	// Stoppe eventuell laufenden Timer-Loop
		Swal.fire({
			title: 'Verloren!',
			text: 'Leider verloren, die Lösung wäre ' + input + ' gewesen!',
			icon: 'error',
			showCancelButton: true,
			reverseButtons: true,
			allowOutsideClick: false,
			confirmButtonText: 'Noch einmal Versuchen',
			cancelButtonText: 'Zurück zur Karte'
		})
		.then((result) => {
			if (result.value) {
				if (stagereset == true) {		
					punktereset = false;
					startGame()			// Zurück zur selben Stage! Bei Schwierigkeitsgrad 1     // ist aber noch problematisch wegen den Punkten
				}
				else {
					level = (level - (level % 10) + 1);		// Zurück zu Stage 1! Bei Schwierigkeitsgrad 2 und 3
					punktereset = true;
					startGame()
				}
			}
			else {
				window.location.href = '#page3';	// Für Testzwecke Page3 sonst auf Map Page2 
			}
		  });
											   // Bei max Fails Zurück auf Missionsstart
											// Hier muss level - [level Modulus(10)] + 1 hin  -> z.b. wenn in level 3.2 (32) ist und man failt dann muss zurück auf level 3.1 (31)
											// d.h. level: 32 davon der modulus(10) ist 2  also Level - (level modulus(10)) = 32 - 2 = 30 dann noch + 1 auf 31
		;  									// Für Testzwecke Page3 sonst auf Map Page2    Was tun wenn maxStage erreicht?
	}
	else {
		Swal.fire({
			title: 'Zeit abgelaufen!',
			text: 'Leider hast Du zu lange gebraucht, die Lösung wäre ' + input + ' gewesen!',
			icon: 'error',
			showCancelButton: true,
			reverseButtons: true,
			allowOutsideClick: false,
			confirmButtonText: 'Noch einmal Versuchen',
			cancelButtonText: 'Zurück zur Karte'
		})
		.then((result) => {
			if (result.value) {
				if (stagereset == true) {		
					punktereset = false;
					startGame()			// Zurück zur selben Stage! Bei Schwierigkeitsgrad 1     // ist aber noch problematisch wegen den Punkten
				}
				else {
					level = (level - (level % 10) + 1);		// Zurück zu Stage 1! Bei Schwierigkeitsgrad 2 und 3
					punktereset = true;
					startGame()
				}
			}
			else {
				window.location.href = '#page3';	// Für Testzwecke Page3 sonst auf Map Page2 
			}
		  });
											   // Bei max Fails Zurück auf Missionsstart
											// Hier muss level - [level Modulus(10)] + 1 hin  -> z.b. wenn in level 3.2 (32) ist und man failt dann muss zurück auf level 3.1 (31)
											// d.h. level: 32 davon der modulus(10) ist 2  also Level - (level modulus(10)) = 32 - 2 = 30 dann noch + 1 auf 31
		;  									// Für Testzwecke Page3 sonst auf Map Page2    Was tun wenn maxStage erreicht?
	}
}

function scoreAnzeige() {		// get by Name statt Class, da der Header immer fest class von Bootstrap bekommt
	var myClasses = document.getElementsByName("scoreanzeige");

	for (var i = 0; i < myClasses.length; i++) {
  	myClasses[i].innerHTML = score + ' Gesamtpunkte';
  	}
}

function missionScoreAnzeige() {
	document.getElementById('score').innerHTML = missionscore + ' Missionspunkte';
}

/*
Greift auf das Iframe zu und ändert im "animateMotion" Element den Begin Status. (dort steht erst "begin:"indefinite")
Bei jedem Fehlversuch wird ein anderer Pfad gecallt.  
*/
function setPolizeiPosition(versuche) {
	var iframe = document.getElementById("iframegame");
	var schritt = iframe.contentWindow.document.getElementById("move" + versuche);

	/* Vorherigen Move verstecken, sofern nicht der Erste */
	if (versuche > 1) {
		var last = versuche - 1;
		var schrittverbergen = iframe.contentWindow.document.getElementById("move" + last + "hide");
		schrittverbergen.style.display = "none";
	}

	/* Diesen Move anzeigbar machen */
	var schrittzeigen = iframe.contentWindow.document.getElementById("move" + versuche + "hide");
	schrittzeigen.style.display = "flex";

	/* Diesen Move starten */
	schritt.beginElement();
}

function firstmsg() {
	// console.log(meldungen); // Testzwecke
	Swal.fire({
		customClass: {
			container: 'tutorialpopup',
			confirmButton: 'confirm-button-tutorial',
		},
		input: 'select',
		inputOptions: {
			'1': 'EasyMode',
			'2': 'Normal',
			// '3': 'Schwer'
		},
		inputPlaceholder: 'Wähle eine Schwierigkeit',
		title: meldungen.tutorial.title[0],
		html: meldungen.tutorial.text[0],
			// imageUrl: './images/firstmsg.png',
		icon: 'info',
		showCancelButton: false,
		confirmButtonText: 'Bin Bereit!',
	})
	.then((result) => {
			easymode = result.value;			// Result gibt aus: " Value {'1'} " oder 2 oder 3
			
			/*
				Hier die Schwierigkeitsgrad-Optionen einstellen
			*/

			if (easymode == 1) {
				stagereset = true;
				timerZeitInSec = 120;
				maxFails = 10;
				console.log('EasyMode Aktiviert');		// Für Testzwecke
			}
			else if (easymode == 2) {
				stagereset = false;
				timerZeitInSec = 120;
				maxFails = 10;
				console.log('Normal Aktiviert');		// Für Testzwecke
			}
			else {
				stagereset = false;		
				timerZeitInSec = 120;	// Estmal auf 120 gelassen
				maxFails = 10;		// Erstmal auf 10 gelassen, da sonst das Polizeiauto nicht stimmt!
			}
			// window.location.href = "#page3";		// Für Testzwecke hier page3, eigentlich auf Karte page2 !
	});
}

function setIp() {
	document.getElementById('ip').innerHTML =
	getRandomNumber(0, 255) +
	'.' +
	getRandomNumber(0, 255) +
	'.' +
	getRandomNumber(0, 255) +
	'.' +
	getRandomNumber(0, 255) +
	':' +
	getRandomNumber(0, 65535);
}


function backtomap() {
	swal.fire({
		customClass: {
			container: 'backtomappopup',
			confirmButton: 'confirm-button-backtomap',
			cancelButton: 'cancel-button-backtomap'
		},
		title: '',
		html: '<p>Willst du wirklich die Mission verlassen?<br><br>Dann verlierst du jeglichen Fortschritt und Punkte in dieser Mission!</p>',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Ja, das ist mir zu Heikel',
		cancelButtonText: 'Nein, hab mich nur verklickt',
		reverseButtons: false,
		allowOutsideClick: false
	})
	.then((result) => {
		if (result.value) {
			timerStop = true;
			missionscore = 0;
			level = (level - (level % 10) + 1);
			resetGame('karte');				// Löst keine Spielstartmeldung aus
			window.location.href = "#page3";		// Für Testzwecke hier page3, eigentlich auf Karte page2 !
		}
	});
}