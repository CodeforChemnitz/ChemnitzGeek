from GeekManager import *

gm = GeekManager()

# gm.ReadNamesFromBibliothekCSVFile("../data/bibliothek.exported.csv")
# gm.ReadNamesIDsCSVFile("../data/swcz.namesids.csv")
#gm.ReadNamesIDsCSVFile("../data/bibliothek.namesids.csv")
#gm.RequestDetailsBatch(100)
# gm.PrintGames()
# gm.WriteNamesIDsCSVFile("../data/bibliothek.namesids.csv")
#gm.WriteJSONFile("../html/bibliothek.json")

gm.ReadNamesFromRawFile("../data/kaffeesatz.names")
gm.LoadIDsFromNames()
gm.WriteNamesIDsCSVFile("../data/kaffeesatz.namesids.csv")