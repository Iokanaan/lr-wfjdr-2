import { encombrementRecord } from "../globals"
import { computed, signal } from "../utils/utils"

export const setupItemViewEntry = function(entry: Component<Item>) {
    // Gestion de l'encombrement
    const qte = signal(entry.value().qte_item)
    const drop = signal(entry.find("left_behind").value() as boolean)

    computed(function() {
        const encombrement = encombrementRecord()
        encombrement[entry.id()] = drop() ? 0 : entry.value().enc_item * qte()
        encombrementRecord.set(encombrement)
    }, [qte, drop])

    // Signaler le changement de quantité pour l'encombrement
    entry.find("qte_item").on("update", function(cmp: Component<number>) {
        qte.set(cmp.value())
    })

    computed(function() {
        if(drop()) {
            entry.find("toggle_on").hide()
            entry.find("toggle_off").show()
            entry.find("main_row").addClass("opacity-50")
            entry.find("notes_row").addClass("opacity-50")
        } else {
            entry.find("toggle_on").show()
            entry.find("toggle_off").hide()
            entry.find("main_row").removeClass("opacity-50")
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