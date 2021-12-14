import { Game } from "game/";
import { Button, Widget } from "game/ui";
import { createCrossIcon, createUpgradeIcon } from "game/ui/icons";
import { IModule } from ".";
import { Container, Sprite } from "pixi.js" 

export default class FunctionsBar extends IModule {
    setup() {
        const buttonDef = [
            { 
                id: "upgrade",
                icon: Game.renderer.generateTexture(createUpgradeIcon(0xffeb74)), 
            },
            { 
                id: "remove",
                icon: Game.renderer.generateTexture(createCrossIcon(0xa20e0e)), 
            },
        ]
        
        this.container = Game.ui.addChild(new Widget())
        // const texture = Game.assets["TowerOptionsButton"]
        
        this.buttons = buttonDef.reduce((acc, def, index) => {
            const icon = new Container()
            const iconBg = icon.addChild(new Sprite(Game.assets["UIFunctionsBarButtonBg"]))
            const iconImg = icon.addChild(new Sprite(def.icon))

            {
                const { width, height } = iconBg.getLocalBounds()
                iconImg.anchor.set(0.5, 0.5)
                iconImg.position.set(width / 2, height / 2)
            }

            const button = new Button({ icon })
            const { height } = button.getLocalBounds()

            button.y = index * (height + 5)
            button.on("click", () => this.toggleFunction(def.id))

            this.container.addChild(button)
            
            acc[def.id] = button
            return acc
        }, {})

        const { width, height } = this.container.getLocalBounds()
        this.container.pivot.y = height / 2
        this.container.x = Game.renderer.width - width - 5
        this.container.y = Game.renderer.height / 2
    }

    toggleFunction(funcId) {
        console.log(funcId)
    }
}