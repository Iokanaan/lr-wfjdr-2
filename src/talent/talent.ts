import { setupRepeater } from "../utils/repeaters"

export const setupTalentRepeater = function(sheet: Sheet<unknown>) {
    const repeater = sheet.get("talent_repeater") as Component<Record<string, unknown>>
    setupRepeater(repeater, setupTalentEditEntry)
    
    repeater.on("click", "talent_display", function(cmp: Component<unknown>) {
        const entry = repeater.find(cmp.index())
        const desc = entry.find("talent_desc_col")
        if(desc.visible()) {
            desc.hide()
        } else {
            desc.show()
        }
    })
}

const setupTalentEditEntry = function(entry: Component<unknown>) {
    entry.find("desc_talent").text(Tables.get("talents").get((entry.find("nom_talent") as Component<string>).value()).description)
    entry.find("desc_talent_input").value(Tables.get("talents").get((entry.find("nom_talent") as Component<string>).value()).description)
    entry.find("talent_name").value(Tables.get("talents").get((entry.find("nom_talent") as Component<string>).value()).name)

    const choices_armes: Record<string, string> = {}
    Tables.get("groupe_armes").each(function(val) {
        choices_armes[val.name] = val.name  
    })

    const choices_magie: Record<string, string> = {}
    Tables.get("magies_communes").each(function(val) {
        choices_magie[val.name] = val.name  
    })

    const choices_science: Record<string, string> = {}
    Tables.get("domaines_occultes").each(function(val) {
        choices_science[val.name] = val.name  
    })

    const choices_sombre: Record<string, string> = {}
    Tables.get("sombres_savoirs").each(function(val) {
        choices_sombre[val.name] = val.name  
    })


    const choices_divin: Record<string, string> = {}
    Tables.get("domaines_divins").each(function(val) {
        choices_divin[val.name] = val.name  
    })

    const choices_mineure: Record<string, string> = {}
    Tables.get("magie_mineure").each(function(val) {
        choices_mineure[val.name] = val.name  
    })

    const subtypeChoiceCmp = entry.find("subtype_choice") as ChoiceComponent

    switch(entry.find("nom_talent").value()) {
        case "maitrise":
            subtypeChoiceCmp.setChoices(choices_armes)
            subtypeChoiceCmp.value(entry.find("talent_subtype").value())
            subtypeChoiceCmp.show()
            break
        case "magie_commune":
            subtypeChoiceCmp.setChoices(choices_magie)
            subtypeChoiceCmp.value(entry.find("talent_subtype").value())
            subtypeChoiceCmp.show()
            break
        case "science_de_la_magie":
            subtypeChoiceCmp.setChoices(choices_science)
            subtypeChoiceCmp.value(entry.find("talent_subtype").value())
            subtypeChoiceCmp.show()
            break
        case "sombre_savoir":
            subtypeChoiceCmp.setChoices(choices_sombre)
            subtypeChoiceCmp.value(entry.find("talent_subtype").value())
            subtypeChoiceCmp.show()
            break
        case "inspiration_divine":
            subtypeChoiceCmp.setChoices(choices_divin)
            subtypeChoiceCmp.value(entry.find("talent_subtype").value())
            subtypeChoiceCmp.show()
            break
        case "magie_mineure":
            subtypeChoiceCmp.setChoices(choices_mineure)
            subtypeChoiceCmp.value(entry.find("talent_subtype").value())
            subtypeChoiceCmp.show()
            break
        default:
            subtypeChoiceCmp.setChoices({})
            subtypeChoiceCmp.value(null)
            subtypeChoiceCmp.value(null)
            subtypeChoiceCmp.hide()
            break
    }

    entry.find("nom_talent").on("update", function(cmp: Component<string>) {
        entry.find("desc_talent").text(Tables.get("talents").get(cmp.value()).description)
        entry.find("desc_talent_input").value(Tables.get("talents").get(cmp.value()).description)
        entry.find("talent_name").value(Tables.get("talents").get(cmp.value()).name)
        switch(cmp.value()) {
            case "maitrise":
                subtypeChoiceCmp.setChoices(choices_armes)
                subtypeChoiceCmp.value(Object.keys(choices_armes)[0])
                entry.find("talent_subtype").value(Object.values(choices_armes)[0])
                subtypeChoiceCmp.show()
                break
            case "magie_commune":
                subtypeChoiceCmp.setChoices(choices_magie)
                subtypeChoiceCmp.value(Object.keys(choices_magie)[0])
                entry.find("talent_subtype").value(Object.values(choices_magie)[0])
                subtypeChoiceCmp.show()
                break
            case "science_de_la_magie":
                subtypeChoiceCmp.setChoices(choices_science)
                subtypeChoiceCmp.value(Object.keys(choices_science)[0])
                entry.find("talent_subtype").value(Object.values(choices_science)[0])
                subtypeChoiceCmp.show()
                break
            case "sombre_savoir":
                subtypeChoiceCmp.setChoices(choices_sombre)
                subtypeChoiceCmp.value(Object.keys(choices_sombre)[0])
                entry.find("talent_subtype").value(Object.values(choices_sombre)[0])
                subtypeChoiceCmp.show()
                break
            case "inspiration_divine":
                subtypeChoiceCmp.setChoices(choices_divin)
                subtypeChoiceCmp.value(Object.keys(choices_divin)[0])
                entry.find("talent_subtype").value(Object.values(choices_divin)[0])
                subtypeChoiceCmp.show()
                break
            case "magie_mineure":
                subtypeChoiceCmp.setChoices(choices_mineure)
                subtypeChoiceCmp.value(Object.keys(choices_mineure)[0])
                entry.find("talent_subtype").value(Object.values(choices_mineure)[0])
                subtypeChoiceCmp.show()
                break
            default:
                subtypeChoiceCmp.setChoices({})
                entry.find("talent_subtype").value(null)
                subtypeChoiceCmp.hide()
                break
        }
    })

    
    subtypeChoiceCmp.on("update", function(cmp: Component<string>) {
        entry.find("talent_subtype").value(cmp.value())
    })
    
}


export const hideTalentDescription = function(entry: Component<unknown>) {
    entry.find("talent_desc_col").hide()
}