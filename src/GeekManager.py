# from Game import *
import csv
import sys
import time
import urllib.request
from xml.etree import ElementTree as ET


class GeekManager:
    nameList = []  # May contain duplicates
    bggNameList = []  # As many items as idList
    idList = []    # Unique IDs
    gameList = []  # Unique games with details

    def PreprocessName(self, name):
        name = name.strip()
        name = name.replace("\"", "")
        return name
    
    def GetLocalNameById (self, gameID, fallback):
        for i in range(len(self.idList)):
            if self.idList[i] == gameID:
                try:
                    return self.nameList[i]
                except:
                    return fallback
        return fallback

    # BORDGAMEGEEK
    # ------------

    def LoadIDsFromNames(self):
        for i in range(len(self.idList), len(self.nameList)):
            gameName = self.nameList[i]
            (gameId, bggGameName) = self.LoadBGGIDFromNameExact(gameName)
            if gameId == "-1":
                (gameId, bggGameName) = self.LoadBGGIDFromName(gameName)
            self.bggNameList.append(bggGameName)
            self.idList.append(gameId)
            time.sleep(3)

        print("Now " + str(len(self.nameList)) + " names and " + str(len(self.idList)) + " ids are loaded")

    def LoadBGGIDFromNameExact(self, name):
        # credit to http://stackoverflow.com/questions/4451600/python-newbie-parse-xml-from-api-call
        url = "https://boardgamegeek.com/xmlapi2/search?query=" + urllib.parse.quote(name) + "&exact=1"
        response = urllib.request.urlopen(url)
        gameId = "-1"
        gameName = "UNKNOWN"
        try:
            root = ET.parse(response).getroot()
            item = root.find('item')
            gameId = item.attrib['id']
            gameName = item.find('name').attrib['value']
            #print item.find('name').text + " [" + str(item['id']) + "]"
        except:
            print("Error:" + str(sys.exc_info()[0]))
        print("... IN  " + name)
        print("... RES " + gameName)
        print("... ID  " + gameId)
        print("\n")
        return gameId, gameName
            
    def LoadBGGIDFromName(self, name):
        # credit to http://stackoverflow.com/questions/4451600/python-newbie-parse-xml-from-api-call
        url = "https://boardgamegeek.com/xmlapi2/search?query=" + urllib.parse.quote(name)
        response = urllib.request.urlopen(url)
        gameId = "-1"
        gameName = "UNKNOWN"
        try:
            root = ET.parse(response).getroot()
            item = root.find('item')
            gameId = item.attrib['id']
            gameName = item.find('name').attrib['value']
            #print item.find('name').text + " [" + str(item['id']) + "]"
        except:
            print("Error:" + str(sys.exc_info()[0]))
        print("... IN  " + name)
        print("... RES " + gameName)
        print("... ID  " + gameId)
        print("\n")
        return gameId, gameName

    def RequestDetailsBatch(self, batchSize):
        for b in self.Batch(self.idList, batchSize):
            ids = ",".join([x for x in b if int(x) >= 0])
            attempts = 1
            success = False
            while attempts < 4 and not success:
                try:
                    self.LoadBGGData(ids)
                    success = True
                except:
                    print("Attempt #" + str(attempts) + " failed")
                    attempts += 1
                    time.sleep(5)

    def LoadBGGData(self, ids):
        ratings = []
        url = "https://boardgamegeek.com/xmlapi2/thing?stats=1&id=" + ids
        print("\n\n" + url)
        response = urllib.request.urlopen(url)
        root = ET.parse(response).getroot()
        for item in root.findall('item'):
            try:
                game = {}
                game['bggID'] = item.attrib["id"]
                game['name'] = item.find("name[@type='primary']").attrib['value']
                game['yearPublished'] = item.find('yearpublished').attrib['value']
                game['minAge'] = item.find('minage').attrib['value']
                game['minPlayers'] = item.find('minplayers').attrib['value']
                game['maxPlayers'] = item.find('maxplayers').attrib['value']
                game['rating'] = item.find('statistics').find('ratings').find('average').attrib['value']
                game['weight'] = item.find('statistics').find('ratings').find('averageweight').attrib['value']
                game['localName'] = self.GetLocalNameById(game['bggID'], game['name'])
                self.gameList.append(game)
            except Exception as e:
                print("WARNING: GAME SKIPPED")
                print(str(e))
 
        # if not len(ratings) == len(ids):
            # print(str(len(ratings)) +"ratings but" +str(len(ids)) + "ids")
        # return ratings

    # FILE INPUT
    # ----------

    def ReadNamesFromRawFile(self, fPath):
        fIn = open(fPath, 'r')
        for line in fIn:
            name = self.PreprocessName(line)
            self.nameList.append(name)
        print(str(len(self.nameList)) + " names in list")

    def ReadNamesFromBibliothekCSVFile(self, fPath):
        csvFile = open(fPath, 'r')
        csvReader = csv.DictReader(csvFile, delimiter=',', quotechar='\"')
        for row in csvReader:
            self.nameList.append(row['Titel (200.1)'])

    def ReadIDsFromRawFile(self, fPath):
        fIn = open(fPath, 'r')
        for line in fIn:
            i = line.strip()
            if not i in self.idList:
                self.idList.append(i)
        print(str(len(self.idList)) + " ids in list")

    def ReadNamesIDsCSVFile(self, fPath):
        csvFile = open(fPath, 'r')
        csvReader = csv.DictReader(csvFile, delimiter=',', quotechar='\"')
        for row in csvReader:
            self.nameList.append(row['name'])
            self.bggNameList.append(row['bggName'])
            self.idList.append(row['id'])



    # FILE OUTPUT
    # -----------

    def WriteNamesIDsCSVFile(self, fPath):
        fOut = open(fPath, 'w')
        fOut.write("\"name\",\"bggName\",\"id\"\n")
        for i in range(len(self.idList)):
            # fOut.write(",".join([game[x] for x in fields]) + "\n")
            fOut.write("\"{}\",\"{}\",\"{}\"\n".format(self.nameList[i], self.bggNameList[i], self.idList[i]))

    def WriteJSONFile(self, fPath):
        fields = ["bggID", "name", "yearPublished", "minAge", "minPlayers", "maxPlayers", "rating", "weight", "localName"]
        fOut = open(fPath, 'w')
        fOut.write("[\n{")
        fOut.write("},\n{".join([", ".join(["\""+field+"\": \"" + str(game[field]) + "\"" for field in fields]) for game in self.gameList]))
        fOut.write("}\n]")

    def WriteCSVFile(self, fPath):
        fields = ["bggID", "name", "yearPublished", "minAge", "minPlayers", "maxPlayers", "rating", "weight"]
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
