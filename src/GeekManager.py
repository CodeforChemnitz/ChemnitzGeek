# from Game import *
import sys
import urllib.request
from xml.etree import ElementTree as ET


class GeekManager:
    nameList = []  # May contain duplicates
    idList = []    # Unique IDs
    gameList = []  # Unique games with details

    def ReadNamesFromRawFile(self, fPath):
        fIn = open(fPath, 'r')
        for line in fIn:
            name = line.strip()
            self.nameList.append(name)
        print(str(len(self.nameList)) + " names in list")

    def ReadIDsFromRawFile(self, fPath):
        fIn = open(fPath, 'r')
        for line in fIn:
            i = line.strip()
            if not i in self.idList:
                self.idList.append(i)
        print(str(len(self.idList)) + " ids in list")

    def RequestDetailsBatch(self, batchSize):
        for b in self.Batch(self.idList, batchSize):
            ids = ",".join([x for x in b if int(x) >= 0])
            self.LoadBGGData(ids)

    def LoadBGGData(self, ids):
        ratings = []
        try:
            url = "https://boardgamegeek.com/xmlapi2/thing?stats=1&id=" + ids
            print(url)
            response = urllib.request.urlopen(url)
            root = ET.parse(response).getroot()
            for item in root.findall('item'):
                game = {}
                game['name'] = item.find("name[@type='primary']").attrib['value']
                game['yearPublished'] = item.find('yearpublished').attrib['value']
                game['minAge'] = item.find('minage').attrib['value']
                game['minPlayers'] = item.find('minplayers').attrib['value']
                game['maxPlayers'] = item.find('maxplayers').attrib['value']
                game['rating'] = item.find('statistics').find('ratings').find('average').attrib['value']
                game['weight'] = item.find('statistics').find('ratings').find('averageweight').attrib['value']
                self.gameList.append(game)
        except:
            print("Error: " + str(sys.exc_info()[0]))
 
        # if not len(ratings) == len(ids):
            # print(str(len(ratings)) +"ratings but" +str(len(ids)) + "ids")
        # return ratings
  
    def WriteJSONFile(self, fPath):
        fields = ["name", "yearPublished", "minAge", "minPlayers", "maxPlayers", "rating", "weight"]
        fOut = open(fPath, 'w')
        fOut.write("[\n{")
        fOut.write("},\n{".join([", ".join(["\""+field+"\": \"" + str(game[field]) + "\"" for field in fields]) for game in self.gameList]))
        fOut.write("}\n]")

    def WriteCSVFile(self, fPath):
        fields = ["name", "yearPublished", "minAge", "minPlayers", "maxPlayers", "rating", "weight"]
        fOut = open(fPath, 'w')
        fOut.write(",".join(fields) + "\n")
        for game in self.gameList:
            fOut.write(",".join([game[x] for x in fields]) + "\n")

    def PrintIDs(self):
        print(str(len(self.idList)) + " IDs:\n" + str(self.idList))

    def PrintGames(self):
        print(self.gameList)

    def Batch(self, iterable, n=1):
        l = len(iterable)
        for ndx in range(0, l, n):
            yield iterable[ndx:min(ndx + n, l)]
