import { Grid } from "game/core/grid"
import { Tile } from "game/core/tile"
import { Scene } from "game/scene"
import { Vec2 } from "game/core/structs"
import * as pixi from "pixi.js"
import { ECS } from "game/entity/entities"
import { PathFinder } from "../core/pathfinder"

export default class LevelScene extends Scene {
    constructor() {
        super("level")
        
        // Todo: Please, please, need a better solution
        // Setup layers so we can control zIndex better
        this.sceneContainer.sortableChildren = true
        this.containers = ["grid", "entities", "healthbars"]
            .map((name, index) => {
                const container = new pixi.Container()
                
                this.sceneContainer.addChild(container)
                container.zIndex = index

                return [name, container]
            })
            .reduce((acc, [name, container]) => {
                acc[name] = container
                return acc 
            }, {})

        this.inputProxy = game.input.getProxy()
        this.entities = new ECS()


        this.started = false
        this.load()
            .then(this.start())
            
        this.cdEntity = 0.4
        this.cdEntityProgress = 0.0
    }

    async load() {
        this.grid = new Grid()
        this.containers.grid.addChild(this.grid)

        await this.grid.loadFromFile("dev.json")

        // Todo: Temporary - Hacky solution to center everything based on grid's size
        this.sceneContainer.pivot = this.grid.pivot
        this.grid.pivot.set(0, 0)

        // Todo:vectors: fix into divide(Tile.size)
        const pathTiles = this.grid.getPathTiles()
                                   .map(tile => new Vec2(tile.pos).divide(new Vec2(Tile.Size, Tile.Size)))

        this.pathFinder = new PathFinder(
            pathTiles,
            { x: 3, y: 2 },
            { x: 14, y: 11 }
        )

        this.pathFinder.findPath()
        this.finalPath = this.pathFinder.getPath();
    }

    start() {
        this.started = true
    }

    close() {
        this.inputProxy.close()
    }

    createEntity() {
        const sprite = new pixi.Sprite.from("media/tile.png")
        sprite.anchor.set(0.5, 0.5)
        this.containers.entities.addChild(sprite)

        const components = {
            "transform": {
                pos: new Vec2(3 * Tile.Size, 2 * Tile.Size)
            },
            "display": {
                object: sprite
            },
            "movement": {
                speed: 200,
                destinations: this.finalPath
            },
            "health": {
                parent: this.containers.healthbars
            }
        }

        const entity = this.entities.createEntity(components)
        this.entities.initEntity(entity)

        entity.on("destReached", () => {
            this.entities.removeEntity(entity.id)
            console.log(`Entity ${entity.id} reached destination`)
        })
    }

    update(delta) {
        if (!this.started) return

        this.entities.update(delta)

        if (this.entities.count() < 70) {
            this.cdEntityProgress += delta
            if (this.cdEntityProgress >= this.cdEntity) {
                this.cdEntityProgress %= this.cdEntity
    
                this.createEntity()
            }
        }
    }
}