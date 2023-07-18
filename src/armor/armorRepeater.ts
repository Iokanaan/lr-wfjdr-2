import { setupRepeater } from "../utils/repeaters"

export const setupArmorRepeater = function(sheet: Sheet<unknown>) {
    const repeater = sheet.get("armor_repeater") as Component<Record<string, ArmorData>>
    setupRepeater(repeater, setupArmorEditEntry)
}

export const setupArmorEditEntry = function(entry: Component<unknown>) {

}