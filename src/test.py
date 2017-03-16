from GeekManager import *

gm = GeekManager()

# gm.ReadNamesFromRawFile("../data/swcz.names")
gm.ReadNamesIDsCSVFile("../data/swcz.namesids.csv")
# gm.LoadIDsFromNames()
#gm.ReadNamesIDsCSVFile("../data/namesids_spielenacht2016.csv")
gm.RequestDetailsBatch(100)
# gm.PrintGames()
# gm.WriteCSVFile("../data/out.csv")
gm.WriteJSONFile("../html/swcz.json")
