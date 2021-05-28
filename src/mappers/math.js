
export function multiplyMapper(multiplier) {
    if (Array.isArray(multiplier)) {
        return (num, index) => num * [multiplier[index]]
    }
    else {
        return (num) => num * multiplier
    }
}

export function divideMapper(multiplier) {
    if (Array.isArray(multiplier)) {
        return (num, index) => num / [multiplier[index]]
    }
    else {
        return (num) => num / multiplier
    }
}
