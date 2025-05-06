import {navPoint} from './navPoint.js'
import {Graph, invers, astar} from '../navAlgorithms/astar.js'
import { Polyline } from 'react-leaflet'

export class navPath extends navPoint {
    constructor(floorId, rows, res, nodeSize, text, pathNode1, pathNode2, grid)
    {
      super(floorId, rows, res, nodeSize, text, pathNode1)
      this.pathNode2 = pathNode2
      this.grid = grid
      this.path = this.findPath()
    }
  
    findPath(){
      var graphA = new Graph(invers(this.grid), { diagonal: true });
      var start = graphA.grid[this.pathNode1.cords.x][this.pathNode1.cords.y]
      var end = graphA.grid[this.pathNode2.cords.x][this.pathNode2.cords.y]
      var result = astar.search(graphA, start, end)
      result.unshift(start);
      result = this.pathToPol(result)
      return result
    }
  
    pathToPol(result){
      var pol = new Array()
      
      for (let i = 0; i < result.length; i++) {
        pol[i] = [(this.rows - result[i].y) * this.nodeSize, result[i].x * this.nodeSize ]
      }
    
      //L.polyline(pol, {"weight": 15, "opacity": 0.8}).addTo(this.mapContrl.map)
      return pol
    }
  
    show()
    {
      //this.mapContrl.setMap(this.floorId)
      //this.pathToPol(this.path)
      return (
        <>
          <Polyline positions={this.path} color="red" weight={5} opacity={0.8}/>
        </>
      )
    }
  
  }