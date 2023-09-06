import { wordToInt, intToWord } from "../utils/utils"
import { globalSheets } from "../globals"

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
                // Gestion de la magie
                if(rollTags.isRune) {
                    handleRune(sheet, result, rollTags)
                } else {
                    handleSpell(sheet, result, rollTags)
                }
            }
        } else {
            // Gestiion jets de dégâts
            handleDamage(sheet, result, rollTags)
        }
    })
}

export const roll = function(sheet: Sheet<unknown>, title: string, target: number, t: string[]) {
    // Transmission de la valeur cible et la feuille dans les tags
    const tags = []
    for(let i=0; i<t.length; i++) {
        tags.push(t[i])
    }
    tags.push("target_" + intToWord(target))
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    new RollBuilder(sheet)
        .expression("(1d100)[" + tags.join(',') + "]")
        .title(title)
        .roll()
}

export const rollMagic = function(sheet: Sheet<unknown>, title: string, nDice: number, target: number, t: string[]) {
    // Transmission de la valeur cible et la feuille dans les tags, ajout tu tag "magic"
    const tags = []
    for(let i=0; i<t.length; i++) {
        tags.push(t[i])
    }
    tags.push("magic")
    tags.push("target_" + intToWord(target))
    log(tags)
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    log("target dans roll" + target)
    if(tags.indexOf("vulgaire") !== -1 || tags.indexOf("noire") !== -1) {
        nDice++
    }
    let diceExpression = nDice + "d10"
    if(tags.indexOf("noire") !== -1) {
        diceExpression = "keeph(" + diceExpression + ", " + (nDice - 1) + ")"
    }
    log(intToWord(target))
    log(tags.join(','));
    new RollBuilder(sheet)
    .expression("(" + diceExpression + ")[" + tags.join(',') + "]")
    .title(title)
    .roll()
}

const rollDamage = function(sheet: Sheet<unknown>, title: string, nDice: number, damageBonus: number, t: string[]) {
    // Transmission de la fiche
    const tags = []
    for(let i=0; i<t.length; i++) {
        tags.push(t[i])
    }
    tags.push("sheet_" + intToWord(sheet.getSheetId()))
    new RollBuilder(sheet)
        // Jets en keeph pour prendre en compte l'attribut percutant
        .expression("(keeph(" + nDice + "d10) + " + damageBonus + ")[" + tags.join(',') + "]")
        .title(title)
        .roll()
}

const rollCrit = function(sheet: Sheet<unknown>, title: string, nDice: number, damageBonus: number, t: string[]) {
    // Comme damage, mais explosif
    const tags = []
    for(let i=0; i<t.length; i++) {
        tags.push(t[i])
    }
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
    
    // Inversion des chiffres du lancé pour déterminer la localisation
    let location = undefined
    if(roll !== 100) {
        const digits = roll.toString().slice(-2).split('')
        location = parseInt(digits[1] + digits[0]) 
    } else {
        location = 100
    }

    // Identification de la localisation
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

// Parse tous les tags reçus dans le lancé
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
        'isVulgaire': result.allTags.indexOf("vulgaire") !== -1,
        'isRune': result.allTags.indexOf("rune") !== -1,
        'isNoire': result.allTags.indexOf("noire") !== -1
    }
}

// Gestion d'un jet d'attaque
const handleAttack = function(sheet: Sheet<unknown>, rollTags: RollTags) {
    
    // Ajout des tags du jet de dégat (damage, lancé de référence pour la localisation, valeur cible de référence)
    const damageTags = ["damage", "roll_" + intToWord(rollTags.referenceRoll) , "target_" + intToWord(rollTags.target !== undefined ? rollTags.target : 0)]
    
    // Ajout du bouton roll 1d10 si arme n'est pas percutante
    if(!rollTags.isPercutante || rollTags.isEpuisante) {
        sheet.get("roll_damage").on("click", function() { (rollTags.isCrit ? rollCrit : rollDamage)(rollTags.sheetSource, "Dégâts", 1, rollTags.damageBonus, damageTags) })
        sheet.get("roll_damage").show()
    }
    // Ajout du buton roll 2d10 si arme est percutante
    if(rollTags.isPercutante) {
        sheet.get("roll_damage_2").on("click", function() { (rollTags.isCrit ? rollCrit : rollDamage)(rollTags.sheetSource, "Dégâts", 2, rollTags.damageBonus, damageTags) })
        sheet.get("roll_damage_2").show()
    }
}

