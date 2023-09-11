import { roll } from "../roll/rollHandler"
import { intToWord } from "../utils/utils"

export const setPugilat = function(sheet: Sheet<CharData>, statSignals: StatSignals, talents: Computed<string[]>) {
    sheet.get("pugilat").on("click", function() {
        let target = statSignals["CC"]()
        let damageBonus = parseInt(sheet.get("BF").text()) - 4
        if(talents().indexOf("combat_de_rue")) {
            target += 10
            damageBonus++
        }
        roll(sheet, "Pugilat", target, ["attack", "pugilat", "damage_" + intToWord(damageBonus)])
    })
}

export const setArmeImpro = function(sheet: Sheet<CharData>, stat: Stat, statSignals: StatSignals, talents: Computed<string[]>) {
    sheet.get("improvise_" + stat).on("click", function() {
        let damageBonus = statSignals["BF"]() - 4
        if((stat === "CC" && talents().indexOf("coups_puissants") !== -1) || (stat === "CT" && talents().indexOf("tir_en_puissance") !== -1)) {
            damageBonus++
        }
        roll(sheet, "Arme improvisée", parseInt(sheet.get(stat).text()), ["attack", "damage_" + intToWord(damageBonus)])
    })
}

export const setMunitionListener = function(sheet: Sheet<CharData>) {
    const row = sheet.get("munition_row")
    row.hide()
    sheet.get("munition_title").on("click", function() {
        if(row.visible()) {
            row.hide()
        } else {
            row.show()
        }
    })
}