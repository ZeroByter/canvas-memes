import { tileToPixel } from "./game.js"
import { clampAngle, radToDeg, vectorFromVectorAndDirection } from "./math.js"
import vector2 from "./vector2.js"

function excavator() {
    this.location = new vector2(16383, 16383 + 40)
    this.armLengths = [95, 60, 40]
    this.armFirstPartStart
    this.armFirstPartAngle = -170
    this.armSecondPartAngle = 150
    this.armCupAngle = -45
    this.cupFilled = 0
    this.cupFillIncrement = 1 / 10
}

excavator.prototype.getCopy = function () {
    let newExcavator = new excavator()
    newExcavator.location = this.location
    newExcavator.armLengths = this.armLengths
    newExcavator.armFirstPartStart = this.armFirstPartStart
    newExcavator.armFirstPartAngle = this.armFirstPartAngle
    newExcavator.armSecondPartAngle = this.armSecondPartAngle
    newExcavator.armCupAngle = this.armCupAngle
    newExcavator.cupFilled = this.cupFilled
    newExcavator.cupFillIncrement = this.cupFillIncrement
    return newExcavator
}

excavator.prototype.getArmLocations = function () {
    let armFirstPartStart = tileToPixel(this.location.x, this.location.y)

    let armFirstPartEnd = vectorFromVectorAndDirection(armFirstPartStart, radToDeg(this.armFirstPartAngle), this.armLengths[0])
    let armSecondPartEnd = vectorFromVectorAndDirection(armFirstPartEnd, radToDeg(this.armFirstPartAngle + this.armSecondPartAngle), this.armLengths[1])

    let armCupTempAngle = clampAngle(this.armFirstPartAngle + this.armSecondPartAngle + this.armCupAngle + 90)

    let armCupP1 = vectorFromVectorAndDirection(armSecondPartEnd, radToDeg(armCupTempAngle - 45), this.armLengths[2] / 2)
    let armCupP2 = vectorFromVectorAndDirection(armCupP1, radToDeg(armCupTempAngle), this.armLengths[2] / 2)
    let armCupEnd = vectorFromVectorAndDirection(armCupP2, radToDeg(armCupTempAngle + 45), this.armLengths[2] / 2)

    //               0              1                 2             3         4            5             6
    return [armFirstPartStart, armFirstPartEnd, armSecondPartEnd, armCupP1, armCupP2, armCupEnd, armCupTempAngle]
}

excavator.prototype.render = function (ctx) {
    const locations = this.getArmLocations()

    ctx.strokeStyle = "white"
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.moveTo(locations[0].x, locations[0].y)
    ctx.lineTo(locations[1].x, locations[1].y)
    ctx.lineTo(locations[2].x, locations[2].y)
    ctx.stroke()

    ctx.strokeStyle = "yellow"
    ctx.lineWidth = 5

    ctx.beginPath()
    ctx.moveTo(locations[2].x, locations[2].y)
    ctx.lineTo(locations[3].x, locations[3].y)
    ctx.lineTo(locations[4].x, locations[4].y)
    ctx.lineTo(locations[5].x, locations[5].y)
    ctx.stroke()
}

export default excavator