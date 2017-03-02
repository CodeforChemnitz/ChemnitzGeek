class gameCollection {
	constructor(name, camelName, url) {
		this.name = name;
		this.camelName = camelName;
		this.url = url;
		this.games = null;
	}
}

var collections = [
	new gameCollection("Spielenacht 2016", "Spielenacht2016", "gameData.json"),
	new gameCollection("Spielenacht 2017", "Spielenacht2017", "gameData.json"),
	new gameCollection("Stadtbibliothek", "Stadtbibliothek", "gameData.json"),
	new gameCollection("Studentenwerk", "Studentenwerk", "gameData.json"),
	new gameCollection("Kaffeesatz", "Kaffeesatz", "gameData.kaffeesatz.json"),
];

function matchesQuery(game) {
	var numPlayers = parseInt(document.forms["searchForm"]["inputNumPlayers"].value);

	var ratingMin = parseFloat(document.forms["searchForm"]["inputRatingMin"].value);
	var ratingMax = parseFloat(document.forms["searchForm"]["inputRatingMax"].value);
	var weightMin = parseFloat(document.forms["searchForm"]["inputWeightMin"].value);
	var weightMax = parseFloat(document.forms["searchForm"]["inputWeightMax"].value);
	if (numPlayers > 0 && (numPlayers < parseInt(game.minPlayers) || numPlayers > parseInt(game.maxPlayers)))  return false;
	if (parseFloat(game.rating) < ratingMin || parseFloat(game.rating) > ratingMax)  return false;
	if (parseFloat(game.weight) < weightMin || parseFloat(game.weight) > weightMax)  return false;
	return true;
}

function reloadGames() {
	for (i = 0; i < collections.length; i++) {
		if (! document.getElementById("check"+collections[i].camelName).checked) {
			continue;
		}

		console.log(collections[i].name);
		if (collections[i].games == null) {
			console.log("its null, requesting " + collections[i].url);
			$.getJSON(collections[i].url, function(json) {
				console.log("not for long");
				collections[i].games = "asdf";//jQuery.extend(true, {}, json);
				console.log(collections[i].games);
			});
		}
		console.log(collections[i].games);
		//TODO: games is not defined in this scope! wtf
		document.getElementById("gameTableBody").innerHTML = "";
		games = collections[i].games;
		for (var j = 0; j < games.length; j++) {
			var game = games[j];
			if (!matchesQuery(game))  continue;

			var rowHTML = "";
			rowHTML += "<tr>";
			rowHTML += "<td>" + game.name + "</td>";
			rowHTML += "<td>" + game.rating + "</td>";
			rowHTML += "<td>" + game.minPlayers + " - " + game.maxPlayers + "</td>";
			rowHTML += "<td>" + game.minAge + "+</td>";
			rowHTML += "<td>" + game.weight + "</td>";
			rowHTML += "<td>" + game.yearPublished + "</td>";
			rowHTML += "</tr>";
			document.getElementById("gameTableBody").innerHTML += rowHTML;
		}
	}
}
