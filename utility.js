var Wortsammlung;

$.get('deutsch.txt', function (data) { //Wortliste abrufen und auf Array aufteilen
    Wortsammlung = data.split("\n");

    success: startGame();
}, "text");

function getWord() {
    var randomWort;
    randomWort = Wortsammlung[getRandomNumber(0, Wortsammlung.length)];
    randomWort = randomWort.toUpperCase();
    return randomWort;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}