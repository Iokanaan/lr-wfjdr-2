import { setupArmorRepeater, setArmorSchema } from "./armor/armorRepeater";
import { globalSheets } from "./globals";
import { checkEncombrement, setMaxEncombrement } from "./leftPane/leftPane";
import { rollResultHandler } from "./roll/rollHandler";
import { setSkillListeners, setSkillValue, setupSkillRepeater } from "./skills/skills";
import { setBeListeners, setStatListeners } from "./stats/stats";
import { setArmeImpro, setPugilat } from "./weapons/weaponBasics";
import { setupWeaponRepeater } from "./weapons/weaponRepeater";

/**
 * TODO
 * Magie
 * Repeater objets
 * Repeater comp
 * Monstres
 * Weapon / object / armor crafter
 * Encombrement
 */


// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {

        // Set sheet in global array
        globalSheets[sheet.getSheetId()] = sheet

        // Stats
        Tables.get("stats").each(function(stat: StatObject) {
            setStatListeners(sheet, stat.id)
            setBeListeners(sheet)
        })

        // Skills
        Tables.get("skills_basic").each(function(skill) {
            setSkillValue(sheet, skill)
            setSkillListeners(sheet, skill)
        })
        setupSkillRepeater(sheet)

        // Armes
        setupWeaponRepeater(sheet)
        setPugilat(sheet)
        setArmeImpro(sheet, "CC")
        setArmeImpro(sheet, "CT")

        // Armure
        setupArmorRepeater(sheet)
        setArmorSchema(sheet, sheet.get("armor_repeater") as Component<Record<string, ArmorData>>)

        // Volet gauche
        setMaxEncombrement(sheet)
        checkEncombrement(sheet)
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