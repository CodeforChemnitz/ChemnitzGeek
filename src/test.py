from GeekManager import *

gm = GeekManager()

gm.ReadNamesIDsCSVFile("../data/namesids_kaffeesatz.csv")
gm.RequestDetailsBatch(100)
gm.PrintGames()
# gm.WriteCSVFile("../data/out.csv")
gm.WriteJSONFile("../html/gameData.kaffeesatz.json")
