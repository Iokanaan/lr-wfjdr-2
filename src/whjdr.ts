import { setupArmorRepeater } from "./combat/armorRepeater";
import { setupCarrierEditEntry, setupFolieViewEntry } from "./bio/bio";
import { globalSheets } from "./globals";
import { setCarrierInfoListener } from "./help/carriers";
import { checkEncombrement, setBlessuresListener, setClassEditor, setInitiativeListener, setRaceEditor, setSleepListener } from "./leftPane/leftPane";
import { setupMagicEditEntry, setupMagicViewEntry } from "./magic/magic";
import { setupRituelViewEntry } from "./magic/rituels";
import { setupRuneEditEntry, setupRuneViewEntry } from "./magic/runes";
import { rollResultHandler } from "./roll/rollHandler";
import { setupBasicSkill, setupSkillEditEntry, setupSkillViewEntry } from "./skills/skills";
import { setBStatListener, setBonuses, setStatListeners } from "./stats/stats";
import { setupTalentEditEntry, setupTalentViewEntry } from "./talent/talent";
import { cleanupRepeater, setupRepeater } from "./utils/repeaters";
import { hideDescriptions } from "./utils/utils";
import { setArmeImpro, setMunitionListener, setPugilat } from "./combat/weaponBasics";
import { onWeaponDelete, setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/weaponRepeater";
import { onItemDelete, setupItemEditEntry, setupItemViewEntry } from "./items/items";
import { onMunitionDelete, setupMunitionEditEntry, setupMunitionViewEntry } from "./combat/munitionRepeater";


/*
encombrement
talents application
Icones bizarre
revue armure
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
            setupRepeater(sheet.get("skill_repeater"), setupSkillEditEntry, setupSkillViewEntry, null)
        } catch(e) {
            log("Error initializing skills")
        }

        try {
            // Talents
            setupRepeater(sheet.get("talent_repeater"), setupTalentEditEntry, setupTalentViewEntry, null)
            hideDescriptions(sheet.get("talent_repeater") as Component<Record<string, unknown>>, "talent_desc_col")
        
        } catch(e) {
            log("Error initializing talents")
        }

        try {
            // Armes
            if(sheet.get("munition_quality").value() === null) {
                sheet.get("munition_quality").value("Moyenne")
            }
            setupRepeater(sheet.get("weapons_repeater"), setupWeaponEditEntry, setupWeaponViewEntry, onWeaponDelete)
            setPugilat(sheet)
            setArmeImpro(sheet, "CC")
            setArmeImpro(sheet, "CT")
            setMunitionListener(sheet)           
        } catch(e) {
            log("Error initializing weapons")
        }
        try {
            setupRepeater(sheet.get("munition_repeater"), setupMunitionEditEntry, setupMunitionViewEntry, onMunitionDelete)
        } catch(e) {
            log("Error initializing munitions")
        }

        try {
            // Armure
            setupArmorRepeater(sheet)
            sheet.get("BE_reminder").text("BE : " + sheet.get("BE").text())
        } catch(e) {
            log("Error initializing armors")
        }

        try {
            // Volet gauche
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
            setupRepeater(sheet.get("magic_repeater"), setupMagicEditEntry, setupMagicViewEntry, null)
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
            setupRepeater(sheet.get("item_repeater"), setupItemEditEntry, setupItemViewEntry, onItemDelete)
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
