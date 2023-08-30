import { signals } from "../globals"
import { roll } from "../roll/rollHandler"
import { setupRepeater2 } from "../utils/repeaters"
import { computed, intToWord } from "../utils/utils"

export const setupWeaponRepeater = function(sheet: Sheet) {
    setupRepeater2(sheet.get("weapons_repeater"), setupWeaponEditEntry, setupWeaponViewEntry)
}

export const setupWeaponViewEntry = function(entry: Component<WeaponData>) {

    sanitizeData(entry)

    const damageBonus = computed(function() {
        return entry.value().bonus_bf ? entry.value().degats + (signals["BF"]()) : entry.value().degats
    }, [signals["BF"]])
    entry.find("weapon_name").on("click", function(cmp: Component) {
        const targetStat = entry.value().type_arme === "1" ? "CC" : "CT"
        let target = signals[targetStat]()
        if(entry.value().qualite === "Exceptionnelle") {
            target += 5
        }
        if(entry.value().qualite === "Médiocre") {
            target -= 5
        }
        const ammoQuality = entry.sheet().get("munition_quality").value()
        if(ammoQuality === "Exceptionnelle" && entry.value().type_munition !== "0") {
            target += 5
        }
        if(ammoQuality === "Médiocre" && entry.value().type_munition !== "0") {
            target -= 5
        }

        roll(entry.sheet(), cmp.text(), target, ["attack, damage_" + intToWord(damageBonus())])
    })
    Bindings.add(entry.value().nom_arme, "bind_weapon", "WeaponDisplay", function() {
        return {
            "nom_arme": entry.value().nom_arme,
            "groupe_arme": entry.value().groupe_arme,
            "type_arme_as_int": entry.value().type_arme_as_int, 
            "portee_courte": entry.value().portee_courte, 
            "portee_longue": entry.value().portee_longue,
            "bonus_bf_as_int": entry.value().bonus_bf_as_int,
            "degats": entry.value().degats,
            "attributs": entry.value().attributs,
            "qualite": entry.value().qualite,
            "notes": entry.value().notes
        } 
    })
    entry.find("bind_weapon").on("click", function() {
        Bindings.send(entry.sheet(), entry.value().nom_arme)
    })

}

export const setupWeaponEditEntry = function(entry: Component<WeaponData>) {

    presetData(entry)

    const typeArmeInput = entry.find("type_arme")
    const distanceRow = entry.find("distance_row")
    if(typeArmeInput.value() !== "1") {
        distanceRow.show()
    } else {
        distanceRow.hide()
    }
    entry.find("type_arme").on("update", function(cmp: Component<string>) {
        if(typeArmeInput.value() !== "1") {
            distanceRow.show()
        } else {
            distanceRow.hide()
        }
        entry.find("type_arme_as_int").value(parseInt(cmp.value()))
    })

    entry.find("bonus_bf").on("update", function(cmp: Component<boolean>) { 
        entry.find("bonus_bf_as_int").value(Number(cmp.value())) 
    })

    entry.find("demi").on("click", function() {
        entry.find("rechargement").value("½")
    })

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
        entryData.bonus_bf_as_int = Number(entryData.bonus_bf) 
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
    if(entry.value().groupe_arme === undefined) {
        entry.find("groupe_arme").value("-")
    }
}