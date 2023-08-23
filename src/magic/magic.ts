import { rollMagic } from "../roll/rollHandler"
import { setupRepeater2 } from "../utils/repeaters"
import { computed, intToWord, signal } from "../utils/utils"

const magies = {} as Record<string, Record<string, Record<string, string>>>
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
            const data = (sheet.get("magic_repeater").value() as Record<string, SpellData>)[component.index()]
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
    const spellDomainCmp = entry.find("spell_domain")

    const subCategory = computed(function() {
        if(mainCategory() === "magie_mineure") {
            subCategoryCmp.setChoices({"magie_mineure": "Magie mineure"})
            subCategoryCmp.value("magie_mineure");
            return "magie_mineure"
        }
        const domaines = {} as Record<string, string>
        Tables.get(mainCategory()).each(function(domaine: DomaineObject) {
            domaines[domaine.id] = domaine.long_name;
        })
        subCategoryCmp.setChoices(domaines);
        return domaines[0]
    }, [mainCategory])

    const spellDomainLabel = computed(function() {
        const val = Tables.get(mainCategory()).get(subCategory()).name
        spellDomainCmp.value(val)
        return val
    }, [mainCategory, subCategory])

    const spellKey = computed(function() {
        Tables.get(subCategory()).each(function(domaine: DomaineObject) {
            subCategories[domaine.id] = domaine.long_name;
        })
        
    }, [subCategory])

    const spellData = computed(function(){
        const spell_data = Tables.get(subCategory()).get(spellKey())
        entry.find("spell_name").value(spell_data.name)
        entry.find("spell_description").value(spell_data.description)
        entry.find("incantation").value(spell_data.incantation)
        entry.find("difficulte").value(spell_data.difficulte)
        entry.find("ingredient").value(spell_data.ingredient)
        entry.find("bonus_ingredient").value(spell_data.bonus_ingredient)
    }, [subCategory, spellKey])

}

export const hideMagicDescription = function(entry: Component<unknown>) {
    entry.find("magic_desc_col").hide()
}