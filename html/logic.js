class gameCollection {
	constructor(name, camelName, url, shortName) {
		this.name = name;
		this.camelName = camelName;
		this.url = url;
		this.games = null;
		this.shortName = shortName;
	}
}

var collections = [
	new gameCollection("Spielenacht 2016", "Spielenacht2016", "gameData.spielenacht2016.json", "S16"),
	new gameCollection("Spielenacht 2017", "Spielenacht2017", "gameData.json", "S17"),
	new gameCollection("Stadtbibliothek", "Stadtbibliothek", "gameData.json", "Biblo"),
	new gameCollection("Studentenwerk", "Studentenwerk", "gameData.json", "StuWe"),
	new gameCollection("Kaffeesatz", "Kaffeesatz", "gameData.kaffeesatz.json", "Kffz"),
];

var loadedCollections = [];
var loadedGames = [];

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

function loadSingleCollectionGames(collectionIndices) {
  var currIdx = collectionIndices[0];
  console.log("load " + collections[currIdx].url);
  $.getJSON(collections[currIdx].url, function(json) {
    console.log(currIdx);
    if (collections[currIdx].games == null)  //TODO: move this to more appropriate place
      collections[currIdx].games = jQuery.extend(true, {}, json);
  }).then(function(){
    loadedCollections.push(collections[currIdx]);
    collectionIndices.splice(0, 1);
    if (collectionIndices.length > 0) {
      console.log("request " + collectionIndices);
      loadSingleCollectionGames(collectionIndices);
    }
    else {
      reloadGamesFinished();
    }
  });
}
function reloadGames() {
  loadedCollections = [];
	var collectionIndices = [];
	for (i = 0; i < collections.length; i++) {
		if (document.getElementById("check"+collections[i].camelName).checked) {
			collectionIndices.push(i);
		}
	}
  console.log(collectionIndices);
  loadSingleCollectionGames(collectionIndices);
}

function reloadGamesFinished() {
  document.getElementById("gameTableBody").innerHTML = "";
  loadedGames = []

  for (i = 0; i < loadedCollections.length; i++) {
    var games = loadedCollections[i].games;
    console.log(games);
    console.log(Object.keys(games).length);
    for (var j = 0; j < Object.keys(games).length; j++) {
      var game = games[j];
      if (!matchesQuery(game))  continue;
      
      addGameToLoadedGames(game, i);
    }
  }

  console.log(loadedGames.length + " unique games loaded");
  fillTable();
}

function addGameToLoadedGames(game, loadedCollIdx) {
  var id = game.bggID;
  var idExists = false;
  for (var i = 0; i < loadedGames.length; i++) {
    if (loadedGames[i].bggID == id) {
      loadedGames[i].loadedColls.push(loadedCollIdx);
      idExists = true;
      break;
    }
  }
  if (! idExists) {
    game.loadedColls = [loadedCollIdx];
    loadedGames.push(game);
  }
}

function fillTable() {
  for (var i = 0; i < loadedGames.length; i++) {
    var rowHTML = "";
    var game = loadedGames[i];
    rowHTML += "<tr>";
    rowHTML += "<td>" + game.name + "</td>";
    rowHTML += "<td>" + game.rating + "</td>";
    rowHTML += "<td>" + game.minPlayers + " - " + game.maxPlayers + "</td>";
    rowHTML += "<td>" + game.minAge + "+</td>";
    rowHTML += "<td>" + game.weight + "</td>";
    rowHTML += "<td>" + game.yearPublished + "</td>";
    rowHTML += "<td class='sourceCol'>";
    for (var j = 0; j < game.loadedColls.length; j++) {
      rowHTML += "<span class='collsname'>" + loadedCollections[game.loadedColls[i]] + "</span>";
    }
    rowHTML += "</td>";
    rowHTML += "</tr>";
    document.getElementById("gameTableBody").innerHTML += rowHTML;
  }
}
