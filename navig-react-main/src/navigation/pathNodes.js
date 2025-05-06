export class pathNode {
    constructor(name, floorId, cords, text)
    {
      this.name = name
      this.floorId = floorId
      this.cords = cords
      this.text = text
    }
  }
  
export class pathEntryNode extends pathNode {
    constructor(code, floorId, cords, level, id, type)
    {
      super(code, floorId, cords, type)
      this.level = level
      this.id = id
    }
}
