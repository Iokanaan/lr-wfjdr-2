import { rollMagic } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"

const magies = {} as Record<string, Record<string, Record<string, Spell>>>
const typesMagie = Tables.get("types_magie")
typesMagie.each(function(type: DomaineMagie) {
    magies[type.id] = {}
    if(type.id !== "magie_mineure") {
        Tables.get(type.id as string).each(function(domain: DomaineMagie) {
            magies[type.id][domain.id] = {}
            Tables.get(domain.id).each(function(spell: Spell) {
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

export const setupMagicViewEntry = function(advancedSkills: Computed<string[]>, armorLevel: Computed<ArmorLevel | null>, hasBouclier: Computed<boolean>, talents: Computed<string[]>) {
    return function(entry: Component<SpellKnown>) {

        const tags = computed(function() {
            const tags: string[] = []
            log(entry.value())
            if(talents().indexOf("magie_noire") !== -1 && entry.value().main_category === "sombres_savoirs") {
                tags.push("noire")
            }
            if(talents().indexOf("magie_vulgaire") !== -1 && advancedSkills().indexOf("Langage mystique") === -1) {
                tags.push("vulgaire")
            }
            return tags
        }, [talents, advancedSkills])
        
        const malus = computed(function() {
            let malus = hasBouclier() ? 1 : 0
            switch(armorLevel()) {
                case "Plaques":
                    malus = 5
                    break
                case "Mailles":
                    malus = 3
                    break
                case "Cuir":
                    malus = 1
                    break
                default:
            }
            if(talents().indexOf("incantation_de_bataille") !== -1) {
                malus = Math.max(malus + 3, 0)
            }
            return malus
        }, [armorLevel, hasBouclier, talents]) 

        // Lancement du sort au click sur son nom
        entry.find("spell_label").on("click", function(component: Component<unknown>) {
            // Définition de la difficulté, avec un ajustement si ingrédient
            let target = entry.value().difficulte + malus()
            if(entry.find("use_ingredient").value() === true) {
                target -= entry.value().bonus_ingredient
            }

            // Reprise du nombre de dés à lancer
            let castLevel = entry.sheet().get("cast_level").value() as number
            if(castLevel === null) {
                castLevel = parseInt(entry.sheet().get("Mag").text()) as number
            }
        
            // Lancer des dés
            rollMagic(entry.sheet(), component.text(), castLevel, target, tags())
        })
        
        // Affichage de la description du sort au click sur le livre
        entry.find("magic_display").on("click", function() {
            const desc = entry.find("magic_desc_col")
            if(desc.visible()) {
                desc.hide()
            } else {
                desc.show()
            }
        })
    
        // Gestion du Binding
        Bindings.add(entry.value().spell_name, "bind_spell", "MagieDisplay", function() {
            return entry.value()
        })
        entry.find("bind_spell").on("click", function() {
            Bindings.send(entry.sheet(), entry.value().spell_name)
        })
    }
}


export const setupMagicEditEntry = function(entry: Component) {

    const mainCategoryCmp = entry.find("main_category") as Component<string>
    const subCategoryCmp = entry.find("sub_category") as ChoiceComponent<string>
    const spellCmp = entry.find("spell_choice") as ChoiceComponent<string>
    const spellDomainCmp = entry.find("spell_domain") as Component<string>

    const mainCategory = signal(mainCategoryCmp.value())

    // Transition en mode sort personnalisé au click sur les outils
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

    // Calcul et set les sous-catégories en fonction de la catégorie principale
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
        entry.find("difficulte").value(parseInt(spellData.difficulte))
        entry.find("ingredient").value(spellData.ingredient)
        entry.find("bonus_ingredient").value(parseInt(spellData.bonus_ingredient))
        return spellData
    }, [spellSelected])

}