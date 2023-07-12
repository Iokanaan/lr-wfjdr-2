import { roll } from "../roll/roll_handler"
import { setupRepeater } from "../utils/repeaters"

export const setup_weapon_repeater = function(sheet: Sheet<CharData>) {
    const repeater = sheet.get("weapons_repeater")
    setupRepeater(repeater, setup_weapon_edit_entry)
    repeater.on("click","weapon_name", function(component: Component<unknown>) {
        roll(sheet, component.text(), parseInt(sheet.get("CC").text()), ["attack"])
    });

}

export const setup_weapon_edit_entry = function(entry: Component<unknown>) {
    
}