export const clamp = (min, max, value) => {
    if(value < min) return min
    if(value > max) return max
    return value
}

export const clamp01 = value => {
    return clamp(0, 1, value)
}

export const lerp = (a, b, t) => {
    return a + (b - a) * t
}

export const ilerp = (a, b, t) => {
    if (a != b) {
        return clamp01((t - a) / (b - a))
    } else {
        return 0
    }
}

export const getTime = () => {
    return new Date().getTime()
}

export const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
}
export const getRandomNear = (number, range) => {
    return getRandom(number - range, number + range)
}