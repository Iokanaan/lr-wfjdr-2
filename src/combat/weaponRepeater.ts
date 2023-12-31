import { roll } from "../roll/rollHandler"
import { computed, intToWord, signal } from "../utils/utils"



export const setupWeaponViewEntry = function(whSheet: WarhammerSheet) {
    return function(entry: WeaponDisplayEntry) {

        sanitizeData(entry)
    
        const drop = signal(entry.find("left_behind").value() as boolean)
    
        // Set du bonus de dégâts
        const damageBonus = computed(function() {
            let damage = entry.value().bonus_bf ? entry.value().degats + (whSheet.statSignals["BF"]()) : entry.value().degats
            if(whSheet.talents().indexOf("coups_puissants") !== -1 && entry.value().type_arme === "1") {
                return damage + 1
            }
            if(whSheet.talents().indexOf("tir_en_puissance") !== -1 && entry.value().type_arme === "2") {
                return damage + 1
            }
            return damage
        }, [whSheet.statSignals["BF"], whSheet.talents])
    
        // Jet d'attaque
        entry.find("weapon_name").on("click", function(cmp: Component) {
            if(!drop()) {
                const targetStat = entry.value().type_arme === "1" ? "CC" : "CT"
                let target = whSheet.statSignals[targetStat]()
    
                // Gestion du bonus de qualité
                if(entry.value().qualite === "Exceptionnelle") {
                    target += 5
                }
                if(entry.value().qualite === "Médiocre") {
                    target -= 5
                }
    
                // Gestion du malus de qualité de munition
                const munitionsMediocre = entry.sheet().get("bad_munition").value()
                if(entry.value().type_arme === "2" && munitionsMediocre && entry.value().type_munition !== "0") {
                    target -= 5
                }
    
                const tags = ["attack, damage_" + intToWord(damageBonus())]
    
                if(entry.value().attributs.indexOf("Percutante") !== -1) {
                    tags.push("percutante")
                }
    
                if(entry.value().attributs.indexOf("Épuisante") !== -1) {
                    tags.push("epuisante")
                }
    
                roll(entry.sheet(), cmp.text(), target, tags)
            }
        })
    
        // Binding
        Bindings.add(entry.value().nom_arme, "bind_weapon", "WeaponDisplay", function() {
            return entry.value()
        })
        entry.find("bind_weapon").on("click", function() {
            Bindings.send(entry.sheet(), entry.value().nom_arme)
        })
    
        // Gestion de l'encombrement
        computed(function() {
            const encombrement = whSheet.encombrementRecord()
            encombrement[entry.id()] = drop() ? 0 : entry.value().encombrement * getQualityCoeff(entry.value().qualite)
            whSheet.encombrementRecord.set(encombrement)
        }, [drop])

        computed(function() {
            const weapons = whSheet.weaponsByEntry()
            weapons[entry.id()] = drop() ? null : entry.value()
            whSheet.weaponsByEntry.set(weapons)
        }, [drop])
    
        // Gestion de la mise de côté de l'objet
        computed(function() {
            if(drop()) {
                entry.find("toggle_on").hide()
                entry.find("toggle_off").show()
                entry.find("main_row").addClass("opacity-50")
                entry.find("degats_row").addClass("opacity-50")
                entry.find("notes_row").addClass("opacity-50")
                entry.find("weapon_name").removeClass("clickable")
            } else {
                entry.find("toggle_on").show()
                entry.find("toggle_off").hide()
                entry.find("main_row").removeClass("opacity-50")
                entry.find("degats_row").removeClass("opacity-50")
                entry.find("notes_row").removeClass("opacity-50")
                entry.find("weapon_name").addClass("clickable")
            }
        }, [drop])
    
        entry.find("toggle_on").on("click", function() {
            entry.find("left_behind").value(true)
        })
    
        entry.find("toggle_off").on("click", function() {
            entry.find("left_behind").value(false)
        })
    
        entry.find("left_behind").on("update", function(cmp) {
            drop.set(cmp.value())
        })
    
    }
}

