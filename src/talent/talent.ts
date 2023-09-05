import { talents, talentsByEntry } from "../globals"
import { computed, signal } from "../utils/utils"

const talents_choices: Record<"maitrise" | "magie_commune" | "science_de_la_magie" | "sombre_savoir" | "inspiration_divine" | "magie_mineure", Record<string, string>> & Record<string, undefined | Record<string,string>> = {
    "maitrise" : {},
    "magie_commune" : {},
    "science_de_la_magie" : {},
    "sombre_savoir": {},
    "inspiration_divine": {},
    "magie_mineure": {}
}

// Remplir tous les sous-type de talents dans des tableaux
Tables.get("groupe_armes").each(function(val) {
    talents_choices["maitrise"][val.name] = val.name  
})
Tables.get("magies_communes").each(function(val) {
    talents_choices["magie_commune"][val.name] = val.long_name  
})
Tables.get("domaines_occultes").each(function(val) {
    talents_choices["science_de_la_magie"][val.name] = val.long_name  
})
Tables.get("sombres_savoirs").each(function(val) {
    talents_choices["sombre_savoir"][val.name] = val.long_name  
})
Tables.get("domaines_divins").each(function(val) {
    talents_choices["inspiration_divine"][val.name] = val.long_name  
})
Tables.get("magie_mineure").each(function(val) {
    talents_choices["magie_mineure"][val.name] = val.name  
})

export const setupTalentViewEntry = function(entry: Component) {
    
    entry.find("talent_display").on("click", function(cmp: Component) {
        const desc = entry.find("talent_desc_col")
        if(desc.visible()) {
            desc.hide()
        } else {
            desc.show()
        }
    })
    
    Bindings.add(entry.value().talent_name, "bind_talent", "TalentDisplay", function() {
        return entry.value()
    })
    entry.find("bind_talent").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().talent_name)
    })

    const allTalents = talentsByEntry()
    allTalents[entry.id()] = entry.value().nom_talent_choice
    talentsByEntry.set(allTalents)
}

export const setupTalentEditEntry = function(entry: Component<unknown>) {

    const subtypeChoiceCmp = entry.find("subtype_choice") as ChoiceComponent<string>
    const talentValCmp = entry.find("nom_talent_choice")
    const subtypeCmp = entry.find("talent_subtype") as Component<string | null>

    // Définition du talent dans un signal
    const talentVal = signal(talentValCmp.value())

    computed(function() {
        const choiceList = talents_choices[talentVal()]
        // Si le talent choisi possède des sous-types, alors on affiche la liste déroulante associée
        if(choiceList !== undefined) {
            subtypeChoiceCmp.setChoices(choiceList)
            if(choiceList[subtypeChoiceCmp.value()] === undefined) {
                subtypeChoiceCmp.value(Object.keys(choiceList)[0])
                subtypeCmp.value(Object.values(choiceList)[0])
            }
            subtypeChoiceCmp.show()
        } else {
            // Si non on met tous les champs associés aux sous-type à null
            subtypeChoiceCmp.setChoices({})
            subtypeCmp.value(null)
            subtypeChoiceCmp.hide()
        }
    }, [talentVal])
    
    // Affichage des description au choix du talent
    entry.find("nom_talent_choice").on("update", function(cmp: Component<string>) {
        entry.find("talent_desc").value(Tables.get("talents").get(cmp.value()).description)
        entry.find("talent_name").value(Tables.get("talents").get(cmp.value()).name)
        talentVal.set(cmp.value())
    })

    // Gestion du sous-type
    subtypeChoiceCmp.on("update", function(cmp: Component<string>) {
        subtypeCmp.value(cmp.value())
    })
    

    entry.find("display_custom").on("click", function() {
        entry.find("custom_row").show()
        entry.find("predef_row").hide()
    })

    entry.find("display_predef").on("click", function() {
        entry.find("custom_row").hide()
        entry.find("predef_row").show()
        entry.find("talent_desc").value(Tables.get("talents").get(talentVal()).description)
        entry.find("talent_name").value(Tables.get("talents").get(talentVal()).name)
        talentVal.set(talentVal())
    })
}

export const onTalentDelete = function(entryId: string) {
    // Gestion encombrement
    const allTalents = talentsByEntry()
    delete allTalents[entryId]
    talentsByEntry.set(allTalents)
}