import { computed, signal } from "../utils/utils"

export const setupMunitionViewEntry = function(encombrementRecord: Signal<Record<string, number>>) {
    return function(entry: Component<Munition>) {
        // Gestion de l'encombrement
        const qte = signal(entry.value().qte_mun)
        const drop = signal(entry.find("left_behind").value() as boolean)
    
        computed(function() {
            const encombrement = encombrementRecord()
            encombrement[entry.id()] = drop() ? 0 : (entry.value().encombrement * qte() * getQualityCoeff(entry.value().qualite)) / 5
            encombrementRecord.set(encombrement)
        }, [qte, drop])
        
        // Signaler le changement de quantité pour l'encombrement
        entry.find("qte_mun").on("update", function(cmp: Component<number>) {
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

export const onMunitionDelete = function(encombrementRecord: Signal<Record<string, number>>) {
    return function(entryId: string) {
        // Gestion encombrement
        const encombrement = encombrementRecord()
        delete encombrement[entryId]
        encombrementRecord.set(encombrement)
    }
}

export const setupBadMunitionListener = function(sheet: Sheet) {

    const badMunitions = signal(sheet.get("bad_munition").value())

    computed(function() {
        if(badMunitions()) {
            sheet.get("toggle_on_munitions").show()
            sheet.get("toggle_off_munitions").hide()
        } else {
            sheet.get("toggle_on_munitions").hide()
            sheet.get("toggle_off_munitions").show()
        }
    }, [badMunitions])

    sheet.get("toggle_on_munitions").on("click", function() {
        sheet.get("bad_munition").value(false)
    })

    sheet.get("toggle_off_munitions").on("click", function() {
        sheet.get("bad_munition").value(true)
    })

    sheet.get("bad_munition").on("update", function(cmp) {
        badMunitions.set(cmp.value())
    })
}