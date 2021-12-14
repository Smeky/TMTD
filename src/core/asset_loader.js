import { Loader } from "pixi.js"
import { partition, createRectTexture } from "game/utils"
import { Rect } from "game/graphics"

// How should we properly do this?
export const AssetList = [
    { name: "Tileset", url: "media/tileset.png" },

    // { name: "IconScorchingRay", url: "media/icons/items/Scorching_Ray_inventory_icon.png" },
    // { name: "IconFortify", url: "media/icons/items/Fortify_Support_inventory_icon.png" },

    { name: "BuildModeMask", url: "media/build_mask.png" },

    { name: "TowerBase1", textureDef: [50, 50, 0x35352f] },
    { name: "TowerBase2", textureDef: [50, 50, 0x955550] },
    { name: "TowerHead1", textureDef: [35,  8, 0xffff00] },
    { name: "TowerHead2", textureDef: [35,  8, 0x999999] },

    { name: "EnemyMrPink", textureDef: [16, 16, 0xffc0cb] }, 
    { name: "EnemyMrBlonde", textureDef: [16, 16, 0xfaf0be] }, 
    { name: "EnemyMrOrange", textureDef: [16, 16, 0xffa500] }, 
    { name: "EnemyMrWhite", textureDef: [16, 16, 0xffffff] }, 
    { name: "EnemyMrBrown", textureDef: [16, 16, 0x964b00] }, 
    { name: "EnemyEddie", textureDef: [16, 16, 0xadd8e6] }, 
    { name: "EnemyJoeCabot", textureDef: [32, 32, 0x9370db] }, 
    
    { name: "HealthBar", textureDef: [20, 4,  0xff0000] }, 
    { name: "BeamBase", textureDef: [4,  1,  0xffffff] }, 
    { name: "Bullet", textureDef: [4, 1.5,  0xffffff] }, 

    { name: "TowerOptionsButton", textureDef: [50, 50, 0xffffff] },
    { name: "InventorySlotBg", textureDef: [56, 56, 0xaaaaaa] },
    { name: "InventorySlotHightlight", textureDef: [56, 56, 0xffffff] },

    { name: "InventoryBg", url: "media/ui/inventory_bg.png" },
    { name: "InventorySlot", url: "media/ui/inventory_slot.png" },

    { name: "UIFunctionsBarButtonBg", textureDef: [42, 42, 0x35352f] }
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
        loader.onError.add(console.error)   // Todo: Not working? Check how this behaves (missing file, incorrect url, etc.)

        return new Promise((resolve) => {
            loader.load((loader, resources) => {
                const keys = Object.keys(resources)

                resolve(keys.reduce((textures, key) => {
                    textures[key] = resources[key].texture
                    return textures
                }, {}))
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
