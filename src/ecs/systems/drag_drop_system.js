import { ECSSystem } from "."

export default class DragDropSystem extends ECSSystem {
    static Dependencies = ["dropTarget", "display"]

    setupEntity(entity) {
        const { dropTarget, display } = entity.components

        display.on("dragdrop", (dragAndDrop) => {
            if (dragAndDrop.type === "item") {
                dropTarget.onDrop(dragAndDrop.conclude())
            }
        })
    }
}
