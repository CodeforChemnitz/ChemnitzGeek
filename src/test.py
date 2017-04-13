from GeekManager import *

gm = GeekManager()

# gm.ReadNamesFromBibliothekCSVFile("../data/bibliothek.exported.csv")
# gm.ReadNamesFromRawFile("../data/swcz.names")
# gm.ReadNamesIDsCSVFile("../data/swcz.namesids.csv")
# gm.LoadIDsFromNames()
gm.ReadNamesIDsCSVFile("../data/bibliothek.namesids.csv")
gm.RequestDetailsBatch(100)
# gm.PrintGames()
# gm.WriteNamesIDsCSVFile("../data/bibliothek.namesids.csv")
gm.WriteJSONFile("../html/bibliothek.json")
