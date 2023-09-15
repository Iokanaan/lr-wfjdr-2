import { roll } from "../roll/rollHandler"
import { intToWord } from "../utils/utils"

export const setPugilat = function(wSheet: WarhammerSheet) {
    wSheet.find("pugilat").on("click", function() {
        let target = wSheet.statSignals["CC"]()
        let damageBonus = parseInt(wSheet.find("BF").text()) - 4
        if(wSheet.talents().indexOf("combat_de_rue")) {
            target += 10
            damageBonus++
        }
        roll(wSheet.raw(), "Pugilat", target, ["attack", "pugilat", "damage_" + intToWord(damageBonus)])
    })
}

export const setArmeImpro = function(wSheet: WarhammerSheet, stat: Stat) {
    wSheet.find("improvise_" + stat).on("click", function() {
        let damageBonus = wSheet.statSignals["BF"]() - 4
        if((stat === "CC" && wSheet.talents().indexOf("coups_puissants") !== -1) || (stat === "CT" && wSheet.talents().indexOf("tir_en_puissance") !== -1)) {
            damageBonus++
        }
        roll(wSheet.raw(), "Arme improvisée", parseInt(wSheet.find(stat).text()), ["attack", "damage_" + intToWord(damageBonus)])
    })
}

export const setMunitionListener = function(wSheet: WarhammerSheet) {
    const row = wSheet.find("munition_row")
    row.hide()
    wSheet.find("munition_title").on("click", function() {
        if(row.visible()) {
            row.hide()
        } else {
            row.show()
        }
    })
}