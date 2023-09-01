export const setupCarrierEditEntry = function(entry: Component) { 
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
}

export const setupFolieViewEntry = function(entry: Component) {
    
    // Affichage de la description au click sur le livre
    entry.find("display_desc").on("click", function() {
        const desc = entry.find("folie_desc_col")
        if(desc.visible()) {
            desc.hide()
        } else {
            desc.show()
        }
    })

    // Binding de la folie
    Bindings.add(entry.value().nom_folie, "bind_folie", "FolieDisplay", function() {
        return entry.value()
    })
    entry.find("bind_folie").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().nom_folie)
    })
}