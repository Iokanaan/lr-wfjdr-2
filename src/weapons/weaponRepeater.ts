import { roll } from "../roll/rollHandler"
import { setupRepeater } from "../utils/repeaters"

export const setupWeaponRepeater = function(sheet: Sheet<CharData>) {
    const repeater = sheet.get("weapons_repeater")
    setupRepeater(repeater, setupWeaponEditEntry)
    repeater.on("click","weapon_name", function(component: Component<unknown>) {
        roll(sheet, component.text(), parseInt(sheet.get("CC").text()), ["attack"])
    });

}

export const setupWeaponEditEntry = function(entry: Component<unknown>) {
    
}