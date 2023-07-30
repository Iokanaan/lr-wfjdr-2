import { setupArmorRepeater, setArmorSchema } from "./armor/armorRepeater";
import { setupCarrierRepeater } from "./bio/bio";
import { globalSheets } from "./globals";
import { switchCarrier } from "./help/carriers";
import { checkEncombrement, setBlessuresListener, setClassEditor, setInitiativeListener, setMaxEncombrement, setRaceEditor, setSleepListener } from "./leftPane/leftPane";
import { hideMagicDescription, setupMagicRepeater } from "./magic/magic";
import { rollResultHandler } from "./roll/rollHandler";
import { setupBasicSkill, setupSkillEditEntry, setupSkillViewEntry } from "./skills/skills";
import { setBStatListener, setBeListeners, setStatListeners } from "./stats/stats";
import { hideTalentDescription, setupTalentRepeater } from "./talent/talent";
import { setupRepeater2 } from "./utils/repeaters";
import { setArmeImpro, setMunitionListener, setPugilat } from "./weapons/weaponBasics";
import { setupWeaponRepeater } from "./weapons/weaponRepeater";

/**
 * TODO
 * Magie
 * Monstres
 * Weapon / object / armor crafter
 * Encombrement calcul
 * bindings
 * drop dice
 */

/*
MAJ FORCE
Revoir les compétences
initialisation de la magie
Icones bizarre
stat avancée écrase la compétence
Bonus de force pour les dégats
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

        try {
            // Stats
            Tables.get("stats").each(function(stat: StatObject) {
                setStatListeners(sheet, stat.id)
                setBeListeners(sheet)
            })
            setBStatListener(sheet)
        } catch(e) {
            log("Error initializing stats")
        }
        try {
            // Skills
            Tables.get("skills_basic").each(function(skill) {
                setupBasicSkill(sheet, skill)
            })
            setupRepeater2(sheet.get("skill_repeater"), setupSkillEditEntry, setupSkillViewEntry)
        } catch(e) {
            log("Error initializing skills")
        }

        try {
            // Talents
            setupTalentRepeater(sheet)
            each((sheet.get("talent_repeater") as Component<Record<string, Talent>>).value(), function(_, entryId) {
                hideTalentDescription(sheet.get("talent_repeater").find(entryId))
            })
        } catch(e) {
            log("Error initializing talents")
        }

        try {
            // Armes
            if(sheet.get("munition_quality").value() === null) {
                sheet.get("munition_quality").value("Moyenne")
            }
            setupWeaponRepeater(sheet)
            setPugilat(sheet)
            setArmeImpro(sheet, "CC")
            setArmeImpro(sheet, "CT")
            setMunitionListener(sheet)           
        } catch(e) {
            log("Error initializing weapons")
        }

        try {
            // Armure
            setupArmorRepeater(sheet)
            setArmorSchema(sheet, sheet.get("armor_repeater") as Component<Record<string, ArmorData>>)
            sheet.get("BE_reminder").text("BE : " + sheet.get("BE").text())
        } catch(e) {
            log("Error initializing armors")
        }

            // Volet gauche
            setMaxEncombrement(sheet)
            checkEncombrement(sheet)
            setSleepListener(sheet)
            setRaceEditor(sheet)
            setClassEditor(sheet)
            setInitiativeListener(sheet)
            setBlessuresListener(sheet)


        try {
            //Magie
            setupMagicRepeater(sheet)
            each((sheet.get("magic_repeater") as Component<Record<string, Spell>>).value(), function(_, entryId) {
                hideMagicDescription(sheet.get("magic_repeater").find(entryId))
            })
        } catch(e) {
            log("Error initializing left pane")
        }

        // Bio
        try {
            setupCarrierRepeater(sheet)
        } catch(e) {
            log("Error initializing bio")
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
        return "item_repeater"; 
    }
    if (from.id() === "WeaponCraft" && to.id() === "main") {
        return "weapons_repeater"
    }
    if (from.id() === "ArmorCraft" && to.id() === "main") {
        return "armor_repeater"
    }
}