
export const LayerList = [
    "Grid",
    "TowerBase",
    "EnemyBase",
    "TowerSelection",
    "Bullets",
    "Beams",
    "BuildmodeTiles",
    "BuildmodeHighlight",
    "EnemyHealthBar",
    "TowerOptions",
]

// The list gets reversed so the top elements have highest zIndex value, thus being in front
// Spits out {"layerAbc": 0, ...}
const NamedLayers = LayerList.reverse().reduce((acc, item, index) => {
    acc[item] = index
    return acc
}, {})

export default NamedLayers
