## Simple wall detection
A programm that detects the walls from photos(not perfect) and outputs a mapData.json file that can be used as a good start on setMapData.

# How to use
1. Add all the photos of map in the /photos dir.
2. Run the programm.
3. It will print the name of the file it is going to analyse and show you the map. Then it will prompt "Enter square size: " this asks for the size of the nodes that will populate the image, it is the same as in setMapData. If the map is big and detailed you want a big square size like 200, but if you have a small map with bit walls you want a small square size to set the data faster and easier.
4. After that it will promt "Enter threshold(0-255): " this asks for how bright a square should be to consider it a wall. Then it will show you a photo of the map with the walls it detected panted red on top.
5. In the end it will prompt "1. Save, 2. Retry, Enter: " if you are satisfied with the result enter 1 to save the data, if not entre 2 and try with other parameters.

This will continue until it goes through all the files in the /photos dir

then to use the json files you can load them in the setMapData with the corresponding photo