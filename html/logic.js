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
  //new gameCollection("Spielenacht 2017", "Spielenacht2017", "gameData.json", "SN17", "#aaa"),
  new gameCollection("Stadtbibliothek", "Stadtbibliothek", "gameData.bibliothek.json", "Bibl", "#aaa"),
  new gameCollection("Studentenwerk", "Studentenwerk", "gameData.swcz.json", "StWe", "#363"),
  new gameCollection("Kaffeesatz", "Kaffeesatz", "gameData.kaffeesatz.json", "Kffz", "#633"),
];

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

function loadSingleCollectionGames(collection) {
  console.log("Load collection " + collection.name);
  //var currIdx = collectionIndices[0];
  return fetch(collection.url).then( (response) => {
    return response.json();
  })
  .then( (json) => {
    return new Promise( function(resolve, reject) {
      if (collection.games == null)  //TODO: move this to more appropriate place
        collection.games = jQuery.extend(true, {}, json); //Object.assign(target, json)
      //loadedCollections.push(collection);
      resolve(collection);
    })
  });
}

function reloadGames() {
  let checkedColls = []

  for (i = 0; i < collections.length; i++) {
    if (document.getElementById("check"+collections[i].camelName).checked) {
      checkedColls.push(collections[i]);
    }
  }
  promises = checkedColls.map(loadSingleCollectionGames);
  Promise.all(promises)
  .then( (loadedCollections) => {
    console.log("All promises succeeded");
    return new Promise( function(resolve, reject) {
      games = mergeCollections(loadedCollections);
      resolve(games, loadedCollections);
    }).then( () => {
      console.log("Fill table");
      fillTable(games, loadedCollections);
    });
  });
}

function mergeCollections(loadedCollections) {
  let loadedGames = []

  for (i = 0; i < loadedCollections.length; i++) {
    var games = loadedCollections[i].games;
    for (var j = 0; j < Object.keys(games).length; j++) {
      var game = games[j];
      if (!matchesQuery(game))  continue;

      addGameToLoadedGames(game, loadedGames, i);
    }
  }

  console.log(loadedGames.length + " unique games loaded");
  return loadedGames;
}

function addGameToLoadedGames(game, loadedGames, loadedCollIdx) {
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

function fillTable(loadedGames, loadedCollections) {
  var tableHTML = "";
  for (var i = 0; i < loadedGames.length; i++) {
    var game = loadedGames[i];
    tableHTML += "<tr>";
    tableHTML += "<td>" + game.localName + "</td>";
    tableHTML += "<td class='smallerFont'>" + game.rating + "</td>";
    tableHTML += "<td class='smallerFont'>" + game.minPlayers + " - " + game.maxPlayers + "</td>";
    tableHTML += "<td class='smallerFont'>" + game.minAge + "+</td>";
    tableHTML += "<td class='smallerFont'>" + game.weight + "</td>";
    tableHTML += "<td class='smallerFont'>" + game.yearPublished + "</td>";
    tableHTML += "<td class='sourceCol'>";
    tableHTML += "<span class='collsname' style='background-color: #333;'>"
      + "<a href='https://boardgamegeek.com/boardgame/" + game.bggID + "' target='_blank'>"
      + "BGG"
      + "</a>"
      + "</span>";
    for (var j = 0; j < game.loadedColls.length; j++) {
      collection = loadedCollections[game.loadedColls[j]];
      tableHTML += "<span class='collsname' style='background-color: " + collection.color + ";'>"
        + "<a href='#'>"
        + collection.shortName
        + "</a>"
        + "</span>";
    }
    tableHTML += "</td>";
    tableHTML += "</tr>";
  }
  document.getElementById("gameTableBody").innerHTML = tableHTML;
}
