

export class Cooldown {
    constructor(total, progress = 0.0) {
        this.total = total
        this.progress = progress

        this.running = true
    }

    update(delta) {
        this.progress += delta
        return this.ready()
    }

    stop() {
        this.running = false
    }

    resume() {
        this.running = true
    }

    reset() {
        this.progress = 0.0
        this.running = true
    }

    ready() {
        return this.progress >= this.total
    }
}