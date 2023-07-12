import { wordToInt, intToWord } from "../utils/utils"

export const rollResultHandler = function(result: DiceResult, callback: DiceResultCallback) {
    callback('DiceResultPopup', function(sheet: Sheet<unknown>) {
        const target = wordToInt(result.allTags.filter(function(e) { return /^target_/g.test(e) })[0].split('_')[1])
        const diff = result.all[0].value - target
        if(diff > 0) {
            sheet.get("result_label").text("Échoué de " + Math.abs(diff))
        } else {
            sheet.get("result_label").text("Réussi de " + Math.abs(diff))
        }
    })
}

export const roll = function(sheet: Sheet<unknown>, title: string, target: number, tags: string[]) {
    tags.push("target_" + intToWord(target))
    new RollBuilder(sheet)
        .expression("(1d100)[" + tags.join(',') + "]")
        .title(title)
        .roll();
}
