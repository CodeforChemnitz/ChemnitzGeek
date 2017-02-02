from GeekManager import *

gm = GeekManager()
gm.ReadNamesFromRawFile("../data/names_swcz")
gm.LoadIDsFromNames()
gm.WriteNamesIDCSVFile("../data/swcz_namesid.csv")
# gm.ReadIDsFromRawFile("../data/ids_raw")
# gm.RequestDetailsBatch(100)
# gm.PrintGames()
# gm.WriteCSVFile("../data/out.csv")
# gm.WriteJSONFile("../html/gameData.json")
