import { setupArmorRepeater } from "./combat/armorRepeater";
import { setupCarrierEditEntry, setupFolieViewEntry } from "./bio/bio";
import { globalSheets } from "./globals";
import { setCarrierInfoListener } from "./help/carriers";
import { checkEncombrement, setBlessuresListener, setClassEditor, setInitiativeListener, setRaceEditor, setSleepListener } from "./leftPane/leftPane";
import { setupMagicEditEntry, setupMagicViewEntry } from "./magic/magic";
import { setupRituelViewEntry } from "./magic/rituels";
import { setupRuneEditEntry, setupRuneViewEntry } from "./magic/runes";
import { rollResultHandler } from "./roll/rollHandler";
import { onSkillDelete, setupBasicSkill, setupSkillEditEntry, setupSkillViewEntry } from "./skills/skills";
import { setBStatListener, setBonuses, setPDStatListener, setStatListeners } from "./stats/stats";
import { onTalentDelete, setupTalentEditEntry, setupTalentViewEntry } from "./talent/talent";
import { cleanupRepeater, setupRepeater } from "./utils/repeaters";
import { computed, hideDescriptions, signal } from "./utils/utils";
import { setArmeImpro, setMunitionListener, setPugilat } from "./combat/weaponBasics";
import { onWeaponDelete, setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/weaponRepeater";
import { onItemDelete, setupItemEditEntry, setupItemViewEntry } from "./items/items";
import { onMunitionDelete, setupBadMunitionListener, setupMunitionEditEntry, setupMunitionViewEntry } from "./combat/munitionRepeater";


/*
gestion des talents
malus des armures
encombrement nain
malus encombrement
raccourcis dégats  / localisation
Icones bizarre
*/


// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        try {
            if(sheet.getData()["race"] === undefined) {
                sheet.setData({"race":"Humain"})
            }

            if(sheet.getData()["class"] === undefined) {
                sheet.setData({"class":"Agitateur"})
            }
        } catch(e) {
            log("Error set default race/class")
        }
        // Set sheet in global array
        globalSheets[sheet.getSheetId()] = sheet

        const statSignals: StatSignals = {} as any

        const encombrementRecord = signal({}) as Signal<Record<string, number>>
        const totalEncombrement = computed(function() {
            let totalEnc = 0
            each(encombrementRecord(), function(enc) {
                if(!Number.isNaN(enc) && enc !== undefined && enc !== null) {
                    totalEnc += enc
                }
            })
            return totalEnc
        }, [encombrementRecord])

        const talentsByEntry: Signal<Record<string, string>> = signal({})
        const talents = computed(function() {
            const talentSet: string[] = []
            each(talentsByEntry(), function(talent) {
                if(talentSet.indexOf(talent) === -1) {
                    talentSet.push(talent)
                }
            })
            return talentSet
        }, [talentsByEntry])

        const advancedSkillsByEntry: Signal<Record<string, SkillData>> = signal({})
        const advancedSkills = computed(function() {
            const talentSet: string[] = []
            
            each(advancedSkillsByEntry(), function(skill) {
                if(talentSet.indexOf(skill.nom_comp_label) === -1) {
                    talentSet.push(skill.nom_comp_label)
                }
            })
            log(talentSet)
            return talentSet
        }, [advancedSkillsByEntry])
        

        try {
            // Stats
            Tables.get("stats").each(function(stat: StatObject) {
                setStatListeners(sheet, stat.id, statSignals)
            })
            setBonuses(sheet, statSignals)
            setBStatListener(sheet, statSignals)
            setPDStatListener(sheet, statSignals)
        } catch(e) {
            log("Error initializing stats")
        }
        try {
            // Skills
            Tables.get("skills_basic").each(function(skill) {
                setupBasicSkill(sheet, skill, statSignals, talents)
            })
            setupRepeater(sheet.get("skill_repeater"), setupSkillEditEntry, setupSkillViewEntry(statSignals, advancedSkillsByEntry, talents), onSkillDelete(advancedSkillsByEntry))
        } catch(e) {
            log("Error initializing skills")
        }

        try {
            // Talents
            setupRepeater(sheet.get("talent_repeater"), setupTalentEditEntry, setupTalentViewEntry(talentsByEntry), onTalentDelete(talentsByEntry))
            hideDescriptions(sheet.get("talent_repeater") as Component<Record<string, unknown>>, "talent_desc_col")
        
        } catch(e) {
            log("Error initializing talents")
        }

        try {
            // Armes
            setupBadMunitionListener(sheet)
            setupRepeater(sheet.get("weapons_repeater"), setupWeaponEditEntry, setupWeaponViewEntry(statSignals, talents, encombrementRecord), onWeaponDelete(encombrementRecord))
            setPugilat(sheet, statSignals)
            setArmeImpro(sheet, "CC", statSignals)
            setArmeImpro(sheet, "CT", statSignals)
            setMunitionListener(sheet)           
        } catch(e) {
            log("Error initializing weapons")
        }
        try {
            setupRepeater(sheet.get("munition_repeater"), setupMunitionEditEntry, setupMunitionViewEntry(encombrementRecord), onMunitionDelete(encombrementRecord))
        } catch(e) {
            log("Error initializing munitions")
        }

        try {
            // Armure
            setupArmorRepeater(sheet, talents, encombrementRecord)
            sheet.get("BE_reminder").text("BE : " + sheet.get("BE").text())
        } catch(e) {
            log("Error initializing armors")
        }

        try {
            // Volet gauche
            checkEncombrement(sheet, statSignals, totalEncombrement)
            setSleepListener(sheet, statSignals, talents)
            setRaceEditor(sheet)
            setClassEditor(sheet)
            setInitiativeListener(sheet)
            setBlessuresListener(sheet, statSignals)
        } catch(e) {
            log("Error intializing left pane")
        }

        try {
            //Magie
            setupRepeater(sheet.get("magic_repeater"), setupMagicEditEntry, setupMagicViewEntry(advancedSkills, talents), null)
            hideDescriptions(sheet.get("magic_repeater") as Component<Record<string, unknown>> , "magic_desc_col")
            setupRepeater(sheet.get("rune_repeater"), setupRuneEditEntry("runes"), setupRuneViewEntry, null)
            setupRepeater(sheet.get("rune_majeur_repeater"), setupRuneEditEntry("runes_majeures"), setupRuneViewEntry, null)
            hideDescriptions(sheet.get("rune_repeater") as Component<Record<string, unknown>>, "desc_col")
            hideDescriptions(sheet.get("rune_majeur_repeater") as Component<Record<string, unknown>>, "desc_col")
            setupRepeater(sheet.get("rituel_repeater") , null, setupRituelViewEntry, null)
        } catch(e) {
            log("Error initializing magic")
        }

        // Inventaire
        try {
            setupRepeater(sheet.get("item_repeater"), 
                          setupItemEditEntry,
                          setupItemViewEntry(encombrementRecord), 
                          onItemDelete(encombrementRecord)
                          )
        } catch(e) {
            log("Error initializing items")
        }

        // Bio
        try {
            setupRepeater(sheet.get("carrier_repeater"), setupCarrierEditEntry, null, null)
            setupRepeater(sheet.get("folie_repeater"), null, setupFolieViewEntry, null)
            hideDescriptions(sheet.get("folie_repeater") as Component<Record<string, unknown>>, "folie_desc_col")
        } catch(e) {
            log("Error initializing bio")
        }

        try {
            setCarrierInfoListener(sheet)
        } catch(e) {
            log("Error initializing help")
        }

        log("Initialization of sheet complete")

    }

    if(sheet.id() === "ItemCraft") {
        if(sheet.get("qualite_item").value() === "Moyenne") {
            sheet.get("qualite_item").value("Moyenne")
        }
    }
    if(sheet.id() === "WeaponCraft") {
        if(sheet.get("groupe_arme").value() === "-") {
            sheet.get("groupe_arme").value("-")
        }
        if(sheet.get("disponibilite").value() === "0") {
            sheet.get("disponibilite").value("0")
        }
        if(sheet.get("type_arme").value() === "1") {
            sheet.get("type_arme").value("1")
        }
        if(sheet.get("qualite").value() === "Moyenne") {
            sheet.get("qualite").value("Moyenne")
        }
        if(sheet.get("type_munition").value() === "0") {
            sheet.get("type_munition").value("0")
        }
        if((sheet.get("attributs") as ChoiceComponent<string[]>).value().length === 0) {
            sheet.get("attributs").value([])
        }
        if(sheet.get("degats").value() === undefined) {
            sheet.get("degats").value(0)
        }
        if(sheet.get("bonus_bf").value() === false) {
            sheet.get("bonus_bf").value(false)
        }
        if(sheet.get("use_powder").value() === false) {
            sheet.get("use_powder").value(false)
        }
    }

    if(sheet.id() === "ArmorCraft") {
        if(sheet.get("type_armure").value() === "-") {
            sheet.get("type_armure").value("-")
        }
        if(sheet.get("disponibilite").value() === "0") {
            sheet.get("disponibilite").value("0")
        }
        if(sheet.get("qualite_armure").value() === "Moyenne") {
            sheet.get("qualite_armure").value("Moyenne")
        }
        if((sheet.get("couverture") as ChoiceComponent<string[]>).value().length === 0) {
            sheet.get("couverture").value([])
        }
    }
}

initRoll = rollResultHandler

getCriticalHits = function(result: DiceResult) {
    return {
        "10": {
            "critical": [10],
            "fumble": [1]
        },
        "100": {
            "critical": [1],
            "fumble": [100],
            "orange": [96, 97, 98, 99]
        }
    }
}

drop = function(from, to) {
    if (from.id() === "ItemCraft" && to.id() === "main") {
        cleanupRepeater(to.get("item_repeater") as Component<Record<string, unknown>>)
        return "item_repeater"; 
    }
    if (from.id() === "WeaponCraft" && to.id() === "main") {
        cleanupRepeater(to.get("weapons_repeater") as Component<Record<string, unknown>>)
        return "weapons_repeater"
    }
    if (from.id() === "ArmorCraft" && to.id() === "main") {
        cleanupRepeater(to.get("armor_repeater") as Component<Record<string, unknown>>)
        return "armor_repeater"
    }
    if (from.id() === "RituelCraft" && to.id() === "main") {
        cleanupRepeater(to.get("rituel_repeater") as Component<Record<string, unknown>>)
        return "rituel_repeater"
    }
}
