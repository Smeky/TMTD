import { Tile } from "game/core/tile"
import { Vec2 } from "game/core/structs"

export class PathFinder {

    constructor(availableTiles, start, end, pivot) {
        // dives Tile for more precise path finding; maybe move it elsewhere?
        this.tileDivider = 2
        this.updatedAvailableTiles = []

        this.availableTiles = availableTiles
        this.start = { x: start.x * this.tileDivider, y: start.y * this.tileDivider }
        this.end = { x: end.x * this.tileDivider, y: end.y * this.tileDivider }
        this.pivot = pivot
        this.path = []

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

        const endNode = this.end
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
                    if (i == 0 && j == 0) {
                        continue
                    }
                    let newX = currentNode.x + i
                    let newY = currentNode.y + j

                    //look for corners

                    if (i == -1 && j == -1) {
                        if (this.updatedAvailableTiles.findIndex(node => (node.x == newX + 1 && node.y == newY)) == -1 ||
                            this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY + 1)) == -1
                            ){
                                continue
                        }
                    }

                    if (i == 1 && j == -1) {
                        if (this.updatedAvailableTiles.findIndex(node => (node.x == newX - 1 && node.y == newY)) == -1 ||
                            this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY + 1)) == -1
                            ){
                                continue
                        }
                    }

                    if (i == -1 && j == 1) {
                        if (this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY - 1)) == -1 ||
                            this.updatedAvailableTiles.findIndex(node => (node.x == newX + 1 && node.y == newY)) == -1
                            ){
                                continue
                        }
                    }
                    if (i == -1 && j == -1) {
                        if (this.updatedAvailableTiles.findIndex(node => (node.x == newX - 1 && node.y == newY)) == -1 ||
                            this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY - 1)) == -1
                            ){
                                continue
                        }
                    }
                    let nextNode
                    let indexOfNextNode = this.updatedAvailableTiles.findIndex(node => (node.x == newX && node.y == newY))
                    if (indexOfNextNode != -1) {
                        nextNode = this.updatedAvailableTiles[indexOfNextNode]
                    } else {
                        continue
                    }
                    if (nodesToProcess.findIndex(node => (node.x == newX && node.y == newY)) != -1) {
                        TODO: "recount beta value"
                        continue
                    }
                    if (nodesFinished.findIndex(node => (node.x == newX && node.y == newY)) != -1) {
                        continue
                    }
                    if (nextNode.x == endNode.x && nextNode.y == endNode.y) {
                        nodesToProcess = []
                        winnerNode = currentNode
                        break loop1
                    }
                    nextNode.alphaValue = new Vec2(nextNode).distance(endNode);
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
        while (winnerNode.parentNode) {
            winnerNode = winnerNode.parentNode
            finalPath.push(new Vec2(winnerNode.x * Tile.Size / this.tileDivider - this.pivot.x, winnerNode.y * Tile.Size / this.tileDivider - this.pivot.y))
        }

        this.path = finalPath.reverse()
    }

    getPath() {
        return this.path
    }
}