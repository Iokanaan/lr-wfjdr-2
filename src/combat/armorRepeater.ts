import { setupRepeater } from "../utils/repeaters"
import { computed, signal } from "../utils/utils"

export const setupArmorRepeater = function(whSheet: WarhammerSheet) {
    
    // Calcul de l'armure totale
    computed(function() {
        const totalArmor = { "Tête": 0, "Bras": 0, "Corps": 0, "Jambes": 0 }
        each(whSheet.allArmors(), function(data) {
            totalArmor["Tête"] += data["Tête"]
            totalArmor["Bras"] += data["Bras"]
            totalArmor["Corps"] += data["Corps"]
            totalArmor["Jambes"] += data["Jambes"]
        })
        // Application sur le schéma
        setArmorSchema(whSheet.raw(), totalArmor)
    }, [whSheet.allArmors])
    // Initialisation du repeater
    setupRepeater(whSheet, "armor_repeater", setupArmorEditEntry as (entry: Component<any>) => void, setupArmorViewEntry(whSheet), onDelete(whSheet))
    
}

export const setupArmorEditEntry = function(elem: ArmorCraftSheet | ArmorEditEntry) {
    elem.find("couverture").on("update", function(cmp) {
        elem.find("couverture_input").value(cmp.value().join(', '))
    })
    elem.find("qualite_armure").on("update", function(cmp) {
        if(cmp.value() === "Moyenne") {
            elem.find("non_standard_quality").value(0)
        } else {
            elem.find("non_standard_quality").value(1)
        }
    })
}

// Ajout d'une pièce d'armure au total à sa création
export const setupArmorViewEntry = function(whSheet: WarhammerSheet) {
    return function(entry: Component<ArmorData>) {

        const drop = signal(entry.find("left_behind").value() as boolean)
    
        // Gestion armure
        computed(function() {
            const newArmor = whSheet.allArmors()
            newArmor[entry.id()] = drop() ? { "Tête": 0, "Bras": 0, "Corps": 0, "Jambes": 0 } : readArmor(entry.value() as ArmorData)
            whSheet.allArmors.set(newArmor)
        }, [drop])
    
        computed(function() {
            // Gestion encombrement
            const encombrement = whSheet.encombrementRecord()
            encombrement[entry.id()] = drop() || whSheet.talents().indexOf("robuste") !== -1 ? 0 : entry.value().enc_armure * getQualityCoeff(entry.value().qualite_armure)
            whSheet.encombrementRecord.set(encombrement)
        }, [drop, whSheet.talents])

        // Gestion du niveau d'armure
        computed(function() {
            const armorLevels = whSheet.armorLevelByEntry()
            armorLevels[entry.id()] = drop() ? null : entry.value().type_armure
            whSheet.armorLevelByEntry.set(armorLevels)
        }, [drop])
    
        // Gestion de la mise de côté de l'objet
        computed(function() {
            if(drop()) {
                entry.find("toggle_on").hide()
                entry.find("toggle_off").show()
                entry.find("main_row").addClass("opacity-50")
                entry.find("armor_row").addClass("opacity-50")
                entry.find("notes_row").addClass("opacity-50")
            } else {
                entry.find("toggle_on").show()
                entry.find("toggle_off").hide()
                entry.find("main_row").removeClass("opacity-50")
                entry.find("armor_row").removeClass("opacity-50")
                entry.find("notes_row").removeClass("opacity-50")
            }
        }, [drop])
    
        entry.find("toggle_on").on("click", function(cmp) {
            entry.find("left_behind").value(true)
        })
    
        entry.find("toggle_off").on("click", function(cmp) {
            entry.find("left_behind").value(false)
        })
    
        entry.find("left_behind").on("update", function(cmp) {
            drop.set(cmp.value())
        })
    }
}


const getQualityCoeff = function(quality: Quality) {
    switch(quality) {
        case "Médiocre":
            return 1.5
        case "Bonne":
            return 0.9
        case "Exceptionnelle":
            return 0.5
        default:
            return 1
    } 
}

// Supression de la pièce d'armure au delete sur le repeater
const onDelete = function(whSheet: WarhammerSheet) {
    return function(entryId: string) {

        // Gestion armure
        const newArmor = whSheet.allArmors()
        delete newArmor[entryId]
        whSheet.allArmors.set(newArmor)
    
        // Gestion encombrement
        const encombrement = whSheet.encombrementRecord()
        delete encombrement[entryId]
        whSheet.encombrementRecord.set(encombrement)

        // Gestion du niveau d'armure
        const armorLevels = whSheet.armorLevelByEntry()
        delete armorLevels[entryId]
        whSheet.armorLevelByEntry.set(armorLevels)
    }
}

// Retourne un les points d'armure de la pièce par zone
const readArmor = function(data: ArmorData): Record<"Tête" | "Bras" | "Corps" | "Jambes", number> {
    const armure = { "Tête": 0, "Bras": 0, "Corps": 0, "Jambes": 0 }
        if(data["pts_armure"] !== undefined && data["couverture"] !== undefined) {
            for(let i=0; i<data["couverture"].length; i++) {
                armure[data["couverture"][i]] += data["pts_armure"]
            }
        }
    return armure
}

// Construction du schéma d'armure sur la feuille
const setArmorSchema = function(sheet: Sheet, armor: Record<"Tête" | "Bras" | "Corps" | "Jambes", number>) {
    each(armor, function(pts, zone) {
        switch(zone) {
            case "Tête":
                sheet.get("armure_tete").text(pts.toString())
                break
            case "Bras":
                sheet.get("armure_bras_g").text(pts.toString())
                sheet.get("armure_bras_d").text(pts.toString())
                break
            case "Corps":
                sheet.get("armure_torse").text(pts.toString())
                break
            case "Jambes":
                sheet.get("armure_jambe_g").text(pts.toString())
                sheet.get("armure_jambe_d").text(pts.toString())
                break
        }
    })
}