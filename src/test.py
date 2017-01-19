from GeekManager import *

gm = GeekManager()
gm.LoadIDsFromRawFile("../data/ids_raw")
gm.RequestDetailsBatch(100)
gm.PrintGames()
