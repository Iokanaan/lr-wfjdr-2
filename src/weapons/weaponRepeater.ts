import { setupRepeater } from "../utils/repeaters"

export const setup_weapon_repeater = function(sheet: Sheet<CharData>) {
    setupRepeater(sheet.get("weapons_repeater"), setup_weapon_edit_entry)
}

export const setup_weapon_edit_entry = function(entry: Component<unknown>) {
    entry.find("")
}