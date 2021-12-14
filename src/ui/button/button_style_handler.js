import { BevelFilter, OutlineFilter } from "pixi-filters"

const FilterIds = {
    MouseOver: "buttonMouseOver",
    Active: "buttonActive",
}

export default class DefaultStyleHandler {
    constructor(button) {
        this.filters = {
            [FilterIds.MouseOver]: new OutlineFilter(1, 0xffffff),
            [FilterIds.Active]: new BevelFilter({ thickness: 3, lightColor: 0xffffff, rotation: 225, lightAlpha: 0.1 })
        }
        
        const filters = Object.values(this.filters)
        button.filters = button.filters ? button.filters.concat(filters) : filters

        this.resting(button)
    }

    update(button, prevState) {
        const { Resting, Active, MouseOver, Disabled } = button.States

        switch(button.state) {
            case Resting: this.resting(button, prevState); break;
            case Active: this.active(button, prevState); break;
            case MouseOver: this.mouseover(button, prevState); break;
            case Disabled: this.disabled(button, prevState); break;
            default: throw new Error(`Invalid button state "${newState}"`)
        }
    }

    resting(button, prevState) {
        for (const filter of Object.values(this.filters)) {
            filter.enabled = false
        }

        if (button.icon && prevState === button.States.Active) {
            button.icon.position.x -= 1
            button.icon.position.y -= 1
        }
    }

    active(button, prevState) {
        this.filters[FilterIds.MouseOver].enabled = false
        this.filters[FilterIds.Active].enabled = true
        
        if (button.icon) {
            button.icon.position.x += 1
            button.icon.position.y += 1
        }
    }
    
    mouseover(button, prevState) {
        this.filters[FilterIds.MouseOver].enabled = true
        
        if (prevState === button.States.Active) {
            this.filters[FilterIds.Active].enabled = false
            
            if (button.icon) {
                button.icon.position.x -= 1
                button.icon.position.y -= 1
            }
        }
    }
    
    disabled(button, prevState) {
        
    }
}
