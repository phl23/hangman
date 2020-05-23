'use strict'

/* Start: Wortsammlungen */

	var Wortsammlung = {deutsch: [],katzennamen: [], spiele: [], alk: [], newlist: []};
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

	$.get(
		'newlist.txt',
		function(data) {
			//Wortliste abrufen und auf Array aufteilen
			Wortsammlung.newlist = data.split('\n');

			success: init();
		},
		'text'
	);

	$.getJSON('msgs.json', function(messages) {
		meldungen = messages;
		// success: stagemsg(level/10);;   /// ?????????????????????  Wofür benötigt?  - Noch von Gregor -
	});

/* Ende: Wortsammlungen */


/* Start: Tools */

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

	function getRandomNumber(min, max, ex1) {
		var num = Math.floor(Math.random() * (max - min) + min);
		return (num === ex1) ? generateRandom(min, max) : num;
	}

/* Ende: Tools */


/* Start: Leuchteffekte */

	function flashTerminalGreen(id) {
		$('#greenflashterminal' + (id+1)).fadeIn(0,'linear').fadeOut(400,'swing');
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

	function setMap(missionnr) {
		document.getElementById('iframegame').src = './map-game' + missionnr + '.html';
	}

	function greenFlashInit() {
		var keysarray = keys.length;
		var i = 0;
		while (i != keysarray) {
			var key = keys[i];

			// Div erstellen um danach den Style einzubinden
			document.getElementById(key + 'key').parentElement.innerHTML += '<div id="greenflash' + key + '"></div>';

			var divflash = document.getElementById('greenflash' + key);
			divflash.style.cssText = 
			'background: radial-gradient(ellipse farthest-side, rgba(33, 255, 25, 0.514) 50%, rgba(0, 0, 0, 0) 170%);display: none;width: 100%;height: 100%;position: absolute;top: 0px;right: 0px;z-index: 10;';
			i++;
		}
	}

	function flashKeyGreen(key) {
		$('#greenflash' + key).fadeIn(0,'linear').fadeOut(400,'swing');
	}

	function redFlashInit() {
		var keysarray = keys.length;
		var i = 0;
		while (i != keysarray) {
			var key = keys[i];
			
			// Div erstellen um danach den Style einzubinden
			document.getElementById(key + 'key').parentElement.innerHTML += '<div id="redflash' + key + '"></div>';

			var divflash = document.getElementById('redflash' + key);
			divflash.style.cssText = 
			'background: radial-gradient(ellipse farthest-side, rgba(255, 35, 35, 0.514) 50%, rgba(0, 0, 0, 0) 170%);display: none;width: 100%;height: 100%;position: absolute;top: 0px;right: 0px;z-index: 10;';
			i++;
		}
	}

	function flashKeyRed(key) {
		$('#redflash' + key).fadeIn(0,'linear').fadeOut(400,'swing');
	}

/* Ende: Leuchteffekte */


/* Start: Item Management */

	function helpBuchstaben(anzahl) {
		var i = 0;
		var h = 0;
		var spaces = 0;

		for (var z = 1; z < input.length+1;z++) {											// Zählt die Leerzeichen (value x)
			var span = document.getElementById('input' + (z) + 'inner');
			if (span.innerHTML == 'x') {
				spaces++;
			}
		}
			
		while (i < anzahl && h < input.length+1-spaces) {			// Nur so oft wie die Wortlänge ohne Leerzeichen + off by one
			var rand = getRandomNumber(1,input.length+1);	// Irgendeine nummer zwischen oder genau 0 und maximale länge des wortes + 1 (da immer +1 gemacht wurde)
			var targetSpan = document.getElementById('input' + (rand) + 'inner');
			if ((targetSpan.style.visibility != 'visible') && (targetSpan.innerHTML != 'x')) {			// Keine schon aufgedeckten Buchstaben und auch keine Leerzeichen (Wert x)
				targetSpan.style.visibility = 'visible';
				i++;
				winCounter++;
				flashTerminalGreen(rand-1);
				/*	Fehlt noch, dass das nur passiert, wenn dieser Buchstabe nicht noch einmal vorkommt!  Testzwecke
				var buchstabe = targetSpan.innerHTML;
				document.getElementById(buchstabe + 'key').disabled = true;
				*/
			}
			else {
				h++;
			}
		}
		checkWin();
	}

	function checkForItem(itemId) {
		var index = items.indexOf(itemId);
		var exists = 0;
		if (index > -1) {
			exists = 1;
		}
		return exists;		// In der Meldung dann mit If checkForItem() == 0 dann zeige Item bekommen oder wähle ein anderes
	}

	function getItem(itemId) {
		if (checkForItem(itemId) == 0) {		// checkForItem returns 0 wenn es nicht existiert  ---  kann weggelassen werden, falls diese function nur feuert wenn das schon geprüft wurde
			items.push(itemId);
			itemsAnzeige();
		}
	}

	function useItem(itemId) {
		var index = items.indexOf(itemId); // Wenn es nicht existiert wird -1 ausgegeben ansonsten die Position im array
		var stärke = 0;		// Bestimmt die Anzahl der gezeigten Buchstaben (wird durch Gegenstand bestimmt)

		if (index > -1) {
				// Iwie sowas..... var missionId = meldung.items.search(itemId).parentNode;
				// var stärke = meldungen.items[missionId].stärke[0];			// Holt sich den StärkeWert aus der json je nach ItemName

				if (itemId == meldungen.items.item1.name[0]) {
					stärke = meldungen.items.item1.stärke[0];
				}
				if (itemId == meldungen.items.item2.name[0]) {
					stärke = meldungen.items.item2.stärke[0];
				}
				if (itemId == meldungen.items.item3.name[0]) {
					stärke = meldungen.items.item3.stärke[0];
				}
				helpBuchstaben(stärke);	
				items.splice(index, 1);   // Muss noch erst das Item suchen und dann splicen!
				itemsAnzeige();
		}
	}

	function rewardItem(missionnr) {
		getItem(meldungen.items['item' + missionnr].name[0]);
	}

/* Ende: Item Management */


/* Start: Anzeigen */

	function scoreAnzeige() {		// get by Name statt Class, da der Header immer feste class von Bootstrap bekommt
		var myClasses = document.getElementsByName("scoreanzeige");

		for (var i = 0; i < myClasses.length; i++) {
			myClasses[i].innerHTML = score + ' Gesamtpunkte  //  ' + failCounterGesamt + ' Fehler // Items: ' + items;
		}
	}

	function failAnzeige() {
		document.getElementById('fails').innerHTML = 'Fehler: ' + failCounter;
	}

	function missionScoreAnzeige() {
		document.getElementById('score').innerHTML = missionscore + ' Missionspunkte';
	}

	function itemsAnzeige() {
		document.getElementById('items').innerHTML = 'Items: ' + items;
	}

	function levelAnzeige() {
		document.getElementById('level').innerHTML = 'Level: ' + level / 10;
	}

/* Ende: Anzeigen */


/* Start: Eingabe, Worterstellung und Gamemechanik */

	function getWord(wortliste) {
		var randomWort;
		randomWort = Wortsammlung[wortliste][getRandomNumber(0, Wortsammlung[wortliste].length)];
		randomWort = randomWort.toUpperCase();
		return randomWort;
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

			// Hier wird das DIV für den grünen Flasheffekt erstellt, dieses wird in der Function flashTerminalGreen() ausgelöst
			outerSpan.style.cssText = 'position: relative;'; // Nötig, damit das Child-Element nur so groß wie dieses wird
			document.getElementById('input' + (i+1)).innerHTML += '<div id="greenflashterminal' + (i+1) + '"></div>';
			var divflash = document.getElementById('greenflashterminal' + (i+1));
			divflash.style.cssText = 
			'background: radial-gradient(ellipse farthest-side, rgba(33, 255, 25, 0.514) 50%, rgba(0, 0, 0, 0) 110%);display: none;width: 150%;height: 150%;position: absolute;top: -2px;right: -2px;z-index: 10;';

			spanArray[(i+1)] = generatedOuterSpan;
		}
		if (consoleOutput == true) {
			console.log(spanArray);		// Testzwecke
		}
	}

	function setIp() {
		var ip = 
			getRandomNumber(0, 255) +
			'.' +
			getRandomNumber(0, 255) +
			'.' +
			getRandomNumber(0, 255) +
			'.' +
			getRandomNumber(0, 255);
		var ipport = ip  + ':' +
		// getRandomNumber(0, 65535);
		22;
		document.getElementById("ip1st").innerHTML = ipport;
		document.getElementById("ip2nd").innerHTML = ip;
	}

	function startTimer(zeitInSec) {
		if (consoleOutput == true) {
			console.log('timer started'); // Testzwecke
		} 
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
			document.getElementById('timer').innerHTML = 'Zeit: ' + zeroM + mins + ':' + zeroS + secs;
			if (verbleibendeZeit < 0) {
				clearInterval(x);
				document.getElementById('timer').innerHTML = 'GAME OVER';
				gameOver(true);
			}
		}, 1000);		// ms pro Tick des Intervalls
	}

	function setPolizeiPosition(versuche) {
		/*
		Greift auf das Iframe zu und ändert im "animateMotion" Element den Begin Status. (dort steht erst "begin:"indefinite")
		Bei jedem Fehlversuch wird ein anderer Pfad gecallt.  
		*/
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

		/* Flash Effekt */

		$("#redflash").fadeIn(150,'swing').fadeOut(250,'swing').fadeIn(150,'swing').fadeOut(250,'swing');
		$("#blueflash").fadeIn(250,'swing').fadeOut(150,'swing').fadeIn(250,'swing').fadeOut(150,'swing');
		
		/*	Nacheinander? 
		$("#redflash").fadeIn(850,'swing').fadeOut(850,'swing', function() {
			$("#blueflash").fadeIn(850,'swing').fadeOut(850,'swing', function() {
				$("#redflash").fadeIn(850,'swing').fadeOut(850,'swing', function() {
					$("#blueflash").fadeIn(850,'swing').fadeOut(850,'swing');
				})
			})
		})
		*/
		
	}

	function deactivateLevel(which) {
		if (which == 'all') {		// Alle Level per function-loop
			$(function(){
				$("button.missionbtn").attr("disabled", true);
			  });
		}
		else if (which <= maxLevel && which > 0) {		// Das übergebene Level
			$("button#missionbtn" + which).attr("disabled", true);
		}
	}

	function activateLevel(which) {
		if (which == 'all') {		// Alle Level per function-loop
			$(function(){
				$("button.missionbtn").attr("disabled", false);
			  });
		}
		else if (which <= maxLevel && which > 0) {		// Das übergebene Level
			$("button#missionbtn" + which).attr("disabled", false);
		}
	}

