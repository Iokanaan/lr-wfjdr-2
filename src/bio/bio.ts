import { setupRepeater } from "../utils/repeaters"

export const setupCarrierRepeater = function(sheet: Sheet<CharData>) {
    const repeater = sheet.get("carrier_repeater")
    log("do")
    setupRepeater(repeater, function(entry: Component) { 
        log("setup_bio_repeater")
        entry.find("ancienne_carriere").on("update", function(cmp) {
            entry.find("ancienne_carriere_name").value(Tables.get("carriere").get(cmp.value()).name)
        })
        entry.find("display_custom").on("click", function() {
            if(entry.find("ancienne_carriere").visible()) {
                entry.find("ancienne_carriere").hide()
                entry.find("ancienne_carriere_name").show()
            } else  {
                entry.find("ancienne_carriere").show()
                entry.find("ancienne_carriere_name").hide()
            }
        })
    }, function() {})
}

export const setupFolieRepeater = function(sheet: Sheet) {
    const repeater = sheet.get("folie_repeater") as Component<Record<string, unknown>>
    setupRepeater(repeater, function() {}, setupFolieViewEntry(sheet))
    
}

const setupFolieViewEntry = function(sheet: Sheet) {
    return function(entry: Component) {
    
        entry.find("display_desc").on("click", function() {
            const desc = entry.find("folie_desc_col")
            if(desc.visible()) {
                desc.hide()
            } else {
                desc.show()
            }
        })

        Bindings.add(entry.value().nom_folie, "bind_folie", "FolieDisplay", function() {
            return { 
                "nom_folie": entry.value().nom_folie,
                "desc_folie": entry.value().desc_folie
            }
        })

        entry.find("bind_folie").on("click", function() {
            Bindings.send(entry.sheet(), entry.value().nom_folie)
        })
    }

}

export const hideFolieDescription = function(entry: Component) {
    entry.find("folie_desc_col").hide()
}