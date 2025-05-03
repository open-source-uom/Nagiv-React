## Navig React by Nikos Georgitsogiannis
Navig React is a maps application designed to be integrated with the official University of Macedonia (myUoM) application. This application allows users to create and edit maps of various university buildings and floors, including walls, elevators, stairs, places, doors, and more.

# How it Works
Set Map Data: To create a map, you need to set some initial image data. Use the "setMapData" repository for this purpose. After loading the map image, you can use your keyboard to define different elements:

1: Eraser (clears existing elements)
2: Wall (draw walls)
3: Place (refer to an external data source for IDs)
4: Stairs (same as above)
5: Elevator
6: Door
Open the Index.html File: After defining the map elements on each floor, open the index.html file to view your map.

Merge Data: Once you've created maps for multiple floors or buildings and have saved them as JSON files, you can import these files into the "mergeData" repository. This process consolidates all the map data into a single JSON file.

Presentation in myUoM: The final JSON file generated from the mergeData repository can be presented within the myUoM application for navigation and reference.

# Set Map Data
Choose a map image file.
Use the keyboard shortcuts mentioned above to draw walls, define places, stairs, elevators, and doors.
You can load JSON files to edit existing maps.
The "Set Image" button resets the image but should be pressed when opening a new image.
Use the "Save Data" button to save the map data as a JSON file.

# Merge Data Repository
The code in the "mergeData" repository combines data from different floor maps into a single JSON file (mergeData.json) suitable for presentation in myUoM. Here's an overview of what the code does:

Initialize mergeData dictionary
mergeData = {
    "floors" : {},
    "places": {},
    "entries": {},
    "graph": {}
}

Functions for processing and formatting map data
Loop through JSON files in the 'maps' directory
for filename in os.listdir(dir):
    curData = {}
    with open(os.path.join(dir, filename), 'r') as f:
        curData = json.load(f)
        formMapData(curData)
Save the merged data as 'mergeData.json'
with open("mergeData.json", "w") as f:
    json.dump(mergeData, f)


In summary, the code processes map data from various JSON files in the 'maps' directory, organizes it into a structured format, and finally, saves the merged data as 'mergeData.json'. This merged data can then be used for integration with the myUoM application.

Please ensure you have the necessary directory structure and JSON files in place for this code to work correctly.