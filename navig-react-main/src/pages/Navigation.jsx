import {
    Box,
    Button,
    Select,
    Stack,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { MapContainer, TileLayer, useMap, ImageOverlay, Polyline, Marker, useMapEvent } from 'react-leaflet'
  import { useState, useRef, useEffect, useCallback } from "react";
  import { mapData } from "../assets/mapData.js";
  //import MapCords from "../components/MapCords";
  
  //import maps from '../maps/0.png'
  import { bounds, map, CRS, L } from "leaflet";
  import {Navig} from "../navigation/navigation.js"
  import { MapContrl } from "../navigation/mapContrl.js";


  const navig = new Navig(mapData);
  const mapContrl = new MapContrl(navig);

  function ClickHandler({setClickCords}) {
    const map = useMapEvent('click', (e) => {
      setClickCords([e.latlng.lat, e.latlng.lng])
    })

    return null
  }
  

  function NavPage() {
    const [curMap, setCurMap] = useState("0");
    const [text, setText] = useState("");
    const [nav, setNav] = useState(null);
    const [imageBounds, setImageBounds] = useState([[0,0],[mapData.floors[0].res.height , mapData.floors[0].res.width]])
    const mapSelect = useRef()
    const start = useRef()
    const [custStart, setCustStart] = useState(false)
    const [custEnd, setCustEnd] = useState(false)
    const end = useRef()
    const [clickCords, setClickCords] = useState([0,0])
    const maps = [0,1,2]
    const simpleCRS = CRS.Simple;
    var imageOv = useRef()
    const mapRef = useRef(null)
    const [entries_allowed, setEntries_allowed] = useState("noElevator")
    //const imageBounds = [[0,0],[1943, 2907]]//[1943, 2907]

    useEffect(() => {
      mapContrl.start = true;
      mapContrl.markerFromPlace(start.current.value)
      mapContrl.start = false;
      mapContrl.markerFromPlace(end.current.value)
    }, [])

    useEffect(() => {
      if(mapSelect) {
        mapSelect.current.value = curMap
      }
    }, [curMap])

    const handleChangeStart = (e) => {
      setCurMap(mapData.places[e.target.value].floorId);
      mapContrl.start = true;
      mapContrl.markerFromPlace(e.target.value)
      setNav(null)
    };

    const handleChangeEntries_allowed = (e) => {
      setEntries_allowed(e.target.value)
      navig.entries_allowed = e.target.value
    }


    const handleChangeEnd = (e) => {
      setCurMap(mapData.places[e.target.value].floorId);
      mapContrl.start = false;
      mapContrl.markerFromPlace(e.target.value)
      setNav(null)
    };

    const handleChangeMap = (e) => {
      setCurMap(e.target.value);
      setNav(null)
    };
  

    const setclick = (cords) => {
      setClickCords(cords)
      if (custStart||custEnd) {
        mapContrl.setMarker(cords[0], cords[1], curMap)
        console.log(cords)
        setNav(<>
        <Marker position={cords}></Marker>
        </>)
        setCustStart(false)
        setCustEnd(false)
      }
    }
    
    const setLeafMap = (floorid) => {
      setImageBounds([[0,0],[mapData.floors[floorid].res.height , mapData.floors[floorid].res.width]])
      setCurMap(floorid)
    }

    const go = () => {

      navig.find()
      setLeafMap(navig.getCurMapId())
      setNav(navig.showCur())
      setText(navig.getText())
    }

    const next = () => {
      navig.next()
      setLeafMap(navig.getCurMapId())
      setText(navig.getText())
      setNav(navig.showCur())

    }

    const prev = () => {
      navig.prev()

      setLeafMap(navig.getCurMapId())
      setText(navig.getText())
      setNav(navig.showCur())
    }

    const setCustomStart = () => {
      if (custEnd) setCustEnd(false)
      setCustStart(true)
      mapContrl.start = true
      mapContrl.newPoint = true
    }

    const setCustomEnd = () => {
      if (custStart) setCustStart(false)
      setCustEnd(true)
      mapContrl.start = false
      mapContrl.newPoint = true
    }

    //console.log(mapRef.current)
    return (
      <Box align="center" marginTop="1em" fontFamily="Syne">
        <h3>{text}</h3>
        <text>start: </text>
        <select onChange={handleChangeStart} defaultValue={"default"} ref={start}> 
          {Object.keys(mapData.places).map((ma) => (<option value={ma}>{ma}</option>))}
        </select>
        <Button onClick={setCustomStart}>Custom Start</Button>
        <text>end: </text>
        <select onChange={handleChangeEnd} defaultValue={"default"} ref={end}> 
          {Object.keys(mapData.places).map((ma) => (<option value={ma}>{ma}</option>))}
        </select>
        <Button onClick={setCustomEnd}>Custom End</Button>
        <label>
        <text>map: </text>
          <select onChange={handleChangeMap} defaultValue={"default"} ref={mapSelect}>
            {Object.keys(mapData['floors']).map((ma) => (<option value={ma}>{mapData['floors'][ma]['name']}</option>))}
          </select>
        </label>
        <Button onClick={go}>Go</Button>
        <Button onClick={next}>Next</Button>
        <Button onClick={prev}>Prev</Button>
        <Select onChange={handleChangeEntries_allowed} defaultValue={"noElevator"}>
          <option value="noElevator">No Elevator</option>
          <option value="noStairs">noStairs</option>
          <option value="all">all</option>
        </Select>
        <MapContainer   crs={simpleCRS} center={[imageBounds[1][0]/2,imageBounds[1][1]/2]} zoom={-3} minZoom={-3}  ref={mapRef} style={{height:500+'px'}}>
          <ImageOverlay  url={"maps/"+curMap+".png"} bounds={imageBounds}  ref={imageOv} ></ImageOverlay>
          {nav && nav}
          <ClickHandler setClickCords={setclick}/>
        </MapContainer>

      </Box>
    );
  }
  
  export default NavPage;
  