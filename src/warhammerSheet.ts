import { computed, intToWord, signal } from "./utils/utils"

export const armorCraftSheet = function(sheet: Sheet<ArmorData>) {
    const _whSheet: ArmorCraftSheet = {} as any
    _whSheet.raw = function() { return sheet } 
    _whSheet.find = function(id: string) { return sheet.get(id) }
    _whSheet.stringId = function() { return intToWord(sheet.getSheetId())}
    return _whSheet
}

export const warhammerSheet = function(sheet: Sheet<CharData>) {

    const _whSheet: WarhammerSheet = {} as any
    _whSheet.raw = function() { return sheet } 
    _whSheet.find = function(id: string) { return sheet.get(id)}
    _whSheet.stringId = function() { return intToWord(sheet.getSheetId())}
    _whSheet.entryStates = {}
    
    // Signaux des valeurs du profil principal
    _whSheet.statSignals = {} as StatSignals

    _whSheet.race = signal(sheet.get("custom_race").value() as string)

    // Signaux d'encombrement
    _whSheet.encombrementRecord = signal({})
    _whSheet.totalEncombrement = computed(function() {
        let totalEnc = 0
        each(_whSheet.encombrementRecord(), function(enc) {
            if(!Number.isNaN(enc) && enc !== undefined && enc !== null) {
                totalEnc += enc
            }
        })
        return totalEnc
    }, [_whSheet.encombrementRecord])

    // Signaux des talents
    _whSheet.talentsByEntry = signal({})
    _whSheet.talents = computed(function() {
        const talentSet: string[] = []
        each(_whSheet.talentsByEntry(), function(talent) {
            if(talentSet.indexOf(talent) === -1) {
                talentSet.push(talent)
            }
        })
        return talentSet
    }, [_whSheet.talentsByEntry])

    // Signaux des compétences
    _whSheet.advancedSkillsByEntry = signal({})
    _whSheet.advancedSkills = computed(function() {
        const talentSet: string[] = []
        each(_whSheet.advancedSkillsByEntry(), function(skill) {
            if(talentSet.indexOf(skill.nom_comp_label) === -1) {
                talentSet.push(skill.nom_comp_label)
            }
        })
        return talentSet
    }, [_whSheet.advancedSkillsByEntry])


    // Signaux d'armure
    _whSheet.allArmors = signal({} as Record<string, Record<"Tête" | "Bras" | "Corps" | "Jambes", number>>)
    _whSheet.armorLevelByEntry = signal({})
    _whSheet.armorLevel = computed(function() {
        let maxArmor: (ArmorLevel | null)[] = [null]
        each(_whSheet.armorLevelByEntry(), function(armorLevel) {
            if(armorLevel === "Plaques") {
                maxArmor[0] = armorLevel
            } else if(armorLevel === "Mailles" && maxArmor[0] !== "Plaques") {
                maxArmor[0] = armorLevel
            } else if(armorLevel === "Cuir" && maxArmor[0] === null) {
                maxArmor[0] = armorLevel
            }
        })
        return maxArmor[0]
    }, [_whSheet.armorLevelByEntry])

    // Signaux armes pour gestion du malus de bouclier
    _whSheet.weaponsByEntry = signal({})
    const hasBouclier = computed(function() {
        let bcl = [false]
        each(_whSheet.weaponsByEntry(), function(weapon) {
            if(weapon !== null && weapon.attributs !== null && weapon.attributs.indexOf("Bouclier") !== -1) {
                bcl[0] = true
            }
        })
        return bcl[0]
    },[_whSheet.weaponsByEntry])


    // Malus d'armure pour les sorts
    _whSheet.malusArmor = computed(function() {
        let malus = 0
        switch(_whSheet.armorLevel()) {
            case "Plaques":
                malus += 5
                break
            case "Mailles":
                malus += 3
                break
            case "Cuir":
                malus += 1
                break
            default:
        }
        if(hasBouclier()) {
            malus++
        }
        if(_whSheet.talents().indexOf("incantation_de_bataille") !== -1) {
            malus = Math.max(malus - 3, 0)
        }
        return malus
    }, [_whSheet.armorLevel, hasBouclier, _whSheet.talents]) 

    return _whSheet
}