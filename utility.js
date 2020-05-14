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

	success: meldung(level/10);;
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
	console.log(spanArray);
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

function meldung(id) {
	var meldungsDiv = document.getElementById('meldungsdiv');

	console.log(meldungen);
	meldungsDiv.innerHTML = meldungen.tutorial[id];

	window.location.href = '#meldungspage';
}



function locationAlert(locationID) {

/*
Test Code für Location anklicken auf Map
*/

	Swal.fire({
		title: meldungen.location.title[locationID],
		text: meldungen.location.text[locationID],
		icon: 'info',
		confirmButtonText: 'Los gehts!',
		showCloseButton: 'true'
	}).then(function(result) {
		if (result.value) {
			/* Hier Spiel starten (fehlt) */
			window.location.href = '#page1';
		}
	});
}

function startTimer(zeitInSec) {
	console.log('timer started');
	var verbleibendeZeit = zeitInSec;
	var zeroM, zeroS;
	var x = setInterval(function() {
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
			gameOver();
		}
		if (timerStop == true) {
			clearInterval(x);
			document.getElementById('timer').innerHTML = '';
		}
	}, 1000);
}

function gameOver() {
	Swal.fire({
		title: 'Zeit abgelaufen!',
		text: 'Leider hast Du zu lange gebraucht, die Lösung wäre ' + input + ' gewesen!',
		icon: 'error',
		confirmButtonText: 'Neues Spiel'
	});
	init();
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

/*
Alter Code

function polizeiKommtNaeher() {
	var failImg = document.getElementById('leftwrapper');
	var autoImg = document.getElementById('auto');
	var failHeight = parseInt(window.getComputedStyle(failImg, null).getPropertyValue('height'), 10);
	var failWidth = parseInt(window.getComputedStyle(failImg, null).getPropertyValue('width'), 10);
	var failInterval = (failCounter - 1) / 10;
	var y = 10;
	var x = setInterval(function() {
		autoImg.style.top = failHeight * failInterval + 'px';
		autoImg.style.left = failWidth * failInterval + 'px';

		failInterval = failInterval + 0.01;
		y = y - 1;

		if (y <= 0) {
			clearInterval(x);
		}
	}, 100);
}

function setPolizeiPosition() {
	var failImg = document.getElementById('leftwrapper');
	var autoImg = document.getElementById('auto');
	var failHeight = parseInt(window.getComputedStyle(failImg, null).getPropertyValue('height'), 10);
	var failWidth = parseInt(window.getComputedStyle(failImg, null).getPropertyValue('width'), 10);

	autoImg.style.top = failHeight * (failCounter / 10) + 'px';
	autoImg.style.left = failWidth * (failCounter / 10) + 'px';
}

*/


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
