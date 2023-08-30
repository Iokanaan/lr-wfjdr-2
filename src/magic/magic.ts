import { rollMagic } from "../roll/rollHandler"
import { setupRepeater } from "../utils/repeaters"
import { computed, intToWord, signal } from "../utils/utils"

const magies = {} as Record<string, Record<string, Record<string, Spell>>>
const typesMagie = Tables.get("types_magie")
typesMagie.each(function(type: DomaineMagie) {
    log(type)
    magies[type.id] = {}
    if(type.id !== "magie_mineure") {
        Tables.get(type.id as string).each(function(domain: DomaineMagie) {
            log(domain)
            magies[type.id][domain.id] = {}
            Tables.get(domain.id).each(function(spell: Spell) {
                log(spell)
                magies[type.id][domain.id][spell.id] = spell
            })
        })
    } else {
        magies[type.id][type.id] = {}
        Tables.get(type.id as string).each(function(spell: Spell) {
            magies[type.id][type.id][spell.id] = spell
        })
    }
})

export const setupMagicRepeater = function(sheet: Sheet) {
    const repeater = sheet.get("magic_repeater") as Component<Record<string, unknown>>
    setupRepeater(repeater, setupMagicEditEntry, setupMagicViewEntry(sheet))
    
}

const setupMagicViewEntry = function(sheet: Sheet) {
    return function(entry: Component) {

        entry.find("spell_label").on("click", function(component: Component<unknown>) {
            const data = (sheet.get("magic_repeater").value() as Record<string, SpellKnown>)[component.index()]
            let target = data.difficulte
            log(entry.find("use_ingredient").value())
            if(entry.find("use_ingredient").value() === true) {
                target -= data.bonus_ingredient
            }
            let castLevel = sheet.get("cast_level").value() as number
            if(castLevel === null) {
                castLevel = sheet.get("Mag").value() as number
            }
            rollMagic(sheet, component.text(), castLevel, target, ["magic, target_" + intToWord(target)])
        })
    
        entry.find("magic_display").on("click", function(cmp: Component<unknown>) {
            const desc = entry.find("magic_desc_col")
            if(desc.visible()) {
                desc.hide()
            } else {
                desc.show()
            }
        })

        log(entry.value())
        Bindings.add(entry.value().spell_name, "bind_spell", "MagieDisplay", function() {
            return { 
                "spell_name": entry.value().spell_name,
                "spell_domain": entry.value().spell_domain,
                "incantation": entry.value().incantation,
                "difficulte": entry.value().difficulte,
                "ingredient": entry.value().ingredient,
                "bonus_ingredient": entry.value().bonus_ingredient,
                "spell_description": entry.value().spell_description
            }
        })

        entry.find("bind_spell").on("click", function() {
            Bindings.send(entry.sheet(), entry.value().spell_name)
        })
    }

}

const setupMagicEditEntry = function(entry: Component) {

    const mainCategoryCmp = entry.find("main_category") as Component<string>
    const mainCategory = signal(mainCategoryCmp.value())
    const subCategoryCmp = entry.find("sub_category") as ChoiceComponent<string>
    const spellCmp = entry.find("spell_choice") as ChoiceComponent<string>
    const spellDomainCmp = entry.find("spell_domain")

    entry.find("display_custom").on("click", function() {
        const predefRow = entry.find("predef_row")
        const customRow = entry.find("custom_row")
        if(predefRow.visible()) {
            predefRow.hide()
            customRow.show()
        } else {
            predefRow.show()
            customRow.hide()
        }
    })


    const subCategoryChoices = computed(function() {
        const subCatChoices = {} as Record<string, string>
        if(mainCategory() !== "magie_mineure") {
            Tables.get(mainCategory()).each(function(subCat: DomaineMagie) {
                subCatChoices[subCat.id] = subCat.long_name 
            })
        } else {
            subCatChoices["magie_mineure"] = "Magie mineure"
        }
        subCategoryCmp.setChoices(subCatChoices)
        return subCatChoices
    }, [mainCategory])

    if(subCategoryChoices()[subCategoryCmp.value()] === undefined) {
        subCategoryCmp.value(Object.keys(magies[mainCategory()])[0])
    }
    const subCategorySelected = signal(subCategoryCmp.value())

    computed(function() {
        if(subCategorySelected() !== "magie_mineure") {
            spellDomainCmp.value(Tables.get(mainCategory()).get(subCategorySelected()).name)
        } else {
            spellDomainCmp.value(Tables.get("types_magie").get(subCategorySelected()).name)
        }
    }, [subCategorySelected])

    const spellChoices = computed(function() {
        const spells = {} as Record<string, string>
        Tables.get(subCategorySelected()).each(function(spell: Spell) {
            spells[spell.id] = spell.name 
        })
        spellCmp.setChoices(spells)
        return spells
    }, [subCategorySelected])

    if(spellChoices()[spellCmp.value()] === undefined) {
        spellCmp.value((Object.keys(magies[mainCategory()][subCategorySelected()])[0]))
    }

    const spellSelected = signal(spellCmp.value())

    mainCategoryCmp.on("update", function(cmp) {
        mainCategory.set(cmp.value())
        if(subCategoryChoices()[subCategoryCmp.value()] === undefined) {
            subCategoryCmp.value(Object.keys(magies[mainCategory()])[0])
        }
        subCategorySelected.set(subCategoryCmp.value())
        if(spellChoices()[spellCmp.value()] === undefined) {
            spellCmp.value((Object.keys(magies[mainCategory()][subCategorySelected()])[0]))
        }
        spellSelected.set(spellCmp.value())
    })


    subCategoryCmp.on("update", function(cmp) {
        subCategorySelected.set(cmp.value())
        if(spellChoices()[spellCmp.value()] === undefined) {
            spellCmp.value((Object.keys(magies[mainCategory()][subCategorySelected()])[0]))
        }
        spellSelected.set(spellCmp.value())
    })

    spellCmp.on("update", function(cmp) {
        spellSelected.set(cmp.value())
    })

    const spell = computed(function(){
        const spellData = magies[mainCategory()][subCategorySelected()][spellSelected()]
        entry.find("spell_name").value(spellData.name)
        entry.find("spell_description").value(spellData.description)
        entry.find("incantation").value(spellData.incantation)
        entry.find("difficulte").value(spellData.difficulte)
        entry.find("ingredient").value(spellData.ingredient)
        entry.find("bonus_ingredient").value(spellData.bonus_ingredient)
        return spellData
    }, [spellSelected])

}

export const hideMagicDescription = function(entry: Component<unknown>) {
    entry.find("magic_desc_col").hide()
}