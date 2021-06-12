
const Layers = [
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

function getNumberedLayers(layers) {
    return layers.reduce((acc, name, index) => {
        acc[name] = index
        return acc
    }, {})
}

export default getNumberedLayers(Layers)
