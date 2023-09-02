import { rollMagic } from "../roll/rollHandler"

export const setupRituelViewEntry = function(entry: Component) {

    // Gestion du lancer du rituel
    entry.find("rituel_label").on("click", function(cmp: Component) {
        // Difficulte par défaut à 0
        if(entry.value().rituel_difficulte === undefined) {
            entry.value().rituel_difficulte = 0
        }

        // Détermination du niveau de lancer
        let castLevel = entry.sheet().get("cast_rituel_level").value() as number
        if(castLevel === null) {
            castLevel = parseInt(entry.sheet().get("Mag").text()) as number
        }

        // Jet de dés
        rollMagic(entry.sheet(), cmp.text(), castLevel, entry.value().rituel_difficulte, [])
    })

    // Binding
    Bindings.add(entry.value().rituel_name, "bind_rituel", "RituelDisplay", function() {
        return entry.value()
    })
    entry.find("bind_rituel").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().rituel_name)
    })
}