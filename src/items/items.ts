import { encombrementRecord } from "../globals"
import { computed, signal } from "../utils/utils"

export const setupItemViewEntry = function(entry: Component<Item>) {
    // Gestion de l'encombrement
    log("Setup view entry")
    const qte = signal(entry.value().qte_item)
    computed(function() {
        const encombrement = encombrementRecord()
        encombrement[entry.id()] = entry.value().enc_item * qte()
        encombrementRecord.set(encombrement)
    }, [qte])

    // Signaler le changement de quantité pour l'encombrement
    entry.find("qte_item").on("update", function(cmp: Component<number>) {
        qte.set(cmp.value())
    })
}

export const setupItemEditEntry = function(entry: Component<Munition>) {
    entry.find("qualite_item").on("update", function(cmp) {
        if(cmp.value() === "Moyenne") {
            entry.find("non_standard_quality").value(0)
        } else {
            entry.find("non_standard_quality").value(1)
        }
    })
}

export const onItemDelete = function(entryId: string) {
    // Gestion encombrement
    const encombrement = encombrementRecord()
    delete encombrement[entryId]
    encombrementRecord.set(encombrement)
}