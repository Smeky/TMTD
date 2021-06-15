import { Loader } from "pixi.js"
import { partition, createRectTexture } from "game/utils"
import { Rect } from "game/graphics"

// How should we properly do this?
export const AssetList = [
    { name: "Tileset", url: "media/tileset.png" },

    { name: "IconScorchingRay", url: "media/icons/items/Scorching_Ray_inventory_icon.png" },
    { name: "IconFortify", url: "media/icons/items/Fortify_Support_inventory_icon.png" },

    { name: "TowerBase1", textureDef: [50, 50, 0x35352f] },
    { name: "TowerBase2", textureDef: [50, 50, 0x955550] },
    { name: "TowerHead1", textureDef: [8,  35, 0xffff00] }, 
    { name: "TowerHead2", textureDef: [8,  35, 0x999999] }, 

    { name: "EnemyMrPink", textureDef: [16, 16, 0xffc0cb] }, 
    { name: "EnemyMrBlonde", textureDef: [16, 16, 0xfaf0be] }, 
    { name: "EnemyMrOrange", textureDef: [16, 16, 0xffa500] }, 
    { name: "EnemyMrWhite", textureDef: [16, 16, 0xffffff] }, 
    { name: "EnemyMrBrown", textureDef: [16, 16, 0x964b00] }, 
    { name: "EnemyEddie", textureDef: [16, 16, 0xadd8e6] }, 
    { name: "EnemyJoeCabot", textureDef: [32, 32, 0x9370db] }, 
    
    { name: "HealthBar", textureDef: [20, 4,  0xff0000] }, 
    { name: "BeamBase", textureDef: [4,  1,  0xffffff] }, 
    { name: "Bullet", textureDef: [6,  2,  0xffffff] }, 

    { name: "TowerOptionsButton", textureDef: [50, 50, 0xffffff] },
    { name: "InventorySlotBg", textureDef: [56, 56, 0x404040] },
    { name: "InventorySlotHightlight", textureDef: [56, 56, 0xffffff] },
]

export default class AssetLoader {
    constructor() {
        this.assets = {}
    }

    async loadAssets(assetList) {
        const [assetFiles, assetTextures] = partition(assetList, asset => !asset.hasOwnProperty("textureDef"))

        const files = await this.loadFiles(assetFiles)
        const placeholders = await this.createPlaceholderTextures(assetTextures)

        this.assets = { ...files, ...placeholders }
    }

    async loadFiles(assetFiles) {
        const loader = Loader.shared

        loader.add(assetFiles)
        loader.onError.add(console.error)

        return new Promise((resolve) => {
            loader.load((loader, resources) => {
                resolve(resources)
            })
        })
    }

    async createPlaceholderTextures(textureArray) {
        return textureArray.reduce((acc, asset) => {
            const [w, h, color] = asset.textureDef
            acc[asset.name] = createRectTexture(new Rect(0, 0, w, h), color)

            return acc
        }, {})
    }
}
