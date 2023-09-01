import { rollMagic } from "../roll/rollHandler"
import { computed, signal } from "../utils/utils"

export const setupRuneViewEntry = function(entry: Component) {

    // Lancer de dé au click sur le label
    entry.find("rune_nom").on("click", function(component: Component<unknown>) {
        rollMagic(entry.sheet(), component.text(), parseInt(entry.sheet().get("Mag").text()), entry.value().rune_difficulte, ["rune"])
    })

    // Affichage de la description au click sur le livre
    entry.find("display_desc").on("click", function() {
        if(entry.find("desc_col").visible()) {
            entry.find("desc_col").hide()
        } else {
            entry.find("desc_col").show()
        }
    })

    // Binding de la rune
    Bindings.add(entry.value().rune_name, "bind_rune", "RuneDisplay", function() {
        return entry.value()   
    })
    entry.find("bind_rune").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().rune_name)
    })
}

export const setupRuneEditEntry = function(tableName: string): (entry: Component) => void {
    return function(entry: Component) {
        const rune = signal(entry.find("rune_choice").value())

        // On met à jour les champs du formulaire au changement du rune
        computed(function() {
            const runeData = Tables.get(tableName).get(rune())
            entry.find("rune_name").value(runeData.name)
            entry.find("rune_difficulte").value(runeData.difficulte)
            entry.find("rune_activation").value(runeData.activation)
            entry.find("rune_permanente").value(runeData.permanente)
            entry.find("rune_temp").value(runeData.temp)
        }, [rune])
            
        // Set la nouvelle rune à l'update
        entry.find("rune_choice").on("update", function(cmp) {
            rune.set(cmp.value())
        })

        // Switch avec le mode custom
        entry.find("custom_rune").on("click", function() {
            if(entry.find("rune_choice").visible()) {
                entry.find("rune_choice").hide()
                entry.find("custom_row").show()
            } else {
                entry.find("rune_choice").show()
                entry.find("custom_row").hide()
                // Pour reset les champs du formulaire avec ceux de la rune en mémoire
                entry.find("rune_choice").value(rune())
            }
        })
    }
}