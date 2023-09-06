import { roll } from "../roll/rollHandler"
import { intToWord } from "../utils/utils"

export const setPugilat = function(sheet: Sheet<CharData>, statSignals: StatSignals) {
    sheet.get("pugilat").on("click", function() {
        const damageBonus = parseInt(sheet.get("BF").text()) - 4
        roll(sheet, "Pugilat", statSignals["CC"](), ["attack", "pugilat", "damage_" + intToWord(damageBonus)])
    })
}

export const setArmeImpro = function(sheet: Sheet<CharData>, stat: Stat, statSignals: StatSignals) {
    sheet.get("improvise_" + stat).on("click", function() {
        const damageBonus = statSignals["BF"]() - 4
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