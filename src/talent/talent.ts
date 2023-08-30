import { UpdateBuilder } from "firebase-functions/v1/remoteConfig"
import { setupRepeater2 } from "../utils/repeaters"
import { computed, signal } from "../utils/utils"

export const setupTalentRepeater = function(sheet: Sheet<unknown>) {
    const repeater = sheet.get("talent_repeater") as Component<Record<string, unknown>>
    setupRepeater2(repeater, setupTalentEditEntry, setupTalentViewEntry)
    
    repeater.on("click", "talent_display", function(cmp: Component) {
        const entry = repeater.find(cmp.index())
        const desc = entry.find("talent_desc_col")
        if(desc.visible()) {
            desc.hide()
        } else {
            desc.show()
        }
    })
}

const setupTalentViewEntry = function(entry: Component) {
    log(entry.value())
    Bindings.add(entry.value().talent_name, "bind_talent", "TalentDisplay", function() {
        return {
            "talent_name": entry.value().talent_name,
            "talent_subtype": entry.value().talent_subtype,
            "desc_talent_input": entry.value().desc_talent_input
        } 
    })
    entry.find("bind_talent").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().talent_name)
    })
}

const setupTalentEditEntry = function(entry: Component<unknown>) {
    entry.find("desc_talent").text(Tables.get("talents").get((entry.find("nom_talent") as Component<string>).value()).description)
    entry.find("desc_talent_input").value(Tables.get("talents").get((entry.find("nom_talent") as Component<string>).value()).description)
    entry.find("talent_name").value(Tables.get("talents").get((entry.find("nom_talent") as Component<string>).value()).name)

    const talents_choices: Record<"maitrise" | "magie_commune" | "science_de_la_magie" | "sombre_savoir" | "inspiration_divine" | "magie_mineure", Record<string, string>> & Record<string, undefined | Record<string,string>> = {
        "maitrise" : {},
        "magie_commune" : {},
        "science_de_la_magie" : {},
        "sombre_savoir": {},
        "inspiration_divine": {},
        "magie_mineure": {}
    }
    
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

    const subtypeChoiceCmp = entry.find("subtype_choice") as ChoiceComponent
    const talentValCmp = entry.find("nom_talent")
    const subtypeCmp = entry.find("talent_subtype") as Component<string | null>
    const talentVal = signal(entry.find("nom_talent").value())
    const talentSubtype = signal(subtypeCmp.value())
    

    computed(function() {
        const choiceList = talents_choices[talentVal()]
        if(choiceList !== undefined) {
            subtypeChoiceCmp.setChoices(choiceList)
            subtypeChoiceCmp.value()
            subtypeCmp.value(talentSubtype())
            subtypeChoiceCmp.show()
        } else {
            if(subtypeChoiceCmp.value() !== null) {
                subtypeChoiceCmp.setChoices({})
                subtypeChoiceCmp.value(null)
                subtypeCmp.value(null)
                subtypeChoiceCmp.hide()
            }
        }
    }, [talentVal, talentSubtype])
    
    entry.find("nom_talent").on("update", function(cmp: Component<string>) {
        entry.find("desc_talent").text(Tables.get("talents").get(cmp.value()).description)
        entry.find("desc_talent_input").value(Tables.get("talents").get(cmp.value()).description)
        entry.find("talent_name").value(Tables.get("talents").get(cmp.value()).name)
        talentVal.set(cmp.value())
    })

    
    subtypeChoiceCmp.on("update", function(cmp: Component<string>) {
        entry.find("talent_subtype").value(cmp.value())
        talentSubtype.set(cmp.value())
    })
    
}

export const hideTalentDescription = function(entry: Component<unknown>) {
    entry.find("talent_desc_col").hide()
}