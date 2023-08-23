import { rollMagic } from "../roll/rollHandler"
import { setupRepeater2 } from "../utils/repeaters"
import { computed, intToWord, signal } from "../utils/utils"

const magies = {} as Record<string, Record<string, Record<string, Spell>>>
const typesMagie = Tables.get("types_magie")
typesMagie.each(function(type) {
    log(type)
    magies[type.id] = {}
    if(type.id !== "magie_mineure") {

        Tables.get(type.id).each(function(domain) {
            log(domain)
            magies[type.id][domain.id] = {}
            Tables.get(domain.id).each(function(spell) {
                log(spell)
                magies[type.id][domain.id][spell.id] = spell
            })
        })
    } else {
        magies[type.id][type.id] = {}
        Tables.get(type.id).each(function(spell) {
            magies[type.id][type.id][spell.id] = spell
        })
    }
})

export const setupMagicRepeater = function(sheet: Sheet) {
    const repeater = sheet.get("magic_repeater") as Component<Record<string, unknown>>
    setupRepeater2(repeater, setupMagicEditEntry, setupMagicViewEntry(sheet))
    
}

const setupMagicViewEntry = function(sheet: Sheet) {
    return function(entry: Component) {

        entry.find("spell_label").on("click", function(component: Component<unknown>) {
            const data = (sheet.get("magic_repeater").value() as Record<string, SpellKnown>)[component.index()]
            let target = data.difficulte
            if(data.use_ingredient === true) {
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
    }

}

const setupMagicEditEntry = function(entry: Component) {

    const mainCategoryCmp = entry.find("main_category") as Component<string>
    const mainCategory = signal(mainCategoryCmp.value())
    const subCategoryCmp = entry.find("sub_category") as ChoiceComponent
    const spellCmp = entry.find("spell_choice")
    const spellDomainCmp = entry.find("spell_domain")
    const subCategory = signal(subCategoryCmp.value() !== undefined ? subCategoryCmp.value() as string : Object.keys(magies[mainCategory()])[0])
    const spellChoice = signal(spellCmp.value !== undefined ? spellCmp.value() : Object.keys(magies[mainCategory()][subCategory()])[0])

    mainCategoryCmp.on("update", function(cmp) {
        mainCategory.set(cmp.value())
        subCategory.set(Object.keys(magies[mainCategory()])[0])
        spellDomainCmp.value(Tables.get(mainCategory()).get(subCategory()).name)
        spellChoice.set(Object.keys(magies[mainCategory()][subCategory()])[0])
    })

    subCategoryCmp.on("update", function(cmp) {
        subCategory.set(cmp.value())
        spellDomainCmp.value(Tables.get(mainCategory()).get(subCategory()).name)
        spellChoice.set(Object.keys(magies[mainCategory()][subCategory()])[0])
    })

    spellCmp.on("update", function(cmp) {
        spellChoice.set(cmp.value())
    })

    const spell = computed(function(){
        const spellData = magies[mainCategory()][subCategory()][spellChoice()]
        entry.find("spell_name").value(spellData.name)
        entry.find("spell_description").value(spellData.description)
        entry.find("incantation").value(spellData.incantation)
        entry.find("difficulte").value(spellData.difficulte)
        entry.find("ingredient").value(spellData.ingredient)
        entry.find("bonus_ingredient").value(spellData.bonus_ingredient)
        return spellData
    }, [spellChoice])

}

export const hideMagicDescription = function(entry: Component<unknown>) {
    entry.find("magic_desc_col").hide()
}