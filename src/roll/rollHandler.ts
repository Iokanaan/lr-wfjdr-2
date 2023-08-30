import { wordToInt, intToWord } from "../utils/utils"
import { globalSheets } from "../globals"

type RollTags = {
    target?: number,
    sheetSource: Sheet<unknown>,
    isAttack: boolean,
    isDamage: boolean,
    isCrit: boolean,
    isPercutante: boolean,
    isEpuisante: boolean,
    referenceRoll: number,
    damageBonus: number,
    isMagic: boolean,
    isVulgaire: boolean
}

export const rollResultHandler = function(result: DiceResult, callback: DiceResultCallback) {
    callback('DiceResultPopup', function(sheet: Sheet<unknown>) {
        sheet.get("roll_damage").hide()
        sheet.get("roll_damage_2").hide()
        sheet.get("crit_confirmation").hide()
        const rollTags = parseTags(sheet, result)

        if(!rollTags.isDamage) {
            if(!rollTags.isMagic) {
                // Gestion Jet 1d100
                handleD100(sheet, result, rollTags)
                // Si jet d'attaque, on affiche les boutons de dégâts
                if(rollTags.isAttack) {
                    handleAttack(sheet, rollTags)
                }
            } else {
                handleSpell(sheet, result, rollTags)
            }
        } else {
            handleDamage(sheet, result, rollTags)
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

export const rollMagic = function(sheet: Sheet<unknown>, title: string, nDice: number, target: number, tags: string[]) {
    tags.push("magic")
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    if(tags.indexOf("vulgaire") !== -1) {
        nDice + 1
    }
    new RollBuilder(sheet)
    .expression("(" + nDice + "d10)[" + tags.join(',') + "]")
    .title(title)
    .roll()
}

const rollDamage = function(sheet: Sheet<unknown>, title: string, nDice: number, damageBonus: number, tags: string[]) {
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    new RollBuilder(sheet)
        .expression("(keeph(" + nDice + "d10) + " + damageBonus + ")[" + tags.join(',') + "]")
        .title(title)
        .roll()
}

const rollCrit = function(sheet: Sheet<unknown>, title: string, nDice: number, damageBonus: number, tags: string[]) {
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    tags.push("crit")
    const tags_str = tags.length != 0 ? "[" + tags.join(',') + "]" : ""
    new RollBuilder(sheet)
        .expression("(expl(keeph(" + nDice + "d10)) + 10 + " + damageBonus + ")" + tags_str)
        .title(title)
        .roll()
}

const parseIntTag = function(tags: string[], regex: RegExp): number | undefined {
    const res = tags.filter(function(e) { return regex.test(e) })
    if(res.length !== 0) {
        return wordToInt(res[0].split('_')[1])
    } else {
        return undefined
    }
}

const attackLocation = function(roll: number) {
    let location = undefined
    if(roll !== 100) {
        const digits = roll.toString().slice(-2).split('')
        location = parseInt(digits[1] + digits[0]) 
    } else {
        location = 100
    }

    switch(true) {
        case location <= 15:
            return "Tête"
        case location <= 35:
            return "Bras droit"
        case location <= 55:
            return "Bras gauche"
        case location <= 80:
            return "Torse"
        case location <= 90:
            return "Jambe droite"
        default:
            return "Jambe gauche"
    }
}

const parseTags = function(sheet: Sheet<unknown>, result: DiceResult): RollTags {
    let referenceRoll = parseIntTag(result.allTags, /^roll_/g)
    if(referenceRoll === undefined) {
        referenceRoll = result.total
    }
    let sheetSourceId = parseIntTag(result.allTags, /^sheet_/g)
    let damageBonus = parseIntTag(result.allTags, /^damage_/g)
    if (damageBonus === undefined) {
        damageBonus = 0
    }
    return {
        'target': parseIntTag(result.allTags, /^target_/g),
        'sheetSource': sheetSourceId !== undefined ? globalSheets[sheetSourceId] : sheet,
        'isAttack': result.allTags.indexOf("attack") !== -1,
        'isDamage': result.allTags.indexOf("damage") !== -1,
        'isCrit': result.allTags.indexOf("crit") !== -1,
        'isPercutante': result.allTags.indexOf("percutante") !== -1,
        'isEpuisante': result.allTags.indexOf("epuisante") !== -1,
        'referenceRoll': referenceRoll,
        'damageBonus': damageBonus,
        'isMagic': result.allTags.indexOf("magic") !== -1,
        'isVulgaire': result.allTags.indexOf("vulgaire") !== -1
    }
}

const handleAttack = function(sheet: Sheet<unknown>, rollTags: RollTags) {
    const damageTags = ["damage", "roll_" + intToWord(rollTags.referenceRoll) , "target_" + intToWord(rollTags.target !== undefined ? rollTags.target : 0)]
    if(!rollTags.isPercutante || rollTags.isEpuisante) {
        sheet.get("roll_damage").on("click", function() { (rollTags.isCrit ? rollCrit : rollDamage)(rollTags.sheetSource, "Dégâts", 1, rollTags.damageBonus, damageTags) })
        sheet.get("roll_damage").show()
    }
    if(rollTags.isPercutante) {
        sheet.get("roll_damage_2").on("click", function() { (rollTags.isCrit ? rollCrit : rollDamage)(rollTags.sheetSource, "Dégâts", 2, rollTags.damageBonus, damageTags) })
        sheet.get("roll_damage_2").show()
    }
}

const handleD100 = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {
    if(rollTags.target !== undefined) {
        const diff = result.total - rollTags.target
        if(diff > 0) {
            sheet.get("result_label").text(result.total.toString())
            sheet.get("result_subtext").text("Échoué de " + Math.abs(diff))
        } else {
            sheet.get("result_label").text(result.total.toString())
            sheet.get("result_subtext").text("Réussi de " + Math.abs(diff))
        }
    } else {
        sheet.get("result_label").text(result.total.toString())
    }
}


const handleDamage = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {
    sheet.get("result_label").text(result.total > 0 ? result.total.toString() : "0")
    sheet.get("result_subtext").text(attackLocation(rollTags.referenceRoll))
    // Si jet de dégâts normal, et qu'on fait 10, on affiche la confirmation du critique
    const target = rollTags.target !== undefined ? rollTags.target : 0
    if(!rollTags.isCrit) {
        for(let i=0; i<result.all.length; i++) {
            if(!result.all[i].discarded && result.all[i].value === 10) {
                sheet.get("crit_confirmation").on("click", function() {
                    roll(rollTags.sheetSource, "Fureur d'Ulric", target, ["attack", "crit", "roll_" + intToWord(rollTags.referenceRoll)])
                })
                sheet.get("crit_confirmation").show()
                break;
            }
        }
    }
}

const handleSpell = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {
    let nDices = result.all.length
    if(rollTags.isVulgaire) {
        nDices--
    }
    let total = 0
    for(let i=0; i<nDices; i++) {
        total += result.all[i].value
    }
    sheet.get("result_label").text(total.toString())
    const nbDicesByValue: Record<string, number>= { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 }
    let fumble = true
    for(let i=0; i<result.all.length; i++) {
        nbDicesByValue[result.all[i].value]++
        fumble = fumble && result.all[i].value === 1
    }
    if(fumble) {
        sheet.get("result_subtext_danger").text("Échec critique")
    } else {
        if(rollTags.target !== undefined) {
            sheet.get("result_subtext").text(total >= rollTags.target ? "Réussi de " + (total - rollTags.target).toString() : "Échoué de " + (rollTags.target - total).toString())
        }
    }
    each(nbDicesByValue, function(val) {
        if(val > 1) {
            sheet.get("result_subtext_danger_2").text("Écho du Chaos")
            return
        }
    })
}