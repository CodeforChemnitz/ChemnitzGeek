from GeekManager import *

gm = GeekManager()

gm.ReadIDsFromRawFile("../data/ids_raw.spielenacht2016")
#gm.ReadNamesIDsCSVFile("../data/namesids_spielenacht2016.csv")
gm.RequestDetailsBatch(100)
gm.PrintGames()
# gm.WriteCSVFile("../data/out.csv")
gm.WriteJSONFile("../html/gameData.spielenacht2016.json")
