import { wordToInt, intToWord } from "../utils/utils"
import { globalSheets } from "../globals"

export const rollResultHandler = function(result: DiceResult, callback: DiceResultCallback) {
    callback('DiceResultPopup', function(sheet: Sheet<unknown>) {
        const target = parseIntTag(result.allTags, /^target_/g, 0)
        const sheetSource = parseIntTag(result.allTags, /^sheet_/g, 0)
        const bf = parseIntTag(result.allTags, /^bf_/g, 0)
        const isAttack = result.allTags.indexOf("attack") !== -1
        const isDamage = result.allTags.indexOf("damage") !== -1
        const isCrit = result.allTags.indexOf("crit") !== -1
        const isPercutante = result.allTags.indexOf("percutante") !== -1
        const isEpuisante = result.allTags.indexOf("epuisante") !== -1
        if(!isDamage) {
            const diff = result.all[0].value - target
            if(diff > 0) {
                sheet.get("result_label").text("Échoué de " + Math.abs(diff))
            } else {
                sheet.get("result_label").text("Réussi de " + Math.abs(diff))
            }
            if(isAttack) {
                if(!isPercutante || isEpuisante) {
                    sheet.get("roll_damage").on("click", function() { 
                        log(sheetSource);
                        (isCrit ? rollCrit : rollDamage)(globalSheets[sheetSource], "Dégâts", 1, bf, []) 
                        sheet.get("roll_damage").show()
                    })
                }
                if(isPercutante) {
                    sheet.get("roll_damage_2").on("click", function() { 
                        (isCrit ? rollCrit : rollDamage)(globalSheets[sheetSource], "Dégâts", 1, bf, []) 
                    })
                    sheet.get("roll_damage_2").show()
                }
            }
        } else {
            log(result)
        }
    })
}

export const roll = function(sheet: Sheet<unknown>, title: string, target: number, tags: string[]) {
    tags.push("target_" + intToWord(target))
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    new RollBuilder(sheet)
        .expression("(1d100)[" + tags.join(',') + "]")
        .title(title)
        .roll()
}

export const rollDamage = function(sheet: Sheet<unknown>, title: string, nDice: number, bf: number, tags: string[]) {
    const tags_str = tags.length != 0 ? "[" + tags.join(',') + "]" : ""
    log("(keeph(" + nDice + "d10)" + bf + ")" + tags_str)
    new RollBuilder(sheet)
        .expression("(keeph(" + nDice + "d10) + " + bf + ")" + tags_str)
        .title(title)
        .roll()
}

export const rollCrit = function(sheet: Sheet<unknown>, title: string, nDice: number, bf: number, tags: string[]) {
    const tags_str = tags.length != 0 ? "[" + tags.join(',') + "]" : ""
    new RollBuilder(sheet)
        .expression("(expl(keeph(" + nDice + "d10)) + 10 + " + bf + ")" + tags_str)
        .title(title)
        .roll()
}


const parseIntTag = function(tags: string[], regex: RegExp, defaultValue: number): number {
    const res = tags.filter(function(e) { return regex.test(e) })
    if(res.length !== 0) {
        return wordToInt(res[0].split('_')[1])
    } else {
        return defaultValue
    }
}