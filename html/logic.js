class gameCollection {
	constructor(name, camelName, url, shortName, color) {
		this.name = name;
		this.camelName = camelName;
		this.url = url;
		this.games = null;
		this.shortName = shortName;
    this.color = color;
	}
}

var collections = [
	new gameCollection("Spielenacht 2016", "Spielenacht2016", "gameData.spielenacht2016.json", "SN16", "#336"),
	new gameCollection("Spielenacht 2017", "Spielenacht2017", "gameData.json", "SN17", "#aaa"),
	new gameCollection("Stadtbibliothek", "Stadtbibliothek", "gameData.bibliothek.json", "Bibl", "#aaa"),
	new gameCollection("Studentenwerk", "Studentenwerk", "gameData.swcz.json", "StWe", "#363"),
	new gameCollection("Kaffeesatz", "Kaffeesatz", "gameData.kaffeesatz.json", "Kffz", "#633"),
];

var loadedCollections = [];
var loadedGames = [];

function matchesQuery(game) {
	var searchWords = document.forms["searchForm"]["inputSearchWords"].value.trim().split(/\s+/);
	var numPlayers = parseInt(document.forms["searchForm"]["inputNumPlayers"].value);
	var ratingMin = parseFloat(document.forms["searchForm"]["inputRatingMin"].value);
	var ratingMax = parseFloat(document.forms["searchForm"]["inputRatingMax"].value);
	var weightMin = parseFloat(document.forms["searchForm"]["inputWeightMin"].value);
	var weightMax = parseFloat(document.forms["searchForm"]["inputWeightMax"].value);
  var age       = parseInt(document.forms["searchForm"]["inputAge"].value);
  for (var i = 0; i < searchWords.length; i++)
    if (!game.name.toLowerCase().includes(searchWords[i].toLowerCase()))
      return false;
	if (numPlayers > 0 && (numPlayers < parseInt(game.minPlayers) || numPlayers > parseInt(game.maxPlayers)))  return false;
	if (parseFloat(game.rating) < ratingMin || parseFloat(game.rating) > ratingMax)  return false;
	if (parseFloat(game.weight) < weightMin || parseFloat(game.weight) > weightMax)  return false;
  if (parseInt(game.minAge) > age)  return false;
	return true;
}

function loadSingleCollectionGames(collectionIndices) {
  var currIdx = collectionIndices[0];
  $.getJSON(collections[currIdx].url, function(json) {
    if (collections[currIdx].games == null)  //TODO: move this to more appropriate place
      collections[currIdx].games = jQuery.extend(true, {}, json);
  }).then(function(){
    loadedCollections.push(collections[currIdx]);
    collectionIndices.splice(0, 1);
    if (collectionIndices.length > 0) {
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
  loadSingleCollectionGames(collectionIndices);
}

function reloadGamesFinished() {
  loadedGames = []

  for (i = 0; i < loadedCollections.length; i++) {
    var games = loadedCollections[i].games;
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
    if (loadedGames[i].bggID == id && $.inArray(loadedCollIdx, loadedGames[i].loadedColls) == -1) {
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
  document.getElementById("gameTableBody").innerHTML = "";
  for (var i = 0; i < loadedGames.length; i++) {
    var rowHTML = "";
    var game = loadedGames[i];
    rowHTML += "<tr>";
    rowHTML += "<td>" + game.name + "</td>";
    rowHTML += "<td class='smallerFont'>" + game.rating + "</td>";
    rowHTML += "<td class='smallerFont'>" + game.minPlayers + " - " + game.maxPlayers + "</td>";
    rowHTML += "<td class='smallerFont'>" + game.minAge + "+</td>";
    rowHTML += "<td class='smallerFont'>" + game.weight + "</td>";
    rowHTML += "<td class='smallerFont'>" + game.yearPublished + "</td>";
    rowHTML += "<td class='sourceCol'>";
    rowHTML += "<span class='collsname' style='background-color: #333;'>"
      + "<a href='https://boardgamegeek.com/boardgame/" + game.bggID + "' target='_blank'>"
      + "BGG"
      + "</a>"
      + "</span>";
    for (var j = 0; j < game.loadedColls.length; j++) {
      collection = loadedCollections[game.loadedColls[j]];
      rowHTML += "<span class='collsname' style='background-color: " + collection.color + ";'>"
        + "<a href='#'>"
        + collection.shortName
        + "</a>"
        + "</span>";
    }
    rowHTML += "</td>";
    rowHTML += "</tr>";
    document.getElementById("gameTableBody").innerHTML += rowHTML;
  }
}
