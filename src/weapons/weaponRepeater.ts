import { setupRepeater } from "../utils/repeaters"

export const setup_weapon_repeater = function(sheet: Sheet<CharData>) {
    const repeater = sheet.get("weapons_repeater")
    setupRepeater(repeater, setup_weapon_edit_entry)
    repeater.on("click","weapon_name", function(component: Component<unknown>) {
        log(component.id())
    })

}

export const setup_weapon_edit_entry = function(entry: Component<unknown>) {
    
}