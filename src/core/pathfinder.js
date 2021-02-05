import { Tile } from "game/core/tile"
import { Vec2 } from "game/core/structs"

export class PathFinder {

    constructor(availableTiles, start, end, pivot) {

        // dives Tile for more precise path finding; maybe move it elsewhere?
        this.tileDivider = 1
        this.updatedAvailableTiles = []

        this.availableTiles = availableTiles
        this.start = new Vec2(start.x * this.tileDivider, start.y * this.tileDivider)
        this.end = new Vec2(end.x * this.tileDivider, end.y * this.tileDivider)
        this.pivot = pivot
        this.path = []
        this.pathXY = []

        this.entitySize = 8;

        this.divideTile()
    }

    divideTile() {
        this.availableTiles.forEach(element => {
            for (let i = this.tileDivider - 1; i >= 0; i--) {
                for (let j = this.tileDivider - 1; j >= 0; j--) {
                    this.updatedAvailableTiles.push({ x: element.x * this.tileDivider + i, y: element.y * this.tileDivider + j })
                }
            }
        })
    }

    findPath() {
        const startNode = this.start
        startNode.pathValue = 0
        startNode.betaValue = 0

        let winnerNode
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
                    if (i == 0 && j == 0) {
                        continue
                    }

                    let newX = currentNode.x + i
                    let newY = currentNode.y + j

                    //look for corners, if there is a corner, path cannot go diagonally
                    {
                        if (i == -1 && j == -1) {
                            if ((this.updatedAvailableTiles.findIndex(node => (node.x == newX + this.tileDivider && node.y == newY)) == -1 ||
                                this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY + this.tileDivider)) == -1)
                            ) {
                                continue
                            }
                        }

                        if (i == 1 && j == -1) {
                            if ((this.updatedAvailableTiles.findIndex(node => (node.x == newX - this.tileDivider && node.y == newY)) == -1 ||
                                this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY + this.tileDivider)) == -1)
                            ) {
                                continue
                            }
                        }

                        if (i == -1 && j == 1) {
                            if ((this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY - this.tileDivider)) == -1 ||
                                this.updatedAvailableTiles.findIndex(node => (node.x == newX + this.tileDivider && node.y == newY)) == -1)
                            ) {
                                continue
                            }
                        }
                        if (i == 1 && j == 1) {
                            if ((this.updatedAvailableTiles.findIndex(node => (node.x == newX - this.tileDivider && node.y == newY)) == -1 ||
                                this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY - this.tileDivider)) == -1)
                            ) {
                                continue
                            }
                        }
                    }

                    let nextNode
                    let indexOfNextNode = this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY))
                    if (indexOfNextNode != -1) {
                        nextNode = this.updatedAvailableTiles[indexOfNextNode]
                    } else {
                        continue
                    }

                    let nodesToProcessIndex = nodesToProcess.findIndex(node => (node.x == nextNode.x && node.y == nextNode.y))
                    if (nodesToProcessIndex != -1) {
                        let newBetaValue
                        if (i == 0 || j == 0) {
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
                    if (nodesFinished.findIndex(node => (node.x == newX && node.y == newY)) != -1) {
                        continue
                    }
                    if (nextNode.x == this.end.x && nextNode.y == this.end.y) {
                        nodesToProcess = []
                        winnerNode = currentNode
                        break loop1
                    }
                    nextNode.alphaValue = new Vec2(nextNode).distance(this.end);
                    if (i == 0 || j == 0) {
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
        let finalPath = []
        let finalPathXY = []
        while (winnerNode.parentNode) {
            winnerNode = winnerNode.parentNode
            finalPath.push(new Vec2(winnerNode.x * Tile.Size / this.tileDivider - this.pivot.x + this.entitySize, winnerNode.y * Tile.Size / this.tileDivider - this.pivot.y + this.entitySize))
            finalPathXY.push(new Vec2(winnerNode.x, winnerNode.y))
        }

        this.pathXY = finalPathXY.reverse()
        this.path = finalPath.reverse()
    }

    getPath() {
        return this.path
    }

    getPathXY() {
        return this.pathXY
    }
}