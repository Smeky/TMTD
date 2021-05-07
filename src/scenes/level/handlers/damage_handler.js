import IHandler from "game/scenes/handler"

export default class DamageHandler extends IHandler {
    static Name = "damageHandler"

    init() {
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
                game.emit("target_killed", target)
            }
        }
        else {
            console.warn(`"deal_damage" event's target has no "health" component`)
        }
    }
}
