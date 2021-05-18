export { default as IScene } from "./scene"
export { default as SceneHandler } from "./scene_handler"

import LevelScene from "./level"
import EditorScene from "./editor"

export default {
    [LevelScene.__Name]: LevelScene,
    [EditorScene.__Name]: EditorScene,
}
