from PIL import Image
import numpy as np
import json
import os

def from_np_to_mapData(output):
    mapData = []
    for i in range(0, output.shape[0]):
        mapData.append([])
        for j in range(0, output.shape[1]):
            if output[i][j] ==255:
                mapData[i].append(1)
            else:
                mapData[i].append(0)
    return mapData

def resize(array, rows, collumns):
    output = np.zeros((rows, collumns))
    for i in range(0, rows):
        for j in range(0, collumns):
            sum = 0
            for k in range(0, int(array.shape[1] / collumns)):
                for l in range(0, int(array.shape[1] / collumns)):
                    sum += array[int(i * array.shape[0] / rows) + k][int(j * array.shape[1] / collumns) + l]
            output[i][j] = sum / (int(array.shape[0] / rows) * int(array.shape[1] / collumns))
    return output

def make_bw_no_gray(output, threshold):
    rows, collumns = output.shape[0], output.shape[1]

    for i in range(0, rows):
        for j in range(0, collumns):
            if output[i][j] > threshold:
                output[i][j] = 255
            else:
                output[i][j] = 0
    return output

def make_red_faded_image_from_arraw(array):
    height, width = array.shape
    rgba_array = np.zeros((height, width, 4), dtype=np.uint8)
    for i in range(0, height):
        for j in range(0, width):
            #print(array[i][j])
            if array[i][j] == 0:
                aplha = 200
            else:
                aplha = 0
            rgba_array[i][j][3] = aplha
            rgba_array[i][j][0] = 255
            rgba_array[i][j][1] = 0
            rgba_array[i][j][2] = 0

    red_image = Image.fromarray(rgba_array, 'RGBA')
    return red_image

def add_another_image_to_image(image1, image2):
    result = Image.alpha_composite(image1.convert("RGBA"), image2)
    return result

def resize_output(output, array):
    rows, collumns = output.shape[0], output.shape[1]
    resized_output = np.zeros((array.shape[0], array.shape[1]))
    for i in range(0, array.shape[0]):
        for j in range(0, array.shape[1]):
            resized_output[i][j] = output[int(i * rows / array.shape[0])][int(j * collumns / array.shape[1])]
    return resized_output


dir = os.getcwd()+"/photos"
for file in os.listdir(dir):
    done = False
    print("File: "+file)
    im = Image.open(dir+"/"+file)
    im.show()
    while not done:
        collumns = int(input("Enter square size: "))
        threshold = int(input("Enter threshold(0-255): ")) #180 is a good value 0 - 255
        im = Image.open(dir+"/"+file)
        bnw = im.convert('L')
        array = np.array(bnw)
        print(array.shape)
        imageRation = array.shape[0] / array.shape[1]
        rows = int(collumns * imageRation)
        output = resize(array, rows, collumns)
        output = make_bw_no_gray(output, threshold)
        resized_output = resize_output(output, array)
        red_walls = make_red_faded_image_from_arraw(resized_output) #Image.fromarray(resized_output)
        im = add_another_image_to_image(im, red_walls)
        im.show()
        print("1. Save")
        print("2. Retry")
        inp = int(input("Enter: "))
        if inp == 1:
            done = True
        else:
            done = False
    mapData = from_np_to_mapData(output)
    with open('output/mapData'+file.split(".")[0]+'.json', 'w') as outfile:
        jsonData = {
            "name": file,
            "id": None,
            "res": {
                "width": array.shape[1],
                "height": array.shape[0]
            },
            "collums": str(collumns),
            "rows": int(collumns * imageRation),
            "nodeSize": array.shape[1] / collumns,
            "grid": mapData,
            "places": None,
            "entries": None,
        }
        json.dump(jsonData, outfile)
# im = Image.open('test2.png')
# bnw = im.convert('L')

# array = np.array(bnw)
# print(array.shape)
# imageRation = array.shape[0] / array.shape[1]
# rows = int(collumns * imageRation)


# mapData = from_np_to_mapData(output)
# with open('mapData.json', 'w') as outfile:
#     jsonData = {
#       "name": None,
#       "id": None,
#       "res": {
#           "width": array.shape[1],
#           "height": array.shape[0]
#       },
#       "collums": str(collumns),
#       "rows": int(collumns * imageRation),
#       "nodeSize": array.shape[1] / collumns,
#       "grid": mapData,
#       "places": None,
#       "entries": None,
#   }
#     json.dump(jsonData, outfile)