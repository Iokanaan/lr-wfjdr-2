import { encombrementRecord } from "../globals"
import { setupRepeater } from "../utils/repeaters"
import { computed, signal } from "../utils/utils"

const allArmors = signal({} as Record<string, Record<"Tête" | "Bras" | "Corps" | "Jambes", number>>)


export const setupArmorRepeater = function(sheet: Sheet<unknown>) {
    // Calcul de l'armure total
    computed(function() {
        const totalArmor = { "Tête": 0, "Bras": 0, "Corps": 0, "Jambes": 0 }
        each(allArmors(), function(data) {
            totalArmor["Tête"] += data["Tête"]
            totalArmor["Bras"] += data["Bras"]
            totalArmor["Corps"] += data["Corps"]
            totalArmor["Jambes"] += data["Jambes"]
        })
        // Application sur le schéma
        setArmorSchema(sheet, totalArmor)
    }, [allArmors])

    // Initialisation du repeater
    setupRepeater(sheet.get("armor_repeater"), null, setupArmorViewEntry, onDelete)
}

// Ajout d'une pièce d'armure au total à sa création
const setupArmorViewEntry = function(entry: Component<ArmorData>) {

    // Gestion armure
    const newArmor = allArmors()
    newArmor[entry.id()] = readArmor(entry.value() as ArmorData)
    allArmors.set(newArmor)

    // Gestion encombrement
    const encombrement = encombrementRecord()
    encombrement[entry.id()] = entry.value().enc_armure * getQualityCoeff(entry.value().qualite_armure)
    encombrementRecord.set(encombrement)
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
const onDelete = function(entryId: string) {

    // Gestion armure
    const newArmor = allArmors()
    delete newArmor[entryId]
    allArmors.set(newArmor)

    // Gestion encombrement
    const encombrement = encombrementRecord()
    delete encombrement[entryId]
    encombrementRecord.set(encombrement)
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