/* Ende: Eingabe, Worterstellung und Gamemechanik */

/* Start: Messages */

	/* Start: Button Messages */

	function inventar() {
		var htmlitem1 = [];
		var htmlitem2 = [];
		var htmlitem3 = [];

		var fstItem = items.includes(meldungen.items.item1.name[0]);	// Checken ob Item vorhanden
		var sndItem = items.includes(meldungen.items.item2.name[0]);
		var trdItem = items.includes(meldungen.items.item3.name[0]);

		if (fstItem == true) {		// Texte fürs Inventar, wenn gegenstand vorhanden
			htmlitem1 = '<h2>' + meldungen.items.item1.title[0] + ': </h2><p>' + meldungen.items.item1.text[0] + '<br>Stärke: ' +  meldungen.items.item1.stärke[0] + '</p>';
		}
		if (sndItem == true) {
			htmlitem2 = '<h2>' + meldungen.items.item2.title[0] + ': </h2><p>' + meldungen.items.item2.text[0] + '<br>Stärke: ' +  meldungen.items.item2.stärke[0] + '</p>';
		}
		if (trdItem == true) {
			htmlitem3 = '<h2>' + meldungen.items.item3.title[0] + ': </h2><p>' + meldungen.items.item3.text[0] + '<br>Stärke: ' +  meldungen.items.item3.stärke[0] + '</p>';
		}

		Swal.fire({		// Inventar Popup
			customClass: {
				container: 'inventarpopup',
				confirmButton: 'confirm-button-inventar',
				input: 'inventar-input',
			},
			input: 'select',
			inputValue: '1',
			inputOptions: {
				'Baum': 'Baum',
				'Eiche': 'Eiche',
				'Löffel': 'Löffel',
			},
			inputPlaceholder: 'Gegenstand',
			// title: 'Inventar',
			html: htmlitem1 + htmlitem2 + htmlitem3,
				// imageUrl: './images/firstmsg.png',
			// icon: 'info',
			showCancelButton: true,
			animation: false,
			grow: false,
			confirmButtonText: 'Benutzen',
			cancelButtonText: 'Zurück',
			reverseButtons: true,
		})
		.then((result) => {
			useItem(result.value);
		});

		/* Ab hier Verstecken nicht vorhandener Items */
		
		var selectcontainer = document.querySelector(".inventar-input");
		if (fstItem == false) {
			var match = selectcontainer.querySelectorAll("option[value='Baum']");
			match[0].style.display = 'none';
			
		}
		if (sndItem == false) {
			var match = selectcontainer.querySelectorAll("option[value='Eiche']");
			match[0].style.display = 'none';
		}
		if (trdItem == false) {
			var match = selectcontainer.querySelectorAll("option[value='Löffel']");
			match[0].style.display = 'none';
		}
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
			animation: false,
			grow: false,
			allowOutsideClick: false
		})
		.then((result) => {
			if (result.value) {
				timerStop = true;
				missionscore = 0;
				failCounterGesamt = failCounterMission + failCounterGesamt;			// Übernimmt die Fehler in die Gesamtwertung auch bei Abbruch! Soll das? Wegen Highscore?
				failCounterMission = 0;
				versuchsZeit = 0;
				missionsZeit = 0;
				scoreAnzeige();
				resetGame();
				$.mobile.changePage("#page1",{transition:"slidedown"});
			}
		});
	}

	function MissionWahl(MissionZahl) {
		if (consoleOutput == true) {
			console.log(meldungen); // Testzwecke
		} 
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
			grow: false,
			animation: true,
			reverseButtons: true
		})
		.then((result) => {
			if (result.value) {
				init(MissionZahl);
			}
		});
	}

	function diffimsg() {
		Swal.fire({
			customClass: {
				container: 'diffimsgpopup',
				confirmButton: 'confirm-button-diffimsg',
			},
			input: 'select',
			inputValue: '2',
			inputOptions: {
				'1': meldungen.schwierigkeit.grad[1],
				'2': meldungen.schwierigkeit.grad[2],
				// '3': meldungen.schwierigkeit.grad[3],
			},
			// inputPlaceholder: meldungen.schwierigkeit.placeholder[0],
			title: meldungen.schwierigkeit.title[0],
			html: meldungen.schwierigkeit.text[0],
				// imageUrl: './images/firstmsg.png',
			// icon: 'info',
			showCancelButton: false,
			animation: false,
			grow: false,
			confirmButtonText: 'Bin Bereit!',
		})
		.then((result) => {
				easymode = result.value;			// Result gibt aus: " Value {'1'} " oder " Value {'2'} " oder " Value {'3'} "
				
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
		});
	}

	function tutorialmsg() {
		if (consoleOutput == true) {
			console.log(meldungen); // Testzwecke
		}
		Swal.fire({
			customClass: {
				container: 'tutorilmsgpopup',
				confirmButton: 'confirm-button-tutorialmsg',
			},
			title: meldungen.tutorial.title[0],
			html: meldungen.tutorial.text[0],
				// imageUrl: './images/tutorialmsg.png',
			icon: 'info',
			showCancelButton: false,
			animation: false,
			grow: false,
			confirmButtonText: meldungen.tutorial.confirm[0],
		});
	}

