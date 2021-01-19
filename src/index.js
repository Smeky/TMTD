import "./style.scss"
console.log("TMTD Terminal")

const esTest = () => {
    return [1, 2]
}

const [a, b] = esTest()

console.warn(a, b)