export const setupWeaponEditEntry = function(elem: WeaponEditEntry) {

    const typeArmeInput = elem.find("type_arme")
    const distanceRow = elem.find("distance_row")
    if(typeArmeInput.value() !== "1") {
        distanceRow.show()
    } else {
        distanceRow.hide()
    }
    
    elem.find("type_arme").on("update", function(cmp) {
        if(typeArmeInput.value() !== "1") {
            distanceRow.show()
        } else {
            distanceRow.hide()
        }
        elem.find("type_arme_as_int").value(parseInt(cmp.value()) as 1 | 2)
    })

    elem.find("bonus_bf").on("update", function(cmp: Component<boolean>) { 
        elem.find("bonus_bf_as_int").value(Number(cmp.value()) as 0 | 1) 
    })

    elem.find("demi").on("click", function() {
        elem.find("rechargement").value("½")
    })

    elem.find("groupe_arme").on("update", function(cmp) {
        if(cmp.value() === "0") {
            elem.find("groupe_arme_exists").value(0)
        } else {
            elem.find("groupe_arme_exists").value(1)
        }
    })

    elem.find("qualite").on("update", function(cmp) {
        if(cmp.value() === "Moyenne") {
            elem.find("non_standard_quality").value(0)
        } else {
            elem.find("non_standard_quality").value(1)
        }
    })

    elem.find("attributs").on("update",function(cmp) {
        if(cmp.value().length === 0) {
            elem.find("has_attributes").value(0)
        } else {
            elem.find("has_attributes").value(1)
        }
        elem.find("attributes_input").value(cmp.value().join(', '))
    })
}

/*
export const setupWeaponEditEntry = function(entry: Component<WeaponData>) {
    presetData(entry)
    setupEdit(entry, entry.find)
}
*/
const getQualityCoeff = function(quality: Quality) {
    if(quality === "Bonne" || quality === "Exceptionnelle") {
        return 0.9
    }
    return 1
}


export const onWeaponDelete = function(wSheet: WarhammerSheet) {
    return function(entryId: string) {
        // Gestion encombrement
        const encombrement = wSheet.encombrementRecord()
        delete encombrement[entryId]
        wSheet.encombrementRecord.set(encombrement)

        const weapons = wSheet.weaponsByEntry()
        delete weapons[entryId]
        wSheet.weaponsByEntry.set(weapons)
    }
}

const sanitizeData = function(entry: Component<WeaponData>) {
    const entryData = entry.value()
    
    let changed = false
    
    if(entryData.type_arme === undefined) {
        entryData.type_arme = "1"    
        entryData.type_arme_as_int = parseInt(entryData.type_arme) as 1 | 2
        changed = true
    }

    if(entryData.portee_courte === undefined) {
        entryData.portee_courte = 0
        changed = true
    }

    if(entryData.portee_longue  === undefined) {
        entryData.portee_longue  = 0
        changed = true
    }

    if(entryData.type_munition === undefined) {
        entryData.type_munition = "0"
        changed = true
    }

    if(entryData.use_powder === undefined) {
        entryData.use_powder = false
        changed = true
    }

    if(entryData.rechargement === undefined) {
        entryData.rechargement = ""
        return false
    }

    if(entryData.attributs === undefined) { 
        entryData.attributs = [] 
        changed = true
    }
    if(entryData.bonus_bf === undefined) { 
        entryData.bonus_bf = false 
        changed = true
    }
    if(entryData.bonus_bf_as_int === undefined) {
        entryData.bonus_bf_as_int = Number(entryData.bonus_bf) as 0 | 1
        changed = true
    }
    if(entryData.cout === undefined) { 
        entryData.cout = 0
        changed = true
    }
    if(entryData.degats === undefined) { 
        entryData.degats = 0 
        changed = true
    }
    if(entryData.disponibilite === undefined) { 
        entryData.disponibilite = "0"
        changed = true
    }
    if(entryData.encombrement === undefined) { 
        entryData.encombrement = 0
        changed = true
    }
    if(entryData.groupe_arme === undefined) {
        entryData.groupe_arme = "-"
        changed = true
    }

    if(changed = true) {
        entry.value(entryData)
    }
}

const presetData = function(entry: Component<WeaponData>) {
    if(entry.value().type_arme === undefined) {
        entry.find("type_arme").value("1")
        entry.find("type_arme_as_int").value(1)    
    }

    if(entry.value().portee_courte === undefined) {
        entry.find("portee_courte").value(0)
    }

    if(entry.value().portee_longue === undefined) {
        entry.find("portee_longue").value(0)
    }
    
    if(entry.value().use_powder === undefined) {
        entry.find("use_powder").value(false)
    }

    if(entry.value().rechargement === undefined) {
        entry.find("rechargement").value("")
    }

    if(entry.value().attributs === undefined) {
        entry.find("attribut").value([]) 
    }
    if(entry.value().bonus_bf === undefined) { 
        entry.find("bonus_bf").value(false) 
    }
    if(entry.value().bonus_bf_as_int === undefined) {
        entry.find("bonus_bf_as_int").value(Number(entry.find("bonus_bf").value())) 
    }
    if(entry.value().cout === undefined) { 
        entry.find("cout").value(0) 
    }
    if(entry.value().degats === undefined) { 
        entry.find("degats").value(0) 
    }
    if(entry.value().disponibilite === undefined) { 
        entry.find("disponibilite").value("0")
    }
    if(entry.value().encombrement === undefined) { 
        entry.find("encombrement").value(0)
    }
}