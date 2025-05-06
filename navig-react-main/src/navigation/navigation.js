import { GraphD } from "./navAlgorithms/dijkstra.js"
import { pathNode, pathEntryNode } from "./pathNodes.js"
import { findPath } from "./navAlgorithms/astar.js"
import { navPath} from "./navNodes/navPath.js"
import { navPoint} from "./navNodes/navPoint.js"


export class Navig {
    constructor(data)
    {
        this.data = data
        this.graph = JSON.parse(JSON.stringify(data.graph.noElevator));
        this.curNode = 0
        this.graphD = new GraphD(this.graph)
        this.entries_allowed = "noElevator"
        this.navArray = null
        this.pathD = null
        this.start = null
        this.end = null
    }

    find()
    {
        console.log(this.entries_allowed)
        this.graph = JSON.parse(JSON.stringify(this.data.graph.all));
        if (this.entries_allowed == "noStairs")
        {
            this.graph = JSON.parse(JSON.stringify(this.data.graph.noStairs));
        }
        else if(this.entries_allowed == "noElevator")
        {
            this.graph = JSON.parse(JSON.stringify(this.data.graph.noElevator));
        }
        this.graphD = new GraphD(this.graph)
        this.addStartAndEnd()

        this.pathD = this.graphD.findShortestPath(this.start.type, this.end.type)
        this.navArray = this.makeNav(this.getPathWithNodes(this.pathD))
        this.curNode = 0
        this.navArray[this.curNode].show()
    }

    getCurMapId()
    {
        return this.navArray[this.curNode].floorId
    }

    getPathWithNodes(pathD)
    {
        let nodePath = new Array()
        if (pathD != null){
        nodePath[0] = new pathNode(pathD[0], this.start.floorId, this.start.cords, this.start.name)

        let entry
        for(let i = 1; i < pathD.length -1; i++)
        {
            entry = this.data["entries"][pathD[i]]
            //console.log(entry)
            nodePath[i] = new pathEntryNode(pathD[i], entry.floorId, entry.cords, entry.level, entry.id, entry.type)
        }
        nodePath[pathD.length - 1] = new pathNode(pathD[pathD.length - 1], this.end.floorId, this.end.cords, this.end.name)
        }

        return nodePath
    }



    makeNav(nodePath)
    {
        let navArray = new Array()

        let curFloor
        let k = 0
        let l = 0
        while (l < nodePath.length - 1)
        {


            if(k%2==0)
            {
                curFloor = this.data["floors"][nodePath[l].floorId]
                let text = "Go from " + nodePath[l].text + " to " + nodePath[l + 1].text
                navArray.push(new navPath(curFloor.id, curFloor.rows, curFloor.res, curFloor.nodeSize, text, nodePath[l], nodePath[l + 1], curFloor.grid))
                l++
                k++
            } else
            {
                if (nodePath[l].text != "door"){
                    let direction
                    if(nodePath[l].floorId > nodePath[l + 1].floorId)
                    {
                        direction = "down"
                    } else
                    {
                        direction = "up"
                    }

                    let nFloors = 0
                    while(nodePath[l].floorId != nodePath[l + 1].floorId)
                    {
                        l++
                        nFloors++
                    }
                    curFloor = this.data["floors"][nodePath[l].floorId]
                    let text = "Go " + direction + " " + nFloors  + " floor/s"
                    navArray.push(new navPoint(curFloor.id, curFloor.rows, curFloor.res, curFloor.nodeSize, text, nodePath[l]))
                    k++
                } else{
                    let text = "Go from " + nodePath[l + 1].text + " to " + nodePath[l + 2].text
                    curFloor = this.data["floors"][nodePath[l + 2].floorId]
                    navArray.push(new navPath(curFloor.id, curFloor.rows, curFloor.res, curFloor.nodeSize, text, nodePath[l + 1], nodePath[l + 2], curFloor.grid))

                    l = 2 + l
                }


            }
        }
        if (nodePath.length == 0){
            navArray.push(new navPoint(this.start.floorId, this.data["floors"][this.start.floorId].rows, this.data["floors"][this.start.floorId].res, this.data["floors"][this.start.floorId].nodeSize, "No path found", this.start))
        }
        //console.log(this.navArray)
        return navArray
    }

    addStartAndEnd()
    {
        this.updateGraph(this.start)
        this.updateGraph(this.end)
        if (this.end.floorId == this.start.floorId)
        {
            this.graph[this.start.type] = {}
            this.graph[this.end.type] = {}
            let cost = findPath(this.data["floors"][this.start.floorId].grid, this.start.cords.x, this.start.cords.y, this.end.cords.x, this.end.cords.y).length
            this.graph[this.start.type][this.end.type] = cost
            this.graph[this.end.type][this.start.type] = cost
        }
    }


    updateGraph(place)
    {
        let costs = {}
        let entries_all = this.data["floors"][place.floorId]["entries"]
        let entries = []
        if (this.entries_allowed == "noStairs")
        {
            for (let entry in entries_all)
            {
                if (entries_all[entry].type != "stairs")
                {
                    entries.push(entry)
                }
            }
        }
        else if(this.entries_allowed == "noElevator")
        {
            for (let entry in entries_all)
            {
                if (entries_all[entry].type != "elevator")
                {
                    entries.push(entry)
                }
            }
        }
        else
        {
            entries = Object.keys(entries_all)
        }
        let entry
        let cost
        for(let entName in entries)
        {
            entry = this.data["entries"][entries[entName]]
            cost = findPath(this.data["floors"][place.floorId].grid, place.cords.x, place.cords.y, entry.cords.x, entry.cords.y).length

            if (this.graph[place.type] == undefined)
            {
                this.graph[place.type] = {}
            }

            this.graph[place.type][entries[entName]] = cost
            console.log(entries)
            console.log(this.graph)
            this.graph[entries[entName]][place.type] = cost

        }
        console.log(this.graph)
    }


    getText()
    {
        return this.navArray[this.curNode].text
    }

    next()
    {
        if (this.curNode != this.navArray.length - 1)
        {
            this.curNode++
            //this.navArray[this.curNode].show()
        }
    }

    prev()
    {
        if (this.curNode != 0)
        {
            this.curNode--
            //this.navArray[this.curNode].show()
        }
    }

    showCur()
    {
        return this.navArray[this.curNode].show()
    }
}