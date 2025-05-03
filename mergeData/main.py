import os
import json

dir = os.getcwd()+"/maps"
strairsCost = 100
elevatorCost = doorCost = 1

mergeData = {
    "floors" : {},
    "places": {},
    "entries": {},
    "graph": {
        "noStairs": {},
        "noElevator": {},
        "all": {}
    },
}

def entryDecode(code):
    s = code.split("_")
    return s # [0]: id, [1]: level, [2]: floor

def findById(entries, id):
    for entry in entries:
        if entry["id"]==id:
            return entry

def entryCode(entry, floorId):
    return entry["id"] + "_" + entry["level"] + "_" + floorId

def addToGraphAll(entries, floorid):
    """
    Adds entries to the graph data structure.

    Args:
    - entries: a list of dictionaries representing entries to be added to the graph
    - floorid: an integer representing the floor id

    Returns: None
    """
    for curEnt in entries:
        data = {}
        for ent in curEnt["costs"]:
            ent_data = findById(entries, ent["id"])
            curCode = ent_data["code"]
            data[curCode] = ent["cost"]
        
        for ent in mergeData["graph"]["all"]:
            curCode = entryDecode(ent)
            id = curCode[0]
            level = curCode[1]
            if (id == curEnt["id"] and abs(int(level)-int(curEnt["level"]))==1 ):
                acost = elevatorCost
                if curEnt["type"]=="stairs":
                    acost = strairsCost

                elif curEnt["type"]=="door":
                    acost = doorCost

                data[ent] = acost
                mergeData["graph"]["all"][ent][curEnt["code"]] = acost
        print(data)
        mergeData["graph"]["all"][curEnt["code"]] = data

def addToGraphNoElevator(entries, floorid):
    """
    Adds entries to the graph data structure.

    Args:
    - entries: a list of dictionaries representing entries to be added to the graph
    - floorid: an integer representing the floor id

    Returns: None
    """
    for curEnt in entries:
        if curEnt["type"]=="elevator":
            continue
        data = {}
        for ent in curEnt["costs"]:
            ent_data = findById(entries, ent["id"])
            if ent_data["type"]=="elevator":
                continue
            curCode =ent_data["code"]
            data[curCode] = ent["cost"]
        
        for ent in mergeData["graph"]["noElevator"]:
            curCode = entryDecode(ent)
            id = curCode[0]
            level = curCode[1]
            if (id == curEnt["id"] and abs(int(level)-int(curEnt["level"]))==1 ):
                acost = elevatorCost
                if curEnt["type"]=="stairs":
                    acost = strairsCost

                elif curEnt["type"]=="door":
                    acost = doorCost

                data[ent] = acost
                mergeData["graph"]["noElevator"][ent][curEnt["code"]] = acost
        print(data)
        mergeData["graph"]["noElevator"][curEnt["code"]] = data

def addToGraphNoStairs(entries, floorid):
    for curEnt in entries:
        if curEnt["type"]=="stairs":
            continue
        data = {}
        for ent in curEnt["costs"]:
            ent_data = findById(entries, ent["id"])
            if ent_data["type"]=="stairs":
                continue
            curCode =ent_data["code"]
            data[curCode] = ent["cost"]
        
        for ent in mergeData["graph"]["noStairs"]:
            curCode = entryDecode(ent)
            id = curCode[0]
            level = curCode[1]
            if (id == curEnt["id"] and abs(int(level)-int(curEnt["level"]))==1 ):
                acost = elevatorCost
                if curEnt["type"]=="stairs":
                    acost = strairsCost

                elif curEnt["type"]=="door":
                    acost = doorCost

                data[ent] = acost
                mergeData["graph"]["noStairs"][ent][curEnt["code"]] = acost
        print(data)
        mergeData["graph"]["noStairs"][curEnt["code"]] = data

def formPlace(place, floorId):
    return {
        "floorId": floorId,
        "cords": place["cords"],
        "id": place["id"],
    }

def formEntry(entry, floorId):
    return {
        "floorId": floorId,
        "id": entry["id"],
        "level": entry["level"],
        "cords": entry["cords"],
        "type": entry["type"]
    }

def formMapData(mapData):
    floorId = mapData["id"]

    newMapData = mapData.copy()

    newMapData["places"] = {}
    for place in mapData["places"]:
        newMapData["places"][place["id"]] = place
    
    newMapData["entries"] = {}
    for entry in mapData["entries"]:
        newMapData["entries"][entry["code"]] = entry

    mergeData["floors"][floorId] = newMapData

    for place in mapData["places"]:
        mergeData["places"][place["name"]] = formPlace(place, floorId)

    for entry in mapData["entries"]:
        mergeData["entries"][entry["code"]] = formEntry(entry, floorId)

    addToGraphAll(mapData["entries"], floorId)
    addToGraphNoElevator(mapData["entries"], floorId)
    addToGraphNoStairs(mapData["entries"], floorId)

for filename in os.listdir(dir):
    curData = {}
    with open(os.path.join(dir, filename), 'r') as f:
        curData = json.load(f)
        formMapData(curData)


with open("mergeData.json", "w") as f:
    json.dump(mergeData, f)


