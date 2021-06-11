export { default as IModule } from "./imodule"
export { default as IScene } from "./iscene"
export { default as SceneManager } from "./scene_manager"

import LevelScene from "./level"
import EditorScene from "./editor"

export default {
    [LevelScene.Name]: LevelScene,
    [EditorScene.Name]: EditorScene,
}
