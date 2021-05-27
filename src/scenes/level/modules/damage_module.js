import IModule from "game/scenes/imodule"

export default class DamageModule extends IModule {
    static Name = "damageModule"

    setup() {
        game.on("deal_damage", this.onDealDamage)
    }

    close() {
        game.removeListener("deal_damage", this.onDealDamage)
    }

    onDealDamage = (event) => {
        const { target, source, amount } = event

        const health = target.getComponent("health")

        if (health) {
            if (health.isAlive() && health.reduce(amount)) {
                game.emit("enemy_killed", target)
            }
        }
        else {
            console.warn(`"deal_damage" event's target has no "health" component`)
        }
    }
}
