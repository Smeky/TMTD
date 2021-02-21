export { default as Scene } from "./scene"
export { default as SceneHandler } from "./sceneHandler"

import LevelScene from "./level"
import EditorScene from "./editor"

export default {
    [LevelScene.__Name]: LevelScene,
    [EditorScene.__Name]: EditorScene,
}