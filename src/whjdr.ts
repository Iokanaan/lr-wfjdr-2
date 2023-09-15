import { setupArmorEditEntry, setupArmorRepeater, setupArmorViewEntry } from "./combat/armorRepeater";
import { setupCarrierEditEntry, setupFolieViewEntry } from "./bio/bio";
import { globalSheets } from "./globals";
import { setCarrierInfoListener } from "./help/carriers";
import { checkEncombrement, setBlessuresListener, setClassEditor, setInitiativeListener, setRaceEditor, setSleepListener, setupGold } from "./leftPane/leftPane";
import { displayMagieMalus, setupMagicEditEntry, setupMagicViewEntry, setupSpellDamage } from "./magic/magic";
import { setupRituelViewEntry } from "./magic/rituels";
import { setupRuneEditEntry, setupRuneViewEntry } from "./magic/runes";
import { rollResultHandler } from "./roll/rollHandler";
import { onSkillDelete, setupBasicSkill, setupSkillEditEntry, setupSkillViewEntry } from "./skills/skills";
import { setBStatListener, setBonuses, setMSignal, setMagSignal, setPDStatListener, setStatListeners } from "./stats/stats";
import { onTalentDelete, setupTalentEditEntry, setupTalentViewEntry } from "./talent/talent";
import { reset, setupRepeater } from "./utils/repeaters";
import { hideDescriptions } from "./utils/utils";
import { setArmeImpro, setMunitionListener, setPugilat } from "./combat/weaponBasics";
import { onWeaponDelete, setupWeaponCraftSheet, setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/weaponRepeater";
import { onItemDelete, setupItemCraftSheet, setupItemEditEntry, setupItemViewEntry } from "./items/items";
import { onMunitionDelete, setupBadMunitionListener, setupMunitionEditEntry, setupMunitionViewEntry } from "./combat/munitionRepeater";
import { armorCraftSheet, warhammerSheet } from "./warhammerSheet";


/*
manque capitaine
getBarAttriutes
bug bonus bf / dégats armes
*/




// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        
        try {
            if(sheet.getData()["race"] === undefined || sheet.getData()["custom_race"] === "") {
                sheet.setData({"race":"Humain", "custom_race":"Humain"})
            }

            if(sheet.getData()["class"] === undefined || sheet.getData()["custom_race"] === "") {
                sheet.setData({"class":"agitateur", "custom_class":"Agitateur"})
            }
            if(sheet.getData()["visibility"] === undefined) {
                sheet.setData({"visibiliy":"visible"})
            }
        } catch(e) {
            log("Error set default race/class")
        }
        // Set sheet in global array
        const wSheet = warhammerSheet(sheet)
        globalSheets[sheet.getSheetId()] = wSheet

        try {
            // Stats
            Tables.get("stats").each(function(stat: StatObject) {
                setStatListeners(wSheet, stat.id)
            })
            setBonuses(wSheet)
            setMagSignal(wSheet)
            setMSignal(wSheet)
            setBStatListener(wSheet)
            setPDStatListener(wSheet)
        } catch(e) {
            log("Error initializing stats")
        }
        try {
            // Skills
            Tables.get("skills_basic").each(function(skill) {
                setupBasicSkill(wSheet, skill)
            })
            setupRepeater(wSheet, "skill_repeater", setupSkillEditEntry, setupSkillViewEntry(wSheet), onSkillDelete(wSheet))
        } catch(e) {
            log("Error initializing skills")
        }

        try {
            // Talents
            setupRepeater(wSheet, "talent_repeater", setupTalentEditEntry, setupTalentViewEntry(wSheet), onTalentDelete(wSheet))
            hideDescriptions(wSheet.find("talent_repeater") as Component<Record<string, unknown>>, "talent_desc_col")
        
        } catch(e) {
            log("Error initializing talents")
        }

        try {
            // Armes
            setupBadMunitionListener(wSheet)
            setupRepeater(wSheet, "weapons_repeater", setupWeaponEditEntry, setupWeaponViewEntry(wSheet), onWeaponDelete(wSheet))
            setPugilat(wSheet)
            setArmeImpro(wSheet, "CC")
            setArmeImpro(wSheet, "CT")
            setMunitionListener(wSheet)           
        } catch(e) {
            log("Error initializing weapons")
        }
        try {
            setupRepeater(wSheet, "munition_repeater", setupMunitionEditEntry, setupMunitionViewEntry(wSheet), onMunitionDelete(wSheet))
        } catch(e) {
            log("Error initializing munitions")
        }

        try {
            // Armure
            setupArmorRepeater(wSheet)
            //sheet.get("BE_reminder").text("BE : " + sheet.get("BE").text())
        } catch(e) {
            log("Error initializing armors")
        }

        try {
            // Volet gauche
            setupGold(wSheet)
            checkEncombrement(wSheet)
            setSleepListener(wSheet)
            setRaceEditor(wSheet)
            setClassEditor(wSheet)
            setInitiativeListener(wSheet)
            setBlessuresListener(wSheet)
        } catch(e) {
            log("Error intializing left pane")
        }

        try {
            //Magie
            displayMagieMalus(wSheet)
            setupRepeater(wSheet, "magic_repeater", setupMagicEditEntry, setupMagicViewEntry(wSheet), null)
            hideDescriptions(wSheet.find("magic_repeater") as Component<Record<string, unknown>>, "magic_desc_col")
            setupRepeater(wSheet, "rune_repeater", setupRuneEditEntry("runes"), setupRuneViewEntry, null)
            setupRepeater(wSheet, "rune_majeur_repeater", setupRuneEditEntry("runes_majeures"), setupRuneViewEntry, null)
            hideDescriptions(wSheet.find("rune_repeater") as Component<Record<string, unknown>>, "desc_col")
            hideDescriptions(wSheet.find("rune_majeur_repeater") as Component<Record<string, unknown>>, "desc_col")
            setupRepeater(wSheet, "rituel_repeater", null, setupRituelViewEntry(wSheet), null)
            setupSpellDamage(wSheet)
        } catch(e) {
            log("Error initializing magic")
        }

        // Inventaire
        try {
            setupRepeater(wSheet, "item_repeater", setupItemEditEntry, setupItemViewEntry(wSheet), onItemDelete(wSheet))
        } catch(e) {
            log("Error initializing items")
        }

        // Bio
        try {
            setupRepeater(wSheet, 'carrier_repeater', setupCarrierEditEntry, null, null)
            setupRepeater(wSheet, "folie_repeater", null, setupFolieViewEntry, null)
            hideDescriptions(wSheet.find("folie_repeater") as Component<Record<string, unknown>>, "folie_desc_col")
        } catch(e) {
            log("Error initializing bio")
        }

        try {
            setCarrierInfoListener(wSheet)
        } catch(e) {
            log("Error initializing help")
        }

        log("Initialization of sheet complete")

    }

    if(sheet.id() === "ItemCraft") {
        if(sheet.get("qualite_item").value() === "Moyenne") {
            sheet.get("qualite_item").value("Moyenne")
        }
        setupItemCraftSheet(sheet)

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
        if(sheet.getData().bonus_bf === undefined) {
            sheet.get("bonus_bf").value(false)
        }
        if(sheet.getData().bonus_bf_as_int === undefined) {
            sheet.get("bonus_bf_as_int").value(Number(sheet.get("bonus_bf").value()))
        }
        if(sheet.get("use_powder").value() === false) {
            sheet.get("use_powder").value(false)
        }

        setupWeaponCraftSheet(sheet)
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
    
        setupArmorEdit(armorCraftSheet(sheet).find("couverture_input"))
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
    const wSheet = globalSheets[to.getSheetId()]
    if (from.id() === "ItemCraft" && to.id() === "main") {
        reset(wSheet, "item_repeater", setupItemEditEntry, setupItemViewEntry(wSheet))
        return "item_repeater"; 
    }
    if (from.id() === "WeaponCraft" && to.id() === "main") {
        reset(wSheet, "weapons_repeater", setupWeaponEditEntry, setupWeaponViewEntry(wSheet))
        return "weapons_repeater"
    }
    if (from.id() === "ArmorCraft" && to.id() === "main") {
        reset(wSheet, "armor_repeater", setupArmorEditEntry, setupArmorViewEntry(wSheet))
        return "armor_repeater"
    }
    if (from.id() === "RituelCraft" && to.id() === "main") {
        reset(wSheet, "rituel_repeater", null, setupRituelViewEntry(wSheet))
        return "rituel_repeater"
    }
}