/* Ende: Button Messages */

/* Start: Automatische Messages */

	function willkommenmsg() {
		Swal.fire({
			customClass: {
				container: 'willkommenmsgpopup',
				confirmButton: 'confirm-button-willkommenmsg',
			},
			title: meldungen.willkommen.title[0],
			html: meldungen.willkommen.text[0],
				// imageUrl: './images/willkommenmsg.png',
			icon: 'info',
			showCancelButton: false,
			animation: false,
			grow: 'fullscreen',
			allowOutsideClick: false,
			confirmButtonText: meldungen.willkommen.confirm[0],
		});
	}

	function stagemsg(MissionZahl) {
		var zeroM, zeroS;		// Fix damit die Zeit schon bei der Stagemsg angezeigt wird
		var mins = Math.floor(timerLeft / 60);
		var secs = Math.floor(timerLeft % 60);
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
		document.getElementById('timer').innerHTML = 'Zeit: ' + zeroM + mins + ':' + zeroS + secs;
		failAnzeige();		// Fix damit die Fehler schon bei der Stagemsg auf 0 angezeigt werden
		// Stagemsg
		swal.fire({
			customClass: {
				container: 'stagemsgpopup',
				confirmButton: 'confirm-button-stagemsg',
			},
			title: '', // Titel wird in der HTML mitgeliefert
			html: meldungen.stages["mission" + Math.floor(level / 10)][MissionZahl % 10],
			imageUrl: './images/mission' + Math.floor(level / 10) + '.png',
			showCancelButton: false,
			animation: false,
			grow: false,
			confirmButtonText: meldungen.stages.confirm[0],
		});
	}

	function stagesiegmsg(punkte) {
		Swal.fire({
			title: 'Richtig!',
			html: input + ' war richtig.<br>Du hast ' + punkte + ' Punkte erreicht!<br>(' + timerZeitInSec + ' - gebrauchte Sekunden [' + versuchsZeit + '] ) x ( ' + maxFails + ' - Fehleranzahl [' + failCounter + '] )',
			icon: 'success',
			confirmButtonText: 'Weiter',
			animation: true,
			grow: false,
			allowOutsideClick: false
		})
		.then((result) => {
			if (result.value) {
				level = level + 1;
				stagemsg(level % 10);			// Ohne Dezimal Zahl weitergeben
				levelAnzeige();
				startGame();
				// localStorage.setItem('savedLevel', level);  // zu Testzwecke deaktiviert
				// localStorage.setItem('savedScore', score);  // zu Testzwecke deaktiviert
			}
		});
	}

	function missionsiegmsg(punkte) {
		$("#greenwin").fadeIn(850,'swing', function() {
			Swal.fire({
				title: 'Mission ' + Math.floor(level/10) + ' gemeistert!',
				html: 'Sehr gut!<br>' + input + ' war richtig!<br>Stagepunkte: ' + punkte + '<br>Missionspunkte: ' + missionscore + '<br>Gesamter Punktestand: ' + score + '<br><br>' + meldungen.sieg[Math.floor(level/10)],
				// icon: 'success',
				imageUrl: './images/giphy.gif',			// Für Testzwecke
				confirmButtonText: 'Weiter',
				animation: true,
				grow: false,
				allowOutsideClick: false
			})
			.then((result) => {
				if (result.value) {
					$.mobile.changePage("#page1",{transition:"slidedown"}); 
				}
			});
		})
	}

	function siegmsg(id) {
		if (consoleOutput == true) {
			console.log(meldungen); // Testzwecke
		}
		swal.fire({
			customClass: {
				container: 'siegmsgpopup',
				confirmButton: 'confirm-button-siegmsg',
			},
			title: 'Du hast es geschafft!',
			html: 'Sehr gut!<br>' + input + ' war richtig!<br>Missionspunkte: ' + missionscore + '<br>Gesamter Punktestand: ' + score + '<br>Gesamte Fehler: ' + failCounterGesamt + '<br><br>' + meldungen.sieg[id],    // ID: 0 ist der komplette Sieg
				// imageUrl: './images/siegmsg.png',
			icon: 'success',
			showCancelButton: false,
			allowOutsideClick: false,
			animation: true,
			grow: false,
			allowEscapeKey: true,				// Nur für Testzwecke  später nur durch confirmButton weiter
			confirmButtonText: 'Katsching! Gimme ma moneh!',
		})
		.then((result) => {
			if (result.value) {
			window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
			}
		});
	}

	function gameOver(timerloss) {
		if (timerloss == true) {
			
			Swal.fire({
				title: 'Zeit abgelaufen!',
				text: 'Leider hast Du zu lange gebraucht, die Lösung wäre ' + input + ' gewesen!',
				// icon: 'error',
				imageUrl: './images/fail.webp',				// Für Testzwecke
				showCancelButton: true,
				reverseButtons: true,
				allowOutsideClick: false,
				confirmButtonText: 'Noch einmal Versuchen',
				cancelButtonText: 'Zurück zur Karte'
			})
			.then((result) => {
				if (result.value) {
					if (stagereset == true) {		 // stagereset wird durch den Schwierigkeitsgrad bestimmt
						punktereset = false;
						startGame()			// Zurück zur selben Stage! Bei Schwierigkeitsgrad 1
					}
					else {
						level = (level - (level % 10) + 1);		// Zurück zu Stage 1! Bei Schwierigkeitsgrad 2 und 3
						punktereset = true;
						startGame()
					}
				}
				else {
					scoreAnzeige();
					failCounterMission = 0;
					$.mobile.changePage("#page1",{transition:"slidedown"});
				}
			});
												// Bei max Fails Zurück auf Missionsstart
												// Hier muss level - [level Modulus(10)] + 1 hin  -> z.b. wenn in level 3.2 (32) ist und man failt dann muss zurück auf level 3.1 (31)
												// d.h. level: 32 davon der modulus(10) ist 2  also Level - (level modulus(10)) = 32 - 2 = 30 dann noch + 1 auf 31
			;		  									
		}
		else {
			timerStop = true;	// Stoppe eventuell laufenden Timer-Loop
			Swal.fire({
				title: 'Zu viele Fehler!',
				text: 'Leider verloren, die Lösung wäre ' + input + ' gewesen!',
				// icon: 'error',
				imageUrl: './images/fail.webp',			// Für Testzwecke
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
						startGame()			// Zurück zur selben Stage! Bei Schwierigkeitsgrad 1
					}
					else {
						level = (level - (level % 10) + 1);		// Zurück zu Stage 1! Bei Schwierigkeitsgrad 2 und 3
						punktereset = true;
						startGame()
					}
				}
				else {
					scoreAnzeige();
					failCounterMission = 0;
					$.mobile.changePage("#page1",{transition:"slidedown"});	
				}
			});
												// Bei max Fails Zurück auf Missionsstart
												// Hier muss level - [level Modulus(10)] + 1 hin  -> z.b. wenn in level 3.2 (32) ist und man failt dann muss zurück auf level 3.1 (31)
												// d.h. level: 32 davon der modulus(10) ist 2  also Level - (level modulus(10)) = 32 - 2 = 30 dann noch + 1 auf 31
			;  									
		}
	}

