import vector2 from "./vector2.js"
import { radToDeg, vectorFromVectorAndDirection, xyIntoInt, intToVector, clampAngle, clamp01 } from "./math.js"
import excavator from "./excavator.js"
import "../meme-template.js"

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let cameraPosition = new vector2(16383, 16383)

let tiles = {}
const tileSize = 10

export const pixelToTile = (x, y) => {
    if (y == null && x != null) {
        y = x.y
        x = x.x
    }

    return new vector2(cameraPosition.x + (x - canvas.width / 2) / tileSize, cameraPosition.y + (y - canvas.height / 2) / tileSize)
}

export const tileToPixel = (x, y) => {
    return new vector2(cameraPosition.x - x + canvas.width / 2, cameraPosition.y - y + canvas.height / 2)
}

const getTile = (x, y) => {
    if (x < 0 || y < 0) return 0
    if (x > 32767 || y > 32767) return 0

    return tiles[xyIntoInt(x, y)]
}

const getOrGenerateTile = (x, y) => {
    let tile = getTile(x, y)

    if (tile == null) {
        let int = 0

        if (y > 16383) int++

        tiles[xyIntoInt(x, y)] = int

        tile = getTile(x, y)
    }

    return tile
}

let keyInputs = []

window.addEventListener("keydown", e => {
    if (keyInputs.indexOf(e.code) == -1) keyInputs.push(e.code)
})
window.addEventListener("keyup", e => {
    let index = keyInputs.indexOf(e.code)
    if (index > -1) keyInputs.splice(index, 1)
})

let excavatorEntity = new excavator()

const detectExcavatorCollisions = state => {
    const locations = state.getArmLocations()

    let collisionPoints = [
        xyIntoInt(pixelToTile(locations[1])),
        xyIntoInt(pixelToTile(locations[2])),
        xyIntoInt(pixelToTile(locations[3])),
        xyIntoInt(pixelToTile(locations[4])),
    ]

    if (state.cupFilled >= 1) {
        collisionPoints.push(xyIntoInt(pixelToTile(locations[4].lerp(locations[5], 0.75))))
    }

    for (let i = 0; i < collisionPoints.length; i++) {
        if (tiles[collisionPoints[i]] != 0) {
            return i
        }
    }

    return -1
}

const checkExcavatorCollisions = oldExcavator => {
    let newExcavatorStateIndex = detectExcavatorCollisions(excavatorEntity)
    let oldExcavatorStateIndex = detectExcavatorCollisions(oldExcavator)

    //TODO: refine this collision system... Only block the movement attempt if the new state is hitting something and the old one isnt
    if(newExcavatorStateIndex + oldExcavatorStateIndex > -1 && (newExcavatorStateIndex > -1 && oldExcavatorStateIndex == -1)){
        excavatorEntity = oldExcavator
    }
}

const rayCastDown = (x, y) => {
    if (tiles[xyIntoInt(pixelToTile(x, y))] != 0) return new vector2(x, y)
    return rayCastDown(x, y + 1)
}

const gameLoop = () => {
    if (keyInputs.includes("KeyA")) {
        let oldExcavator = excavatorEntity.getCopy()
        excavatorEntity.armFirstPartAngle += 1
        excavatorEntity.armFirstPartAngle = clampAngle(excavatorEntity.armFirstPartAngle)
        checkExcavatorCollisions(oldExcavator)
    }
    if (keyInputs.includes("KeyD")) {
        let oldExcavator = excavatorEntity.getCopy()
        excavatorEntity.armFirstPartAngle -= 1
        excavatorEntity.armFirstPartAngle = clampAngle(excavatorEntity.armFirstPartAngle)
        checkExcavatorCollisions(oldExcavator)
    }
    if (keyInputs.includes("KeyW")) {
        let oldExcavator = excavatorEntity.getCopy()
        excavatorEntity.armSecondPartAngle -= 1
        excavatorEntity.armSecondPartAngle = clampAngle(excavatorEntity.armSecondPartAngle)
        checkExcavatorCollisions(oldExcavator)
    }
    if (keyInputs.includes("KeyS")) {
        let oldExcavator = excavatorEntity.getCopy()
        excavatorEntity.armSecondPartAngle += 1
        excavatorEntity.armSecondPartAngle = clampAngle(excavatorEntity.armSecondPartAngle)
        checkExcavatorCollisions(oldExcavator)
    }
    if (keyInputs.includes("KeyE")) {
        let oldExcavator = excavatorEntity.getCopy()
        excavatorEntity.armCupAngle -= 2
        excavatorEntity.armCupAngle = clampAngle(excavatorEntity.armCupAngle)
        checkExcavatorCollisions(oldExcavator)
    }
    if (keyInputs.includes("KeyQ")) {
        let oldExcavator = excavatorEntity.getCopy()
        excavatorEntity.armCupAngle += 2
        excavatorEntity.armCupAngle = clampAngle(excavatorEntity.armCupAngle)
        checkExcavatorCollisions(oldExcavator)
    }

    //clear screen
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //draw terrain
    for (let y = 0; y < canvas.height / tileSize; y++) {
        for (let x = 0; x < canvas.width / tileSize; x++) {
            let tile = getOrGenerateTile(cameraPosition.x + x - (canvas.width / tileSize / 2), cameraPosition.y + y - (canvas.height / tileSize / 2))

            if (tile == 0) {
                ctx.fillStyle = "hsl(217deg 51% 57%)"
            } else if (tile == 1) {
                ctx.fillStyle = "hsl(136deg 64% 25%)"
            }
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize)
        }
    }

    //destroy the land the cup is gathering
    let excavatorArmLocations = excavatorEntity.getArmLocations()
    if (excavatorEntity.cupFilled < 1) {
        for (let i = 0; i < excavatorEntity.armLengths[2] / 10 + 1; i++) {
            let tileIndex = xyIntoInt(pixelToTile(vectorFromVectorAndDirection(excavatorArmLocations[2], radToDeg(excavatorArmLocations[6]), i * 10)))

            if (tiles[tileIndex] != 0) {
                tiles[tileIndex] = 0
                excavatorEntity.cupFilled += excavatorEntity.cupFillIncrement //can fill 10 tiles
            }
        }
    }

    let dropTilesThreshold = 1 - clamp01(excavatorArmLocations[6] / -49)
    if (excavatorEntity.cupFilled > dropTilesThreshold) {
        for (let i = dropTilesThreshold; i < excavatorEntity.cupFilled; i += excavatorEntity.cupFillIncrement) {
            let rayHit = rayCastDown(excavatorArmLocations[5].x, excavatorArmLocations[5].y)
            if (Math.abs(rayHit.y - excavatorArmLocations[5].y) > 2) {
                console.log(`dropped a distance of ${Math.abs(rayHit.y - excavatorArmLocations[5].y)}!`)
                excavatorEntity.cupFilled -= excavatorEntity.cupFillIncrement
                tiles[xyIntoInt(pixelToTile(rayHit).add(new vector2(0, -1)))] = 1
            }
        }
    }

    excavatorEntity.render(ctx)

    window.requestAnimationFrame(gameLoop)
}
window.requestAnimationFrame(gameLoop)