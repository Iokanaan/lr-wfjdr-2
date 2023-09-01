import { setupArmorRepeater, setArmorSchema } from "./armor/armorRepeater";
import { setupCarrierRepeater, setupFolieRepeater } from "./bio/bio";
import { globalSheets } from "./globals";
import { checkEncombrement, setBlessuresListener, setClassEditor, setInitiativeListener, setMaxEncombrement, setRaceEditor, setSleepListener } from "./leftPane/leftPane";
import { hideDescription, setupMagicRepeater } from "./magic/magic";
import { setupRuneRepeaters } from "./magic/runes";
import { rollResultHandler } from "./roll/rollHandler";
import { setupBasicSkill, setupSkillEditEntry, setupSkillViewEntry } from "./skills/skills";
import { setBStatListener, setBonuses, setStatListeners } from "./stats/stats";
import { hideTalentDescription, setupTalentRepeater } from "./talent/talent";
import { setupRepeater } from "./utils/repeaters";
import { setArmeImpro, setMunitionListener, setPugilat } from "./weapons/weaponBasics";
import { setupWeaponRepeater } from "./weapons/weaponRepeater";


/*
rituels
encombrement
talents application
Icones bizarre
bug drop craft
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
            })
            setBonuses(sheet)
            setBStatListener(sheet)
        } catch(e) {
            log("Error initializing stats")
        }
        try {
            // Skills
            Tables.get("skills_basic").each(function(skill) {
                setupBasicSkill(sheet, skill)
            })
            setupRepeater(sheet.get("skill_repeater"), setupSkillEditEntry, setupSkillViewEntry)
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

        try {
            // Volet gauche
            setMaxEncombrement(sheet)
            checkEncombrement(sheet)
            setSleepListener(sheet)
            setRaceEditor(sheet)
            setClassEditor(sheet)
            setInitiativeListener(sheet)
            setBlessuresListener(sheet)
        } catch(e) {
            log("Error intializing left pane")
        }

        try {
            //Magie
            setupMagicRepeater(sheet)
            each((sheet.get("magic_repeater") as Component<Record<string, Spell>>).value(), function(_, entryId) {
                hideDescription(sheet.get("magic_repeater").find(entryId), "magic_desc_col")
            })
            setupRuneRepeaters(sheet)
            each((sheet.get("rune_repeater") as Component<Record<string, unknown>>).value(), function(_, entryId) {
                hideDescription(sheet.get("rune_repeater").find(entryId), "desc_col")
            })
            each((sheet.get("rune_majeur_repeater") as Component<Record<string, unknown>>).value(), function(_, entryId) {
                hideDescription(sheet.get("rune_majeur_repeater").find(entryId), "desc_col")
            })
        } catch(e) {
            log("Error initializing magic")
        }

        // Bio
        try {
            setupCarrierRepeater(sheet)
            setupFolieRepeater(sheet)
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