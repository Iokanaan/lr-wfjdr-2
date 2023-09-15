import { computed, signal } from "../utils/utils"

export const setupItemViewEntry = function(whSheet: WarhammerSheet) {
    return function(entry: Component<Item>) {
        // Gestion de l'encombrement
        const qte = signal(entry.value().qte_item)
        const drop = signal(entry.find("left_behind").value() as boolean)

        computed(function() {
            const encombrement = whSheet.encombrementRecord()
            encombrement[entry.id()] = drop() ? 0 : entry.value().enc_item * qte()
            whSheet.encombrementRecord.set(encombrement)
        }, [qte, drop])

        // Signaler le changement de quantité pour l'encombrement
        entry.find("qte_item").on("update", function(cmp: Component<number>) {
            qte.set(cmp.value())
        })

        // Gestion de la mise de côté de l'objet
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
}

export const setupItemEditEntry = function(entry: Component<Item>) {
    // Forcer la persistence si  valeur undefined
    if(entry.value().qte_item === undefined) {
        entry.find("qte_item").value(1)
    }
    setupItemEdit(entry.find)
}

export const setupItemCraftSheet = function(sheet: Sheet<Item>) {
    // Forcer la persistence si  valeur undefined
    if(sheet.getData().qte_item === undefined) {
        sheet.get("qte_item").value(1)
    }
    setupItemEdit(sheet.get)
}

const setupItemEdit = function(get: (s: string) => Component) {
    get("qualite_item").on("update", function(cmp) {
        if(cmp.value() === "Moyenne") {
            get("non_standard_quality").value(0)
        } else {
            get("non_standard_quality").value(1)
        }
    })
}

export const onItemDelete = function(whSheet: WarhammerSheet) {
    return function(entryId: string) {
        // Gestion encombrement
        const encombrement = whSheet.encombrementRecord()
        delete encombrement[entryId]
        whSheet.encombrementRecord.set(encombrement)
    }
}