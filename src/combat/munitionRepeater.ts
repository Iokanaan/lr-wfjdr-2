import { encombrementRecord } from "../globals"
import { computed, signal } from "../utils/utils"

export const setupMunitionViewEntry = function(entry: Component<Munition>) {
    // Gestion de l'encombrement
    const qte = signal(entry.value().qte_mun)
    computed(function() {
        const encombrement = encombrementRecord()
        encombrement[entry.id()] = Math.ceil((entry.value().encombrement * qte() * getQualityCoeff(entry.value().qualite)) / 5)
        encombrementRecord.set(encombrement)
    }, [qte])
    
    // Signaler le changement de quantité pour l'encombrement
    entry.find("qte_mun").on("update", function(cmp: Component<number>) {
        qte.set(cmp.value())
    })
}

const getQualityCoeff = function(quality: Quality) {
    if(quality === "Bonne" || quality === "Exceptionnelle") {
        return 0.9
    }
    return 1
}

export const setupMunitionEditEntry = function(entry: Component<Munition>) {
    entry.find("qualite").on("update", function(cmp) {
        if(cmp.value() === "Moyenne") {
            entry.find("non_standard_quality").value(0)
        } else {
            entry.find("non_standard_quality").value(1)
        }
    })
}

export const onMunitionDelete = function(entryId: string) {
    // Gestion encombrement
    const encombrement = encombrementRecord()
    delete encombrement[entryId]
    encombrementRecord.set(encombrement)
}