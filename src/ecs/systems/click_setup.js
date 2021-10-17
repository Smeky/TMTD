import { ECSSystem } from "."

export default class ClickSetup extends ECSSystem {
    static Dependencies = ["clickable", "display"]

    setupComponents(entity) {
        const { display } = entity.components

        display.interactive = true
        display.on("click", () => { this.handleEntityClick(entity); console.log(entity) })
    }

    handleEntityClick(entity) {
        entity.components.clickable.onClick(entity)
    }
}
