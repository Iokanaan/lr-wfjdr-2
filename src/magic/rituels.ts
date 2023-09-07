import { rollMagic } from "../roll/rollHandler"
import { computed } from "../utils/utils"

export const setupRituelViewEntry = function(statSignals: StatSignals, talents: Computed<string[]>, malus: Computed<number>) {
    return function(entry: Component) {

        const difficulte = computed(function() {
            let diff = entry.value().rituel_difficulte
            diff = diff === undefined ? 0 : diff
            if(talents().indexOf("meditation") !== -1) {
                diff -= statSignals["Mag"]()
            }
            diff += malus()
            return diff
        }, [malus, talents, statSignals["Mag"]])

        
        // Gestion du lancer du rituel
        entry.find("rituel_label").on("click", function(cmp: Component) {

            // Détermination du niveau de lancer
            let castLevel = entry.sheet().get("cast_rituel_level").value() as number
            if(castLevel === null) {
                castLevel = statSignals["Mag"]()
            }
    
            // Jet de dés
            rollMagic(entry.sheet(), cmp.text(), castLevel, difficulte(), [])
        })
    
        // Binding
        Bindings.add(entry.value().rituel_name, "bind_rituel", "RituelDisplay", function() {
            return entry.value()
        })
        entry.find("bind_rituel").on("click", function() {
            Bindings.send(entry.sheet(), entry.value().rituel_name)
        })
    }
}