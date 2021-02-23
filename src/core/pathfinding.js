import { Vec2 } from "game/graphics"

// Export so it can be overwritten from outside
export let Precision = 2

function splitCells(cells) {
    const scalar = Precision ** 2 // since we operate in 2D
    const result = new Array(cells.length * scalar)

    // Copy and split every cell into multiple based on precision
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        const offset = i * scalar
     
        for (let y = 0; y <= Precision - 1; y++) {
            for (let x = 0; x <= Precision - 1; x++) {
                const index = offset + x + y * Precision
                result[index] = new Vec2(Precision * cell.x + x, Precision * cell.y + y)
            }   
        }
    }

    return result
}

/**
 * 
 * @param {object} config 
 * @param {Vec2[]} config.cells
 * @param {Vec2}   config.start
 * @param {Vec2}   config.end
 */
export default function findPath(config = {}) {
    const start = config.start.multiply(Precision)
    const end = config.end.multiply(Precision)
    
    // We increase the cell count of the grid to have higher precision
    const cells = splitCells(config.cells)

    const startNode = start
    startNode.pathValue = 0
    startNode.betaValue = 0

    let winnerNode = null
    let nodesToProcess = [startNode]
    const nodesFinished = []

    loop1:
    while (nodesToProcess.length > 0) {
        let currentNode = nodesToProcess.reduce((prev, current) => (prev.pathValue < current.pathValue) ? prev : current)
        nodesFinished.push(currentNode)
        nodesToProcess.splice(nodesToProcess.indexOf(currentNode), 1)

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {

                // current node being skipped
                if (i === 0 && j === 0) {
                    continue
                }

                let newX = currentNode.x + i
                let newY = currentNode.y + j

                //look for corners, if there is a corner, path cannot go diagonally
                {
                    if (i === -1 && j === -1) {
                        if ((cells.findIndex(node => (node.x === newX + 1 && node.y === newY)) === -1 ||
                            cells.findIndex(node => (node.x === newX && node.y === newY + 1)) === -1)
                        ) {
                            continue
                        }
                    }

                    if (i === 1 && j === -1) {
                        if ((cells.findIndex(node => (node.x === newX - 1 && node.y === newY)) === -1 ||
                            cells.findIndex(node => (node.x === newX && node.y === newY + 1)) === -1)
                        ) {
                            continue
                        }
                    }

                    if (i === -1 && j === 1) {
                        if ((cells.findIndex(node => (node.x === newX && node.y === newY - 1)) === -1 ||
                            cells.findIndex(node => (node.x === newX + 1 && node.y === newY)) === -1)
                        ) {
                            continue
                        }
                    }
                    if (i === 1 && j === 1) {
                        if ((cells.findIndex(node => (node.x === newX - 1 && node.y === newY)) === -1 ||
                            cells.findIndex(node => (node.x === newX && node.y === newY - 1)) === -1)
                        ) {
                            continue
                        }
                    }
                }

                let nextNode
                let indexOfNextNode = cells.findIndex(node => (node.x === newX && node.y === newY))
                if (indexOfNextNode != -1) {
                    nextNode = cells[indexOfNextNode]
                } else {
                    continue
                }

                let nodesToProcessIndex = nodesToProcess.findIndex(node => (node.x === nextNode.x && node.y === nextNode.y))
                if (nodesToProcessIndex != -1) {
                    let newBetaValue
                    if (i === 0 || j === 0) {
                        newBetaValue = currentNode.betaValue + 1
                    } else {
                        newBetaValue = currentNode.betaValue + Math.sqrt(2)
                    }
                    if (nodesToProcess[nodesToProcessIndex].betaValue > newBetaValue) {
                        nodesToProcess[nodesToProcessIndex].betaValue = newBetaValue
                        nodesToProcess[nodesToProcessIndex].parentNode = currentNode
                    }
                    continue
                }
                if (nodesFinished.findIndex(node => (node.x === newX && node.y === newY)) != -1) {
                    continue
                }
                if (nextNode.x === end.x && nextNode.y === end.y) {
                    nodesToProcess = []
                    winnerNode = currentNode
                    break loop1
                }
                nextNode.alphaValue = new Vec2(nextNode).distance(end);
                if (i === 0 || j === 0) {
                    nextNode.betaValue = currentNode.betaValue + 1
                } else {
                    nextNode.betaValue = currentNode.betaValue + Math.sqrt(2)
                }
                nextNode.pathValue = nextNode.alphaValue + nextNode.betaValue
                nextNode.parentNode = currentNode
                nodesToProcess.push(nextNode)
            }
        }
    }

    if (!winnerNode) {
        return [] 
    }

    let result = []

    while (winnerNode.parentNode) {
        winnerNode = winnerNode.parentNode

        result.push(
            new Vec2(winnerNode.x, winnerNode.y)
                .add(0.5)           // Return center of cell
                .divide(Precision)  // Scale the position back
        )
    }

    return result.reverse()
}