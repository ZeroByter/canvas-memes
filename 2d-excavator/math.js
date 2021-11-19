import vector2 from "./vector2.js"

export const radToDeg = rad => {
    return rad * Math.PI / 180
}

export const vectorFromVectorAndDirection = (source, angle, length) => {
    return new vector2(source.x + Math.sin(angle) * length, source.y + Math.cos(angle) * length)
}

export const xyIntoInt = (x, y) => {
    if(y == null && x != null){
        y = x.y
        x = x.x
    }

    return (y << 16) | x
}

export const intToVector = int => {
    const x = ((int >> (16 * (0))) & 0xFFFF)
    const y = ((int >> (16 * (1))) & 0xFFFF)

    return new vector2(x, y)
}

export const lerp = (a, b, t) => {
    return a + (b - a) * t
}

export const clamp = (value, min, max) => {
    if(value > max) return max
    if(value < min) return min

    return value
}

export const clamp01 = (value) => {
    return clamp(value, 0, 1)
}

export const clampAngle = angle => {
    let temp = angle

    if(temp > 180) temp -= 360
    if(temp < -180) temp += 360

    return temp
}