// Gestion d'un D100
const handleD100 = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {

    // Si une valeur cible est définie, calculer la différence et indiquer si le jet est réussi ou échoué
    if(rollTags.target !== undefined) {
        const diff = result.total - rollTags.target
        sheet.get("result_label").text(result.total.toString())
        sheet.get("target_label").text("pour " + rollTags.target)
        if(diff > 0) {
            sheet.get("result_subtext").text("Échoué de " + Math.abs(diff))
        } else {
            sheet.get("result_subtext").text("Réussi de " + Math.abs(diff))
        }
    } else {
        sheet.get("result_label").text(result.total.toString())
    }
}

// Gestion d'un jet de Rune
const handleRune = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {

    // Si une valeur cible est définie, calculer la différence et indiquer si le jet est réussi ou échoué
    // Pas d'échec critques / échos du Chaos pour les runes
    if(rollTags.target !== undefined) {
        const diff = result.total - rollTags.target
        sheet.get("result_label").text(result.total.toString())
        sheet.get("target_label").text("pour " + rollTags.target)
        if(diff < 0) {
            sheet.get("result_subtext").text("Échoué de " + Math.abs(diff))
        } else {
            sheet.get("result_subtext").text("Réussi de " + Math.abs(diff))
        }
    } else {
        sheet.get("result_label").text(result.total.toString())
    }
}

// Gestion d'un jet de dégâts
const handleDamage = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {
    sheet.get("result_label").text(result.total > 0 ? result.total.toString() : "0")
    sheet.get("result_subtext").text(attackLocation(rollTags.referenceRoll))
    // Si jet de dégâts normal (pas un critique), et qu'on fait 10, on affiche la confirmation du critique
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

// Gestion d'un lancer de sort
const handleSpell = function(sheet: Sheet<unknown>, result: DiceResult, rollTags: RollTags) {
    
    // Si magie vulgaire, on retire un dé pour déterminer la somme
    let nDice = result.all.length

    if(rollTags.isNoire) {
        nDice--
    }

    let total = 0
    if(rollTags.isVulgaire) {
        nDice--
        for(let i=0; i<nDice; i++) {
            total += result.all[i].value
        }
    } else {
        total = result.total
    }
    sheet.get("result_label").text(total.toString())

    // On regarde si on a lancé que des 1, si oui échec critique
    let fumble = true
    for(let i=0; i<nDice; i++) {
        fumble = fumble && result.all[i].value === 1
    }
    if(fumble) {
        sheet.get("result_subtext_danger").text("Échec critique")
    } else {
        // Si pas de fumble, on indique si le jet est réussi ou non
        if(rollTags.target !== undefined) {
            sheet.get("target_label").text("pour " + rollTags.target)
            sheet.get("result_subtext").text(total >= rollTags.target ? "Réussi de " + (total - rollTags.target).toString() : "Échoué de " + (rollTags.target - total).toString())
        }
    }

    // On regarde si on a des doubles / triples..., si oui, écho du Chaos
    const nbDicesByValue: Record<string, number>= { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 0 }
    for(let i=0; i<result.all.length; i++) {
        nbDicesByValue[result.all[i].value]++
    }
    each(nbDicesByValue, function(val) {
        if(val > 1) {
            sheet.get("result_subtext_danger_2").text("Écho du Chaos")
            return
        }
    })
}