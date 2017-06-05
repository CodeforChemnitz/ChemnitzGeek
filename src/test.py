from GeekManager import *

gm = GeekManager()

dataset = "tuermer"

# gm.ReadNamesFromBibliothekCSVFile("../data/bibliothek.exported.csv")
# gm.ReadNamesIDsCSVFile("../data/swcz.namesids.csv")
#gm.ReadNamesIDsCSVFile("../data/bibliothek.namesids.csv")
#gm.RequestDetailsBatch(100)
# gm.PrintGames()
# gm.WriteNamesIDsCSVFile("../data/bibliothek.namesids.csv")
#gm.WriteJSONFile("../html/bibliothek.json")

# gm.ReadNamesFromRawFile("../data/" + dataset + ".names")
# gm.LoadIDsFromNames()
# gm.WriteNamesIDsCSVFile("../data/" + dataset + ".namesids.csv")

#gm.ReadIDsFromRawFile("../data/" + dataset + ".ids")
gm.ReadNamesIDsCSVFile("../data/" + dataset + ".namesids.csv")
gm.RequestDetailsBatch(100)
gm.WriteJSONFile("../html/gameData." + dataset + ".json")

#gm.ReadNamesFromRawFile("../data/" + dataset + ".names")
#gm.LoadIDsFromNames()
#gm.WriteNamesIDsCSVFile("../data/" + dataset + ".namesids.csv")