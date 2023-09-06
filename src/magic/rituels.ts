import { rollMagic } from "../roll/rollHandler"
import { computed } from "../utils/utils"

export const setupRituelViewEntry = function(statSignals: StatSignals, armorLevel: Computed<ArmorLevel | null>, hasBouclier: Computed<boolean>, talents: Computed<string[]>) {
    return function(entry: Component) {

        const malus = computed(function() {
            let malus = 0
            switch(armorLevel()) {
                case "Plaques":
                    malus += 5
                    break
                case "Mailles":
                    malus += 3
                    break
                case "Cuir":
                    malus += 1
                    break
                default:
            }
            if(hasBouclier()) {
                malus++
            }
            if(talents().indexOf("incantation_de_bataille") !== -1) {
                malus = Math.max(malus - 3, 0)
            }
            return malus
        }, [armorLevel, hasBouclier, talents]) 

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