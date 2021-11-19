export default class GridMap {
    constructor(gridSize, gridWidth, gridHeight, defaultGetIfNull=null) {
        this.gridSize = gridSize
        this.gridWidth = gridWidth
        this.gridHeight = gridHeight

        this.defaultGetIfNull = defaultGetIfNull

        this.map = []
    }

    xyToInt(x, y) {
        if (y == null && x != null) {
            y = x.y
            x = x.x
        }

        if (x < 0 || y < 0) return null
        if (x > this.gridWidth || y > this.gridHeight) return null
        return x + y * this.gridWidth
    }

    get(x, y) {
        const int = this.xyToInt(x, y)
        let type = this.map[int]
        if (type == null) type = this.defaultGetIfNull
        return type
    }

    set(x, y, value){
        this.map[this.xyToInt(x, y)] = value
    }
}