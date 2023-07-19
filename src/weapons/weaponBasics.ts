import { roll } from "../roll/rollHandler"
import { intToWord } from "../utils/utils"

export const setPugilat = function(sheet: Sheet<CharData>) {
    sheet.get("pugilat").on("click", function(cmp) {
        const damageBonus = parseInt(sheet.get("BF").text()) - 4
        roll(sheet, "Pugilat", parseInt(sheet.get("CC").text()), ["attack", "pugilat", "damage_" + intToWord(damageBonus)])
    })
}

export const setArmeImpro = function(sheet: Sheet<CharData>, stat: Stat) {
    sheet.get("improvise_" + stat).on("click", function(cmp) {
        const damageBonus = parseInt(sheet.get("BF").text()) - 4
        roll(sheet, "Arme improvisée", parseInt(sheet.get(stat).text()), ["attack", "damage_" + intToWord(damageBonus)])
    })
}
