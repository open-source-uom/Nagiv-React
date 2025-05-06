import {Navig} from "./navigation.js"

export class MapContrl {
    constructor(navig)
    {
      this.curFloor = null
      this.navig = navig
      this.data = this.navig.data
      this.newPoint = false
      this.pointData = null
      this.start = null //true: set start, false: set end

      // this.map = L.map('map', {
      //   crs: L.CRS.Simple,
      //   minZoom: -5
      // })

    }


    setPlace(place)
    {
      if (this.start)
      {
        place["type"] = "start"
        this.navig.start = JSON.parse(JSON.stringify(place));
      } else
      {
        place["type"] = "end"
        this.navig.end = JSON.parse(JSON.stringify(place));
        
      }
    }

    clearMap()
    {
      let tempMap = this.map
      this.map.eachLayer(function (layer) {
        tempMap.removeLayer(layer);
      });
    }

    setMarker(y,x, curMapId){
      if (this.newPoint)
      {
        // L.marker(latlng).addTo(this.map)
        this.newPoint = false
        this.pointData = {
          "floorId": curMapId,
          "cords": {
            "y": Math.floor(this.data.floors[curMapId].rows) - Math.floor(y/this.data.floors[curMapId].nodeSize),
            "x": Math.floor(x/this.data.floors[curMapId].nodeSize),
          },
          "name": "custome point"
        }
        //console.log(this.pointData)
        this.setPlace(this.pointData)
      }
    }
  
    setMap(floorId)
    {
      this.curFloor = floorId
      this.clearMap()
      var bounds = [[0,0], [this.data.floors[floorId].res.height, this.data.floors[floorId].res.width]];
      // var image = L.imageOverlay('maps/'+ floorId +'.png', bounds).addTo(this.map);
      this.map.fitBounds(bounds);
    }

    markerFromPlace(placeName)
    {
        let place = this.data.places[placeName]
        
        //this.setMap(floorId)
        // L.marker(L.latLng((this.data.floors[floorId].rows - place.cords.y) * this.data.floors[floorId].nodeSize, place.cords.x * this.data.floors[floorId].nodeSize)).addTo(this.map).bindPopup(placeName);
        this.pointData = place
        this.pointData["name"] = placeName
        this.setPlace(this.pointData)
    }
  }