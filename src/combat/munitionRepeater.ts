import { computed, signal } from "../utils/utils"

export const setupMunitionViewEntry = function(wSheet: WarhammerSheet) {
    return function(entry: Component<Munition>) {
        // Gestion de l'encombrement
        const qte = signal(entry.value().qte_mun)
        const drop = signal(entry.find("left_behind").value() as boolean)
    
        computed(function() {
            const encombrement = wSheet.encombrementRecord()
            encombrement[entry.id()] = drop() ? 0 : (entry.value().encombrement * qte() * getQualityCoeff(entry.value().qualite)) / 5
            wSheet.encombrementRecord.set(encombrement)
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

export const onMunitionDelete = function(wSheet: WarhammerSheet) {
    return function(entryId: string) {
        // Gestion encombrement
        const encombrement = wSheet.encombrementRecord()
        delete encombrement[entryId]
        wSheet.encombrementRecord.set(encombrement)
    }
}

export const setupBadMunitionListener = function(wSheet: WarhammerSheet) {

    const badMunitions = signal(wSheet.find("bad_munition").value())

    computed(function() {
        if(badMunitions()) {
            wSheet.find("toggle_on_munitions").show()
            wSheet.find("toggle_off_munitions").hide()
        } else {
            wSheet.find("toggle_on_munitions").hide()
            wSheet.find("toggle_off_munitions").show()
        }
    }, [badMunitions])

    wSheet.find("toggle_on_munitions").on("click", function() {
        wSheet.find("bad_munition").value(false)
    })

    wSheet.find("toggle_off_munitions").on("click", function() {
        wSheet.find("bad_munition").value(true)
    })

    wSheet.find("bad_munition").on("update", function(cmp) {
        badMunitions.set(cmp.value())
    })
}