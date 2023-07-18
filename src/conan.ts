import { setupArmorRepeater } from "./armor/armorRepeater";
import { globalSheets } from "./globals";
import { rollResultHandler } from "./roll/rollHandler";
import { setSkillListeners, setSkillValue } from "./skills/skills";
import { setBeListeners, setBfListeners, setStatListeners } from "./stats/stats";
import { setupWeaponRepeater } from "./weapons/weaponRepeater";

/**
 * TODO
 * Magie
 * Repeater Armes
 * Repeater Armure
 * Repeater objets
 * Repeater comp
 * poings / arme improvisée
 * Monstres
 * Weapon / object / armor crafter
 * Encombrement
 */


// @ts-ignore
init = function(sheet: Sheet<any>) {
    if (sheet.id() === "main") {
        globalSheets[sheet.getSheetId()] = sheet
        Tables.get("stats").each(function(stat: StatObject) {
            setStatListeners(sheet, stat.id)
            setBeListeners(sheet)
            setBfListeners(sheet)
        })
        Tables.get("skills_basic").each(function(skill) {
            setSkillValue(sheet, skill)
            setSkillListeners(sheet, skill)
        })
        setupWeaponRepeater(sheet)
        setupArmorRepeater(sheet)
    }
}

initRoll = rollResultHandler