import { roll } from "../roll/rollHandler"
import { setupRepeater } from "../utils/repeaters"
import { intToWord } from "../utils/utils"

export const setupWeaponRepeater = function(sheet: Sheet<unknown>) {
    const repeater = sheet.get("weapons_repeater") as Component<Record<string, WeaponData>>
    setupRepeater(repeater, setupWeaponEditEntry)
    repeater.on("click", "weapon_name", function(component: Component<unknown>) {
        const data = repeater.value()[component.index()]
        const entry = repeater.find(component.index())
        let damageBonus = (entry.find("degats") as Component<number>).value();
        if(data["bonus_bf"] === true) {
            damageBonus += parseInt((sheet.get("BF") as Component<string>).value())
        }
        const targetStat = data["type_arme"] === "1" ? "CC" : "CT"
        log(data)
        roll(sheet, component.text(), parseInt(sheet.get(targetStat).text()), ["attack, damage_" + intToWord(damageBonus)])
    })
}

export const setupWeaponEditEntry = function(entry: Component<unknown>) {
    const typeArmeInput = entry.find("type_arme")
    
    if(typeArmeInput.value() !== "1") {
        entry.find("distance_row").show()
    } else {
        entry.find("distance_row").hide()
    }
    typeArmeInput.on("update", function(cmp: Component<string>) {
        if(typeArmeInput.value() !== "1") {
            entry.find("distance_row").show()
        } else {
            entry.find("distance_row").hide()
        }
        entry.find("type_arme_as_int").value(parseInt(cmp.value()))
    })

    entry.find("bonus_bf").on("update", function(cmp: Component<boolean>) { 
        entry.find("bonus_bf_as_int").value(Number(cmp.value())) 
        log(entry.find("bonus_bf_as_int").value())
    })

    entry.find("attributs").on("update", function(component: Component<String[]>) {
        entry.find('attributs_label').value(component.value().join(", "))
    })
}