/* Ende: Automatische Messages */

/* Ende: Messages */


/* Start: DevTools */

function toggleStageWahl() {
	if ($("button.devlevelbtn").css("display") == "none") {
		$(function(){
			$("button.devlevelbtn").show();
		});
	}
	else {
		$(function(){
			$("button.devlevelbtn").hide();
		  });
	}	
}

function toggleConsoleOutputs() {
	if (consoleOutput == false)  {
		consoleOutput = true;
	}
	else {
		consoleOutput = false;
	}
}

function devTools() {
	Swal.fire({
		customClass: {
			container: 'devtoolspopup',
			confirmButton: 'confirm-button-devtools',
		},
		input: 'select',
		inputValue: '1',
		inputOptions: {
			'1': 'Toggle Stage Wahl',
			'2': 'Console Outputs',
			// '3': meldungen.schwierigkeit.grad[3],
		},
		inputPlaceholder: 'Game Version: Alpha',
		title: 'Dev Tools',
		html: '',
			// imageUrl: './images/firstmsg.png',
		icon: 'info',
		showCancelButton: true,
		animation: false,
		grow: false,
		confirmButtonText: 'Do!',
		cancelButtonText: 'Cancel',
		reverseButtons: true,
	})
	.then((result) => {
		if (result.value == 1) {
			toggleStageWahl();
		}
		if (result.value == 2) {
			toggleConsoleOutputs();
		}
	});
}

/* Ende: DevTools */


/* Noch unbenutzt */

	function regelnmsg(id) {
	if (consoleOutput == true) {
		console.log(meldungen); // Testzwecke
	}
	swal.fire({
		customClass: {
			container: 'itemspopup',
			confirmButton: 'confirm-button-items',
		},
		title: meldungen.regeln.title[id],
		html: meldungen.regeln.text[id],
			// imageUrl: './images/regeln.png',
		icon: 'info',
		showCancelButton: false,
		animation: false,
		grow: false,
		confirmButtonText: meldungen.regeln.confirm[0],
	})
	}